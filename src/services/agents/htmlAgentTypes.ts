import { BusinessContent } from '../contentGenerator';

export class HtmlAgentTypes {
  static generateLandingPageByType(
    type: string,
    businessData: BusinessContent,
    images: any,
    htmlAgent: any
  ): string {
    const sectionsMap = {
      simples: [
        'hero', 'benefits_icons', 'testimonial_single', 'about_product', 'comparison_simple',
        'cta_destacado', 'pricing_simple', 'faq_basic', 'cta_final', 'footer_minimal'
      ],
      avancada: [
        'hero', 'problem_solution', 'benefits_icons', 'client_logos', 'about_product',
        'before_after', 'testimonials_carousel', 'animated_counters', 'cta_center',
        'features_detailed', 'video_demo', 'team_expert', 'pricing_table', 'guarantee_seal',
        'faq_standard', 'limited_offer', 'bonus_download', 'cta_final', 'footer_complete'
      ],
      completa: [
        'hero_sticky', 'sub_headline', 'problem_solution_visual', 'benefits_cards', 'storytelling',
        'client_logos', 'product_showcase', 'before_after_slider', 'features_expanded', 'video_demo',
        'case_study', 'testimonials_carousel', 'video_testimonials', 'impact_stats', 'team_expert',
        'awards_certifications', 'pricing_three_options', 'guarantee_trust', 'special_offer_scarcity',
        'cta_intermediate', 'faq_comprehensive', 'webinar_event', 'competitor_comparison',
        'inspirational_callout', 'secondary_cta', 'limited_time_counter', 'digital_bonus',
        'powerful_final_cta', 'premium_footer'
      ]
    };

    const selectedSections = sectionsMap[type as keyof typeof sectionsMap] || sectionsMap.avancada;
    let htmlContent = '';

    selectedSections.forEach((sectionType, index) => {
      htmlContent += this.generateSectionByType(sectionType, businessData, images, index);
    });

    return htmlContent;
  }

  static generateSectionByType(
    sectionType: string,
    businessData: BusinessContent,
    images: any,
    index: number
  ): string {
    const sectionData = businessData.sections[index] || {
      id: `section-${index}`,
      title: businessData.title,
      content: businessData.heroText,
      type: 'default'
    };

    switch (sectionType) {
      case 'hero':
        return this.generateHeroSection(businessData, images);

      case 'benefits_icons':
        return this.generateBenefitsIcons(sectionData, businessData, images);

      case 'testimonial_single':
        return this.generateTestimonialSingle(sectionData, businessData, images);

      case 'about_product':
        return this.generateAboutProduct(sectionData, businessData, images);

      case 'comparison_simple':
        return this.generateComparisonSimple(sectionData, businessData, images);

      case 'cta_destacado':
        return this.generateCTADestacado(sectionData, businessData);

      case 'pricing_simple':
        return this.generatePricingSimple(sectionData, businessData, images);

      case 'faq_basic':
        return this.generateFAQBasic(sectionData, businessData);

      case 'cta_final':
        return this.generateCTAFinal(businessData);

      case 'footer_minimal':
        return this.generateFooterMinimal(businessData, images);

      // Adicionar mais casos conforme necessário...
      
      default:
        return this.generateDefaultSection(sectionData, businessData, images);
    }
  }

  static generateHeroSection(businessData: BusinessContent, images: any): string {
    return `<section id="hero" class="section hero">
        <div class="container">
            <h1>${businessData.sections[0]?.title || businessData.title}</h1>
            <p>${businessData.heroText}</p>
            <a href="#contato" class="cta-button">${businessData.ctaText}</a>
        </div>
    </section>`;
  }

  static generateBenefitsIcons(sectionData: any, businessData: BusinessContent, images: any): string {
    return `<section id="benefits" class="section" style="background: #f8f9fa;">
        <div class="container">
            <h2 class="section-title">${sectionData.title}</h2>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 2rem; margin-top: 3rem;">
                <div style="text-align: center; padding: 2rem;">
                    <div style="font-size: 3rem; margin-bottom: 1rem;">⚡</div>
                    <h3 style="color: ${businessData.colors.primary};">Rapidez</h3>
                    <p>Soluções ágeis e eficientes para suas necessidades.</p>
                </div>
                <div style="text-align: center; padding: 2rem;">
                    <div style="font-size: 3rem; margin-bottom: 1rem;">🎯</div>
                    <h3 style="color: ${businessData.colors.primary};">Precisão</h3>
                    <p>Resultados exatos e personalizados.</p>
                </div>
                <div style="text-align: center; padding: 2rem;">
                    <div style="font-size: 3rem; margin-bottom: 1rem;">🛡️</div>
                    <h3 style="color: ${businessData.colors.primary};">Confiança</h3>
                    <p>Qualidade garantida em todos os serviços.</p>
                </div>
            </div>
        </div>
    </section>`;
  }

  static generateTestimonialSingle(sectionData: any, businessData: BusinessContent, images: any): string {
    return `<section id="testimonial" class="section" style="background: ${businessData.colors.primary}; color: white; text-align: center;">
        <div class="container">
            <blockquote style="font-size: 1.5rem; font-style: italic; margin-bottom: 2rem;">
                "${sectionData.content}"
            </blockquote>
            <div style="display: flex; align-items: center; justify-content: center; gap: 1rem;">
                <img src="${images.hero}" alt="Cliente" style="width: 60px; height: 60px; border-radius: 50%; object-fit: cover;">
                <div>
                    <strong>Cliente Satisfeito</strong>
                    <div style="opacity: 0.8;">★★★★★</div>
                </div>
            </div>
        </div>
    </section>`;
  }

  static generateAboutProduct(sectionData: any, businessData: BusinessContent, images: any): string {
    return `<section id="sobre" class="section">
        <div class="container">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 4rem; align-items: center;">
                <div>
                    <h2 style="color: ${businessData.colors.primary}; margin-bottom: 1.5rem;">${sectionData.title}</h2>
                    <p style="font-size: 1.1rem; line-height: 1.8;">${sectionData.content}</p>
                </div>
                <div>
                    <img src="${images.hero}" alt="Sobre" style="width: 100%; border-radius: 10px;">
                </div>
            </div>
        </div>
    </section>`;
  }

  static generateComparisonSimple(sectionData: any, businessData: BusinessContent, images: any): string {
    return `<section id="comparison" class="section" style="background: #f8f9fa;">
        <div class="container">
            <h2 class="section-title">Antes vs Depois</h2>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 3rem; margin-top: 3rem;">
                <div style="text-align: center; padding: 2rem; background: #e74c3c; color: white; border-radius: 10px;">
                    <h3>❌ ANTES</h3>
                    <p>Problemas e dificuldades comuns</p>
                </div>
                <div style="text-align: center; padding: 2rem; background: ${businessData.colors.primary}; color: white; border-radius: 10px;">
                    <h3>✅ DEPOIS</h3>
                    <p>Soluções e resultados positivos</p>
                </div>
            </div>
        </div>
    </section>`;
  }

  static generateCTADestacado(sectionData: any, businessData: BusinessContent): string {
    return `<section id="cta-destacado" class="section" style="background: linear-gradient(135deg, ${businessData.colors.primary}, ${businessData.colors.secondary}); color: white; text-align: center;">
        <div class="container">
            <h2 style="font-size: 2.5rem; margin-bottom: 1rem;">Pronto para Começar?</h2>
            <p style="font-size: 1.2rem; margin-bottom: 2rem;">Entre em contato agora e transforme sua realidade!</p>
            <button onclick="sendToWhatsApp('cta', {origem: 'CTA Destacado'})" class="cta-button" style="background: ${businessData.colors.accent}; font-size: 1.2rem; padding: 15px 40px;">
                Falar no WhatsApp
            </button>
        </div>
    </section>`;
  }

  static generatePricingSimple(sectionData: any, businessData: BusinessContent, images: any): string {
    return `<section id="pricing" class="section">
        <div class="container">
            <h2 class="section-title">Investimento</h2>
            <div style="max-width: 400px; margin: 3rem auto; padding: 3rem; border: 3px solid ${businessData.colors.primary}; border-radius: 15px; text-align: center;">
                <h3 style="color: ${businessData.colors.primary}; font-size: 2rem;">Plano Único</h3>
                <div style="font-size: 3rem; font-weight: bold; color: ${businessData.colors.secondary}; margin: 1rem 0;">
                    R$ 297
                </div>
                <p style="margin-bottom: 2rem;">Tudo que você precisa para começar</p>
                <button onclick="sendToWhatsApp('orcamento', {plano: 'Plano Único', valor: 'R$ 297'})" class="cta-button" style="background: ${businessData.colors.primary}; width: 100%;">
                    Solicitar Orçamento
                </button>
            </div>
        </div>
    </section>`;
  }

  static generateFAQBasic(sectionData: any, businessData: BusinessContent): string {
    const faqs = [
      { q: "Como funciona?", a: "Nosso processo é simples e eficiente, focado em resultados." },
      { q: "Quanto tempo demora?", a: "O tempo varia de acordo com suas necessidades específicas." },
      { q: "Tem garantia?", a: "Sim, oferecemos garantia de satisfação em todos os nossos serviços." }
    ];

    return `<section id="faq" class="section" style="background: #f8f9fa;">
        <div class="container">
            <h2 class="section-title">Perguntas Frequentes</h2>
            <div style="max-width: 800px; margin: 3rem auto;">
                ${faqs.map((faq, index) => `
                    <div style="margin-bottom: 1rem; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
                        <button onclick="toggleFAQ(${index})" style="width: 100%; padding: 1.5rem; background: white; border: none; text-align: left; font-weight: 600; cursor: pointer; display: flex; justify-content: space-between; align-items: center;">
                            ${faq.q}
                            <span id="faq-icon-${index}" style="transition: transform 0.3s;">+</span>
                        </button>
                        <div id="faq-content-${index}" style="display: none; padding: 1.5rem; background: #f8f9fa; border-top: 1px solid #ddd;">
                            ${faq.a}
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    </section>`;
  }

  static generateCTAFinal(businessData: BusinessContent): string {
    return `<section id="cta-final" class="section" style="background: ${businessData.colors.secondary}; color: white; text-align: center;">
        <div class="container">
            <h2 style="font-size: 2.5rem; margin-bottom: 1rem;">Não Perca Esta Oportunidade!</h2>
            <p style="font-size: 1.2rem; margin-bottom: 2rem;">Entre em contato agora e garante sua vaga!</p>
            <button onclick="sendToWhatsApp('contato_final', {origem: 'CTA Final'})" class="cta-button" style="background: ${businessData.colors.accent}; font-size: 1.3rem; padding: 20px 50px;">
                QUERO COMEÇAR AGORA!
            </button>
        </div>
    </section>`;
  }

  static generateFooterMinimal(businessData: BusinessContent, images: any): string {
    return `<footer id="contato" class="section" style="background: #333; color: white; text-align: center;">
        <div class="container">
            <div style="margin-bottom: 2rem;">
                <img src="${images.logo}" alt="Logo" style="width: 60px; height: 60px; border-radius: 50%; margin-bottom: 1rem;">
                <h3>${businessData.title}</h3>
            </div>
            <div style="margin-bottom: 2rem;">
                ${businessData.contact?.whatsapp ? `<p>WhatsApp: ${businessData.contact.whatsapp}</p>` : ''}
                ${businessData.contact?.address ? `<p>Endereço: ${businessData.contact.address}</p>` : ''}
            </div>
            <form onsubmit="event.preventDefault(); sendToWhatsApp('contato', {nome: this.nome.value, email: this.email.value, mensagem: this.mensagem.value});" style="max-width: 500px; margin: 0 auto;">
                <input type="text" name="nome" placeholder="Seu Nome" required style="width: 100%; padding: 10px; margin-bottom: 10px; border: none; border-radius: 5px;">
                <input type="email" name="email" placeholder="Seu Email" required style="width: 100%; padding: 10px; margin-bottom: 10px; border: none; border-radius: 5px;">
                <textarea name="mensagem" placeholder="Sua Mensagem" required style="width: 100%; padding: 10px; margin-bottom: 10px; border: none; border-radius: 5px; min-height: 80px;"></textarea>
                <button type="submit" style="background: ${businessData.colors.primary}; color: white; padding: 12px 30px; border: none; border-radius: 5px; cursor: pointer; font-size: 1rem;">
                    Enviar via WhatsApp
                </button>
            </form>
            <p style="margin-top: 2rem; opacity: 0.7;">© 2024 ${businessData.title}. Todos os direitos reservados.</p>
        </div>
    </footer>`;
  }

  static generateDefaultSection(sectionData: any, businessData: BusinessContent, images: any): string {
    return `<section id="${sectionData.id}" class="section">
        <div class="container">
            <h2 class="section-title" style="color: ${businessData.colors.primary};">${sectionData.title}</h2>
            <p style="font-size: 1.1rem; line-height: 1.8; margin-top: 2rem;">${sectionData.content}</p>
        </div>
    </section>`;
  }
}