import {
  Card, CardBody, CardHeader,
  Divider, Grid, H1, H2, H3,
  Pill, Row, Stack, Stat, Table, Text,
  TodoListCard,
  useCanvasState,
} from 'cursor/canvas';

import type { TodoItem } from 'cursor/canvas';

// ── visit list ────────────────────────────────────────────────────────────

// Criteria ranks 1–10 = visit # (blr-property-criteria lock). Geography: Day 1 = ranks 3,5,6,7,8 · Day 2 = 2,10,9,1,4
const visits = [
  {
    id: 'purva-zenium-2',
    rank: 3,
    day: 1,
    name: 'Purva Zenium 2',
    builder: 'Puravankara Limited',
    address: 'Billamaranahalli Main Road, Hosahalli, North Bangalore – 560064',
    mapSearch: 'Purva Zenium 2 Hosahalli Bangalore',
    type: 'Under Construction (UC)',
    priceRange: '₹1.71–2.38 Cr (all-in ~₹1.82–2.53 Cr)',
    size: '1,231–1,710 sqft SBA',
    contactApproach: 'RERA: PRM/KA/RERA/1251/309/PR/071022/005303 — verify % completion on Karnataka RERA portal. Puravankara NSE-listed, 50yr track record. Ask for current unsold 3 BHK inventory, construction %, and construction-linked payment plan.',
    bestVisitTime: '9:00 AM Day 1',
    driveFromManyata: '~14 km / 24 min from Manyata Tech Park',
    priority: 'Criteria #3 — earliest Grade A keys',
  },
  {
    id: 'prestige-avon',
    rank: 5,
    day: 1,
    name: 'Prestige Avon',
    builder: 'Prestige Group',
    address: 'Thanisandra Main Road, North Bangalore – 560077',
    mapSearch: 'Prestige Avon Thanisandra Bangalore',
    type: 'Under Construction (UC)',
    priceRange: '₹3.2 Cr base (all-in ~₹3.41 Cr) — ~₹41L over ₹3 Cr ceiling',
    size: 'TBC on visit',
    contactApproach: 'RERA registered — confirm number at sales office. 230 units on 10 acres. Ask: any pricing flexibility near ₹3 Cr? Get sample agreement before paying anything. Ask for possession penalty clause. Possession est. Dec 2028.',
    bestVisitTime: '11:00 AM Day 1',
    driveFromManyata: '~10 km / 18–22 min from Manyata Tech Park',
    priority: 'Criteria #5 — Manyata + Metro (over ceiling)',
  },
  {
    id: 'sobha-athena',
    rank: 6,
    day: 1,
    name: 'Sobha Athena',
    builder: 'Sobha Limited',
    address: 'Thanisandra Main Road, North Bangalore – 560077',
    mapSearch: 'Sobha Athena Thanisandra Bangalore',
    type: 'Under Construction (UC)',
    priceRange: '~₹2.43 Cr all-in (est. — confirm)',
    size: 'TBC on visit',
    contactApproach: 'Verify RERA on K-RERA before booking. Boutique UC — compare finish vs Prestige Avon same day.',
    bestVisitTime: '1:15 PM Day 1',
    driveFromManyata: '~10–14 km / 18–25 min from Manyata Tech Park',
    priority: 'Criteria #6 — boutique Thanisandra vs Avon',
  },
  {
    id: 'prestige-camden',
    rank: 7,
    day: 1,
    name: 'Prestige Camden Gardens',
    builder: 'Prestige Group',
    address: 'Thanisandra Main Road, North Bangalore – 560077',
    mapSearch: 'Prestige Camden Gardens Thanisandra Bangalore',
    type: 'Under Construction (UC)',
    priceRange: '₹2.11–2.79 Cr band (confirm)',
    size: 'TBC on visit',
    contactApproach: 'RERA: PR/140524/006872 — verify full PRM on portal. Compare carpet + all-in vs Avon afternoon same day.',
    bestVisitTime: '3:15 PM Day 1',
    driveFromManyata: '~10 km / 18–22 min from Manyata Tech Park',
    priority: 'Criteria #7 — Prestige under ceiling',
  },
  {
    id: 'brigade-insignia',
    rank: 8,
    day: 1,
    name: 'Brigade Insignia',
    builder: 'Brigade Group',
    address: 'NH44 / Bellary Road near Kogilu, North Bangalore – 560064',
    mapSearch: 'Brigade Insignia Yelahanka Bangalore',
    type: 'Under Construction (UC)',
    priceRange: '₹3.18 Cr+ (confirm variant)',
    size: 'TBC on visit',
    contactApproach: 'Confirm RERA possession end date. Flagship size vs Eternia — budget edge.',
    bestVisitTime: '5:00 PM Day 1',
    driveFromManyata: '~12–18 km / 22–35 min from Manyata Tech Park',
    priority: 'Criteria #8 — NH44 flagship',
  },
  {
    id: 'sattva-lumina',
    rank: 2,
    day: 2,
    name: 'Sattva Lumina',
    builder: 'Salarpuria Sattva',
    address: 'Yelahanka-Doddaballapura Main Road (SH-9), Rajanukunte, Bangalore – 560064',
    mapSearch: 'Sattva Lumina Rajanukunte Yelahanka Bangalore',
    type: 'Under Construction (UC)',
    priceRange: '₹1.52–1.75 Cr (all-in ~₹1.62–1.87 Cr)',
    size: '1,450–1,780 sqft SBA',
    contactApproach: 'RERA: PR/060924/007009. Salarpuria Sattva NSE-listed, large portfolio. 12.8 acres, 1,553 units, 8 towers G+29. 3 clubhouses (35,000 sqft each). Ask for construction-linked payment plan and floor plan for Grand 3 BHK variant.',
    bestVisitTime: '9:00 AM Day 2',
    driveFromManyata: '~11 km / 25 min from Manyata Tech Park',
    priority: 'Criteria #2 — best ₹/sqft + township mass',
  },
  {
    id: 'birla-yelahanka',
    rank: 10,
    day: 2,
    name: 'Birla Yelahanka',
    builder: 'Birla Estates',
    address: 'Yelahanka, North Bangalore – 560064',
    mapSearch: 'Birla Yelahanka Bangalore',
    type: 'Under Construction (UC)',
    priceRange: 'TBC at sales office',
    size: 'TBC on visit',
    contactApproach: 'RERA: PRM/KA/RERA/1250/304/PR/190724/002725 — verify on portal before any token.',
    bestVisitTime: '10:45 AM Day 2',
    driveFromManyata: '~12–16 km / 22–30 min from Manyata Tech Park',
    priority: 'Criteria #10 — confirm price + RERA before booking',
  },
  {
    id: 'arvind-bel-air',
    rank: 9,
    day: 2,
    name: 'Arvind Bel Air',
    builder: 'Arvind SmartSpaces',
    address: 'Yelahanka New Town Road, North Bangalore – 560064',
    mapSearch: 'Arvind Bel Air Yelahanka Bangalore',
    type: 'Under Construction (UC)',
    priceRange: '₹1.29–1.95 Cr band (confirm)',
    size: 'TBC on visit',
    contactApproach: 'RERA suffix on hub — verify on K-RERA. Near-ready; compare finish vs Grade A peers.',
    bestVisitTime: '12:30 PM Day 2',
    driveFromManyata: '~13 km / 22–28 min from Manyata Tech Park',
    priority: 'Criteria #9 — 2026 keys + value (B+ builder)',
  },
  {
    id: 'brigade-eternia',
    rank: 1,
    day: 2,
    name: 'Brigade Eternia',
    builder: 'Brigade Group',
    address: 'Yelahanka New Town, Behind Police Station, Bangalore – 560064',
    mapSearch: 'Brigade Eternia Yelahanka Bangalore',
    type: 'Under Construction (UC)',
    priceRange: '₹2.26 Cr (all-in ~₹2.41 Cr)',
    size: '1,620–1,820 sqft SBA',
    contactApproach: 'RERA: PRM/KA/RERA/1251/309/PR/070325/007559. Brigade Group Grade A, NSE-listed. 14 acres, 1,124 units. Confirm possession date in writing — some sources say Mar 2030, others Dec 2030. Ask for penalty clause for delay.',
    bestVisitTime: '2:45 PM Day 2',
    driveFromManyata: '~15 km / 18 min from Manyata Tech Park',
    priority: 'Criteria #1 — all-rounder (highest deep-eval sum)',
  },
  {
    id: 'tata-varnam',
    rank: 4,
    day: 2,
    name: 'Tata Varnam',
    builder: 'Tata Housing',
    address: 'Shettigere Road, Devanahalli, North Bangalore – 562157',
    mapSearch: 'Tata Varnam Shettigere Devanahalli Bangalore',
    type: 'Under Construction (UC)',
    priceRange: '₹1.55–1.91 Cr (all-in ~₹1.65–2.04 Cr)',
    size: '1,681–2,061 sqft SBA',
    contactApproach: 'RERA: PR/110825/007988. Tata Housing — gold-standard Grade A builder. 70 acres within 135-acre Carnatica township. Ask for 3 BHK + 2T floor plan (1,681 sqft, ₹1.55 Cr). Check Manyata peak commute before deciding.',
    bestVisitTime: '4:45 PM Day 2',
    driveFromManyata: '~35–48 min off-peak from Manyata; peak 60–80 min',
    priority: 'Criteria #4 — builder + specs; commute gate',
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
  const [activeVisit, setActiveVisit] = useCanvasState<string>('visitId', 'brigade-eternia');
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
        <Text tone="secondary">10 UC criteria visits · 2-day geographic loop · 20 questions · 30-point checklist · Mirrors index.html PROPERTIES</Text>
      </Stack>

      <Grid columns={4} gap={14}>
        <Stat value="10" label="Properties to Visit" tone="info" />
        <Stat value="5+5" label="Day 1 / Day 2" tone="warning" />
        <Stat value="20" label="Questions to Ask" tone="warning" />
        <Stat value="30" label="On-Site Checks" tone="danger" />
      </Grid>

      <Divider />

      {/* ── visit order ── */}
      <Stack gap={12}>
        <H2>Visit schedule — criteria ranks vs clock</H2>
        <Text size="small" tone="secondary">
          Rank # = criteria priority from <Text weight="semibold" as="span">blr-property-criteria</Text> (locked Apr 2026). Times match <Text weight="semibold" as="span">index.html</Text>.
        </Text>
        <Table
          headers={['Day', 'Time', '#', 'Property']}
          rows={[
            ['1', '9:00 AM', '3', 'Purva Zenium 2'],
            ['1', '11:00 AM', '5', 'Prestige Avon'],
            ['1', '1:15 PM', '6', 'Sobha Athena'],
            ['1', '3:15 PM', '7', 'Prestige Camden Gardens'],
            ['1', '5:00 PM', '8', 'Brigade Insignia'],
            ['2', '9:00 AM', '2', 'Sattva Lumina'],
            ['2', '10:45 AM', '10', 'Birla Yelahanka'],
            ['2', '12:30 PM', '9', 'Arvind Bel Air'],
            ['2', '2:45 PM', '1', 'Brigade Eternia'],
            ['2', '4:45 PM', '4', 'Tata Varnam'],
          ]}
          striped
        />
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
                tone={v.rank <= 3 ? 'success' : 'warning'}
                onClick={() => setActiveVisit(v.id)}
              >
                #{v.rank} {v.name.split(' ').slice(0, 2).join(' ')}
              </Pill>
            ))}
          </Row>
        </Row>

        <Grid columns={4} gap={12}>
          <Stat value={`#${visit.rank}`} label="Criteria rank" tone={visit.rank <= 3 ? 'success' : 'warning'} />
          <Stat value={visit.type} label="Property Type" tone={visit.type === 'RTM resale' ? 'success' : 'warning'} />
          <Stat value={visit.priceRange} label="Price Range" />
          <Stat value={visit.size} label="Unit Size" />
        </Grid>

        <Grid columns={2} gap={14}>
          <Card>
            <CardHeader trailing={<Pill label={visit.priority} tone={visit.rank <= 3 ? 'success' : 'warning'} size="sm" />}>
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
