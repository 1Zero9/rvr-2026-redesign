# "Cute-alism" Mobile-First Design Tokens & Layout Specifications

This document defines the brand tokens, copy rules, and responsive layout specifications for the Rivervalley Rangers AFC "Cute-alism" mobile-first interface.

---

## 1. Brand Tokens & Theme Configuration

### Color Palette (Extracted from 1981 RVR Crest)
*   **Deep Athletic Green**: `#005C39`
    *   *Role*: Anchor color for layout elements, primary buttons, and headings. Meets AAA contrast when combined with white text.
*   **Stark Charcoal**: `#121212`
    *   *Role*: Text, heavy outer borders, and flat drop shadows. Replaces standard generic black to soften high contrast slightly while maintaining a premium feel.
*   **High-Energy Neon Accent**: `#85E320`
    *   *Role*: Highlighting interactive hover states, badges, and alerts.
*   **Warm Cream Base**: `#FAF8F5`
    *   *Role*: Body background to eliminate screen glare and fit the friendly Cute-alism vibe.

### Typography Scale (Mobile Viewport)
We use variable-weight Sans-serif (**Plus Jakarta Sans** for display headings, **Inter** for body copy) to create a sporty, kinetic layout:

*   **Display Massive (Hero Title)**:
    *   *Size*: `text-4xl` to `text-5xl` (36px to 48px)
    *   *Weight*: `font-black` (900)
    *   *Style*: `italic uppercase tracking-tighter skew-x-[-3deg]`
*   **Section Heading (Sub-pages / Cards)**:
    *   *Size*: `text-2xl` to `text-3xl` (24px to 30px)
    *   *Weight*: `font-extrabold` (800)
    *   *Style*: `uppercase italic tracking-tight`
*   **Card Heading**:
    *   *Size*: `text-lg` to `text-xl` (18px to 20px)
    *   *Weight*: `font-bold` (700)
    *   *Style*: `uppercase`
*   **Body Copy (Readability Enforced)**:
    *   *Size*: `text-base` (16px / 1rem)
    *   *Weight*: `font-medium` or `font-semibold` (500/600)
    *   *Line Height*: `leading-relaxed` (1.5 line height)

---

## 2. Content & Copywriting Rules

### English-Only Copy Constraint
*   All UI copy, metadata, and validation notifications must be written strictly in the English language. No untranslated terminology or multilingual snippets.

### Direct and Authoritative Call-to-Actions (CTAs)
Avoid passive, conversational, or lengthy button text. Use short, action-focused verbs:

| Avoid (Passive / Wordy) | Adopt (Direct / Authoritative) |
| :--- | :--- |
| *Join our soccer club today!* | **Join the Team** |
| *Check out astro pitch availability* | **Book Astro** |
| *Calculate the price of membership* | **Calculate Fees** |
| *Sign up for referee seminar course* | **Become JMO** |
| *Complete security screening* | **Submit Garda Vetting** |

---

## 3. Layout Specifications

### 'Frosted Glass' Stats Card (Mobile Spec)
Combines the blur of glassmorphism with the thick raw-borders of Neo-brutalism:

```
+------------------------------------------+
|  [SVG Star Icon]                         |
|                                          |
|  44 YEARS STRONG                         |
|  Est. 1981 • Dublin Legacy               |
|                                          |
+------------------------------------------+
  Border: 4px Solid #121212 (Charcoal)
  Background: rgba(255, 255, 255, 0.75)
  Backdrop-Filter: blur(12px)
  Box-Shadow: 6px 6px 0px 0px #121212
```

#### CSS Implementation Details:
*   **Outer border**: `border-4 border-brand-charcoal`
*   **Backdrop Blur**: `backdrop-blur-md`
*   **Background opacity**: `bg-white/75`
*   **Drop shadow**: `shadow-brutalist` (`shadow-[6px_6px_0px_0px_#121212]`)
*   **Display elements**:
    *   *Card 1*: **44 Years Strong** (Establishment legacy badge).
    *   *Card 2*: **100% Garda Vetted** (Trust and child protection badge).

### 'Equality-First' Mobile Drawer Spec
*   **Visual trigger**: High-contrast menu button (`min-w-[48px] min-h-[48px] bg-brand-neon border-3 border-brand-charcoal`).
*   **Drawer backdrop**: Full-screen overlay with `glass-frosted` blur (`backdrop-blur-xl bg-[#FAF8F5]/90`).
*   **Navigation Hierarchy**:
    *   **Priority 1 (Top / Left-aligned)**: Girls & Women's squad pathways (Seniors WNL, Girls Academy U8-U18).
    *   **Priority 2 (Lower / Right-aligned)**: Boys & Men's squad pathways (Seniors LSL, Boys Academy U7-U18).
*   **Spacing**: Touch targets are styled with `.tap-target-comfort` (48px target, 12px margins) to prevent overlap on small screens.
