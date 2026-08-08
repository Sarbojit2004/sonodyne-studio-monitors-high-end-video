import React from 'react';
import {Composition} from 'remotion';
import {Reel} from './Reel';
import {Thumbnail, type Lang} from './Thumbnail';
import {TIMELINE} from './data/timeline';

const LANGS: Lang[] = ['ENGLISH', 'HINDI', 'BENGALI'];

export const RemotionRoot: React.FC = () => (
  <>
    <Composition
      id="SonodyneReel"
      component={Reel}
      durationInFrames={TIMELINE.durationInFrames}
      fps={TIMELINE.fps}
      width={TIMELINE.width}
      height={TIMELINE.height}
      defaultProps={{showSafeZones: false}}
    />
    {/* QA composition: identical timing, with the Instagram safe-zone bands
        drawn on top so still-frame checks can be made against real geometry. */}
    <Composition
      id="SonodyneReelSafeZones"
      component={Reel}
      durationInFrames={TIMELINE.durationInFrames}
      fps={TIMELINE.fps}
      width={TIMELINE.width}
      height={TIMELINE.height}
      defaultProps={{showSafeZones: true}}
    />

    {/* Three thumbnail variants: one design, only the language badge differs. */}
    {LANGS.map((lang) => (
      <Composition
        key={lang}
        id={`Thumbnail${lang[0]}${lang.slice(1).toLowerCase()}`}
        component={Thumbnail}
        durationInFrames={1}
        fps={TIMELINE.fps}
        width={TIMELINE.width}
        height={TIMELINE.height}
        defaultProps={{lang}}
      />
    ))}
  </>
);
