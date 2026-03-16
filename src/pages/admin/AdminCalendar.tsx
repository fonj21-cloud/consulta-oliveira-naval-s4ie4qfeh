import { useState, useMemo } from 'react'
import { ChevronLeft, ChevronRight, Calendar as CalIcon } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import useDataStore from '@/stores/useDataStore'
import { cn } from '@/lib/utils'
import { Deadline } from '@/lib/mock-data'

export default function AdminCalendar() {
  const { deadlines, processes, clients } = useDataStore()
  const [currentDate, setCurrentDate] = useState(new Date())
  const [view, setView] = useState<'month' | 'week'>('month')
  const [selectedEvent, setSelectedEvent] = useState<Deadline | null>(null)

  const daysInMonth = useMemo(() => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    const first = new Date(year, month, 1)
    const last = new Date(year, month + 1, 0)
    const days = []
    for (let i = 0; i < first.getDay(); i++) days.push(null)
    for (let i = 1; i <= last.getDate(); i++) days.push(new Date(year, month, i))
    return days
  }, [currentDate])

  const daysInWeek = useMemo(() => {
    const days = []
    const start = new Date(currentDate)
    start.setDate(start.getDate() - start.getDay())
    for (let i = 0; i < 7; i++) {
      const d = new Date(start)
      d.setDate(d.getDate() + i)
      days.push(d)
    }
    return days
  }, [currentDate])

  const displayedDays = view === 'month' ? daysInMonth : daysInWeek

  const nextPeriod = () => {
    const d = new Date(currentDate)
    if (view === 'month') d.setMonth(d.getMonth() + 1)
    else d.setDate(d.getDate() + 7)
    setCurrentDate(d)
  }

  const prevPeriod = () => {
    const d = new Date(currentDate)
    if (view === 'month') d.setMonth(d.getMonth() - 1)
    else d.setDate(d.getDate() - 7)
    setCurrentDate(d)
  }

  const getUrgencyColor = (dateStr: string) => {
    const d = new Date(dateStr)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const diff = Math.ceil((d.getTime() - today.getTime()) / 86400000)
    if (diff < 0) return 'bg-red-200 text-red-900 border-red-300'
    if (diff <= 2) return 'bg-red-500 text-white border-red-600 shadow-sm'
    if (diff <= 7) return 'bg-orange-400 text-white border-orange-500 shadow-sm'
    return 'bg-blue-100 text-blue-800 border-blue-200'
  }

  const formatTitle = () => {
    const month = currentDate.toLocaleString('pt-BR', { month: 'long' })
    const year = currentDate.getFullYear()
    return `${month.charAt(0).toUpperCase() + month.slice(1)} de ${year}`
  }

  const selProcess = selectedEvent ? processes.find((p) => p.id === selectedEvent.processId) : null
  const selClient = selProcess ? clients.find((c) => c.id === selProcess.clientId) : null

  return (
    <div className="max-w-6xl mx-auto animate-fade-in h-full flex flex-col">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-primary mb-1">Agenda e Prazos</h1>
          <p className="text-muted-foreground">Acompanhamento visual de prazos judiciais.</p>
        </div>
        <Tabs value={view} onValueChange={(v) => setView(v as 'month' | 'week')}>
          <TabsList>
            <TabsTrigger value="month">Mensal</TabsTrigger>
            <TabsTrigger value="week">Semanal</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <Card className="border-0 shadow-sm flex-1 flex flex-col min-h-[600px]">
        <div className="p-4 border-b flex items-center justify-between bg-white">
          <h2 className="text-xl font-bold text-primary flex items-center gap-2">
            <CalIcon className="w-5 h-5" /> {formatTitle()}
          </h2>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={prevPeriod}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={() => setCurrentDate(new Date())}>
              Hoje
            </Button>
            <Button variant="outline" size="icon" onClick={nextPeriod}>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
        <CardContent className="p-4 flex-1 flex flex-col">
          <div className="grid grid-cols-7 gap-2 mb-2">
            {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((d) => (
              <div key={d} className="text-center text-sm font-semibold text-muted-foreground">
                {d}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-2 flex-1 auto-rows-fr">
            {displayedDays.map((day, i) => {
              if (!day) return <div key={i} className="min-h-[120px] rounded-lg bg-slate-50/50" />
              const dayStr = day.toISOString().split('T')[0]
              const dayEvents = deadlines.filter((d) => d.date === dayStr)
              const isToday = dayStr === new Date().toISOString().split('T')[0]

              return (
                <div
                  key={i}
                  className={cn(
                    'min-h-[120px] p-2 border rounded-lg overflow-hidden flex flex-col',
                    isToday ? 'bg-blue-50 border-blue-200' : 'bg-white',
                  )}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span
                      className={cn(
                        'text-sm font-medium w-7 h-7 flex items-center justify-center rounded-full',
                        isToday && 'bg-blue-600 text-white',
                      )}
                    >
                      {day.getDate()}
                    </span>
                  </div>
                  <div className="flex-1 space-y-1 overflow-y-auto">
                    {dayEvents.map((e) => (
                      <div
                        key={e.id}
                        onClick={() => setSelectedEvent(e)}
                        className={cn(
                          'text-xs p-1.5 rounded border cursor-pointer truncate transition-opacity hover:opacity-80',
                          getUrgencyColor(e.date),
                        )}
                      >
                        {e.title}
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      <Dialog open={!!selectedEvent} onOpenChange={(o) => !o && setSelectedEvent(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Detalhes do Prazo</DialogTitle>
          </DialogHeader>
          {selectedEvent && (
            <div className="space-y-4 py-4">
              <div>
                <p className="text-sm text-muted-foreground font-medium mb-1">Título</p>
                <p className="font-semibold text-lg">{selectedEvent.title}</p>
              </div>
              <div className="flex justify-between items-center bg-muted p-3 rounded-lg border">
                <div>
                  <p className="text-sm text-muted-foreground font-medium mb-1">
                    Data de Vencimento
                  </p>
                  <p className="font-medium flex items-center gap-2">
                    <CalIcon className="w-4 h-4" />{' '}
                    {selectedEvent.date.split('-').reverse().join('/')}
                  </p>
                </div>
                <Badge className={getUrgencyColor(selectedEvent.date)}>Prioridade</Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground font-medium mb-1">Descrição</p>
                <p className="text-sm">{selectedEvent.description}</p>
              </div>
              <div className="border-t pt-4">
                <p className="text-sm text-muted-foreground font-medium mb-2">Processo Vinculado</p>
                {selProcess ? (
                  <div className="bg-slate-50 p-3 rounded border">
                    <p className="font-mono text-sm font-semibold text-primary">
                      {selProcess.number}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">Cliente: {selClient?.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Responsável: {selProcess.lawyer.name}
                    </p>
                  </div>
                ) : (
                  <p className="text-sm">Processo não encontrado.</p>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
