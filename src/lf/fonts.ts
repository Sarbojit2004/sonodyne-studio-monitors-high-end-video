import {cancelRender, continueRender, delayRender, staticFile} from 'remotion';

/**
 * Type system inherited from the MOTU UltraLite-mk5 / 828 long-form video
 * (Sarbojit2004/motu-ultralitemk5-828, src/lib/fonts.ts + lf-theme.ts),
 * per Section 7a: the actual vendored font files, not a substitute family.
 *
 * MOTU's own long-form deliberately drops to two faces - one display
 * (BarlowCondensed), one label/body (Inter) - versus its reel's three-face
 * system. This build follows that long-form-specific precedent: spec
 * numerals use Inter with tabular-nums rather than a third mono face.
 *
 * Only the font FAMILY and loading technique are inherited. Every color
 * value is re-derived fresh for this project's light background (Section 2) -
 * MOTU's own values were tuned for its dark canvas and do not apply here.
 *
 * One glyph-coverage fix: MOTU's own vendored inter-var.woff2 is subsetted to
 * the characters their project actually used, and lacks U+20B9 (rupee) - MOTU
 * never priced anything in INR. Every price in this video is in rupees, so
 * `inter-var.woff2` here is swapped for the `latin-ext` build of the same
 * Inter family (via @fontsource-variable/inter, same fix pattern used for
 * Archivo in the reel) - full glyph coverage, not a different font.
 * BarlowCondensed is untouched: MOTU's literal file, never carries a price.
 */
type Face = {family: string; file: string; weight: string};

const FACES: Face[] = [
  {family: 'BarlowCondensed', file: 'fonts-lf/bc-600.woff2', weight: '600'},
  {family: 'BarlowCondensed', file: 'fonts-lf/bc-700.woff2', weight: '700'},
  {family: 'BarlowCondensed', file: 'fonts-lf/bc-800.woff2', weight: '800'},
  {family: 'Inter', file: 'fonts-lf/inter-var.woff2', weight: '100 900'},
];

let started = false;

/**
 * Loads only these four explicit faces, matching MOTU's own fix for a
 * `document.fonts.ready`-hangs-under-render-concurrency bug: waiting on the
 * full FontFaceSet can stall a render worker, so only the faces this
 * composition actually uses are awaited.
 *
 * Called at module top-level (not inside a component), exactly as MOTU's own
 * Reel.tsx/LFReel.tsx call `loadFonts()` - module-scope code runs once before
 * any component renders, which is when delayRender needs to be registered.
 */
export const loadFontsLF = (): void => {
  if (started || typeof document === 'undefined') return;
  started = true;

  const handle = delayRender('load-longform-fonts', {
    timeoutInMilliseconds: 90000,
    retries: 2,
  });

  Promise.all(
    FACES.map(async (f) => {
      const face = new FontFace(f.family, `url(${staticFile(f.file)}) format("woff2")`, {
        weight: f.weight,
        style: 'normal',
        display: 'block',
      });
      const loaded = await face.load();
      document.fonts.add(loaded);
    }),
  )
    .then(() => continueRender(handle))
    .catch((e) => cancelRender(e));
};
