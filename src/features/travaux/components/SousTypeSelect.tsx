
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
        const data = await fetchServices(groupId);
        setServices(data.map(service => ({
          ...service,
          unit: 'm²' // Valeur par défaut pour compatibilité
        })));
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
    if (groupId) {
      // Réinitialiser la sélection quand le groupe change
      onChange("", "", {} as Service);
    }
  }, [groupId, onChange]);

  const handleChange = (serviceId: string) => {
    const service = services.find(s => s.id === serviceId);
    if (service) {
      onChange(service.id, service.name, service);
    }
  };

  return (
    <Select
      value={value}
      onValueChange={handleChange}
      disabled={disabled || loading || services.length === 0}
    >
      <SelectTrigger className={className}>
        <SelectValue placeholder={loading ? "Chargement..." : placeholder} />
      </SelectTrigger>
      <SelectContent>
        {services.map((service) => (
          <SelectItem key={service.id} value={service.id}>
            {service.name} ({(service.labor_price + service.supply_price).toFixed(2)}€/m²)
          </SelectItem>
        ))}
        {services.length === 0 && !loading && (
          <SelectItem value="none" disabled>
            Aucune prestation disponible
          </SelectItem>
        )}
      </SelectContent>
    </Select>
  );
};

export default SousTypeSelect;
