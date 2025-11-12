import React, { useState } from 'react';
import type { ConnectedApp } from '../../../types';

interface ConnectAppModalProps {
    isOpen: boolean;
    onClose: () => void;
    app: ConnectedApp;
    onSuccess: (appId: string) => void;
}

const StepIndicator: React.FC<{ currentStep: number; totalSteps: number }> = ({ currentStep, totalSteps }) => (
    <div className="flex justify-center items-center space-x-2 mb-6">
        {Array.from({ length: totalSteps }).map((_, i) => (
            <div key={i} className={`w-8 h-2 rounded-full ${i < currentStep ? 'bg-yellow-400' : 'bg-gray-600'}`}></div>
        ))}
    </div>
);

const ConnectAppModal: React.FC<ConnectAppModalProps> = ({ isOpen, onClose, app, onSuccess }) => {
    const [step, setStep] = useState(1);
    
    if (!isOpen) return null;

    const handleCloseAndReset = () => {
        setStep(1);
        onClose();
    };
    
    const handleConnect = () => {
        // Simulate a successful connection after 1.5 seconds
        setTimeout(() => {
            setStep(3); // Success step
            setTimeout(() => {
                onSuccess(app.id);
            }, 1500);
        }, 1500);
    };

    const renderStepContent = () => {
        switch (step) {
            case 1: // Authorization
                return (
                    <div className="text-center">
                        <img src={app.logoUrl} alt={app.name} className="w-20 h-20 bg-white rounded-full p-2 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold mb-2">Connect to {app.name}</h2>
                        <p className="text-gray-400 mb-6">By connecting your account, you authorize SCB to access your {app.name} account information.</p>
                        <ul className="text-left text-sm text-gray-400 space-y-2 bg-black/20 p-4 rounded-lg mb-6">
                            <li className="flex items-start gap-2"><i className="fas fa-check-circle text-green-400 mt-1"></i><span>View your {app.name} balance and activity.</span></li>
                            <li className="flex items-start gap-2"><i className="fas fa-check-circle text-green-400 mt-1"></i><span>Initiate payments from your SCB account.</span></li>
                        </ul>
                        <button onClick={() => setStep(2)} className="w-full py-3 rounded-md bg-yellow-500 text-gray-900 font-bold hover:bg-yellow-400">Authorize & Continue</button>
                    </div>
                );
            case 2: // Mock Login
                return (
                     <div>
                        <div className="text-center mb-4">
                            <img src={app.logoUrl} alt={app.name} className="w-16 h-16 bg-white rounded-full p-1 mx-auto mb-2" />
                            <h3 className="font-bold text-lg">Sign in to {app.name}</h3>
                        </div>
                        <div className="space-y-4">
                             <input type="email" placeholder="Email or Username" defaultValue="alex.byrne@example.com" className="w-full bg-gray-900 border-gray-600 rounded-md text-white" />
                             <input type="password" placeholder="Password" defaultValue="password123" className="w-full bg-gray-900 border-gray-600 rounded-md text-white" />
                        </div>
                        <button onClick={handleConnect} className="mt-6 w-full py-3 rounded-md bg-blue-600 text-white font-bold hover:bg-blue-700">Log In & Connect</button>
                     </div>
                );
            case 3: // Success
                return (
                    <div className="text-center">
                        <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <i className="fas fa-check text-green-400 text-3xl"></i>
                        </div>
                        <h2 className="text-2xl font-bold mb-2">Connection Successful!</h2>
                        <p className="text-gray-400">You have successfully linked your {app.name} account.</p>
                    </div>
                );
        }
    };
    
    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 transition-opacity" onClick={onClose}>
            <div className="bg-gray-800 border border-white/10 rounded-lg shadow-xl p-8 w-full max-w-md text-white" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-start mb-4">
                    <h2 className="text-2xl font-bold">Connect a Service</h2>
                    <button onClick={handleCloseAndReset} className="text-gray-400 hover:text-gray-200"><i className="fas fa-times text-xl"></i></button>
                </div>
                {step < 3 && <StepIndicator currentStep={step} totalSteps={2} />}
                {renderStepContent()}
            </div>
        </div>
    );
};

export default ConnectAppModal;