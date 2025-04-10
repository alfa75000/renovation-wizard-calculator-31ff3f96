
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
  const maxLength = 100;
  const charactersLeft = maxLength - descriptionProjet.length;
  const isNearLimit = charactersLeft < 20;
  
  return (
    <div>
      <Label htmlFor="descriptionProjet">Description du projet ({maxLength} caractères max)</Label>
      <Textarea 
        id="descriptionProjet" 
        value={descriptionProjet} 
        onChange={(e) => {
          if (e.target.value.length <= maxLength) {
            setDescriptionProjet(e.target.value);
          }
        }}
        placeholder="Description détaillée des travaux"
        rows={2}
        maxLength={maxLength}
      />
      <div className={`text-xs text-right mt-1 ${isNearLimit ? 'text-amber-500 font-medium' : 'text-gray-500'}`}>
        {descriptionProjet.length}/{maxLength} caractères
      </div>
    </div>
  );
};
