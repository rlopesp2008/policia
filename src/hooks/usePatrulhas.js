import { useState, useEffect } from 'react';
import { patrulhasService } from '../services/database';
import { fallbackPatrulhas } from './useFallbackData';

export const usePatrulhas = () => {
  const [patrulhas, setPatrulhas] = useState(fallbackPatrulhas);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    try {
      // Set up real-time listener with error handling
      const unsubscribe = patrulhasService.listen((newPatrulhas) => {
        if (mounted) {
          setPatrulhas(newPatrulhas);
        }
      });

      return () => {
        mounted = false;
        if (unsubscribe) unsubscribe();
      };
    } catch (error) {
      console.error('Error setting up patrulhas listener:', error);
      if (mounted) {
        setPatrulhas(fallbackPatrulhas);
      }
    }
  }, []);

  const updatePatrulhaStatus = async (id, status) => {
    try {
      setError(null);
      await patrulhasService.updateStatus(id, status);
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  const getPatrulhasAtivas = () => {
    return patrulhas.filter(p => p.status === 'Ativa');
  };

  const getPatrulhasByZona = (zona) => {
    return patrulhas.filter(p => p.zona === zona);
  };

  return {
    patrulhas,
    loading,
    error,
    updatePatrulhaStatus,
    getPatrulhasAtivas,
    getPatrulhasByZona
  };
};