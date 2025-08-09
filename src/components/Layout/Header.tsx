import { Bot, Code, Palette, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/enhanced-button";

const Header = () => {
  return (
    <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-hero rounded-lg flex items-center justify-center">
              <Bot className="w-5 h-5 text-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">ChatDev</h1>
              <p className="text-xs text-muted-foreground">Landing Page Generator</p>
            </div>
          </div>
        </div>
        
        <nav className="hidden md:flex items-center gap-6">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Palette className="w-4 h-4" />
            <span>Customização</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Sparkles className="w-4 h-4" />
            <span>IA Assistant</span>
          </div>
        </nav>

        <div className="flex items-center gap-3">
          <div className="text-xs text-muted-foreground">
            ChatDev AI - Powered by Mistral
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;