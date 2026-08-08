import React from 'react';
import {interpolate, spring, useVideoConfig} from 'remotion';
import {C, F, T, WIDTH} from '../theme';
import metrics from '../data/archivo-metrics.json';

const ADV = metrics.advances as Record<string, number>;
const UPEM = metrics.unitsPerEm;
const DEF = metrics.default;

/** Measured width of a display line, in px, at the given size. */
export const measure = (text: string, size: number, tracking = -0.03) => {
  let u = 0;
  for (const ch of text) u += ADV[ch] ?? DEF;
  return (u / UPEM + tracking * Math.max(0, text.length - 1)) * size;
};

/**
 * Largest size at or below `size` at which every line fits `maxWidth`.
 *
 * Display lines are set `nowrap`, so without this a single long headline runs
 * straight past the side margin into the forbidden zone. Real advance widths
 * come from the instantiated variable font (scripts/measure_type.py), not from
 * an average-character-width guess.
 */
export const fitSize = (
  lines: string[],
  size: number,
  maxWidth = 920,
  tracking = -0.03,
) => {
  let s = size;
  for (const line of lines) {
    const w = measure(line, size, tracking);
    if (w > maxWidth) s = Math.min(s, (size * maxWidth * 0.995) / w);
  }
  return s;
};

/** Staggered per-line rise, the reel's one reveal idiom for display type. */
export const useRise = (frame: number, delay = 0) => {
  const {fps} = useVideoConfig();
  const s = spring({
    frame: frame - delay,
    fps,
    config: {damping: 200, mass: 0.62, stiffness: 118},
  });
  return {
    opacity: interpolate(s, [0, 1], [0, 1]),
    y: interpolate(s, [0, 1], [26, 0]),
  };
};

/** Small tracked-out label with an accent rule. */
export const Kicker: React.FC<{
  children: React.ReactNode;
  accent?: string;
  frame: number;
  delay?: number;
}> = ({children, accent = C.amber, frame, delay = 0}) => {
  const {opacity, y} = useRise(frame, delay);
  const w = interpolate(
    Math.min(1, Math.max(0, (frame - delay) / 18)),
    [0, 1],
    [0, 44],
  );
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        opacity,
        transform: `translateY(${y}px)`,
      }}
    >
      <div style={{width: w, height: 3, background: accent, borderRadius: 2}} />
      <span
        style={{
          ...T.label,
          fontFamily: F.body,
          fontStretch: WIDTH.wide,
          color: accent,
          textTransform: 'uppercase',
          whiteSpace: 'nowrap',
        }}
      >
        {children}
      </span>
    </div>
  );
};

const HeadlineLine: React.FC<{
  text: string;
  frame: number;
  delay: number;
  size: number;
  color: string;
  align: 'left' | 'center';
}> = ({text, frame, delay, size, color, align}) => {
  const {opacity, y} = useRise(frame, delay);
  return (
    <div
      style={{
        ...T.headline,
        fontFamily: F.display,
        fontSize: size,
        fontStretch: WIDTH.expanded,
        color,
        opacity,
        transform: `translateY(${y}px)`,
        textAlign: align,
        whiteSpace: 'nowrap',
      }}
    >
      {text}
    </div>
  );
};

export const Headline: React.FC<{
  lines: string[];
  frame: number;
  delay?: number;
  size?: number;
  color?: string;
  align?: 'left' | 'center';
  maxWidth?: number;
}> = ({
  lines,
  frame,
  delay = 0,
  size = T.headline.fontSize,
  color = C.ink,
  align = 'left',
  maxWidth = 920,
}) => {
  // one shared size for the whole block, so a shrunk line never looks orphaned
  const fitted = fitSize(lines, size, maxWidth);
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: align === 'center' ? 'center' : 'flex-start',
      }}
    >
      {lines.map((line, i) => (
        <HeadlineLine
          key={`${line}-${i}`}
          text={line}
          frame={frame}
          delay={delay + i * 4}
          size={fitted}
          color={color}
          align={align}
        />
      ))}
    </div>
  );
};

export const Sub: React.FC<{
  children: React.ReactNode;
  frame: number;
  delay?: number;
  width?: number;
  align?: 'left' | 'center';
}> = ({children, frame, delay = 0, width = 860, align = 'left'}) => {
  const {opacity, y} = useRise(frame, delay);
  return (
    <div
      style={{
        ...T.sub,
        fontFamily: F.body,
        fontStretch: WIDTH.normal,
        color: C.inkBody,
        maxWidth: width,
        opacity,
        transform: `translateY(${y}px)`,
        textAlign: align,
      }}
    >
      {children}
    </div>
  );
};

/** Spec chip - numerals in JetBrains Mono, label in Archivo. Never a price. */
export const SpecChip: React.FC<{
  label: string;
  value: string;
  frame: number;
  delay?: number;
  accent?: string;
}> = ({label, value, frame, delay = 0, accent = C.amber}) => {
  const {opacity, y} = useRise(frame, delay);
  return (
    <div
      style={{
        flex: 1,
        minWidth: 0,
        padding: '20px 22px 22px',
        background: C.card,
        border: `1px solid ${C.lineSoft}`,
        borderTop: `3px solid ${accent}`,
        borderRadius: 12,
        opacity,
        transform: `translateY(${y}px)`,
      }}
    >
      <div
        style={{
          ...T.micro,
          fontFamily: F.body,
          fontStretch: WIDTH.wide,
          color: C.inkMuted,
          textTransform: 'uppercase',
          marginBottom: 8,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'clip',
        }}
      >
        {label}
      </div>
      <div
        style={{
          ...T.spec,
          fontFamily: F.mono,
          color: C.ink,
          whiteSpace: 'nowrap',
        }}
      >
        {value}
      </div>
    </div>
  );
};

/**
 * Price. ALWAYS Archivo - JetBrains Mono ships no rupee glyph in any subset,
 * so setting a price in mono would render tofu.
 */
export const Price: React.FC<{
  amount: string;
  size?: number;
  color?: string;
}> = ({amount, size = T.price.fontSize, color = C.ink}) => (
  <span
    style={{
      ...T.price,
      fontFamily: F.display,
      fontSize: size,
      fontStretch: WIDTH.normal,
      fontVariantNumeric: 'tabular-nums',
      color,
      whiteSpace: 'nowrap',
    }}
  >
    {'₹'}
    {amount}
  </span>
);

/** Low contact line - always inside the safe zone, never in an ambient band. */
export const Micro: React.FC<{
  children: React.ReactNode;
  frame: number;
  delay?: number;
  align?: 'left' | 'center';
}> = ({children, frame, delay = 0, align = 'left'}) => {
  const {opacity, y} = useRise(frame, delay);
  return (
    <div
      style={{
        ...T.micro,
        fontFamily: F.body,
        fontStretch: WIDTH.wide,
        color: C.inkMuted,
        opacity,
        transform: `translateY(${y}px)`,
        textAlign: align,
        width: '100%',
      }}
    >
      {children}
    </div>
  );
};

/** Thin drawn chevron - stands in for U+2192, which Archivo has no glyph for. */
export const Chevron: React.FC<{size?: number; color?: string}> = ({
  size = 22,
  color = C.amber,
}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" style={{flexShrink: 0}}>
    <path
      d="M4 12 H19 M13 6 L19 12 L13 18"
      fill="none"
      stroke={color}
      strokeWidth={2.4}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
