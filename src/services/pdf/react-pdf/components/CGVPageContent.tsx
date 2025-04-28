// src/services/pdf/react-pdf/components/CGVPageContent.tsx
// VERSION CORRIGÉE - Élimination de tous les espaces textuels

import React from 'react';
import { View, Text, StyleSheet } from '@react-pdf/renderer';
import { PdfSettings } from '@/services/pdf/config/pdfSettingsTypes';
import { getPdfStyles } from '../utils/pdfStyleUtils';
// Importe les textes constants pour les CGV
import { PDF_TEXTS } from '@/services/pdf/constants/pdfConstants'; 
// Importe le composant d'espacement
import { VerticalSpacer } from './common/VerticalSpacer'; 

interface CGVPageContentProps {
  pdfSettings: PdfSettings;
}

export const CGVPageContent = ({ pdfSettings }: CGVPageContentProps) => {
  // Récupération des styles
  const titleContainerStyles = getPdfStyles(pdfSettings, 'cgv_title', { isContainer: true });
  const titleTextStyles = getPdfStyles(pdfSettings, 'cgv_title', { isContainer: false });
  const sectionTitleContainerStyles = getPdfStyles(pdfSettings, 'cgv_section_titles', { isContainer: true });
  const sectionTitleTextStyles = getPdfStyles(pdfSettings, 'cgv_section_titles', { isContainer: false });
  const contentContainerStyles = getPdfStyles(pdfSettings, 'cgv_content', { isContainer: true });
  const contentTextStyles = getPdfStyles(pdfSettings, 'cgv_content', { isContainer: false });

  return (
    <View>
      {/* 1. Titre Principal CGV */}
      <View style={titleContainerStyles} break>
        <Text style={titleTextStyles}>{PDF_TEXTS.CGV.TITLE}</Text>
      </View>
      <VerticalSpacer pdfSettings={pdfSettings} elementId="space_after_cgv_title" defaultHeight={20} />

      {/* 2. Boucle sur les Sections */}
      {PDF_TEXTS.CGV.SECTIONS.map((section, sectionIndex) => (
        <View key={`section-${sectionIndex}`}>
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
            <View key={`subsection-${sectionIndex}-${subIndex}`}>
              {/* Titre de Sous-Section */}
              <View style={[sectionTitleContainerStyles, styles.subsectionTitle]}> 
                <Text style={sectionTitleTextStyles}>{subsection.title}</Text>
              </View>
              <VerticalSpacer pdfSettings={pdfSettings} elementId="space_after_cgv_subsection_title" defaultHeight={5} />

              {/* Contenu de Sous-Section (si existe) */}
              {subsection.content && (
                <View>
                  <View style={[contentContainerStyles, styles.subsectionContent]}>
                    <Text style={contentTextStyles}>{subsection.content}</Text>
                  </View>
                  
                  {/* Ajoute un espace seulement si des puces suivent */}
                  {subsection.bullets && (
                    <VerticalSpacer pdfSettings={pdfSettings} elementId="space_after_cgv_content" defaultHeight={5} />
                  )}
                </View>
              )}

              {/* Puces (si existent) */}
              {subsection.bullets && subsection.bullets.map((bullet, bulletIndex) => (
                <View key={`bullet-${sectionIndex}-${subIndex}-${bulletIndex}`}>
                  <View style={[contentContainerStyles, styles.bulletItem]}>
                    <Text style={contentTextStyles}>{`• ${bullet}`}</Text>
                  </View>
                  
                  {/* Ajoute un petit espace entre les puces */}
                  <VerticalSpacer pdfSettings={pdfSettings} elementId="space_between_cgv_bullets" defaultHeight={2} />
                </View>
              ))}
              
              {/* Contenu Après les Puces (si existe) */}
              {subsection.content_after && (
                <View>
                  {/* Ajoute un espace avant ce contenu */}
                  {!subsection.bullets && <View style={{height: 5}}/>} 
                  <View style={[contentContainerStyles, styles.subsectionContent]}>
                    <Text style={contentTextStyles}>{subsection.content_after}</Text>
                  </View>
                </View>
              )}
              
              {/* Espace après une sous-section complète */}
              <VerticalSpacer pdfSettings={pdfSettings} elementId="space_after_cgv_content" defaultHeight={10} />
            </View>
          ))}

          {/* Espace après une section complète (sauf la dernière) */}
          {!section.subsections && sectionIndex < PDF_TEXTS.CGV.SECTIONS.length - 1 && (
            <VerticalSpacer pdfSettings={pdfSettings} elementId="space_after_cgv_content" defaultHeight={10} />
          )}
        </View>
      ))}
    </View>
  );
};

// Styles locaux spécifiques au layout des CGV
const styles = StyleSheet.create({
  subsectionTitle: {
    marginLeft: 10, 
  },
  subsectionContent: {
    marginLeft: 10, 
  },
  bulletItem: {
    marginLeft: 20, 
  }
});
