
import { createClient } from '@supabase/supabase-js';

// Ces valeurs sont celles que vous avez fournies
export const SUPABASE_URL = 'https://gofmlbehbkccqmktsvvb.supabase.co';
export const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdvZm1sYmVoYmtjY3Fta3RzdnZiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQwMzkwNTIsImV4cCI6MjA1OTYxNTA1Mn0.rR80Q8b2WMeZuDsrobagnVp58b-Fl0XzCOTwn4f-2Ag';

// Initialisation du client Supabase
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Fonction utilitaire pour vérifier la connexion
export const checkSupabaseConnection = async () => {
  try {
    // Tenter une requête simple
    const { data, error } = await supabase.from('work_types').select('*').limit(1);
    
    if (error) {
      console.error('Erreur de connexion à Supabase:', error);
      return {
        connected: false,
        error: error.message,
        details: error
      };
    }
    
    return {
      connected: true,
      data
    };
  } catch (error) {
    console.error('Exception lors de la connexion à Supabase:', error);
    return {
      connected: false,
      error: "Exception inattendue lors de la connexion"
    };
  }
};
