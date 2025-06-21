import React from "react";
import { AIInfluencer } from "./types";
import { getTierBadgeColor, getTierColor } from "./utils";

interface InfluencerCardProps {
  influencer: AIInfluencer;
  onClick: () => void;
  index: number;
}

const InfluencerCard: React.FC<InfluencerCardProps> = ({
  influencer,
  onClick,
  index,
}) => {
  return (
    <div
      className="group cursor-pointer"
      style={{ animationDelay: `${index * 100}ms` }}
      onClick={onClick}
    >
      <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden hover:scale-105 hover:bg-white/10 transition-all duration-500 hover:border-white/20">
        <div className="relative h-32 bg-gradient-to-r from-purple-600 to-pink-600 overflow-hidden">
          <div className="absolute inset-0 bg-black/20"></div>

          <div
            className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold text-white uppercase ${getTierBadgeColor(
              influencer.rarity
            )}`}
          >
            {influencer.rarity}
          </div>

          <div className="absolute top-4 right-4 flex items-center gap-2">
            <div
              className={`w-2 h-2 rounded-full ${
                influencer.isOnline ? "bg-green-400" : "bg-gray-400"
              }`}
            ></div>
            <span className="text-xs text-white/80">
              {influencer.isOnline ? "Online" : "Offline"}
            </span>
          </div>
        </div>

        <div className="relative -mt-12 flex justify-center">
          <div
            className={`w-24 h-24 rounded-full p-1 bg-white bg-gradient-to-r ${getTierColor(
              influencer.rarity
            )}`}
          >
            <img
              src={influencer.avatar}
              alt={influencer.name}
              className="w-full h-full rounded-full object-cover"
            />
          </div>
        </div>

        <div className="p-6 pt-4">
          <div className="text-center mb-4">
            <h3 className="text-xl font-bold text-white mb-1">
              {influencer.name}
            </h3>
            <p className="text-purple-300 text-sm">{influencer.category}</p>
          </div>

          <div className="grid grid-cols-3 gap-2 mb-4 text-center">
            <div>
              <div className="text-xs text-white font-medium">
                {influencer.followers}
              </div>
              <div className="text-xs text-gray-400">Followers</div>
            </div>
            <div>
              <div className="text-xs text-white font-medium">
                {influencer.engagement}
              </div>
              <div className="text-xs text-gray-400">Engagement</div>
            </div>
            <div>
              <div className="text-xs text-white font-medium">
                {influencer.stats.avgLikes}
              </div>
              <div className="text-xs text-gray-400">Avg. Likes</div>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-1 mb-4">
            {influencer.tags.slice(0, 4).map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 bg-purple-500/20 text-purple-300 text-xs rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfluencerCard;
