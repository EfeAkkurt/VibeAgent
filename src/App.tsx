import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import LoadingScreen from "./components/LoadingScreen";
import Header from "./components/Header";
import HeroSection from "./components/HeroSection";
import InfluencerCards from "./components/InfluencerCards";
import SocialFeed from "./components/SocialFeed";
import DetailedBios from "./components/DetailedBios";
import ChatPanel from "./components/ChatPanel";
import { WalletProvider } from "./context/WalletContext";
import PostsPage from "./components/PostsPage";
import InfluencersPage from "./components/InfluencersPage";
import { X } from "lucide-react";

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isPostsOpen, setIsPostsOpen] = useState(false);
  const [isInfluencersOpen, setIsInfluencersOpen] = useState(false);
  const [activeInfluencerId, setActiveInfluencerId] = useState<string>();
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);

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

  const handlePostsOpen = () => {
    setIsPostsOpen(true);
  };

  const handleInfluencersOpen = () => {
    setIsInfluencersOpen(true);
  };

  return (
    <WalletProvider>
      <div className="min-h-screen bg-background">
        <AnimatePresence mode="wait">
          {isLoading ? (
            <LoadingScreen onComplete={handleLoadingComplete} />
          ) : (
            <>
              <Header
                onChatOpen={() => handleChatOpen()}
                onPostsOpen={handlePostsOpen}
                onInfluencersOpen={handleInfluencersOpen}
                isWalletModalOpen={isWalletModalOpen}
                setIsWalletModalOpen={setIsWalletModalOpen}
              />

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

              <PostsPage
                isOpen={isPostsOpen}
                onClose={() => setIsPostsOpen(false)}
              />

              <AnimatePresence>
                {isInfluencersOpen && (
                  <div className="fixed top-0 right-0 w-full h-full bg-background z-50 overflow-hidden">
                    <InfluencersPage />
                    <button
                      onClick={() => setIsInfluencersOpen(false)}
                      className="absolute top-4 right-4 p-2 bg-black/50 rounded-full text-white hover:bg-black/70 transition-all z-50"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </AnimatePresence>

              {/* Footer */}
              <footer className="bg-gradient-to-r from-foreground to-primary text-white py-16">
                <div className="container mx-auto px-6">
                  <div className="grid md:grid-cols-4 gap-8">
                    <div>
                      <h3 className="font-poppins font-bold text-3xl mb-4 bg-gradient-to-r from-white to-accent bg-clip-text text-transparent">
                        VibeAgency
                      </h3>
                      <p className="text-secondary font-inter leading-relaxed">
                        Connecting brands with AI-powered influencers in the
                        Web3 ecosystem. The future of digital marketing is here.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-poppins font-semibold mb-4 text-lg">
                        Platform
                      </h4>
                      <ul className="space-y-3 text-secondary">
                        <li>
                          <a
                            href="#"
                            className="hover:text-accent transition-colors"
                          >
                            AI Influencers
                          </a>
                        </li>
                        <li>
                          <a
                            href="#"
                            className="hover:text-accent transition-colors"
                          >
                            Web3 Tools
                          </a>
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-poppins font-semibold mb-4 text-lg">
                        Resources
                      </h4>
                      <ul className="space-y-3 text-secondary">
                        <li>
                          <a
                            href="#"
                            className="hover:text-accent transition-colors"
                          >
                            Documentation
                          </a>
                        </li>
                        <li>
                          <a
                            href="#"
                            className="hover:text-accent transition-colors"
                          >
                            API
                          </a>
                        </li>
                        <li>
                          <a
                            href="#"
                            className="hover:text-accent transition-colors"
                          >
                            Support
                          </a>
                        </li>
                        <li>
                          <a
                            href="#"
                            className="hover:text-accent transition-colors"
                          >
                            Community
                          </a>
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-poppins font-semibold mb-4 text-lg">
                        Connect
                      </h4>
                      <ul className="space-y-3 text-secondary">
                        <li>
                          <a
                            href="#"
                            className="hover:text-accent transition-colors"
                          >
                            Twitter
                          </a>
                        </li>
                        <li>
                          <a
                            href="#"
                            className="hover:text-accent transition-colors"
                          >
                            Discord
                          </a>
                        </li>
                        <li>
                          <a
                            href="#"
                            className="hover:text-accent transition-colors"
                          >
                            LinkedIn
                          </a>
                        </li>
                        <li>
                          <a
                            href="#"
                            className="hover:text-accent transition-colors"
                          >
                            Telegram
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="mt-12 pt-8 border-t border-white/10 text-center">
                    <p className="text-secondary text-sm">
                      © 2025 VibeAgency. All rights reserved.
                    </p>
                  </div>
                </div>
              </footer>
            </>
          )}
        </AnimatePresence>
      </div>
    </WalletProvider>
  );
}

export default App;
