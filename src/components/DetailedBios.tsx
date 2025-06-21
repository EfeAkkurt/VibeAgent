import React, { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import {
  MessageCircle,
  ChevronRight,
  ChevronLeft,
  Users,
  TrendingUp,
  Award,
} from "lucide-react";
import { aiInfluencers } from "../data/influencers";

interface DetailedBiosProps {
  onChatClick: (influencerId: string) => void;
}

const DetailedBios: React.FC<DetailedBiosProps> = ({ onChatClick }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Function to scroll to the next card
  const scrollNext = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 400, behavior: "smooth" });
    }
  };

  // Function to scroll to the previous card
  const scrollPrev = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -400, behavior: "smooth" });
    }
  };

  // Auto-scroll animation
  useEffect(() => {
    let animationId: number;
    let direction = 1;
    let isPaused = false;

    const startAutoScroll = () => {
      if (scrollRef.current) {
        const container = scrollRef.current;
        const maxScroll = container.scrollWidth - container.clientWidth;

        const autoScroll = () => {
          if (!isPaused && container) {
            // Change direction when reaching the end
            if (container.scrollLeft >= maxScroll - 10) {
              direction = -1;
            } else if (container.scrollLeft <= 10) {
              direction = 1;
            }

            container.scrollLeft += direction * 0.5; // Slow scroll speed
          }
          animationId = requestAnimationFrame(autoScroll);
        };

        animationId = requestAnimationFrame(autoScroll);
      }
    };

    // Start the animation
    startAutoScroll();

    // Pause on hover or touch
    if (scrollRef.current) {
      const container = scrollRef.current;

      const pauseScroll = () => {
        isPaused = true;
      };

      const resumeScroll = () => {
        isPaused = false;
      };

      container.addEventListener("mouseenter", pauseScroll);
      container.addEventListener("mouseleave", resumeScroll);
      container.addEventListener("touchstart", pauseScroll);
      container.addEventListener("touchend", resumeScroll);

      return () => {
        cancelAnimationFrame(animationId);
        container.removeEventListener("mouseenter", pauseScroll);
        container.removeEventListener("mouseleave", resumeScroll);
        container.removeEventListener("touchstart", pauseScroll);
        container.removeEventListener("touchend", resumeScroll);
      };
    }

    return () => cancelAnimationFrame(animationId);
  }, []);

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

        <div className="relative">
          <div
            ref={scrollRef}
            className="flex overflow-x-auto overflow-y-hidden space-x-8 pb-8 scrollbar-hide"
          >
            {aiInfluencers.map((influencer, index) => (
              <motion.div
                key={influencer.id}
                initial={{ y: 100, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.1, duration: 0.8 }}
                viewport={{ once: true }}
                className="flex-shrink-0 w-96"
              >
                <div
                  className={`bg-white rounded-3xl shadow-xl hover:shadow-2xl ${getRarityGlow(
                    influencer.rarity
                  )} transition-all duration-500 overflow-hidden border border-gray-100 group h-full`}
                >
                  <div className="flex flex-col h-full">
                    <div className="relative">
                      <img
                        src={influencer.avatar}
                        alt={influencer.name}
                        className="w-full h-56 object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                      <div className="absolute bottom-0 left-0 right-0 p-6">
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
                        <p className="text-white/80 text-sm font-inter">
                          {influencer.category}
                        </p>

                        <div className="flex items-center space-x-4 mt-2 text-white/70 text-xs">
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

                    <div className="p-6 flex-1 flex flex-col">
                      <div className="mb-4 flex-1">
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

                      <div className="flex flex-col gap-2 mt-auto">
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
                </div>
              </motion.div>
            ))}
          </div>

          {/* Navigation Buttons */}
          <div className="absolute top-1/2 left-0 transform -translate-y-1/2 -translate-x-4">
            <motion.button
              onClick={scrollPrev}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="bg-white/80 backdrop-blur-sm p-3 rounded-full shadow-lg hover:bg-white transition-all duration-300"
            >
              <ChevronLeft size={24} className="text-primary" />
            </motion.button>
          </div>
          <div className="absolute top-1/2 right-0 transform -translate-y-1/2 translate-x-4">
            <motion.button
              onClick={scrollNext}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="bg-white/80 backdrop-blur-sm p-3 rounded-full shadow-lg hover:bg-white transition-all duration-300"
            >
              <ChevronRight size={24} className="text-primary" />
            </motion.button>
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

export default DetailedBios;
