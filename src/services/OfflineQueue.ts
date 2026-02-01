/**
 * Offline Queue - IndexedDB-based queue for offline operations
 */

import { openDB } from 'idb';
import type { DBSchema, IDBPDatabase } from 'idb';

interface QueueItem {
    id?: number;
    type: string;
    data: any;
    timestamp: number;
    retries?: number;
}

interface OfflineQueueDB extends DBSchema {
    queue: {
        key: number;
        value: QueueItem;
        indexes: { 'by-type': string; 'by-timestamp': number };
    };
}

class OfflineQueueClass {
    private static instance: OfflineQueueClass;
    private db: IDBPDatabase<OfflineQueueDB> | null = null;
    private dbName = 'offline-queue';
    private dbVersion = 1;

    private constructor() {
        this.init();
    }

    static getInstance(): OfflineQueueClass {
        if (!OfflineQueueClass.instance) {
            OfflineQueueClass.instance = new OfflineQueueClass();
        }
        return OfflineQueueClass.instance;
    }

    private async init(): Promise<void> {
        try {
            this.db = await openDB<OfflineQueueDB>(this.dbName, this.dbVersion, {
                upgrade(db) {
                    const store = db.createObjectStore('queue', {
                        keyPath: 'id',
                        autoIncrement: true,
                    });
                    store.createIndex('by-type', 'type');
                    store.createIndex('by-timestamp', 'timestamp');
                },
            });
            console.log('[OfflineQueue] Initialized');
        } catch (error) {
            console.error('[OfflineQueue] Failed to initialize:', error);
        }
    }

    /**
     * Add item to queue
     */
    async add(item: Omit<QueueItem, 'id'>): Promise<number | null> {
        if (!this.db) {
            await this.init();
        }
        if (!this.db) return null;

        try {
            const id = await this.db.add('queue', {
                ...item,
                retries: 0,
            } as QueueItem);
            console.log('[OfflineQueue] Added item:', id);
            return id;
        } catch (error) {
            console.error('[OfflineQueue] Failed to add item:', error);
            return null;
        }
    }

    /**
     * Get all items from queue
     */
    async getAll(): Promise<QueueItem[]> {
        if (!this.db) {
            await this.init();
        }
        if (!this.db) return [];

        try {
            return await this.db.getAll('queue');
        } catch (error) {
            console.error('[OfflineQueue] Failed to get items:', error);
            return [];
        }
    }

    /**
     * Get items by type
     */
    async getByType(type: string): Promise<QueueItem[]> {
        if (!this.db) {
            await this.init();
        }
        if (!this.db) return [];

        try {
            return await this.db.getAllFromIndex('queue', 'by-type', type);
        } catch (error) {
            console.error('[OfflineQueue] Failed to get items by type:', error);
            return [];
        }
    }

    /**
     * Remove item from queue
     */
    async remove(id: number): Promise<void> {
        if (!this.db) {
            await this.init();
        }
        if (!this.db) return;

        try {
            await this.db.delete('queue', id);
            console.log('[OfflineQueue] Removed item:', id);
        } catch (error) {
            console.error('[OfflineQueue] Failed to remove item:', error);
        }
    }

    /**
     * Clear all items from queue
     */
    async clear(): Promise<void> {
        if (!this.db) {
            await this.init();
        }
        if (!this.db) return;

        try {
            await this.db.clear('queue');
            console.log('[OfflineQueue] Cleared');
        } catch (error) {
            console.error('[OfflineQueue] Failed to clear:', error);
        }
    }

    /**
     * Get queue count
     */
    async count(): Promise<number> {
        if (!this.db) {
            await this.init();
        }
        if (!this.db) return 0;

        try {
            return await this.db.count('queue');
        } catch (error) {
            console.error('[OfflineQueue] Failed to count:', error);
            return 0;
        }
    }

    /**
     * Increment retry count for an item
     */
    async incrementRetry(id: number): Promise<void> {
        if (!this.db) return;

        try {
            const item = await this.db.get('queue', id);
            if (item) {
                item.retries = (item.retries || 0) + 1;
                await this.db.put('queue', item);
            }
        } catch (error) {
            console.error('[OfflineQueue] Failed to increment retry:', error);
        }
    }
}

export const offlineQueue = OfflineQueueClass.getInstance();
