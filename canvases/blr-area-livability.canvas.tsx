import {
  BarChart,
  Card, CardBody, CardHeader,
  Divider, Grid, H1, H2, H3,
  Pill, Row, Stack, Stat, Table, Text,
  useCanvasState
} from 'cursor/canvas';

// ── Bengaluru-wide livability snapshot (Apr 2026) ─────────────────────────
// Scores are directional guides for trade-offs, not appraisals. No network.

type ZoneKey =
  | 'north'
  | 'east'
  | 'southeast'
  | 'south_central'
  | 'south'
  | 'east_central'
  | 'west';

type AreaKey =
  | 'hosahalli'
  | 'thanisandra'
  | 'yelahanka'
  | 'devanahalli'
  | 'hebbal'
  | 'whitefield'
  | 'marathahalli'
  | 'sarjapur_orr'
  | 'indiranagar'
  | 'koramangala'
  | 'hsr'
  | 'jp_nagar'
  | 'electronic_city'
  | 'malleshwaram';

interface LiveScore {
  greenery: number;
  airQuality: number;
  trafficCongestion: number;
  schools: number;
  hospitals: number;
  shoppingDining: number;
  walkability: number;
  safety: number;
  roadQuality: number;
  communityFeel: number;
}

interface Area {
  zone: ZoneKey;
  zoneLabel: string;
  label: string;
  shortLabel: string;
  commuteRef: string;
  pricePerSqft: string;
  pricePerSqftMid: number;
  whatYouGet: string;
  sqftAt3Cr: string;
  livability: LiveScore;
  livabilityTotal: number;
  valueVerdict: 'overpriced' | 'fair' | 'undervalued';
  valueSummary: string;
  metroStatus: string;
  bestFor: string;
  bestPockets: string[];
  avoidPockets: string[];
  tone: 'success' | 'warning' | 'info';
  shortlistProp?: string;   // which shortlisted property is here
}

function totalLivability(l: LiveScore): number {
  return (
    l.greenery +
    l.airQuality +
    l.trafficCongestion +
    l.schools +
    l.hospitals +
    l.shoppingDining +
    l.walkability +
    l.safety +
    l.roadQuality +
    l.communityFeel
  );
}

const ZONE_ORDER: ZoneKey[] = [
  'north',
  'east',
  'southeast',
  'east_central',
  'south_central',
  'south',
  'west',
];

const ZONE_LABEL: Record<ZoneKey, string> = {
  north: 'North · airport / Manyata belt',
  east: 'East · Whitefield / ITPL corridor',
  southeast: 'Southeast · ORR / Sarjapur jobs belt',
  east_central: 'East-central · Indiranagar axis',
  south_central: 'South-central · Koramangala village',
  south: 'South · HSR / JP / EC',
  west: 'West · Old Bangalore core',
};

const areas: Record<AreaKey, Area> = {
  hosahalli: {
    zone: 'north',
    zoneLabel: ZONE_LABEL.north,
    label: 'Hosahalli / Billamaranahalli · Airport Road belt',
    shortLabel: 'Hosahalli',
    commuteRef: 'Manyata 24 min (14 km) · Airport 20–25 min',
    pricePerSqft: '₹7,000–9,500',
    pricePerSqftMid: 8200,
    whatYouGet: 'Mid-large 3 BHK in new-launch projects; semi-suburban belt off NH44',
    sqftAt3Cr: '~1,750–2,100 sqft',
    livability: {
      greenery: 8,
      airQuality: 8,
      trafficCongestion: 7,
      schools: 7,
      hospitals: 6,
      shoppingDining: 6,
      walkability: 5,
      safety: 8,
      roadQuality: 7,
      communityFeel: 7,
    },
    livabilityTotal: 0,
    valueVerdict: 'undervalued',
    valueSummary:
      'Clean, semi-suburban belt along the Airport Road corridor. Lower density than Thanisandra means better air and fewer signals. Social infrastructure is thinner — plan a car-dependent lifestyle. Purva Zenium 2 is the anchor project here.',
    metroStatus: 'Phase 2B long-term benefit; nearest station ~4 km (Kempapura direction). Airport in 20–25 min.',
    bestFor: 'Airport commuters and buyers wanting Grade A quality at lower psf than Thanisandra',
    bestPockets: ['Billamaranahalli inner lanes', 'Projects set back from Airport Road noise corridor'],
    avoidPockets: ['Airport Road main-road frontage (noise + dust)', 'Low-lying pockets near seasonal nalas'],
    tone: 'success',
    shortlistProp: '★ Purva Zenium 2 (Rank 1 — Jun 2027)',
  },
  thanisandra: {
    zone: 'north',
    zoneLabel: ZONE_LABEL.north,
    label: 'Thanisandra / Nagavara / Kogilu',
    shortLabel: 'Thanisandra',
    commuteRef: 'Manyata 18–22 min (10 km) · CBD 45–70 min',
    pricePerSqft: '₹6,500–9,500',
    pricePerSqftMid: 7800,
    whatYouGet: 'Compact 3 BHK in dense new societies; strong hospital access',
    sqftAt3Cr: '~1,650–2,050 sqft',
    livability: {
      greenery: 6,
      airQuality: 6,
      trafficCongestion: 5,
      schools: 8,
      hospitals: 9,
      shoppingDining: 8,
      walkability: 7,
      safety: 7,
      roadQuality: 6,
      communityFeel: 7,
    },
    livabilityTotal: 0,
    valueVerdict: 'fair',
    valueSummary:
      'Best North-side mix of Metro upside, hospitals, and schools. Main-road facing units pay a noise and dust tax. Prestige Avon is the Grade A anchor here.',
    metroStatus: 'Phase 2B Nagavara station — strongest near-term catalyst in North BLR.',
    bestFor: 'Metro-led buyers who still want Manyata reach',
    bestPockets: ['Inner Nagavara wards', 'Kogilu cross inner blocks', 'Thanisandra 2nd stage lanes'],
    avoidPockets: ['Thanisandra main road frontage', 'Choked service roads at peak'],
    tone: 'info',
    shortlistProp: '★ Prestige Avon (Rank 2 — Dec 2028)',
  },
  yelahanka: {
    zone: 'north',
    zoneLabel: ZONE_LABEL.north,
    label: 'Yelahanka New Town / Rajanukunte / Sahakar Nagar',
    shortLabel: 'Yelahanka',
    commuteRef: 'Manyata 25–40 min (11–15 km) · CBD 55–80 min',
    pricePerSqft: '₹5,800–8,500',
    pricePerSqftMid: 7000,
    whatYouGet: 'Spacious 3–4 BHK in planned sectors; NH44 access and greenest roads in North BLR',
    sqftAt3Cr: '~2,050–2,500 sqft',
    livability: {
      greenery: 9,
      airQuality: 9,
      trafficCongestion: 8,
      schools: 9,
      hospitals: 7,
      shoppingDining: 7,
      walkability: 6,
      safety: 9,
      roadQuality: 9,
      communityFeel: 8,
    },
    livabilityTotal: 0,
    valueVerdict: 'undervalued',
    valueSummary:
      'Widest roads and cleanest air among all major job-adjacent belts in North BLR. You trade central-city vibrancy for space and calm. Sattva Lumina (Rajanukunte) and Brigade Eternia (Yelahanka New Town) are both here.',
    metroStatus: 'Phase 2B Nagavara–airport alignment in progress; long-term Phase 3 northward.',
    bestFor: 'Families prioritising air, schools, and apartment size',
    bestPockets: ['Yelahanka New Town early phases', 'Rajanukunte off SH-9 (less congested)', 'Sahakar Nagar', 'Kattigenahalli off NH44'],
    avoidPockets: ['Low pockets near rajakaluves', 'Old town lanes if you need wide internal roads'],
    tone: 'success',
    shortlistProp: '★ Sattva Lumina (Rank 3 — Nov 2029) · Brigade Eternia (Rank 4 — Mar 2030)',
  },
  hebbal: {
    zone: 'north',
    zoneLabel: ZONE_LABEL.north,
    label: 'Hebbal / Bellary Road stack',
    shortLabel: 'Hebbal',
    commuteRef: 'Manyata 10–20 min · CBD 35–55 min',
    pricePerSqft: '₹10,000–15,000',
    pricePerSqftMid: 12000,
    whatYouGet: 'Premium high-rises; smaller plates vs suburbs',
    sqftAt3Cr: '~1,080–1,320 sqft (2 BHK typical)',
    livability: {
      greenery: 5,
      airQuality: 4,
      trafficCongestion: 2,
      schools: 7,
      hospitals: 10,
      shoppingDining: 7,
      walkability: 6,
      safety: 7,
      roadQuality: 7,
      communityFeel: 5,
    },
    livabilityTotal: 0,
    valueVerdict: 'overpriced',
    valueSummary:
      'You pay heavily for flyover adjacency and hospital density. Livability per rupee lags greener suburbs unless commute minutes are non-negotiable.',
    metroStatus: 'Hebbal interchange on Phase 2B — much of the upside already in launch pricing.',
    bestFor: 'Ultra-short Manyata commutes and hospital-heavy households',
    bestPockets: ['Lake-facing premium towers', 'Gated compounds set back from Bellary Road'],
    avoidPockets: ['Bellary Road noise corridors', 'Tight approach roads around flyover cloverleafs'],
    tone: 'warning',
  },
  devanahalli: {
    zone: 'north',
    zoneLabel: ZONE_LABEL.north,
    label: 'Devanahalli / Shettigere · Airport corridor',
    shortLabel: 'Devanahalli',
    commuteRef: 'Manyata 25–35 min · Airport 10–15 min · CBD 65–90 min',
    pricePerSqft: '₹5,500–7,500',
    pricePerSqftMid: 6400,
    whatYouGet: 'Large-format 3–4 BHK in township projects; cleanest air in the region',
    sqftAt3Cr: '~2,300–2,700 sqft',
    livability: {
      greenery: 9,
      airQuality: 10,
      trafficCongestion: 9,
      schools: 6,
      hospitals: 5,
      shoppingDining: 5,
      walkability: 3,
      safety: 8,
      roadQuality: 8,
      communityFeel: 6,
    },
    livabilityTotal: 0,
    valueVerdict: 'undervalued',
    valueSummary:
      'Purest air and least traffic in any area on this list — a genuine lifestyle upgrade for air quality and space. Trade-off: thin social infrastructure (hospitals, retail) and daily commute to Manyata adds ~10 min vs Yelahanka. Tata Varnam sits inside a 135-acre self-contained township, which partially compensates.',
    metroStatus: 'No near-term Metro. KIADB Aerospace park and upcoming STRR (Satellite Town Ring Road) are the long-term catalysts.',
    bestFor: 'Airport-frequent flyers, buyers who want max size and cleanest environment',
    bestPockets: ['Inside large townships (Carnatica / Tata Varnam)', 'SH-9 inner lanes with KIADB commercial proximity'],
    avoidPockets: ['Isolated smaller societies without their own water & power backup', 'Panchayat layouts without OC clarity'],
    tone: 'success',
    shortlistProp: '★ Tata Varnam (Rank 5 — Dec 2029)',
  },
  whitefield: {
    zone: 'east',
    zoneLabel: ZONE_LABEL.east,
    label: 'Whitefield / Kadugodi / ITPL ring',
    shortLabel: 'Whitefield',
    commuteRef: 'ITPL 10–25 min · CBD 50–75 min',
    pricePerSqft: '₹9,500–13,500',
    pricePerSqftMid: 11500,
    whatYouGet: 'Mid-premium 2–3 BHK; Purple Line reshaped the commute story',
    sqftAt3Cr: '~1,150–1,450 sqft',
    livability: {
      greenery: 6,
      airQuality: 6,
      trafficCongestion: 5,
      schools: 8,
      hospitals: 8,
      shoppingDining: 8,
      walkability: 6,
      safety: 7,
      roadQuality: 6,
      communityFeel: 7,
    },
    livabilityTotal: 0,
    valueVerdict: 'fair',
    valueSummary:
      'East BLR default for IT campuses. Metro cut airport and CBD reach dramatically; inner Whitefield still congested at peak.',
    metroStatus: 'Purple Line operational Whitefield–Challaghatta; focus on last-mile from station.',
    bestFor: 'ITPL / Graphisoft / Brookefield job anchors',
    bestPockets: ['Kadugodi metro walk', 'Inner Varthur road pockets', 'Nallurahalli low-rise lanes'],
    avoidPockets: ['Chronic water-stress pockets', 'ORR slip roads at evening peak'],
    tone: 'info',
  },
  marathahalli: {
    zone: 'east',
    zoneLabel: ZONE_LABEL.east,
    label: 'Marathahalli / Kundalahalli gate',
    shortLabel: 'Marathahalli',
    commuteRef: 'ORR spine · CBD 40–65 min',
    pricePerSqft: '₹8,000–11,500',
    pricePerSqftMid: 9500,
    whatYouGet: 'High-rise stock; location rent for ORR midpoint',
    sqftAt3Cr: '~1,350–1,700 sqft',
    livability: {
      greenery: 4,
      airQuality: 4,
      trafficCongestion: 3,
      schools: 7,
      hospitals: 8,
      shoppingDining: 8,
      walkability: 6,
      safety: 6,
      roadQuality: 5,
      communityFeel: 6,
    },
    livabilityTotal: 0,
    valueVerdict: 'fair',
    valueSummary:
      'Maximum connectivity chaos for minimum green buffer. Livability rises sharply if you pick society depth over main-road frontage.',
    metroStatus: 'ORR metro lines under rollout — watch station distance, not brochure maps.',
    bestFor: 'ORR-centric jobs with tolerance for peak-hour friction',
    bestPockets: ['Societies set back from ORR', 'Kundalahalli lake-side pockets'],
    avoidPockets: ['Direct ORR-facing towers', 'Choked service lanes without alternate exits'],
    tone: 'warning',
  },
  sarjapur_orr: {
    zone: 'southeast',
    zoneLabel: ZONE_LABEL.southeast,
    label: 'Bellandur–Sarjapur ORR jobs belt',
    shortLabel: 'Sarjapur ORR',
    commuteRef: 'Embassy / RMZ ~15–35 min · CBD 45–70 min',
    pricePerSqft: '₹8,000–12,500',
    pricePerSqftMid: 10200,
    whatYouGet: 'Mid-luxury 3 BHK; job stack is the main amenity',
    sqftAt3Cr: '~1,450–1,850 sqft',
    livability: {
      greenery: 5,
      airQuality: 4,
      trafficCongestion: 3,
      schools: 7,
      hospitals: 7,
      shoppingDining: 8,
      walkability: 5,
      safety: 6,
      roadQuality: 5,
      communityFeel: 6,
    },
    livabilityTotal: 0,
    valueVerdict: 'fair',
    valueSummary:
      'Walk-to-work for large tech parks. You accept lake-belt infrastructure stress and peak ORR merges unless you live inside a large gated master plan.',
    metroStatus: 'Blue / Pink ORR alignment still maturing — verify walking distance to future stations.',
    bestFor: 'Couples optimising on commute to Bellandur–Sarjapur office clusters',
    bestPockets: ['Inner Sarjapur village lanes', 'Kaikondrahalli quieter wards'],
    avoidPockets: ['Low-lying storm-water pockets', 'Single-entry large layouts'],
    tone: 'info',
  },
  indiranagar: {
    zone: 'east_central',
    zoneLabel: ZONE_LABEL.east_central,
    label: 'Indiranagar / Domlur edge',
    shortLabel: 'Indiranagar',
    commuteRef: 'CBD 15–30 min · ORR 20–40 min',
    pricePerSqft: '₹14,000–22,000',
    pricePerSqftMid: 17500,
    whatYouGet: 'Vertical 2–3 BHK; location premium for dining and Metro',
    sqftAt3Cr: '~850–1,100 sqft',
    livability: {
      greenery: 4,
      airQuality: 5,
      trafficCongestion: 3,
      schools: 7,
      hospitals: 8,
      shoppingDining: 10,
      walkability: 9,
      safety: 7,
      roadQuality: 5,
      communityFeel: 8,
    },
    livabilityTotal: 0,
    valueVerdict: 'overpriced',
    valueSummary:
      'Unbeatable walkable dining and Metro mesh. You pay a steep premium per sqft; apartment size is the compromise.',
    metroStatus: 'Purple Line and swap corridors — Indiranagar is already a rail hub.',
    bestFor: 'Urbanists who want foot-access nightlife and Metro',
    bestPockets: ['100 Feet intermediate cross streets', 'Domlur quieter inner blocks'],
    avoidPockets: ['100 Feet road-facing low floors', 'Parking-starved older independents'],
    tone: 'warning',
  },
  koramangala: {
    zone: 'south_central',
    zoneLabel: ZONE_LABEL.south_central,
    label: 'Koramangala (inner blocks)',
    shortLabel: 'Koramangala',
    commuteRef: 'CBD 20–40 min · EC 45–70 min',
    pricePerSqft: '₹13,000–20,000',
    pricePerSqftMid: 16000,
    whatYouGet: 'Low-rise charm or premium towers; parking is the hidden tax',
    sqftAt3Cr: '~950–1,250 sqft',
    livability: {
      greenery: 5,
      airQuality: 5,
      trafficCongestion: 4,
      schools: 7,
      hospitals: 8,
      shoppingDining: 10,
      walkability: 9,
      safety: 7,
      roadQuality: 5,
      communityFeel: 9,
    },
    livabilityTotal: 0,
    valueVerdict: 'overpriced',
    valueSummary:
      'South BLR social capital is concentrated here. Livability is about lane choice: inner 5th–8th blocks vs ring-road exposure.',
    metroStatus: 'Metro access via neighbouring stations; last-mile auto remains reality.',
    bestFor: 'Founders, creatives, and anyone optimising for serendipity',
    bestPockets: ['5th–8th Block interiors', 'ADB avenue pockets'],
    avoidPockets: ['80 Feet choke fronts', 'Houses without dedicated parking'],
    tone: 'info',
  },
  hsr: {
    zone: 'south',
    zoneLabel: ZONE_LABEL.south,
    label: 'HSR Layout sectors',
    shortLabel: 'HSR',
    commuteRef: 'ORR 15–35 min · EC 35–55 min',
    pricePerSqft: '₹11,000–17,000',
    pricePerSqftMid: 13500,
    whatYouGet: 'Compact premium 2–3 BHK; startup ecosystem at doorstep',
    sqftAt3Cr: '~1,100–1,400 sqft',
    livability: {
      greenery: 5,
      airQuality: 5,
      trafficCongestion: 4,
      schools: 7,
      hospitals: 8,
      shoppingDining: 9,
      walkability: 7,
      safety: 7,
      roadQuality: 5,
      communityFeel: 8,
    },
    livabilityTotal: 0,
    valueVerdict: 'fair',
    valueSummary:
      'Balanced South-side option between Koramangala chaos and outer sprawl. Sector depth matters for storm-water risk.',
    metroStatus: 'Future ORR metro interchange nearby — check station walk vs marketing distance.',
    bestFor: 'Startup / product roles with ORR + Sarjapur split',
    bestPockets: ['Sector 2 / 4 quieter grids', '27th Main cafe spine (if noise OK)'],
    avoidPockets: ['Known flooding grids', 'Agara connector slip at peak'],
    tone: 'info',
  },
  jp_nagar: {
    zone: 'south',
    zoneLabel: ZONE_LABEL.south,
    label: 'Jayanagar / JP Nagar (metro mesh)',
    shortLabel: 'JP / Jayanagar',
    commuteRef: 'CBD 25–45 min · ORR 20–40 min',
    pricePerSqft: '₹9,000–14,000',
    pricePerSqftMid: 11200,
    whatYouGet: 'Mix of old independent floors and new mid-rises',
    sqftAt3Cr: '~1,350–1,750 sqft',
    livability: {
      greenery: 7,
      airQuality: 6,
      trafficCongestion: 5,
      schools: 9,
      hospitals: 9,
      shoppingDining: 8,
      walkability: 8,
      safety: 8,
      roadQuality: 6,
      communityFeel: 8,
    },
    livabilityTotal: 0,
    valueVerdict: 'fair',
    valueSummary:
      'Most rounded South BLR belt: trees, schools, and Metro without Indiranagar sticker shock.',
    metroStatus: 'Green Line dense coverage — prefer walks under 900 m to a station.',
    bestFor: 'Families wanting walkable markets and strong schools',
    bestPockets: ['JP Nagar 2nd / 3rd Phase', 'Jayanagar 4th T Block'],
    avoidPockets: ['Narrow dead-end lanes if you need two cars', 'Busy market-adjacent floors'],
    tone: 'success',
  },
  electronic_city: {
    zone: 'south',
    zoneLabel: ZONE_LABEL.south,
    label: 'Electronic City Phase 1–2',
    shortLabel: 'Electronic City',
    commuteRef: 'EC offices 5–20 min · ORR 40–70 min · CBD 60–90 min',
    pricePerSqft: '₹6,000–8,800',
    pricePerSqftMid: 7400,
    whatYouGet: 'Large 3 BHK plates; best value if jobs are south of ORR',
    sqftAt3Cr: '~1,900–2,400 sqft',
    livability: {
      greenery: 6,
      airQuality: 6,
      trafficCongestion: 6,
      schools: 6,
      hospitals: 6,
      shoppingDining: 6,
      walkability: 5,
      safety: 7,
      roadQuality: 7,
      communityFeel: 6,
    },
    livabilityTotal: 0,
    valueVerdict: 'undervalued',
    valueSummary:
      'Yellow Line changed the calculus: airport and mid-city reachable by rail without ORR daily war. Still weak on fine dining vs central Bangalore.',
    metroStatus: 'Yellow Line RV Road–Bommasandra operational; buy on provable station walk, not brochure radius.',
    bestFor: 'Infosys / Biocon / south-tech park employees',
    bestPockets: ['Phase 1 established sectors', 'Neotown-style integrated townships'],
    avoidPockets: ['Phase 2 fringe without Metro walk', 'Industrial-interface pockets'],
    tone: 'success',
  },
  malleshwaram: {
    zone: 'west',
    zoneLabel: ZONE_LABEL.west,
    label: 'Malleshwaram / Sadashivanagar edge',
    shortLabel: 'Malleshwaram',
    commuteRef: 'CBD 20–40 min · Manyata 55–85 min',
    pricePerSqft: '₹10,000–16,000',
    pricePerSqftMid: 12500,
    whatYouGet: 'Older charm, strong culture; stock is heterogenous',
    sqftAt3Cr: '~1,150–1,450 sqft',
    livability: {
      greenery: 7,
      airQuality: 7,
      trafficCongestion: 5,
      schools: 9,
      hospitals: 9,
      shoppingDining: 8,
      walkability: 8,
      safety: 8,
      roadQuality: 6,
      communityFeel: 9,
    },
    livabilityTotal: 0,
    valueVerdict: 'fair',
    valueSummary:
      'West BLR stability: institutions, trees, and Metro without ORR madness. Less ideal if Manyata is a daily anchor.',
    metroStatus: 'Green Line access; airport still a long northward hop.',
    bestFor: 'Heritage-city lovers and school-first families',
    bestPockets: ['11th Cross quieter grids', 'Sadashivanagar extension pockets'],
    avoidPockets: ['Sankey-facing noise', 'Tight heritage lanes if you need SUV parking'],
    tone: 'info',
  },
};

(Object.keys(areas) as AreaKey[]).forEach(k => {
  areas[k].livabilityTotal = totalLivability(areas[k].livability);
});

const LIVABILITY_FACTORS: [keyof LiveScore, string][] = [
  ['greenery', 'Greenery'],
  ['airQuality', 'Air quality'],
  ['trafficCongestion', 'Low congestion'],
  ['schools', 'Schools'],
  ['hospitals', 'Hospitals'],
  ['shoppingDining', 'Dining / retail'],
  ['walkability', 'Walkability'],
  ['safety', 'Safety'],
  ['roadQuality', 'Road quality'],
  ['communityFeel', 'Community'],
];

/** Shortlisted property areas for the head-to-head comparison chart. */
const COMPARE_KEYS: AreaKey[] = [
  'hosahalli',
  'thanisandra',
  'yelahanka',
  'devanahalli',
];

const CHART_FACTOR_KEYS: (keyof LiveScore)[] = [
  'greenery',
  'airQuality',
  'trafficCongestion',
  'schools',
  'hospitals',
  'shoppingDining',
  'walkability',
  'safety',
];

const CHART_FACTOR_LABELS = [
  'Green',
  'Air',
  'Low traffic',
  'Schools',
  'Hospitals',
  'Dining',
  'Walk',
  'Safety',
];

const SHORTLIST_AREA_KEYS: AreaKey[] = ['hosahalli', 'thanisandra', 'yelahanka', 'devanahalli'];

export default function AreaLivabilityAnalysis() {
  const [activeZone, setActiveZone] = useCanvasState<ZoneKey | 'all' | 'shortlist'>('liveZone', 'shortlist');
  const [activeArea, setActiveArea] = useCanvasState<AreaKey>('liveArea', 'hosahalli');

  const areaKeys = Object.keys(areas) as AreaKey[];
  const keysInZone =
    activeZone === 'shortlist'
      ? SHORTLIST_AREA_KEYS
      : activeZone === 'all'
        ? areaKeys
        : areaKeys.filter(k => areas[k].zone === activeZone);

  const firstInZone = (z: ZoneKey): AreaKey =>
    areaKeys.find(k => areas[k].zone === z) ?? areaKeys[0];

  const pickZone = (z: ZoneKey | 'all' | 'shortlist') => {
    setActiveZone(z);
    if (z === 'all') return;
    if (z === 'shortlist') { setActiveArea('hosahalli'); return; }
    setActiveArea(firstInZone(z));
  };

  const sortedByLive = [...areaKeys].sort(
    (a, b) => areas[b].livabilityTotal - areas[a].livabilityTotal
  );

  const valueScore = (key: AreaKey) =>
    (areas[key].livabilityTotal / (areas[key].pricePerSqftMid / 1000)).toFixed(1);

  const bestValue = [...areaKeys].sort(
    (a, b) => parseFloat(valueScore(b)) - parseFloat(valueScore(a))
  )[0];

  const priciest = [...areaKeys].sort(
    (a, b) => areas[b].pricePerSqftMid - areas[a].pricePerSqftMid
  )[0];

  const effectiveArea: AreaKey = keysInZone.includes(activeArea as AreaKey)
    ? (activeArea as AreaKey)
    : (keysInZone[0] ?? (activeArea as AreaKey));
  const a = areas[effectiveArea];

  const comparisonSeries = COMPARE_KEYS.map(k => ({
    name: areas[k].shortLabel,
    data: CHART_FACTOR_KEYS.map(f => areas[k].livability[f]),
  }));

  return (
    <Stack gap={28} style={{ padding: '24px 28px', maxWidth: 980 }}>

      <Stack gap={6}>
        <Row gap={10} align="center">
          <H1>Priority 3 — Livability</H1>
          <Pill tone="info">After Builder + Investment</Pill>
        </Row>
        <Text tone="secondary">
          Apr 2026 · 14 belts across Bengaluru · shortlist areas (Hosahalli, Thanisandra, Yelahanka, Devanahalli) tagged · scores are directional guides, not appraisals
        </Text>
      </Stack>

      <Grid columns={4} gap={14}>
        <Stat value="4" label="Shortlisted areas" tone="success" />
        <Stat
          value={areas[sortedByLive.filter(k => SHORTLIST_AREA_KEYS.includes(k))[0]].shortLabel}
          label="Highest livability (shortlist)"
          tone="success"
        />
        <Stat value={areas[bestValue].shortLabel} label="Best livability per ₹1k/sqft (all)" tone="info" />
        <Stat value="₹3 Cr" label="Budget anchor" tone="warning" />
      </Grid>

      <Divider />

      <Stack gap={12}>
        <H2>How to read this page</H2>
        <Text size="small" tone="secondary">
          Each belt is scored on ten factors (1–10). Total is out of 100. Traffic scores reward moving against congestion, not distance. Use the zone strip to narrow the list, then open a belt for pockets to favour or avoid.
        </Text>
        <Row gap={8} wrap>
          <Pill tone="success" active={activeZone === 'shortlist'} onClick={() => pickZone('shortlist')}>
            ★ Shortlist areas only
          </Pill>
          <Pill active={activeZone === 'all'} onClick={() => setActiveZone('all')}>
            All zones
          </Pill>
          {ZONE_ORDER.map(z => (
            <Pill key={z} active={activeZone === z} onClick={() => pickZone(z)}>
              {ZONE_LABEL[z]}
            </Pill>
          ))}
        </Row>
      </Stack>

      <Divider />

      <Stack gap={12}>
        <H2>Value matrix — price vs livability (₹3 Cr sizing)</H2>
        <Text tone="secondary" size="small">
          Value score = livability total ÷ price per sqft (₹ thousands). Higher means more score per rupee of entry ticket.
        </Text>
        <Table
          headers={[
            'Belt',
            'Zone',
            'Price / sqft',
            'Livability',
            'Value',
            'Size @ ₹3 Cr',
            'Verdict',
          ]}
          rows={keysInZone.map(k => [
            areas[k].shortLabel,
            areas[k].zoneLabel.split('·')[0].trim(),
            areas[k].pricePerSqft,
            `${areas[k].livabilityTotal}/100`,
            valueScore(k),
            areas[k].sqftAt3Cr,
            areas[k].valueVerdict === 'undervalued'
              ? 'Undervalued'
              : areas[k].valueVerdict === 'overpriced'
                ? 'Overpriced'
                : 'Fair',
          ])}
          rowTone={keysInZone.map(k =>
            areas[k].valueVerdict === 'undervalued'
              ? 'success'
              : areas[k].valueVerdict === 'overpriced'
                ? 'danger'
                : undefined
          )}
          striped
        />
      </Stack>

      <Divider />

      <Grid columns={2} gap={16}>
        <Stack gap={8}>
          <H3>Livability total (of 100)</H3>
          <BarChart
            categories={sortedByLive.map(k => areas[k].shortLabel)}
            series={[
              {
                name: 'Livability',
                data: sortedByLive.map(k => areas[k].livabilityTotal),
              },
            ]}
            height={280}
          />
        </Stack>
        <Stack gap={8}>
          <H3>Value score (livability ÷ price)</H3>
          <BarChart
            categories={sortedByLive.map(k => areas[k].shortLabel)}
            series={[
              {
                name: 'Value',
                data: sortedByLive.map(k => parseFloat(valueScore(k))),
              },
            ]}
            height={280}
          />
        </Stack>
      </Grid>

      <Divider />

      <Stack gap={14}>
        <Row gap={8} align="center" wrap>
          <H2>Belt deep dive</H2>
          <Row gap={6} wrap>
            {keysInZone.map(k => (
              <Pill
                key={k}
                active={effectiveArea === k}
                tone={
                  areas[k].valueVerdict === 'undervalued'
                    ? 'success'
                    : areas[k].valueVerdict === 'overpriced'
                      ? 'warning'
                      : 'neutral'
                }
                onClick={() => setActiveArea(k)}
              >
                {areas[k].shortLabel}
              </Pill>
            ))}
          </Row>
        </Row>

        <Grid columns={4} gap={14}>
          <Stat
            value={`${a.livabilityTotal}/100`}
            label="Livability total"
            tone={a.livabilityTotal >= 75 ? 'success' : a.livabilityTotal >= 65 ? undefined : 'warning'}
          />
          <Stat
            value={valueScore(effectiveArea)}
            label="Value score"
            tone={
              parseFloat(valueScore(effectiveArea)) >= 10
                ? 'success'
                : parseFloat(valueScore(effectiveArea)) >= 7.5
                  ? undefined
                  : 'danger'
            }
          />
          <Stat value={a.sqftAt3Cr} label="Typical size @ ₹3 Cr" />
          <Stat value={a.bestFor} label="Best for" />
        </Grid>

        <Card>
          <CardHeader
            trailing={
              <Row gap={6}>
                {a.shortlistProp ? (
                  <Pill tone="success" size="sm">Shortlisted</Pill>
                ) : null}
                <Pill
                  tone={
                    a.valueVerdict === 'undervalued'
                      ? 'success'
                      : a.valueVerdict === 'overpriced'
                        ? 'warning'
                        : 'neutral'
                  }
                  size="sm"
                >
                  {a.valueVerdict}
                </Pill>
              </Row>
            }
          >
            {a.label}
          </CardHeader>
          <CardBody>
            <Stack gap={12}>
              {a.shortlistProp ? (
                <Text size="small" weight="semibold">{a.shortlistProp}</Text>
              ) : null}
              <Text size="small">{a.valueSummary}</Text>
              <Text size="small" tone="secondary">
                {a.zoneLabel} · {a.commuteRef}
              </Text>

              <Grid columns={2} gap={14}>
                <Stack gap={8}>
                  <H3>Factor table</H3>
                  <Table
                    headers={['Factor', '/10']}
                    rows={LIVABILITY_FACTORS.map(([key, label]) => [
                      label,
                      `${a.livability[key]}/10`,
                    ])}
                    rowTone={LIVABILITY_FACTORS.map(([key]) =>
                      a.livability[key] >= 8
                        ? 'success'
                        : a.livability[key] <= 4
                          ? 'danger'
                          : a.livability[key] <= 5
                            ? 'warning'
                            : undefined
                    )}
                    striped
                  />
                </Stack>

                <Stack gap={14}>
                  <Stack gap={6}>
                    <H3>Practical notes</H3>
                    <Table
                      headers={['Item', 'Detail']}
                      rows={[
                        ['Price band', a.pricePerSqft],
                        ['What the ticket buys', a.whatYouGet],
                        ['Metro', a.metroStatus],
                      ]}
                      striped
                    />
                  </Stack>

                  <Grid columns={2} gap={10}>
                    <Card>
                      <CardHeader trailing={<Pill tone="success" size="sm">Favour</Pill>}>
                        Pockets to prefer
                      </CardHeader>
                      <CardBody>
                        <Stack gap={4}>
                          {a.bestPockets.map((p: string) => (
                            <Text key={p} size="small">
                              {p}
                            </Text>
                          ))}
                        </Stack>
                      </CardBody>
                    </Card>
                    <Card>
                      <CardHeader trailing={<Pill tone="warning" size="sm">Caution</Pill>}>
                        Pockets to scrutinise
                      </CardHeader>
                      <CardBody>
                        <Stack gap={4}>
                          {a.avoidPockets.map((p: string) => (
                            <Text key={p} size="small" tone="secondary">
                              {p}
                            </Text>
                          ))}
                        </Stack>
                      </CardBody>
                    </Card>
                  </Grid>
                </Stack>
              </Grid>
            </Stack>
          </CardBody>
        </Card>

        <Stack gap={8}>
          <H3>Factor radar — {a.shortLabel}</H3>
          <BarChart
            categories={LIVABILITY_FACTORS.map(([, label]) => label)}
            series={[{ name: a.shortLabel, data: LIVABILITY_FACTORS.map(([key]) => a.livability[key]) }]}
            horizontal
            height={320}
          />
        </Stack>
      </Stack>

      <Divider />

      <Stack gap={12}>
        <H2>Shortlist head-to-head — environment vs convenience</H2>
        <Text size="small" tone="secondary">
          Four shortlist areas side-by-side: Hosahalli (Purva Zenium 2), Thanisandra (Prestige Avon), Yelahanka (Sattva Lumina + Brigade Eternia), Devanahalli (Tata Varnam). Same eight factors, scores from data.
        </Text>
        <BarChart
          categories={CHART_FACTOR_LABELS}
          series={comparisonSeries}
          stacked={false}
          height={320}
        />
      </Stack>

      <Divider />

      <Stack gap={12}>
        <H2>Quick city-wide ranking</H2>
        <Table
          headers={['Rank', 'Belt', 'Best for', 'First thing to verify']}
          rows={sortedByLive.map((k, i) => [
            String(i + 1),
            areas[k].shortLabel,
            areas[k].bestFor,
            areas[k].avoidPockets[0] ?? '—',
          ])}
          rowTone={sortedByLive.map((k, i) => (i === 0 ? 'success' : undefined))}
          striped
        />
      </Stack>

    </Stack>
  );
}
