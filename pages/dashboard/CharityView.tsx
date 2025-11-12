import React, { useState, useRef, useEffect } from 'react';
// FIX: Corrected import path
import { CHARITIES, DONATION_HISTORY } from '../../constants';
import { formatCurrency, formatDate } from '../../utils/formatters';
// FIX: Corrected import path
import type { Charity, Donation, ViewType } from '../../types';
import DonateModal from '../../components/dashboard/charity/DonateModal';

const FeaturedCharityCard: React.FC<{ charity: Charity, onDonate: () => void }> = ({ charity, onDonate }) => (
    <div className="relative w-full h-64 rounded-2xl overflow-hidden text-white shadow-lg flex-shrink-0">
        <img src={charity.imageUrl} alt={charity.name} className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
        <div className="relative z-10 p-6 flex flex-col h-full justify-end">
            <img src={charity.logoUrl} alt={`${charity.name} logo`} className="w-16 h-16 mb-2 bg-white/20 rounded-full p-2" />
            <h3 className="font-bold text-xl text-shadow">{charity.name}</h3>
            <p className="text-sm opacity-90 text-shadow-lg mb-4">{charity.description}</p>
            <button onClick={onDonate} className="self-start px-4 py-2 text-sm font-semibold rounded-lg bg-yellow-400 text-gray-900 hover:bg-yellow-300 transition-colors">
                Donate Now
            </button>
        </div>
    </div>
);

const DonationHistoryItem: React.FC<{ donation: Donation }> = ({ donation }) => (
    <div className="flex items-center justify-between p-3 bg-black/20 rounded-md">
        <div className="flex items-center gap-4">
            <img src={donation.charityLogo} alt={`${donation.charityName} logo`} className="w-10 h-10 bg-white/10 rounded-full p-1" />
            <div>
                <p className="font-semibold">{donation.charityName}</p>
                <p className="text-xs text-gray-400">{formatDate(donation.date)} {donation.isRecurring && <span className="text-blue-400">&bull; Recurring</span>}</p>
            </div>
        </div>
        <p className="font-bold text-lg">{formatCurrency(donation.amount)}</p>
    </div>
);

interface CharityViewProps {
    setActiveView: (view: ViewType) => void;
}

const CharityView: React.FC<CharityViewProps> = ({ setActiveView }) => {
    const [isDonateModalOpen, setIsDonateModalOpen] = useState(false);
    const [selectedCharity, setSelectedCharity] = useState<Charity | null>(null);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const handleOpenDonateModal = (charity: Charity | null) => {
        setSelectedCharity(charity);
        setIsDonateModalOpen(true);
    };
    
    const scroll = (direction: 'left' | 'right') => {
        if (scrollContainerRef.current) {
            const scrollAmount = scrollContainerRef.current.clientWidth * 0.8;
            scrollContainerRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth',
            });
        }
    };

    return (
        <div 
            className="min-h-full bg-gray-900 text-white p-8 bg-cover bg-center"
            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1518655048521-f130df041f66?q=80&w=2070&auto=format&fit=crop')" }}
        >
            <div className="absolute inset-0 bg-gray-900/80 backdrop-blur-sm"></div>
            <div className="relative">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-4xl font-bold text-shadow-lg">Make a Difference</h1>
                    <button onClick={() => handleOpenDonateModal(null)} className="px-5 py-2 rounded-md bg-yellow-400 text-gray-900 font-bold hover:bg-yellow-300 transition-colors">
                        <i className="fas fa-hand-holding-heart mr-2"></i>
                        Donate Now
                    </button>
                </div>

                <div className="relative mb-8">
                    <button onClick={() => scroll('left')} className="absolute left-0 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-sm"><i className="fas fa-chevron-left"></i></button>
                    <div ref={scrollContainerRef} className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide">
                        {CHARITIES.map(charity => (
                             <div key={charity.id} className="snap-center min-w-[90%] md:min-w-[45%] lg:min-w-[30%]">
                                <FeaturedCharityCard charity={charity} onDonate={() => handleOpenDonateModal(charity)} />
                            </div>
                        ))}
                    </div>
                    <button onClick={() => scroll('right')} className="absolute right-0 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-sm"><i className="fas fa-chevron-right"></i></button>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-2xl border border-white/10 shadow-lg">
                        <h2 className="text-xl font-bold mb-4">Recurring Donations</h2>
                        <div className="space-y-3">
                            {DONATION_HISTORY.filter(d => d.isRecurring).map(d => <DonationHistoryItem key={d.id} donation={d} />)}
                        </div>
                    </div>
                     <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-2xl border border-white/10 shadow-lg">
                        <h2 className="text-xl font-bold mb-4">Donation History</h2>
                        <div className="space-y-3">
                            {DONATION_HISTORY.filter(d => !d.isRecurring).map(d => <DonationHistoryItem key={d.id} donation={d} />)}
                        </div>
                    </div>
                </div>
            </div>
            
            {isDonateModalOpen && (
                <DonateModal 
                    isOpen={isDonateModalOpen}
                    onClose={() => setIsDonateModalOpen(false)}
                    initialCharity={selectedCharity}
                    setActiveView={setActiveView}
                />
            )}
        </div>
    );
};

export default CharityView;