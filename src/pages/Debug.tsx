
import React, { useEffect } from 'react';
import LogViewer from '@/components/debug/LogViewer';
import StorageViewer from '@/components/debug/StorageViewer';
import { useLogger } from '@/hooks/useLogger';
import { Button } from '@/components/ui/button';
import { Layout } from '@/components/Layout';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { Toaster } from 'sonner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Database, HardDrive, Server, Layers } from 'lucide-react';

/**
 * Page de débogage accessible uniquement via un bouton dans le layout (en mode dev)
 */
const Debug: React.FC = () => {
  const logger = useLogger('DebugPage');
  
  useEffect(() => {
    logger.info('Accès à la page de debug', 'system');
  }, []);
  
  return (
    <Layout>
      <Toaster position="top-right" />
      <div className="min-h-screen bg-gray-50 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Mode Débogage</h1>
            <Button asChild variant="outline">
              <a href="/">Retour à l'application</a>
            </Button>
          </div>
          
          <Tabs defaultValue="logs">
            <TabsList className="mb-6">
              <TabsTrigger value="logs">Logs</TabsTrigger>
              <TabsTrigger value="storage">Stockage</TabsTrigger>
              <TabsTrigger value="system">Système</TabsTrigger>
              <TabsTrigger value="database">Base de données</TabsTrigger>
            </TabsList>
            
            <TabsContent value="logs">
              <LogViewer />
            </TabsContent>
            
            <TabsContent value="storage">
              <StorageViewer />
            </TabsContent>
            
            <TabsContent value="system">
              <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-xl font-bold mb-4">Informations système</h2>
                <p className="text-gray-600 mb-4">
                  Cette section affiche les informations sur le système et l'environnement.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border rounded p-4">
                    <h3 className="font-medium mb-2">Navigateur</h3>
                    <div className="text-sm space-y-1">
                      <p><span className="font-medium">User Agent:</span> {navigator.userAgent}</p>
                      <p><span className="font-medium">Langue:</span> {navigator.language}</p>
                      <p><span className="font-medium">En ligne:</span> {navigator.onLine ? 'Oui' : 'Non'}</p>
                      <p><span className="font-medium">Cookies activés:</span> {navigator.cookieEnabled ? 'Oui' : 'Non'}</p>
                    </div>
                  </div>
                  
                  <div className="border rounded p-4">
                    <h3 className="font-medium mb-2">React & Application</h3>
                    <div className="text-sm space-y-1">
                      <p><span className="font-medium">Mode:</span> {process.env.NODE_ENV}</p>
                      <p><span className="font-medium">Version React:</span> {React.version}</p>
                      <p><span className="font-medium">Heure courante:</span> {new Date().toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="database">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Database className="h-5 w-5 text-primary" />
                        <CardTitle>IndexedDB</CardTitle>
                      </div>
                    </div>
                    <CardDescription>
                      État de la base de données locale IndexedDB
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-sm font-medium mb-1">Schéma de la base de données</h3>
                        <div className="text-xs bg-gray-50 p-2 rounded border">
                          <pre className="whitespace-pre-wrap">
                            {`
RenovationAppDB v1:
- clients: 'id, nom, prenom, typeClient'
- rooms: 'id, name'
- travaux: 'id, pieceId, type'
- projets: 'id, clientId, nomProjet'
- propertyInfo: 'id'
                            `}
                          </pre>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2">
                        <div className="border rounded p-2 flex items-center space-x-2">
                          <HardDrive className="h-4 w-4 text-blue-500" />
                          <div>
                            <div className="text-xs font-medium">clients</div>
                            <div className="text-xs text-gray-500">Table de clients</div>
                          </div>
                        </div>
                        
                        <div className="border rounded p-2 flex items-center space-x-2">
                          <Layers className="h-4 w-4 text-green-500" />
                          <div>
                            <div className="text-xs font-medium">rooms</div>
                            <div className="text-xs text-gray-500">Pièces du projet</div>
                          </div>
                        </div>
                        
                        <div className="border rounded p-2 flex items-center space-x-2">
                          <Server className="h-4 w-4 text-purple-500" />
                          <div>
                            <div className="text-xs font-medium">travaux</div>
                            <div className="text-xs text-gray-500">Travaux par pièce</div>
                          </div>
                        </div>
                        
                        <div className="border rounded p-2 flex items-center space-x-2">
                          <Database className="h-4 w-4 text-amber-500" />
                          <div>
                            <div className="text-xs font-medium">projets</div>
                            <div className="text-xs text-gray-500">Projets chantier</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Server className="h-5 w-5 text-primary" />
                        <CardTitle>Mécanismes de récupération</CardTitle>
                      </div>
                    </div>
                    <CardDescription>
                      Stratégies pour garantir l'intégrité des données
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-sm font-medium">Stratégie hybride</h3>
                        <p className="text-xs text-gray-500">
                          Le système utilise IndexedDB avec fallback vers localStorage pour assurer la persistance des données.
                        </p>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium">Mécanismes de récupération</h3>
                        <ul className="list-disc pl-5 text-xs text-gray-500 space-y-1">
                          <li>Synchronisation bi-directionnelle entre IndexedDB et localStorage</li>
                          <li>Tampon de sauvegarde pour les opérations critiques</li>
                          <li>Journalisation des opérations pour récupération après erreur</li>
                          <li>Détection automatique de disponibilité d'IndexedDB</li>
                          <li>Gestion des transactions pour maintenir l'intégrité</li>
                        </ul>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium">Ordre de récupération</h3>
                        <ol className="list-decimal pl-5 text-xs text-gray-500 space-y-1">
                          <li>Tentative de lecture depuis IndexedDB</li>
                          <li>Fallback vers localStorage en cas d'échec</li>
                          <li>Consultation du tampon de sauvegarde si nécessaire</li>
                          <li>Reconstruction à partir des logs en dernier recours</li>
                        </ol>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default Debug;
