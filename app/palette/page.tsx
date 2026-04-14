"use client";
import { useState, useCallback } from "react";
import { THEMES, ACCENT_SERIES } from "@/lib/settings";
import { Check, Copy, Palette } from "lucide-react";

// ── Helpers ───────────────────────────────────────────────────────────────────
function hexToRgb(hex: string): string {
  if (!hex || !hex.startsWith("#") || hex.length < 7) return "";
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `${r} ${g} ${b}`;
}

function getThemeHex(theme: "levanzo" | "levanzo-notte", token: string): string {
  return THEMES[theme][token] ?? "";
}

// ── Copy-able swatch ──────────────────────────────────────────────────────────
function ColorSwatch({
  hex,
  label,
  token,
  desc,
  stop,
  size = "md",
}: {
  hex: string;
  label: string;
  token?: string;
  desc?: string;
  stop?: string;
  size?: "sm" | "md" | "lg";
}) {
  const [copied, setCopied] = useState(false);

  const copy = useCallback(async () => {
    if (!hex.startsWith("#")) return;
    await navigator.clipboard.writeText(hex);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  }, [hex]);

  const canCopy = hex.startsWith("#");
  const rgb = hexToRgb(hex);

  const swatchH = size === "lg" ? 88 : size === "sm" ? 52 : 68;
  const swatchW = size === "lg" ? 156 : size === "sm" ? 104 : 130;

  return (
    <div
      onClick={canCopy ? copy : undefined}
      title={canCopy ? `Click to copy ${hex}` : undefined}
      style={{
        borderRadius: 10,
        overflow: "hidden",
        border: "1.5px solid rgba(44,36,24,0.13)",
        background: "var(--paper)",
        flexShrink: 0,
        cursor: canCopy ? "pointer" : "default",
        transition: "transform 0.12s, box-shadow 0.12s",
        width: swatchW,
      }}
      onMouseEnter={e => {
        if (canCopy) {
          (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
          (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 12px rgba(44,36,24,0.12)";
        }
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLElement).style.transform = "";
        (e.currentTarget as HTMLElement).style.boxShadow = "";
      }}
    >
      {/* Color block */}
      <div style={{ position: "relative", background: hex, height: swatchH }}>
        {canCopy && (
          <div style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            opacity: 0,
            transition: "opacity 0.15s",
            background: "rgba(0,0,0,0.18)",
          }}
            className="swatch-overlay"
          >
            {copied
              ? <Check size={18} color="white" strokeWidth={2.5} />
              : <Copy size={16} color="white" strokeWidth={2} />
            }
          </div>
        )}
        {copied && (
          <div style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(0,0,0,0.28)",
          }}>
            <Check size={20} color="white" strokeWidth={2.5} />
          </div>
        )}
      </div>
      {/* Info */}
      <div style={{ padding: "7px 9px 9px" }}>
        <div style={{ fontSize: 12, fontWeight: 500, color: "var(--ink)", lineHeight: 1.3 }}>{label}</div>
        {stop && (
          <div style={{
            fontFamily: "JetBrains Mono, monospace",
            fontSize: 10,
            color: "var(--ink-muted)",
            letterSpacing: "0.04em",
            marginTop: 1,
          }}>{stop}</div>
        )}
        {token && (
          <div style={{
            fontFamily: "JetBrains Mono, monospace",
            fontSize: 10,
            color: "var(--ink-muted)",
            marginTop: 1,
          }}>{token}</div>
        )}
        {hex.startsWith("#") && (
          <div style={{
            fontFamily: "JetBrains Mono, monospace",
            fontSize: 11,
            fontWeight: 500,
            color: "var(--ink-soft)",
            marginTop: 3,
          }}>{hex}</div>
        )}
        {rgb && (
          <div style={{
            fontFamily: "JetBrains Mono, monospace",
            fontSize: 10,
            color: "var(--ink-muted)",
            marginTop: 1,
          }}>rgb({rgb})</div>
        )}
        {desc && (
          <div style={{ fontSize: 10, color: "var(--ink-muted)", marginTop: 3, lineHeight: 1.4 }}>{desc}</div>
        )}
      </div>
    </div>
  );
}

// ── Dual swatch (split day/night) — also click-to-copy ───────────────────────
function DualSwatch({
  dayHex,
  nightHex,
  label,
  token,
  desc,
}: {
  dayHex: string;
  nightHex: string;
  label: string;
  token: string;
  desc?: string;
}) {
  const [copiedDay, setCopiedDay] = useState(false);
  const [copiedNight, setCopiedNight] = useState(false);

  const copyDay = useCallback(async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!dayHex.startsWith("#")) return;
    await navigator.clipboard.writeText(dayHex);
    setCopiedDay(true);
    setTimeout(() => setCopiedDay(false), 1600);
  }, [dayHex]);

  const copyNight = useCallback(async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!nightHex.startsWith("#")) return;
    await navigator.clipboard.writeText(nightHex);
    setCopiedNight(true);
    setTimeout(() => setCopiedNight(false), 1600);
  }, [nightHex]);

  const dayRgb = hexToRgb(dayHex);
  const nightRgb = hexToRgb(nightHex);

  return (
    <div style={{
      borderRadius: 10,
      overflow: "hidden",
      border: "1.5px solid rgba(44,36,24,0.13)",
      background: "var(--paper)",
      flexShrink: 0,
      width: 170,
    }}>
      {/* Split color block */}
      <div style={{ display: "flex", height: 68 }}>
        <div
          onClick={copyDay}
          title={`Click to copy day value: ${dayHex}`}
          style={{
            flex: 1,
            background: dayHex || "var(--cream-dark)",
            cursor: dayHex.startsWith("#") ? "pointer" : "default",
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "filter 0.12s",
          }}
          onMouseEnter={e => (e.currentTarget.style.filter = "brightness(0.88)")}
          onMouseLeave={e => (e.currentTarget.style.filter = "")}
        >
          {copiedDay
            ? <Check size={16} color="white" strokeWidth={2.5} style={{ filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.4))" }} />
            : null}
          {/* Show inline border on rgba tokens */}
          {!dayHex.startsWith("#") && (
            <div style={{ height: 2, width: 40, background: dayHex, borderRadius: 1 }} />
          )}
        </div>
        <div
          onClick={copyNight}
          title={`Click to copy night value: ${nightHex}`}
          style={{
            flex: 1,
            background: nightHex || "#221E18",
            cursor: nightHex.startsWith("#") ? "pointer" : "default",
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "filter 0.12s",
          }}
          onMouseEnter={e => (e.currentTarget.style.filter = "brightness(1.25)")}
          onMouseLeave={e => (e.currentTarget.style.filter = "")}
        >
          {copiedNight
            ? <Check size={16} color="white" strokeWidth={2.5} style={{ filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.4))" }} />
            : null}
          {!nightHex.startsWith("#") && (
            <div style={{ height: 2, width: 40, background: nightHex, borderRadius: 1 }} />
          )}
        </div>
      </div>
      <div style={{ padding: "7px 9px 9px" }}>
        <div style={{ fontSize: 12, fontWeight: 500, color: "var(--ink)" }}>{label}</div>
        <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 10, color: "var(--ink-muted)", marginTop: 1 }}>{token}</div>
        <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
          <div>
            <div style={{ fontSize: 9.5, color: "var(--ink-muted)", marginBottom: 1 }}>Day</div>
            {dayHex.startsWith("#") && (
              <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 10.5, fontWeight: 500, color: "var(--ink-soft)" }}>{dayHex}</div>
            )}
            {dayRgb && (
              <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 9.5, color: "var(--ink-muted)" }}>rgb({dayRgb})</div>
            )}
          </div>
          <div>
            <div style={{ fontSize: 9.5, color: "var(--ink-muted)", marginBottom: 1 }}>Night</div>
            {nightHex.startsWith("#") && (
              <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 10.5, fontWeight: 500, color: "var(--ink-soft)" }}>{nightHex}</div>
            )}
            {nightRgb && (
              <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 9.5, color: "var(--ink-muted)" }}>rgb({nightRgb})</div>
            )}
          </div>
        </div>
        {desc && <div style={{ fontSize: 10, color: "var(--ink-muted)", marginTop: 4 }}>{desc}</div>}
      </div>
    </div>
  );
}

// ── Accent series row ─────────────────────────────────────────────────────────
function AccentSeriesRow({
  name,
  series,
}: {
  name: string;
  series: typeof ACCENT_SERIES[keyof typeof ACCENT_SERIES];
}) {
  return (
    <div style={{ marginBottom: 36 }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 10 }}>
        <div style={{ fontSize: 15, fontWeight: 500, color: "var(--ink)" }}>{series.label}</div>
        <div style={{ fontSize: 12, color: "var(--ink-muted)" }}>{series.description}</div>
        <div style={{
          marginLeft: "auto",
          fontFamily: "JetBrains Mono, monospace",
          fontSize: 10,
          color: "var(--ink-faint)",
          border: "1.5px solid var(--border-strong)",
          borderRadius: 3,
          padding: "1px 7px",
        }}>--{name}-[stop]</div>
      </div>

      <div style={{ display: "flex", gap: 12 }}>
        {/* Day swatches */}
        <div style={{ flex: 1 }}>
          <div style={{
            fontFamily: "JetBrains Mono, monospace",
            fontSize: 9.5,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "var(--ink-muted)",
            marginBottom: 6,
          }}>Day · Levanzo</div>
          <div style={{ display: "flex", gap: 6 }}>
            {series.day.map((hex, i) => (
              <ColorSwatch
                key={i}
                hex={hex}
                label={series.label}
                stop={series.stops[i]}
                size="sm"
              />
            ))}
          </div>
        </div>

        {/* Night swatches */}
        <div style={{ flex: 1 }}>
          <div style={{
            fontFamily: "JetBrains Mono, monospace",
            fontSize: 9.5,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "var(--ink-muted)",
            marginBottom: 6,
          }}>Night · Notte</div>
          <div style={{ display: "flex", gap: 6 }}>
            {series.night.map((hex, i) => (
              <ColorSwatch
                key={i}
                hex={hex}
                label={series.label}
                stop={series.stops[i]}
                size="sm"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Section helpers ───────────────────────────────────────────────────────────
function GroupLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      fontFamily: "JetBrains Mono, monospace",
      fontSize: 10.5,
      fontWeight: 600,
      letterSpacing: "0.1em",
      textTransform: "uppercase",
      color: "var(--ink-muted)",
      marginBottom: 12,
      paddingBottom: 6,
      borderBottom: "1.5px solid var(--border-strong)",
    }}>{children}</div>
  );
}

function PageSection({ children, title, subtitle }: { children: React.ReactNode; title: string; subtitle?: string }) {
  return (
    <div style={{ marginBottom: 52 }}>
      <div style={{
        fontFamily: "Cormorant Garamond, serif",
        fontSize: 30,
        fontWeight: 400,
        color: "var(--ink)",
        marginBottom: 4,
      }}>{title}</div>
      {subtitle && (
        <div style={{ fontSize: 13, color: "var(--ink-muted)", marginBottom: 22, maxWidth: 560 }}>{subtitle}</div>
      )}
      {children}
    </div>
  );
}

// ── Token groups ──────────────────────────────────────────────────────────────
const SURFACE_VARS = [
  { token: "--paper",          label: "Paper",          desc: "Cards, modals, inputs"      },
  { token: "--cream",          label: "Cream",          desc: "Main page background"        },
  { token: "--cream-dark",     label: "Cream dark",     desc: "Hovered rows"                },
  { token: "--parchment",      label: "Parchment",      desc: "Deepest background"          },
  { token: "--manila",         label: "Manila",         desc: "Sidebar panels"              },
  { token: "--manila-dark",    label: "Manila dark",    desc: "Sidebar hover"               },
  { token: "--manila-deeper",  label: "Manila deeper",  desc: "Sidebar active"              },
  { token: "--surface-raised", label: "Surface raised", desc: "Calendar cells, raised"      },
];
const INK_VARS = [
  { token: "--ink",       label: "Ink",       desc: "Headings"       },
  { token: "--ink-soft",  label: "Ink soft",  desc: "Body text"      },
  { token: "--ink-mid",   label: "Ink mid",   desc: "Section labels" },
  { token: "--ink-muted", label: "Ink muted", desc: "Timestamps"     },
  { token: "--ink-light", label: "Ink light", desc: "Subtle labels"  },
  { token: "--ink-faint", label: "Ink faint", desc: "Disabled text"  },
];
const NAV_VARS = [
  { token: "--nav-bg",        label: "Nav bg",        desc: "Top nav / activity bar" },
  { token: "--sidebar-bg",    label: "Sidebar bg",    desc: "Left sidebar"           },
  { token: "--sidebar-hover", label: "Sidebar hover", desc: "Sidebar item hover"     },
  { token: "--header-bg",     label: "Header bg",     desc: "Section headers"        },
];
const SEMANTIC_VARS = [
  { token: "--border",            label: "Border",            desc: "Card edges, row dividers"  },
  { token: "--border-strong",     label: "Border strong",     desc: "Focus ring, separators"    },
  { token: "--divider",           label: "Divider",           desc: "Horizontal rules"          },
  { token: "--pill-active-bg",    label: "Pill active bg",    desc: "Selected filter pill"      },
  { token: "--pill-active-text",  label: "Pill active text",  desc: "Pill text on active bg"    },
  { token: "--table-header-bg",   label: "Table header bg",   desc: "Table column header"       },
  { token: "--table-header-text", label: "Table header text", desc: "Column header text"        },
];

// ── Main page ─────────────────────────────────────────────────────────────────
export default function PalettePage() {
  return (
    <>
      <style>{`
        .swatch-overlay { opacity: 0 !important; }
        [data-swatch]:hover .swatch-overlay { opacity: 1 !important; }
        .copyable-swatch:hover .swatch-hover-icon { opacity: 1 !important; }
      `}</style>

      <div style={{
        padding: "3rem 2.5rem 4rem",
        maxWidth: 1280,
        fontFamily: "DM Sans, sans-serif",
        background: "var(--cream)",
        minHeight: "100vh",
        color: "var(--ink)",
      }}>

        {/* Header */}
        <div style={{ marginBottom: 44, paddingBottom: 28, borderBottom: "2px solid var(--border-strong)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6 }}>
            <a href="/" style={{ display: "flex", alignItems: "center", gap: 6, textDecoration: "none", color: "var(--ink-muted)", fontSize: 12, fontFamily: "JetBrains Mono, monospace" }}>
              ← levanzo.ui
            </a>
          </div>
          <div style={{
            fontFamily: "Cormorant Garamond, serif",
            fontSize: 44,
            fontWeight: 400,
            lineHeight: 1.1,
            letterSpacing: "-0.01em",
            color: "var(--ink)",
            marginBottom: 8,
          }}>Color palette</div>
          <div style={{ fontSize: 14, color: "var(--ink-muted)", maxWidth: 560, lineHeight: 1.6 }}>
            All color tokens in the Levanzo design system. Click any swatch to copy its hex value.
            Split swatches show day (left) and night (right) — click each half independently.
          </div>
          <div style={{ display: "flex", gap: 20, marginTop: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 12, color: "var(--ink-muted)" }}>
              <div style={{ width: 36, height: 16, borderRadius: 3, display: "flex", overflow: "hidden", border: "1.5px solid var(--border-strong)" }}>
                <div style={{ flex: 1, background: "#EAE4D8" }} />
                <div style={{ flex: 1, background: "#1A1710" }} />
              </div>
              Split = day / night · click each half
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 12, color: "var(--ink-muted)" }}>
              <Copy size={13} />
              Click single swatches to copy hex
            </div>
          </div>
        </div>

        {/* Accent Color Series */}
        <PageSection
          title="Accent color series"
          subtitle="8 families, 5 stops each: deep · base · mid · light · faint. Click any stop to copy its hex."
        >
          {Object.entries(ACCENT_SERIES).map(([name, series]) => (
            <AccentSeriesRow key={name} name={name} series={series} />
          ))}
        </PageSection>

        {/* Divider */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "44px 0 40px" }}>
          <div style={{ flex: 1, height: 2, background: "var(--border-strong)" }} />
          <div style={{
            fontFamily: "JetBrains Mono, monospace",
            fontSize: 10.5,
            fontWeight: 600,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "var(--ink-muted)",
            padding: "4px 12px",
            border: "2px solid var(--border-strong)",
            borderRadius: 3,
          }}>Structural tokens</div>
          <div style={{ flex: 1, height: 2, background: "var(--border-strong)" }} />
        </div>

        {/* Surfaces */}
        <PageSection title="Surfaces" subtitle="Page backgrounds, cards, and layering hierarchy.">
          <GroupLabel>Backgrounds &amp; surfaces — click day or night half to copy</GroupLabel>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 28 }}>
            {SURFACE_VARS.map(v => (
              <DualSwatch
                key={v.token}
                dayHex={getThemeHex("levanzo", v.token)}
                nightHex={getThemeHex("levanzo-notte", v.token)}
                label={v.label}
                token={v.token}
                desc={v.desc}
              />
            ))}
          </div>
        </PageSection>

        {/* Text scale */}
        <PageSection title="Text scale" subtitle="6-stop ramp from headings to disabled text.">
          <GroupLabel>Day (Levanzo)</GroupLabel>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 20 }}>
            {INK_VARS.map(v => (
              <ColorSwatch
                key={v.token}
                hex={getThemeHex("levanzo", v.token)}
                label={v.label}
                token={v.token}
                desc={v.desc}
              />
            ))}
          </div>
          <GroupLabel>Night (Notte)</GroupLabel>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            {INK_VARS.map(v => (
              <ColorSwatch
                key={v.token}
                hex={getThemeHex("levanzo-notte", v.token)}
                label={v.label}
                token={v.token}
                desc={v.desc}
              />
            ))}
          </div>
        </PageSection>

        {/* Nav */}
        <PageSection title="Navigation chrome" subtitle="Nav bar, sidebar, and section header backgrounds.">
          <GroupLabel>Nav tokens — click day or night half to copy</GroupLabel>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            {NAV_VARS.map(v => (
              <DualSwatch
                key={v.token}
                dayHex={getThemeHex("levanzo", v.token)}
                nightHex={getThemeHex("levanzo-notte", v.token)}
                label={v.label}
                token={v.token}
                desc={v.desc}
              />
            ))}
          </div>
        </PageSection>

        {/* Semantic */}
        <PageSection title="Semantic tokens" subtitle="Borders, dividers, pills, and table chrome.">
          <GroupLabel>UI state tokens — click day or night half to copy</GroupLabel>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            {SEMANTIC_VARS.map(v => {
              const d = getThemeHex("levanzo", v.token);
              const n = getThemeHex("levanzo-notte", v.token);
              const isRgba = !d.startsWith("#");
              return (
                <DualSwatch
                  key={v.token}
                  dayHex={isRgba ? "" : d}
                  nightHex={isRgba ? "" : n}
                  label={v.label}
                  token={v.token}
                  desc={v.desc}
                />
              );
            })}
          </div>
        </PageSection>

        {/* Usage notes */}
        <div style={{ marginTop: 52, paddingTop: 28, borderTop: "2px solid var(--border-strong)" }}>
          <div style={{
            fontFamily: "Cormorant Garamond, serif",
            fontSize: 26,
            fontWeight: 400,
            color: "var(--ink)",
            marginBottom: 14,
          }}>Usage notes</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 13 }}>
            {[
              ["Base stop", "The primary text or fill color. Meets contrast against --cream in day and --paper in night."],
              ["Deep stop", "For text on light tint backgrounds (faint/light stops as bg). Too harsh on plain --cream."],
              ["Light + faint stops", "Badge backgrounds and hover tints. Always pair with deep or base for text."],
              ["Mid stop", "Secondary UI: disabled buttons, secondary borders, decorative accents."],
              ["Mixing series", "One accent per component. Terracotta + sage is fine; terracotta + rust is not."],
              ["Dark mode", "Night stops mirror day: deep↔faint. The base stays the same hue but lighter."],
            ].map(([title, body]) => (
              <div key={title} style={{
                padding: "14px 16px",
                background: "var(--paper)",
                border: "1.5px solid var(--border-strong)",
                borderRadius: 8,
              }}>
                <div style={{ fontSize: 13, fontWeight: 500, color: "var(--ink)", marginBottom: 5 }}>{title}</div>
                <div style={{ fontSize: 13, color: "var(--ink-soft)", lineHeight: 1.6 }}>{body}</div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </>
  );
}
