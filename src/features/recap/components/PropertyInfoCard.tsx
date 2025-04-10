
import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent
} from "@/components/ui/card";
import { Home, Info } from "lucide-react";
import { Property, Room } from "@/types";

interface PropertyInfoCardProps {
  property: Property;
  rooms: Room[];
}

const PropertyInfoCard: React.FC<PropertyInfoCardProps> = ({ property, rooms }) => {
  return (
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
  );
};

export default PropertyInfoCard;
