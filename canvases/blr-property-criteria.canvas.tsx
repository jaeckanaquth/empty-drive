import {
  Card, CardBody, CardHeader,
  Divider, Grid, H1, H2, H3,
  Pill, Row, Stack, Stat, Table, Text,
} from 'cursor/canvas';

const categories = [
  {
    id: 1,
    title: 'Budget & Financial Planning',
    priority: 'Critical',
    tone: 'danger' as const,
    criteria: [
      'Hard ceiling: negotiate on sticker price so property + stamp/reg/GST/legal stays within your ₹3 Cr plan (all-in often adds ~6–11%)',
      'All-in cost: stamp duty (~5–6%), registration (~1%), GST (5% for under-construction), legal fees',
      'Home loan eligibility & EMI affordability (keep EMI ≤ 40% of take-home unless you have a deliberate buffer)',
      'Down payment readiness (min 10–20% of property value)',
      'Maintenance deposit & advance corpus',
      'Contingency buffer for repairs / interior / unexpected costs',
    ],
  },
  {
    id: 2,
    title: 'Area & Location Selection',
    priority: 'Critical',
    tone: 'danger' as const,
    criteria: [
      'North-BLR priority: shortlist micro-markets first — Hebbal/Manyata belt, Thanisandra–Nagavara–Kogilu, Yelahanka–New Town, Jakkur, Hennur/HRBR, Devanahalli–Budigere (then widen only if needed)',
      'Proximity to your workplace (commute time, not just km) — for Manyata/Hebbal/KIAL jobs, inner north vs airport belt is the main trade-off',
      'Established vs emerging: inner north (Hebbal, Kalyan Nagar) = liquidity + premium; outer north (Thanisandra, Yelahanka, Devanahalli) = space + growth, longer commutes',
      'If comparing city-wide: east/south corridors (Whitefield, Sarjapur, Electronic City) are useful benchmarks, not the default hunt band',
      'BBMP vs BDA vs panchayat jurisdiction — affects services, roads, and legal security',
      'Flood-prone zones, lake proximity, low-lying stretches — validate with monsoon visits, not only maps',
      'Master Plan 2031 zoning — residential / mixed-use classification and notified road widening',
    ],
  },
  {
    id: 3,
    title: 'Investment & Appreciation Potential',
    priority: 'High',
    tone: 'warning' as const,
    criteria: [
      'Historical price CAGR of the micro-market (last 5–10 years) — north pockets differ: inner north vs airport belt vs ORR-north junctions',
      'Incremental appreciation drivers you can underwrite: Metro Phase 2B (Nagavara–airport), STRR/PRR links, office absorption near Manyata/KIAL',
      'Opportunity cost: larger down payment vs keeping corpus in equity/MFs — model both (see purchase-strategy canvas)',
      'For under-construction: payment schedule vs rent — pre-EMI/full EMI phase vs staying on rent',
      'IT/commercial hub growth and absorption rates nearby (Manyata, KIAL-linked services, existing IT catchments)',
      'Supply pipeline — too much new inventory in one micro-market can cap near-term upside',
      'Rental yield (city-wide often ~2.5–3.5%; many north tech pockets sit in that band — sanity-check vs EMI)',
      'Liquidity: ease of resale in that exact micro-market (builder tier, age of project, odd floor plans)',
    ],
  },
  {
    id: 4,
    title: 'Connectivity & Infrastructure',
    priority: 'High',
    tone: 'warning' as const,
    criteria: [
      'North-first roads: Bellary Road (NH44), ORR northern arc, Thanisandra Main Rd, Hennur/Outer Ring junctions — daily choke points matter more than map distance',
      'Metro: Phase 2B Nagavara–airport line vs your shortlisted tower (walk/transit time, not only “metro city”)',
      'Airport / KIAL access if you fly often — Devanahalli belt vs inner north is a lifestyle + commute trade-off',
      'ORR, STRR, and major link roads you will actually use — reduces cross-city pain if work moves later',
      'BMTC / airport Vayu Vajra and last-mile (auto, cab availability) if you will not always drive',
      'Typical peak-hour commute time to your actual office, not Sunday map time',
      'Waterlogging / pothole density on your exact approach roads — north has known monsoon pockets; verify',
    ],
  },
  {
    id: 5,
    title: 'Property Type & Configuration',
    priority: 'High',
    tone: 'warning' as const,
    criteria: [
      'Type: Apartment / Villa / Row house / Plot — each has different appreciation & maintenance profile',
      'Under-construction (lower price, higher risk) vs Ready-to-move (OC obtained, immediate possession)',
      'BHK configuration: 2BHK is most liquid; 3BHK if planning for family',
      'Carpet area vs super built-up area — loading factor (25–35% is typical; anything above is bad)',
      'Floor: ground floors are cheaper, higher floors have better ventilation & views',
      'Vastu, natural light, cross-ventilation, orientation (North/East facing preferred)',
    ],
  },
  {
    id: 6,
    title: 'Legal & Documentation',
    priority: 'Critical',
    tone: 'danger' as const,
    criteria: [
      'RERA registration — mandatory for under-construction; verify on K-RERA website',
      'Clear title: check for encumbrances, liens, litigation (EC for 30 years)',
      'Approved building plan from BBMP/BDA/BMRDA',
      'Occupancy Certificate (OC) for ready-to-move — no OC = illegal construction risk',
      'Khata (A-Khata preferred; B-Khata properties have legal complications)',
      'Land conversion certificate (agricultural land must be converted to residential)',
      'Betterment charges & property tax dues cleared by seller',
    ],
  },
  {
    id: 7,
    title: 'Builder / Developer Reputation',
    priority: 'High',
    tone: 'warning' as const,
    criteria: [
      'Track record: number of projects delivered, on-time completion history',
      'RERA compliance history — check for complaints/penalties',
      'Financial health: debt levels, no NCLT insolvency proceedings',
      'Construction quality: visit completed projects, talk to residents',
      'After-sales service and handover documentation quality',
    ],
  },
  {
    id: 8,
    title: 'Amenities',
    priority: 'Medium',
    tone: 'success' as const,
    criteria: [
      'Water security: Cauvery connection stage, borewell dependency, tanker history — non-negotiable in BLR',
      'Internal: clubhouse, gym, pool, jogging track, EV charging, power backup (KVA/coverage), STP quality',
      'Children\'s play area, senior citizen zone, co-working space',
      'External (within 2 km): schools, hospitals, supermarkets, banks/ATMs',
      'Parks, future metro walk, everyday dining — what you will actually use vs brochure checklist',
      'Be cautious: over-amenitized projects have higher maintenance charges and lower utilisation',
    ],
  },
  {
    id: 9,
    title: 'Society & Maintenance',
    priority: 'Medium',
    tone: 'success' as const,
    criteria: [
      'Monthly maintenance charges (₹3–8/sqft is typical; can add ₹5,000–20,000/month)',
      'Quality of existing Resident Welfare Association (RWA) if resale',
      'Sinking fund adequacy for future capital repairs',
      'Age of project — older complexes may have deferred maintenance',
      'Ratio of rented vs owned units (too many tenants = poor upkeep)',
    ],
  },
  {
    id: 10,
    title: 'Safety, Lifestyle & Environment',
    priority: 'Medium',
    tone: 'success' as const,
    criteria: [
      'Gated community with 24x7 security, CCTV, intercom',
      'Area safety — check for crime rates in the locality',
      'Air quality / proximity to industrial zones or garbage dump yards',
      'Noise pollution: railway line, highway, flight path proximity',
      'Walkability score and social infrastructure for daily needs',
    ],
  },
];

export default function BLRPropertyCriteria() {
  const critical = categories.filter(c => c.priority === 'Critical');
  const high = categories.filter(c => c.priority === 'High');
  const medium = categories.filter(c => c.priority === 'Medium');

  const totalCriteria = categories.reduce((acc, c) => acc + c.criteria.length, 0);

  return (
    <Stack gap={24} style={{ padding: '24px 28px', maxWidth: 900 }}>
      <Stack gap={4}>
        <H1>Bangalore Property Buying Criteria</H1>
        <Text tone="secondary">Goal: buy in Bengaluru with a north-BLR preference, under ₹3 Cr all-in — structured decision framework</Text>
      </Stack>

      <Grid columns={4} gap={12}>
        <Stat value={`${categories.length}`} label="Major Categories" />
        <Stat value={`${totalCriteria}`} label="Total Checkpoints" />
        <Stat value={`${critical.length}`} label="Critical Categories" tone="danger" />
        <Stat value="3 Cr" label="Max Budget" tone="warning" />
      </Grid>

      <Divider />

      <Stack gap={6}>
        <H2>Evaluation Priority</H2>
        <Table
          headers={['#', 'Category', 'Priority', 'Key Focus']}
          rows={categories.map((c, i) => [
            String(i + 1),
            c.title,
            c.priority,
            c.criteria[0],
          ])}
          rowTone={categories.map(c =>
            c.priority === 'Critical' ? 'danger' :
            c.priority === 'High' ? 'warning' :
            undefined
          )}
        />
      </Stack>

      <Divider />

      <Stack gap={20}>
        <Row gap={8} style={{ alignItems: 'center' }}>
          <H2>Critical — Must Resolve First</H2>
          <Pill tone="warning">Non-negotiable</Pill>
        </Row>

        <Grid columns={2} gap={16}>
          {critical.map(cat => (
            <Card key={cat.id}>
              <CardHeader
                trailing={<Pill tone={cat.tone === 'danger' ? 'warning' : cat.tone} size="sm">{cat.priority}</Pill>}
              >
                {cat.title}
              </CardHeader>
              <CardBody>
                <Stack gap={6}>
                  {cat.criteria.map((item, i) => (
                    <Row key={i} gap={8} style={{ alignItems: 'flex-start' }}>
                      <Text tone="secondary" size="small" style={{ minWidth: 16 }}>{i + 1}.</Text>
                      <Text size="small">{item}</Text>
                    </Row>
                  ))}
                </Stack>
              </CardBody>
            </Card>
          ))}
        </Grid>

        <Divider />

        <Row gap={8} style={{ alignItems: 'center' }}>
          <H2>High Importance — Strong Influence on Decision</H2>
          <Pill tone="warning">Evaluate carefully</Pill>
        </Row>

        <Grid columns={2} gap={16}>
          {high.map(cat => (
            <Card key={cat.id}>
              <CardHeader
                trailing={<Pill tone={cat.tone === 'danger' ? 'warning' : cat.tone} size="sm">{cat.priority}</Pill>}
              >
                {cat.title}
              </CardHeader>
              <CardBody>
                <Stack gap={6}>
                  {cat.criteria.map((item, i) => (
                    <Row key={i} gap={8} style={{ alignItems: 'flex-start' }}>
                      <Text tone="secondary" size="small" style={{ minWidth: 16 }}>{i + 1}.</Text>
                      <Text size="small">{item}</Text>
                    </Row>
                  ))}
                </Stack>
              </CardBody>
            </Card>
          ))}
        </Grid>

        <Divider />

        <Row gap={8} style={{ alignItems: 'center' }}>
          <H2>Medium — Quality of Life & Long-term Comfort</H2>
          <Pill tone="success">Compare &amp; weigh</Pill>
        </Row>

        <Grid columns={2} gap={16}>
          {medium.map(cat => (
            <Card key={cat.id}>
              <CardHeader
                trailing={<Pill tone={cat.tone === 'danger' ? 'warning' : cat.tone} size="sm">{cat.priority}</Pill>}
              >
                {cat.title}
              </CardHeader>
              <CardBody>
                <Stack gap={6}>
                  {cat.criteria.map((item, i) => (
                    <Row key={i} gap={8} style={{ alignItems: 'flex-start' }}>
                      <Text tone="secondary" size="small" style={{ minWidth: 16 }}>{i + 1}.</Text>
                      <Text size="small">{item}</Text>
                    </Row>
                  ))}
                </Stack>
              </CardBody>
            </Card>
          ))}
        </Grid>
      </Stack>

      <Divider />

      <Stack gap={6}>
        <H3>Recommended Order of Work</H3>
        <Table
          headers={['Step', 'Action', 'Why First']}
          rows={[
            ['1', 'Fix budget ceiling & loan eligibility', 'Everything else depends on what you can actually afford'],
            ['2', 'Shortlist 2–3 north micro-markets (then widen only if needed) using commute + growth', 'Locks geography before wasting time on listings'],
            ['3', 'Decide: under-construction vs ready-to-move', 'Determines legal risk appetite and possession timeline'],
            ['4', 'Screen listings against legal / RERA compliance', 'Eliminates risky properties early'],
            ['5', 'Evaluate connectivity, amenities, configuration', 'Shortlist 3–5 properties for site visits'],
            ['6', 'Deep-dive: builder reputation, maintenance, lifestyle', 'Final-round comparison before offer'],
            ['7', 'Negotiate price, verify all documents with a lawyer', 'Protect yourself before any payment'],
          ]}
        />
      </Stack>

      <Text tone="secondary" size="small">
        Bangalore-specific notes: Verify A-Khata, RERA on krera.karnataka.gov.in, and Metro Phase 2B (Nagavara–airport) timelines before paying heavy premiums on “upcoming” connectivity. For north BLR, combine map research with peak-hour drives during monsoon.
      </Text>
    </Stack>
  );
}
