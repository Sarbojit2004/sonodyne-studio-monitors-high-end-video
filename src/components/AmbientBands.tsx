import React from 'react';
import {Img, interpolate, staticFile} from 'remotion';
import {C, CANVAS, SAFE} from '../theme';
import {imgSrc} from '../data/timeline';

/**
 * Section 2b - the top (0-250px) and bottom (1580-1920px) zones must never sit
 * empty, but must never carry anything the viewer has to read.
 *
 * They are filled with ambient-tier photography: blurred, desaturated and
 * lifted toward white, then laid over the paper ground at low opacity. Dark
 * studio images are pushed light here on purpose, so the background stays
 * light-coloured across the whole runtime with no exception (Section 2).
 */

const BAND_H = {top: 340, bottom: 430} as const;

interface BandProps {
  slug: string;
  band: 'top' | 'bottom';
  /** local progress 0..1, used for a slow drift so the band is never static */
  progress: number;
  opacity?: number;
}

/** Dedicated ambient-tier photo vs. a blurred echo of the current hero image. */
const OPACITY = {dedicated: 0.34, fallback: 0.22} as const;

export const AmbientBand: React.FC<BandProps> = ({
  slug,
  band,
  progress,
  opacity = 0.2,
}) => {
  const h = BAND_H[band];
  const drift = interpolate(progress, [0, 1], [0, band === 'top' ? -26 : 26]);
  const scale = interpolate(progress, [0, 1], [1.14, 1.24]);

  const fade =
    band === 'top'
      ? 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0.85) 46%, rgba(0,0,0,0) 100%)'
      : 'linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0.85) 46%, rgba(0,0,0,0) 100%)';

  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        [band]: 0,
        height: h,
        overflow: 'hidden',
        opacity,
        maskImage: fade,
        WebkitMaskImage: fade,
        pointerEvents: 'none',
      }}
    >
      <Img
        src={staticFile(imgSrc(slug))}
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          transform: `scale(${scale}) translateY(${drift}px)`,
          // lift dark source photography toward the light ground: the bands
          // must read as visible texture, but the page must stay light
          filter: 'blur(22px) saturate(0.4) brightness(1.55) contrast(0.72)',
        }}
      />
    </div>
  );
};

/**
 * Renders both bands for the current frame, falling back to the active hero
 * image when a scene has no dedicated ambient-tier photo, so neither band is
 * ever blank.
 */
export const AmbientBands: React.FC<{
  /** ABSOLUTE composition frame - scenes are mounted in Sequences, so this is
   *  passed explicitly rather than read from the hook. */
  frame: number;
  top?: {slug: string; from: number; dur: number};
  bottom?: {slug: string; from: number; dur: number};
  fallback?: string;
}> = ({frame, top, bottom, fallback}) => {
  const render = (
    band: 'top' | 'bottom',
    a?: {slug: string; from: number; dur: number},
  ) => {
    if (a) {
      const p = interpolate(frame, [a.from, a.from + a.dur], [0, 1], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      });
      // short cross-fade at each end so band swaps are never a hard cut
      const o = interpolate(
        frame,
        [a.from, a.from + 14, a.from + a.dur - 14, a.from + a.dur],
        [0, OPACITY.dedicated, OPACITY.dedicated, 0],
        {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'},
      );
      return <AmbientBand slug={a.slug} band={band} progress={p} opacity={o} />;
    }
    if (fallback) {
      return (
        <AmbientBand
          slug={fallback}
          band={band}
          progress={(frame % 180) / 180}
          opacity={OPACITY.fallback}
        />
      );
    }
    return null;
  };

  return (
    <>
      {render('top', top)}
      {render('bottom', bottom)}
      <EdgeSoftening />
    </>
  );
};

/** Keeps the extreme frame edges clean paper, above the ambient imagery. */
const EdgeSoftening: React.FC = () => (
  <>
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 96,
        background: `linear-gradient(to bottom, ${C.paper} 0%, ${C.paper}00 100%)`,
        pointerEvents: 'none',
      }}
    />
    <div
      style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 120,
        background: `linear-gradient(to top, ${C.paper} 0%, ${C.paper}00 100%)`,
        pointerEvents: 'none',
      }}
    />
    {/* hairlines marking where the safe content zone begins and ends */}
    <div
      style={{
        position: 'absolute',
        top: SAFE.top - 1,
        left: 0,
        width: CANVAS.width,
        height: 1,
        background: `linear-gradient(to right, ${C.line}00, ${C.line}, ${C.line}00)`,
        opacity: 0.55,
      }}
    />
    <div
      style={{
        position: 'absolute',
        top: SAFE.bottom,
        left: 0,
        width: CANVAS.width,
        height: 1,
        background: `linear-gradient(to right, ${C.line}00, ${C.line}, ${C.line}00)`,
        opacity: 0.55,
      }}
    />
  </>
);
