
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

  async generateDesign(businessInstructions: string, businessName: string): Promise<DesignStructure> {
    // Extrair informações da paleta de cores do briefing
    const paletteMatch = businessInstructions.match(/CORES OBRIGATÓRIAS:.*?Primary:\s*(#[A-Fa-f0-9]{6}).*?Secondary:\s*(#[A-Fa-f0-9]{6}).*?Accent:\s*(#[A-Fa-f0-9]{6})/);
    const logoMatch = businessInstructions.match(/LOGO:.*?logo personalizado/);
    
    const hasCustomLogo = logoMatch !== null;
    
    const prompt = `Gerar design para: "${businessName}" baseado em: "${businessInstructions}"

Criar paleta de cores apropriada e descrições de imagens específicas para o tipo de negócio.`;

    try {
      // Sempre retorna fallback direto sem parsing de JSON
      return this.generateFallbackDesign(businessInstructions, businessName, paletteMatch, hasCustomLogo);
    } catch (error) {
      console.error("Erro ao gerar design:", error);
      return this.generateFallbackDesign(businessInstructions, businessName, paletteMatch, hasCustomLogo);
    }
  }

  private generateFallbackDesign(businessInstructions: string, businessName: string, paletteMatch?: RegExpMatchArray | null, hasCustomLogo?: boolean): DesignStructure {
    const businessTypeMatch = businessInstructions.match(/TIPO:\s*([^\n]+)/);
    const businessType = businessTypeMatch?.[1]?.trim() || "negócio";

    return {
      colors: {
        primary: paletteMatch ? paletteMatch[1] : "#2563eb",
        secondary: paletteMatch ? paletteMatch[2] : "#1e40af", 
        accent: paletteMatch ? paletteMatch[3] : "#f59e0b"
      },
      images: {
        logo: hasCustomLogo ? `Logo personalizado da empresa ${businessName}` : `Logo profissional moderno para ${businessName}`,
        hero: `Foto profissional de alta qualidade específica para ${businessType}, ambiente real de trabalho`,
        motivation: `Imagem inspiradora dos benefícios específicos de ${businessType}, resultados reais`,
        target: `Foto do público-alvo específico de ${businessType}, pessoas reais em contexto apropriado`,
        method: `Imagem do processo de trabalho específico de ${businessType}, demonstrando profissionalismo`,
        results: `Foto de resultados concretos de ${businessType}, clientes satisfeitos ou transformações`,
        access: `Imagem da localização ou espaço de atendimento de ${businessType}`,
        investment: `Imagem relacionada a transparência de preços e valor de ${businessType}`
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
