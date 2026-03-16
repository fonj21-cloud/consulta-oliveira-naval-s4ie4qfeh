import { useState } from 'react'
import { Plus, Search, Settings2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import useDataStore from '@/stores/useDataStore'
import { AddProcessDialog } from '@/components/admin/AddProcessDialog'
import { ManageProcessSheet } from '@/components/admin/ManageProcessSheet'
import { ProcessDetails } from '@/lib/mock-data'

export default function AdminProcesses() {
  const { processes, clients } = useDataStore()
  const [search, setSearch] = useState('')
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [selectedProcess, setSelectedProcess] = useState<ProcessDetails | null>(null)

  const filtered = processes.filter(
    (p) => p.number.includes(search) || p.plaintiff.toLowerCase().includes(search.toLowerCase()),
  )

  return (
    <div className="max-w-6xl mx-auto animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-primary mb-1">Processos Judiciais</h1>
          <p className="text-muted-foreground">Acompanhamento e atualizações de ações.</p>
        </div>
        <Button
          onClick={() => setIsAddOpen(true)}
          className="bg-primary hover:bg-primary/90 text-white gap-2"
        >
          <Plus className="w-4 h-4" /> Cadastrar Processo
        </Button>
      </div>

      <Card className="border-0 shadow-sm overflow-hidden">
        <div className="p-4 border-b bg-white flex items-center">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por CNJ ou Reclamante..."
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
                <TableHead className="pl-6 h-12">Número CNJ</TableHead>
                <TableHead>Cliente/Reclamante</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right pr-6">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((process) => {
                const client = clients.find((c) => c.id === process.clientId)
                return (
                  <TableRow key={process.id} className="h-16">
                    <TableCell className="pl-6 font-mono text-sm font-medium text-primary">
                      {process.number}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {client?.name || process.plaintiff}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="font-normal">
                        {process.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right pr-6">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedProcess(process)}
                        className="text-primary gap-2"
                      >
                        <Settings2 className="w-4 h-4" /> Gerenciar
                      </Button>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <AddProcessDialog open={isAddOpen} onOpenChange={setIsAddOpen} />
      <ManageProcessSheet
        process={selectedProcess}
        open={!!selectedProcess}
        onOpenChange={(v) => !v && setSelectedProcess(null)}
      />
    </div>
  )
}
