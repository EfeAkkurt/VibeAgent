export interface SocialStats {
  platform: "instagram" | "twitter" | "youtube" | "tiktok";
  handle: string;
  followers: number;
  engagement: number;
  verified: boolean;
  posts: number;
}

export interface ContentSchedule {
  day: string;
  times: string[];
  contentType: string[];
}

export interface SocialPost {
  id: string;
  platform: "twitter" | "instagram" | "youtube";
  content: string;
  thumbnail?: string;
  likes: number;
  shares: number;
  timestamp: string;
  isVideo?: boolean;
  hashtags?: string[];
}

export interface AIInfluencer {
  id: string;
  name: string;
  avatar: string;
  bio: string;
  fullBio: string;
  platform: string;
  followers: string;
  engagement: string;
  category: string;
  isOnline: boolean;
  personality: string;
  specialties: string[];
  socialPosts: SocialPost[];
  stats: {
    totalPosts: number;
    avgLikes: string;
    responseTime: string;
    satisfaction: string;
  };
  tags: string[];
  rarity: "common" | "rare" | "epic" | "legendary";
}
