
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Check, Plus } from 'lucide-react';
import { AutreSurface, TypeAutreSurface } from '@/types';
import { arrondir2Decimales } from '@/lib/utils';

interface AutreSurfaceFormProps {
  onAddAutreSurface: (autreSurface: Omit<AutreSurface, 'id' | 'surface'>) => void;
  editingSurface: string | null;
  currentSurface: Omit<AutreSurface, 'id' | 'surface'> | null;
  onCancelEdit?: () => void;
  typesAutresSurfaces: TypeAutreSurface[];
}

const AutreSurfaceForm: React.FC<AutreSurfaceFormProps> = ({
  onAddAutreSurface,
  editingSurface,
  currentSurface,
  onCancelEdit,
  typesAutresSurfaces
}) => {
  const [surface, setSurface] = useState<Omit<AutreSurface, 'id' | 'surface'>>({
    type: "",
    name: "",
    designation: "",
    largeur: 1,
    hauteur: 1,
    quantity: 1,
    surfaceImpactee: "mur",
    estDeduction: false,
    impactePlinthe: false
  });
  
  const [surfaceCalculee, setSurfaceCalculee] = useState(0);

  // Charger la surface à éditer
  useEffect(() => {
    if (editingSurface && currentSurface) {
      setSurface({
        ...currentSurface,
        impactePlinthe: currentSurface.impactePlinthe || false
      });
      setSurfaceCalculee(currentSurface.largeur * currentSurface.hauteur);
    } else {
      resetForm();
    }
  }, [editingSurface, currentSurface]);

  // Calcul de la surface
  useEffect(() => {
    const surfaceM2 = arrondir2Decimales(surface.largeur * surface.hauteur);
    setSurfaceCalculee(surfaceM2);
  }, [surface.largeur, surface.hauteur]);

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const typeId = e.target.value;
    if (!typeId) {
      resetForm();
      return;
    }
    
    const selectedType = typesAutresSurfaces.find(type => type.id === typeId);
    if (selectedType) {
      setSurface({
        type: selectedType.nom,
        designation: selectedType.nom,
        name: selectedType.nom,
        surfaceImpactee: selectedType.surfaceImpacteeParDefaut,
        estDeduction: selectedType.estDeduction,
        largeur: selectedType.largeur || 1,
        hauteur: selectedType.hauteur || 1,
        quantity: 1,
        impactePlinthe: selectedType.impactePlinthe || false
      });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    
    if (name === 'largeur' || name === 'hauteur' || name === 'quantity') {
      setSurface(prev => ({
        ...prev,
        [name]: type === 'number' ? parseFloat(value) || 0 : value
      }));
    } else if (name === 'estDeduction' || name === 'impactePlinthe') {
      setSurface(prev => ({
        ...prev,
        [name]: checked
      }));
    } else if (name === 'surfaceImpactee') {
      setSurface(prev => ({
        ...prev,
        surfaceImpactee: value as 'mur' | 'plafond' | 'sol' | 'aucune'
      }));
    } else {
      setSurface(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!surface.type) {
      alert("Veuillez sélectionner un type de surface");
      return;
    }
    
    if (surface.largeur <= 0 || surface.hauteur <= 0) {
      alert("Les dimensions doivent être supérieures à zéro");
      return;
    }
    
    onAddAutreSurface(surface);
    resetForm();
  };

  const resetForm = () => {
    setSurface({
      type: "",
      name: "",
      designation: "",
      largeur: 1,
      hauteur: 1,
      quantity: 1,
      surfaceImpactee: "mur",
      estDeduction: false,
      impactePlinthe: false
    });
    setSurfaceCalculee(0);
  };

  const handleCancel = () => {
    if (onCancelEdit) onCancelEdit();
    resetForm();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="typeSurface">Type de surface</Label>
        <select
          id="typeSurface"
          name="type"
          value={typesAutresSurfaces.find(t => t.nom === surface.type)?.id || ""}
          onChange={handleTypeChange}
          className="w-full p-2 border rounded mt-1"
        >
          <option value="">Sélectionner un type</option>
          {typesAutresSurfaces.map((type) => (
            <option key={type.id} value={type.id}>
              {type.nom} ({type.estDeduction ? 'Déduction' : 'Ajout'})
            </option>
          ))}
        </select>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Nom (optionnel)</Label>
          <Input
            id="name"
            name="name"
            value={surface.name || ''}
            onChange={handleChange}
            placeholder="Ex: Niche salon"
            className="mt-1"
          />
        </div>
        
        <div>
          <Label htmlFor="designation">Désignation</Label>
          <Input
            id="designation"
            name="designation"
            value={surface.designation || ''}
            onChange={handleChange}
            placeholder="Description"
            className="mt-1"
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="surfaceImpactee">Surface impactée</Label>
          <select
            id="surfaceImpactee"
            name="surfaceImpactee"
            value={surface.surfaceImpactee}
            onChange={handleChange}
            className="w-full p-2 border rounded mt-1"
          >
            <option value="mur">Mur</option>
            <option value="plafond">Plafond</option>
            <option value="sol">Sol</option>
            <option value="aucune">Aucune</option>
          </select>
        </div>
        
        <div>
          <Label htmlFor="estDeduction">Type d'opération</Label>
          <div className="flex items-center mt-2">
            <input
              id="estDeduction"
              name="estDeduction"
              type="checkbox"
              checked={surface.estDeduction}
              onChange={handleChange}
              className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="estDeduction" className="ml-2 block text-sm text-gray-900">
              {surface.estDeduction ? 'Déduction' : 'Ajout'} de surface
            </label>
          </div>
        </div>
        
        <div>
          <Label htmlFor="quantity">Quantité</Label>
          <Input
            id="quantity"
            name="quantity"
            type="number"
            min="1"
            value={surface.quantity || 1}
            onChange={handleChange}
            className="mt-1"
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="largeur">Largeur (m)</Label>
          <Input
            id="largeur"
            name="largeur"
            type="number"
            min="0.01"
            step="0.01"
            value={surface.largeur || ''}
            onChange={handleChange}
            className="mt-1"
          />
        </div>
        
        <div>
          <Label htmlFor="hauteur">Hauteur (m)</Label>
          <Input
            id="hauteur"
            name="hauteur"
            type="number"
            min="0.01"
            step="0.01"
            value={surface.hauteur || ''}
            onChange={handleChange}
            className="mt-1"
          />
        </div>
        
        <div>
          <Label htmlFor="surfaceCalculee">Surface calculée (m²)</Label>
          <Input
            id="surfaceCalculee"
            name="surfaceCalculee"
            type="number"
            value={surfaceCalculee.toFixed(2)}
            readOnly
            className="mt-1 bg-gray-100"
          />
        </div>
      </div>
      
      <div className="flex items-center mt-2">
        <input
          id="impactePlinthe"
          name="impactePlinthe"
          type="checkbox"
          checked={surface.impactePlinthe}
          onChange={handleChange}
          className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
        <label htmlFor="impactePlinthe" className="ml-2 block text-sm text-gray-900">
          Impacte les plinthes
        </label>
      </div>
      
      <div className="flex justify-end space-x-2">
        {editingSurface && (
          <Button 
            type="button" 
            variant="outline" 
            onClick={handleCancel}
          >
            Annuler
          </Button>
        )}
        
        <Button 
          type="submit" 
          disabled={!surface.type || surface.largeur <= 0 || surface.hauteur <= 0}
        >
          {editingSurface ? (
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
    </form>
  );
};

export default AutreSurfaceForm;
