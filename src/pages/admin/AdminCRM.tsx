import { useState } from 'react'
import { Plus, Phone, Mail, UserPlus, FileText } from 'lucide-react'
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
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import useDataStore from '@/stores/useDataStore'
import { Lead } from '@/lib/mock-data'
import { useToast } from '@/hooks/use-toast'

const STAGES = [
  'New Contact',
  'Initial Meeting',
  'Proposal Sent',
  'Contracting',
  'Converted',
  'Lost',
] as const

export default function AdminCRM() {
  const { leads, addLead, updateLeadStage, addLeadInteraction, convertLeadToClient } =
    useDataStore()
  const { toast } = useToast()

  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)
  const [isAddOpen, setIsAddOpen] = useState(false)

  // New Lead Form
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [service, setService] = useState('')

  // Interaction Form
  const [notes, setNotes] = useState('')

  const handleAddLead = () => {
    if (name && service) {
      addLead({ name, email, phone, service, stage: 'New Contact' })
      setIsAddOpen(false)
      setName('')
      setEmail('')
      setPhone('')
      setService('')
      toast({ title: 'Lead adicionado com sucesso!' })
    }
  }

  const handleAddInteraction = () => {
    if (selectedLead && notes) {
      addLeadInteraction(selectedLead.id, notes)
      setNotes('')
      toast({ title: 'Interação registrada.' })
    }
  }

  const handleConvert = () => {
    if (selectedLead) {
      convertLeadToClient(selectedLead.id)
      setSelectedLead(null)
      toast({
        title: 'Lead convertido em Cliente!',
        description: 'Perfil e processo rascunho criados.',
      })
    }
  }

  return (
    <div className="h-full flex flex-col animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-primary mb-1">CRM e Prospecção</h1>
          <p className="text-muted-foreground">Gerencie o funil de vendas do escritório.</p>
        </div>
        <Button
          onClick={() => setIsAddOpen(true)}
          className="bg-primary hover:bg-primary/90 text-white gap-2"
        >
          <Plus className="w-4 h-4" /> Novo Lead
        </Button>
      </div>

      <div className="flex-1 overflow-x-auto pb-4">
        <div className="flex gap-4 min-w-max h-full">
          {STAGES.map((stage) => (
            <div key={stage} className="w-80 flex flex-col bg-slate-100 rounded-xl p-3 shrink-0">
              <div className="flex justify-between items-center mb-3 px-1">
                <h3 className="font-semibold text-sm text-slate-700 uppercase tracking-wider">
                  {stage}
                </h3>
                <Badge variant="secondary" className="bg-slate-200 text-slate-700 border-0">
                  {leads.filter((l) => l.stage === stage).length}
                </Badge>
              </div>
              <div className="flex-1 overflow-y-auto space-y-3">
                {leads
                  .filter((l) => l.stage === stage)
                  .map((lead) => (
                    <Card
                      key={lead.id}
                      className="border-0 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => setSelectedLead(lead)}
                    >
                      <CardContent className="p-4">
                        <p className="font-semibold text-primary mb-1">{lead.name}</p>
                        <p className="text-xs text-muted-foreground mb-2">{lead.service}</p>
                        <div className="flex items-center justify-between text-xs text-slate-500">
                          <span>{lead.createdAt}</span>
                          {lead.interactions.length > 0 && (
                            <span className="flex items-center gap-1">
                              <FileText className="w-3 h-3" /> {lead.interactions.length}
                            </span>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Novo Lead (Prospecto)</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Nome Completo</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>E-mail</Label>
                <Input value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div className="grid gap-2">
                <Label>WhatsApp</Label>
                <Input value={phone} onChange={(e) => setPhone(e.target.value)} />
              </div>
            </div>
            <div className="grid gap-2">
              <Label>Serviço de Interesse</Label>
              <Input
                value={service}
                onChange={(e) => setService(e.target.value)}
                placeholder="Ex: Defesa Trabalhista"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleAddLead}>Salvar Lead</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!selectedLead} onOpenChange={(o) => !o && setSelectedLead(null)}>
        <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex justify-between items-start pr-8">
              <div>
                <DialogTitle className="text-2xl font-serif text-primary">
                  {selectedLead?.name}
                </DialogTitle>
                <p className="text-sm text-secondary font-medium mt-1">{selectedLead?.service}</p>
              </div>
              {selectedLead?.stage !== 'Converted' && (
                <Button
                  onClick={handleConvert}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2"
                >
                  <UserPlus className="w-4 h-4" /> Converter em Cliente
                </Button>
              )}
            </div>
          </DialogHeader>

          {selectedLead && (
            <div className="space-y-6 py-4">
              <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="w-4 h-4 text-muted-foreground" />{' '}
                  {selectedLead.email || 'Não informado'}
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="w-4 h-4 text-muted-foreground" />{' '}
                  {selectedLead.phone || 'Não informado'}
                </div>
                <div className="col-span-2 pt-2 border-t">
                  <Label className="mb-2 block">Estágio do Funil</Label>
                  <Select
                    value={selectedLead.stage}
                    onValueChange={(v: any) => updateLeadStage(selectedLead.id, v)}
                  >
                    <SelectTrigger className="bg-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {STAGES.map((s) => (
                        <SelectItem key={s} value={s}>
                          {s}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-primary mb-3">Histórico de Interações</h4>
                <div className="flex gap-2 mb-4">
                  <Textarea
                    placeholder="Nova anotação ou resumo de reunião..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="min-h-[60px]"
                  />
                  <Button onClick={handleAddInteraction} className="h-auto">
                    Salvar
                  </Button>
                </div>
                <div className="space-y-3">
                  {selectedLead.interactions.length === 0 ? (
                    <p className="text-sm text-muted-foreground">Nenhuma interação registrada.</p>
                  ) : (
                    selectedLead.interactions.map((i) => (
                      <div key={i.id} className="bg-white border rounded-lg p-3 text-sm">
                        <span className="text-xs text-muted-foreground block mb-1">{i.date}</span>
                        <p>{i.notes}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
