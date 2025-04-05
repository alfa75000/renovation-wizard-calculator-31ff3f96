
import React from 'react';
import { Button } from "@/components/ui/button";
import { Piece } from '@/types';

interface PieceSelectProps {
  pieces: Piece[];
  selectedPieceId: number | null;
  onSelect: (pieceId: number) => void;
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
            variant={selectedPieceId === Number(piece.id) ? "default" : "outline"}
            className="justify-start"
            onClick={() => onSelect(Number(piece.id))}
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
