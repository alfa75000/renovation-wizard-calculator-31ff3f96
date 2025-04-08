
import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';
import { Room, Menuiserie } from '@/types';
import MenuiserieForm from '@/components/room/MenuiserieForm';
import { MenuiserieType } from '@/types/supabase';
import { fetchMenuiserieTypes, createRoomMenuiserie } from '@/services/menuiseriesService';
import { Loader2 } from 'lucide-react';

interface MenuiserieSupabaseWrapperProps {
  room: Room;
  onAddMenuiserie: (menuiserie: Omit<Menuiserie, "id">) => void;
  onCancel: () => void;
  menuiserieToEdit?: Menuiserie;
}

const MenuiserieSupabaseWrapper: React.FC<MenuiserieSupabaseWrapperProps> = ({
  room,
  onAddMenuiserie,
  onCancel,
  menuiserieToEdit,
}) => {
  const [typesMenuiseries, setTypesMenuiseries] = useState<MenuiserieType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMenuiserieTypes = async () => {
      try {
        const data = await fetchMenuiserieTypes();
        
        // Convertir les types Supabase en format compatible avec le composant existant
        const adaptedTypes = data.map(type => ({
          id: type.id,
          nom: type.name,
          description: '',
          hauteur: type.hauteur,
          largeur: type.largeur,
          surfaceReference: type.surface_impactee.toLowerCase(),
          impactePlinthe: type.impacte_plinthe
        }));
        
        setTypesMenuiseries(adaptedTypes);
      } catch (error) {
        console.error('Erreur lors du chargement des types de menuiseries:', error);
        toast.error('Impossible de charger les types de menuiseries');
      } finally {
        setLoading(false);
      }
    };
    
    loadMenuiserieTypes();
  }, []);

  const handleSubmit = async (menuiserie: Omit<Menuiserie, "id">) => {
    try {
      // D'abord, nous ajoutons la menuiserie au state local via la fonction callback
      onAddMenuiserie(menuiserie);
      
      // Ensuite, nous enregistrons dans Supabase
      if (menuiserie.type) {
        await createRoomMenuiserie({
          room_id: room.id,
          menuiserie_type_id: menuiserie.type,
          quantity: menuiserie.quantity,
          width: menuiserie.largeur,
          height: menuiserie.hauteur,
          surface_impactee: menuiserie.surfaceImpactee.charAt(0).toUpperCase() + menuiserie.surfaceImpactee.slice(1) as 'Mur' | 'Plafond' | 'Sol' | 'Aucune',
          impacte_plinthe: !!menuiserie.impactePlinthe
        });
        
        toast.success('Menuiserie enregistrée avec succès dans Supabase');
      }
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement de la menuiserie:', error);
      toast.error('Erreur lors de l\'enregistrement de la menuiserie');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <MenuiserieForm
      typesMenuiseries={typesMenuiseries}
      onSubmit={handleSubmit}
      onCancel={onCancel}
      menuiserieToEdit={menuiserieToEdit}
    />
  );
};

export default MenuiserieSupabaseWrapper;
