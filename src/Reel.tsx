import React from 'react';
import {
  AbsoluteFill,
  Audio,
  interpolate,
  Sequence,
  staticFile,
  useCurrentFrame,
} from 'remotion';
import {ShotScene} from './scenes/ShotScene';
import {PricingScene} from './scenes/PricingScene';
import {CtaScene} from './scenes/CtaScene';
import {SafeZoneGuide} from './components/Stage';
import {TIMELINE} from './data/timeline';
import {C} from './theme';
import {useFontsReady} from './useFontsReady';

/**
 * Scene-boundary flash. A light wipe rather than a dark one - on a light ground
 * the transition reads as a paper flash, which is the inverse of the dark
 * cross-dissolve a dark-background build would use.
 */
const BoundaryFlash: React.FC = () => {
  const frame = useCurrentFrame();
  const bounds = TIMELINE.scenes.slice(1).map((s) => s.from);
  let o = 0;
  for (const b of bounds) {
    o = Math.max(
      o,
      interpolate(frame, [b - 5, b, b + 9], [0, 0.85, 0], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      }),
    );
  }
  if (o <= 0.001) return null;
  return (
    <AbsoluteFill
      style={{background: C.paperLift, opacity: o, pointerEvents: 'none'}}
    />
  );
};

export const Reel: React.FC<{showSafeZones?: boolean}> = ({
  showSafeZones = false,
}) => {
  useFontsReady();
  return (
  <AbsoluteFill style={{background: C.paper}}>
    {TIMELINE.scenes.map((scene) => (
      <Sequence
        key={scene.id}
        from={scene.from}
        durationInFrames={scene.dur}
        name={scene.id}
        layout="none"
      >
        {scene.kind === 'pricing' ? (
          <PricingScene scene={scene} />
        ) : scene.kind === 'cta' ? (
          <CtaScene scene={scene} />
        ) : (
          <ShotScene scene={scene} />
        )}
      </Sequence>
    ))}

    <BoundaryFlash />

    {/* ---- audio: every track is synthesized by scripts/gen_audio.py ---- */}
    {/* continuous subtle texture, never silent across the full 88s */}
    <Audio src={staticFile('audio/ambient-bed.wav')} volume={1} />
    {/* original score: clinical setup -> widening pads -> clean sub foundation */}
    <Audio src={staticFile('audio/music-bed.wav')} volume={1} />
    {/* 67 transition cues, placed on the exact cut frames */}
    <Audio src={staticFile('audio/sfx-cues.wav')} volume={1} />
    {/* silent placeholder, ready for the recorded trilingual voiceover */}
    <Audio src={staticFile('vo/voiceover-reel-sonodyne.wav')} volume={1} />

    {showSafeZones ? <SafeZoneGuide /> : null}
  </AbsoluteFill>
  );
};
