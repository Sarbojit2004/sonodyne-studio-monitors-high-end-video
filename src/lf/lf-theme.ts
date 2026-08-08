/**
 * Design tokens for the 298-second Sonodyne long-form video.
 *
 * Canvas: landscape 1920x1080, no reserved caption zone (unlike MOTU's own
 * long-form, which reserves a bottom caption band - Section 2 of this project
 * explicitly has no such reservation). Only a soft side/edge padding for
 * critical text.
 *
 * Palette: extends src/theme.ts (the reel's own light-background tokens)
 * verbatim rather than re-deriving new colors, per the top-level instruction
 * to read and extend the reel's committed background/contrast values.
 *
 * Type family: BarlowCondensed + Inter, ported from MOTU's long-form
 * (src/lf/fonts.ts) - a deliberate divergence from the reel's Archivo +
 * JetBrains Mono, which was a substitute used only because MOTU was
 * unreachable when the reel was built. See src/lf/fonts.ts for the loader.
 */
import {C, PRODUCT_ACCENT, RADIUS, SHADOW} from '../theme';

export {C, PRODUCT_ACCENT, RADIUS, SHADOW};

export const LF_FPS = 30;
export const LF_TOTAL_FRAMES = 8940; // 298.000s
export const LF_CANVAS = {w: 1920, h: 1080};

/** Soft edge padding for critical text/callouts - not a hard safe zone. */
export const EDGE = 56;

export const FL = {
  display: '"BarlowCondensed", "Arial Narrow", sans-serif',
  label: '"Inter", system-ui, sans-serif',
} as const;

/**
 * Type scale. BarlowCondensed is a narrow display face - sized larger than
 * the reel's Archivo equivalents to read the same visual weight on a
 * landscape frame viewed at typical distance.
 */
export const TL = {
  hero: {fontSize: 132, fontWeight: 800, lineHeight: 0.92, letterSpacing: '-0.01em'},
  headline: {fontSize: 92, fontWeight: 800, lineHeight: 0.94, letterSpacing: '-0.005em'},
  title: {fontSize: 68, fontWeight: 700, lineHeight: 0.98, letterSpacing: '0em'},
  sub: {fontSize: 34, fontWeight: 500, lineHeight: 1.28, letterSpacing: '0em'},
  body: {fontSize: 28, fontWeight: 450, lineHeight: 1.4, letterSpacing: '0em'},
  label: {fontSize: 20, fontWeight: 700, lineHeight: 1.1, letterSpacing: '0.14em'},
  micro: {fontSize: 19, fontWeight: 600, lineHeight: 1.3, letterSpacing: '0.04em'},
  spec: {fontSize: 30, fontWeight: 700, lineHeight: 1.1, letterSpacing: '0em', fontVariantNumeric: 'tabular-nums' as const},
  specBig: {fontSize: 52, fontWeight: 700, lineHeight: 1.0, letterSpacing: '-0.01em', fontVariantNumeric: 'tabular-nums' as const},
  price: {fontSize: 44, fontWeight: 700, lineHeight: 1.0, letterSpacing: '0em', fontVariantNumeric: 'tabular-nums' as const},
} as const;

/**
 * The 12-chapter table - single source of truth for long-form timing.
 * Durations sum to exactly 8940 frames (298.000s @ 30fps). Re-derived from
 * the creative brief's Section 12 proportions (not a blind 50% scale) against
 * this project's actual chapter list, which adds two chapters (system-fit,
 * workflows) the brief's own timing logic - written for the old ~600s/~178s
 * formats - didn't itemize.
 */
export type ChapterId =
  | 'coldOpen' | 'sharedDna'
  | 'srp350' | 'srp400' | 'srp501' | 'srp601' | 'slf210'
  | 'system' | 'workflows' | 'pricing' | 'heritage' | 'outro';

export interface Chapter {
  id: ChapterId;
  title: string;
  from: number;
  dur: number;
  accent: string;
  product?: 'srp350' | 'srp400' | 'srp501' | 'srp601' | 'slf210';
}

const chapterList: Omit<Chapter, 'from'>[] = [
  {id: 'coldOpen', title: 'Cold Open', dur: 540, accent: C.amber},
  {id: 'sharedDna', title: 'Shared Engineering DNA', dur: 480, accent: C.petrol},
  {id: 'srp350', title: 'SRP 350 G', dur: 840, accent: PRODUCT_ACCENT.srp350, product: 'srp350'},
  {id: 'srp400', title: 'SRP 400 G', dur: 840, accent: PRODUCT_ACCENT.srp400, product: 'srp400'},
  {id: 'srp501', title: 'SRP 501 G', dur: 900, accent: PRODUCT_ACCENT.srp501, product: 'srp501'},
  {id: 'srp601', title: 'SRP 601 G', dur: 900, accent: PRODUCT_ACCENT.srp601, product: 'srp601'},
  {id: 'slf210', title: 'SLF 210 V3', dur: 1020, accent: PRODUCT_ACCENT.slf210, product: 'slf210'},
  {id: 'system', title: 'The System Together', dur: 600, accent: C.petrol},
  {id: 'workflows', title: 'Real-World Workflows', dur: 720, accent: C.amber},
  {id: 'pricing', title: 'Pricing', dur: 540, accent: C.amber},
  {id: 'heritage', title: 'Heritage & Proof', dur: 600, accent: C.petrol},
  {id: 'outro', title: 'Outro & CTA', dur: 960, accent: C.amber},
];

export const LF_CHAPTERS: Chapter[] = (() => {
  let f = 0;
  return chapterList.map((c) => {
    const ch = {...c, from: f};
    f += c.dur;
    return ch;
  });
})();

const totalCheck = LF_CHAPTERS.reduce((s, c) => s + c.dur, 0);
if (totalCheck !== LF_TOTAL_FRAMES) {
  throw new Error(`LF_CHAPTERS sums to ${totalCheck}, expected ${LF_TOTAL_FRAMES}`);
}

export const lfChapterStart = (id: ChapterId): number =>
  LF_CHAPTERS.find((c) => c.id === id)?.from ?? 0;

export const lfChapterById = (id: ChapterId): Chapter =>
  LF_CHAPTERS.find((c) => c.id === id) as Chapter;
