import React from 'react';
import {interpolate} from 'remotion';
import {C, F, SAFE, T, WIDTH} from '../theme';
import {Headline, Kicker, SpecChip, Sub} from './Type';
import {FreqCurve} from './Overlays';
import {COPY, SPEC_SETS} from '../data/copy';
import type {ProductKey} from '../data/products';

/**
 * Text rails for a product beat. All type is laid out between the kicker rail
 * at y=250 and the micro line ending at y<=1560, i.e. entirely inside the
 * primary safe-content zone. Nothing here is ever placed in the ambient bands.
 */
export const RAIL_Y = SAFE.top;
/** image zone ends at 1020; the bottom rail starts at 1408 */
export const TEXT_Y = 1062;

/** Which rails a beat shows, so no two beats in a scene look identical. */
const variantOf = (key: string) => {
  if (key.endsWith('-numbers')) return 'numbers' as const;
  if (key.endsWith('-spec')) return 'spec' as const;
  return 'prose' as const;
};

export const BeatText: React.FC<{
  textKey?: string;
  local: number;
  accent: string;
  product?: ProductKey;
  headlineSize?: number;
  /** progress through the shot, for the response-curve draw */
  p?: number;
  freqLow?: number;
}> = ({textKey, local, accent, product, headlineSize = 72, p = 0, freqLow}) => {
  if (!textKey) return null;
  const copy = COPY[textKey];
  if (!copy) return null;
  const variant = variantOf(textKey);
  const specs = product ? SPEC_SETS[product] : undefined;

  return (
    <>
      {copy.kicker ? (
        <div style={{position: 'absolute', left: SAFE.side, top: RAIL_Y}}>
          <Kicker frame={local} delay={0} accent={accent}>
            {copy.kicker}
          </Kicker>
        </div>
      ) : null}

      <div
        style={{
          position: 'absolute',
          left: SAFE.side,
          top: TEXT_Y,
          width: 920,
        }}
      >
        {variant === 'prose' ? (
          <>
            {copy.headline ? (
              <Headline
                lines={copy.headline}
                frame={local}
                delay={5}
                // three-line headlines step down so the block always clears the
                // bottom rail without ever spilling past the safe zone
                size={copy.headline.length >= 3 ? headlineSize * 0.88 : headlineSize}
              />
            ) : null}
            {copy.sub ? (
              <div style={{marginTop: copy.headline ? 22 : 0}}>
                <Sub frame={local} delay={13} width={900}>
                  {copy.sub}
                </Sub>
              </div>
            ) : null}
          </>
        ) : null}

        {variant === 'spec' && specs ? (
          <div style={{display: 'flex', gap: 18}}>
            {specs.map((s, i) => (
              <SpecChip
                key={s.label}
                label={s.label}
                value={s.value}
                frame={local}
                delay={6 + i * 5}
                accent={accent}
              />
            ))}
          </div>
        ) : null}

        {variant === 'numbers' && specs ? (
          <BigNumbers specs={specs} local={local} accent={accent} />
        ) : null}

        {variant === 'numbers' && freqLow ? (
          <div style={{marginTop: 26, opacity: interpolate(local, [8, 24], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          })}}>
            <FreqCurve lowHz={freqLow} p={p} accent={accent} width={900} height={90} />
          </div>
        ) : null}
      </div>
    </>
  );
};

const BigNumbers: React.FC<{
  specs: {label: string; value: string}[];
  local: number;
  accent: string;
}> = ({specs, local, accent}) => (
  <div style={{display: 'flex', gap: 26, alignItems: 'flex-end'}}>
    {specs.map((s, i) => {
      const e = interpolate(local, [4 + i * 6, 18 + i * 6], [0, 1], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      });
      return (
        <div
          key={s.label}
          style={{
            flex: 1,
            minWidth: 0,
            opacity: e,
            transform: `translateY(${interpolate(e, [0, 1], [22, 0])}px)`,
            borderTop: `3px solid ${accent}`,
            paddingTop: 16,
          }}
        >
          <div
            style={{
              ...T.micro,
              fontFamily: F.body,
              fontStretch: WIDTH.wide,
              color: C.inkMuted,
              textTransform: 'uppercase',
              marginBottom: 10,
              whiteSpace: 'nowrap',
            }}
          >
            {s.label}
          </div>
          <div
            style={{
              fontFamily: F.mono,
              fontSize: 54,
              fontWeight: 600,
              letterSpacing: '-0.02em',
              lineHeight: 1,
              color: C.ink,
              whiteSpace: 'nowrap',
            }}
          >
            {s.value}
          </div>
        </div>
      );
    })}
  </div>
);
