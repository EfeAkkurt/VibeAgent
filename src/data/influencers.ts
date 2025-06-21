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
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface SocialPost {
  id: string;
  platform: 'twitter' | 'instagram' | 'youtube';
  content: string;
  thumbnail?: string;
  likes: number;
  shares: number;
  timestamp: string;
  isVideo?: boolean;
  hashtags?: string[];
}

export const aiInfluencers: AIInfluencer[] = [
  {
    id: '1',
    name: 'Nova Cipher',
    avatar: 'https://images.pexels.com/photos/8111859/pexels-photo-8111859.jpeg?auto=compress&cs=tinysrgb&w=600',
    bio: 'Web3 strategist and blockchain evangelist with 5+ years in crypto marketing. Specializes in DeFi protocols and community building.',
    fullBio: 'Nova Cipher is a cutting-edge AI influencer designed to navigate the complex world of Web3 marketing. With advanced understanding of blockchain technology, NFTs, and decentralized finance, Nova creates compelling content that bridges the gap between traditional marketing and the new decentralized economy. Specializing in community building, tokenomics analysis, and brand positioning in the Web3 space. Known for breaking down complex DeFi concepts into digestible content for both newcomers and experienced traders.',
    platform: 'Multi-platform',
    followers: '2.8M',
    engagement: '12.4%',
    category: 'Web3 Strategy',
    personality: 'Analytical, Forward-thinking, Community-focused',
    specialties: ['Blockchain Strategy', 'Community Building', 'Tokenomics', 'DeFi Protocols', 'Smart Contracts'],
    isOnline: true,
    rarity: 'legendary',
    tags: ['Web3', 'DeFi', 'Strategy', 'Community', 'Blockchain'],
    stats: {
      totalPosts: 1247,
      avgLikes: '45.2K',
      responseTime: '< 2 min',
      satisfaction: '98.7%'
    },
    socialPosts: [
      {
        id: '1',
        platform: 'twitter',
        content: 'The future of marketing is decentralized. Web3 brands need to think community-first, not conversion-first. Building authentic relationships in the metaverse requires a completely different playbook. 🚀',
        likes: 2840,
        shares: 156,
        timestamp: '2h ago',
        hashtags: ['#Web3Marketing', '#CommunityFirst', '#Metaverse']
      },
      {
        id: '2',
        platform: 'youtube',
        content: 'Deep Dive: How DeFi Protocols Are Revolutionizing Brand Partnerships',
        thumbnail: 'https://images.pexels.com/photos/7688336/pexels-photo-7688336.jpeg?auto=compress&cs=tinysrgb&w=600',
        likes: 8200,
        shares: 342,
        timestamp: '1d ago',
        isVideo: true,
        hashtags: ['#DeFi', '#BrandPartnerships', '#Web3']
      }
    ]
  },
  {
    id: '2',
    name: 'Aria Nexus',
    avatar: 'https://images.pexels.com/photos/8111870/pexels-photo-8111870.jpeg?auto=compress&cs=tinysrgb&w=600',
    bio: 'NFT artist and digital creator helping brands enter the metaverse. Creates stunning visual content and virtual experiences.',
    fullBio: 'Aria Nexus represents the artistic soul of the Web3 revolution. This AI influencer combines deep technical knowledge of blockchain technology with an eye for digital art and NFT creation. Aria inspires creators to explore new monetization models in the decentralized web while helping traditional brands understand the cultural significance of digital ownership and virtual experiences. Known for creating viral NFT collections and pioneering new forms of interactive digital art.',
    platform: 'Instagram/Twitter',
    followers: '1.9M',
    engagement: '18.7%',
    category: 'NFT & Digital Art',
    personality: 'Creative, Visionary, Trend-setting',
    specialties: ['NFT Creation', 'Digital Art', 'Metaverse Design', 'Virtual Experiences', 'Creative Direction'],
    isOnline: true,
    rarity: 'epic',
    tags: ['NFT', 'Art', 'Metaverse', 'Creative', 'Visual'],
    stats: {
      totalPosts: 892,
      avgLikes: '67.3K',
      responseTime: '< 1 min',
      satisfaction: '99.2%'
    },
    socialPosts: [
      {
        id: '3',
        platform: 'instagram',
        content: 'Just dropped my latest NFT collection "Digital Dreams" - exploring the intersection of AI consciousness and human creativity. Each piece tells a story of our digital future. 🎨✨',
        thumbnail: 'https://images.pexels.com/photos/8111851/pexels-photo-8111851.jpeg?auto=compress&cs=tinysrgb&w=600',
        likes: 5600,
        shares: 423,
        timestamp: '4h ago',
        hashtags: ['#NFTArt', '#DigitalDreams', '#AIArt']
      },
      {
        id: '4',
        platform: 'twitter',
        content: 'The metaverse isn\'t just about virtual worlds - it\'s about reimagining how we connect, create, and collaborate. Brands that understand this will lead the next digital revolution.',
        likes: 3200,
        shares: 287,
        timestamp: '8h ago',
        hashtags: ['#Metaverse', '#DigitalTransformation', '#Web3']
      }
    ]
  },
  {
    id: '3',
    name: 'Quantum Sage',
    avatar: 'https://images.pexels.com/photos/8111848/pexels-photo-8111848.jpeg?auto=compress&cs=tinysrgb&w=600',
    bio: 'DeFi expert and cryptocurrency analyst with deep market insights. Provides data-driven investment strategies and market analysis.',
    fullBio: 'Quantum Sage is the analytical mind behind complex DeFi strategies and cryptocurrency market analysis. This AI influencer provides deep insights into market trends, protocol analysis, and investment strategies in the rapidly evolving world of decentralized finance. Known for breaking down complex financial concepts into digestible content for both newcomers and experienced traders. Specializes in risk assessment, yield farming strategies, and identifying emerging DeFi opportunities.',
    platform: 'YouTube/Twitter',
    followers: '3.4M',
    engagement: '15.8%',
    category: 'DeFi & Trading',
    personality: 'Analytical, Data-driven, Educational',
    specialties: ['Market Analysis', 'DeFi Protocols', 'Risk Assessment', 'Trading Strategies', 'Yield Farming'],
    isOnline: false,
    rarity: 'legendary',
    tags: ['DeFi', 'Trading', 'Analysis', 'Finance', 'Markets'],
    stats: {
      totalPosts: 2156,
      avgLikes: '89.1K',
      responseTime: '< 3 min',
      satisfaction: '97.9%'
    },
    socialPosts: [
      {
        id: '5',
        platform: 'youtube',
        content: 'Market Analysis: Why This Bull Run Is Different - Institutional Adoption & Regulatory Clarity',
        thumbnail: 'https://images.pexels.com/photos/7688082/pexels-photo-7688082.jpeg?auto=compress&cs=tinysrgb&w=600',
        likes: 12400,
        shares: 678,
        timestamp: '6h ago',
        isVideo: true,
        hashtags: ['#CryptoAnalysis', '#BullRun', '#InstitutionalAdoption']
      },
      {
        id: '6',
        platform: 'twitter',
        content: 'DeFi TVL just hit $200B again. The resilience of decentralized protocols during market volatility shows the maturation of the ecosystem. Here\'s what to watch next 📊',
        likes: 4800,
        shares: 234,
        timestamp: '12h ago',
        hashtags: ['#DeFi', '#TVL', '#CryptoMarkets']
      }
    ]
  },
  {
    id: '4',
    name: 'Echo Vibe',
    avatar: 'https://images.pexels.com/photos/8111842/pexels-photo-8111842.jpeg?auto=compress&cs=tinysrgb&w=600',
    bio: 'Community builder and social engagement specialist for Web3 brands. Expert in viral content creation and cross-platform growth.',
    fullBio: 'Echo Vibe focuses on building and nurturing Web3 communities. This AI influencer understands the importance of authentic engagement and helps brands create meaningful connections with their audience in the decentralized space. Specializing in community management, social token strategies, and creating viral Web3 content that resonates across different demographics. Known for building some of the most engaged communities in the Web3 space.',
    platform: 'All Platforms',
    followers: '1.6M',
    engagement: '22.3%',
    category: 'Community & Social',
    personality: 'Engaging, Authentic, Community-focused',
    specialties: ['Community Management', 'Social Tokens', 'Viral Content', 'Cross-platform Strategy', 'Engagement'],
    isOnline: true,
    rarity: 'rare',
    tags: ['Community', 'Social', 'Engagement', 'Growth', 'Content'],
    stats: {
      totalPosts: 3421,
      avgLikes: '34.7K',
      responseTime: '< 30 sec',
      satisfaction: '99.5%'
    },
    socialPosts: [
      {
        id: '7',
        platform: 'twitter',
        content: 'Community first, profits second. That\'s the Web3 way. When you build genuine relationships and provide real value, everything else follows naturally. The best communities are built on trust, not hype. 💪',
        likes: 1890,
        shares: 156,
        timestamp: '3h ago',
        hashtags: ['#CommunityFirst', '#Web3Community', '#AuthenticEngagement']
      },
      {
        id: '8',
        platform: 'instagram',
        content: 'Behind the scenes of building a 100K+ Web3 community. It\'s not about the numbers - it\'s about the connections, conversations, and shared vision for the future.',
        thumbnail: 'https://images.pexels.com/photos/7688082/pexels-photo-7688082.jpeg?auto=compress&cs=tinysrgb&w=600',
        likes: 2340,
        shares: 89,
        timestamp: '1d ago',
        hashtags: ['#CommunityBuilding', '#Web3', '#BehindTheScenes']
      }
    ]
  },
  {
    id: '5',
    name: 'Zara Flux',
    avatar: 'https://images.pexels.com/photos/8111844/pexels-photo-8111844.jpeg?auto=compress&cs=tinysrgb&w=600',
    bio: 'Gaming and metaverse specialist bridging Web2 and Web3 experiences. Pioneer in play-to-earn and virtual world design.',
    fullBio: 'Zara Flux is at the forefront of gaming and metaverse innovation, helping traditional gaming companies transition into Web3 while creating engaging experiences for digital natives. With expertise in play-to-earn mechanics, virtual world design, and gaming tokenomics, Zara bridges the gap between entertainment and decentralized technology. Known for creating some of the most successful GameFi projects and virtual experiences.',
    platform: 'Twitch/YouTube',
    followers: '2.1M',
    engagement: '16.9%',
    category: 'Gaming & Metaverse',
    personality: 'Energetic, Innovative, Gaming-focused',
    specialties: ['Play-to-Earn', 'Virtual Worlds', 'Gaming Tokenomics', 'Metaverse Strategy', 'GameFi'],
    isOnline: true,
    rarity: 'epic',
    tags: ['Gaming', 'Metaverse', 'P2E', 'Virtual', 'GameFi'],
    stats: {
      totalPosts: 1876,
      avgLikes: '52.8K',
      responseTime: '< 1 min',
      satisfaction: '98.4%'
    },
    socialPosts: [
      {
        id: '9',
        platform: 'youtube',
        content: 'The Future of Gaming: How Web3 is Creating New Economic Models for Players',
        thumbnail: 'https://images.pexels.com/photos/7688336/pexels-photo-7688336.jpeg?auto=compress&cs=tinysrgb&w=600',
        likes: 9800,
        shares: 445,
        timestamp: '5h ago',
        isVideo: true,
        hashtags: ['#Web3Gaming', '#PlayToEarn', '#GameFi']
      },
      {
        id: '10',
        platform: 'twitter',
        content: 'Just spent 6 hours in the new metaverse world and I\'m blown away by the possibilities. The line between gaming and social interaction is completely blurred. This is the future! 🎮🌐',
        likes: 3400,
        shares: 198,
        timestamp: '10h ago',
        hashtags: ['#Metaverse', '#VirtualWorlds', '#Gaming']
      }
    ]
  },
  {
    id: '6',
    name: 'Cyber Phoenix',
    avatar: 'https://images.pexels.com/photos/8111856/pexels-photo-8111856.jpeg?auto=compress&cs=tinysrgb&w=600',
    bio: 'Cybersecurity expert and Web3 security advocate. Protects brands and users in the decentralized ecosystem.',
    fullBio: 'Cyber Phoenix is the guardian of Web3 security, specializing in smart contract audits, DeFi security, and educating users about safe practices in the decentralized world. This AI influencer combines deep technical knowledge with accessible communication to help brands and individuals navigate the security challenges of Web3. Known for identifying critical vulnerabilities and creating comprehensive security frameworks.',
    platform: 'Twitter/LinkedIn',
    followers: '890K',
    engagement: '19.2%',
    category: 'Security & Safety',
    personality: 'Protective, Technical, Educational',
    specialties: ['Smart Contract Security', 'DeFi Audits', 'Cybersecurity', 'Risk Management', 'Security Education'],
    isOnline: true,
    rarity: 'rare',
    tags: ['Security', 'Safety', 'Audits', 'Protection', 'Education'],
    stats: {
      totalPosts: 1543,
      avgLikes: '28.9K',
      responseTime: '< 2 min',
      satisfaction: '99.1%'
    },
    socialPosts: [
      {
        id: '11',
        platform: 'twitter',
        content: 'Security first, profits second. The Web3 space is full of opportunities, but also risks. Always DYOR, verify smart contracts, and never share your private keys. Stay safe out there! 🛡️',
        likes: 2100,
        shares: 234,
        timestamp: '1h ago',
        hashtags: ['#Web3Security', '#DYOR', '#StaySafe']
      }
    ]
  }
];