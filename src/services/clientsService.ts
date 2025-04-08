
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
    
    if (!data || !Array.isArray(data)) {
      console.error('[clientsService] Données de clients invalides:', data);
      return [];
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
    }));
    
    return clients;
  } catch (error) {
    console.error('[clientsService] Exception lors de la récupération des clients:', error);
    throw error;
  }
};

/**
 * Crée un nouveau client dans Supabase
 */
export const createClient = async (client: Client): Promise<Client | null> => {
  try {
    console.log('[clientsService] Création d\'un client dans Supabase', client);
    
    // Transformer le client au format de la table Supabase
    const supabaseClient = {
      // Retirer l'ID pour laisser Supabase le générer automatiquement
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
    
    // Insérer le client dans la base de données
    const { error: insertError, data: insertData } = await supabase
      .from('clients')
      .insert(supabaseClient)
      .select();
      
    if (insertError) {
      console.error('[clientsService] Erreur lors de la création du client:', insertError);
      throw insertError;
    }
    
    if (!insertData || insertData.length === 0) {
      console.error('[clientsService] Aucune donnée retournée après l\'insertion');
      return null;
    }
    
    const newClient = insertData[0];
    console.log('[clientsService] Client créé avec succès:', newClient);
    
    // Retourner le client créé au format Client
    return {
      id: newClient.id,
      nom: newClient.nom || '',
      prenom: newClient.prenom || '',
      adresse: newClient.adresse || '',
      telephone: newClient.tel1 || '',
      codePostal: newClient.code_postal || '',
      ville: newClient.ville || '',
      email: newClient.email || '',
      tel1: newClient.tel1 || '',
      tel2: newClient.tel2 || '',
      typeClient: newClient.client_type_id || 'particulier',
      autreInfo: newClient.autre_info || '',
      infosComplementaires: newClient.infos_complementaires || '',
    };
  } catch (error) {
    console.error('[clientsService] Exception lors de la création du client:', error);
    throw error;
  }
};

/**
 * Met à jour un client existant dans Supabase
 */
export const updateClient = async (id: string, client: Partial<Client>): Promise<Client | null> => {
  try {
    console.log(`[clientsService] Mise à jour du client ${id} dans Supabase`, client);
    
    if (!id) {
      console.error('[clientsService] ID de client manquant pour la mise à jour');
      return null;
    }
    
    // Transformer le client au format de la table Supabase
    const supabaseClient: Record<string, any> = {};
    
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
    
    // Mise à jour du client dans la base de données
    const { error: updateError, data: updateData } = await supabase
      .from('clients')
      .update(supabaseClient)
      .eq('id', id)
      .select();
      
    if (updateError) {
      console.error('[clientsService] Erreur lors de la mise à jour du client:', updateError);
      throw updateError;
    }
    
    if (!updateData || updateData.length === 0) {
      console.error('[clientsService] Aucune donnée retournée après la mise à jour');
      
      // Essayer de récupérer le client mis à jour
      const { data: retrievedClient, error: retrieveError } = await supabase
        .from('clients')
        .select('*')
        .eq('id', id)
        .single();
        
      if (retrieveError || !retrievedClient) {
        console.error('[clientsService] Impossible de récupérer le client après la mise à jour:', retrieveError);
        return null;
      }
      
      updateData[0] = retrievedClient;
    }
    
    const updatedClient = updateData[0];
    console.log('[clientsService] Client mis à jour avec succès:', updatedClient);
    
    // Retourner le client mis à jour au format Client
    return {
      id: updatedClient.id,
      nom: updatedClient.nom || '',
      prenom: updatedClient.prenom || '',
      adresse: updatedClient.adresse || '',
      telephone: updatedClient.tel1 || '',
      codePostal: updatedClient.code_postal || '',
      ville: updatedClient.ville || '',
      email: updatedClient.email || '',
      tel1: updatedClient.tel1 || '',
      tel2: updatedClient.tel2 || '',
      typeClient: updatedClient.client_type_id || 'particulier',
      autreInfo: updatedClient.autre_info || '',
      infosComplementaires: updatedClient.infos_complementaires || '',
    };
  } catch (error) {
    console.error('[clientsService] Exception lors de la mise à jour du client:', error);
    throw error;
  }
};

/**
 * Supprime un client dans Supabase
 */
export const deleteClient = async (id: string): Promise<boolean> => {
  try {
    console.log(`[clientsService] Suppression du client ${id} dans Supabase`);
    
    if (!id) {
      console.error('[clientsService] ID de client manquant pour la suppression');
      return false;
    }
    
    const { error } = await supabase
      .from('clients')
      .delete()
      .eq('id', id);
      
    if (error) {
      console.error('[clientsService] Erreur lors de la suppression du client:', error);
      throw error;
    }
    
    console.log('[clientsService] Client supprimé avec succès');
    return true;
  } catch (error) {
    console.error('[clientsService] Exception lors de la suppression du client:', error);
    throw error;
  }
};

/**
 * Récupère les types de clients depuis Supabase
 */
export interface ClientType {
  id: string;
  name: string;
}

export const fetchClientTypes = async (): Promise<ClientType[]> => {
  try {
    console.log('[clientsService] Récupération des types de clients depuis Supabase');
    const { data, error } = await supabase
      .from('client_types')
      .select('*')
      .order('name', { ascending: true });
      
    if (error) {
      console.error('[clientsService] Erreur lors de la récupération des types de clients:', error);
      throw error;
    }
    
    return data as ClientType[];
  } catch (error) {
    console.error('[clientsService] Exception lors de la récupération des types de clients:', error);
    throw error;
  }
};
