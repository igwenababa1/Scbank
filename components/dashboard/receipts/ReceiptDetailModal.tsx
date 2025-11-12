
import React from 'react';
import type { Receipt, ViewType } from '../../../types';
import { formatCurrency, formatDate } from '../../../utils/formatters';

interface ReceiptDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    receipt: Receipt;
    setActiveView: (view: ViewType) => void;
}

const ReceiptDetailModal: React.FC<ReceiptDetailModalProps> = ({ isOpen, onClose, receipt }) => {
    if (!isOpen) return null;

    return (
        <div 
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 transition-opacity"
            onClick={onClose}
        >
            <div 
                className="bg-white rounded-lg shadow-xl w-full max-w-md text-gray-800 flex flex-col max-h-[90vh]" 
                onClick={e => e.stopPropagation()}
            >
                <div className="p-6 border-b">
                    <div className="flex justify-between items-start">
                        <div>
                            <img src={receipt.vendorLogo} alt={receipt.vendor} className="w-12 h-12 bg-gray-100 rounded-full p-1 mb-2" />
                            <h2 className="text-2xl font-bold">{receipt.vendor}</h2>
                            <p className="text-sm text-gray-500">{formatDate(receipt.date)}</p>
                        </div>
                        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                            <i className="fas fa-times text-xl"></i>
                        </button>
                    </div>
                </div>

                <div className="flex-grow p-6 overflow-y-auto">
                    <div className="space-y-2">
                        {receipt.items.map((item, index) => (
                            <div key={index} className="flex justify-between">
                                <span>{item.name} (x{item.quantity})</span>
                                <span>{formatCurrency(item.price * item.quantity)}</span>
                            </div>
                        ))}
                    </div>
                    <hr className="my-4" />
                    <div className="flex justify-between font-bold text-lg">
                        <span>Total</span>
                        <span>{formatCurrency(receipt.total)}</span>
                    </div>
                </div>

                <div className="p-6 bg-gray-50 border-t flex gap-3">
                     <button className="flex-1 px-6 py-2 rounded-md bg-gray-200 text-gray-700 font-semibold hover:bg-gray-300">
                        Download PDF
                    </button>
                     <button className="flex-1 px-6 py-2 rounded-md bg-gray-200 text-gray-700 font-semibold hover:bg-gray-300">
                        Report Issue
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ReceiptDetailModal;
