
import { createClient } from '@supabase/supabase-js';

// Ces valeurs sont celles que vous avez fournies
export const SUPABASE_URL = 'https://gofmlbehbkccqmktsvvb.supabase.co';
export const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdvZm1sYmVoYmtjY3Fta3RzdnZiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQwMzkwNTIsImV4cCI6MjA1OTYxNTA1Mn0.rR80Q8b2WMeZuDsrobagnVp58b-Fl0XzCOTwn4f-2Ag';

// Initialisation du client Supabase
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/**
 * Récupère les informations sur les tables de la base de données
 */
export const getDatabaseInfo = async () => {
  try {
    console.log("Récupération des informations sur la base de données...");
    
    // Requête SQL pour obtenir les tables et leurs colonnes
    const { data: tablesInfo, error: tablesError } = await supabase
      .from('pg_tables')
      .select('*')
      .eq('schemaname', 'public');
    
    if (tablesError) {
      console.error('Erreur lors de la récupération des tables:', tablesError);
      return { error: tablesError.message };
    }
    
    // Récupérer les informations sur les colonnes pour chaque table
    const tablesData = [];
    
    for (const table of tablesInfo || []) {
      const tableName = table.tablename;
      
      // Exécuter une requête SQL via la fonctionnalité RPC pour obtenir les infos sur les colonnes
      const { data: columnsData, error: columnsError } = await supabase.rpc('get_table_info', { 
        table_name: tableName 
      });
      
      if (columnsError) {
        console.warn(`Erreur lors de la récupération des colonnes pour ${tableName}:`, columnsError);
        // Utiliser une méthode alternative pour obtenir au moins quelques informations
        const { data: sampleData } = await supabase
          .from(tableName)
          .select('*')
          .limit(1);
        
        tablesData.push({
          name: tableName,
          columns: sampleData ? Object.keys(sampleData[0] || {}).map(name => ({ name })) : [],
          error: columnsError.message
        });
      } else {
        tablesData.push({
          name: tableName,
          columns: columnsData
        });
      }
    }
    
    return { tables: tablesData };
  } catch (error) {
    console.error('Exception lors de la récupération des informations de la base de données:', error);
    return { error: "Exception inattendue" };
  }
};

// Fonction utilitaire pour vérifier la connexion
export const checkSupabaseConnection = async () => {
  try {
    console.log("Vérification de la connexion à Supabase...");
    
    // Tenter une requête simple
    const { data, error } = await supabase.from('work_types').select('*').limit(3);
    
    console.log("Résultat de la requête test work_types:", { 
      data, 
      error, 
      count: data?.length || 0
    });
    
    if (error) {
      console.error('Erreur de connexion à Supabase:', error);
      return {
        connected: false,
        error: error.message,
        details: error
      };
    }

    // Récupérer les infos de la base de données sans utiliser list_tables
    let dbInfo = null;
    try {
      dbInfo = await getDatabaseInfo();
    } catch (e) {
      console.warn("Impossible de récupérer les informations complètes de la base de données:", e);
    }
    
    // Récupérer les structures des tables principales
    const { data: workTypesColumns } = await supabase
      .from('work_types')
      .select('*')
      .limit(1);
    
    const { data: serviceGroupsColumns } = await supabase
      .from('service_groups')
      .select('*')
      .limit(1);
    
    const { data: servicesColumns } = await supabase
      .from('services')
      .select('*')
      .limit(1);
    
    console.log("Structures des tables récupérées:", {
      work_types: workTypesColumns ? Object.keys(workTypesColumns[0] || {}) : "Pas de données",
      service_groups: serviceGroupsColumns ? Object.keys(serviceGroupsColumns[0] || {}) : "Pas de données",
      services: servicesColumns ? Object.keys(servicesColumns[0] || {}) : "Pas de données"
    });
    
    return {
      connected: true,
      data,
      dbInfo: dbInfo || "Non disponible",
      tableStructures: {
        work_types: workTypesColumns ? Object.keys(workTypesColumns[0] || {}) : "Pas de données",
        service_groups: serviceGroupsColumns ? Object.keys(serviceGroupsColumns[0] || {}) : "Pas de données",
        services: servicesColumns ? Object.keys(servicesColumns[0] || {}) : "Pas de données"
      }
    };
  } catch (error) {
    console.error('Exception lors de la connexion à Supabase:', error);
    return {
      connected: false,
      error: "Exception inattendue lors de la connexion"
    };
  }
};
