'use client'
import { useState } from 'react'
import { ToastContainer, toast } from '@/components/Toast'
import { DataTable, ViewToggle, useViewMode, ColDef } from '@/components/DataTable'
import InlineEdit from '@/components/InlineEdit'
import { CardGridSkeleton, ItemGridSkeleton, RowListSkeleton, KanbanSkeleton, ListSkeleton } from '@/components/Skeletons'
import SwipeRow from '@/components/SwipeRow'
import MarkdownRenderer from '@/components/MarkdownRenderer'
import { Sun, Moon } from 'lucide-react'
import { THEMES } from '@/lib/settings'

// ── Theme switcher ────────────────────────────────────────────
function applyTheme(name: 'levanzo' | 'levanzo-notte') {
  const theme = THEMES[name]
  const root = document.documentElement
  for (const [k, v] of Object.entries(theme)) root.style.setProperty(k, v)
}

// ── Section wrapper ───────────────────────────────────────────
function Section({ title, sub, children }: { title: string; sub?: string; children: React.ReactNode }) {
  return (
    <section style={{ marginBottom: '3rem' }}>
      <div className="section-header" style={{ marginBottom: '1.25rem', fontSize: '0.72rem' }}>
        {title}
      </div>
      {sub && <p className="text-sm text-muted" style={{ marginBottom: '1rem' }}>{sub}</p>}
      {children}
    </section>
  )
}

// ── Sample table data ─────────────────────────────────────────
type Row = { id: string; name: string; category: string; count: number; status: string }
const TABLE_DATA: Row[] = [
  { id: '1', name: 'Component A', category: 'UI',      count: 12, status: 'Active'   },
  { id: '2', name: 'Component B', category: 'Layout',  count: 4,  status: 'Draft'    },
  { id: '3', name: 'Component C', category: 'UI',      count: 7,  status: 'Active'   },
  { id: '4', name: 'Component D', category: 'Utility', count: 0,  status: 'Archived' },
  { id: '5', name: 'Component E', category: 'Layout',  count: 19, status: 'Active'   },
]
const TABLE_COLS: ColDef<Row>[] = [
  { key: 'name',     label: 'Name',     sortValue: r => r.name },
  { key: 'category', label: 'Category', sortValue: r => r.category },
  { key: 'count',    label: 'Count',    sortValue: r => r.count, width: 80 },
  { key: 'status',   label: 'Status',   sortValue: r => r.status,
    render: r => (
      <span className={`badge ${r.status === 'Active' ? 'badge-sage' : r.status === 'Draft' ? 'badge-gold' : 'badge-ink'}`}>
        {r.status}
      </span>
    )
  },
]

const SAMPLE_MD = `## Section Heading

Start with **bold emphasis** to anchor the reader — use it sparingly.

A plain list:
- [ ] Unchecked item
- [x] Completed item
- [ ] Another item

> A blockquote for callouts or pull quotes.

---

Use *italics* for nuance, not decoration. \`inline code\` for technical terms.`

export default function Home() {
  const [theme, setTheme] = useState<'levanzo' | 'levanzo-notte'>('levanzo')
  const [inlineVal, setInlineVal] = useState('Click to edit this label')
  const [showSkeleton, setShowSkeleton] = useState<string | null>(null)
  const [view, setView] = useViewMode('demo-view', 'grid')

  function toggleTheme() {
    const next = theme === 'levanzo' ? 'levanzo-notte' : 'levanzo'
    setTheme(next)
    applyTheme(next)
  }

  return (
    <>
      <ToastContainer />

      {/* Header */}
      <nav style={{
        background: 'var(--nav-bg)',
        borderBottom: '2px solid rgba(255,255,255,0.07)',
        padding: '0 2rem',
        height: 52,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}>
        <span style={{ fontFamily: 'Cormorant Garamond, serif', fontStyle: 'italic', fontSize: 20, color: 'var(--cream)' }}>
          levanzo<span style={{ color: 'var(--terracotta-light)' }}>.ui</span>
        </span>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <a
            href="https://github.com/thejohnnyxu/levanzo-ui"
            target="_blank"
            rel="noreferrer"
            className="btn btn-ghost btn-sm"
            style={{ color: 'rgba(232,218,196,0.5)', fontSize: '0.75rem' }}
          >
            GitHub
          </a>
          <button
            className="btn btn-ghost btn-sm"
            onClick={toggleTheme}
            title="Toggle theme"
            style={{ color: 'rgba(232,218,196,0.6)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
          >
            {theme === 'levanzo' ? <Moon size={14} /> : <Sun size={14} />}
            {theme === 'levanzo' ? 'Notte' : 'Levanzo'}
          </button>
        </div>
      </nav>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '3rem 2rem 6rem' }}>

        {/* Hero */}
        <div style={{ marginBottom: '3.5rem' }}>
          <h1 className="page-title" style={{ marginBottom: '0.5rem' }}>Levanzo UI</h1>
          <p className="page-subtitle" style={{ maxWidth: 520 }}>
            A warm, tactile design system built from the Levanzo terrazzo aesthetic —
            cream parchment, terracotta accents, sage and gold, with a deep espresso nav.
            Two built-in themes: <strong>Levanzo</strong> (day) and <strong>Levanzo Notte</strong> (night).
          </p>
        </div>

        {/* ── Color Tokens ────────────────────────────────── */}
        <Section title="Color Tokens" sub="All colors are CSS custom properties. Switch themes with applyTheme().">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '0.65rem' }}>
            {[
              '--cream',
              '--cream-dark',
              '--parchment',
              '--ink',
              '--ink-soft',
              '--ink-muted',
              '--terracotta',
              '--terracotta-light',
              '--sage',
              '--sage-light',
              '--gold',
              '--gold-light',
            ].map(varName => (
              <div key={varName} style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <div style={{
                  height: 48,
                  borderRadius: 4,
                  background: `var(${varName})`,
                  border: '2px solid var(--border-strong)',
                }} />
                <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.62rem', color: 'var(--ink-muted)' }}>
                  {varName}
                </span>
              </div>
            ))}
          </div>
        </Section>

        {/* ── Typography ──────────────────────────────────── */}
        <Section title="Typography">
          <div className="card card-tight" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <span className="section-label" style={{ display: 'block', marginBottom: '0.35rem' }}>Display — Cormorant Garamond</span>
              <span style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2.2rem', fontWeight: 400, color: 'var(--ink)' }}>
                Form follows feeling
              </span>
            </div>
            <div>
              <span className="section-label" style={{ display: 'block', marginBottom: '0.35rem' }}>Body — DM Sans 300/400/500</span>
              <p className="text-md" style={{ color: 'var(--ink-soft)', maxWidth: 480 }}>
                A warm, restrained sans-serif that pairs with Cormorant Garamond for editorial hierarchy.
                Weights 300–600 available.
              </p>
            </div>
            <div>
              <span className="section-label" style={{ display: 'block', marginBottom: '0.35rem' }}>Mono — JetBrains Mono</span>
              <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.8rem', color: 'var(--ink-muted)' }}>
                .badge · .pill · .filter-tab · timestamps · codes
              </span>
            </div>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'baseline' }}>
              {(['xs', 'sm', 'base', 'md', 'lg', 'xl'] as const).map(s => (
                <span key={s} className={`text-${s}`} style={{ color: 'var(--ink-soft)' }}>
                  {s}
                </span>
              ))}
            </div>
          </div>
        </Section>

        {/* ── Buttons ─────────────────────────────────────── */}
        <Section title="Buttons">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center' }}>
            <button className="btn btn-primary">Primary</button>
            <button className="btn btn-secondary">Secondary</button>
            <button className="btn btn-ghost">Ghost</button>
            <button className="btn btn-danger">Danger</button>
            <button className="btn btn-primary btn-sm">Primary sm</button>
            <button className="btn btn-secondary btn-sm">Secondary sm</button>
          </div>
        </Section>

        {/* ── Badges & Tags ───────────────────────────────── */}
        <Section title="Badges & Tags">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', alignItems: 'center' }}>
            <span className="badge badge-sage">Active</span>
            <span className="badge badge-terracotta">Overdue</span>
            <span className="badge badge-gold">Pending</span>
            <span className="badge badge-ink">Archived</span>
            <span className="tag">tag-one</span>
            <span className="tag">tag-two</span>
            <span className="filter-tab">All</span>
            <span className="filter-tab active">Category A</span>
            <span className="filter-tab">Category B</span>
          </div>
        </Section>

        {/* ── Alerts ──────────────────────────────────────── */}
        <Section title="Alerts">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            <div className="alert-error">Something went wrong — please try again.</div>
            <div className="alert-warning">3 items require your attention.</div>
            <div className="alert-info">Changes saved successfully.</div>
          </div>
        </Section>

        {/* ── Inputs ──────────────────────────────────────── */}
        <Section title="Inputs">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', maxWidth: 560 }}>
            <div className="field">
              <label className="label">Label</label>
              <input className="input" type="text" placeholder="Placeholder text" />
            </div>
            <div className="field">
              <label className="label">Select</label>
              <select className="input">
                <option>Option A</option>
                <option>Option B</option>
                <option>Option C</option>
              </select>
            </div>
            <div className="field" style={{ gridColumn: '1 / -1' }}>
              <label className="label">Textarea</label>
              <textarea className="input" placeholder="Optional notes…" />
            </div>
          </div>
        </Section>

        {/* ── Cards ───────────────────────────────────────── */}
        <Section title="Cards">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
            {['Card Title One', 'Card Title Two', 'Card Title Three'].map((name, i) => (
              <div key={name} className="card" style={{ padding: '1.25rem', cursor: 'pointer' }}>
                <div className="recipe-card-title" style={{ marginBottom: '0.4rem' }}>{name}</div>
                <p className="text-sm text-muted" style={{ marginBottom: '0.75rem', lineHeight: 1.5 }}>
                  A short description that gives context about the content of this card.
                </p>
                <div className="divider" style={{ margin: '0 0 0.75rem' }} />
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <span className="badge badge-sage">Active</span>
                  <span className="text-xs text-muted" style={{ marginLeft: 'auto' }}>{i + 1} of 3</span>
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* ── Modal ───────────────────────────────────────── */}
        <Section title="Modal">
          <div style={{ border: '2px solid var(--border-strong)', borderRadius: 6, overflow: 'hidden', maxWidth: 520 }}>
            <div className="modal-header">
              <span className="modal-title">Dialog Title</span>
              <button className="btn btn-ghost btn-sm" style={{ padding: '0 0.4rem' }}>✕</button>
            </div>
            <div className="modal-body">
              <div className="field">
                <label className="label">Field One</label>
                <input className="input" defaultValue="Default value" />
              </div>
              <div className="field">
                <label className="label">Field Two</label>
                <input className="input" type="number" defaultValue="42" />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary btn-sm">Cancel</button>
              <button className="btn btn-primary btn-sm">Save</button>
            </div>
          </div>
        </Section>

        {/* ── Toast ───────────────────────────────────────── */}
        <Section title="Toast" sub="Global toast notifications. Call toast.success(), toast.error(), toast.info(), or toast.undo().">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            <button className="btn btn-secondary btn-sm" onClick={() => toast.success('Changes saved.')}>
              Success toast
            </button>
            <button className="btn btn-secondary btn-sm" onClick={() => toast.error('Something went wrong.')}>
              Error toast
            </button>
            <button className="btn btn-secondary btn-sm" onClick={() => toast.info('3 items updated.')}>
              Info toast
            </button>
            <button className="btn btn-secondary btn-sm" onClick={() => toast.undo('Item deleted.', () => toast.info('Restored.'))}>
              Undo toast
            </button>
          </div>
        </Section>

        {/* ── InlineEdit ──────────────────────────────────── */}
        <Section title="InlineEdit" sub="Click the text below to edit inline. Save with Enter or blur, cancel with Escape.">
          <div className="card card-tight" style={{ padding: '1rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
            <span className="text-sm text-muted">Label:</span>
            <InlineEdit
              value={inlineVal}
              onSave={setInlineVal}
              style={{ fontWeight: 500, color: 'var(--ink)' }}
            />
          </div>
        </Section>

        {/* ── DataTable ───────────────────────────────────── */}
        <Section title="DataTable" sub="Sortable, column-toggling table with persistent preferences via localStorage.">
          <DataTable
            columns={TABLE_COLS}
            data={TABLE_DATA}
            storageKey="demo-table"
            emptyMessage="No items found"
          />
        </Section>

        {/* ── ViewToggle ──────────────────────────────────── */}
        <Section title="ViewToggle" sub="Persistent grid / compact / table view switcher.">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <ViewToggle view={view} setView={setView} storageKey="demo-view" />
            <span className="text-sm text-muted">Current: <strong>{view}</strong></span>
          </div>
        </Section>

        {/* ── Skeletons ───────────────────────────────────── */}
        <Section title="Skeletons" sub="Loading states for card grids, item lists, row lists, kanban boards, and generic lists.">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
            {(['card-grid', 'item-grid', 'row-list', 'kanban', 'list'] as const).map(s => (
              <button
                key={s}
                className={`btn btn-sm ${showSkeleton === s ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setShowSkeleton(showSkeleton === s ? null : s)}
              >
                {s}
              </button>
            ))}
          </div>
          {showSkeleton === 'card-grid'  && <CardGridSkeleton />}
          {showSkeleton === 'item-grid'  && <ItemGridSkeleton />}
          {showSkeleton === 'row-list'   && <RowListSkeleton />}
          {showSkeleton === 'kanban'     && <KanbanSkeleton />}
          {showSkeleton === 'list'       && <ListSkeleton rows={4} />}
        </Section>

        {/* ── SwipeRow ────────────────────────────────────── */}
        <Section title="SwipeRow" sub="Touch-native swipe-to-delete and swipe-to-edit. Try on mobile.">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', maxWidth: 420 }}>
            {['Row item one', 'Row item two', 'Row item three'].map((item, i) => (
              <SwipeRow
                key={item}
                onDelete={() => toast.undo(`Deleted "${item}"`, () => {})}
                onEdit={() => toast.info(`Edit "${item}"`)}
              >
                <div className="card card-tight" style={{ padding: '0.75rem 1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className="text-md">{item}</span>
                  <span className="text-sm text-muted">{['Category A', 'Category B', 'Category C'][i]}</span>
                </div>
              </SwipeRow>
            ))}
          </div>
        </Section>

        {/* ── MarkdownRenderer ────────────────────────────── */}
        <Section title="MarkdownRenderer" sub="Renders markdown with full tiptap-renderer styles.">
          <div className="card card-tight" style={{ padding: '1.25rem' }}>
            <MarkdownRenderer markdown={SAMPLE_MD} />
          </div>
        </Section>

        {/* ── Stat Row ────────────────────────────────────── */}
        <Section title="Utility: stat-row">
          <div className="card card-tight" style={{ padding: '1rem', maxWidth: 320 }}>
            {[
              ['Total items',    '48'],
              ['Updated today',  '5'],
              ['Pending review', '12'],
            ].map(([label, val]) => (
              <div key={label} className="stat-row">
                <span className="stat-label">{label}</span>
                <span className="stat-value">{val}</span>
              </div>
            ))}
          </div>
        </Section>

        {/* ── Layout Helpers ──────────────────────────────── */}
        <Section title="Utility: layout & text helpers">
          <div className="card card-tight" style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <div className="spread">
              <span className="text-sm text-muted">.spread — space between</span>
              <span className="badge badge-sage">aligned</span>
            </div>
            <hr className="divider" />
            <div className="row gap-sm">
              <span className="text-accent fw-500">.text-accent</span>
              <span className="text-sage">.text-sage</span>
              <span className="text-gold">.text-gold</span>
              <span className="text-muted">.text-muted</span>
            </div>
            <div className="empty-msg">No items yet — .empty-msg</div>
          </div>
        </Section>

        {/* Footer */}
        <div style={{ borderTop: '2px solid var(--border-strong)', paddingTop: '2rem', marginTop: '2rem' }}>
          <p className="text-sm text-muted">
            levanzo-ui · MIT · <a href="https://github.com/thejohnnyxu/levanzo-ui" style={{ color: 'var(--terracotta)' }}>github.com/thejohnnyxu/levanzo-ui</a>
          </p>
        </div>
      </div>
    </>
  )
}
