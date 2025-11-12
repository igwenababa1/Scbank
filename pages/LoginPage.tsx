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
            <div className="absolute inset-0 z-0">
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="absolute top-1/2 left-1/2 min-w-full min-h-full w-auto h-auto object-cover z-0 animate-zoom-in-out"
                    poster="https://images.pexels.com/photos/853870/pexels-photo-853870.jpeg"
                >
                    <source src="https://videos.pexels.com/video-files/853870/853870-hd_1920_1080_30fps.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
                <div className="absolute inset-0 bg-black/60"></div>
            </div>

            {/* Login Content */}
            <div className="relative z-10 w-full max-w-6xl mx-auto p-4 grid md:grid-cols-2 items-center animate-fade-in-scale-up">
                {/* Left Side - Branding */}
                <div className="hidden md:block p-8 text-white">
                    <div className="flex items-center gap-3 mb-4">
                        <i className="fas fa-university text-3xl text-[#e6b325]"></i>
                        <span className="text-2xl font-bold tracking-tight">Swedish Construction Bank</span>
                    </div>
                    <h1 className="text-5xl font-extrabold mb-4 text-shadow-lg">Secure Client Access</h1>
                    <p className="text-lg text-gray-200 max-w-md">Engineered for Ambition. Built on Trust. Your global financial partner is one step away.</p>
                </div>

                {/* Right Side - Form */}
                <div className="relative w-full max-w-md bg-black/30 backdrop-blur-lg border border-white/10 rounded-2xl shadow-2xl p-8 text-white mx-auto">
                    <button onClick={onBack} className="absolute top-4 left-4 text-gray-300 hover:text-white transition-colors text-sm">
                         <i className="fas fa-arrow-left mr-2"></i>Back to Home
                    </button>
                    <div className="text-center mb-8 mt-8">
                         <h2 className="text-3xl font-bold">Welcome Back</h2>
                         <p className="text-gray-300">Login to your SCB account</p>
                    </div>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-gray-300 text-sm font-semibold mb-2" htmlFor="email">
                                Username or Email
                            </label>
                            <div className="relative">
                                <i className="fas fa-user absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
                                <input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Username"
                                    className="w-full bg-gray-900/50 border-2 border-gray-600 rounded-lg py-3 pl-12 pr-4 text-white focus:border-yellow-400 focus:ring-0 transition"
                                />
                            </div>
                        </div>
                        <div>
                             <div className="flex justify-between items-baseline">
                                <label className="block text-gray-300 text-sm font-semibold mb-2" htmlFor="password">
                                    Password
                                </label>
                             </div>
                            <div className="relative">
                                <i className="fas fa-lock absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
                                <input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="******************"
                                    className="w-full bg-gray-900/50 border-2 border-gray-600 rounded-lg py-3 pl-12 pr-4 text-white focus:border-yellow-400 focus:ring-0 transition"
                                />
                            </div>
                        </div>

                        {/* Remember Me & Forgot Password */}
                        <div className="flex items-center justify-between text-sm">
                            <label htmlFor="rememberMe" className="flex items-center gap-2 cursor-pointer font-semibold text-gray-300">
                                <input 
                                    type="checkbox" 
                                    id="rememberMe" 
                                    checked={rememberMe} 
                                    onChange={() => setRememberMe(!rememberMe)}
                                    className="w-4 h-4 rounded bg-gray-700 border-gray-500 text-yellow-400 focus:ring-yellow-500"
                                />
                                Remember Me
                            </label>
                             <a className="inline-block align-baseline font-semibold text-yellow-400 hover:text-yellow-300" href="#">
                                Forgot Password?
                            </a>
                        </div>
                        
                        <div className="flex items-center justify-between gap-4">
                            <button
                                type="submit"
                                className="flex-grow bg-[#e6b325] hover:bg-[#d19d1f] text-[#1a365d] font-bold py-3 px-4 rounded-lg focus:outline-none focus:shadow-outline transition-all duration-300 transform hover:scale-105"
                            >
                                Sign In
                            </button>
                             <button
                                type="button"
                                onClick={() => setIsBiometricsModalOpen(true)}
                                className="w-14 h-12 flex-shrink-0 bg-gray-900/50 border-2 border-gray-600 hover:border-yellow-400 text-gray-400 hover:text-white font-bold rounded-lg focus:outline-none focus:shadow-outline transition-colors flex items-center justify-center"
                                aria-label="Login with biometrics"
                            >
                               <i className="fas fa-fingerprint text-2xl"></i>
                            </button>
                        </div>
                    </form>

                    {/* Additional Links */}
                    <div className="text-center mt-6 text-sm">
                        <p className="text-gray-400">
                            Don't have an account? <a href="#" className="font-semibold text-yellow-400 hover:text-yellow-300">Open an Account</a>
                        </p>
                         <p className="text-gray-400 mt-2">
                            Having trouble? <a href="#" className="font-semibold text-yellow-400 hover:text-yellow-300">Get Help</a>
                        </p>
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