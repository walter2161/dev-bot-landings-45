import { BusinessContent, ImageDescriptions } from '../contentGenerator';
import { landingPageTemplates, selectTemplateForBusiness, type LandingPageTemplate } from './landingPageTemplates';

const PICSUM_BASE_URL = "https://picsum.photos";

// Mapeamento de nichos para templates HTML
const TEMPLATE_MAP: Record<string, string> = {
  'delivery': '/src/assets/template/delivery.html',
  'clinica': '/src/assets/template/clinica.html',
  'clínica': '/src/assets/template/clinica.html',
  'imoveis': '/src/assets/template/imoveis.html',
  'imóveis': '/src/assets/template/imoveis.html',
  'imobiliaria': '/src/assets/template/imoveis.html',
  'imobiliária': '/src/assets/template/imoveis.html',
  'pizzaria': '/src/assets/template/pizzaria.html',
  'academia': '/src/assets/template/academia.html',
  'salao': '/src/assets/template/salao.html',
  'salão': '/src/assets/template/salao.html',
  'advocacia': '/src/assets/template/advocacia.html',
  'consultoria': '/src/assets/template/consultoria.html',
  'ecommerce': '/src/assets/template/ecommerce.html',
  'e-commerce': '/src/assets/template/ecommerce.html',
  'loja': '/src/assets/template/ecommerce.html',
  'restaurante': '/src/assets/template/restaurante.html',
  'coach': '/src/assets/template/coach.html',
  'coaching': '/src/assets/template/coach.html',
  'curso': '/src/assets/template/curso.html',
  'cursos': '/src/assets/template/curso.html',
  'ebook': '/src/assets/template/ebook.html',
  'e-book': '/src/assets/template/ebook.html',
  'saas': '/src/assets/template/saas.html',
  'software': '/src/assets/template/saas.html',
};

export class HtmlAgent {
  async generateLandingPage(businessData: BusinessContent, language: string = 'pt'): Promise<string> {
    console.log('🎨 Gerando landing page com template HTML...');
    
    // Detectar o nicho e carregar o template apropriado
    const templatePath = this.selectTemplateByNiche(businessData.title, businessData.subtitle || '');
    console.log(`📄 Template selecionado: ${templatePath}`);
    
    // Carregar o template HTML
    const templateHTML = await this.loadTemplate(templatePath);
    
    // Gerar URLs de imagens
    const images = await this.generateImageUrls(businessData);
    
    // Personalizar o template com os dados do negócio
    const personalizedHTML = await this.personalizeTemplate(templateHTML, businessData, images);
    
    return personalizedHTML;
  }

  async generateHTML(businessData: BusinessContent, language: string = 'pt'): Promise<string> {
    return this.generateLandingPage(businessData, language);
  }

  private selectTemplateByNiche(title: string, subtitle: string): string {
    const combinedText = `${title} ${subtitle}`.toLowerCase();
    
    console.log('🔍 Analisando nicho:', combinedText);
    
    // Procurar por palavras-chave nos templates
    for (const [keyword, templatePath] of Object.entries(TEMPLATE_MAP)) {
      if (combinedText.includes(keyword)) {
        console.log(`✅ Nicho identificado: ${keyword}`);
        return templatePath;
      }
    }
    
    // Fallback para template padrão (restaurante)
    console.log('⚠️ Nicho não identificado, usando template padrão');
    return '/src/assets/template/restaurante.html';
  }

  private async loadTemplate(templatePath: string): Promise<string> {
    try {
      console.log(`📂 Carregando template: ${templatePath}`);
      const response = await fetch(templatePath);
      if (!response.ok) {
        throw new Error(`Erro ao carregar template: ${response.statusText}`);
      }
      const html = await response.text();
      console.log('✅ Template carregado com sucesso');
      return html;
    } catch (error) {
      console.error('❌ Erro ao carregar template:', error);
      // Fallback para template básico
      return this.getBasicTemplate();
    }
  }

  private async personalizeTemplate(
    templateHTML: string, 
    businessData: BusinessContent, 
    images: any
  ): Promise<string> {
    console.log('🎨 Personalizando template...');
    
    let html = templateHTML;
    
    // Injetar header do PageJet e chat IA
    html = this.injectHeaderAndChat(html, businessData);
    
    // Extrair e parsear seções do HTML para sincronizar com businessData
    const parsedSections = this.extractSectionsFromHTML(html);
    console.log('📋 Seções extraídas do HTML:', parsedSections.length);
    
    // Atualizar businessData.sections com as seções reais do HTML
    businessData.sections = parsedSections;
    
    // Substituir placeholders de texto
    html = html.replace(/\[BUSINESS_NAME\]/g, businessData.title);
    html = html.replace(/\[BUSINESS_TITLE\]/g, businessData.title);
    html = html.replace(/\[BUSINESS_SUBTITLE\]/g, businessData.subtitle || '');
    html = html.replace(/\[HERO_TEXT\]/g, businessData.heroText || businessData.subtitle || '');
    html = html.replace(/\[CTA_TEXT\]/g, businessData.ctaText || 'Entre em Contato');
    
    // Substituir cores em todo o HTML
    if (businessData.colors) {
      html = this.replaceColorsInHTML(html, businessData.colors);
    }
    
    // Substituir imagens com URLs do Pollinations
    html = this.replaceImagesInHTML(html, images, businessData);
    
    // Substituir dados de contato
    if (businessData.contact) {
      html = html.replace(/\[PHONE\]/g, businessData.contact.phone || '(00) 0000-0000');
      html = html.replace(/\[EMAIL\]/g, businessData.contact.email || 'contato@email.com');
      html = html.replace(/\[ADDRESS\]/g, businessData.contact.address || 'Endereço');
      html = html.replace(/\[WHATSAPP\]/g, businessData.contact.socialMedia?.whatsapp || '(00) 00000-0000');
      html = html.replace(/\[INSTAGRAM\]/g, businessData.contact.socialMedia?.instagram || '@empresa');
      html = html.replace(/\[FACEBOOK\]/g, businessData.contact.socialMedia?.facebook || 'empresa');
    }
    
    // Aplicar conteúdo das seções dinamicamente
    html = this.applySectionContent(html, businessData.sections);
    
    console.log('✅ Template personalizado com sucesso');
    return html;
  }

  private injectHeaderAndChat(html: string, businessData: BusinessContent): string {
    const logoUrl = businessData.images.logo || 'https://pollinations.ai/p/modern-business-logo';
    
    const headerHTML = `
      <style>
        .pagejet-header {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          z-index: 1000;
          padding: 1rem 2rem;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .pagejet-header-content {
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .pagejet-logo {
          height: 50px;
          object-fit: contain;
        }
        .pagejet-nav {
          display: flex;
          gap: 2rem;
          align-items: center;
        }
        .pagejet-nav a {
          color: #333;
          text-decoration: none;
          font-weight: 500;
          transition: color 0.3s;
        }
        .pagejet-nav a:hover {
          color: ${businessData.colors.primary};
        }
        .pagejet-cta-button {
          background: ${businessData.colors.primary};
          color: white;
          padding: 0.5rem 1.5rem;
          border-radius: 25px;
          text-decoration: none;
          font-weight: 600;
          transition: transform 0.3s;
        }
        .pagejet-cta-button:hover {
          transform: translateY(-2px);
        }
        body {
          padding-top: 90px;
        }
        
        .sellerbot-widget {
          position: fixed;
          bottom: 20px;
          right: 20px;
          width: 380px;
          height: 550px;
          background: white;
          border-radius: 15px;
          box-shadow: 0 5px 30px rgba(0,0,0,0.2);
          display: none;
          flex-direction: column;
          z-index: 1001;
        }
        .sellerbot-widget.open { display: flex; }
        .sellerbot-header {
          background: linear-gradient(135deg, ${businessData.colors.primary}, ${businessData.colors.secondary});
          color: white;
          padding: 20px;
          border-radius: 15px 15px 0 0;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .sellerbot-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: white;
          color: ${businessData.colors.primary};
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          margin-right: 10px;
        }
        .sellerbot-header-info {
          display: flex;
          align-items: center;
          flex: 1;
        }
        .sellerbot-messages {
          flex: 1;
          overflow-y: auto;
          padding: 20px;
          background: #f8f9fa;
        }
        .sellerbot-message {
          margin-bottom: 15px;
          padding: 12px 16px;
          border-radius: 15px;
          max-width: 85%;
          animation: fadeIn 0.3s;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .sellerbot-message.user {
          background: ${businessData.colors.primary};
          color: white;
          margin-left: auto;
          border-bottom-right-radius: 5px;
        }
        .sellerbot-message.bot {
          background: white;
          color: #333;
          box-shadow: 0 2px 5px rgba(0,0,0,0.1);
          border-bottom-left-radius: 5px;
        }
        .sellerbot-typing {
          display: none;
          padding: 12px 16px;
          background: white;
          border-radius: 15px;
          width: fit-content;
          box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        }
        .sellerbot-typing.active { display: block; }
        .sellerbot-typing span {
          height: 8px;
          width: 8px;
          background: #666;
          border-radius: 50%;
          display: inline-block;
          margin: 0 2px;
          animation: typing 1.4s infinite;
        }
        .sellerbot-typing span:nth-child(2) { animation-delay: 0.2s; }
        .sellerbot-typing span:nth-child(3) { animation-delay: 0.4s; }
        @keyframes typing {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-10px); }
        }
        .sellerbot-input {
          display: flex;
          padding: 15px;
          border-top: 1px solid #e0e0e0;
          background: white;
          border-radius: 0 0 15px 15px;
        }
        .sellerbot-input input {
          flex: 1;
          padding: 12px 16px;
          border: 1px solid #e0e0e0;
          border-radius: 25px;
          margin-right: 10px;
          font-size: 14px;
          outline: none;
          transition: border 0.3s;
        }
        .sellerbot-input input:focus {
          border-color: ${businessData.colors.primary};
        }
        .sellerbot-input button {
          background: ${businessData.colors.primary};
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 25px;
          cursor: pointer;
          font-weight: 600;
          transition: background 0.3s;
        }
        .sellerbot-input button:hover {
          background: ${businessData.colors.secondary};
        }
        .sellerbot-fab {
          position: fixed;
          bottom: 20px;
          right: 20px;
          width: 60px;
          height: 60px;
          background: linear-gradient(135deg, ${businessData.colors.primary}, ${businessData.colors.secondary});
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          box-shadow: 0 5px 20px rgba(0,0,0,0.3);
          color: white;
          font-size: 28px;
          z-index: 1000;
          transition: transform 0.3s;
        }
        .sellerbot-fab:hover {
          transform: scale(1.1);
        }
        .sellerbot-fab.hidden {
          display: none;
        }
      </style>
      
      <header class="pagejet-header">
        <div class="pagejet-header-content">
          <img src="${logoUrl}" alt="${businessData.title}" class="pagejet-logo">
          <nav class="pagejet-nav">
            <a href="#sobre">Sobre</a>
            <a href="#servicos">Serviços</a>
            <a href="#contato">Contato</a>
            <a href="tel:${businessData.contact.phone}" class="pagejet-cta-button">
              ${businessData.contact.phone}
            </a>
          </nav>
        </div>
      </header>
      
      <div class="sellerbot-fab" id="chat-fab" onclick="toggleChat()">💬</div>
      <div class="sellerbot-widget" id="sellerbot">
        <div class="sellerbot-header">
          <div class="sellerbot-header-info">
            <div class="sellerbot-avatar">${businessData.sellerbot.name.charAt(0)}</div>
            <div>
              <strong>${businessData.sellerbot.name}</strong><br>
              <small>✓ Online agora</small>
            </div>
          </div>
          <button onclick="toggleChat()" style="background:none;border:none;color:white;font-size:24px;cursor:pointer;padding:0;width:30px;height:30px;">×</button>
        </div>
        <div class="sellerbot-messages" id="chat-messages">
          <div class="sellerbot-message bot">
            👋 Olá! Sou ${businessData.sellerbot.name} da ${businessData.title}. Como posso ajudar você hoje?
          </div>
        </div>
        <div class="sellerbot-input">
          <input type="text" id="chat-input" placeholder="Digite sua mensagem...">
          <button onclick="sendMessage()">Enviar</button>
        </div>
      </div>
      
      <script>
        const MISTRAL_API_KEY = 'aynCSftAcQBOlxmtmpJqVzco8K4aaTDQ';
        const chatHistory = [];
        
        const businessInfo = {
          name: '${businessData.title}',
          description: '${businessData.subtitle}',
          services: '${businessData.heroText}',
          email: '${businessData.contact.email}',
          phone: '${businessData.contact.phone}',
          address: '${businessData.contact.address}',
          sellerbotName: '${businessData.sellerbot.name}',
          sellerbotPersonality: '${businessData.sellerbot.personality}'
        };
        
        function toggleChat() {
          const widget = document.getElementById('sellerbot');
          const fab = document.getElementById('chat-fab');
          widget.classList.toggle('open');
          fab.classList.toggle('hidden');
        }
        
        async function sendMessage() {
          const input = document.getElementById('chat-input');
          const messages = document.getElementById('chat-messages');
          const message = input.value.trim();
          
          if (!message) return;
          
          const userMsg = document.createElement('div');
          userMsg.className = 'sellerbot-message user';
          userMsg.textContent = message;
          messages.appendChild(userMsg);
          
          chatHistory.push({ role: 'user', content: message });
          
          input.value = '';
          messages.scrollTop = messages.scrollHeight;
          
          const typing = document.createElement('div');
          typing.className = 'sellerbot-typing active';
          typing.innerHTML = '<span></span><span></span><span></span>';
          messages.appendChild(typing);
          messages.scrollTop = messages.scrollHeight;
          
          try {
            const conversationContext = chatHistory.slice(-6).map(m => m.role + ': ' + m.content).join('\\n');
            
            const systemPrompt = \`Você é \${businessInfo.sellerbotName}, um assistente virtual especializado em \${businessInfo.name}.

INFORMAÇÕES DO NEGÓCIO:
- Empresa: \${businessInfo.name}
- Descrição: \${businessInfo.description}
- Serviços: \${businessInfo.services}
- Contato:
  * Email: \${businessInfo.email}
  * Telefone: \${businessInfo.phone}
  * Endereço: \${businessInfo.address}

PERSONALIDADE: \${businessInfo.sellerbotPersonality}

INSTRUÇÕES:
- Seja amigável, profissional e prestativo
- Use as informações do negócio para responder
- Mantenha respostas concisas (máximo 150 palavras)
- Use emojis quando apropriado

CONTEXTO DA CONVERSA:
\${conversationContext}\`;

            const response = await fetch('https://api.mistral.ai/v1/chat/completions', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': \`Bearer \${MISTRAL_API_KEY}\`
              },
              body: JSON.stringify({
                model: 'mistral-large-latest',
                messages: [
                  { role: 'system', content: systemPrompt },
                  { role: 'user', content: message }
                ],
                temperature: 0.7,
                max_tokens: 300
              })
            });
            
            typing.remove();
            
            if (response.ok) {
              const data = await response.json();
              const botResponse = data.choices[0].message.content;
              
              chatHistory.push({ role: 'assistant', content: botResponse });
              
              const botMsg = document.createElement('div');
              botMsg.className = 'sellerbot-message bot';
              botMsg.textContent = botResponse;
              messages.appendChild(botMsg);
            } else {
              throw new Error('API Error');
            }
          } catch (error) {
            typing.remove();
            
            const botMsg = document.createElement('div');
            botMsg.className = 'sellerbot-message bot';
            botMsg.textContent = getFallbackResponse(message);
            messages.appendChild(botMsg);
          }
          
          messages.scrollTop = messages.scrollHeight;
        }
        
        function getFallbackResponse(message) {
          const lower = message.toLowerCase();
          if (lower.includes('preço') || lower.includes('valor')) {
            return \`💰 Entre em contato conosco para consultar valores: \${businessInfo.phone}\`;
          }
          if (lower.includes('serviço') || lower.includes('produto')) {
            return \`🛍️ \${businessInfo.services}\`;
          }
          if (lower.includes('contato') || lower.includes('telefone')) {
            return \`📞 Entre em contato:\\n📧 \${businessInfo.email}\\n📱 \${businessInfo.phone}\\n📍 \${businessInfo.address}\`;
          }
          return \`👋 Obrigado pela mensagem! Como posso ajudar você com \${businessInfo.name}?\`;
        }
        
        document.getElementById('chat-input').addEventListener('keypress', (e) => {
          if (e.key === 'Enter') sendMessage();
        });
      </script>
    `;
    
    return html.replace('</body>', `${headerHTML}</body>`);
  }

  private extractSectionsFromHTML(html: string): any[] {
    const sections = [];
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    
    // Extrair todas as sections do HTML
    const sectionElements = doc.querySelectorAll('section, .section, [class*="section"]');
    
    sectionElements.forEach((section, index) => {
      const headings = section.querySelectorAll('h1, h2, h3');
      const title = headings[0]?.textContent?.trim() || `Seção ${index + 1}`;
      const paragraphs = Array.from(section.querySelectorAll('p'))
        .map(p => p.textContent?.trim())
        .filter(Boolean)
        .join(' ')
        .slice(0, 200);

      sections.push({
        id: `section-${index}`,
        type: section.className || 'content',
        title: title,
        content: paragraphs || 'Conteúdo da seção',
        order: index + 1
      });
    });

    return sections;
  }

  private replaceColorsInHTML(html: string, colors: any): string {
    // Substituir cores específicas comuns
    const colorReplacements = [
      { old: /#667eea/gi, new: colors.primary },
      { old: /#764ba2/gi, new: colors.accent },
      { old: /#FF6B6B/gi, new: colors.primary },
      { old: /#4ECDC4/gi, new: colors.accent },
      { old: /rgb\(255,\s*107,\s*107\)/gi, new: colors.primary },
      { old: /rgb\(78,\s*205,\s*196\)/gi, new: colors.accent },
    ];

    colorReplacements.forEach(({ old, new: newColor }) => {
      html = html.replace(old, newColor);
    });

    // Substituir variáveis CSS
    html = html.replace(/--primary-color:\s*[^;]+;/g, `--primary-color: ${colors.primary};`);
    html = html.replace(/--accent-color:\s*[^;]+;/g, `--accent-color: ${colors.accent};`);

    return html;
  }

  private replaceImagesInHTML(html: string, images: any, businessData: BusinessContent): string {
    // Substituir URLs do Pollinations.ai com URLs reais das imagens geradas
    const pollinationsRegex = /https:\/\/pollinations\.ai\/p\/[^"'\s)]+/g;
    
    const imageUrls = [
      images.hero,
      images.logo,
      images.motivation,
      images.target,
      images.method,
      images.results,
      images.access,
      images.investment,
      ...(businessData.images?.gallery || [])
    ];

    let imageIndex = 0;
    html = html.replace(pollinationsRegex, () => {
      const url = imageUrls[imageIndex % imageUrls.length];
      imageIndex++;
      return url;
    });

    // Substituir placeholders específicos
    html = html.replace(/\[LOGO_IMAGE\]/g, images.logo);
    html = html.replace(/\[HERO_IMAGE\]/g, images.hero);
    html = html.replace(/\[IMAGE_1\]/g, images.motivation);
    html = html.replace(/\[IMAGE_2\]/g, images.target);
    html = html.replace(/\[IMAGE_3\]/g, images.method);
    html = html.replace(/\[IMAGE_4\]/g, images.results);
    html = html.replace(/\[IMAGE_5\]/g, images.access);
    html = html.replace(/\[IMAGE_6\]/g, images.investment);

    return html;
  }

  private applySectionContent(html: string, sections: any[]): string {
    // Aplicar títulos e conteúdos das seções dinamicamente
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    
    const sectionElements = doc.querySelectorAll('section, .section, [class*="section"]');
    
    sectionElements.forEach((sectionEl, index) => {
      if (sections[index]) {
        const section = sections[index];
        
        // Atualizar títulos
        const headings = sectionEl.querySelectorAll('h1, h2, h3');
        if (headings[0]) {
          headings[0].textContent = section.title;
        }
        
        // Atualizar primeiros parágrafos
        const paragraphs = sectionEl.querySelectorAll('p');
        if (paragraphs[0] && section.content) {
          paragraphs[0].textContent = section.content;
        }
      }
    });

    return doc.documentElement.outerHTML;
  }

  private getBasicTemplate(): string {
    return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>[BUSINESS_NAME]</title>
</head>
<body>
    <h1>[BUSINESS_NAME]</h1>
    <p>[BUSINESS_SUBTITLE]</p>
</body>
</html>`;
  }

  private async generateImageUrls(businessData: BusinessContent): Promise<any> {
    const { imageService } = await import('../imageService');
    const customImages = businessData.customImages || {};
    const images: ImageDescriptions = businessData.images;
    
    // Usa os prompts específicos do imageAgent para cada seção
    const imageUrls = {
      logo: customImages.logo || await imageService.generateImageUrl(images.logo || `logo ${businessData.title}`, 200, 200),
      hero: customImages.hero || await imageService.generateImageUrl(images.hero || `${businessData.title} hero image`, 1200, 600),
      motivation: customImages.motivation || await imageService.generateImageUrl(images.motivation || `${businessData.title} contexto real do nicho`, 1000, 600),
      target: customImages.target || await imageService.generateImageUrl(images.target || `público-alvo real de ${businessData.title}`, 1000, 600),
      method: customImages.method || await imageService.generateImageUrl(images.method || `processo de trabalho do nicho ${businessData.title}`, 1000, 600),
      results: customImages.results || await imageService.generateImageUrl(images.results || 'resultados concretos do trabalho', 1000, 600),
      access: customImages.access || await imageService.generateImageUrl(images.access || 'localização/atendimento real', 1000, 600),
      investment: customImages.investment || await imageService.generateImageUrl(images.investment || 'transparência de preços e valor', 1000, 600),
      // Equipe (opcional)
      team1: customImages.team1 || await imageService.generateImageUrl(images.method || 'profissional do nicho em ação', 300, 300),
      team2: customImages.team2 || await imageService.generateImageUrl(images.target || 'cliente real do nicho', 300, 300),
      team3: customImages.team3 || await imageService.generateImageUrl(images.access || 'ambiente de atendimento real', 300, 300),
      gallery: images.gallery || 'gallery images'
    };

    // Converte todas as imagens para base64
    console.log('🖼️ Convertendo imagens para base64...');
    console.log('📸 Usando prompts específicos:', {
      hero: images.hero?.substring(0, 50),
      about: images.motivation?.substring(0, 50),
      results: images.results?.substring(0, 50)
    });
    const base64Images = await imageService.convertAllImagesToBase64(imageUrls);
    console.log('✅ Imagens convertidas com sucesso!');
    
    return base64Images;
  }

  private buildHTMLTemplate(businessData: BusinessContent, images: any, language: string = 'pt'): string {
    const langAttribute = language === 'pt' ? 'pt-BR' : language === 'es' ? 'es-ES' : 'en-US';
    const isService = this.detectBusinessType(
      businessData.heroText || '', 
      businessData.title, 
      businessData.subtitle || ''
    );
    
    return `<!DOCTYPE html>
<html lang="${langAttribute}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${businessData.title}</title>
    <meta name="description" content="${businessData.subtitle}">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    ${this.generateModernCSS(businessData)}
</head>
<body>
    ${this.generateStructuredLandingPage(businessData, images, isService, language)}
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    ${this.generateModernJavaScript(businessData)}
</body>
</html>`;
  }

  private detectBusinessType(text1: string, text2: string, text3: string): boolean {
    const combinedText = `${text1} ${text2} ${text3}`.toLowerCase();
    
    const serviceKeywords = [
      'consultoria', 'assessoria', 'coaching', 'treinamento', 'curso', 'aula',
      'atendimento', 'suporte', 'manutenção', 'instalação', 'reparo',
      'marketing', 'design', 'desenvolvimento', 'programação', 'software',
      'advocacia', 'contabilidade', 'medicina', 'fisioterapia', 'psicologia',
      'arquitetura', 'engenharia', 'construção', 'reforma', 'limpeza',
      'delivery', 'transporte', 'logística', 'hospedagem', 'hotel',
      'evento', 'festa', 'casamento', 'fotografia', 'filmagem',
      'salão', 'barbearia', 'estética', 'massagem', 'spa',
      'academia', 'personal', 'nutrição', 'dietista', 'serviço', 'serviços',
      'clínica', 'clinica', 'tratamento', 'terapia', 'procedimento'
    ];
    
    const productKeywords = [
      'loja', 'venda', 'produto', 'produtos', 'item', 'mercadoria', 'artigo',
      'roupas', 'calçados', 'acessórios', 'joias', 'relógios',
      'eletrônicos', 'smartphone', 'computador', 'tablet',
      'móveis', 'decoração', 'jardim',
      'livros', 'jogos', 'brinquedos', 'esportes',
      'cosméticos', 'perfumes', 'maquiagem',
      'farmácia', 'medicamentos', 'suplementos',
      'pet shop', 'animais', 'ração'
    ];
    
    let serviceCount = 0;
    let productCount = 0;
    
    serviceKeywords.forEach(keyword => {
      if (combinedText.includes(keyword)) serviceCount++;
    });
    
    productKeywords.forEach(keyword => {
      if (combinedText.includes(keyword)) productCount++;
    });
    
    console.log(`🔍 Análise: Serviço(${serviceCount}) vs Produto(${productCount})`);
    return serviceCount > productCount;
  }

  private generateStructuredLandingPage(businessData: BusinessContent, images: any, isService: boolean, language: string): string {
    // Detectar o template baseado no tipo de negócio
    const template = selectTemplateForBusiness(businessData.title);
    console.log(`🎨 Usando template: ${template.name} (${template.totalSections} seções)`);
    
    // Gerar HTML baseado no template específico
    return this.generateTemplateBasedHTML(businessData, images, template, language);
  }
  
  private generateTemplateBasedHTML(businessData: BusinessContent, images: any, template: LandingPageTemplate, language: string): string {
    switch (template.id) {
      case 'visual-gallery':
        return this.generateVisualGalleryTemplate(businessData, images);
      case 'catalog-ecommerce':
        return this.generateCatalogEcommerceTemplate(businessData, images);
      case 'services-testimonials':
        return this.generateServicesTestimonialsTemplate(businessData, images);
      case 'corporate-b2b':
        return this.generateCorporateB2BTemplate(businessData, images);
      case 'local-proximity':
        return this.generateLocalProximityTemplate(businessData, images);
      case 'projects-construction':
        return this.generateProjectsConstructionTemplate(businessData, images);
      default:
        return this.generateCorporateB2BTemplate(businessData, images);
    }
  }

  private getSimpleMenuLabel(sectionType: string): string {
    const menuLabels: Record<string, string> = {
      'intro': 'Início',
      'motivation': 'Sobre',
      'target': 'Público',
      'method': 'Como Funciona',
      'results': 'Resultados',
      'access': 'Localização',
      'investment': 'Valores',
      'services': 'Serviços',
      'testimonials': 'Depoimentos',
      'gallery': 'Galeria',
      'products': 'Produtos',
      'team': 'Equipe',
      'faq': 'Dúvidas',
      'contact': 'Contato',
      'portfolio': 'Portfolio',
      'process': 'Processo',
      'benefits': 'Benefícios',
      'about': 'Sobre',
      'cases': 'Casos',
      'differentials': 'Diferenciais',
      'partners': 'Parceiros',
      'stages': 'Etapas',
      'materials': 'Materiais',
      'warranty': 'Garantia',
      'pricing': 'Preços',
      'appointment': 'Agendamento',
      'location': 'Local',
      'hours': 'Horários',
      'beforeafter': 'Antes/Depois'
    };
    
    return menuLabels[sectionType] || sectionType;
  }

  private generateHeaderSection(businessData: BusinessContent, images: any): string {
    return `
    <!-- Header Navigation -->
    <header class="site-header">
        <nav class="navbar navbar-expand-lg navbar-dark">
            <div class="container">
                <a class="navbar-brand d-flex align-items-center" href="#home">
                    <div class="header-logo-container">
                        <img src="${images.logo}" alt="${businessData.title}" class="header-logo">
                    </div>
                    <span class="ms-2 fw-bold">${businessData.title}</span>
                </a>
                
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>
                
                <div class="collapse navbar-collapse" id="navbarNav">
                    <ul class="navbar-nav ms-auto">
                      ${businessData.sections.map(s => `
                        <li class="nav-item">
                          <a class="nav-link" href="#sec-${s.type}">${this.getSimpleMenuLabel(s.type)}</a>
                        </li>
                      `).join('')}
                    </ul>
                    <a href="#contato" class="btn btn-primary ms-3">${businessData.ctaText || 'Contato'}</a>
                </div>
            </div>
        </nav>
    </header>
    `;
  }

  private generateHeroSection(businessData: BusinessContent, images: any): string {
    return `
    <!-- Hero Section -->
    <section id="home" class="hero">
        <div class="container">
            <div class="row">
                <div class="col-lg-8 mx-auto">
                    <h1 class="display-4 fw-bold mb-4">${businessData.title}</h1>
                    <p class="lead mb-5">${businessData.heroText || businessData.subtitle}</p>
                    <div class="d-flex flex-column flex-md-row justify-content-center gap-3">
                        <a href="#contato" class="btn btn-primary btn-lg">${businessData.ctaText || 'Entre em Contato'}</a>
                        <a href="#servicos" class="btn btn-outline-light btn-lg">Conhecer Nossos Serviços</a>
                    </div>
                </div>
            </div>
        </div>
    </section>
    `;
  }


  private generateAboutSection(businessData: BusinessContent, images: any): string {
    return `
    <section id="sobre" class="section">
      <div class="container">
        <div class="row align-items-center">
          <div class="col-lg-6 mb-4">
            <h2 class="section-title">Sobre ${businessData.title}</h2>
            <p class="lead">${businessData.subtitle}</p>
            <p>${businessData.heroText || 'Nossa equipe é especializada em oferecer soluções de alta qualidade.'}</p>
          </div>
          <div class="col-lg-6">
            <img src="${images.motivation}" class="img-fluid rounded shadow" alt="Sobre">
          </div>
        </div>
      </div>
    </section>`;
  }

  private generateServicesSection(businessData: BusinessContent): string {
    return `
    <section id="servicos" class="section bg-light">
      <div class="container">
        <h2 class="section-title text-center mb-5">Nossos Serviços</h2>
        <div class="row g-4">
          <div class="col-md-4">
            <div class="card h-100 text-center p-4">
              <div class="service-icon"><i class="fas fa-star"></i></div>
              <h4>Qualidade Premium</h4>
              <p>Serviços de alta qualidade</p>
            </div>
          </div>
        </div>
      </div>
    </section>`;
  }

  private generateTestimonialsSection(businessData: BusinessContent): string {
    return `
    <section id="depoimentos" class="section bg-light">
      <div class="container">
        <h2 class="section-title text-center mb-5">Depoimentos</h2>
        <div class="row">
          <div class="col-lg-4">
            <div class="testimonial">
              <p>"Excelente serviço!"</p>
              <h5>Cliente Satisfeito</h5>
            </div>
          </div>
        </div>
      </div>
    </section>`;
  }

  private generateProcessSection(businessData: BusinessContent): string {
    return `
    <section class="section">
      <div class="container">
        <h2 class="section-title text-center mb-5">Como Funciona</h2>
        <div class="row">
          <div class="col-md-4">
            <div class="process-step">
              <div class="step-number">1</div>
              <h4>Consulta</h4>
            </div>
          </div>
        </div>
      </div>
    </section>`;
  }

  // Gera seções com base em businessData.sections para alinhar com o editor de conteúdo
  private generateContentSections(businessData: BusinessContent, images: any): string {
    const imageByType: Record<string, string> = {
      intro: images.hero,
      motivation: images.motivation,
      target: images.target,
      method: images.method,
      results: images.results,
      access: images.access,
      investment: images.investment,
    };

    return businessData.sections.map((section, idx) => {
      const img = imageByType[section.type] || images.hero;
      const reverse = idx % 2 === 1 ? 'flex-row-reverse' : '';
      return `
      <section id="sec-${section.type}" class="section">
        <div class="container">
          <div class="row align-items-center ${reverse}">
            <div class="col-lg-6 mb-4 mb-lg-0">
              <h2 class="section-title">${section.title}</h2>
              <p class="section-text">${section.content}</p>
            </div>
            <div class="col-lg-6">
              <img src="${img}" class="img-fluid rounded shadow" alt="${section.title}">
            </div>
          </div>
        </div>
      </section>`;
    }).join('');
  }



  private generateCTASection(businessData: BusinessContent): string {
    return `
    <!-- CTA -->
    <section id="contato" class="cta">
        <div class="container">
            <div class="row">
                <div class="col-lg-8 mx-auto text-center">
                    <h2 class="mb-4">Pronto para Começar?</h2>
                    <p class="lead mb-5">Entre em contato conosco e descubra como ${businessData.title} pode ajudar você</p>
                    <form class="row g-3 justify-content-center" onsubmit="handleFormSubmit(event)">
                        <div class="col-md-5">
                            <input type="text" class="form-control" id="contactName" placeholder="Seu nome" required>
                        </div>
                        <div class="col-md-5">
                            <input type="email" class="form-control" id="contactEmail" placeholder="Seu e-mail" required>
                        </div>
                        <div class="col-12">
                            <button type="submit" class="btn btn-light btn-lg">Solicitar Contato</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </section>
    `;
  }

  private generateFooterSection(businessData: BusinessContent): string {
    return `
    <!-- Footer -->
    <footer class="footer">
        <div class="container">
            <div class="row">
                <div class="col-md-4 mb-4 mb-md-0">
                    <h5>${businessData.title}</h5>
                    <p>${businessData.subtitle}</p>
                </div>
                <div class="col-md-4 mb-4 mb-md-0">
                    <h5>Contato</h5>
                    <p><i class="fas fa-phone me-2"></i> ${businessData.contact?.phone || '(00) 00000-0000'}</p>
                    <p><i class="fas fa-envelope me-2"></i> ${businessData.contact?.email || 'contato@empresa.com'}</p>
                    <p><i class="fas fa-map-marker-alt me-2"></i> ${businessData.contact?.address || 'Endereço não informado'}</p>
                </div>
                <div class="col-md-4">
                    <h5>Redes Sociais</h5>
                    <div class="social-icons">
                        <a href="#"><i class="fab fa-facebook"></i></a>
                        <a href="#"><i class="fab fa-instagram"></i></a>
                        <a href="#"><i class="fab fa-linkedin"></i></a>
                        <a href="#"><i class="fab fa-youtube"></i></a>
                    </div>
                </div>
            </div>
            <hr class="my-4 bg-light">
            <div class="text-center">
                <p class="mb-0">&copy; 2024 ${businessData.title}. Todos os direitos reservados.</p>
            </div>
        </div>
    </footer>
    `;
  }

  private generateFloatingChat(businessData: BusinessContent): string {
    return `
    <!-- Botão flutuante -->
    <div class="floating-btn" id="floatingBtn">
        <i class="fas fa-comments"></i>
    </div>

    <!-- Menu flutuante -->
    <div class="floating-menu" id="floatingMenu">
        <div class="floating-menu-item" id="chatOption">
            <i class="fas fa-comment"></i> Chat
        </div>
        <div class="floating-menu-item" id="whatsappOption">
            <i class="fab fa-whatsapp"></i> WhatsApp
        </div>
    </div>

    <!-- Modal de chat -->
    <div class="chat-modal" id="chatModal">
        <div class="chat-header">
            ${businessData.sellerbot?.name || 'Assistente Virtual'}
        </div>
        <div class="chat-messages" id="chatMessages"></div>
        <div class="chat-input">
            <input type="text" id="chatInput" placeholder="Digite sua mensagem...">
            <button id="chatSend">Enviar</button>
        </div>
    </div>
    `;
  }

  private generateModernCSS(businessData: BusinessContent): string {
    const primary = businessData.colors?.primary || '#0066cc';
    const secondary = businessData.colors?.secondary || '#ff6b6b';
    const accent = businessData.colors?.accent || '#00cc88';

    return `
    <style>
        :root {
            --primary: ${primary};
            --secondary: ${secondary};
            --accent: ${accent};
            --light: #f8f9fa;
            --dark: #343a40;
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            color: #333;
            overflow-x: hidden;
            padding-top: 80px;
        }

        /* Header Styles */
        .site-header {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            z-index: 1000;
            background: rgba(0, 0, 0, 0.95);
            backdrop-filter: blur(10px);
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }

        .site-header .navbar {
            padding: 0.75rem 0;
        }

        .site-header .navbar-brand {
            font-size: 1.5rem;
            color: white !important;
            transition: all 0.3s;
        }

        .site-header .navbar-brand:hover {
            color: var(--primary) !important;
        }

        .header-logo-container {
            width: 40px;
            height: 40px;
            border-radius: 8px;
            overflow: hidden;
            background: white;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .header-logo {
            max-width: 100%;
            max-height: 100%;
            object-fit: contain;
        }

        .site-header .nav-link {
            color: rgba(255, 255, 255, 0.8) !important;
            font-weight: 500;
            padding: 0.5rem 1rem !important;
            transition: all 0.3s;
            position: relative;
        }

        .site-header .nav-link:hover {
            color: white !important;
        }

        .site-header .nav-link::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 50%;
            transform: translateX(-50%);
            width: 0;
            height: 2px;
            background: var(--primary);
            transition: width 0.3s;
        }

        .site-header .nav-link:hover::after {
            width: 80%;
        }

        .site-header .btn-primary {
            padding: 0.5rem 1.5rem;
            font-size: 0.9rem;
        }

        /* Smooth scrolling */
        html {
            scroll-behavior: smooth;
            scroll-padding-top: 80px;
        }
        
        .hero {
            background: linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('${businessData.customImages?.hero || 'https://image.pollinations.ai/prompt/' + encodeURIComponent(businessData.title) + '?width=1200&height=600&nologo=true&enhance=true'}');
            background-size: cover;
            background-position: center;
            color: white;
            padding: 150px 0;
            text-align: center;
        }
        
        .section {
            padding: 80px 0;
        }
        
        .section-title {
            font-weight: 700;
            margin-bottom: 40px;
            position: relative;
            display: inline-block;
        }
        
        .section-title:after {
            content: '';
            position: absolute;
            bottom: -10px;
            left: 0;
            width: 50px;
            height: 3px;
            background: var(--primary);
        }
        
        .btn-primary {
            background: var(--primary);
            border: none;
            padding: 12px 30px;
            font-weight: 600;
            border-radius: 30px;
            transition: all 0.3s;
        }
        
        .btn-primary:hover {
            background: ${this.darkenColor(primary)};
            transform: translateY(-3px);
            box-shadow: 0 10px 20px rgba(0, 102, 204, 0.2);
        }
        
        .card {
            border: none;
            border-radius: 10px;
            overflow: hidden;
            transition: all 0.3s;
            height: 100%;
        }
        
        .card:hover {
            transform: translateY(-10px);
            box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
        }
        
        .testimonial {
            text-align: center;
            margin-bottom: 30px;
            background: white;
            padding: 2rem;
            border-radius: 12px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.1);
        }

        .testimonial-avatar {
            width: 60px;
            height: 60px;
            background: var(--primary);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 1.5rem;
            font-weight: bold;
        }

        .counter {
            font-size: 3rem;
            font-weight: 700;
            color: var(--primary);
        }
        
        .cta {
            background: linear-gradient(135deg, var(--primary), ${secondary});
            color: white;
            padding: 80px 0;
            text-align: center;
        }
        
        .form-control {
            border-radius: 30px;
            padding: 12px 20px;
            border: 1px solid #ddd;
        }
        
        .form-control:focus {
            border-color: var(--primary);
            box-shadow: 0 0 0 0.25rem rgba(0, 102, 204, 0.25);
        }
        
        .footer {
            background: var(--dark);
            color: white;
            padding: 40px 0;
            text-align: center;
        }
        
        .social-icons a {
            color: white;
            font-size: 1.5rem;
            margin: 0 10px;
            transition: all 0.3s;
        }
        
        .social-icons a:hover {
            color: var(--primary);
        }
        
        .service-icon {
            font-size: 3rem;
            color: var(--primary);
            margin-bottom: 20px;
        }
        
        .team-member {
            text-align: center;
            margin-bottom: 30px;
        }
        
        .team-member img {
            width: 150px;
            height: 150px;
            border-radius: 50%;
            object-fit: cover;
            margin-bottom: 20px;
            border: 5px solid #f8f9fa;
        }
        
        .process-step {
            text-align: center;
            margin-bottom: 40px;
        }
        
        .process-step .step-number {
            width: 60px;
            height: 60px;
            background: var(--primary);
            color: white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.5rem;
            font-weight: 700;
            margin: 0 auto 20px;
        }
        
        .faq-item {
            margin-bottom: 20px;
            border: 1px solid #eee;
            border-radius: 10px;
            overflow: hidden;
        }
        
        .faq-question {
            background: #f8f9fa;
            padding: 15px 20px;
            font-weight: 600;
            cursor: pointer;
            position: relative;
        }
        
        .faq-question:after {
            content: '\\f107';
            font-family: 'Font Awesome 5 Free';
            font-weight: 900;
            position: absolute;
            right: 20px;
            top: 15px;
            transition: all 0.3s;
        }
        
        .faq-answer {
            padding: 0 20px;
            max-height: 0;
            overflow: hidden;
            transition: all 0.3s;
        }
        
        .faq-item.active .faq-question:after {
            transform: rotate(180deg);
        }
        
        .faq-item.active .faq-answer {
            padding: 15px 20px;
            max-height: 500px;
        }
        
        .floating-btn {
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 60px;
            height: 60px;
            border-radius: 50%;
            background-color: var(--primary);
            color: white;
            display: flex;
            justify-content: center;
            align-items: center;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
            cursor: pointer;
            z-index: 1000;
            transition: all 0.3s;
        }

        .floating-btn:hover {
            transform: scale(1.1);
        }

        .floating-btn i {
            font-size: 24px;
        }

        .floating-menu {
            position: fixed;
            flex-direction: column;
            bottom: 90px;
            right: 20px;
            width: 200px;
            background-color: white;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
            display: none;
            z-index: 1000;
            overflow: hidden;
        }

        .floating-menu-item {
            padding: 15px;
            border-bottom: 1px solid #eee;
            cursor: pointer;
            display: flex;
            align-items: center;
        }

        .floating-menu-item:last-child {
            border-bottom: none;
        }

        .floating-menu-item i {
            margin-right: 10px;
            color: var(--primary);
        }

        .floating-menu-item:hover {
            background-color: #f8f9fa;
        }

        .chat-modal {
            display: none;
            position: fixed;
            bottom: 90px;
            right: 20px;
            width: 350px;
            height: 450px;
            background-color: white;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
            z-index: 1000;
            flex-direction: column;
            overflow: hidden;
        }

        .chat-header {
            background-color: var(--primary);
            color: white;
            padding: 15px;
            text-align: center;
            font-weight: bold;
        }

        .chat-messages {
            flex: 1;
            padding: 15px;
            overflow-y: auto;
            background: #f8f9fa;
        }

        .message {
            margin-bottom: 10px;
            padding: 10px;
            border-radius: 10px;
            max-width: 80%;
        }

        .message.bot {
            background: white;
            border: 1px solid #ddd;
        }

        .message.user {
            background: var(--primary);
            color: white;
            margin-left: auto;
        }

        .chat-input {
            display: flex;
            padding: 10px;
            border-top: 1px solid #eee;
            background: white;
        }

        .chat-input input {
            flex: 1;
            padding: 10px;
            border: 1px solid #ddd;
            border-radius: 20px;
        }

        .chat-input button {
            margin-left: 10px;
            padding: 10px 20px;
            background-color: var(--primary);
            color: white;
            border: none;
            border-radius: 20px;
            cursor: pointer;
        }
        
        @media (max-width: 768px) {
            .hero {
                padding: 100px 0;
            }
            .section {
                padding: 60px 0;
            }
            .chat-modal {
                width: calc(100vw - 40px);
                right: 20px;
            }
        }
    </style>
    `;
  }

  private generateModernJavaScript(businessData: BusinessContent): string {
    const whatsappNumber = businessData.contact?.phone?.replace(/[^0-9]/g, '') || 
                          businessData.contact?.socialMedia?.whatsapp?.replace(/[^0-9]/g, '') || '';

    return `
    <script>
        // Contador animado
        const counters = document.querySelectorAll('.counter');
        const speed = 200;

        function countUp(counter) {
            const target = +counter.getAttribute('data-target');
            const count = +counter.innerText;
            const increment = target / speed;

            if (count < target) {
                counter.innerText = Math.ceil(count + increment);
                setTimeout(() => countUp(counter), 10);
            } else {
                counter.innerText = target;
            }
        }

        const observerOptions = { threshold: 0.7 };
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    countUp(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        counters.forEach(counter => observer.observe(counter));

        // FAQ
        document.querySelectorAll('.faq-item').forEach(item => {
            const question = item.querySelector('.faq-question');
            question.addEventListener('click', () => {
                document.querySelectorAll('.faq-item.active').forEach(activeItem => {
                    if (activeItem !== item) activeItem.classList.remove('active');
                });
                item.classList.toggle('active');
            });
        });

        // Form Submit
        function handleFormSubmit(e) {
            e.preventDefault();
            const name = document.getElementById('contactName').value;
            const email = document.getElementById('contactEmail').value;
            
            sendToWhatsApp('contato', { nome: name, email: email });
        }

        // WhatsApp
        function sendToWhatsApp(tipo, dados) {
            const whatsappNumber = '${whatsappNumber}';
            let mensagem = '';
            
            switch(tipo) {
                case 'contato':
                    mensagem = \`📞 *Contato* - Nome: \${dados.nome} | Email: \${dados.email} | Empresa: ${businessData.title}\`;
                    break;
                case 'orcamento':
                    mensagem = \`💰 *Orçamento* - Origem: \${dados.origem} | Empresa: ${businessData.title}\`;
                    break;
                default:
                    mensagem = \`📝 Interesse em ${businessData.title}\`;
            }
            
            if (!whatsappNumber) {
                alert('WhatsApp não configurado. Entre em contato pelos outros meios disponíveis.');
                return;
            }
            
            const encodedMessage = encodeURIComponent(mensagem);
            const whatsappUrl = \`https://wa.me/\${whatsappNumber}?text=\${encodedMessage}\`;
            window.open(whatsappUrl, '_blank');
        }

        // Chat System
        const floatingBtn = document.getElementById('floatingBtn');
        const floatingMenu = document.getElementById('floatingMenu');
        const chatOption = document.getElementById('chatOption');
        const whatsappOption = document.getElementById('whatsappOption');
        const chatModal = document.getElementById('chatModal');
        const chatMessages = document.getElementById('chatMessages');
        const chatInput = document.getElementById('chatInput');
        const chatSend = document.getElementById('chatSend');

        let chatHistory = [];
        let chatOpen = false;

        floatingBtn.addEventListener('click', () => {
            floatingMenu.style.display = floatingMenu.style.display === 'flex' ? 'none' : 'flex';
        });

        chatOption.addEventListener('click', () => {
            floatingMenu.style.display = 'none';
            chatModal.style.display = 'flex';
            chatOpen = true;
            
            if (chatMessages.children.length === 0) {
                addMessage('bot', '${businessData.sellerbot?.responses?.greeting || 'Olá! Como posso ajudar você hoje?'}');
            }
        });

        whatsappOption.addEventListener('click', () => {
            floatingMenu.style.display = 'none';
            const phoneNumber = '${whatsappNumber}';
            const message = 'Olá, gostaria de mais informações sobre ${businessData.title}.';
            window.open(\`https://wa.me/\${phoneNumber}?text=\${encodeURIComponent(message)}\`, '_blank');
        });

        document.addEventListener('click', (e) => {
            if (chatModal.style.display === 'flex' &&
                !chatModal.contains(e.target) &&
                !floatingMenu.contains(e.target) &&
                !floatingBtn.contains(e.target)) {
                chatModal.style.display = 'none';
            }
        });

        function addMessage(sender, text) {
            const messageDiv = document.createElement('div');
            messageDiv.className = \`message \${sender}\`;
            messageDiv.textContent = text;
            chatMessages.appendChild(messageDiv);
            chatMessages.scrollTop = chatMessages.scrollHeight;
            
            chatHistory.push({ sender, text });
        }

        async function sendChatMessage() {
            const message = chatInput.value.trim();
            if (!message) return;

            addMessage('user', message);
            chatInput.value = '';

            try {
                const response = await fetch('https://api.mistral.ai/v1/chat/completions', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer aynCSftAcQBOlxmtmpJqVzco8K4aaTDQ'
                    },
                    body: JSON.stringify({
                        model: 'mistral-tiny',
                        messages: [
                            {
                                role: 'system',
                                content: \`Você é assistente virtual de ${businessData.title}. 
                                Responda em português do Brasil, de forma simpática e profissional.
                                Máximo 2 frases curtas.
                                Informações: Telefone: ${businessData.contact?.phone || 'não informado'}, 
                                Email: ${businessData.contact?.email || 'não informado'}\`
                            },
                            ...chatHistory.slice(-5).map(m => ({
                                role: m.sender === 'user' ? 'user' : 'assistant',
                                content: m.text
                            })),
                            { role: 'user', content: message }
                        ],
                        max_tokens: 100,
                        temperature: 0.7
                    })
                });

                if (response.ok) {
                    const data = await response.json();
                    addMessage('bot', data.choices[0].message.content);
                } else {
                    addMessage('bot', 'Entre em contato: ${businessData.contact?.phone || businessData.contact?.email || 'utilize o formulário do site'}');
                }
            } catch (error) {
                addMessage('bot', 'Desculpe, ocorreu um erro. Entre em contato através dos meios disponíveis no site.');
            }
        }

        chatSend.addEventListener('click', sendChatMessage);
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') sendChatMessage();
        });
    </script>
    `;
  }

  // ==================== TEMPLATES ESPECÍFICOS POR NICHO ====================
  
  // Template 1: Visual/Galeria (Imobiliária, Fotografia, Arquitetura)
  private generateVisualGalleryTemplate(businessData: BusinessContent, images: any): string {
    return `
      ${this.generateHeaderSection(businessData, images)}
      ${this.generateHeroSection(businessData, images)}
      ${this.generateGalleryShowcase(businessData, images)}
      ${this.generateAboutSection(businessData, images)}
      ${this.generateRecentProjectsSection(businessData, images)}
      ${this.generateProcessSection(businessData)}
      ${this.generateTestimonialsSection(businessData)}
      ${this.generateContactSection(businessData)}
      ${this.generateFooterSection(businessData)}
      ${this.generateFloatingChat(businessData)}
    `;
  }
  
  // Template 2: Catálogo/E-commerce (Restaurante, Pizzaria, Loja)
  private generateCatalogEcommerceTemplate(businessData: BusinessContent, images: any): string {
    return `
      ${this.generateHeaderSection(businessData, images)}
      ${this.generateHeroSection(businessData, images)}
      ${this.generateProductCatalog(businessData, images)}
      ${this.generateFeaturedProducts(businessData, images)}
      ${this.generateAboutSection(businessData, images)}
      ${this.generateSpecialOffers(businessData, images)}
      ${this.generateTestimonialsSection(businessData)}
      ${this.generateDeliveryInfo(businessData)}
      ${this.generateCTAOrder(businessData)}
      ${this.generateFooterSection(businessData)}
      ${this.generateFloatingChat(businessData)}
    `;
  }
  
  // Template 3: Serviços/Depoimentos (Coach, Cursos, Consultoria)
  private generateServicesTestimonialsTemplate(businessData: BusinessContent, images: any): string {
    return `
      ${this.generateHeaderSection(businessData, images)}
      ${this.generateHeroSection(businessData, images)}
      ${this.generateAboutMethodSection(businessData, images)}
      ${this.generateBenefitsSection(businessData)}
      ${this.generateVideoTestimonials(businessData)}
      ${this.generateResultsCasesSection(businessData, images)}
      ${this.generateWhoIsForSection(businessData, images)}
      ${this.generateInvestmentSection(businessData, images)}
      ${this.generateFAQSection(businessData)}
      ${this.generateCTASignup(businessData)}
      ${this.generateFooterSection(businessData)}
      ${this.generateFloatingChat(businessData)}
    `;
  }
  
  // Template 4: Corporativo/B2B (Empresas, Serviços B2B)
  private generateCorporateB2BTemplate(businessData: BusinessContent, images: any): string {
    return `
      ${this.generateHeaderSection(businessData, images)}
      ${this.generateHeroSection(businessData, images)}
      ${this.generateAboutCompanySection(businessData, images)}
      ${this.generateServicesSection(businessData)}
      ${this.generateCasesSection(businessData, images)}
      ${this.generateResultsSection(businessData, images)}
      ${this.generateDifferentialsSection(businessData)}
      ${this.generatePartnersSection(businessData)}
      ${this.generateCTAQuote(businessData)}
      ${this.generateFooterSection(businessData)}
      ${this.generateFloatingChat(businessData)}
    `;
  }
  
  // Template 5: Local/Proximidade (Salão, Clínica, Oficina)
  private generateLocalProximityTemplate(businessData: BusinessContent, images: any): string {
    return `
      ${this.generateHeaderSection(businessData, images)}
      ${this.generateHeroSection(businessData, images)}
      ${this.generateAboutSection(businessData, images)}
      ${this.generateServicesSection(businessData)}
      ${this.generateBeforeAfterSection(businessData, images)}
      ${this.generateLocationSection(businessData)}
      ${this.generateHoursSection(businessData)}
      ${this.generatePricingSection(businessData)}
      ${this.generateTestimonialsSection(businessData)}
      ${this.generateCTAAppointment(businessData)}
      ${this.generateFooterSection(businessData)}
      ${this.generateFloatingChat(businessData)}
    `;
  }
  
  // Template 6: Projetos/Construção (Construção Civil, Reformas)
  private generateProjectsConstructionTemplate(businessData: BusinessContent, images: any): string {
    return `
      ${this.generateHeaderSection(businessData, images)}
      ${this.generateHeroSection(businessData, images)}
      ${this.generatePortfolioSection(businessData, images)}
      ${this.generateOurProcessSection(businessData, images)}
      ${this.generateStagesSection(businessData)}
      ${this.generateMaterialsSection(businessData, images)}
      ${this.generateWarrantySection(businessData)}
      ${this.generateTestimonialsSection(businessData)}
      ${this.generateCTAQuote(businessData)}
      ${this.generateFooterSection(businessData)}
      ${this.generateFloatingChat(businessData)}
    `;
  }
  
  // ==================== SEÇÕES ESPECÍFICAS PARA OS TEMPLATES ====================
  
  private generateGalleryShowcase(businessData: BusinessContent, images: any): string {
    const galleryImages = businessData.galleryImages || [];
    return `
    <section id="galeria" class="section bg-light">
      <div class="container">
        <h2 class="section-title text-center mb-5">Galeria de Projetos</h2>
        <div class="row g-3">
          ${galleryImages.slice(0, 6).map((item, i) => `
            <div class="col-md-4">
              <img src="https://image.pollinations.ai/prompt/${encodeURIComponent(item.imagePrompt)}?width=400&height=300&nologo=true&enhance=true" 
                   class="img-fluid rounded shadow" alt="${item.title || 'Projeto ' + (i+1)}" loading="lazy">
            </div>
          `).join('')}
        </div>
      </div>
    </section>
    `;
  }
  
  private generateRecentProjectsSection(businessData: BusinessContent, images: any): string {
    return `
    <section class="section">
      <div class="container">
        <h2 class="section-title text-center mb-5">Projetos Recentes</h2>
        <div class="row align-items-center">
          <div class="col-lg-6 mb-4">
            <img src="${images.results}" class="img-fluid rounded shadow" alt="Projetos">
          </div>
          <div class="col-lg-6">
            <h3>Excelência em Cada Detalhe</h3>
            <p class="lead">Nossos projetos recentes demonstram nosso compromisso com a qualidade e inovação.</p>
            <ul>
              <li>Projetos personalizados</li>
              <li>Alta qualidade de execução</li>
              <li>Prazos cumpridos</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
    `;
  }
  
  private generateProductCatalog(businessData: BusinessContent, images: any): string {
    const products = [
      { name: 'Produto Premium 1', price: 'R$ 99,90', img: images.motivation },
      { name: 'Produto Premium 2', price: 'R$ 149,90', img: images.target },
      { name: 'Produto Premium 3', price: 'R$ 199,90', img: images.method },
    ];
    
    return `
    <section id="catalogo" class="section">
      <div class="container">
        <h2 class="section-title text-center mb-5">Nosso Cardápio/Catálogo</h2>
        <div class="row g-4">
          ${products.map(p => `
            <div class="col-md-4">
              <div class="card h-100 shadow-sm">
                <img src="${p.img}" class="card-img-top" alt="${p.name}">
                <div class="card-body">
                  <h5 class="card-title">${p.name}</h5>
                  <p class="card-text fs-4 text-primary fw-bold">${p.price}</p>
                  <a href="#contato" class="btn btn-primary w-100">Pedir Agora</a>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </section>
    `;
  }
  
  private generateFeaturedProducts(businessData: BusinessContent, images: any): string {
    return `
    <section class="section bg-light">
      <div class="container">
        <h2 class="section-title text-center mb-5">Destaques da Semana</h2>
        <div class="row align-items-center">
          <div class="col-lg-6">
            <img src="${images.results}" class="img-fluid rounded shadow" alt="Destaques">
          </div>
          <div class="col-lg-6">
            <h3>Produtos Especiais</h3>
            <p class="lead">Confira nossas ofertas exclusivas desta semana!</p>
            <a href="#catalogo" class="btn btn-primary">Ver Mais</a>
          </div>
        </div>
      </div>
    </section>
    `;
  }
  
  private generateSpecialOffers(businessData: BusinessContent, images: any): string {
    return `
    <section class="section">
      <div class="container text-center">
        <h2 class="section-title mb-4">Ofertas Especiais</h2>
        <p class="lead mb-4">${businessData.contact?.socialMedia?.whatsapp ? 'Entre em contato pelo WhatsApp e aproveite condições exclusivas!' : 'Confira nossas promoções!'}</p>
        <div class="alert alert-success mx-auto" style="max-width: 600px;">
          <h4>🎉 Promoção da Semana!</h4>
          <p>Desconto especial em produtos selecionados</p>
        </div>
      </div>
    </section>
    `;
  }
  
  private generateDeliveryInfo(businessData: BusinessContent): string {
    return `
    <section class="section bg-light">
      <div class="container">
        <h2 class="section-title text-center mb-5">Como Fazer seu Pedido</h2>
        <div class="row">
          <div class="col-md-4 text-center mb-4">
            <div class="service-icon"><i class="fas fa-mobile-alt"></i></div>
            <h4>1. Escolha</h4>
            <p>Navegue pelo nosso catálogo</p>
          </div>
          <div class="col-md-4 text-center mb-4">
            <div class="service-icon"><i class="fas fa-whatsapp"></i></div>
            <h4>2. Entre em Contato</h4>
            <p>Fale conosco pelo WhatsApp</p>
          </div>
          <div class="col-md-4 text-center mb-4">
            <div class="service-icon"><i class="fas fa-shipping-fast"></i></div>
            <h4>3. Receba</h4>
            <p>Entregamos rapidamente</p>
          </div>
        </div>
      </div>
    </section>
    `;
  }
  
  private generateCTAOrder(businessData: BusinessContent): string {
    const whatsapp = businessData.contact?.socialMedia?.whatsapp || '';
    return `
    <section class="section cta-section">
      <div class="container text-center">
        <h2 class="text-white mb-4">Faça seu Pedido Agora!</h2>
        <a href="https://wa.me/${whatsapp.replace(/\D/g, '')}" class="btn btn-light btn-lg">
          <i class="fab fa-whatsapp me-2"></i>Pedir pelo WhatsApp
        </a>
      </div>
    </section>
    `;
  }
  
  private generateAboutMethodSection(businessData: BusinessContent, images: any): string {
    return `
    <section id="metodo" class="section">
      <div class="container">
        <div class="row align-items-center">
          <div class="col-lg-6">
            <img src="${images.method}" class="img-fluid rounded shadow" alt="Método">
          </div>
          <div class="col-lg-6">
            <h2 class="section-title">Nosso Método Exclusivo</h2>
            <p class="lead">Uma abordagem comprovada que transforma resultados.</p>
            <p>Com anos de experiência e centenas de casos de sucesso, desenvolvemos um método único que garante resultados extraordinários.</p>
          </div>
        </div>
      </div>
    </section>
    `;
  }
  
  private generateBenefitsSection(businessData: BusinessContent): string {
    return `
    <section class="section bg-light">
      <div class="container">
        <h2 class="section-title text-center mb-5">Benefícios que Você Vai Conquistar</h2>
        <div class="row g-4">
          <div class="col-md-4">
            <div class="card h-100 text-center p-4">
              <div class="service-icon"><i class="fas fa-rocket"></i></div>
              <h4>Resultados Rápidos</h4>
              <p>Veja mudanças significativas em pouco tempo</p>
            </div>
          </div>
          <div class="col-md-4">
            <div class="card h-100 text-center p-4">
              <div class="service-icon"><i class="fas fa-chart-line"></i></div>
              <h4>Crescimento Contínuo</h4>
              <p>Desenvolvimento progressivo e sustentável</p>
            </div>
          </div>
          <div class="col-md-4">
            <div class="card h-100 text-center p-4">
              <div class="service-icon"><i class="fas fa-trophy"></i></div>
              <h4>Alcance seus Objetivos</h4>
              <p>Realize suas metas com suporte especializado</p>
            </div>
          </div>
        </div>
      </div>
    </section>
    `;
  }
  
  private generateVideoTestimonials(businessData: BusinessContent): string {
    return `
    <section class="section">
      <div class="container">
        <h2 class="section-title text-center mb-5">Depoimentos em Vídeo</h2>
        <div class="row justify-content-center">
          <div class="col-lg-8">
            <div class="ratio ratio-16x9 mb-4">
              <div class="bg-secondary d-flex align-items-center justify-content-center text-white">
                <div class="text-center">
                  <i class="fas fa-play-circle fa-5x mb-3"></i>
                  <p class="lead">Vídeos de depoimentos dos nossos clientes</p>
                </div>
              </div>
            </div>
            <p class="text-center lead">Veja como transformamos a vida de nossos clientes</p>
          </div>
        </div>
      </div>
    </section>
    `;
  }
  
  private generateResultsCasesSection(businessData: BusinessContent, images: any): string {
    return `
    <section class="section bg-light">
      <div class="container">
        <h2 class="section-title text-center mb-5">Casos de Sucesso</h2>
        <div class="row">
          <div class="col-lg-6 mb-4">
            <img src="${images.results}" class="img-fluid rounded shadow" alt="Resultados">
          </div>
          <div class="col-lg-6">
            <h3>Resultados Comprovados</h3>
            <ul class="list-unstyled">
              <li class="mb-3"><i class="fas fa-check-circle text-success me-2"></i>+ de 500 clientes transformados</li>
              <li class="mb-3"><i class="fas fa-check-circle text-success me-2"></i>98% de satisfação</li>
              <li class="mb-3"><i class="fas fa-check-circle text-success me-2"></i>Resultados em média de 30 dias</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
    `;
  }
  
  private generateWhoIsForSection(businessData: BusinessContent, images: any): string {
    return `
    <section class="section">
      <div class="container">
        <h2 class="section-title text-center mb-5">Para Quem é Este Serviço</h2>
        <div class="row align-items-center">
          <div class="col-lg-6">
            <h3>Este serviço é perfeito para você que:</h3>
            <ul class="list-unstyled">
              <li class="mb-3">✓ Busca transformação real e duradoura</li>
              <li class="mb-3">✓ Está comprometido com seu desenvolvimento</li>
              <li class="mb-3">✓ Quer resultados comprovados</li>
              <li class="mb-3">✓ Procura acompanhamento profissional</li>
            </ul>
          </div>
          <div class="col-lg-6">
            <img src="${images.target}" class="img-fluid rounded shadow" alt="Público-alvo">
          </div>
        </div>
      </div>
    </section>
    `;
  }
  
  private generateResultsSection(businessData: BusinessContent, images: any): string {
    return `
    <section class="section bg-light">
      <div class="container">
        <h2 class="section-title text-center mb-5">Resultados</h2>
        <div class="row align-items-center">
          <div class="col-lg-6">
            <img src="${images.results}" class="img-fluid rounded shadow" alt="Resultados">
          </div>
          <div class="col-lg-6">
            <h3>Resultados Comprovados</h3>
            <p class="lead">Nossa equipe entrega resultados excepcionais para empresas de todos os portes.</p>
          </div>
        </div>
      </div>
    </section>
    `;
  }
  
  private generateInvestmentSection(businessData: BusinessContent, images: any): string {
    return `
    <section class="section bg-light">
      <div class="container">
        <h2 class="section-title text-center mb-5">Investimento</h2>
        <div class="row justify-content-center">
          <div class="col-lg-8">
            <div class="card shadow-lg">
              <div class="card-body p-5 text-center">
                <h3 class="mb-4">Invista no seu Sucesso</h3>
                <p class="lead mb-4">Planos personalizados para suas necessidades</p>
                <a href="#contato" class="btn btn-primary btn-lg">Consultar Valores</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    `;
  }
  
  private generateFAQSection(businessData: BusinessContent): string {
    return `
    <section class="section">
      <div class="container">
        <h2 class="section-title text-center mb-5">Perguntas Frequentes</h2>
        <div class="row justify-content-center">
          <div class="col-lg-8">
            <div class="accordion" id="faqAccordion">
              <div class="accordion-item">
                <h2 class="accordion-header">
                  <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#faq1">
                    Como funciona o processo?
                  </button>
                </h2>
                <div id="faq1" class="accordion-collapse collapse show" data-bs-parent="#faqAccordion">
                  <div class="accordion-body">
                    O processo é simples e eficiente. Entre em contato, faça uma avaliação inicial e começamos juntos sua jornada de transformação.
                  </div>
                </div>
              </div>
              <div class="accordion-item">
                <h2 class="accordion-header">
                  <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq2">
                    Quanto tempo para ver resultados?
                  </button>
                </h2>
                <div id="faq2" class="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                  <div class="accordion-body">
                    A maioria dos nossos clientes observa mudanças significativas nas primeiras semanas, com resultados consolidados em 30 a 90 dias.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    `;
  }
  
  private generateCTASignup(businessData: BusinessContent): string {
    return `
    <section class="section cta-section">
      <div class="container text-center">
        <h2 class="text-white mb-4">Pronto para Começar sua Transformação?</h2>
        <p class="text-white lead mb-4">Entre em contato agora e dê o primeiro passo!</p>
        <a href="#contato" class="btn btn-light btn-lg">Inscreva-se Agora</a>
      </div>
    </section>
    `;
  }
  
  private generateAboutCompanySection(businessData: BusinessContent, images: any): string {
    return `
    <section id="sobre" class="section">
      <div class="container">
        <div class="row align-items-center">
          <div class="col-lg-6 mb-4">
            <h2 class="section-title">Sobre ${businessData.title}</h2>
            <p class="lead">${businessData.subtitle}</p>
            <p>Somos uma empresa comprometida com a excelência e inovação, oferecendo soluções de alta qualidade para nossos clientes corporativos.</p>
          </div>
          <div class="col-lg-6">
            <img src="${images.motivation}" class="img-fluid rounded shadow" alt="Sobre a empresa">
          </div>
        </div>
      </div>
    </section>
    `;
  }
  
  private generateCasesSection(businessData: BusinessContent, images: any): string {
    return `
    <section class="section bg-light">
      <div class="container">
        <h2 class="section-title text-center mb-5">Cases de Sucesso</h2>
        <div class="row g-4">
          <div class="col-md-6">
            <div class="card h-100">
              <img src="${images.results}" class="card-img-top" alt="Case 1">
              <div class="card-body">
                <h5 class="card-title">Projeto Enterprise</h5>
                <p class="card-text">Implementação completa de solução corporativa com resultados extraordinários.</p>
              </div>
            </div>
          </div>
          <div class="col-md-6">
            <div class="card h-100">
              <img src="${images.method}" class="card-img-top" alt="Case 2">
              <div class="card-body">
                <h5 class="card-title">Transformação Digital</h5>
                <p class="card-text">Modernização de processos com aumento de 200% na eficiência.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    `;
  }
  
  private generateDifferentialsSection(businessData: BusinessContent): string {
    return `
    <section class="section">
      <div class="container">
        <h2 class="section-title text-center mb-5">Nossos Diferenciais</h2>
        <div class="row g-4">
          <div class="col-md-3 text-center">
            <div class="service-icon"><i class="fas fa-award"></i></div>
            <h5>Certificações</h5>
            <p>Padrões internacionais de qualidade</p>
          </div>
          <div class="col-md-3 text-center">
            <div class="service-icon"><i class="fas fa-users"></i></div>
            <h5>Equipe Especializada</h5>
            <p>Profissionais altamente qualificados</p>
          </div>
          <div class="col-md-3 text-center">
            <div class="service-icon"><i class="fas fa-clock"></i></div>
            <h5>Agilidade</h5>
            <p>Processos otimizados</p>
          </div>
          <div class="col-md-3 text-center">
            <div class="service-icon"><i class="fas fa-shield-alt"></i></div>
            <h5>Segurança</h5>
            <p>Máxima proteção de dados</p>
          </div>
        </div>
      </div>
    </section>
    `;
  }
  
  private generatePartnersSection(businessData: BusinessContent): string {
    return `
    <section class="section bg-light">
      <div class="container text-center">
        <h2 class="section-title mb-5">Parceiros e Certificações</h2>
        <p class="lead mb-4">Trabalhamos com as principais empresas do mercado</p>
        <div class="row justify-content-center">
          <div class="col-lg-8">
            <div class="alert alert-info">
              <i class="fas fa-handshake fa-3x mb-3"></i>
              <p>Parcerias estratégicas com líderes do setor</p>
            </div>
          </div>
        </div>
      </div>
    </section>
    `;
  }
  
  private generateCTAQuote(businessData: BusinessContent): string {
    return `
    <section class="section cta-section">
      <div class="container text-center">
        <h2 class="text-white mb-4">Solicite um Orçamento</h2>
        <p class="text-white lead mb-4">Entre em contato e descubra como podemos ajudar sua empresa</p>
        <a href="#contato" class="btn btn-light btn-lg">Solicitar Orçamento</a>
      </div>
    </section>
    `;
  }
  
  private generateBeforeAfterSection(businessData: BusinessContent, images: any): string {
    return `
    <section class="section">
      <div class="container">
        <h2 class="section-title text-center mb-5">Antes e Depois</h2>
        <div class="row g-4">
          <div class="col-md-6">
            <div class="card">
              <img src="${images.motivation}" class="card-img-top" alt="Antes">
              <div class="card-body text-center">
                <h5>Antes</h5>
              </div>
            </div>
          </div>
          <div class="col-md-6">
            <div class="card">
              <img src="${images.results}" class="card-img-top" alt="Depois">
              <div class="card-body text-center">
                <h5>Depois</h5>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    `;
  }
  
  private generateLocationSection(businessData: BusinessContent): string {
    const address = businessData.contact?.address || 'Endereço a definir';
    return `
    <section class="section bg-light">
      <div class="container">
        <h2 class="section-title text-center mb-5">Nossa Localização</h2>
        <div class="row">
          <div class="col-lg-6 mb-4">
            <div class="card h-100">
              <div class="card-body">
                <h4><i class="fas fa-map-marker-alt text-primary me-2"></i>Endereço</h4>
                <p class="lead">${address}</p>
                <h5 class="mt-4">Como Chegar:</h5>
                <p>Fácil acesso por transporte público e com estacionamento disponível.</p>
              </div>
            </div>
          </div>
          <div class="col-lg-6">
            <div class="ratio ratio-4x3">
              <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3657.0!2d-46.6!3d-23.5!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjPCsDMwJzAwLjAiUyA0NsKwMzYnMDAuMCJX!5e0!3m2!1spt-BR!2sbr!4v1234567890" 
                      style="border:0;" allowfullscreen="" loading="lazy"></iframe>
            </div>
          </div>
        </div>
      </div>
    </section>
    `;
  }
  
  private generateHoursSection(businessData: BusinessContent): string {
    return `
    <section class="section">
      <div class="container">
        <h2 class="section-title text-center mb-5">Horário de Funcionamento</h2>
        <div class="row justify-content-center">
          <div class="col-lg-6">
            <div class="card shadow">
              <div class="card-body">
                <ul class="list-unstyled mb-0">
                  <li class="d-flex justify-content-between py-2 border-bottom">
                    <span>Segunda a Sexta</span>
                    <strong>08:00 - 18:00</strong>
                  </li>
                  <li class="d-flex justify-content-between py-2 border-bottom">
                    <span>Sábado</span>
                    <strong>09:00 - 13:00</strong>
                  </li>
                  <li class="d-flex justify-content-between py-2">
                    <span>Domingo</span>
                    <strong>Fechado</strong>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    `;
  }
  
  private generatePricingSection(businessData: BusinessContent): string {
    return `
    <section class="section bg-light">
      <div class="container">
        <h2 class="section-title text-center mb-5">Tabela de Preços</h2>
        <div class="row justify-content-center">
          <div class="col-lg-8">
            <div class="card">
              <div class="card-body">
                <p class="lead text-center">Entre em contato para conhecer nossos preços e promoções especiais.</p>
                <div class="text-center mt-4">
                  <a href="#contato" class="btn btn-primary btn-lg">Consultar Preços</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    `;
  }
  
  private generateCTAAppointment(businessData: BusinessContent): string {
    const whatsapp = businessData.contact?.socialMedia?.whatsapp || '';
    return `
    <section class="section cta-section">
      <div class="container text-center">
        <h2 class="text-white mb-4">Agende sua Visita</h2>
        <p class="text-white lead mb-4">Entre em contato e marque seu horário!</p>
        <a href="https://wa.me/${whatsapp.replace(/\D/g, '')}" class="btn btn-light btn-lg">
          <i class="fab fa-whatsapp me-2"></i>Agendar pelo WhatsApp
        </a>
      </div>
    </section>
    `;
  }
  
  private generatePortfolioSection(businessData: BusinessContent, images: any): string {
    const galleryImages = businessData.galleryImages || [];
    return `
    <section id="portfolio" class="section bg-light">
      <div class="container">
        <h2 class="section-title text-center mb-5">Portfólio de Projetos</h2>
        <div class="row g-4">
          ${galleryImages.slice(0, 6).map((item, i) => `
            <div class="col-md-4">
              <div class="card h-100">
                <img src="https://image.pollinations.ai/prompt/${encodeURIComponent(item.imagePrompt)}?width=400&height=300&nologo=true&enhance=true" 
                     class="card-img-top" alt="${item.title || 'Projeto ' + (i+1)}" loading="lazy">
                <div class="card-body">
                  <h5 class="card-title">${item.title || 'Projeto ' + (i+1)}</h5>
                  <p class="card-text">${item.description || 'Obra executada com excelência e qualidade'}</p>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </section>
    `;
  }
  
  private generateOurProcessSection(businessData: BusinessContent, images: any): string {
    return `
    <section class="section">
      <div class="container">
        <h2 class="section-title text-center mb-5">Nosso Processo de Trabalho</h2>
        <div class="row align-items-center">
          <div class="col-lg-6 mb-4">
            <img src="${images.method}" class="img-fluid rounded shadow" alt="Processo">
          </div>
          <div class="col-lg-6">
            <h3>Metodologia Comprovada</h3>
            <p class="lead">Seguimos processos rigorosos para garantir a máxima qualidade em cada projeto.</p>
            <ul>
              <li>Planejamento detalhado</li>
              <li>Execução com acompanhamento</li>
              <li>Controle de qualidade</li>
              <li>Entrega no prazo</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
    `;
  }
  
  private generateStagesSection(businessData: BusinessContent): string {
    return `
    <section class="section bg-light">
      <div class="container">
        <h2 class="section-title text-center mb-5">Etapas do Trabalho</h2>
        <div class="row">
          <div class="col-md-3 text-center mb-4">
            <div class="process-step">
              <div class="step-number">1</div>
              <h5>Orçamento</h5>
              <p>Análise e proposta detalhada</p>
            </div>
          </div>
          <div class="col-md-3 text-center mb-4">
            <div class="process-step">
              <div class="step-number">2</div>
              <h5>Planejamento</h5>
              <p>Definição do projeto</p>
            </div>
          </div>
          <div class="col-md-3 text-center mb-4">
            <div class="process-step">
              <div class="step-number">3</div>
              <h5>Execução</h5>
              <p>Realização da obra</p>
            </div>
          </div>
          <div class="col-md-3 text-center mb-4">
            <div class="process-step">
              <div class="step-number">4</div>
              <h5>Entrega</h5>
              <p>Finalização e vistoria</p>
            </div>
          </div>
        </div>
      </div>
    </section>
    `;
  }
  
  private generateMaterialsSection(businessData: BusinessContent, images: any): string {
    return `
    <section class="section">
      <div class="container">
        <h2 class="section-title text-center mb-5">Materiais e Qualidade</h2>
        <div class="row align-items-center">
          <div class="col-lg-6">
            <h3>Excelência em Cada Detalhe</h3>
            <p class="lead">Utilizamos apenas materiais de primeira linha, garantindo durabilidade e acabamento perfeito.</p>
            <ul>
              <li>Fornecedores certificados</li>
              <li>Materiais de alta qualidade</li>
              <li>Garantia estendida</li>
            </ul>
          </div>
          <div class="col-lg-6">
            <img src="${images.results}" class="img-fluid rounded shadow" alt="Materiais">
          </div>
        </div>
      </div>
    </section>
    `;
  }
  
  private generateWarrantySection(businessData: BusinessContent): string {
    return `
    <section class="section bg-light">
      <div class="container text-center">
        <h2 class="section-title mb-4">Garantia de Qualidade</h2>
        <div class="row justify-content-center">
          <div class="col-lg-8">
            <div class="card shadow-lg">
              <div class="card-body p-5">
                <i class="fas fa-shield-alt fa-4x text-primary mb-4"></i>
                <h3>Garantia Total</h3>
                <p class="lead">Todos os nossos serviços incluem garantia completa, assegurando sua tranquilidade e satisfação.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    `;
  }
  
  private generateContactSection(businessData: BusinessContent): string {
    return `
    <section id="contato" class="section bg-light">
      <div class="container">
        <h2 class="section-title text-center mb-5">Entre em Contato</h2>
        <div class="row justify-content-center">
          <div class="col-lg-8">
            <div class="card shadow">
              <div class="card-body p-5">
                <div class="row">
                  <div class="col-md-6 mb-4">
                    <h5><i class="fas fa-phone text-primary me-2"></i>Telefone</h5>
                    <p>${businessData.contact?.phone || 'A definir'}</p>
                  </div>
                  <div class="col-md-6 mb-4">
                    <h5><i class="fas fa-envelope text-primary me-2"></i>Email</h5>
                    <p>${businessData.contact?.email || 'A definir'}</p>
                  </div>
                  <div class="col-12 mb-4">
                    <h5><i class="fas fa-map-marker-alt text-primary me-2"></i>Endereço</h5>
                    <p>${businessData.contact?.address || 'A definir'}</p>
                  </div>
                  ${businessData.contact?.socialMedia?.whatsapp ? `
                  <div class="col-12 text-center">
                    <a href="https://wa.me/${businessData.contact.socialMedia.whatsapp.replace(/\D/g, '')}" 
                       class="btn btn-success btn-lg">
                      <i class="fab fa-whatsapp me-2"></i>Fale pelo WhatsApp
                    </a>
                  </div>
                  ` : ''}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    `;
  }

  private darkenColor(hex: string): string {
    // Função auxiliar para escurecer cores
    const num = parseInt(hex.replace('#', ''), 16);
    const amt = -20;
    const R = (num >> 16) + amt;
    const G = (num >> 8 & 0x00FF) + amt;
    const B = (num & 0x0000FF) + amt;
    return '#' + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
      (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
      (B < 255 ? B < 1 ? 0 : B : 255))
      .toString(16).slice(1);
  }
}

export const htmlAgent = new HtmlAgent();
