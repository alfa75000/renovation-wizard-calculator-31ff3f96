
import { v4 as uuidv4 } from 'uuid';
import { Client } from '@/types';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

/**
 * Crée ou récupère un client par défaut pour les projets sans client sélectionné
 * Cette fonction s'assure qu'un client "Client à définir" existe toujours dans la base de données
 */
export const getDefaultClient = async (): Promise<Client> => {
  try {
    // Vérifier si un client par défaut existe déjà
    const { data: existingClients, error: searchError } = await supabase
      .from('clients')
      .select('*')
      .eq('nom', 'Client à définir')
      .maybeSingle();
    
    if (searchError) {
      console.error('Erreur lors de la recherche du client par défaut:', searchError);
      throw new Error('Impossible de vérifier l\'existence du client par défaut');
    }
    
    // Si le client par défaut existe, le retourner
    if (existingClients) {
      console.log('Client par défaut trouvé:', existingClients);
      return existingClients as Client;
    }
    
    console.log('Aucun client par défaut trouvé, création en cours...');
    
    // ID du type client "particulier"
    const PARTICULAR_CLIENT_TYPE_ID = '4b3375f8-af78-455f-be8c-1d506df4f753';
    
    // Créer un client par défaut s'il n'existe pas
    const defaultClient: Client = {
      id: uuidv4(),
      nom: 'Client à définir',
      prenom: '',
      adresse: '',
      codePostal: '',
      ville: '',
      telephone: '',
      email: '',
      typeClient: PARTICULAR_CLIENT_TYPE_ID, // Utiliser l'ID exact du type "particulier"
    };
    
    const { data: newClient, error: createError } = await supabase
      .from('clients')
      .insert(defaultClient)
      .select()
      .single();
    
    if (createError) {
      console.error('Erreur lors de la création du client par défaut:', createError);
      throw new Error('Impossible de créer le client par défaut');
    }
    
    console.log('Client par défaut créé avec succès:', newClient);
    return newClient as Client;
  } catch (error) {
    console.error('Exception lors de la création/récupération du client par défaut:', error);
    toast.error('Erreur critique: Impossible de créer ou récupérer le client par défaut');
    throw new Error('Échec de la création ou récupération du client par défaut');
  }
};
