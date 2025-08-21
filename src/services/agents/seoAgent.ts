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
    const prompt = `Crie SEO otimizado para: "${businessType} - ${title}"

Analise o conteúdo e crie um SEO completo focado em conversão e rankeamento:

Retorne APENAS JSON:
{
  "title": "Título SEO otimizado (max 60 caracteres) com palavra-chave principal",
  "description": "Meta description persuasiva (max 160 caracteres) que gere cliques",
  "keywords": "5-8 palavras-chave principais separadas por vírgula",
  "canonicalUrl": "",
  "ogTitle": "Título para redes sociais otimizado",
  "ogDescription": "Descrição para redes sociais que gere engajamento",
  "ogImage": "",
  "twitterTitle": "Título específico para Twitter",
  "twitterDescription": "Descrição específica para Twitter",
  "twitterImage": "",
  "structuredData": "JSON-LD schema.org para ${businessType} (LocalBusiness, Product ou Service)",
  "customHeadTags": "Tags extras de SEO e conversão"
}

Foque em:
- Palavras-chave de alta conversão
- Call-to-actions nos titles e descriptions
- Schema markup adequado ao tipo de negócio
- Otimização para busca local se aplicável`;

    try {
      const response = await this.makeRequest(prompt);
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      
      throw new Error("Resposta inválida da API de SEO");
    } catch (error) {
      console.error("Erro ao gerar SEO:", error);
      
      // Fallback: retornar SEO básico
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