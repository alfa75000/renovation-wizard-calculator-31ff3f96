
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Paintbrush, 
  List, 
  Settings, 
  SquarePen,
  FileText
} from 'lucide-react';

const Index: React.FC = () => {
  return (
    <div className="container mx-auto p-4 grid gap-6">
      <header className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Estimateur de Rénovation</h1>
        <p className="text-muted-foreground">Planifiez et estimez facilement vos projets de rénovation</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Paintbrush className="h-5 w-5" />
              Définir les Travaux
            </CardTitle>
            <CardDescription>Ajoutez et configurez les travaux pour votre projet</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Sélectionnez les types de travaux à effectuer, avec les quantités et prix unitaires.</p>
          </CardContent>
          <CardFooter>
            <Link to="/travaux" className="w-full">
              <Button className="w-full">
                <Paintbrush className="mr-2 h-4 w-4" />
                Gérer les Travaux
              </Button>
            </Link>
          </CardFooter>
        </Card>

        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Informations Client / Chantier
            </CardTitle>
            <CardDescription>Gérez les informations client et chantier</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Renseignez les coordonnées du client et les détails du chantier pour votre projet.</p>
          </CardContent>
          <CardFooter>
            <Link to="/client-chantier" className="w-full">
              <Button className="w-full">
                <FileText className="mr-2 h-4 w-4" />
                Gérer les Informations
              </Button>
            </Link>
          </CardFooter>
        </Card>

        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <List className="h-5 w-5" />
              Récapitulatif
            </CardTitle>
            <CardDescription>Visualisez le récapitulatif de votre projet</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Consultez le détail de tous les travaux et le coût total estimé.</p>
          </CardContent>
          <CardFooter>
            <Link to="/recapitulatif" className="w-full">
              <Button className="w-full">
                <List className="mr-2 h-4 w-4" />
                Voir le Récapitulatif
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <SquarePen className="h-5 w-5" />
              Administration
            </CardTitle>
            <CardDescription>Gérez les paramètres des types de travaux</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Configuration avancée des différents types de travaux et leurs sous-catégories.</p>
          </CardContent>
          <CardFooter>
            <Link to="/admin/travaux" className="w-full">
              <Button variant="outline" className="w-full">
                <SquarePen className="mr-2 h-4 w-4" />
                Gérer les Types de Travaux
              </Button>
            </Link>
          </CardFooter>
        </Card>

        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Paramètres
            </CardTitle>
            <CardDescription>Configuration générale de l'application</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Ajustez les paramètres généraux et réinitialisez les données si nécessaire.</p>
          </CardContent>
          <CardFooter>
            <Link to="/parametres" className="w-full">
              <Button variant="outline" className="w-full">
                <Settings className="mr-2 h-4 w-4" />
                Gérer les Paramètres
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Index;
