
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
import { TravauxType } from '@/types';

interface TypeTravauxFormProps {
  isOpen: boolean;
  onClose: () => void;
  typeToEdit: any | null;
  onSubmit: (name: string) => void;
}

const TypeTravauxForm: React.FC<TypeTravauxFormProps> = ({
  isOpen,
  onClose,
  typeToEdit,
  onSubmit
}) => {
  const [name, setName] = useState('');

  useEffect(() => {
    if (typeToEdit) {
      setName(typeToEdit.name || '');
    } else {
      setName('');
    }
  }, [typeToEdit]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(name);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{typeToEdit ? 'Modifier le type de travaux' : 'Ajouter un type de travaux'}</DialogTitle>
          <DialogDescription>
            {typeToEdit 
              ? 'Modifiez les informations du type de travaux ci-dessous.' 
              : 'Remplissez les informations pour ajouter un nouveau type de travaux.'}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nom *</Label>
            <Input 
              id="name" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              required 
            />
          </div>
          
          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit" disabled={!name.trim()}>
              {typeToEdit ? 'Mettre à jour' : 'Ajouter'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TypeTravauxForm;
