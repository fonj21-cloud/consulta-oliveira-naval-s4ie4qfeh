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
            <div className="border-2 border-dashed rounded-lg p-8 text-center bg-slate-50">
              <FileText className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
              <p className="text-sm font-medium text-primary mb-1">Fazer Upload de Arquivo</p>
              <p className="text-xs text-muted-foreground mb-4">PDF, DOCX, JPG (Max 10MB)</p>
              <div className="relative">
                <Button variant="outline" className="w-full">
                  Selecionar Arquivo
                </Button>
                <input
                  type="file"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  onChange={handleFileUpload}
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  )
}
