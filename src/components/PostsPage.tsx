import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Instagram,
  Twitter,
  Youtube,
  Search,
  TrendingUp,
  Hash,
  Heart,
  MessageSquare,
  Share2,
  Eye,
  CheckCircle,
  Clock,
} from "lucide-react";

// Define interfaces based on requirements
interface PostAuthor {
  name: string;
  handle: string;
  avatar: string;
  verified: boolean;
}

interface PostContent {
  text?: string;
  images?: string[];
  video?: string;
  thumbnail?: string;
}

interface PostMetrics {
  likes: number;
  comments: number;
  shares: number;
  views?: number;
}

interface Post {
  id: string;
  platform: "instagram" | "twitter" | "youtube";
  author: PostAuthor;
  content: PostContent;
  metrics: PostMetrics;
  timestamp: Date;
  hashtags: string[];
  engagement_rate: number;
}

// Mock data for posts
const mockPosts: Post[] = [
  {
    id: "post-001",
    platform: "instagram",
    author: {
      name: "MetaDesigner",
      handle: "meta.designer",
      avatar: "https://images.unsplash.com/photo-1535207010348-71e47296838a",
      verified: true,
    },
    content: {
      text: "Just finished this new digital art piece for the upcoming NFT collection. What do you think? #NFTart #digitalart",
      images: [
        "https://images.unsplash.com/photo-1633355444132-695d5876cd00",
        "https://images.unsplash.com/photo-1614812513172-567d2fe96a75",
      ],
    },
    metrics: {
      likes: 3420,
      comments: 142,
      shares: 89,
    },
    timestamp: new Date("2023-06-15T14:32:00"),
    hashtags: ["NFTart", "digitalart", "metaverse", "cryptoart"],
    engagement_rate: 8.7,
  },
  {
    id: "post-002",
    platform: "twitter",
    author: {
      name: "CryptoSage",
      handle: "crypto_sage",
      avatar: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04",
      verified: true,
    },
    content: {
      text: "Just analyzed the latest @AaveAave protocol update. The new efficiency mode is a game-changer for capital efficiency in DeFi lending. Thread below 👇",
    },
    metrics: {
      likes: 1240,
      comments: 89,
      shares: 342,
    },
    timestamp: new Date("2023-06-16T09:15:00"),
    hashtags: ["DeFi", "Aave", "YieldFarming", "CryptoNews"],
    engagement_rate: 6.2,
  },
  {
    id: "post-003",
    platform: "youtube",
    author: {
      name: "BlockchainGuru",
      handle: "blockchain_guru",
      avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36",
      verified: true,
    },
    content: {
      text: "Breaking down the top 5 security vulnerabilities in smart contracts and how to avoid them",
      thumbnail: "https://images.unsplash.com/photo-1639322537228-f710d846310a",
      video: "https://example.com/video.mp4",
    },
    metrics: {
      likes: 5600,
      comments: 320,
      shares: 890,
      views: 42000,
    },
    timestamp: new Date("2023-06-14T18:45:00"),
    hashtags: ["SmartContracts", "Security", "Blockchain", "Development"],
    engagement_rate: 9.3,
  },
  {
    id: "post-004",
    platform: "instagram",
    author: {
      name: "TokenStrategist",
      handle: "token.strategist",
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956",
      verified: false,
    },
    content: {
      text: "New tokenomics model just dropped! Swipe to see the full breakdown of supply distribution and vesting schedules.",
      images: [
        "https://images.unsplash.com/photo-1621761191319-c6fb62004040",
        "https://images.unsplash.com/photo-1639762681057-408e52192e55",
        "https://images.unsplash.com/photo-1621504450181-5d356f61d307",
      ],
    },
    metrics: {
      likes: 2150,
      comments: 98,
      shares: 124,
    },
    timestamp: new Date("2023-06-13T11:20:00"),
    hashtags: ["Tokenomics", "CryptoEconomics", "TokenDesign"],
    engagement_rate: 7.4,
  },
  {
    id: "post-005",
    platform: "twitter",
    author: {
      name: "CommunityBuilder",
      handle: "community_builder",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2",
      verified: true,
    },
    content: {
      text: "The key to sustainable Web3 communities is not just incentives—it is creating genuine connection and shared purpose. Here is how we helped @ProjectName increase active participation by 300% in just 2 months.",
    },
    metrics: {
      likes: 1850,
      comments: 134,
      shares: 620,
    },
    timestamp: new Date("2023-06-16T16:30:00"),
    hashtags: ["CommunityBuilding", "Web3", "DAOs", "Governance"],
    engagement_rate: 9.2,
  },
  {
    id: "post-006",
    platform: "youtube",
    author: {
      name: "TokenStrategist",
      handle: "token.strategist",
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956",
      verified: true,
    },
    content: {
      text: "In this deep dive, I analyze five successful token models and what makes them work. Understanding these patterns can help new projects avoid common pitfalls.",
      thumbnail: "https://images.unsplash.com/photo-1621761191319-c6fb62004040",
      video: "https://example.com/video2.mp4",
    },
    metrics: {
      likes: 4200,
      comments: 245,
      shares: 780,
      views: 38500,
    },
    timestamp: new Date("2023-06-12T13:15:00"),
    hashtags: ["Tokenomics", "CryptoEconomics", "Web3Strategy"],
    engagement_rate: 8.1,
  },
];

interface PostsPageProps {
  isOpen: boolean;
  onClose: () => void;
}

const PostsPage: React.FC<PostsPageProps> = ({ isOpen, onClose }) => {
  const [posts] = useState<Post[]>(mockPosts);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>(mockPosts);
  const [searchTerm, setSearchTerm] = useState("");
  const [platformFilter, setPlatformFilter] = useState<
    "all" | "instagram" | "twitter" | "youtube"
  >("all");
  const [sortBy, setSortBy] = useState<
    "recent" | "engagement" | "likes" | "comments" | "shares"
  >("recent");
  const [selectedHashtag, setSelectedHashtag] = useState<string | null>(null);

  useEffect(() => {
    // Apply filters
    let result = [...posts];

    // Platform filter
    if (platformFilter !== "all") {
      result = result.filter((post) => post.platform === platformFilter);
    }

    // Search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (post) =>
          post.content.text?.toLowerCase().includes(term) ||
          post.author.name.toLowerCase().includes(term) ||
          post.author.handle.toLowerCase().includes(term) ||
          post.hashtags.some((tag) => tag.toLowerCase().includes(term))
      );
    }

    // Hashtag filter
    if (selectedHashtag) {
      result = result.filter((post) => post.hashtags.includes(selectedHashtag));
    }

    // Apply sorting
    switch (sortBy) {
      case "recent":
        result.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
        break;
      case "engagement":
        result.sort((a, b) => b.engagement_rate - a.engagement_rate);
        break;
      case "likes":
        result.sort((a, b) => b.metrics.likes - a.metrics.likes);
        break;
      case "comments":
        result.sort((a, b) => b.metrics.comments - a.metrics.comments);
        break;
      case "shares":
        result.sort((a, b) => b.metrics.shares - a.metrics.shares);
        break;
    }

    setFilteredPosts(result);
  }, [posts, platformFilter, searchTerm, sortBy, selectedHashtag]);

  // Get all unique hashtags from posts
  const allHashtags = Array.from(
    new Set(posts.flatMap((post) => post.hashtags))
  ).sort();

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M";
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K";
    }
    return num.toString();
  };

  const formatDate = (date: Date): string => {
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;

    return date.toLocaleDateString();
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case "instagram":
        return <Instagram size={18} />;
      case "twitter":
        return <Twitter size={18} />;
      case "youtube":
        return <Youtube size={18} />;
      default:
        return null;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ right: "-100vw" }}
          animate={{ right: 0 }}
          exit={{ right: "-100vw" }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed top-0 right-0 w-full h-full bg-background z-50 overflow-hidden"
        >
          <div className="h-full flex flex-col">
            {/* Header */}
            <div className="bg-gradient-to-r from-primary to-foreground p-6 text-white">
              <div className="container mx-auto flex justify-between items-center">
                <h1 className="font-poppins text-2xl font-bold">
                  Social Posts
                </h1>
                <motion.button
                  onClick={onClose}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-2 rounded-xl hover:bg-white/10 transition-colors"
                >
                  <X size={24} />
                </motion.button>
              </div>
            </div>

            {/* Filters */}
            <div className="bg-white border-b border-gray-200 py-4 px-6 shadow-sm">
              <div className="container mx-auto">
                <div className="flex flex-wrap items-center gap-4">
                  {/* Search */}
                  <div className="relative flex-grow max-w-md">
                    <Search
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      size={18}
                    />
                    <input
                      type="text"
                      placeholder="Search posts, hashtags, or creators..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary/30"
                    />
                  </div>

                  {/* Platform Filter */}
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setPlatformFilter("all")}
                      className={`px-3 py-2 rounded-xl ${
                        platformFilter === "all"
                          ? "bg-primary text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      } transition-colors`}
                    >
                      All
                    </button>
                    <button
                      onClick={() => setPlatformFilter("instagram")}
                      className={`px-3 py-2 rounded-xl flex items-center space-x-2 ${
                        platformFilter === "instagram"
                          ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      } transition-colors`}
                    >
                      <Instagram size={16} />
                      <span>Instagram</span>
                    </button>
                    <button
                      onClick={() => setPlatformFilter("twitter")}
                      className={`px-3 py-2 rounded-xl flex items-center space-x-2 ${
                        platformFilter === "twitter"
                          ? "bg-blue-500 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      } transition-colors`}
                    >
                      <Twitter size={16} />
                      <span>Twitter</span>
                    </button>
                    <button
                      onClick={() => setPlatformFilter("youtube")}
                      className={`px-3 py-2 rounded-xl flex items-center space-x-2 ${
                        platformFilter === "youtube"
                          ? "bg-red-600 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      } transition-colors`}
                    >
                      <Youtube size={16} />
                      <span>YouTube</span>
                    </button>
                  </div>

                  {/* Sort Options */}
                  <div className="flex items-center space-x-2 ml-auto">
                    <span className="text-gray-500 text-sm">Sort by:</span>
                    <select
                      value={sortBy}
                      onChange={(e) =>
                        setSortBy(
                          e.target.value as
                            | "recent"
                            | "engagement"
                            | "likes"
                            | "comments"
                            | "shares"
                        )
                      }
                      className="px-3 py-2 rounded-xl bg-gray-100 border-none focus:ring-2 focus:ring-primary/30 text-gray-700"
                    >
                      <option value="recent">Recent</option>
                      <option value="engagement">Engagement</option>
                      <option value="likes">Likes</option>
                      <option value="comments">Comments</option>
                      <option value="shares">Shares</option>
                    </select>
                  </div>
                </div>

                {/* Hashtag Pills */}
                <div className="mt-4 flex flex-wrap gap-2">
                  {allHashtags.slice(0, 10).map((tag) => (
                    <button
                      key={tag}
                      onClick={() =>
                        setSelectedHashtag(selectedHashtag === tag ? null : tag)
                      }
                      className={`px-3 py-1 rounded-full text-sm flex items-center space-x-1 ${
                        selectedHashtag === tag
                          ? "bg-accent text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      } transition-colors`}
                    >
                      <Hash size={14} />
                      <span>{tag}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Posts Grid */}
            <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
              <div className="container mx-auto">
                <div className="posts-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredPosts.length > 0 ? (
                    filteredPosts.map((post) => (
                      <motion.div
                        key={post.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="post-card bg-white/90 backdrop-filter backdrop-blur-lg rounded-2xl border border-gray-200/50 overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                      >
                        {/* Post Header */}
                        <div className="p-4 flex items-center space-x-3 border-b border-gray-100">
                          <img
                            src={post.author.avatar}
                            alt={post.author.name}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                          <div className="flex-1">
                            <div className="flex items-center">
                              <h3 className="font-poppins font-semibold text-primary">
                                {post.author.name}
                              </h3>
                              {post.author.verified && (
                                <CheckCircle
                                  size={14}
                                  className="ml-1 text-blue-500"
                                />
                              )}
                            </div>
                            <p className="text-secondary text-xs">
                              @{post.author.handle}
                            </p>
                          </div>
                          <div
                            className={`p-2 rounded-full ${
                              post.platform === "instagram"
                                ? "bg-gradient-to-br from-purple-500 to-pink-500"
                                : post.platform === "twitter"
                                ? "bg-blue-500"
                                : "bg-red-600"
                            } text-white`}
                          >
                            {getPlatformIcon(post.platform)}
                          </div>
                        </div>

                        {/* Post Content */}
                        <div className="p-4">
                          {/* Text Content */}
                          {post.content.text && (
                            <p className="text-foreground mb-4 line-clamp-3">
                              {post.content.text}
                            </p>
                          )}

                          {/* Media Content */}
                          {post.platform === "instagram" &&
                            post.content.images && (
                              <div
                                className={`mb-4 rounded-xl overflow-hidden ${
                                  post.content.images.length > 1
                                    ? "relative"
                                    : ""
                                }`}
                              >
                                <img
                                  src={post.content.images[0]}
                                  alt="Post content"
                                  className="w-full h-64 object-cover"
                                />
                                {post.content.images.length > 1 && (
                                  <div className="absolute top-2 right-2 bg-black/50 text-white px-2 py-1 rounded-md text-xs">
                                    +{post.content.images.length - 1}
                                  </div>
                                )}
                              </div>
                            )}

                          {post.platform === "youtube" &&
                            post.content.thumbnail && (
                              <div className="mb-4 rounded-xl overflow-hidden relative">
                                <img
                                  src={post.content.thumbnail}
                                  alt="Video thumbnail"
                                  className="w-full h-48 object-cover"
                                />
                                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                                  <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center">
                                    <div className="w-0 h-0 border-t-8 border-t-transparent border-l-12 border-l-red-600 border-b-8 border-b-transparent ml-1"></div>
                                  </div>
                                </div>
                                {post.metrics.views && (
                                  <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded-md text-xs flex items-center">
                                    <Eye size={14} className="mr-1" />
                                    {formatNumber(post.metrics.views)} views
                                  </div>
                                )}
                              </div>
                            )}

                          {/* Hashtags */}
                          <div className="flex flex-wrap gap-2 mb-4">
                            {post.hashtags.slice(0, 3).map((tag) => (
                              <span
                                key={tag}
                                className="text-xs text-accent hover:text-accent/80 cursor-pointer"
                              >
                                #{tag}
                              </span>
                            ))}
                            {post.hashtags.length > 3 && (
                              <span className="text-xs text-secondary">
                                +{post.hashtags.length - 3} more
                              </span>
                            )}
                          </div>

                          {/* Metrics */}
                          <div className="flex items-center justify-between text-secondary text-sm">
                            <div className="flex items-center space-x-4">
                              <div className="flex items-center">
                                <Heart
                                  size={16}
                                  className="mr-1 text-red-500"
                                />
                                <span>{formatNumber(post.metrics.likes)}</span>
                              </div>
                              <div className="flex items-center">
                                <MessageSquare
                                  size={16}
                                  className="mr-1 text-blue-500"
                                />
                                <span>
                                  {formatNumber(post.metrics.comments)}
                                </span>
                              </div>
                              <div className="flex items-center">
                                <Share2
                                  size={16}
                                  className="mr-1 text-green-500"
                                />
                                <span>{formatNumber(post.metrics.shares)}</span>
                              </div>
                            </div>
                            <div className="flex items-center">
                              <Clock size={14} className="mr-1" />
                              <span>{formatDate(post.timestamp)}</span>
                            </div>
                          </div>

                          {/* Engagement Rate */}
                          <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                            <div className="flex items-center">
                              <TrendingUp
                                size={16}
                                className="mr-1 text-accent"
                              />
                              <span className="text-xs text-secondary">
                                Engagement Rate
                              </span>
                            </div>
                            <div
                              className={`px-2 py-1 rounded-md text-xs font-medium ${
                                post.engagement_rate > 8
                                  ? "bg-green-100 text-green-800"
                                  : post.engagement_rate > 5
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-yellow-100 text-yellow-800"
                              }`}
                            >
                              {post.engagement_rate.toFixed(1)}%
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <div className="col-span-full flex flex-col items-center justify-center py-16 text-center">
                      <div className="bg-gray-100 p-4 rounded-full mb-4">
                        <Search size={32} className="text-gray-400" />
                      </div>
                      <h3 className="text-xl font-poppins font-semibold text-primary mb-2">
                        No posts found
                      </h3>
                      <p className="text-secondary">
                        Try adjusting your filters or search term
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PostsPage;
