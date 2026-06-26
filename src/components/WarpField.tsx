import { useEffect, useRef } from "react";

/**
 * NetworkField — a sharp, crypto-themed animated background.
 *
 * A structured mesh of geometric nodes (a settlement / liquidity network)
 * connected by crisp edges, with bright "packets" — transactions settling —
 * streaming along the edges. Nodes are laid out on a jittered grid so the
 * result reads as a network/ledger rather than a starfield, and they drift
 * gently for life.
 *
 * Performance: nodes sit on a fixed grid with edges computed once. Every frame
 * draws just a single opaque clear, two batched edge strokes and two batched
 * node fills (grouped by colour), plus a handful of packet sprites — a few
 * draw calls total, regardless of node count. The loop pauses when the tab is
 * hidden and honours prefers-reduced-motion (renders one static frame).
 *
 * Rendered as a fixed, full-viewport, pointer-events-none backdrop behind the
 * page content.
 */
const PURPLE: [number, number, number] = [139, 92, 246]; // #8B5CF6
const CYAN: [number, number, number] = [14, 165, 233]; // #0EA5E9

const CFG = {
  cell: 160, // grid cell size (CSS px) — node density
  jitter: 0.4, // random offset as a fraction of a cell
  maxLink: 1.5, // connect nodes within maxLink * cell (home distance)
  drift: 8, // node drift amplitude (px)
  driftSpeed: 0.22, // base drift angular speed (rad/s)
  nodeSize: 2.3, // diamond half-size (px)
  edgeAlpha: 0.09, // web brightness (faint)
  nodeAlpha: 0.4,
  packetRatio: 0.22, // packets per edge
  packetSize: 1.3,
  packetMinSpeed: 0.08, // t units / second
  packetMaxSpeed: 0.22,
  dprCap: 2, // keep it sharp on hi-dpi, but bounded
};

interface FieldNode {
  hx: number;
  hy: number;
  x: number;
  y: number;
  phase: number;
  sp: number;
  ax: number;
  ay: number;
  cyan: boolean;
}
interface Edge {
  a: number;
  b: number;
  cyan: boolean;
}
interface Packet {
  edge: number;
  t: number;
  vt: number;
  cyan: boolean;
}

const rgba = ([r, g, b]: number[], a: number) => `rgba(${r},${g},${b},${a})`;

export function WarpField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    let W = 0;
    let H = 0;
    let nodes: FieldNode[] = [];
    let edges: Edge[] = [];
    let packets: Packet[] = [];

    const rand = (a: number, b: number) => a + Math.random() * (b - a);

    function build() {
      W = window.innerWidth;
      H = window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, CFG.dprCap);
      canvas.width = Math.floor(W * dpr);
      canvas.height = Math.floor(H * dpr);
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);

      const cell = CFG.cell;
      const cols = Math.ceil(W / cell) + 2;
      const rows = Math.ceil(H / cell) + 2;
      const jit = cell * CFG.jitter;

      nodes = [];
      const idx: number[][] = [];
      for (let r = 0; r < rows; r++) {
        idx[r] = [];
        for (let c = 0; c < cols; c++) {
          const hx = c * cell - cell / 2 + rand(-jit, jit);
          const hy = r * cell - cell / 2 + rand(-jit, jit);
          idx[r][c] = nodes.length;
          nodes.push({
            hx,
            hy,
            x: hx,
            y: hy,
            phase: Math.random() * Math.PI * 2,
            sp: CFG.driftSpeed * rand(0.6, 1.4),
            ax: CFG.drift * rand(0.5, 1),
            ay: CFG.drift * rand(0.5, 1),
            cyan: Math.random() < 0.5,
          });
        }
      }

      // connect each node to right / down / diagonal neighbours within range
      const maxD = CFG.maxLink * cell;
      const maxD2 = maxD * maxD;
      edges = [];
      const neigh = [
        [0, 1],
        [1, 0],
        [1, 1],
        [1, -1],
      ];
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const ai = idx[r][c];
          const a = nodes[ai];
          for (const [dr, dc] of neigh) {
            const nr = r + dr;
            const nc = c + dc;
            if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) continue;
            const bi = idx[nr][nc];
            const b = nodes[bi];
            const dx = a.hx - b.hx;
            const dy = a.hy - b.hy;
            if (dx * dx + dy * dy > maxD2) continue;
            edges.push({ a: ai, b: bi, cyan: a.cyan });
          }
        }
      }

      // seed packets on a subset of edges
      packets = [];
      const count = Math.floor(edges.length * CFG.packetRatio);
      for (let i = 0; i < count; i++) {
        const edge = Math.floor(Math.random() * edges.length);
        packets.push({
          edge,
          t: Math.random(),
          vt:
            rand(CFG.packetMinSpeed, CFG.packetMaxSpeed) *
            (Math.random() < 0.5 ? 1 : -1),
          cyan: edges[edge].cyan,
        });
      }
    }

    function drawEdges(cyan: boolean) {
      ctx!.beginPath();
      for (const e of edges) {
        if (e.cyan !== cyan) continue;
        const a = nodes[e.a];
        const b = nodes[e.b];
        ctx!.moveTo(a.x, a.y);
        ctx!.lineTo(b.x, b.y);
      }
      ctx!.strokeStyle = rgba(cyan ? CYAN : PURPLE, CFG.edgeAlpha);
      ctx!.lineWidth = 1;
      ctx!.stroke();
    }

    function drawNodes(cyan: boolean) {
      const s = CFG.nodeSize;
      ctx!.beginPath();
      for (const n of nodes) {
        if (n.cyan !== cyan) continue;
        ctx!.moveTo(n.x, n.y - s);
        ctx!.lineTo(n.x + s, n.y);
        ctx!.lineTo(n.x, n.y + s);
        ctx!.lineTo(n.x - s, n.y);
        ctx!.closePath();
      }
      ctx!.fillStyle = rgba(cyan ? CYAN : PURPLE, CFG.nodeAlpha);
      ctx!.fill();
    }

    function drawFrame(dt: number, time: number) {
      // gentle node drift
      for (const n of nodes) {
        n.x = n.hx + Math.sin(time * n.sp + n.phase) * n.ax;
        n.y = n.hy + Math.cos(time * n.sp * 0.9 + n.phase) * n.ay;
      }

      ctx!.globalCompositeOperation = "source-over";
      ctx!.fillStyle = "#000";
      ctx!.fillRect(0, 0, W, H);

      drawEdges(false);
      drawEdges(true);
      drawNodes(false);
      drawNodes(true);

      // packets — bright transactions streaming along edges (additive glints)
      ctx!.globalCompositeOperation = "lighter";
      const ps = CFG.packetSize;
      for (const p of packets) {
        p.t += p.vt * dt;
        if (p.t > 1) p.t -= 1;
        else if (p.t < 0) p.t += 1;
        const e = edges[p.edge];
        const a = nodes[e.a];
        const b = nodes[e.b];
        const x = a.x + (b.x - a.x) * p.t;
        const y = a.y + (b.y - a.y) * p.t;
        const col = p.cyan ? CYAN : PURPLE;
        // short comet trail along the edge
        const tt = p.t - 0.06 * Math.sign(p.vt);
        const xt = a.x + (b.x - a.x) * tt;
        const yt = a.y + (b.y - a.y) * tt;
        ctx!.strokeStyle = rgba(col, 0.45);
        ctx!.lineWidth = 1.2;
        ctx!.beginPath();
        ctx!.moveTo(xt, yt);
        ctx!.lineTo(x, y);
        ctx!.stroke();
        ctx!.fillStyle = rgba(col, 0.9);
        ctx!.fillRect(x - ps, y - ps, ps * 2, ps * 2);
      }
      ctx!.globalCompositeOperation = "source-over";
    }

    // --- run loop, paused when the tab is hidden ---
    let rafId = 0;
    let running = false;
    let prev = 0;
    let time = 0;

    const tick = (now: number) => {
      if (!running) return;
      const dt = Math.min(0.05, (now - prev) / 1000 || 0);
      prev = now;
      time += dt;
      drawFrame(dt, time);
      rafId = requestAnimationFrame(tick);
    };
    const start = () => {
      if (running || reduceMotion) return;
      running = true;
      prev = performance.now();
      rafId = requestAnimationFrame(tick);
    };
    const stop = () => {
      running = false;
      if (rafId) cancelAnimationFrame(rafId);
      rafId = 0;
    };

    build();

    if (reduceMotion) {
      drawFrame(0, 0); // single static frame
    } else {
      start();
    }

    let resizeRaf = 0;
    const onResize = () => {
      cancelAnimationFrame(resizeRaf);
      resizeRaf = requestAnimationFrame(() => build());
    };
    const onVisibility = () => {
      if (document.hidden) stop();
      else start();
    };
    window.addEventListener("resize", onResize);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      stop();
      cancelAnimationFrame(resizeRaf);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="fixed inset-0 w-full h-full -z-10 pointer-events-none"
    />
  );
}
