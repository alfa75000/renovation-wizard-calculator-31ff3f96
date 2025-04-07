import React, { useEffect } from 'react';
import LogViewer from '@/components/debug/LogViewer';
import { useLogger } from '@/hooks/useLogger';
import { Button } from '@/components/ui/button';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';

/**
 * Page de débogage accessible uniquement via un bouton dans le layout (en mode dev)
 */
const Debug: React.FC = () => {
  const logger = useLogger('DebugPage');
  
  useEffect(() => {
    logger.info('Accès à la page de debug', 'system');
  }, []);
  
  return (
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
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-bold mb-4">Stockage local</h2>
              <p className="text-gray-600 mb-4">
                Cette section affiche les informations sur le stockage local de l'application.
                Elle sera développée dans les futures versions.
              </p>
              {/* Ici nous ajouterons la visualisation du localStorage et autres mécanismes de stockage */}
            </div>
          </TabsContent>
          
          <TabsContent value="system">
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-bold mb-4">Informations système</h2>
              <p className="text-gray-600 mb-4">
                Cette section affiche les informations sur le système et l'environnement.
                Elle sera développée dans les futures versions.
              </p>
              {/* Ici nous ajouterons des informations sur le navigateur, performance, etc. */}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Debug;
