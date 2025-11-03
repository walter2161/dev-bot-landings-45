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

  async generateImagePrompts(businessInstructions: string, businessName: string, sections: any[]): Promise<ImagePrompts> {
    // Extrair informações específicas das instruções
    const logoMatch = businessInstructions.match(/LOGO:.*?logo personalizado/);
    const businessTypeMatch = businessInstructions.match(/TIPO:\s*([^\n]+)/);
    const servicesMatch = businessInstructions.match(/SERVIÇOS:\s*([^\n]+)/);
    
    const hasCustomLogo = logoMatch !== null;
    const businessType = businessTypeMatch?.[1]?.trim() || "negócio";
    const services = servicesMatch?.[1]?.trim() || "";

    const prompt = `Crie prompts de imagem específicos para ${businessName} que atua em ${businessType}.

Cada imagem deve ser específica para este negócio, evitando imagens corporativas genéricas.

Serviços oferecidos: ${services}
Tipo de logo: ${hasCustomLogo ? 'personalizado fornecido pelo cliente' : 'moderno e profissional'}

Gere descrições adequadas para cada seção da landing page.`;

    try {
      // Sempre retorna fallback direto sem parsing de JSON
      return this.generateFallbackPrompts(businessInstructions, businessName, hasCustomLogo);
    } catch (error) {
      console.error("Erro ao gerar prompts de imagem:", error);
      return this.generateFallbackPrompts(businessInstructions, businessName, hasCustomLogo);
    }
  }

  private generateFallbackPrompts(businessInstructions: string, businessName: string, hasCustomLogo?: boolean): ImagePrompts {
    const businessTypeMatch = businessInstructions.match(/TIPO:\s*([^\n]+)/);
    const servicesMatch = businessInstructions.match(/SERVIÇOS:\s*([^\n]+)/);
    const businessType = businessTypeMatch?.[1]?.trim() || "negócio";
    const services = servicesMatch?.[1]?.trim() || "";
    const lowerType = businessType.toLowerCase();
    
    // Prompts específicos por tipo de negócio
    let specificPrompts = this.getSpecificPrompts(lowerType, businessName, services);
    
    return {
      logo: hasCustomLogo ? `Logo personalizado da empresa ${businessName}` : `Logo profissional moderno para ${businessName} - ${businessType}`,
      hero: specificPrompts.hero,
      motivation: specificPrompts.motivation,
      target: specificPrompts.target,
      method: specificPrompts.method,
      results: specificPrompts.results,
      access: specificPrompts.access,
      investment: specificPrompts.investment,
      gallery: specificPrompts.gallery
    };
  }

  private getSpecificPrompts(businessType: string, businessName: string, services: string) {
    // Pizzaria
    if (businessType.includes('pizz')) {
      return {
        hero: 'Pizza artesanal saindo do forno a lenha, com queijo derretido e ingredientes frescos, foto profissional de pizzaria',
        motivation: 'Pessoas felizes comendo pizza em ambiente acolhedor de pizzaria',
        target: 'Família ou grupo de amigos curtindo pizzas em pizzaria',
        method: 'Pizzaiolo preparando pizza artesanal no forno a lenha',
        results: 'Mesa com várias pizzas deliciosas e clientes satisfeitos',
        access: 'Fachada aconchegante de pizzaria com letreiro iluminado',
        investment: 'Cardápio com preços de pizzas em pizzaria moderna',
        gallery: 'Variedade de pizzas artesanais, forno a lenha, massa sendo preparada'
      };
    }
    
    // Salão de beleza
    if (businessType.includes('salão') || businessType.includes('salon') || businessType.includes('beleza')) {
      return {
        hero: 'Interior moderno de salão de beleza com cadeiras e espelhos profissionais',
        motivation: 'Cliente satisfeita admirando novo visual no espelho do salão',
        target: 'Mulheres de diferentes idades em salão de beleza',
        method: 'Profissional realizando corte de cabelo em salão moderno',
        results: 'Antes e depois de transformação de cabelo em salão de beleza',
        access: 'Fachada elegante de salão de beleza com vitrine',
        investment: 'Tabela de preços de serviços de salão em display moderno',
        gallery: 'Transformações de cabelo, coloração, penteados em salão profissional'
      };
    }
    
    // Academia
    if (businessType.includes('academia') || businessType.includes('gym')) {
      return {
        hero: 'Academia moderna com equipamentos de musculação e pessoas treinando',
        motivation: 'Transformação física antes e depois de aluno da academia',
        target: 'Pessoas de diferentes idades treinando em academia',
        method: 'Personal trainer orientando aluno em exercício na academia',
        results: 'Alunos mostrando resultados e evolução física na academia',
        access: 'Fachada moderna de academia com vidro e iluminação',
        investment: 'Planos e preços de academia em painel digital',
        gallery: 'Área de musculação, aulas coletivas, vestiários modernos de academia'
      };
    }
    
    // Clínica/Consultório
    if (businessType.includes('clínica') || businessType.includes('clinic') || businessType.includes('médic')) {
      return {
        hero: 'Consultório médico moderno e acolhedor com equipamentos profissionais',
        motivation: 'Médico atendendo paciente com cuidado em consultório',
        target: 'Pacientes de diferentes idades em sala de espera moderna',
        method: 'Profissional de saúde realizando exame com equipamento moderno',
        results: 'Paciente satisfeito após atendimento em clínica',
        access: 'Fachada moderna de clínica médica com sinalização',
        investment: 'Lista de procedimentos e convênios aceitos em clínica',
        gallery: 'Consultórios, equipamentos médicos, recepção moderna de clínica'
      };
    }
    
    // Restaurante/Bar
    if (businessType.includes('restaurante') || businessType.includes('bar') || businessType.includes('lanchonete')) {
      return {
        hero: 'Prato gourmet bem apresentado em restaurante elegante',
        motivation: 'Clientes satisfeitos degustando refeição em restaurante',
        target: 'Grupo de pessoas jantando em restaurante aconchegante',
        method: 'Chef preparando prato em cozinha profissional de restaurante',
        results: 'Mesa com variedade de pratos deliciosos servidos',
        access: 'Fachada charmosa de restaurante com iluminação noturna',
        investment: 'Cardápio elegante com preços em restaurante',
        gallery: 'Pratos variados, ambiente interno, chef trabalhando na cozinha'
      };
    }
    
    // Corretor/Imóveis
    if (businessType.includes('imov') || businessType.includes('corretor')) {
      return {
        hero: 'Imóvel moderno de alto padrão com arquitetura impressionante',
        motivation: 'Família feliz em novo imóvel recém adquirido',
        target: 'Casal visitando imóvel com corretor profissional',
        method: 'Corretor apresentando imóvel para clientes em visita',
        results: 'Cliente satisfeito recebendo chaves de novo imóvel',
        access: 'Escritório moderno de imobiliária com atendimento',
        investment: 'Planta e valores de imóveis em apresentação',
        gallery: 'Imóveis diversos, ambientes internos decorados, áreas externas'
      };
    }
    
    // Default genérico
    return {
      hero: `Foto profissional de alta qualidade de ${businessType}, ambiente real de trabalho${services ? ', mostrando ' + services : ''}`,
      motivation: `Imagem inspiradora dos benefícios específicos de ${businessType}, resultados reais`,
      target: `Foto do público-alvo específico de ${businessType}, pessoas reais`,
      method: `Imagem do processo de trabalho de ${businessType}, demonstrando profissionalismo`,
      results: `Foto de resultados concretos de ${businessType}, clientes satisfeitos`,
      access: `Imagem do espaço físico e localização de ${businessType}`,
      investment: `Imagem relacionada a preços e valores de ${businessType}`,
      gallery: `Galeria mostrando diferentes aspectos do trabalho de ${businessType}`
    };
  }
}

export const imageAgent = new ImageAgent();