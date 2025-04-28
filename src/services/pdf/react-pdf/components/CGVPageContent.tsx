// src/services/pdf/react-pdf/components/CGVPageContent.tsx

import React from 'react';
import { View, Text, StyleSheet } from '@react-pdf/renderer';
import { PdfSettings } from '@/services/pdf/config/pdfSettingsTypes';
// Retire ProjectState si non nécessaire ici
// import { ProjectState } from '@/types'; 
import { getPdfStyles } from '../utils/pdfStyleUtils';
// Importe les textes constants
import { PDF_TEXTS } from '@/services/pdf/constants/pdfConstants'; 
// Importe l'espaceur
import { VerticalSpacer } from './common/VerticalSpacer'; 

interface CGVPageContentProps {
  pdfSettings: PdfSettings;
  // projectState: ProjectState; // Probablement pas nécessaire ici
}

export const CGVPageContent = ({ pdfSettings }: CGVPageContentProps) => {

  // Récupération des styles
  const titleContainerStyles = getPdfStyles(pdfSettings, 'cgv_title', { isContainer: true });
  const titleTextStyles = getPdfStyles(pdfSettings, 'cgv_title', { isContainer: false });
  const sectionTitleContainerStyles = getPdfStyles(pdfSettings, 'cgv_section_titles', { isContainer: true });
  const sectionTitleTextStyles = getPdfStyles(pdfSettings, 'cgv_section_titles', { isContainer: false });
  const contentContainerStyles = getPdfStyles(pdfSettings, 'cgv_content', { isContainer: true });
  const contentTextStyles = getPdfStyles(pdfSettings, 'cgv_content', { isContainer: false });
  // Note: Les styles pour les sous-sections et puces utilisent les mêmes IDs ici,
  // mais tu pourrais créer des IDs distincts si la personnalisation doit être différente.

  return (
    <View> {/* Conteneur global */}
      
      {/* 1. Titre Principal CGV */}
      {/* Ajout de break pour essayer de mettre le titre en haut d'une NOUVELLE page */}
      <View style={titleContainerStyles} break> 
        <Text style={titleTextStyles}>{PDF_TEXTS.CGV.TITLE}</Text>
      </View>
      <VerticalSpacer pdfSettings={pdfSettings} elementId="space_after_cgv_title" defaultHeight={20} />

      {/* 2. Boucle sur les Sections */}
      {PDF_TEXTS.CGV.SECTIONS.map((section, sectionIndex) => (
        <React.Fragment key={`section-${sectionIndex}`}>
          {/* Titre de Section */}
          <View style={sectionTitleContainerStyles}>
            <Text style={sectionTitleTextStyles}>{section.title}</Text>
          </View>
          <VerticalSpacer pdfSettings={pdfSettings} elementId="space_after_cgv_section_title" defaultHeight={5} />

          {/* Contenu Principal de Section */}
          <View style={contentContainerStyles}>
            <Text style={contentTextStyles}>{section.content}</Text>
          </View>
          {/* Ajoute un espace seulement si des sous-sections suivent */}
          {section.subsections && (
             <VerticalSpacer pdfSettings={pdfSettings} elementId="space_after_cgv_content" defaultHeight={5} />
          )}


          {/* Sous-Sections (si existent) */}
          {section.subsections && section.subsections.map((subsection, subIndex) => (
            <React.Fragment key={`subsection-${sectionIndex}-${subIndex}`}>
              {/* Titre de Sous-Section */}
               {/* Utilise les mêmes styles que les titres de section ou crée un nouvel ID */}
              <View style={[sectionTitleContainerStyles, styles.subsectionTitle]}> 
                <Text style={sectionTitleTextStyles}>{subsection.title}</Text>
              </View>
              <VerticalSpacer pdfSettings={pdfSettings} elementId="space_after_cgv_subsection_title" defaultHeight={5} />

              {/* Contenu de Sous-Section (si existe) */}
              {subsection.content && (
                <>
                  <View style={[contentContainerStyles, styles.subsectionContent]}>
                    <Text style={contentTextStyles}>{subsection.content}</Text>
                  </View>
                   {/* Ajoute un espace seulement si des puces suivent */}
                   {subsection.bullets && (
                      <VerticalSpacer pdfSettings={pdfSettings} elementId="space_after_cgv_content" defaultHeight={5} />
                   )}
                 </>
              )}

              {/* Puces (si existent) */}
              {subsection.bullets && subsection.bullets.map((bullet, bulletIndex) => (
                <React.Fragment key={`bullet-${sectionIndex}-${subIndex}-${bulletIndex}`}>
                   {/* Utilise les styles de contenu ou crée un ID 'cgv_bullet_point' */}
                   <View style={[contentContainerStyles, styles.bulletItem]}>
                     <Text style={contentTextStyles}>{`• ${bullet}`}</Text>
                   </View>
                   {/* Ajoute un petit espace entre les puces */}
                   <VerticalSpacer pdfSettings={pdfSettings} elementId="space_between_cgv_bullets" defaultHeight={2} />
                </React.Fragment>
              ))}
              
              {/* Contenu Après les Puces (si existe) */}
              {subsection.content_after && (
                 <>
                  {/* Ajoute un espace avant ce contenu */}
                   {!subsection.bullets && <View style={{height: 5}}/>} 
                   <View style={[contentContainerStyles, styles.subsectionContent]}>
                     <Text style={contentTextStyles}>{subsection.content_after}</Text>
                   </View>
                 </>
              )}
              {/* Espace après une sous-section complète */}
              <VerticalSpacer pdfSettings={pdfSettings} elementId="space_after_cgv_content" defaultHeight={10} />

            </React.Fragment>
          ))}

           {/* Espace après une section complète (sauf la dernière) */}
           {!section.subsections && sectionIndex < PDF_TEXTS.CGV.SECTIONS.length - 1 && (
              <VerticalSpacer pdfSettings={pdfSettings} elementId="space_after_cgv_content" defaultHeight={10} />
           )}

        </React.Fragment>
      ))}

    </View> // Fin conteneur global
  );
};

// Styles locaux spécifiques au layout des CGV
const styles = StyleSheet.create({
   subsectionTitle: {
      // Ajoute une indentation pour les titres de sous-section
      marginLeft: 10, 
      // Autres styles de layout si besoin
   },
   subsectionContent: {
       // Ajoute une indentation pour le contenu des sous-section
      marginLeft: 10, 
   },
   bulletItem: {
      // Ajoute une indentation pour les puces
      marginLeft: 20, 
   }
});
