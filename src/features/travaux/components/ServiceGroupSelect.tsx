
import React, { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ServiceGroup } from '@/types/supabase';
import { fetchServiceGroups } from '@/services/travauxService';
import { toast } from 'sonner';

interface ServiceGroupSelectProps {
  workTypeId: string;
  value: string;
  onChange: (id: string, label: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

const ServiceGroupSelect: React.FC<ServiceGroupSelectProps> = ({
  workTypeId,
  value,
  onChange,
  placeholder = "Sélectionner un groupe",
  disabled = false,
  className = "",
}) => {
  const [groups, setGroups] = useState<ServiceGroup[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Charger les groupes quand le type de travail change
  useEffect(() => {
    if (!workTypeId) {
      setGroups([]);
      return;
    }
    
    const loadGroups = async () => {
      setLoading(true);
      try {
        const data = await fetchServiceGroups(workTypeId);
        console.log("ServiceGroupSelect - Groupes chargés:", data);
        setGroups(data);
      } catch (error) {
        console.error("Erreur lors du chargement des groupes:", error);
        toast.error("Impossible de charger les groupes");
      } finally {
        setLoading(false);
      }
    };
    
    loadGroups();
  }, [workTypeId]);
  
  useEffect(() => {
    // Réinitialiser la valeur si le type de travail change
    if (workTypeId && value) {
      const groupExists = groups.some(g => g.id === value);
      if (!groupExists) {
        console.log("ServiceGroupSelect - Réinitialisation car le groupe n'existe plus dans la nouvelle liste");
        onChange("", "");
      }
    }
  }, [workTypeId, groups, onChange, value]);

  const handleChange = (groupId: string) => {
    console.log("ServiceGroupSelect - handleChange appelé avec:", groupId);
    const group = groups.find(g => g.id === groupId);
    if (group) {
      console.log("ServiceGroupSelect - Groupe sélectionné:", group.name);
      onChange(group.id, group.name);
    }
  };

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
        {groups.length > 0 ? (
          groups.map((group) => (
            <SelectItem key={group.id} value={group.id}>
              {group.name}
            </SelectItem>
          ))
        ) : (
          <SelectItem value="none" disabled>
            {loading ? "Chargement..." : "Aucun groupe disponible"}
          </SelectItem>
        )}
      </SelectContent>
    </Select>
  );
};

export default ServiceGroupSelect;
