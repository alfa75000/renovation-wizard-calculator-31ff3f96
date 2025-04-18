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

// Valeurs par défaut pour les nouvelles instances d'ElementSettings
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

export const ElementSettingsSchema = z.object({
  fontFamily: z.string().default('Roboto'),
  fontSize: z.number().default(12),
  isBold: z.boolean().default(false),
  isItalic: z.boolean().default(false),
  color: z.string().default('#1a1f2c'),
  alignment: z.enum(['left', 'center', 'right', 'justify']).default('left'),
  spacing: z.object({
    top: z.number().default(0),
    right: z.number().default(0),
    bottom: z.number().default(0),
    left: z.number().default(0)
  }).default({
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
  }),
  border: z.object({
    top: z.boolean().default(false),
    right: z.boolean().default(false),
    bottom: z.boolean().default(false),
    left: z.boolean().default(false),
    color: z.string().default('#1a1f2c'),
    width: z.number().default(1)
  }).default({
    top: false,
    right: false,
    bottom: false,
    left: false,
    color: '#1a1f2c',
    width: 1
  })
});

export const defaultElements = {
  cover_title: defaultElementSettings,
  company_info: defaultElementSettings,
  contact_labels: defaultElementSettings,
  contact_values: defaultElementSettings,
  company_slogan: defaultElementSettings,
  devis_number: defaultElementSettings,
  devis_date: defaultElementSettings,
  devis_validity: defaultElementSettings,
  client_title: defaultElementSettings,
  client_content: defaultElementSettings,
  chantier_title: defaultElementSettings,
  chantier_labels: defaultElementSettings,
  chantier_values: defaultElementSettings,
  footer: defaultElementSettings
};
