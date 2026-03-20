# Design System Specification: Post-Minimalist Tactile Depth

## 1. Overview & Creative North Star: "The Ethereal Academy"
The Creative North Star for this design system is **The Ethereal Academy**. We are moving away from the "app-in-a-box" aesthetic toward a digital experience that feels like a physical desk of frosted glass resting on an infinite, sunlit gallery. 

This system rejects the rigidity of traditional grids in favor of **Intentional Asymmetry** and **Liquid Layering**. By combining the ultra-clean, text-centric layouts of post-minimalism with the visceral, tactile depth of visionOS-style "liquid glass," we create a communication environment for the university that feels both authoritative and breathable. 

**Key Principles:**
*   **Weightless Authority:** Heavy information is broken down into light, floating pods.
*   **Glow over Borders:** Use the Sejong Crimson not as a flat fill, but as an atmospheric "aura" that guides the eye.
*   **Micro-Luxury:** Gold is used sparingly—like a master jeweler—only for the most critical points of success or prestige.

---

## 2. Colors & Atmospheric Tones
The palette is rooted in an "Infinite White" canvas, punctuated by the deep, pulsing energy of the university's crimson.

### Core Palette
*   **Primary (Sejong Crimson):** `#960018` (Mapped to `primary_container`). Use this for dynamic "glowing" states and high-action CTAs.
*   **Secondary (Academic Gold):** `#D4AF37` (Mapped to `secondary`). Reserved for microscopic highlights: verified badges, achievement stars, or premium headers.
*   **Background:** `#f9f9fb` (Surface). An expansive, near-white canvas that allows glass elements to catch light.

### The "No-Line" Rule
**Strict Prohibition:** Do not use 1px solid hex-code borders to define sections. 
Boundaries must be created through:
1.  **Background Shifts:** Placing a `surface_container_low` element against a `surface` background.
2.  **Tonal Transitions:** Using subtle `surface_variant` offsets.
3.  **Physicality:** Using `backdrop-blur` (20px–40px) to let the background "bleed" through the component.

### The "Glass & Gradient" Rule
Standard flat fills are forbidden for primary containers. Use a **Liquid Gradient**:
*   **CTA Fill:** Linear gradient from `primary` (#6b000e) to `primary_container` (#960018) at a 135° angle.
*   **Glass Surface:** Use `surface_container_lowest` at 70% opacity with a `backdrop-filter: blur(30px)`.

---

## 3. Typography: Geometric Clarity
We utilize a strict geometric sans-serif (Plus Jakarta Sans for headers, Inter for utility) to maintain a modern, "Product-Style" editorial feel.

*   **Display (Display-LG/MD):** Large, airy, and assertive. Use `display-lg` (3.5rem) for main welcome screens with `-0.04em` letter spacing to feel "tighter" and more custom.
*   **Headlines (Headline-LG/MD):** The "Editorial Voice." Use these for section titles. Never center-align more than three lines of text; keep it left-aligned to ground the layout.
*   **Body (Body-LG/MD):** Inter provides the functional backbone. Use `body-lg` (1rem) for message content to ensure readability over glass textures.
*   **Labels (Label-MD/SM):** Set in all-caps with `+0.05em` letter spacing for a "micro-caption" look that feels intentional and premium.

---

## 4. Elevation & Depth: Tonal Layering
Depth is not a "drop shadow" choice; it is a structural necessity.

### The Layering Principle (The Stack)
1.  **Level 0 (Base):** `surface` (#f9f9fb) - The infinite floor.
2.  **Level 1 (Sections):** `surface_container_low` - Used for large content groupings.
3.  **Level 2 (Cards):** `surface_container_lowest` + 30px Blur - The "Glass Pod" layer.
4.  **Level 3 (Interactive):** `primary_container` with a `0 12px 24px rgba(150, 0, 24, 0.15)` crimson aura.

### Ambient Shadows
Shadows must be invisible until noticed.
*   **Value:** `0px 20px 40px rgba(26, 28, 29, 0.04)`
*   **The Ghost Border:** If accessibility requires a stroke, use `outline_variant` at **15% opacity**. It should feel like a "catch-light" on the edge of a glass pane, not a drawn line.

---

## 5. Components: The Liquid Toolkit

### Glass-Pod Message Bubbles
*   **Style:** `surface_container_lowest` at 60% opacity. 
*   **Edge:** Top-left corner `roundness.xl` (1.5rem), bottom-right `roundness.sm` (0.25rem) to create an asymmetrical, organic "pod" feel.
*   **Blur:** `backdrop-filter: blur(25px)`.

### Liquid Crimson Buttons
*   **Primary:** A pill-shaped (`roundness.full`) container using the Crimson gradient. On hover, increase the "aura" (outer glow) using a `surface_tint` shadow.
*   **Secondary:** No fill. `outline_variant` at 20% opacity with `body-md` text in `primary`.

### Academic Chips
*   **Selection:** Use `secondary_container` (Gold-tinted) with `on_secondary_container` (Deep Gold) text.
*   **Layout:** Use `spacing.1` for internal padding and `spacing.3` for external margins to maintain a tight, "micro-tag" aesthetic.

### Cards & Lists
*   **The "Divider-Free" Rule:** Lists must never use horizontal lines. Separate list items by `spacing.4` (1.4rem) or by placing each item in its own "Glass Pod" with a subtle background shift on hover.

---

## 6. Do’s and Don’ts

### Do:
*   **DO** use whitespace as a functional element. If a screen feels "busy," double the padding using `spacing.16`.
*   **DO** use the Crimson "Pulse." For active notifications, a soft, animating `primary` glow behind a glass card is preferred over a red dot.
*   **DO** nest containers. A `surface_container_highest` element inside a `surface_container_low` creates an immediate, intuitive hierarchy.

### Don't:
*   **DON'T** use 100% black. The "on-surface" color should always be `on_background` (#1a1c1d) to maintain the soft, premium feel.
*   **DON'T** use heavy shadows. If a shadow looks like a shadow, it’s too dark. It should look like "ambient occlusion."
*   **DON'T** use standard "system blue" for links. Use `primary` (Crimson) or `tertiary` (Deep Navy) to stay within the university's sophisticated palette.