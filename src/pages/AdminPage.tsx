import { useState, useEffect } from 'react';
import {
    Bell,
    Send,
    RefreshCw,
    Trash2,
    CheckCircle,
    XCircle,
    Wifi,
    WifiOff,
    Smartphone,
    Settings,
    Package
} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { NotificationService } from '@/services/NotificationService';
import { BroadcastService, BROADCAST_TYPES } from '@/services/BroadcastService';
import { getSWDiagnostics, clearAllCaches } from '@/utils/swDiagnostics';
import type { SWDiagnostics } from '@/utils/swDiagnostics';
import { newBooks } from '@/data/books';

export default function AdminPage() {
    const [activeTab, setActiveTab] = useState<'notifications' | 'diagnostics' | 'products'>('notifications');
    const [diagnostics, setDiagnostics] = useState<SWDiagnostics | null>(null);
    const [notificationTitle, setNotificationTitle] = useState('');
    const [notificationBody, setNotificationBody] = useState('');
    const [permissionStatus, setPermissionStatus] = useState<NotificationPermission>('default');
    const [isOnline, setIsOnline] = useState(navigator.onLine);

    useEffect(() => {
        // Get initial diagnostics
        getSWDiagnostics().then(setDiagnostics);
        setPermissionStatus(NotificationService.getPermission());

        // Listen for online/offline
        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);
        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    const refreshDiagnostics = async () => {
        const diag = await getSWDiagnostics();
        setDiagnostics(diag);
    };

    const requestPermission = async () => {
        const result = await NotificationService.requestPermission();
        setPermissionStatus(result);
    };

    const sendNotification = async () => {
        if (!notificationTitle) return;

        await NotificationService.show({
            title: notificationTitle,
            body: notificationBody,
            url: '/',
        });

        // Also broadcast to other tabs
        BroadcastService.send({
            type: BROADCAST_TYPES.NOTIFICATION,
            payload: { title: notificationTitle, body: notificationBody },
        });

        setNotificationTitle('');
        setNotificationBody('');
    };

    const tabs = [
        { id: 'notifications', label: 'Уведомления', icon: Bell },
        { id: 'diagnostics', label: 'Диагностика', icon: Settings },
        { id: 'products', label: 'Товары', icon: Package },
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            <main className="container-cg py-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-6">Админ-панель</h1>

                {/* Tabs */}
                <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as 'notifications' | 'diagnostics' | 'products')}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${activeTab === tab.id
                                    ? 'bg-[#26C6DA] text-white'
                                    : 'bg-white text-gray-600 hover:bg-gray-100'
                                }`}
                        >
                            <tab.icon className="w-4 h-4" />
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Content */}
                <div className="bg-white rounded-2xl shadow-sm p-6">
                    {activeTab === 'notifications' && (
                        <div className="space-y-6">
                            <h2 className="text-xl font-semibold flex items-center gap-2">
                                <Bell className="w-5 h-5 text-[#26C6DA]" />
                                Push-уведомления
                            </h2>

                            {/* Permission Status */}
                            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                                <div className="flex items-center gap-2">
                                    {permissionStatus === 'granted' ? (
                                        <CheckCircle className="w-5 h-5 text-green-500" />
                                    ) : permissionStatus === 'denied' ? (
                                        <XCircle className="w-5 h-5 text-red-500" />
                                    ) : (
                                        <Bell className="w-5 h-5 text-yellow-500" />
                                    )}
                                    <span className="font-medium">
                                        Статус: {permissionStatus === 'granted' ? 'Разрешено' : permissionStatus === 'denied' ? 'Заблокировано' : 'Не запрошено'}
                                    </span>
                                </div>
                                {permissionStatus !== 'granted' && (
                                    <button
                                        onClick={requestPermission}
                                        className="px-4 py-2 bg-[#26C6DA] text-white rounded-lg hover:bg-[#00ACC1] transition-colors"
                                    >
                                        Запросить разрешение
                                    </button>
                                )}
                            </div>

                            {/* Send Notification Form */}
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Заголовок
                                    </label>
                                    <input
                                        type="text"
                                        value={notificationTitle}
                                        onChange={(e) => setNotificationTitle(e.target.value)}
                                        placeholder="Новая акция!"
                                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#26C6DA]"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Текст
                                    </label>
                                    <textarea
                                        value={notificationBody}
                                        onChange={(e) => setNotificationBody(e.target.value)}
                                        placeholder="Скидка 30% на все книги!"
                                        rows={3}
                                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#26C6DA]"
                                    />
                                </div>
                                <button
                                    onClick={sendNotification}
                                    disabled={!notificationTitle || permissionStatus !== 'granted'}
                                    className="flex items-center gap-2 px-6 py-3 bg-[#26C6DA] text-white rounded-lg hover:bg-[#00ACC1] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <Send className="w-4 h-4" />
                                    Отправить уведомление
                                </button>
                            </div>
                        </div>
                    )}

                    {activeTab === 'diagnostics' && (
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-semibold flex items-center gap-2">
                                    <Settings className="w-5 h-5 text-[#26C6DA]" />
                                    Диагностика Service Worker
                                </h2>
                                <button
                                    onClick={refreshDiagnostics}
                                    className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                                >
                                    <RefreshCw className="w-4 h-4" />
                                    Обновить
                                </button>
                            </div>

                            {diagnostics && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <StatusCard
                                        icon={diagnostics.isSupported ? CheckCircle : XCircle}
                                        label="SW поддержка"
                                        value={diagnostics.isSupported ? 'Да' : 'Нет'}
                                        status={diagnostics.isSupported ? 'success' : 'error'}
                                    />
                                    <StatusCard
                                        icon={diagnostics.isRegistered ? CheckCircle : XCircle}
                                        label="SW зарегистрирован"
                                        value={diagnostics.isRegistered ? 'Да' : 'Нет'}
                                        status={diagnostics.isRegistered ? 'success' : 'error'}
                                    />
                                    <StatusCard
                                        icon={Settings}
                                        label="Состояние SW"
                                        value={diagnostics.registrationState || 'N/A'}
                                        status="neutral"
                                    />
                                    <StatusCard
                                        icon={isOnline ? Wifi : WifiOff}
                                        label="Сеть"
                                        value={isOnline ? 'Онлайн' : 'Офлайн'}
                                        status={isOnline ? 'success' : 'warning'}
                                    />
                                    <StatusCard
                                        icon={Smartphone}
                                        label="Standalone"
                                        value={diagnostics.isStandalone ? 'Да' : 'Нет'}
                                        status={diagnostics.isStandalone ? 'success' : 'neutral'}
                                    />
                                    <StatusCard
                                        icon={Bell}
                                        label="Push подписка"
                                        value={diagnostics.pushSubscription ? 'Активна' : 'Нет'}
                                        status={diagnostics.pushSubscription ? 'success' : 'neutral'}
                                    />
                                </div>
                            )}

                            {/* Caches */}
                            {diagnostics && diagnostics.cacheNames.length > 0 && (
                                <div className="mt-6">
                                    <h3 className="font-medium mb-2">Кэши ({diagnostics.cacheNames.length})</h3>
                                    <div className="space-y-2">
                                        {diagnostics.cacheNames.map((name) => (
                                            <div key={name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                                <code className="text-sm">{name}</code>
                                            </div>
                                        ))}
                                    </div>
                                    <button
                                        onClick={async () => {
                                            await clearAllCaches();
                                            refreshDiagnostics();
                                        }}
                                        className="mt-4 flex items-center gap-2 px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                        Очистить все кэши
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'products' && (
                        <div className="space-y-6">
                            <h2 className="text-xl font-semibold flex items-center gap-2">
                                <Package className="w-5 h-5 text-[#26C6DA]" />
                                Управление товарами
                            </h2>

                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b">
                                            <th className="text-left py-3 px-4">Название</th>
                                            <th className="text-left py-3 px-4">Автор</th>
                                            <th className="text-left py-3 px-4">Цена</th>
                                            <th className="text-left py-3 px-4">Скидка</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {newBooks.slice(0, 5).map((book) => (
                                            <tr key={book.id} className="border-b hover:bg-gray-50">
                                                <td className="py-3 px-4">{book.title}</td>
                                                <td className="py-3 px-4 text-gray-600">{book.author}</td>
                                                <td className="py-3 px-4 font-medium">{book.price} ₽</td>
                                                <td className="py-3 px-4">
                                                    {book.discount && (
                                                        <span className="px-2 py-1 bg-red-100 text-red-600 rounded-full text-sm">
                                                            -{book.discount}%
                                                        </span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <p className="text-gray-500 text-sm">
                                * Это демо-режим. Для полного управления товарами подключите бэкенд.
                            </p>
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
}

interface StatusCardProps {
    icon: React.ElementType;
    label: string;
    value: string;
    status: 'success' | 'error' | 'warning' | 'neutral';
}

function StatusCard({ icon: Icon, label, value, status }: StatusCardProps) {
    const colors = {
        success: 'bg-green-50 text-green-600 border-green-200',
        error: 'bg-red-50 text-red-600 border-red-200',
        warning: 'bg-yellow-50 text-yellow-600 border-yellow-200',
        neutral: 'bg-gray-50 text-gray-600 border-gray-200',
    };

    return (
        <div className={`flex items-center gap-3 p-4 rounded-xl border ${colors[status]}`}>
            <Icon className="w-5 h-5" />
            <div>
                <div className="text-sm opacity-75">{label}</div>
                <div className="font-medium">{value}</div>
            </div>
        </div>
    );
}
