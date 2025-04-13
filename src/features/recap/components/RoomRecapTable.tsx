
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

interface RoomRecapTableProps {
  room: Room;
  travaux: Travail[];
  className?: string;
}

const RoomRecapTable: React.FC<RoomRecapTableProps> = ({ 
  room, 
  travaux,
  className = ""
}) => {
  if (travaux.length === 0) {
    return null;
  }

  // Calculer le total HT pour cette pièce
  const totalHT = calculerTotalHTTravaux(travaux);

  return (
    <div className={`mb-8 ${className}`}>
      <h3 className="text-lg font-semibold mb-2 border-b pb-2">
        {room.name} ({room.surface.toFixed(2)} m²)
      </h3>
      
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-left">Description</TableHead>
              <TableHead className="text-right">Quantité</TableHead>
              <TableHead className="text-right">Prix unitaire HT</TableHead>
              <TableHead className="text-right">TVA</TableHead>
              <TableHead className="text-right">Total HT</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {travaux.map(travail => (
              <TravailRecapRow key={travail.id} travail={travail} />
            ))}
          </TableBody>
          <TableRow className="bg-gray-50 font-medium">
            <TableCell colSpan={4} className="text-left">
              Total HT {room.name}
            </TableCell>
            <TableCell className="text-right">
              {formaterPrix(totalHT)}
            </TableCell>
          </TableRow>
        </Table>
      </div>
    </div>
  );
};

export default RoomRecapTable;
