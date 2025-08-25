import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/enhanced-button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { BusinessContent } from "@/services/contentGenerator";
import { Upload, Palette, Check, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { agentOrchestrator } from "@/services/agents/orchestrator";

interface BriefingTabProps {
  onLandingPageGenerated: (html: string, data: BusinessContent) => void;
}

const BriefingTab = ({ onLandingPageGenerated }: BriefingTabProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [briefingData, setBriefingData] = useState({
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
    customLogo: null as File | null,
    colorPalette: "",
    landingPageType: "simples" as "simples" | "avancada" | "completa"
  });

  const colorPalettes = [
    { id: "azul-confianca", label: "Azul Confiança", colors: ["#0066CC", "#004C99", "#FFB700"], preview: "linear-gradient(135deg, #0066CC, #004C99)" },
    { id: "verde-saude", label: "Verde Saúde", colors: ["#00A651", "#007A3D", "#E8F5E8"], preview: "linear-gradient(135deg, #00A651, #007A3D)" },
    { id: "laranja-energia", label: "Laranja Energia", colors: ["#FF6B35", "#E85A2B", "#FFF4F0"], preview: "linear-gradient(135deg, #FF6B35, #E85A2B)" },
    { id: "roxo-luxo", label: "Roxo Luxo", colors: ["#6A4C93", "#472D5B", "#F4F0F7"], preview: "linear-gradient(135deg, #6A4C93, #472D5B)" },
    { id: "vermelho-paixao", label: "Vermelho Paixão", colors: ["#E74C3C", "#C0392B", "#FADBD8"], preview: "linear-gradient(135deg, #E74C3C, #C0392B)" },
    { id: "ouro-premium", label: "Ouro Premium", colors: ["#D4AF37", "#B8941F", "#FDF6E3"], preview: "linear-gradient(135deg, #D4AF37, #B8941F)" }
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
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error("Arquivo muito grande. Máximo 5MB.");
        return;
      }
      if (!file.type.startsWith('image/')) {
        toast.error("Por favor, selecione uma imagem válida.");
        return;
      }
      handleBriefingChange("customLogo", file);
      toast.success("Logo carregado com sucesso!");
    }
  };

  const getBriefingPrompt = () => {
    const { businessName, businessType, description, targetAudience, mainGoal, keyServices, contactInfo, whatsapp, address, specialOffers, customLogo, colorPalette, landingPageType } = briefingData;
    
    const selectedPalette = colorPalettes.find(p => p.id === colorPalette);
    const logoInfo = customLogo ? `IMPORTANTE: O cliente enviou um logo personalizado (${customLogo.name}). Use EXATAMENTE o nome da empresa "${businessName}" e incorpore o logo enviado pelo cliente na landing page. NÃO gere uma imagem genérica no lugar do logo.` : '';
    const paletteInfo = selectedPalette ? `PALETA DE CORES OBRIGATÓRIA: Use exatamente estas cores - Primária: ${selectedPalette.colors[0]}, Secundária: ${selectedPalette.colors[1]}, Destaque: ${selectedPalette.colors[2]}. NÃO use outras cores.` : '';
    
    const lpTypeInfo = {
      simples: `TIPO DE LANDING PAGE: SIMPLES (10 seções) - Cabeçalho minimalista, Hero Section, Benefícios rápidos (3-4 ícones), Depoimento/prova social, Sobre o produto/serviço, Comparação rápida, CTA destacado, Pricing simples, FAQ (3-4 perguntas), CTA final`,
      avancada: `TIPO DE LANDING PAGE: AVANÇADA (20 seções) - Cabeçalho com CTA, Hero Section com vídeo, Problema x Solução, Benefícios com ícones, Prova social (logos), Sobre produto (mockup), Comparativo antes/depois, Depoimentos carrossel, Estatísticas animadas, CTA central, Recursos detalhados, Demonstração vídeo, Equipe/expert, Pricing Table (3 planos), Garantia, FAQ (5-6 perguntas), Oferta limitada, Download bônus, CTA final, Footer`,
      completa: `TIPO DE LANDING PAGE: COMPLETA (30 seções) - Cabeçalho sticky, Hero com vídeo animado, Sub-headline, Problema x Solução visual, Benefícios cards, Storytelling, Prova social logos, Showcase produto, Comparativo slider, Recursos expandidos, Demonstração vídeo, Case sucesso, Depoimentos carrossel, Depoimentos vídeo, Estatísticas impacto, Equipe/expert, Awards/certificações, Pricing Table 3 opções, Garantia selo, Oferta especial, CTA intermediário, FAQ (7-8 perguntas), Evento/webinar, Comparativo concorrentes, Callout inspiracional, CTA secundário, Oferta limitada contador, Bônus digital, CTA final poderoso, Footer premium`
    };
    
    return `BRIEFING DETALHADO - SIGA EXATAMENTE ESTAS INFORMAÇÕES:

${logoInfo}

${paletteInfo}

${lpTypeInfo[landingPageType]}

INFORMAÇÕES DO NEGÓCIO:
- Nome da Empresa: ${businessName} (USE EXATAMENTE ESTE NOME)
- Tipo de Negócio: ${businessType}
- Descrição: ${description}
- Público-Alvo: ${targetAudience}
- Objetivo Principal: ${mainGoal}
- Serviços/Produtos: ${keyServices}
- Ofertas Especiais: ${specialOffers}

INFORMAÇÕES DE CONTATO:
- WhatsApp: ${whatsapp}
- Endereço: ${address}
- Outras Informações: ${contactInfo}

INSTRUÇÕES CRÍTICAS:
1. Use EXATAMENTE o nome "${businessName}" em toda a landing page
2. ${logoInfo ? 'USAR O LOGO ENVIADO PELO CLIENTE, não gerar imagens genéricas' : 'Criar logo apropriado para a empresa'}
3. ${paletteInfo ? 'APLICAR A PALETA DE CORES SELECIONADA OBRIGATORIAMENTE' : 'Escolher cores apropriadas para o negócio'}
4. Personalizar todo conteúdo baseado nas informações fornecidas
5. Incluir as ofertas especiais destacadamente se fornecidas
6. Usar as informações de contato exatas fornecidas
7. IMPORTANTE: TODOS os formulários e capturas de dados devem enviar informações diretamente para o WhatsApp ${whatsapp} - não usar envio por email ou banco de dados
8. Seguir EXATAMENTE o tipo de LP selecionado: ${landingPageType}

Crie uma landing page profissional e personalizada seguindo exatamente essas especificações.`;
  };

  const handleGenerate = async () => {
    if (!briefingData.businessName || !briefingData.businessType) {
      toast.error("Preencha pelo menos o nome da empresa e tipo de negócio");
      return;
    }

    setIsGenerating(true);

    try {
      const briefingPrompt = getBriefingPrompt();
      console.log('🎯 Gerando com briefing detalhado:', briefingPrompt);
      
      const { html, businessData } = await agentOrchestrator.generateLandingPage(briefingPrompt);
      
      // Se há logo customizado, adicionar ao businessData
      if (briefingData.customLogo) {
        const logoUrl = URL.createObjectURL(briefingData.customLogo);
        businessData.customImages = {
          ...businessData.customImages,
          logo: logoUrl
        };
        businessData.images = {
          ...businessData.images,
          logo: `Logo personalizado da empresa ${briefingData.businessName} (${briefingData.customLogo.name})`
        };
      }

      // Se há paleta selecionada, aplicar as cores
      if (briefingData.colorPalette) {
        const selectedPalette = colorPalettes.find(p => p.id === briefingData.colorPalette);
        if (selectedPalette) {
          businessData.colors = {
            primary: selectedPalette.colors[0],
            secondary: selectedPalette.colors[1],
            accent: selectedPalette.colors[2]
          };
        }
      }
      
      // Garantir que o nome da empresa está correto
      businessData.title = briefingData.businessName;

      onLandingPageGenerated(html, businessData);
      
      toast.success(`Landing page gerada para ${briefingData.businessName}!`);
    } catch (error) {
      console.error('Erro ao gerar landing page:', error);
      toast.error('Erro ao gerar landing page');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-medium text-foreground">Briefing da Landing Page</h3>
        <Badge variant="secondary" className="text-xs">
          <Sparkles className="w-3 h-3 mr-1" />
          Personalizado
        </Badge>
      </div>

      {/* Tipo de Landing Page */}
      <Card className="p-4 bg-gradient-card">
        <h4 className="font-medium text-sm mb-3 text-foreground">Tipo de Landing Page</h4>
        
        <div className="space-y-2">
          <div 
            className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
              briefingData.landingPageType === 'simples' 
                ? 'border-primary bg-primary/10' 
                : 'border-border/30 hover:border-border'
            }`}
            onClick={() => handleBriefingChange("landingPageType", "simples")}
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-sm">🚀 Landing Page Simples</div>
                <div className="text-xs text-muted-foreground">10 seções - Ideal para captura rápida</div>
              </div>
              <Badge variant="outline" className="text-xs">10 seções</Badge>
            </div>
          </div>
          
          <div 
            className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
              briefingData.landingPageType === 'avancada' 
                ? 'border-primary bg-primary/10' 
                : 'border-border/30 hover:border-border'
            }`}
            onClick={() => handleBriefingChange("landingPageType", "avancada")}
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-sm">⭐ Landing Page Avançada</div>
                <div className="text-xs text-muted-foreground">20 seções - Confiança e conversão</div>
              </div>
              <Badge variant="outline" className="text-xs">20 seções</Badge>
            </div>
          </div>
          
          <div 
            className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
              briefingData.landingPageType === 'completa' 
                ? 'border-primary bg-primary/10' 
                : 'border-border/30 hover:border-border'
            }`}
            onClick={() => handleBriefingChange("landingPageType", "completa")}
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-sm">💎 Landing Page Completa</div>
                <div className="text-xs text-muted-foreground">30 seções - Máxima persuasão</div>
              </div>
              <Badge variant="outline" className="text-xs">30 seções</Badge>
            </div>
          </div>
        </div>
      </Card>

      {/* Informações Básicas */}
      <Card className="p-4 bg-gradient-card">
        <h4 className="font-medium text-sm mb-3 text-foreground">Informações Básicas</h4>
        
        <div className="space-y-3">
          <div>
            <Label className="text-xs">Nome da Empresa *</Label>
            <Input
              value={briefingData.businessName}
              onChange={(e) => handleBriefingChange("businessName", e.target.value)}
              placeholder="Ex: LEDMKT, Petshop Amigos..."
              className="text-xs"
            />
          </div>

          <div>
            <Label className="text-xs">Logo da Empresa</Label>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => document.getElementById('logo-upload')?.click()}
                className="flex-1"
              >
                <Upload className="w-3 h-3 mr-1" />
                {briefingData.customLogo ? briefingData.customLogo.name : 'Enviar Logo'}
              </Button>
              {briefingData.customLogo && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleBriefingChange("customLogo", null)}
                >
                  ✕
                </Button>
              )}
            </div>
            <input
              id="logo-upload"
              type="file"
              accept="image/*"
              onChange={handleLogoUpload}
              style={{ display: 'none' }}
            />
          </div>

          <div>
            <Label className="text-xs">Tipo de Negócio *</Label>
            <Input
              value={briefingData.businessType}
              onChange={(e) => handleBriefingChange("businessType", e.target.value)}
              placeholder="Ex: Agência de Marketing, Petshop..."
              className="text-xs"
            />
          </div>
        </div>
      </Card>

      {/* Paleta de Cores */}
      <Card className="p-4 bg-gradient-card">
        <h4 className="font-medium text-sm mb-3 text-foreground flex items-center gap-2">
          <Palette className="w-4 h-4" />
          Paleta de Cores
        </h4>
        
        <div className="grid grid-cols-2 gap-2">
          {colorPalettes.map((palette) => (
            <button
              key={palette.id}
              onClick={() => handleBriefingChange("colorPalette", palette.id)}
              className={`p-2 rounded-lg border-2 transition-all ${
                briefingData.colorPalette === palette.id 
                  ? 'border-primary bg-primary/10' 
                  : 'border-border/30 hover:border-border'
              }`}
            >
              <div 
                className="w-full h-8 rounded mb-2"
                style={{ background: palette.preview }}
              />
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium">{palette.label}</span>
                {briefingData.colorPalette === palette.id && (
                  <Check className="w-3 h-3 text-primary" />
                )}
              </div>
            </button>
          ))}
        </div>
      </Card>

      {/* Descrição do Negócio */}
      <Card className="p-4 bg-gradient-card">
        <h4 className="font-medium text-sm mb-3 text-foreground">Descrição do Negócio</h4>
        
        <div className="space-y-3">
          <div>
            <Label className="text-xs">Descrição Geral</Label>
            <Textarea
              value={briefingData.description}
              onChange={(e) => handleBriefingChange("description", e.target.value)}
              placeholder="Descreva o que sua empresa faz, diferenciais..."
              rows={3}
              className="text-xs resize-none"
            />
          </div>

          <div>
            <Label className="text-xs">Público-Alvo</Label>
            <Input
              value={briefingData.targetAudience}
              onChange={(e) => handleBriefingChange("targetAudience", e.target.value)}
              placeholder="Ex: Donos de pets, Empresários, Mulheres 25-45 anos..."
              className="text-xs"
            />
          </div>

          <div>
            <Label className="text-xs">Objetivo Principal</Label>
            <Input
              value={briefingData.mainGoal}
              onChange={(e) => handleBriefingChange("mainGoal", e.target.value)}
              placeholder="Ex: Gerar leads, Vender produto, Agendar consultas..."
              className="text-xs"
            />
          </div>

          <div>
            <Label className="text-xs">Principais Serviços/Produtos</Label>
            <Textarea
              value={briefingData.keyServices}
              onChange={(e) => handleBriefingChange("keyServices", e.target.value)}
              placeholder="Liste os principais serviços ou produtos oferecidos..."
              rows={2}
              className="text-xs resize-none"
            />
          </div>
        </div>
      </Card>

      {/* Informações de Contato */}
      <Card className="p-4 bg-gradient-card">
        <h4 className="font-medium text-sm mb-3 text-foreground">Informações de Contato</h4>
        
        <div className="space-y-3">
          <div>
            <Label className="text-xs">WhatsApp</Label>
            <Input
              value={briefingData.whatsapp}
              onChange={(e) => handleBriefingChange("whatsapp", e.target.value)}
              placeholder="Ex: (11) 99999-9999"
              className="text-xs"
            />
          </div>

          <div>
            <Label className="text-xs">Endereço</Label>
            <Input
              value={briefingData.address}
              onChange={(e) => handleBriefingChange("address", e.target.value)}
              placeholder="Ex: Rua das Flores, 123 - São Paulo/SP"
              className="text-xs"
            />
          </div>

          <div>
            <Label className="text-xs">Outras Informações de Contato</Label>
            <Input
              value={briefingData.contactInfo}
              onChange={(e) => handleBriefingChange("contactInfo", e.target.value)}
              placeholder="Ex: email@empresa.com, (11) 3333-3333"
              className="text-xs"
            />
          </div>
        </div>
      </Card>

      {/* Ofertas Especiais */}
      <Card className="p-4 bg-gradient-card">
        <h4 className="font-medium text-sm mb-3 text-foreground">Ofertas Especiais</h4>
        
        <div>
          <Label className="text-xs">Promoções ou Ofertas Especiais</Label>
          <Textarea
            value={briefingData.specialOffers}
            onChange={(e) => handleBriefingChange("specialOffers", e.target.value)}
            placeholder="Ex: 50% OFF na primeira consulta, Frete grátis..."
            rows={2}
            className="text-xs resize-none"
          />
        </div>
      </Card>

      {/* Botão Gerar */}
      <Button
        onClick={handleGenerate}
        disabled={isGenerating || !briefingData.businessName || !briefingData.businessType}
        className="w-full bg-gradient-primary hover:shadow-primary transition-all duration-300"
      >
        {isGenerating ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground mr-2"></div>
            Gerando Landing Page...
          </>
        ) : (
          <>
            <Sparkles className="w-4 h-4 mr-2" />
            Gerar Landing Page Personalizada
          </>
        )}
      </Button>
    </div>
  );
};

export default BriefingTab;