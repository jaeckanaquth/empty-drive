import {
  Card, CardBody, CardHeader,
  Divider, Grid, H1, H2, H3,
  Pill, Row, Stack, Stat, Table, Text,
  TodoListCard,
  useCanvasState,
} from 'cursor/canvas';

import type { TodoItem } from 'cursor/canvas';

// ── visit list ────────────────────────────────────────────────────────────

const visits = [
  {
    id: 'sobha-athena',
    rank: 1,
    name: 'Sobha Athena (new launch)',
    builder: 'Sobha Limited',
    address: 'Thanisandra Main Road, Bangalore – 560077',
    mapSearch: 'Sobha Athena Thanisandra Bangalore',
    type: 'Under construction (UC)',
    priceRange: '₹2.27–2.28 Cr (all-in ~₹2.43 Cr)',
    size: '1,682–1,692 sqft SBA',
    contactApproach: 'Visit Sobha sales office at the site (sobha.com). Verify RERA number on Karnataka portal — check % completion. Ask for detailed construction-linked payment plan. Possession est. Jun 2027.',
    bestVisitTime: 'Weekday 10:00 AM — sales team available, site activity visible',
    driveFromYelahanka: '~25 min',
    priority: 'Must Visit',
  },
  {
    id: 'prestige-camden',
    rank: 2,
    name: 'Prestige Camden Gardens',
    builder: 'Prestige Group',
    address: 'Thanisandra Main Road, Bangalore – 560077',
    mapSearch: 'Prestige Camden Gardens Thanisandra Bangalore',
    type: 'Under construction (UC)',
    priceRange: '₹1.89–2.5 Cr',
    size: '1,550–1,800 sqft SBA',
    contactApproach: 'RERA: PR/140524/006872 — verify on rera.karnataka.gov.in. Call Prestige (prestige-group.com) for 3 BHK floor plans and payment schedule. Boutique 120-unit project. Possession est. Dec 2027.',
    bestVisitTime: 'Combine with Sobha Athena — both on Thanisandra Main Rd, same day',
    driveFromYelahanka: '~25 min',
    priority: 'Must Visit',
  },
  {
    id: 'arvind-bel-air',
    rank: 3,
    name: 'Arvind Bel Air',
    builder: 'Arvind SmartSpaces',
    address: 'Yelahanka New Town Road, Bangalore – 560064',
    mapSearch: 'Arvind Bel Air Yelahanka Bangalore',
    type: 'Under construction (near-ready)',
    priceRange: '₹1.16–1.75 Cr',
    size: '1,469–1,626 sqft SBA',
    contactApproach: 'RERA: PRM/KA/RERA/1251/472/PR/200515/003406. Contact Arvind SmartSpaces sales. Construction should be 85–90%+ by now — ask for site visit to see actual flat condition. Possession Jun 2026.',
    bestVisitTime: 'Weekday morning — earliest possession (Jun 2026) makes this time-critical',
    driveFromYelahanka: '~5 min',
    priority: 'Must Visit',
  },
  {
    id: 'brigade-insignia',
    rank: 4,
    name: 'Brigade Insignia',
    builder: 'Brigade Group',
    address: 'Kogilu Cross, Yelahanka, Bangalore – 560064',
    mapSearch: 'Brigade Insignia Kogilu Cross Yelahanka Bangalore',
    type: 'Under construction (long wait)',
    priceRange: '₹2.99–3.69 Cr',
    size: '2,145–2,481 sqft SBA',
    contactApproach: 'RERA: PR/180524/006894. Visit Brigade sales office. Understand payment milestone schedule. Only recommended if you want max size and can wait till Jun 2029. Budget is tight at ₹3 Cr for 3 BHK.',
    bestVisitTime: 'Day 2 — combine with Yelahanka site visits',
    driveFromYelahanka: '~8 min',
    priority: 'Visit if size matters most',
  },
];

// ── questions organised by who you're asking ─────────────────────────────

type QuestionTarget = 'broker' | 'seller' | 'resident' | 'rwa' | 'onsite';

interface Question {
  id: string;
  target: QuestionTarget;
  question: string;
  whyItMatters: string;
  redFlagAnswer: string;
}

const questions: Question[] = [
  // Legal
  { id: 'q1', target: 'seller', question: 'Can you share the original Occupancy Certificate (OC)?', whyItMatters: 'Without OC, the building is technically illegal. Banks won\'t give loans. You can\'t get utilities legally.', redFlagAnswer: 'CC only, no OC — or "OC is in process" — or any hesitation.' },
  { id: 'q2', target: 'seller', question: 'Is the Khata an A-Khata or B-Khata? Can you show the BBMP Khata certificate?', whyItMatters: 'B-Khata = property has legal issues, can\'t get home loan from most banks, difficult to resell.', redFlagAnswer: 'B-Khata, or "in conversion process", or they can\'t produce the document.' },
  { id: 'q3', target: 'seller', question: 'Can I see the Encumbrance Certificate (EC) for the past 15 years?', whyItMatters: 'Shows all transactions on the property — mortgages, loans, disputes. Anything outstanding is your problem after purchase.', redFlagAnswer: 'Any existing mortgage not disclosed, any gaps in EC history.' },
  { id: 'q4', target: 'seller', question: 'Is the property free of any bank loan? If mortgaged — NOC from bank?', whyItMatters: 'Many resale properties have existing home loans. You need bank NOC before you can register.', redFlagAnswer: 'Existing mortgage without NOC from lender bank.' },
  { id: 'q5', target: 'broker', question: 'What is the carpet area vs the SBA? What is the exact loading factor?', whyItMatters: 'Loading factor 20–25% is normal. Above 30% = you\'re paying for a lot of common area walls.', redFlagAnswer: 'Loading factor above 30%, or seller is unwilling to state carpet area explicitly.' },

  // Financial
  { id: 'q6', target: 'rwa', question: 'What are the current monthly maintenance charges per sqft?', whyItMatters: 'You\'ll pay this every month forever. Needs to fit your budget. Get the number in writing.', redFlagAnswer: 'Vague answer. Or current rate already ≥ ₹8/sqft.' },
  { id: 'q7', target: 'rwa', question: 'What is the current sinking fund balance? Can you share last year\'s audited accounts?', whyItMatters: 'Depleted sinking fund = special assessment bills landing on you after purchase.', redFlagAnswer: 'Refusal to share. Or sinking fund < 3 months of total society collections.' },
  { id: 'q8', target: 'rwa', question: 'Have there been any special assessments (one-time collections) in the past 3 years?', whyItMatters: 'History of special assessments = poorly managed finances. This pattern continues.', redFlagAnswer: 'More than one special assessment in 3 years.' },
  { id: 'q9', target: 'rwa', question: 'Are there any pending legal cases — against the builder or within the society?', whyItMatters: 'Litigation clouds the title and can freeze the society\'s RWA operations.', redFlagAnswer: 'Any active case, especially related to OC, land title, or builder disputes.' },
  { id: 'q10', target: 'seller', question: 'What is the car parking allotment for this unit? Is it in the sale deed?', whyItMatters: 'Covered dedicated parking must be in your name in the sale deed. Verbal promises are worthless.', redFlagAnswer: 'Parking is "first come first served", or not in sale deed.' },

  // Infrastructure
  { id: 'q11', target: 'rwa', question: 'Is DG power backup 100% (all points including AC) or only lights and fans?', whyItMatters: 'You WFH 3 days/week. A 2-hour outage that kills your AC and desktop = unacceptable.', redFlagAnswer: 'Partial backup only. Or DG covers just common areas.' },
  { id: 'q12', target: 'rwa', question: 'Which ISPs are currently active in the building? Is fiber ducting pre-installed?', whyItMatters: 'Getting a new ISP installed without existing ducting = weeks of delay and drilling.', redFlagAnswer: 'Only one ISP available, no fiber ducting, or builder-bundled ISP with no alternatives.' },
  { id: 'q13', target: 'rwa', question: 'What is the water source? BWSSB piped, borewell, or tanker?', whyItMatters: 'Tanker dependency = unreliable + costly. Needs to be BWSSB or borewell.', redFlagAnswer: 'Primary source is water tankers. Or water available only 2 hours per day.' },
  { id: 'q14', target: 'resident', question: 'Have you ever had water problems — shortage, tankers, or supply gaps?', whyItMatters: 'Residents will tell you the truth that the RWA won\'t.', redFlagAnswer: 'Regular shortages in summer. Tankers called in more than once a year.' },
  { id: 'q15', target: 'resident', question: 'How quickly does the RWA respond to maintenance complaints? What\'s the worst delay you\'ve experienced?', whyItMatters: 'As a solo resident, you\'ll depend on the RWA for repairs. Slow RWA = frustrating daily life.', redFlagAnswer: 'Complaints left unresolved for weeks. No digital tracking. RWA committee unresponsive.' },

  // Lifestyle
  { id: 'q16', target: 'resident', question: 'Is the building quiet on weekdays during working hours? Any construction, noise, or vibration issues?', whyItMatters: 'You WFH 3 days/week. Background noise on calls and work concentration matters.', redFlagAnswer: 'Construction nearby (ongoing for 2+ more years), generator noise, or heavy traffic vibration.' },
  { id: 'q17', target: 'resident', question: 'Is there a parcel/delivery management system? How do you handle deliveries when you\'re not home?', whyItMatters: 'You\'ll order frequently as a single adult WFH. Missing deliveries is a daily friction point.', redFlagAnswer: 'No dedicated delivery area. Guards refuse to accept parcels. No smart lockers.' },
  { id: 'q18', target: 'resident', question: 'What is the owner vs tenant ratio in your tower/block?', whyItMatters: 'High tenant % = transient community, less RWA engagement, more wear-and-tear.', redFlagAnswer: 'More than 50% tenants in the block you\'re considering.' },
  { id: 'q19', target: 'rwa', question: 'What is the visitor / guest parking policy? Can parents stay for 2–3 weeks without issues?', whyItMatters: 'Your parents will visit. Guest vehicle parking must be available. Some societies have strict guest policies.', redFlagAnswer: 'No visitor parking at all. Or guest stays require RWA permission beyond 7 days.' },
  { id: 'q20', target: 'seller', question: 'Why are you selling? How long have you lived here?', whyItMatters: 'Reason for selling reveals hidden issues — maintenance problems, neighbour disputes, society conflicts.', redFlagAnswer: 'Vague answer. Or multiple owners in quick succession (check EC). Or "maintenance charges are too high".' },
];

// ── on-site physical checklist ─────────────────────────────────────────────

const onsiteChecks: Record<string, TodoItem[]> = {
  'On Arrival': [
    { id: 'os1', content: 'Check guard shift coverage — is someone at gate at all times?', status: 'pending' },
    { id: 'os2', content: 'Test visitor entry process — did they log you in? Check CCTV at gate', status: 'pending' },
    { id: 'os3', content: 'Count the lift banks per tower — how many lifts? What\'s the wait?', status: 'pending' },
    { id: 'os4', content: 'Walk the ground floor — check for seepage, dampness on walls, drainage issues', status: 'pending' },
  ],
  'Inside the Flat': [
    { id: 'os5', content: 'Run every tap — check water pressure and colour (yellow = pipe issues)', status: 'pending' },
    { id: 'os6', content: 'Test every electrical switch and socket — note any that don\'t work', status: 'pending' },
    { id: 'os7', content: 'Check all windows for smooth opening, no cracks in frame or glass', status: 'pending' },
    { id: 'os8', content: 'Walk all walls looking for cracks, especially at corners and ceiling joints', status: 'pending' },
    { id: 'os9', content: 'Check flooring for hollow spots — tap with knuckle, hollow sound = de-bonding tile', status: 'pending' },
    { id: 'os10', content: 'Look at kitchen/bathroom walls for efflorescence (white salt deposits = moisture)', status: 'pending' },
    { id: 'os11', content: 'Open mains switch board — identify DG breakers vs EB breakers', status: 'pending' },
    { id: 'os12', content: 'Ask seller to switch to DG power — verify AC and all sockets work on backup', status: 'pending' },
    { id: 'os13', content: 'Test mobile signal in every room (different operators)', status: 'pending' },
    { id: 'os14', content: 'Identify the fiber/ISP conduit point in the flat — is it pre-wired?', status: 'pending' },
    { id: 'os15', content: 'Check orientation — which direction does living room window/balcony face?', status: 'pending' },
    { id: 'os16', content: 'Stand at WFH room window — check outside view: is there a wall/construction blocking light?', status: 'pending' },
  ],
  'Amenities & Common Areas': [
    { id: 'os17', content: 'Visit gym — check equipment condition, AC, cleanliness, hours board', status: 'pending' },
    { id: 'os18', content: 'Walk the jogging track fully — measure continuity, check surface quality', status: 'pending' },
    { id: 'os19', content: 'Check pool (if any) — clear water? Maintained? What are the hours?', status: 'pending' },
    { id: 'os20', content: 'Inspect common area lights, lobby condition, and paint state', status: 'pending' },
    { id: 'os21', content: 'Check the DG set room — is it well-maintained? Ask last servicing date', status: 'pending' },
    { id: 'os22', content: 'Look at basement/parking — is your spot accessible? Well-lit? Waterproofed?', status: 'pending' },
    { id: 'os23', content: 'Find the notice board / RWA board — check last AGM date and maintenance notices', status: 'pending' },
  ],
  'Surrounding Area': [
    { id: 'os24', content: 'Drive the last 1 km to the society — road quality, flooding risk, lighting at night', status: 'pending' },
    { id: 'os25', content: 'Locate nearest pharmacy and confirm if it\'s 24hr', status: 'pending' },
    { id: 'os26', content: 'Check Zomato/Swiggy for delivery availability at the exact address (not just the area)', status: 'pending' },
    { id: 'os27', content: 'Test Ola/Uber availability at the gate address — some new zones have patchy coverage', status: 'pending' },
  ],
};

const targetColors: Record<QuestionTarget, 'success' | 'warning' | 'danger' | 'info' | undefined> = {
  broker: 'info',
  seller: 'warning',
  resident: 'success',
  rwa: undefined,
  onsite: 'danger',
};

const targetLabels: Record<QuestionTarget, string> = {
  broker: 'Ask Broker',
  seller: 'Ask Seller',
  resident: 'Ask Resident',
  rwa: 'Ask RWA',
  onsite: 'Check Yourself',
};

export default function VisitGuide() {
  const [activeVisit, setActiveVisit] = useCanvasState<string>('visitId', 'prestige-royale');
  const [activeTarget, setActiveTarget] = useCanvasState<QuestionTarget | 'all'>('qTarget', 'all');
  const [checklistKey, setChecklistKey] = useCanvasState<string>('ckSection', 'On Arrival');

  const [checkedIds, setCheckedIds] = useCanvasState<Record<string, boolean>>('onsiteChecked', {});

  const toggleCheck = (id: string) => {
    setCheckedIds(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const onsiteItems = onsiteChecks[checklistKey].map(item => ({
    ...item,
    status: (checkedIds[item.id] ? 'completed' : 'pending') as TodoItem['status'],
  }));

  const visit = visits.find(v => v.id === activeVisit)!;

  const filteredQs = activeTarget === 'all' ? questions : questions.filter(q => q.target === activeTarget);

  const targets: (QuestionTarget | 'all')[] = ['all', 'seller', 'rwa', 'resident', 'broker'];

  return (
    <Stack gap={28} style={{ padding: '24px 28px', maxWidth: 980 }}>

      <Stack gap={4}>
        <H1>Property Visit Guide</H1>
        <Text tone="secondary">5 properties · 20 questions · 27-point on-site checklist · Use this as your field manual</Text>
      </Stack>

      <Grid columns={4} gap={14}>
        <Stat value="5" label="Properties to Visit" tone="info" />
        <Stat value="3" label="Must-Visit (Yelahanka)" tone="success" />
        <Stat value="20" label="Questions to Ask" tone="warning" />
        <Stat value="27" label="On-Site Checks" tone="danger" />
      </Grid>

      <Divider />

      {/* ── visit order ── */}
      <Stack gap={12}>
        <H2>Visit Schedule — Batch by Location</H2>
        <Card>
          <CardHeader trailing={<Pill label="Day 1" tone="success" size="sm" />}>
            Yelahanka Day — 3 properties, ~half day
          </CardHeader>
          <CardBody>
            <Stack gap={6}>
              <Text size="small">All three Yelahanka properties are within 10 min of each other. Do them in a single morning/afternoon block.</Text>
              <Table
                headers={['Order', 'Property', 'Time', 'Drive Between']}
                rows={[
                  ['9:00 AM', 'Prestige Royale Gardens', '60–75 min', 'Start here'],
                  ['10:30 AM', 'Godrej Avenues', '45–60 min', '~5 min drive'],
                  ['12:00 PM', 'Brigade Northridge (Kogilu Rd)', '60–75 min', '~8 min drive'],
                ]}
                striped
              />
            </Stack>
          </CardBody>
        </Card>
        <Card>
          <CardHeader trailing={<Pill label="Day 2" tone="warning" size="sm" />}>
            Thanisandra Day — 2 Sobha properties, same road
          </CardHeader>
          <CardBody>
            <Stack gap={6}>
              <Text size="small">Sobha City (RTM resale) and Sobha Athena (UC site) are both on Thanisandra Main Rd. Do them together on a separate day.</Text>
              <Table
                headers={['Order', 'Property', 'Time', 'Note']}
                rows={[
                  ['10:00 AM', 'Sobha City (Athena/Serenita)', '75–90 min', 'RTM — full checklist applies'],
                  ['12:00 PM', 'Sobha Athena UC Site', '45 min', 'Only if RTM options disappoint — UC check'],
                ]}
                striped
              />
            </Stack>
          </CardBody>
        </Card>
      </Stack>

      <Divider />

      {/* ── per property card ── */}
      <Stack gap={14}>
        <Row gap={8} align="center" wrap>
          <H2>Property Visit Details</H2>
          <Row gap={5} wrap>
            {visits.map(v => (
              <Pill
                key={v.id}
                active={activeVisit === v.id}
                tone={v.priority === 'Must Visit' ? 'success' : undefined}
                onClick={() => setActiveVisit(v.id)}
              >
                #{v.rank} {v.name.split(' ').slice(0, 2).join(' ')}
              </Pill>
            ))}
          </Row>
        </Row>

        <Grid columns={4} gap={12}>
          <Stat value={`#${visit.rank}`} label="Visit Priority" tone={visit.priority === 'Must Visit' ? 'success' : 'warning'} />
          <Stat value={visit.type} label="Property Type" tone={visit.type === 'RTM resale' ? 'success' : 'warning'} />
          <Stat value={visit.priceRange} label="Price Range" />
          <Stat value={visit.size} label="Unit Size" />
        </Grid>

        <Grid columns={2} gap={14}>
          <Card>
            <CardHeader trailing={<Pill label={visit.priority} tone={visit.priority === 'Must Visit' ? 'success' : 'warning'} size="sm" />}>
              Location & Contact
            </CardHeader>
            <CardBody>
              <Stack gap={6}>
                {[
                  ['Address', visit.address],
                  ['Google Maps', `Search: "${visit.mapSearch}"`],
                  ['Drive from Yelahanka NT', visit.driveFromYelahanka],
                  ['Best time to visit', visit.bestVisitTime],
                ].map(([label, val]) => (
                  <Stack key={label} gap={1}>
                    <Text size="small" weight="semibold">{label}</Text>
                    <Text size="small" tone="secondary">{val}</Text>
                  </Stack>
                ))}
              </Stack>
            </CardBody>
          </Card>
          <Card>
            <CardHeader trailing={<Pill label="Before you go" tone="info" size="sm" />}>
              How to Get Access
            </CardHeader>
            <CardBody>
              <Text size="small">{visit.contactApproach}</Text>
            </CardBody>
          </Card>
        </Grid>
      </Stack>

      <Divider />

      {/* ── questions ── */}
      <Stack gap={14}>
        <Row gap={8} align="center" wrap>
          <H2>20 Questions — Organised by Who to Ask</H2>
          <Row gap={5} wrap>
            {targets.map(t => (
              <Pill
                key={t}
                active={activeTarget === t}
                tone={t !== 'all' ? targetColors[t] : undefined}
                onClick={() => setActiveTarget(t)}
              >
                {t === 'all' ? 'All Questions' : targetLabels[t as QuestionTarget]}
              </Pill>
            ))}
          </Row>
        </Row>

        <Text size="small" tone="secondary">
          {filteredQs.length} question{filteredQs.length !== 1 ? 's' : ''} shown. Filter by who you're asking to use during the visit.
        </Text>

        <Table
          headers={['#', 'Ask', 'Question', 'Why It Matters', 'Red Flag Answer']}
          rows={filteredQs.map((q, i) => [
            `${i + 1}`,
            targetLabels[q.target],
            q.question,
            q.whyItMatters,
            q.redFlagAnswer,
          ])}
          rowTone={filteredQs.map(q =>
            q.target === 'seller' ? 'warning' :
            q.target === 'resident' ? 'success' : undefined
          )}
          striped
        />
      </Stack>

      <Divider />

      {/* ── on-site checklist ── */}
      <Stack gap={14}>
        <Row gap={8} align="center" wrap>
          <H2>On-Site Checklist — Check Off As You Go</H2>
          <Row gap={5} wrap>
            {Object.keys(onsiteChecks).map(k => (
              <Pill key={k} active={checklistKey === k} onClick={() => setChecklistKey(k)}>{k}</Pill>
            ))}
          </Row>
        </Row>

        <TodoListCard
          todos={onsiteItems}
          defaultExpanded
          onTodoClick={(todo) => toggleCheck(todo.id)}
        />

        <Text size="small" tone="secondary">
          Click any item to mark it done. Switch between sections using the tabs above. Use this on your phone during the visit.
        </Text>
      </Stack>

      <Divider />

      {/* ── what to bring ── */}
      <Stack gap={10}>
        <H2>What to Bring to Each Visit</H2>
        <Grid columns={2} gap={14}>
          <Card>
            <CardHeader trailing={<Pill label="Print or save offline" tone="info" size="sm" />}>Documents to Request on the Spot</CardHeader>
            <CardBody>
              <Stack gap={5}>
                {[
                  ['Occupancy Certificate (OC)', 'Physical copy or clear photo. Check issuing authority — BBMP or local planning authority.'],
                  ['Khata Certificate', 'Must say A-Khata. Check the BBMP ward number matches the property.'],
                  ['Latest maintenance receipt', 'Seller should have paid maintenance. Shows current rate and any arrears.'],
                  ['EC for 13+ years', 'Ask them to initiate EC search at sub-registrar if not ready — shows seriousness.'],
                  ['Approved building plan copy', 'Confirm floor and unit match what\'s on paper.'],
                ].map(([doc, note]) => (
                  <Stack key={doc} gap={1}>
                    <Text size="small" weight="semibold">{doc}</Text>
                    <Text size="small" tone="secondary">{note}</Text>
                  </Stack>
                ))}
              </Stack>
            </CardBody>
          </Card>
          <Card>
            <CardHeader trailing={<Pill label="Practical gear" tone="success" size="sm" />}>What to Have With You</CardHeader>
            <CardBody>
              <Stack gap={5}>
                {[
                  ['This canvas on your phone', 'Use the checklist and questions list during the visit.'],
                  ['Measuring tape', 'Verify carpet area of WFH room, master bedroom, kitchen. Don\'t trust brochure dimensions.'],
                  ['Compass app (phone)', 'Check flat orientation. Confirm north/east facing for WFH room.'],
                  ['Torch / phone flashlight', 'Check under sinks, inside storage, ceiling corners for moisture/pests.'],
                  ['Voice recorder (optional)', 'Record conversation with RWA/seller for reference. Tell them you\'re recording.'],
                  ['Notebook', 'Write observations immediately — you\'ll visit 5 places and memory blurs fast.'],
                ].map(([item, note]) => (
                  <Stack key={item} gap={1}>
                    <Text size="small" weight="semibold">{item}</Text>
                    <Text size="small" tone="secondary">{note}</Text>
                  </Stack>
                ))}
              </Stack>
            </CardBody>
          </Card>
        </Grid>
      </Stack>

      <Divider />

      {/* ── after each visit ── */}
      <Stack gap={10}>
        <H2>After Each Visit — Score It While Fresh</H2>
        <Text size="small" tone="secondary">Do this within 1 hour of leaving each property. Memory fades fast.</Text>
        <Table
          headers={['Dimension', 'Score 1–5', 'Your Notes']}
          rows={[
            ['First impression of common areas', '— / 5', 'Clean, maintained, or neglected?'],
            ['Flat condition & natural light', '— / 5', 'Bright, airy, vs dark, cramped?'],
            ['DG backup confirmed (all points)?', '— / 5', 'Tested on-site?'],
            ['Internet infrastructure', '— / 5', 'Fiber ducting present? ISPs available?'],
            ['Residents\' vibe & community', '— / 5', 'Friendly, engaged vs transient, uninterested?'],
            ['RWA / guard responsiveness', '— / 5', 'Professional vs disorganised?'],
            ['Water supply confidence', '— / 5', 'BWSSB + borewell vs tanker risk?'],
            ['Legal documents readiness', '— / 5', 'OC + Khata shown immediately vs hesitation?'],
            ['Overall gut feeling', '— / 5', 'Could you see yourself living here for 10 years?'],
          ]}
          striped
        />
        <Text size="small" tone="secondary">
          Any property scoring below 3 on legal documents, DG backup, or gut feeling — do not proceed further regardless of price or builder.
        </Text>
      </Stack>

    </Stack>
  );
}
