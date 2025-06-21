// Native WebAuthn-based authentication service
// This service uses the browser's built-in WebAuthn API for biometric authentication

export interface AuthenticationOptions {
  timeout?: number;
  userVerification?: "required" | "preferred" | "discouraged";
}

export interface BiometricCredential {
  id: string;
  username: string;
  created: number;
}

export class BiometricService {
  private static readonly CREDENTIAL_KEY = "biometricCredentialId";
  private static readonly AUTH_METHOD_KEY = "authMethod";
  private static readonly SESSION_KEY = "biometricSession";

  // Check if WebAuthn is supported
  static isWebAuthnSupported(): boolean {
    return !!(window?.PublicKeyCredential && navigator?.credentials);
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

  // Check if user has fingerprint sensor
  static async hasFingerprint(): Promise<boolean> {
    try {
      // Check if Touch ID (iOS), Face ID, or Windows Hello is available
      const available = await this.isBiometricAvailable();
      if (!available) return false;

      // Additional check for platform-specific biometrics
      if ("ontouchstart" in window) {
        // Mobile device - likely has fingerprint or face unlock
        return true;
      }

      // Desktop - check for Windows Hello or similar
      return available;
    } catch {
      return false;
    }
  }

  // Register new biometric credential with proper error handling
  static async register(
    username: string,
    options?: AuthenticationOptions
  ): Promise<{
    success: boolean;
    error?: string;
    credentialId?: string;
  }> {
    if (!this.isWebAuthnSupported()) {
      return {
        success: false,
        error: "WebAuthn not supported in this browser",
      };
    }

    try {
      const challenge = new Uint8Array(32);
      crypto.getRandomValues(challenge);

      const publicKeyCredentialCreationOptions: PublicKeyCredentialCreationOptions =
        {
          challenge,
          rp: {
            name: "VibeAgency Wallet",
            id: window.location.hostname,
          },
          user: {
            id: new TextEncoder().encode(username),
            name: username,
            displayName: username,
          },
          pubKeyCredParams: [
            { type: "public-key", alg: -7 }, // ES256
            { type: "public-key", alg: -257 }, // RS256
          ],
          timeout: options?.timeout || 60000,
          authenticatorSelection: {
            authenticatorAttachment: "platform",
            userVerification: options?.userVerification || "required",
            requireResidentKey: false,
          },
          attestation: "none",
        };

      const credential = (await navigator.credentials.create({
        publicKey: publicKeyCredentialCreationOptions,
      })) as PublicKeyCredential;

      if (credential) {
        const credentialData: BiometricCredential = {
          id: Array.from(new Uint8Array(credential.rawId))
            .map((b) => b.toString(16).padStart(2, "0"))
            .join(""),
          username,
          created: Date.now(),
        };

        localStorage.setItem(
          this.CREDENTIAL_KEY,
          JSON.stringify(credentialData)
        );
        localStorage.setItem(this.AUTH_METHOD_KEY, "biometric");

        return { success: true, credentialId: credentialData.id };
      }

      return { success: false, error: "Failed to create credential" };
    } catch (error: unknown) {
      console.error("Error registering biometric credential:", error);

      const err = error as Error;
      if (err.name === "NotAllowedError") {
        return {
          success: false,
          error: "User cancelled biometric registration",
        };
      } else if (err.name === "InvalidStateError") {
        return { success: false, error: "Biometric credential already exists" };
      } else if (err.name === "NotSupportedError") {
        return {
          success: false,
          error: "Biometric authentication not supported",
        };
      }

      return { success: false, error: "Biometric registration failed" };
    }
  }

  // Authenticate with biometrics - with proper user cancellation handling
  static async authenticate(
    username: string,
    options?: AuthenticationOptions
  ): Promise<{
    success: boolean;
    error?: string;
    cancelled?: boolean;
  }> {
    if (!this.isWebAuthnSupported()) {
      return { success: false, error: "WebAuthn not supported" };
    }

    try {
      // Get stored credential
      const storedCredential = localStorage.getItem(this.CREDENTIAL_KEY);
      if (!storedCredential) {
        // Try to register first
        const registerResult = await this.register(username, options);
        if (!registerResult.success) {
          return { success: false, error: registerResult.error };
        }
      }

      const challenge = new Uint8Array(32);
      crypto.getRandomValues(challenge);

      const publicKeyCredentialRequestOptions: PublicKeyCredentialRequestOptions =
        {
          challenge,
          timeout: options?.timeout || 30000,
          userVerification: options?.userVerification || "required",
          rpId: window.location.hostname,
        };

      const credential = await navigator.credentials.get({
        publicKey: publicKeyCredentialRequestOptions,
      });

      if (credential) {
        localStorage.setItem(this.AUTH_METHOD_KEY, "biometric");
        localStorage.setItem(this.SESSION_KEY, Date.now().toString());
        return { success: true };
      }

      return { success: false, error: "Authentication failed" };
    } catch (error: unknown) {
      console.error("Error authenticating with biometrics:", error);

      const err = error as Error;
      if (err.name === "NotAllowedError") {
        return {
          success: false,
          error: "User cancelled biometric authentication",
          cancelled: true,
        };
      } else if (err.name === "InvalidStateError") {
        return { success: false, error: "Invalid biometric state" };
      }

      return { success: false, error: "Biometric authentication failed" };
    }
  }

  // Device password authentication simulation
  static async authenticateWithPassword(username: string): Promise<{
    success: boolean;
    error?: string;
    cancelled?: boolean;
  }> {
    try {
      // Store username for association with the session
      const storedUsername = username || "user";

      // Simulate device password prompt
      const password = prompt("Please enter your device password:");

      if (password === null) {
        return {
          success: false,
          error: "User cancelled password authentication",
          cancelled: true,
        };
      }

      if (password === "") {
        return { success: false, error: "Password cannot be empty" };
      }

      // In real implementation, this would verify against device password
      // For demo purposes, any non-empty password is considered valid
      localStorage.setItem(this.AUTH_METHOD_KEY, "password");
      localStorage.setItem(this.SESSION_KEY, Date.now().toString());

      // Store the username associated with this session
      localStorage.setItem("authUsername", storedUsername);

      return { success: true };
    } catch (error) {
      console.error("Error authenticating with password:", error);
      return { success: false, error: "Password authentication failed" };
    }
  }

  // Get preferred authentication method
  static getPreferredAuthMethod(): string | null {
    return localStorage.getItem(this.AUTH_METHOD_KEY);
  }

  // Check if session is still valid (optional - for security)
  static isSessionValid(): boolean {
    const session = localStorage.getItem(this.SESSION_KEY);
    if (!session) return false;

    const sessionTime = parseInt(session);
    const now = Date.now();
    const maxAge = 30 * 60 * 1000; // 30 minutes

    return now - sessionTime < maxAge;
  }

  // Clear authentication data
  static clearAuthData(): void {
    localStorage.removeItem(this.CREDENTIAL_KEY);
    localStorage.removeItem(this.AUTH_METHOD_KEY);
    localStorage.removeItem(this.SESSION_KEY);
  }
}
