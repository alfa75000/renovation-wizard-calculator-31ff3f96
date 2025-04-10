
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Home, RefreshCw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import PropertyForm from "./PropertyForm";
import { Property } from "@/types";

interface PropertyCardProps {
  property: Property;
  hasUnsavedChanges: boolean;
  onPropertyChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onResetProject: () => void;
}

const PropertyCard: React.FC<PropertyCardProps> = ({
  property,
  hasUnsavedChanges,
  onPropertyChange,
  onResetProject
}) => {
  return (
    <Card className="mb-8 shadow-md">
      <CardContent className="p-6">
        <div className="flex items-center mb-4">
          <Home className="h-5 w-5 mr-2" />
          <h2 className="text-xl font-semibold">Type de bien à rénover</h2>
          
          <div className="flex items-center ml-auto gap-2">
            {hasUnsavedChanges && (
              <Badge variant="outline" className="mr-2 text-amber-500 border-amber-500">
                Modifications non enregistrées
              </Badge>
            )}
            
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="reset" size="sm" className="flex items-center gap-1">
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
                  <AlertDialogAction onClick={onResetProject} className="bg-orange-500 hover:bg-orange-600">
                    Réinitialiser
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
        
        <PropertyForm 
          property={property} 
          onPropertyChange={onPropertyChange} 
        />
      </CardContent>
    </Card>
  );
};

export default PropertyCard;
