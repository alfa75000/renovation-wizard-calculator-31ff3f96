
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Check, Plus } from 'lucide-react';
import { Menuiserie } from '@/types';
import { MenuiserieType, SurfaceImpactee } from '@/types/supabase'; 
import { fetchMenuiserieTypes } from '@/services/menuiseriesService';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';

interface MenuiserieFormProps {
  onAddMenuiserie: (menuiserie: Omit<Menuiserie, 'id' | 'surface'>, quantity: number) => void;
  editingMenuiserie?: Omit<Menuiserie, 'id' | 'surface'> | null;
  onCancelEdit?: () => void;
}

// Mapping pour convertir les valeurs de surface_impactee de Supabase vers les valeurs frontend
const mapSurfaceImpacteeToFrontend = (surfaceImpactee: SurfaceImpactee): "mur" | "plafond" | "sol" => {
  switch (surfaceImpactee) {
    case 'Plafond': return 'plafond';
    case 'Sol': return 'sol';
    case 'Aucune': return 'mur'; // Traiter "Aucune" comme "mur" pour compatibilité
    default: return 'mur'; // Par défaut Mur
  }
};

const MenuiserieForm: React.FC<MenuiserieFormProps> = ({ 
  onAddMenuiserie, 
  editingMenuiserie = null,
  onCancelEdit
}) => {
  const [menuiseriesTypes, setMenuiseriesTypes] = useState<MenuiserieType[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const [newMenuiserie, setNewMenuiserie] = useState<Omit<Menuiserie, 'id' | 'surface'>>({
    type: "",
    name: "",
    largeur: 0,
    hauteur: 0,
    quantity: 1,
    surfaceImpactee: "mur"
  });

  const [selectedTypeId, setSelectedTypeId] = useState<string>("");
  const [selectedType, setSelectedType] = useState<MenuiserieType | null>(null);
  const [quantity, setQuantity] = useState(1);

  // Chargement des types de menuiseries depuis Supabase
  useEffect(() => {
    const loadMenuiserieTypes = async () => {
      setLoading(true);
      try {
        const types = await fetchMenuiserieTypes();
        if (Array.isArray(types)) {
          setMenuiseriesTypes(types);
        } else {
          console.error('fetchMenuiserieTypes n\'a pas retourné un tableau:', types);
          setMenuiseriesTypes([]);
          toast({
            title: 'Erreur',
            description: 'Impossible de charger les types de menuiseries',
            variant: 'destructive'
          });
        }
      } catch (error) {
        console.error('Erreur lors du chargement des types de menuiseries:', error);
        toast({
          title: 'Erreur',
          description: 'Impossible de charger les types de menuiseries',
          variant: 'destructive'
        });
      } finally {
        setLoading(false);
      }
    };

    loadMenuiserieTypes();
  }, []);

  const handleMenuiserieTypeChange = (typeId: string) => {
    setSelectedTypeId(typeId);
    const selected = menuiseriesTypes.find(type => type.id === typeId);
    
    if (selected) {
      setSelectedType(selected);
      const surfaceImpactee = mapSurfaceImpacteeToFrontend(selected.surface_impactee);
      
      setNewMenuiserie((prev) => ({ 
        ...prev, 
        type: selected.name,
        largeur: selected.largeur,
        hauteur: selected.hauteur,
        impactePlinthe: selected.impacte_plinthe,
        surfaceImpactee
      }));
    } else {
      setSelectedType(null);
    }
  };

  const handleSurfaceImpacteeChange = (value: string) => {
    setNewMenuiserie(prev => ({
      ...prev,
      surfaceImpactee: value as "mur" | "plafond" | "sol"
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
    if (!selectedTypeId) {
      toast({
        title: 'Validation',
        description: 'Veuillez sélectionner un type de menuiserie',
        variant: 'destructive'
      });
      return;
    }
    
    // Ajout des informations spécifiques du type sélectionné
    const menuiserieToAdd = {
      ...newMenuiserie,
      menuiserie_type_id: selectedTypeId  // Ajouter l'ID du type sélectionné pour Supabase
    };
    
    onAddMenuiserie(menuiserieToAdd, quantity);
    
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
          <Select
            value={selectedTypeId}
            onValueChange={handleMenuiserieTypeChange}
            disabled={loading}
          >
            <SelectTrigger id="menuiserieType" className="w-full p-2 border rounded mt-1">
              <SelectValue placeholder="Sélectionner un type" />
            </SelectTrigger>
            <SelectContent>
              {menuiseriesTypes.map((type) => (
                <SelectItem key={type.id} value={type.id}>
                  {type.name} ({type.largeur}×{type.hauteur} cm)
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="md:col-span-2">
          <Label htmlFor="menuiserieImpact">Surface impactée</Label>
          <Select
            value={newMenuiserie.surfaceImpactee || 'mur'}
            onValueChange={handleSurfaceImpacteeChange}
          >
            <SelectTrigger id="menuiserieImpact" className="w-full p-2 border rounded mt-1">
              <SelectValue placeholder="Sélectionner une surface" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="mur">Mur</SelectItem>
              <SelectItem value="plafond">Plafond</SelectItem>
              <SelectItem value="sol">Sol</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {selectedType && (
        <div className="bg-gray-50 p-4 rounded-md mb-4">
          <h4 className="font-medium mb-2">Informations du type sélectionné</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <span className="block text-sm text-gray-500">Dimensions par défaut:</span>
              <span className="font-medium">{selectedType.largeur} × {selectedType.hauteur} cm</span>
            </div>
            <div>
              <span className="block text-sm text-gray-500">Surface impactée par défaut:</span>
              <span className="font-medium">{selectedType.surface_impactee}</span>
            </div>
            <div>
              <span className="block text-sm text-gray-500">Impacte les plinthes:</span>
              <span className="font-medium">{selectedType.impacte_plinthe ? 'Oui' : 'Non'}</span>
            </div>
          </div>
        </div>
      )}
      
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
            disabled={!selectedTypeId || loading}
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
