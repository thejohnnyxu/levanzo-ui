'use client'
import { useState, useEffect, useRef, useCallback } from 'react'
import { Sun, Moon, Search, X, Palette } from 'lucide-react'
import { THEMES } from '@/lib/settings'

// ── Components ────────────────────────────────────────────────
import { ToastContainer, toast } from '@/components/Toast'
import { DataTable, ViewToggle, useViewMode, ColDef } from '@/components/DataTable'
import InlineEdit from '@/components/InlineEdit'
import { CardGridSkeleton, ItemGridSkeleton, RowListSkeleton, KanbanSkeleton, ListSkeleton } from '@/components/Skeletons'
import SwipeRow from '@/components/SwipeRow'
import MarkdownRenderer from '@/components/MarkdownRenderer'
import Spinner from '@/components/Spinner'
import Alert from '@/components/Alert'
import Divider from '@/components/Divider'
import Callout from '@/components/Callout'
import Breadcrumbs from '@/components/Breadcrumbs'
import { Avatar, UserChip, AvatarStack } from '@/components/Avatar'
import StatCard from '@/components/StatCard'
import Progress from '@/components/Progress'
import { Checkbox, CheckboxGroup } from '@/components/Checkbox'
import Pagination from '@/components/Pagination'
import Steps from '@/components/Steps'
import Accordion from '@/components/Accordion'
import Drawer from '@/components/Drawer'
import Popover from '@/components/Popover'
import Slider from '@/components/Slider'
import TagInput from '@/components/TagInput'
import CommandPalette from '@/components/CommandPalette'
import CodeBlock from '@/components/CodeBlock'
import Combobox from '@/components/Combobox'
import FileUpload from '@/components/FileUpload'
import DatePicker, { TimePicker, DateTimePicker } from '@/components/DatePicker'
import CheckList from '@/components/CheckList'

// ── Nav categories ────────────────────────────────────────────
const CATEGORIES = [
  {
    label: 'App Components',
    items: ['recipe-cards', 'stat-cards', 'data-table', 'timeline', 'skeletons'],
  },
  {
    label: 'Inputs & Forms',
    items: ['form-inputs', 'checkbox', 'toggles', 'radio-group', 'dropdown', 'combobox', 'slider', 'tag-input', 'stepper', 'file-upload', 'date-picker'],
  },
  {
    label: 'Navigation',
    items: ['filter-pills', 'tab-bar', 'breadcrumbs', 'pagination', 'steps', 'action-row', 'keyboard-shortcuts'],
  },
  {
    label: 'Feedback',
    items: ['toasts', 'alerts', 'banners', 'progress', 'spinner', 'tooltips', 'empty-states'],
  },
  {
    label: 'Overlays',
    items: ['modal', 'context-menu', 'drawer', 'popover', 'command-palette'],
  },
  {
    label: 'Display',
    items: ['badges', 'avatar', 'callout', 'code-block', 'accordion', 'divider', 'section-header', 'checklist'],
  },
]

// All sections flat for search
const ALL_SECTIONS: { id: string; label: string }[] = [
  { id: 'recipe-cards',      label: 'Recipe Cards' },
  { id: 'stat-cards',        label: 'Stat Cards' },
  { id: 'data-table',        label: 'Data Table' },
  { id: 'timeline',          label: 'Timeline / Activity Feed' },
  { id: 'skeletons',         label: 'Skeleton Loaders' },
  { id: 'form-inputs',       label: 'Form Inputs' },
  { id: 'checkbox',          label: 'Checkbox' },
  { id: 'toggles',           label: 'Toggles' },
  { id: 'radio-group',       label: 'Radio Group' },
  { id: 'dropdown',          label: 'Dropdown / Select Menu' },
  { id: 'combobox',          label: 'Combobox' },
  { id: 'slider',            label: 'Slider / Range Input' },
  { id: 'tag-input',         label: 'Tag Input' },
  { id: 'stepper',           label: 'Stepper / Quantity Input' },
  { id: 'file-upload',       label: 'File Upload' },
  { id: 'date-picker',       label: 'Date · Time · DateTime' },
  { id: 'filter-pills',      label: 'Filter Pills' },
  { id: 'tab-bar',           label: 'Tab Bar' },
  { id: 'breadcrumbs',       label: 'Breadcrumbs' },
  { id: 'pagination',        label: 'Pagination' },
  { id: 'steps',             label: 'Steps / Wizard' },
  { id: 'action-row',        label: 'Inline Action Row' },
  { id: 'keyboard-shortcuts',label: 'Keyboard Shortcuts' },
  { id: 'toasts',            label: 'Toasts / Notifications' },
  { id: 'alerts',            label: 'Alerts / Inline Banners' },
  { id: 'banners',           label: 'Confirmation Banners' },
  { id: 'progress',          label: 'Progress Bar' },
  { id: 'spinner',           label: 'Spinner / Loading' },
  { id: 'tooltips',          label: 'Tooltips' },
  { id: 'empty-states',      label: 'Empty States' },
  { id: 'modal',             label: 'Modal / Dialog' },
  { id: 'context-menu',      label: 'Contextual Menu' },
  { id: 'drawer',            label: 'Drawer / Side Sheet' },
  { id: 'popover',           label: 'Popover' },
  { id: 'command-palette',   label: 'Command Palette' },
  { id: 'badges',            label: 'Badges & Tags' },
  { id: 'avatar',            label: 'Avatar / User Chip' },
  { id: 'callout',           label: 'Callout / Prose Block' },
  { id: 'code-block',        label: 'Code Block' },
  { id: 'accordion',         label: 'Accordion' },
  { id: 'divider',           label: 'Divider' },
  { id: 'section-header',    label: 'Section Header' },
  { id: 'checklist',         label: 'CheckList' },
]

function slug(str: string) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

// ── Section wrapper ───────────────────────────────────────────
function Section({ id, label, children }: { id: string; label: string; children: React.ReactNode }) {
  return (
    <section id={id} className="sb-section">
      <div className="sb-section-label">{label}</div>
      {children}
    </section>
  )
}

// ── Sample data ───────────────────────────────────────────────
type TableRow = { id: string; name: string; category: string; count: number; status: string }
const TABLE_DATA: TableRow[] = [
  { id: '1', name: 'Component A', category: 'UI',      count: 12, status: 'Active'   },
  { id: '2', name: 'Component B', category: 'Layout',  count: 4,  status: 'Draft'    },
  { id: '3', name: 'Component C', category: 'UI',      count: 7,  status: 'Active'   },
  { id: '4', name: 'Component D', category: 'Utility', count: 0,  status: 'Archived' },
  { id: '5', name: 'Component E', category: 'Layout',  count: 19, status: 'Active'   },
]
const TABLE_COLS: ColDef<TableRow>[] = [
  { key: 'name',     label: 'Name',     sortValue: r => r.name },
  { key: 'category', label: 'Category', sortValue: r => r.category },
  { key: 'count',    label: 'Count',    sortValue: r => r.count, width: 80 },
  { key: 'status',   label: 'Status',   sortValue: r => r.status,
    render: r => (
      <span className={`badge ${r.status === 'Active' ? 'badge-sage' : r.status === 'Draft' ? 'badge-gold' : 'badge-ink'}`}>
        {r.status}
      </span>
    ),
  },
]

const SAMPLE_MD = `## Section Heading

Start with **bold emphasis** to anchor the reader.

- [ ] Unchecked item
- [x] Completed item
- [ ] Another item

> A blockquote for callouts or pull quotes.`

const SAMPLE_CODE = `def scale_recipe(recipe, servings):
    # Scale all ingredient quantities by ratio
    ratio = servings / recipe['base_servings']
    return {
        **recipe,
        'servings': servings,
        'ingredients': [
            {**ing, 'qty': ing['qty'] * ratio}
            for ing in recipe['ingredients']
        ]
    }`

// ── Main page ─────────────────────────────────────────────────
export default function StorybookPage() {
  const [theme, setTheme] = useState<'levanzo' | 'levanzo-notte'>('levanzo')
  const [query, setQuery] = useState('')
  const [activeSection, setActiveSection] = useState('')
  const [collapsedCats, setCollapsedCats] = useState<Set<string>>(new Set())
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [cmdOpen, setCmdOpen] = useState(false)
  const [activePage, setActivePage] = useState(1)
  const [sliderVal, setSliderVal] = useState(40)
  const [sliderVal2, setSliderVal2] = useState(45)
  const [tags, setTags] = useState(['Asian', 'Quick', 'Pantry staple'])
  const [comboValue, setComboValue] = useState<string | null>('soy-sauce')
  const [checkSelected, setCheckSelected] = useState(['auto-shopping', 'pantry-mode'])
  const [files, setFiles] = useState<any[]>([])
  const [pickedDate, setPickedDate] = useState<Date | null>(null)
  const [pickedTime, setPickedTime] = useState<Date | null>(null)
  const [pickedDatetime, setPickedDatetime] = useState<Date | null>(null)
  const [inlineVal, setInlineVal] = useState('Click to edit this label')
  const [showSkeleton, setShowSkeleton] = useState<string | null>(null)
  const [viewMode, setViewMode] = useViewMode('sb-view', 'grid')
  const contentRef = useRef<HTMLDivElement>(null)



  // Scroll-spy
  useEffect(() => {
    const content = contentRef.current
    if (!content) return
    const handler = () => {
      const sections = content.querySelectorAll('.sb-section[id]')
      let current = ''
      sections.forEach(sec => {
        if ((sec as HTMLElement).offsetTop - content.scrollTop <= 80) current = sec.id
      })
      setActiveSection(current)
    }
    content.addEventListener('scroll', handler, { passive: true })
    return () => content.removeEventListener('scroll', handler)
  }, [])

  // ⌘K to open command palette
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); setCmdOpen(true) }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  const scrollTo = (id: string) => {
    const el = document.getElementById(id)
    if (el && contentRef.current) {
      contentRef.current.scrollTo({ top: (el as HTMLElement).offsetTop - 16, behavior: 'smooth' })
    }
  }

  const toggleCat = (label: string) => {
    setCollapsedCats(prev => {
      const next = new Set(prev)
      next.has(label) ? next.delete(label) : next.add(label)
      return next
    })
  }

  const filtered = query
    ? ALL_SECTIONS.filter(s => s.label.toLowerCase().includes(query.toLowerCase()))
    : null

  const visibleIds = new Set(filtered ? filtered.map(s => s.id) : ALL_SECTIONS.map(s => s.id))

  return (
    <>
      <ToastContainer />

      <CommandPalette
        open={cmdOpen}
        onClose={() => setCmdOpen(false)}
        placeholder="Search components…"
        items={ALL_SECTIONS.map(s => ({
          id: s.id,
          label: s.label,
          group: CATEGORIES.find(c => c.items.includes(s.id))?.label ?? '',
          onSelect: () => scrollTo(s.id),
        }))}
      />

      <div className="sb-shell">

        {/* ── Top bar ── */}
        <header className="sb-topbar">
          <div className="sb-brand">
            <img src="/icon.svg" alt="Levanzo" className="sb-brand-icon" />
            levanzo<span className="sb-brand-dot">-ui</span>
          </div>

          <div className="sb-search">
            <Search size={12} style={{ color: 'rgba(255,255,255,0.3)', flexShrink: 0 }} />
            <input
              className="sb-search-input"
              placeholder="Search components…"
              value={query}
              onChange={e => setQuery(e.target.value)}
            />
            {query && (
              <button className="sb-search-clear" onClick={() => setQuery('')}>
                <X size={10} />
              </button>
            )}
            {query && (
              <span className="sb-search-count">{filtered?.length ?? 0} result{filtered?.length !== 1 ? 's' : ''}</span>
            )}
          </div>

          <div className="sb-topbar-right">
            <button
              className="sb-theme-toggle"
              onClick={() => {
              const next = theme === 'levanzo' ? 'levanzo-notte' : 'levanzo'
              setTheme(next)
              const root = document.documentElement
              // Toggle .notte class so html.notte CSS selectors fire
              root.classList.toggle('notte', next === 'levanzo-notte')
              // Apply theme var overrides
              const t = THEMES[next]
              for (const [k, v] of Object.entries(t)) root.style.setProperty(k, v)
            }}
            >
              {theme === 'levanzo' ? <Moon size={12} /> : <Sun size={12} />}
              {theme === 'levanzo' ? 'Notte' : 'Day'}
            </button>
            <a className="sb-topbar-link" href="/palette" style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <Palette size={11} /> Palette
            </a>
            <a className="sb-topbar-link" href="https://github.com/thejohnnyxu/levanzo-ui" target="_blank" rel="noreferrer">
              GitHub
            </a>
            <span className="sb-version">v1.0 · {ALL_SECTIONS.length} components</span>
          </div>
        </header>

        <div className="sb-body">

          {/* ── Sidebar ── */}
          <nav className="sb-sidebar">
            {CATEGORIES.map(cat => {
              const collapsed = collapsedCats.has(cat.label)
              const catItems = filtered
                ? cat.items.filter(id => filtered.some(s => s.id === id))
                : cat.items
              if (filtered && catItems.length === 0) return null
              return (
                <div key={cat.label} className="sb-cat">
                  <button className="sb-cat-header" onClick={() => toggleCat(cat.label)}>
                    <span>{cat.label}</span>
                    <span className="sb-cat-arrow" style={{ transform: collapsed ? 'scaleY(-1)' : '' }}>▾</span>
                  </button>
                  {!collapsed && (
                    <div className="sb-cat-items">
                      {catItems.map(id => {
                        const section = ALL_SECTIONS.find(s => s.id === id)
                        if (!section) return null
                        return (
                          <button
                            key={id}
                            className={`sb-nav-item${activeSection === id ? ' active' : ''}`}
                            onClick={() => scrollTo(id)}
                          >
                            {section.label}
                          </button>
                        )
                      })}
                    </div>
                  )}
                </div>
              )
            })}
            <div className="sb-sidebar-footer">
              <a href="/palette" style={{ display: 'flex', alignItems: 'center', gap: 5, color: 'rgba(255,255,255,0.45)', textDecoration: 'none', fontSize: '0.75rem', fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.04em', marginBottom: 8, transition: 'color 0.1s' }}
                onMouseEnter={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.75)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.45)')}
              >
                <Palette size={11} style={{ flexShrink: 0 }} /> Color palette
              </a>
              levanzo-ui · MIT<br />
              <span style={{ opacity: 0.5 }}>github.com/thejohnnyxu/levanzo-ui</span>
            </div>
          </nav>

          {/* ── Content ── */}
          <main className="sb-content" ref={contentRef}>

            {filtered && filtered.length === 0 && (
              <div className="sb-no-results">No components match "{query}"</div>
            )}

            {/* ── Recipe cards ── */}
            {visibleIds.has('recipe-cards') && (
              <Section id="recipe-cards" label="Recipe Cards — v2 Spine Style">
                <div className="comp-row">
                  {[
                    { id: 'RCP-01', title: 'Tomato Egg', desc: "It's tomato, it's egg.", time: '10m', pantry: '4/5', color: '#C2623A', last: '8 days ago' },
                    { id: 'RCP-09', title: 'Corn Chowder', desc: 'Like clam chowder but for poor people.', time: '90m', pantry: '5/5', color: '#6B8C6B', last: 'today' },
                    { id: 'RCP-05', title: 'Twice Cooked Pork', desc: 'jalapeños & dried tofu.', time: '30m', pantry: '2/3', color: '#C9973A', last: '8 days ago' },
                  ].map(r => (
                    <div key={r.id} className="rc">
                      <div className="rc-spine" style={{ background: r.color }}>
                        <div className="rc-spine-num">{r.id}</div>
                      </div>
                      <div className="rc-inner">
                        <div className="rc-body">
                          <div className="rc-title">{r.title}</div>
                          <div className="rc-desc">{r.desc}</div>
                          <div style={{ display: 'flex', gap: 4, marginTop: 2 }}>
                            <span className="rc-chip">{r.time}</span>
                            <span className="rc-chip pantry">✓ {r.pantry}</span>
                          </div>
                        </div>
                        <div className="rc-divider" />
                        <div className="rc-footer">
                          <span className="rc-chip">{r.last}</span>
                          <span className="rc-times">1×</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Section>
            )}

            {/* ── Stat cards ── */}
            {visibleIds.has('stat-cards') && (
              <Section id="stat-cards" label="Stat Cards">
                <div className="comp-row">
                  <StatCard label="Meals this week" value="14" trend="2 vs last week" trendDirection="up" color="terracotta" />
                  <StatCard label="Monthly spend"   value="$248" trend="$12 vs avg"   trendDirection="down" color="gold" />
                  <StatCard label="Pantry items"    value="127" trend="unchanged"      trendDirection="flat" color="sage" />
                  <StatCard label="Recipes"         value="48"  trend="3 new"          trendDirection="up"   color="teal" />
                </div>
              </Section>
            )}

            {/* ── Data table ── */}
            {visibleIds.has('data-table') && (
              <Section id="data-table" label="Data Table">
                <div style={{ marginBottom: '0.75rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <ViewToggle view={viewMode} setView={setViewMode} storageKey="sb-view" />
                  <span className="text-sm text-muted">view: <strong>{viewMode}</strong></span>
                </div>
                <DataTable columns={TABLE_COLS} data={TABLE_DATA} storageKey="sb-table" emptyMessage="No items found" />
              </Section>
            )}

            {/* ── Timeline ── */}
            {visibleIds.has('timeline') && (
              <Section id="timeline" label="Timeline / Activity Feed">
                <div className="timeline">
                  {[
                    { dot: 'filled', action: <>Cooked <strong>Corn Chowder</strong></>, time: 'today, 6:32 pm' },
                    { dot: 'sage',   action: <>Restocked <strong>Sesame Oil</strong> (12 oz)</>, time: 'today, 2:15 pm' },
                    { dot: '',       action: <>Added <strong>Wakame Seaweed Salad</strong> to library</>, time: 'yesterday' },
                    { dot: 'filled', action: <>Cooked <strong>Tomato Egg</strong></>, time: '8 days ago' },
                    { dot: '',       action: <>Added <strong>Survival Hashbrowns</strong> to Tue meal plan</>, time: 'Apr 1, 2026' },
                  ].map((item, i) => (
                    <div key={i} className="tl-item">
                      <div className="tl-spine">
                        <div className={`tl-dot${item.dot ? ` ${item.dot}` : ''}`} />
                        {i < 4 && <div className="tl-line" />}
                      </div>
                      <div className="tl-content">
                        <div className="tl-action">{item.action}</div>
                        <div className="tl-time">{item.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </Section>
            )}

            {/* ── Skeletons ── */}
            {visibleIds.has('skeletons') && (
              <Section id="skeletons" label="Skeleton Loaders">
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
                  {(['card-grid', 'item-grid', 'row-list', 'kanban', 'list'] as const).map(s => (
                    <button key={s} className={`btn btn-sm ${showSkeleton === s ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setShowSkeleton(showSkeleton === s ? null : s)}>{s}</button>
                  ))}
                </div>
                {showSkeleton === 'card-grid' && <CardGridSkeleton />}
                {showSkeleton === 'item-grid' && <ItemGridSkeleton />}
                {showSkeleton === 'row-list'  && <RowListSkeleton />}
                {showSkeleton === 'kanban'    && <KanbanSkeleton />}
                {showSkeleton === 'list'      && <ListSkeleton rows={4} />}
              </Section>
            )}

            {/* ── Form inputs ── */}
            {visibleIds.has('form-inputs') && (
              <Section id="form-inputs" label="Form Inputs">
                <div className="comp-row" style={{ alignItems: 'flex-start' }}>
                  <div className="comp-field">
                    <div className="comp-field-label">Recipe name</div>
                    <div className="comp-field-input"><input type="text" placeholder="e.g. Corn Chowder" /></div>
                  </div>
                  <div className="comp-field">
                    <div className="comp-field-label">Cook time</div>
                    <div className="comp-field-input"><input type="text" defaultValue="45" style={{ textAlign: 'right' }} /><div className="comp-field-suffix">min</div></div>
                    <div className="comp-field-hint">Total active + passive cook time.</div>
                  </div>
                  <div className="comp-field">
                    <div className="comp-field-label">Unit price</div>
                    <div className="comp-field-input"><div className="comp-field-prefix">$</div><input type="text" placeholder="0.00" /></div>
                  </div>
                  <div className="comp-field">
                    <div className="comp-field-label">Store slug</div>
                    <div className="comp-field-input error"><input type="text" defaultValue="king sooper$" /></div>
                    <div className="comp-field-error">✕ invalid characters in name</div>
                  </div>
                  <div className="comp-field">
                    <div className="comp-field-label">Location</div>
                    <div className="comp-field-input success"><input type="text" defaultValue="pantry · shelf 2" /></div>
                    <div className="comp-field-success">✓ location confirmed</div>
                  </div>
                  <div className="comp-field" style={{ width: 200 }}>
                    <div className="comp-field-label">Meal type</div>
                    <div className="comp-field-input">
                      <select><option>Breakfast</option><option>Lunch</option><option>Dinner</option></select>
                    </div>
                  </div>
                  <div className="comp-field" style={{ width: 280 }}>
                    <div className="comp-field-label">Notes</div>
                    <div className="comp-field-input"><textarea placeholder="Optional notes…" /></div>
                  </div>
                  <div className="comp-field">
                    <div className="comp-field-label">Inline edit</div>
                    <div className="comp-field-input" style={{ padding: '0 10px' }}>
                      <InlineEdit value={inlineVal} onSave={setInlineVal} style={{ fontWeight: 500 }} />
                    </div>
                  </div>
                </div>
              </Section>
            )}

            {/* ── Checkbox ── */}
            {visibleIds.has('checkbox') && (
              <Section id="checkbox" label="Checkbox">
                <div className="comp-row" style={{ alignItems: 'flex-start' }}>
                  <CheckboxGroup
                    items={[
                      { id: 'auto-shopping', label: 'Auto-add to shopping list', sublabel: 'when pantry drops below threshold' },
                      { id: 'rotation',      label: 'Rotation reminders',         sublabel: 'notify when a recipe is overdue' },
                      { id: 'pantry-mode',   label: 'Pantry-only filter',          sublabel: 'show only recipes you can cook now' },
                      { id: 'disabled-opt',  label: 'Disabled option',             disabled: true },
                    ]}
                    selected={checkSelected}
                    onChange={setCheckSelected}
                  />
                </div>
              </Section>
            )}

            {/* ── Toggles ── */}
            {visibleIds.has('toggles') && (
              <Section id="toggles" label="Toggles">
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {[
                    { name: 'Auto-add to shopping list', desc: 'when pantry stock drops below threshold', on: true },
                    { name: 'Rotation reminders',        desc: 'notify when a recipe is overdue',         on: false },
                    { name: 'Pantry-only filter',        desc: 'show only recipes you can cook now',       on: true },
                  ].map(t => (
                    <div key={t.name} className="toggle-row">
                      <div className="toggle-info">
                        <div className="toggle-name">{t.name}</div>
                        <div className="toggle-desc">{t.desc}</div>
                      </div>
                      <div className={`toggle-track${t.on ? ' on' : ''}`}><div className="toggle-thumb" /></div>
                    </div>
                  ))}
                </div>
              </Section>
            )}

            {/* ── Radio group ── */}
            {visibleIds.has('radio-group') && (
              <Section id="radio-group" label="Radio Group">
                <div className="radio-group">
                  {[
                    { label: 'Overdue first',  sub: 'recipes past their rotation window', selected: true },
                    { label: 'Pantry ready',   sub: 'only what you can cook right now' },
                    { label: 'Recently added', sub: 'newest recipes first' },
                    { label: 'Alphabetical' },
                  ].map((item, i) => (
                    <div key={i} className={`radio-item${item.selected ? ' selected' : ''}`}>
                      <div className="radio-dot"><div className="radio-inner" /></div>
                      <div style={{ flex: 1 }}>
                        <div className="radio-label">{item.label}</div>
                        {item.sub && <div className="radio-sub">{item.sub}</div>}
                      </div>
                    </div>
                  ))}
                </div>
              </Section>
            )}

            {/* ── Dropdown ── */}
            {visibleIds.has('dropdown') && (
              <Section id="dropdown" label="Dropdown / Select Menu">
                <div className="comp-row">
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.52rem', color: 'var(--ink-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>closed</div>
                    <div className="dropdown-wrap">
                      <div className="dropdown-trigger">
                        <span>Sort by: overdue</span>
                        <span className="dropdown-caret">▾</span>
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.52rem', color: 'var(--ink-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>open</div>
                    <div className="dropdown-wrap" style={{ width: 200 }}>
                      <div className="dropdown-trigger open">
                        <span>Sort by: overdue</span>
                        <span className="dropdown-caret">▾</span>
                      </div>
                      <div className="dropdown-menu">
                        {['Overdue', 'Recently cooked', 'Pantry ready', 'Alphabetical'].map((opt, i) => (
                          <div key={opt} className={`dropdown-item${i === 0 ? ' selected' : ''}`}>
                            {opt}{i === 0 && <span className="dropdown-item-check">✓</span>}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </Section>
            )}

            {/* ── Combobox ── */}
            {visibleIds.has('combobox') && (
              <Section id="combobox" label="Combobox (Search + Select)">
                <Combobox
                  label="Ingredient"
                  value={comboValue}
                  onChange={setComboValue}
                  placeholder="Search ingredients…"
                  options={[
                    { value: 'soy-sauce',   label: 'Soy Sauce',       sublabel: 'pantry · shelf 2' },
                    { value: 'sesame-oil',  label: 'Sesame Oil',       sublabel: 'pantry · shelf 2' },
                    { value: 'chili-flakes',label: 'Dried Chili Flakes', sublabel: 'spice rack' },
                    { value: 'ginger',      label: 'Fresh Ginger',     sublabel: 'produce' },
                    { value: 'tofu',        label: 'Dried Tofu Sheets', sublabel: 'pantry' },
                  ]}
                />
              </Section>
            )}

            {/* ── Slider ── */}
            {visibleIds.has('slider') && (
              <Section id="slider" label="Slider / Range Input">
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 320 }}>
                  <Slider label="Servings" value={sliderVal} min={1} max={12} onChange={setSliderVal} formatValue={v => String(v)} ticks={['1', '4', '8', '12']} />
                  <Slider label="Max cook time" value={sliderVal2} min={10} max={120} onChange={setSliderVal2} formatValue={v => `${v} min`} ticks={['10m', '30m', '60m', '2h+']} color="gold" />
                </div>
              </Section>
            )}

            {/* ── Tag input ── */}
            {visibleIds.has('tag-input') && (
              <Section id="tag-input" label="Tag Input">
                <TagInput tags={tags} onChange={setTags} placeholder="Add tag…" label="Recipe tags" />
              </Section>
            )}

            {/* ── Stepper ── */}
            {visibleIds.has('stepper') && (
              <Section id="stepper" label="Stepper / Quantity Input">
                <div className="comp-row" style={{ alignItems: 'center' }}>
                  {[{ label: 'servings', val: 4 }, { label: 'stock qty (oz)', val: 12 }].map(s => (
                    <div key={s.label} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.52rem', color: 'var(--ink-muted)' }}>{s.label}</div>
                      <div className="stepper">
                        <button className="stepper-btn">−</button>
                        <div className="stepper-val">{s.val}</div>
                        <button className="stepper-btn">+</button>
                      </div>
                    </div>
                  ))}
                </div>
              </Section>
            )}

            {/* ── File upload ── */}
            {visibleIds.has('file-upload') && (
              <Section id="file-upload" label="File Upload">
                <FileUpload
                  label="Upload recipe image"
                  sublabel="PNG, JPG or WEBP · max 4 MB"
                  files={files}
                  onUpload={newFiles => setFiles(f => [...f, ...newFiles])}
                  onRemove={i => setFiles(f => f.filter((_, idx) => idx !== i))}
                  accept="image/*"
                />
              </Section>
            )}

            {/* ── Date picker ── */}
            {visibleIds.has('date-picker') && (
              <Section id="date-picker" label="Date · Time · DateTime Pickers">
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px', alignItems: 'flex-start' }}>
                  <DatePicker     value={pickedDate}     onChange={setPickedDate}     label="Date" />
                  <TimePicker     value={pickedTime}     onChange={setPickedTime}     label="Time" />
                  <DateTimePicker value={pickedDatetime} onChange={setPickedDatetime} label="Date & Time" />
                </div>
              </Section>
            )}

            {/* ── Filter pills ── */}
            {visibleIds.has('filter-pills') && (
              <Section id="filter-pills" label="Filter Pills">
                <div className="pill-row">
                  <button className="pill active">All</button>
                  <button className="pill">Recently cooked</button>
                  <button className="pill">✓ Pantry ready</button>
                  <button className="pill">Never eaten</button>
                  <button className="pill">Under 20 min</button>
                  <button className="pill">45+ min</button>
                </div>
              </Section>
            )}

            {/* ── Tab bar ── */}
            {visibleIds.has('tab-bar') && (
              <Section id="tab-bar" label="Tab Bar">
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <div className="tab-bar">
                    {['All', 'Breakfast', 'Lunch', 'Dinner', 'Snack'].map((t, i) => (
                      <div key={t} className={`tab${i === 0 ? ' active' : ''}`}>{t}</div>
                    ))}
                  </div>
                  <div className="tab-bar">
                    {['Week', 'Month', 'All time'].map((t, i) => (
                      <div key={t} className={`tab${i === 0 ? ' active' : ''}`}>{t}</div>
                    ))}
                  </div>
                </div>
              </Section>
            )}

            {/* ── Breadcrumbs ── */}
            {visibleIds.has('breadcrumbs') && (
              <Section id="breadcrumbs" label="Breadcrumbs">
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <Breadcrumbs items={[{ label: 'Home' }, { label: 'Recipes' }, { label: 'Corn Chowder' }]} />
                  <Breadcrumbs items={[{ label: 'Pantry' }, { label: 'Shelf 2' }, { label: 'Soy Sauce' }]} />
                  <Breadcrumbs items={[{ label: 'Settings' }, { label: 'Meal types' }]} />
                </div>
              </Section>
            )}

            {/* ── Pagination ── */}
            {visibleIds.has('pagination') && (
              <Section id="pagination" label="Pagination">
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <Pagination page={activePage} total={12} onChange={setActivePage} />
                  <div className="text-sm text-muted">Page {activePage} of 12</div>
                </div>
              </Section>
            )}

            {/* ── Steps ── */}
            {visibleIds.has('steps') && (
              <Section id="steps" label="Steps / Wizard">
                <Steps
                  current={2}
                  steps={[
                    { label: 'Details' },
                    { label: 'Ingredients' },
                    { label: 'Instructions' },
                    { label: 'Review' },
                  ]}
                />
              </Section>
            )}

            {/* ── Action row ── */}
            {visibleIds.has('action-row') && (
              <Section id="action-row" label="Inline Action Row">
                <div className="action-row">
                  <button className="act-btn primary">✎ edit</button>
                  <button className="act-btn">plan</button>
                  <button className="act-btn">cook</button>
                  <button className="act-btn danger">✕ delete</button>
                </div>
              </Section>
            )}

            {/* ── Keyboard shortcuts ── */}
            {visibleIds.has('keyboard-shortcuts') && (
              <Section id="keyboard-shortcuts" label="Keyboard Shortcuts">
                <div className="kbd-demo">
                  {[
                    { keys: ['⌘', 'K'], label: 'search' },
                    { keys: ['E'],       label: 'edit' },
                    { keys: ['C'],       label: 'cook mode' },
                    { keys: ['P'],       label: 'plan' },
                    { keys: ['⌘', '⌫'], label: 'delete' },
                    { keys: ['?'],       label: 'shortcuts' },
                  ].map((item, i) => (
                    <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                      <span className="kbd-combo">
                        {item.keys.map((k, j) => <kbd key={j}>{k}</kbd>)}
                      </span>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', color: 'var(--ink-muted)' }}>{item.label}</span>
                      {i < 5 && <span style={{ opacity: 0.2, margin: '0 4px' }}>·</span>}
                    </span>
                  ))}
                </div>
              </Section>
            )}

            {/* ── Toasts ── */}
            {visibleIds.has('toasts') && (
              <Section id="toasts" label="Toasts / Notifications">
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <button className="btn btn-secondary btn-sm" onClick={() => toast.success('Changes saved.')}>Success</button>
                  <button className="btn btn-secondary btn-sm" onClick={() => toast.error('Something went wrong.')}>Error</button>
                  <button className="btn btn-secondary btn-sm" onClick={() => toast.info('3 items updated.')}>Info</button>
                  <button className="btn btn-secondary btn-sm" onClick={() => toast.undo('Item deleted.', () => toast.info('Restored.'))}>Undo</button>
                </div>
              </Section>
            )}

            {/* ── Alerts ── */}
            {visibleIds.has('alerts') && (
              <Section id="alerts" label="Alerts / Inline Banners">
                <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                  <Alert variant="info"    dismissible>Your meal plan has been synced across all devices.</Alert>
                  <Alert variant="success" title="Recipe added" action={{ label: 'view recipe', onClick: () => {} }}>Corn Chowder is now in your library.</Alert>
                  <Alert variant="warning" title="Low pantry stock" action={{ label: 'review pantry', onClick: () => {} }}>3 ingredients are running low.</Alert>
                  <Alert variant="error"   title="Sync failed" action={{ label: 'retry', onClick: () => {} }}>Could not connect to server.</Alert>
                </div>
              </Section>
            )}

            {/* ── Banners ── */}
            {visibleIds.has('banners') && (
              <Section id="banners" label="Confirmation Banners">
                <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                  {[
                    { color: 'var(--sage)',        title: 'Pantry updated',   sub: 'Sesame Oil marked as restocked.',                  actions: ['undo'] },
                    { color: 'var(--gold)',        title: 'Unsaved changes',  sub: "Your recipe edits haven't been saved.",             actions: ['discard', 'save'] },
                    { color: 'var(--terracotta)',  title: 'Confirm delete',   sub: 'Corn Chowder will be permanently removed.',         actions: ['cancel', 'delete'] },
                  ].map(b => (
                    <div key={b.title} className="banner">
                      <div className="banner-stripe" style={{ background: b.color }} />
                      <div className="banner-body">
                        <div className="banner-text">
                          <div className="banner-title">{b.title}</div>
                          <div className="banner-sub">{b.sub}</div>
                        </div>
                        <div className="banner-actions">
                          {b.actions.map((a, i) => (
                            <button key={a} className={`banner-btn${i === b.actions.length - 1 && b.actions.length > 1 ? ' confirm' : ''}`}>{a}</button>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Section>
            )}

            {/* ── Progress ── */}
            {visibleIds.has('progress') && (
              <Section id="progress" label="Progress Bar">
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14, maxWidth: 320 }}>
                  <Progress label="Pantry coverage"          value={75}  color="sage"       displayValue="75%" />
                  <Progress label="Monthly budget"           value={74}  color="gold"       displayValue="$186 / $250" />
                  <Progress label="Ingredients matched"      value={66}  color="terracotta" displayValue="2/3" />
                  <Progress label="Syncing library…" color="terracotta" />
                </div>
              </Section>
            )}

            {/* ── Spinner ── */}
            {visibleIds.has('spinner') && (
              <Section id="spinner" label="Spinner / Loading">
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'center' }}>
                  <Spinner size="sm" />
                  <Spinner size="md" />
                  <Spinner size="lg" />
                  <Spinner size="md" color="sage" />
                  <Spinner size="md" color="gold" />
                  <Spinner size="sm" label="Loading recipes…" />
                  <Spinner size="sm" color="sage" label="Syncing pantry…" />
                </div>
              </Section>
            )}

            {/* ── Tooltips ── */}
            {visibleIds.has('tooltips') && (
              <Section id="tooltips" label="Tooltips">
                <div className="tooltip-demo">
                  {[
                    { target: '✓ pantry ready', tip: 'You have all 5 ingredients in stock.' },
                    { target: '10m',             tip: 'Active cook time only.' },
                    { target: 'RCP-09',           tip: 'Recipe ID — used in meal plans & exports.' },
                    { target: '3× cooked',        tip: 'Last cooked 8 days ago.' },
                  ].map(t => (
                    <div key={t.target} className="tooltip-wrap">
                      <div className="tooltip-target">{t.target}</div>
                      <div className="tooltip-box">{t.tip}</div>
                    </div>
                  ))}
                </div>
              </Section>
            )}

            {/* ── Empty states ── */}
            {visibleIds.has('empty-states') && (
              <Section id="empty-states" label="Empty States">
                <div className="comp-row">
                  {[
                    { icon: '□', title: 'No recipes yet',   sub: 'Add your first recipe to start building your library.', btn: '+ add recipe' },
                    { icon: '□', title: 'List is empty',    sub: 'Items will appear here when pantry stock runs low.',     btn: '+ add item'   },
                  ].map(e => (
                    <div key={e.title} className="empty-state">
                      <div className="empty-icon">{e.icon}</div>
                      <div className="empty-title">{e.title}</div>
                      <div className="empty-sub">{e.sub}</div>
                      <button className="empty-btn">{e.btn}</button>
                    </div>
                  ))}
                </div>
              </Section>
            )}

            {/* ── Modal ── */}
            {visibleIds.has('modal') && (
              <Section id="modal" label="Modal / Dialog">
                <div className="comp-row" style={{ alignItems: 'flex-start' }}>
                  <div className="modal-demo">
                    <div className="modal-header">
                      <div className="modal-header-spine" style={{ background: 'var(--terracotta)' }} />
                      <div className="modal-header-body">
                        <span className="modal-title">Add recipe</span>
                        <button className="modal-close">✕ close</button>
                      </div>
                    </div>
                    <div className="modal-body">
                      <div className="comp-field"><div className="comp-field-label">Name</div><div className="comp-field-input"><input type="text" placeholder="Recipe name…" /></div></div>
                      <div className="comp-field"><div className="comp-field-label">Cook time</div><div className="comp-field-input"><input type="text" placeholder="30" style={{ textAlign: 'right' }} /><div className="comp-field-suffix">min</div></div></div>
                    </div>
                    <div className="modal-footer">
                      <button className="modal-btn">cancel</button>
                      <button className="modal-btn confirm">save recipe</button>
                    </div>
                  </div>
                  <div className="modal-demo" style={{ width: 260 }}>
                    <div className="modal-header">
                      <div className="modal-header-spine" style={{ background: 'var(--terracotta)' }} />
                      <div className="modal-header-body">
                        <span className="modal-title">Delete recipe</span>
                        <button className="modal-close">✕</button>
                      </div>
                    </div>
                    <div className="modal-body">
                      <p style={{ fontSize: '0.72rem', color: 'var(--ink-soft)', lineHeight: 1.6 }}>
                        This will permanently remove <strong>Corn Chowder</strong> from your library.
                      </p>
                    </div>
                    <div className="modal-footer">
                      <button className="modal-btn">cancel</button>
                      <button className="modal-btn destructive">delete</button>
                    </div>
                  </div>
                </div>
              </Section>
            )}

            {/* ── Context menu ── */}
            {visibleIds.has('context-menu') && (
              <Section id="context-menu" label="Contextual / Right-click Menu">
                <div className="ctx-menu">
                  {[
                    { icon: '✎', label: 'Edit recipe',         kbd: 'E' },
                    { icon: '+', label: 'Add to meal plan',     kbd: 'P' },
                    { icon: '▶', label: 'Start cook mode',      kbd: 'C' },
                    { icon: '+', label: 'Add missing to list' },
                    null,
                    { icon: '⎘', label: 'Duplicate' },
                    null,
                    { icon: '✕', label: 'Delete recipe', danger: true, kbd: '⌫' },
                  ].map((item, i) =>
                    item === null ? <div key={i} className="ctx-divider" /> : (
                      <div key={i} className={`ctx-item${item.danger ? ' danger' : ''}`}>
                        <span className="ctx-item-icon">{item.icon}</span>
                        {item.label}
                        {item.kbd && (
                          <span
                            className="ctx-item-kbd"
                            style={item.danger ? { borderColor: 'rgba(184,98,64,0.3)', color: 'var(--terracotta)' } : {}}
                          >{item.kbd}</span>
                        )}
                      </div>
                    )
                  )}
                </div>
              </Section>
            )}

            {/* ── Drawer ── */}
            {visibleIds.has('drawer') && (
              <Section id="drawer" label="Drawer / Side Sheet">
                <button className="btn btn-secondary" onClick={() => setDrawerOpen(true)}>Open drawer</button>
                <Drawer
                  open={drawerOpen}
                  onClose={() => setDrawerOpen(false)}
                  title="Edit recipe"
                  footer={
                    <>
                      <button className="drawer-btn" onClick={() => setDrawerOpen(false)}>cancel</button>
                      <button className="drawer-btn confirm" onClick={() => setDrawerOpen(false)}>save</button>
                    </>
                  }
                >
                  <p>Make changes to this recipe. Updates will sync to all meal plans where it appears.</p>
                </Drawer>
              </Section>
            )}

            {/* ── Popover ── */}
            {visibleIds.has('popover') && (
              <Section id="popover" label="Popover">
                <Popover
                  title="Recipe details"
                  trigger={<button className="btn btn-secondary">RCP-09 · Corn Chowder</button>}
                  footer={<button className="popover-action">open recipe →</button>}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {[['Last cooked', 'today'], ['Times made', '1×'], ['Cook time', '90m'], ['Pantry match', '5/5 ✓']].map(([k, v]) => (
                      <div key={k} style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span className="popover-key">{k}</span>
                        <span className="popover-val" style={v.includes('✓') ? { color: 'var(--sage)' } : {}}>{v}</span>
                      </div>
                    ))}
                  </div>
                </Popover>
              </Section>
            )}

            {/* ── Command palette ── */}
            {visibleIds.has('command-palette') && (
              <Section id="command-palette" label="Command Palette">
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <button className="btn btn-secondary" onClick={() => setCmdOpen(true)}>
                    Open palette
                  </button>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span className="kbd-combo"><kbd>⌘</kbd><kbd>K</kbd></span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', color: 'var(--ink-muted)' }}>also works globally on this page</span>
                  </div>
                </div>
              </Section>
            )}

            {/* ── Badges ── */}
            {visibleIds.has('badges') && (
              <Section id="badges" label="Badges & Tags">
                <div className="comp-row" style={{ alignItems: 'center' }}>
                  <span className="badge badge-terra">Asian</span>
                  <span className="badge badge-sage">Basic</span>
                  <span className="badge badge-gold">RCP-04</span>
                  <span className="badge badge-teal">Quick</span>
                  <span className="badge badge-ink">never eaten</span>
                  <span className="badge badge-terra">✓ pantry ready</span>
                  <span className="badge badge-sage">10m</span>
                  <span className="badge badge-ink">3× cooked</span>
                  <span className="tag">fermenting</span>
                  <span className="tag">sourdough</span>
                </div>
              </Section>
            )}

            {/* ── Avatar ── */}
            {visibleIds.has('avatar') && (
              <Section id="avatar" label="Avatar / User Chip">
                <div className="comp-row" style={{ alignItems: 'center' }}>
                  <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                    <Avatar initials="JX" size="sm" />
                    <Avatar initials="JX" size="md" />
                    <Avatar initials="JX" size="lg" />
                  </div>
                  <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                    <Avatar initials="MR" size="md" color="terracotta" />
                    <Avatar initials="AL" size="md" color="sage" />
                    <Avatar initials="KP" size="md" color="teal" />
                    <Avatar initials="SW" size="md" color="gold" />
                  </div>
                  <AvatarStack avatars={[{ initials: 'JX', color: 'terracotta' }, { initials: 'MR', color: 'sage' }, { initials: 'AL', color: 'teal' }, { initials: 'KP' }, { initials: 'SW' }]} max={3} />
                  <UserChip initials="JX" name="Johnny Xu" role="owner" color="terracotta" />
                </div>
              </Section>
            )}

            {/* ── Callout ── */}
            {visibleIds.has('callout') && (
              <Section id="callout" label="Callout / Prose Block">
                <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                  <Callout>This recipe serves 4 but scales well. Double the chili paste if you prefer a spicier profile.</Callout>
                  <Callout variant="tip"    title="Tip">Bloom the spices in oil for 45 seconds before adding liquid.</Callout>
                  <Callout variant="warn"   title="Sesame oil">Add at the very end, off the heat. High temperatures destroy the flavor.</Callout>
                  <Callout variant="danger" title="Allergen">Contains soy, sesame, and gluten.</Callout>
                </div>
              </Section>
            )}

            {/* ── Code block ── */}
            {visibleIds.has('code-block') && (
              <Section id="code-block" label="Code Block">
                <CodeBlock language="python" code={SAMPLE_CODE} />
              </Section>
            )}

            {/* ── Accordion ── */}
            {visibleIds.has('accordion') && (
              <Section id="accordion" label="Accordion">
                <Accordion
                  defaultOpen={['nutrition']}
                  items={[
                    { id: 'nutrition',      label: 'Nutritional information',    content: 'Estimated per serving: 320 kcal · 12g protein · 48g carbs · 8g fat.' },
                    { id: 'substitutions',  label: 'Substitutions & variations', content: 'Substitute coconut milk for a richer, dairy-free version. Add a jalapeño for heat.' },
                    { id: 'storage',        label: 'Storage & reheating',        content: 'Keeps refrigerated for 4 days. Reheat gently on the stovetop with a splash of broth.' },
                    { id: 'cook-notes',     label: 'Cook notes',                 content: 'The soup thickens considerably as it cools. Thin with broth or water when reheating.' },
                  ]}
                />
              </Section>
            )}

            {/* ── Divider ── */}
            {visibleIds.has('divider') && (
              <Section id="divider" label="Divider">
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <Divider />
                  <Divider label="or" />
                  <Divider label="this week" />
                </div>
              </Section>
            )}

            {/* ── CheckList ── */}
            {visibleIds.has('checklist') && (
              <Section id="checklist" label="CheckList">
                <div style={{ maxWidth: 480 }}>
                  <CheckList
                    defaultChecked={['ginger']}
                    items={[
                      { id: 'milk',   label: 'Whole milk',        meta: '½ gal', tag: 'Costco',    tagColor: 'sage' },
                      { id: 'ginger', label: 'Ginger root',       meta: '2 oz',  tag: 'King Soop', tagColor: 'gold' },
                      { id: 'tofu',   label: 'Dried tofu sheets', meta: '1 pkg', tag: 'H Mart',    tagColor: 'teal' },
                      { id: 'pepper', label: 'Jalapeños',         meta: '3 ct' },
                    ]}
                  />
                </div>
              </Section>
            )}

            {/* ── Section header ── */}
            {visibleIds.has('section-header') && (
              <Section id="section-header" label="Section Header">
                <div className="sh">
                  <div className="sh-spine" style={{ background: 'var(--terracotta)' }} />
                  <div className="sh-body">
                    <span className="sh-title">Recipe Library</span>
                    <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                      <span className="rc-chip">48 recipes</span>
                      <span className="sh-count">sort: overdue</span>
                    </div>
                  </div>
                </div>
              </Section>
            )}

          </main>
        </div>
      </div>
    </>
  )
}
