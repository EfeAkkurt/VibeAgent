import React, { useState } from "react";
import {
  Menu,
  X,
  Wallet,
  MessageCircle,
  Image,
  Users,
  Search,
  Home,
  Bot,
  AlertCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useWallet } from "../context/WalletContext";

interface HeaderProps {
  onChatOpen: () => void;
  onPostsOpen: () => void;
  onInfluencersOpen: () => void;
  isWalletModalOpen: boolean;
  setIsWalletModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const Header: React.FC<HeaderProps> = ({
  onChatOpen,
  onPostsOpen,
  onInfluencersOpen,
  isWalletModalOpen,
  setIsWalletModalOpen,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const {
    isWalletConnected,
    publicKey,
    isConnecting,
    error,
    connectWallet,
    disconnectWallet,
    clearError,
    balance,
  } = useWallet();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleConnectWallet = async () => {
    await connectWallet();
  };

  const handleDisconnectWallet = async () => {
    await disconnectWallet();
    setIsWalletModalOpen(false);
  };

  const menuItems = [
    { icon: Home, label: "Home", href: "#home" },
    { icon: MessageCircle, label: "Chat", action: onChatOpen },
    { icon: Image, label: "Posts", action: onPostsOpen },
    { icon: Users, label: "Influencers", action: onInfluencersOpen },
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
                      "0 4px 20px rgba(239, 35, 60, 0.3)",
                      "0 4px 30px rgba(239, 35, 60, 0.5)",
                      "0 4px 20px rgba(239, 35, 60, 0.3)",
                    ],
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
                <p className="text-xs text-secondary font-inter">
                  AI Influencer Platform
                </p>
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
                onClick={() => setIsWalletModalOpen(true)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`hidden md:flex items-center space-x-2 px-6 py-3 rounded-2xl font-medium font-inter text-sm transition-all duration-300 shadow-lg ${
                  isWalletConnected
                    ? "bg-green-500 text-white hover:bg-green-600"
                    : "bg-gradient-to-r from-primary to-foreground text-white hover:shadow-xl"
                }`}
              >
                <Wallet size={18} />
                <span>
                  {isWalletConnected ? "Connected" : "Connect Wallet"}
                </span>
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
              initial={{ x: "100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "100%", opacity: 0 }}
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
                    <h2 className="text-xl font-poppins font-bold text-primary">
                      VibeAgency
                    </h2>
                    <p className="text-xs text-secondary">
                      AI Influencer Platform
                    </p>
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
                        <item.icon
                          size={20}
                          className="group-hover:text-accent transition-colors duration-300"
                        />
                      </div>
                      <span className="font-inter font-medium text-lg">
                        {item.label}
                      </span>
                    </motion.button>
                  ))}
                </nav>

                {/* Connect Wallet - Mobile */}
                <motion.button
                  initial={{ x: 50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.4, duration: 0.3 }}
                  onClick={() => setIsWalletModalOpen(true)}
                  className={`w-full flex items-center justify-center space-x-3 px-6 py-4 rounded-2xl font-medium transition-all duration-300 shadow-lg mt-6 ${
                    isWalletConnected
                      ? "bg-green-500 text-white hover:bg-green-600"
                      : "bg-gradient-to-r from-primary to-foreground text-white hover:shadow-xl"
                  }`}
                >
                  <Wallet size={20} />
                  <span>
                    {isWalletConnected ? "Connected" : "Connect Wallet"}
                  </span>
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

      {/* Wallet Connection Modal */}
      <AnimatePresence>
        {isWalletModalOpen && (
          <>
            {/* Modal Backdrop */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-md"
              onClick={() => setIsWalletModalOpen(false)}
            >
              <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 50, opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold font-poppins text-foreground">
                    Wallet Connection
                  </h2>
                  <button
                    onClick={() => setIsWalletModalOpen(false)}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all"
                  >
                    <X size={24} />
                  </button>
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl mb-6 flex items-start space-x-3">
                    <AlertCircle className="w-6 h-6 mt-1 text-red-500" />
                    <div>
                      <h4 className="font-bold">Connection Error</h4>
                      <p className="text-sm">{error}</p>
                      <button
                        onClick={clearError}
                        className="mt-2 text-sm font-semibold text-red-600 hover:underline"
                      >
                        Dismiss
                      </button>
                    </div>
                  </div>
                )}

                {isWalletConnected ? (
                  <div className="space-y-4">
                    <div className="p-4 bg-green-50 rounded-xl border border-green-200">
                      <p className="font-medium text-green-800">
                        Successfully Connected!
                      </p>
                      <p className="text-xs text-green-600 mt-1 break-all">
                        {publicKey}
                      </p>
                      {balance !== null && (
                        <p className="text-lg font-bold text-green-900 mt-2">
                          Balance: {balance} XLM
                        </p>
                      )}
                    </div>
                    <button
                      onClick={handleDisconnectWallet}
                      className="w-full bg-red-500 text-white py-3 rounded-xl hover:bg-red-600 transition-all font-semibold shadow-md"
                    >
                      Disconnect
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <p className="text-secondary text-center">
                      Connect with your passkey (fingerprint, face, or device
                      PIN).
                    </p>
                    <button
                      onClick={handleConnectWallet}
                      disabled={isConnecting}
                      className="w-full flex items-center justify-center bg-gradient-to-r from-primary to-foreground text-white py-4 rounded-xl hover:shadow-xl transition-all font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isConnecting ? (
                        <>
                          <motion.div
                            className="w-5 h-5 border-2 border-white/50 border-t-white rounded-full mr-3"
                            animate={{ rotate: 360 }}
                            transition={{
                              duration: 1,
                              repeat: Infinity,
                              ease: "linear",
                            }}
                          />
                          Connecting...
                        </>
                      ) : (
                        "Connect with Passkey"
                      )}
                    </button>
                  </div>
                )}
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;
