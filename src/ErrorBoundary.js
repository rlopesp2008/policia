import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Sistema Policial - Erro:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-page">
          <div className="error-container">
            <h2>⚠️ Erro no Sistema</h2>
            <p>Ocorreu um erro inesperado no sistema policial.</p>
            <p>Por favor, recarregue a página ou contate o suporte técnico.</p>
            <button 
              onClick={() => window.location.reload()} 
              className="error-reload-btn"
            >
              Recarregar Sistema
            </button>
            {process.env.NODE_ENV === 'development' && (
              <details style={{ marginTop: '1rem', textAlign: 'left' }}>
                <summary>Detalhes do erro (desenvolvimento)</summary>
                <pre style={{ fontSize: '12px', overflow: 'auto' }}>
                  {this.state.error?.toString()}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;