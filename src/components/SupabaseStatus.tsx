
import React, { useEffect, useState } from 'react';
import { checkSupabaseConnection, getDatabaseInfo, SUPABASE_URL } from '@/lib/supabase';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Loader2, AlertCircle, CheckCircle2, ChevronDown, ChevronRight, Database } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const SupabaseStatus = () => {
  const [status, setStatus] = useState<{
    checking: boolean;
    connected: boolean;
    error?: string;
    details?: any;
    data?: any;
    dbInfo?: any;
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
  const [dbStructure, setDbStructure] = useState<any>(null);
  const [loadingDbInfo, setLoadingDbInfo] = useState(false);

  const checkConnection = async () => {
    setStatus(prev => ({ ...prev, checking: true }));
    const result = await checkSupabaseConnection();
    setStatus({
      checking: false,
      connected: result.connected,
      error: result.error,
      details: result.error ? result.details : undefined,
      data: result.data,
      dbInfo: result.dbInfo,
      tableStructures: result.tableStructures
    });
  };

  const fetchDatabaseStructure = async () => {
    setLoadingDbInfo(true);
    try {
      const info = await getDatabaseInfo();
      setDbStructure(info);
    } catch (error) {
      console.error("Erreur lors de la récupération de la structure de la base de données:", error);
    } finally {
      setLoadingDbInfo(false);
    }
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
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={fetchDatabaseStructure} 
                    disabled={loadingDbInfo}
                    className="mb-2"
                  >
                    {loadingDbInfo ? (
                      <>
                        <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                        Chargement...
                      </>
                    ) : (
                      <>
                        <Database className="h-3 w-3 mr-1" />
                        Vérifier la structure de la base de données
                      </>
                    )}
                  </Button>
                  
                  {dbStructure && (
                    <div className="bg-white/80 p-2 rounded text-xs">
                      <p className="font-medium">Structure de la base de données :</p>
                      {dbStructure.error ? (
                        <p className="text-red-600">Erreur : {dbStructure.error}</p>
                      ) : (
                        <Tabs defaultValue="tables">
                          <TabsList className="mb-2">
                            <TabsTrigger value="tables">Tables</TabsTrigger>
                            <TabsTrigger value="raw">JSON brut</TabsTrigger>
                          </TabsList>
                          <TabsContent value="tables">
                            {dbStructure.tables?.map((table: any) => (
                              <div key={table.name} className="mb-2 p-1 bg-gray-50 rounded">
                                <p className="font-medium">{table.name}</p>
                                <ul className="ml-2 mt-1">
                                  {table.columns?.map((col: any) => (
                                    <li key={`${table.name}-${col.name || col}`}>
                                      {col.name || col}: {col.type || 'type inconnu'}
                                    </li>
                                  ))}
                                </ul>
                                {table.error && (
                                  <p className="text-amber-600 text-xs mt-1">Remarque: {table.error}</p>
                                )}
                              </div>
                            ))}
                          </TabsContent>
                          <TabsContent value="raw">
                            <pre className="overflow-auto mt-1 text-xs max-h-64">
                              {JSON.stringify(dbStructure, null, 2)}
                            </pre>
                          </TabsContent>
                        </Tabs>
                      )}
                    </div>
                  )}
                  
                  {status.tableStructures && (
                    <div>
                      <p className="text-xs font-medium mb-1">Structure des tables principales:</p>
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
