
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { Room, Travail, CompanyData, ProjectMetadata } from '@/types';
import { configurePdfStyles, getDocumentMargins, getCustomColors, getFontSizes } from './pdf/pdfGenerationUtils';
import { supabase } from '@/lib/supabase';
import { PdfSettings, PdfSettingsSchema } from './pdf/config/pdfSettingsTypes';
import { toast } from 'sonner';

// Initialize pdfMake with fonts
pdfMake.vfs = pdfFonts.pdfMake ? pdfFonts.pdfMake.vfs : pdfFonts.vfs;

// Define custom types needed
type GetTravauxForPieceFunction = (pieceId: string) => Travail[];
type Metadata = ProjectMetadata;

/**
 * Récupère les paramètres PDF de l'utilisateur actuel
 */
export const getUserPdfSettings = async (userId?: string): Promise<PdfSettings> => {
  if (!userId) {
    console.log('[getUserPdfSettings] Aucun ID utilisateur, utilisation des paramètres par défaut');
    return PdfSettingsSchema.parse({});
  }

  try {
    console.log('[getUserPdfSettings] Récupération des paramètres pour l\'utilisateur:', userId);
    
    const { data, error } = await supabase
      .from('app_state')
      .select('pdf_settings')
      .eq('user_id', userId)
      .single();
    
    if (error) {
      console.error('[getUserPdfSettings] Erreur lors de la récupération:', error);
      return PdfSettingsSchema.parse({});
    }
    
    if (!data?.pdf_settings) {
      console.log('[getUserPdfSettings] Aucun paramètre trouvé, utilisation des valeurs par défaut');
      return PdfSettingsSchema.parse({});
    }
    
    try {
      console.log('[getUserPdfSettings] Paramètres récupérés:', data.pdf_settings);
      // Validation des paramètres avec Zod
      return PdfSettingsSchema.parse(data.pdf_settings);
    } catch (validationError) {
      console.error('[getUserPdfSettings] Erreur lors de la validation des paramètres:', validationError);
      return PdfSettingsSchema.parse({});
    }
  } catch (e) {
    console.error('[getUserPdfSettings] Exception non gérée:', e);
    return PdfSettingsSchema.parse({});
  }
};

/**
 * Génère un PDF de devis détaillé
 */
export const generateDetailsPDF = async (
  rooms: Room[],
  travaux: Travail[],
  getTravauxForPiece: GetTravauxForPieceFunction,
  metadata?: Metadata,
  userId?: string
) => {
  try {
    console.log('Génération du PDF détaillé commencée');
    console.log('Utilisateur ID:', userId);
    
    // Récupérer les paramètres PDF personnalisés
    const userPdfSettings = await getUserPdfSettings(userId);
    console.log('Paramètres PDF récupérés:', userPdfSettings);
    
    // Logger quelques paramètres clés pour vérification
    console.log('Paramètres PDF - couleur principale:', userPdfSettings.colors.mainText);
    console.log('Paramètres PDF - taille de police titre:', userPdfSettings.fontSize.title);
    console.log('Paramètres PDF - marges détails:', userPdfSettings.margins.details);
    
    // Configurer le document avec les paramètres de l'utilisateur
    const { styles, defaultStyle } = configurePdfStyles(userPdfSettings);
    const margins = getDocumentMargins(userPdfSettings, 'details');
    const colors = getCustomColors(userPdfSettings);
    const fontSizes = getFontSizes(userPdfSettings);
    
    // Créer le document PDF
    const docDefinition = {
      pageMargins: margins,
      defaultStyle: defaultStyle,
      styles: styles,
      content: [
        { text: 'DEVIS DÉTAILLÉ', style: 'header', alignment: 'center', fontSize: fontSizes.title, margin: [0, 0, 0, 20] },
        { text: 'Date: ' + new Date().toLocaleDateString(), margin: [0, 0, 0, 10] }
        // Ajoutez le reste du contenu du PDF ici
      ]
    };
    
    console.log('Définition du document créée, génération du PDF');
    
    // Générer et télécharger le PDF
    const pdfDocGenerator = pdfMake.createPdf(docDefinition);
    pdfDocGenerator.download('devis-details.pdf');
    
    toast.success('Devis détaillé généré avec succès');
    console.log('Génération du PDF détaillé terminée avec succès');
  } catch (error) {
    console.error('Erreur lors de la génération du PDF détaillé:', error);
    toast.error('Erreur lors de la génération du PDF');
  }
};

/**
 * Génère un PDF de récapitulatif
 */
export const generateRecapPDF = async (
  rooms: Room[],
  travaux: Travail[],
  getTravauxForPiece: GetTravauxForPieceFunction,
  metadata?: Metadata,
  userId?: string
) => {
  try {
    console.log('Génération du PDF récapitulatif commencée');
    console.log('Utilisateur ID:', userId);
    
    // Récupérer les paramètres PDF personnalisés
    const userPdfSettings = await getUserPdfSettings(userId);
    console.log('Paramètres PDF récupérés:', userPdfSettings);
    
    // Logger quelques paramètres clés pour vérification
    console.log('Paramètres PDF - couleur principale:', userPdfSettings.colors.mainText);
    console.log('Paramètres PDF - taille de police titre:', userPdfSettings.fontSize.title);
    console.log('Paramètres PDF - marges récap:', userPdfSettings.margins.recap);
    
    // Configurer le document avec les paramètres de l'utilisateur
    const { styles, defaultStyle } = configurePdfStyles(userPdfSettings);
    const margins = getDocumentMargins(userPdfSettings, 'recap');
    const colors = getCustomColors(userPdfSettings);
    const fontSizes = getFontSizes(userPdfSettings);
    
    // Créer le document PDF
    const docDefinition = {
      pageMargins: margins,
      defaultStyle: defaultStyle,
      styles: styles,
      content: [
        { text: 'RÉCAPITULATIF', style: 'header', alignment: 'center', fontSize: fontSizes.title, margin: [0, 0, 0, 20] },
        { text: 'Date: ' + new Date().toLocaleDateString(), margin: [0, 0, 0, 10] }
        // Ajoutez le reste du contenu du PDF ici
      ]
    };
    
    console.log('Définition du document créée, génération du PDF');
    
    // Générer et télécharger le PDF
    const pdfDocGenerator = pdfMake.createPdf(docDefinition);
    pdfDocGenerator.download('recapitulatif.pdf');
    
    toast.success('Récapitulatif généré avec succès');
    console.log('Génération du PDF récapitulatif terminée avec succès');
  } catch (error) {
    console.error('Erreur lors de la génération du PDF récapitulatif:', error);
    toast.error('Erreur lors de la génération du PDF');
  }
};

/**
 * Génère un PDF complet avec toutes les sections
 */
export const generateCompletePDF = async (
  enabledFields: any[],
  companyData: CompanyData | null,
  rooms: Room[],
  travaux: Travail[],
  getTravauxForPiece: GetTravauxForPieceFunction,
  metadata?: Metadata,
  userId?: string
) => {
  try {
    console.log('Génération du PDF complet commencée');
    console.log('Utilisateur ID:', userId);
    console.log('Champs activés:', enabledFields.map(f => f.id));
    
    // Récupérer les paramètres PDF personnalisés
    const userPdfSettings = await getUserPdfSettings(userId);
    console.log('Paramètres PDF récupérés pour le PDF complet:', userPdfSettings);
    
    // Configurer le document avec les paramètres de l'utilisateur
    const { styles, defaultStyle } = configurePdfStyles(userPdfSettings);
    const margins = getDocumentMargins(userPdfSettings, 'cover');
    const colors = getCustomColors(userPdfSettings);
    const fontSizes = getFontSizes(userPdfSettings);
    
    // Créer le document PDF
    const docDefinition = {
      pageMargins: margins,
      defaultStyle: defaultStyle,
      styles: styles,
      content: [
        { text: 'DEVIS COMPLET', style: 'header', alignment: 'center', fontSize: fontSizes.title, margin: [0, 0, 0, 20] },
        { text: 'Date: ' + new Date().toLocaleDateString(), margin: [0, 0, 0, 10] }
        // Ajoutez le reste du contenu du PDF ici en fonction des champs activés
      ]
    };
    
    console.log('Définition du document créée, génération du PDF complet');
    
    // Générer et télécharger le PDF
    const pdfDocGenerator = pdfMake.createPdf(docDefinition);
    pdfDocGenerator.download('devis-complet.pdf');
    
    toast.success('Devis complet généré avec succès');
    console.log('Génération du PDF complet terminée avec succès');
  } catch (error) {
    console.error('Erreur lors de la génération du PDF complet:', error);
    toast.error('Erreur lors de la génération du PDF');
  }
};
