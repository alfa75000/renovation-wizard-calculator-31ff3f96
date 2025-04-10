
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

// Type Surface pour Supabase enum type_surface_enum
export type SurfaceImpactee = 'Mur' | 'Plafond' | 'Sol' | 'Aucune';

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
  // Champs de compatibilité avec l'ancien modèle
  largeur?: number;
  hauteur?: number;
  surface_impactee?: SurfaceImpactee;
  surface?: number;
  name?: string;
  type?: string;
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
  autre_info: string | null;
  infos_complementaires: string | null;
  // Champs de compatibilité avec l'ancien modèle
  name?: string;
  first_name?: string;
  phone?: string;
  address?: string;
  postal_code?: string;
  city?: string;
  notes?: string;
};

export type ClientType = {
  id: string;
  created_at: string;
  name: string;
};

export type AdjustmentType = 'Ajouter' | 'Déduire';

// Type pour la table room_custom_items (autres surfaces)
export type RoomCustomItem = {
  id: string;
  created_at: string;
  room_id: string;
  name: string;
  hauteur: number;
  largeur: number;
  quantity: number;
  surface_impactee: SurfaceImpactee;
  adjustment_type: AdjustmentType;
  impacte_plinthe: boolean;
  description: string | null;
  updated_at: string;
  source_type_id?: string | null;
  // Champs calculés ou ajoutés pour compatibilité
  type: string;
  designation: string;
  surface: number;
  // Champs de compatibilité avec l'ancien modèle
  estDeduction?: boolean;
  surfaceImpactee?: string;
};

// Type pour la table projects
export type Project = {
  id: string;
  name: string;
  client_id: string;
  property_type: string | null;
  floors: number | null;
  total_area: number | null;
  ceiling_height: number | null;
  status: string | null;
  created_at: string;
  updated_at: string;
  // Champs ajoutés pour compatibilité avec le modèle existant
  description?: string;
  address?: string;
  postal_code?: string;
  city?: string;
  occupant?: string;
  rooms_count?: number;
};

// Type pour la table rooms
export type Room = {
  id: string;
  name: string;
  project_id: string;
  type: string | null;
  surface: number | null;
  ceiling_surface: number | null;
  floor_surface: number | null;
  wall_surface: number | null;
  wall_height: number | null;
  perimeter: number | null;
  created_at: string;
  updated_at: string;
  // Champs ajoutés pour compatibilité avec le modèle existant
  custom_name?: string;
  width?: number;
  length?: number;
  height?: number;
  plinth_height?: number;
  type_sol?: string;
  type_mur?: string;
  menuiseries?: RoomMenuiserie[];
  autresSurfaces?: RoomCustomItem[];
  // Champs calculés
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
};

// Type pour la table room_works
export type RoomWork = {
  id: string;
  room_id: string;
  service_id: string;
  quantity: number;
  description_override: string | null;
  labor_price_override: number | null;
  supply_price_override: number | null;
  unit: string | null;
  vat_rate: number | null;
  created_at: string;
  updated_at: string;
  // Champs ajoutés pour compatibilité
  type_travaux_id?: string;
  type_travaux_label?: string;
  sous_type_id?: string;
  sous_type_label?: string;
  menuiserie_id?: string;
  description?: string;
  commentaire?: string;
  personnalisation?: string;
  type_travaux?: string;
  sous_type?: string;
  surface_impactee?: string;
  // Champs mappés pour compatibilité
  pieceId?: string;
  quantite?: number;
  unite?: string;
  prixFournitures?: number;
  prixMainOeuvre?: number;
  tauxTVA?: number;
};
