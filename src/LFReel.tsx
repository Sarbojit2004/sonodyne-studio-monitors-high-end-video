import React from 'react';
import {AbsoluteFill, Audio, interpolate, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {loadFontsLF} from './lf/fonts';
import {TIMELINE_LF} from './lf/timeline-lf';
import {LFChapterScene} from './lf/LFChapterScene';
import {LFPricingScene} from './lf/LFPricingScene';
import {LFOutroScene} from './lf/LFOutroScene';
import {LFBrandBar} from './lf/LFBrandBar';
import {C, PRODUCT_ACCENT} from './lf/lf-theme';

// Module-scope call, exactly matching MOTU's own Reel.tsx/LFReel.tsx pattern -
// this must run before any component renders so delayRender is registered in
// time.
loadFontsLF();

const CHAPTER_ACCENT: Record<string, string> = {
  coldOpen: C.amber, sharedDna: C.petrol,
  srp350: PRODUCT_ACCENT.srp350, srp400: PRODUCT_ACCENT.srp400,
  srp501: PRODUCT_ACCENT.srp501, srp601: PRODUCT_ACCENT.srp601,
  slf210: PRODUCT_ACCENT.slf210,
  system: C.petrol, workflows: C.amber, pricing: C.amber,
  heritage: C.petrol, outro: C.amber,
};

/** Light paper flash at each chapter boundary - landscape equivalent of the
 * reel's BoundaryFlash. */
const BoundaryFlash: React.FC = () => {
  const frame = useCurrentFrame();
  const bounds = TIMELINE_LF.chapters.slice(1).map((c) => c.from);
  let o = 0;
  for (const b of bounds) {
    o = Math.max(o, interpolate(frame, [b - 5, b, b + 10], [0, 0.8, 0], {
      extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    }));
  }
  if (o <= 0.001) return null;
  return <AbsoluteFill style={{background: C.paperLift, opacity: o, pointerEvents: 'none'}} />;
};

export const LFReel: React.FC = () => (
  <AbsoluteFill style={{background: C.paper}}>
    {TIMELINE_LF.chapters.map((ch) => (
      <Sequence key={ch.id} from={ch.from} durationInFrames={ch.dur} name={ch.id} layout="none">
        {ch.id === 'pricing' ? (
          <LFPricingScene chapter={ch} />
        ) : ch.id === 'outro' ? (
          <LFOutroScene />
        ) : (
          <LFChapterScene chapter={ch} accent={CHAPTER_ACCENT[ch.id] ?? C.amber} />
        )}
      </Sequence>
    ))}

    <BoundaryFlash />
    <LFBrandBar />

    {/* audio: extends the reel's own synthesized SFX palette (Section 8a) */}
    <Audio src={staticFile('audio/lf/ambient-bed.wav')} volume={1} />
    <Audio src={staticFile('audio/lf/music-bed.wav')} volume={1} />
    <Audio src={staticFile('audio/lf/sfx-cues.wav')} volume={1} />
    <Audio src={staticFile('vo/voiceover-longform-sonodyne.wav')} volume={1} />
  </AbsoluteFill>
);
