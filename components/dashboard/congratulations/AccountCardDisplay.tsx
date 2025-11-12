import React from 'react';
import type { Account } from '../../../types';
import { USER_SETTINGS } from '../../../constants';
import { formatCurrency } from '../../../utils/formatters';
import { useCurrency } from '../../../contexts/GlobalSettingsContext';

interface AccountCardDisplayProps {
    account: Account;
    isBalanceHidden: boolean;
}

const cardDesigns: Record<Account['type'], { bgImage: string; cardType: 'Visa' | 'Mastercard', cardTypeIcon: string; gradient: string }> = {
    Checking: {
        bgImage: 'https://images.unsplash.com/photo-1620712943543-95fc69afd3a5?q=80&w=2070&auto=format&fit=crop',
        cardType: 'Visa',
        cardTypeIcon: 'fab fa-cc-visa',
        gradient: 'from-blue-900/50 to-black/70'
    },
    Savings: {
        bgImage: 'https://images.unsplash.com/photo-1599387348481-682736f4b6df?q=80&w=1964&auto=format&fit=crop',
        cardType: 'Mastercard',
        cardTypeIcon: 'fab fa-cc-mastercard',
        gradient: 'from-green-900/50 to-black/70'
    },
    Investment: {
        bgImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1964&auto=format&fit=crop',
        cardType: 'Visa',
        cardTypeIcon: 'fab fa-cc-visa',
        gradient: 'from-purple-900/50 to-black/70'
    },
    Credit: {
        bgImage: 'https://images.unsplash.com/photo-1535132819232-a4c103a5b65f?q=80&w=1932&auto=format&fit=crop',
        cardType: 'Mastercard',
        cardTypeIcon: 'fab fa-cc-mastercard',
        gradient: 'from-red-900/50 to-black/70'
    }
};

const AccountCardDisplay: React.FC<AccountCardDisplayProps> = ({ account, isBalanceHidden }) => {
    const { currency, exchangeRate, language } = useCurrency();
    const ownerName = USER_SETTINGS.profile.fullName;
    const design = cardDesigns[account.type];

    const convertedBalance = account.balance * exchangeRate;
    const isNegative = convertedBalance < 0;

    return (
        <div className="relative card-gloss w-full aspect-[1.586] mx-auto rounded-2xl shadow-2xl-soft text-white p-6 flex flex-col justify-between overflow-hidden transform hover:scale-105 transition-transform duration-300">
            <img src={design.bgImage} alt={`${account.type} card background`} className="absolute inset-0 w-full h-full object-cover" />
            <div className={`absolute inset-0 bg-gradient-to-br ${design.gradient}`}></div>
            
            <div className="relative z-10">
                <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                         <i className="fas fa-university text-2xl text-yellow-400"></i>
                         <span className="font-semibold text-sm text-shadow">SCB</span>
                    </div>
                    <i className={`${design.cardTypeIcon} text-4xl text-white/80 text-shadow`}></i>
                </div>
                <div className="mt-4">
                     <p className="text-xs text-gray-300 font-semibold">{account.type} Account Balance</p>
                    <p className={`text-3xl font-bold tracking-tight text-shadow-lg ${isNegative ? 'text-red-400' : ''}`}>
                         {isBalanceHidden ? '••••••' : formatCurrency(convertedBalance, currency.code, language.code)}
                    </p>
                </div>
            </div>

            <div className="relative z-10">
                <p className="font-mono text-xl md:text-2xl tracking-wider text-shadow-lg">{account.number}</p>
                <div className="flex justify-between items-end mt-2 text-sm">
                    <div className="flex items-center gap-2">
                        <img src="https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?q=80&w=2080&auto=format&fit=crop" alt="User" className="w-8 h-8 rounded-full border-2 border-white/50" />
                        <div>
                            <div className="flex items-center gap-1.5">
                                <p className="font-semibold uppercase tracking-wider text-shadow">{ownerName}</p>
                                <span title="Verified Client">
                                    <i className="fas fa-check-circle text-blue-400 text-xs"></i>
                                </span>
                            </div>
                            <p className="text-xs text-gray-300 text-shadow">Account Holder</p>
                        </div>
                    </div>
                    <div>
                        <p className="text-xs text-gray-300 text-shadow">VALID THRU</p>
                        <p className="font-semibold tracking-wider text-shadow">12/28</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AccountCardDisplay;
