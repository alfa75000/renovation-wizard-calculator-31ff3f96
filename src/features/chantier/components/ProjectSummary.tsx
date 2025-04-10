
import React from 'react';
import { ProjectState } from '@/types';
import { Badge } from '@/components/ui/badge';

interface ProjectSummaryProps {
  projectState: ProjectState;
  hasUnsavedChanges: boolean;
  currentProjectName?: string;
}

export const ProjectSummary: React.FC<ProjectSummaryProps> = ({ 
  projectState, 
  hasUnsavedChanges,
  currentProjectName
}) => {
  const { property, rooms } = projectState;
  
  return (
    <div className="space-y-4">
      {hasUnsavedChanges && (
        <div className="mb-4">
          <Badge variant="outline" className="text-amber-500 border-amber-500">
            Modifications non enregistrées
          </Badge>
        </div>
      )}
      
      <div>
        <h3 className="font-medium">Nom du projet</h3>
        <p className="text-gray-600">{currentProjectName || "Non défini"}</p>
      </div>
      
      <div>
        <h3 className="font-medium">Type de propriété</h3>
        <p className="text-gray-600">{property.type || "Non défini"}</p>
      </div>
      
      <div>
        <h3 className="font-medium">Nombre d'étages</h3>
        <p className="text-gray-600">{property.floors}</p>
      </div>
      
      <div>
        <h3 className="font-medium">Surface totale</h3>
        <p className="text-gray-600">{property.totalArea > 0 ? `${property.totalArea} m²` : "Non définie"}</p>
      </div>
      
      <div>
        <h3 className="font-medium">Nombre de pièces</h3>
        <p className="text-gray-600">{rooms.length > 0 ? rooms.length : "Aucune pièce"}</p>
      </div>
    </div>
  );
};
