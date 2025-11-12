import React, { useState, useMemo } from 'react';
import { 
    GLOBAL_PARTNER_BANKS, 
    INTERNATIONAL_ACCOUNTS, 
    INTERNATIONAL_TRANSFERS 
} from '../../constants';
import { CURRENCIES, EXCHANGE_RATES } from '../../i18n';
import type { GlobalPartnerBank, ViewType } from '../../types';
import { formatCurrency, formatDate } from '../../utils/formatters';

interface GlobalNetworkViewProps {
    setActiveView: (view: ViewType) => void;
}

const CurrencyExchange: React.FC = () => {
    const [amount, setAmount] = useState('1000');
    const [fromCurrency, setFromCurrency] = useState('USD');
    const [toCurrency, setToCurrency] = useState('EUR');

    const { convertedAmount, rateDisplay } = useMemo(() => {
        const amountNum = parseFloat(amount) || 0;
        if (amountNum === 0) return { convertedAmount: 0, rateDisplay: '' };

        const fromRate = EXCHANGE_RATES[fromCurrency as keyof typeof EXCHANGE_RATES];
        const toRate = EXCHANGE_RATES[toCurrency as keyof typeof EXCHANGE_RATES];

        if (!fromRate || !toRate) return { convertedAmount: 0, rateDisplay: '' };

        const amountInUSD = amountNum / fromRate;
        const finalAmount = amountInUSD * toRate;

        const oneUnitInUSD = 1 / fromRate;
        const rateForDisplay = oneUnitInUSD * toRate;
        
        return { 
            convertedAmount: finalAmount, 
            rateDisplay: `1 ${fromCurrency} = ${rateForDisplay.toFixed(4)} ${toCurrency}`
        };
    }, [amount, fromCurrency, toCurrency]);

    return (
        <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-2xl border border-white/10 shadow-lg">
            <h2 className="text-xl font-bold mb-4">Currency Conversion Tool</h2>
            <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-xs text-gray-400">From</label>
                        <select value={fromCurrency} onChange={e => setFromCurrency(e.target.value)} className="w-full bg-gray-900/50 border-gray-600 rounded-md text-white p-2 text-base">
                            {CURRENCIES.map(c => <option key={c.code} value={c.code}>{c.flag} {c.code}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="text-xs text-gray-400">Amount</label>
                        <input type="number" value={amount} onChange={e => setAmount(e.target.value)} className="w-full bg-gray-900/50 border-gray-600 rounded-md text-white p-2 text-base" />
                    </div>
                </div>

                <div className="flex justify-center">
                    <button 
                        onClick={() => {
                            const temp = fromCurrency;
                            setFromCurrency(toCurrency);
                            setToCurrency(temp);
                        }}
                        className="w-8 h-8 rounded-full bg-gray-700 hover:bg-yellow-500 hover:text-gray-900 transition-all flex items-center justify-center"
                    >
                        <i className="fas fa-exchange-alt"></i>
                    </button>
                </div>

                 <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-xs text-gray-400">To</label>
                        <select value={toCurrency} onChange={e => setToCurrency(e.target.value)} className="w-full bg-gray-900/50 border-gray-600 rounded-md text-white p-2 text-base">
                            {CURRENCIES.map(c => <option key={c.code} value={c.code}>{c.flag} {c.code}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="text-xs text-gray-400">Converted Amount</label>
                        <div className="w-full bg-gray-900/50 border border-gray-600 rounded-md p-2 text-base h-[42px] flex items-center">
                            {convertedAmount.toFixed(2)}
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex justify-between items-center mt-4 text-sm text-yellow-400">
                <span>{rateDisplay}</span>
                <span>Live Rate</span>
            </div>
        </div>
    );
};

const PartnerBankItem: React.FC<{ bank: GlobalPartnerBank }> = ({ bank }) => (
    <div className="flex items-center justify-between p-3 bg-black/20 rounded-md hover:bg-black/40 transition-colors">
        <div className="flex items-center gap-4">
            <img src={bank.logoUrl} alt={bank.name} className="w-10 h-10 bg-white/10 rounded-full p-1" />
            <div>
                <p className="font-semibold">{bank.name}</p>
                <p className="text-xs text-gray-400">{bank.country}</p>
            </div>
        </div>
        <a 
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${bank.name} ATMs`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-full bg-blue-500/20 text-blue-300 hover:bg-blue-500/40 transition-colors"
        >
            <i className="fas fa-map-marker-alt"></i>
            <span>Find ATMs</span>
        </a>
    </div>
);

const GlobalNetworkView: React.FC<GlobalNetworkViewProps> = ({ setActiveView }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredPartners = useMemo(() => {
        return GLOBAL_PARTNER_BANKS.filter(p => 
            p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.country.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [searchTerm]);

    return (
        <div 
            className="min-h-full bg-gray-900 text-white p-8 bg-cover bg-center"
            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1545486332-9e0999c535b2?q=80&w=1935&auto=format=fit=crop')" }}
        >
            <div className="absolute inset-0 bg-gray-900/80 backdrop-blur-sm"></div>
            <div className="relative">
                <h1 className="text-4xl font-bold mb-8 text-shadow-lg">Global Banking Network</h1>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Left Column */}
                    <div className="space-y-8">
                        <CurrencyExchange />
                        <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-2xl border border-white/10 shadow-lg">
                            <h2 className="text-xl font-bold mb-4">International Accounts</h2>
                            {INTERNATIONAL_ACCOUNTS.map(acc => (
                                <div key={acc.id} className="p-3 bg-black/20 rounded-md">
                                    <div className="flex justify-between">
                                        <p className="font-semibold">{acc.bankName} - {acc.country}</p>
                                        <p className="font-bold text-lg">{new Intl.NumberFormat('en-US').format(acc.balance)} {acc.currency}</p>
                                    </div>
                                    <p className="text-xs text-gray-400">{acc.accountNumber}</p>
                                </div>
                            ))}
                        </div>
                         <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-2xl border border-white/10 shadow-lg">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-bold">International Transfers</h2>
                                <button onClick={() => setActiveView('payments')} className="px-4 py-2 text-sm font-semibold rounded-lg bg-yellow-400 text-gray-900 hover:bg-yellow-300 transition-colors">
                                    <i className="fas fa-paper-plane mr-2"></i>
                                    New Transfer
                                </button>
                            </div>
                             <div className="space-y-3">
                                 {INTERNATIONAL_TRANSFERS.map(t => (
                                     <div key={t.id} className="flex justify-between items-center p-3 bg-black/20 rounded-md">
                                         <div>
                                             <p className="font-semibold">To: {t.recipient}</p>
                                             <p className="text-xs text-gray-400">{formatDate(t.date)} &bull; {t.country}</p>
                                         </div>
                                         <div className="text-right">
                                             <p className="font-bold">{formatCurrency(t.amountUSD)}</p>
                                             <p className="text-xs text-gray-400">{new Intl.NumberFormat().format(t.amountLocal)} {t.currency}</p>
                                         </div>
                                     </div>
                                 ))}
                             </div>
                         </div>
                    </div>
                    {/* Right Column */}
                    <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-2xl border border-white/10 shadow-lg">
                        <h2 className="text-xl font-bold mb-4">Global Partners & ATM Locator</h2>
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            placeholder="Search by bank or country..."
                            className="w-full bg-gray-900/50 border-gray-600 rounded-md text-white p-2 mb-4"
                        />
                        <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
                            {filteredPartners.map(bank => <PartnerBankItem key={bank.id} bank={bank} />)}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GlobalNetworkView;
