import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { BusinessContent } from "@/services/contentGenerator";
import { landingPageBuilder } from "@/services/landingPageBuilder";
import { toast } from "sonner";
import { Bot, MessageCircle, Phone, Mail, MapPin, MessageSquare } from "lucide-react";

interface SellerbotTabProps {
  businessData: BusinessContent | null;
  onLandingPageGenerated: (html: string, data: BusinessContent) => void;
}

const SellerbotTab: React.FC<SellerbotTabProps> = ({ businessData, onLandingPageGenerated }) => {
  const [sellerbotData, setSellerbotData] = useState({
    name: "",
    personality: "",
    knowledge: "",
    greeting: "",
    services: "",
    pricing: "",
    appointment: "",
    prohibitions: ""
  });

  const [businessInfo, setBusinessInfo] = useState({
    address: "",
    phone: "",
    email: "",
    whatsapp: ""
  });

  // Preencher os campos quando businessData é atualizado
  useEffect(() => {
    if (businessData) {
      setSellerbotData({
        name: businessData.sellerbot?.name || '',
        personality: businessData.sellerbot?.personality || '',
        knowledge: businessData.sellerbot?.knowledge?.join(', ') || '',
        greeting: businessData.sellerbot?.responses?.greeting || '',
        services: businessData.sellerbot?.responses?.services || '',
        pricing: businessData.sellerbot?.responses?.pricing || '',
        appointment: businessData.sellerbot?.responses?.appointment || '',
        prohibitions: businessData.sellerbot?.prohibitions || ''
      });

      setBusinessInfo({
        address: businessData.contact?.address || '',
        phone: businessData.contact?.phone || '',
        email: businessData.contact?.email || '',
        whatsapp: businessData.contact?.socialMedia?.whatsapp || ''
      });
    }
  }, [businessData]);

  const handleChange = (field: string, value: string) => {
    setSellerbotData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleBusinessChange = (field: string, value: string) => {
    setBusinessInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleUpdate = async () => {
    if (!businessData) {
      toast.error('Nenhuma landing page para atualizar');
      return;
    }

    console.log('Dados antes da atualização:', businessData.contact);
    console.log('Novos dados de contato:', businessInfo);

    try {
      const updatedData: BusinessContent = {
        ...businessData,
        contact: {
          ...businessData.contact,
          address: businessInfo.address.trim() || businessData.contact.address,
          phone: businessInfo.phone.trim() || businessData.contact.phone,
          email: businessInfo.email.trim() || businessData.contact.email,
          socialMedia: {
            ...businessData.contact.socialMedia,
            whatsapp: businessInfo.whatsapp.trim() || businessData.contact.socialMedia.whatsapp
          }
        },
        sellerbot: {
          name: sellerbotData.name.trim() || businessData.sellerbot.name,
          personality: sellerbotData.personality.trim() || businessData.sellerbot.personality,
          knowledge: sellerbotData.knowledge.trim() ? sellerbotData.knowledge.split(',').map(k => k.trim()) : businessData.sellerbot.knowledge,
          prohibitions: sellerbotData.prohibitions.trim() || businessData.sellerbot.prohibitions || "",
          responses: {
            greeting: sellerbotData.greeting.trim() || businessData.sellerbot.responses.greeting,
            services: sellerbotData.services.trim() || businessData.sellerbot.responses.services,
            pricing: sellerbotData.pricing.trim() || businessData.sellerbot.responses.pricing,
            appointment: sellerbotData.appointment.trim() || businessData.sellerbot.responses.appointment,
          }
        }
      };

      console.log('Dados finais para gerar HTML:', updatedData.contact);
      
      const updatedHTML = await landingPageBuilder.generateHTML(updatedData);
      onLandingPageGenerated(updatedHTML, updatedData);
      toast.success('Sellerbot atualizado com sucesso!');
    } catch (error) {
      toast.error('Erro ao atualizar sellerbot');
    }
  };

  if (!businessData) {
    return (
      <div className="p-6 text-center text-muted-foreground">
        <Bot className="h-12 w-12 mx-auto mb-4 opacity-50" />
        <p>Gere uma landing page primeiro para configurar o Sellerbot</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Informações do Negócio - Editáveis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Informações do Negócio
          </CardTitle>
          <CardDescription>
            Configure as informações de contato do seu negócio
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="business-address">Endereço</Label>
            <Input
              id="business-address"
              value={businessInfo.address}
              onChange={(e) => handleBusinessChange("address", e.target.value)}
              placeholder="Digite o endereço completo"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="business-phone">Telefone</Label>
            <Input
              id="business-phone"
              value={businessInfo.phone}
              onChange={(e) => handleBusinessChange("phone", e.target.value)}
              placeholder="(11) 99999-9999"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="business-email">Email</Label>
            <Input
              id="business-email"
              type="email"
              value={businessInfo.email}
              onChange={(e) => handleBusinessChange("email", e.target.value)}
              placeholder="contato@empresa.com"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="business-whatsapp">WhatsApp</Label>
            <Input
              id="business-whatsapp"
              value={businessInfo.whatsapp}
              onChange={(e) => handleBusinessChange("whatsapp", e.target.value)}
              placeholder="(11) 99999-9999"
            />
          </div>
        </CardContent>
      </Card>

      {/* Configurações Básicas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-4 w-4" />
            Configurações Básicas
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="sellerbot-name">Nome do Assistente</Label>
            <Input
              id="sellerbot-name"
              value={sellerbotData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              placeholder={businessData.sellerbot.name}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="sellerbot-personality">Personalidade</Label>
            <Textarea
              id="sellerbot-personality"
              value={sellerbotData.personality}
              onChange={(e) => handleChange("personality", e.target.value)}
              placeholder={businessData.sellerbot.personality}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="sellerbot-knowledge">Conhecimentos (separados por vírgula)</Label>
            <Textarea
              id="sellerbot-knowledge"
              value={sellerbotData.knowledge}
              onChange={(e) => handleChange("knowledge", e.target.value)}
              placeholder={businessData.sellerbot.knowledge?.join(", ")}
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="sellerbot-prohibitions">Restrições e Proibições</Label>
            <Textarea
              id="sellerbot-prohibitions"
              value={sellerbotData.prohibitions}
              onChange={(e) => handleChange("prohibitions", e.target.value)}
              placeholder="Descreva o que o sellerbot NÃO pode fazer ou falar..."
              rows={2}
            />
          </div>
        </CardContent>
      </Card>

      {/* Respostas Personalizadas */}
      <Card>
        <CardHeader>
          <CardTitle>Respostas Personalizadas</CardTitle>
          <CardDescription>
            Configure como o bot deve responder em situações específicas
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="sellerbot-greeting">Saudação Inicial</Label>
            <Textarea
              id="sellerbot-greeting"
              value={sellerbotData.greeting}
              onChange={(e) => handleChange("greeting", e.target.value)}
              placeholder={businessData.sellerbot.responses.greeting}
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="sellerbot-services">Apresentação de Serviços</Label>
            <Textarea
              id="sellerbot-services"
              value={sellerbotData.services}
              onChange={(e) => handleChange("services", e.target.value)}
              placeholder={businessData.sellerbot.responses.services}
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="sellerbot-pricing">Informações sobre Preços</Label>
            <Textarea
              id="sellerbot-pricing"
              value={sellerbotData.pricing}
              onChange={(e) => handleChange("pricing", e.target.value)}
              placeholder={businessData.sellerbot.responses.pricing}
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="sellerbot-appointment">Agendamento/Contato</Label>
            <Textarea
              id="sellerbot-appointment"
              value={sellerbotData.appointment}
              onChange={(e) => handleChange("appointment", e.target.value)}
              placeholder={businessData.sellerbot.responses.appointment}
              rows={2}
            />
          </div>
        </CardContent>
      </Card>

      <Separator />

      <Button 
        onClick={handleUpdate}
        className="w-full bg-gradient-primary hover:shadow-primary transition-all duration-300"
        size="lg"
      >
        Atualizar Sellerbot
      </Button>
    </div>
  );
};

export default SellerbotTab;