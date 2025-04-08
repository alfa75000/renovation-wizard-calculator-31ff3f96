
import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TypeMenuiserie } from '@/types';
import { SurfaceImpactee } from '@/types/supabase';
import { surfacesReference } from '@/contexts/MenuiseriesTypesContext';

interface TypeMenuiserieFormProps {
  isOpen: boolean;
  onClose: () => void;
  typeToEdit: TypeMenuiserie | null;
  onSubmit: (typeData: TypeMenuiserie) => void;
}

// Options de surface impactée correspondant exactement aux valeurs de l'ENUM dans Supabase
const surfaceOptions: { value: SurfaceImpactee; label: string }[] = [
  { value: 'Mur', label: 'Murs' },
  { value: 'Plafond', label: 'Plafond' },
  { value: 'Sol', label: 'Sol' },
  { value: 'Aucune', label: 'Aucune' }
];

const TypeMenuiserieForm: React.FC<TypeMenuiserieFormProps> = ({
  isOpen,
  onClose,
  typeToEdit,
  onSubmit
}) => {
  const [nom, setNom] = useState('');
  const [hauteur, setHauteur] = useState<number>(0);
  const [largeur, setLargeur] = useState<number>(0);
  const [surfaceReference, setSurfaceReference] = useState<SurfaceImpactee>('Mur');
  const [impactePlinthe, setImpactePlinthe] = useState(false);
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (typeToEdit) {
      setNom(typeToEdit.nom);
      setHauteur(typeToEdit.hauteur);
      setLargeur(typeToEdit.largeur);
      
      // Conversion de la valeur stockée vers l'enum Supabase
      if (typeToEdit.surfaceReference) {
        const surfaceRefValue = mapToSupabaseSurfaceImpactee(typeToEdit.surfaceReference);
        setSurfaceReference(surfaceRefValue);
      }
      
      setImpactePlinthe(!!typeToEdit.impactePlinthe);
      setDescription(typeToEdit.description || '');
    } else {
      // Réinitialiser les champs si on ajoute un nouveau type
      setNom('');
      setHauteur(0);
      setLargeur(0);
      setSurfaceReference('Mur');
      setImpactePlinthe(false);
      setDescription('');
    }
  }, [typeToEdit, isOpen]);

  // Fonction pour mapper les anciennes valeurs vers les valeurs de l'enum Supabase
  const mapToSupabaseSurfaceImpactee = (value: string): SurfaceImpactee => {
    switch(value.toLowerCase()) {
      case 'mur':
      case 'murs':
      case 'surfacenettemurs':
        return 'Mur';
      case 'plafond':
      case 'surfacenetteplafond':
        return 'Plafond';
      case 'sol':
      case 'surfacenettesol':
        return 'Sol';
      case 'aucune':
        return 'Aucune';
      default:
        return 'Mur'; // Valeur par défaut si non reconnue
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!nom.trim() || hauteur <= 0 || largeur <= 0) {
      alert("Veuillez remplir tous les champs obligatoires.");
      return;
    }
    
    const typeData: TypeMenuiserie = {
      id: typeToEdit ? typeToEdit.id : uuidv4(),
      nom: nom.trim(),
      hauteur: Number(hauteur),
      largeur: Number(largeur),
      surfaceReference,
      impactePlinthe,
      description: description.trim()
    };
    
    onSubmit(typeData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {typeToEdit ? 'Modifier le type de menuiserie' : 'Ajouter un type de menuiserie'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="nom">Nom du type</Label>
              <Input
                id="nom"
                value={nom}
                onChange={(e) => setNom(e.target.value)}
                placeholder="Ex: Fenêtre standard"
                required
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="hauteur">Hauteur (cm)</Label>
                <Input
                  id="hauteur"
                  type="number"
                  value={hauteur}
                  onChange={(e) => setHauteur(Number(e.target.value))}
                  min="0"
                  step="0.01"
                  required
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="largeur">Largeur (cm)</Label>
                <Input
                  id="largeur"
                  type="number"
                  value={largeur}
                  onChange={(e) => setLargeur(Number(e.target.value))}
                  min="0"
                  step="0.01"
                  required
                />
              </div>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="surfaceReference">Surface impactée</Label>
              <Select 
                value={surfaceReference} 
                onValueChange={(value) => setSurfaceReference(value as SurfaceImpactee)}
              >
                <SelectTrigger id="surfaceReference">
                  <SelectValue placeholder="Sélectionner une surface de référence" />
                </SelectTrigger>
                <SelectContent>
                  {surfaceOptions.map((surface) => (
                    <SelectItem key={surface.value} value={surface.value}>
                      {surface.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <Label>Impact sur les plinthes</Label>
              <RadioGroup 
                value={impactePlinthe ? "true" : "false"} 
                onValueChange={(value) => setImpactePlinthe(value === "true")}
                className="flex space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="true" id="plinthe-oui" />
                  <Label htmlFor="plinthe-oui">Oui</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="false" id="plinthe-non" />
                  <Label htmlFor="plinthe-non">Non</Label>
                </div>
              </RadioGroup>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="description">Description (optionnelle)</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Description du type de menuiserie"
                rows={3}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" type="button" onClick={onClose}>Annuler</Button>
            <Button type="submit">
              {typeToEdit ? 'Mettre à jour' : 'Ajouter'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TypeMenuiserieForm;
