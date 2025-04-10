
import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { PlusCircle, ArrowLeft } from "lucide-react";

const NoTravauxMessage: React.FC = () => {
  return (
    <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-300 p-6">
      <svg
        className="mx-auto h-12 w-12 text-gray-400 mb-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
        />
      </svg>
      <h3 className="text-lg font-medium text-gray-900">Aucun travail défini</h3>
      <p className="mt-2 text-gray-500 mb-6">
        Vous n'avez pas encore ajouté de travaux pour ce projet. Retournez à la page des travaux pour définir les travaux à effectuer dans chaque pièce.
      </p>
      <div className="flex justify-center space-x-4">
        <Button asChild variant="default" className="flex items-center gap-2">
          <Link to="/travaux">
            <ArrowLeft className="h-4 w-4" />
            Aller à la page des travaux
          </Link>
        </Button>
        <Button asChild variant="outline" className="flex items-center gap-2">
          <Link to="/travaux">
            <PlusCircle className="h-4 w-4" />
            Ajouter des travaux
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default NoTravauxMessage;
