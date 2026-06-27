import { useEffect, useRef } from "react";

/**
 * WarpField — a dark hexagonal-honeycomb animated background (WebGL).
 *
 * Near-black hex tiles separated by thin glowing seams in the brand's
 * purple→cyan range, with a soft bevel, a few subtly brighter "raised" tiles,
 * faint sparkle specks and a gentle vignette — a calm, even, crypto-grid
 * backdrop. Rendered as a fixed, full-viewport, pointer-events-none layer
 * behind the page content.
 *
 * Why this shape / why a fullscreen shader:
 *  - The honeycomb is drawn procedurally by a single fullscreen-quad fragment
 *    shader, so coverage is perfectly EVEN everywhere — there are no moving
 *    geometry gaps (which is what produced the "black blocks/voids" of the
 *    earlier 3D node-mesh version).
 *  - One draw call, no vertex geometry, all work on the GPU. Per frame only two
 *    uniforms change (time + resolution). The CPU does essentially nothing.
 *  - Motion is purely time-driven, never bound to scroll. A viewport resize only
 *    updates the GL viewport + a resolution uniform — nothing is rebuilt — so the
 *    mobile URL bar collapsing/expanding during scroll can never cause a
 *    flicker/redraw (the original issue #30 bug).
 *
 * Stability guardrails: DPR cap, ~30fps throttle, prefers-reduced-motion (one
 * static frame), pause when the tab is hidden, WebGL context-loss recovery, and
 * a graceful no-op fallback (opaque black canvas) when WebGL is unavailable.
 */

const PURPLE = "vec3(0.545, 0.361, 0.965)"; // #8B5CF6
const CYAN = "vec3(0.055, 0.647, 0.914)"; // #0EA5E9

const CFG = {
  hexScale: 9.0, // ~hex rows across the viewport height (density)
  seamWidth: 0.085, // glow band width near the tile border (< 0.5)
  master: 0.8, // master glow intensity — lower = darker
  fillBright: 0.18, // faint top-surface fill on raised tiles
  pulseSpeed: 0.6, // per-tile shimmer speed
  raisedFrac: 0.14, // fraction of brighter / "raised" tiles
  sparkle: 0.5, // sparkle-speck strength
  starDensity: 26.0, // sparkle grid density
  drift: 0.012, // ultra-slow whole-field drift
  dprCap: 2,
  fps: 30,
};

const f = (n: number) => n.toFixed(6);

const QUAD_VS = `
  precision mediump float;
  attribute vec2 a_pos;
  void main(){ gl_Position = vec4(a_pos, 0.0, 1.0); }`;

const HEX_FS = `
  precision mediump float;
  uniform vec2 u_resolution;
  uniform float u_time;

  const vec3 PURPLE = ${PURPLE};
  const vec3 CYAN = ${CYAN};
  const float HEXSCALE = ${f(CFG.hexScale)};
  const float SEAMW = ${f(CFG.seamWidth)};
  const float MASTER = ${f(CFG.master)};
  const float FILLBRIGHT = ${f(CFG.fillBright)};
  const float PULSESPEED = ${f(CFG.pulseSpeed)};
  const float RAISEDFRAC = ${f(CFG.raisedFrac)};
  const float SPARKLE = ${f(CFG.sparkle)};
  const float STARDENSITY = ${f(CFG.starDensity)};
  const float DRIFT = ${f(CFG.drift)};

  float hash21(vec2 p){
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
  }

  // nearest hex cell: returns vec4(localCoords, cellId)
  vec4 hexCoords(vec2 uv){
    vec2 r = vec2(1.0, 1.7320508);
    vec2 h = r * 0.5;
    vec2 a = mod(uv, r) - h;
    vec2 b = mod(uv - h, r) - h;
    vec2 gv = dot(a, a) < dot(b, b) ? a : b;
    return vec4(gv, uv - gv);
  }

  // distance from cell center to the hex border (border at 0.5)
  float hexEdge(vec2 p){
    p = abs(p);
    return max(dot(p, normalize(vec2(1.0, 1.7320508))), p.x);
  }

  void main(){
    vec2 uv = (gl_FragCoord.xy - 0.5 * u_resolution) / u_resolution.y;
    uv *= HEXSCALE;
    uv += vec2(u_time * DRIFT, u_time * DRIFT * 0.6);

    // flat-top hexagons (compute in swapped space)
    vec2 huv = uv.yx;
    vec4 hc = hexCoords(huv);
    vec2 gv = hc.xy;
    vec2 id = hc.zw;

    float eDist = hexEdge(gv);
    float rnd = hash21(id + 0.5);
    float raised = step(1.0 - RAISEDFRAC, rnd);
    float pulse = 0.5 + 0.5 * sin(u_time * PULSESPEED + rnd * 6.2831);

    // seam glow + a thinner bright core for a beveled lip
    float seam = smoothstep(0.5 - SEAMW, 0.5, eDist);
    float core = smoothstep(0.5 - SEAMW * 0.35, 0.5, eDist);
    float glow = seam * 0.55 + core * 0.45;

    // colour: gentle screen-space gradient blended with per-hex variation
    float cmix = clamp(0.5 + 0.5 * sin(id.x * 0.35 + id.y * 0.3) * 0.7 + (rnd - 0.5) * 0.5, 0.0, 1.0);
    vec3 col = mix(PURPLE, CYAN, cmix);

    float intensity = glow * (0.55 + 0.45 * pulse) * (0.75 + raised * 0.7);
    vec3 color = col * intensity * MASTER;

    // faint top-surface fill on raised tiles
    color += col * (FILLBRIGHT * raised * (1.0 - seam) * (0.6 + 0.4 * pulse));

    // sparkle specks sitting on the tile faces
    vec2 starCell = floor(huv * STARDENSITY);
    float star = smoothstep(0.975, 1.0, hash21(starCell + 7.0));
    float twk = 0.5 + 0.5 * sin(u_time * 2.0 + hash21(starCell) * 6.2831);
    color += vec3(0.6, 0.7, 1.0) * star * twk * SPARKLE * (1.0 - seam);

    // depth: dim toward the top ("back"), plus a soft vignette
    vec2 sc = gl_FragCoord.xy / u_resolution;
    float depth = mix(0.55, 1.0, sc.y);
    vec2 vd = (sc - 0.5) * vec2(u_resolution.x / u_resolution.y, 1.0);
    float vig = smoothstep(1.05, 0.35, length(vd) * 1.2);
    color *= depth * vig;

    // near-black base tint so tiles read as dark glass, never pure void
    color += vec3(0.012, 0.016, 0.028);

    gl_FragColor = vec4(color, 1.0);
  }`;

export function WarpField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const opts: WebGLContextAttributes = {
      alpha: false,
      antialias: false,
      depth: false,
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

    // --- GL resources (recreated on context restore) ---
    let prog: WebGLProgram | null = null;
    let quadBuf: WebGLBuffer | null = null;
    let aPos = -1;
    let uRes: WebGLUniformLocation | null = null;
    let uTime: WebGLUniformLocation | null = null;
    let glReady = false;

    const compile = (type: number, src: string) => {
      const sh = gl.createShader(type)!;
      gl.shaderSource(sh, src);
      gl.compileShader(sh);
      return sh;
    };

    function setupGL() {
      prog = gl.createProgram()!;
      gl.attachShader(prog, compile(gl.VERTEX_SHADER, QUAD_VS));
      gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, HEX_FS));
      gl.linkProgram(prog);
      aPos = gl.getAttribLocation(prog, "a_pos");
      uRes = gl.getUniformLocation(prog, "u_resolution");
      uTime = gl.getUniformLocation(prog, "u_time");

      quadBuf = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, quadBuf);
      gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
        gl.STATIC_DRAW
      );

      gl.disable(gl.DEPTH_TEST);
      gl.disable(gl.BLEND);
      glReady = true;
    }

    // --- sizing: resolution-independent shader, so resize is cheap ---
    let lastW = -1;

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, CFG.dprCap);
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
      lastW = cssW;
    }

    function draw(time: number) {
      if (!glReady) return;
      gl.useProgram(prog);
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uTime, time);
      gl.bindBuffer(gl.ARRAY_BUFFER, quadBuf);
      gl.enableVertexAttribArray(aPos);
      gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
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
      // changes from the mobile URL bar must NOT rebuild the drawing buffer.
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
