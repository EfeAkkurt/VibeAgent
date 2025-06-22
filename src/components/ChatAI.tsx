import React, { useState } from "react";
import { useWallet } from "../context/WalletContext";
import { DepositXLM } from "./DepositXLM";
import { makePayment } from "../utils/payments";

// Bir mesaj için gereken minimum XLM miktarı
const MESSAGE_COST = 0.1;

export const ChatAI: React.FC = () => {
  const { isWalletConnected, balance, publicKey } = useWallet();
  const [message, setMessage] = useState<string>("");
  const [chatHistory, setChatHistory] = useState<
    Array<{ role: string; content: string }>
  >([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  // Bakiye kontrolü
  const hasEnoughBalance = () => {
    if (!balance) return false;
    return parseFloat(balance) >= MESSAGE_COST;
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!message.trim()) return;
    if (!isWalletConnected || !publicKey) {
      alert("Mesaj göndermek için cüzdanınızı bağlamalısınız.");
      return;
    }

    if (!hasEnoughBalance()) {
      alert(
        `Mesaj göndermek için en az ${MESSAGE_COST} XLM gereklidir. Lütfen hesabınıza XLM yükleyin.`
      );
      return;
    }

    // Kullanıcı mesajını ekle
    const userMessage = { role: "user", content: message };
    setChatHistory((prev) => [...prev, userMessage]);

    // Mesajı temizle ve yükleme durumunu başlat
    setMessage("");
    setIsLoading(true);
    setPaymentError(null);

    try {
      // XLM ödemesi yap
      const paymentResult = await makePayment(
        MESSAGE_COST,
        publicKey,
        `AI Chat: ${message.substring(0, 20)}${
          message.length > 20 ? "..." : ""
        }`
      );

      if (!paymentResult.success) {
        throw new Error(paymentResult.error || "Ödeme işlemi başarısız oldu.");
      }

      console.log(`[Chat] Ödeme başarılı, TX ID: ${paymentResult.txId}`);

      // Burada gerçek AI API çağrısı yapılacak
      // Şimdilik basit bir yanıt simülasyonu
      setTimeout(() => {
        const aiResponse = {
          role: "assistant",
          content:
            "Merhaba! Ben bir AI asistanım. Size nasıl yardımcı olabilirim?",
        };
        setChatHistory((prev) => [...prev, aiResponse]);
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error("İşlem hatası:", error);
      setPaymentError(
        error instanceof Error ? error.message : "Bilinmeyen bir hata oluştu."
      );
      setIsLoading(false);
    }
  };

  if (!isWalletConnected) {
    return (
      <div className="chat-container">
        <h2>AI Sohbet</h2>
        <p>Sohbet başlatmak için cüzdanınızı bağlamalısınız.</p>
      </div>
    );
  }

  if (!hasEnoughBalance()) {
    return (
      <div className="chat-container">
        <h2>AI Sohbet</h2>
        <p>
          Sohbet başlatmak için yeterli XLM bakiyeniz yok. En az {MESSAGE_COST}{" "}
          XLM gereklidir.
        </p>
        <DepositXLM />
      </div>
    );
  }

  return (
    <div className="chat-container">
      <h2>AI Sohbet</h2>

      <div className="chat-history">
        {chatHistory.length === 0 ? (
          <p className="empty-chat">
            Sohbet başlatmak için bir mesaj gönderin.
          </p>
        ) : (
          chatHistory.map((msg, index) => (
            <div key={index} className={`chat-message ${msg.role}`}>
              <div className="message-content">{msg.content}</div>
            </div>
          ))
        )}
        {isLoading && (
          <div className="chat-message assistant loading">
            <div className="loading-indicator">...</div>
          </div>
        )}
      </div>

      <form onSubmit={handleSendMessage} className="chat-input">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Mesajınızı yazın..."
          disabled={isLoading}
        />
        <button type="submit" disabled={isLoading || !message.trim()}>
          Gönder
        </button>
      </form>

      {paymentError && (
        <div className="error-message">
          <p>Ödeme hatası: {paymentError}</p>
          <p>Lütfen tekrar deneyin veya daha sonra tekrar deneyin.</p>
        </div>
      )}

      <div className="balance-info">
        <p>Bakiye: {balance} XLM</p>
        <p>Her mesaj {MESSAGE_COST} XLM maliyetindedir.</p>
      </div>
    </div>
  );
};
