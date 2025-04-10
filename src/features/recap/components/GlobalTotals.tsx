
import React from "react";
import { Travail } from "@/types";
import TotauxRecap from "./TotauxRecap";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { calculerTotalTTC, calculerTotalHT } from "@/features/travaux/utils/travauxUtils";

interface GlobalTotalsProps {
  travaux: Travail[];
  showCard?: boolean;
  title?: string;
}

const GlobalTotals: React.FC<GlobalTotalsProps> = ({ 
  travaux, 
  showCard = true,
  title = "Total global des travaux" 
}) => {
  if (travaux.length === 0) return null;
  
  // Calcul rapide des totaux pour le résumé
  const totalTTC = travaux.reduce((sum, travail) => sum + calculerTotalTTC(travail), 0);
  const totalHT = travaux.reduce((sum, travail) => sum + calculerTotalHT(travail), 0);
  
  const TotauxContent = () => (
    <TotauxRecap 
      travaux={travaux} 
      label={title}
      showDetails={true}
    />
  );
  
  if (showCard) {
    return (
      <Card className="mt-8 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl font-medium text-primary">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground mb-4">
            Résumé des totaux pour {travaux.length} travaux
          </div>
          <TotauxContent />
        </CardContent>
      </Card>
    );
  }
  
  return (
    <div className="mt-8 border-t-2 border-gray-200 pt-4">
      <TotauxContent />
    </div>
  );
};

export default GlobalTotals;
