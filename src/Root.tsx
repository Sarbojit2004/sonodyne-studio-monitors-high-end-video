import React from 'react';
import {Composition} from 'remotion';
import {Reel} from './Reel';
import {Thumbnail, type Lang} from './Thumbnail';
import {TIMELINE} from './data/timeline';
import {LFReel} from './LFReel';
import {LFThumbnail, type LFLang} from './lf/LFThumbnail';
import {TIMELINE_LF} from './lf/timeline-lf';

const LANGS: Lang[] = ['ENGLISH', 'HINDI', 'BENGALI'];
const LF_LANGS: LFLang[] = ['ENGLISH', 'HINDI', 'BENGALI'];

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

    {/* --- 298s long-form video --- */}
    <Composition
      id="SonodyneLongForm"
      component={LFReel}
      durationInFrames={TIMELINE_LF.durationInFrames}
      fps={TIMELINE_LF.fps}
      width={TIMELINE_LF.width}
      height={TIMELINE_LF.height}
    />

    {/* Three landscape thumbnail variants for the long-form video.
        durationInFrames is 45, not 1: LFLogoCard's entrance uses a spring,
        which is 0 at frame 0 - the still must be captured after it settles
        (see scripts/render_lf_thumbnails.sh, which renders at frame 44). */}
    {LF_LANGS.map((lang) => (
      <Composition
        key={`lf-${lang}`}
        id={`LFThumbnail${lang[0]}${lang.slice(1).toLowerCase()}`}
        component={LFThumbnail}
        durationInFrames={45}
        fps={TIMELINE_LF.fps}
        width={TIMELINE_LF.width}
        height={TIMELINE_LF.height}
        defaultProps={{lang}}
      />
    ))}
  </>
);
