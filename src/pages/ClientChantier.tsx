
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ClientForm from '@/features/client-chantier/components/ClientForm';
import ChantierForm from '@/features/client-chantier/components/ChantierForm';
import { Button } from '@/components/ui/button';
import { ArrowLeft, User, Building, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useClientChantier } from '@/contexts/ClientChantierContext';
import { useToast } from '@/hooks/use-toast';

const ClientChantier: React.FC = () => {
  const { dispatch } = useClientChantier();
  const { toast } = useToast();

  const handleReset = () => {
    if (confirm('Êtes-vous sûr de vouloir réinitialiser toutes les informations client et chantier ?')) {
      dispatch({ type: 'RESET_CLIENT_CHANTIER' });
      toast({
        title: "Informations réinitialisées",
        description: "Toutes les informations client et chantier ont été réinitialisées.",
      });
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Link to="/">
              <Button variant="outline" size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" /> Retour
              </Button>
            </Link>
            <h1 className="text-2xl font-bold ml-2">
              <FileText className="inline-block mr-2 h-6 w-6" />
              Informations Client / Chantier
            </h1>
          </div>
          <Button variant="reset" onClick={handleReset}>
            Réinitialiser les informations
          </Button>
        </div>

        <Tabs defaultValue="client" className="w-full">
          <TabsList className="grid w-full md:w-[400px] grid-cols-2">
            <TabsTrigger value="client" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Client
            </TabsTrigger>
            <TabsTrigger value="chantier" className="flex items-center gap-2">
              <Building className="h-4 w-4" />
              Chantier
            </TabsTrigger>
          </TabsList>
          <TabsContent value="client" className="py-4">
            <ClientForm />
          </TabsContent>
          <TabsContent value="chantier" className="py-4">
            <ChantierForm />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ClientChantier;
