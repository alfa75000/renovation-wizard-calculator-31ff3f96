
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { TypeAutreSurface } from '@/types';

interface TypeAutreSurfaceFormProps {
  isOpen: boolean;
  onClose: () => void;
  typeToEdit: TypeAutreSurface | null;
  onSubmit: (typeData: TypeAutreSurface) => void;
}

const TypeAutreSurfaceForm: React.FC<TypeAutreSurfaceFormProps> = ({
  isOpen,
  onClose,
  typeToEdit,
  onSubmit
}) => {
  const [formData, setFormData] = useState<TypeAutreSurface>({
    id: '',
    nom: '',
    description: '',
    surfaceImpacteeParDefaut: 'mur',
    estDeduction: false,
    largeur: 0,
    hauteur: 0,
    impactePlinthe: false
  });

  useEffect(() => {
    if (typeToEdit) {
      setFormData({
        id: typeToEdit.id,
        nom: typeToEdit.nom,
        description: typeToEdit.description,
        surfaceImpacteeParDefaut: typeToEdit.surfaceImpacteeParDefaut,
        estDeduction: typeToEdit.estDeduction,
        largeur: typeToEdit.largeur || 0,
        hauteur: typeToEdit.hauteur || 0,
        impactePlinthe: typeToEdit.impactePlinthe || false
      });
    } else {
      setFormData({
        id: '',
        nom: '',
        description: '',
        surfaceImpacteeParDefaut: 'mur',
        estDeduction: false,
        largeur: 0,
        hauteur: 0,
        impactePlinthe: false
      });
    }
  }, [typeToEdit]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === 'largeur' || name === 'hauteur') {
      const numValue = parseFloat(value);
      setFormData(prev => ({ ...prev, [name]: isNaN(numValue) ? 0 : numValue }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSelectChange = (name: keyof TypeAutreSurface, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (name: keyof TypeAutreSurface, value: boolean) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{typeToEdit ? 'Modifier le type d\'autre surface' : 'Ajouter un type d\'autre surface'}</DialogTitle>
          <DialogDescription>
            {typeToEdit 
              ? 'Modifiez les informations du type d\'autre surface ci-dessous.' 
              : 'Remplissez les informations pour ajouter un nouveau type d\'autre surface.'}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nom">Nom *</Label>
            <Input 
              id="nom" 
              name="nom" 
              value={formData.nom} 
              onChange={handleChange} 
              required 
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea 
              id="description" 
              name="description" 
              value={formData.description} 
              onChange={handleChange} 
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="surfaceImpacteeParDefaut">Surface impactée par défaut</Label>
            <Select 
              value={formData.surfaceImpacteeParDefaut} 
              onValueChange={(value) => handleSelectChange('surfaceImpacteeParDefaut', value)}
            >
              <SelectTrigger id="surfaceImpacteeParDefaut">
                <SelectValue placeholder="Sélectionnez une surface" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mur">Mur</SelectItem>
                <SelectItem value="plafond">Plafond</SelectItem>
                <SelectItem value="sol">Sol</SelectItem>
                <SelectItem value="aucune">Aucune</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="largeur">Largeur par défaut (m)</Label>
              <Input 
                id="largeur" 
                name="largeur" 
                type="number"
                step="0.01"
                min="0"
                value={formData.largeur} 
                onChange={handleChange} 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="hauteur">Hauteur par défaut (m)</Label>
              <Input 
                id="hauteur" 
                name="hauteur" 
                type="number"
                step="0.01"
                min="0"
                value={formData.hauteur} 
                onChange={handleChange} 
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch 
              id="estDeduction" 
              checked={formData.estDeduction} 
              onCheckedChange={(value) => handleSwitchChange('estDeduction', value)} 
            />
            <Label htmlFor="estDeduction">
              {formData.estDeduction ? 'Déduire de la surface' : 'Ajouter à la surface'}
            </Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch 
              id="impactePlinthe" 
              checked={formData.impactePlinthe} 
              onCheckedChange={(value) => handleSwitchChange('impactePlinthe', value)} 
            />
            <Label htmlFor="impactePlinthe">
              Impacte les plinthes
            </Label>
          </div>
          
          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit">
              {typeToEdit ? 'Mettre à jour' : 'Ajouter'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TypeAutreSurfaceForm;
