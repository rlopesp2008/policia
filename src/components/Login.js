import React, { useState } from 'react';
import { authService } from '../services/auth';
import './Login.css';

const Login = ({ onLoginSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    nome: '',
    cargo: '',
    matricula: '',
    foto: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        // Login
        const userData = await authService.signIn(formData.email, formData.password);
        onLoginSuccess(userData);
      } else {
        // Registro
        const userData = await authService.signUp(formData);
        onLoginSuccess(userData);
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!formData.email) {
      setError('Digite seu email para recuperar a senha');
      return;
    }

    try {
      await authService.resetPassword(formData.email);
      setError('Email de recuperação enviado! Verifique sua caixa de entrada.');
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <img src="/logo_pap_MR.png" alt="Logo" className="login-logo" />
          <h2>{isLogin ? 'Entrar no Sistema' : 'Criar Conta'}</h2>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              placeholder="seu@email.com"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Senha</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
              placeholder="••••••••"
            />
          </div>

          {!isLogin && (
            <>
              <div className="form-group">
                <label htmlFor="nome">Nome Completo</label>
                <input
                  type="text"
                  id="nome"
                  name="nome"
                  value={formData.nome}
                  onChange={handleInputChange}
                  required
                  placeholder="Nome completo"
                />
              </div>

              <div className="form-group">
                <label htmlFor="cargo">Cargo</label>
                <input
                  type="text"
                  id="cargo"
                  name="cargo"
                  value={formData.cargo}
                  onChange={handleInputChange}
                  required
                  placeholder="Ex: Policial, Inspetor"
                />
              </div>

              <div className="form-group">
                <label htmlFor="matricula">Matrícula</label>
                <input
                  type="text"
                  id="matricula"
                  name="matricula"
                  value={formData.matricula}
                  onChange={handleInputChange}
                  required
                  placeholder="Número da matrícula"
                />
              </div>
            </>
          )}

          <button 
            type="submit" 
            className="login-button"
            disabled={loading}
          >
            {loading ? 'Carregando...' : (isLogin ? 'Entrar' : 'Criar Conta')}
          </button>
        </form>

        <div className="login-footer">
          {isLogin ? (
            <>
              <button 
                onClick={() => setIsLogin(false)}
                className="link-button"
              >
                Não tem conta? Criar conta
              </button>
              <button 
                onClick={handleForgotPassword}
                className="link-button"
              >
                Esqueceu a senha?
              </button>
            </>
          ) : (
            <button 
              onClick={() => setIsLogin(true)}
              className="link-button"
            >
              Já tem conta? Fazer login
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
