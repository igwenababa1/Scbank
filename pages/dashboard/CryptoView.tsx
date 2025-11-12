
import React, { useState, useMemo } from 'react';
// FIX: Corrected import path
import { CRYPTO_HOLDINGS } from '../../constants';
import { formatCurrency } from '../../utils/formatters';
// FIX: Corrected import path
import type { CryptoHolding, ViewType } from '../../types';
import HoldingSparkline from '../../components/dashboard/investments/HoldingSparkline';
import WithdrawCryptoModal from '../../components/dashboard/crypto/WithdrawCryptoModal';

const CryptoStatCard: React.FC<{ title: string; value: string; change?: string; changeColor?: string; icon: string; iconBgColor: string; }> = ({ title, value, change, changeColor, icon, iconBgColor }) => (
    <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-2xl border border-white/10 shadow-lg">
        <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-gray-400 font-semibold">{title}</span>
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${iconBgColor}`}>
                <i className={`fas ${icon} text-white`}></i>
            </div>
        </div>
        <p className="text-3xl font-bold text-white">{value}</p>
        {change && <p className={`text-sm font-semibold ${changeColor}`}>{change}</p>}
    </div>
);

interface CryptoViewProps {
    setActiveView: (view: ViewType) => void;
}

const CryptoView: React.FC<CryptoViewProps> = ({ setActiveView }) => {
    const [holdings, setHoldings] = useState<CryptoHolding[]>(CRYPTO_HOLDINGS);
    const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
    const [selectedCrypto, setSelectedCrypto] = useState<CryptoHolding | null>(null);

    const { portfolioValue, portfolioDayChange, portfolioDayChangePercent } = useMemo(() => {
        const portfolioValue = holdings.reduce((sum, h) => sum + h.balanceUSD, 0);
        const yesterdayValue = holdings.reduce((sum, h) => sum + (h.balanceUSD / (1 + h.dayChangePercent / 100)), 0);
        const portfolioDayChange = portfolioValue - yesterdayValue;
        const portfolioDayChangePercent = yesterdayValue > 0 ? (portfolioDayChange / yesterdayValue) * 100 : 0;
        return { portfolioValue, portfolioDayChange, portfolioDayChangePercent };
    }, [holdings]);

    const handleOpenWithdrawModal = (crypto: CryptoHolding) => {
        setSelectedCrypto(crypto);
        setIsWithdrawModalOpen(true);
    };

    const handleCloseWithdrawModal = () => {
        setSelectedCrypto(null);
        setIsWithdrawModalOpen(false);
    };

    return (
        <div className="min-h-full bg-gray-900 text-white p-8">
            <h1 className="text-4xl font-bold mb-8">Crypto Portfolio</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <CryptoStatCard
                    title="Total Balance"
                    value={formatCurrency(portfolioValue)}
                    change={`${portfolioDayChange >= 0 ? '+' : ''}${formatCurrency(portfolioDayChange)} (${portfolioDayChangePercent.toFixed(2)}%) Today`}
                    changeColor={portfolioDayChange >= 0 ? 'text-green-400' : 'text-red-400'}
                    icon="fa-wallet"
                    iconBgColor="bg-blue-500"
                />
                 <div className="md:col-span-2 bg-gray-800/50 backdrop-blur-sm p-6 rounded-2xl border border-white/10 shadow-lg flex items-center justify-around">
                     <button className="flex flex-col items-center gap-2 text-gray-300 hover:text-white transition-colors">
                        <div className="w-14 h-14 rounded-full bg-green-500/20 flex items-center justify-center border border-green-500/50">
                            <i className="fas fa-plus text-2xl text-green-400"></i>
                        </div>
                        <span className="font-semibold">Buy Crypto</span>
                    </button>
                    <button className="flex flex-col items-center gap-2 text-gray-300 hover:text-white transition-colors">
                        <div className="w-14 h-14 rounded-full bg-yellow-500/20 flex items-center justify-center border border-yellow-500/50">
                            <i className="fas fa-paper-plane text-2xl text-yellow-400"></i>
                        </div>
                        <span className="font-semibold">Send</span>
                    </button>
                    <button className="flex flex-col items-center gap-2 text-gray-300 hover:text-white transition-colors">
                        <div className="w-14 h-14 rounded-full bg-blue-500/20 flex items-center justify-center border border-blue-500/50">
                            <i className="fas fa-qrcode text-2xl text-blue-400"></i>
                        </div>
                        <span className="font-semibold">Receive</span>
                    </button>
                     <button className="flex flex-col items-center gap-2 text-gray-300 hover:text-white transition-colors">
                        <div className="w-14 h-14 rounded-full bg-indigo-500/20 flex items-center justify-center border border-indigo-500/50">
                            <i className="fas fa-exchange-alt text-2xl text-indigo-400"></i>
                        </div>
                        <span className="font-semibold">Swap</span>
                    </button>
                 </div>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-white/10 shadow-lg overflow-hidden">
                <h2 className="text-xl font-bold p-6">Your Assets</h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="border-b border-white/10">
                            <tr>
                                <th className="p-4 pl-6">Asset</th>
                                <th className="p-4 text-right">Balance</th>
                                <th className="p-4 text-right">Price</th>
                                <th className="p-4 text-center">24h Change</th>
                                <th className="p-4 text-center w-32">7-Day Chart</th>
                                <th className="p-4 text-center pr-6">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {holdings.map(h => (
                                <tr key={h.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                    <td className="p-4 pl-6">
                                        <div className="flex items-center gap-4">
                                            <img src={h.iconUrl} alt={h.name} className="w-8 h-8" />
                                            <div>
                                                <p className="font-bold">{h.name}</p>
                                                <p className="text-sm text-gray-400">{h.symbol}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4 text-right">
                                        <p className="font-semibold">{formatCurrency(h.balanceUSD)}</p>
                                        <p className="text-sm text-gray-400">{h.balanceCrypto.toFixed(6)} {h.symbol}</p>
                                    </td>
                                    <td className="p-4 text-right font-semibold">{formatCurrency(h.priceUSD)}</td>
                                    <td className={`p-4 text-center font-semibold ${h.dayChangePercent >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                        {h.dayChangePercent.toFixed(2)}%
                                    </td>
                                    <td className="p-4 h-16 w-32">
                                        <HoldingSparkline data={h.historicalData} />
                                    </td>
                                    <td className="p-4 pr-6">
                                        <div className="flex justify-center gap-2">
                                            <button className="px-3 py-1 text-sm rounded-md font-semibold text-blue-300 bg-blue-500/20 hover:bg-blue-500/40">Trade</button>
                                            <button onClick={() => handleOpenWithdrawModal(h)} className="px-3 py-1 text-sm rounded-md font-semibold text-yellow-300 bg-yellow-500/20 hover:bg-yellow-500/40">Withdraw</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            
            {isWithdrawModalOpen && selectedCrypto && (
                <WithdrawCryptoModal
                    isOpen={isWithdrawModalOpen}
                    onClose={handleCloseWithdrawModal}
                    crypto={selectedCrypto}
                    setActiveView={setActiveView}
                />
            )}
        </div>
    );
};

export default CryptoView;
