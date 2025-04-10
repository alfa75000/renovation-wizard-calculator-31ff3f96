
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { FileText } from "lucide-react";
import { Room, Travail } from "@/types";
import RoomRecapTable from "./RoomRecapTable";
import NoTravauxMessage from "./NoTravauxMessage";
import GlobalTotals from "./GlobalTotals";

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
        {rooms.map(room => (
          <RoomRecapTable 
            key={room.id} 
            room={room} 
            travaux={getTravauxForPiece(room.id)} 
          />
        ))}
        
        {travaux.length === 0 ? (
          <NoTravauxMessage />
        ) : (
          <GlobalTotals travaux={travaux} />
        )}
      </CardContent>
    </Card>
  );
};

export default TravauxRecapContent;
