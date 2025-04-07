import { supabase } from '@/lib/supabase';
import { WorkType, ServiceGroup, Service } from '@/types/supabase';
import { toast } from 'sonner';

// Récupérer tous les types de travaux
export const fetchWorkTypes = async (): Promise<WorkType[]> => {
  try {
    // Vérifions d'abord quelles colonnes sont disponibles
    const { data: columnsData, error: columnsError } = await supabase
      .from('work_types')
      .select('*')
      .limit(1);
    
    console.log("Colonnes de work_types:", columnsData ? Object.keys(columnsData[0] || {}) : 'Aucune donnée');
    
    if (columnsError) {
      console.error('Erreur lors de la vérification des colonnes de work_types:', columnsError);
      toast.error('Erreur lors de la récupération des types de travaux');
      return [];
    }
    
    // Déterminer le nom de la colonne (name ou Name)
    const nameColumn = columnsData && columnsData[0] && 'Name' in columnsData[0] ? 'Name' : 'name';
    
    // Utiliser le nom de colonne correct
    const { data, error } = await supabase
      .from('work_types')
      .select('*')
      .order(nameColumn, { ascending: true });
    
    if (error) {
      console.error('Erreur lors de la récupération des types de travaux:', error);
      toast.error('Erreur lors de la récupération des types de travaux');
      return [];
    }
    
    // Si la colonne est "Name", transformons-la en "name" pour la cohérence
    const formattedData = data.map(item => {
      if ('Name' in item) {
        return {
          ...item,
          name: item.Name,
        };
      }
      return item;
    });
    
    return formattedData;
  } catch (error) {
    console.error('Exception lors de la récupération des types de travaux:', error);
    toast.error('Erreur lors de la récupération des types de travaux');
    return [];
  }
};

// Récupérer les groupes de services pour un type de travail
export const fetchServiceGroups = async (workTypeId: string): Promise<ServiceGroup[]> => {
  try {
    // Vérifions d'abord quelles colonnes sont disponibles
    const { data: columnsData, error: columnsError } = await supabase
      .from('service_groups')
      .select('*')
      .limit(1);
    
    console.log("Colonnes de service_groups:", columnsData ? Object.keys(columnsData[0] || {}) : 'Aucune donnée');
    
    if (columnsError) {
      console.error('Erreur lors de la vérification des colonnes de service_groups:', columnsError);
      toast.error('Erreur lors de la récupération des sous-catégories');
      return [];
    }
    
    // Déterminer les noms des colonnes
    const nameColumn = columnsData && columnsData[0] && 'Name' in columnsData[0] ? 'Name' : 'name';
    const workTypeIdColumn = columnsData && columnsData[0] && 'work_type_id' in columnsData[0] ? 'work_type_id' : 
      columnsData && columnsData[0] && 'work_type_ID' in columnsData[0] ? 'work_type_ID' : 'work_type_id';
    
    // Utiliser les noms de colonnes corrects
    const { data, error } = await supabase
      .from('service_groups')
      .select('*')
      .eq(workTypeIdColumn, workTypeId)
      .order(nameColumn, { ascending: true });
    
    if (error) {
      console.error('Erreur lors de la récupération des groupes de services:', error);
      toast.error('Erreur lors de la récupération des sous-catégories');
      return [];
    }
    
    // Formater les données pour assurer la cohérence
    const formattedData = data.map(item => {
      const formattedItem: any = { ...item };
      
      if ('Name' in item) {
        formattedItem.name = item.Name;
      }
      
      if ('work_type_ID' in item) {
        formattedItem.work_type_id = item.work_type_ID;
      }
      
      return formattedItem as ServiceGroup;
    });
    
    return formattedData;
  } catch (error) {
    console.error('Exception lors de la récupération des groupes de services:', error);
    toast.error('Erreur lors de la récupération des sous-catégories');
    return [];
  }
};

// Récupérer les services pour un groupe
export const fetchServices = async (groupId: string): Promise<Service[]> => {
  try {
    // Vérifions d'abord quelles colonnes sont disponibles
    const { data: columnsData, error: columnsError } = await supabase
      .from('services')
      .select('*')
      .limit(1);
    
    console.log("Colonnes de services:", columnsData ? Object.keys(columnsData[0] || {}) : 'Aucune donnée');
    
    if (columnsError) {
      console.error('Erreur lors de la vérification des colonnes de services:', columnsError);
      toast.error('Erreur lors de la récupération des prestations');
      return [];
    }
    
    // Déterminer les noms des colonnes
    const nameColumn = columnsData && columnsData[0] && 'Name' in columnsData[0] ? 'Name' : 'name';
    const groupIdColumn = columnsData && columnsData[0] && 'group_id' in columnsData[0] ? 'group_id' : 
      columnsData && columnsData[0] && 'group_ID' in columnsData[0] ? 'group_ID' : 'group_id';
    
    // Utiliser les noms de colonnes corrects
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq(groupIdColumn, groupId)
      .order(nameColumn, { ascending: true });
    
    if (error) {
      console.error('Erreur lors de la récupération des services:', error);
      toast.error('Erreur lors de la récupération des prestations');
      return [];
    }
    
    // Formater les données pour assurer la cohérence
    const formattedData = data.map(item => {
      const formattedItem: any = { ...item };
      
      if ('Name' in item) {
        formattedItem.name = item.Name;
      }
      
      if ('Description' in item) {
        formattedItem.description = item.Description;
      }
      
      if ('labor_price' in item === false && 'Labor_price' in item) {
        formattedItem.labor_price = item.Labor_price;
      }
      
      if ('supply_price' in item === false && 'Supply_price' in item) {
        formattedItem.supply_price = item.Supply_price;
      }
      
      if ('group_ID' in item) {
        formattedItem.group_id = item.group_ID;
      }
      
      return formattedItem as Service;
    });
    
    return formattedData;
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
