import logoImage from "figma:asset/fdbafc2f1e7edb4d213deafbca8c80c666dccbae.png";

export function Footer() {
  return (
    <footer className="border-t border-white/5 px-6 lg:px-8 py-12">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-3">
            <img src={logoImage} alt="UnleakTrade" className="h-6 w-6" />
            <span className="text-sm text-white/60">© 2025 UnleakTrade</span>
          </div>
          
          <div className="flex items-center gap-8">
            <a href="https://github.com/unleaktrade" target="_blank" rel="noopener noreferrer" className="text-sm text-white/40 hover:text-white/60 transition-colors">
              GitHub
            </a>
            <a href="https://twitter.com/unleaktrade" target="_blank" rel="noopener noreferrer" className="text-sm text-white/40 hover:text-white/60 transition-colors">
              Twitter
            </a>
            <a href="https://discord.gg/ytPhdQZMbr" target="_blank" rel="noopener noreferrer" className="text-sm text-white/40 hover:text-white/60 transition-colors">
              Discord
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
