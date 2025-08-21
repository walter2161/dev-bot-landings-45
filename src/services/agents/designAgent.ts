
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
    
    let paletteInfo = "";
    if (paletteMatch) {
      paletteInfo = `USE EXATAMENTE estas cores: Primária: ${paletteMatch[1]}, Secundária: ${paletteMatch[2]}, Destaque: ${paletteMatch[3]}`;
    }

    const prompt = `Baseando-se nas instruções: "${businessInstructions}"

${paletteInfo ? `OBRIGATÓRIO - ${paletteInfo}` : 'Escolha cores apropriadas para o tipo de negócio'}

Retorne APENAS JSON:
{
  "colors": {
    "primary": "${paletteMatch ? paletteMatch[1] : '#cor_hex_principal_apropriada'}",
    "secondary": "${paletteMatch ? paletteMatch[2] : '#cor_hex_secundaria_apropriada'}", 
    "accent": "${paletteMatch ? paletteMatch[3] : '#cor_hex_destaque_apropriada'}"
  },
  "images": {
    "logo": "${hasCustomLogo ? `Logo personalizado da empresa ${businessName} (fornecido pelo cliente)` : `Logo profissional moderno para ${businessName}`}",
    "hero": "Foto profissional de alta qualidade relacionada ao negócio, ambiente real, pessoas trabalhando",
    "motivation": "Imagem inspiradora dos benefícios e resultados alcançados",
    "target": "Foto do público-alvo específico, pessoas reais em contexto apropriado",
    "method": "Imagem detalhada do processo de trabalho, mostrando profissionalismo",
    "results": "Foto de resultados concretos e positivos, antes e depois ou clientes satisfeitos",
    "access": "Imagem de localização, escritório ou espaço físico",
    "investment": "Imagem relacionada a valor justo e transparência de preços"
  },
  "fonts": {
    "heading": "Inter",
    "body": "Inter",
    "accent": "Inter"
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
      return this.generateFallbackDesign(businessInstructions, businessName);
    }
  }

  private generateFallbackDesign(businessInstructions: string, businessName: string): DesignStructure {
    return {
      colors: {
        primary: "#2563eb",
        secondary: "#1e40af", 
        accent: "#f59e0b"
      },
      images: {
        logo: `Logo profissional para ${businessName}`,
        hero: `Imagem de destaque para o negócio`,
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
