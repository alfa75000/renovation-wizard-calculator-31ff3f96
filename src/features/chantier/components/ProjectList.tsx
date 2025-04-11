
import React from 'react';
import { Project } from '@/types';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useClients } from '@/contexts/ClientsContext';
import { ProjectState } from '@/types';
import { Badge } from '@/components/ui/badge';
import { FileText, User, Calendar, MapPin, Clock } from 'lucide-react';

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
    return <p className="text-gray-500 italic p-4">Aucun projet enregistré</p>;
  }
  
  return (
    <div className="divide-y">
      {projects.map((projet) => {
        const client = clientsState.clients.find(c => c.id === projet.client_id);
        const isCurrentProject = currentProjectId === projet.id;
        const hasRooms = projectState.rooms.length > 0 && isCurrentProject;
        
        const updateDate = projet.updated_at 
          ? new Date(projet.updated_at)
          : new Date(projet.created_at);
          
        const creationDate = new Date(projet.created_at);
        
        return (
          <div 
            key={projet.id} 
            className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${isCurrentProject ? 'bg-primary/5' : ''}`}
            onClick={() => onSelectProject(projet.id)}
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium text-base">{projet.name}</h3>
                
                <div className="mt-2 flex flex-wrap gap-2">
                  {client && (
                    <div className="flex items-center text-sm text-gray-600">
                      <User size={14} className="mr-1" />
                      {client.nom} {client.prenom}
                    </div>
                  )}
                  
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar size={14} className="mr-1" />
                    {format(creationDate, 'dd MMM yyyy', { locale: fr })}
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock size={14} className="mr-1" />
                    {format(updateDate, 'dd MMM yyyy', { locale: fr })}
                  </div>
                  
                  {projet.address && (
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin size={14} className="mr-1" />
                      {projet.address}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex flex-col items-end gap-2">
                {projet.devis_number && (
                  <Badge variant="outline" className="flex items-center gap-1 bg-blue-50">
                    <FileText size={12} />
                    Devis n° {projet.devis_number}
                  </Badge>
                )}
                
                {isCurrentProject && (
                  <Badge variant="secondary" className="bg-green-50 text-green-800 border-green-200">
                    En cours
                  </Badge>
                )}
              </div>
            </div>
            
            {hasRooms && (
              <div className="mt-2 flex gap-2">
                <Badge variant="outline" className="bg-primary/5">
                  {projectState.rooms.length} pièce{projectState.rooms.length > 1 ? 's' : ''}
                </Badge>
                <Badge variant="outline" className="bg-primary/5">
                  {projectState.travaux.length} travaux
                </Badge>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
