
import React, { useState } from 'react';
import { SOCIAL_LINKS } from '../constants';
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

    const stockTickerItems = [
        { symbol: 'SCB Group (STO)', price: '145.20', change: '+0.85%', up: true },
        { symbol: 'SCB (NYSE)', price: '14.12', change: '+1.10%', up: true },
        { symbol: 'SCB (LSE)', price: '11.05', change: '-0.20%', up: false },
        { symbol: 'EUR/USD', price: '1.0845', change: '+0.05%', up: true },
        { symbol: 'EUR/SEK', price: '11.230', change: '-0.15%', up: false },
    ];

    const footerLinks = {
        private: {
            title: "Private Banking",
            links: ["Daily Banking", "Cards & Payments", "Loans & Mortgages", "Savings & Investments", "Private Wealth", "Student Banking"]
        },
        corporate: {
            title: "Corporate & Inst.",
            links: ["Business Accounts", "Trade Finance", "Cash Management", "Investment Banking", "Markets & FX", "Industry Insights"]
        },
        about: {
            title: "About SCB",
            links: ["Our Heritage", "Investor Relations", "Sustainability", "Careers", "Newsroom", "Compliance"]
        },
        support: {
            title: "Client Support",
            links: ["Help Center", "Lost or Stolen Card", "Fraud Prevention", "Find a Branch", "Contact Us", "Whistleblowing"]
        }
    };

    return (
        <footer className="relative bg-[#0f172a] text-white overflow-hidden font-sans border-t border-[#1e293b]">
            {/* Stock Ticker Strip */}
            <div className="bg-[#020617] border-b border-white/5 py-2 overflow-hidden relative z-20">
                <div className="container mx-auto px-4 flex justify-between items-center text-[10px] font-mono uppercase tracking-wider text-gray-400">
                    <span className="hidden md:inline font-bold text-blue-500">Market Data Delayed 15m</span>
                    <div className="flex gap-8 animate-marquee whitespace-nowrap">
                        {[...stockTickerItems, ...stockTickerItems].map((item, idx) => (
                            <div key={idx} className="flex items-center gap-2">
                                <span className="text-white font-bold">{item.symbol}</span>
                                <span>{item.price}</span>
                                <span className={item.up ? 'text-green-500' : 'text-red-500'}>
                                    {item.up ? '▲' : '▼'} {item.change}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Background Visuals */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <img 
                    src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop"
                    alt="Global Architecture"
                    className="w-full h-full object-cover opacity-10 grayscale mix-blend-luminosity"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-[#0f172a]/95 to-[#0f172a]/80"></div>
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 mix-blend-overlay"></div>
            </div>

            <div className="container mx-auto px-8 py-16 relative z-10">
                {/* Upper Section: Brand & Newsletter */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pb-12 border-b border-white/10">
                    <div className="lg:col-span-4 space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#e6b325] to-[#b08d26] flex items-center justify-center shadow-lg shadow-yellow-500/10">
                                <i className="fas fa-university text-[#1a365d] text-xl"></i>
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold tracking-tight text-white">SCB Group</h2>
                                <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400">Global Financial Engineering</p>
                            </div>
                        </div>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            Building the financial foundations for a sustainable future. We provide institutional-grade security and innovative banking solutions for clients worldwide.
                        </p>
                        
                        <div className="flex gap-4">
                            <a href="#" className="w-36 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg p-2 flex items-center gap-2 transition-all group">
                                <i className="fab fa-apple text-2xl text-gray-300 group-hover:text-white"></i>
                                <div>
                                    <div className="text-[8px] text-gray-500 uppercase">Download on the</div>
                                    <div className="text-xs font-bold text-gray-200 group-hover:text-white">App Store</div>
                                </div>
                            </a>
                            <a href="#" className="w-36 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg p-2 flex items-center gap-2 transition-all group">
                                <i className="fab fa-google-play text-xl text-gray-300 group-hover:text-white"></i>
                                <div>
                                    <div className="text-[8px] text-gray-500 uppercase">Get it on</div>
                                    <div className="text-xs font-bold text-gray-200 group-hover:text-white">Google Play</div>
                                </div>
                            </a>
                        </div>
                    </div>

                    <div className="lg:col-span-1"></div>

                    <div className="lg:col-span-7">
                        <div className="bg-[#1e293b]/50 backdrop-blur-sm border border-white/10 rounded-2xl p-8 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
                            
                            <h3 className="text-xl font-bold mb-2">Executive Insights</h3>
                            <p className="text-gray-400 text-sm mb-6">Subscribe to our weekly market analysis and global economic outlook.</p>
                            
                            <form onSubmit={handleEmailSubmit} className="flex flex-col sm:flex-row gap-3">
                                <div className="flex-grow relative">
                                    <i className="fas fa-envelope absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"></i>
                                    <input
                                        type="email"
                                        placeholder="Enter your corporate email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full bg-black/30 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white placeholder-gray-500 focus:ring-1 focus:ring-yellow-400 focus:border-yellow-400 transition-all outline-none"
                                        required
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={formState !== 'idle'}
                                    className="px-6 py-3 rounded-xl bg-[#e6b325] text-[#1a365d] font-bold hover:bg-[#d4a017] transition-all shadow-lg shadow-yellow-500/10 disabled:opacity-50 disabled:cursor-not-allowed min-w-[140px]"
                                >
                                    {formState === 'idle' && 'Subscribe'}
                                    {formState === 'submitting' && <i className="fas fa-circle-notch fa-spin"></i>}
                                    {formState === 'success' && <i className="fas fa-check"></i>}
                                </button>
                            </form>
                            <p className="text-[10px] text-gray-500 mt-3">
                                By subscribing, you agree to our <a href="#" className="text-gray-400 hover:text-white underline">Privacy Policy</a>. You can unsubscribe at any time.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Links Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-12 border-b border-white/5">
                    {Object.entries(footerLinks).map(([key, section]) => (
                        <div key={key}>
                            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-6 border-l-2 border-[#e6b325] pl-3">{section.title}</h4>
                            <ul className="space-y-3">
                                {section.links.map((link) => (
                                    <li key={link}>
                                        <a href="#" className="text-sm text-gray-400 hover:text-yellow-400 transition-colors flex items-center group">
                                            <span className="w-0 group-hover:w-2 transition-all duration-300 h-px bg-yellow-400 mr-0 group-hover:mr-2"></span>
                                            {link}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Lower Footer: Compliance & Social */}
                <div className="pt-12">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-8">
                        <div className="flex items-center gap-6">
                            {SOCIAL_LINKS.map(link => (
                                <a 
                                    key={link.label} 
                                    href={link.href} 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-all border border-white/5 hover:border-white/20"
                                >
                                    <i className={link.icon}></i>
                                </a>
                            ))}
                        </div>

                        {/* Language Selector */}
                        <div className="relative">
                            <button 
                                onClick={() => setIsLangOpen(!isLangOpen)} 
                                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-black/30 border border-white/10 text-sm text-gray-300 hover:text-white hover:border-white/20 transition-all"
                            >
                                <span className="text-lg">{language.flag}</span>
                                <span>{language.name}</span>
                                <i className={`fas fa-chevron-down text-xs ml-2 transition-transform ${isLangOpen ? 'rotate-180' : ''}`}></i>
                            </button>
                            
                            {isLangOpen && (
                                <div className="absolute bottom-full right-0 mb-2 w-48 bg-[#1e293b] border border-white/10 rounded-xl shadow-2xl overflow-hidden animate-fade-in-scale-up">
                                    {LANGUAGES.map(lang => (
                                        <button 
                                            key={lang.code}
                                            onClick={() => {
                                                setLanguage(lang);
                                                setIsLangOpen(false);
                                            }}
                                            className="w-full text-left px-4 py-3 hover:bg-white/5 flex items-center justify-between text-sm text-gray-300 hover:text-white"
                                        >
                                            <span className="flex items-center gap-2">
                                                <span className="text-lg">{lang.flag}</span> {lang.name}
                                            </span>
                                            {language.code === lang.code && <i className="fas fa-check text-[#e6b325] text-xs"></i>}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-[10px] text-gray-500 border-t border-white/5 pt-8">
                        <div className="space-y-2">
                            <p>&copy; {new Date().getFullYear()} Swedish Construction Bank AB (publ). All rights reserved.</p>
                            <p>
                                Swedish Construction Bank is authorized by the Swedish Prudential Regulation Authority and regulated by the Financial Conduct Authority and the Prudential Regulation Authority.
                            </p>
                            <p>Registered Office: 123 Financial District, Stockholm, Sweden. Registered in Sweden No. 556000-0000.</p>
                        </div>
                        <div className="md:text-right space-y-2">
                            <div className="flex flex-wrap justify-start md:justify-end gap-4 text-gray-400 font-semibold">
                                <a href="#" className="hover:text-white">Privacy Policy</a>
                                <a href="#" className="hover:text-white">Terms of Use</a>
                                <a href="#" className="hover:text-white">Cookie Policy</a>
                                <a href="#" className="hover:text-white">Accessibility</a>
                                <a href="#" className="hover:text-white">Security Center</a>
                            </div>
                            <div className="flex flex-wrap justify-start md:justify-end gap-2 mt-2">
                                <span className="px-2 py-0.5 border border-gray-700 rounded bg-white/5">Member FDIC Equivalent</span>
                                <span className="px-2 py-0.5 border border-gray-700 rounded bg-white/5">Equal Housing Lender</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
