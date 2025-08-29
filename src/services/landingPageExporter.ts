import { BusinessContent } from './contentGenerator';
import { HtmlAgent } from './agents/htmlAgent';

export class LandingPageExporter {
  private htmlAgent = new HtmlAgent();

  async exportLandingPage(businessData: BusinessContent, language: string = 'pt'): Promise<void> {
    try {
      // Gerar o HTML com o idioma selecionado
      const html = await this.htmlAgent.generateHTML(businessData, language);
      
      // Criar o arquivo com nome fixo "index.html"
      const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
      
      // Criar link de download
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'index.html'; // Nome sempre será index.html
      
      // Trigger do download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Cleanup
      URL.revokeObjectURL(link.href);
      
      console.log(`✅ Landing page exportada como index.html (idioma: ${language})`);
    } catch (error) {
      console.error('❌ Erro ao exportar landing page:', error);
      throw error;
    }
  }

  // Método para gerar preview sem download
  async generatePreview(businessData: BusinessContent, language: string = 'pt'): Promise<string> {
    return await this.htmlAgent.generateHTML(businessData, language);
  }
}

// Instância única para uso em toda a aplicação
export const landingPageExporter = new LandingPageExporter();