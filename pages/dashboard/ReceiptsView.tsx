import React, { useState, useMemo, useEffect } from 'react';
import type { Receipt, ViewType } from '../../types';
import { formatCurrency, formatDate } from '../../utils/formatters';
import ReceiptDetailModal from '../../components/dashboard/receipts/ReceiptDetailModal';
import { useDashboard } from '../../contexts/DashboardContext';

const ReceiptCard: React.FC<{ receipt: Receipt, onClick: () => void }> = ({ receipt, onClick }) => (
    <button onClick={onClick} className="w-full text-left bg-white p-4 rounded-xl shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-200">
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
                <img src={receipt.vendorLogo} alt={receipt.vendor} className="w-10 h-10 rounded-full bg-gray-100 p-1" />
                <div>
                    <p className="font-bold text-gray-800">{receipt.vendor}</p>
                    <p className="text-xs text-gray-500">{formatDate(receipt.date)}</p>
                </div>
            </div>
            <div className="text-right">
                <p className="font-bold text-lg text-[#1a365d]">{formatCurrency(receipt.total)}</p>
                <p className="text-xs text-gray-500">{receipt.category}</p>
            </div>
        </div>
    </button>
);

interface ReceiptsViewProps {
    setActiveView: (view: ViewType) => void;
}

const ReceiptsView: React.FC<ReceiptsViewProps> = ({ setActiveView }) => {
    const { receipts, newReceiptId, clearNewReceipt } = useDashboard();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedReceipt, setSelectedReceipt] = useState<Receipt | null>(null);

    useEffect(() => {
        if (newReceiptId) {
            const newReceipt = receipts.find(r => r.id === newReceiptId);
            if (newReceipt) {
                setSelectedReceipt(newReceipt);
                clearNewReceipt();
            }
        }
    }, [newReceiptId, receipts, clearNewReceipt]);

    const filteredReceipts = useMemo(() => {
        return receipts
            .filter(r => 
                r.vendor.toLowerCase().includes(searchTerm.toLowerCase()) ||
                r.category.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }, [searchTerm, receipts]);

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-[#1a365d]">Receipts</h1>
                <button className="px-5 py-2 rounded-md bg-[#e6b325] text-[#1a365d] font-semibold hover:bg-[#d19d1f] transition-colors">
                    <i className="fas fa-upload mr-2"></i>
                    Upload Receipt
                </button>
            </div>
            
            <div className="mb-6">
                <input
                    type="text"
                    placeholder="Search by vendor or category..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="w-full max-w-sm border-gray-300 rounded-full shadow-sm px-4 py-2 focus:ring-[#e6b325] focus:border-[#e6b325]"
                />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredReceipts.map(receipt => (
                    <ReceiptCard key={receipt.id} receipt={receipt} onClick={() => setSelectedReceipt(receipt)} />
                ))}
            </div>

            {filteredReceipts.length === 0 && (
                <div className="text-center py-16 text-gray-500">
                    <i className="fas fa-receipt text-5xl mb-4"></i>
                    <h3 className="text-xl font-bold">No Receipts Found</h3>
                    <p>Upload a receipt to get started.</p>
                </div>
            )}

            {selectedReceipt && (
                <ReceiptDetailModal
                    isOpen={!!selectedReceipt}
                    onClose={() => setSelectedReceipt(null)}
                    receipt={selectedReceipt}
                    setActiveView={setActiveView}
                />
            )}
        </div>
    );
};

export default ReceiptsView;