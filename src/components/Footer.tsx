import logoImage from "../assets/fdbafc2f1e7edb4d213deafbca8c80c666dccbae.png";
import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="border-t border-white/5 px-6 lg:px-8 py-12">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Copyright - Better mobile layout */}
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 text-center sm:text-left">
            <div className="flex items-center gap-3">
              <img src={logoImage} alt="UnleakTrade" className="h-6 w-6" />
              <span className="text-sm text-white/60">© 2026 UnleakTrade</span>
            </div>
            <span className="hidden sm:inline text-white/60">—</span>
            <span className="text-sm text-white/60">
              An independent project built by{" "}
              <Link
                to="/builder"
                className="text-purple-400 hover:text-purple-300 transition-colors underline decoration-dotted underline-offset-2"
              >
                whyvrafvr
              </Link>
            </span>
          </div>
          
          {/* Social links */}
          <div className="flex items-center gap-8">
            <a href="https://github.com/unleaktrade" target="_blank" rel="noopener noreferrer" className="text-sm text-white/40 hover:text-white/60 transition-colors">
              GitHub
            </a>
            <a href="https://twitter.com/unleaktrade" target="_blank" rel="noopener noreferrer" className="text-sm text-white/40 hover:text-white/60 transition-colors">
              Twitter
            </a>
            <a href="https://t.me/+dwi3eXR9Q1Q4NjE0" target="_blank" rel="noopener noreferrer" className="text-sm text-white/40 hover:text-white/60 transition-colors">
              Telegram
            </a>
            <a href="https://discord.gg/h9Qb9S7Qjx" target="_blank" rel="noopener noreferrer" className="text-sm text-white/40 hover:text-white/60 transition-colors">
              Discord
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
