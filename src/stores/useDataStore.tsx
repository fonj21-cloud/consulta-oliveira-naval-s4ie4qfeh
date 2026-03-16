import React, { createContext, useContext, useState, ReactNode } from 'react'
import {
  Client,
  ProcessDetails,
  ProcessEvent,
  Deadline,
  FinancialEntry,
  WikiEntry,
  Lead,
  LeadInteraction,
  INITIAL_CLIENTS,
  INITIAL_PROCESSES,
  INITIAL_DEADLINES,
  INITIAL_FINANCE,
  INITIAL_WIKI,
  INITIAL_LEADS,
} from '@/lib/mock-data'
import { useToast } from '@/hooks/use-toast'
import { createZapSignDocument, getZapSignDocument } from '@/services/zapsign'

interface DataContextType {
  clients: Client[]
  processes: ProcessDetails[]
  deadlines: Deadline[]
  financialEntries: FinancialEntry[]
  wikiEntries: WikiEntry[]
  leads: Lead[]
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
  sendDocumentForSignature: (
    processId: string,
    eventId: string,
    name: string,
    email: string,
  ) => Promise<void>
  checkZapSignStatus: (processId: string, eventId: string, token: string) => Promise<boolean>

  // Approvals
  setDocumentApproval: (
    processId: string,
    eventId: string,
    status: 'approved' | 'rejected',
    reason?: string,
    approverName?: string,
  ) => void

  // CRM
  addLead: (lead: Omit<Lead, 'id' | 'createdAt' | 'interactions'>) => void
  updateLeadStage: (id: string, stage: Lead['stage']) => void
  addLeadInteraction: (id: string, notes: string) => void
  convertLeadToClient: (id: string) => void

  // Pix
  generatePix: (entryId: string) => void
  payPix: (entryId: string) => void
}

const DataContext = createContext<DataContextType | undefined>(undefined)

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [clients, setClients] = useState<Client[]>(INITIAL_CLIENTS)
  const [processes, setProcesses] = useState<ProcessDetails[]>(INITIAL_PROCESSES)
  const [deadlines, setDeadlines] = useState<Deadline[]>(INITIAL_DEADLINES)
  const [financialEntries, setFinancialEntries] = useState<FinancialEntry[]>(INITIAL_FINANCE)
  const [wikiEntries, setWikiEntries] = useState<WikiEntry[]>(INITIAL_WIKI)
  const [leads, setLeads] = useState<Lead[]>(INITIAL_LEADS)
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
          if (client && event.approvalStatus !== 'pending_approval') {
            triggerWhatsApp(
              client.name,
              event.type === 'documento' ? 'Novo Documento' : 'Nova Movimentação',
            )
          }
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

  const sendDocumentForSignature = async (
    processId: string,
    eventId: string,
    signerName: string,
    signerEmail: string,
  ) => {
    const p = processes.find((p) => p.id === processId)
    if (!p) return
    const ev = p.events.find((e) => e.id === eventId)
    if (!ev) return

    const result = await createZapSignDocument(ev.title, signerName, signerEmail)

    setProcesses((prev) =>
      prev.map((process) =>
        process.id === processId
          ? {
              ...process,
              events: process.events.map((e) =>
                e.id === eventId
                  ? {
                      ...e,
                      requiresSignature: true,
                      signatureStatus: 'pending',
                      zapsignDocumentToken: result.token,
                      signatureUrl: result.signers[0].sign_url,
                    }
                  : e,
              ),
            }
          : process,
      ),
    )
  }

  const checkZapSignStatus = async (processId: string, eventId: string, token: string) => {
    const result = await getZapSignDocument(token)
    if (result.status === 'signed' || result.signers?.every((s: any) => s.status === 'signed')) {
      setProcesses((prev) =>
        prev.map((process) =>
          process.id === processId
            ? {
                ...process,
                events: process.events.map((e) =>
                  e.id === eventId
                    ? {
                        ...e,
                        signatureStatus: 'signed',
                        signedFileUrl: result.signed_file || e.signedFileUrl,
                        signedAt: new Date().toLocaleString('pt-BR'),
                      }
                    : e,
                ),
              }
            : process,
        ),
      )
      return true
    }
    return false
  }

  const setDocumentApproval = (
    processId: string,
    eventId: string,
    status: 'approved' | 'rejected',
    reason?: string,
    approverName?: string,
  ) => {
    setProcesses((prev) =>
      prev.map((p) => {
        if (p.id !== processId) return p
        return {
          ...p,
          events: p.events.map((e) =>
            e.id === eventId
              ? {
                  ...e,
                  approvalStatus: status,
                  rejectionReason: reason,
                  approvedBy: approverName,
                }
              : e,
          ),
        }
      }),
    )
  }

  const addLead = (lead: Omit<Lead, 'id' | 'createdAt' | 'interactions'>) => {
    setLeads((prev) => [
      ...prev,
      {
        ...lead,
        id: Math.random().toString(),
        createdAt: new Date().toLocaleDateString('pt-BR'),
        interactions: [],
      },
    ])
  }

  const updateLeadStage = (id: string, stage: Lead['stage']) => {
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, stage } : l)))
  }

  const addLeadInteraction = (id: string, notes: string) => {
    setLeads((prev) =>
      prev.map((l) =>
        l.id === id
          ? {
              ...l,
              interactions: [
                {
                  id: Math.random().toString(),
                  date: new Date().toLocaleDateString('pt-BR'),
                  notes,
                },
                ...l.interactions,
              ],
            }
          : l,
      ),
    )
  }

  const convertLeadToClient = (id: string) => {
    const lead = leads.find((l) => l.id === id)
    if (!lead) return

    const newClient = {
      id: `c_${Math.random()}`,
      name: lead.name,
      email: lead.email,
      phone: lead.phone,
    }
    setClients((prev) => [...prev, newClient])
    updateLeadStage(id, 'Converted')

    addProcess({
      id: `p_${Math.random()}`,
      clientId: newClient.id,
      number: 'Aguardando Distribuição',
      status: 'Ativo',
      court: 'A definir',
      plaintiff: lead.name,
      defendant: 'A definir',
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
          id: Math.random().toString(),
          date: new Date().toLocaleDateString('pt-BR'),
          title: 'Contrato Assinado',
          description: `Processo iniciado a partir do CRM. Serviço: ${lead.service}`,
          type: 'movimentacao',
        },
      ],
    })
  }

  const generatePix = (entryId: string) => {
    setFinancialEntries((prev) =>
      prev.map((f) =>
        f.id === entryId
          ? {
              ...f,
              pixCode: `0002012636br.gov.bcb.pix0114+5521999999999520400005303999540412345802BR5913${f.amount.toFixed(2)}6009SAO PAULO62070503***6304${Math.floor(Math.random() * 10000)}ABCD`,
            }
          : f,
      ),
    )
  }

  const payPix = (entryId: string) => {
    setFinancialEntries((prev) =>
      prev.map((f) =>
        f.id === entryId
          ? {
              ...f,
              status: 'Pago',
              paidAt: new Date().toLocaleDateString('pt-BR'),
            }
          : f,
      ),
    )
  }

  return (
    <DataContext.Provider
      value={{
        clients,
        processes,
        deadlines,
        financialEntries,
        wikiEntries,
        leads,
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
        sendDocumentForSignature,
        checkZapSignStatus,
        setDocumentApproval,
        addLead,
        updateLeadStage,
        addLeadInteraction,
        convertLeadToClient,
        generatePix,
        payPix,
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
