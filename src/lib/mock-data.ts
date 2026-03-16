export interface Client {
  id: string
  name: string
  email: string
  phone: string
}

export interface ProcessEvent {
  id: string
  date: string
  title: string
  description: string
  type: 'movimentacao' | 'documento' | 'audiencia' | 'conclusao'
  requiresSignature?: boolean
  signatureStatus?: 'pending' | 'signed' | 'canceled'
  signedAt?: string
  zapsignDocumentToken?: string
  signatureUrl?: string
  signedFileUrl?: string
}

export interface Lawyer {
  name: string
  oab: string
  phone: string
  avatar: string
}

export interface ProcessDetails {
  id: string
  clientId: string
  number: string
  status: 'Ativo' | 'Concluído' | 'Aguardando Prazo'
  court: string
  plaintiff: string
  defendant: string
  startDate: string
  value: string
  lawyer: Lawyer
  events: ProcessEvent[]
  lastSyncDate?: string
  syncStatus?: 'Up to date' | 'Syncing' | 'Error'
}

export interface Deadline {
  id: string
  processId: string
  title: string
  description: string
  date: string
}

export interface FinancialEntry {
  id: string
  processId: string
  type: 'Honorários' | 'Custas'
  amount: number
  description: string
  dueDate: string
  status: 'Pendente' | 'Pago' | 'Atrasado'
  paidAt?: string
}

export interface WikiEntry {
  id: string
  title: string
  category: 'Teses Jurídicas' | 'Modelos de Petições' | 'Notas Técnicas' | string
  content: string
  updatedAt: string
}

const today = new Date()
const addDays = (d: Date, days: number) => {
  const nd = new Date(d)
  nd.setDate(nd.getDate() + days)
  return nd.toISOString().split('T')[0]
}

export const INITIAL_CLIENTS: Client[] = [
  { id: '1', name: 'João Carlos Silva', email: 'joao@email.com', phone: '(21) 99999-9999' },
  { id: '2', name: 'Maria Eduarda Costa', email: 'maria@email.com', phone: '(21) 98888-8888' },
]

export const INITIAL_PROCESSES: ProcessDetails[] = [
  {
    id: 'p1',
    clientId: '1',
    number: '0010234-56.2023.5.01.0001',
    status: 'Ativo',
    court: '1ª Vara do Trabalho do Rio de Janeiro',
    plaintiff: 'João Carlos Silva',
    defendant: 'Tech Solutions SA',
    startDate: '15/03/2023',
    value: 'R$ 45.000,00',
    lastSyncDate: 'Hoje, 09:30',
    syncStatus: 'Up to date',
    lawyer: {
      name: 'Dr. Roberto Naval',
      oab: 'OAB/RJ 123456',
      phone: '5521999999999',
      avatar: 'https://img.usecurling.com/ppl/medium?gender=male&seed=1',
    },
    events: [
      {
        id: 'e3',
        date: '20/10/2023',
        title: 'Procuração Ad Judicia.pdf',
        description: 'Documento requer sua assinatura digital para representação legal.',
        type: 'documento',
        requiresSignature: true,
        signatureStatus: 'pending',
        zapsignDocumentToken: 'mock-1234',
        signatureUrl: 'https://sandbox.zapsign.com.br/assinar/mock-1234',
      },
      {
        id: 'e1',
        date: '10/11/2023',
        title: 'Audiência de Conciliação Designada',
        description: 'Foi marcada a data para a primeira tentativa de acordo entre as partes.',
        type: 'audiencia',
      },
    ],
  },
  {
    id: 'p2',
    clientId: '2',
    number: '0001234-12.2022.5.01.0045',
    status: 'Concluído',
    court: '45ª Vara do Trabalho do Rio de Janeiro',
    plaintiff: 'Maria Eduarda Costa',
    defendant: 'Supermercados Guanabara',
    startDate: '10/01/2022',
    value: 'R$ 12.500,00',
    lastSyncDate: '15/09/2023',
    syncStatus: 'Up to date',
    lawyer: {
      name: 'Dra. Ana Oliveira',
      oab: 'OAB/RJ 654321',
      phone: '5521988888888',
      avatar: 'https://img.usecurling.com/ppl/medium?gender=female&seed=2',
    },
    events: [
      {
        id: 'e4',
        date: '20/08/2023',
        title: 'Alvará Expedido',
        description: 'O valor da condenação foi liberado e transferido para a conta informada.',
        type: 'conclusao',
      },
    ],
  },
]

export const INITIAL_DEADLINES: Deadline[] = [
  {
    id: 'd1',
    processId: 'p1',
    title: 'Contestação',
    description: 'Apresentar contestação da inicial',
    date: addDays(today, 1),
  },
  {
    id: 'd2',
    processId: 'p2',
    title: 'Recurso Ordinário',
    description: 'Prazo final para interpor recurso',
    date: addDays(today, 5),
  },
  {
    id: 'd3',
    processId: 'p1',
    title: 'Juntada de Documentos',
    description: 'Juntar comprovantes de horas extras',
    date: addDays(today, 12),
  },
]

export const INITIAL_FINANCE: FinancialEntry[] = [
  {
    id: 'f1',
    processId: 'p1',
    type: 'Honorários',
    amount: 5000,
    description: 'Sinal inicial',
    dueDate: addDays(today, -5),
    status: 'Atrasado',
  },
  {
    id: 'f2',
    processId: 'p1',
    type: 'Custas',
    amount: 350,
    description: 'Custas processuais',
    dueDate: addDays(today, 10),
    status: 'Pendente',
  },
  {
    id: 'f3',
    processId: 'p2',
    type: 'Honorários',
    amount: 1500,
    description: 'Parcela final',
    dueDate: addDays(today, -15),
    status: 'Pago',
    paidAt: addDays(today, -15),
  },
]

export const INITIAL_WIKI: WikiEntry[] = [
  {
    id: 'w1',
    title: 'Reforma Trabalhista - Horas In itinere',
    category: 'Teses Jurídicas',
    content:
      'Fundamentação atualizada sobre horas in itinere após a reforma trabalhista. O entendimento atual dos tribunais...',
    updatedAt: addDays(today, -30),
  },
  {
    id: 'w2',
    title: 'Modelo Petição Inicial Acidente Trabalho',
    category: 'Modelos de Petições',
    content:
      'EXCELENTÍSSIMO SENHOR DOUTOR JUIZ DA VARA DO TRABALHO...\n\nQualificação do reclamante...',
    updatedAt: addDays(today, -10),
  },
  {
    id: 'w3',
    title: 'Contagem de Prazos PJe TRT1',
    category: 'Notas Técnicas',
    content:
      'Atenção aos prazos no PJe do TRT1. Finais de semana e feriados requerem checagem do calendário oficial do tribunal.',
    updatedAt: addDays(today, -2),
  },
]
