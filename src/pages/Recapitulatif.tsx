
import React, { useState, useEffect } from "react";
import { 
  Card, 
  CardContent,
  CardHeader,
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Printer } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

// Type pour un travail
interface Travail {
  id: string;
  pieceId: number;
  pieceName: string;
  typeTravauxId: string;
  typeTravauxLabel: string; // Type de travaux (ajouté)
  sousTypeId: string;
  sousTypeLabel: string;
  personnalisation: string;
  quantite: number;
  unite: string;
  prixFournitures: number; // Prix des fournitures
  prixMainOeuvre: number; // Prix de la main d'oeuvre
  prixUnitaire: number;
}

const Recapitulatif = () => {
  const navigate = useNavigate();
  const [travaux, setTravaux] = useState<Travail[]>([]);

  useEffect(() => {
    // Charger les travaux depuis le localStorage
    const travauxSauvegardes = localStorage.getItem('travaux');
    if (travauxSauvegardes) {
      setTravaux(JSON.parse(travauxSauvegardes));
    }
  }, []);

  // Formater le prix
  const formaterPrix = (prix: number) => {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(prix);
  };

  // Calculer le total général
  const calculerTotalGeneral = () => {
    return travaux.reduce((total, travail) => {
      return total + (travail.quantite * travail.prixUnitaire);
    }, 0);
  };

  // Calculer le total des fournitures
  const calculerTotalFournitures = () => {
    return travaux.reduce((total, travail) => {
      return total + (travail.quantite * travail.prixFournitures);
    }, 0);
  };

  // Calculer le total de la main d'oeuvre
  const calculerTotalMainOeuvre = () => {
    return travaux.reduce((total, travail) => {
      return total + (travail.quantite * travail.prixMainOeuvre);
    }, 0);
  };

  // Regrouper les travaux par pièce
  const travauxParPiece = () => {
    const pieces = new Map<number, {nom: string, travaux: Travail[]}>();
    
    travaux.forEach(travail => {
      if (!pieces.has(travail.pieceId)) {
        pieces.set(travail.pieceId, {nom: travail.pieceName, travaux: []});
      }
      pieces.get(travail.pieceId)?.travaux.push(travail);
    });
    
    return Array.from(pieces.values());
  };

  // Calculer le total par pièce
  const calculerTotalPiece = (travauxPiece: Travail[]) => {
    return travauxPiece.reduce((total, travail) => {
      return total + (travail.quantite * travail.prixUnitaire);
    }, 0);
  };

  // Imprimer le récapitulatif
  const imprimerRecapitulatif = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <div className="max-w-6xl mx-auto p-4">
        <div className="flex flex-col items-center justify-center mb-8 gradient-header text-white p-6 rounded-lg">
          <h1 className="text-3xl md:text-4xl font-bold">
            Récapitulatif des travaux
          </h1>
          <p className="mt-2 text-lg">Estimation détaillée par pièce</p>
        </div>

        <div className="mb-4 flex justify-between">
          <Button variant="outline" asChild className="flex items-center gap-2">
            <Link to="/travaux">
              <ArrowLeft className="h-4 w-4" />
              Retour aux travaux
            </Link>
          </Button>

          <Button onClick={imprimerRecapitulatif} className="flex items-center gap-2">
            <Printer className="h-4 w-4" />
            Imprimer le devis
          </Button>
        </div>

        {travaux.length === 0 ? (
          <Card className="shadow-md">
            <CardContent className="py-8 text-center">
              <p className="text-gray-500">Aucun travail n'a encore été ajouté.</p>
              <Button asChild className="mt-4">
                <Link to="/travaux">Ajouter des travaux</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            {travauxParPiece().map((piece, index) => (
              <Card key={index} className="shadow-md mb-6">
                <CardHeader>
                  <CardTitle>{piece.nom}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {piece.travaux.map(travail => {
                      const total = travail.quantite * travail.prixUnitaire;
                      const totalFournitures = travail.quantite * travail.prixFournitures;
                      const totalMainOeuvre = travail.quantite * travail.prixMainOeuvre;
                      
                      return (
                        <div key={travail.id} className="border-b pb-2 last:border-0">
                          <div className="flex justify-between">
                            <div>
                              <p className="font-medium">
                                {travail.typeTravauxLabel}: {travail.sousTypeLabel}
                                {travail.personnalisation && ` (${travail.personnalisation})`}
                              </p>
                              <p className="text-sm text-gray-600">
                                {travail.quantite} {travail.unite} × {formaterPrix(travail.prixUnitaire)}/{travail.unite}
                              </p>
                              <p className="text-xs text-gray-500">
                                Fournitures: {formaterPrix(totalFournitures)} | Main d'œuvre: {formaterPrix(totalMainOeuvre)}
                              </p>
                            </div>
                            <p className="font-medium">{formaterPrix(total)}</p>
                          </div>
                        </div>
                      );
                    })}
                    
                    <div className="flex justify-between pt-2 border-t mt-4">
                      <p className="font-bold">Total {piece.nom}</p>
                      <p className="font-bold">{formaterPrix(calculerTotalPiece(piece.travaux))}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            <Card className="shadow-md bg-gray-100">
              <CardContent className="p-6">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <p className="text-lg">Total Fournitures</p>
                    <p className="text-lg">{formaterPrix(calculerTotalFournitures())}</p>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-lg">Total Main d'œuvre</p>
                    <p className="text-lg">{formaterPrix(calculerTotalMainOeuvre())}</p>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t">
                    <p className="text-xl font-bold">TOTAL GÉNÉRAL</p>
                    <p className="text-xl font-bold">{formaterPrix(calculerTotalGeneral())}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
};

export default Recapitulatif;
