import { useState, useEffect } from 'react';
import { estatisticasService } from '../services/database';

import { fallbackEstatisticas } from './useFallbackData';

export const useEstatisticas = () => {
  const [estatisticas, setEstatisticas] = useState(fallbackEstatisticas);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadEstatisticas = async () => {
    try {
      setError(null);
      const stats = await estatisticasService.getDashboardStats();
      setEstatisticas(stats);
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
      setError(error.message);
    }
  };

  useEffect(() => {
    // Load statistics in background without blocking UI
    loadEstatisticas();
    
    // Refresh statistics every 30 seconds
    const interval = setInterval(loadEstatisticas, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const refreshEstatisticas = () => {
    loadEstatisticas();
  };

  return {
    estatisticas,
    loading,
    error,
    refreshEstatisticas
  };
};