# AFH Brand Guidelines - TailwindCSS Implementation

## 🎨 Brand Colors

### Primary Colors

```css
/* Deep Orange - Primary Brand Color */
--afh-orange: #f26729 (R242 G104 B42) /* Blue Gray - Secondary Brand Color */
  --afh-blue: #313e48 (R49 G62 B72) /* White - Complementary Color */
  --afh-white: #ffffff (R255 G255 B255);
```

### TailwindCSS Usage

```jsx
// Primary Orange
<div className="bg-afh-orange text-white">
<div className="text-afh-orange border-afh-orange">

// Secondary Blue
<div className="bg-afh-blue text-white">
<div className="text-afh-blue border-afh-blue">

// Semantic Colors
<div className="bg-primary"> // Maps to afh-orange
<div className="text-secondary"> // Maps to afh-blue
```

### Color Variations Available

- `afh-orange-50` through `afh-orange-900` (full palette)
- `afh-blue-50` through `afh-blue-900` (full palette)
- Opacity modifiers: `bg-afh-orange/20`, `text-afh-blue/80`

---

## 📝 Typography

### Font Hierarchy

```css
Primary Font: Poppins (Regular 400, Medium 500, Semibold 600, Bold 700)
Secondary Font: Roboto, Century Gothic (fallbacks)
```

### TailwindCSS Classes

```jsx
// Font Families
<div className="font-primary">   // Poppins
<div className="font-secondary"> // Roboto/Century Gothic
<div className="font-heading">   // Poppins for headings
<div className="font-body">      // Poppins for body text

// Headings (automatically styled)
<h1> // text-4xl md:text-5xl lg:text-6xl font-semibold text-afh-blue
<h2> // text-3xl md:text-4xl font-semibold text-afh-blue
<h3> // text-2xl md:text-3xl font-semibold text-afh-blue

// Font Weights
<div className="font-normal">    // 400 - Poppins Regular
<div className="font-medium">    // 500 - Poppins Medium
<div className="font-semibold">  // 600 - Poppins Semibold
<div className="font-bold">      // 700 - Poppins Bold
```

---

## 🧩 Pre-built Components

### Buttons

```jsx
// Primary Button (Orange)
<button className="btn-primary">Get Started</button>

// Secondary Button (Blue)
<button className="btn-secondary">Learn More</button>

// Outline Button
<button className="btn-outline">View Gallery</button>
```

### Cards

```jsx
// Basic Card
<div className="card">
  <div className="p-6">Content here</div>
</div>

// Card with Hover Effect
<div className="card card-hover">
  <div className="p-6">Hoverable content</div>
</div>
```

### Forms

```jsx
// Form Label
<label className="form-label">Artist Name</label>

// Form Input
<input className="form-input" type="text" placeholder="Enter name" />
```

### Layout

```jsx
// AFH Container
<div className="container-afh">Content with proper padding</div>

// Section Padding
<section className="section-padding">Consistent vertical spacing</section>

// Gallery Grid
<div className="gallery-grid">
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</div>
```

---

## 🎭 Animations & Effects

### CSS Classes Available

```jsx
// Fade In Animation
<div className="animate-fade-in">Fades in smoothly</div>

// Slide Up Animation
<div className="animate-slide-up">Slides up from bottom</div>

// Hover Effects
<div className="hover:shadow-afh-lg hover:-translate-y-1 transition-all duration-350">
```

### Shadows

```jsx
<div className="shadow-afh">      // Standard AFH shadow
<div className="shadow-afh-lg">   // Larger AFH shadow
```

---

## 🎯 Brand Utility Classes

### Quick Brand Applications

```jsx
// Text Colors
<span className="text-brand-primary">   // AFH Orange text
<span className="text-brand-secondary"> // AFH Blue text

// Background Colors
<div className="bg-brand-primary">      // AFH Orange background
<div className="bg-brand-secondary">    // AFH Blue background

// Hero Section Background
<section className="hero-gradient">     // Orange/Blue gradient
```

---

## 📐 Spacing & Layout Guidelines

### Container Sizes

```jsx
// Responsive container with proper padding
<div className="container-afh">
  // Automatically centers and adds responsive padding:
  // DEFAULT: 1rem, SM: 2rem, LG: 4rem, XL: 5rem, 2XL: 6rem
```

### Section Spacing

```jsx
// Standard section vertical padding
<section className="section-padding"> // py-16 lg:py-24
```

### Custom Spacing

- All standard Tailwind spacing values available
- Additional: `spacing-18` (4.5rem), `spacing-88` (22rem), `spacing-128` (32rem)

---

## ♿ Accessibility Features

### Focus States

- All interactive elements have AFH orange focus rings
- `*:focus-visible { outline: 2px solid #F26729; }`

### Color Contrast

- All color combinations meet WCAG AA standards
- Text on AFH orange/blue backgrounds uses white for maximum contrast

### Typography Scale

- Responsive typography that scales appropriately across devices
- Proper line heights for readability

---

## 🚀 Usage Examples

### Complete Page Layout

```jsx
export default function ExamplePage() {
  return (
    <div className="section-padding">
      {/* Hero Section */}
      <header className="hero-gradient rounded-2xl section-padding mb-16 text-center">
        <h1 className="text-brand-secondary mb-6">
          Page Title
          <span className="text-brand-primary block">With Highlight</span>
        </h1>
        <p className="text-xl text-afh-blue/80 mb-8">
          Descriptive text with proper opacity
        </p>
        <div className="flex gap-4 justify-center">
          <button className="btn-primary">Primary Action</button>
          <button className="btn-outline">Secondary Action</button>
        </div>
      </header>

      {/* Content Grid */}
      <section className="gallery-grid">
        <div className="card card-hover p-6">
          <h3 className="mb-4">Card Title</h3>
          <p className="text-afh-blue/70">Card content with proper opacity</p>
        </div>
        {/* More cards... */}
      </section>
    </div>
  )
}
```

### Form Example

```jsx
<form className="space-y-6">
  <div>
    <label className="form-label">Artist Name</label>
    <input className="form-input" type="text" required />
  </div>

  <div>
    <label className="form-label">Artwork Title</label>
    <input className="form-input" type="text" required />
  </div>

  <button className="btn-primary w-full">Submit Artwork</button>
</form>
```

---

## 📱 Responsive Breakpoints

Using TailwindCSS default breakpoints:

- `sm`: 640px and up
- `md`: 768px and up
- `lg`: 1024px and up
- `xl`: 1280px and up
- `2xl`: 1536px and up

### Example Responsive Usage

```jsx
<div className="text-sm md:text-base lg:text-lg">
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
<div className="p-4 md:p-6 lg:p-8">
```

---

## 🔧 Development Notes

### Google Fonts Integration

- Fonts are loaded via Next.js font optimization
- Poppins weights: 400, 500, 600, 700
- Automatic font display swap for performance

### CSS Variables

- All brand colors available as CSS custom properties
- Supports both light and dark theme variations
- Easy to override for theme customization

### Component Organization

- Base styles in `@layer base`
- Component styles in `@layer components`
- Utility overrides in `@layer utilities`

This setup provides a solid foundation that matches AFH brand guidelines while maintaining flexibility for development.
