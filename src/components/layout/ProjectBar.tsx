
import React from 'react';
import { Button } from '../ui/button';
import { FilePlus2, FolderOpen, Save, SaveAll } from 'lucide-react';
import { useProject } from '@/contexts/ProjectContext';

interface ProjectBarProps {
  onNewProject: () => void;
  onOpenProject: () => void;
  onSaveProject: () => void;
  onSaveAsProject: () => void;
}

export const ProjectBar: React.FC<ProjectBarProps> = ({
  onNewProject,
  onOpenProject,
  onSaveProject,
  onSaveAsProject
}) => {
  const { currentProjectId, projects } = useProject();
  
  // Trouver le projet actuel dans la liste des projets
  const currentProject = projects.find(p => p.id === currentProjectId);
  
  // Obtenir le nom d'affichage
  let projectDisplayName = "Projet sans titre";
  
  if (currentProject?.name) {
    projectDisplayName = currentProject.name;
  } else if (currentProjectId) {
    // Si nous avons un ID mais pas de nom, c'est un cas bizarre, mais afficher l'ID
    projectDisplayName = `Projet #${currentProjectId.substring(0, 8)}`;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-2 mb-2 flex flex-wrap items-center justify-between border-b">
      <div className="flex space-x-2 mb-2 md:mb-0">
        <Button variant="outline" size="sm" onClick={onNewProject}>
          <FilePlus2 className="mr-1" size={16} />
          Nouveau
        </Button>
        <Button variant="outline" size="sm" onClick={onOpenProject}>
          <FolderOpen className="mr-1" size={16} />
          Ouvrir
        </Button>
        <Button variant="outline" size="sm" onClick={onSaveProject}>
          <Save className="mr-1" size={16} />
          Enregistrer
        </Button>
        <Button variant="outline" size="sm" onClick={onSaveAsProject}>
          <SaveAll className="mr-1" size={16} />
          Enregistrer Sous
        </Button>
      </div>
      <div className="bg-gray-100 px-3 py-1 rounded-md text-gray-800 border">
        <span className="text-gray-500 mr-1">Projet en cours:</span>
        <span className="font-medium">{projectDisplayName}</span>
      </div>
    </div>
  );
};
