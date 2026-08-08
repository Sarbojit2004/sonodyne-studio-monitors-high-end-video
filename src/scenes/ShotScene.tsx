import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {Paper} from '../components/Stage';
import {AmbientBands} from '../components/AmbientBands';
import {ShotStage} from '../components/ShotStage';
import {BeatText} from '../components/BeatText';
import {BottomRail} from '../components/BottomRail';
import {COPY} from '../data/copy';
import {PRODUCTS, type ProductKey} from '../data/products';
import {C, PRODUCT_ACCENT} from '../theme';
import type {Scene, Shot} from '../data/timeline';

const activeShot = (shots: Shot[], abs: number): Shot => {
  for (const s of shots) {
    if (abs >= s.from && abs < s.from + s.dur) return s;
  }
  return shots[shots.length - 1];
};

const bandAt = (scene: Scene, band: 'top' | 'bottom', abs: number) => {
  const a = scene.ambient.find(
    (x) => x.band === band && abs >= x.from && abs < x.from + x.dur,
  );
  return a ? {slug: a.img, from: a.from, dur: a.dur} : undefined;
};

/** Display scale per scene kind - the hook shouts, the product beats explain. */
const HEADLINE_SIZE: Record<string, number> = {
  hook: 104,
  dna: 76,
  product: 72,
  system: 80,
};

/**
 * Renders any shot-driven scene (hook, shared-DNA, the five product beats and
 * the system beat).
 *
 * The five products are differentiated by their copy, their per-product accent,
 * their distinct shot modes and technical overlays, and their own spec sets -
 * deliberately not by one template with the photos swapped.
 */
export const ShotScene: React.FC<{scene: Scene}> = ({scene}) => {
  const local = useCurrentFrame();
  const abs = scene.from + local;
  const shot = activeShot(scene.shots, abs);
  const product = scene.product as ProductKey | undefined;

  const accent = product
    ? PRODUCT_ACCENT[product]
    : scene.kind === 'dna'
      ? C.petrol
      : C.amber;

  const meta = product ? PRODUCTS[product] : undefined;
  const freqLow = meta ? parseInt(meta.freqLow, 10) : undefined;
  const shotLocal = abs - shot.from;
  const p = Math.min(1, Math.max(0, shotLocal / Math.max(1, shot.dur)));

  return (
    <AbsoluteFill>
      <Paper tint={accent} />
      <AmbientBands
        frame={abs}
        top={bandAt(scene, 'top', abs)}
        bottom={bandAt(scene, 'bottom', abs)}
        fallback={shot.img[0]}
      />
      <ShotStage shot={shot} local={shotLocal} accent={accent} />
      <BeatText
        textKey={shot.text}
        local={shotLocal}
        accent={accent}
        product={product}
        headlineSize={HEADLINE_SIZE[scene.kind] ?? 72}
        p={p}
        freqLow={freqLow}
      />
      <BottomRail
        product={product}
        accent={accent}
        local={local}
        contact={shot.text ? COPY[shot.text]?.micro : undefined}
      />
    </AbsoluteFill>
  );
};
