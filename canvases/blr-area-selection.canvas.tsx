import {
  BarChart, LineChart,
  Card, CardBody, CardHeader,
  Divider, Grid, H1, H2, H3,
  Pill, Row, Stack, Stat, Table, Text,
  useCanvasState,
} from 'cursor/canvas';

// ── area data ──────────────────────────────────────────────────────────────

type AreaKey = 'thanisandra' | 'yelahanka' | 'jakkur' | 'hebbal' | 'devanahalli' | 'kalyanNagar';

interface Area {
  label: string;
  distance: string;
  peakCommute: string;
  offPeakCommute: string;
  priceRange: string;
  whatYouGet: string;
  appreciation5yr: number; // %
  appreciationOutlook: 'high' | 'medium-high' | 'medium';
  metro: string;
  maturity: 'established' | 'maturing' | 'emerging';
  verdict: string;
  pros: string[];
  cons: string[];
  bestFor: string;
  rating: number; // out of 5 for self-use near Hebbal/Manyata
  tone: 'success' | 'warning' | 'info';
}

const areas: Record<AreaKey, Area> = {
  thanisandra: {
    label: 'Thanisandra / Kogilu / Nagavara',
    distance: '7–10 km',
    peakCommute: '25–40 min',
    offPeakCommute: '15–20 min',
    priceRange: '₹6,500–9,000/sqft',
    whatYouGet: '3 BHK (1,450–1,750 sqft) in gated society with amenities',
    appreciation5yr: 55,
    appreciationOutlook: 'high',
    metro: 'Phase 2B Nagavara station (Hebbal–Airport line) — game changer when ready',
    maturity: 'maturing',
    verdict: 'Best overall choice for your profile',
    pros: [
      'Closest to Manyata after Hebbal — 25–35 min peak commute',
      'Metro Phase 2B (Nagavara–Airport corridor) will dramatically boost values',
      'Large new inventory — many RERA-compliant options at ₹3 Cr',
      '3 BHK is achievable; good schools (Orchids, VIBGYOR) and hospitals nearby',
      'Significant price appreciation in last 3 years — still not fully priced in',
    ],
    cons: [
      'Some pockets have waterlogging in monsoon — check drainage history',
      'Heavy traffic on Thanisandra Main Road at peak hours',
      'Mix of A-khata and B-khata properties — need careful legal screening',
    ],
    bestFor: 'Young professional, self-use, wants proximity to work + future resale',
    rating: 5,
    tone: 'success',
  },
  yelahanka: {
    label: 'Yelahanka / New Town / Sahakar Nagar',
    distance: '13–18 km',
    peakCommute: '35–55 min',
    offPeakCommute: '20–30 min',
    priceRange: '₹5,500–8,000/sqft',
    whatYouGet: '3 BHK (1,600–2,000 sqft) or 3.5 BHK in established society',
    appreciation5yr: 48,
    appreciationOutlook: 'medium-high',
    metro: 'No Metro currently; future Phase 3 Yelahanka extension — long-term',
    maturity: 'established',
    verdict: 'Best quality of life; slight commute trade-off',
    pros: [
      'Excellent social infrastructure — Esteem Mall, Phoenix Marketcity nearby, top schools',
      'Significantly larger apartments for same budget vs Thanisandra',
      'Very well-planned area, wide roads, good BBMP coverage',
      'On Bellary Road (NH44) — Airport access in 20–25 min; future appreciation',
      'Quieter, greener, less congested than inner north',
    ],
    cons: [
      'Commute to Manyata is 40–55 min in peak hours via Hebbal flyover',
      'No Metro connectivity in near term — depends on personal transport',
      'Slightly lower rental yield compared to Thanisandra (less IT crowd)',
    ],
    bestFor: 'Family use, prioritises space and lifestyle over commute time',
    rating: 4,
    tone: 'success',
  },
  jakkur: {
    label: 'Jakkur / Rachenahalli / Bagalur Road',
    distance: '10–14 km',
    peakCommute: '30–45 min',
    offPeakCommute: '20–25 min',
    priceRange: '₹5,800–7,500/sqft',
    whatYouGet: '3 BHK (1,500–1,850 sqft) with good amenities',
    appreciation5yr: 42,
    appreciationOutlook: 'medium-high',
    metro: 'Phase 3 planning stage — 5–8 years away',
    maturity: 'maturing',
    verdict: 'Good value; quieter living; less liquid resale market',
    pros: [
      'Excellent value — large 3 BHKs well within ₹3 Cr',
      'Jakkur Lake vicinity — green, pleasant area',
      'Good new-age residential projects with amenities',
      'Less congested than Thanisandra; cleaner air',
    ],
    cons: [
      'Limited social infrastructure currently (improving but not there yet)',
      'Fewer large hospitals / top schools in immediate vicinity',
      'Resale liquidity lower than Thanisandra/Yelahanka',
      'Road connectivity has some gaps',
    ],
    bestFor: 'Budget-conscious buyer wanting max space; patient on appreciation',
    rating: 3,
    tone: 'info',
  },
  hebbal: {
    label: 'Hebbal / Bellary Road (0–4 km from Manyata)',
    distance: '2–5 km',
    peakCommute: '10–20 min',
    offPeakCommute: '8–12 min',
    priceRange: '₹10,000–14,000/sqft',
    whatYouGet: '2 BHK (900–1,100 sqft) in premium society OR 1 BHK in luxury',
    appreciation5yr: 38,
    appreciationOutlook: 'medium',
    metro: 'Phase 2B Hebbal station confirmed — already partially priced in',
    maturity: 'established',
    verdict: 'Closest to work but worst value-for-money at ₹3 Cr',
    pros: [
      'Nearest to Manyata Tech Park — 10–20 min even in peak hours',
      'Premium established area; excellent hospitals (Columbia Asia, Manipal)',
      'Metro Phase 2B Hebbal station confirmed',
      'Strong rental demand from Manyata employees',
    ],
    cons: [
      '₹3 Cr gets only a 2–3 BHK (1,080–1,300 sqft) — poor value for money',
      'Extremely poor value per sqft compared to micro-markets 8–10 km away',
      'Heavy traffic congestion; Hebbal flyover bottleneck is notorious',
      'Appreciation potential is already plateauing — premium already baked in',
    ],
    bestFor: 'Only if commute time is absolutely non-negotiable',
    rating: 2,
    tone: 'warning',
  },
  devanahalli: {
    label: 'Devanahalli / Aerospace SEZ / NH44',
    distance: '28–35 km',
    peakCommute: '60–80 min',
    offPeakCommute: '35–45 min',
    priceRange: '₹4,500–6,500/sqft',
    whatYouGet: '3–4 BHK villa / large apartment (1,800–2,400 sqft) or villa plot',
    appreciation5yr: 65,
    appreciationOutlook: 'high',
    metro: 'Phase 3 Airport Metro extension — confirmed in planning, 7–10 yrs',
    maturity: 'emerging',
    verdict: 'Best appreciation story; commute is the dealbreaker for self-use',
    pros: [
      'Highest appreciation potential in BLR North — 60–70% in 5 yrs historically',
      'Massive upcoming infra: Aerospace SEZ, BIAL expansion, Devanahalli Business Park',
      'Largest units per rupee — spacious 3–4 BHK villas/apartments easily within ₹3 Cr',
      'Flip potential: buy now at ₹5,500/sqft, sell in 7 yrs at ₹9,000+',
    ],
    cons: [
      '60–80 min commute to Manyata in peak hours — severe daily fatigue',
      'Limited social infrastructure currently (hospitals, schools far)',
      'Liquidity risk — resale takes longer in slower market cycles',
      'Not suitable for self-use if you need to commute 5 days a week',
    ],
    bestFor: 'Investment/rental or those who WFH 3–4 days/week',
    rating: 2,
    tone: 'warning',
  },
  kalyanNagar: {
    label: 'Kalyan Nagar / RT Nagar / HBR Layout',
    distance: '8–12 km',
    peakCommute: '25–40 min',
    offPeakCommute: '15–20 min',
    priceRange: '₹7,500–9,500/sqft',
    whatYouGet: '2–3 BHK (1,100–1,400 sqft) older or builder floor OR 2 BHK in new project',
    appreciation5yr: 35,
    appreciationOutlook: 'medium',
    metro: 'Near Green Line (Nagasandra end); Purple Line extension planned',
    maturity: 'established',
    verdict: 'Established and convenient; limited new inventory at ₹3 Cr',
    pros: [
      'Very established area — hospitals, schools, markets all within 2 km',
      'Good connectivity: close to both Hebbal and Mebhal junction',
      'Strong rental demand due to proximity to CBD and Manyata',
      'BBMP Area — A-Khata, no legal complications',
    ],
    cons: [
      '₹3 Cr buys a 2–3 BHK in older buildings or builder floors',
      'New society inventory with amenities is limited in this range',
      'Lower appreciation upside — already well-developed',
      'Congested; older road network',
    ],
    bestFor: 'Buyer who wants established area with good daily convenience',
    rating: 3,
    tone: 'info',
  },
};

export default function AreaSelection() {
  const [activeArea, setActiveArea] = useCanvasState<AreaKey>('area', 'thanisandra');

  const a = areas[activeArea];

  const areaKeys = Object.keys(areas) as AreaKey[];

  return (
    <Stack gap={28} style={{ padding: '24px 28px', maxWidth: 960 }}>

      {/* ── header ── */}
      <Stack gap={4}>
        <H1>Area & Location Selection</H1>
        <Text tone="secondary">Workplace: Hebbal / Manyata Tech Park · Purpose: Self-use · Budget: ₹3 Cr</Text>
      </Stack>

      <Grid columns={4} gap={14}>
        <Stat value="6" label="Micro-Markets Evaluated" />
        <Stat value="Thanisandra" label="Top Recommendation" tone="success" />
        <Stat value="7–10 km" label="Sweet Spot Distance" tone="info" />
        <Stat value="Metro Ph2B" label="Key Catalyst to Track" tone="warning" />
      </Grid>

      <Divider />

      {/* ── overview table ── */}
      <Stack gap={12}>
        <H2>All Micro-Markets at a Glance</H2>
        <Table
          headers={['Area', 'Distance to Manyata', 'Peak Commute', 'What ₹3 Cr Gets', 'Appreciation (5yr)', 'Self-Use Rating']}
          rows={areaKeys.map(k => [
            areas[k].label.split('/')[0].trim(),
            areas[k].distance,
            areas[k].peakCommute,
            areas[k].whatYouGet.split('(')[0].trim(),
            `~${areas[k].appreciation5yr}%`,
            '★'.repeat(areas[k].rating) + '☆'.repeat(5 - areas[k].rating),
          ])}
          rowTone={areaKeys.map(k =>
            areas[k].rating === 5 ? 'success' :
            areas[k].rating === 4 ? undefined :
            areas[k].rating <= 2 ? 'warning' :
            undefined
          )}
          striped
        />
      </Stack>

      <Divider />

      {/* ── appreciation chart ── */}
      <Stack gap={12}>
        <H2>Appreciation Outlook vs Commute Trade-off</H2>
        <Grid columns={2} gap={16}>
          <Stack gap={8}>
            <H3>5-Year Historical Appreciation (%)</H3>
            <BarChart
              categories={areaKeys.map(k => areas[k].label.split('/')[0].trim())}
              series={[{ name: '5yr Price Appreciation %', data: areaKeys.map(k => areas[k].appreciation5yr) }]}
              valueSuffix="%"
              height={220}
            />
          </Stack>
          <Stack gap={8}>
            <H3>Peak Hour Commute (minutes)</H3>
            <BarChart
              categories={areaKeys.map(k => areas[k].label.split('/')[0].trim())}
              series={[{ name: 'Peak Commute (min)', data: [32, 45, 37, 15, 70, 32] }]}
              valueSuffix=" min"
              height={220}
            />
          </Stack>
        </Grid>
        <Text size="small" tone="secondary">
          Hebbal has the shortest commute but lowest appreciation upside (already priced in). Devanahalli has the best appreciation but 70+ min commute. Thanisandra hits the sweet spot.
        </Text>
      </Stack>

      <Divider />

      {/* ── deep dive ── */}
      <Stack gap={14}>
        <Row gap={8} align="center">
          <H2>Deep Dive</H2>
          <Row gap={6} wrap>
            {areaKeys.map(k => (
              <Pill
                key={k}
                active={activeArea === k}
                tone={areas[k].tone === 'success' ? 'success' : areas[k].tone === 'warning' ? 'warning' : 'neutral'}
                onClick={() => setActiveArea(k)}
              >
                {areas[k].label.split('/')[0].trim()}
              </Pill>
            ))}
          </Row>
        </Row>

        <Grid columns={4} gap={14}>
          <Stat value={a.distance} label="Distance to Manyata" />
          <Stat
            value={a.peakCommute}
            label="Peak Commute"
            tone={a.rating <= 2 ? 'danger' : a.rating === 3 ? 'warning' : undefined}
          />
          <Stat value={`~${a.appreciation5yr}%`} label="5yr Appreciation" tone={a.appreciation5yr >= 55 ? 'success' : a.appreciation5yr >= 40 ? 'warning' : undefined} />
          <Stat value={`${a.rating}/5`} label="Self-Use Rating" tone={a.rating >= 4 ? 'success' : a.rating <= 2 ? 'danger' : 'warning'} />
        </Grid>

        <Grid columns={2} gap={14}>
          <Card>
            <CardHeader trailing={<Pill size="sm">{a.maturity}</Pill>}>
              {a.label} — What You Get
            </CardHeader>
            <CardBody>
              <Stack gap={10}>
                <Table
                  headers={['Factor', 'Detail']}
                  rows={[
                    ['Price range', a.priceRange],
                    ['At ₹3 Cr you get', a.whatYouGet],
                    ['Off-peak commute', a.offPeakCommute],
                    ['Metro connectivity', a.metro],
                    ['Best suited for', a.bestFor],
                    ['Our verdict', a.verdict],
                  ]}
                  rowTone={[undefined, 'info', undefined, undefined, undefined, a.tone === 'success' ? 'success' : a.tone === 'warning' ? 'warning' : undefined]}
                  striped
                />
              </Stack>
            </CardBody>
          </Card>

          <Stack gap={14}>
            <Card>
              <CardHeader trailing={<Pill tone="success" size="sm">Pros</Pill>}>
                Why Consider It
              </CardHeader>
              <CardBody>
                <Stack gap={6}>
                  {a.pros.map((p, i) => (
                    <Row key={i} gap={8} align="start">
                      <Text tone="secondary" size="small" style={{ minWidth: 14 }}>+</Text>
                      <Text size="small">{p}</Text>
                    </Row>
                  ))}
                </Stack>
              </CardBody>
            </Card>

            <Card>
              <CardHeader trailing={<Pill tone="warning" size="sm">Cons</Pill>}>
                Watch Out For
              </CardHeader>
              <CardBody>
                <Stack gap={6}>
                  {a.cons.map((c, i) => (
                    <Row key={i} gap={8} align="start">
                      <Text tone="secondary" size="small" style={{ minWidth: 14 }}>−</Text>
                      <Text size="small">{c}</Text>
                    </Row>
                  ))}
                </Stack>
              </CardBody>
            </Card>
          </Stack>
        </Grid>
      </Stack>

      <Divider />

      {/* ── metro phase 2B ── */}
      <Stack gap={12}>
        <H2>The Metro Phase 2B Factor — North Bangalore's Biggest Catalyst</H2>
        <Text tone="secondary" size="small">
          Namma Metro Phase 2B (Nagavara to KIA / Airport) is the single biggest infrastructure event for North Bangalore property. Understanding its route is critical for your area decision.
        </Text>

        <Grid columns={2} gap={14}>
          <Card>
            <CardHeader trailing={<Pill tone="info" size="sm">Phase 2B</Pill>}>
              Nagavara → Hebbal → KR Puram → Airport Corridor
            </CardHeader>
            <CardBody>
              <Stack gap={8}>
                <Table
                  headers={['Station / Area', 'Impact on Property', 'Timeline']}
                  rows={[
                    ['Nagavara / Thanisandra', 'Direct station — property within 1.5 km will see 15–25% premium', 'Phase 2 — 2026-28 est.'],
                    ['Hebbal', 'Confirmed station — premium already partially baked in', 'Phase 2 — 2026-28 est.'],
                    ['Bellary Road Corridor', 'Indirect benefit — road decongestion', 'With Phase 2 opening'],
                    ['Devanahalli Airport', 'Phase 3 — airport Metro extension', '2030+ est.'],
                  ]}
                  rowTone={['success', undefined, undefined, 'neutral']}
                  striped
                />
                <Text size="small" tone="secondary">
                  A Thanisandra property within 500m–1km of the Nagavara Metro station will be the single highest-leverage move in North BLR right now.
                </Text>
              </Stack>
            </CardBody>
          </Card>

          <Card>
            <CardHeader trailing={<Pill tone="success" size="sm">Investment lens</Pill>}>
              Pre-Metro Buy Opportunity
            </CardHeader>
            <CardBody>
              <Stack gap={8}>
                <Text size="small">Metro-adjacent properties in Bangalore have historically appreciated <Text weight="semibold" as="span">20–35% above market rate</Text> in the 2–3 years before a station opens. Whitefield saw this with Phase 1 extension. Hebbal has already seen this.</Text>
                <Text size="small">Thanisandra / Nagavara is currently in the <Text weight="semibold" as="span">"pre-announcement premium" phase</Text> — prices have risen but the full Metro premium hasn't been captured yet.</Text>
                <Table
                  headers={['Phase', 'Price Behaviour']}
                  rows={[
                    ['Pre-announcement', 'Normal market appreciation'],
                    ['Post-announcement (now)', '5–10% above base trend'],
                    ['Under construction (2025-27)', '10–20% premium building'],
                    ['Opening year', '20–35% one-time jump'],
                  ]}
                  rowTone={[undefined, 'info', 'warning', 'success']}
                />
              </Stack>
            </CardBody>
          </Card>
        </Grid>
      </Stack>

      <Divider />

      {/* ── self-use specific factors ── */}
      <Stack gap={12}>
        <H2>Self-Use Specific Checklist for North Bangalore</H2>

        <Grid columns={3} gap={14}>
          <Card>
            <CardHeader>Hospitals Within 5 km</CardHeader>
            <CardBody>
              <Stack gap={5}>
                {[
                  ['Columbia Asia, Hebbal', 'Tier 1'],
                  ['Manipal Hospital, Hebbal', 'Tier 1'],
                  ['Aster CMI, Hebbal', 'Tier 1'],
                  ['Suguna Hospital, Thanisandra', 'Tier 2'],
                  ['Baptist Hospital, Bellary Rd', 'Tier 2'],
                ].map(([h, t]) => (
                  <Row key={h} gap={8} justify="space-between">
                    <Text size="small">{h}</Text>
                    <Pill size="sm" tone={t === 'Tier 1' ? 'success' : 'neutral'}>{t}</Pill>
                  </Row>
                ))}
              </Stack>
            </CardBody>
          </Card>

          <Card>
            <CardHeader>Schools (2–5 km from Thanisandra)</CardHeader>
            <CardBody>
              <Stack gap={5}>
                {[
                  'Orchids International School',
                  'VIBGYOR High, Thanisandra',
                  'Delhi Public School (Yelahanka)',
                  'Ekya School, Thanisandra',
                  'New Horizon School, Nagavara',
                ].map(s => (
                  <Text key={s} size="small">{s}</Text>
                ))}
              </Stack>
            </CardBody>
          </Card>

          <Card>
            <CardHeader>Daily Needs & Lifestyle</CardHeader>
            <CardBody>
              <Stack gap={5}>
                {[
                  ['Esteem Mall, Hebbal', '5 km'],
                  ['Lulu Mall (upcoming), Hebbal', '5 km'],
                  ['DMart, Thanisandra', '2 km'],
                  ['Spar, Nagavara', '4 km'],
                  ['Hebbal Lake / Jakkur Lake', '5–10 km'],
                ].map(([place, dist]) => (
                  <Row key={place} gap={8} justify="space-between">
                    <Text size="small">{place}</Text>
                    <Text size="small" tone="secondary">{dist}</Text>
                  </Row>
                ))}
              </Stack>
            </CardBody>
          </Card>
        </Grid>
      </Stack>

      <Divider />

      {/* ── recommendation ── */}
      <Stack gap={12}>
        <H2>Final Recommendation</H2>

        <Table
          headers={['Priority', 'Area', 'Why', 'Caveat']}
          rows={[
            ['1st choice', 'Thanisandra / Kogilu / Nagavara', 'Best balance of commute (25–35 min), Metro upside, spacious 3 BHK in ₹3 Cr, rising infrastructure', 'Screen carefully for A-Khata; avoid low-lying pockets'],
            ['2nd choice', 'Yelahanka New Town / Sahakar Nagar', 'Larger units, excellent livability, established area — best for quality of life', 'Commute 40–55 min; no near-term Metro'],
            ['3rd choice', 'Kalyan Nagar / HBR Layout', 'Established, close to Manyata, all daily needs met', 'Limited new-build inventory; older buildings at ₹3 Cr'],
            ['Consider if WFH', 'Devanahalli', 'Highest appreciation; largest units; Airport corridor', 'Only if ≤ 2 office days/week'],
            ['Avoid', 'Hebbal itself', 'Too expensive for size — ₹3 Cr = 2–3 BHK at 1,100–1,300 sqft', 'Poor value vs 8 km further away'],
          ]}
          rowTone={['success', 'success', undefined, 'info', 'warning']}
          striped
        />

        <Card>
          <CardHeader trailing={<Pill tone="success" size="sm">Next Step</Pill>}>
            What to Do Now
          </CardHeader>
          <CardBody>
            <Stack gap={8}>
              <Text>Lock in <Text weight="semibold" as="span">Thanisandra / Nagavara as primary target</Text> and Yelahanka as backup. Now move to the next filter: <Text weight="semibold" as="span">Under-construction vs Ready-to-Move decision</Text> — this will determine which specific projects you shortlist.</Text>
              <Text size="small" tone="secondary">
                Weekend task: Drive from your home/Manyata to Thanisandra and Yelahanka on a weekday morning. The actual commute feel matters more than any table.
              </Text>
            </Stack>
          </CardBody>
        </Card>
      </Stack>

    </Stack>
  );
}
