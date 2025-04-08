
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Check, Plus } from 'lucide-react';
import { Menuiserie } from '@/types';
import { useMenuiseriesTypes } from '@/contexts/MenuiseriesTypesContext';

interface MenuiserieFormProps {
  onAddMenuiserie: (menuiserie: Omit<Menuiserie, 'id' | 'surface'>, quantity: number) => void;
  editingMenuiserie?: Omit<Menuiserie, 'id' | 'surface'> | null;
  onCancelEdit?: () => void;
}

const MenuiserieForm: React.FC<MenuiserieFormProps> = ({ 
  onAddMenuiserie, 
  editingMenuiserie = null,
  onCancelEdit
}) => {
  const { state: menuiseriesState } = useMenuiseriesTypes();
  const [newMenuiserie, setNewMenuiserie] = useState<Omit<Menuiserie, 'id' | 'surface'>>({
    type: "",
    name: "",
    largeur: 0,
    hauteur: 0,
    quantity: 1,
    surfaceImpactee: "mur"
  });

  const [quantity, setQuantity] = useState(1);

  // Détecter le type de surface impactée par défaut
  const getDefaultSurfaceImpactee = (type: string): "mur" | "plafond" | "sol" => {
    const lowerType = type.toLowerCase();
    if (
      lowerType.includes('toit') || 
      lowerType.includes('velux') || 
      lowerType.includes('vélux') || 
      lowerType.includes('plafond')
    ) {
      return "plafond";
    } else if (
      lowerType.includes('trappe') || 
      lowerType.includes('sol')
    ) {
      return "sol";
    }
    return "mur";
  };

  const handleMenuiserieTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const typeId = e.target.value;
    const selectedType = menuiseriesState.typesMenuiseries.find(type => type.id === typeId);
    
    if (selectedType) {
      const surfaceImpactee = getDefaultSurfaceImpactee(selectedType.nom);
      setNewMenuiserie((prev) => ({ 
        ...prev, 
        type: selectedType.nom,
        largeur: selectedType.largeur,
        hauteur: selectedType.hauteur,
        impactePlinthe: selectedType.impactePlinthe,
        surfaceImpactee
      }));
    }
  };

  const handleSurfaceImpacteeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as "mur" | "plafond" | "sol";
    setNewMenuiserie(prev => ({
      ...prev,
      surfaceImpactee: value
    }));
  };

  const handleMenuiserieChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name === "largeur" || name === "hauteur") {
      setNewMenuiserie((prev) => ({ 
        ...prev, 
        [name]: parseFloat(value) || 0 
      }));
    } else if (name === "quantity") {
      setQuantity(parseInt(value) || 1);
    } else {
      setNewMenuiserie((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleAddMenuiserie = () => {
    if (!newMenuiserie.type) {
      alert("Veuillez sélectionner un type de menuiserie");
      return;
    }
    
    onAddMenuiserie(newMenuiserie, quantity);
    
    // Réinitialiser le formulaire mais conserver le type
    setNewMenuiserie(prev => ({
      ...prev,
      name: "",
      quantity: 1
    }));
    setQuantity(1);
  };

  return (
    <div className="mb-6">
      <h3 className="text-lg font-medium mb-3">Menuiseries</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        <div className="md:col-span-2">
          <Label htmlFor="menuiserieType">Type de menuiserie</Label>
          <select
            id="menuiserieType"
            name="type"
            value={newMenuiserie.type ? menuiseriesState.typesMenuiseries.find(t => t.nom === newMenuiserie.type)?.id || "" : ""}
            onChange={handleMenuiserieTypeChange}
            className="w-full p-2 border rounded mt-1"
          >
            <option value="">Sélectionner un type</option>
            {menuiseriesState.typesMenuiseries.map((type) => (
              <option key={type.id} value={type.id}>
                {type.nom} ({type.largeur}×{type.hauteur} cm)
              </option>
            ))}
          </select>
        </div>
        
        <div className="md:col-span-2">
          <Label htmlFor="menuiserieImpact">Surface impactée</Label>
          <select
            id="menuiserieImpact"
            name="surfaceImpactee"
            value={newMenuiserie.surfaceImpactee || 'mur'}
            onChange={handleSurfaceImpacteeChange}
            className="w-full p-2 border rounded mt-1"
          >
            <option value="mur">Mur</option>
            <option value="plafond">Plafond</option>
            <option value="sol">Sol</option>
          </select>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
        <div>
          <Label htmlFor="menuiserieName">Nom (optionnel)</Label>
          <Input
            id="menuiserieName"
            name="name"
            value={newMenuiserie.name || ''}
            onChange={handleMenuiserieChange}
            placeholder="Ex: Porte d'entrée"
            className="mt-1"
          />
        </div>
        
        <div>
          <Label htmlFor="menuiserieLargeur">Largeur (cm)</Label>
          <Input
            id="menuiserieLargeur"
            name="largeur"
            type="number"
            min="0"
            value={newMenuiserie.largeur || ''}
            onChange={handleMenuiserieChange}
            className="mt-1"
          />
        </div>
        
        <div>
          <Label htmlFor="menuiserieHauteur">Hauteur (cm)</Label>
          <Input
            id="menuiserieHauteur"
            name="hauteur"
            type="number"
            min="0"
            value={newMenuiserie.hauteur || ''}
            onChange={handleMenuiserieChange}
            className="mt-1"
          />
        </div>
        
        <div>
          <Label htmlFor="menuiserieQuantity">Quantité</Label>
          <Input
            id="menuiserieQuantity"
            name="quantity"
            type="number"
            min="1"
            value={quantity}
            onChange={handleMenuiserieChange}
            className="mt-1"
          />
        </div>
        
        <div className="flex items-end">
          <Button 
            onClick={handleAddMenuiserie} 
            className="w-full"
            disabled={!newMenuiserie.type}
          >
            {editingMenuiserie ? (
              <>
                <Check className="h-4 w-4 mr-2" />
                Mettre à jour
              </>
            ) : (
              <>
                <Plus className="h-4 w-4 mr-2" />
                Ajouter
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MenuiserieForm;
