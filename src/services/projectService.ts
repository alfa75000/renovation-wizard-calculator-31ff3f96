
// Fichier adaptateur pour la rétrocompatibilité
// Ce fichier réexporte toutes les fonctions du nouveau service pour maintenir la compatibilité avec le code existant

import { 
  fetchProjectSaves as fetchProjects,
  fetchProjectSaveById as fetchProjectById,
  createProjectSave as createProject,
  updateProjectSave as updateProject,
  deleteProjectSave as deleteProject,
  generateDefaultProjectName,
  type Project
} from './projectSaveService';

// Réexporter toutes les fonctions pour la rétrocompatibilité
export {
  fetchProjects,
  fetchProjectById,
  createProject,
  updateProject,
  deleteProject,
  generateDefaultProjectName,
  type Project
};
