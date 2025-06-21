import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Send,
  MoreVertical,
  User,
  Bot,
  Paperclip,
  Smile,
  Wallet,
  Fingerprint,
  Key,
  AlertCircle,
} from "lucide-react";
import { aiInfluencers } from "../data/mockData";
import { useWallet } from "../context/WalletContext";

interface Message {
  id: string;
  text: string;
  sender: "user" | "ai";
  timestamp: Date;
}

interface ChatPanelProps {
  isOpen: boolean;
  onClose: () => void;
  activeInfluencerId?: string;
}

const ChatPanel: React.FC<ChatPanelProps> = ({
  isOpen,
  onClose,
  activeInfluencerId,
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
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
    retryConnection,
  } = useWallet();

  const currentInfluencer = aiInfluencers.find(
    (inf) => inf.id === activeInfluencerId
  );

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

    if (isWalletConnected) {
      setIsWalletModalOpen(false);
    }
  };

  const handleDisconnectWallet = async () => {
    await disconnectWallet();
    setIsWalletModalOpen(false);
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "legendary":
        return "from-yellow-400 to-orange-500";
      case "epic":
        return "from-purple-400 to-pink-500";
      case "rare":
        return "from-blue-400 to-cyan-500";
      default:
        return "from-gray-400 to-gray-600";
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const sendMessage = () => {
    if (!isWalletConnected) {
      setIsWalletModalOpen(true);
      return;
    }

    if (inputMessage.trim() === "") return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputMessage("");
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = getAIResponse();
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          text: aiResponse,
          sender: "ai",
          timestamp: new Date(),
        },
      ]);
    }, 1500);
  };

  const getAIResponse = () => {
    // This is a simple response generator - in a real app, you would call an API
    const responses = [
      `That's an interesting perspective! As someone focused on ${currentInfluencer?.category}, I think we should consider the broader implications.`,
      `Thanks for sharing that. In my experience with ${currentInfluencer?.tags[0]} and ${currentInfluencer?.tags[1]}, I've found that approach can be quite effective.`,
      `Great question! The key factors to consider in ${currentInfluencer?.category} are always evolving, but I'd recommend focusing on sustainable growth strategies.`,
      `I appreciate your thoughts on this. From my analysis, the most promising opportunities in this space involve innovative approaches to ${currentInfluencer?.tags[2]}.`,
      `That's a common misconception. Actually, the data shows that ${currentInfluencer?.category} strategies are most effective when aligned with community values.`,
    ];

    return responses[Math.floor(Math.random() * responses.length)];
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="w-full h-full md:w-5/6 md:h-5/6 bg-white shadow-2xl overflow-hidden flex"
          >
            {/* Sidebar */}
            <div className="w-72 bg-gradient-to-b from-primary to-foreground border-r border-secondary/20 flex flex-col">
              <div className="p-4 border-b border-white/10">
                <div className="flex items-center justify-between">
                  <h3 className="text-white font-poppins font-bold text-lg">
                    Messages
                  </h3>
                  <motion.button
                    onClick={onClose}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-2 rounded-xl hover:bg-white/10 text-white/70 hover:text-white transition-colors"
                  >
                    <X size={20} />
                  </motion.button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {aiInfluencers.map((influencer) => (
                  <div
                    key={influencer.id}
                    className={`p-3 rounded-xl flex items-center space-x-3 cursor-pointer transition-all duration-300 ${
                      influencer.id === activeInfluencerId
                        ? "bg-white/20 text-white"
                        : "hover:bg-white/10 text-white/70 hover:text-white"
                    }`}
                  >
                    <div className="relative">
                      <img
                        src={influencer.avatar}
                        alt={influencer.name}
                        className="w-12 h-12 rounded-xl object-cover border border-white/20"
                      />
                      <div
                        className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-foreground ${
                          influencer.isOnline ? "bg-green-500" : "bg-gray-400"
                        }`}
                      />
                    </div>
                    <div>
                      <h4 className="font-poppins font-semibold">
                        {influencer.name}
                      </h4>
                      <p className="text-xs opacity-70">
                        {influencer.category}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 flex flex-col h-full bg-white">
              {/* Chat Header */}
              <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-background to-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <img
                        src={currentInfluencer?.avatar}
                        alt={currentInfluencer?.name}
                        className="w-12 h-12 rounded-2xl object-cover border-2 border-gray-200"
                      />
                      <div
                        className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                          currentInfluencer?.isOnline
                            ? "bg-green-500"
                            : "bg-gray-400"
                        }`}
                      />
                    </div>
                    <div>
                      <h3 className="font-poppins font-bold text-primary text-lg">
                        {currentInfluencer?.name}
                      </h3>
                      <p className="text-secondary text-xs">
                        {currentInfluencer?.isOnline
                          ? "Online now"
                          : "Last seen recently"}{" "}
                        • {currentInfluencer?.category}
                      </p>
                      <div
                        className={`inline-block px-2 py-0.5 rounded-full text-xs font-bold text-white bg-gradient-to-r ${getRarityColor(
                          currentInfluencer?.rarity || "common"
                        )} mt-1`}
                      >
                        {currentInfluencer?.rarity?.toUpperCase()}
                      </div>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
                  >
                    <MoreVertical size={20} className="text-secondary" />
                  </motion.button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-gray-50/50 to-white">
                <AnimatePresence>
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className={`flex ${
                        message.sender === "user"
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      <div
                        className={`flex items-start space-x-3 max-w-md ${
                          message.sender === "user"
                            ? "flex-row-reverse space-x-reverse"
                            : ""
                        }`}
                      >
                        <div
                          className={`w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg ${
                            message.sender === "user"
                              ? "bg-gradient-to-r from-accent to-accent/80 text-white"
                              : "bg-gradient-to-r from-primary to-primary/80 text-white"
                          }`}
                        >
                          {message.sender === "user" ? (
                            <User size={18} />
                          ) : (
                            <Bot size={18} />
                          )}
                        </div>
                        <div
                          className={`px-6 py-4 rounded-3xl shadow-lg ${
                            message.sender === "user"
                              ? "bg-gradient-to-r from-accent to-accent/90 text-white rounded-br-lg"
                              : "bg-white text-foreground rounded-bl-lg border border-gray-200"
                          }`}
                        >
                          <p className="font-inter leading-relaxed">
                            {message.text}
                          </p>
                          <p
                            className={`text-xs mt-2 ${
                              message.sender === "user"
                                ? "text-white/70"
                                : "text-gray-500"
                            }`}
                          >
                            {message.timestamp.toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {/* Typing Indicator */}
                <AnimatePresence>
                  {isTyping && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="flex justify-start"
                    >
                      <div className="flex items-start space-x-3 max-w-md">
                        <div className="w-10 h-10 rounded-2xl bg-gradient-to-r from-primary to-primary/80 text-white flex items-center justify-center shadow-lg">
                          <Bot size={18} />
                        </div>
                        <div className="px-6 py-4 rounded-3xl rounded-bl-lg bg-white border border-gray-200 shadow-lg">
                          <div className="flex space-x-1">
                            {[0, 1, 2].map((i) => (
                              <motion.div
                                key={i}
                                className="w-2 h-2 bg-primary rounded-full"
                                animate={{
                                  scale: [1, 1.2, 1],
                                  opacity: [0.5, 1, 0.5],
                                }}
                                transition={{
                                  duration: 1,
                                  repeat: Infinity,
                                  delay: i * 0.2,
                                }}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Wallet Connection Required Message */}
                {!isWalletConnected && messages.length === 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-center my-8"
                  >
                    <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 max-w-md text-center">
                      <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Wallet size={32} className="text-blue-500" />
                      </div>
                      <h3 className="font-poppins font-bold text-primary text-xl mb-2">
                        Wallet Connection Required
                      </h3>
                      <p className="text-secondary mb-6">
                        To chat with our AI influencers, you need to connect
                        your Freighter wallet first. This helps us provide a
                        personalized experience.
                      </p>
                      <motion.button
                        onClick={() => setIsWalletModalOpen(true)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white font-poppins font-semibold py-3 px-6 rounded-xl transition-all duration-300 flex items-center justify-center space-x-2 mx-auto"
                      >
                        <Wallet size={18} />
                        <span>Connect Wallet</span>
                      </motion.button>
                    </div>
                  </motion.div>
                )}

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
                    <div className="mt-3 flex justify-end space-x-3">
                      {!error.cancelled && (
                        <button
                          onClick={retryConnection}
                          className="text-sm font-medium text-blue-600 hover:text-blue-800"
                        >
                          Retry
                        </button>
                      )}
                      <button
                        onClick={clearError}
                        className="text-sm font-medium text-red-600 hover:text-red-800"
                      >
                        Dismiss
                      </button>
                    </div>
                  </motion.div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="p-4 border-t border-gray-200 bg-white">
                <div className="flex items-center space-x-4">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-3 rounded-2xl bg-gray-100 hover:bg-gray-200 transition-colors"
                  >
                    <Paperclip size={20} className="text-secondary" />
                  </motion.button>

                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                      placeholder={
                        isWalletConnected
                          ? `Message ${currentInfluencer?.name}...`
                          : "Connect wallet to send messages..."
                      }
                      disabled={!isWalletConnected}
                      className="w-full px-6 py-4 pr-14 rounded-2xl border border-gray-300 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none font-inter text-lg transition-all duration-300 disabled:bg-gray-100 disabled:text-gray-400"
                    />
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <Smile size={20} />
                    </motion.button>
                  </div>

                  <motion.button
                    onClick={sendMessage}
                    disabled={!isWalletConnected || !inputMessage.trim()}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 disabled:from-gray-300 disabled:to-gray-400 text-white font-semibold py-4 px-6 rounded-2xl transition-all duration-300 flex items-center space-x-2 shadow-lg hover:shadow-xl disabled:shadow-none"
                  >
                    <Send size={20} />
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

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
                    <div className="mt-3 flex justify-end space-x-3">
                      {!error.cancelled && (
                        <button
                          onClick={retryConnection}
                          className="text-sm font-medium text-blue-600 hover:text-blue-800"
                        >
                          Retry
                        </button>
                      )}
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

                    <div className="flex space-x-4">
                      <motion.button
                        onClick={() => setIsWalletModalOpen(false)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-poppins font-semibold py-3 px-6 rounded-xl transition-all duration-300 flex items-center justify-center"
                      >
                        <span>Continue</span>
                      </motion.button>

                      <motion.button
                        onClick={handleDisconnectWallet}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex-1 bg-red-500 hover:bg-red-600 text-white font-poppins font-semibold py-3 px-6 rounded-xl transition-all duration-300 flex items-center justify-center"
                      >
                        <span>Disconnect</span>
                      </motion.button>
                    </div>
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
    </AnimatePresence>
  );
};

export default ChatPanel;
