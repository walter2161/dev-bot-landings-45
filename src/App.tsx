import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import LandingPage from "./pages/LandingPage";
import { LoginForm } from "@/components/Auth/LoginForm";
import { AuthService } from "@/services/authService";
import { useLanguage } from "@/contexts/LanguageContext";
import { LanguageProvider } from "@/contexts/LanguageContext";

const queryClient = new QueryClient();

const AppRoutes = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Rotas públicas que não precisam de autenticação
  const publicRoutes = ['/', '/login'];
  const isPublicRoute = publicRoutes.includes(location.pathname);

  if (isPublicRoute) {
    return (
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginForm onLogin={() => navigate('/app')} />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    );
  }

  // Para rotas protegidas, usa o AuthWrapper
  return <AuthWrapper />;
};

const AuthWrapper = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useLanguage();

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
          // Redireciona para o app após autenticação e limpa a URL
          navigate('/app', { replace: true });
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

      // Se não estiver autenticado, redireciona para login
      if (!authenticated) {
        navigate('/login', { replace: true });
      }
    };

    checkAuth();

    // Verifica a autenticação periodicamente
    const interval = setInterval(() => {
      const authenticated = AuthService.isAuthenticated();
      if (!authenticated) {
        setIsAuthenticated(false);
        navigate('/login', { replace: true });
      } else {
        setIsAuthenticated(authenticated);
      }
    }, 60000);

    return () => clearInterval(interval);
  }, [location.pathname, location.hash, navigate]);

  const handleLogout = () => {
    setIsAuthenticated(false);
    AuthService.logout();
    navigate('/login');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-orange-500 flex items-center justify-center">
        <div className="text-center">
          <img 
            src="/lovable-uploads/f5de4620-c0b4-4faf-84c8-6c8733528789.png" 
            alt="PageJet" 
            className="h-12 object-contain mx-auto mb-4"
          />
          <div className="text-lg text-white">{t('app.loading')}</div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // O redirecionamento já foi feito no useEffect
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
        <Route path="/app" element={<Index onLogout={handleLogout} />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </TooltipProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
};

export default App;
