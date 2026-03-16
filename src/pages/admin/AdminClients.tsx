import { useState } from 'react'
import { Plus, Search, Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import useDataStore from '@/stores/useDataStore'
import { AddClientDialog } from '@/components/admin/AddClientDialog'
import { ClientDetailsSheet } from '@/components/admin/ClientDetailsSheet'
import { Client } from '@/lib/mock-data'

export default function AdminClients() {
  const { clients } = useDataStore()
  const [search, setSearch] = useState('')
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [selectedClient, setSelectedClient] = useState<Client | null>(null)

  const filtered = clients.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()),
  )

  return (
    <div className="max-w-6xl mx-auto animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-primary mb-1">Clientes</h1>
          <p className="text-muted-foreground">Gerencie a base de clientes do escritório.</p>
        </div>
        <Button
          onClick={() => setIsAddOpen(true)}
          className="bg-primary hover:bg-primary/90 text-white gap-2"
        >
          <Plus className="w-4 h-4" /> Novo Cliente
        </Button>
      </div>

      <Card className="border-0 shadow-sm overflow-hidden">
        <div className="p-4 border-b bg-white flex items-center">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome ou e-mail..."
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
                <TableHead className="pl-6 h-12">Nome</TableHead>
                <TableHead>E-mail</TableHead>
                <TableHead>Telefone</TableHead>
                <TableHead className="text-right pr-6">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((client) => (
                <TableRow key={client.id} className="h-16">
                  <TableCell className="pl-6 font-medium text-primary">{client.name}</TableCell>
                  <TableCell className="text-muted-foreground">{client.email}</TableCell>
                  <TableCell className="text-muted-foreground">{client.phone}</TableCell>
                  <TableCell className="text-right pr-6">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedClient(client)}
                      className="text-secondary hover:text-secondary hover:bg-secondary/10"
                    >
                      <Eye className="w-4 h-4 mr-2" /> Perfil
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <AddClientDialog open={isAddOpen} onOpenChange={setIsAddOpen} />
      <ClientDetailsSheet
        client={selectedClient}
        open={!!selectedClient}
        onOpenChange={(v) => !v && setSelectedClient(null)}
      />
    </div>
  )
}
