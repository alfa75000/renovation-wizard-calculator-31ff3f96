
import { CompanyData, ProjectMetadata } from '@/types';
import { Content } from 'pdfmake/interfaces';
import { getPdfSettings } from '../config/pdfSettingsManager';
import { 
  ELEMENT_IDS, 
  convertToPdfStyle, 
  getLogoSettings, 
  getPdfColors 
} from '../utils/styleUtils';

/**
 * Génère le contenu pour la page de couverture
 * @param fields - Champs à afficher sur la page de couverture
 * @param company - Données de l'entreprise
 * @param metadata - Métadonnées du projet
 * @returns Content[] - Contenu formaté pour la page de couverture
 */
export const generateCoverContent = (
  fields: any[],
  company: CompanyData | null,
  metadata?: ProjectMetadata
): Content[] => {
  const settings = getPdfSettings();
  const colors = getPdfColors(settings);
  const logoSettings = getLogoSettings(settings);
  
  // Extraction des données depuis fields
  const devisNumber = fields.find(f => f.id === "devisNumber")?.content;
  const devisDate = fields.find(f => f.id === "devisDate")?.content;
  const client = fields.find(f => f.id === "client")?.content;
  const projectDescription = fields.find(f => f.id === "projectDescription")?.content;
  const projectAddress = fields.find(f => f.id === "projectAddress")?.content;
  const occupant = fields.find(f => f.id === "occupant")?.content;
  const additionalInfo = fields.find(f => f.id === "additionalInfo")?.content;

  // Définition du slogan
  const slogan = company?.slogan || 'Entreprise Générale du Bâtiment';
  
  // Construction du contenu avec les paramètres du settings si disponible
  const content: Content[] = [
    // Logo et assurance
    {
      columns: [
        {
          width: '60%',
          stack: [
            company?.logo_url ? {
              image: company.logo_url,
              width: logoSettings.width,
              height: logoSettings.height,
              margin: [0, 0, 0, 0]
            } : { text: '', margin: [0, 40, 0, 0] }
          ]
        },
        {
          width: '40%',
          stack: [
            { 
              text: 'Assurance MAAF PRO', 
              ...convertToPdfStyle(ELEMENT_IDS.COVER_COMPANY_NAME, settings) 
            },
            { 
              text: 'Responsabilité civile', 
              ...convertToPdfStyle(ELEMENT_IDS.COVER_COMPANY_NAME, settings) 
            },
            { 
              text: 'Responsabilité civile décennale', 
              ...convertToPdfStyle(ELEMENT_IDS.COVER_COMPANY_NAME, settings) 
            }
          ],
          alignment: 'right'
        }
      ]
    }
    // ... Reste du contenu
  ];

  return content;
};
