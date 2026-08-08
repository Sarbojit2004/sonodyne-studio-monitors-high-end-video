import React from 'react';
import {Img, interpolate, staticFile} from 'remotion';
import bgClass from '../data/bg-class.json';
import {imgSrc} from '../data/timeline';
import {C, RADIUS, SHADOW} from '../theme';

export type BgClass = 'white' | 'grey' | 'dark';

export const bgOf = (slug: string): BgClass =>
  ((bgClass as Record<string, string>)[slug] as BgClass) ?? 'dark';

/**
 * Every source image is 1200x800 landscape, so nothing can go full-bleed on a
 * 9:16 canvas without destroying the product. Instead there are two treatments,
 * chosen by the source background:
 *
 *  - `card`  - pure-white studio pack shots on a white card. Because the source
 *              background is exactly #FFFFFF, the product reads as floating on
 *              the page rather than sitting in a box.
 *  - `panel` - dark studio / lifestyle frames as an inset window with a hairline
 *              and shadow. The dark photo is contained; the page stays light.
 */
export type PhotoTreatment = 'card' | 'panel';

export const treatmentOf = (slug: string): PhotoTreatment =>
  bgOf(slug) === 'dark' ? 'panel' : 'card';

export interface KenBurns {
  /** 0..1 through the shot */
  p: number;
  move?: string;
  /** focal point for crops, as percentages */
  focus?: [number, number];
}

const kb = (p: number, move?: string) => {
  switch (move) {
    case 'push':
      return {scale: interpolate(p, [0, 1], [1.0, 1.075]), x: 0, y: 0};
    case 'pull':
      return {scale: interpolate(p, [0, 1], [1.09, 1.0]), x: 0, y: 0};
    case 'driftL':
      return {scale: 1.06, x: interpolate(p, [0, 1], [16, -16]), y: 0};
    case 'driftR':
      return {scale: 1.06, x: interpolate(p, [0, 1], [-16, 16]), y: 0};
    case 'slideUp':
      return {scale: 1.05, x: 0, y: interpolate(p, [0, 1], [14, -14])};
    case 'slideL':
      return {scale: 1.07, x: interpolate(p, [0, 1], [20, -20]), y: 0};
    case 'dolly-tweeter':
      return {scale: interpolate(p, [0, 1], [1.35, 1.95]), x: 0, y: 0};
    case 'dolly-eq':
      return {scale: interpolate(p, [0, 1], [1.28, 1.7]), x: 0, y: 0};
    case 'fan':
      return {scale: interpolate(p, [0, 1], [1.02, 1.06]), x: 0, y: 0};
    default:
      return {scale: interpolate(p, [0, 1], [1.02, 1.06]), x: 0, y: 0};
  }
};

export interface PhotoProps {
  slug: string;
  w: number;
  h: number;
  p: number;
  move?: string;
  focus?: [number, number];
  radius?: number;
  /** override the automatic treatment */
  treatment?: PhotoTreatment;
  shadow?: string;
  /** constant crop-in on top of the Ken Burns motion */
  zoom?: number;
  style?: React.CSSProperties;
}

export const Photo: React.FC<PhotoProps> = ({
  slug,
  w,
  h,
  p,
  move,
  focus = [50, 50],
  radius = RADIUS.card,
  treatment,
  shadow,
  zoom = 1,
  style,
}) => {
  const tr = treatment ?? treatmentOf(slug);
  const {scale: motion, x, y} = kb(p, move);
  const scale = motion * zoom;
  const isCard = tr === 'card';

  return (
    <div
      style={{
        width: w,
        height: h,
        borderRadius: radius,
        overflow: 'hidden',
        position: 'relative',
        background: isCard ? C.card : C.sunk,
        boxShadow: shadow ?? (isCard ? SHADOW.card : SHADOW.lift),
        border: `1px solid ${isCard ? C.lineSoft : 'rgba(16,19,23,0.12)'}`,
        ...style,
      }}
    >
      <Img
        src={staticFile(imgSrc(slug))}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: `${focus[0]}% ${focus[1]}%`,
          transform: `scale(${scale}) translate(${x}px, ${y}px)`,
          // white pack shots get a touch more contrast so the grey product
          // separates from the white card; dark frames get lifted slightly so
          // they do not read as a black hole on a light page.
          filter: isCard
            ? 'contrast(1.04) saturate(1.02)'
            : 'brightness(1.06) contrast(1.02) saturate(1.04)',
        }}
      />
      {isCard ? null : (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            boxShadow: 'inset 0 0 60px rgba(255,255,255,0.10)',
            pointerEvents: 'none',
          }}
        />
      )}
    </div>
  );
};
