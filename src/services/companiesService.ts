
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

export type Company = {
  id: string;
  name: string;
  prenom: string;
  email: string;
  tel1: string;
  tel2: string;
  address: string;
  city: string;
  postal_code: string;
  type: string;
  capital_social: string;
  siret: string;
  tva_intracom: string;
  code_ape: string;
  slogan: string;
  notes: string;
};

export const fetchCompanies = async (): Promise<Company[]> => {
  try {
    const { data, error } = await supabase
      .from('companies')
      .select('*')
      .order('name');
    
    if (error) {
      console.error('Erreur lors de la récupération des sociétés:', error);
      toast.error('Impossible de charger les sociétés');
      return [];
    }
    
    return data.map(item => ({
      id: item.id,
      name: item.name,
      prenom: item.prenom || '',
      email: item.email || '',
      tel1: item.tel1 || '',
      tel2: item.tel2 || '',
      address: item.address || '',
      city: item.city || '',
      postal_code: item.postal_code || '',
      type: item.type || '',
      capital_social: item.capital_social || '',
      siret: item.siret || '',
      tva_intracom: item.tva_intracom || '',
      code_ape: item.code_ape || '',
      slogan: item.slogan || '',
      notes: item.notes || ''
    }));
  } catch (error) {
    console.error('Exception lors de la récupération des sociétés:', error);
    toast.error('Une erreur est survenue lors du chargement des sociétés');
    return [];
  }
};

export const createCompany = async (companyData: Omit<Company, 'id'>): Promise<Company | null> => {
  try {
    const { data, error } = await supabase
      .from('companies')
      .insert([companyData])
      .select()
      .single();
    
    if (error) {
      console.error('Erreur lors de la création de la société:', error);
      toast.error('Impossible de créer la société');
      return null;
    }
    
    return {
      id: data.id,
      name: data.name,
      prenom: data.prenom || '',
      email: data.email || '',
      tel1: data.tel1 || '',
      tel2: data.tel2 || '',
      address: data.address || '',
      city: data.city || '',
      postal_code: data.postal_code || '',
      type: data.type || '',
      capital_social: data.capital_social || '',
      siret: data.siret || '',
      tva_intracom: data.tva_intracom || '',
      code_ape: data.code_ape || '',
      slogan: data.slogan || '',
      notes: data.notes || ''
    };
  } catch (error) {
    console.error('Exception lors de la création de la société:', error);
    toast.error('Une erreur est survenue lors de la création de la société');
    return null;
  }
};

export const updateCompany = async (id: string, companyData: Omit<Company, 'id'>): Promise<Company | null> => {
  try {
    const { data, error } = await supabase
      .from('companies')
      .update(companyData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Erreur lors de la mise à jour de la société:', error);
      toast.error('Impossible de mettre à jour la société');
      return null;
    }
    
    return {
      id: data.id,
      name: data.name,
      prenom: data.prenom || '',
      email: data.email || '',
      tel1: data.tel1 || '',
      tel2: data.tel2 || '',
      address: data.address || '',
      city: data.city || '',
      postal_code: data.postal_code || '',
      type: data.type || '',
      capital_social: data.capital_social || '',
      siret: data.siret || '',
      tva_intracom: data.tva_intracom || '',
      code_ape: data.code_ape || '',
      slogan: data.slogan || '',
      notes: data.notes || ''
    };
  } catch (error) {
    console.error('Exception lors de la mise à jour de la société:', error);
    toast.error('Une erreur est survenue lors de la mise à jour de la société');
    return null;
  }
};

export const deleteCompany = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('companies')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Erreur lors de la suppression de la société:', error);
      toast.error('Impossible de supprimer la société');
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Exception lors de la suppression de la société:', error);
    toast.error('Une erreur est survenue lors de la suppression de la société');
    return false;
  }
};
