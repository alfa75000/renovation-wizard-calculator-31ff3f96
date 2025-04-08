
// Re-export functions from the specific service files
export {
  fetchWorkTypes,
  fetchServiceGroups,
  fetchServices,
  createWorkType,
  updateWorkType,
  deleteWorkType,
  createServiceGroup,
  updateServiceGroup,
  deleteServiceGroup,
  createService,
  updateService,
  deleteService
} from './travauxService';

export {
  fetchMenuiserieTypes,
  createMenuiserieType,
  updateMenuiserieType,
  deleteMenuiserieType
} from './menuiseriesService';

export {
  fetchAutresSurfacesTypes,
  createAutreSurfaceType,
  updateAutreSurfaceType,
  deleteAutreSurfaceType
} from './autresSurfacesService';
