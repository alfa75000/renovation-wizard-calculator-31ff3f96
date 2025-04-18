
import { Travail, ProjectMetadata } from '@/types';
import { 
  DARK_BLUE, 
  formatPrice, 
  formatQuantity,
  TABLE_COLUMN_WIDTHS
} from '../pdfConstants';

/**
 * Génère le contenu complet de la page de garde pour les documents PDF
 */
export const prepareCoverContent = (fields: any[], company: any, metadata?: ProjectMetadata, pdfSettings?: any) => {
  console.log('Préparation du contenu de la page de garde avec paramètres:', pdfSettings);
  
  // Extraction des données depuis fields
  const devisNumber = fields.find(f => f.id === "devisNumber")?.content;
  const devisDate = fields.find(f => f.id === "devisDate")?.content;
  const validityOffer = fields.find(f => f.id === "validityOffer")?.content;
  const client = fields.find(f => f.id === "client")?.content;
  const projectDescription = fields.find(f => f.id === "projectDescription")?.content;
  const projectAddress = fields.find(f => f.id === "projectAddress")?.content;
  const occupant = fields.find(f => f.id === "occupant")?.content;
  const additionalInfo = fields.find(f => f.id === "additionalInfo")?.content;
  
  // Fonction pour formater la date
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      return `${day} / ${month} / ${year}`;
    } catch (e) {
      return dateString;
    }
  };
  
  // Création du contenu avec styles personnalisés
  const content: any[] = [];
  
  // 1. Logo et assurance sur la même ligne
  content.push({
    columns: [
      // Logo à gauche
      {
        width: '60%',
        stack: [
          company?.logo_url ? {
            image: company.logo_url,
            width: 172,
            height: 72,
            margin: [0, 0, 0, 0]
          } : { text: '', margin: [0, 40, 0, 0] }
        ]
      },
      // Assurance à droite
      {
        width: '40%',
        stack: [
          {
            text: 'Assurance MAAF PRO',
            fontSize: pdfSettings?.elements?.company_insurance?.fontSize || 10,
            color: pdfSettings?.elements?.company_insurance?.color || DARK_BLUE
          },
          {
            text: 'Responsabilité civile',
            fontSize: pdfSettings?.elements?.company_insurance?.fontSize || 10,
            color: pdfSettings?.elements?.company_insurance?.color || DARK_BLUE
          },
          {
            text: 'Responsabilité civile décennale',
            fontSize: pdfSettings?.elements?.company_insurance?.fontSize || 10,
            color: pdfSettings?.elements?.company_insurance?.color || DARK_BLUE
          }
        ],
        alignment: 'right'
      }
    ]
  });
  
  // 2. Slogan
  const sloganElement = {
    text: company?.slogan || 'Entreprise Générale du Bâtiment',
    fontFamily: pdfSettings?.elements?.company_slogan?.fontFamily || 'Roboto',
    fontSize: pdfSettings?.elements?.company_slogan?.fontSize || 12,
    bold: pdfSettings?.elements?.company_slogan?.isBold !== undefined ? 
          pdfSettings.elements.company_slogan.isBold : true,
    italic: pdfSettings?.elements?.company_slogan?.isItalic || false,
    color: pdfSettings?.elements?.company_slogan?.color || DARK_BLUE,
    alignment: pdfSettings?.elements?.company_slogan?.alignment || 'left',
    margin: [
      pdfSettings?.elements?.company_slogan?.spacing?.left || 0,
      pdfSettings?.elements?.company_slogan?.spacing?.top || 10,
      pdfSettings?.elements?.company_slogan?.spacing?.right || 0,
      pdfSettings?.elements?.company_slogan?.spacing?.bottom || 20
    ]
  };
  
  // Ajouter les bordures si définies
  if (pdfSettings?.elements?.company_slogan?.border) {
    const border = pdfSettings.elements.company_slogan.border;
    if (border.top || border.right || border.bottom || border.left) {
      content.push({
        table: {
          widths: ['*'],
          body: [[sloganElement]]
        },
        layout: {
          hLineWidth: function(i: number) {
            if (i === 0) return border.top ? border.width || 1 : 0;
            if (i === 1) return border.bottom ? border.width || 1 : 0;
            return 0;
          },
          vLineWidth: function(i: number) {
            if (i === 0) return border.left ? border.width || 1 : 0;
            if (i === 1) return border.right ? border.width || 1 : 0;
            return 0;
          },
          hLineColor: () => border.color || DARK_BLUE,
          vLineColor: () => border.color || DARK_BLUE
        }
      });
    } else {
      content.push(sloganElement);
    }
  } else {
    content.push(sloganElement);
  }
  
  // 3. Coordonnées société avec styles personnalisés
  const companyInfoElement = {
    text: `Société ${company?.name || ''} - ${company?.address || ''} - ${company?.postal_code || ''} ${company?.city || ''}`,
    fontFamily: pdfSettings?.elements?.company_info?.fontFamily || 'Roboto',
    fontSize: pdfSettings?.elements?.company_info?.fontSize || 11,
    bold: pdfSettings?.elements?.company_info?.isBold !== undefined ?
          pdfSettings.elements.company_info.isBold : true,
    italic: pdfSettings?.elements?.company_info?.isItalic || false,
    color: pdfSettings?.elements?.company_info?.color || DARK_BLUE,
    alignment: pdfSettings?.elements?.company_info?.alignment || 'left',
    margin: [
      pdfSettings?.elements?.company_info?.spacing?.left || 0,
      pdfSettings?.elements?.company_info?.spacing?.top || 0,
      pdfSettings?.elements?.company_info?.spacing?.right || 0,
      pdfSettings?.elements?.company_info?.spacing?.bottom || 3
    ]
  };
  
  // Ajouter les bordures pour company_info si définies
  if (pdfSettings?.elements?.company_info?.border) {
    const border = pdfSettings.elements.company_info.border;
    if (border.top || border.right || border.bottom || border.left) {
      content.push({
        table: {
          widths: ['*'],
          body: [[companyInfoElement]]
        },
        layout: {
          hLineWidth: function(i: number) {
            if (i === 0) return border.top ? border.width || 1 : 0;
            if (i === 1) return border.bottom ? border.width || 1 : 0;
            return 0;
          },
          vLineWidth: function(i: number) {
            if (i === 0) return border.left ? border.width || 1 : 0;
            if (i === 1) return border.right ? border.width || 1 : 0;
            return 0;
          },
          hLineColor: () => border.color || DARK_BLUE,
          vLineColor: () => border.color || DARK_BLUE
        }
      });
    } else {
      content.push(companyInfoElement);
    }
  } else {
    content.push(companyInfoElement);
  }
  
  // Ajout des informations de contact (téléphone et email)
  // Téléphone 1
  if (company?.tel1) {
    const tel1Element = {
      columns: [
        {
          width: 25,
          text: 'Tél:',
          fontSize: pdfSettings?.elements?.company_tel?.fontSize || 10,
          color: pdfSettings?.elements?.company_tel?.color || DARK_BLUE
        },
        {
          width: '*',
          text: company.tel1,
          fontSize: pdfSettings?.elements?.company_tel?.fontSize || 10,
          color: pdfSettings?.elements?.company_tel?.color || DARK_BLUE
        }
      ],
      columnGap: 1,
      margin: [0, 3, 0, 0]
    };
    content.push(tel1Element);
  }
  
  // Téléphone 2 si présent
  if (company?.tel2) {
    const tel2Element = {
      columns: [
        {
          width: 25,
          text: '',
          fontSize: pdfSettings?.elements?.company_tel?.fontSize || 10
        },
        {
          width: '*',
          text: company.tel2,
          fontSize: pdfSettings?.elements?.company_tel?.fontSize || 10,
          color: pdfSettings?.elements?.company_tel?.color || DARK_BLUE
        }
      ],
      columnGap: 1,
      margin: [0, 0, 0, 0]
    };
    content.push(tel2Element);
  }
  
  // Email
  if (company?.email) {
    const emailElement = {
      columns: [
        {
          width: 25,
          text: 'Mail:',
          fontSize: pdfSettings?.elements?.company_email?.fontSize || 10,
          color: pdfSettings?.elements?.company_email?.color || DARK_BLUE
        },
        {
          width: '*',
          text: company.email,
          fontSize: pdfSettings?.elements?.company_email?.fontSize || 10,
          color: pdfSettings?.elements?.company_email?.color || DARK_BLUE
        }
      ],
      columnGap: 1,
      margin: [0, 5, 0, 0]
    };
    content.push(emailElement);
  }
  
  // 4. Numéro de devis, date et validité
  const devisNumberElement = {
    text: `Devis n°: ${devisNumber || ''}`,
    fontFamily: pdfSettings?.elements?.devis_number?.fontFamily || 'Roboto',
    fontSize: pdfSettings?.elements?.devis_number?.fontSize || 10,
    bold: pdfSettings?.elements?.devis_number?.isBold !== undefined ?
          pdfSettings.elements.devis_number.isBold : false,
    italic: pdfSettings?.elements?.devis_number?.isItalic || false,
    color: pdfSettings?.elements?.devis_number?.color || DARK_BLUE,
    alignment: pdfSettings?.elements?.devis_number?.alignment || 'left',
    margin: [25, 0, 0, 0]
  };

  const devisDateElement = {
    text: `Du ${formatDate(devisDate)}`,
    fontFamily: pdfSettings?.elements?.devis_date?.fontFamily || 'Roboto',
    fontSize: pdfSettings?.elements?.devis_date?.fontSize || 10,
    bold: pdfSettings?.elements?.devis_date?.isBold !== undefined ?
          pdfSettings.elements.devis_date.isBold : false,
    italic: pdfSettings?.elements?.devis_date?.isItalic || false,
    color: pdfSettings?.elements?.devis_date?.color || DARK_BLUE,
    alignment: pdfSettings?.elements?.devis_date?.alignment || 'left',
    margin: [5, 0, 0, 0]
  };

  const devisValidityElement = {
    text: `(Validité de l'offre : 3 mois.)`,
    fontFamily: pdfSettings?.elements?.devis_validity?.fontFamily || 'Roboto',
    fontSize: pdfSettings?.elements?.devis_validity?.fontSize || 9,
    bold: pdfSettings?.elements?.devis_validity?.isBold !== undefined ?
          pdfSettings.elements.devis_validity.isBold : false,
    italic: pdfSettings?.elements?.devis_validity?.isItalic !== undefined ?
          pdfSettings.elements.devis_validity.isItalic : true,
    color: pdfSettings?.elements?.devis_validity?.color || DARK_BLUE,
    alignment: pdfSettings?.elements?.devis_validity?.alignment || 'left',
    margin: [5, 0, 0, 0]
  };

  // Regrouper les éléments du devis dans une ligne
  content.push({
    columns: [
      { width: 25, text: '' },
      {
        width: '*',
        columns: [
          devisNumberElement,
          devisDateElement,
          devisValidityElement
        ],
        columnGap: 1
      }
    ],
    margin: [0, 30, 0, 0]
  });

  // 5. Section Client
  // Titre Client
  const clientTitleElement = {
    text: 'Client / Maître d\'ouvrage',
    fontFamily: pdfSettings?.elements?.client_section_title?.fontFamily || 'Roboto',
    fontSize: pdfSettings?.elements?.client_section_title?.fontSize || 10,
    bold: pdfSettings?.elements?.client_section_title?.isBold !== undefined ?
          pdfSettings.elements.client_section_title.isBold : false,
    italic: pdfSettings?.elements?.client_section_title?.isItalic || false,
    color: pdfSettings?.elements?.client_section_title?.color || DARK_BLUE,
    alignment: pdfSettings?.elements?.client_section_title?.alignment || 'left'
  };

  // Contenu Client
  const clientContentElement = {
    text: client || '',
    fontFamily: pdfSettings?.elements?.client_content?.fontFamily || 'Roboto',
    fontSize: pdfSettings?.elements?.client_content?.fontSize || 10,
    bold: pdfSettings?.elements?.client_content?.isBold !== undefined ?
          pdfSettings.elements.client_content.isBold : false,
    italic: pdfSettings?.elements?.client_content?.isItalic || false,
    color: pdfSettings?.elements?.client_content?.color || DARK_BLUE,
    alignment: pdfSettings?.elements?.client_content?.alignment || 'left',
    lineHeight: 1.3
  };

  // Ajouter la section client avec le même système de bordures
  content.push({
    columns: [
      { width: 25, text: '' },
      {
        width: '*',
        stack: [
          // Appliquer les bordures au titre si définies
          pdfSettings?.elements?.client_section_title?.border ? {
            table: {
              widths: ['*'],
              body: [[clientTitleElement]]
            },
            layout: {
              hLineWidth: (i: number) => (i === 0 || i === 1) && 
                pdfSettings?.elements?.client_section_title?.border?.top ? 
                pdfSettings?.elements?.client_section_title?.border?.width || 1 : 0,
              vLineWidth: (i: number) => (i === 0 || i === 1) && 
                pdfSettings?.elements?.client_section_title?.border?.left ? 
                pdfSettings?.elements?.client_section_title?.border?.width || 1 : 0,
              hLineColor: () => pdfSettings?.elements?.client_section_title?.border?.color || DARK_BLUE,
              vLineColor: () => pdfSettings?.elements?.client_section_title?.border?.color || DARK_BLUE
            }
          } : clientTitleElement,
          
          // Appliquer les bordures au contenu si définies
          pdfSettings?.elements?.client_content?.border ? {
            table: {
              widths: ['*'],
              body: [[clientContentElement]]
            },
            layout: {
              hLineWidth: (i: number) => (i === 0 || i === 1) && 
                pdfSettings?.elements?.client_content?.border?.top ? 
                pdfSettings?.elements?.client_content?.border?.width || 1 : 0,
              vLineWidth: (i: number) => (i === 0 || i === 1) && 
                pdfSettings?.elements?.client_content?.border?.left ? 
                pdfSettings?.elements?.client_content?.border?.width || 1 : 0,
              hLineColor: () => pdfSettings?.elements?.client_content?.border?.color || DARK_BLUE,
              vLineColor: () => pdfSettings?.elements?.client_content?.border?.color || DARK_BLUE
            }
          } : clientContentElement
        ]
      }
    ],
    margin: [0, 35, 0, 0]
  });

  // 6. Section Chantier avec styles personnalisés
  // Titre principal Chantier
  const chantierTitleElement = {
    text: 'Chantier / Travaux',
    fontFamily: pdfSettings?.elements?.chantier_section_title?.fontFamily || 'Roboto',
    fontSize: pdfSettings?.elements?.chantier_section_title?.fontSize || 10,
    bold: pdfSettings?.elements?.chantier_section_title?.isBold !== undefined ?
          pdfSettings.elements.chantier_section_title.isBold : false,
    italic: pdfSettings?.elements?.chantier_section_title?.isItalic || false,
    color: pdfSettings?.elements?.chantier_section_title?.color || DARK_BLUE,
    margin: [0, 0, 0, 5]
  };

  content.push(
    pdfSettings?.elements?.chantier_section_title?.border ? {
      table: {
        widths: ['*'],
        body: [[chantierTitleElement]]
      },
      layout: {
        hLineWidth: (i: number) => (i === 0 || i === 1) && 
          pdfSettings?.elements?.chantier_section_title?.border?.top ? 
          pdfSettings?.elements?.chantier_section_title?.border?.width || 1 : 0,
        vLineWidth: (i: number) => (i === 0 || i === 1) && 
          pdfSettings?.elements?.chantier_section_title?.border?.left ? 
          pdfSettings?.elements?.chantier_section_title?.border?.width || 1 : 0,
        hLineColor: () => pdfSettings?.elements?.chantier_section_title?.border?.color || DARK_BLUE,
        vLineColor: () => pdfSettings?.elements?.chantier_section_title?.border?.color || DARK_BLUE
      }
    } : chantierTitleElement
  );

  // Occupant
  if (occupant) {
    const occupantElement = {
      text: occupant,
      fontFamily: pdfSettings?.elements?.chantier_occupant?.fontFamily || 'Roboto',
      fontSize: pdfSettings?.elements?.chantier_occupant?.fontSize || 10,
      bold: pdfSettings?.elements?.chantier_occupant?.isBold !== undefined ?
            pdfSettings.elements.chantier_occupant.isBold : false,
      italic: pdfSettings?.elements?.chantier_occupant?.isItalic || false,
      color: pdfSettings?.elements?.chantier_occupant?.color || DARK_BLUE,
      margin: [0, 5, 0, 0]
    };

    content.push(
      pdfSettings?.elements?.chantier_occupant?.border ? {
        table: {
          widths: ['*'],
          body: [[occupantElement]]
        },
        layout: {
          hLineWidth: (i: number) => (i === 0 || i === 1) && 
            pdfSettings?.elements?.chantier_occupant?.border?.top ? 
            pdfSettings?.elements?.chantier_occupant?.border?.width || 1 : 0,
          vLineWidth: (i: number) => (i === 0 || i === 1) && 
            pdfSettings?.elements?.chantier_occupant?.border?.left ? 
            pdfSettings?.elements?.chantier_occupant?.border?.width || 1 : 0,
          hLineColor: () => pdfSettings?.elements?.chantier_occupant?.border?.color || DARK_BLUE,
          vLineColor: () => pdfSettings?.elements?.chantier_occupant?.border?.color || DARK_BLUE
        }
      } : occupantElement
    );
  }

  // Adresse du chantier
  if (projectAddress) {
    // Titre de l'adresse
    const addressTitleElement = {
      text: 'Adresse du chantier / lieu d\'intervention:',
      fontFamily: pdfSettings?.elements?.chantier_address_title?.fontFamily || 'Roboto',
      fontSize: pdfSettings?.elements?.chantier_address_title?.fontSize || 10,
      bold: pdfSettings?.elements?.chantier_address_title?.isBold !== undefined ?
            pdfSettings.elements.chantier_address_title.isBold : false,
      italic: pdfSettings?.elements?.chantier_address_title?.isItalic || false,
      color: pdfSettings?.elements?.chantier_address_title?.color || DARK_BLUE,
      margin: [0, 5, 0, 0]
    };

    // Contenu de l'adresse
    const addressContentElement = {
      text: projectAddress,
      fontFamily: pdfSettings?.elements?.chantier_address_content?.fontFamily || 'Roboto',
      fontSize: pdfSettings?.elements?.chantier_address_content?.fontSize || 10,
      bold: pdfSettings?.elements?.chantier_address_content?.isBold !== undefined ?
            pdfSettings.elements.chantier_address_content.isBold : false,
      italic: pdfSettings?.elements?.chantier_address_content?.isItalic || false,
      color: pdfSettings?.elements?.chantier_address_content?.color || DARK_BLUE,
      margin: [10, 3, 0, 0]
    };

    content.push(
      pdfSettings?.elements?.chantier_address_title?.border ? {
        table: {
          widths: ['*'],
          body: [[addressTitleElement]]
        },
        layout: {
          hLineWidth: (i: number) => (i === 0 || i === 1) && 
            pdfSettings?.elements?.chantier_address_title?.border?.top ? 
            pdfSettings?.elements?.chantier_address_title?.border?.width || 1 : 0,
          vLineWidth: (i: number) => (i === 0 || i === 1) && 
            pdfSettings?.elements?.chantier_address_title?.border?.left ? 
            pdfSettings?.elements?.chantier_address_title?.border?.width || 1 : 0,
          hLineColor: () => pdfSettings?.elements?.chantier_address_title?.border?.color || DARK_BLUE,
          vLineColor: () => pdfSettings?.elements?.chantier_address_title?.border?.color || DARK_BLUE
        }
      } : addressTitleElement
    );

    content.push(
      pdfSettings?.elements?.chantier_address_content?.border ? {
        table: {
          widths: ['*'],
          body: [[addressContentElement]]
        },
        layout: {
          hLineWidth: (i: number) => (i === 0 || i === 1) && 
            pdfSettings?.elements?.chantier_address_content?.border?.top ? 
            pdfSettings?.elements?.chantier_address_content?.border?.width || 1 : 0,
          vLineWidth: (i: number) => (i === 0 || i === 1) && 
            pdfSettings?.elements?.chantier_address_content?.border?.left ? 
            pdfSettings?.elements?.chantier_address_content?.border?.width || 1 : 0,
          hLineColor: () => pdfSettings?.elements?.chantier_address_content?.border?.color || DARK_BLUE,
          vLineColor: () => pdfSettings?.elements?.chantier_address_content?.border?.color || DARK_BLUE
        }
      } : addressContentElement
    );
  }

  // Description
  if (projectDescription) {
    const descriptionTitleElement = {
      text: 'Descriptif:',
      fontFamily: pdfSettings?.elements?.chantier_description_title?.fontFamily || 'Roboto',
      fontSize: pdfSettings?.elements?.chantier_description_title?.fontSize || 10,
      bold: pdfSettings?.elements?.chantier_description_title?.isBold !== undefined ?
            pdfSettings.elements.chantier_description_title.isBold : false,
      italic: pdfSettings?.elements?.chantier_description_title?.isItalic || false,
      color: pdfSettings?.elements?.chantier_description_title?.color || DARK_BLUE,
      margin: [0, 8, 0, 0]
    };

    const descriptionContentElement = {
      text: projectDescription,
      fontFamily: pdfSettings?.elements?.chantier_description_content?.fontFamily || 'Roboto',
      fontSize: pdfSettings?.elements?.chantier_description_content?.fontSize || 10,
      bold: pdfSettings?.elements?.chantier_description_content?.isBold !== undefined ?
            pdfSettings.elements.chantier_description_content.isBold : false,
      italic: pdfSettings?.elements?.chantier_description_content?.isItalic || false,
      color: pdfSettings?.elements?.chantier_description_content?.color || DARK_BLUE,
      margin: [10, 3, 0, 0]
    };

    content.push(
      pdfSettings?.elements?.chantier_description_title?.border ? {
        table: {
          widths: ['*'],
          body: [[descriptionTitleElement]]
        },
        layout: {
          hLineWidth: (i: number) => (i === 0 || i === 1) && 
            pdfSettings?.elements?.chantier_description_title?.border?.top ? 
            pdfSettings?.elements?.chantier_description_title?.border?.width || 1 : 0,
          vLineWidth: (i: number) => (i === 0 || i === 1) && 
            pdfSettings?.elements?.chantier_description_title?.border?.left ? 
            pdfSettings?.elements?.chantier_description_title?.border?.width || 1 : 0,
          hLineColor: () => pdfSettings?.elements?.chantier_description_title?.border?.color || DARK_BLUE,
          vLineColor: () => pdfSettings?.elements?.chantier_description_title?.border?.color || DARK_BLUE
        }
      } : descriptionTitleElement
    );

    content.push(
      pdfSettings?.elements?.chantier_description_content?.border ? {
        table: {
          widths: ['*'],
          body: [[descriptionContentElement]]
        },
        layout: {
          hLineWidth: (i: number) => (i === 0 || i === 1) && 
            pdfSettings?.elements?.chantier_description_content?.border?.top ? 
            pdfSettings?.elements?.chantier_description_content?.border?.width || 1 : 0,
          vLineWidth: (i: number) => (i === 0 || i === 1) && 
            pdfSettings?.elements?.chantier_description_content?.border?.left ? 
            pdfSettings?.elements?.chantier_description_content?.border?.width || 1 : 0,
          hLineColor: () => pdfSettings?.elements?.chantier_description_content?.border?.color || DARK_BLUE,
          vLineColor: () => pdfSettings?.elements?.chantier_description_content?.border?.color || DARK_BLUE
        }
      } : descriptionContentElement
    );
  }

  // Informations additionnelles
  if (additionalInfo) {
    const additionalInfoElement = {
      text: additionalInfo,
      fontFamily: pdfSettings?.elements?.chantier_info?.fontFamily || 'Roboto',
      fontSize: pdfSettings?.elements?.chantier_info?.fontSize || 10,
      bold: pdfSettings?.elements?.chantier_info?.isBold !== undefined ?
            pdfSettings.elements.chantier_info.isBold : false,
      italic: pdfSettings?.elements?.chantier_info?.isItalic || false,
      color: pdfSettings?.elements?.chantier_info?.color || DARK_BLUE,
      margin: [10, 15, 0, 0]
    };

    content.push(
      pdfSettings?.elements?.chantier_info?.border ? {
        table: {
          widths: ['*'],
          body: [[additionalInfoElement]]
        },
        layout: {
          hLineWidth: (i: number) => (i === 0 || i === 1) && 
            pdfSettings?.elements?.chantier_info?.border?.top ? 
            pdfSettings?.elements?.chantier_info?.border?.width || 1 : 0,
          vLineWidth: (i: number) => (i === 0 || i === 1) && 
            pdfSettings?.elements?.chantier_info?.border?.left ? 
            pdfSettings?.elements?.chantier_info?.border?.width || 1 : 0,
          hLineColor: () => pdfSettings?.elements?.chantier_info?.border?.color || DARK_BLUE,
          vLineColor: () => pdfSettings?.elements?.chantier_info?.border?.color || DARK_BLUE
        }
      } : additionalInfoElement
    );
  }

  // 7. Pied de page avec styles personnalisés
  const footerElement = {
    text: `${company?.name || ''} - SASU au Capital de ${company?.capital_social || '10000'} € - ${company?.address || ''} ${company?.postal_code || ''} ${company?.city || ''} - Siret : ${company?.siret || ''} - Code APE : ${company?.code_ape || ''} - N° TVA Intracommunautaire : ${company?.tva_intracom || ''}`,
    fontFamily: pdfSettings?.elements?.footer_content?.fontFamily || 'Roboto',
    fontSize: pdfSettings?.elements?.footer_content?.fontSize || 7,
    bold: pdfSettings?.elements?.footer_content?.isBold !== undefined ?
          pdfSettings.elements.footer_content.isBold : false,
    italic: pdfSettings?.elements?.footer_content?.isItalic || false,
    color: pdfSettings?.elements?.footer_content?.color || DARK_BLUE,
    alignment: 'center',
    margin: [0, 50, 0, 0],
    absolutePosition: { x: 20, y: 800 }
  };

  content.push(
    pdfSettings?.elements?.footer_content?.border ? {
      table: {
        widths: ['*'],
        body: [[footerElement]]
      },
      layout: {
        hLineWidth: (i: number) => (i === 0 || i === 1) && 
          pdfSettings?.elements?.footer_content?.border?.top ? 
          pdfSettings?.elements?.footer_content?.border?.width || 1 : 0,
        vLineWidth: (i: number) => (i === 0 || i === 1) && 
          pdfSettings?.elements?.footer_content?.border?.left ? 
          pdfSettings?.elements?.footer_content?.border?.width || 1 : 0,
        hLineColor: () => pdfSettings?.elements?.footer_content?.border?.color || DARK_BLUE,
        vLineColor: () => pdfSettings?.elements?.footer_content?.border?.color || DARK_BLUE
      },
      absolutePosition: { x: 20, y: 800 }
    } : footerElement
  );

  return content.filter(Boolean);
};
