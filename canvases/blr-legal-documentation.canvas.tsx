import {
  Card, CardBody, CardHeader,
  Divider, Grid, H1, H2, H3,
  Pill, Row, Stack, Stat, Table, Text,
  TodoListCard,
  useCanvasState,
} from 'cursor/canvas';

// ── Criterion 5 — Legal & Documentation ────────────────────────────────────
// UC Grade A · North Bangalore · first sale from builder + handover phase

type DocStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled';
type DocPhase = 'uc_booking' | 'uc_handover' | 'resale_exit';

interface DocItem {
  id: string;
  content: string;
  status: DocStatus;
  phase: DocPhase;
}

const INITIAL_DOCS: DocItem[] = [
  // ── UC — before booking / agreement ──────────────────────────────────────
  { id: 'rera',     content: 'RERA: project + promoter verified on krera.karnataka.gov.in (not just brochure QR)', status: 'pending', phase: 'uc_booking' },
  { id: 'bba',      content: 'Builder–Buyer Agreement (BBA): carpet area, SBA, possession date, penalties match RERA portal', status: 'pending', phase: 'uc_booking' },
  { id: 'sanction', content: 'Sanctioned building plan + layout approval from competent authority (BBMP / BDA / BMRDA / LPA)', status: 'pending', phase: 'uc_booking' },
  { id: 'land',     content: 'Land title pack: mother deeds, revenue sketch, conversion / JDA / GPA chain — lawyer-reviewed', status: 'pending', phase: 'uc_booking' },
  { id: 'ec_land',  content: 'Encumbrance Certificate on schedule property (land) — 30 years minimum', status: 'pending', phase: 'uc_booking' },
  { id: 'juris',    content: 'Jurisdiction in writing: BBMP vs BDA vs BMRDA vs Gram Panchayat — matches Khata path you expect', status: 'pending', phase: 'uc_booking' },
  { id: 'escrow',   content: 'RERA payment rules: ≤10% before registering BBA; balance construction-linked per RERA stages', status: 'pending', phase: 'uc_booking' },
  { id: 'brochure', content: 'Brochure vs RERA variance check — amenities, towers, unit count must not exceed sanctioned scope', status: 'pending', phase: 'uc_booking' },

  // ── UC — at possession / registration ────────────────────────────────────
  { id: 'oc',       content: 'Occupancy Certificate (OC) for your tower/block from competent authority', status: 'pending', phase: 'uc_handover' },
  { id: 'cc',       content: 'Completion Certificate (CC) where applicable', status: 'pending', phase: 'uc_handover' },
  { id: 'khata',    content: 'A-Khata (or BDA khata path) for your apartment — not B-Khata / unauthorised panchayat-only', status: 'pending', phase: 'uc_handover' },
  { id: 'deed',     content: 'Sale deed / conveyance registered; UDS + schedule description match BBA & RERA', status: 'pending', phase: 'uc_handover' },
  { id: 'ec_unit',  content: 'Post-registration EC on your unit — clean before accepting final possession', status: 'pending', phase: 'uc_handover' },
  { id: 'poss',     content: 'Possession letter + snagging sign-off; OC date aligns with RERA extended timeline if any', status: 'pending', phase: 'uc_handover' },
  { id: 'bescom',   content: 'BESCOM + BWSSB (or society bulk) — legal connection path documented', status: 'pending', phase: 'uc_handover' },

  // ── Resale / exit (2030 buyer perspective) ──────────────────────────────
  { id: 'tax',      content: 'Property tax receipts — no arrears before you sell', status: 'pending', phase: 'resale_exit' },
  { id: 'society',  content: 'Association / society NOC + maintenance ledger — dues cleared', status: 'pending', phase: 'resale_exit' },
  { id: 'loan_noc', content: 'If mortgaged: bank NOC + original deeds for buyer\'s bank', status: 'pending', phase: 'resale_exit' },
  { id: 'poa',      content: 'If POA transfer — registered POA only (post-2011 SC position)', status: 'pending', phase: 'resale_exit' },
];

const RED_FLAGS_RTM = [
  { flag: 'No OC at handover', severity: 'Walk away', impact: 'Flat not legally habitable; bank may not release final tranche; resale blocked.' },
  { flag: 'B-Khata unit', severity: 'Walk away', impact: 'Weak title for loan and resale; regularisation uncertain.' },
  { flag: 'Encumbrance not clean on land', severity: 'Walk away', impact: 'Mortgage, lien, or litigation on parent land affects entire project.' },
  { flag: 'No DC conversion (ex-agri land)', severity: 'Walk away', impact: 'Residential use may be void; approvals challengeable.' },
  { flag: 'Brochure promises beyond RERA filing', severity: 'High risk', impact: 'Misrepresentation; RERA complaint + delayed delivery risk.' },
];

const RED_FLAGS_UC = [
  { flag: 'Project not on RERA portal / wrong promoter name', severity: 'Walk away', impact: 'Not RERA-compliant; escrow and possession protections do not apply.' },
  { flag: 'Builder asks >10% before BBA registration', severity: 'Walk away', impact: 'Violates RERA payment norms; money may sit outside protected account.' },
  { flag: 'BBA carpet area ≠ RERA filing', severity: 'Walk away', impact: 'Contract fraud; you are not buying what is legally registered.' },
  { flag: 'Land EC shows mortgage / litigation', severity: 'Walk away', impact: 'Bank or court can attach project; delivery risk extreme.' },
  { flag: 'Jurisdiction unclear (GP vs BBMP)', severity: 'High risk', impact: 'Khata and OC path uncertain; resale buyer pool shrinks.' },
  { flag: 'Sanctioned floors < marketed floors', severity: 'Walk away', impact: 'Illegal additional floors — OC may never issue for upper levels.' },
];

const DUE_DILIGENCE_UC = [
  { step: '1', action: 'Hire Bangalore property lawyer', timeline: 'Before token', cost: '₹25–50K', detail: 'Brief: UC first sale, North BLR, Grade A builder — still verify land title.' },
  { step: '2', action: 'Pull RERA filing + compare to BBA draft', timeline: 'Day 1–3', cost: 'Free', detail: 'Carpet, SBA, tower count, amenities, possession quarter must match.' },
  { step: '3', action: 'Land title + EC (30 yr) on schedule property', timeline: 'Day 2–7', cost: 'In lawyer fee', detail: 'Mother deed chain, conversion orders, JDA if any. EC from Kaveri.' },
  { step: '4', action: 'Verify sanction plan with issuing authority', timeline: 'Day 5–10', cost: 'Lawyer / RTI', detail: 'Floors, FSI, setbacks must cover the tower you are booking.' },
  { step: '5', action: 'Bank technical + legal (if loan)', timeline: 'Day 7–20', cost: 'Bank', detail: 'If bank declines project, treat as serious signal even if self-funded.' },
  { step: '6', action: 'Register BBA + pay ≤10% booking per RERA', timeline: 'Day 10–20', cost: 'Stamp on BBA', detail: 'Sub-registrar; balance only per construction-linked schedule.' },
  { step: '7', action: 'Monitor RERA quarterly construction updates', timeline: 'Until possession', cost: 'Free', detail: 'Mismatch vs site photos = early RERA complaint.' },
  { step: '8', action: 'Pre-handover: demand OC/CC draft + Khata path letter', timeline: '3–6 mo before RERA date', cost: 'Lawyer', detail: 'Do not take physical possession without OC for your block.' },
  { step: '9', action: 'Register sale deed + obtain A-Khata', timeline: 'At OC', cost: 'Stamp + reg', detail: 'UDS and flat number must match BBA; collect possession letter.' },
  { step: '10', action: 'Post-possession: EC + utility + society formation', timeline: '0–12 mo after keys', cost: 'Varies', detail: 'Clean EC before renting or listing for resale.' },
];

const DUE_DILIGENCE_RTM = [
  { step: '1', action: 'Hire property lawyer', timeline: 'Before token', cost: '₹25–50K', detail: 'Resale chain + OC + Khata + society.' },
  { step: '2', action: 'Seller document pack + 30-yr EC', timeline: 'Day 1–5', cost: '₹500', detail: 'Kaveri pull; verify no active mortgage.' },
  { step: '3', action: 'Physical OC verification at BBMP/BDA', timeline: 'Day 3–7', cost: 'Free', detail: 'Fake OCs exist — confirm with issuing office.' },
  { step: '4', action: 'Khata extract + tax dues', timeline: 'Day 3–7', cost: '₹25–100', detail: 'bbmpe-aasthi.karnataka.gov.in + ward office.' },
  { step: '5', action: 'Agreement of Sale + registration', timeline: 'Day 15–30', cost: 'Stamp + reg', detail: 'Possession clause; penalty; document delivery list.' },
];

export default function LegalDocumentation() {
  const [docs, setDocs] = useCanvasState<DocItem[]>('legalDocsV2', INITIAL_DOCS);
  const [path, setPath] = useCanvasState<'uc' | 'rtm'>('legalPath', 'uc');

  const toggleDoc = (todo: { id: string; status: DocStatus }) => {
    setDocs(prev => prev.map(d =>
      d.id === todo.id
        ? { ...d, status: d.status === 'completed' ? 'pending' : 'completed' }
        : d
    ));
  };

  const ucBooking  = docs.filter(d => d.phase === 'uc_booking');
  const ucHandover = docs.filter(d => d.phase === 'uc_handover');
  const resale     = docs.filter(d => d.phase === 'resale_exit');

  const completed = docs.filter(d => d.status === 'completed').length;
  const bookingDone = ucBooking.filter(d => d.status === 'completed').length;

  return (
    <Stack gap={28} style={{ padding: '24px 28px', maxWidth: 980 }}>

      <Stack gap={4}>
        <H1>Criterion 5 — Legal & Documentation</H1>
        <Text tone="secondary">
          UC Grade A · North Bangalore · first sale from builder — RERA, land title, BBA, then OC/Khata at handover. Resale checklist for your eventual exit.
        </Text>
      </Stack>

      <Grid columns={4} gap={14}>
        <Stat value={`${completed}/${docs.length}`} label="Checklist items done"
          tone={completed === docs.length ? 'success' : completed >= 10 ? 'warning' : 'danger'} />
        <Stat value={`${bookingDone}/${ucBooking.length}`} label="Pre-booking (UC) done" tone={bookingDone >= 6 ? 'success' : 'warning'} />
        <Stat value="RERA + lawyer" label="Non-negotiable before token" tone="danger" />
        <Stat value="₹25–50K" label="Typical lawyer (full UC pack)" tone="info" />
      </Grid>

      <Row gap={6} wrap>
        <Pill active={path === 'uc'}  onClick={() => setPath('uc')}  tone="success">Under-construction (our path)</Pill>
        <Pill active={path === 'rtm'} onClick={() => setPath('rtm')} tone="neutral">Ready-to-move (reference)</Pill>
      </Row>

      <Card>
        <CardHeader trailing={<Pill tone="warning" size="sm">UC vs RTM</Pill>}>
          What is legally different when you buy UC from a builder?
        </CardHeader>
        <CardBody>
          <Table
            headers={['Topic', 'UC (first sale)', 'RTM / resale']}
            rows={[
              ['OC / CC', 'Not available at booking — mandatory at handover before full possession', 'Must exist before you pay balance'],
              ['Khata', 'Often Khata on land first; apartment Khata after OC + formation / conveyance', 'A-Khata on unit should already exist'],
              ['EC focus', 'EC on land / schedule property + promoter litigation search', 'EC on unit + chain of sale deeds'],
              ['Agreement', 'Builder–Buyer Agreement (BBA) registered under RERA', 'Agreement of Sale with individual seller'],
              ['Payments', 'RERA-stage linked; 70% to escrow account', 'Full disbursement per bank; no RERA escrow'],
              ['Risk shape', 'Delivery delay + plan change — RERA forum', 'Hidden title / society dues — lawyer + EC'],
            ]}
            striped
          />
        </CardBody>
      </Card>

      <Divider />

      {/* ── Checklists ── */}
      <Stack gap={14}>
        <H2>Interactive checklists</H2>
        <Text tone="secondary" size="small">Tap items as you verify. Phase A must be green before token; Phase B before final payment / possession.</Text>

        <Grid columns={3} gap={14}>
          <Stack gap={8}>
            <Row gap={6} align="center">
              <H3>Phase A — UC booking</H3>
              <Pill tone="danger" size="sm">{ucBooking.length} items</Pill>
            </Row>
            <TodoListCard todos={ucBooking} defaultExpanded onTodoClick={toggleDoc} />
          </Stack>
          <Stack gap={8}>
            <Row gap={6} align="center">
              <H3>Phase B — Handover</H3>
              <Pill tone="warning" size="sm">{ucHandover.length} items</Pill>
            </Row>
            <TodoListCard todos={ucHandover} defaultExpanded onTodoClick={toggleDoc} />
          </Stack>
          <Stack gap={8}>
            <Row gap={6} align="center">
              <H3>Exit / resale</H3>
              <Pill size="sm">{resale.length} items</Pill>
            </Row>
            <TodoListCard todos={resale} defaultExpanded onTodoClick={toggleDoc} />
          </Stack>
        </Grid>
      </Stack>

      <Divider />

      {/* ── Red flags ── */}
      <Stack gap={12}>
        <H2>Red flags — {path === 'uc' ? 'UC first sale' : 'RTM resale'}</H2>
        <Table
          headers={['Red flag', 'Severity', 'What it means']}
          rows={(path === 'uc' ? RED_FLAGS_UC : RED_FLAGS_RTM).map(r => [r.flag, r.severity, r.impact])}
          rowTone={(path === 'uc' ? RED_FLAGS_UC : RED_FLAGS_RTM).map(r =>
            r.severity === 'Walk away' ? 'danger' : r.severity === 'High risk' ? 'warning' : undefined
          )}
          striped
        />
      </Stack>

      <Divider />

      {/* ── A-Khata vs B-Khata ── */}
      <Stack gap={12}>
        <H2>A-Khata vs B-Khata</H2>
        <Grid columns={2} gap={14}>
          <Card>
            <CardHeader trailing={<Pill tone="success" size="sm">Target</Pill>}>A-Khata (or clean BDA path)</CardHeader>
            <CardBody>
              <Text size="small">Full municipal recognition; standard home loans; clean resale in 2030. For UC, confirm the <Text weight="semibold" as="span">expected Khata class at handover</Text> is written in BBA or builder letter.</Text>
            </CardBody>
          </Card>
          <Card>
            <CardHeader trailing={<Pill tone="danger" size="sm">Avoid</Pill>}>B-Khata / GP-only risk</CardHeader>
            <CardBody>
              <Text size="small">Common at Rajanukunte belt edges, some Thanisandra pockets, and Gram Panchayat layouts. Do not accept verbal assurances of future conversion.</Text>
            </CardBody>
          </Card>
        </Grid>
        <Card>
          <CardHeader>Verify Khata</CardHeader>
          <CardBody>
            <Text size="small">bbmpe-aasthi.karnataka.gov.in — PID / owner search. Ward-office Khata extract for final confirmation.</Text>
          </CardBody>
        </Card>
      </Stack>

      <Divider />

      {/* ── OC — still central at handover ── */}
      <Stack gap={12}>
        <H2>OC & CC — at handover (not at booking)</H2>
        <Text size="small" tone="secondary">
          For UC you cannot demand OC before the building is complete — but you <Text weight="semibold" as="span">must</Text> refuse possession without OC for your tower (unless your lawyer advises a documented interim structure you accept). Banks link final disbursement to OC.
        </Text>
        <Grid columns={2} gap={14}>
          <Card>
            <CardHeader>OC proves</CardHeader>
            <CardBody>
              <Stack gap={4}>
                {['Built as per sanction', 'Fire & structural clearance', 'No illegal extra floors'].map((t, i) => (
                  <Text key={i} size="small">+ {t}</Text>
                ))}
              </Stack>
            </CardBody>
          </Card>
          <Card>
            <CardHeader trailing={<Pill tone="warning" size="sm">Verify</Pill>}>Fake OC risk</CardHeader>
            <CardBody>
              <Text size="small">Cross-check OC number with issuing BBMP/BDA/BMRDA office — not only builder PDF.</Text>
            </CardBody>
          </Card>
        </Grid>
      </Stack>

      <Divider />

      {/* ── EC ── */}
      <Stack gap={12}>
        <H2>Encumbrance Certificate</H2>
        <Table
          headers={['When', 'What to pull', 'Where']}
          rows={[
            ['Before booking (UC)', 'EC on schedule / survey land + search on promoter entities', 'kaveri.karnataka.gov.in + lawyer'],
            ['Before possession (UC)', 'Fresh EC on property; confirm no new mortgage on land', 'Kaveri'],
            ['Before resale (~2030)', 'EC on your unit from first registration to present', 'Kaveri'],
          ]}
          striped
        />
      </Stack>

      <Divider />

      {/* ── Process ── */}
      <Stack gap={12}>
        <H2>Due diligence — {path === 'uc' ? 'UC first sale' : 'RTM resale'}</H2>
        <Table
          headers={['Step', 'Action', 'Timeline', 'Cost']}
          rows={(path === 'uc' ? DUE_DILIGENCE_UC : DUE_DILIGENCE_RTM).map(s => [s.step, s.action, s.timeline, s.cost])}
          striped
          columnAlign={['left', 'left', 'left', 'right']}
        />
      </Stack>

      <Divider />

      {/* ── BBA must-haves ── */}
      <Stack gap={12}>
        <H2>Builder–Buyer Agreement — clauses to insist on (UC)</H2>
        <Table
          headers={['Clause', 'Detail']}
          rows={[
            ['RERA IDs', 'Project registration id + promoter name match portal'],
            ['Carpet / SBA', 'Exact numbers as per RERA; loading defined'],
            ['Possession', 'Quarter + penalty for delay per RERA or higher'],
            ['Payment', 'Stage descriptions tied to RERA filing; max 10% pre-registration'],
            ['Alteration', 'No material plan change without consent; compensation if forced'],
            ['Assignment', 'Your right to assign / sell under construction if needed'],
            ['Dispute', 'Arbitration / courts of Bengaluru; RERA forum preserved'],
          ]}
          striped
        />
      </Stack>

      <Divider />

      <Stack gap={10}>
        <H2>One-line summary</H2>
        <Text size="small" tone="secondary">
          UC legal work is <Text weight="semibold" as="span">front-loaded on land + RERA + BBA</Text>, then <Text weight="semibold" as="span">OC/Khata/deed at the end</Text>. Skipping Phase A because the builder is Grade A is how smart people still buy encumbered land.
        </Text>
      </Stack>

    </Stack>
  );
}
