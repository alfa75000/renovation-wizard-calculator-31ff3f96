
import React from 'react';
import { View, Text, StyleSheet } from '@react-pdf/renderer';
import { PdfSettings } from '@/services/pdf/config/pdfSettingsTypes';
import { PDF_TEXTS } from '../../constants/pdfConstants';

interface CGVPageContentProps {
  pdfSettings?: PdfSettings;
}

export const CGVPageContent: React.FC<CGVPageContentProps> = ({ pdfSettings }) => {
  return (
    <View style={styles.container}>
      {/* Titre CGV */}
      <Text style={styles.title}>{PDF_TEXTS.CGV.TITLE}</Text>
      
      {/* Sections CGV */}
      {PDF_TEXTS.CGV.SECTIONS.map((section, sectionIndex) => (
        <View key={`section-${sectionIndex}`} style={styles.section}>
          {/* Titre de section */}
          <Text style={styles.sectionTitle}>{section.title}</Text>
          
          {/* Contenu principal */}
          <Text style={styles.content}>{section.content}</Text>
          
          {/* Sous-sections si présentes */}
          {section.subsections && section.subsections.map((subsection, subIndex) => (
            <View key={`subsection-${sectionIndex}-${subIndex}`} style={styles.subsection}>
              {/* Titre de sous-section */}
              <Text style={styles.subsectionTitle}>{subsection.title}</Text>
              
              {/* Contenu de sous-section */}
              {subsection.content && (
                <Text style={styles.content}>{subsection.content}</Text>
              )}
              
              {/* Points à puces si présents */}
              {subsection.bullets && subsection.bullets.map((bullet, bulletIndex) => (
                <Text key={`bullet-${bulletIndex}`} style={styles.bullet}>
                  • {bullet}
                </Text>
              ))}
              
              {/* Contenu après les puces */}
              {subsection.content_after && (
                <Text style={styles.content}>{subsection.content_after}</Text>
              )}
            </View>
          ))}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#1a1f2c'
  },
  section: {
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#1a1f2c'
  },
  subsection: {
    marginLeft: 10,
    marginBottom: 5,
  },
  subsectionTitle: {
    fontSize: 9,
    fontWeight: 'bold',
    marginBottom: 3,
    color: '#1a1f2c'
  },
  content: {
    fontSize: 9,
    marginBottom: 5,
    textAlign: 'justify'
  },
  bullet: {
    fontSize: 9,
    marginLeft: 10,
    marginBottom: 2,
  }
});
