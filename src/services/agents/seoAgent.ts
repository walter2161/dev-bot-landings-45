const MISTRAL_API_KEY = "aynCSftAcQBOlxmtmpJqVzco8K4aaTDQ";
const MISTRAL_API_URL = "https://api.mistral.ai/v1/chat/completions";

export interface SEOStructure {
  title: string;
  description: string;
  keywords: string;
  canonicalUrl: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  twitterTitle: string;
  twitterDescription: string;
  twitterImage: string;
  structuredData: string;
  customHeadTags: string;
}

export class SEOAgent {
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
          temperature: 0.5,
          max_tokens: 1200,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`SEO API error ${response.status}:`, errorText);
        throw new Error(`API error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      console.error("Erro na API de SEO:", error);
      throw error;
    }
  }

  async generateSEO(businessType: string, title: string, content: any): Promise<SEOStructure> {
    const prompt = `Crie SEO otimizado para: "${title}" - ${businessType}

Informações do negócio:
- Título: ${title}
- Tipo: ${businessType}
- Seções: ${content?.sections?.map(s => s.title).join(', ') || ''}

Gere título SEO, descrição, keywords e structured data apropriados.`;

    try {
      // Sempre retorna fallback direto sem parsing de JSON
      return this.generateFallbackSEO(businessType, title);
    } catch (error) {
      console.error("Erro ao gerar SEO:", error);
      return this.generateFallbackSEO(businessType, title);
    }
  }

  private generateFallbackSEO(businessType: string, title: string): SEOStructure {
    const keywords = `${title.toLowerCase()}, ${businessType.toLowerCase()}, serviços, qualidade, profissional`;
    
    return {
      title: `${title} - ${businessType} Profissional | Qualidade Garantida`,
      description: `${title} oferece ${businessType.toLowerCase()} de qualidade. Entre em contato e solicite seu orçamento. Atendimento personalizado e resultados garantidos.`,
      keywords,
      canonicalUrl: "",
      ogTitle: `${title} - ${businessType} de Qualidade`,
      ogDescription: `Descubra como ${title} pode ajudar você com ${businessType.toLowerCase()} profissional. Solicite seu orçamento hoje mesmo!`,
      ogImage: "",
      twitterTitle: `${title} - ${businessType} Profissional`,
      twitterDescription: `${businessType} de qualidade com ${title}. Atendimento personalizado e resultados garantidos. Solicite orçamento!`,
      twitterImage: "",
      structuredData: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        "name": title,
        "description": `${businessType} profissional`,
        "priceRange": "$$",
        "telephone": "+55-11-99999-9999",
        "address": {
          "@type": "PostalAddress",
          "addressCountry": "BR"
        }
      }),
      customHeadTags: `<meta name="robots" content="index, follow">
<meta name="author" content="${title}">
<meta name="geo.region" content="BR">
<link rel="preload" href="/fonts/Inter-Regular.woff2" as="font" type="font/woff2" crossorigin>`
    };
  }
}

export const seoAgent = new SEOAgent();