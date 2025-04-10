
import React from "react";
import { formaterPrix } from "@/lib/utils";
import { Room, Travail } from "@/types";
import TravailRecapRow from "./TravailRecapRow";

interface RoomRecapTableProps {
  room: Room;
  travaux: Travail[];
}

const RoomRecapTable: React.FC<RoomRecapTableProps> = ({ room, travaux }) => {
  if (travaux.length === 0) return null;
  
  const totalPieceFournitures = travaux.reduce((sum, t) => sum + t.prixFournitures * t.quantite, 0);
  const totalPieceMainOeuvre = travaux.reduce((sum, t) => sum + t.prixMainOeuvre * t.quantite, 0);
  const totalPieceHT = totalPieceFournitures + totalPieceMainOeuvre;
  const totalPieceTVA = travaux.reduce((sum, t) => {
    const prixHT = (t.prixFournitures + t.prixMainOeuvre) * t.quantite;
    const montantTVA = prixHT * (t.tauxTVA / 100);
    return sum + montantTVA;
  }, 0);
  const totalPieceTTC = totalPieceHT + totalPieceTVA;
  
  return (
    <div className="mb-6 border-b pb-6 last:border-b-0 last:pb-0">
      <h3 className="text-lg font-medium mb-3">{room.name}</h3>
      
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 py-2 text-left w-3/5">Prestation(s)</th>
              <th className="px-3 py-2 text-right">Quantité</th>
              <th className="px-3 py-2 text-right">P.U. HT</th>
              <th className="px-3 py-2 text-right">TVA</th>
              <th className="px-3 py-2 text-right">Total TTC</th>
            </tr>
          </thead>
          <tbody>
            {travaux.map(travail => (
              <TravailRecapRow key={travail.id} travail={travail} />
            ))}
          </tbody>
          <tfoot className="bg-gray-50">
            <tr>
              <td className="px-3 py-2 text-left italic text-sm">
                MO HT: {formaterPrix(totalPieceMainOeuvre)}, 
                Fourn. HT: {formaterPrix(totalPieceFournitures)}, 
                TVA: {formaterPrix(totalPieceTVA)}
                ({formaterPrix(totalPieceTTC)})
              </td>
              <td colSpan={3} className="px-3 py-2 text-right font-medium">Total HT pour {room.name}:</td>
              <td className="px-3 py-2 text-right font-bold">{formaterPrix(totalPieceHT)}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

export default RoomRecapTable;
