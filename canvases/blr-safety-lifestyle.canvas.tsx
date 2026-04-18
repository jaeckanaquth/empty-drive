import {
  BarChart,
  Card, CardBody, CardHeader,
  Divider, Grid, H1, H2, H3,
  Pill, Row, Stack, Stat, Table, Text,
  useCanvasState,
} from 'cursor/canvas';

// ── area safety & lifestyle scores ────────────────────────────────────────

interface AreaProfile {
  name: string;
  safetyNight: number;      // /10
  policeResponse: number;   // /10
  streetLighting: number;   // /10
  walkability: number;      // /10
  cafeScene: number;        // /10
  fitnessOutdoor: number;   // /10
  greenParks: number;       // /10
  deliveryApps: number;     // /10
  hospitalProximity: number; // /10
  soloLivingEase: number;   // /10
}

const areas: Record<string, AreaProfile> = {
  'Yelahanka New Town': {
    safetyNight: 8, policeResponse: 7, streetLighting: 7, walkability: 6,
    cafeScene: 6, fitnessOutdoor: 8, greenParks: 9, deliveryApps: 8,
    hospitalProximity: 8, soloLivingEase: 8,
  },
  'Thanisandra': {
    safetyNight: 7, policeResponse: 7, streetLighting: 7, walkability: 7,
    cafeScene: 8, fitnessOutdoor: 7, greenParks: 6, deliveryApps: 9,
    hospitalProximity: 8, soloLivingEase: 8,
  },
  'Hebbal': {
    safetyNight: 8, policeResponse: 8, streetLighting: 8, walkability: 5,
    cafeScene: 7, fitnessOutdoor: 6, greenParks: 7, deliveryApps: 9,
    hospitalProximity: 9, soloLivingEase: 7,
  },
  'Whitefield': {
    safetyNight: 7, policeResponse: 6, streetLighting: 7, walkability: 5,
    cafeScene: 8, fitnessOutdoor: 6, greenParks: 5, deliveryApps: 9,
    hospitalProximity: 7, soloLivingEase: 7,
  },
  'Koramangala': {
    safetyNight: 7, policeResponse: 7, streetLighting: 8, walkability: 8,
    cafeScene: 10, fitnessOutdoor: 6, greenParks: 5, deliveryApps: 10,
    hospitalProximity: 9, soloLivingEase: 9,
  },
};

type AreaKey = keyof typeof areas;

const areaKeys = Object.keys(areas) as AreaKey[];

const metrics: { key: keyof AreaProfile; label: string }[] = [
  { key: 'safetyNight', label: 'Night Safety' },
  { key: 'policeResponse', label: 'Police Response' },
  { key: 'streetLighting', label: 'Street Lighting' },
  { key: 'walkability', label: 'Walkability' },
  { key: 'cafeScene', label: 'Café / Social Scene' },
  { key: 'fitnessOutdoor', label: 'Outdoor Fitness' },
  { key: 'greenParks', label: 'Green Parks' },
  { key: 'deliveryApps', label: 'App Delivery Coverage' },
  { key: 'hospitalProximity', label: 'Hospital Proximity' },
  { key: 'soloLivingEase', label: 'Solo Living Ease' },
];

function total(a: AreaProfile): number {
  return Object.values(a).reduce((s, v) => s + v, 0);
}

// ── safety practices for solo living ──────────────────────────────────────

const safetyPractices = [
  {
    category: 'Digital Safety',
    items: [
      ['Smart video doorbell', 'See who\'s at the door before opening. Reolink / Ring are affordable options.'],
      ['Share live location with family', 'Google Maps live location to parents 24/7 — low effort, high peace of mind.'],
      ['ICE contacts in phone', '\"In Case of Emergency\" contacts pre-saved. Saves time in an emergency.'],
      ['Society MyGate / app', 'Visitor pre-authorisation means no surprise visitors. Works even when you\'re not home.'],
    ],
  },
  {
    category: 'Physical Security',
    items: [
      ['Main door — ISI-mark 3-point lock', 'Standard wooden doors can be forced. A 3-point lock is significantly more resistant.'],
      ['Door reinforcement / steel frame', 'Especially relevant if ground or accessible floor. Ask builder about door grade.'],
      ['Peephole / video camera', 'Verify before opening any door. Video camera > peephole for recording.'],
      ['Window grills (1st–3rd floor)', 'Lower floors are more accessible. Grills on accessible windows are standard practice.'],
    ],
  },
  {
    category: 'Medical Preparedness',
    items: [
      ['First aid kit at home', 'Stocked and accessible. Basics: bandages, antiseptic, paracetamol, ORS.'],
      ['Save Apollo / Aster ER numbers', 'Pre-saved in phone: Columbia Asia Hebbal: 080-4015-0000, Aster CMI: 080-4342-0101'],
      ['Aarogya Setu / ABHA registered', 'Digital health records accessible in emergencies.'],
      ['Uber / Ola auto-booked emergency plan', 'If you can\'t drive — know your non-ambulance transport option.'],
    ],
  },
  {
    category: 'Daily Comfort Alone',
    items: [
      ['Neighbour acquaintance', 'Know at least 2 neighbours by name. The first 6 months, introduce yourself.'],
      ['Regular check-in routine with family', 'Daily 5-min call. Abnormal silence = signal for family to act.'],
      ['Society WhatsApp group participation', 'Stay aware of what\'s happening in the building. Helps in emergencies.'],
      ['Maintain a full water + food buffer', '2 days of essentials at home at all times. For illness, bad weather, or travel recovery.'],
    ],
  },
];

// ── lifestyle by day type ──────────────────────────────────────────────────

const dayTypes = [
  {
    type: 'WFH Weekday (3 days/week)',
    tone: 'info' as const,
    routine: [
      { time: '6:30–7:30 AM', activity: 'Gym in society / outdoor run in Yelahanka\'s parks (GKVK lake trail, Air Force grounds area)' },
      { time: '9:00 AM – 6:00 PM', activity: 'WFH — critical: power backup, fiber internet, quiet building' },
      { time: '1:00 PM', activity: 'Lunch — Swiggy/Zomato delivery within 30 min in Yelahanka New Town; or cook' },
      { time: '6:30–7:30 PM', activity: 'Walk in society / nearby park; Yelahanka Lake nearby' },
      { time: '8:00 PM', activity: 'Dinner — cafés on Yelahanka New Town main road or order in' },
    ],
    infrastructure: ['Power backup (100%)', 'Fiber internet (Jio/ACT)', 'Quiet building', 'Swiggy/Zomato delivery'],
  },
  {
    type: 'Office Day (2 days/week)',
    tone: 'warning' as const,
    routine: [
      { time: '7:30 AM', activity: 'Depart — Yelahanka to Hebbal: NH44 or Bellary Road, 20–35 min depending on time' },
      { time: '8:30 AM – 6:00 PM', activity: 'Office at Hebbal / Manyata' },
      { time: '6:30 PM', activity: 'Return — slightly longer in evening traffic, 30–45 min via NH44' },
      { time: '7:30 PM', activity: 'Evening workout, grocery, or restaurant in Yelahanka New Town' },
    ],
    infrastructure: ['Covered dedicated parking', 'NH44 connectivity', 'Fuel station on route', 'Quick food on return'],
  },
  {
    type: 'Weekend',
    tone: 'success' as const,
    routine: [
      { time: 'Morning', activity: 'GKVK campus walk / Hesaraghatta lake (25 min) / Nandi Hills day trip (60 min via NH44)' },
      { time: 'Afternoon', activity: 'Sahakar Nagar / Sadahalli Gate area for cafés; Orion East mall (20 min) for shopping' },
      { time: 'Evening', activity: 'Yelahanka New Town social scene — decent café options, growing restaurant strip' },
      { time: 'Night', activity: 'MG Road / Indiranagar accessible in 45 min for nightlife if needed' },
    ],
    infrastructure: ['Car for day trips', 'NH44 to city', 'Nandi Hills proximity', 'Airport proximity (15 min)'],
  },
];

export default function SafetyLifestyle() {
  const [selectedArea, setSelectedArea] = useCanvasState<AreaKey>('slArea', 'Yelahanka New Town');

  const profile = areas[selectedArea];
  const scores = metrics.map(m => profile[m.key]);
  const totalScore = total(profile);

  return (
    <Stack gap={28} style={{ padding: '24px 28px', maxWidth: 960 }}>

      <Stack gap={4}>
        <H1>Safety & Lifestyle</H1>
        <Text tone="secondary">Solo adult · Yelahanka · How your daily life actually looks — and how to stay safe alone</Text>
      </Stack>

      <Grid columns={4} gap={14}>
        <Stat value="8.0/10" label="Yelahanka Night Safety" tone="success" />
        <Stat value="9/10" label="Green Parks Score" tone="success" />
        <Stat value="20–35 min" label="Commute to Hebbal" tone="info" />
        <Stat value="15 min" label="To Airport (Bonus)" tone="success" />
      </Grid>

      <Divider />

      {/* ── area comparison ── */}
      <Stack gap={14}>
        <Row gap={8} align="center" wrap>
          <H2>Safety & Lifestyle Scores by Area</H2>
          <Row gap={6} wrap>
            {areaKeys.map(k => (
              <Pill key={k} active={selectedArea === k} onClick={() => setSelectedArea(k)}>{k}</Pill>
            ))}
          </Row>
        </Row>

        <Grid columns={5} gap={12}>
          {metrics.map(m => (
            <Stat
              key={m.key}
              value={`${profile[m.key]}/10`}
              label={m.label}
              tone={profile[m.key] >= 8 ? 'success' : profile[m.key] >= 6 ? undefined : 'warning'}
            />
          ))}
        </Grid>

        <BarChart
          categories={metrics.map(m => m.label)}
          series={[
            { name: selectedArea, data: scores },
          ]}
          horizontal
          min={0}
          max={10}
          height={320}
        />

        <Card>
          <CardHeader trailing={<Pill label={`Total: ${totalScore}/100`} tone={totalScore >= 75 ? 'success' : 'warning'} size="sm" />}>
            {selectedArea} — Overall Safety & Lifestyle Assessment
          </CardHeader>
          <CardBody>
            <Grid columns={5} gap={10}>
              {areaKeys.map(k => (
                <Stack key={k} gap={3} style={{ textAlign: 'center' }}>
                  <Text size="small" weight="semibold">{k.split(' ')[0]}</Text>
                  <Text size="small" tone={total(areas[k]) >= 75 ? 'success' : undefined}>
                    {total(areas[k])}/100
                  </Text>
                </Stack>
              ))}
            </Grid>
            <Text size="small" tone="secondary" style={{ marginTop: 10 }}>
              Koramangala leads on lifestyle/social but is far from Hebbal and well above your ₹2.5 Cr budget. Yelahanka scores best on green space, safety, and solo living ease among affordable North BLR options.
            </Text>
          </CardBody>
        </Card>
      </Stack>

      <Divider />

      {/* ── day-in-the-life ── */}
      <Stack gap={14}>
        <H2>Your Day-in-the-Life at Yelahanka</H2>
        <Grid columns={3} gap={14}>
          {dayTypes.map(dt => (
            <Card key={dt.type}>
              <CardHeader trailing={<Pill label={dt.type.split('(')[1]?.replace(')', '') || ''} tone={dt.tone} size="sm" />}>
                {dt.type.split(' (')[0]}
              </CardHeader>
              <CardBody>
                <Stack gap={8}>
                  <Stack gap={5}>
                    {dt.routine.map(r => (
                      <Stack key={r.time} gap={1}>
                        <Text size="small" weight="semibold">{r.time}</Text>
                        <Text size="small" tone="secondary">{r.activity}</Text>
                      </Stack>
                    ))}
                  </Stack>
                  <Stack gap={4}>
                    <Text size="small" weight="semibold">Key infrastructure needed:</Text>
                    <Row gap={5} wrap>
                      {dt.infrastructure.map(i => <Pill key={i} size="sm">{i}</Pill>)}
                    </Row>
                  </Stack>
                </Stack>
              </CardBody>
            </Card>
          ))}
        </Grid>
      </Stack>

      <Divider />

      {/* ── yelahanka specific lifestyle ── */}
      <Stack gap={12}>
        <H2>Yelahanka — Honest Lifestyle Assessment</H2>
        <Grid columns={2} gap={14}>
          <Card>
            <CardHeader trailing={<Pill label="Genuine strengths" tone="success" size="sm" />}>What Yelahanka Does Well</CardHeader>
            <CardBody>
              <Stack gap={5}>
                {[
                  ['Clean air', 'Among the lowest PM2.5 readings in Bangalore. Relevant for daily runs and open-window WFH.'],
                  ['Green spaces', 'GKVK campus (1,100 acres), Yelahanka Lake, multiple parks. Rare in BLR.'],
                  ['Low congestion', 'Off the main IT corridors. Traffic is manageable vs Whitefield/Koramangala.'],
                  ['Proximity to airport', '15 min to KIAL — significant quality of life benefit for frequent travel.'],
                  ['Affordable eats', 'Good range of local restaurants and dhabas. Lower prices than South BLR.'],
                  ['Night safety', 'Air Force presence, military cantonments nearby — historically safe area.'],
                  ['Wide roads (new areas)', 'STRR, NH44, Doddaballapur Road — less pot-holed than inner city.'],
                ].map(([title, detail]) => (
                  <Stack key={title} gap={1}>
                    <Text size="small" weight="semibold">{title}</Text>
                    <Text size="small" tone="secondary">{detail}</Text>
                  </Stack>
                ))}
              </Stack>
            </CardBody>
          </Card>

          <Card>
            <CardHeader trailing={<Pill label="Honest gaps" tone="warning" size="sm" />}>Where Yelahanka Falls Short</CardHeader>
            <CardBody>
              <Stack gap={5}>
                {[
                  ['Café / nightlife scene', 'Growing but thin. 5–6 good cafés in New Town area. Nothing like Koramangala/Indiranagar. Improving.'],
                  ['Metro coverage (today)', 'No metro yet. Proposed Purple Line extension (2026–27). Currently 100% car-dependent.'],
                  ['Young professional density', 'Lower than Thanisandra/Whitefield. Social scene more family-oriented. Can feel quieter.'],
                  ['Walkability', 'Internal roads fine, but footpaths patchy. Mostly car/2-wheeler for errands. Same as most of BLR.'],
                  ['Fine dining / premium restaurants', 'Good local food but limited upscale options. Weekend dining needs a drive to city.'],
                  ['Pub / bar scene', 'Very limited. For nightlife, you\'re looking at 40–50 min to MG Road. Not a daily concern but honest gap.'],
                ].map(([title, detail]) => (
                  <Stack key={title} gap={1}>
                    <Text size="small" weight="semibold">{title}</Text>
                    <Text size="small" tone="secondary">{detail}</Text>
                  </Stack>
                ))}
              </Stack>
            </CardBody>
          </Card>
        </Grid>
      </Stack>

      <Divider />

      {/* ── solo living safety ── */}
      <Stack gap={14}>
        <H2>Safety Practices for Solo Living</H2>
        <Text size="small" tone="secondary">Living alone doesn't require paranoia — just a few simple systems that give you and your family peace of mind.</Text>
        <Grid columns={2} gap={14}>
          {safetyPractices.map(sp => (
            <Card key={sp.category}>
              <CardHeader>{sp.category}</CardHeader>
              <CardBody>
                <Stack gap={6}>
                  {sp.items.map(([action, detail]) => (
                    <Stack key={action} gap={1}>
                      <Text size="small" weight="semibold">{action}</Text>
                      <Text size="small" tone="secondary">{detail}</Text>
                    </Stack>
                  ))}
                </Stack>
              </CardBody>
            </Card>
          ))}
        </Grid>
      </Stack>

      <Divider />

      {/* ── connectivity context ── */}
      <Stack gap={12}>
        <H2>Getting Around — Connectivity Reality Check</H2>
        <Table
          headers={['Route', 'Distance', 'Normal Time', 'Peak Time', 'Road Quality']}
          rows={[
            ['Yelahanka New Town → Hebbal (office)', '14–18 km', '20–25 min', '35–50 min', 'NH44 — excellent'],
            ['Yelahanka → Manyata Tech Park', '16–20 km', '25–30 min', '40–55 min', 'NH44 + Bellary Rd — good'],
            ['Yelahanka → Kempegowda Airport', '12–15 km', '15–20 min', '25–35 min', 'NH44 — excellent'],
            ['Yelahanka → Orion East Mall', '8 km', '15 min', '20–25 min', 'Good'],
            ['Yelahanka → Koramangala (social)', '28–32 km', '45 min', '60–75 min', 'Varies — ORR heavy'],
            ['Yelahanka → MG Road / City Centre', '22–26 km', '40 min', '55–70 min', 'Tumkur Rd / ORR'],
            ['Yelahanka → Nandi Hills (weekend)', '55 km', '60 min', '70 min', 'NH44 — excellent'],
          ]}
          rowTone={['success', 'success', 'success', 'success', undefined, undefined, 'success']}
          striped
        />
        <Card>
          <CardHeader trailing={<Pill label="Future upside" tone="success" size="sm" />}>
            Metro Coming — Long-Term Lifestyle Upside
          </CardHeader>
          <CardBody>
            <Stack gap={5}>
              <Text size="small">Bangalore Metro Phase 3 includes a corridor through Yelahanka (proposed Bangalore North line). If operationalised by 2027–28, it will connect Yelahanka directly to the city centre and significantly improve walkability scores.</Text>
              <Text size="small" tone="secondary">Conservative view: don't buy counting on metro. But if it arrives, property value and daily lifestyle both improve substantially. Bonus upside, not a requirement.</Text>
              <Row gap={6} wrap>
                <Pill size="sm" tone="info">Phase 3 notification: 2024</Pill>
                <Pill size="sm">Expected completion: 2027–29</Pill>
                <Pill size="sm" tone="warning">Don't bank on timeline</Pill>
              </Row>
            </Stack>
          </CardBody>
        </Card>
      </Stack>

      <Divider />

      {/* ── final summary ── */}
      <Stack gap={10}>
        <H2>The Bottom Line — Yelahanka for a Solo WFH Adult</H2>
        <Table
          headers={['Dimension', 'Yelahanka Score', 'What That Means for You']}
          rows={[
            ['Daily Safety', '8/10', 'Historically safe, low crime, Air Force vicinity. Solo living very comfortable.'],
            ['Green & Air Quality', '9/10', 'Best in North BLR. Run outside daily without second thoughts.'],
            ['WFH Infrastructure', '8/10', 'Good backup power, fiber available — confirm per society before buying.'],
            ['Social / Café Scene', '6/10', 'Growing, not great yet. Fine if you\'re not dependent on it daily.'],
            ['Commute to Hebbal', '8/10', 'NH44 is fast. 25–35 min each way on 2 days/week. Very manageable.'],
            ['Weekend Lifestyle', '7/10', 'Parks, day trips, airport proximity. Nightlife needs a drive. Acceptable.'],
            ['Future Appreciation', '8/10', 'Metro + IT growth in North BLR. Strong 5–10 year outlook.'],
          ]}
          rowTone={['success', 'success', 'success', undefined, 'success', 'success', 'success']}
          striped
        />
        <Card>
          <CardBody>
            <Text size="small">
              For a single professional who works from home 3 days a week, values clean air and green space, commutes to Hebbal 2 days, and doesn't need a vibrant nightlife scene daily — Yelahanka New Town is the correct call. The lifestyle trade-offs are real but minor for your profile. The upsides (air quality, space, safety, airport, future appreciation) are uniquely strong for the price.
            </Text>
          </CardBody>
        </Card>
      </Stack>

    </Stack>
  );
}
