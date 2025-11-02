import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { AuthService } from "@/services/authService";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { KeyRound } from "lucide-react";

interface DemoRegisterFormProps {
  onRegister: () => void;
  onBackToLogin: () => void;
}

export const DemoRegisterForm = ({ onRegister, onBackToLogin }: DemoRegisterFormProps) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [assignedKey, setAssignedKey] = useState<string | null>(null);
  const { t } = useLanguage();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !email.trim()) {
      return;
    }

    setIsLoading(true);

    try {
      const result = AuthService.registerDemo(email.trim(), name.trim());
      
      if (result.success && result.key) {
        setAssignedKey(result.key);
        toast.success(t('demo.success'));
        
        // Aguarda 3 segundos para mostrar a chave antes de redirecionar
        setTimeout(() => {
          onRegister();
        }, 3000);
      } else {
        toast.error(t('demo.emailExists'));
        setIsLoading(false);
      }
    } catch (error) {
      toast.error(t('demo.error'));
      setIsLoading(false);
    }
  };

  if (assignedKey) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <img 
              src="/lovable-uploads/f5de4620-c0b4-4faf-84c8-6c8733528789.png" 
              alt="PageJet Logo" 
              className="h-12"
            />
          </div>
          <CardTitle className="text-2xl">{t('demo.keyAssigned')}</CardTitle>
          <CardDescription>{t('demo.keyDescription')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert className="bg-primary/10 border-primary">
            <KeyRound className="h-5 w-5" />
            <AlertDescription className="ml-2">
              <div className="text-center">
                <p className="text-sm mb-2">{t('demo.yourKey')}</p>
                <p className="text-3xl font-bold font-mono tracking-widest">{assignedKey}</p>
                <p className="text-xs text-muted-foreground mt-2">{t('demo.saveKey')}</p>
              </div>
            </AlertDescription>
          </Alert>
          
          <p className="text-sm text-center text-muted-foreground">
            {t('demo.redirecting')}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <img 
            src="/lovable-uploads/f5de4620-c0b4-4faf-84c8-6c8733528789.png" 
            alt="PageJet Logo" 
            className="h-12"
          />
        </div>
        <CardTitle className="text-2xl">{t('demo.title')}</CardTitle>
        <CardDescription>{t('demo.subtitle')}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">{t('demo.name')}</Label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t('demo.namePlaceholder')}
              required
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">{t('demo.email')}</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t('demo.emailPlaceholder')}
              required
              disabled={isLoading}
            />
          </div>

          <Alert>
            <KeyRound className="h-4 w-4" />
            <AlertDescription className="ml-2 text-sm">
              {t('demo.keyInfo')}
            </AlertDescription>
          </Alert>

          <Button
            type="submit"
            className="w-full"
            disabled={isLoading || !name.trim() || !email.trim()}
          >
            {isLoading ? "..." : t('demo.createAccount')}
          </Button>

          <Button
            type="button"
            variant="ghost"
            className="w-full"
            onClick={onBackToLogin}
            disabled={isLoading}
          >
            {t('demo.backToLogin')}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
