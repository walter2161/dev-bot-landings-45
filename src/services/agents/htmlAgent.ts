
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
    return `<div id="chatWidget" style="position: fixed; bottom: 20px; right: 20px; z-index: 10000;">
        <div id="chatButton" onclick="toggleChat()" style="
            width: 60px; height: 60px; 
            background: ${businessData.colors.primary}; 
            border-radius: 50%; 
            display: flex; align-items: center; justify-content: center; 
            cursor: pointer; color: white; font-size: 24px;
        ">💬</div>
        
        <div id="chatBox" style="
            width: 350px; height: 500px; 
            background: white; border-radius: 15px; 
            display: none; flex-direction: column; 
            position: absolute; bottom: 70px; right: 0;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        ">
            <div style="background: ${businessData.colors.primary}; color: white; padding: 15px; border-radius: 15px 15px 0 0;">
                ${businessData.sellerbot.name}
            </div>
            <div id="chatMessages" style="flex: 1; padding: 15px; overflow-y: auto;"></div>
            <div style="padding: 15px; border-top: 1px solid #eee;">
                <input type="text" id="chatInput" placeholder="Digite sua mensagem..." 
                       style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 20px;">
            </div>
        </div>
    </div>`;
  }

  private generateJavaScript(businessData: BusinessContent): string {
    return `<script>
        let chatOpen = false;
        
        function toggleMenu() {
            const navMenu = document.getElementById('navMenu');
            navMenu.classList.toggle('active');
        }
        
        function toggleChat() {
            const chatBox = document.getElementById('chatBox');
            chatOpen = !chatOpen;
            chatBox.style.display = chatOpen ? 'flex' : 'none';
            
            if (chatOpen && document.getElementById('chatMessages').children.length === 0) {
                addMessage('bot', '${businessData.sellerbot.responses.greeting}');
            }
        }
        
        function addMessage(sender, message) {
            const messagesDiv = document.getElementById('chatMessages');
            const messageDiv = document.createElement('div');
            const messageId = 'msg_' + Date.now();
            messageDiv.id = messageId;
            messageDiv.style.cssText = \`
                margin-bottom: 10px; padding: 10px; border-radius: 15px; 
                \${sender === 'bot' ? 'background: #f0f0f0;' : 'background: ${businessData.colors.primary}; color: white;'}
            \`;
            messageDiv.textContent = message;
            messagesDiv.appendChild(messageDiv);
            messagesDiv.scrollTop = messagesDiv.scrollHeight;
            return messageId;
        }
        
        function removeMessage(messageId) {
            const messageElement = document.getElementById(messageId);
            if (messageElement) {
                messageElement.remove();
            }
        }
        
        document.getElementById('chatInput').addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                const message = this.value.trim();
                if (message) {
                    addMessage('user', message);
                    this.value = '';
                    
                    // Gerar resposta IA real
                    generateAIResponse(message);
                }
            }
        });
        
        async function generateAIResponse(userMessage) {
            const loadingMessage = 'Digitando...';
            const loadingId = addMessage('bot', loadingMessage);
            
            try {
                const response = await fetch('https://api.mistral.ai/v1/chat/completions', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer aynCSftAcQBOlxmtmpJqVzco8K4aaTDQ'
                    },
                    body: JSON.stringify({
                        model: 'mistral-large-latest',
                        messages: [{
                            role: 'system',
                            content: \`Você é ${businessData.sellerbot.name}.
Personalidade: ${businessData.sellerbot.personality}
Conhecimento: ${businessData.sellerbot.knowledge.join(', ')}
Empresa: ${businessData.title}
Produtos/Serviços: ${businessData.subtitle}
Contato: ${businessData.contact.email}, ${businessData.contact.phone}

Responda de forma amigável, profissional e ajude com informações sobre a empresa.\`
                        }, {
                            role: 'user',
                            content: userMessage
                        }],
                        temperature: 0.7,
                        max_tokens: 500
                    })
                });
                
                if (response.ok) {
                    const data = await response.json();
                    const aiResponse = data.choices[0].message.content;
                    removeMessage(loadingId);
                    addMessage('bot', aiResponse);
                } else {
                    throw new Error('Erro na API');
                }
            } catch (error) {
                removeMessage(loadingId);
                const fallbackResponses = [
                    '${businessData.sellerbot.responses.services}',
                    '${businessData.sellerbot.responses.pricing}',
                    '${businessData.sellerbot.responses.appointment}'
                ];
                const randomResponse = fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
                addMessage('bot', randomResponse);
            }
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
