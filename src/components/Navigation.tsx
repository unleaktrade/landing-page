import { useState, useEffect, useRef } from "react";
import { Menu, X } from "lucide-react";
import logoImage from "figma:asset/fdbafc2f1e7edb4d213deafbca8c80c666dccbae.png";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";

function MovingSquares() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Logo colors - pure purple and cyan/blue
    const PURPLE = { r: 139, g: 92, b: 246 }; // #8B5CF6
    const CYAN = { r: 14, g: 165, b: 233 };   // #0EA5E9 - More blue, less green
    const MAX_SIZE = 34;
    const MIN_SIZE = 8;
    const DENSITY = 0.00084; // 30% less cubes
    const SPEED_X = [15, 60]; // Slower speed

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
    const clamp = (x: number, a: number, b: number) => Math.max(a, Math.min(b, x));

    function getRandomColor(t: number) {
      // Randomly pick purple or cyan (not gradient)
      const color = Math.random() > 0.5 ? PURPLE : CYAN;
      
      // Brighter: increase brightness based on position
      const brightness = lerp(0.75, 0.5, t); // top 75% brightness, bottom 50%
      return `rgb(${Math.round(color.r * brightness)}, ${Math.round(color.g * brightness)}, ${Math.round(color.b * brightness)})`;
    }

    interface Square {
      x: number;
      y: number;
      size: number;
      color: string;
      speed: number;
      rot: number;
      rotSpeed: number;
    }

    let squares: Square[] = [];

    function spawn(xStart?: number): Square {
      const w = canvas.clientWidth, h = canvas.clientHeight;
      const safeH = h - MAX_SIZE;
      
      // Bias towards bottom: use squared random for y distribution
      const randomY = Math.random();
      const biasedY = randomY * randomY; // More density at bottom
      const y = MAX_SIZE / 2 + biasedY * safeH;
      
      const t = clamp(y / h, 0, 1);
      const size = Math.round(lerp(MIN_SIZE, MAX_SIZE, t)); // INVERTED: small on top, big on bottom
      const color = getRandomColor(t);
      const speed = lerp(SPEED_X[1], SPEED_X[0], 1 - t) * (0.6 + 0.8 * Math.random());
      const rot = Math.random() * Math.PI * 2;
      const rotSpeed = Math.random() * 0.6 - 0.3;
      return { x: xStart ?? -size, y, size, color, speed, rot, rotSpeed };
    }

    function resize() {
      const dpr = Math.max(1, window.devicePixelRatio || 1);
      const { clientWidth: w, clientHeight: h } = canvas;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      
      const count = Math.max(8, Math.floor(w * h * DENSITY));
      squares = new Array(count).fill(0).map(() => spawn(-Math.random() * w));
    }

    let prev = performance.now();
    let animationId: number;

    function tick(now: number) {
      const dt = (now - prev) / 1000;
      prev = now;
      const w = canvas.clientWidth, h = canvas.clientHeight;

      ctx.clearRect(0, 0, w, h);

      for (let i = 0; i < squares.length; i++) {
        const s = squares[i];
        s.x += s.speed * dt;
        s.rot += s.rotSpeed * dt;

        if (s.x - s.size > w) Object.assign(s, spawn(-s.size));

        ctx.save();
        ctx.translate(s.x, s.y);
        ctx.rotate(s.rot);
        ctx.fillStyle = s.color;
        ctx.globalAlpha = lerp(0.7, 0.35, s.size / MAX_SIZE); // Darker opacity
        const half = s.size / 2;
        ctx.fillRect(-half, -half, s.size, s.size);
        ctx.restore();
      }

      animationId = requestAnimationFrame(tick);
    }

    resize();
    window.addEventListener('resize', resize);
    animationId = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />;
}

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);

  const closeMenu = () => setIsOpen(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/5">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <img src={logoImage} alt="UmbraTrade" className="h-8 w-8" />
            <span className="tracking-tight">
              <span className="text-white/60">Umbra</span>
              <span className="text-white">Trade</span>
            </span>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <a href="#learn" className="text-sm text-white/60 hover:text-white transition-colors">
              Learn more
            </a>
            <a href="#team" className="text-sm text-white/60 hover:text-white transition-colors">
              Team
            </a>
            <a 
              href="#app" 
              className="relative inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gradient-to-r from-purple-500/20 to-cyan-400/20 border border-white/10 hover:border-white/20 transition-all group overflow-hidden"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-cyan-400/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              <span className="relative text-sm bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                Request Access
              </span>
              <span className="relative text-[9px] text-white/30 tracking-wide">
                COMING SOON
              </span>
            </a>
          </div>

          {/* Mobile Menu Button */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <button className="p-2 text-white/60 hover:text-white transition-colors">
                <Menu className="h-6 w-6" />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px] bg-black border-white/10 p-0 overflow-hidden">
              {/* Mobile Menu Items - Centered */}
              <nav className="relative flex flex-col h-full">
                <div className="flex flex-col items-center px-8 pt-8 pb-6">
                  <a 
                    href="#learn" 
                    onClick={closeMenu}
                    className="w-full text-center py-4 text-white/60 hover:text-white transition-colors"
                  >
                    Learn more
                  </a>
                  
                  <a 
                    href="#team" 
                    onClick={closeMenu}
                    className="w-full text-center py-4 text-white/60 hover:text-white transition-colors"
                  >
                    Team
                  </a>

                  {/* CTA Button */}
                  <div className="w-full mt-6">
                    <a 
                      href="#app" 
                      onClick={closeMenu}
                      className="relative w-full flex flex-col items-center gap-1.5 px-4 py-3 rounded-lg bg-gradient-to-r from-purple-500/20 to-cyan-400/20 border border-white/10 hover:border-white/20 transition-all group overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-cyan-400/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                      <span className="relative bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                        Request Access
                      </span>
                      <span className="relative text-[9px] text-white/30 tracking-wide">
                        COMING SOON
                      </span>
                    </a>
                  </div>
                </div>

                {/* Canvas particle stream */}
                <div className="flex-1 relative overflow-hidden">
                  <MovingSquares />
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
