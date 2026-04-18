import {
  BarChart,
  Card, CardBody, CardHeader,
  Divider, Grid, H1, H2, H3,
  Pill, Row, Stack, Stat, Table, Text,
  useCanvasState,
} from 'cursor/canvas';

// ── amenity data ───────────────────────────────────────────────────────────

interface Amenity {
  name: string;
  category: 'internal' | 'external';
  priority: 'essential' | 'high' | 'nice' | 'skip';
  maintenanceImpact: 'high' | 'medium' | 'low' | 'none';
  whyItMatters: string;
  singleAdultNote: string;
}

const amenities: Amenity[] = [
  // Internal — Essential
  { name: 'Full DG Power Backup (100%)', category: 'internal', priority: 'essential', maintenanceImpact: 'high', whyItMatters: 'WFH 3 days/week — a 2-hour power cut kills your workday. Verify it covers full flat, not just common areas.', singleAdultNote: 'Non-negotiable. Ask: does backup cover all points including AC?' },
  { name: 'High-Speed Internet Infrastructure (Fiber)', category: 'internal', priority: 'essential', maintenanceImpact: 'low', whyItMatters: 'Fiber ducting pre-installed = Jio/ACT/Airtel can connect same day. No ducting = weeks of delay + drilling.', singleAdultNote: 'Check if building has active ISP agreements. Ask which ISPs are already connected.' },
  { name: 'Covered Parking (Dedicated)', category: 'internal', priority: 'essential', maintenanceImpact: 'low', whyItMatters: 'You commute 2 days/week. Covered parking protects the car. Verify it\'s dedicated (your name), not first-come-first-served.', singleAdultNote: 'Get parking allotment in writing. Ask to see the actual spot before buying.' },
  { name: 'Society-Level Security (24/7 + CCTV)', category: 'internal', priority: 'essential', maintenanceImpact: 'medium', whyItMatters: 'Single adult = sole occupant. Security quality matters for both daily comfort and emergency situations.', singleAdultNote: 'Check: are guards present at all 3 shifts? Is visitor management app-based (more reliable)?' },
  // Internal — High
  { name: 'Gym (Properly Equipped)', category: 'internal', priority: 'high', maintenanceImpact: 'medium', whyItMatters: 'Saves ₹1,500–3,000/month gym membership. 5-min walk = you actually use it. Verify it has free weights, not just cardio machines.', singleAdultNote: 'Visit the gym in person at 7 AM or 7 PM. If it has 3 treadmills and a broken bench — that\'s the reality.' },
  { name: 'Swimming Pool', category: 'internal', priority: 'high', maintenanceImpact: 'high', whyItMatters: 'Good for daily fitness and stress relief. Adds significant maintenance cost — only valuable if you\'ll actually use it weekly.', singleAdultNote: 'Be honest — will you swim regularly? If no, this is just increasing your maintenance charges.' },
  { name: 'Jogging Track / Walking Path', category: 'internal', priority: 'high', maintenanceImpact: 'low', whyItMatters: 'Daily 20-min walks within the society = huge health benefit. Low maintenance cost. Great for WFH break routine.', singleAdultNote: 'Check track length (min 200m for meaningful use) and surface quality (rubberised > concrete).' },
  { name: 'EV Charging in Parking', category: 'internal', priority: 'high', maintenanceImpact: 'low', whyItMatters: 'If you own or plan to own an EV, this saves ₹8,000–15,000 in retrofitting costs. Even if you don\'t — good for resale.', singleAdultNote: 'Ask if charging points are pre-installed or if conduit provision exists. Future-proofing matters.' },
  // Internal — Nice
  { name: 'Clubhouse (Large)', category: 'internal', priority: 'nice', maintenanceImpact: 'high', whyItMatters: 'Good for hosting gatherings or occasional community events. High maintenance cost relative to usage for a single adult.', singleAdultNote: 'Honest assessment: how often will you use a clubhouse as a solo resident? Adds ₹500–1,000/month to charges.' },
  { name: 'Co-Working / Study Room', category: 'internal', priority: 'nice', maintenanceImpact: 'low', whyItMatters: 'Newer projects offer this. Useful when you want a change of scenery from your home office. Emerging feature.', singleAdultNote: 'If available, check: number of seats, AC, quiet policy, booking system. A serious differentiator for WFH.' },
  { name: 'Rooftop / Sky Lounge', category: 'internal', priority: 'nice', maintenanceImpact: 'medium', whyItMatters: 'Good social space and view. More of a lifestyle amenity than a daily-use one.', singleAdultNote: 'Nice but don\'t pay a premium for it. Verify it\'s actually accessible (many are locked or restricted).' },
  { name: 'Café / Mini-Store Inside Society', category: 'internal', priority: 'nice', maintenanceImpact: 'low', whyItMatters: 'Convenience for snacks/coffee without leaving society. Useful on WFH days.', singleAdultNote: 'Check if it\'s actually operational in completed societies — many cafés in brochures never open.' },
  // Internal — Skip
  { name: 'Children\'s Play Area', category: 'internal', priority: 'skip', maintenanceImpact: 'low', whyItMatters: 'Not applicable to your household.', singleAdultNote: 'Irrelevant. Don\'t let its presence or absence affect your decision.' },
  { name: 'Creche / Daycare Room', category: 'internal', priority: 'skip', maintenanceImpact: 'low', whyItMatters: 'Not applicable.', singleAdultNote: 'Irrelevant.' },
  { name: 'Multiple Sports Courts (Cricket, etc.)', category: 'internal', priority: 'skip', maintenanceImpact: 'high', whyItMatters: 'High maintenance cost for low personal utility. Unless you play regularly.', singleAdultNote: 'Skip unless you actively play a sport. Adds to maintenance charges you\'ll pay monthly.' },
  // External — Essential
  { name: 'Hospital with Emergency (within 5 km)', category: 'external', priority: 'essential', maintenanceImpact: 'none', whyItMatters: 'As a solo occupant, medical emergency response time is critical. Nearest hospital should be under 15 min drive.', singleAdultNote: 'For Yelahanka: Columbia Asia Hebbal (10 min), Aster CMI Hebbal (12 min). Sufficient.' },
  { name: 'Supermarket / Grocery (within 2 km)', category: 'external', priority: 'essential', maintenanceImpact: 'none', whyItMatters: 'Daily essentials. DMart / More / Spar should be within easy driving distance. Blinkit/Swiggy Instamart as backup.', singleAdultNote: 'Check Blinkit / Zepto coverage for your specific address. 10-min delivery = substitute for nearby store.' },
  { name: 'Pharmacy 24hr (within 2 km)', category: 'external', priority: 'essential', maintenanceImpact: 'none', whyItMatters: 'Solo living means no one to send for medicine. A 24-hr pharmacy within 2 km is practical safety net.', singleAdultNote: 'MedPlus and Apollo Pharmacy have 24hr outlets near most Yelahanka residential zones.' },
  // External — High
  { name: 'Restaurants / Cafes (within 3 km)', category: 'external', priority: 'high', maintenanceImpact: 'none', whyItMatters: 'On WFH days you\'ll eat out or order in. Good dining options = quality of daily life.', singleAdultNote: 'Yelahanka has decent café culture growing — check specific pockets (Sahakar Nagar, New Town have better options).' },
  { name: 'Fuel Station (within 3 km)', category: 'external', priority: 'high', maintenanceImpact: 'none', whyItMatters: 'Practical for daily driving. Indian Oil / HPCL / BPCL — should be within easy reach.', singleAdultNote: 'NH44 has multiple fuel stations. Not a concern for Yelahanka.' },
  { name: 'Bank / ATM (within 2 km)', category: 'external', priority: 'high', maintenanceImpact: 'none', whyItMatters: 'Less critical in UPI era but still needed occasionally.', singleAdultNote: 'Yelahanka New Town has all major banks. Covered.' },
];

const internalEssential = amenities.filter(a => a.category === 'internal' && a.priority === 'essential');
const internalHigh = amenities.filter(a => a.category === 'internal' && a.priority === 'high');
const internalNice = amenities.filter(a => a.category === 'internal' && a.priority === 'nice');
const internalSkip = amenities.filter(a => a.category === 'internal' && a.priority === 'skip');
const externalList = amenities.filter(a => a.category === 'external');

// maintenance cost model
function maintenanceCost(sqft: number, complexityLevel: 'basic' | 'standard' | 'premium'): number {
  const rates = { basic: 3.5, standard: 5.5, premium: 8 };
  return Math.round(sqft * rates[complexityLevel]);
}

export default function AmenitiesAnalysis() {
  const [sqft, setSqft] = useCanvasState<number>('amenSqft', 1800);
  const sqftOptions = [1400, 1600, 1800, 2000, 2200];

  const basicCost = maintenanceCost(sqft, 'basic');
  const standardCost = maintenanceCost(sqft, 'standard');
  const premiumCost = maintenanceCost(sqft, 'premium');

  return (
    <Stack gap={28} style={{ padding: '24px 28px', maxWidth: 960 }}>

      <Stack gap={4}>
        <H1>Amenities</H1>
        <Text tone="secondary">Single adult · WFH 3 days · What actually matters vs what's just marketing</Text>
      </Stack>

      <Grid columns={4} gap={14}>
        <Stat value="4" label="Non-Negotiable Internals" tone="danger" />
        <Stat value="Gym + Track" label="Most Used Daily" tone="success" />
        <Stat value="Pool + Club" label="High Cost, Low Use" tone="warning" />
        <Stat value="Power Backup" label="WFH Critical" tone="danger" />
      </Grid>

      <Card>
        <CardHeader trailing={<Pill label="The amenity trap" tone="warning" size="sm" />}>
          More Amenities = Higher Maintenance, Not Better Living
        </CardHeader>
        <CardBody>
          <Stack gap={8}>
            <Text size="small">Builders use amenity counts as marketing — "30 amenities!" sounds impressive. But each amenity you don't use still costs you monthly. A society with a rooftop pool, squash court, creche, and amphitheatre charges ₹7–9/sqft in maintenance. One with just a gym, jogging track, and solid security charges ₹3.5–5/sqft.</Text>
            <Grid columns={3} gap={14}>
              <Stack gap={4}>
                <Text size="small" weight="semibold">Basic Society (gym + track + security)</Text>
                <Text size="small" tone="secondary">₹3–4/sqft/month</Text>
                <Text size="small" tone="secondary">1,800 sqft = ₹5,400–7,200/mo</Text>
              </Stack>
              <Stack gap={4}>
                <Text size="small" weight="semibold">Standard Society (+ pool + clubhouse)</Text>
                <Text size="small" tone="secondary">₹5–6/sqft/month</Text>
                <Text size="small" tone="secondary">1,800 sqft = ₹9,000–10,800/mo</Text>
              </Stack>
              <Stack gap={4}>
                <Text size="small" weight="semibold">Premium Society (everything)</Text>
                <Text size="small" tone="secondary">₹7–10/sqft/month</Text>
                <Text size="small" tone="secondary">1,800 sqft = ₹12,600–18,000/mo</Text>
              </Stack>
            </Grid>
            <Text size="small" tone="secondary">As a single adult, optimise for amenities you'll actually use daily. Don't pay ₹8,000/month extra for a cricket pitch and amphitheatre.</Text>
          </Stack>
        </CardBody>
      </Card>

      <Divider />

      {/* ── maintenance cost calculator ── */}
      <Stack gap={12}>
        <H2>Maintenance Cost by Flat Size & Society Type</H2>
        <Stack gap={8}>
          <Row gap={6} align="center">
            <Text size="small" weight="semibold">Your flat SBA:</Text>
            <Row gap={6}>
              {sqftOptions.map(s => (
                <Pill key={s} active={sqft === s} onClick={() => setSqft(s)}>{s} sqft</Pill>
              ))}
            </Row>
          </Row>

          <Grid columns={3} gap={14}>
            <Card>
              <CardHeader trailing={<Pill label="Recommended" tone="success" size="sm" />}>
                Basic-Standard Society
              </CardHeader>
              <CardBody>
                <Stack gap={6}>
                  <Stat value={`₹${basicCost.toLocaleString('en-IN')}/mo`} label="Estimated Maintenance" tone="success" />
                  <Text size="small" tone="secondary">Gym, jogging track, 24/7 security, power backup, parking. No pool or large clubhouse.</Text>
                  <Text size="small" tone="secondary">Annual: ₹{(basicCost * 12).toLocaleString('en-IN')}</Text>
                </Stack>
              </CardBody>
            </Card>
            <Card>
              <CardHeader trailing={<Pill label="Typical" tone="neutral" size="sm" />}>
                Standard Society
              </CardHeader>
              <CardBody>
                <Stack gap={6}>
                  <Stat value={`₹${standardCost.toLocaleString('en-IN')}/mo`} label="Estimated Maintenance" />
                  <Text size="small" tone="secondary">All of above + pool, clubhouse, sports courts. Most premium builder projects fall here.</Text>
                  <Text size="small" tone="secondary">Annual: ₹{(standardCost * 12).toLocaleString('en-IN')}</Text>
                </Stack>
              </CardBody>
            </Card>
            <Card>
              <CardHeader trailing={<Pill label="Avoid for solo" tone="warning" size="sm" />}>
                Over-Amenitised Society
              </CardHeader>
              <CardBody>
                <Stack gap={6}>
                  <Stat value={`₹${premiumCost.toLocaleString('en-IN')}/mo`} label="Estimated Maintenance" tone="danger" />
                  <Text size="small" tone="secondary">Everything + rooftop, squash, amphitheatre, concierge, spa. You pay for all of it monthly.</Text>
                  <Text size="small" tone="secondary">Annual: ₹{(premiumCost * 12).toLocaleString('en-IN')}</Text>
                </Stack>
              </CardBody>
            </Card>
          </Grid>
        </Stack>
      </Stack>

      <Divider />

      {/* ── internal amenity priority ── */}
      <Stack gap={14}>
        <H2>Internal Amenities — Priority for a Single WFH Adult</H2>

        <Stack gap={10}>
          <Row gap={6} align="center">
            <H3>Non-Negotiable — Walk Away If Missing</H3>
            <Pill label="4 items" tone="warning" size="sm" />
          </Row>
          <Table
            headers={['Amenity', 'Why Critical', 'How to Verify']}
            rows={internalEssential.map(a => [a.name, a.whyItMatters, a.singleAdultNote])}
            rowTone={internalEssential.map(() => 'danger')}
            striped
          />
        </Stack>

        <Stack gap={10}>
          <Row gap={6} align="center">
            <H3>High Priority — Strong Preference</H3>
            <Pill label="4 items" size="sm" />
          </Row>
          <Table
            headers={['Amenity', 'Why It Matters', 'Honest Check']}
            rows={internalHigh.map(a => [a.name, a.whyItMatters, a.singleAdultNote])}
            rowTone={internalHigh.map(() => 'warning')}
            striped
          />
        </Stack>

        <Stack gap={10}>
          <Row gap={6} align="center">
            <H3>Nice to Have — Don't Pay Premium For</H3>
            <Pill label="4 items" size="sm" />
          </Row>
          <Table
            headers={['Amenity', 'Reality Check', 'Single Adult Note']}
            rows={internalNice.map(a => [a.name, a.whyItMatters, a.singleAdultNote])}
            striped
          />
        </Stack>

        <Stack gap={10}>
          <Row gap={6} align="center">
            <H3>Completely Irrelevant — Do Not Factor Into Decision</H3>
            <Pill label="3 items" tone="neutral" size="sm" />
          </Row>
          <Table
            headers={['Amenity', 'Why Irrelevant']}
            rows={internalSkip.map(a => [a.name, a.singleAdultNote])}
            rowTone={internalSkip.map(() => 'neutral')}
            striped
          />
        </Stack>
      </Stack>

      <Divider />

      {/* ── external amenities ── */}
      <Stack gap={12}>
        <H2>External Amenities — What Yelahanka Delivers</H2>
        <Table
          headers={['Amenity', 'Priority', 'Yelahanka Situation']}
          rows={externalList.map(a => [
            a.name,
            a.priority.charAt(0).toUpperCase() + a.priority.slice(1),
            a.singleAdultNote,
          ])}
          rowTone={externalList.map(a =>
            a.priority === 'essential' ? 'warning' : undefined
          )}
          striped
        />
      </Stack>

      <Divider />

      {/* ── WFH specific ── */}
      <Stack gap={12}>
        <H2>WFH-Specific Amenity Checklist — Ask These Before Buying</H2>
        <Grid columns={2} gap={14}>
          <Card>
            <CardHeader trailing={<Pill label="Ask the builder / seller" tone="warning" size="sm" />}>
              Power & Internet Questions
            </CardHeader>
            <CardBody>
              <Stack gap={5}>
                {[
                  ['DG backup scope', 'Does backup cover all points (lights + fans + AC + plug points) or only lights?'],
                  ['DG switchover time', 'How many seconds of gap when power fails? Above 10 sec = inverter needed for computer'],
                  ['ISPs connected', 'Which ISPs have active connections in the building? (Jio Fiber, ACT, Airtel FTH)'],
                  ['Fiber duct', 'Is fiber conduit pre-installed to each flat? Or does each owner have to arrange separately?'],
                  ['Backup internet', 'Does society have a shared WiFi backup for common areas? (nice for terrace WFH)'],
                ].map(([q, detail]) => (
                  <Stack key={q} gap={1}>
                    <Text size="small" weight="semibold">{q}</Text>
                    <Text size="small" tone="secondary">{detail}</Text>
                  </Stack>
                ))}
              </Stack>
            </CardBody>
          </Card>

          <Card>
            <CardHeader trailing={<Pill label="Verify in person" tone="success" size="sm" />}>
              On-Site Checks on Your Visit
            </CardHeader>
            <CardBody>
              <Stack gap={5}>
                {[
                  ['Visit the gym at peak hour', '7–8 AM or 7–8 PM. See actual usage, equipment condition, cleanliness.'],
                  ['Walk the jogging track', 'Is it continuous? Rubberised surface? Well-lit at night?'],
                  ['Test the lifts', 'Wait time, cabin condition, backup lift count per tower'],
                  ['Check visitor parking', 'When parents/friends visit, where do they park? Many societies have no visitor bays.'],
                  ['Look at package room / delivery area', 'For WFH: a well-organised delivery room means you don\'t miss packages.'],
                  ['Ask about parcel lockers', 'Smart parcel lockers = no need to be present for deliveries'],
                ].map(([action, detail]) => (
                  <Stack key={action} gap={1}>
                    <Text size="small" weight="semibold">{action}</Text>
                    <Text size="small" tone="secondary">{detail}</Text>
                  </Stack>
                ))}
              </Stack>
            </CardBody>
          </Card>
        </Grid>
      </Stack>

      <Divider />

      <Stack gap={10}>
        <H2>The Ideal Amenity Package for Your Profile</H2>
        <Table
          headers={['Category', 'Must Have', 'Good to Have', 'Don\'t Pay Extra For']}
          rows={[
            ['Power', '100% DG backup (all points)', 'Solar common area lighting', 'Fancy generator room tour'],
            ['Internet', 'Fiber ducting + 2 ISP options', 'Society WiFi backup', 'Dedicated ISP only deals'],
            ['Fitness', 'Gym with free weights', 'Jogging track (rubberised)', 'Pool (unless you swim daily)'],
            ['Security', '24/7 guards + CCTV + intercom', 'App-based visitor management', 'Biometric if basic CCTV is good'],
            ['Work', 'Quiet WFH-friendly building', 'Co-working room', 'Business centre (never used)'],
            ['Convenience', 'Covered dedicated parking', 'Package / delivery room', 'Concierge (adds to charges)'],
            ['Social', 'Basic clubhouse', 'Rooftop / garden area', 'Amphitheatre, skating rink, etc.'],
          ]}
          rowTone={[undefined, undefined, undefined, undefined, 'success', undefined, undefined]}
          striped
        />
        <Text size="small" tone="secondary">
          Target a society with the "Must Have" column fully covered and most of "Good to Have." Any society pushing heavily on the "Don't Pay Extra For" column is using amenity inflation to justify price — look past it.
        </Text>
      </Stack>

    </Stack>
  );
}
