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

  async generateImagePrompts(businessType: string, title: string, sections: any[]): Promise<ImagePrompts> {
    const prompt = `Create detailed and SPECIFIC image prompts for: "${businessType} - ${title}"

CRITICAL: Each prompt must be SPECIFIC to the business type. AVOID generic corporate images with people in suits shaking hands.

For each section, create specific prompts in ENGLISH for image generation:

Return ONLY JSON:
{
  "logo": "specific logo prompt for ${businessType} business called ${title}",
  "hero": "specific hero image that represents ${businessType} industry, not generic business",
  "motivation": "image showing specific advantages of ${businessType}, industry-relevant",
  "target": "image of actual customers who use ${businessType} services, not corporate executives",
  "method": "image showing the actual process/methodology specific to ${businessType} industry",
  "results": "image showing real results/benefits specific to ${businessType}, not handshakes",
  "access": "image of actual business location or service delivery for ${businessType}",
  "investment": "positive investment image relevant to ${businessType} industry, avoid generic handshakes",
  "gallery": "6 images showing different aspects of ${businessType} business - products, services, environment, customers - for photo gallery, industry-specific content"
}

CRITICAL GUIDELINES:
- MUST be industry-specific: pet shop = pets/animals, clothing store = fashion/clothes, restaurant = food/kitchen
- NO generic corporate images (suits, handshakes, office meetings)
- Use "professional photography", "high quality", "bright lighting"
- Include SPECIFIC visual elements of the business type
- NO text in images
- Focus on the actual products/services of the business
- Show real customers and environments for that industry
- Use vibrant, appealing colors suitable for the business type
- MAXIMUM IMAGE SIZE: 720px x 480px at 72dpi
- Example: Pet shop = "cute dogs and cats in a modern pet store, professional photography, bright colorful environment"
- Example: Clothing store = "fashionable clothes displayed in modern boutique, professional photography, stylish lighting"`;

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
    // Create industry-specific fallback prompts
    const lowerBusinessType = businessType.toLowerCase();
    
    // Determine industry-specific elements
    let industryElements = '';
    if (lowerBusinessType.includes('pet') || lowerBusinessType.includes('animal')) {
      industryElements = 'cute pets, animals, pet products, veterinary care';
    } else if (lowerBusinessType.includes('fashion') || lowerBusinessType.includes('clothing') || lowerBusinessType.includes('roupa')) {
      industryElements = 'fashionable clothes, stylish outfits, fashion accessories, boutique display';
    } else if (lowerBusinessType.includes('food') || lowerBusinessType.includes('restaurant') || lowerBusinessType.includes('cafe')) {
      industryElements = 'delicious food, restaurant kitchen, dining experience, fresh ingredients';
    } else if (lowerBusinessType.includes('beauty') || lowerBusinessType.includes('salon') || lowerBusinessType.includes('spa')) {
      industryElements = 'beauty treatments, salon services, wellness, cosmetics';
    } else {
      industryElements = `${businessType} products, ${businessType} services, industry-specific elements`;
    }

    return {
      logo: `modern professional logo for ${title}, ${businessType} business, clean design, vector style, high quality, brand identity, industry colors`,
      hero: `professional photography showcasing ${industryElements}, high quality, bright lighting, inviting atmosphere, industry-specific setting`,
      motivation: `image highlighting ${industryElements}, quality and excellence in ${businessType}, modern style, trustworthy, premium service`,
      target: `real customers enjoying ${businessType} services, diverse group, authentic happiness, industry-appropriate setting, professional photography`,
      method: `${industryElements} in action, professional process, organized workflow, industry-specific methodology, high quality photography`,
      results: `satisfied customers with ${industryElements}, successful outcomes, positive results, authentic joy, quality service delivery`,
      access: `welcoming ${businessType} location, professional storefront, easy access, industry-appropriate environment, inviting atmosphere`,
      investment: `value proposition for ${businessType} services, quality investment concept, customer satisfaction, positive ROI visualization, avoid handshakes`,
      gallery: `6 different images showing ${industryElements}, business environment, products, services, customers enjoying ${businessType} services, maximum size 720x480px at 72dpi`
    };
  }
}

export const imageAgent = new ImageAgent();