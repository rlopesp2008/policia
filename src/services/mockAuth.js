// Mock Authentication Service - Funciona sem Firebase para desenvolvimento

let currentUser = null;
let authCallbacks = [];

export const mockAuthService = {
  // Mock login - aceita qualquer credencial para desenvolvimento
  signIn: async (nomeCompleto, password) => {
    try {
      console.log('🔐 MOCK LOGIN - Nome:', nomeCompleto, 'Password:', password);
      
      if (!nomeCompleto || !password) {
        throw new Error('Nome completo e palavra-passe são obrigatórios');
      }

      if (password.length < 3) {
        throw new Error('Palavra-passe deve ter pelo menos 3 caracteres');
      }

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));

      // Create mock user data
      const userData = {
        uid: `mock-${Date.now()}`,
        email: `${nomeCompleto.toLowerCase().replace(/\s+/g, '.')}@psp.pt`,
        displayName: nomeCompleto,
        nomeCompleto: nomeCompleto,
        role: 'officer',
        cargo: 'Agente PSP',
        numeroCC: '12345678 9 ZZ0',
        paisResidencia: 'Portugal',
        permissions: ['read_incidents', 'write_incidents'],
        photoURL: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100'
      };

      // Set current user
      currentUser = userData;

      // Notify all listeners
      authCallbacks.forEach(callback => callback(userData));

      console.log('✅ MOCK LOGIN SUCCESS - User:', userData.displayName);
      return userData;
      
    } catch (error) {
      console.error('❌ MOCK LOGIN ERROR:', error);
      throw error;
    }
  },

  // Mock signup
  signUp: async (userData) => {
    try {
      console.log('📝 MOCK SIGNUP:', userData);
      
      if (!userData.nomeCompleto || !userData.password) {
        throw new Error('Nome completo e palavra-passe são obrigatórios');
      }

      if (!userData.email || !userData.numeroCC) {
        throw new Error('Email e número do cartão de cidadão são obrigatórios');
      }

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1200));

      // Create mock user
      const newUser = {
        uid: `mock-${Date.now()}`,
        email: userData.email,
        displayName: userData.nomeCompleto,
        nomeCompleto: userData.nomeCompleto,
        dataNascimento: userData.dataNascimento,
        paisResidencia: userData.paisResidencia,
        numeroCC: userData.numeroCC,
        role: 'officer',
        cargo: 'Agente PSP',
        permissions: ['read_incidents', 'write_incidents'],
        photoURL: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100'
      };

      // Set as current user
      currentUser = newUser;

      // Notify listeners
      authCallbacks.forEach(callback => callback(newUser));

      console.log('✅ MOCK SIGNUP SUCCESS:', newUser.displayName);
      return newUser;

    } catch (error) {
      console.error('❌ MOCK SIGNUP ERROR:', error);
      throw error;
    }
  },

  // Mock signout
  signOut: async () => {
    console.log('🚪 MOCK SIGNOUT');
    currentUser = null;
    
    // Notify all listeners
    authCallbacks.forEach(callback => callback(null));
    
    return Promise.resolve();
  },

  // Mock auth state listener
  onAuthStateChanged: (callback) => {
    console.log('👂 MOCK AUTH LISTENER ADDED');
    
    // Add callback to list
    authCallbacks.push(callback);
    
    // Immediately call with current state
    callback(currentUser);
    
    // Return unsubscribe function
    return () => {
      console.log('👂 MOCK AUTH LISTENER REMOVED');
      const index = authCallbacks.indexOf(callback);
      if (index > -1) {
        authCallbacks.splice(index, 1);
      }
    };
  },

  // Mock utilities
  hasPermission: (user, permission) => {
    if (!user || !user.permissions) return false;
    return user.permissions.includes(permission);
  },

  hasRole: (user, role) => {
    if (!user) return false;
    return user.role === role;
  },

  getCurrentUser: () => {
    return currentUser;
  }
};

// Export as authService para compatibilidade
export const authService = mockAuthService;
export default mockAuthService;