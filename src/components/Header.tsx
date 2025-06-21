import React, { useState } from 'react';
import { Menu, X, Wallet, MessageCircle, Image, Megaphone, Users, Search, Home, TrendingUp, Bot } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface HeaderProps {
  onChatOpen: () => void;
}

const Header: React.FC<HeaderProps> = ({ onChatOpen }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isWalletConnected, setIsWalletConnected] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const connectWallet = () => {
    // Simulate wallet connection
    setIsWalletConnected(!isWalletConnected);
  };

  const menuItems = [
    { icon: Home, label: 'Home', href: '#home' },
    { icon: MessageCircle, label: 'Chat', action: onChatOpen },
    { icon: Image, label: 'Posts', href: '#posts' },
    { icon: Megaphone, label: 'Campaigns', href: '#campaigns' },
    { icon: Users, label: 'Influencers', href: '#influencers' },
    { icon: TrendingUp, label: 'Analytics', href: '#analytics' },
  ];

  return (
    <>
      <motion.header 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="fixed top-0 left-0 right-0 z-40 bg-white/90 backdrop-blur-xl border-b border-gray-200/50 shadow-lg"
      >
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <motion.div 
              className="flex items-center space-x-3"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <div className="relative">
                <motion.div 
                  className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center shadow-lg"
                  animate={{ 
                    boxShadow: [
                      '0 4px 20px rgba(239, 35, 60, 0.3)',
                      '0 4px 30px rgba(239, 35, 60, 0.5)',
                      '0 4px 20px rgba(239, 35, 60, 0.3)'
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Bot className="text-white" size={24} />
                </motion.div>
                <motion.div 
                  className="absolute -top-1 -right-1 w-4 h-4 bg-accent rounded-full"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </div>
              <div>
                <h1 className="text-2xl font-poppins font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  VibeAgency
                </h1>
                <p className="text-xs text-secondary font-inter">AI Influencer Platform</p>
              </div>
            </motion.div>

            {/* Search Bar - Hidden on mobile */}
            <div className="hidden md:flex flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-secondary w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search influencers, topics, or campaigns..."
                  className="w-full pl-12 pr-4 py-3 bg-gray-50/80 border border-gray-200/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent/30 transition-all duration-300 font-inter text-sm placeholder-secondary/70"
                />
              </div>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-4">
              {/* Connect Wallet Button */}
              <motion.button
                onClick={connectWallet}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`hidden md:flex items-center space-x-2 px-6 py-3 rounded-2xl font-medium font-inter text-sm transition-all duration-300 shadow-lg ${
                  isWalletConnected 
                    ? 'bg-green-500 text-white hover:bg-green-600' 
                    : 'bg-gradient-to-r from-primary to-foreground text-white hover:shadow-xl'
                }`}
              >
                <Wallet size={18} />
                <span>{isWalletConnected ? 'Connected' : 'Connect Freighter'}</span>
              </motion.button>

              {/* Menu Button */}
              <motion.button
                onClick={toggleMenu}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-3 rounded-2xl bg-gray-50/80 hover:bg-gray-100/80 transition-all duration-300 border border-gray-200/50 shadow-md"
              >
                <AnimatePresence mode="wait">
                  {isMenuOpen ? (
                    <motion.div
                      key="close"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <X size={22} className="text-foreground" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="menu"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Menu size={22} className="text-foreground" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black/30 backdrop-blur-md z-30"
              onClick={toggleMenu}
            />
            
            {/* Menu Panel */}
            <motion.div 
              initial={{ x: '100%', opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '100%', opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed top-0 right-0 h-full w-96 bg-white/95 backdrop-blur-xl border-l border-gray-200/50 z-40 shadow-2xl"
            >
              <div className="p-8 pt-28">
                {/* Logo in Menu */}
                <div className="flex items-center space-x-3 mb-8 pb-6 border-b border-gray-200/50">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center">
                    <Bot className="text-white" size={20} />
                  </div>
                  <div>
                    <h2 className="text-xl font-poppins font-bold text-primary">VibeAgency</h2>
                    <p className="text-xs text-secondary">AI Influencer Platform</p>
                  </div>
                </div>

                {/* Search on mobile */}
                <div className="md:hidden mb-8">
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-secondary w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Search..."
                      className="w-full pl-12 pr-4 py-3 bg-gray-50/80 border border-gray-200/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent/30 transition-all duration-300 font-inter"
                    />
                  </div>
                </div>

                {/* Navigation */}
                <nav className="space-y-3 mb-8">
                  {menuItems.map((item, index) => (
                    <motion.button
                      key={item.label}
                      initial={{ x: 50, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: index * 0.1, duration: 0.3 }}
                      onClick={() => {
                        if (item.action) {
                          item.action();
                        }
                        toggleMenu();
                      }}
                      className="w-full flex items-center space-x-4 text-foreground hover:text-accent transition-colors duration-300 p-4 rounded-2xl hover:bg-gray-50/80 group"
                    >
                      <div className="p-3 rounded-xl bg-gray-100/80 group-hover:bg-accent/10 transition-colors duration-300">
                        <item.icon size={20} className="group-hover:text-accent transition-colors duration-300" />
                      </div>
                      <span className="font-inter font-medium text-lg">{item.label}</span>
                    </motion.button>
                  ))}
                </nav>

                {/* Connect Wallet - Mobile */}
                <motion.button
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.6, duration: 0.3 }}
                  onClick={connectWallet}
                  className={`w-full flex items-center justify-center space-x-3 py-4 rounded-2xl font-medium font-inter transition-all duration-300 shadow-lg ${
                    isWalletConnected 
                      ? 'bg-green-500 text-white hover:bg-green-600' 
                      : 'bg-gradient-to-r from-primary to-foreground text-white hover:shadow-xl'
                  }`}
                >
                  <Wallet size={20} />
                  <span>{isWalletConnected ? 'Wallet Connected' : 'Connect Freighter'}</span>
                </motion.button>

                {/* Footer */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.7, duration: 0.3 }}
                  className="mt-8 pt-6 border-t border-gray-200/50 text-center"
                >
                  <p className="text-secondary text-sm font-inter">
                    © 2025 VibeAgency
                  </p>
                  <p className="text-secondary text-xs font-inter mt-1">
                    AI-Powered Web3 Marketing
                  </p>
                </motion.div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;