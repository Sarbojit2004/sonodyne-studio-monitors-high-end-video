import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {LFPaper} from './LFFrame';
import {LFKicker} from './LFType';
import {LFLogoCard} from './LFLogoCard';
import {Photo} from '../components/Photo';
import {CONTACT, ORDER, PRODUCTS} from '../data/products';
import {C, EDGE, FL, PRODUCT_ACCENT, RADIUS, TL} from './lf-theme';

/**
 * Comprehensive outro (Section 10): both logos, full contact/social block,
 * WhatsApp Community + social-follow invitation, all five products shown
 * together as the closing visual. No distributor/dealer language, no
 * tagline - Shivansh Electronics is where to buy, ask, and get the best
 * price.
 */
const HERO: Record<string, string> = {
  srp350: 'srp-350-00', srp400: 'srp-400-00', srp501: 'srp-501-00',
  srp601: 'srp-601-00', slf210: 'slf-210-v3-08',
};

const LINKS: [string, string][] = [
  ['WEB', CONTACT.site], ['ALL LINKS', CONTACT.hub],
  ['INSTAGRAM', CONTACT.instagram], ['YOUTUBE', CONTACT.youtube],
  ['FACEBOOK', CONTACT.facebook], ['LINKEDIN', CONTACT.linkedin],
  ['THREADS', CONTACT.threads], ['X', CONTACT.x],
];

export const LFOutroScene: React.FC = () => {
  const local = useCurrentFrame();

  const rise = (d: number) =>
    interpolate(local, [d, d + 16], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

  return (
    <AbsoluteFill>
      <LFPaper tint={C.amber} />

      <div style={{position: 'absolute', left: EDGE, top: 60}}>
        <LFKicker frame={local} delay={0} accent={C.amber}>SONODYNE AT SHIVANSH ELECTRONICS</LFKicker>
      </div>

      <div
        style={{
          position: 'absolute', left: EDGE, top: 118, width: 880,
          fontFamily: FL.display, fontSize: 84, fontWeight: 800, lineHeight: 0.94, color: C.ink,
          textTransform: 'uppercase', opacity: rise(6),
          transform: `translateY(${interpolate(rise(6), [0, 1], [24, 0])}px)`,
        }}
      >
        MESSAGE US FOR<br />THE BEST PRICE.
      </div>

      {/* WhatsApp numbers */}
      <div style={{position: 'absolute', left: EDGE, top: 400, width: 880, display: 'flex', flexDirection: 'column', gap: 12}}>
        {CONTACT.phones.map((n, i) => (
          <div
            key={n}
            style={{
              display: 'flex', alignItems: 'center', gap: 16, padding: '16px 26px', borderRadius: RADIUS.pill,
              background: i === 0 ? C.ink : C.card, border: `1px solid ${i === 0 ? C.ink : C.lineSoft}`,
              opacity: rise(16 + i * 4), transform: `translateX(${interpolate(rise(16 + i * 4), [0, 1], [26, 0])}px)`,
            }}
          >
            <span style={{fontFamily: FL.label, fontSize: 30, fontWeight: 700, color: i === 0 ? C.paperLift : C.ink, fontVariantNumeric: 'tabular-nums'}}>
              {n}
            </span>
            <span style={{...TL.micro, fontFamily: FL.label, color: i === 0 ? C.amberSoft : C.inkMuted, marginLeft: 'auto'}}>
              WHATSAPP / CALL
            </span>
          </div>
        ))}
      </div>

      {/* contact/social grid */}
      <div
        style={{
          position: 'absolute', left: EDGE, top: 636, width: 880, display: 'grid',
          gridTemplateColumns: '1fr 1fr', columnGap: 26, rowGap: 12, opacity: rise(34),
        }}
      >
        {LINKS.map(([k, v], i) => (
          <div key={k} style={{borderTop: `1px solid ${C.lineSoft}`, paddingTop: 8, opacity: rise(34 + i * 2)}}>
            <div style={{...TL.micro, fontFamily: FL.label, fontSize: 15, color: C.amber, fontWeight: 700, letterSpacing: '0.12em', marginBottom: 4}}>{k}</div>
            <div style={{fontFamily: FL.label, fontSize: 19, color: C.inkBody, overflowWrap: 'anywhere'}}>{v}</div>
          </div>
        ))}
      </div>

      <div style={{position: 'absolute', left: EDGE, top: 940, width: 880, opacity: rise(52)}}>
        <div style={{...TL.micro, fontFamily: FL.label, fontSize: 15, color: C.amber, fontWeight: 700, letterSpacing: '0.12em', marginBottom: 4}}>STORE</div>
        <div style={{fontFamily: FL.label, fontSize: 19, color: C.inkBody, lineHeight: 1.3}}>{CONTACT.address}</div>
      </div>

      {/* five-product family visual */}
      <div style={{position: 'absolute', left: 968, top: 60, width: 896, opacity: rise(10)}}>
        <div style={{...TL.label, fontFamily: FL.label, fontSize: 20, color: C.inkMuted, letterSpacing: '0.14em', marginBottom: 16}}>
          THE COMPLETE RANGE
        </div>
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 14}}>
          {ORDER.map((key, i) => {
            const p = PRODUCTS[key];
            const e = interpolate(local, [10 + i * 6, 24 + i * 6], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
            return (
              <div key={key} style={{opacity: e, transform: `translateY(${interpolate(e, [0, 1], [20, 0])}px)`}}>
                <Photo slug={HERO[key]} w={170} h={190} p={0.5} move="fan" radius={RADIUS.tile} treatment="card" />
                <div style={{marginTop: 8, display: 'flex', alignItems: 'center', gap: 6}}>
                  <div style={{width: 12, height: 2, background: PRODUCT_ACCENT[key], borderRadius: 1, flexShrink: 0}} />
                  <span style={{fontFamily: FL.label, fontWeight: 700, fontSize: 15, color: C.ink, whiteSpace: 'nowrap'}}>{p.name}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* both logos */}
      <LFLogoCard brand="sonodyne" box={{l: 968, t: 380, w: 430, h: 150}} accent={C.petrol} delay={30} />
      <LFLogoCard brand="shivansh" box={{l: 1434, t: 380, w: 430, h: 150}} accent={C.amber} delay={38} />

      {/* closing product-list line */}
      <div
        style={{
          position: 'absolute', left: 968, top: 566, width: 896, borderTop: `2px solid ${C.ink}`, paddingTop: 16,
          fontFamily: FL.label, fontWeight: 700, fontSize: 22, color: C.ink, letterSpacing: '0.04em',
          opacity: rise(46),
        }}
      >
        SRP 350 G · SRP 400 G · SRP 501 G · SRP 601 G · SLF 210 V3
      </div>

      <div
        style={{
          position: 'absolute', left: 968, top: 660, width: 896, opacity: rise(56),
          fontFamily: FL.label, fontSize: 22, color: C.inkBody, lineHeight: 1.5,
        }}
      >
        Join the WhatsApp Community for updates and offers. Follow along on Instagram, Facebook,
        YouTube, LinkedIn, Threads and X for the full Sonodyne range at Shivansh Electronics.
      </div>

      <div
        style={{
          position: 'absolute', left: 968, top: 840, display: 'flex', alignItems: 'center', gap: 16,
          padding: '20px 40px', borderRadius: RADIUS.pill, background: C.ink, color: C.paperLift,
          fontFamily: FL.display, fontSize: 34, fontWeight: 800, textTransform: 'uppercase',
          opacity: rise(66),
        }}
      >
        DM or Call for the Best Price
      </div>
    </AbsoluteFill>
  );
};
