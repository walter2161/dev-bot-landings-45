
import { BusinessContent } from '../contentGenerator';

export class HtmlAgent {
  async generateHTML(businessData: BusinessContent): Promise<string> {
    const images = await this.generateImageUrls(businessData.images, businessData.customImages, businessData);
    
    return this.buildHTMLTemplate(businessData, images);
  }

  private async generateImageUrls(images: any, customImages?: { [key: string]: string }, businessData?: BusinessContent): Promise<any> {
    const baseUrl = 'https://image.pollinations.ai/prompt/';
    const imageParams = '?width=720&height=480&enhance=true&nologo=true';
    
    const logoPrompt = images.logo || `Logo da empresa ${images.hero || 'negócio profissional'}`;
    
    // Priorizar logos personalizados do usuário
    const hasCustomLogo = customImages?.logo && !customImages.logo.includes('pollinations.ai');
    
    const imageUrls = {
      logo: hasCustomLogo ? customImages.logo : `${baseUrl}${encodeURIComponent(logoPrompt)}${imageParams}`,
      hero: customImages?.hero || `${baseUrl}${encodeURIComponent(images.hero)}${imageParams}`,
      motivation: customImages?.motivation || `${baseUrl}${encodeURIComponent(images.motivation)}${imageParams}`,
      target: customImages?.target || `${baseUrl}${encodeURIComponent(images.target)}${imageParams}`,
      method: customImages?.method || `${baseUrl}${encodeURIComponent(images.method)}${imageParams}`,
      results: customImages?.results || `${baseUrl}${encodeURIComponent(images.results)}${imageParams}`,
      access: customImages?.access || `${baseUrl}${encodeURIComponent(images.access)}${imageParams}`,
      investment: customImages?.investment || `${baseUrl}${encodeURIComponent(images.investment)}${imageParams}`,
      gallery: businessData.galleryImages ? businessData.galleryImages.map((prompt: string, i: number) => 
        customImages?.[`gallery_${i}`] || `${baseUrl}${encodeURIComponent(prompt)}${imageParams}`
      ) : []
    };

    return imageUrls;
  }

  private buildHTMLTemplate(businessData: BusinessContent, images: any): string {
    return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${businessData.title}</title>
    <meta name="description" content="${businessData.subtitle}">
    ${this.generateCSS(businessData)}
</head>
<body>
    ${this.generateNavigation(businessData, images)}
    ${this.generateHeroSection(businessData, images)}
    ${this.generateFirstSectionWithBackground(businessData, images)}
    ${this.generateContentSections(businessData, images)}
    ${this.generateGallerySection(businessData, images)}
    ${this.generateFooter(businessData, images)}
    ${this.generateChatWidget(businessData)}
    ${this.generateJavaScript(businessData)}
</body>
</html>`;
  }

  private generateCSS(businessData: BusinessContent): string {
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
        
        .navbar {
            position: fixed;
            top: 0;
            width: 100%;
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(10px);
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
            color: ${businessData.colors.primary};
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
            color: #333;
            font-weight: 500;
            transition: color 0.3s;
        }
        
        .nav-menu a:hover {
            color: ${businessData.colors.primary};
        }
        
        .hamburger {
            display: none;
            flex-direction: column;
            cursor: pointer;
            gap: 4px;
        }
        
        .hamburger span {
            width: 25px;
            height: 3px;
            background: #333;
            transition: 0.3s;
        }
        
        @media (max-width: 768px) {
            .nav-menu {
                position: fixed;
                top: 100%;
                left: 0;
                width: 100%;
                background: white;
                flex-direction: column;
                padding: 2rem;
                box-shadow: 0 2px 20px rgba(0,0,0,0.1);
                transform: translateY(-100%);
                opacity: 0;
                visibility: hidden;
                transition: all 0.3s;
            }
            
            .nav-menu.active {
                transform: translateY(0);
                opacity: 1;
                visibility: visible;
            }
            
            .hamburger {
                display: flex;
            }
        }
        
        .section {
            min-height: 100vh;
            display: flex;
            align-items: center;
            padding: 2rem 0;
        }
        
        .hero {
            position: relative;
            color: white;
            text-align: center;
            background: linear-gradient(135deg, ${businessData.colors.primary}, ${businessData.colors.secondary});
        }
        
        .hero h1 {
            font-size: 3.5rem;
            margin-bottom: 1rem;
        }
        
        .cta-button {
            display: inline-block;
            background: ${businessData.colors.accent};
            color: white;
            padding: 1rem 2rem;
            text-decoration: none;
            border-radius: 50px;
            font-weight: bold;
            transition: all 0.3s;
        }
        
        .cta-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        }
        
        .two-columns {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 4rem;
            align-items: center;
        }
        
        .section-title {
            font-size: 2.5rem;
            margin-bottom: 1.5rem;
            color: ${businessData.colors.primary};
        }
        
        .feature-image {
            width: 100%;
            height: 400px;
            object-fit: cover;
            border-radius: 15px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
        }
        
        .first-section-bg {
            background-size: cover;
            background-position: center;
            background-attachment: fixed;
            position: relative;
        }
        
        .first-section-bg::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.4);
            z-index: 1;
        }
        
        .first-section-bg .container {
            position: relative;
            z-index: 2;
            color: white;
        }
        
        .gallery {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 1.5rem;
            margin-top: 2rem;
        }
        
        .gallery-item {
            aspect-ratio: 4/3;
            border-radius: 15px;
            overflow: hidden;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
            transition: transform 0.3s;
        }
        
        .gallery-item:hover {
            transform: translateY(-5px);
        }
        
        .gallery-item img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }

        @media (max-width: 768px) {
            .two-columns {
                grid-template-columns: 1fr;
            }
            
            .hero h1 {
                font-size: 2.5rem;
            }
            
            .gallery {
                grid-template-columns: repeat(2, 1fr);
            }
        }
        
        @media (max-width: 480px) {
            .gallery {
                grid-template-columns: 1fr;
            }
        }
    </style>`;
  }

  private generateNavigation(businessData: BusinessContent, images: any): string {
    const getMenuLabel = (sectionType: string): string => {
      const menuLabels: { [key: string]: string } = {
        'motivation': 'Sobre',
        'target': 'Para Quem',
        'method': 'Como Funciona',
        'results': 'Resultados',
        'access': 'Acesso',
        'investment': 'Contato'
      };
      return menuLabels[sectionType] || 'Início';
    };

    const menuItems = businessData.sections.map(section => 
      `<li><a href="#${section.id}">${getMenuLabel(section.type)}</a></li>`
    ).join('') + '<li><a href="#galeria">Galeria</a></li>';
    
    return `<nav class="navbar">
        <div class="container">
            <div class="nav-content">
                <div class="logo">
                    <img src="${images.logo}" alt="Logo" class="logo-image">
                    <span>${businessData.title}</span>
                </div>
                <ul class="nav-menu" id="navMenu">
                    ${menuItems}
                </ul>
                <div class="hamburger" id="hamburger" onclick="toggleMenu()">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        </div>
    </nav>`;
  }

  private generateHeroSection(businessData: BusinessContent, images: any): string {
    return `<section class="section hero">
        <div class="container">
            <h1>${businessData.sections[0].title}</h1>
            <p>${businessData.heroText}</p>
            <a href="#investment" class="cta-button">${businessData.ctaText}</a>
        </div>
    </section>`;
  }

  private generateFirstSectionWithBackground(businessData: BusinessContent, images: any): string {
    const firstSection = businessData.sections[1];
    if (!firstSection) return '';
    
    return `<section id="${firstSection.id}" class="section first-section-bg" style="background-image: url('${images.hero}');">
        <div class="container">
            <div class="two-columns">
                <div>
                    <h2 class="section-title">${firstSection.title}</h2>
                    <p>${firstSection.content}</p>
                </div>
                <div></div>
            </div>
        </div>
    </section>`;
  }

  private generateContentSections(businessData: BusinessContent, images: any): string {
    return businessData.sections.slice(2).map((section, index) => {
      const isReverse = index % 2 === 1;
      const imageKey = section.type as keyof typeof images;
      
      return `<section id="${section.id}" class="section">
          <div class="container">
              <div class="two-columns ${isReverse ? 'reverse' : ''}">
                  <div>
                      <h2 class="section-title">${section.title}</h2>
                      <p>${section.content}</p>
                  </div>
                  <div>
                      <img src="${images[imageKey]}" alt="${section.title}" class="feature-image">
                  </div>
              </div>
          </div>
      </section>`;
    }).join('');
  }

  private generateGallerySection(businessData: BusinessContent, images: any): string {
    if (!images.gallery || !Array.isArray(images.gallery)) return '';
    
    return `<section id="galeria" class="section">
        <div class="container">
            <h2 class="section-title" style="text-align: center; margin-bottom: 3rem;">Galeria</h2>
            <div class="gallery">
                ${images.gallery.map((imageUrl: string, index: number) => `
                    <div class="gallery-item">
                        <img src="${imageUrl}" alt="Galeria ${index + 1}" loading="lazy" onclick="openImageModal('${imageUrl}', 'Galeria ${index + 1}')" style="cursor: pointer;">
                    </div>
                `).join('')}
            </div>
        </div>
        
        <!-- Modal para visualizar imagens -->
        <div id="imageModal" style="
            display: none; position: fixed; z-index: 10001; 
            left: 0; top: 0; width: 100%; height: 100%; 
            background-color: rgba(0,0,0,0.9);
        " onclick="closeImageModal()">
            <div style="
                position: absolute; top: 50%; left: 50%; 
                transform: translate(-50%, -50%); 
                max-width: 90%; max-height: 90%;
            ">
                <img id="modalImage" src="" alt="" style="
                    width: 100%; height: auto; 
                    border-radius: 10px;
                ">
                <p id="modalCaption" style="
                    color: white; text-align: center; 
                    margin-top: 15px; font-size: 18px;
                "></p>
            </div>
            <span style="
                position: absolute; top: 20px; right: 30px; 
                color: #f1f1f1; font-size: 40px; 
                font-weight: bold; cursor: pointer;
            " onclick="closeImageModal()">&times;</span>
        </div>
    </section>`;
  }

  private generateFooter(businessData: BusinessContent, images: any): string {
    return `<footer style="background: #2a2a2a; color: white; padding: 3rem 0;">
        <div class="container">
            <div style="text-align: center;">
                <h3>${businessData.title}</h3>
                <p>${businessData.contact.email}</p>
                <p>${businessData.contact.phone}</p>
                <p>${businessData.contact.address}</p>
            </div>
        </div>
    </footer>
    
    <!-- PageJet Signature Footer -->
    <footer style="background: #000000; color: white; padding: 1rem 0; border-top: 2px solid #ff6600;">
        <div class="container">
            <div style="text-align: center; display: flex; align-items: center; justify-content: center; gap: 0.5rem;">
                <span style="font-size: 0.9rem;">Criado por:</span>
                <a href="https://pagejet.app" target="_blank" style="text-decoration: none; display: flex; align-items: center;">
                    <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 320 80'%3E%3Crect width='320' height='80' fill='%23000'/%3E%3Ctext x='160' y='45' text-anchor='middle' fill='%23ff6600' font-family='Arial, sans-serif' font-size='24' font-weight='bold'%3EPageJet%3C/text%3E%3C/svg%3E" alt="PageJet" style="height: 30px; object-fit: contain;">
                </a>
            </div>
        </div>
    </footer>`;
  }

  private generateChatWidget(businessData: BusinessContent): string {
    return `<!-- Chat Widget Sellerbot com IA -->
    <div id="chatWidget" style="position: fixed; bottom: 20px; right: 20px; z-index: 10000; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
        <!-- Botão do Chat -->
        <div id="chatButton" onclick="toggleChat()" style="
            width: 65px; height: 65px; 
            background: linear-gradient(135deg, ${businessData.colors.primary}, ${businessData.colors.secondary}); 
            border-radius: 50%; 
            display: flex; align-items: center; justify-content: center; 
            cursor: pointer; color: white; font-size: 28px;
            box-shadow: 0 6px 25px rgba(0,0,0,0.25);
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            border: 3px solid rgba(255,255,255,0.2);
            position: relative;
            overflow: hidden;
        ">
            <span style="position: relative; z-index: 2;">🤖</span>
            <div style="
                position: absolute; top: -2px; right: -2px;
                width: 18px; height: 18px;
                background: #00ff88;
                border-radius: 50%;
                border: 2px solid white;
                animation: pulse 2s infinite;
            "></div>
        </div>
        
        <!-- Caixa do Chat -->
        <div id="chatBox" class="chatBox">
            <!-- Header do Chat -->
            <div style="
                background: linear-gradient(135deg, ${businessData.colors.primary}, ${businessData.colors.secondary}); 
                color: white; padding: 20px; 
                position: relative;
                overflow: hidden;
                display: flex;
                justify-content: space-between;
                align-items: center;
            ">
                <div style="position: relative; z-index: 2;">
                    <div style="font-weight: bold; font-size: 18px; margin-bottom: 5px;">
                        🤖 ${businessData.sellerbot.name}
                    </div>
                    <div style="font-size: 12px; opacity: 0.9;">
                        Assistente IA • Online agora
                    </div>
                </div>
                <span id="chatClose" style="
                    position: absolute; top: 15px; right: 15px;
                    cursor: pointer; font-size: 24px; 
                    width: 30px; height: 30px;
                    display: flex; align-items: center; justify-content: center;
                    border-radius: 50%; 
                    transition: background 0.2s ease;
                    z-index: 3;
                " onmouseover="this.style.background='rgba(255,255,255,0.2)'" onmouseout="this.style.background='transparent'">×</span>
            </div>
            
            <!-- Área de Mensagens -->
            <div id="chatMessages" style="
                flex: 1; padding: 20px; overflow-y: auto; 
                background: #f8f9fa;
                min-height: 350px;
                scroll-behavior: smooth;
            "></div>
            
            <!-- Indicador de Digitação -->
            <div id="typingIndicator" style="
                display: none; padding: 10px 20px;
                background: #f8f9fa;
                border-top: 1px solid #eee;
            ">
                <div style="
                    display: flex; align-items: center;
                    color: #666; font-size: 14px;
                ">
                    <div style="
                        display: flex; gap: 3px; margin-right: 8px;
                    ">
                        <div style="width: 8px; height: 8px; background: #666; border-radius: 50%; animation: typing 1.5s infinite;"></div>
                        <div style="width: 8px; height: 8px; background: #666; border-radius: 50%; animation: typing 1.5s infinite 0.2s;"></div>
                        <div style="width: 8px; height: 8px; background: #666; border-radius: 50%; animation: typing 1.5s infinite 0.4s;"></div>
                    </div>
                    ${businessData.sellerbot.name} está digitando...
                </div>
            </div>
            
            <!-- Área de Input -->
            <div style="
                padding: 20px; 
                background: white;
                border-top: 1px solid #eee;
            ">
                <div style="
                    display: flex; gap: 10px;
                    align-items: center;
                ">
                    <input type="text" id="chatInput" placeholder="Digite sua mensagem..." 
                           style="
                               flex: 1; padding: 12px 16px; 
                               border: 2px solid #e0e0e0; 
                               border-radius: 25px; outline: none;
                               font-size: 14px;
                               transition: border-color 0.2s ease;
                           ">
                    <button id="sendButton" style="
                        width: 45px; height: 45px;
                        background: ${businessData.colors.primary};
                        border: none; border-radius: 50%;
                        color: white; cursor: pointer;
                        display: flex; align-items: center; justify-content: center;
                        transition: all 0.2s ease;
                        font-size: 18px;
                    ">▶</button>
                </div>
            </div>
        </div>
    </div>

    <style>
        @keyframes pulse {
            0% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.2); opacity: 0.8; }
            100% { transform: scale(1); opacity: 1; }
        }
        
        @keyframes typing {
            0%, 60%, 100% { transform: translateY(0); }
            30% { transform: translateY(-10px); }
        }
        
        .chatBox {
            width: 380px; 
            height: 520px; 
            background: white; 
            border-radius: 20px; 
            display: none; 
            flex-direction: column; 
            position: absolute; 
            bottom: 80px; 
            right: 0;
            box-shadow: 0 15px 50px rgba(0,0,0,0.25);
            border: 1px solid rgba(0,0,0,0.1);
            overflow: hidden;
        }
        
        #chatInput:focus {
            border-color: ${businessData.colors.primary} !important;
        }
        
        #sendButton:hover {
            transform: scale(1.1);
            background: ${businessData.colors.secondary} !important;
        }
        
        #chatButton:hover {
            transform: scale(1.1);
            box-shadow: 0 8px 30px rgba(0,0,0,0.3);
        }
        
        @media (max-width: 480px) {
            .chatBox {
                width: 320px !important;
                right: -10px !important;
            }
        }
    </style>`;
  }

  private generateJavaScript(businessData: BusinessContent): string {
    return `<script>
        // Estado global do chat
        let chatOpen = false;
        let chatHistory = [];
        let isWaitingResponse = false;
        
        // Função para toggle do menu mobile
        function toggleMenu() {
            const navMenu = document.getElementById('navMenu');
            if (navMenu) {
                navMenu.classList.toggle('active');
            }
        }
        
        // Função para abrir/fechar chat
        function toggleChat() {
            try {
                const chatBox = document.getElementById('chatBox');
                const chatButton = document.getElementById('chatButton');
                
                if (!chatBox || !chatButton) {
                    console.error('Elementos do chat não encontrados');
                    return;
                }
                
                chatOpen = !chatOpen;
                console.log('Chat toggle:', chatOpen);
                console.log('ChatBox element:', chatBox);
                
                if (chatOpen) {
                    chatBox.style.display = 'flex';
                    console.log('Mostrando chat box');
                } else {
                    chatBox.style.display = 'none';
                    console.log('Escondendo chat box');
                }
                
                // Primeira mensagem de boas-vindas
                if (chatOpen && chatHistory.length === 0) {
                    addMessage('bot', '${businessData.sellerbot.responses.greeting.replace(/'/g, "\\'")}', false);
                }
                
                // Focar no input quando abrir
                if (chatOpen) {
                    setTimeout(() => {
                        const chatInput = document.getElementById('chatInput');
                        if (chatInput) chatInput.focus();
                    }, 100);
                }
            } catch (error) {
                console.error('Erro ao abrir chat:', error);
            }
        }
        
        // Função para fechar chat
        function closeChat() {
            try {
                const chatBox = document.getElementById('chatBox');
                if (chatBox) {
                    chatOpen = false;
                    chatBox.style.display = 'none';
                }
            } catch (error) {
                console.error('Erro ao fechar chat:', error);
            }
        }
        
        // Função para adicionar mensagem ao chat
        function addMessage(sender, message, saveToHistory = true) {
            try {
                const messagesDiv = document.getElementById('chatMessages');
                if (!messagesDiv) return null;
                
                const messageDiv = document.createElement('div');
                const messageId = 'msg_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
                messageDiv.id = messageId;
                
                const isBot = sender === 'bot';
                const timestamp = new Date().toLocaleTimeString('pt-BR', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                });
                
                messageDiv.style.cssText = \`
                    margin-bottom: 15px; 
                    display: flex; 
                    \${isBot ? 'justify-content: flex-start;' : 'justify-content: flex-end;'}
                \`;
                
                messageDiv.innerHTML = \`
                    <div style="
                        max-width: 80%; 
                        padding: 12px 16px; 
                        border-radius: 18px; 
                        \${isBot 
                            ? 'background: white; color: #333; border: 1px solid #e0e0e0; border-bottom-left-radius: 6px;' 
                            : 'background: ${businessData.colors.primary}; color: white; border-bottom-right-radius: 6px;'
                        }
                        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                        position: relative;
                        word-wrap: break-word;
                        line-height: 1.4;
                    ">
                        <div style="font-size: 14px; white-space: pre-wrap;">\${message}</div>
                        <div style="
                            font-size: 11px; 
                            opacity: 0.7; 
                            margin-top: 4px;
                            text-align: right;
                        ">\${timestamp}</div>
                    </div>
                \`;
                
                messagesDiv.appendChild(messageDiv);
                messagesDiv.scrollTop = messagesDiv.scrollHeight;
                
                // Salvar no histórico
                if (saveToHistory) {
                    chatHistory.push({
                        id: messageId,
                        sender: sender,
                        message: message,
                        timestamp: new Date()
                    });
                    
                    // Limitar histórico a 50 mensagens
                    if (chatHistory.length > 50) {
                        chatHistory = chatHistory.slice(-50);
                    }
                }
                
                return messageId;
            } catch (error) {
                console.error('Erro ao adicionar mensagem:', error);
                return null;
            }
        }
        
        // Função para remover mensagem
        function removeMessage(messageId) {
            try {
                const messageElement = document.getElementById(messageId);
                if (messageElement) {
                    messageElement.remove();
                }
                
                // Remover do histórico também
                chatHistory = chatHistory.filter(msg => msg.id !== messageId);
            } catch (error) {
                console.error('Erro ao remover mensagem:', error);
            }
        }
        
        // Função para mostrar indicador de digitação
        function showTypingIndicator() {
            const indicator = document.getElementById('typingIndicator');
            if (indicator) {
                indicator.style.display = 'block';
            }
        }
        
        // Função para esconder indicador de digitação
        function hideTypingIndicator() {
            const indicator = document.getElementById('typingIndicator');
            if (indicator) {
                indicator.style.display = 'none';
            }
        }
        
        // Função para enviar mensagem
        function sendMessage() {
            try {
                const chatInput = document.getElementById('chatInput');
                if (!chatInput || isWaitingResponse) return;
                
                const message = chatInput.value.trim();
                if (!message) return;
                
                // Adicionar mensagem do usuário
                addMessage('user', message);
                chatInput.value = '';
                
                // Gerar resposta IA
                generateAIResponse(message);
            } catch (error) {
                console.error('Erro ao enviar mensagem:', error);
            }
        }
        
        // Aguardar DOM carregar completamente
        document.addEventListener('DOMContentLoaded', function() {
            try {
                // Event listener para o botão do chat
                const chatButton = document.getElementById('chatButton');
                if (chatButton) {
                    chatButton.addEventListener('click', toggleChat);
                }
                
                // Event listener para fechar o chat
                const chatClose = document.getElementById('chatClose');
                if (chatClose) {
                    chatClose.addEventListener('click', closeChat);
                }
                
                // Event listener para o input do chat (Enter)
                const chatInput = document.getElementById('chatInput');
                if (chatInput) {
                    chatInput.addEventListener('keypress', function(e) {
                        if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            sendMessage();
                        }
                    });
                    
                    // Estilo focus/blur
                    chatInput.addEventListener('focus', function() {
                        this.style.borderColor = '${businessData.colors.primary}';
                    });
                    
                    chatInput.addEventListener('blur', function() {
                        this.style.borderColor = '#e0e0e0';
                    });
                }
                
                // Event listener para o botão de enviar
                const sendButton = document.getElementById('sendButton');
                if (sendButton) {
                    sendButton.addEventListener('click', sendMessage);
                }
                
                console.log('💬 Chat Sellerbot IA inicializado com sucesso!');
            } catch (error) {
                console.error('Erro ao inicializar chat:', error);
            }
        });
        
        // Função para gerar resposta IA
        async function generateAIResponse(userMessage) {
            if (isWaitingResponse) return;
            
            try {
                isWaitingResponse = true;
                showTypingIndicator();
                
                // Simular delay de digitação mais realista
                await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
                
                let aiResponse = '';
                
                // Tentar comunicar com o app principal via postMessage (quando no preview)
                if (window.parent !== window) {
                    try {
                        window.parent.postMessage({
                            type: 'SELLERBOT_CHAT',
                            message: userMessage,
                            chatHistory: chatHistory.slice(-6), // Enviar histórico recente
                            businessData: {
                                sellerbot: ${JSON.stringify(businessData.sellerbot)},
                                title: '${businessData.title}',
                                subtitle: '${businessData.subtitle}',
                                heroText: '${businessData.heroText}',
                                contact: ${JSON.stringify(businessData.contact)},
                                colors: ${JSON.stringify(businessData.colors)}
                            }
                        }, '*');
                        
                        // Aguardar resposta com timeout
                        aiResponse = await new Promise((resolve) => {
                            const handler = (event) => {
                                if (event.data.type === 'SELLERBOT_RESPONSE') {
                                    window.removeEventListener('message', handler);
                                    resolve(event.data.response);
                                }
                            };
                            window.addEventListener('message', handler);
                            
                            // Timeout de 15s
                            setTimeout(() => {
                                window.removeEventListener('message', handler);
                                resolve('');
                            }, 15000);
                        });
                    } catch (error) {
                        console.warn('Erro na comunicação postMessage:', error);
                        aiResponse = '';
                    }
                }
                
                // Fallback: usar resposta inteligente local
                if (!aiResponse) {
                    aiResponse = getSmartResponse(userMessage);
                }
                
                hideTypingIndicator();
                addMessage('bot', aiResponse);
                
            } catch (error) {
                console.error('Erro ao gerar resposta IA:', error);
                hideTypingIndicator();
                addMessage('bot', getSmartResponse(userMessage));
            } finally {
                isWaitingResponse = false;
            }
        }
        
        // Função para respostas inteligentes locais (fallback)
        function getSmartResponse(message) {
            const lowerMessage = message.toLowerCase();
            
            // Saudações
            if (lowerMessage.includes('olá') || lowerMessage.includes('oi') || lowerMessage.includes('bom dia') || lowerMessage.includes('boa tarde') || lowerMessage.includes('boa noite')) {
                return \`👋 ${businessData.sellerbot.responses.greeting}\n\nComo posso ajudar você hoje?\`;
            }
            
            // Preços e valores
            if (lowerMessage.includes('preço') || lowerMessage.includes('valor') || lowerMessage.includes('custo') || lowerMessage.includes('quanto')) {
                return \`💰 ${businessData.sellerbot.responses.pricing}\n\nPara informações mais detalhadas sobre valores, entre em contato: ${businessData.contact.phone}\`;
            }
            
            // Serviços e produtos
            if (lowerMessage.includes('serviço') || lowerMessage.includes('produto') || lowerMessage.includes('trabalho') || lowerMessage.includes('oferece')) {
                return \`🛍️ ${businessData.sellerbot.responses.services}\n\n${businessData.heroText}\n\nQue tal agendar uma conversa para saber mais?\`;
            }
            
            // Agendamentos
            if (lowerMessage.includes('agendar') || lowerMessage.includes('marcar') || lowerMessage.includes('horário') || lowerMessage.includes('consulta')) {
                const contactInfo = businessData.contact.whatsapp ? '📱 ' + businessData.contact.whatsapp : '📞 ' + businessData.contact.phone;
                return \`📅 ${businessData.sellerbot.responses.appointment}\n\nContato direto: \` + contactInfo;
            }
            
            // Contatos
            if (lowerMessage.includes('contato') || lowerMessage.includes('telefone') || lowerMessage.includes('whats') || lowerMessage.includes('falar')) {
                const whatsappInfo = businessData.contact.whatsapp ? '\n💬 WhatsApp: ' + businessData.contact.whatsapp : '';
                return \`📞 Entre em contato conosco através dos seguintes canais:\n\n📧 Email: ${businessData.contact.email}\n📱 Telefone: ${businessData.contact.phone}\n📍 Endereço: ${businessData.contact.address}\` + whatsappInfo + \`\n\nEstamos sempre prontos para atender você!\`;
            }
            
            // Localização
            if (lowerMessage.includes('localização') || lowerMessage.includes('endereço') || lowerMessage.includes('onde') || lowerMessage.includes('local')) {
                const locationContact = businessData.contact.whatsapp ? '📱 WhatsApp: ' + businessData.contact.whatsapp : '📞 Telefone: ' + businessData.contact.phone;
                return \`📍 Estamos localizados em:\n${businessData.contact.address}\n\n\` + locationContact + \`\n\nVenha nos visitar!\`;
            }
            
            // Ajuda e informações gerais
            if (lowerMessage.includes('ajuda') || lowerMessage.includes('ajudar') || lowerMessage.includes('informação') || lowerMessage.includes('dúvida')) {
                return \`🤝 Claro! Estou aqui para ajudar com informações sobre ${businessData.title}.\n\nPosso ajudar você com:\n🛍️ Nossos serviços\n💰 Preços e condições\n📅 Agendamentos\n📞 Contatos\n📍 Localização\n\nO que gostaria de saber?\`;
            }
            
            // Despedidas
            if (lowerMessage.includes('tchau') || lowerMessage.includes('obrigado') || lowerMessage.includes('obrigada') || lowerMessage.includes('valeu')) {
                const farewellContact = businessData.contact.whatsapp ? '📱 WhatsApp: ' + businessData.contact.whatsapp : '📞 Telefone: ' + businessData.contact.phone;
                return \`😊 Foi um prazer ajudar você!\n\nSe precisar de mais alguma coisa, estarei sempre aqui. Até logo!\n\n\` + farewellContact;
            }
            
            // Resposta padrão inteligente
            const defaultResponses = [
                \`👋 Olá! Sou o ${businessData.sellerbot.name} da ${businessData.title}.\n\nComo posso ajudar você hoje? Posso falar sobre nossos serviços, preços, agendar horários ou tirar qualquer dúvida!\`,
                \`😊 Oi! Que bom ter você aqui!\n\nSou especialista em ${businessData.title} e posso ajudar com informações, agendamentos e muito mais. O que gostaria de saber?\`,
                \`🤖 Olá! Sou seu assistente virtual da ${businessData.title}.\n\nEstou aqui para ajudar com tudo que você precisar. Pode me perguntar sobre serviços, preços, horários... enfim, qualquer coisa!\`
            ];
            
            return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
        }
        
        // Modal de imagens
        function openImageModal(imageSrc, caption) {
            const modal = document.getElementById('imageModal');
            const modalImg = document.getElementById('modalImage');
            const modalCaption = document.getElementById('modalCaption');
            
            modal.style.display = 'block';
            modalImg.src = imageSrc;
            modalCaption.textContent = caption;
        }
        
        function closeImageModal() {
            document.getElementById('imageModal').style.display = 'none';
        }
        
        // Fechar modal com ESC
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                closeImageModal();
            }
        });
        
        // Smooth scroll para navegação
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                    // Fechar menu mobile após clique
                    document.getElementById('navMenu').classList.remove('active');
                }
            });
        });
    </script>`;
  }
}

export const htmlAgent = new HtmlAgent();
