import {
  BarChart,
  Card, CardBody, CardHeader,
  Divider, Grid, H1, H2, H3,
  Pill, Row, Stack, Stat, Table, Text,
  useCanvasState,
} from 'cursor/canvas';

// ── Types ──────────────────────────────────────────────────────────────────

type AreaKey = 'hosahalli' | 'thanisandra' | 'yelahanka' | 'yelahankaNT' | 'devanahalli';

interface ConnScore {
  metro: number;         // existing + confirmed near-term station proximity
  roadNH: number;        // NH / signal-free / ORR access quality
  airport: number;       // KIA distance & time
  bmtc: number;          // public bus coverage
  lastMile: number;      // auto/cab/walkability for daily errands
}

interface AreaConn {
  label: string;
  shortName: string;
  shortlistProp: string;
  manyataKm: number;
  manyataPeak: string;
  manyataOffPeak: string;
  airportMin: string;
  scores: ConnScore;
  total: number;
  metroDetail: string;
  roadDetail: string;
  airportDetail: string;
  bmtcDetail: string;
  lastMileDetail: string;
  strr: string;         // STRR impact
  catalysts: string[];
  watchOuts: string[];
  tone: 'success' | 'warning' | 'info';
}

// ── Infrastructure pipeline ────────────────────────────────────────────────

interface InfraProject {
  name: string;
  type: 'Metro' | 'Road' | 'Ring Road' | 'Airport';
  status: 'Operational' | 'Under Construction' | 'Confirmed' | 'Planning';
  benefit: string;
  timeline: string;
  areas: AreaKey[];
}

const INFRA: InfraProject[] = [
  {
    name: 'Metro Phase 2B — Yellow Line (Nagavara–Gottigere)',
    type: 'Metro',
    status: 'Under Construction',
    benefit: 'Nagavara station adds Metro access to Thanisandra / Nagavara belt',
    timeline: '2026–2027 expected (delayed; watch BMRCL updates)',
    areas: ['thanisandra'],
  },
  {
    name: 'Metro Phase 2B — Airport extension (Nagavara–KIAL)',
    type: 'Metro',
    status: 'Confirmed',
    benefit: 'Long-term benefit to Yelahanka, Hosahalli, Devanahalli corridors',
    timeline: '2030–2032 (planning stage; land acquisition ongoing)',
    areas: ['hosahalli', 'yelahanka', 'yelahankaNT', 'devanahalli'],
  },
  {
    name: 'NH44 / Bellary Road elevated corridor',
    type: 'Road',
    status: 'Operational',
    benefit: 'Signal-free elevated stretch reduces Manyata commute variance for Yelahanka / Hosahalli',
    timeline: 'Operational now',
    areas: ['hosahalli', 'yelahanka', 'yelahankaNT'],
  },
  {
    name: 'STRR — Satellite Town Ring Road',
    type: 'Ring Road',
    status: 'Under Construction',
    benefit: 'Orbital road connecting Yelahanka → Devanahalli → Hoskote → Sarjapur; dramatically cuts cross-suburb commute',
    timeline: 'Phase 1 targeted 2027–28; full completion 2030',
    areas: ['yelahanka', 'yelahankaNT', 'devanahalli', 'hosahalli'],
  },
  {
    name: 'BIAL Airport Road (NH44 → KIA)',
    type: 'Airport',
    status: 'Operational',
    benefit: 'All Airport Rd belt properties benefit; Devanahalli / Hosahalli have shortest airport run',
    timeline: 'Operational now; widening under progress',
    areas: ['hosahalli', 'yelahanka', 'yelahankaNT', 'devanahalli'],
  },
  {
    name: 'ORR (Hebbal–KR Puram segment)',
    type: 'Road',
    status: 'Operational',
    benefit: 'Thanisandra connects to ORR via Nagavara; enables access to east BLR IT parks',
    timeline: 'Operational now',
    areas: ['thanisandra'],
  },
  {
    name: 'PRR — Peripheral Ring Road',
    type: 'Ring Road',
    status: 'Planning',
    benefit: 'Outer orbital connecting far suburbs; long-term value driver for Devanahalli and outer Yelahanka',
    timeline: '2032+ (land acquisition not complete)',
    areas: ['devanahalli', 'hosahalli'],
  },
  {
    name: 'KIADB Aerospace Park access roads',
    type: 'Road',
    status: 'Under Construction',
    benefit: 'Improves internal connectivity within Aerospace SEZ; benefits Devanahalli residential',
    timeline: 'Phase 1 access roads by 2027',
    areas: ['devanahalli'],
  },
];

// ── Area connectivity data ─────────────────────────────────────────────────

const areas: Record<AreaKey, AreaConn> = {
  hosahalli: {
    label: 'Hosahalli / Airport Road belt',
    shortName: 'Hosahalli',
    shortlistProp: 'Purva Zenium 2 (Rank 1)',
    manyataKm: 14,
    manyataPeak: '30–40 min',
    manyataOffPeak: '22–28 min',
    airportMin: '20–25 min',
    scores: { metro: 3, roadNH: 8, airport: 9, bmtc: 3, lastMile: 4 },
    total: 0,
    metroDetail: 'Phase 2B Airport line is confirmed but 2030–32 timeline. Nearest current station ~8 km (Nagavara direction). Not walkable Metro access in the near term.',
    roadDetail: 'NH44 elevated corridor is the key asset — reduces signal-count to Manyata. Airport Road (Bellary Rd) is wide, well-maintained. Internal Hosahalli roads are mixed quality; main road is fine, inner lanes can be narrower.',
    airportDetail: 'Best airport access on the non-Devanahalli list — 20–25 min via Airport Road / NH44. Excellent if you fly often. Airport taxi/cab availability is good on this corridor.',
    bmtcDetail: 'BMTC coverage is sparse on Hosahalli / Billamaranahalli. No major BMTC routes through the residential pocket. BMTC from Airport Road main road is the nearest option (~1–2 km walk to main road stop).',
    lastMileDetail: 'Cab availability is moderate (Ola/Uber pool with airport drivers). Auto coverage thin inside the pocket. Plan on owning a vehicle for daily errand runs.',
    strr: 'STRR Phase 1 will pass through the Yelahanka–Hosahalli outer belt — reduces cross-suburb friction significantly when complete (~2027–28).',
    catalysts: [
      'NH44 elevated corridor: already operational — reduces Manyata variance now',
      'STRR Phase 1 (~2027): orbital link cuts Yelahanka ↔ Hosahalli ↔ outer ring commute',
      'Metro Phase 2B Airport line (2030–32): long-term property value driver',
      'Airport Road widening: ongoing, further reduces Airport Rd bottlenecks',
    ],
    watchOuts: [
      'Airport Road peak (7–9 AM): heavy commercial vehicle traffic from logistics/airport ops',
      'Internal Hosahalli lanes: flood risk near nalas during monsoon — avoid low-lying approach roads',
      'No Metro walkability for at least 6–8 years; fully car-dependent lifestyle',
    ],
    tone: 'info',
  },
  thanisandra: {
    label: 'Thanisandra / Nagavara / Kogilu',
    shortName: 'Thanisandra',
    shortlistProp: 'Prestige Avon (Rank 2)',
    manyataKm: 10,
    manyataPeak: '25–40 min',
    manyataOffPeak: '18–22 min',
    airportMin: '35–45 min',
    scores: { metro: 8, roadNH: 7, airport: 5, bmtc: 7, lastMile: 7 },
    total: 0,
    metroDetail: 'Phase 2B Nagavara station is ~2–3 km away — the strongest near-term Metro catalyst in North BLR. Yellow Line (Nagavara–Gottigere via Central Silk Board) will connect north to south directly, bypassing CBD congestion. Expected 2026–2027.',
    roadDetail: 'Thanisandra Main Road connects directly to ORR (Hebbal side) and Hennur Road. Multiple alternate routes exist via Kalyan Nagar, Nagavara, and Kodigehalli. Main road gets congested at peak; inner lanes exist as alternates.',
    airportDetail: '35–45 min to KIA — longest airport commute on the list. Adequate for occasional travel but inconvenient for weekly flyers.',
    bmtcDetail: 'Multiple BMTC routes via Nagavara and Hebbal — notably better coverage than suburban options. Routes to Manyata, CBD, and Hebbal bus stand are well-served.',
    lastMileDetail: 'Auto and cab density is higher than suburbs — urban residential density supports last-mile. Nagavara–Thanisandra has a decent auto stand network.',
    strr: 'STRR does not primarily benefit Thanisandra (inner north belt). ORR is the more relevant orbital for this area.',
    catalysts: [
      'Metro Phase 2B Nagavara station (2026–27): strongest near-term catalyst in North BLR',
      'Phase 2B Yellow Line: connects Thanisandra directly to Silk Board (south BLR IT parks) without changing trains',
      'ORR access via Nagavara: all east BLR IT parks reachable without crossing CBD',
      'Hebbal flyover: signal-free access to NH44 and airport corridor from Thanisandra',
    ],
    watchOuts: [
      'Thanisandra Main Road peak (8–9 AM, 6–8 PM): severe congestion; signal-heavy corridor',
      'Airport commute (35–45 min) is the longest on the list — not ideal for frequent flyers',
      'Nagavara rajakaluve proximity: some Thanisandra pockets flood during heavy rain; verify drainage',
    ],
    tone: 'success',
  },
  yelahanka: {
    label: 'Yelahanka / Rajanukunte · SH-9 belt',
    shortName: 'Yelahanka (Sattva)',
    shortlistProp: 'Sattva Lumina (Rank 3)',
    manyataKm: 11,
    manyataPeak: '30–45 min',
    manyataOffPeak: '22–30 min',
    airportMin: '20–28 min',
    scores: { metro: 3, roadNH: 7, airport: 8, bmtc: 4, lastMile: 4 },
    total: 0,
    metroDetail: 'No walkable Metro planned for Rajanukunte / SH-9 belt in the foreseeable future. Phase 2B Airport line long-term corridor passes further east. Nearest future Metro is 5+ km away.',
    roadDetail: 'SH-9 (Doddaballapura Road) is the primary artery — connects to NH44 at Yelahanka and to Doddaballapura. Road quality is fair; single-carriageway sections exist between Rajanukunte and Yelahanka. NH44 access reduces peak-hour variance once on the main road.',
    airportDetail: '20–28 min to KIA via Yelahanka → NH44 → Airport Road. Strong airport access — suitable for regular flyers.',
    bmtcDetail: 'BMTC coverage on SH-9 corridor is limited. Yelahanka town (2–3 km away) has better BMTC options. Daily BMTC commuting from Rajanukunte is not practical.',
    lastMileDetail: 'Rajanukunte is semi-suburban. Auto and cab coverage is thin inside the pocket. Yelahanka town centre is 2–3 km for better last-mile options.',
    strr: 'STRR Phase 1 alignment passes through Yelahanka-Doddaballapura corridor — direct benefit to SH-9 belt. Will significantly improve Manyata and cross-suburb access when operational (~2027–28).',
    catalysts: [
      'STRR Phase 1 (2027–28): passes through SH-9 / Yelahanka belt; cuts cross-suburb commute',
      'NH44 access at Yelahanka: signal-free stretch reduces peak-hour variance',
      'Airport Road proximity: 20–28 min to KIA; future Metro alignment will pass nearby (long-term)',
      'Sattva Lumina township: internal road network within 12.8-acre project reduces last-mile for residents',
    ],
    watchOuts: [
      'SH-9 single-carriageway sections between Rajanukunte and Yelahanka: bottleneck during peak',
      'No BMTC or Metro within walkable distance from Rajanukunte; car-dependent daily life',
      'Manyata peak commute (30–45 min) slightly longer than Thanisandra despite similar km',
    ],
    tone: 'info',
  },
  yelahankaNT: {
    label: 'Yelahanka New Town',
    shortName: 'Yelahanka NT',
    shortlistProp: 'Brigade Eternia (Rank 4)',
    manyataKm: 15,
    manyataPeak: '25–38 min',
    manyataOffPeak: '18–24 min',
    airportMin: '20–25 min',
    scores: { metro: 4, roadNH: 8, airport: 8, bmtc: 6, lastMile: 6 },
    total: 0,
    metroDetail: 'Phase 2B Airport line passes close to Yelahanka NH44 corridor (long-term). Nearest planned station ~5 km (Yelahanka proper). BMRCL Phase 3 Yelahanka extension in long-term planning. No walkable Metro near-term.',
    roadDetail: 'NH44 direct access from Yelahanka New Town sectors is the biggest connectivity asset. Wide, well-maintained sector roads within Yelahanka NT — planned BDA layout. Yelahanka → Hebbal via NH44 elevated takes 18–22 min off-peak.',
    airportDetail: '20–25 min via Airport Road / NH44 — tied with Hosahalli for second-best airport access. Good for regular flyers.',
    bmtcDetail: 'Yelahanka has a BMTC depot — the only suburban location on the list with meaningful public bus coverage. Multiple routes to Manyata, Hebbal, Majestic, and airport. Best BMTC access among all non-Thanisandra options.',
    lastMileDetail: 'Yelahanka NT town centre has auto stands, Ola/Uber density, and daily errand infrastructure. Better last-mile than Rajanukunte or Hosahalli. Auto frequency is reasonable within the township area.',
    strr: 'STRR alignment passes through Yelahanka outer belt — direct catalyst for Yelahanka NT as an interchange suburb. Will link to Devanahalli, Hosahalli, and Hoskote directions.',
    catalysts: [
      'NH44 direct: signal-free elevated access reduces Manyata variance significantly',
      'BMTC depot in Yelahanka: best public transport coverage among suburban shortlist options',
      'STRR Phase 1 (2027–28): Yelahanka NT becomes an STRR interchange suburb',
      'Metro Phase 2B Airport line (2030–32): Yelahanka NH44 corridor in alignment zone',
    ],
    watchOuts: [
      'NH44 Yelahanka–Hebbal peak (7:30–9:30 AM): elevated is good but Hebbal junction at the end is a pinch-point',
      'No walkable Metro for at least 6–8 years',
      'Possession date ambiguity (Mar vs Dec 2030) is a planning risk; confirm RERA date before booking',
    ],
    tone: 'success',
  },
  devanahalli: {
    label: 'Devanahalli / Shettigere · KIADB belt',
    shortName: 'Devanahalli',
    shortlistProp: 'Tata Varnam (Rank 5)',
    manyataKm: 32,
    manyataPeak: '60–80 min',
    manyataOffPeak: '35–48 min',
    airportMin: '10–15 min',
    scores: { metro: 2, roadNH: 7, airport: 10, bmtc: 2, lastMile: 2 },
    total: 0,
    metroDetail: 'No Metro confirmed for Devanahalli in any current phase. Airport Metro extension is in very long-term planning (Phase 3 / 2032+). This is the most car-dependent area on the list.',
    roadDetail: 'NH44 and Airport Expressway are the primary routes. Road quality is good (airport-zone standard). SH-9 connects to Doddaballapura and Yelahanka. KIADB internal roads within the Aerospace park are well-maintained. Main limitation: all roads eventually funnel into NH44 at Devanahalli junction.',
    airportDetail: 'Best airport access on the entire list — 10–15 min to KIA. If you fly weekly for work, no other location comes close.',
    bmtcDetail: 'Very limited BMTC service in Devanahalli. Some Karnataka KSRTC buses to Bangalore CBD. Tata Carnatica township is entirely car-dependent for daily commuting.',
    lastMileDetail: 'Devanahalli town is basic — auto coverage minimal, cab surge pricing common due to distance from city. For day-to-day errands, the Carnatica township\'s internal retail will be the primary option.',
    strr: 'STRR Phase 1 will connect Devanahalli to the orbital ring, dramatically reducing Manyata commute when complete (~2027–28). STRR completion is the single biggest connectivity catalyst for this location.',
    catalysts: [
      'STRR Phase 1 (2027–28): when operational, cuts Devanahalli → Manyata commute significantly',
      'Airport Expressway: already the best airport access on the list at 10–15 min',
      'KIADB Aerospace Park roads: improves internal area connectivity and drives employment to the zone',
      'PRR (Peripheral Ring Road, 2032+): further outer orbital connection if it materialises',
    ],
    watchOuts: [
      'Daily commute to Manyata (60–80 min peak) is the critical test — DO this drive on a weekday morning before booking',
      'No Metro or BMTC near-term: fully car-dependent; second vehicle may be necessary for household',
      'NH44 Devanahalli junction: can be congested during morning peaks with airport logistics traffic',
      'STRR timeline is government infrastructure — delays of 1–2 years are common; factor this into decision',
    ],
    tone: 'warning',
  },
};

// ── Compute totals ─────────────────────────────────────────────────────────

(Object.keys(areas) as AreaKey[]).forEach(k => {
  const s = areas[k].scores;
  areas[k].total = s.metro + s.roadNH + s.airport + s.bmtc + s.lastMile;
});

const SCORE_FACTORS: [keyof ConnScore, string][] = [
  ['metro',    'Metro (now + near-term)'],
  ['roadNH',   'Road / NH quality'],
  ['airport',  'Airport KIA access'],
  ['bmtc',     'BMTC / public bus'],
  ['lastMile', 'Last-mile (auto/cab)'],
];

const STATUS_TONE: Record<InfraProject['status'], 'success' | 'warning' | 'info' | 'danger'> = {
  'Operational':         'success',
  'Under Construction':  'warning',
  'Confirmed':           'info',
  'Planning':            'danger',
};

// ── Component ──────────────────────────────────────────────────────────────

export default function Connectivity() {
  const [activeArea, setActiveArea] = useCanvasState<AreaKey>('connArea', 'thanisandra');
  const a = areas[activeArea as AreaKey];
  const areaKeys = Object.keys(areas) as AreaKey[];
  const sortedByTotal = [...areaKeys].sort((x, y) => areas[y].total - areas[x].total);

  const chartData = SCORE_FACTORS.map(([key]) =>
    areaKeys.map(k => areas[k].scores[key])
  );

  return (
    <Stack gap={28} style={{ padding: '24px 28px', maxWidth: 980 }}>

      {/* ── Header ── */}
      <Stack gap={4}>
        <Row gap={10} align="center">
          <H1>Criterion 2 — Connectivity & Infrastructure</H1>
          <Pill tone="info">After Area Selection</Pill>
        </Row>
        <Text tone="secondary">
          5 shortlisted areas evaluated on Metro, road/NH, airport access, BMTC, and last-mile.
          Infrastructure pipeline (STRR, Phase 2B, PRR) modelled separately.
        </Text>
      </Stack>

      {/* ── Summary stats ── */}
      <Grid columns={4} gap={14}>
        <Stat
          value={areas[sortedByTotal[0]].shortName}
          label="Best overall connectivity"
          tone="success"
        />
        <Stat value="Nagavara Ph2B" label="Strongest near-term catalyst" tone="success" />
        <Stat value="STRR ~2027" label="Biggest outer-belt upgrade" tone="warning" />
        <Stat
          value={areas[sortedByTotal[sortedByTotal.length - 1]].shortName}
          label="Most car-dependent"
          tone="warning"
        />
      </Grid>

      <Divider />

      {/* ── Infrastructure pipeline ── */}
      <Stack gap={10}>
        <H2>Infrastructure pipeline — confirmed + planned</H2>
        <Table
          headers={['Project', 'Type', 'Status', 'Timeline', 'Areas benefited']}
          rows={INFRA.map(p => [
            p.name,
            p.type,
            p.status,
            p.timeline,
            p.areas.map(k => areas[k].shortName).join(', '),
          ])}
          rowTone={INFRA.map(p => STATUS_TONE[p.status])}
          striped
        />
        <Text size="small" tone="secondary">
          Colour: green = operational · yellow = under construction · blue = confirmed planning · red = early planning only.
        </Text>
      </Stack>

      <Divider />

      {/* ── Connectivity score matrix ── */}
      <Stack gap={10}>
        <H2>Connectivity score matrix — 5 dimensions × 5 areas</H2>
        <Table
          headers={['Area', 'Property', 'Metro', 'Road/NH', 'Airport', 'BMTC', 'Last-mile', 'Total /50']}
          rows={sortedByTotal.map(k => [
            areas[k].shortName,
            areas[k].shortlistProp,
            `${areas[k].scores.metro}/10`,
            `${areas[k].scores.roadNH}/10`,
            `${areas[k].scores.airport}/10`,
            `${areas[k].scores.bmtc}/10`,
            `${areas[k].scores.lastMile}/10`,
            `${areas[k].total}/50`,
          ])}
          rowTone={sortedByTotal.map(k =>
            areas[k].total >= 32 ? 'success' : areas[k].total <= 22 ? 'danger' : undefined
          )}
          striped
        />
      </Stack>

      <Divider />

      {/* ── Charts ── */}
      <Grid columns={2} gap={16}>
        <Stack gap={8}>
          <H3>Connectivity total score (/50)</H3>
          <BarChart
            categories={sortedByTotal.map(k => areas[k].shortName)}
            series={[{ name: 'Score', data: sortedByTotal.map(k => areas[k].total) }]}
            height={240}
          />
        </Stack>
        <Stack gap={8}>
          <H3>Manyata peak commute (minutes)</H3>
          <BarChart
            categories={areaKeys.map(k => areas[k].shortName)}
            series={[{ name: 'Peak min', data: [35, 32, 37, 30, 70] }]}
            valueSuffix=" min"
            height={240}
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
                tone={areas[k].total >= 32 ? 'success' : areas[k].total <= 22 ? 'warning' : undefined}
              >
                {areas[k].shortName}
              </Pill>
            ))}
          </Row>
        </Stack>

        <Grid columns={4} gap={12}>
          <Stat value={`${a.manyataKm} km`} label="Distance to Manyata" />
          <Stat value={a.manyataPeak} label="Peak commute" tone={a.manyataKm <= 15 ? 'success' : 'warning'} />
          <Stat value={a.airportMin} label="To Airport KIA" tone={parseInt(a.airportMin) <= 25 ? 'success' : undefined} />
          <Stat value={`${a.total}/50`} label="Connectivity score" tone={a.total >= 32 ? 'success' : a.total <= 22 ? 'danger' : undefined} />
        </Grid>

        <Text size="small" weight="semibold">{a.shortlistProp} — {a.label}</Text>

        <Grid columns={2} gap={14}>
          <Stack gap={10}>
            <Card>
              <CardHeader trailing={<Pill tone={a.scores.metro >= 6 ? 'success' : a.scores.metro >= 4 ? 'warning' : 'danger'} size="sm">{a.scores.metro}/10</Pill>}>
                Metro connectivity
              </CardHeader>
              <CardBody><Text size="small" tone="secondary">{a.metroDetail}</Text></CardBody>
            </Card>
            <Card>
              <CardHeader trailing={<Pill tone={a.scores.roadNH >= 7 ? 'success' : 'warning'} size="sm">{a.scores.roadNH}/10</Pill>}>
                Road / NH quality
              </CardHeader>
              <CardBody><Text size="small" tone="secondary">{a.roadDetail}</Text></CardBody>
            </Card>
            <Card>
              <CardHeader trailing={<Pill tone={a.scores.airport >= 8 ? 'success' : a.scores.airport >= 5 ? 'warning' : 'danger'} size="sm">{a.scores.airport}/10</Pill>}>
                Airport KIA access
              </CardHeader>
              <CardBody><Text size="small" tone="secondary">{a.airportDetail}</Text></CardBody>
            </Card>
          </Stack>
          <Stack gap={10}>
            <Card>
              <CardHeader trailing={<Pill tone={a.scores.bmtc >= 6 ? 'success' : a.scores.bmtc >= 4 ? 'warning' : 'danger'} size="sm">{a.scores.bmtc}/10</Pill>}>
                BMTC / public bus
              </CardHeader>
              <CardBody><Text size="small" tone="secondary">{a.bmtcDetail}</Text></CardBody>
            </Card>
            <Card>
              <CardHeader trailing={<Pill tone={a.scores.lastMile >= 6 ? 'success' : a.scores.lastMile >= 4 ? 'warning' : 'danger'} size="sm">{a.scores.lastMile}/10</Pill>}>
                Last-mile (auto / cab)
              </CardHeader>
              <CardBody><Text size="small" tone="secondary">{a.lastMileDetail}</Text></CardBody>
            </Card>
            <Card>
              <CardHeader trailing={<Pill tone="info" size="sm">STRR impact</Pill>}>
                STRR — Satellite Town Ring Road
              </CardHeader>
              <CardBody><Text size="small" tone="secondary">{a.strr}</Text></CardBody>
            </Card>
          </Stack>
        </Grid>

        <Grid columns={2} gap={14}>
          <Card>
            <CardHeader trailing={<Pill tone="success" size="sm">Tailwinds</Pill>}>
              Connectivity catalysts
            </CardHeader>
            <CardBody>
              <Stack gap={4}>
                {a.catalysts.map((c: string, i: number) => (
                  <Row key={i} gap={6} style={{ alignItems: 'flex-start' }}>
                    <Text size="small" tone="secondary" style={{ minWidth: 10 }}>↑</Text>
                    <Text size="small" tone="secondary">{c}</Text>
                  </Row>
                ))}
              </Stack>
            </CardBody>
          </Card>
          <Card>
            <CardHeader trailing={<Pill tone="warning" size="sm">Watch out</Pill>}>
              Connectivity risks
            </CardHeader>
            <CardBody>
              <Stack gap={4}>
                {a.watchOuts.map((w: string, i: number) => (
                  <Row key={i} gap={6} style={{ alignItems: 'flex-start' }}>
                    <Text size="small" tone="secondary" style={{ minWidth: 10 }}>!</Text>
                    <Text size="small" tone="secondary">{w}</Text>
                  </Row>
                ))}
              </Stack>
            </CardBody>
          </Card>
        </Grid>

        <Stack gap={8}>
          <H3>Factor radar — {a.shortName}</H3>
          <BarChart
            categories={SCORE_FACTORS.map(([, label]) => label)}
            series={[{ name: a.shortName, data: SCORE_FACTORS.map(([key]) => a.scores[key]) }]}
            horizontal
            height={200}
          />
        </Stack>
      </Stack>

      <Divider />

      {/* ── Verdict ── */}
      <Stack gap={8}>
        <H2>Connectivity verdict</H2>
        <Table
          headers={['Rank', 'Area', 'Property', 'Score', 'Key strength', 'Key weakness', 'STRR benefit']}
          rows={sortedByTotal.map((k, i) => [
            String(i + 1),
            areas[k].shortName,
            areas[k].shortlistProp,
            `${areas[k].total}/50`,
            k === 'thanisandra' ? 'Metro Phase 2B Nagavara (2026–27)' :
            k === 'yelahankaNT' ? 'NH44 + BMTC depot' :
            k === 'hosahalli'   ? 'NH44 + best non-Devnahalli airport time' :
            k === 'yelahanka'   ? 'SH-9 → NH44 + Airport access' :
                                  'Best airport in city (10–15 min)',
            k === 'thanisandra' ? 'Airport 35–45 min; peak road congestion' :
            k === 'yelahankaNT' ? 'No walkable Metro near-term' :
            k === 'hosahalli'   ? 'No Metro; sparse BMTC' :
            k === 'yelahanka'   ? 'SH-9 single-lane sections; no Metro' :
                                  '60–80 min Manyata commute; no Metro/BMTC',
            k === 'devanahalli' ? 'High — cuts Manyata run when live' :
            k === 'yelahankaNT' ? 'High — interchange suburb on STRR' :
            k === 'yelahanka'   ? 'High — SH-9 on STRR alignment' :
            k === 'hosahalli'   ? 'Medium — outer belt benefit' :
                                  'Low — inner north; ORR more relevant',
          ])}
          rowTone={sortedByTotal.map(k =>
            areas[k].total >= 32 ? 'success' : areas[k].total <= 22 ? 'danger' : undefined
          )}
          striped
        />
        <Text size="small" tone="secondary">
          Key insight: Thanisandra wins connectivity today on Metro + BMTC + Manyata reach. Yelahanka NT is second on road quality and BMTC.
          Both outer belts (Hosahalli, Yelahanka/Sattva) are middle-tier — good road but no Metro/BMTC.
          Devanahalli is last on connectivity but has the single best asset: KIA Airport in 10–15 min.
          STRR (~2027) is the swing factor for all outer-belt areas: when live, Yelahanka NT and Hosahalli move up significantly.
        </Text>
      </Stack>

    </Stack>
  );
}
