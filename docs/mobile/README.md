# CareTaker Mobile App - React Native + Expo

## Overview

A React Native mobile app built with Expo that shares the same backend API as the web app.

## Tech Stack

- **Framework**: Expo SDK 50
- **Language**: TypeScript
- **Navigation**: React Navigation 6
- **State Management**: Zustand + React Query
- **Chat**: React Native Gifted Chat
- **HTTP Client**: Axios
- **Storage**: Expo Secure Store

## Features

- User authentication (login/register)
- Patient dashboard with caretaker recommendations
- Caretaker profiles with skills and availability
- Booking flow with date/time selection
- Real-time chat with Socket.IO
- Role-based navigation

## Project Structure

```
mobile/
├── src/
│   ├── screens/          # Screen components
│   │   ├── LoginScreen.tsx
│   │   ├── RegisterScreen.tsx
│   │   ├── DashboardScreen.tsx
│   │   ├── CaretakerProfileScreen.tsx
│   │   ├── BookingScreen.tsx
│   │   ├── ChatListScreen.tsx
│   │   └── ChatScreen.tsx
│   ├── navigation/       # Navigation setup
│   │   └── AppNavigator.tsx
│   ├── services/         # API services
│   │   ├── api.ts
│   │   ├── authService.ts
│   │   └── bookingService.ts
│   ├── stores/           # Zustand stores
│   │   └── authStore.ts
│   ├── contexts/         # React contexts
│   │   └── AuthContext.tsx
│   ├── types/            # TypeScript types
│   │   └── index.ts
│   └── utils/            # Utility functions
│       └── date.ts
├── assets/               # Images and icons
├── App.tsx               # Entry point
├── app.json             # Expo config
└── package.json
```

## Setup

### Prerequisites

- Node.js 18+
- Expo CLI (`npx expo`)
- iOS Simulator (Mac) or Android Emulator

### Installation

```bash
cd mobile
npm install
```

### Configuration

Create `mobile/.env`:

```env
EXPO_PUBLIC_API_URL=http://localhost:3000/api
```

### Running

```bash
# Development
npx expo start

# iOS (requires Mac)
npx expo run:ios

# Android
npx expo run:android
```

### Building for Production

```bash
# Build Android APK
eas build --platform android

# Build iOS (requires Mac)
eas build --platform ios
```

## Screens

| Screen | Description |
|--------|-------------|
| Login | Email/password login |
| Register | New user registration with role selection |
| Dashboard | Home screen with bookings and recommendations |
| Caretaker Profile | View caretaker details, skills, availability |
| Booking | Date/time selection and booking form |
| Chat List | All conversation threads |
| Chat | Individual chat conversation |

## API Integration

The mobile app uses the same backend API as the web app:

```
GET/POST /api/auth/login
GET/POST /api/auth/register
GET /api/bookings
POST /api/bookings
GET /api/caretakers/:id
GET /api/chat/threads
GET /api/chat/threads/:id/messages
POST /api/chat/threads/:id/messages
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| EXPO_PUBLIC_API_URL | Backend API URL |
