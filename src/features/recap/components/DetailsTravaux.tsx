
import React from "react";
import { Room, Travail } from "@/types";
import TravailRecapRow from "./TravailRecapRow";
import { formaterPrix } from "@/lib/utils";
import { calculerTotalHTTravaux } from "@/features/travaux/utils/travauxUtils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface DetailsTravauxProps {
  rooms: Room[];
  travaux: Travail[];
  getTravauxForPiece: (pieceId: string) => Travail[];
}

const DetailsTravaux: React.FC<DetailsTravauxProps> = ({ 
  rooms, 
  travaux, 
  getTravauxForPiece 
}) => {
  if (travaux.length === 0) {
    return <div className="text-center text-gray-500">Aucun travail n'a été ajouté.</div>;
  }

  return (
    <div className="space-y-8">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-center">Description</TableHead>
              <TableHead className="text-right">Quantité</TableHead>
              <TableHead className="text-right">Prix unitaire HT</TableHead>
              <TableHead className="text-right">TVA</TableHead>
              <TableHead className="text-right">Total HT</TableHead>
            </TableRow>
          </TableHeader>
        </Table>
      </div>

      {/* Affichage des pièces et travaux */}
      {rooms.map(room => {
        const travauxPiece = getTravauxForPiece(room.id);
        if (travauxPiece.length === 0) return null;

        // Calculer le total HT pour cette pièce
        const totalHT = calculerTotalHTTravaux(travauxPiece);

        return (
          <div key={room.id} className="mb-6">
            <h3 className="text-lg font-semibold mb-2 border-b pb-2 text-left">
              {room.name}
            </h3>
            
            <div className="overflow-x-auto">
              <Table>
                <TableBody>
                  {travauxPiece.map(travail => (
                    <TravailRecapRow key={travail.id} travail={travail} />
                  ))}
                  <TableRow className="bg-gray-50 font-medium">
                    <TableCell colSpan={4} className="text-left">
                      Total HT {room.name}
                    </TableCell>
                    <TableCell className="text-right">
                      {formaterPrix(totalHT)}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default DetailsTravaux;
