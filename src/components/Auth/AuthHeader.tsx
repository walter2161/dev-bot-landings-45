import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AuthService } from "@/services/authService";
import { LogOut, Clock } from "lucide-react";
import { toast } from "sonner";

interface AuthHeaderProps {
  onLogout: () => void;
}

export function AuthHeader({ onLogout }: AuthHeaderProps) {
  const [timeRemaining, setTimeRemaining] = useState("");

  useEffect(() => {
    const updateTime = () => {
      setTimeRemaining(AuthService.formatTimeRemaining());
    };

    updateTime();
    const interval = setInterval(updateTime, 60000); // Atualiza a cada minuto

    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    AuthService.logout();
    toast.success("Logout realizado com sucesso");
    onLogout();
  };

  return (
    <div className="bg-white border-b border-gray-200 px-4 py-2">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-4">
          <img 
            src="/lovable-uploads/f5de4620-c0b4-4faf-84c8-6c8733528789.png" 
            alt="PageJet" 
            className="h-8 object-contain"
          />
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span>Sessão expira em: {timeRemaining}</span>
          </div>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleLogout}
          className="flex items-center gap-2"
        >
          <LogOut className="w-4 h-4" />
          Sair
        </Button>
      </div>
    </div>
  );
}