
import { useCallback } from 'react';
import logService, { LogLevel, LogCategory } from '@/services/logService';

/**
 * Hook personnalisé pour utiliser le service de logging
 * Permet d'ajouter automatiquement des informations de contexte 
 * aux logs depuis les composants
 */
export const useLogger = (componentName?: string) => {
  const debug = useCallback(
    (message: string, category: LogCategory = 'ui', context?: Record<string, any>) => {
      logService.debug(
        message, 
        category, 
        componentName ? { ...context, component: componentName } : context
      );
    },
    [componentName]
  );

  const info = useCallback(
    (message: string, category: LogCategory = 'ui', context?: Record<string, any>) => {
      logService.info(
        message, 
        category, 
        componentName ? { ...context, component: componentName } : context
      );
    },
    [componentName]
  );

  const warn = useCallback(
    (message: string, category: LogCategory = 'ui', context?: Record<string, any>) => {
      logService.warn(
        message, 
        category, 
        componentName ? { ...context, component: componentName } : context
      );
    },
    [componentName]
  );

  const error = useCallback(
    (message: string, error?: Error, category: LogCategory = 'ui', context?: Record<string, any>) => {
      logService.error(
        message, 
        error, 
        category, 
        componentName ? { ...context, component: componentName } : context
      );
    },
    [componentName]
  );

  return {
    debug,
    info,
    warn,
    error,
    // Accès aux méthodes utilitaires du service
    getLogs: logService.getLogs.bind(logService),
    filterLogs: logService.filterLogs.bind(logService),
    clearLogs: logService.clearLogs.bind(logService),
    exportLogs: logService.exportLogs.bind(logService),
    getSessions: logService.getSessions.bind(logService),
    getStats: logService.getStats.bind(logService)
  };
};
