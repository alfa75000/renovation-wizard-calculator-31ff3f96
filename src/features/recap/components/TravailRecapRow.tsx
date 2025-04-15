
import React from "react";
import { formaterPrix } from "@/lib/utils";
import { Travail } from "@/types";
import { 
  calculerPrixUnitaireHT, 
  calculerTotalHT
} from "@/features/travaux/utils/travauxUtils";
import { TableCell, TableRow } from "@/components/ui/table";

interface TravailRecapRowProps {
  travail: Travail;
}

const TravailRecapRow: React.FC<TravailRecapRowProps> = ({ travail }) => {
  const prixUnitaireHT = calculerPrixUnitaireHT(travail);
  const totalHT = calculerTotalHT(travail);
  
  return (
    <TableRow>
      <TableCell className="text-left">
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
      </TableCell>
      <TableCell className="text-right">{travail.quantite} {travail.unite}</TableCell>
      <TableCell className="text-right">{formaterPrix(prixUnitaireHT)}</TableCell>
      <TableCell className="text-right">{travail.tauxTVA}%</TableCell>
      <TableCell className="text-right font-medium">{formaterPrix(totalHT)}</TableCell>
    </TableRow>
  );
};

export default TravailRecapRow;
