
import React from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useProject } from "@/contexts/ProjectContext";
import { useTravaux } from "@/features/travaux/hooks/useTravaux";
import { generateDetailsPDF } from "@/services/pdfGenerationService";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface DevisDetailsPreviewProps {
  open: boolean;
  onClose: () => void;
}

export const DevisDetailsPreview: React.FC<DevisDetailsPreviewProps> = ({ 
  open, 
  onClose 
}) => {
  const { state } = useProject();
  const { rooms, metadata } = state;
  const { travaux, getTravauxForPiece } = useTravaux();
  
  const handleGeneratePDF = async () => {
    try {
      await generateDetailsPDF(rooms, travaux, getTravauxForPiece, metadata);
    } catch (error) {
      console.error("Erreur lors de la génération du PDF:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle>Aperçu des Détails des Travaux</DialogTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>
        
        <div className="mt-4 border rounded-md p-6 bg-white min-h-[600px]">
          {rooms.map((room) => {
            const travauxPiece = getTravauxForPiece(room.id);
            if (travauxPiece.length === 0) return null;
            
            return (
              <div key={room.id} className="mb-6">
                <div className="text-[9pt] font-semibold bg-gray-100 p-2 mb-2">
                  {room.name}
                </div>
                
                <table className="w-full mb-4 text-[9pt]">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-1">Description</th>
                      <th className="text-right p-1">Quantité</th>
                      <th className="text-right p-1">Prix Unitaire HT</th>
                      <th className="text-right p-1">TVA</th>
                      <th className="text-right p-1">Total HT</th>
                    </tr>
                  </thead>
                  <tbody>
                    {travauxPiece.map((travail) => {
                      const prixUnitaireHT = travail.prixFournitures + travail.prixMainOeuvre;
                      const totalHT = prixUnitaireHT * travail.quantite;
                      
                      return (
                        <tr key={travail.id} className="border-b">
                          <td className="p-1">
                            <div className="text-[9pt] font-medium">
                              {travail.typeTravauxLabel}: {travail.sousTypeLabel}
                            </div>
                            {travail.description && (
                              <div className="text-[8pt] text-gray-600">
                                {travail.description}
                              </div>
                            )}
                            {travail.personnalisation && (
                              <div className="text-[8pt] text-gray-600 italic">
                                {travail.personnalisation}
                              </div>
                            )}
                            <div className="text-[8pt] text-gray-600">
                              MO: {travail.prixMainOeuvre.toFixed(2)}€/u, Fourn: {travail.prixFournitures.toFixed(2)}€/u 
                              (total: {prixUnitaireHT.toFixed(2)}€/u)
                            </div>
                          </td>
                          <td className="text-right p-1">{travail.quantite} {travail.unite}</td>
                          <td className="text-right p-1">{prixUnitaireHT.toFixed(2)}€</td>
                          <td className="text-right p-1">{travail.tauxTVA}%</td>
                          <td className="text-right p-1 font-medium">{totalHT.toFixed(2)}€</td>
                        </tr>
                      );
                    })}
                    
                    {/* Total de la pièce */}
                    <tr className="bg-gray-50">
                      <td colSpan={4} className="text-left p-1 text-[9pt] font-medium">
                        Total HT {room.name}
                      </td>
                      <td className="text-right p-1 text-[9pt] font-medium">
                        {travauxPiece.reduce((sum, t) => {
                          return sum + (t.prixFournitures + t.prixMainOeuvre) * t.quantite;
                        }, 0).toFixed(2)}€
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            );
          })}

          {/* En-tête du PDF (simulation) */}
          <div className="absolute top-6 right-6 text-[9pt]">
            DEVIS N° {metadata?.devisNumber || 'XXXX-XX'} - page 1/1
          </div>
        </div>
        
        <div className="flex justify-end space-x-2 mt-4">
          <Button variant="outline" onClick={onClose}>
            Fermer
          </Button>
          <Button onClick={handleGeneratePDF}>
            Générer PDF
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
