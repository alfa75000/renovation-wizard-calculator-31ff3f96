
import React from 'react';
import { Project } from '@/types';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useClients } from '@/contexts/ClientsContext';
import { ProjectState } from '@/types';

interface ProjectListProps {
  projects: Project[];
  currentProjectId: string | null;
  projectState: ProjectState;
  isLoading: boolean;
  onSelectProject: (projectId: string) => void;
}

export const ProjectList: React.FC<ProjectListProps> = ({
  projects,
  currentProjectId,
  projectState,
  isLoading,
  onSelectProject
}) => {
  const { state: clientsState } = useClients();
  
  if (isLoading) {
    return (
      <div className="py-4 text-center text-gray-500">
        Chargement des projets...
      </div>
    );
  }
  
  if (projects.length === 0) {
    return <p className="text-gray-500 italic">Aucun projet enregistré</p>;
  }
  
  return (
    <div className="space-y-4">
      {projects.map((projet) => {
        const client = clientsState.clients.find(c => c.id === projet.client_id);
        return (
          <div 
            key={projet.id} 
            className={`p-3 border rounded-md cursor-pointer hover:bg-gray-50 transition-colors ${currentProjectId === projet.id ? 'border-primary bg-primary/5' : 'border-gray-200'}`}
            onClick={() => onSelectProject(projet.id)}
          >
            <h3 className="font-medium">{projet.name}</h3>
            {projet.devis_number && (
              <p className="text-xs text-blue-600 font-medium">
                Devis n° {projet.devis_number}
              </p>
            )}
            {client && (
              <p className="text-sm text-gray-500">
                Client: {client.nom} {client.prenom}
              </p>
            )}
            <p className="text-sm text-gray-500">
              {projet.updated_at 
                ? format(new Date(projet.updated_at), 'dd/MM/yyyy', { locale: fr }) 
                : format(new Date(projet.created_at), 'dd/MM/yyyy', { locale: fr })}
            </p>
            {projectState.rooms.length > 0 && currentProjectId === projet.id && (
              <div className="mt-1 text-xs text-green-600">
                <span className="inline-block px-2 py-1 bg-green-50 rounded-full">
                  {projectState.rooms.length} pièces | {projectState.travaux.length} travaux
                </span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
