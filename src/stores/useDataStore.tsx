import React, { createContext, useContext, useState, ReactNode } from 'react'
import {
  Client,
  ProcessDetails,
  ProcessEvent,
  Deadline,
  FinancialEntry,
  WikiEntry,
  INITIAL_CLIENTS,
  INITIAL_PROCESSES,
  INITIAL_DEADLINES,
  INITIAL_FINANCE,
  INITIAL_WIKI,
} from '@/lib/mock-data'
import { useToast } from '@/hooks/use-toast'

interface DataContextType {
  clients: Client[]
  processes: ProcessDetails[]
  deadlines: Deadline[]
  financialEntries: FinancialEntry[]
  wikiEntries: WikiEntry[]
  whatsappConnected: boolean
  setWhatsappConnected: (v: boolean) => void
  addClient: (c: Client) => void
  addProcess: (p: ProcessDetails) => void
  updateProcessStatus: (id: string, status: ProcessDetails['status']) => void
  addProcessEvent: (processId: string, event: Omit<ProcessEvent, 'id'>) => void
  syncProcessWithTRT: (id: string) => void
  signDocument: (processId: string, eventId: string) => void
  addFinancialEntry: (f: Omit<FinancialEntry, 'id'>) => void
  addWikiEntry: (w: Omit<WikiEntry, 'id' | 'updatedAt'>) => void
}

const DataContext = createContext<DataContextType | undefined>(undefined)

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [clients, setClients] = useState<Client[]>(INITIAL_CLIENTS)
  const [processes, setProcesses] = useState<ProcessDetails[]>(INITIAL_PROCESSES)
  const [deadlines, setDeadlines] = useState<Deadline[]>(INITIAL_DEADLINES)
  const [financialEntries, setFinancialEntries] = useState<FinancialEntry[]>(INITIAL_FINANCE)
  const [wikiEntries, setWikiEntries] = useState<WikiEntry[]>(INITIAL_WIKI)
  const [whatsappConnected, setWhatsappConnected] = useState(true)
  const { toast } = useToast()

  const triggerWhatsApp = (clientName: string, type: string) => {
    if (whatsappConnected) {
      toast({
        title: 'Notificação Automática',
        description: `Mensagem de "${type}" enviada para ${clientName}.`,
        className: 'bg-[#25D366] text-white border-none',
      })
    }
  }

  const addClient = (c: Client) => setClients((prev) => [...prev, c])
  const addProcess = (p: ProcessDetails) => setProcesses((prev) => [...prev, p])

  const updateProcessStatus = (id: string, status: ProcessDetails['status']) => {
    setProcesses((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const client = clients.find((c) => c.id === p.clientId)
          if (client) triggerWhatsApp(client.name, `Novo Status: ${status}`)
          return { ...p, status }
        }
        return p
      }),
    )
  }

  const addProcessEvent = (processId: string, event: Omit<ProcessEvent, 'id'>) => {
    setProcesses((prev) =>
      prev.map((p) => {
        if (p.id === processId) {
          const client = clients.find((c) => c.id === p.clientId)
          if (client)
            triggerWhatsApp(
              client.name,
              event.type === 'documento' ? 'Novo Documento' : 'Nova Movimentação',
            )
          return { ...p, events: [{ ...event, id: Math.random().toString() }, ...p.events] }
        }
        return p
      }),
    )
  }

  const syncProcessWithTRT = (id: string) => {
    setProcesses((prev) => prev.map((p) => (p.id === id ? { ...p, syncStatus: 'Syncing' } : p)))
    setTimeout(() => {
      setProcesses((prev) =>
        prev.map((p) => {
          if (p.id === id) {
            const client = clients.find((c) => c.id === p.clientId)
            if (client) triggerWhatsApp(client.name, `Atualização TRT`)
            return {
              ...p,
              syncStatus: 'Up to date',
              lastSyncDate: new Date().toLocaleString('pt-BR'),
              events: [
                {
                  id: Math.random().toString(),
                  date: new Date().toLocaleDateString('pt-BR'),
                  title: 'Movimentação PJe TRT',
                  description: 'Andamento capturado automaticamente.',
                  type: 'movimentacao',
                },
                ...p.events,
              ],
            }
          }
          return p
        }),
      )
    }, 1500)
  }

  const signDocument = (processId: string, eventId: string) => {
    setProcesses((prev) =>
      prev.map((p) =>
        p.id === processId
          ? {
              ...p,
              events: p.events.map((e) =>
                e.id === eventId
                  ? {
                      ...e,
                      signatureStatus: 'signed',
                      signedAt: new Date().toLocaleString('pt-BR'),
                    }
                  : e,
              ),
            }
          : p,
      ),
    )
  }

  const addFinancialEntry = (f: Omit<FinancialEntry, 'id'>) => {
    setFinancialEntries((prev) => [...prev, { ...f, id: Math.random().toString() }])
  }

  const addWikiEntry = (w: Omit<WikiEntry, 'id' | 'updatedAt'>) => {
    setWikiEntries((prev) => [
      ...prev,
      { ...w, id: Math.random().toString(), updatedAt: new Date().toISOString().split('T')[0] },
    ])
  }

  return (
    <DataContext.Provider
      value={{
        clients,
        processes,
        deadlines,
        financialEntries,
        wikiEntries,
        whatsappConnected,
        setWhatsappConnected,
        addClient,
        addProcess,
        updateProcessStatus,
        addProcessEvent,
        syncProcessWithTRT,
        signDocument,
        addFinancialEntry,
        addWikiEntry,
      }}
    >
      {children}
    </DataContext.Provider>
  )
}

export default function useDataStore() {
  const context = useContext(DataContext)
  if (!context) throw new Error('useDataStore must be used within DataProvider')
  return context
}
