
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Home } from "lucide-react";
import PropertyForm from "./PropertyForm";
import { Property } from "@/types";

interface PropertyCardProps {
  property: Property;
  hasUnsavedChanges: boolean;
  onPropertyChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

const PropertyCard: React.FC<PropertyCardProps> = ({
  property,
  hasUnsavedChanges,
  onPropertyChange
}) => {
  return (
    <Card className="mb-8 shadow-md">
      <CardContent className="p-6">
        <div className="flex items-center mb-4">
          <Home className="h-5 w-5 mr-2" />
          <h2 className="text-xl font-semibold">Type de bien à rénover</h2>
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
