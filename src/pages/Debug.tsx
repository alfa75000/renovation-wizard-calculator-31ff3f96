
import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import LogViewer from '@/components/debug/LogViewer';
import { useLogger } from '@/hooks/useLogger';
import { Button } from '@/components/ui/button';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';

// Clé pour stocker l'état d'authentification du mode debug dans sessionStorage
const DEBUG_AUTH_KEY = 'debug_mode_authorized';

/**
 * Page de débogage accessible uniquement via une combinaison de touches
 * ou un accès direct avec authentification
 */
const Debug: React.FC = () => {
  const logger = useLogger('DebugPage');
  const [isAuthorized, setIsAuthorized] = useState<boolean>(false);
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  
  // Vérifier si l'utilisateur a déjà été autorisé dans cette session
  useEffect(() => {
    const debugAuthorized = sessionStorage.getItem(DEBUG_AUTH_KEY) === 'true';
    setIsAuthorized(debugAuthorized);
    
    if (debugAuthorized) {
      logger.info('Accès à la page de debug (déjà autorisé)', 'system');
    }
  }, []);
  
  // Installer l'écouteur de clavier pour la combinaison Ctrl+Shift+D
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+Shift+D
      if (e.ctrlKey && e.shiftKey && e.key === 'D') {
        setIsAuthorized(true);
        sessionStorage.setItem(DEBUG_AUTH_KEY, 'true');
        logger.info('Accès à la page de debug (combinaison de touches)', 'system');
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);
  
  const handleAuthorize = () => {
    // Mot de passe simple pour la démo (à remplacer par une vraie authentification)
    const debugPassword = 'debug1234';
    
    if (password === debugPassword) {
      setIsAuthorized(true);
      sessionStorage.setItem(DEBUG_AUTH_KEY, 'true');
      logger.info('Accès à la page de debug (mot de passe)', 'system');
    } else {
      setError('Mot de passe incorrect');
      logger.warn('Tentative d\'accès à la page de debug avec un mot de passe incorrect', 'system');
    }
  };
  
  // Rediriger vers la page d'accueil si l'utilisateur n'est pas autorisé
  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow">
          <div className="text-center">
            <h1 className="text-2xl font-bold">Mode Débogage</h1>
            <p className="mt-2 text-gray-600">
              Cette page est réservée aux développeurs. Veuillez saisir le mot de passe pour y accéder.
            </p>
          </div>
          
          <div className="mt-8 space-y-6">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mot de passe"
              className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
              onKeyDown={(e) => e.key === 'Enter' && handleAuthorize()}
            />
            
            {error && (
              <p className="text-sm text-red-600">{error}</p>
            )}
            
            <div>
              <Button 
                className="w-full" 
                onClick={handleAuthorize}
              >
                Accéder
              </Button>
            </div>
            
            <p className="text-xs text-center text-gray-500 mt-8">
              Astuce: Vous pouvez également utiliser la combinaison <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>D</kbd> pour accéder à cette page.
            </p>
          </div>
        </div>
      </div>
    );
  }
  
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
