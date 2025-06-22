// This file contains public environment variables for the application.
// In a real-world scenario, these should be managed through environment variables
// (e.g., using .env files and Vite's import.meta.env).

export const env = {
  // Public RPC endpoint for the Stellar Testnet
  PUBLIC_RPC_URL: "https://soroban-testnet.stellar.org",

  // Network passphrase for the Stellar Testnet
  PUBLIC_NETWORK_PASSPHRASE: "Test SDF Network ; September 2015",

  // Deployed contract ID for the passkey factory on the Testnet.
  // This is a known contract that creates new smart wallets.
  PUBLIC_FACTORY_CONTRACT_ID:
    "CAN2Y3WKEZ2MAZ2BXT3TCHL7L4SAVYOB63YF6C2T6ATE2Y5D5M2TFKFF",

  // The following are placeholders. In a real application, you would need
  // your own Launchtube and Mercury instances for full functionality.
  // For client-side wallet creation, these are not strictly necessary.
  PUBLIC_LAUNCHTUBE_URL: "https://launchtube.testnet.superpeach.xyz",
  PRIVATE_LAUNCHTUBE_JWT: "your-launchtube-jwt-here", // This would be a secret
  PUBLIC_MERCURY_URL: "https://mercury.testnet.superpeach.xyz",
  PRIVATE_MERCURY_JWT: "your-mercury-jwt-here", // This would be a secret
};
