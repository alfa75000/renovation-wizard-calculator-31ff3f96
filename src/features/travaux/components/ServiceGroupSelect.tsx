
import { useState, useEffect } from 'react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { ServiceGroup } from "@/types/supabase";
import { fetchServiceGroups } from "@/services/travauxService";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface ServiceGroupSelectProps {
  workTypeId: string;
  value: string;
  onChange: (id: string, label: string) => void;
  placeholder?: string;
  disabled?: boolean;
  label?: string;
  className?: string;
}

const ServiceGroupSelect: React.FC<ServiceGroupSelectProps> = ({
  workTypeId,
  value,
  onChange,
  placeholder = "Sélectionner un groupe",
  disabled = false,
  label = "Groupe de prestations",
  className = "",
}) => {
  const [serviceGroups, setServiceGroups] = useState<ServiceGroup[]>([]);
  const [loading, setLoading] = useState(false);

  // Charger les groupes de services quand le type de travail change
  useEffect(() => {
    if (!workTypeId) {
      setServiceGroups([]);
      return;
    }

    const loadServiceGroups = async () => {
      setLoading(true);
      try {
        const data = await fetchServiceGroups(workTypeId);
        setServiceGroups(data);
      } catch (error) {
        console.error("Erreur lors du chargement des groupes de services:", error);
        toast.error("Impossible de charger les groupes de prestations");
      } finally {
        setLoading(false);
      }
    };

    loadServiceGroups();
  }, [workTypeId]);

  // Réinitialiser la valeur si le type de travail change
  useEffect(() => {
    if (workTypeId) {
      onChange("", "");
    }
  }, [workTypeId, onChange]);

  const handleChange = (newValue: string) => {
    const selectedGroup = serviceGroups.find(group => group.id === newValue);
    if (selectedGroup) {
      onChange(selectedGroup.id, selectedGroup.name);
    }
  };

  return (
    <div className="space-y-1">
      {label && <Label>{label}</Label>}
      <Select
        value={value}
        onValueChange={handleChange}
        disabled={disabled || loading || serviceGroups.length === 0}
      >
        <SelectTrigger className={className}>
          <SelectValue placeholder={loading ? "Chargement..." : placeholder} />
        </SelectTrigger>
        <SelectContent>
          {serviceGroups.map((group) => (
            <SelectItem key={group.id} value={group.id}>
              {group.name}
            </SelectItem>
          ))}
          {serviceGroups.length === 0 && !loading && (
            <SelectItem value="none" disabled>
              Aucun groupe disponible
            </SelectItem>
          )}
        </SelectContent>
      </Select>
    </div>
  );
};

export default ServiceGroupSelect;
