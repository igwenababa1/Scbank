
import React, { useState } from 'react';
import type { ViewType, Account, Contact } from '../../../types';
import { ACCOUNTS, CONTACTS } from '../../../constants';
import { formatCurrency } from '../../../utils/formatters';
import { useDashboard } from '../../../contexts/DashboardContext';

interface SendMoneyProps {
    setActiveView: (view: ViewType) => void;
}

const SendMoney: React.FC<SendMoneyProps> = ({ setActiveView }) => {
    const { addReceiptAndNavigate } = useDashboard();
    const [amount, setAmount] = useState('');
    const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
    const [fromAccount, setFromAccount] = useState<Account>(ACCOUNTS[0]);
    const [note, setNote] = useState('');
    const [isConfirming, setIsConfirming] = useState(false);

    const handleConfirm = () => {
        const newReceipt = {
            vendor: `Payment to ${selectedContact?.name}`,
            vendorLogo: selectedContact?.avatarUrl || '',
            date: new Date().toISOString(),
            total: parseFloat(amount),
            category: 'Payments',
            items: [{ name: `Note: "${note || 'No note'}"`, quantity: 1, price: parseFloat(amount) }],
        };
        addReceiptAndNavigate(newReceipt, setActiveView);
    };

    const amountNum = parseFloat(amount) || 0;

    if (isConfirming) {
        return (
            <div>
                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Review Your Payment</h3>
                <div className="bg-gray-50 dark:bg-slate-700/50 p-4 rounded-lg space-y-3">
                    <div className="flex justify-between items-center">
                        <span className="text-gray-600 dark:text-gray-300">To:</span>
                        <div className="flex items-center gap-2">
                            <img src={selectedContact?.avatarUrl} className="w-8 h-8 rounded-full" />
                            <span className="font-semibold dark:text-white">{selectedContact?.name}</span>
                        </div>
                    </div>
                    <hr className="dark:border-slate-600" />
                    <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-300">Amount:</span>
                        <span className="font-bold text-lg dark:text-white">{formatCurrency(amountNum)}</span>
                    </div>
                     <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-300">From:</span>
                        <span className="font-semibold dark:text-white">{fromAccount.type} ({fromAccount.number})</span>
                    </div>
                     <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-300">Note:</span>
                        <span className="font-semibold italic dark:text-white">"{note || 'N/A'}"</span>
                    </div>
                </div>
                <div className="flex gap-4 mt-6">
                    <button onClick={() => setIsConfirming(false)} className="flex-1 py-3 rounded-md text-gray-600 border border-gray-300 hover:bg-gray-100 dark:text-gray-200 dark:border-slate-600 dark:hover:bg-slate-700">Back</button>
                    <button onClick={handleConfirm} className="flex-1 py-3 rounded-md bg-green-600 text-white font-semibold hover:bg-green-700">Confirm & Send</button>
                </div>
            </div>
        );
    }
    
    return (
        <div>
            {/* Amount Input */}
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Amount</label>
                <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="$0.00" className="mt-1 w-full text-3xl font-bold border-0 border-b-2 focus:ring-0 focus:border-[#e6b325] bg-transparent text-gray-900 dark:text-white" autoFocus />
            </div>

            {/* From Account */}
            <div className="mb-4">
                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">From</label>
                 <select onChange={e => setFromAccount(ACCOUNTS.find(a => a.id === e.target.value) || ACCOUNTS[0])} className="mt-1 w-full border-gray-300 rounded-md p-2 bg-white dark:bg-slate-700 dark:text-white dark:border-slate-600">
                    {ACCOUNTS.filter(a => a.type !== 'Credit').map(acc => <option key={acc.id} value={acc.id}>{acc.type} ({acc.number}) - {formatCurrency(acc.balance)}</option>)}
                </select>
            </div>

            {/* Recipient Selection */}
            <div className="mb-6">
                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">To</label>
                 <div className="flex space-x-3 overflow-x-auto pb-2 -mx-2 px-2">
                    {CONTACTS.map(contact => (
                        <button key={contact.id} onClick={() => setSelectedContact(contact)} className={`flex-shrink-0 text-center p-2 rounded-lg border-2 ${selectedContact?.id === contact.id ? 'border-[#e6b325]' : 'border-transparent'}`}>
                            <img src={contact.avatarUrl} alt={contact.name} className="w-12 h-12 rounded-full mx-auto" />
                            <p className="text-xs font-semibold mt-1 truncate w-16 dark:text-gray-200">{contact.name}</p>
                        </button>
                    ))}
                 </div>
            </div>
            
            {/* Note */}
            <div className="mb-6">
                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Note (optional)</label>
                 <input type="text" value={note} onChange={e => setNote(e.target.value)} className="mt-1 w-full border-gray-300 rounded-md p-2 bg-white dark:bg-slate-700 dark:text-white dark:border-slate-600" />
            </div>

            <button onClick={() => setIsConfirming(true)} disabled={!selectedContact || amountNum <= 0} className="w-full py-3 rounded-md bg-[#e6b325] text-[#1a365d] font-semibold hover:bg-[#d19d1f] disabled:bg-gray-300 dark:disabled:bg-slate-600">
                Review Payment
            </button>
        </div>
    );
};

export default SendMoney;
