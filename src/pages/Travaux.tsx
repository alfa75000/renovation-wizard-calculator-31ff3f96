
import React from "react";
import { 
  Card, 
  CardContent,
  CardHeader,
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  ArrowLeft,
  Home,
  Save,
  ArrowRight,
  RefreshCw,
  PlusCircle,
  Settings
} from "lucide-react";
import { Link } from "react-router-dom";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

// Importer les hooks et composants personnalisés
import { useTravaux } from "@/features/travaux/hooks/useTravaux";
import PieceSelect from "@/features/travaux/components/PieceSelect";
import TravailForm from "@/features/travaux/components/TravailForm";
import TravailCard from "@/features/travaux/components/TravailCard";
import { ProjectProvider } from "@/contexts/ProjectContext";
import { TravauxTypesProvider } from "@/contexts/TravauxTypesContext";
import { Travail } from "@/types";

const TravauxPage = () => {
  const {
    pieces,
    pieceSelectionnee,
    selectionnerPiece,
    getPieceSelectionnee,
    ajouterTravail,
    modifierTravail,
    supprimerTravail,
    travauxParPiece,
    enregistrerTravaux,
    naviguerVersRecapitulatif,
    resetProject
  } = useTravaux();

  // Convertir le pieceSelectionnee en string pour le composant PieceSelect
  const pieceSelectionneStr = pieceSelectionnee ? pieceSelectionnee.toString() : null;

  // Adaptateur pour gérer les différences de type (string vs number) pour pieceSelectionnee
  const handlePieceSelection = (pieceIdStr: string) => {
    selectionnerPiece(pieceIdStr);
  };

  // Adaptateur pour modifier un travail
  const handleModifierTravail = (travail: Travail) => {
    modifierTravail(travail.id, travail);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <div className="max-w-6xl mx-auto p-4">
        <div className="flex flex-col items-center justify-center mb-8 gradient-header text-white p-6 rounded-lg">
          <h1 className="text-3xl md:text-4xl font-bold">
            Travaux à prévoir
          </h1>
          <p className="mt-2 text-lg">Sélectionnez les travaux pour chaque pièce</p>
          
          <div className="flex gap-2 mt-4">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="reset" className="flex items-center gap-2">
                  <RefreshCw className="h-4 w-4" />
                  Nouveau projet
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Êtes-vous sûr de vouloir créer un nouveau projet ?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Cette action va réinitialiser toutes les données de votre projet actuel.
                    Toutes les pièces et travaux associés seront supprimés.
                    Cette action est irréversible.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Annuler</AlertDialogCancel>
                  <AlertDialogAction onClick={resetProject} className="bg-orange-500 hover:bg-orange-600">
                    Réinitialiser
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <Button variant="outline" asChild className="flex items-center gap-2 text-white border-white hover:bg-white/20 hover:text-white">
              <Link to="/admin/travaux">
                <Settings className="h-4 w-4" />
                Gérer les types de travaux
              </Link>
            </Button>
          </div>
        </div>

        <div className="mb-4 flex justify-between">
          <Button variant="outline" asChild className="flex items-center gap-2">
            <Link to="/">
              <ArrowLeft className="h-4 w-4" />
              Retour à l'estimateur
            </Link>
          </Button>

          <div className="flex gap-2">
            <Button onClick={enregistrerTravaux} className="flex items-center gap-2">
              <Save className="h-4 w-4" />
              Enregistrer les travaux
            </Button>
            
            <Button onClick={naviguerVersRecapitulatif} variant="default" className="flex items-center gap-2">
              Voir le récapitulatif
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {pieces.length === 0 ? (
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="text-center">Aucune pièce disponible</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="mb-4">Vous devez d'abord ajouter des pièces dans l'estimateur principal.</p>
              <Button asChild>
                <Link to="/" className="flex items-center gap-2">
                  <PlusCircle className="h-4 w-4" />
                  Ajouter des pièces
                </Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="shadow-md lg:col-span-1">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Home className="h-5 w-5 mr-2" />
                  Pièces à rénover
                </CardTitle>
              </CardHeader>
              <CardContent>
                <PieceSelect 
                  pieces={pieces}
                  selectedPieceId={pieceSelectionneStr}
                  onSelect={handlePieceSelection}
                />
              </CardContent>
            </Card>

            <Card className="shadow-md lg:col-span-2">
              <CardHeader>
                <CardTitle>Configuration des travaux</CardTitle>
              </CardHeader>
              <CardContent>
                {pieceSelectionnee ? (
                  <>
                    <TravailForm 
                      piece={getPieceSelectionnee()}
                      onAddTravail={ajouterTravail}
                    />

                    {travauxParPiece(pieceSelectionnee.toString()).length > 0 && (
                      <div className="mt-8">
                        <h3 className="text-lg font-medium mb-4">Travaux/Prestations ajoutés</h3>
                        <div className="space-y-3">
                          {travauxParPiece(pieceSelectionnee.toString()).map(travail => (
                            <TravailCard 
                              key={travail.id} 
                              travail={travail}
                              onEdit={handleModifierTravail}
                              onDelete={supprimerTravail}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500">Veuillez sélectionner une pièce pour configurer les travaux.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

const Travaux = () => (
  <ProjectProvider>
    <TravauxTypesProvider>
      <TravauxPage />
    </TravauxTypesProvider>
  </ProjectProvider>
);

export default Travaux;
