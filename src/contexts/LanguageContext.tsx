import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

export type Language = 'pt' | 'en' | 'es';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Detectar país/idioma baseado na localização
const detectLanguage = (): Language => {
  try {
    // Primeiro tenta detectar pelo navigator
    const browserLang = navigator.language.toLowerCase();
    
    // Se for português (Brasil) ou contém 'br'
    if (browserLang.startsWith('pt') || browserLang.includes('br')) {
      return 'pt';
    }
    
    // Se for espanhol
    if (browserLang.startsWith('es')) {
      return 'es';
    }
    
    // Tentar detectar pelo timezone (aproximação para Brasil)
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (timezone.includes('America/Sao_Paulo') || 
        timezone.includes('America/Fortaleza') ||
        timezone.includes('America/Recife') ||
        timezone.includes('America/Manaus') ||
        timezone.includes('America/Belem')) {
      return 'pt';
    }
    
    // Detectar pelo locale se disponível
    const locale = navigator.language || navigator.languages?.[0];
    if (locale?.toLowerCase().startsWith('pt')) {
      return 'pt'; 
    }
    
    // Padrão: inglês para qualquer outro lugar (incluindo EUA com VPN)
    return 'en';
  } catch {
    // Fallback para inglês se houver erro na detecção
    return 'en';
  }
};

const translations = {
  pt: {
    // Navegação
    'nav.home': 'Início',
    'nav.features': 'Recursos',
    'nav.about': 'Sobre',
    'nav.pricing': 'Preços',
    'nav.contact': 'Contato',
    
    // Landing Page
    'landing.hero.title': 'Crie Sites Profissionais em Segundos',
    'landing.hero.subtitle': 'Transforme suas ideias em sites de vendas com chat IA integrado',
    'landing.hero.cta': 'Começar Grátis',
    'landing.features.title': 'Por que escolher o PageJet?',
    'landing.mascot.title': 'Conheça o JetBot',
    'landing.mascot.subtitle': 'Seu assistente inteligente para criação de sites com chat IA',
    'landing.video.title': 'Veja como funciona',
    'landing.video.subtitle': 'Descubra como criar sites profissionais com chat IA em minutos',
    'landing.video.cta': 'Criar Meu Site',
    'landing.nationality.brazil': '🇧🇷 Brasil',
    'landing.nationality.usa': '🇺🇸 Estados Unidos',
    'landing.nationality.spain': '🇪🇸 Espanha',
    
    // Login
    'login.title': 'Acesso PageJet',
    'login.subtitle': 'Digite sua chave de acesso de 6 caracteres',
    'login.placeholder': '••••••',
    'login.button': 'Acessar',
    'login.button.loading': 'Verificando...',
    'login.back': '← Voltar para página inicial',
    'login.session': 'Sessão válida por 24 horas após o login',
    'login.error.length': 'Chave de acesso deve ter 6 caracteres',
    'login.error.invalid': 'Chave de acesso inválida',
    'login.error.general': 'Erro ao fazer login',
    'login.success': 'Login realizado com sucesso! Sessão válida por 24h',
    
    // App
    'app.loading': 'Carregando...',
    'app.briefing.title': 'Briefing',
    'app.content.title': 'Conteúdo', 
    'app.design.title': 'Design',
    'app.images.title': 'Imagens',
    'app.layout.title': 'Layout',
    'app.seo.title': 'SEO',
    'app.sellerbot.title': 'Sellerbot',
    
    // Mensagens gerais
    'common.yes': 'Sim',
    'common.no': 'Não',
    'common.save': 'Salvar',
    'common.cancel': 'Cancelar',
    'common.continue': 'Continuar',
    'common.back': 'Voltar',
    'common.next': 'Próximo',
    'common.previous': 'Anterior',
  },
  
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.features': 'Features',
    'nav.about': 'About',
    'nav.pricing': 'Pricing',
    'nav.contact': 'Contact',
    
    // Landing Page
    'landing.hero.title': 'Create Professional Websites in Seconds',
    'landing.hero.subtitle': 'Transform your ideas into sales websites with integrated AI chat',
    'landing.hero.cta': 'Start Free',
    'landing.features.title': 'Why choose PageJet?',
    'landing.mascot.title': 'Meet JetBot',
    'landing.mascot.subtitle': 'Your smart assistant for creating websites with AI chat',
    'landing.video.title': 'See how it works',
    'landing.video.subtitle': 'Discover how to create professional websites with AI chat in minutes',
    'landing.video.cta': 'Create My Website',
    'landing.nationality.brazil': '🇧🇷 Brazil',
    'landing.nationality.usa': '🇺🇸 United States',
    'landing.nationality.spain': '🇪🇸 Spain',
    
    // Login
    'login.title': 'PageJet Access',
    'login.subtitle': 'Enter your 6-character access key',
    'login.placeholder': '••••••',
    'login.button': 'Access',
    'login.button.loading': 'Verifying...',
    'login.back': '← Back to home page',
    'login.session': 'Session valid for 24 hours after login',
    'login.error.length': 'Access key must have 6 characters',
    'login.error.invalid': 'Invalid access key',
    'login.error.general': 'Login error',
    'login.success': 'Login successful! Session valid for 24h',
    
    // App
    'app.loading': 'Loading...',
    'app.briefing.title': 'Briefing',
    'app.content.title': 'Content',
    'app.design.title': 'Design', 
    'app.images.title': 'Images',
    'app.layout.title': 'Layout',
    'app.seo.title': 'SEO',
    'app.sellerbot.title': 'Sellerbot',
    
    // General messages
    'common.yes': 'Yes',
    'common.no': 'No',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.continue': 'Continue',
    'common.back': 'Back',
    'common.next': 'Next',
    'common.previous': 'Previous',
  },
  
  es: {
    // Navegación
    'nav.home': 'Inicio',
    'nav.features': 'Características',
    'nav.about': 'Acerca de',
    'nav.pricing': 'Precios',
    'nav.contact': 'Contacto',
    
    // Landing Page
    'landing.hero.title': 'Crea Sitios Web Profesionales en Segundos',
    'landing.hero.subtitle': 'Transforma tus ideas en sitios de ventas con chat IA integrado',
    'landing.hero.cta': 'Comenzar Gratis',
    'landing.features.title': '¿Por qué elegir PageJet?',
    'landing.mascot.title': 'Conoce a JetBot',
    'landing.mascot.subtitle': 'Tu asistente inteligente para crear sitios web con chat IA',
    'landing.video.title': 'Mira cómo funciona',
    'landing.video.subtitle': 'Descubre cómo crear sitios web profesionales con chat IA en minutos',
    'landing.video.cta': 'Crear Mi Sitio Web',
    'landing.nationality.brazil': '🇧🇷 Brasil',
    'landing.nationality.usa': '🇺🇸 Estados Unidos',
    'landing.nationality.spain': '🇪🇸 España',
    
    // Login
    'login.title': 'Acceso PageJet',
    'login.subtitle': 'Ingresa tu clave de acceso de 6 caracteres',
    'login.placeholder': '••••••',
    'login.button': 'Acceder',
    'login.button.loading': 'Verificando...',
    'login.back': '← Volver a la página de inicio',
    'login.session': 'Sesión válida por 24 horas después del login',
    'login.error.length': 'La clave de acceso debe tener 6 caracteres',
    'login.error.invalid': 'Clave de acceso inválida',
    'login.error.general': 'Error al iniciar sesión',
    'login.success': '¡Login exitoso! Sesión válida por 24h',
    
    // App
    'app.loading': 'Cargando...',
    'app.briefing.title': 'Briefing',
    'app.content.title': 'Contenido',
    'app.design.title': 'Diseño',
    'app.images.title': 'Imágenes',
    'app.layout.title': 'Layout',
    'app.seo.title': 'SEO',
    'app.sellerbot.title': 'Sellerbot',
    
    // Mensajes generales
    'common.yes': 'Sí',
    'common.no': 'No',
    'common.save': 'Guardar',
    'common.cancel': 'Cancelar',
    'common.continue': 'Continuar',
    'common.back': 'Atrás',
    'common.next': 'Siguiente',
    'common.previous': 'Anterior',
  }
};

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider = ({ children }: LanguageProviderProps) => {
  const [language, setLanguageState] = useState<Language>(() => {
    // Primeiro verifica se há idioma salvo no localStorage
    const saved = localStorage.getItem('pagejet-language');
    if (saved && ['pt', 'en', 'es'].includes(saved)) {
      return saved as Language;
    }
    // Senão, detecta automaticamente
    return detectLanguage();
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('pagejet-language', lang);
  };

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations[typeof language]] || key;
  };

  useEffect(() => {
    // Salva o idioma detectado no localStorage na primeira execução
    if (!localStorage.getItem('pagejet-language')) {
      localStorage.setItem('pagejet-language', language);
    }
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};