import React, { useState } from "react";
import { useWallet } from "../context/WalletContext";
import { DepositXLM } from "./DepositXLM";

export const WalletMenu: React.FC = () => {
  const { isWalletConnected, publicKey, balance, username, disconnectWallet } =
    useWallet();
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"overview" | "deposit">(
    "overview"
  );

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleTabChange = (tab: "overview" | "deposit") => {
    setActiveTab(tab);
  };

  const handleDisconnect = () => {
    disconnectWallet();
    setIsOpen(false);
  };

  if (!isWalletConnected) {
    return null;
  }

  return (
    <div className="wallet-menu-container">
      <button
        className="wallet-menu-button"
        onClick={toggleMenu}
        aria-label="Cüzdan Menüsü"
      >
        <div className="wallet-icon">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M19 5H5C3.89543 5 3 5.89543 3 7V17C3 18.1046 3.89543 19 5 19H19C20.1046 19 21 18.1046 21 17V7C21 5.89543 20.1046 5 19 5Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M3 7L12 13L21 7"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <div className="wallet-balance">{balance} XLM</div>
      </button>

      {isOpen && (
        <div className="wallet-menu-dropdown">
          <div className="wallet-menu-header">
            <h3>Cüzdan</h3>
            <button className="close-button" onClick={toggleMenu}>
              ×
            </button>
          </div>

          <div className="wallet-menu-tabs">
            <button
              className={`tab-button ${
                activeTab === "overview" ? "active" : ""
              }`}
              onClick={() => handleTabChange("overview")}
            >
              Genel Bakış
            </button>
            <button
              className={`tab-button ${
                activeTab === "deposit" ? "active" : ""
              }`}
              onClick={() => handleTabChange("deposit")}
            >
              Para Yatır
            </button>
          </div>

          <div className="wallet-menu-content">
            {activeTab === "overview" ? (
              <div className="wallet-overview">
                <div className="wallet-info">
                  <div className="info-item">
                    <span className="label">Kullanıcı:</span>
                    <span className="value">
                      {username || "İsimsiz Kullanıcı"}
                    </span>
                  </div>
                  <div className="info-item">
                    <span className="label">Bakiye:</span>
                    <span className="value">{balance} XLM</span>
                  </div>
                  <div className="info-item">
                    <span className="label">Cüzdan Adresi:</span>
                    <div className="address-container">
                      <span className="value address">{publicKey}</span>
                      <button
                        className="copy-button"
                        onClick={() => {
                          navigator.clipboard.writeText(publicKey || "");
                          alert("Cüzdan adresi kopyalandı!");
                        }}
                      >
                        Kopyala
                      </button>
                    </div>
                  </div>
                </div>
                <button
                  className="disconnect-button"
                  onClick={handleDisconnect}
                >
                  Cüzdanı Çıkar
                </button>
              </div>
            ) : (
              <DepositXLM />
            )}
          </div>
        </div>
      )}
    </div>
  );
};
