
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

  async generateSellerbot(businessType: string, title: string): Promise<SellerbotConfig> {
    const prompt = `Crie assistente para: "${businessType} - ${title}"

Retorne APENAS JSON:
{
  "name": "Nome do assistente apropriado para ${businessType}",
  "personality": "Personalidade profissional adequada",
  "knowledge": [
    "Conhecimento específico sobre ${businessType}",
    "Produtos/serviços oferecidos",
    "Processo de atendimento"
  ],
  "responses": {
    "greeting": "Saudação específica do ${businessType}",
    "services": "Apresentação dos produtos/serviços",
    "pricing": "Informações sobre preços",
    "appointment": "Resposta sobre agendamento/compra"
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
    const prompt = `Você é ${businessData.sellerbot.name}, assistente de ${businessData.title}.

Personalidade: ${businessData.sellerbot.personality}
Conhecimentos: ${businessData.sellerbot.knowledge.join(", ")}

INFORMAÇÕES:
- Endereço: ${businessData.contact.address}
- Telefone: ${businessData.contact.phone}
- Email: ${businessData.contact.email}
- WhatsApp: ${businessData.contact.socialMedia.whatsapp || 'Não informado'}

INSTRUÇÕES:
- Responda APENAS sobre ${businessData.title}
- Use informações de contato quando relevante
- Seja natural e profissional
- Máximo 200 caracteres

Mensagem: "${message}"`;

    try {
      return await this.makeRequest(prompt);
    } catch (error) {
      console.error("Erro no chat:", error);
      return businessData.sellerbot.responses.greeting;
    }
  }
}

export const sellerbotAgent = new SellerbotAgent();
