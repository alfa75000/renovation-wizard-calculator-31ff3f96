
/**
 * Service de journalisation (logging) pour l'application
 * Permet de tracer les opérations et erreurs importantes
 */

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';
export type LogCategory = 'data' | 'ui' | 'network' | 'storage' | 'system' | 'other';

export interface LogEntry {
  id: string;
  timestamp: string;
  level: LogLevel;
  message: string;
  category: LogCategory;
  context?: Record<string, any>;
  stack?: string;
  sessionId?: string;
}

// Configuration du logger
const LOG_TO_CONSOLE = true;
const LOG_TO_STORAGE = true;
const MAX_LOGS_STORED = 1000;
const STORAGE_KEY = 'app_logs';
const SESSION_ID = `session_${new Date().getTime()}`;

/**
 * Génère un identifiant unique pour un log
 */
const generateLogId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

/**
 * Service de logging principal
 */
const logService = {
  /**
   * Journalise un message de niveau debug
   */
  debug(message: string, category: LogCategory = 'other', context?: Record<string, any>) {
    this.log('debug', message, category, context);
  },
  
  /**
   * Journalise un message de niveau info
   */
  info(message: string, category: LogCategory = 'other', context?: Record<string, any>) {
    this.log('info', message, category, context);
  },
  
  /**
   * Journalise un message de niveau warn
   */
  warn(message: string, category: LogCategory = 'other', context?: Record<string, any>) {
    this.log('warn', message, category, context);
  },
  
  /**
   * Journalise un message de niveau error
   */
  error(message: string, error?: Error, category: LogCategory = 'other', context?: Record<string, any>) {
    const errorContext = error 
      ? { 
          ...context, 
          errorMessage: error.message,
          errorName: error.name,
        } 
      : context;
    
    this.log('error', message, category, errorContext, error?.stack);
  },
  
  /**
   * Méthode centrale de journalisation
   */
  log(
    level: LogLevel,
    message: string,
    category: LogCategory = 'other',
    context?: Record<string, any>,
    stack?: string
  ) {
    const entry: LogEntry = {
      id: generateLogId(),
      timestamp: new Date().toISOString(),
      level,
      message,
      category,
      context,
      stack,
      sessionId: SESSION_ID
    };
    
    if (LOG_TO_CONSOLE) {
      this.logToConsole(entry);
    }
    
    if (LOG_TO_STORAGE) {
      this.storeLog(entry);
    }
  },
  
  /**
   * Affiche un log dans la console
   */
  logToConsole(entry: LogEntry) {
    const formattedContext = entry.context ? `: ${JSON.stringify(entry.context, null, 2)}` : '';
    const logPrefix = `[${entry.timestamp}] [${entry.level.toUpperCase()}] [${entry.category}]`;
    const logMessage = `${logPrefix} ${entry.message}${formattedContext}`;
    
    switch (entry.level) {
      case 'debug':
        console.debug(logMessage);
        break;
      case 'info':
        console.info(logMessage);
        break;
      case 'warn':
        console.warn(logMessage);
        break;
      case 'error':
        console.error(logMessage);
        if (entry.stack) {
          console.error(`Stack: ${entry.stack}`);
        }
        break;
    }
  },
  
  /**
   * Stocke un log dans localStorage
   */
  storeLog(entry: LogEntry) {
    try {
      // Récupérer les logs existants
      const storedLogsJSON = localStorage.getItem(STORAGE_KEY);
      const storedLogs: LogEntry[] = storedLogsJSON ? JSON.parse(storedLogsJSON) : [];
      
      // Ajouter le nouveau log
      storedLogs.push(entry);
      
      // Limiter le nombre de logs stockés (rotation)
      const trimmedLogs = storedLogs.slice(-MAX_LOGS_STORED);
      
      // Sauvegarder
      localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmedLogs));
    } catch (error) {
      // Éviter la récursion en cas d'erreur
      console.error('Erreur lors du stockage du log:', error);
    }
  },
  
  /**
   * Récupère tous les logs stockés
   */
  getLogs(): LogEntry[] {
    try {
      const storedLogsJSON = localStorage.getItem(STORAGE_KEY);
      return storedLogsJSON ? JSON.parse(storedLogsJSON) : [];
    } catch (error) {
      console.error('Erreur lors de la récupération des logs:', error);
      return [];
    }
  },
  
  /**
   * Filtre les logs selon différents critères
   */
  filterLogs(options: {
    level?: LogLevel;
    category?: LogCategory;
    search?: string;
    dateFrom?: Date;
    dateTo?: Date;
    sessionId?: string;
  }): LogEntry[] {
    const logs = this.getLogs();
    
    return logs.filter(log => {
      // Filtre par niveau
      if (options.level && log.level !== options.level) {
        return false;
      }
      
      // Filtre par catégorie
      if (options.category && log.category !== options.category) {
        return false;
      }
      
      // Filtre par session
      if (options.sessionId && log.sessionId !== options.sessionId) {
        return false;
      }
      
      // Filtre par texte
      if (options.search) {
        const searchLower = options.search.toLowerCase();
        const messageMatch = log.message.toLowerCase().includes(searchLower);
        const contextMatch = log.context ? 
          JSON.stringify(log.context).toLowerCase().includes(searchLower) : false;
        
        if (!messageMatch && !contextMatch) {
          return false;
        }
      }
      
      // Filtre par date
      if (options.dateFrom || options.dateTo) {
        const logDate = new Date(log.timestamp);
        
        if (options.dateFrom && logDate < options.dateFrom) {
          return false;
        }
        
        if (options.dateTo && logDate > options.dateTo) {
          return false;
        }
      }
      
      return true;
    });
  },
  
  /**
   * Vide tous les logs stockés
   */
  clearLogs() {
    localStorage.removeItem(STORAGE_KEY);
  },
  
  /**
   * Exporte les logs au format JSON
   */
  exportLogs(filtered?: boolean, filterOptions?: Parameters<typeof this.filterLogs>[0]): string {
    const logs = filtered && filterOptions 
      ? this.filterLogs(filterOptions)
      : this.getLogs();
      
    return JSON.stringify(logs, null, 2);
  },
  
  /**
   * Récupère les sessions uniques à partir des logs
   */
  getSessions(): { id: string; startTime: string; count: number }[] {
    const logs = this.getLogs();
    const sessions: Record<string, { id: string; startTime: string; count: number }> = {};
    
    logs.forEach(log => {
      if (log.sessionId) {
        if (!sessions[log.sessionId]) {
          sessions[log.sessionId] = {
            id: log.sessionId,
            startTime: log.timestamp,
            count: 0
          };
        }
        sessions[log.sessionId].count++;
      }
    });
    
    return Object.values(sessions).sort((a, b) => {
      return new Date(b.startTime).getTime() - new Date(a.startTime).getTime();
    });
  },
  
  /**
   * Récupère les statistiques sur les logs
   */
  getStats() {
    const logs = this.getLogs();
    
    const levelCounts: Record<LogLevel, number> = {
      debug: 0,
      info: 0,
      warn: 0,
      error: 0
    };
    
    const categoryCounts: Record<string, number> = {};
    
    logs.forEach(log => {
      // Compter par niveau
      levelCounts[log.level]++;
      
      // Compter par catégorie
      if (log.category) {
        categoryCounts[log.category] = (categoryCounts[log.category] || 0) + 1;
      }
    });
    
    return {
      total: logs.length,
      byLevel: levelCounts,
      byCategory: categoryCounts,
      sessions: this.getSessions().length
    };
  }
};

export default logService;
