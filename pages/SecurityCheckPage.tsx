import React, { useState, useEffect } from 'react';

interface SecurityCheckPageProps {
    onComplete: () => void;
}

const securitySteps = [
    { text: "Verifying Identity...", delay: 0 },
    { text: "Securing Connection...", delay: 1000 },
    { text: "Analyzing Threats...", delay: 2000 },
    { text: "Access Granted", delay: 3000 },
];

const Checkmark: React.FC<{ isVisible: boolean }> = ({ isVisible }) => (
    <div className={`w-6 h-6 flex-shrink-0 flex items-center justify-center rounded-full transition-all duration-300 ${isVisible ? 'bg-green-500' : 'bg-gray-600'}`}>
        {isVisible && (
            <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                <path
                    d="M5 13l4 4L19 7"
                    style={{
                        strokeDasharray: 50,
                        strokeDashoffset: isVisible ? 0 : 50,
                        transition: 'stroke-dashoffset 0.4s ease-out 0.2s',
                    }}
                />
            </svg>
        )}
    </div>
);

const SecurityCheckPage: React.FC<SecurityCheckPageProps> = ({ onComplete }) => {
    const [currentStep, setCurrentStep] = useState(0);

    useEffect(() => {
        const timers = securitySteps.map((_, index) =>
            setTimeout(() => {
                setCurrentStep(index + 1);
            }, (index + 1) * 1000)
        );

        const completionTimer = setTimeout(onComplete, 4000);

        return () => {
            timers.forEach(clearTimeout);
            clearTimeout(completionTimer);
        };
    }, [onComplete]);

    const finalStepCompleted = currentStep > securitySteps.length - 1;

    return (
        <div className="min-h-screen bg-[#1a365d] text-white flex flex-col items-center justify-center p-4 overflow-hidden">
            <div className="relative w-64 h-64 flex items-center justify-center mb-12">
                {/* Rotating Stars */}
                <i className="fas fa-star text-yellow-400/20 text-[16rem] absolute animate-rotate-star"></i>
                <i className="fas fa-star text-yellow-400/10 text-[12rem] absolute animate-rotate-star [animation-direction:reverse]"></i>
                
                {/* Central Icon */}
                <div className={`relative w-32 h-32 rounded-full flex items-center justify-center transition-all duration-500 ${finalStepCompleted ? 'bg-green-500' : 'bg-blue-900/50'}`}>
                    <i className={`fas ${finalStepCompleted ? 'fa-check' : 'fa-shield-alt'} text-6xl transition-transform duration-300 ${finalStepCompleted ? 'scale-110' : ''}`}></i>
                </div>
            </div>

            <h1 className="text-3xl font-bold mb-4 animate-fade-in-scale-up">Security Check</h1>
            <p className="text-gray-300 mb-8 animate-fade-in-scale-up [animation-delay:0.2s]">Please wait while we secure your session...</p>

            <div className="w-full max-w-sm space-y-3">
                {securitySteps.map((step, index) => (
                    <div
                        key={index}
                        className={`flex items-center gap-4 p-3 rounded-lg transition-all duration-300 ${currentStep > index ? 'bg-white/10' : 'bg-transparent'}`}
                    >
                        <Checkmark isVisible={currentStep > index} />
                        <span className={`font-semibold transition-colors duration-300 ${currentStep > index ? 'text-white' : 'text-gray-400'}`}>
                            {step.text}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SecurityCheckPage;