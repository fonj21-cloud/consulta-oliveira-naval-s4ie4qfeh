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
    lawyer: {
      name: 'Dr. Roberto Naval',
      oab: 'OAB/RJ 123456',
      phone: '5521999999999',
      avatar: 'https://img.usecurling.com/ppl/medium?gender=male&seed=1',
    },
    events: [
      {
        id: 'e1',
        date: '10/11/2023',
        title: 'Audiência de Conciliação Designada',
        description: 'Foi marcada a data para a primeira tentativa de acordo entre as partes.',
        type: 'audiencia',
      },
      {
        id: 'e2',
        date: '15/03/2023',
        title: 'Petição Inicial.pdf',
        description: 'Petição inicial anexada ao processo.',
        type: 'documento',
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
