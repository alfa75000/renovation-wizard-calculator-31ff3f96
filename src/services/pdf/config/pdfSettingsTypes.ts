
import { z } from 'zod';
import { ElementSettingsSchema } from '@/features/devis/components/pdf-settings/types/elementSettings';

export const PdfSettingsSchema = z.object({
  fontFamily: z.string().default('Roboto'),
  colors: z.object({
    mainText: z.string().default('#333333'),
    detailsText: z.string().default('#4D7C8A'),
    coverLines: z.string().default('#002855'),
    detailsLines: z.string().default('#4D7C8A'),
    totalBoxLines: z.string().default('#e5e7eb'),
    background: z.string().default('#F3F4F6')
  }).default({
    mainText: '#333333',
    detailsText: '#4D7C8A',
    coverLines: '#002855',
    detailsLines: '#4D7C8A',
    totalBoxLines: '#e5e7eb',
    background: '#F3F4F6'
  }),
  lineSpacing: z.object({
    coverSections: z.number().default(1.5),
    betweenFields: z.number().default(1.2),
    afterDescription: z.number().default(1.8),
    detailsDescription: z.number().default(1.4),
    afterDetailRow: z.number().default(1.2),
    betweenSections: z.number().default(2)
  }).default({
    coverSections: 1.5,
    betweenFields: 1.2,
    afterDescription: 1.8,
    detailsDescription: 1.4,
    afterDetailRow: 1.2,
    betweenSections: 2
  }),
  margins: z.object({
    cover: z.tuple([z.number(), z.number(), z.number(), z.number()]).default([40, 40, 40, 40]), // droite, haut, gauche, bas
    details: z.tuple([z.number(), z.number(), z.number(), z.number()]).default([30, 70, 30, 40]),
    recap: z.tuple([z.number(), z.number(), z.number(), z.number()]).default([40, 40, 40, 40])
  }).default({
    cover: [40, 40, 40, 40],
    details: [30, 70, 30, 40],
    recap: [40, 40, 40, 40]
  }),
  logoSettings: z.object({
    useDefaultLogo: z.boolean().default(true),
    logoUrl: z.string().nullable().default(null),
    width: z.number().default(150),
    height: z.number().default(70),
    alignment: z.enum(['left', 'center', 'right']).default('left')
  }).default({
    useDefaultLogo: true,
    logoUrl: null,
    width: 150,
    height: 70,
    alignment: 'left'
  }),
  elements: z.record(ElementSettingsSchema).default({})
}).default({
  fontFamily: 'Roboto',
  colors: {
    mainText: '#333333',
    detailsText: '#4D7C8A',
    coverLines: '#002855',
    detailsLines: '#4D7C8A',
    totalBoxLines: '#e5e7eb',
    background: '#F3F4F6'
  },
  lineSpacing: {
    coverSections: 1.5,
    betweenFields: 1.2,
    afterDescription: 1.8,
    detailsDescription: 1.4,
    afterDetailRow: 1.2,
    betweenSections: 2
  },
  margins: {
    cover: [40, 40, 40, 40],
    details: [30, 70, 30, 40],
    recap: [40, 40, 40, 40]
  },
  logoSettings: {
    useDefaultLogo: true,
    logoUrl: null,
    width: 150,
    height: 70,
    alignment: 'left'
  },
  elements: {}
});

export type PdfSettings = z.infer<typeof PdfSettingsSchema>;
