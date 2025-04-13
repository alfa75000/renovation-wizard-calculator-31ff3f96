
import React from 'react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Service } from "@/types/supabase";
import { RefreshCw, AlertTriangle, Info } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { updateService } from "@/services/travauxService";
import { toast } from "sonner";

interface UpdateServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentService: Service | null;
  updatedService: Partial<Service>;
  onConfirmUpdate: (updateType: 'update' | 'create') => Promise<void>;
}

const formatValue = (value: any): string => {
  if (value === null || value === undefined) return 'Non défini';
  if (typeof value === 'number') return value.toFixed(2);
  return String(value);
};

const UpdateServiceModal: React.FC<UpdateServiceModalProps> = ({
  isOpen,
  onClose,
  currentService,
  updatedService,
  onConfirmUpdate
}) => {
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = React.useState(false);
  const [updateType, setUpdateType] = React.useState<'update' | 'create'>('update');
  const [isLoading, setIsLoading] = React.useState(false);

  if (!currentService) return null;

  const hasChanges = Object.keys(updatedService).some(key => {
    // @ts-ignore - Comparaison dynamique des champs
    return updatedService[key] !== currentService[key];
  });

  const handleUpdate = async () => {
    setIsLoading(true);
    try {
      await onConfirmUpdate(updateType);
      onClose();
    } catch (error) {
      console.error("Erreur lors de la mise à jour du service:", error);
      toast.error("Échec de la mise à jour du service");
    } finally {
      setIsLoading(false);
      setIsConfirmDialogOpen(false);
    }
  };

  const confirmUpdate = (type: 'update' | 'create') => {
    setUpdateType(type);
    setIsConfirmDialogOpen(true);
  };

  const renderComparisonRow = (label: string, currentValue: any, newValue: any, fieldName: string) => {
    // @ts-ignore - Accès dynamique aux propriétés
    const hasChanged = newValue !== undefined && newValue !== currentService[fieldName];
    
    return (
      <div className="grid grid-cols-3 gap-2 py-2 border-b last:border-0">
        <div className="font-medium">{label}</div>
        <div className="text-gray-700">{formatValue(currentValue)}</div>
        <div className={`${hasChanged ? 'text-blue-600 font-semibold' : 'text-gray-700'}`}>
          {hasChanged && <span className="mr-1">→</span>}
          {formatValue(newValue !== undefined ? newValue : currentValue)}
        </div>
      </div>
    );
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <RefreshCw className="h-5 w-5" />
              Mise à jour de la prestation
            </DialogTitle>
            <DialogDescription>
              Comparez les données actuelles avec les modifications que vous souhaitez appliquer.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {!currentService.last_update_date && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-md flex items-start gap-2">
                <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-amber-800">
                  Cette prestation n'a jamais été mise à jour. Assurez-vous que les modifications sont correctes.
                </p>
              </div>
            )}
            
            {currentService.last_update_date && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-md flex items-start gap-2">
                <Info className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-blue-800">
                  Dernière mise à jour: <Badge variant="outline">{currentService.last_update_date}</Badge>
                </p>
              </div>
            )}

            <div className="border rounded-md overflow-hidden">
              <div className="bg-gray-100 p-2 grid grid-cols-3 font-semibold">
                <div>Champ</div>
                <div>Valeur actuelle</div>
                <div>Nouvelle valeur</div>
              </div>
              
              <div className="p-2 space-y-1">
                {renderComparisonRow("Nom", currentService.name, updatedService.name, "name")}
                {renderComparisonRow("Description", currentService.description, updatedService.description, "description")}
                {renderComparisonRow("Prix fournitures", currentService.supply_price, updatedService.supply_price, "supply_price")}
                {renderComparisonRow("Prix main d'œuvre", currentService.labor_price, updatedService.labor_price, "labor_price")}
                {renderComparisonRow("Unité", currentService.unit, updatedService.unit, "unit")}
                {renderComparisonRow("Surface impactée", currentService.surface_impactee, updatedService.surface_impactee, "surface_impactee")}
              </div>
            </div>
          </div>

          <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:justify-between">
            <div className="flex gap-2">
              <Button variant="outline" onClick={onClose}>
                Annuler
              </Button>
            </div>
            <div className="flex gap-2">
              <Button 
                onClick={() => confirmUpdate('create')}
                variant="secondary"
              >
                Ajouter comme nouvelle prestation
              </Button>
              <Button 
                onClick={() => confirmUpdate('update')}
                variant="destructive"
                disabled={!hasChanges}
              >
                Mettre à jour et écraser
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {updateType === 'update' ? 'Confirmer le remplacement' : 'Confirmer l\'ajout'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {updateType === 'update' 
                ? `Vous êtes sur le point de remplacer la prestation "${currentService.name}". Cette action est irréversible et affectera tous les travaux utilisant cette prestation.`
                : `Vous êtes sur le point d'ajouter une nouvelle prestation basée sur "${currentService.name}".`
              }
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleUpdate} disabled={isLoading}>
              {isLoading ? "En cours..." : updateType === 'update' ? "Remplacer" : "Ajouter"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default UpdateServiceModal;
