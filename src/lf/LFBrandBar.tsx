import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {C, EDGE, FL, TL, lfChapterStart} from './lf-theme';
import {CONTACT} from '../data/products';

/**
 * Persistent rotating Shivansh Electronics contact strip, adapted directly
 * from MOTU's own LFBrandBar.tsx pattern (Section 9: constant, recurring
 * presence, not just bookend placement - no gap longer than ~25-30s at this
 * runtime). Re-colored for the light background: dark ink pill instead of
 * MOTU's glowing gold-on-dark treatment, same structural idea.
 *
 * Hidden only during the outro's own dedicated contact wall, so it never
 * competes with that fuller block.
 */
const ROTATION: string[] = [
  CONTACT.site,
  CONTACT.instagram,
  CONTACT.phones[0],
  CONTACT.hub,
  CONTACT.youtube,
  CONTACT.phones[1],
  CONTACT.facebook,
  CONTACT.linkedin,
  CONTACT.phones[2],
  CONTACT.threads,
  CONTACT.x,
  CONTACT.waChannel,
];

const SLOT = 210; // 7s per rotating item
const FADE = 14;
const HIDE_FROM = lfChapterStart('outro') + 300; // let the outro's own contact wall take over

export const LFBrandBar: React.FC = () => {
  const f = useCurrentFrame();

  const gIn = interpolate(f, [20, 44], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const gOut = f >= HIDE_FROM ? 0 : 1;
  const vis = Math.min(gIn, gOut);
  if (vis <= 0.001) return null;

  const idx = Math.floor(f / SLOT) % ROTATION.length;
  const local = f % SLOT;
  const itemOpacity = Math.min(
    interpolate(local, [0, FADE], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}),
    interpolate(local, [SLOT - FADE, SLOT], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}),
  );

  // Full-bleed image shots put a photograph directly under this corner, which
  // can be dark - so the bar always sits on its own light plate rather than
  // trusting whatever the scene's background happens to be underneath.
  return (
    <div
      style={{
        position: 'absolute',
        right: EDGE,
        top: 20,
        display: 'flex',
        alignItems: 'center',
        gap: 11,
        padding: '9px 18px',
        borderRadius: 999,
        background: 'rgba(250,248,245,0.94)',
        border: `1px solid ${C.lineSoft}`,
        boxShadow: '0 2px 10px rgba(32,26,16,0.10)',
        opacity: vis,
        pointerEvents: 'none',
        zIndex: 20,
      }}
    >
      <span
        style={{
          fontFamily: FL.label,
          fontWeight: 800,
          fontSize: 15,
          letterSpacing: '0.14em',
          color: C.ink,
          whiteSpace: 'nowrap',
        }}
      >
        SHIVANSH ELECTRONICS
      </span>
      <div style={{width: 5, height: 5, borderRadius: 99, background: C.amber, flexShrink: 0}} />
      <span
        style={{
          ...TL.micro,
          fontFamily: FL.label,
          fontSize: 15,
          color: C.amber,
          fontWeight: 700,
          opacity: itemOpacity,
          whiteSpace: 'nowrap',
        }}
      >
        {ROTATION[idx]}
      </span>
    </div>
  );
};
