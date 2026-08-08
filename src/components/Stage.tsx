import React from 'react';
import {AbsoluteFill} from 'remotion';
import {C, CANVAS, SAFE} from '../theme';

/**
 * The light ground, present in every frame of the reel with no exception
 * (Section 2). Warm paper base + a soft centre lift + fine grain, so it reads
 * as a premium light surface rather than a flat white void.
 */
export const Paper: React.FC<{tint?: string}> = ({tint}) => (
  <AbsoluteFill style={{background: C.paper}}>
    <AbsoluteFill
      style={{
        background: `radial-gradient(120% 78% at 50% 34%, ${C.paperLift} 0%, ${C.paper} 52%, ${C.sunk} 100%)`,
      }}
    />
    {tint ? (
      <AbsoluteFill
        style={{
          background: `radial-gradient(70% 42% at 50% 40%, ${tint}14 0%, ${tint}00 70%)`,
        }}
      />
    ) : null}
    <Grain />
  </AbsoluteFill>
);

/** Fine paper grain - keeps large flat light areas from banding on export. */
export const Grain: React.FC<{opacity?: number}> = ({opacity = 0.05}) => (
  <AbsoluteFill style={{opacity, mixBlendMode: 'multiply'}}>
    <svg width={CANVAS.width} height={CANVAS.height}>
      <filter id="paper-grain">
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.9"
          numOctaves={3}
          stitchTiles="stitch"
        />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <rect width="100%" height="100%" filter="url(#paper-grain)" />
    </svg>
  </AbsoluteFill>
);

/**
 * Development-only guide showing the Instagram safe-zone bands. Never enabled
 * in the delivered composition - it exists so still-frame QA (Checkpoint 3) can
 * be done against the real geometry.
 */
export const SafeZoneGuide: React.FC = () => (
  <AbsoluteFill style={{pointerEvents: 'none'}}>
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: SAFE.top,
        background: 'rgba(255,0,80,0.16)',
        borderBottom: '2px solid rgba(255,0,80,0.7)',
      }}
    />
    <div
      style={{
        position: 'absolute',
        top: SAFE.bottom,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(255,0,80,0.16)',
        borderTop: '2px solid rgba(255,0,80,0.7)',
      }}
    />
    <div
      style={{
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        width: SAFE.side,
        background: 'rgba(0,120,255,0.14)',
      }}
    />
    <div
      style={{
        position: 'absolute',
        top: 0,
        bottom: 0,
        right: 0,
        width: SAFE.side,
        background: 'rgba(0,120,255,0.14)',
      }}
    />
  </AbsoluteFill>
);
