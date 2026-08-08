import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';
import {Paper} from './components/Stage';
import {AmbientBand} from './components/AmbientBands';
import {Price, fitSize} from './components/Type';
import {C, F, PRODUCT_ACCENT, RADIUS, SAFE, SHADOW, T, WIDTH} from './theme';
import {CONTACT, ORDER, PRODUCTS} from './data/products';
import {imgSrc} from './data/timeline';
import {useFontsReady} from './useFontsReady';

/**
 * 1080x1920 thumbnail, one per language variant.
 *
 * Same light palette and same type system as the reel. Per the brief the three
 * variants share one design and differ ONLY in the language badge.
 *
 * No Sonodyne or Shivansh Electronics logo file appears here, matching the
 * in-video exclusion - logos are added by hand afterwards. Where a product
 * photograph already carries a printed Sonodyne badge, it is left untouched.
 */
export type Lang = 'ENGLISH' | 'HINDI' | 'BENGALI';

/** clearest pack shot per product */
const HERO: Record<string, string> = {
  srp350: 'srp-350-02',
  srp400: 'srp-400-09',
  srp501: 'srp-501-03',
  srp601: 'srp-601-08',
  slf210: 'slf-210-v3-08',
};

const Tile: React.FC<{
  slug: string;
  w: number;
  h: number;
  label: string;
  accent: string;
}> = ({slug, w, h, label, accent}) => (
  <div style={{width: w}}>
    <div
      style={{
        width: w,
        height: h,
        borderRadius: RADIUS.tile,
        overflow: 'hidden',
        background: C.card,
        border: `1px solid ${C.lineSoft}`,
        boxShadow: SHADOW.tile,
      }}
    >
      <Img
        src={staticFile(imgSrc(slug))}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          transform: 'scale(1.1)',
          filter: 'contrast(1.05) saturate(1.02)',
        }}
      />
    </div>
    <div style={{display: 'flex', alignItems: 'center', gap: 9, marginTop: 10}}>
      <div style={{width: 16, height: 3, background: accent, borderRadius: 2}} />
      <span
        style={{
          fontFamily: F.body,
          fontStretch: WIDTH.wide,
          fontSize: 21,
          fontWeight: 700,
          letterSpacing: '0.06em',
          color: C.ink,
          whiteSpace: 'nowrap',
        }}
      >
        {label}
      </span>
    </div>
  </div>
);

export const Thumbnail: React.FC<{lang?: Lang}> = ({lang = 'ENGLISH'}) => {
  useFontsReady();
  const title = 'SONODYNE';
  const titleSize = fitSize([title], 128, 920, -0.035);

  return (
    <AbsoluteFill>
      <Paper tint={C.amber} />
      {/* ambient bands: decorative only, exactly as in the reel */}
      <AmbientBand slug="srp-601-10" band="top" progress={0.35} opacity={0.26} />
      <AmbientBand slug="srp-350-13" band="bottom" progress={0.6} opacity={0.24} />

      {/* --- badge row --- */}
      <div
        style={{
          position: 'absolute',
          left: SAFE.side,
          top: SAFE.top,
          width: 920,
          display: 'flex',
          alignItems: 'center',
          gap: 14,
        }}
      >
        <div
          style={{
            padding: '11px 26px',
            borderRadius: RADIUS.pill,
            background: C.amber,
            color: '#FFF7F0',
            fontFamily: F.body,
            fontStretch: WIDTH.wide,
            fontSize: 24,
            fontWeight: 750,
            letterSpacing: '0.18em',
            whiteSpace: 'nowrap',
          }}
        >
          {lang}
        </div>
        <div
          style={{
            padding: '11px 22px',
            borderRadius: RADIUS.pill,
            border: `1px solid ${C.line}`,
            background: C.paperLift,
            fontFamily: F.body,
            fontStretch: WIDTH.wide,
            fontSize: 21,
            fontWeight: 650,
            letterSpacing: '0.12em',
            color: C.inkBody,
            whiteSpace: 'nowrap',
          }}
        >
          SHIVANSH ELECTRONICS
        </div>
      </div>

      {/* --- title --- */}
      <div
        style={{
          position: 'absolute',
          left: SAFE.side,
          top: 322,
          width: 920,
          fontFamily: F.display,
          fontSize: titleSize,
          fontWeight: 800,
          fontStretch: WIDTH.expanded,
          lineHeight: 0.9,
          letterSpacing: '-0.035em',
          color: C.ink,
          whiteSpace: 'nowrap',
        }}
      >
        {title}
      </div>
      <div
        style={{
          position: 'absolute',
          left: SAFE.side,
          top: 442,
          width: 920,
          fontFamily: F.body,
          fontStretch: WIDTH.wide,
          fontSize: 33,
          fontWeight: 600,
          letterSpacing: '0.02em',
          color: C.inkBody,
          whiteSpace: 'nowrap',
        }}
      >
        STUDIO MONITORS {'·'} ACTIVE SUBWOOFER
      </div>

      {/* --- product collage: 3 + 2 --- */}
      <div
        style={{
          position: 'absolute',
          left: SAFE.side,
          top: 500,
          display: 'flex',
          gap: 16,
        }}
      >
        {(['srp350', 'srp400', 'srp501'] as const).map((k) => (
          <Tile
            key={k}
            slug={HERO[k]}
            w={296}
            h={286}
            label={PRODUCTS[k].name}
            accent={PRODUCT_ACCENT[k]}
          />
        ))}
      </div>
      <div
        style={{
          position: 'absolute',
          left: SAFE.side,
          top: 838,
          display: 'flex',
          gap: 16,
        }}
      >
        {(['srp601', 'slf210'] as const).map((k) => (
          <Tile
            key={k}
            slug={HERO[k]}
            w={452}
            h={286}
            label={PRODUCTS[k].name}
            accent={PRODUCT_ACCENT[k]}
          />
        ))}
      </div>

      {/* --- prices --- */}
      <div
        style={{
          position: 'absolute',
          left: SAFE.side,
          top: 1186,
          width: 920,
          borderRadius: RADIUS.card,
          background: C.card,
          border: `1px solid ${C.lineSoft}`,
          boxShadow: SHADOW.card,
          padding: '6px 24px',
        }}
      >
        {ORDER.map((k, i) => {
          const p = PRODUCTS[k];
          return (
            <div
              key={k}
              style={{
                height: 52,
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                borderBottom: i < 4 ? `1px solid ${C.lineSoft}` : 'none',
              }}
            >
              <div
                style={{
                  width: 4,
                  height: 26,
                  borderRadius: 2,
                  background: PRODUCT_ACCENT[k],
                }}
              />
              <span
                style={{
                  flex: 1,
                  fontFamily: F.display,
                  fontSize: 31,
                  fontWeight: 700,
                  fontStretch: WIDTH.wide,
                  letterSpacing: '-0.015em',
                  color: C.ink,
                  whiteSpace: 'nowrap',
                }}
              >
                {p.name}
              </span>
              <Price amount={p.price} size={31} />
            </div>
          );
        })}
      </div>

      <div
        style={{
          position: 'absolute',
          left: SAFE.side,
          top: 1464,
          width: 920,
          textAlign: 'center',
          ...T.micro,
          fontFamily: F.body,
          fontSize: 21,
          color: C.inkMuted,
          whiteSpace: 'nowrap',
        }}
      >
        Per unit, inclusive of all taxes
      </div>

      {/* --- call to action --- */}
      <div
        style={{
          position: 'absolute',
          left: SAFE.side,
          top: 1500,
          width: 920,
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            padding: '0 34px',
            height: 54,
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            borderRadius: RADIUS.pill,
            background: C.ink,
            color: C.paperLift,
            fontFamily: F.display,
            fontStretch: WIDTH.wide,
            fontSize: 28,
            fontWeight: 750,
            whiteSpace: 'nowrap',
          }}
        >
          DM OR CALL FOR BEST PRICE
          <span
            style={{
              fontFamily: F.mono,
              fontSize: 22,
              fontWeight: 500,
              color: C.amberSoft,
            }}
          >
            {CONTACT.phones[0]}
          </span>
        </div>
      </div>
    </AbsoluteFill>
  );
};
