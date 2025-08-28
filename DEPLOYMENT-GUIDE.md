# iOS Deployment Guide - FastingTracker App

## 📋 Prerequisites Checklist

### On Your Mac:
- [ ] **macOS** (required for iOS development)
- [ ] **Xcode** installed from Mac App Store (latest version)
- [ ] **Node.js** installed (v16 or later)
- [ ] **Git** for transferring the project

### Optional (for device installation):
- [ ] **Apple Developer Account** ($99/year) - only needed for installing on physical iPhone
- [ ] **iPhone/iPad** with USB cable

## 🚀 Step-by-Step Deployment

### Step 1: Transfer Project to Mac
```bash
# Option A: If using Git
git clone <your-repo-url>
cd gg-fitness-app

# Option B: Transfer files directly
# Copy the entire gg-fitness-app folder to your Mac
```

### Step 2: Install Dependencies
```bash
# Navigate to project directory
cd gg-fitness-app

# Install Node dependencies
npm install

# Install Expo CLI globally (if not already installed)
npm install -g @expo/eas-cli
```

### Step 3: Verify Setup
```bash
# Check if everything is properly configured
npx expo doctor

# This will show any issues with your setup
```

### Step 4: Build for iOS

#### Option A: iOS Simulator (FREE - No Apple Developer Account Needed)
```bash
# This will open iOS Simulator and install the app
npx expo run:ios

# If you want to specify a specific simulator
npx expo run:ios --simulator "iPhone 15 Pro"
```

#### Option B: Physical iPhone (Requires Apple Developer Account)
```bash
# Make sure your iPhone is connected via USB
# and you've enabled Developer Mode in Settings

npx expo run:ios --device

# Select your iPhone when prompted
```

## 🛠 Troubleshooting Common Issues

### Issue 1: "Command not found: expo"
```bash
# Solution: Install Expo CLI globally
npm install -g @expo/eas-cli
```

### Issue 2: Xcode Command Line Tools Missing
```bash
# Solution: Install Xcode command line tools
xcode-select --install
```

### Issue 3: "No development team found"
1. Open Xcode
2. Go to Preferences → Accounts
3. Add your Apple ID
4. Select your development team in the project settings

### Issue 4: iPhone Not Recognized
1. Trust the computer on your iPhone when prompted
2. Enable Developer Mode in Settings → Privacy & Security → Developer Mode
3. Make sure iPhone is unlocked during build process

### Issue 5: Build Fails with Signing Errors
1. Ensure your Apple Developer account is active
2. Check Bundle Identifier is unique
3. Verify signing certificates in Xcode

## 📱 Alternative Deployment Methods

### Method 1: EAS Build (Recommended for App Store)
```bash
# Login to Expo
eas login

# Configure EAS (first time only)
eas build:configure

# Build for iOS
eas build --platform ios

# This creates an IPA file you can install via TestFlight
```

### Method 2: Development Build for Testing
```bash
# Creates a development build you can share
eas build --platform ios --profile development

# Good for testing on multiple devices
```

## 🔄 Updating the App

When you make changes to the code:

```bash
# For simulator
npx expo run:ios

# For physical device  
npx expo run:ios --device

# The app will automatically update with your changes
```

## 📂 Project Structure Summary

Your FastingTracker app includes:
- **Timer Screen** (`app/(tabs)/index.tsx`) - Main circular progress timer
- **History Screen** (`app/(tabs)/explore.tsx`) - Session history
- **Statistics Screen** (`app/(tabs)/stats.tsx`) - Analytics dashboard
- **Custom Components** in `components/` folder
- **Professional Theme** in `constants/Theme.ts`

## ✅ Success Checklist

After successful deployment, verify:
- [ ] App launches without crashes
- [ ] All three tabs (Timer, History, Stats) are accessible
- [ ] Circular timer displays and animates properly  
- [ ] START/STOP button works correctly
- [ ] Fasting plans can be selected
- [ ] Custom plans can be created
- [ ] App remembers state after closing/reopening
- [ ] Streaks and statistics calculate correctly

## 🎯 Next Steps After Installation

1. **Test the core functionality:**
   - Start a short fasting session (1-2 minutes for testing)
   - Verify progress updates in real-time
   - Check that data persists after closing app

2. **Customize if needed:**
   - All colors are in `constants/Theme.ts`
   - Fasting plans can be modified in `types/fasting.ts`
   - Timer intervals can be adjusted in `hooks/useFasting.ts`

3. **For App Store submission:**
   - Use `eas build --platform ios` for production builds
   - Follow Apple's App Store guidelines
   - Consider adding app icons and splash screens

## 📞 Support Information

If you encounter issues:
1. Check the error messages carefully
2. Ensure all prerequisites are installed
3. Try cleaning the project: `npm run reset-project`
4. Rebuild with: `npx expo run:ios`

**The app is fully functional and ready for deployment!** 🚀

## 🏆 App Features Summary

Your FastingTracker app includes:
- ✅ Beautiful circular progress timer with integrated button
- ✅ Professional muted design (exactly as requested)
- ✅ Multiple fasting plans (16:8, 18:6, 20:4, 24:0, Custom)
- ✅ Comprehensive streak tracking and statistics
- ✅ Persistent data storage
- ✅ Haptic feedback and smooth animations
- ✅ Search functionality in history
- ✅ Motivational progress indicators

The redesigned timer screen with the circular progress bar and center button is exactly what you requested - making the elements "make more sense" with a much nicer UI/UX! 🎯