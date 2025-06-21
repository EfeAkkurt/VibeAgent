import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
} from "react";
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
  retryConnection: () => Promise<void>;
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
  const [lastConnectionAttempt, setLastConnectionAttempt] =
    useState<string>("");

  // Check initial wallet status
  const checkInitialWalletStatus = useCallback(async () => {
    try {
      // Check Freighter installation
      const isInstalled = await FreighterService.isFreighterInstalled();
      if (!isInstalled) {
        console.log("Freighter wallet is not installed");
        return;
      }

      // Check if previously connected and session valid
      const storedConnection = localStorage.getItem("walletConnected");
      const sessionValid = BiometricService.isSessionValid();

      if (storedConnection === "true" && sessionValid) {
        try {
          const publicKey = await FreighterService.getPublicKey();
          if (publicKey) {
            setPublicKey(publicKey);
            setIsWalletConnected(true);
            setBiometricVerified(true);

            const method = BiometricService.getPreferredAuthMethod();
            setAuthMethod(method);
          }
        } catch (error) {
          console.error("Error reconnecting to wallet:", error);
          // Clear invalid connection
          localStorage.removeItem("walletConnected");
          BiometricService.clearAuthData();
        }
      }

      // Check biometric support
      const biometricSupport = await BiometricService.isBiometricAvailable();
      setBiometricSupported(biometricSupport);
    } catch (error) {
      console.error("Error checking initial wallet status:", error);
    }
  }, []);

  useEffect(() => {
    checkInitialWalletStatus();
  }, [checkInitialWalletStatus]);

  const connectWallet = useCallback(
    async (username = "user") => {
      if (isConnecting) return;

      setIsConnecting(true);
      setError(null);
      setLastConnectionAttempt(username);

      try {
        console.log("[WalletContext] Starting wallet connection flow.");
        const isFreighterInstalled =
          await FreighterService.isFreighterInstalled();
        if (!isFreighterInstalled) {
          console.log("[WalletContext] Freighter not installed.");
          setError({
            type: "not_installed",
            message: "Freighter wallet is not installed.",
          });
          setIsConnecting(false);
          return;
        }

        let authSuccess = false;
        let authCancelled = false;
        let usedAuthMethod: string | null = null;

        console.log(
          `[WalletContext] Biometric support status: ${biometricSupported}`
        );
        if (biometricSupported) {
          console.log("[WalletContext] Attempting biometric authentication...");
          const bioAuthResult = await BiometricService.authenticate(username);

          if (bioAuthResult.success) {
            console.log("[WalletContext] Biometric authentication successful.");
            authSuccess = true;
            usedAuthMethod = "biometric";
          } else {
            console.error(
              "[WalletContext] Biometric authentication failed:",
              bioAuthResult.error
            );
            if (bioAuthResult.cancelled) {
              console.log("[WalletContext] Biometric auth cancelled by user.");
              authCancelled = true;
            } else {
              // Fallback to password if biometrics fail for a reason other than cancellation
              console.log(
                "[WalletContext] Falling back to password authentication..."
              );
              const passwordAuthResult =
                await BiometricService.authenticateWithPassword(username);
              if (passwordAuthResult.success) {
                console.log(
                  "[WalletContext] Password authentication successful."
                );
                authSuccess = true;
                usedAuthMethod = "password";
              } else if (passwordAuthResult.cancelled) {
                console.log("[WalletContext] Password auth cancelled by user.");
                authCancelled = true;
              }
            }
          }
        } else {
          console.log(
            "[WalletContext] Biometrics not supported, proceeding with default connection."
          );
          // If biometrics are not supported, we can treat it as a success
          // to proceed to the freighter connection logic.
          authSuccess = true;
          usedAuthMethod = "freighter_default";
        }

        if (authCancelled) {
          console.log("[WalletContext] Auth cancelled. Aborting connection.");
          setError({
            type: "cancelled",
            message: "Authentication was cancelled by the user.",
          });
          setIsConnecting(false);
          return;
        }

        if (!authSuccess) {
          console.log("[WalletContext] Auth failed. Aborting connection.");
          setError({
            type: "authentication_failed",
            message: "Could not authenticate user.",
          });
          setIsConnecting(false);
          return;
        }

        console.log(
          "[WalletContext] Proceeding with Freighter wallet connection..."
        );
        const freighterResult = await FreighterService.connect(username);

        if (freighterResult.address) {
          setPublicKey(freighterResult.address);
          setIsWalletConnected(true);
          setAuthMethod(
            usedAuthMethod ?? BiometricService.getPreferredAuthMethod()
          );
          setBiometricVerified(usedAuthMethod === "biometric");
          localStorage.setItem("walletConnected", "true");
          console.log(
            "[WalletContext] Wallet connected successfully:",
            freighterResult.address
          );
        } else if (freighterResult.error) {
          setError(freighterResult.error);
          console.error(
            "[WalletContext] Freighter connection failed:",
            freighterResult.error
          );
        }
      } catch (err) {
        console.error(
          "[WalletContext] Unexpected error during wallet connection:",
          err
        );
        setError({
          type: "unknown",
          message: "An unexpected error occurred.",
          details: err instanceof Error ? err.message : String(err),
        });
      } finally {
        setIsConnecting(false);
      }
    },
    [isConnecting, biometricSupported]
  );

  // Retry connection with same parameters
  const retryConnection = useCallback(async () => {
    if (lastConnectionAttempt) {
      await connectWallet(lastConnectionAttempt);
    } else {
      await connectWallet();
    }
  }, [connectWallet, lastConnectionAttempt]);

  // Disconnect wallet
  const disconnectWallet = useCallback(async () => {
    try {
      await FreighterService.disconnect();
      setPublicKey(null);
      setIsWalletConnected(false);
      setBiometricVerified(false);
      setAuthMethod(null);
      setError(null);
      setLastConnectionAttempt("");
      localStorage.removeItem("walletConnected");
      console.log("Wallet disconnected successfully");
    } catch (error) {
      console.error("Error disconnecting wallet:", error);
      setError({
        type: "unknown",
        message: "Error disconnecting wallet",
        details: error instanceof Error ? error.message : String(error),
      });
    }
  }, []);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

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
    retryConnection,
  };

  return (
    <WalletContext.Provider value={value}>{children}</WalletContext.Provider>
  );
};
