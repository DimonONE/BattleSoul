# Design Guidelines for BattleSoul RPG Telegram Bot Interface

## Design Approach

**Selected Approach**: Reference-Based with Gaming Focus

This RPG bot interface requires a gaming-first aesthetic that balances fantasy RPG elements with functional data management. Drawing inspiration from modern RPG games (Genshin Impact, Pokemon GO) and gaming platforms (Discord, Steam), while maintaining the clarity needed for statistics and management interfaces.

**Key Design Principles**:
- **Fantasy Gaming Aesthetic**: Bold, adventurous visual language that evokes RPG worlds
- **Clear Information Hierarchy**: Stats and data must be instantly readable despite decorative elements
- **Progressive Disclosure**: Complex information revealed through intuitive tab navigation
- **Character-Driven Design**: User profiles and pets are heroes of the interface

---

## Typography System

**Font Stack**:
- **Primary Display**: "Outfit" or "Poppins" (700-800 weight) - for headers, levels, damage numbers
- **Body Text**: "Inter" or "DM Sans" (400-600 weight) - for descriptions, stats
- **Accent/Numbers**: "Space Mono" or "JetBrains Mono" - for HP/XP values, technical data

**Type Scale**:
- **Hero Numbers** (damage, HP): text-6xl to text-8xl, font-bold
- **Tab Headers**: text-3xl, font-bold
- **Section Titles**: text-2xl, font-semibold
- **Stats Labels**: text-sm, font-medium, uppercase, tracking-wider
- **Stat Values**: text-xl to text-3xl, font-bold
- **Body/Descriptions**: text-base, font-normal
- **Captions**: text-xs to text-sm

---

## Layout System

**Spacing Primitives**: Use Tailwind units of **2, 4, 8, 12, 16** (as in p-2, m-4, gap-8, py-12, px-16)

**Grid Structure**:
```
Container: max-w-7xl mx-auto px-4
Card Spacing: gap-4 for tight grids, gap-8 for breathing room
Section Padding: py-12 md:py-16 for major sections
Component Padding: p-4 to p-8 for cards/containers
```

**Tab Layout Structure**:
- Full-width tab navigation bar at top (sticky position)
- Content area with consistent px-4 md:px-8 horizontal padding
- Each tab implements its own grid system based on content needs

---

## Component Library

### Navigation & Layout

**Tab Navigation Bar**:
- Horizontal layout with three equal-width tabs
- Icons paired with labels (⚔️ Профіль, 🐾 Магазин, 📊 Статистика)
- Active tab indicator (bottom border or pill background)
- Sticky positioning (top-0 sticky z-10)
- Height: h-16, items centered

**Main Container**:
- Full viewport height minus tab bar
- Scrollable content area
- Consistent px-4 md:px-8 py-8 padding

### Profile Tab Components

**User Header Card**:
- Large avatar space (w-24 h-24 md:w-32 md:h-32) with rounded-full
- Username display (text-3xl font-bold)
- Level badge overlaying avatar (top-right corner, text-sm font-bold, px-2 py-1 rounded-full)
- Current status text below username (text-sm, subtle styling)
- Grid layout: flex md:flex-row gap-8, avatar left, info right

**Stats Display Panel**:
- Three-column grid on desktop (grid-cols-1 md:grid-cols-3 gap-4)
- Each stat card: p-4 rounded-lg
  - Label (text-xs uppercase tracking-wider)
  - Large value (text-4xl font-bold)
  - Progress bar if applicable (h-2 rounded-full w-full)

**HP Bar Component**:
- Full-width progress container (h-8 rounded-full, relative)
- Filled portion showing current HP
- HP text overlaid (absolute inset-0, flex items-center justify-center, text-sm font-bold)
- Current/Max format: "250/300 HP"

**XP Progress Bar**:
- Similar to HP bar but h-4
- Shows progress to next level
- Label shows "Lvl 12 → 13" with XP values

**Available Commands List**:
- Grid layout (grid-cols-1 md:grid-cols-2 gap-4)
- Each command card (p-4 rounded-lg):
  - Command emoji (text-3xl)
  - Command name (text-xl font-bold)
  - Description (text-sm)
  - Damage/heal range indicator (text-xs, badge style)

### Shop Tab Components

**Pet Grid**:
- Responsive grid (grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6)
- Card-based layout for each pet

**Pet Card**:
- Vertical card structure (rounded-xl overflow-hidden)
- Pet avatar/image area (aspect-square, large icon or illustration space)
- Pet info section (p-6):
  - Pet name (text-2xl font-bold)
  - Level indicator (text-sm, badge style)
  - HP bar (smaller version, h-3)
  - Strength stat (text-lg font-semibold with icon)
  - Evolution stage indicator (visual dots or progress)
  - Price/purchase button (w-full py-3 rounded-lg font-semibold)

**Pet Evolution Visualization**:
- Horizontal timeline showing evolution stages
- Dots or icons representing each stage
- Current stage highlighted
- Connection lines between stages

**Purchase Button**:
- Full-width within card
- Large touch target (py-3 md:py-4)
- Price displayed prominently (text-lg font-bold)
- Icon indicating currency/type

### Statistics Tab Components

**Leaderboard Table**:
- Full-width table with responsive design
- Sticky header row
- Columns: Rank | Avatar | Username | Level | Wins | Battles | Win Rate
- Alternating row treatment for readability
- Top 3 ranks with special styling (larger text, prominent positioning)
- Current user row highlighted distinctly

**Stats Summary Cards**:
- Grid above leaderboard (grid-cols-2 md:grid-cols-4 gap-4)
- Each card shows single metric:
  - Large number (text-4xl font-bold)
  - Label below (text-sm)
  - Icon representing stat type (text-2xl)

**Battle History Section**:
- Vertical list of recent battles (space-y-4)
- Each battle entry (p-4 rounded-lg):
  - Participants (@user1 vs @user2)
  - Battle type/command used
  - Outcome (win/loss indicator)
  - Damage/heal values
  - Timestamp (text-xs)

### Shared Components

**Icon Integration**:
- Use Font Awesome via CDN for UI icons (menu, stats, settings)
- RPG emoji for game elements (⚔️, 💚, ☠️, 💥, 🐾, 📊, 🌟)
- Size consistency: text-xl for inline icons, text-2xl to text-4xl for feature icons

**Card Pattern**:
- Rounded corners (rounded-lg to rounded-xl)
- Consistent padding (p-4 to p-8)
- Subtle elevation treatment without heavy shadows
- Border treatment for definition

**Button Styles**:
- Primary action: py-3 px-8 rounded-lg font-semibold text-base
- Secondary action: py-2 px-6 rounded-lg font-medium text-sm
- Icon buttons: w-10 h-10 rounded-full flex items-center justify-center
- Hover/active states: subtle transform scale-105 transition

**Badge Components**:
- Level badges: px-3 py-1 rounded-full text-sm font-bold
- Status indicators: px-2 py-1 rounded text-xs font-medium
- Number badges: w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold

---

## Animation Guidelines

**Use Sparingly**:
- Page transitions between tabs: 200ms ease-in-out
- HP/XP bar fill animations: 300ms ease-out when values update
- Pet evolution moment: brief scale animation (scale-110) over 400ms
- Number counters: animate damage/heal values with brief flash (200ms)
- Hover states: transform scale-105 with 150ms transition

**Avoid**:
- Continuous background animations
- Parallax scrolling
- Auto-playing pet animations
- Excessive micro-interactions

---

## Responsive Behavior

**Mobile (base)**:
- Single column layouts
- Stacked stats (grid-cols-1)
- Full-width cards
- Tab navigation remains horizontal with icons + text

**Tablet (md:)**:
- Two-column grids where applicable
- Stats can show 2-across
- Pet shop shows 2-column grid
- Increased padding and spacing

**Desktop (lg:)**:
- Three-column layouts for optimal space usage
- Leaderboard shows all columns
- Pet shop shows 3-column grid
- Maximum container width enforced (max-w-7xl)

---

## Special Considerations

**Real-time Updates**:
- Smooth number transitions when stats update
- Visual pulse/flash effect for incoming updates (200ms highlight flash)
- Toast notifications for battle results (slide in from top-right)

**Gaming Feel**:
- Generous use of RPG emoji throughout interface
- Bold, impactful typography for damage numbers and levels
- Progress bars everywhere relevant (HP, XP, pet growth)
- Achievement-style badges for milestones

**Ukrainian Language**:
- Ensure proper spacing for Cyrillic characters
- All labels and text in Ukrainian
- Emoji placement works with RTL-friendly layouts

This design creates an engaging RPG experience while maintaining the functional clarity needed for managing game stats, pets, and battles. The interface balances fantasy gaming aesthetics with the data management requirements of the dashboard.