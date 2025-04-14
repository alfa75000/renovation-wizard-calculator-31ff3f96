import React, { useRef, useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, Printer, Download } from "lucide-react";
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';

// Initialiser pdfMake avec les polices
pdfMake.vfs = pdfFonts.pdfMake ? pdfFonts.pdfMake.vfs : pdfFonts.vfs;

// Couleur bleu foncée unifiée pour toute la page
const DARK_BLUE = "#002855"; // Bleu marine plus foncé que #003366

// Taille de police standard
const DEFAULT_FONT_SIZE = 10;

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
  const [logoLoaded, setLogoLoaded] = useState(false);
  const [logoBase64, setLogoBase64] = useState<string | null>(null);
  
  const devisNumber = fields.find(f => f.id === "devisNumber")?.content;
  const devisDate = fields.find(f => f.id === "devisDate")?.content;
  const validityOffer = fields.find(f => f.id === "validityOffer")?.content;
  const client = fields.find(f => f.id === "client")?.content;
  const projectDescription = fields.find(f => f.id === "projectDescription")?.content;
  const projectAddress = fields.find(f => f.id === "projectAddress")?.content;
  const occupant = fields.find(f => f.id === "occupant")?.content;
  const additionalInfo = fields.find(f => f.id === "additionalInfo")?.content;

  // Formater les données client pour l'affichage et le PDF
  const formatClientData = (clientData: string | null | undefined): string[] => {
    if (!clientData) return [];
    // Divise les lignes et filtre les lignes vides
    return clientData.split('\n').filter(line => line.trim().length > 0);
  };
  
  const clientLines = formatClientData(client);

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

  // Fonction pour convertir une URL d'image en base64
  useEffect(() => {
    if (company?.logo_url) {
      const img = new Image();
      
      img.crossOrigin = "anonymous";  // Important pour les images de différentes origines
      
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0);
            const dataURL = canvas.toDataURL('image/jpeg');
            setLogoBase64(dataURL);
            setLogoLoaded(true);
            setLogoError(false);
            console.log("Logo chargé avec succès et converti en base64");
          }
        } catch (error) {
          console.error("Erreur lors de la conversion du logo en base64:", error);
          setLogoError(true);
        }
      };
      
      img.onerror = () => {
        console.error("Erreur lors du chargement du logo:", company.logo_url);
        setLogoError(true);
        setLogoLoaded(false);
      };
      
      // Ajouter un timestamp à l'URL pour éviter la mise en cache
      const timestamp = new Date().getTime();
      const logoUrl = company.logo_url.includes('?') 
        ? `${company.logo_url}&t=${timestamp}` 
        : `${company.logo_url}?t=${timestamp}`;
        
      img.src = logoUrl;
    }
  }, [company?.logo_url]);

  // Création du PDF avec pdfMake
  const createDocDefinition = () => {
    // Définition d'un espace réservé vide pour le logo
    const logoPlaceholder = {
      stack: [
        { text: '[Emplacement réservé pour le logo]', color: '#aaaaaa', fontSize: 8, margin: [0, 20, 0, 0] }
      ],
      width: 120,
      height: 60
    };
    
    // Préparer les lignes des données client pour le PDF
    const clientContent = clientLines.map(line => ({
      text: line,
      fontSize: DEFAULT_FONT_SIZE,
      color: DARK_BLUE,
      margin: [0, 2, 0, 0]
    }));
    
    const logoContent = logoBase64 && logoLoaded
      ? { image: logoBase64, width: 120, height: 60, fit: [120, 60] }
      : logoPlaceholder;
    
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
                logoContent,
                { 
                  text: company?.slogan || 'Entreprise Générale du Bâtiment', 
                  fontSize: DEFAULT_FONT_SIZE, 
                  color: DARK_BLUE,
                  margin: [0, 5, 0, 0]
                }
              ]
            },
            {
              // Colonne de droite (assurance)
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
        
        // Espacement
        { text: '', margin: [0, 20, 0, 0] },
        
        // Coordonnées société - espacement réduit
        {
          columns: [
            { width: 55, text: 'Société', fontSize: DEFAULT_FONT_SIZE, color: DARK_BLUE },
            { text: company?.name || '', fontSize: DEFAULT_FONT_SIZE, color: DARK_BLUE }
          ],
          lineHeight: 1.3 // Augmentation de l'interligne
        },
        {
          columns: [
            { width: 55, text: 'Siège:', fontSize: DEFAULT_FONT_SIZE, color: DARK_BLUE },
            { text: `${company?.address || ''} - ${company?.postal_code || ''} ${company?.city || ''}`, fontSize: DEFAULT_FONT_SIZE, color: DARK_BLUE }
          ],
          margin: [0, 0, 0, 0],
          lineHeight: 1.3
        },
        
        // Espacement
        { text: '', margin: [0, 5, 0, 0] },
        
        // Contact avec interligne augmenté
        {
          columns: [
            { width: 55, text: 'Tél:', fontSize: DEFAULT_FONT_SIZE, color: DARK_BLUE },
            { text: company?.tel1 || '', fontSize: DEFAULT_FONT_SIZE, color: DARK_BLUE }
          ],
          lineHeight: 1.3
        },
        company?.tel2 ? {
          columns: [
            { width: 55, text: '', fontSize: DEFAULT_FONT_SIZE },
            { text: company?.tel2, fontSize: DEFAULT_FONT_SIZE, color: DARK_BLUE }
          ],
          margin: [0, 0, 0, 0],
          lineHeight: 1.3
        } : {},
        
        // Espace entre téléphone et mail
        { text: '', margin: [0, 3, 0, 0] },
        
        {
          columns: [
            { width: 55, text: 'Mail:', fontSize: DEFAULT_FONT_SIZE, color: DARK_BLUE },
            { text: company?.email || '', fontSize: DEFAULT_FONT_SIZE, color: DARK_BLUE }
          ],
          lineHeight: 1.3
        },
        
        // Espacement entre mail et devis
        { text: '', margin: [0, 15, 0, 0] },
        
        // Numéro et date du devis - aligné avec les coordonnées société
        {
          columns: [
            { 
              width: 55, 
              text: 'Devis n°:', 
              fontSize: DEFAULT_FONT_SIZE, 
              color: DARK_BLUE
            },
            { 
              text: [
                { text: `${devisNumber || ''} Du ${formatDate(devisDate)}`, fontSize: DEFAULT_FONT_SIZE, color: DARK_BLUE },
                { text: ` (Validité de l'offre : 3 mois.)`, fontSize: 9, italics: true, color: DARK_BLUE }
              ]
            }
          ],
          lineHeight: 1.3
        },
        
        // Espacement
        { text: '', margin: [0, 15, 0, 0] },
        
        // Section client sans cadre - aligné avec les autres sections
        {
          text: 'Client / Maître d\'ouvrage',
          fontSize: DEFAULT_FONT_SIZE,
          color: DARK_BLUE,
          margin: [0, 0, 0, 5]
        },
        {
          columns: [
            { width: 55, text: '', fontSize: DEFAULT_FONT_SIZE },
            { 
              stack: clientContent.length > 0 ? clientContent : [{ text: "Aucun client sélectionné", fontSize: DEFAULT_FONT_SIZE, color: DARK_BLUE }]
            }
          ],
          lineHeight: 1.3
        },
        
        // Espacement (6 retours à la ligne comme demandé)
        { text: '', margin: [0, 3, 0, 0] },
        { text: '', margin: [0, 3, 0, 0] },
        { text: '', margin: [0, 3, 0, 0] },
        { text: '', margin: [0, 3, 0, 0] },
        { text: '', margin: [0, 3, 0, 0] },
        { text: '', margin: [0, 3, 0, 0] },
        
        // Section chantier sans cadre - aligné avec les autres sections
        {
          text: 'Chantier / Travaux',
          fontSize: DEFAULT_FONT_SIZE,
          color: DARK_BLUE,
          margin: [0, 0, 0, 5]
        },
        
        // Occupant en premier comme demandé - si présent
        occupant ? {
          columns: [
            { width: 55, text: '', fontSize: DEFAULT_FONT_SIZE },
            { 
              text: occupant,
              fontSize: DEFAULT_FONT_SIZE,
              color: DARK_BLUE
            }
          ],
          lineHeight: 1.3
        } : null,
        
        // Espacement si occupant est présent
        occupant ? { text: '', margin: [0, 3, 0, 0] } : null,
        
        // Adresse du chantier - si présente
        projectAddress ? {
          columns: [
            { width: 55, text: '', fontSize: DEFAULT_FONT_SIZE },
            {
              text: [
                { text: 'Adresse du chantier / lieu d\'intervention: ', fontSize: DEFAULT_FONT_SIZE, color: DARK_BLUE },
                { text: projectAddress, fontSize: DEFAULT_FONT_SIZE, color: DARK_BLUE }
              ]
            }
          ],
          lineHeight: 1.3
        } : null,
        
        // Espacement si adresse est présente
        projectAddress ? { text: '', margin: [0, 3, 0, 0] } : null,
        
        // Description du projet - si présente
        projectDescription ? {
          columns: [
            { width: 55, text: '', fontSize: DEFAULT_FONT_SIZE },
            {
              stack: [
                { text: 'Descriptif:', fontSize: DEFAULT_FONT_SIZE, color: DARK_BLUE },
                { text: projectDescription, fontSize: DEFAULT_FONT_SIZE, color: DARK_BLUE, margin: [0, 3, 0, 0] }
              ]
            }
          ],
          lineHeight: 1.3
        } : null,
        
        // Espacement si description est présente
        projectDescription ? { text: '', margin: [0, 3, 0, 0] } : null,
        
        // Informations complémentaires sans titre - si présent
        additionalInfo ? {
          columns: [
            { width: 55, text: '', fontSize: DEFAULT_FONT_SIZE },
            { 
              text: additionalInfo,
              fontSize: DEFAULT_FONT_SIZE,
              color: DARK_BLUE
            }
          ],
          lineHeight: 1.3
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
        color: DARK_BLUE, // Couleur par défaut pour tout le document
        lineHeight: 1.3 // Interligne par défaut pour tout le document
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
              {logoLoaded && logoBase64 ? (
                <div>
                  <img 
                    src={logoBase64} 
                    alt="" 
                    className="max-h-24 max-w-full object-contain"
                  />
                  {company?.slogan ? (
                    <p className="text-xs mt-2" style={{ color: DARK_BLUE }}>{company.slogan}</p>
                  ) : (
                    <p className="text-xs mt-2" style={{ color: DARK_BLUE }}>Entreprise Générale du Bâtiment</p>
                  )}
                </div>
              ) : (
                <div>
                  <div className="h-24 w-48 flex items-center justify-center border border-gray-200 bg-gray-50">
                    <span className="text-gray-400 text-xs">Emplacement réservé pour le logo</span>
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
          
          {/* Coordonnées société avec espacement réduit et interligne augmenté */}
          <div className="mt-12 mb-4 text-xs leading-relaxed" style={{ color: DARK_BLUE }}>
            <p>
              <span style={{ display: 'inline-block', width: '55px' }}>Société</span>
              <span>{company?.name}</span>
            </p>
            <p>
              <span style={{ display: 'inline-block', width: '55px' }}>Siège:</span>
              <span>{company?.address} - {company?.postal_code} {company?.city}</span>
            </p>
            
            <div className="mt-2">
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
            </div>
            
            {/* Espace entre téléphone et mail */}
            <div className="mt-3">
              <p>
                <span style={{ display: 'inline-block', width: '55px' }}>Mail:</span>
                <span>{company?.email}</span>
              </p>
            </div>
          </div>
          
          {/* Espace entre mail et devis */}
          <div className="mt-6"></div>
          
          {/* Numéro et date du devis aligné avec autres éléments */}
          <div className="text-xs leading-relaxed" style={{ color: DARK_BLUE }}>
            <p>
              <span style={{ display: 'inline-block', width: '55px' }}>Devis n°:</span>
              <span>
                {devisNumber} Du {formatDate(devisDate)}
                <span className="text-[9px] italic ml-1">(Validité de l'offre : 3 mois.)</span>
              </span>
            </p>
          </div>
          
          {/* Espace avant section client */}
          <div className="mt-6"></div>
          
          {/* Section client sans cadre - aligné avec les autres sections */}
          <div className="mb-2">
            <p className="text-xs mb-1" style={{ color: DARK_BLUE }}>Client / Maître d'ouvrage</p>
            <div className="text-xs leading-relaxed pl-14" style={{ color: DARK_BLUE }}>
              {clientLines.length > 0 ? (
                clientLines.map((line, index) => (
                  <div key={index} className="whitespace-pre-wrap">{line}</div>
                ))
              ) : (
                <div>Aucun client sélectionné</div>
              )}
            </div>
          </div>
          
          {/* 6 retours à la ligne */}
          <div className="h-24"></div>
          
          {/* Section chantier sans cadre - aligné avec les autres sections */}
          <div>
            <p className="text-xs mb-1" style={{ color: DARK_BLUE }}>Chantier / Travaux</p>
            <div className="text-xs leading-relaxed pl-14" style={{ color: DARK_BLUE }}>
              {/* Occupant en premier */}
              {occupant && (
                <div className="mb-2">
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
                  <span className="block mt-1">{projectDescription}</span>
                </div>
              )}
              
              {/* Informations complémentaires sans titre */}
              {additionalInfo && (
                <div className="mt-2">
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
