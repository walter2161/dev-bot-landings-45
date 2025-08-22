// Proxy para o chat sellerbot nas landing pages
export class SellerbotProxy {
  private static mistralApiKey = 'aynCSftAcQBOlxmtmpJqVzco8K4aaTDQ';

  static async handleChatRequest(userMessage: string, businessData: any): Promise<string> {
    try {
      const response = await fetch('https://api.mistral.ai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.mistralApiKey}`
        },
        body: JSON.stringify({
          model: 'mistral-large-latest',
          messages: [{
            role: 'system',
            content: `Você é ${businessData.sellerbot.name}.
Personalidade: ${businessData.sellerbot.personality}
Conhecimento: ${businessData.sellerbot.knowledge.join(', ')}
Empresa: ${businessData.title}
Produtos/Serviços: ${businessData.subtitle}
Contato: ${businessData.contact.email}, ${businessData.contact.phone}

Responda de forma amigável, profissional e ajude com informações sobre a empresa.`
          }, {
            role: 'user',
            content: userMessage
          }],
          temperature: 0.7,
          max_tokens: 500
        })
      });

      if (response.ok) {
        const data = await response.json();
        return data.choices[0].message.content;
      } else {
        throw new Error('Erro na API Mistral');
      }
    } catch (error) {
      // Fallback para respostas predefinidas
      const fallbackResponses = [
        businessData.sellerbot.responses.services,
        businessData.sellerbot.responses.pricing,
        businessData.sellerbot.responses.appointment
      ];
      return fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
    }
  }
}