import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  FileText,
  Scale,
  Clock,
  CheckCircle2,
  AlertCircle,
  PenTool,
  DollarSign,
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
import { ProcessEvent } from '@/lib/mock-data'

type PendingDoc = ProcessEvent & { processNumber: string; processId: string }

export default function Dashboard() {
  const { user } = useAuth()
  const { processes, financialEntries, signDocument } = useDataStore()
  const { toast } = useToast()

  const [signDoc, setSignDoc] = useState<PendingDoc | null>(null)

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
                    <Button
                      onClick={() => setSignDoc(doc)}
                      className="bg-amber-500 hover:bg-amber-600 text-white shrink-0"
                    >
                      <PenTool className="w-4 h-4 mr-2" /> Assinar Documento
                    </Button>
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
            <Card className="border-0 shadow-sm">
              <CardContent className="p-0">
                <Table>
                  <TableHeader className="bg-muted/30">
                    <TableRow>
                      <TableHead className="pl-6 h-14">Descrição</TableHead>
                      <TableHead>Vencimento</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right pr-6">Valor</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {userFinance.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
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
                          <TableCell className="text-right pr-6 font-semibold">
                            {Intl.NumberFormat('pt-BR', {
                              style: 'currency',
                              currency: 'BRL',
                            }).format(f.amount)}
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
    </div>
  )
}
