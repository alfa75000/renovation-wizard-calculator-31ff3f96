
import { createClient } from '@supabase/supabase-js';
import { Database } from './types';

// Récupérer les variables d'environnement
const supabaseUrl = 'https://gofmlbehbkccqmktsvvb.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdvZm1sYmVoYmtjY3Fta3RzdnZiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQwMzkwNTIsImV4cCI6MjA1OTYxNTA1Mn0.rR80Q8b2WMeZuDsrobagnVp58b-Fl0XzCOTwn4f-2Ag';

// Créer et exporter le client Supabase
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

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
export const checkSupabaseConnection = async (): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('work_types')
      .select('id')
      .limit(1);
    
    if (error) {
      console.error('Erreur de connexion à Supabase:', error);
      return false;
    }
    
    console.log('Connexion à Supabase établie avec succès');
    return true;
  } catch (err) {
    console.error('Exception lors de la vérification de la connexion à Supabase:', err);
    return false;
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
