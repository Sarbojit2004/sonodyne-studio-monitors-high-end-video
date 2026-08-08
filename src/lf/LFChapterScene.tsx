import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {LFPaper} from './LFFrame';
import {LFShotStage} from './LFShotStage';
import {LFBeatText} from './LFBeatText';
import {LFLogoCard} from './LFLogoCard';
import {C, PRODUCT_ACCENT} from './lf-theme';
import type {LFChapterData, LFShot} from './timeline-lf';

const activeShot = (shots: LFShot[], abs: number): LFShot => {
  for (const s of shots) {
    if (abs >= s.from && abs < s.from + s.dur) return s;
  }
  return shots[shots.length - 1];
};

/**
 * Sonodyne gets a handful of deliberate logo moments across the runtime, at a
 * noticeably lower frequency than the persistent Shivansh Electronics brand
 * bar (Section 9) - here, one during the shared-DNA chapter (its own
 * engineering story) and one mid-video during the SRP 501 G chapter, on top
 * of the cold-open and outro appearances already carried by the hero
 * photography and the outro's own logo pair.
 */
const SONODYNE_BEAT: Record<string, number> = {sharedDna: 60, srp501: 700};

/**
 * Generic renderer for every shot-driven chapter - cold open, shared DNA, the
 * five product chapters, system-together, workflows and heritage. The five
 * products are differentiated by their copy, per-product accent, and the
 * shot modes/overlays the timeline assigns them - not by a shared template
 * with photos swapped, same principle as the reel's ShotScene.
 */
export const LFChapterScene: React.FC<{chapter: LFChapterData; accent: string}> = ({
  chapter,
  accent,
}) => {
  const local = useCurrentFrame();
  const abs = chapter.from + local;
  const shot = activeShot(chapter.shots, abs);
  const shotLocal = abs - shot.from;
  const productAccent = chapter.product ? PRODUCT_ACCENT[chapter.product] : accent;
  const sonodyneDelay = SONODYNE_BEAT[chapter.id];

  return (
    <AbsoluteFill>
      <LFPaper tint={productAccent} />
      <LFShotStage shot={shot} local={shotLocal} accent={productAccent} />
      <LFBeatText textKey={shot.text} local={shotLocal} accent={productAccent} />
      {sonodyneDelay !== undefined ? (
        <LFLogoCard
          brand="sonodyne"
          box={{l: 56, t: 940, w: 300, h: 100}}
          accent={C.petrol}
          delay={sonodyneDelay}
        />
      ) : null}
    </AbsoluteFill>
  );
};
