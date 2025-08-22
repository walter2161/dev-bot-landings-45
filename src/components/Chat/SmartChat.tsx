import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Loader2, MessageCircle, Minimize2, Settings, Upload } from 'lucide-react';
import { contentGenerator, BusinessContent } from '@/services/contentGenerator';
import { landingPageBuilder } from '@/services/landingPageBuilder';
import { toast } from 'sonner';

interface SmartChatProps {
  onLandingPageGenerated: (html: string, data: BusinessContent) => void;
  briefingPrompt?: string;
  isIntegrated?: boolean;
  onNavigateToBriefing?: () => void;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const SmartChat: React.FC<SmartChatProps> = ({ onLandingPageGenerated, briefingPrompt, isIntegrated = false, onNavigateToBriefing }) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Listen for auto-generation events
  React.useEffect(() => {
    const handleAutoGenerate = (event: CustomEvent) => {
      const { prompt } = event.detail;
      handleSendMessage(prompt);
    };

    window.addEventListener('auto-generate-landing-page', handleAutoGenerate as EventListener);
    return () => {
      window.removeEventListener('auto-generate-landing-page', handleAutoGenerate as EventListener);
    };
  }, []);

  const addMessage = (role: 'user' | 'assistant', content: string) => {
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      role,
      content,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const handleSendMessage = async (customMessage?: string) => {
    const messageToSend = customMessage || inputMessage.trim();
    if (!messageToSend || isGenerating) return;

    if (!customMessage) {
      setInputMessage('');
      addMessage('user', messageToSend);
    }
    setIsGenerating(true);

    try {
      addMessage('assistant', 'Analisando sua solicitação e gerando conteúdo específico...');

      // Gerar conteúdo específico do negócio
      const businessData = await contentGenerator.generateBusinessContent(messageToSend);
      
      addMessage('assistant', `Conteúdo gerado para: ${businessData.title}. Criando landing page...`);

      // Gerar HTML da landing page
      const html = await landingPageBuilder.generateHTML(businessData);

      // Notificar componente pai
      onLandingPageGenerated(html, businessData);

      addMessage('assistant', `✅ Landing page criada com sucesso para ${businessData.title}! Você pode visualizar no preview e fazer o download.`);
      
      toast.success(`Landing page gerada para ${businessData.title}!`);
    } catch (error) {
      console.error('Erro ao gerar landing page:', error);
      addMessage('assistant', '❌ Desculpe, ocorreu um erro ao gerar a landing page. Tente novamente com uma descrição mais específica do seu negócio.');
      toast.error('Erro ao gerar landing page');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleHtmlImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'text/html') {
      const reader = new FileReader();
      reader.onload = (e) => {
        const htmlContent = e.target?.result as string;
        if (htmlContent) {
          try {
            const editableBusinessData = parseHtmlToBusinessContent(htmlContent);
            onLandingPageGenerated(htmlContent, editableBusinessData);
            addMessage('assistant', '✅ Arquivo HTML importado e transformado em editável! Você pode modificar conteúdo, imagens e configurações nas abas.');
            toast.success('HTML importado e tornado editável!');
          } catch (error) {
            console.error('Erro ao processar HTML:', error);
            toast.error('Erro ao processar o arquivo HTML');
          }
        }
      };
      reader.readAsText(file);
    } else {
      toast.error('Por favor, selecione um arquivo HTML válido');
    }
    
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const parseHtmlToBusinessContent = (htmlContent: string): BusinessContent => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, 'text/html');
    
    // Extrair título
    const title = doc.querySelector('title')?.textContent || 
                  doc.querySelector('h1')?.textContent || 
                  'Landing Page Importada';
    
    // Extrair subtítulo (primeiro parágrafo ou descrição meta)
    const subtitle = doc.querySelector('meta[name="description"]')?.getAttribute('content') || 
                     doc.querySelector('p')?.textContent || 
                     'Página importada do arquivo HTML';
    
    // Extrair texto principal (primeiro h1 ou h2)
    const heroText = doc.querySelector('h1')?.textContent || 
                     doc.querySelector('h2')?.textContent || 
                     'Bem-vindo!';
    
    // Extrair texto de botões
    const ctaText = doc.querySelector('button')?.textContent || 
                    doc.querySelector('a[class*="btn"]')?.textContent ||
                    doc.querySelector('a[class*="button"]')?.textContent ||
                    'Clique aqui';
    
    // Extrair seções baseadas em headings
    const sections = Array.from(doc.querySelectorAll('h2, h3')).map((heading, index) => {
      const nextElement = heading.nextElementSibling;
      const content = nextElement?.textContent || heading.textContent || '';
      
      return {
        id: `section_${index}`,
        title: heading.textContent || `Seção ${index + 1}`,
        content: content.substring(0, 200) + (content.length > 200 ? '...' : ''),
        type: index === 0 ? 'intro' : index === 1 ? 'motivation' : index === 2 ? 'target' : 
              index === 3 ? 'method' : index === 4 ? 'results' : index === 5 ? 'access' : 'investment'
      } as any;
    });
    
    // Garantir pelo menos uma seção
    if (sections.length === 0) {
      sections.push({
        id: 'intro',
        title: 'Sobre Nós',
        content: subtitle,
        type: 'intro'
      } as any);
    }
    
    // Extrair cores do CSS
    const styles = doc.querySelector('style')?.textContent || '';
    const colorRegex = /#[0-9A-Fa-f]{6}/g;
    const foundColors = styles.match(colorRegex) || [];
    
    const colors = {
      primary: foundColors[0] || '#007bff',
      secondary: foundColors[1] || '#6c757d', 
      accent: foundColors[2] || '#28a745'
    };
    
    // Extrair imagens
    const images = doc.querySelectorAll('img');
    const imageDescriptions = {
      logo: 'Logo da empresa extraído do HTML',
      hero: 'Imagem principal da página',
      motivation: 'Imagem motivacional',
      target: 'Imagem do público-alvo',
      method: 'Imagem do método/processo',
      results: 'Imagem dos resultados',
      access: 'Imagem de acesso/contato',
      investment: 'Imagem de investimento/preços',
      gallery: 'Imagens da galeria de fotos'
    };
    
    // Extrair informações de contato
    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
    const phoneRegex = /\(?([0-9]{2})\)?\s?9?[0-9]{4,5}-?[0-9]{4}/g;
    
    const bodyText = doc.body.textContent || '';
    const emails = bodyText.match(emailRegex) || [];
    const phones = bodyText.match(phoneRegex) || [];
    
    const contact = {
      email: emails[0] || 'contato@empresa.com',
      phone: phones[0] || '(11) 99999-9999',
      address: 'Endereço extraído do HTML ou não informado',
      socialMedia: {
        whatsapp: phones[0] || '',
        instagram: '',
        facebook: '',
        linkedin: ''
      }
    };
    
    // Criar configuração do sellerbot
    const sellerbot = {
      name: `Assistente ${title}`,
      personality: 'Atencioso, profissional e conhecedor dos produtos/serviços da empresa',
      knowledge: [
        `Informações sobre ${title}`,
        'Produtos e serviços oferecidos',
        'Preços e formas de pagamento',
        'Processo de atendimento'
      ],
      responses: {
        greeting: `Olá! Bem-vindo à ${title}. Como posso ajudá-lo hoje?`,
        services: `Oferecemos diversos serviços relacionados ao nosso negócio. ${subtitle}`,
        pricing: 'Entre em contato conosco para conhecer nossos preços e condições especiais.',
        appointment: 'Ficou interessado? Entre em contato conosco para mais informações!'
      }
    };
    
    // Extrair URLs de imagens do HTML para customImages
    const customImages: { [key: string]: string } = {};
    images.forEach((img, index) => {
      const src = img.getAttribute('src');
      if (src) {
        const key = Object.keys(imageDescriptions)[index] || `image_${index}`;
        customImages[key] = src;
      }
    });
    
    return {
      title,
      subtitle,
      heroText,
      ctaText,
      sections,
      colors,
      images: imageDescriptions,
      customImages,
      contact,
      sellerbot
    };
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const quickPrompts = [
    "Drones para eventos e inspeções",
    "Estúdio de tatuagem artística",
    "Produtos veganos orgânicos",
    "Escola de dança urbana",
    "Consultoria em sustentabilidade"
  ];

  if (isIntegrated) {
    return (
      <div className="h-full w-full flex flex-col bg-transparent">
        {/* Messages */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4">
          {messages.length === 0 && (
            <div className="text-center text-muted-foreground">
              <MessageCircle className="h-8 w-8 mx-auto mb-3 opacity-50" />
              <p className="text-xs mb-3">Use o briefing ou descreva seu negócio:</p>
               {briefingPrompt && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onNavigateToBriefing?.()}
                  className="text-xs h-auto py-2 px-3 mb-2 hover:bg-primary/5 border-primary/30 w-full"
                >
                  Usar Briefing
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={handleImportClick}
                className="text-xs h-auto py-2 px-3 mb-3 hover:bg-primary/5 border-primary/30 w-full flex items-center gap-2"
              >
                <Upload className="h-3 w-3" />
                Importar HTML
              </Button>
                <div className="grid grid-cols-1 gap-1">
                  {quickPrompts.slice(0, 6).map((prompt, index) => (
                    <Button
                      key={`mobile-prompt-${index}`}
                      variant="outline"
                      size="sm"
                      onClick={() => setInputMessage(prompt)}
                      className="text-xs h-auto py-1 px-2 text-left justify-start hover:bg-primary/5 border-primary/30"
                    >
                      {prompt}
                    </Button>
                  ))}
               </div>
            </div>
          )}

          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] p-2 rounded-lg text-xs ${
                  message.role === 'user'
                    ? 'bg-gradient-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                <p>{message.content}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="p-3 border-t border-border/20">
          <div className="flex gap-2">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Descreva seu negócio..."
              disabled={isGenerating}
              className="flex-1 text-xs bg-muted/30 text-foreground placeholder:text-muted-foreground border-border/30 focus:border-primary"
            />
            <Button
              onClick={() => handleSendMessage()}
              disabled={!inputMessage.trim() || isGenerating}
              size="sm"
              className="bg-gradient-primary hover:shadow-primary transition-all duration-300"
            >
              {isGenerating ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                <img 
                  src="/lovable-uploads/20c03a1d-3bd4-4860-896d-4babff95c2f8.png" 
                  alt="Enviar" 
                  className="h-3 w-3 object-contain"
                />
              )}
            </Button>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept=".html"
            onChange={handleHtmlImport}
            style={{ display: 'none' }}
          />
        </div>
      </div>
    );
  }

  if (isMinimized) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsMinimized(false)}
          className="h-14 w-14 rounded-full bg-gradient-primary shadow-primary hover:shadow-glow transition-all duration-300 hover:scale-110"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      </div>
    );
  }

  return (
    <Card className="fixed bottom-6 right-6 w-96 h-[600px] z-50 flex flex-col bg-gradient-card border-primary/20 shadow-primary">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-primary/20">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 bg-accent rounded-full animate-pulse"></div>
          <span className="font-semibold text-foreground">Gerador de Landing Page</span>
        </div>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 hover:bg-primary/10"
          >
            <Settings className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMinimized(true)}
            className="h-8 w-8 p-0 hover:bg-primary/10"
          >
            <Minimize2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {messages.length === 0 && (
          <div className="text-center text-muted-foreground">
            <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-sm mb-4">Descreva o negócio que você quer criar uma landing page:</p>
              <div className="grid grid-cols-1 gap-2">
                {quickPrompts.map((prompt, index) => (
                  <Button
                    key={`desktop-prompt-${index}`}
                    variant="outline"
                    size="sm"
                    onClick={() => setInputMessage(prompt)}
                    className="text-xs h-auto py-2 px-3 text-left justify-start hover:bg-primary/5 border-primary/30"
                  >
                    {prompt}
                  </Button>
                ))}
            </div>
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-lg text-sm ${
                message.role === 'user'
                  ? 'bg-gradient-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground'
              }`}
            >
              <p>{message.content}</p>
              <p className="text-xs opacity-70 mt-1">
                {message.timestamp.toLocaleTimeString()}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="p-4 border-t border-primary/20">
        <div className="flex gap-2">
          <Input
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ex: Estúdio de tatuagem..."
            disabled={isGenerating}
            className="flex-1 bg-muted/30 text-foreground placeholder:text-muted-foreground border-primary/30 focus:border-primary focus:text-foreground"
          />
          <Button
            onClick={() => handleSendMessage()}
            disabled={!inputMessage.trim() || isGenerating}
            className="bg-gradient-primary hover:shadow-primary transition-all duration-300"
          >
            {isGenerating ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <img 
                src="/lovable-uploads/20c03a1d-3bd4-4860-896d-4babff95c2f8.png" 
                alt="Enviar" 
                className="h-4 w-4 object-contain"
              />
            )}
          </Button>
        </div>
        
        <div className="mt-2 text-xs text-center text-muted-foreground">
          Powered by Mistral AI
        </div>
        
        <input
          ref={fileInputRef}
          type="file"
          accept=".html"
          onChange={handleHtmlImport}
          style={{ display: 'none' }}
        />
      </div>
    </Card>
  );
};

export default SmartChat;