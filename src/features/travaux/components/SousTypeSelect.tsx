
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
  const [selectedValue, setSelectedValue] = useState<string>(value);
  
  // Charger les services quand le groupe change
  useEffect(() => {
    console.log("SousTypeSelect - groupId changé:", groupId);
    if (!groupId) {
      setServices([]);
      return;
    }
    
    const loadServices = async () => {
      setLoading(true);
      try {
        console.log("SousTypeSelect - Chargement des services pour le groupe:", groupId);
        const data = await fetchServices(groupId);
        console.log("SousTypeSelect - Services récupérés:", data);
        
        if (data && data.length > 0) {
          // Ajouter une valeur par défaut pour l'unité si nécessaire
          const formattedServices = data.map(service => ({
            ...service,
            unit: service.unit || 'Unité' // Valeur par défaut pour unité
          }));
          
          setServices(formattedServices);
          console.log("SousTypeSelect - Services formatés:", formattedServices);
        } else {
          setServices([]);
          console.log("SousTypeSelect - Aucun service disponible");
        }
      } catch (error) {
        console.error("Erreur lors du chargement des services:", error);
        toast.error("Impossible de charger les prestations");
      } finally {
        setLoading(false);
      }
    };
    
    loadServices();
  }, [groupId]);
  
  // Mettre à jour la valeur sélectionnée quand value change (pour la synchronisation entre composants)
  useEffect(() => {
    setSelectedValue(value);
  }, [value]);
  
  // Réinitialiser la valeur si le groupe change
  useEffect(() => {
    // S'assurer que nous ne réinitialisons pas lors du premier rendu ou quand value est déjà vide
    if (groupId && selectedValue) {
      const serviceExists = services.some(s => s.id === selectedValue);
      if (!serviceExists) {
        console.log("SousTypeSelect - Réinitialisation car le service n'existe plus dans la nouvelle liste");
        onChange("", "", {} as Service);
        setSelectedValue("");
      }
    }
  }, [groupId, services, onChange, selectedValue]);

  const handleChange = (serviceId: string) => {
    console.log("SousTypeSelect - handleChange appelé avec:", serviceId);
    const service = services.find(s => s.id === serviceId);
    if (service) {
      console.log("SousTypeSelect - Service sélectionné:", service.name);
      setSelectedValue(serviceId); // Mettre à jour l'état local
      onChange(service.id, service.name, service);
    }
  };

  // Debug: Affichons l'état du composant
  console.log("SousTypeSelect - Rendu avec:", { 
    groupId, 
    value,
    selectedValue,
    servicesCount: services.length, 
    loading, 
    disabled 
  });

  return (
    <Select
      value={selectedValue}
      onValueChange={handleChange}
      disabled={disabled || loading || services.length === 0}
    >
      <SelectTrigger className={className}>
        <SelectValue placeholder={loading ? "Chargement..." : placeholder} />
      </SelectTrigger>
      <SelectContent>
        {services.length > 0 ? (
          services.map((service) => (
            <SelectItem key={service.id} value={service.id}>
              {service.name} ({(service.labor_price + service.supply_price).toFixed(2)}€/{service.unit || 'Unité'})
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
