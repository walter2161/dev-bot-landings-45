import { BusinessContent } from '../contentGenerator';

const PICSUM_BASE_URL = "https://picsum.photos";

export class HtmlAgent {
  async generateLandingPage(businessData: BusinessContent, language: string = 'pt'): Promise<string> {
    const images = this.generateImageUrls(businessData);
    return this.buildHTMLTemplate(businessData, images, language);
  }

  async generateHTML(businessData: BusinessContent, language: string = 'pt'): Promise<string> {
    return this.generateLandingPage(businessData, language);
  }

  private generateImageUrls(businessData: BusinessContent): any {
    const baseUrl = `${PICSUM_BASE_URL}/800/600?random=`;
    const imageParams = `&blur=0&grayscale=0`;
    
    const customImages = businessData.customImages || {};
    
    return {
      logo: customImages.logo || `${baseUrl}logo${imageParams}`,
      hero: customImages.hero || `https://image.pollinations.ai/prompt/${encodeURIComponent(businessData.title)}?width=1200&height=600`,
      about: customImages.about || `https://image.pollinations.ai/prompt/equipe%20profissional%20trabalhando?width=800&height=600`,
      results: customImages.results || `https://image.pollinations.ai/prompt/graficos%20de%20crescimento?width=800&height=600`,
      team1: customImages.team1 || `https://image.pollinations.ai/prompt/profissional%20homem?width=300&height=300`,
      team2: customImages.team2 || `https://image.pollinations.ai/prompt/profissional%20mulher?width=300&height=300`,
      team3: customImages.team3 || `https://image.pollinations.ai/prompt/profissional%20pessoa?width=300&height=300`
    };
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
    return `
      ${this.generateHeroSection(businessData, images)}
      ${this.generateAboutSection(businessData, images)}
      ${this.generateServicesSection(businessData)}
      ${this.generateResultsSection(businessData)}
      ${this.generateTestimonialsSection(businessData)}
      ${this.generateProcessSection(businessData)}
      ${this.generateTeamSection(businessData, images)}
      ${this.generateFAQSection(businessData)}
      ${isService ? this.generatePricingSection(businessData) : ''}
      ${this.generateCTASection(businessData)}
      ${this.generateFooterSection(businessData)}
      ${this.generateFloatingChat(businessData)}
    `;
  }

  private generateHeroSection(businessData: BusinessContent, images: any): string {
    return `
    <!-- Hero Section -->
    <section class="hero">
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
    <!-- Sobre Nós -->
    <section class="section">
        <div class="container">
            <div class="row align-items-center">
                <div class="col-lg-6 mb-4 mb-lg-0">
                    <h2 class="section-title">Sobre ${businessData.title}</h2>
                    <p class="lead">${businessData.subtitle}</p>
                    <p>${businessData.heroText || 'Nossa equipe é especializada em oferecer soluções de alta qualidade.'}</p>
                    <p>Entendemos os desafios únicos do mercado e criamos estratégias personalizadas que geram resultados mensuráveis.</p>
                    <a href="#contato" class="btn btn-primary mt-3">Saiba Mais</a>
                </div>
                <div class="col-lg-6">
                    <img src="${images.about}" class="img-fluid rounded shadow" alt="Sobre ${businessData.title}">
                </div>
            </div>
        </div>
    </section>
    `;
  }

  private generateServicesSection(businessData: BusinessContent): string {
    const services = [
      { icon: 'fa-star', title: 'Qualidade Premium', description: 'Serviços de alta qualidade com foco na excelência' },
      { icon: 'fa-users', title: 'Atendimento Personalizado', description: 'Suporte dedicado para suas necessidades específicas' },
      { icon: 'fa-chart-line', title: 'Resultados Garantidos', description: 'Compromisso com sua satisfação e sucesso' },
      { icon: 'fa-clock', title: 'Agilidade', description: 'Processos eficientes para resultados rápidos' },
      { icon: 'fa-shield-alt', title: 'Segurança', description: 'Protocolos rigorosos de qualidade e segurança' },
      { icon: 'fa-headset', title: 'Suporte Contínuo', description: 'Atendimento disponível quando você precisar' }
    ];

    return `
    <!-- Serviços -->
    <section id="servicos" class="section bg-light">
        <div class="container">
            <div class="text-center mb-5">
                <h2 class="section-title">Nossos Serviços Especializados</h2>
                <p class="lead">Soluções completas para suas necessidades</p>
            </div>
            <div class="row g-4">
                ${services.map(service => `
                <div class="col-md-6 col-lg-4">
                    <div class="card h-100 shadow-sm">
                        <div class="card-body text-center p-4">
                            <div class="service-icon">
                                <i class="fas ${service.icon}"></i>
                            </div>
                            <h4>${service.title}</h4>
                            <p>${service.description}</p>
                        </div>
                    </div>
                </div>
                `).join('')}
            </div>
        </div>
    </section>
    `;
  }

  private generateResultsSection(businessData: BusinessContent): string {
    return `
    <!-- Resultados -->
    <section class="section">
        <div class="container">
            <div class="text-center mb-5">
                <h2 class="section-title">Resultados Comprovados</h2>
                <p class="lead">Números que falam por si só</p>
            </div>
            <div class="row text-center">
                <div class="col-md-3 mb-4">
                    <div class="counter" data-target="500">0</div>
                    <h5>Clientes Satisfeitos</h5>
                </div>
                <div class="col-md-3 mb-4">
                    <div class="counter" data-target="98">0</div>
                    <h5>Taxa de Satisfação (%)</h5>
                </div>
                <div class="col-md-3 mb-4">
                    <div class="counter" data-target="1000">0</div>
                    <h5>Projetos Concluídos</h5>
                </div>
                <div class="col-md-3 mb-4">
                    <div class="counter" data-target="24">0</div>
                    <h5>Suporte 24/7</h5>
                </div>
            </div>
            <div class="row mt-5">
                <div class="col-lg-6 mx-auto">
                    <img src="${businessData.customImages?.results || 'https://image.pollinations.ai/prompt/graficos%20de%20crescimento?width=800&height=600'}" class="img-fluid rounded shadow" alt="Gráficos de resultados">
                </div>
            </div>
        </div>
    </section>
    `;
  }

  private generateTestimonialsSection(businessData: BusinessContent): string {
    const testimonials = [
      { name: 'Maria Silva', role: 'Cliente', text: `${businessData.title} transformou completamente minha experiência. Recomendo para todos!`, initial: 'M' },
      { name: 'João Santos', role: 'Empresário', text: 'Profissionalismo e qualidade em todos os detalhes. Estou muito satisfeito.', initial: 'J' },
      { name: 'Ana Costa', role: 'Gerente', text: 'Atendimento excepcional e resultados que superaram minhas expectativas.', initial: 'A' }
    ];

    return `
    <!-- Depoimentos -->
    <section class="section bg-light">
        <div class="container">
            <div class="text-center mb-5">
                <h2 class="section-title">O Que Nossos Clientes Dizem</h2>
                <p class="lead">Histórias de sucesso reais</p>
            </div>
            <div class="row">
                ${testimonials.map(t => `
                <div class="col-lg-4 mb-4">
                    <div class="testimonial">
                        <p class="mb-4">"${t.text}"</p>
                        <div class="d-flex align-items-center">
                            <div class="testimonial-avatar me-3">
                                ${t.initial}
                            </div>
                            <div>
                                <h5 class="mb-0">${t.name}</h5>
                                <small>${t.role}</small>
                            </div>
                        </div>
                    </div>
                </div>
                `).join('')}
            </div>
        </div>
    </section>
    `;
  }

  private generateProcessSection(businessData: BusinessContent): string {
    return `
    <!-- Processo -->
    <section class="section">
        <div class="container">
            <div class="text-center mb-5">
                <h2 class="section-title">Como Funciona</h2>
                <p class="lead">Nosso processo simplificado em 3 etapas</p>
            </div>
            <div class="row">
                <div class="col-md-4">
                    <div class="process-step">
                        <div class="step-number">1</div>
                        <h4>Consulta Inicial</h4>
                        <p>Entendemos suas necessidades e objetivos específicos.</p>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="process-step">
                        <div class="step-number">2</div>
                        <h4>Estratégia Personalizada</h4>
                        <p>Criamos um plano de ação exclusivo para você.</p>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="process-step">
                        <div class="step-number">3</div>
                        <h4>Resultados</h4>
                        <p>Implementamos e acompanhamos para garantir o sucesso.</p>
                    </div>
                </div>
            </div>
        </div>
    </section>
    `;
  }

  private generateTeamSection(businessData: BusinessContent, images: any): string {
    const team = [
      { name: 'Especialista 1', role: 'Diretor', image: images.team1 },
      { name: 'Especialista 2', role: 'Coordenador', image: images.team2 },
      { name: 'Especialista 3', role: 'Consultor', image: images.team3 }
    ];

    return `
    <!-- Equipe -->
    <section class="section bg-light">
        <div class="container">
            <div class="text-center mb-5">
                <h2 class="section-title">Nossa Equipe Especializada</h2>
                <p class="lead">Profissionais dedicados ao seu sucesso</p>
            </div>
            <div class="row">
                ${team.map(member => `
                <div class="col-md-4">
                    <div class="team-member">
                        <img src="${member.image}" alt="${member.name}">
                        <h4>${member.name}</h4>
                        <p>${member.role}</p>
                        <div class="social-icons">
                            <a href="#"><i class="fab fa-linkedin"></i></a>
                            <a href="#"><i class="fab fa-instagram"></i></a>
                        </div>
                    </div>
                </div>
                `).join('')}
            </div>
        </div>
    </section>
    `;
  }

  private generateFAQSection(businessData: BusinessContent): string {
    const faqs = [
      { question: `Como funciona o ${businessData.title}?`, answer: 'Oferecemos um serviço personalizado e de alta qualidade, adaptado às suas necessidades específicas.' },
      { question: 'Qual o prazo de atendimento?', answer: 'O prazo varia conforme o projeto, mas sempre priorizamos a qualidade e pontualidade.' },
      { question: 'Vocês oferecem garantia?', answer: 'Sim, oferecemos garantia em todos os nossos serviços para sua total tranquilidade.' },
      { question: 'Como posso entrar em contato?', answer: `Você pode nos contatar através do WhatsApp: ${businessData.contact?.phone || '(00) 00000-0000'}, e-mail: ${businessData.contact?.email || 'contato@empresa.com'} ou pelo formulário no site.` }
    ];

    return `
    <!-- FAQ -->
    <section class="section">
        <div class="container">
            <div class="text-center mb-5">
                <h2 class="section-title">Perguntas Frequentes</h2>
                <p class="lead">Tire suas dúvidas</p>
            </div>
            <div class="row">
                <div class="col-lg-8 mx-auto">
                    ${faqs.map((faq, i) => `
                    <div class="faq-item">
                        <div class="faq-question">${faq.question}</div>
                        <div class="faq-answer">
                            <p>${faq.answer}</p>
                        </div>
                    </div>
                    `).join('')}
                </div>
            </div>
        </div>
    </section>
    `;
  }

  private generatePricingSection(businessData: BusinessContent): string {
    return `
    <!-- Investimento (apenas para serviços) -->
    <section class="section bg-light">
        <div class="container">
            <div class="text-center mb-5">
                <h2 class="section-title">Investimento</h2>
                <p class="lead">Planos personalizados para suas necessidades</p>
            </div>
            <div class="row justify-content-center">
                <div class="col-lg-4 mb-4">
                    <div class="card h-100">
                        <div class="card-body text-center p-4">
                            <h3 class="mb-4">Consulte</h3>
                            <p class="mb-4">Valores personalizados de acordo com suas necessidades</p>
                            <a href="javascript:sendToWhatsApp('orcamento', {origem: 'Pricing'})" class="btn btn-primary">Solicitar Orçamento</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
    `;
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
        }
        
        .hero {
            background: linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('${businessData.customImages?.hero || 'https://image.pollinations.ai/prompt/' + encodeURIComponent(businessData.title)}');
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
