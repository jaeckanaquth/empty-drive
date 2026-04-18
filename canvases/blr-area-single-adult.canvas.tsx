import {
  BarChart,
  Card, CardBody, CardHeader,
  Divider, Grid, H1, H2, H3,
  Pill, Row, Stack, Stat, Table, Text,
  useCanvasState,
} from 'cursor/canvas';

type AreaKey = 'yelahanka' | 'jakkur' | 'thanisandra' | 'hbr' | 'hebbal' | 'kothanur';

interface SingleAdultScore {
  greeneryFitness: number;    // parks, running, cycling
  airQuality: number;
  lowCongestion: number;
  socialScene: number;        // cafes, restaurants, bars, co-working
  youngProfCommunity: number; // density of peers, vibe
  hospitals: number;          // emergency + routine care
  fitnessInfra: number;       // gyms, cult.fit, pools, sports
  deliveryConvenience: number;// Swiggy/Zomato/Blinkit/groceries
  safety: number;
  roadConnectivity: number;
}

interface Area {
  label: string;
  shortLabel: string;
  commute: string;
  pricePerSqft: string;
  pricePerSqftMid: number;
  whatYouGet: string;
  sqftAt25Cr: string;
  scores: SingleAdultScore;
  total: number;
  valueVerdict: 'overpriced' | 'fair' | 'undervalued';
  summary: string;
  bestFor: string;
  vibe: string;
  appreciation5yr: number;
}

const areas: Record<AreaKey, Area> = {
  yelahanka: {
    label: 'Yelahanka New Town / Sahakar Nagar',
    shortLabel: 'Yelahanka',
    commute: '35–50 min peak · 20 min off-peak',
    pricePerSqft: '₹5,800–8,500',
    pricePerSqftMid: 7000,
    whatYouGet: '3–3.5 BHK · 1,700–2,100 sqft · spacious balconies',
    sqftAt25Cr: '~1,900–2,100 sqft',
    vibe: 'Quiet suburb — planned, clean, green. Think Sunday morning runs, home as your sanctuary.',
    scores: {
      greeneryFitness: 9,
      airQuality: 9,
      lowCongestion: 8,
      socialScene: 5,
      youngProfCommunity: 4,
      hospitals: 7,
      fitnessInfra: 7,
      deliveryConvenience: 7,
      safety: 9,
      roadConnectivity: 9,
    },
    total: 74,
    valueVerdict: 'undervalued',
    summary: 'Best value per sqft. You get a large, quiet home in a clean planned area. The trade-off: social scene and young professional density are low — this is family territory. Works if you\'re content with a great home base and go out for your social life.',
    bestFor: 'Introverted / home-focused single adult. Large WFH setup, personal gym room possible.',
    appreciation5yr: 48,
  },
  jakkur: {
    label: 'Jakkur / Rachenahalli / Kodigehalli',
    shortLabel: 'Jakkur',
    commute: '28–40 min peak · 18 min off-peak',
    pricePerSqft: '₹5,500–7,500',
    pricePerSqftMid: 6400,
    whatYouGet: '3–4 BHK · 1,800–2,200 sqft · lake-adjacent options',
    sqftAt25Cr: '~2,000–2,200 sqft',
    vibe: 'Nature-first. Near Jakkur Lake. Quiet, outdoor-lifestyle-friendly. Still developing socially.',
    scores: {
      greeneryFitness: 8,
      airQuality: 8,
      lowCongestion: 8,
      socialScene: 4,
      youngProfCommunity: 4,
      hospitals: 6,
      fitnessInfra: 6,
      deliveryConvenience: 6,
      safety: 8,
      roadConnectivity: 6,
    },
    total: 64,
    valueVerdict: 'undervalued',
    summary: 'Best for someone who loves the outdoors — running around the lake, cycling, quiet evenings. Social infrastructure is thin. Delivery coverage is okay but not great. Largest units per rupee in this list.',
    bestFor: 'Outdoor-lifestyle single adult. Trail runner, cyclist, or nature-person.',
    appreciation5yr: 42,
  },
  thanisandra: {
    label: 'Thanisandra / Nagavara / Kogilu',
    shortLabel: 'Thanisandra',
    commute: '20–35 min peak · 12 min off-peak',
    pricePerSqft: '₹6,500–9,500',
    pricePerSqftMid: 7800,
    whatYouGet: '3 BHK · 1,400–1,650 sqft · modern RERA society',
    sqftAt25Cr: '~1,400–1,700 sqft',
    vibe: 'Active urban. Young Manyata crowd, café culture growing fast. More "alive" on weeknights.',
    scores: {
      greeneryFitness: 6,
      airQuality: 6,
      lowCongestion: 5,
      socialScene: 8,
      youngProfCommunity: 8,
      hospitals: 9,
      fitnessInfra: 8,
      deliveryConvenience: 9,
      safety: 7,
      roadConnectivity: 7,
    },
    total: 73,
    valueVerdict: 'fair',
    summary: 'Best for a socially active single adult who wants neighbours and surroundings that match their lifestyle. Strong young professional density from Manyata. Metro catalyst adds future upside. Trade-off: smaller flat for the price, traffic, air quality.',
    bestFor: 'Social, outgoing single adult. Goes to restaurants, gym, co-working. Manyata professional crowd.',
    appreciation5yr: 55,
  },
  hbr: {
    label: 'HBR Layout / Kalyan Nagar / RT Nagar',
    shortLabel: 'HBR Layout',
    commute: '25–40 min peak · 15 min off-peak',
    pricePerSqft: '₹7,500–10,000',
    pricePerSqftMid: 8700,
    whatYouGet: '2 BHK · 1,100–1,350 sqft · older stock or builder floor',
    sqftAt25Cr: '~1,100–1,400 sqft',
    vibe: 'Walkable, old-school Bangalore. Great for daily errands on foot. Small flat though.',
    scores: {
      greeneryFitness: 5,
      airQuality: 5,
      lowCongestion: 4,
      socialScene: 7,
      youngProfCommunity: 6,
      hospitals: 8,
      fitnessInfra: 7,
      deliveryConvenience: 9,
      safety: 7,
      roadConnectivity: 7,
    },
    total: 65,
    valueVerdict: 'overpriced',
    summary: 'Good daily walkability and convenience, but you pay top-of-range prices for the smallest flat. The "established area" premium is priced in but greenery, air quality, and congestion all score poorly. Worse value than Thanisandra at higher price.',
    bestFor: 'Someone who wants to walk for groceries, coffee, gym — values walkability above space.',
    appreciation5yr: 32,
  },
  hebbal: {
    label: 'Hebbal / Bellary Road (Manyata adjacent)',
    shortLabel: 'Hebbal',
    commute: '10–20 min peak · 8 min off-peak',
    pricePerSqft: '₹10,000–15,000',
    pricePerSqftMid: 12000,
    whatYouGet: '2 BHK · 900–1,050 sqft · premium high-rise',
    sqftAt25Cr: '~900–1,100 sqft',
    vibe: 'High-rise urban. Premium address. But 900 sqft is genuinely small for daily living.',
    scores: {
      greeneryFitness: 4,
      airQuality: 4,
      lowCongestion: 2,
      socialScene: 6,
      youngProfCommunity: 7,
      hospitals: 10,
      fitnessInfra: 7,
      deliveryConvenience: 9,
      safety: 7,
      roadConnectivity: 8,
    },
    total: 64,
    valueVerdict: 'overpriced',
    summary: 'Worst size-for-money. You are paying ₹12,000/sqft to live in under 1,000 sqft — essentially a serviced apartment size. Since commute isn\'t your concern, there is no rational case to buy here at this budget.',
    bestFor: 'Only if you specifically want a luxury high-rise and don\'t mind the small size.',
    appreciation5yr: 35,
  },
  kothanur: {
    label: 'Kothanur / Hennur / Bagalur Cross',
    shortLabel: 'Kothanur',
    commute: '25–40 min peak · 18 min off-peak',
    pricePerSqft: '₹5,200–7,000',
    pricePerSqftMid: 6000,
    whatYouGet: '3.5–4 BHK · 1,900–2,300 sqft · gated township',
    sqftAt25Cr: '~2,000–2,300 sqft',
    vibe: 'Quiet township living. Big internal amenities. Social scene outside the gate is sparse.',
    scores: {
      greeneryFitness: 7,
      airQuality: 7,
      lowCongestion: 7,
      socialScene: 4,
      youngProfCommunity: 4,
      hospitals: 6,
      fitnessInfra: 5,
      deliveryConvenience: 5,
      safety: 7,
      roadConnectivity: 6,
    },
    total: 58,
    valueVerdict: 'undervalued',
    summary: 'Cheapest price per sqft, largest units. But social scene outside the gate is very thin. Good if internal society amenities (gym, pool, clubhouse) are enough for you. Still 2–3 years from maturity on external infra.',
    bestFor: 'Someone comfortable with gated community living. Social needs met inside the compound.',
    appreciation5yr: 38,
  },
};

const FACTORS: [keyof SingleAdultScore, string][] = [
  ['greeneryFitness', 'Greenery & Outdoor Fitness'],
  ['airQuality', 'Air Quality'],
  ['lowCongestion', 'Low Traffic Congestion'],
  ['socialScene', 'Social Scene (Cafes / Dining)'],
  ['youngProfCommunity', 'Young Professional Community'],
  ['hospitals', 'Hospitals & Healthcare'],
  ['fitnessInfra', 'Gym / Fitness Infrastructure'],
  ['deliveryConvenience', 'Delivery & Daily Convenience'],
  ['safety', 'Safety'],
  ['roadConnectivity', 'Road Quality & Connectivity'],
];

export default function SingleAdultAreaAnalysis() {
  const [active, setActive] = useCanvasState<AreaKey>('saArea', 'thanisandra');
  const a = areas[active];
  const keys = Object.keys(areas) as AreaKey[];

  const valueScore = (k: AreaKey) =>
    (areas[k].total / (areas[k].pricePerSqftMid / 1000)).toFixed(1);

  return (
    <Stack gap={28} style={{ padding: '24px 28px', maxWidth: 960 }}>

      <Stack gap={4}>
        <H1>Area Analysis — Single Adult Lens</H1>
        <Text tone="secondary">Schools removed · Re-scored for: social scene, fitness, young professional community, delivery, personal space</Text>
      </Stack>

      <Card>
        <CardHeader trailing={<Pill tone="info" size="sm">Profile update</Pill>}>
          What Changes for a Single Adult
        </CardHeader>
        <CardBody>
          <Grid columns={2} gap={16}>
            <Stack gap={6}>
              <Text size="small" weight="semibold">Removed from scoring</Text>
              {['Schools & children\'s play areas', 'Family-oriented community feel', 'Proximity to tutoring / activity centres'].map(x => (
                <Row key={x} gap={6}><Text size="small" tone="secondary" style={{ minWidth: 12 }}>−</Text><Text size="small" tone="secondary">{x}</Text></Row>
              ))}
            </Stack>
            <Stack gap={6}>
              <Text size="small" weight="semibold">Added / upweighted</Text>
              {['Social scene — cafes, restaurants, bars', 'Young professional community density', 'Gym & fitness infrastructure quality', 'Delivery convenience (Swiggy/Zomato/Blinkit)'].map(x => (
                <Row key={x} gap={6}><Text size="small" tone="secondary" style={{ minWidth: 12 }}>+</Text><Text size="small" tone="secondary">{x}</Text></Row>
              ))}
            </Stack>
          </Grid>
        </CardBody>
      </Card>

      <Divider />

      {/* ── value matrix ── */}
      <Stack gap={12}>
        <H2>Updated Value-for-Money Matrix</H2>
        <Table
          headers={['Area', 'Price/sqft', 'Livability /100', 'Value Score', 'Size @ ₹2.5 Cr', 'Verdict', 'Vibe']}
          rows={keys.map(k => [
            areas[k].shortLabel,
            areas[k].pricePerSqft,
            `${areas[k].total}/100`,
            valueScore(k),
            areas[k].sqftAt25Cr,
            areas[k].valueVerdict === 'undervalued' ? 'Undervalued' : areas[k].valueVerdict === 'overpriced' ? 'Overpriced' : 'Fair',
            areas[k].vibe.split('.')[0],
          ])}
          rowTone={keys.map(k =>
            areas[k].valueVerdict === 'undervalued' ? 'success' :
            areas[k].valueVerdict === 'overpriced' ? 'danger' : undefined
          )}
          striped
        />
      </Stack>

      <Divider />

      {/* ── the core trade-off ── */}
      <Stack gap={12}>
        <H2>The Core Trade-off for a Single Adult in North BLR</H2>
        <Grid columns={2} gap={14}>
          <Card>
            <CardHeader trailing={<Pill tone="info" size="sm">Social + Active</Pill>}>
              Thanisandra — Live Where Your Peers Are
            </CardHeader>
            <CardBody>
              <Stack gap={8}>
                <Grid columns={2} gap={10}>
                  <Stat value="73/100" label="Livability Score" />
                  <Stat value="~1,500 sqft" label="Size at ₹2.5 Cr" tone="warning" />
                </Grid>
                <Table
                  headers={['Factor', 'Score']}
                  rows={[
                    ['Social Scene', '8/10'],
                    ['Young Professional Community', '8/10'],
                    ['Fitness Infrastructure', '8/10'],
                    ['Delivery Convenience', '9/10'],
                    ['Air Quality', '6/10'],
                    ['Space per rupee', 'Lower'],
                  ]}
                  rowTone={[undefined, undefined, undefined, undefined, 'warning', 'warning']}
                  striped
                />
                <Text size="small" tone="secondary">Best if you want a vibrant neighbourhood. Manyata crowd = lots of single young professionals. Cult.fit, cafes, restaurants all accessible.</Text>
              </Stack>
            </CardBody>
          </Card>

          <Card>
            <CardHeader trailing={<Pill tone="success" size="sm">Quiet + Spacious</Pill>}>
              Yelahanka — Live Well, Go Out for Social Life
            </CardHeader>
            <CardBody>
              <Stack gap={8}>
                <Grid columns={2} gap={10}>
                  <Stat value="74/100" label="Livability Score" tone="success" />
                  <Stat value="~2,000 sqft" label="Size at ₹2.5 Cr" tone="success" />
                </Grid>
                <Table
                  headers={['Factor', 'Score']}
                  rows={[
                    ['Social Scene', '5/10'],
                    ['Young Professional Community', '4/10'],
                    ['Air Quality', '9/10'],
                    ['Greenery & Outdoor Fitness', '9/10'],
                    ['Space per rupee', 'Best in class'],
                    ['Home as sanctuary', '10/10'],
                  ]}
                  rowTone={['warning', 'warning', undefined, undefined, 'success', 'success']}
                  striped
                />
                <Text size="small" tone="secondary">Best if your social life happens outside your neighbourhood (Indiranagar, CBD etc. on weekends). At home = quiet, green, spacious, healthy.</Text>
              </Stack>
            </CardBody>
          </Card>
        </Grid>

        <Card>
          <CardHeader trailing={<Pill tone="warning" size="sm">Key question</Pill>}>
            What Kind of Single Adult Are You?
          </CardHeader>
          <CardBody>
            <Table
              headers={['If you...', 'Go with', 'Reason']}
              rows={[
                ['Work from home 3–4 days/week, value quiet & space', 'Yelahanka', 'Spacious 3.5 BHK, clean air, dedicated WFH room, calm environment'],
                ['Go out most evenings, want neighbourhood cafes & people', 'Thanisandra', 'Young crowd, social infrastructure, walkable F&B, gym nearby'],
                ['Love running / cycling / outdoor activities', 'Jakkur', 'Lake proximity, open roads, less traffic, nature walks'],
                ['Want largest possible flat for hosting friends / hobbies', 'Jakkur or Kothanur', 'Best sqft per rupee — 2,000–2,300 sqft easily possible'],
                ['Value fast grocery/food delivery above all', 'Thanisandra or Hebbal', 'Best Blinkit/Swiggy/Zomato density and speed'],
              ]}
              rowTone={[undefined, undefined, undefined, undefined, undefined]}
              striped
            />
          </CardBody>
        </Card>
      </Stack>

      <Divider />

      {/* ── deep dive ── */}
      <Stack gap={14}>
        <Row gap={8} align="center" wrap>
          <H2>Deep Dive</H2>
          <Row gap={6} wrap>
            {keys.map(k => (
              <Pill
                key={k}
                active={active === k}
                tone={areas[k].valueVerdict === 'undervalued' ? 'success' : areas[k].valueVerdict === 'overpriced' ? 'warning' : 'neutral'}
                onClick={() => setActive(k)}
              >
                {areas[k].shortLabel}
              </Pill>
            ))}
          </Row>
        </Row>

        <Grid columns={4} gap={14}>
          <Stat value={`${a.total}/100`} label="Livability (Single Adult)" tone={a.total >= 72 ? 'success' : a.total >= 65 ? undefined : 'warning'} />
          <Stat value={valueScore(active)} label="Value Score" tone={parseFloat(valueScore(active)) >= 10 ? 'success' : parseFloat(valueScore(active)) >= 8 ? undefined : 'danger'} />
          <Stat value={a.sqftAt25Cr} label="Size at ₹2.5 Cr" />
          <Stat value={a.valueVerdict === 'undervalued' ? 'Undervalued' : a.valueVerdict === 'overpriced' ? 'Overpriced' : 'Fair'} label="Price Verdict" tone={a.valueVerdict === 'undervalued' ? 'success' : a.valueVerdict === 'overpriced' ? 'danger' : undefined} />
        </Grid>

        <Grid columns={2} gap={14}>
          <Stack gap={8}>
            <H3>Single-Adult Livability Breakdown</H3>
            <BarChart
              categories={FACTORS.map(([, l]) => l)}
              series={[{ name: a.shortLabel, data: FACTORS.map(([k]) => a.scores[k]) }]}
              horizontal
              height={320}
            />
          </Stack>

          <Stack gap={14}>
            <Card>
              <CardHeader>{a.label}</CardHeader>
              <CardBody>
                <Stack gap={6}>
                  <Text size="small" weight="semibold">Vibe</Text>
                  <Text size="small" tone="secondary">{a.vibe}</Text>
                  <Divider />
                  <Text size="small" weight="semibold">Assessment</Text>
                  <Text size="small" tone="secondary">{a.summary}</Text>
                  <Divider />
                  <Text size="small" weight="semibold">Best for</Text>
                  <Text size="small" tone="secondary">{a.bestFor}</Text>
                </Stack>
              </CardBody>
            </Card>

            <Table
              headers={['Detail', 'Value']}
              rows={[
                ['Price per sqft', a.pricePerSqft],
                ['What ₹2.5 Cr gets', a.whatYouGet],
                ['Commute to Manyata', a.commute],
                ['5yr appreciation', `~${a.appreciation5yr}%`],
              ]}
              striped
            />
          </Stack>
        </Grid>
      </Stack>

      <Divider />

      {/* ── size argument for single adult ── */}
      <Stack gap={12}>
        <H2>The Size Argument — Why Space Matters More for a Single Adult</H2>
        <Text tone="secondary" size="small">
          Counter-intuitive take: a single adult benefits MORE from a large flat than a family does. Here's why.
        </Text>

        <Grid columns={3} gap={14}>
          <Card>
            <CardHeader>Dedicated WFH Room</CardHeader>
            <CardBody>
              <Text size="small">A 3rd bedroom = a permanent home office. No packing up. Proper desk, monitor, ergonomic chair. With WFH culture now standard, this is a quality-of-life multiplier.</Text>
            </CardBody>
          </Card>
          <Card>
            <CardHeader>Home Gym / Hobby Room</CardHeader>
            <CardBody>
              <Text size="small">Extra room = no gym membership needed. Squat rack, treadmill, yoga area. At ₹2.5 Cr in Yelahanka you get 2,000 sqft — room for all of this.</Text>
            </CardBody>
          </Card>
          <Card>
            <CardHeader>Guest Room for Family / Friends</CardHeader>
            <CardBody>
              <Text size="small">Single adults host parents, friends, colleagues. A dedicated guest room means you're never compromising your own space. Critical for long-term comfort.</Text>
            </CardBody>
          </Card>
        </Grid>

        <Table
          headers={['Area', 'Size at ₹2.5 Cr', 'Rooms possible', 'WFH Room?', 'Gym Room?', 'Guest Room?']}
          rows={[
            ['Yelahanka', '~2,000 sqft', '3 BHK + study', 'Yes', 'Yes', 'Yes'],
            ['Jakkur', '~2,100 sqft', '3–4 BHK', 'Yes', 'Yes', 'Yes'],
            ['Thanisandra', '~1,500 sqft', '3 BHK', 'Tight', 'No', 'Yes'],
            ['HBR Layout', '~1,200 sqft', '2 BHK', 'No', 'No', 'Cramped'],
            ['Hebbal', '~950 sqft', '2 BHK', 'No', 'No', 'No'],
          ]}
          rowTone={['success', 'success', 'warning', 'danger', 'danger']}
          striped
        />
      </Stack>

      <Divider />

      <Stack gap={10}>
        <H2>Final Recommendation — Single Adult</H2>
        <Table
          headers={['Rank', 'Area', 'Score', 'Value', 'Single-Adult Fit']}
          rows={[
            ['1', 'Thanisandra / Nagavara (social-first pick)', '73/100', '9.2', 'Vibrant neighbourhood, young crowd, great delivery, Metro upside. Smaller flat.'],
            ['1', 'Yelahanka New Town (space-first pick)', '74/100', '10.6', 'Largest home, cleanest air, most peaceful. Go elsewhere for social life.'],
            ['2', 'Jakkur / Kodigehalli (outdoor-first pick)', '64/100', '10.0', 'Best if you\'re an outdoor person. Lake, runs, big flat. Thin social scene.'],
            ['3', 'Kothanur (budget pick)', '58/100', '9.7', 'Biggest flat, cheapest. Internal amenities only. 2–3 yrs to social maturity.'],
            ['Skip', 'Hebbal + HBR Layout', '64–65/100', '5–7.5', 'Overpriced. You pay commute premium you don\'t need. Small cramped flats.'],
          ]}
          rowTone={['success', 'success', undefined, undefined, 'danger']}
          striped
        />
        <Text size="small" tone="secondary">
          Both Thanisandra and Yelahanka score #1 — they are genuinely different products for different personalities. The next step is to answer: do you want your social life <Text weight="semibold" as="span">at your doorstep</Text> or are you fine <Text weight="semibold" as="span">driving 20 min for it</Text> in exchange for a bigger, quieter home?
        </Text>
      </Stack>

    </Stack>
  );
}
