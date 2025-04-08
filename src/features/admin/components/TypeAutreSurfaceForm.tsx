
import React, { useState, useEffect } from 'react';
import {
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
    estDeduction: false
  });

  useEffect(() => {
    if (typeToEdit) {
      setFormData({
        id: typeToEdit.id,
        nom: typeToEdit.nom,
        description: typeToEdit.description,
        surfaceImpacteeParDefaut: typeToEdit.surfaceImpacteeParDefaut,
        estDeduction: typeToEdit.estDeduction
      });
    } else {
      setFormData({
        id: '',
        nom: '',
        description: '',
        surfaceImpacteeParDefaut: 'mur',
        estDeduction: false
      });
    }
  }, [typeToEdit, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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
    <DialogContent className="sm:max-w-[550px]">
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
  );
};

export default TypeAutreSurfaceForm;
