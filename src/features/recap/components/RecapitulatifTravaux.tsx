
import React from "react";
import { Room, Travail } from "@/types";
import { formaterPrix } from "@/lib/utils";
import { 
  calculerTotalHTTravaux,
  calculerMontantTVA,
  calculerTotalTTCTravaux
} from "@/features/travaux/utils/travauxUtils";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface RecapitulatifTravauxProps {
  rooms: Room[];
  travaux: Travail[];
  getTravauxForPiece: (pieceId: string) => Travail[];
}

const RecapitulatifTravaux: React.FC<RecapitulatifTravauxProps> = ({ 
  rooms, 
  travaux, 
  getTravauxForPiece 
}) => {
  // Calculer les totaux globaux
  const totalHT = calculerTotalHTTravaux(travaux);
  const totalTVA = travaux.reduce((acc, travail) => acc + calculerMontantTVA(travail), 0);
  const totalTTC = calculerTotalTTCTravaux(travaux);

  if (travaux.length === 0) {
    return <div className="text-center text-gray-500">Aucun travail n'a été ajouté.</div>;
  }

  return (
    <div className="space-y-8">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-left">Pièce</TableHead>
              <TableHead className="text-right">Montant HT</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rooms.map(room => {
              const travauxPiece = getTravauxForPiece(room.id);
              if (travauxPiece.length === 0) return null;

              // Calculer le total HT pour cette pièce
              const totalHTRoom = calculerTotalHTTravaux(travauxPiece);

              return (
                <TableRow key={room.id}>
                  <TableCell className="font-medium">Total HT {room.name}</TableCell>
                  <TableCell className="text-right">{formaterPrix(totalHTRoom)}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell className="font-bold">TOTAL HT</TableCell>
              <TableCell className="text-right font-bold">{formaterPrix(totalHT)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-bold">TOTAL TVA</TableCell>
              <TableCell className="text-right font-bold">{formaterPrix(totalTVA)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-bold">TOTAL TTC</TableCell>
              <TableCell className="text-right font-bold">{formaterPrix(totalTTC)}</TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>
    </div>
  );
};

export default RecapitulatifTravaux;
