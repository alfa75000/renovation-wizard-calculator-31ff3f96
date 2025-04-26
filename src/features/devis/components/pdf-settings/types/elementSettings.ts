
import { z } from 'zod';

// Définir d'abord le schéma Zod
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
  padding: z.object({
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
});

// Utiliser l'inférence de type de Zod pour définir ElementSettings
export type ElementSettings = z.infer<typeof ElementSettingsSchema>;
export type SpacingSettings = NonNullable<ElementSettings['spacing']>;
export type BorderSettings = NonNullable<ElementSettings['border']>;

// Default settings for an element
export const defaultElementSettings: ElementSettings = {
  fontFamily: 'Roboto',
  fontSize: 12,
  isBold: false,
  isItalic: false,
  color: '#1a1f2c',
  alignment: 'left',
  lineHeight: 1.5,
  spacing: {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
  },
  padding: {
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
