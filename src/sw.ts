/// <reference lib="webworker" />
import { clientsClaim } from 'workbox-core';
import { precacheAndRoute, cleanupOutdatedCaches } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { CacheFirst, NetworkFirst, StaleWhileRevalidate } from 'workbox-strategies';
import { ExpirationPlugin } from 'workbox-expiration';
import { CacheableResponsePlugin } from 'workbox-cacheable-response';

declare let self: ServiceWorkerGlobalScope;

// Take control immediately
clientsClaim();

// Clean old caches
cleanupOutdatedCaches();

// Precache static assets (injected by vite-plugin-pwa)
precacheAndRoute(self.__WB_MANIFEST);

// ===========================================
// CACHING STRATEGIES
// ===========================================

// 1. Images: CacheFirst with 30-day expiration
registerRoute(
    ({ request }) => request.destination === 'image',
    new CacheFirst({
        cacheName: 'images-cache',
        plugins: [
            new CacheableResponsePlugin({ statuses: [0, 200] }),
            new ExpirationPlugin({
                maxEntries: 100,
                maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
            }),
        ],
    })
);

// 2. Google Fonts: StaleWhileRevalidate
registerRoute(
    ({ url }) => url.origin === 'https://fonts.googleapis.com' || url.origin === 'https://fonts.gstatic.com',
    new StaleWhileRevalidate({
        cacheName: 'google-fonts-cache',
        plugins: [
            new CacheableResponsePlugin({ statuses: [0, 200] }),
            new ExpirationPlugin({
                maxEntries: 30,
                maxAgeSeconds: 365 * 24 * 60 * 60, // 1 year
            }),
        ],
    })
);

// 3. API calls: NetworkFirst with cache fallback
registerRoute(
    ({ url }) => url.pathname.startsWith('/api'),
    new NetworkFirst({
        cacheName: 'api-cache',
        networkTimeoutSeconds: 10,
        plugins: [
            new CacheableResponsePlugin({ statuses: [0, 200] }),
            new ExpirationPlugin({
                maxEntries: 50,
                maxAgeSeconds: 24 * 60 * 60, // 1 day
            }),
        ],
    })
);

// 4. JS/CSS: StaleWhileRevalidate
registerRoute(
    ({ request }) => request.destination === 'script' || request.destination === 'style',
    new StaleWhileRevalidate({
        cacheName: 'static-resources',
        plugins: [
            new CacheableResponsePlugin({ statuses: [0, 200] }),
        ],
    })
);

// ===========================================
// PUSH NOTIFICATIONS
// ===========================================

self.addEventListener('push', (event) => {
    if (!event.data) return;

    const data = event.data.json();
    const options: NotificationOptions = {
        body: data.body || 'Новое уведомление',
        icon: '/pwa-192x192.png',
        badge: '/pwa-192x192.png',
        data: {
            dateOfArrival: Date.now(),
            url: data.url || '/',
        },
    };

    event.waitUntil(
        self.registration.showNotification(data.title || 'Читай-город', options)
    );
});

// Handle notification click
self.addEventListener('notificationclick', (event) => {
    event.notification.close();

    const url = event.notification.data?.url || '/';

    event.waitUntil(
        self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
            // If a window is already open, focus it
            for (const client of clientList) {
                if (client.url === url && 'focus' in client) {
                    return client.focus();
                }
            }
            // Otherwise, open a new window
            if (self.clients.openWindow) {
                return self.clients.openWindow(url);
            }
        })
    );
});

// ===========================================
// BROADCAST CHANNEL (Cross-tab communication)
// ===========================================

const broadcastChannel = new BroadcastChannel('store-broadcast');

self.addEventListener('message', (event) => {
    if (event.data?.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }

    // Forward broadcast messages to all clients
    if (event.data?.type === 'BROADCAST') {
        broadcastChannel.postMessage(event.data.payload);
    }
});

// Log SW activation
self.addEventListener('activate', (event) => {
    console.log('[SW] Service Worker activated');
    event.waitUntil(self.clients.claim());
});

console.log('[SW] Custom Service Worker loaded');
