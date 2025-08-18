import { useState, useEffect } from 'react';
import { ocorrenciasService } from '../services/database';
import { fallbackOcorrencias } from './useFallbackData';

export const useOcorrencias = () => {
  const [ocorrencias, setOcorrencias] = useState(fallbackOcorrencias);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    try {
      // Set up real-time listener with error handling
      const unsubscribe = ocorrenciasService.listen((newOcorrencias) => {
        if (mounted) {
          setOcorrencias(newOcorrencias);
        }
      });

      return () => {
        mounted = false;
        if (unsubscribe) unsubscribe();
      };
    } catch (error) {
      console.error('Error setting up ocorrencias listener:', error);
      if (mounted) {
        setError('Erro ao conectar ao banco de dados');
      }
    }
  }, []);

  const createOcorrencia = async (ocorrenciaData) => {
    try {
      setError(null);
      const id = await ocorrenciasService.create(ocorrenciaData);
      return id;
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  const updateOcorrencia = async (id, updates) => {
    try {
      setError(null);
      await ocorrenciasService.update(id, updates);
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  const deleteOcorrencia = async (id) => {
    try {
      setError(null);
      await ocorrenciasService.delete(id);
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  const atenderOcorrencia = async (id) => {
    try {
      await updateOcorrencia(id, { status: 'Em Andamento' });
    } catch (error) {
      console.error('Erro ao atender ocorrência:', error);
      throw error;
    }
  };

  const resolverOcorrencia = async (id) => {
    try {
      await updateOcorrencia(id, { status: 'Resolvida' });
    } catch (error) {
      console.error('Erro ao resolver ocorrência:', error);
      throw error;
    }
  };

  const getOcorrenciaById = (id) => {
    return ocorrencias.find(oc => oc.id === id);
  };

  const getOcorrenciasAtivas = () => {
    return ocorrencias.filter(oc => ['Pendente', 'Em Andamento'].includes(oc.status));
  };

  const getOcorrenciasByStatus = (status) => {
    return ocorrencias.filter(oc => oc.status === status);
  };

  const getOcorrenciasByPrioridade = (prioridade) => {
    return ocorrencias.filter(oc => oc.prioridade === prioridade);
  };

  return {
    ocorrencias,
    loading,
    error,
    createOcorrencia,
    updateOcorrencia,
    deleteOcorrencia,
    atenderOcorrencia,
    resolverOcorrencia,
    getOcorrenciaById,
    getOcorrenciasAtivas,
    getOcorrenciasByStatus,
    getOcorrenciasByPrioridade
  };
};