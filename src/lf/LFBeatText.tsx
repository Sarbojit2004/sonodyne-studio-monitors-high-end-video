import React from 'react';
import {LFHeadline, LFKicker, LFMicro, LFSub} from './LFType';
import {COPY_LF} from './copy-lf';
import {TEXT_COL} from './LFShotStage';

/**
 * Text column for a shot. Fixed left-column geometry (Section 2's soft edge
 * padding, not a hard safe zone) - kicker, headline, sub and an optional
 * micro/price line, all vertically stacked and left-aligned.
 */
export const LFBeatText: React.FC<{
  textKey?: string | null;
  local: number;
  accent: string;
  headlineSize?: number;
}> = ({textKey, local, accent, headlineSize = 92}) => {
  if (!textKey) return null;
  const copy = COPY_LF[textKey];
  if (!copy) return null;

  return (
    <div style={{position: 'absolute', left: TEXT_COL.x, top: TEXT_COL.y, width: TEXT_COL.w}}>
      {copy.kicker ? (
        <div style={{marginBottom: 22}}>
          <LFKicker frame={local} delay={0} accent={accent} maxWidth={TEXT_COL.w}>
            {copy.kicker}
          </LFKicker>
        </div>
      ) : null}
      {copy.headline ? (
        <div style={{marginBottom: copy.sub ? 26 : 0}}>
          <LFHeadline lines={copy.headline} frame={local} delay={6} size={headlineSize} maxWidth={TEXT_COL.w} />
        </div>
      ) : null}
      {copy.sub ? (
        <div style={{marginBottom: copy.micro ? 30 : 0}}>
          <LFSub frame={local} delay={16} width={TEXT_COL.w}>
            {copy.sub}
          </LFSub>
        </div>
      ) : null}
      {copy.micro ? (
        <LFMicro frame={local} delay={26} width={TEXT_COL.w}>
          {copy.micro}
        </LFMicro>
      ) : null}
    </div>
  );
};
