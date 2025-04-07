
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Trash, MessageSquare } from "lucide-react";
import { Travail } from "@/types";
import { formaterPrix } from "@/lib/utils";

interface TravailCardProps {
  travail: Travail;
  onEdit?: (travail: Travail) => void;
  onDelete?: (id: string) => void;
  className?: string;
  compact?: boolean;
}

const TravailCard: React.FC<TravailCardProps> = ({
  travail,
  onEdit,
  onDelete,
  className = "",
  compact = false,
}) => {
  const totalHT =
    (travail.prixFournitures + travail.prixMainOeuvre) * travail.quantite;
  const totalTTC = totalHT * (1 + travail.tauxTVA / 100);

  return (
    <Card className={`hover:shadow-md transition-shadow ${className}`}>
      <CardContent className={compact ? "p-3" : "p-4"}>
        <div className="flex justify-between items-start">
          <div className="flex-grow">
            <h3 className="font-medium text-base">
              {travail.typeTravauxLabel}: {travail.sousTypeLabel}
            </h3>
            {travail.description && (
              <p className="text-sm text-gray-600 mt-1">{travail.description}</p>
            )}
            {travail.personnalisation && (
              <p className="text-xs text-gray-500 mt-1 italic">
                {travail.personnalisation}
              </p>
            )}

            <div className="mt-2 flex flex-wrap gap-2">
              <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs">
                {travail.quantite} {travail.unite}
              </span>
              <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs">
                {formaterPrix(travail.prixFournitures + travail.prixMainOeuvre)}/
                {travail.unite}
              </span>
              <span className="inline-flex items-center rounded-full bg-purple-50 px-2 py-1 text-xs">
                TVA: {travail.tauxTVA}%
              </span>
            </div>

            {!compact && (
              <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-gray-500">Fournitures:</span>{" "}
                  {formaterPrix(travail.prixFournitures * travail.quantite)}
                </div>
                <div>
                  <span className="text-gray-500">Main d'œuvre:</span>{" "}
                  {formaterPrix(travail.prixMainOeuvre * travail.quantite)}
                </div>
              </div>
            )}

            {travail.commentaire && (
              <div className="mt-2 text-sm bg-gray-50 p-2 rounded-md flex items-start gap-1.5">
                <MessageSquare className="h-4 w-4 text-gray-500 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">{travail.commentaire}</span>
              </div>
            )}

            <div className="mt-2">
              <span className="font-medium">
                Total: {formaterPrix(totalTTC)} TTC
              </span>
              <span className="text-xs text-gray-500 ml-1">
                ({formaterPrix(totalHT)} HT)
              </span>
            </div>
          </div>

          {(onEdit || onDelete) && (
            <div className="flex flex-col space-y-1 ml-4">
              {onEdit && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 p-0"
                  onClick={() => onEdit(travail)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
              )}
              {onDelete && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                  onClick={() => onDelete(travail.id)}
                >
                  <Trash className="h-4 w-4" />
                </Button>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TravailCard;
