import freighterApi from "@stellar/freighter-api";
import { BiometricService } from "./PasskeyService";

// Define interface for window to include freighterApi
declare global {
  interface Window {
    freighterApi?: typeof freighterApi;
  }
}

export interface WalletConnectionState {
  publicKey: string | null;
  isConnected: boolean;
  isConnecting: boolean;
  error: string | null;
  biometricSupported: boolean | null;
  biometricVerified: boolean;
}

export interface ConnectionError {
  type: "biometric" | "password" | "wallet" | "network" | "unknown";
  message: string;
  details?: string;
}

export class FreighterService {
  // Check if Freighter is installed
  static async isFreighterInstalled(): Promise<boolean> {
    return !!window.freighterApi;
  }

  // Check if wallet is connected
  static async isConnected(): Promise<boolean> {
    try {
      const result = await freighterApi.isConnected();
      return !!result;
    } catch (error) {
      console.error("Error checking Freighter connection:", error);
      return false;
    }
  }

  // Check if biometric authentication is supported
  static async isBiometricSupported(): Promise<boolean> {
    return await BiometricService.isBiometricAvailable();
  }

  // Connect to Freighter wallet with authentication
  static async connect(
    username?: string
  ): Promise<{ address: string; error?: ConnectionError }> {
    try {
      // Get the preferred authentication method
      const preferredAuthMethod = BiometricService.getPreferredAuthMethod();

      // If this is a subsequent connection attempt, use the preferred method
      if (preferredAuthMethod) {
        if (preferredAuthMethod === "biometric") {
          // Try biometric authentication first
          const biometricSuccess = await BiometricService.authenticate(
            username || "user"
          );
          if (!biometricSuccess) {
            // Fallback to password authentication
            const passwordSuccess =
              await BiometricService.authenticateWithPassword(
                username || "user"
              );
            if (!passwordSuccess) {
              return {
                address: "",
                error: {
                  type: "biometric",
                  message: "Authentication failed",
                  details: "Both biometric and password authentication failed",
                },
              };
            }
          }
        } else if (preferredAuthMethod === "password") {
          // Use password authentication directly
          const passwordSuccess =
            await BiometricService.authenticateWithPassword(username || "user");
          if (!passwordSuccess) {
            return {
              address: "",
              error: {
                type: "password",
                message: "Password authentication failed",
              },
            };
          }
        }
      } else {
        // First time connection, try biometric first
        const biometricAvailable =
          await BiometricService.isBiometricAvailable();

        if (biometricAvailable) {
          // Try biometric authentication
          const biometricSuccess = await BiometricService.authenticate(
            username || "user"
          );
          if (!biometricSuccess) {
            // Fallback to password authentication
            const passwordSuccess =
              await BiometricService.authenticateWithPassword(
                username || "user"
              );
            if (!passwordSuccess) {
              return {
                address: "",
                error: {
                  type: "biometric",
                  message: "Authentication failed",
                  details: "Both biometric and password authentication failed",
                },
              };
            }
          }
        } else {
          // Biometric not available, use password authentication
          const passwordSuccess =
            await BiometricService.authenticateWithPassword(username || "user");
          if (!passwordSuccess) {
            return {
              address: "",
              error: {
                type: "password",
                message: "Password authentication failed",
              },
            };
          }
        }
      }

      // Now connect to Freighter
      try {
        await freighterApi.setAllowed();
        const { address } = await freighterApi.getAddress();
        return { address };
      } catch (error) {
        console.error("Error connecting to Freighter:", error);
        return {
          address: "",
          error: {
            type: "wallet",
            message: "Failed to connect to Freighter wallet",
            details: error instanceof Error ? error.message : String(error),
          },
        };
      }
    } catch (error) {
      console.error("Error during wallet connection:", error);
      return {
        address: "",
        error: {
          type: "unknown",
          message: "An unexpected error occurred",
          details: error instanceof Error ? error.message : String(error),
        },
      };
    }
  }

  // Disconnect wallet (clear local state)
  static async disconnect(): Promise<void> {
    try {
      // Freighter API doesn't have a disconnect method
      // We'll just clear local state
      BiometricService.clearAuthData();
      localStorage.removeItem("walletConnected");
      console.log("Wallet disconnected");
    } catch (error) {
      console.error("Error disconnecting wallet:", error);
      throw error;
    }
  }

  // Sign transaction
  static async signTransaction(xdr: string): Promise<string> {
    try {
      const result = await freighterApi.signTransaction(xdr);
      return result.signedTxXdr;
    } catch (error) {
      console.error("Error signing transaction:", error);
      throw error;
    }
  }
}
