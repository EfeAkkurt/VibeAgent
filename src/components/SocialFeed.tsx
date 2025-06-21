import React from "react";
import { motion } from "framer-motion";
import { Heart, Share, Play, MessageCircle, ExternalLink } from "lucide-react";
import { aiInfluencers } from "../data/influencers";

const SocialFeed: React.FC = () => {
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

        <div className="flex overflow-x-auto overflow-y-hidden space-x-6 pb-6 scrollbar-hide">
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
                  <div
                    className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold text-white ${getPlatformColor(
                      post.platform
                    )} shadow-lg`}
                  >
                    {getPlatformIcon(post.platform)} {post.platform}
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
                <div className="flex items-center space-x-3 mb-4">
                  <div className="relative">
                    <img
                      src={post.influencerAvatar}
                      alt={post.influencerName}
                      className="w-10 h-10 rounded-full object-cover border-2 border-white/30"
                    />
                    <div
                      className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-gradient-to-r ${getRarityColor(
                        post.influencerRarity
                      )} border border-white/50`}
                    ></div>
                  </div>
                  <div className="flex-1">
                    <p className="font-poppins font-semibold text-white text-sm">
                      {post.influencerName}
                    </p>
                    <p className="text-secondary text-xs">{post.timestamp}</p>
                  </div>
                </div>

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
                      <span className="text-sm font-medium">{post.shares}</span>
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
    </section>
  );
};

export default SocialFeed;
