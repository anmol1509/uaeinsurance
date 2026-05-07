export interface Plan {
  id: string
  name: string
  insurer: string
  network: 'standard' | 'wide' | 'premium'
  networkLabel: string
  tag?: string
  tagColor?: string
  recommended?: boolean
  features: string[]   // for filtering: 'dental','optical','maternity','worldwide'
  premiums: {
    non_dubai: number      // 0 = not available in this context
    dubai_lsb: number
    dubai_nlsb: number
  }
  highlights: {
    annualLimit: string
    territory: string
    consultation: string
    opLimit: string
    pharmacy: string
    pharmacySub: string
    dental: string
    optical: string
    maternity: string
  }
  keyFeatures: string[]
  exclusions: string[]
  hospitals: {
    name: string
    location: string
    type: 'clinic' | 'hospital' | 'specialist'
    billing: 'direct' | 'reimbursement'
  }[]
}

/* ─── Hospital Networks ──────────────────────────────────── */
const STANDARD_HOSPITALS: Plan['hospitals'] = [
  { name: 'Aster Clinic', location: 'Dubai — Multiple branches', type: 'clinic', billing: 'direct' },
  { name: 'Medeor Hospital', location: 'Dubai', type: 'hospital', billing: 'direct' },
  { name: 'Mediclinic Welcare', location: 'Dubai', type: 'hospital', billing: 'direct' },
  { name: 'NMC Royal Hospital', location: 'Abu Dhabi', type: 'hospital', billing: 'direct' },
  { name: 'Aster Hospital Mankhool', location: 'Dubai', type: 'hospital', billing: 'direct' },
  { name: 'Prime Medical Centre', location: 'Dubai', type: 'clinic', billing: 'direct' },
  { name: 'Emirates Hospital Clinics', location: 'Dubai', type: 'clinic', billing: 'direct' },
  { name: 'Thumbay Hospital', location: 'Ajman, Sharjah', type: 'hospital', billing: 'direct' },
]

const WIDE_HOSPITALS: Plan['hospitals'] = [
  ...STANDARD_HOSPITALS,
  { name: 'Mediclinic City Hospital', location: 'Dubai Healthcare City', type: 'hospital', billing: 'direct' },
  { name: 'American Hospital Dubai', location: 'Dubai', type: 'hospital', billing: 'direct' },
  { name: 'Zulekha Hospital', location: 'Dubai, Sharjah', type: 'hospital', billing: 'direct' },
  { name: 'Burjeel Hospital', location: 'Abu Dhabi', type: 'hospital', billing: 'direct' },
  { name: 'Aster DM Healthcare', location: 'UAE-wide', type: 'hospital', billing: 'direct' },
  { name: 'Dr. Sulaiman Al Habib', location: 'Dubai', type: 'hospital', billing: 'direct' },
  { name: 'Emirates Specialty Hospital', location: 'Dubai Healthcare City', type: 'specialist', billing: 'direct' },
]

const PREMIUM_HOSPITALS: Plan['hospitals'] = [
  ...WIDE_HOSPITALS,
  { name: 'Cleveland Clinic Abu Dhabi', location: 'Abu Dhabi', type: 'hospital', billing: 'direct' },
  { name: 'Moorfields Eye Hospital', location: 'Dubai Healthcare City', type: 'specialist', billing: 'direct' },
  { name: 'King\'s College Hospital', location: 'Dubai Hills', type: 'hospital', billing: 'direct' },
  { name: 'LLH Hospital', location: 'Abu Dhabi', type: 'hospital', billing: 'direct' },
  { name: 'Mediclinic Al Ain', location: 'Al Ain', type: 'hospital', billing: 'direct' },
  { name: 'VPS Healthcare', location: 'UAE-wide', type: 'hospital', billing: 'direct' },
  { name: 'International Modern Hospital', location: 'Dubai', type: 'hospital', billing: 'direct' },
  { name: 'Boston Medical Group', location: 'Dubai', type: 'specialist', billing: 'direct' },
  { name: 'GHI Clinics', location: 'Dubai', type: 'clinic', billing: 'reimbursement' },
  { name: 'Overseas facilities', location: 'International (emergency)', type: 'hospital', billing: 'reimbursement' },
]

export const PLANS: Plan[] = [
  {
    id: 'essential',
    name: 'Essential',
    insurer: 'Neuron / RSA',
    network: 'standard',
    networkLabel: 'Standard Network',
    features: [],
    premiums: { non_dubai: 550, dubai_lsb: 620, dubai_nlsb: 0 },
    highlights: {
      annualLimit: 'AED 150,000',
      territory: 'UAE only',
      consultation: 'AED 50 copay',
      opLimit: 'AED 1,500 / yr',
      pharmacy: '20% copay',
      pharmacySub: 'AED 1,500 / yr',
      dental: 'Not covered',
      optical: 'Not covered',
      maternity: 'Not covered',
    },
    keyFeatures: [
      'Emergency & hospitalisation',
      'GP visits at network clinics',
      'Basic prescriptions covered',
      'UAE-wide clinic network',
      'DHA-compliant (Dubai mandatory)',
      'Direct billing at approved clinics',
    ],
    exclusions: [
      'Dental & orthodontics',
      'Optical & vision correction',
      'Maternity & childbirth',
      'Pre-existing conditions (first 6 months)',
      'Cosmetic procedures',
      'Treatment outside UAE',
    ],
    hospitals: STANDARD_HOSPITALS,
  },
  {
    id: 'silk_road',
    name: 'Silk Road',
    insurer: 'RSA / Neuron',
    network: 'standard',
    networkLabel: 'Standard+ Network',
    features: ['dental'],
    premiums: { non_dubai: 820, dubai_lsb: 890, dubai_nlsb: 1_180 },
    highlights: {
      annualLimit: 'AED 300,000',
      territory: 'UAE only',
      consultation: 'AED 30 copay',
      opLimit: 'AED 3,000 / yr',
      pharmacy: '10% copay',
      pharmacySub: 'AED 2,000 / yr',
      dental: 'AED 500 / yr',
      optical: 'Not covered',
      maternity: 'Not covered',
    },
    keyFeatures: [
      'Wider hospital & clinic network',
      'Basic dental included',
      'Reduced consultation copay',
      'Diagnostics covered (X-Ray, MRI, CT)',
      'Chronic condition management',
      'Ambulance services',
    ],
    exclusions: [
      'Optical & vision correction',
      'Maternity & childbirth',
      'International treatment',
      'Pre-existing conditions (first 6 months)',
      'Cosmetic procedures',
      'Orthodontics',
    ],
    hospitals: STANDARD_HOSPITALS,
  },
  {
    id: 'pearl',
    name: 'Pearl',
    insurer: 'Daman',
    network: 'wide',
    networkLabel: 'Wide UAE Network',
    tag: 'Most Popular',
    tagColor: '#0D9488',
    recommended: true,
    features: ['dental', 'optical', 'maternity', 'worldwide'],
    premiums: { non_dubai: 1_050, dubai_lsb: 1_240, dubai_nlsb: 1_680 },
    highlights: {
      annualLimit: 'AED 500,000',
      territory: 'Worldwide excl. USA/Canada',
      consultation: 'AED 20 copay',
      opLimit: 'AED 7,500 / yr',
      pharmacy: '10% copay',
      pharmacySub: 'AED 3,000 / yr',
      dental: 'AED 1,500 / yr',
      optical: 'AED 500 / yr',
      maternity: 'AED 7,500 / yr',
    },
    keyFeatures: [
      'Direct billing at 400+ facilities',
      'Dental & optical included',
      'Maternity cover included',
      'Worldwide emergency cover',
      'Chronic disease management',
      'Specialist referrals covered',
      'Physiotherapy & rehabilitation',
    ],
    exclusions: [
      'Treatment in USA & Canada',
      'Pre-existing conditions (first 3 months)',
      'Cosmetic & aesthetic procedures',
      'Orthodontics & implants',
      'Infertility & IVF treatment',
      'Weight loss surgery',
    ],
    hospitals: WIDE_HOSPITALS,
  },
  {
    id: 'gold',
    name: 'Gold',
    insurer: 'AXA Gulf',
    network: 'wide',
    networkLabel: 'Wide UAE + International Emergency',
    tag: 'Best Value',
    tagColor: '#D4A24B',
    features: ['dental', 'optical', 'maternity', 'worldwide'],
    premiums: { non_dubai: 1_480, dubai_lsb: 1_680, dubai_nlsb: 2_240 },
    highlights: {
      annualLimit: 'AED 1,000,000',
      territory: 'Worldwide excl. USA/Canada',
      consultation: 'Nil copay (GP) / AED 20 specialist',
      opLimit: 'AED 15,000 / yr',
      pharmacy: '10% copay',
      pharmacySub: 'AED 5,000 / yr',
      dental: 'AED 2,000 / yr',
      optical: 'AED 1,000 / yr',
      maternity: 'AED 10,000 / yr',
    },
    keyFeatures: [
      'Nil GP copay',
      'International emergency cover',
      'High annual limit AED 1M',
      'Mental health consultations',
      'Direct billing worldwide',
      'Comprehensive diagnostics',
      'Alternative medicine covered',
      'Home nursing after hospitalisation',
    ],
    exclusions: [
      'Treatment in USA & Canada',
      'Pre-existing conditions (first 30 days)',
      'Cosmetic procedures',
      'Orthodontics',
      'IVF & infertility',
      'Long-term psychiatric inpatient',
    ],
    hospitals: WIDE_HOSPITALS,
  },
  {
    id: 'platinum',
    name: 'Platinum',
    insurer: 'GIG Gulf / Cigna',
    network: 'premium',
    networkLabel: 'Premium Worldwide',
    features: ['dental', 'optical', 'maternity', 'worldwide'],
    premiums: { non_dubai: 2_120, dubai_lsb: 0, dubai_nlsb: 3_150 },
    highlights: {
      annualLimit: 'AED 3,000,000',
      territory: 'Worldwide',
      consultation: 'Nil copay',
      opLimit: 'AED 25,000 / yr',
      pharmacy: 'Nil copay',
      pharmacySub: 'AED 10,000 / yr',
      dental: 'AED 3,000 / yr',
      optical: 'AED 1,500 / yr',
      maternity: 'AED 15,000 / yr',
    },
    keyFeatures: [
      'Nil copay across all services',
      'AED 3M annual limit',
      'Mental health inpatient & outpatient',
      'Worldwide direct billing',
      'Executive health screening',
      'Second medical opinion',
      'Air ambulance evacuation',
      'Comprehensive maternity package',
    ],
    exclusions: [
      'Treatment in USA & Canada (outpatient)',
      'Cosmetic & aesthetic procedures',
      'Orthodontics',
      'IVF beyond 2 cycles',
      'Experimental treatments',
    ],
    hospitals: PREMIUM_HOSPITALS,
  },
  {
    id: 'diamond',
    name: 'Diamond',
    insurer: 'Allianz / MetLife',
    network: 'premium',
    networkLabel: 'Premium Worldwide incl. USA & Canada',
    tag: 'Top Tier',
    tagColor: '#7C3AED',
    features: ['dental', 'optical', 'maternity', 'worldwide'],
    premiums: { non_dubai: 0, dubai_lsb: 0, dubai_nlsb: 4_200 },
    highlights: {
      annualLimit: 'Unlimited',
      territory: 'Worldwide incl. USA & Canada',
      consultation: 'Nil copay',
      opLimit: 'Unlimited',
      pharmacy: 'Nil copay',
      pharmacySub: 'AED 20,000 / yr',
      dental: 'AED 5,000 / yr + orthodontics',
      optical: 'AED 2,500 / yr',
      maternity: 'AED 25,000 / yr',
    },
    keyFeatures: [
      'Unlimited annual benefit',
      'USA & Canada fully covered',
      'Orthodontics & implants',
      'IVF up to 3 cycles',
      'Dedicated relationship manager',
      'Air ambulance worldwide',
      'Executive wellness package',
      'Mental health — unlimited sessions',
    ],
    exclusions: [
      'Cosmetic & aesthetic procedures (unless medical)',
      'Experimental or unproven treatments',
      'Pre-existing conditions (30-day waiting period)',
    ],
    hospitals: PREMIUM_HOSPITALS,
  },
]

export function getPlanPremium(plan: Plan, emirate: string, salaryBand: string): number {
  if (emirate !== 'dubai') return plan.premiums.non_dubai
  if (salaryBand === 'lsb') return plan.premiums.dubai_lsb
  return plan.premiums.dubai_nlsb
}

export function getAvailablePlans(emirate: string, salaryBand: string): Plan[] {
  return PLANS.filter(p => getPlanPremium(p, emirate, salaryBand) > 0)
}

export function calcDepPremium(base: number, relation: string): number {
  if (relation === 'wife')   return Math.round(base * 0.85)
  if (relation === 'child')  return Math.round(base * 0.60)
  if (relation === 'parent') return Math.round(base * 1.20)
  return base
}

export function calcBeamah(premium: number): number {
  if (premium < 1000) return 37
  if (premium < 3000) return 50
  return 75
}

export function calcVAT(premium: number, beamah: number): number {
  return Math.round((premium + beamah) * 0.05 * 100) / 100
}

export function calcGrandTotal(premium: number): number {
  const beamah = calcBeamah(premium)
  const vat = calcVAT(premium, beamah)
  return Math.round((premium + beamah + vat) * 100) / 100
}

export function generateQuoteNumber(): string {
  const d = new Date()
  const yr = d.getFullYear()
  const mo = String(d.getMonth() + 1).padStart(2, '0')
  const dy = String(d.getDate()).padStart(2, '0')
  const rand = String(Math.floor(Math.random() * 9000) + 1000)
  return `QR${yr}${mo}${dy}${rand}`
}
