const MISTRAL_API_KEY = "aynCSftAcQBOlxmtmpJqVzco8K4aaTDQ";
const MISTRAL_API_URL = "https://api.mistral.ai/v1/chat/completions";

export interface ProcessedBriefing {
  businessName: string;
  businessType: string;
  description: string;
  targetAudience: string;
  mainGoal: string;
  keyServices: string;
  contactInfo: {
    whatsapp: string;
    address: string;
    other: string;
  };
  specialOffers: string;
  hasCustomLogo: boolean;
  logoFileName?: string;
  colorPalette: {
    primary: string;
    secondary: string;
    accent: string;
  };
  briefingPrompt: string;
  templateId?: string; // ID do template a ser usado
}

export class BriefingAgent {
  private async makeRequest(prompt: string): Promise<string> {
    try {
      const response = await fetch(MISTRAL_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${MISTRAL_API_KEY}`,
        },
        body: JSON.stringify({
          model: "mistral-large-latest",
          messages: [{ role: "user", content: prompt }],
          temperature: 0.3,
          max_tokens: 1000,
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      console.error("Erro na API de Briefing:", error);
      throw error;
    }
  }

  async processBriefing(rawBriefing: string): Promise<ProcessedBriefing> {
    try {
      const { selectTemplateForBusiness } = await import('./landingPageTemplates');
      
      // Primeiro, tentar extrair informações estruturadas do briefing
      const businessNameMatch = rawBriefing.match(/Nome da Empresa:\s*([^\n]+)/);
      const businessTypeMatch = rawBriefing.match(/Tipo de Negócio:\s*([^\n]+)/);
      const descriptionMatch = rawBriefing.match(/Descrição:\s*([^\n]+)/);
      const targetAudienceMatch = rawBriefing.match(/Público-Alvo:\s*([^\n]+)/);
      const mainGoalMatch = rawBriefing.match(/Objetivo Principal:\s*([^\n]+)/);
      const keyServicesMatch = rawBriefing.match(/Serviços\/Produtos:\s*([^\n]+)/);
      const whatsappMatch = rawBriefing.match(/WhatsApp:\s*([^\n]+)/);
      const addressMatch = rawBriefing.match(/Endereço:\s*([^\n]+)/);
      const otherContactMatch = rawBriefing.match(/Outras Informações:\s*([^\n]+)/);
      const specialOffersMatch = rawBriefing.match(/Ofertas Especiais:\s*([^\n]+)/);
      const logoMatch = rawBriefing.match(/IMPORTANTE:.*?logo personalizado\s*\(([^)]+)\)/);
      const paletteMatch = rawBriefing.match(/PALETA DE CORES OBRIGATÓRIA:.*?Primária:\s*(#[A-Fa-f0-9]{6}).*?Secundária:\s*(#[A-Fa-f0-9]{6}).*?Destaque:\s*(#[A-Fa-f0-9]{6})/);

      // Se não encontrou dados estruturados, processar como pedido simples
      let inferredData = null;
      if (!businessNameMatch && !businessTypeMatch) {
        inferredData = await this.inferBusinessDataFromText(rawBriefing);
      }

      // Função para limpar marcações das instruções
      const cleanText = (text: string) => {
        if (!text) return text;
        return text
          .replace(/\(USE EXATAMENTE.*?\)/gi, '')
          .replace(/\(OBRIGATÓRIO.*?\)/gi, '')
          .replace(/\(IMPORTANTE.*?\)/gi, '')
          .trim();
      };

      const businessType = cleanText(businessTypeMatch?.[1]) || inferredData?.businessType || "Negócio";
      const selectedTemplate = selectTemplateForBusiness(businessType);
      
      const processedBriefing: ProcessedBriefing = {
        businessName: cleanText(businessNameMatch?.[1]) || inferredData?.businessName || "Empresa",
        businessType,
        description: cleanText(descriptionMatch?.[1]) || inferredData?.description || "",
        targetAudience: cleanText(targetAudienceMatch?.[1]) || inferredData?.targetAudience || "",
        mainGoal: cleanText(mainGoalMatch?.[1]) || inferredData?.mainGoal || "",
        keyServices: cleanText(keyServicesMatch?.[1]) || inferredData?.keyServices || "",
        contactInfo: {
          whatsapp: cleanText(whatsappMatch?.[1]) || "",
          address: cleanText(addressMatch?.[1]) || "",
          other: cleanText(otherContactMatch?.[1]) || ""
        },
        specialOffers: cleanText(specialOffersMatch?.[1]) || inferredData?.specialOffers || "",
        hasCustomLogo: logoMatch !== null,
        logoFileName: logoMatch?.[1]?.trim(),
        colorPalette: paletteMatch ? {
          primary: paletteMatch[1],
          secondary: paletteMatch[2],
          accent: paletteMatch[3]
        } : inferredData?.colorPalette || {
          primary: "#2563eb",
          secondary: "#1e40af",
          accent: "#f59e0b"
        },
        briefingPrompt: rawBriefing,
        templateId: selectedTemplate.id
      };

      console.log('📋 Briefing processado:', processedBriefing);
      return processedBriefing;

    } catch (error) {
      console.error("Erro ao processar briefing:", error);
      
      // Fallback com dados básicos
      return {
        businessName: "Empresa",
        businessType: "Negócio",
        description: "",
        targetAudience: "",
        mainGoal: "",
        keyServices: "",
        contactInfo: {
          whatsapp: "",
          address: "",
          other: ""
        },
        specialOffers: "",
        hasCustomLogo: false,
        colorPalette: {
          primary: "#2563eb",
          secondary: "#1e40af",
          accent: "#f59e0b"
        },
        briefingPrompt: rawBriefing
      };
    }
  }

  private async inferBusinessDataFromText(text: string): Promise<{
    businessName: string;
    businessType: string;
    description: string;
    targetAudience: string;
    mainGoal: string;
    keyServices: string;
    specialOffers: string;
    colorPalette: { primary: string; secondary: string; accent: string };
  }> {
    try {
      const prompt = `Analise este pedido de negócio e retorne APENAS um JSON válido com as informações específicas:

Pedido: "${text}"

Retorne no formato JSON:
{
  "businessName": "Nome específico baseado no pedido",
  "businessType": "Tipo de negócio específico",
  "description": "Descrição única do negócio",
  "targetAudience": "Público-alvo específico",
  "mainGoal": "Objetivo principal específico",
  "keyServices": "Serviços específicos oferecidos",
  "specialOffers": "Oferta promocional específica",
  "colorPalette": {
    "primary": "cor hex apropriada",
    "secondary": "cor hex complementar", 
    "accent": "cor hex de destaque"
  }
}

IMPORTANTE: Seja específico e único para cada negócio. Evite termos genéricos.`;

      const response = await this.makeRequest(prompt);
      // Remove markdown e sanitiza caracteres de controle inválidos
      let cleanedResponse = response.replace(/```json|```/g, '').trim();
      // Remove quebras de linha e tabs dentro de strings JSON
      cleanedResponse = cleanedResponse.replace(/[\n\r\t]/g, ' ');
      // Remove espaços múltiplos
      cleanedResponse = cleanedResponse.replace(/\s+/g, ' ');
      
      const parsedData = JSON.parse(cleanedResponse);
      
      return parsedData;
    } catch (error) {
      console.error('Erro ao gerar dados via IA, usando fallback:', error);
      return this.getFallbackBusinessData(text);
    }
  }

  private getFallbackBusinessData(text: string): {
    businessName: string;
    businessType: string;
    description: string;
    targetAudience: string;
    mainGoal: string;
    keyServices: string;
    specialOffers: string;
    colorPalette: { primary: string; secondary: string; accent: string };
  } {
    const lowerText = text.toLowerCase();
    
    // Mapear palavras-chave para tipos de negócio (expandido)
    const businessTypeMap: { [key: string]: { type: string; services: string; target: string; goal: string; offers: string; colors: { primary: string; secondary: string; accent: string } } } = {
      'drone': {
        type: 'Empresa de Drones',
        services: 'Filmagem aérea, inspeção industrial, mapeamento, eventos, monitoramento',
        target: 'Empresas de eventos, construtoras, produtoras, setor agrícola',
        goal: 'Oferecer soluções inovadoras em tecnologia de drones',
        offers: 'Primeira filmagem com 30% de desconto!',
        colors: { primary: '#0ea5e9', secondary: '#0284c7', accent: '#f59e0b' }
      },
      'tatuagem': {
        type: 'Estúdio de Tatuagem',
        services: 'Tatuagens artísticas, piercings, desenhos personalizados, restauração',
        target: 'Jovens adultos, entusiastas de arte corporal, pessoas expressivas',
        goal: 'Criar arte corporal única e significativa',
        offers: 'Consulta gratuita + desconto na primeira tattoo!',
        colors: { primary: '#dc2626', secondary: '#991b1b', accent: '#fbbf24' }
      },
      'vegan': {
        type: 'Loja Vegana',
        services: 'Produtos veganos, orgânicos, suplementos naturais, cosméticos',
        target: 'Veganos, vegetarianos, pessoas conscientes da sustentabilidade',
        goal: 'Promover um estilo de vida sustentável e saudável',
        offers: 'Kit iniciante vegano com 25% de desconto!',
        colors: { primary: '#16a34a', secondary: '#15803d', accent: '#84cc16' }
      },
      'dança': {
        type: 'Escola de Dança',
        services: 'Aulas de street dance, hip hop, breaking, coreografias, workshops',
        target: 'Jovens, adolescentes, amantes de cultura urbana',
        goal: 'Desenvolver talento e expressão através da dança urbana',
        offers: 'Primeira aula grátis + desconto no pacote mensal!',
        colors: { primary: '#7c3aed', secondary: '#5b21b6', accent: '#f59e0b' }
      },
      'sustentabilidade': {
        type: 'Consultoria em Sustentabilidade',
        services: 'Consultoria ambiental, certificações, auditorias, projetos sustentáveis',
        target: 'Empresas, indústrias, organizações que buscam sustentabilidade',
        goal: 'Transformar negócios em modelos sustentáveis e rentáveis',
        offers: 'Diagnóstico gratuito de sustentabilidade empresarial!',
        colors: { primary: '#059669', secondary: '#047857', accent: '#10b981' }
      },
      'pet shop': {
        type: 'Pet Shop',
        services: 'Banho e tosa, produtos para pets, ração, acessórios, medicamentos veterinários',
        target: 'Donos de animais de estimação, famílias com pets',
        goal: 'Oferecer produtos e serviços de qualidade para o bem-estar dos pets',
        offers: 'Banho e tosa com 20% de desconto na primeira visita!',
        colors: { primary: '#4f46e5', secondary: '#06b6d4', accent: '#f59e0b' }
      },
      'restaurante': {
        type: 'Restaurante',
        services: 'Pratos tradicionais, delivery, eventos, buffet, cardápio especial',
        target: 'Famílias, casais, grupos de amigos, empresários',
        goal: 'Proporcionar experiência gastronômica única e memorável',
        offers: 'Segunda-feira: Desconto especial de 15% no jantar!',
        colors: { primary: '#dc2626', secondary: '#ea580c', accent: '#facc15' }
      },
      'academia': {
        type: 'Academia',
        services: 'Musculação, aeróbicos, personal trainer, avaliação física',
        target: 'Pessoas que buscam saúde, condicionamento físico e bem-estar',
        goal: 'Transformar vidas através do exercício e hábitos saudáveis',
        offers: 'Matrícula gratuita + 1 mês de personal trainer incluso!',
        colors: { primary: '#dc2626', secondary: '#ea580c', accent: '#facc15' }
      },
      'salão': {
        type: 'Salão de Beleza',
        services: 'Corte, coloração, tratamentos capilares, manicure, pedicure, design de sobrancelhas',
        target: 'Mulheres e homens que buscam cuidados com beleza e bem-estar',
        goal: 'Realçar a beleza natural de cada cliente com atendimento de excelência',
        offers: 'Pacote completo: Corte + Escova + Manicure com preço especial!',
        colors: { primary: '#be185d', secondary: '#c2410c', accent: '#7c3aed' }
      }
    };

    // Encontrar o tipo de negócio baseado nas palavras-chave
    let matchedBusiness = null;
    for (const [keyword, businessData] of Object.entries(businessTypeMap)) {
      if (lowerText.includes(keyword)) {
        matchedBusiness = businessData;
        break;
      }
    }

    // Se não encontrou match específico, usar dados genéricos únicos
    if (!matchedBusiness) {
      const randomColors = [
        { primary: '#2563eb', secondary: '#1e40af', accent: '#f59e0b' },
        { primary: '#dc2626', secondary: '#b91c1c', accent: '#16a34a' },
        { primary: '#7c3aed', secondary: '#6d28d9', accent: '#f59e0b' },
        { primary: '#059669', secondary: '#047857', accent: '#0ea5e9' },
        { primary: '#ea580c', secondary: '#c2410c', accent: '#7c3aed' }
      ];
      
      const hash = this.createSimpleHash(text);
      const colorIndex = hash % randomColors.length;
      
      matchedBusiness = {
        type: 'Negócio Especializado',
        services: `Serviços profissionais relacionados a ${text}`,
        target: 'Clientes que buscam soluções especializadas',
        goal: 'Oferecer excelência e inovação no atendimento',
        offers: 'Condições especiais para novos clientes!',
        colors: randomColors[colorIndex]
      };
    }

    // Tentar extrair nome da empresa do texto
    let businessName = matchedBusiness.type;
    const words = text.split(' ').filter(word => word.length > 2);
    if (words.length > 0) {
      businessName = words.slice(0, 2).join(' ');
    }

    return {
      businessName,
      businessType: matchedBusiness.type,
      description: `${businessName} - ${matchedBusiness.type} com foco em qualidade e atendimento excepcional`,
      targetAudience: matchedBusiness.target,
      mainGoal: matchedBusiness.goal,
      keyServices: matchedBusiness.services,
      specialOffers: matchedBusiness.offers,
      colorPalette: matchedBusiness.colors
    };
  }

  private createSimpleHash(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash);
  }

  generateInstructionsForAgent(briefing: ProcessedBriefing, agentType: 'content' | 'design' | 'seo' | 'copy' | 'image'): string {
    const baseInfo = `
EMPRESA: ${briefing.businessName}
TIPO: ${briefing.businessType}
DESCRIÇÃO: ${briefing.description}
PÚBLICO-ALVO: ${briefing.targetAudience}
OBJETIVO: ${briefing.mainGoal}
SERVIÇOS: ${briefing.keyServices}
CONTATO: WhatsApp ${briefing.contactInfo.whatsapp}, Endereço: ${briefing.contactInfo.address}
OFERTAS: ${briefing.specialOffers}
`;

      const logoInfo = briefing.hasCustomLogo 
        ? `LOGO: Logo personalizado fornecido (${briefing.logoFileName})`
        : `LOGO: Criar logo profissional para ${briefing.businessName}`;

      const colorInfo = `CORES: Primary: ${briefing.colorPalette.primary}, Secondary: ${briefing.colorPalette.secondary}, Accent: ${briefing.colorPalette.accent}`;

    switch (agentType) {
      case 'content':
        return `${baseInfo}
${logoInfo}
${colorInfo}

DIRETRIZES PARA CONTEÚDO:
- Empresa: ${briefing.businessName}
- Tipo: ${briefing.businessType}
- Ofertas: ${briefing.specialOffers}
- Contato: ${briefing.contactInfo.whatsapp}, ${briefing.contactInfo.address}
- Objetivo: ${briefing.mainGoal}
- Serviços: ${briefing.keyServices}
- Público: ${briefing.targetAudience}`;

      case 'design':
        return `${baseInfo}
${logoInfo}
${colorInfo}

INSTRUÇÕES PARA DESIGN:
- Aplicar cores: ${briefing.colorPalette.primary}, ${briefing.colorPalette.secondary}, ${briefing.colorPalette.accent}
- ${briefing.hasCustomLogo ? 'Usar logo personalizado fornecido' : 'Criar logo apropriado'}
- Design para tipo de negócio: ${briefing.businessType}`;

      case 'image':
        return `${baseInfo}
${logoInfo}
${colorInfo}

INSTRUÇÕES PARA IMAGENS:
- ${briefing.hasCustomLogo ? `Logo: Logo personalizado da empresa ${briefing.businessName} (fornecido pelo cliente)` : `Logo: Logo profissional moderno para ${briefing.businessName}`}
- Todas as imagens devem ser relacionadas ao tipo de negócio: ${briefing.businessType}
- Refletir o público-alvo: ${briefing.targetAudience}
- Mostrar os serviços/produtos: ${briefing.keyServices}`;

      case 'seo':
        return `${baseInfo}
${colorInfo}

INSTRUÇÕES PARA SEO:
- Title e meta description devem incluir "${briefing.businessName}"
- Keywords relacionadas a: ${briefing.businessType}
- Foco no público-alvo: ${briefing.targetAudience}
- Incluir localização se disponível: ${briefing.contactInfo.address}`;

      case 'copy':
        return `${baseInfo}
${colorInfo}

INSTRUÇÕES PARA COPY:
- Usar o nome "${briefing.businessName}" consistentemente
- Copy persuasivo focado no objetivo: ${briefing.mainGoal}
- Destacar ofertas especiais: ${briefing.specialOffers}
- Linguagem adequada ao público: ${briefing.targetAudience}
- Enfatizar serviços/produtos: ${briefing.keyServices}`;

      default:
        return baseInfo;
    }
  }
}

export const briefingAgent = new BriefingAgent();