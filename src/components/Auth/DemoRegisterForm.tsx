import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { AuthService } from "@/services/authService";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";

interface DemoRegisterFormProps {
  onRegister: () => void;
  onBackToLogin: () => void;
}

export const DemoRegisterForm = ({ onRegister, onBackToLogin }: DemoRegisterFormProps) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useLanguage();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !email.trim() || password.length < 6) {
      return;
    }

    setIsLoading(true);

    try {
      const success = AuthService.registerDemo(email.trim(), password, name.trim());
      
      if (success) {
        toast.success(t('demo.success'));
        onRegister();
      } else {
        toast.error(t('demo.emailExists'));
      }
    } catch (error) {
      toast.error(t('demo.error'));
    } finally {
      setIsLoading(false);
    }
  };

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

          <div className="space-y-2">
            <Label htmlFor="password">{t('demo.password')}</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t('demo.passwordPlaceholder')}
              minLength={6}
              required
              disabled={isLoading}
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isLoading || !name.trim() || !email.trim() || password.length < 6}
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
