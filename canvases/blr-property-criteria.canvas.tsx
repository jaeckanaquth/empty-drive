import {
  Card, CardBody, CardHeader,
  Divider, Grid, H1, H2, H3,
  Pill, Row, Stack, Stat, Table, Text,
} from 'cursor/canvas';

// ── Canonical 10-point order (same labels as blr-deep-eval) ────────────────

const TEN_POINT: { num: number; label: string; canvas: string; status: 'Done' | 'Partial' | 'Next' }[] = [
  { num: 1,  label: 'Area Selection & micro-market',     canvas: 'blr-areas.canvas.tsx',                         status: 'Done' },
  { num: 2,  label: 'Connectivity & infrastructure',    canvas: 'blr-areas.canvas.tsx (connectivity tab)',      status: 'Done' },
  { num: 3,  label: 'Investment & appreciation',        canvas: 'blr-investment.canvas.tsx',                    status: 'Done' },
  { num: 4,  label: 'Property type / specs / UDS / hold', canvas: 'blr-property-type-config.canvas.tsx',      status: 'Done' },
  { num: 5,  label: 'Legal & documentation',            canvas: 'blr-legal-documentation.canvas.tsx',         status: 'Done' },
  { num: 6,  label: 'Project amenities',                canvas: 'blr-amenities.canvas.tsx',                     status: 'Partial' },
  { num: 7,  label: 'Social infrastructure (neighbourhood)', canvas: 'blr-areas.canvas.tsx (social tab) + deep-eval', status: 'Partial' },
  { num: 8,  label: 'Financial parameters',             canvas: 'blr-budget-financial-planning · blr-your-budget-profile', status: 'Partial' },
  { num: 9,  label: 'Risk factors',                     canvas: 'blr-safety-lifestyle.canvas.tsx',            status: 'Partial' },
  { num: 10, label: 'End use vs investment intent',     canvas: 'blr-deep-eval.canvas.tsx (enduse column)',   status: 'Partial' },
];

const categories = [
  {
    id: 1,
    title: 'Budget & Financial Planning',
    priority: 'Critical',
    tone: 'danger' as const,
    criteria: [
      'Hard ceiling: negotiate on base price so headline stays under ₹3 Cr before stamp/GST; interiors are usually extra',
      'All-in cost: stamp duty (~5–6%), registration (~1%), GST (5% for under-construction), legal fees',
      'Home loan eligibility & EMI affordability (keep EMI ≤ 40% of take-home)',
      'Down payment readiness (min 10–20% of property value)',
      'Maintenance deposit & advance corpus',
      'Contingency buffer for repairs / unexpected costs',
    ],
  },
  {
    id: 2,
    title: 'Area & Location Selection',
    priority: 'Critical',
    tone: 'danger' as const,
    criteria: [
      'North Bangalore priority: match micro-market to your commute anchor (e.g. Manyata / Hebbal / airport vs CBD)',
      'Established north pockets: Hebbal, Sanjay Nagar, Sahakar Nagar, Kalyan Nagar / HRBR, Hennur',
      'Maturing / high-supply north: Thanisandra, Nagavara, Kogilu, Jakkur — strong ₹3 Cr inventory; screen Khata carefully',
      'Airport & satellite north: Yelahanka New Town, Devanahalli, Budigere Cross — longer infra payoff, check water',
      'If you compare city-wide: East (Whitefield), South (Electronic City, Kanakapura), SE (Sarjapur) — useful only as benchmarks',
      'BBMP vs BDA vs panchayat jurisdiction — affects services & legal security',
      'Flood-prone zones, lake proximity, low-lying areas to avoid',
      'Master Plan 2031 zoning — residential / mixed-use classification',
    ],
  },
  {
    id: 3,
    title: 'Investment & Appreciation Potential',
    priority: 'High',
    tone: 'warning' as const,
    criteria: [
      'Historical price CAGR of the micro-market (last 5–10 years)',
      'Incremental capital: construction-linked stages (UC) vs lump RTM — model cash drain each year',
      'Opportunity cost: down payment / pre-EMI funds vs equity/MF returns; size how much liquidity to keep invested',
      'Total return mindset: expected appreciation + rental yield vs EMI + maintenance + loan interest (net of tax)',
      'Upcoming infrastructure: Metro (e.g. Nagavara–airport corridor), Peripheral Ring Road / STRR links affecting north',
      'IT/commercial hub growth and absorption rates nearby (Manyata, KIADB, ORR office catchments)',
      'Supply pipeline — too much inventory suppresses near-term appreciation',
      'Rental yield (Bangalore average ~2.5–3.5%; pockets near large IT parks often at the higher end)',
      'Liquidity: ease of resale in that micro-market',
    ],
  },
  {
    id: 4,
    title: 'Connectivity & Infrastructure',
    priority: 'High',
    tone: 'warning' as const,
    criteria: [
      'North spine roads: NH44 / Bellary Road, Thanisandra Main Rd, Hennur / Outer Ring Road (Hebbal–KR Puram segment)',
      'Metro: existing vs upcoming stations on lines that serve your pocket (e.g. Phase 2B toward airport from Nagavara side)',
      'Airport (KIAL) access time if you fly often — Yelahanka / Devanahalli vs inner north trade-offs',
      'ORR, NICE Road, NH access, signal-free / elevated corridors that cut peak-hour variance',
      'BMTC routes and last-mile (feeder autos) if you will not drive daily',
      'Typical peak-hour commute time to your office — north traffic concentrates at Hebbal and ORR merges',
      'Waterlogging / pothole density on connecting roads during monsoon',
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
      'Internal: clubhouse, gym, pool, jogging track, EV charging, power backup, STP',
      'Water security: BWSSB / Cauvery stage for the layout, borewell quality, sump capacity, summer tanker risk',
      'Children\'s play area, senior citizen zone, co-working space',
      'External (within 2 km): schools, hospitals, supermarkets, banks/ATMs',
      'Parks, metro station, restaurant/café options',
      'Be cautious: over-amenitized projects have higher maintenance charges',
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
        <Text tone="secondary">
          North Bangalore · UC Grade A · under ₹3 Cr — detailed checklist below. Use the 10-point row first to match <Text weight="semibold" as="span">blr-deep-eval</Text>; then drill into category cards.
        </Text>
      </Stack>

      <Stack gap={8}>
        <H2>10-point evaluation — where we are</H2>
        <Table
          headers={['#', 'Criterion', 'Primary canvas', 'Status']}
          rows={TEN_POINT.map(r => [String(r.num), r.label, r.canvas, r.status])}
          rowTone={TEN_POINT.map(r =>
            r.status === 'Done' ? 'success' : r.status === 'Next' ? 'warning' : undefined
          )}
          striped
        />
        <Text tone="secondary" size="small">
          #6: shortlist matrix + WFH checklist live in <Text weight="semibold" as="span">blr-amenities</Text>; deep-eval amenities row updated. Resume at <Text weight="semibold" as="span">#7 Social infrastructure</Text> (<Text weight="semibold" as="span">blr-areas</Text> social tab + social column in <Text weight="semibold" as="span">blr-deep-eval</Text>).
        </Text>
      </Stack>

      <Divider />

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
            ['2', 'Shortlist 2–3 micro-markets (north-first) from commute + growth', 'Locks geography before wasting time on listings'],
            ['3', 'Decide: under-construction vs ready-to-move', 'Determines legal risk appetite and possession timeline'],
            ['4', 'Screen listings against legal / RERA compliance', 'Eliminates risky properties early'],
            ['5', 'Evaluate connectivity, amenities, configuration', 'Shortlist 3–5 properties for site visits'],
            ['6', 'Deep-dive: builder reputation, maintenance, lifestyle', 'Final-round comparison before offer'],
            ['7', 'Negotiate price, verify all documents with a lawyer', 'Protect yourself before any payment'],
          ]}
        />
      </Stack>

      <Text tone="secondary" size="small">
        North Bangalore notes: Hebbal/ORR junctions dominate peak-hour variance — validate commute at rush hour, not Sunday morning. Always verify A-Khata, RERA on krera.karnataka.gov.in, and Metro/airport-corridor timelines before paying booking amounts on emerging pockets (Devanahalli, Budigere).
      </Text>
    </Stack>
  );
}
