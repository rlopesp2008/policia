import { BrowserRouter as Router, Routes, Route, Link, NavLink } from 'react-router-dom';
import './App.css';
import logo from './logo.svg';
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
// nigga tron
function MenuLateral() {
  return (
    <div className="menu-lateral">
      <NavLink to="/" className="logo-link">
        <img src="/logo_pap_MR.png" alt="Logo" className="logo" />
      </NavLink>
      <nav>
        <ul>
          <li><NavLink to="/" end className={({ isActive }) => isActive ? 'active' : ''}>Principal</NavLink></li>
          <li><NavLink to="/perfil" className={({ isActive }) => isActive ? 'active' : ''}>Perfil</NavLink></li>
          <li><NavLink to="/denuncias" className={({ isActive }) => isActive ? 'active' : ''}>Denúncias</NavLink></li>
          <li><NavLink to="/historico" className={({ isActive }) => isActive ? 'active' : ''}>Histórico</NavLink></li>
          <li><NavLink to="/definicoes" className={({ isActive }) => isActive ? 'active' : ''}>Definições</NavLink></li>
        </ul>
      </nav>
    </div>
  );
}

function Denuncias({ denuncias, onAceitar }) {
  return (
    <div className="pagina">
      <h2>Denúncias Recentes</h2>
      <div className="denuncias-lista">
        {denuncias.map(d => (
          <DenunciaCard key={d.id} denuncia={d} onAceitar={onAceitar} />
        ))}
      </div>
    </div>
  );
}

function DenunciaCard({ denuncia, onAceitar }) {
  const navigate = useNavigate();
  return (
    <div className="denuncia-card" style={{ cursor: 'pointer' }}>
      <img src={denuncia.foto} alt={denuncia.titulo} className="denuncia-foto" onClick={() => navigate(`/denuncias/${denuncia.id}`)} />
      <div onClick={() => navigate(`/denuncias/${denuncia.id}`)}>
        <h3>{denuncia.titulo}</h3>
        <p>{denuncia.descricao}</p>
        <p><b>Localização:</b> {denuncia.localizacao}</p>
      </div>
      <button className="aceitar-btn" onClick={e => { e.stopPropagation(); onAceitar(denuncia.id); }}>Aceitar denúncia</button>
    </div>
  );
}
// help
function DenunciaDetalhe({ denuncias, onAceitar }) {
  const { id } = useParams();
  const denuncia = denuncias.find(d => d.id === Number(id));
  if (!denuncia) return <div className="pagina"><h2>Denúncia não encontrada</h2></div>;
  const mapsUrl = `https://www.google.com/maps?q=${encodeURIComponent(denuncia.localizacao)}&output=embed`;
  return (
    <div className="pagina denuncia-detalhe">
      <h2>{denuncia.titulo}</h2>
      <img src={denuncia.foto} alt={denuncia.titulo} className="denuncia-foto-detalhe" />
      <p><b>Descrição:</b> {denuncia.descricao}</p>
      <p><b>Detalhes:</b> {denuncia.detalhes}</p>
      <p><b>Localização:</b> {denuncia.localizacao}</p>
      <div className="mapa-wrapper">
        <iframe
          title="Mapa da denúncia"
          src={mapsUrl}
          width="100%"
          height="300"
          style={{ border: 0, borderRadius: '10px', marginTop: '16px' }}
          allowFullScreen=""
          loading="lazy"
        ></iframe>
      </div>
      <button className="aceitar-btn" onClick={() => onAceitar(denuncia.id)} style={{marginTop: 24}}>Aceitar denúncia</button>
    </div>
  );
}

function Historico({ historico }) {
  return (
    <div className="pagina">
      <h2>Histórico de Denúncias</h2>
      {historico.length === 0 ? <p>Sem denúncias aceites.</p> : (
        <div className="denuncias-lista">
          {historico.map(d => (
            <div key={d.id} className="denuncia-card">
              <img src={d.foto} alt={d.titulo} className="denuncia-foto" />
              <div>
                <h3>{d.titulo}</h3>
                <p>{d.descricao}</p>
                <p><b>Localização:</b> {d.localizacao}</p>
                <p className="aceite-info">Aceite há {Math.floor((Date.now() - d.aceiteEm) / 60000)} minutos</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
// muda o tema
const temas = [
  { nome: 'Vermelho e Azul', id: 'vermelhoazul', vars: { '--cor-primaria': '#e74c3c', '--cor-secundaria': '#2980b9', '--cor-fundo': '#f4f6fa', '--cor-texto': '#222', '--cor-borda': '#e0e0e0', '--cor-sombra': '0 2px 8px rgba(0,0,0,0.07)' } },
  { nome: 'Escuro', id: 'escuro', vars: { '--cor-primaria': '#222', '--cor-secundaria': '#444', '--cor-fundo': '#181a1b', '--cor-texto': '#f4f6fa', '--cor-borda': '#444', '--cor-sombra': '0 2px 8px rgba(0,0,0,0.45)' } },
  { nome: 'Claro', id: 'claro', vars: { '--cor-primaria': '#1a2236', '--cor-secundaria': '#61dafb', '--cor-fundo': '#fff', '--cor-texto': '#222', '--cor-borda': '#e0e0e0', '--cor-sombra': '0 2px 8px rgba(0,0,0,0.07)' } },
  { nome: 'Amarelo e Preto', id: 'amarelopreto', vars: { '--cor-primaria': '#f1c40f', '--cor-secundaria': '#222', '--cor-fundo': '#fffbe6', '--cor-texto': '#222', '--cor-borda': '#e0e0e0', '--cor-sombra': '0 2px 8px rgba(0,0,0,0.07)' } },
  
];

function aplicarTema(vars) {
  Object.entries(vars).forEach(([k, v]) => {
    document.documentElement.style.setProperty(k, v);
  });
}

function Definicoes() {
  // Restaurar tema do localStorage ou padrão
  const [temaAtual, setTemaAtual] = React.useState(() => {
    const saved = localStorage.getItem('temaAtual');
    return saved || 'vermelhoazul';
  });
  React.useEffect(() => {
    const tema = temas.find(t => t.id === temaAtual) || temas[0];
    aplicarTema(tema.vars);
    localStorage.setItem('temaAtual', temaAtual);
  }, [temaAtual]);

  return (
    <div className="pagina">
      <h2>Definições</h2>
      <div style={{ margin: '24px 0' }}>
        <label htmlFor="tema-select"><b>Tema do app:</b></label><br/>
        <select id="tema-select" value={temaAtual} onChange={e => setTemaAtual(e.target.value)} style={{ marginTop: 8, padding: 6, fontSize: '1rem' }}>
          {temas.map(t => <option key={t.id} value={t.id}>{t.nome}</option>)}
        </select>
      </div>
      <p>Configurações do sistema.</p>
    </div>
  );
}

const denuncias = [
  { id: 1, titulo: 'Roubo de Veículo', descricao: 'Roubo de carro na Av. Central', foto: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80', localizacao: 'Avenida Fernão de Magalhães, Coimbra', detalhes: 'O veículo foi levado por volta das 22h na Avenida Fernão de Magalhães. Testemunhas viram dois suspeitos.' },
  { id: 2, titulo: 'Furto em Residência', descricao: 'Furto em casa no bairro Jardim', foto: 'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80', localizacao: 'Rua do Brasil, 45, Coimbra', detalhes: 'A residência estava vazia na Rua do Brasil. Foram levados eletrônicos e joias.' },
  { id: 3, titulo: 'Vandalismo', descricao: 'Pichações em muro público', foto: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80', localizacao: 'Praça da República, Coimbra', detalhes: 'Muro pichado durante a madrugada na Praça da República. Câmeras de segurança registraram a ação.' },
  { id: 4, titulo: 'Assalto a Mão Armada', descricao: 'Assalto em farmácia', foto: 'https://images.unsplash.com/photo-1503676382389-4809596d5290?auto=format&fit=crop&w=400&q=80', localizacao: 'Rua Direita, Coimbra', detalhes: 'Dois indivíduos armados invadiram a farmácia e levaram dinheiro do caixa.' },
  { id: 5, titulo: 'Furto de Bicicleta', descricao: 'Bicicleta furtada em estacionamento', foto: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80', localizacao: 'Estação de Comboios, Coimbra', detalhes: 'A bicicleta estava presa com cadeado, que foi cortado.' },
  { id: 6, titulo: 'Arrombamento de Loja', descricao: 'Loja de eletrônicos arrombada', foto: 'https://images.unsplash.com/photo-1518717758536-85ae29035b6d?auto=format&fit=crop&w=400&q=80', localizacao: 'Avenida Sá da Bandeira, Coimbra', detalhes: 'Vidraça quebrada e vários produtos levados.' },
  { id: 7, titulo: 'Furto em Veículo', descricao: 'Objetos furtados de dentro de carro', foto: 'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80', localizacao: 'Parque Verde do Mondego, Coimbra', detalhes: 'Vidro do carro foi quebrado e bolsa furtada.' },
  { id: 8, titulo: 'Roubo de Telemóvel', descricao: 'Roubo de telemóvel na rua', foto: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80', localizacao: 'Largo da Portagem, Coimbra', detalhes: 'Vítima foi abordada por um suspeito e teve o telemóvel levado.' },
  { id: 9, titulo: 'Dano em Patrimônio Público', descricao: 'Banco de jardim destruído', foto: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80', localizacao: 'Jardim da Sereia, Coimbra', detalhes: 'Banco de madeira foi destruído durante a noite.' },
  { id: 10, titulo: 'Furto em Estabelecimento', descricao: 'Furto em padaria', foto: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80', localizacao: 'Rua da Sofia, Coimbra', detalhes: 'Dinheiro e produtos alimentícios foram levados.' },
  { id: 11, titulo: 'Porte de Drogas', descricao: 'Suspeito detido com drogas', foto: 'https://images.unsplash.com/photo-1518717758536-85ae29035b6d?auto=format&fit=crop&w=400&q=80', localizacao: 'Praça 8 de Maio, Coimbra', detalhes: 'Durante abordagem policial, foram encontradas substâncias ilícitas.' },
];

function Principal({ usuario, onLoginClick }) {
  return (
    <div className="pagina principal-home">
      <div className="principal-header">
        <img src="/logo_pap_MR.png" alt="Logo Policia Alerta" className="principal-logo" />
        <h2>Bem-vindo{usuario ? `, ${usuario.nome}` : ''} ao <span style={{color:'var(--cor-primaria)'}}>Painel Policial</span></h2>
        <p style={{fontSize:'1.1rem', color:'#555', marginTop:8}}>
          {usuario ? 'Acesse rapidamente as principais funções do sistema.' : 'Faça login para acessar todas as funcionalidades.'}
        </p>
        {!usuario && <button className="login-btn" onClick={onLoginClick}>Login / Criar Conta</button>}
      </div>
      <div className="principal-atalhos">
        <Atalho to="/denuncias" label="Denúncias" icon="🚨" />
        <Atalho to="/historico" label="Histórico" icon="📋" />
        <Atalho to="/perfil" label="Perfil" icon="👮‍♂️" />
        <Atalho to="/definicoes" label="Definições" icon="⚙️" />
      </div>
    </div>
  );
}

function Atalho({ to, label, icon }) {
  const navigate = useNavigate();
  return (
    <div className="atalho-card" onClick={() => navigate(to)} tabIndex={0} role="button">
      <span className="atalho-icon">{icon}</span>
      <span className="atalho-label">{label}</span>
    </div>
  );
}

// Contas ADM pré-cadastradas
const ADM_USERS = [
  { nome: 'Micael Martins', profissao: 'Administrador', foto: 'https://randomuser.me/api/portraits/men/32.jpg', senha: '123sigma', adm: true },
  { nome: 'Rodrigo Pinheiro', profissao: 'Administrador', foto: 'https://randomuser.me/api/portraits/men/33.jpg', senha: '123sigma', adm: true },
];

function App() {
  // Restaurar do localStorage ou usar valor padrão
  const [usuario, setUsuario] = React.useState(() => {
    const saved = localStorage.getItem('usuario');
    return saved ? JSON.parse(saved) : null;
  });
  const [denunciasAtivas, setDenunciasAtivas] = React.useState(() => {
    const saved = localStorage.getItem('denunciasAtivas');
    return saved ? JSON.parse(saved) : denuncias;
  });
  const [historico, setHistorico] = React.useState(() => {
    const saved = localStorage.getItem('historico');
    return saved ? JSON.parse(saved) : [];
  });
  const [showLogin, setShowLogin] = React.useState(false);

  // Salvar no localStorage sempre que mudar
  React.useEffect(() => {
    localStorage.setItem('usuario', JSON.stringify(usuario));
  }, [usuario]);
  React.useEffect(() => {
    localStorage.setItem('denunciasAtivas', JSON.stringify(denunciasAtivas));
  }, [denunciasAtivas]);
  React.useEffect(() => {
    localStorage.setItem('historico', JSON.stringify(historico));
  }, [historico]);

  function aceitarDenuncia(id) {
    const denuncia = denunciasAtivas.find(d => d.id === id);
    if (!denuncia) return;
    setDenunciasAtivas(denunciasAtivas.filter(d => d.id !== id));
    setHistorico([
      { ...denuncia, aceiteEm: Date.now() },
      ...historico
    ]);
  }

  function handleLogin(user) {
    // Se for ADM
    const adm = ADM_USERS.find(u => u.nome === user.nome && user.senha === u.senha);
    if (adm) {
      setUsuario({ nome: adm.nome, profissao: adm.profissao, foto: adm.foto, adm: true });
      setShowLogin(false);
      return;
    }
    // Usuário comum
    setUsuario({ nome: user.nome, profissao: user.profissao, foto: user.foto, adm: false });
    setShowLogin(false);
  }
  function handleLogoff() {
    setUsuario(null);
  }

  return (
    <Router>
      <div className="container">
        <MenuLateral />
        <div className="conteudo">
          {showLogin && <LoginModal onClose={() => setShowLogin(false)} onLogin={handleLogin} />}
          <Routes>
            <Route path="/" element={<Principal usuario={usuario} onLoginClick={() => setShowLogin(true)} />} />
            <Route path="/perfil" element={<Perfil usuario={usuario} onLogoff={handleLogoff} onLoginClick={() => setShowLogin(true)} />} />
            <Route path="/denuncias" element={<Denuncias denuncias={denunciasAtivas} onAceitar={aceitarDenuncia} />} />
            <Route path="/denuncias/:id" element={<DenunciaDetalhe denuncias={denunciasAtivas} onAceitar={aceitarDenuncia} />} />
            <Route path="/historico" element={<Historico historico={historico} />} />
            <Route path="/definicoes" element={<Definicoes />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

function Perfil({ usuario, onLogoff, onLoginClick }) {
  const [foto, setFoto] = React.useState(usuario?.foto || 'https://randomuser.me/api/portraits/men/75.jpg');
  React.useEffect(() => { if (usuario?.foto) setFoto(usuario.foto); }, [usuario]);
  if (!usuario) {
    return (
      <div className="pagina perfil-policia">
        <h2>Perfil do Usuário</h2>
        <p>Você precisa estar logado para ver o perfil.</p>
        <button className="login-btn" onClick={onLoginClick}>Login / Criar Conta</button>
      </div>
    );
  }
  function handleFotoChange(e) {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setFoto(ev.target.result);
      reader.readAsDataURL(file);
    }
  }
  return (
    <div className="pagina perfil-policia">
      <div className="perfil-header">
        <div className="perfil-foto-wrapper">
          <img src={foto} alt="Foto de perfil" className="perfil-foto" />
          <label className="mudar-foto-btn">
            Mudar foto
            <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFotoChange} />
          </label>
        </div>
        <div className="perfil-info">
          <h2>{usuario.nome} {usuario.adm && <span style={{color:'#e74c3c',fontSize:'1rem',marginLeft:8}}>(ADM)</span>}</h2>
          <p className="perfil-profissao">{usuario.profissao}</p>
        </div>
      </div>
      <button className="logoff-btn" onClick={onLogoff}>Logoff</button>
    </div>
  );
}

function LoginModal({ onClose, onLogin }) {
  const [isLogin, setIsLogin] = React.useState(true);
  const [nome, setNome] = React.useState('');
  const [profissao, setProfissao] = React.useState('');
  const [foto, setFoto] = React.useState('https://randomuser.me/api/portraits/men/75.jpg');
  const [senha, setSenha] = React.useState('');
  function handleFotoChange(e) {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setFoto(ev.target.result);
      reader.readAsDataURL(file);
    }
  }
  function handleSubmit(e) {
    e.preventDefault();
    if (isLogin) {
      onLogin({ nome, profissao, foto, senha });
    } else {
      onLogin({ nome, profissao, foto, senha });
    }
  }
  return (
    <div className="login-modal-bg">
      <div className="login-modal">
        <button className="login-fechar" onClick={onClose}>×</button>
        <h2>{isLogin ? 'Login' : 'Criar Conta'}</h2>
        <form onSubmit={handleSubmit}>
          <label>Nome:<input value={nome} onChange={e => setNome(e.target.value)} required /></label>
          <label>Profissão:<input value={profissao} onChange={e => setProfissao(e.target.value)} required={!isLogin} /></label>
          <label>Senha:<input type="password" value={senha} onChange={e => setSenha(e.target.value)} required /></label>
          <div style={{margin:'12px 0'}}>
            <img src={foto} alt="Foto de perfil" className="perfil-foto" style={{width:60, height:60}} />
            <label className="mudar-foto-btn" style={{marginLeft:8}}>
              Foto
              <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFotoChange} />
            </label>
          </div>
          <button className="login-btn" type="submit">{isLogin ? 'Entrar' : 'Criar Conta'}</button>
        </form>
        <button className="login-trocar" onClick={() => setIsLogin(!isLogin)}>
          {isLogin ? 'Não tem conta? Criar conta' : 'Já tem conta? Login'}
        </button>
      </div>
    </div>
  );
}

export default App;
