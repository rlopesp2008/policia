import { collection, addDoc, doc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';

// Sample data for initial population
const sampleOcorrencias = [
  {
    tipo: 'Roubo de Veículo',
    descricao: 'Veículo furtado na Avenida Central durante o período noturno. Suspeitos em fuga.',
    localizacao: 'Avenida Fernão de Magalhães, Coimbra',
    prioridade: 'Alta',
    status: 'Pendente',
    registradaEm: new Date('2024-01-15T14:30:00'),
    reportadoPor: 'Central 190'
  },
  {
    tipo: 'Furto em Residência',
    descricao: 'Arrombamento de residência com subtração de objetos de valor.',
    localizacao: 'Rua do Brasil, 45, Coimbra',
    prioridade: 'Média',
    status: 'Em Andamento',
    registradaEm: new Date('2024-01-15T13:45:00'),
    reportadoPor: 'Morador'
  },
  {
    tipo: 'Vandalismo',
    descricao: 'Danos ao patrimônio público - pichações em monumento histórico.',
    localizacao: 'Praça da República, Coimbra',
    prioridade: 'Baixa',
    status: 'Resolvida',
    registradaEm: new Date('2024-01-15T12:20:00'),
    reportadoPor: 'Cidadão',
    resolvidaEm: new Date('2024-01-15T15:30:00')
  },
  {
    tipo: 'Assalto a Mão Armada',
    descricao: 'Assalto em estabelecimento comercial com uso de arma branca.',
    localizacao: 'Rua Direita, Centro, Coimbra',
    prioridade: 'Alta',
    status: 'Pendente',
    registradaEm: new Date('2024-01-15T14:15:00'),
    reportadoPor: 'Comerciante'
  },
  {
    tipo: 'Acidente de Trânsito',
    descricao: 'Colisão entre dois veículos com feridos leves.',
    localizacao: 'Rotunda da Solum, Coimbra',
    prioridade: 'Média',
    status: 'Em Andamento',
    registradaEm: new Date('2024-01-15T11:00:00'),
    reportadoPor: 'INEM'
  }
];

const samplePatrulhas = [
  {
    codigo: 'P-01',
    agentes: ['Agente Silva', 'Agente Santos'],
    viatura: 'VTR-001',
    zona: 'Centro',
    status: 'Ativa',
    turno: 'Manhã',
    responsavel: 'Sgt. Silva'
  },
  {
    codigo: 'P-02',
    agentes: ['Agente Costa', 'Agente Oliveira'],
    viatura: 'VTR-002',
    zona: 'Norte',
    status: 'Em Patrulha',
    turno: 'Tarde',
    responsavel: 'Sgt. Costa'
  },
  {
    codigo: 'P-03',
    agentes: ['Agente Pereira', 'Agente Ferreira'],
    viatura: 'VTR-003',
    zona: 'Sul',
    status: 'Inativa',
    turno: 'Noite',
    responsavel: 'Sgt. Pereira'
  },
  {
    codigo: 'P-04',
    agentes: ['Agente Martins', 'Agente Rodrigues'],
    viatura: 'VTR-004',
    zona: 'Leste',
    status: 'Ativa',
    turno: 'Manhã',
    responsavel: 'Sgt. Martins'
  },
  {
    codigo: 'P-05',
    agentes: ['Agente Sousa', 'Agente Mendes'],
    viatura: 'VTR-005',
    zona: 'Oeste',
    status: 'Em Emergência',
    turno: 'Tarde',
    responsavel: 'Sgt. Sousa'
  }
];

// Function to populate the database
export const populateDatabase = async () => {
  try {
    console.log('🔄 Iniciando população do banco de dados...');

    // Add incidents
    console.log('📝 Adicionando ocorrências...');
    for (const ocorrencia of sampleOcorrencias) {
      await addDoc(collection(db, 'ocorrencias'), ocorrencia);
    }
    console.log(`✅ ${sampleOcorrencias.length} ocorrências adicionadas`);

    // Add patrols
    console.log('👮 Adicionando patrulhas...');
    for (const patrulha of samplePatrulhas) {
      await addDoc(collection(db, 'patrulhas'), patrulha);
    }
    console.log(`✅ ${samplePatrulhas.length} patrulhas adicionadas`);

    // Add system configuration
    console.log('⚙️ Configurando sistema...');
    await setDoc(doc(db, 'system', 'config'), {
      name: 'Sistema Policial de Alerta',
      version: '1.0.0',
      initialized: new Date(),
      features: {
        realTimeUpdates: true,
        gpsTracking: false,
        notifications: true,
        reporting: true
      }
    });

    console.log('✅ Banco de dados populado com sucesso!');
    return true;
  } catch (error) {
    console.error('❌ Erro ao popular banco de dados:', error);
    return false;
  }
};

// Helper function to clear all data (for development)
export const clearDatabase = async () => {
  try {
    console.log('🧹 Limpando banco de dados...');
    // Note: This would require additional implementation to delete all documents
    // For now, this is a placeholder for development use
    console.log('⚠️ Função de limpeza não implementada - use o console do Firebase');
    return true;
  } catch (error) {
    console.error('❌ Erro ao limpar banco de dados:', error);
    return false;
  }
};

// Export the functions
export default { populateDatabase, clearDatabase };