
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

    const InputField = ({ label, name, placeholder, type = "text", value }: any) => (
        <div className="group">
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5 group-focus-within:text-yellow-400 transition-colors">{label}</label>
            <input 
                type={type} 
                name={name} 
                value={value} 
                onChange={handleChange} 
                placeholder={placeholder} 
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 transition-all" 
            />
        </div>
    );

    if (isConfirming) {
        return (
             <div className="animate-fade-in-scale-up max-w-2xl mx-auto">
                <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-8 shadow-2xl">
                    <h3 className="text-2xl font-bold text-white mb-6 border-b border-white/10 pb-4">Verify Wire Details</h3>
                    
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <span className="text-gray-400">Total Amount</span>
                            <span className="text-3xl font-bold text-white">{formatCurrency(amountNum)}</span>
                        </div>

                        {wireType === 'international' && exchangeRate && (
                             <div className="bg-blue-500/20 border border-blue-500/30 p-4 rounded-xl flex justify-between items-center">
                                 <span className="text-blue-200 text-sm">Recipient Receives (Est.)</span>
                                 <span className="font-bold text-lg text-blue-100">{new Intl.NumberFormat('en-US', { style: 'currency', currency: toCurrency }).format(convertedAmount)}</span>
                             </div>
                        )}

                        <div className="grid grid-cols-2 gap-y-4 text-sm border-t border-white/10 pt-4">
                             <div><p className="text-gray-500">From Account</p><p className="font-semibold text-white">{fromAccountDetails?.type} (••• {fromAccountDetails?.number.slice(-4)})</p></div>
                             <div className="text-right"><p className="text-gray-500">Routing/SWIFT</p><p className="font-semibold text-white font-mono">{wireType === 'domestic' ? formData.routingNumber : formData.swiftCode}</p></div>
                             
                             <div><p className="text-gray-500">Beneficiary Name</p><p className="font-semibold text-white">{formData.recipientName}</p></div>
                             <div className="text-right"><p className="text-gray-500">Beneficiary Bank</p><p className="font-semibold text-white">{formData.bankName}</p></div>
                             
                             <div className="col-span-2"><p className="text-gray-500">Account Number / IBAN</p><p className="font-semibold text-white font-mono tracking-wide">{formData.accountNumber}</p></div>
                        </div>
                    </div>

                    <div className="flex gap-4 mt-8 pt-6 border-t border-white/10">
                        <button onClick={() => setIsConfirming(false)} className="flex-1 py-3 rounded-lg text-gray-300 border border-white/20 hover:bg-white/10 font-semibold transition-colors">Edit</button>
                        <button onClick={handleConfirm} className="flex-1 py-3 rounded-lg bg-yellow-400 text-[#1a365d] hover:bg-yellow-300 font-bold shadow-lg transition-colors">Execute Wire</button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="animate-fade-in-scale-up max-w-3xl mx-auto">
            <div className="flex gap-1 bg-white/5 p-1 rounded-xl mb-8 w-full max-w-md mx-auto">
                <button onClick={() => setWireType('domestic')} className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all ${wireType === 'domestic' ? 'bg-yellow-400 text-[#1a365d] shadow' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>Domestic Wire</button>
                <button onClick={() => setWireType('international')} className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all ${wireType === 'international' ? 'bg-yellow-400 text-[#1a365d] shadow' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>International SWIFT</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                 <InputField label="Beneficiary Name" name="recipientName" value={formData.recipientName} placeholder="Legal Name" />
                 <InputField label="Beneficiary Address" name="recipientAddress" value={formData.recipientAddress} placeholder="Full Address" />
                 <InputField label="Beneficiary Bank" name="bankName" value={formData.bankName} placeholder="Bank Name" />
                 
                 {wireType === 'domestic' ? (
                    <InputField label="Routing Number (ABA)" name="routingNumber" value={formData.routingNumber} placeholder="9 Digits" />
                ) : (
                    <InputField label="SWIFT / BIC Code" name="swiftCode" value={formData.swiftCode} placeholder="8 or 11 Characters" />
                )}
                
                 <div className="md:col-span-2">
                    <InputField label="Account Number / IBAN" name="accountNumber" value={formData.accountNumber} placeholder="Account Number" />
                 </div>
            </div>

            <div className="bg-white/5 rounded-xl p-6 border border-white/10 mb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
                     <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Amount (USD)</label>
                        <div className="relative">
                             <input type="number" name="amount" value={formData.amount} onChange={handleChange} placeholder="0.00" className="w-full bg-[#0b1120] border border-white/20 rounded-lg pl-8 pr-4 py-3 text-white font-mono text-lg focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400" />
                             <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                        </div>
                     </div>
                     
                     {wireType === 'international' && (
                         <div>
                             <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Currency</label>
                             <select name="toCurrency" value={toCurrency} onChange={handleCurrencyChange} className="w-full bg-[#0b1120] border border-white/20 rounded-lg px-4 py-3 text-white focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 cursor-pointer">
                                 {CURRENCY_RATES.map(rate => <option key={rate.code} value={rate.code}>{rate.code}</option>)}
                             </select>
                         </div>
                     )}
                </div>
                 {wireType === 'international' && exchangeRate && amountNum > 0 && (
                     <div className="mt-4 flex items-center justify-between text-sm text-gray-400 border-t border-white/10 pt-3">
                        <span>Exchange Rate: 1 USD ≈ {exchangeRate.toFixed(4)} {toCurrency}</span>
                        <span className="text-yellow-400 font-bold">Est. Total: {new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(convertedAmount)} {toCurrency}</span>
                     </div>
                 )}
            </div>
            
            <div className="flex justify-end">
                <button onClick={() => setIsConfirming(true)} disabled={amountNum <= 0} className="px-8 py-4 rounded-xl bg-yellow-400 text-[#1a365d] font-bold hover:bg-yellow-300 shadow-lg shadow-yellow-400/20 transition-all transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed">
                    Review Wire Details
                </button>
            </div>
        </div>
    );
};

export default WireTransfer;
