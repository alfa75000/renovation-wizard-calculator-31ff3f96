
import RenovationEstimator from "@/components/RenovationEstimator";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <div className="max-w-6xl mx-auto p-4">
        <div className="flex flex-col items-center justify-center mb-8 bg-blue-600 text-white p-6 rounded-lg">
          <h1 className="text-3xl md:text-4xl font-bold">
            Estimation de rénovation
          </h1>
          <p className="mt-2 text-lg">Assistant de rénovation simplifié</p>
        </div>
        
        <div className="mb-8 flex justify-center space-x-4">
          <Button asChild variant="default" className="flex items-center gap-2">
            <Link to="/">
              Page de saisie
            </Link>
          </Button>
          
          <Button asChild variant="outline" className="flex items-center gap-2">
            <Link to="/travaux">
              Page d'ajout des travaux
            </Link>
          </Button>
          
          <Button asChild variant="outline" className="flex items-center gap-2">
            <Link to="/recapitulatif">
              Page Récapitulatif
            </Link>
          </Button>
        </div>
        
        <RenovationEstimator />
      </div>
    </div>
  );
};

export default Index;
