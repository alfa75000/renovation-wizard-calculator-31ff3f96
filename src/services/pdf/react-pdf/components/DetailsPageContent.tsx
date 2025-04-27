// src/services/pdf/react-pdf/components/DetailsPageContent.tsx

import React from 'react';
import { View, Text, StyleSheet } from '@react-pdf/renderer';
import { PdfSettings } from '@/services/pdf/config/pdfSettingsTypes';
import { ProjectState, Room, Travail } from '@/types'; 
import { getPdfStyles } from '../utils/pdfStyleUtils';

// === FONCTIONS DE FORMATAGE (Doivent exister ou être importées) ===
// Assure-toi que ces fonctions existent et sont correctes
const formatPrice = (value: number): string => { return `${(value || 0).toFixed(2)} €`; }; 
const formatQuantity = (quantity: number): string => { return `${(quantity || 0)}`; }; 
const formatMOFournitures = (travail: Travail): string => { 
    if (!travail) return '';
    const mo = formatPrice(travail.prixMainOeuvre || 0);
    const fourn = formatPrice(travail.prixFournitures || 0);
    const tva = travail.tauxTVA || 0;
    // Calcule le montant TVA pour l'affichage si nécessaire
    // const itemTotalHT = ((travail.prixFournitures || 0) + (travail.prixMainOeuvre || 0)) * (travail.quantite || 0);
    // const montantTVA = (itemTotalHT * tva) / 100;
    // return `[ MO: ${mo}/u ] [ Fourn: ${fourn}/u ] [ TVA(${tva}%): ${formatPrice(montantTVA)} ]`; 
    // Simplifié pour l'exemple :
     return `[ MO: ${mo}/u | Fourn: ${fourn}/u | TVA: ${tva}% ]`; 
};
// ===============================================================

// Helper pour obtenir les travaux d'une pièce
const getTravauxForPiece = (pieceId: string, allTravaux: Travail[] = []): Travail[] => { // Ajout valeur défaut
  return allTravaux.filter(t => t.pieceId === pieceId);
};

interface DetailsPageContentProps {
  pdfSettings: PdfSettings;
  projectState: ProjectState;
}

export const DetailsPageContent = ({ pdfSettings, projectState }: DetailsPageContentProps) => {
  // Vérifie l'existence des données nécessaires
  const rooms = projectState.rooms || [];
  const travaux = projectState.travaux || [];
  const metadata = projectState.metadata;

  // --- Récupération des Styles ---
  // (Comme dans le code précédent, récupérer tous les styles nécessaires)
  const titleStyles = getPdfStyles(pdfSettings, 'detail_title', { isContainer: false });
  const titleContainerStyles = getPdfStyles(pdfSettings, 'detail_title', { isContainer: true });
  const tableHeaderStyles = getPdfStyles(pdfSettings, 'detail_table_header', { isContainer: false });
  const roomTitleStyles = getPdfStyles(pdfSettings, 'room_title', { isContainer: false });
  const roomTitleContainerStyles = getPdfStyles(pdfSettings, 'room_title', { isContainer: true });
  const workDetailsStyles = getPdfStyles(pdfSettings, 'work_details', { isContainer: false });
  const moSuppliesStyles = getPdfStyles(pdfSettings, 'mo_supplies', { isContainer: false });
  const qtyStyles = getPdfStyles(pdfSettings, 'qty_column', { isContainer: false });
  const priceStyles = getPdfStyles(pdfSettings, 'price_column', { isContainer: false });
  const vatStyles = getPdfStyles(pdfSettings, 'vat_column', { isContainer: false });
  const totalStyles = getPdfStyles(pdfSettings, 'total_column', { isContainer: false });
  const roomTotalLabelStyles = getPdfStyles(pdfSettings, 'room_total', { isContainer: false });
  // --- Fin Récupération Styles ---

  const roomsWithTravaux = rooms.filter(room => getTravauxForPiece(room.id, travaux).length > 0);

  // Si aucune donnée à afficher, on peut retourner un message ou null
  if (roomsWithTravaux.length === 0) {
      return <View><Text>Aucun travail à afficher dans les détails.</Text></View>;
  }

  return (
    <View> {/* Conteneur global du contenu */}

      {/* 1. Titre Principal */}
      <View style={titleContainerStyles}>
        <Text style={titleStyles}>DÉTAILS DES TRAVAUX</Text>
      </View>
      <View style={{ height: 15 }} /> {/* Espace */}

      {/* 2. En-tête du Tableau */}
      <View style={styles.tableHeaderRow} fixed> {/* En-tête fixe en haut de chaque nouvelle page pour ce tableau */}
        {/* Applique les styles de texte aux Text */}
        <View style={styles.tableHeaderCellDesc}><Text style={tableHeaderStyles}>Description</Text></View>
        <View style={styles.tableHeaderCellQty}><Text style={tableHeaderStyles}>Quantité</Text></View>
        <View style={styles.tableHeaderCellPrice}><Text style={tableHeaderStyles}>Prix HT Unit.</Text></View>
        <View style={styles.tableHeaderCellVAT}><Text style={tableHeaderStyles}>TVA</Text></View>
        <View style={styles.tableHeaderCellTotal}><Text style={tableHeaderStyles}>Total HT</Text></View>
      </View>

      {/* 3. Boucle sur les Pièces */}
      {roomsWithTravaux.map((room) => {
        const travauxPiece = getTravauxForPiece(room.id, travaux);
        let pieceTotalHT = 0; 

        return (
          <React.Fragment key={room.id}>
            {/* Titre de la Pièce */}
            {/* Utilise break={true} pour tenter d'éviter qu'un titre de pièce soit seul en bas de page */}
            <View style={roomTitleContainerStyles} break> 
              <Text style={roomTitleStyles}>{room.name}</Text>
            </View>
            <View style={{ height: 5 }} /> 

            {/* Boucle sur les Travaux de la Pièce */}
            {travauxPiece.map((travail, index) => { // Ajoute l'index pour la clé potentielle
              // Vérifie la validité des données numériques
              const qte = typeof travail.quantite === 'number' ? travail.quantite : 0;
              const fourn = typeof travail.prixFournitures === 'number' ? travail.prixFournitures : 0;
              const mo = typeof travail.prixMainOeuvre === 'number' ? travail.prixMainOeuvre : 0;
              const tvaRate = typeof travail.tauxTVA === 'number' ? travail.tauxTVA : 0;

              const prixUnitaireHT = fourn + mo;
              const totalHT = prixUnitaireHT * qte;
              pieceTotalHT += totalHT; 

              const descriptionText = [
                `${travail.typeTravauxLabel || 'Type?'}: ${travail.sousTypeLabel || 'Sous-type?'}`, // Ajoute des fallbacks
                travail.description,
                travail.personnalisation,
              ].filter(Boolean).join('\n'); 

              return (
                // Utilise minPresenceAhead pour essayer de garder la ligne entière sur une page
                <View key={travail.id || `travail-${index}`} style={styles.tableRow} wrap={false} minPresenceAhead={20}> 
                  {/* Cellule Description */}
                  <View style={styles.tableCellDesc}>
                    {/* Applique les styles de texte ici */}
                    <Text style={workDetailsStyles}>{descriptionText}</Text>
                    <Text style={moSuppliesStyles}>{formatMOFournitures(travail)}</Text>
                  </View>
                  {/* Cellule Quantité */}
                  <View style={styles.tableCellQty}>
                    <Text style={qtyStyles}>{formatQuantity(qte)}</Text>
                    <Text style={qtyStyles}>{travail.unite || ''}</Text>
                  </View>
                  {/* Cellule Prix Unit HT */}
                  <View style={styles.tableCellPrice}>
                    <Text style={priceStyles}>{formatPrice(prixUnitaireHT)}</Text>
                  </View>
                  {/* Cellule TVA */}
                  <View style={styles.tableCellVAT}>
                    <Text style={vatStyles}>{`${tvaRate}%`}</Text>
                  </View>
                  {/* Cellule Total HT */}
                  <View style={styles.tableCellTotal}>
                    <Text style={totalStyles}>{formatPrice(totalHT)}</Text>
                  </View>
                </View>
              );
            })}

            {/* Ligne Total Pièce */}
            <View style={styles.tableFooterRow}>
               {/* Applique les styles de texte */}
               <View style={styles.tableFooterCellLabel}><Text style={roomTotalLabelStyles}>Total HT {room.name}</Text></View>
               <View style={styles.tableFooterCellTotal}><Text style={totalStyles}>{formatPrice(pieceTotalHT)}</Text></View>
            </View>
             <View style={{ height: 15 }} /> {/* Espace après chaque pièce */}

          </React.Fragment>
        );
      })}
    </View>
  );
};

// Styles locaux pour la structure du tableau (garde les styles existants)
const styles = StyleSheet.create({
  tableHeaderRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    backgroundColor: '#f3f4f6', 
    paddingVertical: 5, 
    width: '100%',
  },
   tableHeaderCellDesc: { width: '60%', paddingHorizontal: 4 }, 
   tableHeaderCellQty: { width: '8%', paddingHorizontal: 4, textAlign: 'center' },
   tableHeaderCellPrice: { width: '12%', paddingHorizontal: 4, textAlign: 'center' },
   tableHeaderCellVAT: { width: '6%', paddingHorizontal: 4, textAlign: 'center' },
   tableHeaderCellTotal: { width: '14%', paddingHorizontal: 4, textAlign: 'center' },
   tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    paddingVertical: 4, 
    width: '100%',
    alignItems: 'flex-start', 
  },
  tableCellDesc: { width: '60%', paddingHorizontal: 4 }, 
  tableCellQty: { width: '8%', paddingHorizontal: 4, textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent:'center' }, 
  tableCellPrice: { width: '12%', paddingHorizontal: 4, textAlign: 'center' },
  tableCellVAT: { width: '6%', paddingHorizontal: 4, textAlign: 'center' },
  tableCellTotal: { width: '14%', paddingHorizontal: 4, textAlign: 'center' },
  tableFooterRow: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    backgroundColor: '#f9fafb', 
    paddingVertical: 5,
    width: '100%',
    marginTop: 5, 
  },
  tableFooterCellLabel: { 
     flexGrow: 1, 
     paddingHorizontal: 4 
  }, 
  tableFooterCellTotal: { 
     width: '15%', 
     paddingHorizontal: 4, 
     textAlign: 'center' 
  },
});