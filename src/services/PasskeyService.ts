// Native WebAuthn-based authentication service
// This service uses the browser's built-in WebAuthn API for biometric authentication

export interface AuthenticationOptions {
  timeout?: number;
  userVerification?: "required" | "preferred" | "discouraged";
}

export class BiometricService {
  // Check if WebAuthn is supported by the browser
  static isWebAuthnSupported(): boolean {
    return window && !!window.PublicKeyCredential;
  }

  // Check if platform authenticator (biometrics) is available
  static async isBiometricAvailable(): Promise<boolean> {
    if (!this.isWebAuthnSupported()) {
      return false;
    }

    try {
      return await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
    } catch (error) {
      console.error("Error checking biometric availability:", error);
      return false;
    }
  }

  // Register a new biometric credential
  static async register(
    username: string,
    options?: AuthenticationOptions
  ): Promise<boolean> {
    if (!this.isWebAuthnSupported()) {
      console.error("WebAuthn is not supported in this browser");
      return false;
    }

    try {
      // Generate a random challenge
      const challenge = new Uint8Array(32);
      window.crypto.getRandomValues(challenge);

      // Create credential creation options
      const publicKeyCredentialCreationOptions: PublicKeyCredentialCreationOptions =
        {
          challenge,
          rp: {
            name: "VibeAgency",
            id: window.location.hostname,
          },
          user: {
            id: Uint8Array.from(username, (c) => c.charCodeAt(0)),
            name: username,
            displayName: username,
          },
          pubKeyCredParams: [
            { type: "public-key", alg: -7 }, // ES256
            { type: "public-key", alg: -257 }, // RS256
          ],
          timeout: options?.timeout || 60000,
          authenticatorSelection: {
            authenticatorAttachment: "platform", // Use platform authenticator (like Touch ID, Face ID, Windows Hello)
            userVerification: options?.userVerification || "preferred",
            requireResidentKey: false,
          },
          attestation: "none",
        };

      // Create the credential
      const credential = await navigator.credentials.create({
        publicKey: publicKeyCredentialCreationOptions,
      });

      if (credential) {
        // Store credential ID in localStorage for future authentication
        localStorage.setItem(
          "biometricCredentialId",
          JSON.stringify({
            id: (credential as PublicKeyCredential).rawId,
            username,
          })
        );
        localStorage.setItem("authMethod", "biometric");
        return true;
      }

      return false;
    } catch (error) {
      console.error("Error registering biometric credential:", error);
      return false;
    }
  }

  // Authenticate using biometrics
  static async authenticate(
    username: string,
    options?: AuthenticationOptions
  ): Promise<boolean> {
    if (!this.isWebAuthnSupported()) {
      console.error("WebAuthn is not supported in this browser");
      return false;
    }

    try {
      // Generate a random challenge
      const challenge = new Uint8Array(32);
      window.crypto.getRandomValues(challenge);

      // Create credential request options
      const publicKeyCredentialRequestOptions: PublicKeyCredentialRequestOptions =
        {
          challenge,
          timeout: options?.timeout || 60000,
          userVerification: options?.userVerification || "preferred",
          rpId: window.location.hostname,
        };

      // Get the credential
      const credential = await navigator.credentials.get({
        publicKey: publicKeyCredentialRequestOptions,
      });

      if (credential) {
        // Store authentication method preference
        localStorage.setItem("authMethod", "biometric");
        return true;
      }

      return false;
    } catch (error) {
      console.error("Error authenticating with biometrics:", error);
      return false;
    }
  }

  // Authenticate using device password/PIN
  static async authenticateWithPassword(username: string): Promise<boolean> {
    try {
      // For demonstration purposes, we're simulating password authentication
      // In a real implementation, this would use a secure method for password verification

      // Here we're just storing the preference
      localStorage.setItem("authMethod", "password");
      return true;
    } catch (error) {
      console.error("Error authenticating with password:", error);
      return false;
    }
  }

  // Get the preferred authentication method
  static getPreferredAuthMethod(): string | null {
    return localStorage.getItem("authMethod");
  }

  // Clear authentication data
  static clearAuthData(): void {
    localStorage.removeItem("biometricCredentialId");
    localStorage.removeItem("authMethod");
  }
}
