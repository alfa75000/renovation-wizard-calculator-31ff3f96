// src/services/pdf/react-pdf/components/DetailsPageContent.tsx

import React from 'react';
import { View, Text, StyleSheet } from '@react-pdf/renderer';
import { PdfSettings } from '@/services/pdf/config/pdfSettingsTypes';
import { ProjectState, Room, Travail } from '@/types'; // Assure-toi d'importer Room et Travail
import { getPdfStyles } from '../utils/pdfStyleUtils';
// Importe tes fonctions de formatage si elles sont séparées
// import { formatPrice, formatQuantity, formatMOFournitures } from '@/services/pdf/utils/formatUtils'; 
// Ou copie/colle les fonctions de formatage ici pour l'instant

// Recopie ici les fonctions de formatage depuis pdfUtils.ts (ancien code)
const formatPrice = (value: number): string => { /* ... (code de formatPrice) ... */ return `${value.toFixed(2)} €`; }; // Simplifié
const formatQuantity = (quantity: number): string => { /* ... (code de formatQuantity) ... */ return `${quantity}`; }; // Simplifié
const formatMOFournitures = (travail: Travail): string => { /* ... (code de formatMOFournitures) ... */ return `MO: ${formatPrice(travail.prixMainOeuvre)} | Fourn: ${formatPrice(travail.prixFournitures)}`; }; // Simplifié

// Helper pour obtenir les travaux d'une pièce (similaire à ce que tu avais)
const getTravauxForPiece = (pieceId: string, allTravaux: Travail[]): Travail[] => {
  return allTravaux.filter(t => t.pieceId === pieceId);
};

interface DetailsPageContentProps {
  pdfSettings: PdfSettings;
  projectState: ProjectState;
}

export const DetailsPageContent = ({ pdfSettings, projectState }: DetailsPageContentProps) => {
  const { rooms, travaux, metadata } = projectState;

  // Styles communs
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
  // Note: On pourrait aussi vouloir styler les <View> des cellules

  const roomsWithTravaux = rooms.filter(room => getTravauxForPiece(room.id, travaux).length > 0);

  return (
    <View> {/* Conteneur global du contenu de cette page */}

      {/* 1. Titre Principal */}
      <View style={titleContainerStyles}>
        <Text style={titleStyles}>DÉTAILS DES TRAVAUX</Text>
      </View>
      <View style={{ height: 15 }} /> {/* Espace */}

      {/* 2. En-tête du Tableau */}
      <View style={styles.tableHeaderRow}>
        <View style={styles.tableHeaderCellDesc}><Text style={tableHeaderStyles}>Description</Text></View>
        <View style={styles.tableHeaderCellQty}><Text style={tableHeaderStyles}>Quantité</Text></View>
        <View style={styles.tableHeaderCellPrice}><Text style={tableHeaderStyles}>Prix HT Unit.</Text></View>
        <View style={styles.tableHeaderCellVAT}><Text style={tableHeaderStyles}>TVA</Text></View>
        <View style={styles.tableHeaderCellTotal}><Text style={tableHeaderStyles}>Total HT</Text></View>
      </View>

      {/* 3. Boucle sur les Pièces */}
      {roomsWithTravaux.map((room) => {
        const travauxPiece = getTravauxForPiece(room.id, travaux);
        let pieceTotalHT = 0; // Calcul du total pour la pièce

        return (
          // Utilise React.Fragment pour ne pas ajouter de <View> inutile autour de chaque pièce
          <React.Fragment key={room.id}>
            {/* Titre de la Pièce */}
            <View style={roomTitleContainerStyles}>
              <Text style={roomTitleStyles}>{room.name}</Text>
            </View>
            <View style={{ height: 5 }} /> {/* Espace */}

            {/* Boucle sur les Travaux de la Pièce */}
            {travauxPiece.map((travail) => {
              const prixUnitaireHT = travail.prixFournitures + travail.prixMainOeuvre;
              const totalHT = prixUnitaireHT * travail.quantite;
              pieceTotalHT += totalHT; // Ajoute au total de la pièce

              // Construction de la description multiligne
              const descriptionText = [
                `${travail.typeTravauxLabel}: ${travail.sousTypeLabel}`,
                travail.description,
                travail.personnalisation,
              ].filter(Boolean).join('\n'); // Join avec saut de ligne

              return (
                // Ligne du tableau pour un travail
                <View key={travail.id} style={styles.tableRow}>
                  {/* Cellule Description */}
                  <View style={styles.tableCellDesc}>
                    <Text style={workDetailsStyles}>{descriptionText}</Text>
                    <Text style={moSuppliesStyles}>{formatMOFournitures(travail)}</Text>
                  </View>
                  {/* Cellule Quantité */}
                  <View style={styles.tableCellQty}>
                    <Text style={qtyStyles}>{formatQuantity(travail.quantite)}</Text>
                    <Text style={qtyStyles}>{travail.unite}</Text>
                  </View>
                  {/* Cellule Prix Unit HT */}
                  <View style={styles.tableCellPrice}>
                    <Text style={priceStyles}>{formatPrice(prixUnitaireHT)}</Text>
                  </View>
                  {/* Cellule TVA */}
                  <View style={styles.tableCellVAT}>
                    <Text style={vatStyles}>{`${travail.tauxTVA}%`}</Text>
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

// Styles locaux pour la structure du tableau
const styles = StyleSheet.create({
  tableHeaderRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    backgroundColor: '#f3f4f6', // Fond pour l'en-tête
    paddingVertical: 5, // Padding vertical pour l'en-tête
    width: '100%',
  },
   tableHeaderCellDesc: { width: '50%', paddingHorizontal: 4 }, // Ajuste les largeurs
   tableHeaderCellQty: { width: '10%', paddingHorizontal: 4, textAlign: 'center' },
   tableHeaderCellPrice: { width: '15%', paddingHorizontal: 4, textAlign: 'center' },
   tableHeaderCellVAT: { width: '10%', paddingHorizontal: 4, textAlign: 'center' },
   tableHeaderCellTotal: { width: '15%', paddingHorizontal: 4, textAlign: 'center' },
   tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    paddingVertical: 4, // Padding vertical pour les lignes
    width: '100%',
    alignItems: 'flex-start', // Aligne le contenu en haut des cellules
  },
  tableCellDesc: { width: '50%', paddingHorizontal: 4 }, // Mêmes largeurs que l'en-tête
  tableCellQty: { width: '10%', paddingHorizontal: 4, textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent:'center' }, // Centre texte Qty + Unité
  tableCellPrice: { width: '15%', paddingHorizontal: 4, textAlign: 'center' },
  tableCellVAT: { width: '10%', paddingHorizontal: 4, textAlign: 'center' },
  tableCellTotal: { width: '15%', paddingHorizontal: 4, textAlign: 'center' },
  tableFooterRow: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    backgroundColor: '#f9fafb', // Fond légèrement différent pour le total pièce
    paddingVertical: 5,
    width: '100%',
    marginTop: 5, // Espace avant la ligne de total
  },
  tableFooterCellLabel: { 
     // Prend la largeur des 4 premières colonnes (50+10+15+10 = 85%)
     // Ou utilise flexGrow pour prendre l'espace
     flexGrow: 1, 
     paddingHorizontal: 4 
  }, 
  tableFooterCellTotal: { 
     width: '15%', // Même largeur que la colonne total
     paddingHorizontal: 4, 
     textAlign: 'center' 
  },
});
