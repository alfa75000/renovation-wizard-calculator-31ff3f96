
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchCompanies, Company } from '@/services/companiesService';
import { Card, CardContent } from '@/components/ui/card';

interface CompanyDetailsProps {
  companyId: string;
}

export const CompanyDetails: React.FC<CompanyDetailsProps> = ({ companyId }) => {
  const { data: companies = [] } = useQuery({
    queryKey: ['companies'],
    queryFn: fetchCompanies
  });
  
  const company = companies.find(c => c.id === companyId);
  
  if (!company) {
    return null;
  }
  
  return (
    <Card className="border border-gray-200">
      <CardContent className="p-4 text-sm">
        <div className="grid grid-cols-2 gap-2">
          <div>
            <p className="font-medium">{company.name}</p>
            {company.address && (
              <p className="text-gray-600">{company.address}</p>
            )}
            {(company.postal_code || company.city) && (
              <p className="text-gray-600">
                {company.postal_code} {company.city}
              </p>
            )}
          </div>
          <div>
            {company.tel1 && (
              <p className="text-gray-600">Tel: {company.tel1}</p>
            )}
            {company.email && (
              <p className="text-gray-600">{company.email}</p>
            )}
            {company.siret && (
              <p className="text-gray-600">SIRET: {company.siret}</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
