/**
 * Verified specifications only.
 *
 * Every value here is taken verbatim from the VERIFIED master table in the
 * creative brief (Sonodyne Pre-Production Research Plan, Section 4). Nothing
 * the brief flags as unverified is used as a factual claim anywhere in the
 * reel - notably the legacy "Kevlar" cone attribution for the 501/601, which
 * the brief explicitly resolves to Glass Fibre.
 */

export type ProductKey = 'srp350' | 'srp400' | 'srp501' | 'srp601' | 'slf210';

export interface Product {
  key: ProductKey;
  name: string;
  /** short form for tight rails */
  short: string;
  category: string;
  driver: string;
  tweeter: string | null;
  amp: string;
  freq: string;
  /** headline number for the spec rail */
  freqLow: string;
  maxSpl: string;
  thd: string;
  enclosure: string;
  enclosureType: string;
  dims: string;
  weight: string;
  finish: string;
  /** digits only - the rupee sign is rendered separately in Archivo */
  price: string;
}

export const PRODUCTS: Record<ProductKey, Product> = {
  srp350: {
    key: 'srp350',
    name: 'SRP 350 G',
    short: '350 G',
    category: '3" Active Studio Monitor',
    driver: '3" Glass Fibre',
    tweeter: '26mm Silk Dome',
    amp: '15W + 15W Class AB',
    freq: '95Hz - 22kHz',
    freqLow: '95Hz',
    maxSpl: '95dB',
    thd: '< 0.1%',
    enclosure: 'Pressure die-cast aluminium',
    enclosureType: 'Sealed',
    dims: '125 x 184 x 120mm',
    weight: '2.5kg',
    finish: 'Powder coated grey',
    price: '25,000',
  },
  srp400: {
    key: 'srp400',
    name: 'SRP 400 G',
    short: '400 G',
    category: '4.5" Active Studio Monitor',
    driver: '4.5" CURV Cone',
    tweeter: '26mm Silk Dome',
    amp: '25W + 25W Class AB',
    freq: '75Hz - 22kHz',
    freqLow: '75Hz',
    maxSpl: '100dB',
    thd: '< 0.1%',
    enclosure: 'Pressure die-cast aluminium',
    enclosureType: 'Vented, front-firing port',
    dims: '232 x 160 x 155mm',
    weight: '4.4kg',
    finish: 'Powder coated grey',
    price: '35,000',
  },
  srp501: {
    key: 'srp501',
    name: 'SRP 501 G',
    short: '501 G',
    category: '5.25" Active Studio Monitor',
    driver: '5.25" Glass Fibre',
    tweeter: '26mm Silk Dome Neodymium',
    amp: '50W + 50W Class AB',
    freq: '58Hz - 21kHz',
    freqLow: '58Hz',
    maxSpl: '104dB',
    thd: '< 0.04%',
    enclosure: 'Pressure die-cast aluminium',
    enclosureType: 'Vented, front-firing port',
    dims: '210 x 279 x 181mm',
    weight: '6.8kg',
    finish: 'Powder coated grey',
    price: '53,500',
  },
  srp601: {
    key: 'srp601',
    name: 'SRP 601 G',
    short: '601 G',
    category: '6.5" Active Studio Monitor',
    driver: '6.5" Glass Fibre',
    tweeter: '26mm Silk Dome Neodymium',
    amp: '80W + 50W Class AB',
    freq: '48Hz - 21kHz',
    freqLow: '48Hz',
    maxSpl: '107dB',
    thd: '< 0.04%',
    enclosure: 'Pressure die-cast aluminium',
    enclosureType: 'Vented, front-firing port',
    dims: '250 x 340 x 240mm',
    weight: '11.9kg',
    finish: 'Powder coated grey',
    price: '74,000',
  },
  slf210: {
    key: 'slf210',
    name: 'SLF 210 V3',
    short: 'SLF 210 V3',
    category: '10" Active Studio Subwoofer',
    driver: '10" High Excursion',
    tweeter: null,
    amp: '200W Class D',
    freq: '35Hz - Crossover',
    freqLow: '35Hz',
    maxSpl: '112dB',
    thd: '0.1% at rated power',
    enclosure: '18mm MDF',
    enclosureType: 'Vented, front-firing port',
    dims: '349 x 422 x 446mm',
    weight: '18.5kg',
    finish: 'Black painted',
    price: '60,000',
  },
};

/** Display order = the brief's ascending-capability sequence. */
export const ORDER: ProductKey[] = ['srp350', 'srp400', 'srp501', 'srp601', 'slf210'];

/**
 * Shivansh Electronics - presented purely as where to buy, ask and get the
 * best price. No distributor / dealer / reseller / authorised language appears
 * anywhere in this project.
 */
export const CONTACT = {
  site: 'shivanshelectronics.in',
  siteFull: 'https://www.shivanshelectronics.in',
  hub: 'linktr.ee/shivanshelectronics.in',
  waChannel: 'whatsapp.com/channel/0029VbBzlQH3rZZfQBHsf20K',
  phones: ['+91 98316 62458', '+91 91477 00677', '+91 89818 07755'],
  instagram: 'instagram.com/shivanshelectronics.in',
  facebook: 'facebook.com/shivanshelectronics.in',
  linkedin: 'linkedin.com/company/shivanshelectronics-in',
  threads: 'threads.com/@shivanshelectronics.in',
  x: 'x.com/sarbo_shivansh',
  youtube: 'youtube.com/@shivanshelectronics-in',
  address:
    '3, Ramanath Das Road, Dhakuria, Tanu Pukur, Garfa, Kolkata, West Bengal 700031',
} as const;
