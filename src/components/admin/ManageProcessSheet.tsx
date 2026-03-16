import { useState } from 'react'
import { FileText, Plus, CheckCircle } from 'lucide-react'
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
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { ProcessDetails } from '@/lib/mock-data'
import useDataStore from '@/stores/useDataStore'
import { useToast } from '@/hooks/use-toast'

export function ManageProcessSheet({
  process,
  open,
  onOpenChange,
}: {
  process: ProcessDetails | null
  open: boolean
  onOpenChange: (v: boolean) => void
}) {
  const { updateProcessStatus, addProcessEvent } = useDataStore()
  const { toast } = useToast()

  const [status, setStatus] = useState<ProcessDetails['status']>(process?.status || 'Ativo')
  const [movTitle, setMovTitle] = useState('')
  const [movDesc, setMovDesc] = useState('')
  const [requiresSignature, setRequiresSignature] = useState(false)

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
      requiresSignature,
      signatureStatus: requiresSignature ? 'pending' : undefined,
    })
    setRequiresSignature(false)
    toast({ title: 'Documento anexado com sucesso' })
  }

  const docs = process.events.filter((e) => e.type === 'documento')

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-md overflow-y-auto">
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
              <div className="flex items-center justify-center space-x-2 mt-4 mb-4">
                <Switch
                  id="req-sig"
                  checked={requiresSignature}
                  onCheckedChange={setRequiresSignature}
                />
                <Label htmlFor="req-sig">Exige assinatura do cliente</Label>
              </div>
              <div className="relative">
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
                      <div className="flex items-center gap-3">
                        <FileText className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm font-medium truncate max-w-[150px]">
                          {doc.title}
                        </span>
                      </div>
                      {doc.requiresSignature && (
                        <Badge
                          className={
                            doc.signatureStatus === 'signed'
                              ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-0 shadow-none'
                              : 'bg-amber-100 text-amber-700 hover:bg-amber-100 border-0 shadow-none'
                          }
                        >
                          {doc.signatureStatus === 'signed' ? 'Assinado' : 'Pendente'}
                        </Badge>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  )
}
