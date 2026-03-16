import { Users, Briefcase, Clock, Activity } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import useDataStore from '@/stores/useDataStore'

export default function AdminDashboard() {
  const { clients, processes } = useDataStore()

  const activeProcesses = processes.filter((p) => p.status === 'Ativo').length
  const pendingProcesses = processes.filter((p) => p.status === 'Aguardando Prazo').length

  const stats = [
    {
      title: 'Total de Clientes',
      value: clients.length,
      icon: Users,
      color: 'text-blue-600',
      bg: 'bg-blue-100',
    },
    {
      title: 'Processos Ativos',
      value: activeProcesses,
      icon: Activity,
      color: 'text-emerald-600',
      bg: 'bg-emerald-100',
    },
    {
      title: 'Aguardando Prazo',
      value: pendingProcesses,
      icon: Clock,
      color: 'text-amber-600',
      bg: 'bg-amber-100',
    },
    {
      title: 'Total Processos',
      value: processes.length,
      icon: Briefcase,
      color: 'text-primary',
      bg: 'bg-primary/10',
    },
  ]

  return (
    <div className="max-w-6xl mx-auto animate-fade-in">
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-bold text-primary mb-2">Visão Geral</h1>
        <p className="text-muted-foreground">Resumo das atividades do escritório.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, i) => (
          <Card key={i} className="border-0 shadow-sm">
            <CardContent className="p-6 flex items-center gap-4">
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${stat.bg}`}
              >
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                <h3 className="text-2xl font-bold text-primary">{stat.value}</h3>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="font-serif text-xl">Atividades Recentes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {processes
              .flatMap((p) =>
                p.events.map((e) => ({
                  ...e,
                  processNumber: p.number,
                  clientName: clients.find((c) => c.id === p.clientId)?.name,
                })),
              )
              .sort(
                (a, b) =>
                  new Date(b.date.split('/').reverse().join('-')).getTime() -
                  new Date(a.date.split('/').reverse().join('-')).getTime(),
              )
              .slice(0, 5)
              .map((event, i) => (
                <div
                  key={i}
                  className="flex items-start gap-4 p-4 rounded-lg bg-muted/30 border border-transparent hover:border-border transition-colors"
                >
                  <div className="w-2 h-2 rounded-full bg-secondary mt-2 shrink-0" />
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-1">
                      <p className="font-semibold text-primary text-sm">{event.title}</p>
                      <span className="text-xs text-muted-foreground bg-white px-2 py-0.5 rounded border">
                        {event.date}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mb-1">
                      Processo: {event.processNumber} - Cliente: {event.clientName}
                    </p>
                    <p className="text-sm text-foreground/80 line-clamp-1">{event.description}</p>
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
