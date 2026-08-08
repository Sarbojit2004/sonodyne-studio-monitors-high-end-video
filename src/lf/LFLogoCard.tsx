import React from 'react';
import {Img, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, RADIUS, SHADOW} from '../theme';

/**
 * Clean card/plate treatment for a brand mark - structurally adapted from
 * MOTU's own LogoCard.tsx, but with the OPPOSITE plate polarity.
 *
 * MOTU's logos are light artwork on transparent, needing a dark plate on
 * their dark canvas. Verified by pixel-sampling (not assumed): both logos
 * here (Sonodyne blue wordmark, Shivansh Electronics black wordmark) are
 * DARK on transparent - the natural fit for this project's light background,
 * so the plate is light (paper/card tone), matching the reel's own card
 * language, not MOTU's dark plate.
 */
export const LFLogoCard: React.FC<{
  brand: 'sonodyne' | 'shivansh';
  box: {l: number; t: number; w: number; h: number};
  accent: string;
  delay?: number;
  pad?: number;
}> = ({brand, box, accent, delay = 0, pad = 0.2}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const g = spring({frame: f - delay, fps, config: {damping: 14, mass: 0.5}});
  const src = brand === 'sonodyne' ? 'SONODYNE BRAND LOGO.png' : 'SHIVANSH ELECTRONICS BRAND LOGO.png';
  const aspect = 2372 / 714;

  const innerW = box.w * (1 - pad * 2);
  const innerH = box.h * (1 - pad * 2);
  let logoW = innerW;
  let logoH = logoW / aspect;
  if (logoH > innerH) {
    logoH = innerH;
    logoW = logoH * aspect;
  }

  return (
    <div
      style={{
        position: 'absolute',
        left: box.l,
        top: box.t,
        width: box.w,
        height: box.h,
        borderRadius: RADIUS.card,
        background: C.card,
        border: `1px solid ${C.lineSoft}`,
        borderTop: `3px solid ${accent}`,
        boxShadow: SHADOW.card,
        opacity: Math.min(1, g * 1.4),
        transform: `translateY(${(1 - g) * 20}px) scale(${0.96 + g * 0.04})`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Img
        src={staticFile(src)}
        style={{width: logoW, height: logoH, objectFit: 'contain', display: 'block'}}
      />
    </div>
  );
};
