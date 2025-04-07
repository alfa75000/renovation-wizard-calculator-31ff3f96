
import React from "react";
import { Layout } from "@/components/Layout";
import RenovationEstimator from "@/components/RenovationEstimator";

const Index = () => {
  return (
    <Layout
      title="Estimation de rénovation"
      subtitle="Assistant de rénovation simplifié"
    >
      <RenovationEstimator />
    </Layout>
  );
};

export default Index;
