import { useState } from 'react'
import { FileText, Plus, CheckCircle, RefreshCw } from 'lucide-react'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { ProcessDetails, ProcessEvent } from '@/lib/mock-data'
import useDataStore from '@/stores/useDataStore'
import { useToast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'

export function ManageProcessSheet({
  process,
  open,
  onOpenChange,
}: {
  process: ProcessDetails | null
  open: boolean
  onOpenChange: (v: boolean) => void
}) {
  const {
    clients,
    updateProcessStatus,
    addProcessEvent,
    sendDocumentForSignature,
    checkZapSignStatus,
  } = useDataStore()
  const { toast } = useToast()

  const [status, setStatus] = useState<ProcessDetails['status']>(process?.status || 'Ativo')
  const [movTitle, setMovTitle] = useState('')
  const [movDesc, setMovDesc] = useState('')

  const [zapDoc, setZapDoc] = useState<ProcessEvent | null>(null)
  const [signerName, setSignerName] = useState('')
  const [signerEmail, setSignerEmail] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [isChecking, setIsChecking] = useState<string | null>(null)

  if (!process) return null

  const handleUpdateStatus = () => {
    updateProcessStatus(process.id, status)
    toast({ title: 'Status atualizado com sucesso' })
  }

  const handleAddMovement = () => {
    if (!movTitle) return
    addProcessEvent(process.id, {
      date: new Date().toLocaleDateString('pt-BR'),
      title: movTitle,
      description: movDesc,
      type: 'movimentacao',
    })
    setMovTitle('')
    setMovDesc('')
    toast({ title: 'Movimentação adicionada' })
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    addProcessEvent(process.id, {
      date: new Date().toLocaleDateString('pt-BR'),
      title: file.name,
      description: 'Documento inserido pelo administrador.',
      type: 'documento',
    })
    toast({ title: 'Documento anexado com sucesso' })
  }

  const handleOpenZapSign = (doc: ProcessEvent) => {
    setZapDoc(doc)
    const client = clients.find((c) => c.id === process.clientId)
    if (client) {
      setSignerName(client.name)
      setSignerEmail(client.email)
    }
  }

  const handleSendZapSign = async () => {
    if (!zapDoc) return
    setIsSending(true)
    try {
      await sendDocumentForSignature(process.id, zapDoc.id, signerName, signerEmail)
      toast({ title: 'Documento enviado para o ZapSign com sucesso' })
      setZapDoc(null)
    } catch (error) {
      toast({ title: 'Erro ao enviar para o ZapSign', variant: 'destructive' })
    } finally {
      setIsSending(false)
    }
  }

  const handleCheckStatus = async (doc: ProcessEvent) => {
    if (!doc.zapsignDocumentToken) return
    setIsChecking(doc.id)
    try {
      const signed = await checkZapSignStatus(process.id, doc.id, doc.zapsignDocumentToken)
      if (signed) toast({ title: 'Documento assinado com sucesso!' })
      else toast({ title: 'O documento ainda está pendente.' })
    } catch (e) {
      toast({ title: 'Erro ao verificar status', variant: 'destructive' })
    } finally {
      setIsChecking(null)
    }
  }

  const docs = process.events.filter((e) => e.type === 'documento')

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent className="sm:max-w-md overflow-y-auto z-[50]">
          <SheetHeader className="mb-6">
            <SheetTitle className="font-serif text-2xl text-primary">Gerenciar Processo</SheetTitle>
            <p className="text-sm font-mono text-muted-foreground">{process.number}</p>
          </SheetHeader>

          <Tabs defaultValue="status" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="status">Status</TabsTrigger>
              <TabsTrigger value="movement">Andamento</TabsTrigger>
              <TabsTrigger value="docs">Documentos</TabsTrigger>
            </TabsList>

            <TabsContent value="status" className="space-y-4 mt-4">
              <div className="grid gap-2">
                <Label>Alterar Status</Label>
                <Select value={status} onValueChange={(v: any) => setStatus(v)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Ativo">Ativo</SelectItem>
                    <SelectItem value="Aguardando Prazo">Aguardando Prazo</SelectItem>
                    <SelectItem value="Concluído">Concluído</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleUpdateStatus} className="w-full gap-2">
                <CheckCircle className="w-4 h-4" /> Salvar Alteração
              </Button>
            </TabsContent>

            <TabsContent value="movement" className="space-y-4 mt-4">
              <div className="grid gap-2">
                <Label>Título da Movimentação</Label>
                <Input
                  value={movTitle}
                  onChange={(e) => setMovTitle(e.target.value)}
                  placeholder="Ex: Sentença Proferida"
                />
              </div>
              <div className="grid gap-2">
                <Label>Descrição / Notas ao Cliente</Label>
                <Textarea
                  value={movDesc}
                  onChange={(e) => setMovDesc(e.target.value)}
                  className="min-h-[100px]"
                  placeholder="Detalhes em linguagem clara..."
                />
              </div>
              <Button
                onClick={handleAddMovement}
                className="w-full gap-2 bg-secondary hover:bg-secondary/90 text-white"
              >
                <Plus className="w-4 h-4" /> Adicionar Andamento
              </Button>
            </TabsContent>

            <TabsContent value="docs" className="space-y-4 mt-4">
              <div className="border-2 border-dashed rounded-lg p-6 text-center bg-slate-50">
                <FileText className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
                <p className="text-sm font-medium text-primary mb-1">Upload de Arquivo</p>
                <div className="relative mt-4">
                  <Button variant="outline" className="w-full">
                    Selecionar e Enviar
                  </Button>
                  <input
                    type="file"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    onChange={handleFileUpload}
                  />
                </div>
              </div>

              <div className="mt-8">
                <h4 className="font-medium text-sm text-primary mb-3">Documentos Anexados</h4>
                <div className="space-y-2">
                  {docs.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-2">
                      Nenhum documento.
                    </p>
                  ) : (
                    docs.map((doc) => (
                      <div
                        key={doc.id}
                        className="flex items-center justify-between p-3 border rounded-lg bg-white"
                      >
                        <div className="flex items-center gap-3 overflow-hidden pr-2">
                          <FileText className="w-4 h-4 text-muted-foreground shrink-0" />
                          <span className="text-sm font-medium truncate max-w-[140px]">
                            {doc.title}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          {!doc.zapsignDocumentToken ? (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleOpenZapSign(doc)}
                            >
                              ZapSign
                            </Button>
                          ) : (
                            <>
                              <Badge
                                className={
                                  doc.signatureStatus === 'signed'
                                    ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-0 shadow-none'
                                    : doc.signatureStatus === 'canceled'
                                      ? 'bg-red-100 text-red-700 hover:bg-red-100 border-0 shadow-none'
                                      : 'bg-amber-100 text-amber-700 hover:bg-amber-100 border-0 shadow-none'
                                }
                              >
                                {doc.signatureStatus === 'signed'
                                  ? 'Assinado'
                                  : doc.signatureStatus === 'canceled'
                                    ? 'Cancelado'
                                    : 'Pendente ZapSign'}
                              </Badge>
                              {doc.signatureStatus === 'pending' && (
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="h-8 w-8"
                                  onClick={() => handleCheckStatus(doc)}
                                  disabled={isChecking === doc.id}
                                  title="Verificar Status"
                                >
                                  <RefreshCw
                                    className={cn(
                                      'w-4 h-4',
                                      isChecking === doc.id && 'animate-spin',
                                    )}
                                  />
                                </Button>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </SheetContent>
      </Sheet>

      <Dialog open={!!zapDoc} onOpenChange={(v) => !v && setZapDoc(null)}>
        <DialogContent className="sm:max-w-md z-[100]">
          <DialogHeader>
            <DialogTitle>Enviar para Assinatura via ZapSign</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Nome do Signatário</Label>
              <Input value={signerName} onChange={(e) => setSignerName(e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label>Email / WhatsApp</Label>
              <Input value={signerEmail} onChange={(e) => setSignerEmail(e.target.value)} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setZapDoc(null)}>
              Cancelar
            </Button>
            <Button onClick={handleSendZapSign} disabled={isSending}>
              {isSending ? 'Enviando...' : 'Enviar Documento'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
