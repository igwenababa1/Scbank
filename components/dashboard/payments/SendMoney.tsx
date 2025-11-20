
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
    const [complianceChecked, setComplianceChecked] = useState(false);
    
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

    // Reset compliance check if ITCC changes
    useEffect(() => {
        if (isItccValid) {
            setComplianceChecked(true); // Auto-check if code is valid
        } else {
            setComplianceChecked(false);
        }
    }, [itccCode, isItccValid]);

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
            { label: "Initiating Secure Handshake (SSL/TLS 1.3)...", icon: "fa-key", duration: 1200 },
            { label: "Verifying Biometric Session Token...", icon: "fa-fingerprint", duration: 1000 },
            { label: `Establishing Secure Link to ${targetDetails.bank}...`, icon: "fa-university", duration: 1500 },
            { label: "Performing AML/KYC Regulatory Checks...", icon: "fa-user-shield", duration: 1500 },
        ];

        if (isItccValid) {
            steps.push({ label: "Verifying ITCC Protocol Signature...", icon: "fa-file-signature", duration: 1200 });
            steps.push({ label: "Compliance Verified. Fee Waived.", icon: "fa-check-circle", duration: 800 });
        } else {
            steps.push({ label: "ITCC Protocol Not Detected.", icon: "fa-exclamation-triangle", duration: 1000 });
            steps.push({ label: "Acquiring Temporary Compliance Certificate...", icon: "fa-file-contract", duration: 2000 });
            steps.push({ label: "Processing Non-Compliance Surcharge (15%)...", icon: "fa-percentage", duration: 1200 });
        }

        steps.push({ label: "Finalizing Ledger Settlement...", icon: "fa-network-wired", duration: 1200 });
        steps.push({ label: "Transaction Successfully Recorded", icon: "fa-check-double", duration: 500 });

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
    
    const canProceed = isFormValid && (isItccValid || complianceChecked);

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
                        <h3 className="text-2xl font-bold text-white tracking-tight mb-2">Secure Processing</h3>
                        <p className="text-blue-400 font-mono text-xs uppercase tracking-widest">Session ID: {Date.now().toString(36).toUpperCase()}</p>
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
                    <div className="bg-[#0f172a] p-8 text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <i className="fas fa-shield-alt text-9xl"></i>
                        </div>
                        <div className="flex items-center gap-2 mb-4">
                            <span className="px-2 py-0.5 rounded bg-yellow-500/20 text-yellow-400 border border-yellow-500/50 text-[10px] font-bold uppercase tracking-wider">Secure Transfer</span>
                            {!isItccValid && <span className="px-2 py-0.5 rounded bg-red-500/20 text-red-400 border border-red-500/50 text-[10px] font-bold uppercase tracking-wider">Fee Applied</span>}
                        </div>
                        
                        <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">Total Debit Authorization</p>
                        <h2 className="text-5xl font-extrabold tracking-tight">{formatCurrency(totalDebit)}</h2>
                        
                        {!isItccValid && (
                            <div className="mt-6 bg-red-500/10 border border-red-500/30 rounded-lg p-4 flex items-start gap-3 backdrop-blur-sm">
                                <i className="fas fa-info-circle text-red-400 mt-1 text-lg"></i>
                                <div>
                                    <p className="text-sm font-bold text-red-200">Includes ITCC Acquisition Fee</p>
                                    <p className="text-xs text-red-300/80 mt-0.5">You have authorized a 15% surcharge for regulatory compliance processing.</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Receipt Body */}
                    <div className="p-8 space-y-6">
                        {/* Beneficiary Section */}
                        <div className="flex items-center justify-between pb-6 border-b border-gray-100">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center border border-gray-200 overflow-hidden">
                                    <img src={targetDetails.logo} className="w-full h-full object-cover" alt="" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 uppercase tracking-wider font-bold">Beneficiary</p>
                                    <p className="text-xl font-bold text-gray-800">{targetDetails.name}</p>
                                    <p className="text-xs text-gray-500 flex items-center gap-1">
                                        <i className="fas fa-building text-gray-400"></i> {targetDetails.bank} • {targetDetails.account}
                                    </p>
                                </div>
                            </div>
                             <div className="text-right">
                                <p className="text-xs text-gray-500 uppercase tracking-wider font-bold">Value Date</p>
                                <p className="text-sm font-bold text-gray-800">{new Date().toLocaleDateString()}</p>
                            </div>
                        </div>

                        {/* Details Table */}
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                                <span className="text-gray-500 font-medium">Source Account</span>
                                <span className="font-mono font-bold text-gray-800">{fromAccount.type} ({fromAccount.number})</span>
                            </div>
                            
                            <div className="h-px bg-gray-200 my-2"></div>

                            <div className="flex justify-between">
                                <span className="text-gray-500">Principal Amount</span>
                                <span className="font-semibold text-gray-800">{formatCurrency(amountNum)}</span>
                            </div>
                            
                            {surchargeAmount > 0 ? (
                                <div className="flex justify-between bg-red-50 p-3 rounded border border-red-100">
                                    <div className="flex items-center gap-2 text-red-700">
                                        <i className="fas fa-file-invoice-dollar"></i>
                                        <span className="font-bold">ITCC Acquisition Fee (15%)</span>
                                    </div>
                                    <span className="text-red-700 font-bold">
                                        +{formatCurrency(surchargeAmount)}
                                    </span>
                                </div>
                            ) : (
                                <div className="flex justify-between bg-green-50 p-3 rounded border border-green-100">
                                    <div className="flex items-center gap-2 text-green-700">
                                        <i className="fas fa-shield-check"></i>
                                        <span className="font-bold">ITCC Compliance Verified</span>
                                    </div>
                                    <span className="text-green-700 font-bold">Waived</span>
                                </div>
                            )}
                            
                            {note && (
                                <div className="flex justify-between pt-2">
                                    <span className="text-gray-500">Reference</span>
                                    <span className="italic text-gray-800">"{note}"</span>
                                </div>
                            )}
                        </div>

                        <div className="pt-6 border-t border-gray-100">
                            <div className="flex gap-4">
                                <button onClick={() => setIsConfirming(false)} className="flex-1 py-3 rounded-xl border border-gray-300 text-gray-600 font-bold hover:bg-gray-50 transition-colors">
                                    Modify
                                </button>
                                <button 
                                    onClick={handleConfirm} 
                                    className="flex-[2] py-3 rounded-xl bg-[#1a365d] text-white font-bold hover:bg-[#2d5c8a] hover:shadow-lg transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
                                >
                                    <i className="fas fa-fingerprint"></i> 
                                    Confirm & Transfer
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
                        {/* ITCC Compliance Section */}
                        <div className="bg-[#1e293b]/50 backdrop-blur-xl rounded-2xl p-6 border border-white/10 shadow-xl relative overflow-hidden group">
                            {/* Decorative background element */}
                            <div className="absolute -right-6 -top-6 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl"></div>
                            
                            <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-4">
                                <i className="fas fa-passport text-blue-400"></i> 
                                Cross-Border Compliance
                            </h3>

                            <div className="space-y-4">
                                 <div>
                                    <label className="text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-1 block">ITCC Protocol ID</label>
                                    <div className="relative">
                                        <input 
                                            type="text" 
                                            value={itccCode} 
                                            onChange={e => setItccCode(e.target.value)} 
                                            placeholder="ITCC-XXXX-XXXX"
                                            className={`w-full bg-black/40 border ${isItccValid ? 'border-green-500/50 text-green-400' : 'border-white/10 text-white'} rounded-lg py-3 pl-4 pr-10 font-mono text-sm tracking-widest uppercase focus:outline-none focus:border-yellow-400 transition-colors`}
                                        />
                                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                            {isItccValid && <i className="fas fa-check-circle text-green-400"></i>}
                                        </div>
                                    </div>
                                 </div>

                                 {isItccValid ? (
                                     <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3 flex items-center gap-3 animate-fade-in-status-item">
                                         <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center text-green-400 text-xs"><i className="fas fa-check"></i></div>
                                         <span className="text-xs text-green-300 font-medium">Compliance Verified. Fee Waived.</span>
                                     </div>
                                 ) : (
                                     <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-3">
                                         <div className="flex gap-3 mb-3">
                                             <i className="fas fa-info-circle text-yellow-500 mt-0.5 text-xs"></i>
                                             <p className="text-xs text-gray-300 leading-relaxed">
                                                 <span className="text-yellow-500 font-bold">Notice:</span> Without a valid ITCC code, a <span className="text-white font-bold">15% Regulatory Fee</span> is mandatory for international clearance under Regulation 402(c).
                                             </p>
                                         </div>
                                         <label className="flex items-start gap-3 cursor-pointer group p-2 hover:bg-white/5 rounded transition-colors">
                                             <div className={`w-4 h-4 rounded border flex-shrink-0 flex items-center justify-center transition-colors mt-0.5 ${complianceChecked ? 'bg-yellow-500 border-yellow-500' : 'border-gray-500 bg-transparent group-hover:border-yellow-400'}`}>
                                                 {complianceChecked && <i className="fas fa-check text-black text-[10px]"></i>}
                                             </div>
                                             <input type="checkbox" className="hidden" checked={complianceChecked} onChange={e => setComplianceChecked(e.target.checked)} />
                                             <span className="text-[10px] text-gray-400 group-hover:text-gray-300 transition-colors select-none font-medium">I acknowledge the fee and authorize processing.</span>
                                         </label>
                                         <button onClick={handleContactSupport} className="mt-3 text-[10px] text-blue-400 hover:text-blue-300 flex items-center gap-1 ml-7 transition-colors">
                                            <i className="fas fa-external-link-alt"></i> Need a code? Contact Support
                                        </button>
                                     </div>
                                 )}
                            </div>
                        </div>

                        <div className="bg-white/5 rounded-2xl p-6 border border-white/10 backdrop-blur-sm">
                             <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Reference / Memo</label>
                             <input 
                                type="text" 
                                value={note} 
                                onChange={e => setNote(e.target.value)} 
                                placeholder="Payment description"
                                className="w-full bg-transparent border-b border-gray-600 py-2 text-white placeholder-gray-600 focus:border-yellow-400 focus:outline-none" 
                            />
                        </div>
                        
                         <button 
                            onClick={() => setIsConfirming(true)} 
                            disabled={!canProceed} 
                            className="w-full py-4 rounded-xl bg-gradient-to-r from-yellow-400 to-yellow-500 text-[#1a365d] font-bold text-lg hover:to-yellow-300 shadow-lg shadow-yellow-400/20 transition-all transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none flex items-center justify-center gap-2"
                        >
                            <span>Proceed to Security Check</span>
                            <i className="fas fa-arrow-right"></i>
                        </button>
                        
                        {!isFormValid && amountNum > 0 && (
                            <p className="text-center text-xs text-red-400">Please complete all required fields.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SendMoney;
