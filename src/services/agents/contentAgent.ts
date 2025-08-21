
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
        throw new Error(`API error: ${response.statusText}`);
      }

      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      console.error("Erro na API:", error);
      throw error;
    }
  }

  async generateContent(userRequest: string): Promise<ContentStructure> {
    const prompt = `Crie conteúdo específico para: "${userRequest}"

Retorne APENAS um JSON com esta estrutura:
{
  "title": "Nome específico do negócio",
  "subtitle": "Descrição do que oferece",
  "heroText": "Chamada principal atrativa",
  "ctaText": "Ação específica (Comprar, Agendar, etc.)",
  "sections": [
    {"id": "intro", "title": "Apresentação", "content": "Texto introdutório", "type": "intro"},
    {"id": "motivation", "title": "Por que escolher", "content": "Diferenciais", "type": "motivation"},
    {"id": "target", "title": "Para quem", "content": "Público-alvo", "type": "target"},
    {"id": "method", "title": "Como funciona", "content": "Processo", "type": "method"},
    {"id": "results", "title": "Resultados", "content": "Benefícios", "type": "results"},
    {"id": "access", "title": "Como encontrar", "content": "Localização/acesso", "type": "access"},
    {"id": "investment", "title": "Preços", "content": "Investimento", "type": "investment"}
  ],
  "contact": {
    "email": "email@negocio.com",
    "phone": "(XX) XXXXX-XXXX",
    "address": "Endereço completo",
    "socialMedia": {
      "whatsapp": "(XX) 9XXXX-XXXX",
      "instagram": "@perfil",
      "facebook": "facebook.com/pagina"
    }
  }
}`;

    try {
      const response = await this.makeRequest(prompt);
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      
      throw new Error("Resposta inválida");
    } catch (error) {
      console.error("Erro ao gerar conteúdo:", error);
      throw error;
    }
  }
}

export const contentAgent = new ContentAgent();
