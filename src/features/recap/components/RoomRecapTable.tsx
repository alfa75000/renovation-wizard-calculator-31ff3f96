
import React from "react";
import { Room, Travail } from "@/types";
import TravailRecapRow from "./TravailRecapRow";
import TotauxRecap from "./TotauxRecap";
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

  return (
    <div className={`mb-8 ${className}`}>
      <h3 className="text-lg font-semibold mb-2 border-b pb-2">
        {room.name} ({room.surface.toFixed(2)} m²)
      </h3>
      
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Description</TableHead>
              <TableHead className="text-right">Quantité</TableHead>
              <TableHead className="text-right">Prix unitaire HT</TableHead>
              <TableHead className="text-right">TVA</TableHead>
              <TableHead className="text-right">Total TTC</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {travaux.map(travail => (
              <TravailRecapRow key={travail.id} travail={travail} />
            ))}
          </TableBody>
          <TableRow className="bg-gray-50 font-medium">
            <TableCell colSpan={3}>
              Total pour {room.name}
            </TableCell>
            <TableCell colSpan={2} className="text-right">
              <TotauxRecap 
                travaux={travaux} 
                className="justify-end"
              />
            </TableCell>
          </TableRow>
        </Table>
      </div>
    </div>
  );
};

export default RoomRecapTable;
