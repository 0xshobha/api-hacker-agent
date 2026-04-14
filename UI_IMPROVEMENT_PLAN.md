# API Hacker Agent - UI Improvement Plan

## Current State Analysis

### Pain Points
1. **Cluttered single-page layout** - All features crammed into one view
2. **Basic visual design** - Default Tailwind, no custom theme
3. **Poor feedback** - No loading states, animations, or progress indicators
4. **Hidden features** - Laso Finance, Build with Locus buried in modals
5. **No dark mode** - Modern apps need theme switching
6. **Weak information hierarchy** - Logs, results, tools all compete for attention

## Phase 1: Layout & Navigation (High Impact)

### 1.1 Sidebar Navigation
```
┌─────────────────────────────────────────────────────┐
│  🤖 API Hacker              │  Main Content Area     │
│  ─────────────────────────  │                        │
│  🏠 Dashboard                │                        │
│  🎯 New Task                 │                        │
│  💼 Tools Catalog            │                        │
│  💳 Laso Finance             │                        │
│  🚀 Build & Deploy           │                        │
│  ─────────────────────────  │                        │
│  📊 Execution History        │                        │
│  ⚙️ Settings                 │                        │
│                              │                        │
│  [Wallet: $X.XX USDC]        │                        │
└──────────────────────────────┴────────────────────────┘
```

**Implementation:**
- Create `Sidebar` component with navigation items
- Use `useState` for active tab
- Collapsible on mobile (hamburger menu)

### 1.2 Dashboard Overview
**New landing page showing:**
- Quick stats (tasks completed, credits used, tools available)
- Recent execution history preview
- Quick action buttons ("New Task", "Browse Tools", "Check Balance")
- System status (wallet connected?, credits available)

### 1.3 Dedicated Feature Pages
- `/task` - Task submission with full-screen focus
- `/tools` - Browse all 89 tools with filtering/search
- `/laso` - Laso Finance operations (full page, not modal)
- `/deploy` - Build with Locus deployment interface
- `/history` - Execution logs with filtering

## Phase 2: Visual Design System

### 2.1 Design Tokens
```css
/* Color System */
--color-primary: #6366f1 (Indigo)
--color-secondary: #ec4899 (Pink)
--color-success: #22c55e (Green)
--color-warning: #f59e0b (Amber)
--color-error: #ef4444 (Red)

/* Dark Mode */
--bg-dark: #0f172a (Slate 900)
--bg-card-dark: #1e293b (Slate 800)
--text-dark: #f8fafc (Slate 50)
```

### 2.2 Component Library
Create reusable components:
- `Card` - Elevated containers with shadows
- `Button` - Primary, secondary, ghost variants with loading states
- `Input` - Styled inputs with icons and validation states
- `Badge` - Tool tags, status indicators
- `Toast` - Notifications instead of console logs
- `Skeleton` - Loading placeholders

### 2.3 Animations
- Page transitions (fade/slide)
- Button hover effects (scale + shadow)
- Card hover effects (lift + glow)
- Loading spinners for async operations
- Progress bars for long operations
- Toast notifications (slide in/out)

## Phase 3: Feature-Specific Improvements

### 3.1 Task Submission Page
**Current:** Basic form
**Improved:**
- Visual budget slider with real-time cost estimation
- Tool recommendations based on task description
- "Auto-select best tool" option
- Preview of selected tool details (cost, provider, description)
- Real-time validation feedback
- Step-by-step execution visualization

### 3.2 Tools Catalog
**New dedicated page:**
- Grid view of all 89 tools
- Filter by category (AI, Finance, Security, etc.)
- Search by name/description
- Sort by cost, popularity, provider
- Tool detail cards with:
  - Provider logo
  - Cost badge
  - MPP support indicator
  - Description
  - "Use this tool" quick action

### 3.3 Wallet & Credits
**Visual wallet component:**
- Balance display with currency selector
- Transaction history table
- Credit usage chart (daily/weekly)
- "Add Credits" prominent CTA
- x402 payment flow visualization

### 3.4 Execution Visualization
**Real-time task execution:**
- Step-by-step progress indicator
- Visual pipeline: Task → Tool Selection → Payment → Execution → Result
- Animated transitions between steps
- Live logs in expandable panel
- Success/failure animations
- Result preview cards

### 3.5 Laso Finance Page
**Full-page replacement for modal:**
- Hero section explaining Laso/x402
- Operation cards (Card, Payment, Gift Card, Push)
- Recent transactions table
- Payment method selector
- Wallet connection status

## Phase 4: Responsive & Mobile

### 4.1 Mobile Layout
- Bottom navigation bar (5 key actions)
- Swipeable cards for tools
- Collapsible accordions for settings
- Touch-optimized buttons (min 44px)

### 4.2 Responsive Breakpoints
- Mobile: < 640px (single column)
- Tablet: 640-1024px (2 columns)
- Desktop: > 1024px (full layout)

## Phase 5: Polish & Micro-interactions

### 5.1 Micro-interactions
- Tool card hover: scale 1.02 + shadow increase
- Button click: scale 0.98 + ripple effect
- Input focus: border color transition
- Toggle switches: smooth slide animation
- Number counters: animated counting

### 5.2 Empty States
- "No tools selected" illustration
- "No execution history" with CTA
- "Wallet not connected" with setup guide
- "No credits" with add funds prompt

### 5.3 Error States
- Inline validation errors (not just logs)
- Error boundary with fallback UI
- Retry buttons for failed operations
- Helpful error messages with suggestions

## Implementation Priority

### Week 1: Foundation
1. Set up design system (colors, typography, spacing)
2. Create base components (Card, Button, Input)
3. Implement sidebar navigation
4. Build dashboard overview page

### Week 2: Core Pages
1. New task page with visual budget slider
2. Tools catalog with filtering
3. Wallet/credits page
4. Dark mode toggle

### Week 3: Features
1. Execution visualization
2. Toast notifications
3. Laso Finance full page
4. Build with Locus improvements

### Week 4: Polish
1. Animations & transitions
2. Mobile responsive
3. Empty/error states
4. Performance optimization

## Technical Implementation

### New Dependencies
```bash
npm install framer-motion        # Animations
npm install lucide-react         # Icons (already have)
npm install @radix-ui/react-*    # Headless UI components
npm install next-themes          # Dark mode
```

### File Structure
```
src/
├── components/
│   ├── ui/           # Reusable UI components
│   ├── layout/       # Sidebar, Header, Footer
│   └── features/     # Feature-specific components
├── app/
│   ├── (dashboard)/  # Dashboard layout group
│   ├── task/         # Task submission page
│   ├── tools/        # Tools catalog page
│   ├── laso/         # Laso Finance page
│   ├── deploy/       # Deployment page
│   └── history/      # Execution history page
├── hooks/
│   ├── useTheme.ts
│   ├── useWallet.ts
│   └── useExecution.ts
├── lib/
│   └── utils.ts      # Design system utilities
└── styles/
    └── globals.css   # Design tokens
```

## Success Metrics

- **User engagement:** Time on site, tasks submitted
- **Usability:** Reduced error rates, faster task completion
- **Aesthetics:** User feedback on design
- **Performance:** Lighthouse score > 90
- **Accessibility:** WCAG 2.1 AA compliance

---

Ready to implement? I suggest starting with Phase 1 (sidebar + dashboard) as it provides the biggest impact for user navigation.
