
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
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default Debug;
