
import React from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface ProjectDescriptionFieldProps {
  descriptionProjet: string;
  setDescriptionProjet: (description: string) => void;
}

export const ProjectDescriptionField: React.FC<ProjectDescriptionFieldProps> = ({
  descriptionProjet,
  setDescriptionProjet
}) => {
  return (
    <div>
      <Label htmlFor="descriptionProjet">Description du projet (100 caractères max)</Label>
      <Textarea 
        id="descriptionProjet" 
        value={descriptionProjet} 
        onChange={(e) => {
          if (e.target.value.length <= 100) {
            setDescriptionProjet(e.target.value);
          }
        }}
        placeholder="Description détaillée des travaux"
        rows={2}
        maxLength={100}
      />
      <div className="text-xs text-gray-500 text-right mt-1">
        {descriptionProjet.length}/100 caractères
      </div>
    </div>
  );
};
