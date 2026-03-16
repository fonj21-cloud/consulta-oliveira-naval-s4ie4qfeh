import { Link } from 'react-router-dom'
import { FileText, Scale, Clock, CheckCircle2 } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/AuthContext'
import useDataStore from '@/stores/useDataStore'

export default function Dashboard() {
  const { user } = useAuth()
  const { processes } = useDataStore()

  // Filter processes for the logged in client
  const userProcesses = processes.filter((p) => p.clientId === user?.id)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Ativo':
        return 'bg-blue-100 text-blue-700 hover:bg-blue-100'
      case 'Concluído':
        return 'bg-green-100 text-green-700 hover:bg-green-100'
      case 'Aguardando Prazo':
        return 'bg-amber-100 text-amber-700 hover:bg-amber-100'
      default:
        return 'bg-slate-100 text-slate-700 hover:bg-slate-100'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Ativo':
        return <Scale className="w-3.5 h-3.5 mr-1.5" />
      case 'Concluído':
        return <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" />
      case 'Aguardando Prazo':
        return <Clock className="w-3.5 h-3.5 mr-1.5" />
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="mb-8 animate-slide-up">
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-primary mb-2">
            Olá, {user?.name.split(' ')[0]}
          </h1>
          <p className="text-muted-foreground">
            Acompanhe o andamento dos seus processos jurídicos.
          </p>
        </div>

        {userProcesses.length === 0 ? (
          <Card className="border-0 shadow-sm p-12 text-center text-muted-foreground animate-slide-up">
            Nenhum processo encontrado em seu nome.
          </Card>
        ) : (
          <div className="grid gap-6 animate-slide-up" style={{ animationDelay: '100ms' }}>
            {userProcesses.map((process) => (
              <Card
                key={process.id}
                className="border-0 shadow-sm hover:shadow-md transition-shadow overflow-hidden group"
              >
                <CardContent className="p-0">
                  <div className="flex flex-col md:flex-row">
                    {/* Left Side Info */}
                    <div className="flex-1 p-6 md:p-8">
                      <div className="flex flex-wrap items-center gap-3 mb-4">
                        <Badge
                          variant="outline"
                          className="font-mono text-sm border-secondary/50 text-primary"
                        >
                          {process.number}
                        </Badge>
                        <Badge className={`${getStatusColor(process.status)} border-0 px-3 py-1`}>
                          {getStatusIcon(process.status)}
                          {process.status}
                        </Badge>
                      </div>

                      <h3 className="text-xl font-serif font-bold text-primary mb-2">
                        {process.plaintiff} x {process.defendant}
                      </h3>

                      <div className="flex flex-col sm:flex-row gap-4 text-sm text-muted-foreground mt-4">
                        <div className="flex items-center gap-2">
                          <Scale className="w-4 h-4 text-secondary" />
                          {process.court}
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-secondary" />
                          Início: {process.startDate}
                        </div>
                      </div>
                    </div>

                    {/* Right Side Action */}
                    <div className="bg-muted/30 p-6 md:p-8 flex flex-col justify-center items-center md:items-end border-t md:border-t-0 md:border-l md:w-72 shrink-0">
                      <div className="text-center md:text-right w-full mb-6">
                        <p className="text-sm text-muted-foreground mb-1 uppercase tracking-wider font-medium text-xs">
                          Última movimentação
                        </p>
                        <p className="font-medium text-primary text-sm line-clamp-2">
                          {process.events[0]?.title || 'Aguardando atualização'}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {process.events[0]?.date}
                        </p>
                      </div>

                      <Link
                        to={`/processo/${encodeURIComponent(process.number)}`}
                        className="w-full"
                      >
                        <Button className="w-full gap-2 group-hover:bg-secondary group-hover:text-white transition-colors">
                          <FileText className="w-4 h-4" /> Ver Detalhes
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
