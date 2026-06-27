import { useEffect, useRef } from "react";

/**
 * WarpField — a true 3D, crypto-themed animated background (WebGL).
 *
 * A structured 3D lattice of nodes (a settlement / liquidity network) wired by
 * crisp edges, with bright "packets" — transactions settling — streaming along
 * the edges. The whole volume slowly auto-orbits so depth and parallax read as
 * genuinely three-dimensional. Rendered as a fixed, full-viewport,
 * pointer-events-none backdrop behind the page content.
 *
 * Why WebGL / why this shape:
 *  - The scene lives in a resolution-independent 3D volume. A viewport resize
 *    only updates the GL viewport + projection aspect — geometry is NEVER
 *    regenerated. This structurally eliminates the previous mobile bug where
 *    scrolling (which fires `resize` as the URL bar collapses) re-seeded the
 *    mesh and made it flicker/redraw.
 *  - All per-frame work lives on the GPU: geometry is uploaded once into static
 *    buffers, and every frame only updates a handful of uniforms (an MVP matrix
 *    + time). Node drift and packet travel run in the vertex shader, so the CPU
 *    does almost nothing and there are just two draw calls (lines + points).
 *  - Motion is purely time-driven, never bound to scroll position, so scrolling
 *    is free of any rendering cost.
 *
 * Stability guardrails: DPR cap, ~30fps throttle, prefers-reduced-motion (one
 * static frame), pause when the tab is hidden, WebGL context-loss recovery, and
 * a graceful no-op fallback (opaque black canvas) when WebGL is unavailable.
 */

const PURPLE: [number, number, number] = [139 / 255, 92 / 255, 246 / 255]; // #8B5CF6
const CYAN: [number, number, number] = [14 / 255, 165 / 255, 233 / 255]; // #0EA5E9

const CFG = {
  // lattice (resolution-independent 3D volume, centered on the origin)
  // Sized to over-fill the viewport AND the orbit envelope so the mesh always
  // reaches past the screen edges — no empty/black bands in the corners.
  nx: 15,
  ny: 11,
  nz: 5,
  spacing: 0.42,
  jitter: 0.07, // small, so the lattice reads as intentional — not random
  maxLink: 1.6, // connect nodes within maxLink * spacing (axis + face diagonals)
  // messages — packets travel edge-to-edge as colored comet streaks
  packetRatio: 0.2, // messages per edge — sparse & intentional, not a swarm
  packetMinSpeed: 0.05, // t units / second
  packetMaxSpeed: 0.14,
  packetTrail: 0.12, // comet tail length, as a fraction of an edge
  // look — kept dim/restrained so it reads as a serious backdrop, not "arcade"
  edgeBright: 0.32,
  nodeBright: 0.6,
  messageBright: 1.3, // moving messages are brighter so they "pop"
  nodeSize: 3.4, // base point size (px, before depth + DPR scaling)
  packetSize: 3.8, // message head size
  drift: 0.035, // node drift amplitude (world units)
  // camera
  fov: (55 * Math.PI) / 180,
  camZ: 3.4, // camera distance from the origin
  tilt: 0.4, // constant pitch (rad)
  orbitSpeed: 0.07, // yaw angular speed (rad/s) — slow + calm
  // perf
  dprCap: 2,
  fps: 30,
};

// --- tiny column-major mat4 helpers (no matrix library) ---
type M4 = number[];

function multiply(a: M4, b: M4): M4 {
  const o = new Array(16) as M4;
  for (let c = 0; c < 4; c++) {
    for (let r = 0; r < 4; r++) {
      o[c * 4 + r] =
        a[r] * b[c * 4] +
        a[4 + r] * b[c * 4 + 1] +
        a[8 + r] * b[c * 4 + 2] +
        a[12 + r] * b[c * 4 + 3];
    }
  }
  return o;
}

function perspective(fovy: number, aspect: number, near: number, far: number): M4 {
  const f = 1 / Math.tan(fovy / 2);
  const nf = 1 / (near - far);
  return [
    f / aspect, 0, 0, 0,
    0, f, 0, 0,
    0, 0, (far + near) * nf, -1,
    0, 0, 2 * far * near * nf, 0,
  ];
}

function rotationY(a: number): M4 {
  const c = Math.cos(a);
  const s = Math.sin(a);
  return [c, 0, -s, 0, 0, 1, 0, 0, s, 0, c, 0, 0, 0, 0, 1];
}

function rotationX(a: number): M4 {
  const c = Math.cos(a);
  const s = Math.sin(a);
  return [1, 0, 0, 0, 0, c, s, 0, 0, -s, c, 0, 0, 0, 0, 1];
}

function translation(x: number, y: number, z: number): M4 {
  return [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, x, y, z, 1];
}

// --- shaders (WebGL1 / GLSL ES 1.0) ---
const DISPLACE = `
  vec3 displace(vec3 p, float ph){
    return p + u_drift * vec3(
      sin(u_time * 0.5 + ph),
      cos(u_time * 0.45 + ph * 1.3),
      sin(u_time * 0.4 + ph * 0.7));
  }`;

const POINT_VS = `
  precision mediump float;
  attribute vec3 a_a; attribute float a_pa;
  attribute vec3 a_b; attribute float a_pb;
  attribute float a_seed; attribute float a_speed;
  attribute vec3 a_color; attribute float a_size;
  uniform mat4 u_mvp; uniform float u_time; uniform float u_drift;
  uniform float u_fade; uniform float u_pixelRatio;
  varying vec3 v_color; varying float v_fade;
  ${DISPLACE}
  void main(){
    float t = fract(a_seed + a_speed * u_time);
    vec3 p = mix(displace(a_a, a_pa), displace(a_b, a_pb), t);
    vec4 clip = u_mvp * vec4(p, 1.0);
    gl_Position = clip;
    float fade = clamp(u_fade / clip.w, 0.18, 1.0);
    gl_PointSize = a_size * fade * u_pixelRatio;
    v_color = a_color;
    v_fade = fade;
  }`;

const POINT_FS = `
  precision mediump float;
  varying vec3 v_color; varying float v_fade;
  void main(){
    vec2 c = gl_PointCoord - 0.5;
    float d = dot(c, c);
    if (d > 0.25) discard;
    float a = smoothstep(0.25, 0.0, d);
    gl_FragColor = vec4(v_color * v_fade * a, 1.0);
  }`;

const LINE_VS = `
  precision mediump float;
  attribute vec3 a_pos; attribute float a_phase; attribute vec3 a_color;
  uniform mat4 u_mvp; uniform float u_time; uniform float u_drift; uniform float u_fade;
  varying vec3 v_color; varying float v_fade;
  ${DISPLACE}
  void main(){
    vec3 p = displace(a_pos, a_phase);
    vec4 clip = u_mvp * vec4(p, 1.0);
    gl_Position = clip;
    v_fade = clamp(u_fade / clip.w, 0.18, 1.0);
    v_color = a_color;
  }`;

const LINE_FS = `
  precision mediump float;
  varying vec3 v_color; varying float v_fade;
  void main(){ gl_FragColor = vec4(v_color * v_fade, 1.0); }`;

// Message comet streaks: each packet is a 2-vertex line (tail a_end=0 → head
// a_end=1) that slides along its edge over time, fading from a bright head to a
// transparent tail — a colored signal travelling from one node to another.
const STREAK_VS = `
  precision mediump float;
  attribute vec3 a_a; attribute float a_pa;
  attribute vec3 a_b; attribute float a_pb;
  attribute float a_seed; attribute float a_speed;
  attribute vec3 a_color; attribute float a_end;
  uniform mat4 u_mvp; uniform float u_time; uniform float u_drift;
  uniform float u_fade; uniform float u_trail;
  varying vec3 v_color; varying float v_fade; varying float v_alpha;
  ${DISPLACE}
  void main(){
    float headT = fract(a_seed + a_speed * u_time);
    float t = clamp(headT - u_trail * sign(a_speed) * (1.0 - a_end), 0.0, 1.0);
    vec3 p = mix(displace(a_a, a_pa), displace(a_b, a_pb), t);
    vec4 clip = u_mvp * vec4(p, 1.0);
    gl_Position = clip;
    v_fade = clamp(u_fade / clip.w, 0.18, 1.0);
    v_color = a_color;
    v_alpha = a_end; // 1 at the head, 0 at the tail
  }`;

const STREAK_FS = `
  precision mediump float;
  varying vec3 v_color; varying float v_fade; varying float v_alpha;
  void main(){ gl_FragColor = vec4(v_color * v_fade * v_alpha, 1.0); }`;

const POINT_STRIDE = 14; // floats per point vertex
const LINE_STRIDE = 7; // floats per line vertex
const STREAK_STRIDE = 14; // floats per streak vertex (a_end replaces a_size)

interface Geometry {
  pointData: Float32Array;
  pointCount: number;
  lineData: Float32Array;
  lineCount: number; // edges (2 vertices each)
  streakData: Float32Array;
  streakCount: number; // messages (2 vertices each)
}

function buildGeometry(): Geometry {
  const { nx, ny, nz, spacing, jitter } = CFG;
  const rnd = (a: number, b: number) => a + Math.random() * (b - a);

  interface N {
    x: number;
    y: number;
    z: number;
    phase: number;
    col: [number, number, number];
  }
  const nodes: N[] = [];
  const idx = new Int32Array(nx * ny * nz);
  const at = (i: number, j: number, k: number) => i * ny * nz + j * nz + k;

  for (let i = 0; i < nx; i++) {
    for (let j = 0; j < ny; j++) {
      for (let k = 0; k < nz; k++) {
        nodes.push({
          x: (i - (nx - 1) / 2) * spacing + rnd(-jitter, jitter),
          y: (j - (ny - 1) / 2) * spacing + rnd(-jitter, jitter),
          z: (k - (nz - 1) / 2) * spacing + rnd(-jitter, jitter),
          phase: Math.random() * Math.PI * 2,
          col: Math.random() < 0.5 ? CYAN : PURPLE,
        });
        idx[at(i, j, k)] = nodes.length - 1;
      }
    }
  }

  // structured edges: axis neighbours + face diagonals within range
  const offs = [
    [1, 0, 0],
    [0, 1, 0],
    [0, 0, 1],
    [1, 1, 0],
    [1, 0, 1],
    [0, 1, 1],
  ];
  const maxD2 = (CFG.maxLink * spacing) ** 2;
  const edges: Array<[number, number]> = [];
  for (let i = 0; i < nx; i++) {
    for (let j = 0; j < ny; j++) {
      for (let k = 0; k < nz; k++) {
        const a = nodes[idx[at(i, j, k)]];
        for (const [di, dj, dk] of offs) {
          const ni = i + di;
          const nj = j + dj;
          const nk = k + dk;
          if (ni >= nx || nj >= ny || nk >= nz) continue;
          const bIdx = idx[at(ni, nj, nk)];
          const b = nodes[bIdx];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dz = a.z - b.z;
          if (dx * dx + dy * dy + dz * dz > maxD2) continue;
          edges.push([idx[at(i, j, k)], bIdx]);
        }
      }
    }
  }

  // packets ride a subset of edges, animated entirely in the vertex shader
  interface P {
    edge: number;
    seed: number;
    speed: number;
  }
  const packets: P[] = [];
  const pc = Math.floor(edges.length * CFG.packetRatio);
  for (let p = 0; p < pc; p++) {
    packets.push({
      edge: Math.floor(Math.random() * edges.length),
      seed: Math.random(),
      speed:
        rnd(CFG.packetMinSpeed, CFG.packetMaxSpeed) *
        (Math.random() < 0.5 ? 1 : -1),
    });
  }

  // pack point buffer: nodes (static points), then packets (moving points)
  const pointCount = nodes.length + packets.length;
  const pointData = new Float32Array(pointCount * POINT_STRIDE);
  let o = 0;
  const pushPoint = (
    ax: number, ay: number, az: number, pa: number,
    bx: number, by: number, bz: number, pb: number,
    seed: number, speed: number,
    col: [number, number, number], bright: number, size: number
  ) => {
    pointData[o++] = ax; pointData[o++] = ay; pointData[o++] = az; pointData[o++] = pa;
    pointData[o++] = bx; pointData[o++] = by; pointData[o++] = bz; pointData[o++] = pb;
    pointData[o++] = seed; pointData[o++] = speed;
    pointData[o++] = col[0] * bright; pointData[o++] = col[1] * bright; pointData[o++] = col[2] * bright;
    pointData[o++] = size;
  };
  for (const n of nodes) {
    pushPoint(n.x, n.y, n.z, n.phase, n.x, n.y, n.z, n.phase, 0, 0, n.col, CFG.nodeBright, CFG.nodeSize);
  }
  for (const p of packets) {
    const a = nodes[edges[p.edge][0]];
    const b = nodes[edges[p.edge][1]];
    // bright round "head" of the message
    pushPoint(a.x, a.y, a.z, a.phase, b.x, b.y, b.z, b.phase, p.seed, p.speed, a.col, CFG.messageBright, CFG.packetSize);
  }

  // pack line buffer: 2 vertices per edge
  const lineData = new Float32Array(edges.length * 2 * LINE_STRIDE);
  let e = 0;
  const pushLineVert = (n: N) => {
    lineData[e++] = n.x; lineData[e++] = n.y; lineData[e++] = n.z; lineData[e++] = n.phase;
    lineData[e++] = n.col[0] * CFG.edgeBright;
    lineData[e++] = n.col[1] * CFG.edgeBright;
    lineData[e++] = n.col[2] * CFG.edgeBright;
  };
  for (const [ai, bi] of edges) {
    const a = nodes[ai];
    pushLineVert(a); // both endpoints share endpoint A's colour for a clean edge
    pushLineVert({ ...nodes[bi], col: a.col });
  }

  // pack streak buffer: 2 vertices per message (tail a_end=0, head a_end=1)
  const streakData = new Float32Array(packets.length * 2 * STREAK_STRIDE);
  let s = 0;
  const pushStreakVert = (a: N, b: N, seed: number, speed: number, col: [number, number, number], end: number) => {
    streakData[s++] = a.x; streakData[s++] = a.y; streakData[s++] = a.z; streakData[s++] = a.phase;
    streakData[s++] = b.x; streakData[s++] = b.y; streakData[s++] = b.z; streakData[s++] = b.phase;
    streakData[s++] = seed; streakData[s++] = speed;
    streakData[s++] = col[0] * CFG.messageBright; streakData[s++] = col[1] * CFG.messageBright; streakData[s++] = col[2] * CFG.messageBright;
    streakData[s++] = end;
  };
  for (const p of packets) {
    const a = nodes[edges[p.edge][0]];
    const b = nodes[edges[p.edge][1]];
    pushStreakVert(a, b, p.seed, p.speed, a.col, 0); // tail
    pushStreakVert(a, b, p.seed, p.speed, a.col, 1); // head
  }

  return {
    pointData,
    pointCount,
    lineData,
    lineCount: edges.length,
    streakData,
    streakCount: packets.length,
  };
}

export function WarpField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const opts: WebGLContextAttributes = {
      alpha: false,
      antialias: true,
      depth: false,
      premultipliedAlpha: true,
      powerPreference: "low-power",
      failIfMajorPerformanceCaveat: false,
    };
    const gl = (canvas.getContext("webgl", opts) ||
      canvas.getContext("experimental-webgl", opts)) as WebGLRenderingContext | null;
    // Bail gracefully when WebGL is unavailable (or under a non-WebGL test mock).
    // The opaque black canvas keeps the page looking correct.
    if (!gl || typeof gl.createProgram !== "function") return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    // geometry is generated once and reused across context-loss restores
    const geo = buildGeometry();

    // --- GL resources (recreated on context restore) ---
    let pointProg: WebGLProgram | null = null;
    let lineProg: WebGLProgram | null = null;
    let streakProg: WebGLProgram | null = null;
    let pointBuf: WebGLBuffer | null = null;
    let lineBuf: WebGLBuffer | null = null;
    let streakBuf: WebGLBuffer | null = null;
    let glReady = false;

    const pLoc: Record<string, number> = {};
    const lLoc: Record<string, number> = {};
    const sLoc: Record<string, number> = {};
    const pUni: Record<string, WebGLUniformLocation | null> = {};
    const lUni: Record<string, WebGLUniformLocation | null> = {};
    const sUni: Record<string, WebGLUniformLocation | null> = {};

    const compile = (type: number, src: string) => {
      const sh = gl.createShader(type)!;
      gl.shaderSource(sh, src);
      gl.compileShader(sh);
      return sh;
    };
    const linkProg = (vs: string, fs: string) => {
      const p = gl.createProgram()!;
      gl.attachShader(p, compile(gl.VERTEX_SHADER, vs));
      gl.attachShader(p, compile(gl.FRAGMENT_SHADER, fs));
      gl.linkProgram(p);
      return p;
    };

    function setupGL() {
      pointProg = linkProg(POINT_VS, POINT_FS);
      lineProg = linkProg(LINE_VS, LINE_FS);

      for (const a of ["a_a", "a_pa", "a_b", "a_pb", "a_seed", "a_speed", "a_color", "a_size"])
        pLoc[a] = gl.getAttribLocation(pointProg, a);
      for (const u of ["u_mvp", "u_time", "u_drift", "u_fade", "u_pixelRatio"])
        pUni[u] = gl.getUniformLocation(pointProg, u);
      for (const a of ["a_pos", "a_phase", "a_color"])
        lLoc[a] = gl.getAttribLocation(lineProg, a);
      for (const u of ["u_mvp", "u_time", "u_drift", "u_fade"])
        lUni[u] = gl.getUniformLocation(lineProg, u);

      streakProg = linkProg(STREAK_VS, STREAK_FS);
      for (const a of ["a_a", "a_pa", "a_b", "a_pb", "a_seed", "a_speed", "a_color", "a_end"])
        sLoc[a] = gl.getAttribLocation(streakProg, a);
      for (const u of ["u_mvp", "u_time", "u_drift", "u_fade", "u_trail"])
        sUni[u] = gl.getUniformLocation(streakProg, u);

      pointBuf = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, pointBuf);
      gl.bufferData(gl.ARRAY_BUFFER, geo.pointData, gl.STATIC_DRAW);

      lineBuf = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, lineBuf);
      gl.bufferData(gl.ARRAY_BUFFER, geo.lineData, gl.STATIC_DRAW);

      streakBuf = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, streakBuf);
      gl.bufferData(gl.ARRAY_BUFFER, geo.streakData, gl.STATIC_DRAW);

      gl.disable(gl.DEPTH_TEST);
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.ONE, gl.ONE); // additive glow
      gl.clearColor(0, 0, 0, 1);
      glReady = true;
    }

    // --- sizing: resolution-independent scene, so resize is cheap ---
    let proj: M4 = perspective(CFG.fov, 1, 0.1, 100);
    let pixelRatio = 1;
    let lastW = -1;

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, CFG.dprCap);
      pixelRatio = dpr;
      const cssW = window.innerWidth;
      // Use a STABLE height (largest plausible viewport) so the mobile URL bar
      // collapsing/expanding during scroll never resizes the drawing buffer.
      const cssH = Math.max(
        window.innerHeight,
        document.documentElement.clientHeight || 0,
        window.screen ? window.screen.height : 0
      );
      canvas.width = Math.floor(cssW * dpr);
      canvas.height = Math.floor(cssH * dpr);
      gl.viewport(0, 0, canvas.width, canvas.height);
      proj = perspective(CFG.fov, cssW / cssH, 0.1, 100);
      lastW = cssW;
    }

    function bindAttrib(loc: number, size: number, strideFloats: number, offsetFloats: number) {
      if (loc < 0) return;
      gl.enableVertexAttribArray(loc);
      gl.vertexAttribPointer(loc, size, gl.FLOAT, false, strideFloats * 4, offsetFloats * 4);
    }
    const disableAttribs = (loc: Record<string, number>) => {
      for (const k in loc) if (loc[k] >= 0) gl.disableVertexAttribArray(loc[k]);
    };

    function draw(time: number) {
      if (!glReady) return;
      const model = multiply(rotationX(CFG.tilt), rotationY(time * CFG.orbitSpeed));
      const view = translation(0, 0, -CFG.camZ);
      const mvp = multiply(proj, multiply(view, model));

      gl.clear(gl.COLOR_BUFFER_BIT);

      // edges
      gl.useProgram(lineProg);
      gl.uniformMatrix4fv(lUni.u_mvp, false, mvp);
      gl.uniform1f(lUni.u_time, time);
      gl.uniform1f(lUni.u_drift, CFG.drift);
      gl.uniform1f(lUni.u_fade, CFG.camZ);
      gl.bindBuffer(gl.ARRAY_BUFFER, lineBuf);
      bindAttrib(lLoc.a_pos, 3, LINE_STRIDE, 0);
      bindAttrib(lLoc.a_phase, 1, LINE_STRIDE, 3);
      bindAttrib(lLoc.a_color, 3, LINE_STRIDE, 4);
      gl.lineWidth(1);
      gl.drawArrays(gl.LINES, 0, geo.lineCount * 2);
      disableAttribs(lLoc);

      // messages — comet streaks travelling along edges (bright head → faded tail)
      if (geo.streakCount > 0) {
        gl.useProgram(streakProg);
        gl.uniformMatrix4fv(sUni.u_mvp, false, mvp);
        gl.uniform1f(sUni.u_time, time);
        gl.uniform1f(sUni.u_drift, CFG.drift);
        gl.uniform1f(sUni.u_fade, CFG.camZ);
        gl.uniform1f(sUni.u_trail, CFG.packetTrail);
        gl.bindBuffer(gl.ARRAY_BUFFER, streakBuf);
        bindAttrib(sLoc.a_a, 3, STREAK_STRIDE, 0);
        bindAttrib(sLoc.a_pa, 1, STREAK_STRIDE, 3);
        bindAttrib(sLoc.a_b, 3, STREAK_STRIDE, 4);
        bindAttrib(sLoc.a_pb, 1, STREAK_STRIDE, 7);
        bindAttrib(sLoc.a_seed, 1, STREAK_STRIDE, 8);
        bindAttrib(sLoc.a_speed, 1, STREAK_STRIDE, 9);
        bindAttrib(sLoc.a_color, 3, STREAK_STRIDE, 10);
        bindAttrib(sLoc.a_end, 1, STREAK_STRIDE, 13);
        gl.lineWidth(1);
        gl.drawArrays(gl.LINES, 0, geo.streakCount * 2);
        disableAttribs(sLoc);
      }

      // nodes + message heads
      gl.useProgram(pointProg);
      gl.uniformMatrix4fv(pUni.u_mvp, false, mvp);
      gl.uniform1f(pUni.u_time, time);
      gl.uniform1f(pUni.u_drift, CFG.drift);
      gl.uniform1f(pUni.u_fade, CFG.camZ);
      gl.uniform1f(pUni.u_pixelRatio, pixelRatio);
      gl.bindBuffer(gl.ARRAY_BUFFER, pointBuf);
      bindAttrib(pLoc.a_a, 3, POINT_STRIDE, 0);
      bindAttrib(pLoc.a_pa, 1, POINT_STRIDE, 3);
      bindAttrib(pLoc.a_b, 3, POINT_STRIDE, 4);
      bindAttrib(pLoc.a_pb, 1, POINT_STRIDE, 7);
      bindAttrib(pLoc.a_seed, 1, POINT_STRIDE, 8);
      bindAttrib(pLoc.a_speed, 1, POINT_STRIDE, 9);
      bindAttrib(pLoc.a_color, 3, POINT_STRIDE, 10);
      bindAttrib(pLoc.a_size, 1, POINT_STRIDE, 13);
      gl.drawArrays(gl.POINTS, 0, geo.pointCount);
      disableAttribs(pLoc);
    }

    // --- run loop: throttled to CFG.fps, paused when the tab is hidden ---
    const minInterval = 1000 / CFG.fps;
    let rafId = 0;
    let running = false;
    let startTime = 0;
    let lastDraw = 0;

    const tick = (now: number) => {
      if (!running) return;
      rafId = requestAnimationFrame(tick);
      if (now - lastDraw < minInterval) return; // throttle the repaint
      lastDraw = now;
      draw((now - startTime) / 1000);
    };
    const start = () => {
      if (running || reduceMotion || !glReady) return;
      running = true;
      startTime = performance.now();
      lastDraw = 0;
      rafId = requestAnimationFrame(tick);
    };
    const stop = () => {
      running = false;
      if (rafId) cancelAnimationFrame(rafId);
      rafId = 0;
    };

    setupGL();
    resize();
    if (reduceMotion) draw(0); // single static frame
    else start();

    let resizeRaf = 0;
    const onResize = () => {
      // Only react to WIDTH changes (orientation / desktop resize). Height-only
      // changes from the mobile URL bar must NOT rebuild anything.
      if (window.innerWidth === lastW) return;
      cancelAnimationFrame(resizeRaf);
      resizeRaf = requestAnimationFrame(() => {
        resize();
        if (reduceMotion) draw(0);
      });
    };
    const onVisibility = () => {
      if (document.hidden) stop();
      else start();
    };
    const onLost = (e: Event) => {
      e.preventDefault();
      stop();
      glReady = false;
    };
    const onRestored = () => {
      setupGL();
      resize();
      if (reduceMotion) draw(0);
      else start();
    };

    window.addEventListener("resize", onResize);
    document.addEventListener("visibilitychange", onVisibility);
    canvas.addEventListener("webglcontextlost", onLost, false);
    canvas.addEventListener("webglcontextrestored", onRestored, false);

    return () => {
      stop();
      cancelAnimationFrame(resizeRaf);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
      canvas.removeEventListener("webglcontextlost", onLost);
      canvas.removeEventListener("webglcontextrestored", onRestored);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      // Explicit negative z-index (the `-z-10` utility does not apply here) so
      // this opaque fixed layer composites *below* the scrolling page content.
      // The black background avoids any flash before the first canvas paint.
      style={{ zIndex: -1, backgroundColor: "#000" }}
      className="fixed inset-0 w-full h-full pointer-events-none"
    />
  );
}
