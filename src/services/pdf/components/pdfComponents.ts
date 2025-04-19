
import { PDF_TEXTS, DARK_BLUE } from '../constants/pdfConstants';
import { PdfSettings } from '../config/pdfSettingsTypes';
import { applyElementStyles, formatPrice, wrapWithBorders } from '../utils/pdfUtils';

/**
 * Génère le contenu de signature pour le devis
 */
export const generateSignatureContent = (pdfSettings?: PdfSettings) => {
  const signatureContent = [];

  // Texte principal de signature avec styles personnalisables
  const signatureText = applyElementStyles(
    { text: PDF_TEXTS.SIGNATURE.CONTENT },
    'signature_text',
    pdfSettings,
    {
      fontSize: 9,
      color: DARK_BLUE,
      alignment: 'left',
      spacing: { top: 0, right: 0, bottom: 5, left: 0 }
    }
  );
  
  signatureContent.push(signatureText);

  // Points de signature avec styles personnalisables
  PDF_TEXTS.SIGNATURE.POINTS.forEach(point => {
    const pointElement = applyElementStyles(
      { text: point.text },
      'approval_text',
      pdfSettings,
      {
        fontSize: 9,
        isBold: point.bold,
        color: DARK_BLUE,
        alignment: 'left',
        spacing: { top: 2, right: 0, bottom: 2, left: 10 }
      }
    );
    
    signatureContent.push(pointElement);
  });

  return signatureContent;
};

/**
 * Génère le texte de salutation
 */
export const generateSalutationContent = (pdfSettings?: PdfSettings) => {
  // Texte de salutation avec styles personnalisables
  const salutationElement = applyElementStyles(
    { text: PDF_TEXTS.SALUTATION },
    'salutation_text',
    pdfSettings,
    {
      fontSize: 9,
      color: DARK_BLUE,
      alignment: 'justify',
      spacing: { top: 20, right: 0, bottom: 20, left: 0 }
    }
  );
  
  return salutationElement;
};

/**
 * Génère le tableau standard des totaux (HT et TVA)
 */
export const generateStandardTotalsTable = (totalHT: number, totalTVA: number, pdfSettings?: PdfSettings) => {
  // Formatage des valeurs
  const totalHTFormatted = formatPrice(totalHT);
  const totalTVAFormatted = formatPrice(totalTVA);
  
  // Créer le tableau avec styles personnalisables
  const tableBody = [
    [
      applyElementStyles(
        { text: 'Total HT :', alignment: 'left' },
        'ht_vat_totals',
        pdfSettings,
        { fontSize: 9, alignment: 'left' }
      ),
      applyElementStyles(
        { text: totalHTFormatted, alignment: 'right' },
        'ht_vat_totals',
        pdfSettings,
        { fontSize: 9, alignment: 'right' }
      )
    ],
    [
      applyElementStyles(
        { text: 'TVA :', alignment: 'left' },
        'ht_vat_totals',
        pdfSettings,
        { fontSize: 9, alignment: 'left' }
      ),
      applyElementStyles(
        { text: totalTVAFormatted, alignment: 'right' },
        'ht_vat_totals',
        pdfSettings,
        { fontSize: 9, alignment: 'right' }
      )
    ]
  ];
  
  // Style global du tableau des totaux
  const totalsTableElement = applyElementStyles(
    {
      table: {
        widths: ['50%', '50%'],
        body: tableBody
      },
      layout: {
        hLineWidth: function() { return 0; },
        vLineWidth: function() { return 0; },
        paddingLeft: function() { return 0; },
        paddingRight: function() { return 0; },
        paddingTop: function() { return 3; },
        paddingBottom: function() { return 3; }
      },
      margin: [0, 0, 0, 5]
    },
    'totals_table',
    pdfSettings,
    {}
  );
  
  return totalsTableElement;
};

/**
 * Génère le tableau du Total TTC
 */
export const generateTTCTable = (totalTTC: number, pdfSettings?: PdfSettings) => {
  // Formatage de la valeur
  const totalTTCFormatted = formatPrice(totalTTC);
  
  // Cellules du tableau avec styles personnalisables
  const ttcLabelCell = applyElementStyles(
    { text: 'TOTAL TTC :', alignment: 'left' },
    'ttc_total',
    pdfSettings,
    { 
      fontSize: 10, 
      isBold: true,
      color: DARK_BLUE,
      alignment: 'left'
    }
  );
  
  const ttcValueCell = applyElementStyles(
    { text: totalTTCFormatted, alignment: 'right' },
    'ttc_total',
    pdfSettings,
    { 
      fontSize: 10, 
      isBold: true,
      color: DARK_BLUE,
      alignment: 'right'
    }
  );
  
  // Style global du tableau TTC
  const ttcTableElement = {
    table: {
      widths: ['50%', '50%'],
      body: [
        [ttcLabelCell, ttcValueCell]
      ]
    },
    layout: {
      hLineWidth: function(i: number) { return i === 0 || i === 1 ? 1 : 0; },
      vLineWidth: function(i: number) { return i === 0 || i === 1 ? 1 : 0; },
      hLineColor: function() { return '#e5e7eb'; },
      vLineColor: function() { return '#e5e7eb'; },
      paddingLeft: function() { return 5; },
      paddingRight: function() { return 5; },
      paddingTop: function() { return 5; },
      paddingBottom: function() { return 5; }
    }
  };
  
  return ttcTableElement;
};

/**
 * Génère le contenu des conditions générales de vente
 */
export const generateCGVContent = (pdfSettings?: PdfSettings) => {
  const cgvContent = [];
  
  // Titre des CGV avec styles personnalisables et saut de page
  const titleElement = applyElementStyles(
    { 
      text: PDF_TEXTS.CGV.TITLE,
      pageBreak: 'before' // Ajout d'un saut de page avant les CGV
    },
    'cgv_title',
    pdfSettings,
    {
      fontSize: 11,
      isBold: true,
      color: DARK_BLUE,
      alignment: 'center',
      spacing: { top: 20, right: 0, bottom: 10, left: 0 }
    }
  );
  
  cgvContent.push(titleElement);
  
  // Sections des CGV
  PDF_TEXTS.CGV.SECTIONS.forEach(section => {
    // Titre de section avec styles personnalisables
    const sectionTitleElement = applyElementStyles(
      { text: section.title },
      'cgv_section_titles',
      pdfSettings,
      {
        fontSize: 10,
        isBold: true,
        color: DARK_BLUE,
        alignment: 'left',
        spacing: { top: 8, right: 0, bottom: 4, left: 0 }
      }
    );
    
    cgvContent.push(sectionTitleElement);
    
    // Contenu de section avec styles personnalisables
    const sectionContentElement = applyElementStyles(
      { text: section.content },
      'cgv_content',
      pdfSettings,
      {
        fontSize: 9,
        color: '#333333',
        alignment: 'justify',
        spacing: { top: 0, right: 0, bottom: 4, left: 0 }
      }
    );
    
    cgvContent.push(sectionContentElement);
    
    // Sous-sections si elles existent
    if (section.subsections) {
      section.subsections.forEach(subsection => {
        // Titre de sous-section avec styles personnalisables
        const subsectionTitleElement = applyElementStyles(
          { text: subsection.title },
          'cgv_section_titles',
          pdfSettings,
          {
            fontSize: 9,
            isBold: true,
            color: DARK_BLUE,
            alignment: 'left',
            spacing: { top: 6, right: 0, bottom: 3, left: 10 }
          }
        );
        
        cgvContent.push(subsectionTitleElement);
        
        // Contenu de sous-section avec styles personnalisables
        const subsectionContentElement = applyElementStyles(
          { text: subsection.content },
          'cgv_content',
          pdfSettings,
          {
            fontSize: 9,
            color: '#333333',
            alignment: 'justify',
            spacing: { top: 0, right: 0, bottom: 3, left: 10 }
          }
        );
        
        cgvContent.push(subsectionContentElement);
        
        // Puces si elles existent
        if (subsection.bullets) {
          subsection.bullets.forEach(bullet => {
            const bulletElement = applyElementStyles(
              { text: bullet },
              'cgv_content',
              pdfSettings,
              {
                fontSize: 9,
                color: '#333333',
                alignment: 'justify',
                spacing: { top: 0, right: 0, bottom: 2, left: 20 }
              }
            );
            
            cgvContent.push(bulletElement);
          });
        }
        
        // Contenu après les puces si présent
        if (subsection.content_after) {
          const afterBulletsElement = applyElementStyles(
            { text: subsection.content_after },
            'cgv_content',
            pdfSettings,
            {
              fontSize: 9,
              color: '#333333',
              alignment: 'justify',
              spacing: { top: 3, right: 0, bottom: 4, left: 10 }
            }
          );
          
          cgvContent.push(afterBulletsElement);
        }
      });
    }
  });
  
  return cgvContent;
};
