
import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useQuery } from '@tanstack/react-query';
import { fetchCompanies, Company } from '@/services/companiesService';
import { CompanyDetails } from '../CompanyDetails';

interface CompanySelectionProps {
  companyId: string;
  setCompanyId: (id: string) => void;
}

export const CompanySelection: React.FC<CompanySelectionProps> = ({ 
  companyId, 
  setCompanyId 
}) => {
  const { data: companies = [], isLoading, error } = useQuery({
    queryKey: ['companies'],
    queryFn: fetchCompanies
  });
  
  if (isLoading) {
    return <div>Chargement des sociétés...</div>;
  }
  
  if (error) {
    return <div>Erreur lors du chargement des sociétés</div>;
  }
  
  return (
    <div className="space-y-3">
      <div>
        <Label htmlFor="company">Société</Label>
        <Select 
          value={companyId} 
          onValueChange={(value) => setCompanyId(value)}
        >
          <SelectTrigger id="company" className="w-full">
            <SelectValue placeholder="Sélectionner une société" />
          </SelectTrigger>
          <SelectContent>
            {companies.map((company) => (
              <SelectItem key={company.id} value={company.id}>
                {company.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      {companyId && <CompanyDetails companyId={companyId} />}
    </div>
  );
};
