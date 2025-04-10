
// Fichier adaptateur pour la rétrocompatibilité
// Ce fichier réexporte toutes les fonctions du nouveau service modulaire pour maintenir la compatibilité avec le code existant

import { 
  fetchProjects,
  fetchProjectById,
  createProject,
  updateProject,
  deleteProject,
  generateDefaultProjectName,
  type Project
} from './project/index';

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
