
import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '@/integrations/supabase/client';

/**
 * Client Supabase pour l'application.
 * Note: Ce fichier va être déprécié en faveur de src/integrations/supabase/client.ts
 */
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

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
    
    // Utiliser directement la méthode from avec une validation de type
    const validatedTableName = tableName as "autres_surfaces_types" | "client_types" | 
      "clients" | "menuiseries_types" | "projects" | "room_custom_items" | 
      "rooms" | "room_menuiseries" | "room_works" | "services" | 
      "service_groups" | "work_types";
      
    const { data, error, count } = await supabase
      .from(validatedTableName)
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
