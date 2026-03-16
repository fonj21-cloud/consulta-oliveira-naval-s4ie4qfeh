import { useState } from 'react'
import { Plus, Search, DollarSign, QrCode } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import useDataStore from '@/stores/useDataStore'
import { useToast } from '@/hooks/use-toast'

export default function AdminFinance() {
  const { financialEntries, processes, clients, addFinancialEntry, generatePix } = useDataStore()
  const { toast } = useToast()

  const [search, setSearch] = useState('')
  const [isAddOpen, setIsAddOpen] = useState(false)

  // Form State
  const [processId, setProcessId] = useState('')
  const [type, setType] = useState<'Honorários' | 'Custas'>('Honorários')
  const [amount, setAmount] = useState('')
  const [description, setDescription] = useState('')
  const [dueDate, setDueDate] = useState('')

  const handleAdd = () => {
    if (processId && amount && description && dueDate) {
      addFinancialEntry({
        processId,
        type,
        amount: parseFloat(amount),
        description,
        dueDate,
        status: 'Pendente',
      })
      setIsAddOpen(false)
      setProcessId('')
      setAmount('')
      setDescription('')
      setDueDate('')
      toast({ title: 'Lançamento adicionado' })
    }
  }

  const handleGeneratePix = (id: string) => {
    generatePix(id)
    toast({
      title: 'Pix Gerado',
      description: 'Código Pix Copia e Cola disponibilizado para o cliente.',
    })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Pago':
        return (
          <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100 border-0">
            Pago
          </Badge>
        )
      case 'Atrasado':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100 border-0">Atrasado</Badge>
      default:
        return (
          <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100 border-0">
            Pendente
          </Badge>
        )
    }
  }

  const filtered = financialEntries
    .filter(
      (f) =>
        f.description.toLowerCase().includes(search.toLowerCase()) ||
        processes.find((p) => p.id === f.processId)?.number.includes(search),
    )
    .sort((a, b) => new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime())

  return (
    <div className="max-w-6xl mx-auto animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-primary mb-1">Financeiro</h1>
          <p className="text-muted-foreground">Gestão de honorários e custas judiciais.</p>
        </div>
        <Button onClick={() => setIsAddOpen(true)} className="bg-primary text-white gap-2">
          <Plus className="w-4 h-4" /> Novo Lançamento
        </Button>
      </div>

      <Card className="border-0 shadow-sm overflow-hidden">
        <div className="p-4 border-b bg-white flex items-center">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por descrição ou CNJ..."
              className="pl-9 bg-slate-50"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow>
                <TableHead className="pl-6 h-12">Descrição</TableHead>
                <TableHead>Processo / Cliente</TableHead>
                <TableHead>Vencimento</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Valor</TableHead>
                <TableHead className="text-right pr-6">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((entry) => {
                const process = processes.find((p) => p.id === entry.processId)
                const client = process ? clients.find((c) => c.id === process.clientId) : null
                return (
                  <TableRow key={entry.id} className="h-16">
                    <TableCell className="pl-6 font-medium text-primary">
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-secondary" />
                        <div>
                          {entry.description}
                          <span className="block text-xs text-muted-foreground font-normal">
                            {entry.type}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm font-mono text-primary">{process?.number}</div>
                      <div className="text-xs text-muted-foreground">{client?.name}</div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {entry.dueDate.split('-').reverse().join('/')}
                    </TableCell>
                    <TableCell>{getStatusBadge(entry.status)}</TableCell>
                    <TableCell className="text-right font-semibold">
                      {Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
                        entry.amount,
                      )}
                    </TableCell>
                    <TableCell className="text-right pr-6">
                      {entry.status !== 'Pago' && !entry.pixCode && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleGeneratePix(entry.id)}
                        >
                          <QrCode className="w-4 h-4 mr-1" /> Gerar Pix
                        </Button>
                      )}
                      {entry.pixCode && entry.status !== 'Pago' && (
                        <Badge
                          variant="outline"
                          className="border-emerald-200 text-emerald-700 bg-emerald-50 font-normal"
                        >
                          Pix Ativo
                        </Badge>
                      )}
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar Lançamento Financeiro</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Processo Vinculado</label>
              <Select value={processId} onValueChange={setProcessId}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um processo" />
                </SelectTrigger>
                <SelectContent>
                  {processes.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.number} - {p.plaintiff}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Tipo</label>
                <Select value={type} onValueChange={(v: any) => setType(v)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Honorários">Honorários</SelectItem>
                    <SelectItem value="Custas">Custas</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Valor (R$)</label>
                <Input
                  type="number"
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Data de Vencimento</label>
              <Input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Descrição</label>
              <Input
                placeholder="Ex: Parcela 1/3"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleAdd}>Salvar Lançamento</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
