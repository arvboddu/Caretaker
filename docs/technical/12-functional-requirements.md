# CareTaker Functional Requirements Document

---

## 1. Introduction

### 1.1 Purpose
This document defines the functional requirements for the CareTaker platform, a direct connection service between patients needing care and professional caretakers.

### 1.2 Scope
The CareTaker platform enables patients to discover, book, and communicate with verified caretakers for in-home care services.

---

## 2. User Roles & Permissions

### 2.1 Role Matrix

| Feature | Patient | Caretaker | Admin |
|---------|---------|-----------|-------|
| Register/Login | ✅ | ✅ | ❌ |
| View Caretaker Profiles | ✅ | ✅ | ✅ |
| Book Services | ✅ | ❌ | ❌ |
| Offer Services | ❌ | ✅ | ❌ |
| Manage Own Bookings | ✅ | ✅ | ✅ |
| Send Messages | ✅ | ✅ | ✅ |
| Receive Messages | ✅ | ✅ | ✅ |
| Submit Reviews | ✅ | ❌ | ❌ |
| View Own Reviews | ✅ | ✅ | ✅ |
| Manage All Bookings | ❌ | ❌ | ✅ |
| Verify Caretakers | ❌ | ❌ | ✅ |
| Manage Users | ❌ | ❌ | ✅ |
| View Analytics | ❌ | ✅ (own) | ✅ |

---

## 3. Feature Requirements

### 3.1 Authentication Module

#### FR-AUTH-001: User Registration
- **Description**: Users can register as Patient or Caretaker
- **Inputs**: Email, password, full name, role selection
- **Processing**:
  1. Validate email format and password strength
  2. Check for existing email
  3. Hash password using bcrypt (12 rounds)
  4. Create user record
  5. Create role-specific profile (patient/caretaker)
  6. Send verification email
- **Outputs**: User account, JWT token
- **Business Rules**:
  - Password minimum 8 characters with uppercase, lowercase, number
  - Email must be unique
  - Initial role cannot be changed after registration

#### FR-AUTH-002: User Login
- **Description**: Authenticated access to platform
- **Inputs**: Email, password
- **Processing**:
  1. Find user by email
  2. Compare password hash
  3. Generate JWT token (24-hour expiry)
  4. Return user data and token
- **Outputs**: JWT token, user profile
- **Business Rules**:
  - 5 failed attempts = 15-minute lockout
  - Token required for all protected routes

#### FR-AUTH-003: Password Reset
- **Description**: Recover account access
- **Processing**:
  1. Generate reset token (1-hour expiry)
  2. Send reset email
  3. Validate token on reset attempt
  4. Update password hash
- **Business Rules**:
  - Token single-use
  - Cannot reuse previous password

---

### 3.2 Patient Module

#### FR-PAT-001: Profile Management
- **Description**: Manage patient profile and care needs
- **Fields**:
  - Contact info (phone, address, GPS coordinates)
  - Medical conditions (multi-select)
  - Required services (multi-select)
  - Care preferences (gender, language)
  - Emergency contact information
- **Business Rules**:
  - Address required for caretaker matching
  - At least one service required

#### FR-PAT-002: Caretaker Recommendations
- **Description**: AI-powered caretaker matching
- **Algorithm**:
  1. Match required services to caretaker skills
  2. Calculate distance from patient address
  3. Filter by availability on requested date
  4. Sort by rating and review count
  5. Return top 5 matches
- **Business Rules**:
  - Only verified caretakers recommended
  - Maximum 50-mile radius

---

### 3.3 Caretaker Module

#### FR-CAR-001: Onboarding Flow
- **Description**: Complete caretaker profile setup
- **Required Steps**:
  1. Personal information (phone, bio)
  2. Skills selection (minimum 1)
  3. Pricing setup (hourly rate required)
  4. Document upload (ID + at least one certification)
  5. Availability configuration
- **Business Rules**:
  - Profile incomplete = "pending" status
  - Cannot receive bookings until "verified"
  - Admin review required for verification

#### FR-CAR-002: Availability Management
- **Description**: Set weekly recurring availability
- **Fields**: Day of week, start time, end time
- **Business Rules**:
  - Cannot set availability in the past
  - Minimum 4-hour blocks
  - Automatically updates booking availability

#### FR-CAR-003: Booking Requests
- **Description**: Accept or decline booking requests
- **Actions**: Accept, Decline (with reason)
- **Business Rules**:
  - Must respond within 24 hours
  - Auto-decline after 48 hours if no response
  - Declined bookings notify patient immediately

---

### 3.4 Booking Module

#### FR-BOOK-001: Create Booking
- **Description**: Patient requests caretaker service
- **Inputs**:
  - Caretaker selection
  - Date and time
  - Duration (1-12 hours)
  - Service notes
  - Address
  - Special instructions
- **Processing**:
  1. Validate caretaker availability
  2. Check for time conflicts
  3. Calculate total amount
  4. Create booking record
  5. Notify caretaker
- **Business Rules**:
  - Cannot book past dates
  - Cannot book during existing bookings
  - Minimum 2-hour notice before service
  - Maximum 30 days in advance

#### FR-BOOK-002: Booking Status Flow
```
PENDING → ACCEPTED → ACTIVE → COMPLETED
    ↓         ↓
DECLINED  CANCELLED
```
- **PENDING**: Awaiting caretaker response
- **ACCEPTED**: Caretaker confirmed
- **ACTIVE**: Service in progress (auto-transition at start time)
- **COMPLETED**: Service finished
- **DECLINED**: Caretaker declined
- **CANCELLED**: Either party cancelled

#### FR-BOOK-003: Cancellation Policy
- **Free Cancellation**: 24+ hours before service
- **50% Refund**: 12-24 hours before
- **No Refund**: <12 hours before
- **Business Rules**:
  - Cancelled bookings notify both parties
  - Cancellation reason required
  - 3 cancellations in 30 days = warning

#### FR-BOOK-004: Time Conflict Prevention
- **Description**: Prevent double-booking
- **Validation**: Query existing bookings for caretaker
- **Conflict Check**:
  1. Same date?
  2. Time range overlap?
  3. If yes to both = conflict error

---

### 3.5 Chat Module

#### FR-CHAT-001: Real-time Messaging
- **Description**: In-app chat between patient and caretaker
- **Features**:
  - Text messages
  - Message status (sent, delivered, read)
  - Typing indicators
  - Unread count badges
- **Technical Requirements**:
  - Socket.IO for real-time
  - Supabase for persistence
  - Reconnection handling

#### FR-CHAT-002: Chat Thread Management
- **Description**: Automatic thread creation per booking
- **Business Rules**:
  - One thread per booking
  - Thread accessible to both parties
  - Messages retained indefinitely

---

### 3.6 Reviews Module

#### FR-REV-001: Submit Review
- **Description**: Patient rates completed service
- **Inputs**: Rating (1-5 stars), comment (optional)
- **Business Rules**:
  - Only after booking marked "completed"
  - One review per booking
  - 14-day window to submit
  - Rating updates caretaker's average

#### FR-REV-002: View Reviews
- **Description**: Public review display
- **Features**:
  - Average rating display
  - Paginated review list
  - Reviewer name (first name + last initial)
- **Business Rules**:
  - Sorted by newest first
  - 10 reviews per page

---

### 3.7 Search Module

#### FR-SEARCH-001: Caretaker Search
- **Description**: Find caretakers with filters
- **Filters**:
  - Skills (multi-select)
  - Price range (min/max)
  - Minimum rating
  - Available on specific date
  - Distance from patient
- **Sorting Options**:
  - Highest rated
  - Lowest price
  - Highest price
  - Nearest distance
- **Business Rules**:
  - Only verified caretakers shown
  - Results limited to 100 per query
  - Must include location for distance sorting

---

### 3.8 Admin Module

#### FR-ADMIN-001: Caretaker Verification
- **Description**: Review and approve caretaker applications
- **Actions**: Approve, Reject (with reason)
- **Business Rules**:
  - Requires uploaded documents
  - Rejection notification with reason
  - 48-hour review target

#### FR-ADMIN-002: User Management
- **Description**: View and manage user accounts
- **Actions**: View details, Suspend, Delete
- **Business Rules**:
  - Suspicious activity review
  - Deleted users = hard delete after 30 days
  - Suspended users cannot login

#### FR-ADMIN-003: Booking Oversight
- **Description**: View all platform bookings
- **Features**: Filter, search, export
- **Business Rules**:
  - Cannot modify active bookings
  - Can cancel with reason

#### FR-ADMIN-004: Analytics Dashboard
- **Metrics**:
  - Total users (patients/caretakers)
  - Active bookings (this week/month)
  - Revenue (this week/month)
  - Average rating
  - Top skills
- **Business Rules**: Data retention 12 months

---

## 4. Data Validation Rules

### 4.1 Input Validation

| Field | Type | Min | Max | Format |
|-------|------|-----|-----|--------|
| Email | String | - | 255 | email@domain.com |
| Password | String | 8 | 128 | Alphanumeric + symbols |
| Full Name | String | 2 | 100 | Letters and spaces |
| Phone | String | 10 | 20 | +country code |
| Address | String | 5 | 500 | Free text |
| Bio | String | 50 | 1000 | Free text |
| Hourly Rate | Number | 10 | 100 | USD |
| Rating | Number | 1 | 5 | Integer |
| Comment | String | 0 | 1000 | Free text |

### 4.2 Business Rule Validation

| Rule | Error Message |
|------|---------------|
| Email exists | "An account with this email already exists" |
| Invalid credentials | "Invalid email or password" |
| Booking conflict | "This time slot is no longer available" |
| Self-booking | "You cannot book yourself" |
| Past date booking | "Cannot book services in the past" |
| Incomplete profile | "Please complete your profile first" |
| Unverified caretaker | "This caretaker is not yet verified" |

---

## 5. Non-Functional Requirements

### 5.1 Performance
- Page load time: < 3 seconds
- API response time: < 500ms
- Real-time message delivery: < 1 second
- Support 100 concurrent users (MVP)

### 5.2 Security
- Password hashing: bcrypt (12 rounds)
- JWT expiry: 24 hours
- HTTPS required
- Input sanitization on all endpoints
- SQL injection prevention via parameterized queries
- XSS prevention via output encoding

### 5.3 Availability
- Target uptime: 99.5%
- Planned maintenance: Off-peak hours
- Error handling: Graceful degradation

### 5.4 Scalability
- Support 10,000 users without architecture changes
- Database sharding ready
- Stateless server design

---

## 6. Use Case Implementation Matrix

| UC-ID | Use Case | FR Reference | Priority |
|-------|----------|--------------|----------|
| UC-AUTH-01 | Register | FR-AUTH-001 | P0 |
| UC-AUTH-02 | Login | FR-AUTH-002 | P0 |
| UC-AUTH-03 | Password Reset | FR-AUTH-003 | P1 |
| UC-PAT-01 | Patient Profile | FR-PAT-001 | P0 |
| UC-PAT-02 | Recommendations | FR-PAT-002 | P1 |
| UC-CAR-01 | Caretaker Onboarding | FR-CAR-001 | P0 |
| UC-CAR-02 | Set Availability | FR-CAR-002 | P0 |
| UC-CAR-03 | Booking Requests | FR-CAR-003 | P0 |
| UC-BOOK-01 | Search | FR-SEARCH-001 | P0 |
| UC-BOOK-02 | Create Booking | FR-BOOK-001 | P0 |
| UC-BOOK-03 | Confirm Booking | FR-BOOK-002 | P0 |
| UC-BOOK-04 | Cancel Booking | FR-BOOK-003 | P0 |
| UC-CHAT-01 | Send Message | FR-CHAT-001 | P0 |
| UC-CHAT-02 | Typing Indicator | FR-CHAT-001 | P1 |
| UC-REVIEW-01 | Submit Review | FR-REV-001 | P1 |
| UC-REVIEW-02 | View Reviews | FR-REV-002 | P0 |
| UC-ADMIN-01 | Verify Caretaker | FR-ADMIN-001 | P0 |
| UC-ADMIN-02 | Manage Users | FR-ADMIN-002 | P1 |
| UC-ADMIN-03 | View Analytics | FR-ADMIN-004 | P2 |

**Priority**: P0 = Critical, P1 = Important, P2 = Nice-to-have
