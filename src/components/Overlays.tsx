import React from 'react';
import {interpolate} from 'remotion';
import {C, F, T, WIDTH} from '../theme';

/**
 * The modular SVG/CSS graphics the brief asks for in Section 11, re-tuned for a
 * light ground: strokes are dark ink rather than glowing light.
 */

const clamp01 = (p: number) => Math.min(1, Math.max(0, p));

/** Structural rigidity grid - flashes over the die-cast chassis. */
export const RigidityGrid: React.FC<{p: number; accent?: string}> = ({
  p,
  accent = C.petrol,
}) => {
  const t = clamp01(p);
  const reveal = interpolate(t, [0, 0.45], [0, 1], {extrapolateRight: 'clamp'});
  const fade = interpolate(t, [0.62, 1], [1, 0], {extrapolateLeft: 'clamp'});
  const cols = 9;
  const rows = 6;
  return (
    <svg
      viewBox="0 0 900 600"
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        opacity: fade * 0.7,
      }}
    >
      {Array.from({length: cols + 1}).map((_, i) => (
        <line
          key={`v${i}`}
          x1={(900 / cols) * i}
          y1={0}
          x2={(900 / cols) * i}
          y2={600 * reveal}
          stroke={accent}
          strokeWidth={1}
          opacity={0.45}
        />
      ))}
      {Array.from({length: rows + 1}).map((_, i) => (
        <line
          key={`h${i}`}
          x1={0}
          y1={(600 / rows) * i}
          x2={900 * reveal}
          y2={(600 / rows) * i}
          stroke={accent}
          strokeWidth={1}
          opacity={0.45}
        />
      ))}
      {Array.from({length: (cols + 1) * (rows + 1)}).map((_, i) => {
        const cx = (900 / cols) * (i % (cols + 1));
        const cy = (600 / rows) * Math.floor(i / (cols + 1));
        return (
          <circle
            key={`n${i}`}
            cx={cx}
            cy={cy}
            r={2.4 * reveal}
            fill={accent}
            opacity={0.8}
          />
        );
      })}
    </svg>
  );
};

/** Directivity cone - off-axis linearity from the custom waveguide. */
export const DirectivityCone: React.FC<{p: number; accent?: string}> = ({
  p,
  accent = C.amber,
}) => {
  const t = clamp01(p);
  const grow = interpolate(t, [0.1, 0.7], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const fade = interpolate(t, [0.75, 1], [1, 0.25], {extrapolateLeft: 'clamp'});
  return (
    <svg
      viewBox="0 0 900 600"
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        opacity: fade,
      }}
    >
      <defs>
        <linearGradient id="dirg" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={accent} stopOpacity="0.34" />
          <stop offset="100%" stopColor={accent} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path
        d={`M 430 300 L ${430 + 470 * grow} ${300 - 250 * grow} L ${430 + 470 * grow} ${300 + 250 * grow} Z`}
        fill="url(#dirg)"
      />
      {[0, 1, 2].map((i) => {
        const r = 60 + i * 95;
        const a = clamp01((grow - i * 0.16) * 1.6);
        return (
          <path
            key={i}
            d={`M 430 300 m ${r} 0 a ${r} ${r} 0 0 0 ${-r * 0.35} ${-r * 0.62}`}
            fill="none"
            stroke={accent}
            strokeWidth={2}
            opacity={a * 0.7}
            transform={`rotate(${-28} 430 300)`}
          />
        );
      })}
      <circle cx={430} cy={300} r={7} fill={accent} opacity={0.9} />
    </svg>
  );
};

/** Discrete 0.75dB EQ ladder - the SRP 501 G calibration idea, made visible. */
export const EqSteps: React.FC<{p: number; accent?: string}> = ({
  p,
  accent = '#2A4E3C',
}) => {
  const t = clamp01(p);
  const steps = 9;
  const active = Math.floor(
    interpolate(t, [0.08, 0.86], [0, steps], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }),
  );
  return (
    <div
      style={{
        position: 'absolute',
        right: 34,
        top: '50%',
        transform: 'translateY(-50%)',
        display: 'flex',
        flexDirection: 'column-reverse',
        gap: 9,
        padding: '22px 20px',
        borderRadius: 14,
        background: 'rgba(250,248,245,0.92)',
        border: `1px solid ${C.lineSoft}`,
        backdropFilter: 'blur(14px)',
      }}
    >
      {Array.from({length: steps}).map((_, i) => (
        <div key={i} style={{display: 'flex', alignItems: 'center', gap: 12}}>
          <div
            style={{
              width: 8 + i * 7,
              height: 7,
              borderRadius: 2,
              background: i <= active ? accent : C.line,
              transition: 'none',
            }}
          />
          <div
            style={{
              ...T.specSmall,
              fontFamily: F.mono,
              fontSize: 18,
              color: i === active ? C.ink : C.inkFaint,
              width: 74,
            }}
          >
            {(i * 0.75).toFixed(2)}
          </div>
        </div>
      ))}
      <div
        style={{
          ...T.micro,
          fontFamily: F.body,
          fontStretch: WIDTH.wide,
          color: C.inkMuted,
          marginBottom: 6,
          letterSpacing: '0.14em',
        }}
      >
        dB STEP
      </div>
    </div>
  );
};

/** Phase dial 0 to 180 degrees - the SLF 210 V3 time-alignment control. */
export const PhaseDial: React.FC<{p: number; accent?: string}> = ({
  p,
  accent = '#1B2A55',
}) => {
  const t = clamp01(p);
  const deg = interpolate(t, [0.1, 0.85], [0, 180], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const R = 74;
  // Semicircle parameterised so 0deg is hard left and 180deg is hard right:
  // theta sweeps pi -> 0, with SVG's y axis pointing down.
  const theta = Math.PI * (1 - deg / 180);
  const ex = 86 + R * Math.cos(theta);
  const ey = 92 - R * Math.sin(theta);
  const nx = 86 + R * 0.82 * Math.cos(theta);
  const ny = 92 - R * 0.82 * Math.sin(theta);
  return (
    <div
      style={{
        position: 'absolute',
        right: 36,
        bottom: 34,
        width: 208,
        padding: '20px 18px 18px',
        borderRadius: 16,
        background: 'rgba(250,248,245,0.93)',
        border: `1px solid ${C.lineSoft}`,
        backdropFilter: 'blur(14px)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 10,
      }}
    >
      <svg width={172} height={104} viewBox="0 0 172 104">
        <path
          d={`M ${86 - R} 92 A ${R} ${R} 0 0 1 ${86 + R} 92`}
          fill="none"
          stroke={C.line}
          strokeWidth={9}
          strokeLinecap="round"
        />
        {deg > 1 ? (
          <path
            d={`M ${86 - R} 92 A ${R} ${R} 0 0 1 ${ex} ${ey}`}
            fill="none"
            stroke={accent}
            strokeWidth={9}
            strokeLinecap="round"
            opacity={0.9}
          />
        ) : null}
        <line
          x1={86}
          y1={92}
          x2={nx}
          y2={ny}
          stroke={C.ink}
          strokeWidth={3.2}
          strokeLinecap="round"
        />
        <circle cx={86} cy={92} r={6} fill={C.ink} />
      </svg>
      <div style={{...T.spec, fontFamily: F.mono, fontSize: 30, color: C.ink}}>
        {Math.round(deg)}
        {'°'}
      </div>
      <div
        style={{
          ...T.micro,
          fontFamily: F.body,
          fontStretch: WIDTH.wide,
          color: C.inkMuted,
          letterSpacing: '0.14em',
        }}
      >
        PHASE
      </div>
    </div>
  );
};

/**
 * 2.1 signal flow: full-range in, sub-bass to the SLF, a fixed 80Hz high-pass
 * on to the monitors. Drawn rather than typed - no arrow glyph needed.
 */
export const CrossoverFlow: React.FC<{p: number; accent?: string}> = ({
  p,
  accent = '#1B2A55',
}) => {
  const t = clamp01(p);
  const draw = interpolate(t, [0.1, 0.7], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const L = 620;
  return (
    <div
      style={{
        position: 'absolute',
        left: 30,
        bottom: 28,
        right: 30,
        padding: '20px 24px',
        borderRadius: 14,
        background: 'rgba(250,248,245,0.93)',
        border: `1px solid ${C.lineSoft}`,
        backdropFilter: 'blur(14px)',
      }}
    >
      <svg width="100%" height={96} viewBox="0 0 700 96" preserveAspectRatio="none">
        <line
          x1={10}
          y1={30}
          x2={10 + L * draw}
          y2={30}
          stroke={accent}
          strokeWidth={3}
          opacity={0.85}
        />
        <line
          x1={10}
          y1={70}
          x2={10 + L * draw}
          y2={70}
          stroke={C.inkFaint}
          strokeWidth={3}
          opacity={0.8}
        />
        <circle cx={10 + L * draw} cy={30} r={5} fill={accent} opacity={draw} />
        <circle cx={10 + L * draw} cy={70} r={5} fill={C.inkFaint} opacity={draw} />
      </svg>
      <div style={{display: 'flex', justifyContent: 'space-between', marginTop: -74}}>
        <div
          style={{
            ...T.micro,
            fontFamily: F.body,
            fontStretch: WIDTH.wide,
            color: accent,
          }}
        >
          BELOW 80Hz - SLF 210 V3
        </div>
        <div
          style={{
            ...T.micro,
            fontFamily: F.body,
            fontStretch: WIDTH.wide,
            color: C.inkMuted,
          }}
        >
          ABOVE 80Hz - SRP MONITORS
        </div>
      </div>
    </div>
  );
};

/**
 * Frequency-response motif: the curve extends further left as the range scales
 * up, illustrating deeper low-frequency reach.
 */
export const FreqCurve: React.FC<{
  lowHz: number;
  p: number;
  accent?: string;
  width?: number;
  height?: number;
}> = ({lowHz, p, accent = C.amber, width = 860, height = 96}) => {
  const t = clamp01(p);
  // map 30Hz..24kHz logarithmically across the width
  const x = (hz: number) =>
    ((Math.log10(hz) - Math.log10(30)) / (Math.log10(24000) - Math.log10(30))) * width;
  const knee = x(lowHz);
  // The 35Hz knee maps to the very left of the log scale, which would put the
  // roll-off tail outside the SVG and into the left safe-zone margin. Clamp the
  // start (and clip the SVG) so the motif can never escape its box.
  const startX = Math.max(10, knee - 46);
  const draw = interpolate(t, [0.05, 0.65], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const flatY = height * 0.42;
  const path = `M ${startX} ${height * 0.95} C ${startX + 32} ${height * 0.9}, ${startX + 52} ${flatY + 8}, ${startX + 100} ${flatY} L ${width - 60} ${flatY} C ${width - 26} ${flatY}, ${width - 12} ${flatY + 12}, ${width} ${height * 0.7}`;

  return (
    <svg width={width} height={height} style={{display: 'block', overflow: 'hidden'}}>
      <line
        x1={0}
        y1={flatY}
        x2={width}
        y2={flatY}
        stroke={C.line}
        strokeWidth={1}
        strokeDasharray="4 7"
      />
      <path
        d={path}
        fill="none"
        stroke={accent}
        strokeWidth={3.4}
        strokeLinecap="round"
        style={{
          strokeDasharray: 2000,
          strokeDashoffset: 2000 * (1 - draw),
        }}
      />
      <circle cx={startX} cy={height * 0.95} r={5.5} fill={accent} opacity={draw} />
      <text
        x={Math.max(2, startX - 6)}
        y={height * 0.95 - 16}
        style={{
          fontFamily: F.mono,
          fontSize: 22,
          fontWeight: 600,
          fill: C.ink,
          opacity: draw,
        }}
      >
        {lowHz}Hz
      </text>
    </svg>
  );
};
