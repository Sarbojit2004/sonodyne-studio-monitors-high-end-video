import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {LFPaper} from './LFFrame';
import {LFKicker, LFPrice} from './LFType';
import {LFLogoCard} from './LFLogoCard';
import {Photo} from '../components/Photo';
import {ORDER, PRODUCTS} from '../data/products';
import {C, EDGE, FL, PRODUCT_ACCENT, RADIUS, SHADOW, TL} from './lf-theme';
import type {LFChapterData} from './timeline-lf';

/**
 * Grouped price table for the long-form's Pricing chapter (Section 10) - the
 * landscape re-derivation of the reel's PricingScene. Row thumbnails re-use
 * each product's own hero pack shot (already given its primary placement in
 * that product's own chapter), same secondary-reuse pattern as the reel.
 */
const ROW_IMG: Record<string, string> = {
  srp350: 'srp-350-00', srp400: 'srp-400-00', srp501: 'srp-501-00',
  srp601: 'srp-601-00', slf210: 'slf-210-v3-08',
};

const CARD = {x: 900, y: 200, w: 964};
const ROW_H = 128;

export const LFPricingScene: React.FC<{chapter: LFChapterData}> = ({chapter}) => {
  const local = useCurrentFrame();
  const abs = chapter.from + local;
  const rows = chapter.rowFrames ?? [];

  return (
    <AbsoluteFill>
      <LFPaper tint={C.amber} />

      <div style={{position: 'absolute', left: EDGE, top: 210}}>
        <LFKicker frame={local} delay={0} accent={C.amber}>THE RANGE - PER UNIT</LFKicker>
      </div>
      <div
        style={{
          position: 'absolute', left: EDGE, top: 280, width: 760,
          ...TL.hero, fontFamily: FL.display, fontSize: 118, color: C.ink,
          opacity: interpolate(local, [4, 20], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}),
        }}
      >
        PRICING
      </div>
      <div
        style={{
          position: 'absolute', left: EDGE, top: 470, width: 700,
          ...TL.body, fontFamily: FL.label, fontSize: 26, color: C.inkBody,
          opacity: interpolate(local, [16, 36], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}),
        }}
      >
        All prices per unit, inclusive of all taxes. Message or call Shivansh Electronics for the best price.
      </div>

      <LFLogoCard brand="shivansh" box={{l: EDGE, t: 720, w: 300, h: 130}} accent={C.amber} delay={28} />

      <div
        style={{
          position: 'absolute', left: CARD.x, top: CARD.y, width: CARD.w,
          borderRadius: RADIUS.card, background: C.card, border: `1px solid ${C.lineSoft}`,
          boxShadow: SHADOW.card, overflow: 'hidden',
        }}
      >
        {ORDER.map((key, i) => {
          const p = PRODUCTS[key];
          const at = rows[i] ?? chapter.from;
          const e = interpolate(abs, [at, at + 16], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
          return (
            <div
              key={key}
              style={{
                height: ROW_H, display: 'flex', alignItems: 'center', gap: 24, padding: '0 30px',
                borderBottom: i < 4 ? `1px solid ${C.lineSoft}` : 'none',
                opacity: e, transform: `translateX(${interpolate(e, [0, 1], [30, 0])}px)`,
              }}
            >
              <div style={{width: 5, height: 64, borderRadius: 3, background: PRODUCT_ACCENT[key]}} />
              <Photo slug={ROW_IMG[key]} w={110} h={88} p={0.5} move="fan" radius={8} treatment="card" shadow="none" />
              <div style={{flex: 1, minWidth: 0}}>
                <div style={{fontFamily: FL.display, fontSize: 38, fontWeight: 700, color: C.ink, whiteSpace: 'nowrap'}}>
                  {p.name}
                </div>
                <div style={{...TL.micro, fontFamily: FL.label, color: C.inkMuted, marginTop: 4, whiteSpace: 'nowrap'}}>
                  {p.category}
                </div>
              </div>
              <LFPrice amount={p.price} size={40} />
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
