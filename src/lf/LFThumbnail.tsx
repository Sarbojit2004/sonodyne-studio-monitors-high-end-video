import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';
import {loadFontsLF} from './fonts';
import {LFPaper} from './LFFrame';
import {LFPrice, fitSizeLF} from './LFType';
import {LFLogoCard} from './LFLogoCard';
import {C, EDGE, FL, PRODUCT_ACCENT, RADIUS, SHADOW, TL} from './lf-theme';
import {CONTACT, ORDER, PRODUCTS} from '../data/products';
import {imgSrc} from '../data/timeline';

loadFontsLF();

/**
 * 1920x1080 landscape thumbnail, one per language variant. Light background
 * matching the video's own palette (a change from any prior dark-background
 * thumbnail version). Both logos visible, all five products, all five
 * prices, clear DM/Call CTA. No distributor/dealer/authorised language.
 */
export type LFLang = 'ENGLISH' | 'HINDI' | 'BENGALI';

const HERO: Record<string, string> = {
  srp350: 'srp-350-00', srp400: 'srp-400-00', srp501: 'srp-501-00',
  srp601: 'srp-601-00', slf210: 'slf-210-v3-08',
};

const Tile: React.FC<{slug: string; w: number; h: number; label: string; accent: string}> = ({
  slug, w, h, label, accent,
}) => (
  <div style={{width: w}}>
    <div style={{
      width: w, height: h, borderRadius: RADIUS.tile, overflow: 'hidden',
      background: C.card, border: `1px solid ${C.lineSoft}`, boxShadow: SHADOW.tile,
    }}>
      <Img src={staticFile(imgSrc(slug))} style={{
        width: '100%', height: '100%', objectFit: 'cover', transform: 'scale(1.12)',
        filter: 'contrast(1.05) saturate(1.02)',
      }} />
    </div>
    <div style={{display: 'flex', alignItems: 'center', gap: 8, marginTop: 9}}>
      <div style={{width: 14, height: 3, background: accent, borderRadius: 2}} />
      <span style={{fontFamily: FL.label, fontSize: 18, fontWeight: 700, letterSpacing: '0.04em', color: C.ink, whiteSpace: 'nowrap'}}>
        {label}
      </span>
    </div>
  </div>
);

export const LFThumbnail: React.FC<{lang?: LFLang}> = ({lang = 'ENGLISH'}) => {
  const title = 'SONODYNE';
  const titleSize = fitSizeLF([title], 168, 760);

  return (
    <AbsoluteFill>
      <LFPaper tint={C.amber} />

      {/* badges */}
      <div style={{position: 'absolute', left: EDGE, top: 56, display: 'flex', gap: 12}}>
        <div style={{padding: '11px 26px', borderRadius: RADIUS.pill, background: C.amber, color: '#FFF7F0',
                     fontFamily: FL.label, fontSize: 22, fontWeight: 800, letterSpacing: '0.16em'}}>
          {lang}
        </div>
        <div style={{padding: '11px 22px', borderRadius: RADIUS.pill, border: `1px solid ${C.line}`, background: C.paperLift,
                     fontFamily: FL.label, fontSize: 19, fontWeight: 700, letterSpacing: '0.1em', color: C.inkBody}}>
          SHIVANSH ELECTRONICS
        </div>
      </div>

      {/* title */}
      <div style={{
        position: 'absolute', left: EDGE, top: 150, width: 780,
        fontFamily: FL.display, fontSize: titleSize, fontWeight: 800, lineHeight: 0.9, color: C.ink,
        textTransform: 'uppercase',
      }}>
        {title}
      </div>
      <div style={{position: 'absolute', left: EDGE, top: 322, width: 780, fontFamily: FL.label,
                   fontSize: 28, fontWeight: 600, color: C.inkBody}}>
        Studio Monitors · Active Subwoofer
      </div>

      {/* both logos */}
      <LFLogoCard brand="sonodyne" box={{l: EDGE, t: 400, w: 370, h: 128}} accent={C.petrol} delay={0} />
      <LFLogoCard brand="shivansh" box={{l: EDGE + 386, t: 400, w: 370, h: 128}} accent={C.amber} delay={0} />

      {/* CTA */}
      <div style={{
        position: 'absolute', left: EDGE, top: 570, display: 'flex', alignItems: 'center', gap: 16,
        padding: '20px 34px', borderRadius: RADIUS.pill, background: C.ink, color: C.paperLift,
        fontFamily: FL.display, fontSize: 32, fontWeight: 800, textTransform: 'uppercase',
      }}>
        DM or Call for Best Price
        <span style={{fontFamily: FL.label, fontSize: 24, fontWeight: 600, color: C.amberSoft, fontVariantNumeric: 'tabular-nums'}}>
          {CONTACT.phones[0]}
        </span>
      </div>

      <div style={{position: 'absolute', left: EDGE, top: 660, width: 760, fontFamily: FL.label, fontSize: 22,
                   color: C.inkMuted}}>
        Per unit, inclusive of all taxes
      </div>

      {/* product grid: 3 + 2 */}
      <div style={{position: 'absolute', left: 900, top: 56, display: 'flex', gap: 18}}>
        {(['srp350', 'srp400', 'srp501'] as const).map((k) => (
          <Tile key={k} slug={HERO[k]} w={310} h={280} label={PRODUCTS[k].name} accent={PRODUCT_ACCENT[k]} />
        ))}
      </div>
      <div style={{position: 'absolute', left: 900, top: 392, display: 'flex', gap: 18}}>
        {(['srp601', 'slf210'] as const).map((k) => (
          <Tile key={k} slug={HERO[k]} w={310} h={280} label={PRODUCTS[k].name} accent={PRODUCT_ACCENT[k]} />
        ))}
      </div>

      {/* price list */}
      <div style={{
        position: 'absolute', left: 1548, top: 392, width: 320, borderRadius: RADIUS.card, background: C.card,
        border: `1px solid ${C.lineSoft}`, boxShadow: SHADOW.card, padding: '8px 22px',
      }}>
        {ORDER.map((k, i) => {
          const p = PRODUCTS[k];
          return (
            <div key={k} style={{
              height: 54, display: 'flex', alignItems: 'center', gap: 10,
              borderBottom: i < 4 ? `1px solid ${C.lineSoft}` : 'none',
            }}>
              <div style={{width: 4, height: 24, borderRadius: 2, background: PRODUCT_ACCENT[k], flexShrink: 0}} />
              <span style={{flex: 1, fontFamily: FL.display, fontSize: 22, fontWeight: 700, color: C.ink, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>
                {p.short}
              </span>
              <LFPrice amount={p.price} size={22} />
            </div>
          );
        })}
      </div>

      <div style={{
        position: 'absolute', left: 900, top: 706, width: 968, textAlign: 'left', ...TL.micro,
        fontFamily: FL.label, fontSize: 20, color: C.inkMuted,
      }}>
        SRP 350 G · SRP 400 G · SRP 501 G · SRP 601 G · SLF 210 V3
      </div>
    </AbsoluteFill>
  );
};
