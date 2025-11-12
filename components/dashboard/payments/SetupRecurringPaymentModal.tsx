
import React, { useState, useEffect } from 'react';
// FIX: Corrected import path
import type { RecurringPayment } from '../../../types';
// FIX: Corrected import path
import { CONTACTS } from '../../../constants';

interface SetupRecurringPaymentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (payment: RecurringPayment) => void;
    payment: RecurringPayment | null;
}

const SetupRecurringPaymentModal: React.FC<SetupRecurringPaymentModalProps> = ({ isOpen, onClose, onSave, payment }) => {
    const [recipient, setRecipient] = useState('');
    const [amount, setAmount] = useState('');
    const [frequency, setFrequency] = useState<'Weekly' | 'Bi-Weekly' | 'Monthly' | 'Yearly'>('Monthly');
    const [nextDate, setNextDate] = useState('');
    const [category, setCategory] = useState<'Utilities' | 'Rent' | 'Subscription' | 'Loan' | 'Other'>('Other');
    const [error, setError] = useState('');

    useEffect(() => {
        if (payment) {
            setRecipient(payment.recipient);
            setAmount(payment.amount.toString());
            setFrequency(payment.frequency);
            setNextDate(new Date(payment.nextDate).toISOString().split('T')[0]);
            setCategory(payment.category);
        } else {
            // Reset form for new payment
            setRecipient('');
            setAmount('');
            setFrequency('Monthly');
            setNextDate(new Date().toISOString().split('T')[0]);
            setCategory('Other');
        }
    }, [payment, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!recipient || !amount || !nextDate) {
            setError('Please fill out all required fields.');
            return;
        }
        const newPayment: RecurringPayment = {
            id: payment?.id || `rec-${Date.now()}`,
            recipient,
            amount: parseFloat(amount),
            frequency,
            nextDate,
            category,
        };
        onSave(newPayment);
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 transition-opacity" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-lg" onClick={e => e.stopPropagation()}>
                <form onSubmit={handleSubmit}>
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-[#1a365d]">{payment ? 'Edit' : 'Setup'} Recurring Payment</h2>
                        <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600">
                            <i className="fas fa-times text-xl"></i>
                        </button>
                    </div>

                    {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm">{error}</div>}

                    <div className="space-y-4">
                         <div>
                            <label htmlFor="recipient" className="block text-sm font-medium text-gray-700">Recipient</label>
                            <input 
                                type="text" 
                                id="recipient" 
                                value={recipient} 
                                onChange={e => setRecipient(e.target.value)} 
                                list="contacts" 
                                placeholder="e.g., Netflix, City Power & Light"
                                className="mt-1 w-full border-gray-300 rounded-md shadow-sm focus:ring-[#e6b325] focus:border-[#e6b325]" 
                            />
                            <datalist id="contacts">
                                {CONTACTS.map(c => <option key={c.id} value={c.name} />)}
                            </datalist>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                             <div>
                                <label htmlFor="amount" className="block text-sm font-medium text-gray-700">Amount</label>
                                <input type="number" id="amount" value={amount} onChange={e => setAmount(e.target.value)} className="mt-1 w-full border-gray-300 rounded-md shadow-sm focus:ring-[#e6b325] focus:border-[#e6b325]" />
                            </div>
                             <div>
                                <label htmlFor="frequency" className="block text-sm font-medium text-gray-700">Frequency</label>
                                <select id="frequency" value={frequency} onChange={e => setFrequency(e.target.value as any)} className="mt-1 w-full border-gray-300 rounded-md shadow-sm focus:ring-[#e6b325] focus:border-[#e6b325]">
                                    <option>Weekly</option>
                                    <option>Bi-Weekly</option>
                                    <option>Monthly</option>
                                    <option>Yearly</option>
                                </select>
                            </div>
                        </div>
                         <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="nextDate" className="block text-sm font-medium text-gray-700">Next Payment Date</label>
                                <input type="date" id="nextDate" value={nextDate} onChange={e => setNextDate(e.target.value)} className="mt-1 w-full border-gray-300 rounded-md shadow-sm focus:ring-[#e6b325] focus:border-[#e6b325]" />
                            </div>
                            <div>
                                <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
                                <select id="category" value={category} onChange={e => setCategory(e.target.value as any)} className="mt-1 w-full border-gray-300 rounded-md shadow-sm focus:ring-[#e6b325] focus:border-[#e6b325]">
                                    <option>Utilities</option>
                                    <option>Rent</option>
                                    <option>Subscription</option>
                                    <option>Loan</option>
                                    <option>Other</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 flex justify-end gap-4">
                        <button type="button" onClick={onClose} className="px-6 py-2 rounded-md text-gray-600 border border-gray-300 hover:bg-gray-100">Cancel</button>
                        <button type="submit" className="px-6 py-2 rounded-md bg-[#e6b325] text-[#1a365d] font-semibold hover:bg-[#d19d1f]">Save Payment</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SetupRecurringPaymentModal;
