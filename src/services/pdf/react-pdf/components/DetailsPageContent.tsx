// src/services/pdf/react-pdf/components/DetailsPageContent.tsx 

import React from 'react';
// MODIF: Importe Style explicitement pour getAlignSelf
import { View, Text, StyleSheet, Style } from '@react-pdf/renderer'; 
import { PdfSettings } from '@/services/pdf/config/pdfSettingsTypes';
import { ProjectState, Room, Travail } from '@/types'; 
import { getPdfStyles } from '../utils/pdfStyleUtils';

// === FONCTIONS DE FORMATAGE (Assure-toi qu'elles sont correctes) ===
const formatPrice = (value: number): string => { return `${(value || 0).toFixed(2)} €`; }; 
const formatQuantity = (quantity: number): string => { return `${(quantity || 0)}`; }; 
const formatMOFournitures = (travail: Travail): string => { 
    if (!travail) return '';
    const mo = formatPrice(travail.prixMainOeuvre || 0);
    const fourn = formatPrice(travail.prixFournitures || 0);
    const tva = travail.tauxTVA || 0;
     return `[ MO: ${mo}/u | Fourn: ${fourn}/u | TVA: ${tva}% ]`; 
};
// ===============================================================

// Helper pour obtenir les travaux d'une pièce
const getTravauxForPiece = (pieceId: string, allTravaux: Travail[] = []): Travail[] => { 
  return allTravaux.filter(t => t.pieceId === pieceId);
};

// Fonction utilitaire pour convertir textAlign en alignSelf
// MODIF: Ajout de type plus précis
const getAlignSelf = (textAlign?: Style['textAlign']): 'flex-start' | 'center' | 'flex-end' => { 
  switch (textAlign) {
    case 'center': return 'center';
    case 'right': return 'flex-end';
    default: return 'flex-start';
  }
};

interface DetailsPageContentProps {
  pdfSettings: PdfSettings;
  projectState: ProjectState;
}

export const DetailsPageContent = ({ pdfSettings, projectState }: DetailsPageContentProps) => {
  const rooms = projectState.rooms || [];
  const travaux = projectState.travaux || [];

  // --- Styles ---
  // MODIF: Récupération de tous les styles nécessaires, y compris les nouveaux
  const titleTextStyles = getPdfStyles(pdfSettings, 'detail_title', { isContainer: false });
  const titleContainerStyles = getPdfStyles(pdfSettings, 'detail_title', { isContainer: true });
  const tableHeaderTextStyles = getPdfStyles(pdfSettings, 'detail_table_header', { isContainer: false });
  const tableHeaderContainerStyles = getPdfStyles(pdfSettings, 'detail_table_header', { isContainer: true });
  const roomTitleTextStyles = getPdfStyles(pdfSettings, 'room_title', { isContainer: false });
  const roomTitleContainerStyles = getPdfStyles(pdfSettings, 'room_title', { isContainer: true });
  // Styles pour les différentes parties de la description (utilise les NOUVEAUX IDs)
  const workTypeStyles = getPdfStyles(pdfSettings, 'work_details', { isContainer: false }); 
  const workTypeContainerStyles = getPdfStyles(pdfSettings, 'work_details', { isContainer: true }); 
  const workDescTextStyles = getPdfStyles(pdfSettings, 'work_description_text', { isContainer: false }); 
  const workDescContainerStyles = getPdfStyles(pdfSettings, 'work_description_text', { isContainer: true }); 
  const workPersoTextStyles = getPdfStyles(pdfSettings, 'work_personalization_text', { isContainer: false }); 
  const workPersoContainerStyles = getPdfStyles(pdfSettings, 'work_personalization_text', { isContainer: true }); 
  const moSuppliesTextStyles = getPdfStyles(pdfSettings, 'mo_supplies', { isContainer: false }); 
  const moSuppliesContainerStyles = getPdfStyles(pdfSettings, 'mo_supplies', { isContainer: true }); 
  // Styles colonnes
  const qtyStyles = getPdfStyles(pdfSettings, 'qty_column', { isContainer: false });
  const priceStyles = getPdfStyles(pdfSettings, 'price_column', { isContainer: false });
  const vatStyles = getPdfStyles(pdfSettings, 'vat_column', { isContainer: false });
  const totalStyles = getPdfStyles(pdfSettings, 'total_column', { isContainer: false });
  // Styles Total Pièce
  const roomTotalTextStyles = getPdfStyles(pdfSettings, 'room_total', { isContainer: false });
  const roomTotalContainerStyles = getPdfStyles(pdfSettings, 'room_total', { isContainer: true });
  // --- Fin Styles ---

  // Récupération de la couleur de fond claire (si pdfSettings et colors existent)
  const lightBackgroundColor = pdfSettings?.colors?.background || '#f3f4f6'; 

  const roomsWithTravaux = rooms.filter(room => getTravauxForPiece(room.id, travaux).length > 0);

  if (roomsWithTravaux.length === 0) {
    return <View><Text>Aucun travail à afficher dans les détails.</Text></View>;
  }

  return (
    <View>
      {/* 1. Titre Principal avec alignSelf adaptatif */}
      <View style={[
        // Applique les styles dynamiques DU CONTENEUR du titre
        titleContainerStyles, 
        // Ajoute l'alignement du conteneur basé sur le texte
        { alignSelf: getAlignSelf(titleTextStyles.textAlign) } 
      ]}>
        {/* Applique les styles dynamiques DU TEXTE du titre */}
        <Text style={titleTextStyles}>DÉTAILS DES TRAVAUX</Text>
      </View>
      <View style={{ height: 15 }} />

      {/* 2. En-tête du Tableau avec styles dynamiques */}
      <View 
        style={[
          styles.tableHeaderRow, // Styles locaux pour le layout row/width
          tableHeaderContainerStyles, // Styles dynamiques pour padding, border, etc.
          // Fond : utilise celui de l'élément OU le fond clair global
          { backgroundColor: tableHeaderContainerStyles.backgroundColor || lightBackgroundColor } 
        ]} 
        fixed // Répète l'en-tête sur chaque page
      >
        {/* Cellules de l'en-tête */}
        <View style={styles.tableHeaderCellDesc}><Text style={tableHeaderTextStyles}>Description</Text></View>
        <View style={styles.tableHeaderCellQty}><Text style={[tableHeaderTextStyles, qtyStyles.textAlign ? { textAlign: qtyStyles.textAlign } : {}]}>Quantité</Text></View>
        <View style={styles.tableHeaderCellPrice}><Text style={[tableHeaderTextStyles, priceStyles.textAlign ? { textAlign: priceStyles.textAlign } : {}]}>Prix HT Unit.</Text></View>
        <View style={styles.tableHeaderCellVAT}><Text style={[tableHeaderTextStyles, vatStyles.textAlign ? { textAlign: vatStyles.textAlign } : {}]}>TVA</Text></View>
        <View style={styles.tableHeaderCellTotal}><Text style={[tableHeaderTextStyles, totalStyles.textAlign ? { textAlign: totalStyles.textAlign } : {}]}>Total HT</Text></View>
      </View>

      {/* 3. Boucle sur les Pièces */}
      {roomsWithTravaux.map((room) => {
        const travauxPiece = getTravauxForPiece(room.id, travaux);
        let pieceTotalHT = 0; 

        return (
          <React.Fragment key={room.id}>
            {/* Titre de la Pièce avec alignSelf adaptatif */}
            <View style={[
              // Applique les styles dynamiques DU CONTENEUR du titre de pièce
              roomTitleContainerStyles,
              // Ajoute l'alignement du conteneur basé sur le texte
              { alignSelf: getAlignSelf(roomTitleTextStyles.textAlign) }
            ]} break> 
            {/* 'break' essaie d'éviter le titre seul en bas de page */}
              {/* Applique les styles dynamiques DU TEXTE du titre de pièce */}
              <Text style={roomTitleTextStyles}>{room.name}</Text>
            </View>
            <View style={{ height: 5 }} /> 

            {/* Boucle sur les Travaux de la Pièce */}
            {travauxPiece.map((travail, index) => {
              // ... (calculs qte, fourn, mo, etc.) ...
               const qte = typeof travail.quantite === 'number' ? travail.quantite : 0;
               const fourn = typeof travail.prixFournitures === 'number' ? travail.prixFournitures : 0;
               const mo = typeof travail.prixMainOeuvre === 'number' ? travail.prixMainOeuvre : 0;
               const tvaRate = typeof travail.tauxTVA === 'number' ? travail.tauxTVA : 0;
               const prixUnitaireHT = fourn + mo;
               const totalHT = prixUnitaireHT * qte;
               pieceTotalHT += totalHT; 

              return (
                // === Ligne du tableau pour un travail ===
                 {/* MODIF: wrap={true} par défaut, on supprime wrap={false} */}
                 {/* MODIF: Ajout style local pour centrage V */}
                <View key={travail.id || `travail-${index}`} style={styles.tableRow}> 
                   {/* Les commentaires peuvent aller ici si besoin */}
                   {/* MODIF: wrap={true} par défaut, on supprime wrap={false} */}
                   {/* MODIF: Ajout style local pour centrage V via alignItems sur tableRow */}
                  
                  {/* === Cellule Description Refactorisée === */}
                  <View style={styles.tableCellDesc}>
                     {/* ... contenu cellule description ... */}
                     {/* Bloc Type/Sous-type */}
                     <View style={workTypeContainerStyles}> 
                       <Text style={workTypeStyles}>
                         {`${travail.typeTravauxLabel || '?'}: ${travail.sousTypeLabel || '?'}`}
                       </Text>
                     </View>
                     
                     {/* Bloc Description (si existe) */}
                     {travail.description && (
                       <>
                         <View style={{height: 2}} /> 
                         <View style={workDescContainerStyles}>
                           <Text style={workDescTextStyles}>
                             {travail.description}
                           </Text>
                         </View>
                       </>
                     )}
 
                      {/* Bloc Personnalisation (si existe) */}
                      {travail.personnalisation && (
                        <>
                          <View style={{height: 2}} /> 
                          <View style={workPersoContainerStyles}>
                            <Text style={[workPersoTextStyles, {fontStyle: 'italic'}]}> 
                               {travail.personnalisation}
                            </Text>
                         </View>
                        </>
                      )}
 
                      {/* Bloc MO/Fournitures */}
                      <View style={{height: 4}} /> 
                      <View style={moSuppliesContainerStyles}>
                        <Text style={moSuppliesTextStyles}>
                           {formatMOFournitures(travail)}
                         </Text>
                      </View>
                   </View>
                  {/* === Fin Cellule Description === */}

                  {/* === Autres Cellules (Qté, Prix, TVA, Total) === */}
                  <View style={styles.tableCellQty}>
                    <Text style={qtyStyles}>{formatQuantity(qte)}</Text>
                    <Text style={qtyStyles}>{travail.unite || ''}</Text>
                  </View>
                  <View style={styles.tableCellPrice}>
                    <Text style={priceStyles}>{formatPrice(prixUnitaireHT)}</Text>
                  </View>
                  <View style={styles.tableCellVAT}>
                    <Text style={vatStyles}>{`${tvaRate}%`}</Text>
                  </View>
                  <View style={styles.tableCellTotal}>
                    <Text style={totalStyles}>{formatPrice(totalHT)}</Text>
                  </View>
                  {/* === Fin Autres Cellules === */}
                </View> // Fin de la ligne de travail
              ); // Fin du return de la boucle map travaux
            })} 

            {/* ... (Ligne Total Pièce, Espace après pièce) ... */}

          </React.Fragment>
        ); // Fin du return de la boucle map rooms
      })} 
    </View> // Fin Conteneur Global
  ); // Fin du return du composant
}; // Fin du composant

// ... (styles StyleSheet.create reste identique) ...
const styles = StyleSheet.create({
    // ... tous les styles ...
    tableRow: {
        flexDirection: 'row',
        paddingVertical: 4,
        width: '100%',
        alignItems: 'center', // *** Centrage Vertical ***
        // borderBottom supprimé
      },
  tableHeaderCellDesc: { width: '50%', paddingHorizontal: 4 }, 
  tableHeaderCellQty: { width: '10%', paddingHorizontal: 4, textAlign: 'center' },
  tableHeaderCellPrice: { width: '15%', paddingHorizontal: 4, textAlign: 'center' },
  tableHeaderCellVAT: { width: '10%', paddingHorizontal: 4, textAlign: 'center' },
  tableHeaderCellTotal: { width: '15%', paddingHorizontal: 4, textAlign: 'center' }, 
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 4,
    width: '100%',
    alignItems: 'center', // MODIF : Centrage vertical des cellules
    // borderBottom supprimé -> vient des styles dynamiques (ex: sur work_details)
  },
  tableCellDesc: { 
      width: '50%', 
      paddingHorizontal: 4 
  }, 
  // MODIF: Suppression display:flex, justifyContent:center
  tableCellQty: { 
      width: '10%', 
      paddingHorizontal: 4, 
      textAlign: 'center' 
  },
  tableCellPrice: { 
      width: '15%', 
      paddingHorizontal: 4, 
      textAlign: 'center'
  },
  tableCellVAT: { 
      width: '10%', 
      paddingHorizontal: 4, 
      textAlign: 'center'
  },
  tableCellTotal: { 
      width: '15%', 
      paddingHorizontal: 4, 
      textAlign: 'center'
  },
  tableFooterRow: {
    flexDirection: 'row',
    width: '100%',
    marginTop: 5,
    paddingVertical: 4, 
     // backgroundColor & border viennent des styles dynamiques
  },
  tableFooterCellLabel: { 
     flexGrow: 1, 
     paddingHorizontal: 4 
  }, 
  tableFooterCellTotal: { 
     width: '15%', 
     paddingHorizontal: 4, 
  },
  // MODIF : Suppression titleContainer et roomTitleContainer
});
