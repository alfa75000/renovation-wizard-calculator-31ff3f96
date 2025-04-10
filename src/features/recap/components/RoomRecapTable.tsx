
import React from "react";
import { Room, Travail } from "@/types";
import { formaterPrix } from "@/lib/utils";
import TravailRecapRow from "./TravailRecapRow";
import { 
  calculerTotalHTTravaux, 
  calculerTotalTTCTravaux 
} from "@/features/travaux/utils/travauxUtils";

interface RoomRecapTableProps {
  room: Room;
  travaux: Travail[];
}

const RoomRecapTable: React.FC<RoomRecapTableProps> = ({ room, travaux }) => {
  if (travaux.length === 0) {
    return null;
  }

  // Utiliser les fonctions utilitaires pour calculer les totaux
  const totalHT = calculerTotalHTTravaux(travaux);
  const totalTTC = calculerTotalTTCTravaux(travaux);

  return (
    <div className="mb-8">
      <h3 className="text-lg font-semibold mb-2 border-b pb-2">
        {room.name} ({room.surface.toFixed(2)} m²)
      </h3>
      
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 py-2 text-left">Description</th>
              <th className="px-3 py-2 text-right">Quantité</th>
              <th className="px-3 py-2 text-right">Prix unitaire HT</th>
              <th className="px-3 py-2 text-right">TVA</th>
              <th className="px-3 py-2 text-right">Total TTC</th>
            </tr>
          </thead>
          <tbody>
            {travaux.map(travail => (
              <TravailRecapRow key={travail.id} travail={travail} />
            ))}
            
            <tr className="bg-gray-50 font-medium">
              <td colSpan={3} className="px-3 py-2">
                Total pour {room.name}
              </td>
              <td className="px-3 py-2 text-right">
                {formaterPrix(totalHT)}
              </td>
              <td className="px-3 py-2 text-right">
                {formaterPrix(totalTTC)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RoomRecapTable;
