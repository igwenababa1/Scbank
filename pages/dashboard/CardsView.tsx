import React, { useState } from 'react';
import { ACCOUNTS, CARDS } from '../../constants';
import type { Card, Account } from '../../types';
import { formatCurrency } from '../../utils/formatters';
import { useCurrency } from '../../contexts/GlobalSettingsContext';

const ControlButton: React.FC<{ icon: string; label: string; onClick?: () => void; disabled?: boolean; isFrozen?: boolean; isAction?: boolean }> = ({ icon, label, onClick, disabled, isFrozen, isAction }) => (
    <button
        onClick={onClick}
        disabled={disabled}
        className={`flex flex-col items-center justify-center p-2 text-center rounded-lg transition-colors duration-200 w-full h-20 ${
            isAction
                ? 'bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900/50 dark:text-blue-300 dark:hover:bg-blue-900'
                : isFrozen
                ? 'bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900/50 dark:text-blue-300 dark:hover:bg-blue-900'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600'
        } disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed dark:disabled:bg-slate-800 dark:disabled:text-slate-500`}
    >
        <i className={`fas ${icon} text-xl mb-1`}></i>
        <span className="text-xs font-semibold">{label}</span>
    </button>
);


const CardsView: React.FC = () => {
    const [isBalanceHidden, setIsBalanceHidden] = useState(false);
    const [cards, setCards] = useState<Card[]>(CARDS);
    const { currency, exchangeRate, language } = useCurrency();

    const handleToggleFreeze = (id: string) => {
        setCards(prevCards =>
            prevCards.map(card =>
                card.id === id ? { ...card, isFrozen: !card.isFrozen } : card
            )
        );
    };

    const totalBalance = ACCOUNTS.reduce((sum, acc) => sum + acc.balance, 0);
    const convertedTotalBalance = totalBalance * exchangeRate;

    const checkingAccount = ACCOUNTS.find(a => a.type === 'Checking');
    const savingsAccount = ACCOUNTS.find(a => a.type === 'Savings');
    const creditAccount = ACCOUNTS.find(a => a.type === 'Credit');

    const checkingCard = cards.find(c => c.id === 'card-1'); // Debit
    const creditCard = cards.find(c => c.id === 'card-2'); // Credit

    const ownerName = "Alex P. Byrne";

    const renderBalance = (balance: number) => {
        if (isBalanceHidden) {
            return <span className="text-2xl font-mono tracking-wider">••••••</span>;
        }
        return formatCurrency(balance * exchangeRate, currency.code, language.code);
    };

    return (
        <div className="p-8 bg-gray-50 dark:bg-slate-900 min-h-full">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
                <div className="flex items-center gap-4">
                    <img src="https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?q=80&w=2080&auto=format&fit=crop" alt="User" className="w-16 h-16 rounded-full" />
                    <div>
                        <div className="flex items-center gap-2">
                             <h1 className="text-3xl font-bold text-[#1a365d] dark:text-white">{ownerName}</h1>
                             <span title="Verified Client">
                                <i className="fas fa-check-circle text-blue-500 text-xl"></i>
                            </span>
                        </div>
                        <p className="text-gray-500 dark:text-gray-400">Here's an overview of your accounts and cards.</p>
                    </div>
                </div>
                <div className="flex items-center gap-4 mt-4 md:mt-0">
                     <div className="text-right">
                        <p className="text-sm text-gray-500 dark:text-gray-400">Total Balance</p>
                        <p className="text-2xl font-bold text-[#1a365d] dark:text-white">
                            {renderBalance(totalBalance)}
                        </p>
                     </div>
                    <button onClick={() => setIsBalanceHidden(!isBalanceHidden)} className="w-10 h-10 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-200 dark:text-gray-400 dark:hover:bg-slate-700 transition-colors">
                        <i className={`fas ${isBalanceHidden ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                    </button>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="space-y-8">
                {/* Checking Account + Card */}
                {checkingAccount && checkingCard && (
                    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
                            <div className="md:col-span-1">
                                <h3 className="font-bold text-xl text-[#1a365d] dark:text-white">Primary Checking</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">{checkingAccount.number}</p>
                                <p className="text-3xl font-bold text-gray-800 dark:text-gray-100">{renderBalance(checkingAccount.balance)}</p>
                                <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 md:grid-cols-2 gap-2">
                                     <ControlButton icon={checkingCard.isFrozen ? "fa-unlock" : "fa-snowflake"} label={checkingCard.isFrozen ? 'Unfreeze' : 'Freeze'} onClick={() => handleToggleFreeze(checkingCard.id)} isFrozen={checkingCard.isFrozen}/>
                                     <ControlButton icon="fa-sliders-h" label="Details" disabled={checkingCard.isFrozen} />
                                     <ControlButton icon="fa-wallet" label="Add to Wallet" disabled={checkingCard.isFrozen} />
                                     <ControlButton icon="fa-ellipsis-h" label="More" disabled={checkingCard.isFrozen} />
                                </div>
                            </div>
                            <div className="md:col-span-2 relative card-gloss w-full max-w-lg aspect-[1.586] mx-auto rounded-xl shadow-xl text-white p-6 flex flex-col justify-between overflow-hidden self-center">
                                <img src="https://images.unsplash.com/photo-1620712943543-95fc69afd3a5?q=80&w=2070&auto=format&fit=crop" alt="Debit Card" className="absolute inset-0 w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-black/30"></div>
                                {checkingCard.isFrozen && (<div className="absolute inset-0 bg-blue-900/70 backdrop-blur-sm flex items-center justify-center z-20"><i className="fas fa-snowflake text-5xl text-white/80"></i></div>)}
                                <div className="relative z-10 flex justify-between items-start">
                                    <i className="fab fa-cc-visa text-5xl"></i>
                                    <span className="font-semibold text-shadow">DEBIT</span>
                                </div>
                                <div className="relative z-10">
                                    <p className="font-mono text-xl md:text-2xl tracking-wider text-shadow-lg">{checkingCard.number}</p>
                                    <div className="flex justify-between items-end mt-2 text-sm">
                                        <p className="font-semibold uppercase tracking-wider text-shadow">{checkingCard.nameOnCard}</p>
                                        <p className="font-semibold tracking-wider text-shadow">{checkingCard.expiry}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                
                {/* Savings & Credit in a sub-grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Savings Account */}
                    {savingsAccount && (
                         <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg flex flex-col">
                            <h3 className="font-bold text-xl text-[#1a365d] dark:text-white">High-Yield Savings</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">{savingsAccount.number}</p>
                            <p className="text-3xl font-bold text-gray-800 dark:text-gray-100 flex-grow">{renderBalance(savingsAccount.balance)}</p>
                             <div className="mt-4 grid grid-cols-3 gap-2">
                                <ControlButton icon="fa-paper-plane" label="Transfer" isAction />
                                <ControlButton icon="fa-piggy-bank" label="Deposit" isAction />
                                <ControlButton icon="fa-star" label="Goals" isAction />
                             </div>
                        </div>
                    )}

                    {/* Credit Account + Card */}
                     {creditAccount && creditCard && (
                        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg">
                             <div className="flex justify-between items-start mb-2">
                                <div>
                                    <h3 className="font-bold text-xl text-[#1a365d] dark:text-white">Platinum Credit</h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">{creditAccount.number}</p>
                                </div>
                                <p className="text-2xl font-bold text-red-500 dark:text-red-400">{renderBalance(creditAccount.balance)}</p>
                             </div>
                            <div className="relative card-gloss w-full max-w-sm aspect-[1.586] mx-auto rounded-xl shadow-xl text-white p-5 flex flex-col justify-between overflow-hidden my-4">
                                <img src="https://images.unsplash.com/photo-1535132819232-a4c103a5b65f?q=80&w=1932&auto=format&fit=crop" alt="Credit Card" className="absolute inset-0 w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-black/40"></div>
                                {creditCard.isFrozen && (<div className="absolute inset-0 bg-blue-900/70 backdrop-blur-sm flex items-center justify-center z-20"><i className="fas fa-snowflake text-4xl text-white/80"></i></div>)}
                                <div className="relative z-10 flex justify-between items-start">
                                    <i className="fab fa-cc-mastercard text-4xl"></i>
                                    <span className="font-semibold text-shadow">CREDIT</span>
                                </div>
                                <div className="relative z-10">
                                    <p className="font-mono text-xl tracking-wider text-shadow-lg">{creditCard.number}</p>
                                    <p className="font-semibold uppercase tracking-wider text-xs text-shadow">{creditCard.nameOnCard}</p>
                                </div>
                            </div>
                             <div className="grid grid-cols-3 gap-2">
                                <ControlButton icon={creditCard.isFrozen ? "fa-unlock" : "fa-snowflake"} label={creditCard.isFrozen ? 'Unfreeze' : 'Freeze'} onClick={() => handleToggleFreeze(creditCard.id)} isFrozen={creditCard.isFrozen} />
                                <ControlButton icon="fa-file-invoice-dollar" label="Payment" disabled={creditCard.isFrozen} isAction />
                                <ControlButton icon="fa-receipt" label="Statement" disabled={creditCard.isFrozen} isAction />
                             </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CardsView;
