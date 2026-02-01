/**
 * Broadcast Service - Cross-tab communication
 */

export interface BroadcastMessage {
    type: string;
    payload?: any;
    timestamp?: number;
}

type MessageHandler = (message: BroadcastMessage) => void;

class BroadcastServiceClass {
    private static instance: BroadcastServiceClass;
    private channel: BroadcastChannel | null = null;
    private handlers: Map<string, Set<MessageHandler>> = new Map();

    private constructor() {
        this.init();
    }

    static getInstance(): BroadcastServiceClass {
        if (!BroadcastServiceClass.instance) {
            BroadcastServiceClass.instance = new BroadcastServiceClass();
        }
        return BroadcastServiceClass.instance;
    }

    private init(): void {
        if (!('BroadcastChannel' in window)) {
            console.warn('[Broadcast] BroadcastChannel not supported');
            return;
        }

        this.channel = new BroadcastChannel('store-broadcast');

        this.channel.onmessage = (event: MessageEvent<BroadcastMessage>) => {
            const message = event.data;
            console.log('[Broadcast] Received:', message);

            // Call type-specific handlers
            const typeHandlers = this.handlers.get(message.type);
            if (typeHandlers) {
                typeHandlers.forEach((handler) => handler(message));
            }

            // Call wildcard handlers
            const allHandlers = this.handlers.get('*');
            if (allHandlers) {
                allHandlers.forEach((handler) => handler(message));
            }
        };

        this.channel.onmessageerror = (event) => {
            console.error('[Broadcast] Message error:', event);
        };
    }

    /**
     * Check if BroadcastChannel is supported
     */
    isSupported(): boolean {
        return 'BroadcastChannel' in window;
    }

    /**
     * Send a message to all tabs/windows
     */
    send(message: BroadcastMessage): void {
        if (!this.channel) {
            console.warn('[Broadcast] Channel not available');
            return;
        }

        const enrichedMessage: BroadcastMessage = {
            ...message,
            timestamp: Date.now(),
        };

        this.channel.postMessage(enrichedMessage);
        console.log('[Broadcast] Sent:', enrichedMessage);
    }

    /**
     * Subscribe to messages of a specific type
     * Use '*' to subscribe to all messages
     */
    on(type: string, handler: MessageHandler): () => void {
        if (!this.handlers.has(type)) {
            this.handlers.set(type, new Set());
        }
        this.handlers.get(type)!.add(handler);

        // Return unsubscribe function
        return () => {
            this.handlers.get(type)?.delete(handler);
        };
    }

    /**
     * Unsubscribe from messages
     */
    off(type: string, handler: MessageHandler): void {
        this.handlers.get(type)?.delete(handler);
    }

    /**
     * Close the channel
     */
    close(): void {
        this.channel?.close();
        this.channel = null;
        this.handlers.clear();
    }
}

// Predefined message types
export const BROADCAST_TYPES = {
    CART_UPDATE: 'CART_UPDATE',
    USER_LOGIN: 'USER_LOGIN',
    USER_LOGOUT: 'USER_LOGOUT',
    NOTIFICATION: 'NOTIFICATION',
    PRODUCT_UPDATE: 'PRODUCT_UPDATE',
    THEME_CHANGE: 'THEME_CHANGE',
} as const;

export const BroadcastService = BroadcastServiceClass.getInstance();
