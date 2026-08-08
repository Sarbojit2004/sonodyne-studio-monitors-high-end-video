import React from 'react';
import {interpolate, spring, useVideoConfig} from 'remotion';
import {C, FL, TL} from './lf-theme';
import bcMetrics from './bc-metrics.json';

const ADV = bcMetrics.advances as Record<string, number>;
const UPEM = bcMetrics.unitsPerEm;
const DEF = bcMetrics.default;

/** Measured width of a BarlowCondensed display line, in px. */
export const measureLF = (text: string, size: number, tracking = 0) => {
  let u = 0;
  for (const ch of text) u += ADV[ch] ?? DEF;
  return (u / UPEM + (tracking / size) * Math.max(0, text.length - 1)) * size;
};

/** Largest size at or below `size` at which every line fits `maxWidth`. */
export const fitSizeLF = (lines: string[], size: number, maxWidth: number, tracking = 0) => {
  let s = size;
  for (const line of lines) {
    const w = measureLF(line, size, tracking);
    if (w > maxWidth) s = Math.min(s, (size * maxWidth * 0.99) / w);
  }
  return s;
};

const useRise = (frame: number, delay = 0) => {
  const {fps} = useVideoConfig();
  const s = spring({frame: frame - delay, fps, config: {damping: 200, mass: 0.62, stiffness: 118}});
  return {opacity: interpolate(s, [0, 1], [0, 1]), y: interpolate(s, [0, 1], [24, 0])};
};

export const LFKicker: React.FC<{
  children: React.ReactNode;
  accent?: string;
  frame: number;
  delay?: number;
  maxWidth?: number;
}> = ({children, accent = C.amber, frame, delay = 0, maxWidth = 680}) => {
  const {opacity, y} = useRise(frame, delay);
  const w = interpolate(Math.min(1, Math.max(0, (frame - delay) / 18)), [0, 1], [0, 36]);
  return (
    <div style={{display: 'flex', alignItems: 'flex-start', gap: 14, opacity, transform: `translateY(${y}px)`}}>
      <div style={{width: w, height: 3, background: accent, borderRadius: 2, flexShrink: 0, marginTop: 9}} />
      <span
        style={{
          ...TL.label,
          fontFamily: FL.label,
          color: accent,
          textTransform: 'uppercase',
          // long kickers (e.g. a full product name + category) wrap rather
          // than overflow the text column into the image zone
          maxWidth,
          whiteSpace: 'normal',
          lineHeight: 1.35,
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
}> = ({text, frame, delay, size, color}) => {
  const {opacity, y} = useRise(frame, delay);
  return (
    <div
      style={{
        ...TL.headline,
        fontFamily: FL.display,
        fontSize: size,
        color,
        opacity,
        transform: `translateY(${y}px)`,
        whiteSpace: 'nowrap',
        textTransform: 'uppercase',
      }}
    >
      {text}
    </div>
  );
};

export const LFHeadline: React.FC<{
  lines: string[];
  frame: number;
  delay?: number;
  size?: number;
  color?: string;
  maxWidth?: number;
}> = ({lines, frame, delay = 0, size = TL.headline.fontSize, color = C.ink, maxWidth = 680}) => {
  const fitted = fitSizeLF(lines, size, maxWidth);
  return (
    <div style={{display: 'flex', flexDirection: 'column'}}>
      {lines.map((line, i) => (
        <HeadlineLine key={`${line}-${i}`} text={line} frame={frame} delay={delay + i * 4} size={fitted} color={color} />
      ))}
    </div>
  );
};

export const LFSub: React.FC<{
  children: React.ReactNode;
  frame: number;
  delay?: number;
  width?: number;
}> = ({children, frame, delay = 0, width = 640}) => {
  const {opacity, y} = useRise(frame, delay);
  return (
    <div
      style={{
        ...TL.sub,
        fontFamily: FL.label,
        color: C.inkBody,
        maxWidth: width,
        opacity,
        transform: `translateY(${y}px)`,
      }}
    >
      {children}
    </div>
  );
};

export const LFMicro: React.FC<{
  children: React.ReactNode;
  frame: number;
  delay?: number;
  width?: number;
  color?: string;
}> = ({children, frame, delay = 0, width = 640, color = C.inkMuted}) => {
  const {opacity, y} = useRise(frame, delay);
  return (
    <div
      style={{
        ...TL.micro,
        fontFamily: FL.label,
        color,
        maxWidth: width,
        opacity,
        transform: `translateY(${y}px)`,
      }}
    >
      {children}
    </div>
  );
};

/** Price. Inter (latin-ext build) - the only face in this project with a rupee glyph. */
export const LFPrice: React.FC<{amount: string; size?: number; color?: string}> = ({
  amount,
  size = TL.price.fontSize,
  color = C.ink,
}) => (
  <span style={{...TL.price, fontFamily: FL.label, fontSize: size, color, whiteSpace: 'nowrap'}}>
    {'₹'}
    {amount}
  </span>
);

export const LFLabel: React.FC<{
  children: React.ReactNode;
  size?: number;
  color?: string;
  weight?: 500 | 600 | 700 | 800;
  style?: React.CSSProperties;
}> = ({children, size = 20, color = C.inkMuted, weight = 700, style}) => (
  <div
    style={{
      fontFamily: FL.label,
      fontWeight: weight,
      fontSize: size,
      letterSpacing: '0.08em',
      color,
      fontVariantNumeric: 'tabular-nums',
      ...style,
    }}
  >
    {children}
  </div>
);
