---
name: Terra Explorer
colors:
  surface: '#fff9f0'
  surface-dim: '#dfd9d1'
  surface-bright: '#fff9f0'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f9f3ea'
  surface-container: '#f3ede4'
  surface-container-high: '#ede7df'
  surface-container-highest: '#e7e2d9'
  on-surface: '#1d1b16'
  on-surface-variant: '#414751'
  inverse-surface: '#32302a'
  inverse-on-surface: '#f6f0e7'
  outline: '#717783'
  outline-variant: '#c1c7d3'
  surface-tint: '#0060ac'
  primary: '#005da7'
  on-primary: '#ffffff'
  primary-container: '#2976c7'
  on-primary-container: '#fdfcff'
  inverse-primary: '#a4c9ff'
  secondary: '#705d00'
  on-secondary: '#ffffff'
  secondary-container: '#fdd73b'
  on-secondary-container: '#715d00'
  tertiary: '#006b28'
  on-tertiary: '#ffffff'
  tertiary-container: '#21863b'
  on-tertiary-container: '#f7fff2'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d4e3ff'
  primary-fixed-dim: '#a4c9ff'
  on-primary-fixed: '#001c39'
  on-primary-fixed-variant: '#004883'
  secondary-fixed: '#ffe173'
  secondary-fixed-dim: '#e8c426'
  on-secondary-fixed: '#221b00'
  on-secondary-fixed-variant: '#554500'
  tertiary-fixed: '#96f89f'
  tertiary-fixed-dim: '#7bdb85'
  on-tertiary-fixed: '#002107'
  on-tertiary-fixed-variant: '#00531d'
  background: '#fff9f0'
  on-background: '#1d1b16'
  surface-variant: '#e7e2d9'
typography:
  display-lg:
    fontFamily: Quicksand
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Quicksand
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 44px
    letterSpacing: -0.01em
  headline-lg:
    fontFamily: Quicksand
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
  headline-md:
    fontFamily: Quicksand
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Montserrat
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Montserrat
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-lg:
    fontFamily: Montserrat
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.05em
  label-md:
    fontFamily: Montserrat
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
rounded:
  sm: 0.5rem
  DEFAULT: 1rem
  md: 1.5rem
  lg: 2rem
  xl: 3rem
  full: 9999px
spacing:
  unit: 8px
  container-padding: 24px
  gutter: 16px
  stack-sm: 8px
  stack-md: 16px
  stack-lg: 32px
---

## Brand & Style

The brand personality is exuberant, communal, and adventurous. It targets a diverse range of social groups—from corporate teams to families—aiming to make the daily habit of walking feel like a collaborative global voyage. The UI should evoke a sense of "Polished Whimsy," combining the structured reliability of a fitness app with the joyful, tactile nature of a modern picture book.

The design style is a sophisticated blend of **Minimalism** and **Tactile/Skeuomorphic** elements. We utilize high-quality execution of hand-drawn cues: clean but slightly organic lines, soft depth, and generous whitespace. The interface avoids clinical "tech" vibes in favor of a warm, inviting environment that feels human and encouraging.

## Colors

The palette is rooted in the natural world to reflect the outdoor nature of walking.
- **Primary (Sky Blue):** Used for primary actions, navigation, and core branding. It represents the limitlessness of the journey.
- **Secondary (Sunny Yellow):** Used for highlights, achievements, and "winning" moments. It provides high-energy contrast.
- **Tertiary (Grass Green):** Used for progress indicators, health metrics, and positive success states.
- **Quaternary (Earthy Terracotta):** Used for urgent notifications, heart-related metrics, or "Path" markers that need to stand out from the green/blue surroundings.
- **Neutral (Warm Cream):** This is the canvas. Use this instead of pure white to maintain a soft, non-glare, organic feel. 
- **Text:** Use a deep charcoal (#2D3436) for text to ensure high legibility against the cream background while avoiding the harshness of pure black.

## Typography

The typography system balances character with clarity. 
- **Headings (Quicksand):** The rounded terminals of Quicksand provide a friendly, approachable voice. Use bold weights for headers to ensure they feel "bubbly" and substantial.
- **Body & Labels (Montserrat):** Its geometric precision keeps the "childlike" aesthetic from feeling messy. It provides the necessary professional grounding for data-heavy views like step counts and leaderboards.
- **Hierarchy:** Maintain generous line heights to keep the reading experience breezy and uncrowded.

## Layout & Spacing

The design system utilizes a **fluid grid** for mobile and a **centered fixed grid** (max-width 1200px) for desktop. 

- **Spacing Rhythm:** Based on an 8px base unit. 
- **Margins:** Large 24px outer margins on mobile to prevent the UI from feeling "cramped" and to support the airy aesthetic.
- **Layout Model:** Use Flexbox/Grid with wide gutters (16px - 24px). Elements should never feel tight; if in doubt, add more whitespace.
- **Adaptation:** On mobile, transition from multi-column layouts to single-stack cards. Elements like the "Global Path" progress bar should remain horizontally scrollable or wrap gracefully to maintain the "winding" metaphor.

## Elevation & Depth

To achieve the "Polished Childlike" look, depth is created through **Ambient Shadows** and **Tonal Layering**.

- **Shadows:** Avoid harsh, black shadows. Use a "Soft Bloom" effect: high blur (20px-40px), low opacity (10-15%), and tinted with the Primary or Secondary color (e.g., a Sky Blue shadow under a button).
- **Surface Tiering:** 
    - *Level 0 (Background):* Warm Cream (#FFF9F0).
    - *Level 1 (Cards):* Pure White (#FFFFFF) to provide a crisp contrast against the cream.
    - *Level 2 (Modals/Popovers):* White with a more pronounced soft-bloom shadow.
- **Outlines:** Use very thin, low-contrast borders (1px) in a slightly darker shade of the background color to define shapes without breaking the softness.

## Shapes

The shape language is defined by extreme circularity. There are no sharp corners in this design system. 

- **Standard Elements:** Use `rounded-xl` (1.5rem / 24px) for cards and container modules.
- **Interactive Elements:** Use `rounded-3xl` or fully pill-shaped (500px) for buttons and input fields to make them feel "squishy" and touch-friendly.
- **Organic Cues:** Where possible, use slightly asymmetrical "blob" shapes for background decorative elements to reinforce the hand-drawn, adventurous theme.

## Components

- **Bubbly Buttons:** Large, high-padding buttons with pill-shaped corners. Primary buttons should use a subtle 2px bottom "press" shadow to give them a tactile, physical feel.
- **Winding Progress Bars:** Eschew straight lines. The progress bar should be a thick, rounded track (12px height) with a slightly wavy or "winding" path shape. The "walker" icon (a simple pin or dot) sits on top of the track.
- **Soft Border-Run Cards:** Cards should have `rounded-xl` corners and no heavy borders. Use the Soft Bloom shadow to separate them from the background.
- **Chips:** Small, pill-shaped tags used for categories (e.g., "Park," "City," "Mountain"). Use high-saturation background colors with white text.
- **Checkboxes & Radios:** Over-sized and rounded. When checked, they should "pop" with a scale-up animation and fill with the Primary color.
- **Input Fields:** Thick, rounded borders with a Warm Cream fill. On focus, the border should transition to Primary Sky Blue with a soft outer glow.
- **Leaderboard Lists:** Use large avatars with thick, colorful borders. Each list item is its own floating card rather than a divided list to maintain the "modular" toy-like feel.