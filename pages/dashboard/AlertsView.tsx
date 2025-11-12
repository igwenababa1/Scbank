import React, { useState, useMemo } from 'react';
import { ALERTS } from '../../constants';
import type { Alert, ViewType } from '../../types';

interface AlertsViewProps {
    setActiveView: (view: ViewType) => void;
}

const AlertCard: React.FC<{ alert: Alert, onAction: (view: ViewType) => void }> = ({ alert, onAction }) => {
    const severityStyles = {
        info: {
            icon: 'fa-info-circle',
            iconColor: 'text-blue-400',
            borderColor: 'border-blue-500',
        },
        warning: {
            icon: 'fa-exclamation-triangle',
            iconColor: 'text-yellow-400',
            borderColor: 'border-yellow-500',
        },
        critical: {
            icon: 'fa-exclamation-circle',
            iconColor: 'text-red-400',
            borderColor: 'border-red-500',
        },
    };
    
    const styles = severityStyles[alert.severity];
    const timeAgo = (date: string) => {
        const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
        let interval = seconds / 31536000;
        if (interval > 1) return Math.floor(interval) + " years ago";
        interval = seconds / 2592000;
        if (interval > 1) return Math.floor(interval) + " months ago";
        interval = seconds / 86400;
        if (interval > 1) return Math.floor(interval) + " days ago";
        interval = seconds / 3600;
        if (interval > 1) return Math.floor(interval) + " hours ago";
        interval = seconds / 60;
        if (interval > 1) return Math.floor(interval) + " minutes ago";
        return Math.floor(seconds) + " seconds ago";
    };

    return (
        <div className={`bg-gray-800/50 backdrop-blur-sm p-5 rounded-xl border-l-4 ${styles.borderColor} shadow-lg flex items-start gap-4`}>
            <div className="mt-1">
                <i className={`fas ${styles.icon} text-2xl ${styles.iconColor}`}></i>
            </div>
            <div className="flex-grow">
                <div className="flex justify-between items-center">
                    <h3 className="font-bold text-white">{alert.title}</h3>
                    <span className="text-xs text-gray-400">{timeAgo(alert.timestamp)}</span>
                </div>
                <p className="text-sm text-gray-300 mt-1">{alert.description}</p>
                {alert.action && (
                    <button 
                        onClick={() => onAction(alert.action!.view)} 
                        className="mt-3 px-3 py-1 text-xs font-semibold rounded-md bg-yellow-500/20 text-yellow-300 hover:bg-yellow-500/40"
                    >
                        {alert.action.label}
                    </button>
                )}
            </div>
            {!alert.isRead && <div className="w-2 h-2 bg-blue-400 rounded-full self-center flex-shrink-0"></div>}
        </div>
    );
};


const AlertsView: React.FC<AlertsViewProps> = ({ setActiveView }) => {
    const [alerts, setAlerts] = useState<Alert[]>(ALERTS);
    const [filter, setFilter] = useState<'all' | 'unread' | 'critical'>('all');

    const filteredAlerts = useMemo(() => {
        return alerts
            .filter(a => {
                if (filter === 'unread' && a.isRead) return false;
                if (filter === 'critical' && a.severity !== 'critical') return false;
                return true;
            })
            .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    }, [alerts, filter]);

    const markAllAsRead = () => {
        setAlerts(alerts.map(a => ({ ...a, isRead: true })));
    };

    return (
        <div className="min-h-full bg-gray-900 text-white p-8">
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-4xl font-bold text-shadow-lg">Alerts Hub</h1>
                        <p className="text-gray-400">Your central feed for all account notifications.</p>
                    </div>
                    <button onClick={markAllAsRead} className="text-sm font-semibold text-yellow-400 hover:underline">
                        Mark all as read
                    </button>
                </div>
                
                <div className="flex gap-2 bg-gray-800/50 p-1 rounded-lg mb-6 self-start max-w-xs">
                    {(['all', 'unread', 'critical'] as const).map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`flex-1 px-4 py-2 text-sm font-semibold rounded-md transition-colors capitalize ${filter === f ? 'bg-yellow-400 text-gray-900' : 'text-gray-300 hover:bg-gray-700'}`}
                        >
                            {f}
                        </button>
                    ))}
                </div>

                <div className="space-y-4">
                    {filteredAlerts.length > 0 ? (
                        filteredAlerts.map(alert => <AlertCard key={alert.id} alert={alert} onAction={setActiveView} />)
                    ) : (
                        <div className="text-center py-16 text-gray-500">
                             <i className="fas fa-check-circle text-5xl mb-4"></i>
                             <h3 className="text-xl font-bold">All caught up!</h3>
                             <p>You have no new alerts.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AlertsView;
