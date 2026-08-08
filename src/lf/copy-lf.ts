/**
 * All on-screen copy for the 298s long-form video, keyed by the `text` field
 * on each shot in timeline-lf.json.
 *
 * Every claim traces to the creative brief (Sonodyne Pre-Production Research
 * Plan) - VERIFIED specs from its master table, or its per-product psychology
 * sections. No other audio brand is named or implied anywhere. No
 * distributor/dealer/reseller/"authorised" framing - Shivansh Electronics is
 * presented purely as where to buy, ask and get the best price. No tagline.
 */
import {CONTACT} from '../data/products';

export interface CopyBlock {
  kicker?: string;
  headline?: string[];
  sub?: string;
  micro?: string;
}

export const COPY_LF: Record<string, CopyBlock> = {
  // ---- Cold Open ----------------------------------------------------
  'co-a': {
    kicker: 'ACOUSTIC TRUTH',
    headline: ['YOUR MIX SOUNDS', 'PERFECT.'],
    sub: 'In your room. On your monitors. Right now.',
  },
  'co-b': {
    headline: ['THEN THE CAR TEST', 'HAPPENS.'],
    sub: 'The bass turns to rumble. The vocal buries. The revisions never end.',
    micro: 'Sonodyne SRP + SLF - engineered for acoustic truth, not flattery.',
  },

  // ---- Shared DNA -----------------------------------------------------
  'dna-a': {
    kicker: 'ONE ENGINEERING DNA',
    headline: ['FOUR MONITORS.', 'ONE FOUNDATION.'],
    sub: 'Every SRP shares the same three engineering pillars, explained once here so they never need repeating.',
  },
  'dna-b': {
    kicker: 'PRESSURE DIE-CAST ALUMINIUM',
    headline: ['A CABINET THAT', "REFUSES TO SING."],
    sub: 'Wood and MDF cabinets resonate under the driver, smearing transients and colouring the midrange. Monolithic die-cast aluminium eliminates that coloration entirely - and its higher tensile strength lets the walls run thinner, maximising internal volume for deeper bass in a smaller footprint.',
  },
  'dna-c': {
    kicker: 'CUSTOM ACOUSTIC WAVEGUIDE',
    headline: ['A SWEET SPOT', 'WIDE ENOUGH TO', 'STOP CHASING.'],
    sub: 'Each 26mm silk dome tweeter sits in a waveguide engineered for off-axis linearity - the response holds steady even when you move off-centre, reducing ear fatigue across a full session.',
  },

  // ---- SRP 350 G -------------------------------------------------------
  'p350-title': {
    kicker: 'SRP 350 G - 3" ACTIVE STUDIO MONITOR',
    headline: ['DESKTOP', 'PRECISION.'],
    sub: 'The entry point into the Sonodyne reference ecosystem - built for bedroom producers, podcasters and commercial installers facing genuinely tight spaces.',
  },
  'p350-front': {
    kicker: 'THE ONLY SEALED DESIGN IN THE RANGE',
    sub: '3-inch magnetically shielded glass fibre woofer, 26mm silk dome tweeter, 15W + 15W Class AB bi-amplification.',
  },
  'p350-sealed': {
    kicker: 'SEALED ENCLOSURE',
    headline: ['FORGIVING AGAINST', 'A WALL.'],
    sub: "A sealed cabinet rolls off bass gradually instead of the sharp bump a ported design gives near a boundary - which is exactly what happens when a monitor this size sits flush against a wall or under a screen.",
  },
  'p350-rear': {
    kicker: 'REAR-PANEL ROOM COMPENSATION',
    sub: 'Bass and treble tilts on the rear panel let you notch out problem desk reflections in seconds - no calibration software required.',
  },
  'p350-lifestyle': {
    kicker: 'DESKTOP TO BROADCAST BOOTH',
    headline: ['BUILT FOR SPACES', 'WHERE LARGER', "MONITORS DON'T FIT."],
    sub: '125 x 184 x 120mm. 2.5kg. Small enough for the tightest booth, honest enough to be a mixing engineer’s secondary reference for how a mix translates to bandwidth-limited playback.',
    micro: `SRP 350 G - ₹25,000 per unit. Available at Shivansh Electronics - ${CONTACT.site}`,
  },

  // ---- SRP 400 G -------------------------------------------------------
  'p400-title': {
    kicker: 'SRP 400 G - 4.5" ACTIVE STUDIO MONITOR',
    headline: ['THE TRANSLATION', 'BENCHMARK.'],
    sub: 'A 4.5-inch CURV composite cone - stiff, light, and fast enough to expose midrange flaws that flattering monitors hide.',
  },
  'p400-curv': {
    kicker: 'CURV COMPOSITE COMPOSITE COIL',
    headline: ['IT DOES NOT', 'FLATTER YOU.'],
    sub: 'CURV’s stiffness-to-weight ratio reveals transient detail - a snare hit arrives and stops, with no smear across the midrange where most musical information lives.',
  },
  'p400-port': {
    kicker: 'FRONT-FIRING AERODYNAMIC PORT',
    headline: ['BASS THAT AIMS', 'AT YOU, NOT', 'THE WALL BEHIND IT.'],
    sub: 'Port energy exits toward the listener instead of bouncing off the rear wall - stabilising low-end even in an untreated project room.',
  },
  'p400-numbers': {
    kicker: 'THE NUMBERS',
    sub: '75Hz - 22kHz response. 100dB max SPL. 25W + 25W bi-amplification.',
  },
  'p400-bag': {
    kicker: 'BUILT TO TRAVEL',
    sub: 'A dedicated carry case for sessions that move between rooms.',
  },
  'p400-lifestyle': {
    kicker: 'THE PROJECT-STUDIO STANDARD',
    headline: ['IF IT WORKS ON', 'THE 400 G, IT', 'WORKS EVERYWHERE.'],
    sub: 'Engineers reach for this footprint precisely because it does not flatter - a mix balanced here translates seamlessly to consumer playback.',
    micro: `SRP 400 G - ₹35,000 per unit. Available at Shivansh Electronics - ${CONTACT.site}`,
  },

  // ---- SRP 501 G -------------------------------------------------------
  'p501-title': {
    kicker: 'SRP 501 G - 5.25" ACTIVE STUDIO MONITOR',
    headline: ['YOUR PRIMARY', 'REFERENCE.'],
    sub: 'The threshold where a monitor becomes robust enough to stand alone as the only reference in a dedicated room.',
  },
  'p501-neo': {
    kicker: 'NEODYMIUM HF TRANSDUCER',
    sub: '5.25-inch glass fibre woofer reaching 58Hz, paired with a neodymium-magnet 26mm tweeter for lighter motor mass and better high-frequency linearity.',
  },
  'p501-eq': {
    kicker: 'DISCRETE ROOM CALIBRATION',
    headline: ['0.75dB AT A', 'TIME.'],
    sub: 'Rear bass tilt, treble tilt and bass roll-off, adjustable in precise 0.75dB steps - a level of calibration control absent in entry-level monitors, meant for rooms that are already acoustically treated.',
  },
  'p501-numbers': {
    kicker: 'THE NUMBERS',
    sub: '104dB max SPL. 50W + 50W bi-amplification. Headroom enough to impress a client during in-studio playback without the amps ever clipping.',
  },
  'p501-lifestyle': {
    kicker: 'FULL-SPECTRUM AUTHORITY',
    headline: ['STOP REACHING FOR', 'HEADPHONES TO', 'JUDGE THE KICK.'],
    sub: 'The bridge between nearfield intimacy and commercial-grade authority.',
    micro: `SRP 501 G - ₹53,500 per unit. Available at Shivansh Electronics - ${CONTACT.site}`,
  },

  // ---- SRP 601 G -------------------------------------------------------
  'p601-title': {
    kicker: 'SRP 601 G - 6.5" ACTIVE STUDIO MONITOR',
    headline: ['HEADROOM,', 'UNCOMPRESSED.'],
    sub: 'The apex of this nearfield range - built around scale, authority and zero-compromise commercial production.',
  },
  'p601-headroom': {
    kicker: '80W + 50W CLASS AB',
    headline: ['FEEL THE IMPACT,', 'NOT JUST THE', 'VOLUME.'],
    sub: 'Smaller drivers pushed hard suffer power compression and intermodulation distortion. The 601 G solves this with sheer surface area and electrical headroom - transient peaks stay fast even at neighbour-waking levels.',
  },
  'p601-numbers': {
    kicker: 'THE NUMBERS',
    sub: '107dB max SPL. 48Hz extension. A 6.5-inch glass fibre cone large enough that many genres never need a subwoofer at all.',
  },
  'p601-lifestyle': {
    kicker: 'COMMANDS THE ROOM',
    headline: ['MEDIUM-TO-LARGE', 'TREATED ROOMS,', 'EFFORTLESSLY.'],
    sub: 'Where dynamic orchestral or electronic material needs to be monitored loud, without the amplifier ever running out of headroom.',
    micro: `SRP 601 G - ₹74,000 per unit. Available at Shivansh Electronics - ${CONTACT.site}`,
  },

  // ---- SLF 210 V3 --------------------------------------------------------
  'slf-title': {
    kicker: 'SLF 210 V3 - 10" ACTIVE STUDIO SUBWOOFER',
    headline: ['THE FLOOR', 'UNDER IT ALL.'],
    sub: 'A different physical purpose entirely: 18mm MDF construction, 200W Class D amplification, reaching down to 35Hz.',
  },
  'slf-driver': {
    kicker: '10" HIGH-EXCURSION DRIVER',
    sub: 'Massive, effortless air displacement for club, hip-hop and cinematic sub-bass frequencies that even the SRP 601 G begins to taper off.',
  },
  'slf-2p1': {
    kicker: '2.1 CHANNEL BASS MANAGEMENT',
    headline: ['NOT JUST MORE', 'BASS - CLEANER', 'MIDS.'],
    sub: 'The built-in crossover intercepts the full stereo signal, reproduces the sub-bass, and routes a fixed 80Hz high-pass to the connected SRP monitors - relieving them of long-excursion duty their smaller woofers were never built for.',
  },
  'slf-phase': {
    kicker: 'DISCRETE PHASE CONTROL, 0deg-180deg',
    headline: ['TIME-ALIGNED WITH', 'YOUR MONITORS.'],
    sub: 'Essential for synchronising the arrival time of the bass wave with your desktop monitors, avoiding phase cancellation that would otherwise smear the low end.',
  },
  'slf-crossover': {
    kicker: 'ADJUSTABLE CROSSOVER, 50Hz-150Hz',
    sub: 'Blend the subwoofer’s upper limit to match the exact natural roll-off of whichever SRP monitor you’re running.',
  },
  'slf-numbers': {
    kicker: 'THE NUMBERS',
    sub: '112dB max SPL. 35Hz extension. Footswitch-controlled bypass for instant A/B testing.',
    micro: `SLF 210 V3 - ₹60,000 per unit. Available at Shivansh Electronics - ${CONTACT.site}`,
  },

  // ---- System Together --------------------------------------------------
  'sys-family': {
    kicker: 'ONE FAMILY, FOUR SIZES',
    headline: ['THE SAME', 'ENGINEERING,', 'SCALED TO YOUR ROOM.'],
    sub: 'Every SRP monitor shares the same die-cast aluminium enclosure, custom waveguide and Class AB bi-amplification - the difference is room-appropriate scale, not compromise.',
  },
  'sys-2p1': {
    kicker: 'COMPLETE THE SYSTEM',
    headline: ['ADD THE SLF 210 V3.', 'GO FULL RANGE.'],
    sub: 'Any SRP monitor paired with the SLF 210 V3 becomes a bass-managed 2.1 system - full-spectrum control with a cleaner midrange than the monitors could ever deliver alone.',
  },

  // ---- Real-World Workflows ----------------------------------------------
  'wf-home': {
    kicker: 'THE HOME STUDIO',
    headline: ['SRP 350 G OR 400 G.'],
    sub: 'Compact footprint, boundary-forgiving acoustics, honest midrange - built for desks, not dedicated control rooms.',
  },
  'wf-project': {
    kicker: 'THE PROJECT STUDIO',
    headline: ['SRP 400 G OR 501 G.'],
    sub: 'Enough headroom and low-end extension to mix with confidence, with discrete EQ to tame a semi-treated room.',
  },
  'wf-broadcast': {
    kicker: 'BROADCAST & PODCAST',
    headline: ['SRP 350 G OR 501 G.'],
    sub: 'Compact enough for a booth, honest enough that voice sits exactly where it will on every playback system.',
  },
  'wf-commercial': {
    kicker: 'COMMERCIAL & MASTERING SUITES',
    headline: ['SRP 601 G + SLF 210 V3.'],
    sub: 'Full-range 2.1 authority for rooms where client-impressing headroom and sub-bass accuracy both matter.',
  },

  // ---- Heritage & Proof ---------------------------------------------------
  'her-a': {
    kicker: 'FIFTY-FIVE YEARS OF INDIAN AUDIO ENGINEERING',
    headline: ['MADE IN INDIA', 'SINCE 1970.'],
    sub: 'Sonodyne was founded in Kolkata by Ashoke Mukherjee and has grown into an internationally recognised manufacturer of uncoloured, reference-grade studio hardware.',
  },
  'her-b': {
    kicker: 'TRUSTED BY GRAMMY-WINNING ENGINEERS',
    headline: ['"NO MIX IS FINISHED', 'UNTIL I CHECK IT', 'ON A SONODYNE."'],
    sub: 'Tom Lord-Alge - Grammy Award winner (U2, The Rolling Stones, Peter Gabriel, Dave Matthews Band)',
  },
  'her-c': {
    kicker: 'MORE FROM THE BOOTH',
    headline: ['"THE SRP TRANSLATES', 'VERY WELL AT LOW', 'AND HIGH VOLUME."'],
    sub: 'Eddie Kramer - Grammy Award winner (The Beatles, David Bowie, Eric Clapton, Jimi Hendrix, Kiss)',
  },
};
