
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Printer } from 'lucide-react';
import { useTravaux } from '@/features/travaux/hooks/useTravaux';
import { useProject } from '@/contexts/ProjectContext';
import { generateDetailsPDF } from '@/services/pdf/pdfMainGenerator';

const DevisDetailsPreview: React.FC = () => {
  const { travaux, getTravauxForPiece } = useTravaux();
  const { state: { rooms, metadata } } = useProject();
  const [isLoading, setIsLoading] = useState(false);

  const handlePrintDetails = async () => {
    setIsLoading(true);
    try {
      await generateDetailsPDF(rooms, travaux, getTravauxForPiece, metadata);
    } catch (error) {
      console.error("Erreur lors de la génération du PDF des détails:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="border rounded-lg p-4 bg-white shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Aperçu des détails</h3>
        <Button 
          onClick={handlePrintDetails}
          disabled={isLoading}
          className="flex items-center gap-2"
        >
          <Printer className="h-4 w-4" />
          {isLoading ? "Génération..." : "Imprimer les détails"}
        </Button>
      </div>

      <div className="border rounded p-4 min-h-[400px] bg-gray-50">
        <div className="text-center text-xl font-bold mb-6">DÉTAILS DES TRAVAUX</div>
        
        {/* Aperçu simplifié des pièces et travaux */}
        {rooms.map(room => {
          const travauxPiece = getTravauxForPiece(room.id);
          if (travauxPiece.length === 0) return null;
          
          return (
            <div key={room.id} className="mb-6">
              <div className="font-medium text-lg mb-2 bg-gray-100 p-1">{room.name}</div>
              
              {travauxPiece.map((travail, index) => {
                const total = (travail.prixFournitures + travail.prixMainOeuvre) * travail.quantite;
                
                return (
                  <div key={travail.id} className="mb-3 pl-2 border-l-2 border-gray-200">
                    <div className="font-medium">{travail.typeTravauxLabel}: {travail.sousTypeLabel}</div>
                    <div className="text-sm text-gray-600">{travail.description}</div>
                    <div className="flex justify-between text-sm mt-1">
                      <span>
                        {travail.quantite} {travail.unite} × {(travail.prixFournitures + travail.prixMainOeuvre).toLocaleString('fr-FR')} €
                      </span>
                      <span className="font-medium">{total.toLocaleString('fr-FR')} €</span>
                    </div>
                  </div>
                );
              })}
              
              <div className="flex justify-between font-medium border-t pt-1 mt-2">
                <span>Total {room.name}</span>
                <span>
                  {travauxPiece.reduce((sum, t) => sum + (t.prixFournitures + t.prixMainOeuvre) * t.quantite, 0).toLocaleString('fr-FR')} €
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DevisDetailsPreview;
