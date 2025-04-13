
import React from "react";
import { formaterPrix } from "@/lib/utils";
import { 
  calculerTotalHTTravaux, 
  calculerTotalTTCTravaux,
  grouperTravauxParTVA,
  calculerTotalHT,
  calculerMontantTVA
} from "@/features/travaux/utils/travauxUtils";
import { Travail } from "@/types";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface TotauxRecapProps {
  travaux: Travail[];
  label?: string;
  className?: string;
  showDetails?: boolean;
}

const TotauxRecap: React.FC<TotauxRecapProps> = ({ 
  travaux, 
  label = "Total", 
  className = "", 
  showDetails = false 
}) => {
  // Si aucun travail, n'affiche rien
  if (travaux.length === 0) return null;
  
  // Calculer les totaux
  const totalHT = calculerTotalHTTravaux(travaux);
  const totalTTC = calculerTotalTTCTravaux(travaux);
  
  // Grouper les travaux par TVA pour afficher les détails
  const travauxParTVA = grouperTravauxParTVA(travaux);
  const tauxTVA = Object.keys(travauxParTVA).map(Number).sort();
  
  // Calculer les montants de TVA par taux
  const montantsTVA = tauxTVA.map(taux => {
    const travauxTaux = travauxParTVA[taux];
    const totalHTTaux = travauxTaux.reduce((sum, travail) => 
      sum + calculerTotalHT(travail), 0);
    const montantTVA = travauxTaux.reduce((sum, travail) => 
      sum + calculerMontantTVA(travail), 0);
    
    return { taux, totalHTTaux, montantTVA };
  });

  // Affichage simplifié si on ne veut pas les détails
  if (!showDetails) {
    return (
      <div className={`flex justify-between items-center font-medium ${className}`}>
        <span>{label}:</span>
        <div className="space-y-1">
          <div className="text-base font-bold">HT: {formaterPrix(totalHT)}</div>
          <div className="text-sm text-gray-600">TTC: {formaterPrix(totalTTC)}</div>
        </div>
      </div>
    );
  }

  // Affichage détaillé avec Table
  return (
    <div className={`${className}`}>
      <h3 className="text-lg font-semibold mb-4">{label}</h3>
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-left">Description</TableHead>
            <TableHead className="text-right">Montant</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>Total HT</TableCell>
            <TableCell className="text-right font-bold">{formaterPrix(totalHT)}</TableCell>
          </TableRow>
          
          {montantsTVA.map(({ taux, totalHTTaux, montantTVA }) => (
            <TableRow key={taux}>
              <TableCell className="pl-8">
                TVA {taux}% (sur {formaterPrix(totalHTTaux)})
              </TableCell>
              <TableCell className="text-right">{formaterPrix(montantTVA)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell>Total TTC</TableCell>
            <TableCell className="text-right">{formaterPrix(totalTTC)}</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
};

export default TotauxRecap;
