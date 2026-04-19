import {
  BarChart,
  Card, CardBody, CardHeader,
  Divider, Grid, H1, H2, H3,
  Pill, Row, Stack, Stat, Table, Text,
  useCanvasState,
} from 'cursor/canvas';

// ── North BLR area guide: 5 core micro-markets + 5 watch-list pins ────────
// Replaces: blr-area-selection · blr-area-livability · blr-connectivity

type AreaKey = 'hosahalli' | 'thanisandra' | 'yelahanka' | 'yelahankaNT' | 'devanahalli';

// ── Scores ─────────────────────────────────────────────────────────────────

interface LiveScore {
  greenery: number; airQuality: number; traffic: number;
  schools: number; hospitals: number; retail: number;
  walkability: number; safety: number; roads: number; community: number;
}
interface ConnScore {
  metro: number; roadNH: number; airport: number; bmtc: number; lastMile: number;
}

// ── Social infra ────────────────────────────────────────────────────────────

interface SocialInfra {
  schools:   { name: string; dist: string }[];
  hospitals: { name: string; dist: string }[];
  malls:     { name: string; dist: string }[];
  daily:     string;   // daily essentials note
  water:     string;   // BWSSB / borewell situation
  fAndB:     string;   // café / restaurant scene
}

// ── Full area record ────────────────────────────────────────────────────────

interface Area {
  label: string;
  shortName: string;
  shortlistProp: string;
  maturity: 'Established' | 'Maturing' | 'Emerging';
  // commute
  manyataKm: number;
  peakMin: string;
  offPeakMin: string;
  airportMin: string;
  // price
  psfRange: string;
  psfMid: number;
  allIn: string;
  possession: string;
  cagr5yr: string;
  // livability
  live: LiveScore;
  liveTotal: number;
  // connectivity
  conn: ConnScore;
  connTotal: number;
  // social
  social: SocialInfra;
  // suitability
  singleAdult: number;    // 1–10
  singleNote: string;
  family: number;         // 1–10
  familyNote: string;
  // summaries
  bestPockets: string[];
  avoidPockets: string[];
  strr: string;
  investVerdict: string;
  tone: 'success' | 'warning' | 'info';
}

// ── Area data ───────────────────────────────────────────────────────────────

const areas: Record<AreaKey, Area> = {
  hosahalli: {
    label: 'Hosahalli / Billamaranahalli · Airport Road belt',
    shortName: 'Hosahalli',
    shortlistProp: '★ Purva Zenium 2 (Rank 1 — Jun 2027)',
    maturity: 'Maturing',
    manyataKm: 14, peakMin: '30–40 min', offPeakMin: '22–28 min', airportMin: '20–25 min',
    psfRange: '₹7,000–9,500', psfMid: 8200, allIn: '₹1.82–2.53 Cr', possession: 'Jun 2027', cagr5yr: '8–10%',
    live: {
      greenery: 8, airQuality: 8, traffic: 7, schools: 6, hospitals: 5,
      retail: 5, walkability: 4, safety: 8, roads: 7, community: 6,
    },
    liveTotal: 0,
    conn: { metro: 3, roadNH: 8, airport: 9, bmtc: 3, lastMile: 4 },
    connTotal: 0,
    social: {
      schools: [
        { name: 'Prakriya World School', dist: '~8 km' },
        { name: 'DPS North Bangalore', dist: '~10 km' },
        { name: 'Mallya Aditi International', dist: '~8 km' },
        { name: 'Podar International', dist: '~6 km' },
      ],
      hospitals: [
        { name: 'Aster CMI Hospital (Sahakar Nagar)', dist: '~12 km' },
        { name: 'Columbia Asia (Hebbal)', dist: '~16 km' },
        { name: 'Narayana Health City', dist: '~20 km' },
      ],
      malls: [
        { name: 'Esteem Mall, Yelahanka', dist: '~10 km' },
        { name: 'Elements Mall, Nagavara', dist: '~18 km' },
      ],
      daily: 'Spencer\'s and local markets on Airport Road. Coverage growing but thin inside the Hosahalli pocket. Yelahanka town is the nearest dense retail hub (~10 km).',
      water: 'BWSSB extended area supply — variable hours; borewell backup standard in new projects. Grade A projects (Puravankara) include sump capacity.',
      fAndB: 'Very limited walkable cafes or restaurants in the Hosahalli pocket. Yelahanka NH44 corridor has growing options 10–12 min away. Not ideal for frequent eating out.',
    },
    singleAdult: 5,
    singleNote: 'Car-dependent; limited walkable social scene. Good for someone who works from home 3+ days and values clean air and airport access. Social life requires a drive to Yelahanka or Manyata zone.',
    family: 7,
    familyNote: 'Good air quality, spacious apartments, reasonable school access by car. Hospitals are 15–20 min away — manageable for planned visits but not ideal for emergencies. Grows into a good family area as social infra builds.',
    bestPockets: [
      'Billamaranahalli inner lanes — set back from Airport Road noise',
      'Projects above ground floor on slightly elevated terrain (nala avoidance)',
      'North/East-facing units in Purva Zenium 2 towers',
    ],
    avoidPockets: [
      'Main Airport Road frontage — heavy vehicle noise + dust',
      'Low-lying pockets near seasonal nalas on Airport Road belt',
    ],
    strr: 'STRR Phase 1 outer belt alignment passes nearby (~2027–28). Will improve peripheral east-west commutes and reduce dependency on NH44 for all trips.',
    investVerdict: 'Solid entry-point play. Earliest possession (Jun 2027) = earliest rental income + resale in rising market. Airport Road CAGR 8–10%; lower than Thanisandra but more headroom.',
    tone: 'info',
  },

  thanisandra: {
    label: 'Thanisandra / Nagavara / Kogilu',
    shortName: 'Thanisandra',
    shortlistProp: '★ Prestige Avon (Rank 2 — Dec 2028)',
    maturity: 'Maturing',
    manyataKm: 10, peakMin: '25–40 min', offPeakMin: '18–22 min', airportMin: '35–45 min',
    psfRange: '₹6,500–9,500', psfMid: 8800, allIn: '~₹3.41 Cr', possession: 'Dec 2028', cagr5yr: '10–12%',
    live: {
      greenery: 6, airQuality: 6, traffic: 4, schools: 8, hospitals: 9,
      retail: 8, walkability: 7, safety: 7, roads: 6, community: 7,
    },
    liveTotal: 0,
    conn: { metro: 8, roadNH: 7, airport: 5, bmtc: 7, lastMile: 7 },
    connTotal: 0,
    social: {
      schools: [
        { name: 'Ryan International School', dist: '~3 km' },
        { name: 'Orchids The International School', dist: '~2 km' },
        { name: 'Presidency School', dist: '~4 km' },
        { name: 'Delhi Public School (DPS)', dist: '~5 km' },
      ],
      hospitals: [
        { name: 'Columbia Asia Hospital (Hebbal)', dist: '~5 km' },
        { name: 'Aster CMI Hospital', dist: '~3 km' },
        { name: 'Manipal Hospital (Millers Road)', dist: '~10 km' },
        { name: 'Baptist Hospital', dist: '~8 km' },
      ],
      malls: [
        { name: 'Elements Mall', dist: '~4 km' },
        { name: 'Esteem Mall (Yelahanka)', dist: '~6 km' },
        { name: 'Mantri Encore', dist: '~8 km' },
      ],
      daily: 'Excellent density. D-Mart (Nagavara), multiple Reliance Fresh, supermarkets, and local wet markets all within 2–4 km. One of the best-served micro-markets in North BLR for daily needs.',
      water: 'BWSSB Cauvery water supply — direct connection in most Thanisandra BBMP wards. Most reliable water supply among the shortlisted areas. New projects confirm BWSSB connection in sale agreements.',
      fAndB: 'Best F&B scene among shortlisted areas. Manyata corridor (Rachenahalli, Hebbal) has a dense cluster of cafés, restaurants, and pubs. Nagavara–Thanisandra belt is well-served for daily dining.',
    },
    singleAdult: 9,
    singleNote: 'Top pick for a single working professional. Manyata proximity means lunch runs, after-work social scene, and cab density are all excellent. Walkable local errands, BMTC access, and Metro Phase 2B upcoming make this the most urban-feeling North BLR pocket.',
    family: 9,
    familyNote: 'Best social infra among shortlisted areas. Multiple Grade A hospitals within 5 km, top schools, malls, and established community feel. Slightly noisier and denser than Yelahanka. Main concern is traffic and some flooding micro-risk in low pockets.',
    bestPockets: [
      'Inner Nagavara wards — set back from main road, good school/hospital proximity',
      'Kogilu cross inner blocks — lower density, wider approach roads',
      'Thanisandra 2nd stage lanes — newer development, better road quality',
    ],
    avoidPockets: [
      'Thanisandra Main Road frontage — noise, dust, and heavy peak traffic',
      'Pockets near rajakaluve (stormwater drain) — flooding risk in monsoon',
    ],
    strr: 'STRR has limited direct benefit to inner Thanisandra (it services outer suburban belt). ORR is the relevant orbital here for east-west jobs access.',
    investVerdict: 'Best investment micro-market in North BLR. Highest CAGR (10–12%), best rental yield (3–3.5%), deepest resale pool. Constraint: Prestige Avon is ₹41L over ₹3 Cr ceiling. Negotiate a lower floor or compact 3 BHK.',
    tone: 'success',
  },

  yelahanka: {
    label: 'Yelahanka / Rajanukunte · SH-9 belt',
    shortName: 'Yelahanka (Sattva)',
    shortlistProp: '★ Sattva Lumina (Rank 3 — Nov 2029)',
    maturity: 'Established',
    manyataKm: 11, peakMin: '30–45 min', offPeakMin: '22–30 min', airportMin: '20–28 min',
    psfRange: '₹5,800–8,500', psfMid: 7000, allIn: '₹1.62–1.87 Cr', possession: 'Nov 2029', cagr5yr: '7–9%',
    live: {
      greenery: 9, airQuality: 9, traffic: 8, schools: 8, hospitals: 6,
      retail: 6, walkability: 5, safety: 9, roads: 8, community: 8,
    },
    liveTotal: 0,
    conn: { metro: 3, roadNH: 7, airport: 8, bmtc: 4, lastMile: 4 },
    connTotal: 0,
    social: {
      schools: [
        { name: 'Mallya Aditi International School', dist: '~6 km' },
        { name: 'DPS North Bangalore', dist: '~5 km' },
        { name: 'Podar International School', dist: '~5 km' },
        { name: 'CMR International School', dist: '~4 km' },
      ],
      hospitals: [
        { name: 'Aster CMI Yelahanka', dist: '~6 km' },
        { name: 'Narayana Health City', dist: '~15 km' },
        { name: 'Columbia Asia (Hebbal)', dist: '~18 km' },
      ],
      malls: [
        { name: 'Esteem Mall, Yelahanka', dist: '~6 km' },
        { name: 'Growing F&B on NH44 corridor', dist: '5–8 km' },
      ],
      daily: 'Yelahanka town centre (6 km) has good coverage: D-Mart, local markets, and supermarkets. Rajanukunte pocket itself is thin — plan on driving to Yelahanka for weekly shopping.',
      water: 'BWSSB extended area. Some dependency on borewell in Rajanukunte pocket; Yelahanka NT proper has better BWSSB supply. Sattva Lumina township scale ensures borewell + sump backup.',
      fAndB: 'Growing café and restaurant scene along NH44 and Yelahanka Main Road. Noticeably quieter than Thanisandra — suits someone who prefers a calm evening over a buzzing scene. Esteem Mall food court is the main option.',
    },
    singleAdult: 6,
    singleNote: 'Works well for someone who values clean air, space, and calm over nightlife. Social options require a car ride to Yelahanka town or NH44. If WFH 3+ days, this is comfortable. If you need daily after-work social energy, Thanisandra is better.',
    family: 9,
    familyNote: 'Best livability for a family among shortlist options. Greenery 9/10, air quality 9/10, safety 9/10, good schools nearby. The lower hospital density is the main gap — Aster Yelahanka covers routine needs but serious emergencies require 15–18 min drive.',
    bestPockets: [
      'Rajanukunte off SH-9 — projects set back from main road with open views',
      'Yelahanka New Town early phases — established streets, wide roads',
      'Sahakar Nagar / Kattigenahalli off NH44 — mature, leafy',
    ],
    avoidPockets: [
      'SH-9 main road frontage from Rajanukunte to Yelahanka — single-carriageway bottleneck',
      'Low pockets near seasonal water bodies off SH-9',
    ],
    strr: 'STRR Phase 1 alignment runs through SH-9 / Yelahanka–Doddaballapura corridor — direct and significant benefit to Sattva Lumina address. Biggest orbital connectivity upgrade for this property.',
    investVerdict: 'Best entry value. Undervalued vs Thanisandra by 15–20%; STRR re-rating upcoming. Nov 2029 possession = 3.5 yr lock-in; opportunity cost is the main risk. Lowest total cost of ownership on the list.',
    tone: 'success',
  },

  yelahankaNT: {
    label: 'Yelahanka New Town · BDA-planned sector',
    shortName: 'Yelahanka NT',
    shortlistProp: '★ Brigade Eternia (Rank 4 — Mar 2030)',
    maturity: 'Established',
    manyataKm: 15, peakMin: '25–38 min', offPeakMin: '18–24 min', airportMin: '20–25 min',
    psfRange: '₹7,000–10,500', psfMid: 8500, allIn: '~₹2.41 Cr', possession: 'Mar 2030', cagr5yr: '8–10%',
    live: {
      greenery: 9, airQuality: 9, traffic: 8, schools: 9, hospitals: 7,
      retail: 7, walkability: 6, safety: 9, roads: 9, community: 9,
    },
    liveTotal: 0,
    conn: { metro: 4, roadNH: 8, airport: 8, bmtc: 6, lastMile: 6 },
    connTotal: 0,
    social: {
      schools: [
        { name: 'DPS North Bangalore', dist: '~3 km' },
        { name: 'CMR International School', dist: '~2 km' },
        { name: 'Mallya Aditi International', dist: '~5 km' },
        { name: 'Presidency School', dist: '~4 km' },
      ],
      hospitals: [
        { name: 'Aster CMI Yelahanka', dist: '~3 km' },
        { name: 'Narayana Health City', dist: '~12 km' },
        { name: 'Columbia Asia (Hebbal)', dist: '~18 km' },
        { name: 'SPARSH Hospital', dist: '~10 km' },
      ],
      malls: [
        { name: 'Esteem Mall, Yelahanka', dist: '~4 km' },
        { name: 'Growing NH44 F&B corridor', dist: '3–5 km' },
        { name: 'Forum Shantiniketan', dist: '~20 km' },
      ],
      daily: 'Best daily convenience among suburban shortlist areas. Yelahanka NT town centre has D-Mart, local markets, multiple supermarkets, bakeries, and pharmacies all within 2–4 km.',
      water: 'BWSSB direct supply (established BBMP area) — most reliable among suburban options. Confirmed Cauvery water connection for new projects in Yelahanka NT. Sump + borewell backup standard.',
      fAndB: 'Yelahanka town has a decent F&B scene — local favourites, growing chains, and cafés. Not as dense as Manyata/Thanisandra but growing fast on NH44. Suits someone who values local neighbourhood dining over urban nightlife.',
    },
    singleAdult: 7,
    singleNote: 'Comfortable for a single professional who drives. Yelahanka NT town centre covers daily needs. Social scene is more neighbourhood café than urban bar strip. BMTC depot makes it the most public-transport-accessible suburb for occasional no-car days.',
    family: 10,
    familyNote: 'Best overall family area in the shortlist. Widest roads, cleanest air, best school proximity, strong community feel, BBMP-planned layout, BWSSB water, Aster hospital 3 km away. The only gap vs Thanisandra is hospital density (less than 5 hospitals within 5 km).',
    bestPockets: [
      'Yelahanka New Town Sector 1–5 — planned BDA layout, wide roads, mature trees',
      'Near CMR/DPS school belt — high family demand = strong resale liquidity',
      'Brigade Eternia location (behind police station) — central to NT, good approach roads',
    ],
    avoidPockets: [
      'Old Yelahanka town lanes — narrow roads, older drainage infrastructure',
      'Extreme NH44 frontage plots — noise from elevated highway traffic',
    ],
    strr: 'Yelahanka NT is positioned as an STRR interchange suburb — the orbital ring road will significantly boost east-west connectivity and drive fresh demand into the area.',
    investVerdict: 'Most balanced investment on the shortlist. Brigade brand premium (5–8% at resale) + established address + STRR catalyst. Mar 2030 possession adds 4yr lock-in — resolve possession date ambiguity before booking.',
    tone: 'success',
  },

  devanahalli: {
    label: 'Devanahalli / Shettigere · KIADB Aerospace belt',
    shortName: 'Devanahalli',
    shortlistProp: '★ Tata Varnam (Rank 5 — Dec 2029)',
    maturity: 'Emerging',
    manyataKm: 32, peakMin: '60–80 min', offPeakMin: '38–50 min', airportMin: '10–15 min',
    psfRange: '₹5,500–7,500', psfMid: 6400, allIn: '₹1.65–2.04 Cr', possession: 'Dec 2029', cagr5yr: '6–9%',
    live: {
      greenery: 10, airQuality: 10, traffic: 9, schools: 4, hospitals: 3,
      retail: 4, walkability: 2, safety: 8, roads: 8, community: 5,
    },
    liveTotal: 0,
    conn: { metro: 2, roadNH: 7, airport: 10, bmtc: 2, lastMile: 2 },
    connTotal: 0,
    social: {
      schools: [
        { name: 'Ryan International (nearest)', dist: '~25 km' },
        { name: 'Government schools (Devanahalli town)', dist: '~3 km' },
        { name: 'Carnatica township school (in-campus, future)', dist: 'TBC' },
      ],
      hospitals: [
        { name: 'Government District Hospital (Devanahalli)', dist: '~4 km' },
        { name: 'Narayana Health City', dist: '~28 km' },
        { name: 'Columbia Asia (Hebbal)', dist: '~35 km' },
      ],
      malls: [
        { name: 'No mall within 20 km', dist: '—' },
        { name: 'Devanahalli town market (basic)', dist: '~4 km' },
      ],
      daily: 'Very basic. Devanahalli town has standard markets and kirana stores. For quality groceries, weekly supermarket trips to Yelahanka or Doddaballapura (15–20 km) are necessary. Carnatica township will have internal retail at some stage.',
      water: 'Borewell primary in most Devanahalli projects. BWSSB connection is planned but timeline is unclear for the Shettigere / Bagalur belt. Tata Varnam township scale ensures water security via borewell + STP.',
      fAndB: 'Very limited. A few dhabas and local eateries in Devanahalli town. No café culture. Airport lounge is the nearest "good coffee" option. If you value a café to work from, this area will frustrate you.',
    },
    singleAdult: 3,
    singleNote: 'Not suitable for a single professional who values social life, convenience, or urban energy. Isolated location is comfortable only for someone strongly WFH-first or who travels extensively for work (airport 10 min = constant compensation). Daily life requires significant planning and self-sufficiency.',
    family: 4,
    familyNote: 'Not recommended as a primary family home at present. Lack of quality schools and hospitals within 20 km is a serious day-to-day concern. Suitable only if both partners WFH, have school-age children in online/IB school, and don\'t rely on nearby hospitals. Tata Carnatica township will improve this over time.',
    bestPockets: [
      'Inside Tata Varnam / Carnatica township — self-contained; best amenities in area',
      'SH-9 inner lanes with KIADB commercial proximity — future employment catchment',
    ],
    avoidPockets: [
      'Isolated standalone small societies without own water and DG — fully dependent on external infra',
      'Panchayat-layout projects without clear OC/Khata clarity',
    ],
    strr: 'STRR Phase 1 is the single most important future catalyst for Devanahalli. When live (~2027–28), cuts Manyata commute from 60–80 min to potentially 40–50 min. Essential prerequisite for self-use viability.',
    investVerdict: 'Best long-horizon investment (7–10 yr) IF Aerospace SEZ delivers employment. Cheapest entry PSF on the list. Tata brand provides floor. Not for self-use today unless WFH-primary. Rental income will be modest.',
    tone: 'warning',
  },
};

// ── Watch-list pins (same as index.html watch list) — not full-scored ──────

interface WatchPin {
  id: string;
  pin: string;
  project: string;
  builder: string;
  manyataEmbassy: string;
  status: string;
  revisit: string;
}

const WATCHLIST: WatchPin[] = [
  {
    id: 'embassy-manyata',
    pin: 'Manyata / Nagavara',
    project: 'Embassy Manyata Residences',
    builder: 'Embassy Group (A)',
    manyataEmbassy: 'On / adjacent Manyata Tech Park',
    status: 'RERA pending · price TBC',
    revisit: 'Register interest; book only when KRERA registration + all-in ≤ ₹3 Cr confirmed',
  },
  {
    id: 'birla-yelahanka',
    pin: 'Yelahanka (Birla belt)',
    project: 'Birla Yelahanka',
    builder: 'Birla Estates / Aditya Birla (A)',
    manyataEmbassy: '~11–16 km (off-peak dependent)',
    status: 'RERA PRM/KA/RERA/1250/304/PR/190724/002725 · price TBC · 8 ac / 218 homes',
    revisit: 'When launch pricing and sample flat show 3 BHK within budget',
  },
  {
    id: 'mahindra-navaratna',
    pin: 'Navaratna Agrahara',
    project: 'Mahindra North Bangalore',
    builder: 'Mahindra Lifespaces (A)',
    manyataEmbassy: '~12 km from Manyata (per pre-launch copy)',
    status: 'Pre-launch · RERA + price pending',
    revisit: 'When RERA live + possession quarter fits your 5-yr hold model',
  },
  {
    id: 'aerospace-bagalur',
    pin: 'KIADB Aerospace Park · Bagalur',
    project: 'Purva Northern Lights Ph3',
    builder: 'Puravankara (A)',
    manyataEmbassy: 'Manyata peak long; airport ~18–20 min',
    status: 'RERA Mar 2026 · possession Dec 2031 · 3 BHK ~₹1.8–2.1 Cr',
    revisit: 'If Aerospace SEZ Phase 1 employment absorption firms up (2026–27)',
  },
  {
    id: 'ivc-road',
    pin: 'IVC Road corridor',
    project: 'Embassy Springs · Sobha HRC Pristine · Century Ethos (examples)',
    builder: 'Grade A mix',
    manyataEmbassy: 'Typically +10–20 min vs Thanisandra baseline',
    status: 'Mostly villas or >₹3 Cr apartments',
    revisit: 'If budget stretches to ~₹3.5 Cr or villa format acceptable',
  },
];

// ── Compute totals ──────────────────────────────────────────────────────────

(Object.keys(areas) as AreaKey[]).forEach(k => {
  const l = areas[k].live;
  areas[k].liveTotal = l.greenery + l.airQuality + l.traffic + l.schools +
    l.hospitals + l.retail + l.walkability + l.safety + l.roads + l.community;
  const c = areas[k].conn;
  areas[k].connTotal = c.metro + c.roadNH + c.airport + c.bmtc + c.lastMile;
});

const LIVE_FACTORS: [keyof LiveScore, string][] = [
  ['greenery', 'Greenery'], ['airQuality', 'Air quality'], ['traffic', 'Low traffic'],
  ['schools', 'Schools'], ['hospitals', 'Hospitals'], ['retail', 'Retail / dining'],
  ['walkability', 'Walkability'], ['safety', 'Safety'], ['roads', 'Road quality'], ['community', 'Community feel'],
];

const CONN_FACTORS: [keyof ConnScore, string][] = [
  ['metro', 'Metro'], ['roadNH', 'Road / NH'], ['airport', 'Airport'],
  ['bmtc', 'BMTC'], ['lastMile', 'Last-mile'],
];

// ── Component ───────────────────────────────────────────────────────────────

export default function AreasGuide() {
  const [activeArea, setActiveArea] = useCanvasState<AreaKey>('areaKey', 'yelahankaNT');
  const [view, setView]             = useCanvasState<'overview' | 'livability' | 'connectivity' | 'social'>('areaView', 'overview');

  const a = areas[activeArea as AreaKey];
  const areaKeys = Object.keys(areas) as AreaKey[];

  const sortedLive = [...areaKeys].sort((x, y) => areas[y].liveTotal - areas[x].liveTotal);
  const sortedConn = [...areaKeys].sort((x, y) => areas[y].connTotal - areas[x].connTotal);

  return (
    <Stack gap={28} style={{ padding: '24px 28px', maxWidth: 1000 }}>

      {/* ── Header ── */}
      <Stack gap={4}>
        <H1>North BLR — Area Guide</H1>
        <Text tone="secondary">
          5 core micro-markets (visit shortlist) + 5 watch-list pins · livability · connectivity · social infra · suitability · pockets
        </Text>
      </Stack>

      {/* ── Quick stats ── */}
      <Grid columns={5} gap={14}>
        <Stat value={areas[sortedLive[0]].shortName} label="Best livability" tone="success" />
        <Stat value={areas[sortedConn[0]].shortName} label="Best connectivity" tone="success" />
        <Stat value="Yelahanka NT" label="Best for families" tone="info" />
        <Stat value="Thanisandra"  label="Best for single adult" tone="info" />
        <Stat value={`${WATCHLIST.length}`} label="Watch-list pins" tone="warning" />
      </Grid>

      <Divider />

      {/* ── Master comparison table ── */}
      <Stack gap={10}>
        <H2>All-in comparison</H2>
        <Table
          headers={['Area', 'Maturity', 'All-in cost', 'Possession', 'Livability /100', 'Connectivity /50', 'Single /10', 'Family /10']}
          rows={areaKeys.map(k => [
            `${areas[k].shortName}`,
            areas[k].maturity,
            areas[k].allIn,
            areas[k].possession,
            `${areas[k].liveTotal}/100`,
            `${areas[k].connTotal}/50`,
            `${areas[k].singleAdult}/10`,
            `${areas[k].family}/10`,
          ])}
          rowTone={areaKeys.map(k =>
            areas[k].liveTotal >= 80 && areas[k].connTotal >= 32 ? 'success' :
            areas[k].connTotal <= 23 ? 'danger' : undefined
          )}
          striped
        />
      </Stack>

      <Divider />

      {/* ── Livability + connectivity charts ── */}
      <Grid columns={2} gap={16}>
        <Stack gap={8}>
          <H3>Livability total (/100)</H3>
          <BarChart
            categories={sortedLive.map(k => areas[k].shortName)}
            series={[{ name: 'Livability', data: sortedLive.map(k => areas[k].liveTotal) }]}
            height={200}
          />
        </Stack>
        <Stack gap={8}>
          <H3>Connectivity total (/50)</H3>
          <BarChart
            categories={sortedConn.map(k => areas[k].shortName)}
            series={[{ name: 'Connectivity', data: sortedConn.map(k => areas[k].connTotal) }]}
            height={200}
          />
        </Stack>
      </Grid>

      <Divider />

      {/* ── Area selector + view tabs ── */}
      <Stack gap={10}>
        <H2>Area deep dive</H2>

        <Row gap={6} wrap>
          {areaKeys.map(k => (
            <Pill
              key={k}
              active={activeArea === k}
              onClick={() => setActiveArea(k)}
              tone={areas[k].liveTotal >= 80 ? 'success' : areas[k].connTotal <= 23 ? 'warning' : undefined}
            >
              {areas[k].shortName}
            </Pill>
          ))}
        </Row>

        <Row gap={6} wrap>
          {(['overview', 'livability', 'connectivity', 'social'] as const).map(v => (
            <Pill key={v} active={view === v} onClick={() => setView(v)} tone="neutral">
              {v.charAt(0).toUpperCase() + v.slice(1)}
            </Pill>
          ))}
        </Row>

        <Row gap={8} align="center">
          <Text weight="semibold">{a.label}</Text>
          <Pill tone={a.tone} size="sm">{a.maturity}</Pill>
          <Pill tone="success" size="sm">{a.shortlistProp}</Pill>
        </Row>
      </Stack>

      {/* ── Overview tab ── */}
      {view === 'overview' && (
        <Stack gap={14}>
          <Grid columns={4} gap={12}>
            <Stat value={`${a.manyataKm} km`} label="To Manyata" />
            <Stat value={a.peakMin} label="Peak commute" tone={a.manyataKm <= 15 ? 'success' : 'warning'} />
            <Stat value={a.airportMin} label="To Airport KIA" tone={parseInt(a.airportMin) <= 25 ? 'success' : undefined} />
            <Stat value={a.cagr5yr} label="5-yr CAGR" />
          </Grid>

          <Grid columns={2} gap={14}>
            <Card>
              <CardHeader trailing={<Pill tone="success" size="sm">{a.singleAdult}/10</Pill>}>
                Single adult suitability
              </CardHeader>
              <CardBody><Text size="small" tone="secondary">{a.singleNote}</Text></CardBody>
            </Card>
            <Card>
              <CardHeader trailing={<Pill tone="success" size="sm">{a.family}/10</Pill>}>
                Family suitability
              </CardHeader>
              <CardBody><Text size="small" tone="secondary">{a.familyNote}</Text></CardBody>
            </Card>
          </Grid>

          <Grid columns={2} gap={14}>
            <Card>
              <CardHeader trailing={<Pill tone="success" size="sm">Favour</Pill>}>Pockets to prefer</CardHeader>
              <CardBody>
                <Stack gap={4}>
                  {a.bestPockets.map((p: string, i: number) => (
                    <Row key={i} gap={6} style={{ alignItems: 'flex-start' }}>
                      <Text size="small" tone="secondary" style={{ minWidth: 10 }}>+</Text>
                      <Text size="small" tone="secondary">{p}</Text>
                    </Row>
                  ))}
                </Stack>
              </CardBody>
            </Card>
            <Card>
              <CardHeader trailing={<Pill tone="warning" size="sm">Caution</Pill>}>Pockets to scrutinise</CardHeader>
              <CardBody>
                <Stack gap={4}>
                  {a.avoidPockets.map((p: string, i: number) => (
                    <Row key={i} gap={6} style={{ alignItems: 'flex-start' }}>
                      <Text size="small" tone="secondary" style={{ minWidth: 10 }}>−</Text>
                      <Text size="small" tone="secondary">{p}</Text>
                    </Row>
                  ))}
                </Stack>
              </CardBody>
            </Card>
          </Grid>

          <Card>
            <CardHeader trailing={<Pill tone="info" size="sm">STRR</Pill>}>Satellite Town Ring Road impact</CardHeader>
            <CardBody><Text size="small" tone="secondary">{a.strr}</Text></CardBody>
          </Card>

          <Card>
            <CardHeader trailing={<Pill tone="warning" size="sm">Investment</Pill>}>Investment quick verdict</CardHeader>
            <CardBody><Text size="small" tone="secondary">{a.investVerdict}</Text></CardBody>
          </Card>
        </Stack>
      )}

      {/* ── Livability tab ── */}
      {view === 'livability' && (
        <Stack gap={14}>
          <Grid columns={3} gap={12}>
            <Stat value={`${a.liveTotal}/100`} label="Livability total"
              tone={a.liveTotal >= 80 ? 'success' : a.liveTotal >= 65 ? undefined : 'warning'} />
            <Stat value={`${a.live.airQuality}/10`} label="Air quality" tone={a.live.airQuality >= 8 ? 'success' : 'warning'} />
            <Stat value={`${a.live.traffic}/10`} label="Low traffic" tone={a.live.traffic >= 7 ? 'success' : 'warning'} />
          </Grid>

          <Table
            headers={['Factor', 'Score /10', 'Signal']}
            rows={LIVE_FACTORS.map(([key, label]) => [
              label,
              `${a.live[key]}/10`,
              a.live[key] >= 8 ? 'Strength' : a.live[key] <= 4 ? 'Gap' : 'Adequate',
            ])}
            rowTone={LIVE_FACTORS.map(([key]) =>
              a.live[key] >= 8 ? 'success' : a.live[key] <= 4 ? 'danger' : undefined
            )}
            striped
          />

          <Stack gap={8}>
            <H3>Livability radar — {a.shortName}</H3>
            <BarChart
              categories={LIVE_FACTORS.map(([, label]) => label)}
              series={[{ name: a.shortName, data: LIVE_FACTORS.map(([key]) => a.live[key]) }]}
              horizontal
              height={260}
            />
          </Stack>

          <Stack gap={8}>
            <H3>All areas — livability comparison</H3>
            <BarChart
              categories={LIVE_FACTORS.map(([, label]) => label)}
              series={areaKeys.map(k => ({
                name: areas[k].shortName,
                data: LIVE_FACTORS.map(([key]) => areas[k].live[key]),
              }))}
              stacked={false}
              height={280}
            />
          </Stack>
        </Stack>
      )}

      {/* ── Connectivity tab ── */}
      {view === 'connectivity' && (
        <Stack gap={14}>
          <Grid columns={3} gap={12}>
            <Stat value={`${a.connTotal}/50`} label="Connectivity score"
              tone={a.connTotal >= 32 ? 'success' : a.connTotal <= 22 ? 'danger' : undefined} />
            <Stat value={a.peakMin} label="Peak to Manyata" />
            <Stat value={a.airportMin} label="To Airport KIA" tone={parseInt(a.airportMin) <= 25 ? 'success' : 'warning'} />
          </Grid>

          <Table
            headers={['Factor', 'Score /10', 'Signal']}
            rows={CONN_FACTORS.map(([key, label]) => [
              label,
              `${a.conn[key]}/10`,
              a.conn[key] >= 7 ? 'Strong' : a.conn[key] <= 3 ? 'Weak' : 'Moderate',
            ])}
            rowTone={CONN_FACTORS.map(([key]) =>
              a.conn[key] >= 7 ? 'success' : a.conn[key] <= 3 ? 'danger' : undefined
            )}
            striped
          />

          <Card>
            <CardHeader trailing={<Pill tone="info" size="sm">STRR catalyst</Pill>}>
              Future connectivity upgrade
            </CardHeader>
            <CardBody><Text size="small" tone="secondary">{a.strr}</Text></CardBody>
          </Card>

          <Stack gap={8}>
            <H3>Connectivity comparison — all areas</H3>
            <BarChart
              categories={CONN_FACTORS.map(([, label]) => label)}
              series={areaKeys.map(k => ({
                name: areas[k].shortName,
                data: CONN_FACTORS.map(([key]) => areas[k].conn[key]),
              }))}
              stacked={false}
              height={260}
            />
          </Stack>
        </Stack>
      )}

      {/* ── Social tab ── */}
      {view === 'social' && (
        <Stack gap={14}>
          <Grid columns={2} gap={14}>
            <Stack gap={10}>
              <Card>
                <CardHeader trailing={<Pill tone="success" size="sm">Schools</Pill>}>
                  Schools within reach
                </CardHeader>
                <CardBody>
                  <Table
                    headers={['School', 'Distance']}
                    rows={a.social.schools.map(s => [s.name, s.dist])}
                    striped
                  />
                </CardBody>
              </Card>
              <Card>
                <CardHeader trailing={<Pill tone="info" size="sm">Malls / retail</Pill>}>
                  Shopping & dining
                </CardHeader>
                <CardBody>
                  <Stack gap={6}>
                    <Table
                      headers={['Venue', 'Distance']}
                      rows={a.social.malls.map(m => [m.name, m.dist])}
                      striped
                    />
                    <Text size="small" tone="secondary">{a.social.fAndB}</Text>
                  </Stack>
                </CardBody>
              </Card>
            </Stack>
            <Stack gap={10}>
              <Card>
                <CardHeader trailing={<Pill tone="warning" size="sm">Hospitals</Pill>}>
                  Hospitals & clinics
                </CardHeader>
                <CardBody>
                  <Table
                    headers={['Hospital', 'Distance']}
                    rows={a.social.hospitals.map(h => [h.name, h.dist])}
                    striped
                  />
                </CardBody>
              </Card>
              <Card>
                <CardHeader trailing={<Pill tone="info" size="sm">Utilities</Pill>}>
                  Daily essentials & water
                </CardHeader>
                <CardBody>
                  <Stack gap={8}>
                    <Stack gap={3}>
                      <Text size="small" weight="semibold">Daily essentials</Text>
                      <Text size="small" tone="secondary">{a.social.daily}</Text>
                    </Stack>
                    <Stack gap={3}>
                      <Text size="small" weight="semibold">Water supply</Text>
                      <Text size="small" tone="secondary">{a.social.water}</Text>
                    </Stack>
                  </Stack>
                </CardBody>
              </Card>
            </Stack>
          </Grid>
        </Stack>
      )}

      <Divider />

      <Stack gap={12}>
        <H2>Watch list — not visitable yet</H2>
        <Text tone="secondary" size="small">
          Same pins as <Text weight="semibold" as="span">index.html</Text> watch list. No livability/connectivity scores here — use as corridor context and reopen when gates below clear.
        </Text>
        <Table
          headers={['Area pin', 'Project', 'Builder', 'Manyata / Embassy', 'Status', 'Reopen when']}
          rows={WATCHLIST.map(w => [
            w.pin,
            w.project,
            w.builder,
            w.manyataEmbassy,
            w.status,
            w.revisit,
          ])}
          rowTone={WATCHLIST.map(w =>
            w.id === 'aerospace-bagalur' ? 'warning' :
            w.id === 'ivc-road' ? 'warning' : undefined
          )}
          striped
        />
        <Grid columns={2} gap={14}>
          <Card>
            <CardHeader trailing={<Pill tone="info" size="sm">Core vs watch</Pill>}>How to use this section</CardHeader>
            <CardBody>
              <Text size="small" tone="secondary">
                The five pills above are the only micro-markets tied to concrete visit dates and scored tabs. Watch pins are strategic reserves — keep them on radar for repricing, RERA publication, or SEZ news without diluting the visit plan.
              </Text>
            </CardBody>
          </Card>
          <Card>
            <CardHeader trailing={<Pill tone="warning" size="sm">Sync</Pill>}>Source of truth</CardHeader>
            <CardBody>
              <Text size="small" tone="secondary">
                When you change watch-list facts in <Text weight="semibold" as="span">index.html</Text>, update the <Text weight="semibold" as="span">WATCHLIST</Text> rows in this file in the same commit so the canvas and PWA stay aligned.
              </Text>
            </CardBody>
          </Card>
        </Grid>
      </Stack>

    </Stack>
  );
}
