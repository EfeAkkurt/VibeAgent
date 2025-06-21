import React, { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { Users } from "lucide-react";

import { AIInfluencer } from "./influencers/types";
import { aiInfluencers as mockInfluencersData } from "../data/influencers";
import LoadingSpinner from "./influencers/LoadingSpinner";
import FilterBar from "./influencers/FilterBar";
import InfluencerCard from "./influencers/InfluencerCard";
import InfluencerDetailModal from "./influencers/InfluencerDetailModal";

const InfluencersPage: React.FC = () => {
  const [influencers, setInfluencers] = useState<AIInfluencer[]>([]);
  const [selectedInfluencer, setSelectedInfluencer] =
    useState<AIInfluencer | null>(null);
  const [filterTier, setFilterTier] = useState<string>("all");
  const [filterSpecialty, setFilterSpecialty] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setInfluencers(mockInfluencersData);
      setIsLoading(false);
    }, 1000);
  }, []);

  const filteredInfluencers = influencers.filter((influencer) => {
    const matchesTier =
      filterTier === "all" ||
      influencer.rarity.toLowerCase() === filterTier.toLowerCase();
    const matchesSpecialty =
      filterSpecialty === "all" ||
      influencer.specialties.some((specialty) =>
        specialty.toLowerCase().includes(filterSpecialty.toLowerCase())
      );
    const matchesSearch =
      searchTerm === "" ||
      influencer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      influencer.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      influencer.specialties.some((specialty) =>
        specialty.toLowerCase().includes(searchTerm.toLowerCase())
      ) ||
      influencer.tags.some((tag) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      );

    return matchesTier && matchesSpecialty && matchesSearch;
  });

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20"></div>
        <div className="relative max-w-7xl mx-auto px-6 py-16 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/20 backdrop-blur-sm rounded-full border border-purple-500/30 mb-6">
            <Users className="w-5 h-5 text-purple-400" />
            <span className="text-purple-300 font-medium">AI INFLUENCERS</span>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent mb-6">
            Meet Our AI Creators
          </h1>

          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            Discover our diverse collection of AI personalities, each
            specialized in different aspects of Web3 and digital marketing.
            Choose your perfect brand ambassador.
          </p>

          <FilterBar
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            showFilters={showFilters}
            setShowFilters={setShowFilters}
            filterTier={filterTier}
            setFilterTier={setFilterTier}
            filterSpecialty={filterSpecialty}
            setFilterSpecialty={setFilterSpecialty}
          />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredInfluencers.map((influencer, index) => (
            <InfluencerCard
              key={influencer.id}
              influencer={influencer}
              index={index}
              onClick={() => setSelectedInfluencer(influencer)}
            />
          ))}
        </div>

        {filteredInfluencers.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🤖</div>
            <h3 className="text-2xl font-bold text-white mb-2">
              No Influencers Found
            </h3>
            <p className="text-gray-400">
              Try adjusting your filters or search terms
            </p>
          </div>
        )}
      </div>

      <AnimatePresence>
        {selectedInfluencer && (
          <InfluencerDetailModal
            influencer={selectedInfluencer}
            onClose={() => setSelectedInfluencer(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default InfluencersPage;
