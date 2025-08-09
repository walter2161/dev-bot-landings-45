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
import { BusinessContent } from "@/services/contentGenerator";
import { landingPageBuilder } from "@/services/landingPageBuilder";
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

interface SidebarProps {
  onLandingPageGenerated: (html: string, data: BusinessContent) => void;
  businessData?: BusinessContent | null;
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

const Sidebar: React.FC<SidebarProps> = ({ onLandingPageGenerated, businessData: externalBusinessData }) => {
  const [activeTab, setActiveTab] = useState("chatbot");
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
    <aside className="w-80 border-r border-border bg-card/50 backdrop-blur">
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-3 mb-4">
          {businessData?.images?.logo ? (
            <img 
              src={businessData.images.logo} 
              alt="Logo" 
              className="w-8 h-8 rounded-lg object-cover"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                const nextEl = e.currentTarget.nextElementSibling as HTMLElement;
                if (nextEl) nextEl.style.display = 'flex';
              }}
            />
          ) : null}
          <div className={`w-8 h-8 bg-gradient-hero rounded-lg flex items-center justify-center ${businessData?.images?.logo ? 'hidden' : 'flex'}`}>
            <Bot className="w-5 h-5 text-foreground" />
          </div>
          <div>
            <h2 className="font-semibold text-foreground">
              {businessData?.title || 'ChatDev'}
            </h2>
            <p className="text-xs text-muted-foreground">
              {businessData?.subtitle || 'Landing Page Generator'}
            </p>
          </div>
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

      <div className="p-4 space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto">
        {activeTab === "briefing" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-foreground">Briefing da Landing Page</h3>
              <Badge variant="secondary" className="text-xs">Formulário</Badge>
            </div>
            
            <Card className="p-4 bg-gradient-card space-y-4">
              <div className="space-y-2">
                <Label htmlFor="businessTheme" className="text-sm font-medium text-foreground">Tema do Negócio</Label>
                <Select
                  value={briefingData.businessTheme}
                  onValueChange={(value) => handleBriefingChange("businessTheme", value)}
                >
                  <SelectTrigger className="bg-background/50 border-border">
                    <SelectValue placeholder="Escolha um tema para seu negócio" />
                  </SelectTrigger>
                  <SelectContent className="max-h-60 bg-background border-border">
                    {businessThemes.map((theme) => (
                      <SelectItem key={theme.value} value={theme.value}>
                        {theme.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="businessName" className="text-sm font-medium text-foreground">Nome do Negócio</Label>
                <Input
                  id="businessName"
                  value={briefingData.businessName}
                  onChange={(e) => handleBriefingChange("businessName", e.target.value)}
                  placeholder="Ex: Petshop Happy Dogs"
                  className="bg-background/50 border-border"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="customLogo" className="text-sm font-medium text-foreground">Logo da Empresa (Opcional)</Label>
                <div className="space-y-2">
                  <Input
                    id="customLogo"
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="bg-background/50 border-border file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-primary file:text-primary-foreground hover:file:bg-primary/80"
                  />
                  {briefingData.customLogo && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Badge variant="outline" className="text-xs">
                        {briefingData.customLogo.name}
                      </Badge>
                    </div>
                  )}
                  <p className="text-xs text-muted-foreground">
                    Envie seu logo em formato PNG, JPG ou SVG para personalizar sua landing page
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="businessType" className="text-sm font-medium text-foreground">Tipo de Negócio</Label>
                <Input
                  id="businessType"
                  value={briefingData.businessType}
                  onChange={(e) => handleBriefingChange("businessType", e.target.value)}
                  placeholder="Ex: Petshop, Restaurante, Academia"
                  className="bg-background/50 border-border"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-sm font-medium text-foreground">Descrição do Negócio</Label>
                <Textarea
                  id="description"
                  value={briefingData.description}
                  onChange={(e) => handleBriefingChange("description", e.target.value)}
                  placeholder="Descreva brevemente seu negócio..."
                  className="bg-background/50 border-border resize-none"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="targetAudience" className="text-sm font-medium text-foreground">Público-Alvo</Label>
                <Input
                  id="targetAudience"
                  value={briefingData.targetAudience}
                  onChange={(e) => handleBriefingChange("targetAudience", e.target.value)}
                  placeholder="Ex: Donos de pets, Famílias"
                  className="bg-background/50 border-border"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="mainGoal" className="text-sm font-medium text-foreground">Objetivo Principal</Label>
                <Input
                  id="mainGoal"
                  value={briefingData.mainGoal}
                  onChange={(e) => handleBriefingChange("mainGoal", e.target.value)}
                  placeholder="Ex: Aumentar agendamentos"
                  className="bg-background/50 border-border"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="keyServices" className="text-sm font-medium text-foreground">Serviços Principais</Label>
                <Textarea
                  id="keyServices"
                  value={briefingData.keyServices}
                  onChange={(e) => handleBriefingChange("keyServices", e.target.value)}
                  placeholder="Liste os principais serviços..."
                  className="bg-background/50 border-border resize-none"
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="whatsapp" className="text-sm font-medium text-foreground">WhatsApp</Label>
                <Input
                  id="whatsapp"
                  value={briefingData.whatsapp}
                  onChange={(e) => handleBriefingChange("whatsapp", e.target.value)}
                  placeholder="Ex: (11) 99999-9999"
                  className="bg-background/50 border-border"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address" className="text-sm font-medium text-foreground">Endereço</Label>
                <Input
                  id="address"
                  value={briefingData.address}
                  onChange={(e) => handleBriefingChange("address", e.target.value)}
                  placeholder="Rua, cidade, estado..."
                  className="bg-background/50 border-border"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contactInfo" className="text-sm font-medium text-foreground">Outras Informações de Contato</Label>
                <Input
                  id="contactInfo"
                  value={briefingData.contactInfo}
                  onChange={(e) => handleBriefingChange("contactInfo", e.target.value)}
                  placeholder="Email, telefone comercial..."
                  className="bg-background/50 border-border"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="specialOffers" className="text-sm font-medium text-foreground">Ofertas Especiais</Label>
                <Textarea
                  id="specialOffers"
                  value={briefingData.specialOffers}
                  onChange={(e) => handleBriefingChange("specialOffers", e.target.value)}
                  placeholder="Promoções, descontos, pacotes..."
                  className="bg-background/50 border-border resize-none"
                  rows={2}
                />
              </div>
              
              <Button 
                variant="hero" 
                className="w-full"
                onClick={() => {
                  setActiveTab("chatbot");
                  // Trigger automatic generation with briefing data
                  const briefingPrompt = getBriefingPrompt();
                  if (briefingData.businessName && briefingData.businessType) {
                    // Send briefing data to chat automatically
                    setTimeout(() => {
                      const event = new CustomEvent('auto-generate-landing-page', {
                        detail: { prompt: briefingPrompt }
                      });
                      window.dispatchEvent(event);
                    }, 100);
                  }
                }}
              >
                Atualizar ChatDev
              </Button>
            </Card>
          </div>
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
            <h3 className="font-medium text-foreground">ChatDev IA - Gerador de Landing Page</h3>
            
            <div className="h-[400px] bg-gradient-card rounded-lg border border-border/50">
              <SmartChat 
                onLandingPageGenerated={handleLandingPageGeneratedInternal}
                briefingPrompt={getBriefingPrompt()}
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