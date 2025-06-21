import React from "react";
import { Instagram, Twitter, Youtube, Globe } from "lucide-react";

export const getTierColor = (tier: string) => {
  switch (tier) {
    case "LEGENDARY":
      return "from-yellow-400 to-orange-500";
    case "EPIC":
      return "from-purple-400 to-pink-500";
    case "RARE":
      return "from-blue-400 to-cyan-500";
    default:
      return "from-gray-400 to-gray-600";
  }
};

export const getTierBadgeColor = (tier: string) => {
  switch (tier) {
    case "LEGENDARY":
      return "bg-gradient-to-r from-yellow-400 to-orange-500";
    case "EPIC":
      return "bg-gradient-to-r from-purple-400 to-pink-500";
    case "RARE":
      return "bg-gradient-to-r from-blue-400 to-cyan-500";
    default:
      return "bg-gradient-to-r from-gray-400 to-gray-600";
  }
};

export const formatNumber = (num: number) => {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
};

export const getPlatformIcon = (platform: string) => {
  switch (platform) {
    case "instagram":
      return <Instagram className="w-5 h-5" />;
    case "twitter":
      return <Twitter className="w-5 h-5" />;
    case "youtube":
      return <Youtube className="w-5 h-5" />;
    default:
      return <Globe className="w-5 h-5" />;
  }
};
