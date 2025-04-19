
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { Room, Travail, ProjectMetadata, PrintableField, CompanyData } from '@/types';
import { prepareDetailsContent } from './pdf/generators/detailsGenerator';
import { prepareCoverContent } from './pdf/generators/coverGenerator';
import { prepareRecapContent } from './pdf/generators/recapGenerator';
import { PDF_MARGINS } from './pdf/constants/pdfConstants';
import { PdfSettings } from './pdf/config/pdfSettingsTypes';

// Configurer pdfMake pour utiliser les polices
// The correct way to set up vfs
pdfMake.vfs = pdfFonts.pdfMake ? pdfFonts.pdfMake.vfs : pdfFonts.vfs;

/**
 * Génère un PDF détaillé pour le devis
 * @param rooms Liste des pièces
 * @param travaux Liste des travaux
 * @param getTravauxForPiece Fonction pour obtenir les travaux d'une pièce
 * @param metadata Métadonnées du projet (client, etc.)
 * @param pdfSettings Paramètres de style du PDF
 */
export const generateDetailsPDF = async (
  rooms: Room[],
  travaux: Travail[],
  getTravauxForPiece: (pieceId: string) => Travail[],
  metadata?: ProjectMetadata,
  pdfSettings?: PdfSettings
) => {
  try {
    console.log('Génération du PDF avec les paramètres:', pdfSettings);
    
    // Préparer les champs pour la page de garde
    const fields = [
      { id: 'devisNumber', content: metadata?.devisNumber || 'D-' + new Date().toISOString().slice(0, 10) },
      { id: 'devisDate', content: metadata?.dateDevis || new Date().toISOString().slice(0, 10) },
      { id: 'client', content: metadata?.clientsData || 'Client non spécifié' },
      { id: 'projectDescription', content: metadata?.descriptionProjet || '' },
      { id: 'projectAddress', content: metadata?.adresseChantier || '' },
      { id: 'occupant', content: metadata?.occupant || '' },
      { id: 'additionalInfo', content: metadata?.infoComplementaire || '' }
    ];
    
    // Générer les contenus des différentes parties du PDF
    const coverContent = prepareCoverContent(fields, metadata?.company || null, metadata, pdfSettings);
    const detailsContent = prepareDetailsContent(rooms, travaux, getTravauxForPiece, metadata, pdfSettings);
    const recapContent = prepareRecapContent(rooms, travaux, getTravauxForPiece, metadata, pdfSettings);
    
    // Définir les marges pour chaque partie en utilisant les paramètres personnalisés
    const margins = {
      cover: pdfSettings?.margins?.cover || PDF_MARGINS.COVER,
      details: pdfSettings?.margins?.details || PDF_MARGINS.DETAILS,
      recap: pdfSettings?.margins?.recap || PDF_MARGINS.RECAP
    };
    
    // Créer le document PDF
    const docDefinition = {
      // Métadonnées du document
      info: {
        title: `Devis - ${metadata?.nomProjet || 'Projet'}`,
        author: metadata?.company?.name || 'LRS Rénovation',
        subject: 'Devis de travaux',
        keywords: 'devis, travaux, rénovation'
      },
      
      // Police par défaut
      defaultStyle: {
        font: pdfSettings?.fontFamily || 'Roboto'
      },
      
      // Contenu organisé en pages avec différentes marges
      content: [
        // Page de garde
        {
          margin: margins.cover,
          stack: coverContent
        },
        
        // Détails des travaux (nouvelle page)
        {
          pageBreak: 'before',
          margin: margins.details,
          stack: detailsContent
        },
        
        // Page de récapitulatif (nouvelle page, gérée dans le contenu)
        {
          margin: margins.recap,
          stack: recapContent
        }
      ]
    };
    
    // Générer et ouvrir le PDF
    pdfMake.createPdf(docDefinition).open();
    
    console.log('PDF généré avec succès');
    return true;
  } catch (error) {
    console.error('Erreur lors de la génération du PDF:', error);
    throw error;
  }
};

/**
 * Génère uniquement la partie récapitulative du PDF
 */
export const generateRecapPDF = async (
  rooms: Room[],
  travaux: Travail[],
  getTravauxForPiece: (pieceId: string) => Travail[],
  metadata?: ProjectMetadata,
  pdfSettings?: PdfSettings
) => {
  try {
    console.log('Génération du PDF récapitulatif avec les paramètres:', pdfSettings);
    
    // Générer le contenu du récapitulatif
    const recapContent = prepareRecapContent(rooms, travaux, getTravauxForPiece, metadata, pdfSettings);
    
    // Définir les marges
    const margins = pdfSettings?.margins?.recap || PDF_MARGINS.RECAP;
    
    // Créer le document PDF
    const docDefinition = {
      info: {
        title: `Récapitulatif - ${metadata?.nomProjet || 'Projet'}`,
        author: metadata?.company?.name || 'LRS Rénovation',
        subject: 'Récapitulatif de devis',
        keywords: 'récapitulatif, devis, travaux'
      },
      
      defaultStyle: {
        font: pdfSettings?.fontFamily || 'Roboto'
      },
      
      content: [
        {
          margin: margins,
          stack: recapContent
        }
      ]
    };
    
    // Générer et ouvrir le PDF
    pdfMake.createPdf(docDefinition).open();
    
    console.log('PDF récapitulatif généré avec succès');
    return true;
  } catch (error) {
    console.error('Erreur lors de la génération du PDF récapitulatif:', error);
    throw error;
  }
};

/**
 * Génère un PDF complet avec toutes les sections basées sur les champs activés
 */
export const generateCompletePDF = async (
  enabledFields: PrintableField[],
  companyData: CompanyData | null,
  rooms: Room[],
  travaux: Travail[],
  getTravauxForPiece: (pieceId: string) => Travail[],
  metadata?: ProjectMetadata,
  pdfSettings?: PdfSettings
) => {
  try {
    console.log('Génération du PDF complet avec les paramètres:', pdfSettings);
    
    // Préparer les champs pour la page de garde en utilisant les champs activés
    const fields = enabledFields
      .filter(field => field.id !== 'companyLogo' && field.id !== 'summary')
      .map(field => ({
        id: field.id,
        content: field.content || ''
      }));
    
    // Générer les contenus des différentes parties du PDF
    const coverContent = prepareCoverContent(fields, companyData, metadata, pdfSettings);
    const detailsContent = prepareDetailsContent(rooms, travaux, getTravauxForPiece, metadata, pdfSettings);
    const recapContent = prepareRecapContent(rooms, travaux, getTravauxForPiece, metadata, pdfSettings);
    
    // Définir les marges pour chaque partie en utilisant les paramètres personnalisés
    const margins = {
      cover: pdfSettings?.margins?.cover || PDF_MARGINS.COVER,
      details: pdfSettings?.margins?.details || PDF_MARGINS.DETAILS,
      recap: pdfSettings?.margins?.recap || PDF_MARGINS.RECAP
    };
    
    // Déterminer quelles parties inclure en fonction des champs activés
    const content: any[] = [];
    
    // Toujours inclure la page de garde
    content.push({
      margin: margins.cover,
      stack: coverContent
    });
    
    // Inclure la section détails des travaux
    content.push({
      pageBreak: 'before',
      margin: margins.details,
      stack: detailsContent
    });
    
    // Inclure le récapitulatif si activé
    if (enabledFields.find(field => field.id === 'summary')?.enabled) {
      content.push({
        pageBreak: 'before',
        margin: margins.recap,
        stack: recapContent
      });
    }
    
    // Créer le document PDF
    const docDefinition = {
      info: {
        title: `Devis - ${metadata?.nomProjet || 'Projet'}`,
        author: metadata?.company?.name || 'LRS Rénovation',
        subject: 'Devis de travaux',
        keywords: 'devis, travaux, rénovation'
      },
      
      defaultStyle: {
        font: pdfSettings?.fontFamily || 'Roboto'
      },
      
      content: content
    };
    
    // Générer et ouvrir le PDF
    pdfMake.createPdf(docDefinition).open();
    
    console.log('PDF complet généré avec succès');
    return true;
  } catch (error) {
    console.error('Erreur lors de la génération du PDF complet:', error);
    throw error;
  }
};
