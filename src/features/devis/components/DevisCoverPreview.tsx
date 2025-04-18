
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { PrinterIcon } from 'lucide-react';
import { useProject } from '@/contexts/ProjectContext';
import pdfMake from '@/services/pdf/pdfInit';
import { CompanyData } from '@/types';

interface DevisCoverPreviewProps {
  fields: any[];
  company: CompanyData | null;
}

const DevisCoverPreview: React.FC<DevisCoverPreviewProps> = ({ fields, company }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const { state } = useProject();
  
  const handlePrintCover = async () => {
    setIsGenerating(true);
    try {
      // Extraction des données depuis fields
      const devisNumber = fields.find(f => f.id === "devisNumber")?.content || '';
      const devisDate = fields.find(f => f.id === "devisDate")?.content || '';
      const client = fields.find(f => f.id === "client")?.content || '';
      const projectDescription = fields.find(f => f.id === "projectDescription")?.content || '';
      const projectAddress = fields.find(f => f.id === "projectAddress")?.content || '';
      const occupant = fields.find(f => f.id === "occupant")?.content || '';
      const additionalInfo = fields.find(f => f.id === "additionalInfo")?.content || '';
      
      // Définition du slogan
      const slogan = company?.slogan || 'Entreprise Générale du Bâtiment';
      
      // Fonction pour formater la date
      const formatDate = (dateString: string) => {
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
      
      // Définition des colonnes
      const col1Width = 25; // Largeur fixe pour la première colonne
      const col2Width = '*'; // Largeur automatique pour la deuxième colonne
      
      // Définition du document PDF
      const docDefinition = {
        pageSize: 'A4',
        pageMargins: [40, 40, 40, 40],
        content: [
          // Logo et assurance sur la même ligne
          {
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
                  { text: 'Assurance MAAF PRO', fontSize: 10, color: '#333333' },
                  { text: 'Responsabilité civile', fontSize: 10, color: '#333333' },
                  { text: 'Responsabilité civile décennale', fontSize: 10, color: '#333333' }
                ],
                alignment: 'right'
              }
            ]
          },
          
          // Slogan
          {
            text: slogan,
            fontSize: 12,
            bold: true,
            color: '#333333',
            margin: [0, 10, 0, 20]
          },
          
          // Coordonnées société - Nom et adresse combinés
          {
            text: `Société  ${company?.name || ''} - ${company?.address || ''} - ${company?.postal_code || ''} ${company?.city || ''}`,
            fontSize: 11,
            bold: true,
            color: '#333333',
            margin: [0, 0, 0, 3]
          },
          
          // Tél et Mail
          {
            columns: [
              {
                width: col1Width,
                text: 'Tél:',
                fontSize: 10,
                color: '#333333'
              },
              {
                width: col2Width,
                text: company?.tel1 || '',
                fontSize: 10,
                color: '#333333'
              }
            ],
            columnGap: 1,
            margin: [0, 3, 0, 0]
          },
          
          company?.tel2 ? {
            columns: [
              {
                width: col1Width,
                text: '',
                fontSize: 10
              },
              {
                width: col2Width,
                text: company.tel2,
                fontSize: 10,
                color: '#333333'
              }
            ],
            columnGap: 1,
            margin: [0, 0, 0, 0]
          } : null,
          
          {
            columns: [
              {
                width: col1Width,
                text: 'Mail:',
                fontSize: 10,
                color: '#333333'
              },
              {
                width: col2Width,
                text: company?.email || '',
                fontSize: 10,
                color: '#333333'
              }
            ],
            columnGap: 1,
            margin: [0, 5, 0, 0]
          },
          
          // Espace avant devis
          { text: '', margin: [0, 30, 0, 0] },
          
          // Numéro et date du devis
          {
            columns: [
              {
                width: col1Width,
                text: '',
                fontSize: 10
              },
              {
                width: col2Width,
                text: [
                  { text: `Devis n°: ${devisNumber || ''} Du ${formatDate(devisDate)} `, fontSize: 10, color: '#333333' },
                  { text: ` (Validité de l'offre : 3 mois.)`, fontSize: 9, italics: true, color: '#333333' }
                ]
              }
            ],
            columnGap: 1,
            margin: [0, 0, 0, 0]
          },
          
          // Espace avant Client
          { text: '', margin: [0, 35, 0, 0] },
          
          // Client - Titre
          {
            columns: [
              { width: col1Width, text: '', fontSize: 10 },
              { 
                width: col2Width, 
                text: 'Client / Maître d\'ouvrage',
                fontSize: 10,
                color: '#333333'
              }
            ],
            columnGap: 1
          },
          
          // Client - Contenu
          {
            columns: [
              { width: col1Width, text: '', fontSize: 10 },
              { 
                width: col2Width, 
                text: client || '',
                fontSize: 10,
                color: '#333333',
                lineHeight: 1.3
              }
            ],
            columnGap: 15,
            margin: [0, 5, 0, 0]
          },
          
          // Chantier - Titre
          {
            text: 'Chantier / Travaux',
            fontSize: 10,
            color: '#333333',
            margin: [0, 30, 0, 5]
          }
        ].filter(Boolean)
      };
      
      // Générer et télécharger le PDF
      pdfMake.createPdf(docDefinition as any).download(`devis-couverture-${devisNumber || 'XXXX-XX'}.pdf`);
      
    } catch (error) {
      console.error('Erreur lors de la génération du PDF de couverture:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="border rounded-lg p-4 bg-white shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Aperçu de la page de couverture</h3>
        <Button 
          onClick={handlePrintCover}
          disabled={isGenerating}
          className="flex items-center gap-2"
        >
          <PrinterIcon className="h-4 w-4" />
          {isGenerating ? "Génération..." : "Imprimer la couverture"}
        </Button>
      </div>

      <div className="border rounded p-4 min-h-[400px] bg-gray-50">
        {/* En-tête de la société */}
        <div className="flex justify-between items-start mb-6">
          <div className="w-2/3">
            {company?.logo_url ? (
              <img 
                src={company.logo_url} 
                alt="Logo de l'entreprise" 
                className="max-h-14"
              />
            ) : (
              <div className="bg-gray-200 w-36 h-12 flex items-center justify-center text-gray-500">Logo</div>
            )}
          </div>
          <div className="text-right text-sm">
            <div>Assurance MAAF PRO</div>
            <div>Responsabilité civile</div>
            <div>Responsabilité civile décennale</div>
          </div>
        </div>
        
        {/* Slogan de l'entreprise */}
        <div className="text-lg font-medium mb-4">
          {company?.slogan || 'Entreprise Générale du Bâtiment'}
        </div>
        
        {/* Coordonnées de l'entreprise */}
        <div className="text-sm font-medium mb-1">
          Société {company?.name} - {company?.address} - {company?.postal_code} {company?.city}
        </div>
        
        <div className="grid grid-cols-6 text-sm mb-4">
          <div className="col-span-1">Tél:</div>
          <div className="col-span-5">{company?.tel1}</div>
          {company?.tel2 && (
            <>
              <div className="col-span-1"></div>
              <div className="col-span-5">{company?.tel2}</div>
            </>
          )}
          <div className="col-span-1">Mail:</div>
          <div className="col-span-5">{company?.email}</div>
        </div>
        
        {/* Numéro et date du devis */}
        <div className="mt-8 text-sm">
          <div className="grid grid-cols-6">
            <div className="col-span-1"></div>
            <div className="col-span-5">
              Devis n°: {fields.find(f => f.id === "devisNumber")?.content} 
              Du {fields.find(f => f.id === "devisDate")?.content}
              <span className="italic"> (Validité de l'offre : 3 mois.)</span>
            </div>
          </div>
        </div>
        
        {/* Client */}
        <div className="mt-8 text-sm">
          <div className="grid grid-cols-6">
            <div className="col-span-1"></div>
            <div className="col-span-5">
              <div className="mb-1">Client / Maître d'ouvrage</div>
              <div className="whitespace-pre-line">{fields.find(f => f.id === "client")?.content}</div>
            </div>
          </div>
        </div>
        
        {/* Chantier */}
        <div className="mt-8 text-sm">
          <div>Chantier / Travaux</div>
          <div className="mt-1">{fields.find(f => f.id === "occupant")?.content}</div>
          <div className="mt-2">Adresse du chantier / lieu d'intervention:</div>
          <div className="ml-4">{fields.find(f => f.id === "projectAddress")?.content}</div>
          <div className="mt-2">Descriptif:</div>
          <div className="ml-4">{fields.find(f => f.id === "projectDescription")?.content}</div>
          <div className="mt-4">{fields.find(f => f.id === "additionalInfo")?.content}</div>
        </div>
      </div>
    </div>
  );
};

export default DevisCoverPreview;
