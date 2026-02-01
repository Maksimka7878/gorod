/**
 * Service Worker Diagnostics Utility
 * For debugging SW issues in production
 */

export interface SWDiagnostics {
    isSupported: boolean;
    isRegistered: boolean;
    registrationState: 'installing' | 'waiting' | 'active' | null;
    controllerState: string | null;
    notificationPermission: NotificationPermission | 'not-supported';
    pushSubscription: boolean;
    isOnline: boolean;
    isStandalone: boolean;
    cacheNames: string[];
    userAgent: string;
    timestamp: string;
}

/**
 * Get comprehensive SW diagnostics
 */
export async function getSWDiagnostics(): Promise<SWDiagnostics> {
    const diagnostics: SWDiagnostics = {
        isSupported: 'serviceWorker' in navigator,
        isRegistered: false,
        registrationState: null,
        controllerState: null,
        notificationPermission: 'Notification' in window ? Notification.permission : 'not-supported',
        pushSubscription: false,
        isOnline: navigator.onLine,
        isStandalone: window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone === true,
        cacheNames: [],
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString(),
    };

    if (!diagnostics.isSupported) {
        return diagnostics;
    }

    try {
        const registration = await navigator.serviceWorker.getRegistration();

        if (registration) {
            diagnostics.isRegistered = true;

            if (registration.installing) {
                diagnostics.registrationState = 'installing';
            } else if (registration.waiting) {
                diagnostics.registrationState = 'waiting';
            } else if (registration.active) {
                diagnostics.registrationState = 'active';
            }

            // Check push subscription
            try {
                const subscription = await registration.pushManager.getSubscription();
                diagnostics.pushSubscription = !!subscription;
            } catch {
                // Push not supported or blocked
            }
        }

        // Get controller state
        if (navigator.serviceWorker.controller) {
            diagnostics.controllerState = navigator.serviceWorker.controller.state;
        }

        // Get cache names
        if ('caches' in window) {
            diagnostics.cacheNames = await caches.keys();
        }
    } catch (error) {
        console.error('[SWDiagnostics] Error:', error);
    }

    return diagnostics;
}

/**
 * Format diagnostics for display
 */
export function formatDiagnostics(diagnostics: SWDiagnostics): string {
    return `
=== Service Worker Diagnostics ===
Timestamp: ${diagnostics.timestamp}

Browser Support:
  SW Supported: ${diagnostics.isSupported ? '✅' : '❌'}
  Notifications: ${diagnostics.notificationPermission === 'granted' ? '✅' : diagnostics.notificationPermission === 'denied' ? '❌' : '⏳'}
  Online: ${diagnostics.isOnline ? '✅' : '❌'}
  Standalone: ${diagnostics.isStandalone ? '✅' : '❌'}

Service Worker:
  Registered: ${diagnostics.isRegistered ? '✅' : '❌'}
  State: ${diagnostics.registrationState || 'N/A'}
  Controller: ${diagnostics.controllerState || 'N/A'}
  Push Sub: ${diagnostics.pushSubscription ? '✅' : '❌'}

Caches:
${diagnostics.cacheNames.map(name => `  - ${name}`).join('\n') || '  None'}

User Agent:
  ${diagnostics.userAgent}
`.trim();
}

/**
 * Log diagnostics to console with formatting
 */
export async function logDiagnostics(): Promise<void> {
    const diagnostics = await getSWDiagnostics();
    console.log(formatDiagnostics(diagnostics));
    return;
}

/**
 * Check if SW needs update
 */
export async function checkForUpdate(): Promise<boolean> {
    if (!('serviceWorker' in navigator)) return false;

    try {
        const registration = await navigator.serviceWorker.getRegistration();
        if (registration) {
            await registration.update();
            return !!registration.waiting;
        }
    } catch (error) {
        console.error('[SWDiagnostics] Update check failed:', error);
    }
    return false;
}

/**
 * Clear all caches
 */
export async function clearAllCaches(): Promise<void> {
    if (!('caches' in window)) return;

    const names = await caches.keys();
    await Promise.all(names.map(name => caches.delete(name)));
    console.log('[SWDiagnostics] All caches cleared');
}
