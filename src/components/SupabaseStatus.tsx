
import React, { useEffect, useState } from 'react';
import { checkSupabaseConnection, SUPABASE_URL } from '@/lib/supabase';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';

const SupabaseStatus = () => {
  const [status, setStatus] = useState<{
    checking: boolean;
    connected: boolean;
    error?: string;
    details?: any;
    data?: any;
  }>({
    checking: true,
    connected: false
  });

  const checkConnection = async () => {
    setStatus(prev => ({ ...prev, checking: true }));
    const result = await checkSupabaseConnection();
    setStatus({
      checking: false,
      connected: result.connected,
      error: result.error,
      details: result.error ? result.details : undefined,
      data: result.data
    });
  };

  useEffect(() => {
    checkConnection();
  }, []);

  return (
    <div className="mb-4">
      {status.checking ? (
        <Alert>
          <Loader2 className="h-4 w-4 animate-spin" />
          <AlertTitle>Vérification de la connexion à Supabase...</AlertTitle>
          <AlertDescription>
            Veuillez patienter pendant que nous vérifions la connexion à {SUPABASE_URL}
          </AlertDescription>
        </Alert>
      ) : status.connected ? (
        <Alert className="bg-green-50 border-green-200">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <AlertTitle className="text-green-800">Connecté à Supabase</AlertTitle>
          <AlertDescription className="text-green-700">
            La connexion à {SUPABASE_URL} est établie.
            {status.data && status.data.length > 0 && (
              <div className="mt-2">
                <p className="text-xs">Données récupérées depuis la table work_types:</p>
                <pre className="text-xs bg-white p-2 rounded mt-1 max-h-20 overflow-auto">
                  {JSON.stringify(status.data, null, 2)}
                </pre>
              </div>
            )}
          </AlertDescription>
        </Alert>
      ) : (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Erreur de connexion à Supabase</AlertTitle>
          <AlertDescription>
            <p>Impossible de se connecter à {SUPABASE_URL}</p>
            {status.error && (
              <p className="mt-1 text-sm">
                Erreur: {status.error}
              </p>
            )}
            {status.details && (
              <pre className="text-xs bg-white text-red-800 p-2 rounded mt-1 max-h-20 overflow-auto">
                {JSON.stringify(status.details, null, 2)}
              </pre>
            )}
            <Button 
              variant="outline" 
              size="sm" 
              onClick={checkConnection} 
              className="mt-2"
            >
              Réessayer
            </Button>
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default SupabaseStatus;
