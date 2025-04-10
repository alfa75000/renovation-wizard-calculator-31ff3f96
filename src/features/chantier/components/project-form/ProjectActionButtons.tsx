
import React from 'react';
import { Button } from '@/components/ui/button';
import { Trash } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

interface ProjectActionButtonsProps {
  currentProjectId: string | null;
  isLoading: boolean;
  onSaveProject: () => void;
  onDeleteProject: () => void;
}

export const ProjectActionButtons: React.FC<ProjectActionButtonsProps> = ({
  currentProjectId,
  isLoading,
  onSaveProject,
  onDeleteProject
}) => {
  const navigate = useNavigate();
  
  return (
    <div className="pt-4 flex flex-wrap gap-4">
      {currentProjectId && (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button 
              variant="destructive" 
              disabled={isLoading}
              className="flex items-center gap-2"
            >
              <Trash className="h-4 w-4" />
              Supprimer projet
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Êtes-vous sûr de vouloir supprimer ce projet ?</AlertDialogTitle>
              <AlertDialogDescription>
                Cette action est irréversible. Toutes les données du projet seront définitivement supprimées.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Annuler</AlertDialogCancel>
              <AlertDialogAction 
                onClick={onDeleteProject}
                className="bg-red-500 hover:bg-red-600"
              >
                Supprimer
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
      
      <Button 
        variant="default" 
        onClick={onSaveProject}
        className="ml-auto"
        disabled={isLoading}
      >
        Enregistrer
      </Button>
      
      <Button 
        variant="outline" 
        onClick={() => navigate('/travaux')}
      >
        Aller aux travaux
      </Button>
    </div>
  );
};
