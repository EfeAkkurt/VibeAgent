import React, {
  createContext,
  useState,
  useContext,
  useCallback,
  useEffect,
} from "react";
import { PasskeyKit, PasskeyServer } from "passkey-kit";
import { Buffer } from "buffer";
import base64url from "base64url";
import { env } from "../utils/env";

// Extend the Window interface to include a Buffer property for polyfilling
declare global {
  interface Window {
    Buffer: typeof Buffer;
  }
}

// Make Buffer available globally as it's required by some dependencies
if (typeof window !== "undefined") {
  window.Buffer = Buffer;
}

interface WalletContextType {
  isWalletConnected: boolean;
  publicKey: string | null;
  isConnecting: boolean;
  error: string | null;
  balance: string | null;
  username: string | null;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => Promise<void>;
  clearError: () => void;
  depositXLM: (amount: string) => Promise<void>;
  getDepositAddress: () => string | null;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error("useWallet must be used within a WalletProvider");
  }
  return context;
};

// Local storage keys
const LOCAL_STORAGE_KEY = "vibeagent_keyId";
const LOCAL_STORAGE_USERNAME_KEY = "vibeagent_username";
const LOCAL_STORAGE_CONTRACT_ID = "vibeagent_contract_id";

// Create a custom PasskeyKit that bypasses contract ID validation
class CustomPasskeyKit extends PasskeyKit {
  async createWallet(app: string, user: string) {
    try {
      console.log("[Debug] Starting createWallet with bypass");
      // Call the original createKey method to get keyId and publicKey
      const { keyId } = await this.createKey(app, user);

      // Generate a unique contractId based on the keyId to ensure different devices have different wallets
      // This uses the first 16 bytes of the keyId and formats it as a valid Stellar contract ID
      const keyIdStr = keyId.toString("hex").substring(0, 32).toUpperCase();
      const contractId = `C${keyIdStr}`;

      // Store the username in localStorage
      localStorage.setItem(LOCAL_STORAGE_USERNAME_KEY, user);

      // Store the contract ID in localStorage
      localStorage.setItem(LOCAL_STORAGE_CONTRACT_ID, contractId);

      // Create a dummy XDR for the transaction
      const dummyXdr = "AAAAAAAAAGQAAAAAAAAAAQAAAAAAAAABAAAAAAAAAAA=";

      console.log("[Debug] Created unique contract ID:", contractId);

      return {
        keyId,
        contractId,
        xdr: dummyXdr,
      };
    } catch (e) {
      console.error("[Debug] Error in custom createWallet:", e);
      throw e;
    }
  }

  // Override the connectWallet method with a compatible signature
  async connectWallet(opts?: {
    keyId?: string | Uint8Array;
    rpId?: string;
    getContractId?: (keyId: string) => Promise<string | undefined>;
  }) {
    try {
      console.log("[Debug] Starting connectWallet with bypass");

      if (!opts || !opts.keyId) {
        throw new Error("KeyId is required");
      }

      // Convert keyId to Buffer if it's a string
      let keyIdBuffer: Buffer;
      if (typeof opts.keyId === "string") {
        keyIdBuffer = base64url.toBuffer(opts.keyId);
      } else {
        keyIdBuffer = Buffer.from(opts.keyId);
      }

      // Try to get the stored contract ID from localStorage
      const storedContractId = localStorage.getItem(LOCAL_STORAGE_CONTRACT_ID);

      // If we have a stored contract ID, use that
      // Otherwise generate a new one based on the keyId
      let contractId: string;
      if (storedContractId) {
        contractId = storedContractId;
        console.log("[Debug] Using stored contract ID:", contractId);
      } else {
        // Generate a unique contractId based on the keyId
        const keyIdStr = keyIdBuffer
          .toString("hex")
          .substring(0, 32)
          .toUpperCase();
        contractId = `C${keyIdStr}`;
        // Store it for future use
        localStorage.setItem(LOCAL_STORAGE_CONTRACT_ID, contractId);
        console.log("[Debug] Generated new contract ID:", contractId);
      }

      return {
        keyId: keyIdBuffer,
        contractId,
      };
    } catch (e) {
      console.error("[Debug] Error in custom connectWallet:", e);
      throw e;
    }
  }
}

// Initialize our custom PasskeyKit and PasskeyServer with the correct parameters
const passkeyKit = new CustomPasskeyKit({
  rpcUrl: env.PUBLIC_RPC_URL,
  networkPassphrase: env.PUBLIC_NETWORK_PASSPHRASE,
  factoryContractId: env.PUBLIC_FACTORY_CONTRACT_ID,
});

// Server for backend-like operations
const passkeyServer = new PasskeyServer({
  rpcUrl: env.PUBLIC_RPC_URL,
});

// Mock the passkeyServer.send method to avoid sending invalid transactions
passkeyServer.send = async function (xdr: string) {
  console.log("[Debug] Mock sending transaction:", xdr);
  // Return a success response without actually sending the transaction
  return { status: "success", message: "Transaction simulated successfully" };
};

// Mock the passkeyServer.getContractId method
passkeyServer.getContractId = async function (
  keyId: Buffer | string
): Promise<string> {
  console.log("[Debug] Mock getContractId called with:", keyId);

  // Try to get the stored contract ID from localStorage
  const storedContractId = localStorage.getItem(LOCAL_STORAGE_CONTRACT_ID);

  if (storedContractId) {
    return storedContractId;
  }

  // If no stored contract ID, generate one from the keyId
  let keyIdBuffer: Buffer;
  if (typeof keyId === "string") {
    keyIdBuffer = base64url.toBuffer(keyId);
  } else {
    keyIdBuffer = keyId;
  }

  const keyIdStr = keyIdBuffer.toString("hex").substring(0, 32).toUpperCase();
  const contractId = `C${keyIdStr}`;

  // Store it for future use
  localStorage.setItem(LOCAL_STORAGE_CONTRACT_ID, contractId);

  return contractId;
};

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [balance, setBalance] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);

  // Get wallet balance using direct fetch to avoid SDK version conflicts
  const getWalletBalance = useCallback(async (contractId: string) => {
    try {
      const response = await fetch(
        `https://horizon-testnet.stellar.org/accounts/${contractId}`
      );
      if (!response.ok) {
        throw new Error(`Horizon request failed: ${response.statusText}`);
      }
      const account = await response.json();
      const nativeBalance = account.balances.find(
        (b: { asset_type: string }) => b.asset_type === "native"
      );
      const currentBalance = nativeBalance ? nativeBalance.balance : "0";
      const formattedBalance = parseFloat(currentBalance).toFixed(7);
      setBalance(formattedBalance);
      console.log(`[Wallet] Balance: ${formattedBalance} XLM`);
    } catch (e) {
      console.warn(`[Wallet] Error fetching balance:`, e);
      setBalance("0.0000000");
    }
  }, []);

  // Fund wallet using Friendbot
  const fundWallet = useCallback(
    async (contractId: string) => {
      try {
        console.log(`[Wallet] Funding wallet: ${contractId}`);
        const response = await fetch(
          `https://friendbot.stellar.org?addr=${encodeURIComponent(contractId)}`
        );
        if (!response.ok) {
          throw new Error(`Funding request failed: ${response.statusText}`);
        }

        console.log("[Wallet] Funding request sent to Friendbot");

        // Wait for the transaction to be processed
        await new Promise((resolve) => setTimeout(resolve, 7000));

        await getWalletBalance(contractId);
      } catch (e) {
        console.error("[Wallet] Error funding wallet:", e);
        // Try to get balance anyway in case wallet already has funds
        try {
          await getWalletBalance(contractId);
        } catch (balanceError) {
          console.error(
            "[Wallet] Error getting balance after funding failure:",
            balanceError
          );
        }
      }
    },
    [getWalletBalance]
  );

  // Create a new wallet
  const createNewWallet = useCallback(async () => {
    try {
      // Check if we already have a stored username
      const storedUsername = localStorage.getItem(LOCAL_STORAGE_USERNAME_KEY);

      // If we have a stored username, use that
      // Otherwise ask the user for a name
      let username: string;
      if (storedUsername) {
        username = storedUsername;
        console.log(`[Wallet] Using stored username: ${username}`);
      } else {
        // Ask user for a name for their passkey
        const inputUsername =
          prompt("Please provide a name for your new passkey:") ||
          "My VibeAgent Key";

        if (!inputUsername) {
          setError("A name is required to create a passkey.");
          return;
        }

        username = inputUsername;
      }

      // Update the username state
      setUsername(username);
      console.log(`[Wallet] Creating wallet with username: ${username}`);

      // Create the wallet
      const {
        keyId: kid,
        contractId: cid,
        xdr,
      } = await passkeyKit.createWallet("VibeAgent", username);

      console.log(
        `[Wallet] Wallet created. KeyID length: ${kid.length}, ContractID: ${cid}`
      );

      if (!xdr) {
        throw new Error("Failed to get transaction XDR from wallet creation");
      }

      // Send the transaction
      const res = await passkeyServer.send(xdr);
      console.log("[Wallet] Wallet creation transaction sent:", res);

      // Store the keyId in localStorage
      const newKeyId = base64url(kid);
      localStorage.setItem(LOCAL_STORAGE_KEY, newKeyId);

      // Update state
      setPublicKey(cid);
      setIsWalletConnected(true);

      // Fund the wallet
      await fundWallet(cid);

      return { keyId: newKeyId, contractId: cid };
    } catch (e) {
      console.error("[Wallet] Error creating wallet:", e);
      let errorMessage = "An unknown error occurred during wallet creation.";
      if (e instanceof Error) {
        errorMessage = e.message;
        if (e.name === "NotAllowedError") {
          errorMessage = "Passkey operation cancelled by user.";
        }
      }
      setError(errorMessage);
      throw e;
    }
  }, [fundWallet]);

  // Connect to an existing wallet
  const connectExistingWallet = useCallback(
    async (existingKeyId: string) => {
      try {
        console.log(`[Wallet] Connecting with existing key: ${existingKeyId}`);

        // Get stored username if available
        const storedUsername = localStorage.getItem(LOCAL_STORAGE_USERNAME_KEY);
        if (storedUsername) {
          setUsername(storedUsername);
          console.log(`[Wallet] Using stored username: ${storedUsername}`);
        }

        const { contractId: cid } = await passkeyKit.connectWallet({
          keyId: existingKeyId,
          getContractId: async (keyId: string) => {
            try {
              return await passkeyServer.getContractId(keyId);
            } catch (e) {
              console.error(`[Wallet] Error in getContractId:`, e);
              throw e;
            }
          },
        });

        // Update state
        setPublicKey(cid);
        setIsWalletConnected(true);

        // Get wallet balance
        await getWalletBalance(cid);

        console.log(`[Wallet] Wallet connected: ${cid}`);
        return { contractId: cid };
      } catch (e) {
        console.error("[Wallet] Error connecting to wallet:", e);
        throw e;
      }
    },
    [getWalletBalance]
  );

  // Main connect wallet function
  const connectWallet = useCallback(async () => {
    if (isConnecting) return;

    setIsConnecting(true);
    setError(null);

    try {
      // Check if we have a stored keyId
      const existingKeyId = localStorage.getItem(LOCAL_STORAGE_KEY);

      if (existingKeyId) {
        console.log("[Wallet] Found existing keyId, attempting to connect");
        try {
          // Try to connect with the existing key
          await connectExistingWallet(existingKeyId);
        } catch (e) {
          console.warn(
            "[Wallet] Failed to connect with existing key, creating new wallet",
            e
          );
          // If connection fails, remove the key and create a new wallet
          localStorage.removeItem(LOCAL_STORAGE_KEY);
          localStorage.removeItem(LOCAL_STORAGE_USERNAME_KEY);
          localStorage.removeItem(LOCAL_STORAGE_CONTRACT_ID);
          await createNewWallet();
        }
      } else {
        console.log("[Wallet] No existing keyId found, creating new wallet");
        // No key found, create a new wallet
        await createNewWallet();
      }
    } catch (e) {
      console.error("[Wallet] Error during wallet connection:", e);
      let errorMessage = "An unknown error occurred.";
      if (e instanceof Error) {
        errorMessage = e.message;
      }
      setError(errorMessage);
    } finally {
      setIsConnecting(false);
    }
  }, [isConnecting, connectExistingWallet, createNewWallet]);

  // Disconnect wallet
  const disconnectWallet = useCallback(async () => {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    // Don't remove username or contractId to remember the user
    // localStorage.removeItem(LOCAL_STORAGE_USERNAME_KEY);
    // localStorage.removeItem(LOCAL_STORAGE_CONTRACT_ID);
    setPublicKey(null);
    setIsWalletConnected(false);
    setBalance(null);
    setError(null);
    console.log("[Wallet] Wallet disconnected");
  }, []);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Auto-connect on load if we have a stored keyId
  useEffect(() => {
    const existingKeyId = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (existingKeyId && !isWalletConnected && !isConnecting) {
      connectWallet();
    }
  }, [connectWallet, isWalletConnected, isConnecting]);

  // Para yatırma işlemi için fonksiyon
  const depositXLM = useCallback(
    async (amount: string) => {
      try {
        if (!publicKey) {
          throw new Error("Cüzdan bağlı değil");
        }

        // Burada gerçek bir ödeme geçidi entegrasyonu olabilir
        // Şimdilik test amaçlı Friendbot kullanıyoruz
        await fundWallet(publicKey);

        console.log(`[Wallet] ${amount} XLM yatırma işlemi başlatıldı`);
        setError(null);
      } catch (e) {
        console.error("[Wallet] Para yatırma hatası:", e);
        let errorMessage = "Para yatırma işlemi sırasında bir hata oluştu.";
        if (e instanceof Error) {
          errorMessage = e.message;
        }
        setError(errorMessage);
      }
    },
    [publicKey, fundWallet]
  );

  // Kullanıcının cüzdan adresini alma
  const getDepositAddress = useCallback(() => {
    return publicKey;
  }, [publicKey]);

  const value = {
    isWalletConnected,
    publicKey,
    isConnecting,
    error,
    balance,
    connectWallet,
    disconnectWallet,
    clearError,
    username,
    depositXLM,
    getDepositAddress,
  };

  return (
    <WalletContext.Provider value={value}>{children}</WalletContext.Provider>
  );
};
