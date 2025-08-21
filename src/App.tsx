import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { LoginForm } from "@/components/Auth/LoginForm";
import { AuthService } from "@/services/authService";

const queryClient = new QueryClient();

const AuthWrapper = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = () => {
      // Primeiro verifica se há um token hex na URL (pathname ou hash)
      const pathParam = location.pathname.slice(1); // Remove a barra inicial
      const hashParam = location.hash.slice(1); // Remove o # inicial
      
      const hexToken = pathParam || hashParam;
      
      if (hexToken && hexToken.length > 10 && !hexToken.includes('/')) {
        // Tenta autenticar com hex
        if (AuthService.loginWithHex(hexToken)) {
          setIsAuthenticated(true);
          setIsLoading(false);
          // Redireciona para a home após autenticação e limpa a URL
          navigate('/', { replace: true });
          // Limpa o hash se foi usado
          if (hashParam) {
            window.location.hash = '';
          }
          return;
        }
      }

      // Verifica autenticação normal
      const authenticated = AuthService.isAuthenticated();
      setIsAuthenticated(authenticated);
      setIsLoading(false);
    };

    checkAuth();

    // Verifica a autenticação periodicamente
    const interval = setInterval(() => {
      const authenticated = AuthService.isAuthenticated();
      setIsAuthenticated(authenticated);
    }, 60000);

    return () => clearInterval(interval);
  }, [location.pathname, location.hash, navigate]);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <img 
            src="/lovable-uploads/f5de4620-c0b4-4faf-84c8-6c8733528789.png" 
            alt="PageJet" 
            className="h-12 object-contain mx-auto mb-4"
          />
          <div className="text-lg">Carregando...</div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginForm onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
        <Route path="/" element={<Index onLogout={handleLogout} />} />
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthWrapper />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
