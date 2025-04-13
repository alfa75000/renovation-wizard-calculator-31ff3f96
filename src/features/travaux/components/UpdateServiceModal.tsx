import React, { useState } from 'react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Service, UniteType, SurfaceImpactee } from "@/types/supabase";
import { RefreshCw, AlertTriangle, Info } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from 'sonner';

interface UpdateServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentService: Service | null;
  updatedService: Partial<Service>;
  onConfirmUpdate: (updateType: 'update' | 'create', serviceData: Partial<Service>) => Promise<Service | null>;
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
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [updateType, setUpdateType] = useState<'update' | 'create'>('update');
  const [isLoading, setIsLoading] = useState(false);
  
  const [editedService, setEditedService] = useState<Partial<Service>>(updatedService);

  if (!currentService) return null;

  const hasChanges = Object.keys(editedService).some(key => {
    return editedService[key] !== currentService[key];
  });

  const handleInputChange = (field: keyof Service, value: any) => {
    setEditedService(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleUpdate = async () => {
    console.log("--- DEBUG: Entrée dans handleUpdate ---");
    console.log("--- DEBUG: Type d'opération:", updateType);
    console.log("--- DEBUG: Service édité:", editedService);
    
    setIsLoading(true);
    try {
      console.log("Tentative de mise à jour avec:", {
        updateType,
        serviceData: editedService,
        serviceId: currentService?.id 
      });
      
      const result = await onConfirmUpdate(updateType, editedService);
      console.log("--- DEBUG: Résultat de onConfirmUpdate:", result);
      
      if (result) {
        console.log(`Service ${updateType === 'update' ? 'mis à jour' : 'créé'} avec succès:`, result);
        toast.success(`Service ${updateType === 'update' ? 'mis à jour' : 'créé'} avec succès`);
        onClose();
      } else {
        console.error(`Échec de la ${updateType === 'update' ? 'mise à jour' : 'création'} du service`);
        toast.error(`Échec de la ${updateType === 'update' ? 'mise à jour' : 'création'} du service`);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
      console.error("Erreur lors de la mise à jour du service:", error);
      toast.error(`Échec de la ${updateType === 'update' ? 'mise à jour' : 'création'} du service: ${errorMessage}`);
    } finally {
      setIsLoading(false);
      setIsConfirmDialogOpen(false);
    }
  };

  const confirmUpdate = (type: 'update' | 'create') => {
    console.log("--- DEBUG: Entrée dans confirmUpdate avec type:", type);
    setUpdateType(type);
    setIsConfirmDialogOpen(true);
  };

  const renderComparisonRow = (
    label: string, 
    currentValue: any, 
    fieldName: keyof Service, 
    inputType: 'text' | 'number' | 'textarea' | 'select' = 'text',
    options?: {value: string, label: string}[]
  ) => {
    const initialValue = editedService[fieldName];
    const hasChanged = initialValue !== undefined && initialValue !== currentService[fieldName];
    
    return (
      <div className="grid grid-cols-3 gap-2 py-2 border-b last:border-0">
        <div className="font-medium">{label}</div>
        <div className="text-gray-700">{formatValue(currentValue)}</div>
        <div className={`${hasChanged ? 'text-blue-600' : 'text-gray-700'}`}>
          {inputType === 'text' && (
            <Input 
              value={editedService[fieldName] as string || ''} 
              onChange={(e) => handleInputChange(fieldName, e.target.value)}
              className="h-8 text-sm"
            />
          )}
          {inputType === 'number' && (
            <Input 
              type="number"
              value={editedService[fieldName] as number || 0} 
              onChange={(e) => handleInputChange(fieldName, parseFloat(e.target.value) || 0)}
              className="h-8 text-sm"
              step="0.01"
            />
          )}
          {inputType === 'textarea' && (
            <Textarea 
              value={editedService[fieldName] as string || ''} 
              onChange={(e) => handleInputChange(fieldName, e.target.value)}
              className="text-sm min-h-[60px]"
              rows={2}
            />
          )}
          {inputType === 'select' && options && (
            <Select 
              value={editedService[fieldName] as string} 
              onValueChange={(value) => handleInputChange(fieldName, value)}
            >
              <SelectTrigger className="h-8 text-sm">
                <SelectValue placeholder="Sélectionner..." />
              </SelectTrigger>
              <SelectContent>
                {options.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
      </div>
    );
  };

  const uniteOptions = [
    { value: 'M²', label: 'M²' },
    { value: 'Unité', label: 'Unité' },
    { value: 'Ens.', label: 'Ens.' },
    { value: 'Ml', label: 'Ml' },
    { value: 'M³', label: 'M³' },
    { value: 'Forfait', label: 'Forfait' }
  ];

  const surfaceOptions = [
    { value: 'Mur', label: 'Mur' },
    { value: 'Plafond', label: 'Plafond' },
    { value: 'Sol', label: 'Sol' },
    { value: 'Aucune', label: 'Aucune' }
  ];

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
              Comparez et modifiez les données que vous souhaitez mettre à jour.
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
                {renderComparisonRow("Nom", currentService.name, "name", "text")}
                {renderComparisonRow("Description", currentService.description, "description", "textarea")}
                {renderComparisonRow("Prix fournitures", currentService.supply_price, "supply_price", "number")}
                {renderComparisonRow("Prix main d'œuvre", currentService.labor_price, "labor_price", "number")}
                {renderComparisonRow("Unité", currentService.unit, "unit", "select", uniteOptions)}
                {renderComparisonRow("Surface impactée", currentService.surface_impactee, "surface_impactee", "select", surfaceOptions)}
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
                onClick={() => {
                  console.log("Bouton 'Ajouter comme nouvelle prestation' cliqué");
                  confirmUpdate('create');
                }}
                variant="secondary"
              >
                Ajouter comme nouvelle prestation
              </Button>
              <Button 
                onClick={() => {
                  console.log("Bouton 'Mettre à jour et écraser' cliqué");
                  confirmUpdate('update');
                }}
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
            <AlertDialogAction 
              onClick={(e) => {
                console.log("--- DEBUG: Bouton d'action AlertDialog cliqué");
                e.preventDefault(); // Empêche l'action par défaut
                handleUpdate(); // Appelle handleUpdate manuellement
              }} 
              disabled={isLoading}
            >
              {isLoading ? "En cours..." : updateType === 'update' ? "Remplacer" : "Ajouter"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default UpdateServiceModal;
