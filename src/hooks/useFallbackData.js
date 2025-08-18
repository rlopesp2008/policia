// Dados de relatórios de crimes enviados por cidadãos via app móvel
export const fallbackOcorrencias = [
  {
    id: '1',
    tipo: 'Assalto',
    descricao: 'Assalto à mão armada em plena luz do dia. Indivíduo com faca ameaçou transeuntes e fugiu a pé.',
    localizacao: 'Rua Augusta, Lisboa',
    coordenadas: { lat: 38.7113, lng: -9.1356 },
    prioridade: 'Alta',
    status: 'Pendente',
    registradaEm: new Date(Date.now() - 15 * 60 * 1000).toISOString(), // 15 min atrás
    reportadoPor: 'Cidadão via App',
    cidadaoNome: 'Maria Silva',
    cidadaoTelefone: '+351 912 345 678',
    imagens: [
      'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400',
      'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400'
    ],
    urgencia: 'Imediata'
  },
  {
    id: '2',
    tipo: 'Roubo de Veículo',
    descricao: 'Motocicleta Honda CBR roubada do estacionamento. Dois suspeitos fugiram numa carrinha branca.',
    localizacao: 'Avenida da Liberdade, Lisboa',
    coordenadas: { lat: 38.7259, lng: -9.1413 },
    prioridade: 'Alta',
    status: 'Em Andamento',
    registradaEm: new Date(Date.now() - 45 * 60 * 1000).toISOString(), // 45 min atrás
    reportadoPor: 'Cidadão via App',
    cidadaoNome: 'João Pereira',
    cidadaoTelefone: '+351 934 567 890',
    imagens: [
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400',
      'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=400'
    ],
    urgencia: 'Alta'
  },
  {
    id: '3',
    tipo: 'Luta/Agressão',
    descricao: 'Altercação entre dois grupos de jovens no Parque. Situação escalou para agressões físicas.',
    localizacao: 'Parque Eduardo VII, Lisboa',
    coordenadas: { lat: 38.7276, lng: -9.1508 },
    prioridade: 'Média',
    status: 'Pendente',
    registradaEm: new Date(Date.now() - 8 * 60 * 1000).toISOString(), // 8 min atrás
    reportadoPor: 'Cidadão via App',
    cidadaoNome: 'Ana Santos',
    cidadaoTelefone: '+351 967 123 456',
    imagens: [
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400'
    ],
    urgencia: 'Moderada'
  },
  {
    id: '4',
    tipo: 'Furto em Loja',
    descricao: 'Furto de produtos numa loja do Chiado. Suspeito ainda no local, escondido.',
    localizacao: 'Rua Garrett, Chiado, Lisboa',
    coordenadas: { lat: 38.7104, lng: -9.1410 },
    prioridade: 'Média',
    status: 'Pendente',
    registradaEm: new Date(Date.now() - 3 * 60 * 1000).toISOString(), // 3 min atrás
    reportadoPor: 'Cidadão via App',
    cidadaoNome: 'Carlos Oliveira',
    cidadaoTelefone: '+351 912 987 654',
    imagens: [
      'https://images.unsplash.com/photo-1556740738-b6a63e27c4df?w=400',
      'https://images.unsplash.com/photo-1560472355-536de3962603?w=400'
    ],
    urgencia: 'Moderada'
  },
  {
    id: '5',
    tipo: 'Vandalismo',
    descricao: 'Graffiti e danos em monumento histórico. Vários jovens ainda no local.',
    localizacao: 'Mosteiro dos Jerónimos, Belém',
    coordenadas: { lat: 38.6979, lng: -9.2063 },
    prioridade: 'Baixa',
    status: 'Resolvida',
    registradaEm: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2h atrás
    reportadoPor: 'Cidadão via App',
    cidadaoNome: 'Teresa Costa',
    cidadaoTelefone: '+351 923 456 789',
    imagens: [
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400'
    ],
    urgencia: 'Baixa'
  }
];

export const fallbackPatrulhas = [
  {
    id: '1',
    codigo: 'PSP-01',
    agentes: ['Agente Silva', 'Agente Santos'],
    viatura: 'PSP-001',
    zona: 'Lisboa Centro',
    status: 'Ativa',
    turno: 'Manhã (08h-16h)',
    responsavel: 'Sgt. Silva',
    coordenadas: { lat: 38.7223, lng: -9.1393 }
  },
  {
    id: '2',
    codigo: 'PSP-02',
    agentes: ['Agente Costa', 'Agente Pereira'],
    viatura: 'PSP-002',
    zona: 'Belém',
    status: 'Em Patrulha',
    turno: 'Tarde (16h-00h)',
    responsavel: 'Sgt. Costa',
    coordenadas: { lat: 38.6965, lng: -9.2058 }
  },
  {
    id: '3',
    codigo: 'PSP-03',
    agentes: ['Agente Oliveira', 'Agente Martins'],
    viatura: 'PSP-003',
    zona: 'Chiado/Bairro Alto',
    status: 'Ativa',
    turno: 'Noite (00h-08h)',
    responsavel: 'Sgt. Oliveira',
    coordenadas: { lat: 38.7107, lng: -9.1417 }
  }
];

export const fallbackEstatisticas = {
  ocorrenciasAtivas: 4, // Relatórios pendentes + em andamento
  patrulhas: 3,
  resolvidas: 1,
  tempoMedio: 15, // minutos
  ocorrenciasRecentes: [
    {
      id: 1,
      tipo: 'Assalto',
      localizacao: 'Rua Augusta, Lisboa',
      tempo: '15 min',
      status: 'Pendente'
    },
    {
      id: 4,
      tipo: 'Furto em Loja',
      localizacao: 'Chiado, Lisboa',
      tempo: '3 min',
      status: 'Pendente'
    },
    {
      id: 3,
      tipo: 'Luta/Agressão',
      localizacao: 'Parque Eduardo VII',
      tempo: '8 min',
      status: 'Pendente'
    }
  ]
};

export const fallbackUser = {
  uid: 'fallback-user',
  email: 'demo@sistema.policial',
  displayName: 'Usuário Demo',
  role: 'officer',
  cargo: 'Agente',
  matricula: 'DEMO001',
  permissions: ['read_incidents', 'write_incidents']
};