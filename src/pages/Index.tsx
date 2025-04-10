import React from "react";
import Layout from "@/components/Layout";
import RenovationEstimator from "@/components/RenovationEstimator";

const Index = () => {
  return (
    <Layout
      title="Wizard Rénovation"
      subtitle="Estimez facilement vos projets de rénovation"
    >
      <RenovationEstimator />
    </Layout>
  );
};

export default Index;
