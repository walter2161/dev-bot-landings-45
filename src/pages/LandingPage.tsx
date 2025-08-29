import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Check, Star, Zap, Target, TrendingUp, Shield, Clock, Users, Trophy, Rocket, Globe } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import PaymentModal from "@/components/PaymentModal";

const LandingPage = () => {
  const [selectedCountry, setSelectedCountry] = useState<string>("brasil");

  const countryContent = {
    brasil: {
      title: "Crie Landing Pages Profissionais em Segundos",
      subtitle: "O PageJet é a ferramenta de IA que transforma suas ideias em landing pages de alta conversão automaticamente",
      cta: "Assinar por R$ 39/mês",
      paymentMethod: "💳 Pagamento via PIX",
      paymentDetails: "Cancelamento gratuito • Acesso imediato",
      urgency: "🔥 OFERTA LIMITADA - Apenas 100 Vagas!",
      urgencyText: "Preço promocional de lançamento por tempo limitado. Valor normal: R$ 97/mês",
      mascotText: "Olá! Eu sou o JetBot",
      mascotDescription: "Sua inteligência artificial especialista em criar landing pages que vendem!",
      videoTitle: "📹 Veja o PageJet em Ação!",
      videoSubtitle: "Assista como criar uma landing page profissional em apenas 2 minutos"
    },
    eua: {
      title: "Create Professional Landing Pages in Seconds",
      subtitle: "PageJet is the AI tool that transforms your ideas into high-converting landing pages automatically",
      cta: "Subscribe for $9.99/month",
      paymentMethod: "💳 Payment via Card",
      paymentDetails: "Free cancellation • Instant access",
      urgency: "🔥 LIMITED OFFER - Only 100 Spots!",
      urgencyText: "Launch promotional price for limited time. Regular price: $29.99/month",
      mascotText: "Hi! I'm JetBot",
      mascotDescription: "Your artificial intelligence expert in creating landing pages that sell!",
      videoTitle: "📹 See PageJet in Action!",
      videoSubtitle: "Watch how to create a professional landing page in just 2 minutes"
    },
    espanha: {
      title: "Crea Páginas de Destino Profesionales en Segundos",
      subtitle: "PageJet es la herramienta de IA que transforma tus ideas en páginas de destino de alta conversión automáticamente",
      cta: "Suscribirse por €9.99/mes",
      paymentMethod: "💳 Pago con Tarjeta",
      paymentDetails: "Cancelación gratuita • Acceso inmediato",
      urgency: "🔥 OFERTA LIMITADA - ¡Solo 100 Plazas!",
      urgencyText: "Precio promocional de lanzamiento por tiempo limitado. Precio regular: €24.99/mes",
      mascotText: "¡Hola! Soy JetBot",
      mascotDescription: "¡Tu inteligencia artificial experta en crear páginas de destino que venden!",
      videoTitle: "📹 ¡Ve PageJet en Acción!",
      videoSubtitle: "Mira cómo crear una página de destino profesional en solo 2 minutos"
    }
  };

  const currentContent = countryContent[selectedCountry as keyof typeof countryContent];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent to-primary/90">
      {/* Header */}
      <header className="container mx-auto px-4 py-6 backdrop-blur-sm bg-background/10">
        <nav className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <img 
              src="/lovable-uploads/f5de4620-c0b4-4faf-84c8-6c8733528789.png" 
              alt="PageJet" 
              className="h-10 object-contain"
            />
          </div>
          
          {/* Seletor de País/Idioma */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-primary" />
              <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                <SelectTrigger className="w-[150px] bg-background/20 border-primary/30 text-foreground">
                  <SelectValue placeholder="País" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="brasil">🇧🇷 Brasil</SelectItem>
                  <SelectItem value="eua">🇺🇸 EUA</SelectItem>
                  <SelectItem value="espanha">🇪🇸 Espanha</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Link to="/login">
              <Button variant="outline" className="border-primary/50 text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 shadow-lg hover:shadow-primary/25">
                {selectedCountry === 'brasil' ? 'Fazer Login' : selectedCountry === 'eua' ? 'Login' : 'Iniciar Sesión'}
              </Button>
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-6xl font-bold text-foreground mb-8 leading-tight">
            {currentContent.title.split(' ').slice(0, -1).join(' ')} <span className="bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">{currentContent.title.split(' ').slice(-1)}</span>
          </h2>
          <p className="text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed">
            {currentContent.subtitle}
          </p>
          <div className="space-y-6">
            <PaymentModal>
              <Button 
                size="lg"
                className="bg-gradient-to-r from-primary to-primary-glow hover:from-primary-glow hover:to-primary text-primary-foreground text-2xl px-16 py-8 rounded-full shadow-[var(--shadow-primary)] hover:shadow-[var(--shadow-glow)] transform hover:scale-105 transition-all duration-500"
              >
                <Zap className="mr-4 h-8 w-8" />
                {currentContent.cta}
              </Button>
            </PaymentModal>
            <div className="bg-gradient-to-r from-card to-accent/50 backdrop-blur-sm border border-border p-6 rounded-2xl max-w-md mx-auto">
              <p className="text-foreground font-semibold mb-2">{currentContent.paymentMethod}</p>
              <p className="text-sm text-muted-foreground">{currentContent.paymentDetails}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Urgência/Escassez */}
      <section className="container mx-auto px-4 py-16">
        <Card className="bg-gradient-to-r from-destructive to-destructive/80 border-destructive/50 p-8 text-center shadow-[var(--shadow-accent)] backdrop-blur-sm">
          <h3 className="text-3xl font-bold text-destructive-foreground mb-4 flex items-center justify-center gap-3">
            {currentContent.urgency}
          </h3>
          <p className="text-destructive-foreground/90 text-xl">
            {currentContent.urgencyText}
          </p>
        </Card>
      </section>

      {/* Problema/Dor */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-3xl font-bold text-white mb-8">Você Está Perdendo Vendas Todos os Dias!</h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-red-400 text-6xl mb-4">❌</div>
              <h4 className="text-xl font-bold text-white mb-2">Landing Pages Caras</h4>
              <p className="text-gray-300">Pagar R$ 3.000+ para um designer criar uma landing page</p>
            </div>
            <div className="text-center">
              <div className="text-red-400 text-6xl mb-4">⏰</div>
              <h4 className="text-xl font-bold text-white mb-2">Demora Semanas</h4>
              <p className="text-gray-300">Esperar 2-4 semanas para ter sua página pronta</p>
            </div>
            <div className="text-center">
              <div className="text-red-400 text-6xl mb-4">📉</div>
              <h4 className="text-xl font-bold text-white mb-2">Baixa Conversão</h4>
              <p className="text-gray-300">Páginas genéricas que não vendem</p>
            </div>
          </div>
        </div>
      </section>

      {/* Mascote Apresentação */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex flex-col md:flex-row items-center justify-center gap-12">
            <div className="flex-shrink-0">
              <img 
                src="/lovable-uploads/97010722-94c2-481f-89d5-a6c7f1b2afe2.png" 
                alt="Mascote PageJet" 
                className="h-64 w-auto mx-auto"
              />
            </div>
            <div className="text-left">
              <h3 className="text-4xl font-bold text-white mb-6">
                {currentContent.mascotText} <span className="text-orange-400">JetBot</span>
              </h3>
              <p className="text-xl text-gray-200 mb-6">
                {currentContent.mascotDescription}
              </p>
              <p className="text-lg text-gray-300">
                Vou analisar seu produto, seu público e criar a página perfeita para maximizar suas conversões. 
                Tudo isso em menos de 2 minutos! 🚀
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Vídeo Demonstração */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8">
            <h3 className="text-4xl font-bold text-white mb-4">
              {currentContent.videoTitle}
            </h3>
            <p className="text-xl text-gray-200 mb-2">
              {currentContent.videoSubtitle}
            </p>
            <p className="text-orange-400 font-semibold text-lg">
              ⚡ Mais de 50.000 visualizações • 98% aprovação
            </p>
          </div>
          
          <div className="relative">
            {/* YouTube Video Embed */}
            <div className="relative bg-black rounded-2xl overflow-hidden shadow-2xl">
              <div className="aspect-video">
                <iframe
                  className="w-full h-full"
                  src="https://www.youtube.com/embed/dQw4w9WgXcQ?rel=0&showinfo=0&modestbranding=1"
                  title="PageJet - Como Criar Landing Pages em 2 Minutos"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
            
            {/* Overlay with Social Proof */}
            <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-green-500 to-green-600 text-white px-8 py-3 rounded-full shadow-lg">
              <div className="flex items-center space-x-2">
                <div className="flex text-yellow-300">
                  {[1,2,3,4,5].map((i) => <Star key={i} className="h-4 w-4 fill-current" />)}
                </div>
                <span className="font-semibold">4.9/5 • 1.247 reviews</span>
              </div>
            </div>
          </div>
          
          {/* CTA Logo após vídeo */}
          <div className="text-center mt-12">
            <PaymentModal>
              <Button 
                size="lg"
                className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white text-xl px-12 py-6 rounded-full shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                🚀 SIM! QUERO CRIAR MINHA PÁGINA AGORA
              </Button>
            </PaymentModal>
            <p className="text-gray-300 mt-4">💳 PIX • Acesso imediato • Apenas R$ 39/mês</p>
          </div>

          {/* Benefícios Visuais */}
          <div className="grid md:grid-cols-3 gap-8 mt-16">
            <div className="text-center bg-white/5 rounded-xl p-6 border border-white/10">
              <div className="text-4xl mb-4">⚡</div>
              <h4 className="text-lg font-bold text-white mb-2">Criação em 2 Minutos</h4>
              <p className="text-gray-300 text-sm">De briefing a página publicada automaticamente</p>
            </div>
            <div className="text-center bg-white/5 rounded-xl p-6 border border-white/10">
              <div className="text-4xl mb-4">🎨</div>
              <h4 className="text-lg font-bold text-white mb-2">Design Automático</h4>
              <p className="text-gray-300 text-sm">IA escolhe cores, fontes e layout otimizado</p>
            </div>
            <div className="text-center bg-white/5 rounded-xl p-6 border border-white/10">
              <div className="text-4xl mb-4">📈</div>
              <h4 className="text-lg font-bold text-white mb-2">Alta Conversão</h4>
              <p className="text-gray-300 text-sm">Otimizado para SEO e vendas</p>
            </div>
          </div>
        </div>
      </section>

      {/* Solução */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h3 className="text-3xl font-bold text-white text-center mb-12">
            A Solução que Vai Revolucionar Seus Resultados
          </h3>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h4 className="text-2xl font-bold text-orange-400 mb-6">PageJet - IA Avançada</h4>
              <ul className="space-y-4">
                <li className="flex items-center text-white">
                  <Check className="text-green-400 mr-3 h-5 w-5" />
                  Cria landing pages em menos de 2 minutos
                </li>
                <li className="flex items-center text-white">
                  <Check className="text-green-400 mr-3 h-5 w-5" />
                  Otimizada para conversão automaticamente
                </li>
                <li className="flex items-center text-white">
                  <Check className="text-green-400 mr-3 h-5 w-5" />
                  Design profissional responsivo
                </li>
                <li className="flex items-center text-white">
                  <Check className="text-green-400 mr-3 h-5 w-5" />
                  SEO otimizado incluído
                </li>
              </ul>
            </div>
            <div className="bg-white/10 p-8 rounded-lg">
              <div className="text-4xl mb-4">🚀</div>
              <h5 className="text-xl font-bold text-white mb-2">Resultado Garantido</h5>
              <p className="text-gray-300">Aumente suas vendas em até 300% com landing pages que realmente convertem</p>
            </div>
          </div>
        </div>
      </section>

      {/* Prova Social */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h3 className="text-3xl font-bold text-white text-center mb-12">
            Mais de 1.000 Empreendedores Já Estão Vendendo Mais
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-white/10 border-white/20 p-6">
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400">
                  {[1,2,3,4,5].map((i) => <Star key={i} className="h-5 w-5 fill-current" />)}
                </div>
              </div>
              <p className="text-white mb-4">"Criei minha landing page em 3 minutos e as vendas aumentaram 250%!"</p>
              <p className="text-gray-300">- Maria Silva, E-commerce</p>
            </Card>
            <Card className="bg-white/10 border-white/20 p-6">
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400">
                  {[1,2,3,4,5].map((i) => <Star key={i} className="h-5 w-5 fill-current" />)}
                </div>
              </div>
              <p className="text-white mb-4">"Economizei R$ 5.000 que gastaria com designer. Resultado incrível!"</p>
              <p className="text-gray-300">- João Santos, Coach</p>
            </Card>
            <Card className="bg-white/10 border-white/20 p-6">
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400">
                  {[1,2,3,4,5].map((i) => <Star key={i} className="h-5 w-5 fill-current" />)}
                </div>
              </div>
              <p className="text-white mb-4">"Ferramenta fantástica! Minha conversão dobrou em 1 semana."</p>
              <p className="text-gray-300">- Ana Costa, Infoprodutos</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefícios */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h3 className="text-3xl font-bold text-white text-center mb-12">
            Transforme Seu Negócio Hoje Mesmo
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <Target className="h-12 w-12 text-orange-400 mx-auto mb-4" />
              <h4 className="text-lg font-bold text-white mb-2">Mais Conversões</h4>
              <p className="text-gray-300">Aumente suas vendas com páginas otimizadas</p>
            </div>
            <div className="text-center">
              <Clock className="h-12 w-12 text-orange-400 mx-auto mb-4" />
              <h4 className="text-lg font-bold text-white mb-2">Economia de Tempo</h4>
              <p className="text-gray-300">Crie páginas em minutos, não semanas</p>
            </div>
            <div className="text-center">
              <Shield className="h-12 w-12 text-orange-400 mx-auto mb-4" />
              <h4 className="text-lg font-bold text-white mb-2">Economia de Dinheiro</h4>
              <p className="text-gray-300">Pague apenas R$ 39/mês vs R$ 3.000+ por página</p>
            </div>
            <div className="text-center">
              <TrendingUp className="h-12 w-12 text-orange-400 mx-auto mb-4" />
              <h4 className="text-lg font-bold text-white mb-2">Resultados Rápidos</h4>
              <p className="text-gray-300">Veja o ROI em até 24 horas</p>
            </div>
          </div>
        </div>
      </section>

      {/* Comparação */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h3 className="text-3xl font-bold text-white text-center mb-12">
            PageJet vs Concorrência
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-white/5 border-white/20 p-6">
              <h4 className="text-xl font-bold text-gray-300 text-center mb-6">Freelancer</h4>
              <ul className="space-y-3">
                <li className="text-red-400">❌ R$ 3.000+ por página</li>
                <li className="text-red-400">❌ 2-4 semanas de espera</li>
                <li className="text-red-400">❌ Sem garantia de conversão</li>
                <li className="text-red-400">❌ Alterações custam extra</li>
              </ul>
            </Card>
            <Card className="bg-orange-500/20 border-orange-500 p-6 transform scale-105">
              <h4 className="text-xl font-bold text-orange-400 text-center mb-6">PageJet ⭐</h4>
              <ul className="space-y-3">
                <li className="text-green-400">✅ R$ 39/mês ilimitado</li>
                <li className="text-green-400">✅ Páginas em 2 minutos</li>
                <li className="text-green-400">✅ Otimizado para conversão</li>
                <li className="text-green-400">✅ Alterações ilimitadas</li>
              </ul>
            </Card>
            <Card className="bg-white/5 border-white/20 p-6">
              <h4 className="text-xl font-bold text-gray-300 text-center mb-6">Outras Ferramentas</h4>
              <ul className="space-y-3">
                <li className="text-red-400">❌ R$ 97-297/mês</li>
                <li className="text-red-400">❌ Curva de aprendizado</li>
                <li className="text-red-400">❌ Templates genéricos</li>
                <li className="text-red-400">❌ Sem IA avançada</li>
              </ul>
            </Card>
          </div>
        </div>
      </section>

      {/* Autoridade */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-3xl font-bold text-white mb-8">
            Desenvolvido por Especialistas em Conversão
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <Trophy className="h-16 w-16 text-orange-400 mx-auto mb-4" />
              <h4 className="text-xl font-bold text-white mb-2">+10 Anos</h4>
              <p className="text-gray-300">Experiência em marketing digital</p>
            </div>
            <div>
              <Users className="h-16 w-16 text-orange-400 mx-auto mb-4" />
              <h4 className="text-xl font-bold text-white mb-2">+100M</h4>
              <p className="text-gray-300">Páginas analisadas pela IA</p>
            </div>
            <div>
              <Rocket className="h-16 w-16 text-orange-400 mx-auto mb-4" />
              <h4 className="text-xl font-bold text-white mb-2">+300%</h4>
              <p className="text-gray-300">Aumento médio na conversão</p>
            </div>
          </div>
        </div>
      </section>

      {/* Garantia */}
      <section className="container mx-auto px-4 py-16">
        <Card className="bg-green-600 border-green-500 p-8 text-center max-w-2xl mx-auto">
          <Shield className="h-16 w-16 text-white mx-auto mb-6" />
          <h3 className="text-2xl font-bold text-white mb-4">Garantia de 30 Dias</h3>
          <p className="text-green-100 text-lg">
            Se você não aumentar suas conversões em 30 dias, devolvemos 100% do seu dinheiro. Sem perguntas.
          </p>
        </Card>
      </section>

      {/* CTA Final */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-2xl mx-auto">
          <h3 className="text-4xl font-bold text-white mb-6">
            Comece a Vender Mais Hoje!
          </h3>
          <p className="text-xl text-gray-200 mb-8">
            Junte-se a mais de 1.000 empreendedores que já transformaram seus resultados
          </p>
          <PaymentModal>
            <Button 
              className="bg-orange-500 hover:bg-orange-600 text-white text-2xl px-16 py-6 rounded-full shadow-2xl transform hover:scale-105 transition-all mb-4"
            >
              <Zap className="mr-3 h-8 w-8" />
              QUERO COMEÇAR AGORA - R$ 39/mês
            </Button>
          </PaymentModal>
          <p className="text-gray-300 mb-4">💳 Pagamento via PIX • Acesso imediato após confirmação</p>
          <p className="text-sm text-gray-400">Chave PIX: 308.934.408-41 (CPF) • Cancelamento gratuito</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black/50 py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-400">© 2024 PageJet. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;