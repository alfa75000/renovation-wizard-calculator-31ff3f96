
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { FileText } from "lucide-react";
import { Room, Travail } from "@/types";
import NoTravauxMessage from "./NoTravauxMessage";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import DetailsTravaux from "./DetailsTravaux";
import GlobalTotals from "./GlobalTotals";

// Interface des propriétés
interface TravauxRecapContentProps {
  rooms: Room[];
  travaux: Travail[];
  getTravauxForPiece: (pieceId: string) => Travail[];
}

const TravauxRecapContent: React.FC<TravauxRecapContentProps> = ({ 
  rooms, 
  travaux, 
  getTravauxForPiece 
}) => {
  return (
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
        {travaux.length === 0 ? (
          <NoTravauxMessage />
        ) : (
          <Tabs defaultValue="details" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="details">Détails des travaux</TabsTrigger>
              <TabsTrigger value="recap">Récapitulatif</TabsTrigger>
            </TabsList>
            
            <TabsContent value="details">
              <DetailsTravaux 
                rooms={rooms} 
                travaux={travaux} 
                getTravauxForPiece={getTravauxForPiece} 
              />
            </TabsContent>
            
            <TabsContent value="recap">
              <div className="py-8 text-center text-gray-500">
                Le récapitulatif sera implémenté prochainement.
              </div>
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
    </Card>
  );
};

export default TravauxRecapContent;
