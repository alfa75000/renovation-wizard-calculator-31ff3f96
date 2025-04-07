
import React, { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Service } from '@/types/supabase';
import { fetchServices } from '@/services/travauxService';
import { toast } from 'sonner';

interface SousTypeSelectProps {
  groupId: string;
  value: string;
  onChange: (id: string, label: string, service: Service) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

const SousTypeSelect: React.FC<SousTypeSelectProps> = ({
  groupId,
  value,
  onChange,
  placeholder = "Sélectionner une prestation",
  disabled = false,
  className = "",
}) => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Charger les services quand le groupe change
  useEffect(() => {
    if (!groupId) {
      setServices([]);
      return;
    }
    
    const loadServices = async () => {
      setLoading(true);
      try {
        console.log(`SousTypeSelect - Chargement des services pour le groupe ${groupId}`);
        const data = await fetchServices(groupId);
        console.log(`SousTypeSelect - Services récupérés:`, data);
        
        // Ajouter une valeur par défaut pour l'unité si nécessaire
        const formattedServices = data.map(service => ({
          ...service,
          unit: service.unit || 'm²' // Valeur par défaut pour compatibilité
        }));
        
        setServices(formattedServices);
      } catch (error) {
        console.error("Erreur lors du chargement des services:", error);
        toast.error("Impossible de charger les prestations");
      } finally {
        setLoading(false);
      }
    };
    
    loadServices();
  }, [groupId]);
  
  // Réinitialiser la valeur si le groupe change
  useEffect(() => {
    if (groupId && value) {
      // Ne réinitialiser que si le groupId change, mais pas lors du chargement initial
      onChange("", "", {} as Service);
    }
  }, [groupId, onChange, value]);

  const handleChange = (serviceId: string) => {
    const service = services.find(s => s.id === serviceId);
    if (service) {
      console.log(`SousTypeSelect - Service sélectionné:`, service);
      onChange(service.id, service.name, service);
    }
  };

  // Rendre le composant visible même s'il n'y a pas de services
  return (
    <Select
      value={value}
      onValueChange={handleChange}
      disabled={disabled || loading}
    >
      <SelectTrigger className={className}>
        <SelectValue placeholder={loading ? "Chargement..." : placeholder} />
      </SelectTrigger>
      <SelectContent>
        {services.length > 0 ? (
          services.map((service) => (
            <SelectItem key={service.id} value={service.id}>
              {service.name} ({(service.labor_price + service.supply_price).toFixed(2)}€/m²)
            </SelectItem>
          ))
        ) : (
          <SelectItem value="none" disabled>
            {loading ? "Chargement..." : "Aucune prestation disponible"}
          </SelectItem>
        )}
      </SelectContent>
    </Select>
  );
};

export default SousTypeSelect;
