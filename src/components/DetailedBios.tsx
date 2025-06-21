import React from "react";
import { motion } from "framer-motion";
import {
  MessageCircle,
  ChevronRight,
  Users,
  TrendingUp,
  Award,
} from "lucide-react";
import { aiInfluencers } from "../data/influencers";

interface DetailedBiosProps {
  onChatClick: (influencerId: string) => void;
}

const DetailedBios: React.FC<DetailedBiosProps> = ({ onChatClick }) => {
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
        return "shadow-yellow-500/20";
      case "epic":
        return "shadow-purple-500/20";
      case "rare":
        return "shadow-blue-500/20";
      default:
        return "shadow-gray-500/20";
    }
  };

  return (
    <section className="py-24 bg-gradient-to-br from-background via-white to-background">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center space-x-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Award size={16} />
            <span>DETAILED PROFILES</span>
          </div>
          <h2 className="text-5xl md:text-6xl font-poppins font-bold text-primary mb-6">
            Deep Dive into AI Personalities
          </h2>
          <p className="text-xl text-secondary font-inter max-w-4xl mx-auto leading-relaxed">
            Learn more about each AI influencer's unique capabilities,
            specializations, and what makes them perfect for your brand
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {aiInfluencers.map((influencer, index) => (
            <motion.div
              key={influencer.id}
              initial={{ y: 100, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ delay: index * 0.1, duration: 0.8 }}
              viewport={{ once: true }}
              className={`bg-white rounded-3xl shadow-xl hover:shadow-2xl ${getRarityGlow(
                influencer.rarity
              )} transition-all duration-500 overflow-hidden border border-gray-100 group`}
            >
              <div className="flex flex-col">
                <div className="relative">
                  <div
                    className="absolute inset-0 bg-cover bg-center opacity-20"
                    style={{ backgroundImage: `url(${influencer.avatar})` }}
                  />
                  <div className="bg-gradient-to-br from-primary/90 to-foreground/90 p-6 flex flex-col items-center justify-center relative min-h-[250px]">
                    <div className="text-center">
                      <div className="relative inline-block mb-4">
                        <motion.img
                          whileHover={{ scale: 1.05 }}
                          transition={{
                            type: "spring",
                            stiffness: 300,
                            damping: 20,
                          }}
                          src={influencer.avatar}
                          alt={influencer.name}
                          className="w-24 h-24 rounded-2xl object-cover mx-auto border-4 border-white/30 shadow-xl"
                        />
                        <div
                          className={`absolute -top-2 -right-2 px-3 py-1 rounded-full text-xs font-bold text-white bg-gradient-to-r ${getRarityColor(
                            influencer.rarity
                          )} shadow-lg`}
                        >
                          {influencer.rarity.toUpperCase()}
                        </div>
                      </div>

                      <h3 className="font-poppins font-bold text-white text-xl mb-1">
                        {influencer.name}
                      </h3>
                      <p className="text-secondary text-sm mb-4">
                        {influencer.category}
                      </p>

                      <div className="flex justify-center space-x-6 mb-4">
                        <div className="text-center">
                          <div className="flex items-center justify-center mb-1">
                            <Users size={16} className="text-accent" />
                          </div>
                          <p className="text-white font-bold text-sm">
                            {influencer.followers}
                          </p>
                          <p className="text-secondary text-xs">Followers</p>
                        </div>
                        <div className="text-center">
                          <div className="flex items-center justify-center mb-1">
                            <TrendingUp size={16} className="text-accent" />
                          </div>
                          <p className="text-white font-bold text-sm">
                            {influencer.engagement}
                          </p>
                          <p className="text-secondary text-xs">Engagement</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-center space-x-2">
                        <div
                          className={`w-3 h-3 rounded-full ${
                            influencer.isOnline ? "bg-green-500" : "bg-gray-400"
                          } shadow-lg`}
                        />
                        <p className="text-secondary text-xs">
                          {influencer.isOnline
                            ? "Online Now"
                            : "Last seen recently"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <div className="mb-4">
                    <h4 className="font-poppins font-bold text-primary text-lg mb-2">
                      About
                    </h4>
                    <p className="text-foreground font-inter text-sm leading-relaxed mb-4 line-clamp-3">
                      {influencer.bio}
                    </p>
                  </div>

                  {/* Tags */}
                  <div className="mb-4">
                    <h5 className="font-poppins font-semibold text-primary text-sm mb-2">
                      Expertise
                    </h5>
                    <div className="flex flex-wrap gap-1">
                      {influencer.tags.slice(0, 3).map((tag, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-accent/10 text-accent text-xs font-medium rounded-full border border-accent/20"
                        >
                          #{tag}
                        </span>
                      ))}
                      {influencer.tags.length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 text-secondary text-xs font-medium rounded-full">
                          +{influencer.tags.length - 3}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <motion.button
                      onClick={() => onChatClick(influencer.id)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white font-poppins font-semibold py-2 px-4 rounded-xl transition-all duration-300 flex items-center justify-center space-x-2 shadow-md hover:shadow-lg text-sm"
                    >
                      <MessageCircle size={16} />
                      <span>Start Chat</span>
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full bg-transparent hover:bg-primary/5 text-primary font-poppins font-semibold py-2 px-4 rounded-xl border border-primary/20 hover:border-primary/40 transition-all duration-300 flex items-center justify-center space-x-2 text-sm"
                    >
                      <span>Read More</span>
                      <ChevronRight size={16} />
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DetailedBios;
