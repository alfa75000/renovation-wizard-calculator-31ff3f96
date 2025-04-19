
import React, { useRef, useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, Printer, Download } from "lucide-react";
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

  // Vérifier si le logo existe et le charger en Data URL
  useEffect(() => {
    // Fonction pour charger l'image et la convertir en Data URL
    const loadImage = async () => {
      try {
        // Créer une image
        const img = new Image();
        
        // Configurer les gestionnaires d'événements
        img.onload = () => {
          // Créer un canvas pour convertir l'image en Data URL
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0);
            // Convertir en Data URL
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
        
        // Déclencher le chargement avec le chemin de l'image
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

  // Création du PDF avec pdfMake
  const createDocDefinition = () => {
    // Définition des colonnes
    const col1Width = COLUMN1_WIDTH; // Largeur fixe pour la première colonne
    const col2Width = '*'; // Largeur automatique pour la deuxième colonne
    
    return {
      pageSize: 'A4',
      pageMargins: [30, 30, 30, 30], // Marges augmentées de 50%
      
      content: [
        // Logo et assurance sur la même ligne
        {
          columns: [
            // Logo à gauche
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
            // Assurance à droite
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
        
        // Slogan - Aligné en colonne 1
        {
          text: company?.slogan || 'Entreprise Générale du Bâtiment',
          fontSize: 12,
          bold: true,   // Ajouté pour le gras
          color: DARK_BLUE,
          margin: [0, 10, 0, 20] // Plus d'espace après le slogan
        },
        
        // Coordonnées société - Nom et adresse combinés
        {
          text: `Société  ${company?.name || ''} - ${company?.address || ''} - ${company?.postal_code || ''} ${company?.city || ''}`,
          //fontSize: DEFAULT_FONT_SIZE,
          fontSize: 11,
          bold: true,   // Ajouté pour le gras
          color: DARK_BLUE,
          margin: [0, 0, 0, 3]
        },
        
        // Tél et Mail
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
        
        // Espace avant devis
        { text: '', margin: [0, 30, 0, 0] },
        
        // Numéro et date du devis - TOUT aligné en colonne 2
        {
          columns: [
            {
              width: col1Width,
              text: '', // Colonne 1 vide
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
        
        // Espace avant Client
        { text: '', margin: [0, 35, 0, 0] },
        
        // Client - Titre aligné en colonne 2
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
        
        // Client - Contenu avec sauts de ligne préservés
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
        
        // 5 lignes vides après les données client
        { text: '', margin: [0, 5, 0, 0] },
        { text: '', margin: [0, 5, 0, 0] },
        { text: '', margin: [0, 5, 0, 0] },
        { text: '', margin: [0, 5, 0, 0] },
        { text: '', margin: [0, 5, 0, 0] },
        
        // Chantier - Titre et contenu alignés en colonne 1
        {
          text: 'Chantier / Travaux',
          fontSize: DEFAULT_FONT_SIZE,
          color: DARK_BLUE,
          margin: [0, 0, 0, 5]
        },
        
        // Occupant
        occupant ? {
          text: occupant,
          fontSize: DEFAULT_FONT_SIZE,
          color: DARK_BLUE,
          margin: [0, 5, 0, 0]
        } : null,
        
        // Adresse du chantier
        projectAddress ? {
          text: 'Adresse du chantier / lieu d\'intervention:',
          fontSize: DEFAULT_FONT_SIZE,
          color: DARK_BLUE,
          margin: [0, 5, 0, 0]
        } : null,
        
        // Ensuite, uniquement la valeur de l'adresse en C2
        projectAddress ? {
          text: projectAddress,
          fontSize: DEFAULT_FONT_SIZE,
          color: DARK_BLUE,
          margin: [10, 3, 0, 0]  // Ajouter 15 points de marge à gauche au lieu de 0
        } : null,

        // Descriptif
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
        
        // Informations complémentaires
        additionalInfo ? {
          text: additionalInfo,
          fontSize: DEFAULT_FONT_SIZE,
          color: DARK_BLUE,
          margin: [10, 15, 0, 0]
        } : null,
        
        // Pied de page avec taille réduite pour tenir sur une ligne
        {
          text: `${company?.name || ''} - SASU au Capital de ${company?.capital_social || '10000'} € - ${company?.address || ''} ${company?.postal_code || ''} ${company?.city || ''} - Siret : ${company?.siret || ''} - Code APE : ${company?.code_ape || ''} - N° TVA Intracommunautaire : ${company?.tva_intracom || ''}`,
          fontSize: 7, // Réduit à 7px pour tenir sur une ligne
          color: DARK_BLUE,
          alignment: 'center',
          margin: [0, 50, 0, 0],
          absolutePosition: { x: 20, y: 800 } // Position fixe en bas de page
        }
      ].filter(Boolean), // Filtre les éléments null (champs vides)
      
      defaultStyle: {
        font: 'Roboto',
        fontSize: DEFAULT_FONT_SIZE,
        color: DARK_BLUE,
        lineHeight: 1.3
      }
    };
  };

  const handleExportPDF = () => {
    // Génération du PDF avec le document défini
    pdfMake.createPdf(createDocDefinition()).download(`devis-${devisNumber || 'preview'}.pdf`);
  };

  const handlePrint = () => {
    // Utiliser la même fonction pour l'impression
    pdfMake.createPdf(createDocDefinition()).open();
  };

  // Aperçu HTML pour affichage dans l'interface
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
        
        {/* Contenu principal - Cet aperçu est uniquement visuel, le vrai PDF est généré par pdfMake */}
        <div ref={printContentRef} className="p-5 rounded-md my-4 bg-white">
          {/* Logo et informations d'assurance */}
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
          
          {/* Coordonnées société - Nom et adresse combinés */}
          <div className="text-xs leading-relaxed font-bold" style={{ color: DARK_BLUE, fontSize: '11px' }}>
            <p>Société {company?.name} - {company?.address} - {company?.postal_code} {company?.city}</p>
          </div>
          
          {/* Tél et Mail avec structure en 2 colonnes */}
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
          
          {/* Espace avant devis */}
          <div className="mt-8"></div>
          
          {/* Numéro et date du devis - TOUT dans la colonne 2 */}
          <div className="grid grid-cols-[25px_1fr] gap-1 text-xs" style={{ color: DARK_BLUE }}>
            <div></div>
            <div>
              Devis n°: {devisNumber} Du {formatDate(devisDate)} 
              <span className="text-[9px] italic">(Validité de l'offre : 3 mois.)</span>
            </div>
          </div>
          
          {/* Espace avant Client */}
          <div className="mt-8"></div>
          
          {/* Client - aligné en colonne 2 avec retours à la ligne */}
          <div className="grid grid-cols-[25px_1fr] gap-1 text-xs" style={{ color: DARK_BLUE }}>
            <div></div>
            <div>
              <p className="mb-1">Client / Maître d'ouvrage</p>
              <div className="whitespace-pre-line">{client}</div>
            </div>
          </div>
          
          {/* 5 retours à la ligne au lieu de 10 */}
          <div className="h-20"></div>
          
          {/* Chantier - aligné à gauche (colonne 1) */}
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
          
          {/* Pied de page */}
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
};
