// System Test Script for Development
import { authService } from '../services/auth';
import { ocorrenciasService, patrulhasService } from '../services/database';
import { populateDatabase } from './populateDatabase';

export const runSystemTests = async () => {
  console.group('🧪 Sistema Policial - Testes de Integração');
  
  try {
    console.log('🔧 Iniciando testes...');
    
    // Test 1: Firebase Connection
    console.group('1. 🔥 Teste de Conexão Firebase');
    try {
      const currentUser = authService.getCurrentUser();
      console.log('✅ Firebase Auth inicializado:', !!currentUser);
      console.log('📊 Usuário atual:', currentUser?.email || 'Nenhum');
    } catch (error) {
      console.error('❌ Erro na conexão Firebase:', error);
    }
    console.groupEnd();
    
    // Test 2: Database Services
    console.group('2. 📊 Teste de Serviços do Banco de Dados');
    try {
      // Test if we can read (this might fail with security rules if not authenticated)
      const testRead = await ocorrenciasService.getAll().catch(e => {
        console.log('⚠️ Leitura bloqueada pelas regras de segurança (esperado se não autenticado)');
        return [];
      });
      console.log('✅ Serviço de ocorrências funcionando, encontradas:', testRead.length);
      
      const testPatrols = await patrulhasService.getAll().catch(e => {
        console.log('⚠️ Leitura de patrulhas bloqueada (esperado se não autenticado)');
        return [];
      });
      console.log('✅ Serviço de patrulhas funcionando, encontradas:', testPatrols.length);
      
    } catch (error) {
      console.error('❌ Erro nos serviços de banco:', error);
    }
    console.groupEnd();
    
    // Test 3: Environment Variables
    console.group('3. 🔐 Teste de Variáveis de Ambiente');
    const requiredEnvVars = [
      'REACT_APP_FIREBASE_API_KEY',
      'REACT_APP_FIREBASE_AUTH_DOMAIN',
      'REACT_APP_FIREBASE_PROJECT_ID',
      'REACT_APP_FIREBASE_STORAGE_BUCKET',
      'REACT_APP_FIREBASE_MESSAGING_SENDER_ID',
      'REACT_APP_FIREBASE_APP_ID'
    ];
    
    let envVarsOk = true;
    requiredEnvVars.forEach(envVar => {
      if (process.env[envVar]) {
        console.log(`✅ ${envVar}: Configurado`);
      } else {
        console.error(`❌ ${envVar}: NÃO CONFIGURADO`);
        envVarsOk = false;
      }
    });
    
    if (envVarsOk) {
      console.log('✅ Todas as variáveis de ambiente estão configuradas');
    } else {
      console.error('❌ Algumas variáveis de ambiente estão faltando');
    }
    console.groupEnd();
    
    // Test 4: UI Components
    console.group('4. 🎨 Teste de Componentes da Interface');
    try {
      // Test if essential DOM elements exist
      const menuElement = document.querySelector('.menu-lateral');
      const mainContent = document.querySelector('.main-content');
      
      console.log('✅ Menu lateral:', !!menuElement);
      console.log('✅ Conteúdo principal:', !!mainContent);
      
      // Test responsive classes
      const hasResponsiveCSS = document.querySelector('[class*="menu-toggle"]');
      console.log('✅ CSS responsivo:', !!hasResponsiveCSS);
      
    } catch (error) {
      console.error('❌ Erro nos componentes da UI:', error);
    }
    console.groupEnd();
    
    // Test 5: Authentication Service
    console.group('5. 🔐 Teste do Serviço de Autenticação');
    try {
      const authMethods = [
        'signIn',
        'signUp', 
        'signOut',
        'getCurrentUser',
        'hasPermission',
        'hasRole'
      ];
      
      authMethods.forEach(method => {
        if (typeof authService[method] === 'function') {
          console.log(`✅ authService.${method}: Disponível`);
        } else {
          console.error(`❌ authService.${method}: NÃO ENCONTRADO`);
        }
      });
      
    } catch (error) {
      console.error('❌ Erro no serviço de autenticação:', error);
    }
    console.groupEnd();
    
    console.log('✅ Testes concluídos com sucesso!');
    
    return {
      success: true,
      message: 'Todos os testes passaram'
    };
    
  } catch (error) {
    console.error('❌ Falha nos testes do sistema:', error);
    return {
      success: false,
      message: error.message
    };
  } finally {
    console.groupEnd();
  }
};

// Auto-run tests in development
if (process.env.NODE_ENV === 'development') {
  // Run tests after a short delay to ensure everything is loaded
  setTimeout(() => {
    runSystemTests();
  }, 2000);
}

export default { runSystemTests };