import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {Paper} from '../components/Stage';
import {AmbientBands} from '../components/AmbientBands';
import {Kicker, Micro, Price} from '../components/Type';
import {Photo} from '../components/Photo';
import {CONTACT, ORDER, PRODUCTS} from '../data/products';
import {C, F, PRODUCT_ACCENT, RADIUS, SAFE, SHADOW, T, WIDTH} from '../theme';
import type {Scene} from '../data/timeline';

/**
 * One grouped price card near the close (Section 6). Five prices in a portrait
 * frame is a real layout problem, so this reads as a table rather than five
 * competing cards - every row unambiguously pairs a product with its price, and
 * the whole block sits inside the safe content zone.
 *
 * Row thumbnails deliberately re-use the hero pack shot of each product; the
 * compulsory-coverage rule is "every image appears", which these five already
 * satisfy earlier in the reel.
 */
const ROW_IMG: Record<string, string> = {
  srp350: 'srp-350-02',
  srp400: 'srp-400-09',
  srp501: 'srp-501-03',
  srp601: 'srp-601-08',
  slf210: 'slf-210-v3-08',
};

const CARD = {x: SAFE.side, y: 410, w: 920} as const;
const ROW_H = 146;
/** card bottom = 410 + 5*146 = 1140, leaving room for the CTA and contact rails */
const CARD_BOTTOM = CARD.y + ROW_H * 5;

export const PricingScene: React.FC<{scene: Scene}> = ({scene}) => {
  const local = useCurrentFrame();
  const abs = scene.from + local;
  const rows = scene.rowFrames ?? [];

  return (
    <AbsoluteFill>
      <Paper tint={C.amber} />
      <AmbientBands frame={abs} fallback="srp-601-08" />

      <div style={{position: 'absolute', left: SAFE.side, top: SAFE.top}}>
        <Kicker frame={local} delay={0} accent={C.amber}>
          THE RANGE - PER UNIT
        </Kicker>
      </div>

      <div
        style={{
          position: 'absolute',
          left: SAFE.side,
          top: 316,
          width: CARD.w,
          ...T.title,
          fontFamily: F.display,
          fontSize: 60,
          fontStretch: WIDTH.expanded,
          color: C.ink,
          opacity: interpolate(local, [2, 16], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          }),
        }}
      >
        PRICING
      </div>

      <div
        style={{
          position: 'absolute',
          left: CARD.x,
          top: CARD.y,
          width: CARD.w,
          borderRadius: RADIUS.card,
          background: C.card,
          border: `1px solid ${C.lineSoft}`,
          boxShadow: SHADOW.card,
          overflow: 'hidden',
        }}
      >
        {ORDER.map((key, i) => {
          const p = PRODUCTS[key];
          const at = rows[i] ?? scene.from;
          const e = interpolate(abs, [at, at + 15], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          });
          return (
            <div
              key={key}
              style={{
                height: ROW_H,
                display: 'flex',
                alignItems: 'center',
                gap: 22,
                padding: '0 26px',
                borderBottom: i < 4 ? `1px solid ${C.lineSoft}` : 'none',
                opacity: e,
                transform: `translateX(${interpolate(e, [0, 1], [26, 0])}px)`,
              }}
            >
              <div style={{width: 5, height: 74, borderRadius: 3, background: PRODUCT_ACCENT[key]}} />
              <Photo
                slug={ROW_IMG[key]}
                w={128}
                h={100}
                p={0.5}
                move="fan"
                radius={8}
                treatment="card"
                shadow="none"
              />
              <div style={{flex: 1, minWidth: 0}}>
                <div
                  style={{
                    fontFamily: F.display,
                    fontSize: 40,
                    fontWeight: 750,
                    fontStretch: WIDTH.wide,
                    letterSpacing: '-0.02em',
                    color: C.ink,
                    whiteSpace: 'nowrap',
                  }}
                >
                  {p.name}
                </div>
                <div
                  style={{
                    ...T.micro,
                    fontFamily: F.body,
                    fontStretch: WIDTH.normal,
                    color: C.inkMuted,
                    marginTop: 5,
                    whiteSpace: 'nowrap',
                  }}
                >
                  {p.category}
                </div>
              </div>
              <Price amount={p.price} size={44} />
            </div>
          );
        })}
      </div>

      <div
        style={{
          position: 'absolute',
          left: SAFE.side,
          top: CARD_BOTTOM + 24,
          width: CARD.w,
          textAlign: 'center',
          ...T.body,
          fontFamily: F.body,
          fontStretch: WIDTH.normal,
          color: C.inkMuted,
          fontSize: 26,
          opacity: interpolate(abs, [scene.from + 96, scene.from + 112], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          }),
        }}
      >
        All prices per unit, inclusive of all taxes.
      </div>

      <div
        style={{
          position: 'absolute',
          left: SAFE.side,
          top: CARD_BOTTOM + 76,
          width: CARD.w,
          display: 'flex',
          justifyContent: 'center',
          opacity: interpolate(abs, [scene.from + 108, scene.from + 126], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          }),
        }}
      >
        <div
          style={{
            padding: '20px 42px',
            borderRadius: RADIUS.pill,
            background: C.ink,
            color: C.paperLift,
            fontFamily: F.display,
            fontSize: 36,
            fontWeight: 750,
            fontStretch: WIDTH.wide,
            letterSpacing: '-0.01em',
            whiteSpace: 'nowrap',
          }}
        >
          DM or call for the best price
        </div>
      </div>

      <div
        style={{
          position: 'absolute',
          left: SAFE.side,
          top: CARD_BOTTOM + 186,
          width: CARD.w,
          display: 'flex',
          justifyContent: 'center',
          gap: 18,
          opacity: interpolate(abs, [scene.from + 122, scene.from + 142], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          }),
        }}
      >
        {CONTACT.phones.map((n) => (
          <div
            key={n}
            style={{
              padding: '12px 20px',
              borderRadius: RADIUS.pill,
              border: `1px solid ${C.line}`,
              background: C.paperLift,
              fontFamily: F.mono,
              fontSize: 24,
              fontWeight: 500,
              color: C.inkBody,
              whiteSpace: 'nowrap',
            }}
          >
            {n}
          </div>
        ))}
      </div>

      <div style={{position: 'absolute', left: SAFE.side, top: 1502, width: CARD.w}}>
        <Micro frame={local} delay={130} align="center">
          Shivansh Electronics - shivanshelectronics.in
        </Micro>
      </div>
    </AbsoluteFill>
  );
};
