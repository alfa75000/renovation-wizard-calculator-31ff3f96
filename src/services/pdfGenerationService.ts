
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { Room, Travail, CompanyData, ProjectMetadata } from '@/types';
import { configurePdfStyles, getDocumentMargins, getCustomColors, getFontSizes } from './pdf/pdfGenerationUtils';
import { supabase } from '@/lib/supabase';
import { PdfSettings, PdfSettingsSchema } from './pdf/config/pdfSettingsTypes';
import { toast } from 'sonner';
import { generateHeaderContent, generateFooter, generateSignatureContent, generateSalutationContent } from './pdf/pdfGenerators';

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
    
    // Contenu du document
    const content: any[] = [];
    
    // Titre du document
    content.push({ 
      text: 'DEVIS', 
      style: 'header', 
      alignment: 'center', 
      fontSize: fontSizes.title, 
      margin: [0, 0, 0, 20] 
    });
    
    // Informations de la société
    if (enabledFields.find(f => f.id === 'companyName')?.enabled) {
      content.push({ 
        text: companyData?.name || "Nom de la société", 
        alignment: 'center', 
        fontSize: fontSizes.subtitle,
        bold: true,
        margin: [0, 0, 0, 10] 
      });
    }
    
    // Logo de la société
    if (enabledFields.find(f => f.id === 'companyLogo')?.enabled && companyData?.logo_url) {
      content.push({
        image: companyData.logo_url,
        width: 150,
        alignment: 'center',
        margin: [0, 0, 0, 20]
      });
    }
    
    // Date du devis
    content.push({ 
      text: 'Date: ' + (enabledFields.find(f => f.id === 'devisDate')?.enabled ? 
        (metadata?.dateDevis || new Date().toLocaleDateString()) : 
        new Date().toLocaleDateString()),
      margin: [0, 0, 0, 10] 
    });
    
    // Numéro du devis
    if (enabledFields.find(f => f.id === 'devisNumber')?.enabled) {
      content.push({ 
        text: 'Numéro de devis: ' + (metadata?.devisNumber || "Non défini"),
        margin: [0, 0, 0, 10] 
      });
    }
    
    // Client
    if (enabledFields.find(f => f.id === 'client')?.enabled) {
      const clientField = enabledFields.find(f => f.id === 'client');
      content.push({ 
        text: 'Client: ' + (clientField?.content || "Non spécifié"),
        margin: [0, 0, 0, 10] 
      });
    }
    
    // Validité de l'offre
    if (enabledFields.find(f => f.id === 'validityOffer')?.enabled) {
      const validityField = enabledFields.find(f => f.id === 'validityOffer');
      content.push({ 
        text: validityField?.content || "Validité de l'offre : 3 mois.",
        margin: [0, 0, 0, 10] 
      });
    }
    
    // Description du projet
    if (enabledFields.find(f => f.id === 'projectDescription')?.enabled) {
      content.push({ 
        text: 'Description du projet: ' + (metadata?.descriptionProjet || "Aucune description"),
        margin: [0, 0, 0, 10] 
      });
    }
    
    // Adresse du chantier
    if (enabledFields.find(f => f.id === 'projectAddress')?.enabled) {
      content.push({ 
        text: 'Adresse du chantier: ' + (metadata?.adresseChantier || "Aucune adresse"),
        margin: [0, 0, 0, 10] 
      });
    }
    
    // Occupant
    if (enabledFields.find(f => f.id === 'occupant')?.enabled) {
      content.push({ 
        text: 'Occupant: ' + (metadata?.occupant || "Non spécifié"),
        margin: [0, 0, 0, 10] 
      });
    }
    
    // Informations complémentaires
    if (enabledFields.find(f => f.id === 'additionalInfo')?.enabled) {
      content.push({ 
        text: 'Informations complémentaires: ' + (metadata?.infoComplementaire || "Aucune information"),
        margin: [0, 0, 0, 20] 
      });
    }
    
    // Récapitulatif des travaux
    if (enabledFields.find(f => f.id === 'summary')?.enabled) {
      content.push({ 
        text: 'RÉCAPITULATIF DES TRAVAUX', 
        style: 'header', 
        alignment: 'center', 
        fontSize: fontSizes.subtitle, 
        margin: [0, 30, 0, 20],
        pageBreak: 'before'
      });
      
      // Génération du tableau récapitulatif pour chaque pièce
      let totalTTC = 0;
      let totalTVA = 0;
      
      rooms.forEach(room => {
        const roomTravaux = getTravauxForPiece(room.id);
        
        if (roomTravaux.length > 0) {
          // Titre de la pièce
          content.push({
            text: room.name,
            style: 'roomTitle',
            margin: [0, 10, 0, 5]
          });
          
          // Tableau des travaux pour cette pièce
          const tableBody = [
            [
              { text: 'Description', style: 'tableHeader' },
              { text: 'Quantité', style: 'tableHeader', alignment: 'center' },
              { text: 'Prix HT', style: 'tableHeader', alignment: 'right' },
              { text: 'TVA', style: 'tableHeader', alignment: 'center' },
              { text: 'Total TTC', style: 'tableHeader', alignment: 'right' }
            ]
          ];
          
          let roomTotal = 0;
          
          roomTravaux.forEach(travail => {
            const prixUnitaireHT = travail.prixFournitures + travail.prixMainOeuvre;
            const totalHT = prixUnitaireHT * travail.quantite;
            const montantTVA = (totalHT * travail.tauxTVA) / 100;
            const totalTravailTTC = totalHT + montantTVA;
            
            roomTotal += totalTravailTTC;
            totalTVA += montantTVA;
            
            tableBody.push([
              { text: travail.description, fontSize: fontSizes.small },
              { text: travail.quantite.toString(), alignment: 'center', fontSize: fontSizes.small },
              { text: (prixUnitaireHT).toFixed(2) + ' €', alignment: 'right', fontSize: fontSizes.small },
              { text: travail.tauxTVA + ' %', alignment: 'center', fontSize: fontSizes.small },
              { text: totalTravailTTC.toFixed(2) + ' €', alignment: 'right', fontSize: fontSizes.small }
            ]);
          });
          
          // Ajouter le tableau à la pièce
          content.push({
            table: {
              headerRows: 1,
              widths: ['*', 'auto', 'auto', 'auto', 'auto'],
              body: tableBody
            },
            layout: 'lightHorizontalLines',
            margin: [0, 0, 0, 10]
          });
          
          // Total de la pièce
          content.push({
            text: 'Total pour la pièce: ' + roomTotal.toFixed(2) + ' €',
            alignment: 'right',
            bold: true,
            margin: [0, 0, 0, 15]
          });
          
          totalTTC += roomTotal;
        }
      });
      
      // Ajout du total général
      content.push({
        text: 'TOTAL GÉNÉRAL',
        style: 'header',
        margin: [0, 20, 0, 10]
      });
      
      const totalHT = totalTTC - totalTVA;
      
      content.push({
        text: [
          { text: 'Total HT: ', bold: true },
          { text: totalHT.toFixed(2) + ' €\n', bold: false },
          { text: 'Total TVA: ', bold: true },
          { text: totalTVA.toFixed(2) + ' €\n', bold: false },
          { text: 'Total TTC: ', bold: true },
          { text: totalTTC.toFixed(2) + ' €', bold: true }
        ],
        margin: [0, 0, 0, 20]
      });
    }
    
    // Signature et salutations
    content.push(...generateSignatureContent());
    content.push(generateSalutationContent());
    
    // Créer le document PDF avec le contenu généré
    const docDefinition = {
      pageMargins: margins,
      defaultStyle: defaultStyle,
      styles: styles,
      content: content,
      footer: function(currentPage, pageCount) {
        return {
          text: `Page ${currentPage} / ${pageCount}`,
          alignment: 'center',
          fontSize: fontSizes.small,
          margin: [0, 10, 0, 0]
        };
      }
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
