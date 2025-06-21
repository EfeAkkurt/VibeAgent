import React, { useState } from "react";
import {
  Menu,
  X,
  Wallet,
  MessageCircle,
  Image,
  Megaphone,
  Users,
  Search,
  Home,
  TrendingUp,
  Bot,
  AlertCircle,
  Fingerprint,
  Key,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useWallet } from "../context/WalletContext";

interface HeaderProps {
  onChatOpen: () => void;
}

const Header: React.FC<HeaderProps> = ({ onChatOpen }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [username, setUsername] = useState("");

  const {
    isWalletConnected,
    publicKey,
    isConnecting,
    error,
    biometricSupported,
    biometricVerified,
    authMethod,
    connectWallet,
    disconnectWallet,
    clearError,
  } = useWallet();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleConnectWallet = async () => {
    if (biometricSupported && !biometricVerified) {
      if (!username.trim()) {
        // You might want to show an error here
        return;
      }
      await connectWallet(username);
    } else {
      await connectWallet();
    }
  };

  const handleDisconnectWallet = async () => {
    await disconnectWallet();
    setIsWalletModalOpen(false);
  };

  const menuItems = [
    { icon: Home, label: "Home", href: "#home" },
    { icon: MessageCircle, label: "Chat", action: onChatOpen },
    { icon: Image, label: "Posts", href: "#posts" },
    { icon: Megaphone, label: "Campaigns", href: "#campaigns" },
    { icon: Users, label: "Influencers", href: "#influencers" },
    { icon: TrendingUp, label: "Analytics", href: "#analytics" },
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
                  {isWalletConnected ? "Connected" : "Connect Freighter"}
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
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.6, duration: 0.3 }}
                  onClick={() => {
                    setIsWalletModalOpen(true);
                    toggleMenu();
                  }}
                  className={`w-full flex items-center justify-center space-x-3 py-4 rounded-2xl font-medium font-inter transition-all duration-300 shadow-lg ${
                    isWalletConnected
                      ? "bg-green-500 text-white hover:bg-green-600"
                      : "bg-gradient-to-r from-primary to-foreground text-white hover:shadow-xl"
                  }`}
                >
                  <Wallet size={20} />
                  <span>
                    {isWalletConnected
                      ? "Wallet Connected"
                      : "Connect Freighter"}
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
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
              onClick={() => !isConnecting && setIsWalletModalOpen(false)}
            />

            {/* Modal Content */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", duration: 0.4 }}
              className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md"
            >
              <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-poppins font-bold text-primary text-2xl">
                    Wallet Connection
                  </h2>
                  {isWalletConnected && (
                    <div className="bg-green-100 px-3 py-1 rounded-full text-green-600 text-xs font-medium flex items-center">
                      <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                      Connected
                    </div>
                  )}
                </div>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-4 mb-6"
                  >
                    <div className="flex items-start">
                      <AlertCircle
                        className="mr-3 mt-0.5 flex-shrink-0"
                        size={18}
                      />
                      <div>
                        <p className="font-medium">{error.message}</p>
                        {error.details && (
                          <p className="text-sm mt-1 text-red-500">
                            {error.details}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="mt-3 flex justify-end">
                      <button
                        onClick={clearError}
                        className="text-sm font-medium text-red-600 hover:text-red-800"
                      >
                        Dismiss
                      </button>
                    </div>
                  </motion.div>
                )}

                {isWalletConnected ? (
                  <div className="space-y-6">
                    <div className="bg-gray-50 rounded-xl p-4">
                      <p className="text-secondary text-sm mb-2">
                        Connected Address
                      </p>
                      <p className="font-mono text-primary font-medium text-sm break-all">
                        {publicKey}
                      </p>
                    </div>

                    {authMethod && (
                      <div className="bg-blue-50 rounded-xl p-4 flex items-center space-x-3">
                        <div className="bg-blue-100 p-2 rounded-full">
                          {authMethod === "biometric" ? (
                            <Fingerprint size={20} className="text-blue-500" />
                          ) : (
                            <Key size={20} className="text-blue-500" />
                          )}
                        </div>
                        <div>
                          <p className="text-blue-800 font-medium">
                            {authMethod === "biometric"
                              ? "Biometric Authentication"
                              : "Password Authentication"}
                          </p>
                          <p className="text-blue-600 text-sm">
                            {authMethod === "biometric"
                              ? "Using device biometrics for secure access"
                              : "Using password for wallet access"}
                          </p>
                        </div>
                      </div>
                    )}

                    <motion.button
                      onClick={handleDisconnectWallet}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full bg-red-500 hover:bg-red-600 text-white font-poppins font-semibold py-3 px-6 rounded-xl transition-all duration-300 flex items-center justify-center space-x-2"
                    >
                      <span>Disconnect Wallet</span>
                    </motion.button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {biometricSupported === true && (
                      <div className="bg-blue-50 rounded-xl p-4 flex items-center space-x-3">
                        <div className="bg-blue-100 p-2 rounded-full">
                          <Fingerprint size={20} className="text-blue-500" />
                        </div>
                        <div>
                          <p className="text-blue-800 font-medium">
                            Biometric Authentication
                          </p>
                          <p className="text-blue-600 text-sm">
                            Secure your wallet with biometric verification
                          </p>
                        </div>
                      </div>
                    )}

                    {biometricSupported === true && (
                      <div className="space-y-4">
                        <div className="relative">
                          <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Enter username for biometric auth"
                            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none font-inter"
                          />
                        </div>
                      </div>
                    )}

                    <motion.button
                      onClick={handleConnectWallet}
                      disabled={isConnecting}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white font-poppins font-semibold py-4 px-6 rounded-xl transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl disabled:opacity-70"
                    >
                      {isConnecting ? (
                        <div className="flex items-center space-x-2">
                          <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
                          <span>
                            {biometricSupported
                              ? "Verifying Biometrics..."
                              : "Connecting Wallet..."}
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <Wallet size={18} />
                          <span>Connect Freighter Wallet</span>
                        </div>
                      )}
                    </motion.button>

                    <div className="text-xs text-secondary text-center">
                      {biometricSupported === true && (
                        <p>
                          Biometric authentication is recommended for secure
                          wallet connection
                        </p>
                      )}
                      {biometricSupported === false && (
                        <p>
                          Biometric not supported. Password authentication will
                          be used.
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;
