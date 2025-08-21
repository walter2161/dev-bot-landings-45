const MISTRAL_API_KEY = "aynCSftAcQBOlxmtmpJqVzco8K4aaTDQ";
const MISTRAL_API_URL = "https://api.mistral.ai/v1/chat/completions";

export interface CopyStructure {
  heroText: string;
  sections: {
    [key: string]: {
      title: string;
      content: string;
      cta?: string;
    };
  };
}

export class CopyAgent {
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
          temperature: 0.7,
          max_tokens: 2500,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Copy API error ${response.status}:`, errorText);
        throw new Error(`API error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      console.error("Erro na API de Copy:", error);
      throw error;
    }
  }

  async generateCopy(businessType: string, title: string, basicContent: any): Promise<CopyStructure> {
    const prompt = `Crie copy persuasivo e vendedor para: "${businessType} - ${title}"

Crie textos longos, persuasivos e focados em vendas para cada seção:

Retorne APENAS JSON:
{
  "heroText": "Texto principal impactante que gere desejo e urgência (3-4 linhas)",
  "sections": {
    "intro": {
      "title": "Título impactante para apresentação",
      "content": "Texto longo (150-200 palavras) que apresente a empresa, crie autoridade e desperte interesse. Use storytelling e benefícios emocionais.",
      "cta": "Call-to-action específico"
    },
    "motivation": {
      "title": "Título que destaque diferenciais únicos", 
      "content": "Texto persuasivo (150-200 palavras) sobre por que escolher esta empresa. Foque em dores do cliente, soluções exclusivas e proof points.",
      "cta": "Call-to-action motivacional"
    },
    "target": {
      "title": "Título que conecte com o público-alvo",
      "content": "Texto direcionado (150-200 palavras) que fale diretamente com o cliente ideal. Use linguagem específica do nicho e demonstre compreensão das necessidades.",
      "cta": "Call-to-action segmentado"
    },
    "method": {
      "title": "Título sobre metodologia/processo único",
      "content": "Texto detalhado (150-200 palavras) explicando como funciona o serviço/produto. Destaque a simplicidade para o cliente e eficiência dos resultados.",
      "cta": "Call-to-action sobre o processo"
    },
    "results": {
      "title": "Título focado em resultados e transformação",
      "content": "Texto poderoso (150-200 palavras) sobre os resultados que o cliente alcançará. Use números, transformações e benefícios tangíveis.",
      "cta": "Call-to-action de resultado"
    },
    "access": {
      "title": "Título sobre facilidade de acesso/contato",
      "content": "Texto acolhedor (100-150 palavras) facilitando o primeiro contato. Remova objeções sobre localização, horário e acessibilidade.",
      "cta": "Call-to-action de contato"
    },
    "investment": {
      "title": "Título que posicione valor (não preço)",
      "content": "Texto estratégico (150-200 palavras) sobre investimento e retorno. Justifique o valor, ofereça garantias e crie senso de urgência.",
      "cta": "Call-to-action de fechamento"
    }
  }
}

Princípios do copy:
- Foque em benefícios, não características
- Use gatilhos mentais: escassez, autoridade, prova social
- Linguagem emocional e persuasiva
- Remova objeções antes que surjam  
- Crie senso de urgência sutil
- Use "você" para falar diretamente com o cliente
- Inclua proof points e credibilidade
- Finalize sempre com call-to-action claro`;

    try {
      const response = await this.makeRequest(prompt);
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      
      throw new Error("Resposta inválida da API de Copy");
    } catch (error) {
      console.error("Erro ao gerar copy:", error);
      
      // Fallback: retornar copy básico
      return this.generateFallbackCopy(businessType, title);
    }
  }

  private generateFallbackCopy(businessType: string, title: string): CopyStructure {
    return {
      heroText: `Transforme seus resultados com ${title}. Somos especialistas em ${businessType.toLowerCase()} e oferecemos soluções que realmente funcionam. Descubra como podemos ajudar você a alcançar seus objetivos de forma rápida e eficiente.`,
      sections: {
        intro: {
          title: `Conheça ${title}`,
          content: `Há anos no mercado, ${title} se tornou referência em ${businessType.toLowerCase()}. Nossa missão é simples: entregar resultados excepcionais que superem suas expectativas. Trabalhamos com dedicação total, pois sabemos que seu sucesso é também o nosso sucesso. Cada projeto é tratado com atenção aos detalhes e foco em resultados mensuráveis. Nossa equipe experiente está pronta para atender suas necessidades específicas e criar soluções personalizadas que realmente funcionam. Quando você escolhe ${title}, está escolhendo qualidade, confiança e resultados garantidos.`,
          cta: "Conheça Nossa História"
        },
        motivation: {
          title: "Por Que Somos Diferentes",
          content: `No mercado saturado de hoje, encontrar um parceiro confiável é fundamental. ${title} se destaca pela combinação única de experiência, inovação e atendimento personalizado. Enquanto outros oferecem soluções genéricas, nós entendemos que cada cliente é único e merece uma abordagem específica. Nossa metodologia comprovada já ajudou centenas de clientes a alcançarem seus objetivos. Não trabalhamos apenas para entregar um serviço, mas para construir relacionamentos duradouros baseados em confiança e resultados. Escolher ${title} significa escolher a tranquilidade de saber que seu projeto está em mãos experientes e dedicadas.`,
          cta: "Veja Nossos Diferenciais"
        },
        target: {
          title: "Você Está No Lugar Certo",
          content: `Se você busca ${businessType.toLowerCase()} de qualidade, chegou ao lugar certo. Entendemos perfeitamente os desafios que você enfrenta e sabemos exatamente como resolvê-los. Nossa experiência nos ensinou que cada cliente tem necessidades específicas, e é por isso que nosso atendimento é completamente personalizado. Você não é apenas mais um número para nós - é um parceiro em busca de resultados. Trabalhamos com pessoas e empresas que valorizam qualidade, eficiência e resultados consistentes. Se isso descreve você, então estamos alinhados e prontos para trabalhar juntos rumo ao seu sucesso.`,
          cta: "Quero Saber Mais"
        },
        method: {
          title: "Nossa Metodologia Comprovada",
          content: `Desenvolvemos ao longo dos anos uma metodologia única que garante resultados consistentes. Nosso processo começa com uma análise detalhada de suas necessidades, seguida pelo desenvolvimento de uma estratégia personalizada. Cada etapa é cuidadosamente planejada e executada com precisão. Mantemos você informado durante todo o processo, garantindo transparência total. Nossa abordagem combina as melhores práticas do mercado com inovação e tecnologia de ponta. O resultado? Soluções eficientes, entregues no prazo e dentro do orçamento. Quando você trabalha conosco, tem a garantia de um processo organizado, profissional e focado em resultados.`,
          cta: "Conheça Nosso Processo"
        },
        results: {
          title: "Resultados Que Transformam",
          content: `Os resultados falam por si só. Nossos clientes experimentam transformações reais em seus negócios e projetos. Não prometemos milagres, mas entregamos resultados consistentes e mensuráveis. Através da nossa abordagem especializada, você verá melhorias significativas em áreas críticas do seu negócio. Nosso histórico comprova nossa capacidade de entregar o que prometemos. Cada projeto concluído é uma prova do nosso comprometimento com a excelência. Quando você investe em ${title}, está investindo em resultados que realmente importam. Prepare-se para ver a diferença que um parceiro verdadeiramente comprometido pode fazer.`,
          cta: "Ver Casos de Sucesso"
        },
        access: {
          title: "Fale Conosco Agora",
          content: `Estamos prontos para atender você da melhor forma possível. Nossa equipe está disponível para esclarecer suas dúvidas e apresentar a solução ideal para sua necessidade. O primeiro contato é sempre sem compromisso - queremos entender seu projeto antes de qualquer coisa. Oferecemos múltiplas formas de contato para sua conveniência. Seja por telefone, email ou presencialmente, garantimos um atendimento ágil e profissional. Não deixe seu projeto para depois. Entre em contato hoje mesmo e dê o primeiro passo rumo aos resultados que você merece.`,
          cta: "Entrar em Contato"
        },
        investment: {
          title: "Investimento Que Vale a Pena",
          content: `Sabemos que o investimento é uma consideração importante na sua decisão. Por isso, trabalhamos com valores justos e transparentes, sempre focados no retorno que você obterá. Nossos preços refletem a qualidade do serviço e os resultados que entregamos. Quando você investe em ${title}, está investindo em qualidade, experiência e resultados garantidos. Oferecemos diferentes opções de pagamento para facilitar sua decisão. Além disso, trabalhamos com total transparência - sem custos ocultos ou surpresas. O valor que você investe hoje se transformará em resultados que superarão suas expectativas. Não é um gasto, é um investimento no seu sucesso.`,
          cta: "Solicitar Orçamento"
        }
      }
    };
  }
}

export const copyAgent = new CopyAgent();