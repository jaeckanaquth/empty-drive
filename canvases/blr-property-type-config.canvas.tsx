import {
  BarChart,
  Card, CardBody, CardHeader,
  Divider, Grid, H1, H2, H3,
  Pill, Row, Stack, Stat, Table, Text,
  useCanvasState,
} from 'cursor/canvas';

// ── UC vs RTM scoring ──────────────────────────────────────────────────────

type Mode = 'uc' | 'rtm';

const comparison = {
  uc: {
    label: 'Under-Construction',
    price: '₹5,800–7,500/sqft (Yelahanka)',
    gst: '5% on agreement value',
    possession: '2–4 years from booking',
    loanDisbursement: 'In tranches as construction progresses',
    unitChoice: 'Full choice of floor, facing, unit',
    riskLevel: 'Medium-High',
    qualityVerification: 'Cannot see final product',
    priceUpside: 'Typically 15–20% cheaper than equivalent RTM',
    stampDuty: '5% + 10% cess + 1% reg on agreement value',
    tone: 'warning' as const,
    pros: [
      'Lower base price — 15–20% cheaper than RTM equivalent',
      'Best unit selection — first pick of floor, facing, corner units',
      'Can negotiate harder pre-launch or in early phases',
      'New construction = latest amenities, modern layout',
      'Appreciation during construction period (you gain on it)',
    ],
    cons: [
      'GST 5% on full value adds back much of the savings vs RTM',
      'Possession 2–4 years away — rent continues during this period',
      'Builder risk: delays are common (RERA helps but doesn\'t eliminate)',
      'Quality unknown until handover — depends entirely on builder',
      'Loan EMI starts from first disbursement, not possession',
    ],
    verdict: 'Good if reputed builder, RERA-registered, 50%+ sold (reduces abandonment risk), and you can wait 2–3 years.',
  },
  rtm: {
    label: 'Ready-to-Move',
    price: '₹7,000–9,500/sqft (Yelahanka)',
    gst: 'No GST (OC obtained = nil)',
    possession: 'Immediate (30–60 days after registration)',
    loanDisbursement: 'Full amount on registration',
    unitChoice: 'Limited to what\'s available in resale',
    riskLevel: 'Low',
    qualityVerification: 'See exactly what you buy',
    priceUpside: 'Higher sticker price but no GST saves ₹12.5L on ₹2.5 Cr',
    stampDuty: '5% + 10% cess + 1% reg',
    tone: 'success' as const,
    pros: [
      'No GST — saves ~5% (₹10–12L on ₹2–2.5 Cr property)',
      'See the flat, floor, view, light before buying',
      'Immediate possession — stop paying rent from day 1',
      'OC obtained = legally safe, bank loan straightforward',
      'Society already functioning — know what neighbours are like',
    ],
    cons: [
      'Higher base price per sqft vs UC',
      'Limited unit choice — get what\'s available',
      'Older projects may have dated interiors/amenities',
      'Maintenance cost starts immediately',
      'Some resale flats need renovation (factor ₹10–20L)',
    ],
    verdict: 'Recommended for this profile — no GST, immediate stop to rent, you can verify quality. Savings with ₹2.5 Cr corpus make waiting pointless.',
  },
};

// ── loading factor data ────────────────────────────────────────────────────

function carpetFromSBA(sba: number, loadingPct: number): number {
  return Math.round(sba * (1 - loadingPct / 100));
}

// ── floor guide ────────────────────────────────────────────────────────────

const floors = [
  { range: 'Ground / 1st', verdict: 'Avoid', tone: 'danger' as const, notes: 'Security risk for single adult, pests, less natural light, street noise' },
  { range: '2nd – 4th', verdict: 'Acceptable', tone: 'warning' as const, notes: 'Faster emergency exit, lower price, but limited view and light' },
  { range: '5th – 10th', verdict: 'Best', tone: 'success' as const, notes: 'Sweet spot — good light, ventilation, view, reasonable elevator wait' },
  { range: '11th – 15th', verdict: 'Good', tone: 'success' as const, notes: 'Better views, cleaner air, quieter. Minor premium. Elevator wait longer.' },
  { range: '16th +', verdict: 'Caution', tone: 'warning' as const, notes: 'Great views but heat in summer, elevator dependency, higher premium. Check power backup.' },
  { range: 'Top floor', verdict: 'Avoid', tone: 'danger' as const, notes: 'Heat in summer, water leakage risk in monsoon, can\'t build above' },
];

// ── WFH layout checklist ───────────────────────────────────────────────────

const wfhChecklist = [
  ['WFH room size', 'Min 140–160 sqft (fits L-desk, monitor stand, chair, storage)', 'Critical'],
  ['WFH room facing', 'North or East facing — natural light without afternoon glare', 'Critical'],
  ['Power backup', 'Full building DG backup or inverter provision for WFH room', 'Critical'],
  ['Internet infra', 'Fiber-ready building (Jio Fiber / ACT / Airtel FTH ducting)', 'Critical'],
  ['Acoustic isolation', 'WFH room not adjacent to elevator shaft or common corridor', 'High'],
  ['Ventilation', 'Window in WFH room — AC + cross ventilation option', 'High'],
  ['Separation from bedroom', 'WFH room not sharing wall with master BR — sleep quality', 'High'],
  ['Balcony', 'At least one large balcony — break space during WFH day', 'Medium'],
  ['Kitchen proximity', 'Open kitchen or easy access — you cook during WFH days', 'Medium'],
  ['Guest room separation', 'Guest BR on different end from WFH — privacy when hosting', 'Medium'],
];

export default function PropertyTypeConfig() {
  const [mode, setMode] = useCanvasState<Mode>('ucRtm', 'rtm');
  const [sba, setSba] = useCanvasState<number>('sba', 1800);
  const m = comparison[mode];

  const sbaOptions = [1500, 1600, 1700, 1800, 1900, 2000, 2100, 2200];
  const loadingScenarios = [
    { pct: 25, label: 'Excellent (25%)', tone: 'success' as const },
    { pct: 28, label: 'Good (28%)', tone: 'success' as const },
    { pct: 32, label: 'Average (32%)', tone: 'warning' as const },
    { pct: 36, label: 'Poor (36%)', tone: 'danger' as const },
    { pct: 40, label: 'Terrible (40%)', tone: 'danger' as const },
  ];

  return (
    <Stack gap={28} style={{ padding: '24px 28px', maxWidth: 960 }}>

      <Stack gap={4}>
        <H1>Property Type & Configuration</H1>
        <Text tone="secondary">Yelahanka · Single adult · WFH 3 days · ₹2.5 Cr</Text>
      </Stack>

      <Grid columns={4} gap={14}>
        <Stat value="RTM" label="Recommended Type" tone="success" />
        <Stat value="3 BHK" label="Optimal Configuration" tone="success" />
        <Stat value="5th–10th" label="Best Floor Range" tone="info" />
        <Stat value="N / E facing" label="Ideal Orientation" tone="info" />
      </Grid>

      <Divider />

      {/* ── UC vs RTM ── */}
      <Stack gap={14}>
        <Row gap={8} align="center">
          <H2>Under-Construction vs Ready-to-Move</H2>
          <Row gap={6}>
            <Pill active={mode === 'rtm'} tone="success" onClick={() => setMode('rtm')}>Ready-to-Move</Pill>
            <Pill active={mode === 'uc'} tone="warning" onClick={() => setMode('uc')}>Under-Construction</Pill>
          </Row>
        </Row>

        <Grid columns={4} gap={14}>
          <Stat value={m.riskLevel} label="Risk Level" tone={mode === 'uc' ? 'warning' : 'success'} />
          <Stat value={m.possession} label="Possession" tone={mode === 'rtm' ? 'success' : 'warning'} />
          <Stat value={m.gst} label="GST" tone={mode === 'rtm' ? 'success' : 'danger'} />
          <Stat value={mode === 'rtm' ? 'Immediate' : '2–4 years'} label="Rent saved from" tone={mode === 'rtm' ? 'success' : 'warning'} />
        </Grid>

        <Grid columns={2} gap={14}>
          <Card>
            <CardHeader trailing={<Pill tone={m.tone} size="sm">{mode === 'rtm' ? 'Recommended' : 'Consider carefully'}</Pill>}>
              {m.label}
            </CardHeader>
            <CardBody>
              <Stack gap={10}>
                <Table
                  headers={['Factor', 'Detail']}
                  rows={[
                    ['Price range (Yelahanka)', m.price],
                    ['GST', m.gst],
                    ['Possession', m.possession],
                    ['Loan disbursement', m.loanDisbursement],
                    ['Unit choice', m.unitChoice],
                    ['Quality check', m.qualityVerification],
                  ]}
                  striped
                />
                <Text size="small" tone="secondary">{m.verdict}</Text>
              </Stack>
            </CardBody>
          </Card>

          <Stack gap={14}>
            <Card>
              <CardHeader trailing={<Pill tone="success" size="sm">Pros</Pill>}>Why This Option Works</CardHeader>
              <CardBody>
                <Stack gap={5}>
                  {m.pros.map((p, i) => (
                    <Row key={i} gap={6} align="start">
                      <Text size="small" tone="secondary" style={{ minWidth: 12 }}>+</Text>
                      <Text size="small">{p}</Text>
                    </Row>
                  ))}
                </Stack>
              </CardBody>
            </Card>
            <Card>
              <CardHeader trailing={<Pill tone="warning" size="sm">Cons</Pill>}>Watch Out For</CardHeader>
              <CardBody>
                <Stack gap={5}>
                  {m.cons.map((c, i) => (
                    <Row key={i} gap={6} align="start">
                      <Text size="small" tone="secondary" style={{ minWidth: 12 }}>−</Text>
                      <Text size="small">{c}</Text>
                    </Row>
                  ))}
                </Stack>
              </CardBody>
            </Card>
          </Stack>
        </Grid>

        <Card>
          <CardHeader trailing={<Pill tone="success" size="sm">For your profile</Pill>}>
            Why RTM Wins for You Specifically
          </CardHeader>
          <CardBody>
            <Stack gap={6}>
              <Table
                headers={['Reason', 'Detail']}
                rows={[
                  ['You have ₹2.5 Cr savings', 'No financial pressure to chase the cheaper UC price — you can afford RTM without stress'],
                  ['WFH 3 days/week starts now', 'Every month in a rented flat while waiting for UC possession = ₹25–40K rent burned + discomfort of working from a rental'],
                  ['No GST on RTM saves ₹10–12L', 'A ₹2 Cr RTM costs the same total as a ₹1.9 Cr UC once you add GST — the savings are smaller than they appear'],
                  ['Single adult = quality of current living matters', 'You\'re not just "managing" for 3 years in a rental. That period IS your life right now.'],
                  ['UC risk is real', 'Yelahanka has seen UC delays. A 2-year delay = 2 more years of rent + opportunity cost'],
                ]}
                rowTone={['success', 'success', 'success', undefined, 'warning']}
                striped
              />
            </Stack>
          </CardBody>
        </Card>
      </Stack>

      <Divider />

      {/* ── loading factor ── */}
      <Stack gap={12}>
        <H2>Carpet Area vs Super Built-Up — The Loading Factor Trap</H2>
        <Text tone="secondary" size="small">
          Builders advertise Super Built-up Area (SBA). What you actually live in is Carpet Area. The gap can be 25–40% — a massive difference in real space.
        </Text>

        <Stack gap={10}>
          <H3>Select Advertised SBA</H3>
          <Row gap={6} wrap>
            {sbaOptions.map(s => (
              <Pill key={s} active={sba === s} onClick={() => setSba(s)}>{s} sqft</Pill>
            ))}
          </Row>
        </Stack>

        <Table
          headers={['Loading Factor', 'Carpet Area', 'Usable vs Advertised', 'Room sizes (3 BHK est.)', 'Verdict']}
          rows={loadingScenarios.map(({ pct, label, tone }) => {
            const carpet = carpetFromSBA(sba, pct);
            const roomAvg = Math.round(carpet / 5.5);
            return [
              label,
              `${carpet} sqft`,
              `${pct}% lost to common areas`,
              `~${roomAvg} sqft avg per room`,
              pct <= 28 ? 'Good — push for this' : pct <= 32 ? 'Acceptable' : 'Reject or renegotiate',
            ];
          })}
          rowTone={loadingScenarios.map(({ pct }) =>
            pct <= 28 ? 'success' : pct <= 32 ? 'warning' : 'danger'
          )}
          columnAlign={['left', 'right', 'left', 'right', 'left']}
        />

        <Grid columns={3} gap={14}>
          <Card>
            <CardHeader trailing={<Pill size="sm">Rule 1</Pill>}>Always Ask for RERA Carpet Area</CardHeader>
            <CardBody>
              <Text size="small">Post-2017, RERA mandates builders to state carpet area. Ask for the RERA carpet area certificate before negotiating. A builder who hesitates is a red flag.</Text>
            </CardBody>
          </Card>
          <Card>
            <CardHeader trailing={<Pill size="sm">Rule 2</Pill>}>Loading Above 33% = Walk Away</CardHeader>
            <CardBody>
              <Text size="small">If a builder's loading factor exceeds 33%, you're losing a room's worth of space to lobbies and shafts. In Yelahanka, good projects achieve 26–29% loading.</Text>
            </CardBody>
          </Card>
          <Card>
            <CardHeader trailing={<Pill size="sm">Rule 3</Pill>}>Compare Price on Carpet, Not SBA</CardHeader>
            <CardBody>
              <Text size="small">Always convert to carpet area price. ₹7,500/sqft SBA with 32% loading = ₹11,029/sqft carpet. A different project at ₹8,000/sqft SBA with 26% loading = ₹10,811/sqft carpet — actually cheaper per real sqft.</Text>
            </CardBody>
          </Card>
        </Grid>
      </Stack>

      <Divider />

      {/* ── BHK config ── */}
      <Stack gap={12}>
        <H2>BHK Configuration — What to Buy as a Single Adult</H2>

        <Table
          headers={['Config', 'Typical SBA', 'Carpet ~', 'Room Use for Single Adult', 'Verdict']}
          rows={[
            ['2 BHK', '1,000–1,200 sqft', '700–840 sqft', 'Bedroom + 1 room (WFH or guest — not both)', 'Too cramped for WFH lifestyle'],
            ['3 BHK', '1,400–1,800 sqft', '980–1,260 sqft', 'Master BR + WFH room + Guest/Gym room', 'Optimal — the sweet spot'],
            ['3 BHK + Study', '1,600–1,900 sqft', '1,120–1,330 sqft', 'Master BR + dedicated study + Guest room + 3rd flex room', 'Excellent if available'],
            ['4 BHK', '2,000–2,400 sqft', '1,400–1,680 sqft', 'One room will always be unused; higher maintenance charges', 'Overkill — maintenance cost not worth it'],
          ]}
          rowTone={['warning', 'success', 'success', 'warning']}
          striped
        />

        <Card>
          <CardHeader trailing={<Pill tone="success" size="sm">Recommended</Pill>}>
            The Ideal 3 BHK Room Allocation for Your Profile
          </CardHeader>
          <CardBody>
            <Table
              headers={['Room', 'Size Target', 'Purpose', 'Priority']}
              rows={[
                ['Master Bedroom', '160–200 sqft', 'Sleep, wardrobe, attached bath', 'Essential'],
                ['2nd Bedroom (WFH)', '140–160 sqft', 'Permanent desk setup, monitors, storage. North/East facing.', 'Critical'],
                ['3rd Bedroom', '130–150 sqft', 'Guest room (parents visiting) or gym / hobby room', 'High'],
                ['Living + Dining', '280–350 sqft', 'Main social + work-break space, large screen, sofa', 'High'],
                ['Kitchen', '80–100 sqft', 'You cook on WFH days — modular kitchen, storage', 'High'],
                ['Balcony', '60–80 sqft', 'Break space during WFH — morning coffee, evening wind-down', 'High'],
                ['Utility / Store', '30–40 sqft', 'Washing machine, drying, storage', 'Medium'],
              ]}
              rowTone={[undefined, 'success', undefined, undefined, undefined, undefined, undefined]}
              striped
            />
          </CardBody>
        </Card>
      </Stack>

      <Divider />

      {/* ── floor selection ── */}
      <Stack gap={12}>
        <H2>Floor Selection Guide</H2>
        <Table
          headers={['Floor Range', 'Verdict', 'Notes']}
          rows={floors.map(f => [f.range, f.verdict, f.notes])}
          rowTone={floors.map(f => f.tone)}
          striped
        />
        <Text size="small" tone="secondary">
          For a single adult WFH setup: 5th–12th floor is ideal. Enough height for good light and ventilation, not so high that elevator dependency becomes a problem during power cuts.
        </Text>
      </Stack>

      <Divider />

      {/* ── orientation ── */}
      <Stack gap={12}>
        <H2>Orientation & Facing</H2>
        <Grid columns={2} gap={14}>
          <Table
            headers={['Facing', 'Verdict', 'For WFH', 'Notes']}
            rows={[
              ['North-East', 'Best', 'Excellent', 'Morning light, no harsh afternoon sun, cool in summer'],
              ['North', 'Very good', 'Excellent', 'Consistent indirect light all day, no direct sun glare'],
              ['East', 'Good', 'Good (morning)', 'Morning sun — bright WFH start, afternoon is fine'],
              ['South', 'Acceptable', 'Avoid for WFH room', 'Good light but hot in summer afternoons'],
              ['West', 'Poor', 'Avoid', 'Harsh afternoon + evening sun, heats up the flat'],
              ['South-West', 'Avoid', 'Avoid', 'Hottest orientation in Bangalore summers'],
            ]}
            rowTone={['success', 'success', undefined, 'warning', 'danger', 'danger']}
            striped
          />
          <Stack gap={14}>
            <Card>
              <CardHeader trailing={<Pill tone="success" size="sm">WFH specific</Pill>}>
                Orient Your WFH Room Right
              </CardHeader>
              <CardBody>
                <Stack gap={6}>
                  <Text size="small">Your WFH room facing has direct impact on productivity and comfort 3 days/week, 8+ hours/day.</Text>
                  <Text size="small">North-facing study = consistent, glare-free natural light. No afternoon heat. Monitor visibility is excellent.</Text>
                  <Text size="small">West-facing study = afternoon sun hits your monitor directly at 2–5 PM. Expensive to cool. Avoid.</Text>
                  <Text size="small" tone="secondary">When visiting units, go at 2 PM on a clear day. Feel which rooms get afternoon sun. That tells you everything.</Text>
                </Stack>
              </CardBody>
            </Card>
            <Card>
              <CardHeader>Corner Units vs Middle Units</CardHeader>
              <CardBody>
                <Stack gap={6}>
                  <Text size="small" weight="semibold">Corner units</Text>
                  <Text size="small" tone="secondary">Two open sides = more windows, cross ventilation, more light. Usually 5–10% premium. Worth it for a WFH setup.</Text>
                  <Text size="small" weight="semibold">Middle units</Text>
                  <Text size="small" tone="secondary">One open side. Less ventilation. But one shared wall means some insulation from heat/noise. Cheaper.</Text>
                </Stack>
              </CardBody>
            </Card>
          </Stack>
        </Grid>
      </Stack>

      <Divider />

      {/* ── WFH checklist ── */}
      <Stack gap={12}>
        <H2>WFH-Specific Flat Inspection Checklist</H2>
        <Text tone="secondary" size="small">
          Before making an offer on any flat, verify these. Critical items are deal-breakers.
        </Text>
        <Table
          headers={['Checkpoint', 'What to Verify', 'Priority']}
          rows={wfhChecklist}
          rowTone={wfhChecklist.map(([, , p]) => p === 'Critical' ? 'danger' : p === 'High' ? 'warning' : undefined)}
          striped
        />
      </Stack>

      <Divider />

      {/* ── Yelahanka project types ── */}
      <Stack gap={12}>
        <H2>What to Look For in Yelahanka Specifically</H2>
        <Grid columns={2} gap={14}>
          <Card>
            <CardHeader trailing={<Pill tone="success" size="sm">Target</Pill>}>
              Reputed Builders Active in Yelahanka
            </CardHeader>
            <CardBody>
              <Stack gap={6}>
                {[
                  ['Prestige Group', 'Established, good quality, slightly premium priced'],
                  ['Sobha Ltd', 'Best construction quality in BLR, premium'],
                  ['Shriram Properties', 'Good value, reliable delivery track record'],
                  ['Provident Housing', 'Affordable, RERA compliant, good livability focus'],
                  ['Total Environment', 'Boutique, eco-focused, green design'],
                  ['Assetz Property', 'Design-forward, growing Yelahanka presence'],
                ].map(([b, d]) => (
                  <Row key={b} gap={8} align="start">
                    <Text size="small" weight="semibold" style={{ minWidth: 140 }}>{b}</Text>
                    <Text size="small" tone="secondary">{d}</Text>
                  </Row>
                ))}
              </Stack>
            </CardBody>
          </Card>

          <Card>
            <CardHeader trailing={<Pill tone="warning" size="sm">Non-negotiable</Pill>}>
              Before You Shortlist Any Project
            </CardHeader>
            <CardBody>
              <Stack gap={5}>
                {[
                  'RERA registered — verify on krera.karnataka.gov.in',
                  'A-Khata property — confirm with BBMP/BDA records',
                  'OC obtained (RTM) — no OC = illegal, no loan, no resale',
                  'Check loading factor from RERA carpet area disclosure',
                  'Visit on a weekday and weekend — feel traffic, noise, density',
                  'Talk to existing residents — ask about maintenance, water, power backup',
                  'Verify fiber internet availability — Jio/ACT/Airtel ducting in building',
                ].map((item, i) => (
                  <Row key={i} gap={6} align="start">
                    <Text size="small" tone="secondary" style={{ minWidth: 14 }}>{i + 1}.</Text>
                    <Text size="small">{item}</Text>
                  </Row>
                ))}
              </Stack>
            </CardBody>
          </Card>
        </Grid>
      </Stack>

      <Divider />

      <Stack gap={10}>
        <H2>Configuration Summary — Your Target Property</H2>
        <Table
          headers={['Attribute', 'Target', 'Why']}
          rows={[
            ['Type', 'Ready-to-Move (strong preference)', 'No GST, immediate WFH setup, no rent burn, verified quality'],
            ['Configuration', '3 BHK (or 3 BHK + study)', 'WFH room + guest room + master BR — all used'],
            ['SBA range', '1,600–1,900 sqft', 'At 28% loading → 1,150–1,370 sqft carpet — ideal for 1 adult'],
            ['Floor', '5th–12th floor', 'Best light, ventilation, security without elevator dependency'],
            ['Facing', 'North or East', 'WFH room must not face West or South-West'],
            ['Unit type', 'Corner unit preferred', 'Cross ventilation, more windows, better natural light'],
            ['Budget', '₹1.8–2.3 Cr property price', 'Leaves ₹20–25L for stamp/reg, interiors, and buffer'],
            ['Renovations', 'Budget ₹10–15L for interiors', 'Kitchen, bathrooms, flooring, WFH setup, fixtures'],
          ]}
          rowTone={['success', 'success', undefined, undefined, 'warning', undefined, undefined, 'info']}
          striped
        />
      </Stack>

    </Stack>
  );
}
