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
  gallery: string;
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

  async generateImagePrompts(businessInstructions: string, businessName: string, sections: any[]): Promise<ImagePrompts> {
    // Extrair informações específicas das instruções
    const logoMatch = businessInstructions.match(/LOGO:.*?logo personalizado/);
    const businessTypeMatch = businessInstructions.match(/TIPO:\s*([^\n]+)/);
    const servicesMatch = businessInstructions.match(/SERVIÇOS:\s*([^\n]+)/);
    
    const hasCustomLogo = logoMatch !== null;
    const businessType = businessTypeMatch?.[1]?.trim() || "negócio";
    const services = servicesMatch?.[1]?.trim() || "";

    const prompt = `Crie prompts de imagem específicos para ${businessName} que atua em ${businessType}.

Cada imagem deve ser específica para este negócio, evitando imagens corporativas genéricas.

Serviços oferecidos: ${services}
Tipo de logo: ${hasCustomLogo ? 'personalizado fornecido pelo cliente' : 'moderno e profissional'}

Gere descrições adequadas para cada seção da landing page.`;

    try {
      // Sempre retorna fallback direto sem parsing de JSON
      return this.generateFallbackPrompts(businessInstructions, businessName, hasCustomLogo);
    } catch (error) {
      console.error("Erro ao gerar prompts de imagem:", error);
      return this.generateFallbackPrompts(businessInstructions, businessName, hasCustomLogo);
    }
  }

  private generateFallbackPrompts(businessInstructions: string, businessName: string, hasCustomLogo?: boolean): ImagePrompts {
    const businessTypeMatch = businessInstructions.match(/TIPO:\s*([^\n]+)/);
    const servicesMatch = businessInstructions.match(/SERVIÇOS:\s*([^\n]+)/);
    const businessType = businessTypeMatch?.[1]?.trim() || "negócio";
    const services = servicesMatch?.[1]?.trim() || "";
    
    return {
      logo: hasCustomLogo ? `Logo personalizado da empresa ${businessName}` : `Logo profissional moderno para ${businessName} - ${businessType}`,
      hero: `Foto profissional de alta qualidade de ${businessType}, ambiente real de trabalho${services ? ', mostrando ' + services : ''}`,
      motivation: `Imagem inspiradora dos benefícios específicos de ${businessType}, resultados reais e transformações`,
      target: `Foto do público-alvo específico de ${businessType}, pessoas reais em contexto adequado`,
      method: `Imagem do processo de trabalho específico de ${businessType}, demonstrando profissionalismo e qualidade`,
      results: `Foto de resultados concretos de ${businessType}, clientes satisfeitos ou antes e depois`,
      access: `Imagem da localização, escritório ou espaço de atendimento de ${businessType}`,
      investment: `Imagem relacionada a transparência de preços e valor agregado de ${businessType}`,
      gallery: `Galeria diversificada mostrando diferentes aspectos do trabalho de ${businessType}, situações reais variadas`
    };
  }
}

export const imageAgent = new ImageAgent();