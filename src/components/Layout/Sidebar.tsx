import { useState, useEffect } from "react";
import { Button } from "@/components/ui/enhanced-button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import SmartChat from "@/components/Chat/SmartChat";

import DesignTab from "./SidebarTabs/DesignTab";
import ContentTab from "./SidebarTabs/ContentTab";
import ImagesTab from "./SidebarTabs/ImagesTab";
import SellerbotTab from "./SidebarTabs/SellerbotTab";
import SEOTab from "./SidebarTabs/SEOTab";
import LayoutTab from "./SidebarTabs/LayoutTab";
import BriefingTab from "./SidebarTabs/BriefingTab";
import { BusinessContent } from "@/services/contentGenerator";
import { landingPageBuilder } from "@/services/landingPageBuilder";
import { useLanguage } from "@/contexts/LanguageContext";
import { 
  Layout, 
  Palette, 
  Type, 
  Image, 
  MessageCircle, 
  Download,
  Settings,
  Play,
  Eye,
  FileText,
  RefreshCw,
  Bot
} from "lucide-react";
import { toast } from "sonner";

import { LogOut } from "lucide-react";
import { AuthService } from "@/services/authService";

interface SidebarProps {
  onLandingPageGenerated: (html: string, data: BusinessContent) => void;
  businessData?: BusinessContent | null;
  onLogout: () => void;
  activeTab?: string;
  setActiveTab?: (tab: string) => void;
  isMobile?: boolean;
}

const businessThemes = [
  { value: "restaurante", label: "Restaurante / Bar / Café" },
  { value: "ecommerce", label: "E-commerce / Loja Online" },
  { value: "servicos", label: "Serviços Profissionais" },
  { value: "saude", label: "Saúde / Clínica / Medicina" },
  { value: "educacao", label: "Educação / Curso / Escola" },
  { value: "fitness", label: "Academia / Fitness / Esportes" },
  { value: "beleza", label: "Beleza / Estética / Salão" },
  { value: "tecnologia", label: "Tecnologia / Software / TI" },
  { value: "consultoria", label: "Consultoria / Coaching" },
  { value: "imobiliario", label: "Imobiliário / Construção" },
  { value: "advocacia", label: "Advocacia / Jurídico" },
  { value: "contabilidade", label: "Contabilidade / Financeiro" },
  { value: "pet", label: "Pet Shop / Veterinário" },
  { value: "turismo", label: "Turismo / Viagem / Hotel" },
  { value: "eventos", label: "Eventos / Festas / Casamentos" },
  { value: "automotivo", label: "Automotivo / Oficina" },
  { value: "moda", label: "Moda / Roupas / Acessórios" },
  { value: "arte", label: "Arte / Design / Criativo" },
  { value: "agricultura", label: "Agricultura / Rural" },
  { value: "marketplace", label: "Marketplace / Plataforma" }
];

const Sidebar: React.FC<SidebarProps> = ({ 
  onLandingPageGenerated, 
  businessData: externalBusinessData, 
  onLogout,
  activeTab: externalActiveTab,
  setActiveTab: externalSetActiveTab,
  isMobile = false
}) => {
  const [internalActiveTab, setInternalActiveTab] = useState("chatbot");
  const { t, language } = useLanguage();
  
  const activeTab = externalActiveTab || internalActiveTab;
  const setActiveTab = externalSetActiveTab || setInternalActiveTab;
  const [businessData, setBusinessData] = useState<BusinessContent | undefined>();
  const [briefingData, setBriefingData] = useState({
    businessTheme: "",
    businessName: "",
    businessType: "",
    description: "",
    targetAudience: "",
    mainGoal: "",
    keyServices: "",
    contactInfo: "",
    whatsapp: "",
    address: "",
    specialOffers: "",
    customLogo: null as File | null
  });
  
  const handleLandingPageGeneratedInternal = (html: string, data: BusinessContent) => {
    setBusinessData(data);
    onLandingPageGenerated(html, data);
  };

  // Sync external businessData with internal state
  useEffect(() => {
    if (externalBusinessData) {
      setBusinessData(externalBusinessData);
    }
  }, [externalBusinessData]);

  const handleUpdateLandingPage = async () => {
    if (businessData) {
      try {
        const updatedHTML = await landingPageBuilder.generateHTML(businessData);
        onLandingPageGenerated(updatedHTML, businessData);
        toast.success('Landing page atualizada com sucesso!');
      } catch (error) {
        toast.error('Erro ao atualizar landing page');
      }
    } else {
      toast.error('Nenhuma landing page para atualizar');
    }
  };

  const tabs = [
    { id: "chatbot", label: "Chat", icon: MessageCircle },
    { id: "briefing", label: "Briefing", icon: FileText },
    { id: "content", label: "Conteúdo", icon: Type },
    { id: "sellerbot", label: "Sellerbot", icon: Bot },
    { id: "seo", label: "SEO", icon: Settings },
    { id: "design", label: "Design", icon: Palette },
    { id: "layout", label: "Layouts", icon: Layout },
    { id: "images", label: "Imagens", icon: Image },
  ];

  const handleBriefingChange = (field: string, value: string | File | null) => {
    setBriefingData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validar se é uma imagem
      if (file.type.startsWith('image/')) {
        handleBriefingChange("customLogo", file);
      } else {
        toast.error('Por favor, selecione um arquivo de imagem válido');
      }
    }
  };

  const getBriefingPrompt = () => {
    const { businessTheme, businessName, businessType, description, targetAudience, mainGoal, keyServices, contactInfo, whatsapp, address, specialOffers } = briefingData;
    const logoInfo = briefingData.customLogo ? `O cliente enviou um logo personalizado: ${briefingData.customLogo.name}` : '';
    return `Criar landing page para ${businessName}, um ${businessType} (tema: ${businessTheme}). Descrição: ${description}. Público-alvo: ${targetAudience}. Objetivo principal: ${mainGoal}. Serviços principais: ${keyServices}. WhatsApp: ${whatsapp}. Endereço: ${address}. Contato: ${contactInfo}. Ofertas especiais: ${specialOffers}. ${logoInfo}`;
  };


  return (
    <aside className={`${isMobile ? 'w-full' : 'w-80'} ${!isMobile && 'border-r'} border-border bg-card/50 backdrop-blur`}>
      {!isMobile && (
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between mb-4">
            <img 
              src="/lovable-uploads/f5de4620-c0b4-4faf-84c8-6c8733528789.png" 
              alt="PageJet" 
              className="h-8 object-contain"
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                AuthService.logout();
                onLogout();
              }}
              className="p-2 h-8 w-8"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="flex gap-0.5 bg-muted p-1 rounded-lg">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex items-center justify-center px-1.5 py-2 rounded-md text-sm transition-all ${
                    activeTab === tab.id
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </button>
              );
            })}
          </div>
        </div>
      )}

      {isMobile && (
        <div className="p-4 border-b border-border">
          <div className="flex items-center gap-3 mb-4">
            <img 
              src="/lovable-uploads/f5de4620-c0b4-4faf-84c8-6c8733528789.png" 
              alt="PageJet" 
              className="h-6 object-contain"
            />
            <div>
              <h2 className="text-lg font-bold text-foreground">
                {tabs.find(t => t.id === activeTab)?.label || 'PageJet'}
              </h2>
              <p className="text-xs text-muted-foreground">Criador de Landing Pages</p>
            </div>
          </div>
        </div>
      )}

      <div className={`p-4 space-y-4 ${isMobile ? 'max-h-[calc(85vh-120px)] mobile-scroll' : 'max-h-[calc(100vh-200px)]'} overflow-y-auto`}>
        {activeTab === "briefing" && (
          <BriefingTab onLandingPageGenerated={onLandingPageGenerated} />
        )}

        {activeTab === "design" && (
          <DesignTab 
            businessData={businessData}
            onLandingPageGenerated={handleLandingPageGeneratedInternal}
          />
        )}

        {activeTab === "content" && (
          <ContentTab 
            businessData={businessData}
            onContentUpdate={setBusinessData}
            onLandingPageGenerated={handleLandingPageGeneratedInternal}
          />
        )}

        {activeTab === "images" && (
          <ImagesTab 
            businessData={businessData}
            onLandingPageGenerated={handleLandingPageGeneratedInternal}
          />
        )}

        {activeTab === "sellerbot" && (
          <SellerbotTab 
            businessData={businessData}
            onLandingPageGenerated={onLandingPageGenerated}
          />
        )}

        {activeTab === "chatbot" && (
          <div className="space-y-4">
            <h3 className="font-medium text-foreground">PageJet IA - Gerador de Landing Page</h3>
            
            <div className={`${isMobile ? 'h-[50vh] mobile-chat' : 'h-[400px]'} bg-gradient-card rounded-lg border border-border/50`}>
              <SmartChat 
                onLandingPageGenerated={handleLandingPageGeneratedInternal}
        briefingPrompt={businessData ? `Negócio gerado: ${businessData.title}` : undefined}
        isIntegrated={true}
        onNavigateToBriefing={() => setActiveTab("briefing")}
              />
            </div>
          </div>
        )}

        {activeTab === "layout" && (
          <LayoutTab 
            businessData={businessData}
            onLandingPageGenerated={handleLandingPageGeneratedInternal}
          />
        )}

        {activeTab === "seo" && (
          <SEOTab 
            businessData={businessData}
            onLandingPageGenerated={onLandingPageGenerated}
          />
        )}
      </div>

      {/* Update Button */}
      <div className="p-4 border-t border-border">
        <Button 
          variant="hero" 
          className="w-full"
          onClick={handleUpdateLandingPage}
          disabled={!businessData}
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Atualizar Landing Page
        </Button>
      </div>

    </aside>
  );
};

export default Sidebar;