import { useParams, Link } from 'react-router-dom'
import { ChevronLeft, Scale, Download, MessageCircle, FileText, AlertCircle } from 'lucide-react'
import { MOCK_PROCESSES } from '@/lib/mock-data'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Timeline } from '@/components/Timeline'

export default function ProcessDetail() {
  const { id } = useParams<{ id: string }>()

  // Clean the ID for lookup if needed, but we used encodeURIComponent
  const decodedId = decodeURIComponent(id || '')
  const processData = MOCK_PROCESSES[decodedId]

  if (!processData) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center bg-background px-4 text-center">
        <div className="w-24 h-24 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-6">
          <AlertCircle className="w-12 h-12" />
        </div>
        <h1 className="font-serif text-3xl font-bold text-primary mb-4">Processo Não Encontrado</h1>
        <p className="text-muted-foreground max-w-md mb-8">
          Não conseguimos localizar o processo número{' '}
          <strong className="text-foreground">{decodedId}</strong>. Verifique se o número foi
          digitado corretamente ou entre em contato com nosso escritório.
        </p>
        <Link to="/">
          <Button variant="outline" className="gap-2">
            <ChevronLeft className="w-4 h-4" /> Voltar para Consulta
          </Button>
        </Link>
      </div>
    )
  }

  const statusColor = {
    Ativo: 'bg-blue-100 text-blue-700 hover:bg-blue-100',
    Concluído: 'bg-green-100 text-green-700 hover:bg-green-100',
    'Aguardando Prazo': 'bg-amber-100 text-amber-700 hover:bg-amber-100',
  }[processData.status]

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header Process */}
      <div className="bg-primary text-white pt-12 pb-24">
        <div className="container mx-auto px-4">
          <Link
            to="/"
            className="inline-flex items-center text-secondary hover:text-white transition-colors text-sm font-medium mb-8"
          >
            <ChevronLeft className="w-4 h-4 mr-1" /> Nova Consulta
          </Link>

          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Scale className="w-6 h-6 text-secondary" />
                <h1 className="text-3xl md:text-4xl font-serif font-bold tracking-tight">
                  {processData.number}
                </h1>
              </div>
              <p className="text-primary-foreground/80 text-lg mb-6">{processData.court}</p>

              <div className="flex flex-wrap gap-4">
                <Badge className={`${statusColor} border-0 px-3 py-1 text-sm font-medium`}>
                  {processData.status}
                </Badge>
                <div className="bg-white/10 rounded-full px-4 py-1.5 text-sm font-medium">
                  Início: {processData.startDate}
                </div>
              </div>
            </div>

            <Card className="bg-white/5 border-white/10 text-white min-w-[300px]">
              <CardContent className="p-6 space-y-4">
                <div>
                  <p className="text-sm text-secondary font-medium uppercase tracking-wider mb-1">
                    Reclamante
                  </p>
                  <p className="font-semibold">{processData.plaintiff}</p>
                </div>
                <div className="h-px bg-white/10 w-full" />
                <div>
                  <p className="text-sm text-secondary font-medium uppercase tracking-wider mb-1">
                    Reclamado
                  </p>
                  <p className="font-semibold">{processData.defendant}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Timeline Column */}
          <div className="lg:col-span-2 space-y-8">
            <Card className="border-0 shadow-lg">
              <CardHeader className="border-b bg-muted/30">
                <CardTitle className="font-serif text-2xl text-primary">
                  Histórico do Processo
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 sm:p-10">
                <Timeline events={processData.events} />
              </CardContent>
            </Card>
          </div>

          {/* Sidebar Column */}
          <div className="space-y-6">
            {/* Lawyer Card */}
            <Card
              className="border-0 shadow-lg overflow-hidden animate-slide-up"
              style={{ animationDelay: '200ms' }}
            >
              <div className="h-12 bg-primary w-full" />
              <CardContent className="p-6 relative pt-0">
                <div className="w-20 h-20 rounded-full border-4 border-white bg-muted overflow-hidden absolute -top-10 shadow-sm">
                  <img
                    src={processData.lawyer.avatar}
                    alt={processData.lawyer.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="pt-12">
                  <p className="text-sm text-secondary font-medium uppercase tracking-wider mb-1">
                    Advogado Responsável
                  </p>
                  <h3 className="font-serif text-xl font-bold text-primary">
                    {processData.lawyer.name}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">{processData.lawyer.oab}</p>

                  <Button
                    className="w-full mt-6 bg-[#25D366] hover:bg-[#20BD5A] text-white gap-2"
                    size="lg"
                  >
                    <MessageCircle className="w-5 h-5" />
                    Falar no WhatsApp
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Documents Card */}
            <Card
              className="border-0 shadow-lg animate-slide-up"
              style={{ animationDelay: '300ms' }}
            >
              <CardHeader className="pb-4">
                <CardTitle className="font-serif text-lg text-primary flex items-center gap-2">
                  <FileText className="w-5 h-5 text-secondary" /> Documentos Públicos
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { name: 'Petição Inicial.pdf', date: processData.startDate },
                  { name: 'Ata de Audiência.pdf', date: '10/11/2023' },
                ].map((doc, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-3 rounded-lg border bg-muted/30 hover:bg-muted transition-colors group cursor-pointer"
                  >
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className="w-8 h-8 rounded bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div className="truncate">
                        <p className="text-sm font-medium text-foreground truncate">{doc.name}</p>
                        <p className="text-xs text-muted-foreground">{doc.date}</p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="shrink-0 text-muted-foreground group-hover:text-primary"
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
