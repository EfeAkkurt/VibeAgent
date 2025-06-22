import React, { useState } from "react";
import { useWallet } from "../context/WalletContext";

export const DepositXLM: React.FC = () => {
  const { isWalletConnected, depositXLM, getDepositAddress, error } =
    useWallet();
  const [amount, setAmount] = useState<string>("10");
  const [showQR, setShowQR] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);

  const handleDeposit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setSuccess(false);

    try {
      await depositXLM(amount);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 5000);
    } catch (error) {
      console.error("XLM yatırma hatası:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleShowAddress = () => {
    setShowQR(!showQR);
  };

  if (!isWalletConnected) {
    return <p>XLM yatırmak için önce cüzdanınızı bağlamalısınız.</p>;
  }

  return (
    <div className="deposit-container">
      <h2>XLM Yatır</h2>

      <div className="deposit-methods">
        <div className="deposit-method">
          <h3>Test XLM Al</h3>
          <p>Test ağında kullanmak için ücretsiz XLM alabilirsiniz.</p>
          <form onSubmit={handleDeposit}>
            <div className="form-group">
              <label htmlFor="amount">Miktar:</label>
              <input
                type="text"
                id="amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <button
              type="submit"
              className={`deposit-button ${isLoading ? "opacity-70" : ""}`}
              disabled={isLoading}
            >
              {isLoading ? "İşlem Sürüyor..." : "Test XLM Al"}
            </button>

            {success && (
              <div className="success-message">
                Test XLM başarıyla cüzdanınıza gönderildi!
              </div>
            )}
          </form>
        </div>

        <div className="deposit-method">
          <h3>Gerçek XLM Yatır</h3>
          <p>Cüzdan adresinize başka bir hesaptan XLM gönderebilirsiniz.</p>
          <button onClick={handleShowAddress} className="address-button">
            {showQR ? "Adresi Gizle" : "Adresimi Göster"}
          </button>

          {showQR && (
            <div className="address-container">
              <p>Cüzdan Adresiniz:</p>
              <div className="address-box">{getDepositAddress()}</div>
              <p className="warning">
                Not: Bu adrese sadece Stellar (XLM) gönderin. Başka kripto para
                birimleri gönderirseniz, paranız kaybolabilir.
              </p>
            </div>
          )}
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="info-box">
        <h3>AI Sohbet için XLM</h3>
        <p>
          AI sohbet özelliğini kullanmak için cüzdanınızda yeterli miktarda XLM
          olmalıdır. Her sohbet mesajı için küçük bir miktar XLM
          kullanılacaktır.
        </p>
      </div>
    </div>
  );
};
