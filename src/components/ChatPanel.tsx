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
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

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

  const currentInfluencer = aiInfluencers.find(
    (inf) => inf.id === activeInfluencerId
  );

  const handleConnectWallet = async () => {
    await connectWallet();
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

  useEffect(() => {
    // Add a welcome message from the AI when the chat opens or influencer changes
    if (isOpen && currentInfluencer) {
      setMessages([
        {
          id: "welcome",
          text: `Hi there! You're now chatting with ${currentInfluencer.name}. Feel free to ask me anything about ${currentInfluencer.category}.`,
          sender: "ai",
          timestamp: new Date(),
        },
      ]);
    }
  }, [isOpen, currentInfluencer]);

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

    if (!currentInfluencer) {
      return "Please select an influencer to start chatting.";
    }
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
            className="w-full h-full bg-white shadow-2xl overflow-hidden flex"
          >
            {/* Sidebar - Reduced to 280px max width */}
            <div className="w-[280px] min-w-[280px] bg-gradient-to-b from-primary to-foreground border-r border-secondary/20 flex flex-col">
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
                    onClick={() => {
                      if (influencer.id !== activeInfluencerId) {
                        // Reset messages when switching influencers
                        setMessages([]);
                        // Add a small delay before adding the welcome message
                        setTimeout(() => {
                          setMessages([
                            {
                              id: "welcome",
                              text: `Hi there! You're now chatting with ${influencer.name}. Feel free to ask me anything about ${influencer.category}.`,
                              sender: "ai",
                              timestamp: new Date(),
                            },
                          ]);
                        }, 300);
                      }
                    }}
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

            {/* Chat Area - Takes remaining width */}
            <motion.div
              className="flex-1 flex flex-col h-full bg-white"
              initial={{ x: "100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              key={activeInfluencerId || "empty"}
            >
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

                <div ref={messagesEndRef} />
              </div>

              {/* Chat Input */}
              <div className="p-4 border-t border-gray-200 bg-white">
                {isWalletConnected ? (
                  <div className="relative">
                    <input
                      type="text"
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                      placeholder={`Message ${
                        currentInfluencer?.name || "AI"
                      }...`}
                      className="w-full pl-6 pr-28 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent/30 transition-all duration-300 font-inter text-sm"
                    />
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
                      <button className="p-2 text-secondary hover:text-primary transition-colors">
                        <Paperclip size={20} />
                      </button>
                      <button className="p-2 text-secondary hover:text-primary transition-colors">
                        <Smile size={20} />
                      </button>
                      <button
                        onClick={sendMessage}
                        className="p-3 bg-gradient-to-r from-primary to-accent text-white rounded-xl shadow-lg hover:shadow-xl transition-all"
                      >
                        <Send size={20} />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center p-4 bg-yellow-50 border border-yellow-200 rounded-2xl">
                    <p className="font-medium text-yellow-800 mb-2">
                      Wallet Connection Required
                    </p>
                    <p className="text-sm text-yellow-700 mb-4">
                      Please connect your wallet to interact with our AI
                      influencers.
                    </p>
                    <button
                      onClick={() => setIsWalletModalOpen(true)}
                      className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-gradient-to-r from-primary to-foreground text-white font-semibold hover:shadow-lg transition-all"
                    >
                      <Wallet size={18} />
                      <span>Connect with Passkey</span>
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      )}

      {/* Wallet Connection Modal for ChatPanel */}
      <AnimatePresence>
        {isWalletModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-md"
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
        )}
      </AnimatePresence>
    </AnimatePresence>
  );
};

export default ChatPanel;
