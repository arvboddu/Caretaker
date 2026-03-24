# CareTaker Design System

## Brand Identity

### Brand Name
**CareTaker**

### Taglines
- "Care, Delivered"
- "Your Care, Your Way"
- "Connecting Care, Creating Comfort"

---

## Color Palette

### Primary Colors
| Color Name | Hex Code | RGB | Usage |
|------------|----------|-----|-------|
| Teal Primary | `#0D9488` | 13, 148, 136 | Main CTAs, links, active states |
| Teal Dark | `#0F766E` | 15, 118, 110 | Hover states, emphasis |
| Teal Light | `#CCFBF1` | 204, 251, 241 | Backgrounds, highlights |

### Secondary Colors
| Color Name | Hex Code | RGB | Usage |
|------------|----------|-----|-------|
| Navy | `#1E3A5F` | 30, 58, 95 | Headers, important text |
| Slate | `#475569` | 71, 85, 105 | Body text, secondary elements |
| Gray | `#94A3B8` | 148, 163, 184 | Placeholder text, disabled states |

### Background Colors
| Color Name | Hex Code | RGB | Usage |
|------------|----------|-----|-------|
| White | `#FFFFFF` | 255, 255, 255 | Card backgrounds, page background |
| Off White | `#F8FAFC` | 248, 250, 252 | Page background alternative |
| Light Gray | `#F1F5F9` | 241, 245, 249 | Input backgrounds, dividers |

### Semantic Colors
| Color Name | Hex Code | RGB | Usage |
|------------|----------|-----|-------|
| Success | `#10B981` | 16, 185, 129 | Success states, positive feedback |
| Warning | `#F59E0B` | 245, 158, 11 | Warning states, alerts |
| Error | `#EF4444` | 239, 68, 68 | Error states, destructive actions |
| Info | `#3B82F6` | 59, 130, 246 | Information, tips |

---

## Typography

### Font Family
- **Primary Font**: Inter (Google Fonts)
- **Fallback**: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif

### Type Scale
| Element | Font | Weight | Size | Line Height |
|---------|------|--------|------|-------------|
| H1 | Inter | 700 (Bold) | 32px | 40px |
| H2 | Inter | 600 (Semibold) | 24px | 32px |
| H3 | Inter | 600 (Semibold) | 20px | 28px |
| H4 | Inter | 500 (Medium) | 18px | 24px |
| Body Large | Inter | 400 (Regular) | 16px | 24px |
| Body | Inter | 400 (Regular) | 14px | 20px |
| Body Small | Inter | 400 (Regular) | 12px | 16px |
| Caption | Inter | 500 (Medium) | 11px | 16px |
| Button | Inter | 600 (Semibold) | 14px | 20px |

### Usage Examples
```css
h1 { font-size: 32px; font-weight: 700; line-height: 40px; }
h2 { font-size: 24px; font-weight: 600; line-height: 32px; }
h3 { font-size: 20px; font-weight: 600; line-height: 28px; }
p { font-size: 14px; font-weight: 400; line-height: 20px; }
button { font-size: 14px; font-weight: 600; }
```

---

## Spacing System

### Base Unit
4px

### Spacing Scale
| Name | Value | Usage |
|------|-------|-------|
| xs | 4px | Tight spacing, icon gaps |
| sm | 8px | Component internal spacing |
| md | 16px | Standard padding, margins |
| lg | 24px | Section spacing |
| xl | 32px | Large section gaps |
| 2xl | 48px | Page section dividers |
| 3xl | 64px | Major page sections |

### Padding Guidelines
- **Cards**: 16px padding
- **Buttons**: 12px vertical, 24px horizontal
- **Inputs**: 12px vertical, 16px horizontal
- **Modals**: 24px padding

### Margin Guidelines
- **Between cards**: 16px
- **Section spacing**: 24px
- **Page margins**: 16px (mobile), 24px (tablet), 32px (desktop)

---

## Border Radius

| Element | Radius |
|---------|--------|
| Buttons | 8px |
| Cards | 12px |
| Inputs | 8px |
| Avatars (small) | 50% (circle) |
| Avatars (large) | 12px |
| Badges | 16px (pill) |
| Modals | 16px |

---

## Shadows

### Shadow Scale
| Name | Value | Usage |
|------|-------|-------|
| sm | `0 1px 2px rgba(0,0,0,0.05)` | Subtle elevation |
| md | `0 4px 6px rgba(0,0,0,0.07)` | Cards, dropdowns |
| lg | `0 10px 15px rgba(0,0,0,0.1)` | Modals, floating elements |
| xl | `0 20px 25px rgba(0,0,0,0.15)` | Popovers |

---

## Components

### Buttons

#### Primary Button
```css
.btn-primary {
  background-color: #0D9488;
  color: #FFFFFF;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-primary:hover {
  background-color: #0F766E;
}

.btn-primary:active {
  background-color: #115E59;
}

.btn-primary:disabled {
  background-color: #94A3B8;
  cursor: not-allowed;
}
```

#### Secondary Button
```css
.btn-secondary {
  background-color: transparent;
  color: #0D9488;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  border: 2px solid #0D9488;
  cursor: pointer;
}

.btn-secondary:hover {
  background-color: #CCFBF1;
}
```

#### Ghost Button
```css
.btn-ghost {
  background-color: transparent;
  color: #475569;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 500;
  border: none;
  cursor: pointer;
}

.btn-ghost:hover {
  background-color: #F1F5F9;
}
```

### Inputs

#### Text Input
```css
.input {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #E2E8F0;
  border-radius: 8px;
  font-size: 14px;
  background-color: #FFFFFF;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.input:focus {
  outline: none;
  border-color: #0D9488;
  box-shadow: 0 0 0 3px rgba(13, 148, 136, 0.1);
}

.input::placeholder {
  color: #94A3B8;
}

.input:disabled {
  background-color: #F1F5F9;
  cursor: not-allowed;
}
```

#### Textarea
```css
.textarea {
  width: 100%;
  min-height: 100px;
  padding: 12px 16px;
  border: 1px solid #E2E8F0;
  border-radius: 8px;
  font-size: 14px;
  resize: vertical;
}
```

### Cards

#### Base Card
```css
.card {
  background-color: #FFFFFF;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.07);
}
```

#### Caretaker Card
```css
.caretaker-card {
  display: flex;
  gap: 12px;
  padding: 16px;
  background: #FFFFFF;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.07);
}

.caretaker-card img {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  object-fit: cover;
}
```

### Badges

#### Status Badge
```css
.badge {
  display: inline-flex;
  align-items: center;
  padding: 4px 12px;
  border-radius: 16px;
  font-size: 12px;
  font-weight: 500;
}

.badge-success {
  background-color: #D1FAE5;
  color: #065F46;
}

.badge-warning {
  background-color: #FEF3C7;
  color: #92400E;
}

.badge-info {
  background-color: #DBEAFE;
  color: #1E40AF;
}
```

### Avatar

```css
.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}

.avatar-lg {
  width: 80px;
  height: 80px;
}

.avatar-sm {
  width: 32px;
  height: 32px;
}
```

### Rating Stars

```css
.stars {
  display: inline-flex;
  gap: 2px;
  color: #F59E0B;
}

.stars-empty {
  color: #E2E8F0;
}
```

### Navigation

#### Bottom Tab Bar
```css
.tab-bar {
  display: flex;
  justify-content: space-around;
  padding: 8px 0;
  background: #FFFFFF;
  border-top: 1px solid #E2E8F0;
  position: fixed;
  bottom: 0;
  width: 100%;
}

.tab-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 8px 16px;
  color: #94A3B8;
}

.tab-item.active {
  color: #0D9488;
}
```

### Modals

```css
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
}

.modal {
  background: #FFFFFF;
  border-radius: 16px;
  padding: 24px;
  max-width: 400px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
}
```

---

## Iconography

### Icon Library
**Heroicons** (outline style for general use, solid for emphasis)

### Icon Sizes
| Size | Value | Usage |
|------|-------|-------|
| xs | 16px | Inline with text |
| sm | 20px | Buttons, small UI |
| md | 24px | Standard icons |
| lg | 32px | Empty states |
| xl | 48px | Onboarding illustrations |

### Icon Colors
- Default: `#475569` (Slate)
- Active/Selected: `#0D9488` (Teal Primary)
- Disabled: `#94A3B8` (Gray)

---

## Responsive Breakpoints

| Breakpoint | Width | Device |
|------------|-------|--------|
| sm | 640px | Mobile landscape |
| md | 768px | Tablet |
| lg | 1024px | Small desktop |
| xl | 1280px | Large desktop |

---

## Animation Guidelines

### Duration
- **Fast**: 150ms (micro-interactions)
- **Normal**: 200ms (standard transitions)
- **Slow**: 300ms (modals, drawers)

### Easing
- **Default**: `ease-out` (most transitions)
- **Enter**: `ease-out` (fade in, slide in)
- **Exit**: `ease-in` (fade out, slide out)
- **Bounce**: `cubic-bezier(0.68, -0.55, 0.265, 1.55)` (success states)

### Common Animations
- **Button hover**: Scale 1.02, 150ms
- **Card hover**: Shadow increase, 200ms
- **Modal open**: Fade + scale from 0.95, 200ms
- **Page transition**: Slide left/right, 300ms
- **Skeleton loading**: Pulse animation, 1.5s infinite

---

## Accessibility

### Color Contrast
- Text on background: Minimum 4.5:1 ratio
- Large text (18px+): Minimum 3:1 ratio
- Interactive elements: Minimum 3:1 against adjacent colors

### Focus States
```css
:focus-visible {
  outline: 2px solid #0D9488;
  outline-offset: 2px;
}
```

### Touch Targets
- Minimum 44x44px for all interactive elements

### Screen Reader
- All icons must have `aria-label` or be accompanied by text
- Images must have descriptive `alt` text
- Form inputs must have associated labels
