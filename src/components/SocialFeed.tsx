import React, { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Heart,
  Share,
  Play,
  MessageCircle,
  ExternalLink,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import { aiInfluencers } from "../data/influencers";

const SocialFeed: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Function to scroll to the next card
  const scrollNext = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  };

  // Function to scroll to the previous card
  const scrollPrev = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -300, behavior: "smooth" });
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

  const allPosts = aiInfluencers.flatMap((influencer) =>
    influencer.socialPosts.map((post) => ({
      ...post,
      influencerName: influencer.name,
      influencerAvatar: influencer.avatar,
      influencerRarity: influencer.rarity,
    }))
  );

  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case "twitter":
        return "bg-blue-500";
      case "instagram":
        return "bg-pink-500";
      case "youtube":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case "twitter":
        return "𝕏";
      case "instagram":
        return "📸";
      case "youtube":
        return "▶️";
      default:
        return "📱";
    }
  };

  return (
    <section className="py-24 bg-gradient-to-br from-primary via-foreground to-primary relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-cyber-grid bg-cyber-grid opacity-10"></div>
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-accent/10 to-transparent"
          animate={{ x: ["-100%", "100%"] }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center space-x-2 bg-accent/20 text-accent px-4 py-2 rounded-full text-sm font-medium mb-6">
            <MessageCircle size={16} />
            <span>SOCIAL FEED</span>
          </div>
          <h2 className="text-5xl md:text-6xl font-poppins font-bold text-white mb-6">
            Latest from Social Media
          </h2>
          <p className="text-xl text-secondary font-inter max-w-3xl mx-auto">
            See what our AI influencers are sharing across Twitter, Instagram,
            and YouTube
          </p>
        </motion.div>

        <div className="relative">
          <div
            ref={scrollRef}
            className="flex overflow-x-auto overflow-y-hidden space-x-6 pb-6 scrollbar-hide"
          >
            {allPosts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ y: 100, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                viewport={{ once: true }}
                className="flex-shrink-0 w-80 bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 hover:bg-white/20 transition-all duration-300 overflow-hidden group"
              >
                {post.thumbnail && (
                  <div className="relative">
                    <img
                      src={post.thumbnail}
                      alt="Post thumbnail"
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {post.isVideo && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <motion.div
                          className="bg-black/50 rounded-full p-4 hover:bg-black/70 transition-colors cursor-pointer"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Play size={24} className="text-white fill-white" />
                        </motion.div>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <img
                            src={post.influencerAvatar}
                            alt={post.influencerName}
                            className="w-8 h-8 rounded-full object-cover border border-white/50"
                          />
                          <div>
                            <p className="font-poppins font-semibold text-white text-sm">
                              {post.influencerName}
                            </p>
                            <p className="text-white/70 text-xs">
                              {post.timestamp}
                            </p>
                          </div>
                        </div>
                        <div
                          className={`px-2 py-1 rounded-full text-xs font-bold text-white ${getPlatformColor(
                            post.platform
                          )} shadow-lg flex items-center space-x-1`}
                        >
                          <span>{getPlatformIcon(post.platform)}</span>
                        </div>
                      </div>
                    </div>
                    <motion.button
                      className="absolute top-4 right-4 p-2 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <ExternalLink size={16} />
                    </motion.button>
                  </div>
                )}

                <div className="p-6">
                  <p className="text-white font-inter mb-6 line-clamp-3 leading-relaxed">
                    {post.content}
                  </p>

                  {/* Hashtags */}
                  {post.hashtags && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {post.hashtags.slice(0, 2).map((tag, idx) => (
                        <span
                          key={idx}
                          className="text-accent text-xs font-medium"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center justify-between text-secondary">
                    <div className="flex items-center space-x-6">
                      <motion.button
                        className="flex items-center space-x-2 hover:text-red-400 transition-colors"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Heart size={18} />
                        <span className="text-sm font-medium">
                          {post.likes.toLocaleString()}
                        </span>
                      </motion.button>
                      <motion.button
                        className="flex items-center space-x-2 hover:text-blue-400 transition-colors"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Share size={18} />
                        <span className="text-sm font-medium">
                          {post.shares}
                        </span>
                      </motion.button>
                    </div>
                    <motion.button
                      className="text-accent hover:text-white transition-colors p-2 rounded-full hover:bg-accent/20"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <MessageCircle size={18} />
                    </motion.button>
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
              className="bg-white/20 backdrop-blur-sm p-3 rounded-full shadow-lg hover:bg-white/30 transition-all duration-300"
            >
              <ChevronLeft size={24} className="text-white" />
            </motion.button>
          </div>
          <div className="absolute top-1/2 right-0 transform -translate-y-1/2 translate-x-4">
            <motion.button
              onClick={scrollNext}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="bg-white/20 backdrop-blur-sm p-3 rounded-full shadow-lg hover:bg-white/30 transition-all duration-300"
            >
              <ChevronRight size={24} className="text-white" />
            </motion.button>
          </div>

          {/* View More Button */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <motion.button
              className="bg-white/10 hover:bg-white/20 text-white font-poppins font-semibold py-4 px-8 rounded-2xl border border-white/20 hover:border-white/40 transition-all duration-300 backdrop-blur-sm"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              View All Posts
            </motion.button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default SocialFeed;
