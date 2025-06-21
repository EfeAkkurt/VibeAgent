import freighterApi from "@stellar/freighter-api";
import { BiometricService } from "./PasskeyService";

// Define interface for window to include freighterApi
declare global {
  interface Window {
    freighterApi?: typeof freighterApi;
  }
}

export interface ConnectionError {
  type:
    | "biometric"
    | "password"
    | "wallet"
    | "network"
    | "unknown"
    | "cancelled";
  message: string;
  details?: string;
  cancelled?: boolean;
}

export interface WalletConnectionState {
  publicKey: string | null;
  isConnected: boolean;
  isConnecting: boolean;
  error: ConnectionError | null;
  biometricSupported: boolean | null;
  biometricVerified: boolean;
}

export class FreighterService {
  private static isConnecting = false;

  // Check if Freighter is installed
  static async isFreighterInstalled(): Promise<boolean> {
    try {
      const result = await freighterApi.isConnected();
      return !!result;
    } catch {
      return false;
    }
  }

  // Check if wallet is connected
  static async isConnected(): Promise<boolean> {
    try {
      const result = await freighterApi.isConnected();
      return !!result;
    } catch {
      return false;
    }
  }

  // Get public key if connected
  static async getPublicKey(): Promise<string | null> {
    try {
      const response = await freighterApi.getAddress();
      return response.address || null;
    } catch {
      return null;
    }
  }

  // Main connection method with proper authentication flow
  static async connect(username = "user"): Promise<{
    address: string;
    error?: ConnectionError;
  }> {
    // Prevent multiple simultaneous connections
    if (this.isConnecting) {
      return {
        address: "",
        error: {
          type: "unknown",
          message: "Connection already in progress",
        },
      };
    }

    this.isConnecting = true;

    try {
      // Step 1: Handle Authentication
      const authResult = await this.handleAuthentication(username);

      if (!authResult.success) {
        this.isConnecting = false;
        return {
          address: "",
          error: {
            type: authResult.cancelled ? "cancelled" : "biometric",
            message: authResult.error || "Authentication failed",
            cancelled: authResult.cancelled,
          },
        };
      }

      // Step 2: Connect to Freighter Wallet
      const walletResult = await this.connectToFreighter();

      this.isConnecting = false;
      return walletResult;
    } catch (error) {
      this.isConnecting = false;
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

  // Handle authentication flow with proper fallback
  private static async handleAuthentication(username: string): Promise<{
    success: boolean;
    error?: string;
    cancelled?: boolean;
  }> {
    const preferredAuthMethod = BiometricService.getPreferredAuthMethod();

    // If user has previous preference
    if (preferredAuthMethod) {
      if (preferredAuthMethod === "biometric") {
        // Try biometric first
        const biometricResult = await BiometricService.authenticate(username);
        if (biometricResult.success) {
          return { success: true };
        }

        if (biometricResult.cancelled) {
          return {
            success: false,
            error: biometricResult.error,
            cancelled: true,
          };
        }

        // Fallback to password
        const passwordResult = await BiometricService.authenticateWithPassword(
          username
        );
        return passwordResult;
      } else {
        // Use password directly
        return await BiometricService.authenticateWithPassword(username);
      }
    }

    // First time - try biometric if available
    const biometricAvailable = await BiometricService.isBiometricAvailable();

    if (biometricAvailable) {
      const biometricResult = await BiometricService.authenticate(username);
      if (biometricResult.success) {
        return { success: true };
      }

      if (biometricResult.cancelled) {
        return {
          success: false,
          error: biometricResult.error,
          cancelled: true,
        };
      }

      // Fallback to password
      const passwordResult = await BiometricService.authenticateWithPassword(
        username
      );
      return passwordResult;
    } else {
      // No biometric, use password
      return await BiometricService.authenticateWithPassword(username);
    }
  }

  // Connect to Freighter wallet - FIXED API USAGE
  private static async connectToFreighter(): Promise<{
    address: string;
    error?: ConnectionError;
  }> {
    try {
      // Check if Freighter is installed
      const isInstalled = await this.isFreighterInstalled();
      if (!isInstalled) {
        return {
          address: "",
          error: {
            type: "wallet",
            message:
              "Freighter wallet is not installed. Please install the Freighter browser extension.",
          },
        };
      }

      // Request access to the wallet - CORRECT API
      await freighterApi.requestAccess();

      // Get the public key - CORRECT API
      const response = await freighterApi.getAddress();

      if (!response.address) {
        return {
          address: "",
          error: {
            type: "wallet",
            message: "Failed to get wallet address",
          },
        };
      }

      return { address: response.address };
    } catch (error: unknown) {
      console.error("Error connecting to Freighter:", error);

      const err = error as Error;
      if (err.message?.includes("User declined access")) {
        return {
          address: "",
          error: {
            type: "cancelled",
            message: "User declined wallet access",
            cancelled: true,
          },
        };
      }

      return {
        address: "",
        error: {
          type: "wallet",
          message: "Failed to connect to Freighter wallet",
          details: err.message || String(error),
        },
      };
    }
  }

  // Disconnect wallet
  static async disconnect(): Promise<void> {
    try {
      BiometricService.clearAuthData();
      localStorage.removeItem("walletConnected");
      this.isConnecting = false;
      console.log("Wallet disconnected");
    } catch (error) {
      console.error("Error disconnecting wallet:", error);
      throw error;
    }
  }

  // Sign transaction
  static async signTransaction(xdr: string): Promise<string> {
    try {
      const result = await freighterApi.signTransaction(xdr, {
        networkPassphrase: "Test SDF Network ; September 2015", // or your network
      });
      return result.signedTxXdr;
    } catch (error) {
      console.error("Error signing transaction:", error);
      throw error;
    }
  }
}
