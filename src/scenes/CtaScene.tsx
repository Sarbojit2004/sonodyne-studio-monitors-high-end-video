import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {Paper} from '../components/Stage';
import {AmbientBands} from '../components/AmbientBands';
import {Chevron, Kicker} from '../components/Type';
import {CONTACT} from '../data/products';
import {C, F, RADIUS, SAFE, T, WIDTH} from '../theme';
import type {Scene} from '../data/timeline';

/**
 * Closing contact block. Shivansh Electronics is presented purely as where to
 * buy, ask and get the best price - there is no distributor, dealer, reseller
 * or "authorised" framing anywhere, and no tagline.
 *
 * Every line sits inside the primary safe-content zone; the ambient bands above
 * and below carry blurred imagery only.
 */
const LINKS: [string, string][] = [
  ['WEB', CONTACT.site],
  ['ALL LINKS', CONTACT.hub],
  ['INSTAGRAM', CONTACT.instagram],
  ['YOUTUBE', CONTACT.youtube],
  ['FACEBOOK', CONTACT.facebook],
  ['LINKEDIN', CONTACT.linkedin],
  ['THREADS', CONTACT.threads],
  ['X', CONTACT.x],
];

/** Label above value, clipped to its column - never overflows into a margin. */
const Field: React.FC<{
  label: string;
  value: string;
  opacity: number;
  wrap?: boolean;
}> = ({label, value, opacity, wrap = false}) => (
  <div style={{opacity, borderTop: `1px solid ${C.lineSoft}`, paddingTop: 9, minWidth: 0}}>
    <div
      style={{
        ...T.micro,
        fontFamily: F.body,
        fontStretch: WIDTH.wide,
        fontSize: 17,
        fontWeight: 650,
        color: C.amber,
        letterSpacing: '0.14em',
        marginBottom: 5,
        whiteSpace: 'nowrap',
      }}
    >
      {label}
    </div>
    <div
      style={{
        fontFamily: F.body,
        fontSize: 20,
        fontWeight: 500,
        color: C.inkBody,
        lineHeight: 1.32,
        // wrap rather than truncate: a clipped contact URL is a real loss, and
        // the grid rows simply grow to fit
        overflowWrap: 'anywhere',
        ...(wrap ? {} : {}),
      }}
    >
      {value}
    </div>
  </div>
);

export const CtaScene: React.FC<{scene: Scene}> = ({scene}) => {
  const local = useCurrentFrame();
  const abs = scene.from + local;

  const rise = (d: number) =>
    interpolate(local, [d, d + 16], [0, 1], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });

  return (
    <AbsoluteFill>
      <Paper tint={C.amber} />
      <AmbientBands frame={abs} fallback="srp-350-00" />

      <div style={{position: 'absolute', left: SAFE.side, top: SAFE.top}}>
        <Kicker frame={local} delay={0} accent={C.amber}>
          SONODYNE AT SHIVANSH ELECTRONICS
        </Kicker>
      </div>

      <div
        style={{
          position: 'absolute',
          left: SAFE.side,
          top: 326,
          width: 920,
          fontFamily: F.display,
          fontSize: 80,
          fontWeight: 800,
          fontStretch: WIDTH.expanded,
          lineHeight: 0.94,
          letterSpacing: '-0.03em',
          color: C.ink,
          opacity: rise(3),
          transform: `translateY(${interpolate(rise(3), [0, 1], [22, 0])}px)`,
        }}
      >
        MESSAGE US
        <br />
        FOR THE
        <br />
        BEST PRICE.
      </div>

      {/* WhatsApp numbers - the primary action */}
      <div
        style={{
          position: 'absolute',
          left: SAFE.side,
          top: 588,
          width: 920,
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
          opacity: rise(12),
        }}
      >
        {CONTACT.phones.map((n, i) => (
          <div
            key={n}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              padding: '16px 24px',
              borderRadius: RADIUS.pill,
              background: i === 0 ? C.ink : C.card,
              border: `1px solid ${i === 0 ? C.ink : C.lineSoft}`,
              transform: `translateX(${interpolate(rise(12 + i * 3), [0, 1], [24, 0])}px)`,
            }}
          >
            <Chevron size={22} color={i === 0 ? C.amberSoft : C.amber} />
            <span
              style={{
                fontFamily: F.mono,
                fontSize: 34,
                fontWeight: 550,
                color: i === 0 ? C.paperLift : C.ink,
                whiteSpace: 'nowrap',
              }}
            >
              {n}
            </span>
            <span
              style={{
                ...T.micro,
                fontFamily: F.body,
                fontStretch: WIDTH.wide,
                color: i === 0 ? C.amberSoft : C.inkMuted,
                marginLeft: 'auto',
                whiteSpace: 'nowrap',
              }}
            >
              WHATSAPP / CALL
            </span>
          </div>
        ))}
      </div>

      {/* channels - label stacked above value, so a long handle can never
          collide with its label or run past the side margin */}
      <div
        style={{
          position: 'absolute',
          left: SAFE.side,
          top: 866,
          width: 920,
          display: 'grid',
          gridTemplateColumns: '448px 448px',
          columnGap: 24,
          rowGap: 16,
          opacity: rise(26),
        }}
      >
        {LINKS.map(([k, v], i) => (
          <Field key={k} label={k} value={v} opacity={rise(26 + i * 2)} />
        ))}
      </div>

      {/* WhatsApp channel + address */}
      <div style={{position: 'absolute', left: SAFE.side, top: 1218, width: 920}}>
        <Field label="WHATSAPP CHANNEL" value={CONTACT.waChannel} opacity={rise(40)} />
      </div>

      <div style={{position: 'absolute', left: SAFE.side, top: 1322, width: 920}}>
        <Field label="STORE" value={CONTACT.address} opacity={rise(48)} wrap />
      </div>

      {/* closing line - names all five products one last time */}
      <div
        style={{
          position: 'absolute',
          left: SAFE.side,
          top: 1462,
          width: 920,
          opacity: rise(56),
          borderTop: `2px solid ${C.ink}`,
          paddingTop: 14,
          ...T.micro,
          fontFamily: F.body,
          fontStretch: WIDTH.wide,
          fontSize: 21,
          fontWeight: 650,
          color: C.ink,
          letterSpacing: '0.06em',
          whiteSpace: 'nowrap',
        }}
      >
        SRP 350 G {'·'} SRP 400 G {'·'} SRP 501 G {'·'} SRP 601 G{' '}
        {'·'} SLF 210 V3
      </div>
    </AbsoluteFill>
  );
};
