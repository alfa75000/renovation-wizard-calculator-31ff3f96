
import React, { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from "@/components/ui/badge";
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
          setServices(data);
          console.log("SousTypeSelect - Services formatés:", data);
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
  
  useEffect(() => {
    setSelectedValue(value);
  }, [value]);
  
  useEffect(() => {
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
      console.log("SousTypeSelect - Détails du service:", service);
      setSelectedValue(serviceId);
      onChange(service.id, service.name, service);
    }
  };

  const renderServiceUpdateBadge = (service: Service) => {
    if (service.last_update_date) {
      return (
        <Badge 
          variant="default" 
          className="ml-2 bg-green-100 text-green-800"
        >
          Mis à jour: {service.last_update_date}
        </Badge>
      );
    }
    return (
      <Badge 
        variant="default" 
        className="ml-2 bg-orange-100 text-orange-800"
      >
        Valeurs par défaut
      </Badge>
    );
  };

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
            <SelectItem key={service.id} value={service.id} className="flex items-center justify-between">
              <div className="flex items-center">
                {service.name} ({(service.labor_price + service.supply_price).toFixed(2)}€/{service.unit || 'Unité'})
                {renderServiceUpdateBadge(service)}
              </div>
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
