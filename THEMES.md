# Levanzo Theme — Session Notes
*Design system: https://github.com/thejohnnyxu/levanzo-ui*

---

## What We Built

Starting from the Levanzo UI design system tokens (`lib/settings.ts` and `tokens/globals.css`), we built a full suite of themes across four platforms:

| Platform | Variant | File |
|---|---|---|
| VS Code | Dark (Levanzo Notte) | `levanzo-notte-1.0.0.vsix` |
| VS Code | Light (Levanzo) | `levanzo-1.0.0.vsix` |
| Streamlit | Dark | `config.toml` (notte values) |
| Streamlit | Light | `config-levanzo-light.toml` |
| macOS Terminal | Dark | `Levanzo Notte.terminal` |

---

## Color Tokens (source of truth)

All colors live in `lib/settings.ts` under the `THEMES` export. Two built-in themes:

### Levanzo (day)
```
--cream:         #E8E2D4    main background
--cream-dark:    #DAD3C3    hovered rows
--parchment:     #CCC4B2    deepest background
--paper:         #EEE8DC    cards, modals
--ink:           #28201A    headings
--ink-soft:      #403228    body text
--ink-muted:     #887060    labels, timestamps
--nav-bg:        #221C16    sidebar (espresso)
--terracotta:    #A85C38    primary action
--terracotta-light: #BE7A54 hover state
--sage:          #5E7858    success
--gold:          #9E7228    warning
```

### Levanzo Notte (night)
```
--cream:         #1A1710    deepest bg
--paper:         #1E1A14    editor/cards
--ink:           #E4D8C0    headings
--ink-soft:      #CEBEAA    body text
--nav-bg:        #100E0A    activity bar
--terracotta:    #C07048    primary action
--terracotta-light: #D48C64 hover / cursor
--sage:          #6E8868    success
--gold:          #B88838    warning
```

---

## VS Code Theme

### File locations
```
levanzo-vscode/
  themes/levanzo-color-theme.json     ← light theme
  package.json
  LICENSE

levanzo-notte-vscode/
  themes/levanzo-notte-color-theme.json  ← dark theme
  package.json
  LICENSE
```

### How to update and reinstall
```bash
# Edit the theme JSON, then:
cd levanzo-vscode
npx vsce package --no-dependencies
code --install-extension levanzo-1.0.0.vsix --force
# Then in VS Code: Cmd+Shift+P → Developer: Reload Window
```

### Faster dev loop (no packaging)
Copy the unpacked folder to your extensions directory once:
```
~/.vscode/extensions/levanzo-1.0.0/
```
Then edit `themes/levanzo-color-theme.json` directly and just reload the window — no packaging needed.

### Depth scale (light theme)
The light theme uses a 5-level depth hierarchy. Never skip levels — that's what caused the jarring contrast issues we fixed:

| Level | Surface | Value | Used for |
|---|---|---|---|
| L1 | Editor | `#EDE6D8` | Where you read & write — lightest |
| L2 | Tab bar / breadcrumbs | `#D8D2C8` | Chrome floor |
| L3 | Sidebar / panels | `#D8D2C8` | Same as L2 — no jump |
| L4 | Terminal | `#C8C2B6` | Slightly darker to separate |
| L5 | Activity bar / status bar | `#2C2418` | Espresso anchor |

**Key rule:** sidebar background and the empty area below the file tree must be the same color — if they differ, you get a jarring block effect.

### Syntax color palette (light theme)
Each category occupies a distinct hue + lightness. Never put two categories at similar values:

| Token | Color | Hex |
|---|---|---|
| Plain text / variables | Near-black | `#1E1410` |
| Keywords (`with`, `if`, `import`) | Deep brick **bold** | `#7A2010` |
| Function calls (`st.write`) | Warm sienna | `#8C4A20` |
| Strings | Teal-green | `#245C40` |
| Numbers / constants | Dark amber | `#7A5010` |
| Types / classes | Deep ochre | `#6B4A08` |
| Parameters | Brown italic | `#5C3E28` |
| Comments | Muted sand italic | `#A89A82` |
| Punctuation | Mid-brown | `#6A5848` |

### Pylance / language server override fix
Pylance ignores theme semantic tokens and applies its own blue. Fix in `settings.json`:
```jsonc
"editor.semanticTokenColorCustomizations": {
  "[Levanzo]": {
    "method": "#8C4A20",
    "function": "#8C4A20",
    "*.defaultLibrary": "#6B4A08"
  }
}
```
**Do NOT use** `"editor.semanticHighlighting.enabled": false` — it breaks other languages.

---

## Streamlit Theme

Streamlit only exposes 4 color knobs. Mapping:

### Light
```toml
[theme]
base = "light"
backgroundColor          = "#D8D2C8"   # warm stone
secondaryBackgroundColor = "#C8C2B6"   # deeper stone (sidebar, expanders)
textColor                = "#1E1410"   # deep espresso
primaryColor             = "#A85C38"   # terracotta
font = "sans serif"
```

### Dark (Notte)
```toml
[theme]
base = "dark"
backgroundColor          = "#1E1A14"   # --paper
secondaryBackgroundColor = "#1A1710"   # --cream
textColor                = "#CEBEAA"   # --ink-soft
primaryColor             = "#C07048"   # --terracotta
font = "sans serif"
```

### Managing two themes
- **Local dev:** keep both files and swap before running:
  ```bash
  cp .streamlit/themes/levanzo.toml .streamlit/config.toml
  streamlit run app.py
  ```
- **Deploy:** use CLI flags so the theme is version-controlled:
  ```bash
  streamlit run app.py \
    --theme.base=dark \
    --theme.backgroundColor="#1E1A14" \
    --theme.secondaryBackgroundColor="#1A1710" \
    --theme.textColor="#CEBEAA" \
    --theme.primaryColor="#C07048"
  ```

---

## macOS Terminal Theme

Install: double-click `Levanzo Notte.terminal`, or Terminal → Settings → Profiles → ⚙️ → Import.

To regenerate from scratch (e.g. if colors change), the theme is generated via Python plistlib — NSColor data blobs can't be hand-written reliably:
```python
import plistlib

def make_nscolor_data(hex_color):
    r, g, b = (int(hex_color[i:i+2], 16)/255.0 for i in (1, 3, 5))
    color_dict = {
        '$version': 100000,
        '$archiver': 'NSKeyedArchiver',
        '$top': {'root': plistlib.UID(1)},
        '$objects': [
            '$null',
            {
                '$class': plistlib.UID(2),
                'NSColorSpace': 1,
                'NSRGB': f'{r:.6f} {g:.6f} {b:.6f} '.encode('ascii'),
            },
            {
                '$classname': 'NSColor',
                '$classes': ['NSColor', 'NSObject'],
            },
        ]
    }
    return plistlib.dumps(color_dict, fmt=plistlib.FMT_BINARY)
```

---

## VS Code settings.json

Full settings live in the repo as `levanzo-settings.jsonc`. Key decisions:

- **Theme-scoped settings** go inside `"[Levanzo]": {}` — revert automatically when switching themes
- **Top-level settings** (smooth scrolling, terminal font, tree indent) apply globally
- **Token customizations** go at top level with theme name inside, not nested in `[Levanzo]`

```jsonc
// CORRECT structure for token overrides:
"editor.semanticTokenColorCustomizations": {
  "[Levanzo]": {
    "method": "#8C4A20"
  }
}

// WRONG — theme-scoped block doesn't work for this setting:
"[Levanzo]": {
  "editor.semanticTokenColorCustomizations": { ... }  // ✗
}
```

---

## Reusable Prompts

### Add a new platform theme
```
Using the Levanzo design system tokens from https://github.com/thejohnnyxu/levanzo-ui,
build a [PLATFORM] theme for [dark/light] mode. Pull the exact hex values from the
THEMES object in lib/settings.ts — use "levanzo-notte" for dark and "levanzo" for light.
Map --terracotta as the primary accent, --ink-soft as body text, --cream as the main
background, and --nav-bg as any dark anchor surfaces.
```

### Update existing theme colors
```
In the Levanzo VS Code light theme, update the syntax highlighting colors.
Current palette: keywords #7A2010 bold, strings #245C40, function calls #8C4A20,
numbers #7A5010, types #6B4A08, comments #A89A82 italic, plain text #1E1410.
[Describe what to change and why.]
Repackage as a .vsix when done.
```

### Fix a contrast/blending issue
```
In the Levanzo VS Code light theme, [SURFACE] is blending into [OTHER SURFACE].
The depth scale should be: editor #EDE6D8 (lightest), tab bar/sidebar #D8D2C8,
terminal #C8C2B6 (darkest warm surface), activity bar #2C2418 (espresso anchor).
All surfaces at the same level must use exactly the same hex value — no variation.
Fix the affected surfaces and repackage.
```

### Regenerate macOS Terminal theme
```
Regenerate the Levanzo Notte macOS Terminal theme (.terminal plist file) using
Python plistlib with proper NSColor binary data. Use these ANSI color mappings
from the Levanzo Notte token set: [paste token values]. Background #1A1710,
foreground #CEBEAA, cursor #D48C64 underline style.
```

---

## Design System Rules

### No emoji
Emoji render inconsistently across OS, browser, and font stack — they break the editorial tone and cannot be styled. This is a hard rule with no exceptions.

**Use instead:**
- **SVG icons** (Lucide) for all UI icons — nav items, action buttons, context menus, empty states, search inputs
- **Plain text labels** for filter pills and badges — the text already communicates the meaning
- **Typographic Unicode** for functional symbols only

**Permitted non-ASCII characters** (render consistently as text, not as platform glyphs):

| Symbol | Use |
|---|---|
| `✓` | Checked state, pantry-ready badge |
| `✕` | Close button, delete action |
| `⚠` | Warning badge |
| `▾` | Dropdown caret |
| `↑` `↓` | Sort direction indicators |
| `×` | Multiplier (e.g. `3×`) |
| `−` | Stepper minus button |
| `—` | Em dash (typographic) |
| `·` | Separator dot |
| `…` | Ellipsis |
| `½` `¼` `¾` | Fractions in quantity fields |
| `⌘` | Mac command key (keyboard shortcuts only) |
| `⌫` | Backspace key (keyboard shortcuts only) |

**Specifically banned** — replacement mapping:

| Banned | Was used in | Replace with |
|---|---|---|
| 🕐 🕑 | Filter pills | Drop — `Recently cooked`, `45+ min` are self-explanatory |
| ✦ | Filter pill | Drop entirely — purely decorative |
| ⚡ | Filter pill, badge, tooltip | Drop — `10m` needs no icon |
| ✎ | Action row, context menu | Lucide `<Pencil>` |
| ⧖ | Action row, context menu | Lucide `<Timer>` |
| ⎘ | Context menu | Lucide `<Copy>` |
| ⌕ | Search input | Lucide `<Search>` |
| 📅 | Action row, nav, context menu | Lucide `<Calendar>` |
| 📖 | Empty state, nav | Lucide `<BookOpen>` |
| 🛒 | Empty state, nav | Lucide `<ShoppingCart>` |
| ⏱ | Nav | Lucide `<Timer>` |
| 🫙 | Nav | Lucide `<Archive>` |
| 💸 | Nav | Lucide `<Receipt>` |

---

## Component Decisions

These are settled choices from the comparison session — when regenerating or updating the showcase, apply these without asking.

### Token set
All components use the **canonicalized Levanzo B tokens** by default. Exceptions that stay on the original A token values:

| Component | Token set | Reason |
|---|---|---|
| Pantry items | A (original) | Preferred visual |
| Expense rows | A (original) | Preferred visual |
| Toasts / notifications | A (original) | Preferred visual |
| All other components | B (Levanzo canonical) | Default |

### Showcase HTML
The comparison file (`showcase-comparison.html`) is a reference/decision tool only — do not regenerate it unless explicitly asked. When a component decision is made ("use A" / "use B"), record it in the table above instead.

---

## Lessons Learned

1. **Sidebar unity** — the file tree area and the empty area below it share the same `sideBar.background` key. If any section header or list background differs, you get visible blocks. Set `sideBarSectionHeader.background` to the same value as `sideBar.background`.

2. **Tabs and editor** — active tab background should exactly match `editor.background` for a seamless join. Inactive tabs sit one level darker.

3. **Syntax contrast** — don't put two token categories at similar lightness values even if the hues differ. On a warm background, the eye resolves lightness before hue. Each category needs a distinct lightness step.

4. **Semantic tokens win** — `tokenColorCustomizations` (TextMate) can be overridden by language servers (Pylance, rust-analyzer, etc.) via semantic tokens. Always set both `tokenColorCustomizations` and `semanticTokenColorCustomizations`. Never disable semantic highlighting globally.

5. **NSColor blobs** — macOS Terminal `.terminal` files use binary-archived NSColor objects. Always generate them with `plistlib` in Python — hand-writing the base64 is not reliable.

6. **Streamlit constraints** — only 4 theme variables. The `secondaryBackgroundColor` covers sidebar, expanders, code blocks, and dataframe headers — it does a lot. Step it ~10 points darker than `backgroundColor` for visible separation without a harsh jump.

7. **`semanticTokenColorCustomizations` structure** — the theme name is a direct key inside the setting, not wrapped in a `"rules"` object. Getting this wrong silently does nothing.
