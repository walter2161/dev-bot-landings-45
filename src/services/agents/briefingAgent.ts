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
      // Extrair informações estruturadas do briefing
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
        businessName: cleanText(businessNameMatch?.[1]) || "Empresa",
        businessType: cleanText(businessTypeMatch?.[1]) || "Negócio",
        description: cleanText(descriptionMatch?.[1]) || "",
        targetAudience: cleanText(targetAudienceMatch?.[1]) || "",
        mainGoal: cleanText(mainGoalMatch?.[1]) || "",
        keyServices: cleanText(keyServicesMatch?.[1]) || "",
        contactInfo: {
          whatsapp: cleanText(whatsappMatch?.[1]) || "",
          address: cleanText(addressMatch?.[1]) || "",
          other: cleanText(otherContactMatch?.[1]) || ""
        },
        specialOffers: cleanText(specialOffersMatch?.[1]) || "",
        hasCustomLogo: logoMatch !== null,
        logoFileName: logoMatch?.[1]?.trim(),
        colorPalette: paletteMatch ? {
          primary: paletteMatch[1],
          secondary: paletteMatch[2],
          accent: paletteMatch[3]
        } : {
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