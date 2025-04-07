
import { useState, useCallback } from 'react';

/**
 * Hook personnalisé pour gérer les opérations silencieuses (sans notifications)
 * et éviter les enregistrements en boucle dans l'application
 */
export function useSilentOperation() {
  const [isSilent, setIsSilent] = useState<boolean>(false);
  const [isBatchOperation, setIsBatchOperation] = useState<boolean>(false);
  const [pendingOperationsCount, setPendingOperationsCount] = useState<number>(0);

  /**
   * Exécute une opération en mode silencieux (sans notifications)
   */
  const runSilently = useCallback(async <T>(operation: () => Promise<T> | T): Promise<T> => {
    setIsSilent(true);
    try {
      return await operation();
    } finally {
      setIsSilent(false);
    }
  }, []);

  /**
   * Commence une série d'opérations en lot
   * Utile pour éviter les enregistrements multiples et notifications
   */
  const beginBatchOperation = useCallback(() => {
    setIsBatchOperation(true);
    setPendingOperationsCount(0);
  }, []);

  /**
   * Ajoute une opération au lot en cours
   */
  const addToBatch = useCallback((count: number = 1) => {
    setPendingOperationsCount(prev => prev + count);
  }, []);

  /**
   * Termine une série d'opérations en lot
   */
  const endBatchOperation = useCallback(() => {
    setIsBatchOperation(false);
    setPendingOperationsCount(0);
  }, []);

  /**
   * Exécute une opération en lot (enregistre uniquement en fin de lot)
   */
  const executeBatchOperation = useCallback(async <T>(
    operation: () => Promise<T> | T,
    saveCallback?: () => Promise<void> | void
  ): Promise<T> => {
    const isFirstOperation = !isBatchOperation;
    
    if (isFirstOperation) {
      beginBatchOperation();
    }
    
    addToBatch();
    
    try {
      const result = await operation();
      
      // Si c'est une opération simple (non-lot), ou la dernière d'un lot,
      // on sauvegarde les modifications
      if (saveCallback && isFirstOperation) {
        await saveCallback();
      }
      
      return result;
    } finally {
      if (isFirstOperation) {
        endBatchOperation();
      }
    }
  }, [isBatchOperation, beginBatchOperation, addToBatch, endBatchOperation]);

  return {
    isSilent,
    isBatchOperation,
    pendingOperationsCount,
    runSilently,
    beginBatchOperation,
    endBatchOperation,
    addToBatch,
    executeBatchOperation,
  };
}
