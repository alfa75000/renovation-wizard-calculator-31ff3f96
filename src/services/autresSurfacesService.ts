import { supabase } from "@/lib/supabase";
import { TypeAutreSurface } from "@/types";

// Fonction pour créer un nouveau type d'autre surface
export const createAutreSurfaceType = async (typeData: TypeAutreSurface): Promise<TypeAutreSurface | null> => {
  try {
    const { data, error } = await supabase
      .from('autre_surface_types')
      .insert([
        {
          name: typeData.nom,
          description: typeData.description,
          surface_impactee: typeData.surfaceImpacteeParDefaut,
          adjustment_type: typeData.estDeduction ? 'Déduire' : 'Ajouter',
          largeur: typeData.largeur,
          hauteur: typeData.hauteur,
          impacte_plinthe: typeData.impactePlinthe,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Erreur lors de la création du type d'autre surface:", error);
      return null;
    }

    return {
      id: data.id,
      nom: data.name,
      description: data.description,
      surfaceImpacteeParDefaut: data.surface_impactee,
      estDeduction: data.adjustment_type === 'Déduire',
      largeur: data.largeur,
      hauteur: data.hauteur,
      impactePlinthe: data.impacte_plinthe,
    };
  } catch (error) {
    console.error("Erreur lors de la création du type d'autre surface:", error);
    return null;
  }
};

// Fonction pour mettre à jour un type d'autre surface existant
export const updateAutreSurfaceType = async (id: string, typeData: TypeAutreSurface): Promise<TypeAutreSurface | null> => {
  try {
    const { data, error } = await supabase
      .from('autre_surface_types')
      .update({
        name: typeData.nom,
        description: typeData.description,
        surface_impactee: typeData.surfaceImpacteeParDefaut,
        adjustment_type: typeData.estDeduction ? 'Déduire' : 'Ajouter',
        largeur: typeData.largeur,
        hauteur: typeData.hauteur,
        impacte_plinthe: typeData.impactePlinthe,
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error("Erreur lors de la mise à jour du type d'autre surface:", error);
      return null;
    }

    return {
      id: data.id,
      nom: data.name,
      description: data.description,
      surfaceImpacteeParDefaut: data.surface_impactee,
      estDeduction: data.adjustment_type === 'Déduire',
      largeur: data.largeur,
      hauteur: data.hauteur,
      impactePlinthe: data.impacte_plinthe,
    };
  } catch (error) {
    console.error("Erreur lors de la mise à jour du type d'autre surface:", error);
    return null;
  }
};

// Fonction pour supprimer un type d'autre surface
export const deleteAutreSurfaceType = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('autre_surface_types')
      .delete()
      .eq('id', id);

    if (error) {
      console.error("Erreur lors de la suppression du type d'autre surface:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Erreur lors de la suppression du type d'autre surface:", error);
    return false;
  }
};

// Fonction pour récupérer tous les types d'autres surfaces
export const fetchAutresSurfacesTypes = async (): Promise<TypeAutreSurface[]> => {
  try {
    const { data, error } = await supabase
      .from('autre_surface_types')
      .select('*');

    if (error) {
      console.error("Erreur lors de la récupération des types d'autres surfaces:", error);
      return [];
    }

    return data.map(item => ({
      id: item.id,
      nom: item.name,
      description: item.description,
      surfaceImpacteeParDefaut: item.surface_impactee,
      estDeduction: item.adjustment_type === 'Déduire',
      largeur: item.largeur,
      hauteur: item.hauteur,
      impactePlinthe: item.impacte_plinthe,
    }));
  } catch (error) {
    console.error("Erreur lors de la récupération des types d'autres surfaces:", error);
    return [];
  }
};
