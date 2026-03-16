import { useState } from 'react'
import { FileCheck, XCircle, CheckCircle2, MessageSquare } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import useDataStore from '@/stores/useDataStore'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/hooks/use-toast'

export default function AdminApprovals() {
  const { processes, setDocumentApproval } = useDataStore()
  const { user } = useAuth()
  const { toast } = useToast()

  const [rejectDialog, setRejectDialog] = useState<{ processId: string; eventId: string } | null>(
    null,
  )
  const [rejectReason, setRejectReason] = useState('')

  const pendingDocs = processes.flatMap((p) =>
    p.events
      .filter((e) => e.type === 'documento' && e.approvalStatus === 'pending_approval')
      .map((e) => ({ ...e, processId: p.id, processNumber: p.number, plaintiff: p.plaintiff })),
  )

  const handleApprove = (processId: string, eventId: string) => {
    setDocumentApproval(processId, eventId, 'approved', undefined, user?.name)
    toast({ title: 'Documento Aprovado', description: 'Pronto para envio via ZapSign.' })
  }

  const handleReject = () => {
    if (rejectDialog && rejectReason) {
      setDocumentApproval(
        rejectDialog.processId,
        rejectDialog.eventId,
        'rejected',
        rejectReason,
        user?.name,
      )
      toast({
        title: 'Documento Reprovado',
        description: 'O autor será notificado para correção.',
        variant: 'destructive',
      })
      setRejectDialog(null)
      setRejectReason('')
    }
  }

  return (
    <div className="max-w-6xl mx-auto animate-fade-in">
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-bold text-primary mb-1">Aprovação de Documentos</h1>
        <p className="text-muted-foreground">
          Validação de peças e contratos antes do envio aos clientes.
        </p>
      </div>

      <Card className="border-0 shadow-sm overflow-hidden">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow>
                <TableHead className="pl-6 h-12">Documento</TableHead>
                <TableHead>Processo</TableHead>
                <TableHead>Criado por</TableHead>
                <TableHead className="text-right pr-6">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pendingDocs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                    <FileCheck className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    Nenhum documento aguardando aprovação.
                  </TableCell>
                </TableRow>
              ) : (
                pendingDocs.map((doc) => (
                  <TableRow key={doc.id} className="h-16">
                    <TableCell className="pl-6 font-medium text-primary">
                      {doc.title}
                      <Badge
                        variant="outline"
                        className="ml-2 bg-amber-50 text-amber-700 border-amber-200"
                      >
                        Revisão Pendente
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm font-mono text-primary">{doc.processNumber}</div>
                      <div className="text-xs text-muted-foreground">{doc.plaintiff}</div>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {doc.createdBy || 'Sistema'}
                      <div className="text-xs">{doc.date}</div>
                    </TableCell>
                    <TableCell className="text-right pr-6">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 border-emerald-200"
                          onClick={() => handleApprove(doc.processId, doc.id)}
                        >
                          <CheckCircle2 className="w-4 h-4 mr-1" /> Aprovar
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                          onClick={() =>
                            setRejectDialog({ processId: doc.processId, eventId: doc.id })
                          }
                        >
                          <XCircle className="w-4 h-4 mr-1" /> Reprovar
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={!!rejectDialog} onOpenChange={(o) => !o && setRejectDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <MessageSquare className="w-5 h-5" /> Motivo da Reprovação
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Label className="mb-2 block">Quais ajustes são necessários?</Label>
            <Textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Ex: Corrigir a fundamentação no parágrafo 3..."
              className="min-h-[100px]"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectDialog(null)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleReject}>
              Confirmar Reprovação
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
