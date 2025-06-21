import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import LoadingScreen from './components/LoadingScreen';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import InfluencerCards from './components/InfluencerCards';
import SocialFeed from './components/SocialFeed';
import DetailedBios from './components/DetailedBios';
import ChatPanel from './components/ChatPanel';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [activeInfluencerId, setActiveInfluencerId] = useState<string>();

  const handleLoadingComplete = () => {
    setIsLoading(false);
  };

  const handleChatOpen = (influencerId?: string) => {
    setActiveInfluencerId(influencerId);
    setIsChatOpen(true);
  };

  const handleChatClose = () => {
    setIsChatOpen(false);
    setActiveInfluencerId(undefined);
  };

  return (
    <div className="min-h-screen bg-background">
      <AnimatePresence mode="wait">
        {isLoading ? (
          <LoadingScreen onComplete={handleLoadingComplete} />
        ) : (
          <>
            <Header onChatOpen={() => handleChatOpen()} />
            
            <main>
              <HeroSection onInfluencerClick={handleChatOpen} />
              <InfluencerCards onChatClick={handleChatOpen} />
              <SocialFeed />
              <DetailedBios onChatClick={handleChatOpen} />
            </main>

            <ChatPanel 
              isOpen={isChatOpen} 
              onClose={handleChatClose}
              activeInfluencerId={activeInfluencerId}
            />

            {/* Footer */}
            <footer className="bg-gradient-to-r from-foreground to-primary text-white py-16">
              <div className="container mx-auto px-6">
                <div className="grid md:grid-cols-4 gap-8">
                  <div>
                    <h3 className="font-poppins font-bold text-3xl mb-4 bg-gradient-to-r from-white to-accent bg-clip-text text-transparent">
                      VibeAgency
                    </h3>
                    <p className="text-secondary font-inter leading-relaxed">
                      Connecting brands with AI-powered influencers in the Web3 ecosystem. The future of digital marketing is here.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-poppins font-semibold mb-4 text-lg">Platform</h4>
                    <ul className="space-y-3 text-secondary">
                      <li><a href="#" className="hover:text-accent transition-colors">AI Influencers</a></li>
                      <li><a href="#" className="hover:text-accent transition-colors">Analytics</a></li>
                      <li><a href="#" className="hover:text-accent transition-colors">Campaigns</a></li>
                      <li><a href="#" className="hover:text-accent transition-colors">Web3 Tools</a></li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-poppins font-semibold mb-4 text-lg">Resources</h4>
                    <ul className="space-y-3 text-secondary">
                      <li><a href="#" className="hover:text-accent transition-colors">Documentation</a></li>
                      <li><a href="#" className="hover:text-accent transition-colors">API</a></li>
                      <li><a href="#" className="hover:text-accent transition-colors">Support</a></li>
                      <li><a href="#" className="hover:text-accent transition-colors">Community</a></li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-poppins font-semibold mb-4 text-lg">Connect</h4>
                    <ul className="space-y-3 text-secondary">
                      <li><a href="#" className="hover:text-accent transition-colors">Twitter</a></li>
                      <li><a href="#" className="hover:text-accent transition-colors">Discord</a></li>
                      <li><a href="#" className="hover:text-accent transition-colors">LinkedIn</a></li>
                      <li><a href="#" className="hover:text-accent transition-colors">Telegram</a></li>
                    </ul>
                  </div>
                </div>
                <div className="border-t border-secondary/20 mt-12 pt-8 text-center">
                  <p className="text-secondary font-inter">
                    © 2025 VibeAgency. All rights reserved. Built for the future of Web3 marketing.
                  </p>
                </div>
              </div>
            </footer>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;