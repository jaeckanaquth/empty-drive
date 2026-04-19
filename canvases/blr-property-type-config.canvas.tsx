import {
  BarChart,
  Card, CardBody, CardHeader,
  Divider, Grid, H1, H2, H3,
  Pill, Row, Stack, Stat, Table, Text,
  useCanvasState,
} from 'cursor/canvas';

// ── Criterion 4 — Property Specifications ─────────────────────────────────
// Covers: UC vs RTM decision · per-property specs comparison · loading factor
//         BHK config · floor selection · orientation · WFH checklist

type Tab = 'decision' | 'properties' | 'format' | 'sizing' | 'unit';

// ── Per-property specs ──────────────────────────────────────────────────────

interface PropSpec {
  rank: number;
  name: string;
  shortName: string;
  builder: string;
  config: string;
  sbaRange: string;
  sbaMin: number;
  sbaMax: number;
  loadingPct: string;
  loadingMid: number;   // for carpet calc
  carpetEst: string;    // derived
  rera: string;
  towers: string;
  units: string;
  possession: string;
  allIn: string;
  psfBase: number;      // for chart
  floorAvail: string;
  facingOptions: string;
  wfhSuitability: number;   // 1–10
  wfhNote: string;
  specsScore: number;       // 1–10
  specsTone: 'success' | 'warning' | 'info';
  differentiator: string;
  watchPoints: string[];
}

const PROPS: PropSpec[] = [
  {
    rank: 1, name: 'Purva Zenium 2', shortName: 'Purva',
    builder: 'Puravankara', config: '3 BHK (2 BHK also avail)',
    sbaRange: '1,231–1,710 sqft', sbaMin: 1231, sbaMax: 1710, loadingPct: '~25–28%', loadingMid: 27,
    carpetEst: '~900–1,248 sqft',
    rera: 'PRM/KA/RERA/1251/309/PR/071022/005303',
    towers: 'Multiple towers, mid-rise', units: '~500+ units',
    possession: 'Jun 2027', allIn: '₹1.82–2.53 Cr', psfBase: 8200,
    floorAvail: 'Full range — choose early for best floor',
    facingOptions: 'N / NE / E available — confirm at site visit',
    wfhSuitability: 8, wfhNote: 'Puravankara floor plans typically carve out a distinct 3rd room. BluNex smart-home (app lock, digital access) is a WFH-relevant differentiator. Confirm WFH room size ≥140 sqft from RERA plan.',
    specsScore: 8, specsTone: 'success',
    differentiator: 'BluNex smart home + earliest possession (Jun 2027) + RERA clean since Oct 2022',
    watchPoints: [
      'Jun 2027 possession = UC construction currently in mid-phase; verify % complete on RERA portal',
      'Ask for exact RERA carpet area of 3 BHK 1,500+ sqft variant — not all floor plans are the same',
      'Ensure the floor plan shows WFH room NOT adjacent to elevator shaft',
    ],
  },
  {
    rank: 2, name: 'Prestige Avon', shortName: 'Prestige',
    builder: 'Prestige Group', config: '3 BHK',
    sbaRange: 'TBC — confirm at visit (Aug 2025 launch)', sbaMin: 1400, sbaMax: 1800, loadingPct: '~27–30%', loadingMid: 28,
    carpetEst: '~1,008–1,296 sqft (est.)',
    rera: 'Verify at sales office — Aug 2025 launch',
    towers: 'Boutique — 230 units on 10 acres', units: '230 units',
    possession: 'Dec 2028', allIn: '~₹3.41 Cr', psfBase: 9500,
    floorAvail: 'Lower floor units available in boutique layout',
    facingOptions: 'Verify at visit — smaller site may limit facing options',
    wfhSuitability: 7, wfhNote: 'Prestige floor plans are well-designed but boutique 230-unit project means limited floor plan variety. Confirm a dedicated 3rd room ≥140 sqft exists and is not a convertible study alcove.',
    specsScore: 7, specsTone: 'warning',
    differentiator: 'Prestige brand premium; boutique scale = less crowded, better community feel',
    watchPoints: [
      'All-in ~₹3.41 Cr is 14% over ₹3 Cr ceiling — negotiate hard for compact/lower-floor unit',
      'RERA number not confirmed — do not pay any booking amount without verifying on krera.karnataka.gov.in',
      'New Aug 2025 launch = very low construction % — highest builder-risk period on the list',
    ],
  },
  {
    rank: 3, name: 'Sattva Lumina', shortName: 'Sattva',
    builder: 'Salarpuria Sattva', config: '3 BHK (Standard + Grand variants)',
    sbaRange: '1,450–1,780 sqft', sbaMin: 1450, sbaMax: 1780, loadingPct: '~28–32%', loadingMid: 30,
    carpetEst: '~1,015–1,246 sqft',
    rera: 'PR/060924/007009',
    towers: '8 towers G+29 (30 floors)', units: '~1,200+ units',
    possession: 'Nov 2029', allIn: '₹1.62–1.87 Cr', psfBase: 7000,
    floorAvail: '8 towers × 30 floors = wide choice; mid-high floors (12–20) ideal',
    facingOptions: 'Large site footprint — N/E/NE available in multiple towers',
    wfhSuitability: 8, wfhNote: 'Grand 3 BHK (1,600+ sqft SBA) has strong room proportions. Township scale ensures fiber ducting, DG backup, and stable utilities — all WFH-critical. Verify actual WFH room size in floor plan before committing.',
    specsScore: 8, specsTone: 'success',
    differentiator: 'Best carpet area per rupee; 12.8 acres, 3 clubhouses; 30-floor towers = wide floor choice',
    watchPoints: [
      'Nov 2029 possession = 3.5 yr wait — longest rent burn period on the list',
      'Large 1,200+ unit project: confirm which tower you\'re buying in; outer towers have better views and less crowd',
      'Sattva loading can exceed 30% in large township corridors; insist on RERA carpet cert',
    ],
  },
  {
    rank: 4, name: 'Brigade Eternia', shortName: 'Brigade',
    builder: 'Brigade Group', config: '3 BHK (3 BHK + 4 BHK avail)',
    sbaRange: '1,620–1,820 sqft', sbaMin: 1620, sbaMax: 1820, loadingPct: '~28–32%', loadingMid: 30,
    carpetEst: '~1,134–1,274 sqft',
    rera: 'PRM/KA/RERA/1251/309/PR/070325/007559',
    towers: '14 acres, 1,124 units, multiple towers', units: '1,124 units',
    possession: 'Mar 2030', allIn: '~₹2.41 Cr', psfBase: 8500,
    floorAvail: 'Multiple towers; wide floor choice; early booking = better selection',
    facingOptions: 'BDA-planned site: good road frontage all sides; NE facing available',
    wfhSuitability: 9, wfhNote: 'Largest SBA range on budget — 1,620+ sqft gives genuine WFH room ≥160 sqft. Brigade\'s BDA-area site in Yelahanka NT guarantees wider roads, better external environment for a WFH lifestyle. Floor plan quality is typically strong for Brigade.',
    specsScore: 9, specsTone: 'success',
    differentiator: 'Largest 3 BHK SBA at ₹2.4 Cr; BDA-planned address; Brigade brand resale premium ~5–8%',
    watchPoints: [
      'Mar 2030 possession date: verify this is fixed and not a soft estimate — Brigade has occasionally slipped',
      'At 1,124 units, pick your tower location carefully; corner units in perimeter towers have best cross-ventilation',
      'Confirm the 3 BHK floor plan you are booking — not all 3 BHK variants have the same room proportions',
    ],
  },
  {
    rank: 5, name: 'Tata Varnam', shortName: 'Tata',
    builder: 'Tata Housing', config: '3 BHK (2 BHK also avail)',
    sbaRange: '1,681–2,061 sqft', sbaMin: 1681, sbaMax: 2061, loadingPct: '~22–26%', loadingMid: 24,
    carpetEst: '~1,278–1,566 sqft',
    rera: 'PR/110825/007988',
    towers: '70 acres within 135-acre Carnatica township', units: 'Large — verify at visit',
    possession: 'Dec 2029', allIn: '₹1.65–2.04 Cr', psfBase: 6400,
    floorAvail: 'Township scale — full floor/tower choice; visit during week to assess crowd density',
    facingOptions: 'Large 70-acre site: all orientations available; NE easily secured',
    wfhSuitability: 8, wfhNote: 'Best raw sqft per rupee — 1,681 sqft SBA at 24% loading gives ~1,278 sqft carpet. Rooms are genuinely spacious. Tata\'s construction quality means room dimensions are accurate. Main WFH concern is the long commute on office days (60–80 min peak).',
    specsScore: 9, specsTone: 'success',
    differentiator: 'Lowest loading factor (~22–26%); most carpet area per SBA; Tata quality = dimensions match brochure',
    watchPoints: [
      'Aug 2025 RERA launch = very early stage; verify construction % before committing any amount',
      'Devanahalli commute: if you move here, your 2–3 office days become 2 hr round trips; plan honestly',
      'Township is so large that a large portion of units face internal areas — verify your tower has external facing',
    ],
  },
];

// ── format & 5-year exit data ───────────────────────────────────────────────

interface FormatRow {
  format: string;
  budget3cr: string;
  northBlrAvail: string;
  density: string;
  appreciation5yr: string;
  rentalYield: string;
  exitLiquidity: string;
  exitPool: string;
  tone: 'success' | 'warning' | 'info' | 'danger';
  verdict: string;
}

const FORMATS: FormatRow[] = [
  {
    format: 'Independent Villa',
    budget3cr: '~1,200–1,500 sqft BUA on 1,200–1,500 sqft plot. Very basic construction at this price.',
    northBlrAvail: 'Rare below ₹3 Cr — mostly IVC Road, Devanahalli outskirts. No Grade A builder in this segment.',
    density: 'N/A — standalone',
    appreciation5yr: 'High on paper (land component), but at ₹3 Cr you are buying land + shed, not a quality villa',
    rentalYield: '~1.5–2.5% — hard to rent a standalone villa; tenant maintenance issues',
    exitLiquidity: 'Low',
    exitPool: 'Narrow: only villa-seeking buyers with ₹3–4 Cr budget in Devanahalli/IVC Road — thin pool',
    tone: 'danger',
    verdict: 'Skip. ₹3 Cr does not buy a quality villa in North BLR. You get land with basic construction. Poor rental yield and thin exit pool.',
  },
  {
    format: 'Row House / Villa in Gated Community',
    budget3cr: '~1,800–2,200 sqft BUA, shared wall. Some in Devanahalli; prestige/embassy projects on IVC Road are ₹4–6 Cr.',
    northBlrAvail: 'Limited at ₹3 Cr. SOBHA HRC Pristine, Century Ethos on IVC Road are ₹4 Cr+. Devanahalli row houses exist.',
    density: 'Very low (20–80 units per community)',
    appreciation5yr: 'Good — land component + brand name. IVC Road gated communities show 10–13% CAGR historically.',
    rentalYield: '~2–3% — lower than apartments; harder to manage remotely',
    exitLiquidity: 'Moderate',
    exitPool: 'Specific buyer — wants ground living, car-park convenience, private garden. Smaller but motivated segment.',
    tone: 'warning',
    verdict: 'Revisit if budget stretches to ₹3.5 Cr+ or villa format is non-negotiable. At exactly ₹3 Cr, apartment gives better value and liquidity.',
  },
  {
    format: 'Plotted Development (bare plot)',
    budget3cr: '~40×60 ft (2,400 sqft) in Devanahalli / Bagalur area. No construction = no rent.',
    northBlrAvail: 'Available — KIADB allotments, BDA auctioned plots, private layouts in Bagalur / Nandi Hills belt.',
    density: 'N/A',
    appreciation5yr: 'Speculative — highest ceiling (15–20% if Aerospace SEZ delivers), lowest floor (5% if it doesn\'t)',
    rentalYield: 'Zero — cannot rent a bare plot',
    exitLiquidity: 'Moderate',
    exitPool: 'Builder / developer buying to construct, or plot investor. Limited pool but transactions do happen.',
    tone: 'danger',
    verdict: 'Not for this profile. Zero rental income for 5 years, speculative exit depends on SEZ timing. Works only if you plan to construct.',
  },
  {
    format: 'Boutique Apartment (50–250 units)',
    budget3cr: '1,400–1,800 sqft SBA, 3 BHK in a well-maintained low-density society.',
    northBlrAvail: 'Prestige Avon (230 units), some Sobha boutique projects. Limited supply = scarcity premium.',
    density: 'Low-medium (50–250 units)',
    appreciation5yr: 'Good — scarcity premium + brand. 8–11% CAGR in Thanisandra zone.',
    rentalYield: '~2.5–3.5% — premium tenant profile; easier single-tenant management',
    exitLiquidity: 'Moderate-High',
    exitPool: 'Quality buyer who values exclusivity; slightly premium price at exit vs large township.',
    tone: 'info',
    verdict: 'Good choice IF you can tolerate over-budget (Prestige Avon at ₹3.4 Cr). Premium exit and rental quality. Thin floor plan options are the main risk.',
  },
  {
    format: 'Mid Township Apartment (300–800 units)',
    budget3cr: '1,500–1,820 sqft SBA, 3 BHK with full amenities.',
    northBlrAvail: 'Purva Zenium 2 (~500 units). Strong representation in North BLR.',
    density: 'Medium (300–800 units)',
    appreciation5yr: 'Best balance — 8–11% CAGR. Not oversupplied at exit, enough transactions for price discovery.',
    rentalYield: '~3–3.5% — strong tenant demand; easy to find replacement tenant quickly',
    exitLiquidity: 'High',
    exitPool: 'Broad — IT professionals, families, investors. Most liquid segment in North BLR resale.',
    tone: 'success',
    verdict: 'Best format for a 5-year hold at ₹3 Cr. Right balance of appreciation, rental income, and exit liquidity. Purva Zenium 2 is in this band.',
  },
  {
    format: 'Large Township Apartment (1,000+ units)',
    budget3cr: '1,600–2,061 sqft SBA, 3 BHK with premium amenities and campus-scale infrastructure.',
    northBlrAvail: 'Sattva Lumina (1,200+), Brigade Eternia (1,124), Tata Carnatica (large). The dominant format in North BLR.',
    density: 'High (1,000–3,000+ units)',
    appreciation5yr: 'Good — project creates its own micro-market. STRR/metro re-rating lifts all units together.',
    rentalYield: '~3–4% — deepest rental pool; always a tenant available',
    exitLiquidity: 'Highest',
    exitPool: 'Largest buyer pool — comparable transactions happening constantly. Easy for buyer to get a home loan (many bank-approved projects).',
    tone: 'success',
    verdict: 'Best exit liquidity on the list. Slight supply pressure (many similar units at exit) is offset by deepest buyer pool. Sattva/Brigade/Tata all fall here — strong 5-yr exit.',
  },
];

// ── 5-year exit profile per shortlisted property ────────────────────────────

const EXIT_PROFILES = [
  {
    rank: 1, name: 'Purva Zenium 2', shortName: 'Purva',
    exitYear: '~2032 (Jun 2027 + 5 yr)',
    format: 'Mid township (~500 units)',
    density: 'Medium',
    exitScore: 8,
    exitTone: 'success' as const,
    appreciation5yr: '8–10% CAGR → ~₹2.8–3.7 Cr on ₹1.82–2.53 Cr entry',
    rentalYrs: '~3 yrs pre-exit (from Jun 2027)',
    rentalIncome: '~₹10–12L cumulative rental',
    exitBuyer: 'IT professional moving to Airport Road belt for airport access; working at KIADB Aerospace tenant companies (long-term)',
    catalyst: 'STRR completion (~2028) → Airport Road connectivity boost → demand surge from logistics/aerospace workers',
    risk: 'Area still maturing in 2032; lower exit price ceiling vs Thanisandra',
    verdict: 'Good 5-yr exit. Earliest possession = most rental income before exit. Best short-hold option on the list.',
    verdictTone: 'success' as const,
  },
  {
    rank: 2, name: 'Prestige Avon', shortName: 'Prestige',
    exitYear: '~2034 (Dec 2028 + 5 yr)',
    format: 'Boutique (~230 units)',
    density: 'Low',
    exitScore: 7,
    exitTone: 'info' as const,
    appreciation5yr: '10–12% CAGR → ~₹3.8–4.2 Cr from ~₹3.41 Cr entry',
    rentalYrs: '~5 yrs (from Dec 2028)',
    rentalIncome: '~₹16–20L cumulative rental',
    exitBuyer: 'Quality buyer in Thanisandra — young family from Manyata/Hebbal corridor wanting a premium boutique society',
    catalyst: 'Thanisandra Metro Phase 2B (~2031) → direct lift to rental and capital values',
    risk: 'Entry over ₹3 Cr limits your appreciation in % terms; boutique means few comparable sales = harder to price exit',
    verdict: 'Decent exit if you negotiate entry under ₹3 Cr. Metro catalyst is real. But limited upside from a ₹3.4 Cr entry.',
    verdictTone: 'warning' as const,
  },
  {
    rank: 3, name: 'Sattva Lumina', shortName: 'Sattva',
    exitYear: '~2034 (Nov 2029 + 5 yr)',
    format: 'Large township (1,200+ units)',
    density: 'High',
    exitScore: 9,
    exitTone: 'success' as const,
    appreciation5yr: '9–12% CAGR → ~₹2.5–3.0 Cr from ₹1.62–1.87 Cr entry',
    rentalYrs: '~5 yrs (from Nov 2029)',
    rentalIncome: '~₹18–22L cumulative rental',
    exitBuyer: 'IT professional/family in Yelahanka belt who wants Grade A amenities at the best price per sqft',
    catalyst: 'STRR re-rating for SH-9 belt; Yelahanka maturing into a full-service suburb by 2032–34',
    risk: '1,200+ units = most supply at exit in same project; many identical units competing; must price correctly',
    verdict: 'Best 5-yr appreciation upside. Lowest entry + STRR catalyst = highest % gain. Supply pressure at exit is manageable with right pricing.',
    verdictTone: 'success' as const,
  },
  {
    rank: 4, name: 'Brigade Eternia', shortName: 'Brigade',
    exitYear: '~2035 (Mar 2030 + 5 yr)',
    format: 'Large township (1,124 units)',
    density: 'High',
    exitScore: 9,
    exitTone: 'success' as const,
    appreciation5yr: '8–10% CAGR → ~₹3.5–4.0 Cr from ₹2.41 Cr entry',
    rentalYrs: '~5 yrs (from Mar 2030)',
    rentalIncome: '~₹17–21L cumulative rental',
    exitBuyer: 'Family buyer in Yelahanka NT — BDA-planned address with wide roads, established schools, and Brigade brand = most trusted address on the list',
    catalyst: 'STRR + Yelahanka NT already mature = double-effect: infrastructure + established social infra',
    risk: 'Mar 2030 possession risk — any delay pushes exit to 2036+; lock-in is long',
    verdict: 'Best exit quality. BDA address + Brigade brand = most liquid resale on the list. Most reliable outcome if you can wait for 2030.',
    verdictTone: 'success' as const,
  },
  {
    rank: 5, name: 'Tata Varnam', shortName: 'Tata',
    exitYear: '~2034 (Dec 2029 + 5 yr)',
    format: 'Mega township (70 acres / 135-acre Carnatica)',
    density: 'High',
    exitScore: 7,
    exitTone: 'warning' as const,
    appreciation5yr: '6–9% CAGR → ~₹2.3–2.9 Cr from ₹1.65–2.04 Cr entry',
    rentalYrs: '~5 yrs (from Dec 2029)',
    rentalIncome: '~₹12–16L cumulative rental (lower due to Devanahalli location)',
    exitBuyer: 'Airport-adjacent buyer — aviation/aerospace professional or someone who flies every week. Narrow profile but growing as KIAL expands.',
    catalyst: 'Aerospace SEZ Phase 1 employment materialising (highest upside) or STRR completing (base case)',
    risk: 'Devanahalli location is the constraint — if Aerospace SEZ delays, exit buyer pool stays thin; commute concern drives away mainstream IT buyers',
    verdict: 'Best sqft per rupee, but 5-yr exit depends on Aerospace SEZ which is not yet confirmed. Safest if you self-use; riskier as pure investment exit.',
    verdictTone: 'warning' as const,
  },
];

// ── loading factor ──────────────────────────────────────────────────────────

function carpetFromSBA(sba: number, loadingPct: number): number {
  return Math.round(sba * (1 - loadingPct / 100));
}

// ── floor guide ─────────────────────────────────────────────────────────────

const FLOORS = [
  { range: 'G / 1F', verdict: 'Avoid', tone: 'danger' as const, note: 'Security concerns for single adult; street noise; pests; limited light' },
  { range: '2F – 4F', verdict: 'Acceptable', tone: 'warning' as const, note: 'Faster emergency exit; cheaper; limited view and ventilation' },
  { range: '5F – 12F', verdict: 'Best', tone: 'success' as const, note: 'Sweet spot — good light, ventilation, view; reasonable elevator wait' },
  { range: '13F – 20F', verdict: 'Good', tone: 'success' as const, note: 'Better views and air; minor premium; longer elevator wait' },
  { range: '21F – top−1', verdict: 'Caution', tone: 'warning' as const, note: 'Great views; heat in summer; heavy elevator dependency; premium pricing' },
  { range: 'Top floor', verdict: 'Avoid', tone: 'danger' as const, note: 'Monsoon leakage risk; summer heat; no construction above; hardest to sell' },
];

// ── WFH checklist ────────────────────────────────────────────────────────────

const WFH_CHECKS = [
  ['WFH room size', 'Min 140–160 sqft — fits L-desk + monitor + chair + storage + shelf', 'Critical'],
  ['WFH room facing', 'North or East — no afternoon sun glare on monitor', 'Critical'],
  ['Power backup', 'Full building DG or inverter provision for WFH room circuit', 'Critical'],
  ['Internet infra', 'Fiber-ready (Jio/ACT/Airtel FTH ducting confirmed in building)', 'Critical'],
  ['Room isolation', 'WFH room NOT adjacent to elevator shaft or common corridor', 'High'],
  ['Ventilation', 'Openable window in WFH room — not just glass + AC', 'High'],
  ['BR separation', 'WFH room wall NOT shared with master BR — sleep quality', 'High'],
  ['Balcony', 'At least one large balcony (≥60 sqft) — break space during WFH day', 'Medium'],
  ['Kitchen access', 'Open kitchen or quick walk — you cook on WFH days', 'Medium'],
  ['Guest separation', 'Guest BR on different wing from WFH — privacy when hosting parents', 'Medium'],
];

// ── Component ────────────────────────────────────────────────────────────────

export default function PropertySpecs() {
  const [tab, setTab]     = useCanvasState<Tab>('specsTab', 'properties');
  const [sba, setSba]     = useCanvasState<number>('sba', 1700);
  const [propIdx, setPropIdx] = useCanvasState<number>('specsProp', 0);

  const sbaOptions = [1400, 1500, 1600, 1700, 1800, 1900, 2000];
  const loadingScenarios = [
    { pct: 24, label: 'Tata (24%)',         tone: 'success' as const },
    { pct: 27, label: 'Puravankara (27%)',  tone: 'success' as const },
    { pct: 29, label: 'Prestige (29%)',     tone: 'success' as const },
    { pct: 31, label: 'Sattva/Brigade (31%)', tone: 'warning' as const },
    { pct: 35, label: 'Poor project (35%)', tone: 'danger' as const },
  ];

  const activeProp = PROPS[propIdx as number] ?? PROPS[0];

  return (
    <Stack gap={28} style={{ padding: '24px 28px', maxWidth: 1000 }}>

      {/* ── Header ── */}
      <Stack gap={4}>
        <H1>Criterion 4 — Property Specifications</H1>
        <Text tone="secondary">
          5 shortlisted properties · UC Grade A only · ₹3 Cr ceiling · 3 BHK WFH-optimised setup
        </Text>
      </Stack>

      {/* ── Summary stats ── */}
      <Grid columns={4} gap={14}>
        <Stat value="UC · Grade A" label="Strategy" tone="info" />
        <Stat value="3 BHK" label="Target config" tone="success" />
        <Stat value="5F – 12F" label="Floor sweet spot" tone="info" />
        <Stat value="N / NE / E" label="WFH room facing" tone="success" />
      </Grid>

      <Divider />

      {/* ── Tab nav ── */}
      <Row gap={6} wrap>
        <Pill active={tab === 'properties'} onClick={() => setTab('properties')}>Shortlisted properties</Pill>
        <Pill active={tab === 'format'}     onClick={() => setTab('format')}>Format & 5-yr exit</Pill>
        <Pill active={tab === 'decision'}   onClick={() => setTab('decision')}>UC vs RTM decision</Pill>
        <Pill active={tab === 'sizing'}     onClick={() => setTab('sizing')}>Sizing & loading</Pill>
        <Pill active={tab === 'unit'}       onClick={() => setTab('unit')}>Unit selection</Pill>
      </Row>

      {/* ══════════════════════════════════════════════════════════════════════
          TAB 1 — SHORTLISTED PROPERTIES
      ══════════════════════════════════════════════════════════════════════ */}
      {tab === 'properties' && (
        <Stack gap={20}>

          {/* Overview comparison table */}
          <Stack gap={10}>
            <H2>Specifications at a glance</H2>
            <Table
              headers={['#', 'Property', 'Config', 'SBA range', 'Loading', 'Est. carpet', 'Possession', 'Specs /10']}
              rows={PROPS.map(p => [
                `${p.rank}`,
                `${p.shortName} — ${p.builder}`,
                p.config,
                p.sbaRange,
                p.loadingPct,
                p.carpetEst,
                p.possession,
                `${p.specsScore}/10`,
              ])}
              rowTone={PROPS.map(p => p.specsTone)}
              striped
            />
          </Stack>

          {/* RERA + units table */}
          <Stack gap={10}>
            <H2>RERA registration & scale</H2>
            <Table
              headers={['Property', 'RERA number', 'Towers / scale', 'Units', 'Floor availability']}
              rows={PROPS.map(p => [
                p.shortName,
                p.rera,
                p.towers,
                p.units,
                p.floorAvail,
              ])}
              striped
            />
            <Text size="small" tone="secondary">
              Verify all RERA numbers at krera.karnataka.gov.in before paying any booking amount. Check construction percentage matches site progress.
            </Text>
          </Stack>

          {/* Property deep-dive selector */}
          <Stack gap={10}>
            <H2>Property deep dive</H2>
            <Row gap={6} wrap>
              {PROPS.map((p, i) => (
                <Pill
                  key={p.id}
                  active={propIdx === i}
                  onClick={() => setPropIdx(i)}
                  tone={p.specsTone}
                >
                  {p.shortName}
                </Pill>
              ))}
            </Row>

            <Grid columns={3} gap={12}>
              <Stat value={activeProp.sbaRange} label="SBA range" />
              <Stat value={activeProp.carpetEst} label="Est. carpet area" tone="success" />
              <Stat value={activeProp.loadingPct} label="Loading factor"
                tone={activeProp.loadingMid <= 28 ? 'success' : 'warning'} />
            </Grid>

            <Grid columns={2} gap={14}>
              <Card>
                <CardHeader trailing={<Pill tone={activeProp.specsTone} size="sm">Rank {activeProp.rank}</Pill>}>
                  {activeProp.name} — key specs
                </CardHeader>
                <CardBody>
                  <Table
                    headers={['Attribute', 'Detail']}
                    rows={[
                      ['Builder', activeProp.builder],
                      ['Configuration', activeProp.config],
                      ['SBA range', activeProp.sbaRange],
                      ['Loading factor', activeProp.loadingPct],
                      ['Estimated carpet', activeProp.carpetEst],
                      ['RERA', activeProp.rera],
                      ['Towers / scale', activeProp.towers],
                      ['Units', activeProp.units],
                      ['Possession', activeProp.possession],
                      ['All-in cost', activeProp.allIn],
                      ['Facing available', activeProp.facingOptions],
                    ]}
                    striped
                  />
                </CardBody>
              </Card>

              <Stack gap={14}>
                <Card>
                  <CardHeader trailing={<Pill tone="success" size="sm">{activeProp.wfhSuitability}/10</Pill>}>
                    WFH suitability
                  </CardHeader>
                  <CardBody>
                    <Text size="small" tone="secondary">{activeProp.wfhNote}</Text>
                  </CardBody>
                </Card>

                <Card>
                  <CardHeader trailing={<Pill tone="success" size="sm">Differentiator</Pill>}>
                    What makes this stand out
                  </CardHeader>
                  <CardBody>
                    <Text size="small" tone="secondary">{activeProp.differentiator}</Text>
                  </CardBody>
                </Card>

                <Card>
                  <CardHeader trailing={<Pill tone="warning" size="sm">Watch</Pill>}>
                    Spec points to verify on visit
                  </CardHeader>
                  <CardBody>
                    <Stack gap={5}>
                      {activeProp.watchPoints.map((w: string, i: number) => (
                        <Row key={i} gap={6} style={{ alignItems: 'flex-start' }}>
                          <Text size="small" tone="secondary" style={{ minWidth: 12 }}>!</Text>
                          <Text size="small" tone="secondary">{w}</Text>
                        </Row>
                      ))}
                    </Stack>
                  </CardBody>
                </Card>
              </Stack>
            </Grid>
          </Stack>

          {/* WFH score bar chart */}
          <Stack gap={8}>
            <H3>WFH suitability — all properties</H3>
            <BarChart
              categories={PROPS.map(p => p.shortName)}
              series={[{ name: 'WFH suitability /10', data: PROPS.map(p => p.wfhSuitability) }]}
              height={180}
            />
          </Stack>

        </Stack>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          TAB — FORMAT & 5-YEAR EXIT
      ══════════════════════════════════════════════════════════════════════ */}
      {tab === 'format' && (
        <Stack gap={20}>

          {/* Quick verdict */}
          <Card>
            <CardHeader trailing={<Pill tone="success" size="sm">~5-yr hold · ₹3 Cr</Pill>}>
              Format verdict for your profile
            </CardHeader>
            <CardBody>
              <Stack gap={6}>
                <Text size="small">
                  <Text size="small" weight="semibold">Villa / row house</Text> — ₹3 Cr does not buy a quality villa in North BLR. You get a small plot + basic construction with low rental yield and thin exit pool. Skip unless budget reaches ₹3.5 Cr+ and IVC Road specifically.
                </Text>
                <Text size="small">
                  <Text size="small" weight="semibold">Apartment — mid township (300–800 units)</Text> — best balance of appreciation, rental income, and exit liquidity for 5 years. Large enough for strong tenant demand; not so large that exit is crowded.
                </Text>
                <Text size="small">
                  <Text size="small" weight="semibold">Apartment — large township (1,000+ units)</Text> — deepest exit liquidity (always comparable sales, always tenants). Slight supply pressure at exit is offset by largest buyer pool. Sattva/Brigade/Tata are all here — very strong 5-yr exit.
                </Text>
                <Text size="small" tone="secondary">
                  Bottom line: Apartment in a Grade A township of 300–1,500 units is the optimal format. The exact density tier matters less than: entry price, builder quality, area trajectory, and STRR/metro catalyst timing.
                </Text>
              </Stack>
            </CardBody>
          </Card>

          {/* Format comparison table */}
          <Stack gap={10}>
            <H2>Property format comparison at ₹3 Cr — North BLR</H2>
            <Table
              headers={['Format', 'What ₹3 Cr buys', 'Density', '5-yr appreciation', 'Rental yield', 'Exit liquidity', 'Verdict']}
              rows={FORMATS.map(f => [
                f.format,
                f.budget3cr,
                f.density,
                f.appreciation5yr,
                f.rentalYield,
                f.exitLiquidity,
                f.verdict,
              ])}
              rowTone={FORMATS.map(f => f.tone)}
              striped
            />
          </Stack>

          <Divider />

          {/* Community density impact */}
          <Stack gap={10}>
            <H2>Community density — how it affects your 5-year exit</H2>
            <Grid columns={3} gap={14}>
              <Card>
                <CardHeader trailing={<Pill tone="danger" size="sm">Low density</Pill>}>
                  Boutique (&lt;250 units)
                </CardHeader>
                <CardBody>
                  <Stack gap={6}>
                    <Text size="small" weight="semibold">Appreciation</Text>
                    <Text size="small" tone="secondary">Scarcity premium — few comparable units = seller has pricing power. But thin transaction history makes valuation hard for buyer's bank.</Text>
                    <Text size="small" weight="semibold">Exit challenge</Text>
                    <Text size="small" tone="secondary">Fewer comparable sales → banks sometimes offer lower LTV on boutique projects → buyer needs more own funds → smaller buyer pool.</Text>
                    <Text size="small" weight="semibold">Best for</Text>
                    <Text size="small" tone="secondary">Prestige Avon (230 units, Thanisandra). Brand compensates for thin liquidity. Thanisandra's deep market is the backstop.</Text>
                  </Stack>
                </CardBody>
              </Card>

              <Card>
                <CardHeader trailing={<Pill tone="success" size="sm">Mid density</Pill>}>
                  Mid township (300–800 units)
                </CardHeader>
                <CardBody>
                  <Stack gap={6}>
                    <Text size="small" weight="semibold">Appreciation</Text>
                    <Text size="small" tone="secondary">Strong — enough transactions for price discovery without competing against 500+ identical units. Builder's unsold inventory is gone by year 2–3, so resale price floats freely.</Text>
                    <Text size="small" weight="semibold">Exit advantage</Text>
                    <Text size="small" tone="secondary">Well-known project, bank-approved, active society = fastest transaction closure. Tenant pool is large relative to units available.</Text>
                    <Text size="small" weight="semibold">Best for</Text>
                    <Text size="small" tone="secondary">Purva Zenium 2 (~500 units, Hosahalli). Optimal density for a 5-yr hold and clean exit.</Text>
                  </Stack>
                </CardBody>
              </Card>

              <Card>
                <CardHeader trailing={<Pill tone="info" size="sm">High density</Pill>}>
                  Large township (1,000+ units)
                </CardHeader>
                <CardBody>
                  <Stack gap={6}>
                    <Text size="small" weight="semibold">Appreciation</Text>
                    <Text size="small" tone="secondary">Project sets micro-market price benchmark. When infrastructure arrives (STRR, metro), all units in the project re-rate together — big catalyst uplift possible.</Text>
                    <Text size="small" weight="semibold">Exit challenge</Text>
                    <Text size="small" tone="secondary">Many similar units competing at exit. Differentiate with floor, facing, and condition. Price correctly — buyers have many options within the same project.</Text>
                    <Text size="small" weight="semibold">Best for</Text>
                    <Text size="small" tone="secondary">Sattva (1,200+), Brigade (1,124), Tata (large). Deepest rental pool and most liquid resale. Best for investor exit.</Text>
                  </Stack>
                </CardBody>
              </Card>
            </Grid>
          </Stack>

          <Divider />

          {/* 5-year exit profiles per property */}
          <Stack gap={10}>
            <H2>5-year exit profile — shortlisted properties</H2>
            <Table
              headers={['#', 'Property', 'Format', 'Exit year', '5-yr appreciation', 'Rental income', 'Exit buyer', 'Exit score']}
              rows={EXIT_PROFILES.map(p => [
                `${p.rank}`,
                p.shortName,
                p.format,
                p.exitYear,
                p.appreciation5yr,
                p.rentalIncome,
                p.exitBuyer,
                `${p.exitScore}/10`,
              ])}
              rowTone={EXIT_PROFILES.map(p => p.exitTone)}
              striped
            />
          </Stack>

          {/* Exit catalyst table */}
          <Stack gap={10}>
            <H2>Key exit catalysts by property</H2>
            <Table
              headers={['Property', 'Primary catalyst', 'Risk if catalyst delays', 'Verdict']}
              rows={EXIT_PROFILES.map(p => [
                p.shortName,
                p.catalyst,
                p.risk,
                p.verdict,
              ])}
              rowTone={EXIT_PROFILES.map(p => p.verdictTone)}
              striped
            />
          </Stack>

          {/* Exit score bar chart */}
          <Stack gap={8}>
            <H3>5-year exit score — all properties</H3>
            <BarChart
              categories={EXIT_PROFILES.map(p => p.shortName)}
              series={[{ name: '5-yr exit score /10', data: EXIT_PROFILES.map(p => p.exitScore) }]}
              height={180}
            />
          </Stack>

          {/* Final answer */}
          <Card>
            <CardHeader trailing={<Pill tone="success" size="sm">Recommendation</Pill>}>
              What to buy for a 5-year hold — the direct answer
            </CardHeader>
            <CardBody>
              <Table
                headers={['Priority', 'Choice', 'Reasoning']}
                rows={[
                  ['Format', 'Apartment in Grade A township · 300–1,500 units', 'Deepest rental pool, most liquid exit, best bank-LTV support for buyers at exit'],
                  ['Top exit pick', 'Brigade Eternia (Yelahanka NT)', 'BDA address, Brigade brand, 1,124 units, STRR catalyst, mature area = most reliable 5-yr exit'],
                  ['Best upside', 'Sattva Lumina (Yelahanka SH-9)', 'Lowest entry PSF + STRR re-rating + large township = highest % appreciation if all goes to plan'],
                  ['Quickest turnaround', 'Purva Zenium 2 (Hosahalli)', 'Jun 2027 possession = 3 yrs rental before 5-yr mark. Sell in 2032 while area is still appreciating fast'],
                  ['Avoid for 5-yr hold', 'Villa / plotted dev / boutique <100 units', 'Either zero rental income (plot), thin buyer pool (boutique), or over-budget value trap (villa)'],
                  ['Stretch pick', 'Prestige Avon (Thanisandra)', 'Best micro-market but ₹3.41 Cr entry caps % upside. Only if you negotiate under ₹3 Cr'],
                ]}
                rowTone={[undefined, 'success', 'success', 'info', 'danger', 'warning']}
                striped
              />
            </CardBody>
          </Card>

        </Stack>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          TAB 2 — UC vs RTM DECISION
      ══════════════════════════════════════════════════════════════════════ */}
      {tab === 'decision' && (
        <Stack gap={20}>
          <Card>
            <CardHeader trailing={<Pill tone="success" size="sm">Decided — UC Grade A only</Pill>}>
              Why we chose Under-Construction
            </CardHeader>
            <CardBody>
              <Table
                headers={['Factor', 'UC (our choice)', 'RTM (rejected)']}
                rows={[
                  ['Price', '15–20% below equivalent RTM', 'Premium pricing; no GST saving worth it at ₹3 Cr'],
                  ['GST', '5% adds ₹8–15L on ₹1.6–3 Cr UC', 'Zero GST — saves ₹8–15L on same value'],
                  ['Unit choice', 'Full floor, tower, facing selection', 'Limited to unsold/resale units'],
                  ['Possession', '2.5–4 years away', 'Immediate — stop rent instantly'],
                  ['Builder risk', 'Grade A only = manageable', 'Eliminated — OC already granted'],
                  ['Quality', 'New materials, modern layout', 'Can inspect before buying'],
                  ['Net verdict', 'Best Grade A at ₹1.6–2.5 Cr requires UC', 'No Grade A RTM at ₹3 Cr in North BLR now'],
                ]}
                rowTone={[undefined, 'warning', 'success', 'warning', undefined, undefined, 'success']}
                striped
              />
            </CardBody>
          </Card>

          <Card>
            <CardHeader trailing={<Pill tone="info" size="sm">Risk management</Pill>}>
              How we de-risk UC for Grade A builders
            </CardHeader>
            <CardBody>
              <Stack gap={5}>
                {[
                  ['Builder filter', 'NSE/BSE-listed developers only (Puravankara, Sattva, Brigade, Prestige) OR Tata Group backing — no private builder'],
                  ['RERA compliance', 'Verify RERA registration + quarterly construction update on krera.karnataka.gov.in before paying'],
                  ['Sales velocity', 'Only book after 60%+ units are sold — lower abandonment risk as builder cash-flow is secured'],
                  ['RERA escrow', 'Post-RERA, 70% of buyer money must sit in a RERA escrow account — significantly limits builder misuse'],
                  ['CLP plan', 'Request construction-linked payment plan (not time-linked) — money flows only when slabs are cast'],
                ].map(([title, detail]) => (
                  <Row key={title} gap={8} style={{ alignItems: 'flex-start' }}>
                    <Text size="small" weight="semibold" style={{ minWidth: 140 }}>{title}</Text>
                    <Text size="small" tone="secondary">{detail}</Text>
                  </Row>
                ))}
              </Stack>
            </CardBody>
          </Card>

          <Card>
            <CardHeader trailing={<Pill tone="warning" size="sm">Real cost of waiting</Pill>}>
              UC possession timeline vs ongoing rent
            </CardHeader>
            <CardBody>
              <Table
                headers={['Property', 'Possession', 'Months of rent (₹40K/mo)', 'Rent cost', 'Offset by lower UC price?']}
                rows={[
                  ['Purva Zenium 2', 'Jun 2027', '~14 months', '~₹5.6L', 'Yes — UC is ₹25–40L cheaper than RTM equiv'],
                  ['Prestige Avon',  'Dec 2028', '~32 months', '~₹12.8L', 'Partially — premium price reduces saving'],
                  ['Sattva Lumina',  'Nov 2029', '~43 months', '~₹17.2L', 'Yes — but opportunity cost of capital is real'],
                  ['Brigade Eternia','Mar 2030', '~47 months', '~₹18.8L', 'Yes — 14-acre BDA address justifies wait'],
                  ['Tata Varnam',    'Dec 2029', '~43 months', '~₹17.2L', 'Yes — but Devanahalli commute is the real cost'],
                ]}
                rowTone={['success', 'warning', undefined, undefined, undefined]}
                striped
              />
            </CardBody>
          </Card>
        </Stack>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          TAB 3 — SIZING & LOADING
      ══════════════════════════════════════════════════════════════════════ */}
      {tab === 'sizing' && (
        <Stack gap={20}>

          {/* Loading factor trap */}
          <Stack gap={12}>
            <H2>The Loading Factor Trap</H2>
            <Text size="small" tone="secondary">
              Builders advertise Super Built-up Area (SBA). What you actually live in is Carpet Area. The gap can be 22–35%. Always ask for RERA-registered carpet area — it is legally required to be disclosed.
            </Text>

            <Stack gap={8}>
              <H3>Select SBA to compare</H3>
              <Row gap={6} wrap>
                {sbaOptions.map(s => (
                  <Pill key={s} active={sba === s} onClick={() => setSba(s)}>{s} sqft SBA</Pill>
                ))}
              </Row>
            </Stack>

            <Table
              headers={['Builder (loading)', 'Carpet area', 'Space lost', 'PSF on carpet', 'Verdict']}
              rows={loadingScenarios.map(({ pct, label, tone }) => {
                const carpet = carpetFromSBA(sba, pct);
                const psfOnCarpet = Math.round(8500 / (1 - pct / 100));
                return [
                  label,
                  `${carpet} sqft`,
                  `${pct}% (${sba - carpet} sqft)`,
                  `₹${psfOnCarpet.toLocaleString()}/sqft carpet`,
                  pct <= 27 ? 'Good — push for this' : pct <= 31 ? 'Acceptable' : 'Reject or renegotiate',
                ];
              })}
              rowTone={loadingScenarios.map(({ pct }) =>
                pct <= 27 ? 'success' : pct <= 31 ? 'warning' : 'danger'
              )}
              striped
            />

            <Grid columns={3} gap={14}>
              <Card>
                <CardHeader trailing={<Pill size="sm">Rule 1</Pill>}>Always request RERA carpet area</CardHeader>
                <CardBody>
                  <Text size="small" tone="secondary">Post-2017, RERA mandates carpet area disclosure. Ask for the RERA carpet area certificate. A builder who hesitates is a red flag.</Text>
                </CardBody>
              </Card>
              <Card>
                <CardHeader trailing={<Pill size="sm">Rule 2</Pill>}>Loading above 33% — walk away</CardHeader>
                <CardBody>
                  <Text size="small" tone="secondary">If loading exceeds 33%, you're paying for a full room's worth of lobbies and ducts. Grade A North BLR projects achieve 24–30%.</Text>
                </CardBody>
              </Card>
              <Card>
                <CardHeader trailing={<Pill size="sm">Rule 3</Pill>}>Compare price on carpet, not SBA</CardHeader>
                <CardBody>
                  <Text size="small" tone="secondary">₹8,500/sqft SBA at 31% loading = ₹12,319/sqft carpet. Tata at ₹6,400/sqft SBA with 24% loading = ₹8,421/sqft carpet — dramatically better value per real sqft.</Text>
                </CardBody>
              </Card>
            </Grid>
          </Stack>

          <Divider />

          {/* BHK config */}
          <Stack gap={12}>
            <H2>BHK Configuration — what to buy as a single WFH adult</H2>
            <Table
              headers={['Config', 'Typical SBA', 'Carpet ~', 'Room use for WFH single adult', 'Verdict']}
              rows={[
                ['2 BHK', '1,000–1,200 sqft', '700–840 sqft', 'Bedroom + 1 room (WFH OR guest — not both)', 'Too cramped — skip'],
                ['3 BHK', '1,450–1,820 sqft', '1,015–1,274 sqft', 'Master BR + WFH room + Guest/Gym room', 'Optimal — buy this'],
                ['3 BHK + Study', '1,600–1,900 sqft', '1,120–1,330 sqft', 'Master BR + dedicated study + Guest room + 3rd flex', 'Excellent if available'],
                ['4 BHK', '2,000–2,400 sqft', '1,400–1,680 sqft', 'One room always unused; higher maintenance charges', 'Overkill'],
              ]}
              rowTone={['warning', 'success', 'success', 'warning']}
              striped
            />

            <Card>
              <CardHeader trailing={<Pill tone="success" size="sm">Target layout</Pill>}>
                Ideal 3 BHK room allocation for your profile
              </CardHeader>
              <CardBody>
                <Table
                  headers={['Room', 'Min size', 'Purpose', 'Priority']}
                  rows={[
                    ['Master Bedroom', '160–200 sqft', 'Sleep, wardrobe, attached bath', 'Essential'],
                    ['2nd Bedroom (WFH)', '140–160 sqft', 'Permanent desk, monitors, N/E facing — no afternoon glare', 'Critical'],
                    ['3rd Bedroom', '130–150 sqft', 'Guest room (parents) or gym / hobby room', 'High'],
                    ['Living + Dining', '280–350 sqft', 'Main social space, large TV, sofa, dining table for 4', 'High'],
                    ['Kitchen', '80–100 sqft', 'Modular kitchen — you cook on WFH days', 'High'],
                    ['Balcony', '≥ 60 sqft', 'Coffee + decompression break during WFH day', 'High'],
                    ['Utility / Store', '30–40 sqft', 'Washing machine, drying, overflow storage', 'Medium'],
                  ]}
                  rowTone={[undefined, 'success', undefined, undefined, undefined, undefined, undefined]}
                  striped
                />
              </CardBody>
            </Card>
          </Stack>
        </Stack>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          TAB 4 — UNIT SELECTION
      ══════════════════════════════════════════════════════════════════════ */}
      {tab === 'unit' && (
        <Stack gap={20}>

          {/* Floor guide */}
          <Stack gap={12}>
            <H2>Floor Selection</H2>
            <Table
              headers={['Floor range', 'Verdict', 'Notes for WFH single adult']}
              rows={FLOORS.map(f => [f.range, f.verdict, f.note])}
              rowTone={FLOORS.map(f => f.tone)}
              striped
            />
            <Text size="small" tone="secondary">
              For a single adult WFH setup: 5th–12th floor is the practical sweet spot — good natural light and cross ventilation, not so high that you're elevator-dependent during power cuts. Mid-tower corner units on these floors are the best pick.
            </Text>
          </Stack>

          <Divider />

          {/* Orientation */}
          <Stack gap={12}>
            <H2>Orientation & Facing</H2>
            <Grid columns={2} gap={14}>
              <Table
                headers={['Facing', 'Verdict', 'For WFH room', 'Notes']}
                rows={[
                  ['North-East', 'Best',         'Excellent', 'Morning light, no afternoon glare, stays cool'],
                  ['North',      'Very good',    'Excellent', 'Consistent indirect light all day'],
                  ['East',       'Good',         'Good',      'Bright morning start; afternoon is fine'],
                  ['South',      'Acceptable',   'Avoid',     'Good light but hot summer afternoons'],
                  ['West',       'Poor',         'Avoid',     'Harsh afternoon sun 2–6 PM; heats flat'],
                  ['South-West', 'Avoid',        'Never',     'Hottest orientation in Bangalore summers'],
                ]}
                rowTone={['success', 'success', undefined, 'warning', 'danger', 'danger']}
                striped
              />
              <Stack gap={14}>
                <Card>
                  <CardHeader trailing={<Pill tone="success" size="sm">WFH-specific tip</Pill>}>
                    Orient your WFH room right
                  </CardHeader>
                  <CardBody>
                    <Stack gap={6}>
                      <Text size="small">North-facing study = consistent, glare-free light. No afternoon heat. Monitor visibility excellent all day.</Text>
                      <Text size="small">West-facing study = afternoon sun hits your monitor directly at 2–5 PM. Expensive to cool. Avoid.</Text>
                      <Text size="small" weight="semibold" tone="secondary">Pro tip: visit the unit at 2 PM on a clear day. Feel which rooms get afternoon sun. That single observation is worth more than any floor plan.</Text>
                    </Stack>
                  </CardBody>
                </Card>
                <Card>
                  <CardHeader>Corner vs middle units</CardHeader>
                  <CardBody>
                    <Stack gap={6}>
                      <Text size="small" weight="semibold">Corner unit (+5–10% premium)</Text>
                      <Text size="small" tone="secondary">Two open sides → more windows, cross-ventilation, more natural light. Worth the premium for a WFH setup. Resale also easier.</Text>
                      <Text size="small" weight="semibold">Middle unit</Text>
                      <Text size="small" tone="secondary">One open side. Less ventilation. Shared walls provide some insulation. Cheaper. Accept if facing and floor are right.</Text>
                    </Stack>
                  </CardBody>
                </Card>
              </Stack>
            </Grid>
          </Stack>

          <Divider />

          {/* WFH checklist */}
          <Stack gap={12}>
            <H2>WFH flat inspection checklist</H2>
            <Text size="small" tone="secondary">
              Walk through this on site visit before making any offer. Critical items are deal-breakers regardless of price.
            </Text>
            <Table
              headers={['Checkpoint', 'What to verify on visit', 'Priority']}
              rows={WFH_CHECKS}
              rowTone={WFH_CHECKS.map(([, , p]) => p === 'Critical' ? 'danger' : p === 'High' ? 'warning' : undefined)}
              striped
            />
          </Stack>

          <Divider />

          {/* Target config summary */}
          <Stack gap={10}>
            <H2>Your target property — final spec</H2>
            <Table
              headers={['Attribute', 'Target', 'Why']}
              rows={[
                ['Type',        'Under-Construction — Grade A only', 'RTM Grade A North BLR is >₹3 Cr; UC is the only path'],
                ['Configuration', '3 BHK (or 3 BHK + Study)', 'WFH room + guest room + master BR — all three get used'],
                ['SBA range',   '1,500–1,820 sqft', 'At 27–30% loading → 1,050–1,275 sqft carpet — right-sized for 1 adult'],
                ['Floor',       '5F–12F', 'Best light + ventilation + security without elevator dependency'],
                ['Facing',      'North or East for WFH room', 'WFH room must NOT face West or South-West'],
                ['Unit type',   'Corner unit preferred', 'Cross-ventilation, more windows, better WFH environment'],
                ['Budget',      '₹1.6–2.6 Cr base price', 'Leaves ₹40–140L buffer for GST, stamp/reg, interiors'],
                ['Interiors',   'Budget ₹15–20L', 'Modular kitchen, wardrobes, WFH desk/storage, AC units'],
              ]}
              rowTone={['info', 'success', undefined, undefined, 'warning', undefined, undefined, 'info']}
              striped
            />
          </Stack>

        </Stack>
      )}

    </Stack>
  );
}
