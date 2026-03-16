import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Line, LineChart } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { Activity, Target, Clock, Scale } from 'lucide-react'
import useDataStore from '@/stores/useDataStore'

const durationData = [
  { year: '2020', duration: 24 },
  { year: '2021', duration: 21 },
  { year: '2022', duration: 18 },
  { year: '2023', duration: 14 },
  { year: '2024', duration: 11 },
]

const volumeData = [
  { month: 'Jan', volume: 120 },
  { month: 'Fev', volume: 150 },
  { month: 'Mar', volume: 180 },
  { month: 'Abr', volume: 140 },
  { month: 'Mai', volume: 210 },
  { month: 'Jun', volume: 250 },
]

const durationConfig = {
  duration: { label: 'Duração (Meses)', color: 'hsl(var(--primary))' },
}

const volumeConfig = {
  volume: { label: 'Movimentações', color: 'hsl(var(--secondary))' },
}

export default function AdminAnalytics() {
  const { processes } = useDataStore()
  const activeProcesses = processes.filter((p) => p.status === 'Ativo').length
  const successRate = 85 // Mocked API value for demonstration

  return (
    <div className="max-w-6xl mx-auto animate-fade-in">
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-bold text-primary mb-1">Business Intelligence</h1>
        <p className="text-muted-foreground">Métricas e indicadores de desempenho do escritório.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center shrink-0">
              <Activity className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Processos Ativos</p>
              <h3 className="text-2xl font-bold text-primary">{activeProcesses}</h3>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0">
              <Target className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Taxa de Sucesso</p>
              <h3 className="text-2xl font-bold text-primary">{successRate}%</h3>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
              <Clock className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Tempo Médio</p>
              <h3 className="text-2xl font-bold text-primary">11m</h3>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-secondary/20 flex items-center justify-center shrink-0">
              <Scale className="w-6 h-6 text-secondary" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Ações</p>
              <h3 className="text-2xl font-bold text-primary">{processes.length}</h3>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="font-serif text-xl">Duração Média dos Processos</CardTitle>
            <CardDescription>Redução do tempo de conclusão ao longo dos anos.</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={durationConfig} className="h-[300px] w-full">
              <BarChart data={durationData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis dataKey="year" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} />
                <ChartTooltip
                  cursor={{ fill: 'var(--color-muted)' }}
                  content={<ChartTooltipContent />}
                />
                <Bar dataKey="duration" fill="var(--color-duration)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="font-serif text-xl">Volume de Movimentações</CardTitle>
            <CardDescription>Automação TRT: Ações capturadas mensalmente.</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={volumeConfig} className="h-[300px] w-full">
              <LineChart data={volumeData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis dataKey="month" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} />
                <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                <Line
                  type="monotone"
                  dataKey="volume"
                  stroke="var(--color-volume)"
                  strokeWidth={3}
                  dot={{ r: 4, fill: 'var(--color-volume)' }}
                />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
