import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Copy, QrCode, MessageCircle, Zap, CreditCard } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

interface PaymentModalProps {
  children: React.ReactNode;
}

const PaymentModal = ({ children }: PaymentModalProps) => {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);

  const pixKey = "30893440841";
  const amount = "39.00";
  const description = "PageJet - Assinatura Mensal";
  const whatsappNumber = "5511974698846";

  const pixPaymentString = `00020126580014BR.GOV.BCB.PIX013630893440841520400005303986540539.005802BR5925PageJet Assinatura Mensal6009SAO PAULO62070503***63041D41`;

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copiado!",
        description: `${type} copiado para a área de transferência`,
      });
    } catch (err) {
      toast({
        title: "Erro",
        description: "Não foi possível copiar. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const sendToWhatsApp = () => {
    const message = `Olá! Acabei de assinar o PageJet por R$ 39,00/mês. Segue os dados do pagamento PIX:%0A%0AChave PIX: ${pixKey}%0AValor: R$ ${amount}%0ADescrição: ${description}%0A%0AGostaria de enviar o comprovante de pagamento.`;
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${message}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-md mx-auto bg-gradient-to-br from-card to-accent/30 border-border/50 backdrop-blur-sm max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center text-foreground flex items-center justify-center gap-2">
            <CreditCard className="h-6 w-6 text-primary" />
            Pagamento PIX
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Informações do pagamento */}
          <Card className="bg-gradient-to-r from-primary/10 to-primary-glow/10 border-primary/20 p-6">
            <div className="text-center space-y-2">
              <h3 className="text-xl font-bold text-primary">PageJet - Assinatura Mensal</h3>
              <p className="text-3xl font-bold text-foreground">R$ 39,00</p>
              <p className="text-sm text-muted-foreground">Pagamento recorrente mensal</p>
            </div>
          </Card>

          {/* QR Code */}
          <Card className="p-6 text-center bg-background/50">
            <div className="flex flex-col items-center space-y-4">
              <QrCode className="h-32 w-32 text-primary" />
              <p className="text-sm text-muted-foreground">Escaneie o QR Code com seu app bancário</p>
            </div>
          </Card>

          {/* Chave PIX */}
          <Card className="p-4 bg-muted/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Chave PIX (CPF)</p>
                <p className="font-mono font-bold text-foreground">{pixKey}</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(pixKey, "Chave PIX")}
                className="border-primary/50 hover:bg-primary hover:text-primary-foreground"
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </Card>

          {/* Botões de ação */}
          <div className="space-y-3">
            <Button
              onClick={() => copyToClipboard(pixPaymentString, "Código PIX")}
              className="w-full bg-gradient-to-r from-primary to-primary-glow hover:from-primary-glow hover:to-primary text-primary-foreground"
              size="lg"
            >
              <Copy className="mr-2 h-5 w-5" />
              Copiar Código PIX
            </Button>

            <Button
              onClick={sendToWhatsApp}
              variant="outline"
              className="w-full border-green-500 text-green-500 hover:bg-green-500 hover:text-white"
              size="lg"
            >
              <MessageCircle className="mr-2 h-5 w-5" />
              Enviar Comprovante via WhatsApp
            </Button>
          </div>

          {/* Instruções */}
          <Card className="p-4 bg-accent/20 border-accent/30">
            <div className="text-sm text-muted-foreground space-y-2">
              <p className="font-semibold text-foreground">📋 Como pagar:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Escaneie o QR Code ou copie a chave PIX</li>
                <li>Realize o pagamento de R$ 39,00</li>
                <li>Envie o comprovante via WhatsApp</li>
                <li>Receba sua chave de acesso por email</li>
              </ul>
            </div>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentModal;