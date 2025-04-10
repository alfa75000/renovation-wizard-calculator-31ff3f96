
/**
 * @deprecated Ce fichier est maintenu pour des raisons de compatibilité.
 * Utilisez plutôt import { supabase } from '@/integrations/supabase/client'
 */

import { 
  supabase,
  checkSupabaseConnection,
  getDatabaseInfo,
  SUPABASE_URL,
  SUPABASE_ANON_KEY
} from '@/integrations/supabase/client';

export {
  supabase,
  checkSupabaseConnection,
  getDatabaseInfo,
  SUPABASE_URL,
  SUPABASE_ANON_KEY
};
