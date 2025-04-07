
import React, { useEffect, useState } from 'react';
import { checkSupabaseConnection, SUPABASE_URL } from '@/lib/supabase';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Loader2, AlertCircle, CheckCircle2, ChevronDown, ChevronRight } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

const SupabaseStatus = () => {
  const [status, setStatus] = useState<{
    checking: boolean;
    connected: boolean;
    error?: string;
    details?: any;
    data?: any;
    tables?: any;
    tableStructures?: {
      work_types: string[] | string;
      service_groups: string[] | string;
      services: string[] | string;
    };
  }>({
    checking: true,
    connected: false
  });

  const [showDetails, setShowDetails] = useState(false);

  const checkConnection = async () => {
    setStatus(prev => ({ ...prev, checking: true }));
    const result = await checkSupabaseConnection();
    setStatus({
      checking: false,
      connected: result.connected,
      error: result.error,
      details: result.error ? result.details : undefined,
      data: result.data,
      tables: result.tables,
      tableStructures: result.tableStructures
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
            <div>La connexion à {SUPABASE_URL} est établie.</div>
            
            <Collapsible open={showDetails} onOpenChange={setShowDetails} className="mt-2">
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm" className="p-0 h-auto text-green-700 flex items-center">
                  {showDetails ? <ChevronDown className="h-4 w-4 mr-1" /> : <ChevronRight className="h-4 w-4 mr-1" />}
                  {showDetails ? "Masquer les détails" : "Afficher les détails"}
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="mt-2 space-y-3">
                  {status.tableStructures && (
                    <div>
                      <p className="text-xs font-medium mb-1">Structure des tables:</p>
                      <div className="space-y-2">
                        <div className="bg-white/80 p-2 rounded text-xs">
                          <p className="font-medium">work_types:</p>
                          <pre className="overflow-auto mt-1 text-xs">
                            {typeof status.tableStructures.work_types === 'string' 
                              ? status.tableStructures.work_types 
                              : JSON.stringify(status.tableStructures.work_types, null, 2)}
                          </pre>
                        </div>
                        
                        <div className="bg-white/80 p-2 rounded text-xs">
                          <p className="font-medium">service_groups:</p>
                          <pre className="overflow-auto mt-1 text-xs">
                            {typeof status.tableStructures.service_groups === 'string' 
                              ? status.tableStructures.service_groups 
                              : JSON.stringify(status.tableStructures.service_groups, null, 2)}
                          </pre>
                        </div>
                        
                        <div className="bg-white/80 p-2 rounded text-xs">
                          <p className="font-medium">services:</p>
                          <pre className="overflow-auto mt-1 text-xs">
                            {typeof status.tableStructures.services === 'string' 
                              ? status.tableStructures.services 
                              : JSON.stringify(status.tableStructures.services, null, 2)}
                          </pre>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {status.data && status.data.length > 0 && (
                    <div>
                      <p className="text-xs font-medium mb-1">Données récupérées depuis work_types:</p>
                      <pre className="text-xs bg-white/80 p-2 rounded mt-1 max-h-20 overflow-auto">
                        {JSON.stringify(status.data, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              </CollapsibleContent>
            </Collapsible>
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
