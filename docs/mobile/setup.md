# Mobile App Setup

## Quick Start

### 1. Install Dependencies

```bash
cd mobile
npm install
```

### 2. Configure API URL

Create `mobile/.env`:

```env
EXPO_PUBLIC_API_URL=http://localhost:3000/api
```

For production, use your deployed backend URL:

```env
EXPO_PUBLIC_API_URL=https://api.caretaker.app/api
```

### 3. Start Development

```bash
npx expo start
```

This will show a QR code. Scan with Expo Go app on your phone, or press `i` for iOS simulator, `a` for Android emulator.

## Platform-Specific Setup

### iOS (Mac required)

```bash
# Install CocoaPods
cd ios && pod install && cd ..

# Run on iOS Simulator
npx expo run:ios
```

### Android

```bash
# Run on Android Emulator
npx expo run:android
```

## Building for App Store

### Android (Google Play)

```bash
# Configure EAS Build
eas build --platform android
```

### iOS (App Store)

```bash
# Configure EAS Build
eas build --platform ios

# Submit to App Store
eas submit --platform ios
```

## Testing

### Manual Testing Checklist

- [ ] Login works
- [ ] Registration works
- [ ] Dashboard loads data
- [ ] Caretaker profiles load
- [ ] Booking flow completes
- [ ] Chat messages send/receive
- [ ] Navigation works correctly

## Troubleshooting

### Metro Bundler Issues

```bash
# Clear cache
npx expo start --clear
```

### Native Module Issues

```bash
# Reinstall dependencies
rm -rf node_modules
npm install
```

### Socket.IO Not Connecting

1. Check if backend is running
2. Verify API URL in `.env`
3. Check network permissions on device
