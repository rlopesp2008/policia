import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  onSnapshot,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../firebase';

// Collections
const COLLECTIONS = {
  OCORRENCIAS: 'ocorrencias',
  PATRULHAS: 'patrulhas', 
  USUARIOS: 'usuarios',
  RELATORIOS: 'relatorios',
  LOGS: 'system_logs'
};

// Ocorrências (Incidents)
export const ocorrenciasService = {
  // Get all incidents
  getAll: async () => {
    try {
      const querySnapshot = await getDocs(
        query(collection(db, COLLECTIONS.OCORRENCIAS), orderBy('registradaEm', 'desc'))
      );
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Erro ao buscar ocorrências:', error);
      throw error;
    }
  },

  // Get incident by ID
  getById: async (id) => {
    try {
      const docRef = doc(db, COLLECTIONS.OCORRENCIAS, id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      }
      return null;
    } catch (error) {
      console.error('Erro ao buscar ocorrência:', error);
      throw error;
    }
  },

  // Create new incident
  create: async (ocorrenciaData) => {
    try {
      const docRef = await addDoc(collection(db, COLLECTIONS.OCORRENCIAS), {
        ...ocorrenciaData,
        registradaEm: serverTimestamp(),
        status: 'Pendente'
      });
      return docRef.id;
    } catch (error) {
      console.error('Erro ao criar ocorrência:', error);
      throw error;
    }
  },

  // Update incident
  update: async (id, updates) => {
    try {
      const docRef = doc(db, COLLECTIONS.OCORRENCIAS, id);
      await updateDoc(docRef, {
        ...updates,
        atualizadaEm: serverTimestamp()
      });
    } catch (error) {
      console.error('Erro ao atualizar ocorrência:', error);
      throw error;
    }
  },

  // Delete incident
  delete: async (id) => {
    try {
      await deleteDoc(doc(db, COLLECTIONS.OCORRENCIAS, id));
    } catch (error) {
      console.error('Erro ao deletar ocorrência:', error);
      throw error;
    }
  },

  // Get active incidents
  getActive: async () => {
    try {
      const q = query(
        collection(db, COLLECTIONS.OCORRENCIAS),
        where('status', 'in', ['Pendente', 'Em Andamento']),
        orderBy('registradaEm', 'desc')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Erro ao buscar ocorrências ativas:', error);
      throw error;
    }
  },

  // Listen to real-time changes
  listen: (callback) => {
    const q = query(collection(db, COLLECTIONS.OCORRENCIAS), orderBy('registradaEm', 'desc'));
    return onSnapshot(q, (querySnapshot) => {
      const ocorrencias = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      callback(ocorrencias);
    }, (error) => {
      console.error('Erro no listener de ocorrências:', error);
    });
  }
};

// Patrulhas (Patrols)
export const patrulhasService = {
  // Get all patrols
  getAll: async () => {
    try {
      const querySnapshot = await getDocs(collection(db, COLLECTIONS.PATRULHAS));
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Erro ao buscar patrulhas:', error);
      throw error;
    }
  },

  // Get active patrols
  getActive: async () => {
    try {
      const q = query(
        collection(db, COLLECTIONS.PATRULHAS),
        where('status', '==', 'Ativa')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Erro ao buscar patrulhas ativas:', error);
      throw error;
    }
  },

  // Update patrol status
  updateStatus: async (id, status) => {
    try {
      const docRef = doc(db, COLLECTIONS.PATRULHAS, id);
      await updateDoc(docRef, {
        status,
        atualizadaEm: serverTimestamp()
      });
    } catch (error) {
      console.error('Erro ao atualizar status da patrulha:', error);
      throw error;
    }
  },

  // Listen to real-time changes
  listen: (callback) => {
    const q = query(collection(db, COLLECTIONS.PATRULHAS));
    return onSnapshot(q, (querySnapshot) => {
      const patrulhas = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      callback(patrulhas);
    });
  }
};

// Usuários (Users)
export const usuariosService = {
  // Get user by ID
  getById: async (id) => {
    try {
      const docRef = doc(db, COLLECTIONS.USUARIOS, id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      }
      return null;
    } catch (error) {
      console.error('Erro ao buscar usuário:', error);
      throw error;
    }
  },

  // Create or update user profile
  save: async (id, userData) => {
    try {
      const docRef = doc(db, COLLECTIONS.USUARIOS, id);
      await updateDoc(docRef, {
        ...userData,
        atualizadoEm: serverTimestamp()
      });
    } catch (error) {
      console.error('Erro ao salvar usuário:', error);
      throw error;
    }
  }
};

// System Logs
export const logsService = {
  // Add system log
  add: async (logData) => {
    try {
      await addDoc(collection(db, COLLECTIONS.LOGS), {
        ...logData,
        timestamp: serverTimestamp()
      });
    } catch (error) {
      console.error('Erro ao adicionar log:', error);
    }
  }
};

// Statistics
export const estatisticasService = {
  // Get dashboard statistics
  getDashboardStats: async () => {
    try {
      // Get active incidents count
      const activeIncidents = await ocorrenciasService.getActive();
      const activePatrols = await patrulhasService.getActive();
      
      // Get resolved incidents today
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const resolvedQuery = query(
        collection(db, COLLECTIONS.OCORRENCIAS),
        where('status', '==', 'Resolvida'),
        where('atualizadaEm', '>=', today)
      );
      const resolvedSnapshot = await getDocs(resolvedQuery);
      
      return {
        ocorrenciasAtivas: activeIncidents.length,
        patrulhas: activePatrols.length,
        resolvidas: resolvedSnapshot.size,
        tempoMedio: 8, // TODO: Calculate actual average response time
        ocorrenciasRecentes: activeIncidents.slice(0, 3).map(oc => ({
          id: oc.id,
          tipo: oc.tipo,
          localizacao: oc.localizacao,
          tempo: '2 min', // TODO: Calculate actual time
          status: oc.status
        }))
      };
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error);
      throw error;
    }
  }
};

export default { ocorrenciasService, patrulhasService, usuariosService, logsService, estatisticasService };