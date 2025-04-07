import Dexie, { Table } from 'dexie';
import { Client, Room, PropertyType, Travail, ProjetChantier } from '@/types';
import logService from './logService';

/**
 * Service de base de données utilisant Dexie.js pour interfacer avec IndexedDB
 */
class AppDatabase extends Dexie {
  // Définition des tables
  clients!: Table<Client, string>;
  rooms!: Table<Room, string>;
  travaux!: Table<Travail, string>;
  projets!: Table<ProjetChantier, string>;
  propertyInfo!: Table<PropertyType & { id: string }, string>;

  constructor() {
    super('RenovationAppDB');
    
    // Définition du schéma de la base de données
    this.version(1).stores({
      clients: 'id, nom, prenom, typeClient', // Clé primaire + index
      rooms: 'id, name',
      travaux: 'id, pieceId, type',
      projets: 'id, clientId, nomProjet',
      propertyInfo: 'id'
    });
    
    logService.info('Service de base de données IndexedDB initialisé', 'system');
  }
  
  /**
   * Récupère tous les clients
   */
  async getAllClients(): Promise<Client[]> {
    try {
      const clients = await this.clients.toArray();
      logService.debug(`${clients.length} clients récupérés depuis IndexedDB`, 'storage');
      return clients;
    } catch (error) {
      logService.error('Erreur lors de la récupération des clients depuis IndexedDB', error as Error, 'storage');
      throw error;
    }
  }
  
  /**
   * Ajoute un client
   */
  async addClient(client: Client): Promise<string> {
    try {
      const id = await this.clients.add(client);
      logService.info('Client ajouté à IndexedDB', 'storage', { clientId: id });
      return id as string;
    } catch (error) {
      logService.error('Erreur lors de l\'ajout d\'un client dans IndexedDB', error as Error, 'storage');
      throw error;
    }
  }
  
  /**
   * Met à jour un client
   */
  async updateClient(client: Client): Promise<void> {
    try {
      await this.clients.update(client.id, client);
      logService.info('Client mis à jour dans IndexedDB', 'storage', { clientId: client.id });
    } catch (error) {
      logService.error('Erreur lors de la mise à jour d\'un client dans IndexedDB', error as Error, 'storage');
      throw error;
    }
  }
  
  /**
   * Supprime un client
   */
  async deleteClient(id: string): Promise<void> {
    try {
      await this.clients.delete(id);
      logService.info('Client supprimé d\'IndexedDB', 'storage', { clientId: id });
    } catch (error) {
      logService.error('Erreur lors de la suppression d\'un client d\'IndexedDB', error as Error, 'storage');
      throw error;
    }
  }
  
  /**
   * Réinitialise les clients avec les valeurs par défaut
   */
  async resetClients(defaultClients: Client[]): Promise<void> {
    try {
      await this.transaction('rw', this.clients, async () => {
        await this.clients.clear();
        await Promise.all(defaultClients.map(client => this.clients.add(client)));
      });
      
      logService.warn('Réinitialisation des clients dans IndexedDB', 'storage');
    } catch (error) {
      logService.error('Erreur lors de la réinitialisation des clients dans IndexedDB', error as Error, 'storage');
      throw error;
    }
  }

  /**
   * Synchronise les clients entre localStorage et IndexedDB
   */
  async syncFromLocalStorage(clients: Client[]): Promise<void> {
    try {
      const existingClients = await this.clients.toArray();
      const existingIds = new Set(existingClients.map(c => c.id));
      
      await this.transaction('rw', this.clients, async () => {
        for (const client of clients) {
          if (existingIds.has(client.id)) {
            await this.clients.update(client.id, client);
          } else {
            await this.clients.add(client);
          }
        }
        
        const localStorageIds = new Set(clients.map(c => c.id));
        for (const existingClient of existingClients) {
          if (!localStorageIds.has(existingClient.id)) {
            await this.clients.delete(existingClient.id);
          }
        }
      });
      
      logService.info('Synchronisation des clients depuis localStorage vers IndexedDB', 'storage', {
        clientCount: clients.length
      });
    } catch (error) {
      logService.error('Erreur lors de la synchronisation des clients depuis localStorage', error as Error, 'storage');
      throw error;
    }
  }

  /**
   * Récupère toutes les pièces
   */
  async getAllRooms(): Promise<Room[]> {
    try {
      const rooms = await this.rooms.toArray();
      logService.debug(`${rooms.length} pièces récupérées depuis IndexedDB`, 'storage');
      return rooms;
    } catch (error) {
      logService.error('Erreur lors de la récupération des pièces depuis IndexedDB', error as Error, 'storage');
      throw error;
    }
  }
  
  /**
   * Ajoute une pièce
   */
  async addRoom(room: Room): Promise<string> {
    try {
      const id = await this.rooms.add(room);
      logService.info('Pièce ajoutée à IndexedDB', 'storage', { roomId: id });
      return id as string;
    } catch (error) {
      logService.error('Erreur lors de l\'ajout d\'une pièce dans IndexedDB', error as Error, 'storage');
      throw error;
    }
  }
  
  /**
   * Met à jour une pièce
   */
  async updateRoom(id: string, room: Room): Promise<void> {
    try {
      await this.rooms.update(id, room);
      logService.info('Pièce mise à jour dans IndexedDB', 'storage', { roomId: id });
    } catch (error) {
      logService.error('Erreur lors de la mise à jour d\'une pièce dans IndexedDB', error as Error, 'storage');
      throw error;
    }
  }
  
  /**
   * Supprime une pièce
   */
  async deleteRoom(id: string): Promise<void> {
    try {
      await this.rooms.delete(id);
      logService.info('Pièce supprimée d\'IndexedDB', 'storage', { roomId: id });
    } catch (error) {
      logService.error('Erreur lors de la suppression d\'une pièce d\'IndexedDB', error as Error, 'storage');
      throw error;
    }
  }
  
  /**
   * Vide complètement la table des pièces
   */
  async clearRooms(): Promise<void> {
    try {
      await this.rooms.clear();
      logService.info('Table des pièces vidée dans IndexedDB', 'storage');
    } catch (error) {
      logService.error('Erreur lors du vidage de la table des pièces dans IndexedDB', error as Error, 'storage');
      throw error;
    }
  }
  
  /**
   * Synchronise les pièces entre localStorage et IndexedDB
   */
  async syncRoomsFromLocalStorage(rooms: Room[]): Promise<void> {
    try {
      const existingRooms = await this.rooms.toArray();
      const existingIds = new Set(existingRooms.map(room => room.id));
      
      await this.transaction('rw', this.rooms, async () => {
        for (const room of rooms) {
          if (existingIds.has(room.id)) {
            await this.rooms.update(room.id, room);
          } else {
            await this.rooms.add(room);
          }
        }
        
        const localStorageIds = new Set(rooms.map(room => room.id));
        for (const existingRoom of existingRooms) {
          if (!localStorageIds.has(existingRoom.id)) {
            await this.rooms.delete(existingRoom.id);
          }
        }
      });
      
      logService.info('Synchronisation des pièces depuis localStorage vers IndexedDB', 'storage', {
        roomCount: rooms.length
      });
    } catch (error) {
      logService.error('Erreur lors de la synchronisation des pièces depuis localStorage', error as Error, 'storage');
      throw error;
    }
  }

  /**
   * Récupère tous les travaux
   */
  async getAllTravaux(): Promise<Travail[]> {
    try {
      const travaux = await this.travaux.toArray();
      logService.debug(`${travaux.length} travaux récupérés depuis IndexedDB`, 'storage');
      return travaux;
    } catch (error) {
      logService.error('Erreur lors de la récupération des travaux depuis IndexedDB', error as Error, 'storage');
      throw error;
    }
  }
  
  /**
   * Ajoute un travail
   */
  async addTravail(travail: Travail): Promise<string> {
    try {
      const id = await this.travaux.add(travail);
      logService.info('Travail ajouté à IndexedDB', 'storage', { travailId: id });
      return id as string;
    } catch (error) {
      logService.error('Erreur lors de l\'ajout d\'un travail dans IndexedDB', error as Error, 'storage');
      throw error;
    }
  }
  
  /**
   * Met à jour un travail
   */
  async updateTravail(id: string, travail: Travail): Promise<void> {
    try {
      await this.travaux.update(id, travail);
      logService.info('Travail mis à jour dans IndexedDB', 'storage', { travailId: id });
    } catch (error) {
      logService.error('Erreur lors de la mise à jour d\'un travail dans IndexedDB', error as Error, 'storage');
      throw error;
    }
  }
  
  /**
   * Supprime un travail
   */
  async deleteTravail(id: string): Promise<void> {
    try {
      await this.travaux.delete(id);
      logService.info('Travail supprimé d\'IndexedDB', 'storage', { travailId: id });
    } catch (error) {
      logService.error('Erreur lors de la suppression d\'un travail d\'IndexedDB', error as Error, 'storage');
      throw error;
    }
  }
  
  /**
   * Vide complètement la table des travaux
   */
  async clearTravaux(): Promise<void> {
    try {
      await this.travaux.clear();
      logService.info('Table des travaux vidée dans IndexedDB', 'storage');
    } catch (error) {
      logService.error('Erreur lors du vidage de la table des travaux dans IndexedDB', error as Error, 'storage');
      throw error;
    }
  }
  
  /**
   * Synchronise les travaux entre localStorage et IndexedDB
   */
  async syncTravauxFromLocalStorage(travaux: Travail[]): Promise<void> {
    try {
      const existingTravaux = await this.travaux.toArray();
      const existingIds = new Set(existingTravaux.map(travail => travail.id));
      
      await this.transaction('rw', this.travaux, async () => {
        for (const travail of travaux) {
          if (existingIds.has(travail.id)) {
            await this.travaux.update(travail.id, travail);
          } else {
            await this.travaux.add(travail);
          }
        }
        
        const localStorageIds = new Set(travaux.map(travail => travail.id));
        for (const existingTravail of existingTravaux) {
          if (!localStorageIds.has(existingTravail.id)) {
            await this.travaux.delete(existingTravail.id);
          }
        }
      });
      
      logService.info('Synchronisation des travaux depuis localStorage vers IndexedDB', 'storage', {
        travauxCount: travaux.length
      });
    } catch (error) {
      logService.error('Erreur lors de la synchronisation des travaux depuis localStorage', error as Error, 'storage');
      throw error;
    }
  }

  /**
   * Récupère tous les projets chantier
   */
  async getAllProjets(): Promise<ProjetChantier[]> {
    try {
      const projets = await this.projets.toArray();
      logService.debug(`${projets.length} projets récupérés depuis IndexedDB`, 'storage');
      return projets;
    } catch (error) {
      logService.error('Erreur lors de la récupération des projets depuis IndexedDB', error as Error, 'storage');
      throw error;
    }
  }
  
  /**
   * Ajoute un projet chantier
   */
  async addProjet(projet: ProjetChantier): Promise<string> {
    try {
      const id = await this.projets.add(projet);
      logService.info('Projet ajouté à IndexedDB', 'storage', { projetId: id });
      return id as string;
    } catch (error) {
      logService.error('Erreur lors de l\'ajout d\'un projet dans IndexedDB', error as Error, 'storage');
      throw error;
    }
  }
  
  /**
   * Met à jour un projet chantier
   */
  async updateProjet(id: string, projet: ProjetChantier): Promise<void> {
    try {
      await this.projets.update(id, projet);
      logService.info('Projet mis à jour dans IndexedDB', 'storage', { projetId: id });
    } catch (error) {
      logService.error('Erreur lors de la mise à jour d\'un projet dans IndexedDB', error as Error, 'storage');
      throw error;
    }
  }
  
  /**
   * Supprime un projet chantier
   */
  async deleteProjet(id: string): Promise<void> {
    try {
      await this.projets.delete(id);
      logService.info('Projet supprimé d\'IndexedDB', 'storage', { projetId: id });
    } catch (error) {
      logService.error('Erreur lors de la suppression d\'un projet d\'IndexedDB', error as Error, 'storage');
      throw error;
    }
  }
  
  /**
   * Synchronise les projets chantier entre localStorage et IndexedDB
   */
  async syncProjetsFromLocalStorage(projets: ProjetChantier[]): Promise<void> {
    try {
      const existingProjets = await this.projets.toArray();
      const existingIds = new Set(existingProjets.map(projet => projet.id));
      
      await this.transaction('rw', this.projets, async () => {
        for (const projet of projets) {
          if (existingIds.has(projet.id)) {
            await this.projets.update(projet.id, projet);
          } else {
            await this.projets.add(projet);
          }
        }
        
        const localStorageIds = new Set(projets.map(projet => projet.id));
        for (const existingProjet of existingProjets) {
          if (!localStorageIds.has(existingProjet.id)) {
            await this.projets.delete(existingProjet.id);
          }
        }
      });
      
      logService.info('Synchronisation des projets depuis localStorage vers IndexedDB', 'storage', {
        projetCount: projets.length
      });
    } catch (error) {
      logService.error('Erreur lors de la synchronisation des projets depuis localStorage', error as Error, 'storage');
      throw error;
    }
  }

  /**
   * Sauvegarde ou met à jour les propriétés du bien
   */
  async savePropertyInfo(property: PropertyType): Promise<void> {
    try {
      const uniqueId = "property-singleton";
      const propertyWithId = { ...property, id: uniqueId };
      
      const exists = await this.propertyInfo.get(uniqueId);
      if (exists) {
        await this.propertyInfo.update(uniqueId, propertyWithId);
        logService.info('Propriétés du bien mises à jour dans IndexedDB', 'storage');
      } else {
        await this.propertyInfo.add(propertyWithId);
        logService.info('Propriétés du bien ajoutées à IndexedDB', 'storage');
      }
    } catch (error) {
      logService.error('Erreur lors de la sauvegarde des propriétés du bien dans IndexedDB', error as Error, 'storage');
      throw error;
    }
  }
  
  /**
   * Récupère les propriétés du bien
   */
  async getPropertyInfo(): Promise<PropertyType | null> {
    try {
      const uniqueId = "property-singleton";
      const property = await this.propertyInfo.get(uniqueId);
      if (property) {
        const { id, ...propertyWithoutId } = property;
        return propertyWithoutId;
      }
      return null;
    } catch (error) {
      logService.error('Erreur lors de la récupération des propriétés du bien depuis IndexedDB', error as Error, 'storage');
      throw error;
    }
  }
  
  /**
   * Synchronise les propriétés du bien entre localStorage et IndexedDB
   */
  async syncPropertyFromLocalStorage(property: PropertyType): Promise<void> {
    try {
      await this.savePropertyInfo(property);
      logService.info('Synchronisation des propriétés du bien depuis localStorage vers IndexedDB', 'storage');
    } catch (error) {
      logService.error('Erreur lors de la synchronisation des propriétés du bien depuis localStorage', error as Error, 'storage');
      throw error;
    }
  }

  /**
   * Vérifie si la base de données est accessible
   */
  async isAvailable(): Promise<boolean> {
    try {
      await this.open();
      return true;
    } catch (error) {
      logService.error('IndexedDB n\'est pas disponible dans ce navigateur', error as Error, 'system');
      return false;
    }
  }
}

// Instance unique du service de base de données
const db = new AppDatabase();

export default db;
