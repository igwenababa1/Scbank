import React, { useContext } from 'react';
import { AppContext } from '../App';
import { useLanguage, useTheme } from '../contexts/GlobalSettingsContext';

const Header: React.FC = () => {
    const { showLogin } = useContext(AppContext);
    const { t } = useLanguage();
    const { theme, toggleTheme } = useTheme();

    const NavLink: React.FC<{ href: string; children: React.ReactNode }> = ({ href, children }) => (
         <a href={href} className="relative font-semibold text-gray-600 after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-[#1a365d] after:transition-all after:duration-300 hover:text-[#1a365d] hover:after:w-full dark:text-gray-300 dark:hover:text-white dark:after:bg-yellow-400">{children}</a>
    );

    return (
        <header className="bg-white/80 backdrop-blur-md fixed top-0 left-0 right-0 z-40 shadow-sm dark:bg-slate-900/80 dark:border-b dark:border-slate-700/50">
            <div className="container mx-auto px-4 h-24 flex justify-between items-center">
                <a href="#home" className="flex items-center group">
                    <div className="flex flex-col items-center text-center">
                        <i className="fas fa-university text-5xl logo-icon-gradient group-hover:opacity-80 transition-opacity"></i>
                        <span className="text-sm font-bold text-[#1a365d] tracking-tight mt-1 logo-text-3d dark:text-gray-100">
                            Swedish Construction Bank
                        </span>
                    </div>
                </a>
                <nav className="hidden md:flex items-center space-x-8">
                    <NavLink href="#payments">Payments</NavLink>
                    <NavLink href="#cards">Cards</NavLink>
                    <NavLink href="#investments">Invest</NavLink>
                    <NavLink href="#security">Security</NavLink>
                </nav>
                <div className="flex items-center gap-4">
                    <button
                        onClick={toggleTheme}
                        className="w-10 h-10 rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-200/50 dark:text-gray-300 dark:hover:bg-slate-700/50 transition-colors"
                        aria-label="Toggle theme"
                    >
                        {theme === 'light' ? <i className="fas fa-moon text-lg"></i> : <i className="fas fa-sun text-lg"></i>}
                    </button>
                    <button 
                        onClick={showLogin}
                        className="bg-[#e6b325] text-[#1a365d] font-semibold px-6 py-2.5 rounded-md hover:bg-[#d19d1f] transition duration-300 transform hover:scale-105"
                    >
                        {t('login')}
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;