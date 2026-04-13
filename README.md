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

## Themes

Pre-built themes for other platforms live in the `themes/` folder. All use the same token values from `lib/settings.ts` as their source of truth.

```
themes/
  vscode/
    levanzo-color-theme.json          # Light theme source
    levanzo-notte-color-theme.json    # Dark theme source
    settings.jsonc                    # Companion editor settings
  streamlit/
    config-levanzo.toml               # Light theme
    config-levanzo-notte.toml         # Dark theme
  terminal/
    Levanzo Notte.terminal            # macOS Terminal dark theme
  THEMES.md                           # Full reference, update guide, reusable prompts
```

### VS Code

**Install:**
```bash
# Build from source
cd themes/vscode
npm install
npx vsce package --no-dependencies
code --install-extension levanzo-1.0.0.vsix --force
```

Then `Cmd+Shift+P` → **Developer: Reload Window**.

For faster iteration during development, copy the folder directly to `~/.vscode/extensions/levanzo-1.0.0/` and reload — no packaging needed.

The companion `settings.jsonc` includes font settings (JetBrains Mono), ruler config, bracket colorization off, and semantic token overrides to prevent language servers (Pylance etc.) from overriding theme colors.

### Streamlit

Copy the relevant `.toml` to `.streamlit/config.toml` in your project:

```bash
# Light
cp themes/streamlit/config-levanzo.toml .streamlit/config.toml

# Dark
cp themes/streamlit/config-levanzo-notte.toml .streamlit/config.toml
```

Or pass as CLI flags for deployment:

```bash
streamlit run app.py \
  --theme.base=dark \
  --theme.backgroundColor="#1E1A14" \
  --theme.secondaryBackgroundColor="#1A1710" \
  --theme.textColor="#CEBEAA" \
  --theme.primaryColor="#C07048"
```

### macOS Terminal

Double-click `themes/terminal/Levanzo Notte.terminal`, or import via Terminal → Settings → Profiles → ⚙️ → Import.

---

## CSS Classes Quick Reference

### Layout

| Class | Description |
| --- | --- |
| `.page` | Main content area with max-width |
| `.page-header` | Header row with title + actions |
| `.app-shell` | Full-height flex container with sidenav |
| `.sidenav` | Left sidebar nav |
| `.card` | Surface with border |
| `.modal` / `.modal-overlay` | Modal dialog |

### Controls

| Class | Description |
| --- | --- |
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
| --- | --- |
| `.page-title` | Cormorant Garamond display heading |
| `.section-label` | Uppercase eyebrow label |
| `.section-header` | Eyebrow + bottom border |
| `.text-muted` / `.text-soft` / `.text-accent` | Color variants |
| `.text-xs` → `.text-xl` | Font size scale |
| `.row` / `.col` / `.spread` | Flex helpers |
| `.gap-xs` → `.gap-lg` | Gap helpers |

### Feedback

| Class | Description |
| --- | --- |
| `.badge-sage` / `.badge-terracotta` / `.badge-gold` / `.badge-ink` | Colored badges |
| `.tag` | Outlined content tag |
| `.filter-tab` / `.pill` | Toggle filter pills |
| `.alert-error` / `.alert-warning` / `.alert-info` | Alert banners |
| `.empty-state` / `.empty-msg` | Empty state containers |
| `.skeleton-pulse` | Loading animation |

---

## Design Tokens

All values are CSS custom properties on `:root`. The canonical values live in `lib/settings.ts` and are mirrored in `tokens/globals.css`. All platform themes derive from these — if you change a value here, update both files and regenerate the platform themes.

```
--cream           Main background          #D8D2C8
--cream-dark      Hovered rows, panels     #C8C2B6
--parchment       Deepest background       #C0BAB0
--paper           Cards, modals, inputs    #EDE6D8
--ink             Headings, bold text      #1E1410
--ink-soft        Body text                #2E2018
--ink-muted       Labels, timestamps       #7A6858
--terracotta      Primary action color     #A85C38
--terracotta-light  Hover state            #BE7A54
--sage            Success / in-stock       #5E7858
--gold            Warning / due-soon       #9E7228
--nav-bg          Sidebar background       #2C2418
--border          Subtle dividers          rgba(40,32,26,0.09)
--border-strong   Card borders             rgba(40,32,26,0.17)
--ctrl-h          36px — standard control height
```

---

## License

MIT
