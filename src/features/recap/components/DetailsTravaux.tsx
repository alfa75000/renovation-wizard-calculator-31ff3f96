
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
              <TableHead className="text-center">Prix HT Unitaire</TableHead>
              <TableHead className="text-right">TVA</TableHead>
              <TableHead className="text-right">Total HT</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rooms.map(room => {
              const travauxPiece = getTravauxForPiece(room.id);
              if (travauxPiece.length === 0) return null;

              // Calculer le total HT pour cette pièce
              const totalHT = calculerTotalHTTravaux(travauxPiece);

              return (
                <React.Fragment key={room.id}>
                  {/* Nom de la pièce - aligné à gauche */}
                  <TableRow className="bg-gray-100">
                    <TableCell colSpan={5} className="font-semibold text-left">
                      {room.name}
                    </TableCell>
                  </TableRow>
                  
                  {/* Liste des travaux de la pièce */}
                  {travauxPiece.map(travail => (
                    <TravailRecapRow key={travail.id} travail={travail} />
                  ))}
                  
                  {/* Total de la pièce */}
                  <TableRow className="bg-gray-50 font-medium">
                    <TableCell colSpan={4} className="text-left">
                      Total HT {room.name}
                    </TableCell>
                    <TableCell className="text-right">
                      {formaterPrix(totalHT)}
                    </TableCell>
                  </TableRow>
                </React.Fragment>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default DetailsTravaux;
