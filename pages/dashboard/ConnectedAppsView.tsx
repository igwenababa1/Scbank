import React, { useState } from 'react';
import { CONNECTED_APPS, CONNECTED_APP_ACTIVITIES } from '../../constants';
import type { ConnectedApp, ConnectedAppActivity, ViewType } from '../../types';
import { formatCurrency, formatDate } from '../../utils/formatters';
import ConnectAppModal from '../../components/dashboard/connected-apps/ConnectAppModal';
import SendMoneyModal from '../../components/dashboard/connected-apps/SendMoneyModal';

const AppCard: React.FC<{ app: ConnectedApp; onConnect: () => void; onSend: () => void; }> = ({ app, onConnect, onSend }) => (
    <div className="bg-black/20 p-4 rounded-lg flex items-center justify-between">
        <div className="flex items-center gap-4">
            <img src={app.logoUrl} alt={app.name} className="w-12 h-12 bg-white rounded-full p-1" />
            <div>
                <p className="font-bold">{app.name}</p>
                <p className="text-xs text-gray-400">{app.description}</p>
            </div>
        </div>
        {app.isConnected ? (
            <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-green-400 bg-green-500/20 px-2 py-1 rounded-full">Connected</span>
                <button onClick={onSend} className="px-3 py-1 text-sm rounded-md font-semibold text-yellow-300 bg-yellow-500/20 hover:bg-yellow-500/40">Send</button>
            </div>
        ) : (
            <button onClick={onConnect} className="px-4 py-2 text-sm rounded-md font-semibold bg-blue-500 hover:bg-blue-600 transition-colors">Connect</button>
        )}
    </div>
);

interface ConnectedAppsViewProps {
    setActiveView: (view: ViewType) => void;
}

const ConnectedAppsView: React.FC<ConnectedAppsViewProps> = ({ setActiveView }) => {
    const [apps, setApps] = useState(CONNECTED_APPS);
    const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);
    const [isSendModalOpen, setIsSendModalOpen] = useState(false);
    const [selectedApp, setSelectedApp] = useState<ConnectedApp | null>(null);
    
    const handleOpenConnectModal = (app: ConnectedApp) => {
        setSelectedApp(app);
        setIsConnectModalOpen(true);
    };

    const handleOpenSendModal = (app: ConnectedApp) => {
        setSelectedApp(app);
        setIsSendModalOpen(true);
    };
    
    const handleConnectSuccess = (appId: string) => {
        setApps(prevApps => prevApps.map(app => app.id === appId ? { ...app, isConnected: true } : app));
        setIsConnectModalOpen(false);
    };

    return (
        <div 
            className="min-h-full bg-gray-900 text-white p-8 bg-cover bg-center"
            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1518655048521-f130df041f66?q=80&w=2070&auto=format&fit=crop')" }}
        >
            <div className="absolute inset-0 bg-gray-900/80 backdrop-blur-sm"></div>
            <div className="relative">
                <h1 className="text-4xl font-bold mb-8 text-shadow-lg">Connected Apps & Services</h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-8">
                        {/* Your Connected Apps */}
                        <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-2xl border border-white/10 shadow-lg">
                            <h2 className="text-xl font-bold mb-4">Your Connected Apps</h2>
                            <div className="space-y-3">
                                {apps.filter(app => app.isConnected).map(app => (
                                    <AppCard key={app.id} app={app} onConnect={() => {}} onSend={() => handleOpenSendModal(app)} />
                                ))}
                            </div>
                        </div>
                        {/* Connect New Apps */}
                        <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-2xl border border-white/10 shadow-lg">
                            <h2 className="text-xl font-bold mb-4">Connect New Services</h2>
                            <div className="space-y-3">
                                {apps.filter(app => !app.isConnected).map(app => (
                                    <AppCard key={app.id} app={app} onConnect={() => handleOpenConnectModal(app)} onSend={() => {}} />
                                ))}
                            </div>
                        </div>
                    </div>
                    
                    {/* Recent Activity */}
                    <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-2xl border border-white/10 shadow-lg">
                        <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
                        <div className="space-y-4">
                            {CONNECTED_APP_ACTIVITIES.map(activity => (
                                <div key={activity.id} className="flex items-center gap-4">
                                    <img src={activity.appLogoUrl} alt={activity.appName} className="w-10 h-10 bg-white rounded-full p-1" />
                                    <div className="flex-grow">
                                        <p className="font-semibold">{activity.description}</p>
                                        <p className="text-xs text-gray-400">{activity.appName} &bull; {formatDate(activity.date)}</p>
                                    </div>
                                    <p className={`font-semibold ${activity.type === 'received' ? 'text-green-400' : 'text-red-400'}`}>
                                        {activity.type === 'sent' ? '-' : '+'}{formatCurrency(activity.amount)}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            
            {isConnectModalOpen && selectedApp && (
                <ConnectAppModal
                    isOpen={isConnectModalOpen}
                    onClose={() => setIsConnectModalOpen(false)}
                    app={selectedApp}
                    onSuccess={handleConnectSuccess}
                />
            )}

            {isSendModalOpen && selectedApp && (
                <SendMoneyModal
                    isOpen={isSendModalOpen}
                    onClose={() => setIsSendModalOpen(false)}
                    app={selectedApp}
                    setActiveView={setActiveView}
                />
            )}
        </div>
    );
};

export default ConnectedAppsView;