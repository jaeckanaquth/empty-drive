import {
  BarChart,
  Card, CardBody, CardHeader,
  Divider, Grid, H1, H2, H3,
  Pill, Row, Stack, Stat, Table, Text,
  useCanvasState,
} from 'cursor/canvas';

// ── Criterion 4 — Property Type & Strategy ────────────────────────────────
// Strategic question: given North BLR areas + 5-yr hold, what property TYPE
// and community SCALE gives the best entry + exit outcome?
// Not selecting exact units yet — this is the typological decision layer.

type Tab = 'type' | 'scale' | 'hold' | 'matrix';

// ── Property types ──────────────────────────────────────────────────────────

const TYPES = [
  {
    id: 'apt',
    label: 'Apartment (Grade A gated)',
    budget: '₹1.2–3 Cr',
    available: 'High — this is the North BLR primary market',
    liquidity5yr: 9,
    appreciation5yr: 8,
    rentalYield: 7,
    maintenance: 7,   // higher = easier/lower cost
    buyerPool: 9,
    overallScore: 40,
    tone: 'success' as const,
    verdict: 'Default choice at ₹3 Cr in North BLR — deepest buyer pool, strongest resale liquidity, most comparable data for pricing at exit.',
    pros: [
      'Deepest buyer pool in North BLR — IT professionals, young families, NRIs all target Grade A apartments',
      'Grade A builder brand commands 5–15% premium at resale vs unknown builder',
      'Most RERA-compliant product type — loan-friendly, legally cleaner',
      'Rental demand is immediate post-possession — 2–3% yield on IT corridor',
      'Price discovery is transparent — hundreds of comparable transactions quarterly',
      'Maintenance is shared across a large owner base — lower per-unit cost at scale',
    ],
    cons: [
      'Large supply in North BLR means you are competing with many similar units at exit',
      'Differentiation at resale is limited — floor, facing, and condition become the deciding factors',
      'Society politics and maintenance quality can erode value if RWA is poorly run',
    ],
    northBlrContext: 'All 5 shortlisted properties are Grade A apartments. This is the right type for ₹3 Cr in North BLR — villas and row houses start at ₹4 Cr+ in gated communities here.',
  },
  {
    id: 'villa',
    label: 'Independent Villa (gated)',
    budget: '₹4–10 Cr+',
    available: 'Low at ₹3 Cr — premium starts at ₹4 Cr in North BLR',
    liquidity5yr: 5,
    appreciation5yr: 9,
    rentalYield: 4,
    maintenance: 3,   // harder/higher cost
    buyerPool: 4,
    overallScore: 25,
    tone: 'warning' as const,
    verdict: 'Out of budget for North BLR Grade A. Strong long-term appreciation but small buyer pool and high maintenance make 5-year hold exits harder.',
    pros: [
      'Higher absolute appreciation in premium locations (IVC Road, Devanahalli SEZ belt)',
      'Land component appreciates independently — strong 10–15 yr story',
      'More flexibility for renovation/customisation',
      'Emotional premium — buyers pay above market for a villa',
    ],
    cons: [
      'Budget mismatch: Grade A North BLR villas start at ₹4–5 Cr (Prestige Golfshire, IVC Road)',
      'Small buyer pool at exit — far fewer people can afford ₹4–6 Cr vs ₹2–3 Cr apartment',
      'High maintenance: garden, external facade, gate, security — all borne by owner',
      'Rental yield is poor (1.5–2%) due to high sticker price vs rent achievable',
      'Liquidity risk: can sit on market for 6–12 months without the right buyer',
    ],
    northBlrContext: 'IVC Road (Embassy Springs, Sobha HRC Pristine) and Devanahalli (Tata Carnatica villas) are on the watch-list. Budget would need to stretch to ₹4–5 Cr for the right gated villa community.',
  },
  {
    id: 'rowhouse',
    label: 'Row house / Townhouse',
    budget: '₹2.5–5 Cr',
    available: 'Low — niche product in North BLR',
    liquidity5yr: 4,
    appreciation5yr: 8,
    rentalYield: 5,
    maintenance: 4,
    buyerPool: 3,
    overallScore: 24,
    tone: 'warning' as const,
    verdict: 'Niche product with thin resale market. Good appreciation but small buyer pool makes 5-year exits harder. Lower rental yield than apartments.',
    pros: [
      'Private entrance, small garden, feel of a house without full villa cost',
      'Less supply — scarcity supports appreciation in right localities',
      'Good fit for families who want space + gated security',
    ],
    cons: [
      'Very few Grade A row house projects in North BLR at ₹3 Cr',
      'Niche buyer profile = smaller pool; can take 6–18 months to find the right buyer at exit',
      'Limited floor levels = less view/light advantage',
      'Maintenance burden higher than apartment flat',
    ],
    northBlrContext: 'Total Environment and a few boutique developers do row houses in Yelahanka belt but pricing is ₹3–5 Cr. Not viable within ₹3 Cr for a Grade A gated project.',
  },
  {
    id: 'plot',
    label: 'Residential Plot (NA / DC-converted)',
    budget: '₹50L–3 Cr',
    available: 'Available but risky',
    liquidity5yr: 4,
    appreciation5yr: 10,
    rentalYield: 1,
    maintenance: 9,
    buyerPool: 5,
    overallScore: 29,
    tone: 'danger' as const,
    verdict: 'Highest long-term appreciation potential but zero rental income, complex legal due diligence, and home loan restrictions. Wrong product for this profile.',
    pros: [
      'Highest CAGR in right locations — Airport Road and Devanahalli plots have done 12–18% p.a.',
      'No maintenance cost; no tenant headaches',
      'Land is finite — pure land appreciation play',
    ],
    cons: [
      'Zero rental income for entire hold period',
      'Banks offer only 50–60% LTV on plots vs 80–90% on apartments',
      'Legal due diligence is complex: NA order, DC conversion, BMRDA/BDA approval, E-Khata essential',
      'Encroachment risk, boundary disputes, and fraudulent title are real',
      'Construction required for good resale — adds capital and project management burden',
      'Wrong profile fit: you are a single WFH professional, not a land investor/developer',
    ],
    northBlrContext: 'KIADB, BDA, and BMRDA layouts along Airport Road and Bagalur have had strong appreciation. Not for this search — legal complexity + capital locked without yield is wrong for a first-time buyer.',
  },
];

// ── Community scale ──────────────────────────────────────────────────────────

const SCALES = [
  {
    id: 'boutique',
    label: 'Boutique',
    unitRange: '< 200 units',
    example: 'Prestige Avon (~230 units)',
    resaleLiquidity: 5,
    amenityDepth: 5,
    communityFeel: 9,
    maintenanceCost: 6,
    priceDiscovery: 5,
    appreciationPremium: 8,
    totalScore: 38,
    tone: 'info' as const,
    forInvestment5yr: 'Moderate — lower transaction volume means fewer comparables at exit and longer time to find a buyer. Exclusivity can command premium with the right buyer but limits pool.',
    forSelfUse: 'Excellent — quiet, smaller community, faster RWA formation, better neighbour rapport.',
  },
  {
    id: 'mid',
    label: 'Mid-size',
    unitRange: '300–700 units',
    example: 'Purva Zenium 2 (~500 units)',
    resaleLiquidity: 8,
    amenityDepth: 8,
    communityFeel: 7,
    maintenanceCost: 8,
    priceDiscovery: 8,
    appreciationPremium: 7,
    totalScore: 46,
    tone: 'success' as const,
    forInvestment5yr: 'Best for 5-yr hold. Enough transactions for solid price discovery at exit. Amenity base is full (clubhouse, pool, gym). Maintenance is shared across enough owners to stay affordable. Brand premium intact.',
    forSelfUse: 'Very good — active community without being overwhelming. Known faces + enough new people.',
  },
  {
    id: 'large',
    label: 'Large township',
    unitRange: '800–2,000 units',
    example: 'Brigade Eternia (~1,124), Sattva Lumina (~1,200+)',
    resaleLiquidity: 9,
    amenityDepth: 9,
    communityFeel: 5,
    maintenanceCost: 9,
    priceDiscovery: 9,
    appreciationPremium: 6,
    totalScore: 47,
    tone: 'success' as const,
    forInvestment5yr: 'Excellent for investment. Most transactions, lowest maintenance per unit, strong amenity base holds value. But less "exclusive" — unit looks like hundreds of others on the market at exit. No scarcity premium.',
    forSelfUse: 'Good — full amenity access. Can feel impersonal. RWA management complexity scales with size.',
  },
  {
    id: 'mega',
    label: 'Mega township',
    unitRange: '3,000+ units / integrated',
    example: 'Tata Carnatica (~5,000+ units across phases)',
    resaleLiquidity: 7,
    amenityDepth: 10,
    communityFeel: 4,
    maintenanceCost: 10,
    priceDiscovery: 8,
    appreciationPremium: 5,
    totalScore: 44,
    tone: 'info' as const,
    forInvestment5yr: 'Mixed. Amenity depth is best-in-class and maintenance cost per unit is lowest. But the sheer supply of identical units within the township suppresses price differentiation — you are competing with 5,000 sellers at exit.',
    forSelfUse: 'Depends on personality — resort-like amenities but you can go weeks without meeting your neighbours. Best for families. Less social for a single adult.',
  },
];

// ── Hold period analysis ────────────────────────────────────────────────────

const HOLD = [
  {
    prop: 'Purva Zenium 2',
    builder: 'Puravankara',
    possession: 'Jun 2027',
    possessionYrs: 2.2,
    exitWindow: 'Jun 2030 (3 yr hold) or Jun 2032 (5 yr hold)',
    rentMonths: 14,
    rentCost: '~₹5.6L',
    holdVerdict: 'Best for 5-yr strategy — earliest possession means 3 full years of rental income or self-use before a 2030 exit window. STRR and Metro 2B timeline aligns with your exit.',
    tone: 'success' as const,
  },
  {
    prop: 'Prestige Avon',
    builder: 'Prestige',
    possession: 'Dec 2028',
    possessionYrs: 3.7,
    exitWindow: 'Dec 2031 (3 yr hold) or Dec 2033 (5 yr hold)',
    rentMonths: 32,
    rentCost: '~₹12.8L',
    holdVerdict: 'Moderate — long pre-possession rent burn. If held to Dec 2033, infra catalysts (STRR, Metro) are confirmed, which helps exit. But the price premium already bakes in some of that.',
    tone: 'warning' as const,
  },
  {
    prop: 'Sattva Lumina',
    builder: 'Sattva',
    possession: 'Nov 2029',
    possessionYrs: 5.0,
    exitWindow: 'Nov 2032 (3 yr) or Nov 2034 (5 yr)',
    rentMonths: 43,
    rentCost: '~₹17.2L',
    holdVerdict: 'Weakest for 5-yr hold — possession coincides almost exactly with your 5-yr target, leaving almost no ownership window. Good only if you plan to hold 8–10 years total.',
    tone: 'warning' as const,
  },
  {
    prop: 'Brigade Eternia',
    builder: 'Brigade',
    possession: 'Mar 2030',
    possessionYrs: 5.2,
    exitWindow: 'Mar 2033 (3 yr) or Mar 2035 (5 yr)',
    rentMonths: 47,
    rentCost: '~₹18.8L',
    holdVerdict: 'Similar to Sattva — possession lands at or past your 5-yr mark. Strong for long hold (8–10 yr) or self-use. BDA Yelahanka NT address has strong resale ceiling but you need time post-possession.',
    tone: 'warning' as const,
  },
  {
    prop: 'Tata Varnam',
    builder: 'Tata Housing',
    possession: 'Dec 2029',
    possessionYrs: 4.7,
    exitWindow: 'Dec 2032 (3 yr) or Dec 2034 (5 yr)',
    rentMonths: 43,
    rentCost: '~₹17.2L',
    holdVerdict: 'Challenging for 5-yr exit. Almost all 5 years consumed in UC phase. Best viewed as a 10-yr hold for the Devanahalli Aerospace SEZ appreciation story. Not the right vehicle if exit in ~5 yr is important.',
    tone: 'danger' as const,
  },
];

// ── Area × type matrix ──────────────────────────────────────────────────────

const MATRIX = [
  {
    area: 'Hosahalli · Airport Rd',
    bestType: 'Mid-rise apartment, mid-size 400–600 units',
    why: 'Emerging area — scarcity plays are premature. Mid-size township from a Grade A builder gives brand safety + enough transaction history at resale. Boutique risks being hard to price.',
    exitBuyer: 'IT professional working near Manyata or airport belt; early-stage area buyer seeking entry price',
    rating: 7,
    tone: 'info' as const,
  },
  {
    area: 'Thanisandra / Nagavara',
    bestType: 'Mid-rise apartment, any scale (boutique to large)',
    why: 'Established micro-market with deep transaction history. Any Grade A apartment type sells. Boutique gets exclusivity premium; large township gets liquidity. Both work.',
    exitBuyer: 'Manyata/Embassy employee; family upgrading from 2 BHK rental; NRI investor',
    rating: 9,
    tone: 'success' as const,
  },
  {
    area: 'Yelahanka / Rajanukunte',
    bestType: 'Large township apartment (1,000+ units)',
    why: 'Rajanukunte pocket is still developing socially — township self-sufficiency (3 clubhouses, in-campus retail) matters more here than in an established zone. Scale = lower unit maintenance and amenity depth.',
    exitBuyer: 'Family with school-going children; WFH-primary professional seeking greenery + space',
    rating: 7,
    tone: 'info' as const,
  },
  {
    area: 'Yelahanka NT (BDA)',
    bestType: 'Mid-to-large apartment in BDA-layout address',
    why: 'BDA-planned sector with established roads, water, and social infra. Scale adds liquidity. Boutique also works here because the location is established enough that scarcity premium is achievable.',
    exitBuyer: 'Young family seeking best schools + parks; upgrade buyer from Yelahanka Old Town',
    rating: 9,
    tone: 'success' as const,
  },
  {
    area: 'Devanahalli / Shettigere',
    bestType: 'Integrated mega township ONLY (e.g. Tata Carnatica)',
    why: 'Area is too emerging and infrastructure-thin for standalone apartments or boutique projects to hold value reliably. Only a mega township with its own water, retail, school, and hospital plan can de-risk the location.',
    exitBuyer: 'Aerospace SEZ employee (2030+); airport adjacent buyer; long-hold investor',
    rating: 5,
    tone: 'warning' as const,
  },
];

// ── Component ────────────────────────────────────────────────────────────────

export default function PropertyTypeStrategy() {
  const [tab, setTab] = useCanvasState<Tab>('stratTab', 'type');
  const [typeIdx, setTypeIdx] = useCanvasState<number>('typeIdx', 0);
  const [scaleIdx, setScaleIdx] = useCanvasState<number>('scaleIdx', 1);

  const activeType  = TYPES[typeIdx as number]  ?? TYPES[0];
  const activeScale = SCALES[scaleIdx as number] ?? SCALES[1];

  return (
    <Stack gap={28} style={{ padding: '24px 28px', maxWidth: 1020 }}>

      {/* ── Header ── */}
      <Stack gap={4}>
        <H1>Criterion 4 — Property Type & Strategy</H1>
        <Text tone="secondary">
          Given North BLR areas + ~5-year hold: what property type, community scale, and possession timeline gives the best entry and exit outcome?
        </Text>
      </Stack>

      {/* ── Summary answer ── */}
      <Grid columns={4} gap={14}>
        <Stat value="Apartment"          label="Right property type"    tone="success" />
        <Stat value="Mid-size (400–700)" label="Optimal community scale" tone="success" />
        <Stat value="2027–2028"          label="Target possession"       tone="info" />
        <Stat value="Purva / Prestige"   label="Best fit for 5-yr hold"  tone="success" />
      </Grid>

      <Divider />

      {/* ── Tab nav ── */}
      <Row gap={6} wrap>
        <Pill active={tab === 'type'}   onClick={() => setTab('type')}>Property type</Pill>
        <Pill active={tab === 'scale'}  onClick={() => setTab('scale')}>Community scale</Pill>
        <Pill active={tab === 'hold'}   onClick={() => setTab('hold')}>5-year hold analysis</Pill>
        <Pill active={tab === 'matrix'} onClick={() => setTab('matrix')}>Area × type matrix</Pill>
      </Row>

      {/* ══════════════════════════════════════════════════════════════════════
          TAB 1 — PROPERTY TYPE
      ══════════════════════════════════════════════════════════════════════ */}
      {tab === 'type' && (
        <Stack gap={20}>

          <Stack gap={10}>
            <H2>Type comparison at a glance</H2>
            <Table
              headers={['Type', 'Budget in North BLR', 'Resale liquidity', 'Appreciation', 'Rental yield', 'Buyer pool', 'Total']}
              rows={TYPES.map(t => [
                t.label,
                t.budget,
                `${t.liquidity5yr}/10`,
                `${t.appreciation5yr}/10`,
                `${t.rentalYield}/10`,
                `${t.buyerPool}/10`,
                `${t.overallScore}/50`,
              ])}
              rowTone={TYPES.map(t => t.tone)}
              striped
            />
          </Stack>

          <Stack gap={8}>
            <H3>Score comparison</H3>
            <BarChart
              categories={TYPES.map(t => t.label.split('(')[0].trim())}
              series={[
                { name: 'Resale liquidity', data: TYPES.map(t => t.liquidity5yr) },
                { name: 'Appreciation',     data: TYPES.map(t => t.appreciation5yr) },
                { name: 'Rental yield',     data: TYPES.map(t => t.rentalYield) },
                { name: 'Buyer pool',       data: TYPES.map(t => t.buyerPool) },
              ]}
              stacked={false}
              height={240}
            />
          </Stack>

          <Stack gap={10}>
            <H2>Deep dive</H2>
            <Row gap={6} wrap>
              {TYPES.map((t, i) => (
                <Pill key={t.id} active={typeIdx === i} onClick={() => setTypeIdx(i)} tone={t.tone}>
                  {t.label.split('(')[0].trim()}
                </Pill>
              ))}
            </Row>

            <Card>
              <CardHeader trailing={<Pill tone={activeType.tone} size="sm">{activeType.budget}</Pill>}>
                {activeType.label}
              </CardHeader>
              <CardBody>
                <Stack gap={12}>
                  <Text size="small" weight="semibold" tone="secondary">{activeType.verdict}</Text>
                  <Grid columns={2} gap={14}>
                    <Stack gap={6}>
                      <Text size="small" weight="semibold">Why it works</Text>
                      {activeType.pros.map((p: string, i: number) => (
                        <Row key={i} gap={6} style={{ alignItems: 'flex-start' }}>
                          <Text size="small" tone="secondary" style={{ minWidth: 12 }}>+</Text>
                          <Text size="small" tone="secondary">{p}</Text>
                        </Row>
                      ))}
                    </Stack>
                    <Stack gap={6}>
                      <Text size="small" weight="semibold">Watch out for</Text>
                      {activeType.cons.map((c: string, i: number) => (
                        <Row key={i} gap={6} style={{ alignItems: 'flex-start' }}>
                          <Text size="small" tone="secondary" style={{ minWidth: 12 }}>−</Text>
                          <Text size="small" tone="secondary">{c}</Text>
                        </Row>
                      ))}
                    </Stack>
                  </Grid>
                  <Card>
                    <CardHeader trailing={<Pill size="sm">North BLR context</Pill>}>In your search</CardHeader>
                    <CardBody><Text size="small" tone="secondary">{activeType.northBlrContext}</Text></CardBody>
                  </Card>
                </Stack>
              </CardBody>
            </Card>
          </Stack>

        </Stack>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          TAB 2 — COMMUNITY SCALE
      ══════════════════════════════════════════════════════════════════════ */}
      {tab === 'scale' && (
        <Stack gap={20}>

          <Stack gap={10}>
            <H2>Scale comparison</H2>
            <Table
              headers={['Scale', 'Units', 'Resale liquidity', 'Amenities', 'Community feel', 'Maint. cost', 'Price discovery', 'Total']}
              rows={SCALES.map(s => [
                s.label,
                s.unitRange,
                `${s.resaleLiquidity}/10`,
                `${s.amenityDepth}/10`,
                `${s.communityFeel}/10`,
                `${s.maintenanceCost}/10`,
                `${s.priceDiscovery}/10`,
                `${s.totalScore}/60`,
              ])}
              rowTone={SCALES.map(s => s.tone)}
              striped
            />
            <Text size="small" tone="secondary">
              Maintenance cost score: higher = better (lower per-unit cost). Mid-size and large townships share costs across enough owners to keep per-flat maintenance affordable.
            </Text>
          </Stack>

          <Stack gap={8}>
            <H3>Scale score breakdown</H3>
            <BarChart
              categories={SCALES.map(s => s.label)}
              series={[
                { name: 'Resale liquidity',  data: SCALES.map(s => s.resaleLiquidity) },
                { name: 'Community feel',    data: SCALES.map(s => s.communityFeel) },
                { name: 'Price discovery',   data: SCALES.map(s => s.priceDiscovery) },
                { name: 'Appreciation edge', data: SCALES.map(s => s.appreciationPremium) },
              ]}
              stacked={false}
              height={220}
            />
          </Stack>

          <Stack gap={10}>
            <H2>Scale deep dive</H2>
            <Row gap={6} wrap>
              {SCALES.map((s, i) => (
                <Pill key={s.id} active={scaleIdx === i} onClick={() => setScaleIdx(i)} tone={s.tone}>
                  {s.label}
                </Pill>
              ))}
            </Row>

            <Grid columns={3} gap={12}>
              <Stat value={activeScale.unitRange} label="Unit range" />
              <Stat value={activeScale.example.split('(')[0].trim()} label="Example" />
              <Stat value={`${activeScale.totalScore}/60`} label="Total score"
                tone={activeScale.totalScore >= 45 ? 'success' : undefined} />
            </Grid>

            <Grid columns={2} gap={14}>
              <Card>
                <CardHeader trailing={<Pill tone="info" size="sm">Investment</Pill>}>For 5-year hold</CardHeader>
                <CardBody><Text size="small" tone="secondary">{activeScale.forInvestment5yr}</Text></CardBody>
              </Card>
              <Card>
                <CardHeader trailing={<Pill tone="success" size="sm">Self-use</Pill>}>For daily living</CardHeader>
                <CardBody><Text size="small" tone="secondary">{activeScale.forSelfUse}</Text></CardBody>
              </Card>
            </Grid>
          </Stack>

          <Card>
            <CardHeader trailing={<Pill tone="success" size="sm">Recommendation</Pill>}>
              The sweet spot for your profile
            </CardHeader>
            <CardBody>
              <Stack gap={8}>
                <Text size="small">
                  For a single WFH adult buying to hold ~5 years: <Text weight="semibold">mid-size (400–700 units)</Text> is the sweet spot.
                </Text>
                <Table
                  headers={['Why mid-size wins', 'Detail']}
                  rows={[
                    ['Resale liquidity',    'Enough transactions quarterly for solid price discovery — you won\'t wait 12+ months to find a buyer'],
                    ['Amenity access',      'Full clubhouse, gym, pool — not boutique-sparse, not mega-impersonal'],
                    ['Maintenance costs',   'Split across 400+ flats = ₹4,000–8,000/month typically; affordable even if you rent it out'],
                    ['Community feel',      'You actually recognise your neighbours — matters for a single adult\'s safety and social life'],
                    ['Market positioning',  'Easier to argue for a premium at exit: "not one of 2,000 identical units but a quality boutique-ish project"'],
                    ['Builder selection',   'Most Grade A builders (Puravankara Phase 2, Brigade mid-range) hit this scale — not a constraint'],
                  ]}
                  striped
                />
              </Stack>
            </CardBody>
          </Card>

        </Stack>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          TAB 3 — 5-YEAR HOLD ANALYSIS
      ══════════════════════════════════════════════════════════════════════ */}
      {tab === 'hold' && (
        <Stack gap={20}>

          <Stack gap={8}>
            <H2>The possession timing problem</H2>
            <Text size="small" tone="secondary">
              A 5-year hold from today (~Apr 2025) means an exit window around 2030. The key insight: if a property hands over in Nov 2029, you have almost no ownership time before your exit target — you pay rent for 4+ years, then immediately need to sell. That is not a hold — it is a sequence of risks with no upside window.
            </Text>
          </Stack>

          <Table
            headers={['Property', 'Possession', 'Rent burn period', 'Rent cost (₹40K/mo)', 'Ownership before 2030 exit', 'Hold verdict']}
            rows={HOLD.map(h => [
              h.prop,
              h.possession,
              `${h.rentMonths} months`,
              h.rentCost,
              h.possessionYrs <= 2.5
                ? `~3 years of ownership`
                : h.possessionYrs <= 4.0
                  ? `~1–2 years of ownership`
                  : `~0–1 year of ownership`,
              h.possessionYrs <= 2.5 ? 'Best for 5-yr hold' : h.possessionYrs <= 4.0 ? 'Tight' : 'Poor for 5-yr exit',
            ])}
            rowTone={HOLD.map(h => h.tone)}
            striped
          />

          <Stack gap={10}>
            {HOLD.map(h => (
              <Card key={h.prop}>
                <CardHeader trailing={<Pill tone={h.tone} size="sm">{h.possession}</Pill>}>
                  {h.prop} — {h.builder}
                </CardHeader>
                <CardBody>
                  <Stack gap={6}>
                    <Text size="small" tone="secondary">{h.holdVerdict}</Text>
                    <Row gap={8}>
                      <Text size="small" weight="semibold">Exit window:</Text>
                      <Text size="small" tone="secondary">{h.exitWindow}</Text>
                    </Row>
                  </Stack>
                </CardBody>
              </Card>
            ))}
          </Stack>

          <Card>
            <CardHeader trailing={<Pill tone="info" size="sm">Key insight</Pill>}>
              Possession date IS part of the investment thesis
            </CardHeader>
            <CardBody>
              <Stack gap={8}>
                <Text size="small">
                  For a ~5-year hold, you need possession by <Text weight="semibold">mid-2027 to mid-2028 at the latest</Text> to have a meaningful ownership window before your exit target.
                </Text>
                <Table
                  headers={['Scenario', 'Possession', 'Strategy']}
                  rows={[
                    ['Best case',    'Jun 2027 (Purva)',      'Possess → rent immediately → 3 years rental income → sell into 2030 infrastructure re-rating'],
                    ['Acceptable',   'Dec 2028 (Prestige)',   'Possess → self-use or rent → 1.5–2 years before 2030 window — short but workable'],
                    ['Risky',        'Nov–Dec 2029 (Sattva, Tata)', 'Possess → almost no time before 5-yr mark; forces either a quick sale or extending hold to 8+ years'],
                    ['Problematic',  'Mar 2030 (Brigade)',    'Possession lands on the 5-yr mark — you start ownership just as you planned to exit'],
                  ]}
                  rowTone={['success', 'info', 'warning', 'danger']}
                  striped
                />
              </Stack>
            </CardBody>
          </Card>

        </Stack>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          TAB 4 — AREA × TYPE MATRIX
      ══════════════════════════════════════════════════════════════════════ */}
      {tab === 'matrix' && (
        <Stack gap={20}>

          <Stack gap={8}>
            <H2>What type works best, by area</H2>
            <Text size="small" tone="secondary">
              The right property type is not the same across all North BLR locations. An emerging area like Devanahalli needs a different product to preserve value vs an established zone like Thanisandra.
            </Text>
          </Stack>

          <Table
            headers={['Area', 'Best type & scale', 'Why', 'Exit buyer profile', 'Rating']}
            rows={MATRIX.map(m => [m.area, m.bestType, m.why, m.exitBuyer, `${m.rating}/10`])}
            rowTone={MATRIX.map(m => m.tone)}
            striped
          />

          <Divider />

          <Stack gap={10}>
            <H2>Synthesis — optimal combination for ~5-year hold</H2>
            <Card>
              <CardHeader trailing={<Pill tone="success" size="sm">Decision</Pill>}>
                Type + scale + area + possession = the full picture
              </CardHeader>
              <CardBody>
                <Table
                  headers={['Dimension', 'Best choice', 'Reasoning']}
                  rows={[
                    ['Property type',    'Apartment in Grade A gated community',          'Only viable type at ₹3 Cr in North BLR; deepest buyer pool at exit; rental income during hold'],
                    ['Community scale',  'Mid-size 400–700 units (or large 800–1,200)',    'Mid-size balances liquidity, community, and amenity; large township if area is still emerging'],
                    ['Area priority',    'Thanisandra or Yelahanka NT',                    'Deepest resale markets; established IT demand; 5-yr exit buyers are plentiful'],
                    ['Area secondary',   'Hosahalli (Purva Zenium 2)',                     'Earliest possession = more ownership time = more practical for 5-yr hold despite thinner resale pool'],
                    ['Avoid for 5-yr',  'Devanahalli for a 5-yr exit',                    'Possession 2029 + thin social infra + unconfirmed Aerospace SEZ = needs 10-yr hold to play out'],
                    ['Possession target','Jun 2027 – Dec 2028',                            'Any possession after mid-2029 squeezes your ownership window into near-zero for a 5-yr exit'],
                    ['Exit buyer',       'IT professional or family in 28–38 age band',    'Most abundant buyer type in North BLR in 2030; size your flat to their needs (3 BHK, WFH room)'],
                  ]}
                  rowTone={['success', 'success', 'success', 'info', 'danger', 'success', 'info']}
                  striped
                />
              </CardBody>
            </Card>
          </Stack>

        </Stack>
      )}

    </Stack>
  );
}
