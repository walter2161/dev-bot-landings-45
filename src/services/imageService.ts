export class ImageService {
  async generateImageUrl(prompt: string, width: number = 800, height: number = 600): Promise<string> {
    // Encode the prompt for URL
    const encodedPrompt = encodeURIComponent(prompt);
    // Gera URL sem marca d'água e com qualidade otimizada
    return `https://image.pollinations.ai/prompt/${encodedPrompt}?width=${width}&height=${height}&model=flux&nologo=true&enhance=false&safe=true`;
  }

  async convertImageToBase64(imageUrl: string): Promise<string> {
    try {
      console.log("Convertendo imagem para base64:", imageUrl);
      
      // Timeout de 10 segundos para evitar travamentos
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);
      
      try {
        // Usar modo cors para contornar problemas de CORS
        const response = await fetch(imageUrl, { 
          mode: 'cors',
          headers: {
            'Accept': 'image/*'
          },
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const blob = await response.blob();
        console.log("Blob criado:", blob.type, blob.size);
        
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => {
            const base64 = reader.result as string;
            console.log("Base64 gerado:", base64.substring(0, 100) + "...");
            resolve(base64);
          };
          reader.onerror = (error) => {
            console.error("Erro no FileReader:", error);
            reject(error);
          };
          reader.readAsDataURL(blob);
        });
      } catch (fetchError) {
        clearTimeout(timeoutId);
        throw fetchError;
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      console.error("Erro ao converter imagem para Base64:", errorMsg);
      console.log("Retornando placeholder para:", imageUrl);
      // Retorna uma imagem placeholder em base64
      return "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgdmlld0JveD0iMCAwIDgwMCA2MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI4MDAiIGhlaWdodD0iNjAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik00MDAgMzAwTDQ2MCAyNDBINDYwTDQ2MCAzNjBINDAwVjMwMFoiIGZpbGw9IiM5Q0EzQUYiLz4KPC9zdmc+";
    }
  }

  async generateLandingPageImages(imagePrompts: { hero: string; features: string[] }): Promise<{ hero: string; features: string[] }> {
    try {
      const heroImageUrl = await this.generateImageUrl(imagePrompts.hero, 1200, 600);
      const heroBase64 = await this.convertImageToBase64(heroImageUrl);

      const featureImages = await Promise.all(
        imagePrompts.features.map(async (prompt) => {
          const imageUrl = await this.generateImageUrl(prompt, 800, 600);
          return await this.convertImageToBase64(imageUrl);
        })
      );

      return {
        hero: heroBase64,
        features: featureImages
      };
    } catch (error) {
      console.error("Erro ao gerar imagens:", error);
      return {
        hero: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgdmlld0JveD0iMCAwIDgwMCA2MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI4MDAiIGhlaWdodD0iNjAwIiBmaWxsPSIjRjNGNEY2Ii8+CjwvZz4KPC9zdmc+",
        features: []
      };
    }
  }

  async convertAllImagesToBase64(images: any): Promise<any> {
    // Converte todas as imagens em paralelo para melhor performance
    const imageEntries = Object.entries(images);
    
    const conversions = imageEntries.map(async ([key, value]) => {
      if (typeof value === 'string' && (value.startsWith('http://') || value.startsWith('https://'))) {
        try {
          console.log(`Convertendo imagem ${key}...`);
          const base64 = await this.convertImageToBase64(value);
          return [key, base64];
        } catch (error) {
          console.error(`Erro ao converter ${key}:`, error);
          return [key, this.getPlaceholderBase64()];
        }
      }
      return [key, value];
    });
    
    const results = await Promise.all(conversions);
    return Object.fromEntries(results);
  }

  private getPlaceholderBase64(): string {
    return "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgdmlld0JveD0iMCAwIDgwMCA2MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI4MDAiIGhlaWdodD0iNjAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik00MDAgMzAwTDQ2MCAyNDBINDYwTDQ2MCAzNjBINDAwVjMwMFoiIGZpbGw9IiM5Q0EzQUYiLz4KPC9zdmc+";
  }
}

export const imageService = new ImageService();