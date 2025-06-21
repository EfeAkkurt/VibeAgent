# VibeAgency - AI Influencer Web3 Platform

VibeAgency is a modern web application that connects users with AI influencers in the Web3 space. The platform uses Freighter wallet for authentication and secure interactions.

## Key Features

- **Native Biometric Authentication**: Secure wallet connection using device biometrics (fingerprint, face recognition)
- **Multi-tier Authentication**: Fallback to password authentication when biometrics are not available
- **Proper Error Handling**: Comprehensive error management with user cancellation detection
- **AI Influencer Interaction**: Chat with specialized AI influencers in various Web3 domains
- **Sliding Card Carousel**: Browse through AI creators with smooth navigation controls

## Technical Implementation

### Authentication Flow

The authentication system follows a multi-tier approach:

1. **Biometric Authentication (Primary)**

   - Uses native WebAuthn API for secure biometric verification
   - Handles user cancellation properly
   - Provides visual feedback during authentication

2. **Password Authentication (Fallback)**

   - Used when biometrics are not available or fail
   - Provides consistent user experience across all devices

3. **Wallet Connection**
   - Uses correct Freighter API methods (`requestAccess()` and `getAddress()`)
   - Manages connection state and error handling
   - Prevents multiple simultaneous connection attempts

### Components

- **FreighterService**: Handles wallet connection with proper API usage
- **BiometricService**: Manages biometric and password authentication with WebAuthn
- **WalletContext**: Provides authentication state throughout the application
- **Header & ChatPanel**: UI components with integrated wallet connection

## Security Considerations

- Biometric data never leaves the user's device (uses WebAuthn)
- Authentication preferences are stored securely
- Session validation for enhanced security
- Proper error handling for all authentication scenarios
- Fallback mechanisms ensure users can always connect

## Getting Started

1. Install dependencies:

```bash
npm install @stellar/freighter-api
npm install
```

2. Start the development server:

```bash
npm run dev
```

3. Build for production:

```bash
npm run build
```

## Fixed Issues

- **Corrected Freighter API Usage**: Now using `requestAccess()` and `getAddress()` instead of `setAllowed()`
- **Proper WebAuthn Implementation**: Full biometric authentication with error handling
- **User Cancellation Detection**: Properly detects when users cancel authentication
- **State Management**: Prevents multiple simultaneous connection attempts
- **Session Validation**: Added session timeout for enhanced security

## Browser Support

The application supports all modern browsers with WebAuthn capabilities. For older browsers without biometric support, the application falls back to password authentication.
