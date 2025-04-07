
import React from "react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Home } from "lucide-react";

const NotFound = () => {
  return (
    <Layout
      title="Page non trouvée"
      subtitle="La page que vous recherchez n'existe pas"
    >
      <div className="flex flex-col items-center justify-center py-12">
        <div className="mb-8 text-center">
          <h2 className="text-9xl font-bold text-gray-300">404</h2>
          <p className="mt-4 text-lg text-gray-600">
            Nous sommes désolés, mais cette page n'existe pas ou a été déplacée.
          </p>
        </div>
        
        <Button asChild className="flex items-center gap-2">
          <Link to="/">
            <Home className="h-4 w-4 mr-2" />
            Retour à l'accueil
          </Link>
        </Button>
      </div>
    </Layout>
  );
};

export default NotFound;
