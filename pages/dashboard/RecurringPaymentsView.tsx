
import React, { useState } from 'react';
import { RECURRING_PAYMENTS } from '../../constants';
import type { RecurringPayment } from '../../types';
import RecurringPaymentItem from '../../components/dashboard/payments/RecurringPaymentItem';
import SetupRecurringPaymentModal from '../../components/dashboard/payments/SetupRecurringPaymentModal';

const RecurringPaymentsView: React.FC = () => {
    const [payments, setPayments] = useState<RecurringPayment[]>(RECURRING_PAYMENTS);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPayment, setEditingPayment] = useState<RecurringPayment | null>(null);

    const handleOpenModal = (payment: RecurringPayment | null = null) => {
        setEditingPayment(payment);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setEditingPayment(null);
        setIsModalOpen(false);
    };

    const handleSavePayment = (payment: RecurringPayment) => {
        if (editingPayment) {
            setPayments(payments.map(p => p.id === payment.id ? payment : p));
        } else {
            setPayments(prev => [...prev, { ...payment, id: `rec-${Date.now()}` }].sort((a,b) => new Date(a.nextDate).getTime() - new Date(b.nextDate).getTime()));
        }
        handleCloseModal();
    };

    const handleDeletePayment = (id: string) => {
        if (window.confirm('Are you sure you want to delete this recurring payment?')) {
             setPayments(payments.filter(p => p.id !== id));
        }
    };

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                 <div>
                    <h1 className="text-3xl font-bold text-[#1a365d] dark:text-white">Recurring Payments</h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">Manage your scheduled transfers and automated subscriptions.</p>
                </div>
                <button 
                    onClick={() => handleOpenModal()}
                    className="px-6 py-3 rounded-lg bg-[#e6b325] text-[#1a365d] font-bold shadow-lg hover:bg-[#d19d1f] hover:shadow-xl transition-all transform hover:-translate-y-0.5 flex items-center gap-2"
                >
                    <i className="fas fa-plus"></i> New Payment
                </button>
            </div>
            
            <div className="bg-white dark:bg-slate-800 p-1 rounded-2xl shadow-lg border border-gray-100 dark:border-slate-700">
                <div className="p-6">
                    <div className="flex justify-between items-center mb-4 px-2">
                        <h3 className="font-bold text-lg text-gray-800 dark:text-white">Active Schedules</h3>
                        <span className="text-sm text-gray-500 dark:text-gray-400">{payments.length} active</span>
                    </div>
                    
                    <div className="space-y-3">
                        {payments.length > 0 ? (
                            payments.map(payment => (
                                <RecurringPaymentItem 
                                    key={payment.id} 
                                    payment={payment} 
                                    onEdit={() => handleOpenModal(payment)} 
                                    onDelete={() => handleDeletePayment(payment.id)}
                                    variant="default" 
                                />
                            ))
                        ) : (
                            <div className="text-center py-16 text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-slate-900/50 rounded-xl border-2 border-dashed border-gray-200 dark:border-slate-700">
                                <div className="w-16 h-16 bg-gray-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <i className="fas fa-calendar-plus text-2xl text-gray-400"></i>
                                </div>
                                <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-1">No Recurring Payments</h3>
                                <p className="text-sm">Set up your first automated payment to get started.</p>
                                <button onClick={() => handleOpenModal()} className="mt-4 text-[#1a365d] dark:text-blue-400 font-semibold hover:underline">
                                    Create Schedule
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {isModalOpen && (
                <SetupRecurringPaymentModal
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    onSave={handleSavePayment}
                    payment={editingPayment}
                />
            )}
        </div>
    );
};

export default RecurringPaymentsView;
