import { useParams, Link } from 'react-router-dom'
import {
  ChevronLeft,
  Scale,
  Download,
  MessageCircle,
  FileText,
  AlertCircle,
  History,
  RefreshCw,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Timeline } from '@/components/Timeline'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import useDataStore from '@/stores/useDataStore'
import { cn } from '@/lib/utils'

export default function ProcessDetail() {
  const { id } = useParams<{ id: string }>()
  const { processes, syncProcessWithTRT } = useDataStore()

  const decodedId = decodeURIComponent(id || '')
  const processData = processes.find((p) => p.number === decodedId)

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

  const handleSync = () => {
    syncProcessWithTRT(processData.id)
  }

  const statusColor = {
    Ativo: 'bg-blue-100 text-blue-700 hover:bg-blue-100',
    Concluído: 'bg-green-100 text-green-700 hover:bg-green-100',
    'Aguardando Prazo': 'bg-amber-100 text-amber-700 hover:bg-amber-100',
  }[processData.status]

  const docs = processData.events.filter((e) => e.type === 'documento')

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

              <div className="flex flex-wrap items-center gap-4">
                <Badge className={`${statusColor} border-0 px-3 py-1 text-sm font-medium`}>
                  {processData.status}
                </Badge>
                <div className="bg-white/10 rounded-full px-4 py-1.5 text-sm font-medium">
                  Início: {processData.startDate}
                </div>
                <div className="flex items-center gap-2 bg-white/10 rounded-full px-4 py-1.5 text-sm font-medium">
                  <RefreshCw
                    className={cn(
                      'w-3.5 h-3.5',
                      processData.syncStatus === 'Syncing' && 'animate-spin',
                    )}
                  />
                  TRT:{' '}
                  {processData.syncStatus === 'Syncing'
                    ? 'Sincronizando...'
                    : processData.lastSyncDate || 'Não Sincronizado'}
                </div>
                <Button
                  size="sm"
                  variant="secondary"
                  className="h-8 rounded-full px-4"
                  onClick={handleSync}
                  disabled={processData.syncStatus === 'Syncing'}
                >
                  Forçar Sincronização
                </Button>
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
          <div className="lg:col-span-2 space-y-8">
            <Tabs
              defaultValue="timeline"
              className="w-full animate-slide-up"
              style={{ animationDelay: '100ms' }}
            >
              <TabsList className="grid w-full grid-cols-2 bg-muted/80 p-1 mb-6 rounded-xl h-14 shadow-sm">
                <TabsTrigger
                  value="timeline"
                  className="rounded-lg text-base h-10 data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all"
                >
                  <History className="w-4 h-4 mr-2" /> Histórico
                </TabsTrigger>
                <TabsTrigger
                  value="documents"
                  className="rounded-lg text-base h-10 data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all"
                >
                  <FileText className="w-4 h-4 mr-2" /> Documentos
                </TabsTrigger>
              </TabsList>

              <TabsContent value="timeline" className="mt-0 outline-none">
                <Card className="border-0 shadow-lg">
                  <CardHeader className="border-b bg-muted/30 pb-5 flex flex-row items-center justify-between">
                    <CardTitle className="font-serif text-2xl text-primary">
                      Movimentações do Processo
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 sm:p-10">
                    <Timeline events={processData.events} />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="documents" className="mt-0 outline-none">
                <Card className="border-0 shadow-lg overflow-hidden">
                  <CardHeader className="border-b bg-muted/30 pb-5">
                    <CardTitle className="font-serif text-2xl text-primary">
                      Repositório de Documentos
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader className="bg-muted/10">
                        <TableRow>
                          <TableHead className="w-[300px] pl-6 h-12">Nome do Documento</TableHead>
                          <TableHead className="h-12">Data</TableHead>
                          <TableHead className="text-right pr-6 h-12">Ação</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {docs.length === 0 ? (
                          <TableRow>
                            <TableCell
                              colSpan={3}
                              className="text-center py-6 text-muted-foreground"
                            >
                              Nenhum documento anexado.
                            </TableCell>
                          </TableRow>
                        ) : (
                          docs.map((doc) => (
                            <TableRow
                              key={doc.id}
                              className="hover:bg-muted/30 h-16 transition-colors"
                            >
                              <TableCell className="font-medium pl-6">
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 rounded bg-secondary/10 text-secondary flex items-center justify-center shrink-0">
                                    <FileText className="w-4 h-4" />
                                  </div>
                                  <span>{doc.title}</span>
                                </div>
                              </TableCell>
                              <TableCell className="text-muted-foreground">{doc.date}</TableCell>
                              <TableCell className="text-right pr-6">
                                {doc.requiresSignature && (
                                  <Badge
                                    className={cn(
                                      'mr-3 border-0',
                                      doc.signatureStatus === 'signed'
                                        ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100'
                                        : 'bg-amber-100 text-amber-700 hover:bg-amber-100',
                                    )}
                                  >
                                    {doc.signatureStatus === 'signed' ? 'Assinado' : 'Pendente'}
                                  </Badge>
                                )}
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="gap-2 hover:bg-primary hover:text-white transition-colors"
                                >
                                  <Download className="w-4 h-4" />{' '}
                                  <span className="hidden sm:inline">Baixar</span>
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          <div className="space-y-6">
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
                    <MessageCircle className="w-5 h-5" /> Falar no WhatsApp
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
