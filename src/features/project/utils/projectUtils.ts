
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
