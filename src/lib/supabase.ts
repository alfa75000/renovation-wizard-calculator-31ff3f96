
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
      'room_custom_items', // Changé de room_custom_surfaces à room_custom_items
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

// Fonction pour vérifier et générer le SQL nécessaire à la création/modification des tables
export const checkAndGenerateRequiredTablesSQL = async () => {
  try {
    console.log("Vérification des tables nécessaires...");
    
    // Liste des tables principales que nous avons besoin
    const requiredTables = [
      'projects',
      'rooms',
      'room_works',
      'room_menuiseries',
      'room_custom_items',
    ];
    
    const tableDefinitions = {};
    const missingTables = [];
    
    // Vérifier chaque table
    for (const tableName of requiredTables) {
      try {
        // Tenter de récupérer la structure de la table
        const { data, error } = await supabase
          .from(tableName)
          .select('*')
          .limit(1);
        
        if (error) {
          console.warn(`La table ${tableName} n'existe pas ou n'est pas accessible:`, error);
          missingTables.push(tableName);
        } else {
          // Récupérer les colonnes si des données existent
          if (data && data.length > 0) {
            tableDefinitions[tableName] = Object.keys(data[0]);
          } else {
            // Table existe mais est vide
            const { data: emptyTableData, error: describeError } = await supabase
              .rpc('get_table_definition', { table_name: tableName });
            
            if (describeError) {
              console.warn(`Impossible de décrire la table ${tableName}:`, describeError);
            } else {
              tableDefinitions[tableName] = emptyTableData || "Table vide, structure inconnue";
            }
          }
        }
      } catch (tableError) {
        console.error(`Erreur lors de l'analyse de la table ${tableName}:`, tableError);
      }
    }
    
    // Générer le SQL pour les tables manquantes ou à modifier
    let sqlScript = '';
    
    // SQL pour projects si manquant
    if (missingTables.includes('projects')) {
      sqlScript += `
-- Table des projets
CREATE TABLE public.projects (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone,
  name text NOT NULL,
  client_id uuid REFERENCES public.clients(id),
  description text,
  property_type text DEFAULT 'Appartement',
  floors integer DEFAULT 1,
  total_area numeric DEFAULT 0,
  rooms_count integer DEFAULT 0,
  ceiling_height numeric DEFAULT 2.5,
  PRIMARY KEY (id)
);

`;
    } else if (tableDefinitions.projects) {
      console.log("Structure existante de la table projects:", tableDefinitions.projects);
    }
    
    // SQL pour rooms si manquant
    if (missingTables.includes('rooms')) {
      sqlScript += `
-- Table des pièces
CREATE TABLE public.rooms (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  project_id uuid NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  name text NOT NULL,
  custom_name text,
  type text DEFAULT 'Pièce',
  width numeric DEFAULT 0,
  length numeric DEFAULT 0,
  height numeric DEFAULT 2.5,
  surface numeric DEFAULT 0,
  plinth_height numeric DEFAULT 0,
  type_sol text,
  type_mur text,
  wall_surface_raw numeric DEFAULT 0,
  total_plinth_length numeric DEFAULT 0,
  total_plinth_surface numeric DEFAULT 0,
  menuiseries_murs_surface numeric DEFAULT 0,
  menuiseries_plafond_surface numeric DEFAULT 0,
  menuiseries_sol_surface numeric DEFAULT 0,
  autres_surfaces_murs numeric DEFAULT 0,
  autres_surfaces_plafond numeric DEFAULT 0,
  autres_surfaces_sol numeric DEFAULT 0,
  net_wall_surface numeric DEFAULT 0,
  surface_nette_murs numeric DEFAULT 0,
  surface_nette_sol numeric DEFAULT 0,
  surface_nette_plafond numeric DEFAULT 0,
  surface_brute_sol numeric DEFAULT 0,
  surface_brute_plafond numeric DEFAULT 0,
  surface_brute_murs numeric DEFAULT 0,
  surface_menuiseries numeric DEFAULT 0,
  total_menuiserie_surface numeric DEFAULT 0,
  lineaire_brut numeric DEFAULT 0,
  lineaire_net numeric DEFAULT 0,
  PRIMARY KEY (id)
);

`;
    } else if (tableDefinitions.rooms) {
      console.log("Structure existante de la table rooms:", tableDefinitions.rooms);
    }
    
    // SQL pour room_works si manquant
    if (missingTables.includes('room_works')) {
      sqlScript += `
-- Table des travaux par pièce
CREATE TABLE public.room_works (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  room_id uuid NOT NULL REFERENCES public.rooms(id) ON DELETE CASCADE,
  type_travaux_id text,
  type_travaux_label text,
  sous_type_id text,
  sous_type_label text,
  menuiserie_id uuid,
  description text,
  quantite numeric DEFAULT 0,
  unite text DEFAULT 'm²',
  prix_fournitures numeric DEFAULT 0,
  prix_main_oeuvre numeric DEFAULT 0,
  taux_tva numeric DEFAULT 20,
  commentaire text,
  personnalisation text,
  type_travaux text,
  sous_type text,
  surface_impactee text,
  PRIMARY KEY (id)
);

`;
    } else if (tableDefinitions.room_works) {
      console.log("Structure existante de la table room_works:", tableDefinitions.room_works);
    }
    
    // SQL pour room_menuiseries si manquant
    if (missingTables.includes('room_menuiseries')) {
      sqlScript += `
-- Table des menuiseries par pièce
CREATE TABLE public.room_menuiseries (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  room_id uuid NOT NULL REFERENCES public.rooms(id) ON DELETE CASCADE,
  menuiserie_type_id uuid REFERENCES public.menuiseries_types(id),
  type text,
  name text,
  largeur numeric DEFAULT 0,
  hauteur numeric DEFAULT 0,
  quantity integer DEFAULT 1,
  surface numeric DEFAULT 0,
  surface_impactee text DEFAULT 'Mur',
  PRIMARY KEY (id)
);

`;
    } else if (tableDefinitions.room_menuiseries) {
      console.log("Structure existante de la table room_menuiseries:", tableDefinitions.room_menuiseries);
    }
    
    // SQL pour room_custom_items si manquant
    if (missingTables.includes('room_custom_items')) {
      sqlScript += `
-- Table des éléments personnalisés par pièce
CREATE TABLE public.room_custom_items (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  room_id uuid NOT NULL REFERENCES public.rooms(id) ON DELETE CASCADE,
  type text,
  name text,
  designation text,
  largeur numeric DEFAULT 0,
  hauteur numeric DEFAULT 0,
  surface numeric DEFAULT 0,
  quantity integer DEFAULT 1,
  surface_impactee text DEFAULT 'Mur',
  adjustment_type text DEFAULT 'Ajouter',
  impacte_plinthe boolean DEFAULT false,
  description text,
  est_deduction boolean DEFAULT false,
  PRIMARY KEY (id)
);

`;
    } else if (tableDefinitions.room_custom_items) {
      console.log("Structure existante de la table room_custom_items:", tableDefinitions.room_custom_items);
    }
    
    return {
      tableDefinitions,
      missingTables,
      sqlScript
    };
  } catch (error) {
    console.error('Exception lors de la vérification des tables nécessaires:', error);
    return { error: "Exception lors de la vérification" };
  }
};
