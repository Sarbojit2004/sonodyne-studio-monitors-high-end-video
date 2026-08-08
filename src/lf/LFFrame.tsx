import React from 'react';
import {AbsoluteFill} from 'remotion';
import {C} from './lf-theme';

/**
 * The light ground for the long-form video, present in every frame with no
 * exception - same light-background rule as the reel (Section 2), extended
 * to landscape. Unlike MOTU's own LFFrame, there is NO reserved caption band:
 * the full 1920x1080 canvas is usable, per this project's Section 2.
 */
export const LFPaper: React.FC<{tint?: string}> = ({tint}) => (
  <AbsoluteFill style={{background: C.paper}}>
    <AbsoluteFill
      style={{
        background: `radial-gradient(120% 90% at 50% 38%, ${C.paperLift} 0%, ${C.paper} 55%, ${C.sunk} 100%)`,
      }}
    />
    {tint ? (
      <AbsoluteFill
        style={{background: `radial-gradient(65% 55% at 60% 45%, ${tint}12 0%, ${tint}00 70%)`}}
      />
    ) : null}
    <LFGrain />
  </AbsoluteFill>
);

const LFGrain: React.FC = () => (
  <AbsoluteFill style={{opacity: 0.045, mixBlendMode: 'multiply'}}>
    <svg width={1920} height={1080}>
      <filter id="lf-grain">
        <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={3} stitchTiles="stitch" />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <rect width="100%" height="100%" filter="url(#lf-grain)" />
    </svg>
  </AbsoluteFill>
);
