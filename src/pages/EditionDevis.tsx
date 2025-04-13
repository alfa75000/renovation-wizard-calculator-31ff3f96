
import React from "react";
import { Layout } from "@/components/Layout";
import { PrintableFieldsForm } from "@/features/devis/components/PrintableFieldsForm";

const EditionDevis: React.FC = () => {
  return (
    <Layout
      title="Édition du devis"
      subtitle="Configurez les éléments à imprimer dans le devis"
    >
      <div className="max-w-4xl mx-auto">
        <PrintableFieldsForm />
      </div>
    </Layout>
  );
};

export default EditionDevis;
