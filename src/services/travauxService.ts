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
  }
): Promise<Service | null> => {
  try {
    const { data, error } = await supabase
      .from('services')
      .update(service)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Erreur lors de la mise à jour du service:', error);
      toast.error('Erreur lors de la mise à jour du service');
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Exception lors de la mise à jour du service:', error);
    toast.error('Erreur lors de la mise à jour du service');
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
