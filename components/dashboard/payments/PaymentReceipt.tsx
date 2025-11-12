import React from 'react';
import type { Receipt, ViewType } from '../../../types';
import { formatCurrency, formatDate } from '../../../utils/formatters';

interface PaymentReceiptProps {
    isOpen: boolean;
    onClose: () => void;
    receipt: Receipt | null;
    setActiveView: (view: ViewType) => void;
}

const PaymentReceipt: React.FC<PaymentReceiptProps> = ({ isOpen, onClose, receipt, setActiveView }) => {
    if (!isOpen || !receipt) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md" onClick={e => e.stopPropagation()}>
                <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <i className="fas fa-check text-green-500 text-3xl"></i>
                    </div>
                    <h2 className="text-2xl font-bold text-[#1a365d]">Payment Successful</h2>
                    <p className="text-gray-500">Your payment has been sent.</p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg space-y-2 text-sm">
                    <div className="flex justify-between">
                        <span className="text-gray-600">To:</span>
                        <span className="font-semibold">{receipt.vendor}</span>
                    </div>
                     <div className="flex justify-between">
                        <span className="text-gray-600">Date:</span>
                        <span className="font-semibold">{formatDate(receipt.date)}</span>
                    </div>
                     <div className="flex justify-between">
                        <span className="text-gray-600">Transaction ID:</span>
                        <span className="font-mono text-xs">{receipt.id}</span>
                    </div>
                    <hr className="my-2"/>
                     <div className="flex justify-between font-bold text-lg">
                        <span>Total Paid:</span>
                        <span>{formatCurrency(receipt.total)}</span>
                    </div>
                </div>

                <div className="mt-8 flex flex-col gap-3">
                    <button onClick={() => { onClose(); setActiveView('receipts'); }} className="w-full py-3 rounded-md bg-[#1a365d] text-white font-semibold hover:bg-[#2d5c8a]">
                        View Full Receipt
                    </button>
                     <button onClick={onClose} className="w-full py-2 rounded-md text-gray-600 hover:bg-gray-100">
                        Done
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PaymentReceipt;
