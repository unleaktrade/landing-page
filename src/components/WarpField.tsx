import { useEffect, useRef } from "react";

/**
 * WarpField — a discreet 3D proximity-network "warp" background for the hero.
 *
 * Nodes drift toward the camera so perspective projection streams them radially
 * out of a central vanishing point; nearby nodes are joined by a faint web, and
 * low-alpha black fills leave gentle motion-blur trails.
 *
 * Scoped to the hero section (absolute, behind the content) and tuned to be
 * cheap and discreet:
 *  - small node count + capped device-pixel-ratio,
 *  - the requestAnimationFrame loop only runs while the hero is on-screen and
 *    the tab is visible (IntersectionObserver + visibilitychange), so scrolling
 *    past the hero or backgrounding the tab costs nothing,
 *  - honours prefers-reduced-motion (renders a single static frame).
 */
const CONFIG = {
  count: 90, // number of nodes
  speed: 0.006, // forward travel per frame (depth units)
  roll: 0.0009, // swirl, radians per frame
  linkDist: 0.32, // 3D distance under which two nodes connect
  maxLinks: 4, // cap connections per node
  focal: 1.0,
  zNear: 0.06,
  zFar: 1.0,
  spread: 1.2,
  nodeSize: 1.4,
  glow: 2.8,
  trail: 0.22, // lower = longer streaks
  lineAlpha: 0.16, // faint web
  brightCap: 0.5, // ceiling on node brightness (keeps it dim)
  dprCap: 1.5, // cap resolution for performance
};

const PURPLE: [number, number, number] = [139, 92, 246]; // #8B5CF6
const CYAN: [number, number, number] = [14, 165, 233]; // #0EA5E9

interface Node {
  x: number;
  y: number;
  z: number;
  sx: number;
  sy: number;
  k: number;
  vis: boolean;
  cyan: boolean;
}

function makeSprite([r, g, b]: [number, number, number]) {
  const s = 64;
  const c = document.createElement("canvas");
  c.width = c.height = s;
  const g2 = c.getContext("2d")!;
  const grd = g2.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
  grd.addColorStop(0.0, `rgba(${r},${g},${b},1)`);
  grd.addColorStop(0.18, `rgba(${r},${g},${b},0.85)`);
  grd.addColorStop(0.5, `rgba(${r},${g},${b},0.18)`);
  grd.addColorStop(1.0, `rgba(${r},${g},${b},0)`);
  g2.fillStyle = grd;
  g2.fillRect(0, 0, s, s);
  return c;
}

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

    const spritePurple = makeSprite(PURPLE);
    const spriteCyan = makeSprite(CYAN);

    let W = 0;
    let H = 0;
    let cx = 0;
    let cy = 0;
    let scale = 0;

    const rnd = (a: number, b: number) => a + Math.random() * (b - a);

    const N = CONFIG.count;
    const nodes: Node[] = [];
    for (let i = 0; i < N; i++) {
      nodes.push({
        x: rnd(-CONFIG.spread, CONFIG.spread),
        y: rnd(-CONFIG.spread, CONFIG.spread),
        z: rnd(CONFIG.zNear, CONFIG.zFar),
        sx: 0,
        sy: 0,
        k: 0,
        vis: false,
        cyan: Math.random() < 0.5,
      });
    }

    const recycle = (n: Node) => {
      n.x = rnd(-CONFIG.spread, CONFIG.spread);
      n.y = rnd(-CONFIG.spread, CONFIG.spread);
      n.z = CONFIG.zFar;
      n.cyan = Math.random() < 0.5;
    };

    const cos = Math.cos(CONFIG.roll);
    const sin = Math.sin(CONFIG.roll);

    function resize() {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      if (!w || !h) return;
      const dpr = Math.min(window.devicePixelRatio || 1, CONFIG.dprCap);
      W = w;
      H = h;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      cx = W / 2;
      cy = H / 2;
      scale = Math.min(W, H) * 0.5;
      ctx!.fillStyle = "#000";
      ctx!.fillRect(0, 0, W, H);
    }

    function step() {
      for (let i = 0; i < N; i++) {
        const n = nodes[i];
        const x = n.x * cos - n.y * sin;
        const y = n.x * sin + n.y * cos;
        n.x = x;
        n.y = y;
        n.z -= CONFIG.speed;
        if (n.z < CONFIG.zNear) recycle(n);
        const k = CONFIG.focal / n.z;
        n.k = k;
        n.sx = cx + n.x * k * scale;
        n.sy = cy + n.y * k * scale;
        n.vis = n.sx > -120 && n.sx < W + 120 && n.sy > -120 && n.sy < H + 120;
      }
    }

    function draw() {
      if (!W || !H) return;
      ctx!.globalCompositeOperation = "source-over";
      ctx!.fillStyle = `rgba(0,0,0,${CONFIG.trail})`;
      ctx!.fillRect(0, 0, W, H);

      ctx!.globalCompositeOperation = "lighter";

      const D2 = CONFIG.linkDist * CONFIG.linkDist;
      ctx!.lineWidth = 0.7;
      for (let i = 0; i < N; i++) {
        const a = nodes[i];
        if (!a.vis && a.z > 0.4) continue;
        const [r, g, b] = a.cyan ? CYAN : PURPLE;
        let links = 0;
        for (let j = i + 1; j < N && links < CONFIG.maxLinks; j++) {
          const c = nodes[j];
          const dx = a.x - c.x;
          const dy = a.y - c.y;
          const dz = a.z - c.z;
          const d2 = dx * dx + dy * dy + dz * dz;
          if (d2 > D2) continue;
          if (!a.vis && !c.vis) continue;
          links++;
          const closeness = 1 - Math.sqrt(d2) / CONFIG.linkDist;
          const depth = Math.min(a.k, c.k);
          const alpha = closeness * Math.min(1, depth * 0.55) * CONFIG.lineAlpha;
          if (alpha < 0.012) continue;
          ctx!.strokeStyle = `rgba(${r},${g},${b},${alpha})`;
          ctx!.beginPath();
          ctx!.moveTo(a.sx, a.sy);
          ctx!.lineTo(c.sx, c.sy);
          ctx!.stroke();
        }
      }

      for (let i = 0; i < N; i++) {
        const n = nodes[i];
        if (!n.vis) continue;
        const size = CONFIG.nodeSize * n.k * CONFIG.glow;
        const t = (n.z - CONFIG.zNear) / (CONFIG.zFar - CONFIG.zNear);
        let bright = 1 - t;
        bright = 0.1 + bright * bright * 0.42;
        ctx!.globalAlpha = Math.min(CONFIG.brightCap, bright);
        ctx!.drawImage(
          n.cyan ? spriteCyan : spritePurple,
          n.sx - size,
          n.sy - size,
          size * 2,
          size * 2
        );
      }
      ctx!.globalAlpha = 1;
    }

    // --- run loop only while the hero is visible and the tab is active ---
    let rafId = 0;
    let running = false;
    let onScreen = false;

    const tick = () => {
      if (!running) return;
      step();
      draw();
      rafId = requestAnimationFrame(tick);
    };
    const start = () => {
      if (running || reduceMotion) return;
      running = true;
      rafId = requestAnimationFrame(tick);
    };
    const stop = () => {
      running = false;
      if (rafId) cancelAnimationFrame(rafId);
      rafId = 0;
    };
    const sync = () => {
      if (onScreen && !document.hidden) start();
      else stop();
    };

    resize();

    if (reduceMotion) {
      // settle a single static frame, then never animate
      for (let i = 0; i < 200; i++) step();
      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, W, H);
      draw();
    }

    const ro =
      typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(() => resize())
        : null;
    ro?.observe(canvas);

    const io =
      typeof IntersectionObserver !== "undefined"
        ? new IntersectionObserver(
            (entries) => {
              onScreen = entries[0]?.isIntersecting ?? false;
              sync();
            },
            { threshold: 0 }
          )
        : null;
    if (io) io.observe(canvas);
    else {
      // no IntersectionObserver: fall back to always-on
      onScreen = true;
      sync();
    }

    const onVisibility = () => sync();
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      stop();
      ro?.disconnect();
      io?.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="absolute inset-0 w-full h-full pointer-events-none"
    />
  );
}
