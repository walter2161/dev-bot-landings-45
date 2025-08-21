
import { contentAgent, ContentStructure } from './contentAgent';
import { designAgent, DesignStructure } from './designAgent';
import { sellerbotAgent, SellerbotConfig } from './sellerbotAgent';
import { seoAgent, SEOStructure } from './seoAgent';
import { imageAgent, ImagePrompts } from './imageAgent';
import { copyAgent, CopyStructure } from './copyAgent';
import { htmlAgent } from './htmlAgent';
import { briefingAgent, ProcessedBriefing } from './briefingAgent';
import { BusinessContent } from '../contentGenerator';

export class AgentOrchestrator {
  async generateLandingPage(userRequest: string): Promise<{ html: string; businessData: BusinessContent }> {
    try {
      console.log('🤖 Iniciando geração com múltiplos agentes...');
      
      // Etapa 0: Processar briefing
      console.log('📋 Agente de Briefing processando...');
      const briefing = await briefingAgent.processBriefing(userRequest);
      
      // Etapa 1: Gerar conteúdo
      console.log('📝 Agente de Conteúdo trabalhando...');
      const contentInstructions = briefingAgent.generateInstructionsForAgent(briefing, 'content');
      const content = await contentAgent.generateContent(contentInstructions);
      
      // Etapa 2: Gerar design
      console.log('🎨 Agente de Design trabalhando...');
      const designInstructions = briefingAgent.generateInstructionsForAgent(briefing, 'design');
      const design = await designAgent.generateDesign(designInstructions, briefing.businessName);
      
      // Etapa 3: Gerar sellerbot
      console.log('🤖 Agente de Sellerbot trabalhando...');
      
      // Preparar dados do negócio para o sellerbot
      const businessDataForSellerbot = {
        contact: {
          address: briefing.contactInfo.address || "A definir",
          phone: briefing.contactInfo.other || "A definir", 
          email: briefing.contactInfo.other || "contato@empresa.com",
          socialMedia: { whatsapp: briefing.contactInfo.whatsapp || "A definir" }
        },
        sections: content.sections
      };
      
      const sellerbot = await sellerbotAgent.generateSellerbot(contentInstructions, briefing.businessName, businessDataForSellerbot);
      
      // Etapa 4: Gerar SEO
      console.log('🔍 Agente de SEO trabalhando...');
      const seoInstructions = briefingAgent.generateInstructionsForAgent(briefing, 'seo');
      const seoData = await seoAgent.generateSEO(seoInstructions, briefing.businessName, content);
      
      // Etapa 5: Gerar prompts de imagem
      console.log('🖼️ Agente de Imagens trabalhando...');
      const imageInstructions = briefingAgent.generateInstructionsForAgent(briefing, 'image');
      const imagePrompts = await imageAgent.generateImagePrompts(imageInstructions, briefing.businessName, content.sections);
      
      // Etapa 6: Gerar copy persuasivo
      console.log('✍️ Agente de Copy trabalhando...');
      const copyInstructions = briefingAgent.generateInstructionsForAgent(briefing, 'copy');
      const copyData = await copyAgent.generateCopy(copyInstructions, briefing.businessName, content);
      
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
        title: briefing.businessName, // Forçar o nome correto da empresa
        heroText: copyData.heroText,
        sections: enhancedSections,
        colors: briefing.colorPalette, // Usar cores do briefing
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
          investment: imagePrompts.investment,
          gallery: imagePrompts.gallery
        },
        // Criar array de imagens da galeria (6 imagens)
        galleryImages: [
          `${userRequest} - ambiente interno profissional e bem iluminado`,
          `${userRequest} - cliente satisfeito utilizando o serviço de qualidade`,
          `${userRequest} - equipe profissional trabalhando com dedicação`,
          `${userRequest} - detalhes do produto ou serviço sendo executado`,
          `${userRequest} - ambiente de atendimento ao cliente acolhedor`,
          `${userRequest} - resultado final do trabalho realizado com excelência`
        ],
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
