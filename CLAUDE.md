# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React Native Expo project called "FastingTracker" - a professional intermittent fasting app for iOS/Android. The project uses Expo SDK ~53.0 with TypeScript, file-based routing via Expo Router, and React Native UI Lib for a polished, professional design.

### Current Status
**✅ COMPLETED - MVP Phase 2 with Professional UI**
- Beautiful circular progress timer with integrated START/STOP button
- Professional muted color scheme with enhanced animations
- Comprehensive fasting plans (16:8, 18:6, 20:4, 24:0, Custom)
- Streak tracking system with motivational feedback
- Complete statistics dashboard with detailed metrics
- Persistent data storage with AsyncStorage
- Haptic feedback and smooth animations (using standard React Native Animated API)

### Architecture Decision: Standard React Native Animations
**Important:** This project uses standard React Native `Animated` API instead of React Native Reanimated due to compatibility issues. All animations work perfectly with this approach.

## Development Commands

### Starting Development
```bash
npm install                    # Install dependencies
npx expo start                # Start development server
npm run ios                   # Start iOS simulator
npm run android               # Start Android emulator
npm run web                   # Start web development
```

### Code Quality
```bash
npm run lint                  # Run ESLint using Expo's config
npx tsc --noEmit              # TypeScript type checking
```

### Project Reset
```bash
npm run reset-project         # Move starter code to app-example/ and create blank app/
```

## Deployment & Installation

### Option 1: iOS Development Build (Mac Required)
**For personal use without App Store - FREE**
```bash
# Prerequisites: Mac with Xcode installed

# 1. Install development dependencies
npm install

# 2. Run on iOS device/simulator
npx expo run:ios

# 3. For physical device (requires Apple Developer account for signing)
npx expo run:ios --device
```

### Option 2: EAS Build for TestFlight
**For App Store distribution - requires Apple Developer account ($99/year)**
```bash
# 1. Install EAS CLI
npm install -g @expo/eas-cli

# 2. Login to Expo
eas login

# 3. Configure EAS (first time only)
eas build:configure

# 4. Build for iOS
eas build --platform ios

# 5. Submit to TestFlight
eas submit --platform ios
```

### Option 3: EAS Build for Internal Distribution
**For sharing with specific users - requires Apple Developer account**
```bash
# Build for internal distribution
eas build --platform ios --profile preview

# This generates an IPA file you can install via TestFlight Internal Testing
```

### Android Builds
```bash
# APK for direct installation
eas build --platform android --profile preview

# AAB for Google Play Store
eas build --platform android
```

## Architecture Overview

### File-Based Routing Structure
The app uses Expo Router with file-based routing centered in the `app/` directory:

- `app/_layout.tsx` - Root layout with theme provider, font loading, and navigation stack
- `app/(tabs)/` - Tab-based navigation group (3 tabs)
  - `_layout.tsx` - Tab bar configuration with haptic feedback and blur effects
  - `index.tsx` - **Timer Screen** - Main fasting timer with circular progress
  - `explore.tsx` - **History Screen** - Fasting session history with search
  - `stats.tsx` - **Statistics Screen** - Comprehensive fasting analytics
- `app/+not-found.tsx` - 404 error screen

### Component Architecture
The project follows a modular component structure:

- `components/` - Reusable UI components
  - `StaticCircularTimer.tsx` - **Main circular progress timer component**
  - `CustomPlanModal.tsx` - Modal for creating custom fasting plans
  - `ThemedText.tsx` & `ThemedView.tsx` - Theme-aware base components
  - `ui/` - Platform-specific UI components (IconSymbol, TabBarBackground)
  - Utility components (Collapsible, ExternalLink, HapticTab, etc.)

- `hooks/` - Custom React hooks
  - `useFasting.ts` - **Core fasting logic hook** (state management, persistence)
  - `useColorScheme.ts` & `useThemeColor.ts` - Theme management

- `types/` - TypeScript type definitions
  - `fasting.ts` - Core fasting interfaces and data structures

- `constants/` - App constants and configuration
  - `Theme.ts` - **Professional color palette and UI Lib theme setup**

### Theme System
Professional theming system with React Native UI Lib:
- `constants/Theme.ts` - **Muted professional color palette** with UI Lib integration
- `hooks/useColorScheme.ts` - Cross-platform color scheme detection
- `hooks/useThemeColor.ts` - Dynamic color resolution based on current theme
- React Native UI Lib components with consistent styling
- Custom typography scale and spacing system

### TypeScript Configuration
- Strict TypeScript enabled
- Path aliases configured: `@/*` maps to project root
- Expo TypeScript base configuration with custom paths

### Platform-Specific Implementation
Components use platform detection for iOS/Android differences:
- `.ios.tsx` suffixes for iOS-specific implementations
- Platform-specific styling (blur effects on iOS tab bars)
- Haptic feedback integration for enhanced iOS experience

### Asset Management
- `assets/images/` - App icons, splash screens, and graphics
- `assets/fonts/` - Custom fonts (SpaceMono)
- Expo-managed asset optimization and bundling

## Key Dependencies

### Core Expo/React Native
- `expo-router` - File-based routing system
- `@react-navigation/native` - Navigation library
- `expo-constants`, `expo-status-bar` - Expo utilities

### UI & Styling
- `react-native-ui-lib` - **Professional UI component library**
- `expo-linear-gradient` - Gradient backgrounds
- `expo-haptics` - Tactile feedback for better UX
- `react-native-safe-area-context` - Safe area handling

### Data & State
- `@react-native-async-storage/async-storage` - **Persistent fasting data storage**
- Standard React state management with custom hooks

### Animation
- Standard React Native `Animated` API (not Reanimated - compatibility reasons)

### Development
- TypeScript with strict configuration
- ESLint with Expo configuration

## Implemented Features

### ✅ Fasting Timer (Circular Progress Design)
- **StaticCircularTimer** component with integrated START/STOP button
- Real-time progress tracking with percentage and time remaining
- Professional animations using standard React Native Animated API
- Haptic feedback for all user interactions
- Dynamic color progression (grey → primary → success)

### ✅ Fasting Plans & Customization
- Pre-built plans: 16:8, 18:6, 20:4, 24:0 (intermittent fasting)
- Custom plan creator with validation
- Visual plan selection with enhanced chip design
- Plan persistence across app sessions

### ✅ Data Persistence & State Management
- **useFasting** hook managing all fasting logic
- AsyncStorage for persistent data (state, history, custom plans)
- Real-time progress calculations
- Comprehensive statistics and streak tracking

### ✅ User Interface & Experience
- Professional muted color palette (non-colorful, business-like)
- Enhanced streak cards with motivational messaging
- Contextual headers that change based on fasting state
- Smooth entrance animations and micro-interactions
- Responsive design with proper spacing and typography

### ✅ Statistics & Analytics
- Current streak and longest streak tracking
- Success rate calculations
- Average fasting duration metrics
- Recent activity timeline (last 7 days)
- Motivational badges for streaks >= 7 days

### ✅ History & Search
- Complete session history with search functionality
- Detailed session information (start time, duration, completion status)
- Visual indicators for completed vs cancelled sessions
- Animated list items with staggered entrance

## Architecture Decisions Made

### Animation Library Choice
**Decision:** Standard React Native `Animated` API  
**Reason:** React Native Reanimated caused crashes in development environment  
**Impact:** All animations work perfectly, slightly different syntax but same visual results  
**Components affected:** All animated components use `Animated.Value` instead of `useSharedValue`

### UI Library Choice
**Decision:** React Native UI Lib  
**Reason:** Professional components, extensive theming, good TypeScript support  
**Impact:** Consistent design system, faster development, professional appearance  
**Setup:** Custom theme in `constants/Theme.ts` with muted professional colors

### State Management
**Decision:** Custom React hooks with AsyncStorage  
**Reason:** Simple requirements, avoiding complexity of Redux/Zustand  
**Implementation:** `useFasting` hook manages all fasting logic and persistence

## Development Patterns

### Component Creation
When creating new components:
1. Use React Native UI Lib components for consistency
2. Follow the existing pattern of separating props interfaces with `Props` suffix
3. Utilize the `useThemeColor` hook for consistent color theming
4. Consider platform differences and create `.ios.tsx` variants when needed
5. Use standard React Native `Animated` API for animations (not Reanimated)

### State Management
The project uses custom React hooks for state management:
- `useFasting` hook for all fasting-related logic
- AsyncStorage for data persistence
- Local state for UI-specific data
- No global state management library needed for current scope

### Navigation Patterns
- File-based routing: create new screens by adding files to `app/`
- Group related screens in folders with `_layout.tsx`
- Use Stack navigation for hierarchical flows, Tabs for main sections
- Implement proper TypeScript types for navigation params

### Styling Approach
- React Native UI Lib components with theme integration
- Custom `Theme.ts` configuration for professional color palette
- Standard React Native StyleSheet for custom styling when needed
- Platform.select() for platform-specific styles when necessary

### Performance Optimizations Implemented
- Proper timer cleanup in useEffect hooks
- Memoized calculations in useFasting hook
- Efficient state updates to prevent unnecessary re-renders
- AsyncStorage operations properly managed
- Standard animations with useNativeDriver: true for 60fps performance

## Deployment Guide for Mac

### Prerequisites for iOS Development Build
1. **Mac computer** with macOS (required for iOS development)
2. **Xcode** installed from Mac App Store
3. **Node.js** and **npm** installed
4. **Expo CLI** installed globally: `npm install -g @expo/eas-cli`

### Step-by-Step iOS Deployment
```bash
# 1. Clone/transfer project to Mac
git clone <repository-url>
cd gg-fitness-app

# 2. Install dependencies
npm install

# 3. For iOS Simulator (FREE)
npx expo run:ios

# 4. For physical iPhone (requires Apple Developer account)
npx expo run:ios --device

# 5. Alternative: Build with EAS for TestFlight
eas login
eas build --platform ios
```

### Troubleshooting Common Issues
- **"Command not found: expo"** → Run `npm install -g @expo/eas-cli`
- **Xcode errors** → Make sure Xcode is updated and command line tools are installed
- **Device not recognized** → Check USB connection and trust the computer on iPhone
- **Signing errors** → Ensure Apple Developer account is properly configured

### File Structure for New Claude Instances
```
gg-fitness-app/
├── app/
│   ├── (tabs)/
│   │   ├── index.tsx        # Timer screen (main)
│   │   ├── explore.tsx      # History screen  
│   │   └── stats.tsx        # Statistics screen
│   └── _layout.tsx          # Root layout
├── components/
│   ├── StaticCircularTimer.tsx  # Main timer component
│   ├── CustomPlanModal.tsx      # Plan creation modal
│   └── ...
├── hooks/
│   └── useFasting.ts        # Core fasting logic
├── types/
│   └── fasting.ts           # TypeScript definitions
├── constants/
│   └── Theme.ts             # UI Lib theme configuration
└── CLAUDE.md               # This file
```

## Success Metrics
- ✅ App builds and runs without errors
- ✅ All three tabs (Timer, History, Stats) functional
- ✅ Circular timer with integrated button works perfectly
- ✅ Fasting sessions persist across app restarts
- ✅ Professional UI with muted color scheme achieved
- ✅ No TypeScript errors or linting warnings
- ✅ Smooth animations without Reanimated dependency issues

The app is ready for production deployment!