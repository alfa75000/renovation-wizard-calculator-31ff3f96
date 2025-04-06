
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import RenovationEstimator from '@/components/RenovationEstimator';

const PiecesPage: React.FC = () => {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <Link to="/">
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" /> Retour
            </Button>
          </Link>
          <h1 className="text-2xl font-bold ml-4">Saisie des Pièces</h1>
        </div>
      </div>

      <RenovationEstimator />
    </div>
  );
};

export default PiecesPage;
