import logoImage from "figma:asset/fdbafc2f1e7edb4d213deafbca8c80c666dccbae.png";

export function Navigation() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/5">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <img src={logoImage} alt="UmbraTrade" className="h-8 w-8" />
            <span className="tracking-tight">UmbraTrade</span>
          </div>
          
          <div className="flex items-center gap-8">
            <a href="#learn" className="text-sm text-white/60 hover:text-white transition-colors">
              Learn more
            </a>
            <a href="#team" className="text-sm text-white/60 hover:text-white transition-colors">
              Team
            </a>
            <a href="#faq" className="text-sm text-white/60 hover:text-white transition-colors">
              FAQ
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}
