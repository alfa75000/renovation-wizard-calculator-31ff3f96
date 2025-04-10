
import { 
  supabase, 
  SUPABASE_URL, 
  SUPABASE_ANON_KEY, 
  checkSupabaseConnection, 
  getDatabaseInfo,
  getTableInfo,
  fromDynamic 
} from '@/integrations/supabase/client';

// Ce fichier sert de couche de compatibilité pour les anciens imports
// Il redirige simplement vers le nouveau client Supabase

export { 
  supabase, 
  SUPABASE_URL, 
  SUPABASE_ANON_KEY, 
  checkSupabaseConnection, 
  getDatabaseInfo,
  getTableInfo,
  fromDynamic 
};

export default supabase;
