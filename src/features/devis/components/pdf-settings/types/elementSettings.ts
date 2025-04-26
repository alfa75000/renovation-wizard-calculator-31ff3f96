// Définition des paramètres de style pour chaque élément du PDF
import { z } from 'zod';

export interface Spacing {
  top?: number;
  right?: number;
  bottom?: number;
  left?: number;
}

export type SpacingSettings = Spacing;

export interface Border {
  top?: boolean;
  right?: boolean;
  bottom?: boolean;
  left?: boolean;
  color?: string;
  width?: number;
}

export type BorderSettings = Border;

export type TextAlignment = 'left' | 'center' | 'right' | 'justify';

export interface ElementSettings {
  // Typographie
  fontFamily?: string;
  fontSize?: number;
  isBold?: boolean;
  isItalic?: boolean;
  
  // Apparence
  color?: string;
  alignment?: TextAlignment;
  fillColor?: string; // Ajout de la propriété fillColor
  
  // Espacement
  spacing?: Spacing;
  
  // Bordure
  border?: Border;
}

// Default settings for an element
export const defaultElementSettings: ElementSettings = {
  fontFamily: 'Roboto',
  fontSize: 12,
  isBold: false,
  isItalic: false,
  color: '#1a1f2c',
  alignment: 'left',
  spacing: {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
  },
  border: {
    top: false,
    right: false,
    bottom: false,
    left: false,
    color: '#1a1f2c',
    width: 1
  }
};

// Create a Zod schema for ElementSettings
export const ElementSettingsSchema = z.object({
  fontFamily: z.string().optional(),
  fontSize: z.number().optional(),
  isBold: z.boolean().optional(),
  isItalic: z.boolean().optional(),
  color: z.string().optional(),
  alignment: z.enum(['left', 'center', 'right', 'justify']).optional(),
  fillColor: z.string().optional(),
  lineHeight: z.number().optional(),
  spacing: z.object({
    top: z.number().optional(),
    right: z.number().optional(),
    bottom: z.number().optional(),
    left: z.number().optional()
  }).optional(),
  border: z.object({
    top: z.boolean().optional(),
    right: z.boolean().optional(),
    bottom: z.boolean().optional(),
    left: z.boolean().optional(),
    color: z.string().optional(),
    width: z.number().optional()
  }).optional()
}).optional();
