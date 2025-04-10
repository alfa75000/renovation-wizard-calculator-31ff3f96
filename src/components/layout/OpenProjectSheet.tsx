
import React from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from '../ui/sheet';
import { Button } from '../ui/button';
import { useProject } from '@/contexts/ProjectContext';
import { useClients } from '@/contexts/ClientsContext';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { toast } from 'sonner';

interface OpenProjectSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const OpenProjectSheet: React.FC<OpenProjectSheetProps> = ({
  open,
  onOpenChange
}) => {
  const { projects, loadProject } = useProject();
  const { state: clientsState } = useClients();
  
  const handleLoadProject = async (projectId: string) => {
    try {
      await loadProject(projectId);
      onOpenChange(false);
      toast.success('Projet chargé avec succès');
    } catch (error) {
      console.error('Erreur lors du chargement du projet:', error);
      toast.error('Erreur lors du chargement du projet');
    }
  };
  
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Ouvrir un projet</SheetTitle>
        </SheetHeader>
        <div className="py-4">
          <div className="space-y-4">
            {projects.length === 0 ? (
              <div className="text-center text-gray-500 my-8">
                Aucun projet disponible
              </div>
            ) : (
              projects.map((project) => {
                const client = clientsState.clients.find(c => c.id === project.client_id);
                return (
                  <div 
                    key={project.id}
                    className="p-4 border rounded-md hover:bg-gray-50 cursor-pointer flex justify-between items-center"
                    onClick={() => handleLoadProject(project.id)}
                  >
                    <div>
                      <h3 className="font-medium">{project.name}</h3>
                      {project.devis_number && (
                        <p className="text-xs text-blue-600 font-medium">
                          Devis n° {project.devis_number}
                        </p>
                      )}
                      {client && (
                        <p className="text-sm text-gray-500">
                          Client: {client.nom} {client.prenom}
                        </p>
                      )}
                      <p className="text-sm text-gray-500">
                        {project.updated_at 
                          ? format(new Date(project.updated_at), 'dd/MM/yyyy', { locale: fr }) 
                          : format(new Date(project.created_at), 'dd/MM/yyyy', { locale: fr })}
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      Ouvrir
                    </Button>
                  </div>
                );
              })
            )}
          </div>
        </div>
        <SheetFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Fermer
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};
