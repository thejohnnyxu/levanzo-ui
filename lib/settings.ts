export type BuiltinTheme = "levanzo" | "levanzo-notte";
export type ThemeName = BuiltinTheme | string; // custom themes have user-defined string IDs
export type FontBody = "Outfit" | "Inter" | "Lora" | "Merriweather" | "Source Sans 3";
export type FontSize = "sm" | "md" | "lg" | "xl";
export type PageWidth = "narrow" | "medium" | "wide" | "full";
export type ProseWidth = "full" | "comfortable" | "narrow";

export type ThemeOverrides = Partial<Record<ThemeName, Record<string, string>>>;

export interface CustomTheme {
  id: string       // unique slug, e.g. "my-theme-1"
  label: string    // display name
  base: BuiltinTheme  // which built-in theme to start from
  vars: Record<string, string>  // full var overrides
}

export const CUSTOM_THEMES_KEY = "mise_custom_themes";

export function loadCustomThemes(): CustomTheme[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(CUSTOM_THEMES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

export function saveCustomThemes(themes: CustomTheme[]) {
  localStorage.setItem(CUSTOM_THEMES_KEY, JSON.stringify(themes));
}

export function getCustomThemeVars(theme: CustomTheme): Record<string, string> {
  // Start from the base theme, apply custom vars on top
  return { ...THEMES[theme.base as BuiltinTheme], ...theme.vars };
}

export interface MealTypeConfig {
  id: string           // e.g. 'breakfast'
  label: string        // display name, user-editable
  enabled: boolean
  color: string        // CSS color string
  order: number
}

export interface PantryCategoryConfig {
  id: string
  label: string
  color: string
  order: number
}

export interface Settings {
  theme: ThemeName;
  fontBody: FontBody;
  fontSize: FontSize;
  proseWidth: ProseWidth;
  pageWidth: PageWidth;
  navConfig: NavConfig;
  mealTypes: MealTypeConfig[];
  pantryCategories: PantryCategoryConfig[];
}

// ── Nav customization ─────────────────────────────────────────
// ── Spaces & Tools ────────────────────────────────────────────
// Tool  = a single page/feature (leaf node, never user-created)
// Space = a named grouping of tools (user can create, rename, reorder, delete)
// NavConfig = the full user-configured nav structure

export interface Tool {
  id: string       // stable, never changes
  label: string    // canonical display name
  href: string     // route
}

export interface Space {
  id: string       // stable or user-generated ('food', 'shopping', uuid...)
  label: string    // user-editable
  icon?: string    // lucide icon name, e.g. 'UtensilsCrossed'
  toolIds: string[] // ordered, visible tools in this space
  hidden?: boolean
}

export interface NavConfig {
  spaces: Space[]                      // ordered list of all spaces
  toolLabels?: Record<string, string>  // toolId → custom label override
}

// ── Tool registry — source of truth for all available tools ──
export const ALL_TOOLS: Tool[] = [
  { id: 'planner',     label: 'Planner',     href: '/' },
  { id: 'recipes',     label: 'Recipes',     href: '/recipes' },
  { id: 'pantry',      label: 'Pantry',      href: '/pantry' },
  { id: 'shopping',    label: 'Shopping',    href: '/shopping' },
  { id: 'expenses',    label: 'Expenses',    href: '/expenses' },
  { id: 'budget',      label: 'Budget',      href: '/budget' },
  { id: 'stores',      label: 'Stores',      href: '/stores' },
  { id: 'maintenance', label: 'Maintenance', href: '/house' },
  { id: 'items',       label: 'Items',       href: '/items' },
  { id: 'house-info',  label: 'Info',  href: '/house-info' },
  { id: 'locations',   label: 'Locations',   href: '/locations' },
  { id: 'tasks',       label: 'Tasks',       href: '/tasks' },
  { id: 'pickles',     label: 'Ferments',    href: '/pickles' },
  { id: 'plants',      label: 'Plants',      href: '/plants' },
  { id: 'folio',       label: 'Notes',       href: '/folio' },
]

export function getTool(id: string): Tool | undefined {
  return ALL_TOOLS.find(t => t.id === id)
}

export function getToolLabel(id: string, cfg?: NavConfig): string {
  const override = cfg?.toolLabels?.[id]
  if (override) return override
  return getTool(id)?.label ?? id
}

export function defaultNavConfig(): NavConfig {
  return {
    spaces: [
      { id: 'kitchen',   label: 'Food',      icon: 'UtensilsCrossed', toolIds: ['planner', 'recipes', 'pantry'] },
      { id: 'shopping',  label: 'Shopping',  icon: 'ShoppingCart',    toolIds: ['shopping', 'stores'] },
      { id: 'finances',  label: 'Finances',  icon: 'Receipt',         toolIds: ['expenses', 'budget'] },
      { id: 'home',      label: 'Home',      icon: 'Home',            toolIds: ['maintenance', 'items', 'house-info', 'locations'] },
      { id: 'garden',    label: 'Garden',    icon: 'Sprout',          toolIds: ['plants', 'pickles'] },
      { id: 'workspace', label: 'Workspace', icon: 'Briefcase',       toolIds: ['tasks', 'folio'] },
    ],
  }
}

// Legacy compat — used by old Nav rendering code, will be removed next
export const DEFAULT_NAV_GROUPS = defaultNavConfig().spaces.map(s => ({
  id: s.id, label: s.label,
  links: s.toolIds.map(id => ALL_TOOLS.find(t => t.id === id)).filter(Boolean).map(t => ({ id: t!.id, label: t!.label, href: t!.href })),
}))

export const DEFAULT_MEAL_TYPES: MealTypeConfig[] = [
  { id: "breakfast", label: "Breakfast", enabled: true,  color: "var(--gold)",      order: 0 },
  { id: "lunch",     label: "Lunch",     enabled: true,  color: "var(--sage)",      order: 1 },
  { id: "dinner",    label: "Dinner",    enabled: true,  color: "var(--terracotta)", order: 2 },
  { id: "snack",     label: "Snack",     enabled: false, color: "#8e9fc2",           order: 3 },
];

export const DEFAULT_PANTRY_CATEGORIES: PantryCategoryConfig[] = [
  { id: "fridge",  label: "Fridge",  color: "#7aafc2", order: 0 },
  { id: "freezer", label: "Freezer", color: "#8e9fc2", order: 1 },
  { id: "pantry",  label: "Pantry",  color: "var(--gold)", order: 2 },
  { id: "spices",  label: "Spices",  color: "#b07cc6", order: 3 },
  { id: "sauces",  label: "Sauces",  color: "#C2623A", order: 4 },
  { id: "other",   label: "Other",   color: "var(--ink-muted)", order: 5 },
];

export const DEFAULT_SETTINGS: Settings = {
  theme: "levanzo",
  fontBody: "Outfit",
  fontSize: "md",
  proseWidth: "full",
  pageWidth: "wide",
  navConfig: defaultNavConfig(),
  mealTypes: DEFAULT_MEAL_TYPES,
  pantryCategories: DEFAULT_PANTRY_CATEGORIES,
};

export const PAGE_WIDTH_MAP: Record<PageWidth, string> = {
  narrow:  "720px",
  medium:  "1080px",
  wide:    "1400px",
  full:    "100%",
};

export const PAGE_WIDTH_LABELS: Record<PageWidth, string> = {
  narrow: "Narrow",
  medium: "Medium",
  wide:   "Wide",
  full:   "Full",
};

export const PROSE_WIDTH_MAP: Record<ProseWidth, string> = {
  full:        "100%",
  comfortable: "80ch",
  narrow:      "65ch",
};

export const SETTINGS_KEY = "mise_settings";

export const FONT_SIZE_MAP: Record<FontSize, string> = {
  sm: "13px",
  md: "15px",
  lg: "17px",
  xl: "19px",
};

// ── Accent color series ─────────────────────────────────────────────────────
// 8 families × 5 stops. Stops ordered: deep → base → mid → light → faint
// day = Levanzo values; night = Levanzo Notte values
export const ACCENT_SERIES = {
  terracotta: {
    label: "Terracotta",
    description: "Primary action, links, interactive elements",
    day:   ["#7A3520", "#B86240", "#CC8060", "#E0A888", "#F2D4C4"],
    night: ["#F4C4A8", "#D48C64", "#C07048", "#8A4830", "#4A2418"],
    stops: ["deep", "base", "mid", "light", "faint"] as const,
  },
  sage: {
    label: "Sage",
    description: "Success, availability, have badge",
    day:   ["#2C4828", "#688060", "#88A080", "#AABCA4", "#D0DCC8"],
    night: ["#C4D8BC", "#8AA884", "#6E8868", "#4A6044", "#283828"],
    stops: ["deep", "base", "mid", "light", "faint"] as const,
  },
  gold: {
    label: "Gold",
    description: "Warnings, due soon, time-sensitive",
    day:   ["#6A4A10", "#A87830", "#C89848", "#E0BC78", "#F2DEB0"],
    night: ["#F4DCA0", "#D0A454", "#B88838", "#7A5820", "#3C2C10"],
    stops: ["deep", "base", "mid", "light", "faint"] as const,
  },
  rust: {
    label: "Rust",
    description: "Error states, destructive actions, alerts",
    day:   ["#6A1C10", "#A83828", "#C85848", "#DE8878", "#F2C4B8"],
    night: ["#F4BEB0", "#D87060", "#BC4838", "#7A2A20", "#3A1410"],
    stops: ["deep", "base", "mid", "light", "faint"] as const,
  },
  teal: {
    label: "Teal",
    description: "Information, links, data highlights",
    day:   ["#1C4A50", "#3A7A80", "#5A9EA4", "#8CC0C4", "#C0DDE0"],
    night: ["#B0DCE0", "#6AAEB4", "#3A7A80", "#245054", "#102830"],
    stops: ["deep", "base", "mid", "light", "faint"] as const,
  },
  plum: {
    label: "Plum",
    description: "Special states, premium features, ferments",
    day:   ["#3C2848", "#705880", "#9078A0", "#B4A0C4", "#D8CDE8"],
    night: ["#D0C4E0", "#A088B8", "#806098", "#503868", "#281C38"],
    stops: ["deep", "base", "mid", "light", "faint"] as const,
  },
  ochre: {
    label: "Ochre",
    description: "Nutrition, harvest, seasonal indicators",
    day:   ["#5A3808", "#946020", "#B88040", "#D4A870", "#EDD0A8"],
    night: ["#EDD0A0", "#D0A868", "#A87838", "#6A4A18", "#30220A"],
    stops: ["deep", "base", "mid", "light", "faint"] as const,
  },
  slate: {
    label: "Slate",
    description: "Neutral data, metadata, structural chrome",
    day:   ["#283040", "#486078", "#6882A0", "#98B0C8", "#C8D8E8"],
    night: ["#C0D0E4", "#88A4C0", "#587898", "#305060", "#182838"],
    stops: ["deep", "base", "mid", "light", "faint"] as const,
  },
} as const;

export const THEME_VAR_LABELS: Record<string, string> = {
  "--paper":              "Cards, modals, input fields",
  "--cream":              "Main page background",
  "--cream-dark":         "Hovered rows, secondary panels",
  "--parchment":          "Deepest background (scrollbars, inset areas)",
  "--manila":             "Sidebar panels",
  "--manila-dark":        "Sidebar hover",
  "--manila-deeper":      "Sidebar active",
  "--terracotta":         "Buttons, active nav tabs, links",
  "--terracotta-light":   "Button hover state",
  "--sage":               "✓ Have badge, saved state, success",
  "--sage-light":         "Success background tint",
  "--gold":               "Due soon, warnings",
  "--gold-light":         "Warning background tint",
  "--ink":                "Headings, recipe names, bold text",
  "--ink-soft":           "Body text, descriptions",
  "--ink-mid":            "Section labels, uppercase labels",
  "--ink-muted":          "Placeholders, timestamps, helper text",
  "--ink-light":          "Subtle labels",
  "--ink-faint":          "Disabled text",
  "--border":             "Card edges, row dividers",
  "--border-strong":      "Input focus ring, strong separators",
  "--nav-bg":             "Top nav bar background",
  "--sidebar-bg":         "Left sidebar background",
  "--sidebar-hover":      "Sidebar item hover",
  "--header-bg":          "Page section headers",
  "--divider":            "Horizontal rule dividers",
  "--pill-active-bg":     "Selected filter pill (e.g. 'Pantry ready')",
  "--pill-active-text":   "Text on selected filter pill",
  "--table-header-bg":    "Table column header background",
  "--table-header-text":  "Table column header text",
  "--surface-raised":     "Calendar cells, insight panel, raised cards",
};

export const THEME_VAR_GROUPS: { label: string; vars: string[] }[] = [
  { label: "Page background",      vars: ["--cream", "--cream-dark", "--parchment"] },
  { label: "Cards & surfaces",     vars: ["--paper", "--surface-raised", "--manila", "--manila-dark", "--manila-deeper"] },
  { label: "Nav bar",              vars: ["--nav-bg"] },
  { label: "Filter pills",         vars: ["--pill-active-bg", "--pill-active-text"] },
  { label: "Table headers",        vars: ["--table-header-bg", "--table-header-text"] },
  { label: "Buttons & links",      vars: ["--terracotta", "--terracotta-light"] },
  { label: "Success states",       vars: ["--sage", "--sage-light"] },
  { label: "Warnings",             vars: ["--gold", "--gold-light"] },
  { label: "Text",                 vars: ["--ink", "--ink-soft", "--ink-mid", "--ink-muted", "--ink-light", "--ink-faint"] },
  { label: "Borders & dividers",   vars: ["--border", "--border-strong", "--divider"] },
  { label: "Sidebar",              vars: ["--sidebar-bg", "--sidebar-hover", "--header-bg"] },
];

export const THEMES: Record<ThemeName, Record<string, string>> = {
  // ── Light Sepia — warm parchment tones, deep espresso nav ─────
  // ── Levanzo — pale terrazzo, warm cream base, mineral accents ──
  // Inspired by Levanzo Cream terrazzo tile:
  // cream base · terracotta chips · sage · charcoal · warm stone
  "levanzo": {
    "--cream":         "#EAE4D8",
    "--cream-dark":    "#DDD6C8",
    "--parchment":     "#D0C9B8",
    "--paper":         "#EEE8DC",
    "--manila":        "#E2DACC",
    "--manila-dark":   "#D5CEBB",
    "--manila-deeper": "#C7BFA9",
    "--ink":           "#28201A",
    "--ink-soft":      "#403228",
    "--ink-mid":       "#685848",
    "--ink-muted":     "#887060",
    "--ink-light":     "#A89080",
    "--ink-faint":     "#C4B4A0",
    "--nav-bg":          "#2C2418",
    "--sidebar-bg":    "#E2DACC",
    "--sidebar-hover": "#D5CEBB",
    "--header-bg":     "#E2DACC",
    "--divider":       "#C7BFA9",
    "--border":        "rgba(44,36,24,0.12)",
    "--border-strong": "rgba(44,36,24,0.22)",
    "--terracotta":    "#B86240",
    "--terracotta-light": "#CC8060",
    "--terracotta-deep":  "#7A3520",
    "--terracotta-mid":   "#CC8060",
    "--terracotta-faint": "#F2D4C4",
    "--sage":          "#688060",
    "--sage-light":    "#88A080",
    "--sage-deep":     "#2C4828",
    "--sage-mid":      "#88A080",
    "--sage-faint":    "#D0DCC8",
    "--gold":          "#A87830",
    "--gold-light":    "#C89848",
    "--gold-deep":     "#6A4A10",
    "--gold-mid":      "#C89848",
    "--gold-faint":    "#F2DEB0",
    "--rust":          "#A83828",
    "--rust-deep":     "#6A1C10",
    "--rust-mid":      "#C85848",
    "--rust-light":    "#DE8878",
    "--rust-faint":    "#F2C4B8",
    "--teal":          "#3A7A80",
    "--teal-deep":     "#1C4A50",
    "--teal-mid":      "#5A9EA4",
    "--teal-light":    "#8CC0C4",
    "--teal-faint":    "#C0DDE0",
    "--plum":          "#705880",
    "--plum-deep":     "#3C2848",
    "--plum-mid":      "#9078A0",
    "--plum-light":    "#B4A0C4",
    "--plum-faint":    "#D8CDE8",
    "--ochre":         "#946020",
    "--ochre-deep":    "#5A3808",
    "--ochre-mid":     "#B88040",
    "--ochre-light":   "#D4A870",
    "--ochre-faint":   "#EDD0A8",
    "--slate":         "#486078",
    "--slate-deep":    "#283040",
    "--slate-mid":     "#6882A0",
    "--slate-light":   "#98B0C8",
    "--slate-faint":   "#C8D8E8",
    "--pill-active-bg":   "#28201A",
    "--pill-active-text": "#E8E2D4",
    "--table-header-bg":  "#C8C2B6",
    "--table-header-text":"#887060",
    "--surface-raised":   "#E8E2D8",
    "--sidenav-text":        "rgba(232,218,196,0.5)",
    "--sidenav-text-hover":  "rgba(232,218,196,0.85)",
    "--sidenav-text-active": "rgba(232,218,196,1)",
    "--sidenav-active-bg":   "rgba(192,112,72,0.18)",
  },

  // ── Levanzo Notte — the same tile at midnight ──────────────────
  // Deep charcoal base, the cream and terracotta flecks glow softly
  "levanzo-notte": {
    "--cream":         "#1A1710",
    "--cream-dark":    "#221E18",
    "--parchment":     "#2A2520",
    "--paper":         "#1E1A14",
    "--manila":        "#262018",
    "--manila-dark":   "#2E2820",
    "--manila-deeper": "#38302A",
    "--ink":           "#E4D8C0",
    "--ink-soft":      "#CEBEAA",
    "--ink-mid":       "#A89070",
    "--ink-muted":     "#847058",
    "--ink-light":     "#60503A",
    "--ink-faint":     "#443828",
    "--nav-bg":          "#100E0A",
    "--sidebar-bg":    "#1E1A14",
    "--sidebar-hover": "#262018",
    "--header-bg":     "#1E1A14",
    "--divider":       "#38302A",
    "--border":        "rgba(228,216,192,0.09)",
    "--border-strong": "rgba(228,216,192,0.17)",
    "--terracotta":    "#C07048",
    "--terracotta-light": "#D48C64",
    "--terracotta-deep":  "#F4C4A8",
    "--terracotta-mid":   "#C07048",
    "--terracotta-faint": "#4A2418",
    "--sage":          "#6E8868",
    "--sage-light":    "#8AA884",
    "--sage-deep":     "#C4D8BC",
    "--sage-mid":      "#6E8868",
    "--sage-faint":    "#283828",
    "--gold":          "#B88838",
    "--gold-light":    "#D0A454",
    "--gold-deep":     "#F4DCA0",
    "--gold-mid":      "#B88838",
    "--gold-faint":    "#3C2C10",
    "--rust":          "#BC4838",
    "--rust-deep":     "#F4BEB0",
    "--rust-mid":      "#D87060",
    "--rust-light":    "#9A3830",
    "--rust-faint":    "#3A1410",
    "--teal":          "#3A7A80",
    "--teal-deep":     "#B0DCE0",
    "--teal-mid":      "#6AAEB4",
    "--teal-light":    "#245054",
    "--teal-faint":    "#102830",
    "--plum":          "#806098",
    "--plum-deep":     "#D0C4E0",
    "--plum-mid":      "#A088B8",
    "--plum-light":    "#503868",
    "--plum-faint":    "#281C38",
    "--ochre":         "#A87838",
    "--ochre-deep":    "#EDD0A0",
    "--ochre-mid":     "#D0A868",
    "--ochre-light":   "#6A4A18",
    "--ochre-faint":   "#30220A",
    "--slate":         "#587898",
    "--slate-deep":    "#C0D0E4",
    "--slate-mid":     "#88A4C0",
    "--slate-light":   "#305060",
    "--slate-faint":   "#182838",
    "--pill-active-bg":   "#C07048",
    "--pill-active-text": "#1A1710",
    "--table-header-bg":  "#221E18",
    "--table-header-text":"#847058",
    "--surface-raised":   "#1E1A14",
    "--sidenav-text":        "rgba(228,216,192,0.45)",
    "--sidenav-text-hover":  "rgba(228,216,192,0.82)",
    "--sidenav-text-active": "rgba(228,216,192,1)",
    "--sidenav-active-bg":   "rgba(192,112,72,0.2)",
  },
};

export const FONT_GOOGLE_URLS: Record<FontBody, string> = {
  "Outfit":        "https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600&display=swap",
  "Inter":         "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap",
  "Lora":          "https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,500;0,600;1,400&display=swap",
  "Merriweather":  "https://fonts.googleapis.com/css2?family=Merriweather:ital,wght@0,300;0,400;0,700;1,400&display=swap",
  "Source Sans 3": "https://fonts.googleapis.com/css2?family=Source+Sans+3:wght@300;400;500;600&display=swap",

};

export function loadSettings(): Settings {
  if (typeof window === "undefined") return DEFAULT_SETTINGS;
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    const parsed = JSON.parse(raw);
    if (parsed.theme && !THEMES[parsed.theme as BuiltinTheme]) {
      const customs = loadCustomThemes();
      if (!customs.find((t: CustomTheme) => t.id === parsed.theme)) parsed.theme = "levanzo";
    }
    if (!parsed.pageWidth) parsed.pageWidth = "wide";
    if (!parsed.mealTypes?.length) parsed.mealTypes = DEFAULT_MEAL_TYPES;
    if (!parsed.pantryCategories?.length) parsed.pantryCategories = DEFAULT_PANTRY_CATEGORIES;
    // Migrate old NavConfig format (groupOrder + groups) → new spaces format
    if (parsed.navConfig && parsed.navConfig.groupOrder && !parsed.navConfig.spaces) {
      const migrated: NavConfig = {
        spaces: (parsed.navConfig.groupOrder as string[]).map((gid: string) => {
          const gcfg = parsed.navConfig.groups?.find((g: any) => g.id === gid)
          const label = DEFAULT_NAV_GROUPS.find(g => g.id === gid)?.label ?? gid
          return { id: gid, label, toolIds: gcfg?.linkIds ?? [], hidden: gcfg?.hidden }
        })
      }
      parsed.navConfig = migrated
    }
    return { ...DEFAULT_SETTINGS, ...parsed, navConfig: parsed.navConfig ?? defaultNavConfig() };
  } catch { return DEFAULT_SETTINGS; }
}

export function saveSettings(s: Settings) {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(s));
}

export function saveNavConfig(nc: NavConfig) {
  const s = loadSettings();
  saveSettings({ ...s, navConfig: nc });
  window.dispatchEvent(new Event('navconfig-changed'));
}

export function applySettings(s: Settings, overrides?: ThemeOverrides) {
  const root = document.documentElement;
  const builtinVars = THEMES[s.theme as BuiltinTheme];
  const themeVars = builtinVars ?? {};
  for (const [k, v] of Object.entries(themeVars)) root.style.setProperty(k, v);
  const themeOverrides = overrides?.[s.theme];
  if (themeOverrides) {
    for (const [k, v] of Object.entries(themeOverrides)) root.style.setProperty(k, v);
  }
  const fontSize = FONT_SIZE_MAP[s.fontSize];
  root.style.setProperty("--font-size-base", fontSize);
  root.style.fontSize = fontSize;
  if (document.body) document.body.style.fontSize = fontSize;
  const serifFonts = ["Lora", "Merriweather"];
  const fontStack = serifFonts.includes(s.fontBody) ? "Georgia, serif" : "system-ui, sans-serif";
  const fontValue = `'${s.fontBody}', ${fontStack}`;
  root.style.setProperty("--font-body", fontValue);
  root.style.setProperty("--font-display", fontValue);
  if (document.body) document.body.style.fontFamily = fontValue;
  root.style.setProperty("--prose-max-width", PROSE_WIDTH_MAP[s.proseWidth ?? "full"]);
  root.style.setProperty("--page-max-width", PAGE_WIDTH_MAP[s.pageWidth ?? "wide"]);
}

export function getEffectiveColor(
  themeName: ThemeName,
  cssVar: string,
  overrides: ThemeOverrides,
  customThemes?: CustomTheme[]
): string {
  if (overrides[themeName]?.[cssVar]) return overrides[themeName]![cssVar];
  if (THEMES[themeName as BuiltinTheme]) return THEMES[themeName as BuiltinTheme][cssVar] ?? "";
  // Custom theme: look up in customThemes list
  const custom = customThemes?.find(t => t.id === themeName);
  if (custom) return getCustomThemeVars(custom)[cssVar] ?? "";
  return "";
}
