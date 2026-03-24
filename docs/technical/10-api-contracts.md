# CareTaker API Contract Specification

## Base URL
```
Development: http://localhost:3000/api
Production: https://api.caretaker.app/api
```

## Authentication
All protected routes require Bearer token in Authorization header:
```
Authorization: Bearer <jwt_token>
```

---

## Module 1: Authentication

### POST /auth/register
Register a new user (Patient or Caretaker).

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "fullName": "John Doe",
  "role": "patient" | "caretaker"
}
```

**Validation Rules:**
- `email`: Required, valid email format
- `password`: Required, min 8 chars, must contain uppercase, lowercase, number
- `fullName`: Required, 2-100 characters
- `role`: Required, enum ["patient", "caretaker"]

**Success Response (201):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "fullName": "John Doe",
      "role": "patient",
      "createdAt": "2024-01-15T10:30:00Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

**Error Responses:**
- 400: Validation error
- 409: Email already exists

---

### POST /auth/login
Authenticate user and receive JWT token.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "fullName": "John Doe",
      "role": "patient"
    },
    "token": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

**Error Responses:**
- 400: Validation error
- 401: Invalid credentials

---

### POST /auth/forgot-password
Request password reset email.

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Password reset email sent"
}
```

---

### POST /auth/reset-password
Reset password using token from email.

**Request Body:**
```json
{
  "token": "reset-token-from-email",
  "newPassword": "NewSecurePass123!"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Password reset successfully"
}
```

---

### POST /auth/logout
Logout user (invalidate token).

**Headers:** Authorization required

**Success Response (200):**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

## Module 2: Patients

### GET /patients/profile
Get current patient profile.

**Headers:** Authorization required (Patient role)

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "userId": "auth-uuid",
    "fullName": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "address": "123 Main St, City, State 12345",
    "latitude": 37.7749,
    "longitude": -122.4194,
    "medicalConditions": ["diabetes", "hypertension"],
    "requiredServices": ["medication_reminder", "mobility_assistance"],
    "carePreferences": {
      "gender": "any",
      "language": "english"
    },
    "emergencyContact": {
      "name": "Jane Doe",
      "phone": "+1234567891",
      "relationship": "spouse"
    },
    "profilePhoto": "https://storage.supabase.co/...",
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  }
}
```

---

### PUT /patients/profile
Update patient profile.

**Headers:** Authorization required (Patient role)

**Request Body:**
```json
{
  "phone": "+1234567890",
  "address": "456 Oak Ave, City, State 12345",
  "latitude": 37.7849,
  "longitude": -122.4094,
  "medicalConditions": ["diabetes", "heart_disease"],
  "requiredServices": ["medication_reminder", "physical_therapy"],
  "carePreferences": {
    "gender": "female",
    "language": "english"
  },
  "emergencyContact": {
    "name": "Jane Doe",
    "phone": "+1234567891",
    "relationship": "sister"
  }
}
```

**Success Response (200):**
```json
{
  "success": true,
  "data": { /* updated profile */ }
}
```

---

### POST /patients/upload-photo
Upload profile photo.

**Headers:** Authorization required (Patient role)
**Content-Type:** multipart/form-data

**Form Data:**
- `file`: Image file (max 5MB, jpg/png)

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "url": "https://storage.supabase.co/bucket/photo.jpg"
  }
}
```

---

### GET /patients/recommendations
Get recommended caretakers based on patient profile.

**Headers:** Authorization required (Patient role)

**Query Parameters:**
- `limit`: Number (default: 5, max: 20)
- `offset`: Number (default: 0)

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "caretakers": [
      {
        "id": "uuid",
        "fullName": "Jane Smith",
        "photo": "https://...",
        "rating": 4.8,
        "reviewCount": 127,
        "hourlyRate": 25,
        "skills": ["elder_care", "medication_reminder"],
        "distance": 2.5,
        "availableToday": true
      }
    ],
    "total": 45,
    "limit": 5,
    "offset": 0
  }
}
```

---

## Module 3: Caretakers

### GET /caretakers/profile
Get current caretaker profile.

**Headers:** Authorization required (Caretaker role)

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "userId": "auth-uuid",
    "fullName": "Jane Smith",
    "email": "jane@example.com",
    "phone": "+1234567890",
    "bio": "Experienced caretaker with 5+ years...",
    "skills": [
      {
        "id": "uuid",
        "name": "Elder Care",
        "slug": "elder_care"
      }
    ],
    "yearsExperience": 5,
    "hourlyRate": 25,
    "dailyRate": 180,
    "serviceRadius": 15,
    "certifications": [
      {
        "id": "uuid",
        "name": "CPR Certified",
        "documentUrl": "https://..."
      }
    ],
    "availability": {
      "monday": { "start": "09:00", "end": "17:00" },
      "tuesday": { "start": "09:00", "end": "17:00" },
      "wednesday": { "start": "09:00", "end": "17:00" },
      "thursday": { "start": "09:00", "end": "17:00" },
      "friday": { "start": "09:00", "end": "17:00" },
      "saturday": null,
      "sunday": null
    },
    "profilePhoto": "https://...",
    "status": "verified",
    "rating": 4.8,
    "reviewCount": 127,
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

---

### PUT /caretakers/profile
Update caretaker profile.

**Headers:** Authorization required (Caretaker role)

**Request Body:**
```json
{
  "phone": "+1234567890",
  "bio": "Updated bio...",
  "skills": ["elder_care", "physical_therapy"],
  "yearsExperience": 6,
  "hourlyRate": 28,
  "dailyRate": 200,
  "serviceRadius": 20
}
```

**Success Response (200):**
```json
{
  "success": true,
  "data": { /* updated profile */ }
}
```

---

### PUT /caretakers/availability
Update caretaker availability schedule.

**Headers:** Authorization required (Caretaker role)

**Request Body:**
```json
{
  "availability": {
    "monday": { "start": "08:00", "end": "18:00" },
    "tuesday": { "start": "08:00", "end": "18:00" },
    "wednesday": null,
    "thursday": { "start": "08:00", "end": "18:00" },
    "friday": { "start": "08:00", "end": "18:00" },
    "saturday": { "start": "10:00", "end": "14:00" },
    "sunday": null
  }
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Availability updated"
}
```

---

### POST /caretakers/upload-certification
Upload certification document.

**Headers:** Authorization required (Caretaker role)
**Content-Type:** multipart/form-data

**Form Data:**
- `file`: PDF/JPG file (max 10MB)
- `name`: Certification name (e.g., "CPR Certificate")

**Success Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "CPR Certificate",
    "documentUrl": "https://storage.supabase.co/...",
    "status": "pending_review"
  }
}
```

---

### GET /caretakers/:id
Get caretaker public profile.

**Headers:** None required

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "fullName": "Jane Smith",
    "bio": "Experienced caretaker...",
    "skills": [...],
    "yearsExperience": 5,
    "hourlyRate": 25,
    "certifications": [...],
    "availability": {...},
    "profilePhoto": "https://...",
    "rating": 4.8,
    "reviewCount": 127,
    "reviews": [
      {
        "id": "uuid",
        "rating": 5,
        "comment": "Excellent care...",
        "patientName": "John D.",
        "createdAt": "2024-01-10T..."
      }
    ]
  }
}
```

---

## Module 4: Bookings

### POST /bookings
Create a new booking request.

**Headers:** Authorization required (Patient role)

**Request Body:**
```json
{
  "caretakerId": "uuid",
  "date": "2024-01-20",
  "startTime": "10:00",
  "duration": 2,
  "serviceNotes": "Need help with medication management",
  "address": "123 Main St, Apt 4B",
  "specialInstructions": "Ring doorbell twice"
}
```

**Validation Rules:**
- `caretakerId`: Required, valid caretaker UUID
- `date`: Required, future date, YYYY-MM-DD format
- `startTime`: Required, HH:mm format
- `duration`: Required, 1-12 hours
- `address`: Required, max 500 characters

**Success Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "patientId": "uuid",
    "caretakerId": "uuid",
    "date": "2024-01-20",
    "startTime": "10:00",
    "endTime": "12:00",
    "duration": 2,
    "hourlyRate": 25,
    "totalAmount": 50,
    "status": "pending",
    "serviceNotes": "Need help with medication management",
    "address": "123 Main St, Apt 4B",
    "specialInstructions": "Ring doorbell twice",
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

**Error Responses:**
- 400: Validation error, time conflict
- 404: Caretaker not found

---

### GET /bookings
Get bookings for current user.

**Headers:** Authorization required

**Query Parameters:**
- `status`: Filter by status (pending, accepted, declined, completed, cancelled)
- `role`: "patient" | "caretaker" (defaults to user's role)
- `fromDate`: Start date filter (YYYY-MM-DD)
- `toDate`: End date filter (YYYY-MM-DD)
- `limit`: Number (default: 20)
- `offset`: Number (default: 0)

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "bookings": [
      {
        "id": "uuid",
        "patient": {
          "id": "uuid",
          "fullName": "John Doe",
          "phone": "+1234567890",
          "profilePhoto": "https://..."
        },
        "caretaker": {
          "id": "uuid",
          "fullName": "Jane Smith",
          "phone": "+1234567891",
          "profilePhoto": "https://..."
        },
        "date": "2024-01-20",
        "startTime": "10:00",
        "endTime": "12:00",
        "duration": 2,
        "totalAmount": 50,
        "status": "pending",
        "serviceNotes": "Need help with medication management",
        "address": "123 Main St, Apt 4B",
        "createdAt": "2024-01-15T10:30:00Z"
      }
    ],
    "total": 45,
    "limit": 20,
    "offset": 0
  }
}
```

---

### GET /bookings/:id
Get booking details.

**Headers:** Authorization required (must be patient or caretaker on booking)

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "patient": {...},
    "caretaker": {...},
    "date": "2024-01-20",
    "startTime": "10:00",
    "endTime": "12:00",
    "duration": 2,
    "hourlyRate": 25,
    "totalAmount": 50,
    "status": "accepted",
    "serviceNotes": "...",
    "address": "...",
    "specialInstructions": "...",
    "chatId": "uuid",
    "createdAt": "...",
    "updatedAt": "..."
  }
}
```

---

### PATCH /bookings/:id/status
Update booking status.

**Headers:** Authorization required

**Request Body:**
```json
{
  "status": "accepted" | "declined" | "completed" | "cancelled",
  "reason": "Optional reason for decline/cancellation"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "status": "accepted",
    "updatedAt": "2024-01-15T11:00:00Z"
  }
}
```

**Error Responses:**
- 400: Invalid status transition
- 403: Not authorized to update this booking
- 409: Booking conflict

---

### GET /bookings/availability/:caretakerId
Get caretaker availability for a date range.

**Headers:** None required

**Query Parameters:**
- `fromDate`: Start date (YYYY-MM-DD)
- `toDate`: End date (YYYY-MM-DD, max 30 days from fromDate)

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "caretakerId": "uuid",
    "availability": [
      {
        "date": "2024-01-20",
        "slots": [
          { "start": "09:00", "end": "11:00", "available": false },
          { "start": "11:00", "end": "13:00", "available": true },
          { "start": "13:00", "end": "15:00", "available": true }
        ]
      }
    ]
  }
}
```

---

## Module 5: Chat

### POST /chat/threads
Create or get chat thread for booking.

**Headers:** Authorization required

**Request Body:**
```json
{
  "bookingId": "uuid"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "bookingId": "uuid",
    "participants": ["patient-uuid", "caretaker-uuid"],
    "lastMessage": {
      "content": "See you tomorrow!",
      "senderId": "patient-uuid",
      "createdAt": "2024-01-15T15:00:00Z"
    },
    "createdAt": "2024-01-14T10:00:00Z"
  }
}
```

---

### GET /chat/threads
Get all chat threads for current user.

**Headers:** Authorization required

**Query Parameters:**
- `limit`: Number (default: 20)
- `offset`: Number (default: 0)

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "threads": [
      {
        "id": "uuid",
        "otherUser": {
          "id": "uuid",
          "fullName": "Jane Smith",
          "profilePhoto": "https://..."
        },
        "lastMessage": {
          "content": "See you tomorrow!",
          "createdAt": "2024-01-15T15:00:00Z"
        },
        "unreadCount": 2
      }
    ],
    "total": 5
  }
}
```

---

### GET /chat/threads/:threadId/messages
Get messages in a thread.

**Headers:** Authorization required

**Query Parameters:**
- `limit`: Number (default: 50)
- `before`: Message ID for pagination (gets messages before this ID)

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "messages": [
      {
        "id": "uuid",
        "content": "Hi Jane!",
        "senderId": "patient-uuid",
        "createdAt": "2024-01-15T10:00:00Z",
        "status": "read"
      },
      {
        "id": "uuid",
        "content": "Hello! Looking forward to helping.",
        "senderId": "caretaker-uuid",
        "createdAt": "2024-01-15T10:05:00Z",
        "status": "read"
      }
    ],
    "hasMore": true
  }
}
```

---

### POST /chat/threads/:threadId/messages
Send a message (also available via Socket.IO).

**Headers:** Authorization required

**Request Body:**
```json
{
  "content": "See you tomorrow at 10!"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "content": "See you tomorrow at 10!",
    "senderId": "patient-uuid",
    "createdAt": "2024-01-15T15:00:00Z",
    "status": "sent"
  }
}
```

---

## Module 6: Reviews

### POST /reviews
Submit a review for completed booking.

**Headers:** Authorization required (Patient role)

**Request Body:**
```json
{
  "bookingId": "uuid",
  "rating": 5,
  "comment": "Jane was amazing! Very patient and professional."
}
```

**Validation Rules:**
- `bookingId`: Required, must be completed booking owned by user
- `rating`: Required, integer 1-5
- `comment`: Optional, max 1000 characters

**Success Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "bookingId": "uuid",
    "caretakerId": "uuid",
    "patientId": "uuid",
    "rating": 5,
    "comment": "Jane was amazing! Very patient and professional.",
    "createdAt": "2024-01-15T16:00:00Z"
  }
}
```

**Error Responses:**
- 400: Booking not completed, review already exists
- 403: Not authorized
- 404: Booking not found

---

### GET /reviews/caretaker/:caretakerId
Get reviews for a caretaker.

**Headers:** None required

**Query Parameters:**
- `limit`: Number (default: 10)
- `offset`: Number (default: 0)

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "reviews": [
      {
        "id": "uuid",
        "rating": 5,
        "comment": "Excellent care...",
        "patient": {
          "id": "uuid",
          "fullName": "John D.",
          "profilePhoto": "https://..."
        },
        "createdAt": "2024-01-10T..."
      }
    ],
    "averageRating": 4.8,
    "total": 127,
    "limit": 10,
    "offset": 0
  }
}
```

---

## Module 7: Search

### GET /search/caretakers
Search and filter caretakers.

**Headers:** Authorization required (Patient role)

**Query Parameters:**
- `q`: Search query (name, skills)
- `skills`: Comma-separated skill slugs
- `minPrice`: Minimum hourly rate
- `maxPrice`: Maximum hourly rate
- `minRating`: Minimum rating (1-5)
- `availableOn`: Date (YYYY-MM-DD)
- `distance`: Max distance in miles
- `sortBy`: "rating" | "price_low" | "price_high" | "distance" (default: rating)
- `limit`: Number (default: 20)
- `offset`: Number (default: 0)

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "caretakers": [
      {
        "id": "uuid",
        "fullName": "Jane Smith",
        "photo": "https://...",
        "bio": "Experienced caretaker...",
        "rating": 4.8,
        "reviewCount": 127,
        "hourlyRate": 25,
        "skills": ["elder_care", "medication_reminder"],
        "distance": 2.5,
        "availableOn": "2024-01-20"
      }
    ],
    "total": 45,
    "filters": {
      "skills": ["elder_care"],
      "priceRange": { "min": 20, "max": 30 },
      "minRating": 4.5
    }
  }
}
```

---

## Common Error Response Format

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": [
      {
        "field": "email",
        "message": "Invalid email format"
      }
    ]
  }
}
```

## Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| VALIDATION_ERROR | 400 | Input validation failed |
| UNAUTHORIZED | 401 | Missing or invalid token |
| FORBIDDEN | 403 | Not allowed to access resource |
| NOT_FOUND | 404 | Resource not found |
| CONFLICT | 409 | Resource conflict (e.g., email exists) |
| TIME_CONFLICT | 409 | Booking time conflict |
| INTERNAL_ERROR | 500 | Server error |
