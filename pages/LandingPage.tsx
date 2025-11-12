import React from 'react';
import Header from '../components/Header';
import Hero from '../components/Hero';
import Footer from '../components/Footer';
import Chatbot from '../components/Chatbot';

const LandingPage: React.FC = () => {
    return (
        <div className="bg-white animate-fade-in-slow">
            <Header />
            <main>
                <Hero />
            </main>
            <Footer />
            <Chatbot />
        </div>
    );
};

export default LandingPage;