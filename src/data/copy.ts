/**
 * All on-screen copy, keyed by the `text` field on each shot in timeline.json.
 *
 * Compliance rules applied to every string in this file:
 *  - no other audio brand is named or alluded to anywhere
 *  - no "distributor" / "dealer" / "reseller" / "authorised" framing
 *  - no tagline
 *  - every technical claim traces to a VERIFIED row of the brief's master table
 *  - no literal U+2192 arrow (Archivo has no glyph for it - arrows are drawn)
 */
import {CONTACT} from './products';

export interface CopyBlock {
  kicker?: string;
  headline?: string[];
  sub?: string;
  /** small contact line placed low inside the safe zone (Section 5) */
  micro?: string;
}

export const COPY: Record<string, CopyBlock> = {
  // ---- S1 hook ----------------------------------------------------------
  'hook-a': {
    kicker: 'ACOUSTIC TRUTH',
    headline: ['YOUR MIX', 'SOUNDS', 'PERFECT.'],
  },
  'hook-b': {headline: ['IN YOUR ROOM.']},
  'hook-c': {headline: ['EVERYWHERE', 'ELSE?']},
  'hook-d': {
    kicker: 'SONODYNE',
    headline: ['SRP SERIES'],
    sub: 'Reference monitors engineered in Kolkata since 1970.',
  },

  // ---- S2 shared engineering DNA ----------------------------------------
  'dna-a': {
    kicker: 'ONE ENGINEERING DNA',
    headline: ['THE SAME CORE', 'IN ALL FOUR.'],
    sub: 'Discrete Class AB bi-amplification and a toroidal supply behind every SRP monitor.',
  },
  'dna-b': {
    kicker: 'PRESSURE DIE-CAST ALUMINIUM',
    headline: ['A CABINET', "THAT WON'T SING."],
    sub: 'Monolithic aluminium in place of resonant wood, so the enclosure adds nothing to the signal.',
  },
  'dna-c': {
    kicker: 'CUSTOM WAVEGUIDE',
    headline: ['A WIDER', 'SWEET SPOT.'],
    sub: '26mm silk dome in a custom waveguide - the response holds as you move off-axis.',
  },
  'dna-d': {
    kicker: 'BUILT TO MEASURE',
    sub: 'Thinner walls, more internal volume, no parallel resonant surfaces.',
  },

  // ---- S3 SRP 350 G  (identity: the sealed one) -------------------------
  'p350-title': {
    kicker: 'SRP 350 G',
    headline: ['DESKTOP', 'PRECISION.'],
    sub: 'The only sealed enclosure in the range.',
  },
  'p350-spec': {kicker: '3" GLASS FIBRE - SEALED'},
  'p350-sealed': {
    kicker: 'SEALED ENCLOSURE',
    headline: ['FORGIVING', 'AGAINST', 'A WALL.'],
    sub: 'A gentle low-frequency roll-off instead of a ported bump, where space is tight.',
  },
  'p350-numbers': {kicker: 'THE NUMBERS'},
  'p350-brand': {
    kicker: 'AVAILABLE AT SHIVANSH ELECTRONICS',
    micro: CONTACT.site,
  },

  // ---- S4 SRP 400 G  (identity: CURV cone + front port) ------------------
  'p400-title': {
    kicker: 'SRP 400 G',
    headline: ['THE TRANSLATION', 'BENCHMARK.'],
    sub: 'A 4.5-inch CURV composite cone: stiff, light, fast to settle.',
  },
  'p400-port': {
    kicker: 'FRONT-FIRING PORT',
    headline: ['BASS THAT', 'AIMS AT YOU.'],
    sub: 'Port energy leaves the front baffle instead of loading the wall behind it.',
  },
  'p400-spec': {kicker: '4.5" CURV CONE'},
  'p400-curv': {
    kicker: 'CURV COMPOSITE',
    headline: ['STIFF.', 'LIGHT.', 'HONEST.'],
    sub: 'Transient detail arrives and stops - no smear across the midrange.',
  },
  'p400-numbers': {kicker: 'THE NUMBERS'},
  'p400-brand': {
    kicker: 'ASK SHIVANSH ELECTRONICS',
    micro: `WhatsApp ${CONTACT.phones[0]}`,
  },

  // ---- S5 SRP 501 G  (identity: calibration) ----------------------------
  'p501-title': {
    kicker: 'SRP 501 G',
    headline: ['YOUR PRIMARY', 'REFERENCE.'],
    sub: 'Neodymium high-frequency transducer, 5.25-inch glass fibre cone.',
  },
  'p501-eq': {
    kicker: 'ROOM CALIBRATION',
    headline: ['0.75dB', 'AT A TIME.'],
    sub: 'Bass tilt, treble tilt and bass roll-off in discrete steps - stepped, not swept.',
  },
  'p501-spec': {kicker: '5.25" GLASS FIBRE - NEODYMIUM HF'},
  'p501-numbers': {
    kicker: 'THE NUMBERS',
    micro: CONTACT.instagram,
  },

  // ---- S6 SRP 601 G  (identity: headroom) -------------------------------
  'p601-title': {
    kicker: 'SRP 601 G',
    headline: ['HEADROOM,', 'UNCOMPRESSED.'],
    sub: '80W and 50W across a 6.5-inch glass fibre cone.',
  },
  'p601-headroom': {
    kicker: 'MAXIMUM SPL',
    headline: ['FILLS A', 'TREATED ROOM.'],
    sub: 'Dynamic peaks stay fast at levels where smaller drivers start to compress.',
  },
  'p601-spec': {kicker: '6.5" GLASS FIBRE - NEODYMIUM HF'},
  'p601-numbers': {kicker: 'THE NUMBERS'},
  'p601-brand': {
    kicker: 'ONE PLACE TO ASK',
    micro: CONTACT.hub,
  },

  // ---- S7 SLF 210 V3  (identity: system role) ---------------------------
  'slf-title': {
    kicker: 'SLF 210 V3',
    headline: ['THE FLOOR', 'UNDER', 'IT ALL.'],
    sub: '10-inch high-excursion driver, 200W Class D, 18mm MDF enclosure.',
  },
  'slf-phase': {
    kicker: 'PHASE CONTROL',
    headline: ['0° TO 180°.'],
    sub: 'Time-align the subwoofer with the monitors already on your desk.',
  },
  'slf-21': {
    kicker: '2.1 BASS MANAGEMENT',
    headline: ['BELOW 80Hz', 'LEAVES YOUR', 'MONITORS.'],
    sub: 'The sub takes the sub-bass and passes your SRPs a fixed 80Hz high-pass, clearing the midrange.',
  },
  'slf-numbers': {kicker: 'THE NUMBERS'},
  'slf-brand': {
    kicker: 'SEE IT AT SHIVANSH ELECTRONICS',
    micro: CONTACT.youtube,
  },

  // ---- S8 the system ----------------------------------------------------
  'sys-family': {
    kicker: 'ONE FAMILY',
    headline: ['FOUR SIZES.', 'ONE VOICE.'],
    sub: 'The same enclosure engineering from 3 inches to 6.5.',
  },
  'sys-21': {
    kicker: 'GO FULL RANGE',
    headline: ['ADD THE SUB.'],
    sub: 'Any SRP monitor with the SLF 210 V3 gives you bass-managed 2.1 monitoring.',
  },
};

/** Spec chip sets - kept per product so no two beats show the same three rows. */
export const SPEC_SETS: Record<string, {label: string; value: string}[]> = {
  srp350: [
    {label: 'ENCLOSURE', value: 'Sealed'},
    {label: 'RESPONSE', value: '95Hz'},
    {label: 'WEIGHT', value: '2.5kg'},
  ],
  srp400: [
    {label: 'CONE', value: 'CURV'},
    {label: 'RESPONSE', value: '75Hz'},
    {label: 'MAX SPL', value: '100dB'},
  ],
  srp501: [
    {label: 'EQ STEPS', value: '0.75dB'},
    {label: 'RESPONSE', value: '58Hz'},
    {label: 'THD', value: '< 0.04%'},
  ],
  srp601: [
    {label: 'MAX SPL', value: '107dB'},
    {label: 'RESPONSE', value: '48Hz'},
    {label: 'AMPLIFIER', value: '80W + 50W'},
  ],
  slf210: [
    {label: 'RESPONSE', value: '35Hz'},
    {label: 'MAX SPL', value: '112dB'},
    {label: 'AMPLIFIER', value: '200W'},
  ],
};
