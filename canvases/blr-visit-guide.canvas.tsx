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

type QuestionTarget = 'sales' | 'rera' | 'buyer' | 'site';

interface Question {
  id: string;
  target: QuestionTarget;
  question: string;
  whyItMatters: string;
  redFlagAnswer: string;
}

const questions: Question[] = [
  // RERA & Legal
  { id: 'q1', target: 'sales', question: 'Show me the original RERA registration certificate. What is the registered RERA number?', whyItMatters: 'Every UC property must be RERA registered. Without it the project is illegal to sell.', redFlagAnswer: '"RERA is in process" or number not searchable on rera.karnataka.gov.in.' },
  { id: 'q2', target: 'rera', question: 'On Karnataka RERA portal: what % completion is certified for this project?', whyItMatters: 'RERA-certified % is the legally verified progress. If builder claims 60% but RERA shows 20%, that is a red flag.', redFlagAnswer: 'Large gap between builder claim and RERA-certified %. Any unresolved complaints filed.' },
  { id: 'q3', target: 'rera', question: 'Are there any complaints or notices filed against this project on the RERA portal?', whyItMatters: 'Any active complaint signals buyer disputes, delays, or legal risk you inherit.', redFlagAnswer: 'Any open complaint, show-cause notice, or penalty order on the project.' },
  { id: 'q4', target: 'sales', question: 'What is the exact possession penalty clause if delivery is delayed beyond the RERA date?', whyItMatters: 'RERA mandates compensation for delay. Many builder agreements bury weak penalty clauses.', redFlagAnswer: 'No penalty clause, penalty less than SBI PLR, or "we have never delayed" without written commitment.' },
  { id: 'q5', target: 'sales', question: 'Can I take a sample builder-buyer agreement today — before paying booking amount?', whyItMatters: 'The agreement is the only thing that legally protects you. You must review it before committing any money.', redFlagAnswer: '"We share only after booking" — walk away. No legitimate builder refuses this.' },

  // Payment & Financial
  { id: 'q6', target: 'sales', question: 'Show me the full construction-linked payment schedule — which milestone triggers which % payment?', whyItMatters: 'Construction-linked plan protects you: you pay only when floors are built. Time-linked plan = you pay even if construction stalls.', redFlagAnswer: 'Time-linked schedule (payment by calendar date, not milestone). Or more than 20% due at booking.' },
  { id: 'q7', target: 'sales', question: 'What is the cancellation and refund policy? How long does a full refund take after cancellation?', whyItMatters: 'Under RERA, refund must be within 45 days with interest. Many agreements hide longer timelines.', redFlagAnswer: 'Refund timeline > 45 days, forfeiture of more than 2% of value, or no interest on delayed refund.' },
  { id: 'q8', target: 'sales', question: 'Is the car parking allotment included in the base price? Will it be named in my sale agreement from day one?', whyItMatters: 'Many builders charge parking separately or allot it verbally. It must be in the agreement with a specific bay number.', redFlagAnswer: 'Parking charged separately post-possession, allotted on first-come basis, or not in agreement.' },
  { id: 'q9', target: 'sales', question: 'What are the projected maintenance charges per sqft after possession? Who manages the society initially?', whyItMatters: 'Builder-appointed maintenance companies often overcharge for 2–3 years before RWA takes over.', redFlagAnswer: 'Rate not declared, or builder\'s own MC with no RWA handover timeline.' },

  // Construction Quality
  { id: 'q10', target: 'site', question: 'Is active construction happening today? Count the workers visible on site.', whyItMatters: 'Ghost sites with no workers are a sign of cash flow problems or stalled construction.', redFlagAnswer: 'No workers visible on a weekday morning. Crane idle. No concrete pours in recent weeks.' },
  { id: 'q11', target: 'site', question: 'Note which floor has construction reached. Does it match the RERA completion % you checked?', whyItMatters: 'If RERA shows 50% complete but only 3 floors of a 20-floor building are up, something is misreported.', redFlagAnswer: 'Floor count vs RERA % doesn\'t add up. Builder is unable to explain the gap.' },
  { id: 'q12', target: 'site', question: 'In any exposed concrete or completed sections, check for honeycombing (porous/hollow surface) or visible seepage.', whyItMatters: 'Honeycombing = voids in concrete = structural weakness. Seepage early = waterproofing failure.', redFlagAnswer: 'Visible honeycombing in load-bearing columns. Water stains on completed ceilings.' },
  { id: 'q13', target: 'sales', question: 'Who are your structural consultants and MEP (mechanical/electrical/plumbing) contractors?', whyItMatters: 'Grade A projects use named, reputable consultants. Evasiveness on this = cost-cutting on engineering.', redFlagAnswer: 'Unwilling to name firms. Or all in-house with no independent structural oversight.' },

  // Sample Flat / Agreement
  { id: 'q14', target: 'site', question: 'If a sample flat is available, measure the WFH room: minimum 10×11 ft for a comfortable desk setup?', whyItMatters: 'Floor plans shown in brochures are often misleading. Measure in person.', redFlagAnswer: 'WFH/study room is below 100 sqft. Or there is no third room at all.' },
  { id: 'q15', target: 'site', question: 'Check the sample flat door/window frames, tile quality, bathroom finish. Does it match the price point?', whyItMatters: 'Sample flats get best-quality finishes. Actual delivery is typically one grade below. Factor in accordingly.', redFlagAnswer: 'Cheap hollow-core doors, visible grout issues in tiles, or thin glass panes on windows.' },
  { id: 'q16', target: 'sales', question: 'What is the carpet area registered on RERA? What is the loading factor (SBA vs carpet)?', whyItMatters: 'Loading factor above 30% = you pay for too much corridor/lobby space. RERA-registered carpet area is the legal binding size.', redFlagAnswer: 'Loading factor above 30%, or carpet area not explicitly registered on RERA filing.' },

  // Infrastructure Promises
  { id: 'q17', target: 'sales', question: 'What DG power backup is planned — 100% all points including AC, or only lights and fans?', whyItMatters: 'You WFH 3 days/week. Partial DG backup = your desktop and AC cut out during Bangalore\'s frequent power cuts.', redFlagAnswer: 'Partial backup only. Or "will decide post-possession". Or DG covers only common areas.' },
  { id: 'q18', target: 'sales', question: 'Are fiber/ISP conduits being built into the structure during construction? Which ISPs will be permitted?', whyItMatters: 'Retrofitting internet ducting after possession = drilling walls and weeks of delay.', redFlagAnswer: 'No pre-ducting planned. Only one bundled ISP. Or "managed service" where you can\'t choose your own provider.' },
  { id: 'q19', target: 'sales', question: 'What is the planned water source — BWSSB piped connection, borewell, or initially tanker?', whyItMatters: 'BWSSB connection takes 1–2 years post-OC. Some societies run on tanker water for years after possession.', redFlagAnswer: '"Tanker initially with no BWSSB plan." Or "borewell only" with no BWSSB application filed.' },

  // Other Buyers
  { id: 'q20', target: 'buyer', question: 'Have you visited the builder\'s other completed projects? Does the actual quality match what was shown in the sample flat?', whyItMatters: 'The best predictor of what you will receive is what the builder has already delivered at similar price points.', redFlagAnswer: 'Major quality gap between sample and delivery. Unresolved defect complaints 1 year after possession.' },
];

// ── on-site physical checklist ─────────────────────────────────────────────

const onsiteChecks: Record<string, TodoItem[]> = {
  'At Sales Office': [
    { id: 'os1', content: 'Ask for the physical RERA certificate — check that the number matches what you were told', status: 'pending' },
    { id: 'os2', content: 'Open rera.karnataka.gov.in on your phone — search the RERA number right now in front of them', status: 'pending' },
    { id: 'os3', content: 'Note RERA completion % on portal — does it match what the sales team just told you?', status: 'pending' },
    { id: 'os4', content: 'Scroll the RERA project page for any complaints, show-cause notices, or penalties', status: 'pending' },
    { id: 'os5', content: 'Ask for sample builder-buyer agreement — take it home, do NOT sign anything today', status: 'pending' },
    { id: 'os6', content: 'Write down possession date and the exact penalty clause amount per month of delay', status: 'pending' },
    { id: 'os7', content: 'Get the full construction-linked payment milestone schedule in writing', status: 'pending' },
    { id: 'os8', content: 'Confirm parking is included in base price — ask if it will be named in sale agreement', status: 'pending' },
    { id: 'os9', content: 'Ask for the RERA-registered carpet area for your chosen unit type — note it down', status: 'pending' },
    { id: 'os10', content: 'Ask for projected maintenance charges per sqft post-possession and who the initial MC will be', status: 'pending' },
  ],
  'At Construction Site': [
    { id: 'os11', content: 'Count workers visible on site — active construction is a good sign, empty site is a red flag', status: 'pending' },
    { id: 'os12', content: 'Note which floor construction has reached — does it match the RERA % you checked?', status: 'pending' },
    { id: 'os13', content: 'Look at exposed concrete columns/beams — any honeycombing (porous, rocky surface = structural weakness)', status: 'pending' },
    { id: 'os14', content: 'Check any completed floors for visible seepage, water stains, or efflorescence (white salt crust)', status: 'pending' },
    { id: 'os15', content: 'Look at the quality of visible block/brick work — even rows, proper mortar, no gaps', status: 'pending' },
    { id: 'os16', content: 'Check if waterproofing work is visible on completed terrace/roof areas', status: 'pending' },
    { id: 'os17', content: 'Ask if you can walk any completed floor to see the actual slab size and room dimensions', status: 'pending' },
    { id: 'os18', content: 'Look at construction material on site — branded cement bags (Ultratech/ACC), good-quality steel', status: 'pending' },
  ],
  'Sample Flat Check': [
    { id: 'os19', content: 'Measure the WFH/study room with tape — minimum 10×11 ft for a usable desk setup', status: 'pending' },
    { id: 'os20', content: 'Check orientation — which direction does the main balcony/living room face?', status: 'pending' },
    { id: 'os21', content: 'Stand at WFH room window — is there natural light? Is the view blocked by another building?', status: 'pending' },
    { id: 'os22', content: 'Open and close every door — check for solid core, smooth hinges, no warping', status: 'pending' },
    { id: 'os23', content: 'Check window frames — aluminium thickness, glass thickness (min 5mm), smooth sliding', status: 'pending' },
    { id: 'os24', content: 'Check bathroom tile quality and grout lines — any lippage or hollow tiles?', status: 'pending' },
    { id: 'os25', content: 'Check kitchen platform finish and sink quality — granite/quartz or cheap laminate?', status: 'pending' },
  ],
  'Surrounding Area': [
    { id: 'os26', content: 'Drive the last 1 km to the site — road quality, flooding risk, lighting at night', status: 'pending' },
    { id: 'os27', content: 'Look at adjacent plots — any large construction planned that will block your view or add noise?', status: 'pending' },
    { id: 'os28', content: 'Test Ola/Uber availability at the site address — some new zones have patchy coverage', status: 'pending' },
    { id: 'os29', content: 'Test Zomato/Swiggy delivery at the exact gate address (not just the area)', status: 'pending' },
    { id: 'os30', content: 'Locate nearest pharmacy — is it 24hr? How far is the nearest hospital?', status: 'pending' },
  ],
};

const targetColors: Record<QuestionTarget, 'success' | 'warning' | 'danger' | 'info' | undefined> = {
  sales: 'warning',
  rera: 'danger',
  buyer: 'success',
  site: 'info',
};

const targetLabels: Record<QuestionTarget, string> = {
  sales: 'Ask Sales',
  rera: 'Check RERA',
  buyer: 'Ask Buyers',
  site: 'Check Site',
};

export default function VisitGuide() {
  const [activeVisit, setActiveVisit] = useCanvasState<string>('visitId', 'sobha-athena');
  const [activeTarget, setActiveTarget] = useCanvasState<QuestionTarget | 'all'>('qTarget', 'all');
  const [checklistKey, setChecklistKey] = useCanvasState<string>('ckSection', 'At Sales Office');

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

  const targets: (QuestionTarget | 'all')[] = ['all', 'sales', 'rera', 'buyer', 'site'];

  return (
    <Stack gap={28} style={{ padding: '24px 28px', maxWidth: 980 }}>

      <Stack gap={4}>
        <H1>Property Visit Guide — UC Edition</H1>
        <Text tone="secondary">4 UC properties · 20 questions · 30-point checklist · All new build, no RTM</Text>
      </Stack>

      <Grid columns={4} gap={14}>
        <Stat value="4" label="Properties to Visit" tone="info" />
        <Stat value="2" label="Day 1 (Thanisandra)" tone="warning" />
        <Stat value="20" label="Questions to Ask" tone="warning" />
        <Stat value="30" label="On-Site Checks" tone="danger" />
      </Grid>

      <Divider />

      {/* ── visit order ── */}
      <Stack gap={12}>
        <H2>Visit Schedule — Batch by Location</H2>
        <Card>
          <CardHeader trailing={<Pill label="Day 1" tone="warning" size="sm" />}>
            Thanisandra — 2 Grade A UC sites, same road
          </CardHeader>
          <CardBody>
            <Stack gap={6}>
              <Text size="small">Sobha Athena and Prestige Camden are both on Thanisandra Main Rd. Visit sales offices + construction sites in one go.</Text>
              <Table
                headers={['Order', 'Property', 'Time', 'Note']}
                rows={[
                  ['10:00 AM', 'Sobha Athena (UC)', '60–75 min', 'Ask for RERA cert + payment schedule'],
                  ['12:00 PM', 'Prestige Camden Gardens (UC)', '60 min', 'RERA: PR/140524/006872 — verify on portal'],
                ]}
                striped
              />
            </Stack>
          </CardBody>
        </Card>
        <Card>
          <CardHeader trailing={<Pill label="Day 2" tone="info" size="sm" />}>
            Yelahanka — 2 UC sites, 5–8 min apart
          </CardHeader>
          <CardBody>
            <Stack gap={6}>
              <Text size="small">Arvind Bel Air (Jun 2026, near-ready) and Brigade Insignia (2029, only if size matters most). Both in Yelahanka.</Text>
              <Table
                headers={['Order', 'Property', 'Time', 'Note']}
                rows={[
                  ['10:00 AM', 'Arvind Bel Air (UC ~90% done)', '60–75 min', 'Earliest possession — check actual flat condition'],
                  ['12:00 PM', 'Brigade Insignia (UC 2029)', '45 min', 'Only if size > timeline is your priority'],
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
