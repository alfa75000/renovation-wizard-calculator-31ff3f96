
import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

/**
 * Client Supabase pour l'application.
 * Note: Ce fichier va être déprécié en faveur de src/integrations/supabase/client.ts
 */
export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY);

/**
 * Vérifie la connexion à Supabase
 * @returns Promise<object> Résultat de la vérification
 */
export const checkSupabaseConnection = async (): Promise<{
  connected: boolean;
  error?: string;
  details?: any;
  data?: any;
  dbInfo?: any;
  tableStructures?: any;
}> => {
  try {
    const { data, error } = await supabase
      .from('work_types')
      .select('*')
      .limit(1);
    
    if (error) {
      return {
        connected: false,
        error: error.message,
        details: error
      };
    }

    // Si on est ici, la connexion fonctionne, récupérons des infos sur les tables
    const tableStructures = await Promise.all([
      getTableInfo('work_types'),
      getTableInfo('service_groups'),
      getTableInfo('services')
    ]).then(results => {
      return {
        work_types: results[0],
        service_groups: results[1],
        services: results[2]
      };
    }).catch(err => {
      return {
        work_types: "Erreur lors de la récupération des infos",
        service_groups: "Erreur lors de la récupération des infos",
        services: "Erreur lors de la récupération des infos"
      };
    });

    return {
      connected: true,
      data,
      tableStructures
    };
  } catch (err: any) {
    return {
      connected: false,
      error: "Erreur inattendue",
      details: err
    };
  }
};

/**
 * Récupère des informations sur la structure de la base de données
 * @returns Promise<object> Informations sur la base de données
 */
export const getDatabaseInfo = async (): Promise<any> => {
  try {
    // Récupérer la liste des tables
    const { data: tablesData, error: tablesError } = await supabase
      .rpc('get_table_info', { table_name: 'work_types' });
    
    if (tablesError) {
      return { error: `Erreur lors de la récupération des infos des tables: ${tablesError.message}` };
    }

    // Récupérer les structures de quelques tables importantes
    const tables = [
      'work_types', 
      'service_groups', 
      'services', 
      'menuiseries_types',
      'room_menuiseries',
      'room_custom_items'
    ];
    
    const tablesInfo = await Promise.all(
      tables.map(async (tableName) => {
        const { data, error } = await supabase
          .rpc('get_table_info', { table_name: tableName });
        
        if (error) {
          return {
            name: tableName,
            error: error.message
          };
        }
        
        return {
          name: tableName,
          columns: data
        };
      })
    );

    return {
      tables: tablesInfo
    };
  } catch (err: any) {
    return { error: `Exception: ${err.message || err}` };
  }
};

/**
 * Détecte si une table existe dans le schéma Supabase
 * @param tableName Nom de la table à vérifier
 * @returns Promise<boolean> Vrai si la table existe
 */
export const tableExists = async (tableName: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .rpc('get_table_info', { table_name: tableName });
    
    if (error) {
      console.error('Erreur lors de la vérification de l\'existence de la table:', error);
      return false;
    }
    
    return Array.isArray(data) && data.length > 0;
  } catch (err) {
    console.error('Exception lors de la vérification de l\'existence de la table:', err);
    return false;
  }
};

/**
 * Récupère des informations sur une table
 * @param tableName Nom de la table
 * @returns Promise<any> Informations sur la table
 */
export const getTableInfo = async (tableName: string): Promise<any> => {
  try {
    const { data, error } = await supabase
      .rpc('get_table_info', { table_name: tableName });
    
    if (error) {
      console.error(`Erreur lors de la récupération des infos de la table ${tableName}:`, error);
      return `Erreur: ${error.message}`;
    }
    
    return data;
  } catch (err: any) {
    console.error(`Exception lors de la récupération des infos de la table ${tableName}:`, err);
    return `Exception: ${err.message || err}`;
  }
};

/**
 * Exécute une requête pour vérifier si une table contient des données
 * @param tableName Nom de la table à vérifier
 * @returns Promise<boolean> Vrai si la table contient des données
 */
export const hasTableData = async (tableName: string): Promise<boolean> => {
  try {
    // Vérifier d'abord si la table existe
    const tableExist = await tableExists(tableName);
    if (!tableExist) {
      console.warn(`La table ${tableName} n'existe pas.`);
      return false;
    }
    
    // Liste des tables valides dans la base de données
    const validatedTables: string[] = [
      "autres_surfaces_types", "client_types", "clients", 
      "menuiseries_types", "projects", "room_custom_items", 
      "rooms", "room_menuiseries", "room_works", "services", 
      "service_groups", "work_types"
    ];
    
    // Vérifier que la table est valide
    if (!validatedTables.includes(tableName)) {
      console.error(`Table ${tableName} non reconnue.`);
      return false;
    }

    const { data, error, count } = await supabase
      .from(tableName as any)
      .select('*', { count: 'exact', head: true })
      .limit(1);
    
    if (error) {
      console.error(`Erreur lors de la vérification des données de la table ${tableName}:`, error);
      return false;
    }
    
    return count !== null && count > 0;
  } catch (err) {
    console.error(`Exception lors de la vérification des données de la table ${tableName}:`, err);
    return false;
  }
};
