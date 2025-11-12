
import React from 'react';
// FIX: Corrected import path
import type { RecurringPayment } from '../../../types';
import { formatCurrency, formatDate } from '../../../utils/formatters';

interface RecurringPaymentItemProps {
    payment: RecurringPayment;
    onEdit: () => void;
    onDelete: () => void;
}

const RecurringPaymentItem: React.FC<RecurringPaymentItemProps> = ({ payment, onEdit, onDelete }) => {
    const categoryIcons: { [key: string]: string } = {
        'Utilities': 'fa-lightbulb',
        'Rent': 'fa-home',
        'Subscription': 'fa-sync-alt',
        'Loan': 'fa-landmark',
        'Other': 'fa-ellipsis-h',
    };
    
    const icon = categoryIcons[payment.category] || categoryIcons['Other'];

    return (
        <div className="flex flex-col sm:flex-row items-center justify-between p-4 border dark:border-slate-700 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors">
            <div className="flex items-center w-full sm:w-auto mb-4 sm:mb-0">
                <div className="w-10 h-10 flex-shrink-0 bg-gray-100 dark:bg-slate-700 rounded-full flex items-center justify-center mr-4">
                    <i className={`fas ${icon} text-gray-500 dark:text-slate-300`}></i>
                </div>
                <div>
                    <p className="font-bold text-gray-800 dark:text-slate-100">{payment.recipient}</p>
                    <p className="text-sm text-gray-500 dark:text-slate-400">{payment.frequency} • Next on {formatDate(payment.nextDate)}</p>
                </div>
            </div>
            <div className="flex items-center justify-between w-full sm:w-auto">
                 <p className="font-semibold text-lg text-[#1a365d] dark:text-white mr-8">{formatCurrency(payment.amount)}</p>
                <div className="flex items-center gap-2">
                    <button onClick={onEdit} className="px-3 py-1 text-sm rounded-md border dark:border-slate-600 font-semibold hover:bg-gray-100 dark:hover:bg-slate-600 text-gray-700 dark:text-gray-200">Edit</button>
                    <button onClick={onDelete} className="px-3 py-1 text-sm rounded-md border dark:border-slate-600 font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10">Delete</button>
                </div>
            </div>
        </div>
    );
};

export default RecurringPaymentItem;
