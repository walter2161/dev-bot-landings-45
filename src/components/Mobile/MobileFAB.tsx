import { useState } from "react";
import { Button } from "@/components/ui/enhanced-button";
import { MessageCircle, Sparkles, Plus, X } from "lucide-react";

interface MobileFABProps {
  onChatOpen: () => void;
  onBriefingOpen: () => void;
  disabled?: boolean;
}

const MobileFAB = ({ onChatOpen, onBriefingOpen, disabled = false }: MobileFABProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (disabled) return null;

  return (
    <div className="fixed bottom-20 right-4 z-50">
      {isExpanded && (
        <div className="mb-4 space-y-3">
          <Button
            variant="hero"
            size="lg"
            onClick={() => {
              onChatOpen();
              setIsExpanded(false);
            }}
            className="shadow-lg hover:shadow-xl transition-all duration-300 w-full justify-start"
          >
            <MessageCircle className="w-5 h-5 mr-2" />
            Chat IA
          </Button>
          
            <Button
              variant="outline"
              size="lg"
              onClick={() => {
                onBriefingOpen();
                setIsExpanded(false);
              }}
              className="shadow-lg hover:shadow-xl transition-all duration-300 w-full justify-start bg-background/80 backdrop-blur border-2 border-accent/30 text-foreground hover:bg-accent/10 hover:border-accent/50"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Briefing
            </Button>
        </div>
      )}
      
      <Button
        variant={isExpanded ? "secondary" : "hero"}
        size="xl"
        onClick={() => setIsExpanded(!isExpanded)}
        className="h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
      >
        {isExpanded ? (
          <X className="w-6 h-6" />
        ) : (
          <Plus className="w-6 h-6" />
        )}
      </Button>
    </div>
  );
};

export default MobileFAB;