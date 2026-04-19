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
  // ── Grade A UC — < 2 yr old or new build (all RTM options pre-2024 removed) ──
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
  // ── Grade A UC ────────────────────────────────────────────────────────
  {
    id: 'prestige-camden',
    name: 'Prestige Camden Gardens',
    builder: 'Prestige Group',
    builderGrade: 'A',
    area: 'Thanisandra Main Rd',
    status: 'UC-2027',
    launchDate: 'Mar 2023',
    possessionDate: 'Dec 2027 (est.)',
    possession: 'Dec 2027',
    priceMin: 189,
    priceMax: 250,
    sbaMin: 1550,
    sbaMax: 1800,
    pricePerSqft: 12000,
    rera: 'PR/140524/006872',
    ocStatus: 'not-applicable',
    societySize: '120 units · 2 acres · boutique',
    highlights: [
      'Prestige Group — Grade A, among the most trusted builders in Bangalore',
      'Boutique 120-unit project — quiet, private, no township crowd feel',
      'RERA registered (verified PR/140524/006872) — fully transparent progress',
      'Thanisandra Main Rd — 20–25 min to Hebbal, excellent social scene',
      '₹1.89 Cr+ base price — budget buffer of ₹50L+ even at top end',
      'New build — you are the first occupant, no wear-and-tear risk',
    ],
    concerns: [
      'Under construction — GST 5% applicable',
      'Possession Dec 2027 — ~18 months away',
      'Only 120 units — verify RERA % completion and payment milestone schedule',
      '2 acres is compact — amenity space will be limited vs larger projects',
    ],
    sourceUrl: 'https://www.prestigesevergreen.info/prestige-group/prestige-best-residential-apartments-for-sale-in-thanisandra-2025.html',
    scores: { builderRep: 9, legalSafety: 8, valueForMoney: 8, societyQuality: 7, sizeAdequacy: 8, locationFit: 8, wfhReadiness: 8, budgetFit: 9 },
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
  const [selected, setSelected] = useCanvasState<string>('sel3cr', 'sobha-athena');
  const [view, setView] = useCanvasState<'overview' | 'scores' | 'detail'>('view3cr', 'overview');

  const prop = properties.find(p => p.id === selected)!;

  return (
    <Stack gap={28} style={{ padding: '24px 28px', maxWidth: 1020 }}>

      <Stack gap={4}>
        <H1>Property Shortlist — ₹3 Cr Budget</H1>
        <Text tone="secondary">
          North BLR · 3 BHK focus · Sourced Apr 2026. <Text weight="semibold" as="span">Visit core (5)</Text> for Manyata thesis lives in <Text weight="semibold" as="span">index.html</Text> + <Text weight="semibold" as="span">blr-deep-eval</Text>;
          this canvas holds <Text weight="semibold" as="span">four expand-track</Text> UC listings scored on eight rubric axes. The <Text weight="semibold" as="span">ten buying-category families</Text> (budget, area, legal, …) and which <Text weight="semibold" as="span">visit</Text> project leads each family are in <Text weight="semibold" as="span">blr-property-criteria.canvas.tsx</Text> — align expand picks against that table before promoting one into the visit row.
        </Text>
      </Stack>

      <Grid columns={4} gap={14}>
        <Stat value="4" label="Expand-track rows" tone="info" />
        <Stat value="5" label="Visit core (elsewhere)" tone="success" />
        <Stat value="4 UC" label="All UC here" tone="warning" />
        <Stat value="3 A · 1 B+" label="Builder grades" tone="neutral" />
      </Grid>

      <Card>
        <CardHeader trailing={<Pill tone="warning" size="sm">All new build</Pill>}>
          Why Only UC? The RTM Reality Check
        </CardHeader>
        <CardBody>
          <Grid columns={2} gap={14}>
            <Stack gap={5}>
              <Text size="small" weight="semibold">All RTM options are 2+ years old</Text>
              {['Sobha City — handed over 2018–2023', 'Prestige Royale Gardens — 2019', 'Brigade Northridge — 2018', 'Godrej Avenues — 2019', 'Mahaveer Celesse — 2022'].map((item, i) => (
                <Row key={i} gap={6} align="start">
                  <Text size="small" tone="secondary" style={{ minWidth: 12 }}>−</Text>
                  <Text size="small" tone="secondary">{item}</Text>
                </Row>
              ))}
            </Stack>
            <Stack gap={5}>
              <Text size="small" weight="semibold">New build: you're the first occupant</Text>
              {['No accumulated wear, no deferred maintenance', 'Possession 2026–2027 — wait 12–20 months', 'Keep ₹2.5 Cr savings invested in the meantime', 'GST 5% applies — budget ₹10–15L for it', 'All Grade A builders with RERA tracking'].map((item, i) => (
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
          <H2>Four expand-track properties at a glance</H2>
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
          <H2>Criteria score comparison — all four expand rows</H2>
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
            ['1', 'Sobha Athena', 'Best build quality (Sobha) + boutique 72 units + 2027 possession', '~₹57L', 'Check RERA completion % on Karnataka portal'],
            ['2', 'Prestige Camden Gardens', 'Grade A Prestige + boutique 120 units + RERA confirmed + Dec 2027', '₹50L+', 'Call Prestige sales — confirm 3 BHK floor plans + payment plan'],
            ['3', 'Arvind Bel Air', 'Earliest possession (Jun 2026) + best budget fit + SEBI-listed builder', '₹1.25–1.8 Cr', 'Verify RERA construction % + confirm Jun 2026 is realistic'],
            ['4', 'Brigade Insignia', 'Best location/size (2,145 sqft+) but 2029 wait + at budget edge', '0–minimal', 'Only if you want max size and can wait till 2029'],
          ]}
          rowTone={['success', 'success', 'warning', undefined]}
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
              ['Week 1 — Research', 'On Karnataka RERA portal (rera.karnataka.gov.in): look up PR/140524/006872 (Prestige Camden) and Sobha Athena RERA number. Check construction % completed. If > 50%, project risk is manageable.'],
              ['Week 1 — Finance', 'Get a home loan pre-approval for ₹1 Cr from SBI/HDFC. For UC properties with construction-linked payment plan, you draw down in tranches — EMI starts small and grows. With ₹2.5 Cr savings you can pay more upfront to reduce drawn loan.'],
              ['Week 2 — Site Visit', 'Visit Sobha Athena and Prestige Camden construction sites. Ask: current % completion, any delay vs RERA date, number of bookings sold, maintenance team plan. Talk to other buyers if possible.'],
              ['Week 2 — Arvind check', 'Visit Arvind Bel Air in Yelahanka — possession Jun 2026. If construction is 90%+ done, this is the fastest path to moving in and has the most budget buffer.'],
              ['Week 3 — Book', 'Pick your top choice. Pay booking amount (₹2–5L). Engage property lawyer for agreement review before any further payment. Confirm RERA registration number on agreement.'],
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
