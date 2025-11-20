
import React from 'react';
import type { RecurringPayment } from '../../../types';
import { formatCurrency, formatDate } from '../../../utils/formatters';

interface RecurringPaymentItemProps {
    payment: RecurringPayment;
    onEdit: () => void;
    onDelete: () => void;
    variant?: 'default' | 'overlay';
}

const RecurringPaymentItem: React.FC<RecurringPaymentItemProps> = ({ payment, onEdit, onDelete, variant = 'default' }) => {
    const categoryIcons: { [key: string]: string } = {
        'Utilities': 'fa-lightbulb',
        'Rent': 'fa-home',
        'Subscription': 'fa-sync-alt',
        'Loan': 'fa-landmark',
        'Other': 'fa-ellipsis-h',
    };
    
    const icon = categoryIcons[payment.category] || categoryIcons['Other'];
    
    const containerClasses = variant === 'overlay'
        ? "bg-white/5 hover:bg-white/10 border border-white/5 text-white"
        : "bg-white hover:shadow-md border border-gray-100 text-gray-800 dark:bg-slate-800 dark:border-slate-700 dark:text-white dark:hover:bg-slate-700/80";
        
    const iconContainerClasses = variant === 'overlay'
        ? "bg-gradient-to-br from-gray-700 to-gray-800 text-gray-300 group-hover:text-yellow-400"
        : "bg-gray-100 text-gray-500 group-hover:text-[#1a365d] dark:bg-slate-700 dark:text-gray-400 dark:group-hover:text-yellow-400";

    const subTextClasses = variant === 'overlay'
        ? "text-gray-400"
        : "text-gray-500 dark:text-gray-400";

    const buttonClasses = variant === 'overlay'
        ? "text-gray-400 hover:text-white"
        : "text-gray-400 hover:text-[#1a365d] dark:hover:text-white";

    return (
        <div className={`group flex items-center justify-between p-4 rounded-xl transition-all duration-200 ${containerClasses}`}>
            <div className="flex items-center gap-4">
                <div className={`w-12 h-12 flex-shrink-0 rounded-lg flex items-center justify-center shadow-inner transition-colors ${iconContainerClasses}`}>
                    <i className={`fas ${icon}`}></i>
                </div>
                <div>
                    <p className="font-bold text-base">{payment.recipient}</p>
                    <p className={`text-xs mt-0.5 flex items-center gap-1 ${subTextClasses}`}>
                        <span className="capitalize">{payment.frequency}</span>
                        <span className="w-1 h-1 bg-current rounded-full opacity-50"></span>
                        <span>Next: {formatDate(payment.nextDate)}</span>
                    </p>
                </div>
            </div>
            <div className="flex flex-col items-end gap-2">
                 <p className="font-mono font-bold text-lg">{formatCurrency(payment.amount)}</p>
                 <div className="flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={onEdit} className={`text-xs transition-colors ${buttonClasses}`} title="Edit">
                        <i className="fas fa-pen"></i>
                    </button>
                    <button onClick={onDelete} className="text-xs text-gray-400 hover:text-red-500 transition-colors" title="Delete">
                        <i className="fas fa-trash"></i>
                    </button>
                 </div>
            </div>
        </div>
    );
};

export default RecurringPaymentItem;
