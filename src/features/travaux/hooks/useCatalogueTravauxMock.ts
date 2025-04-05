
import { useState } from 'react';
import { sousTravaux } from '@/features/travaux/data/sousTravaux';

export const useCatalogueTravauxMock = () => {
  const [catalogueData] = useState(sousTravaux);

  return {
    data: catalogueData,
    isLoading: false,
    error: null
  };
};
