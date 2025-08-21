
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

  async generateContent(userRequest: string): Promise<ContentStructure> {
    // Extrair informações específicas do briefing
    const businessNameMatch = userRequest.match(/Nome da Empresa:\s*([^\n]+)/);
    const businessTypeMatch = userRequest.match(/Tipo de Negócio:\s*([^\n]+)/);
    const descriptionMatch = userRequest.match(/Descrição:\s*([^\n]+)/);
    const targetAudienceMatch = userRequest.match(/Público-Alvo:\s*([^\n]+)/);
    const mainGoalMatch = userRequest.match(/Objetivo Principal:\s*([^\n]+)/);
    const servicesMatch = userRequest.match(/Serviços\/Produtos:\s*([^\n]+)/);
    const whatsappMatch = userRequest.match(/WhatsApp:\s*([^\n]+)/);
    const addressMatch = userRequest.match(/Endereço:\s*([^\n]+)/);
    const contactMatch = userRequest.match(/Outras Informações:\s*([^\n]+)/);
    const offersMatch = userRequest.match(/Ofertas Especiais:\s*([^\n]+)/);

    const businessName = businessNameMatch?.[1]?.trim() || "Seu Negócio";
    const businessType = businessTypeMatch?.[1]?.trim() || "nosso negócio";
    const description = descriptionMatch?.[1]?.trim() || "";
    const targetAudience = targetAudienceMatch?.[1]?.trim() || "";
    const mainGoal = mainGoalMatch?.[1]?.trim() || "";
    const services = servicesMatch?.[1]?.trim() || "";
    const whatsapp = whatsappMatch?.[1]?.trim() || "(11) 99999-9999";
    const address = addressMatch?.[1]?.trim() || "São Paulo, SP";
    const contactInfo = contactMatch?.[1]?.trim() || "";
    const offers = offersMatch?.[1]?.trim() || "";

    const prompt = `Crie conteúdo ESPECÍFICO e PERSONALIZADO para o briefing: "${userRequest}"

INSTRUÇÕES CRÍTICAS:
- Use EXATAMENTE o nome "${businessName}" (não "Seu Negócio" ou genéricos)
- Personalize TODO o conteúdo baseado nas informações fornecidas
- Use as informações de contato EXATAS fornecidas
- Incorpore as ofertas especiais se fornecidas
- Adapte linguagem ao público-alvo informado
- Foque no objetivo principal mencionado

Retorne APENAS um JSON com esta estrutura:
{
  "title": "${businessName}",
  "subtitle": "Descrição específica baseada em: ${description}",
  "heroText": "Chamada atrativa personalizada para ${businessType}",
  "ctaText": "CTA específico baseado no objetivo: ${mainGoal}",
  "sections": [
    {"id": "intro", "title": "Sobre a ${businessName}", "content": "Apresentação personalizada baseada na descrição fornecida", "type": "intro"},
    {"id": "motivation", "title": "Por que escolher a ${businessName}", "content": "Diferenciais específicos do negócio", "type": "motivation"},
    {"id": "target", "title": "Para quem é ideal", "content": "Baseado no público-alvo: ${targetAudience}", "type": "target"},
    {"id": "method", "title": "Como trabalhamos", "content": "Processo específico do tipo de negócio", "type": "method"},
    {"id": "results", "title": "Resultados", "content": "Benefícios específicos dos serviços oferecidos", "type": "results"},
    {"id": "access", "title": "Como nos encontrar", "content": "Informações de localização e acesso", "type": "access"},
    {"id": "investment", "title": "Nossos Preços", "content": "Informações sobre preços ${offers ? 'incluindo ofertas especiais: ' + offers : ''}", "type": "investment"}
  ],
  "contact": {
    "email": "${contactInfo.includes('@') ? contactInfo.split(' ')[0] : 'contato@' + businessName.toLowerCase().replace(/\s+/g, '') + '.com'}",
    "phone": "${contactInfo.includes('(') ? contactInfo.match(/\([0-9]{2}\)\s?[0-9-]+/)?.[0] || '(11) 3333-3333' : '(11) 3333-3333'}",
    "address": "${address}",
    "socialMedia": {
      "whatsapp": "${whatsapp}",
      "instagram": "@${businessName.toLowerCase().replace(/\s+/g, '')}",
      "facebook": "facebook.com/${businessName.toLowerCase().replace(/\s+/g, '')}"
    }
  }
}`;

    try {
      const response = await this.makeRequest(prompt);
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      
      throw new Error("Resposta inválida da API");
    } catch (error) {
      console.error("Erro ao gerar conteúdo:", error);
      
      // Fallback: retornar conteúdo padrão baseado na solicitação
      return this.generateFallbackContent(userRequest);
    }
  }

  private generateFallbackContent(userRequest: string): ContentStructure {
    const businessName = userRequest.length > 50 ? "Seu Negócio" : userRequest;
    
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
