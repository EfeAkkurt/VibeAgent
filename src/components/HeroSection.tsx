import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Zap, Globe, Brain, MessageCircle, Star } from 'lucide-react';
import { aiInfluencers } from '../data/influencers';

interface HeroSectionProps {
  onInfluencerClick: (influencerId: string) => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onInfluencerClick }) => {
  const [currentInfluencer, setCurrentInfluencer] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentInfluencer((prev) => (prev + 1) % aiInfluencers.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return 'from-yellow-400 to-orange-500';
      case 'epic': return 'from-purple-400 to-pink-500';
      case 'rare': return 'from-blue-400 to-cyan-500';
      default: return 'from-gray-400 to-gray-600';
    }
  };

  const getRarityGlow = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return 'shadow-yellow-500/50';
      case 'epic': return 'shadow-purple-500/50';
      case 'rare': return 'shadow-blue-500/50';
      default: return 'shadow-gray-500/50';
    }
  };

  return (
    <section className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center relative overflow-hidden pt-24">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-cyber-grid bg-cyber-grid opacity-5"></div>
        <motion.div 
          className="absolute inset-0 bg-gradient-to-r from-transparent via-accent/5 to-transparent"
          animate={{ x: ['-100%', '100%'] }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        />
      </div>

      <div className="container mx-auto px-6 py-20 relative z-10">
        {/* Main Content */}
        <motion.div 
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="text-center mb-20"
        >
          <motion.div
            className="inline-block mb-6"
            animate={{ 
              y: [0, -10, 0],
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            <h1 className="text-6xl md:text-8xl font-poppins font-bold mb-4">
              <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-gradient-shift" style={{ backgroundSize: '200% 200%' }}>
                VibeAgency
              </span>
            </h1>
            <div className="flex items-center justify-center space-x-2 text-secondary">
              <Brain size={20} />
              <span className="font-inter text-lg tracking-wider">AI INFLUENCER PLATFORM</span>
              <Sparkles size={20} />
            </div>
          </motion.div>
          
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-xl text-secondary font-inter max-w-4xl mx-auto leading-relaxed mb-8"
          >
            Where AI meets influence in the Web3 ecosystem. Connect, engage, and amplify your brand with our next-generation AI-powered influencers.
          </motion.p>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="flex flex-wrap justify-center gap-4 mb-12"
          >
            {['🤖 AI-Powered', '🌐 Web3 Native', '✨ Real-time Chat', '🚀 High Engagement'].map((feature, index) => (
              <motion.div
                key={feature}
                className="px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-gray-200/50 text-sm font-inter text-foreground shadow-sm"
                whileHover={{ scale: 1.05, y: -2 }}
                transition={{ delay: index * 0.1 }}
              >
                {feature}
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Influencer Showcase */}
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-12 gap-8 items-center">
            {/* Left Influencers */}
            <div className="lg:col-span-3 space-y-6">
              {aiInfluencers.slice(0, 2).map((influencer, index) => (
                <motion.div
                  key={influencer.id}
                  initial={{ x: -100, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.8 + index * 0.2, duration: 0.8 }}
                  className={`transition-all duration-1000 transform ${
                    currentInfluencer === index ? 'scale-105 opacity-100' : 'scale-95 opacity-70'
                  }`}
                >
                  <motion.div 
                    className="relative group cursor-pointer"
                    onClick={() => onInfluencerClick(influencer.id)}
                    whileHover={{ scale: 1.05, y: -10 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    <div className={`absolute inset-0 bg-gradient-to-t ${getRarityColor(influencer.rarity)} rounded-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-300`}></div>
                    <div className={`relative overflow-hidden rounded-3xl bg-white shadow-xl group-hover:shadow-2xl ${getRarityGlow(influencer.rarity)} transition-all duration-300`}>
                      <div className="relative">
                        <img 
                          src={influencer.avatar} 
                          alt={influencer.name}
                          className="w-full h-72 object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                        
                        {/* Rarity Badge */}
                        <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold text-white bg-gradient-to-r ${getRarityColor(influencer.rarity)} shadow-lg`}>
                          {influencer.rarity.toUpperCase()}
                        </div>

                        {/* Online Status */}
                        <div className="absolute top-4 right-4">
                          <div className={`w-3 h-3 rounded-full ${influencer.isOnline ? 'bg-green-400' : 'bg-gray-400'} shadow-lg`}></div>
                        </div>

                        <div className="absolute bottom-4 left-4 right-4 text-white">
                          <h3 className="font-poppins font-bold text-xl mb-1">{influencer.name}</h3>
                          <p className="font-inter text-sm opacity-90 mb-2">{influencer.category}</p>
                          <div className="flex items-center justify-between text-xs">
                            <span>{influencer.followers} followers</span>
                            <span>{influencer.engagement} engagement</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              ))}
            </div>

            {/* Center Content */}
            <div className="lg:col-span-6 text-center">
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 1, duration: 0.8, type: "spring", stiffness: 200 }}
                className="bg-white/90 backdrop-blur-xl rounded-3xl p-12 border border-gray-200/50 shadow-2xl relative overflow-hidden"
              >
                {/* Background Pattern */}
                <div className="absolute inset-0 bg-cyber-grid bg-cyber-grid opacity-5"></div>
                
                <div className="relative z-10">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="w-20 h-20 bg-gradient-to-br from-primary to-accent rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-lg"
                  >
                    <Sparkles className="text-white" size={40} />
                  </motion.div>
                  
                  <h2 className="text-3xl font-poppins font-bold text-primary mb-6">
                    Meet Your Next AI Influencer
                  </h2>
                  
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentInfluencer}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.5 }}
                      className="mb-8"
                    >
                      <h3 className="text-xl font-poppins font-semibold text-accent mb-2">
                        {aiInfluencers[currentInfluencer].name}
                      </h3>
                      <p className="text-secondary font-inter leading-relaxed">
                        {aiInfluencers[currentInfluencer].bio}
                      </p>
                    </motion.div>
                  </AnimatePresence>
                  
                  <div className="flex justify-center space-x-2 mb-8">
                    {aiInfluencers.map((_, index) => (
                      <motion.div
                        key={index}
                        className={`h-2 rounded-full transition-all duration-300 ${
                          currentInfluencer === index ? 'bg-accent w-8' : 'bg-gray-300 w-2'
                        }`}
                        whileHover={{ scale: 1.2 }}
                      />
                    ))}
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex-1 bg-gradient-to-r from-primary to-accent text-white font-poppins font-semibold py-4 px-8 rounded-2xl transition-all duration-300 flex items-center justify-center space-x-3 shadow-lg hover:shadow-xl"
                      onClick={() => onInfluencerClick(aiInfluencers[currentInfluencer].id)}
                    >
                      <MessageCircle size={20} />
                      <span>Start Chatting</span>
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex-1 bg-white hover:bg-gray-50 text-primary font-poppins font-semibold py-4 px-8 rounded-2xl border-2 border-primary/20 hover:border-primary/40 transition-all duration-300 flex items-center justify-center space-x-3"
                    >
                      <Star size={20} />
                      <span>View All</span>
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Right Influencers */}
            <div className="lg:col-span-3 space-y-6">
              {aiInfluencers.slice(2, 4).map((influencer, index) => (
                <motion.div
                  key={influencer.id}
                  initial={{ x: 100, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 1 + index * 0.2, duration: 0.8 }}
                  className={`transition-all duration-1000 transform ${
                    currentInfluencer === (index + 2) ? 'scale-105 opacity-100' : 'scale-95 opacity-70'
                  }`}
                >
                  <motion.div 
                    className="relative group cursor-pointer"
                    onClick={() => onInfluencerClick(influencer.id)}
                    whileHover={{ scale: 1.05, y: -10 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    <div className={`absolute inset-0 bg-gradient-to-t ${getRarityColor(influencer.rarity)} rounded-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-300`}></div>
                    <div className={`relative overflow-hidden rounded-3xl bg-white shadow-xl group-hover:shadow-2xl ${getRarityGlow(influencer.rarity)} transition-all duration-300`}>
                      <div className="relative">
                        <img 
                          src={influencer.avatar} 
                          alt={influencer.name}
                          className="w-full h-72 object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                        
                        {/* Rarity Badge */}
                        <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold text-white bg-gradient-to-r ${getRarityColor(influencer.rarity)} shadow-lg`}>
                          {influencer.rarity.toUpperCase()}
                        </div>

                        {/* Online Status */}
                        <div className="absolute top-4 right-4">
                          <div className={`w-3 h-3 rounded-full ${influencer.isOnline ? 'bg-green-400' : 'bg-gray-400'} shadow-lg`}></div>
                        </div>

                        <div className="absolute bottom-4 left-4 right-4 text-white">
                          <h3 className="font-poppins font-bold text-xl mb-1">{influencer.name}</h3>
                          <p className="font-inter text-sm opacity-90 mb-2">{influencer.category}</p>
                          <div className="flex items-center justify-between text-xs">
                            <span>{influencer.followers} followers</span>
                            <span>{influencer.engagement} engagement</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Floating Elements */}
      {[
        { icon: Brain, position: { top: '15%', left: '5%' } },
        { icon: Globe, position: { top: '25%', right: '10%' } },
        { icon: Zap, position: { bottom: '20%', left: '15%' } },
        { icon: Sparkles, position: { bottom: '30%', right: '20%' } },
      ].map((item, index) => (
        <motion.div
          key={index}
          className="absolute opacity-10"
          style={item.position}
          animate={{ 
            y: [0, -30, 0],
            rotate: [0, 15, -15, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{ 
            duration: 8, 
            repeat: Infinity,
            delay: index * 0.5,
            ease: "easeInOut"
          }}
        >
          <item.icon size={80} className="text-accent" />
        </motion.div>
      ))}
    </section>
  );
};

export default HeroSection;