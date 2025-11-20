import React, { useState, useContext } from 'react';
import { AppContext } from '../App';
import BiometricsModal from '../components/BiometricsModal';

interface LoginPageProps {
    onBack: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onBack }) => {
    const { login } = useContext(AppContext);
    const [email, setEmail] = useState('alex.byrne@example.com');
    const [password, setPassword] = useState('password123');
    const [rememberMe, setRememberMe] = useState(false);
    const [isBiometricsModalOpen, setIsBiometricsModalOpen] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (email && password) {
            login();
        }
    };
    
    const handleBiometricSuccess = () => {
        setIsBiometricsModalOpen(false);
        login();
    }

    return (
        <div className="min-h-screen font-sans flex items-center justify-center relative overflow-hidden">
            {/* Background Video */}
            <div className="absolute inset-0 z-0 overflow-hidden">
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="absolute top-1/2 left-1/2 min-w-full min-h-full w-auto h-auto object-cover z-0 animate-zoom-in-out transform -translate-x-1/2 -translate-y-1/2"
                    poster="https://images.pexels.com/photos/373543/pexels-photo-373543.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                >
                    {/* Abstract Glass/Architecture Video for "Construction Bank" feel */}
                    <source src="https://videos.pexels.com/video-files/3121459/3121459-uhd_2560_1440_24fps.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-slate-900/95 via-slate-900/80 to-slate-800/40 mix-blend-multiply z-0"></div>
                
                {/* Pattern Overlay for Texture */}
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 mix-blend-overlay z-0 pointer-events-none"></div>
                
                {/* Radial Gradient for focus */}
                <div className="absolute inset-0 bg-radial-gradient from-transparent via-transparent to-black/60 z-0 pointer-events-none"></div>
            </div>

            {/* Login Content */}
            <div className="relative z-10 w-full max-w-7xl mx-auto p-6 grid lg:grid-cols-2 items-center gap-16 animate-fade-in-scale-up">
                {/* Left Side - Branding */}
                <div className="hidden lg:block p-8 text-white space-y-8">
                    <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 shadow-lg">
                        <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                        <span className="text-xs font-bold tracking-widest uppercase text-gray-100">Secure Banking Protocol</span>
                    </div>
                    
                    <div>
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#e6b325] to-[#b08d26] flex items-center justify-center shadow-lg shadow-yellow-500/20">
                                <i className="fas fa-university text-2xl text-[#1a365d]"></i>
                            </div>
                            <span className="text-2xl font-bold tracking-tight text-white">Swedish Construction Bank</span>
                        </div>
                        
                        <h1 className="text-7xl font-extrabold leading-tight tracking-tight">
                            Visionary.<br/>
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#e6b325] to-[#fff]">Secure.</span><br/>
                            Yours.
                        </h1>
                    </div>

                    <p className="text-xl text-gray-300 max-w-lg leading-relaxed font-light border-l-4 border-[#e6b325] pl-6">
                        Access your portfolio with institutional-grade security. Experience the future of global finance, engineered for your ambition.
                    </p>
                    
                    <div className="flex items-center gap-8 pt-4">
                        <div>
                            <p className="text-3xl font-bold text-white">2.4M+</p>
                            <p className="text-sm text-gray-400 uppercase tracking-wider">Happy Clients</p>
                        </div>
                        <div className="h-10 w-px bg-white/20"></div>
                         <div>
                            <p className="text-3xl font-bold text-white">$120B+</p>
                            <p className="text-sm text-gray-400 uppercase tracking-wider">Assets Managed</p>
                        </div>
                    </div>
                </div>

                {/* Right Side - Form */}
                <div className="w-full max-w-md mx-auto lg:mx-0 lg:ml-auto">
                    <div className="bg-black/30 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)] p-8 text-white relative overflow-hidden group">
                        
                        {/* Gloss effect */}
                        <div className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] bg-gradient-to-br from-white/5 via-transparent to-transparent rotate-45 pointer-events-none"></div>

                        <div className="relative z-10">
                            <button onClick={onBack} className="flex items-center text-gray-400 hover:text-white transition-colors text-sm mb-8 group/btn">
                                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center mr-2 group-hover/btn:bg-white/10 transition-colors">
                                    <i className="fas fa-arrow-left text-xs"></i>
                                </div>
                                Back to Home
                            </button>

                            <div className="mb-8">
                                <h2 className="text-3xl font-bold mb-2 text-white">Client Access</h2>
                                <p className="text-gray-400 text-sm">Enter your credentials to access your dashboard.</p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider ml-1" htmlFor="email">
                                        Identity
                                    </label>
                                    <div className="relative group/input">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <i className="fas fa-user text-gray-500 group-focus-within/input:text-[#e6b325] transition-colors"></i>
                                        </div>
                                        <input
                                            id="email"
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="Username or Email"
                                            className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-11 pr-4 text-white placeholder-gray-500 focus:bg-white/10 focus:border-[#e6b325] focus:ring-1 focus:ring-[#e6b325] transition-all outline-none"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider ml-1" htmlFor="password">
                                        Security Key
                                    </label>
                                    <div className="relative group/input">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <i className="fas fa-lock text-gray-500 group-focus-within/input:text-[#e6b325] transition-colors"></i>
                                        </div>
                                        <input
                                            id="password"
                                            type="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="••••••••••••"
                                            className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-11 pr-4 text-white placeholder-gray-500 focus:bg-white/10 focus:border-[#e6b325] focus:ring-1 focus:ring-[#e6b325] transition-all outline-none"
                                        />
                                    </div>
                                </div>

                                <div className="flex items-center justify-between text-sm">
                                    <label htmlFor="rememberMe" className="flex items-center gap-2 cursor-pointer group/check select-none">
                                        <div className={`w-5 h-5 rounded border border-gray-600 flex items-center justify-center transition-colors ${rememberMe ? 'bg-[#e6b325] border-[#e6b325]' : 'bg-transparent group-hover/check:border-gray-400'}`}>
                                            {rememberMe && <i className="fas fa-check text-black text-xs"></i>}
                                        </div>
                                        <input 
                                            type="checkbox" 
                                            id="rememberMe" 
                                            checked={rememberMe} 
                                            onChange={() => setRememberMe(!rememberMe)}
                                            className="hidden"
                                        />
                                        <span className="text-gray-400 group-hover/check:text-gray-300 transition-colors">Remember device</span>
                                    </label>
                                    <a className="text-[#e6b325] hover:text-[#ffe680] font-semibold transition-colors text-xs uppercase tracking-wide" href="#">
                                        Help?
                                    </a>
                                </div>
                                
                                <div className="pt-2 flex gap-4">
                                    <button
                                        type="submit"
                                        className="flex-grow bg-gradient-to-r from-[#e6b325] to-[#d4a017] text-[#1a365d] font-bold py-4 px-6 rounded-xl shadow-lg shadow-yellow-900/20 hover:shadow-yellow-500/30 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
                                    >
                                        Secure Login
                                    </button>
                                     <button
                                        type="button"
                                        onClick={() => setIsBiometricsModalOpen(true)}
                                        className="w-16 bg-white/10 hover:bg-white/20 border border-white/10 rounded-xl flex items-center justify-center text-white transition-all hover:border-white/30"
                                        aria-label="Login with biometrics"
                                        title="Use Biometrics"
                                    >
                                       <i className="fas fa-fingerprint text-2xl"></i>
                                    </button>
                                </div>
                            </form>

                            <div className="mt-8 pt-6 border-t border-white/10 text-center">
                                <p className="text-gray-400 text-xs mb-3">Don't have an account?</p>
                                <button className="text-white font-semibold hover:text-[#e6b325] transition-colors text-sm border border-white/20 px-6 py-2 rounded-full hover:bg-white/5">
                                    Apply for Membership
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
             <BiometricsModal 
                isOpen={isBiometricsModalOpen}
                onClose={() => setIsBiometricsModalOpen(false)}
                onSuccess={handleBiometricSuccess}
            />
        </div>
    );
};

export default LoginPage;