
const MISTRAL_API_KEY = "aynCSftAcQBOlxmtmpJqVzco8K4aaTDQ";
const MISTRAL_API_URL = "https://api.mistral.ai/v1/chat/completions";

export interface ContentStructure {
  title: string;
  subtitle: string;
  heroText: string;
  ctaText: string;
  sections: ContentSection[];
  contact: ContactInfo;
}

export interface ContentSection {
  id: string;
  title: string;
  content: string;
  type: "intro" | "motivation" | "target" | "method" | "results" | "access" | "investment";
}

export interface ContactInfo {
  email: string;
  phone: string;
  address: string;
  socialMedia: {
    facebook?: string;
    instagram?: string;
    linkedin?: string;
    whatsapp?: string;
  };
}

export class ContentAgent {
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
          temperature: 0.7,
          max_tokens: 1500,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`API error ${response.status}:`, errorText);
        throw new Error(`API error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      console.error("Erro na API:", error);
      throw error;
    }
  }

  async generateContent(businessInstructions: string): Promise<ContentStructure> {
    // Extrair informações específicas das instruções processadas
    const businessNameMatch = businessInstructions.match(/EMPRESA:\s*([^\n]+)/);
    const businessTypeMatch = businessInstructions.match(/TIPO:\s*([^\n]+)/);
    const descriptionMatch = businessInstructions.match(/DESCRIÇÃO:\s*([^\n]+)/);
    const targetAudienceMatch = businessInstructions.match(/PÚBLICO-ALVO:\s*([^\n]+)/);
    const mainGoalMatch = businessInstructions.match(/OBJETIVO:\s*([^\n]+)/);
    const servicesMatch = businessInstructions.match(/SERVIÇOS:\s*([^\n]+)/);
    const contactMatch = businessInstructions.match(/CONTATO:\s*([^\n]+)/);
    const offersMatch = businessInstructions.match(/OFERTAS:\s*([^\n]+)/);

    const businessName = businessNameMatch?.[1]?.trim() || "Empresa";  
    const businessType = businessTypeMatch?.[1]?.trim() || "negócio";
    const description = descriptionMatch?.[1]?.trim() || "";
    const targetAudience = targetAudienceMatch?.[1]?.trim() || "";
    const mainGoal = mainGoalMatch?.[1]?.trim() || "";
    const services = servicesMatch?.[1]?.trim() || "";
    const contactInfo = contactMatch?.[1]?.trim() || "";
    const offers = offersMatch?.[1]?.trim() || "";

    // Extrair informações de contato
    const whatsappMatch = contactInfo.match(/WhatsApp\s*([^\s,]+)/);
    const addressMatch = contactInfo.match(/Endereço:\s*([^,\n]+)/);
    
    const whatsapp = whatsappMatch?.[1] || "(11) 99999-9999";
    const address = addressMatch?.[1]?.trim() || "São Paulo, SP";

    const prompt = `Você é um especialista em criar conteúdo para landing pages. Crie conteúdo profissional e persuasivo para uma empresa chamada "${businessName}".

INFORMAÇÕES PARA APLICAR NO CONTEÚDO:
- Empresa: ${businessName} (${businessType})
- Descrição: ${description}
- Público-Alvo: ${targetAudience}
- Objetivo Principal: ${mainGoal}
- Serviços/Produtos: ${services}
- Ofertas Especiais: ${offers}
- WhatsApp: ${whatsapp}
- Endereço: ${address}

REGRAS: 
- Crie textos completamente naturais e profissionais
- Use o nome "${businessName}" naturalmente nos textos
- Integre ofertas especiais de forma persuasiva no conteúdo

Crie conteúdo estruturado para a landing page.`;

    try {
      // Sempre retorna fallback direto sem parsing de JSON
      return this.generateFallbackContent(businessInstructions);
    } catch (error) {
      console.error("Erro ao gerar conteúdo:", error);
      return this.generateFallbackContent(businessInstructions);
    }
  }

  private generateFallbackContent(businessInstructions: string): ContentStructure {
    const businessNameMatch = businessInstructions.match(/EMPRESA:\s*([^\n]+)/);
    const businessTypeMatch = businessInstructions.match(/TIPO:\s*([^\n]+)/);
    const descriptionMatch = businessInstructions.match(/DESCRIÇÃO:\s*([^\n]+)/);
    const servicesMatch = businessInstructions.match(/SERVIÇOS:\s*([^\n]+)/);
    const offersMatch = businessInstructions.match(/OFERTAS:\s*([^\n]+)/);
    const contactMatch = businessInstructions.match(/CONTATO:\s*([^\n]+)/);
    
    const businessName = businessNameMatch?.[1]?.trim() || "Empresa";
    const businessType = businessTypeMatch?.[1]?.trim() || "negócio";
    const description = descriptionMatch?.[1]?.trim() || "";
    const services = servicesMatch?.[1]?.trim() || "";
    const offers = offersMatch?.[1]?.trim() || "";
    const contactInfo = contactMatch?.[1]?.trim() || "";
    
    // Extrair informações de contato
    const whatsappMatch = contactInfo.match(/WhatsApp\s*([^\s,]+)/);
    const addressMatch = contactInfo.match(/Endereço:\s*([^,\n]+)/);
    const emailMatch = contactInfo.match(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/);
    const phoneMatch = contactInfo.match(/\([0-9]{2}\)\s?[0-9-]+/);
    
    const whatsapp = whatsappMatch?.[1] || "(11) 99999-9999";
    const address = addressMatch?.[1]?.trim() || "São Paulo, SP";
    const email = emailMatch?.[1] || `contato@${businessName.toLowerCase().replace(/\s+/g, '')}.com`;
    const phone = phoneMatch?.[0] || "(11) 99999-9999";
    
    const specialOffers = offers ? ` ${offers}` : '';
    const mainServices = services ? ` Especializados em ${services}.` : '';
    
    return {
      title: businessName,
      subtitle: `${description || `Soluções profissionais em ${businessType.toLowerCase()}`}${specialOffers}`,
      heroText: `${businessName} - Sua melhor escolha em ${businessType.toLowerCase()}!${specialOffers}${mainServices}`,
      ctaText: "Entre em Contato",
      sections: [
        {
          id: "intro",
          title: `Conheça ${businessName}`,
          content: `${businessName} é especializada em ${businessType.toLowerCase()} e oferece soluções personalizadas${services ? ` em ${services}` : ''}. ${description}${offers ? ` Aproveite: ${offers}` : ''}`,
          type: "intro"
        },
        {
          id: "motivation",
          title: "Por que escolher nossos serviços",
          content: `Nossa experiência e dedicação em ${businessType.toLowerCase()} garantem resultados excepcionais. ${businessName} se destaca pela qualidade${services ? ` em ${services}` : ''} e atendimento personalizado.`,
          type: "motivation"
        },
        {
          id: "target",
          title: "Ideal para você",
          content: `${businessName} atende pessoas e empresas que buscam qualidade e profissionalismo em ${businessType.toLowerCase()}.${services ? ` Especialmente para quem precisa de ${services}.` : ''}`,
          type: "target"
        },
        {
          id: "method",
          title: "Nossa metodologia",
          content: `${businessName} trabalha com processo personalizado, atendimento próximo e resultados garantidos em ${businessType.toLowerCase()}.${services ? ` Nossa especialidade em ${services} garante eficiência.` : ''}`,
          type: "method"
        },
        {
          id: "results",
          title: "Resultados que entregamos",
          content: `Clientes da ${businessName} ficam satisfeitos com nossos resultados em ${businessType.toLowerCase()}. Superamos expectativas${services ? ` especialmente em ${services}` : ''}.`,
          type: "results"
        },
        {
          id: "access",
          title: "Como nos encontrar",
          content: `${businessName} está localizada em ${address}. Entre em contato pelo WhatsApp ${whatsapp} ou telefone ${phone} para mais informações sobre nossos serviços.`,
          type: "access"
        },
        {
          id: "investment",
          title: "Valores justos",
          content: `${businessName} oferece valores justos e condições especiais para você. Entre em contato para orçamento personalizado${offers ? `. ${offers}` : ''}.`,
          type: "investment"
        }
      ],
      contact: {
        email: email,
        phone: phone,
        address: address,
        socialMedia: {
          whatsapp: whatsapp,
          instagram: `@${businessName.toLowerCase().replace(/\s+/g, '')}`,
          facebook: `facebook.com/${businessName.toLowerCase().replace(/\s+/g, '')}`
        }
      }
    };
  }
}

export const contentAgent = new ContentAgent();
