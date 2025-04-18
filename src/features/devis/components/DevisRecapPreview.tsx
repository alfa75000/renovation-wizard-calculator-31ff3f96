
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { generateRecapPDF } from '@/services/pdf/pdfMainGenerator';
import { useTravaux } from '@/features/travaux/hooks/useTravaux';
import { useProject } from '@/contexts/ProjectContext';
import { Printer } from 'lucide-react';

const DevisRecapPreview: React.FC = () => {
  const { travaux, getTravauxForPiece } = useTravaux();
  const { state: { rooms, metadata } } = useProject();
  const [isLoading, setIsLoading] = useState(false);

  const handlePrintRecap = async () => {
    setIsLoading(true);
    try {
      await generateRecapPDF(rooms, travaux, getTravauxForPiece, metadata);
    } catch (error) {
      console.error("Erreur lors de la génération du PDF récapitulatif:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="border rounded-lg p-4 bg-white shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Aperçu du récapitulatif</h3>
        <Button 
          onClick={handlePrintRecap}
          disabled={isLoading}
          className="flex items-center gap-2"
        >
          <Printer className="h-4 w-4" />
          {isLoading ? "Génération..." : "Imprimer le récapitulatif"}
        </Button>
      </div>

      <div className="border rounded p-4 min-h-[400px] bg-gray-50">
        <div className="text-center text-xl font-bold mb-6">RÉCAPITULATIF</div>
        
        {/* Aperçu simplifié des pièces */}
        {rooms.map(room => {
          const travauxPiece = getTravauxForPiece(room.id);
          if (travauxPiece.length === 0) return null;
          
          const roomTotal = travauxPiece.reduce((sum, t) => {
            return sum + (t.prixFournitures + t.prixMainOeuvre) * t.quantite;
          }, 0);
          
          return (
            <div key={room.id} className="mb-2 flex justify-between border-b pb-1">
              <span>{room.name}</span>
              <span className="font-medium">{roomTotal.toLocaleString('fr-FR')} €</span>
            </div>
          );
        })}
        
        {/* Calcul des totaux */}
        {(() => {
          const totalHT = travaux.reduce((sum, t) => {
            return sum + (t.prixFournitures + t.prixMainOeuvre) * t.quantite;
          }, 0);
          
          const totalTVA = travaux.reduce((sum, t) => {
            const total = (t.prixFournitures + t.prixMainOeuvre) * t.quantite;
            return sum + (total * t.tauxTVA / 100);
          }, 0);
          
          const totalTTC = totalHT + totalTVA;
          
          return (
            <div className="mt-6 space-y-2">
              <div className="flex justify-between">
                <span>Total HT</span>
                <span>{totalHT.toLocaleString('fr-FR')} €</span>
              </div>
              <div className="flex justify-between">
                <span>Total TVA</span>
                <span>{totalTVA.toLocaleString('fr-FR')} €</span>
              </div>
              <div className="flex justify-between font-bold border-t pt-2 mt-2">
                <span>Total TTC</span>
                <span>{totalTTC.toLocaleString('fr-FR')} €</span>
              </div>
            </div>
          );
        })()}
      </div>
    </div>
  );
};

export default DevisRecapPreview;
