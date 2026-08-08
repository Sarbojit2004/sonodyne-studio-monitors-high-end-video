/**
 * Design tokens for the Sonodyne 88-second reel.
 *
 * LIGHT BACKGROUND (Section 2) - this deliberately overrides the creative
 * brief's own "deep greys, charcoals, abyssal blacks" direction (brief S6).
 * Every colour below was re-derived for a light ground; nothing is inherited
 * from a dark-background build.
 *
 * TYPOGRAPHY (Section 6a) - the MOTU reel repo (Sarbojit2004/motu-ultralitemk5-828)
 * is NOT attached to this session and the GitHub proxy refuses it (403), with no
 * add_repo tool available here, so its type system could not be read. The pairing
 * below is a documented substitute, deliberately isolated in this one file so the
 * real MOTU system is a single-file swap when the repo is reachable.
 *
 * Glyph constraints verified against the actual woff2 files:
 *   - JetBrains Mono has NO rupee sign in any subset -> prices are ALWAYS Archivo.
 *   - Archivo has no U+2192; never use a literal arrow character, draw it.
 */

// --------------------------------------------------------------------------
// Canvas + Instagram safe-zone geometry (Section 2a)
// --------------------------------------------------------------------------
export const CANVAS = {width: 1080, height: 1920, fps: 30} as const;

export const SAFE = {
  /** No critical content above this line - ambient/decorative only. */
  top: 250,
  /** No critical content below this line - caption + icon overlay risk. */
  bottom: 1580,
  /** Text and critical detail stay inboard of this margin. */
  side: 80,
} as const;

export const SAFE_BOX = {
  x: SAFE.side,
  y: SAFE.top,
  w: CANVAS.width - SAFE.side * 2, // 920
  h: SAFE.bottom - SAFE.top, // 1330
} as const;

/**
 * Content is biased upward inside the safe box: the bottom UI clutter
 * (caption, icon rail, progress bar) is heavier than the top.
 */
export const OPTICAL_CENTER_Y = SAFE.top + SAFE_BOX.h * 0.47; // 875

// --------------------------------------------------------------------------
// Palette - measured WCAG contrast against each surface is noted inline
// --------------------------------------------------------------------------
export const C = {
  /** base page ground: warm light neutral, not a flat white void */
  paper: '#F4F2EE',
  paperLift: '#FAF8F5',
  /** elevated card - matches the pure-white studio pack shots exactly */
  card: '#FFFFFF',
  sunk: '#E7E3DB',
  line: '#D8D3C9',
  lineSoft: '#E6E1D8',

  /** headline ink - 16.66:1 on paper, 18.62:1 on card */
  ink: '#101317',
  /** body copy - 7.88:1 on paper */
  inkBody: '#454B53',
  /** micro callouts - 5.19:1 on paper (clears AA at every size used) */
  inkMuted: '#5F666F',
  /** decorative only, never load-bearing text */
  inkFaint: '#9AA0A8',

  /** accent: burnt amber, picks up the console lamps in the studio shots */
  amber: '#A84E17',
  amberSoft: '#EFE0D2',
  /** deep petrol - secondary emphasis, and the sub-bass beat */
  petrol: '#123C48',
  petrolSoft: '#DCE6E9',
} as const;

/** Per-product accent, so the five beats never read as mirrored templates. */
export const PRODUCT_ACCENT = {
  srp350: C.petrol,
  srp400: C.amber,
  srp501: '#2A4E3C',
  srp601: '#5B2E14',
  slf210: '#1B2A55',
} as const;

// --------------------------------------------------------------------------
// Type system
// --------------------------------------------------------------------------
export const F = {
  /** display + everything containing a rupee sign */
  display: "'Archivo Variable', 'Archivo', system-ui, sans-serif",
  /** labels and body */
  body: "'Archivo Variable', 'Archivo', system-ui, sans-serif",
  /** spec numerals only - NEVER prices (no rupee glyph) */
  mono: "'JetBrains Mono Variable', 'JetBrains Mono', ui-monospace, monospace",
} as const;

/** Archivo width axis (62-125). Expanded display reads as precision hardware. */
export const WIDTH = {
  expanded: '118%',
  wide: '108%',
  normal: '100%',
  condensed: '90%',
} as const;

export const T = {
  hero: {fontSize: 128, fontWeight: 800, lineHeight: 0.9, letterSpacing: '-0.035em'},
  headline: {fontSize: 96, fontWeight: 800, lineHeight: 0.92, letterSpacing: '-0.03em'},
  title: {fontSize: 72, fontWeight: 700, lineHeight: 0.96, letterSpacing: '-0.025em'},
  sub: {fontSize: 40, fontWeight: 500, lineHeight: 1.18, letterSpacing: '-0.012em'},
  body: {fontSize: 32, fontWeight: 450, lineHeight: 1.3, letterSpacing: '-0.005em'},
  label: {fontSize: 24, fontWeight: 650, lineHeight: 1.1, letterSpacing: '0.16em'},
  micro: {fontSize: 22, fontWeight: 500, lineHeight: 1.25, letterSpacing: '0.05em'},
  spec: {fontSize: 34, fontWeight: 600, lineHeight: 1.1, letterSpacing: '-0.01em'},
  specSmall: {fontSize: 24, fontWeight: 500, lineHeight: 1.2, letterSpacing: '0em'},
  price: {fontSize: 46, fontWeight: 700, lineHeight: 1.0, letterSpacing: '-0.02em'},
} as const;

// --------------------------------------------------------------------------
// Elevation - light-background shadows are soft, warm and low-opacity.
// A dark-background build would use glows here; this is the inverse.
// --------------------------------------------------------------------------
export const SHADOW = {
  card: '0 2px 4px rgba(32,26,16,0.04), 0 12px 28px rgba(32,26,16,0.08), 0 40px 80px rgba(32,26,16,0.06)',
  lift: '0 4px 10px rgba(32,26,16,0.06), 0 24px 56px rgba(32,26,16,0.12), 0 60px 120px rgba(32,26,16,0.08)',
  tile: '0 1px 3px rgba(32,26,16,0.05), 0 8px 20px rgba(32,26,16,0.07)',
} as const;

export const RADIUS = {card: 18, tile: 12, pill: 999} as const;

/**
 * Text sitting over a photograph gets a light plate rather than the dark scrim a
 * dark-background build would use - same guarantee (text never competes with
 * image content), inverted for a light ground.
 */
export const PLATE = {
  background: 'rgba(250,248,245,0.93)',
  backdropFilter: 'blur(18px) saturate(1.05)',
  border: `1px solid ${C.lineSoft}`,
} as const;
