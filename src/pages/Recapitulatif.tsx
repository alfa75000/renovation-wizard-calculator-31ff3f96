
import React from "react";
import { 
  Card, 
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Printer, Home, Info, FileText } from "lucide-react";
import { Link } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { useProject } from "@/contexts/ProjectContext";
import { useTravaux } from "@/features/travaux/hooks/useTravaux";
import { formaterPrix } from "@/lib/utils";

const Recapitulatif: React.FC = () => {
  const { state } = useProject();
  const { property, rooms } = state;
  const { travaux, getTravauxForPiece } = useTravaux();

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
    <Layout
      title="Récapitulatif des travaux"
      subtitle="Estimation détaillée par pièce"
    >
      <div className="mb-4 flex justify-between">
        <Button variant="outline" asChild className="flex items-center gap-2">
          <Link to="/travaux">
            <ArrowLeft className="h-4 w-4" />
            Retour aux travaux
          </Link>
        </Button>

        <Button className="flex items-center gap-2">
          <Printer className="h-4 w-4" />
          Imprimer le devis
        </Button>
      </div>

      {/* Informations générales du bien */}
      <Card className="shadow-md mb-6">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Home className="h-5 w-5 mr-2" />
            Informations générales du bien
          </CardTitle>
          <CardDescription>
            Caractéristiques principales du bien à rénover
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex flex-col">
              <span className="text-sm text-gray-500">Type de bien</span>
              <span className="font-medium">{property.type}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-gray-500">Nombre de niveaux</span>
              <span className="font-medium">{property.floors}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-gray-500">Surface totale</span>
              <span className="font-medium">{property.totalArea} m²</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-gray-500">Hauteur sous plafond</span>
              <span className="font-medium">{property.ceilingHeight} m</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-gray-500">Nombre de pièces</span>
              <span className="font-medium">{property.rooms}</span>
            </div>
          </div>
          <div className="mt-4 bg-blue-50 p-3 rounded-md border border-blue-100">
            <div className="flex items-start">
              <Info className="h-5 w-5 text-blue-500 mr-2 mt-0.5" />
              <div>
                <p className="text-sm text-blue-700">
                  {rooms.length} pièce(s) identifiée(s) pour ce bien avec une surface totale de {
                    rooms.reduce((total, room) => total + room.surface, 0).toFixed(2)
                  } m²
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Récapitulatif des travaux */}
      <Card className="shadow-md mb-6">
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="h-5 w-5 mr-2" />
            Récapitulatif des travaux
          </CardTitle>
          <CardDescription>
            Estimation détaillée des travaux par lot
          </CardDescription>
        </CardHeader>
        <CardContent>
          {rooms.map(room => {
            const travauxPiece = getTravauxForPiece(room.id);
            if (travauxPiece.length === 0) return null;
            
            const totalPieceFournitures = travauxPiece.reduce((sum, t) => sum + t.prixFournitures * t.quantite, 0);
            const totalPieceMainOeuvre = travauxPiece.reduce((sum, t) => sum + t.prixMainOeuvre * t.quantite, 0);
            const totalPieceHT = totalPieceFournitures + totalPieceMainOeuvre;
            const totalPieceTVA = travauxPiece.reduce((sum, t) => {
              const prixHT = (t.prixFournitures + t.prixMainOeuvre) * t.quantite;
              const montantTVA = prixHT * (t.tauxTVA / 100);
              return sum + montantTVA;
            }, 0);
            const totalPieceTTC = totalPieceHT + totalPieceTVA;
            
            return (
              <div key={room.id} className="mb-6 border-b pb-6 last:border-b-0 last:pb-0">
                <h3 className="text-lg font-medium mb-3">{room.name}</h3>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-3 py-2 text-left w-3/5">Prestation(s)</th>
                        <th className="px-3 py-2 text-right">Quantité</th>
                        <th className="px-3 py-2 text-right">P.U. HT</th>
                        <th className="px-3 py-2 text-right">TVA</th>
                        <th className="px-3 py-2 text-right">Total TTC</th>
                      </tr>
                    </thead>
                    <tbody>
                      {travauxPiece.map(travail => {
                        const prixUnitaireHT = travail.prixFournitures + travail.prixMainOeuvre;
                        const totalHT = prixUnitaireHT * travail.quantite;
                        const montantTVA = totalHT * (travail.tauxTVA / 100);
                        const totalTTC = totalHT + montantTVA;
                        
                        return (
                          <tr key={travail.id} className="border-b">
                            <td className="px-3 py-2">
                              <div>{travail.typeTravauxLabel}: {travail.sousTypeLabel}</div>
                              {travail.description && (
                                <div className="text-xs text-gray-500 mt-1">
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
                      })}
                    </tbody>
                    <tfoot className="bg-gray-50">
                      <tr>
                        <td className="px-3 py-2 text-left italic text-sm">
                          MO HT: {formaterPrix(totalPieceMainOeuvre)}, 
                          Fourn. HT: {formaterPrix(totalPieceFournitures)}, 
                          TVA: {formaterPrix(totalPieceTVA)}
                          ({formaterPrix(totalPieceTTC)})
                        </td>
                        <td colSpan={3} className="px-3 py-2 text-right font-medium">Total HT pour {room.name}:</td>
                        <td className="px-3 py-2 text-right font-bold">{formaterPrix(totalPieceHT)}</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            );
          })}
          
          {travaux.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">Aucun travail n'a été ajouté.</p>
              <p className="text-sm mt-1 text-gray-500">Veuillez retourner à la page des travaux pour en ajouter.</p>
            </div>
          ) : (
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
          )}
        </CardContent>
      </Card>
    </Layout>
  );
};

export default Recapitulatif;
