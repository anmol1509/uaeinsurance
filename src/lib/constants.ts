export const UAE_EMIRATES = [
  'Abu Dhabi', 'Dubai', 'Sharjah', 'Ajman', 'Umm Al Quwain',
  'Ras Al Khaimah', 'Fujairah',
]

export const NIGERIAN_STATES = UAE_EMIRATES

export const UAE_NATIONALITIES = [
  'UAE National', 'Indian', 'Pakistani', 'Bangladeshi', 'Filipino',
  'British', 'American', 'Egyptian', 'Jordanian', 'Lebanese', 'Syrian',
  'Yemeni', 'Nepalese', 'Sri Lankan', 'Chinese', 'Other',
]

export const VISA_TYPES = [
  'Employment Visa', 'Residence Visa', 'Investor Visa',
  'Family Visa (Dependent)', 'Student Visa', 'Tourist Visa',
  'Golden Visa', 'Freelance Visa', 'UAE National',
]

export const VEHICLE_MAKES = [
  'Toyota','Honda','Mercedes-Benz','BMW','Hyundai','Kia','Ford','Nissan',
  'Mitsubishi','Volkswagen','Lexus','Porsche','Chevrolet','Suzuki','Mazda',
  'Isuzu','Renault','Land Rover','Jeep','Volvo','Infiniti','Cadillac',
  'Dodge','GMC','Audi','Other',
]

export const VEHICLE_COLOURS = [
  'White','Silver','Black','Gray','Red','Blue','Green',
  'Gold/Champagne','Brown','Yellow','Orange','Other',
]

export const COLOUR_SWATCHES: Record<string, string> = {
  White: '#FFFFFF', Silver: '#C0C0C0', Black: '#1C1C1C', Gray: '#808080',
  Red: '#DC2626', Blue: '#2563EB', Green: '#16A34A', 'Gold/Champagne': '#D4AF37',
  Brown: '#92400E', Yellow: '#FBBF24', Orange: '#F97316', Other: '#9CA3AF',
}

export const VEHICLE_TYPES = [
  'Saloon/Sedan', 'SUV', 'Pickup Truck', 'Coupe', 'Convertible',
  'Van/Minivan', 'Bus/Minibus', 'Motorcycle', 'Heavy Truck', 'Trailer', 'Other',
]

export const ENGINE_CAPACITIES = [
  'Under 1000cc','1000–1499cc','1500–1999cc','2000–2499cc',
  '2500–2999cc','3000–3499cc','3500cc and above',
]

export const MARKET_VALUE_RANGES = [
  { label: 'Under AED 20,000',       value: 'under_20k',    midpoint: 15000 },
  { label: 'AED 20,000 – AED 50,000', value: '20k_50k',     midpoint: 35000 },
  { label: 'AED 50,000 – AED 100,000',value: '50k_100k',    midpoint: 75000 },
  { label: 'AED 100,000 – AED 150,000',value: '100k_150k',  midpoint: 125000 },
  { label: 'AED 150,000 – AED 200,000',value: '150k_200k',  midpoint: 175000 },
  { label: 'AED 200,000 – AED 300,000',value: '200k_300k',  midpoint: 250000 },
  { label: 'AED 300,000 – AED 500,000',value: '300k_500k',  midpoint: 400000 },
  { label: 'Above AED 500,000',       value: 'above_500k',  midpoint: 700000 },
]

export const DRIVING_EXPERIENCE_OPTIONS = [
  'Less than 1 year','1–2 years','3–5 years','6–10 years','10+ years',
]

export const SECURITY_FEATURES = [
  'GPS Tracker','Immobiliser','Alarm System',
  'Dash Camera','Central Locking','None of the above',
]

export const ID_TYPES = [
  'Emirates ID', 'UAE Driving License', 'Passport', 'Visa Copy',
]

export const MARITAL_STATUSES = ['Single','Married','Divorced','Widowed']

export const GENDERS = ['Male','Female','Other']

export const OCCUPATIONS = [
  'Accountant','Architect','Business owner','Civil servant','Doctor','Driver',
  'Engineer','Finance Professional','IT Professional','Journalist','Lawyer','Lecturer',
  'Manager','Marketing/Sales','Nurse','Pharmacist','Police/Military',
  'Retiree','Student','Teacher','Trader','Other',
]

export const PRODUCT_STEPS = {
  motor: [
    { id: 1, label: 'Vehicle info',   title: 'Tell us about your vehicle',     sub: "We'll use this to prepare an accurate quote." },
    { id: 2, label: 'Driver details', title: 'Driver & risk details',           sub: 'Helps us assess the risk profile of the primary driver.' },
    { id: 3, label: 'Your details',   title: 'Your personal information',       sub: 'Required for KYC verification under IA UAE regulations.' },
    { id: 4, label: 'Documents',      title: 'Upload your documents',           sub: 'Emirates ID and driving license required per IA guidelines.' },
    { id: 5, label: 'Review',         title: 'Review your details',             sub: 'Check everything is correct before getting your quote.' },
  ],
  medical: [
    { id: 1, label: 'Personal info',  title: 'Your personal details',           sub: 'Basic information to set up your DHA-compliant health policy.' },
    { id: 2, label: 'Health details', title: 'Health information',              sub: 'Help us understand your health profile.' },
    { id: 3, label: 'Coverage',       title: 'Choose your coverage',            sub: 'Select the DHA/HAAD-compliant benefits that suit your needs.' },
    { id: 4, label: 'Review',         title: 'Review your details',             sub: 'Check everything is correct before getting your quote.' },
  ],
  travel: [
    { id: 1, label: 'Traveller info', title: 'Your travel details',             sub: 'Tell us about the traveller(s).' },
    { id: 2, label: 'Trip details',   title: 'Trip & coverage options',         sub: 'Dates, destination and cover.' },
    { id: 3, label: 'Health info',    title: 'Health declaration',              sub: 'A few health questions required by the insurer.' },
    { id: 4, label: 'Review',         title: 'Review your details',             sub: 'Check everything is correct before getting your quote.' },
  ],
  business: [
    { id: 1, label: 'Business info',  title: 'Business details',                sub: 'Tell us about your company in UAE.' },
    { id: 2, label: 'Coverage',       title: 'Select your covers',              sub: 'Your premium updates live as you add employee health covers.' },
    { id: 3, label: 'Risk details',   title: 'Risk assessment',                 sub: 'A few questions about your workforce and operations.' },
    { id: 4, label: 'Contact info',   title: 'HR / Contact details',            sub: 'KYC information for the authorised signatory.' },
    { id: 5, label: 'Review',         title: 'Review your details',             sub: 'Check everything is correct before getting your quote.' },
  ],
} as const
