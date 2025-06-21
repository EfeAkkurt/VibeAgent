import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Send,
  User,
  Bot,
  Smile,
  Paperclip,
  MoreVertical,
} from "lucide-react";
import { aiInfluencers } from "../data/influencers";

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
  const [activeInfluencer, setActiveInfluencer] = useState(
    activeInfluencerId || aiInfluencers[0].id
  );
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const currentInfluencer = aiInfluencers.find(
    (inf) => inf.id === activeInfluencer
  );

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

  useEffect(() => {
    if (activeInfluencerId) {
      setActiveInfluencer(activeInfluencerId);
    }
  }, [activeInfluencerId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const greeting: Message = {
        id: "1",
        text: `Hey there! I'm ${currentInfluencer?.name}. I'm excited to help you with your Web3 marketing needs. What would you like to know about?`,
        sender: "ai",
        timestamp: new Date(),
      };
      setMessages([greeting]);
    }
  }, [isOpen, currentInfluencer, messages.length]);

  const sendMessage = () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      setIsTyping(false);
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: getAIResponse(inputMessage, currentInfluencer?.name || ""),
        sender: "ai",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiResponse]);
    }, 1500);
  };

  const getAIResponse = (userInput: string, influencerName: string) => {
    const responses = [
      `Great question! As ${influencerName}, I'd recommend focusing on community engagement first. Web3 is all about building authentic relationships.`,
      `That's an interesting perspective! In the Web3 space, we need to think beyond traditional marketing metrics. Let me share some insights...`,
      `I love helping with that! Based on my experience in the crypto community, here's what usually works best...`,
      `You're asking the right questions! The decentralized ecosystem offers unique opportunities for authentic engagement.`,
      `Perfect timing for this question! The market is evolving rapidly, and I'm seeing some exciting trends emerge...`,
      `Absolutely! This is exactly the kind of strategic thinking that separates successful Web3 brands from the rest.`,
      `I've been working on similar challenges with other brands. Here's a framework that's been incredibly effective...`,
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex"
      >
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/50 backdrop-blur-md"
          onClick={onClose}
        />

        {/* Chat Panel */}
        <motion.div
          initial={{ x: "100%", opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: "100%", opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="relative w-full h-full flex overflow-hidden"
        >
          {/* Sidebar */}
          <div className="w-72 bg-gradient-to-b from-primary to-foreground border-r border-secondary/20 flex flex-col">
            <div className="p-6 border-b border-secondary/20">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-poppins font-bold text-white text-xl">
                  AI Influencers
                </h2>
                <motion.button
                  onClick={onClose}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="text-white hover:text-accent transition-colors p-2 rounded-xl hover:bg-white/10"
                >
                  <X size={20} />
                </motion.button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              {aiInfluencers.map((influencer) => (
                <motion.button
                  key={influencer.id}
                  onClick={() => setActiveInfluencer(influencer.id)}
                  whileHover={{ x: 4 }}
                  className={`w-full p-4 text-left hover:bg-white/10 transition-all duration-300 border-b border-secondary/10 ${
                    activeInfluencer === influencer.id
                      ? "bg-white/20 border-l-4 border-l-accent"
                      : ""
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <img
                        src={influencer.avatar}
                        alt={influencer.name}
                        className="w-12 h-12 rounded-2xl object-cover border-2 border-white/30"
                      />
                      <div
                        className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-primary ${
                          influencer.isOnline ? "bg-green-500" : "bg-gray-400"
                        }`}
                      />
                      <div
                        className={`absolute -top-1 -left-1 w-4 h-4 rounded-full bg-gradient-to-r ${getRarityColor(
                          influencer.rarity
                        )} border border-white/50`}
                      ></div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-poppins font-semibold text-white truncate">
                        {influencer.name}
                      </p>
                      <p className="text-secondary text-sm truncate">
                        {influencer.category}
                      </p>
                      <p className="text-xs text-secondary/70">
                        {influencer.isOnline ? "Online" : "Offline"}
                      </p>
                    </div>
                  </div>
                </motion.button>
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
                    placeholder={`Message ${currentInfluencer?.name}...`}
                    className="w-full px-6 py-4 pr-14 rounded-2xl border border-gray-300 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none font-inter text-lg transition-all duration-300"
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
                  disabled={!inputMessage.trim()}
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
    </AnimatePresence>
  );
};

export default ChatPanel;
