
const MISTRAL_API_KEY = "aynCSftAcQBOlxmtmpJqVzco8K4aaTDQ";
const MISTRAL_API_URL = "https://api.mistral.ai/v1/chat/completions";

export interface SellerbotConfig {
  name: string;
  personality: string;
  knowledge: string[];
  prohibitions?: string;
  responses: {
    greeting: string;
    services: string;
    pricing: string;
    appointment: string;
  };
}

export class SellerbotAgent {
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
          max_tokens: 1000,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Sellerbot API error ${response.status}:`, errorText);
        throw new Error(`API error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      console.error("Erro na API de Sellerbot:", error);
      throw error;
    }
  }

  async generateSellerbot(businessType: string, title: string, businessData?: any): Promise<SellerbotConfig> {
    const locationInfo = businessData?.contact ? `
    Localização: ${businessData.contact.address}
    Telefone: ${businessData.contact.phone}
    Email: ${businessData.contact.email}
    WhatsApp: ${businessData.contact.socialMedia?.whatsapp || 'Não informado'}` : '';

    const servicesInfo = businessData?.sections ? `
    Serviços/Produtos principais: ${businessData.sections.map(s => s.title).join(', ')}` : '';

    const prompt = `Crie um assistente virtual inteligente para: "${businessType} - ${title}"

INFORMAÇÕES DO NEGÓCIO:${locationInfo}${servicesInfo}

O assistente deve ser programado para:
1. Fornecer informações de contato e localização quando perguntado
2. Explicar produtos/serviços baseado nas seções da landing page
3. Orientar sobre valores e formas de pagamento
4. Agendar consultas ou reuniões
5. Responder dúvidas específicas sobre o negócio

Retorne APENAS JSON:
{
  "name": "Nome profissional do assistente para ${businessType}",
  "personality": "Personalidade consultiva, profissional e orientada a resultados. Sempre menciona informações de contato quando relevante.",
  "knowledge": [
    "Especialista em ${businessType} com conhecimento detalhado dos serviços",
    "Informações completas de contato e localização da empresa",
    "Processos de atendimento, agendamento e formas de pagamento",
    "Orientações sobre como iniciar o relacionamento comercial"
  ],
  "prohibitions": "Não inventar preços ou promoções. Sempre direcionar para contato direto para orçamentos. Não fazer promessas que não pode cumprir.",
  "responses": {
    "greeting": "Saudação calorosa mencionando ${title} e oferecendo ajuda específica",
    "services": "Apresentação detalhada dos produtos/serviços com benefícios claros",
    "pricing": "Orientação sobre consulta de preços com informações de contato",
    "appointment": "Processo claro de agendamento com WhatsApp ou telefone"
  }
}`;

    try {
      const response = await this.makeRequest(prompt);
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      
      throw new Error("Resposta inválida da API de Sellerbot");
    } catch (error) {
      console.error("Erro ao gerar sellerbot:", error);
      
      // Fallback: retornar sellerbot padrão
      return this.generateFallbackSellerbot(businessType, title);
    }
  }

  private generateFallbackSellerbot(businessType: string, title: string): SellerbotConfig {
    return {
      name: "Assistente Virtual",
      personality: "Profissional, prestativo e focado em ajudar os clientes",
      knowledge: [
        `Especialista em ${businessType}`,
        "Produtos e serviços de qualidade",
        "Atendimento personalizado"
      ],
      responses: {
        greeting: `Olá! Sou o assistente virtual do ${title}. Como posso ajudá-lo hoje?`,
        services: `Oferecemos os melhores serviços em ${businessType}. Gostaria de saber mais detalhes?`,
        pricing: "Temos opções que cabem no seu orçamento. Que tal conversarmos sobre suas necessidades?",
        appointment: "Ficarei feliz em conectá-lo com nossa equipe. Vamos agendar um contato?"
      }
    };
  }

  async generateChatResponse(message: string, businessData: any): Promise<string> {
    const servicesInfo = businessData.sections?.slice(1).map(s => `${s.title}: ${s.content}`).join('\n') || '';
    const prohibitions = businessData.sellerbot.prohibitions || '';

    const prompt = `Você é ${businessData.sellerbot.name}, assistente especializado de ${businessData.title}.

PERSONALIDADE: ${businessData.sellerbot.personality}

CONHECIMENTOS ESPECÍFICOS:
${businessData.sellerbot.knowledge.join('\n- ')}

INFORMAÇÕES DE CONTATO (use quando apropriado):
- Endereço: ${businessData.contact.address}
- Telefone: ${businessData.contact.phone}  
- Email: ${businessData.contact.email}
- WhatsApp: ${businessData.contact.socialMedia?.whatsapp || 'Não informado'}

SERVIÇOS/PRODUTOS:
${servicesInfo}

PROIBIÇÕES: ${prohibitions}

DIRETRIZES INTELIGENTES:
- Para perguntas sobre localização/endereço: forneça o endereço completo
- Para perguntas sobre contato: mencione WhatsApp e telefone
- Para perguntas sobre preços: oriente para contato direto
- Para perguntas sobre agendamento: use as informações de contato
- Para dúvidas sobre serviços: use as informações das seções da landing page
- Seja consultivo e sempre ofereça próximos passos claros

INSTRUÇÕES:
- Responda APENAS sobre ${businessData.title}
- Use informações específicas do negócio
- Seja natural, consultivo e orientado a resultados
- Máximo 250 caracteres
- Sempre termine com uma pergunta ou próximo passo

Mensagem do cliente: "${message}"`;

    try {
      return await this.makeRequest(prompt);
    } catch (error) {
      console.error("Erro no chat:", error);
      return businessData.sellerbot.responses.greeting;
    }
  }
}

export const sellerbotAgent = new SellerbotAgent();
