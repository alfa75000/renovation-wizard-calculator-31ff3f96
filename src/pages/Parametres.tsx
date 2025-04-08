import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Layout } from "@/components/Layout";
import TravauxTypesList from "@/features/admin/components/TravauxTypesList";
import AutresSurfacesTypesList from "@/features/admin/components/AutresSurfacesTypesList";
import OptionsList from "@/features/admin/components/OptionsList";
import MenuiseriesTypesList from "@/features/admin/components/MenuiseriesTypesList";

const Parametres: React.FC = () => {
  return (
    <Layout title="Paramètres" subtitle="Configuration de l'application">
      <Tabs defaultValue="travaux">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="travaux">Travaux</TabsTrigger>
          <TabsTrigger value="menuiseries">Menuiseries</TabsTrigger>
          <TabsTrigger value="autres">Autres Surfaces</TabsTrigger>
          <TabsTrigger value="options">Options</TabsTrigger>
        </TabsList>
        
        <TabsContent value="travaux" className="mt-6">
          <TravauxTypesList />
        </TabsContent>
        
        <TabsContent value="menuiseries" className="mt-6">
          <MenuiseriesTypesList />
        </TabsContent>
        
        <TabsContent value="autres" className="mt-6">
          <AutresSurfacesTypesList />
        </TabsContent>
        
        <TabsContent value="options" className="mt-6">
          <OptionsList />
        </TabsContent>
      </Tabs>
    </Layout>
  );
};

export default Parametres;
