
// Types pour l'intégration avec Supabase

export type WorkType = {
  id: string;
  created_at: string;
  name: string;
};

export type ServiceGroup = {
  id: string;
  created_at: string;
  name: string;
  work_type_id: string;
};

// Type Surface pour Supabase enum type_surface_enum ('Mur', 'Plafond', 'Sol', 'Aucune')
export type SurfaceImpactee = 'Mur' | 'Plafond' | 'Sol' | 'Aucune';

// Type pour les ajustements - enum adjustment_enum ('Ajouter', 'Déduire')
export type AdjustmentType = 'Ajouter' | 'Déduire';

export type Service = {
  id: string;
  created_at: string;
  name: string;
  description: string | null;
  labor_price: number;
  supply_price: number;
  group_id: string;
  surface_impactee: SurfaceImpactee;
  unit?: string; // Pour compatibilité avec le code existant
};

export type MenuiserieType = {
  id: string;
  created_at: string;
  name: string;
  largeur: number;
  hauteur: number;
  surface_impactee: SurfaceImpactee;
  impacte_plinthe: boolean;
  description?: string | null;
};

export type RoomMenuiserie = {
  id: string;
  created_at: string;
  room_id: string;
  menuiserie_type_id: string;
  quantity: number;
  width_override?: number;
  height_override?: number;
  notes?: string | null;
  updated_at: string;
  menuiserie_type?: MenuiserieType;
  // Propriétés calculées ou issues de menuiserie_type
  largeur?: number;
  hauteur?: number;
  surface?: number;
  surface_impactee?: SurfaceImpactee;
};

export type Client = {
  id: string;
  created_at: string;
  nom: string;
  prenom: string | null;
  email: string | null;
  tel1: string | null;
  tel2: string | null;
  adresse: string | null;
  ville: string | null;
  code_postal: string | null;
  client_type_id: string;
  infos_complementaires: string | null;
  autre_info: string | null;
};

export type ClientType = {
  id: string;
  created_at: string;
  name: string;
};

// Type pour la table room_custom_items
export type RoomCustomItem = {
  id: string;
  created_at: string;
  updated_at: string;
  room_id: string;
  type: string;
  name: string;
  designation: string | null;
  largeur: number;
  hauteur: number;
  surface: number;
  quantity: number;
  surface_impactee: SurfaceImpactee;
  adjustment_type: AdjustmentType;
  impacte_plinthe: boolean;
  description: string | null;
  source_type_id?: string | null;
};

// Type pour la table autres_surfaces_types
export type AutreSurfaceType = {
  id: string;
  created_at: string;
  name: string;
  description: string | null;
  largeur: number;
  hauteur: number;
  surface_impactee: SurfaceImpactee;
  adjustment_type: AdjustmentType;
  impacte_plinthe: boolean;
};

// Type pour les travaux de pièce
export type RoomWork = {
  id: string;
  created_at: string;
  updated_at: string;
  room_id: string;
  service_id: string;
  quantity: number;
  unit: string | null;
  labor_price_override: number | null;
  supply_price_override: number | null;
  description_override: string | null;
  vat_rate: number;
  // Champs supplémentaires pour les travaux personnalisés
  type_travaux_id?: string;
  type_travaux_label?: string;
  sous_type_id?: string;
  sous_type_label?: string;
  menuiserie_id?: string;
  personnalisation?: string;
  type_travaux?: string;
  sous_type?: string;
  surface_impactee?: string;
};

// Type pour la table projects
export type Project = {
  id: string;
  name: string;
  description?: string;
  address?: string;
  postal_code?: string;
  city?: string;
  occupant?: string;
  client_id: string | null;
  property_type: string | null;
  floors: number | null;
  total_area: number | null;
  rooms_count?: number | null;
  ceiling_height: number | null;
  status?: string;
  created_at: string;
  updated_at: string;
};

// Type pour la table rooms
export type Room = {
  id: string;
  project_id: string;
  name: string;
  custom_name?: string | null;
  type: string | null;
  width?: number | null;
  length?: number | null;
  height?: number | null;
  perimeter?: number | null;
  surface?: number | null;
  wall_height?: number | null;
  wall_surface?: number | null;
  floor_surface?: number | null;
  ceiling_surface?: number | null;
  plinth_height?: number | null;
  type_sol?: string | null;
  type_mur?: string | null;
  menuiseries?: RoomMenuiserie[];
  custom_items?: RoomCustomItem[];
  created_at: string;
  updated_at: string;
  // Valeurs calculées supplémentaires pour la compatibilité
  wall_surface_raw?: number;
  total_plinth_length?: number;
  total_plinth_surface?: number;
  menuiseries_murs_surface?: number;
  menuiseries_plafond_surface?: number;
  menuiseries_sol_surface?: number;
  autres_surfaces_murs?: number;
  autres_surfaces_plafond?: number;
  autres_surfaces_sol?: number;
  net_wall_surface?: number;
  surface_nette_murs?: number;
  surface_nette_sol?: number;
  surface_nette_plafond?: number;
  surface_brute_sol?: number;
  surface_brute_plafond?: number;
  surface_brute_murs?: number;
  surface_menuiseries?: number;
  total_menuiserie_surface?: number;
  lineaire_brut?: number;
  lineaire_net?: number;
  autresSurfaces?: any[];
};
