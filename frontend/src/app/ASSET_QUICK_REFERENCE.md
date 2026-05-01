# PokeBox - Asset Quick Reference Guide

## Quick Asset Location Finder

### Need a Case Image?
→ `/Assets/Images/Cases/case_[rarity]_[type].png`

**Examples:**
- `case_starter_electric.png`
- `case_legendary_fire.png`
- `case_elite_dragon.png`

**Sizes:** 400x400px (thumbnail), 800x800px (preview)

---

### Need an Item/Reward Image?
→ `/Assets/Images/Items/[Rarity]/item_[rarity]_[name].png`

**Folder Structure:**
- `/Common/` - Gray themed items
- `/Rare/` - Red themed items
- `/Epic/` - Blue themed items
- `/Legendary/` - Purple themed items
- `/Mythic/` - Gold themed items

**Examples:**
- `item_common_spark_gem.png`
- `item_legendary_thunder_stone.png`
- `item_mythic_dragon_scale.png`

**Sizes:** 300x300px (grid), 600x600px (detail)

---

### Need a Background?
→ `/Assets/Backgrounds/[Type]/bg_[page]_[variant].png`

**Types:**
- `/Gradients/` - Color gradients for hero sections
- `/Patterns/` - Repeating patterns for backgrounds
- `/Textures/` - Subtle textures for cards/surfaces

**Examples:**
- `bg_home_hero_gradient.png` (1920x1080px)
- `bg_cases_catalog.png` (1920x1080px)
- `pattern_grid_subtle.png` (512x512px tileable)

---

### Need an Icon?
→ `/Assets/Images/Icons/[Category]/icon_[category]_[name].svg`

**Categories:**
- `/Navigation/` - Menu and page icons
- `/Actions/` - Interactive action icons
- `/Status/` - Status indicators
- `/Misc/` - Utility icons

**Examples:**
- `icon_nav_cases.svg`
- `icon_action_open.svg`
- `icon_status_live.svg`
- `icon_wallet.svg`

**Format:** SVG (preferred), PNG fallback at 64x64px

---

### Need an Avatar?
→ `/Assets/Images/Avatars/avatar_[type]_[number].png`

**Examples:**
- `avatar_default_01.png`
- `avatar_placeholder.png`
- `avatar_frame_legendary.png`

**Size:** 200x200px (display), 64x64px (thumbnail)

---

### Need a Badge/Reward Asset?
→ `/Assets/Rewards/[Type]/[name].png`

**Types:**
- `/Badge/` - Tier badges (Bronze, Silver, Gold, etc.)
- `/Missions/` - Mission icons
- `/Streak/` - Login streak graphics

**Examples:**
- `badge_gold_tier.png`
- `mission_case_master.png`
- `streak_fire_icon.png`

---

### Need a Placeholder?
→ `/Assets/Placeholders/placeholder_[type]_[size].png`

**Available:**
- `placeholder_case_1x1.png` (500x500px)
- `placeholder_item_1x1.png` (400x400px)
- `placeholder_banner_16x9.png` (1920x1080px)
- `placeholder_avatar_circle.png` (200x200px)

---

### Need an Effect/Animation?
→ `/Assets/Effects/[Type]/[name].png`

**Types:**
- `/Particles/` - Particle effects (sparks, glows)
- `/Glows/` - Soft glow overlays
- `/Animations/` - Sprite sheets

**Examples:**
- `particle_spark.png`
- `glow_yellow_soft.png`
- `animation_case_opening_sprite.png`

---

## Component Quick Finder

### Need a Button Component?
→ `/Components/Buttons/button_[variant]_[state].fig`

**Variants:** primary, secondary, danger, ghost
**States:** default, hover, active, disabled

---

### Need a Card Component?
→ `/Components/Cards/card_[type].fig`

**Types:**
- `card_basic.fig` - Standard card
- `card_case_preview.fig` - For case catalog
- `card_item_display.fig` - For items/rewards
- `card_battle_info.fig` - Battle lobby cards
- `card_stat_widget.fig` - Dashboard stats

---

### Need a Form Input?
→ `/Components/Forms/input_[type].fig`

**Types:** text, email, password, search, dropdown, checkbox, radio, textarea

---

### Need a Modal?
→ `/Components/Modals/modal_[type].fig`

**Types:** confirmation, case_opening, battle_invite, success, error

---

### Need a Badge?
→ `/Components/Badges/badge_[type]_[variant].fig`

**Rarity Badges:**
- `badge_rarity_common.fig`
- `badge_rarity_rare.fig`
- `badge_rarity_epic.fig`
- `badge_rarity_legendary.fig`
- `badge_rarity_mythic.fig`

**Status Badges:**
- `badge_status_live.fig`
- `badge_status_new.fig`

---

## UI Screen Quick Finder

### Landing Page Components
→ `/PokeBox_UI/01_Landing_Page/`
- `landing_hero_section.fig`
- `landing_featured_cases_carousel.fig`
- `landing_live_feed.fig`
- `landing_features_grid.fig`

### Cases Pages
→ `/PokeBox_UI/04_Cases/`
- `cases_catalog_grid.fig`
- `cases_detail_view.fig`
- `cases_opening_animation.fig`
- `cases_results_modal.fig`

### Battle Pages
→ `/PokeBox_UI/05_Battles/`
- `battles_lobby.fig`
- `battles_create_modal.fig`
- `battles_1v1_layout.fig`
- `battles_2v2_layout.fig`

### Dashboard
→ `/PokeBox_UI/03_Dashboard/`
- `dashboard_overview.fig`
- `dashboard_profile_card.fig`
- `dashboard_stats_grid.fig`

---

## Color Reference (Quick Copy)

### Primary Colors
```css
--neon-yellow: #FFD700;
--neon-red: #FF3E3E;
--neon-blue: #00D4FF;
--electric-purple: #A855F7;
```

### Dark Theme
```css
--dark-bg: #0A0E27;
--dark-card: #131829;
--dark-hover: #1A1F3A;
```

### Rarity Colors
```css
--common: #9CA3AF;    /* Gray */
--rare: #FF3E3E;      /* Red */
--epic: #00D4FF;      /* Blue */
--legendary: #A855F7; /* Purple */
--mythic: #FFD700;    /* Gold */
```

---

## Standard Sizes Reference

### Spacing Scale
- xs: 4px
- sm: 8px
- md: 16px
- lg: 24px
- xl: 32px
- 2xl: 48px
- 3xl: 64px

### Border Radius
- sm: 4px
- md: 8px
- lg: 12px
- xl: 16px
- full: 9999px (circle)

### Breakpoints
- Mobile: 375px - 767px
- Tablet: 768px - 1023px
- Desktop: 1024px+
- Max Width: 1440px

---

## Common Animation Values

### Duration
- Micro: 150ms (hover effects)
- Standard: 300ms (most transitions)
- Slow: 500ms (page transitions)

### Easing
- Default: ease-out
- Bouncy: spring(1, 100, 10, 0)
- Smooth: cubic-bezier(0.4, 0, 0.2, 1)

---

## Figma Export Settings

### For Web Development
1. Select layer/component
2. Click "+" in Export section
3. Choose settings:
   - **Icons**: SVG
   - **Images**: PNG at 2x
   - **Backgrounds**: WEBP or PNG

### Batch Export
1. Select all assets in frame
2. Export → Export [name]
3. Use suffix for retina: @2x, @3x

### Naming on Export
- Remove spaces (use underscores)
- Use lowercase
- Include variant if applicable
- Example: `button_primary_hover@2x.png`

---

## File Checklist Before Handoff

### Design System
- [ ] All colors defined in styles
- [ ] Typography system documented
- [ ] Spacing tokens defined
- [ ] Component library complete

### Assets
- [ ] All case images created/placed
- [ ] All item images by rarity
- [ ] All icons in SVG format
- [ ] All backgrounds optimized
- [ ] Placeholders for missing assets

### Components
- [ ] All button states
- [ ] All card variants
- [ ] All form elements
- [ ] All modals
- [ ] All navigation elements

### Screens
- [ ] Desktop versions complete
- [ ] Mobile versions complete
- [ ] Responsive behavior defined
- [ ] Interaction states shown

### Documentation
- [ ] Component usage notes
- [ ] Asset specifications
- [ ] Color palette exported
- [ ] Font files provided
- [ ] Animation specs documented

---

## Quick Tips

### Organizing Layers in Figma
1. Name everything clearly
2. Group related elements
3. Use frames for sections
4. Lock background elements
5. Hide guides before sharing

### Creating Placeholders
1. Create artboard at required size
2. Fill with rarity color at 20% opacity
3. Add centered icon/text
4. Add subtle border
5. Export as PNG

### Maintaining Consistency
1. Use components for everything
2. Apply styles, not manual colors
3. Use auto-layout when possible
4. Keep naming convention strict
5. Document any custom decisions

---

## Support & Questions

### Can't find an asset?
Check `/Assets/Placeholders/` for temporary replacements

### Need a new asset type?
Follow naming convention: `[category]_[type]_[variant].ext`

### Component not working?
Verify it's using proper auto-layout and constraints

### Export not correct?
Double-check export settings (format, size, naming)

---

**Last Updated:** December 11, 2024
**Version:** 1.0
**For:** PokeBox UI/UX Project
