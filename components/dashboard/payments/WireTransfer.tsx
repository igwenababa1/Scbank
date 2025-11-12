
import React, { useState, useMemo } from 'react';
import { ACCOUNTS, CURRENCY_RATES } from '../../../constants';
import type { ViewType } from '../../../types';
import { useDashboard } from '../../../contexts/DashboardContext';
import { formatCurrency } from '../../../utils/formatters';

interface WireTransferProps {
    setActiveView: (view: ViewType) => void;
}

const WireTransfer: React.FC<WireTransferProps> = ({ setActiveView }) => {
    const { addReceiptAndNavigate } = useDashboard();
    const [wireType, setWireType] = useState<'domestic' | 'international'>('domestic');
    const [formData, setFormData] = useState({
        fromAccount: ACCOUNTS[0].id,
        recipientName: '',
        recipientAddress: '',
        bankName: '',
        routingNumber: '',
        swiftCode: '',
        accountNumber: '',
        amount: '',
        memo: '',
    });
    const [isConfirming, setIsConfirming] = useState(false);
    const [toCurrency, setToCurrency] = useState(CURRENCY_RATES[0].code);
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleCurrencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setToCurrency(e.target.value);
    };

    const amountNum = parseFloat(formData.amount) || 0;
    const fromAccountDetails = ACCOUNTS.find(a => a.id === formData.fromAccount);

    const { exchangeRate, convertedAmount } = useMemo(() => {
        if (wireType !== 'international' || amountNum <= 0) {
            return { exchangeRate: null, convertedAmount: 0 };
        }
        const rate = CURRENCY_RATES.find(r => r.code === toCurrency)?.rate || 0;
        return {
            exchangeRate: rate,
            convertedAmount: amountNum * rate,
        };
    }, [amountNum, toCurrency, wireType]);

    const handleConfirm = () => {
        const newReceipt = {
            vendor: `Wire to ${formData.recipientName}`,
            vendorLogo: 'https://img.icons8.com/ios-filled/50/000000/bank.png',
            date: new Date().toISOString(),
            total: parseFloat(formData.amount),
            category: 'Wire Transfer',
            items: [{ name: `Memo: "${formData.memo || 'N/A'}"`, quantity: 1, price: parseFloat(formData.amount) }],
        };
        addReceiptAndNavigate(newReceipt, setActiveView);
    };

    if (isConfirming) {
        return (
             <div>
                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Review Wire Transfer</h3>
                <div className="bg-gray-50 dark:bg-slate-700/50 p-4 rounded-lg space-y-3 text-sm">
                    <div className="flex justify-between"><span className="text-gray-600 dark:text-gray-300">Amount to Send:</span><span className="font-bold text-lg dark:text-white">{formatCurrency(amountNum)}</span></div>
                    {wireType === 'international' && exchangeRate && (
                         <div className="flex justify-between">
                             <span className="text-gray-600 dark:text-gray-300">Recipient Receives ≈</span>
                             <span className="font-bold text-lg dark:text-white">{new Intl.NumberFormat('en-US', { style: 'currency', currency: toCurrency }).format(convertedAmount)}</span>
                         </div>
                    )}
                    <div className="flex justify-between"><span className="text-gray-600 dark:text-gray-300">From:</span><span className="font-semibold dark:text-white">{fromAccountDetails?.type} ({fromAccountDetails?.number})</span></div>
                    <hr className="dark:border-slate-600"/>
                    <div className="flex justify-between"><span className="text-gray-600 dark:text-gray-300">To:</span><span className="font-semibold dark:text-white">{formData.recipientName}</span></div>
                    <div className="flex justify-between"><span className="text-gray-600 dark:text-gray-300">Receiving Bank:</span><span className="font-semibold dark:text-white">{formData.bankName}</span></div>
                    <div className="flex justify-between"><span className="text-gray-600 dark:text-gray-300">Account Number:</span><span className="font-semibold dark:text-white">••••{formData.accountNumber.slice(-4)}</span></div>
                </div>
                <div className="flex gap-4 mt-6">
                    <button onClick={() => setIsConfirming(false)} className="flex-1 py-3 rounded-md text-gray-600 border border-gray-300 hover:bg-gray-100 dark:text-gray-200 dark:border-slate-600 dark:hover:bg-slate-700">Back</button>
                    <button onClick={handleConfirm} className="flex-1 py-3 rounded-md bg-green-600 text-white font-semibold hover:bg-green-700">Send Wire</button>
                </div>
            </div>
        );
    }

    return (
        <div>
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Send a Wire Transfer</h3>
            <div className="flex gap-2 bg-gray-100 dark:bg-slate-700 p-1 rounded-lg mb-6 self-start">
                <button onClick={() => setWireType('domestic')} className={`px-4 py-2 text-sm font-semibold rounded-md flex-1 ${wireType === 'domestic' ? 'bg-white dark:bg-slate-600 shadow' : ''}`}>Domestic</button>
                <button onClick={() => setWireType('international')} className={`px-4 py-2 text-sm font-semibold rounded-md flex-1 ${wireType === 'international' ? 'bg-white dark:bg-slate-600 shadow' : ''}`}>International</button>
            </div>
            <div className="space-y-4">
                <input type="text" name="recipientName" value={formData.recipientName} onChange={handleChange} placeholder="Recipient Name" className="w-full border-gray-300 rounded-md bg-white dark:bg-slate-700 dark:text-white dark:border-slate-600" />
                <input type="text" name="recipientAddress" value={formData.recipientAddress} onChange={handleChange} placeholder="Recipient Address" className="w-full border-gray-300 rounded-md bg-white dark:bg-slate-700 dark:text-white dark:border-slate-600" />
                <input type="text" name="bankName" value={formData.bankName} onChange={handleChange} placeholder="Bank Name" className="w-full border-gray-300 rounded-md bg-white dark:bg-slate-700 dark:text-white dark:border-slate-600" />
                {wireType === 'domestic' ? (
                    <input type="text" name="routingNumber" value={formData.routingNumber} onChange={handleChange} placeholder="Routing Number (ABA)" className="w-full border-gray-300 rounded-md bg-white dark:bg-slate-700 dark:text-white dark:border-slate-600" />
                ) : (
                    <>
                        <input type="text" name="swiftCode" value={formData.swiftCode} onChange={handleChange} placeholder="SWIFT / BIC Code" className="w-full border-gray-300 rounded-md bg-white dark:bg-slate-700 dark:text-white dark:border-slate-600" />
                        <div>
                             <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Destination Currency</label>
                             <select name="toCurrency" value={toCurrency} onChange={handleCurrencyChange} className="w-full border-gray-300 rounded-md mt-1 bg-white dark:bg-slate-700 dark:text-white dark:border-slate-600">
                                 {CURRENCY_RATES.map(rate => <option key={rate.code} value={rate.code}>{rate.code}</option>)}
                             </select>
                        </div>
                    </>
                )}
                <input type="text" name="accountNumber" value={formData.accountNumber} onChange={handleChange} placeholder="Account Number" className="w-full border-gray-300 rounded-md bg-white dark:bg-slate-700 dark:text-white dark:border-slate-600" />
                <div className="relative">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Amount (USD)</label>
                    <input type="number" name="amount" value={formData.amount} onChange={handleChange} placeholder="0.00" className="w-full border-gray-300 rounded-md mt-1 pl-7 bg-white dark:bg-slate-700 dark:text-white dark:border-slate-600" />
                    <span className="absolute left-2.5 top-9 text-gray-500">$</span>
                </div>

                {wireType === 'international' && exchangeRate && amountNum > 0 && (
                     <div className="bg-blue-50 dark:bg-blue-900/50 border-l-4 border-blue-400 p-3 text-sm text-blue-800 dark:text-blue-200 rounded-r-lg">
                        <div className="flex justify-between items-center">
                            <span className="font-semibold">Live Rate: 1 USD ≈ {exchangeRate.toFixed(4)} {toCurrency}</span>
                            <p className="font-bold text-lg">
                                ≈ {new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(convertedAmount)} {toCurrency}
                            </p>
                        </div>
                        <p className="text-xs text-blue-600 dark:text-blue-300 mt-1">Recipient will receive approximately this amount. Final rate may vary.</p>
                     </div>
                 )}
                
                <button onClick={() => setIsConfirming(true)} disabled={amountNum <= 0} className="w-full py-3 rounded-md bg-[#e6b325] text-[#1a365d] font-semibold hover:bg-[#d19d1f] disabled:bg-gray-300 dark:disabled:bg-slate-600">
                    Review Wire
                </button>
            </div>
        </div>
    );
};

export default WireTransfer;
