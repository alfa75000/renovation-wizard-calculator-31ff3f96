
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface ProjectAddressFieldsProps {
  adresseChantier: string;
  setAdresseChantier: (adresse: string) => void;
  occupant: string;
  setOccupant: (occupant: string) => void;
  infoComplementaire: string;
  setInfoComplementaire: (info: string) => void;
}

export const ProjectAddressFields: React.FC<ProjectAddressFieldsProps> = ({
  adresseChantier,
  setAdresseChantier,
  occupant,
  setOccupant,
  infoComplementaire,
  setInfoComplementaire
}) => {
  return (
    <div className="space-y-3">
      <div>
        <Label htmlFor="adresseChantier">Adresse du chantier</Label>
        <Input 
          id="adresseChantier" 
          value={adresseChantier} 
          onChange={(e) => setAdresseChantier(e.target.value)}
          placeholder="Ex: 15 rue de la Paix, 75001 Paris" 
        />
      </div>
      
      <div>
        <Label htmlFor="occupant">Occupant</Label>
        <Input 
          id="occupant" 
          value={occupant} 
          onChange={(e) => setOccupant(e.target.value)}
          placeholder="Nom de l'occupant si différent du client"
        />
      </div>
      
      <div>
        <Label htmlFor="infoComplementaire">Informations complémentaires</Label>
        <Textarea 
          id="infoComplementaire" 
          value={infoComplementaire} 
          onChange={(e) => setInfoComplementaire(e.target.value)}
          placeholder="Autres informations importantes"
          rows={3}
        />
      </div>
    </div>
  );
};
