
import { CompanyData, ProjectMetadata } from '@/types';
import { Content } from 'pdfmake/interfaces';
import { getPdfSettings } from '../config/pdfSettingsManager';

export const generateCoverContent = (
  fields: any[],
  company: CompanyData | null,
  metadata?: ProjectMetadata
): Content[] => {
  const settings = getPdfSettings();
  
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
              width: settings?.logoSettings?.width || 172,
              height: settings?.logoSettings?.height || 72,
              margin: [0, 0, 0, 0]
            } : { text: '', margin: [0, 40, 0, 0] }
          ]
        },
        {
          width: '40%',
          stack: [
            { text: 'Assurance MAAF PRO', fontSize: settings?.fontSize?.assurance || 10 },
            { text: 'Responsabilité civile', fontSize: settings?.fontSize?.assurance || 10 },
            { text: 'Responsabilité civile décennale', fontSize: settings?.fontSize?.assurance || 10 }
          ],
          alignment: 'right'
        }
      ]
    },
    // ... Le reste du contenu avec les paramètres appropriés
  ];

  return content;
};
