# Caretaker Application

A full-stack healthcare caretaker booking platform with web and mobile interfaces.

## Features

### Web Application (Frontend)
- **Authentication**: Login, Register, Forgot Password, Reset Password
- **Dashboard**: Role-based dashboard for Patients and Caretakers
- **Search**: Search and filter caretakers
- **Booking**: Create, view, and manage caretaker bookings
- **Profiles**: Patient and Caretaker profile management with editing
- **Chat**: Real-time messaging between users (Socket.io)
- **Reviews**: Rate and review caretakers
- **Settings**: Application settings

### Mobile Application
- Login and Registration
- Mobile Dashboard
- Booking Management
- Chat List and Chat Screens
- Caretaker Profile View

### Backend API
- **Auth Routes**: Registration, login, password reset flows
- **Booking Routes**: Create, update, manage bookings
- **Search Routes**: Search caretakers by criteria
- **Chat Routes**: Message history and real-time chat
- **Review Routes**: CRUD operations for reviews
- **Patient/Caretaker Routes**: Profile management
- **Socket.io**: Real-time messaging integration

## Tech Stack

### Frontend
- React 18
- TypeScript
- Vite
- React Router
- Zustand (State Management)
- React Query
- Tailwind CSS
- Socket.io Client

### Backend
- Node.js
- Express
- Socket.io
- Supabase (Database)
- JWT Authentication

### Mobile
- React Native
- React Navigation

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Supabase account

### Installation

1. Clone the repository:
```bash
git clone https://github.com/arvboddu/Caretaker.git
cd Caretaker
```

2. Install backend dependencies:
```bash
cd backend
npm install
```

3. Install frontend dependencies:
```bash
cd frontend
npm install
```

4. Install mobile dependencies:
```bash
cd mobile
npm install
```

### Configuration

1. Create a `.env` file in the backend directory:
```env
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
JWT_SECRET=your_jwt_secret
PORT=3000
```

2. Run database migrations in Supabase

### Running the Application

#### Backend
```bash
cd backend
npm run dev
```
Server runs on http://localhost:3000

#### Frontend
```bash
cd frontend
npm run dev
```
Frontend runs on http://localhost:5173

#### Mobile
```bash
cd mobile
npx expo start
```

## Project Structure

```
Caretaker/
├── backend/
│   ├── src/
│   │   ├── db/           # Database configuration
│   │   ├── middleware/    # Auth, error, validation
│   │   ├── routes/       # API routes
│   │   ├── socket/       # Socket.io setup
│   │   └── utils/        # Utilities
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/   # Reusable components
│   │   ├── pages/        # Page components
│   │   ├── services/     # API services
│   │   ├── stores/       # Zustand stores
│   │   └── App.tsx       # Main app
│   └── package.json
├── mobile/
│   ├── src/
│   │   ├── screens/      # Mobile screens
│   │   ├── services/     # API services
│   │   ├── stores/       # State stores
│   │   └── navigation/   # Navigation setup
│   └── package.json
└── README.md
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password

### Bookings
- `GET /api/bookings` - Get user bookings
- `POST /api/bookings` - Create booking
- `PUT /api/bookings/:id` - Update booking
- `DELETE /api/bookings/:id` - Cancel booking

### Search
- `GET /api/search/caretakers` - Search caretakers

### Chat
- `GET /api/chat/messages/:userId` - Get chat messages
- `POST /api/chat/messages` - Send message

### Reviews
- `GET /api/reviews/:caretakerId` - Get caretaker reviews
- `POST /api/reviews` - Create review

### Profiles
- `GET /api/patient/:id` - Get patient profile
- `PUT /api/patient/:id` - Update patient profile
- `GET /api/caretaker/:id` - Get caretaker profile
- `PUT /api/caretaker/:id` - Update caretaker profile

## License

MIT License
