
import RenovationEstimator from "@/components/RenovationEstimator";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <RenovationEstimator />
      
      <div className="max-w-6xl mx-auto p-4 flex justify-end">
        <Button asChild className="flex items-center gap-2">
          <Link to="/travaux">
            Passer aux Travaux
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default Index;
