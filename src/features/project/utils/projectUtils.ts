
import { Room } from "@/types";

/**
 * Génère un nom de pièce séquentiel basé sur les pièces existantes et le type
 * @param rooms Liste des pièces existantes
 * @param type Type de pièce à créer
 * @returns Nom séquentiel pour la nouvelle pièce
 */
export const generateRoomName = (rooms: Room[], type: string): string => {
  console.log("generateRoomName - Démarrage pour type:", type);
  
  // Filtrer les pièces du même type
  const sameTypeRooms = rooms.filter(room => room.type === type);
  
  // Trouver le numéro le plus élevé déjà utilisé
  let maxNumber = 0;
  
  sameTypeRooms.forEach(room => {
    // Extraire le numéro à la fin du nom (ex: "Chambre 1" -> 1)
    const match = room.name.match(/\s(\d+)$/);
    
    if (match && match[1]) {
      const num = parseInt(match[1], 10);
      if (!isNaN(num) && num > maxNumber) {
        maxNumber = num;
      }
    }
  });
  
  // Retourner le nom avec le numéro suivant
  return `${type} ${maxNumber + 1}`;
};

/**
 * Génère un identifiant unique pour un élément (pièce, travail, etc.)
 * @returns Identifiant unique
 */
export const generateUniqueId = (): string => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

/**
 * Calcule le montant total d'un projet (somme des travaux)
 * @param travaux Liste des travaux
 * @returns Montant total
 */
export const calculateTotalAmount = (travaux: any[]): number => {
  return travaux.reduce((total, travail) => {
    const prixFournitures = travail.prixFournitures || 0;
    const prixMainOeuvre = travail.prixMainOeuvre || 0;
    return total + prixFournitures + prixMainOeuvre;
  }, 0);
};

/**
 * Génère des statistiques sur le projet (nombre de pièces, total des surfaces, etc.)
 * @param rooms Liste des pièces
 * @returns Statistiques du projet
 */
export const generateProjectStats = (rooms: Room[]) => {
  const totalSurface = rooms.reduce((sum, room) => sum + (room.surface || 0), 0);
  const totalWallSurface = rooms.reduce((sum, room) => sum + (room.surfaceBruteMurs || 0), 0);
  
  return {
    totalRooms: rooms.length,
    totalSurface: totalSurface,
    totalWallSurface: totalWallSurface,
  };
};
