import {
  BarChart,
  Card, CardBody, CardHeader,
  Divider, Grid, H1, H2, H3,
  Pill, Row, Stack, Stat, Table, Text,
  useCanvasState,
} from 'cursor/canvas';

// ── data ───────────────────────────────────────────────────────────────────

type AreaKey = 'yelahanka' | 'jakkur' | 'thanisandra' | 'hbr' | 'hebbal' | 'kothanur';

interface LiveScore {
  greenery: number;
  airQuality: number;
  trafficCongestion: number; // higher = less congested = better
  schools: number;
  hospitals: number;
  shoppingDining: number;
  walkability: number;
  safety: number;
  roadQuality: number;
  communityFeel: number;
}

interface Area {
  label: string;
  shortLabel: string;
  commuteManyata: string;
  pricePerSqft: string;
  pricePerSqftMid: number; // midpoint for calculations
  whatYouGet: string;
  sqftAt3Cr: string;
  livability: LiveScore;
  livabilityTotal: number; // out of 100
  valueVerdict: 'overpriced' | 'fair' | 'undervalued';
  valueSummary: string;
  appreciation5yr: number;
  metroStatus: string;
  bestPockets: string[];
  avoidPockets: string[];
  tone: 'success' | 'warning' | 'info';
}

const areas: Record<AreaKey, Area> = {
  yelahanka: {
    label: 'Yelahanka New Town / Sahakar Nagar',
    shortLabel: 'Yelahanka',
    commuteManyata: '35–50 min peak · 20–28 min off-peak',
    pricePerSqft: '₹5,800–8,500',
    pricePerSqftMid: 7000,
    whatYouGet: '3–4 BHK, 2,050–2,500 sqft, large balconies, top societies',
    sqftAt3Cr: '~2,050–2,500 sqft (3.5–4 BHK possible)',
    livability: {
      greenery: 9,
      airQuality: 9,
      trafficCongestion: 8,
      schools: 9,
      hospitals: 7,
      shoppingDining: 8,
      walkability: 7,
      safety: 9,
      roadQuality: 9,
      communityFeel: 8,
    },
    livabilityTotal: 83,
    valueVerdict: 'undervalued',
    valueSummary: 'Exceptional livability for the price. Planned sector with wide roads, top schools, lower density. The best value-for-quality deal in North BLR right now.',
    appreciation5yr: 48,
    metroStatus: 'Phase 3 planned (long-term). NH44 airport road is the real asset.',
    bestPockets: ['Yelahanka New Town 1st–4th Phase', 'Sahakar Nagar', 'Kattigenahalli (near airport road)', 'Dollar Layout, Amruth Nagar'],
    avoidPockets: ['Old Yelahanka Town (cramped, older)', 'Attur Layout (flooding risk)'],
    tone: 'success',
  },
  jakkur: {
    label: 'Jakkur / Rachenahalli / Kodigehalli',
    shortLabel: 'Jakkur',
    commuteManyata: '28–40 min peak · 18–25 min off-peak',
    pricePerSqft: '₹5,500–7,500',
    pricePerSqftMid: 6400,
    whatYouGet: '3–4 BHK, 2,150–2,650 sqft in newer societies; some lakefront options',
    sqftAt3Cr: '~2,150–2,650 sqft (3–4 BHK villa/apt)',
    livability: {
      greenery: 8,
      airQuality: 8,
      trafficCongestion: 8,
      schools: 6,
      hospitals: 6,
      shoppingDining: 6,
      walkability: 5,
      safety: 8,
      roadQuality: 6,
      communityFeel: 7,
    },
    livabilityTotal: 68,
    valueVerdict: 'fair',
    valueSummary: 'Great natural environment and large units at good price. However social infrastructure (schools, hospitals, dining) is still maturing. Pricing is fair — not cheap, not expensive.',
    appreciation5yr: 42,
    metroStatus: 'No near-term Metro. Road improvement projects ongoing.',
    bestPockets: ['Jakkur Layout (lakeside)', 'Rachenahalli Main', 'Kodigehalli Gate area'],
    avoidPockets: ['Bagalur Road (too far out)', 'Low-lying areas near lake during monsoon'],
    tone: 'success',
  },
  thanisandra: {
    label: 'Thanisandra / Nagavara / Kogilu',
    shortLabel: 'Thanisandra',
    commuteManyata: '20–35 min peak · 12–18 min off-peak',
    pricePerSqft: '₹6,500–9,500',
    pricePerSqftMid: 7800,
    whatYouGet: '3 BHK, 1,680–2,050 sqft, modern RERA societies',
    sqftAt3Cr: '~1,700–2,050 sqft (3 BHK)',
    livability: {
      greenery: 6,
      airQuality: 6,
      trafficCongestion: 5,
      schools: 8,
      hospitals: 9,
      shoppingDining: 7,
      walkability: 7,
      safety: 7,
      roadQuality: 6,
      communityFeel: 7,
    },
    livabilityTotal: 68,
    valueVerdict: 'fair',
    valueSummary: 'Close to work, good schools and hospitals nearby. But high density, traffic congestion on the main road, and air quality suffers. Priced fairly given Metro catalyst — but livability-per-rupee is lower than Yelahanka.',
    appreciation5yr: 55,
    metroStatus: 'Phase 2B Nagavara station — major price catalyst in 2–3 years.',
    bestPockets: ['Nagavara (near lake)', 'Kogilu Cross', 'Thanisandra 2nd Stage', 'Amruth Nagar adjacent'],
    avoidPockets: ['Thanisandra Main Road itself (noise, congestion)', 'B-Khata micro-pockets'],
    tone: 'info',
  },
  hbr: {
    label: 'HBR Layout / Kalyan Nagar / RT Nagar',
    shortLabel: 'HBR Layout',
    commuteManyata: '25–40 min peak · 15–22 min off-peak',
    pricePerSqft: '₹7,500–10,000',
    pricePerSqftMid: 8700,
    whatYouGet: '2–3 BHK (1,320–1,650 sqft) in older society OR builder floor',
    sqftAt3Cr: '~1,320–1,650 sqft (2–3 BHK, older stock)',
    livability: {
      greenery: 5,
      airQuality: 5,
      trafficCongestion: 4,
      schools: 8,
      hospitals: 8,
      shoppingDining: 8,
      walkability: 8,
      safety: 7,
      roadQuality: 6,
      communityFeel: 7,
    },
    livabilityTotal: 66,
    valueVerdict: 'overpriced',
    valueSummary: 'You pay Thanisandra-level prices but get significantly smaller units in older stock. The area is established but congested, and greenery/air quality scores poorly. Not worth the premium vs Yelahanka.',
    appreciation5yr: 32,
    metroStatus: 'Near Purple Line extension planning. Existing BMTC good.',
    bestPockets: ['5th Block HBR (quieter lanes)', 'RT Nagar BBMP residential zones'],
    avoidPockets: ['Main road-facing units (noise)', 'Cramped inner lanes with poor parking'],
    tone: 'warning',
  },
  hebbal: {
    label: 'Hebbal / Outer Ring Road (Near Manyata)',
    shortLabel: 'Hebbal',
    commuteManyata: '10–20 min peak · 8–12 min off-peak',
    pricePerSqft: '₹10,000–15,000',
    pricePerSqftMid: 12000,
    whatYouGet: '2–3 BHK (1,080–1,300 sqft) in premium high-rise',
    sqftAt3Cr: '~1,080–1,300 sqft (2 BHK only)',
    livability: {
      greenery: 5,
      airQuality: 4,
      trafficCongestion: 2,
      schools: 7,
      hospitals: 10,
      shoppingDining: 7,
      walkability: 6,
      safety: 7,
      roadQuality: 7,
      communityFeel: 5,
    },
    livabilityTotal: 60,
    valueVerdict: 'overpriced',
    valueSummary: 'Worst value-for-money in this comparison. ₹3 Cr buys a 2 BHK under 1,300 sqft. Premium is paid for proximity to Manyata — but you said commute isn\'t the priority. Terrible traffic, poor air quality, high density. Avoid.',
    appreciation5yr: 35,
    metroStatus: 'Phase 2B Hebbal station — premium already baked into price.',
    bestPockets: ['Lakeside apartments (Hebbal Lake facing)', 'Embassy Galaxy / premium gated compounds'],
    avoidPockets: ['Main Bellary Road facing — extreme noise', 'Hebbal flyover vicinity'],
    tone: 'warning',
  },
  kothanur: {
    label: 'Kothanur / Hennur / Bagalur Cross',
    shortLabel: 'Kothanur',
    commuteManyata: '25–40 min peak · 18–25 min off-peak',
    pricePerSqft: '₹5,200–7,000',
    pricePerSqftMid: 6000,
    whatYouGet: '3–4 BHK, 2,280–2,760 sqft, newer projects with large amenity areas',
    sqftAt3Cr: '~2,280–2,760 sqft (3.5–4 BHK)',
    livability: {
      greenery: 7,
      airQuality: 7,
      trafficCongestion: 7,
      schools: 6,
      hospitals: 6,
      shoppingDining: 5,
      walkability: 5,
      safety: 7,
      roadQuality: 6,
      communityFeel: 7,
    },
    livabilityTotal: 63,
    valueVerdict: 'undervalued',
    valueSummary: 'Cheapest per sqft in this list while offering decent livability. Social infrastructure is 2–3 years behind Yelahanka, but large gated societies with good internal amenities compensate. Good appreciation runway.',
    appreciation5yr: 38,
    metroStatus: 'No near-term Metro. Dependent on road access improvements.',
    bestPockets: ['Kothanur Main (established part)', 'Hennur Cross', 'Near Bagalur Road (gated townships)'],
    avoidPockets: ['Deep into Bagalur (too far)', 'Flood-risk pockets near nullahs'],
    tone: 'info',
  },
};

const LIVABILITY_FACTORS: [keyof LiveScore, string][] = [
  ['greenery', 'Greenery / Parks'],
  ['airQuality', 'Air Quality'],
  ['trafficCongestion', 'Low Congestion'],
  ['schools', 'Schools'],
  ['hospitals', 'Hospitals'],
  ['shoppingDining', 'Shopping / Dining'],
  ['walkability', 'Walkability'],
  ['safety', 'Safety'],
  ['roadQuality', 'Road Quality'],
  ['communityFeel', 'Community Feel'],
];

export default function AreaLivabilityAnalysis() {
  const [activeArea, setActiveArea] = useCanvasState<AreaKey>('liveArea', 'yelahanka');
  const a = areas[activeArea];
  const areaKeys = Object.keys(areas) as AreaKey[];

  // Value score = livability per ₹1000/sqft
  const valueScore = (key: AreaKey) =>
    (areas[key].livabilityTotal / (areas[key].pricePerSqftMid / 1000)).toFixed(1);

  return (
    <Stack gap={28} style={{ padding: '24px 28px', maxWidth: 960 }}>

      {/* ── header ── */}
      <Stack gap={4}>
        <H1>Livability vs Price — Is the Area Worth What It Costs?</H1>
        <Text tone="secondary">North Bangalore · ₹3 Cr budget · Livability-first, commute secondary (≤30–40 min)</Text>
      </Stack>

      <Grid columns={4} gap={14}>
        <Stat value="Yelahanka" label="Best Livability Per Rupee" tone="success" />
        <Stat value="Hebbal" label="Most Overpriced" tone="danger" />
        <Stat value="83/100" label="Top Livability Score" tone="success" />
        <Stat value="2,500 sqft" label="Max Size @ ₹3 Cr" tone="info" />
      </Grid>

      <Divider />

      {/* ── value matrix ── */}
      <Stack gap={12}>
        <H2>Value-for-Money Matrix — Price vs What You Actually Get</H2>
        <Text tone="secondary" size="small">
          Value Score = Livability (out of 100) ÷ Price per sqft (in ₹000s). Higher = more livability per rupee spent.
        </Text>

        <Table
          headers={['Area', 'Price/sqft', 'Livability Score', 'Value Score', 'Size @ ₹3 Cr', 'Verdict']}
          rows={areaKeys.map(k => [
            areas[k].shortLabel,
            areas[k].pricePerSqft,
            `${areas[k].livabilityTotal}/100`,
            valueScore(k),
            areas[k].sqftAt3Cr.split('(')[0].trim(),
            areas[k].valueVerdict === 'undervalued' ? 'Undervalued' :
            areas[k].valueVerdict === 'overpriced' ? 'Overpriced' : 'Fair',
          ])}
          rowTone={areaKeys.map(k =>
            areas[k].valueVerdict === 'undervalued' ? 'success' :
            areas[k].valueVerdict === 'overpriced' ? 'danger' :
            undefined
          )}
          striped
        />
      </Stack>

      <Divider />

      {/* ── charts ── */}
      <Grid columns={2} gap={16}>
        <Stack gap={8}>
          <H3>Livability Score (out of 100)</H3>
          <BarChart
            categories={areaKeys.map(k => areas[k].shortLabel)}
            series={[{ name: 'Livability Score', data: areaKeys.map(k => areas[k].livabilityTotal) }]}
            height={220}
          />
        </Stack>
        <Stack gap={8}>
          <H3>Value Score (Livability ÷ Price)</H3>
          <BarChart
            categories={areaKeys.map(k => areas[k].shortLabel)}
            series={[{ name: 'Value Score', data: areaKeys.map(k => parseFloat(valueScore(k))) }]}
            height={220}
          />
        </Stack>
      </Grid>

      <Divider />

      {/* ── deep dive ── */}
      <Stack gap={14}>
        <Row gap={8} align="center" wrap>
          <H2>Area Deep Dive</H2>
          <Row gap={6} wrap>
            {areaKeys.map(k => (
              <Pill
                key={k}
                active={activeArea === k}
                tone={areas[k].valueVerdict === 'undervalued' ? 'success' : areas[k].valueVerdict === 'overpriced' ? 'warning' : 'neutral'}
                onClick={() => setActiveArea(k)}
              >
                {areas[k].shortLabel}
              </Pill>
            ))}
          </Row>
        </Row>

        <Grid columns={4} gap={14}>
          <Stat
            value={`${a.livabilityTotal}/100`}
            label="Livability Score"
            tone={a.livabilityTotal >= 80 ? 'success' : a.livabilityTotal >= 70 ? undefined : 'warning'}
          />
          <Stat
            value={valueScore(activeArea)}
            label="Value Score"
            tone={parseFloat(valueScore(activeArea)) >= 11 ? 'success' : parseFloat(valueScore(activeArea)) >= 8 ? undefined : 'danger'}
          />
          <Stat value={a.sqftAt3Cr.split('(')[0].trim()} label="Size at ₹3 Cr" />
          <Stat
            value={a.valueVerdict === 'undervalued' ? 'Undervalued' : a.valueVerdict === 'overpriced' ? 'Overpriced' : 'Fair Value'}
            label="Price Assessment"
            tone={a.valueVerdict === 'undervalued' ? 'success' : a.valueVerdict === 'overpriced' ? 'danger' : undefined}
          />
        </Grid>

        <Card>
          <CardHeader trailing={<Pill tone={a.valueVerdict === 'undervalued' ? 'success' : a.valueVerdict === 'overpriced' ? 'warning' : 'neutral'} size="sm">{a.valueVerdict}</Pill>}>
            {a.label}
          </CardHeader>
          <CardBody>
            <Stack gap={12}>
              <Text size="small">{a.valueSummary}</Text>

              <Grid columns={2} gap={14}>
                <Stack gap={8}>
                  <H3>Livability Breakdown</H3>
                  <Table
                    headers={['Factor', 'Score /10']}
                    rows={LIVABILITY_FACTORS.map(([key, label]) => [
                      label,
                      `${a.livability[key]}/10`,
                    ])}
                    rowTone={LIVABILITY_FACTORS.map(([key]) =>
                      a.livability[key] >= 8 ? 'success' :
                      a.livability[key] <= 4 ? 'danger' :
                      a.livability[key] <= 6 ? 'warning' :
                      undefined
                    )}
                    striped
                  />
                </Stack>

                <Stack gap={14}>
                  <Stack gap={6}>
                    <H3>Practical Details</H3>
                    <Table
                      headers={['Item', 'Detail']}
                      rows={[
                        ['Price per sqft', a.pricePerSqft],
                        ['What ₹3 Cr gets', a.whatYouGet],
                        ['Size range', a.sqftAt3Cr],
                        ['Commute to Manyata', a.commuteManyata],
                        ['Metro status', a.metroStatus],
                        ['5yr appreciation', `~${a.appreciation5yr}%`],
                      ]}
                      striped
                    />
                  </Stack>

                  <Grid columns={2} gap={10}>
                    <Card>
                      <CardHeader trailing={<Pill tone="success" size="sm">Buy here</Pill>}>
                        Best Pockets
                      </CardHeader>
                      <CardBody>
                        <Stack gap={4}>
                          {a.bestPockets.map(p => (
                            <Text key={p} size="small">{p}</Text>
                          ))}
                        </Stack>
                      </CardBody>
                    </Card>
                    <Card>
                      <CardHeader trailing={<Pill tone="warning" size="sm">Avoid</Pill>}>
                        Skip These
                      </CardHeader>
                      <CardBody>
                        <Stack gap={4}>
                          {a.avoidPockets.map(p => (
                            <Text key={p} size="small" tone="secondary">{p}</Text>
                          ))}
                        </Stack>
                      </CardBody>
                    </Card>
                  </Grid>
                </Stack>
              </Grid>
            </Stack>
          </CardBody>
        </Card>

        {/* livability bar for active area */}
        <Stack gap={8}>
          <H3>Livability Factor Breakdown — {a.shortLabel}</H3>
          <BarChart
            categories={LIVABILITY_FACTORS.map(([, label]) => label)}
            series={[{ name: a.shortLabel, data: LIVABILITY_FACTORS.map(([key]) => a.livability[key]) }]}
            horizontal
            height={300}
          />
        </Stack>
      </Stack>

      <Divider />

      {/* ── side by side livability comparison ── */}
      <Stack gap={12}>
        <H2>Head-to-Head: All Areas on Key Livability Factors</H2>
        <BarChart
          categories={['Greenery', 'Air Quality', 'Low Congestion', 'Schools', 'Hospitals', 'Shopping', 'Safety', 'Roads']}
          series={[
            { name: 'Yelahanka', data: [9, 9, 8, 9, 7, 8, 9, 9] },
            { name: 'Jakkur', data: [8, 8, 8, 6, 6, 6, 8, 6] },
            { name: 'Thanisandra', data: [6, 6, 5, 8, 9, 7, 7, 6] },
            { name: 'HBR Layout', data: [5, 5, 4, 8, 8, 8, 7, 6] },
          ]}
          stacked={false}
          height={300}
        />
        <Text size="small" tone="secondary">
          Yelahanka leads on greenery, air quality, low congestion, safety, and roads. Thanisandra leads on hospitals and schools proximity. HBR Layout wins on shopping/walkability but fails on environment.
        </Text>
      </Stack>

      <Divider />

      {/* ── what overpriced actually means ── */}
      <Stack gap={12}>
        <H2>Why Some Areas Are Overpriced — The Honest Numbers</H2>
        <Grid columns={3} gap={14}>
          <Card>
            <CardHeader trailing={<Pill tone="warning" size="sm">Overpriced</Pill>}>
              Hebbal — Paying for Proximity You Don't Need
            </CardHeader>
            <CardBody>
              <Stack gap={6}>
                <Text size="small">At ₹12,000/sqft, ₹3 Cr = <Text weight="semibold" as="span">~1,150 sqft — a cramped 2 BHK.</Text></Text>
                <Text size="small">You're paying ₹5,000/sqft extra vs Yelahanka for:</Text>
                {['10 min shorter commute (you said this doesn\'t matter)', 'Constant traffic / flyover noise', 'Poor air quality from Bellary Road trucks', 'No greenery'].map(r => (
                  <Row key={r} gap={6} align="start"><Text tone="secondary" size="small" style={{ minWidth: 12 }}>−</Text><Text size="small" tone="secondary">{r}</Text></Row>
                ))}
                <Text size="small" weight="semibold" style={{ marginTop: 4 }}>Skip it entirely for self-use.</Text>
              </Stack>
            </CardBody>
          </Card>

          <Card>
            <CardHeader trailing={<Pill tone="neutral" size="sm">Fair Value</Pill>}>
              Thanisandra — Good Area, Right Price
            </CardHeader>
            <CardBody>
              <Stack gap={6}>
                <Text size="small">At ₹7,800/sqft, ₹3 Cr = <Text weight="semibold" as="span">~1,800 sqft — a comfortable 3 BHK.</Text></Text>
                <Text size="small">Price is justified by:</Text>
                {['Metro Phase 2B upcoming (future price catalyst)', 'Good hospitals and schools nearby', 'Active social scene — restaurants, cafes growing', 'Reasonable commute'].map(r => (
                  <Row key={r} gap={6} align="start"><Text tone="secondary" size="small" style={{ minWidth: 12 }}>+</Text><Text size="small" tone="secondary">{r}</Text></Row>
                ))}
                <Text size="small" tone="secondary" style={{ marginTop: 4 }}>But livability (air, green, congestion) is noticeably below Yelahanka.</Text>
              </Stack>
            </CardBody>
          </Card>

          <Card>
            <CardHeader trailing={<Pill tone="success" size="sm">Undervalued</Pill>}>
              Yelahanka — The Sweet Spot
            </CardHeader>
            <CardBody>
              <Stack gap={6}>
                <Text size="small">At ₹7,000/sqft, ₹3 Cr = <Text weight="semibold" as="span">~2,150–2,500 sqft — a very spacious 3–4 BHK.</Text></Text>
                <Text size="small">You get MORE for LESS because:</Text>
                {['Planned layout = wider roads, less density', 'NH44 keeps it connected but insulated from chaos', 'Top schools (DPS, Orchids) literally walking distance in some pockets', 'Clean air — no industrial belt proximity'].map(r => (
                  <Row key={r} gap={6} align="start"><Text tone="secondary" size="small" style={{ minWidth: 12 }}>+</Text><Text size="small" tone="secondary">{r}</Text></Row>
                ))}
                <Text size="small" weight="semibold" style={{ marginTop: 4 }}>Best long-term self-use choice for quality of life.</Text>
              </Stack>
            </CardBody>
          </Card>
        </Grid>
      </Stack>

      <Divider />

      {/* ── final recommendation ── */}
      <Stack gap={12}>
        <H2>Final Verdict — Livability-First Ranking</H2>

        <Table
          headers={['Rank', 'Area', 'Why', 'One Concern']}
          rows={[
            ['1', 'Yelahanka New Town / Sahakar Nagar', 'Highest livability score (83/100), best value-per-rupee, largest units. Planned sector = better living standards.', 'Commute ~40–50 min peak (acceptable per your criteria)'],
            ['2', 'Jakkur / Kodigehalli', 'Lake proximity, clean air, large units, quieter. Good if you want a slightly more secluded feel.', 'Social infra (dining, schools) still maturing'],
            ['3', 'Thanisandra / Nagavara (select pockets)', 'Best Metro upside, good schools + hospitals. Choose inner pockets away from main road for livability.', 'Congested main road; air quality below Yelahanka'],
            ['4', 'Kothanur / Hennur Cross', 'Cheapest per sqft, largest units, decent livability. 2–3 yrs behind on social infra.', 'Needs patience; social infra not yet top-tier'],
            ['Avoid', 'Hebbal / HBR at current prices', 'Overpriced for self-use — paying proximity premium you don\'t need; poor environmental scores.', '—'],
          ]}
          rowTone={['success', 'success', undefined, undefined, 'danger']}
          striped
        />

        <Card>
          <CardHeader trailing={<Pill tone="success" size="sm">Recommendation</Pill>}>
            What to Do Next
          </CardHeader>
          <CardBody>
            <Stack gap={8}>
              <Text>Your profile — livability-first, ₹3 Cr, self-use, Manyata commute acceptable up to 40 min — points clearly to <Text weight="semibold" as="span">Yelahanka New Town (Sahakar Nagar / New Town phases)</Text> as the primary target.</Text>
              <Text>At ₹7,000–8,000/sqft, you get a <Text weight="semibold" as="span">1,800–2,000 sqft, 3–3.5 BHK</Text> in a well-planned, green, low-congestion area with excellent schools, and the NH44 corridor gives you easy airport + Manyata access.</Text>
              <Text tone="secondary" size="small">
                Next step: Decide between <Text weight="semibold" as="span">Under-Construction vs Ready-to-Move</Text>. In Yelahanka, there's a healthy mix of both — ready society resales and 2–3 year UC projects from reputed builders.
              </Text>
            </Stack>
          </CardBody>
        </Card>
      </Stack>

    </Stack>
  );
}
