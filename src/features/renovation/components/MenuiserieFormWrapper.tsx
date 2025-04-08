
import React, { useState, useEffect } from 'react';
import MenuiserieForm from '@/components/room/MenuiserieForm';
import { useQuery } from '@tanstack/react-query';
import { fetchMenuiserieTypes } from '@/services/menuiseriesService';
import { MenuiserieType } from '@/types/supabase';
import { Room, Menuiserie } from '@/types';
import { toast } from 'sonner';

interface MenuiserieFormWrapperProps {
  room: Room;
  onAddMenuiserie: (menuiserie: Omit<Menuiserie, "id">) => void;
  onCancel: () => void;
  menuiserieToEdit?: Menuiserie | null;
}

const MenuiserieFormWrapper: React.FC<MenuiserieFormWrapperProps> = ({
  room,
  onAddMenuiserie,
  onCancel,
  menuiserieToEdit
}) => {
  // Charger les types de menuiseries depuis Supabase
  const { data: menuiserieTypes = [], isLoading, error } = useQuery({
    queryKey: ['menuiseriesTypes'],
    queryFn: fetchMenuiserieTypes
  });

  const [formattedTypes, setFormattedTypes] = useState<any[]>([]);

  useEffect(() => {
    if (error) {
      toast.error("Erreur lors du chargement des types de menuiseries");
      console.error(error);
    }
  }, [error]);

  // Convertir les types de menuiseries Supabase au format attendu par MenuiserieForm
  useEffect(() => {
    if (menuiserieTypes && menuiserieTypes.length > 0) {
      const formatted = menuiserieTypes.map(type => ({
        id: type.id,
        nom: type.name,
        description: type.description || '',
        hauteur: type.hauteur,
        largeur: type.largeur,
        surfaceReference: type.surface_impactee === 'Mur' ? 'mur' :
                         type.surface_impactee === 'Sol' ? 'sol' : 'plafond',
        impactePlinthe: type.impacts_plinthe
      }));
      
      setFormattedTypes(formatted);
      console.log("Types de menuiseries formatés:", formatted);
    }
  }, [menuiserieTypes]);

  // Adapter le handler pour créer une entrée dans room_menuiseries en plus
  const handleAddMenuiserie = async (menuiserie: Omit<Menuiserie, "id">) => {
    try {
      // Appeler la fonction originale pour ajouter la menuiserie à l'état local
      onAddMenuiserie(menuiserie);
      
      // TODO: Si besoin, ajouter ici la logique pour créer l'entrée dans room_menuiseries
      // await createRoomMenuiserie(room.id, menuiserie.type, menuiserie.quantity);
      
    } catch (error) {
      console.error("Erreur lors de l'ajout de la menuiserie:", error);
      toast.error("Erreur lors de l'ajout de la menuiserie");
    }
  };

  if (isLoading) {
    return <div>Chargement des types de menuiseries...</div>;
  }

  // Passer les types formatés au composant MenuiserieForm
  return (
    <MenuiserieForm
      room={room}
      typesMenuiseries={formattedTypes}
      onAddMenuiserie={handleAddMenuiserie}
      onCancel={onCancel}
      menuiserieToEdit={menuiserieToEdit}
    />
  );
};

export default MenuiserieFormWrapper;
