import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../ui/dialog';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { toast } from 'sonner';

interface SaveAsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  dialogTitle?: string;
  saveFunction?: (devisNumber: string) => Promise<boolean>;
}

export const SaveAsDialog: React.FC<SaveAsDialogProps> = ({
  open,
  onOpenChange,
  dialogTitle = "Enregistrer Sous",
  saveFunction
}) => {
  const { handleSaveAsProject } = useProjectOperations();
  const { state: projectState } = useProject();

  const [newDevisNumber, setNewDevisNumber] = useState<string>('');
  const [isSaving, setIsSaving] = useState<boolean>(false);

  useEffect(() => {
    if (open && projectState?.metadata?.devisNumber) {
      setNewDevisNumber(projectState.metadata.devisNumber);
    } else if (open) {
      setNewDevisNumber('');
    }
    setIsSaving(false);
  }, [open, projectState?.metadata?.devisNumber]);

  const handleSave = async () => {
    if (!newDevisNumber.trim()) {
      toast.error("Veuillez entrer un numéro de devis.");
      return;
    }

    setIsSaving(true);
    try {
      const saveFn = saveFunction || handleSaveAsProject;
      
      if (typeof saveFn !== 'function') {
        console.error("La fonction de sauvegarde n'est pas disponible:", saveFn);
        toast.error("Erreur: La fonction de sauvegarde n'est pas disponible");
        return;
      }
      
      const success = await saveFn(newDevisNumber.trim());

      if (success) {
        onOpenChange(false);
      }
    } catch (error) {
      console.error("Erreur lors de l'enregistrement sous:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{dialogTitle}</DialogTitle>
          <DialogDescription>
            Entrez un nouveau numéro de devis pour enregistrer une copie de ce projet.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="devis-number" className="text-right">
              Numéro de Devis
            </Label>
            <Input
              id="devis-number"
              className="col-span-3"
              value={newDevisNumber}
              onChange={(e) => setNewDevisNumber(e.target.value)}
              placeholder="EX-2023-001"
              disabled={isSaving}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSaving}>
            Annuler
          </Button>
          <Button onClick={handleSave} disabled={isSaving || !newDevisNumber.trim()}>
            {isSaving ? 'Enregistrement...' : 'Enregistrer Sous'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};