import { useState, useEffect } from 'react';
import { authService } from '../services/auth'; // Using real Firebase auth

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false); // Start with false, no loading
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    let unsubscribe = null;

    // Initialize auth listener
    try {
      unsubscribe = authService.onAuthStateChanged((userData) => {
        console.log('🔄 Auth state changed:', userData ? `User: ${userData.displayName}` : 'No user');
        if (mounted) {
          setUser(userData);
          setError(null);
        }
      });
    } catch (error) {
      console.error('Auth initialization error:', error);
      if (mounted) {
        setError('Erro na inicialização da autenticação: ' + error.message);
      }
    }

    return () => {
      mounted = false;
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const signIn = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      console.log('🔐 useAuth signIn called:', email);
      const userData = await authService.signIn(email, password);
      console.log('✅ useAuth signIn success:', userData.displayName);
      return userData;
    } catch (error) {
      console.error('❌ useAuth signIn error:', error);
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      console.log('📝 useAuth signUp called:', userData.nome);
      const newUser = await authService.signUp(userData);
      console.log('✅ useAuth signUp success:', newUser.displayName);
      return newUser;
    } catch (error) {
      console.error('❌ useAuth signUp error:', error);
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      console.log('🚪 useAuth signOut called');
      await authService.signOut();
      console.log('✅ useAuth signOut success');
    } catch (error) {
      console.error('❌ useAuth signOut error:', error);
      setError(error.message);
      throw error;
    }
  };

  const hasPermission = (permission) => {
    return authService.hasPermission(user, permission);
  };

  const hasRole = (role) => {
    return authService.hasRole(user, role);
  };

  return {
    user,
    loading,
    error,
    signIn,
    signUp,
    signOut,
    hasPermission,
    hasRole,
    isAuthenticated: !!user
  };
};