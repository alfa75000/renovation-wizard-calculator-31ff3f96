import { supabase } from '@/lib/supabase';
import { WorkType, ServiceGroup, Service } from '@/types/supabase';
import { toast } from 'sonner';

// Récupérer tous les types de travaux
export const fetchWorkTypes = async (): Promise<WorkType[]> => {
  try {
    console.log("Début fetchWorkTypes - Tentative de récupération des types de travaux");
    
    const { data, error } = await supabase
      .from('work_types')
      .select('*')
      .order('name', { ascending: true });
    
    // Log détaillé pour debug
    console.log("Résultat de la requête work_types:", { 
      data, 
      error, 
      dataLength: data?.length || 0,
      firstItem: data && data.length > 0 ? data[0] : null
    });
    
    if (error) {
      console.error('Erreur lors de la récupération des types de travaux:', error);
      toast.error('Erreur lors de la récupération des types de travaux');
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('Exception lors de la récupération des types de travaux:', error);
    toast.error('Erreur lors de la récupération des types de travaux');
    return [];
  }
};

// Récupérer les groupes de services pour un type de travail - SIMPLIFIÉ
export const fetchServiceGroups = async (workTypeId: string): Promise<ServiceGroup[]> => {
  try {
    console.log(`Récupération des groupes de services pour le type de travail ${workTypeId}`);
    
    const { data, error } = await supabase
      .from('service_groups')
      .select('*')
      .eq('work_type_id', workTypeId)
      .order('name', { ascending: true });
    
    console.log("Résultat de la requête service_groups:", { 
      data, 
      error, 
      dataLength: data?.length || 0
    });
    
    if (error) {
      console.error('Erreur lors de la récupération des groupes de services:', error);
      toast.error('Erreur lors de la récupération des sous-catégories');
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('Exception lors de la récupération des groupes de services:', error);
    toast.error('Erreur lors de la récupération des sous-catégories');
    return [];
  }
};

// Récupérer les services pour un groupe - SIMPLIFIÉ
export const fetchServices = async (groupId: string): Promise<Service[]> => {
  try {
    console.log(`Récupération des services pour le groupe ${groupId}`);
    
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('group_id', groupId)
      .order('name', { ascending: true });
    
    console.log("Résultat de la requête services:", { 
      data, 
      error, 
      dataLength: data?.length || 0
    });
    
    if (error) {
      console.error('Erreur lors de la récupération des services:', error);
      toast.error('Erreur lors de la récupération des prestations');
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('Exception lors de la récupération des services:', error);
    toast.error('Erreur lors de la récupération des prestations');
    return [];
  }
};

// Récupérer un service par son ID
export const fetchServiceById = async (serviceId: string): Promise<Service | null> => {
  try {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('id', serviceId)
      .single();
    
    if (error) {
      console.error('Erreur lors de la récupération du service:', error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Exception lors de la récupération du service:', error);
    return null;
  }
};

// Créer un nouveau type de travaux
export const createWorkType = async (name: string): Promise<WorkType | null> => {
  try {
    const { data, error } = await supabase
      .from('work_types')
      .insert([{ name }])
      .select()
      .single();
    
    if (error) {
      console.error('Erreur lors de la création du type de travaux:', error);
      toast.error('Erreur lors de la création du type de travaux');
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Exception lors de la création du type de travaux:', error);
    toast.error('Erreur lors de la création du type de travaux');
    return null;
  }
};

// Mettre à jour un type de travaux
export const updateWorkType = async (id: string, name: string): Promise<WorkType | null> => {
  try {
    const { data, error } = await supabase
      .from('work_types')
      .update({ name })
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Erreur lors de la mise à jour du type de travaux:', error);
      toast.error('Erreur lors de la mise à jour du type de travaux');
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Exception lors de la mise à jour du type de travaux:', error);
    toast.error('Erreur lors de la mise à jour du type de travaux');
    return null;
  }
};

// Supprimer un type de travaux
export const deleteWorkType = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('work_types')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Erreur lors de la suppression du type de travaux:', error);
      toast.error('Erreur lors de la suppression du type de travaux');
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Exception lors de la suppression du type de travaux:', error);
    toast.error('Erreur lors de la suppression du type de travaux');
    return false;
  }
};

// Créer un nouveau groupe de services
export const createServiceGroup = async (name: string, workTypeId: string): Promise<ServiceGroup | null> => {
  try {
    const { data, error } = await supabase
      .from('service_groups')
      .insert([{ name, work_type_id: workTypeId }])
      .select()
      .single();
    
    if (error) {
      console.error('Erreur lors de la création du groupe de services:', error);
      toast.error('Erreur lors de la création du groupe de services');
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Exception lors de la création du groupe de services:', error);
    toast.error('Erreur lors de la création du groupe de services');
    return null;
  }
};

// Mettre à jour un groupe de services
export const updateServiceGroup = async (id: string, name: string): Promise<ServiceGroup | null> => {
  try {
    const { data, error } = await supabase
      .from('service_groups')
      .update({ name })
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Erreur lors de la mise à jour du groupe de services:', error);
      toast.error('Erreur lors de la mise à jour du groupe de services');
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Exception lors de la mise à jour du groupe de services:', error);
    toast.error('Erreur lors de la mise à jour du groupe de services');
    return null;
  }
};

// Supprimer un groupe de services
export const deleteServiceGroup = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('service_groups')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Erreur lors de la suppression du groupe de services:', error);
      toast.error('Erreur lors de la suppression du groupe de services');
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Exception lors de la suppression du groupe de services:', error);
    toast.error('Erreur lors de la suppression du groupe de services');
    return false;
  }
};

// Créer un nouveau service
export const createService = async (
  service: {
    name: string;
    description?: string;
    labor_price: number;
    supply_price: number;
    group_id: string;
  }
): Promise<Service | null> => {
  try {
    const { data, error } = await supabase
      .from('services')
      .insert([service])
      .select()
      .single();
    
    if (error) {
      console.error('Erreur lors de la création du service:', error);
      toast.error('Erreur lors de la création du service');
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Exception lors de la création du service:', error);
    toast.error('Erreur lors de la création du service');
    return null;
  }
};

// Mettre à jour un service
export const updateService = async (
  id: string,
  service: {
    name?: string;
    description?: string | null;
    labor_price?: number;
    supply_price?: number;
    unit?: string;
    surface_impactee?: string;
    last_update_date?: string;
  }
): Promise<Service | null> => {
  try {
    // Validation des données requises
    if (service.name !== undefined && service.name.trim() === '') {
      console.error("Validation échec: nom vide");
      toast.error('Le nom du service ne peut pas être vide');
      return null;
    }

    if (service.labor_price !== undefined && (isNaN(service.labor_price) || service.labor_price < 0)) {
      console.error("Validation échec: prix main d'oeuvre invalide");
      toast.error('Le prix de main d\'œuvre doit être un nombre positif');
      return null;
    }

    if (service.supply_price !== undefined && (isNaN(service.supply_price) || service.supply_price < 0)) {
      console.error("Validation échec: prix fournitures invalide");
      toast.error('Le prix des fournitures doit être un nombre positif');
      return null;
    }

    // Générer la date de dernière mise à jour au format "mois année"
    const date = new Date();
    const month = date.toLocaleString('fr-FR', { month: 'long' });
    const year = date.getFullYear();
    
    // Ajouter la date de mise à jour au service
    const updatedService = {
      ...service,
      last_update_date: `${month} ${year}`
    };

    console.log("Mise à jour du service avec ID:", id);
    console.log("Données envoyées:", updatedService);
    
    const { data, error } = await supabase
      .from('services')
      .update(updatedService)
      .eq('id', id)
      .select();
    
    if (error) {
      console.error('Erreur Supabase lors de la mise à jour du service:', error);
      toast.error(`Erreur lors de la mise à jour du service: ${error.message || 'Erreur inconnue'}`);
      return null;
    }
    
    if (!data || data.length === 0) {
      console.warn('Aucune donnée retournée après la mise à jour du service');
      toast.error('Aucune modification effectuée. Le service n\'existe peut-être plus.');
      return null;
    }
    
    console.log("Service mis à jour avec succès:", data[0]);
    return data[0];
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
    console.error('Exception lors de la mise à jour du service:', error);
    toast.error(`Erreur lors de la mise à jour du service: ${errorMessage}`);
    return null;
  }
};

// Supprimer un service
export const deleteService = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('services')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Erreur lors de la suppression du service:', error);
      toast.error('Erreur lors de la suppression du service');
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Exception lors de la suppression du service:', error);
    toast.error('Erreur lors de la suppression du service');
    return false;
  }
};

// Créer un service en copiant un existant avec des modifications
export const cloneServiceWithChanges = async (
  existingServiceId: string,
  changes: Partial<Omit<Service, 'id' | 'created_at'>>
): Promise<Service | null> => {
  try {
    console.log("--- DEBUG: Début cloneServiceWithChanges ---");
    console.log("--- DEBUG: existingServiceId:", existingServiceId);
    console.log("--- DEBUG: changes:", changes);
    
    // Récupérer le service existant
    const existingService = await fetchServiceById(existingServiceId);
    if (!existingService) {
      console.error("--- DEBUG: Service original non trouvé ---");
      toast.error('Service original non trouvé');
      return null;
    }
    
    console.log("--- DEBUG: Service existant récupéré:", existingService);

    // Validation des données requises
    const name = changes.name || existingService.name;
    if (name.trim() === '') {
      console.error("--- DEBUG: Nom de service vide ---");
      toast.error('Le nom du service ne peut pas être vide');
      return null;
    }

    const labor_price = changes.labor_price ?? existingService.labor_price;
    if (isNaN(labor_price) || labor_price < 0) {
      console.error("--- DEBUG: Prix main d'œuvre invalide ---");
      toast.error('Le prix de main d\'œuvre doit être un nombre positif');
      return null;
    }

    const supply_price = changes.supply_price ?? existingService.supply_price;
    if (isNaN(supply_price) || supply_price < 0) {
      console.error("--- DEBUG: Prix fournitures invalide ---");
      toast.error('Le prix des fournitures doit être un nombre positif');
      return null;
    }
    
    // Générer la date de mise à jour
    const date = new Date();
    const month = date.toLocaleString('fr-FR', { month: 'long' });
    const year = date.getFullYear();
    const last_update_date = `${month} ${year}`;
    
    // Créer un nouveau service en combinant l'existant avec les changements
    const newService = {
      name,
      description: changes.description ?? existingService.description,
      labor_price,
      supply_price,
      unit: changes.unit ?? existingService.unit,
      surface_impactee: changes.surface_impactee ?? existingService.surface_impactee,
      group_id: existingService.group_id,
      last_update_date
    };
    
    console.log("--- DEBUG: Nouveau service à créer:", newService);
    
    // Tenter de créer le service dans Supabase
    const { data, error } = await supabase
      .from('services')
      .insert([newService])
      .select();
    
    console.log("--- DEBUG: Réponse de Supabase après création:", { data, error });
    
    if (error) {
      console.error('--- DEBUG: Erreur Supabase lors de la création du service:', error);
      toast.error(`Erreur lors de la création du service: ${error.message || 'Erreur inconnue'}`);
      return null;
    }
    
    if (!data || data.length === 0) {
      console.warn('--- DEBUG: Aucune donnée retournée après la création du service ---');
      toast.error('Échec de la création du service');
      return null;
    }
    
    console.log("--- DEBUG: Nouveau service créé avec succès:", data[0]);
    return data[0];
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
    console.error('--- DEBUG: Exception lors de la création du service:', error);
    toast.error(`Erreur lors de la création du service: ${errorMessage}`);
    return null;
  }
};
