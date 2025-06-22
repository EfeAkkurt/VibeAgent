import React, { useState, useRef } from "react";
import { useWallet } from "../context/WalletContext";
import { DepositXLM } from "./DepositXLM";
import { Wallet, Copy, ExternalLink, RefreshCw, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const WalletButton: React.FC = () => {
  const { isWalletConnected, balance, publicKey, username, connectWallet } =
    useWallet();
  const [showDeposit, setShowDeposit] = useState(false);
  const [activeTab, setActiveTab] = useState<"overview" | "deposit">(
    "overview"
  );
  const [copied, setCopied] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);

  if (!isWalletConnected) {
    return (
      <button
        onClick={() => connectWallet()}
        className="flex items-center gap-2 bg-gradient-to-r from-primary to-accent text-white py-3 px-4 rounded-xl font-medium shadow-md hover:shadow-lg transition-all duration-300"
      >
        <Wallet size={18} />
        <span>Cüzdan Bağla</span>
      </button>
    );
  }

  const handleCopyAddress = () => {
    if (publicKey) {
      navigator.clipboard.writeText(publicKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const formatAddress = (address: string | null) => {
    if (!address) return "";
    return `${address.substring(0, 6)}...${address.substring(
      address.length - 4
    )}`;
  };

  return (
    <div className="wallet-button-container">
      <button
        className="wallet-button"
        onClick={() => setShowDeposit(!showDeposit)}
        title="Cüzdan İşlemleri"
      >
        <span className="wallet-icon">
          <Wallet size={16} />
        </span>
        <span className="wallet-balance">{balance} XLM</span>
      </button>

      <AnimatePresence>
        {showDeposit && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/30 z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowDeposit(false)}
            />
            <motion.div
              ref={modalRef}
              className="fixed bg-white rounded-3xl shadow-2xl w-full max-w-md z-50 overflow-hidden cursor-move"
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{
                opacity: 1,
                scale: 1,
                x: position.x,
                y: position.y,
              }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              drag
              dragConstraints={{
                left: -300,
                right: 300,
                top: -200,
                bottom: 200,
              }}
              dragElastic={0.1}
              onDragStart={() => setIsDragging(true)}
              onDragEnd={() => {
                setIsDragging(false);
                if (modalRef.current) {
                  const { x, y } = modalRef.current.getBoundingClientRect();
                  setPosition({
                    x:
                      position.x +
                      x -
                      window.innerWidth / 2 +
                      modalRef.current.offsetWidth / 2,
                    y:
                      position.y +
                      y -
                      window.innerHeight / 2 +
                      modalRef.current.offsetHeight / 2,
                  });
                }
              }}
              onClick={(e) => {
                if (!isDragging) e.stopPropagation();
              }}
              style={{
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
              }}
            >
              <div className="wallet-dropdown-header">
                <h3>Cüzdan İşlemleri</h3>
                <button
                  className="close-button"
                  onClick={() => setShowDeposit(false)}
                >
                  <X size={20} />
                </button>
              </div>

              <div className="wallet-tabs">
                <button
                  className={`wallet-tab ${
                    activeTab === "overview" ? "active" : ""
                  }`}
                  onClick={() => setActiveTab("overview")}
                >
                  Genel Bakış
                </button>
                <button
                  className={`wallet-tab ${
                    activeTab === "deposit" ? "active" : ""
                  }`}
                  onClick={() => setActiveTab("deposit")}
                >
                  Para Yatır
                </button>
              </div>

              <div className="wallet-content">
                {activeTab === "overview" ? (
                  <div className="wallet-overview">
                    <div className="wallet-card">
                      <div className="wallet-card-header">
                        <span className="wallet-label">Kullanıcı</span>
                        <span className="wallet-username">
                          {username || "İsimsiz Kullanıcı"}
                        </span>
                      </div>

                      <div className="wallet-balance-display">
                        <span className="balance-amount">{balance}</span>
                        <span className="balance-currency">XLM</span>
                      </div>

                      <div className="wallet-address-container">
                        <div className="wallet-address-header">
                          <span className="wallet-label">Cüzdan Adresi</span>
                          <button
                            className="refresh-button"
                            title="Bakiyeyi Yenile"
                            onClick={(e) => {
                              e.stopPropagation();
                              // Bakiye yenileme fonksiyonu burada çağrılabilir
                            }}
                          >
                            <RefreshCw size={14} />
                          </button>
                        </div>
                        <div className="wallet-address">
                          <span>{formatAddress(publicKey)}</span>
                          <button
                            className="copy-button"
                            onClick={handleCopyAddress}
                            title="Adresi Kopyala"
                          >
                            <Copy size={14} />
                          </button>
                          <a
                            href={`https://stellar.expert/explorer/testnet/account/${publicKey}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="explorer-link"
                            title="Explorer'da Görüntüle"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <ExternalLink size={14} />
                          </a>
                        </div>
                        {copied && (
                          <span className="copied-message">
                            Adres kopyalandı!
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="wallet-actions">
                      <button
                        className="wallet-action-button deposit"
                        onClick={() => setActiveTab("deposit")}
                      >
                        Para Yatır
                      </button>
                    </div>
                  </div>
                ) : (
                  <DepositXLM />
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
