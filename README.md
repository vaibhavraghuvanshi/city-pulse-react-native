# City Pulse - Events Discovery App

City Pulse is a modern React Native app built with Expo that helps users discover local events, manage their profiles, and stay connected with their city's pulse. The app features authentication, event discovery, biometric login, and user profile management with a beautiful, responsive UI.

## 🚀 Features

### Authentication & User Management
- **User Registration & Login**: Secure authentication system using Firebase email/password
- **Firebase Integration**: Real Firebase Auth and Firestore integration
- **Persistent Auth State**: Firebase Auth state persists using AsyncStorage via `getReactNativePersistence`
- **Secure Credential Storage**: Uses `expo-secure-store` to store email/password for biometric login
- **Biometric Login**: Native fingerprint/Face ID login using stored credentials
- **Profile Management**: Upload profile images, edit personal info, view account details
- **Secure Logout**: Clears session and stored credentials safely

### Event Discovery
- **Event Search**: Search by keyword and city using Ticketmaster API
- **Event Details**: View images, date, time, location, and more
- **Favorites**: Mark and store favorite events locally
- **Fallback Data**: Mock data fallback when API fails

### UI/UX Excellence  
- **Bottom Navigation**: Clean navigation with Home and Profile tabs
- **Theme Support**: Light and dark mode with system auto-detection
- **RTL Language Support**: Toggle for Arabic (layout only, placeholder translation)
- **Responsive Design**: Works across web and native platforms
- **Modern Icons**: Ionicons throughout the interface
- **Toast Notifications**: Friendly feedback using Sonner Native

### Technical Features
- **TypeScript**: Safer, smarter development
- **Expo Framework**: Cross-platform app support
- **Modular Hooks and Components**: Reusable architecture
- **Firebase Auth + Firestore**: Real-time data and authentication
- **Secure Store**: Credential storage for biometric login

## 🛠 Tech Stack

- **React Native + Expo**
- **Firebase (Auth + Firestore)**
- **TypeScript**
- **AsyncStorage + SecureStore**
- **React Navigation**
- **Expo Vector Icons**
- **Ticketmaster Discovery API**
- **Sonner Native**
- **LocalAuthentication API**

## 📱 App Structure

### Navigation Flow

```
App
├── Auth Stack (Pre-login)
│   ├── Splash Screen
│   └── Login Screen
└── Main Stack (Post-login)
    ├── Bottom Tabs
    │   ├── Home Tab
    │   └── Profile Tab
    └── Event Detail Screen (Modal)
```

### Core Screens

- **SplashScreen**
- **LoginScreen** (with biometric support)
- **HomeScreen**
- **ProfileScreen**
- **EventDetailScreen**

## 🔧 Setup Instructions

### Prerequisites

- Node.js (v16+)
- Expo CLI (`npm install -g expo-cli`)
- Firebase project (if you want to use real backend)

### Installation

```bash
git clone <your-repo-url>
cd city-pulse-app
npm install
# or
yarn install
```

### Firebase Setup

Replace placeholder values in `firebaseConfig.ts`:

```ts
const firebaseConfig = {
  apiKey: 'YOUR_API_KEY',
  authDomain: '...',
  projectId: '...',
  ...
};

const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});
```

> 🧠 Make sure `@react-native-async-storage/async-storage` is installed.

### Start the App

```bash
expo start
```

## 🔐 Biometric Login (Secure Setup)

1. After successful login/registration, email and password are securely stored using:

```ts
await SecureStore.setItemAsync('userEmail', email);
await SecureStore.setItemAsync('userPassword', password);
```

2. On biometric login, credentials are retrieved and user is logged in via:

```ts
const email = await SecureStore.getItemAsync('userEmail');
const password = await SecureStore.getItemAsync('userPassword');
await signInWithEmailAndPassword(auth, email, password);
```

> ✅ Credentials are encrypted and only available after successful biometric authentication.

## 📂 Project Structure

```
src/
├── components/          # Reusable UI components
│   └── EventCard.tsx   # Event display component
├── screens/            # Main app screens
│   ├── SplashScreen.tsx
│   ├── LoginScreen.tsx
│   ├── HomeScreen.tsx
│   ├── ProfileScreen.tsx
│   └── EventDetailScreen.tsx
├── hooks/              # Custom React hooks
│   ├── useAuth.ts      # Authentication logic
│   ├── useUserProfile.ts # Profile management
│   ├── useEvents.ts    # Event data fetching
│   ├── useTheme.tsx    # Theme management
│   ├── useLanguage.tsx # Internationalization
│   └── useFavorites.ts # Event favorites
├── config/             # Configuration files
│   └── firebase.ts     # Mock Firebase setup
└── App.tsx            # Main app component
```

## 🌐 Internationalization & RTL

- Toggle between English and Arabic (UI layout only)
- RTL layout support for all major UI components
- Bi-directional form, icon, and text adjustments

### Performance Optimizations
- **React.memo**: Optimized component re-renders
- **useCallback**: Memoized event handlers
- **Platform checks**: Conditional code loading
- **Image optimization**: Platform-specific image handling

### Common Issues

1. **"Unable to resolve module" errors**
   - Restart Expo development server: `expo start --clear`
   - Check if running in compatible environment

2. **Authentication not working**
   - Clear AsyncStorage: Restart app completely
   - Check network connectivity for API calls

3. **Images not loading**
   - Verify image URLs are accessible
   - Check platform-specific image rendering

4. **Theme/Language not persisting**
   - Ensure AsyncStorage permissions
   - Check for storage quota limits

   ### Environment Specific

**For Prod Environment:**
- Firebase SDK available 
- Some native features may not work on web preview
- Image uploads use API generation instead of file upload

**For Local Development:**
- All features should work as expected
- Real Firebase can be integrated by updating config
- Native biometric features available on device

## 📦 Key Improvements in This Version

- ✅ Firebase `initializeAuth()` with AsyncStorage for persistent login
- ✅ Biometric login with stored encrypted credentials
- ✅ `expo-secure-store` used for secure credential management
- ✅ Clean error handling for biometric and auth flows
- ✅ Real Firebase Firestore integration for profile data

## 🚀 Future Enhancements

- [ ] Cloud functions for custom logic
- [ ] Push notifications
- [ ] Event calendar syncing
- [ ] Password reset flow
- [ ] More biometric options (e.g., Android face unlock)

## 📄 License

MIT License

## 🤝 Contributing

1. Fork
2. `git checkout -b feature/YourFeature`
3. Commit
4. Push
5. Pull Request

## 📞 Support

Contact: support@citypulse.dev  
Raise an issue on GitHub

---

**Built with ❤️ by the City Pulse Team**  
*Discover your city's vibe, one event at a time.*