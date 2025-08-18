import React from 'react';
import { useAuth } from '../hooks/useAuth';
import Login from './Login';

const ProtectedRoute = ({ children, requiredRole = null }) => {
  const { user, loading } = useAuth();

  // Mostrar loading enquanto verifica autenticação
  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Verificando autenticação...</p>
      </div>
    );
  }

  // Se não há usuário autenticado, mostrar tela de login
  if (!user) {
    return <Login />;
  }

  // Se há um role específico requerido, verificar permissão
  if (requiredRole && user.role !== requiredRole) {
    return (
      <div className="access-denied">
        <h2>❌ Acesso Negado</h2>
        <p>Você não tem permissão para acessar esta área.</p>
        <p>Role necessário: <strong>{requiredRole}</strong></p>
        <p>Seu role: <strong>{user.role}</strong></p>
      </div>
    );
  }

  // Usuário autenticado e com permissão, mostrar conteúdo
  return children;
};

export default ProtectedRoute;
