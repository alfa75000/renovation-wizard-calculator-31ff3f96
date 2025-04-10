
import React from 'react';
import { ProjectList } from './ProjectList';
import { ProjectSummary } from './ProjectSummary';
import { Project, ProjectState } from '@/types';

interface ProjectSidebarProps {
  projects: Project[];
  currentProjectId: string | null;
  projectState: ProjectState;
  isLoading: boolean;
  hasUnsavedChanges: boolean;
  onSelectProject: (id: string) => void;
}

export const ProjectSidebar: React.FC<ProjectSidebarProps> = ({
  projects,
  currentProjectId,
  projectState,
  isLoading,
  hasUnsavedChanges,
  onSelectProject
}) => {
  return (
    <div className="md:col-span-1">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4 border-b pb-2">Projets enregistrés</h2>
        
        <ProjectList 
          projects={projects}
          currentProjectId={currentProjectId}
          projectState={projectState}
          isLoading={isLoading}
          onSelectProject={onSelectProject}
        />
      </div>
      
      <div className="mt-6 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4 border-b pb-2">Résumé du projet</h2>
        
        <ProjectSummary 
          projectState={projectState}
          hasUnsavedChanges={hasUnsavedChanges}
        />
      </div>
    </div>
  );
};
