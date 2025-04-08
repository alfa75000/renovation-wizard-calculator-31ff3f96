
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MenuiserieType } from '@/types/supabase';
import MenuiserieTypeSelect from '@/features/travaux/components/MenuiserieTypeSelect';
import { toast } from 'sonner';

interface MenuiserieFormProps {
  onAddMenuiserie: (menuiserie: any, quantity: number) => void;
}

const MenuiserieForm: React.FC<MenuiserieFormProps> = ({ onAddMenuiserie }) => {
  const [selectedType, setSelectedType] = useState<MenuiserieType | null>(null);
  const [selectedTypeId, setSelectedTypeId] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [isAdding, setIsAdding] = useState<boolean>(false);
  
  const handleTypeSelected = (id: string, name: string, menuiserieType: MenuiserieType) => {
    console.log("Type de menuiserie sélectionné:", menuiserieType);
    setSelectedTypeId(id);
    setSelectedType(menuiserieType);
  };
  
  const handleAddMenuiserie = () => {
    if (!selectedType) {
      toast.error("Veuillez sélectionner un type de menuiserie");
      return;
    }
    
    const newMenuiserie = {
      id: `${selectedTypeId}-${Date.now()}`,
      typeId: selectedTypeId,
      nom: selectedType.name,
      typeName: selectedType.name,
      quantity: quantity,
      hauteur: selectedType.hauteur,
      largeur: selectedType.largeur,
      surfaceReference: mapSurfaceImpactee(selectedType.surface_impactee),
      impactePlinthe: selectedType.impacte_plinthe
    };
    
    onAddMenuiserie(newMenuiserie, quantity);
    resetForm();
  };
  
  // Fonction de mapping de surface_impactee vers surfaceReference
  const mapSurfaceImpactee = (surface: string): string => {
    switch (surface) {
      case 'Mur': return 'SurfaceNetteMurs';
      case 'Plafond': return 'SurfaceNettePlafond';
      case 'Sol': return 'SurfaceNetteSol';
      default: return 'SurfaceNetteMurs'; // Par défaut
    }
  };
  
  const resetForm = () => {
    setSelectedTypeId('');
    setSelectedType(null);
    setQuantity(1);
  };
  
  return (
    <div>
      <h4 className="font-medium mb-2">Ajouter des menuiseries</h4>
      
      <div className="space-y-3">
        <div>
          <Label htmlFor="menuiserieType">Type de menuiserie</Label>
          <MenuiserieTypeSelect
            value={selectedTypeId}
            onChange={handleTypeSelected}
            className="w-full mt-1"
          />
        </div>
        
        <div>
          <Label htmlFor="quantity">Quantité</Label>
          <Input
            id="quantity"
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            className="mt-1"
          />
        </div>
        
        {selectedType && (
          <div className="text-sm text-gray-600 border-l-2 border-gray-200 pl-3 py-1 mt-2">
            <p>Dimensions: {selectedType.largeur} x {selectedType.hauteur} cm</p>
            <p>Surface impactée: {selectedType.surface_impactee}</p>
            <p>Impacte plinthes: {selectedType.impacte_plinthe ? 'Oui' : 'Non'}</p>
          </div>
        )}
        
        <Button 
          onClick={handleAddMenuiserie} 
          className="w-full mt-3"
          disabled={!selectedTypeId}
        >
          Ajouter à la pièce
        </Button>
      </div>
    </div>
  );
};

export default MenuiserieForm;
