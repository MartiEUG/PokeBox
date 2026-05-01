# PokeBox - Figma Setup & Organization Guide

## Initial Figma File Setup

### Step 1: Create Master File
1. Create new Figma file: **"PokeBox_Master.fig"**
2. Set up team library access
3. Enable version history
4. Set up sharing permissions

---

## Page Structure Setup

### Create These Pages (in order):

#### 1. 📋 Project Info & Guidelines
**Purpose:** Project overview and quick reference

**Contents:**
- Project description
- Color palette display
- Typography scale
- Spacing system
- Team contacts
- Version history log

**Frame Setup:**
```
Frame: "Project Cover" (1920x1080)
├── Logo/Title
├── Color Swatches (all primary/secondary colors)
├── Typography Examples
└── Quick Links Section
```

---

#### 2. 🎨 Design System
**Purpose:** Complete design token library

**Sections to Create:**

##### Colors Section
```
Frame: "Colors - Primary" (1200x800)
├── Neon Yellow (#FFD700)
├── Neon Red (#FF3E3E)
├── Neon Blue (#00D4FF)
└── Electric Purple (#A855F7)

Frame: "Colors - Dark Theme" (1200x800)
├── Dark BG (#0A0E27)
├── Dark Card (#131829)
└── Dark Hover (#1A1F3A)

Frame: "Colors - Rarity System" (1200x800)
├── Common (Gray)
├── Rare (Red)
├── Epic (Blue)
├── Legendary (Purple)
���── Mythic (Gold)
```

**How to Set Up:**
1. Create color styles for each
2. Name format: `Color/Primary/Yellow`
3. Apply to sample rectangles
4. Add hex code labels below each

##### Typography Section
```
Frame: "Typography System" (1200x1200)
├── H1 - 48px/700
├── H2 - 36px/700
├── H3 - 24px/600
├── H4 - 20px/600
├── Body - 16px/400
├── Small - 14px/400
└── Tiny - 12px/400
```

**How to Set Up:**
1. Create text styles for each
2. Name format: `Text/Heading/H1`
3. Show example text for each
4. Include size/weight/line-height info

##### Spacing Section
```
Frame: "Spacing Scale" (1000x800)
├── XS: 4px
├── SM: 8px
├── MD: 16px
├── LG: 24px
├── XL: 32px
├── 2XL: 48px
└── 3XL: 64px
```

**How to Set Up:**
1. Create squares showing each size
2. Add measurement labels
3. Show examples in use

##### Effects Section
```
Frame: "Shadows & Glows" (1200x1000)
├── Shadow - Subtle
├── Shadow - Medium
├── Shadow - Large
├── Glow - Yellow
├── Glow - Blue
├── Glow - Red
└── Glow - Purple
```

**How to Set Up:**
1. Create effect styles
2. Name format: `Effect/Shadow/Medium`
3. Apply to sample cards
4. Document blur/spread values

---

#### 3. 🧩 Component Library
**Purpose:** All reusable UI components

**Organization:**

##### Buttons Folder
```
📁 Buttons
├── 🔵 Primary
│   ├── Default
│   ├── Hover
│   ├── Active
│   └── Disabled
├── ⚪ Secondary
│   ├── Default
│   ├── Hover
│   ├── Active
│   └── Disabled
├── 🔴 Danger
│   └── (all states)
└── 👻 Ghost
    └── (all states)
```

**Setup Instructions:**
1. Create component set for each variant
2. Add properties: `State = Default | Hover | Active | Disabled`
3. Use auto-layout (horizontal, 16px padding)
4. Include icon variant property (optional)

**Button Specifications:**
- Height: 40px (SM), 48px (MD), 56px (LG)
- Padding: 16px (SM), 24px (MD), 32px (LG)
- Border-radius: 8px
- Gap between icon/text: 8px

##### Cards Folder
```
📁 Cards
├── Basic Card
├── Case Preview Card
├── Item Display Card
├── Battle Info Card
├── User Profile Card
└── Stat Widget Card
```

**Setup Instructions:**
1. Create component for each type
2. Use auto-layout (vertical, 24px padding)
3. Add property: `Glow = None | Yellow | Blue | Red | Purple`
4. Include hover state variant

**Card Specifications:**
- Padding: 24px
- Border-radius: 12px
- Border: 1px solid #374151
- Background: var(--dark-card)

##### Forms Folder
```
📁 Form Elements
├── Input Text
├── Input Email
├── Input Password
├── Input Search
├── Select Dropdown
├── Checkbox
├── Radio Button
└── Textarea
```

**Setup Instructions:**
1. Create component set for each input type
2. Add states: `State = Default | Focus | Error | Disabled`
3. Use auto-layout
4. Include label option

**Input Specifications:**
- Height: 48px
- Padding: 12px 16px
- Border-radius: 8px
- Border: 1px solid #374151
- Focus: Border #00D4FF

##### Modals Folder
```
📁 Modals
├── Confirmation Modal
├── Case Opening Modal
├── Battle Invite Modal
├── Success Modal
└── Error Modal
```

**Setup Instructions:**
1. Create modal container (600px width)
2. Add overlay background (rgba(0,0,0,0.8))
3. Use auto-layout for content
4. Include close button component

**Modal Specifications:**
- Width: 600px (max)
- Padding: 32px
- Border-radius: 16px
- Backdrop: Blur 8px

##### Navigation Folder
```
📁 Navigation
├── Desktop Header
├── Mobile Header
├── Sidebar
├── Footer
└── Breadcrumbs
```

**Setup Instructions:**
1. Create responsive variants
2. Use auto-layout with proper constraints
3. Include active/inactive states for links
4. Add logo component

##### Badges Folder
```
📁 Badges
├── Rarity
│   ├── Common
│   ├── Rare
│   ├── Epic
│   ├── Legendary
│   └── Mythic
└── Status
    ├── Live
    └── New
```

**Setup Instructions:**
1. Create component set
2. Add property: `Type = Common | Rare | Epic | Legendary | Mythic`
3. Small size: 24px height, 4px border-radius
4. Use rarity colors

##### Progress Bars Folder
```
📁 Progress Bars
├── Horizontal Bar
├── Circular Progress
└── Streak Tracker
```

**Setup Instructions:**
1. Create component with progress property (0-100)
2. Use mask for fill animation
3. Include percentage label

---

#### 4. 📱 UI Screens - Desktop
**Purpose:** All desktop screen designs

**Frame Setup:**
- Desktop frame: **1440x1024px**
- Include header and footer in each
- Use actual components from library
- Show real content (not lorem ipsum)

**Screens to Create:**

##### Landing Page
```
Desktop/Landing (1440x3000)
├── Header (fixed)
├── Hero Section
├── Featured Cases Carousel
├── Live Feed
├── Features Grid
└── Footer
```

##### Cases
```
Desktop/Cases_Catalog (1440x2000)
├── Header
├── Filter Bar
├── Cases Grid (4 columns)
└── Footer

Desktop/Cases_Detail (1440x1200)
├── Header
├── Case Preview (left)
├── Rewards List (right)
└── Footer
```

##### Battles
```
Desktop/Battles_Lobby (1440x2000)
├── Header
├── Create Battle Card
├── Filter Tabs
├── Active Battles Grid
└── Footer

Desktop/Battles_Arena (1440x1000)
├── Header
├── Player 1 Side
├── VS Center
├── Player 2 Side
└── Results Section
```

##### Dashboard
```
Desktop/Dashboard (1440x1800)
├── Header
├── Profile Card
├── Stats Grid
├── Activity Feed
└── Footer
```

##### Marketplace
```
Desktop/Marketplace (1440x2000)
├── Header
├── Filters Sidebar
├── Items Grid
├── Trending Section
└── Footer
```

##### Rewards
```
Desktop/Rewards (1440x2200)
├── Header
├── Daily Bonus
├── Missions Grid
├── Weekly Tiers
├── Monthly Challenges
└── Footer
```

---

#### 5. 📱 UI Screens - Mobile
**Purpose:** Mobile-responsive designs

**Frame Setup:**
- Mobile frame: **375x812px**
- Adapt desktop designs
- Stack elements vertically
- Simplify navigation (hamburger menu)

**Screens to Create:**
- Mobile/Landing
- Mobile/Cases_Catalog
- Mobile/Cases_Detail
- Mobile/Battles
- Mobile/Dashboard
- Mobile/Marketplace
- Mobile/Rewards

**Mobile Considerations:**
- Single column layout
- Larger touch targets (min 48x48px)
- Simplified navigation
- Bottom navigation bar
- Collapsible sections

---

#### 6. 🖼️ Assets Catalog
**Purpose:** Organize all visual assets

**Frame Organization:**

##### Cases Collection
```
Frame: "Cases Library" (2000x2000)
├── Case_Starter_Electric
├── Case_Legend_Fire
├── Case_Champion_Water
├── Case_Master_Psychic
├── Case_Elite_Dragon
└── (8 total cases)
```

**Each case shows:**
- 400x400px thumbnail
- 800x800px preview
- Name label
- Rarity badge
- Export instructions

##### Items Collection
```
Frame: "Items by Rarity" (3000x2000)
├── Common Items Row
├── Rare Items Row
├── Epic Items Row
├── Legendary Items Row
└── Mythic Items Row
```

**Each item shows:**
- 300x300px grid version
- Item name
- Rarity indicator
- Value (credits)

##### Icons Set
```
Frame: "Icon Library" (2000x1500)
├── Navigation Icons
├── Action Icons
├── Status Icons
└── Misc Icons
```

**Each icon:**
- 64x64px base size
- SVG export ready
- Multiple color variants
- Usage label

##### Backgrounds
```
Frame: "Backgrounds" (2000x1500)
├── Hero Gradients
├── Page Backgrounds
├── Patterns
└── Textures
```

**Each background:**
- Full resolution
- Usage context
- Dimensions labeled

---

#### 7. 📦 Export Ready Files
**Purpose:** Production-ready exports

**Organization:**
```
Frame: "Export Guide" (1920x1080)
├── Component Export List
├── Asset Export List
├── Icon Export Settings
└── Export Instructions
```

**Create Export Presets:**
1. Icons: SVG + PNG @2x
2. Images: PNG @2x, @3x
3. Backgrounds: WEBP + PNG fallback

---

## Component Creation Best Practices

### Auto-Layout Setup
1. Enable auto-layout on all containers
2. Set proper constraints
3. Use min/max width when needed
4. Test resize behavior

### Variants Setup
1. Create component set
2. Add properties (State, Size, Type)
3. Name variants clearly
4. Include all necessary states

### Naming Convention
**Format:** `Category/Type/Variant`

**Examples:**
- `Button/Primary/Default`
- `Card/Case Preview/Hover`
- `Input/Text/Focus`
- `Badge/Rarity/Legendary`

### Component Properties to Add
- **State**: Default, Hover, Active, Disabled, Focus, Error
- **Size**: SM, MD, LG
- **Variant**: Primary, Secondary, etc.
- **Icon**: Boolean (show/hide)
- **Type**: Specific to component

---

## Annotations & Documentation

### Add to Each Screen:
1. **Flow arrows** - Show user journey
2. **Notes** - Explain interactions
3. **Specs** - Include measurements
4. **States** - Show hover/active states

### Use Figma Comments:
- Tag developers for specific questions
- Mark areas needing assets
- Note animation requirements
- Document complex interactions

### Create Spec Frames:
```
Frame: "[Screen Name]_Specs"
├── Spacing measurements
├── Color callouts
├── Typography specs
└── Interaction notes
```

---

## Plugin Recommendations

### Essential Plugins:
1. **Iconify** - Import SVG icons
2. **Unsplash** - Stock images for placeholders
3. **Content Reel** - Generate realistic content
4. **Stark** - Accessibility checker
5. **Remove BG** - Image background removal

### Export Plugins:
1. **Export/import Styles** - Share design tokens
2. **Batch Export** - Export multiple assets
3. **SVG Export** - Clean SVG output

---

## Collaboration Setup

### Team Library:
1. Publish components to team library
2. Set up automatic updates
3. Document breaking changes
4. Version component updates

### File Permissions:
- **Designers**: Can edit
- **Developers**: Can view
- **Stakeholders**: Can comment

### Sharing Links:
Create specific view links for:
- Design review
- Developer handoff
- Stakeholder presentation

---

## Quality Checklist

### Before Publishing:
- [ ] All components use styles (not hard-coded colors)
- [ ] Auto-layout applied everywhere possible
- [ ] Variants set up correctly
- [ ] Naming convention followed
- [ ] Comments resolved
- [ ] Export settings configured
- [ ] Documentation complete

### Component Checklist:
- [ ] All states created
- [ ] Properties configured
- [ ] Constraints set
- [ ] Responsive behavior tested
- [ ] Description added

### Screen Checklist:
- [ ] Uses library components
- [ ] Properly named layers
- [ ] Annotations added
- [ ] Specs documented
- [ ] Responsive variants created

---

## Maintenance

### Weekly:
- Review and resolve comments
- Update changed components
- Add new assets as needed
- Sync with development team

### Monthly:
- Audit unused components
- Update documentation
- Create version backup
- Review accessibility

### Per Update:
- Document changes in version history
- Notify team of breaking changes
- Update component descriptions
- Test all variants still work

---

## Troubleshooting

### Component not updating?
1. Check if detached from main
2. Re-publish library
3. Refresh library in other files

### Export not working?
1. Verify export settings
2. Check layer naming (no special characters)
3. Ensure layer is not hidden
4. Try individual export instead of batch

### Auto-layout breaking?
1. Check constraints
2. Verify child elements aren't absolutely positioned
3. Reset auto-layout and reapply

---

## Developer Handoff Checklist

### Provide:
- [ ] Figma link with view access
- [ ] Component library file
- [ ] All assets exported
- [ ] Design tokens JSON
- [ ] Typography files (if custom fonts)
- [ ] Animation specifications
- [ ] Interaction notes
- [ ] Responsive breakpoints documented

### Documentation to Share:
- `/PROJECT_STRUCTURE.md`
- `/ASSET_QUICK_REFERENCE.md`
- This Figma setup guide
- Any component usage notes

---

**Last Updated:** December 11, 2024
**Version:** 1.0
**For:** PokeBox Figma Organization
