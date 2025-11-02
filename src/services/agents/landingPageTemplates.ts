// Sistema de Templates para Landing Pages - PageJet 3.0

export interface TemplateSection {
  id: string;
  name: string;
  description: string;
  requiredImages: string[];
  hasGallery?: boolean;
  hasCatalog?: boolean;
  hasVideo?: boolean;
  hasBeforeAfter?: boolean;
}

export interface LandingPageTemplate {
  id: string;
  name: string;
  description: string;
  nichos: string[];
  sections: TemplateSection[];
  totalSections: number;
}

// Template 1: Visual/Galeria (Imobiliária, Fotografia, Arquitetura)
const visualGalleryTemplate: LandingPageTemplate = {
  id: 'visual-gallery',
  name: 'Visual & Galeria',
  description: 'Focado em apresentação visual forte com galerias de imagens',
  nichos: ['imobiliária', 'fotografia', 'arquitetura', 'design de interiores', 'paisagismo', 'corretor'],
  totalSections: 8,
  sections: [
    {
      id: 'hero',
      name: 'Hero Principal',
      description: 'Banner de destaque com imagem impactante',
      requiredImages: ['hero']
    },
    {
      id: 'gallery-showcase',
      name: 'Galeria em Destaque',
      description: 'Grid de imagens do portfólio',
      requiredImages: ['gallery'],
      hasGallery: true
    },
    {
      id: 'about',
      name: 'Sobre Nós',
      description: 'Apresentação da empresa e valores',
      requiredImages: ['about']
    },
    {
      id: 'recent-projects',
      name: 'Projetos Recentes',
      description: 'Últimos trabalhos realizados',
      requiredImages: ['projects'],
      hasGallery: true
    },
    {
      id: 'process',
      name: 'Nosso Processo',
      description: 'Como trabalhamos passo a passo',
      requiredImages: ['process']
    },
    {
      id: 'testimonials',
      name: 'Depoimentos',
      description: 'O que nossos clientes dizem',
      requiredImages: ['testimonials']
    },
    {
      id: 'cta-contact',
      name: 'Entre em Contato',
      description: 'Formulário de contato e informações',
      requiredImages: ['contact']
    },
    {
      id: 'footer',
      name: 'Rodapé',
      description: 'Informações finais e links',
      requiredImages: []
    }
  ]
};

// Template 2: Catálogo/E-commerce (Restaurante, Pizzaria, Loja)
const catalogEcommerceTemplate: LandingPageTemplate = {
  id: 'catalog-ecommerce',
  name: 'Catálogo & E-commerce',
  description: 'Apresentação de produtos e serviços com preços',
  nichos: ['restaurante', 'pizzaria', 'loja', 'cafeteria', 'padaria', 'confeitaria', 'delivery'],
  totalSections: 9,
  sections: [
    {
      id: 'hero',
      name: 'Hero com CTA',
      description: 'Banner principal com chamada para ação',
      requiredImages: ['hero']
    },
    {
      id: 'catalog-menu',
      name: 'Cardápio/Catálogo',
      description: 'Lista de produtos com fotos e preços',
      requiredImages: ['products'],
      hasCatalog: true
    },
    {
      id: 'featured-products',
      name: 'Destaques',
      description: 'Produtos ou pratos em destaque',
      requiredImages: ['featured'],
      hasCatalog: true
    },
    {
      id: 'about',
      name: 'Nossa História',
      description: 'História da empresa',
      requiredImages: ['about']
    },
    {
      id: 'special-offers',
      name: 'Ofertas Especiais',
      description: 'Promoções e combos',
      requiredImages: ['offers']
    },
    {
      id: 'testimonials',
      name: 'Avaliações',
      description: 'Reviews de clientes',
      requiredImages: ['reviews']
    },
    {
      id: 'delivery-info',
      name: 'Como Pedir/Delivery',
      description: 'Informações de entrega',
      requiredImages: ['delivery']
    },
    {
      id: 'cta-order',
      name: 'Faça seu Pedido',
      description: 'CTA para WhatsApp/pedido',
      requiredImages: ['cta']
    },
    {
      id: 'footer',
      name: 'Rodapé',
      description: 'Informações e redes sociais',
      requiredImages: []
    }
  ]
};

// Template 3: Serviços/Depoimentos (Coach, Cursos, Consultoria)
const servicesTestimonialsTemplate: LandingPageTemplate = {
  id: 'services-testimonials',
  name: 'Serviços & Depoimentos',
  description: 'Foco em transformação e resultados com vídeos',
  nichos: ['coach', 'cursos', 'consultoria', 'mentoria', 'treinamento', 'terapia', 'psicologia'],
  totalSections: 10,
  sections: [
    {
      id: 'hero',
      name: 'Hero Impactante',
      description: 'Promessa de transformação',
      requiredImages: ['hero']
    },
    {
      id: 'about-method',
      name: 'Sobre o Método',
      description: 'Apresentação da metodologia',
      requiredImages: ['method']
    },
    {
      id: 'benefits',
      name: 'Benefícios',
      description: 'O que você vai conquistar',
      requiredImages: ['benefits']
    },
    {
      id: 'video-testimonials',
      name: 'Depoimentos em Vídeo',
      description: 'Vídeos de clientes transformados',
      requiredImages: ['testimonials'],
      hasVideo: true
    },
    {
      id: 'results-cases',
      name: 'Casos de Sucesso',
      description: 'Resultados alcançados',
      requiredImages: ['results']
    },
    {
      id: 'who-is-for',
      name: 'Para Quem é',
      description: 'Público-alvo ideal',
      requiredImages: ['target']
    },
    {
      id: 'investment',
      name: 'Investimento',
      description: 'Valores e formas de pagamento',
      requiredImages: ['investment']
    },
    {
      id: 'faq',
      name: 'Perguntas Frequentes',
      description: 'Dúvidas comuns',
      requiredImages: []
    },
    {
      id: 'cta-signup',
      name: 'Inscreva-se Agora',
      description: 'CTA final forte',
      requiredImages: ['cta']
    },
    {
      id: 'footer',
      name: 'Rodapé',
      description: 'Informações legais',
      requiredImages: []
    }
  ]
};

// Template 4: Corporativo/B2B (Empresas, Serviços B2B)
const corporateB2BTemplate: LandingPageTemplate = {
  id: 'corporate-b2b',
  name: 'Corporativo & B2B',
  description: 'Profissional e focado em credibilidade',
  nichos: ['empresa', 'b2b', 'tecnologia', 'software', 'segurança', 'logística', 'contabilidade', 'advocacia'],
  totalSections: 9,
  sections: [
    {
      id: 'hero',
      name: 'Hero Profissional',
      description: 'Apresentação corporativa',
      requiredImages: ['hero']
    },
    {
      id: 'about-company',
      name: 'Sobre a Empresa',
      description: 'História e missão',
      requiredImages: ['company']
    },
    {
      id: 'services',
      name: 'Nossos Serviços',
      description: 'Portfólio de soluções',
      requiredImages: ['services']
    },
    {
      id: 'cases',
      name: 'Cases de Sucesso',
      description: 'Projetos realizados',
      requiredImages: ['cases']
    },
    {
      id: 'team',
      name: 'Nossa Equipe',
      description: 'Profissionais especializados',
      requiredImages: ['team']
    },
    {
      id: 'differentials',
      name: 'Diferenciais',
      description: 'Por que nos escolher',
      requiredImages: ['differentials']
    },
    {
      id: 'partners',
      name: 'Parceiros e Certificações',
      description: 'Credibilidade e parcerias',
      requiredImages: ['partners']
    },
    {
      id: 'cta-quote',
      name: 'Solicite um Orçamento',
      description: 'Formulário de contato',
      requiredImages: ['contact']
    },
    {
      id: 'footer',
      name: 'Rodapé',
      description: 'Informações corporativas',
      requiredImages: []
    }
  ]
};

// Template 5: Local/Proximidade (Salão, Clínica, Oficina)
const localProximityTemplate: LandingPageTemplate = {
  id: 'local-proximity',
  name: 'Local & Proximidade',
  description: 'Foco em localização e atendimento personalizado',
  nichos: ['salão', 'clínica', 'oficina', 'academia', 'pet shop', 'estética', 'spa', 'barbeiro'],
  totalSections: 10,
  sections: [
    {
      id: 'hero',
      name: 'Hero com Localização',
      description: 'Banner com destaque para localização',
      requiredImages: ['hero']
    },
    {
      id: 'about',
      name: 'Quem Somos',
      description: 'Apresentação do negócio local',
      requiredImages: ['about']
    },
    {
      id: 'services',
      name: 'Nossos Serviços',
      description: 'Lista de serviços oferecidos',
      requiredImages: ['services']
    },
    {
      id: 'before-after',
      name: 'Antes e Depois',
      description: 'Transformações realizadas',
      requiredImages: ['before-after'],
      hasBeforeAfter: true
    },
    {
      id: 'location-map',
      name: 'Localização',
      description: 'Mapa e como chegar',
      requiredImages: ['location']
    },
    {
      id: 'hours',
      name: 'Horários de Funcionamento',
      description: 'Dias e horários',
      requiredImages: []
    },
    {
      id: 'pricing',
      name: 'Tabela de Preços',
      description: 'Valores dos serviços',
      requiredImages: []
    },
    {
      id: 'testimonials',
      name: 'Avaliações',
      description: 'O que dizem sobre nós',
      requiredImages: ['testimonials']
    },
    {
      id: 'cta-appointment',
      name: 'Agende sua Visita',
      description: 'Botão de agendamento',
      requiredImages: ['cta']
    },
    {
      id: 'footer',
      name: 'Rodapé',
      description: 'Contatos e redes',
      requiredImages: []
    }
  ]
};

// Template 6: Projetos/Construção (Construção Civil, Reformas)
const projectsConstructionTemplate: LandingPageTemplate = {
  id: 'projects-construction',
  name: 'Projetos & Construção',
  description: 'Foco em portfólio de projetos e processo',
  nichos: ['construção civil', 'reforma', 'engenharia', 'projetos', 'marcenaria', 'serralheria', 'elétrica', 'hidráulica'],
  totalSections: 9,
  sections: [
    {
      id: 'hero',
      name: 'Hero com Projeto',
      description: 'Banner com projeto em destaque',
      requiredImages: ['hero']
    },
    {
      id: 'portfolio',
      name: 'Portfólio de Projetos',
      description: 'Galeria de obras realizadas',
      requiredImages: ['portfolio'],
      hasGallery: true
    },
    {
      id: 'our-process',
      name: 'Nosso Processo',
      description: 'Como executamos os projetos',
      requiredImages: ['process']
    },
    {
      id: 'stages',
      name: 'Etapas do Trabalho',
      description: 'Passo a passo da execução',
      requiredImages: ['stages']
    },
    {
      id: 'materials',
      name: 'Materiais e Qualidade',
      description: 'Materiais utilizados',
      requiredImages: ['materials']
    },
    {
      id: 'warranty',
      name: 'Garantia',
      description: 'Garantias oferecidas',
      requiredImages: ['warranty']
    },
    {
      id: 'testimonials',
      name: 'Clientes Satisfeitos',
      description: 'Depoimentos de clientes',
      requiredImages: ['testimonials']
    },
    {
      id: 'cta-quote',
      name: 'Solicite um Orçamento',
      description: 'Formulário de orçamento',
      requiredImages: ['contact']
    },
    {
      id: 'footer',
      name: 'Rodapé',
      description: 'Informações e certificações',
      requiredImages: []
    }
  ]
};

// Array com todos os templates
export const landingPageTemplates: LandingPageTemplate[] = [
  visualGalleryTemplate,
  catalogEcommerceTemplate,
  servicesTestimonialsTemplate,
  corporateB2BTemplate,
  localProximityTemplate,
  projectsConstructionTemplate
];

// Função para selecionar o template baseado no tipo de negócio
export function selectTemplateForBusiness(businessType: string): LandingPageTemplate {
  const lowerBusinessType = businessType.toLowerCase();
  
  // Procurar template que melhor se encaixa
  for (const template of landingPageTemplates) {
    for (const nicho of template.nichos) {
      if (lowerBusinessType.includes(nicho)) {
        console.log(`✅ Template selecionado: ${template.name} para ${businessType}`);
        return template;
      }
    }
  }
  
  // Se não encontrou match específico, retornar template corporativo como padrão
  console.log(`⚠️ Nenhum template específico encontrado para ${businessType}, usando Corporativo`);
  return corporateB2BTemplate;
}

// Função para obter descrição do template
export function getTemplateDescription(templateId: string): string {
  const template = landingPageTemplates.find(t => t.id === templateId);
  return template ? `${template.name}: ${template.description}` : '';
}
