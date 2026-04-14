"use client";
// Levanzo — Color Palette Reference
// Single source of truth for all design system colors

import { THEMES, ACCENT_SERIES } from "@/lib/settings";

// ── Existing single tokens grouped for reference ──────────────────────────────
const SURFACE_VARS = [
  { token: "--paper",         label: "Paper",          desc: "Cards, modals, inputs"    },
  { token: "--cream",         label: "Cream",          desc: "Main page background"      },
  { token: "--cream-dark",    label: "Cream dark",     desc: "Hovered rows"              },
  { token: "--parchment",     label: "Parchment",      desc: "Deepest background"        },
  { token: "--manila",        label: "Manila",         desc: "Sidebar panels"            },
  { token: "--manila-dark",   label: "Manila dark",    desc: "Sidebar hover"             },
  { token: "--manila-deeper", label: "Manila deeper",  desc: "Sidebar active"            },
  { token: "--surface-raised",label: "Surface raised", desc: "Calendar cells, raised"    },
];

const INK_VARS = [
  { token: "--ink",        label: "Ink",        desc: "Headings"         },
  { token: "--ink-soft",   label: "Ink soft",   desc: "Body text"        },
  { token: "--ink-mid",    label: "Ink mid",    desc: "Section labels"   },
  { token: "--ink-muted",  label: "Ink muted",  desc: "Timestamps"       },
  { token: "--ink-light",  label: "Ink light",  desc: "Subtle labels"    },
  { token: "--ink-faint",  label: "Ink faint",  desc: "Disabled text"    },
];

const NAV_VARS = [
  { token: "--nav-bg",       label: "Nav bg",       desc: "Top nav / activity bar" },
  { token: "--sidebar-bg",   label: "Sidebar bg",   desc: "Left sidebar"           },
  { token: "--sidebar-hover",label: "Sidebar hover",desc: "Sidebar item hover"     },
  { token: "--header-bg",    label: "Header bg",    desc: "Section headers"        },
];

const SEMANTIC_VARS = [
  { token: "--border",           label: "Border",           desc: "Card edges, row dividers"      },
  { token: "--border-strong",    label: "Border strong",    desc: "Input focus, separators"       },
  { token: "--divider",          label: "Divider",          desc: "Horizontal rules"              },
  { token: "--pill-active-bg",   label: "Pill active bg",   desc: "Selected filter pill"          },
  { token: "--pill-active-text", label: "Pill active text", desc: "Selected filter pill text"     },
  { token: "--table-header-bg",  label: "Table header bg",  desc: "Table column header"           },
  { token: "--table-header-text",label: "Table header text",desc: "Table column header text"      },
];

// ── Helpers ───────────────────────────────────────────────────────────────────
function hex(theme: "levanzo" | "levanzo-notte", token: string): string {
  return THEMES[theme][token] ?? "transparent";
}

type SwatchProps = {
  color: string;
  label: string;
  desc?: string;
  token?: string;
  small?: boolean;
};

function Swatch({ color, label, desc, token, small }: SwatchProps) {
  return (
    <div style={{
      borderRadius: 8,
      overflow: "hidden",
      border: "1.5px solid rgba(44,36,24,0.12)",
      background: "var(--paper)",
      flexShrink: 0,
    }}>
      <div style={{
        background: color,
        height: small ? 40 : 52,
        width: small ? 80 : 120,
      }} />
      <div style={{ padding: "6px 8px" }}>
        <div style={{ fontSize: 11, fontWeight: 500, color: "var(--ink)", lineHeight: 1.3 }}>{label}</div>
        {token && <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 9.5, color: "var(--ink-muted)", marginTop: 1 }}>{token}</div>}
        {color.startsWith("#") && <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 9.5, color: "var(--ink-muted)" }}>{color}</div>}
        {desc && <div style={{ fontSize: 9.5, color: "var(--ink-muted)", marginTop: 2 }}>{desc}</div>}
      </div>
    </div>
  );
}

type DualSwatchProps = {
  dayColor: string;
  nightColor: string;
  label: string;
  token: string;
  desc?: string;
};

function DualSwatch({ dayColor, nightColor, label, token, desc }: DualSwatchProps) {
  return (
    <div style={{
      borderRadius: 8,
      overflow: "hidden",
      border: "1.5px solid rgba(44,36,24,0.12)",
      background: "var(--paper)",
      flexShrink: 0,
    }}>
      <div style={{ display: "flex", height: 52 }}>
        <div style={{ flex: 1, background: dayColor }} />
        <div style={{ flex: 1, background: nightColor }} />
      </div>
      <div style={{ padding: "6px 8px" }}>
        <div style={{ fontSize: 11, fontWeight: 500, color: "var(--ink)" }}>{label}</div>
        <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 9.5, color: "var(--ink-muted)", marginTop: 1 }}>{token}</div>
        {desc && <div style={{ fontSize: 9.5, color: "var(--ink-muted)", marginTop: 2 }}>{desc}</div>}
      </div>
    </div>
  );
}

function GroupLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      fontFamily: "JetBrains Mono, monospace",
      fontSize: 10,
      fontWeight: 600,
      letterSpacing: "0.1em",
      textTransform: "uppercase",
      color: "var(--ink-muted)",
      marginBottom: 10,
      paddingBottom: 6,
      borderBottom: "1.5px solid var(--border-strong)",
    }}>{children}</div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      fontFamily: "Cormorant Garamond, serif",
      fontSize: 26,
      fontWeight: 400,
      color: "var(--ink)",
      marginBottom: 4,
      marginTop: 0,
    }}>{children}</div>
  );
}

function Section({ children, title, subtitle }: { children: React.ReactNode; title: string; subtitle?: string }) {
  return (
    <div style={{ marginBottom: 48 }}>
      <SectionTitle>{title}</SectionTitle>
      {subtitle && (
        <div style={{ fontSize: 13, color: "var(--ink-muted)", marginBottom: 20 }}>{subtitle}</div>
      )}
      {children}
    </div>
  );
}

// ── Accent Series Component ────────────────────────────────────────────────────
function AccentSeriesBlock({
  name,
  series,
}: {
  name: string;
  series: typeof ACCENT_SERIES[keyof typeof ACCENT_SERIES];
}) {
  return (
    <div style={{ marginBottom: 28 }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 8 }}>
        <div style={{ fontSize: 13, fontWeight: 500, color: "var(--ink)" }}>{series.label}</div>
        <div style={{ fontSize: 11, color: "var(--ink-muted)" }}>{series.description}</div>
        <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 10, color: "var(--ink-faint)", marginLeft: "auto" }}>
          --{name}-[stop]
        </div>
      </div>

      {/* Day */}
      <div style={{ marginBottom: 6 }}>
        <div style={{
          fontFamily: "JetBrains Mono, monospace",
          fontSize: 9,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: "var(--ink-muted)",
          marginBottom: 4,
        }}>Day (Levanzo)</div>
        <div style={{ display: "flex", gap: 4 }}>
          {series.day.map((hex, i) => (
            <div key={i} style={{ flex: 1 }}>
              <div style={{
                height: 44,
                background: hex,
                borderRadius: "4px 4px 0 0",
                border: "1.5px solid rgba(44,36,24,0.10)",
                borderBottom: "none",
              }} />
              <div style={{
                padding: "4px 5px",
                background: "var(--paper)",
                borderRadius: "0 0 4px 4px",
                border: "1.5px solid rgba(44,36,24,0.10)",
                borderTop: "none",
              }}>
                <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 9, color: "var(--ink-muted)" }}>{hex}</div>
                <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 8.5, color: "var(--ink-faint)" }}>
                  {series.stops[i]}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Night */}
      <div>
        <div style={{
          fontFamily: "JetBrains Mono, monospace",
          fontSize: 9,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: "var(--ink-muted)",
          marginBottom: 4,
        }}>Night (Notte)</div>
        <div style={{ display: "flex", gap: 4 }}>
          {series.night.map((h, i) => (
            <div key={i} style={{ flex: 1 }}>
              <div style={{
                height: 44,
                background: h,
                borderRadius: "4px 4px 0 0",
                border: "1.5px solid rgba(228,216,192,0.10)",
                borderBottom: "none",
              }} />
              <div style={{
                padding: "4px 5px",
                background: "#1E1A14",
                borderRadius: "0 0 4px 4px",
                border: "1.5px solid rgba(228,216,192,0.10)",
                borderTop: "none",
              }}>
                <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 9, color: "#847058" }}>{h}</div>
                <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 8.5, color: "#60503A" }}>
                  {series.stops[i]}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function PalettePage() {
  return (
    <div style={{
      padding: "3rem 2.5rem 4rem",
      maxWidth: 1200,
      fontFamily: "DM Sans, sans-serif",
      background: "var(--cream)",
      minHeight: "100vh",
      color: "var(--ink)",
    }}>

      {/* Header */}
      <div style={{ marginBottom: 40, paddingBottom: 24, borderBottom: "2px solid var(--border-strong)" }}>
        <div style={{
          fontFamily: "Cormorant Garamond, serif",
          fontSize: 40,
          fontWeight: 400,
          lineHeight: 1.1,
          letterSpacing: "-0.01em",
          color: "var(--ink)",
          marginBottom: 6,
        }}>
          Color palette
        </div>
        <div style={{ fontSize: 13, color: "var(--ink-muted)", maxWidth: 540 }}>
          All color tokens in the Levanzo design system. Split swatches show day (Levanzo) and
          night (Notte) values. Accent series each provide five stops: deep, base, mid, light, faint.
        </div>
        <div style={{ display: "flex", gap: 16, marginTop: 14 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: "var(--ink-muted)" }}>
            <div style={{ width: 32, height: 14, borderRadius: 2, display: "flex", overflow: "hidden", border: "1px solid rgba(44,36,24,0.12)" }}>
              <div style={{ flex: 1, background: "#EAE4D8" }} />
              <div style={{ flex: 1, background: "#1A1710" }} />
            </div>
            Split swatch = day / night
          </div>
        </div>
      </div>

      {/* Accent Color Series */}
      <Section
        title="Accent color series"
        subtitle="8 families, 5 stops each. Use the base stop as the primary color; use deep/mid/light/faint for text, backgrounds, borders, and tints."
      >
        {Object.entries(ACCENT_SERIES).map(([name, series]) => (
          <AccentSeriesBlock key={name} name={name} series={series} />
        ))}
      </Section>

      {/* Page divider */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "40px 0 36px" }}>
        <div style={{ flex: 1, height: 2, background: "var(--border-strong)" }} />
        <div style={{
          fontFamily: "JetBrains Mono, monospace",
          fontSize: 10,
          fontWeight: 600,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: "var(--ink-muted)",
          padding: "4px 10px",
          border: "2px solid var(--border-strong)",
          borderRadius: 2,
        }}>Structural tokens</div>
        <div style={{ flex: 1, height: 2, background: "var(--border-strong)" }} />
      </div>

      {/* Surfaces */}
      <Section title="Surfaces" subtitle="Page backgrounds, cards, and layering hierarchy.">
        <GroupLabel>Backgrounds &amp; surfaces</GroupLabel>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 24 }}>
          {SURFACE_VARS.map(v => (
            <DualSwatch
              key={v.token}
              dayColor={hex("levanzo", v.token)}
              nightColor={hex("levanzo-notte", v.token)}
              label={v.label}
              token={v.token}
              desc={v.desc}
            />
          ))}
        </div>
      </Section>

      {/* Ink */}
      <Section title="Text scale" subtitle="6-stop typographic ramp from headings to disabled text.">
        <GroupLabel>Ink tokens — Day</GroupLabel>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 20 }}>
          {INK_VARS.map(v => (
            <Swatch
              key={v.token}
              color={hex("levanzo", v.token)}
              label={v.label}
              token={v.token}
              desc={v.desc}
            />
          ))}
        </div>
        <GroupLabel>Ink tokens — Night</GroupLabel>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 20 }}>
          {INK_VARS.map(v => (
            <Swatch
              key={v.token}
              color={hex("levanzo-notte", v.token)}
              label={v.label}
              token={v.token}
              desc={v.desc}
            />
          ))}
        </div>
      </Section>

      {/* Navigation */}
      <Section title="Navigation chrome" subtitle="Backgrounds used by the nav bar, sidebar, and section headers.">
        <GroupLabel>Nav tokens</GroupLabel>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {NAV_VARS.map(v => (
            <DualSwatch
              key={v.token}
              dayColor={hex("levanzo", v.token)}
              nightColor={hex("levanzo-notte", v.token)}
              label={v.label}
              token={v.token}
              desc={v.desc}
            />
          ))}
        </div>
      </Section>

      {/* Semantic / UI */}
      <Section title="Semantic tokens" subtitle="Borders, dividers, pills, and table chrome.">
        <GroupLabel>UI state tokens</GroupLabel>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {SEMANTIC_VARS.map(v => {
            const d = hex("levanzo", v.token);
            const n = hex("levanzo-notte", v.token);
            // rgba tokens render as transparent in a div background, show a pattern instead
            const isRgba = d.startsWith("rgba") || d.startsWith("var");
            return (
              <div
                key={v.token}
                style={{
                  borderRadius: 8,
                  overflow: "hidden",
                  border: "1.5px solid rgba(44,36,24,0.12)",
                  background: "var(--paper)",
                  flexShrink: 0,
                }}
              >
                <div style={{ display: "flex", height: 52 }}>
                  <div style={{
                    flex: 1,
                    background: isRgba ? "var(--cream-dark)" : d,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}>
                    {isRgba && (
                      <div style={{ height: 2, width: 32, background: d, borderRadius: 1 }} />
                    )}
                  </div>
                  <div style={{
                    flex: 1,
                    background: isRgba ? "#221E18" : n,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}>
                    {isRgba && (
                      <div style={{ height: 2, width: 32, background: n, borderRadius: 1 }} />
                    )}
                  </div>
                </div>
                <div style={{ padding: "6px 8px" }}>
                  <div style={{ fontSize: 11, fontWeight: 500, color: "var(--ink)" }}>{v.label}</div>
                  <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 9.5, color: "var(--ink-muted)", marginTop: 1 }}>{v.token}</div>
                  <div style={{ fontSize: 9.5, color: "var(--ink-muted)", marginTop: 2 }}>{v.desc}</div>
                </div>
              </div>
            );
          })}
        </div>
      </Section>

      {/* Usage notes */}
      <div style={{ marginTop: 48, paddingTop: 24, borderTop: "2px solid var(--border-strong)" }}>
        <div style={{
          fontFamily: "Cormorant Garamond, serif",
          fontSize: 22,
          fontWeight: 400,
          color: "var(--ink)",
          marginBottom: 12,
        }}>Usage notes</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 12 }}>
          {[
            ["Base stop", "Use the base stop as the primary text or fill color. It meets contrast against --cream in day and --paper in night."],
            ["Deep stop", "Use deep for text on light tint backgrounds (faint/light stops as bg). Never use deep on --cream — too harsh."],
            ["Light + faint stops", "Use light as a badge background, faint as a hover tint. Always pair with deep or base text."],
            ["Mid stop", "Use mid for secondary UI: disabled buttons, secondary borders, decorative accents."],
            ["Mixing series", "Don't use two accent series on the same surface. One accent per component. Terracotta + sage is fine; terracotta + rust is not."],
            ["Dark mode inversion", "Night stops are listed light → dark (mirror of day). Deep in day = faint in night; faint in day = deep in night."],
          ].map(([title, body]) => (
            <div
              key={title}
              style={{
                padding: "12px 14px",
                background: "var(--paper)",
                border: "1.5px solid var(--border-strong)",
                borderRadius: 6,
              }}
            >
              <div style={{ fontSize: 12, fontWeight: 500, color: "var(--ink)", marginBottom: 4 }}>{title}</div>
              <div style={{ fontSize: 12, color: "var(--ink-soft)", lineHeight: 1.6 }}>{body}</div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
