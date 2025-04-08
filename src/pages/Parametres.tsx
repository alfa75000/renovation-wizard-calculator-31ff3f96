
import React, { useState } from "react";
import { Layout } from "@/components/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdminMenuiserieTypes from "@/features/admin/components/AdminMenuiserieTypes";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { TravauxTypesProvider } from "@/contexts/TravauxTypesContext";
import { ClientsProvider } from "@/contexts/ClientsContext";
import AdminTypesTravauxListe from "@/features/admin/components/AdminTypesTravauxListe";
import AdminClientsListe from "@/features/admin/components/AdminClientsListe";

const Parametres = () => {
  const [activeTab, setActiveTab] = useState("travaux");

  return (
    <Layout title="Paramètres" subtitle="Configuration de l'application">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 w-full max-w-md mb-6">
          <TabsTrigger value="travaux">Types de Travaux</TabsTrigger>
          <TabsTrigger value="menuiseries">Menuiseries</TabsTrigger>
          <TabsTrigger value="clients">Clients</TabsTrigger>
        </TabsList>

        <ClientsProvider>
          <TravauxTypesProvider>
            <TabsContent value="travaux" className="mt-0">
              <AdminTypesTravauxListe />
            </TabsContent>

            <TabsContent value="menuiseries" className="mt-0">
              <AdminMenuiserieTypes />
            </TabsContent>

            <TabsContent value="clients" className="mt-0">
              <AdminClientsListe />
            </TabsContent>
          </TravauxTypesProvider>
        </ClientsProvider>
      </Tabs>
    </Layout>
  );
};

export default Parametres;
