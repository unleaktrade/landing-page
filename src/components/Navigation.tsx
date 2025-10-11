import { useState } from "react";
import { Menu, X } from "lucide-react";
import logoImage from "figma:asset/fdbafc2f1e7edb4d213deafbca8c80c666dccbae.png";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";

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
              className="relative inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-gradient-to-r from-purple-500/20 to-cyan-400/20 border border-white/10 hover:border-white/20 transition-all group overflow-hidden"
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
                      className="relative w-full flex flex-col items-center gap-2 px-6 py-5 rounded-lg bg-gradient-to-r from-purple-500/20 to-cyan-400/20 border border-white/10 hover:border-white/20 transition-all group overflow-hidden"
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

                {/* Cascade of colored pixels */}
                <div className="flex-1 relative overflow-hidden">
                  <div className="absolute inset-0 flex flex-col justify-end pb-8">
                    {[...Array(8)].map((_, rowIndex) => (
                      <div key={rowIndex} className="flex justify-center gap-2 mb-2">
                        {[...Array(Math.min(rowIndex + 1, 6))].map((_, colIndex) => {
                          const colors = [
                            'rgba(139, 92, 246, 0.4)', // purple
                            'rgba(6, 182, 212, 0.4)',   // cyan
                            'rgba(147, 51, 234, 0.3)',  // purple variant
                            'rgba(20, 184, 166, 0.3)',  // cyan variant
                          ];
                          const color = colors[(rowIndex + colIndex) % colors.length];
                          
                          return (
                            <div
                              key={colIndex}
                              className="w-3 h-3 rounded-sm transition-all duration-300"
                              style={{
                                backgroundColor: color,
                                opacity: 0.3 + (rowIndex * 0.08),
                                animation: `float ${3 + colIndex * 0.5}s ease-in-out infinite`,
                                animationDelay: `${colIndex * 0.1}s`,
                              }}
                            />
                          );
                        })}
                      </div>
                    ))}
                  </div>
                </div>
              </nav>

              <style>{`
                @keyframes float {
                  0%, 100% { transform: translateY(0px); }
                  50% { transform: translateY(-4px); }
                }
              `}</style>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
