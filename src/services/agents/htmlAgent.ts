import { BusinessContent } from '../contentGenerator';

interface Template {
  id: string;
  name: string;
  generateHTML: (businessData: BusinessContent, images: any) => string;
}

export class HtmlAgent {
  private templates: { [key: string]: Template } = {
    'moderno-visual': {
      id: 'moderno-visual',
      name: 'Moderno & Visual',
      generateHTML: this.generateModernoVisualTemplate.bind(this)
    },
    'minimalista-clean': {
      id: 'minimalista-clean', 
      name: 'Minimalista & Clean',
      generateHTML: this.generateMinimalistaCleanTemplate.bind(this)
    },
    'interativo-dinamico': {
      id: 'interativo-dinamico',
      name: 'Interativo & Dinâmico', 
      generateHTML: this.generateInterativoDinamicoTemplate.bind(this)
    }
  };

  async generateHTML(businessData: BusinessContent): Promise<string> {
    const images = await this.generateImageUrls(businessData.images, businessData.customImages, businessData);
    
    const templateId = businessData.template || 'moderno-visual';
    const template = this.templates[templateId];
    
    if (!template) {
      console.warn(`Template ${templateId} não encontrado, usando moderno-visual`);
      return this.templates['moderno-visual'].generateHTML(businessData, images);
    }

    return template.generateHTML(businessData, images);
  }

  private async generateImageUrls(images: any, customImages?: { [key: string]: string }, businessData?: BusinessContent): Promise<any> {
    const baseUrl = 'https://image.pollinations.ai/prompt/';
    const imageParams = '?width=720&height=480&enhance=true&nologo=true';
    
    const logoPrompt = images.logo || `Logo da empresa ${businessData?.title || 'negócio profissional'}`;
    
    // Priorizar logos personalizados do usuário (blob URLs ou arquivo local)
    const hasCustomLogo = customImages?.logo && (customImages.logo.startsWith('blob:') || customImages.logo.startsWith('data:') || !customImages.logo.includes('pollinations.ai'));
    
    const imageUrls = {
      logo: hasCustomLogo ? customImages.logo : `${baseUrl}${encodeURIComponent(logoPrompt)}${imageParams}`,
      hero: customImages?.hero || `${baseUrl}${encodeURIComponent(images.hero || `${businessData?.title} - ambiente principal do negócio profissional`)}${imageParams}`,
      motivation: customImages?.motivation || `${baseUrl}${encodeURIComponent(images.motivation || `${businessData?.title} - motivação e propósito do negócio`)}${imageParams}`,
      target: customImages?.target || `${baseUrl}${encodeURIComponent(images.target || `${businessData?.title} - público-alvo satisfeito com o serviço`)}${imageParams}`,
      method: customImages?.method || `${baseUrl}${encodeURIComponent(images.method || `${businessData?.title} - método e processo de trabalho`)}${imageParams}`,
      results: customImages?.results || `${baseUrl}${encodeURIComponent(images.results || `${businessData?.title} - resultados e conquistas alcançadas`)}${imageParams}`,
      access: customImages?.access || `${baseUrl}${encodeURIComponent(images.access || `${businessData?.title} - formas de contato e acesso`)}${imageParams}`,
      investment: customImages?.investment || `${baseUrl}${encodeURIComponent(images.investment || `${businessData?.title} - investimento e preços competitivos`)}${imageParams}`,
      gallery: businessData?.galleryImages ? businessData.galleryImages.map((prompt: string, i: number) => 
        customImages?.[`gallery_${i}`] || `${baseUrl}${encodeURIComponent(prompt)}${imageParams}`
      ) : [
        `${baseUrl}${encodeURIComponent(`${businessData?.title} - ambiente interno profissional`)}${imageParams}`,
        `${baseUrl}${encodeURIComponent(`${businessData?.title} - cliente satisfeito com o serviço`)}${imageParams}`,
        `${baseUrl}${encodeURIComponent(`${businessData?.title} - equipe trabalhando`)}${imageParams}`,
        `${baseUrl}${encodeURIComponent(`${businessData?.title} - produto ou serviço em ação`)}${imageParams}`,
        `${baseUrl}${encodeURIComponent(`${businessData?.title} - atendimento de qualidade`)}${imageParams}`,
        `${baseUrl}${encodeURIComponent(`${businessData?.title} - resultado final do trabalho`)}${imageParams}`
      ]
    };

    return imageUrls;
  }

  // TEMPLATE 1 - MODERNO & VISUAL
  private generateModernoVisualTemplate(businessData: BusinessContent, images: any): string {
    return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${businessData.title}</title>
    <meta name="description" content="${businessData.subtitle}">
    ${this.generateModernoVisualCSS(businessData)}
</head>
<body>
    ${this.generateModernoVisualNavigation(businessData, images)}
    ${this.generateModernoVisualHero(businessData, images)}
    ${this.generateModernoVisual5W2H(businessData, images)}
    ${this.generateModernoVisualGallery(businessData, images)}
    ${this.generateModernoVisualFooter(businessData, images)}
    ${this.generateModernoVisualChatWidget(businessData)}
    ${this.generateModernoVisualJavaScript(businessData)}
</body>
</html>`;
  }

  private generateModernoVisualCSS(businessData: BusinessContent): string {
    return `<style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 20px;
        }
        
        /* Cabeçalho - Fundo escuro (#2c3e50) */
        .navbar {
            position: fixed;
            top: 0;
            width: 100%;
            background: #2c3e50;
            z-index: 1000;
            padding: 1rem 0;
            box-shadow: 0 2px 20px rgba(0,0,0,0.1);
        }
        
        .nav-content {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .logo {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            font-size: 1.5rem;
            font-weight: bold;
            color: white;
            opacity: 0;
            animation: fadeIn 1s ease-out forwards;
        }
        
        .logo-image {
            width: 45px;
            height: 45px;
            object-fit: cover;
            border-radius: 50%;
        }
        
        .nav-menu {
            display: flex;
            list-style: none;
            gap: 2rem;
        }
        
        .nav-menu a {
            text-decoration: none;
            color: white;
            font-weight: 500;
            position: relative;
            transition: color 0.3s;
        }
        
        .nav-menu a:hover {
            color: #3498db;
        }
        
        /* Hover underline animado */
        .nav-menu a::after {
            content: '';
            position: absolute;
            width: 0;
            height: 2px;
            bottom: -5px;
            left: 0;
            background: #3498db;
            transition: width 0.3s ease;
        }
        
        .nav-menu a:hover::after {
            width: 100%;
        }
        
        .whatsapp-btn {
            background: #25D366;
            color: white;
            padding: 10px 20px;
            border-radius: 25px;
            text-decoration: none;
            font-weight: bold;
            animation: pulse 2s infinite;
        }
        
        /* Hero Section */
        .hero {
            min-height: 100vh;
            display: flex;
            align-items: center;
            background: linear-gradient(135deg, ${businessData.colors.primary}, ${businessData.colors.secondary});
            color: white;
            text-align: center;
            margin-top: 80px;
        }
        
        .hero h1 {
            font-size: 3.5rem;
            margin-bottom: 1rem;
        }
        
        /* Seção 5W2H - 7 cards (4 superiores + 3 inferiores) */
        .cards-section {
            padding: 4rem 0;
            background: #f8f9fa;
        }
        
        .cards-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 2rem;
            margin-bottom: 2rem;
        }
        
        .cards-grid-bottom {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 2rem;
            max-width: 900px;
            margin: 0 auto;
        }
        
        .card {
            background: white;
            padding: 2rem;
            border-radius: 15px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
            text-align: center;
            transition: transform 0.3s;
        }
        
        .card:hover {
            transform: translateY(-10px);
        }
        
        .card-icon {
            font-size: 3rem;
            margin-bottom: 1rem;
            transition: transform 0.3s;
        }
        
        .card:hover .card-icon {
            transform: rotate(360deg);
        }
        
        .card h3 {
            color: #3498db;
            margin-bottom: 1rem;
        }
        
        .card p {
            color: #666;
        }
        
        /* Galeria - Grid 3x3 */
        .gallery-section {
            padding: 4rem 0;
        }
        
        .gallery-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 1.5rem;
        }
        
        .gallery-item {
            aspect-ratio: 1;
            border-radius: 15px;
            overflow: hidden;
            position: relative;
            cursor: pointer;
        }
        
        .gallery-item img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: transform 0.3s;
        }
        
        .gallery-item:hover img {
            transform: scale(1.1);
        }
        
        .gallery-overlay {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.7);
            backdrop-filter: blur(10px);
            opacity: 0;
            transition: opacity 0.3s;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: bold;
        }
        
        .gallery-item:hover .gallery-overlay {
            opacity: 1;
        }
        
        /* Rodapé - 4 colunas */
        .footer {
            background: #2c3e50;
            color: white;
            padding: 3rem 0;
        }
        
        .footer-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 2rem;
        }
        
        /* Chat Widget - Laranja com bounce */
        .chat-widget {
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 10000;
        }
        
        .chat-button {
            width: 60px;
            height: 60px;
            background: #ff6600;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            color: white;
            font-size: 24px;
            animation: bounce 2s infinite;
            border: none;
            box-shadow: 0 4px 20px rgba(255, 102, 0, 0.3);
            transition: all 0.3s ease;
        }

        .chat-button:hover {
            transform: scale(1.1);
            box-shadow: 0 6px 25px rgba(255, 102, 0, 0.4);
        }

        /* Sellerbot Modal */
        .sellerbot-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            z-index: 10001;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }

        .sellerbot-container {
            width: 100%;
            max-width: 400px;
            height: 600px;
            background: white;
            border-radius: 15px;
            display: flex;
            flex-direction: column;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        }

        .sellerbot-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 20px;
            border-bottom: 1px solid #eee;
            background: ${businessData.colors.primary};
            color: white;
            border-radius: 15px 15px 0 0;
        }

        .sellerbot-info {
            display: flex;
            align-items: center;
            gap: 12px;
        }

        .sellerbot-avatar {
            width: 40px;
            height: 40px;
            background: rgba(255, 255, 255, 0.2);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 20px;
        }

        .sellerbot-info h3 {
            margin: 0;
            font-size: 16px;
        }

        .sellerbot-info p {
            margin: 0;
            font-size: 12px;
            opacity: 0.8;
        }

        .close-btn {
            background: none;
            border: none;
            color: white;
            font-size: 20px;
            cursor: pointer;
            padding: 5px;
            border-radius: 50%;
            transition: background 0.3s;
        }

        .close-btn:hover {
            background: rgba(255, 255, 255, 0.2);
        }

        .sellerbot-messages {
            flex: 1;
            padding: 20px;
            overflow-y: auto;
            display: flex;
            flex-direction: column;
            gap: 15px;
        }

        .message {
            max-width: 80%;
            padding: 12px 16px;
            border-radius: 15px;
            position: relative;
        }

        .assistant-message {
            background: #f0f0f0;
            align-self: flex-start;
        }

        .user-message {
            background: ${businessData.colors.primary};
            color: white;
            align-self: flex-end;
        }

        .message-time {
            font-size: 10px;
            opacity: 0.7;
            display: block;
            margin-top: 5px;
        }

        .sellerbot-quick-actions {
            padding: 10px 20px;
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
        }

        .sellerbot-quick-actions button {
            background: #f0f0f0;
            border: 1px solid #ddd;
            border-radius: 20px;
            padding: 8px 12px;
            font-size: 12px;
            cursor: pointer;
            transition: all 0.3s;
        }

        .sellerbot-quick-actions button:hover {
            background: ${businessData.colors.primary};
            color: white;
            border-color: ${businessData.colors.primary};
        }

        .sellerbot-input {
            display: flex;
            padding: 20px;
            border-top: 1px solid #eee;
            gap: 10px;
        }

        .sellerbot-input input {
            flex: 1;
            padding: 12px 16px;
            border: 1px solid #ddd;
            border-radius: 25px;
            outline: none;
            font-size: 14px;
        }

        .sellerbot-input input:focus {
            border-color: ${businessData.colors.primary};
        }

        .sellerbot-input button {
            width: 45px;
            height: 45px;
            background: ${businessData.colors.primary};
            color: white;
            border: none;
            border-radius: 50%;
            cursor: pointer;
            font-size: 16px;
            transition: all 0.3s;
        }

        .sellerbot-input button:hover {
            transform: scale(1.05);
        }

        .typing-indicator {
            display: flex;
            align-items: center;
            gap: 5px;
            padding: 12px 16px;
            background: #f0f0f0;
            border-radius: 15px;
            align-self: flex-start;
            max-width: 80px;
        }

        .typing-dots {
            display: flex;
            gap: 2px;
        }

        .typing-dots span {
            width: 6px;
            height: 6px;
            background: #999;
            border-radius: 50%;
            animation: typing 1.4s infinite;
        }

        .typing-dots span:nth-child(2) {
            animation-delay: 0.2s;
        }

        .typing-dots span:nth-child(3) {
            animation-delay: 0.4s;
        }

        @keyframes typing {
            0%, 60%, 100% {
                transform: translateY(0);
            }
            30% {
                transform: translateY(-10px);
            }
        }
        
        /* Animações */
        @keyframes fadeIn {
            to { opacity: 1; }
        }
        
        @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.05); }
        }
        
        @keyframes bounce {
            0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
            40% { transform: translateY(-10px); }
            60% { transform: translateY(-5px); }
        }
        
        /* Responsivo */
        @media (max-width: 768px) {
            .cards-grid {
                grid-template-columns: repeat(2, 1fr);
            }
            
            .cards-grid-bottom {
                grid-template-columns: 1fr;
            }
            
            .gallery-grid {
                grid-template-columns: repeat(2, 1fr);
            }
            
            .footer-grid {
                grid-template-columns: repeat(2, 1fr);
            }
        }
        
        @media (max-width: 480px) {
            .cards-grid {
                grid-template-columns: 1fr;
            }
            
            .gallery-grid {
                grid-template-columns: 1fr;
            }
            
            .footer-grid {
                grid-template-columns: 1fr;
            }
        }
    </style>`;
  }
  
  private generateModernoVisualNavigation(businessData: BusinessContent, images: any): string {
    return `<nav class="navbar">
        <div class="container">
            <div class="nav-content">
                <div class="logo">
                    <img src="${images.logo}" alt="Logo" class="logo-image">
                    <span>${businessData.title}</span>
                </div>
                <ul class="nav-menu">
                    <li><a href="#sobre">Sobre</a></li>
                    <li><a href="#servicos">Serviços</a></li>
                    <li><a href="#galeria">Galeria</a></li>
                    <li><a href="#contato">Contato</a></li>
                </ul>
                <a href="https://wa.me/${businessData.contact.phone?.replace(/\D/g, '')}" class="whatsapp-btn">WhatsApp</a>
            </div>
        </div>
    </nav>`;
  }

  private generateModernoVisualHero(businessData: BusinessContent, images: any): string {
    return `<section class="hero">
        <div class="container">
            <h1>${businessData.title}</h1>
            <p style="font-size: 1.2rem; margin-bottom: 2rem;">${businessData.heroText}</p>
            <a href="#contato" style="background: ${businessData.colors.accent}; color: white; padding: 1rem 2rem; text-decoration: none; border-radius: 50px; font-weight: bold; transition: all 0.3s;">${businessData.ctaText}</a>
        </div>
    </section>`;
  }

  private generateModernoVisual5W2H(businessData: BusinessContent, images: any): string {
    const cards = businessData.sections.slice(0, 7);
    const topCards = cards.slice(0, 4);
    const bottomCards = cards.slice(4, 7);
    
    const cardIcons = ['🎯', '👥', '⚡', '💡', '🚀', '✨', '🏆'];
    
    return `<section class="cards-section" id="sobre">
        <div class="container">
            <h2 style="text-align: center; font-size: 2.5rem; margin-bottom: 3rem; color: ${businessData.colors.primary};">Conheça Nossa Proposta</h2>
            
            <div class="cards-grid">
                ${topCards.map((section, index) => `
                    <div class="card">
                        <div class="card-icon">${cardIcons[index]}</div>
                        <h3>${section.title}</h3>
                        <p>${section.content}</p>
                    </div>
                `).join('')}
            </div>
            
            <div class="cards-grid-bottom">
                ${bottomCards.map((section, index) => `
                    <div class="card">
                        <div class="card-icon">${cardIcons[index + 4]}</div>
                        <h3>${section.title}</h3>
                        <p>${section.content}</p>
                    </div>
                `).join('')}
            </div>
        </div>
    </section>`;
  }

  private generateModernoVisualGallery(businessData: BusinessContent, images: any): string {
    if (!images.gallery || !Array.isArray(images.gallery)) return '';
    
    return `<section class="gallery-section" id="galeria">
        <div class="container">
            <h2 style="text-align: center; font-size: 2.5rem; margin-bottom: 3rem; color: ${businessData.colors.primary};">Galeria</h2>
            <div class="gallery-grid">
                ${images.gallery.map((imageUrl: string, index: number) => `
                    <div class="gallery-item" onclick="openImageModal('${imageUrl}', 'Imagem ${index + 1}')">
                        <img src="${imageUrl}" alt="Imagem ${index + 1}">
                        <div class="gallery-overlay">
                            Ver Imagem
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    </section>`;
  }

  private generateModernoVisualFooter(businessData: BusinessContent, images: any): string {
    return `<footer class="footer" id="contato">
        <div class="container">
            <div class="footer-grid">
                <div>
                    <h3>${businessData.title}</h3>
                    <img src="${images.logo}" alt="Logo" style="width: 60px; height: 60px; border-radius: 50%; margin: 1rem 0;">
                </div>
                <div>
                    <h4>Links</h4>
                    <ul style="list-style: none;">
                        <li><a href="#sobre" style="color: white; text-decoration: none;">Sobre</a></li>
                        <li><a href="#servicos" style="color: white; text-decoration: none;">Serviços</a></li>
                        <li><a href="#galeria" style="color: white; text-decoration: none;">Galeria</a></li>
                    </ul>
                </div>
                <div>
                    <h4>Contatos</h4>
                    <p>${businessData.contact.phone}</p>
                    <p>${businessData.contact.email}</p>
                    <p>${businessData.contact.address}</p>
                </div>
                <div>
                    <h4>Redes Sociais</h4>
                    <div style="display: flex; gap: 1rem;">
                        <a href="#" style="color: white;">📘</a>
                        <a href="#" style="color: white;">📷</a>
                        <a href="#" style="color: white;">💼</a>
                    </div>
                </div>
            </div>
        </div>
    </footer>`;
  }

  private generateModernoVisualChatWidget(businessData: BusinessContent): string {
    return `<div class="chat-widget">
        <button class="chat-button" onclick="openSellerbotChat()">💬</button>
    </div>
    
    <!-- Modal do Sellerbot -->
    <div id="sellerbotModal" class="sellerbot-modal" style="display: none;">
        <div class="sellerbot-container">
            <div class="sellerbot-header">
                <div class="sellerbot-info">
                    <div class="sellerbot-avatar">💬</div>
                    <div>
                        <h3>${businessData.sellerbot?.name || `Atendente ${businessData.title}`}</h3>
                        <p>Online agora</p>
                    </div>
                </div>
                <button onclick="closeSellerbotChat()" class="close-btn">✕</button>
            </div>
            <div class="sellerbot-messages" id="sellerbotMessages">
                <div class="message assistant-message">
                    <p>${businessData.sellerbot?.responses?.greeting || `Olá! Bem-vindo à ${businessData.title}. Como posso ajudá-lo hoje?`}</p>
                    <span class="message-time">${new Date().toLocaleTimeString()}</span>
                </div>
            </div>
            <div class="sellerbot-quick-actions" id="quickActions">
                <button onclick="sendQuickMessage('Quais são os seus serviços?')">Quais são os seus serviços?</button>
                <button onclick="sendQuickMessage('Qual o preço?')">Qual o preço?</button>
                <button onclick="sendQuickMessage('Como posso agendar?')">Como agendar?</button>
            </div>
            <div class="sellerbot-input">
                <input type="text" id="sellerbotInput" placeholder="Digite sua mensagem..." onkeypress="handleSellerbotKeyPress(event)">
                <button onclick="sendSellerbotMessage()">➤</button>
            </div>
        </div>
    </div>`;
  }

  private generateModernoVisualJavaScript(businessData: BusinessContent): string {
    return `<script>
        let isTyping = false;
        
        function openSellerbotChat() {
            document.getElementById('sellerbotModal').style.display = 'flex';
        }
        
        function closeSellerbotChat() {
            document.getElementById('sellerbotModal').style.display = 'none';
        }
        
        function sendQuickMessage(message) {
            const input = document.getElementById('sellerbotInput');
            input.value = message;
            sendSellerbotMessage();
            // Esconder quick actions após primeira mensagem
            document.getElementById('quickActions').style.display = 'none';
        }
        
        function handleSellerbotKeyPress(event) {
            if (event.key === 'Enter') {
                sendSellerbotMessage();
            }
        }
        
        function sendSellerbotMessage() {
            const input = document.getElementById('sellerbotInput');
            const message = input.value.trim();
            if (!message || isTyping) return;
            
            input.value = '';
            addMessage('user', message);
            
            // Esconder quick actions
            document.getElementById('quickActions').style.display = 'none';
            
            // Simular digitação
            showTyping();
            
            // Simular resposta da IA após 2 segundos
            setTimeout(() => {
                hideTyping();
                const response = generateSellerbotResponse(message);
                addMessage('assistant', response);
            }, 2000);
        }
        
        function addMessage(role, content) {
            const messagesContainer = document.getElementById('sellerbotMessages');
            const messageDiv = document.createElement('div');
            messageDiv.className = \`message \${role}-message\`;
            messageDiv.innerHTML = \`
                <p>\${content}</p>
                <span class="message-time">\${new Date().toLocaleTimeString()}</span>
            \`;
            messagesContainer.appendChild(messageDiv);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }
        
        function showTyping() {
            isTyping = true;
            const messagesContainer = document.getElementById('sellerbotMessages');
            const typingDiv = document.createElement('div');
            typingDiv.id = 'typingIndicator';
            typingDiv.className = 'typing-indicator';
            typingDiv.innerHTML = \`
                <div class="typing-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            \`;
            messagesContainer.appendChild(typingDiv);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }
        
        function hideTyping() {
            isTyping = false;
            const typingIndicator = document.getElementById('typingIndicator');
            if (typingIndicator) {
                typingIndicator.remove();
            }
        }
        
        function generateSellerbotResponse(userMessage) {
            const msg = userMessage.toLowerCase();
            
            if (msg.includes('serviço') || msg.includes('produto')) {
                return '${businessData.sellerbot?.responses?.services || `Oferecemos diversos serviços de qualidade. ${businessData.subtitle || ''}`}';
            } else if (msg.includes('preço') || msg.includes('valor') || msg.includes('custo')) {
                return '${businessData.sellerbot?.responses?.pricing || 'Entre em contato conosco para conhecer nossos preços e condições especiais.'}';
            } else if (msg.includes('agendar') || msg.includes('marcar') || msg.includes('horário')) {
                return '${businessData.sellerbot?.responses?.appointment || 'Ficou interessado? Entre em contato conosco para agendar!'} WhatsApp: ${businessData.contact.phone}';
            } else if (msg.includes('endereço') || msg.includes('localização') || msg.includes('onde')) {
                return 'Estamos localizados em: ${businessData.contact.address}';
            } else if (msg.includes('contato') || msg.includes('telefone') || msg.includes('whatsapp')) {
                return 'Você pode entrar em contato conosco pelo WhatsApp: ${businessData.contact.phone} ou email: ${businessData.contact.email}';
            } else {
                return 'Obrigado pelo contato! Para mais informações específicas, entre em contato conosco pelo WhatsApp: ${businessData.contact.phone}';
            }
        }
        
        function openWhatsApp() {
            window.open('https://wa.me/${businessData.contact.phone?.replace(/\D/g, '')}?text=Olá, gostaria de mais informações!', '_blank');
        }
        
        function openImageModal(src, caption) {
            const modal = document.createElement('div');
            modal.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.9); z-index: 10002; display: flex; align-items: center; justify-content: center;';
            
            const img = document.createElement('img');
            img.src = src;
            img.style.cssText = 'max-width: 90%; max-height: 90%; border-radius: 10px;';
            
            modal.appendChild(img);
            modal.onclick = () => document.body.removeChild(modal);
            
            document.body.appendChild(modal);
        }
        
        // Fechar modal ao clicar fora
        document.addEventListener('click', function(event) {
            const modal = document.getElementById('sellerbotModal');
            if (event.target === modal) {
                closeSellerbotChat();
            }
        });
    </script>`;
  }

  // TEMPLATE 2 - MINIMALISTA & CLEAN  
  private generateMinimalistaCleanTemplate(businessData: BusinessContent, images: any): string {
    return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${businessData.title}</title>
    <meta name="description" content="${businessData.subtitle}">
    ${this.generateMinimalistaCleanCSS(businessData)}
</head>
<body>
    ${this.generateMinimalistaCleanNavigation(businessData, images)}
    ${this.generateMinimalistaCleanHero(businessData, images)}
    ${this.generateMinimalistaCleanAccordion(businessData, images)}
    ${this.generateMinimalistaCleanCarousel(businessData, images)}
    ${this.generateMinimalistaCleanFooter(businessData, images)}
    ${this.generateMinimalistaCleanChatWidget(businessData)}
    ${this.generateMinimalistaCleanJavaScript(businessData)}
</body>
</html>`;
  }

  private generateMinimalistaCleanCSS(businessData: BusinessContent): string {
    return `<style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            background: white;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 20px;
        }
        
        /* Cabeçalho - Fundo branco, 2 colunas */
        .navbar {
            position: fixed;
            top: 0;
            width: 100%;
            background: white;
            z-index: 1000;
            padding: 1rem 0;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        
        .nav-content {
            display: grid;
            grid-template-columns: 1fr 1fr;
            align-items: center;
        }
        
        .logo {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            font-size: 1.5rem;
            font-weight: bold;
            color: #333;
            opacity: 0;
            animation: fadeIn 1s ease-out forwards;
        }
        
        .logo-image {
            width: 45px;
            height: 45px;
            object-fit: cover;
            border-radius: 50%;
        }
        
        .nav-menu {
            display: flex;
            list-style: none;
            gap: 2rem;
            justify-self: end;
        }
        
        .nav-menu a {
            text-decoration: none;
            color: #333;
            font-weight: 500;
            position: relative;
            transition: color 0.3s;
        }
        
        .nav-menu a:hover {
            color: #e74c3c;
        }
        
        /* Linha separadora cinza animada */
        .nav-menu a::after {
            content: '';
            position: absolute;
            width: 0;
            height: 1px;
            bottom: -5px;
            left: 0;
            background: #ccc;
            transition: width 0.3s ease;
        }
        
        .nav-menu a:hover::after {
            width: 100%;
        }
        
        .whatsapp-btn-fixed {
            position: fixed;
            top: 20px;
            right: 20px;
            background: #25D366;
            color: white;
            padding: 10px 20px;
            border-radius: 25px;
            text-decoration: none;
            font-weight: bold;
            z-index: 1001;
        }
        
        /* Hero Section */
        .hero {
            min-height: 100vh;
            display: flex;
            align-items: center;
            text-align: center;
            margin-top: 80px;
            padding: 4rem 0;
        }
        
        .hero h1 {
            font-size: 3.5rem;
            margin-bottom: 1rem;
            color: #333;
        }
        
        /* Acordeão Vertical - 7 itens */
        .accordion-section {
            padding: 4rem 0;
            background: #f8f9fa;
        }
        
        .accordion {
            max-width: 800px;
            margin: 0 auto;
        }
        
        .accordion-item {
            background: white;
            margin-bottom: 1rem;
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 5px 15px rgba(0,0,0,0.1);
        }
        
        .accordion-header {
            padding: 1.5rem;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 1rem;
            transition: background 0.3s;
        }
        
        .accordion-header:hover {
            background: #f8f9fa;
        }
        
        .accordion-icon {
            font-size: 1.5rem;
        }
        
        .accordion-title {
            color: #e74c3c;
            font-weight: bold;
            flex: 1;
        }
        
        .accordion-arrow {
            transition: transform 0.3s;
        }
        
        .accordion-item.active .accordion-arrow {
            transform: rotate(180deg);
        }
        
        .accordion-content {
            max-height: 0;
            overflow: hidden;
            transition: max-height 0.3s ease;
        }
        
        .accordion-item.active .accordion-content {
            max-height: 300px;
        }
        
        .accordion-text {
            padding: 0 1.5rem 1.5rem;
            color: #666;
        }
        
        /* Carrossel Horizontal */
        .carousel-section {
            padding: 4rem 0;
        }
        
        .carousel-container {
            position: relative;
            overflow: hidden;
            border-radius: 15px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
        }
        
        .carousel-track {
            display: flex;
            transition: transform 0.3s ease;
        }
        
        .carousel-item {
            flex: 0 0 100%;
            aspect-ratio: 16/9;
        }
        
        .carousel-item img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
        
        .carousel-nav {
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            background: rgba(0,0,0,0.7);
            color: white;
            border: none;
            padding: 1rem;
            cursor: pointer;
            font-size: 1.2rem;
        }
        
        .carousel-prev {
            left: 10px;
        }
        
        .carousel-next {
            right: 10px;
        }
        
        .carousel-indicators {
            display: flex;
            justify-content: center;
            gap: 0.5rem;
            margin-top: 1rem;
        }
        
        .carousel-dot {
            width: 10px;
            height: 10px;
            border-radius: 50%;
            background: #ccc;
            cursor: pointer;
            transition: background 0.3s;
        }
        
        .carousel-dot.active {
            background: #e74c3c;
        }
        
        /* Rodapé - 3 colunas, fundo cinza claro */
        .footer {
            background: #f8f9fa;
            color: #333;
            padding: 3rem 0;
        }
        
        .footer-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 2rem;
        }
        
        /* Chat Widget - Azul minimalista, canto inferior esquerdo */
        .chat-widget {
            position: fixed;
            bottom: 20px;
            left: 20px;
            z-index: 10000;
        }
        
        .chat-button {
            width: 60px;
            height: 60px;
            background: #3498db;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            color: white;
            font-size: 24px;
            box-shadow: 0 5px 15px rgba(52, 152, 219, 0.3);
        }
        
        /* Animações */
        @keyframes fadeIn {
            to { opacity: 1; }
        }
        
        /* Responsivo */
        @media (max-width: 768px) {
            .nav-content {
                grid-template-columns: 1fr;
                gap: 1rem;
            }
            
            .nav-menu {
                justify-self: center;
            }
            
            .footer-grid {
                grid-template-columns: 1fr;
            }
        }
    </style>`;
  }

  private generateMinimalistaCleanNavigation(businessData: BusinessContent, images: any): string {
    return `<nav class="navbar">
        <div class="container">
            <div class="nav-content">
                <div class="logo">
                    <img src="${images.logo}" alt="Logo" class="logo-image">
                    <span>${businessData.title}</span>
                </div>
                <ul class="nav-menu">
                    <li><a href="#sobre">Sobre</a></li>
                    <li><a href="#servicos">Serviços</a></li>
                    <li><a href="#galeria">Galeria</a></li>
                    <li><a href="#contato">Contato</a></li>
                </ul>
            </div>
        </div>
    </nav>
    <a href="https://wa.me/${businessData.contact.phone?.replace(/\D/g, '')}" class="whatsapp-btn-fixed">WhatsApp</a>`;
  }

  private generateMinimalistaCleanHero(businessData: BusinessContent, images: any): string {
    return `<section class="hero">
        <div class="container">
            <h1>${businessData.title}</h1>
            <p style="font-size: 1.2rem; margin-bottom: 2rem; color: #666;">${businessData.heroText}</p>
            <a href="#contato" style="background: #e74c3c; color: white; padding: 1rem 2rem; text-decoration: none; border-radius: 5px; font-weight: bold; transition: all 0.3s;">${businessData.ctaText}</a>
        </div>
    </section>`;
  }

  private generateMinimalistaCleanAccordion(businessData: BusinessContent, images: any): string {
    const items = businessData.sections.slice(0, 7);
    const icons = ['ℹ️', '🎯', '👥', '⚙️', '📊', '🔑', '💰'];
    
    return `<section class="accordion-section" id="sobre">
        <div class="container">
            <h2 style="text-align: center; font-size: 2.5rem; margin-bottom: 3rem; color: #333;">Informações Detalhadas</h2>
            
            <div class="accordion">
                ${items.map((section, index) => `
                    <div class="accordion-item">
                        <div class="accordion-header" onclick="toggleAccordion(${index})">
                            <div class="accordion-icon">${icons[index]}</div>
                            <h3 class="accordion-title">${section.title}</h3>
                            <div class="accordion-arrow">▼</div>
                        </div>
                        <div class="accordion-content">
                            <div class="accordion-text">${section.content}</div>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    </section>`;
  }

  private generateMinimalistaCleanCarousel(businessData: BusinessContent, images: any): string {
    if (!images.gallery || !Array.isArray(images.gallery)) return '';
    
    return `<section class="carousel-section" id="galeria">
        <div class="container">
            <h2 style="text-align: center; font-size: 2.5rem; margin-bottom: 3rem; color: #333;">Galeria</h2>
            
            <div class="carousel-container">
                <div class="carousel-track" id="carousel-track">
                    ${images.gallery.map((imageUrl: string, index: number) => `
                        <div class="carousel-item">
                            <img src="${imageUrl}" alt="Imagem ${index + 1}">
                        </div>
                    `).join('')}
                </div>
                
                <button class="carousel-nav carousel-prev" onclick="prevSlide()">❮</button>
                <button class="carousel-nav carousel-next" onclick="nextSlide()">❯</button>
            </div>
            
            <div class="carousel-indicators">
                ${images.gallery.map((_: any, index: number) => `
                    <div class="carousel-dot ${index === 0 ? 'active' : ''}" onclick="goToSlide(${index})"></div>
                `).join('')}
            </div>
        </div>
    </section>`;
  }

  private generateMinimalistaCleanFooter(businessData: BusinessContent, images: any): string {
    return `<footer class="footer" id="contato">
        <div class="container">
            <div class="footer-grid">
                <div>
                    <h4>Contatos</h4>
                    <p>${businessData.contact.phone}</p>
                    <p>${businessData.contact.email}</p>
                    <p>${businessData.contact.address}</p>
                </div>
                <div>
                    <h4>Links</h4>
                    <ul style="list-style: none;">
                        <li><a href="#sobre" style="color: #333; text-decoration: none;">Sobre</a></li>
                        <li><a href="#servicos" style="color: #333; text-decoration: none;">Serviços</a></li>
                        <li><a href="#galeria" style="color: #333; text-decoration: none;">Galeria</a></li>
                    </ul>
                </div>
                <div>
                    <h4>Horários</h4>
                    <p>Segunda a Sexta: 8h às 18h</p>
                    <p>Sábado: 8h às 12h</p>
                    <p>Domingo: Fechado</p>
                </div>
            </div>
        </div>
    </footer>`;
  }

  private generateMinimalistaCleanChatWidget(businessData: BusinessContent): string {
    return `<div class="chat-widget">
        <div class="chat-button" onclick="openWhatsApp()">💬</div>
    </div>`;
  }

  private generateMinimalistaCleanJavaScript(businessData: BusinessContent): string {
    return `<script>
        let currentSlide = 0;
        const totalSlides = ${businessData.galleryImages?.length || 0};
        
        function toggleAccordion(index) {
            const items = document.querySelectorAll('.accordion-item');
            const item = items[index];
            
            items.forEach((i, idx) => {
                if (idx !== index) {
                    i.classList.remove('active');
                }
            });
            
            item.classList.toggle('active');
        }
        
        function nextSlide() {
            currentSlide = (currentSlide + 1) % totalSlides;
            updateCarousel();
        }
        
        function prevSlide() {
            currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
            updateCarousel();
        }
        
        function goToSlide(index) {
            currentSlide = index;
            updateCarousel();
        }
        
        function updateCarousel() {
            const track = document.getElementById('carousel-track');
            if (track) {
                track.style.transform = \`translateX(-\${currentSlide * 100}%)\`;
            }
            
            const dots = document.querySelectorAll('.carousel-dot');
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === currentSlide);
            });
        }
        
        function openWhatsApp() {
            window.open('https://wa.me/${businessData.contact.phone?.replace(/\D/g, '')}?text=Olá, gostaria de mais informações!', '_blank');
        }
    </script>`;
  }

  // TEMPLATE 3 - INTERATIVO & DINÂMICO
  private generateInterativoDinamicoTemplate(businessData: BusinessContent, images: any): string {
    return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${businessData.title}</title>
    <meta name="description" content="${businessData.subtitle}">
    ${this.generateInterativoDinamicoCSS(businessData)}
</head>
<body>
    ${this.generateInterativoDinamicoNavigation(businessData, images)}
    ${this.generateInterativoDinamicoHero(businessData, images)}
    ${this.generateInterativoDinamicoTimeline(businessData, images)}
    ${this.generateInterativoDinamicoGallery(businessData, images)}
    ${this.generateInterativoDinamicoFooter(businessData, images)}
    ${this.generateInterativoDinamicoChatWidget(businessData)}
    ${this.generateInterativoDinamicoJavaScript(businessData)}
</body>
</html>`;
  }

  private generateInterativoDinamicoCSS(businessData: BusinessContent): string {
    return `<style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 20px;
        }
        
        /* Logo centralizado no topo */
        .top-logo {
            text-align: center;
            padding: 2rem 0;
            background: linear-gradient(135deg, ${businessData.colors.primary}, ${businessData.colors.secondary});
            color: white;
            opacity: 0;
            animation: fadeIn 1s ease-out forwards;
        }
        
        .logo {
            display: inline-flex;
            align-items: center;
            gap: 1rem;
            font-size: 2rem;
            font-weight: bold;
        }
        
        .logo-image {
            width: 60px;
            height: 60px;
            object-fit: cover;
            border-radius: 50%;
        }
        
        /* Menu sticky - aparece ao rolar */
        .navbar {
            position: fixed;
            top: -80px;
            width: 100%;
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(10px);
            z-index: 1000;
            padding: 1rem 0;
            box-shadow: 0 2px 20px rgba(0,0,0,0.1);
            transition: top 0.3s ease;
        }
        
        .navbar.scrolled {
            top: 0;
        }
        
        .nav-content {
            display: flex;
            justify-content: center;
            align-items: center;
        }
        
        .nav-menu {
            display: flex;
            list-style: none;
            gap: 2rem;
        }
        
        .nav-menu a {
            text-decoration: none;
            color: #333;
            font-weight: 500;
            transition: color 0.3s;
        }
        
        .nav-menu a:hover {
            color: #2980b9;
        }
        
        .whatsapp-btn-corner {
            position: fixed;
            top: 20px;
            right: 20px;
            background: #25D366;
            color: white;
            padding: 15px;
            border-radius: 50%;
            text-decoration: none;
            font-size: 1.2rem;
            z-index: 1001;
            box-shadow: 0 5px 15px rgba(37, 211, 102, 0.3);
        }
        
        /* Hero Section */
        .hero {
            min-height: 100vh;
            display: flex;
            align-items: center;
            background: linear-gradient(135deg, ${businessData.colors.primary}, ${businessData.colors.secondary});
            color: white;
            text-align: center;
        }
        
        .hero h1 {
            font-size: 4rem;
            margin-bottom: 1rem;
        }
        
        /* Timeline Horizontal - 7 pontos conectados */
        .timeline-section {
            padding: 6rem 0;
            background: #f8f9fa;
        }
        
        .timeline-container {
            position: relative;
            max-width: 1000px;
            margin: 0 auto;
        }
        
        .timeline-line {
            position: absolute;
            top: 50%;
            left: 0;
            right: 0;
            height: 3px;
            background: #ddd;
            z-index: 1;
        }
        
        .timeline-progress {
            height: 100%;
            background: #2980b9;
            width: 0%;
            transition: width 2s ease;
        }
        
        .timeline-points {
            display: flex;
            justify-content: space-between;
            position: relative;
            z-index: 2;
        }
        
        .timeline-point {
            display: flex;
            flex-direction: column;
            align-items: center;
            cursor: pointer;
        }
        
        .timeline-dot {
            width: 30px;
            height: 30px;
            border-radius: 50%;
            background: #2980b9;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: bold;
            transition: all 0.3s;
            animation: pulse 2s infinite;
        }
        
        .timeline-point:hover .timeline-dot {
            transform: scale(1.2);
            box-shadow: 0 0 20px rgba(41, 128, 185, 0.5);
        }
        
        .timeline-content {
            background: white;
            padding: 1.5rem;
            border-radius: 10px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
            margin-top: 2rem;
            max-width: 200px;
            text-align: center;
            opacity: 0;
            transform: translateY(20px);
            transition: all 0.3s;
        }
        
        .timeline-point.active .timeline-content {
            opacity: 1;
            transform: translateY(0);
        }
        
        .timeline-navigation {
            display: flex;
            justify-content: center;
            gap: 1rem;
            margin-top: 3rem;
        }
        
        .timeline-nav-btn {
            background: #2980b9;
            color: white;
            border: none;
            padding: 0.5rem 1rem;
            border-radius: 25px;
            cursor: pointer;
            transition: all 0.3s;
        }
        
        .timeline-nav-btn:hover {
            background: #1f5582;
            transform: translateY(-2px);
        }
        
        /* Galeria - Grid assimétrico estilo Pinterest */
        .gallery-section {
            padding: 4rem 0;
        }
        
        .gallery-pinterest {
            column-count: 3;
            column-gap: 1.5rem;
        }
        
        .gallery-item {
            break-inside: avoid;
            margin-bottom: 1.5rem;
            border-radius: 15px;
            overflow: hidden;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
            transition: all 0.3s;
            cursor: pointer;
        }
        
        .gallery-item:hover {
            transform: translateY(-10px);
            box-shadow: 0 20px 40px rgba(0,0,0,0.2);
        }
        
        .gallery-item img {
            width: 100%;
            height: auto;
            display: block;
        }
        
        /* Parallax effect */
        .parallax-bg {
            background-attachment: fixed;
            background-position: center;
            background-size: cover;
        }
        
        /* Rodapé - 2 colunas: Mapa (70%) + Informações (30%) */
        .footer {
            background: #000;
            color: white;
            padding: 0;
        }
        
        .footer-grid {
            display: grid;
            grid-template-columns: 70% 30%;
            min-height: 400px;
        }
        
        .footer-map {
            background: #333;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.2rem;
        }
        
        .footer-info {
            padding: 3rem 2rem;
        }
        
        /* Chat Widget - Roxo com glow */
        .chat-widget {
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 10000;
        }
        
        .chat-button {
            width: 60px;
            height: 60px;
            background: #8e44ad;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            color: white;
            font-size: 24px;
            box-shadow: 0 0 30px rgba(142, 68, 173, 0.5);
            animation: glow 2s infinite;
        }
        
        /* Animações */
        @keyframes fadeIn {
            to { opacity: 1; }
        }
        
        @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.1); }
        }
        
        @keyframes glow {
            0%, 100% { box-shadow: 0 0 30px rgba(142, 68, 173, 0.5); }
            50% { box-shadow: 0 0 50px rgba(142, 68, 173, 0.8); }
        }
        
        /* Responsivo */
        @media (max-width: 768px) {
            .timeline-points {
                flex-direction: column;
                gap: 2rem;
            }
            
            .timeline-line {
                display: none;
            }
            
            .gallery-pinterest {
                column-count: 2;
            }
            
            .footer-grid {
                grid-template-columns: 1fr;
            }
        }
        
        @media (max-width: 480px) {
            .gallery-pinterest {
                column-count: 1;
            }
            
            .hero h1 {
                font-size: 2.5rem;
            }
        }
    </style>`;
  }

  private generateInterativoDinamicoNavigation(businessData: BusinessContent, images: any): string {
    return `<div class="top-logo">
        <div class="logo">
            <img src="${images.logo}" alt="Logo" class="logo-image">
            <span>${businessData.title}</span>
        </div>
    </div>
    
    <nav class="navbar" id="navbar">
        <div class="container">
            <div class="nav-content">
                <ul class="nav-menu">
                    <li><a href="#sobre">Sobre</a></li>
                    <li><a href="#processo">Processo</a></li>
                    <li><a href="#galeria">Galeria</a></li>
                    <li><a href="#contato">Contato</a></li>
                </ul>
            </div>
        </div>
    </nav>
    
    <a href="https://wa.me/${businessData.contact.phone?.replace(/\D/g, '')}" class="whatsapp-btn-corner">📱</a>`;
  }

  private generateInterativoDinamicoHero(businessData: BusinessContent, images: any): string {
    return `<section class="hero">
        <div class="container">
            <h1>${businessData.title}</h1>
            <p style="font-size: 1.3rem; margin-bottom: 2rem;">${businessData.heroText}</p>
            <a href="#processo" style="background: ${businessData.colors.accent}; color: white; padding: 1.2rem 2.5rem; text-decoration: none; border-radius: 50px; font-weight: bold; font-size: 1.1rem; transition: all 0.3s;">${businessData.ctaText}</a>
        </div>
    </section>`;
  }

  private generateInterativoDinamicoTimeline(businessData: BusinessContent, images: any): string {
    const items = businessData.sections.slice(0, 7);
    
    return `<section class="timeline-section" id="processo">
        <div class="container">
            <h2 style="text-align: center; font-size: 3rem; margin-bottom: 4rem; color: #2980b9;">Nosso Processo</h2>
            
            <div class="timeline-container">
                <div class="timeline-line">
                    <div class="timeline-progress" id="timeline-progress"></div>
                </div>
                
                <div class="timeline-points">
                    ${items.map((section, index) => `
                        <div class="timeline-point ${index === 0 ? 'active' : ''}" onclick="activateTimelinePoint(${index})">
                            <div class="timeline-dot">${index + 1}</div>
                            <div class="timeline-content">
                                <h4 style="color: #2980b9; margin-bottom: 0.5rem;">${section.title}</h4>
                                <p style="font-size: 0.9rem; color: #666;">${section.content.substring(0, 100)}...</p>
                            </div>
                        </div>
                    `).join('')}
                </div>
                
                <div class="timeline-navigation">
                    <button class="timeline-nav-btn" onclick="prevTimelinePoint()">◀ Anterior</button>
                    <button class="timeline-nav-btn" onclick="nextTimelinePoint()">Próximo ▶</button>
                </div>
            </div>
        </div>
    </section>`;
  }

  private generateInterativoDinamicoGallery(businessData: BusinessContent, images: any): string {
    if (!images.gallery || !Array.isArray(images.gallery)) return '';
    
    return `<section class="gallery-section parallax-bg" id="galeria" style="background-image: linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url('${images.hero}');">
        <div class="container">
            <h2 style="text-align: center; font-size: 3rem; margin-bottom: 4rem; color: white;">Galeria Criativa</h2>
            
            <div class="gallery-pinterest">
                ${images.gallery.map((imageUrl: string, index: number) => `
                    <div class="gallery-item" onclick="openImageModal('${imageUrl}', 'Obra ${index + 1}')">
                        <img src="${imageUrl}" alt="Obra ${index + 1}" style="height: ${200 + (index % 3) * 100}px; object-fit: cover;">
                    </div>
                `).join('')}
            </div>
        </div>
    </section>`;
  }

  private generateInterativoDinamicoFooter(businessData: BusinessContent, images: any): string {
    return `<footer class="footer" id="contato">
        <div class="footer-grid">
            <div class="footer-map">
                <div style="text-align: center;">
                    <h3 style="margin-bottom: 1rem;">📍 Localização</h3>
                    <p>${businessData.contact.address}</p>
                    <p style="margin-top: 2rem; color: #ccc;">Mapa interativo em breve</p>
                </div>
            </div>
            <div class="footer-info">
                <h3 style="margin-bottom: 2rem; color: white;">${businessData.title}</h3>
                
                <div style="margin-bottom: 2rem;">
                    <h4 style="color: #ccc;">Contato</h4>
                    <p>${businessData.contact.phone}</p>
                    <p>${businessData.contact.email}</p>
                </div>
                
                <div>
                    <h4 style="color: #ccc;">Horário</h4>
                    <p>Segunda a Sexta: 8h às 18h</p>
                    <p>Sábado: 8h às 12h</p>
                </div>
            </div>
        </div>
    </footer>`;
  }

  private generateInterativoDinamicoChatWidget(businessData: BusinessContent): string {
    return `<div class="chat-widget">
        <div class="chat-button" onclick="openWhatsApp()">💬</div>
    </div>`;
  }

  private generateInterativoDinamicoJavaScript(businessData: BusinessContent): string {
    return `<script>
        let currentTimelinePoint = 0;
        const totalTimelinePoints = ${businessData.sections.slice(0, 7).length};
        
        // Navbar scroll effect
        window.addEventListener('scroll', () => {
            const navbar = document.getElementById('navbar');
            if (window.scrollY > 200) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
        
        // Timeline functions
        function activateTimelinePoint(index) {
            const points = document.querySelectorAll('.timeline-point');
            points.forEach((point, i) => {
                point.classList.toggle('active', i === index);
            });
            
            currentTimelinePoint = index;
            updateTimelineProgress();
        }
        
        function nextTimelinePoint() {
            currentTimelinePoint = (currentTimelinePoint + 1) % totalTimelinePoints;
            activateTimelinePoint(currentTimelinePoint);
        }
        
        function prevTimelinePoint() {
            currentTimelinePoint = (currentTimelinePoint - 1 + totalTimelinePoints) % totalTimelinePoints;
            activateTimelinePoint(currentTimelinePoint);
        }
        
        function updateTimelineProgress() {
            const progress = document.getElementById('timeline-progress');
            if (progress) {
                const percentage = (currentTimelinePoint / (totalTimelinePoints - 1)) * 100;
                progress.style.width = percentage + '%';
            }
        }
        
        // Auto-advance timeline
        setInterval(() => {
            nextTimelinePoint();
        }, 5000);
        
        // Initialize timeline progress
        setTimeout(() => {
            updateTimelineProgress();
        }, 1000);
        
        function openImageModal(src, caption) {
            const modal = document.createElement('div');
            modal.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.9); z-index: 10001; display: flex; align-items: center; justify-content: center;';
            
            const img = document.createElement('img');
            img.src = src;
            img.style.cssText = 'max-width: 90%; max-height: 90%; border-radius: 10px; box-shadow: 0 0 50px rgba(255,255,255,0.3);';
            
            modal.appendChild(img);
            modal.onclick = () => document.body.removeChild(modal);
            
            document.body.appendChild(modal);
        }
        
        function openWhatsApp() {
            window.open('https://wa.me/${businessData.contact.phone?.replace(/\D/g, '')}?text=Olá, gostaria de mais informações!', '_blank');
        }
    </script>`;
  }
}

export const htmlAgent = new HtmlAgent();