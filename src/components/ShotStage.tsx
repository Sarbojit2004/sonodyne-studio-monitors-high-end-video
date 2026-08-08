import React from 'react';
import {interpolate} from 'remotion';
import {C, F, RADIUS, SHADOW, T, WIDTH} from '../theme';
import {Photo, treatmentOf} from './Photo';
import {
  CrossoverFlow,
  DirectivityCone,
  EqSteps,
  PhaseDial,
  RigidityGrid,
} from './Overlays';
import type {Shot} from '../data/timeline';

/**
 * Image-zone geometry. Everything here lives strictly inside the safe content
 * box (Section 2a): x 80..1000, and vertically inside 250..1580.
 */
export const ZONE = {x: 80, y: 330, w: 920, h: 690} as const;

const GAP = 24;

/**
 * The source photography is 1200x800 with the product small in frame and a lot
 * of empty studio background. Pack shots are pushed in hard (the background is
 * pure white, so cropping costs nothing and the product finally fills the card);
 * lifestyle frames only get a touch, since their surroundings are the point.
 */
const zoomFor = (slug: string, mode: string): number => {
  // The zone is already narrower than 3:2, so `cover` crops the empty sides for
  // free. These add just enough on top to fill the card without clipping the
  // product - anything past ~1.2 starts cutting the cabinet off at the bottom.
  if (mode === 'hero') return treatmentOf(slug) === 'card' ? 1.16 : 1.04;
  if (mode === 'panel') return 1.03;
  if (mode === 'duo') return treatmentOf(slug) === 'card' ? 1.02 : 1.0;
  if (mode === 'triad') return 1.0;
  return treatmentOf(slug) === 'card' ? 1.1 : 1.0;
};

/** Focal points tuned per treatment: pack shots centre, lifestyle sits high. */
const focusFor = (slug: string, mode: string): [number, number] => {
  if (mode === 'dolly-tweeter') return [62, 34];
  if (mode === 'dolly-eq') return [50, 46];
  return treatmentOf(slug) === 'card' ? [50, 50] : [50, 44];
};

const Overlay: React.FC<{shot: Shot; p: number; accent: string}> = ({
  shot,
  p,
  accent,
}) => {
  switch (shot.overlay) {
    case 'rigidity':
      return <RigidityGrid p={p} accent={accent} />;
    case 'directivity':
      return <DirectivityCone p={p} accent={accent} />;
    case 'eqsteps':
      return <EqSteps p={p} accent={accent} />;
    case 'phase':
      return <PhaseDial p={p} accent={accent} />;
    case 'crossover':
      return <CrossoverFlow p={p} accent={accent} />;
    default:
      return null;
  }
};

/** Small caption bar used under the two quad grids. */
const TileLabel: React.FC<{text: string; accent: string; show: number}> = ({
  text,
  accent,
  show,
}) => (
  <div
    style={{
      height: 40,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 10,
      opacity: show,
    }}
  >
    <div style={{width: 14, height: 2, background: accent, borderRadius: 1}} />
    <span
      style={{
        ...T.micro,
        fontFamily: F.body,
        fontStretch: WIDTH.wide,
        color: C.inkBody,
        fontWeight: 650,
        letterSpacing: '0.12em',
      }}
    >
      {text}
    </span>
  </div>
);

export const ShotStage: React.FC<{
  shot: Shot;
  /** frames elapsed inside this shot */
  local: number;
  accent: string;
}> = ({shot, local, accent}) => {
  const p = Math.min(1, Math.max(0, local / Math.max(1, shot.dur)));
  // quick opening wipe so every cut has a visible arrival, not a plain swap
  const entry = interpolate(local, [0, 9], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const rise = interpolate(entry, [0, 1], [18, 0]);

  const box: React.CSSProperties = {
    position: 'absolute',
    left: ZONE.x,
    top: ZONE.y,
    width: ZONE.w,
    height: ZONE.h,
  };

  if (shot.mode === 'hero' || shot.mode === 'hero-crop') {
    return (
      <div style={{...box, opacity: entry, transform: `translateY(${rise}px)`}}>
        <div style={{position: 'relative', width: ZONE.w, height: ZONE.h}}>
          <Photo
            slug={shot.img[0]}
            w={ZONE.w}
            h={ZONE.h}
            p={p}
            move={shot.move}
            focus={focusFor(shot.img[0], shot.move ?? '')}
            zoom={shot.mode === 'hero' ? zoomFor(shot.img[0], 'hero') : 1}
            shadow={SHADOW.lift}
          />
          <Overlay shot={shot} p={p} accent={accent} />
        </div>
      </div>
    );
  }

  if (shot.mode === 'panel') {
    return (
      <div style={{...box, opacity: entry, transform: `translateY(${rise}px)`}}>
        <div style={{position: 'relative', width: ZONE.w, height: ZONE.h}}>
          <Photo
            slug={shot.img[0]}
            w={ZONE.w}
            h={ZONE.h}
            p={p}
            move={shot.move}
            focus={focusFor(shot.img[0], shot.move ?? '')}
            zoom={zoomFor(shot.img[0], 'panel')}
            shadow={SHADOW.lift}
          />
          <Overlay shot={shot} p={p} accent={accent} />
        </div>
      </div>
    );
  }

  if (shot.mode === 'duo') {
    const tw = (ZONE.w - GAP) / 2; // 448
    const th = ZONE.h; // 714
    return (
      <div style={{...box, display: 'flex', gap: GAP}}>
        {shot.img.map((slug, i) => {
          const e = interpolate(local, [i * 5, i * 5 + 11], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          });
          return (
            <div
              key={slug}
              style={{
                opacity: e,
                transform: `translateY(${interpolate(e, [0, 1], [26, 0])}px)`,
              }}
            >
              <Photo
                slug={slug}
                w={tw}
                h={th}
                p={p}
                move={shot.move}
                focus={focusFor(slug, '')}
                zoom={zoomFor(slug, 'duo')}
                radius={RADIUS.tile}
                shadow={SHADOW.tile}
              />
            </div>
          );
        })}
      </div>
    );
  }

  if (shot.mode === 'triad') {
    const tw = (ZONE.w - GAP * 2) / 3; // 290.67
    const th = ZONE.h;
    return (
      <div style={{...box, display: 'flex', gap: GAP}}>
        {shot.img.map((slug, i) => {
          const e = interpolate(local, [i * 4, i * 4 + 10], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          });
          const tilt = (i - 1) * 1.4;
          return (
            <div
              key={slug}
              style={{
                opacity: e,
                transform: `translateY(${interpolate(e, [0, 1], [30, 0])}px) rotate(${tilt * (1 - e) * 2}deg)`,
              }}
            >
              <Photo
                slug={slug}
                w={tw}
                h={th}
                p={p}
                move={shot.move}
                focus={focusFor(slug, '')}
                zoom={zoomFor(slug, 'triad')}
                radius={RADIUS.tile}
                shadow={SHADOW.tile}
              />
            </div>
          );
        })}
      </div>
    );
  }

  // quad-dna / quad-range: 2x2 with a caption strip under each tile
  const tw = (ZONE.w - GAP) / 2; // 448
  const th = 305;
  const cell = th + 40;
  const gridH = cell * 2 + GAP;
  const top = ZONE.y + (ZONE.h - gridH) / 2;
  return (
    <div
      style={{
        ...box,
        top,
        height: gridH,
        display: 'grid',
        gridTemplateColumns: `${tw}px ${tw}px`,
        gridTemplateRows: `${cell}px ${cell}px`,
        columnGap: GAP,
        rowGap: GAP,
      }}
    >
      {shot.img.map((slug, i) => {
        const e = interpolate(local, [i * 6, i * 6 + 13], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });
        return (
          <div
            key={`${slug}-${i}`}
            style={{
              opacity: e,
              transform: `scale(${interpolate(e, [0, 1], [0.93, 1])})`,
            }}
          >
            <Photo
              slug={slug}
              w={tw}
              h={th}
              p={p}
              move="fan"
              focus={focusFor(slug, '')}
              zoom={zoomFor(slug, 'quad')}
              radius={RADIUS.tile}
              shadow={SHADOW.tile}
            />
            {shot.labels?.[i] ? (
              <TileLabel text={shot.labels[i]} accent={accent} show={e} />
            ) : null}
          </div>
        );
      })}
    </div>
  );
};
