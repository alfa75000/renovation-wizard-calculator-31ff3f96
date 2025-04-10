
import React from "react";
import { formaterPrix } from "@/lib/utils";
import { Travail } from "@/types";

interface TravailRecapRowProps {
  travail: Travail;
}

const TravailRecapRow: React.FC<TravailRecapRowProps> = ({ travail }) => {
  const prixUnitaireHT = travail.prixFournitures + travail.prixMainOeuvre;
  const totalHT = prixUnitaireHT * travail.quantite;
  const montantTVA = totalHT * (travail.tauxTVA / 100);
  const totalTTC = totalHT + montantTVA;
  
  return (
    <tr className="border-b">
      <td className="px-3 py-2">
        <div>{travail.typeTravauxLabel}: {travail.sousTypeLabel}</div>
        {travail.description && (
          <div className="text-xs text-gray-600 mt-1 italic">
            {travail.description}
          </div>
        )}
        {travail.personnalisation && (
          <div className="text-xs text-gray-600 mt-1 italic">
            {travail.personnalisation}
          </div>
        )}
        <div className="text-xs text-gray-600 mt-1">
          MO: {formaterPrix(travail.prixMainOeuvre)}/u, Fourn: {formaterPrix(travail.prixFournitures)}/u 
          (total: {formaterPrix(prixUnitaireHT)}/u)
        </div>
      </td>
      <td className="px-3 py-2 text-right">{travail.quantite} {travail.unite}</td>
      <td className="px-3 py-2 text-right">{formaterPrix(prixUnitaireHT)}</td>
      <td className="px-3 py-2 text-right">{travail.tauxTVA}%</td>
      <td className="px-3 py-2 text-right font-medium">{formaterPrix(totalTTC)}</td>
    </tr>
  );
};

export default TravailRecapRow;
