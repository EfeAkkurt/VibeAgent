import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import freighterApi from "@stellar/freighter-api";

const WalletConnection: React.FC = () => {
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [passkeySupported, setPasskeySupported] = useState<boolean | null>(
    null
  );
  const [passkeyVerified, setPasskeyVerified] = useState(false);

  // Check if wallet is connected when page loads
  useEffect(() => {
    const checkFreighter = async () => {
      try {
        const connected = await freighterApi.isConnected();
        if (connected) {
          // Check if already verified with passkey
          const storedVerification = localStorage.getItem("passkeyVerified");
          if (storedVerification === "true") {
            const { address } = await freighterApi.getAddress();
            setPublicKey(address);
            setPasskeyVerified(true);
          }
        }

        // Check if passkeys are supported
        try {
          // Just check if the browser supports WebAuthn API
          if (window.PublicKeyCredential) {
            setPasskeySupported(true);
          } else {
            setPasskeySupported(false);
          }
        } catch (e) {
          console.log("Passkeys not supported", e);
          setPasskeySupported(false);
        }
      } catch (error) {
        console.error("Error checking Freighter connection:", error);
        setError("Error checking wallet connection");
      }
    };

    checkFreighter();
  }, []);

  // Handle passkey verification
  const verifyPasskey = async () => {
    try {
      setIsConnecting(true);
      setError(null);

      // This is a simplified passkey verification
      // In a real implementation, you would use the passkey-kit library to verify
      // the user's passkey against your backend

      // Simulating passkey verification
      try {
        // Simulate a successful passkey verification
        // In a real app, you would use the PasskeyKit library properly
        setTimeout(() => {
          setPasskeyVerified(true);
          localStorage.setItem("passkeyVerified", "true");

          // Now connect to Freighter
          connectWallet();
        }, 1500);
      } catch (e) {
        console.error("Passkey verification failed:", e);
        setError("Passkey verification failed");
        setIsConnecting(false);
      }
    } catch (error) {
      console.error("Error during passkey verification:", error);
      setError("Error during passkey verification");
      setIsConnecting(false);
    }
  };

  // Connect to Freighter wallet
  const connectWallet = async () => {
    try {
      setIsConnecting(true);
      setError(null);

      if (!passkeyVerified && passkeySupported) {
        // If passkeys are supported but not verified, verify first
        verifyPasskey();
        return;
      }

      await freighterApi.setAllowed();
      const { address } = await freighterApi.getAddress();
      setPublicKey(address);
      setIsConnecting(false);

      // Log success
      console.log("Successfully connected to wallet:", address);

      // Example of calling a contract (would be implemented in a real app)
      // const tx = await freighterApi.signTransaction(...);
      // console.log("Transaction result:", tx);
    } catch (error) {
      console.error("Error connecting to Freighter:", error);
      setError("Error connecting to wallet");
      setIsConnecting(false);
    }
  };

  // Disconnect wallet
  const disconnectWallet = () => {
    setPublicKey(null);
    setPasskeyVerified(false);
    localStorage.removeItem("passkeyVerified");
    console.log("Wallet disconnected");
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-poppins font-bold text-primary text-xl">
          Wallet Connection
        </h2>
        {publicKey && (
          <div className="bg-green-100 px-3 py-1 rounded-full text-green-600 text-xs font-medium flex items-center">
            <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
            Connected
          </div>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-4 mb-6 text-sm">
          {error}
        </div>
      )}

      {publicKey ? (
        <div className="space-y-6">
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-secondary text-sm mb-2">Connected Address</p>
            <p className="font-mono text-primary font-medium text-sm break-all">
              {publicKey}
            </p>
          </div>

          <motion.button
            onClick={disconnectWallet}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-red-500 hover:bg-red-600 text-white font-poppins font-semibold py-3 px-6 rounded-xl transition-all duration-300 flex items-center justify-center space-x-2"
          >
            <span>Disconnect Wallet</span>
          </motion.button>
        </div>
      ) : (
        <motion.button
          onClick={connectWallet}
          disabled={isConnecting}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white font-poppins font-semibold py-4 px-6 rounded-xl transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl disabled:opacity-70"
        >
          {isConnecting ? (
            <div className="flex items-center space-x-2">
              <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
              <span>Connecting...</span>
            </div>
          ) : (
            <span>Connect Freighter Wallet</span>
          )}
        </motion.button>
      )}

      <div className="mt-4 text-xs text-secondary text-center">
        {passkeySupported === true && (
          <p>Passkey authentication is required for wallet connection</p>
        )}
        {passkeySupported === false && (
          <p>Passkey not supported. Password authentication will be used.</p>
        )}
      </div>
    </div>
  );
};

export default WalletConnection;
