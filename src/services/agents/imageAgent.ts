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

    const prompt = `Baseando-se nas instruções: "${businessInstructions}"

Crie prompts de imagem ESPECÍFICOS para ${businessName} (${businessType}).

CRÍTICO: Cada prompt deve ser ESPECÍFICO para este tipo de negócio. EVITE imagens corporativas genéricas.

${hasCustomLogo ? `LOGO: Logo personalizado da empresa ${businessName} (fornecido pelo cliente)` : `LOGO: Logo profissional moderno para ${businessName} - ${businessType}`}

Return ONLY JSON:
{
  "logo": "${hasCustomLogo ? `Logo personalizado da empresa ${businessName} (fornecido pelo cliente)` : `Logo profissional moderno para ${businessName} - ${businessType}`}",
  "hero": "Foto profissional de alta qualidade específica para ${businessType}, ambiente real, ${services ? 'mostrando ' + services : 'pessoas trabalhando'}",
  "motivation": "Imagem inspiradora dos benefícios específicos de ${businessType}, resultados reais alcançados",
  "target": "Foto do público-alvo específico de ${businessType}, pessoas reais em contexto apropriado",
  "method": "Imagem detalhada do processo específico de ${businessType}, mostrando profissionalismo",
  "results": "Foto de resultados concretos de ${businessType}, antes e depois ou clientes satisfeitos",
  "access": "Imagem de localização, escritório ou espaço específico de ${businessType}",
  "investment": "Imagem relacionada a transparência de preços e valor de ${businessType}",
  "gallery": "Galeria mostrando diferentes aspectos do trabalho de ${businessType}, variedade de situações reais"
}`;

    try {
      const response = await this.makeRequest(prompt);
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      
      throw new Error("Resposta inválida da API de Imagens");
    } catch (error) {
      console.error("Erro ao gerar prompts de imagem:", error);
      
      // Fallback: retornar prompts padrão
      return this.generateFallbackPrompts(businessInstructions, businessName);
    }
  }

  private generateFallbackPrompts(businessInstructions: string, businessName: string): ImagePrompts {
    const businessTypeMatch = businessInstructions.match(/TIPO:\s*([^\n]+)/);
    const businessType = businessTypeMatch?.[1]?.trim() || "negócio";
    
    return {
      logo: `Logo profissional para ${businessName}`,
      hero: `Imagem profissional de ${businessType}`,
      motivation: `Benefícios de ${businessType}`,
      target: `Público-alvo de ${businessType}`,
      method: `Processo de trabalho de ${businessType}`,
      results: `Resultados de ${businessType}`,
      access: `Localização de ${businessType}`,
      investment: `Preços de ${businessType}`,
      gallery: `Galeria de ${businessType}`
    };
  }
}

export const imageAgent = new ImageAgent();