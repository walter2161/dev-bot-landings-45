
const MISTRAL_API_KEY = "aynCSftAcQBOlxmtmpJqVzco8K4aaTDQ";
const MISTRAL_API_URL = "https://api.mistral.ai/v1/chat/completions";

export interface DesignStructure {
  colors: ColorScheme;
  images: ImageDescriptions;
  fonts: FontScheme;
}

export interface ColorScheme {
  primary: string;
  secondary: string;
  accent: string;
}

export interface ImageDescriptions {
  logo: string;
  hero: string;
  motivation: string;
  target: string;
  method: string;
  results: string;
  access: string;
  investment: string;
}

export interface FontScheme {
  heading: string;
  body: string;
  accent: string;
}

export class DesignAgent {
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
          temperature: 0.6,
          max_tokens: 1000,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Design API error ${response.status}:`, errorText);
        throw new Error(`API error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      console.error("Erro na API de Design:", error);
      throw error;
    }
  }

  async generateDesign(businessType: string, title: string): Promise<DesignStructure> {
    const prompt = `Crie design para: "${businessType} - ${title}"

Retorne APENAS JSON:
{
  "colors": {
    "primary": "#cor_hex_principal",
    "secondary": "#cor_hex_secundaria", 
    "accent": "#cor_hex_destaque"
  },
  "images": {
    "logo": "logotipo moderno da empresa ${title}",
    "hero": "foto profissional de ${businessType}",
    "motivation": "imagem dos benefícios de ${businessType}",
    "target": "foto do público-alvo de ${businessType}",
    "method": "imagem do processo de ${businessType}",
    "results": "foto dos resultados de ${businessType}",
    "access": "imagem de localização/contato",
    "investment": "imagem relacionada a preços"
  },
  "fonts": {
    "heading": "fonte para títulos",
    "body": "fonte para texto corpo",
    "accent": "fonte para destaques"
  }
}`;

    try {
      const response = await this.makeRequest(prompt);
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      
      throw new Error("Resposta inválida da API de Design");
    } catch (error) {
      console.error("Erro ao gerar design:", error);
      
      // Fallback: retornar design padrão
      return this.generateFallbackDesign(businessType, title);
    }
  }

  private generateFallbackDesign(businessType: string, title: string): DesignStructure {
    return {
      colors: {
        primary: "#2563eb",
        secondary: "#1e40af", 
        accent: "#f59e0b"
      },
      images: {
        logo: `Logo profissional para ${title}`,
        hero: `Imagem de destaque para ${businessType}`,
        motivation: "Imagem representando qualidade e confiança",
        target: "Imagem do público-alvo",
        method: "Imagem do processo de trabalho",
        results: "Imagem de resultados positivos",
        access: "Imagem de localização ou contato",
        investment: "Imagem relacionada a preços justos"
      },
      fonts: {
        heading: "Inter",
        body: "Inter",
        accent: "Inter"
      }
    };
  }
}

export const designAgent = new DesignAgent();
