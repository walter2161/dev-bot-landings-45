import { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/enhanced-button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { 
  Menu, 
  MessageCircle, 
  FileText, 
  Type, 
  Bot, 
  Settings, 
  Palette, 
  Layout, 
  Image,
  Eye,
  Download,
  LogOut
} from "lucide-react";
import { BusinessContent } from "@/services/contentGenerator";
import Sidebar from "./Sidebar";
import PreviewFrame from "@/components/LandingPageBuilder/PreviewFrame";
import { AuthService } from "@/services/authService";
import MobileFAB from "@/components/Mobile/MobileFAB";

interface MobileLayoutProps {
  onLogout: () => void;
}

const MobileLayout = ({ onLogout }: MobileLayoutProps) => {
  const [activeTab, setActiveTab] = useState("chat");
  const [generatedHTML, setGeneratedHTML] = useState<string>();
  const [businessData, setBusinessData] = useState<BusinessContent>();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const handleLandingPageGenerated = (html: string, data: BusinessContent) => {
    setGeneratedHTML(html);
    setBusinessData(data);
    setShowPreview(true);
  };

  const mobileNavItems = [
    { id: "chat", label: "Chat", icon: MessageCircle },
    { id: "briefing", label: "Briefing", icon: FileText },
    { id: "content", label: "Conteúdo", icon: Type },
    { id: "design", label: "Design", icon: Palette },
    { id: "preview", label: "Preview", icon: Eye },
  ];

  const handleTabChange = (tabId: string) => {
    if (tabId === "preview") {
      setShowPreview(true);
    } else {
      setShowPreview(false);
      setActiveTab(tabId);
      setIsSidebarOpen(true);
    }
  };

  if (showPreview) {
    return (
      <div className="h-screen bg-background flex flex-col">
        {/* Mobile Preview Header */}
        <div className="bg-card/90 backdrop-blur border-b border-border/50 p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="mobile"
              size="sm"
              onClick={() => setShowPreview(false)}
              className="p-2 h-10 w-10 text-foreground hover:text-white"
            >
              ←
            </Button>
            <img 
              src="/lovable-uploads/f5de4620-c0b4-4faf-84c8-6c8733528789.png" 
              alt="PageJet" 
              className="h-6 object-contain"
            />
            <span className="text-base font-semibold text-foreground">Preview</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="hero" size="sm" className="text-sm font-medium">
              <Download className="w-4 h-4 mr-2" />
              Baixar
            </Button>
          </div>
        </div>

        {/* Preview Content */}
        <div className="flex-1">
          <PreviewFrame 
            generatedHTML={generatedHTML} 
            businessData={businessData} 
          />
        </div>

        {/* Mobile Navigation */}
        <div className="bg-card/90 backdrop-blur border-t border-border/50 p-3 mobile-safe-area">
          <div className="flex justify-around">
            {mobileNavItems.map((item) => {
              const Icon = item.icon;
              return (
                <Button
                  key={item.id}
                  variant={item.id === "preview" ? "hero" : "mobile"}
                  size="sm"
                  onClick={() => handleTabChange(item.id)}
                  className="flex flex-col items-center gap-1 h-auto py-3 px-4 min-h-[56px] min-w-[56px] text-foreground hover:text-white"
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-xs font-medium">{item.label}</span>
                </Button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-background flex flex-col">
      {/* Mobile Header */}
      <div className="bg-card/90 backdrop-blur border-b border-border/50 p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img 
            src="/lovable-uploads/f5de4620-c0b4-4faf-84c8-6c8733528789.png" 
            alt="PageJet" 
            className="h-6 object-contain"
          />
          <div>
            <h1 className="text-xl font-bold text-foreground">PageJet</h1>
            <p className="text-sm text-muted-foreground">Mobile Creator</p>
          </div>
        </div>
        
        <Button
          variant="mobile"
          size="sm"
          onClick={() => {
            AuthService.logout();
            onLogout();
          }}
          className="p-2 h-10 w-10 text-foreground hover:text-white"
        >
          <LogOut className="w-5 h-5" />
        </Button>
      </div>

      {/* Mobile Content */}
      <div className="flex-1 relative">
        <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
          <SheetContent side="bottom" className="h-[85vh] p-0 mobile-sheet">
            <div className="h-full">
              <Sidebar 
                onLandingPageGenerated={handleLandingPageGenerated}
                businessData={businessData}
                onLogout={onLogout}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                isMobile={true}
              />
            </div>
          </SheetContent>
        </Sheet>

        {/* Welcome Screen */}
        <div className="p-6 text-center space-y-8">
          <div className="space-y-3">
            <h2 className="text-3xl font-bold text-foreground">
              Crie sua Landing Page
            </h2>
            <p className="text-lg text-muted-foreground">
              Use nossa IA para criar páginas profissionais em minutos
            </p>
          </div>

          <div className="space-y-4">
            <Button 
              variant="hero" 
              size="xl" 
              className="w-full py-6 text-lg font-semibold"
              onClick={() => {
                setActiveTab("chat");
                setIsSidebarOpen(true);
              }}
            >
              <MessageCircle className="w-6 h-6 mr-3" />
              Começar com Chat IA
            </Button>

            <Button 
              variant="outline" 
              size="xl" 
              className="w-full py-6 text-lg font-semibold bg-background/50 backdrop-blur border-2 border-accent/30 text-foreground hover:bg-accent/10 hover:border-accent/50"
              onClick={() => {
                setActiveTab("briefing");
                setIsSidebarOpen(true);
              }}
            >
              <FileText className="w-6 h-6 mr-3" />
              Preencher Formulário
            </Button>
          </div>

          {generatedHTML && (
            <div className="pt-6 border-t border-border/30">
              <Button 
                variant="hero" 
                size="xl" 
                className="w-full py-6 text-lg font-semibold"
                onClick={() => setShowPreview(true)}
              >
                <Eye className="w-6 h-6 mr-3" />
                Ver Prévia
              </Button>
            </div>
          )}
        </div>

        {/* Floating Action Button */}
        {!generatedHTML && (
          <MobileFAB
            onChatOpen={() => {
              setActiveTab("chat");
              setIsSidebarOpen(true);
            }}
            onBriefingOpen={() => {
              setActiveTab("briefing");
              setIsSidebarOpen(true);
            }}
          />
        )}
      </div>

      {/* Mobile Navigation */}
      <div className="bg-card/90 backdrop-blur border-t border-border/50 p-3 mobile-safe-area">
        <div className="flex justify-around">
          {mobileNavItems.slice(0, 4).map((item) => {
            const Icon = item.icon;
            return (
              <Button
                key={item.id}
                variant="mobile"
                size="sm"
                onClick={() => handleTabChange(item.id)}
                className="flex flex-col items-center gap-1 h-auto py-3 px-4 min-h-[56px] min-w-[56px] text-foreground hover:text-white"
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs font-medium">{item.label}</span>
              </Button>
            );
          })}
          
          <Button
            variant={generatedHTML ? "hero" : "mobile"}
            size="sm"
            onClick={() => setShowPreview(true)}
            disabled={!generatedHTML}
            className="flex flex-col items-center gap-1 h-auto py-3 px-4 min-h-[56px] min-w-[56px] text-foreground hover:text-white disabled:text-muted-foreground disabled:hover:text-muted-foreground"
          >
            <Eye className="w-5 h-5" />
            <span className="text-xs font-medium">Preview</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MobileLayout;