
import React, { useState, useMemo } from 'react';
import { TRANSACTIONS, ACCOUNTS, TRANSACTION_CATEGORIES_WITH_ICONS } from '../../constants';
import type { Transaction, ViewType, Account } from '../../types';
import { formatCurrency, formatDate } from '../../utils/formatters';
import TransactionDetailModal from '../../components/dashboard/transactions/TransactionDetailModal';
import AdvancedFilters from '../../components/dashboard/transactions/AdvancedFilters';
import { useCurrency } from '../../contexts/GlobalSettingsContext';

const StatusBadge: React.FC<{ status: Transaction['status'] }> = ({ status }) => {
    const styles = {
        Completed: 'bg-green-500/20 text-green-300',
        Pending: 'bg-yellow-500/20 text-yellow-300',
        Failed: 'bg-red-500/20 text-red-300',
    };
    return <span className={`px-2 py-1 text-xs font-semibold rounded-full ${styles[status]}`}>{status}</span>;
};

const TransactionItem: React.FC<{ transaction: Transaction, onSelect: () => void }> = ({ transaction, onSelect }) => {
    const { currency, exchangeRate, language } = useCurrency();
    const isIncome = transaction.type === 'income';
    const icon = TRANSACTION_CATEGORIES_WITH_ICONS[transaction.category] || 'fa-receipt';

    const convertedAmount = transaction.amount * exchangeRate;
    const convertedRunningBalance = transaction.runningBalance * exchangeRate;

    return (
        <button onClick={onSelect} className="w-full text-left grid grid-cols-12 items-center gap-4 px-6 py-4 border-b border-white/5 hover:bg-white/5 transition-colors">
            <div className="col-span-1 flex items-center justify-center">
                <div className="w-10 h-10 rounded-full bg-gray-700/50 flex items-center justify-center">
                    {transaction.merchantLogoUrl ? (
                        <img src={transaction.merchantLogoUrl} alt={transaction.description} className="w-6 h-6 rounded-full bg-white p-0.5" />
                    ) : (
                        <i className={`fas ${icon} text-gray-300`}></i>
                    )}
                </div>
            </div>
            <div className="col-span-4">
                <p className="font-bold text-white">{transaction.description}</p>
                <p className="text-sm text-gray-400">{formatDate(transaction.date)}</p>
            </div>
            <div className="col-span-2 text-sm text-gray-400 flex items-center gap-2">
                <i className={`fas ${icon} w-4 text-center text-gray-500`}></i>
                <span>{transaction.category}</span>
            </div>
            <div className="col-span-2"><StatusBadge status={transaction.status} /></div>
            <div className="col-span-3 text-right">
                 <p className={`font-semibold text-lg ${isIncome ? 'text-green-400' : 'text-white'}`}>
                    {isIncome ? '+' : '-'}{formatCurrency(convertedAmount, currency.code, language.code)}
                </p>
                 <p className="text-xs text-gray-500">{formatCurrency(convertedRunningBalance, currency.code, language.code)}</p>
            </div>
        </button>
    );
};

interface TransactionsViewProps {
    setActiveView: (view: ViewType) => void;
}

const TransactionsView: React.FC<TransactionsViewProps> = ({ setActiveView }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({
        type: 'all',
        accountIds: [] as string[],
        category: 'all',
        dateRange: { start: '', end: '' },
    });
    const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

    const filteredTransactions = useMemo(() => {
        return TRANSACTIONS
            .filter(tx => {
                // Search term filter
                const lowercasedSearchTerm = searchTerm.toLowerCase();
                const searchMatch = lowercasedSearchTerm ? (
                    tx.description.toLowerCase().includes(lowercasedSearchTerm) ||
                    tx.category.toLowerCase().includes(lowercasedSearchTerm) ||
                    tx.amount.toString().includes(lowercasedSearchTerm)
                ) : true;

                // Type filter
                const typeMatch = filters.type === 'all' || tx.type === filters.type;

                // Account filter
                const accountMatch = filters.accountIds.length === 0 || filters.accountIds.includes(tx.accountId);

                // Category filter
                const categoryMatch = filters.category === 'all' || tx.category === filters.category;

                // Date range filter
                const txDate = new Date(tx.date);
                const startDate = filters.dateRange.start ? new Date(filters.dateRange.start) : null;
                const endDate = filters.dateRange.end ? new Date(filters.dateRange.end) : null;
                if (startDate) startDate.setHours(0, 0, 0, 0); // Start of the day
                if (endDate) endDate.setHours(23, 59, 59, 999); // End of the day
                const dateMatch = (!startDate || txDate >= startDate) && (!endDate || txDate <= endDate);

                return searchMatch && typeMatch && accountMatch && categoryMatch && dateMatch;
            })
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }, [searchTerm, filters]);

    const exportToCsv = (transactions: Transaction[]) => {
        if (transactions.length === 0) {
            alert("No transactions to export.");
            return;
        }

        const headers = ['ID', 'Date', 'Description', 'Category', 'Type', 'Amount (USD)', 'Status', 'Running Balance (USD)'];
        
        const escapeCsvValue = (value: any): string => {
            const stringValue = String(value ?? '');
            if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
                return `"${stringValue.replace(/"/g, '""')}"`;
            }
            return stringValue;
        };
        
        const csvRows = [
            headers.join(','),
            ...transactions.map(tx => [
                escapeCsvValue(tx.id),
                escapeCsvValue(tx.date),
                escapeCsvValue(tx.description),
                escapeCsvValue(tx.category),
                escapeCsvValue(tx.type),
                escapeCsvValue(tx.amount),
                escapeCsvValue(tx.status),
                escapeCsvValue(tx.runningBalance)
            ].join(','))
        ];

        const csvString = csvRows.join('\n');
        const blob = new Blob(['\uFEFF' + csvString], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        
        const timestamp = new Date().toISOString().replace(/:/g, '-');
        link.setAttribute('href', url);
        link.setAttribute('download', `scb-transactions-${timestamp}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    return (
        <div 
            className="min-h-full bg-gray-900 text-white p-8 bg-cover bg-center"
            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1518655048521-f130df041f66?q=80&w=2070&auto=format&fit=crop')" }}
        >
            <div className="absolute inset-0 bg-gray-900/80 backdrop-blur-sm"></div>
            <div className="relative max-w-7xl mx-auto">
                <h1 className="text-4xl font-bold mb-8 text-shadow-lg">Transaction History</h1>

                <AdvancedFilters 
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    filters={filters}
                    setFilters={setFilters}
                    onExport={() => exportToCsv(filteredTransactions)}
                />

                <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-white/10 shadow-lg overflow-hidden">
                    <div className="grid grid-cols-12 items-center gap-4 px-6 py-3 border-b border-white/10 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                        <div className="col-span-1"></div>
                        <div className="col-span-4">Description</div>
                        <div className="col-span-2">Category</div>
                        <div className="col-span-2">Status</div>
                        <div className="col-span-3 text-right">Amount / Balance</div>
                    </div>
                    <div>
                        {filteredTransactions.map(tx => (
                            <TransactionItem key={tx.id} transaction={tx} onSelect={() => setSelectedTransaction(tx)} />
                        ))}
                    </div>
                    {filteredTransactions.length === 0 && (
                        <div className="text-center p-12 text-gray-500">
                             <i className="fas fa-search text-4xl mb-4"></i>
                            <p className="font-semibold">No transactions found.</p>
                            <p>Try adjusting your search or filters.</p>
                        </div>
                    )}
                </div>
            </div>
            
            {selectedTransaction && (
                <TransactionDetailModal 
                    isOpen={!!selectedTransaction}
                    onClose={() => setSelectedTransaction(null)}
                    transaction={selectedTransaction}
                    setActiveView={setActiveView}
                />
            )}
        </div>
    );
};

export default TransactionsView;
