
import { BusinessContent } from '../contentGenerator';

export class HtmlAgent {
  async generateHTML(businessData: BusinessContent): Promise<string> {
    const images = await this.generateImageUrls(businessData.images, businessData.customImages);
    
    return this.buildHTMLTemplate(businessData, images);
  }

  private async generateImageUrls(images: any, customImages?: { [key: string]: string }): Promise<any> {
    const baseUrl = 'https://image.pollinations.ai/prompt/';
    const imageParams = '?width=1200&height=800&enhance=true&nologo=true';
    
    const logoPrompt = images.logo || `Logo da empresa ${images.hero || 'negócio profissional'}`;
    
    const imageUrls = {
      logo: customImages?.logo || `${baseUrl}${encodeURIComponent(logoPrompt)}${imageParams}`,
      hero: customImages?.hero || `${baseUrl}${encodeURIComponent(images.hero)}${imageParams}`,
      motivation: customImages?.motivation || `${baseUrl}${encodeURIComponent(images.motivation)}${imageParams}`,
      target: customImages?.target || `${baseUrl}${encodeURIComponent(images.target)}${imageParams}`,
      method: customImages?.method || `${baseUrl}${encodeURIComponent(images.method)}${imageParams}`,
      results: customImages?.results || `${baseUrl}${encodeURIComponent(images.results)}${imageParams}`,
      access: customImages?.access || `${baseUrl}${encodeURIComponent(images.access)}${imageParams}`,
      investment: customImages?.investment || `${baseUrl}${encodeURIComponent(images.investment)}${imageParams}`
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
    ${this.generateContentSections(businessData, images)}
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
        
        @media (max-width: 768px) {
            .two-columns {
                grid-template-columns: 1fr;
            }
            
            .hero h1 {
                font-size: 2.5rem;
            }
        }
    </style>`;
  }

  private generateNavigation(businessData: BusinessContent, images: any): string {
    return `<nav class="navbar">
        <div class="container">
            <div class="nav-content">
                <div class="logo">
                    <img src="${images.logo}" alt="Logo" class="logo-image">
                    <span>${businessData.title}</span>
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

  private generateContentSections(businessData: BusinessContent, images: any): string {
    return businessData.sections.slice(1).map((section, index) => {
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
            messageDiv.style.cssText = \`
                margin-bottom: 10px; padding: 10px; border-radius: 15px; 
                \${sender === 'bot' ? 'background: #f0f0f0;' : 'background: ${businessData.colors.primary}; color: white;'}
            \`;
            messageDiv.textContent = message;
            messagesDiv.appendChild(messageDiv);
            messagesDiv.scrollTop = messagesDiv.scrollHeight;
        }
        
        document.getElementById('chatInput').addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                const message = this.value.trim();
                if (message) {
                    addMessage('user', message);
                    this.value = '';
                    
                    // Simular resposta do bot
                    setTimeout(() => {
                        addMessage('bot', '${businessData.sellerbot.responses.services}');
                    }, 1000);
                }
            }
        });
    </script>`;
  }
}

export const htmlAgent = new HtmlAgent();
