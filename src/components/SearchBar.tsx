import React, { useState, useRef, useEffect } from "react";
import { Search, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Örnek arama sonuçları
type InfluencerResult = {
  type: "influencer";
  name: string;
  image: string;
  description: string;
  url: string;
};

type PostResult = {
  type: "post";
  title: string;
  author: string;
  image: string;
  url: string;
};

type CampaignResult = {
  type: "campaign";
  title: string;
  description: string;
  url: string;
};

type SearchResult = InfluencerResult | PostResult | CampaignResult;

const SAMPLE_RESULTS: SearchResult[] = [
  {
    type: "influencer",
    name: "Sophia AI",
    image: "/influencers/sophia.png",
    description: "Tech & Innovation Influencer",
    url: "#sophia",
  },
  {
    type: "influencer",
    name: "Alex Virtual",
    image: "/influencers/alex.png",
    description: "Lifestyle & Travel Influencer",
    url: "#alex",
  },
  {
    type: "post",
    title: "Web3 Teknolojileri ve Gelecek",
    author: "Sophia AI",
    image: "/posts/web3.jpg",
    url: "#web3-post",
  },
  {
    type: "post",
    title: "NFT Piyasasında Son Trendler",
    author: "Alex Virtual",
    image: "/posts/nft.jpg",
    url: "#nft-post",
  },
  {
    type: "campaign",
    title: "Stellar XLM Kampanyası",
    description: "Blockchain tabanlı finans çözümleri",
    url: "#stellar-campaign",
  },
];

interface SearchBarProps {
  placeholder?: string;
  className?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = "Ara...",
  className = "",
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [showResults, setShowResults] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value.length >= 2) {
      setIsSearching(true);
      // Gerçek uygulamada burada API çağrısı yapılır
      setTimeout(() => {
        // Basit bir filtreleme işlemi
        const results = SAMPLE_RESULTS.filter((item) => {
          if (item.type === "influencer") {
            return (
              item.name.toLowerCase().includes(value.toLowerCase()) ||
              item.description.toLowerCase().includes(value.toLowerCase())
            );
          } else if (item.type === "post") {
            return (
              item.title.toLowerCase().includes(value.toLowerCase()) ||
              item.author.toLowerCase().includes(value.toLowerCase())
            );
          } else if (item.type === "campaign") {
            return (
              item.title.toLowerCase().includes(value.toLowerCase()) ||
              item.description.toLowerCase().includes(value.toLowerCase())
            );
          }
          return false;
        });

        setSearchResults(results);
        setIsSearching(false);
        setShowResults(true);
      }, 500);
    } else {
      setShowResults(false);
    }
  };

  const clearSearch = () => {
    setSearchTerm("");
    setShowResults(false);
  };

  const handleFocus = () => {
    if (searchTerm.length >= 2) {
      setShowResults(true);
    }
  };

  // Dışarı tıklandığında sonuçları kapat
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setShowResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className={`search-container ${className}`} ref={searchContainerRef}>
      <div className="search-input-wrapper">
        <Search className="search-icon" size={18} />
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearch}
          onFocus={handleFocus}
          placeholder={placeholder}
          className="search-input"
        />
        {searchTerm && (
          <button className="search-clear-button" onClick={clearSearch}>
            <X size={16} />
          </button>
        )}
      </div>

      <AnimatePresence>
        {showResults && (
          <motion.div
            className="search-results"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {isSearching ? (
              <div className="search-loading">
                <div className="search-loading-spinner"></div>
                <span>Aranıyor...</span>
              </div>
            ) : searchResults.length > 0 ? (
              <>
                <div className="search-results-header">
                  <span>Arama Sonuçları</span>
                  <span className="search-results-count">
                    {searchResults.length} sonuç
                  </span>
                </div>
                <div className="search-results-list">
                  {searchResults.map((result, index) => (
                    <a
                      key={index}
                      href={result.url}
                      className="search-result-item"
                    >
                      {result.type === "influencer" && (
                        <div className="search-result-influencer">
                          <div className="search-result-image">
                            <img src={result.image} alt={result.name} />
                          </div>
                          <div className="search-result-content">
                            <div className="search-result-title">
                              {result.name}
                            </div>
                            <div className="search-result-description">
                              {result.description}
                            </div>
                          </div>
                          <div className="search-result-type">Influencer</div>
                        </div>
                      )}

                      {result.type === "post" && (
                        <div className="search-result-post">
                          <div className="search-result-image">
                            <img src={result.image} alt={result.title} />
                          </div>
                          <div className="search-result-content">
                            <div className="search-result-title">
                              {result.title}
                            </div>
                            <div className="search-result-description">
                              Yazar: {result.author}
                            </div>
                          </div>
                          <div className="search-result-type">Post</div>
                        </div>
                      )}

                      {result.type === "campaign" && (
                        <div className="search-result-campaign">
                          <div className="search-result-content">
                            <div className="search-result-title">
                              {result.title}
                            </div>
                            <div className="search-result-description">
                              {result.description}
                            </div>
                          </div>
                          <div className="search-result-type">Kampanya</div>
                        </div>
                      )}
                    </a>
                  ))}
                </div>
              </>
            ) : (
              <div className="search-no-results">
                <span>"{searchTerm}" için sonuç bulunamadı</span>
                <p>
                  Farklı anahtar kelimeler deneyebilir veya filtreleri
                  değiştirebilirsiniz.
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
