
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

Crie um assistente especializado que seja:
- Nome profissional adequado para ${businessType}
- Personalidade consultiva e focada em resultados
- Conhecimento específico sobre ${businessType}
- Informações de contato sempre disponíveis
- Orientação sobre preços sem inventar valores
- Processo claro de agendamento

Responda apenas com o nome do assistente, personalidade, conhecimentos e respostas padrão.`;

    try {
      // Simplesmente retorna fallback sem tentar parsing de JSON
      return this.generateFallbackSellerbot(businessType, title, businessData);
    } catch (error) {
      console.error("Erro ao gerar sellerbot:", error);
      return this.generateFallbackSellerbot(businessType, title, businessData);
    }
  }

  private generateFallbackSellerbot(businessType: string, title: string, businessData?: any): SellerbotConfig {
    const contact = businessData?.contact;
    const whatsapp = contact?.socialMedia?.whatsapp || contact?.phone || '';
    const phone = contact?.phone || '';
    const email = contact?.email || '';
    const address = contact?.address || '';

    return {
      name: `Assistente ${title}`,
      personality: "Profissional, consultivo e especializado em ajudar clientes com informações precisas sobre nossos serviços",
      knowledge: [
        `Especialista em ${businessType} com conhecimento completo da empresa`,
        contact ? `Informações de contato: ${phone}, ${email}` : "Informações básicas sobre a empresa",
        `Localização: ${address || 'Disponível para consulta'}`,
        "Processo de atendimento e agendamento especializado"
      ],
      responses: {
        greeting: `Olá! Sou o assistente virtual da ${title}. Como posso ajudá-lo hoje?`,
        services: `Somos especialistas em ${businessType.toLowerCase()} e oferecemos os melhores serviços do mercado. Posso explicar nossos diferenciais!`,
        pricing: `Para valores e condições especiais, ${whatsapp ? `entre em contato pelo WhatsApp ${whatsapp}` : phone ? `ligue para ${phone}` : email ? `envie um email para ${email}` : 'entre em contato conosco'}`,
        appointment: `Vamos agendar! ${whatsapp ? `Mande uma mensagem no WhatsApp ${whatsapp}` : phone ? `Ligue para ${phone}` : email ? `Envie um email para ${email}` : 'Entre em contato'} que organizamos tudo para você.`
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
