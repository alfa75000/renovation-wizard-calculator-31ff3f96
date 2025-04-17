
import { z } from 'zod';

export const PdfSettingsSchema = z.object({
  fontFamily: z.string().default('Roboto'),
  fontSize: z.object({
    title: z.number().default(18),
    subtitle: z.number().default(14),
    heading: z.number().default(12),
    normal: z.number().default(10),
    small: z.number().default(8)
  }),
  colors: z.object({
    primary: z.string().default('#002855'),
    secondary: z.string().default('#4D7C8A'),
    text: z.string().default('#333333'),
    light: z.string().default('#F3F4F6')
  }),
  margins: z.object({
    cover: z.tuple([z.number(), z.number(), z.number(), z.number()]).default([40, 40, 40, 40]),
    details: z.tuple([z.number(), z.number(), z.number(), z.number()]).default([30, 70, 30, 40]),
    recap: z.tuple([z.number(), z.number(), z.number(), z.number()]).default([40, 40, 40, 40])
  }),
  logoSettings: z.object({
    useDefaultLogo: z.boolean().default(true),
    logoUrl: z.string().nullable().default(null),
    width: z.number().default(150),
    height: z.number().default(70),
    alignment: z.enum(['left', 'center', 'right']).default('left')
  })
});

export type PdfSettings = z.infer<typeof PdfSettingsSchema>;
