const MISTRAL_API_KEY = "aynCSftAcQBOlxmtmpJqVzco8K4aaTDQ";
const MISTRAL_API_URL = "https://api.mistral.ai/v1/chat/completions";

export interface ImagePrompts {
  logo: string;
  hero: string;
  motivation: string;
  target: string;
  method: string;
  results: string;
  access: string;
  investment: string;
}

export class ImageAgent {
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
        console.error(`Image API error ${response.status}:`, errorText);
        throw new Error(`API error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      console.error("Erro na API de Imagens:", error);
      throw error;
    }
  }

  async generateImagePrompts(businessType: string, title: string, sections: any[]): Promise<ImagePrompts> {
    const prompt = `Crie prompts detalhados para geração de imagens para: "${businessType} - ${title}"

Para cada seção, crie um prompt específico e profissional para Pollinstation/Stable Diffusion:

Retorne APENAS JSON:
{
  "logo": "prompt para logo profissional e moderno da empresa ${title}",
  "hero": "prompt para imagem principal/hero que represente ${businessType} de forma atrativa",
  "motivation": "prompt para imagem que mostre os diferenciais e qualidade de ${businessType}",
  "target": "prompt para imagem do público-alvo ideal para ${businessType}",
  "method": "prompt para imagem que ilustre o processo/metodologia de ${businessType}",
  "results": "prompt para imagem dos resultados/benefícios de ${businessType}",
  "access": "prompt para imagem de localização/contato/acesso aos serviços",
  "investment": "prompt para imagem relacionada a preços/investimento de forma positiva"
}

Diretrizes para os prompts:
- Use "professional photography", "high quality", "modern style"
- Inclua aspectos visuais específicos do tipo de negócio
- Evite texto nas imagens
- Foque em composição e iluminação profissional
- Use cores que transmitam confiança e qualidade
- Considere o público-alvo brasileiro
- Inclua elementos que remetam ao ${businessType}`;

    try {
      const response = await this.makeRequest(prompt);
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      
      throw new Error("Resposta inválida da API de Imagens");
    } catch (error) {
      console.error("Erro ao gerar prompts de imagem:", error);
      
      // Fallback: retornar prompts básicos
      return this.generateFallbackImagePrompts(businessType, title);
    }
  }

  private generateFallbackImagePrompts(businessType: string, title: string): ImagePrompts {
    return {
      logo: `modern professional logo for ${title}, ${businessType} business, clean design, vector style, high quality, brand identity`,
      hero: `professional photography of ${businessType} service, high quality, modern lighting, business environment, confident atmosphere`,
      motivation: `professional image showing quality and excellence in ${businessType}, modern style, trustworthy, high-end service`,
      target: `diverse group of satisfied customers, professional photography, modern business environment, happy clients`,
      method: `professional workflow illustration for ${businessType}, modern office environment, organized process, high quality photography`,
      results: `successful business results, professional photography, positive outcomes, satisfied customers, quality service delivery`,
      access: `modern business location, professional storefront, easy access, welcoming environment, professional photography`,
      investment: `professional handshake, business investment concept, value proposition, modern office setting, trust and partnership`
    };
  }
}

export const imageAgent = new ImageAgent();