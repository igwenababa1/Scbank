
import React, { useState, useEffect, useMemo } from 'react';
import type { ViewType, Account, Contact } from '../../../types';
import { ACCOUNTS, CONTACTS } from '../../../constants';
import { formatCurrency } from '../../../utils/formatters';
import { useDashboard } from '../../../contexts/DashboardContext';

interface SendMoneyProps {
    setActiveView: (view: ViewType) => void;
}

// Mock database of banks for routing number lookup simulation
const BANK_DATABASE: Record<string, { name: string; logo: string; color: string }> = {
    '021': { name: 'JPMorgan Chase', logo: 'https://logo.clearbit.com/chase.com', color: 'bg-blue-900' },
    '122': { name: 'Bank of America', logo: 'https://logo.clearbit.com/bankofamerica.com', color: 'bg-red-700' },
    '063': { name: 'Wells Fargo', logo: 'https://logo.clearbit.com/wellsfargo.com', color: 'bg-yellow-700' },
    '325': { name: 'Citibank', logo: 'https://logo.clearbit.com/citi.com', color: 'bg-blue-600' },
    '000': { name: 'External Bank', logo: 'https://img.icons8.com/ios-filled/50/ffffff/bank.png', color: 'bg-gray-700' }
};

const SendMoney: React.FC<SendMoneyProps> = ({ setActiveView }) => {
    const { addReceiptAndNavigate } = useDashboard();
    
    // Tabs: 'contact' or 'manual'
    const [recipientMode, setRecipientMode] = useState<'contact' | 'manual'>('contact');
    
    // Transaction Data
    const [amount, setAmount] = useState('');
    const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
    const [fromAccount, setFromAccount] = useState<Account>(ACCOUNTS[0]);
    const [note, setNote] = useState('');
    const [itccCode, setItccCode] = useState('');
    
    // Manual Entry Data
    const [manualName, setManualName] = useState('');
    const [routingNumber, setRoutingNumber] = useState('');
    const [accountNumber, setAccountNumber] = useState('');
    const [detectedBank, setDetectedBank] = useState<{ name: string; logo: string; color: string } | null>(null);
    const [isValidatingRouting, setIsValidatingRouting] = useState(false);

    // Flow State
    const [isConfirming, setIsConfirming] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [processingStepIndex, setProcessingStepIndex] = useState(0);
    const [complianceAcknowledged, setComplianceAcknowledged] = useState(false);

    const amountNum = parseFloat(amount) || 0;
    
    // ITCC Logic
    const isItccValid = itccCode.trim().toUpperCase().startsWith('ITCC');
    const surchargeRate = isItccValid ? 0 : 0.15;
    const surchargeAmount = amountNum * surchargeRate;
    const totalDebit = amountNum + surchargeAmount;

    // Bank Lookup Simulation
    useEffect(() => {
        if (routingNumber.length >= 3) {
            setIsValidatingRouting(true);
            const prefix = routingNumber.substring(0, 3);
            const timer = setTimeout(() => {
                setDetectedBank(BANK_DATABASE[prefix] || BANK_DATABASE['000']);
                setIsValidatingRouting(false);
            }, 800);
            return () => clearTimeout(timer);
        } else {
            setDetectedBank(null);
        }
    }, [routingNumber]);

    // Determine Target Details for Display/Processing
    const targetDetails = useMemo(() => {
        if (recipientMode === 'contact' && selectedContact) {
            return {
                name: selectedContact.name,
                bank: 'Linked Account',
                account: '•••• ' + Math.floor(1000 + Math.random() * 9000), // Mock
                logo: selectedContact.avatarUrl,
                isManual: false
            };
        } else {
            return {
                name: manualName,
                bank: detectedBank?.name || 'Unknown Bank',
                account: accountNumber ? `•••• ${accountNumber.slice(-4)}` : '••••',
                logo: detectedBank?.logo || 'https://img.icons8.com/ios-filled/50/ffffff/bank.png',
                isManual: true
            };
        }
    }, [recipientMode, selectedContact, manualName, detectedBank, accountNumber]);

    const processingSteps = useMemo(() => {
        const steps = [
            { label: "Authenticating Secure Channel...", icon: "fa-fingerprint", duration: 1000 },
            { label: `Connecting to ${targetDetails.bank} Gateway...`, icon: "fa-university", duration: 1500 },
            { label: "Verifying Account Existence...", icon: "fa-search-dollar", duration: 1200 },
        ];

        if (isItccValid) {
            steps.push({ label: "Verifying ITCC Compliance Protocol...", icon: "fa-file-contract", duration: 1500 });
        } else {
            steps.push({ label: "Acquiring Temporary ITCC Token...", icon: "fa-key", duration: 2000 });
            steps.push({ label: "Processing Compliance Fee...", icon: "fa-file-invoice-dollar", duration: 1500 });
        }

        steps.push({ label: "Executing Interbank Settlement...", icon: "fa-network-wired", duration: 1800 });
        steps.push({ label: "Transaction Finalized", icon: "fa-check-double", duration: 800 });

        return steps;
    }, [isItccValid, targetDetails]);

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
            vendor: `Payment to ${targetDetails.name}`,
            vendorLogo: targetDetails.logo,
            date: new Date().toISOString(),
            total: totalDebit,
            category: 'Payments',
            items: [
                { name: `Transfer to ${targetDetails.bank}`, quantity: 1, price: amountNum },
                { name: `Account: ${targetDetails.account}`, quantity: 1, price: 0 },
                ...(surchargeAmount > 0 ? [{ name: `ITCC Code Acquisition Fee`, quantity: 1, price: surchargeAmount }] : []),
                { name: `Ref: "${note || 'N/A'}"`, quantity: 1, price: 0 }
            ],
        };
        addReceiptAndNavigate(newReceipt, setActiveView);
    };
    
    const handleContactSupport = () => {
        alert("Priority Support: Connecting you to an agent for ITCC code assistance...");
    };

    // Validation
    const isFormValid = amountNum > 0 && (
        (recipientMode === 'contact' && selectedContact) ||
        (recipientMode === 'manual' && manualName && routingNumber.length >= 9 && accountNumber.length >= 8)
    );

    if (isProcessing) {
        const currentStep = processingSteps[Math.min(processingStepIndex, processingSteps.length - 1)];
        
        return (
            <div className="relative h-[600px] flex flex-col items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-black">
                {/* Animated Background Grid */}
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 animate-[pulse_4s_ease-in-out_infinite]"></div>
                <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black opacity-90"></div>
                
                <div className="relative z-10 w-full max-w-md px-6">
                    <div className="text-center mb-12">
                         <div className="relative w-24 h-24 mx-auto mb-6">
                            <div className="absolute inset-0 border-t-4 border-[#e6b325] rounded-full animate-spin"></div>
                            <div className="absolute inset-2 border-r-4 border-blue-500 rounded-full animate-spin [animation-direction:reverse]"></div>
                            <div className="absolute inset-0 flex items-center justify-center bg-gray-900 rounded-full border-4 border-gray-800">
                                <i className={`fas ${currentStep.icon} text-3xl text-white`}></i>
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
                            
                            let statusIcon = "fa-circle";
                            let statusColor = "text-gray-600";
                            let statusBg = "bg-gray-900";

                            if (isCompleted) {
                                statusIcon = "fa-check-circle";
                                statusColor = "text-green-500";
                                statusBg = "bg-green-900/20";
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
                        <h2 className="text-5xl font-extrabold tracking-tight">{formatCurrency(totalDebit)}</h2>
                        <p className="text-sm text-blue-300 mt-1">Total Debit Amount</p>
                        
                        {!isItccValid && (
                            <div className="mt-6 bg-red-600/20 border border-red-400/30 rounded-lg p-3 flex items-start gap-3 backdrop-blur-sm animate-pulse">
                                <i className="fas fa-exclamation-triangle text-red-300 mt-1"></i>
                                <div>
                                    <p className="text-xs font-bold text-red-200 uppercase tracking-wide">ITCC Code Missing</p>
                                    <p className="text-xs text-red-100">Mandatory compliance acquisition required.</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Receipt Body */}
                    <div className="p-8 space-y-6">
                        <div className="flex items-center justify-between pb-6 border-b border-gray-100">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center border border-gray-200 overflow-hidden">
                                    <img src={targetDetails.logo} className="w-full h-full object-cover" alt="" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 uppercase tracking-wider font-bold">Beneficiary</p>
                                    <p className="text-xl font-bold text-gray-800">{targetDetails.name}</p>
                                    <p className="text-xs text-gray-500">{targetDetails.bank} • {targetDetails.account}</p>
                                </div>
                            </div>
                             <div className="text-right">
                                <p className="text-xs text-gray-500 uppercase tracking-wider font-bold">Date</p>
                                <p className="text-sm font-bold text-gray-800">{new Date().toLocaleDateString()}</p>
                            </div>
                        </div>

                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                                <span className="text-gray-500 font-medium">Source Account</span>
                                <span className="font-mono font-bold text-gray-800">{fromAccount.type} ({fromAccount.number})</span>
                            </div>
                            
                            <div className="h-px bg-gray-200 my-2"></div>

                            <div className="flex justify-between">
                                <span className="text-gray-500">Principal Amount</span>
                                <span className="font-semibold text-gray-800">{formatCurrency(amountNum)}</span>
                            </div>
                            
                            {surchargeAmount > 0 ? (
                                <div className="flex justify-between bg-red-50 p-2 rounded border border-red-100">
                                    <span className="text-red-700 font-bold flex items-center gap-2">
                                        <i className="fas fa-shield-alt"></i> ITCC Acquisition Fee
                                    </span>
                                    <span className="text-red-700 font-bold">
                                        +{formatCurrency(surchargeAmount)}
                                    </span>
                                </div>
                            ) : (
                                <div className="flex justify-between">
                                    <span className="text-green-600 font-medium">ITCC Code Verified</span>
                                    <span className="text-green-600 font-bold">Waived</span>
                                </div>
                            )}
                            
                            {note && (
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Note</span>
                                    <span className="italic text-gray-800">"{note}"</span>
                                </div>
                            )}
                        </div>

                        {!isItccValid && (
                            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-xs text-gray-600 leading-relaxed">
                                <p className="font-bold text-gray-800 mb-1"><i className="fas fa-file-contract mr-1"></i> Digital Payment Note:</p>
                                <p>
                                    Pursuant to International Banking Regulation 402(c), transactions lacking a pre-registered ITCC identifier must acquire a temporary compliance token. 
                                    By proceeding, you authorize the <strong>Automatic ITCC Code Acquisition Fee</strong> of {formatCurrency(surchargeAmount)} to be debited from your account to facilitate immediate regulatory clearance.
                                </p>
                                <label className="flex items-start gap-3 mt-3 cursor-pointer">
                                    <input 
                                        type="checkbox" 
                                        checked={complianceAcknowledged} 
                                        onChange={e => setComplianceAcknowledged(e.target.checked)} 
                                        className="mt-0.5 w-4 h-4 text-[#1a365d] rounded border-gray-300 focus:ring-[#1a365d]"
                                    />
                                    <span className="font-bold text-gray-800">I accept the ITCC Acquisition Fee and authorize this transaction.</span>
                                </label>
                            </div>
                        )}

                        <div className="pt-6 border-t border-gray-100">
                            <div className="flex gap-4">
                                <button onClick={() => setIsConfirming(false)} className="flex-1 py-3 rounded-xl border border-gray-300 text-gray-600 font-bold hover:bg-gray-50 transition-colors">
                                    Modify
                                </button>
                                <button 
                                    onClick={handleConfirm} 
                                    disabled={!isItccValid && !complianceAcknowledged}
                                    className="flex-[2] py-3 rounded-xl bg-gradient-to-r from-[#1a365d] to-[#2d5c8a] text-white font-bold hover:shadow-lg transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                                >
                                    <i className="fas fa-fingerprint"></i> 
                                    {isItccValid ? "Authorize Transfer" : "Pay Fee & Authorize"}
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
            <div className="max-w-5xl mx-auto">
                {/* Amount Section */}
                <div className="text-center mb-10">
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-[0.2em] mb-4">Transfer Amount</label>
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

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Left Column: Recipient */}
                    <div className="space-y-6">
                        <div className="bg-white/5 rounded-2xl p-6 border border-white/10 backdrop-blur-sm">
                            <div className="flex items-center justify-between mb-6">
                                <label className="block text-xs font-bold text-yellow-400 uppercase tracking-wider">Beneficiary Details</label>
                                <div className="flex bg-black/40 rounded-lg p-1">
                                    <button 
                                        onClick={() => setRecipientMode('contact')} 
                                        className={`px-3 py-1 text-xs font-bold rounded-md transition-colors ${recipientMode === 'contact' ? 'bg-white text-black' : 'text-gray-400 hover:text-white'}`}
                                    >
                                        Saved
                                    </button>
                                    <button 
                                        onClick={() => setRecipientMode('manual')} 
                                        className={`px-3 py-1 text-xs font-bold rounded-md transition-colors ${recipientMode === 'manual' ? 'bg-white text-black' : 'text-gray-400 hover:text-white'}`}
                                    >
                                        New Recipient
                                    </button>
                                </div>
                            </div>

                            {recipientMode === 'contact' ? (
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
                                </div>
                            ) : (
                                <div className="space-y-4 animate-fade-in-status-item">
                                    <div>
                                        <label className="text-[10px] text-gray-400 uppercase font-bold mb-1 block">Legal Name</label>
                                        <input 
                                            type="text" 
                                            value={manualName}
                                            onChange={e => setManualName(e.target.value)}
                                            placeholder="Beneficiary Name" 
                                            className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:border-yellow-400 outline-none transition-colors"
                                        />
                                    </div>
                                    
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-[10px] text-gray-400 uppercase font-bold mb-1 block">Routing (ABA)</label>
                                            <div className="relative">
                                                <input 
                                                    type="text" 
                                                    maxLength={9}
                                                    value={routingNumber}
                                                    onChange={e => setRoutingNumber(e.target.value)}
                                                    placeholder="9 Digits" 
                                                    className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:border-yellow-400 outline-none transition-colors font-mono"
                                                />
                                                {isValidatingRouting && (
                                                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                                        <i className="fas fa-circle-notch fa-spin text-yellow-400 text-xs"></i>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <div>
                                            <label className="text-[10px] text-gray-400 uppercase font-bold mb-1 block">Account Number</label>
                                            <input 
                                                type="text" 
                                                value={accountNumber}
                                                onChange={e => setAccountNumber(e.target.value)}
                                                placeholder="Account #" 
                                                className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:border-yellow-400 outline-none transition-colors font-mono"
                                            />
                                        </div>
                                    </div>

                                    {/* Detected Bank Display */}
                                    <div className={`p-3 rounded-lg border border-white/10 flex items-center gap-3 transition-all duration-500 ${detectedBank ? 'bg-white/10 opacity-100' : 'bg-transparent opacity-50'}`}>
                                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${detectedBank?.color || 'bg-gray-700'}`}>
                                            {detectedBank ? (
                                                <img src={detectedBank.logo} alt="Bank Logo" className="w-6 h-6 object-contain" />
                                            ) : (
                                                <i className="fas fa-university text-gray-400"></i>
                                            )}
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-400 uppercase font-bold">Receiving Bank</p>
                                            <p className="text-sm font-bold text-white">{detectedBank?.name || 'Waiting for Routing #'}</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="bg-white/5 rounded-2xl p-6 border border-white/10 backdrop-blur-sm">
                             <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Source Account</label>
                             <select 
                                onChange={e => setFromAccount(ACCOUNTS.find(a => a.id === e.target.value) || ACCOUNTS[0])} 
                                className="w-full bg-[#0b1120] border border-white/20 rounded-xl px-4 py-3 text-white focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 outline-none cursor-pointer"
                            >
                                {ACCOUNTS.filter(a => a.type !== 'Credit').map(acc => <option key={acc.id} value={acc.id}>{acc.type} (...{acc.number.slice(-4)}) - {formatCurrency(acc.balance)}</option>)}
                            </select>
                        </div>
                    </div>

                    {/* Right Column: Compliance & Details */}
                    <div className="space-y-6">
                        <div className={`rounded-2xl p-6 border backdrop-blur-sm transition-all duration-300 ${isItccValid ? 'bg-green-900/10 border-green-500/30' : 'bg-white/5 border-white/10'}`}>
                             <div className="flex justify-between items-start mb-2">
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider">
                                    ITCC Compliance Code <span className="text-red-400">*</span>
                                </label>
                                {isItccValid && <i className="fas fa-shield-check text-green-400 text-lg"></i>}
                             </div>
                             <input 
                                type="text" 
                                value={itccCode} 
                                onChange={e => setItccCode(e.target.value)} 
                                placeholder="e.g., ITCC-8X92-001"
                                className="w-full bg-transparent border-b border-gray-600 py-2 text-white placeholder-gray-600 focus:border-yellow-400 focus:outline-none font-mono tracking-wider"
                            />
                            <div className="flex justify-between items-start mt-2">
                                <p className={`text-[10px] ${isItccValid ? 'text-green-400' : 'text-red-400'}`}>
                                    {isItccValid ? 'Code Verified.' : 'Compulsory for all transfers.'}
                                </p>
                                {!isItccValid && (
                                    <button onClick={handleContactSupport} className="text-[10px] text-yellow-400 hover:text-white underline font-semibold">
                                        Need a code? Contact Support
                                    </button>
                                )}
                            </div>
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
                            disabled={!isFormValid} 
                            className="w-full py-4 rounded-xl bg-yellow-400 text-[#1a365d] font-bold text-lg hover:bg-yellow-300 shadow-lg shadow-yellow-400/20 transition-all transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
                        >
                            Proceed to Review
                        </button>
                        
                        {!isFormValid && amountNum > 0 && (
                            <p className="text-center text-xs text-red-400">Please complete all beneficiary details.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SendMoney;
