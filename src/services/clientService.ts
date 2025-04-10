
import { v4 as uuidv4 } from 'uuid';
import { Client } from '@/types';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

/**
 * Create or retrieve a default client for projects with no client selected
 */
export const getDefaultClient = async (): Promise<Client> => {
  try {
    // Check if default client already exists
    const { data: existingClients, error: searchError } = await supabase
      .from('clients')
      .select('*')
      .eq('nom', 'Client à définir')
      .maybeSingle();
    
    if (searchError) {
      console.error('Erreur lors de la recherche du client par défaut:', searchError);
      throw searchError;
    }
    
    // If default client exists, return it
    if (existingClients) {
      return existingClients as Client;
    }
    
    // Create a default client if it doesn't exist
    const defaultClient: Client = {
      id: uuidv4(),
      nom: 'Client à définir',
      prenom: '',
      adresse: '',
      codePostal: '',
      ville: '',
      telephone: '',
      email: '',
      typeClient: 'particulier',
    };
    
    const { data: newClient, error: createError } = await supabase
      .from('clients')
      .insert(defaultClient)
      .select()
      .single();
    
    if (createError) {
      console.error('Erreur lors de la création du client par défaut:', createError);
      throw createError;
    }
    
    return newClient as Client;
  } catch (error) {
    console.error('Exception lors de la création/récupération du client par défaut:', error);
    toast.error('Erreur lors de la création du client par défaut');
    
    // Return a local default client as fallback (not saved to DB)
    return {
      id: 'default-client-local',
      nom: 'Client à définir',
      prenom: '',
      adresse: '',
      codePostal: '',
      ville: '',
      telephone: '',
      email: '',
      typeClient: 'particulier',
    };
  }
};
