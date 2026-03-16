import { Mail, Phone, Briefcase } from 'lucide-react'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Badge } from '@/components/ui/badge'
import { Client } from '@/lib/mock-data'
import useDataStore from '@/stores/useDataStore'

export function ClientDetailsSheet({
  client,
  open,
  onOpenChange,
}: {
  client: Client | null
  open: boolean
  onOpenChange: (v: boolean) => void
}) {
  const { processes } = useDataStore()
  if (!client) return null

  const clientProcesses = processes.filter((p) => p.clientId === client.id)

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-md overflow-y-auto">
        <SheetHeader className="mb-6">
          <SheetTitle className="font-serif text-2xl text-primary">Perfil do Cliente</SheetTitle>
        </SheetHeader>

        <div className="space-y-6">
          <div className="bg-slate-50 p-4 rounded-xl border">
            <div className="w-16 h-16 bg-primary text-secondary rounded-full flex items-center justify-center text-2xl font-bold mb-4">
              {client.name.charAt(0)}
            </div>
            <h3 className="font-bold text-lg text-primary">{client.name}</h3>
            <div className="mt-4 space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" /> {client.email}
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4" /> {client.phone}
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-primary flex items-center gap-2 mb-4 border-b pb-2">
              <Briefcase className="w-4 h-4 text-secondary" /> Processos Vinculados
            </h4>
            {clientProcesses.length === 0 ? (
              <p className="text-sm text-muted-foreground">Nenhum processo vinculado.</p>
            ) : (
              <div className="space-y-3">
                {clientProcesses.map((p) => (
                  <div
                    key={p.id}
                    className="p-3 border rounded-lg hover:border-secondary/50 transition-colors"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-mono text-xs font-semibold text-primary">
                        {p.number}
                      </span>
                      <Badge variant="secondary" className="text-[10px]">
                        {p.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-1">
                      {p.plaintiff} x {p.defendant}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
