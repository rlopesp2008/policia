import React, { useState, useEffect } from 'react';
import { collection, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { USER_ROLES, PERMISSIONS } from '../services/auth';
import './UserManagement.css';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingUser, setEditingUser] = useState(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const usersCollection = collection(db, 'usuarios');
      const userSnapshot = await getDocs(usersCollection);
      const usersList = userSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setUsers(usersList);
    } catch (error) {
      setError('Erro ao carregar usuários: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      const userRef = doc(db, 'usuarios', userId);
      await updateDoc(userRef, {
        role: newRole,
        permissions: getPermissionsForRole(newRole),
        updatedAt: new Date()
      });
      
      // Atualizar lista local
      setUsers(prev => prev.map(user => 
        user.id === userId 
          ? { ...user, role: newRole, permissions: getPermissionsForRole(newRole) }
          : user
      ));
      
      setError('Role atualizado com sucesso!');
    } catch (error) {
      setError('Erro ao atualizar role: ' + error.message);
    }
  };

  const handleStatusChange = async (userId, isActive) => {
    try {
      const userRef = doc(db, 'usuarios', userId);
      await updateDoc(userRef, {
        isActive: isActive,
        updatedAt: new Date()
      });
      
      // Atualizar lista local
      setUsers(prev => prev.map(user => 
        user.id === userId 
          ? { ...user, isActive: isActive }
          : user
      ));
      
      setError('Status atualizado com sucesso!');
    } catch (error) {
      setError('Erro ao atualizar status: ' + error.message);
    }
  };

  const getPermissionsForRole = (role) => {
    const rolePermissions = {
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
    return rolePermissions[role] || [];
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'Não informado';
    try {
      return new Date(timestamp.toDate()).toLocaleDateString('pt-BR');
    } catch {
      return 'Data inválida';
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Carregando usuários...</p>
      </div>
    );
  }

  return (
    <div className="user-management">
      <div className="management-header">
        <h2>👥 Gerenciamento de Usuários</h2>
        <p>Total de usuários: {users.length}</p>
      </div>

      {error && (
        <div className={`message ${error.includes('sucesso') ? 'success' : 'error'}`}>
          {error}
        </div>
      )}

      <div className="users-table-container">
        <table className="users-table">
          <thead>
            <tr>
              <th>👤 Nome</th>
              <th>📧 Email</th>
              <th>🎖️ Cargo</th>
              <th>🆔 Matrícula</th>
              <th>👑 Role</th>
              <th>📅 Criado em</th>
              <th>✅ Status</th>
              <th>⚙️ Ações</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id} className={!user.isActive ? 'inactive-user' : ''}>
                <td>
                  <div className="user-info">
                    {user.foto && (
                      <img src={user.foto} alt={user.nome} className="user-avatar" />
                    )}
                    <span>{user.nome || 'Não informado'}</span>
                  </div>
                </td>
                <td>{user.email}</td>
                <td>{user.cargo || 'Não informado'}</td>
                <td>{user.matricula || 'Não informado'}</td>
                <td>
                  <select
                    value={user.role || USER_ROLES.OFFICER}
                    onChange={(e) => handleRoleChange(user.id, e.target.value)}
                    className="role-select"
                  >
                    <option value={USER_ROLES.ADMIN}>👑 Admin</option>
                    <option value={USER_ROLES.SUPERINTENDENT}>👨‍💼 Superintendent</option>
                    <option value={USER_ROLES.INSPECTOR}>🔍 Inspector</option>
                    <option value={USER_ROLES.OFFICER}>👮 Officer</option>
                    <option value={USER_ROLES.DISPATCHER}>📞 Dispatcher</option>
                  </select>
                </td>
                <td>{formatDate(user.createdAt)}</td>
                <td>
                  <label className="status-toggle">
                    <input
                      type="checkbox"
                      checked={user.isActive !== false}
                      onChange={(e) => handleStatusChange(user.id, e.target.checked)}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </td>
                <td>
                  <div className="action-buttons">
                    <button
                      onClick={() => setEditingUser(user)}
                      className="edit-btn"
                      title="Editar usuário"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => window.open(`mailto:${user.email}`)}
                      className="email-btn"
                      title="Enviar email"
                    >
                      📧
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="management-stats">
        <div className="stat-card">
          <h3>📊 Estatísticas</h3>
          <div className="stats-grid">
            <div className="stat-item">
              <span className="stat-number">{users.filter(u => u.role === USER_ROLES.ADMIN).length}</span>
              <span className="stat-label">Admins</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{users.filter(u => u.role === USER_ROLES.OFFICER).length}</span>
              <span className="stat-label">Officers</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{users.filter(u => u.isActive !== false).length}</span>
              <span className="stat-label">Ativos</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{users.filter(u => u.isActive === false).length}</span>
              <span className="stat-label">Inativos</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
