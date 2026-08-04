import { useNavigate } from "react-router-dom";
import { Music, Calendar, Users, BarChart3, ArrowRight, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  {
    icon: Calendar,
    title: "Escalas Inteligentes",
    description: "Sistema de rodízio automático que respeita disponibilidades e funções de cada membro.",
  },
  {
    icon: Users,
    title: "Gestão de Membros",
    description: "Cadastre membros, atribua funções e acompanhe a participação de cada um.",
  },
  {
    icon: Music,
    title: "Repertório Completo",
    description: "Organize músicas com tom, BPM, letras e links para plataformas de streaming.",
  },
  {
    icon: BarChart3,
    title: "Relatórios Detalhados",
    description: "Acompanhe participação, confirmações e histórico de escalas com exportação em PDF.",
  },
];

const benefits = [
  "Notificações automáticas via WhatsApp e e-mail",
  "Confirmação e recusa de escalas pelo app",
  "Histórico completo de participações",
  "Interface intuitiva para toda a equipe",
  "Acesso mobile e desktop",
  "Exportação de relatórios em PDF",
];

export default function Index() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-accent to-[hsl(30_80%_45%)] flex items-center justify-center shadow-gold">
              <Music className="w-5 h-5 text-primary" />
            </div>
            <span className="font-display text-xl font-semibold text-foreground">
              Gestão de Louvor
            </span>
          </div>
          
          <Button variant="gold" onClick={() => navigate("/login")}>
            Entrar
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="container mx-auto text-center max-w-4xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium mb-8 animate-fade-in">
            <Music className="w-4 h-4" />
            Sistema completo para seu ministério
          </div>
          
          <h1 className="font-display text-5xl md:text-7xl font-bold text-foreground mb-6 animate-slide-up">
            Organize seu ministério de{" "}
            <span className="gradient-text">louvor</span>
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-slide-up" style={{ animationDelay: "100ms" }}>
            Escalas, repertório, membros e comunicação em um único lugar. 
            Simplifique a gestão e fortaleça a comunhão da sua equipe.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up" style={{ animationDelay: "200ms" }}>
            <Button variant="gold" size="xl" onClick={() => navigate("/login")}>
              Começar Agora
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-secondary/30">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl font-bold text-foreground mb-4">
              Tudo que você precisa
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Ferramentas pensadas para facilitar a organização do seu ministério de louvor
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="card-church p-6 text-center animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="w-14 h-14 rounded-xl bg-accent/10 flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-7 h-7 text-accent" />
                </div>
                <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-display text-4xl font-bold text-foreground mb-6">
                Simplifique a comunicação com sua equipe
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Reduza o tempo gasto organizando escalas e melhore a comunicação entre todos os membros do ministério.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-accent shrink-0" />
                    <span className="text-foreground">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="card-church p-8 bg-gradient-to-br from-navy/5 to-accent/5">
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 bg-card rounded-lg border border-border">
                    <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                      <span className="font-semibold text-accent">MS</span>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-foreground">Maria Silva</p>
                      <p className="text-sm text-muted-foreground">Confirmou para domingo</p>
                    </div>
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                      Confirmado
                    </span>
                  </div>

                  <div className="flex items-center gap-4 p-4 bg-card rounded-lg border border-border">
                    <div className="w-10 h-10 rounded-full bg-navy/10 flex items-center justify-center">
                      <span className="font-semibold text-navy">JS</span>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-foreground">João Santos</p>
                      <p className="text-sm text-muted-foreground">Aguardando confirmação</p>
                    </div>
                    <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-medium">
                      Pendente
                    </span>
                  </div>

                  <div className="flex items-center gap-4 p-4 bg-card rounded-lg border border-border">
                    <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                      <span className="font-semibold text-accent">AC</span>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-foreground">Ana Costa</p>
                      <p className="text-sm text-muted-foreground">Confirmou para domingo</p>
                    </div>
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                      Confirmado
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto">
          <div className="card-church p-12 bg-gradient-to-br from-navy to-navy-light text-center">
            <h2 className="font-display text-4xl font-bold text-primary-foreground mb-4">
              Pronto para começar?
            </h2>
            <p className="text-xl text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
              Entre agora e comece a organizar seu ministério de louvor de forma simples e eficiente.
            </p>
            <Button
              variant="gold"
              size="xl"
              onClick={() => navigate("/login")}
            >
              Acessar o Sistema
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-border">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Music className="w-5 h-5 text-accent" />
            <span className="font-display text-lg font-semibold text-foreground">
              Gestão de Louvor
            </span>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2024 Gestão de Louvor. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}
