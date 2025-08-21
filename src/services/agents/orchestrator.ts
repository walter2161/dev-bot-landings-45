
import { contentAgent, ContentStructure } from './contentAgent';
import { designAgent, DesignStructure } from './designAgent';
import { sellerbotAgent, SellerbotConfig } from './sellerbotAgent';
import { htmlAgent } from './htmlAgent';
import { BusinessContent } from '../contentGenerator';

export class AgentOrchestrator {
  async generateLandingPage(userRequest: string): Promise<{ html: string; businessData: BusinessContent }> {
    try {
      console.log('🤖 Iniciando geração com múltiplos agentes...');
      
      // Etapa 1: Gerar conteúdo
      console.log('📝 Agente de Conteúdo trabalhando...');
      const content = await contentAgent.generateContent(userRequest);
      
      // Etapa 2: Gerar design
      console.log('🎨 Agente de Design trabalhando...');
      const design = await designAgent.generateDesign(userRequest, content.title);
      
      // Etapa 3: Gerar sellerbot
      console.log('🤖 Agente de Sellerbot trabalhando...');
      const sellerbot = await sellerbotAgent.generateSellerbot(userRequest, content.title);
      
      // Etapa 4: Combinar tudo
      console.log('🔧 Combinando resultados...');
      const businessData: BusinessContent = {
        ...content,
        colors: design.colors,
        images: design.images,
        sellerbot,
        seo: {
          title: content.title,
          description: content.subtitle,
          keywords: `${content.title}, ${content.sections.map(s => s.title).join(", ")}`,
          canonicalUrl: '',
          ogTitle: content.title,
          ogDescription: content.subtitle,
          ogImage: '',
          twitterTitle: content.title,
          twitterDescription: content.subtitle,
          twitterImage: '',
          googleAnalyticsId: '',
          facebookPixelId: '',
          googleTagManagerId: '',
          customHeadTags: '',
          customBodyTags: '',
          structuredData: ''
        }
      };
      
      // Etapa 5: Gerar HTML
      console.log('🏗️ Agente de HTML trabalhando...');
      const html = await htmlAgent.generateHTML(businessData);
      
      console.log('✅ Landing page gerada com sucesso!');
      
      return { html, businessData };
    } catch (error) {
      console.error('❌ Erro na orquestração dos agentes:', error);
      throw error;
    }
  }
  
  async generateChatResponse(message: string, businessData: BusinessContent): Promise<string> {
    return await sellerbotAgent.generateChatResponse(message, businessData);
  }
}

export const agentOrchestrator = new AgentOrchestrator();
