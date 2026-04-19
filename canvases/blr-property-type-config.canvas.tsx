import {
  BarChart,
  Card, CardBody, CardHeader,
  Divider, Grid, H1, H2, H3,
  Pill, Row, Stack, Stat, Table, Text,
  useCanvasState,
} from 'cursor/canvas';

// ── Criterion 4 — Property Type & Hold Strategy ───────────────────────────
// For a ~5-year hold in North BLR, what property CHARACTERISTICS should you
// optimise for? Not which specific property — what TYPE of property,
// what community density, what UDS profile, and what structural attributes
// compound best over a 5-year ownership window.

type Tab = 'type' | 'uds' | 'density' | 'hold';

// ── Property type data ──────────────────────────────────────────────────────

const TYPES = [
  {
    id: 'apt',
    label: 'Apartment — Grade A gated',
    budget: '₹1.2–3 Cr',
    udsProfile: 'Depends on density: can range from 300 sqft (dense tower) to 2,000+ sqft (low-density boutique)',
    landAppreciation: 'You capture land appreciation proportional to UDS',
    liquidityScore: 9, appreciationScore: 8, rentalScore: 7, maintenanceScore: 7, buyerPoolScore: 9,
    total: 40, tone: 'success' as const,
    holdAdvice: 'Best product for ₹3 Cr in North BLR. Prioritise projects with highest UDS per rupee spent. A low-density apartment on a large plot beats a high-density tower on a small one — even at the same price.',
  },
  {
    id: 'villa',
    label: 'Villa — gated community',
    budget: '₹4–10 Cr+ in North BLR',
    udsProfile: 'Very high UDS — you own the land under your villa, typically 1,200–3,000 sqft',
    landAppreciation: 'Maximum — most of the asset value is land',
    liquidityScore: 4, appreciationScore: 10, rentalScore: 4, maintenanceScore: 3, buyerPoolScore: 4,
    total: 25, tone: 'warning' as const,
    holdAdvice: 'Exceptional UDS and appreciation but out of ₹3 Cr budget for Grade A North BLR. Small buyer pool means a 5-yr exit can sit on market for 6–12 months.',
  },
  {
    id: 'rowhouse',
    label: 'Row house / Townhouse',
    budget: '₹2.5–5 Cr in North BLR',
    udsProfile: 'High UDS — typically 600–1,500 sqft land per unit',
    landAppreciation: 'Strong — good land-to-building ratio',
    liquidityScore: 4, appreciationScore: 9, rentalScore: 5, maintenanceScore: 4, buyerPoolScore: 3,
    total: 25, tone: 'warning' as const,
    holdAdvice: 'Good UDS and appreciation but thin resale market. Very few Grade A row house projects at ₹3 Cr in North BLR. Niche buyer profile slows exit.',
  },
  {
    id: 'plot',
    label: 'Residential plot (NA/DC)',
    budget: '₹50L–3 Cr',
    udsProfile: '100% land ownership — no building depreciation ever',
    landAppreciation: 'Maximum possible — pure land play',
    liquidityScore: 4, appreciationScore: 10, rentalScore: 1, maintenanceScore: 10, buyerPoolScore: 5,
    total: 30, tone: 'danger' as const,
    holdAdvice: 'Best land appreciation but zero rental income, complex legal diligence, and wrong profile fit for a first-time buyer. Home loan terms are restrictive (50–60% LTV vs 80–90% for apartments).',
  },
];

// ── UDS worked examples ─────────────────────────────────────────────────────

// UDS per flat = (Individual flat carpet area / Total carpet area of all flats) × Total plot area
// Simplified: UDS ≈ (Plot area sqft / Number of units) × (Your flat carpet / Average flat carpet)

interface UdsExample {
  label: string;
  plotAcres: number;
  units: number;
  avgCarpetSqft: number;
  yourCarpetSqft: number;
  densityType: string;
  udsSqft: number;   // computed
  tone: 'success' | 'warning' | 'info';
}

const UDS_EXAMPLES: UdsExample[] = [
  { label: 'Boutique — 10 ac, 230 units',        plotAcres: 10, units: 230,  avgCarpetSqft: 1200, yourCarpetSqft: 1200, densityType: 'Low density',    udsSqft: 0, tone: 'success' },
  { label: 'Mid-size — 6 ac, 500 units',          plotAcres:  6, units: 500,  avgCarpetSqft: 1100, yourCarpetSqft: 1200, densityType: 'Medium density',  udsSqft: 0, tone: 'info'    },
  { label: 'Large township — 14 ac, 1,100 units', plotAcres: 14, units: 1100, avgCarpetSqft: 1200, yourCarpetSqft: 1250, densityType: 'Medium-high',     udsSqft: 0, tone: 'info'    },
  { label: 'Dense township — 12 ac, 1,200 units', plotAcres: 12, units: 1200, avgCarpetSqft: 1200, yourCarpetSqft: 1200, densityType: 'High density',    udsSqft: 0, tone: 'warning' },
  { label: 'Mega campus — 70 ac, 2,500 units',    plotAcres: 70, units: 2500, avgCarpetSqft: 1350, yourCarpetSqft: 1350, densityType: 'Low-med density', udsSqft: 0, tone: 'success' },
];

UDS_EXAMPLES.forEach(e => {
  const plotSqft     = e.plotAcres * 43560;
  const totalCarpet  = e.units * e.avgCarpetSqft;
  e.udsSqft = Math.round((e.yourCarpetSqft / totalCarpet) * plotSqft);
});

// ── Hold period characteristics ─────────────────────────────────────────────

const HOLD_CHARS = [
  {
    attribute: 'UDS (land ownership)',
    for5yr: 'Critical — land appreciates 10–15% p.a. in North BLR; structure depreciates ~2% p.a. Higher UDS = more of your value is in appreciating land.',
    target: 'Target ≥ 600 sqft UDS for 3 BHK in mid-size project',
    tone: 'success' as const,
  },
  {
    attribute: 'Plot area per unit (density)',
    for5yr: 'Lower density = higher UDS per flat = more land per rupee. A 500-unit project on 10 acres gives you ~870 sqft land/unit; a 1,200-unit project on 12 acres gives ~435 sqft/unit.',
    target: 'Target ≥ 600 sqft plot area per unit at the project level',
    tone: 'success' as const,
  },
  {
    attribute: 'Building height (G+X)',
    for5yr: 'Shorter building on same land = fewer units = higher UDS per flat. A G+10 building and a G+29 building on the same plot have very different UDS profiles even if the flat is identical.',
    target: 'Prefer G+10 to G+20 vs G+29 if choosing between projects on equal land',
    tone: 'info' as const,
  },
  {
    attribute: 'FSI / FAR utilisation',
    for5yr: 'Projects that use less than maximum FSI have future development optionality — more floor space could be added if BBMP increases FAR. This creates optionality value at resale.',
    target: 'Ask builder what FSI was utilised vs allowed maximum',
    tone: 'info' as const,
  },
  {
    attribute: 'Possession timing',
    for5yr: 'For a 5-yr exit target (~2030), possession by mid-2028 is the latest that gives you meaningful ownership time to generate rent + appreciation before selling.',
    target: 'Possession ≤ mid-2028 for a 5-yr exit thesis to work',
    tone: 'warning' as const,
  },
  {
    attribute: 'Builder brand at resale',
    for5yr: 'Tata, Prestige, Brigade, Puravankara command 8–15% premium over unknown builders in the resale market. The brand is worth real rupees in 2030.',
    target: 'Grade A NSE-listed or Tata Group only',
    tone: 'success' as const,
  },
  {
    attribute: 'Flat size (carpet area)',
    for5yr: 'Larger flat = higher UDS + higher rent achievable + stronger appeal to the 2030 buyer (WFH is now normalised). 3 BHK with ≥1,050 sqft carpet is the sweet spot.',
    target: '3 BHK, ≥1,050 sqft carpet, ≤32% loading',
    tone: 'success' as const,
  },
  {
    attribute: 'Khata & title clarity',
    for5yr: 'At resale in 2030, A-Khata and clear title are non-negotiable for your buyer to get a loan. B-Khata property will not get standard bank financing. Title defects destroy exit options.',
    target: 'A-Khata (BBMP) or BDA-approved only',
    tone: 'warning' as const,
  },
];

// ── Density comparison ──────────────────────────────────────────────────────

const DENSITY_TYPES = [
  {
    label: 'High density',
    typical: 'G+25 to G+40 towers, 1,000+ units on ≤ 15 acres',
    udsPer3bhk: '250–450 sqft',
    amenities: 'Extensive (large project budget)',
    resaleLiquidity: 'High (many transactions)',
    appreciationProfile: 'Structure-heavy — more depreciation risk over time',
    maintenanceCost: 'Low per flat',
    forInvestor: 'Good short-term rental yield; weaker long-term land appreciation',
    tone: 'warning' as const,
  },
  {
    label: 'Medium density',
    typical: 'G+10 to G+20, 300–700 units on 5–15 acres',
    udsPer3bhk: '500–900 sqft',
    amenities: 'Full (clubhouse, pool, gym)',
    resaleLiquidity: 'Good (regular transactions)',
    appreciationProfile: 'Balanced — good land + structure mix',
    maintenanceCost: 'Moderate',
    forInvestor: 'Best combination for a 5-yr hold — land appreciation + rental yield + exit liquidity',
    tone: 'success' as const,
  },
  {
    label: 'Low density (boutique)',
    typical: 'G+5 to G+12, 100–250 units on 5–12 acres',
    udsPer3bhk: '1,200–3,000 sqft',
    amenities: 'Good but smaller scale',
    resaleLiquidity: 'Moderate (fewer transactions)',
    appreciationProfile: 'Land-heavy — best long-term appreciation per rupee',
    maintenanceCost: 'Moderate-high per flat (fewer owners to share)',
    forInvestor: 'Best UDS and long-term land appreciation; slightly harder 5-yr exit due to thin buyer pool',
    tone: 'info' as const,
  },
  {
    label: 'Mega township',
    typical: '50–150+ acres, 3,000–10,000 units across phases',
    udsPer3bhk: '700–1,500 sqft (varies by phase)',
    amenities: 'Resort-grade (school, hospital, retail planned)',
    resaleLiquidity: 'Moderate-high within township brand',
    appreciationProfile: 'Land-rich at launch; supply from future phases can cap short-term price',
    maintenanceCost: 'Lowest per flat (shared across 5,000+ units)',
    forInvestor: 'Best for 10-yr hold when township amenities fully develop. For 5-yr hold, competing with newer phases at exit is the main risk.',
    tone: 'info' as const,
  },
];

// ── Component ────────────────────────────────────────────────────────────────

export default function PropertyTypeStrategy() {
  const [tab, setTab]     = useCanvasState<Tab>('stratTab', 'uds');
  const [typeIdx, setTypeIdx] = useCanvasState<number>('typeIdx', 0);
  const [sba, setSba]     = useCanvasState<number>('udsSba', 1600);

  const activeType = TYPES[typeIdx as number] ?? TYPES[0];

  // Live UDS calc for user's SBA
  const loadingScenarios = [
    { label: 'Boutique 10ac/230u', plotAcres: 10, units: 230 },
    { label: 'Mid-size 6ac/500u',  plotAcres:  6, units: 500 },
    { label: 'Large 14ac/1100u',   plotAcres: 14, units: 1100 },
    { label: 'Dense 12ac/1200u',   plotAcres: 12, units: 1200 },
    { label: 'Mega 70ac/2500u',    plotAcres: 70, units: 2500 },
  ];

  return (
    <Stack gap={28} style={{ padding: '24px 28px', maxWidth: 1020 }}>

      {/* ── Header ── */}
      <Stack gap={4}>
        <H1>Criterion 4 — Property Type & Hold Strategy</H1>
        <Text tone="secondary">
          For a ~5-year hold in North BLR: what property TYPE, community DENSITY, and UDS profile compound best? This is a characteristics framework — not a specific property selection.
        </Text>
      </Stack>

      {/* ── Summary answer ── */}
      <Grid columns={4} gap={14}>
        <Stat value="Apartment"         label="Right type at ₹3 Cr"       tone="success" />
        <Stat value="Medium density"    label="Optimal community density"  tone="success" />
        <Stat value="≥ 600 sqft"        label="Target UDS per 3 BHK"       tone="info" />
        <Stat value="≤ mid-2028"        label="Latest possession for 5-yr" tone="warning" />
      </Grid>

      <Divider />

      {/* ── Tab nav ── */}
      <Row gap={6} wrap>
        <Pill active={tab === 'uds'}     onClick={() => setTab('uds')}>UDS — land ownership</Pill>
        <Pill active={tab === 'density'} onClick={() => setTab('density')}>Community density</Pill>
        <Pill active={tab === 'hold'}    onClick={() => setTab('hold')}>5-yr hold checklist</Pill>
        <Pill active={tab === 'type'}    onClick={() => setTab('type')}>Property type</Pill>
      </Row>

      {/* ══════════════════════════════════════════════════════════════════════
          TAB 1 — UDS
      ══════════════════════════════════════════════════════════════════════ */}
      {tab === 'uds' && (
        <Stack gap={20}>

          <Card>
            <CardHeader trailing={<Pill tone="success" size="sm">Most overlooked factor</Pill>}>
              What is UDS and why does it matter for a 5-year hold?
            </CardHeader>
            <CardBody>
              <Stack gap={10}>
                <Text size="small">
                  When you buy an apartment, you own two things: <Text weight="semibold">(1) your flat (the structure)</Text> and <Text weight="semibold">(2) a proportionate share of the land the building stands on</Text>. That land share is your Undivided Share of Land — UDS.
                </Text>
                <Table
                  headers={['What happens over 5 years', 'Impact on your asset']}
                  rows={[
                    ['Your flat (structure) depreciates',       '~1–2% per year — materials age, fittings become dated, building ages'],
                    ['Your UDS (land) appreciates',             '8–15% per year in North BLR — land is finite; city expands toward your area'],
                    ['Net effect on a high-UDS flat',           'Land appreciation outpaces structural depreciation → real value grows'],
                    ['Net effect on a low-UDS flat',            'Structural depreciation is less offset by land → value growth is weaker relative to peers'],
                    ['At resale, buyers value land component',  'Higher UDS = stronger floor price even if you\'re competing with newer inventory'],
                  ]}
                  rowTone={['warning', 'success', 'success', 'danger', 'success']}
                  striped
                />
              </Stack>
            </CardBody>
          </Card>

          <Stack gap={10}>
            <H2>UDS formula</H2>
            <Card>
              <CardBody>
                <Stack gap={8}>
                  <Text size="small" weight="semibold">
                    UDS (sqft) = (Your flat carpet area ÷ Total carpet area of all flats in project) × Total plot area (sqft)
                  </Text>
                  <Text size="small" tone="secondary">
                    Simplified: UDS ≈ Plot area per unit × (Your carpet / Average carpet)
                  </Text>
                  <Text size="small" tone="secondary">
                    The two levers: <Text weight="semibold">more land per unit</Text> (fewer units on same plot) and <Text weight="semibold">larger flat</Text> (your carpet is a bigger share of total). Both increase your UDS.
                  </Text>
                </Stack>
              </CardBody>
            </Card>
          </Stack>

          <Stack gap={10}>
            <H2>UDS comparison across project types</H2>
            <Text size="small" tone="secondary">
              Same flat, very different land ownership depending on project density. This is what matters for long-term appreciation.
            </Text>
            <Table
              headers={['Project type', 'Density', 'Plot area', 'Units', 'Your UDS (3 BHK ~1,200 sqft carpet)', 'Land value at ₹3,000/sqft UDS']}
              rows={UDS_EXAMPLES.map(e => [
                e.label,
                e.densityType,
                `${e.plotAcres} acres`,
                `${e.units}`,
                `${e.udsSqft.toLocaleString()} sqft`,
                `₹${(e.udsSqft * 3000 / 100000).toFixed(1)}L`,
              ])}
              rowTone={UDS_EXAMPLES.map(e => e.tone)}
              striped
            />
            <Text size="small" tone="secondary">
              Note: UDS land value is a notional figure to illustrate the scale of difference. Actual land value per sqft varies by area. The key takeaway: the boutique project and the mega campus both deliver high UDS — the large dense township on limited land is the weakest.
            </Text>
          </Stack>

          <Stack gap={8}>
            <H3>UDS comparison — bar chart</H3>
            <BarChart
              categories={UDS_EXAMPLES.map(e => e.label.split('—')[0].trim())}
              series={[{ name: 'Your UDS (sqft)', data: UDS_EXAMPLES.map(e => e.udsSqft) }]}
              height={200}
            />
          </Stack>

          <Stack gap={10}>
            <H2>Your UDS calculator — select your SBA</H2>
            <Text size="small" tone="secondary">
              Carpet area ≈ SBA × (1 − loading%). Adjust SBA to see how your UDS changes across project densities.
            </Text>
            <Row gap={6} wrap>
              {[1400, 1500, 1600, 1700, 1800].map(s => (
                <Pill key={s} active={sba === s} onClick={() => setSba(s)}>{s} sqft SBA</Pill>
              ))}
            </Row>
            <Table
              headers={['Project type', 'Your carpet (28% loading)', 'UDS in this project', 'Notional land value (@₹3K/sqft)', 'Better than dense township by']}
              rows={loadingScenarios.map(({ label, plotAcres, units }) => {
                const carpet   = Math.round(sba * 0.72);
                const avgCarp  = 1200;
                const plotSqft = plotAcres * 43560;
                const totalCarp = units * avgCarp;
                const uds      = Math.round((carpet / totalCarp) * plotSqft);
                const denseUds = Math.round((carpet / (1200 * 43560)) * 12 * 43560);   // 12ac/1200u baseline
                const premium  = Math.round(((uds - denseUds) / denseUds) * 100);
                return [
                  label,
                  `${carpet} sqft`,
                  `${uds.toLocaleString()} sqft`,
                  `₹${(uds * 3000 / 100000).toFixed(1)}L`,
                  premium > 0 ? `+${premium}%` : `${premium}%`,
                ];
              })}
              rowTone={loadingScenarios.map(({ plotAcres, units }) => {
                const sqftPerUnit = (plotAcres * 43560) / units;
                return sqftPerUnit >= 700 ? 'success' : sqftPerUnit >= 450 ? 'info' : 'warning';
              })}
              striped
            />
          </Stack>

          <Card>
            <CardHeader trailing={<Pill tone="info" size="sm">Ask this on every visit</Pill>}>
              The 3 UDS questions to ask any builder
            </CardHeader>
            <CardBody>
              <Stack gap={5}>
                {[
                  ['What is the total plot area (in acres)?', 'This tells you the land pool being divided'],
                  ['What is the RERA-registered carpet area for my unit?', 'Your numerator in the UDS formula; use this, not SBA'],
                  ['What is the total RERA carpet area across all units in the project?', 'This is the denominator; dividing land by this gives UDS per sqft of carpet'],
                ].map(([q, why]) => (
                  <Row key={q} gap={8} style={{ alignItems: 'flex-start' }}>
                    <Text size="small" weight="semibold" style={{ minWidth: 6 }}>Q:</Text>
                    <Stack gap={2}>
                      <Text size="small">{q}</Text>
                      <Text size="small" tone="secondary">{why}</Text>
                    </Stack>
                  </Row>
                ))}
              </Stack>
            </CardBody>
          </Card>

        </Stack>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          TAB 2 — COMMUNITY DENSITY
      ══════════════════════════════════════════════════════════════════════ */}
      {tab === 'density' && (
        <Stack gap={20}>

          <Stack gap={10}>
            <H2>Density types — what they mean for a 5-yr hold</H2>
            <Table
              headers={['Density', 'Typical profile', 'UDS per 3 BHK', 'Amenities', '5-yr resale', 'Appreciation']}
              rows={DENSITY_TYPES.map(d => [
                d.label,
                d.typical,
                d.udsPer3bhk,
                d.amenities,
                d.resaleLiquidity,
                d.appreciationProfile,
              ])}
              rowTone={DENSITY_TYPES.map(d => d.tone)}
              striped
            />
          </Stack>

          <Stack gap={14}>
            {DENSITY_TYPES.map(d => (
              <Card key={d.label}>
                <CardHeader trailing={<Pill tone={d.tone} size="sm">{d.udsPer3bhk} UDS</Pill>}>
                  {d.label} — {d.typical}
                </CardHeader>
                <CardBody>
                  <Stack gap={6}>
                    <Row gap={8} wrap>
                      <Text size="small" weight="semibold">Amenities:</Text>
                      <Text size="small" tone="secondary">{d.amenities}</Text>
                    </Row>
                    <Row gap={8} wrap>
                      <Text size="small" weight="semibold">Maintenance:</Text>
                      <Text size="small" tone="secondary">{d.maintenanceCost}</Text>
                    </Row>
                    <Row gap={8} wrap>
                      <Text size="small" weight="semibold">Appreciation:</Text>
                      <Text size="small" tone="secondary">{d.appreciationProfile}</Text>
                    </Row>
                    <Text size="small" tone="secondary" style={{ marginTop: 4 }}>{d.forInvestor}</Text>
                  </Stack>
                </CardBody>
              </Card>
            ))}
          </Stack>

          <Card>
            <CardHeader trailing={<Pill tone="success" size="sm">For your profile</Pill>}>
              The density trade-off for a single WFH adult, 5-yr hold
            </CardHeader>
            <CardBody>
              <Stack gap={8}>
                <Text size="small">
                  The density decision is actually a trade-off between <Text weight="semibold">UDS / land per rupee</Text> (boutique wins) and <Text weight="semibold">resale liquidity and exit speed</Text> (medium-density wins). For a 5-year hold where you plan to sell, here is the resolution:
                </Text>
                <Table
                  headers={['Scenario', 'Best density choice', 'Why']}
                  rows={[
                    ['Primary goal is self-use + exit flexibility', 'Medium density (400–700 units)', 'Full amenities for daily life; easy exit when you want to sell'],
                    ['Primary goal is maximise land appreciation', 'Low density / boutique (150–300 units)', 'Highest UDS; land appreciation dominates; willing to wait a bit longer for the right buyer'],
                    ['Buying in an emerging area (Hosahalli, Devanahalli)', 'Medium-large or mega township', 'Area is thin — self-sufficiency of township is critical; scale protects value when area social infra is absent'],
                    ['Buying in established area (Thanisandra, Yelahanka NT)', 'Any density works', 'Area has enough social infra to compensate for low-density amenity gap; boutique premium is achievable'],
                  ]}
                  rowTone={['success', 'info', 'warning', 'success']}
                  striped
                />
              </Stack>
            </CardBody>
          </Card>

        </Stack>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          TAB 3 — 5-YR HOLD CHECKLIST
      ══════════════════════════════════════════════════════════════════════ */}
      {tab === 'hold' && (
        <Stack gap={20}>

          <Stack gap={8}>
            <H2>Characteristics that compound best over 5 years</H2>
            <Text size="small" tone="secondary">
              These are the property-level attributes to check when evaluating ANY project in North BLR — not specific to the current shortlist. Apply this as a filter to every property you consider.
            </Text>
          </Stack>

          <Table
            headers={['Attribute', 'Why it matters for 5-yr hold', 'Target for your search']}
            rows={HOLD_CHARS.map(h => [h.attribute, h.for5yr, h.target])}
            rowTone={HOLD_CHARS.map(h => h.tone)}
            striped
          />

          <Divider />

          <Stack gap={10}>
            <H2>The land vs structure split — a 5-year model</H2>
            <Card>
              <CardBody>
                <Stack gap={10}>
                  <Text size="small">
                    When you buy an apartment at ₹2 Cr, roughly <Text weight="semibold">40–55% of the value is land (UDS)</Text> and 45–60% is structure, depending on project density. Over 5 years:
                  </Text>
                  <Table
                    headers={['Component', 'Value at entry', '5-yr change', 'Value at exit (est.)']}
                    rows={[
                      ['Land (high UDS: 800 sqft @ ₹2K/sqft)', '₹160L', '+50% (8–10% p.a.)', '₹240L'],
                      ['Land (low UDS: 300 sqft @ ₹2K/sqft)',  '₹60L',  '+50% (8–10% p.a.)', '₹90L'],
                      ['Structure (both cases)',                 '₹140L', '−10% (depreciation)', '₹126L'],
                      ['Total exit — high UDS flat',            '₹300L', '+22%',                '₹366L'],
                      ['Total exit — low UDS flat',             '₹200L', '+8%',                 '₹216L'],
                    ]}
                    rowTone={['success', 'warning', undefined, 'success', 'danger']}
                    striped
                  />
                  <Text size="small" tone="secondary">
                    Illustrative model assuming same total entry price. The same rupee invested in a high-UDS apartment delivers ~22% total return vs ~8% for a low-UDS apartment in a dense project — purely from the land ownership differential.
                  </Text>
                </Stack>
              </CardBody>
            </Card>
          </Stack>

          <Divider />

          <Stack gap={10}>
            <H2>Possession timing and the 5-year exit window</H2>
            <Text size="small" tone="secondary">
              A 5-year hold from today (~Apr 2025) targets a ~2030 exit. Here is how the UC possession date interacts with that exit thesis — applies to any property you evaluate, not just the current shortlist.
            </Text>
            <Table
              headers={['Possession date', 'Time to exit (2030)', 'Rental income window', 'Recommendation']}
              rows={[
                ['2025–2026',   '4–5 years of ownership', '4–5 years (₹30–50K/mo)',    'Ideal — full rental income run; asset value grows from day 1'],
                ['2027',        '3 years of ownership',   '3 years (₹35–55K/mo)',       'Good — still meaningful rental window; sufficient time for area re-rating'],
                ['2028',        '2 years of ownership',   '2 years',                    'Acceptable — tight but workable if price is right and area has catalysts'],
                ['2029',        '~1 year of ownership',   '1 year only',                'Risky — very small ownership window; forces a 2031–32 exit or you sell into a 2029 market'],
                ['2030+',       'Possession = exit target', 'None before your exit',    'Wrong vehicle for 5-yr exit strategy — possession coincides with target exit'],
              ]}
              rowTone={['success', 'success', 'info', 'warning', 'danger']}
              striped
            />
          </Stack>

        </Stack>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          TAB 4 — PROPERTY TYPE
      ══════════════════════════════════════════════════════════════════════ */}
      {tab === 'type' && (
        <Stack gap={20}>

          <Stack gap={10}>
            <H2>Property type comparison</H2>
            <Table
              headers={['Type', 'Budget in North BLR', 'UDS profile', 'Resale /10', 'Appreciation /10', 'Rental /10', 'Buyer pool /10', 'Total /50']}
              rows={TYPES.map(t => [
                t.label.split('—')[0].trim(),
                t.budget,
                t.udsProfile.length > 60 ? t.udsProfile.slice(0, 57) + '…' : t.udsProfile,
                `${t.liquidityScore}`,
                `${t.appreciationScore}`,
                `${t.rentalScore}`,
                `${t.buyerPoolScore}`,
                `${t.total}`,
              ])}
              rowTone={TYPES.map(t => t.tone)}
              striped
            />
          </Stack>

          <Stack gap={10}>
            <H2>Type deep dive</H2>
            <Row gap={6} wrap>
              {TYPES.map((t, i) => (
                <Pill key={t.id} active={typeIdx === i} onClick={() => setTypeIdx(i)} tone={t.tone}>
                  {t.label.split('—')[0].trim()}
                </Pill>
              ))}
            </Row>

            <Grid columns={2} gap={14}>
              <Card>
                <CardHeader trailing={<Pill tone={activeType.tone} size="sm">{activeType.budget}</Pill>}>
                  {activeType.label}
                </CardHeader>
                <CardBody>
                  <Stack gap={6}>
                    <Row gap={8} wrap>
                      <Text size="small" weight="semibold">UDS profile:</Text>
                      <Text size="small" tone="secondary">{activeType.udsProfile}</Text>
                    </Row>
                    <Row gap={8} wrap>
                      <Text size="small" weight="semibold">Land appreciation:</Text>
                      <Text size="small" tone="secondary">{activeType.landAppreciation}</Text>
                    </Row>
                  </Stack>
                </CardBody>
              </Card>
              <Card>
                <CardHeader trailing={<Pill tone="info" size="sm">5-yr hold advice</Pill>}>
                  Hold strategy
                </CardHeader>
                <CardBody>
                  <Text size="small" tone="secondary">{activeType.holdAdvice}</Text>
                </CardBody>
              </Card>
            </Grid>
          </Stack>

          <Stack gap={8}>
            <H3>Scores comparison</H3>
            <BarChart
              categories={TYPES.map(t => t.label.split('—')[0].trim())}
              series={[
                { name: 'Resale liquidity', data: TYPES.map(t => t.liquidityScore) },
                { name: 'Appreciation',     data: TYPES.map(t => t.appreciationScore) },
                { name: 'Rental yield',     data: TYPES.map(t => t.rentalScore) },
                { name: 'Buyer pool',       data: TYPES.map(t => t.buyerPoolScore) },
              ]}
              stacked={false}
              height={220}
            />
          </Stack>

        </Stack>
      )}

    </Stack>
  );
}
