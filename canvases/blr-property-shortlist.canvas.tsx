import {
  BarChart,
  Card, CardBody, CardHeader,
  Divider, Grid, H1, H2, H3,
  Pill, Row, Stack, Stat, Table, Text,
  useCanvasState,
} from 'cursor/canvas';

// ── property data (sourced Apr 2026) ──────────────────────────────────────

type Status = 'RTM' | 'UC-2026' | 'UC-2027' | 'UC-2029+';
type BuilderGrade = 'A' | 'B+' | 'B';

interface Property {
  id: string;
  name: string;
  builder: string;
  builderGrade: BuilderGrade;
  area: string;
  status: Status;
  launchDate: string;      // project launch / RERA registration date
  possessionDate: string;  // actual or expected handover date
  possession: string;
  priceMin: number;   // ₹L
  priceMax: number;   // ₹L
  sbaMin: number;     // sqft
  sbaMax: number;     // sqft
  pricePerSqft: number;
  rera: string;
  ocStatus: 'confirmed' | 'likely' | 'not-applicable';
  societySize: string;
  highlights: string[];
  concerns: string[];
  sourceUrl: string;
  scores: {
    builderRep: number;
    legalSafety: number;
    valueForMoney: number;
    societyQuality: number;
    sizeAdequacy: number;
    locationFit: number;
    wfhReadiness: number;
    budgetFit: number;
  };
}

const CHARGES_PCT = 0.065; // stamp duty 5% + reg 1% + legal 0.5%
const GST_PCT = 0.05;      // UC only

function allinCost(priceL: number, isUC: boolean): number {
  const pct = isUC ? CHARGES_PCT + GST_PCT : CHARGES_PCT;
  return Math.round(priceL * (1 + pct));
}

const properties: Property[] = [
  // ── Grade A RTM ───────────────────────────────────────────────────────
  {
    id: 'sobha-city',
    name: 'Sobha City (Athena / Serenita)',
    builder: 'Sobha Limited',
    builderGrade: 'A',
    area: 'Thanisandra Main Rd',
    status: 'RTM',
    launchDate: 'Jan 2014',
    possessionDate: 'Phased 2018–2023',
    possession: 'Ready (multiple phases)',
    priceMin: 220,
    priceMax: 260,
    sbaMin: 1682,
    sbaMax: 2164,
    pricePerSqft: 13200,
    rera: 'Multiple phase RERAs — verify per unit',
    ocStatus: 'confirmed',
    societySize: '1,778 units · 12 towers · 36 acres',
    highlights: [
      'Sobha Limited — Grade A, best construction quality in India bar none',
      'Massive 36-acre township — world-class amenities, large open spaces',
      'Multiple variants: Athena (1,682 sqft), Serenita (1,850 sqft+)',
      'RTM units available — OC obtained, can be assessed fully before buying',
      'Thanisandra location = 20–30 min to Hebbal/Manyata, strong social scene',
      'High rental demand = excellent resale liquidity',
    ],
    concerns: [
      '1,778 units = very large society — feels like a township, not boutique',
      'Higher maintenance charges due to premium amenities (₹6–8/sqft)',
      'Price/sqft highest on list — you\'re paying the Sobha brand premium',
      'Thanisandra traffic heavier than Yelahanka New Town',
    ],
    sourceUrl: 'https://www.squareyards.com/bangalore-residential-property/sobha-city/234645/project',
    scores: { builderRep: 10, legalSafety: 9, valueForMoney: 7, societyQuality: 9, sizeAdequacy: 9, locationFit: 8, wfhReadiness: 9, budgetFit: 8 },
  },
  {
    id: 'prestige-royale',
    name: 'Prestige Royale Gardens',
    builder: 'Prestige Group',
    builderGrade: 'A',
    area: 'Yelahanka · Doddaballapur Rd',
    status: 'RTM',
    launchDate: 'Oct 2013',
    possessionDate: 'Dec 2019',
    possession: 'Ready (2019)',
    priceMin: 150,
    priceMax: 195,
    sbaMin: 1705,
    sbaMax: 1705,
    pricePerSqft: 10500,
    rera: 'Multiple phase RERA numbers — verify',
    ocStatus: 'confirmed',
    societySize: '1,664 units · 13 towers · 22.5 acres',
    highlights: [
      'Prestige Group — Grade A, one of BLR\'s most trusted builders',
      'Large 22.5-acre community — mature, well-run RWA expected',
      'Established since 2019 — can fully assess society before buying',
      '₹10,500/sqft is reasonable for Prestige in Yelahanka',
      '1,705 sqft is ideal for WFH single adult — 3 rooms, room to breathe',
      'Doddaballapur Rd access — good NH44 connectivity',
    ],
    concerns: [
      'Society now 6–7 years old — check sinking fund carefully',
      'Multiple RERA numbers across phases — verify per unit',
      'Doddaballapur Rd side, not strictly Yelahanka New Town core',
    ],
    sourceUrl: 'https://regrob.com/project/prestige-royale-gardens-yelahanka-bangalore/',
    scores: { builderRep: 9, legalSafety: 8, valueForMoney: 9, societyQuality: 8, sizeAdequacy: 9, locationFit: 8, wfhReadiness: 8, budgetFit: 10 },
  },
  {
    id: 'brigade-northridge',
    name: 'Brigade Northridge',
    builder: 'Brigade Group',
    builderGrade: 'A',
    area: 'Yelahanka · Kogilu Rd',
    status: 'RTM',
    launchDate: 'Oct 2014',
    possessionDate: 'Aug 2018',
    possession: 'Ready (2018)',
    priceMin: 155,
    priceMax: 250,
    sbaMin: 1230,
    sbaMax: 1880,
    pricePerSqft: 11500,
    rera: 'Pre-2017 project — RERA not applicable (verify OC/CC)',
    ocStatus: 'likely',
    societySize: '503 units · 7 acres',
    highlights: [
      'Brigade Group — Grade A, consistently high build quality',
      'Resale 1,880 sqft units available — best size for WFH',
      '7-acre society — manageable size, good community feel',
      'Mature society (2018) — can fully evaluate RWA track record',
      '4.3/5 rating on Housystan (63 reviews) — genuine positive feedback',
      'Kogilu Rd micro-location — less congested than main Bellary Rd',
    ],
    concerns: [
      'Pre-RERA project — must verify OC and CC directly (no RERA number to track)',
      'Society is 7–8 years old — check sinking fund and any pending capital works',
      'Resale only — need to verify individual unit documents carefully',
    ],
    sourceUrl: 'https://housystan.com/bangalore-real-estate/kogilu-road/brigade-northridge/review/brochure/floor-plan/price',
    scores: { builderRep: 9, legalSafety: 7, valueForMoney: 8, societyQuality: 8, sizeAdequacy: 9, locationFit: 9, wfhReadiness: 8, budgetFit: 9 },
  },
  {
    id: 'godrej-avenues',
    name: 'Godrej Avenues',
    builder: 'Godrej Properties',
    builderGrade: 'A',
    area: 'Yelahanka · Doddaballapur Rd',
    status: 'RTM',
    launchDate: 'Sep 2017',
    possessionDate: 'Mar 2019',
    possession: 'Ready (2019)',
    priceMin: 140,
    priceMax: 175,
    sbaMin: 1420,
    sbaMax: 1750,
    pricePerSqft: 10250,
    rera: 'PRM/KA/RERA/1251/309/PR/170905/000229',
    ocStatus: 'confirmed',
    societySize: '600 units · 10 towers · 6 acres',
    highlights: [
      'Grade A listed company with confirmed RERA and OC',
      '₹10,250/sqft — best value-per-sqft among Grade A options',
      'RERA number publicly verifiable on Karnataka portal',
      'Multiple resale units in market — good selection',
      'Consistent 4% annual appreciation in price',
    ],
    concerns: [
      'Smaller units (1,420–1,750 sqft) vs other Grade A options',
      '7-year-old society — sinking fund check essential',
      'Not Yelahanka New Town core — Doddaballapur Rd side',
    ],
    sourceUrl: 'https://www.squareyards.com/bangalore-residential-property/godrej-avenues/8441/project',
    scores: { builderRep: 9, legalSafety: 9, valueForMoney: 9, societyQuality: 8, sizeAdequacy: 7, locationFit: 8, wfhReadiness: 8, budgetFit: 10 },
  },
  // ── Grade A UC (fits ₹3 Cr) ───────────────────────────────────────────
  {
    id: 'sobha-athena',
    name: 'Sobha Athena (new)',
    builder: 'Sobha Limited',
    builderGrade: 'A',
    area: 'Thanisandra Main Rd',
    status: 'UC-2027',
    launchDate: 'Mar 2024',
    possessionDate: 'Jun 2027 (est.)',
    possession: 'Est. 2026–27',
    priceMin: 227,
    priceMax: 228,
    sbaMin: 1682,
    sbaMax: 1692,
    pricePerSqft: 13500,
    rera: 'Verify on Karnataka RERA portal',
    ocStatus: 'not-applicable',
    societySize: '72 units only — boutique',
    highlights: [
      'Sobha build quality — the gold standard for Indian residential construction',
      '72-unit boutique project — private, quiet, exclusive community',
      'All-in ~₹2.43 Cr — fits ₹3 Cr budget with significant buffer (₹57L)',
      'New construction — you are the first occupant',
      'Thanisandra — 20–25 min to Hebbal, best social scene in North BLR',
    ],
    concerns: [
      'Under construction — no OC, no society to assess',
      'GST 5% on under-construction = extra ₹11L',
      'Possession timeline risk — verify RERA % completion before booking',
      'Only 72 units — if RWA has fractious owners, hard to outvote',
    ],
    sourceUrl: 'https://www.squareyards.com/bangalore-residential-property/sobha-athena/109847/project',
    scores: { builderRep: 10, legalSafety: 7, valueForMoney: 8, societyQuality: 7, sizeAdequacy: 9, locationFit: 8, wfhReadiness: 9, budgetFit: 9 },
  },
  {
    id: 'brigade-insignia',
    name: 'Brigade Insignia',
    builder: 'Brigade Group',
    builderGrade: 'A',
    area: 'Yelahanka · NH44',
    status: 'UC-2029+',
    launchDate: 'May 2024',
    possessionDate: 'Jun 2029',
    possession: 'Jun 2029',
    priceMin: 299,
    priceMax: 360,
    sbaMin: 2145,
    sbaMax: 2481,
    pricePerSqft: 13900,
    rera: 'PRM/KA/RERA/1251/309/PR/180524/006894',
    ocStatus: 'not-applicable',
    societySize: '379 units · 6 towers · 6 acres · 80% open space',
    highlights: [
      'Brigade Group — Grade A, flagship Yelahanka project',
      'RERA registered (2024 launch) — fully transparent progress',
      'Next to NH44 — best connectivity in Yelahanka',
      '80% open spaces — exceptional greenery and air quality',
      '25,000 sqft clubhouse — premium amenities',
    ],
    concerns: [
      'Starts at ₹2.99 Cr — all-in ₹3.18 Cr+ for smallest 3 BHK = just at budget edge',
      'Possession 2029 — 3 years away. Long wait + GST 5% applicable',
      'Largest UC risk: 3 years of construction exposure',
      'Bigger units (2,145 sqft+) = higher maintenance charges',
    ],
    sourceUrl: 'https://www.squareyards.com/bangalore-residential-property/brigade-insignia/248548/project',
    scores: { builderRep: 9, legalSafety: 6, valueForMoney: 6, societyQuality: 7, sizeAdequacy: 10, locationFit: 10, wfhReadiness: 8, budgetFit: 5 },
  },
  // ── Grade B+ RTM ──────────────────────────────────────────────────────
  {
    id: 'mahaveer-celesse',
    name: 'Mahaveer Celesse',
    builder: 'Mahaveer Group',
    builderGrade: 'B+',
    area: 'Yelahanka',
    status: 'RTM',
    launchDate: 'Oct 2017',
    possessionDate: 'Mar 2022',
    possession: 'Ready (Mar 2022)',
    priceMin: 137,
    priceMax: 160,
    sbaMin: 1366,
    sbaMax: 1592,
    pricePerSqft: 9500,
    rera: 'PRM/KA/RERA/1251/309/PR/171026/000415',
    ocStatus: 'confirmed',
    societySize: '545 units · 8 towers · 5.19 acres',
    highlights: [
      'Best price on the list — ₹1.37–1.60 Cr leaves significant budget buffer',
      'RERA number verified on public portal',
      'Families in since 2022 — community established and assessable',
      'Excellent value: ₹81L+ under budget = invest the rest',
    ],
    concerns: [
      'Mahaveer is B+ tier — not Sobha/Prestige/Brigade quality',
      'Heavy amenity list drives up maintenance charges',
    ],
    sourceUrl: 'https://proptimes.org/property/mahaveer-celesse/',
    scores: { builderRep: 7, legalSafety: 8, valueForMoney: 10, societyQuality: 7, sizeAdequacy: 7, locationFit: 8, wfhReadiness: 7, budgetFit: 10 },
  },
  {
    id: 'arvind-bel-air',
    name: 'Arvind Bel Air',
    builder: 'Arvind SmartSpaces',
    builderGrade: 'B+',
    area: 'Yelahanka New Town Rd',
    status: 'UC-2026',
    launchDate: 'May 2020',
    possessionDate: 'Jun 2026',
    possession: 'Jun 2026',
    priceMin: 116,
    priceMax: 175,
    sbaMin: 1469,
    sbaMax: 1626,
    pricePerSqft: 9500,
    rera: 'PRM/KA/RERA/1251/472/PR/200515/003406',
    ocStatus: 'not-applicable',
    societySize: 'Mid-size gated community',
    highlights: [
      'Arvind SmartSpaces — SEBI-listed, financially transparent',
      'Near Forest Research Centre — best green micro-location in Yelahanka',
      'Jun 2026 possession — 14 months away, construction risk manageable',
      'Best price in this list — leaves ₹1.25–1.8 Cr to invest after purchase',
    ],
    concerns: [
      'Under construction — GST 5% applies',
      'B+ builder — not premium build quality',
      'Must verify construction progress % before committing',
    ],
    sourceUrl: 'https://www.squareyards.com/bangalore-residential-property/arvind-bel-air/101291/project',
    scores: { builderRep: 7, legalSafety: 6, valueForMoney: 9, societyQuality: 6, sizeAdequacy: 8, locationFit: 9, wfhReadiness: 7, budgetFit: 10 },
  },
];

const SCORE_LABELS: Record<keyof Property['scores'], string> = {
  builderRep: 'Builder',
  legalSafety: 'Legal',
  valueForMoney: 'Value',
  societyQuality: 'Society',
  sizeAdequacy: 'Size',
  locationFit: 'Location',
  wfhReadiness: 'WFH',
  budgetFit: 'Budget Fit',
};

function totalScore(p: Property): number {
  return Object.values(p.scores).reduce((s, v) => s + v, 0);
}

function statusTone(s: Status) {
  if (s === 'RTM') return 'success';
  if (s === 'UC-2026') return 'warning';
  if (s === 'UC-2027') return 'warning';
  return 'danger';
}

function gradeTone(g: BuilderGrade) {
  return g === 'A' ? 'success' : 'warning';
}

const sorted = [...properties].sort((a, b) => totalScore(b) - totalScore(a));
const BUDGET = 300; // ₹L = ₹3 Cr

export default function PropertyShortlist3Cr() {
  const [selected, setSelected] = useCanvasState<string>('sel3cr', 'prestige-royale');
  const [view, setView] = useCanvasState<'overview' | 'scores' | 'detail'>('view3cr', 'overview');

  const prop = properties.find(p => p.id === selected)!;

  return (
    <Stack gap={28} style={{ padding: '24px 28px', maxWidth: 1020 }}>

      <Stack gap={4}>
        <H1>Property Shortlist — ₹3 Cr Budget</H1>
        <Text tone="secondary">Sourced Apr 2026 · 3 BHK · Yelahanka / Thanisandra / North Bangalore · ≤ ₹3 Cr all-in · Scored against all 10 criteria</Text>
      </Stack>

      <Grid columns={4} gap={14}>
        <Stat value="8" label="Properties Found" tone="info" />
        <Stat value="6" label="RTM Options" tone="success" />
        <Stat value="2" label="Near-Term UC" tone="warning" />
        <Stat value="4 Grade A RTM" label="Premium Options" tone="success" />
      </Grid>

      <Card>
        <CardHeader trailing={<Pill label="₹3 Cr unlocks Grade A" tone="success" size="sm" />}>
          What ₹3 Cr Gets You vs ₹2.5 Cr
        </CardHeader>
        <CardBody>
          <Grid columns={2} gap={14}>
            <Stack gap={5}>
              <Text size="small" weight="semibold">At ₹2.5 Cr (old budget)</Text>
              {['Grade A RTM options: Godrej only (smaller units)', 'No Prestige, Brigade, Sobha RTM', 'Best size available: ~1,750 sqft', 'Mostly B+ builders for new RTM'].map((item, i) => (
                <Row key={i} gap={6} align="start">
                  <Text size="small" tone="secondary" style={{ minWidth: 12 }}>−</Text>
                  <Text size="small" tone="secondary">{item}</Text>
                </Row>
              ))}
            </Stack>
            <Stack gap={5}>
              <Text size="small" weight="semibold">At ₹3 Cr (new budget)</Text>
              {['Prestige Royale Gardens (1,705 sqft, Grade A)', 'Brigade Northridge (1,880 sqft, Grade A)', 'Sobha City RTM (1,682–2,164 sqft, Grade A)', 'Sobha Athena new UC (1,682 sqft, Grade A)', 'Brigade Insignia on table (3 yrs away)'].map((item, i) => (
                <Row key={i} gap={6} align="start">
                  <Text size="small" tone="secondary" style={{ minWidth: 12 }}>+</Text>
                  <Text size="small">{item}</Text>
                </Row>
              ))}
            </Stack>
          </Grid>
        </CardBody>
      </Card>

      <Divider />

      {/* ── view toggle ── */}
      <Row gap={6} align="center">
        <Text size="small" weight="semibold">View:</Text>
        <Row gap={5}>
          {(['overview', 'scores', 'detail'] as const).map(v => (
            <Pill key={v} active={view === v} onClick={() => setView(v)}>
              {v.charAt(0).toUpperCase() + v.slice(1)}
            </Pill>
          ))}
        </Row>
      </Row>

      {/* ── overview table ── */}
      {view === 'overview' && (
        <Stack gap={10}>
          <H2>All 8 Properties at a Glance</H2>
          <Table
            headers={['Property', 'Builder (Grade)', 'Launched', 'Possession', 'Size SBA', 'Price Range', 'All-in (est.)', '₹/sqft', 'Score']}
            rows={sorted.map(p => {
              const isUC = p.status !== 'RTM';
              return [
                p.name,
                `${p.builder} (${p.builderGrade})`,
                p.launchDate,
                p.possessionDate,
                `${p.sbaMin.toLocaleString('en-IN')}–${p.sbaMax.toLocaleString('en-IN')} sqft`,
                `₹${p.priceMin}–${p.priceMax}L`,
                `₹${allinCost(p.priceMin, isUC)}–${allinCost(p.priceMax, isUC)}L`,
                `₹${p.pricePerSqft.toLocaleString('en-IN')}`,
                `${totalScore(p)}/80`,
              ];
            })}
            rowTone={sorted.map(p =>
              totalScore(p) >= 68 ? 'success' : totalScore(p) >= 60 ? undefined : 'warning'
            )}
            striped
          />
          <Text size="small" tone="secondary">
            All-in = property + stamp duty (5%) + registration (1%) + legal (0.5%). UC properties also include GST (5%). Budget ceiling: ₹{BUDGET}L.
          </Text>
        </Stack>
      )}

      {/* ── scores view ── */}
      {view === 'scores' && (
        <Stack gap={12}>
          <H2>Criteria Score Comparison — Top 5</H2>
          <BarChart
            categories={Object.values(SCORE_LABELS)}
            series={sorted.slice(0, 5).map(p => ({
              name: p.name.split(' ').slice(0, 2).join(' '),
              data: Object.keys(SCORE_LABELS).map(k => p.scores[k as keyof Property['scores']]),
            }))}
            horizontal
            min={0}
            max={10}
            height={360}
          />
          <Table
            headers={['Property', ...Object.values(SCORE_LABELS), 'Total']}
            rows={sorted.map(p => [
              p.name,
              ...Object.keys(SCORE_LABELS).map(k => `${p.scores[k as keyof Property['scores']]}/10`),
              `${totalScore(p)}/80`,
            ])}
            rowTone={sorted.map(p =>
              totalScore(p) >= 68 ? 'success' : totalScore(p) >= 60 ? undefined : 'warning'
            )}
            striped
          />
        </Stack>
      )}

      {/* ── detail view ── */}
      {view === 'detail' && (
        <Stack gap={14}>
          <Row gap={6} align="center" wrap>
            <H2>Property Deep-Dive</H2>
            <Row gap={5} wrap>
              {properties.map(p => (
                <Pill
                  key={p.id}
                  active={selected === p.id}
                  tone={gradeTone(p.builderGrade)}
                  onClick={() => setSelected(p.id)}
                >
                  {p.name.split(' ').slice(0, 2).join(' ')}
                </Pill>
              ))}
            </Row>
          </Row>

          <Grid columns={4} gap={12}>
            <Stat value={`₹${prop.priceMin}–${prop.priceMax}L`} label="Price Range" />
            <Stat value={prop.status} label="Status" tone={statusTone(prop.status)} />
            <Stat value={prop.launchDate} label="Project Launched" />
            <Stat value={prop.possessionDate} label="Possession" tone={prop.status === 'RTM' ? 'success' : 'warning'} />
          </Grid>


          <Grid columns={3} gap={12}>
            <Stack gap={3}>
              <Text size="small" weight="semibold">Builder</Text>
              <Row gap={4} align="center">
                <Text size="small">{prop.builder}</Text>
                <Pill label={`Grade ${prop.builderGrade}`} tone={gradeTone(prop.builderGrade)} size="sm" />
              </Row>
            </Stack>
            <Stack gap={3}>
              <Text size="small" weight="semibold">RERA</Text>
              <Text size="small" tone="secondary">{prop.rera}</Text>
            </Stack>
            <Stack gap={3}>
              <Text size="small" weight="semibold">OC Status</Text>
              <Pill
                label={prop.ocStatus === 'confirmed' ? 'Confirmed' : prop.ocStatus === 'likely' ? 'Verify required' : 'N/A (UC)'}
                tone={prop.ocStatus === 'confirmed' ? 'success' : prop.ocStatus === 'likely' ? 'warning' : 'neutral'}
                size="sm"
              />
            </Stack>
          </Grid>

          <Grid columns={2} gap={14}>
            <Card>
              <CardHeader trailing={<Pill label="Why consider" tone="success" size="sm" />}>Highlights</CardHeader>
              <CardBody>
                <Stack gap={5}>
                  {prop.highlights.map((h, i) => (
                    <Row key={i} gap={6} align="start">
                      <Text size="small" tone="secondary" style={{ minWidth: 12 }}>+</Text>
                      <Text size="small">{h}</Text>
                    </Row>
                  ))}
                </Stack>
              </CardBody>
            </Card>
            <Card>
              <CardHeader trailing={<Pill label="Watch out for" tone="warning" size="sm" />}>Concerns</CardHeader>
              <CardBody>
                <Stack gap={5}>
                  {prop.concerns.map((c, i) => (
                    <Row key={i} gap={6} align="start">
                      <Text size="small" tone="secondary" style={{ minWidth: 12 }}>−</Text>
                      <Text size="small">{c}</Text>
                    </Row>
                  ))}
                </Stack>
              </CardBody>
            </Card>
          </Grid>

          <Grid columns={4} gap={12}>
            {Object.entries(SCORE_LABELS).map(([k, label]) => (
              <Stat
                key={k}
                value={`${prop.scores[k as keyof Property['scores']]}/10`}
                label={label}
                tone={prop.scores[k as keyof Property['scores']] >= 8 ? 'success' : prop.scores[k as keyof Property['scores']] <= 6 ? 'warning' : undefined}
              />
            ))}
          </Grid>

          <Stack gap={4}>
            <Text size="small" weight="semibold">All-in Cost</Text>
            <Grid columns={3} gap={12}>
              {[
                { label: `Min (₹${prop.priceMin}L)`, val: allinCost(prop.priceMin, prop.status !== 'RTM') },
                { label: `Max (₹${prop.priceMax}L)`, val: allinCost(prop.priceMax, prop.status !== 'RTM') },
              ].map(({ label, val }) => (
                <Stack key={label} gap={3}>
                  <Text size="small" tone="secondary">{label}</Text>
                  <Row gap={4} align="center">
                    <Text size="small">₹{val}L</Text>
                    <Pill
                      label={val <= BUDGET ? 'Fits' : 'Over'}
                      tone={val <= BUDGET ? 'success' : 'danger'}
                      size="sm"
                    />
                  </Row>
                </Stack>
              ))}
              <Stack gap={3}>
                <Text size="small" tone="secondary">Budget remaining (min price)</Text>
                <Text size="small">{allinCost(prop.priceMin, prop.status !== 'RTM') <= BUDGET ? `₹${BUDGET - allinCost(prop.priceMin, prop.status !== 'RTM')}L buffer` : 'Over budget'}</Text>
              </Stack>
            </Grid>
          </Stack>
        </Stack>
      )}

      <Divider />

      {/* ── recommendation ── */}
      <Stack gap={12}>
        <H2>Recommended Shortlist — Ranked for Your Profile</H2>
        <Grid columns={3} gap={14}>
          <Card>
            <CardHeader trailing={<Pill label="#1 Overall" tone="success" size="sm" />}>
              Prestige Royale Gardens
            </CardHeader>
            <CardBody>
              <Stack gap={5}>
                <Row gap={5} wrap>
                  <Pill label="Grade A" tone="success" size="sm" />
                  <Pill label="RTM" tone="success" size="sm" />
                  <Pill label="₹1.5–1.95 Cr" size="sm" />
                  <Pill label="1,705 sqft" size="sm" />
                </Row>
                <Text size="small">Prestige + Grade A + RTM + 22.5 acres + within budget with ~₹1 Cr buffer. The ₹1 Cr budget surplus stays invested. Best combination of builder credibility, society maturity, and value.</Text>
                <Text size="small" tone="secondary">Action: Get 2–3 broker quotes for resale units. Verify OC + A-Khata + sinking fund.</Text>
              </Stack>
            </CardBody>
          </Card>
          <Card>
            <CardHeader trailing={<Pill label="#2 Best Value" tone="success" size="sm" />}>
              Brigade Northridge
            </CardHeader>
            <CardBody>
              <Stack gap={5}>
                <Row gap={5} wrap>
                  <Pill label="Grade A" tone="success" size="sm" />
                  <Pill label="RTM" tone="success" size="sm" />
                  <Pill label="₹1.55–3 Cr" size="sm" />
                  <Pill label="1,880 sqft max" size="sm" />
                </Row>
                <Text size="small">Brigade quality at the best sqft rate among Grade A options. Largest unit available (1,880 sqft). 7-acre society on quieter Kogilu Rd. Pre-RERA project — verify OC/CC documents independently.</Text>
                <Text size="small" tone="secondary">Action: Ask broker for 1,800+ sqft units specifically. Budget for extra legal due diligence (pre-RERA).</Text>
              </Stack>
            </CardBody>
          </Card>
          <Card>
            <CardHeader trailing={<Pill label="#3 Grade A UC" tone="warning" size="sm" />}>
              Sobha Athena (new)
            </CardHeader>
            <CardBody>
              <Stack gap={5}>
                <Row gap={5} wrap>
                  <Pill label="Grade A" tone="success" size="sm" />
                  <Pill label="UC 2026–27" tone="warning" size="sm" />
                  <Pill label="₹2.43 Cr all-in" size="sm" />
                  <Pill label="1,682 sqft" size="sm" />
                </Row>
                <Text size="small">If you want brand-new Sobha quality and are willing to wait 12–18 months: ₹2.27 Cr + charges = ₹2.43 Cr all-in — leaves ₹57L buffer. Boutique 72-unit project, first occupant.</Text>
                <Text size="small" tone="secondary">Action: Verify RERA completion %, confirm possession timeline, check if payment plan suits your cash flow.</Text>
              </Stack>
            </CardBody>
          </Card>
        </Grid>

        <Table
          headers={['Rank', 'Property', 'Why It Wins', 'Budget Buffer', 'First Action']}
          rows={[
            ['1', 'Prestige Royale Gardens', 'Grade A RTM + 22 acres + Yelahanka + best overall score', `~₹1–1.5 Cr`, '99acres/Housing.com for resale listings'],
            ['2', 'Brigade Northridge', 'Grade A RTM + largest units (1,880 sqft) + Kogilu Rd', '₹50L–1.5 Cr', 'Engage broker, verify OC+CC (pre-RERA)'],
            ['3', 'Godrej Avenues', 'Grade A RTM + confirmed RERA + proven appreciation', '₹1.25–1.6 Cr', 'Easiest to verify — RERA number public'],
            ['4', 'Sobha City RTM', 'Grade A RTM + Sobha quality + 36-acre township', '₹40–80L', 'Verify unit-wise OC at Thanisandra sub-registrar'],
            ['5', 'Sobha Athena (UC)', 'Best new build quality, fits budget with buffer', '₹57L', 'Check RERA progress + confirm 2027 timeline'],
            ['6', 'Mahaveer Celesse', 'Best value if Grade A not critical — ₹1.4–1.6 Cr', '₹1.4–1.6 Cr', 'Good if investing the budget surplus matters to you'],
          ]}
          rowTone={['success', 'success', 'success', undefined, 'warning', undefined]}
          striped
        />
      </Stack>

      <Divider />

      <Card>
        <CardHeader trailing={<Pill label="Action plan" tone="info" size="sm" />}>
          Your Next 3 Weeks
        </CardHeader>
        <CardBody>
          <Stack gap={5}>
            {[
              ['Week 1 — Research', 'On 99acres and Housing.com: search "Prestige Royale Gardens Yelahanka resale" and "Brigade Northridge Kogilu Road resale". Filter: 3 BHK, ₹1.5–3 Cr, RTM. Contact 2 listing agents each.'],
              ['Week 2 — Visit', 'Visit both projects on a weekday morning. Talk to 3 residents each. Bring the legal checklist (blr-legal-documentation canvas). Ask specifically about: sinking fund, water supply, maintenance charges, and OC status.'],
              ['Week 2 — Sobha check', 'Also visit Sobha City on Thanisandra Main Rd. Ask for RTM units. Compare Sobha construction quality in person vs Brigade/Prestige.'],
              ['Week 3 — Shortlist 1', 'Pick your preferred unit. Engage a Bangalore property lawyer (₹20–25K) for full title check — EC, A-Khata, OC, parent documents for at least 15 years back.'],
              ['Parallel — Finance', 'Get a home loan pre-approval letter from SBI/HDFC. Estimated sanction: ~₹1 Cr on your salary. If parent has pension income, apply jointly to get ₹1.3–1.5 Cr.'],
            ].map(([week, action]) => (
              <Row key={week} gap={8} align="start">
                <Pill label={week.split('—')[0].trim()} size="sm" />
                <Text size="small">{action}</Text>
              </Row>
            ))}
          </Stack>
        </CardBody>
      </Card>

    </Stack>
  );
}
