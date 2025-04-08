
import React, { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MenuiserieType } from '@/types/supabase';
import { fetchMenuiserieTypes } from '@/services/menuiseriesService';
import { toast } from 'sonner';

interface MenuiserieTypeSelectProps {
  value: string;
  onChange: (id: string, name: string, menuiserieType: MenuiserieType) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

const MenuiserieTypeSelect: React.FC<MenuiserieTypeSelectProps> = ({
  value,
  onChange,
  placeholder = "Sélectionner un type de menuiserie",
  disabled = false,
  className = "",
}) => {
  const [menuiserieTypes, setMenuiserieTypes] = useState<MenuiserieType[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedValue, setSelectedValue] = useState<string>(value);
  
  // Charger les types de menuiseries au montage du composant
  useEffect(() => {
    const loadMenuiserieTypes = async () => {
      setLoading(true);
      try {
        const data = await fetchMenuiserieTypes();
        console.log("MenuiserieTypeSelect - Types de menuiseries chargés:", data);
        setMenuiserieTypes(data);
      } catch (error) {
        console.error("Erreur lors du chargement des types de menuiseries:", error);
        toast.error("Impossible de charger les types de menuiseries");
      } finally {
        setLoading(false);
      }
    };
    
    loadMenuiserieTypes();
  }, []);
  
  // Mettre à jour la valeur sélectionnée quand value change (pour la synchronisation entre composants)
  useEffect(() => {
    setSelectedValue(value);
  }, [value]);

  const handleChange = (typeId: string) => {
    console.log("MenuiserieTypeSelect - handleChange appelé avec:", typeId);
    const menuiserieType = menuiserieTypes.find(t => t.id === typeId);
    if (menuiserieType) {
      console.log("MenuiserieTypeSelect - Type de menuiserie sélectionné:", menuiserieType.name);
      setSelectedValue(typeId);
      onChange(menuiserieType.id, menuiserieType.name, menuiserieType);
    }
  };

  return (
    <Select
      value={selectedValue}
      onValueChange={handleChange}
      disabled={disabled || loading}
    >
      <SelectTrigger className={className}>
        <SelectValue placeholder={loading ? "Chargement..." : placeholder} />
      </SelectTrigger>
      <SelectContent>
        {menuiserieTypes.length > 0 ? (
          menuiserieTypes.map((type) => (
            <SelectItem key={type.id} value={type.id}>
              {type.name} ({type.largeur}x{type.hauteur} cm)
            </SelectItem>
          ))
        ) : (
          <SelectItem value="none" disabled>
            {loading ? "Chargement..." : "Aucun type de menuiserie disponible"}
          </SelectItem>
        )}
      </SelectContent>
    </Select>
  );
};

export default MenuiserieTypeSelect;
