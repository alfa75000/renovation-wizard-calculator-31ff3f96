
import RenovationEstimator from "@/components/RenovationEstimator";
import { Layout } from "@/components/Layout";

const Index = () => {
  return (
    <Layout>
      <div className="max-w-6xl mx-auto p-4">
        <div className="flex flex-col items-center justify-center mb-8 bg-blue-600 text-white p-6 rounded-lg">
          <h1 className="text-3xl md:text-4xl font-bold">
            Estimation de rénovation
          </h1>
          <p className="mt-2 text-lg">Assistant de rénovation simplifié</p>
        </div>
        
        <RenovationEstimator />
      </div>
    </Layout>
  );
};

export default Index;
