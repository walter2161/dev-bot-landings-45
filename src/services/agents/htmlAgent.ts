import { BusinessContent } from '../contentGenerator';

const PICSUM_BASE_URL = "https://picsum.photos";

export class HtmlAgent {
  async generateLandingPage(businessData: BusinessContent): Promise<string> {
    const images = this.generateImageUrls(businessData);
    return this.buildHTMLTemplate(businessData, images);
  }

  // Método para compatibilidade com código antigo
  async generateHTML(businessData: BusinessContent): Promise<string> {
    return this.generateLandingPage(businessData);
  }

  private generateImageUrls(businessData: BusinessContent): any {
    const baseUrl = `${PICSUM_BASE_URL}/800/600?random=`;
    const imageParams = `&blur=0&grayscale=0`;
    
    const customImages = businessData.customImages || {};
    
    const imageUrls = {
      logo: customImages.logo || `${baseUrl}logo${imageParams}`,
      hero: customImages.hero || `${baseUrl}hero${imageParams}`,
      motivation: customImages.motivation || `${baseUrl}motivation${imageParams}`,
      target: customImages.target || `${baseUrl}target${imageParams}`,
      method: customImages.method || `${baseUrl}method${imageParams}`,
      results: customImages.results || `${baseUrl}results${imageParams}`,
      access: customImages.access || `${baseUrl}access${imageParams}`,
      investment: customImages.investment || `${baseUrl}investment${imageParams}`,
      gallery: Array.from({ length: 6 }, (_, i) => 
        customImages?.[`gallery_${i}`] || `${baseUrl}gallery${i}${imageParams}`
      )
    };

    return imageUrls;
  }

  private buildHTMLTemplate(businessData: BusinessContent, images: any): string {
    // Detectar tipo de LP do prompt
    const prompt = businessData.heroText || '';
    const landingPageType = this.detectLandingPageType(prompt);
    
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
    ${this.generateDynamicLandingPage(landingPageType, businessData, images)}
    ${this.generateJavaScript(businessData)}
</body>
</html>`;
  }

  private detectLandingPageType(prompt: string): 'simples' | 'avancada' | 'completa' {
    if (prompt.includes('SIMPLES') || prompt.includes('simples')) return 'simples';
    if (prompt.includes('AVANÇADA') || prompt.includes('avancada')) return 'avancada'; 
    if (prompt.includes('COMPLETA') || prompt.includes('completa')) return 'completa';
    return 'avancada'; // default
  }

  private generateDynamicLandingPage(type: 'simples' | 'avancada' | 'completa', businessData: BusinessContent, images: any): string {
    const businessType = this.extractBusinessType(businessData.heroText || '');
    const sections = [];
    
    // Cabeçalho sempre presente
    sections.push(this.generateNavigation(businessData, images));
    
    switch(type) {
      case 'simples':
        sections.push(...this.generateSimpleLandingPage(businessData, images, businessType));
        break;
      case 'avancada':
        sections.push(...this.generateAdvancedLandingPage(businessData, images, businessType));
        break;
      case 'completa':
        sections.push(...this.generateCompleteLandingPage(businessData, images, businessType));
        break;
    }
    
    // Footer e Chat sempre presentes
    sections.push(this.generateFooter(businessData, images));
    sections.push(this.generateChatWidget(businessData));
    
    return sections.join('\n');
  }

  private extractBusinessType(prompt: string): string {
    const typeMatch = prompt.match(/Tipo de Negócio:\s*([^\n]+)/i);
    return typeMatch ? typeMatch[1].trim().toLowerCase() : 'geral';
  }

  private generateSimpleLandingPage(businessData: BusinessContent, images: any, businessType: string): string[] {
    const sections = [];
    
    // 1. Hero Section minimalista
    sections.push(`
      <section class="hero-simple" style="background: linear-gradient(135deg, ${businessData.colors.primary}, ${businessData.colors.secondary}); color: white; text-align: center; padding: 120px 0;">
        <div style="max-width: 1200px; margin: 0 auto; padding: 0 20px;">
          <h1 style="font-size: 3rem; margin-bottom: 1rem; font-weight: bold;">${businessData.title}</h1>
          <p style="font-size: 1.3rem; margin-bottom: 2rem; opacity: 0.9;">${businessData.heroText}</p>
          <a href="javascript:sendToWhatsApp('cta', {origem: 'Hero Principal'})" class="cta-button" style="background: ${businessData.colors.accent}; padding: 20px 40px; color: white; text-decoration: none; border-radius: 8px; font-size: 1.1rem; display: inline-block; transition: all 0.3s;">
            ${businessData.ctaText}
          </a>
        </div>
      </section>
    `);
    
    // 2. Benefícios rápidos
    sections.push(`
      <section style="padding: 80px 0; background: #f8f9fa;">
        <div style="max-width: 1200px; margin: 0 auto; padding: 0 20px;">
          <h2 style="text-align: center; font-size: 2.5rem; margin-bottom: 3rem; color: #333;">Por que escolher ${businessData.title}?</h2>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem;">
            ${this.generateBenefitCards(businessData, businessType)}
          </div>
        </div>
      </section>
    `);
    
    // 3. Depoimento rápido
    sections.push(this.generateTestimonialSection(businessData));
    
    // 4. Sobre produto/serviço
    sections.push(this.generateAboutSection(businessData, images, businessType));
    
    // 5. Pricing simples
    sections.push(this.generateSimplePricingSection(businessData));
    
    // 6. FAQ básico
    sections.push(this.generateFAQSection(businessData));
    
    // 7. CTA final
    sections.push(this.generateFinalCTASection(businessData));
    
    return sections;
  }

  private generateAdvancedLandingPage(businessData: BusinessContent, images: any, businessType: string): string[] {
    const sections = [];
    
    // Hero mais elaborado
    sections.push(this.generateAdvancedHero(businessData, images));
    
    // Problema x Solução
    sections.push(this.generateProblemSolutionSection(businessData, images, businessType));
    
    // Múltiplas seções variadas
    const layouts = this.getBusinessLayouts(businessType);
    for (let i = 0; i < 15; i++) {
      sections.push(this.generateVariedSection(layouts[i % layouts.length], businessData, images, i));
    }
    
    return sections;
  }

  private generateCompleteLandingPage(businessData: BusinessContent, images: any, businessType: string): string[] {
    const sections = [];
    
    // Header sticky
    sections.push(this.generateStickyHeader(businessData, images));
    
    // Hero impactante
    sections.push(this.generateImpactfulHero(businessData, images));
    
    // Todas as seções possíveis
    const allLayouts = this.getAllLayouts(businessType);
    for (let i = 0; i < 25; i++) {
      sections.push(this.generateVariedSection(allLayouts[i % allLayouts.length], businessData, images, i));
    }
    
    return sections;
  }

  private getBusinessLayouts(businessType: string): string[] {
    const baseLayouts = ['hero-banner', 'cards-grid', 'split-content', 'testimonials', 'pricing-table', 'timeline', 'gallery', 'stats', 'team', 'contact-form'];
    
    if (businessType.includes('consultoria') || businessType.includes('coach')) {
      return [...baseLayouts, 'expertise', 'case-studies', 'authority', 'transformation'];
    }
    if (businessType.includes('ecommerce') || businessType.includes('loja')) {
      return [...baseLayouts, 'products-showcase', 'categories', 'reviews', 'shipping-info'];
    }
    if (businessType.includes('saude') || businessType.includes('clinica')) {
      return [...baseLayouts, 'specialists', 'treatments', 'before-after', 'appointments'];
    }
    
    return baseLayouts;
  }

  private getAllLayouts(businessType: string): string[] {
    return [
      'hero-banner', 'cards-grid', 'split-content', 'testimonials', 'pricing-table', 
      'timeline', 'gallery', 'stats', 'team', 'contact-form', 'parallax', 'carousel',
      'comparison', 'features', 'awards', 'newsletter', 'blog-posts', 'social-proof',
      'video-section', 'interactive-map', 'download-section', 'webinar-cta',
      'partners-logos', 'masonry-grid', 'progress-bars'
    ];
  }

  private generateVariedSection(layout: string, businessData: BusinessContent, images: any, index: number): string {
    switch(layout) {
      case 'cards-grid':
        return `
          <section style="padding: 80px 0; background: ${index % 2 === 0 ? '#fff' : '#f8f9fa'};">
            <div style="max-width: 1200px; margin: 0 auto; padding: 0 20px;">
              <h2 style="text-align: center; font-size: 2.5rem; margin-bottom: 3rem;">Nossos Serviços</h2>
              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem;">
                ${this.generateServiceCards(businessData)}
              </div>
            </div>
          </section>
        `;
      
      case 'split-content':
        return `
          <section style="min-height: 70vh; display: flex;">
            <div style="flex: 1; background-image: url('${images.hero}'); background-size: cover; background-position: center;"></div>
            <div style="flex: 1; background: ${businessData.colors.primary}; color: white; display: flex; flex-direction: column; justify-content: center; padding: 4rem;">
              <h2 style="font-size: 2.5rem; margin-bottom: 1.5rem;">Transforme sua vida</h2>
              <p style="font-size: 1.1rem; line-height: 1.8; margin-bottom: 2rem;">Com ${businessData.title}, você terá acesso aos melhores resultados do mercado.</p>
              <a href="javascript:sendToWhatsApp('cta', {origem: 'Seção Split'})" style="background: ${businessData.colors.accent}; padding: 15px 30px; color: white; text-decoration: none; border-radius: 8px; width: fit-content;">
                Quero começar agora
              </a>
            </div>
          </section>
        `;
        
      case 'testimonials':
        return this.generateTestimonialCarousel(businessData);
        
      case 'pricing-table':
        return this.generatePricingTable(businessData);
        
      case 'stats':
        return this.generateStatsSection(businessData);
        
      default:
        return this.generateDefaultSection(businessData, images, index);
    }
  }

  private generateBenefitCards(businessData: BusinessContent, businessType: string): string {
    const benefits = this.getBenefitsForBusinessType(businessType, businessData.title);
    return benefits.map(benefit => `
      <div style="background: white; padding: 2rem; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.1); text-align: center;">
        <div style="font-size: 3rem; margin-bottom: 1rem;">${benefit.icon}</div>
        <h3 style="font-size: 1.3rem; margin-bottom: 1rem; color: ${businessData.colors.primary};">${benefit.title}</h3>
        <p style="color: #666; line-height: 1.6;">${benefit.description}</p>
      </div>
    `).join('');
  }

  private getBenefitsForBusinessType(businessType: string, businessName: string): any[] {
    if (businessType.includes('consultoria') || businessType.includes('coach')) {
      return [
        { icon: '🎯', title: 'Resultados Garantidos', description: `Com ${businessName}, você alcança seus objetivos de forma eficiente` },
        { icon: '⚡', title: 'Método Exclusivo', description: 'Técnicas comprovadas e personalizadas para seu sucesso' },
        { icon: '🏆', title: 'Experiência Comprovada', description: 'Anos de experiência transformando vidas e negócios' }
      ];
    }
    
    return [
      { icon: '✨', title: 'Qualidade Superior', description: `${businessName} oferece a melhor qualidade do mercado` },
      { icon: '🚀', title: 'Rapidez', description: 'Resultados rápidos e eficientes para suas necessidades' },
      { icon: '💰', title: 'Melhor Custo-Benefício', description: 'Preços justos com máxima qualidade' }
    ];
  }

  private generateTestimonialSection(businessData: BusinessContent): string {
    return `
      <section style="padding: 80px 0; background: linear-gradient(45deg, ${businessData.colors.primary}20, ${businessData.colors.secondary}20);">
        <div style="max-width: 1200px; margin: 0 auto; padding: 0 20px; text-align: center;">
          <h2 style="font-size: 2.5rem; margin-bottom: 3rem; color: #333;">O que nossos clientes dizem</h2>
          <div style="background: white; padding: 3rem; border-radius: 20px; box-shadow: 0 10px 40px rgba(0,0,0,0.1); max-width: 800px; margin: 0 auto;">
            <div style="font-size: 4rem; color: ${businessData.colors.primary}; margin-bottom: 1rem;">"</div>
            <p style="font-size: 1.2rem; line-height: 1.8; color: #555; margin-bottom: 2rem; font-style: italic;">
              "${businessData.title} transformou completamente minha experiência. Recomendo para todos que buscam excelência e qualidade."
            </p>
            <div style="display: flex; align-items: center; justify-content: center; gap: 1rem;">
              <div style="width: 60px; height: 60px; background: ${businessData.colors.primary}; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-size: 1.5rem; font-weight: bold;">
                M
              </div>
              <div>
                <div style="font-weight: bold; color: #333;">Maria Silva</div>
                <div style="color: #666; font-size: 0.9rem;">Cliente satisfeita</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    `;
  }

  private generateAboutSection(businessData: BusinessContent, images: any, businessType: string): string {
    return `
      <section style="padding: 80px 0;">
        <div style="max-width: 1200px; margin: 0 auto; padding: 0 20px;">
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 4rem; align-items: center;">
            <div>
              <h2 style="font-size: 2.5rem; margin-bottom: 2rem; color: ${businessData.colors.primary};">Sobre ${businessData.title}</h2>
              <p style="font-size: 1.1rem; line-height: 1.8; color: #555; margin-bottom: 2rem;">
                ${businessData.subtitle}
              </p>
              <p style="font-size: 1rem; line-height: 1.7; color: #666;">
                Com anos de experiência no mercado, nos especializamos em oferecer soluções de alta qualidade para nossos clientes.
              </p>
            </div>
            <div>
              <img src="${images.hero}" alt="Sobre ${businessData.title}" style="width: 100%; border-radius: 12px; box-shadow: 0 10px 30px rgba(0,0,0,0.2);">
            </div>
          </div>
        </div>
      </section>
    `;
  }

  private generateSimplePricingSection(businessData: BusinessContent): string {
    return `
      <section style="padding: 80px 0; background: #f8f9fa;">
        <div style="max-width: 1200px; margin: 0 auto; padding: 0 20px; text-align: center;">
          <h2 style="font-size: 2.5rem; margin-bottom: 3rem; color: #333;">Investimento</h2>
          <div style="background: white; padding: 3rem; border-radius: 20px; box-shadow: 0 10px 40px rgba(0,0,0,0.1); max-width: 500px; margin: 0 auto;">
            <div style="font-size: 3rem; color: ${businessData.colors.primary}; font-weight: bold; margin-bottom: 1rem;">
              Consulte
            </div>
            <p style="color: #666; margin-bottom: 2rem; font-size: 1.1rem;">
              Valores personalizados para suas necessidades
            </p>
            <a href="javascript:sendToWhatsApp('orcamento', {origem: 'Pricing Simples'})" style="background: ${businessData.colors.primary}; color: white; padding: 20px 40px; text-decoration: none; border-radius: 8px; display: inline-block; font-size: 1.1rem;">
              Solicitar Orçamento
            </a>
          </div>
        </div>
      </section>
    `;
  }

  private generateFAQSection(businessData: BusinessContent): string {
    const faqs = [
      { question: `Como funciona o ${businessData.title}?`, answer: 'Oferecemos um serviço personalizado e de alta qualidade, adaptado às suas necessidades específicas.' },
      { question: 'Qual o prazo de entrega?', answer: 'O prazo varia conforme o projeto, mas sempre priorizamos a qualidade e pontualidade.' },
      { question: 'Vocês oferecem garantia?', answer: 'Sim, oferecemos garantia em todos os nossos serviços para sua total tranquilidade.' }
    ];

    return `
      <section style="padding: 80px 0;">
        <div style="max-width: 800px; margin: 0 auto; padding: 0 20px;">
          <h2 style="text-align: center; font-size: 2.5rem; margin-bottom: 3rem; color: #333;">Perguntas Frequentes</h2>
          <div style="space-y: 1rem;">
            ${faqs.map((faq, index) => `
              <div style="background: white; border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden; margin-bottom: 1rem;">
                <button onclick="toggleFAQ(${index})" style="width: 100%; padding: 1.5rem; text-align: left; background: none; border: none; font-size: 1.1rem; font-weight: 500; cursor: pointer; display: flex; justify-content: space-between; align-items: center;">
                  ${faq.question}
                  <span id="faq-icon-${index}" style="font-size: 1.5rem; transition: transform 0.3s;">+</span>
                </button>
                <div id="faq-content-${index}" style="display: none; padding: 0 1.5rem 1.5rem; color: #666; line-height: 1.6;">
                  ${faq.answer}
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </section>
    `;
  }

  private generateFinalCTASection(businessData: BusinessContent): string {
    return `
      <section style="padding: 100px 0; background: linear-gradient(135deg, ${businessData.colors.primary}, ${businessData.colors.secondary}); color: white; text-align: center;">
        <div style="max-width: 800px; margin: 0 auto; padding: 0 20px;">
          <h2 style="font-size: 3rem; margin-bottom: 1.5rem; font-weight: bold;">Pronto para começar?</h2>
          <p style="font-size: 1.3rem; margin-bottom: 3rem; opacity: 0.9;">
            Entre em contato conosco agora e descubra como ${businessData.title} pode transformar seus resultados.
          </p>
          <a href="javascript:sendToWhatsApp('contato_final', {origem: 'CTA Final'})" style="background: ${businessData.colors.accent}; color: white; padding: 25px 50px; text-decoration: none; border-radius: 50px; font-size: 1.2rem; font-weight: bold; display: inline-block; transition: all 0.3s; box-shadow: 0 10px 30px rgba(0,0,0,0.3);">
            🚀 COMEÇAR AGORA
          </a>
        </div>
      </section>
    `;
  }

  // Continuar com métodos auxiliares...
  private generateAdvancedHero(businessData: BusinessContent, images: any): string {
    return `
      <section style="min-height: 100vh; background: linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url('${images.hero}'); background-size: cover; background-position: center; display: flex; align-items: center; color: white;">
        <div style="max-width: 1200px; margin: 0 auto; padding: 0 20px; width: 100%;">
          <div style="max-width: 600px;">
            <h1 style="font-size: 4rem; margin-bottom: 1.5rem; font-weight: bold; text-shadow: 2px 2px 4px rgba(0,0,0,0.8);">${businessData.title}</h1>
            <p style="font-size: 1.4rem; margin-bottom: 3rem; line-height: 1.6; text-shadow: 1px 1px 2px rgba(0,0,0,0.8);">${businessData.heroText}</p>
            <a href="javascript:sendToWhatsApp('cta', {origem: 'Hero Avançado'})" style="background: ${businessData.colors.accent}; padding: 20px 40px; color: white; text-decoration: none; border-radius: 8px; font-size: 1.2rem; display: inline-block; transition: all 0.3s;">
              ${businessData.ctaText}
            </a>
          </div>
        </div>
      </section>
    `;
  }

  private generateProblemSolutionSection(businessData: BusinessContent, images: any, businessType: string): string {
    return `
      <section style="padding: 100px 0;">
        <div style="max-width: 1200px; margin: 0 auto; padding: 0 20px;">
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 6rem; align-items: center;">
            <div>
              <h2 style="font-size: 2.5rem; margin-bottom: 2rem; color: #dc2626;">❌ O Problema</h2>
              <p style="font-size: 1.1rem; line-height: 1.8; color: #555;">
                Muitas pessoas enfrentam dificuldades para encontrar soluções de qualidade no mercado atual.
              </p>
            </div>
            <div>
              <h2 style="font-size: 2.5rem; margin-bottom: 2rem; color: ${businessData.colors.primary};">✅ A Solução</h2>
              <p style="font-size: 1.1rem; line-height: 1.8; color: #555;">
                Com ${businessData.title}, você tem acesso à excelência e qualidade que merece.
              </p>
            </div>
          </div>
        </div>
      </section>
    `;
  }

  private generateServiceCards(businessData: BusinessContent): string {
    const services = [
      { title: 'Qualidade Premium', description: 'Serviços de alta qualidade com foco na excelência' },
      { title: 'Atendimento Personalizado', description: 'Suporte dedicado para suas necessidades específicas' },
      { title: 'Resultados Garantidos', description: 'Compromisso com sua satisfação e sucesso' }
    ];

    return services.map(service => `
      <div style="background: white; padding: 2rem; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.1); text-align: center; border-top: 4px solid ${businessData.colors.primary};">
        <h3 style="font-size: 1.3rem; margin-bottom: 1rem; color: ${businessData.colors.primary};">${service.title}</h3>
        <p style="color: #666; line-height: 1.6;">${service.description}</p>
      </div>
    `).join('');
  }

  private generateTestimonialCarousel(businessData: BusinessContent): string {
    return `
      <section style="padding: 80px 0; background: #f8f9fa;">
        <div style="max-width: 1200px; margin: 0 auto; padding: 0 20px; text-align: center;">
          <h2 style="font-size: 2.5rem; margin-bottom: 3rem; color: #333;">Depoimentos</h2>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem;">
            ${this.generateMultipleTestimonials(businessData)}
          </div>
        </div>
      </section>
    `;
  }

  private generateMultipleTestimonials(businessData: BusinessContent): string {
    const testimonials = [
      { name: 'Ana Costa', role: 'Empresária', text: `${businessData.title} superou todas as minhas expectativas. Recomendo!` },
      { name: 'João Santos', role: 'Consultor', text: 'Profissionalismo e qualidade em todos os detalhes.' },
      { name: 'Carla Lima', role: 'Gerente', text: 'Atendimento excepcional e resultados incríveis.' }
    ];

    return testimonials.map(testimonial => `
      <div style="background: white; padding: 2rem; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
        <p style="font-style: italic; margin-bottom: 1.5rem; color: #555; line-height: 1.6;">"${testimonial.text}"</p>
        <div style="display: flex; align-items: center; gap: 1rem;">
          <div style="width: 50px; height: 50px; background: ${businessData.colors.primary}; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold;">
            ${testimonial.name.charAt(0)}
          </div>
          <div>
            <div style="font-weight: bold; color: #333;">${testimonial.name}</div>
            <div style="color: #666; font-size: 0.9rem;">${testimonial.role}</div>
          </div>
        </div>
      </div>
    `).join('');
  }

  private generatePricingTable(businessData: BusinessContent): string {
    return `
      <section style="padding: 80px 0; background: #f8f9fa;">
        <div style="max-width: 1200px; margin: 0 auto; padding: 0 20px; text-align: center;">
          <h2 style="font-size: 2.5rem; margin-bottom: 3rem; color: #333;">Planos e Preços</h2>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem;">
            ${this.generatePricingCards(businessData)}
          </div>
        </div>
      </section>
    `;
  }

  private generatePricingCards(businessData: BusinessContent): string {
    const plans = [
      { name: 'Básico', price: 'R$ 97', features: ['Atendimento básico', 'Suporte por email', '1 revisão'] },
      { name: 'Premium', price: 'R$ 197', features: ['Atendimento premium', 'Suporte prioritário', '3 revisões', 'Bônus especiais'], popular: true },
      { name: 'VIP', price: 'R$ 397', features: ['Atendimento VIP', 'Suporte 24/7', 'Revisões ilimitadas', 'Consultoria inclusa'] }
    ];

    return plans.map(plan => `
      <div style="background: white; padding: 2rem; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.1); position: relative; ${plan.popular ? `border: 3px solid ${businessData.colors.primary};` : ''}">
        ${plan.popular ? `<div style="position: absolute; top: -15px; left: 50%; transform: translateX(-50%); background: ${businessData.colors.primary}; color: white; padding: 8px 20px; border-radius: 20px; font-size: 0.9rem; font-weight: bold;">MAIS POPULAR</div>` : ''}
        <h3 style="font-size: 1.5rem; margin-bottom: 1rem; color: ${businessData.colors.primary};">${plan.name}</h3>
        <div style="font-size: 2.5rem; font-weight: bold; color: #333; margin-bottom: 2rem;">${plan.price}</div>
        <ul style="list-style: none; padding: 0; margin-bottom: 2rem;">
          ${plan.features.map(feature => `<li style="padding: 0.5rem 0; color: #666;">✓ ${feature}</li>`).join('')}
        </ul>
        <a href="javascript:sendToWhatsApp('orcamento', {plano: '${plan.name}', preco: '${plan.price}'})" style="background: ${plan.popular ? businessData.colors.primary : businessData.colors.secondary}; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: block; font-weight: bold;">
          Escolher Plano
        </a>
      </div>
    `).join('');
  }

  private generateStatsSection(businessData: BusinessContent): string {
    return `
      <section style="padding: 80px 0; background: ${businessData.colors.primary}; color: white;">
        <div style="max-width: 1200px; margin: 0 auto; padding: 0 20px;">
          <h2 style="text-align: center; font-size: 2.5rem; margin-bottom: 3rem;">Nossos Números</h2>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 2rem; text-align: center;">
            <div>
              <div style="font-size: 3rem; font-weight: bold; margin-bottom: 0.5rem;">500+</div>
              <div style="font-size: 1.1rem; opacity: 0.9;">Clientes Satisfeitos</div>
            </div>
            <div>
              <div style="font-size: 3rem; font-weight: bold; margin-bottom: 0.5rem;">99%</div>
              <div style="font-size: 1.1rem; opacity: 0.9;">Taxa de Satisfação</div>
            </div>
            <div>
              <div style="font-size: 3rem; font-weight: bold; margin-bottom: 0.5rem;">5</div>
              <div style="font-size: 1.1rem; opacity: 0.9;">Anos de Experiência</div>
            </div>
            <div>
              <div style="font-size: 3rem; font-weight: bold; margin-bottom: 0.5rem;">24/7</div>
              <div style="font-size: 1.1rem; opacity: 0.9;">Suporte Disponível</div>
            </div>
          </div>
        </div>
      </section>
    `;
  }

  private generateDefaultSection(businessData: BusinessContent, images: any, index: number): string {
    return `
      <section style="padding: 80px 0; background: ${index % 2 === 0 ? '#fff' : '#f8f9fa'};">
        <div style="max-width: 1200px; margin: 0 auto; padding: 0 20px; text-align: center;">
          <h2 style="font-size: 2.5rem; margin-bottom: 2rem; color: ${businessData.colors.primary};">Seção ${index + 1}</h2>
          <p style="font-size: 1.1rem; line-height: 1.8; color: #555; max-width: 800px; margin: 0 auto;">
            Conte com ${businessData.title} para obter os melhores resultados em todos os aspectos do seu negócio.
          </p>
        </div>
      </section>
    `;
  }

  private generateStickyHeader(businessData: BusinessContent, images: any): string {
    return `
      <header style="position: fixed; top: 0; width: 100%; background: rgba(255,255,255,0.95); backdrop-filter: blur(10px); z-index: 1000; padding: 1rem 0; box-shadow: 0 2px 20px rgba(0,0,0,0.1);">
        <div style="max-width: 1200px; margin: 0 auto; padding: 0 20px; display: flex; justify-content: space-between; align-items: center;">
          <div style="font-size: 1.5rem; font-weight: bold; color: ${businessData.colors.primary};">
            ${businessData.title}
          </div>
          <a href="javascript:sendToWhatsApp('cta', {origem: 'Header Sticky'})" style="background: ${businessData.colors.primary}; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
            Contato
          </a>
        </div>
      </header>
      <div style="height: 80px;"></div>
    `;
  }

  private generateImpactfulHero(businessData: BusinessContent, images: any): string {
    return `
      <section style="min-height: 100vh; background: linear-gradient(135deg, ${businessData.colors.primary}, ${businessData.colors.secondary}); color: white; display: flex; align-items: center; text-align: center; position: relative; overflow: hidden;">
        <div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: url('${images.hero}'); background-size: cover; background-position: center; opacity: 0.2;"></div>
        <div style="max-width: 1200px; margin: 0 auto; padding: 0 20px; position: relative; z-index: 2;">
          <h1 style="font-size: 4.5rem; margin-bottom: 2rem; font-weight: 900; text-shadow: 2px 2px 4px rgba(0,0,0,0.8); line-height: 1.1;">
            ${businessData.title}
          </h1>
          <p style="font-size: 1.5rem; margin-bottom: 3rem; opacity: 0.95; max-width: 800px; margin-left: auto; margin-right: auto;">${businessData.heroText}</p>
          <div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
            <a href="javascript:sendToWhatsApp('cta', {origem: 'Hero Impactante'})" style="background: ${businessData.colors.accent}; color: white; padding: 20px 40px; text-decoration: none; border-radius: 50px; font-size: 1.2rem; font-weight: bold; display: inline-flex; align-items: center; gap: 10px; transition: all 0.3s; box-shadow: 0 10px 30px rgba(0,0,0,0.3);">
              🚀 ${businessData.ctaText}
            </a>
            <a href="#sobre" style="background: rgba(255,255,255,0.2); color: white; padding: 20px 40px; text-decoration: none; border-radius: 50px; font-size: 1.2rem; font-weight: bold; backdrop-filter: blur(10px); border: 2px solid rgba(255,255,255,0.3);">
              Saiba Mais
            </a>
          </div>
        </div>
      </section>
    `;
  }

  private generatePremiumFooter(businessData: BusinessContent, images: any): string {
    return `
      <footer style="background: #1a1a1a; color: white; padding: 60px 0 20px;">
        <div style="max-width: 1200px; margin: 0 auto; padding: 0 20px;">
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 3rem; margin-bottom: 3rem;">
            <div>
              <h3 style="font-size: 1.5rem; margin-bottom: 1rem; color: ${businessData.colors.primary};">${businessData.title}</h3>
              <p style="color: #ccc; line-height: 1.6;">${businessData.subtitle}</p>
            </div>
            <div>
              <h4 style="margin-bottom: 1rem;">Contato</h4>
              <p style="color: #ccc; margin-bottom: 0.5rem;">📱 ${businessData.contact?.phone || 'WhatsApp'}</p>
              <p style="color: #ccc; margin-bottom: 0.5rem;">📧 ${businessData.contact?.email || 'contato@empresa.com'}</p>
              <p style="color: #ccc;">📍 ${businessData.contact?.address || 'Endereço não informado'}</p>
            </div>
            <div>
              <h4 style="margin-bottom: 1rem;">Links Rápidos</h4>
              <div style="display: flex; flex-direction: column; gap: 0.5rem;">
                <a href="#hero" style="color: #ccc; text-decoration: none;">Início</a>
                <a href="#sobre" style="color: #ccc; text-decoration: none;">Sobre</a>
                <a href="#servicos" style="color: #ccc; text-decoration: none;">Serviços</a>
                <a href="#contato" style="color: #ccc; text-decoration: none;">Contato</a>
              </div>
            </div>
          </div>
          <div style="border-top: 1px solid #333; padding-top: 2rem; text-align: center; color: #999;">
            <p>© 2024 ${businessData.title}. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    `;
  }

  private generateNavigation(businessData: BusinessContent, images: any): string {
    return `
      <nav style="background: rgba(255,255,255,0.95); padding: 1rem 0; position: fixed; top: 0; width: 100%; z-index: 1000; backdrop-filter: blur(10px); box-shadow: 0 2px 20px rgba(0,0,0,0.1);">
        <div style="max-width: 1200px; margin: 0 auto; padding: 0 20px; display: flex; justify-content: space-between; align-items: center;">
          <div style="font-size: 1.5rem; font-weight: bold; color: ${businessData.colors.primary};">
            ${businessData.title}
          </div>
          <div style="display: flex; gap: 2rem; align-items: center;">
            <a href="#hero" style="color: #333; text-decoration: none; font-weight: 500;">Início</a>
            <a href="#sobre" style="color: #333; text-decoration: none; font-weight: 500;">Sobre</a>
            <a href="#servicos" style="color: #333; text-decoration: none; font-weight: 500;">Serviços</a>
            <a href="javascript:sendToWhatsApp('cta', {origem: 'Menu'})" style="background: ${businessData.colors.primary}; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
              Contato
            </a>
          </div>
        </div>
      </nav>
      <div style="height: 80px;"></div>
    `;
  }

  private generateFooter(businessData: BusinessContent, images: any): string {
    return `
      <footer style="background: #333; color: white; padding: 40px 0;">
        <div style="max-width: 1200px; margin: 0 auto; padding: 0 20px; text-align: center;">
          <h3 style="margin-bottom: 1rem; color: ${businessData.colors.primary};">${businessData.title}</h3>
          <p style="color: #ccc; margin-bottom: 2rem;">${businessData.subtitle}</p>
          <div style="border-top: 1px solid #555; padding-top: 2rem;">
            <p style="color: #999;">© 2024 ${businessData.title}. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    `;
  }

  private generateChatWidget(businessData: BusinessContent): string {
    return `
      <div style="position: fixed; bottom: 20px; right: 20px; z-index: 1000;">
        <a href="javascript:sendToWhatsApp('cta', {origem: 'Widget Chat'})" style="background: #25d366; color: white; padding: 15px 20px; border-radius: 50px; text-decoration: none; display: flex; align-items: center; gap: 10px; box-shadow: 0 4px 20px rgba(0,0,0,0.2); font-weight: bold;">
          💬 Chat no WhatsApp
        </a>
      </div>
    `;
  }

  private generateCSS(businessData: BusinessContent): string {
    return `
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }
        html { scroll-behavior: smooth; }
        
        .cta-button:hover { transform: translateY(-2px); box-shadow: 0 8px 25px rgba(0,0,0,0.2); }
        
        @media (max-width: 768px) {
          h1 { font-size: 2.5rem !important; }
          h2 { font-size: 2rem !important; }
          .hero-simple, section { padding: 60px 0 !important; }
          div[style*="grid-template-columns"] { grid-template-columns: 1fr !important; }
          div[style*="display: flex"] { flex-direction: column !important; }
        }
      </style>
    `;
  }

  private generateJavaScript(businessData: BusinessContent): string {
    const whatsappNumber = businessData.contact?.phone || businessData.contact?.socialMedia?.whatsapp || '';
    const cleanNumber = whatsappNumber.replace(/[^0-9]/g, '');

    return `
      <script>
        // Smooth scroll
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
          anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
              target.scrollIntoView({ behavior: 'smooth' });
            }
          });
        });

        // Função para enviar dados via WhatsApp
        function sendToWhatsApp(tipo, dados) {
          const whatsappNumber = '${cleanNumber}';
          let mensagem = '';
          
          switch(tipo) {
            case 'newsletter':
              mensagem = \`📧 *Newsletter* - Email: \${dados.email} | Empresa: ${businessData.title}\`;
              break;
            case 'contato':
              mensagem = \`📞 *Contato* - Nome: \${dados.nome} | Email: \${dados.email} | Mensagem: \${dados.mensagem} | Empresa: ${businessData.title}\`;
              break;
            case 'orcamento':
              mensagem = \`💰 *Orçamento* - \${dados.plano ? 'Plano: ' + dados.plano + ' - ' + dados.preco : 'Solicitação de orçamento'} | Empresa: ${businessData.title}\`;
              break;
            case 'cta':
              mensagem = \`🎯 *Interesse* - Origem: \${dados.origem} | Empresa: ${businessData.title} - Olá! Tenho interesse em saber mais sobre os serviços.\`;
              break;
            case 'contato_final':
              mensagem = \`🚀 *Contato Final* - Origem: \${dados.origem} | Empresa: ${businessData.title} - Olá! Quero começar agora mesmo!\`;
              break;
            default:
              mensagem = \`📝 *Contato* - \${JSON.stringify(dados)} | Empresa: ${businessData.title}\`;
          }
          
          if (!whatsappNumber) {
            alert('Número do WhatsApp não configurado. Entre em contato pelos outros meios disponíveis.');
            return;
          }
          
          const encodedMessage = encodeURIComponent(mensagem);
          const whatsappUrl = \`https://wa.me/\${whatsappNumber}?text=\${encodedMessage}\`;
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
      </script>
    `;
  }
}

export const htmlAgent = new HtmlAgent();