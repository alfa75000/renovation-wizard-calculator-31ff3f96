
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
          <TableBody>
            {rooms.map(room => {
              const travauxPiece = getTravauxForPiece(room.id);
              if (travauxPiece.length === 0) return null;

              // Calculer les montants pour cette pièce
              const totalHTRoom = calculerTotalHTTravaux(travauxPiece);
              const totalTVARoom = travauxPiece.reduce((acc, travail) => acc + calculerMontantTVA(travail), 0);
              const totalTTCRoom = calculerTotalTTCTravaux(travauxPiece);

              return (
                <TableRow key={room.id}>
                  <TableCell className="font-medium text-left">
                    Total {room.name}
                  </TableCell>
                  <TableCell className="text-right">
                    HT: {formaterPrix(totalHTRoom)}
                  </TableCell>
                  <TableCell className="text-right">
                    TVA: {formaterPrix(totalTVARoom)}
                  </TableCell>
                  <TableCell className="text-right">
                    TTC: {formaterPrix(totalTTCRoom)}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell className="font-bold text-right" colSpan={2}>Montant Total HT</TableCell>
              <TableCell className="text-right" colSpan={2}>{formaterPrix(totalHT)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-bold text-right" colSpan={2}>Total TVA</TableCell>
              <TableCell className="text-right" colSpan={2}>{formaterPrix(totalTVA)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-bold text-right" colSpan={2}>Montant Total TTC</TableCell>
              <TableCell className="text-right" colSpan={2}>{formaterPrix(totalTTC)}</TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>
    </div>
  );
};

export default RecapitulatifTravaux;
