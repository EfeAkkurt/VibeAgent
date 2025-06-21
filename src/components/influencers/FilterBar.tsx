import React from "react";
import { Filter, Search, ChevronDown } from "lucide-react";

interface FilterBarProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  showFilters: boolean;
  setShowFilters: (show: boolean) => void;
  filterTier: string;
  setFilterTier: (tier: string) => void;
  filterSpecialty: string;
  setFilterSpecialty: (specialty: string) => void;
}

const FilterBar: React.FC<FilterBarProps> = ({
  searchTerm,
  setSearchTerm,
  showFilters,
  setShowFilters,
  filterTier,
  setFilterTier,
  filterSpecialty,
  setFilterSpecialty,
}) => {
  return (
    <>
      <div className="flex flex-col md:flex-row gap-4 justify-center items-center max-w-4xl mx-auto">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search influencers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white hover:bg-white/20 transition-all"
        >
          <Filter className="w-5 h-5" />
          Filters
          <ChevronDown
            className={`w-5 h-5 transition-transform ${
              showFilters ? "rotate-180" : ""
            }`}
          />
        </button>
      </div>

      {showFilters && (
        <div className="mt-6 p-6 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Tier
              </label>
              <select
                value={filterTier}
                onChange={(e) => setFilterTier(e.target.value)}
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
              >
                <option value="all">All Tiers</option>
                <option value="LEGENDARY">Legendary</option>
                <option value="EPIC">Epic</option>
                <option value="RARE">Rare</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Specialty
              </label>
              <select
                value={filterSpecialty}
                onChange={(e) => setFilterSpecialty(e.target.value)}
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
              >
                <option value="all">All Specialties</option>
                <option value="defi">DeFi</option>
                <option value="nft">NFT</option>
                <option value="smart">Smart Contracts</option>
                <option value="metaverse">Metaverse</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FilterBar;
