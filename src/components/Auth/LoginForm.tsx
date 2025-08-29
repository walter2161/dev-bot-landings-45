import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { AuthService } from "@/services/authService";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

interface LoginFormProps {
  onLogin: () => void;
}

export function LoginForm({ onLogin }: LoginFormProps) {
  const [accessKey, setAccessKey] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useLanguage();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!accessKey || accessKey.length !== 6) {
      toast.error(t('login.error.length'));
      return;
    }

    setIsLoading(true);

    try {
      const isValid = AuthService.login(accessKey);
      
      if (isValid) {
        toast.success(t('login.success'));
        onLogin();
      } else {
        toast.error(t('login.error.invalid'));
        setAccessKey("");
      }
    } catch (error) {
      toast.error(t('login.error.general'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
    if (value.length <= 6) {
      setAccessKey(value);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-orange-500 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <img 
              src="/lovable-uploads/f5de4620-c0b4-4faf-84c8-6c8733528789.png" 
              alt="PageJet" 
              className="h-12 object-contain"
            />
          </div>
          <CardTitle className="text-2xl font-bold">{t('login.title')}</CardTitle>
          <CardDescription>
            {t('login.subtitle')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input
                type="text"
                placeholder={t('login.placeholder')}
                value={accessKey}
                onChange={handleInputChange}
                className="text-center text-lg font-mono tracking-widest"
                maxLength={6}
                autoFocus
              />
            </div>
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading || accessKey.length !== 6}
            >
              {isLoading ? t('login.button.loading') : t('login.button')}
            </Button>
          </form>
          <div className="mt-6 text-center">
            <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">
              {t('login.back')}
            </Link>
          </div>
          <div className="mt-4 text-center text-sm text-muted-foreground">
            <p>{t('login.session')}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}