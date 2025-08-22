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
        inferredData = this.inferBusinessDataFromText(rawBriefing);
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

      const processedBriefing: ProcessedBriefing = {
        businessName: cleanText(businessNameMatch?.[1]) || inferredData?.businessName || "Empresa",
        businessType: cleanText(businessTypeMatch?.[1]) || inferredData?.businessType || "Negócio",
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
        briefingPrompt: rawBriefing
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

  private inferBusinessDataFromText(text: string): {
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
    
    // Mapear palavras-chave para tipos de negócio
    const businessTypeMap: { [key: string]: { type: string; services: string; target: string; goal: string; offers: string; colors: { primary: string; secondary: string; accent: string } } } = {
      'pet shop': {
        type: 'Pet Shop',
        services: 'Banho e tosa, produtos para pets, ração, acessórios, medicamentos veterinários, brinquedos para animais',
        target: 'Donos de animais de estimação, famílias com pets, pessoas que amam animais',
        goal: 'Oferecer produtos e serviços de qualidade para o bem-estar dos pets',
        offers: 'Promoção especial: Banho e tosa com 20% de desconto na primeira visita!',
        colors: { primary: '#4f46e5', secondary: '#06b6d4', accent: '#f59e0b' }
      },
      'petshop': {
        type: 'Pet Shop',
        services: 'Banho e tosa, produtos para pets, ração, acessórios, medicamentos veterinários, brinquedos para animais',
        target: 'Donos de animais de estimação, famílias com pets, pessoas que amam animais',
        goal: 'Oferecer produtos e serviços de qualidade para o bem-estar dos pets',
        offers: 'Promoção especial: Banho e tosa com 20% de desconto na primeira visita!',
        colors: { primary: '#4f46e5', secondary: '#06b6d4', accent: '#f59e0b' }
      },
      'restaurante': {
        type: 'Restaurante',
        services: 'Pratos tradicionais, delivery, eventos, buffet, cardápio especial',
        target: 'Famílias, casais, grupos de amigos, empresários',
        goal: 'Proporcionar experiência gastronômica única e memorável',
        offers: '2ª feira: Desconto especial de 15% no jantar!',
        colors: { primary: '#dc2626', secondary: '#ea580c', accent: '#facc15' }
      },
      'loja': {
        type: 'Loja de Variedades',
        services: 'Produtos diversos, atendimento personalizado, entrega rápida',
        target: 'Público geral, moradores da região, pessoas em busca de conveniência',
        goal: 'Ser a loja de referência da região com os melhores produtos',
        offers: 'Desconto progressivo: Quanto mais comprar, mais economiza!',
        colors: { primary: '#059669', secondary: '#0d9488', accent: '#f59e0b' }
      },
      'salão': {
        type: 'Salão de Beleza',
        services: 'Corte, coloração, tratamentos capilares, manicure, pedicure, design de sobrancelhas',
        target: 'Mulheres e homens que buscam cuidados com beleza e bem-estar',
        goal: 'Realçar a beleza natural de cada cliente com atendimento de excelência',
        offers: 'Pacote completo: Corte + Escova + Manicure com preço especial!',
        colors: { primary: '#be185d', secondary: '#c2410c', accent: '#7c3aed' }
      },
      'academia': {
        type: 'Academia',
        services: 'Musculação, aeróbicos, personal trainer, avaliação física',
        target: 'Pessoas que buscam saúde, condicionamento físico e bem-estar',
        goal: 'Transformar vidas através do exercício e hábitos saudáveis',
        offers: 'Matrícula gratuita + 1 mês de personal trainer incluso!',
        colors: { primary: '#dc2626', secondary: '#ea580c', accent: '#facc15' }
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

    // Se não encontrou match específico, usar dados genéricos baseados no texto
    if (!matchedBusiness) {
      matchedBusiness = {
        type: 'Empresa',
        services: 'Serviços profissionais de qualidade',
        target: 'Clientes em busca de excelência',
        goal: 'Oferecer soluções eficazes e atendimento diferenciado',
        offers: 'Condições especiais para novos clientes!',
        colors: { primary: '#2563eb', secondary: '#1e40af', accent: '#f59e0b' }
      };
    }

    // Tentar extrair nome da empresa do texto
    let businessName = matchedBusiness.type;
    const nameMatches = text.match(/(\w+\s*){1,3}(?=\s|$)/);
    if (nameMatches && nameMatches[0].length > 2) {
      businessName = nameMatches[0].trim();
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