import React, { useState, useEffect } from 'react';
import { useLogger } from '@/hooks/useLogger';
import { LogEntry, LogLevel, LogCategory } from '@/services/logService';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { DownloadIcon, RefreshCw, Trash } from 'lucide-react';

const getLevelColor = (level: LogLevel): string => {
  switch (level) {
    case 'debug': return 'bg-gray-200 text-gray-800';
    case 'info': return 'bg-blue-200 text-blue-800';
    case 'warn': return 'bg-yellow-200 text-yellow-800';
    case 'error': return 'bg-red-200 text-red-800';
    default: return 'bg-gray-200 text-gray-800';
  }
};

const getCategoryColor = (category: LogCategory): string => {
  switch (category) {
    case 'data': return 'bg-purple-200 text-purple-800';
    case 'ui': return 'bg-green-200 text-green-800';
    case 'network': return 'bg-blue-200 text-blue-800';
    case 'storage': return 'bg-yellow-200 text-yellow-800';
    case 'system': return 'bg-red-200 text-red-800';
    default: return 'bg-gray-200 text-gray-800';
  }
};

const LogViewer: React.FC = () => {
  const logger = useLogger('LogViewer');
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<LogEntry[]>([]);
  const [selectedLog, setSelectedLog] = useState<LogEntry | null>(null);
  const [filter, setFilter] = useState({
    level: '' as LogLevel | '',
    category: '' as LogCategory | '',
    search: '',
    session: ''
  });
  const [sessions, setSessions] = useState<{ id: string; startTime: string; count: number }[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [autoRefresh, setAutoRefresh] = useState(false);

  useEffect(() => {
    loadLogs();
    loadSessions();
    loadStats();
    
    logger.info('Composant LogViewer initialisé');
    
    // Log l'ouverture de la page de debug
    logger.info('Page de debug ouverte', 'system', { 
      userAgent: navigator.userAgent,
      resolution: `${window.innerWidth}x${window.innerHeight}`
    });
    
    return () => {
      logger.info('Composant LogViewer détruit');
    };
  }, []);
  
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (autoRefresh) {
      interval = setInterval(() => {
        loadLogs();
        loadStats();
      }, 5000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoRefresh]);
  
  useEffect(() => {
    applyFilters();
  }, [logs, filter]);
  
  const loadLogs = () => {
    try {
      const allLogs = logger.getLogs();
      setLogs(allLogs);
      logger.debug('Logs chargés', 'data', { count: allLogs.length });
    } catch (error) {
      logger.error('Erreur lors du chargement des logs', error as Error);
    }
  };
  
  const loadSessions = () => {
    try {
      const allSessions = logger.getSessions();
      setSessions(allSessions);
    } catch (error) {
      logger.error('Erreur lors du chargement des sessions', error as Error);
    }
  };
  
  const loadStats = () => {
    try {
      const logStats = logger.getStats();
      setStats(logStats);
    } catch (error) {
      logger.error('Erreur lors du chargement des statistiques', error as Error);
    }
  };
  
  const applyFilters = () => {
    try {
      let filtered = [...logs];
      
      if (filter.level) {
        filtered = filtered.filter(log => log.level === filter.level);
      }
      
      if (filter.category) {
        filtered = filtered.filter(log => log.category === filter.category);
      }
      
      if (filter.session) {
        filtered = filtered.filter(log => log.sessionId === filter.session);
      }
      
      if (filter.search) {
        const searchLower = filter.search.toLowerCase();
        filtered = filtered.filter(log => {
          const messageMatch = log.message.toLowerCase().includes(searchLower);
          const contextMatch = log.context 
            ? JSON.stringify(log.context).toLowerCase().includes(searchLower) 
            : false;
          return messageMatch || contextMatch;
        });
      }
      
      setFilteredLogs(filtered);
    } catch (error) {
      logger.error('Erreur lors de l\'application des filtres', error as Error);
    }
  };
  
  const clearAllLogs = () => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer tous les logs ?')) {
      try {
        logger.clearLogs();
        loadLogs();
        loadSessions();
        loadStats();
        logger.info('Tous les logs ont été supprimés', 'system');
      } catch (error) {
        logger.error('Erreur lors de la suppression des logs', error as Error);
      }
    }
  };
  
  const exportLogsToFile = () => {
    try {
      const exportData = logger.exportLogs(true, {
        level: filter.level as LogLevel | undefined,
        category: filter.category as LogCategory | undefined,
        search: filter.search || undefined,
        sessionId: filter.session || undefined
      });
      
      const blob = new Blob([exportData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = `app_logs_${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      
      URL.revokeObjectURL(url);
      logger.info('Logs exportés', 'system');
    } catch (error) {
      logger.error('Erreur lors de l\'export des logs', error as Error);
    }
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };
  
  return (
    <div className="container mx-auto py-6">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span>Visualiseur de Logs</span>
            <div className="flex space-x-2">
              <Button
                variant="outline" 
                size="sm" 
                onClick={() => {
                  loadLogs();
                  loadSessions();
                  loadStats();
                }}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Rafraîchir
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setAutoRefresh(!autoRefresh)}
              >
                {autoRefresh ? 'Désactiver' : 'Activer'} l'auto-refresh
              </Button>
            </div>
          </CardTitle>
          <CardDescription>
            Visualisez et filtrez les logs de l'application pour diagnostiquer les problèmes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="w-full md:w-1/4">
              <Select
                value={filter.level}
                onValueChange={(value) => setFilter({ ...filter, level: value as LogLevel | '' })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Niveau" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Tous les niveaux</SelectItem>
                  <SelectItem value="debug">Debug</SelectItem>
                  <SelectItem value="info">Info</SelectItem>
                  <SelectItem value="warn">Warning</SelectItem>
                  <SelectItem value="error">Error</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="w-full md:w-1/4">
              <Select
                value={filter.category}
                onValueChange={(value) => setFilter({ ...filter, category: value as LogCategory | '' })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Catégorie" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Toutes les catégories</SelectItem>
                  <SelectItem value="data">Data</SelectItem>
                  <SelectItem value="ui">UI</SelectItem>
                  <SelectItem value="network">Network</SelectItem>
                  <SelectItem value="storage">Storage</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                  <SelectItem value="other">Autre</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="w-full md:w-1/4">
              <Select
                value={filter.session}
                onValueChange={(value) => setFilter({ ...filter, session: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Session" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Toutes les sessions</SelectItem>
                  {sessions.map((session) => (
                    <SelectItem key={session.id} value={session.id}>
                      {new Date(session.startTime).toLocaleString()} ({session.count})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="w-full md:w-1/4">
              <Input
                type="text"
                placeholder="Rechercher..."
                value={filter.search}
                onChange={(e) => setFilter({ ...filter, search: e.target.value })}
              />
            </div>
          </div>
          
          {stats && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <Card>
                <CardContent className="p-4">
                  <div className="text-sm text-gray-500">Total des logs</div>
                  <div className="text-2xl font-bold">{stats.total}</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-sm text-gray-500">Erreurs</div>
                  <div className="text-2xl font-bold text-red-600">{stats.byLevel.error}</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-sm text-gray-500">Avertissements</div>
                  <div className="text-2xl font-bold text-yellow-600">{stats.byLevel.warn}</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-sm text-gray-500">Sessions</div>
                  <div className="text-2xl font-bold">{stats.sessions}</div>
                </CardContent>
              </Card>
            </div>
          )}
          
          <Table>
            <TableCaption>Total: {filteredLogs.length} logs</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Date/Heure</TableHead>
                <TableHead>Niveau</TableHead>
                <TableHead>Catégorie</TableHead>
                <TableHead className="w-full">Message</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLogs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center">
                    Aucun log trouvé
                  </TableCell>
                </TableRow>
              ) : (
                filteredLogs.slice().reverse().map((log) => (
                  <TableRow 
                    key={log.id} 
                    className="cursor-pointer hover:bg-gray-50"
                    onClick={() => setSelectedLog(log)}
                  >
                    <TableCell>{formatDate(log.timestamp)}</TableCell>
                    <TableCell>
                      <Badge className={getLevelColor(log.level)}>
                        {log.level}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getCategoryColor(log.category)}>
                        {log.category}
                      </Badge>
                    </TableCell>
                    <TableCell>{log.message}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button 
            variant="destructive" 
            onClick={clearAllLogs}
          >
            <Trash className="h-4 w-4 mr-2" />
            Vider les logs
          </Button>
          <Button 
            variant="outline" 
            onClick={exportLogsToFile}
          >
            <DownloadIcon className="h-4 w-4 mr-2" />
            Exporter les logs
          </Button>
        </CardFooter>
      </Card>
      
      {selectedLog && (
        <Card>
          <CardHeader>
            <CardTitle>Détails du log</CardTitle>
            <CardDescription>
              {formatDate(selectedLog.timestamp)}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium">Session ID</h4>
                <p className="text-sm">{selectedLog.sessionId}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium">Message</h4>
                <p className="text-sm">{selectedLog.message}</p>
              </div>
              {selectedLog.context && (
                <div>
                  <h4 className="text-sm font-medium">Contexte</h4>
                  <pre className="text-xs bg-gray-100 p-2 rounded overflow-auto">
                    {JSON.stringify(selectedLog.context, null, 2)}
                  </pre>
                </div>
              )}
              {selectedLog.stack && (
                <div>
                  <h4 className="text-sm font-medium">Stack trace</h4>
                  <pre className="text-xs bg-gray-100 p-2 rounded overflow-auto">
                    {selectedLog.stack}
                  </pre>
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              variant="secondary" 
              onClick={() => setSelectedLog(null)}
            >
              Fermer
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
};

export default LogViewer;
