
import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Calendar, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { generateDevisNumber } from '@/services/devisService';

interface DevisInfoFormProps {
  devisNumber: string;
  setDevisNumber: (number: string) => void;
  dateDevis: string;
  setDateDevis: (date: string) => void;
}

export const DevisInfoForm: React.FC<DevisInfoFormProps> = ({
  devisNumber,
  setDevisNumber,
  dateDevis,
  setDateDevis
}) => {
  const [isGeneratingDevisNumber, setIsGeneratingDevisNumber] = useState<boolean>(false);
  
  const handleGenerateDevisNumber = async () => {
    try {
      setIsGeneratingDevisNumber(true);
      const newDevisNumber = await generateDevisNumber();
      setDevisNumber(newDevisNumber);
      toast.success('Numéro de devis généré avec succès');
    } catch (error) {
      console.error('Erreur lors de la génération du numéro de devis:', error);
      toast.error('Erreur lors de la génération du numéro de devis');
    } finally {
      setIsGeneratingDevisNumber(false);
    }
  };
  
  return (
    <div className="space-y-3">
      <div>
        <Label htmlFor="devisNumber">Numéro du devis</Label>
        <div className="flex gap-2">
          <Input 
            id="devisNumber" 
            value={devisNumber} 
            onChange={(e) => setDevisNumber(e.target.value)}
            placeholder="Ex: 2504-1"
            className="flex-1"
          />
          <Button 
            type="button" 
            variant="outline" 
            size="icon" 
            onClick={handleGenerateDevisNumber}
            disabled={isGeneratingDevisNumber}
            title="Générer un numéro de devis"
          >
            <RefreshCw className={`h-4 w-4 ${isGeneratingDevisNumber ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>
      
      <div>
        <Label htmlFor="dateDevis">Date du devis</Label>
        <div className="relative">
          <Input 
            id="dateDevis" 
            type="date" 
            value={dateDevis} 
            onChange={(e) => setDateDevis(e.target.value)}
          />
          <Calendar className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
        </div>
      </div>
    </div>
  );
};
