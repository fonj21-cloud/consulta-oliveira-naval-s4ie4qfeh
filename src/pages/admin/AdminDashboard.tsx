import { Users, Briefcase, Clock, Activity, AlertTriangle, TrendingUp } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import useDataStore from '@/stores/useDataStore'

export default function AdminDashboard() {
  const { clients, processes, deadlines, financialEntries } = useDataStore()

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

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const criticalDeadlines = deadlines
    .filter((d) => {
      const diff = Math.ceil((new Date(d.date).getTime() - today.getTime()) / 86400000)
      return diff >= 0 && diff <= 7
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  const currentMonth = today.getMonth()
  let pendingAmount = 0
  let paidAmount = 0
  financialEntries.forEach((f) => {
    const d = new Date(f.dueDate)
    if (d.getMonth() === currentMonth) {
      if (f.status === 'Pago') paidAmount += f.amount
      else pendingAmount += f.amount
    }
  })

  return (
    <div className="max-w-6xl mx-auto animate-fade-in space-y-8">
      <div>
        <h1 className="font-serif text-3xl font-bold text-primary mb-2">Visão Geral</h1>
        <p className="text-muted-foreground">Resumo das atividades e pendências do escritório.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-0 shadow-sm border-t-4 border-t-red-500">
          <CardHeader className="pb-3 flex flex-row items-center justify-between">
            <CardTitle className="font-serif text-xl flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-500" /> Prazos Críticos (7 dias)
            </CardTitle>
          </CardHeader>
          <CardContent>
            {criticalDeadlines.length === 0 ? (
              <p className="text-sm text-muted-foreground">Nenhum prazo crítico no momento.</p>
            ) : (
              <div className="space-y-3">
                {criticalDeadlines.map((d) => (
                  <div
                    key={d.id}
                    className="flex justify-between items-start p-3 bg-red-50 rounded-lg border border-red-100"
                  >
                    <div>
                      <p className="font-semibold text-red-900 text-sm">{d.title}</p>
                      <p className="text-xs text-red-700/80 mt-1 line-clamp-1">{d.description}</p>
                    </div>
                    <Badge variant="destructive" className="shrink-0">
                      {d.date.split('-').reverse().join('/')}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm border-t-4 border-t-emerald-500">
          <CardHeader className="pb-3 flex flex-row items-center justify-between">
            <CardTitle className="font-serif text-xl flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-500" /> Resumo Financeiro (Mês)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-lg border border-emerald-100">
              <div>
                <p className="text-sm font-medium text-emerald-800">Recebido</p>
                <h3 className="text-2xl font-bold text-emerald-700">
                  {Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
                    paidAmount,
                  )}
                </h3>
              </div>
            </div>
            <div className="flex items-center justify-between p-4 bg-amber-50 rounded-lg border border-amber-100">
              <div>
                <p className="text-sm font-medium text-amber-800">Pendente / Atrasado</p>
                <h3 className="text-2xl font-bold text-amber-700">
                  {Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
                    pendingAmount,
                  )}
                </h3>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
