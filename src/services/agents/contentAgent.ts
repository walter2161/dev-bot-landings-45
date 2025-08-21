
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

    const prompt = `Crie conteúdo profissional para uma landing page com as seguintes informações:

INFORMAÇÕES DA EMPRESA:
- Nome: ${businessName}
- Tipo: ${businessType}
- Descrição: ${description}
- Público-Alvo: ${targetAudience}
- Objetivo: ${mainGoal}
- Serviços: ${services}
- Ofertas: ${offers}
- WhatsApp: ${whatsapp}
- Endereço: ${address}

INSTRUÇÕES:
- Use o nome da empresa de forma natural nos textos
- Crie conteúdo personalizado e profissional
- Inclua ofertas especiais se disponíveis
- Use informações de contato reais

Retorne APENAS JSON válido estruturado com:
- title: nome exato da empresa
- subtitle: descrição específica
- heroText: chamada atrativa personalizada
- ctaText: CTA baseado no objetivo
- sections: array com 7 seções (intro, motivation, target, method, results, access, investment)
- contact: informações de contato estruturadas`;

    try {
      const response = await this.makeRequest(prompt);
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      
      throw new Error("Resposta inválida da API");
    } catch (error) {
      console.error("Erro ao gerar conteúdo:", error);
      
      // Fallback: retornar conteúdo padrão baseado nas instruções
      return this.generateFallbackContent(businessInstructions);
    }
  }

  private generateFallbackContent(businessInstructions: string): ContentStructure {
    const businessNameMatch = businessInstructions.match(/EMPRESA:\s*([^\n]+)/);
    const businessName = businessNameMatch?.[1]?.trim() || "Empresa";
    
    return {
      title: businessName,
      subtitle: `Soluções profissionais em ${businessName.toLowerCase()}`,
      heroText: `Descubra como ${businessName} pode transformar seus resultados`,
      ctaText: "Saiba mais",
      sections: [
        {
          id: "intro",
          title: "Sobre nosso trabalho",
          content: `Somos especialistas em ${businessName.toLowerCase()} e oferecemos soluções personalizadas para suas necessidades.`,
          type: "intro"
        },
        {
          id: "motivation",
          title: "Por que nos escolher",
          content: "Nossa experiência e dedicação garantem resultados excepcionais para nossos clientes.",
          type: "motivation"
        },
        {
          id: "target",
          title: "Para quem é ideal",
          content: "Atendemos pessoas e empresas que buscam qualidade e profissionalismo.",
          type: "target"
        },
        {
          id: "method",
          title: "Como trabalhamos",
          content: "Processo personalizado, atendimento próximo e resultados garantidos.",
          type: "method"
        },
        {
          id: "results",
          title: "Resultados comprovados",
          content: "Clientes satisfeitos e resultados que superam expectativas.",
          type: "results"
        },
        {
          id: "access",
          title: "Como nos encontrar",
          content: "Entre em contato conosco através dos canais disponíveis abaixo.",
          type: "access"
        },
        {
          id: "investment",
          title: "Investimento",
          content: "Valores justos e condições especiais para você.",
          type: "investment"
        }
      ],
      contact: {
        email: "contato@seunegocio.com",
        phone: "(11) 99999-9999",
        address: "São Paulo, SP",
        socialMedia: {
          whatsapp: "(11) 99999-9999",
          instagram: "@seunegocio",
          facebook: "facebook.com/seunegocio"
        }
      }
    };
  }
}

export const contentAgent = new ContentAgent();
