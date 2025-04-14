
import React, { useRef, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, Printer, Download } from "lucide-react";
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';

// Initialiser pdfMake avec les polices
pdfMake.vfs = pdfFonts.pdfMake ? pdfFonts.pdfMake.vfs : pdfFonts.vfs;

// Couleur bleu foncée unifiée pour toute la page
const DARK_BLUE = "#002855"; // Bleu marine plus foncé que #003366

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
  
  const devisNumber = fields.find(f => f.id === "devisNumber")?.content;
  const devisDate = fields.find(f => f.id === "devisDate")?.content;
  const validityOffer = fields.find(f => f.id === "validityOffer")?.content;
  const client = fields.find(f => f.id === "client")?.content;
  const projectDescription = fields.find(f => f.id === "projectDescription")?.content;
  const projectAddress = fields.find(f => f.id === "projectAddress")?.content;
  const occupant = fields.find(f => f.id === "occupant")?.content;
  const additionalInfo = fields.find(f => f.id === "additionalInfo")?.content;

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

  // Fonction pour créer un titre avec des tirets de chaque côté
  const createSectionTitle = (title: string) => {
    return {
      text: title,
      color: DARK_BLUE,
      fontSize: 11,
      margin: [0, 15, 0, 5]
    };
  };

  // Création du PDF avec pdfMake
  const createDocDefinition = () => {
    // Gérer le logo
    const logoPlaceholder = logoError || !company?.logo_url 
      ? { text: 'Logo non disponible', fontSize: 10, color: 'gray' } 
      : { image: company.logo_url, width: 100, height: 50 };
    
    return {
      pageSize: 'A4',
      pageMargins: [20, 20, 20, 20],
      
      content: [
        // En-tête avec logo et informations d'assurance
        {
          columns: [
            {
              // Colonne de gauche (logo et slogan)
              width: '60%',
              stack: [
                logoPlaceholder,
                { 
                  text: company?.slogan || 'Entreprise Générale du Bâtiment', 
                  fontSize: 10, 
                  color: DARK_BLUE,
                  margin: [0, 5, 0, 0]
                }
              ]
            },
            {
              // Colonne de droite (assurance)
              width: '40%',
              stack: [
                { text: 'Assurance MAAF PRO', fontSize: 10, color: DARK_BLUE },
                { text: 'Responsabilité civile', fontSize: 9, color: DARK_BLUE },
                { text: 'Responsabilité civile décennale', fontSize: 9, color: DARK_BLUE }
              ],
              alignment: 'right'
            }
          ]
        },
        
        // Espacement
        { text: '', margin: [0, 20, 0, 0] },
        
        // Coordonnées société - espacement réduit
        {
          columns: [
            { width: 55, text: 'Société', fontSize: 11, color: DARK_BLUE },
            { text: company?.name || '', fontSize: 11, color: DARK_BLUE }
          ]
        },
        {
          columns: [
            { width: 55, text: 'Siège:', fontSize: 11, color: DARK_BLUE },
            { text: `${company?.address || ''} - ${company?.postal_code || ''} ${company?.city || ''}`, fontSize: 11, color: DARK_BLUE }
          ],
          margin: [0, 2, 0, 0]
        },
        
        // Espacement
        { text: '', margin: [0, 10, 0, 0] },
        
        // Contact
        {
          columns: [
            { width: 55, text: 'Tél:', fontSize: 11, color: DARK_BLUE },
            { text: company?.tel1 || '', fontSize: 11, color: DARK_BLUE }
          ]
        },
        company?.tel2 ? {
          columns: [
            { width: 55, text: '', fontSize: 11 },
            { text: company?.tel2, fontSize: 11, color: DARK_BLUE }
          ],
          margin: [0, 2, 0, 0]
        } : {},
        {
          columns: [
            { width: 55, text: 'Mail:', fontSize: 11, color: DARK_BLUE },
            { text: company?.email || '', fontSize: 11, color: DARK_BLUE }
          ],
          margin: [0, 2, 0, 0]
        },
        
        // Espacement
        { text: '', margin: [0, 20, 0, 0] },
        
        // Numéro et date du devis - espacement réduit
        {
          columns: [
            { 
              text: `Devis n°: ${devisNumber || ''}`, 
              fontSize: 11, 
              color: DARK_BLUE,
              width: 120
            },
            { 
              text: [
                { text: `Du ${formatDate(devisDate)}`, fontSize: 11, color: DARK_BLUE },
                { text: ` (Validité de l'offre : 3 mois.)`, fontSize: 9, italics: true, color: DARK_BLUE }
              ]
            }
          ]
        },
        
        // Espacement
        { text: '', margin: [0, 20, 0, 0] },
        
        // Section client sans cadre
        createSectionTitle('Client / Maître d\'ouvrage'),
        {
          text: client || '',
          fontSize: 10,
          color: DARK_BLUE,
          margin: [0, 5, 0, 0]
        },
        
        // Espacement (6 retours à la ligne comme demandé)
        { text: '', margin: [0, 5, 0, 0] },
        { text: '', margin: [0, 5, 0, 0] },
        { text: '', margin: [0, 5, 0, 0] },
        { text: '', margin: [0, 5, 0, 0] },
        { text: '', margin: [0, 5, 0, 0] },
        { text: '', margin: [0, 5, 0, 0] },
        
        // Section chantier sans cadre
        createSectionTitle('Chantier / Travaux'),
        
        // Occupant en premier comme demandé
        occupant ? {
          text: occupant,
          fontSize: 10,
          color: DARK_BLUE,
          margin: [0, 5, 0, 10]
        } : {},
        
        // Adresse du chantier
        projectAddress ? {
          text: [
            { text: 'Adresse du chantier / lieu d\'intervention: ', fontSize: 10, color: DARK_BLUE },
            { text: projectAddress, fontSize: 10, color: DARK_BLUE }
          ],
          margin: [0, 5, 0, 0]
        } : {},
        
        // Description du projet
        projectDescription ? {
          text: [
            { text: 'Descriptif: \n', fontSize: 10, color: DARK_BLUE },
            { text: projectDescription, fontSize: 10, color: DARK_BLUE }
          ],
          margin: [0, 5, 0, 0]
        } : {},
        
        // Informations complémentaires sans titre
        additionalInfo ? {
          text: additionalInfo,
          fontSize: 10,
          color: DARK_BLUE,
          margin: [0, 10, 0, 0]
        } : {},
        
        // Pied de page avec taille réduite pour tenir sur une ligne
        {
          text: `${company?.name || ''} - SASU au Capital de ${company?.capital_social || '10000'} € - ${company?.address || ''} ${company?.postal_code || ''} ${company?.city || ''} - Siret : ${company?.siret || ''} - Code APE : ${company?.code_ape || ''} - N° TVA Intracommunautaire : ${company?.tva_intracom || ''}`,
          fontSize: 7, // Réduit à 7px pour tenir sur une ligne
          color: DARK_BLUE,
          alignment: 'center',
          margin: [0, 50, 0, 0],
          absolutePosition: { x: 20, y: 800 } // Position fixe en bas de page
        }
      ],
      
      defaultStyle: {
        font: 'Roboto',
        fontSize: 11,
        color: DARK_BLUE // Couleur par défaut pour tout le document
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
          <div className="flex justify-between items-start">
            <div className="max-w-[50%]">
              {!logoError ? (
                <div>
                  <img 
                    src={company?.logo_url || ""} 
                    alt="Logo" 
                    className="max-h-24 max-w-full object-contain"
                    onError={() => setLogoError(true)}
                  />
                  {company?.slogan ? (
                    <p className="text-xs mt-2" style={{ color: DARK_BLUE }}>{company.slogan}</p>
                  ) : (
                    <p className="text-xs mt-2" style={{ color: DARK_BLUE }}>Entreprise Générale du Bâtiment</p>
                  )}
                </div>
              ) : (
                <div>
                  <div className="h-24 w-48 border border-gray-300 flex items-center justify-center text-gray-400">
                    Logo non disponible
                  </div>
                  {company?.slogan ? (
                    <p className="text-xs mt-2" style={{ color: DARK_BLUE }}>{company.slogan}</p>
                  ) : (
                    <p className="text-xs mt-2" style={{ color: DARK_BLUE }}>Entreprise Générale du Bâtiment</p>
                  )}
                </div>
              )}
            </div>
            
            {/* Information d'assurance */}
            <div className="text-right text-xs" style={{ color: DARK_BLUE }}>
              <p>Assurance MAAF PRO</p>
              <p>Responsabilité civile</p>
              <p>Responsabilité civile décennale</p>
            </div>
          </div>
          
          {/* Coordonnées société avec espacement réduit */}
          <div className="mt-12 mb-8 text-sm" style={{ color: DARK_BLUE }}>
            <p>
              <span style={{ display: 'inline-block', width: '55px' }}>Société</span>
              <span>{company?.name}</span>
            </p>
            <p>
              <span style={{ display: 'inline-block', width: '55px' }}>Siège:</span>
              <span>{company?.address} - {company?.postal_code} {company?.city}</span>
            </p>
            
            <div className="mt-4">
              <p>
                <span style={{ display: 'inline-block', width: '55px' }}>Tél:</span>
                <span>{company?.tel1}</span>
              </p>
              {company?.tel2 && (
                <p>
                  <span style={{ display: 'inline-block', width: '55px' }}></span>
                  <span>{company?.tel2}</span>
                </p>
              )}
              <p>
                <span style={{ display: 'inline-block', width: '55px' }}>Mail:</span>
                <span>{company?.email}</span>
              </p>
            </div>
          </div>
          
          {/* Numéro et date du devis avec espacement réduit */}
          <div className="flex items-start mt-10 mb-12 text-sm" style={{ color: DARK_BLUE }}>
            <div style={{ width: '120px' }}>Devis n°: {devisNumber}</div>
            
            <div>
              <p className="m-0">
                Du {formatDate(devisDate)}
                <span className="text-[10px] italic ml-3">(Validité de l'offre : 3 mois.)</span>
              </p>
            </div>
          </div>
          
          {/* Section client sans cadre */}
          <div className="mb-8">
            <p className="text-sm mb-1" style={{ color: DARK_BLUE }}>Client / Maître d'ouvrage</p>
            <div className="text-xs pl-2" style={{ color: DARK_BLUE }}>
              {client && (
                <div>
                  {client}
                </div>
              )}
              {/* 6 retours à la ligne */}
              <br /><br /><br /><br /><br /><br />
            </div>
          </div>
          
          {/* Section chantier sans cadre */}
          <div>
            <p className="text-sm mb-1" style={{ color: DARK_BLUE }}>Chantier / Travaux</p>
            <div className="text-xs pl-2" style={{ color: DARK_BLUE }}>
              {/* Occupant en premier */}
              {occupant && (
                <div className="mb-3">
                  {occupant}
                </div>
              )}
              
              {/* Adresse */}
              {projectAddress && (
                <div className="mb-2">
                  Adresse du chantier / lieu d'intervention: {projectAddress}
                </div>
              )}
              
              {/* Description */}
              {projectDescription && (
                <div className="mb-2">
                  Descriptif: <br />
                  {projectDescription}
                </div>
              )}
              
              {/* Informations complémentaires sans titre */}
              {additionalInfo && (
                <div className="mt-3">
                  {additionalInfo}
                </div>
              )}
            </div>
          </div>
          
          {/* Pied de page avec taille réduite */}
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
