
import { createClient } from '@supabase/supabase-js';
import { Database } from './types';

// Récupérer les variables d'environnement
export const SUPABASE_URL = 'https://gofmlbehbkccqmktsvvb.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdvZm1sYmVoYmtjY3Fta3RzdnZiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQwMzkwNTIsImV4cCI6MjA1OTYxNTA1Mn0.rR80Q8b2WMeZuDsrobagnVp58b-Fl0XzCOTwn4f-2Ag';
export const SUPABASE_ANON_KEY = supabaseAnonKey;

// Créer et exporter le client Supabase
export const supabase = createClient<Database>(SUPABASE_URL, supabaseAnonKey);

// Liste des tables disponibles dans Supabase
export const supabaseTables = [
  'autres_surfaces_types',
  'client_types',
  'clients',
  'menuiseries_types',
  'projects',
  'room_custom_items',
  'rooms',
  'room_menuiseries',
  'room_works',
  'services',
  'service_groups',
  'work_types'
] as const;

export type SupabaseTables = typeof supabaseTables[number];

// Fonction utilitaire pour vérifier si une table existe dans Supabase
export const isValidSupabaseTable = (tableName: string): tableName is SupabaseTables => {
  return supabaseTables.includes(tableName as SupabaseTables);
};

// Fonction pour effectuer une requête vers une table dynamique en toute sécurité
export const fromDynamic = (tableName: string) => {
  if (!isValidSupabaseTable(tableName)) {
    console.error(`La table "${tableName}" n'existe pas dans Supabase`);
    throw new Error(`Table "${tableName}" non valide`);
  }
  return supabase.from(tableName);
};

// Vérifier la connexion à Supabase
export const checkSupabaseConnection = async (): Promise<{ connected: boolean; error?: string; details?: any; data?: any; dbInfo?: any; tableStructures?: any }> => {
  try {
    const { data, error } = await supabase
      .from('work_types')
      .select('id')
      .limit(1);
    
    if (error) {
      console.error('Erreur de connexion à Supabase:', error);
      return { connected: false, error: error.message, details: error };
    }
    
    console.log('Connexion à Supabase établie avec succès');
    
    // Récupérer des informations sur quelques tables
    const tableStructures = {
      work_types: await getTableStructure('work_types'),
      service_groups: await getTableStructure('service_groups'),
      services: await getTableStructure('services')
    };
    
    return { 
      connected: true, 
      data,
      tableStructures
    };
  } catch (err) {
    console.error('Exception lors de la vérification de la connexion à Supabase:', err);
    return { connected: false, error: 'Exception inattendue', details: err };
  }
};

// Fonction pour récupérer les informations sur la structure d'une table
export const getTableStructure = async (tableName: string): Promise<string[] | string> => {
  try {
    if (!isValidSupabaseTable(tableName)) {
      return `La table "${tableName}" n'existe pas dans Supabase`;
    }
    
    const { data, error } = await supabase
      .rpc('get_table_info', { table_name: tableName });
    
    if (error) {
      return `Erreur: ${error.message}`;
    }
    
    return data?.map((col: any) => col.name) || [`Aucune colonne trouvée pour ${tableName}`];
  } catch (err) {
    return `Exception: ${(err as Error).message}`;
  }
};

// Alias de getTableStructure pour compatibilité avec le composant SupabaseStatus
export const getDatabaseInfo = async () => {
  try {
    const tables = [];
    for (const table of supabaseTables) {
      const columns = await getTableStructure(table);
      tables.push({
        name: table,
        columns: Array.isArray(columns) ? columns.map(col => ({ name: col })) : [{ error: columns }]
      });
    }
    return { tables };
  } catch (err) {
    return { error: (err as Error).message };
  }
};

// Fonction pour récupérer la structure d'une table
export const getTableInfo = async (tableName: string): Promise<any> => {
  try {
    if (!isValidSupabaseTable(tableName)) {
      console.error(`La table "${tableName}" n'existe pas dans Supabase`);
      return null;
    }
    
    const { data, error } = await supabase
      .rpc('get_table_info', { table_name: tableName });
    
    if (error) {
      console.error(`Erreur lors de la récupération des informations de la table ${tableName}:`, error);
      return null;
    }
    
    return data;
  } catch (err) {
    console.error(`Exception lors de la récupération des informations de la table ${tableName}:`, err);
    return null;
  }
};
