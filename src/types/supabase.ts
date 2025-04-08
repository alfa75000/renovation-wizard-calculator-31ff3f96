
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
};

export type RoomMenuiserie = {
  id: string;
  created_at: string;
  room_id: string;
  menuiserie_type_id: string;
  quantity: number;
  width: number;
  height: number;
  surface_impactee: SurfaceImpactee;
  impacte_plinthe: boolean;
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
