
import React from "react";
import { Travail } from "@/types";
import TotauxRecap from "./TotauxRecap";

interface GlobalTotalsProps {
  travaux: Travail[];
}

const GlobalTotals: React.FC<GlobalTotalsProps> = ({ travaux }) => {
  if (travaux.length === 0) return null;
  
  return (
    <div className="mt-8 border-t-2 border-gray-200 pt-4">
      <TotauxRecap 
        travaux={travaux} 
        label="Total global des travaux" 
        showDetails={true}
      />
    </div>
  );
};

export default GlobalTotals;
