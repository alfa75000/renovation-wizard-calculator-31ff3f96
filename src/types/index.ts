
// Types pour l'application
export * from './client';
export * from './menuiserie';
export * from './project';
export * from './room';
export * from './surface';
export * from './travaux';
export * from './company';

// Réexporter l'interface PrintableField depuis pdfGenerationService
export { PrintableField } from '../features/devis/services/pdfGenerationService';
