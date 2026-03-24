# CareTaker Functional Use Cases

## Module 1: Authentication Module

### UC-AUTH-01: User Registration
- **Actors**: Patient, Caretaker
- **Trigger**: User clicks "Sign Up"
- **Preconditions**: None
- **Postconditions**: New user account created, verification email sent
- **Success Scenario**:
  1. User selects role (Patient/Caretaker)
  2. User enters email, password, full name
  3. User agrees to terms and conditions
  4. System validates email format and password strength
  5. System creates user record in database
  6. System sends verification email
  7. User receives confirmation of registration

### UC-AUTH-02: User Login
- **Actors**: Patient, Caretaker, Admin
- **Trigger**: User clicks "Login"
- **Preconditions**: User has registered account
- **Postconditions**: User authenticated, JWT token issued
- **Success Scenario**:
  1. User enters email and password
  2. System validates credentials
  3. System generates JWT token
  4. User redirected to role-specific dashboard

### UC-AUTH-03: Password Reset
- **Actors**: Patient, Caretaker, Admin
- **Trigger**: User clicks "Forgot Password"
- **Preconditions**: User has registered account
- **Postconditions**: Password reset email sent
- **Success Scenario**:
  1. User enters registered email
  2. System verifies email exists
  3. System generates reset token
  4. System sends reset link via email
  5. User clicks link, enters new password
  6. System updates password hash

---

## Module 2: Patient Module

### UC-PAT-01: Complete Patient Profile
- **Actors**: Patient
- **Trigger**: User completes registration
- **Preconditions**: User is logged in
- **Postconditions**: Patient profile complete with medical info
- **Success Scenario**:
  1. Patient enters contact information
  2. Patient enters address for caretaker matching
  3. Patient describes medical conditions
  4. Patient lists required services (mobility, medication, etc.)
  5. Patient sets care preferences (gender, language)
  6. Patient saves profile

### UC-PAT-02: Update Medical Information
- **Actors**: Patient
- **Trigger**: Patient needs to update medical info
- **Preconditions**: User is logged in as Patient
- **Postconditions**: Medical information updated
- **Success Scenario**:
  1. Patient navigates to profile settings
  2. Patient modifies medical conditions or services
  3. Patient saves changes
  4. System confirms update

### UC-PAT-03: View Caretaker Recommendations
- **Actors**: Patient
- **Trigger**: Patient requests recommendations
- **Preconditions**: Patient profile is complete
- **Postconditions**: Personalized caretaker list displayed
- **Success Scenario**:
  1. Patient views dashboard
  2. System analyzes patient needs and location
  3. System matches with qualified caretakers
  4. System displays top 5 recommended caretakers

---

## Module 3: Caretaker Module

### UC-CAR-01: Caretaker Onboarding
- **Actors**: Caretaker
- **Trigger**: Caretaker completes registration
- **Preconditions**: Caretaker account created
- **Postconditions**: Caretaker profile active with verified credentials
- **Success Scenario**:
  1. Caretaker enters personal information
  2. Caretaker selects skills and certifications
  3. Caretaker enters years of experience
  4. Caretaker sets hourly/daily rates
  5. Caretaker uploads certification documents
  6. Admin reviews and approves credentials
  7. Caretaker status changes to "Verified"

### UC-CAR-02: Set Availability Schedule
- **Actors**: Caretaker
- **Trigger**: Caretaker wants to update availability
- **Preconditions**: Caretaker is verified
- **Postconditions**: Calendar updated with available slots
- **Success Scenario**:
  1. Caretaker opens availability settings
  2. Caretaker selects days of week available
  3. Caretaker sets hours for each day
  4. Caretaker saves schedule
  5. System updates availability calendar

### UC-CAR-03: View Booking Requests
- **Actors**: Caretaker
- **Trigger**: Patient sends booking request
- **Preconditions**: Caretaker has available slots
- **Postconditions**: Caretaker reviews and responds to request
- **Success Scenario**:
  1. Caretaker receives notification
  2. Caretaker views patient profile and needs
  3. Caretaker accepts or declines request
  4. System notifies patient of response

---

## Module 4: Booking Module

### UC-BOOK-01: Search Caretakers
- **Actors**: Patient
- **Trigger**: Patient searches for caretaker
- **Preconditions**: Patient is logged in
- **Postconditions**: Search results displayed
- **Success Scenario**:
  1. Patient enters search criteria (skills, location)
  2. Patient applies filters (price, rating, availability)
  3. System queries database
  4. System returns sorted list of caretakers
  5. Patient can view profiles and book

### UC-BOOK-02: Create Booking Request
- **Actors**: Patient
- **Trigger**: Patient selects caretaker
- **Preconditions**: Caretaker has availability
- **Postconditions**: Booking request sent to caretaker
- **Success Scenario**:
  1. Patient views caretaker profile
  2. Patient selects date and time slot
  3. Patient adds service notes
  4. Patient confirms booking details
  5. System checks for time conflicts
  6. System creates booking request
  7. Caretaker receives notification

### UC-BOOK-03: Confirm Booking
- **Actors**: Caretaker
- **Trigger**: Caretaker receives booking request
- **Preconditions**: Booking request exists
- **Postconditions**: Booking confirmed or declined
- **Success Scenario**:
  1. Caretaker reviews patient profile
  2. Caretaker accepts or declines
  3. If accepted, system updates booking status
  4. Patient receives confirmation
  5. Both parties see booking in their calendars

### UC-BOOK-04: Cancel Booking
- **Actors**: Patient, Caretaker
- **Trigger**: User wants to cancel booking
- **Preconditions**: Active booking exists
- **Postconditions**: Booking cancelled, policy applied
- **Success Scenario**:
  1. User navigates to booking details
  2. User clicks "Cancel Booking"
  3. System displays cancellation policy
  4. User confirms cancellation
  5. System applies cancellation fee if applicable
  6. Other party notified
  7. Slot becomes available again

---

## Module 5: Chat Module

### UC-CHAT-01: Start Conversation
- **Actors**: Patient, Caretaker
- **Trigger**: User wants to message another user
- **Preconditions**: Users have matching booking
- **Postconditions**: Chat thread created
- **Success Scenario**:
  1. User opens chat from booking details
  2. System creates chat thread linked to booking
  3. Users can exchange messages
  4. Messages persist in database

### UC-CHAT-02: Send Message
- **Actors**: Patient, Caretaker
- **Trigger**: User types message
- **Preconditions**: Chat thread exists
- **Postconditions**: Message delivered and displayed
- **Success Scenario**:
  1. User types message
  2. User clicks send
  3. System stores message in database
  4. Socket.IO pushes message to recipient
  5. Recipient sees message in real-time

---

## Module 6: Reviews Module

### UC-REVIEW-01: Submit Rating
- **Actors**: Patient
- **Trigger**: Service is completed
- **Preconditions**: Booking marked as completed
- **Postconditions**: Rating and review saved
- **Success Scenario**:
  1. Patient receives prompt to review
  2. Patient selects 1-5 star rating
  3. Patient writes review comment
  4. Patient submits review
  5. System calculates new average rating
  6. Review appears on caretaker profile

### UC-REVIEW-02: View Caretaker Reviews
- **Actors**: Patient, Caretaker
- **Trigger**: User views caretaker profile
- **Preconditions**: Reviews exist for caretaker
- **Postconditions**: Reviews displayed with pagination
- **Success Scenario**:
  1. User navigates to caretaker profile
  2. User scrolls to reviews section
  3. System fetches reviews (paginated)
  4. User can see ratings and comments

---

## Module 7: Admin Module

### UC-ADMIN-01: Verify Caretaker
- **Actors**: Admin
- **Trigger**: New caretaker uploads documents
- **Preconditions**: Caretaker submitted for verification
- **Postconditions**: Caretaker verified or rejected
- **Success Scenario**:
  1. Admin reviews caretaker documents
  2. Admin verifies credentials
  3. Admin approves or rejects application
  4. Caretaker notified of decision

### UC-ADMIN-02: Manage Disputes
- **Actors**: Admin
- **Trigger**: User reports issue
- **Preconditions**: Dispute filed
- **Postconditions**: Dispute resolved
- **Success Scenario**:
  1. Admin reviews dispute details
  2. Admin contacts both parties
  3. Admin makes resolution decision
  4. Both parties notified
  5. Action taken if needed (refund, warning, suspension)

### UC-ADMIN-03: View Platform Analytics
- **Actors**: Admin
- **Trigger**: Admin wants platform insights
- **Preconditions**: Admin logged in
- **Postconditions**: Dashboard displays metrics
- **Success Scenario**:
  1. Admin opens admin dashboard
  2. System calculates metrics (bookings, revenue, users)
  3. Dashboard displays charts and summaries
  4. Admin can export reports
