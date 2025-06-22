import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import { MessageCircle, Users, ArrowRight, ArrowLeft, Zap } from "lucide-react";
import { aiInfluencers } from "../data/mockData";

interface InfluencerCardsProps {
  onChatClick: (influencerId: string) => void;
}

const InfluencerCards: React.FC<InfluencerCardsProps> = ({ onChatClick }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const cardsPerView = 3; // Number of cards to show at once
  const carouselRef = useRef<HTMLDivElement>(null);

  // Calculate the maximum index for navigation
  const maxIndex = Math.max(0, aiInfluencers.length - cardsPerView);

  // Handle next button click
  const handleNext = () => {
    if (currentIndex < maxIndex) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  // Handle previous button click
  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  // Get rarity color
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

        <div className="flex justify-between items-center mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-poppins font-bold text-foreground">
              Meet Our AI Creators
            </h2>
            <p className="text-secondary mt-2 max-w-2xl">
              Connect with our diverse roster of AI influencers specializing in
              different areas of Web3 and digital marketing.
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <motion.button
              onClick={handlePrevious}
              disabled={currentIndex === 0}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`p-3 rounded-full ${
                currentIndex === 0
                  ? "bg-gray-100 text-gray-400"
                  : "bg-gray-200 hover:bg-gray-300 text-foreground"
              } transition-all duration-300`}
            >
              <ArrowLeft size={20} />
            </motion.button>
            <motion.button
              onClick={handleNext}
              disabled={currentIndex === maxIndex}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`p-3 rounded-full ${
                currentIndex === maxIndex
                  ? "bg-gray-100 text-gray-400"
                  : "bg-gray-200 hover:bg-gray-300 text-foreground"
              } transition-all duration-300`}
            >
              <ArrowRight size={20} />
            </motion.button>
          </div>
        </div>

        <div className="relative overflow-hidden">
          <motion.div
            ref={carouselRef}
            className="flex space-x-6"
            animate={{
              x: `-${currentIndex * (100 / cardsPerView)}%`,
            }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            {aiInfluencers.map((influencer) => (
              <motion.div
                key={influencer.id}
                className="w-full md:w-1/3 flex-shrink-0"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 h-full flex flex-col">
                  {/* Card Header with Image */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={influencer.avatar}
                      alt={influencer.name}
                      className="w-full h-full object-cover"
                      style={{ objectPosition: "center top" }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                    <div className="absolute top-4 right-4">
                      <div
                        className={`px-3 py-1 rounded-full text-xs font-bold text-white bg-gradient-to-r ${getRarityColor(
                          influencer.rarity
                        )} shadow-lg`}
                      >
                        {influencer.rarity.toUpperCase()}
                      </div>
                    </div>
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="flex justify-between items-end">
                        <div>
                          <h3 className="text-white font-poppins font-bold text-xl">
                            {influencer.name}
                          </h3>
                          <p className="text-white/80 text-sm">
                            {influencer.category}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-6 flex-1 flex flex-col">
                    <p className="text-secondary line-clamp-3 mb-6 flex-1">
                      {influencer.bio}
                    </p>
                    <div className="flex items-center justify-between mt-auto">
                      <div className="flex items-center space-x-4">
                        <div className="flex flex-col">
                          <span className="text-xs text-secondary">
                            Followers
                          </span>
                          <span className="font-semibold text-foreground">
                            {influencer.followers}
                          </span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-xs text-secondary">
                            Engagement
                          </span>
                          <span className="font-semibold text-foreground">
                            {influencer.engagement}
                          </span>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <motion.button
                          onClick={() => onChatClick(influencer.id)}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="p-3 rounded-xl bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white transition-all duration-300"
                        >
                          <MessageCircle size={20} />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="p-3 rounded-xl bg-gray-100 hover:bg-gray-200 transition-all duration-300"
                        >
                          <Users size={20} className="text-secondary" />
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Mobile Navigation Dots */}
        <div className="flex justify-center mt-8 md:hidden">
          {Array.from({ length: maxIndex + 1 }).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 mx-1 rounded-full ${
                currentIndex === index ? "bg-primary" : "bg-gray-300"
              }`}
            ></button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default InfluencerCards;
