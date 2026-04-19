import {
  BarChart,
  Card, CardBody, CardHeader,
  Divider, Grid, H1, H2, H3,
  Pill, Row, Stack, Stat, Table, Text,
  useCanvasState,
} from 'cursor/canvas';

// ── builder data ───────────────────────────────────────────────────────────

type BuilderKey = 'sobha' | 'prestige' | 'brigade' | 'puravankara' | 'sattva' | 'tata' | 'provident' | 'shriram' | 'totalEnv' | 'assetz';

interface BuilderScore {
  reraCompliance: number;
  deliveryRecord: number;
  constructionQuality: number;
  financialStability: number;
  afterSales: number;
  valueForMoney: number;
}

interface Builder {
  label: string;
  tier: 1 | 2 | 3;
  priceRange: string;
  active: boolean; // active in Yelahanka / North BLR
  listed: boolean; // publicly listed = more financial transparency
  scores: BuilderScore;
  total: number;
  summary: string;
  yelahankaPick: string;
  watchOut: string;
  tone: 'success' | 'warning' | 'info';
}

const builders: Record<BuilderKey, Builder> = {
  sobha: {
    label: 'Sobha Ltd',
    tier: 1,
    priceRange: '₹8,500–12,000/sqft',
    active: true,
    listed: true,
    scores: { reraCompliance: 9, deliveryRecord: 9, constructionQuality: 10, financialStability: 9, afterSales: 8, valueForMoney: 6 },
    total: 51,
    summary: 'Best construction quality in Bangalore — no debate. Backward-integrated (makes their own concrete, steel, interiors). Delivers on time more consistently than peers. Premium pricing means fewer options at ₹3 Cr but resale value holds exceptionally well.',
    yelahankaPick: 'Sobha Neopolis (Panathur), Sobha Hartland — check their North BLR launches. Older completed Sobha projects in Yelahanka area for RTM.',
    watchOut: 'Price premium is real. Loading factor tends to be higher (28–32%) in older projects.',
    tone: 'success',
  },
  prestige: {
    label: 'Prestige Group',
    tier: 1,
    priceRange: '₹7,500–11,000/sqft',
    active: true,
    listed: true,
    scores: { reraCompliance: 8, deliveryRecord: 8, constructionQuality: 8, financialStability: 9, afterSales: 7, valueForMoney: 7 },
    total: 47,
    summary: 'Largest residential developer in South India. Good quality, decent delivery track record. Yelahanka has several Prestige projects. Brand name provides strong resale liquidity. Some complaints on delayed project completion in post-COVID period.',
    yelahankaPick: 'Prestige Finsbury Park (Yelahanka) — completed, check RTM availability. One of the most researched projects in the area.',
    watchOut: 'Post-COVID some projects ran 6–12 months late. Maintenance of older societies sometimes below expectation.',
    tone: 'success',
  },
  brigade: {
    label: 'Brigade Group',
    tier: 1,
    priceRange: '₹7,500–10,500/sqft',
    active: true,
    listed: true,
    scores: { reraCompliance: 8, deliveryRecord: 8, constructionQuality: 8, financialStability: 8, afterSales: 7, valueForMoney: 7 },
    total: 46,
    summary: 'Reputed Bangalore developer with strong brand. Steady quality, good financials (listed). Brigade Orchards in Devanahalli is their flagship township. Limited Yelahanka-specific projects but brand reliability is solid.',
    yelahankaPick: 'Brigade Cornerstone Utopia (Yelahanka) and Brigade Atmosphere — check RTM resale units.',
    watchOut: 'Sales teams can be aggressive. Get everything in writing — verbal promises mean nothing.',
    tone: 'success',
  },
  puravankara: {
    label: 'Puravankara',
    tier: 1,
    priceRange: '₹7,000–9,500/sqft',
    active: true,
    listed: true,
    scores: { reraCompliance: 8, deliveryRecord: 8, constructionQuality: 8, financialStability: 7, afterSales: 7, valueForMoney: 8 },
    total: 46,
    summary: 'NSE-listed (2007), 50+ yr track record, 85M+ sqft delivered. Tier 1 quality at Tier 2 prices — strong value proposition. BluNex smart-home tech is a differentiator. Purva Zenium 2 (Hosahalli) is shortlisted: earliest Grade A possession (Jun 2027) in our search. After-sales rated good by residents.',
    yelahankaPick: 'Purva Zenium 2 (Hosahalli, Jun 2027) — ✅ SHORTLISTED for visit. Purva Atmosphere resale for RTM option.',
    watchOut: 'After-sales support can be inconsistent across projects. Verify maintenance quality for specific society before committing.',
    tone: 'success',
  },
  sattva: {
    label: 'Salarpuria Sattva',
    tier: 1,
    priceRange: '₹6,500–9,000/sqft',
    active: true,
    listed: true,
    scores: { reraCompliance: 8, deliveryRecord: 7, constructionQuality: 8, financialStability: 8, afterSales: 7, valueForMoney: 9 },
    total: 47,
    summary: 'NSE-listed, large Bangalore portfolio across residential and commercial. Strong financial backing, good RERA compliance record. Sattva Lumina (Rajanukunte) is shortlisted: best ₹/sqft on our list at ₹1.52–1.75 Cr for 1,450–1,780 sqft SBA. 12.8-acre township with 3 clubhouses.',
    yelahankaPick: 'Sattva Lumina (Rajanukunte/Yelahanka, Nov 2029) — ✅ SHORTLISTED for visit. Best value per sqft in Grade A segment.',
    watchOut: 'Possession Nov 2029 — longest wait on the list. Some older Sattva projects had 6–9 month delays. Verify RERA construction % before committing.',
    tone: 'success',
  },
  tata: {
    label: 'Tata Housing',
    tier: 1,
    priceRange: '₹6,000–8,500/sqft',
    active: true,
    listed: false,
    scores: { reraCompliance: 10, deliveryRecord: 9, constructionQuality: 9, financialStability: 10, afterSales: 8, valueForMoney: 8 },
    total: 54,
    summary: 'Highest-trust brand in Indian real estate. Never defaulted, never declared insolvency, never abandoned a project. Tata Varnam (Devanahalli) is shortlisted: 70 acres within 135-acre Carnatica township, best sqft value per rupee on the list (₹1.55 Cr for 1,681 sqft). Parent Tata Group provides unlimited financial backing.',
    yelahankaPick: 'Tata Varnam (Shettigere/Devanahalli, Dec 2029) — ✅ SHORTLISTED for visit. Top pick on builder trust; verify commute before committing.',
    watchOut: 'Devanahalli location adds ~10 min commute vs Yelahanka. Verify you are comfortable with the daily drive before committing. Not publicly listed as standalone entity but Tata Group backing eliminates financial risk.',
    tone: 'success',
  },
  provident: {
    label: 'Provident Housing (Puravankara subsidiary)',
    tier: 2,
    priceRange: '₹5,500–7,500/sqft',
    active: true,
    listed: false,
    scores: { reraCompliance: 7, deliveryRecord: 7, constructionQuality: 7, financialStability: 7, afterSales: 6, valueForMoney: 9 },
    total: 43,
    summary: 'Best value-for-money among Tier 2 builders. Targets the ₹50L–1.5 Cr segment primarily. In Yelahanka they\'ve launched projects under ₹3 Cr with decent quality. Parent company (Puravankara) backing adds financial credibility.',
    yelahankaPick: 'Provident Park Square (Yelahanka), Provident Capella — check for 3 BHK availability in budget.',
    watchOut: 'Amenity quality and finishing sometimes below Prestige/Sobha standard. Check actual unit finishing before committing.',
    tone: 'info',
  },
  shriram: {
    label: 'Shriram Properties',
    tier: 2,
    priceRange: '₹5,800–8,000/sqft',
    active: true,
    listed: true,
    scores: { reraCompliance: 7, deliveryRecord: 7, constructionQuality: 7, financialStability: 6, afterSales: 6, valueForMoney: 8 },
    total: 41,
    summary: 'Reliable South India developer. Good RERA compliance record. Has faced some financial stress historically but has stabilised. Projects tend to have good layouts and reasonable quality for the price.',
    yelahankaPick: 'Shriram Chirping Woods, Shriram 107 (Yelahanka) — check RTM availability. Popular with mid-segment buyers.',
    watchOut: 'Financial history has some rough patches — verify current RERA status and that project is 100% completed and OC obtained before buying.',
    tone: 'info',
  },
  totalEnv: {
    label: 'Total Environment',
    tier: 2,
    priceRange: '₹8,000–13,000/sqft',
    active: false,
    listed: false,
    scores: { reraCompliance: 8, deliveryRecord: 6, constructionQuality: 9, financialStability: 6, afterSales: 7, valueForMoney: 5 },
    total: 41,
    summary: 'Boutique eco-focused developer. Exceptional design and green architecture — highly unique. Appeals to specific buyers. Tends to run significantly over schedule. Very premium pricing. Limited North BLR projects.',
    yelahankaPick: 'Primarily Sarjapur Road and Whitefield. Limited Yelahanka presence.',
    watchOut: 'Known for very significant delays (2–3+ years over schedule). Only buy completed RTM. Never under-construction from Total Environment.',
    tone: 'warning',
  },
  assetz: {
    label: 'Assetz Property Group',
    tier: 2,
    priceRange: '₹6,500–9,000/sqft',
    active: true,
    listed: false,
    scores: { reraCompliance: 7, deliveryRecord: 7, constructionQuality: 7, financialStability: 6, afterSales: 6, valueForMoney: 8 },
    total: 41,
    summary: 'Design-forward developer with good reputation. Growing presence in North BLR. Has delivered some well-received projects. Not listed so financial transparency is limited — verify funding status for any UC project.',
    yelahankaPick: 'Assetz Marq, Assetz 63 Degree East — check availability in Yelahanka vicinity.',
    watchOut: 'Not publicly listed — less financial transparency. For any UC project, verify bank escrow account and construction-linked payment plan.',
    tone: 'info',
  },
};

const SCORE_FACTORS: [keyof BuilderScore, string][] = [
  ['reraCompliance', 'RERA Compliance'],
  ['deliveryRecord', 'On-Time Delivery'],
  ['constructionQuality', 'Construction Quality'],
  ['financialStability', 'Financial Stability'],
  ['afterSales', 'After-Sales Service'],
  ['valueForMoney', 'Value for Money'],
];

type BuilderKey2 = BuilderKey;

export default function BuilderReputation() {
  const [active, setActive] = useCanvasState<BuilderKey2>('builder', 'prestige');
  const b = builders[active as BuilderKey2];
  const keys = Object.keys(builders) as BuilderKey2[];

  return (
    <Stack gap={28} style={{ padding: '24px 28px', maxWidth: 960 }}>

      <Stack gap={4}>
        <H1>Builder Reputation</H1>
        <Text tone="secondary">North Bangalore · Under Construction · Grade A only · ₹3 Cr budget</Text>
      </Stack>

      <Grid columns={4} gap={14}>
        <Stat value="Tata" label="Highest Trust / Zero Default" tone="success" />
        <Stat value="Sobha" label="Best Construction Quality" tone="success" />
        <Stat value="Sattva" label="Best ₹/sqft on Shortlist" tone="info" />
        <Stat value="UC — Grade A only" label="Your Filter" tone="warning" />
      </Grid>

      <Card>
        <CardHeader trailing={<Pill tone="warning" size="sm">UC strategy — builder trust is everything</Pill>}>
          Why We Filter to Grade A Only for Under-Construction
        </CardHeader>
        <CardBody>
          <Grid columns={2} gap={14}>
            <Stack gap={5}>
              <Text size="small" weight="semibold">UC risks you cannot see upfront</Text>
              {['Will they deliver on time?', 'Will they run out of money mid-project?', 'Will construction quality match the brochure?', 'Will RERA commitments be honoured?', 'Will the penalty clause protect you if delayed?'].map(r => (
                <Row key={r} gap={6}><Text size="small" tone="secondary" style={{ minWidth: 12 }}>−</Text><Text size="small" tone="secondary">{r}</Text></Row>
              ))}
            </Stack>
            <Stack gap={5}>
              <Text size="small" weight="semibold">Why Grade A + NSE-listed filters protect you</Text>
              {['Public financials — audited, harder to hide cash flow stress', 'RERA penalties hit brand value — strong incentive to comply', 'Institutional funding (banks, HDFC, SBI) — not dependent on sales cash alone', 'Board governance — not a single-promoter personal project', 'Brand resale premium — buyers pay more for known names'].map(r => (
                <Row key={r} gap={6}><Text size="small" tone="secondary" style={{ minWidth: 12 }}>+</Text><Text size="small" tone="secondary">{r}</Text></Row>
              ))}
            </Stack>
          </Grid>
          <Text size="small" tone="secondary" style={{ marginTop: 12 }}>For UC, builder grade is the single most important filter. All 5 shortlisted properties are from NSE-listed Grade A builders: Puravankara, Prestige, Salarpuria Sattva, Brigade, Tata Housing.</Text>
        </CardBody>
      </Card>

      <Divider />

      {/* ── overview table ── */}
      <Stack gap={12}>
        <H2>Builder Scorecard — Active in Yelahanka / North BLR</H2>
        <Table
          headers={['Builder', 'Tier', 'Price/sqft', 'Listed', 'Score /60', 'Yelahanka Active', 'Verdict']}
          rows={keys.map(k => [
            builders[k].label,
            `Tier ${builders[k].tier}`,
            builders[k].priceRange,
            builders[k].listed ? 'Yes' : 'No',
            `${builders[k].total}/60`,
            builders[k].active ? 'Yes' : 'Limited',
            builders[k].total >= 46 ? 'Top pick' : builders[k].total >= 42 ? 'Solid choice' : 'Verify carefully',
          ])}
          rowTone={keys.map(k =>
            builders[k].total >= 46 ? 'success' :
            builders[k].total >= 42 ? undefined :
            'warning'
          )}
          striped
        />
      </Stack>

      <Divider />

      {/* ── comparison chart ── */}
      <Stack gap={12}>
        <H2>Quality vs Value — Where Each Builder Sits</H2>
        <BarChart
          categories={keys.map(k => builders[k].label.split(' ')[0])}
          series={[
            { name: 'Construction Quality', data: keys.map(k => builders[k].scores.constructionQuality) },
            { name: 'Value for Money', data: keys.map(k => builders[k].scores.valueForMoney) },
            { name: 'Delivery Record', data: keys.map(k => builders[k].scores.deliveryRecord) },
          ]}
          height={280}
        />
        <Text size="small" tone="secondary">
          Sobha wins on quality but loses on value. Provident/Assetz win on value but are less premium. Prestige and Brigade are balanced — and their brand name drives resale liquidity.
        </Text>
      </Stack>

      <Divider />

      {/* ── deep dive ── */}
      <Stack gap={14}>
        <Row gap={8} align="center" wrap>
          <H2>Builder Deep Dive</H2>
          <Row gap={6} wrap>
            {keys.map(k => (
              <Pill
                key={k}
                active={active === k}
                tone={builders[k].total >= 46 ? 'success' : builders[k].total >= 42 ? 'neutral' : 'warning'}
                onClick={() => setActive(k)}
              >
                {builders[k].label.split(' ')[0]}
              </Pill>
            ))}
          </Row>
        </Row>

        <Grid columns={4} gap={14}>
          <Stat value={`${b.total}/60`} label="Overall Score" tone={b.total >= 46 ? 'success' : b.total >= 42 ? undefined : 'warning'} />
          <Stat value={`Tier ${b.tier}`} label="Builder Tier" tone={b.tier === 1 ? 'success' : b.tier === 2 ? undefined : 'warning'} />
          <Stat value={b.listed ? 'Listed' : 'Unlisted'} label="Financial Transparency" tone={b.listed ? 'success' : 'warning'} />
          <Stat value={b.active ? 'Active' : 'Limited'} label="Yelahanka Presence" tone={b.active ? 'success' : 'warning'} />
        </Grid>

        <Grid columns={2} gap={14}>
          <Stack gap={8}>
            <H3>Score Breakdown</H3>
            <BarChart
              categories={SCORE_FACTORS.map(([, l]) => l)}
              series={[{ name: b.label, data: SCORE_FACTORS.map(([k]) => b.scores[k]) }]}
              horizontal
              height={240}
            />
          </Stack>

          <Stack gap={14}>
            <Card>
              <CardHeader trailing={<Pill tone={b.tone} size="sm">{b.tone === 'success' ? 'Recommended' : b.tone === 'warning' ? 'Caution' : 'Solid choice'}</Pill>}>
                {b.label}
              </CardHeader>
              <CardBody>
                <Stack gap={8}>
                  <Text size="small">{b.summary}</Text>
                  <Divider />
                  <Text size="small" weight="semibold">Yelahanka / North BLR Projects</Text>
                  <Text size="small" tone="secondary">{b.yelahankaPick}</Text>
                  <Divider />
                  <Row gap={6} align="start">
                    <Pill tone="warning" size="sm">Watch out</Pill>
                    <Text size="small" tone="secondary">{b.watchOut}</Text>
                  </Row>
                </Stack>
              </CardBody>
            </Card>
          </Stack>
        </Grid>
      </Stack>

      <Divider />

      {/* ── how to verify any builder ── */}
      <Stack gap={12}>
        <H2>How to Verify Any Builder — Step by Step</H2>
        <Grid columns={2} gap={14}>
          <Stack gap={14}>
            <Card>
              <CardHeader trailing={<Pill size="sm">Step 1</Pill>}>
                RERA Verification (krera.karnataka.gov.in)
              </CardHeader>
              <CardBody>
                <Stack gap={5}>
                  {[
                    ['Search by promoter name', 'See all their registered projects in Karnataka'],
                    ['Check project status', '"Completed" = OC filed. "Under Construction" = ongoing'],
                    ['Read complaints tab', 'See how many homebuyers have filed complaints against them and outcomes'],
                    ['Check penalty orders', 'Any KRERA penalty = serious red flag'],
                    ['Verify this specific project', 'Confirm RERA number on all marketing material matches KRERA records'],
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
              <CardHeader trailing={<Pill size="sm">Step 2</Pill>}>
                Financial Health Check
              </CardHeader>
              <CardBody>
                <Stack gap={5}>
                  {[
                    ['For listed companies', 'Check BSE/NSE filings, annual report, debt-to-equity ratio'],
                    ['Search for NCLT cases', 'site:nclt.gov.in "[Builder Name]" — any insolvency proceedings?'],
                    ['Consumer court orders', 'NCDRC database — consumer complaints and outcomes'],
                    ['News search', 'Google "[Builder Name] delay" or "[Builder Name] fraud" — filter last 2 years'],
                    ['Unlisted builders', 'Ask for audited P&L, escrow account details for UC projects'],
                  ].map(([action, detail]) => (
                    <Stack key={action} gap={1}>
                      <Text size="small" weight="semibold">{action}</Text>
                      <Text size="small" tone="secondary">{detail}</Text>
                    </Stack>
                  ))}
                </Stack>
              </CardBody>
            </Card>
          </Stack>

          <Stack gap={14}>
            <Card>
              <CardHeader trailing={<Pill tone="success" size="sm">Step 3 — Most Powerful</Pill>}>
                Talk to Residents of Completed Projects
              </CardHeader>
              <CardBody>
                <Stack gap={6}>
                  <Text size="small">The single best research you can do. Visit 2–3 completed societies by the builder you're considering. Don't just walk in — sit in the lobby or parking, and talk to residents directly.</Text>
                  <Text size="small" weight="semibold">Questions to ask:</Text>
                  <Stack gap={4}>
                    {[
                      'Was possession on time or delayed? By how long?',
                      'Were there major construction defects at handover?',
                      'How responsive was the builder to defect rectification?',
                      'Is the society self-managed now or still builder-managed?',
                      'Any structural issues (seepage, cracks, lift failures)?',
                      'Would you buy from this builder again?',
                    ].map((q, i) => (
                      <Row key={i} gap={6} align="start">
                        <Text size="small" tone="secondary" style={{ minWidth: 14 }}>{i + 1}.</Text>
                        <Text size="small">{q}</Text>
                      </Row>
                    ))}
                  </Stack>
                </Stack>
              </CardBody>
            </Card>

            <Card>
              <CardHeader trailing={<Pill size="sm">Step 4</Pill>}>
                Online Community Research
              </CardHeader>
              <CardBody>
                <Stack gap={5}>
                  {[
                    ['Housing.com / MagicBricks reviews', 'Filter 1–3 star reviews — what complaints repeat?'],
                    ['Facebook groups', '"[Project Name] Residents Group" — direct unfiltered feedback'],
                    ['Google Maps reviews', 'Search the specific society name — read 1-star reviews carefully'],
                    ['Reddit r/bangalore', 'Search builder name — community is brutally honest'],
                    ['NoBroker forums', 'Property-specific threads with buyer experiences'],
                  ].map(([source, tip]) => (
                    <Stack key={source} gap={1}>
                      <Text size="small" weight="semibold">{source}</Text>
                      <Text size="small" tone="secondary">{tip}</Text>
                    </Stack>
                  ))}
                </Stack>
              </CardBody>
            </Card>
          </Stack>
        </Grid>
      </Stack>

      <Divider />

      {/* ── construction quality inspection ── */}
      <Stack gap={12}>
        <H2>Construction Quality — What to Check On-Site (RTM)</H2>
        <Text tone="secondary" size="small">
          For a ready-to-move flat, you can inspect everything before paying. Do this yourself AND with a structural engineer (₹3–5K for 2 hours, worth every rupee).
        </Text>
        <Grid columns={3} gap={14}>
          <Card>
            <CardHeader trailing={<Pill size="sm">Walls &amp; Structure</Pill>}>Structural</CardHeader>
            <CardBody>
              <Stack gap={4}>
                {[
                  'Tap walls — hollow sound = poor concrete',
                  'Check for hairline cracks at beam-column joints',
                  'Seepage stains on walls / ceiling',
                  'Floor level with spirit level — should not slope',
                  'Terrace/roof — check for water pooling areas',
                  'Basement / parking — any seepage or cracks',
                ].map((c, i) => (
                  <Text key={i} size="small">{c}</Text>
                ))}
              </Stack>
            </CardBody>
          </Card>
          <Card>
            <CardHeader trailing={<Pill size="sm">Plumbing &amp; Electrical</Pill>}>Services</CardHeader>
            <CardBody>
              <Stack gap={4}>
                {[
                  'Test every tap — water pressure on all floors',
                  'Flush all toilets — drainage speed and sound',
                  'Check under-sink for pipe joint leaks',
                  'Test every switch and socket',
                  'Check MCB panel — organised labelling',
                  'Verify DG backup coverage (full flat or just lights?)',
                  'Internet duct — fiber conduit visible?',
                ].map((c, i) => (
                  <Text key={i} size="small">{c}</Text>
                ))}
              </Stack>
            </CardBody>
          </Card>
          <Card>
            <CardHeader trailing={<Pill size="sm">Finishing &amp; Amenities</Pill>}>Quality</CardHeader>
            <CardBody>
              <Stack gap={4}>
                {[
                  'Door and window frames — no gaps, proper sealing',
                  'Tile alignment and grouting quality',
                  'Kitchen countertop — check for chips, even surface',
                  'Lift — cabin quality, door closing speed',
                  'Society gym / pool — actually functional?',
                  'Parking allocation — covered, clearly marked',
                  'Terrace / clubhouse — accessible and maintained',
                ].map((c, i) => (
                  <Text key={i} size="small">{c}</Text>
                ))}
              </Stack>
            </CardBody>
          </Card>
        </Grid>
      </Stack>

      <Divider />

      {/* ── red flags ── */}
      <Stack gap={12}>
        <H2>Builder Red Flags — Walk Away If You See These</H2>
        <Table
          headers={['Red Flag', 'What It Signals', 'Action']}
          rows={[
            ['KRERA complaints > 10 for a project', 'Pattern of broken promises — not isolated incidents', 'Reject the project'],
            ['Any KRERA penalty order', 'Builder has been legally penalised for violations', 'Reject unless penalty fully resolved'],
            ['NCLT insolvency proceedings', 'Builder under financial stress or insolvent', 'Immediate rejection'],
            ['Refuses to show OC for RTM', 'OC doesn\'t exist or is fake', 'Walk away immediately'],
            ['Pressures you to "book now, documents later"', 'Hiding something — legal issue or cash crunch', 'Walk away'],
            ['Oral promises not in writing', 'Car park, floor, facing, amenity — if not in agreement, it means nothing', 'Demand written confirmation of everything'],
            ['No residents association yet (old project)', 'Builder still controlling society = maintenance issues', 'Verify RWA status before buying'],
            ['Excessive loading factor (>33%)', 'Builder compensating for cheap land with inflated common area', 'Reject or renegotiate hard'],
          ]}
          rowTone={['danger', 'danger', 'danger', 'danger', 'danger', 'warning', 'warning', 'warning']}
          striped
        />
      </Stack>

      <Divider />

      <Stack gap={10}>
        <H2>Recommendation for Your Search</H2>
        <Table
          headers={['Priority', 'Builder', 'Why', 'Price Reality at ₹3 Cr']}
          rows={[
            ['1st', 'Prestige Group (RTM resale)', 'Best brand liquidity in Yelahanka, strong resale, Finsbury Park is well-regarded', '3 BHK RTM resale possible ₹1.8–2.4 Cr'],
            ['1st', 'Brigade Group (RTM resale)', 'Reliable quality, good society management track record, competitive', '3 BHK RTM resale possible ₹1.9–2.4 Cr'],
            ['2nd', 'Sobha (if available in budget)', 'Best quality — if you find a 3 BHK RTM resale within ₹3 Cr, take it', 'Spacious 3 BHK options available at ₹3 Cr; some 4 BHK'],
            ['2nd', 'Provident / Puravankara', 'Best new-build value, some UC options if RTM is preferred; 3 BHK achievable', '3 BHK ₹1.5–2.2 Cr range, good carpet area'],
            ['3rd', 'Assetz / Shriram', 'Solid but verify financial health and specific project RERA status first', '3 BHK ₹1.6–2.1 Cr, good layouts'],
            ['Skip', 'Unknown local developers', 'No brand accountability, hard to verify quality, poor resale liquidity', 'Not worth the risk at this budget'],
          ]}
          rowTone={['success', 'success', 'success', undefined, undefined, 'danger']}
          striped
        />
      </Stack>

    </Stack>
  );
}
