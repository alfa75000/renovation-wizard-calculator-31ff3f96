
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Layout } from "@/components/Layout";

const NotFound = () => {
  return (
    <Layout>
      <div className="flex flex-col items-center justify-center min-h-[80vh] p-4 text-center">
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <h2 className="text-2xl font-semibold mb-4">Page non trouvée</h2>
        <p className="text-gray-600 mb-8">La page que vous cherchez n'existe pas ou a été déplacée.</p>
        <Button asChild>
          <Link to="/">Retour à l'accueil</Link>
        </Button>
      </div>
    </Layout>
  );
};

export default NotFound;
