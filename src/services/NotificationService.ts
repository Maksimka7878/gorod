/**
 * Notification Service - Singleton for managing push notifications
 */

import { offlineQueue } from './OfflineQueue';

export interface NotificationData {
    title: string;
    body?: string;
    icon?: string;
    url?: string;
    tag?: string;
}

class NotificationServiceClass {
    private static instance: NotificationServiceClass;

    private constructor() {
        // Listen for online event to flush queue
        window.addEventListener('online', () => this.flushQueue());
    }

    static getInstance(): NotificationServiceClass {
        if (!NotificationServiceClass.instance) {
            NotificationServiceClass.instance = new NotificationServiceClass();
        }
        return NotificationServiceClass.instance;
    }

    /**
     * Check if notifications are supported
     */
    isSupported(): boolean {
        return 'Notification' in window && 'serviceWorker' in navigator;
    }

    /**
     * Get current permission status
     */
    getPermission(): NotificationPermission {
        if (!this.isSupported()) return 'denied';
        return Notification.permission;
    }

    /**
     * Request notification permission
     */
    async requestPermission(): Promise<NotificationPermission> {
        if (!this.isSupported()) {
            console.warn('[Notification] Not supported in this browser');
            return 'denied';
        }

        if (Notification.permission === 'granted') {
            return 'granted';
        }

        try {
            const result = await Notification.requestPermission();
            console.log('[Notification] Permission result:', result);
            return result;
        } catch (error) {
            console.error('[Notification] Permission request failed:', error);
            return 'denied';
        }
    }

    /**
     * Show a notification
     */
    async show(data: NotificationData): Promise<void> {
        // If offline, queue the notification
        if (!navigator.onLine) {
            console.log('[Notification] Offline, queuing notification');
            await offlineQueue.add({
                type: 'notification',
                data,
                timestamp: Date.now(),
            });
            return;
        }

        // Check permission
        if (Notification.permission !== 'granted') {
            console.warn('[Notification] Permission not granted');
            return;
        }

        try {
            const registration = await navigator.serviceWorker.ready;
            await registration.showNotification(data.title, {
                body: data.body,
                icon: data.icon || '/pwa-192x192.png',
                badge: '/pwa-192x192.png',
                tag: data.tag,
                data: { url: data.url || '/' },
            });
            console.log('[Notification] Shown:', data.title);
        } catch (error) {
            console.error('[Notification] Failed to show:', error);
        }
    }

    /**
     * Show a local notification (without SW)
     */
    showLocal(data: NotificationData): void {
        if (Notification.permission !== 'granted') return;

        const notification = new Notification(data.title, {
            body: data.body,
            icon: data.icon || '/pwa-192x192.png',
            tag: data.tag,
        });

        notification.onclick = () => {
            window.focus();
            if (data.url) {
                window.location.href = data.url;
            }
            notification.close();
        };
    }

    /**
     * Flush queued notifications
     */
    private async flushQueue(): Promise<void> {
        console.log('[Notification] Back online, flushing queue');
        const items = await offlineQueue.getAll();

        for (const item of items) {
            if (item.type === 'notification') {
                await this.show(item.data as NotificationData);
                await offlineQueue.remove(item.id!);
            }
        }
    }
}

export const NotificationService = NotificationServiceClass.getInstance();
