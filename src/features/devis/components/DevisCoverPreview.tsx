
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
      stack: [
        {
          canvas: [
            {
              type: 'line',
              x1: 0, y1: 5,
              x2: 515, y2: 5,
              lineWidth: 0.5,
              lineColor: DARK_BLUE
            }
          ]
        },
        {
          text: title,
          absolutePosition: { x: 200, y: 0 },
          fontSize: 11,
          color: DARK_BLUE,
          background: 'white',
          padding: [5, 0, 5, 0]
        }
      ],
      margin: [0, 10, 0, 5]
    };
  };

  const handleExportPDF = () => {
    // Image placeholder pour le logo (à remplacer par le vrai logo si disponible)
    // Dans un cas réel, vous devriez charger dynamiquement l'image du logo
    const logoPlaceholder = logoError || !company?.logo_url 
      ? null 
      : { image: company.logo_url, width: 100, height: 50 };
    
    // Définition du document
    const docDefinition = {
      pageSize: 'A4',
      pageMargins: [20, 20, 20, 20], // [left, top, right, bottom]
      
      content: [
        // En-tête avec logo et informations d'assurance
        {
          columns: [
            {
              // Colonne de gauche (logo et slogan)
              width: '60%',
              stack: [
                logoPlaceholder || { text: 'Logo non disponible', fontSize: 10, color: 'gray' },
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
        
        // Espace
        { text: '', margin: [0, 20, 0, 0] },
        
        // Coordonnées société
        {
          columns: [
            { width: 70, text: 'Société', fontSize: 11 },
            { text: company?.name || '', fontSize: 11 }
          ]
        },
        {
          columns: [
            { width: 70, text: 'Siège:', fontSize: 11 },
            { text: `${company?.address || ''} - ${company?.postal_code || ''} ${company?.city || ''}`, fontSize: 11 }
          ],
          margin: [0, 2, 0, 0]
        },
        
        // Espace
        { text: '', margin: [0, 15, 0, 0] },
        
        // Contact
        {
          columns: [
            { width: 70, text: 'Tél:', fontSize: 11 },
            { text: company?.tel1 || '', fontSize: 11 }
          ]
        },
        company?.tel2 ? {
          columns: [
            { width: 70, text: '', fontSize: 11 },
            { text: company?.tel2, fontSize: 11 }
          ],
          margin: [0, 2, 0, 0]
        } : {},
        {
          columns: [
            { width: 70, text: 'Mail:', fontSize: 11 },
            { text: company?.email || '', fontSize: 11 }
          ],
          margin: [0, 2, 0, 0]
        },
        
        // Espace
        { text: '', margin: [0, 30, 0, 0] },
        
        // Numéro et date du devis
        {
          columns: [
            { text: `Devis n°: ${devisNumber || ''}`, bold: true, fontSize: 11, width: 150 },
            { 
              text: [
                { text: `Du ${formatDate(devisDate)}`, fontSize: 11 },
                { text: ` (Validité de l'offre : 3 mois.)`, fontSize: 9, italics: true }
              ]
            }
          ]
        },
        
        // Espace
        { text: '', margin: [0, 30, 0, 0] },
        
        // Section client
        createSectionTitle('Client / Maître d\'ouvrage'),
        {
          table: {
            widths: ['*'],
            body: [
              [{ text: client || '', fontSize: 10, margin: [0, 5, 0, 5] }]
            ]
          },
          layout: {
            hLineWidth: function(i: number) { return 0.5; },
            vLineWidth: function(i: number) { return 0.5; },
            hLineColor: function() { return DARK_BLUE; },
            vLineColor: function() { return DARK_BLUE; },
            paddingLeft: function() { return 10; },
            paddingRight: function() { return 10; },
            paddingTop: function() { return 5; },
            paddingBottom: function() { return 5; }
          }
        },
        
        // Espace
        { text: '', margin: [0, 20, 0, 0] },
        
        // Section chantier
        createSectionTitle('Chantier / Travaux'),
        {
          table: {
            widths: ['*'],
            body: [
              [{
                stack: [
                  { text: projectDescription || '', fontSize: 10, margin: [0, 0, 0, 10] },
                  projectAddress ? { text: ['Adresse du chantier:\n', { text: projectAddress, margin: [0, 2, 0, 0] }], fontSize: 10, margin: [0, 5, 0, 0] } : {},
                  occupant ? { text: ['Occupant:\n', { text: occupant, margin: [0, 2, 0, 0] }], fontSize: 10, margin: [0, 5, 0, 0] } : {},
                  additionalInfo ? { text: ['Informations complémentaires:\n', { text: additionalInfo, margin: [0, 2, 0, 0] }], fontSize: 10, margin: [0, 5, 0, 0] } : {}
                ],
                margin: [0, 5, 0, 5]
              }]
            ]
          },
          layout: {
            hLineWidth: function(i: number) { return 0.5; },
            vLineWidth: function(i: number) { return 0.5; },
            hLineColor: function() { return DARK_BLUE; },
            vLineColor: function() { return DARK_BLUE; },
            paddingLeft: function() { return 10; },
            paddingRight: function() { return 10; },
            paddingTop: function() { return 5; },
            paddingBottom: function() { return 5; }
          }
        },
        
        // Pied de page
        {
          text: `${company?.name || ''} - SASU au Capital de ${company?.capital_social || '10000'} € - ${company?.address || ''} ${company?.postal_code || ''} ${company?.city || ''} - Siret : ${company?.siret || ''} - Code APE : ${company?.code_ape || ''} - N° TVA Intracommunautaire : ${company?.tva_intracom || ''}`,
          fontSize: 9,
          alignment: 'center',
          margin: [0, 50, 0, 0]
        }
      ],
      
      defaultStyle: {
        font: 'Roboto',
        fontSize: 11
      }
    };
    
    // Génération du PDF
    pdfMake.createPdf(docDefinition).download(`devis-${devisNumber || 'preview'}.pdf`);
  };

  const handlePrint = () => {
    // Utiliser la même fonction pour l'impression
    // PDFMake peut ouvrir le PDF directement pour impression
    pdfMake.createPdf(createDocDefinition()).open();
  };

  // Fonction pour créer la définition du document PDF
  const createDocDefinition = () => {
    const logoPlaceholder = logoError || !company?.logo_url 
      ? null 
      : { image: company.logo_url, width: 100, height: 50 };
    
    return {
      pageSize: 'A4',
      pageMargins: [20, 20, 20, 20],
      
      content: [
        // En-tête avec logo et informations d'assurance
        {
          columns: [
            {
              width: '60%',
              stack: [
                logoPlaceholder || { text: 'Logo non disponible', fontSize: 10, color: 'gray' },
                { 
                  text: company?.slogan || 'Entreprise Générale du Bâtiment', 
                  fontSize: 10, 
                  color: DARK_BLUE,
                  margin: [0, 5, 0, 0]
                }
              ]
            },
            {
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
        
        { text: '', margin: [0, 20, 0, 0] },
        
        // Coordonnées société
        {
          columns: [
            { width: 70, text: 'Société', fontSize: 11 },
            { text: company?.name || '', fontSize: 11 }
          ]
        },
        {
          columns: [
            { width: 70, text: 'Siège:', fontSize: 11 },
            { text: `${company?.address || ''} - ${company?.postal_code || ''} ${company?.city || ''}`, fontSize: 11 }
          ],
          margin: [0, 2, 0, 0]
        },
        
        { text: '', margin: [0, 15, 0, 0] },
        
        // Contact
        {
          columns: [
            { width: 70, text: 'Tél:', fontSize: 11 },
            { text: company?.tel1 || '', fontSize: 11 }
          ]
        },
        company?.tel2 ? {
          columns: [
            { width: 70, text: '', fontSize: 11 },
            { text: company?.tel2, fontSize: 11 }
          ],
          margin: [0, 2, 0, 0]
        } : {},
        {
          columns: [
            { width: 70, text: 'Mail:', fontSize: 11 },
            { text: company?.email || '', fontSize: 11 }
          ],
          margin: [0, 2, 0, 0]
        },
        
        { text: '', margin: [0, 30, 0, 0] },
        
        // Numéro et date du devis
        {
          columns: [
            { text: `Devis n°: ${devisNumber || ''}`, bold: true, fontSize: 11, width: 150 },
            { 
              text: [
                { text: `Du ${formatDate(devisDate)}`, fontSize: 11 },
                { text: ` (Validité de l'offre : 3 mois.)`, fontSize: 9, italics: true }
              ]
            }
          ]
        },
        
        { text: '', margin: [0, 30, 0, 0] },
        
        // Section client
        createSectionTitle('Client / Maître d\'ouvrage'),
        {
          table: {
            widths: ['*'],
            body: [
              [{ text: client || '', fontSize: 10, margin: [0, 5, 0, 5] }]
            ]
          },
          layout: {
            hLineWidth: function(i: number) { return 0.5; },
            vLineWidth: function(i: number) { return 0.5; },
            hLineColor: function() { return DARK_BLUE; },
            vLineColor: function() { return DARK_BLUE; },
            paddingLeft: function() { return 10; },
            paddingRight: function() { return 10; },
            paddingTop: function() { return 5; },
            paddingBottom: function() { return 5; }
          }
        },
        
        { text: '', margin: [0, 20, 0, 0] },
        
        // Section chantier
        createSectionTitle('Chantier / Travaux'),
        {
          table: {
            widths: ['*'],
            body: [
              [{
                stack: [
                  { text: projectDescription || '', fontSize: 10, margin: [0, 0, 0, 10] },
                  projectAddress ? { text: ['Adresse du chantier:\n', { text: projectAddress, margin: [0, 2, 0, 0] }], fontSize: 10, margin: [0, 5, 0, 0] } : {},
                  occupant ? { text: ['Occupant:\n', { text: occupant, margin: [0, 2, 0, 0] }], fontSize: 10, margin: [0, 5, 0, 0] } : {},
                  additionalInfo ? { text: ['Informations complémentaires:\n', { text: additionalInfo, margin: [0, 2, 0, 0] }], fontSize: 10, margin: [0, 5, 0, 0] } : {}
                ],
                margin: [0, 5, 0, 5]
              }]
            ]
          },
          layout: {
            hLineWidth: function(i: number) { return 0.5; },
            vLineWidth: function(i: number) { return 0.5; },
            hLineColor: function() { return DARK_BLUE; },
            vLineColor: function() { return DARK_BLUE; },
            paddingLeft: function() { return 10; },
            paddingRight: function() { return 10; },
            paddingTop: function() { return 5; },
            paddingBottom: function() { return 5; }
          }
        },
        
        // Pied de page
        {
          text: `${company?.name || ''} - SASU au Capital de ${company?.capital_social || '10000'} € - ${company?.address || ''} ${company?.postal_code || ''} ${company?.city || ''} - Siret : ${company?.siret || ''} - Code APE : ${company?.code_ape || ''} - N° TVA Intracommunautaire : ${company?.tva_intracom || ''}`,
          fontSize: 9,
          alignment: 'center',
          margin: [0, 50, 0, 0]
        }
      ],
      
      defaultStyle: {
        font: 'Roboto',
        fontSize: 11
      }
    };
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
        
        {/* Contenu principal avec marges réduites - Pour l'aperçu uniquement */}
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
            
            {/* Information d'assurance - Taille réduite et sans gras */}
            <div className="text-right text-xs" style={{ color: DARK_BLUE }}>
              <p>Assurance MAAF PRO</p>
              <p>Responsabilité civile</p>
              <p>Responsabilité civile décennale</p>
            </div>
          </div>
          
          {/* Coordonnées société avec alignement amélioré */}
          <div className="mt-12 mb-8 text-sm">
            <p>
              <span style={{ display: 'inline-block', width: '70px' }}>Société</span>
              <span>{company?.name}</span>
            </p>
            <p>
              <span style={{ display: 'inline-block', width: '70px' }}>Siège:</span>
              <span>{company?.address} - {company?.postal_code} {company?.city}</span>
            </p>
            
            <div className="mt-4">
              <p>
                <span style={{ display: 'inline-block', width: '70px' }}>Tél:</span>
                <span>{company?.tel1}</span>
              </p>
              {company?.tel2 && (
                <p>
                  <span style={{ display: 'inline-block', width: '70px' }}></span>
                  <span>{company?.tel2}</span>
                </p>
              )}
              <p>
                <span style={{ display: 'inline-block', width: '70px' }}>Mail:</span>
                <span>{company?.email}</span>
              </p>
            </div>
          </div>
          
          {/* Numéro et date du devis avec la validité en ligne */}
          <div className="flex items-start mt-10 mb-12 text-sm">
            <div className="font-bold">Devis n°: {devisNumber}</div>
            
            <div className="ml-6">
              <p className="m-0">
                Du {formatDate(devisDate)}
                <span className="text-[10px] italic ml-3">(Validité de l'offre : 3 mois.)</span>
              </p>
            </div>
          </div>
          
          {/* Section client - Titre avec tirets */}
          <div className="mb-8">
            <h3 className="text-sm font-normal flex items-center mb-1">
              <span className="mr-2 flex-grow border-t border-current" style={{ borderColor: DARK_BLUE }}></span>
              <span style={{ color: DARK_BLUE }}>Client / Maître d'ouvrage</span>
              <span className="ml-2 flex-grow border-t border-current" style={{ borderColor: DARK_BLUE }}></span>
            </h3>
            <div className="border text-xs" style={{ borderColor: DARK_BLUE, padding: "15px", minHeight: "100px" }}>
              {client && (
                <div>
                  {client}
                </div>
              )}
            </div>
          </div>
          
          {/* Section chantier - Titre avec tirets */}
          <div>
            <h3 className="text-sm font-normal flex items-center mb-1">
              <span className="mr-2 flex-grow border-t border-current" style={{ borderColor: DARK_BLUE }}></span>
              <span style={{ color: DARK_BLUE }}>Chantier / Travaux</span>
              <span className="ml-2 flex-grow border-t border-current" style={{ borderColor: DARK_BLUE }}></span>
            </h3>
            <div className="border text-xs" style={{ borderColor: DARK_BLUE, padding: "15px", minHeight: "150px" }}>
              {projectDescription && (
                <div className="mb-4">
                  {projectDescription}
                </div>
              )}
              
              {projectAddress && (
                <div className="mb-2">
                  <strong>Adresse du chantier:</strong><br />
                  {projectAddress}
                </div>
              )}
              
              {occupant && (
                <div className="mb-2">
                  <strong>Occupant:</strong><br />
                  {occupant}
                </div>
              )}
              
              {additionalInfo && (
                <div className="mt-4">
                  <strong>Informations complémentaires:</strong><br />
                  {additionalInfo}
                </div>
              )}
            </div>
          </div>
          
          {/* Pied de page avec taille légèrement augmentée */}
          <div className="text-center text-[9px] mt-24">
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
