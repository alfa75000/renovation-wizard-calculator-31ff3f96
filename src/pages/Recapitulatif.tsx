
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

interface Travail {
  id: string;
  pieceId: number;
  pieceName: string;
  typeTravauxId: string;
  typeTravauxLabel: string;
  sousTypeId: string;
  sousTypeLabel: string;
  personnalisation: string;
  quantite: number;
  unite: string;
  prixFournitures: number;
  prixMainOeuvre: number;
  prixUnitaire: number;
  tauxTVA: number;
}

interface PieceAvecTravaux {
  id: number;
  nom: string;
  travaux: Travail[];
}

const Recapitulatif = () => {
  const navigate = useNavigate();
  const [travaux, setTravaux] = useState<Travail[]>([]);

  useEffect(() => {
    const travauxSauvegardes = localStorage.getItem('travaux');
    if (travauxSauvegardes) {
      setTravaux(JSON.parse(travauxSauvegardes));
    }
  }, []);

  const formaterPrix = (prix: number) => {
    const prixArrondi = Math.round(prix * 100) / 100;
    return new Intl.NumberFormat('fr-FR', { 
      style: 'currency', 
      currency: 'EUR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(prixArrondi);
  };

  const formaterQuantite = (quantite: number) => {
    const quantiteArrondie = Math.round(quantite * 100) / 100;
    return new Intl.NumberFormat('fr-FR', { 
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(quantiteArrondie);
  };

  const calculerTotalGeneral = () => {
    return Math.round(travaux.reduce((total, travail) => {
      return total + (travail.quantite * travail.prixUnitaire);
    }, 0) * 100) / 100;
  };

  const calculerTotalFournitures = () => {
    return Math.round(travaux.reduce((total, travail) => {
      return total + (travail.quantite * travail.prixFournitures);
    }, 0) * 100) / 100;
  };

  const calculerTotalMainOeuvre = () => {
    return Math.round(travaux.reduce((total, travail) => {
      return total + (travail.quantite * travail.prixMainOeuvre);
    }, 0) * 100) / 100;
  };

  const calculerTotalTVA = () => {
    return Math.round(travaux.reduce((total, travail) => {
      const montantHT = travail.quantite * travail.prixUnitaire;
      const montantTVA = montantHT * (travail.tauxTVA / 100);
      return total + montantTVA;
    }, 0) * 100) / 100;
  };

  const calculerTotalTTC = () => {
    const totalHT = calculerTotalGeneral();
    const totalTVA = calculerTotalTVA();
    return Math.round((totalHT + totalTVA) * 100) / 100;
  };

  const travauxParPiece = () => {
    const pieces: PieceAvecTravaux[] = [];
    
    travaux.forEach(travail => {
      // Rechercher si la pièce existe déjà dans notre tableau
      const pieceExistante = pieces.find(p => p.id === travail.pieceId);
      
      if (pieceExistante) {
        // Si la pièce existe, ajouter le travail à cette pièce
        pieceExistante.travaux.push(travail);
      } else {
        // Si la pièce n'existe pas, créer une nouvelle entrée
        pieces.push({
          id: travail.pieceId,
          nom: travail.pieceName,
          travaux: [travail]
        });
      }
    });
    
    return pieces;
  };

  const calculerTotalPiece = (travauxPiece: Travail[]) => {
    return Math.round(travauxPiece.reduce((total, travail) => {
      return total + (travail.quantite * travail.prixUnitaire);
    }, 0) * 100) / 100;
  };

  const calculerTVAPiece = (travauxPiece: Travail[]) => {
    return Math.round(travauxPiece.reduce((total, travail) => {
      const montantHT = travail.quantite * travail.prixUnitaire;
      const montantTVA = montantHT * (travail.tauxTVA / 100);
      return total + montantTVA;
    }, 0) * 100) / 100;
  };

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
                      const total = parseFloat((travail.quantite * travail.prixUnitaire).toFixed(2));
                      const totalFournitures = parseFloat((travail.quantite * travail.prixFournitures).toFixed(2));
                      const totalMainOeuvre = parseFloat((travail.quantite * travail.prixMainOeuvre).toFixed(2));
                      const totalTVA = parseFloat((total * (travail.tauxTVA / 100)).toFixed(2));
                      
                      return (
                        <div key={travail.id} className="border-b pb-2 last:border-0">
                          <div className="flex justify-between">
                            <div>
                              <p className="font-medium">
                                {travail.typeTravauxLabel}: {travail.sousTypeLabel}
                              </p>
                              {travail.personnalisation && (
                                <p className="text-sm text-gray-600 whitespace-pre-line">
                                  {travail.personnalisation}
                                </p>
                              )}
                              <p className="text-sm text-gray-600">
                                {formaterQuantite(travail.quantite)} {travail.unite} × {formaterPrix(travail.prixUnitaire)}/{travail.unite}
                              </p>
                              <p className="text-xs text-gray-500">
                                Fournitures: {formaterPrix(totalFournitures)} | Main d'œuvre: {formaterPrix(totalMainOeuvre)} | TVA {travail.tauxTVA}%: {formaterPrix(totalTVA)}
                              </p>
                            </div>
                            <p className="font-medium">{formaterPrix(total)}</p>
                          </div>
                        </div>
                      );
                    })}
                    
                    <div className="flex justify-between pt-2 border-t mt-4">
                      <p className="font-bold">Total {piece.nom} (HT)</p>
                      <p className="font-bold">{formaterPrix(calculerTotalPiece(piece.travaux))}</p>
                    </div>
                    <div className="flex justify-between text-sm">
                      <p>TVA {piece.nom}</p>
                      <p>{formaterPrix(calculerTVAPiece(piece.travaux))}</p>
                    </div>
                    <div className="flex justify-between font-bold pt-1 border-t">
                      <p>Total {piece.nom} (TTC)</p>
                      <p>{formaterPrix(calculerTotalPiece(piece.travaux) + calculerTVAPiece(piece.travaux))}</p>
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
                    <p className="text-xl font-bold">TOTAL HT</p>
                    <p className="text-xl font-bold">{formaterPrix(calculerTotalGeneral())}</p>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-lg">Total TVA</p>
                    <p className="text-lg">{formaterPrix(calculerTotalTVA())}</p>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t">
                    <p className="text-2xl font-bold">TOTAL TTC</p>
                    <p className="text-2xl font-bold">{formaterPrix(calculerTotalTTC())}</p>
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
