import {
  BarChart,
  Card, CardBody, CardHeader,
  Divider, Grid, H1, H2, H3,
  Pill, Row, Stack, Stat, Table, Text,
  useCanvasState,
} from 'cursor/canvas';

// ── Types ──────────────────────────────────────────────────────────────────

type AreaKey = 'hosahalli' | 'thanisandra' | 'yelahanka' | 'yelahankaNT' | 'devanahalli';

interface InvScore {
  cagr:         number;  // historical appreciation (1–10)
  entryValue:   number;  // PSF vs comparable quality (1–10; 10 = cheapest entry)
  rentalYield:  number;  // expected gross yield (1–10)
  supplyDemand: number;  // demand > supply = higher score (1–10)
  infraCatalyst: number; // strength of upcoming infra value drivers (1–10)
}

interface AreaInv {
  label: string;
  shortName: string;
  shortlistProp: string;
  priceBase: string;           // base price of shortlisted property
  allIn: string;               // all-in cost
  psfRange: string;            // area PSF band
  psfMid: number;              // ₹ per sqft midpoint
  possession: string;
  cagr5yr: string;             // historical range
  rentalYield: string;         // gross yield range
  monthlyRentExp: string;      // expected monthly rent 3 BHK
  scores: InvScore;
  total: number;
  cagrDetail: string;
  entryValueDetail: string;
  rentalDetail: string;
  supplyDetail: string;
  catalystDetail: string;
  cashflowNote: string;        // CLP / possession timeline impact
  exitProfile: string;         // who buys at resale, how fast
  risks: string[];
  tone: 'success' | 'warning' | 'info';
}

// ── Infrastructure catalysts (investment lens) ─────────────────────────────

interface Catalyst {
  name: string;
  timeline: string;
  psfImpact: string;      // expected psf uplift when confirmed / live
  primaryAreas: AreaKey[];
  certainty: 'High' | 'Medium' | 'Low';
}

const CATALYSTS: Catalyst[] = [
  {
    name: 'Metro Phase 2B — Nagavara station',
    timeline: '2026–2027',
    psfImpact: '+₹800–1,500/sqft on Thanisandra/Nagavara belt',
    primaryAreas: ['thanisandra'],
    certainty: 'High',
  },
  {
    name: 'Metro Phase 2B — Airport line extension',
    timeline: '2030–2032',
    psfImpact: '+₹500–1,000/sqft on outer north belt',
    primaryAreas: ['hosahalli', 'yelahanka', 'yelahankaNT'],
    certainty: 'Medium',
  },
  {
    name: 'STRR Phase 1 — Satellite Town Ring Road',
    timeline: '2027–2028',
    psfImpact: '+₹600–1,200/sqft on Yelahanka / Hosahalli / Devanahalli',
    primaryAreas: ['yelahanka', 'yelahankaNT', 'hosahalli', 'devanahalli'],
    certainty: 'Medium',
  },
  {
    name: 'KIADB Aerospace SEZ Phase 1 employment ramp-up',
    timeline: '2027–2030',
    psfImpact: '+₹700–1,500/sqft on Devanahalli / Bagalur belt',
    primaryAreas: ['devanahalli'],
    certainty: 'Medium',
  },
  {
    name: 'DMIC node — Devanahalli',
    timeline: '2030+',
    psfImpact: 'Transformative if materialises; +40–60% on Devanahalli PSF',
    primaryAreas: ['devanahalli'],
    certainty: 'Low',
  },
  {
    name: 'Manyata Tech Park Phase 2 / embassy expansion',
    timeline: 'Ongoing',
    psfImpact: '+₹300–600/sqft steady uplift on Thanisandra / Nagavara',
    primaryAreas: ['thanisandra'],
    certainty: 'High',
  },
  {
    name: 'BIAL airport terminal expansion (T2)',
    timeline: '2025–2026 (T2 live)',
    psfImpact: '+₹400–800/sqft on Airport Road / Hosahalli belt',
    primaryAreas: ['hosahalli', 'devanahalli'],
    certainty: 'High',
  },
];

// ── Area investment data ───────────────────────────────────────────────────

const areas: Record<AreaKey, AreaInv> = {
  hosahalli: {
    label: 'Hosahalli / Airport Road belt',
    shortName: 'Hosahalli',
    shortlistProp: 'Purva Zenium 2 (Rank 1 — Jun 2027)',
    priceBase: '₹1.71–2.38 Cr',
    allIn: '₹1.82–2.53 Cr',
    psfRange: '₹7,000–9,500',
    psfMid: 8200,
    possession: 'Jun 2027',
    cagr5yr: '8–10% p.a.',
    rentalYield: '~2.8%',
    monthlyRentExp: '₹30,000–42,000',
    scores: { cagr: 7, entryValue: 8, rentalYield: 7, supplyDemand: 7, infraCatalyst: 7 },
    total: 0,
    cagrDetail: 'Airport Road / Hosahalli belt has appreciated ~8–10% CAGR over last 5 years, driven by BIAL T1 expansion, IT office take-up along NH44, and residential density growth. Below Thanisandra\'s CAGR but more headroom for re-rating if Aerospace SEZ absorbs employment.',
    entryValueDetail: 'PSF ₹7,000–9,500 is 15–20% cheaper than Thanisandra for comparable Grade A quality. Puravankara pricing is efficient — no brand scarcity premium like Prestige. Jun 2027 possession means you buy at today\'s price and hold through a still-rising market.',
    rentalDetail: 'Gross rental yield ~2.8%. Monthly rent ₹30,000–42,000 for 3 BHK expected post-possession. Tenant pool: aviation/airport operations staff, NH44 corridor IT workers. Demand is steady but thinner than Thanisandra. Vacancy risk is moderate.',
    supplyDetail: 'Supply in Hosahalli pocket is lower than Thanisandra — fewer large-scale launches in this specific micro-market. However demand is also lower. Net supply-demand balance is neutral-positive; not oversupplied like inner Thanisandra.',
    catalystDetail: 'BIAL T2 terminal is live (2025–26) — direct demand driver for Airport Road corridor. STRR Phase 1 outer belt alignment passes near Hosahalli. Metro Phase 2B Airport line (2030–32) is a long-term value driver. Aerospace SEZ is the big long-term bet, but multi-decade.',
    cashflowNote: 'Jun 2027 possession = shortest construction lock-in on the list. GST (5%) on UC only until OC; pay GST on tranche amounts only. Pre-EMI interest typically 2–3% of loan value during construction. Earliest possession = lowest total pre-EMI outflow.',
    exitProfile: 'Target buyer at resale: airport-adjacent IT/aviation professionals. Buyer pool is narrower than Thanisandra but Puravankara brand ensures no discount at exit. Resale typically takes 2–4 months in this belt vs 1–2 months in Thanisandra.',
    risks: [
      'Aerospace SEZ multi-decade timeline — near-term appreciation depends on NH44 IT demand only',
      'Airport Road commercial vehicle traffic adds noise/dust to residential experience; reduces rental premium',
      'Hosahalli is not a well-known residential address yet — may require price concession vs Yelahanka at resale',
    ],
    tone: 'info',
  },

  thanisandra: {
    label: 'Thanisandra / Nagavara',
    shortName: 'Thanisandra',
    shortlistProp: 'Prestige Avon (Rank 2 — Dec 2028)',
    priceBase: '₹3.2 Cr',
    allIn: '~₹3.41 Cr',
    psfRange: '₹6,500–9,500+',
    psfMid: 9000,
    possession: 'Dec 2028',
    cagr5yr: '10–12% p.a.',
    rentalYield: '~3.0–3.5%',
    monthlyRentExp: '₹40,000–55,000',
    scores: { cagr: 9, entryValue: 5, rentalYield: 9, supplyDemand: 7, infraCatalyst: 9 },
    total: 0,
    cagrDetail: 'Thanisandra / Nagavara has been the highest-appreciating micro-market in North BLR over 5 years — ~10–12% CAGR. Driven by Manyata Tech Park absorption, high IT worker density, and anticipation of Metro Nagavara Phase 2B. Prestige Avon\'s Dec 2028 possession lets you hold through the Metro announcement catalyst.',
    entryValueDetail: 'PSF ₹9,000+ for Prestige Avon is at a premium to the belt average. Prestige brand commands a 12–18% scarcity premium at resale — you pay more upfront but recover it at exit. The ₹3.41 Cr all-in is ₹41L over budget; worth negotiating a lower floor unit to close the gap.',
    rentalDetail: 'Best rental yield on the list at 3.0–3.5%. Monthly rent ₹40,000–55,000 for a Grade A 3 BHK expected. Thanisandra has the densest IT-worker tenant pool in North BLR. Vacancy risk is lowest — typically <4 weeks between tenants near Manyata.',
    supplyDetail: 'Thanisandra has significant new inventory supply (many large projects). However absorption is also high due to Manyata IT employment and Metro anticipation. Net balance is roughly neutral — well-supplied but well-absorbed. Oversupply risk is moderate if Manyata absorption slows.',
    catalystDetail: 'Metro Phase 2B Nagavara station (~2026–27): strongest and most certain near-term catalyst in North BLR. Manyata Tech Park Phase 2 expansion (ongoing): sustained demand driver. Yellow Line Metro to Silk Board: connects Thanisandra to south BLR IT parks — expands tenant/buyer pool dramatically.',
    cashflowNote: 'Dec 2028 possession: 2+ year construction lock-in from today. Pre-EMI for 2+ years on ₹2.5+ Cr loan is significant. GST exposure on CLP tranches until OC. Total pre-possession outflow is the highest on the list. Factor this against Jun 2027 (Purva) savings.',
    exitProfile: 'Widest, fastest resale market in North BLR. Prestige brand + Thanisandra address = 1–2 month exit timeline. Target buyer: broad pool — IT professionals, Metro users, investors, NRIs. Best resale liquidity on this entire shortlist.',
    risks: [
      'Over ₹3 Cr ceiling by ₹41L — if no unit negotiated below ceiling, financial criterion FAILS',
      'Thanisandra rajakaluve flooding in some sub-pockets; verify specific site drainage',
      'High supply pipeline in Thanisandra: if IT absorption slows, over-supply could suppress appreciation',
    ],
    tone: 'success',
  },

  yelahanka: {
    label: 'Yelahanka / Rajanukunte · SH-9',
    shortName: 'Yelahanka (Sattva)',
    shortlistProp: 'Sattva Lumina (Rank 3 — Nov 2029)',
    priceBase: '₹1.52–1.75 Cr',
    allIn: '₹1.62–1.87 Cr',
    psfRange: '₹5,800–8,500',
    psfMid: 7000,
    possession: 'Nov 2029',
    cagr5yr: '7–9% p.a.',
    rentalYield: '~2.8–3.0%',
    monthlyRentExp: '₹32,000–45,000',
    scores: { cagr: 7, entryValue: 9, rentalYield: 7, supplyDemand: 8, infraCatalyst: 8 },
    total: 0,
    cagrDetail: 'Yelahanka has appreciated ~7–9% CAGR over 5 years — steadily undervalued relative to Thanisandra for same quality. This delta creates a re-rating opportunity: as STRR progresses and airport corridor demand grows, Yelahanka should close the gap with Thanisandra PSF.',
    entryValueDetail: 'Best entry value on list — PSF ₹5,800–8,500 vs Thanisandra ₹8,000–9,500+ for comparable Grade A. Sattva Lumina at ₹1.62–1.87 Cr all-in is 30–40% cheaper than Prestige Avon for a larger apartment. The "Yelahanka is undervalued" thesis has been consistent for 3+ years and is slowly re-rating.',
    rentalDetail: 'Gross yield ~2.8–3.0%. Monthly rent ₹32,000–45,000 for 3 BHK. Yelahanka tenant pool: IT workers, airport staff, families. Steady demand. "Rajanukunte" as an address is less known than "Yelahanka NT" — use "Sattva Lumina, Yelahanka" in rental listings, not Rajanukunte.',
    supplyDetail: 'Lower supply overhang than Thanisandra — Yelahanka is less over-launched. Sattva Lumina is a large project (1,553 units) which could create its own sub-market supply; stagger sale/rent timing relative to other towers. Overall demand-supply balance in Yelahanka is positive.',
    catalystDetail: 'STRR Phase 1 passes through SH-9 / Yelahanka corridor — most direct benefit of any project on this list. Airport Road corridor growth. Aerospace SEZ long-term pulls. "Yelahanka undervalued" narrative is gaining traction with institutional investors — watch for RE fund activity as a re-rating signal.',
    cashflowNote: 'Nov 2029 possession = longest pre-EMI lock-in on the list (3.5 years from today). However ₹1.62–1.87 Cr all-in means the EMI itself is lowest — ₹1.2–1.4L/month estimated on 80% LTV loan. Total cost of ownership (TCO) over 10 years is likely lowest on the list.',
    exitProfile: 'Resale to families and IT workers in Yelahanka belt. "Yelahanka" brand sells well. "Rajanukunte" address slightly reduces premium — market as Sattva Lumina / Yelahanka. Buyer pool is good but narrower than Thanisandra. Exit timeline: 2–3 months typically.',
    risks: [
      'Nov 2029 possession = longest capital lock-in; opportunity cost of ₹1.6 Cr for 3.5 yrs in equity is significant',
      '"Rajanukunte" is a less-known address vs "Yelahanka New Town" — potential 5–8% discount at resale',
      'Rajanukunte jurisdiction (Gram Panchayat / BDA boundary) — Khata status must be verified before booking',
      'Large unit count (1,553 units): oversupply within the project itself at resale if many units hit market simultaneously',
    ],
    tone: 'info',
  },

  yelahankaNT: {
    label: 'Yelahanka New Town',
    shortName: 'Yelahanka NT',
    shortlistProp: 'Brigade Eternia (Rank 4 — Mar 2030)',
    priceBase: '₹2.26 Cr',
    allIn: '~₹2.41 Cr',
    psfRange: '₹7,000–10,500',
    psfMid: 8500,
    possession: 'Mar 2030',
    cagr5yr: '8–10% p.a.',
    rentalYield: '~2.8–3.0%',
    monthlyRentExp: '₹35,000–50,000',
    scores: { cagr: 8, entryValue: 7, rentalYield: 7, supplyDemand: 8, infraCatalyst: 8 },
    total: 0,
    cagrDetail: 'Yelahanka New Town has appreciated ~8–10% CAGR over 5 years, ahead of the wider Yelahanka belt due to its planned-sector premium and established address. Brigade brand adds a consistent 5–8% resale premium on top of area appreciation — best brand-multiplier combination outside Prestige Avon.',
    entryValueDetail: 'PSF ₹7,000–10,500 (Brigade Eternia at ₹2.26 Cr / 1,620–1,820 sqft → ~₹7,400/sqft base). Slight premium to Sattva Lumina (Rajanukunte) but in a more established address that commands a faster exit. Entry is fair — not the cheapest but justified by address and brand.',
    rentalDetail: 'Gross yield ~2.8–3.0%. Monthly rent ₹35,000–50,000 for 3 BHK. Yelahanka NT has an established rental market with IT workers, airport staff, and families. Brigade societies typically attract higher-quality tenants. Vacancy risk is low (established area, known address).',
    supplyDetail: 'Yelahanka NT supply is more controlled than Thanisandra — less over-launched. Brigade Eternia at 1,124 units is manageable. Established area means steady demand from resale and fresh buyers. Net supply-demand balance is positive — lower oversupply risk than Thanisandra or Sattva (1,553 units).',
    catalystDetail: 'STRR: Yelahanka NT is set to become an STRR interchange suburb — orbital connectivity boost. NH44: existing elevated corridor already priced in but provides floor. Brigade brand: institutional buyer confidence means this project will be well-absorbed. Airport corridor demand and STRR together are the main forward catalysts.',
    cashflowNote: 'Mar 2030 possession: ~4 year pre-EMI period. ₹2.41 Cr all-in → ~₹1.65L/month EMI on 80% LTV. Pre-EMI and construction-linked payments spread over 4 years. Total pre-possession outflow is higher than Hosahalli but lower than Prestige Avon. Brigade CLP is typically milestone-linked — safer than time-linked schedules.',
    exitProfile: 'Broadest buyer pool among Yelahanka options — Yelahanka NT + Brigade = recognised, liquid address. Target buyer: IT professionals, families, NRIs, investors. Exit timeline: 1–2 months. Resale premium over generic Yelahanka builders: 8–12%.',
    risks: [
      'Possession date ambiguity (Mar vs Dec 2030): 9-month uncertainty impacts total carrying cost — resolve in writing',
      'Mar 2030 is 4 years away: significant opportunity cost of ₹2.4 Cr in the equity market',
      'NH44 Hebbal junction bottleneck: peak-hour congestion remains even with elevated; factor commute variance',
    ],
    tone: 'success',
  },

  devanahalli: {
    label: 'Devanahalli / KIADB Aerospace belt',
    shortName: 'Devanahalli',
    shortlistProp: 'Tata Varnam (Rank 5 — Dec 2029)',
    priceBase: '₹1.55–1.91 Cr',
    allIn: '₹1.65–2.04 Cr',
    psfRange: '₹5,500–7,500',
    psfMid: 6400,
    possession: 'Dec 2029',
    cagr5yr: '6–9% p.a.',
    rentalYield: '~2.5–2.8%',
    monthlyRentExp: '₹28,000–38,000',
    scores: { cagr: 7, entryValue: 10, rentalYield: 5, supplyDemand: 6, infraCatalyst: 9 },
    total: 0,
    cagrDetail: 'Devanahalli has appreciated ~6–9% CAGR — highest variance on the list (thin data set, emerging market). Periods of strong catalysts (airport expansion announcements) see 12%+ spikes; low-catalyst years are flat. The long-term thesis (DMIC + Aerospace) could push CAGR to 12–15% if employment materialises — but the baseline is uncertain.',
    entryValueDetail: 'Best entry value across all North BLR — PSF ₹5,500–7,500, cheapest on the list by 15–20% vs Yelahanka NT and 30%+ vs Thanisandra. Tata Varnam at ₹1.65–2.04 Cr all-in for 1,681–2,061 sqft is the most sqft per rupee by a wide margin. If Aerospace SEZ absorbs, this entry price looks exceptional in hindsight.',
    rentalDetail: 'Lowest rental yield on the list at ~2.5–2.8%. Monthly rent ₹28,000–38,000 for 3 BHK — thin tenant pool (airport staff, KIADB workers, niche market). Carnatica township self-contained amenities help attract tenants but the overall pool is narrow. Vacancy risk is highest on the list.',
    supplyDetail: 'Supply and demand are both thin in Devanahalli. Low oversupply risk but also low absorption — the market clears slowly. Tata Varnam within Carnatica township is a demand anchor but overall Devanahalli resale market is illiquid. Large projects like Purva Northern Lights (Dec 2031, 2,973 units) will add future supply.',
    catalystDetail: 'KIADB Aerospace SEZ Phase 1 employment ramp-up (2027–30): if large employers anchor here, 20–30% PSF re-rating possible. DMIC node designation: long-horizon transformative catalyst. STRR Phase 1: cuts Manyata commute when live. BIAL T2 terminal: operational now, driving premium on airport proximity. These are the highest-upside but lowest-certainty catalysts on the list.',
    cashflowNote: 'Dec 2029 possession: ~3.5 year CLP. ₹1.65–2.04 Cr all-in → ~₹1.1–1.4L/month EMI on 80% LTV — lowest EMI on the list. Total pre-possession pre-EMI outflow is low. However rental income post-possession will be lowest, limiting yield contribution to total return.',
    exitProfile: 'Narrowest buyer pool at resale: airport-adjacent professionals, Aerospace/KIADB workers, DMIC thesis investors. Tata brand provides a floor — no discount at resale. But exit timeline may be 3–6 months vs 1–2 months for Thanisandra/Yelahanka NT. Best for patient investors (7–10 yr horizon).',
    risks: [
      'DMIC and Aerospace SEZ timelines are government-dependent — both have been delayed historically',
      'Lowest rental yield and thinnest tenant pool: highest vacancy risk post-possession',
      'Remote location means broader macro slowdown hits Devanahalli hardest (thin buyer pool)',
      'Purva Northern Lights (2,973 units, Dec 2031) adds significant future supply to same micro-market',
    ],
    tone: 'warning',
  },
};

// ── Compute totals ─────────────────────────────────────────────────────────

(Object.keys(areas) as AreaKey[]).forEach(k => {
  const s = areas[k].scores;
  areas[k].total = s.cagr + s.entryValue + s.rentalYield + s.supplyDemand + s.infraCatalyst;
});

const SCORE_FACTORS: [keyof InvScore, string][] = [
  ['cagr',          'Historical CAGR'],
  ['entryValue',    'Entry PSF value'],
  ['rentalYield',   'Rental yield'],
  ['supplyDemand',  'Supply-demand balance'],
  ['infraCatalyst', 'Infrastructure catalyst'],
];

const CERTAINTY_TONE: Record<Catalyst['certainty'], 'success' | 'warning' | 'danger'> = {
  High: 'success', Medium: 'warning', Low: 'danger',
};

// ── Component ──────────────────────────────────────────────────────────────

export default function Investment() {
  const [activeArea, setActiveArea] = useCanvasState<AreaKey>('invArea', 'thanisandra');
  const a = areas[activeArea as AreaKey];
  const areaKeys = Object.keys(areas) as AreaKey[];
  const sortedByTotal = [...areaKeys].sort((x, y) => areas[y].total - areas[x].total);

  return (
    <Stack gap={28} style={{ padding: '24px 28px', maxWidth: 980 }}>

      {/* ── Header ── */}
      <Stack gap={4}>
        <Row gap={10} align="center">
          <H1>Criterion 3 — Investment & Appreciation</H1>
          <Pill tone="warning">After Connectivity</Pill>
        </Row>
        <Text tone="secondary">
          5 shortlisted areas evaluated on historical CAGR, entry PSF value, rental yield, supply-demand balance,
          and infrastructure catalysts. Includes cash-flow notes and exit profile.
        </Text>
      </Stack>

      {/* ── Summary stats ── */}
      <Grid columns={4} gap={14}>
        <Stat value={areas[sortedByTotal[0]].shortName}  label="Best investment score" tone="success" />
        <Stat value="Devanahalli"   label="Best entry PSF (cheapest)" tone="success" />
        <Stat value="Thanisandra"   label="Best rental yield (~3–3.5%)" tone="info" />
        <Stat value="Hosahalli"     label="Earliest rental income (Jun 27)" tone="warning" />
      </Grid>

      <Divider />

      {/* ── Infrastructure catalysts ── */}
      <Stack gap={10}>
        <H2>Infrastructure catalysts — investment impact</H2>
        <Table
          headers={['Catalyst', 'Timeline', 'PSF impact', 'Certainty', 'Primary areas']}
          rows={CATALYSTS.map(c => [
            c.name,
            c.timeline,
            c.psfImpact,
            c.certainty,
            c.primaryAreas.map(k => areas[k].shortName).join(', '),
          ])}
          rowTone={CATALYSTS.map(c => CERTAINTY_TONE[c.certainty])}
          striped
        />
        <Text size="small" tone="secondary">
          Colour: green = high certainty · yellow = medium certainty · red = planning / speculative.
          PSF impact is estimated range at time of confirmation / opening — not guaranteed.
        </Text>
      </Stack>

      <Divider />

      {/* ── Investment score matrix ── */}
      <Stack gap={10}>
        <H2>Investment score matrix</H2>
        <Table
          headers={['Area', 'Property', 'CAGR', 'Entry PSF', 'Rental', 'Supply-Demand', 'Infra', 'Total /50']}
          rows={sortedByTotal.map(k => [
            areas[k].shortName,
            areas[k].shortlistProp.split('(')[0].trim(),
            `${areas[k].scores.cagr}/10`,
            `${areas[k].scores.entryValue}/10`,
            `${areas[k].scores.rentalYield}/10`,
            `${areas[k].scores.supplyDemand}/10`,
            `${areas[k].scores.infraCatalyst}/10`,
            `${areas[k].total}/50`,
          ])}
          rowTone={sortedByTotal.map(k =>
            areas[k].total >= 38 ? 'success' : areas[k].total <= 34 ? 'danger' : undefined
          )}
          striped
        />
      </Stack>

      <Divider />

      {/* ── Charts ── */}
      <Grid columns={2} gap={16}>
        <Stack gap={8}>
          <H3>Investment score (/50)</H3>
          <BarChart
            categories={sortedByTotal.map(k => areas[k].shortName)}
            series={[{ name: 'Score', data: sortedByTotal.map(k => areas[k].total) }]}
            height={220}
          />
        </Stack>
        <Stack gap={8}>
          <H3>Entry PSF midpoint (₹/sqft)</H3>
          <BarChart
            categories={areaKeys.map(k => areas[k].shortName)}
            series={[{ name: '₹/sqft', data: areaKeys.map(k => areas[k].psfMid) }]}
            valueSuffix=" ₹"
            height={220}
          />
        </Stack>
      </Grid>

      <Divider />

      {/* ── Area deep dive ── */}
      <Stack gap={14}>
        <Stack gap={8}>
          <H2>Area deep dive</H2>
          <Row gap={6} wrap>
            {areaKeys.map(k => (
              <Pill
                key={k}
                active={activeArea === k}
                onClick={() => setActiveArea(k)}
                tone={areas[k].total >= 38 ? 'success' : areas[k].total <= 34 ? 'warning' : undefined}
              >
                {areas[k].shortName}
              </Pill>
            ))}
          </Row>
        </Stack>

        <Grid columns={4} gap={12}>
          <Stat value={a.allIn} label="All-in cost" />
          <Stat value={a.cagr5yr} label="5-yr CAGR" tone="success" />
          <Stat value={a.rentalYield} label="Gross rental yield" />
          <Stat value={`${a.total}/50`} label="Investment score"
            tone={a.total >= 38 ? 'success' : a.total <= 34 ? 'danger' : undefined} />
        </Grid>

        <Grid columns={4} gap={12}>
          <Stat value={a.psfRange} label="Area PSF band" />
          <Stat value={a.monthlyRentExp} label="Expected monthly rent" />
          <Stat value={a.possession} label="Possession" />
          <Stat value={a.shortlistProp.split('—')[0].trim()} label="Shortlisted property" />
        </Grid>

        <Grid columns={2} gap={14}>
          <Stack gap={10}>
            <Card>
              <CardHeader trailing={<Pill tone={a.scores.cagr >= 8 ? 'success' : 'warning'} size="sm">{a.scores.cagr}/10</Pill>}>
                Historical CAGR
              </CardHeader>
              <CardBody><Text size="small" tone="secondary">{a.cagrDetail}</Text></CardBody>
            </Card>
            <Card>
              <CardHeader trailing={<Pill tone={a.scores.entryValue >= 8 ? 'success' : 'warning'} size="sm">{a.scores.entryValue}/10</Pill>}>
                Entry PSF value
              </CardHeader>
              <CardBody><Text size="small" tone="secondary">{a.entryValueDetail}</Text></CardBody>
            </Card>
            <Card>
              <CardHeader trailing={<Pill tone={a.scores.rentalYield >= 7 ? 'success' : a.scores.rentalYield >= 5 ? 'warning' : 'danger'} size="sm">{a.scores.rentalYield}/10</Pill>}>
                Rental yield
              </CardHeader>
              <CardBody><Text size="small" tone="secondary">{a.rentalDetail}</Text></CardBody>
            </Card>
          </Stack>
          <Stack gap={10}>
            <Card>
              <CardHeader trailing={<Pill tone={a.scores.supplyDemand >= 8 ? 'success' : 'warning'} size="sm">{a.scores.supplyDemand}/10</Pill>}>
                Supply-demand balance
              </CardHeader>
              <CardBody><Text size="small" tone="secondary">{a.supplyDetail}</Text></CardBody>
            </Card>
            <Card>
              <CardHeader trailing={<Pill tone={a.scores.infraCatalyst >= 8 ? 'success' : 'warning'} size="sm">{a.scores.infraCatalyst}/10</Pill>}>
                Infrastructure catalysts
              </CardHeader>
              <CardBody><Text size="small" tone="secondary">{a.catalystDetail}</Text></CardBody>
            </Card>
            <Card>
              <CardHeader trailing={<Pill tone="info" size="sm">Cash flow</Pill>}>
                CLP timeline & EMI profile
              </CardHeader>
              <CardBody><Text size="small" tone="secondary">{a.cashflowNote}</Text></CardBody>
            </Card>
          </Stack>
        </Grid>

        <Grid columns={2} gap={14}>
          <Card>
            <CardHeader trailing={<Pill tone="success" size="sm">Exit</Pill>}>
              Resale / exit profile
            </CardHeader>
            <CardBody><Text size="small" tone="secondary">{a.exitProfile}</Text></CardBody>
          </Card>
          <Card>
            <CardHeader trailing={<Pill tone="warning" size="sm">Risks</Pill>}>
              Investment risks
            </CardHeader>
            <CardBody>
              <Stack gap={4}>
                {a.risks.map((r: string, i: number) => (
                  <Row key={i} gap={6} style={{ alignItems: 'flex-start' }}>
                    <Text size="small" tone="secondary" style={{ minWidth: 10 }}>!</Text>
                    <Text size="small" tone="secondary">{r}</Text>
                  </Row>
                ))}
              </Stack>
            </CardBody>
          </Card>
        </Grid>

        <Stack gap={8}>
          <H3>Score breakdown — {a.shortName}</H3>
          <BarChart
            categories={SCORE_FACTORS.map(([, label]) => label)}
            series={[{ name: a.shortName, data: SCORE_FACTORS.map(([key]) => a.scores[key]) }]}
            horizontal
            height={180}
          />
        </Stack>
      </Stack>

      <Divider />

      {/* ── Total return framing ── */}
      <Stack gap={10}>
        <H2>Total return framework</H2>
        <Text size="small" tone="secondary">
          Property total return = Capital appreciation + Rental income − (EMI cost + Maintenance + Opportunity cost of down payment).
          Key insight: a cheap entry PSF with moderate CAGR can beat a high-CAGR area with expensive entry. Model all costs, not just appreciation.
        </Text>
        <Table
          headers={['Area', 'All-in', '10-yr appreciation*', 'Rental 10yr*', 'EMI 10yr*', 'Net return estimate', 'Horizon fit']}
          rows={[
            ['Thanisandra', '₹3.41 Cr', '~₹8.8 Cr (+158%)', '~₹56L', '~₹2.0 Cr net carry', 'Strong — if budget allows', 'Self-use + exit 5–7 yr'],
            ['Yelahanka NT', '₹2.41 Cr', '~₹5.9 Cr (+145%)', '~₹49L', '~₹1.4 Cr net carry', 'Strong — balanced', 'Self-use + exit 7–10 yr'],
            ['Yelahanka (Sattva)', '₹1.87 Cr', '~₹4.4 Cr (+135%)', '~₹45L', '~₹1.0 Cr net carry', 'Good — lowest TCO', 'Investment + exit 7–10 yr'],
            ['Hosahalli', '₹2.53 Cr', '~₹6.1 Cr (+141%)', '~₹42L', '~₹1.4 Cr net carry', 'Good — earliest income', 'Self-use first, exit 5 yr'],
            ['Devanahalli', '₹2.04 Cr', '~₹4.7 Cr (+130%)', '~₹38L', '~₹1.1 Cr net carry', 'Speculative — upside if Aerospace', 'Investment only, 10+ yr'],
          ]}
          rowTone={['success', 'success', undefined, undefined, 'warning']}
          striped
        />
        <Text size="small" tone="secondary">
          * Estimates at respective all-in prices using mid-range CAGR scenarios and area rental yields.
          10-yr appreciation uses upper mid-case CAGR (Thanisandra 11%, Yelahanka NT 9%, Yelahanka 8%, Hosahalli 9%, Devanahalli 8%).
          EMI net carry = monthly EMI minus expected monthly rent × 120 months. Not financial advice — model your own numbers.
        </Text>
      </Stack>

      <Divider />

      {/* ── Verdict ── */}
      <Stack gap={8}>
        <H2>Investment verdict</H2>
        <Table
          headers={['Rank', 'Area', 'Score', 'Best for', 'Key risk']}
          rows={sortedByTotal.map((k, i) => [
            String(i + 1),
            areas[k].shortName,
            `${areas[k].total}/50`,
            k === 'thanisandra' ? 'Rental yield + resale liquidity (over budget today)' :
            k === 'yelahankaNT' ? 'Balanced appreciation + known address + Brigade premium' :
            k === 'yelahanka'   ? 'Lowest entry cost; undervalued; STRR re-rating' :
            k === 'hosahalli'   ? 'Earliest income (Jun 2027); NH44 + airport corridor' :
                                  'Highest upside IF Aerospace SEZ materialises (7–10 yr)',
            k === 'thanisandra' ? '₹41L over budget; high supply pipeline' :
            k === 'yelahankaNT' ? 'Possession date ambiguity; 4yr lock-in' :
            k === 'yelahanka'   ? 'Rajanukunte address discount; 3.5yr lock-in; Khata' :
            k === 'hosahalli'   ? 'Thin tenant pool; less-known address' :
                                  'Thin resale/rental market; commute makes self-use hard',
          ])}
          rowTone={sortedByTotal.map(k =>
            areas[k].total >= 38 ? 'success' : areas[k].total <= 34 ? 'danger' : undefined
          )}
          striped
        />
        <Card>
          <CardHeader trailing={<Pill tone="info" size="sm">Key insight</Pill>}>
            Investment vs self-use — the split decision
          </CardHeader>
          <CardBody>
            <Stack gap={6}>
              {[
                'Pure investment: Thanisandra wins on yield and liquidity — but only if you can bridge the ₹41L budget gap. Sattva Lumina wins on entry value and lowest TCO over 10 years.',
                'Self-use first, investment later: Brigade Eternia (Yelahanka NT) is the most balanced — established address, Brigade brand, STRR catalyst, manageable budget.',
                'Earliest rental income: Purva Zenium 2 (Jun 2027) generates rental income 2–3 years before others, partially compensating for lower CAGR.',
                'Highest asymmetric upside: Devanahalli + Tata Varnam — IF Aerospace SEZ delivers employment. Not recommended as primary self-use given commute. Best as a second property or long-horizon investment.',
              ].map((t, i) => (
                <Row key={i} gap={8} style={{ alignItems: 'flex-start' }}>
                  <Text size="small" tone="secondary" style={{ minWidth: 10 }}>→</Text>
                  <Text size="small">{t}</Text>
                </Row>
              ))}
            </Stack>
          </CardBody>
        </Card>
      </Stack>

    </Stack>
  );
}
