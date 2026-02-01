import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Share, Plus, Smartphone } from 'lucide-react';
import { isIOSSafari, isStandalone } from '@/registerSW';

interface InstallPromptModalProps {
    onClose: () => void;
}

export default function InstallPromptModal({ onClose }: InstallPromptModalProps) {
    const [step, setStep] = useState(1);

    const steps = [
        {
            icon: <Share className="w-8 h-8 text-[#007AFF]" />,
            title: 'Нажмите "Поделиться"',
            description: 'Найдите иконку в нижней панели Safari',
        },
        {
            icon: <Plus className="w-8 h-8 text-[#26C6DA]" />,
            title: 'Добавить на главный экран',
            description: 'Прокрутите вниз и выберите эту опцию',
        },
        {
            icon: <Smartphone className="w-8 h-8 text-[#34C759]" />,
            title: 'Нажмите "Добавить"',
            description: 'Приложение появится на вашем экране',
        },
    ];

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-4"
            onClick={onClose}
        >
            <motion.div
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 100, opacity: 0 }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="relative bg-gradient-to-r from-[#26C6DA] to-[#00ACC1] p-6 text-white">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                    <div className="flex items-center gap-4">
                        <img
                            src="/pwa-192x192.png"
                            alt="App Icon"
                            className="w-16 h-16 rounded-2xl shadow-lg"
                        />
                        <div>
                            <h2 className="text-xl font-bold">Установите приложение</h2>
                            <p className="text-white/80 text-sm mt-1">
                                Добавьте Читай-город на главный экран
                            </p>
                        </div>
                    </div>
                </div>

                {/* Steps */}
                <div className="p-6 space-y-4">
                    {steps.map((s, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className={`flex items-start gap-4 p-4 rounded-xl transition-colors ${step === index + 1 ? 'bg-[#26C6DA]/10' : 'bg-gray-50'
                                }`}
                            onClick={() => setStep(index + 1)}
                        >
                            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-white shadow-md flex items-center justify-center">
                                {s.icon}
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center gap-2">
                                    <span className="w-6 h-6 rounded-full bg-[#26C6DA] text-white text-sm font-bold flex items-center justify-center">
                                        {index + 1}
                                    </span>
                                    <h3 className="font-semibold text-gray-900">{s.title}</h3>
                                </div>
                                <p className="text-gray-600 text-sm mt-1 ml-8">{s.description}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Footer */}
                <div className="p-4 bg-gray-50 border-t">
                    <button
                        onClick={onClose}
                        className="w-full py-3 rounded-xl bg-[#26C6DA] text-white font-semibold hover:bg-[#00ACC1] transition-colors"
                    >
                        Понятно
                    </button>
                    <p className="text-center text-gray-500 text-xs mt-3">
                        Больше не показывать
                    </p>
                </div>
            </motion.div>
        </motion.div>
    );
}

/**
 * Hook to manage install prompt visibility
 */
export function useInstallPrompt() {
    const [showPrompt, setShowPrompt] = useState(false);
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

    useEffect(() => {
        // Check if already dismissed
        const dismissed = localStorage.getItem('install-prompt-dismissed');
        if (dismissed) return;

        // For iOS Safari, show custom prompt
        if (isIOSSafari() && !isStandalone()) {
            // Delay showing the prompt
            const timer = setTimeout(() => setShowPrompt(true), 3000);
            return () => clearTimeout(timer);
        }

        // For other browsers, listen for beforeinstallprompt
        const handleBeforeInstall = (e: Event) => {
            e.preventDefault();
            setDeferredPrompt(e);
            setTimeout(() => setShowPrompt(true), 3000);
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstall);
        return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    }, []);

    const dismiss = () => {
        setShowPrompt(false);
        localStorage.setItem('install-prompt-dismissed', 'true');
    };

    const install = async () => {
        if (!deferredPrompt) return;

        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        console.log('[Install] User choice:', outcome);

        setDeferredPrompt(null);
        setShowPrompt(false);
    };

    return { showPrompt, isIOS: isIOSSafari(), dismiss, install };
}
