import {
  BarChart,
  Card, CardBody, CardHeader,
  Divider, Grid, H1, H2, H3,
  Pill, Row, Stack, Stat, Table, Text,
  useCanvasState,
} from 'cursor/canvas';

// ── maintenance cost breakdown ─────────────────────────────────────────────

const costBreakdown = [
  { item: 'Security staff (salaries + ops)', pct: 30 },
  { item: 'Common area electricity', pct: 22 },
  { item: 'DG fuel & maintenance', pct: 13 },
  { item: 'Lift maintenance contracts', pct: 10 },
  { item: 'Housekeeping & sanitation', pct: 9 },
  { item: 'Gardening / horticulture', pct: 6 },
  { item: 'Pool maintenance (if any)', pct: 5 },
  { item: 'Admin & management', pct: 5 },
];

// ── society age implications ───────────────────────────────────────────────

const ageBands = [
  {
    range: '0–3 years',
    management: 'Builder-managed',
    tone: 'warning' as const,
    pros: ['Amenities brand new, warranty active', 'Builder still obligated to fix defects', 'Fresh common areas'],
    cons: ['No RWA yet — builder controls everything', 'Maintenance charges can be arbitrarily high', 'Can\'t vote out bad management yet', 'Society culture not formed'],
    verdict: 'Fine to buy, but you have less control. Push for RWA formation timeline.',
  },
  {
    range: '3–8 years',
    management: 'RWA taking over / transitioning',
    tone: 'success' as const,
    pros: ['RWA forming / formed — residents in control', 'Defect liability period ending — issues surfacing and being fixed', 'Community established, can assess culture'],
    cons: ['Potential tension between old builder maintenance and new RWA', 'First few maintenance cycles may have extra charges', 'Some latent construction defects may appear'],
    verdict: 'Sweet spot. You can assess society quality. RWA in control. Amenities still relatively fresh.',
  },
  {
    range: '8–15 years',
    management: 'Mature RWA',
    tone: 'success' as const,
    pros: ['Established RWA with known track record', 'Full history available — can research past AGM minutes', 'Sinking fund should be healthy if managed well'],
    cons: ['Amenities showing age — gym equipment, lifts may need replacement', 'Capital expenditure cycles start (painting, waterproofing)', 'Check sinking fund adequacy carefully'],
    verdict: 'Good to buy if sinking fund is healthy and RWA is active. Verify pending capital work.',
  },
  {
    range: '15+ years',
    management: 'Aged society',
    tone: 'warning' as const,
    pros: ['Deeply established community', 'All legal issues long resolved', 'Prices somewhat lower than newer projects'],
    cons: ['Major capital works likely needed (re-painting, waterproofing, lift replacement)', 'Sinking fund may be depleted', 'Potential special assessments to owners', 'Tech infra (fiber, EV) may need costly retrofitting'],
    verdict: 'Buy only if sinking fund is healthy, major works recently completed, and IT infra upgraded.',
  },
];

function maintenancePM(sqft: number, ratePerSqft: number): number {
  return Math.round(sqft * ratePerSqft);
}

export default function SocietyMaintenance() {
  const [sqft, setSqft] = useCanvasState<number>('socSqft', 1800);
  const [activeAge, setActiveAge] = useCanvasState<number>('ageband', 1); // 0-indexed

  const sqftOptions = [1400, 1600, 1800, 2000, 2200];
  const rateOptions = [3, 4, 5, 6, 7, 8];

  const ab = ageBands[activeAge];

  return (
    <Stack gap={28} style={{ padding: '24px 28px', maxWidth: 960 }}>

      <Stack gap={4}>
        <H1>Society & Maintenance</H1>
        <Text tone="secondary">What you pay every month, what you get, and how to vet the RWA before buying</Text>
      </Stack>

      <Grid columns={4} gap={14}>
        <Stat value="3–8 yrs" label="Ideal Society Age" tone="success" />
        <Stat value="Sinking Fund" label="Most Overlooked Check" tone="warning" />
        <Stat value="RWA Quality" label="Biggest Long-Term Factor" tone="info" />
        <Stat value="Water Supply" label="Most Common Pain Point" tone="danger" />
      </Grid>

      <Divider />

      {/* ── what maintenance charges pay for ── */}
      <Stack gap={12}>
        <H2>What Your Maintenance Charges Actually Pay For</H2>
        <Grid columns={2} gap={16}>
          <Stack gap={8}>
            <H3>Typical Cost Breakdown</H3>
            <BarChart
              categories={costBreakdown.map(c => c.item.split('(')[0].trim())}
              series={[{ name: 'Share of maintenance budget %', data: costBreakdown.map(c => c.pct) }]}
              horizontal
              valueSuffix="%"
              height={260}
            />
          </Stack>

          <Stack gap={8}>
            <H3>Your Monthly Bill at Different Rates</H3>
            <Stack gap={6}>
              <Row gap={6} align="center">
                <Text size="small" weight="semibold">Flat SBA:</Text>
                <Row gap={5}>
                  {sqftOptions.map(s => (
                    <Pill key={s} active={sqft === s} onClick={() => setSqft(s)}>{s}</Pill>
                  ))}
                </Row>
              </Row>
              <Table
                headers={['Rate/sqft', 'Monthly', 'Annual', 'Society Type']}
                rows={rateOptions.map(r => [
                  `₹${r}/sqft`,
                  `₹${maintenancePM(sqft, r).toLocaleString('en-IN')}`,
                  `₹${(maintenancePM(sqft, r) * 12).toLocaleString('en-IN')}`,
                  r <= 4 ? 'Basic (gym + security)' : r <= 6 ? 'Standard (+ pool/club)' : 'Premium (full amenities)',
                ])}
                rowTone={rateOptions.map(r => r <= 4 ? 'success' : r <= 6 ? undefined : 'warning')}
                columnAlign={['left', 'right', 'right', 'left']}
                striped
              />
            </Stack>
          </Stack>
        </Grid>

        <Card>
          <CardHeader trailing={<Pill label="Hidden cost" tone="warning" size="sm" />}>
            Maintenance Is a Permanent Monthly Expense — Model It Into Your Budget
          </CardHeader>
          <CardBody>
            <Grid columns={3} gap={14}>
              {[
                ['At ₹4/sqft on 1,800 sqft', '₹7,200/month', '₹86,400/year — recurring forever'],
                ['At ₹6/sqft on 1,800 sqft', '₹10,800/month', '₹1,29,600/year — adds up fast'],
                ['At ₹8/sqft on 1,800 sqft', '₹14,400/month', '₹1,72,800/year — nearly ₹1.73L p.a.'],
              ].map(([label, monthly, annual]) => (
                <Stack key={label} gap={4}>
                  <Text size="small" weight="semibold">{label}</Text>
                  <Text size="small">{monthly}</Text>
                  <Text size="small" tone="secondary">{annual}</Text>
                </Stack>
              ))}
            </Grid>
            <Text size="small" tone="secondary" style={{ marginTop: 8 }}>Always ask for the current maintenance rate in writing before making an offer. Some societies raise rates 10–15% annually. Check last 3 years of AGM minutes for trend.</Text>
          </CardBody>
        </Card>
      </Stack>

      <Divider />

      {/* ── society age bands ── */}
      <Stack gap={14}>
        <Row gap={8} align="center" wrap>
          <H2>Society Age — What It Means for You</H2>
          <Row gap={6}>
            {ageBands.map((ab, i) => (
              <Pill
                key={i}
                active={activeAge === i}
                tone={ab.tone === 'success' ? 'success' : 'warning'}
                onClick={() => setActiveAge(i)}
              >
                {ab.range}
              </Pill>
            ))}
          </Row>
        </Row>

        <Grid columns={4} gap={14}>
          <Stat value={ab.range} label="Project Age" />
          <Stat value={ab.management} label="Typically Managed By" tone={ab.tone} />
          <Stat value={ab.pros.length} label="Advantages" tone="success" />
          <Stat value={ab.cons.length} label="Watch-Outs" tone="warning" />
        </Grid>

        <Grid columns={2} gap={14}>
          <Card>
            <CardHeader trailing={<Pill label="Pros" tone="success" size="sm" />}>Why This Age Works</CardHeader>
            <CardBody>
              <Stack gap={5}>
                {ab.pros.map((p, i) => (
                  <Row key={i} gap={6} align="start">
                    <Text size="small" tone="secondary" style={{ minWidth: 12 }}>+</Text>
                    <Text size="small">{p}</Text>
                  </Row>
                ))}
              </Stack>
            </CardBody>
          </Card>
          <Card>
            <CardHeader trailing={<Pill label="Cons" tone="warning" size="sm" />}>Watch Out For</CardHeader>
            <CardBody>
              <Stack gap={5}>
                {ab.cons.map((c, i) => (
                  <Row key={i} gap={6} align="start">
                    <Text size="small" tone="secondary" style={{ minWidth: 12 }}>−</Text>
                    <Text size="small">{c}</Text>
                  </Row>
                ))}
                <Row gap={6} align="start" style={{ marginTop: 8 }}>
                  <Pill label="Verdict" size="sm" tone={ab.tone} />
                  <Text size="small">{ab.verdict}</Text>
                </Row>
              </Stack>
            </CardBody>
          </Card>
        </Grid>
      </Stack>

      <Divider />

      {/* ── sinking fund ── */}
      <Stack gap={12}>
        <H2>The Sinking Fund — The Most Overlooked Check</H2>
        <Text tone="secondary" size="small">
          Every society should maintain a sinking fund (also called corpus fund) for capital expenditures — lift replacement, building repainting, waterproofing, road resurfacing. If this fund is depleted, expect special assessments (one-time large collections from all flat owners).
        </Text>
        <Grid columns={3} gap={14}>
          <Card>
            <CardHeader trailing={<Pill label="Ask for this" tone="warning" size="sm" />}>What to Request</CardHeader>
            <CardBody>
              <Stack gap={5}>
                {[
                  'Current sinking fund balance',
                  'Last 3 years of audited accounts',
                  'Any pending capital works / major repairs',
                  'Any outstanding loans taken by society',
                  'Special assessment history (one-time collections)',
                ].map((item, i) => (
                  <Row key={i} gap={6} align="start">
                    <Text size="small" tone="secondary" style={{ minWidth: 14 }}>{i + 1}.</Text>
                    <Text size="small">{item}</Text>
                  </Row>
                ))}
              </Stack>
            </CardBody>
          </Card>
          <Card>
            <CardHeader trailing={<Pill label="Benchmark" tone="info" size="sm" />}>Healthy Sinking Fund</CardHeader>
            <CardBody>
              <Stack gap={6}>
                <Text size="small">A healthy sinking fund = minimum 1–2 years of total society maintenance collections.</Text>
                <Text size="small" tone="secondary">Example: 200 flats × ₹8,000/mo average = ₹16L/month = ₹1.92 Cr/year. Healthy corpus = ₹2–4 Cr minimum.</Text>
                <Text size="small" tone="secondary">Also check: is the corpus in FDs or current account? FDs = disciplined management.</Text>
              </Stack>
            </CardBody>
          </Card>
          <Card>
            <CardHeader trailing={<Pill label="Red flag" tone="warning" size="sm" />}>Signs of Poor Management</CardHeader>
            <CardBody>
              <Stack gap={5}>
                {[
                  'Sinking fund near zero or depleted',
                  'Audited accounts not shared with residents',
                  'Multiple special assessments in past 3 years',
                  'Society has taken loans',
                  'RWA refuses to share financial statements',
                ].map((flag, i) => (
                  <Row key={i} gap={6} align="start">
                    <Text size="small" tone="secondary" style={{ minWidth: 12 }}>−</Text>
                    <Text size="small">{flag}</Text>
                  </Row>
                ))}
              </Stack>
            </CardBody>
          </Card>
        </Grid>
      </Stack>

      <Divider />

      {/* ── water supply ── */}
      <Stack gap={12}>
        <H2>Water Supply — Bangalore's Biggest Society Pain Point</H2>
        <Text tone="secondary" size="small">
          Bangalore has severe water supply issues. How a society manages water directly impacts daily quality of life. This must be verified before buying.
        </Text>
        <Table
          headers={['Water Source', 'Reliability', 'Cost', 'What to Verify']}
          rows={[
            ['BWSSB piped supply', 'Moderate — 2–3 hours/day in most areas', 'Low (₹50–150/month)', 'Is the society on the BWSSB network? Check water schedule.'],
            ['Borewell (own)', 'Good — 24/7 if maintained', 'Low operational cost', 'Water table depth, TDS level, last borewell test date'],
            ['Borewell + STP recycling', 'Best — treated water for flushing/gardens', 'Medium (STP maintenance)', 'Is the STP functional? Many societies have non-functional STPs.'],
            ['Tanker water dependency', 'Poor — supply unreliable, costly', '₹5,000–15,000/mo extra', 'Red flag. Avoid if sole water source. Temporary use is fine.'],
          ]}
          rowTone={['warning', 'success', 'success', 'danger']}
          striped
        />

        <Card>
          <CardHeader trailing={<Pill label="Verify in person" tone="success" size="sm" />}>Water Questions to Ask Residents</CardHeader>
          <CardBody>
            <Grid columns={2} gap={12}>
              {[
                'Do you ever run out of water? How often?',
                'Is water available 24/7 or only certain hours?',
                'Has the society ever needed to call water tankers in summer?',
                'What is the TDS of borewell water? (above 500 = hard water, damages appliances)',
                'Is there a water softener / purifier system at the building level?',
                'How is water distributed — overhead tank or pressure pump?',
              ].map((q, i) => (
                <Row key={i} gap={6} align="start">
                  <Text size="small" tone="secondary" style={{ minWidth: 14 }}>{i + 1}.</Text>
                  <Text size="small">{q}</Text>
                </Row>
              ))}
            </Grid>
          </CardBody>
        </Card>
      </Stack>

      <Divider />

      {/* ── tenant vs owner ratio ── */}
      <Stack gap={12}>
        <H2>Owner vs Tenant Ratio — Why It Matters</H2>
        <Grid columns={3} gap={14}>
          <Card>
            <CardHeader trailing={<Pill label="Ideal" tone="success" size="sm" />}>
              60%+ Owner-Occupied
            </CardHeader>
            <CardBody>
              <Stack gap={5}>
                <Text size="small">Owners care about maintenance, society rules, long-term upkeep. High owner ratio = strong, engaged RWA and well-maintained society.</Text>
                <Text size="small" tone="secondary">Best for: resale value, community, enforcement of society rules.</Text>
              </Stack>
            </CardBody>
          </Card>
          <Card>
            <CardHeader trailing={<Pill label="Acceptable" tone="neutral" size="sm" />}>
              40–60% Owner-Occupied
            </CardHeader>
            <CardBody>
              <Stack gap={5}>
                <Text size="small">Mixed. RWA still functional but some maintenance apathy from absentee landlords. Common in IT corridor societies with high rental demand.</Text>
                <Text size="small" tone="secondary">Check: are absentee owner flats well-maintained? Is security strict with tenants?</Text>
              </Stack>
            </CardBody>
          </Card>
          <Card>
            <CardHeader trailing={<Pill label="Caution" tone="warning" size="sm" />}>
              Below 40% Owner-Occupied
            </CardHeader>
            <CardBody>
              <Stack gap={5}>
                <Text size="small">High tenant proportion = lower RWA participation, noise issues, high turnover, maintenance complaints pile up. Society rules enforced poorly.</Text>
                <Text size="small" tone="secondary">Affects resale: buyers know the society culture. Can suppress value.</Text>
              </Stack>
            </CardBody>
          </Card>
        </Grid>
      </Stack>

      <Divider />

      {/* ── RWA quality ── */}
      <Stack gap={12}>
        <H2>How to Assess RWA Quality Before Buying</H2>
        <Grid columns={2} gap={14}>
          <Card>
            <CardHeader trailing={<Pill label="Research from outside" size="sm" />}>Before Your Visit</CardHeader>
            <CardBody>
              <Stack gap={5}>
                {[
                  ['Google "society name + residents group"', 'Facebook/WhatsApp group activity level shows RWA engagement'],
                  ['Search Google Maps reviews', 'Filter 1–2 star reviews — what are residents frustrated about?'],
                  ['Reddit r/bangalore', 'Search society name — candid community opinions'],
                  ['Housing.com / ApartmentADDA reviews', 'Check specific maintenance-related complaints'],
                  ['Ask broker for RWA contact', 'A good RWA will happily share AGM minutes and financials'],
                ].map(([action, detail]) => (
                  <Stack key={action} gap={1}>
                    <Text size="small" weight="semibold">{action}</Text>
                    <Text size="small" tone="secondary">{detail}</Text>
                  </Stack>
                ))}
              </Stack>
            </CardBody>
          </Card>

          <Card>
            <CardHeader trailing={<Pill label="During site visit" tone="success" size="sm" />}>Questions to Ask Residents</CardHeader>
            <CardBody>
              <Stack gap={5}>
                {[
                  'How quickly does the RWA respond to maintenance complaints?',
                  'Has there been any special assessment in the last 3 years?',
                  'Is there a pending legal case within the society?',
                  'How often are AGMs held? Is attendance good?',
                  'Is the society on ApartmentADDA / MyGate? (professional management tool = good sign)',
                  'How is noise / party management handled?',
                  'What\'s the pet policy? (relevant to you or future tenants)',
                  'Have maintenance charges been raised recently? By how much?',
                ].map((q, i) => (
                  <Row key={i} gap={6} align="start">
                    <Text size="small" tone="secondary" style={{ minWidth: 14 }}>{i + 1}.</Text>
                    <Text size="small">{q}</Text>
                  </Row>
                ))}
              </Stack>
            </CardBody>
          </Card>
        </Grid>
      </Stack>

      <Divider />

      {/* ── green flags & red flags ── */}
      <Stack gap={12}>
        <H2>Green Flags vs Red Flags in Society Management</H2>
        <Grid columns={2} gap={14}>
          <Stack gap={8}>
            <H3>Green Flags — Buy With Confidence</H3>
            <Table
              headers={['Signal', 'Why It Matters']}
              rows={[
                ['MyGate / ApartmentADDA app in use', 'Professional digital management — transparent, auditable'],
                ['AGM held annually, minutes shared', 'Active democracy — residents in control'],
                ['Audited accounts available on request', 'Financial transparency, no hiding of mismanagement'],
                ['Sinking fund > 1yr maintenance corpus', 'Capital works won\'t hit you with surprise bills'],
                ['BWSSB + borewell dual supply', 'Water security — no tanker dependency'],
                ['Responsive WhatsApp group (RWA active)', 'Fast complaint resolution, engaged committee'],
                ['Recent common area upgrades', 'Active maintenance culture, not letting things decay'],
              ]}
              rowTone={Array(7).fill('success')}
              striped
            />
          </Stack>
          <Stack gap={8}>
            <H3>Red Flags — Investigate or Avoid</H3>
            <Table
              headers={['Signal', 'Why It\'s a Problem']}
              rows={[
                ['RWA won\'t share accounts or AGM minutes', 'Hiding financial mismanagement'],
                ['Multiple special assessments in 3 years', 'Depleted corpus, poor planning'],
                ['Ongoing litigation between residents / builder', 'Legal entanglement — affects resale'],
                ['Tanker water dependency in summer', 'Infrastructure failure, costly, unreliable'],
                ['Lifts frequently out of service', 'Poor maintenance contracts, RWA not functional'],
                ['No security on all shifts (gaps at night)', 'Safety risk for sole occupant'],
                ['Maintenance charges raised 20%+ annually', 'Financial mismanagement or amenity overload'],
              ]}
              rowTone={Array(7).fill('danger')}
              striped
            />
          </Stack>
        </Grid>
      </Stack>

      <Divider />

      <Stack gap={10}>
        <H2>Society Checklist — Before Making an Offer</H2>
        <Table
          headers={['Check', 'How to Verify', 'Priority']}
          rows={[
            ['Current maintenance rate (per sqft)', 'Ask seller + cross-check with RWA', 'Critical'],
            ['Last 3 years of audited accounts', 'Request from RWA directly', 'Critical'],
            ['Sinking fund balance', 'Ask RWA for balance sheet', 'Critical'],
            ['Water source & reliability', 'Talk to 3+ residents, visit morning/evening', 'Critical'],
            ['Society age & RWA status', 'Check registration date + RERA', 'High'],
            ['Owner vs tenant ratio (estimate)', 'Ask RWA or count cars/name plates', 'High'],
            ['Pending legal cases', 'Ask RWA, search court records', 'High'],
            ['Maintenance charge trend (3yr)', 'Ask for AGM minutes showing past resolutions', 'High'],
            ['DG backup scope (all points?)', 'Test during your visit — ask to switch off mains', 'Critical'],
            ['Internet ISPs available', 'Check active connections in building', 'High'],
          ]}
          rowTone={['danger', 'danger', 'danger', 'danger', 'warning', 'warning', 'warning', 'warning', 'danger', 'warning']}
          striped
        />
      </Stack>

    </Stack>
  );
}
