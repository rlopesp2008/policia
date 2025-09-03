import { BrowserRouter as Router, Routes, Route, Link, NavLink } from 'react-router-dom';
import './App.css';
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getFunctions, httpsCallable } from 'firebase/functions';

// Components
import ErrorBoundary from './ErrorBoundary';
import ErrorMessage, { ErrorToast, SuccessToast } from './components/ErrorMessage';
import UserManagement from './components/UserManagement';

// Hooks
import { useAuth } from './hooks/useAuth';
import { useOcorrencias } from './hooks/useOcorrencias';
import { usePatrulhas } from './hooks/usePatrulhas';
import { useEstatisticas } from './hooks/useEstatisticas';

// Logout button component
function LogoutButton() {
  const { signOut, user } = useAuth();

  const handleLogout = async () => {
    if (window.confirm('Tem a certeza que pretende sair do sistema?')) {
      try {
        await signOut();
        console.log('Logout realizado com sucesso');
      } catch (error) {
        console.error('Erro ao fazer logout:', error);
        alert('Erro ao sair do sistema');
      }
    }
  };

  if (!user) return null;

  return (
    <div className="logout-section">
      <div className="user-info">
        <div className="user-avatar">
          {user.photoURL ? (
            <img src={user.photoURL} alt={user.displayName} />
          ) : (
            <div className="avatar-placeholder">👮</div>
          )}
        </div>
        <div className="user-details">
          <p className="user-name">{user.displayName}</p>
          <p className="user-role">{user.cargo || 'Agente'}</p>
        </div>
      </div>
      <button 
        onClick={handleLogout}
        className="logout-btn"
        title="Sair do sistema"
      >
        🚪 Sair
      </button>
    </div>
  );
}

// Services (permissions temporarily disabled)

function MenuLateral() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Mobile menu toggle button */}
      <button className="menu-toggle" onClick={toggleMobileMenu}>
        ☰
      </button>

      {/* Mobile menu overlay */}
      <div 
        className={`menu-overlay ${isMobileMenuOpen ? 'active' : ''}`} 
        onClick={closeMobileMenu}
      ></div>

      {/* Sidebar menu */}
      <div className={`menu-lateral ${isMobileMenuOpen ? 'menu-open' : ''}`}>
        <div className="logo-container">
          <img src="/logo_pap_MR.png" alt="Logo PSP" className="logo" />
          <h3 className="logo-text">🇵🇹 Polícia Alerta</h3>
        </div>
        <nav className="nav-menu">
          <ul>
            <li><NavLink to="/" end className={({ isActive }) => isActive ? 'active' : ''} onClick={closeMobileMenu}>📊 Dashboard</NavLink></li>
            <li><NavLink to="/ocorrencias" className={({ isActive }) => isActive ? 'active' : ''} onClick={closeMobileMenu}>📱 Relatórios</NavLink></li>
            <li><NavLink to="/patrulhas" className={({ isActive }) => isActive ? 'active' : ''} onClick={closeMobileMenu}>🚔 Patrulhas PSP</NavLink></li>
            <li><NavLink to="/relatorios" className={({ isActive }) => isActive ? 'active' : ''} onClick={closeMobileMenu}>📋 Estatísticas</NavLink></li>
            <li><NavLink to="/usuarios" className={({ isActive }) => isActive ? 'active' : ''} onClick={closeMobileMenu}>👥 Usuários</NavLink></li>
            <li><NavLink to="/perfil" className={({ isActive }) => isActive ? 'active' : ''} onClick={closeMobileMenu}>👤 Perfil</NavLink></li>
            <li><NavLink to="/configuracoes" className={({ isActive }) => isActive ? 'active' : ''} onClick={closeMobileMenu}>⚙️ Configurações</NavLink></li>
          </ul>
        </nav>
        <div className="menu-footer">
          <LogoutButton />
        </div>
      </div>
    </>
  );
}

function Dashboard() {
  const { estatisticas, loading, error, refreshEstatisticas } = useEstatisticas();

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>🚨 Polícia Alerta - Dashboard</h1>
        <div className="status-indicator">
          <span className="status-dot online"></span>
          Sistema Operacional
        </div>
        <button 
          className="refresh-btn" 
          onClick={refreshEstatisticas}
          title="Atualizar estatísticas"
        >
          🔄
        </button>
      </div>
      
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📱</div>
          <div className="stat-content">
            <h3>{estatisticas.ocorrenciasAtivas}</h3>
            <p>Relatórios Ativos</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🚔</div>
          <div className="stat-content">
            <h3>{estatisticas.patrulhas}</h3>
            <p>Patrulhas PSP</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <h3>{estatisticas.resolvidas}</h3>
            <p>Resolvidos Hoje</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">⚡</div>
          <div className="stat-content">
            <h3>{estatisticas.tempoMedio}min</h3>
            <p>Tempo Médio</p>
          </div>
        </div>
      </div>

      <div className="dashboard-sections">
        <div className="section-card">
          <h2>📢 Relatórios de Cidadãos</h2>
          <p style={{ fontSize: '14px', color: '#666', marginBottom: '1rem' }}>
            Últimos relatórios enviados via aplicação móvel
          </p>
          <div className="ocorrencias-lista">
            {estatisticas.ocorrenciasRecentes.length > 0 ? (
              estatisticas.ocorrenciasRecentes.map(oc => (
                <div key={oc.id} className="ocorrencia-item">
                  <div className="ocorrencia-prioridade alta"></div>
                  <div className="ocorrencia-info">
                    <h4>🎯 {oc.tipo}</h4>
                    <p>📍 {oc.localizacao}</p>
                    <span className="ocorrencia-tempo">⏰ há {oc.tempo}</span>
                  </div>
                  <div className="ocorrencia-status">{oc.status}</div>
                </div>
              ))
            ) : (
              <p className="no-data">Nenhum relatório recente</p>
            )}
          </div>
        </div>

        <div className="section-card">
          <h2>🔄 Atividade do Sistema</h2>
          <div className="atividade-lista">
            <div className="atividade-item">
              <span className="atividade-tempo">{new Date().toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' })}</span>
              <span className="atividade-texto">Sistema Polícia Alerta operacional</span>
            </div>
            <div className="atividade-item">
              <span className="atividade-tempo">{new Date().toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' })}</span>
              <span className="atividade-texto">A aguardar relatórios de cidadãos - {estatisticas.ocorrenciasAtivas} ativos</span>
            </div>
            <div className="atividade-item">
              <span className="atividade-tempo">{new Date().toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' })}</span>
              <span className="atividade-texto">🚔 {estatisticas.patrulhas} patrulhas PSP em serviço</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Ocorrencias() {
  const { 
    ocorrencias, 
    loading, 
    error, 
    atenderOcorrencia, 
    getOcorrenciasByStatus, 
    getOcorrenciasByPrioridade 
  } = useOcorrencias();
  const [filtroStatus, setFiltroStatus] = React.useState('Todos');
  const [filtroPrioridade, setFiltroPrioridade] = React.useState('Todas');
  const [notification, setNotification] = React.useState(null);

  const handleAtender = async (id) => {
    try {
      await atenderOcorrencia(id);
      setNotification({ type: 'success', message: 'Ocorrência atendida com sucesso!' });
    } catch (error) {
      setNotification({ type: 'error', message: 'Erro ao atender ocorrência' });
    }
  };

  const ocorrenciasFiltradas = React.useMemo(() => {
    let filtered = ocorrencias;
    
    if (filtroStatus !== 'Todos') {
      filtered = getOcorrenciasByStatus(filtroStatus);
    }
    
    if (filtroPrioridade !== 'Todas') {
      filtered = filtered.filter(oc => oc.prioridade === filtroPrioridade);
    }
    
    return filtered;
  }, [ocorrencias, filtroStatus, filtroPrioridade, getOcorrenciasByStatus]);

  return (
    <div className="ocorrencias-page">
      {notification && notification.type === 'success' && (
        <SuccessToast 
          message={notification.message}
          onClose={() => setNotification(null)}
        />
      )}
      {notification && notification.type === 'error' && (
        <ErrorToast 
          error={notification.message}
          onClose={() => setNotification(null)}
        />
      )}
      
      <div className="page-header">
        <h1>📱 Relatórios de Crimes</h1>
        <p style={{ fontSize: '14px', color: '#666', margin: '0.5rem 0' }}>
          Relatórios enviados por cidadãos através da aplicação móvel
        </p>
        <div className="filtros">
          <select 
            className="filtro-select"
            value={filtroPrioridade}
            onChange={(e) => setFiltroPrioridade(e.target.value)}
          >
            <option value="Todas">📊 Todas as Prioridades</option>
            <option value="Alta">🔴 Alta</option>
            <option value="Média">🟡 Média</option>
            <option value="Baixa">🟢 Baixa</option>
          </select>
          <select 
            className="filtro-select"
            value={filtroStatus}
            onChange={(e) => setFiltroStatus(e.target.value)}
          >
            <option value="Todos">📋 Todos os Status</option>
            <option value="Pendente">⏳ Pendente</option>
            <option value="Em Andamento">🔄 Em Andamento</option>
            <option value="Resolvida">✅ Resolvida</option>
          </select>
        </div>
      </div>

      <div className="ocorrencias-grid">
        {ocorrenciasFiltradas.length > 0 ? (
          ocorrenciasFiltradas.map(oc => (
            <OcorrenciaCard key={oc.id} ocorrencia={oc} onAtender={handleAtender} />
          ))
        ) : (
          <div className="no-data-message">
            <p>Nenhuma ocorrência encontrada com os filtros selecionados.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function OcorrenciaCard({ ocorrencia, onAtender }) {
  const navigate = useNavigate();
  
  const getPrioridadeClass = (prioridade) => {
    switch(prioridade) {
      case 'Alta': return 'prioridade-alta';
      case 'Média': return 'prioridade-media';
      case 'Baixa': return 'prioridade-baixa';
      default: return '';
    }
  };

  const formatTime = (timestamp) => {
    const time = new Date(timestamp);
    return time.toLocaleTimeString('pt-PT', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="ocorrencia-card" onClick={() => navigate(`/ocorrencias/${ocorrencia.id}`)}>
      <div className="ocorrencia-header">
        <span className={`prioridade-badge ${getPrioridadeClass(ocorrencia.prioridade)}`}>
          {ocorrencia.urgencia === 'Imediata' ? '🚨' : ocorrencia.urgencia === 'Alta' ? '🔴' : ocorrencia.urgencia === 'Moderada' ? '🟡' : '🟢'} 
          {ocorrencia.prioridade}
        </span>
        <span className="ocorrencia-id">#{ocorrencia.id}</span>
      </div>
      
      <div className="ocorrencia-content">
        <h3>🎯 {ocorrencia.tipo}</h3>
        <p className="ocorrencia-descricao">{ocorrencia.descricao}</p>
        
        <div className="ocorrencia-detalhes">
          <div className="detalhe-item">
            <strong>📍 Local:</strong> {ocorrencia.localizacao}
          </div>
          <div className="detalhe-item">
            <strong>⏰ Reportado:</strong> {formatTime(ocorrencia.registradaEm)}
          </div>
          <div className="detalhe-item">
            <strong>👤 Cidadão:</strong> {ocorrencia.cidadaoNome}
          </div>
          {ocorrencia.imagens && ocorrencia.imagens.length > 0 && (
            <div className="detalhe-item">
              <strong>📷 Imagens:</strong> {ocorrencia.imagens.length} foto{ocorrencia.imagens.length > 1 ? 's' : ''}
            </div>
          )}
        </div>
      </div>

      <div className="ocorrencia-footer">
        <span className={`status-badge status-${ocorrencia.status.toLowerCase().replace(' ', '-')}`}>
          {ocorrencia.status === 'Pendente' ? '⏳' : ocorrencia.status === 'Em Andamento' ? '🔄' : '✅'} {ocorrencia.status}
        </span>
        <button 
          className="atender-btn" 
          onClick={(e) => { e.stopPropagation(); onAtender(ocorrencia.id); }}
        >
          {ocorrencia.status === 'Pendente' ? '🔄 Atender' : ocorrencia.status === 'Em Andamento' ? '✅ Resolver' : '👁️ Ver'}
        </button>
      </div>
    </div>
  );
}

function OcorrenciaDetalhe() {
  const { id } = useParams();
  const { getOcorrenciaById, atenderOcorrencia, resolverOcorrencia } = useOcorrencias();
  const [notification, setNotification] = React.useState(null);
  
  const ocorrencia = getOcorrenciaById(id);

  const handleAtender = async () => {
    try {
      await atenderOcorrencia(id);
      setNotification({ type: 'success', message: 'Ocorrência atendida com sucesso!' });
    } catch (error) {
      setNotification({ type: 'error', message: 'Erro ao atender ocorrência' });
    }
  };

  const handleResolver = async () => {
    try {
      await resolverOcorrencia(id);
      setNotification({ type: 'success', message: 'Ocorrência resolvida com sucesso!' });
    } catch (error) {
      setNotification({ type: 'error', message: 'Erro ao resolver ocorrência' });
    }
  };
  
  if (!ocorrencia) return <div className="error-page"><h2>Ocorrência não encontrada</h2></div>;

  return (
    <div className="ocorrencia-detalhe-page">
      {notification && notification.type === 'success' && (
        <SuccessToast 
          message={notification.message}
          onClose={() => setNotification(null)}
        />
      )}
      {notification && notification.type === 'error' && (
        <ErrorToast 
          error={notification.message}
          onClose={() => setNotification(null)}
        />
      )}
      
      <div className="page-header">
        <button className="voltar-btn" onClick={() => window.history.back()}>← Voltar</button>
        <h1>Ocorrência #{ocorrencia.id}</h1>
      </div>

      <div className="detalhe-content">
        <div className="detalhe-principal">
          <div className="detalhe-header">
            <h2>{ocorrencia.tipo}</h2>
            <span className={`prioridade-badge ${ocorrencia.prioridade?.toLowerCase()}`}>
              {ocorrencia.prioridade}
            </span>
          </div>
          
          <div className="detalhe-info">
            <div className="info-item">
              <label>Descrição:</label>
              <p>{ocorrencia.descricao}</p>
            </div>
            <div className="info-item">
              <label>Localização:</label>
              <p>{ocorrencia.localizacao}</p>
            </div>
            <div className="info-item">
              <label>Registrada em:</label>
              <p>{ocorrencia.registradaEm}</p>
            </div>
            <div className="info-item">
              <label>Status:</label>
              <span className={`status-badge status-${ocorrencia.status?.toLowerCase()}`}>
                {ocorrencia.status}
              </span>
            </div>
          </div>

          <div className="detalhe-acoes">
            {ocorrencia.status === 'Pendente' && (
              <button className="atender-btn" onClick={handleAtender}>
                Atender Ocorrência
              </button>
            )}
            {ocorrencia.status === 'Em Andamento' && (
              <button className="resolver-btn" onClick={handleResolver}>
                Resolver Ocorrência
              </button>
            )}
            <button className="secundario-btn">
              Atribuir Patrulha
            </button>
          </div>
        </div>

        <div className="detalhe-mapa">
          <h3>Localização</h3>
          <div className="mapa-container">
            <iframe
              title="Mapa da ocorrência"
              src={`https://www.google.com/maps?q=${encodeURIComponent(ocorrencia.localizacao)}&output=embed`}
              width="100%"
              height="300"
              style={{ border: 0, borderRadius: '8px' }}
              allowFullScreen=""
              loading="lazy"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
}

function Patrulhas() {
  const { patrulhas, loading, error, updatePatrulhaStatus } = usePatrulhas();
  const [notification, setNotification] = React.useState(null);

  const handleStatusChange = async (id, novoStatus) => {
    try {
      await updatePatrulhaStatus(id, novoStatus);
      setNotification({ 
        type: 'success', 
        message: `Status da patrulha atualizado para: ${novoStatus}` 
      });
    } catch (error) {
      setNotification({ type: 'error', message: 'Erro ao atualizar status da patrulha' });
    }
  };

  return (
    <div className="patrulhas-page">
      {notification && notification.type === 'success' && (
        <SuccessToast 
          message={notification.message}
          onClose={() => setNotification(null)}
        />
      )}
      {notification && notification.type === 'error' && (
        <ErrorToast 
          error={notification.message}
          onClose={() => setNotification(null)}
        />
      )}
      
      <div className="page-header">
        <h1>Gestão de Patrulhas</h1>
        <button className="nova-patrulha-btn">Nova Patrulha</button>
      </div>

      <div className="patrulhas-grid">
        {patrulhas.length > 0 ? (
          patrulhas.map(patrulha => (
            <div key={patrulha.id} className="patrulha-card">
              <div className="patrulha-header">
                <h3>{patrulha.codigo}</h3>
                <select
                  className={`status-select status-${patrulha.status?.toLowerCase()}`}
                  value={patrulha.status}
                  onChange={(e) => handleStatusChange(patrulha.id, e.target.value)}
                >
                  <option value="Ativa">Ativa</option>
                  <option value="Inativa">Inativa</option>
                  <option value="Em Patrulha">Em Patrulha</option>
                  <option value="Em Emergência">Em Emergência</option>
                </select>
              </div>
              <div className="patrulha-info">
                <p><strong>Agentes:</strong> {patrulha.agentes?.join(', ') || 'Não definido'}</p>
                <p><strong>Viatura:</strong> {patrulha.viatura || 'Não definida'}</p>
                <p><strong>Zona:</strong> {patrulha.zona || 'Não definida'}</p>
              </div>
            </div>
          ))
        ) : (
          <div className="no-data-message">
            <p>Nenhuma patrulha cadastrada no sistema.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function Relatorios() {
  return (
    <div className="relatorios-page">
      <div className="page-header">
        <h1>Relatórios e Estatísticas</h1>
      </div>
      
      <div className="relatorios-grid">
        <div className="relatorio-card">
          <h3>Ocorrências por Tipo</h3>
          <div className="relatorio-content">
            <p>Relatório mensal de ocorrências categorizadas</p>
            <button className="gerar-btn">Gerar Relatório</button>
          </div>
        </div>
        
        <div className="relatorio-card">
          <h3>Tempo de Resposta</h3>
          <div className="relatorio-content">
            <p>Análise de eficiência operacional</p>
            <button className="gerar-btn">Gerar Relatório</button>
          </div>
        </div>
        
        <div className="relatorio-card">
          <h3>Atividade de Patrulhas</h3>
          <div className="relatorio-content">
            <p>Relatório de cobertura territorial</p>
            <button className="gerar-btn">Gerar Relatório</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Perfil() {
  const { user, signOut, hasRole } = useAuth();
  const [notification, setNotification] = React.useState(null);

  const handleSignOut = async () => {
    try {
      await signOut();
      setNotification({ type: 'success', message: 'Logout realizado com sucesso!' });
    } catch (error) {
      setNotification({ type: 'error', message: 'Erro ao sair do sistema' });
    }
  };

  if (!user) {
    return (
      <div className="perfil-page">
        <div className="auth-required">
          <h2>Acesso Restrito</h2>
          <p>É necessário autenticação para acessar esta área.</p>
          <p>Utilize o sistema de login para acessar seu perfil.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="perfil-page">
      {notification && notification.type === 'success' && (
        <SuccessToast 
          message={notification.message}
          onClose={() => setNotification(null)}
        />
      )}
      {notification && notification.type === 'error' && (
        <ErrorToast 
          error={notification.message}
          onClose={() => setNotification(null)}
        />
      )}
      
      <div className="page-header">
        <h1>Perfil do Usuário</h1>
      </div>

      <div className="perfil-content">
        <div className="perfil-info">
          <div className="perfil-foto">
            <img 
              src={user.photoURL || user.foto || 'https://via.placeholder.com/100'} 
              alt="Foto de perfil" 
            />
            {hasRole('admin') && <span className="adm-badge">ADMIN</span>}
            {hasRole('superintendent') && <span className="super-badge">SUPERINTENDENTE</span>}
            {hasRole('inspector') && <span className="inspector-badge">INSPETOR</span>}
          </div>
          <div className="perfil-detalhes">
            <h2>{user.displayName || user.nome}</h2>
            <p className="perfil-cargo">{user.cargo || 'Não definido'}</p>
            <p className="perfil-email">Email: {user.email}</p>
            <p className="perfil-matricula">Matrícula: {user.matricula || 'N/A'}</p>
            <p className="perfil-role">Função: {user.role || 'officer'}</p>
          </div>
        </div>

        <div className="perfil-acoes">
          <button className="secundario-btn">Alterar Senha</button>
          <button className="secundario-btn">Editar Perfil</button>
          <button className="logoff-btn" onClick={handleSignOut}>Sair do Sistema</button>
        </div>
      </div>
    </div>
  );
}

function Configuracoes() {
  const [temaAtual, setTemaAtual] = React.useState(() => {
    const saved = localStorage.getItem('temaAtual');
    return saved || 'padrao';
  });

  const temas = [
    { nome: 'Padrão', id: 'padrao', vars: { '--cor-primaria': '#1a2236', '--cor-secundaria': '#2c3e50', '--cor-fundo': '#f8f9fa', '--cor-texto': '#2c3e50', '--cor-borda': '#dee2e6', '--cor-sombra': '0 2px 4px rgba(0,0,0,0.1)' } },
    { nome: 'Escuro', id: 'escuro', vars: { '--cor-primaria': '#2c3e50', '--cor-secundaria': '#34495e', '--cor-fundo': '#1a1a1a', '--cor-texto': '#ecf0f1', '--cor-borda': '#34495e', '--cor-sombra': '0 2px 4px rgba(0,0,0,0.3)' } },
    { nome: 'Azul Profissional', id: 'azul', vars: { '--cor-primaria': '#2980b9', '--cor-secundaria': '#3498db', '--cor-fundo': '#ecf0f1', '--cor-texto': '#2c3e50', '--cor-borda': '#bdc3c7', '--cor-sombra': '0 2px 4px rgba(41,128,185,0.1)' } },
  ];

  React.useEffect(() => {
    const tema = temas.find(t => t.id === temaAtual) || temas[0];
    Object.entries(tema.vars).forEach(([k, v]) => {
      document.documentElement.style.setProperty(k, v);
    });
    localStorage.setItem('temaAtual', temaAtual);
  }, [temaAtual]);

  return (
    <div className="configuracoes-page">
      <div className="page-header">
        <h1>Configurações do Sistema</h1>
      </div>

      <div className="configuracoes-content">
        <div className="config-section">
          <h3>Aparência</h3>
          <div className="config-item">
            <label htmlFor="tema-select">Tema do Sistema:</label>
            <select 
              id="tema-select" 
              value={temaAtual} 
              onChange={e => setTemaAtual(e.target.value)}
              className="config-select"
            >
              {temas.map(t => <option key={t.id} value={t.id}>{t.nome}</option>)}
            </select>
          </div>
        </div>

        <div className="config-section">
          <h3>Notificações</h3>
          <div className="config-item">
            <label>
              <input type="checkbox" defaultChecked /> Receber notificações de ocorrências
            </label>
          </div>
          <div className="config-item">
            <label>
              <input type="checkbox" defaultChecked /> Alertas de alta prioridade
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}

function App() {
  const { user } = useAuth();

  // Debug - verificar se user existe
  console.log('🔍 Debug - User state:', user);

  // OBRIGATÓRIO: Mostrar login se não houver usuário autenticado
  if (!user || user === null || user === undefined) {
    console.log('🔐 Showing login - no user authenticated');
    return (
      <ErrorBoundary>
        <div className="app-container" style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
        }}>
          <LoginModal onClose={() => {}} />
        </div>
      </ErrorBoundary>
    );
  }

  console.log('✅ User authenticated, showing main interface');

  // Só mostrar interface principal se usuário estiver logado
  return (
    <ErrorBoundary>
      <Router>
        <div className="app-container">
          <MenuLateral />
          <div className="main-content">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/ocorrencias" element={<Ocorrencias />} />
              <Route path="/ocorrencias/:id" element={<OcorrenciaDetalhe />} />
              <Route path="/patrulhas" element={<Patrulhas />} />
              <Route path="/relatorios" element={<Relatorios />} />
              <Route path="/perfil" element={<Perfil />} />
              <Route path="/usuarios" element={<UserManagement />} />
              <Route path="/configuracoes" element={<Configuracoes />} />
            </Routes>
          </div>
        </div>
      </Router>
    </ErrorBoundary>
  );
}

function LoginModal({ onClose }) {
  const { signIn, signUp } = useAuth();
  const [isLogin, setIsLogin] = React.useState(true);
  const [nomeCompleto, setNomeCompleto] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [dataNascimento, setDataNascimento] = React.useState('');
  const [paisResidencia, setPaisResidencia] = React.useState('Portugal');
  const [numeroCC, setNumeroCC] = React.useState('');
  const [cargo, setCargo] = React.useState('');
  const [matricula, setMatricula] = React.useState('');
  const [foto, setFoto] = React.useState('https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);

  const handleFotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('A foto deve ter menos de 5MB');
        return;
      }
      
      // Check file type
      if (!file.type.startsWith('image/')) {
        setError('Por favor selecione apenas arquivos de imagem');
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (ev) => setFoto(ev.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleToggleAuth = () => {
    setIsLogin(!isLogin);
    setError(null);
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isLogin) {
        // Para login, usar apenas email e password
        console.log('🔐 Tentativa de login com:', { email, password: password ? '***' : 'vazio' });
        
        if (!email || !password) {
          setError('Por favor, preencha o email e a palavra-passe');
          setLoading(false);
          return;
        }
        
        if (!email.includes('@')) {
          setError('Por favor, insira um email válido');
          setLoading(false);
          return;
        }
        
        if (password.length < 6) {
          setError('A palavra-passe deve ter pelo menos 6 caracteres');
          setLoading(false);
          return;
        }
        
        console.log('✅ Validação passou, tentando login...');
        await signIn(email, password);
        console.log('✅ Login realizado com sucesso');
      } else {
        // Para registro, validar todos os campos obrigatórios
        console.log('📝 Tentativa de registro com:', { 
          nomeCompleto, 
          email, 
          cargo, 
          matricula,
          password: password ? '***' : 'vazio'
        });
        
        if (!nomeCompleto || !password || !email || !dataNascimento || !paisResidencia || !numeroCC || !cargo || !matricula) {
          setError('Por favor, preencha todos os campos obrigatórios');
          setLoading(false);
          return;
        }
        
        if (!email.includes('@')) {
          setError('Por favor, insira um email válido');
          setLoading(false);
          return;
        }
        
        if (password.length < 6) {
          setError('A palavra-passe deve ter pelo menos 6 caracteres');
          setLoading(false);
          return;
        }
        
        console.log('✅ Validação passou, tentando registro...');
        await signUp({ 
          nome: nomeCompleto, 
          password, 
          email, 
          dataNascimento, 
          paisResidencia, 
          numeroCC,
          cargo,
          matricula,
          foto: foto
        });
        console.log('✅ Registro realizado com sucesso');
      }
      onClose();
    } catch (error) {
      console.error('❌ Erro no processo:', error);
      setError(error.message || 'Erro desconhecido durante o processo');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="modal-overlay">
      <div className="login-modal">
        <div className="modal-header">
          <h2>{isLogin ? '🚨 Polícia Alerta - Login' : '📝 Registro de Policial'}</h2>
          <p>{isLogin ? 'Acesso com Email e Palavra-passe' : 'Cadastro de Novo Agente'}</p>
        </div>
        
        {error && (
          <div className="login-error">
            <p>❌ {error}</p>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="login-form">
          {!isLogin && (
            <div className="form-group">
              <label>Nome Completo: <span className="required">*</span></label>
              <input 
                type="text" 
                value={nomeCompleto} 
                onChange={e => setNomeCompleto(e.target.value)} 
                required 
                className="form-input"
                placeholder="Nome completo do policial"
                disabled={loading}
              />
            </div>
          )}
          
          <div className="form-group">
            <label>Email: <span className="required">*</span></label>
            <input 
              type="email" 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              required 
              className="form-input"
              placeholder="exemplo@psp.pt"
              disabled={loading}
            />
          </div>
          
          <div className="form-group">
            <label>Palavra-passe: <span className="required">*</span></label>
            <input 
              type="password" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              required 
              className="form-input"
              placeholder="Digite sua palavra-passe"
              minLength="6"
              disabled={loading}
            />
            {isLogin && (
              <small className="form-help">Mínimo 6 caracteres</small>
            )}
          </div>
          
          {!isLogin && (
            <>
              <div className="form-group">
                <label>Data de Nascimento:</label>
                <input 
                  type="date" 
                  value={dataNascimento} 
                  onChange={e => setDataNascimento(e.target.value)} 
                  required 
                  className="form-input"
                />
              </div>
              
              <div className="form-group">
                <label>País de Residência:</label>
                <select 
                  value={paisResidencia} 
                  onChange={e => setPaisResidencia(e.target.value)} 
                  required
                  className="form-input"
                >
                  <option value="Portugal">🇵🇹 Portugal</option>
                  <option value="Brasil">🇧🇷 Brasil</option>
                  <option value="España">🇪🇸 Espanha</option>
                  <option value="França">🇫🇷 França</option>
                </select>
              </div>
              
              <div className="form-group">
                <label>Nº Cartão de Cidadão:</label>
                <input 
                  type="text" 
                  value={numeroCC} 
                  onChange={e => setNumeroCC(e.target.value)} 
                  required 
                  className="form-input"
                  placeholder="12345678 9 ZZ0"
                  pattern="[0-9]{8} [0-9] [A-Z]{2}[0-9]"
                  title="Formato: 12345678 9 ZZ0"
                />
              </div>
              
              <div className="form-group">
                <label>Cargo:</label>
                <input 
                  type="text" 
                  value={cargo} 
                  onChange={e => setCargo(e.target.value)} 
                  required 
                  className="form-input"
                  placeholder="Ex: Policial, Inspetor, Superintendente"
                />
              </div>
              
                            <div className="form-group">
                <label>Matrícula:</label>
                <input 
                  type="text" 
                  value={matricula} 
                  onChange={e => setMatricula(e.target.value)} 
                  required 
                  className="form-input"
                  placeholder="Número da matrícula"
                />
              </div>
              
              <div className="form-group">
                <label>Foto de Perfil:</label>
                <div className="foto-upload">
                  <img src={foto} alt="Foto de perfil" className="foto-preview" />
                  <label className="upload-btn">
                    Selecionar Foto
                    <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFotoChange} />
                  </label>
                </div>
              </div>
            </>
          )}
          
          <button type="submit" className="login-submit" disabled={loading}>
            {loading ? '⏳ A processar...' : (isLogin ? '🔓 Entrar no Sistema' : '✅ Registar Policial')}
          </button>
        </form>
        
        <button className="toggle-auth" onClick={handleToggleAuth} disabled={loading}>
          {isLogin ? '📝 Registar novo policial' : '🔓 Já tem conta? Fazer login com email'}
        </button>
        
        {isLogin && (
          <div className="login-help">
            <p><strong>💡 Dica:</strong> Use o mesmo email e palavra-passe que usou no registro.</p>
            <p><strong>🔐 Primeira vez?</strong> Clique em "Registar novo policial" para criar sua conta.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;