import { BusinessContent } from './contentGenerator';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  message: string;
  timestamp: Date;
}

export class ChatService {
  private static mistralApiKey = 'aynCSftAcQBOlxmtmpJqVzco8K4aaTDQ';

  static async generateResponse(
    userMessage: string, 
    businessData: BusinessContent,
    chatHistory: ChatMessage[] = []
  ): Promise<string> {
    try {
      const conversationContext = chatHistory
        .slice(-6)
        .map(msg => `${msg.sender}: ${msg.message}`)
        .join('\n');

      const systemPrompt = `Você é ${businessData.sellerbot.name}, um assistente virtual especializado em ${businessData.title}.

INFORMAÇÕES DO NEGÓCIO:
- Empresa: ${businessData.title}
- Descrição: ${businessData.subtitle}
- Serviços: ${businessData.heroText}
- Contato: 
  * Email: ${businessData.contact.email}
  * Telefone: ${businessData.contact.phone}
  * Endereço: ${businessData.contact.address}

PERSONALIDADE: ${businessData.sellerbot.personality}

INSTRUÇÕES:
- Seja amigável, profissional e prestativo
- Use as informações do negócio para responder
- Mantenha respostas concisas (máximo 150 palavras)
- Use emojis quando apropriado

CONTEXTO DA CONVERSA:
${conversationContext}`;

      const response = await fetch('https://api.mistral.ai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.mistralApiKey}`
        },
        body: JSON.stringify({
          model: 'mistral-large-latest',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userMessage }
          ],
          temperature: 0.7,
          max_tokens: 300
        })
      });

      if (response.ok) {
        const data = await response.json();
        return data.choices[0].message.content;
      } else {
        throw new Error(`API Error: ${response.status}`);
      }
    } catch (error) {
      console.error('Erro na API Mistral:', error);
      return this.getFallbackResponse(userMessage, businessData);
    }
  }

  private static getFallbackResponse(message: string, businessData: BusinessContent): string {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('preço') || lowerMessage.includes('valor')) {
      return `💰 ${businessData.sellerbot.responses.pricing}\n\nContato: ${businessData.contact.phone}`;
    }
    
    if (lowerMessage.includes('serviço') || lowerMessage.includes('produto')) {
      return `🛍️ ${businessData.sellerbot.responses.services}`;
    }
    
    if (lowerMessage.includes('contato') || lowerMessage.includes('telefone')) {
      return `📞 Entre em contato:\n📧 ${businessData.contact.email}\n📱 ${businessData.contact.phone}\n📍 ${businessData.contact.address}`;
    }
    
    return `👋 Olá! Sou o ${businessData.sellerbot.name} da ${businessData.title}. Como posso ajudar você hoje?`;
  }
}