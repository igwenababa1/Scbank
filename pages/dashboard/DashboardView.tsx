
// FIX: Replaced placeholder content with a complete DashboardView component.
import React, { useState } from 'react';
// FIX: Corrected import path for ViewType
import type { ViewType } from '../../types';
// FIX: Corrected import path
import QuickActionButton from '../../components/dashboard/dashboard/QuickActionButton';
import SpendingInsights from '../../components/dashboard/dashboard/SpendingInsights';
import CreditScoreWidget from '../../components/dashboard/dashboard/CreditScoreWidget';
import ActivityFeed from '../../components/dashboard/dashboard/ActivityFeed';
import Transactions from '../../components/dashboard/Transactions';
import TransferModal from '../../components/dashboard/TransferModal';
import LiveVoiceAssistant from '../../components/dashboard/LiveVoiceAssistant';
import NetWorth from '../../components/dashboard/NetWorth';
import SessionInfoWidget from '../../components/dashboard/dashboard/SessionInfoWidget';


interface DashboardViewProps {
    setActiveView: (view: ViewType) => void;
}

const DashboardView: React.FC<DashboardViewProps> = ({ setActiveView }) => {
    const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
    const [isAssistantOpen, setIsAssistantOpen] = useState(false);

    return (
        <div className="relative min-h-full">
             <div
                className="hidden dark:block absolute inset-0 bg-cover bg-center bg-fixed"
                style={{ backgroundImage: "url('https://images.unsplash.com/photo-1642792969914-8a427c343680?q=80&w=2070&auto=format&fit=crop')" }}
            />
            <div className="hidden dark:block absolute inset-0 bg-slate-900/80" />
            <div className="relative p-8 space-y-8">
                {/* Replaced Hero and Account Summaries with a comprehensive Net Worth dashboard */}
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                    <div className="xl:col-span-2">
                        <NetWorth />
                    </div>
                    <div className="hidden xl:block">
                        <SessionInfoWidget />
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <QuickActionButton icon="fa-paper-plane" label="Send Money" onClick={() => setIsTransferModalOpen(true)} />
                    <QuickActionButton icon="fa-file-invoice-dollar" label="Pay Bills" onClick={() => setActiveView('payments')} />
                    <QuickActionButton icon="fa-piggy-bank" label="Deposit" onClick={() => alert('Deposit feature coming soon!')} />
                    <QuickActionButton icon="fa-credit-card" label="Cards" onClick={() => setActiveView('cards')} />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content Area */}
                    <div className="lg:col-span-2 space-y-8">
                        <Transactions limit={5} />
                    </div>

                    {/* Right Sidebar */}
                    <div className="space-y-8">
                        <CreditScoreWidget score={780} />
                        <SpendingInsights />
                        <ActivityFeed />
                    </div>
                </div>

                <TransferModal
                    isOpen={isTransferModalOpen}
                    onClose={() => setIsTransferModalOpen(false)}
                    setActiveView={setActiveView}
                />
                
                {/* Voice Assistant FAB */}
                <button
                    onClick={() => setIsAssistantOpen(true)}
                    className="fixed bottom-8 right-8 w-16 h-16 bg-[#1a365d] rounded-full text-white text-3xl flex items-center justify-center shadow-lg hover:bg-[#2d5c8a] transition-transform hover:scale-110 z-40"
                    aria-label="Open Voice Assistant"
                >
                    <i className="fas fa-microphone-alt"></i>
                </button>

                {isAssistantOpen && (
                    <LiveVoiceAssistant
                        isOpen={isAssistantOpen}
                        onClose={() => setIsAssistantOpen(false)}
                        setActiveView={setActiveView}
                    />
                )}
            </div>
        </div>
    );
};

export default DashboardView;