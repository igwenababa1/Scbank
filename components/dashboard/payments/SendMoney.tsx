
import React, { useState, useEffect } from 'react';
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
    const [itccCode, setItccCode] = useState('');
    
    const [isConfirming, setIsConfirming] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [processingStepIndex, setProcessingStepIndex] = useState(0);

    const amountNum = parseFloat(amount) || 0;
    
    // ITCC Logic: Code must start with "ITCC" to be considered valid for this simulation
    const isItccValid = itccCode.trim().toUpperCase().startsWith('ITCC');
    const surchargeRate = isItccValid ? 0 : 0.15;
    const surchargeAmount = amountNum * surchargeRate;
    const totalDebit = amountNum + surchargeAmount;

    const processingSteps = [
        { label: "Initiating Secure Handshake", icon: "fa-handshake", duration: 1200 },
        { label: "Encrypting Payload (AES-256)", icon: "fa-key", duration: 1500 },
        { label: "Verifying ITCC Compliance Protocol", icon: "fa-file-contract", duration: 2000, checkCompliance: true },
        { label: "Routing via SWIFT/SEPA Network", icon: "fa-network-wired", duration: 1800 },
        { label: "Finalizing Settlement", icon: "fa-check-double", duration: 1000 }
    ];

    const handleConfirm = () => {
        setIsProcessing(true);
        let currentStep = 0;
        setProcessingStepIndex(0);

        const processNextStep = () => {
            if (currentStep >= processingSteps.length) {
                setTimeout(finalizeTransaction, 800);
                return;
            }
            
            const stepDuration = processingSteps[currentStep].duration;
            
            setTimeout(() => {
                currentStep++;
                setProcessingStepIndex(currentStep);
                processNextStep();
            }, stepDuration);
        };

        processNextStep();
    };

    const finalizeTransaction = () => {
        const newReceipt = {
            vendor: `Payment to ${selectedContact?.name}`,
            vendorLogo: selectedContact?.avatarUrl || '',
            date: new Date().toISOString(),
            total: totalDebit,
            category: 'Payments',
            items: [
                { name: `Principal Amount`, quantity: 1, price: amountNum },
                ...(surchargeAmount > 0 ? [{ name: `Non-Compliance Surcharge (15%)`, quantity: 1, price: surchargeAmount }] : []),
                { name: `Note: "${note || 'N/A'}"`, quantity: 1, price: 0 }
            ],
        };
        addReceiptAndNavigate(newReceipt, setActiveView);
    };

    if (isProcessing) {
        const currentStep = processingSteps[Math.min(processingStepIndex, processingSteps.length - 1)];
        
        return (
            <div className="relative h-[600px] flex flex-col items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-black">
                {/* Animated Background Grid */}
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 animate-[pulse_4s_ease-in-out_infinite]"></div>
                <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black opacity-80"></div>
                
                <div className="relative z-10 w-full max-w-md px-6">
                    <div className="text-center mb-12">
                         <div className="relative w-20 h-20 mx-auto mb-6">
                            <div className="absolute inset-0 border-t-4 border-[#e6b325] rounded-full animate-spin"></div>
                            <div className="absolute inset-2 border-r-4 border-blue-500 rounded-full animate-spin [animation-direction:reverse]"></div>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <i className={`fas ${currentStep.icon} text-2xl text-white`}></i>
                            </div>
                        </div>
                        <h3 className="text-2xl font-bold text-white tracking-tight mb-2">Processing Transaction</h3>
                        <p className="text-blue-400 font-mono text-xs uppercase tracking-widest">ID: {Date.now().toString(36).toUpperCase()}</p>
                    </div>

                    <div className="space-y-6 relative">
                        {/* Vertical Line */}
                        <div className="absolute left-[19px] top-4 bottom-4 w-0.5 bg-gray-800 z-0"></div>
                        
                        {processingSteps.map((step, index) => {
                            const isActive = index === processingStepIndex;
                            const isCompleted = index < processingStepIndex;
                            const isPending = index > processingStepIndex;
                            
                            // Special Logic for Compliance Step
                            let statusIcon = "fa-circle";
                            let statusColor = "text-gray-600";
                            let statusBg = "bg-gray-900";

                            if (isCompleted) {
                                statusIcon = "fa-check-circle";
                                statusColor = "text-green-500";
                                statusBg = "bg-green-900/20";
                                if (step.checkCompliance && !isItccValid) {
                                    statusIcon = "fa-exclamation-triangle";
                                    statusColor = "text-orange-500";
                                    statusBg = "bg-orange-900/20";
                                }
                            } else if (isActive) {
                                statusIcon = "fa-dot-circle";
                                statusColor = "text-yellow-400 animate-pulse";
                                statusBg = "bg-yellow-900/20";
                            }

                            return (
                                <div key={index} className={`relative z-10 flex items-center gap-4 transition-all duration-500 ${isActive ? 'scale-105 translate-x-2' : 'opacity-50'}`}>
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${isActive ? 'border-yellow-400' : 'border-gray-700'} ${statusBg} ${statusColor}`}>
                                        <i className={`fas ${statusIcon}`}></i>
                                    </div>
                                    <div className="flex-grow">
                                        <p className={`text-sm font-bold ${isActive ? 'text-white' : 'text-gray-400'}`}>{step.label}</p>
                                        {step.checkCompliance && isActive && !isItccValid && (
                                            <p className="text-[10px] text-red-400 font-mono mt-1">ITCC MISSING - SURCHARGE APPLIED</p>
                                        )}
                                         {step.checkCompliance && isCompleted && !isItccValid && (
                                            <p className="text-[10px] text-orange-400 font-mono mt-1">CLEARED WITH SURCHARGE</p>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        );
    }

    if (isConfirming) {
        return (
            <div className="animate-fade-in-scale-up max-w-2xl mx-auto py-6">
                <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200 relative">
                    {/* Receipt Header */}
                    <div className="bg-[#1a365d] p-8 text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <i className="fas fa-university text-9xl"></i>
                        </div>
                        <p className="text-blue-200 text-xs font-bold uppercase tracking-widest mb-2">Confirm Transaction</p>
                        <h2 className="text-4xl font-extrabold tracking-tight">{formatCurrency(totalDebit)}</h2>
                        <p className="text-sm text-blue-300 mt-1">Total Debit Amount</p>
                        
                        {!isItccValid && (
                            <div className="mt-6 bg-red-500/20 border border-red-400/30 rounded-lg p-3 flex items-start gap-3">
                                <i className="fas fa-exclamation-triangle text-red-300 mt-1"></i>
                                <div>
                                    <p className="text-xs font-bold text-red-200 uppercase tracking-wide">Compliance Notice</p>
                                    <p className="text-xs text-red-100">Missing ITCC code. A 15% surcharge has been applied to this international transfer.</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Receipt Body */}
                    <div className="p-8 space-y-6">
                        <div className="flex items-center justify-between pb-6 border-b border-gray-100">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                                    <img src={selectedContact?.avatarUrl} className="w-10 h-10 rounded-full" alt="" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 uppercase tracking-wider font-bold">Recipient</p>
                                    <p className="text-lg font-bold text-gray-800">{selectedContact?.name}</p>
                                </div>
                            </div>
                             <div className="text-right">
                                <p className="text-xs text-gray-500 uppercase tracking-wider font-bold">Date</p>
                                <p className="text-sm font-bold text-gray-800">{new Date().toLocaleDateString()}</p>
                            </div>
                        </div>

                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-500">Source Account</span>
                                <span className="font-mono font-semibold text-gray-800">{fromAccount.number}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">Principal Amount</span>
                                <span className="font-semibold text-gray-800">{formatCurrency(amountNum)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className={`${surchargeAmount > 0 ? 'text-red-600 font-bold' : 'text-gray-500'}`}>
                                    Regulatory Surcharge (15%)
                                </span>
                                <span className={`${surchargeAmount > 0 ? 'text-red-600 font-bold' : 'text-green-600 font-bold'}`}>
                                    {surchargeAmount > 0 ? '+' : ''}{formatCurrency(surchargeAmount)}
                                </span>
                            </div>
                            {note && (
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Note</span>
                                    <span className="italic text-gray-800">"{note}"</span>
                                </div>
                            )}
                        </div>

                        <div className="pt-6 border-t border-gray-100">
                            <div className="flex gap-4">
                                <button onClick={() => setIsConfirming(false)} className="flex-1 py-3 rounded-xl border border-gray-300 text-gray-600 font-bold hover:bg-gray-50 transition-colors">
                                    Cancel
                                </button>
                                <button onClick={handleConfirm} className="flex-[2] py-3 rounded-xl bg-gradient-to-r from-[#1a365d] to-[#2d5c8a] text-white font-bold hover:shadow-lg transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2">
                                    <i className="fas fa-fingerprint"></i> Authorize Transfer
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
    
    return (
        <div className="animate-fade-in-scale-up">
            <div className="max-w-4xl mx-auto">
                {/* Amount Section */}
                <div className="text-center mb-10">
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-[0.2em] mb-4">Enter Amount</label>
                    <div className="relative inline-block group">
                         <input 
                            type="number" 
                            value={amount} 
                            onChange={e => setAmount(e.target.value)} 
                            placeholder="0.00" 
                            className="w-full bg-transparent text-6xl md:text-8xl font-light text-white text-center border-none focus:ring-0 placeholder-gray-700 outline-none transition-all group-hover:scale-105" 
                            autoFocus 
                        />
                         <span className="absolute top-4 -left-6 md:-left-8 text-3xl md:text-5xl text-gray-500">$</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Recipient & Source */}
                    <div className="space-y-6">
                        <div className="bg-white/5 rounded-2xl p-6 border border-white/10 backdrop-blur-sm">
                            <label className="block text-xs font-bold text-yellow-400 uppercase tracking-wider mb-4">Beneficiary</label>
                            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                                {CONTACTS.map(contact => (
                                    <button 
                                        key={contact.id} 
                                        onClick={() => setSelectedContact(contact)} 
                                        className={`flex-shrink-0 group relative transition-all duration-300 ${selectedContact?.id === contact.id ? 'opacity-100' : 'opacity-60 hover:opacity-100'}`}
                                    >
                                        <div className={`w-16 h-16 rounded-full p-1 mb-2 transition-all ${selectedContact?.id === contact.id ? 'bg-gradient-to-tr from-yellow-400 to-orange-500 shadow-lg shadow-yellow-500/30 scale-110' : 'bg-gray-700'}`}>
                                            <img src={contact.avatarUrl} alt={contact.name} className="w-full h-full rounded-full border-2 border-[#0b1120] object-cover" />
                                        </div>
                                        <p className={`text-xs font-bold text-center ${selectedContact?.id === contact.id ? 'text-yellow-400' : 'text-gray-400'}`}>{contact.name.split(' ')[0]}</p>
                                    </button>
                                ))}
                                <button className="flex-shrink-0 w-16 h-16 rounded-full bg-white/5 border border-dashed border-gray-500 flex items-center justify-center text-gray-400 hover:text-white hover:border-white transition-all">
                                    <i className="fas fa-plus"></i>
                                </button>
                            </div>
                        </div>

                        <div className="bg-white/5 rounded-2xl p-6 border border-white/10 backdrop-blur-sm">
                             <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Source Account</label>
                             <select 
                                onChange={e => setFromAccount(ACCOUNTS.find(a => a.id === e.target.value) || ACCOUNTS[0])} 
                                className="w-full bg-[#0b1120] border border-white/20 rounded-xl px-4 py-3 text-white focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 outline-none"
                            >
                                {ACCOUNTS.filter(a => a.type !== 'Credit').map(acc => <option key={acc.id} value={acc.id}>{acc.type} (...{acc.number.slice(-4)}) - {formatCurrency(acc.balance)}</option>)}
                            </select>
                        </div>
                    </div>

                    {/* Compliance & Details */}
                    <div className="space-y-6">
                        <div className={`rounded-2xl p-6 border backdrop-blur-sm transition-all duration-300 ${isItccValid ? 'bg-green-900/10 border-green-500/30' : 'bg-white/5 border-white/10'}`}>
                             <div className="flex justify-between items-start mb-2">
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider">ITCC Compliance Code</label>
                                {isItccValid && <i className="fas fa-shield-check text-green-400 text-lg"></i>}
                             </div>
                             <input 
                                type="text" 
                                value={itccCode} 
                                onChange={e => setItccCode(e.target.value)} 
                                placeholder="e.g., ITCC-8X92-001"
                                className="w-full bg-transparent border-b border-gray-600 py-2 text-white placeholder-gray-600 focus:border-yellow-400 focus:outline-none font-mono tracking-wider"
                            />
                            <p className={`text-[10px] mt-2 ${isItccValid ? 'text-green-400' : 'text-gray-500'}`}>
                                {isItccValid ? 'Code Verified. Surcharge Waived.' : 'Required for fee waiver on international transfers.'}
                            </p>
                        </div>

                        <div className="bg-white/5 rounded-2xl p-6 border border-white/10 backdrop-blur-sm">
                             <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Reference / Memo</label>
                             <input 
                                type="text" 
                                value={note} 
                                onChange={e => setNote(e.target.value)} 
                                placeholder="What is this payment for?"
                                className="w-full bg-transparent border-b border-gray-600 py-2 text-white placeholder-gray-600 focus:border-yellow-400 focus:outline-none" 
                            />
                        </div>
                        
                         <button 
                            onClick={() => setIsConfirming(true)} 
                            disabled={!selectedContact || amountNum <= 0} 
                            className="w-full py-4 rounded-xl bg-yellow-400 text-[#1a365d] font-bold text-lg hover:bg-yellow-300 shadow-lg shadow-yellow-400/20 transition-all transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                        >
                            Proceed to Review
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SendMoney;
