# Canteen Registry App Design Guidelines

## Design Approach
**Selected Approach**: Design System Approach (Material Design)
**Justification**: This is a utility-focused application for canteen staff requiring efficiency, clarity, and data entry accuracy. Material Design's form components and clear visual hierarchy are ideal for this functional context.

## Core Design Elements

### A. Color Palette
**Primary Colors:**
- Light mode: 25 85% 53% (Modern blue for trust and professionalism)
- Dark mode: 25 75% 65% (Softer blue variant)

**Background Colors:**
- Light mode: 210 20% 98% (Clean off-white)
- Dark mode: 220 13% 18% (Professional dark gray)

**Success/Error States:**
- Success: 142 71% 45% (Green for form confirmations)
- Error: 0 84% 60% (Red for validation errors)

### B. Typography
**Font Family**: Inter (Google Fonts)
- Primary text: 400 weight for body content
- Headers: 600 weight for form labels and section titles
- Input labels: 500 weight for clarity

**Font Sizes:**
- Form labels: text-sm
- Input text: text-base
- Headers: text-lg
- Success messages: text-sm

### C. Layout System
**Spacing Primitives**: Tailwind units of 3, 4, 6, and 8
- Form spacing: p-6 for main container
- Input spacing: mb-4 between form fields
- Button margins: mt-6 for primary actions
- Card padding: p-8 for form containers

### D. Component Library

**Forms & Inputs:**
- Clean bordered inputs with focus states
- Dropdown selectors for Company and Meal fields
- Number input with validation for Amount field
- Clear field labels positioned above inputs
- Inline validation messages below each field

**Buttons:**
- Primary: Solid Material Design button for form submission
- Secondary: Outlined button for reset/cancel actions
- Consistent padding and rounded corners

**Data Display:**
- Simple card layout for the input form
- Clean table layout for any data viewing (future enhancement)
- Success confirmation cards with subtle shadows

**Navigation:**
- Minimal header with app title
- Breadcrumb navigation if multiple pages are added

### E. Layout Structure
**Single Page Application:**
- Centered form card on clean background
- Maximum width container for optimal reading
- Generous whitespace around form elements
- Mobile-responsive design with stacked layout

**Form Organization:**
- Logical field grouping (Personal info, Meal details, Payment)
- Clear visual separation between sections
- Progress indication if form becomes multi-step

### Accessibility & Usability
- High contrast ratios for all text elements
- Clear focus indicators for keyboard navigation
- Descriptive labels and placeholder text
- Error states with both color and text indicators
- Touch-friendly button sizes for tablet use

### Key Design Principles
1. **Clarity First**: Every element serves the core data entry function
2. **Error Prevention**: Immediate validation feedback
3. **Efficiency**: Minimal clicks and clear navigation paths
4. **Professional Appearance**: Clean, trustworthy interface suitable for workplace use

This design prioritizes functionality and ease of use for canteen staff while maintaining a professional, modern appearance that instills confidence in the data collection process.