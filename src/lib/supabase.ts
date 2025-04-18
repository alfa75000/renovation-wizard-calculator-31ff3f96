
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
    
    // Liste des tables principales que nous souhaitons explorer
    const mainTables = [
      'work_types',
      'service_groups',
      'services',
      'clients',
      'client_types',
      'menuiseries_types',
      'rooms',
      'room_custom_items',
      'projects'
    ];
    
    const tablesData = [];
    
    for (const tableName of mainTables) {
      try {
        // Récupérer un échantillon de données pour déterminer la structure de la table
        const { data: sampleData, error } = await supabase
          .from(tableName)
          .select('*')
          .limit(1);
        
        if (error) {
          console.warn(`La table ${tableName} n'existe pas ou n'est pas accessible:`, error);
          continue;
        }
        
        if (sampleData && sampleData.length > 0) {
          // Extraire les colonnes à partir de l'échantillon
          const columns = Object.keys(sampleData[0]).map(name => ({ 
            name, 
            type: typeof sampleData[0][name]
          }));
          
          tablesData.push({
            name: tableName,
            columns
          });
        } else {
          // Table existe mais est vide
          tablesData.push({
            name: tableName,
            columns: [],
            note: "Table vide"
          });
        }
      } catch (tableError) {
        console.error(`Erreur lors de l'analyse de la table ${tableName}:`, tableError);
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

    // Récupérer les infos de la base de données
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
