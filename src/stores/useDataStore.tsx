import React, { createContext, useContext, useState, ReactNode } from 'react'
import {
  Client,
  ProcessDetails,
  ProcessEvent,
  INITIAL_CLIENTS,
  INITIAL_PROCESSES,
} from '@/lib/mock-data'
import { useToast } from '@/hooks/use-toast'

interface DataContextType {
  clients: Client[]
  processes: ProcessDetails[]
  whatsappConnected: boolean
  setWhatsappConnected: (v: boolean) => void
  addClient: (c: Client) => void
  addProcess: (p: ProcessDetails) => void
  updateProcessStatus: (id: string, status: ProcessDetails['status']) => void
  addProcessEvent: (processId: string, event: Omit<ProcessEvent, 'id'>) => void
}

const DataContext = createContext<DataContextType | undefined>(undefined)

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [clients, setClients] = useState<Client[]>(INITIAL_CLIENTS)
  const [processes, setProcesses] = useState<ProcessDetails[]>(INITIAL_PROCESSES)
  const [whatsappConnected, setWhatsappConnected] = useState(true)
  const { toast } = useToast()

  const triggerWhatsApp = (clientName: string, type: string) => {
    if (whatsappConnected) {
      toast({
        title: 'Mensagem Automática (WhatsApp API)',
        description: `Notificação de "${type}" enviada com sucesso para ${clientName}.`,
        className: 'bg-[#25D366] text-white border-none',
      })
    }
  }

  const addClient = (c: Client) => {
    setClients((prev) => [...prev, c])
  }

  const addProcess = (p: ProcessDetails) => {
    setProcesses((prev) => [...prev, p])
  }

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

  return (
    <DataContext.Provider
      value={{
        clients,
        processes,
        whatsappConnected,
        setWhatsappConnected,
        addClient,
        addProcess,
        updateProcessStatus,
        addProcessEvent,
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
