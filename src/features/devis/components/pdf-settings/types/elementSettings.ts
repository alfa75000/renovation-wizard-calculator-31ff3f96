
import { z } from 'zod';

// Types d'alignement possibles
export type TextAlignment = 'left' | 'center' | 'right' | 'justify';

// Structure pour les bordures
export interface BorderSettings {
  top: boolean;
  right: boolean;
  bottom: boolean;
  left: boolean;
  color: string;
  width: number;
}

// Structure pour les marges/espacements
export interface SpacingSettings {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

// Configuration complète d'un élément
export interface ElementSettings {
  fontFamily: string;
  fontSize: number;
  isBold: boolean;
  isItalic: boolean;
  color: string;
  alignment: TextAlignment;
  spacing: SpacingSettings;
  border: BorderSettings;
}

export const ElementSettingsSchema = z.object({
  fontFamily: z.string(),
  fontSize: z.number(),
  isBold: z.boolean(),
  isItalic: z.boolean(),
  color: z.string(),
  alignment: z.enum(['left', 'center', 'right', 'justify']),
  spacing: z.object({
    top: z.number(),
    right: z.number(),
    bottom: z.number(),
    left: z.number()
  }),
  border: z.object({
    top: z.boolean(),
    right: z.boolean(),
    bottom: z.boolean(),
    left: z.boolean(),
    color: z.string(),
    width: z.number()
  })
});
