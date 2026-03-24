# CareTaker UX Flow Diagrams

## Flow 1: User Signup

```
┌─────────────┐
│   Start     │
└──────┬──────┘
       │
       ▼
┌─────────────────────────────────┐
│      Welcome Screen             │
│  [Get Started] button           │
└──────────┬──────────────────────┘
           │
           ▼
┌─────────────────────────────────┐
│     Role Selection              │
│  ┌─────────┐    ┌───────────┐  │
│  │ Patient │    │ Caretaker │  │
│  └────┬────┘    └─────┬─────┘  │
└───────┼───────────────┼────────┘
        │               │
        ▼               ▼
┌───────────────┐ ┌───────────────┐
│ Email Form    │ │ Email Form    │
│ [Continue]    │ │ [Continue]    │
└───────┬───────┘ └───────┬───────┘
        │                 │
        ▼                 ▼
┌───────────────┐ ┌───────────────┐
│ Password Form │ │ Password Form │
│ [Continue]    │ │ [Continue]    │
└───────┬───────┘ └───────┬───────┘
        │                 │
        ▼                 ▼
┌─────────────────────────────────┐
│       Verification Email Sent   │
│     [Resend] [Check Inbox]      │
└──────────┬──────────────────────┘
           │
           ▼
┌─────────────────────────────────┐
│       Email Verified?           │
│      [Yes]        [No]          │
└──────┬──────────┬───────────────┘
       │ No        │ Yes
       ▼           ▼
┌────────────┐ ┌───────────────────┐
│ Error:     │ │ Role-specific     │
│ Invalid    │ │ Onboarding        │
│ Link       │ │ (Patient/Caretaker│
│            │ │  Profile)        │
└────────────┘ └─────────┬─────────┘
                          │
                          ▼
                 ┌─────────────────┐
                 │ Profile Complete │
                 │ Dashboard →      │
                 └─────────────────┘
```

### Error States
- **Invalid email format**: Inline error message below input
- **Password too weak**: Show password requirements, highlight missing
- **Email already exists**: Suggest login or password reset
- **Verification expired**: Resend option available

---

## Flow 2: Caretaker Onboarding

```
┌─────────────┐
│   Start     │
└──────┬──────┘
       │
       ▼
┌─────────────────────────────────┐
│    Welcome Onboarding           │
│  "Join our caretaker network"   │
│  [Start Application]             │
└──────────┬──────────────────────┘
           │
           ▼
┌─────────────────────────────────┐
│     Personal Information        │
│  - Full Name                    │
│  - Phone Number                 │
│  - Address                      │
│  - Profile Photo                │
│  [Continue]                     │
└──────────┬──────────────────────┘
           │
           ▼
┌─────────────────────────────────┐
│     Skills & Experience          │
│  - Select Skills (checkboxes)   │
│  - Years of Experience          │
│  - Brief Bio                    │
│  [Continue]                     │
└──────────┬──────────────────────┘
           │
           ▼
┌─────────────────────────────────┐
│     Pricing Setup               │
│  - Hourly Rate ($)              │
│  - Daily Rate ($)                │
│  - Service Area (radius)         │
│  [Continue]                     │
└──────────┬──────────────────────┘
           │
           ▼
┌─────────────────────────────────┐
│     Certifications Upload       │
│  - ID Document                  │
│  - CNA/Nursing License          │
│  - CPR Certification            │
│  - Additional Certificates       │
│  [Upload Files]                  │
└──────────┬──────────────────────┘
           │
           ▼
┌─────────────────────────────────┐
│     Availability Setup          │
│  - Weekly Schedule Grid          │
│  - Set Available Hours           │
│  - Block Off Dates              │
│  [Continue]                     │
└──────────┬──────────────────────┘
           │
           ▼
┌─────────────────────────────────┐
│     Review & Submit             │
│  [Submit for Review]            │
└──────────┬──────────────────────┘
           │
           ▼
┌─────────────────────────────────┐
│     Under Review                │
│  "We'll notify you within      │
│   24-48 hours"                  │
└──────────┬──────────────────────┘
           │
           ▼
     Decision?
    ┌────┴────┐
    │         │
    ▼         ▼
┌────────┐ ┌────────────┐
│Approved│ │ Rejected   │
└───┬────┘ └─────┬──────┘
    │            │
    ▼            ▼
┌─────────┐ ┌────────────────┐
│ Welcome │ │ Reason shown   │
│ Screen  │ │ [Edit & Resub] │
└────┬────┘ └────────────────┘
     │
     ▼
┌─────────────────────────────────┐
│     Profile Live!               │
│  "Your profile is now visible  │
│   to patients"                  │
│  [Go to Dashboard]              │
└─────────────────────────────── ─┘
```

### Validation Rules
- Phone: 10 digits, valid format
- Photo: Max 5MB, JPG/PNG
- Documents: PDF/JPG, Max 10MB each
- Hourly rate: $10-$100 range
- Bio: 50-500 characters

---

## Flow 3: Booking a Service

```
┌─────────────┐
│   Start     │
└──────┬──────┘
       │
       ▼
┌─────────────────────────────────┐
│     Search/Browse Caretakers    │
│     (from Patient Dashboard)     │
└──────────┬──────────────────────┘
           │
           ▼
┌─────────────────────────────────┐
│     Filter Caretakers           │
│  [Skills] [Price] [Rating] [Date]│
│     Apply Filters               │
└──────────┬──────────────────────┘
           │
           ▼
┌─────────────────────────────────┐
│     View Caretaker Profile      │
│     Scroll through details      │
│     Read reviews               │
└──────────┬──────────────────────┘
           │
           ▼
┌─────────────────────────────────┐
│     [Book Now] Button           │
└──────────┬──────────────────────┘
           │
           ▼
┌─────────────────────────────────┐
│     STEP 1: Date & Time         │
│     Select from calendar        │
│     Choose available slot       │
│     [Continue]                 │
└──────────┬──────────────────────┘
           │
           ▼
    Time Conflict?
    ┌────┴────┐
    │         │
    ▼         ▼
┌────────┐ ┌─────────────────┐
│Error: │ │ STEP 2: Details │
│Select │ │ - Service notes │
│another│ │ - Address       │
│time   │ │ - Instructions  │
└────────┘ └───┬─────────────┘
               │
               ▼
┌─────────────────────────────────┐
│     STEP 3: Confirm             │
│     Review booking summary      │
│     See total cost              │
│     Cancellation policy shown    │
└──────────┬──────────────────────┘
           │
           ▼
┌─────────────────────────────────┐
│     [Confirm Booking]           │
└──────────┬──────────────────────┘
           │
           ▼
┌─────────────────────────────────┐
│     Booking Request Sent        │
│     "Waiting for [Caretaker]    │
│      to confirm"                │
└──────────┬──────────────────────┘
           │
           ▼
     Caretaker Response?
    ┌──────┴──────┐
    │             │
    ▼             ▼
┌─────────┐ ┌────────────┐
│ Accepted│ │ Declined   │
└───┬─────┘ └─────┬──────┘
    │             │
    ▼             ▼
┌─────────┐ ┌────────────────┐
│Confirmed│ │ Shown decline  │
│ Booking │ │ message        │
│ Created │ │ Suggest other  │
└────┬────┘ │ caretakers     │
     │      └────────────────┘
     ▼
┌─────────────────────────────────┐
│     Booking Confirmed!          │
│     - Added to calendar         │
│     - Notification sent         │
│     - Chat opened               │
└─────────────────────────────────┘
```

### Cancellation Flow
```
┌─────────────────────────────────┐
│     View Active Booking         │
│     [Cancel Booking]            │
└──────────┬──────────────────────┘
           │
           ▼
┌─────────────────────────────────┐
│     Cancellation Policy         │
│     "Free if 24+ hours before"  │
│     Reason for cancel?          │
└──────────┬──────────────────────┘
           │
           ▼
┌─────────────────────────────────┐
│     Confirm Cancellation?       │
│     [Yes, Cancel] [Go Back]     │
└──────────┬──────────────────────┘
           │
           ▼
┌─────────────────────────────────┐
│     Booking Cancelled           │
│     Refund processed (if any)    │
│     Both parties notified       │
└─────────────────────────────────┘
```

---

## Flow 4: Chat Communication

```
┌─────────────┐
│   Start     │
└──────┬──────┘
       │
       ▼
┌─────────────────────────────────┐
│     Open Chat from:             │
│     - Booking Details           │
│     - Message Notification       │
│     - Chat List                 │
└──────────┬──────────────────────┘
           │
           ▼
┌─────────────────────────────────┐
│     Chat Thread Loaded          │
│     Load last 50 messages       │
│     Scroll to load more         │
└──────────┬──────────────────────┘
           │
           ▼
┌─────────────────────────────────┐
│     Type Message                │
│     [+] [Type here...] [Send]   │
└──────────┬──────────────────────┘
           │
           ▼
┌─────────────────────────────────┐
│     Message Sent                 │
│     ✓ Sent status shown          │
│     → Delivered when read        │
│     ✓✓ Read receipts            │
└──────────┬──────────────────────┘
           │
           ▼
┌─────────────────────────────────┐
│     Receive Message              │
│     Push notification           │
│     Real-time update            │
└──────────┬──────────────────────┘
           │
           ▼
┌─────────────────────────────────┐
│     Typing Indicator            │
│     "Jane is typing..."         │
│     Shown when other types       │
└─────────────────────────────────┘
```

### Error States
- **Message failed**: Show retry button
- **Offline**: Queue messages, send when online
- **Connection lost**: Show reconnecting banner

---

## Flow 5: Rating & Review

```
┌─────────────┐
│   Start     │
└──────┬──────┘
       │
       ▼
┌─────────────────────────────────┐
│     Booking Marked Complete      │
│     (After end time)            │
└──────────┬──────────────────────┘
           │
           ▼
┌─────────────────────────────────┐
│     Rating Prompt Appears        │
│     "How was your experience?"  │
│     [Skip] [Rate Now]           │
└──────────┬──────────────────────┘
           │
           ▼
    Skip?
    ┌────┴────┐
    │         │
    ▼         ▼
┌────────┐ ┌─────────────────┐
│ No     │ │ Select Stars    │
│ Rating │ │ ⭐⭐⭐⭐⭐         │
│ Saved  │ │ Tap to rate     │
└────────┘ └───────┬─────────┘
                   │
                   ▼
┌─────────────────────────────────┐
│     Write Review (Optional)     │
│     "Share details about        │
│      your experience..."        │
│     [Add Photo]                  │
│     [Submit]                    │
└──────────┬──────────────────────┘
           │
           ▼
┌─────────────────────────────────┐
│     Review Submitted            │
│     "Thank you for your         │
│      feedback!"                 │
└──────────┬──────────────────────┘
           │
           ▼
┌─────────────────────────────────┐
│     Rating Calculated            │
│     Caretaker's average updated │
│     Review visible on profile   │
└─────────────────────────────────┘
```

---

## State Diagrams

### Booking States
```
                    ┌──────────┐
                    │  PENDING │
                    └────┬─────┘
                         │
           ┌─────────────┼─────────────┐
           │             │             │
           ▼             ▼             ▼
     ┌──────────┐  ┌──────────┐  ┌──────────┐
     │ ACCEPTED │  │ DECLINED │  │ EXPIRED  │
     └────┬─────┘  └──────────┘  └──────────┘
          │
          ▼
    ┌──────────┐
    │ CONFIRMED│
    └────┬─────┘
         │
    ┌────┴────────────────────┐
    │                         │
    ▼                         ▼
┌──────────┐            ┌──────────┐
│  ACTIVE  │            │CANCELLED│
└────┬─────┘            └──────────┘
     │
     ▼
┌──────────┐
│COMPLETED │
└──────────┘
```

### User States
```
┌──────────┐     ┌──────────┐     ┌──────────┐
│ REGISTERED│ → │VERIFIED  │ → │ ACTIVE   │
└──────────┘     └──────────┘     └────┬─────┘
                                       │
                          ┌────────────┼────────────┐
                          ▼            ▼            ▼
                    ┌──────────┐ ┌──────────┐ ┌──────────┐
                    │ SUSPENDED│ │ BANNED   │ │ DELETED  │
                    └──────────┘ └──────────┘ └──────────┘
```
