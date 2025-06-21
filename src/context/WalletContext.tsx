import React, { createContext, useState, useContext, useEffect } from "react";
import {
  FreighterService,
  ConnectionError,
} from "../services/FreighterService";
import { BiometricService } from "../services/PasskeyService";

interface WalletContextType {
  isWalletConnected: boolean;
  publicKey: string | null;
  isConnecting: boolean;
  error: ConnectionError | null;
  biometricSupported: boolean | null;
  biometricVerified: boolean;
  authMethod: string | null;
  connectWallet: (username?: string) => Promise<void>;
  disconnectWallet: () => Promise<void>;
  clearError: () => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error("useWallet must be used within a WalletProvider");
  }
  return context;
};

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [error, setError] = useState<ConnectionError | null>(null);
  const [biometricSupported, setBiometricSupported] = useState<boolean | null>(
    null
  );
  const [biometricVerified, setBiometricVerified] = useState(false);
  const [authMethod, setAuthMethod] = useState<string | null>(null);

  // Check wallet connection on mount
  useEffect(() => {
    const checkWalletConnection = async () => {
      try {
        // Check if Freighter is installed
        const isInstalled = await FreighterService.isFreighterInstalled();
        if (!isInstalled) {
          console.log("Freighter wallet is not installed");
          return;
        }

        const connected = await FreighterService.isConnected();
        if (connected) {
          // Check if already verified
          const storedVerification = localStorage.getItem("walletConnected");
          if (storedVerification === "true") {
            try {
              const result = await FreighterService.connect();
              if (result.error) {
                console.error("Error reconnecting to wallet:", result.error);
                return;
              }

              setPublicKey(result.address);
              setIsWalletConnected(true);
              setBiometricVerified(true);

              // Set authentication method
              const method = BiometricService.getPreferredAuthMethod();
              setAuthMethod(method);
            } catch (error) {
              console.error("Error reconnecting to wallet:", error);
            }
          }
        }

        // Check if biometrics are supported
        const biometricSupport = await FreighterService.isBiometricSupported();
        setBiometricSupported(biometricSupport);
      } catch (error) {
        console.error("Error checking wallet connection:", error);
      }
    };

    checkWalletConnection();
  }, []);

  // Connect to wallet
  const connectWallet = async (username?: string) => {
    try {
      setIsConnecting(true);
      setError(null);

      const result = await FreighterService.connect(username);

      if (result.error) {
        setError(result.error);
        setIsConnecting(false);
        return;
      }

      setPublicKey(result.address);
      setIsWalletConnected(true);
      localStorage.setItem("walletConnected", "true");

      // Update authentication method
      const method = BiometricService.getPreferredAuthMethod();
      setAuthMethod(method);
      setBiometricVerified(method === "biometric");

      // Log success
      console.log("Successfully connected to wallet:", result.address);
    } catch (error) {
      console.error("Error connecting to wallet:", error);
      setError({
        type: "unknown",
        message:
          "Error connecting to wallet. Please make sure Freighter is installed and unlocked.",
        details: error instanceof Error ? error.message : String(error),
      });
    } finally {
      setIsConnecting(false);
    }
  };

  // Disconnect wallet
  const disconnectWallet = async () => {
    try {
      await FreighterService.disconnect();
      setPublicKey(null);
      setIsWalletConnected(false);
      setBiometricVerified(false);
      setAuthMethod(null);
      localStorage.removeItem("walletConnected");
      console.log("Wallet disconnected");
    } catch (error) {
      console.error("Error disconnecting wallet:", error);
      setError({
        type: "unknown",
        message: "Error disconnecting wallet",
        details: error instanceof Error ? error.message : String(error),
      });
    }
  };

  // Clear error
  const clearError = () => {
    setError(null);
  };

  const value = {
    isWalletConnected,
    publicKey,
    isConnecting,
    error,
    biometricSupported,
    biometricVerified,
    authMethod,
    connectWallet,
    disconnectWallet,
    clearError,
  };

  return (
    <WalletContext.Provider value={value}>{children}</WalletContext.Provider>
  );
};
