import React from 'react';
import { Document, Page, View, Text, StyleSheet } from '@react-pdf/renderer';
import type { Style } from '@react-pdf/types';
import { PdfSettings } from '@/services/pdf/config/pdfSettingsTypes';
import { ProjectState } from '@/types';
import { getContainerStyles, getTextStyles } from '../utils/pdfStyleUtils';
import { convertPageMargins, MarginTuple } from '../../v2/utils/styleUtils';
import { PageFooter } from './common/PageFooter';

interface DetailsPageProps {
  pdfSettings: PdfSettings;
  projectState: ProjectState;
}

export const DetailsPage: React.FC<DetailsPageProps> = ({ pdfSettings, projectState }) => {
  if (!pdfSettings || !projectState || !projectState.rooms) {
    return null;
  }

  const detailsMargins: MarginTuple = convertPageMargins(
    pdfSettings.margins?.details as number[] | undefined
  );

  // Calcul de l'espace disponible pour le contenu principal
  const footerSpace = 50; // Espace réservé pour le footer
  const pagePaddingBottom = detailsMargins[2] + footerSpace;

  return (
    <Document>
      {projectState.rooms.map((room, index) => (
        <Page
          key={room.id}
          size="A4"
          style={[
            styles.page,
            {
              paddingTop: detailsMargins[0],
              paddingRight: detailsMargins[1],
              paddingBottom: pagePaddingBottom, // Ajustement pour le footer
              paddingLeft: detailsMargins[3],
            },
          ]}
        >
          {/* Contenu principal de la page */}
          <View style={styles.content}>
            {/* Titre de la pièce */}
            <Text style={getTextStyles(pdfSettings, 'roomTitle', { marginTop: 10, marginBottom: 5 })}>
              {room.customName || room.name}
            </Text>

            {/* Description de la pièce */}
            {room.description && (
              <View style={getContainerStyles(pdfSettings, 'roomDescriptionContainer')}>
                <Text style={getTextStyles(pdfSettings, 'roomDescription')}>{room.description}</Text>
              </View>
            )}

            {/* Liste des travaux pour cette pièce */}
            {projectState.travaux
              .filter((travail) => travail.pieceId === room.id)
              .map((travail, travailIndex) => (
                <View key={travail.id} style={getContainerStyles(pdfSettings, 'travailContainer', { marginBottom: 5 })}>
                  <Text style={getTextStyles(pdfSettings, 'travailDescription')}>
                    {travail.description} - {travail.quantite} {travail.unite}
                  </Text>
                  <Text style={getTextStyles(pdfSettings, 'travailPrice')}>
                    Prix: {travail.prixFournitures + travail.prixMainOeuvre} €
                  </Text>
                </View>
              ))}
          </View>

          {/* Footer fixe en bas de chaque page */}
          <PageFooter pdfSettings={pdfSettings} company={projectState.metadata?.company} />
        </Page>
      ))}
    </Document>
  );
};

const styles = StyleSheet.create({
  page: {
    backgroundColor: '#fff',
    fontFamily: 'Helvetica',
    fontSize: 10,
    lineHeight: 1.2,
    flexDirection: 'column',
  },
  content: {
    flexGrow: 1, // Le contenu prend l'espace restant
  },
});
