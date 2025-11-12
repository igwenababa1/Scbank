
import React, { useEffect, useRef, useState } from 'react';
import { Chart, registerables } from 'chart.js';
// FIX: Corrected import path
import { PORTFOLIO_SUMMARY, HOLDINGS, ASSET_ALLOCATION, MARKET_MOVERS, WATCHLIST } from '../../constants';
import { formatCurrency } from '../../utils/formatters';
// FIX: Corrected import path
import type { Holding, AssetAllocationItem, MarketMover, WatchlistItem } from '../../types';
import TradeModal from '../../components/dashboard/investments/TradeModal';
import HoldingSparkline from '../../components/dashboard/investments/HoldingSparkline';
import HoldingDetailModal from '../../components/dashboard/investments/HoldingDetailModal';

Chart.register(...registerables);

const StatCard: React.FC<{ label: string; value: string; subValue?: string; valueColor?: string; }> = ({ label, value, subValue, valueColor }) => (
    <div className="bg-gray-800/50 backdrop-blur-sm p-5 rounded-xl border border-white/10 shadow-lg">
        <p className="text-sm text-gray-400 font-semibold">{label}</p>
        <p className={`text-2xl font-bold mt-1 ${valueColor || 'text-white'}`}>{value}</p>
        {subValue && <p className={`text-sm font-semibold mt-1 ${valueColor || 'text-gray-400'}`}>{subValue}</p>}
    </div>
);

const AssetAllocationChart: React.FC<{ data: AssetAllocationItem[] }> = ({ data }) => {
    const chartRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        let chartInstance: Chart | undefined;
        if (chartRef.current) {
            const ctx = chartRef.current.getContext('2d');
            if (ctx) {
                chartInstance = new Chart(ctx, {
                    type: 'doughnut',
                    data: {
                        labels: data.map(d => d.name),
                        datasets: [{
                            data: data.map(d => d.value),
                            backgroundColor: ['#1a365d', '#2d5c8a', '#e6b325', '#a9b7c6'],
                            borderColor: '#1f2937',
                            borderWidth: 2,
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: {
                                position: 'right',
                                labels: { color: '#d1d5db' }
                            },
                        },
                        cutout: '60%',
                    }
                });
            }
        }
        return () => chartInstance?.destroy();
    }, [data]);
    
    return <div className="relative h-48"><canvas ref={chartRef}></canvas></div>;
};

const MarketWatch: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'movers' | 'watchlist'>('movers');

    const renderList = (items: (MarketMover | WatchlistItem)[]) => (
        <div className="space-y-3">
            {items.map(item => (
                <div key={item.id} className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <img src={item.logoUrl} alt={item.name} className="w-8 h-8 rounded-full bg-white p-1" />
                        <div>
                            <p className="font-bold">{item.symbol}</p>
                            <p className="text-xs text-gray-400 truncate w-24">{item.name}</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="font-semibold">{formatCurrency(item.price)}</p>
                        <p className={`text-sm font-semibold ${item.changePercent >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {item.changePercent.toFixed(2)}%
                        </p>
                    </div>
                </div>
            ))}
        </div>
    );

    return (
        <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-white/10 shadow-lg h-full">
            <div className="flex border-b border-white/10 mb-4">
                <button onClick={() => setActiveTab('movers')} className={`pb-2 px-2 text-sm font-semibold ${activeTab === 'movers' ? 'text-yellow-400 border-b-2 border-yellow-400' : 'text-gray-400'}`}>Top Movers</button>
                <button onClick={() => setActiveTab('watchlist')} className={`pb-2 px-2 text-sm font-semibold ${activeTab === 'watchlist' ? 'text-yellow-400 border-b-2 border-yellow-400' : 'text-gray-400'}`}>Watchlist</button>
            </div>
            {activeTab === 'movers' ? renderList(MARKET_MOVERS) : renderList(WATCHLIST)}
        </div>
    );
};


const InvestmentsView: React.FC = () => {
    const [isTradeModalOpen, setIsTradeModalOpen] = useState(false);
    const [tradeDetails, setTradeDetails] = useState<{ holding: Holding | null, type: 'Buy' | 'Sell' }>({ holding: null, type: 'Buy' });
    const [selectedHolding, setSelectedHolding] = useState<Holding | null>(null);
    const [timeRange, setTimeRange] = useState('1Y');
    const portfolioChartRef = useRef<HTMLCanvasElement>(null);
    const chartInstanceRef = useRef<Chart | null>(null);

    const handleOpenTradeModal = (holding: Holding, type: 'Buy' | 'Sell') => {
        setTradeDetails({ holding, type });
        setIsTradeModalOpen(true);
    };

    const handleConfirmTrade = (shares: number) => {
        alert(`Your order to ${tradeDetails.type.toLowerCase()} ${shares} share(s) of ${tradeDetails.holding?.symbol} has been submitted.`);
        setIsTradeModalOpen(false);
    };
    
    const handleOpenDetailModal = (holding: Holding) => {
        setSelectedHolding(holding);
    };
    
    const handleBuyFromDetail = (holding: Holding) => {
        setSelectedHolding(null);
        handleOpenTradeModal(holding, 'Buy');
    };
    
    const handleSellFromDetail = (holding: Holding) => {
        setSelectedHolding(null);
        handleOpenTradeModal(holding, 'Sell');
    };

    const chartData = {
        '1M': { labels: ['W1', 'W2', 'W3', 'W4'], data: [118000, 117000, 119000, 120450] },
        '6M': { labels: ['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'], data: [108000, 112000, 115000, 118000, 117000, 120450] },
        '1Y': { labels: ['Jan', 'Mar', 'May', 'Jul', 'Sep', 'Oct'], data: [100000, 105000, 108000, 115000, 117000, 120450] },
        'ALL': { labels: ['2021', '2022', '2023'], data: [80000, 100000, 120450] },
    };

    useEffect(() => {
        if (chartInstanceRef.current) {
            chartInstanceRef.current.destroy();
        }
        if (portfolioChartRef.current) {
            const ctx = portfolioChartRef.current.getContext('2d');
            if (ctx) {
                const gradient = ctx.createLinearGradient(0, 0, 0, 300);
                gradient.addColorStop(0, 'rgba(230, 179, 37, 0.3)');
                gradient.addColorStop(1, 'rgba(230, 179, 37, 0)');

                chartInstanceRef.current = new Chart(ctx, {
                    type: 'line',
                    data: {
                        labels: chartData[timeRange as keyof typeof chartData].labels,
                        datasets: [{
                            label: 'Portfolio Value',
                            data: chartData[timeRange as keyof typeof chartData].data,
                            borderColor: '#e6b325',
                            backgroundColor: gradient,
                            tension: 0.4,
                            fill: true,
                        }],
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: { legend: { display: false } },
                        scales: { 
                            y: { ticks: { callback: (value) => formatCurrency(value as number), color: '#9ca3af' }, grid: { color: 'rgba(255,255,255,0.1)' } },
                            x: { ticks: { color: '#9ca3af' }, grid: { display: false } },
                        }
                    },
                });
            }
        }
        return () => {
            chartInstanceRef.current?.destroy();
        };
    }, [timeRange]);

    return (
        <div 
            className="min-h-full bg-gray-900 text-white p-8 bg-cover bg-center"
            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1611015940293-9a37c5f87b6a?q=80&w=2070&auto=format&fit=crop')" }}
        >
            <div className="absolute inset-0 bg-gray-900/80 backdrop-blur-sm"></div>
            <div className="relative">
                <h1 className="text-4xl font-bold mb-8 text-shadow-lg">Investment Portfolio</h1>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <StatCard label="Total Value" value={formatCurrency(PORTFOLIO_SUMMARY.totalValue)} />
                    <StatCard 
                        label="Day's Gain/Loss" 
                        value={formatCurrency(PORTFOLIO_SUMMARY.dayChange)} 
                        subValue={`${PORTFOLIO_SUMMARY.dayChange >= 0 ? '+' : ''}${PORTFOLIO_SUMMARY.dayChangePercent.toFixed(2)}%`}
                        valueColor={PORTFOLIO_SUMMARY.dayChange >= 0 ? 'text-green-400' : 'text-red-400'}
                    />
                    <StatCard label="Buying Power" value={formatCurrency(PORTFOLIO_SUMMARY.buyingPower)} />
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-8">
                        <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-white/10 shadow-lg">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-bold">Performance</h2>
                                <div className="flex gap-1 bg-gray-900/50 p-1 rounded-md">
                                    {Object.keys(chartData).map(range => (
                                        <button key={range} onClick={() => setTimeRange(range)} className={`px-3 py-1 text-xs font-semibold rounded ${timeRange === range ? 'bg-yellow-500 text-gray-900' : 'text-gray-400 hover:bg-gray-700'}`}>{range}</button>
                                    ))}
                                </div>
                            </div>
                            <div className="h-80 relative">
                                <canvas ref={portfolioChartRef}></canvas>
                            </div>
                        </div>

                        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-white/10 shadow-lg overflow-hidden">
                            <h2 className="text-xl font-bold p-6">Your Holdings</h2>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="border-b border-white/10">
                                        <tr>
                                            <th className="p-4 pl-6">Asset</th>
                                            <th className="p-4 text-right">Market Value</th>
                                            <th className="p-4 text-right">Price</th>
                                            <th className="p-4 text-right pr-6">Day's Change</th>
                                            <th className="p-4 text-center w-32">7-Day Trend</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {HOLDINGS.map(h => (
                                            <tr key={h.id} onClick={() => handleOpenDetailModal(h)} className="border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer">
                                                <td className="p-4 pl-6">
                                                    <div className="flex items-center gap-4">
                                                        <img src={h.logoUrl} alt={h.name} className="w-8 h-8 rounded-full bg-white p-0.5" />
                                                        <div>
                                                            <p className="font-bold">{h.symbol}</p>
                                                            <p className="text-sm text-gray-400 truncate max-w-[120px]">{h.name}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="p-4 text-right">
                                                    <p className="font-semibold">{formatCurrency(h.shares * h.price)}</p>
                                                    <p className="text-sm text-gray-400">{h.shares.toFixed(2)} shares</p>
                                                </td>
                                                <td className="p-4 text-right font-semibold">{formatCurrency(h.price)}</td>
                                                <td className="p-4 text-right pr-6">
                                                    <div className="flex items-center justify-end gap-4">
                                                        <div className={`font-semibold ${h.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                                            {formatCurrency(h.change)} ({h.changePercent.toFixed(2)}%)
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <button onClick={(e) => { e.stopPropagation(); handleOpenTradeModal(h, 'Buy'); }} className="px-3 py-1 text-sm rounded-md font-semibold text-green-300 bg-green-500/20 hover:bg-green-500/40">Buy</button>
                                                            <button onClick={(e) => { e.stopPropagation(); handleOpenTradeModal(h, 'Sell'); }} className="px-3 py-1 text-sm rounded-md font-semibold text-red-300 bg-red-500/20 hover:bg-red-500/40">Sell</button>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="p-4 h-16 w-32">
                                                    <HoldingSparkline data={h.historicalData} />
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-8">
                        <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-white/10 shadow-lg">
                            <h2 className="text-xl font-bold mb-4">Asset Allocation</h2>
                            <AssetAllocationChart data={ASSET_ALLOCATION} />
                        </div>
                        <MarketWatch />
                    </div>
                </div>
            </div>

            {isTradeModalOpen && tradeDetails.holding && (
                <TradeModal
                    isOpen={isTradeModalOpen}
                    onClose={() => setIsTradeModalOpen(false)}
                    holding={tradeDetails.holding}
                    tradeType={tradeDetails.type}
                    onConfirmTrade={handleConfirmTrade}
                />
            )}

            {selectedHolding && (
                <HoldingDetailModal
                    isOpen={!!selectedHolding}
                    onClose={() => setSelectedHolding(null)}
                    holding={selectedHolding}
                    onBuy={handleBuyFromDetail}
                    onSell={handleSellFromDetail}
                />
            )}
        </div>
    );
};

export default InvestmentsView;
