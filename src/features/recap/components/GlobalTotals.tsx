
import React from "react";
import { formaterPrix } from "@/lib/utils";
import { Travail } from "@/types";
import { 
  calculerTotalHTTravaux, 
  calculerTotalTTCTravaux, 
  grouperTravauxParTVA,
  calculerTotalHT,
  calculerMontantTVA
} from "@/features/travaux/utils/travauxUtils";

interface GlobalTotalsProps {
  travaux: Travail[];
}

const GlobalTotals: React.FC<GlobalTotalsProps> = ({ travaux }) => {
  // Utiliser les fonctions utilitaires pour calculer les totaux
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

  return (
    <div className="mt-8 border-t-2 border-gray-200 pt-4">
      <h3 className="text-lg font-semibold mb-4">Total global des travaux</h3>
      
      <div className="space-y-2 mb-4">
        <div className="flex justify-between text-gray-700">
          <span>Total HT:</span>
          <span className="font-medium">{formaterPrix(totalHT)}</span>
        </div>
        
        {montantsTVA.map(({ taux, totalHTTaux, montantTVA }) => (
          <div key={taux} className="flex justify-between text-gray-700 pl-4">
            <span>TVA {taux}% (sur {formaterPrix(totalHTTaux)}):</span>
            <span>{formaterPrix(montantTVA)}</span>
          </div>
        ))}
        
        <div className="flex justify-between font-bold text-lg pt-2 border-t">
          <span>Total TTC:</span>
          <span>{formaterPrix(totalTTC)}</span>
        </div>
      </div>
    </div>
  );
};

export default GlobalTotals;
