import React from 'react';
import {interpolate} from 'remotion';
import {Photo, treatmentOf} from '../components/Photo';
import {CrossoverFlow, DirectivityCone, EqSteps, PhaseDial, RigidityGrid} from '../components/Overlays';
import {C, EDGE, RADIUS, SHADOW} from './lf-theme';
import type {LFShot} from './timeline-lf';

/**
 * Landscape shot-composition geometry. Text lives in a fixed left column;
 * images occupy the right two-thirds. This is a deliberate simplification
 * versus the reel's per-mode geometry, appropriate to a 12-chapter, 68-image,
 * 298s build - variety instead comes from shot MODE, image count, Ken Burns
 * motion, and the overlay graphics (all reused directly from the reel).
 */
export const TEXT_COL = {x: EDGE, y: 210, w: 660};
export const IMG_ZONE = {x: 760, y: 90, w: 1104, h: 900};

const focusFor = (slug: string, move?: string): [number, number] => {
  if (move === 'dolly') return [55, 42];
  return treatmentOf(slug) === 'card' ? [50, 50] : [50, 44];
};

const zoomFor = (slug: string, mode: string): number => {
  if (mode === 'full' || mode === 'hero-crop') return treatmentOf(slug) === 'card' ? 1.2 : 1.05;
  if (mode === 'hero' || mode === 'split') return treatmentOf(slug) === 'card' ? 1.14 : 1.02;
  if (mode === 'duo' || mode === 'triad') return treatmentOf(slug) === 'card' ? 1.06 : 1.0;
  return treatmentOf(slug) === 'card' ? 1.1 : 1.0;
};

const Overlay: React.FC<{shot: LFShot; p: number; accent: string}> = ({shot, p, accent}) => {
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

export const LFShotStage: React.FC<{shot: LFShot; local: number; accent: string}> = ({
  shot,
  local,
  accent,
}) => {
  const p = Math.min(1, Math.max(0, local / Math.max(1, shot.dur)));
  const entry = interpolate(local, [0, 10], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const rise = interpolate(entry, [0, 1], [22, 0]);

  if (shot.mode === 'full') {
    return (
      <div
        style={{
          position: 'absolute',
          left: EDGE * 2 + TEXT_COL.w,
          top: 0,
          width: 1920 - (EDGE * 2 + TEXT_COL.w),
          height: 1080,
          opacity: entry,
        }}
      >
        <Photo
          slug={shot.img[0]}
          w={1920 - (EDGE * 2 + TEXT_COL.w)}
          h={1080}
          p={p}
          move={shot.move}
          focus={focusFor(shot.img[0], shot.move)}
          zoom={zoomFor(shot.img[0], 'full')}
          radius={0}
          shadow="none"
        />
        <Overlay shot={shot} p={p} accent={accent} />
      </div>
    );
  }

  if (shot.mode === 'hero' || shot.mode === 'split' || shot.mode === 'hero-crop') {
    return (
      <div
        style={{
          position: 'absolute',
          left: IMG_ZONE.x,
          top: IMG_ZONE.y,
          width: IMG_ZONE.w,
          height: IMG_ZONE.h,
          opacity: entry,
          transform: `translateY(${rise}px)`,
        }}
      >
        <Photo
          slug={shot.img[0]}
          w={IMG_ZONE.w}
          h={IMG_ZONE.h}
          p={p}
          move={shot.move}
          focus={focusFor(shot.img[0], shot.move)}
          zoom={zoomFor(shot.img[0], shot.mode)}
          shadow={SHADOW.lift}
        />
        <Overlay shot={shot} p={p} accent={accent} />
      </div>
    );
  }

  if (shot.mode === 'duo') {
    const gap = 24;
    const tw = (IMG_ZONE.w - gap) / 2;
    return (
      <div style={{position: 'absolute', left: IMG_ZONE.x, top: IMG_ZONE.y, width: IMG_ZONE.w, height: IMG_ZONE.h, display: 'flex', gap}}>
        {shot.img.map((slug, i) => {
          const e = interpolate(local, [i * 6, i * 6 + 12], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
          return (
            <div key={slug} style={{opacity: e, transform: `translateY(${interpolate(e, [0, 1], [26, 0])}px)`}}>
              <Photo slug={slug} w={tw} h={IMG_ZONE.h} p={p} move={shot.move} focus={focusFor(slug)}
                     zoom={zoomFor(slug, 'duo')} radius={RADIUS.tile} shadow={SHADOW.tile} />
            </div>
          );
        })}
      </div>
    );
  }

  if (shot.mode === 'triad') {
    const gap = 20;
    const tw = (IMG_ZONE.w - gap * 2) / 3;
    return (
      <div style={{position: 'absolute', left: IMG_ZONE.x, top: IMG_ZONE.y, width: IMG_ZONE.w, height: IMG_ZONE.h, display: 'flex', gap}}>
        {shot.img.map((slug, i) => {
          const e = interpolate(local, [i * 5, i * 5 + 11], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
          return (
            <div key={slug} style={{opacity: e, transform: `translateY(${interpolate(e, [0, 1], [30, 0])}px)`}}>
              <Photo slug={slug} w={tw} h={IMG_ZONE.h} p={p} move="fan" focus={focusFor(slug)}
                     zoom={zoomFor(slug, 'triad')} radius={RADIUS.tile} shadow={SHADOW.tile} />
            </div>
          );
        })}
      </div>
    );
  }

  if (shot.mode === 'quad' || shot.mode === 'quad-range') {
    const gap = 22;
    const tw = (IMG_ZONE.w - gap) / 2;
    const th = (IMG_ZONE.h - gap - 44 * 2) / 2;
    return (
      <div
        style={{
          position: 'absolute', left: IMG_ZONE.x, top: IMG_ZONE.y, width: IMG_ZONE.w,
          display: 'grid', gridTemplateColumns: `${tw}px ${tw}px`, columnGap: gap, rowGap: gap,
        }}
      >
        {shot.img.map((slug, i) => {
          const e = interpolate(local, [i * 6, i * 6 + 14], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
          return (
            <div key={`${slug}-${i}`} style={{opacity: e, transform: `scale(${interpolate(e, [0, 1], [0.92, 1])})`}}>
              <Photo slug={slug} w={tw} h={th} p={p} move="fan" focus={focusFor(slug)}
                     zoom={zoomFor(slug, 'quad')} radius={RADIUS.tile} shadow={SHADOW.tile} />
              {shot.labels?.[i] ? (
                <div style={{
                  marginTop: 10, textAlign: 'center', fontFamily: 'Inter', fontWeight: 700,
                  fontSize: 20, letterSpacing: '0.08em', color: C.inkBody, opacity: e,
                }}>
                  {shot.labels[i]}
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    );
  }

  // montage: rapid coverage pass for secondary angles - ONE comfortably-sized
  // image at a time, cycling quickly. An earlier version packed all N images
  // into simultaneous narrow vertical strips; at n=6-7 against a 1200x800
  // source, each strip was ~150px wide and cropped away the product entirely,
  // leaving an unrecognizable sliver of background. Showing one full frame at
  // a time keeps every image actually recognizable while staying rapid - each
  // still gets only 1.5-3s depending on the chapter's montage length.
  const n = shot.img.length;
  const per = shot.dur / n;
  const idx = Math.min(n - 1, Math.floor(local / per));
  const at = idx * per;
  const slug = shot.img[idx];
  const localP = Math.min(1, Math.max(0, (local - at) / per));
  const e = interpolate(local, [at, at + 8, at + per - 8, at + per], [0, 1, 1, 0.6], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });
  const pop = interpolate(local, [at, at + 8], [0.96, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <div
      style={{
        position: 'absolute', left: IMG_ZONE.x, top: IMG_ZONE.y, width: IMG_ZONE.w, height: IMG_ZONE.h,
        opacity: e, transform: `scale(${pop})`,
      }}
    >
      <Photo slug={slug} w={IMG_ZONE.w} h={IMG_ZONE.h} p={localP} move={idx % 2 === 0 ? 'driftL' : 'driftR'}
             focus={focusFor(slug)} zoom={zoomFor(slug, 'hero')} shadow={SHADOW.lift} />
      {/* progress dots - shows how many secondary angles this pass covers */}
      <div style={{position: 'absolute', left: 20, bottom: 18, display: 'flex', gap: 7}}>
        {shot.img.map((s, i) => (
          <div
            key={`${s}-${i}`}
            style={{
              width: i === idx ? 20 : 7, height: 7, borderRadius: 4,
              background: i === idx ? accent : 'rgba(255,255,255,0.55)',
              transition: 'none',
            }}
          />
        ))}
      </div>
    </div>
  );
};
