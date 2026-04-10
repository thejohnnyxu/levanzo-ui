# levanzo-ui

A warm, tactile design system built from the **Levanzo** terrazzo aesthetic.

- Cream parchment backgrounds · terracotta accents · sage · gold · deep espresso nav
- Two built-in themes: `levanzo` (day) and `levanzo-notte` (night)
- Pure CSS token layer — no framework required
- React components with zero app-specific dependencies

Live demo: [levanzo-ui.vercel.app](https://levanzo-ui.vercel.app)

---

## Using in another app

### 1. Copy the tokens

Copy `tokens/globals.css` into your project and import it in your root layout:

```tsx
import '../tokens/globals.css'
```

Add the Google Fonts to your `<head>`:

```html
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=DM+Sans:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />
```

### 2. Copy components you need

```
components/
  Toast.tsx          # toast.success() / toast.error() / toast.undo()
  DataTable.tsx      # sortable table + ViewToggle + useViewMode
  InlineEdit.tsx     # click-to-edit inline text
  Skeletons.tsx      # loading states for recipes, pantry, shopping, tasks
  SwipeRow.tsx       # touch swipe-to-delete / swipe-to-edit
  MarkdownRenderer.tsx  # render markdown with tiptap styles

lib/
  settings.ts        # THEMES, applySettings, types
```

### 3. Switch themes at runtime

```ts
import { THEMES } from '@/lib/settings'

function applyTheme(name: 'levanzo' | 'levanzo-notte') {
  const theme = THEMES[name]
  const root = document.documentElement
  for (const [k, v] of Object.entries(theme)) root.style.setProperty(k, v)
}
```

---

## CSS Classes Quick Reference

### Layout
| Class | Description |
|---|---|
| `.page` | Main content area with max-width |
| `.page-header` | Header row with title + actions |
| `.app-shell` | Full-height flex container with sidenav |
| `.sidenav` | Left sidebar nav |
| `.card` | Surface with border |
| `.modal` / `.modal-overlay` | Modal dialog |

### Controls
| Class | Description |
|---|---|
| `.btn` | Base button |
| `.btn-primary` | Terracotta filled |
| `.btn-secondary` | Outlined |
| `.btn-ghost` | Transparent |
| `.btn-danger` | Terracotta outlined |
| `.btn-sm` | Small height (--ctrl-h) |
| `.input` | Text input / select / textarea |
| `.label` | Uppercase field label |
| `.field` | Label + input wrapper |

### Typography & Utilities
| Class | Description |
|---|---|
| `.page-title` | Cormorant Garamond display heading |
| `.section-label` | Uppercase eyebrow label |
| `.section-header` | Eyebrow + bottom border |
| `.text-muted` / `.text-soft` / `.text-accent` | Color variants |
| `.text-xs` → `.text-xl` | Font size scale |
| `.row` / `.col` / `.spread` | Flex helpers |
| `.gap-xs` → `.gap-lg` | Gap helpers |

### Feedback
| Class | Description |
|---|---|
| `.badge-sage` / `.badge-terracotta` / `.badge-gold` / `.badge-ink` | Colored badges |
| `.tag` | Outlined content tag |
| `.filter-tab` / `.pill` | Toggle filter pills |
| `.alert-error` / `.alert-warning` / `.alert-info` | Alert banners |
| `.empty-state` / `.empty-msg` | Empty state containers |
| `.skeleton-pulse` | Loading animation |

---

## Design Tokens

All values are CSS custom properties on `:root`. Override per-theme in `lib/settings.ts`.

```
--cream           Main background
--cream-dark      Hovered rows, panels
--parchment       Deepest background
--ink             Headings, bold text
--ink-soft        Body text
--ink-muted       Labels, timestamps
--terracotta      Primary action color
--terracotta-light  Hover state
--sage            Success / in-stock
--gold            Warning / due-soon
--nav-bg          Sidebar background
--border          Subtle dividers
--border-strong   Card borders
--ctrl-h          36px — standard control height
```

---

## License

MIT
