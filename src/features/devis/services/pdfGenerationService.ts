
import { SurfaceImpactee } from "@/types";

// Types pour les champs imprimables
export interface PrintableField {
  id: string;
  name: string;
  enabled: boolean;
  content?: string | null;
}

// Types pour les informations de la société
export interface CompanyInfo {
  id: string;
  name: string;
  logo_url?: string | null;
  address?: string | null;
  postal_code?: string | null;
  city?: string | null;
  tel1?: string | null;
  tel2?: string | null;
  email?: string | null;
  siret?: string | null;
  tva_intracom?: string | null;
  capital_social?: string | null;
  code_ape?: string | null;
  slogan?: string | null;
}

// Configuration pour les PDF
export const PDF_CONFIG = {
  DARK_BLUE: "#002855", // Couleur principale 
  DEFAULT_FONT_SIZE: 10,
  COLUMN1_WIDTH: 25, // Largeur de la première colonne pour l'alignement
  LOGO_PATH: "/lrs_logo.jpg"
};

// Formater une date pour l'affichage
export const formatDate = (dateString: string | undefined) => {
  if (!dateString) return "";
  
  try {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day} / ${month} / ${year}`;
  } catch (e) {
    return dateString;
  }
};

// Utilitaire pour convertir une surface impactée en texte lisible
export const surfaceImpacteeToText = (surfaceImpactee: SurfaceImpactee | string): string => {
  const mapping: Record<string, string> = {
    'Mur': 'Mur',
    'mur': 'Mur',
    'Plafond': 'Plafond',
    'plafond': 'Plafond',
    'Sol': 'Sol',
    'sol': 'Sol',
    'Aucune': 'Aucune'
  };
  
  return mapping[surfaceImpactee] || surfaceImpactee;
};
