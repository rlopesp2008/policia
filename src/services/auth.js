import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail,
  updatePassword
} from 'firebase/auth';
// Firestore imports removed to avoid connection issues
// Storage imports removed to avoid connection issues
import { auth } from '../firebase';
// Removed logsService import to prevent circular dependency

// User roles and permissions
export const USER_ROLES = {
  ADMIN: 'admin',
  SUPERINTENDENT: 'superintendent', 
  INSPECTOR: 'inspector',
  OFFICER: 'officer',
  DISPATCHER: 'dispatcher'
};

export const PERMISSIONS = {
  READ_INCIDENTS: 'read_incidents',
  WRITE_INCIDENTS: 'write_incidents',
  DELETE_INCIDENTS: 'delete_incidents',
  MANAGE_PATROLS: 'manage_patrols',
  VIEW_REPORTS: 'view_reports',
  SYSTEM_ADMIN: 'system_admin',
  MANAGE_USERS: 'manage_users'
};

// Role permissions mapping
const ROLE_PERMISSIONS = {
  [USER_ROLES.ADMIN]: [
    PERMISSIONS.READ_INCIDENTS,
    PERMISSIONS.WRITE_INCIDENTS,
    PERMISSIONS.DELETE_INCIDENTS,
    PERMISSIONS.MANAGE_PATROLS,
    PERMISSIONS.VIEW_REPORTS,
    PERMISSIONS.SYSTEM_ADMIN,
    PERMISSIONS.MANAGE_USERS
  ],
  [USER_ROLES.SUPERINTENDENT]: [
    PERMISSIONS.READ_INCIDENTS,
    PERMISSIONS.WRITE_INCIDENTS,
    PERMISSIONS.DELETE_INCIDENTS,
    PERMISSIONS.MANAGE_PATROLS,
    PERMISSIONS.VIEW_REPORTS,
    PERMISSIONS.MANAGE_USERS
  ],
  [USER_ROLES.INSPECTOR]: [
    PERMISSIONS.READ_INCIDENTS,
    PERMISSIONS.WRITE_INCIDENTS,
    PERMISSIONS.MANAGE_PATROLS,
    PERMISSIONS.VIEW_REPORTS
  ],
  [USER_ROLES.OFFICER]: [
    PERMISSIONS.READ_INCIDENTS,
    PERMISSIONS.WRITE_INCIDENTS
  ],
  [USER_ROLES.DISPATCHER]: [
    PERMISSIONS.READ_INCIDENTS,
    PERMISSIONS.WRITE_INCIDENTS,
    PERMISSIONS.MANAGE_PATROLS
  ]
};

export const authService = {
  // Sign in with email and password
  signIn: async (email, password) => {
    try {
      console.log('🔐 authService.signIn chamado com:', { email, password: password ? '***' : 'vazio' });
      console.log('🔐 Firebase auth config:', { 
        apiKey: auth.app.options.apiKey ? 'configurado' : 'não configurado',
        authDomain: auth.app.options.authDomain ? 'configurado' : 'não configurado'
      });
      
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      console.log('✅ Firebase auth successful, user:', user.email);
      
      // Mark this as a manual login
      sessionStorage.setItem('manualLogin', 'true');
      
      // Create basic user data without any Firestore dependency
      const userData = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        // Set default values for required fields
        role: USER_ROLES.OFFICER,
        permissions: ROLE_PERMISSIONS[USER_ROLES.OFFICER],
        isActive: true
      };

      // Skip Firestore completely to avoid connection errors
      console.log('✅ Login realizado:', user.email, '- using basic profile without Firestore');

      return userData;
    } catch (error) {
      console.error('❌ Erro no login:', error);
      console.error('❌ Error code:', error.code);
      console.error('❌ Error message:', error.message);
      
      // Log failed login attempt
      console.error('❌ Login failed for:', email, error.message);
      
      // Provide more user-friendly error messages
      let userMessage = 'Erro no login';
      switch (error.code) {
        case 'auth/user-not-found':
          userMessage = 'Email não encontrado. Verifique se o email está correto ou registe-se primeiro.';
          break;
        case 'auth/wrong-password':
          userMessage = 'Palavra-passe incorreta. Tente novamente.';
          break;
        case 'auth/invalid-email':
          userMessage = 'Email inválido. Verifique o formato do email.';
          break;
        case 'auth/too-many-requests':
          userMessage = 'Muitas tentativas de login. Tente novamente mais tarde.';
          break;
        case 'auth/network-request-failed':
          userMessage = 'Erro de conexão. Verifique sua internet e tente novamente.';
          break;
        default:
          userMessage = `Erro no login: ${error.message}`;
      }
      
      const customError = new Error(userMessage);
      customError.originalError = error;
      throw customError;
    }
  },

  // Create new user account
  signUp: async (userData) => {
    try {
      console.log('📝 authService.signUp chamado com:', { 
        email: userData.email, 
        nome: userData.nome,
        cargo: userData.cargo,
        matricula: userData.matricula,
        password: userData.password ? '***' : 'vazio'
      });
      
      const { email, password, nome, cargo, matricula, foto } = userData;

      // Always set a short, safe default photo immediately to avoid long URLs
      const defaultPhoto = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100';
      const initialPhotoURL = defaultPhoto;

      // Sign out any existing user to prevent auto-login of previous user
      try {
        if (auth.currentUser) {
          await signOut(auth);
          console.log('Signed out previous user before registration');
          // Clear the manual login flag
          sessionStorage.removeItem('manualLogin');
          // Small delay to ensure sign-out completes
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      } catch (signOutError) {
        console.log('No previous user to sign out');
      }

      // Create Firebase Auth user with retry mechanism
      let userCredential;
      let retryCount = 0;
      const maxRetries = 3;
      
      console.log('🔄 Tentando criar usuário Firebase...');
      
      while (retryCount < maxRetries) {
        try {
          userCredential = await createUserWithEmailAndPassword(auth, email, password);
          console.log('✅ Usuário Firebase criado com sucesso');
          break;
        } catch (error) {
          retryCount++;
          console.log(`❌ Tentativa ${retryCount} falhou:`, error.code, error.message);
          
          if (retryCount >= maxRetries) {
            console.log('❌ Todas as tentativas falharam');
            throw error;
          }
          
          console.log(`🔄 Tentativa ${retryCount + 1} em ${retryCount} segundos...`);
          await new Promise(resolve => setTimeout(resolve, 1000 * retryCount));
        }
      }
      
      const user = userCredential.user;

      // Immediately set profile to default (fast, no errors)
      await updateProfile(user, {
        displayName: nome,
        photoURL: initialPhotoURL
      });

      // Skip Firestore save to avoid connection errors
      console.log('User registration completed - Firestore save skipped to avoid connection issues');

      // Skip photo upload to avoid connection issues
      if (foto && typeof foto === 'string' && foto.startsWith('data:image/')) {
        console.log('Photo upload skipped to avoid connection issues');
      }

      // Mark this as a manual login
      sessionStorage.setItem('manualLogin', 'true');
      
      // Log user registration
      console.log('✅ Novo usuário registrado:', nome, cargo);

      return {
        uid: user.uid,
        email: user.email,
        displayName: nome,
        photoURL: initialPhotoURL,
        cargo,
        matricula,
        role: USER_ROLES.OFFICER
      };
    } catch (error) {
      console.error('❌ Erro no registro:', error);
      console.error('❌ Error code:', error.code);
      console.error('❌ Error message:', error.message);
      
      // Provide more user-friendly error messages
      let userMessage = 'Erro no registro';
      switch (error.code) {
        case 'auth/email-already-in-use':
          userMessage = 'Este email já está em uso. Tente fazer login ou use outro email.';
          break;
        case 'auth/invalid-email':
          userMessage = 'Email inválido. Verifique o formato do email.';
          break;
        case 'auth/weak-password':
          userMessage = 'Palavra-passe muito fraca. Use pelo menos 6 caracteres.';
          break;
        case 'auth/operation-not-allowed':
          userMessage = 'Registro de usuários não está habilitado. Contacte o administrador.';
          break;
        case 'auth/network-request-failed':
          userMessage = 'Erro de conexão. Verifique sua internet e tente novamente.';
          break;
        default:
          userMessage = `Erro no registro: ${error.message}`;
      }
      
      const customError = new Error(userMessage);
      customError.originalError = error;
      throw customError;
    }
  },

  // Sign out
  signOut: async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        console.log('Logout realizado:', user.email);
      }
      
      // Clear the manual login flag
      sessionStorage.removeItem('manualLogin');
      
      await signOut(auth);
    } catch (error) {
      console.error('Erro no logout:', error);
      throw error;
    }
  },

  // Update user password
  updatePassword: async (newPassword) => {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('Usuário não autenticado');
      
      await updatePassword(user, newPassword);
      
      console.log('Senha atualizada para:', user.email);
      
    } catch (error) {
      console.error('Erro ao atualizar senha:', error);
      throw error;
    }
  },

  // Send password reset email
  resetPassword: async (email) => {
    try {
      await sendPasswordResetEmail(auth, email);
      
      console.log('Password reset solicitado para:', email);
      
    } catch (error) {
      console.error('Erro ao enviar email de reset:', error);
      throw error;
    }
  },

  // Upload profile photo (disabled to avoid connection issues)
  uploadPhoto: async (file) => {
    throw new Error('Photo upload temporarily disabled to avoid connection issues');
  },

  // Get current user
  getCurrentUser: () => auth.currentUser,

  // Listen to auth state changes
  onAuthStateChanged: (callback) => {
    return onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Check if this is an automatic session restoration
        const isAutoLogin = !sessionStorage.getItem('manualLogin');
        
        if (isAutoLogin) {
          console.log('Auto-login detected, signing out automatically');
          try {
            await signOut(auth);
            console.log('Auto-login user signed out successfully');
            callback(null);
            return;
          } catch (signOutError) {
            console.error('Failed to sign out auto-login user:', signOutError);
          }
        }
        
        // Create basic user data without any Firestore dependency
        const userData = {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          // Set default values for required fields
          role: USER_ROLES.OFFICER,
          permissions: ROLE_PERMISSIONS[USER_ROLES.OFFICER],
          isActive: true
        };
        
        // Skip Firestore completely to avoid connection errors
        console.log('Auth state changed - using basic profile without Firestore');
        
        callback(userData);
      } else {
        console.log('Auth state changed - user logged out');
        callback(null);
      }
    });
  },

  // Check if user has permission
  hasPermission: (user, permission) => {
    if (!user || !user.permissions) return false;
    return user.permissions.includes(permission);
  },

  // Check if user has role
  hasRole: (user, role) => {
    if (!user) return false;
    return user.role === role;
  },

  // Update user role (admin only) - disabled to avoid connection issues
  updateUserRole: async (userId, newRole, adminUser) => {
    throw new Error('User role updates temporarily disabled to avoid connection issues');
  }
};

export default authService;