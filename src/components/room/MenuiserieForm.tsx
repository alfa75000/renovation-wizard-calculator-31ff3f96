
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
import { Textarea } from '@/components/ui/textarea';

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
  const [menuiserieCount, setMenuiserieCount] = useState(1);

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
  const [surfaceCalculee, setSurfaceCalculee] = useState(0);
  const [impactePlinthe, setImpactePlinthe] = useState(false);

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

  useEffect(() => {
    const largeur = newMenuiserie.largeur || 0;
    const hauteur = newMenuiserie.hauteur || 0;
    const surfaceM2 = (largeur * hauteur) / 10000; // Conversion cm² en m²
    setSurfaceCalculee(surfaceM2);
  }, [newMenuiserie.largeur, newMenuiserie.hauteur]);

  const handleMenuiserieTypeChange = (typeId: string) => {
    setSelectedTypeId(typeId);
    const selected = menuiseriesTypes.find(type => type.id === typeId);
    
    if (selected) {
      setSelectedType(selected);
      const surfaceImpactee = mapSurfaceImpacteeToFrontend(selected.surface_impactee);
      
      // Ne générons pas de nom ici pour éviter le problème de numérotation
      setNewMenuiserie((prev) => ({ 
        ...prev, 
        type: selected.name,
        largeur: selected.largeur,
        hauteur: selected.hauteur,
        surfaceImpactee,
        description: selected.description || ""
      }));
      
      setImpactePlinthe(selected.impacte_plinthe);
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

  const handleMenuiserieChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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

  const handleImpactePlinthesChange = (checked: boolean) => {
    setImpactePlinthe(checked);
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
    
    // Créer un objet menuiserie à ajouter
    const menuiserieToAdd = {
      ...newMenuiserie,
      menuiserie_type_id: selectedTypeId,
      impactePlinthe
    };
    
    // Ajouter la menuiserie
    onAddMenuiserie(menuiserieToAdd, quantity);
    
    // Réinitialiser le formulaire
    setMenuiserieCount(prevCount => prevCount + 1);
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
      
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-4">
        <div className="md:col-span-5">
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
        
        <div className="md:col-span-7">
          <Label htmlFor="menuiserieName">Nom</Label>
          <Input
            id="menuiserieName"
            name="name"
            value={newMenuiserie.name || ''}
            onChange={handleMenuiserieChange}
            placeholder="Ex: Porte d'entrée"
            className="mt-1"
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-4">
        <div className="md:col-span-3">
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
        
        <div className="md:col-span-3">
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
        
        <div className="md:col-span-3">
          <Label htmlFor="menuiserieSurface">Surface (m²)</Label>
          <Input
            id="menuiserieSurface"
            value={surfaceCalculee.toFixed(2)}
            readOnly
            className="mt-1 bg-gray-100"
          />
        </div>
        
        <div className="md:col-span-3">
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
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-4">
        <div className="md:col-span-7">
          <Label htmlFor="menuiserieDescription">Descriptif</Label>
          <Textarea
            id="menuiserieDescription"
            name="description"
            value={newMenuiserie.description || ''}
            onChange={handleMenuiserieChange}
            placeholder="Description détaillée de la menuiserie"
            className="mt-1 min-h-[80px] max-h-[120px]"
          />
        </div>
        
        <div className="md:col-span-5">
          <div className="grid grid-cols-2 gap-2">
            <div>
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
            
            <div className="mt-8">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="impactePlinthe" 
                  checked={impactePlinthe} 
                  onCheckedChange={handleImpactePlinthesChange}
                />
                <Label htmlFor="impactePlinthe">Impacte plinthes</Label>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end mt-4">
            <Button 
              onClick={handleAddMenuiserie} 
              className="w-auto"
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
    </div>
  );
};

export default MenuiserieForm;
