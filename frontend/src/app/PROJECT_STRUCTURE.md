# PokeBox - Complete File Organization System

## Project Overview
PokeBox is a gaming loot-box platform inspired by KeyDrop and SkinClub with a Pokémon-themed aesthetic. This document defines the complete folder structure, naming conventions, and asset placement guidelines for design and development.

---

## Main Project Folder Structure

```
PokeBox/
├── PokeBox_UI/
│   ├── 01_Landing_Page/
│   ├── 02_Authentication/
│   ├── 03_Dashboard/
│   ├── 04_Cases/
│   ├── 05_Battles/
│   ├── 06_Marketplace/
│   ├── 07_Rewards/
│   ├── 08_Support/
│   └── 09_Settings/
│
├── Components/
│   ├── Buttons/
│   ├── Cards/
│   ├── Forms/
│   ├── Modals/
│   ├── Navigation/
│   ├── Badges/
│   ├── Progress_Bars/
│   ├── Tooltips/
│   └── Notifications/
│
├── Assets/
│   ├── Images/
│   ├── Placeholders/
│   ├── Backgrounds/
│   └── Effects/
│
├── Branding/
│   ├── Logo/
│   ├── Color_Palette/
│   ├── Typography/
│   └── Brand_Guidelines/
│
├── Animations/
│   ├── Case_Opening/
│   ├── Battle_Effects/
│   ├── Transitions/
│   └── Micro_Interactions/
│
├── Wireframes/
│   ├── Low_Fidelity/
│   └── User_Flows/
│
└── Final_Designs/
    ├── Desktop/
    ├── Mobile/
    └── Export_Ready/
```

---

## Detailed Folder Breakdown

### 1. `/PokeBox_UI` - All User Interface Screens

#### 01_Landing_Page/
- `landing_hero_section.fig`
- `landing_featured_cases_carousel.fig`
- `landing_live_feed.fig`
- `landing_features_grid.fig`
- `landing_footer.fig`

#### 02_Authentication/
- `auth_login_page.fig`
- `auth_register_page.fig`
- `auth_forgot_password.fig`
- `auth_email_verification.fig`

#### 03_Dashboard/
- `dashboard_overview.fig`
- `dashboard_profile_card.fig`
- `dashboard_stats_grid.fig`
- `dashboard_activity_feed.fig`
- `dashboard_sidebar.fig`

#### 04_Cases/
- `cases_catalog_grid.fig`
- `cases_filter_bar.fig`
- `cases_detail_view.fig`
- `cases_opening_animation.fig`
- `cases_results_modal.fig`
- `cases_probability_display.fig`

#### 05_Battles/
- `battles_lobby.fig`
- `battles_create_modal.fig`
- `battles_active_list.fig`
- `battles_1v1_layout.fig`
- `battles_2v2_layout.fig`
- `battles_results_screen.fig`

#### 06_Marketplace/
- `marketplace_item_grid.fig`
- `marketplace_filter_sidebar.fig`
- `marketplace_item_detail.fig`
- `marketplace_trending_section.fig`
- `marketplace_my_listings.fig`

#### 07_Rewards/
- `rewards_daily_bonus.fig`
- `rewards_missions_list.fig`
- `rewards_weekly_tiers.fig`
- `rewards_monthly_challenges.fig`
- `rewards_login_streak.fig`

#### 08_Support/
- `support_faq_section.fig`
- `support_contact_form.fig`
- `support_live_chat.fig`
- `support_ticket_system.fig`

#### 09_Settings/
- `settings_account.fig`
- `settings_preferences.fig`
- `settings_notifications.fig`
- `settings_security.fig`

---

### 2. `/Components` - Reusable UI Components

#### Buttons/
- `button_primary.fig`
- `button_secondary.fig`
- `button_danger.fig`
- `button_ghost.fig`
- `button_icon_only.fig`
- `button_states.fig` (hover, active, disabled)

#### Cards/
- `card_basic.fig`
- `card_case_preview.fig`
- `card_item_display.fig`
- `card_battle_info.fig`
- `card_user_profile.fig`
- `card_stat_widget.fig`

#### Forms/
- `input_text.fig`
- `input_email.fig`
- `input_password.fig`
- `input_search.fig`
- `select_dropdown.fig`
- `checkbox.fig`
- `radio_button.fig`
- `textarea.fig`

#### Modals/
- `modal_confirmation.fig`
- `modal_case_opening.fig`
- `modal_battle_invite.fig`
- `modal_success.fig`
- `modal_error.fig`

#### Navigation/
- `navbar_desktop.fig`
- `navbar_mobile.fig`
- `sidebar_dashboard.fig`
- `footer_full.fig`
- `breadcrumbs.fig`

#### Badges/
- `badge_rarity_common.fig`
- `badge_rarity_rare.fig`
- `badge_rarity_epic.fig`
- `badge_rarity_legendary.fig`
- `badge_rarity_mythic.fig`
- `badge_status_live.fig`
- `badge_status_new.fig`

#### Progress_Bars/
- `progress_bar_horizontal.fig`
- `progress_bar_circular.fig`
- `progress_bar_loading.fig`
- `progress_streak_tracker.fig`

#### Tooltips/
- `tooltip_basic.fig`
- `tooltip_info.fig`
- `tooltip_probability.fig`

#### Notifications/
- `notification_success.fig`
- `notification_error.fig`
- `notification_warning.fig`
- `notification_info.fig`
- `notification_toast.fig`

---

### 3. `/Assets` - Visual Assets Structure

```
Assets/
├── Images/
│   ├── Cases/
│   │   ├── case_starter_electric.png
│   │   ├── case_legend_fire.png
│   │   ├── case_champion_water.png
│   │   ├── case_master_psychic.png
│   │   ├── case_elite_dragon.png
│   │   ├── case_bundle_grass.png
│   │   ├── case_collection_ice.png
│   │   └── case_spirit_fighting.png
│   │
│   ├── Items/
│   │   ├── Common/
│   │   │   ├── item_common_spark_gem.png
│   │   │   ├── item_common_water_drop.png
│   │   │   └── item_common_leaf_token.png
│   │   ├── Rare/
│   │   │   ├── item_rare_fire_crystal.png
│   │   │   ├── item_rare_electric_crystal.png
│   │   │   └── item_rare_grass_seed.png
│   │   ├── Epic/
│   │   │   ├── item_epic_lightning_bolt.png
│   │   │   ├── item_epic_water_gem.png
│   │   │   └── item_epic_psychic_orb.png
│   │   ├── Legendary/
│   │   │   ├── item_legendary_thunder_stone.png
│   │   │   ├── item_legendary_ice_shard.png
│   │   │   └── item_legendary_flame_core.png
│   │   └── Mythic/
│   │       ├── item_mythic_dragon_scale.png
│   │       ├── item_mythic_master_orb.png
│   │       └── item_mythic_rainbow_feather.png
│   │
│   ├── Backgrounds/
│   │   ├── bg_home_hero_gradient.png
│   │   ├── bg_cases_catalog.png
│   │   ├── bg_battles_arena.png
│   │   ├── bg_marketplace.png
│   │   ├── bg_dashboard.png
│   │   ├── bg_login_register.png
│   │   ├── bg_particle_effects.png
│   │   └── bg_texture_noise.png
│   │
│   ├── Avatars/
│   │   ├── avatar_default_01.png
│   │   ├── avatar_default_02.png
│   │   ├── avatar_default_03.png
│   │   ├── avatar_placeholder.png
│   │   └── avatar_frame_legendary.png
│   │
│   ├── Icons/
│   │   ├── Navigation/
│   │   │   ├── icon_nav_home.svg
│   │   │   ├── icon_nav_cases.svg
│   │   │   ├── icon_nav_battles.svg
│   │   │   ├── icon_nav_rewards.svg
│   │   │   ├── icon_nav_marketplace.svg
│   │   │   └── icon_nav_support.svg
│   │   ├── Actions/
│   │   │   ├── icon_action_open.svg
│   │   │   ├── icon_action_buy.svg
│   │   │   ├── icon_action_sell.svg
│   │   │   ├── icon_action_trade.svg
│   │   │   └── icon_action_gift.svg
│   │   ├── Status/
│   │   │   ├── icon_status_live.svg
│   │   │   ├── icon_status_pending.svg
│   │   │   ├── icon_status_success.svg
│   │   │   └── icon_status_error.svg
│   │   └── Misc/
│   │       ├── icon_wallet.svg
│   │       ├── icon_settings.svg
│   │       ├── icon_notification.svg
│   │       └── icon_search.svg
│   │
│   └── Rewards/
│       ├── Badge/
│       │   ├── badge_bronze_tier.png
│       │   ├── badge_silver_tier.png
│       │   ├── badge_gold_tier.png
│       │   ├── badge_platinum_tier.png
│       │   └── badge_diamond_tier.png
│       ├── Missions/
│       │   ├── mission_daily_bonus.png
│       │   ├── mission_case_master.png
│       │   ├── mission_battle_champion.png
│       │   └── mission_marketplace_mogul.png
│       └── Streak/
│           ├── streak_fire_icon.png
│           └── streak_calendar_marker.png
│
├── Placeholders/
│   ├── placeholder_case_1x1.png (500x500px)
│   ├── placeholder_item_1x1.png (400x400px)
│   ├── placeholder_banner_16x9.png (1920x1080px)
│   ├── placeholder_avatar_circle.png (200x200px)
│   └── placeholder_icon_64x64.png
│
├── Backgrounds/
│   ├── Gradients/
│   │   ├── gradient_yellow_blue.png
│   │   ├── gradient_red_purple.png
│   │   ├── gradient_blue_purple.png
│   │   └── gradient_rainbow.png
│   ├── Patterns/
│   │   ├── pattern_grid_subtle.png
│   │   ├── pattern_dots.png
│   │   └── pattern_noise_overlay.png
│   └── Textures/
│       ├── texture_dark_card.png
│       └── texture_glass_morphism.png
│
└── Effects/
    ├── Particles/
    │   ├── particle_spark.png
    │   ├── particle_glow.png
    │   └── particle_star.png
    ├── Glows/
    │   ├── glow_yellow_soft.png
    │   ├── glow_blue_soft.png
    │   ├── glow_red_soft.png
    │   └── glow_purple_soft.png
    └── Animations/
        ├── animation_case_opening_sprite.png
        ├── animation_coin_flip.png
        └── animation_confetti.png
```

---

## Naming Conventions

### General Rules
- **Use lowercase only**
- **Separate words with underscores (_)**
- **Be descriptive but concise**
- **Include context/category prefix**
- **Include size/variant suffix when applicable**

### Examples by Category

#### Cases
Format: `case_[rarity]_[type]_[variant].png`
- `case_starter_electric_01.png`
- `case_legendary_fire_premium.png`
- `case_epic_water_bundle.png`

#### Items
Format: `item_[rarity]_[name]_[variant].png`
- `item_common_spark_gem.png`
- `item_legendary_thunder_stone_animated.png`
- `item_mythic_dragon_scale_glow.png`

#### Backgrounds
Format: `bg_[page]_[type]_[variant].png`
- `bg_home_gradient_hero.png`
- `bg_cases_pattern_subtle.png`
- `bg_battles_texture_dark.png`

#### Icons
Format: `icon_[category]_[name].svg`
- `icon_nav_cases.svg`
- `icon_action_open.svg`
- `icon_status_live.svg`

#### Components
Format: `comp_[type]_[name]_[state].fig`
- `comp_button_primary_hover.fig`
- `comp_card_case_preview.fig`
- `comp_modal_confirmation.fig`

#### UI Screens
Format: `screen_[section]_[page]_[variant].fig`
- `screen_home_landing_desktop.fig`
- `screen_cases_catalog_mobile.fig`
- `screen_battles_arena_1v1.fig`

---

## Asset Specifications

### Image Sizes

#### Cases
- **Thumbnail**: 400x400px
- **Preview**: 800x800px
- **Detail View**: 1200x1200px
- Format: PNG with transparency

#### Items
- **Grid View**: 300x300px
- **Detail View**: 600x600px
- **Inventory Icon**: 128x128px
- Format: PNG with transparency

#### Backgrounds
- **Desktop Hero**: 1920x1080px
- **Mobile Hero**: 1080x1920px
- **Patterns**: 512x512px (tileable)
- Format: PNG or WEBP

#### Avatars
- **Display**: 200x200px
- **Thumbnail**: 64x64px
- Format: PNG or JPEG (circular crop)

#### Icons
- **Base Size**: 64x64px
- **Export Sizes**: 16px, 24px, 32px, 48px, 64px
- Format: SVG preferred, PNG fallback

### Color Specifications

#### Primary Palette
```
--neon-yellow: #FFD700 (Electric/Thunder)
--neon-red: #FF3E3E (Fire/Fighting)
--neon-blue: #00D4FF (Water/Ice)
--electric-purple: #A855F7 (Psychic/Dragon)
```

#### Secondary Palette
```
--dark-bg: #0A0E27
--dark-card: #131829
--dark-hover: #1A1F3A
--gray-text: #9CA3AF
--white-text: #FFFFFF
```

#### Rarity Colors
```
Common: #9CA3AF (Gray)
Rare: #FF3E3E (Red)
Epic: #00D4FF (Blue)
Legendary: #A855F7 (Purple)
Mythic: #FFD700 (Gold)
```

---

## Figma Organization Structure

### Master Figma File: "PokeBox_Master.fig"

```
Pages in Figma:
├── 📋 Project Info & Guidelines
├── 🎨 Design System
│   ├── Colors
│   ├── Typography
│   ├── Spacing
│   └── Effects
├── 🧩 Component Library
│   ├── Buttons
│   ├── Cards
│   ├── Forms
│   ├── Modals
│   └── Navigation
├── 📱 UI Screens - Desktop
│   ├── Landing Page
│   ├── Cases
│   ├── Battles
│   ├── Marketplace
│   └── Dashboard
├── 📱 UI Screens - Mobile
│   ├── Landing Page
│   ├── Cases
│   ├── Battles
│   └── Marketplace
├── 🖼️ Assets Catalog
│   ├── Cases Collection
│   ├── Items Collection
│   ├── Icons Set
│   └── Backgrounds
└── 📦 Export Ready Files
```

### Figma Component Naming
- Use `/` for hierarchy: `Button/Primary/Default`
- Include variants: `Button/Primary/Hover`, `Button/Primary/Active`
- Group related states together

### Auto-Layout Settings
- **Padding**: Use multiples of 4 (8px, 16px, 24px)
- **Spacing**: Use multiples of 4 or 8
- **Grid**: 8px baseline grid
- **Container**: Max-width 1440px for desktop

### Frames Organization
```
Frame Naming:
- Desktop: 1440x1024 → "Desktop/[Page Name]"
- Tablet: 768x1024 → "Tablet/[Page Name]"
- Mobile: 375x812 → "Mobile/[Page Name]"
```

---

## Asset Placement Guide

### Where Assets Are Used

#### Landing Page
- **Hero Background**: `/Assets/Backgrounds/bg_home_hero_gradient.png`
- **Featured Cases**: `/Assets/Images/Cases/case_*.png`
- **Live Feed Icons**: `/Assets/Icons/icon_status_live.svg`

#### Cases Catalog
- **Case Thumbnails**: `/Assets/Images/Cases/case_*.png`
- **Background**: `/Assets/Backgrounds/bg_cases_catalog.png`
- **Rarity Badges**: `/Components/Badges/badge_rarity_*.fig`

#### Case Detail View
- **Case Preview**: `/Assets/Images/Cases/case_*_preview.png`
- **Item Rewards**: `/Assets/Images/Items/item_*.png`
- **Opening Animation**: `/Assets/Effects/Animations/animation_case_opening.png`

#### Battles
- **Arena Background**: `/Assets/Backgrounds/bg_battles_arena.png`
- **User Avatars**: `/Assets/Images/Avatars/avatar_*.png`
- **VS Icon**: `/Assets/Icons/icon_battles_vs.svg`

#### Marketplace
- **Item Grid**: `/Assets/Images/Items/item_*.png`
- **Placeholder**: `/Assets/Placeholders/placeholder_item_1x1.png`
- **Filter Icons**: `/Assets/Icons/Misc/icon_filter.svg`

#### Dashboard
- **User Avatar**: `/Assets/Images/Avatars/avatar_*.png`
- **Stat Icons**: `/Assets/Icons/icon_wallet.svg`, etc.
- **Background**: `/Assets/Backgrounds/bg_dashboard.png`

#### Rewards
- **Badge Tiers**: `/Assets/Rewards/Badge/badge_*_tier.png`
- **Mission Icons**: `/Assets/Rewards/Missions/mission_*.png`
- **Streak Tracker**: `/Assets/Rewards/Streak/streak_*.png`

---

## Development Handoff Checklist

### Export Settings
- [ ] All icons exported as SVG
- [ ] Images exported at 1x, 2x, 3x (@2x, @3x suffixes)
- [ ] Components exported with proper naming
- [ ] Color styles documented with hex codes
- [ ] Typography styles documented with font families and sizes

### Design Tokens to Export
```json
{
  "colors": {
    "primary": "#FFD700",
    "secondary": "#00D4FF",
    "danger": "#FF3E3E",
    "background": "#0A0E27"
  },
  "spacing": {
    "xs": "4px",
    "sm": "8px",
    "md": "16px",
    "lg": "24px",
    "xl": "32px"
  },
  "borderRadius": {
    "sm": "4px",
    "md": "8px",
    "lg": "12px",
    "xl": "16px"
  }
}
```

### Component Export List
- All buttons with states
- All card variants
- All form inputs
- Modal templates
- Navigation components
- Badge variations

### Asset Export List
- All case images (optimized PNG)
- All item images by rarity
- All icons (SVG + PNG fallback)
- All backgrounds
- All placeholder images

---

## Placeholder Image Guidelines

### When to Use Placeholders
- During initial wireframing
- When specific artwork is not available
- For template/example screens
- For development without final assets

### Placeholder Requirements
- **Must include**: Dimensions, context label, rarity indicator
- **Format**: PNG with 50% opacity overlay showing info
- **Color**: Match rarity color scheme
- **Text**: Centered label like "LEGENDARY CASE" or "EPIC ITEM"

### Creating Placeholders
1. Use base color from rarity palette
2. Add subtle gradient
3. Include icon representing category
4. Add centered text label
5. Apply subtle border

Example:
```
Placeholder: case_legendary_placeholder.png
- Background: Purple gradient (#A855F7)
- Icon: Pokéball silhouette (center)
- Text: "LEGENDARY CASE"
- Border: 2px solid rgba(168, 85, 247, 0.5)
```

---

## Version Control & File Management

### File Naming for Versions
- Use date stamps: `pokebox_v1_2024_12_11.fig`
- Keep iteration history: `pokebox_v1`, `pokebox_v2`, etc.
- Archive old versions in separate folder

### Backup Strategy
- Daily Figma auto-save enabled
- Weekly manual backup to cloud storage
- Version history maintained for 30 days

### Collaboration Notes
- Use Figma comments for feedback
- Tag team members with @mentions
- Create separate branches for experiments
- Merge to main file after approval

---

## Additional Resources

### Typography System
**Primary Font**: Inter (Google Fonts)
- Headings: 700 (Bold)
- Body: 400 (Regular)
- UI Elements: 500 (Medium)

**Font Sizes**:
- H1: 48px
- H2: 36px
- H3: 24px
- H4: 20px
- Body: 16px
- Small: 14px
- Tiny: 12px

### Shadow System
```
Subtle: 0 2px 4px rgba(0, 0, 0, 0.1)
Medium: 0 4px 8px rgba(0, 0, 0, 0.15)
Large: 0 8px 16px rgba(0, 0, 0, 0.2)
Glow Yellow: 0 0 20px rgba(255, 215, 0, 0.5)
Glow Blue: 0 0 20px rgba(0, 212, 255, 0.5)
Glow Purple: 0 0 20px rgba(168, 85, 247, 0.5)
```

### Animation Timing
- Fast: 150ms (micro-interactions)
- Medium: 300ms (standard transitions)
- Slow: 500ms (page transitions)
- Easing: ease-out for entries, ease-in for exits

---

## Contact & Support

For questions about this structure:
- Design Lead: [Name]
- Development Lead: [Name]
- Project Manager: [Name]

Last Updated: December 11, 2024
Version: 1.0
