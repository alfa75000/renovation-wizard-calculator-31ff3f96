
import { supabase } from '@/lib/supabase';
import { Client } from '@/types';

/**
 * Récupère tous les clients depuis Supabase
 */
export const fetchClients = async (): Promise<Client[]> => {
  try {
    console.log('[clientsService] Récupération des clients depuis Supabase');
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .order('nom', { ascending: true });
      
    if (error) {
      console.error('[clientsService] Erreur lors de la récupération des clients:', error);
      throw error;
    }
    
    // Transformer les données de Supabase au format Client
    const clients: Client[] = data.map(client => ({
      id: client.id,
      nom: client.nom || '',
      prenom: client.prenom || '',
      adresse: client.adresse || '',
      telephone: client.tel1 || '', // Mapping tel1 vers telephone pour compatibilité
      codePostal: client.code_postal || '',
      ville: client.ville || '',
      email: client.email || '',
      tel1: client.tel1 || '',
      tel2: client.tel2 || '',
      typeClient: client.client_type_id || 'particulier', // Utilisation de client_type_id
      autreInfo: client.autre_info || '',
      infosComplementaires: client.infos_complementaires || '',
      created_at: client.created_at
    }));
    
    return clients;
  } catch (error) {
    console.error('[clientsService] Exception lors de la récupération des clients:', error);
    return [];
  }
};

/**
 * Crée un nouveau client dans Supabase
 */
export const createClient = async (client: Client): Promise<Client | null> => {
  try {
    console.log('[clientsService] Création d\'un client dans Supabase');
    
    // Transformer le client au format de la table Supabase
    const supabaseClient = {
      id: client.id,
      nom: client.nom,
      prenom: client.prenom,
      adresse: client.adresse,
      code_postal: client.codePostal,
      ville: client.ville,
      tel1: client.tel1 || client.telephone, // Utiliser tel1 ou telephone
      tel2: client.tel2,
      email: client.email,
      client_type_id: client.typeClient,
      autre_info: client.autreInfo,
      infos_complementaires: client.infosComplementaires
    };
    
    const { data, error } = await supabase
      .from('clients')
      .insert(supabaseClient)
      .select()
      .single();
      
    if (error) {
      console.error('[clientsService] Erreur lors de la création du client:', error);
      throw error;
    }
    
    // Retourner le client créé au format Client
    return {
      id: data.id,
      nom: data.nom || '',
      prenom: data.prenom || '',
      adresse: data.adresse || '',
      telephone: data.tel1 || '',
      codePostal: data.code_postal || '',
      ville: data.ville || '',
      email: data.email || '',
      tel1: data.tel1 || '',
      tel2: data.tel2 || '',
      typeClient: data.client_type_id || 'particulier',
      autreInfo: data.autre_info || '',
      infosComplementaires: data.infos_complementaires || '',
      created_at: data.created_at
    };
  } catch (error) {
    console.error('[clientsService] Exception lors de la création du client:', error);
    return null;
  }
};

/**
 * Met à jour un client existant dans Supabase
 */
export const updateClient = async (id: string, client: Partial<Client>): Promise<Client | null> => {
  try {
    console.log(`[clientsService] Mise à jour du client ${id} dans Supabase`);
    
    // Transformer le client au format de la table Supabase
    const supabaseClient: any = {};
    
    // Mapper uniquement les champs modifiés
    if (client.nom !== undefined) supabaseClient.nom = client.nom;
    if (client.prenom !== undefined) supabaseClient.prenom = client.prenom;
    if (client.adresse !== undefined) supabaseClient.adresse = client.adresse;
    if (client.codePostal !== undefined) supabaseClient.code_postal = client.codePostal;
    if (client.ville !== undefined) supabaseClient.ville = client.ville;
    if (client.tel1 !== undefined) supabaseClient.tel1 = client.tel1;
    if (client.tel2 !== undefined) supabaseClient.tel2 = client.tel2;
    if (client.telephone !== undefined) supabaseClient.tel1 = client.telephone; // Compatibilité
    if (client.email !== undefined) supabaseClient.email = client.email;
    if (client.typeClient !== undefined) supabaseClient.client_type_id = client.typeClient;
    if (client.autreInfo !== undefined) supabaseClient.autre_info = client.autreInfo;
    if (client.infosComplementaires !== undefined) supabaseClient.infos_complementaires = client.infosComplementaires;
    
    const { data, error } = await supabase
      .from('clients')
      .update(supabaseClient)
      .eq('id', id)
      .select()
      .single();
      
    if (error) {
      console.error('[clientsService] Erreur lors de la mise à jour du client:', error);
      throw error;
    }
    
    // Retourner le client mis à jour au format Client
    return {
      id: data.id,
      nom: data.nom || '',
      prenom: data.prenom || '',
      adresse: data.adresse || '',
      telephone: data.tel1 || '',
      codePostal: data.code_postal || '',
      ville: data.ville || '',
      email: data.email || '',
      tel1: data.tel1 || '',
      tel2: data.tel2 || '',
      typeClient: data.client_type_id || 'particulier',
      autreInfo: data.autre_info || '',
      infosComplementaires: data.infos_complementaires || '',
      created_at: data.created_at
    };
  } catch (error) {
    console.error('[clientsService] Exception lors de la mise à jour du client:', error);
    return null;
  }
};

/**
 * Supprime un client dans Supabase
 */
export const deleteClient = async (id: string): Promise<boolean> => {
  try {
    console.log(`[clientsService] Suppression du client ${id} dans Supabase`);
    
    const { error } = await supabase
      .from('clients')
      .delete()
      .eq('id', id);
      
    if (error) {
      console.error('[clientsService] Erreur lors de la suppression du client:', error);
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error('[clientsService] Exception lors de la suppression du client:', error);
    return false;
  }
};
