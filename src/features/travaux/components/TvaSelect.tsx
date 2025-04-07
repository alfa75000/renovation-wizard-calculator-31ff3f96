
import React from 'react';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export interface TvaSelectProps {
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
  className?: string;
}

const TvaSelect: React.FC<TvaSelectProps> = ({
  value,
  onChange,
  disabled = false,
  className = "",
}) => {
  const handleChange = (val: string) => {
    onChange(parseFloat(val));
  };

  return (
    <Select
      value={value.toString()}
      onValueChange={handleChange}
      disabled={disabled}
    >
      <SelectTrigger className={className}>
        <SelectValue placeholder="Taux de TVA" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem value="5.5">5.5% - Travaux de rénovation énergétique</SelectItem>
          <SelectItem value="10">10% - Travaux de rénovation</SelectItem>
          <SelectItem value="20">20% - Taux normal</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default TvaSelect;
