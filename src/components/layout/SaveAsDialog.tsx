// src/components/layout/SaveAsDialog.tsx
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../ui/dialog';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { toast } from 'sonner';
// Importer la bonne fonction depuis le hook d'opérations
import { useProjectOperations } from '@/features/chantier/hooks/useProjectOperations';
// Importer useProject seulement si on veut pré-remplir avec le nom actuel
import { useProject } from '@/contexts/ProjectContext';

interface SaveAsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  dialogTitle?: string;
}

export const SaveAsDialog: React.FC<SaveAsDialogProps> = ({
  open,
  onOpenChange,
  dialogTitle = "Enregistrer Sous"
}) => {
  // Récupérer UNIQUEMENT la fonction handleSaveProjectAs et l'état pour pré-remplir
  const { handleSaveProjectAs } = useProjectOperations();
  const { state: projectState } = useProject(); // Pour le nom actuel

  // État local UNIQUEMENT pour le nouveau nom
  const [newProjectName, setNewProjectName] = useState<string>('');
  const [isSaving, setIsSaving] = useState<boolean>(false);

  // Pré-remplir le champ avec le nom actuel lorsque la modale s'ouvre
  useEffect(() => {
    if (open && projectState?.metadata?.nomProjet) {
      // Suggérer le nom actuel, l'utilisateur peut le modifier
      setNewProjectName(projectState.metadata.nomProjet);
    } else if (open) {
      // Si pas de nom actuel, laisser vide
      setNewProjectName('');
    }
    // Réinitialiser l'état de sauvegarde quand la modale se ferme ou s'ouvre
    setIsSaving(false);
  }, [open, projectState?.metadata?.nomProjet]);

  // Fonction de sauvegarde simplifiée
  const handleSave = async () => {
    if (!newProjectName || newProjectName.trim() === '') {
      toast.error("Veuillez entrer un nom pour le projet.");
      return;
    }

    setIsSaving(true);
    try {
      // Appeler la fonction dédiée "Enregistrer Sous" avec le nom saisi
      const success = await handleSaveProjectAs(newProjectName.trim());

      if (success) {
        // La fonction handleSaveProjectAs gère déjà les toasts et la mise à jour de l'état
        onOpenChange(false); // Fermer la modale en cas de succès
      }
      // Le finally gère le isSaving = false
    } catch (error) {
       // Normalement, handleSaveProjectAs devrait déjà afficher un toast d'erreur
       // mais on peut log ici au cas où.
       console.error("Erreur renvoyée par handleSaveProjectAs:", error);
    } finally {
       // S'assurer que l'état de sauvegarde est réinitialisé
       setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{dialogTitle}</DialogTitle>
          <DialogDescription>
            Entrez un nouveau nom pour enregistrer une copie de ce projet.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="project-name-save-as" className="text-right">
              Nouveau nom
            </Label>
            {/* Input éditable pour le nouveau nom */}
            <Input
              id="project-name-save-as"
              className="col-span-3"
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
              placeholder="Nom de la nouvelle sauvegarde"
              disabled={isSaving} // Désactiver pendant la sauvegarde
            />
          </div>
          {/* Autres champs retirés */}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSaving}>
            Annuler
          </Button>
          {/* Le bouton Enregistrer appelle maintenant handleSave */}
          <Button onClick={handleSave} disabled={isSaving || !newProjectName.trim()}>
            {isSaving ? 'Enregistrement...' : 'Enregistrer Sous'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};