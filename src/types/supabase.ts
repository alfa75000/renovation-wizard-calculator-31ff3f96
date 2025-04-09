
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
  largeur?: number;
  hauteur?: number;
  surface_impactee?: string;
  menuiserie_type?: MenuiserieType;
};

export type Client = {
  id: string;
  created_at: string;
  name: string;
  first_name: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  city: string | null;
  postal_code: string | null;
  client_type_id: string;
  notes: string | null;
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
};
