/**
 * Manual Service Worker Registration
 * Handles iOS-specific quirks and provides update management
 */

interface SWRegistrationOptions {
    onRegistered?: (registration: ServiceWorkerRegistration) => void;
    onUpdateFound?: () => void;
    onOfflineReady?: () => void;
    onNeedRefresh?: () => void;
}

let registration: ServiceWorkerRegistration | null = null;

/**
 * Detect iOS Safari
 */
export function isIOSSafari(): boolean {
    const ua = navigator.userAgent;
    const isIOS = /iPad|iPhone|iPod/.test(ua);
    const isWebkit = /WebKit/.test(ua);
    const isNotChrome = !/CriOS/.test(ua);
    const isNotFirefox = !/FxiOS/.test(ua);
    return isIOS && isWebkit && isNotChrome && isNotFirefox;
}

/**
 * Check if running as installed PWA (standalone mode)
 */
export function isStandalone(): boolean {
    return (
        window.matchMedia('(display-mode: standalone)').matches ||
        (window.navigator as any).standalone === true
    );
}

/**
 * Register Service Worker with iOS fixes
 */
export async function registerSW(options: SWRegistrationOptions = {}): Promise<ServiceWorkerRegistration | null> {
    if (!('serviceWorker' in navigator)) {
        console.warn('[SW] Service Workers not supported');
        return null;
    }

    try {
        registration = await navigator.serviceWorker.register('/sw.js', {
            scope: '/',
        });

        console.log('[SW] Registered with scope:', registration.scope);
        options.onRegistered?.(registration);

        // Handle updates
        registration.addEventListener('updatefound', () => {
            console.log('[SW] Update found');
            options.onUpdateFound?.();

            const newWorker = registration?.installing;
            if (newWorker) {
                newWorker.addEventListener('statechange', () => {
                    if (newWorker.state === 'installed') {
                        if (navigator.serviceWorker.controller) {
                            // New update available
                            options.onNeedRefresh?.();
                        } else {
                            // First install, offline ready
                            options.onOfflineReady?.();
                        }
                    }
                });
            }
        });

        // iOS Fix: Force SW update when page regains focus
        // iOS often "kills" the SW after a period of inactivity
        if (isIOSSafari()) {
            document.addEventListener('visibilitychange', () => {
                if (document.visibilityState === 'visible' && registration) {
                    registration.update().catch(console.error);
                }
            });

            // Also check on page focus
            window.addEventListener('focus', () => {
                if (registration) {
                    registration.update().catch(console.error);
                }
            });
        }

        return registration;
    } catch (error) {
        console.error('[SW] Registration failed:', error);
        return null;
    }
}

/**
 * Skip waiting and activate new SW immediately
 */
export function skipWaiting(): void {
    if (registration?.waiting) {
        registration.waiting.postMessage({ type: 'SKIP_WAITING' });
    }
}

/**
 * Get current SW registration
 */
export function getRegistration(): ServiceWorkerRegistration | null {
    return registration;
}

/**
 * Unregister all Service Workers (for debugging)
 */
export async function unregisterAll(): Promise<void> {
    const registrations = await navigator.serviceWorker.getRegistrations();
    for (const reg of registrations) {
        await reg.unregister();
    }
    console.log('[SW] All Service Workers unregistered');
}
