
import Dexie, { Table } from 'dexie';
import { Client } from '@/types';
import logService from './logService';

/**
 * Service de base de données utilisant Dexie.js pour interfacer avec IndexedDB
 */
class AppDatabase extends Dexie {
  // Définition des tables
  clients!: Table<Client, string>;

  constructor() {
    super('RenovationAppDB');
    
    // Définition du schéma de la base de données
    this.version(1).stores({
      clients: 'id, nom, prenom, typeClient' // Clé primaire + index
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
      // Récupérer les clients actuels dans IndexedDB
      const existingClients = await this.clients.toArray();
      const existingIds = new Set(existingClients.map(c => c.id));
      
      // Transaction pour toutes les opérations
      await this.transaction('rw', this.clients, async () => {
        // Ajouter ou mettre à jour les clients de localStorage
        for (const client of clients) {
          if (existingIds.has(client.id)) {
            await this.clients.update(client.id, client);
          } else {
            await this.clients.add(client);
          }
        }
        
        // Supprimer les clients qui ne sont plus dans localStorage
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
