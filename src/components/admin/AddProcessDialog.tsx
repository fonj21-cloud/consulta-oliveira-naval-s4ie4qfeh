import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import useDataStore from '@/stores/useDataStore'
import { useToast } from '@/hooks/use-toast'
import { formatCNJ } from '@/lib/utils'

export function AddProcessDialog({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (v: boolean) => void
}) {
  const { clients, addProcess } = useDataStore()
  const { toast } = useToast()

  const [clientId, setClientId] = useState('')
  const [number, setNumber] = useState('')
  const [court, setCourt] = useState('')
  const [plaintiff, setPlaintiff] = useState('')
  const [defendant, setDefendant] = useState('')

  const handleSave = () => {
    if (!clientId || !number) return
    const client = clients.find((c) => c.id === clientId)
    addProcess({
      id: Math.random().toString(),
      clientId,
      number,
      status: 'Ativo',
      court: court || 'Vara do Trabalho do Rio de Janeiro',
      plaintiff: plaintiff || client?.name || '',
      defendant: defendant || 'Empresa Reclamada',
      startDate: new Date().toLocaleDateString('pt-BR'),
      value: 'R$ 0,00',
      lawyer: {
        name: 'Dr. Roberto Naval',
        oab: 'OAB/RJ 123456',
        phone: '',
        avatar: 'https://img.usecurling.com/ppl/medium?gender=male&seed=1',
      },
      events: [
        {
          id: '1',
          date: new Date().toLocaleDateString('pt-BR'),
          title: 'Processo Cadastrado',
          description: 'Processo incluído no sistema de acompanhamento.',
          type: 'movimentacao',
        },
      ],
    })
    toast({ title: 'Processo adicionado com sucesso' })
    onOpenChange(false)
    setClientId('')
    setNumber('')
    setCourt('')
    setPlaintiff('')
    setDefendant('')
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="font-serif text-xl text-primary">Novo Processo</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label>Vincular a Cliente</Label>
            <Select value={clientId} onValueChange={setClientId}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione..." />
              </SelectTrigger>
              <SelectContent>
                {clients.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label>Número CNJ</Label>
            <Input
              value={number}
              onChange={(e) => setNumber(formatCNJ(e.target.value))}
              placeholder="0000000-00.0000.0.00.0000"
            />
          </div>
          <div className="grid gap-2">
            <Label>Vara / Juízo</Label>
            <Input
              value={court}
              onChange={(e) => setCourt(e.target.value)}
              placeholder="Ex: 1ª Vara do Trabalho do RJ"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label>Reclamante</Label>
              <Input value={plaintiff} onChange={(e) => setPlaintiff(e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label>Reclamado</Label>
              <Input value={defendant} onChange={(e) => setDefendant(e.target.value)} />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSave} className="bg-primary hover:bg-primary/90 text-white">
            Cadastrar Processo
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
