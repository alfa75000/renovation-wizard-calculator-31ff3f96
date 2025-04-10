
import React from "react";
import { formaterPrix } from "@/lib/utils";
import { Travail } from "@/types";

interface GlobalTotalsProps {
  travaux: Travail[];
}

const GlobalTotals: React.FC<GlobalTotalsProps> = ({ travaux }) => {
  // Calcul des totaux généraux
  const totalFournitures = travaux.reduce((sum, t) => sum + t.prixFournitures * t.quantite, 0);
  const totalMainOeuvre = travaux.reduce((sum, t) => sum + t.prixMainOeuvre * t.quantite, 0);
  const totalHT = totalFournitures + totalMainOeuvre;
  const totalTVA = travaux.reduce((sum, t) => {
    const prixHT = (t.prixFournitures + t.prixMainOeuvre) * t.quantite;
    const montantTVA = prixHT * (t.tauxTVA / 100);
    return sum + montantTVA;
  }, 0);
  const totalTTC = totalHT + totalTVA;

  return (
    <div className="bg-blue-50 p-4 rounded-md mt-6">
      <h3 className="text-lg font-semibold mb-4">Total</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-3 rounded-md shadow-sm">
          <p className="text-sm text-gray-500">Total fournitures HT</p>
          <p className="font-bold text-lg">{formaterPrix(totalFournitures)}</p>
        </div>
        <div className="bg-white p-3 rounded-md shadow-sm">
          <p className="text-sm text-gray-500">Total main d'œuvre HT</p>
          <p className="font-bold text-lg">{formaterPrix(totalMainOeuvre)}</p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        <div className="bg-white p-3 rounded-md shadow-sm">
          <p className="text-sm text-gray-500">Total HT</p>
          <p className="font-bold text-lg">{formaterPrix(totalHT)}</p>
        </div>
        <div className="bg-white p-3 rounded-md shadow-sm">
          <p className="text-sm text-gray-500">Total TVA</p>
          <p className="font-bold text-lg">{formaterPrix(totalTVA)}</p>
        </div>
        <div className="bg-blue-100 p-3 rounded-md shadow-sm">
          <p className="text-blue-800 font-medium">Total TTC</p>
          <p className="font-bold text-lg">{formaterPrix(totalTTC)}</p>
        </div>
      </div>
    </div>
  );
};

export default GlobalTotals;
