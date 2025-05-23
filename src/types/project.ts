
// Types liés aux projets et propriétés

// Propriété principale
export interface Property {
  type: string;
  floors: number;
  totalArea: number;
  rooms: number;
  ceilingHeight: number;
}

// Projet Chantier
export interface ProjetChantier {
  id: string;
  nom: string;
  adresse: string;
  codePostal: string;
  ville: string;
  clientId: string;
  dateDebut: string;
  dateFin: string;
  description: string;
  statut: "en_attente" | "en_cours" | "termine";
  montantTotal: number;
  nomProjet?: string;
  dateModification?: string;
  projectData?: any;
  occupant?: string;
  infoComplementaire?: string;
}

// Project Supabase
export interface Project {
  id: string;
  name: string;
  client_id: string | null;
  description: string;
  address: string;
  postal_code: string;
  city: string;
  occupant: string;
  property_type: string;
  floors: number;
  total_area: number;
  rooms_count: number;
  ceiling_height: number;
  created_at: string;
  updated_at: string;
  devis_number?: string;
  general_data?: ProjectGeneralData;
}

// Données générales du projet
export interface ProjectGeneralData {
  infoComplementaire?: string;
  dateDevis?: string;
  clientsData?: string; // Nouveau champ pour les données clients
  [key: string]: any;
}

// Interface pour les données de la société
export interface CompanyData {
  id: string; // Changé de optionnel à obligatoire
  name: string;
  capital_social: string;
  address: string;
  postal_code: string;
  city: string;
  siret: string;
  code_ape: string;
  tva_intracom: string;
  logo_url?: string;
  tel1?: string;
  tel2?: string;
  email?: string;
  slogan?: string;
}

// Métadonnées du projet
export interface ProjectMetadata {
  clientId: string;
  nomProjet: string;
  descriptionProjet: string;
  adresseChantier: string;
  occupant: string;
  infoComplementaire: string;
  dateDevis: string;
  devisNumber: string;
  clientsData?: string;
  company?: CompanyData;
}

// On importe Room et Travail pour éviter les erreurs de référence circulaire
import { Room } from './room';
import { Travail } from './travaux';

// États du contexte
export interface ProjectState {
  property: Property;
  rooms: Room[];
  travaux: Travail[];
  metadata: ProjectMetadata;
}

export interface ProjetChantierState {
  projets: ProjetChantier[];
  projetActif?: ProjetChantier | null;
}

// Actions pour ProjectContext
export type ProjectAction =
  | { type: 'UPDATE_PROPERTY'; payload: Partial<Property> }
  | { type: 'ADD_ROOM'; payload: Room }
  | { type: 'UPDATE_ROOM'; payload: { id: string; room: Room } }
  | { type: 'DELETE_ROOM'; payload: string }
  | { type: 'RESET_PROJECT' }
  | { type: 'LOAD_PROJECT'; payload: ProjectState }
  | { type: 'ADD_TRAVAIL'; payload: Travail }
  | { type: 'UPDATE_TRAVAIL'; payload: { id: string; travail: Travail } }
  | { type: 'DELETE_TRAVAIL'; payload: string }
  | { type: 'SAVE_PROJECT'; payload?: { projectId?: string } }
  | { type: 'LOAD_PROJECT_FROM_SUPABASE'; payload: { projectId: string } }
  | { type: 'UPDATE_METADATA'; payload: Partial<ProjectMetadata> };

// Actions pour les projets chantier
export type ProjetChantierAction =
  | { type: 'ADD_PROJET'; payload: ProjetChantier }
  | { type: 'UPDATE_PROJET'; payload: { id: string; projet: ProjetChantier } }
  | { type: 'DELETE_PROJET'; payload: string }
  | { type: 'SET_PROJET_ACTIF'; payload: string | null }
  | { type: 'LOAD_PROJETS'; payload: ProjetChantier[] }
  | { type: 'RESET_PROJETS' };
