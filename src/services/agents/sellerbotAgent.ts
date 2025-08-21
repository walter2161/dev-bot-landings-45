
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
        throw new Error(`API error: ${response.statusText}`);
      }

      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      console.error("Erro na API:", error);
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
      
      throw new Error("Resposta inválida");
    } catch (error) {
      console.error("Erro ao gerar sellerbot:", error);
      throw error;
    }
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
