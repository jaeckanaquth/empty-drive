import {
  BarChart,
  Card, CardBody, CardHeader,
  Divider, Grid, H1, H2, H3,
  Pill, Row, Stack, Stat, Table, Text,
  useCanvasState,
} from 'cursor/canvas';

// ── Current shortlist (Apr 2026) — 5 UC Grade A properties < ₹3 Cr all-in ─

type Status = 'UC-2027' | 'UC-2028' | 'UC-2029' | 'UC-2030';
type BuilderGrade = 'A';

interface Property {
  id: string;
  rank: number;
  name: string;
  builder: string;
  builderGrade: BuilderGrade;
  area: string;
  possession: string;
  possessionDate: string;
  launchDate: string;
  status: Status;
  priceMin: number;     // ₹L base
  priceMax: number;     // ₹L base
  allInMin: number;     // ₹L (base + GST 5% + stamp/reg 6.5%)
  allInMax: number;     // ₹L
  sbaMin: number;       // sqft
  sbaMax: number;       // sqft
  psfMid: number;       // ₹/sqft mid
  rera: string;
  societySize: string;
  highlights: string[];
  concerns: string[];
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

const BUDGET = 300; // ₹L = ₹3 Cr ceiling

const properties: Property[] = [
  // ── Rank 1 ──────────────────────────────────────────────────────────────
  {
    id: 'purva',
    rank: 1,
    name: 'Purva Zenium 2',
    builder: 'Puravankara Limited',
    builderGrade: 'A',
    area: 'Hosahalli · Airport Road belt',
    possession: 'Jun 2027',
    possessionDate: 'Jun 2027 — earliest Grade A on list',
    launchDate: 'Jul 2022',
    status: 'UC-2027',
    priceMin: 171, priceMax: 238,
    allInMin: 182, allInMax: 253,
    sbaMin: 1231, sbaMax: 1710,
    psfMid: 8200,
    rera: 'PRM/KA/RERA/1251/309/PR/071022/005303',
    societySize: 'Large gated community · multi-tower',
    highlights: [
      'Earliest Grade A possession on the list — Jun 2027 (~14 months)',
      'NSE-listed Puravankara, 50+ yr track record, 85M+ sqft delivered',
      'All-in ₹1.82–2.53 Cr — largest budget buffer on the list (up to ₹1.18 Cr)',
      'BluNex smart-home tech standard across all units',
      'Airport Road belt — best KIA access (20–25 min); NH44 elevated expressway',
    ],
    concerns: [
      'Hosahalli is maturing, not yet established — thin social infra today',
      'No Metro near-term; car-dependent for all errands',
      'After-sales consistency varies across Puravankara projects — verify for this society',
      'Lower loading factor may mean smaller carpet than SBA implies',
    ],
    scores: { builderRep: 8, legalSafety: 8, valueForMoney: 9, societyQuality: 7, sizeAdequacy: 8, locationFit: 7, wfhReadiness: 8, budgetFit: 10 },
  },
  // ── Rank 2 ──────────────────────────────────────────────────────────────
  {
    id: 'prestige',
    rank: 2,
    name: 'Prestige Avon',
    builder: 'Prestige Group',
    builderGrade: 'A',
    area: 'Thanisandra · Nagavara belt',
    possession: 'Dec 2028',
    possessionDate: 'Dec 2028 (~32 months)',
    launchDate: 'Late 2023',
    status: 'UC-2028',
    priceMin: 295, priceMax: 310,
    allInMin: 314, allInMax: 330,
    sbaMin: 1780, sbaMax: 1975,
    psfMid: 8800,
    rera: 'Verify on Karnataka RERA portal — confirm current number',
    societySize: 'Mid-size gated society · Thanisandra Main Rd',
    highlights: [
      'Best micro-market: Thanisandra — highest CAGR (10–12%), best rental yield, deepest resale pool',
      'Prestige Group — Grade A, NSE-listed, 40+ yr track record',
      'Largest SBA on shortlist (1,780–1,975 sqft)',
      'Metro Phase 2B station ~1.5 km — direct Manyata/Hebbal walkability',
      'Manyata/Nagavara corridor: best social scene, F&B, schools, hospitals in North BLR',
    ],
    concerns: [
      'All-in ₹3.14–3.30 Cr — slightly above ₹3 Cr ceiling; negotiate a lower floor or compact unit',
      'Verify RERA number independently — confirm it matches the project',
      'Dec 2028 possession — 32-month wait + GST 5% applicable',
      'High demand = less negotiating leverage with Prestige sales team',
    ],
    scores: { builderRep: 9, legalSafety: 8, valueForMoney: 7, societyQuality: 8, sizeAdequacy: 10, locationFit: 10, wfhReadiness: 9, budgetFit: 4 },
  },
  // ── Rank 3 ──────────────────────────────────────────────────────────────
  {
    id: 'sattva',
    rank: 3,
    name: 'Sattva Lumina',
    builder: 'Salarpuria Sattva',
    builderGrade: 'A',
    area: 'Rajanukunte · Yelahanka (SH-9)',
    possession: 'Nov 2029',
    possessionDate: 'Nov 2029 (~43 months)',
    launchDate: '2023',
    status: 'UC-2029',
    priceMin: 152, priceMax: 175,
    allInMin: 162, allInMax: 187,
    sbaMin: 1450, sbaMax: 1780,
    psfMid: 7000,
    rera: 'Verify on Karnataka RERA portal',
    societySize: '12.8-acre township · 3 clubhouses · ~750 units',
    highlights: [
      'Best value per sqft on the list — lowest PSF among Grade A options',
      'Township scale: 12.8 acres, 3 clubhouses, large open spaces',
      'Greenest location (Yelahanka belt, Air Quality 9/10)',
      'STRR Phase 1 alignment directly benefits SH-9 belt — future connectivity uplift',
      'NSE-listed Salarpuria Sattva, strong financial backing',
    ],
    concerns: [
      'Nov 2029 — longest wait on the list (43 months)',
      'Some older Sattva projects had 6–9 month delays; verify RERA % completion',
      'Rajanukunte pocket is thin on daily infra — drive to Yelahanka town for most needs',
      'No Metro near-term for this specific pocket',
    ],
    scores: { builderRep: 8, legalSafety: 7, valueForMoney: 10, societyQuality: 9, sizeAdequacy: 9, locationFit: 7, wfhReadiness: 7, budgetFit: 10 },
  },
  // ── Rank 4 ──────────────────────────────────────────────────────────────
  {
    id: 'brigade',
    rank: 4,
    name: 'Brigade Eternia',
    builder: 'Brigade Group',
    builderGrade: 'A',
    area: 'Yelahanka New Town · BDA sector',
    possession: 'Mar 2030',
    possessionDate: 'Mar 2030 (~47 months)',
    launchDate: '2023',
    status: 'UC-2030',
    priceMin: 226, priceMax: 243,
    allInMin: 241, allInMax: 259,
    sbaMin: 1720, sbaMax: 1900,
    psfMid: 8500,
    rera: 'Verify on Karnataka RERA portal',
    societySize: 'BDA-planned Yelahanka NT · established layout',
    highlights: [
      'Best family area on the list — Yelahanka NT is BDA-planned, wide roads, top schools 2–3 km',
      'Brigade brand premium: 5–8% resale uplift vs generic; established 35+ yr builder',
      'BWSSB direct supply confirmed in NT area — most reliable water',
      'Aster Hospital 3 km, DPS North 3 km, CMR 2 km — best school/hospital proximity',
      'STRR interchange location — strong future connectivity catalyst',
    ],
    concerns: [
      'Mar 2030 possession — longest UC wait (47 months); resolve exact date before booking',
      'No Metro: Yelahanka NT will not have Metro in the 2030 horizon',
      'Brigade Eternia RERA number pending confirmation — verify before booking',
      'Higher price than Sattva/Tata for similar sqft',
    ],
    scores: { builderRep: 9, legalSafety: 7, valueForMoney: 8, societyQuality: 9, sizeAdequacy: 9, locationFit: 9, wfhReadiness: 8, budgetFit: 8 },
  },
  // ── Rank 5 ──────────────────────────────────────────────────────────────
  {
    id: 'tata',
    rank: 5,
    name: 'Tata Varnam',
    builder: 'Tata Housing',
    builderGrade: 'A',
    area: 'Devanahalli · Shettigere (Carnatica)',
    possession: 'Dec 2029',
    possessionDate: 'Dec 2029 (~44 months)',
    launchDate: '2022',
    status: 'UC-2029',
    priceMin: 145, priceMax: 165,
    allInMin: 155, allInMax: 176,
    sbaMin: 1600, sbaMax: 1750,
    psfMid: 6400,
    rera: 'Verify — Tata Carnatica umbrella RERA, Varnam phase',
    societySize: '70 acres within 135-acre Carnatica township',
    highlights: [
      'Highest builder trust on the list — Tata has never defaulted on a project in India',
      'Best sqft value: ₹1.55 Cr all-in for ~1,681 sqft = ₹9,200/sqft all-in vs market ₹11,000+',
      'Tata Group unlimited financial backing — zero construction abandonment risk',
      '135-acre Carnatica township — self-contained with retail, school, sports infrastructure',
      'Airport KIA 10–15 min — for frequent flyers this alone is a differentiator',
    ],
    concerns: [
      'Devanahalli: 60–80 min peak commute to Manyata — the list\'s biggest practical concern',
      'Very thin social infra outside township today: no Grade A schools/hospitals within 20 km',
      'STRR Phase 1 (2027–28) is essential for self-use viability — confirm before committing',
      'Borewell-primary water in Devanahalli belt; BWSSB timeline unclear',
    ],
    scores: { builderRep: 10, legalSafety: 10, valueForMoney: 9, societyQuality: 9, sizeAdequacy: 9, locationFit: 4, wfhReadiness: 7, budgetFit: 10 },
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
  if (s === 'UC-2027') return 'warning' as const;
  if (s === 'UC-2028') return 'warning' as const;
  return 'danger' as const;
}

const sorted = [...properties].sort((a, b) => totalScore(b) - totalScore(a));

export default function PropertyShortlist3Cr() {
  const [selected, setSelected] = useCanvasState<string>('sel3cr', 'purva');
  const [view, setView] = useCanvasState<'overview' | 'scores' | 'detail'>('view3cr', 'overview');

  const prop = properties.find(p => p.id === selected)!;

  const topScore = Math.max(...properties.map(totalScore));
  const topPick  = properties.find(p => totalScore(p) === topScore)!;

  return (
    <Stack gap={28} style={{ padding: '24px 28px', maxWidth: 1040 }}>

      {/* ── Header ── */}
      <Stack gap={4}>
        <H1>Property Shortlist — ₹3 Cr Budget</H1>
        <Text tone="secondary">
          Apr 2026 · 5 UC Grade A properties · North Bangalore · ≤ ₹3 Cr all-in (except Prestige Avon at ₹3.14 Cr — negotiate)
        </Text>
      </Stack>

      {/* ── Summary stats ── */}
      <Grid columns={4} gap={14}>
        <Stat value="5" label="Properties shortlisted" tone="success" />
        <Stat value="5 Grade A" label="Builder quality" tone="success" />
        <Stat value="Jun 2027" label="Earliest possession" tone="warning" />
        <Stat value={topPick.name.split(' ').slice(0,2).join(' ')} label={`Top score (${totalScore(topPick)}/80)`} tone="success" />
      </Grid>

      {/* ── UC rationale ── */}
      <Card>
        <CardHeader trailing={<Pill tone="warning" size="sm">UC-only strategy</Pill>}>
          Why Under-Construction Only — and Why Grade A Only
        </CardHeader>
        <CardBody>
          <Grid columns={2} gap={14}>
            <Stack gap={5}>
              <Text size="small" weight="semibold">RTM options ruled out</Text>
              {[
                'All Grade A RTM (Prestige Royale, Brigade Northridge, Sobha City) are 2018–2023 builds',
                'Older societies = inherited maintenance debt, older common areas, mixed community',
                'Pre-RERA projects require extra legal due diligence and independent verification',
                'Resale units carry a negotiation premium on top of market price',
              ].map((item, i) => (
                <Row key={i} gap={6} align="start">
                  <Text size="small" tone="secondary" style={{ minWidth: 12 }}>−</Text>
                  <Text size="small" tone="secondary">{item}</Text>
                </Row>
              ))}
            </Stack>
            <Stack gap={5}>
              <Text size="small" weight="semibold">Grade A UC: the right bet</Text>
              {[
                'You are the first occupant — no inherited wear or deferred maintenance',
                'RERA tracking = monthly % updates, escrow-protected payments',
                'Grade A builders (Tata, Prestige, Brigade, Puravankara, Sattva) = strong completion track record',
                'Construction-linked payment plan: savings stay invested until each milestone',
                'GST 5% applies (~₹8–15L extra) — budgeted in all-in figures below',
              ].map((item, i) => (
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

      {/* ── View toggle ── */}
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

      {/* ── Overview table ── */}
      {view === 'overview' && (
        <Stack gap={10}>
          <H2>All 5 Properties at a Glance</H2>
          <Table
            headers={['#', 'Property', 'Builder', 'Area', 'Possession', 'SBA sqft', 'Base price', 'All-in', '₹/sqft', 'Score']}
            rows={sorted.map(p => [
              `#${p.rank}`,
              p.name,
              p.builder,
              p.area,
              p.possession,
              `${p.sbaMin.toLocaleString('en-IN')}–${p.sbaMax.toLocaleString('en-IN')}`,
              `₹${p.priceMin}–${p.priceMax}L`,
              `₹${p.allInMin}–${p.allInMax}L`,
              `₹${p.psfMid.toLocaleString('en-IN')}`,
              `${totalScore(p)}/80`,
            ])}
            rowTone={sorted.map(p =>
              p.allInMax <= BUDGET && totalScore(p) >= 65 ? 'success' :
              p.allInMin > BUDGET ? 'warning' : undefined
            )}
            striped
          />
          <Text size="small" tone="secondary">
            All-in = base price + GST 5% (UC) + stamp duty 5% + registration 1% + legal 0.5%.
            Budget ceiling: ₹{BUDGET}L (₹3 Cr). Prestige Avon is ₹14–30L over — negotiate lower floor.
          </Text>
        </Stack>
      )}

      {/* ── Scores view ── */}
      {view === 'scores' && (
        <Stack gap={12}>
          <H2>Criteria Score Comparison — All 5 Properties</H2>
          <BarChart
            categories={Object.values(SCORE_LABELS)}
            series={sorted.map(p => ({
              name: p.name.split(' ').slice(0, 2).join(' '),
              data: Object.keys(SCORE_LABELS).map(k => p.scores[k as keyof Property['scores']]),
            }))}
            horizontal
            min={0}
            max={10}
            height={380}
          />
          <Table
            headers={['Rank', 'Property', ...Object.values(SCORE_LABELS), 'Total /80']}
            rows={sorted.map(p => [
              `#${p.rank}`,
              p.name,
              ...Object.keys(SCORE_LABELS).map(k => `${p.scores[k as keyof Property['scores']]}/10`),
              `${totalScore(p)}/80`,
            ])}
            rowTone={sorted.map(p =>
              totalScore(p) >= 68 ? 'success' : totalScore(p) >= 58 ? undefined : 'warning'
            )}
            striped
          />
        </Stack>
      )}

      {/* ── Detail view ── */}
      {view === 'detail' && (
        <Stack gap={14}>
          <Row gap={6} align="center" wrap>
            <H2>Property Deep-Dive</H2>
            <Row gap={5} wrap>
              {properties.map(p => (
                <Pill
                  key={p.id}
                  active={selected === p.id}
                  tone="success"
                  onClick={() => setSelected(p.id)}
                >
                  #{p.rank} {p.name.split(' ').slice(0, 2).join(' ')}
                </Pill>
              ))}
            </Row>
          </Row>

          <Grid columns={4} gap={12}>
            <Stat value={`₹${prop.allInMin}–${prop.allInMax}L`} label="All-in cost"
              tone={prop.allInMax <= BUDGET ? 'success' : 'warning'} />
            <Stat value={prop.possession} label="Possession" tone={statusTone(prop.status)} />
            <Stat value={`${prop.sbaMin.toLocaleString('en-IN')}–${prop.sbaMax.toLocaleString('en-IN')} sqft`} label="SBA range" />
            <Stat value={`₹${prop.psfMid.toLocaleString('en-IN')}/sqft`} label="Mid PSF" />
          </Grid>

          <Grid columns={3} gap={12}>
            <Stack gap={3}>
              <Text size="small" weight="semibold">Builder</Text>
              <Row gap={4} align="center">
                <Text size="small">{prop.builder}</Text>
                <Pill tone="success" size="sm">Grade A</Pill>
              </Row>
            </Stack>
            <Stack gap={3}>
              <Text size="small" weight="semibold">RERA</Text>
              <Text size="small" tone="secondary">{prop.rera}</Text>
            </Stack>
            <Stack gap={3}>
              <Text size="small" weight="semibold">Society / scale</Text>
              <Text size="small" tone="secondary">{prop.societySize}</Text>
            </Stack>
          </Grid>

          <Grid columns={2} gap={14}>
            <Card>
              <CardHeader trailing={<Pill tone="success" size="sm">Why consider</Pill>}>Highlights</CardHeader>
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
              <CardHeader trailing={<Pill tone="warning" size="sm">Watch out</Pill>}>Concerns</CardHeader>
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
                tone={prop.scores[k as keyof Property['scores']] >= 8 ? 'success' :
                      prop.scores[k as keyof Property['scores']] <= 5 ? 'warning' : undefined}
              />
            ))}
          </Grid>

          <Card>
            <CardHeader trailing={<Pill tone="info" size="sm">Budget check</Pill>}>Cost breakdown</CardHeader>
            <CardBody>
              <Table
                headers={['Item', 'At min price', 'At max price']}
                rows={[
                  ['Base price', `₹${prop.priceMin}L`, `₹${prop.priceMax}L`],
                  ['GST 5% (UC)', `₹${Math.round(prop.priceMin * 0.05)}L`, `₹${Math.round(prop.priceMax * 0.05)}L`],
                  ['Stamp + reg + legal 6.5%', `₹${Math.round(prop.priceMin * 0.065)}L`, `₹${Math.round(prop.priceMax * 0.065)}L`],
                  ['All-in estimate', `₹${prop.allInMin}L`, `₹${prop.allInMax}L`],
                  ['Budget remaining vs ₹3 Cr', `₹${BUDGET - prop.allInMin}L`, prop.allInMax <= BUDGET ? `₹${BUDGET - prop.allInMax}L` : 'Over by ₹' + (prop.allInMax - BUDGET) + 'L'],
                ]}
                rowTone={[undefined, undefined, undefined,
                  prop.allInMax <= BUDGET ? 'success' : 'warning',
                  prop.allInMin >= 0 ? 'success' : 'danger',
                ]}
                striped
              />
            </CardBody>
          </Card>
        </Stack>
      )}

      <Divider />

      {/* ── Ranked recommendation ── */}
      <Stack gap={12}>
        <H2>Ranked Recommendation — For Your Profile</H2>
        <Text size="small" tone="secondary">Single professional, Manyata/Embassy commute, ₹3 Cr budget, Grade A UC only</Text>

        <Table
          headers={['Rank', 'Property', 'Builder', 'All-in', 'Possession', 'Why it ranks here', 'Key risk']}
          rows={[
            ['#1', 'Sattva Lumina', 'Salarpuria Sattva', '₹1.62–1.87 Cr', 'Nov 2029', 'Best value PSF, township scale, STRR uplift, massive budget buffer', '43-month wait; thin daily infra at Rajanukunte today'],
            ['#2', 'Brigade Eternia', 'Brigade Group', '₹2.41–2.59 Cr', 'Mar 2030', 'Best family area; BWSSB water; best schools/hospital proximity; Brigade brand', '47-month wait; no Metro; confirm RERA before booking'],
            ['#3', 'Purva Zenium 2', 'Puravankara', '₹1.82–2.53 Cr', 'Jun 2027', 'Earliest possession — move in 14 months; strong budget buffer; NSE-listed builder', 'Hosahalli still maturing; car-dependent; no Metro'],
            ['#4', 'Tata Varnam', 'Tata Housing', '₹1.55–1.76 Cr', 'Dec 2029', 'Best builder trust (Tata), best sqft value, township scale, airport 10 min', 'Devanahalli 60–80 min peak to Manyata — daily commute concern'],
            ['#5*', 'Prestige Avon', 'Prestige Group', '₹3.14–3.30 Cr*', 'Dec 2028', 'Best location (Thanisandra), biggest units, Metro nearby, top resale market', '*Over ₹3 Cr ceiling — negotiate lower floor; still worth a visit'],
          ]}
          rowTone={['success', 'success', undefined, undefined, 'warning']}
          striped
        />
      </Stack>

      <Divider />

      {/* ── Next actions ── */}
      <Card>
        <CardHeader trailing={<Pill tone="info" size="sm">Action plan</Pill>}>
          Visit Plan — 2-Day Site Visit Schedule
        </CardHeader>
        <CardBody>
          <Stack gap={5}>
            {[
              ['Day 1 — AM', 'Purva Zenium 2 (Hosahalli). Ask: current RERA construction %, unsold 3 BHK inventory, CLP milestones, maintenance charge quote.'],
              ['Day 1 — PM', 'Prestige Avon (Thanisandra). Ask: cheapest 3 BHK floor and facing available, possession date guarantee in agreement, RERA number.'],
              ['Day 2 — AM', 'Sattva Lumina (Rajanukunte). Ask: RERA portal %, construction milestone status, 3-clubhouse delivery timeline, STRR update.'],
              ['Day 2 — PM', 'Brigade Eternia (Yelahanka NT). Ask: RERA registration confirmation, Mar 2030 possession firmness, floor plan options.'],
              ['Day 3 — Optional', 'Tata Varnam (Devanahalli). Test the commute: drive from Tata Varnam to Manyata Tech Park on a weekday at 8:30 AM. If bearable, worth serious consideration.'],
            ].map(([when, action]) => (
              <Row key={when} gap={8} align="start">
                <Pill size="sm">{when}</Pill>
                <Text size="small">{action}</Text>
              </Row>
            ))}
          </Stack>
        </CardBody>
      </Card>

    </Stack>
  );
}
