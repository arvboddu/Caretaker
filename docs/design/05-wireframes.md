# CareTaker Wireframes

## Screen 1: Login Screen

### Layout Structure
```
┌─────────────────────────────┐
│         [Logo]              │
│       CareTaker             │
│                             │
│  ┌─────────────────────┐    │
│  │  Email               │    │
│  └─────────────────────┘    │
│                             │
│  ┌─────────────────────┐    │
│  │  Password            │    │
│  └─────────────────────┘    │
│                             │
│  ┌─────────────────────┐    │
│  │      LOGIN          │    │
│  └─────────────────────┘    │
│                             │
│  Forgot Password?           │
│                             │
│  ─────── OR ───────         │
│                             │
│  ┌─────────────────────┐    │
│  │   Sign Up           │    │
│  └─────────────────────┘    │
│                             │
└─────────────────────────────┘
```

### Elements
- **Logo**: CareTaker logo centered at top
- **Email Input**: Text field with email icon, placeholder "Enter your email"
- **Password Input**: Password field with lock icon, placeholder "Enter password"
- **Login Button**: Primary button, full width, teal background
- **Forgot Link**: Text link, secondary color
- **Divider**: Horizontal line with "OR" text
- **Sign Up Button**: Secondary button, outlined style

### Interactions
- **Login Button**: Validates inputs, shows loading spinner, navigates to dashboard
- **Forgot Password**: Opens modal or navigates to reset password page
- **Sign Up**: Navigates to role selection (Patient/Caretaker)

---

## Screen 2: Patient Dashboard

### Layout Structure
```
┌─────────────────────────────┐
│ ☰  CareTaker    [Bell] [👤] │
├─────────────────────────────┤
│                             │
│  Welcome back, [Name]       │
│  [Search caretakers...]     │
│                             │
│  ─────────────────────────  │
│  Upcoming Bookings          │
│  ┌───────┐ ┌───────┐       │
│  │ 📅    │ │ 📅    │       │
│  │ Mon   │ │ Wed   │       │
│  │ 3:00p │ │ 10:00a│       │
│  └───────┘ └───────┘       │
│                             │
│  ─────────────────────────  │
│  Recommended for You        │
│  ┌─────────────────────┐    │
│  │ [Photo] Jane Doe     │    │
│  │ ⭐ 4.8  |  $25/hr   │    │
│  │ Elder Care, Meds    │    │
│  └─────────────────────┘    │
│  ┌─────────────────────┐    │
│  │ [Photo] Mike Smith   │    │
│  │ ⭐ 4.9  |  $30/hr   │    │
│  │ Physical Therapy    │    │
│  └─────────────────────┘    │
│                             │
│  ─────────────────────────  │
│  Recent Messages            │
│  ┌─────────────────────┐    │
│  │ Jane: See you Monday│    │
│  └─────────────────────┘    │
│                             │
├─────────────────────────────┤
│ [🏠] [📅] [💬] [⭐] [👤]     │
└─────────────────────────────┘
```

### Elements
- **Header**: Logo, notification bell (with badge), profile avatar
- **Welcome Banner**: Personalized greeting with name
- **Search Bar**: Full-width input with search icon
- **Upcoming Bookings Card**: Horizontal scrollable cards
- **Recommended Caretakers**: Vertical list of caretaker cards
- **Recent Messages**: List of latest chat previews
- **Bottom Navigation**: 5 tabs (Home, Bookings, Chat, Reviews, Profile)

### Interactions
- **Search**: Expands to full search page with filters
- **Booking Card**: Taps to view booking details
- **Caretaker Card**: Taps to view caretaker profile
- **Message**: Taps to open chat thread
- **Bottom Nav**: Switches between tabs with slide animation

---

## Screen 3: Caretaker Dashboard

### Layout Structure
```
┌─────────────────────────────┐
│ ☰  CareTaker    [Bell] [👤] │
├─────────────────────────────┤
│                             │
│  Hi, [Name]! 👋             │
│  You have 3 pending requests│
│                             │
│  ─────────────────────────  │
│  Today's Schedule           │
│  ┌─────────────────────┐    │
│  │ 10:00 AM            │    │
│  │ Mrs. Margaret Chen  │    │
│  │ 2 hrs  •  $60       │    │
│  └─────────────────────┘    │
│  ┌─────────────────────┐    │
│  │ 3:00 PM             │    │
│  │ Mr. Robert Johnson  │    │
│  │ 1 hr   •  $30       │    │
│  └─────────────────────┘    │
│                             │
│  ─────────────────────────  │
│  Pending Requests           │
│  ┌─────────────────────┐    │
│  │ [Photo] New Request │    │
│  │ Tomorrow, 2 hrs     │    │
│  │ [Accept] [Decline]  │    │
│  └─────────────────────┘    │
│                             │
│  ─────────────────────────  │
│  This Week: $425 earned      │
│  ████████░░░░░░░░ 75% of $566│
│                             │
├─────────────────────────────┤
│ [🏠] [📅] [💬] [📊] [👤]     │
└─────────────────────────────┘
```

### Elements
- **Header**: Menu icon, logo, notification bell, profile avatar
- **Welcome Section**: Greeting with pending request count
- **Schedule Cards**: Time-blocked appointment cards
- **Request Cards**: Accept/Decline action buttons
- **Earnings Bar**: Progress bar toward weekly goal

### Interactions
- **Accept/Decline**: Quick action buttons with confirmation
- **Schedule Card**: Tap to view full booking details
- **Earnings**: Tap to view detailed earnings page

---

## Screen 4: Caretaker Profile

### Layout Structure
```
┌─────────────────────────────┐
│ ← Back            [Share]   │
├─────────────────────────────┤
│                             │
│        [Large Photo]        │
│                             │
│  Jane Doe                   │
│  ⭐⭐⭐⭐⭐ (127 reviews)      │
│                             │
│  [$25/hr] [Available Today] │
│                             │
│  [Message]  [Book Now]     │
│                             │
│  ─────────────────────────  │
│  About                      │
│  I'm a certified nursing    │
│  assistant with 5 years... │
│                             │
│  ─────────────────────────  │
│  Skills & Certifications    │
│  ┌─────────┐ ┌─────────┐   │
│  │Elder Care│ │ Meds    │   │
│  └─────────┘ └─────────┘   │
│  ┌─────────┐ ┌─────────┐   │
│  │CPR Cert │ │ First Aid│   │
│  └─────────┘ └─────────┘   │
│                             │
│  ─────────────────────────  │
│  Availability               │
│  [Calendar Grid]            │
│                             │
│  ─────────────────────────  │
│  Reviews (127)              │
│  ┌─────────────────────┐    │
│  │ ⭐⭐⭐⭐⭐  "Amazing..." │    │
│  │ - Margaret C.       │    │
│  └─────────────────────┘    │
│                             │
└─────────────────────────────┘
```

### Elements
- **Hero Photo**: Large circular profile image
- **Name & Rating**: Star rating with review count
- **Price & Status**: Hourly rate, availability badge
- **Action Buttons**: Message (outlined), Book Now (primary)
- **About Section**: Bio text
- **Skills Tags**: Pill-shaped skill badges
- **Availability Calendar**: Weekly calendar grid
- **Reviews Section**: Paginated review list

### Interactions
- **Message**: Opens chat thread with caretaker
- **Book Now**: Opens booking flow modal
- **Share**: Opens native share sheet
- **Skills**: Tap to filter other caretakers by skill
- **Reviews**: Scroll to load more reviews

---

## Screen 5: Booking Flow

### Step 1: Select Date & Time
```
┌─────────────────────────────┐
│ ✕  Book Jane Doe             │
├─────────────────────────────┤
│                             │
│  Select Date                │
│  ┌───┬───┬───┬───┬───┬───┬──┤│
│  │Mon│Tue│Wed│Thu│Fri│Sat│Su││
│  │ 13│ 14│ 15│ 16│ 17│ 18│19││
│  ├───┼───┼───┼───┼───┼───┼──┤│
│  │   │ ● │   │   │ ● │ ○ │ ○││
│  └───┴───┴───┴───┴───┴───┴──┘│
│  ● Available  ○ Unavailable  │
│                             │
│  Select Time                │
│  ┌───────┐ ┌───────┐       │
│  │ 9 AM  │ │ 10 AM │       │
│  └───────┘ └───────┘       │
│  ┌───────┐ ┌───────┐       │
│  │11 AM ✓│ │ 12 PM │       │
│  └───────┘ └───────┘       │
│                             │
│  Duration: [2 hours ▼]      │
│                             │
│  ─────────────────────────  │
│  Total: $50                │
│                             │
│  ┌─────────────────────┐    │
│  │    Continue        │    │
│  └─────────────────────┘    │
│                             │
└─────────────────────────────┘
```

### Step 2: Add Details
```
┌─────────────────────────────┐
│ ✕  Booking Details           │
├─────────────────────────────┤
│                             │
│  Care Services Needed       │
│  ┌─────────────────────┐    │
│  │ Describe what you   │    │
│  │ need help with...   │    │
│  │                     │    │
│  │                     │    │
│  └─────────────────────┘    │
│                             │
│  Address                    │
│  ┌─────────────────────┐    │
│  │ 123 Main St, Apt 4B │    │
│  └─────────────────────┘    │
│                             │
│  Special Instructions       │
│  ┌─────────────────────┐    │
│  │ Ring doorbell twice │    │
│  └─────────────────────┘    │
│                             │
│  ─────────────────────────  │
│  ┌─────────────────────┐    │
│  │    Continue        │    │
│  └─────────────────────┘    │
│                             │
└─────────────────────────────┘
```

### Step 3: Confirmation
```
┌─────────────────────────────┐
│ ✕  Confirm Booking           │
├─────────────────────────────┤
│                             │
│  📅 Tuesday, March 15       │
│  🕐 11:00 AM - 1:00 PM      │
│  ⏱ 2 hours                 │
│                             │
│  👤 Jane Doe                │
│  💰 $50.00                  │
│                             │
│  📍 123 Main St, Apt 4B     │
│                             │
│  ─────────────────────────  │
│  Cancellation Policy        │
│  Free cancellation up to   │
│  24 hours before booking    │
│                             │
│  ┌─────────────────────┐    │
│  │  Confirm Booking   │    │
│  └─────────────────────┘    │
│                             │
│  By confirming, you agree  │
│  to our Terms of Service    │
│                             │
└─────────────────────────────┘
```

### Elements
- **Progress Indicator**: Step dots at top
- **Date Picker**: Horizontal scrolling week view
- **Time Slots**: Grid of available times
- **Duration Dropdown**: Selectable duration
- **Notes Textarea**: Multi-line input
- **Price Summary**: Running total
- **Confirm Button**: Primary CTA

### Interactions
- **Date Selection**: Single selection, unavailable dates greyed out
- **Time Selection**: Single selection, selected shows checkmark
- **Continue**: Validates and moves to next step
- **Close**: Confirms exit with unsaved changes warning

---

## Screen 6: Chat Screen

### Layout Structure
```
┌─────────────────────────────┐
│ ← Jane Doe          [⋮]     │
├─────────────────────────────┤
│                             │
│  ┌─────────────────────┐    │
│  │                     │    │
│  │  Hi Jane! Looking   │    │
│  │  forward to our     │    │
│  │  session tomorrow.   │    │
│  │              10:32 AM│    │
│  └─────────────────────┘    │
│                             │
│           ┌─────────────────┐│
│           │Great! I'll be   ││
│           │there at 11.    ││
│    10:35 AM│                 ││
│           └─────────────────┘│
│                             │
│  ┌─────────────────────┐    │
│  │  Should I bring    │    │
│  │  anything specific? │    │
│  │              10:40 AM│    │
│  └─────────────────────┘    │
│                             │
│         Jane is typing...   │
│                             │
├─────────────────────────────┤
│ [+] [      Type message... ]│
│                             │
└─────────────────────────────┘
```

### Elements
- **Header**: Back button, contact name, menu dots
- **Message Bubbles**: Patient messages right-aligned, caretaker left-aligned
- **Timestamps**: Small time text below messages
- **Typing Indicator**: Animated dots with "Jane is typing..."
- **Input Area**: Attachment button, text field, send button

### Interactions
- **Send Message**: Press send or Enter to send
- **Attachment**: Opens camera/gallery/file picker
- **Long Press Message**: Copy, delete options
- **Menu**: View profile, settings, report

---

## Screen 7: Reviews Section

### Layout Structure
```
┌─────────────────────────────┐
│ ← Reviews                    │
├─────────────────────────────┤
│                             │
│  ┌─────────────────────┐    │
│  │     ⭐ 4.8          │    │
│  │  Based on 127       │    │
│  │  reviews            │    │
│  └─────────────────────┘    │
│                             │
│  Filter: [All ▼]            │
│                             │
│  ─────────────────────────  │
│  ┌─────────────────────┐    │
│  │ ⭐⭐⭐⭐⭐  5 days ago │    │
│  │                     │    │
│  │ "Jane was amazing!  │    │
│  │  She was patient    │    │
│  │  and very thorough. │    │
│  │  Highly recommend!" │    │
│  │                     │    │
│  │  - Margaret C.      │    │
│  └─────────────────────┘    │
│                             │
│  ┌─────────────────────┐    │
│  │ ⭐⭐⭐⭐⭐  1 week ago │    │
│  │                     │    │
│  │ "Professional and   │    │
│  │  reliable..."       │    │
│  │                     │    │
│  │  - Robert J.        │    │
│  └─────────────────────┘    │
│                             │
│  [Load More Reviews]        │
│                             │
└─────────────────────────────┘
```

### Elements
- **Rating Summary Card**: Large star display with review count
- **Filter Dropdown**: All, 5 stars, 4 stars, etc.
- **Review Cards**: Star rating, relative date, text, reviewer name
- **Load More Button**: Pagination trigger

### Interactions
- **Filter**: Changes review list
- **Load More**: Fetches next page of reviews
- **Review Card**: Tap to expand full review
