

import React, { useState, useMemo } from 'react';
import { ACCOUNTS, TRANSACTION_CATEGORIES_WITH_ICONS } from '../../../constants';
import { formatDate } from '../../../utils/formatters';

interface AdvancedFiltersProps {
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    filters: {
        type: string;
        accountIds: string[];
        category: string;
        dateRange: { start: string; end: string };
    };
    setFilters: (filters: AdvancedFiltersProps['filters']) => void;
    onExport: () => void;
}

const AdvancedFilters: React.FC<AdvancedFiltersProps> = ({ searchTerm, setSearchTerm, filters, setFilters, onExport }) => {
    const [showFilters, setShowFilters] = useState(false);
    const allCategories = Object.keys(TRANSACTION_CATEGORIES_WITH_ICONS);
    
    const handleFilterChange = (key: keyof AdvancedFiltersProps['filters'], value: any) => {
        setFilters({ ...filters, [key]: value });
    };

    const handleAccountToggle = (accountId: string) => {
        const newAccountIds = filters.accountIds.includes(accountId)
            ? filters.accountIds.filter(id => id !== accountId)
            : [...filters.accountIds, accountId];
        handleFilterChange('accountIds', newAccountIds);
    };

    const resetFilters = () => {
        setFilters({
            type: 'all',
            accountIds: [],
            category: 'all',
            dateRange: { start: '', end: '' },
        });
        setSearchTerm('');
    };

    const removeFilter = (type: string, value?: any) => {
        switch (type) {
            case 'search':
                setSearchTerm('');
                break;
            case 'type':
                setFilters({ ...filters, type: 'all' });
                break;
            case 'category':
                setFilters({ ...filters, category: 'all' });
                break;
            case 'dateStart':
                setFilters({ ...filters, dateRange: { ...filters.dateRange, start: '' } });
                break;
            case 'dateEnd':
                setFilters({ ...filters, dateRange: { ...filters.dateRange, end: '' } });
                break;
            case 'account':
                setFilters({ ...filters, accountIds: filters.accountIds.filter(id => id !== value) });
                break;
        }
    };
    
    const activeFilterPills = useMemo(() => {
        const pills: { type: string; value?: string; label: string }[] = [];
        if (searchTerm) pills.push({ type: 'search', label: `Search: "${searchTerm}"` });
        if (filters.type !== 'all') pills.push({ type: 'type', label: `Type: ${filters.type.charAt(0).toUpperCase() + filters.type.slice(1)}` });
        if (filters.category !== 'all') pills.push({ type: 'category', label: `Category: ${filters.category}` });
        if (filters.dateRange.start) pills.push({ type: 'dateStart', label: `From: ${formatDate(filters.dateRange.start)}` });
        if (filters.dateRange.end) pills.push({ type: 'dateEnd', label: `To: ${formatDate(filters.dateRange.end)}` });
        filters.accountIds.forEach(id => {
            const account = ACCOUNTS.find(a => a.id === id);
            if (account) {
                pills.push({ type: 'account', value: id, label: `Acc: ${account.number.slice(-4)}` });
            }
        });
        return pills;
    }, [searchTerm, filters]);

    return (
        <div className="bg-gray-800/50 backdrop-blur-sm p-4 rounded-2xl border border-white/10 shadow-lg mb-6">
            <div className="flex items-center gap-4">
                <div className="relative flex-grow">
                     <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
                    <input
                        type="text"
                        placeholder="Search by description, category, or amount..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="w-full bg-gray-900/50 border-gray-600 rounded-full py-2 pl-12 pr-4 text-white focus:ring-yellow-400 focus:border-yellow-400"
                    />
                </div>
                <button onClick={() => setShowFilters(!showFilters)} className="px-4 py-2 text-sm font-semibold rounded-full bg-gray-700/60 hover:bg-gray-700">
                    <i className="fas fa-sliders-h mr-2"></i> Filters {activeFilterPills.length > 0 && `(${activeFilterPills.length})`}
                </button>
                 <button onClick={onExport} className="px-4 py-2 text-sm font-semibold rounded-full bg-gray-700/60 hover:bg-gray-700">
                    <i className="fas fa-file-export mr-2"></i> Export
                </button>
            </div>
            
            {activeFilterPills.length > 0 && (
                <div className="mt-3 pt-3 border-t border-white/10 flex items-center gap-2 flex-wrap">
                    {activeFilterPills.map(pill => (
                        <div key={pill.label} className="bg-yellow-500/20 text-yellow-300 text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1.5">
                            <span>{pill.label}</span>
                            <button onClick={() => removeFilter(pill.type, pill.value)} className="hover:text-white">
                                <i className="fas fa-times-circle"></i>
                            </button>
                        </div>
                    ))}
                    <button onClick={resetFilters} className="text-xs text-red-400 hover:underline ml-auto">Clear all filters</button>
                </div>
            )}

            {showFilters && (
                <div className="mt-4 pt-4 border-t border-white/10 grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                    {/* Date Range */}
                    <div>
                        <label className="block font-semibold mb-1">Date Range</label>
                        <div className="flex gap-2">
                             <input type="date" value={filters.dateRange.start} onChange={e => handleFilterChange('dateRange', { ...filters.dateRange, start: e.target.value })} className="w-full bg-gray-900/50 border-gray-600 rounded-md p-1.5" />
                             <input type="date" value={filters.dateRange.end} onChange={e => handleFilterChange('dateRange', { ...filters.dateRange, end: e.target.value })} className="w-full bg-gray-900/50 border-gray-600 rounded-md p-1.5" />
                        </div>
                    </div>
                    {/* Type */}
                    <div>
                        <label className="block font-semibold mb-1">Type</label>
                        <select value={filters.type} onChange={e => handleFilterChange('type', e.target.value)} className="w-full bg-gray-900/50 border-gray-600 rounded-md p-1.5">
                            <option value="all">All</option>
                            <option value="income">Income</option>
                            <option value="expense">Expense</option>
                        </select>
                    </div>
                    {/* Category */}
                     <div>
                        <label className="block font-semibold mb-1">Category</label>
                        <select value={filters.category} onChange={e => handleFilterChange('category', e.target.value)} className="w-full bg-gray-900/50 border-gray-600 rounded-md p-1.5">
                            <option value="all">All Categories</option>
                            {allCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                        </select>
                    </div>
                    {/* Accounts */}
                    <div>
                        <label className="block font-semibold mb-1">Accounts</label>
                        <div className="space-y-1">
                            {ACCOUNTS.map(account => (
                                <label key={account.id} className="flex items-center gap-2">
                                    <input type="checkbox" checked={filters.accountIds.includes(account.id)} onChange={() => handleAccountToggle(account.id)} className="bg-gray-700 border-gray-500 rounded text-yellow-400 focus:ring-yellow-500" />
                                    <span>{account.type} ({account.number.slice(-4)})</span>
                                </label>
                            ))}
                        </div>
                    </div>
                    <div className="md:col-span-4 flex justify-end mt-2">
                        <button onClick={resetFilters} className="px-4 py-2 text-xs font-semibold rounded-full bg-gray-600/60 hover:bg-gray-600">Reset Filters</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdvancedFilters;