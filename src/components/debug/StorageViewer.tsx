import React, { useState, useEffect } from 'react';
import { useLogger } from '@/hooks/useLogger';
import { useClients } from '@/contexts/ClientsContext';
import db from '@/services/dbService';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { 
  AlertCircle, 
  Database, 
  HardDrive, 
  RefreshCw, 
  Trash,
  DownloadIcon,
  ArrowRightLeft
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';

interface StorageStatus {
  localStorage: {
    available: boolean;
    size: string;
    items: { key: string; size: string; type: string }[];
  };
  indexedDB: {
    available: boolean;
    databases: { name: string; tables: string[] }[];
  };
}

const StorageViewer: React.FC = () => {
  const logger = useLogger('StorageViewer');
  const { state, dispatch, isDbAvailable, isLoading } = useClients();
  const [storageStatus, setStorageStatus] = useState<StorageStatus>({
    localStorage: { available: false, size: '0', items: [] },
    indexedDB: { available: false, databases: [] }
  });
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    checkStorageStatus();
    logger.info('Composant StorageViewer initialisé');
    
    return () => {
      logger.info('Composant StorageViewer détruit');
    };
  }, [refreshKey]);

  const checkStorageStatus = async () => {
    try {
      const status: StorageStatus = {
        localStorage: { available: false, size: '0', items: [] },
        indexedDB: { available: false, databases: [] }
      };
      
      // Vérifier localStorage
      try {
        const testKey = 'storage_test';
        localStorage.setItem(testKey, 'test');
        localStorage.removeItem(testKey);
        status.localStorage.available = true;
        
        // Récupérer les informations sur localStorage
        let totalSize = 0;
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key) {
            const value = localStorage.getItem(key) || '';
            const itemSize = key.length + value.length;
            totalSize += itemSize;
            
            let type = 'string';
            try {
              const parsed = JSON.parse(value);
              type = typeof parsed === 'object' ? 'json' : typeof parsed;
            } catch (e) {
              // Pas un JSON valide
            }
            
            status.localStorage.items.push({ 
              key, 
              size: formatBytes(itemSize), 
              type 
            });
          }
        }
        
        status.localStorage.size = formatBytes(totalSize);
      } catch (e) {
        console.error('localStorage non disponible', e);
        status.localStorage.available = false;
      }
      
      // Vérifier IndexedDB
      try {
        status.indexedDB.available = await db.isAvailable();
        
        if (status.indexedDB.available) {
          status.indexedDB.databases = [
            { 
              name: 'RenovationAppDB', 
              tables: ['clients'] 
            }
          ];
        }
      } catch (e) {
        console.error('IndexedDB non disponible', e);
        status.indexedDB.available = false;
      }
      
      setStorageStatus(status);
      logger.debug('Statut du stockage vérifié', 'storage', status);
    } catch (error) {
      logger.error('Erreur lors de la vérification du statut de stockage', error as Error);
    }
  };
  
  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };
  
  const refreshStorageStatus = () => {
    setRefreshKey(prev => prev + 1);
    toast.success('Statut du stockage actualisé');
  };
  
  const exportStorageData = () => {
    try {
      // Créer un objet avec toutes les données de localStorage
      const storageData: Record<string, any> = {};
      
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key) {
          const value = localStorage.getItem(key);
          try {
            storageData[key] = JSON.parse(value || '');
          } catch (e) {
            storageData[key] = value;
          }
        }
      }
      
      // Convertir en JSON et télécharger
      const jsonData = JSON.stringify(storageData, null, 2);
      const blob = new Blob([jsonData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = `storage_export_${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      
      URL.revokeObjectURL(url);
      logger.info('Données de stockage exportées', 'storage');
      toast.success('Données de stockage exportées');
    } catch (error) {
      logger.error('Erreur lors de l\'export des données de stockage', error as Error);
      toast.error('Erreur lors de l\'export des données');
    }
  };
  
  const clearAllStorage = () => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer toutes les données de stockage ? Cette action est irréversible.')) {
      try {
        localStorage.clear();
        
        // Recharger la page pour réinitialiser l'application
        logger.warn('Toutes les données de stockage ont été supprimées', 'storage');
        toast.success('Toutes les données de stockage ont été supprimées');
        
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } catch (error) {
        logger.error('Erreur lors de la suppression des données de stockage', error as Error);
        toast.error('Erreur lors de la suppression des données');
      }
    }
  };
  
  const toggleStorageMode = () => {
    try {
      dispatch({ 
        type: 'SET_USE_IDB', 
        payload: !state.useIdb 
      });
      
      const newMode = !state.useIdb ? 'IndexedDB' : 'localStorage';
      logger.info(`Mode de stockage changé pour ${newMode}`, 'system');
      toast.success(`Mode de stockage changé pour ${newMode}`);
    } catch (error) {
      logger.error('Erreur lors du changement de mode de stockage', error as Error);
      toast.error('Erreur lors du changement de mode de stockage');
    }
  };
  
  return (
    <div className="container mx-auto py-6">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span>Gestionnaire de Stockage</span>
            <Button
              variant="outline" 
              size="sm" 
              onClick={refreshStorageStatus}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Rafraîchir
            </Button>
          </CardTitle>
          <CardDescription>
            Gérez les données stockées localement et contrôlez le mode de stockage
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
            <Card className="w-full md:w-1/2 bg-gray-50">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <HardDrive className="h-5 w-5 mr-2" />
                  LocalStorage
                  <Badge className={`ml-2 ${storageStatus.localStorage.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {storageStatus.localStorage.available ? 'Disponible' : 'Non disponible'}
                  </Badge>
                </CardTitle>
                <CardDescription>
                  Stockage simple, ~ 5Mo maximum
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm mb-2">
                  <span className="font-medium">Taille totale utilisée:</span> {storageStatus.localStorage.size}
                </p>
                <p className="text-sm mb-2">
                  <span className="font-medium">Nombre d'entrées:</span> {storageStatus.localStorage.items.length}
                </p>
              </CardContent>
            </Card>
            
            <Card className="w-full md:w-1/2 bg-gray-50">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <Database className="h-5 w-5 mr-2" />
                  IndexedDB
                  <Badge className={`ml-2 ${isDbAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {isLoading ? 'Chargement...' : (isDbAvailable ? 'Disponible' : 'Non disponible')}
                  </Badge>
                </CardTitle>
                <CardDescription>
                  Stockage avancé, plusieurs centaines de Mo
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isDbAvailable ? (
                  <>
                    <p className="text-sm mb-2">
                      <span className="font-medium">Base:</span> RenovationAppDB
                    </p>
                    <p className="text-sm mb-2">
                      <span className="font-medium">Tables:</span> clients
                    </p>
                  </>
                ) : (
                  <div className="flex items-center text-amber-600">
                    <AlertCircle className="h-4 w-4 mr-2" />
                    <p className="text-sm">IndexedDB n'est pas disponible dans ce navigateur</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-gray-100 rounded-lg mb-6">
            <div>
              <h3 className="font-medium">Mode de stockage actuel</h3>
              <p className="text-sm text-gray-600">
                {state.useIdb 
                  ? 'IndexedDB (optimal pour les performances et volumes importants)' 
                  : 'LocalStorage (compatible avec tous les navigateurs)'}
              </p>
            </div>
            
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium">localStorage</span>
              <Switch 
                checked={state.useIdb}
                onCheckedChange={toggleStorageMode}
                disabled={!isDbAvailable || isLoading}
              />
              <span className="text-sm font-medium">IndexedDB</span>
            </div>
          </div>
          
          <Tabs defaultValue="localStorage" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="localStorage">LocalStorage</TabsTrigger>
              <TabsTrigger value="clients">Clients</TabsTrigger>
            </TabsList>
            
            <TabsContent value="localStorage">
              <Table>
                <TableCaption>Contenu de localStorage ({storageStatus.localStorage.items.length} entrées)</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>Clé</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Taille</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {storageStatus.localStorage.items.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center">
                        Aucune donnée stockée
                      </TableCell>
                    </TableRow>
                  ) : (
                    storageStatus.localStorage.items.map((item) => (
                      <TableRow key={item.key}>
                        <TableCell className="font-medium">{item.key}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{item.type}</Badge>
                        </TableCell>
                        <TableCell>{item.size}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TabsContent>
            
            <TabsContent value="clients">
              <Table>
                <TableCaption>Clients ({state.clients.length})</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Nom</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Stockage</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {state.clients.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center">
                        Aucun client trouvé
                      </TableCell>
                    </TableRow>
                  ) : (
                    state.clients.map((client) => (
                      <TableRow key={client.id}>
                        <TableCell className="font-mono text-xs">{client.id.substring(0, 8)}...</TableCell>
                        <TableCell className="font-medium">{client.nom} {client.prenom}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{client.typeClient}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={state.useIdb ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}>
                            {state.useIdb ? 'IndexedDB' : 'localStorage'}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button 
            variant="destructive" 
            onClick={clearAllStorage}
          >
            <Trash className="h-4 w-4 mr-2" />
            Vider le stockage
          </Button>
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              onClick={exportStorageData}
            >
              <DownloadIcon className="h-4 w-4 mr-2" />
              Exporter
            </Button>
            {isDbAvailable && (
              <Button 
                variant="outline"
                onClick={() => {
                  const clientsJson = JSON.stringify(state.clients);
                  try {
                    db.syncFromLocalStorage(state.clients)
                      .then(() => {
                        toast.success('Synchronisation avec IndexedDB réussie');
                      })
                      .catch(err => {
                        toast.error('Échec de la synchronisation: ' + err.message);
                      });
                  } catch (error) {
                    toast.error('Erreur lors de la synchronisation');
                  }
                }}
              >
                <ArrowRightLeft className="h-4 w-4 mr-2" />
                Synchroniser
              </Button>
            )}
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default StorageViewer;
