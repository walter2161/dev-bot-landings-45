import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { X, MessageCircle, Send, Loader2 } from 'lucide-react';
import { BusinessContent, contentGenerator } from '@/services/contentGenerator';

interface SellerbotChatProps {
  isOpen: boolean;
  onClose: () => void;
  businessData: BusinessContent;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const SellerbotChat: React.FC<SellerbotChatProps> = ({ isOpen, onClose, businessData }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Mensagem de boas-vindas automática
      const welcomeMessage: ChatMessage = {
        id: Date.now().toString(),
        role: 'assistant',
        content: businessData.sellerbot?.responses?.greeting || `Olá! Bem-vindo à ${businessData.title}. Como posso ajudá-lo hoje?`,
        timestamp: new Date(),
      };
      setMessages([welcomeMessage]);
    }
  }, [isOpen, businessData]);

  const addMessage = (role: 'user' | 'assistant', content: string) => {
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      role,
      content,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const handleSendMessage = async () => {
    const messageToSend = inputMessage.trim();
    if (!messageToSend || isTyping) return;

    setInputMessage('');
    addMessage('user', messageToSend);
    setIsTyping(true);

    try {
      const response = await contentGenerator.generateChatResponse(messageToSend, businessData);
      addMessage('assistant', response);
    } catch (error) {
      console.error('Erro ao gerar resposta do chat:', error);
      addMessage('assistant', 'Desculpe, ocorreu um erro. Tente novamente ou entre em contato conosco diretamente.');
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const quickActions = [
    'Quais são os seus serviços?',
    'Qual o preço?',
    'Como posso agendar?',
    'Onde vocês ficam?',
    'Horário de funcionamento'
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md h-[600px] flex flex-col bg-gradient-card border-primary/20 shadow-primary">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-primary/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center">
              <MessageCircle className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">{businessData.sellerbot?.name || `Atendente ${businessData.title}`}</h3>
              <p className="text-xs text-muted-foreground">Online agora</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0 hover:bg-primary/10"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Messages */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] p-3 rounded-lg text-sm ${
                  message.role === 'user'
                    ? 'bg-gradient-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                <p>{message.content}</p>
                <p className="text-xs opacity-70 mt-1">
                  {message.timestamp.toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-muted text-muted-foreground p-3 rounded-lg text-sm flex items-center gap-2">
                <Loader2 className="h-3 w-3 animate-spin" />
                Digitando...
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Actions (aparecem apenas no início) */}
        {messages.length <= 1 && !isTyping && (
          <div className="px-4 pb-2">
            <p className="text-xs text-muted-foreground mb-2">Perguntas rápidas:</p>
            <div className="flex flex-wrap gap-2">
              {quickActions.slice(0, 3).map((action, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => setInputMessage(action)}
                  className="text-xs h-auto py-1 px-2 hover:bg-primary/5 border-primary/30"
                >
                  {action}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="p-4 border-t border-primary/20">
          <div className="flex gap-2">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Digite sua mensagem..."
              disabled={isTyping}
              className="flex-1 bg-muted/30 text-foreground placeholder:text-muted-foreground border-primary/30 focus:border-primary"
            />
            <Button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isTyping}
              className="bg-gradient-primary hover:shadow-primary transition-all duration-300"
            >
              {isTyping ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default SellerbotChat;