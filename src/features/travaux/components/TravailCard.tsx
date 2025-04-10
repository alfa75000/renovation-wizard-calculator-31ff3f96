import React from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Box } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Travail } from "@/types";

interface TravailCardProps {
  travail: Travail;
  onEdit?: (travail: Travail) => void;
  onDelete?: (id: string) => void;
}

const TravailCard: React.FC<TravailCardProps> = ({
  travail,
  onEdit,
  onDelete,
}) => {
  const totalHT = travail.quantite * (travail.prixFournitures + travail.prixMainOeuvre);
  const totalTTC = totalHT * (1 + travail.tauxTVA / 100);

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        <div className="flex flex-col space-y-3">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-bold text-lg">{travail.sousTypeLabel}</h3>
              <p className="text-sm text-muted-foreground">{travail.typeTravauxLabel}</p>
            </div>
            
            <div className="flex space-x-2">
              <Badge variant="outline" className="whitespace-nowrap">
                {travail.quantite.toFixed(2)} {travail.unite}
              </Badge>
              
              {travail.surfaceImpactee && (
                <Badge variant="secondary" className="whitespace-nowrap">
                  Surface: {travail.surfaceImpactee}
                </Badge>
              )}
            </div>
          </div>
          
          <div className="text-sm">
            {travail.description && <p className="mb-2">{travail.description}</p>}
            {travail.personnalisation && (
              <p className="text-muted-foreground italic text-sm">
                Personnalisation: {travail.personnalisation}
              </p>
            )}
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Prix unitaire HT:</p>
              <p>{(travail.prixFournitures + travail.prixMainOeuvre).toFixed(2)}€/{travail.unite}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Total TTC:</p>
              <p className="font-bold">{totalTTC.toFixed(2)}€</p>
            </div>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="bg-muted/50 p-2 flex justify-end gap-2">
        {onEdit && (
          <Button variant="ghost" size="sm" onClick={() => onEdit(travail)}>
            <Pencil className="h-4 w-4 mr-1" />
            Modifier
          </Button>
        )}
        {onDelete && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => {
              if (window.confirm(`Êtes-vous sûr de vouloir supprimer ce travail ?`)) {
                onDelete(travail.id);
              }
            }}
            className="text-destructive hover:text-destructive"
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Supprimer
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default TravailCard;
