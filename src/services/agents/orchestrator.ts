
import { contentAgent, ContentStructure } from './contentAgent';
import { designAgent, DesignStructure } from './designAgent';
import { sellerbotAgent, SellerbotConfig } from './sellerbotAgent';
import { seoAgent, SEOStructure } from './seoAgent';
import { imageAgent, ImagePrompts } from './imageAgent';
import { copyAgent, CopyStructure } from './copyAgent';
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
      
      // Etapa 4: Gerar SEO
      console.log('🔍 Agente de SEO trabalhando...');
      const seoData = await seoAgent.generateSEO(userRequest, content.title, content);
      
      // Etapa 5: Gerar prompts de imagem
      console.log('🖼️ Agente de Imagens trabalhando...');
      const imagePrompts = await imageAgent.generateImagePrompts(userRequest, content.title, content.sections);
      
      // Etapa 6: Gerar copy persuasivo
      console.log('✍️ Agente de Copy trabalhando...');
      const copyData = await copyAgent.generateCopy(userRequest, content.title, content);
      
      // Etapa 7: Combinar tudo
      console.log('🔧 Combinando resultados...');
      // Aplicar copy persuasivo às seções
      const enhancedSections = content.sections.map(section => ({
        ...section,
        title: copyData.sections[section.id]?.title || section.title,
        content: copyData.sections[section.id]?.content || section.content
      }));

      const businessData: BusinessContent = {
        ...content,
        heroText: copyData.heroText,
        sections: enhancedSections,
        colors: design.colors,
        images: {
          ...design.images,
          // Sobrescrever com prompts detalhados do imageAgent
          logo: imagePrompts.logo,
          hero: imagePrompts.hero,
          motivation: imagePrompts.motivation,
          target: imagePrompts.target,
          method: imagePrompts.method,
          results: imagePrompts.results,
          access: imagePrompts.access,
          investment: imagePrompts.investment
        },
        sellerbot,
        seo: {
          title: seoData.title,
          description: seoData.description,
          keywords: seoData.keywords,
          canonicalUrl: seoData.canonicalUrl,
          ogTitle: seoData.ogTitle,
          ogDescription: seoData.ogDescription,
          ogImage: seoData.ogImage,
          twitterTitle: seoData.twitterTitle,
          twitterDescription: seoData.twitterDescription,
          twitterImage: seoData.twitterImage,
          googleAnalyticsId: '',
          facebookPixelId: '',
          googleTagManagerId: '',
          customHeadTags: seoData.customHeadTags,
          customBodyTags: '',
          structuredData: seoData.structuredData
        }
      };
      
      // Etapa 8: Gerar HTML
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
