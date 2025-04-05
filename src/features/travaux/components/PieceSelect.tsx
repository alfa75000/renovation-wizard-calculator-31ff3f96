
import React from 'react';
import { Button } from "@/components/ui/button";
import { Piece } from '@/types';

interface PieceSelectProps {
  pieces: Piece[];
  selectedPieceId: string | null;  // Modifié: number -> string
  onSelect: (pieceId: string) => void;  // Modifié: number -> string
}

const PieceSelect: React.FC<PieceSelectProps> = ({ 
  pieces, 
  selectedPieceId, 
  onSelect 
}) => {
  return (
    <div className="flex flex-col space-y-2">
      {pieces.length > 0 ? (
        pieces.map(piece => (
          <Button
            key={piece.id}
            variant={selectedPieceId === piece.id ? "default" : "outline"}  // Comparaison directe sans conversion
            className="justify-start"
            onClick={() => onSelect(piece.id)}  // Pas de conversion en nombre
          >
            {piece.nom || piece.name} ({piece.surface?.toFixed(2) || "0.00"} m²)
          </Button>
        ))
      ) : (
        <div className="text-center py-4 text-gray-500">
          <p>Aucune pièce disponible.</p>
          <p className="text-sm mt-1">Ajoutez des pièces depuis l'estimateur principal.</p>
        </div>
      )}
    </div>
  );
};

export default PieceSelect;
