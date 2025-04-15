
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
      {/* Tableau principal avec les totaux par pièce */}
      <div className="border rounded">
        <Table>
          <TableHeader>
            <TableRow className="border-b">
              <TableHead className="text-center text-base font-bold p-4 w-full" colSpan={2}>
                RÉCAPITULATIF
              </TableHead>
            </TableRow>
            <TableRow>
              <TableHead className="text-left font-bold p-4"></TableHead>
              <TableHead className="text-right font-bold p-4">Montant HT</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rooms.map(room => {
              const travauxPiece = getTravauxForPiece(room.id);
              if (travauxPiece.length === 0) return null;

              // Calculer le total HT pour cette pièce
              const totalHTRoom = calculerTotalHTTravaux(travauxPiece);

              return (
                <TableRow key={room.id} className="border-b">
                  <TableCell className="font-bold p-4">Total HT {room.name}</TableCell>
                  <TableCell className="text-right text-blue-600 font-medium p-4">
                    {formaterPrix(totalHTRoom)}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* Tableau des totaux généraux - aligné à droite */}
      <div className="flex justify-end">
        <div className="w-1/3 border rounded">
          <Table>
            <TableBody>
              <TableRow className="border-b">
                <TableCell className="font-bold p-4">Total HT</TableCell>
                <TableCell className="text-right text-blue-600 font-medium p-4">
                  {formaterPrix(totalHT)}
                </TableCell>
              </TableRow>
              <TableRow className="border-b">
                <TableCell className="font-bold p-4">Total TVA</TableCell>
                <TableCell className="text-right text-blue-600 font-medium p-4">
                  {formaterPrix(totalTVA)}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-bold p-4">Total TTC</TableCell>
                <TableCell className="text-right text-blue-600 font-medium p-4">
                  {formaterPrix(totalTTC)}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default RecapitulatifTravaux;
