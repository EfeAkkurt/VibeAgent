import React from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { AIInfluencer } from "./types";
import { getTierColor, getPlatformIcon } from "./utils";

interface InfluencerDetailModalProps {
  influencer: AIInfluencer;
  onClose: () => void;
}

const InfluencerDetailModal: React.FC<InfluencerDetailModalProps> = ({
  influencer,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-slate-900/95 backdrop-blur-sm border border-white/20 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="relative">
          <div
            className={`h-32 bg-gradient-to-r ${getTierColor(
              influencer.rarity
            )}`}
          >
            <div className="absolute inset-0 bg-black/30"></div>
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 bg-black/50 rounded-full text-white hover:bg-black/70 transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="relative -mt-16 flex flex-col items-center px-6">
            <div
              className={`w-32 h-32 rounded-full border-4 p-1 bg-white mb-4 bg-gradient-to-r ${getTierColor(
                influencer.rarity
              )}`}
            >
              <img
                src={influencer.avatar}
                alt={influencer.name}
                className="w-full h-full rounded-full object-cover"
              />
            </div>

            <h2 className="text-3xl font-bold text-white mb-2">
              {influencer.name}
            </h2>
            <p className="text-purple-300 text-lg mb-4">
              {influencer.category}
            </p>
          </div>
        </div>

        <div className="px-6 pb-6">
          <div className="mb-8">
            <h3 className="text-xl font-bold text-white mb-3">About</h3>
            <p className="text-gray-300 leading-relaxed">
              {influencer.fullBio}
            </p>
          </div>

          <div className="mb-8">
            <h3 className="text-xl font-bold text-white mb-4">
              Social Media Posts
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {influencer.socialPosts.map((post) => (
                <div
                  key={post.id}
                  className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4"
                >
                  <div className="flex items-center gap-3 mb-3 text-white">
                    {getPlatformIcon(post.platform)}
                    <span className="font-medium capitalize">
                      {post.platform}
                    </span>
                  </div>
                  <p className="text-gray-300 text-sm mb-2">{post.content}</p>
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>{post.likes} Likes</span>
                    <span>{post.shares} Shares</span>
                    <span>{post.timestamp}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold text-white mb-4">Specialties</h3>
            <div className="flex flex-wrap gap-2">
              {influencer.specialties.map((specialty) => (
                <span
                  key={specialty}
                  className="px-3 py-1 bg-purple-500/20 text-purple-300 text-sm rounded-full"
                >
                  {specialty}
                </span>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default InfluencerDetailModal;
