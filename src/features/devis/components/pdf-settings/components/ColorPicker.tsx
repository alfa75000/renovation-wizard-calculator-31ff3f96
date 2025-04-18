
import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Check, ChevronDown } from 'lucide-react';

interface ColorPickerProps {
  label: string;
  value: string;
  onChange: (color: string) => void;
  defaultColors?: string[];
}

export const ColorPicker: React.FC<ColorPickerProps> = ({
  label,
  value,
  onChange,
  defaultColors = ['#1a1f2c', '#9b87f5', '#7E69AB', '#6E59A5', '#D6BCFA']
}) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="flex gap-2">
        <div 
          className="w-10 h-10 rounded border cursor-pointer" 
          style={{ backgroundColor: value }}
          onClick={() => setOpen(true)}
        />
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="flex-1 justify-between">
              {value}
              <ChevronDown className="h-4 w-4 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64">
            <div className="space-y-2">
              <div className="grid grid-cols-5 gap-2">
                {defaultColors.map((color) => (
                  <div
                    key={color}
                    className="relative cursor-pointer w-8 h-8 rounded border"
                    style={{ backgroundColor: color }}
                    onClick={() => {
                      onChange(color);
                      setOpen(false);
                    }}
                  >
                    {value === color && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Check className="h-4 w-4 text-white drop-shadow" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <Input
                  type="text"
                  value={value}
                  onChange={(e) => onChange(e.target.value)}
                  className="flex-1"
                />
                <Button
                  size="sm"
                  onClick={() => setOpen(false)}
                >
                  Appliquer
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};
