import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check, Star, Zap, Target, TrendingUp, Shield, Clock, Users, Trophy, Rocket } from "lucide-react";
import { Link } from "react-router-dom";

const LandingPage = () => {
  const handlePixPayment = () => {
    // Simula redirecionamento para pagamento PIX
    alert("Redirecionando para pagamento PIX - Chave CPF: 308.934.408-41 - Valor: R$ 39,00/mês");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-orange-500">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <img 
              src="/lovable-uploads/f5de4620-c0b4-4faf-84c8-6c8733528789.png" 
              alt="PageJet" 
              className="h-8 object-contain"
            />
            <h1 className="text-2xl font-bold text-white">PageJet</h1>
          </div>
          <Link to="/login">
            <Button variant="outline" className="text-white border-white hover:bg-white hover:text-slate-900">
              Fazer Login
            </Button>
          </Link>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-5xl font-bold text-white mb-6">
            Crie Landing Pages Profissionais em <span className="text-orange-400">Segundos</span>
          </h2>
          <p className="text-xl text-gray-200 mb-8">
            O PageJet é a ferramenta de IA que transforma suas ideias em landing pages de alta conversão automaticamente
          </p>
          <Button 
            onClick={handlePixPayment}
            className="bg-orange-500 hover:bg-orange-600 text-white text-xl px-12 py-4 rounded-full shadow-2xl transform hover:scale-105 transition-all"
          >
            <Zap className="mr-2 h-6 w-6" />
            Assinar por R$ 39/mês
          </Button>
          <p className="text-gray-300 mt-4">💳 Pagamento via PIX • Cancelamento gratuito a qualquer momento</p>
        </div>
      </section>

      {/* Urgência/Escassez */}
      <section className="container mx-auto px-4 py-16">
        <Card className="bg-red-600 border-red-500 p-8 text-center">
          <h3 className="text-2xl font-bold text-white mb-4">🔥 OFERTA LIMITADA - Apenas 100 Vagas!</h3>
          <p className="text-red-100 text-lg">
            Preço promocional de lançamento por tempo limitado. Valor normal: R$ 97/mês
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
          <Button 
            onClick={handlePixPayment}
            className="bg-orange-500 hover:bg-orange-600 text-white text-2xl px-16 py-6 rounded-full shadow-2xl transform hover:scale-105 transition-all mb-4"
          >
            <Zap className="mr-3 h-8 w-8" />
            QUERO COMEÇAR AGORA - R$ 39/mês
          </Button>
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