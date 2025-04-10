
import { supabase } from '@/lib/supabase';
import { format } from 'date-fns';

/**
 * Génère un numéro de devis au format AAMM-X
 * Exemple: 2504-1 pour le premier devis d'avril 2025
 */
export const generateDevisNumber = async (): Promise<string> => {
  // Obtenir l'année et le mois courant au format AAMM
  const currentDate = new Date();
  const yearMonth = format(currentDate, 'yyMM');
  
  // Récupérer tous les numéros de devis existants pour ce mois
  const { data, error } = await supabase
    .from('projects_save')
    .select('devis_number')
    .like('devis_number', `${yearMonth}-%`);
  
  if (error) {
    console.error('Erreur lors de la récupération des numéros de devis:', error);
    throw error;
  }
  
  // Analyser les numéros pour trouver le numéro le plus élevé
  let maxNumber = 0;
  
  data?.forEach(project => {
    if (project.devis_number) {
      const parts = project.devis_number.split('-');
      if (parts.length === 2) {
        const num = parseInt(parts[1], 10);
        if (!isNaN(num) && num > maxNumber) {
          maxNumber = num;
        }
      }
    }
  });
  
  // Créer un nouveau numéro en incrémentant
  const newNumber = maxNumber + 1;
  return `${yearMonth}-${newNumber}`;
};

/**
 * Vérifie si un numéro de devis est unique
 */
export const isDevisNumberUnique = async (devisNumber: string): Promise<boolean> => {
  const { data, error } = await supabase
    .from('projects_save')
    .select('id')
    .eq('devis_number', devisNumber)
    .maybeSingle();
  
  if (error) {
    console.error('Erreur lors de la vérification du numéro de devis:', error);
    throw error;
  }
  
  return !data; // Retourne true si aucun projet n'est trouvé avec ce numéro
};

/**
 * Obtient un client par défaut
 * Retourne le premier client de type "À définir" ou le premier client disponible
 */
export const getDefaultClient = async (): Promise<string | null> => {
  try {
    // Rechercher d'abord un client avec le type "À définir"
    const { data: clientTypes } = await supabase
      .from('client_types')
      .select('id')
      .eq('name', 'À définir')
      .maybeSingle();

    if (clientTypes?.id) {
      const { data: defaultClients } = await supabase
        .from('clients')
        .select('id')
        .eq('client_type_id', clientTypes.id)
        .limit(1);

      if (defaultClients && defaultClients.length > 0) {
        return defaultClients[0].id;
      }
    }

    // Si aucun client "À définir", retourner le premier client disponible
    const { data: anyClient } = await supabase
      .from('clients')
      .select('id')
      .limit(1);

    return anyClient && anyClient.length > 0 ? anyClient[0].id : null;
  } catch (error) {
    console.error('Erreur lors de la récupération du client par défaut:', error);
    return null;
  }
};
