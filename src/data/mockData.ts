// Mock data for the application

// AI Influencer data
export interface Influencer {
  id: string;
  name: string;
  category: string;
  avatar: string;
  bio: string;
  fullBio: string;
  rarity: "legendary" | "epic" | "rare" | "common";
  followers: string;
  engagement: string;
  isOnline: boolean;
  stats: {
    satisfaction: string;
    responseTime: string;
  };
  tags: string[];
  specialties: string[];
  socialPosts: SocialPost[];
}

// Social Post data
export interface SocialPost {
  id: string;
  platform: "twitter" | "instagram" | "youtube";
  content: string;
  timestamp: string;
  likes: number;
  shares: number;
  hashtags?: string[];
  thumbnail?: string;
  isVideo?: boolean;
  influencerName?: string;
  influencerAvatar?: string;
  influencerRarity?: string;
}

// Mock AI Influencers
export const aiInfluencers: Influencer[] = [
  {
    id: "inf-001",
    name: "CryptoSage",
    category: "DeFi Specialist",
    avatar:
      "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1964&q=80",
    bio: "Leading expert in decentralized finance with deep knowledge of yield farming, liquidity pools, and tokenomics. Helping brands navigate the complex DeFi landscape.",
    fullBio:
      "CryptoSage has been at the forefront of DeFi innovation since 2019, analyzing complex protocols and translating them into actionable insights. With a background in traditional finance and blockchain technology, CryptoSage bridges the gap between conventional investment strategies and the emerging DeFi ecosystem. Regularly consulted by top crypto projects for tokenomics design and liquidity strategy.",
    rarity: "legendary",
    followers: "1.2M",
    engagement: "8.7%",
    isOnline: true,
    stats: {
      satisfaction: "98%",
      responseTime: "< 2 min",
    },
    tags: ["DeFi", "Trading", "Analysis", "Tokenomics", "Yield"],
    specialties: [
      "Yield Optimization",
      "Protocol Analysis",
      "Risk Assessment",
      "Tokenomics Design",
    ],
    socialPosts: [
      {
        id: "post-001",
        platform: "twitter",
        content:
          "Just analyzed the latest @AaveAave protocol update. The new efficiency mode is a game-changer for capital efficiency in DeFi lending. Thread below 👇",
        timestamp: "2 hours ago",
        likes: 1240,
        shares: 342,
        hashtags: ["#DeFi", "#Aave", "#YieldFarming"],
      },
      {
        id: "post-002",
        platform: "youtube",
        content:
          "Breaking down the top 5 yield farming strategies for Q3 2025. These protocols are offering sustainable yields with manageable risk profiles.",
        timestamp: "1 day ago",
        likes: 5600,
        shares: 890,
        thumbnail:
          "https://images.unsplash.com/photo-1620321023374-d1a68fbc720d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2097&q=80",
        isVideo: true,
        hashtags: ["#YieldFarming", "#DeFi", "#CryptoEarnings"],
      },
    ],
  },
  {
    id: "inf-002",
    name: "MetaDesigner",
    category: "NFT & Metaverse",
    avatar:
      "https://images.unsplash.com/photo-1535207010348-71e47296838a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1965&q=80",
    bio: "Visionary digital artist and metaverse architect helping brands create immersive experiences. Specializing in NFT strategy, virtual spaces, and digital fashion.",
    fullBio:
      "MetaDesigner blends artistic vision with technical expertise to create cutting-edge metaverse experiences. With a background in 3D design, game development, and blockchain technology, they have helped major brands transition into Web3 through strategic NFT collections and virtual world presence. Their designs have been featured in major digital art exhibitions and metaverse events.",
    rarity: "epic",
    followers: "845K",
    engagement: "7.5%",
    isOnline: true,
    stats: {
      satisfaction: "96%",
      responseTime: "< 5 min",
    },
    tags: ["NFT", "Metaverse", "Design", "Digital Art", "Virtual Reality"],
    specialties: [
      "NFT Collection Design",
      "Metaverse Architecture",
      "Brand Integration",
      "Digital Fashion",
    ],
    socialPosts: [
      {
        id: "post-003",
        platform: "instagram",
        content:
          "Just finished designing this virtual gallery space for @LuxuryBrand upcoming NFT collection launch. The immersive experience allows visitors to interact with the digital assets in a whole new way.",
        timestamp: "4 hours ago",
        likes: 3400,
        shares: 520,
        thumbnail:
          "https://images.unsplash.com/photo-1633355444132-695d5876cd00?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
        hashtags: ["#NFTArt", "#Metaverse", "#DigitalDesign"],
      },
    ],
  },
  {
    id: "inf-003",
    name: "BlockchainGuru",
    category: "Smart Contract Expert",
    avatar:
      "https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80",
    bio: "Technical blockchain expert specializing in smart contract development, security audits, and protocol design. Helping projects build secure and efficient decentralized applications.",
    fullBio:
      "BlockchainGuru has been developing smart contracts since the early days of Ethereum. With expertise across multiple blockchain platforms including Ethereum, Solana, and Stellar, they provide technical insights on contract security, gas optimization, and cross-chain interoperability. They have audited over 200 smart contracts and helped prevent millions in potential exploits.",
    rarity: "legendary",
    followers: "950K",
    engagement: "6.8%",
    isOnline: false,
    stats: {
      satisfaction: "99%",
      responseTime: "< 10 min",
    },
    tags: ["Smart Contracts", "Security", "Solidity", "Audits", "Development"],
    specialties: [
      "Contract Auditing",
      "Protocol Design",
      "Gas Optimization",
      "Cross-chain Solutions",
    ],
    socialPosts: [
      {
        id: "post-004",
        platform: "twitter",
        content:
          "Just published my analysis of the recent DeFi protocol exploit. Here is how the flash loan attack worked and how it could have been prevented with proper access controls.",
        timestamp: "1 day ago",
        likes: 2800,
        shares: 1200,
        hashtags: ["#SecurityAlert", "#SmartContracts", "#DeFiSecurity"],
      },
    ],
  },
  {
    id: "inf-004",
    name: "CommunityBuilder",
    category: "Community Management",
    avatar:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1976&q=80",
    bio: "Community engagement specialist with expertise in building vibrant Web3 communities. Focusing on authentic engagement, governance, and sustainable growth strategies.",
    fullBio:
      "CommunityBuilder has helped launch and grow over 30 successful Web3 communities, from DAOs to NFT projects. They specialize in designing engagement strategies, governance frameworks, and incentive mechanisms that foster genuine participation. Their approach combines community psychology with token economics to create self-sustaining ecosystems.",
    rarity: "rare",
    followers: "560K",
    engagement: "9.2%",
    isOnline: true,
    stats: {
      satisfaction: "97%",
      responseTime: "< 3 min",
    },
    tags: ["Community", "DAOs", "Governance", "Engagement", "Growth"],
    specialties: [
      "DAO Design",
      "Incentive Mechanisms",
      "Community Activation",
      "Governance Systems",
    ],
    socialPosts: [
      {
        id: "post-005",
        platform: "twitter",
        content:
          "The key to sustainable Web3 communities is not just incentives—it is creating genuine connection and shared purpose. Here is how we helped @ProjectName increase active participation by 300% in just 2 months.",
        timestamp: "3 hours ago",
        likes: 1850,
        shares: 620,
        hashtags: ["#CommunityBuilding", "#Web3", "#DAOs"],
      },
    ],
  },
  {
    id: "inf-005",
    name: "TokenStrategist",
    category: "Tokenomics Expert",
    avatar:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1961&q=80",
    bio: "Specialized in designing sustainable token economies and incentive mechanisms. Helping projects create value-aligned tokenomics that drive growth and retention.",
    fullBio:
      "TokenStrategist combines economic theory with practical blockchain experience to design effective token systems. They have worked with projects across DeFi, GameFi, and SocialFi to create token models that align stakeholder incentives and create sustainable value flows. Their expertise includes supply dynamics, distribution strategies, and utility design.",
    rarity: "epic",
    followers: "720K",
    engagement: "7.8%",
    isOnline: false,
    stats: {
      satisfaction: "95%",
      responseTime: "< 8 min",
    },
    tags: [
      "Tokenomics",
      "Economics",
      "Incentives",
      "Game Theory",
      "Mechanism Design",
    ],
    specialties: [
      "Token Supply Design",
      "Incentive Alignment",
      "Economic Modeling",
      "Utility Creation",
    ],
    socialPosts: [
      {
        id: "post-006",
        platform: "youtube",
        content:
          "In this deep dive, I analyze five successful token models and what makes them work. Understanding these patterns can help new projects avoid common pitfalls.",
        timestamp: "2 days ago",
        likes: 4200,
        shares: 780,
        thumbnail:
          "https://images.unsplash.com/photo-1621761191319-c6fb62004040?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1964&q=80",
        isVideo: true,
        hashtags: ["#Tokenomics", "#CryptoEconomics", "#Web3Strategy"],
      },
    ],
  },
  {
    id: "inf-006",
    name: "MarketingInnovator",
    category: "Web3 Marketing",
    avatar:
      "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80",
    bio: "Pioneering new approaches to marketing in the Web3 space. Specializing in community-driven growth, token-incentivized acquisition, and authentic brand building.",
    fullBio:
      "MarketingInnovator bridges traditional marketing expertise with Web3 native strategies. They have led successful campaigns for both established brands entering Web3 and crypto-native startups. Their approach focuses on community co-creation, on-chain incentives, and data-driven optimization while maintaining authentic brand narratives.",
    rarity: "rare",
    followers: "680K",
    engagement: "8.4%",
    isOnline: true,
    stats: {
      satisfaction: "94%",
      responseTime: "< 5 min",
    },
    tags: ["Marketing", "Growth", "Branding", "Strategy", "Analytics"],
    specialties: [
      "Go-to-Market Strategy",
      "Community Marketing",
      "Token-Incentivized Growth",
      "Brand Development",
    ],
    socialPosts: [
      {
        id: "post-007",
        platform: "instagram",
        content:
          "Traditional marketing funnels do not work in Web3. Here is the community-first framework we used to help @ProjectX grow from 0 to 100K members in just 6 weeks.",
        timestamp: "5 hours ago",
        likes: 2100,
        shares: 430,
        thumbnail:
          "https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80",
        hashtags: ["#Web3Marketing", "#GrowthStrategy", "#CommunityFirst"],
      },
    ],
  },
];
