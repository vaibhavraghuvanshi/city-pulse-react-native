# City Pulse - Events Discovery App

City Pulse is a modern React Native app built with Expo that helps users discover local events, manage their profiles, and stay connected with their city's pulse. The app features authentication, event discovery, and user profile management with a beautiful, responsive UI.

## 🚀 Features

### Authentication & User Management
- **User Registration & Login**: Secure authentication system with email/password
- **Firebase Integration**: Persistent user data storage using AsyncStorage & store date in firebase
- **Persistent Data**: Store user preferences and favorites locally
- **Biometric Login**: Fingerprint/Face ID login (Native platforms only)
- **Profile Management**: Upload profile images, edit personal information
- **Secure Logout**: Complete session management

### Event Discovery
- **Event Search**: Search events by keyword and location
- **Event Details**: Comprehensive event information with images
- **Real-time Data**: Integration with Ticketmaster API with fallback mock data
- **Event Categories**: Music, conferences, arts, and more

### UI/UX Excellence  
- **Bottom Navigation**: Fixed navigation with Home and Profile tabs
- **Theme Support**: Dark/Light mode toggle with system preference
- **RTL Language Support**: Full Arabic language support with RTL layout
- **Responsive Design**: Mobile-first design with web compatibility
- **Modern Icons**: Beautiful Ionicons throughout the app
- **Toast Notifications**: User-friendly feedback with Sonner Native

### Technical Features
- **TypeScript**: Full type safety and better developer experience
- **Expo Compatible**: Runs on web, iOS, and Android
- **Platform-Specific Code**: Optimized for different platforms
- **Error Handling**: Comprehensive error management
- **Loading States**: Smooth loading experiences

## 🛠 Tech Stack

- **React Native** - Cross-platform mobile development
- **Expo** - Development platform and tools
- **TypeScript** - Type safety and better development experience
- **React Navigation** - Navigation solution (Stack + Bottom Tabs)
- **Mock Firebase** - User authentication and data storage
- **AsyncStorage** - Local data persistence
- **Expo Vector Icons** - Beautiful icons
- **Sonner Native** - Toast notifications
- **React Native Safe Area Context** - Safe area handling
- **Ticketmaster API** - Event data (with mock fallback)
- **Image Generation API** - Dynamic profile images

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
- **SplashScreen**: App initialization and loading
- **LoginScreen**: Authentication with email/password and biometric options
- **HomeScreen**: Event discovery and search functionality
- **ProfileScreen**: User profile management and app settings
- **EventDetailScreen**: Detailed event information

## 🔧 Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- npm or Yarn
- Expo CLI (`npm install -g expo-cli`)

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd city-pulse-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start the development server**
   ```bash
   expo start
   ```

4. **Run on device/simulator**
   - **Physical Device**: Scan QR code with Expo Go app
   - **iOS Simulator**: Press `i` in terminal
   - **Android Emulator**: Press `a` in terminal  
   - **Web Browser**: Press `w` in terminal

### Environment Compatibility

This app is designed to work in the **a0.dev environment** (Expo Snack-like environment) and uses:
- **Mock Firebase**: Instead of real Firebase SDK (due to environment constraints)
- **AsyncStorage**: For persistent data storage
- **Platform-specific code**: To handle web vs. native differences
- **Dynamic imports**: For optional native features like biometrics

## 🎨 Key Features Walkthrough

### 1. Authentication System
- **Registration**: Create new account with email/password (min 6 characters)
- **Login**: Secure login with proper error handling
- **Biometric Login**: Set up fingerprint/Face ID (native only)
- **Profile Creation**: Automatic user profile creation in database

### 2. Event Discovery
- **Search Events**: Find events by keyword or city
- **Event Cards**: Beautiful cards with event images and details
- **Event Details**: Full event information with date, venue, and description
- **Fallback Data**: Mock events when API is unavailable

### 3. Profile Management
- **Profile Picture**: Generate new profile images dynamically
- **Edit Information**: Update display name and personal info
- **Settings**: Theme toggle, language selection, biometric setup
- **Account Info**: View registration date and account details

### 4. Settings & Preferences
- **Dark/Light Theme**: System-aware theme switching
- **Language Toggle**: English ↔ Arabic with RTL support
- **Biometric Settings**: Enable/disable biometric login
- **Secure Logout**: Clear all stored data on logout

## 🔒 Security & Data Management

### Data Storage
- **User Profiles**: Stored in mock Firestore using AsyncStorage
- **Authentication**: Mock Firebase Authentication with proper error codes
- **Biometric Data**: Securely stored encrypted credentials
- **Session Management**: Automatic session restoration and cleanup

### Security Features
- **Password Validation**: Minimum 6 character requirement
- **Email Validation**: Proper email format checking
- **Error Handling**: Secure error messages without sensitive data exposure
- **Session Expiry**: Automatic logout on app restart (configurable)

## 🌍 Internationalization

### Language Support
- **English**: Default language
- **Arabic**: Full RTL support
- **Dynamic Switching**: Live language changes without restart
- **RTL Layout**: Proper right-to-left text and UI alignment

### RTL Features
- Text input alignment
- Icon positioning
- Navigation flow
- Button layouts
- Form arrangements

## 📦 Project Structure

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

## 🔧 Development Notes

### Platform Differences
- **Image Component**: Conditional rendering for web vs. native
- **Biometric Authentication**: Native-only feature with web fallbacks
- **Navigation**: Different behaviors on web vs. mobile
- **AsyncStorage**: Universal storage solution

### Mock Implementation
Due to the a0.dev environment constraints, this app uses:
- Mock Firebase Authentication API
- AsyncStorage for data persistence  
- Mock Firestore database functions
- Fallback event data when API fails

### Performance Optimizations
- **React.memo**: Optimized component re-renders
- **useCallback**: Memoized event handlers
- **Platform checks**: Conditional code loading
- **Image optimization**: Platform-specific image handling

## 🐛 Troubleshooting

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

**For a0.dev Environment:**
- Firebase SDK not available (using mock implementation)
- Some native features may not work on web preview
- Image uploads use API generation instead of file upload

**For Local Development:**
- All features should work as expected
- Real Firebase can be integrated by updating config
- Native biometric features available on device

## 🚀 Future Enhancements

### Planned Features
- [ ] Real Firebase integration for production
- [ ] Push notifications for event reminders  
- [ ] Social features (sharing, comments)
- [ ] Event favorites and bookmarks
- [ ] Calendar integration
- [ ] Location-based event recommendations
- [ ] Offline mode with data caching

### Technical Improvements
- [ ] Unit tests with Jest
- [ ] E2E testing with Detox
- [ ] Performance monitoring
- [ ] Advanced error tracking
- [ ] CI/CD pipeline setup

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📞 Support

For support, email support@citypulse.dev or create an issue in the GitHub repository.

---

**Made with ❤️ by the City Pulse Team**

*Discover your city's pulse, one event at a time.*