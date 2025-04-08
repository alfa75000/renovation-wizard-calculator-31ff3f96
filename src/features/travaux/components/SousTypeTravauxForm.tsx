
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

interface SousTypeTravauxFormProps {
  isOpen: boolean;
  onClose: () => void;
  typeId: string;
  sousTypeToEdit: any | null;
  onSubmit: (typeId: string, sousTypeData: any) => void;
}

const SousTypeTravauxForm: React.FC<SousTypeTravauxFormProps> = ({
  isOpen,
  onClose,
  typeId,
  sousTypeToEdit,
  onSubmit
}) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    labor_price: 0,
    supply_price: 0,
  });

  useEffect(() => {
    if (sousTypeToEdit) {
      setFormData({
        name: sousTypeToEdit.name || '',
        description: sousTypeToEdit.description || '',
        labor_price: sousTypeToEdit.labor_price || 0,
        supply_price: sousTypeToEdit.supply_price || 0,
      });
    } else {
      setFormData({
        name: '',
        description: '',
        labor_price: 0,
        supply_price: 0,
      });
    }
  }, [sousTypeToEdit]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'number') {
      setFormData(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(typeId, formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{sousTypeToEdit ? 'Modifier la prestation' : 'Ajouter une prestation'}</DialogTitle>
          <DialogDescription>
            {sousTypeToEdit 
              ? 'Modifiez les informations de la prestation ci-dessous.' 
              : 'Remplissez les informations pour ajouter une nouvelle prestation.'}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nom *</Label>
            <Input 
              id="name" 
              name="name"
              value={formData.name} 
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
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="labor_price">Prix main d'œuvre (€)</Label>
              <Input 
                id="labor_price" 
                name="labor_price"
                type="number"
                step="0.01"
                min="0"
                value={formData.labor_price} 
                onChange={handleChange} 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="supply_price">Prix fournitures (€)</Label>
              <Input 
                id="supply_price" 
                name="supply_price"
                type="number"
                step="0.01"
                min="0"
                value={formData.supply_price} 
                onChange={handleChange} 
              />
            </div>
          </div>
          
          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit" disabled={!formData.name.trim()}>
              {sousTypeToEdit ? 'Mettre à jour' : 'Ajouter'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SousTypeTravauxForm;
