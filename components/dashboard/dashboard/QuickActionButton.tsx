
import React from 'react';

interface QuickActionButtonProps {
    icon: string;
    label: string;
    onClick: () => void;
}

const QuickActionButton: React.FC<QuickActionButtonProps> = ({ icon, label, onClick }) => {
    return (
        <button
            onClick={onClick}
            className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-md text-center hover:bg-gray-50 dark:hover:bg-slate-700 hover:-translate-y-1 transition-all duration-200"
        >
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 text-xl rounded-full flex items-center justify-center mx-auto mb-2">
                <i className={`fas ${icon}`}></i>
            </div>
            <p className="font-semibold text-gray-700 dark:text-slate-200 text-sm">{label}</p>
        </button>
    );
};

export default QuickActionButton;