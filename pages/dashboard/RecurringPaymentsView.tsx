
import React, { useState } from 'react';
// FIX: Corrected import path
import { RECURRING_PAYMENTS } from '../../constants';
// FIX: Corrected import path
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
        <div className="p-8">
            <div className="flex justify-between items-center mb-6">
                 <div>
                    <h1 className="text-3xl font-bold text-[#1a365d]">Recurring Payments</h1>
                    <p className="text-gray-600">Manage your scheduled and automated payments.</p>
                </div>
                <button 
                    onClick={() => handleOpenModal()}
                    className="px-5 py-2 rounded-md bg-[#e6b325] text-[#1a365d] font-semibold hover:bg-[#d19d1f] transition-colors"
                >
                    + New Recurring Payment
                </button>
            </div>
            
             <div className="bg-white p-6 rounded-xl shadow-md">
                <div className="space-y-4">
                    {payments.length > 0 ? (
                        payments.map(payment => (
                            <RecurringPaymentItem 
                                key={payment.id} 
                                payment={payment} 
                                onEdit={() => handleOpenModal(payment)} 
                                onDelete={() => handleDeletePayment(payment.id)} 
                            />
                        ))
                    ) : (
                        <div className="text-center py-12 text-gray-500">
                            <i className="fas fa-calendar-times text-4xl mb-4"></i>
                            <h3 className="text-lg font-semibold text-gray-700">No Recurring Payments Found</h3>
                            <p className="text-gray-500">Set up a new recurring payment to get started.</p>
                        </div>
                    )}
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
