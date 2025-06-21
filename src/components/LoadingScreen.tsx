import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Zap, Globe, Sparkles } from 'lucide-react';

interface LoadingScreenProps {
  onComplete: () => void;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ onComplete }) => {
  const [loadingStage, setLoadingStage] = useState(0);
  const [glitchActive, setGlitchActive] = useState(false);

  const loadingMessages = [
    "Initializing AI Influencers...",
    "Connecting to Web3 Network...",
    "Loading Neural Networks...",
    "Synchronizing Blockchain Data...",
    "Welcome to VibeAgency"
  ];

  useEffect(() => {
    const stageTimer = setInterval(() => {
      setLoadingStage(prev => {
        if (prev >= loadingMessages.length - 1) {
          clearInterval(stageTimer);
          setTimeout(onComplete, 1000);
          return prev;
        }
        return prev + 1;
      });
    }, 800);

    const glitchTimer = setInterval(() => {
      setGlitchActive(true);
      setTimeout(() => setGlitchActive(false), 200);
    }, 2000);

    return () => {
      clearInterval(stageTimer);
      clearInterval(glitchTimer);
    };
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
      className="fixed inset-0 z-50 bg-gradient-to-br from-primary via-foreground to-primary flex items-center justify-center overflow-hidden"
    >
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-cyber-grid bg-cyber-grid opacity-20 animate-pulse"></div>
        <motion.div 
          className="absolute inset-0 bg-gradient-to-r from-transparent via-accent/10 to-transparent"
          animate={{ x: ['-100%', '100%'] }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        />
        
        {/* Matrix Rain Effect */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-px bg-gradient-to-b from-transparent via-accent to-transparent opacity-30"
            style={{ 
              left: `${i * 5}%`,
              height: '100vh'
            }}
            animate={{ 
              y: ['-100vh', '100vh'],
              opacity: [0, 1, 0]
            }}
            transition={{ 
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: "linear"
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 text-center">
        {/* Logo */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="mb-12"
        >
          <div className="relative inline-block">
            <motion.h1 
              className={`text-7xl md:text-9xl font-poppins font-bold bg-gradient-to-r from-white via-accent to-white bg-clip-text text-transparent ${glitchActive ? 'animate-glitch' : ''}`}
              animate={{ 
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
              }}
              transition={{ duration: 4, repeat: Infinity }}
              style={{ backgroundSize: '200% 200%' }}
            >
              VibeAgency
            </motion.h1>
            
            {/* Holographic Effects */}
            <motion.div
              className="absolute -inset-4 border border-accent/30 rounded-lg"
              animate={{ 
                opacity: [0.3, 0.7, 0.3],
                scale: [1, 1.02, 1]
              }}
              transition={{ duration: 3, repeat: Infinity }}
            />
            
            <motion.div
              className="absolute top-0 right-0 w-6 h-6 bg-accent rounded-full"
              animate={{ 
                scale: [1, 1.5, 1],
                opacity: [0.7, 1, 0.7]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-xl text-secondary font-inter mt-4 tracking-wider"
          >
            AI INFLUENCER PLATFORM
          </motion.p>
        </motion.div>

        {/* Loading Progress */}
        <div className="space-y-8">
          <AnimatePresence mode="wait">
            <motion.p
              key={loadingStage}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="text-lg text-white font-inter"
            >
              {loadingMessages[loadingStage]}
            </motion.p>
          </AnimatePresence>
          
          {/* Progress Bar */}
          <div className="w-80 mx-auto">
            <div className="h-1 bg-white/20 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-accent to-white rounded-full"
                initial={{ width: '0%' }}
                animate={{ width: `${((loadingStage + 1) / loadingMessages.length) * 100}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
            </div>
            <div className="flex justify-between mt-2 text-xs text-secondary">
              <span>0%</span>
              <span>{Math.round(((loadingStage + 1) / loadingMessages.length) * 100)}%</span>
              <span>100%</span>
            </div>
          </div>

          {/* Loading Dots */}
          <div className="flex justify-center space-x-2">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-3 h-3 bg-accent rounded-full"
                animate={{ 
                  scale: [1, 1.5, 1],
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{ 
                  duration: 1.5, 
                  repeat: Infinity,
                  delay: i * 0.2
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Floating Icons */}
      {[
        { icon: Brain, position: { top: '20%', left: '10%' } },
        { icon: Globe, position: { top: '30%', right: '15%' } },
        { icon: Zap, position: { bottom: '25%', left: '20%' } },
        { icon: Sparkles, position: { bottom: '35%', right: '25%' } },
      ].map((item, index) => (
        <motion.div
          key={index}
          className="absolute text-4xl opacity-20"
          style={item.position}
          animate={{ 
            y: [0, -30, 0],
            rotate: [0, 15, -15, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{ 
            duration: 6, 
            repeat: Infinity,
            delay: index * 0.5,
            ease: "easeInOut"
          }}
        >
          <item.icon size={50} className="text-accent" />
        </motion.div>
      ))}

      {/* Scanline Effect */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.3, 0] }}
        transition={{ duration: 3, repeat: Infinity }}
      >
        <motion.div
          className="w-full h-px bg-gradient-to-r from-transparent via-accent to-transparent"
          animate={{ y: ['0vh', '100vh'] }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        />
      </motion.div>
    </motion.div>
  );
};

export default LoadingScreen;