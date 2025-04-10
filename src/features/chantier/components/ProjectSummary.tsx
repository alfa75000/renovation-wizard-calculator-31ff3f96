
import React from 'react';
import { ProjectState } from '@/types';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

interface ProjectSummaryProps {
  projectState: ProjectState;
  hasUnsavedChanges: boolean;
}

export const ProjectSummary: React.FC<ProjectSummaryProps> = ({
  projectState,
  hasUnsavedChanges
}) => {
  if (projectState.rooms.length === 0) {
    return (
      <Alert className="bg-amber-50 border-amber-200">
        <AlertTitle>Aucune pièce définie</AlertTitle>
        <AlertDescription>
          Commencez par définir les pièces de votre projet dans la page d'accueil.
        </AlertDescription>
      </Alert>
    );
  }
  
  return (
    <div>
      <p><span className="font-semibold">Pièces:</span> {projectState.rooms.length}</p>
      <p><span className="font-semibold">Type de propriété:</span> {projectState.property.type}</p>
      <p><span className="font-semibold">Surface totale:</span> {projectState.property.totalArea} m²</p>
      <p><span className="font-semibold">Nombre de travaux:</span> {projectState.travaux.length}</p>
      
      {hasUnsavedChanges && (
        <div className="mt-4 p-2 bg-amber-50 border border-amber-200 rounded-md text-sm text-amber-600">
          Ce projet contient des modifications non enregistrées
        </div>
      )}
    </div>
  );
};
