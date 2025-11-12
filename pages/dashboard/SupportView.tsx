import React, { useState } from 'react';
import { SUPPORT_CATEGORIES, SUPPORT_FAQS, SYSTEM_STATUS } from '../../constants';
import FaqAccordion from '../../components/dashboard/support/FaqAccordion';
import LiveChatModal from '../../components/dashboard/support/LiveChatModal';

const SupportCategoryCard: React.FC<{ icon: string, title: string }> = ({ icon, title }) => (
    <button className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-2xl border border-white/10 shadow-lg text-center hover:bg-gray-700/60 transition-colors">
        <i className={`fas ${icon} text-3xl text-yellow-400 mb-3`}></i>
        <p className="font-semibold">{title}</p>
    </button>
);

const SupportView: React.FC = () => {
    const [isChatOpen, setIsChatOpen] = useState(false);

    return (
        <div 
            className="min-h-full bg-gray-900 text-white p-8"
        >
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-5xl font-bold mb-4">Support Center</h1>
                    <p className="text-lg text-gray-400">How can we help you today?</p>
                    <div className="mt-6 max-w-2xl mx-auto">
                        <div className="relative">
                            <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
                            <input 
                                type="text"
                                placeholder="Search for help (e.g., 'reset password')"
                                className="w-full bg-gray-800/50 border-gray-600 rounded-full py-3 pl-12 pr-4 text-white focus:ring-yellow-400 focus:border-yellow-400"
                            />
                        </div>
                    </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-12">
                    {SUPPORT_CATEGORIES.map(cat => <SupportCategoryCard key={cat.title} icon={cat.icon} title={cat.title} />)}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 bg-gray-800/50 backdrop-blur-sm p-8 rounded-2xl border border-white/10 shadow-lg">
                        <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
                        <FaqAccordion items={SUPPORT_FAQS} />
                    </div>
                    <div className="space-y-8">
                         <div className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-2xl border border-white/10 shadow-lg">
                            <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
                            <button onClick={() => setIsChatOpen(true)} className="w-full flex items-center justify-center gap-3 py-3 rounded-lg bg-yellow-400 text-gray-900 font-bold hover:bg-yellow-300 transition-colors">
                                <i className="fas fa-comment-dots"></i>
                                Live Chat
                            </button>
                            {/* Other contact options */}
                         </div>
                         <div className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-2xl border border-white/10 shadow-lg">
                            <h2 className="text-2xl font-bold mb-4">System Status</h2>
                            <div className="space-y-3 text-sm">
                                {SYSTEM_STATUS.map(s => {
                                    const statusStyles = {
                                        Operational: 'text-green-400',
                                        'High Volume': 'text-yellow-400',
                                        Outage: 'text-red-400',
                                    };
                                    return (
                                        <div key={s.service} className="flex justify-between items-center">
                                            <p>{s.service}</p>
                                            <span className={`font-semibold ${statusStyles[s.status]}`}>{s.status}</span>
                                        </div>
                                    )
                                })}
                            </div>
                         </div>
                    </div>
                </div>
            </div>
            <LiveChatModal isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
        </div>
    );
};

export default SupportView;
