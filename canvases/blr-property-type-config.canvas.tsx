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

type Tab = 'decision' | 'properties' | 'sizing' | 'unit';

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
