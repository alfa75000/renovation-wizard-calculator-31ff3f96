import React, { useRef, useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, Printer, Download } from "lucide-react";
import { usePdfSettings } from '@/services/pdf/hooks/usePdfSettings';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';

// Initialiser pdfMake avec les polices par défaut
pdfMake.vfs = pdfFonts.pdfMake ? pdfFonts.pdfMake.vfs : pdfFonts.vfs;

// Couleur bleu foncée unifiée pour toute la page
const DARK_BLUE = "#002855"; // Bleu marine plus foncé que #003366

// Taille de police standard
const DEFAULT_FONT_SIZE = 10;

// Largeur de la première colonne (en pixels) pour l'alignement
const COLUMN1_WIDTH = 25;

// Chemin vers le logo
const LOGO_PATH = "/lrs_logo.jpg";

interface PrintableField {
  id: string;
  name: string;
  enabled: boolean;
  content?: string | null;
}

interface Company {
  id: string;
  name: string;
  logo_url?: string | null;
  address?: string | null;
  postal_code?: string | null;
  city?: string | null;
  tel1?: string | null;
  tel2?: string | null;
  email?: string | null;
  siret?: string | null;
  tva_intracom?: string | null;
  capital_social?: string | null;
  code_ape?: string | null;
  slogan?: string | null;
}

interface DevisCoverPreviewProps {
  fields: PrintableField[];
  company: Company | null;
  onClose: () => void;
}

export const DevisCoverPreview: React.FC<DevisCoverPreviewProps> = ({ 
  fields, 
  company, 
  onClose
}) => {
  const { pdfSettings } = usePdfSettings();
  const printContentRef = useRef<HTMLDivElement>(null);
  const [logoError, setLogoError] = useState(false);
  const [logoExists, setLogoExists] = useState(false);
  const [logoDataUrl, setLogoDataUrl] = useState<string | null>(null);
  
  const devisNumber = fields.find(f => f.id === "devisNumber")?.content;
  const devisDate = fields.find(f => f.id === "devisDate")?.content;
  const validityOffer = fields.find(f => f.id === "validityOffer")?.content;
  const client = fields.find(f => f.id === "client")?.content;
  const projectDescription = fields.find(f => f.id === "projectDescription")?.content;
  const projectAddress = fields.find(f => f.id === "projectAddress")?.content;
  const occupant = fields.find(f => f.id === "occupant")?.content;
  const additionalInfo = fields.find(f => f.id === "additionalInfo")?.content;

  useEffect(() => {
    const loadImage = async () => {
      try {
        const img = new Image();
        
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0);
            const dataUrl = canvas.toDataURL('image/jpeg');
            setLogoDataUrl(dataUrl);
            setLogoExists(true);
          }
        };
        
        img.onerror = (e) => {
          console.error("Erreur de chargement du logo:", e);
          setLogoExists(false);
          setLogoDataUrl(null);
        };
        
        img.src = LOGO_PATH;
      } catch (error) {
        console.error("Erreur lors du chargement de l'image:", error);
        setLogoExists(false);
        setLogoDataUrl(null);
      }
    };
    
    loadImage();
  }, []);
  
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

  const createDocDefinition = () => {
    const col1Width = COLUMN1_WIDTH; // Largeur fixe pour la première colonne
    const col2Width = '*'; // Largeur automatique pour la deuxième colonne
    
    return {
      pageSize: 'A4',
      pageMargins: [30, 30, 30, 30], // Marges augmentées de 50%
      
      content: [
        {
          columns: [
            {
              width: '60%',
              stack: [
                logoExists && logoDataUrl ? {
                  image: logoDataUrl,
                  width: 172,
                  height: 72,
                  margin: [0, 0, 0, 0]
                } : { text: '', margin: [0, 40, 0, 0] }
              ]
            },
            {
              width: '40%',
              stack: [
                { text: 'Assurance MAAF PRO', fontSize: DEFAULT_FONT_SIZE, color: DARK_BLUE },
                { text: 'Responsabilité civile', fontSize: DEFAULT_FONT_SIZE, color: DARK_BLUE },
                { text: 'Responsabilité civile décennale', fontSize: DEFAULT_FONT_SIZE, color: DARK_BLUE }
              ],
              alignment: 'right'
            }
          ]
        },
        
        {
          text: company?.slogan || 'Entreprise Générale du Bâtiment',
          fontSize: 12,
          bold: true,   // Ajouté pour le gras
          color: DARK_BLUE,
          margin: [0, 10, 0, 20] // Plus d'espace après le slogan
        },
        
        {
          text: `Société  ${company?.name || ''} - ${company?.address || ''} - ${company?.postal_code || ''} ${company?.city || ''}`,
          //fontSize: DEFAULT_FONT_SIZE,
          fontSize: 11,
          bold: true,   // Ajouté pour le gras
          color: DARK_BLUE,
          margin: [0, 0, 0, 3]
        },
        
        {
          columns: [
            {
              width: col1Width,
              text: 'Tél:',
              fontSize: DEFAULT_FONT_SIZE,
              color: DARK_BLUE
            },
            {
              width: col2Width,
              text: company?.tel1 || '',
              fontSize: DEFAULT_FONT_SIZE,
              color: DARK_BLUE
            }
          ],
          columnGap: 1, // Espacement augmenté
          margin: [0, 3, 0, 0]
        },
        company?.tel2 ? {
          columns: [
            {
              width: col1Width,
              text: '',
              fontSize: DEFAULT_FONT_SIZE
            },
            {
              width: col2Width,
              text: company.tel2,
              fontSize: DEFAULT_FONT_SIZE,
              color: DARK_BLUE
            }
          ],
          columnGap: 1, // Espacement augmenté
          margin: [0, 0, 0, 0]
        } : null,
        {
          columns: [
            {
              width: col1Width,
              text: 'Mail:',
              fontSize: DEFAULT_FONT_SIZE,
              color: DARK_BLUE
            },
            {
              width: col2Width,
              text: company?.email || '',
              fontSize: DEFAULT_FONT_SIZE,
              color: DARK_BLUE
            }
          ],
          columnGap: 1, // Espacement augmenté
          margin: [0, 5, 0, 0] // Plus d'espace après le mail
        },
        
        { text: '', margin: [0, 30, 0, 0] },
        
        {
          columns: [
            {
              width: col1Width,
              text: '',
              fontSize: DEFAULT_FONT_SIZE
            },
            {
              width: col2Width,
              text: [
                { text: `Devis n°: ${devisNumber || ''} Du ${formatDate(devisDate)} `, fontSize: DEFAULT_FONT_SIZE, color: DARK_BLUE },
                { text: ` (Validité de l'offre : 3 mois.)`, fontSize: 9, italics: true, color: DARK_BLUE }
              ]
            }
          ],
          columnGap: 1, // Espacement augmenté
          margin: [0, 0, 0, 0]
        },
        
        { text: '', margin: [0, 35, 0, 0] },
        
        {
          columns: [
            { width: col1Width, text: '', fontSize: DEFAULT_FONT_SIZE },
            { 
              width: col2Width, 
              text: 'Client / Maître d\'ouvrage',
              fontSize: DEFAULT_FONT_SIZE,
              color: DARK_BLUE
            }
          ],
          columnGap: 1 // Espacement augmenté
        },
        
        {
          columns: [
            { width: col1Width, text: '', fontSize: DEFAULT_FONT_SIZE },
            { 
              width: col2Width, 
              text: client || '',
              fontSize: DEFAULT_FONT_SIZE,
              color: DARK_BLUE,
              lineHeight: 1.3
            }
          ],
          columnGap: 15, // Espacement augmenté
          margin: [0, 5, 0, 0]
        },
        
        { text: '', margin: [0, 5, 0, 0] },
        { text: '', margin: [0, 5, 0, 0] },
        { text: '', margin: [0, 5, 0, 0] },
        { text: '', margin: [0, 5, 0, 0] },
        { text: '', margin: [0, 5, 0, 0] },
        
        {
          text: 'Chantier / Travaux',
          fontSize: DEFAULT_FONT_SIZE,
          color: DARK_BLUE,
          margin: [0, 0, 0, 5]
        },
        
        occupant ? {
          text: occupant,
          fontSize: DEFAULT_FONT_SIZE,
          color: DARK_BLUE,
          margin: [0, 5, 0, 0]
        } : null,
        
        projectAddress ? {
          text: 'Adresse du chantier / lieu d\'intervention:',
          fontSize: DEFAULT_FONT_SIZE,
          color: DARK_BLUE,
          margin: [0, 5, 0, 0]
        } : null,
        
        projectAddress ? {
          text: projectAddress,
          fontSize: DEFAULT_FONT_SIZE,
          color: DARK_BLUE,
          margin: [10, 3, 0, 0]
        } : null,
        
        projectDescription ? {
          text: 'Descriptif:',
          fontSize: DEFAULT_FONT_SIZE,
          color: DARK_BLUE,
          margin: [0, 8, 0, 0]
        } : null,
        
        projectDescription ? {
          text: projectDescription,
          fontSize: DEFAULT_FONT_SIZE,
          color: DARK_BLUE,
          margin: [10, 3, 0, 0]
        } : null,
        
        additionalInfo ? {
          text: additionalInfo,
          fontSize: DEFAULT_FONT_SIZE,
          color: DARK_BLUE,
          margin: [10, 15, 0, 0]
        } : null,
        
        {
          text: `${company?.name || ''} - SASU au Capital de ${company?.capital_social || '10000'} € - ${company?.address || ''} ${company?.postal_code || ''} ${company?.city || ''} - Siret : ${company?.siret || ''} - Code APE : ${company?.code_ape || ''} - N° TVA Intracommunautaire : ${company?.tva_intracom || ''}`,
          fontSize: 7,
          color: DARK_BLUE,
          alignment: 'center',
          margin: [0, 50, 0, 0],
          absolutePosition: { x: 20, y: 800 }
        }
      ].filter(Boolean),
      
      defaultStyle: {
        font: 'Roboto',
        fontSize: DEFAULT_FONT_SIZE,
        color: DARK_BLUE,
        lineHeight: 1.3
      }
    };
  };

  const handleExportPDF = () => {
    pdfMake.createPdf(createDocDefinition()).download(`devis-${devisNumber || 'preview'}.pdf`);
  };

  const handlePrint = () => {
    pdfMake.createPdf(createDocDefinition()).open();
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent 
        className="max-w-4xl max-h-[90vh] overflow-y-auto font-roboto" 
        aria-describedby="devis-preview-description"
      >
        <div id="devis-preview-description" className="sr-only">
          Aperçu de la page de garde du devis
        </div>
        <DialogHeader>
          <DialogTitle className="flex justify-between items-center">
            <span>Aperçu de la page de garde</span>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>
        
        <div ref={printContentRef} className="p-5 rounded-md my-4 bg-white">
          <div className="flex justify-between items-start">
            <div className="max-w-[60%]">
              {logoExists && logoDataUrl ? (
                <img 
                  src={logoDataUrl} 
                  alt="Logo" 
                  className="h-[72px] object-contain mb-2"
                />
              ) : null}
            </div>
            <div className="text-right text-xs" style={{ color: DARK_BLUE }}>
              <p>Assurance MAAF PRO</p>
              <p>Responsabilité civile</p>
              <p>Responsabilité civile décennale</p>
            </div>
          </div>
          
          <p className="text-xs font-bold mb-5" style={{ color: DARK_BLUE, fontSize: '12px' }}>
            {company?.slogan || 'Entreprise Générale du Bâtiment'}
          </p>
          
          <div className="text-xs leading-relaxed font-bold" style={{ color: DARK_BLUE, fontSize: '11px' }}>
            <p>Société {company?.name} - {company?.address} - {company?.postal_code} {company?.city}</p>
          </div>
          
          <div className="grid grid-cols-[25px_1fr] gap-1 text-xs leading-relaxed mt-2" style={{ color: DARK_BLUE }}>
            <div>Tél:</div>
            <div>{company?.tel1}</div>
            
            {company?.tel2 && (
              <>
                <div></div>
                <div>{company?.tel2}</div>
              </>
            )}
            
            <div>Mail:</div>
            <div>{company?.email}</div>
          </div>
          
          <div className="mt-8"></div>
          
          <div className="grid grid-cols-[25px_1fr] gap-1 text-xs" style={{ color: DARK_BLUE }}>
            <div></div>
            <div>
              Devis n°: {devisNumber} Du {formatDate(devisDate)} 
              <span className="text-[9px] italic">(Validité de l'offre : 3 mois.)</span>
            </div>
          </div>
          
          <div className="mt-8"></div>
          
          <div className="grid grid-cols-[25px_1fr] gap-1 text-xs" style={{ color: DARK_BLUE }}>
            <div></div>
            <div>
              <p className="mb-1">Client / Maître d'ouvrage</p>
              <div className="whitespace-pre-line">{client}</div>
            </div>
          </div>
          
          <div className="h-20"></div>
          
          <div className="text-xs" style={{ color: DARK_BLUE }}>
            <p className="mb-1">Chantier / Travaux</p>
            
            {occupant && (
              <p className="mb-1">{occupant}</p>
            )}
            
            {projectAddress && (
              <>
                <p className="mb-1">Adresse du chantier / lieu d'intervention:</p>
                <p className="mb-3 ml-3">{projectAddress}</p>
              </>
            )}
            
            {projectDescription && (
              <>
                <p className="mb-1">Descriptif:</p>
                <p className="mb-3 ml-3">{projectDescription}</p>
              </>
            )}
            
            {additionalInfo && (
              <p className="ml-3">{additionalInfo}</p>
            )}
          </div>
          
          <div className="text-center text-[7px] mt-24 absolute bottom-2 left-0 right-0" style={{ color: DARK_BLUE }}>
            {company?.name} - SASU au Capital de {company?.capital_social || "10000"} € - {company?.address} {company?.postal_code} {company?.city} - Siret : {company?.siret} - Code APE : {company?.code_ape} - N° TVA Intracommunautaire : {company?.tva_intracom}
          </div>
        </div>
        
        <DialogFooter className="flex justify-between gap-2">
          <Button variant="outline" onClick={onClose}>
            Fermer
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handlePrint} className="flex items-center gap-2">
              <Printer className="h-4 w-4" />
              Imprimer
            </Button>
            <Button onClick={handleExportPDF} className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Exporter PDF
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  useEffect(() => {
    console.log("DevisCoverPreview - Paramètres PDF disponibles:", pdfSettings);
    
    const elementsToCheck = [
      'cover_title',
      'company_info',
      'company_slogan',
      'devis_number',
      'devis_date',
      'devis_validity',
      'client_section_title',
      'client_section_content',
      'chantier_section_title',
      'chantier_section_content',
      'footer'
    ];

    elementsToCheck.forEach(element => {
      if (pdfSettings?.elements?.[element]) {
        console.log(`DevisCoverPreview - Élément ${element}:`, pdfSettings.elements[element]);
        if (pdfSettings.elements[element].border) {
          console.log(`DevisCoverPreview - Bordures de ${element}:`, pdfSettings.elements[element].border);
        }
      }
    });
  }, [pdfSettings]);
};
