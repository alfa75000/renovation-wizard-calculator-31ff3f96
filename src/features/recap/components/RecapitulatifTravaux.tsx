
import React from "react";
import { Room, Travail } from "@/types";
import { formaterPrix } from "@/lib/utils";
import { 
  calculerTotalHTTravaux, 
  calculerMontantTVA,
  calculerTotalTTCTravaux
} from "@/features/travaux/utils/travauxUtils";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface RecapitulatifTravauxProps {
  rooms: Room[];
  travaux: Travail[];
  getTravauxForPiece: (pieceId: string) => Travail[];
}

const RecapitulatifTravaux: React.FC<RecapitulatifTravauxProps> = ({ 
  rooms, 
  travaux, 
  getTravauxForPiece 
}) => {
  // Calculer les totaux globaux
  const totalHT = calculerTotalHTTravaux(travaux);
  const totalTVA = travaux.reduce((acc, travail) => acc + calculerMontantTVA(travail), 0);
  const totalTTC = calculerTotalTTCTravaux(travaux);

  // Fonction pour formater les détails de MO et fournitures selon le nouveau format
  const formatTravauxDetails = (travail: Travail): string => {
    const prixUnitaireHT = travail.prixFournitures + travail.prixMainOeuvre;
    const totalHT = prixUnitaireHT * travail.quantite;
    const montantTVA = (totalHT * travail.tauxTVA) / 100;
    
    return `[ MO: ${formaterPrix(travail.prixMainOeuvre)}/u ] [ Fourn: ${formaterPrix(travail.prixFournitures)}/u ] [ Total HT: ${formaterPrix(prixUnitaireHT)}/u ] [ Total TVA (${travail.tauxTVA}%): ${formaterPrix(montantTVA)} ]`;
  };

  if (travaux.length === 0) {
    return <div className="text-center text-gray-500">Aucun travail n'a été ajouté.</div>;
  }

  return (
    <div className="space-y-8">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50%] text-center">Désignation</TableHead>
              <TableHead className="text-right">Total HT</TableHead>
              <TableHead className="text-right">Total TVA</TableHead>
              <TableHead className="text-right">Total TTC</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rooms.map(room => {
              const travauxPiece = getTravauxForPiece(room.id);
              if (travauxPiece.length === 0) return null;

              // Calculer les montants pour cette pièce
              const totalHTRoom = calculerTotalHTTravaux(travauxPiece);
              const totalTVARoom = travauxPiece.reduce((acc, travail) => acc + calculerMontantTVA(travail), 0);
              const totalTTCRoom = calculerTotalTTCTravaux(travauxPiece);

              return (
                <TableRow key={room.id}>
                  <TableCell className="font-medium text-left">
                    <div className="space-y-4">
                      <div className="font-semibold">{room.name}</div>
                      
                      {/* Afficher chaque travail avec le nouveau format pour MO/Fournitures */}
                      {travauxPiece.map(travail => (
                        <div key={travail.id} className="pl-4 border-l-2 border-gray-200 space-y-2">
                          <div className="font-medium">{travail.typeTravauxLabel}: {travail.sousTypeLabel}</div>
                          {travail.description && <div className="text-sm text-gray-600">{travail.description}</div>}
                          {travail.personnalisation && <div className="text-sm text-blue-600">{travail.personnalisation}</div>}
                          
                          {/* Nouveau format pour la ligne MO/Fournitures (Modification n°3) */}
                          <div className="text-xs text-gray-500">{formatTravauxDetails(travail)}</div>
                          
                          <div className="text-sm">
                            Quantité: {travail.quantite} {travail.unite} × Prix unitaire HT: {formaterPrix(travail.prixFournitures + travail.prixMainOeuvre)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    {formaterPrix(totalHTRoom)}
                  </TableCell>
                  <TableCell className="text-right">
                    {formaterPrix(totalTVARoom)}
                  </TableCell>
                  <TableCell className="text-right">
                    {formaterPrix(totalTTCRoom)}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
          <TableFooter>
            <TableRow className="border-t h-8">
              <TableCell className="w-full text-right font-bold" colSpan={2}>Montant Total HT</TableCell>
              <TableCell colSpan={2} className="text-right font-semibold">{formaterPrix(totalHT)}</TableCell>
            </TableRow>
            <TableRow className="h-8">
              <TableCell className="w-full text-right font-bold" colSpan={2}>Total TVA</TableCell>
              <TableCell colSpan={2} className="text-right font-semibold">{formaterPrix(totalTVA)}</TableCell>
            </TableRow>
            <TableRow className="h-8">
              <TableCell className="w-full text-right font-bold" colSpan={2}>Montant Total TTC</TableCell>
              <TableCell colSpan={2} className="text-right font-semibold">{formaterPrix(totalTTC)}</TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>
    </div>
  );
};

export default RecapitulatifTravaux;
