import React, { useState } from 'react';
import { FOOTER_COLUMNS, SOCIAL_LINKS } from '../constants';
import { useLanguage } from '../contexts/GlobalSettingsContext';
import { LANGUAGES } from '../i18n';

const Footer: React.FC = () => {
    const [email, setEmail] = useState('');
    const [formState, setFormState] = useState<'idle' | 'submitting' | 'success'>('idle');
    const [isLangOpen, setIsLangOpen] = useState(false);
    const { language, setLanguage } = useLanguage();

    const handleEmailSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;
        setFormState('submitting');
        setTimeout(() => {
            setFormState('success');
            setTimeout(() => {
                setFormState('idle');
                setEmail('');
            }, 2000);
        }, 1500);
    };

    return (
        // FIX: Removed duplicate id="contact" to allow the header link to point to the correct Contact component.
        <footer className="relative bg-gray-900 text-white overflow-hidden">
            <div className="absolute inset-0 z-0">
                <img 
                    src="https://images.unsplash.com/photo-1542744095-291d1f67b221?q=80&w=2070&auto=format&fit=crop"
                    alt="Modern office background"
                    className="w-full h-full object-cover animate-kenburns opacity-20"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/80 to-transparent"></div>
            </div>

            <div className="container mx-auto px-4 py-16 relative z-10">
                {/* Upper Section: Newsletter and App Download */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-12 border-b border-gray-700 pb-12">
                    <div>
                        <h3 className="text-2xl font-bold mb-2">Stay Connected</h3>
                        <p className="text-gray-400 mb-4">Get the latest news, updates, and financial insights from our team.</p>
                        <form onSubmit={handleEmailSubmit} className="flex items-center gap-2">
                            <input
                                type="email"
                                placeholder="Enter your email address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="flex-grow bg-gray-800 border border-gray-600 rounded-md px-4 py-3 text-white focus:ring-yellow-400 focus:border-yellow-400"
                                required
                            />
                            <button
                                type="submit"
                                disabled={formState !== 'idle'}
                                className="px-6 py-3 rounded-md bg-yellow-400 text-gray-900 font-bold hover:bg-yellow-300 transition-colors disabled:bg-gray-500 w-40"
                            >
                                {formState === 'idle' && 'Subscribe'}
                                {formState === 'submitting' && 'Subscribing...'}
                                {formState === 'success' && <><i className="fas fa-check"></i> Thank You!</>}
                            </button>
                        </form>
                    </div>
                    <div className="text-center lg:text-right">
                         <h3 className="text-lg font-bold mb-4">Get Our App</h3>
                        <div className="flex justify-center lg:justify-end gap-4">
                            <a href="https://www.apple.com/app-store/" target="_blank" rel="noopener noreferrer" className="flex items-center bg-black text-white p-2 rounded-lg hover:bg-gray-800 transition-colors w-44">
                                <i className="fab fa-apple text-3xl"></i>
                                <div className="ml-2 text-left">
                                    <div className="text-xs">Download on the</div>
                                    <div className="text-lg font-semibold leading-tight">App Store</div>
                                </div>
                            </a>
                             <a href="https://play.google.com/store/apps" target="_blank" rel="noopener noreferrer" className="flex items-center bg-black text-white p-2 rounded-lg hover:bg-gray-800 transition-colors w-44">
                                <i className="fab fa-google-play text-2xl"></i>
                                <div className="ml-2 text-left">
                                    <div className="text-xs">GET IT ON</div>
                                    <div className="text-lg font-semibold leading-tight">Google Play</div>
                                </div>
                            </a>
                        </div>
                    </div>
                </div>

                {/* Middle Section: Links */}
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
                    <div className="col-span-2 md:col-span-4 lg:col-span-1">
                        <a href="#home" className="group flex flex-col items-start focus:outline-none">
                            <i className="fas fa-university text-4xl text-yellow-400"></i>
                            <span className="text-sm font-bold text-white mt-2 tracking-tighter">
                                Swedish Construction Bank
                            </span>
                        </a>
                        <p className="text-gray-400 text-xs mt-2">
                            {FOOTER_COLUMNS.about.description}
                        </p>
                    </div>
                    {FOOTER_COLUMNS.links.map((col) => (
                        <div key={col.title}>
                            <h3 className="text-lg font-bold mb-4">{col.title}</h3>
                            <ul className="space-y-2 text-sm">
                                {col.links.map(link => (
                                    <li key={link.label}><a href={link.href} className="text-gray-400 hover:text-white transition-colors">{link.label}</a></li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Lower Section: Copyright and Social */}
                <div className="mt-12 pt-8 border-t border-gray-700 flex flex-col md:flex-row justify-between items-center text-sm">
                    <p className="text-gray-400 mb-4 md:mb-0">&copy; {new Date().getFullYear()} Swedish Construction Bank. All Rights Reserved.</p>
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-4">
                            {SOCIAL_LINKS.map(link => (
                                <a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer" aria-label={link.label} className="text-gray-400 hover:text-white text-lg transition-colors">
                                    <i className={link.icon}></i>
                                </a>
                            ))}
                        </div>
                        {/* Language Selector */}
                        <div className="relative">
                            <button onClick={() => setIsLangOpen(!isLangOpen)} className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
                                <span>{language.flag}</span>
                                <span>{language.name}</span>
                                <i className={`fas fa-chevron-down text-xs transition-transform ${isLangOpen ? 'rotate-180' : ''}`}></i>
                            </button>
                            {isLangOpen && (
                                <div className="absolute bottom-full mb-2 right-0 bg-gray-800 border border-gray-600 rounded-md shadow-lg w-40">
                                    {LANGUAGES.map(lang => (
                                        <button 
                                            key={lang.code}
                                            onClick={() => {
                                                setLanguage(lang);
                                                setIsLangOpen(false);
                                            }}
                                            className="w-full text-left px-4 py-2 hover:bg-gray-700 flex items-center justify-between"
                                        >
                                            <span>{lang.flag} {lang.name}</span>
                                            {language.code === lang.code && <i className="fas fa-check text-yellow-400"></i>}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;