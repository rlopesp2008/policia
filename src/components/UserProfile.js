import React, { useState } from 'react';
import { authService } from '../services/auth';
import './UserProfile.css';

const UserProfile = ({ user, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    nome: user?.nome || '',
    cargo: user?.cargo || '',
    matricula: user?.matricula || ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    setError('');

    try {
      // Atualizar dados no Firestore
      // Implementar função de atualização no authService
      setIsEditing(false);
      onUpdate && onUpdate();
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await authService.signOut();
      // Redirecionar para login
    } catch (error) {
      setError(error.message);
    }
  };

  const handlePasswordChange = async () => {
    const newPassword = prompt('Digite sua nova senha (mínimo 6 caracteres):');
    if (!newPassword || newPassword.length < 6) {
      setError('Senha deve ter pelo menos 6 caracteres');
      return;
    }

    try {
      await authService.updatePassword(newPassword);
      setError('Senha atualizada com sucesso!');
    } catch (error) {
      setError(error.message);
    }
  };

  if (!user) return null;

  return (
    <div className="user-profile">
      <div className="profile-header">
        <div className="profile-avatar">
          {user.photoURL ? (
            <img src={user.photoURL} alt="Foto do perfil" />
          ) : (
            <div className="avatar-placeholder">
              {user.nome?.charAt(0) || user.email?.charAt(0)}
            </div>
          )}
        </div>
        
        <div className="profile-info">
          <h3>{user.nome || user.displayName || 'Usuário'}</h3>
          <p className="user-role">{user.role || 'Policial'}</p>
          <p className="user-email">{user.email}</p>
        </div>

        <div className="profile-actions">
          <button 
            onClick={() => setIsEditing(!isEditing)}
            className="edit-button"
          >
            {isEditing ? 'Cancelar' : 'Editar'}
          </button>
          <button 
            onClick={handleLogout}
            className="logout-button"
          >
            Sair
          </button>
        </div>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <div className="profile-details">
        {isEditing ? (
          <div className="edit-form">
            <div className="form-group">
              <label>Nome Completo</label>
              <input
                type="text"
                name="nome"
                value={formData.nome}
                onChange={handleInputChange}
                placeholder="Nome completo"
              />
            </div>

            <div className="form-group">
              <label>Cargo</label>
              <input
                type="text"
                name="cargo"
                value={formData.cargo}
                onChange={handleInputChange}
                placeholder="Cargo"
              />
            </div>

            <div className="form-group">
              <label>Matrícula</label>
              <input
                type="text"
                name="matricula"
                value={formData.matricula}
                onChange={handleInputChange}
                placeholder="Matrícula"
              />
            </div>

            <button 
              onClick={handleSave}
              className="save-button"
              disabled={loading}
            >
              {loading ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        ) : (
          <div className="profile-fields">
            <div className="profile-field">
              <label>Nome:</label>
              <span>{user.nome || user.displayName || 'Não informado'}</span>
            </div>

            <div className="profile-field">
              <label>Cargo:</label>
              <span>{user.cargo || 'Não informado'}</span>
            </div>

            <div className="profile-field">
              <label>Matrícula:</label>
              <span>{user.matricula || 'Não informado'}</span>
            </div>

            <div className="profile-field">
              <label>Função:</label>
              <span className="role-badge">{user.role || 'Policial'}</span>
            </div>

            <div className="profile-field">
              <label>Membro desde:</label>
              <span>{user.createdAt ? new Date(user.createdAt.toDate()).toLocaleDateString('pt-BR') : 'Não informado'}</span>
            </div>
          </div>
        )}
      </div>

      <div className="profile-security">
        <h4>Segurança</h4>
        <button 
          onClick={handlePasswordChange}
          className="password-button"
        >
          Alterar Senha
        </button>
      </div>

      {user.permissions && (
        <div className="profile-permissions">
          <h4>Permissões</h4>
          <div className="permissions-list">
            {user.permissions.map(permission => (
              <span key={permission} className="permission-badge">
                {permission}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
