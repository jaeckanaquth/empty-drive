import {
  Card, CardBody, CardHeader,
  Divider, Grid, H1, H2, H3,
  Pill, Row, Stack, Stat, Table, Text,
  TodoList, TodoListCard,
  useCanvasState,
} from 'cursor/canvas';

// ── types ──────────────────────────────────────────────────────────────────

type DocStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled';

interface DocItem {
  id: string;
  content: string;
  status: DocStatus;
}

// ── initial document checklist ─────────────────────────────────────────────

const INITIAL_DOCS: DocItem[] = [
  // Critical — deal-breakers if missing
  { id: 'oc', content: 'Occupancy Certificate (OC) — builder / BBMP issued', status: 'pending' },
  { id: 'khata', content: 'A-Khata certificate from BBMP — not B-Khata', status: 'pending' },
  { id: 'ec', content: 'Encumbrance Certificate (Form 15/16) — minimum 15 years', status: 'pending' },
  { id: 'title', content: 'Title deed chain — original owner to current seller', status: 'pending' },
  { id: 'plan', content: 'BBMP/BDA sanctioned building plan — matches actual construction', status: 'pending' },
  // High importance
  { id: 'tax', content: 'Property tax receipts — last 5 years, no dues', status: 'pending' },
  { id: 'dcconv', content: 'DC Conversion order — if built on ex-agricultural land', status: 'pending' },
  { id: 'betterment', content: 'Betterment charges paid receipt (BBMP)', status: 'pending' },
  { id: 'society_noc', content: 'Society/Association NOC — all dues cleared by seller', status: 'pending' },
  { id: 'loan_noc', content: 'Bank NOC + original title deeds — if seller has/had a loan on property', status: 'pending' },
  // Standard
  { id: 'sale_deed', content: 'Previous sale deeds — full chain of ownership', status: 'pending' },
  { id: 'poa', content: 'If POA sale — registered POA + check post-2011 SC ruling compliance', status: 'pending' },
  { id: 'carpet', content: 'RERA carpet area disclosure certificate', status: 'pending' },
  { id: 'cc', content: 'Completion Certificate (CC) — from BBMP/BDA', status: 'pending' },
  { id: 'water', content: 'BWSSB water connection approval / NOC', status: 'pending' },
  { id: 'bescom', content: 'BESCOM electricity connection in building name', status: 'pending' },
];

// ── red flags ──────────────────────────────────────────────────────────────

const RED_FLAGS = [
  { flag: 'No OC (Occupancy Certificate)', severity: 'Walk away', impact: 'Illegal construction. No bank loan possible. Cannot get legal water/electricity connection. Demolition risk.' },
  { flag: 'B-Khata property', severity: 'Walk away', impact: 'Built on illegally converted or unapproved land. Resale extremely difficult. BBMP can penalise or demolish.' },
  { flag: 'Encumbrance not clean', severity: 'Walk away', impact: 'Existing mortgage, court dispute, or lien on property. You inherit the problem.' },
  { flag: 'No DC Conversion order (land was agricultural)', severity: 'Walk away', impact: 'Technically cannot build residential. Any approval given was invalid.' },
  { flag: 'Construction deviates from sanctioned plan', severity: 'High risk', impact: 'Deviated floors or area can be ordered for demolition. Common in older Bangalore buildings.' },
  { flag: 'Seller unwilling to produce documents', severity: 'Walk away', impact: 'Any hesitation = something is hidden. A clean property has all documents ready.' },
  { flag: 'Property tax dues pending', severity: 'Negotiate / reject', impact: 'Dues transfer to you post-registration. Always clear dues before or deduct from price.' },
  { flag: 'Undisclosed co-owners', severity: 'High risk', impact: 'All co-owners must sign the sale deed. Missing signature = invalid transaction.' },
  { flag: 'Power of Attorney sale without registered POA', severity: 'High risk', impact: 'SC 2011 ruling: unregistered POA cannot convey title. Transaction can be challenged.' },
  { flag: 'Price significantly below market', severity: 'Caution', impact: 'Distress sales can be legitimate, but often hide legal issues. Do extra due diligence.' },
];

// ── process steps ──────────────────────────────────────────────────────────

const DUE_DILIGENCE_STEPS = [
  { step: '1', action: 'Hire a property lawyer', timeline: 'Before any payment', cost: '₹15–30K for full due diligence', detail: 'Engage a lawyer specialising in Bangalore property (not a general lawyer). Brief them on exact property details.' },
  { step: '2', action: 'Request all documents from seller', timeline: 'Day 1–3', cost: 'Free', detail: 'Ask for the full document list above. Seller hesitation is itself a red flag.' },
  { step: '3', action: 'Verify Khata status with BBMP', timeline: 'Day 2–5', cost: 'Free (online: bbmpe-aasthi.karnataka.gov.in)', detail: 'Confirm A-Khata, check property ID, verify no dues, check if khata matches actual property.' },
  { step: '4', action: 'Pull Encumbrance Certificate', timeline: 'Day 2–5', cost: '₹200–500 (kaveri.karnataka.gov.in)', detail: 'Get 30-year EC. Check for mortgages, court orders, disputes, previous sale deeds listed.' },
  { step: '5', action: 'Verify OC from BBMP records', timeline: 'Day 3–7', cost: 'Free (lawyer handles this)', detail: 'Cross-check OC number with BBMP/BDA. Many fake OCs circulate. Lawyer verifies with the issuing authority.' },
  { step: '6', action: 'Title search & chain of ownership', timeline: 'Day 5–10', cost: 'Part of lawyer fees', detail: 'Trace ownership from earliest available record to present. Check for gaps, disputed inheritances, or court orders.' },
  { step: '7', action: 'Physical site inspection with lawyer', timeline: 'Day 7–14', cost: 'Part of lawyer fees', detail: 'Compare sanctioned plan with actual structure. Flag deviations. Check if common areas match approved design.' },
  { step: '8', action: 'Bank legal team review (if taking loan)', timeline: 'Day 10–20', cost: 'Covered by bank', detail: 'Bank independently verifies title. If bank rejects, DO NOT proceed even if you plan to self-fund.' },
  { step: '9', content: 'Negotiate and draft Agreement of Sale', timeline: 'Day 15–25', cost: 'Lawyer fees', detail: 'Agreement of Sale is a binding contract. Include penalty clauses for seller default, clear possession date, encumbrance-free delivery.' } as any,
  { step: '10', action: 'Registration at Sub-Registrar', timeline: 'Day 20–30', cost: 'Stamp duty + registration', detail: 'Both buyer and seller present. For POA property — ensure original owner or registered POA holder is present.' },
];

export default function LegalDocumentation() {
  const [docs, setDocs] = useCanvasState<DocItem[]>('legalDocs', INITIAL_DOCS);

  const toggleDoc = (todo: { id: string; status: DocStatus }) => {
    setDocs(prev => prev.map(d =>
      d.id === todo.id
        ? { ...d, status: d.status === 'completed' ? 'pending' : 'completed' }
        : d
    ));
  };

  const completed = docs.filter(d => d.status === 'completed').length;
  const critical = docs.slice(0, 5);
  const high = docs.slice(5, 10);
  const standard = docs.slice(10);

  return (
    <Stack gap={28} style={{ padding: '24px 28px', maxWidth: 960 }}>

      <Stack gap={4}>
        <H1>Legal & Documentation</H1>
        <Text tone="secondary">Bangalore RTM property · Most buyers skip this — most horror stories start here</Text>
      </Stack>

      <Grid columns={4} gap={14}>
        <Stat value={`${completed}/${docs.length}`} label="Docs Verified" tone={completed === docs.length ? 'success' : completed >= 5 ? 'warning' : 'danger'} />
        <Stat value="5" label="Deal-Breaker Docs" tone="danger" />
        <Stat value="A-Khata + OC" label="Two Non-Negotiables" tone="warning" />
        <Stat value="₹25–50K" label="Lawyer Cost (Worth Every Rupee)" tone="info" />
      </Grid>

      <Card>
        <CardHeader trailing={<Pill tone="warning" size="sm">Read this first</Pill>}>
          Why Legal Due Diligence Is Non-Negotiable in Bangalore
        </CardHeader>
        <CardBody>
          <Stack gap={6}>
            <Text size="small">Bangalore has one of the most complex property legal landscapes in India — agricultural land conversions, BBMP vs BDA vs panchayat jurisdictions, decades of unregulated construction, and widespread B-Khata properties. A property that <Text weight="semibold" as="span">looks perfect and is priced right can be completely illegal.</Text></Text>
            <Text size="small" tone="secondary">The High Court of Karnataka has ordered demolitions of buildings in premium areas like Koramangala and Bellandur. This is not rare. A ₹25,000 lawyer fee is the cheapest insurance you will ever buy on a ₹2.5 Cr transaction.</Text>
          </Stack>
        </CardBody>
      </Card>

      <Divider />

      {/* ── interactive checklist ── */}
      <Stack gap={14}>
        <Row gap={8} align="center">
          <H2>Document Verification Checklist</H2>
          <Text tone="secondary" size="small">Click any item to mark as verified</Text>
        </Row>

        <Grid columns={3} gap={14}>
          <Stack gap={8}>
            <Row gap={6} align="center">
              <H3>Critical (Deal-Breakers)</H3>
              <Pill tone="warning" size="sm">5 docs</Pill>
            </Row>
            <TodoListCard
              todos={critical}
              defaultExpanded
              onTodoClick={toggleDoc}
            />
          </Stack>
          <Stack gap={8}>
            <Row gap={6} align="center">
              <H3>High Importance</H3>
              <Pill size="sm">5 docs</Pill>
            </Row>
            <TodoListCard
              todos={high}
              defaultExpanded
              onTodoClick={toggleDoc}
            />
          </Stack>
          <Stack gap={8}>
            <Row gap={6} align="center">
              <H3>Standard Verification</H3>
              <Pill size="sm">6 docs</Pill>
            </Row>
            <TodoListCard
              todos={standard}
              defaultExpanded
              onTodoClick={toggleDoc}
            />
          </Stack>
        </Grid>
      </Stack>

      <Divider />

      {/* ── A-Khata vs B-Khata ── */}
      <Stack gap={12}>
        <H2>A-Khata vs B-Khata — Bangalore's Biggest Legal Trap</H2>
        <Grid columns={2} gap={14}>
          <Card>
            <CardHeader trailing={<Pill tone="success" size="sm">Buy only this</Pill>}>
              A-Khata
            </CardHeader>
            <CardBody>
              <Stack gap={8}>
                <Text size="small">Property is officially recognised by BBMP. All dues paid. Construction on properly converted residential land with approved plan.</Text>
                <Table
                  headers={['Aspect', 'Status']}
                  rows={[
                    ['BBMP recognition', 'Full — in BBMP records'],
                    ['Home loan', 'All banks will lend'],
                    ['Resale', 'Clean, straightforward'],
                    ['BESCOM/BWSSB', 'Legal connection in owner\'s name'],
                    ['Legal risk', 'Low (if other docs clean)'],
                    ['Demolition risk', 'None if plan-compliant'],
                  ]}
                  rowTone={[undefined, 'success', 'success', 'success', 'success', 'success']}
                  striped
                />
              </Stack>
            </CardBody>
          </Card>

          <Card>
            <CardHeader trailing={<Pill tone="warning" size="sm">Never buy</Pill>}>
              B-Khata
            </CardHeader>
            <CardBody>
              <Stack gap={8}>
                <Text size="small">Property not fully regularised. Often built on agricultural land without proper DC Conversion, or with unapproved construction. BBMP collects tax but does NOT recognise it as fully legal.</Text>
                <Table
                  headers={['Aspect', 'Status']}
                  rows={[
                    ['BBMP recognition', 'Partial — "B register" only'],
                    ['Home loan', 'Some banks lend (bad sign — means they\'re taking risk)'],
                    ['Resale', 'Very difficult, heavy discount'],
                    ['BESCOM/BWSSB', 'Often informal / shared connections'],
                    ['Legal risk', 'High — regularisation not guaranteed'],
                    ['Demolition risk', 'Real — especially post lake/nala encroachment scrutiny'],
                  ]}
                  rowTone={[undefined, 'danger', 'danger', 'danger', 'danger', 'danger']}
                  striped
                />
                <Text size="small" tone="secondary">Sellers often say "it will be converted to A-Khata." It may never happen. Do not rely on this.</Text>
              </Stack>
            </CardBody>
          </Card>
        </Grid>

        <Card>
          <CardHeader>How to Verify Khata Online</CardHeader>
          <CardBody>
            <Stack gap={6}>
              <Text size="small">Go to <Text weight="semibold" as="span">bbmpe-aasthi.karnataka.gov.in</Text> → Search by property PID or owner name → Check if the Khata type shows "A" → Verify property tax dues → Cross-check the property address and SBA matches the flat being sold.</Text>
              <Text size="small" tone="secondary">Also physically visit the local BBMP ward office to get a Khata extract (costs ₹25–100). The extract is the definitive proof.</Text>
            </Stack>
          </CardBody>
        </Card>
      </Stack>

      <Divider />

      {/* ── OC deep dive ── */}
      <Stack gap={12}>
        <H2>Occupancy Certificate (OC) — The Single Most Important Document</H2>
        <Grid columns={3} gap={14}>
          <Card>
            <CardHeader>What OC Proves</CardHeader>
            <CardBody>
              <Stack gap={5}>
                {[
                  'Construction matches the BBMP/BDA sanctioned plan',
                  'Building is safe for human occupation',
                  'All fire safety norms met',
                  'Structural stability verified by BBMP engineer',
                  'No illegal extra floors or extensions',
                ].map((p, i) => (
                  <Row key={i} gap={6} align="start">
                    <Text size="small" tone="secondary" style={{ minWidth: 12 }}>+</Text>
                    <Text size="small">{p}</Text>
                  </Row>
                ))}
              </Stack>
            </CardBody>
          </Card>

          <Card>
            <CardHeader trailing={<Pill tone="warning" size="sm">Red flag</Pill>}>
              Without OC You Cannot…
            </CardHeader>
            <CardBody>
              <Stack gap={5}>
                {[
                  'Get a home loan from any reputed bank',
                  'Get legal BESCOM electricity connection',
                  'Get legal BWSSB water connection',
                  'Resell easily (buyer\'s bank won\'t lend)',
                  'Claim compensation if building is demolished',
                ].map((p, i) => (
                  <Row key={i} gap={6} align="start">
                    <Text size="small" tone="secondary" style={{ minWidth: 12 }}>−</Text>
                    <Text size="small">{p}</Text>
                  </Row>
                ))}
              </Stack>
            </CardBody>
          </Card>

          <Card>
            <CardHeader>How to Verify OC is Real</CardHeader>
            <CardBody>
              <Stack gap={6}>
                <Text size="small">1. Get OC number from seller.</Text>
                <Text size="small">2. Visit the BBMP ward office that issued it — ask them to pull it from their records using the OC number.</Text>
                <Text size="small">3. Cross-check the date, building name, site address, and number of floors on the OC vs actual building.</Text>
                <Text size="small" tone="secondary">Fake OCs exist. The only safe verification is direct confirmation from the issuing BBMP/BDA office — not the seller's photocopy.</Text>
              </Stack>
            </CardBody>
          </Card>
        </Grid>
      </Stack>

      <Divider />

      {/* ── EC deep dive ── */}
      <Stack gap={12}>
        <H2>Encumbrance Certificate (EC) — Check for Hidden Debts</H2>
        <Grid columns={2} gap={14}>
          <Card>
            <CardHeader>What EC Shows</CardHeader>
            <CardBody>
              <Stack gap={8}>
                <Text size="small">EC is a record of all registered transactions on a property — mortgages, sale deeds, gift deeds, court orders. Pulled from Sub-Registrar records.</Text>
                <Table
                  headers={['Form', 'Meaning']}
                  rows={[
                    ['Form 15 (EC)', 'Transactions found in the period — read carefully'],
                    ['Form 16 (NIL EC)', 'No transactions found — clean record for that period'],
                  ]}
                  striped
                />
                <Text size="small" tone="secondary">Get EC for 30 years minimum. A 15-year EC can miss older disputes. Pull it yourself from kaveri.karnataka.gov.in — don't rely on the seller's copy.</Text>
              </Stack>
            </CardBody>
          </Card>

          <Card>
            <CardHeader trailing={<Pill tone="warning" size="sm">Verify these</Pill>}>
              What to Look for in the EC
            </CardHeader>
            <CardBody>
              <Stack gap={5}>
                {[
                  ['Active mortgage / home loan', 'Seller must get bank NOC + return original documents before registration'],
                  ['Multiple sale deeds for same property', 'Property sold twice — serious fraud, walk away'],
                  ['Court orders / litigation', 'Any court attachment means property is frozen'],
                  ['Gift deed / partition deed', 'Ensure all heirs have signed off — no missing family members'],
                  ['Lease deeds', 'Property may be under long-term lease to a third party'],
                ].map(([issue, action]) => (
                  <Stack key={issue} gap={1}>
                    <Text size="small" weight="semibold">{issue}</Text>
                    <Text size="small" tone="secondary">{action}</Text>
                  </Stack>
                ))}
              </Stack>
            </CardBody>
          </Card>
        </Grid>
      </Stack>

      <Divider />

      {/* ── red flags ── */}
      <Stack gap={12}>
        <H2>Red Flags — Immediate Actions</H2>
        <Table
          headers={['Red Flag', 'Severity', 'What It Means']}
          rows={RED_FLAGS.map(r => [r.flag, r.severity, r.impact])}
          rowTone={RED_FLAGS.map(r =>
            r.severity === 'Walk away' ? 'danger' :
            r.severity === 'High risk' ? 'warning' :
            undefined
          )}
          striped
        />
      </Stack>

      <Divider />

      {/* ── due diligence process ── */}
      <Stack gap={12}>
        <H2>Due Diligence Process — Step by Step</H2>
        <Text tone="secondary" size="small">
          From property shortlist to registration. Total time: 3–5 weeks. Do not rush this.
        </Text>
        <Table
          headers={['Step', 'Action', 'Timeline', 'Cost']}
          rows={DUE_DILIGENCE_STEPS.map(s => [
            s.step,
            s.action ?? (s as any).content,
            s.timeline,
            s.cost,
          ])}
          striped
          columnAlign={['left', 'left', 'left', 'right']}
        />
      </Stack>

      <Divider />

      {/* ── Agreement of Sale ── */}
      <Stack gap={12}>
        <H2>Agreement of Sale — What Must Be in It</H2>
        <Grid columns={2} gap={14}>
          <Card>
            <CardHeader trailing={<Pill tone="warning" size="sm">Must-have clauses</Pill>}>
              Protect Yourself in the Agreement
            </CardHeader>
            <CardBody>
              <Stack gap={5}>
                {[
                  ['Exact property description', 'Survey number, plot number, floor, unit number, carpet area as per RERA'],
                  ['Price & payment schedule', 'Total consideration, token amount, balance, and dates'],
                  ['Clear title warranty', 'Seller warrants title is free of encumbrances — personal liability clause'],
                  ['Possession date', 'Specific date. Penalty clause if seller delays (₹X per day)'],
                  ['Document delivery', 'List of all original documents seller must hand over on registration'],
                  ['OC delivery', 'If OC is pending, seller must obtain and deliver before registration or price adjusted'],
                  ['Khata transfer', 'Seller responsible for facilitating Khata transfer within 60 days of registration'],
                  ['Society dues', 'All society dues, maintenance arrears cleared by seller before handover'],
                ].map(([clause, detail]) => (
                  <Stack key={clause} gap={1}>
                    <Text size="small" weight="semibold">{clause}</Text>
                    <Text size="small" tone="secondary">{detail}</Text>
                  </Stack>
                ))}
              </Stack>
            </CardBody>
          </Card>

          <Stack gap={14}>
            <Card>
              <CardHeader trailing={<Pill tone="info" size="sm">Token amount</Pill>}>
                Token & Advance Payment Rules
              </CardHeader>
              <CardBody>
                <Stack gap={6}>
                  <Text size="small">Token amount locks the deal — usually ₹1–5L. Once paid, property is off market.</Text>
                  <Text size="small">Agreement of Sale is signed when 10–15% of total price is paid. This is a legal contract — breach has penalties.</Text>
                  <Text size="small" tone="secondary">Never pay any amount (even token) without at minimum confirming OC exists and Khata is A-Khata. Recovering token money from a fraudulent seller is a multi-year legal battle.</Text>
                </Stack>
              </CardBody>
            </Card>

            <Card>
              <CardHeader trailing={<Pill tone="success" size="sm">Hiring a lawyer</Pill>}>
                How to Find a Good Property Lawyer
              </CardHeader>
              <CardBody>
                <Stack gap={6}>
                  <Text size="small">Ask: "How many BBMP property registrations have you done in the last year?" A good Bangalore property lawyer should say 50+.</Text>
                  <Text size="small" tone="secondary">Referrals from friends who recently bought in BLR are the best source. Avoid lawyers suggested by the builder or broker — conflict of interest.</Text>
                  <Text size="small" tone="secondary">Budget ₹25,000–50,000 for full due diligence + agreement drafting + registration assistance. Some charge ₹75,000–1L for complex cases.</Text>
                </Stack>
              </CardBody>
            </Card>
          </Stack>
        </Grid>
      </Stack>

      <Divider />

      <Stack gap={10}>
        <H2>Legal Checklist Summary</H2>
        <Table
          headers={['Category', 'Non-Negotiable Check', 'Where to Verify']}
          rows={[
            ['Occupancy', 'OC obtained from BBMP/BDA', 'Visit issuing BBMP ward office physically'],
            ['Ownership record', 'A-Khata (not B-Khata)', 'bbmpe-aasthi.karnataka.gov.in + BBMP ward office'],
            ['Debt-free', '30yr EC clean — no mortgages, court orders', 'kaveri.karnataka.gov.in (self-pull)'],
            ['Title', 'Unbroken chain of ownership', 'Your lawyer + Sub-Registrar records'],
            ['Plan compliance', 'Construction matches sanctioned plan', 'Your lawyer + BBMP records'],
            ['Land status', 'DC Conversion order exists if applicable', 'BBMP/DC office records'],
            ['Dues', 'Property tax, society dues, betterment — all cleared', 'BBMP portal + society ledger'],
            ['Registration', 'All co-owners present or registered POA', 'Sub-Registrar at time of registration'],
          ]}
          rowTone={['warning', 'danger', 'danger', 'warning', 'warning', 'warning', undefined, undefined]}
          striped
        />
        <Text size="small" tone="secondary">
          The interactive checklist above tracks your verification progress. Mark each document as you obtain and verify it.
        </Text>
      </Stack>

    </Stack>
  );
}
