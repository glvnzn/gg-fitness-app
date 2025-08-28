# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React Native Expo project called "FastingTracker" - an intermittent fasting app for iOS/Android. The project uses Expo SDK ~53.0 with TypeScript and file-based routing via Expo Router.

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
```

### Project Reset
```bash
npm run reset-project         # Move starter code to app-example/ and create blank app/
```

## Architecture Overview

### File-Based Routing Structure
The app uses Expo Router with file-based routing centered in the `app/` directory:

- `app/_layout.tsx` - Root layout with theme provider, font loading, and navigation stack
- `app/(tabs)/` - Tab-based navigation group
  - `_layout.tsx` - Tab bar configuration with haptic feedback and blur effects
  - `index.tsx` - Home tab screen
  - `explore.tsx` - Secondary tab screen  
- `app/+not-found.tsx` - 404 error screen

### Component Architecture
The project follows a modular component structure:

- `components/` - Reusable UI components
  - `ThemedText.tsx` & `ThemedView.tsx` - Theme-aware base components
  - `ui/` - Platform-specific UI components (IconSymbol, TabBarBackground)
  - Utility components (Collapsible, ExternalLink, HapticTab, etc.)

### Theme System
Comprehensive theming system with:
- `constants/Colors.ts` - Color definitions for light/dark modes
- `hooks/useColorScheme.ts` - Cross-platform color scheme detection
- `hooks/useThemeColor.ts` - Dynamic color resolution based on current theme
- Automatic dark/light mode switching via React Navigation ThemeProvider

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

## Development Patterns

### Component Creation
When creating new components:
1. Use `ThemedText` and `ThemedView` as base components for automatic theme support
2. Follow the existing pattern of separating props interfaces with `Props` suffix
3. Utilize the `useThemeColor` hook for consistent color theming
4. Consider platform differences and create `.ios.tsx` variants when needed

### State Management
The project currently uses React's built-in state management. For the fasting tracker:
- Use AsyncStorage (already included) for persistent data
- Consider React Context for global state (fasting status, user preferences)
- Leverage Expo Notifications for fasting reminders

### Navigation Patterns
- File-based routing: create new screens by adding files to `app/`
- Group related screens in folders with `_layout.tsx`
- Use Stack navigation for hierarchical flows, Tabs for main sections
- Implement proper TypeScript types for navigation params

### Styling Approach
- StyleSheet.create() for component styles
- Theme-aware styling using the color system
- Platform.select() for platform-specific styles
- Consistent spacing and typography through the theme system

## Key Dependencies

### Core Expo/React Native
- `expo-router` - File-based routing system
- `@react-navigation/native` - Navigation library
- `expo-constants`, `expo-status-bar` - Expo utilities

### UI & Styling
- `expo-linear-gradient` - Gradient backgrounds
- `expo-blur` - iOS blur effects
- `expo-haptics` - Tactile feedback
- `react-native-safe-area-context` - Safe area handling

### Device Integration
- `expo-notifications` - Push notifications (critical for fasting reminders)
- `@react-native-async-storage/async-storage` - Local data persistence

## Feature Implementation Notes

### Fasting Timer Implementation
- Use a combination of AsyncStorage for persistence and local state for real-time updates
- Implement background tasks carefully due to mobile OS limitations
- Consider using Expo Notifications for time-based reminders
- Store fasting start time as timestamp, calculate elapsed time on each render

### Data Persistence Strategy
- AsyncStorage for user preferences and fasting history
- Consider implementing a simple state management solution
- Ensure data persistence across app kills/restarts
- Plan for data export functionality (health app integration)

### Performance Considerations
- Use React.memo() for components that don't need frequent re-renders
- Implement proper cleanup for timers and intervals
- Optimize images using Expo's built-in image optimization
- Consider lazy loading for historical data views