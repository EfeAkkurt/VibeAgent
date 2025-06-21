import React from "react";
import { motion } from "framer-motion";
import {
  MessageCircle,
  Users,
  TrendingUp,
  Star,
  Clock,
  Zap,
} from "lucide-react";
import { aiInfluencers } from "../data/influencers";

interface InfluencerCardsProps {
  onChatClick: (influencerId: string) => void;
}

const InfluencerCards: React.FC<InfluencerCardsProps> = ({ onChatClick }) => {
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

  const getRarityGlow = (rarity: string) => {
    switch (rarity) {
      case "legendary":
        return "shadow-yellow-500/30";
      case "epic":
        return "shadow-purple-500/30";
      case "rare":
        return "shadow-blue-500/30";
      default:
        return "shadow-gray-500/30";
    }
  };

  return (
    <section className="py-24 bg-gradient-to-br from-white via-gray-50 to-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-cyber-grid bg-cyber-grid"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center space-x-2 bg-accent/10 text-accent px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Zap size={16} />
            <span>AI INFLUENCERS</span>
          </div>
          <h2 className="text-5xl md:text-6xl font-poppins font-bold text-primary mb-6">
            Meet Our AI Creators
          </h2>
          <p className="text-xl text-secondary font-inter max-w-4xl mx-auto leading-relaxed">
            Discover our diverse collection of AI personalities, each
            specialized in different aspects of Web3 and digital marketing.
            Choose your perfect brand ambassador.
          </p>
        </motion.div>

        {/* Horizontal Scrolling Cards */}
        <div className="relative">
          <div className="flex overflow-x-auto overflow-y-hidden space-x-8 pb-8 scrollbar-hide">
            {aiInfluencers.map((influencer, index) => (
              <motion.div
                key={influencer.id}
                initial={{ y: 100, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                viewport={{ once: true }}
                className="flex-shrink-0 w-96 group"
              >
                <div
                  className={`bg-white rounded-3xl shadow-xl hover:shadow-2xl ${getRarityGlow(
                    influencer.rarity
                  )} transition-all duration-500 overflow-hidden border border-gray-100 group-hover:border-accent/20 relative`}
                >
                  {/* Rarity Glow Effect */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${getRarityColor(
                      influencer.rarity
                    )} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}
                  ></div>

                  {/* Card Header with Background */}
                  <div className="relative h-56 overflow-hidden">
                    <div
                      className="absolute inset-0 bg-cover bg-center scale-110 group-hover:scale-125 transition-transform duration-700"
                      style={{
                        backgroundImage: `url(${influencer.avatar})`,
                        filter: "blur(20px) brightness(0.3)",
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/80 via-primary/60 to-accent/80"></div>

                    {/* Profile Section */}
                    <div className="relative p-6 h-full flex items-end">
                      <div className="flex items-center space-x-4 w-full">
                        <div className="relative">
                          <motion.img
                            whileHover={{ scale: 1.1 }}
                            transition={{
                              type: "spring",
                              stiffness: 300,
                              damping: 20,
                            }}
                            src={influencer.avatar}
                            alt={influencer.name}
                            className="w-20 h-20 rounded-2xl object-cover border-4 border-white/30 shadow-lg"
                          />
                          <div
                            className={`absolute -bottom-2 -right-2 w-6 h-6 rounded-full border-3 border-white ${
                              influencer.isOnline
                                ? "bg-green-500"
                                : "bg-gray-400"
                            } shadow-lg`}
                          />
                        </div>
                        <div className="flex-1">
                          <div
                            className={`inline-block px-2 py-1 rounded-full text-xs font-bold text-white bg-gradient-to-r ${getRarityColor(
                              influencer.rarity
                            )} mb-2`}
                          >
                            {influencer.rarity.toUpperCase()}
                          </div>
                          <h3 className="font-poppins font-bold text-white text-xl mb-1">
                            {influencer.name}
                          </h3>
                          <p className="text-white/80 text-sm font-inter mb-2">
                            {influencer.category}
                          </p>
                          <div className="flex items-center space-x-4 text-white/70 text-xs">
                            <div className="flex items-center space-x-1">
                              <Users size={12} />
                              <span>{influencer.followers}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <TrendingUp size={12} />
                              <span>{influencer.engagement}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-6 relative">
                    <p className="text-foreground font-inter mb-6 line-clamp-3 leading-relaxed">
                      {influencer.bio}
                    </p>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="bg-gray-50 rounded-xl p-3 text-center">
                        <div className="flex items-center justify-center mb-1">
                          <Star size={16} className="text-accent" />
                        </div>
                        <p className="text-sm font-semibold text-primary">
                          {influencer.stats.satisfaction}
                        </p>
                        <p className="text-xs text-secondary">Satisfaction</p>
                      </div>
                      <div className="bg-gray-50 rounded-xl p-3 text-center">
                        <div className="flex items-center justify-center mb-1">
                          <Clock size={16} className="text-accent" />
                        </div>
                        <p className="text-sm font-semibold text-primary">
                          {influencer.stats.responseTime}
                        </p>
                        <p className="text-xs text-secondary">Response</p>
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="mb-6">
                      <h4 className="font-poppins font-semibold text-primary text-sm mb-3">
                        Specialties
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {influencer.tags.slice(0, 3).map((tag, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1 bg-accent/10 text-accent text-xs font-medium rounded-full border border-accent/20"
                          >
                            #{tag}
                          </span>
                        ))}
                        {influencer.tags.length > 3 && (
                          <span className="px-3 py-1 bg-gray-100 text-secondary text-xs font-medium rounded-full">
                            +{influencer.tags.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Action Button */}
                    <motion.button
                      onClick={() => onChatClick(influencer.id)}
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white font-poppins font-semibold py-4 px-6 rounded-2xl transition-all duration-300 flex items-center justify-center space-x-3 shadow-lg hover:shadow-xl"
                    >
                      <MessageCircle size={20} />
                      <span>Start Conversation</span>
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Scroll Indicators */}
          <div className="flex justify-center mt-8 space-x-2">
            {aiInfluencers.map((_, index) => (
              <div
                key={index}
                className="w-2 h-2 rounded-full bg-gray-300 hover:bg-accent transition-colors duration-300 cursor-pointer"
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default InfluencerCards;
