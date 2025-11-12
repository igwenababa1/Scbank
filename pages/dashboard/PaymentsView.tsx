
import React, { useState } from 'react';
import type { ViewType, PaymentActivity } from '../../types';
import { PAYMENT_ACTIVITIES, RECURRING_PAYMENTS } from '../../constants';
import { formatCurrency, formatDate } from '../../utils/formatters';
import SendMoney from '../../components/dashboard/payments/SendMoney';
import WireTransfer from '../../components/dashboard/payments/WireTransfer';
import RecurringPaymentItem from '../../components/dashboard/payments/RecurringPaymentItem';

interface PaymentsViewProps {
    setActiveView: (view: ViewType) => void;
}

const PaymentActivityItem: React.FC<{ activity: PaymentActivity }> = ({ activity }) => (
    <div className="flex items-center justify-between py-3 border-b last:border-0 dark:border-slate-700">
        <div className="flex items-center gap-3">
            <img src={activity.contactAvatarUrl} alt={activity.contactName} className="w-10 h-10 rounded-full" />
            <div>
                <p className="font-semibold text-gray-800 dark:text-slate-100">{activity.type === 'sent' ? 'Payment to' : 'Payment from'} {activity.contactName}</p>
                <p className="text-sm text-gray-500 dark:text-slate-400">{formatDate(activity.date)}</p>
            </div>
        </div>
        <p className={`font-semibold text-lg ${activity.type === 'sent' ? 'text-gray-800 dark:text-slate-100' : 'text-green-600 dark:text-green-400'}`}>
            {activity.type === 'sent' ? '-' : '+'}{formatCurrency(activity.amount)}
        </p>
    </div>
);

// Placeholder Bill Pay component
const BillPay: React.FC = () => (
    <div>
        <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Pay a Bill</h3>
        <p className="text-gray-600 dark:text-gray-300">This feature is coming soon. For now, you can manage your recurring payments.</p>
    </div>
);

const PaymentsView: React.FC<PaymentsViewProps> = ({ setActiveView }) => {
    const [activeTab, setActiveTab] = useState<'send' | 'bills' | 'recurring' | 'wire'>('send');

    const renderContent = () => {
        switch (activeTab) {
            case 'send': return <SendMoney setActiveView={setActiveView} />;
            case 'bills': return <BillPay />;
            case 'recurring':
                const upcomingPayments = RECURRING_PAYMENTS.slice(0, 2);
                return (
                    <div>
                        <div className="flex justify-between items-center mb-4">
                            <div>
                                <h3 className="text-xl font-bold text-gray-800 dark:text-white">Upcoming Recurring Payments</h3>
                                <p className="text-gray-600 dark:text-gray-300">A preview of your next scheduled payments.</p>
                            </div>
                            <button 
                                onClick={() => setActiveView('recurring-payments')} 
                                className="px-4 py-2 text-sm rounded-md bg-gray-100 dark:bg-slate-700 font-semibold hover:bg-gray-200 dark:hover:bg-slate-600"
                            >
                                Manage All
                            </button>
                        </div>
                        <div className="space-y-4">
                            {upcomingPayments.length > 0 ? upcomingPayments.map(payment => (
                                <RecurringPaymentItem 
                                    key={payment.id} 
                                    payment={payment} 
                                    onEdit={() => setActiveView('recurring-payments')} 
                                    onDelete={() => setActiveView('recurring-payments')} 
                                />
                            )) : <p className="text-gray-500 dark:text-gray-400 text-center py-8">No upcoming payments.</p>}
                        </div>
                        <button onClick={() => setActiveView('recurring-payments')} className="mt-6 w-full py-3 rounded-md bg-[#e6b325] text-[#1a365d] font-semibold hover:bg-[#d19d1f]">
                            + Set Up New Recurring Payment
                        </button>
                    </div>
                );
            case 'wire': return <WireTransfer setActiveView={setActiveView} />;
            default: return null;
        }
    };

    return (
        <div className="p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-lg">
                <div className="flex border-b dark:border-slate-700 mb-6">
                    <button onClick={() => setActiveTab('send')} className={`px-4 py-2 text-lg font-semibold transition-colors ${activeTab === 'send' ? 'text-[#1a365d] dark:text-yellow-400 border-b-2 border-[#1a365d] dark:border-yellow-400' : 'text-gray-500 dark:text-gray-400'}`}>Send Money</button>
                    <button onClick={() => setActiveTab('bills')} className={`px-4 py-2 text-lg font-semibold transition-colors ${activeTab === 'bills' ? 'text-[#1a365d] dark:text-yellow-400 border-b-2 border-[#1a365d] dark:border-yellow-400' : 'text-gray-500 dark:text-gray-400'}`}>Bill Pay</button>
                    <button onClick={() => setActiveTab('recurring')} className={`px-4 py-2 text-lg font-semibold transition-colors ${activeTab === 'recurring' ? 'text-[#1a365d] dark:text-yellow-400 border-b-2 border-[#1a365d] dark:border-yellow-400' : 'text-gray-500 dark:text-gray-400'}`}>Recurring</button>
                    <button onClick={() => setActiveTab('wire')} className={`px-4 py-2 text-lg font-semibold transition-colors ${activeTab === 'wire' ? 'text-[#1a365d] dark:text-yellow-400 border-b-2 border-[#1a365d] dark:border-yellow-400' : 'text-gray-500 dark:text-gray-400'}`}>Wire Transfer</button>
                </div>
                <div>
                    {renderContent()}
                </div>
            </div>

            {/* Right Sidebar: Activity */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg">
                <h3 className="font-bold text-xl text-[#1a365d] dark:text-white mb-4">Recent Payment Activity</h3>
                <div className="space-y-2">
                    {PAYMENT_ACTIVITIES.map(activity => (
                        <PaymentActivityItem key={activity.id} activity={activity} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default PaymentsView;
