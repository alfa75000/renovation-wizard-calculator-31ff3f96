
import { supabase } from '@/lib/supabase';
import { format } from 'date-fns';

/**
 * Génère un numéro de devis au format AAMM-X
 * Exemple: 2504-1 pour le premier devis d'avril 2025
 */
export const generateDevisNumber = async (): Promise<string> => {
  console.log('Génération d\'un nouveau numéro de devis');
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
  const generatedNumber = `${yearMonth}-${newNumber}`;
  console.log('Numéro de devis généré:', generatedNumber);
  return generatedNumber;
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
