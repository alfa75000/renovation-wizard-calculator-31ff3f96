
import { View, Text, StyleSheet } from '@react-pdf/renderer';
import { PdfSettings } from '@/services/pdf/config/pdfSettingsTypes';
import { ProjectState } from '@/types';
import { getPdfStyles } from '../utils/pdfStyleUtils';

interface ProjectSectionProps {
  pdfSettings: PdfSettings;
  projectState: ProjectState;
}

export const ProjectSection = ({ pdfSettings, projectState }: ProjectSectionProps) => {
  const project = projectState.project;
  
  const titleStyles = getPdfStyles(pdfSettings, 'project_title', { isContainer: false });
  const labelStyles = getPdfStyles(pdfSettings, 'project_labels', { isContainer: false });
  const valueStyles = getPdfStyles(pdfSettings, 'project_values', { isContainer: false });
  const containerStyles = getPdfStyles(pdfSettings, 'default', { isContainer: true });
  
  return (
    <View style={[styles.container, containerStyles]}>
      <Text style={titleStyles}>Informations Projet</Text>
      
      <View style={styles.row}>
        <Text style={[styles.labelContainer, labelStyles]}>Occupant(s):</Text>
        <Text style={valueStyles}>{project?.occupant || 'Non renseigné'}</Text>
      </View>
      
      <View style={{ height: 12 }} />
      
      <View style={styles.row}>
        <Text style={[styles.labelContainer, labelStyles]}>Adresse Chantier / d'Intervention:</Text>
      </View>
      <View style={styles.row}>
        <Text style={valueStyles}>{project?.address || 'Non renseignée'}</Text>
      </View>
      
      <View style={{ height: 12 }} />
      
      <View style={styles.row}>
        <Text style={[styles.labelContainer, labelStyles]}>Descriptif:</Text>
      </View>
      <View style={styles.row}>
        <Text style={valueStyles}>{project?.description || 'Non renseignée'}</Text>
      </View>
      
      <View style={{ height: 12 }} />
      
      <View style={styles.row}>
        <Text style={[styles.labelContainer, labelStyles]}>Informations complémentaires:</Text>
      </View>
      <View style={styles.row}>
        <Text style={valueStyles}>{project?.infoComplementaire || 'Non renseignée'}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column'
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  labelContainer: {
    marginRight: 8,
    minWidth: 120
  }
});
