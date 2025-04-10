export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      autres_surfaces_types: {
        Row: {
          adjustment_type: Database["public"]["Enums"]["adjustment_enum"]
          created_at: string
          description: string | null
          hauteur: number
          id: string
          impacte_plinthe: boolean
          largeur: number
          name: string
          surface_impactee: Database["public"]["Enums"]["type_surface_enum"]
        }
        Insert: {
          adjustment_type?: Database["public"]["Enums"]["adjustment_enum"]
          created_at?: string
          description?: string | null
          hauteur: number
          id?: string
          impacte_plinthe?: boolean
          largeur: number
          name: string
          surface_impactee: Database["public"]["Enums"]["type_surface_enum"]
        }
        Update: {
          adjustment_type?: Database["public"]["Enums"]["adjustment_enum"]
          created_at?: string
          description?: string | null
          hauteur?: number
          id?: string
          impacte_plinthe?: boolean
          largeur?: number
          name?: string
          surface_impactee?: Database["public"]["Enums"]["type_surface_enum"]
        }
        Relationships: []
      }
      client_types: {
        Row: {
          created_at: string
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      clients: {
        Row: {
          adresse: string | null
          autre_info: string | null
          client_type_id: string
          code_postal: string | null
          created_at: string
          email: string | null
          id: string
          infos_complementaires: string | null
          nom: string
          prenom: string | null
          tel1: string | null
          tel2: string | null
          ville: string | null
        }
        Insert: {
          adresse?: string | null
          autre_info?: string | null
          client_type_id: string
          code_postal?: string | null
          created_at?: string
          email?: string | null
          id?: string
          infos_complementaires?: string | null
          nom: string
          prenom?: string | null
          tel1?: string | null
          tel2?: string | null
          ville?: string | null
        }
        Update: {
          adresse?: string | null
          autre_info?: string | null
          client_type_id?: string
          code_postal?: string | null
          created_at?: string
          email?: string | null
          id?: string
          infos_complementaires?: string | null
          nom?: string
          prenom?: string | null
          tel1?: string | null
          tel2?: string | null
          ville?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "clients_client_type_id_fkey"
            columns: ["client_type_id"]
            isOneToOne: false
            referencedRelation: "client_types"
            referencedColumns: ["id"]
          },
        ]
      }
      menuiseries_types: {
        Row: {
          created_at: string
          description: string | null
          hauteur: number
          id: string
          impacte_plinthe: boolean
          largeur: number
          name: string
          surface_impactee: Database["public"]["Enums"]["type_surface_enum"]
        }
        Insert: {
          created_at?: string
          description?: string | null
          hauteur: number
          id?: string
          impacte_plinthe?: boolean
          largeur: number
          name: string
          surface_impactee: Database["public"]["Enums"]["type_surface_enum"]
        }
        Update: {
          created_at?: string
          description?: string | null
          hauteur?: number
          id?: string
          impacte_plinthe?: boolean
          largeur?: number
          name?: string
          surface_impactee?: Database["public"]["Enums"]["type_surface_enum"]
        }
        Relationships: []
      }
      projects: {
        Row: {
          ceiling_height: number | null
          client_id: string
          created_at: string
          floors: number | null
          id: string
          name: string
          property_type: string | null
          rooms_count: number | null
          status: string | null
          total_area: number | null
          updated_at: string
        }
        Insert: {
          ceiling_height?: number | null
          client_id: string
          created_at?: string
          floors?: number | null
          id?: string
          name: string
          property_type?: string | null
          rooms_count?: number | null
          status?: string | null
          total_area?: number | null
          updated_at?: string
        }
        Update: {
          ceiling_height?: number | null
          client_id?: string
          created_at?: string
          floors?: number | null
          id?: string
          name?: string
          property_type?: string | null
          rooms_count?: number | null
          status?: string | null
          total_area?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "projects_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      room_custom_items: {
        Row: {
          adjustment_type: Database["public"]["Enums"]["adjustment_enum"]
          created_at: string
          description: string | null
          hauteur: number
          id: string
          impacte_plinthe: boolean
          largeur: number
          name: string
          quantity: number
          room_id: string
          source_type_id: string | null
          surface_impactee: Database["public"]["Enums"]["type_surface_enum"]
          updated_at: string
        }
        Insert: {
          adjustment_type: Database["public"]["Enums"]["adjustment_enum"]
          created_at?: string
          description?: string | null
          hauteur: number
          id?: string
          impacte_plinthe: boolean
          largeur: number
          name: string
          quantity?: number
          room_id: string
          source_type_id?: string | null
          surface_impactee: Database["public"]["Enums"]["type_surface_enum"]
          updated_at?: string
        }
        Update: {
          adjustment_type?: Database["public"]["Enums"]["adjustment_enum"]
          created_at?: string
          description?: string | null
          hauteur?: number
          id?: string
          impacte_plinthe?: boolean
          largeur?: number
          name?: string
          quantity?: number
          room_id?: string
          source_type_id?: string | null
          surface_impactee?: Database["public"]["Enums"]["type_surface_enum"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "room_custom_items_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "room_custom_items_source_type_id_fkey"
            columns: ["source_type_id"]
            isOneToOne: false
            referencedRelation: "autres_surfaces_types"
            referencedColumns: ["id"]
          },
        ]
      }
      room_custom_surfaces: {
        Row: {
          created_at: string | null
          designation: string | null
          est_deduction: boolean | null
          hauteur: number
          id: string
          largeur: number
          name: string
          quantity: number | null
          room_id: string | null
          surface: number | null
          surface_impactee: string | null
          type: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          designation?: string | null
          est_deduction?: boolean | null
          hauteur: number
          id?: string
          largeur: number
          name: string
          quantity?: number | null
          room_id?: string | null
          surface?: number | null
          surface_impactee?: string | null
          type?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          designation?: string | null
          est_deduction?: boolean | null
          hauteur?: number
          id?: string
          largeur?: number
          name?: string
          quantity?: number | null
          room_id?: string | null
          surface?: number | null
          surface_impactee?: string | null
          type?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "room_custom_surfaces_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      room_menuiseries: {
        Row: {
          created_at: string
          hauteur: number | null
          height_override: number | null
          id: string
          largeur: number | null
          menuiserie_type_id: string
          name: string | null
          notes: string | null
          quantity: number
          room_id: string
          surface: number | null
          surface_impactee: string | null
          type: string | null
          updated_at: string
          width_override: number | null
        }
        Insert: {
          created_at?: string
          hauteur?: number | null
          height_override?: number | null
          id?: string
          largeur?: number | null
          menuiserie_type_id: string
          name?: string | null
          notes?: string | null
          quantity?: number
          room_id: string
          surface?: number | null
          surface_impactee?: string | null
          type?: string | null
          updated_at?: string
          width_override?: number | null
        }
        Update: {
          created_at?: string
          hauteur?: number | null
          height_override?: number | null
          id?: string
          largeur?: number | null
          menuiserie_type_id?: string
          name?: string | null
          notes?: string | null
          quantity?: number
          room_id?: string
          surface?: number | null
          surface_impactee?: string | null
          type?: string | null
          updated_at?: string
          width_override?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "room_menuiseries_menuiserie_type_id_fkey"
            columns: ["menuiserie_type_id"]
            isOneToOne: false
            referencedRelation: "menuiseries_types"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "room_menuiseries_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      room_works: {
        Row: {
          commentaire: string | null
          created_at: string
          description: string | null
          description_override: string | null
          id: string
          labor_price_override: number | null
          menuiserie_id: string | null
          personnalisation: string | null
          prix_fournitures: number | null
          prix_main_oeuvre: number | null
          quantite: number | null
          quantity: number
          room_id: string
          service_id: string
          sous_type: string | null
          sous_type_id: string | null
          sous_type_label: string | null
          supply_price_override: number | null
          surface_impactee: string | null
          taux_tva: number | null
          type_travaux: string | null
          type_travaux_id: string | null
          type_travaux_label: string | null
          unit: string | null
          unite: string | null
          updated_at: string
          vat_rate: number | null
        }
        Insert: {
          commentaire?: string | null
          created_at?: string
          description?: string | null
          description_override?: string | null
          id?: string
          labor_price_override?: number | null
          menuiserie_id?: string | null
          personnalisation?: string | null
          prix_fournitures?: number | null
          prix_main_oeuvre?: number | null
          quantite?: number | null
          quantity?: number
          room_id: string
          service_id: string
          sous_type?: string | null
          sous_type_id?: string | null
          sous_type_label?: string | null
          supply_price_override?: number | null
          surface_impactee?: string | null
          taux_tva?: number | null
          type_travaux?: string | null
          type_travaux_id?: string | null
          type_travaux_label?: string | null
          unit?: string | null
          unite?: string | null
          updated_at?: string
          vat_rate?: number | null
        }
        Update: {
          commentaire?: string | null
          created_at?: string
          description?: string | null
          description_override?: string | null
          id?: string
          labor_price_override?: number | null
          menuiserie_id?: string | null
          personnalisation?: string | null
          prix_fournitures?: number | null
          prix_main_oeuvre?: number | null
          quantite?: number | null
          quantity?: number
          room_id?: string
          service_id?: string
          sous_type?: string | null
          sous_type_id?: string | null
          sous_type_label?: string | null
          supply_price_override?: number | null
          surface_impactee?: string | null
          taux_tva?: number | null
          type_travaux?: string | null
          type_travaux_id?: string | null
          type_travaux_label?: string | null
          unit?: string | null
          unite?: string | null
          updated_at?: string
          vat_rate?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "room_works_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "room_works_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      rooms: {
        Row: {
          autres_surfaces_murs: number | null
          autres_surfaces_plafond: number | null
          autres_surfaces_sol: number | null
          ceiling_surface: number | null
          created_at: string
          custom_name: string | null
          floor_surface: number | null
          height: number | null
          id: string
          length: number | null
          lineaire_brut: number | null
          lineaire_net: number | null
          menuiseries_murs_surface: number | null
          menuiseries_plafond_surface: number | null
          menuiseries_sol_surface: number | null
          name: string
          net_wall_surface: number | null
          perimeter: number | null
          plinth_height: number | null
          project_id: string
          surface: number | null
          surface_brute_murs: number | null
          surface_brute_plafond: number | null
          surface_brute_sol: number | null
          surface_menuiseries: number | null
          surface_nette_murs: number | null
          surface_nette_plafond: number | null
          surface_nette_sol: number | null
          total_menuiserie_surface: number | null
          total_plinth_length: number | null
          total_plinth_surface: number | null
          type: string | null
          type_mur: string | null
          type_sol: string | null
          updated_at: string
          wall_height: number | null
          wall_surface: number | null
          wall_surface_raw: number | null
          width: number | null
        }
        Insert: {
          autres_surfaces_murs?: number | null
          autres_surfaces_plafond?: number | null
          autres_surfaces_sol?: number | null
          ceiling_surface?: number | null
          created_at?: string
          custom_name?: string | null
          floor_surface?: number | null
          height?: number | null
          id?: string
          length?: number | null
          lineaire_brut?: number | null
          lineaire_net?: number | null
          menuiseries_murs_surface?: number | null
          menuiseries_plafond_surface?: number | null
          menuiseries_sol_surface?: number | null
          name: string
          net_wall_surface?: number | null
          perimeter?: number | null
          plinth_height?: number | null
          project_id: string
          surface?: number | null
          surface_brute_murs?: number | null
          surface_brute_plafond?: number | null
          surface_brute_sol?: number | null
          surface_menuiseries?: number | null
          surface_nette_murs?: number | null
          surface_nette_plafond?: number | null
          surface_nette_sol?: number | null
          total_menuiserie_surface?: number | null
          total_plinth_length?: number | null
          total_plinth_surface?: number | null
          type?: string | null
          type_mur?: string | null
          type_sol?: string | null
          updated_at?: string
          wall_height?: number | null
          wall_surface?: number | null
          wall_surface_raw?: number | null
          width?: number | null
        }
        Update: {
          autres_surfaces_murs?: number | null
          autres_surfaces_plafond?: number | null
          autres_surfaces_sol?: number | null
          ceiling_surface?: number | null
          created_at?: string
          custom_name?: string | null
          floor_surface?: number | null
          height?: number | null
          id?: string
          length?: number | null
          lineaire_brut?: number | null
          lineaire_net?: number | null
          menuiseries_murs_surface?: number | null
          menuiseries_plafond_surface?: number | null
          menuiseries_sol_surface?: number | null
          name?: string
          net_wall_surface?: number | null
          perimeter?: number | null
          plinth_height?: number | null
          project_id?: string
          surface?: number | null
          surface_brute_murs?: number | null
          surface_brute_plafond?: number | null
          surface_brute_sol?: number | null
          surface_menuiseries?: number | null
          surface_nette_murs?: number | null
          surface_nette_plafond?: number | null
          surface_nette_sol?: number | null
          total_menuiserie_surface?: number | null
          total_plinth_length?: number | null
          total_plinth_surface?: number | null
          type?: string | null
          type_mur?: string | null
          type_sol?: string | null
          updated_at?: string
          wall_height?: number | null
          wall_surface?: number | null
          wall_surface_raw?: number | null
          width?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "rooms_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      service_groups: {
        Row: {
          created_at: string
          id: string
          name: string
          work_type_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          work_type_id: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          work_type_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "service_groups_work_type_id_fkey"
            columns: ["work_type_id"]
            isOneToOne: false
            referencedRelation: "work_types"
            referencedColumns: ["id"]
          },
        ]
      }
      services: {
        Row: {
          created_at: string
          description: string | null
          group_id: string
          id: string
          labor_price: number
          name: string
          supply_price: number
          surface_impactee: Database["public"]["Enums"]["type_surface_enum"]
        }
        Insert: {
          created_at?: string
          description?: string | null
          group_id?: string
          id?: string
          labor_price: number
          name: string
          supply_price: number
          surface_impactee?: Database["public"]["Enums"]["type_surface_enum"]
        }
        Update: {
          created_at?: string
          description?: string | null
          group_id?: string
          id?: string
          labor_price?: number
          name?: string
          supply_price?: number
          surface_impactee?: Database["public"]["Enums"]["type_surface_enum"]
        }
        Relationships: []
      }
      work_types: {
        Row: {
          created_at: string
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_table_info: {
        Args: { table_name: string }
        Returns: Json
      }
    }
    Enums: {
      adjustment_enum: "Ajouter" | "Déduire"
      adjustment_type_enum: "Ajouter" | "Déduire"
      type_surface_enum: "Mur" | "Plafond" | "Sol" | "Aucune"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      adjustment_enum: ["Ajouter", "Déduire"],
      adjustment_type_enum: ["Ajouter", "Déduire"],
      type_surface_enum: ["Mur", "Plafond", "Sol", "Aucune"],
    },
  },
} as const
