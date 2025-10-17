import { Youtube, Twitter, Send, Coffee } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-transparent border-t border-white/20 mt-16 lg:mt-24">
      <div className="px-4 lg:px-16 py-6 lg:py-8 flex flex-col md:flex-row justify-between items-center gap-4">
        {/* Left: Copyright */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>© {new Date().getFullYear()} AlAnsarMedia </span>
        </div>

        {/* Right: Social Links */}
        <div className="flex items-center gap-4">
          <a 
            href="https://www.youtube.com/@PureTawheedMedia" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-foreground transition-colors"
            aria-label="YouTube"
          >
            <Youtube className="h-5 w-5" />
          </a>
          <a 
            href="https://x.com/PureTawheed_" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Twitter/X"
          >
            <Twitter className="h-5 w-5" />
          </a>
          <a 
            href="https://t.me/PureTawheedMedia" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Telegram"
          >
            <Send className="h-5 w-5" />
          </a>
          <a 
            href="https://coff.ee/puretawheed" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Donate"
          >
            <Coffee className="h-5 w-5" />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
