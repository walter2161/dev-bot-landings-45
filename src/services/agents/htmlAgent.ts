
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
        
        .layout-reverse {
            grid-template-columns: 1fr 1fr;
            direction: rtl;
        }
        
        .layout-reverse > * {
            direction: ltr;
        }
        
        .layout-stacked {
            display: flex;
            flex-direction: column;
            gap: 3rem;
            text-align: center;
        }
        
        .layout-asymmetric-left {
            display: grid;
            grid-template-columns: 2fr 1fr;
            gap: 3rem;
            align-items: center;
        }
        
        .layout-asymmetric-right {
            display: grid;
            grid-template-columns: 1fr 2fr;
            gap: 3rem;
            align-items: center;
        }
        
        .layout-image-bg {
            position: relative;
            padding: 5rem 0;
            background-size: cover;
            background-position: center;
            background-attachment: fixed;
        }
        
        .layout-image-bg::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.6);
            z-index: 1;
        }
        
        .layout-image-bg .container {
            position: relative;
            z-index: 2;
            color: white;
        }
        
        .layout-split {
            display: grid;
            grid-template-columns: 1fr 1fr;
            min-height: 60vh;
            gap: 0;
        }
        
        .layout-split .content-side {
            padding: 4rem;
            display: flex;
            flex-direction: column;
            justify-content: center;
        }
        
        .layout-split .image-side {
            background-size: cover;
            background-position: center;
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
            .two-columns, .layout-reverse, .layout-asymmetric-left, .layout-asymmetric-right {
                grid-template-columns: 1fr !important;
                direction: ltr !important;
            }
            
            .layout-reverse > * {
                direction: ltr;
            }
            
            .layout-stacked {
                gap: 2rem;
            }
            
            .layout-image-bg {
                padding: 3rem 0;
            }
            
            .layout-split {
                grid-template-columns: 1fr !important;
                min-height: auto;
            }
            
            .layout-split .content-side {
                padding: 2rem;
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
    const getPersonalizedMenuItems = (businessData: BusinessContent): string => {
      // Detectar se é produtos ou serviços baseado no contexto
      const isProduct = businessData.sections.some(section => 
        section.content.toLowerCase().includes('produto') || 
        section.content.toLowerCase().includes('loja') ||
        section.content.toLowerCase().includes('venda') ||
        section.content.toLowerCase().includes('comprar')
      );
      
      const servicesOrProducts = isProduct ? 'Produtos' : 'Serviços';
      
      // Menu personalizado baseado nas seções do businessData
      const menuItems = [
        '<li><a href="#hero">Inicial</a></li>',
        '<li><a href="#sobre">Sobre</a></li>',
        `<li><a href="#servicos">${servicesOrProducts}</a></li>`,
        '<li><a href="#galeria">Galeria</a></li>',
        '<li><a href="#oportunidade">Oportunidades</a></li>',
        '<li><a href="#contato">Contatos</a></li>'
      ];
      
      return menuItems.join('');
    };
    
    return `<nav class="navbar">
        <div class="container">
            <div class="nav-content">
                <div class="logo">
                    <img src="${images.logo}" alt="Logo" class="logo-image">
                    <span>${businessData.title}</span>
                </div>
                <ul class="nav-menu" id="navMenu">
                    ${getPersonalizedMenuItems(businessData)}
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
    return `<section id="hero" class="section hero">
        <div class="container">
            <h1>${businessData.sections[0].title}</h1>
            <p>${businessData.heroText}</p>
            <a href="#contato" class="cta-button">${businessData.ctaText}</a>
        </div>
    </section>`;
  }

  private generateFirstSectionWithBackground(businessData: BusinessContent, images: any): string {
    const firstSection = businessData.sections[1];
    if (!firstSection) return '';
    
    return `<section id="sobre" class="section first-section-bg" style="background-image: url('${images.hero}');">
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
    const sections = businessData.sections.slice(2);
    let generatedSections = '';
    
    sections.forEach((section, index) => {
      const imageKey = section.type as keyof typeof images;
      const hash = this.createSimpleHash(section.title + businessData.title + index);
      const layoutType = hash % 25; // 25 tipos diferentes de layout
      
      // Adicionar seção de FAQ com acordeon se for sobre "perguntas" ou similar
      if (section.title.toLowerCase().includes('perguntas') || section.title.toLowerCase().includes('faq') || section.title.toLowerCase().includes('dúvidas')) {
        generatedSections += this.generateFAQSection(section, businessData);
        return;
      }
      
      // Adicionar seção de preços se for sobre "preço" ou similar
      if (section.title.toLowerCase().includes('preço') || section.title.toLowerCase().includes('valor') || section.title.toLowerCase().includes('investimento') || section.title.toLowerCase().includes('plano')) {
        generatedSections += this.generatePricingSection(section, businessData, images[imageKey]);
        return;
      }
      
      switch (layoutType) {
        case 0: // Hero Section com CTA
          generatedSections += `<section id="${section.id}" class="section hero-alternate" style="background: linear-gradient(135deg, ${businessData.colors.primary}, ${businessData.colors.secondary}); color: white; text-align: center; min-height: 80vh;">
              <div class="container">
                  <div class="hero-content" style="max-width: 800px; margin: 0 auto;">
                      <h2 style="font-size: 3rem; margin-bottom: 1.5rem; text-shadow: 2px 2px 4px rgba(0,0,0,0.3);">${section.title}</h2>
                      <p style="font-size: 1.3rem; margin-bottom: 2rem; opacity: 0.9;">${section.content}</p>
                      <a href="#contato" class="cta-button" style="background: ${businessData.colors.accent}; padding: 15px 40px; font-size: 1.1rem;">Saiba Mais</a>
                  </div>
              </div>
          </section>`;
          break;
          
        case 1: // Cards de serviços (3 colunas)
          generatedSections += `<section id="${section.id}" class="section" style="background: #f8f9fa;">
              <div class="container">
                  <h2 class="section-title" style="text-align: center; margin-bottom: 3rem;">${section.title}</h2>
                  <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem;">
                      ${this.generateServiceCards(section.content, images[imageKey], businessData)}
                  </div>
              </div>
          </section>`;
          break;
          
        case 2: // Split background (metade imagem, metade cor)
          generatedSections += `<section id="${section.id}" class="section layout-split" style="min-height: 70vh;">
              <div class="image-side" style="background-image: url('${images[imageKey]}'); background-size: cover; background-position: center;"></div>
              <div class="content-side" style="background: ${businessData.colors.primary}; color: white; display: flex; flex-direction: column; justify-content: center; padding: 4rem;">
                  <h2 style="font-size: 2.5rem; margin-bottom: 1.5rem;">${section.title}</h2>
                  <p style="font-size: 1.1rem; line-height: 1.8;">${section.content}</p>
                  <a href="#contato" class="cta-button" style="background: ${businessData.colors.accent}; margin-top: 2rem; width: fit-content;">Entre em Contato</a>
              </div>
          </section>`;
          break;
          
        case 3: // Testimonials em grid
          generatedSections += `<section id="${section.id}" class="section">
              <div class="container">
                  <h2 class="section-title" style="text-align: center; margin-bottom: 3rem;">${section.title}</h2>
                  <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(350px, 1fr)); gap: 2rem;">
                      ${this.generateTestimonials(section.content, businessData)}
                  </div>
              </div>
          </section>`;
          break;
          
        case 4: // Timeline (linha do tempo)
          generatedSections += `<section id="${section.id}" class="section" style="background: linear-gradient(45deg, #f8f9fa, #e9ecef);">
              <div class="container">
                  <h2 class="section-title" style="text-align: center; margin-bottom: 3rem;">${section.title}</h2>
                  ${this.generateTimeline(section.content, businessData, images[imageKey])}
              </div>
          </section>`;
          break;
          
        case 5: // Contadores animados (estatísticas)
          generatedSections += `<section id="${section.id}" class="section" style="background: ${businessData.colors.primary}; color: white;">
              <div class="container">
                  <h2 style="text-align: center; margin-bottom: 3rem; color: white;">${section.title}</h2>
                  <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 3rem; text-align: center;">
                      ${this.generateCounters(section.content, businessData)}
                  </div>
              </div>
          </section>`;
          break;
          
        case 6: // Grid em mosaico (masonry)
          generatedSections += `<section id="${section.id}" class="section">
              <div class="container">
                  <h2 class="section-title" style="text-align: center; margin-bottom: 3rem;">${section.title}</h2>
                  <div style="columns: 3; column-gap: 2rem; break-inside: avoid;">
                      ${this.generateMasonryContent(section.content, images[imageKey], businessData)}
                  </div>
              </div>
          </section>`;
          break;
          
        case 7: // Parallax com scroll animado
          generatedSections += `<section id="${section.id}" class="section" style="background-image: url('${images[imageKey]}'); background-attachment: fixed; background-size: cover; background-position: center; position: relative; min-height: 80vh;">
              <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.6);"></div>
              <div class="container" style="position: relative; z-index: 2; display: flex; align-items: center; min-height: 80vh;">
                  <div style="max-width: 600px; color: white; text-align: center; margin: 0 auto;">
                      <h2 style="font-size: 3rem; margin-bottom: 1.5rem; text-shadow: 2px 2px 4px rgba(0,0,0,0.5);">${section.title}</h2>
                      <p style="font-size: 1.2rem; text-shadow: 1px 1px 3px rgba(0,0,0,0.5);">${section.content}</p>
                  </div>
              </div>
          </section>`;
          break;
          
        case 8: // CTA dividido (texto à esquerda, botão à direita)
          generatedSections += `<section id="${section.id}" class="section" style="background: linear-gradient(135deg, ${businessData.colors.secondary}, ${businessData.colors.primary}); color: white;">
              <div class="container">
                  <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 3rem; align-items: center;">
                      <div>
                          <h2 style="font-size: 2.5rem; margin-bottom: 1rem; color: white;">${section.title}</h2>
                          <p style="font-size: 1.1rem; opacity: 0.9;">${section.content}</p>
                      </div>
                      <div style="text-align: center;">
                          <a href="#contato" class="cta-button" style="background: ${businessData.colors.accent}; padding: 20px 40px; font-size: 1.2rem; border-radius: 50px;">Começar Agora</a>
                      </div>
                  </div>
              </div>
          </section>`;
          break;
          
        case 9: // Showcase de produto (mockup central)
          generatedSections += `<section id="${section.id}" class="section" style="background: radial-gradient(circle, #f8f9fa, white);">
              <div class="container">
                  <div style="text-align: center;">
                      <h2 class="section-title" style="margin-bottom: 2rem;">${section.title}</h2>
                      <div style="max-width: 600px; margin: 0 auto 3rem;">
                          <img src="${images[imageKey]}" alt="${section.title}" style="width: 100%; height: auto; border-radius: 20px; box-shadow: 0 30px 60px rgba(0,0,0,0.2);">
                      </div>
                      <p style="font-size: 1.1rem; max-width: 700px; margin: 0 auto;">${section.content}</p>
                  </div>
              </div>
          </section>`;
          break;
          
        case 10: // Seção de recursos/benefícios com ícones
          generatedSections += `<section id="${section.id}" class="section" style="background: #f8f9fa;">
              <div class="container">
                  <h2 class="section-title" style="text-align: center; margin-bottom: 3rem;">${section.title}</h2>
                  <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 2rem;">
                      ${this.generateBenefitsWithIcons(section.content, businessData)}
                  </div>
              </div>
          </section>`;
          break;
          
        case 11: // Blog posts recentes (grid/lista)
          generatedSections += `<section id="${section.id}" class="section">
              <div class="container">
                  <h2 class="section-title" style="text-align: center; margin-bottom: 3rem;">${section.title}</h2>
                  <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(350px, 1fr)); gap: 2rem;">
                      ${this.generateBlogCards(section.content, images[imageKey], businessData)}
                  </div>
              </div>
          </section>`;
          break;
          
        case 12: // Logos de clientes/parceiros
          generatedSections += `<section id="${section.id}" class="section" style="background: white; border-top: 1px solid #eee; border-bottom: 1px solid #eee;">
              <div class="container">
                  <h2 style="text-align: center; margin-bottom: 3rem; font-size: 1.8rem; color: #666;">${section.title}</h2>
                  <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 2rem; align-items: center; opacity: 0.7;">
                      ${this.generatePartnerLogos(section.content, businessData)}
                  </div>
              </div>
          </section>`;
          break;
          
        case 13: // Equipe (cards com fotos e cargos)
          generatedSections += `<section id="${section.id}" class="section">
              <div class="container">
                  <h2 class="section-title" style="text-align: center; margin-bottom: 3rem;">${section.title}</h2>
                  <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 2rem;">
                      ${this.generateTeamCards(section.content, images[imageKey], businessData)}
                  </div>
              </div>
          </section>`;
          break;
          
        case 14: // Callout destacado (frase motivacional centralizada)
          generatedSections += `<section id="${section.id}" class="section" style="background: linear-gradient(45deg, ${businessData.colors.primary}, ${businessData.colors.secondary}); color: white; text-align: center; padding: 5rem 0;">
              <div class="container">
                  <div style="max-width: 800px; margin: 0 auto;">
                      <h2 style="font-size: 3rem; margin-bottom: 2rem; font-weight: 300; text-shadow: 2px 2px 4px rgba(0,0,0,0.3);">"${section.title}"</h2>
                      <p style="font-size: 1.3rem; opacity: 0.9; font-style: italic;">${section.content}</p>
                  </div>
              </div>
          </section>`;
          break;
          
        case 15: // Grid de categorias
          generatedSections += `<section id="${section.id}" class="section" style="background: #f8f9fa;">
              <div class="container">
                  <h2 class="section-title" style="text-align: center; margin-bottom: 3rem;">${section.title}</h2>
                  <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1.5rem;">
                      ${this.generateCategoryGrid(section.content, businessData)}
                  </div>
              </div>
          </section>`;
          break;
          
        case 16: // Barra de progresso (skills/competências)
          generatedSections += `<section id="${section.id}" class="section">
              <div class="container">
                  <div class="two-columns">
                      <div>
                          <h2 class="section-title">${section.title}</h2>
                          <p style="margin-bottom: 2rem;">${section.content}</p>
                          ${this.generateSkillBars(businessData)}
                      </div>
                      <div>
                          <img src="${images[imageKey]}" alt="${section.title}" class="feature-image">
                      </div>
                  </div>
              </div>
          </section>`;
          break;
          
        case 17: // Seção com vídeo de fundo autoplay
          generatedSections += `<section id="${section.id}" class="section" style="position: relative; min-height: 80vh; background: #000; overflow: hidden;">
              <div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.6); z-index: 1;"></div>
              <div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; background-image: url('${images[imageKey]}'); background-size: cover; background-position: center; filter: brightness(0.7);"></div>
              <div class="container" style="position: relative; z-index: 2; display: flex; align-items: center; min-height: 80vh;">
                  <div style="max-width: 600px; color: white; text-align: center; margin: 0 auto;">
                      <h2 style="font-size: 3rem; margin-bottom: 1.5rem; text-shadow: 2px 2px 4px rgba(0,0,0,0.8);">${section.title}</h2>
                      <p style="font-size: 1.2rem; margin-bottom: 2rem; text-shadow: 1px 1px 3px rgba(0,0,0,0.8);">${section.content}</p>
                      <a href="#contato" class="cta-button" style="background: ${businessData.colors.accent}; padding: 15px 40px;">Assista Agora</a>
                  </div>
              </div>
          </section>`;
          break;
          
        case 18: // Seção de awards/prêmios conquistados
          generatedSections += `<section id="${section.id}" class="section" style="background: linear-gradient(135deg, #f8f9fa, white);">
              <div class="container">
                  <h2 class="section-title" style="text-align: center; margin-bottom: 3rem;">${section.title}</h2>
                  <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 2rem;">
                      ${this.generateAwards(section.content, businessData)}
                  </div>
              </div>
          </section>`;
          break;
          
        case 19: // Carrossel de imagens/produtos
          generatedSections += `<section id="${section.id}" class="section">
              <div class="container">
                  <h2 class="section-title" style="text-align: center; margin-bottom: 3rem;">${section.title}</h2>
                  <div style="position: relative; overflow: hidden; border-radius: 15px;">
                      <div id="carousel-${index}" style="display: flex; transition: transform 0.5s ease;">
                          ${this.generateCarouselItems(section.content, images[imageKey], businessData)}
                      </div>
                      <button onclick="prevSlide(${index})" style="position: absolute; left: 20px; top: 50%; transform: translateY(-50%); background: rgba(0,0,0,0.5); color: white; border: none; padding: 10px 15px; border-radius: 50%; cursor: pointer; font-size: 18px;">❮</button>
                      <button onclick="nextSlide(${index})" style="position: absolute; right: 20px; top: 50%; transform: translateY(-50%); background: rgba(0,0,0,0.5); color: white; border: none; padding: 10px 15px; border-radius: 50%; cursor: pointer; font-size: 18px;">❯</button>
                  </div>
                  <p style="text-align: center; margin-top: 2rem; font-size: 1.1rem;">${section.content}</p>
              </div>
          </section>`;
          break;
          
        case 20: // Seção de download de app
          generatedSections += `<section id="${section.id}" class="section" style="background: linear-gradient(135deg, ${businessData.colors.primary}, ${businessData.colors.secondary}); color: white;">
              <div class="container">
                  <div class="two-columns">
                      <div>
                          <h2 style="font-size: 2.5rem; margin-bottom: 1.5rem; color: white;">${section.title}</h2>
                          <p style="font-size: 1.1rem; margin-bottom: 2rem; opacity: 0.9;">${section.content}</p>
                          <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
                              <a href="#" style="display: inline-block; background: #000; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold;">📱 App Store</a>
                              <a href="#" style="display: inline-block; background: #01875f; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold;">🤖 Google Play</a>
                          </div>
                      </div>
                      <div>
                          <img src="${images[imageKey]}" alt="${section.title}" style="max-width: 300px; height: auto; margin: 0 auto; display: block;">
                      </div>
                  </div>
              </div>
          </section>`;
          break;
          
        case 21: // Comparativo de planos/tabelas
          generatedSections += `<section id="${section.id}" class="section" style="background: #f8f9fa;">
              <div class="container">
                  <h2 class="section-title" style="text-align: center; margin-bottom: 3rem;">${section.title}</h2>
                  <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 2rem; max-width: 1000px; margin: 0 auto;">
                      ${this.generateComparisonTable(section.content, businessData)}
                  </div>
              </div>
          </section>`;
          break;
          
        case 22: // Mapa interativo + contato
          generatedSections += `<section id="${section.id}" class="section">
              <div class="container">
                  <h2 class="section-title" style="text-align: center; margin-bottom: 3rem;">${section.title}</h2>
                  <div class="two-columns">
                      <div>
                          <div style="background: #e9ecef; height: 400px; border-radius: 15px; display: flex; align-items: center; justify-content: center; color: #666;">
                              <div style="text-align: center;">
                                  <div style="font-size: 3rem; margin-bottom: 1rem;">📍</div>
                                  <p>Mapa Interativo</p>
                                  <p style="font-size: 0.9rem;">${businessData.contact.address || 'Endereço disponível em breve'}</p>
                              </div>
                          </div>
                      </div>
                      <div>
                          <p style="margin-bottom: 2rem;">${section.content}</p>
                          <div style="space-y: 1rem;">
                              <p><strong>📧 Email:</strong> ${businessData.contact.email}</p>
                              <p><strong>📞 Telefone:</strong> ${businessData.contact.phone}</p>
                              ${businessData.contact.address ? `<p><strong>📍 Endereço:</strong> ${businessData.contact.address}</p>` : ''}
                          </div>
                      </div>
                  </div>
              </div>
          </section>`;
          break;
          
        case 23: // Linha de tempo horizontal (roadmap)
          generatedSections += `<section id="${section.id}" class="section" style="background: white;">
              <div class="container">
                  <h2 class="section-title" style="text-align: center; margin-bottom: 3rem;">${section.title}</h2>
                  <div style="overflow-x: auto; padding: 2rem 0;">
                      ${this.generateHorizontalTimeline(section.content, businessData)}
                  </div>
              </div>
          </section>`;
          break;
          
        case 24: // Layout tradicional com ícones no conteúdo
        default:
          generatedSections += `<section id="${section.id}" class="section">
              <div class="container">
                  <div class="two-columns">
                      <div>
                          <h2 class="section-title">✨ ${section.title}</h2>
                          <div style="font-size: 1.1rem; line-height: 1.8;">
                              ${this.addIconsToContent(section.content)}
                          </div>
                      </div>
                      <div>
                          <img src="${images[imageKey]}" alt="${section.title}" class="feature-image">
                      </div>
                  </div>
              </div>
          </section>`;
          break;
      }
    });
    
    return generatedSections;
  }

  private createSimpleHash(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash);
  }

  private generateFAQSection(section: any, businessData: BusinessContent): string {
    const faqItems = [
      { question: "Como funciona?", answer: section.content },
      { question: "Quanto tempo demora?", answer: "O prazo varia de acordo com cada projeto, mas geralmente conseguimos entregar em poucos dias." },
      { question: "Posso fazer alterações?", answer: "Sim! Oferecemos revisões para garantir que tudo fique exatamente como você deseja." },
      { question: "Como entrar em contato?", answer: `Entre em contato conosco pelo telefone ${businessData.contact.phone} ou email ${businessData.contact.email}.` }
    ];

    return `<section id="${section.id}" class="section" style="background: #f8f9fa;">
        <div class="container">
            <h2 class="section-title" style="text-align: center; margin-bottom: 3rem;">${section.title}</h2>
            <div style="max-width: 800px; margin: 0 auto;">
                ${faqItems.map((item, index) => `
                    <div style="margin-bottom: 1rem; border: 1px solid #e9ecef; border-radius: 10px; overflow: hidden; background: white;">
                        <button onclick="toggleFAQ(${index})" style="width: 100%; padding: 1.5rem; text-align: left; background: none; border: none; font-size: 1.1rem; font-weight: bold; cursor: pointer; display: flex; justify-content: space-between; align-items: center;">
                            <span>${item.question}</span>
                            <span id="faq-icon-${index}" style="transition: transform 0.3s;">+</span>
                        </button>
                        <div id="faq-content-${index}" style="display: none; padding: 0 1.5rem 1.5rem; color: #666; line-height: 1.6;">
                            ${item.answer}
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    </section>`;
  }

  private generatePricingSection(section: any, businessData: BusinessContent, image: string): string {
    return `<section id="${section.id}" class="section" style="background: linear-gradient(135deg, #f8f9fa, white);">
        <div class="container">
            <h2 class="section-title" style="text-align: center; margin-bottom: 3rem;">${section.title}</h2>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem; max-width: 1000px; margin: 0 auto;">
                <div style="background: white; padding: 2rem; border-radius: 15px; box-shadow: 0 10px 30px rgba(0,0,0,0.1); text-align: center; border: 2px solid ${businessData.colors.primary};">
                    <h3 style="color: ${businessData.colors.primary}; margin-bottom: 1rem;">💎 Premium</h3>
                    <div style="font-size: 2.5rem; font-weight: bold; color: ${businessData.colors.primary}; margin-bottom: 1rem;">R$ 299</div>
                    <p style="color: #666; margin-bottom: 2rem;">${section.content}</p>
                    <a href="#contato" class="cta-button" style="background: ${businessData.colors.primary};">Escolher</a>
                </div>
                <div style="background: white; padding: 2rem; border-radius: 15px; box-shadow: 0 10px 30px rgba(0,0,0,0.1); text-align: center;">
                    <h3 style="color: #666; margin-bottom: 1rem;">⭐ Básico</h3>
                    <div style="font-size: 2.5rem; font-weight: bold; color: #666; margin-bottom: 1rem;">R$ 99</div>
                    <p style="color: #666; margin-bottom: 2rem;">Plano básico com o essencial</p>
                    <a href="#contato" class="cta-button" style="background: #666;">Escolher</a>
                </div>
            </div>
        </div>
    </section>`;
  }

  private generateServiceCards(content: string, image: string, businessData: BusinessContent): string {
    const services = [
      { icon: "🎯", title: "Estratégia", description: content.substring(0, 100) + "..." },
      { icon: "⚡", title: "Execução", description: "Implementação rápida e eficiente" },
      { icon: "📈", title: "Resultados", description: "Acompanhamento e otimização contínua" }
    ];

    return services.map(service => `
        <div style="background: white; padding: 2rem; border-radius: 15px; box-shadow: 0 10px 30px rgba(0,0,0,0.1); text-align: center; transition: transform 0.3s; cursor: pointer;" onmouseover="this.style.transform='translateY(-5px)'" onmouseout="this.style.transform='translateY(0)'">
            <div style="font-size: 3rem; margin-bottom: 1rem;">${service.icon}</div>
            <h3 style="color: ${businessData.colors.primary}; margin-bottom: 1rem;">${service.title}</h3>
            <p style="color: #666; line-height: 1.6;">${service.description}</p>
        </div>
    `).join('');
  }

  private generateTestimonials(content: string, businessData: BusinessContent): string {
    const testimonials = [
      { name: "Maria Silva", text: content, rating: "⭐⭐⭐⭐⭐" },
      { name: "João Santos", text: "Excelente trabalho, superou minhas expectativas!", rating: "⭐⭐⭐⭐⭐" },
      { name: "Ana Costa", text: "Profissionais competentes e atendimento excepcional.", rating: "⭐⭐⭐⭐⭐" }
    ];

    return testimonials.map(testimonial => `
        <div style="background: white; padding: 2rem; border-radius: 15px; box-shadow: 0 10px 30px rgba(0,0,0,0.1); position: relative;">
            <div style="font-size: 3rem; color: ${businessData.colors.primary}; opacity: 0.3; position: absolute; top: 1rem; left: 1.5rem;">"</div>
            <p style="font-style: italic; margin-bottom: 1.5rem; color: #555; padding-top: 1rem;">${testimonial.text}</p>
            <div>
                <div style="font-weight: bold; color: ${businessData.colors.primary};">${testimonial.name}</div>
                <div style="color: #666; margin-top: 0.5rem;">${testimonial.rating}</div>
            </div>
        </div>
    `).join('');
  }

  private generateTimeline(content: string, businessData: BusinessContent, image: string): string {
    const steps = [
      { step: "1", title: "Consulta", description: "Análise das suas necessidades" },
      { step: "2", title: "Planejamento", description: content.substring(0, 80) + "..." },
      { step: "3", title: "Execução", description: "Desenvolvimento e implementação" },
      { step: "4", title: "Entrega", description: "Resultado final e acompanhamento" }
    ];

    return `
        <div style="position: relative;">
            <div style="position: absolute; left: 50%; top: 0; bottom: 0; width: 2px; background: ${businessData.colors.primary}; transform: translateX(-50%);"></div>
            ${steps.map((step, index) => `
                <div style="display: flex; align-items: center; margin-bottom: 3rem; ${index % 2 === 0 ? 'flex-direction: row' : 'flex-direction: row-reverse'};">
                    <div style="flex: 1; ${index % 2 === 0 ? 'text-align: right; padding-right: 2rem' : 'text-align: left; padding-left: 2rem'};">
                        <div style="background: white; padding: 1.5rem; border-radius: 10px; box-shadow: 0 5px 15px rgba(0,0,0,0.1);">
                            <h4 style="color: ${businessData.colors.primary}; margin-bottom: 0.5rem;">${step.title}</h4>
                            <p style="color: #666; margin: 0;">${step.description}</p>
                        </div>
                    </div>
                    <div style="flex: 0 0 60px; height: 60px; border-radius: 50%; background: ${businessData.colors.primary}; color: white; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; font-weight: bold; position: relative; z-index: 2;">
                        ${step.step}
                    </div>
                    <div style="flex: 1;"></div>
                </div>
            `).join('')}
        </div>
    `;
  }

  private generateCounters(content: string, businessData: BusinessContent): string {
    const counters = [
      { number: "500+", label: "Clientes Satisfeitos", icon: "👥" },
      { number: "3+", label: "Anos de Experiência", icon: "📅" },
      { number: "98%", label: "Taxa de Sucesso", icon: "🎯" },
      { number: "24h", label: "Suporte", icon: "⏰" }
    ];

    return counters.map(counter => `
        <div style="text-align: center;">
            <div style="font-size: 2rem; margin-bottom: 0.5rem;">${counter.icon}</div>
            <div style="font-size: 3rem; font-weight: bold; margin-bottom: 0.5rem;">${counter.number}</div>
            <div style="opacity: 0.9; font-size: 1.1rem;">${counter.label}</div>
        </div>
    `).join('');
  }

  private generateMasonryContent(content: string, image: string, businessData: BusinessContent): string {
    const items = [
      { type: "text", content: content, height: "200px" },
      { type: "image", src: image, height: "300px" },
      { type: "quote", content: "Qualidade e dedicação em cada projeto", height: "150px" },
      { type: "stat", number: "100%", label: "Satisfação", height: "180px" }
    ];

    return items.map(item => {
      switch (item.type) {
        case "image":
          return `<div style="margin-bottom: 2rem; break-inside: avoid;"><img src="${item.src}" style="width: 100%; height: auto; border-radius: 10px;"></div>`;
        case "quote":
          return `<div style="background: ${businessData.colors.primary}; color: white; padding: 1.5rem; border-radius: 10px; margin-bottom: 2rem; break-inside: avoid; text-align: center; font-style: italic;">"${item.content}"</div>`;
        case "stat":
          return `<div style="background: white; padding: 2rem; border-radius: 10px; box-shadow: 0 5px 15px rgba(0,0,0,0.1); margin-bottom: 2rem; break-inside: avoid; text-align: center;"><div style="font-size: 2.5rem; font-weight: bold; color: ${businessData.colors.primary}; margin-bottom: 0.5rem;">${item.number}</div><div>${item.label}</div></div>`;
        default:
          return `<div style="background: white; padding: 1.5rem; border-radius: 10px; box-shadow: 0 5px 15px rgba(0,0,0,0.1); margin-bottom: 2rem; break-inside: avoid;">${item.content}</div>`;
      }
    }).join('');
  }

  private generateBenefitsWithIcons(content: string, businessData: BusinessContent): string {
    const benefits = [
      { icon: "✅", title: "Qualidade Garantida", description: content.substring(0, 80) + "..." },
      { icon: "⚡", title: "Entrega Rápida", description: "Resultados em tempo recorde" },
      { icon: "💰", title: "Melhor Custo-Benefício", description: "Preços justos e transparentes" },
      { icon: "🎯", title: "Foco no Resultado", description: "Estratégias personalizadas" }
    ];

    return benefits.map(benefit => `
        <div style="background: white; padding: 2rem; border-radius: 15px; box-shadow: 0 5px 15px rgba(0,0,0,0.1); text-align: center;">
            <div style="font-size: 3rem; margin-bottom: 1rem;">${benefit.icon}</div>
            <h4 style="color: ${businessData.colors.primary}; margin-bottom: 1rem;">${benefit.title}</h4>
            <p style="color: #666; line-height: 1.6;">${benefit.description}</p>
        </div>
    `).join('');
  }

  private generateBlogCards(content: string, image: string, businessData: BusinessContent): string {
    const posts = [
      { title: "Dicas Importantes", content: content, date: "15 Jan 2024" },
      { title: "Novidades do Setor", content: "Acompanhe as últimas tendências", date: "10 Jan 2024" },
      { title: "Guia Completo", content: "Tudo que você precisa saber", date: "05 Jan 2024" }
    ];

    return posts.map(post => `
        <article style="background: white; border-radius: 15px; overflow: hidden; box-shadow: 0 5px 15px rgba(0,0,0,0.1); transition: transform 0.3s;" onmouseover="this.style.transform='translateY(-5px)'" onmouseout="this.style.transform='translateY(0)'">
            <img src="${image}" style="width: 100%; height: 200px; object-fit: cover;">
            <div style="padding: 1.5rem;">
                <div style="color: ${businessData.colors.primary}; font-size: 0.9rem; margin-bottom: 0.5rem;">${post.date}</div>
                <h3 style="margin-bottom: 1rem; color: #333;">${post.title}</h3>
                <p style="color: #666; line-height: 1.6; margin-bottom: 1rem;">${post.content.substring(0, 100)}...</p>
                <a href="#" style="color: ${businessData.colors.primary}; text-decoration: none; font-weight: bold;">Ler mais →</a>
            </div>
        </article>
    `).join('');
  }

  private generatePartnerLogos(content: string, businessData: BusinessContent): string {
    const partners = ["Partner 1", "Partner 2", "Partner 3", "Partner 4", "Partner 5"];
    
    return partners.map(partner => `
        <div style="background: #f8f9fa; border-radius: 10px; padding: 2rem; display: flex; align-items: center; justify-content: center; min-height: 80px;">
            <span style="font-weight: bold; color: #666;">${partner}</span>
        </div>
    `).join('');
  }

  private generateTeamCards(content: string, image: string, businessData: BusinessContent): string {
    const team = [
      { name: "João Silva", role: "CEO", image: image },
      { name: "Maria Santos", role: "Diretora", image: image },
      { name: "Pedro Costa", role: "Especialista", image: image }
    ];

    return team.map(member => `
        <div style="background: white; border-radius: 15px; overflow: hidden; box-shadow: 0 5px 15px rgba(0,0,0,0.1); text-align: center;">
            <img src="${member.image}" style="width: 100%; height: 250px; object-fit: cover;">
            <div style="padding: 1.5rem;">
                <h4 style="color: ${businessData.colors.primary}; margin-bottom: 0.5rem;">${member.name}</h4>
                <p style="color: #666; margin-bottom: 1rem;">${member.role}</p>
                <p style="color: #888; font-size: 0.9rem;">${content.substring(0, 80)}...</p>
            </div>
        </div>
    `).join('');
  }

  private generateCategoryGrid(content: string, businessData: BusinessContent): string {
    const categories = [
      { name: "Categoria 1", icon: "📂" },
      { name: "Categoria 2", icon: "🎯" },
      { name: "Categoria 3", icon: "⚡" },
      { name: "Categoria 4", icon: "🚀" },
      { name: "Categoria 5", icon: "💎" },
      { name: "Categoria 6", icon: "🌟" }
    ];

    return categories.map(category => `
        <div style="background: white; border-radius: 10px; padding: 1.5rem; text-align: center; box-shadow: 0 3px 10px rgba(0,0,0,0.1); transition: transform 0.3s; cursor: pointer;" onmouseover="this.style.transform='translateY(-3px)'" onmouseout="this.style.transform='translateY(0)'">
            <div style="font-size: 2rem; margin-bottom: 1rem;">${category.icon}</div>
            <h4 style="color: ${businessData.colors.primary};">${category.name}</h4>
        </div>
    `).join('');
  }

  private generateSkillBars(businessData: BusinessContent): string {
    const skills = [
      { name: "Qualidade", percentage: 95 },
      { name: "Rapidez", percentage: 90 },
      { name: "Inovação", percentage: 88 },
      { name: "Atendimento", percentage: 98 }
    ];

    return `<div style="space-y: 1.5rem;">
        ${skills.map(skill => `
            <div style="margin-bottom: 1.5rem;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                    <span style="font-weight: bold; color: #333;">${skill.name}</span>
                    <span style="color: ${businessData.colors.primary}; font-weight: bold;">${skill.percentage}%</span>
                </div>
                <div style="background: #e9ecef; border-radius: 50px; height: 10px; overflow: hidden;">
                    <div style="background: linear-gradient(135deg, ${businessData.colors.primary}, ${businessData.colors.secondary}); height: 100%; width: ${skill.percentage}%; border-radius: 50px; transition: width 2s ease;"></div>
                </div>
            </div>
        `).join('')}
    </div>`;
  }

  private generateAwards(content: string, businessData: BusinessContent): string {
    const awards = [
      { title: "Prêmio Excelência", year: "2024", icon: "🏆" },
      { title: "Melhor Atendimento", year: "2023", icon: "⭐" },
      { title: "Inovação", year: "2023", icon: "🚀" }
    ];

    return awards.map(award => `
        <div style="background: white; padding: 2rem; border-radius: 15px; box-shadow: 0 5px 15px rgba(0,0,0,0.1); text-align: center;">
            <div style="font-size: 3rem; margin-bottom: 1rem;">${award.icon}</div>
            <h4 style="color: ${businessData.colors.primary}; margin-bottom: 0.5rem;">${award.title}</h4>
            <p style="color: #666;">${award.year}</p>
        </div>
    `).join('');
  }

  private generateCarouselItems(content: string, image: string, businessData: BusinessContent): string {
    const items = [image, image, image]; // Poderia usar diferentes imagens
    
    return items.map((item, index) => `
        <div style="min-width: 100%; position: relative;">
            <img src="${item}" style="width: 100%; height: 400px; object-fit: cover;">
            <div style="position: absolute; bottom: 0; left: 0; right: 0; background: linear-gradient(transparent, rgba(0,0,0,0.8)); color: white; padding: 2rem;">
                <h3 style="margin-bottom: 0.5rem;">Item ${index + 1}</h3>
                <p>${content.substring(0, 100)}...</p>
            </div>
        </div>
    `).join('');
  }

  private generateComparisonTable(content: string, businessData: BusinessContent): string {
    const plans = [
      { name: "Básico", price: "R$ 99", features: ["Recurso 1", "Recurso 2", "Suporte email"] },
      { name: "Premium", price: "R$ 199", features: ["Tudo do Básico", "Recurso 3", "Recurso 4", "Suporte 24h"], highlight: true },
      { name: "Enterprise", price: "R$ 399", features: ["Tudo do Premium", "Recurso 5", "Recurso 6", "Consultoria"] }
    ];

    return plans.map(plan => `
        <div style="background: white; border-radius: 15px; padding: 2rem; text-align: center; position: relative; ${plan.highlight ? `border: 2px solid ${businessData.colors.primary}; transform: scale(1.05);` : 'border: 1px solid #e9ecef;'}">
            ${plan.highlight ? `<div style="position: absolute; top: -15px; left: 50%; transform: translateX(-50%); background: ${businessData.colors.primary}; color: white; padding: 0.5rem 1rem; border-radius: 20px; font-size: 0.9rem;">Mais Popular</div>` : ''}
            <h3 style="color: ${businessData.colors.primary}; margin-bottom: 1rem;">${plan.name}</h3>
            <div style="font-size: 2.5rem; font-weight: bold; color: ${businessData.colors.primary}; margin-bottom: 1rem;">${plan.price}</div>
            <ul style="list-style: none; padding: 0; margin-bottom: 2rem;">
                ${plan.features.map(feature => `<li style="padding: 0.5rem 0; border-bottom: 1px solid #f0f0f0;">✓ ${feature}</li>`).join('')}
            </ul>
            <a href="#contato" class="cta-button" style="background: ${plan.highlight ? businessData.colors.primary : '#666'};">Escolher</a>
        </div>
    `).join('');
  }

  private generateHorizontalTimeline(content: string, businessData: BusinessContent): string {
    const milestones = [
      { year: "2020", title: "Início", description: "Fundação da empresa" },
      { year: "2021", title: "Crescimento", description: "Expansão dos serviços" },
      { year: "2022", title: "Reconhecimento", description: "Primeiros prêmios" },
      { year: "2024", title: "Futuro", description: content.substring(0, 50) + "..." }
    ];

    return `
        <div style="display: flex; justify-content: space-between; align-items: center; min-width: 800px; position: relative;">
            <div style="position: absolute; top: 50%; left: 0; right: 0; height: 2px; background: ${businessData.colors.primary}; z-index: 1;"></div>
            ${milestones.map(milestone => `
                <div style="background: white; border-radius: 10px; padding: 1.5rem; box-shadow: 0 5px 15px rgba(0,0,0,0.1); position: relative; z-index: 2; text-align: center; min-width: 150px;">
                    <div style="width: 20px; height: 20px; background: ${businessData.colors.primary}; border-radius: 50%; margin: 0 auto -10px auto; position: relative; z-index: 3;"></div>
                    <div style="font-weight: bold; color: ${businessData.colors.primary}; margin-bottom: 0.5rem;">${milestone.year}</div>
                    <h4 style="margin-bottom: 0.5rem;">${milestone.title}</h4>
                    <p style="font-size: 0.9rem; color: #666;">${milestone.description}</p>
                </div>
            `).join('')}
        </div>
    `;
  }

  private addIconsToContent(content: string): string {
    return content
      .replace(/\b(qualidade|excelência)\b/gi, '✨ $1')
      .replace(/\b(rápido|rápida|rapidez)\b/gi, '⚡ $1')
      .replace(/\b(garantia|garantido)\b/gi, '🛡️ $1')
      .replace(/\b(resultado|sucesso)\b/gi, '🎯 $1')
      .replace(/\b(inovação|inovador)\b/gi, '🚀 $1')
      .replace(/\b(profissional|especialista)\b/gi, '👨‍💼 $1')
      .replace(/\b(atendimento|suporte)\b/gi, '🤝 $1')
      .replace(/\b(tecnologia|digital)\b/gi, '💻 $1');
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
    const isProductBased = businessData.title.toLowerCase().includes('loja') || 
                          businessData.title.toLowerCase().includes('produto') ||
                          businessData.subtitle.toLowerCase().includes('produto') ||
                          businessData.heroText.toLowerCase().includes('produto');
    
    const servicesOrProducts = isProductBased ? 'Produtos' : 'Serviços';
    
    return `<footer id="contato" style="background: #2a2a2a; color: white; padding: 3rem 0;">
        <div class="container">
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 2rem; margin-bottom: 2rem;">
                <!-- Informações da empresa -->
                <div>
                    <h3 style="margin-bottom: 1rem; color: ${businessData.colors.primary};">${businessData.title}</h3>
                    <p style="margin-bottom: 0.5rem;">${businessData.contact.email}</p>
                    <p style="margin-bottom: 0.5rem;">${businessData.contact.phone}</p>
                    ${businessData.contact.address ? `<p style="margin-bottom: 0.5rem;">${businessData.contact.address}</p>` : ''}
                </div>
                
                <!-- Menu de navegação -->
                <div>
                    <h4 style="margin-bottom: 1rem; color: ${businessData.colors.primary};">Navegação</h4>
                    <ul style="list-style: none; padding: 0;">
                        <li style="margin-bottom: 0.5rem;"><a href="#hero" style="color: white; text-decoration: none; transition: color 0.3s;" onmouseover="this.style.color='${businessData.colors.primary}'" onmouseout="this.style.color='white'">Inicial</a></li>
                        <li style="margin-bottom: 0.5rem;"><a href="#sobre" style="color: white; text-decoration: none; transition: color 0.3s;" onmouseover="this.style.color='${businessData.colors.primary}'" onmouseout="this.style.color='white'">Sobre</a></li>
                        <li style="margin-bottom: 0.5rem;"><a href="#servicos" style="color: white; text-decoration: none; transition: color 0.3s;" onmouseover="this.style.color='${businessData.colors.primary}'" onmouseout="this.style.color='white'">${servicesOrProducts}</a></li>
                        <li style="margin-bottom: 0.5rem;"><a href="#galeria" style="color: white; text-decoration: none; transition: color 0.3s;" onmouseover="this.style.color='${businessData.colors.primary}'" onmouseout="this.style.color='white'">Galeria</a></li>
                        <li style="margin-bottom: 0.5rem;"><a href="#oportunidade" style="color: white; text-decoration: none; transition: color 0.3s;" onmouseover="this.style.color='${businessData.colors.primary}'" onmouseout="this.style.color='white'">Oportunidades</a></li>
                    </ul>
                </div>
            </div>
            
            <div style="text-align: center; border-top: 1px solid #444; padding-top: 2rem;">
                <p style="margin: 0; opacity: 0.8;">&copy; 2024 ${businessData.title}. Todos os direitos reservados.</p>
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
    return `<!-- CSS do Chatbot -->
    <style>
        .chatbot-container {
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 1000;
        }
        .chatbot-toggle {
            width: 60px;
            height: 60px;
            border-radius: 50%;
            background: linear-gradient(135deg, ${businessData.colors.primary}, ${businessData.colors.secondary});
            border: none;
            color: white;
            font-size: 24px;
            cursor: pointer;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
            transition: all 0.3s ease;
        }
        .chatbot-toggle:hover {
            transform: scale(1.1);
            box-shadow: 0 6px 25px rgba(0, 0, 0, 0.4);
        }
        .chatbot-window {
            position: absolute;
            bottom: 80px;
            right: 0;
            width: 350px;
            height: 500px;
            background: white;
            border-radius: 20px;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
            display: none;
            flex-direction: column;
            overflow: hidden;
        }
        .chatbot-header {
            background: linear-gradient(135deg, ${businessData.colors.primary}, ${businessData.colors.secondary});
            color: white;
            padding: 20px;
            text-align: center;
            position: relative;
        }
        .chatbot-close {
            position: absolute;
            top: 10px;
            right: 15px;
            background: none;
            border: none;
            color: white;
            font-size: 20px;
            cursor: pointer;
        }
        .chatbot-messages {
            flex: 1;
            padding: 20px;
            overflow-y: auto;
            background: #f8f9fa;
        }
        .message {
            margin-bottom: 15px;
            padding: 12px 16px;
            border-radius: 18px;
            max-width: 80%;
            word-wrap: break-word;
        }
        .message.bot {
            background: #e3f2fd;
            color: #1976d2;
            margin-right: auto;
        }
        .message.user {
            background: ${businessData.colors.primary};
            color: white;
            margin-left: auto;
        }
        .chatbot-input-area {
            padding: 15px;
            border-top: 1px solid #eee;
            background: white;
        }
        .chatbot-input-container {
            display: flex;
            gap: 10px;
        }
        .chatbot-input {
            flex: 1;
            border: 1px solid #ddd;
            border-radius: 20px;
            padding: 10px 15px;
            outline: none;
        }
        .chatbot-send {
            background: ${businessData.colors.primary};
            color: white;
            border: none;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        @media (max-width: 768px) {
            .chatbot-window {
                width: 300px;
                height: 400px;
            }
        }
    </style>

    <!-- HTML do Chatbot -->
    <div class="chatbot-container">
        <button class="chatbot-toggle" onclick="toggleChatbot()">
            🤖
        </button>
        <div class="chatbot-window" id="chatbotWindow">
            <div class="chatbot-header">
                <button class="chatbot-close" onclick="toggleChatbot()">&times;</button>
                <h6 style="margin: 0 0 5px 0;">${businessData.sellerbot.name}</h6>
                <small>Como posso ajudar você?</small>
            </div>
            <div class="chatbot-messages" id="chatbotMessages">
                <div class="message bot">
                    Olá! Sou ${businessData.sellerbot.name} da ${businessData.title}. ${businessData.sellerbot.responses.greeting.replace(/'/g, "\\'")}
                </div>
            </div>
            <div class="chatbot-input-area">
                <div class="chatbot-input-container">
                    <input type="text" class="chatbot-input" id="chatbotInput" placeholder="Digite sua mensagem...">
                    <button class="chatbot-send" onclick="sendMessage()">
                        ▶
                    </button>
                </div>
            </div>
        </div>
    </div>`;
  }

  private generateJavaScript(businessData: BusinessContent): string {
    return `<script>
        let chatOpen = false;
        const businessData = ${JSON.stringify(businessData)};

        function toggleChat() {
            const chatBox = document.getElementById('chatbotWindow');
            chatOpen = !chatOpen;
            chatBox.style.display = chatOpen ? 'flex' : 'none';
            
            if (chatOpen && document.getElementById('chatbotMessages').children.length === 1) {
                // Manter apenas a mensagem inicial
            }
        }

        function toggleChatbot() {
            toggleChat();
        }

        function addMessage(sender, message) {
            const messagesDiv = document.getElementById('chatbotMessages');
            const messageDiv = document.createElement('div');
            messageDiv.className = 'message ' + sender;
            messageDiv.textContent = message;
            messagesDiv.appendChild(messageDiv);
            messagesDiv.scrollTop = messagesDiv.scrollHeight;
        }

        async function sendMessage() {
            const input = document.getElementById('chatbotInput');
            const message = input.value.trim();
            if (!message) return;

            addMessage('user', message);
            input.value = '';

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
                            role: 'user',
                            content: \`Você é \${businessData.sellerbot.name}, assistente específico do negócio: \${businessData.title}.

Personalidade: \${businessData.sellerbot.personality}
Conhecimentos: \${businessData.sellerbot.knowledge.join(", ")}

INFORMAÇÕES DO NEGÓCIO:
- Endereço: \${businessData.contact.address}
- Telefone: \${businessData.contact.phone}
- Email: \${businessData.contact.email}
- WhatsApp: \${businessData.contact.socialMedia?.whatsapp || 'Não informado'}

INSTRUÇÕES CRÍTICAS - RESPONDA DE FORMA DIRETA E OBJETIVA:
- Responda APENAS o que foi perguntado, sem informações extras
- Se perguntarem preço: dê apenas o valor ou faixa de preço
- Se perguntarem horário: dê apenas o horário
- Se perguntarem contato: dê apenas o contato solicitado
- Se perguntarem localização: dê apenas o endereço
- NUNCA adicione ofertas, promoções ou informações não solicitadas
- Máximo 50 palavras por resposta
- Seja direto e preciso, sem enrolação

Mensagem do cliente: "\${message}"\`
                        }],
                        temperature: 0.7,
                        max_tokens: 300
                    })
                });

                const data = await response.json();
                const botMessage = data.choices[0].message.content;
                addMessage('bot', botMessage);
            } catch (error) {
                addMessage('bot', businessData.sellerbot.responses.greeting);
            }
        }

        // Permitir que a tecla Enter envie a mensagem
        document.addEventListener('DOMContentLoaded', function() {
            document.getElementById('chatbotInput').addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    sendMessage();
                }
            });
        });

        // Função para toggle do FAQ
        function toggleFAQ(index) {
            const content = document.getElementById('faq-content-' + index);
            const icon = document.getElementById('faq-icon-' + index);
            
            if (content.style.display === 'none' || content.style.display === '') {
                content.style.display = 'block';
                icon.textContent = '−';
                icon.style.transform = 'rotate(180deg)';
            } else {
                content.style.display = 'none';
                icon.textContent = '+';
                icon.style.transform = 'rotate(0deg)';
            }
        }

        // Carrossel functions
        let currentSlides = {};
        function nextSlide(index) {
            const carousel = document.getElementById('carousel-' + index);
            if (!currentSlides[index]) currentSlides[index] = 0;
            currentSlides[index] = (currentSlides[index] + 1) % 3;
            carousel.style.transform = 'translateX(-' + (currentSlides[index] * 100) + '%)';
        }
        
        function prevSlide(index) {
            const carousel = document.getElementById('carousel-' + index);
            if (!currentSlides[index]) currentSlides[index] = 0;
            currentSlides[index] = (currentSlides[index] - 1 + 3) % 3;
            carousel.style.transform = 'translateX(-' + (currentSlides[index] * 100) + '%)';
        }

        // Função para toggle do menu mobile
        function toggleMenu() {
            const navMenu = document.getElementById('navMenu');
            if (navMenu) {
                navMenu.classList.toggle('active');
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
                    const navMenu = document.getElementById('navMenu');
                    if (navMenu) {
                        navMenu.classList.remove('active');
                    }
                }
            });
        });

        // Função para enviar dados via WhatsApp
        function sendToWhatsApp(tipo, dados) {
            const whatsappNumber = '${businessData.contact?.phone || businessData.contact?.socialMedia?.whatsapp || ''}';
            const cleanNumber = whatsappNumber.replace(/[^0-9]/g, '');
            
            let mensagem = '';
            
            switch(tipo) {
                case 'newsletter':
                    mensagem = \`🔔 *Novo cadastro Newsletter*\\n\\n📧 Email: \${dados.email}\\n\\n💼 Empresa: ${businessData.title}\\n🕒 Data: \${new Date().toLocaleString('pt-BR')}\`;
                    break;
                case 'contato':
                    mensagem = \`📞 *Nova mensagem de contato*\\n\\n👤 Nome: \${dados.nome}\\n📧 Email: \${dados.email}\\n💬 Mensagem: \${dados.mensagem}\\n\\n💼 Empresa: ${businessData.title}\\n🕒 Data: \${new Date().toLocaleString('pt-BR')}\`;
                    break;
                case 'orcamento':
                    mensagem = \`💰 *Solicitação de Orçamento*\\n\\n👤 Nome: \${dados.nome || 'Não informado'}\\n📧 Email: \${dados.email || 'Não informado'}\\n📱 Telefone: \${dados.telefone || 'Não informado'}\\n💬 Detalhes: \${dados.mensagem || dados.plano || 'Interesse em orçamento'}\\n\\n💼 Empresa: ${businessData.title}\\n🕒 Data: \${new Date().toLocaleString('pt-BR')}\`;
                    break;
                case 'cta':
                    mensagem = \`🎯 *Interesse via Landing Page*\\n\\n📍 Origem: \${dados.origem || 'CTA'}\\n\\n💼 Empresa: ${businessData.title}\\n🕒 Data: \${new Date().toLocaleString('pt-BR')}\\n\\nOlá! Tenho interesse em saber mais sobre os serviços.\`;
                    break;
                case 'contato_final':
                    mensagem = \`🚀 *Contato Final - Interesse Confirmado*\\n\\n📍 Origem: \${dados.origem || 'CTA Final'}\\n\\n💼 Empresa: ${businessData.title}\\n🕒 Data: \${new Date().toLocaleString('pt-BR')}\\n\\nOlá! Quero começar agora mesmo!\`;
                    break;
                default:
                    mensagem = \`📝 *Novo contato*\\n\\n\${JSON.stringify(dados, null, 2)}\\n\\n💼 Empresa: ${businessData.title}\\n🕒 Data: \${new Date().toLocaleString('pt-BR')}\`;
            }
            
            if (!cleanNumber) {
                alert('Número do WhatsApp não configurado. Entre em contato pelos outros meios disponíveis.');
                return;
            }
            
            const encodedMessage = encodeURIComponent(mensagem);
            const whatsappUrl = \`https://wa.me/\${cleanNumber}?text=\${encodedMessage}\`;
            
            window.open(whatsappUrl, '_blank');
        }

        // Função para toggle do FAQ
        function toggleFAQ(index) {
            const content = document.getElementById('faq-content-' + index);
            const icon = document.getElementById('faq-icon-' + index);
            
            if (content && icon) {
                if (content.style.display === 'none' || content.style.display === '') {
                    content.style.display = 'block';
                    icon.textContent = '−';
                    icon.style.transform = 'rotate(180deg)';
                } else {
                    content.style.display = 'none';
                    icon.textContent = '+';
                    icon.style.transform = 'rotate(0deg)';
                }
            }
        }
    </script>`;
  }
}

export const htmlAgent = new HtmlAgent();
