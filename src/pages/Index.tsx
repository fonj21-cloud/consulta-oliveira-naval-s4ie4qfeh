import { Briefcase, Clock, CheckCircle2, Building2, Gavel, Scale } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { ProcessSearch } from '@/components/ProcessSearch'

export default function Index() {
  const stats = [
    {
      title: 'Processos Ativos',
      value: '4.231',
      icon: Briefcase,
      color: 'text-blue-500',
      bg: 'bg-blue-50',
    },
    {
      title: 'Últimas Atualizações',
      value: '142',
      icon: Clock,
      color: 'text-amber-500',
      bg: 'bg-amber-50',
    },
    {
      title: 'Casos Concluídos',
      value: '12.890',
      icon: CheckCircle2,
      color: 'text-emerald-500',
      bg: 'bg-emerald-50',
    },
  ]

  const shortcuts = [
    {
      title: 'PJe 1º Grau TRT1',
      desc: 'Acesso ao sistema judicial de primeira instância.',
      icon: Gavel,
    },
    {
      title: 'PJe 2º Grau TRT1',
      desc: 'Acesso ao sistema judicial de segunda instância.',
      icon: Scale,
    },
    {
      title: 'Consulta Pública',
      desc: 'Pesquisa geral de jurisprudência e processos.',
      icon: Building2,
    },
  ]

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-32 pb-40 lg:pt-48 lg:pb-56 overflow-hidden flex items-center justify-center min-h-[80vh]">
        <div className="absolute inset-0 z-0">
          <img
            src="https://img.usecurling.com/p/1920/1080?q=law%20office%20architecture"
            alt="Law Office"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-primary/90 mix-blend-multiply" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        </div>

        <div className="container mx-auto px-4 relative z-10 text-center animate-slide-up">
          <h1 className="font-serif text-4xl md:text-5xl lg:text-7xl text-white font-bold mb-6 tracking-tight">
            Consulta Processual <span className="text-secondary italic">Simplificada</span>
          </h1>
          <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto mb-12 font-light">
            Acompanhe o andamento da sua ação trabalhista no TRT-RJ com total transparência e uma
            linguagem que você entende.
          </p>

          <ProcessSearch />
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-background relative -mt-24 z-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {stats.map((stat, i) => (
              <Card
                key={i}
                className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 animate-slide-up"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <CardContent className="p-8 flex items-center gap-6">
                  <div
                    className={`w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 ${stat.bg}`}
                  >
                    <stat.icon className={`w-8 h-8 ${stat.color}`} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                      {stat.title}
                    </p>
                    <h3 className="text-3xl font-bold text-primary mt-1">{stat.value}</h3>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Shortcuts Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-primary mb-4">
              Acesso Rápido TRT1
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Links oficiais para os portais da Justiça do Trabalho do Rio de Janeiro.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {shortcuts.map((shortcut, i) => (
              <a href="#" key={i} className="group block">
                <Card className="h-full border border-border hover:border-secondary/50 transition-colors duration-300">
                  <CardContent className="p-8 text-center flex flex-col items-center">
                    <div className="w-16 h-16 rounded-full bg-primary/5 text-primary group-hover:bg-secondary group-hover:text-white transition-colors duration-300 flex items-center justify-center mb-6">
                      <shortcut.icon className="w-8 h-8" />
                    </div>
                    <h3 className="font-serif text-xl font-bold text-primary mb-3">
                      {shortcut.title}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{shortcut.desc}</p>
                  </CardContent>
                </Card>
              </a>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
