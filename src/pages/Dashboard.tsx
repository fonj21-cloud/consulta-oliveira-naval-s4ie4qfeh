import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  FileText,
  Scale,
  DollarSign,
  CheckCircle2,
  AlertCircle,
  PenTool,
  RefreshCw,
  QrCode,
  Copy,
  Download,
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useAuth } from '@/contexts/AuthContext'
import useDataStore from '@/stores/useDataStore'
import { useToast } from '@/hooks/use-toast'
import { ProcessEvent, FinancialEntry } from '@/lib/mock-data'
import { cn } from '@/lib/utils'

type PendingDoc = ProcessEvent & { processNumber: string; processId: string }

export default function Dashboard() {
  const { user } = useAuth()
  const { processes, financialEntries, signDocument, checkZapSignStatus, payPix } = useDataStore()
  const { toast } = useToast()

  const [signDoc, setSignDoc] = useState<PendingDoc | null>(null)
  const [isChecking, setIsChecking] = useState<string | null>(null)
  const [pixEntry, setPixEntry] = useState<FinancialEntry | null>(null)

  const userProcesses = processes.filter((p) => p.clientId === user?.id)
  const userFinance = financialEntries.filter((f) =>
    userProcesses.some((p) => p.id === f.processId),
  )

  const pendingDocs = userProcesses.flatMap((p) =>
    p.events
      .filter(
        (e) => e.type === 'documento' && e.requiresSignature && e.signatureStatus === 'pending',
      )
      .map((e) => ({ ...e, processNumber: p.number, processId: p.id })),
  )

  const handleSign = () => {
    if (signDoc) {
      signDocument(signDoc.processId, signDoc.id)
      toast({
        title: 'Documento assinado com sucesso!',
        description: 'Sua assinatura digital foi registrada.',
      })
      setSignDoc(null)
    }
  }

  const handleCheckStatus = async (doc: PendingDoc) => {
    if (!doc.zapsignDocumentToken) return
    setIsChecking(doc.id)
    try {
      const signed = await checkZapSignStatus(doc.processId, doc.id, doc.zapsignDocumentToken)
      if (signed) {
        toast({ title: 'Assinatura confirmada com sucesso!' })
      } else {
        toast({
          title: 'Ainda aguardando assinatura.',
          description: 'Tente novamente após assinar no ZapSign.',
        })
      }
    } catch (e) {
      toast({ title: 'Erro ao verificar status', variant: 'destructive' })
    } finally {
      setIsChecking(null)
    }
  }

  const copyPix = () => {
    if (pixEntry?.pixCode) {
      navigator.clipboard.writeText(pixEntry.pixCode)
      toast({ title: 'Código Pix copiado!' })
    }
  }

  const simulatePayment = () => {
    if (pixEntry) {
      payPix(pixEntry.id)
      toast({
        title: 'Pagamento Confirmado',
        description: 'O sistema reconheceu o pagamento do Pix.',
      })
      setPixEntry(null)
    }
  }

  const downloadReceipt = () => {
    toast({ title: 'Recibo gerado com sucesso.', description: 'O download iniciará em instantes.' })
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="mb-8 animate-slide-up">
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-primary mb-2">
            Olá, {user?.name.split(' ')[0]}
          </h1>
          <p className="text-muted-foreground">
            Acompanhe o andamento dos seus processos e financeiro.
          </p>
        </div>

        {pendingDocs.length > 0 && (
          <div className="mb-8 animate-slide-up">
            <h2 className="font-serif text-xl font-bold text-primary mb-4 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-amber-500" /> Ação Necessária: Assinatura
            </h2>
            <div className="grid gap-4">
              {pendingDocs.map((doc) => (
                <Card key={doc.id} className="border-amber-200 bg-amber-50/50">
                  <CardContent className="p-4 flex flex-col sm:flex-row justify-between gap-4">
                    <div>
                      <p className="font-semibold text-primary">{doc.title}</p>
                      <p className="text-sm text-muted-foreground">Processo: {doc.processNumber}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {doc.signatureUrl ? (
                        <Button
                          asChild
                          className="bg-amber-500 hover:bg-amber-600 text-white shrink-0"
                        >
                          <a href={doc.signatureUrl} target="_blank" rel="noreferrer">
                            <PenTool className="w-4 h-4 mr-2" /> Assinar no ZapSign
                          </a>
                        </Button>
                      ) : (
                        <Button
                          onClick={() => setSignDoc(doc)}
                          className="bg-amber-500 hover:bg-amber-600 text-white shrink-0"
                        >
                          <PenTool className="w-4 h-4 mr-2" /> Assinar Documento
                        </Button>
                      )}

                      {doc.zapsignDocumentToken && (
                        <Button
                          variant="outline"
                          onClick={() => handleCheckStatus(doc)}
                          title="Verificar Status"
                          disabled={isChecking === doc.id}
                        >
                          <RefreshCw
                            className={cn('w-4 h-4', isChecking === doc.id && 'animate-spin')}
                          />
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        <Tabs
          defaultValue="processos"
          className="w-full animate-slide-up"
          style={{ animationDelay: '100ms' }}
        >
          <TabsList className="mb-6 bg-muted/80 p-1 rounded-xl h-12 shadow-sm">
            <TabsTrigger
              value="processos"
              className="rounded-lg px-6 h-10 data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm"
            >
              <Scale className="w-4 h-4 mr-2" /> Meus Processos
            </TabsTrigger>
            <TabsTrigger
              value="financeiro"
              className="rounded-lg px-6 h-10 data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm"
            >
              <DollarSign className="w-4 h-4 mr-2" /> Financeiro
            </TabsTrigger>
          </TabsList>

          <TabsContent value="processos" className="space-y-6 outline-none">
            {userProcesses.length === 0 ? (
              <Card className="p-12 text-center text-muted-foreground border-0 shadow-sm">
                Nenhum processo encontrado.
              </Card>
            ) : (
              userProcesses.map((process) => (
                <Card
                  key={process.id}
                  className="border-0 shadow-sm hover:shadow-md transition-shadow overflow-hidden group"
                >
                  <CardContent className="p-0 flex flex-col md:flex-row">
                    <div className="flex-1 p-6 md:p-8">
                      <div className="flex flex-wrap items-center gap-3 mb-4">
                        <Badge
                          variant="outline"
                          className="font-mono text-sm border-secondary/50 text-primary"
                        >
                          {process.number}
                        </Badge>
                        <Badge className="bg-slate-100 text-slate-800 hover:bg-slate-100 border-0">
                          {process.status}
                        </Badge>
                      </div>
                      <h3 className="text-xl font-serif font-bold text-primary mb-2">
                        {process.plaintiff} x {process.defendant}
                      </h3>
                      <div className="flex flex-col sm:flex-row gap-4 text-sm text-muted-foreground mt-4">
                        <div className="flex items-center gap-2">
                          <Scale className="w-4 h-4 text-secondary" /> {process.court}
                        </div>
                      </div>
                    </div>
                    <div className="bg-muted/30 p-6 md:p-8 flex flex-col justify-center items-center md:items-end border-t md:border-t-0 md:border-l md:w-72 shrink-0">
                      <div className="text-center md:text-right w-full mb-6">
                        <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wider font-medium">
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
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="financeiro" className="outline-none">
            <Card className="border-0 shadow-sm overflow-hidden">
              <CardContent className="p-0">
                <Table>
                  <TableHeader className="bg-muted/30">
                    <TableRow>
                      <TableHead className="pl-6 h-14">Descrição</TableHead>
                      <TableHead>Vencimento</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Valor</TableHead>
                      <TableHead className="text-right pr-6">Ação</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {userFinance.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                          Nenhum registro financeiro encontrado.
                        </TableCell>
                      </TableRow>
                    ) : (
                      userFinance.map((f) => (
                        <TableRow key={f.id} className="h-16">
                          <TableCell className="pl-6 font-medium text-primary">
                            {f.description}
                            <span className="block text-xs text-muted-foreground font-normal">
                              {f.type}
                            </span>
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {f.dueDate.split('-').reverse().join('/')}
                          </TableCell>
                          <TableCell>
                            {f.status === 'Pago' ? (
                              <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100 border-0">
                                Pago
                              </Badge>
                            ) : f.status === 'Atrasado' ? (
                              <Badge className="bg-red-100 text-red-800 hover:bg-red-100 border-0">
                                Atrasado
                              </Badge>
                            ) : (
                              <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100 border-0">
                                Pendente
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-right font-semibold">
                            {Intl.NumberFormat('pt-BR', {
                              style: 'currency',
                              currency: 'BRL',
                            }).format(f.amount)}
                          </TableCell>
                          <TableCell className="text-right pr-6">
                            {f.status !== 'Pago' && f.pixCode && (
                              <Button
                                size="sm"
                                onClick={() => setPixEntry(f)}
                                className="gap-2 bg-[#00b4d8] hover:bg-[#0096c7] text-white"
                              >
                                <QrCode className="w-4 h-4" /> Pagar com Pix
                              </Button>
                            )}
                            {f.status === 'Pago' && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={downloadReceipt}
                                className="gap-2"
                              >
                                <Download className="w-4 h-4" /> Recibo
                              </Button>
                            )}
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

      <Dialog open={!!signDoc} onOpenChange={(o) => !o && setSignDoc(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assinatura Digital</DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <p className="text-sm text-muted-foreground">
              Ao confirmar, você assinará digitalmente o documento <strong>{signDoc?.title}</strong>{' '}
              referente ao processo <strong>{signDoc?.processNumber}</strong>.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSignDoc(null)}>
              Cancelar
            </Button>
            <Button
              onClick={handleSign}
              className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2"
            >
              <CheckCircle2 className="w-4 h-4" /> Confirmar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!pixEntry} onOpenChange={(o) => !o && setPixEntry(null)}>
        <DialogContent className="sm:max-w-md text-center">
          <DialogHeader>
            <DialogTitle className="text-center text-xl font-bold flex items-center justify-center gap-2">
              <QrCode className="w-6 h-6 text-[#00b4d8]" /> Pagamento via Pix
            </DialogTitle>
          </DialogHeader>
          <div className="py-6 space-y-6">
            <div>
              <p className="text-muted-foreground text-sm mb-1">{pixEntry?.description}</p>
              <p className="text-3xl font-bold text-primary">
                {pixEntry &&
                  Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
                    pixEntry.amount,
                  )}
              </p>
            </div>

            <div className="mx-auto w-48 h-48 bg-white p-2 border-2 rounded-xl flex items-center justify-center">
              <img
                src={`https://img.usecurling.com/i?q=qrcode&shape=lineal-color&color=black`}
                alt="QR Code Pix"
                className="w-full h-full opacity-80"
              />
            </div>

            <div>
              <p className="text-sm text-muted-foreground mb-2">Ou copie o código abaixo:</p>
              <div className="flex items-center gap-2 bg-muted p-2 rounded-md border">
                <code className="text-xs truncate flex-1 text-left">{pixEntry?.pixCode}</code>
                <Button size="icon" variant="ghost" onClick={copyPix} className="h-8 w-8 shrink-0">
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="pt-4 border-t">
              <Button
                variant="outline"
                className="w-full text-xs text-muted-foreground"
                onClick={simulatePayment}
              >
                [Mock] Simular Confirmação de Pagamento
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
