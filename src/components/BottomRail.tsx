import React from 'react';
import {interpolate} from 'remotion';
import {C, F, RADIUS, T, WIDTH} from '../theme';
import {Price} from './Type';
import {CONTACT, PRODUCTS, type ProductKey} from '../data/products';

/**
 * Persistent rail at the bottom of the safe content zone.
 *
 * It does three jobs at once: it anchors the layout so the lower half of the
 * frame is never dead space, it keeps each product's price on screen during
 * that product's whole beat (Section 6), and it carries the Shivansh
 * Electronics line through the runtime as text (Section 5) - with no
 * distributor / dealer / reseller framing and no tagline.
 *
 * It sits at y=1408..1560, comfortably above the 1580 bottom safe-zone line.
 */
export const RAIL_TOP = 1408;

export const BottomRail: React.FC<{
  product?: ProductKey;
  accent: string;
  local: number;
  /** contact line shown under the rule; defaults to the website */
  contact?: string;
}> = ({product, accent, local, contact}) => {
  const e = interpolate(local, [6, 22], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const p = product ? PRODUCTS[product] : undefined;

  return (
    <div
      style={{
        position: 'absolute',
        left: 80,
        top: RAIL_TOP,
        width: 920,
        opacity: e,
        transform: `translateY(${interpolate(e, [0, 1], [16, 0])}px)`,
      }}
    >
      <div
        style={{
          height: 2,
          background: `linear-gradient(to right, ${accent}, ${C.line} 62%, ${C.line}00)`,
          marginBottom: 18,
        }}
      />
      <div style={{display: 'flex', alignItems: 'flex-end', gap: 20}}>
        <div style={{flex: 1, minWidth: 0}}>
          <div
            style={{
              fontFamily: F.display,
              fontSize: p ? 42 : 36,
              fontWeight: 750,
              fontStretch: WIDTH.wide,
              letterSpacing: '-0.02em',
              color: C.ink,
              whiteSpace: 'nowrap',
            }}
          >
            {p ? `SONODYNE ${p.name}` : 'SONODYNE SRP + SLF'}
          </div>
          <div
            style={{
              ...T.micro,
              fontFamily: F.body,
              fontStretch: WIDTH.normal,
              color: C.inkMuted,
              marginTop: 6,
              whiteSpace: 'nowrap',
            }}
          >
            {p ? p.category : 'Studio monitors and subwoofer'}
          </div>
        </div>

        {p ? (
          <div style={{textAlign: 'right', flexShrink: 0}}>
            <Price amount={p.price} size={44} />
            <div
              style={{
                ...T.micro,
                fontFamily: F.body,
                fontStretch: WIDTH.normal,
                color: C.inkMuted,
                marginTop: 4,
                whiteSpace: 'nowrap',
              }}
            >
              per unit, incl. all taxes
            </div>
          </div>
        ) : null}
      </div>

      <div
        style={{
          marginTop: 16,
          display: 'flex',
          alignItems: 'center',
          gap: 12,
        }}
      >
        <div
          style={{
            padding: '7px 16px',
            borderRadius: RADIUS.pill,
            background: C.ink,
            color: C.paperLift,
            ...T.micro,
            fontFamily: F.body,
            fontStretch: WIDTH.wide,
            fontSize: 17,
            fontWeight: 650,
            letterSpacing: '0.1em',
            whiteSpace: 'nowrap',
          }}
        >
          SHIVANSH ELECTRONICS
        </div>
        <div
          style={{
            ...T.micro,
            fontFamily: F.body,
            fontStretch: WIDTH.normal,
            fontSize: 20,
            color: C.inkMuted,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {contact ?? `${CONTACT.site} - DM or call for the best price`}
        </div>
      </div>
    </div>
  );
};
