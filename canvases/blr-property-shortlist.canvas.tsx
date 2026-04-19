import {
  Card, CardBody, CardHeader,
  Divider, Grid, H1, H2, H3,
  Pill, Row, Stack, Stat, Table, Text,
} from 'cursor/canvas';

/**
 * Unified North-BLR property hub (Apr 2026).
 * Replaces former canvases: blr-project-selection, blr-research-snapshot, blr-shortlist-ten, and the old bar-chart shortlist.
 * Aligns with blr-property-criteria (10 category families + TEN_POINT), blr-deep-eval (full matrices where written), index/analysis facts.
 * Whittle 20 → top 10 → visits: freeze your ranked top 10, then site-visit every finalist; sync index.html PROPERTIES / analysis / deep-eval in that order. Trk = eval tier while ranking, not “C-only visits.”
 */

type Track = 'C' | 'E' | 'W' | 'R';

interface HubRow {
  n: number;
  track: Track;
  name: string;
  builder: string;
  grade: string;
  area: string;
  allIn: string;
  oc: string;
  /** Σ /100 = sum of ten blr-deep-eval scores where that canvas has a full write-up. ·ext / ·est / ·ref / ·bench = scaled or bench estimates. */
  score: string;
  lead: string;
  research: string;
}

const HUB: HubRow[] = [
  { n: 1,  track: 'C', name: 'Purva Zenium 2', builder: 'Puravankara', grade: 'A', area: 'Hosahalli · Airport Rd', allIn: '₹1.82–2.53 Cr', oc: 'Jun 2027', score: '72/100', lead: 'Budget + earliest OC', research: 'RERA PRM/…/005303 · web list-price noise · Reddit no named threads' },
  { n: 2,  track: 'C', name: 'Prestige Avon', builder: 'Prestige', grade: 'A', area: 'Thanisandra', allIn: '~₹3.41 Cr', oc: 'Dec 2028', score: '76/100', lead: 'Manyata + Metro + invest', research: 'RERA confirm · GST thread r/indianrealestate/1rc7n9g · over ceiling' },
  { n: 3,  track: 'C', name: 'Sattva Lumina', builder: 'Salarpuria Sattva', grade: 'A', area: 'Rajanukunte SH-9', allIn: '₹1.62–1.87 Cr', oc: 'Nov 2029', score: '76/100', lead: 'Value + amenity mass', research: 'PR suffix + full PRM variant · township maint load' },
  { n: 4,  track: 'C', name: 'Brigade Eternia', builder: 'Brigade', grade: 'A', area: 'Yelahanka NT', allIn: '~₹2.41 Cr', oc: 'Mar 2030*', score: '79/100', lead: 'All-rounder (criteria canvas)', research: 'Mar vs Dec 2030 portals · K-RERA date for BBA' },
  { n: 5,  track: 'C', name: 'Tata Varnam', builder: 'Tata Housing', grade: 'A+', area: 'Devanahalli', allIn: '₹1.65–2.04 Cr', oc: 'Dec 2029', score: '71/100', lead: 'Builder + specs + airport', research: 'Manyata peak 60–80m · RERA suffix vs marketing full id' },
  { n: 6,  track: 'E', name: 'Sobha Athena', builder: 'Sobha', grade: 'A', area: 'Thanisandra', allIn: '~₹2.43 Cr', oc: 'Jun 2027 est.', score: '85·ext', lead: 'Boutique vs Avon', research: 'RERA verify portal · possession 2026/27 variance on listings' },
  { n: 7,  track: 'E', name: 'Prestige Camden Gardens', builder: 'Prestige', grade: 'A', area: 'Thanisandra', allIn: '~₹2.11–2.79 Cr', oc: 'Dec 2027 est.', score: '81·ext', lead: 'Prestige under ceiling', research: 'PR/140524/006872 · 2 ac amenity compact' },
  { n: 8,  track: 'E', name: 'Brigade Insignia', builder: 'Brigade', grade: 'A', area: 'Yelahanka NH44', allIn: '₹3.18 Cr+', oc: 'Jun 2029', score: '76·ext', lead: 'NH44 flagship size', research: 'PRM/…/006894 · budget edge' },
  { n: 9,  track: 'E', name: 'Arvind Bel Air', builder: 'Arvind SmartSpaces', grade: 'B+', area: 'Yelahanka NT Rd', allIn: '~₹1.29–1.95 Cr', oc: 'Jun 2026', score: '78·ext', lead: 'Value / earlier keys', research: 'PRM/…/003406 · not Grade A build' },
  { n: 10, track: 'E', name: 'Birla Yelahanka', builder: 'Birla Estates', grade: 'A', area: 'Yelahanka', allIn: 'TBC', oc: 'TBC', score: '70·est', lead: 'Watch upgrade', research: 'PRM/KA/RERA/1250/304/PR/190724/002725 marketing — verify' },
  { n: 11, track: 'W', name: 'Godrej Thanisandra (new)', builder: 'Godrej Properties', grade: 'A', area: 'Thanisandra', allIn: 'TBC', oc: 'TBC', score: '55·est', lead: 'Legal gate when RERA live', research: 'Listings “RERA soon” — do not book blind' },
  { n: 12, track: 'W', name: 'Mantri Manyata Energia', builder: 'Mantri', grade: 'A', area: 'Thanisandra', allIn: 'varies', oc: 'RTM', score: '72·est', lead: 'RTM benchmark Manyata', research: 'PRM/…/000439 cited on sites · UC path differs' },
  { n: 13, track: 'W', name: 'Embassy Manyata Residences', builder: 'Embassy', grade: 'A', area: 'Nagavara', allIn: 'TBC', oc: 'TBC', score: '52·est', lead: 'Best Manyata pin', research: 'RERA pending on embassy residential pages' },
  { n: 14, track: 'W', name: 'Mahindra North Bangalore', builder: 'Mahindra Lifespaces', grade: 'A', area: 'Navaratna Agrahara', allIn: 'TBC', oc: 'Pre-launch', score: '60·est', lead: 'North belt alt', research: 'Pre-launch — watch analysis.html row' },
  { n: 15, track: 'W', name: 'Purva Northern Lights Ph3', builder: 'Puravankara', grade: 'A', area: 'KIADB Aerospace', allIn: 'TBC', oc: '2031±', score: '58·est', lead: 'Long OC SEZ bet', research: 'Dec 2031 narrative vs 2026–30 goal' },
  { n: 16, track: 'R', name: 'Sobha City (RTM ref)', builder: 'Sobha', grade: 'A', area: 'Thanisandra belt', allIn: 'resale', oc: '2018–23', score: '65·ref', lead: 'Liquidity reference', research: 'Not UC — compare finish vs new build' },
  { n: 17, track: 'R', name: 'Prestige Royale Gardens', builder: 'Prestige', grade: 'A', area: 'Thanisandra', allIn: 'resale', oc: '2019', score: '63·ref', lead: 'RTM Prestige comp', research: 'Society age / maint' },
  { n: 18, track: 'R', name: 'Brigade Northridge', builder: 'Brigade', grade: 'A', area: 'Kogilu', allIn: 'resale', oc: '2018', score: '62·ref', lead: 'RTM Brigade comp', research: 'Pre-RERA era — EC/OC discipline' },
  { n: 19, track: 'R', name: 'Godrej Avenues', builder: 'Godrej', grade: 'A', area: 'Nagavara', allIn: 'resale', oc: '2019', score: '61·ref', lead: 'RTM density ref', research: 'Manyata access benchmark' },
  { n: 20, track: 'R', name: 'IVC / Budigere villa+', builder: 'mixed', grade: 'A', area: 'IVC corridor', allIn: '≥₹3.5 Cr', oc: 'varies', score: '40·bench', lead: 'Over-budget bench', research: 'Embassy Springs / Sobha / Century — revisit if ceiling moves' },
];

const TRACK_LEGEND =
  'C = primary eval band (full blr-deep-eval Σ/100 where written) · E = expand contender (same thesis; can still reach top 10) · W = watch / pre-RERA · R = RTM reference only. Trk is depth / sourcing while you rank — not who is excluded from visits. After you freeze top 10: site-visit every name in that list; mirror that exact set into index.html PROPERTIES.';

const REDDIT: { t: string; u: string }[] = [
  { t: 'GST UC + Prestige Bangalore', u: 'https://www.reddit.com/r/indianrealestate/comments/1rc7n9g/gst_on_under_construction_property/' },
  { t: 'Outer BLR incl. Yelahanka / Devanahalli', u: 'https://www.reddit.com/r/indianrealestate/comments/1r2m6ku/three_outers_electronic_city_sarjapura_budigere/' },
  { t: 'Yelahanka mega rail terminal / SH-9 traffic', u: 'https://www.reddit.com/r/bangalore/comments/1r7cibo/indias_largest_and_first_fully_elevated_railway/' },
  { t: 'TDS builder practice', u: 'https://www.reddit.com/r/indianrealestate/comments/1nvbkbd/tds_fraud_by_builders/' },
  { t: 'Bengaluru new-flat charges', u: 'https://www.reddit.com/r/indianrealestate/comments/1rcgn14/what_all_charges_to_pay_for_new_flat_in_bengaluru/' },
  { t: 'Khata bifurcation / registration friction', u: 'https://www.reddit.com/r/indianrealestate/comments/1pqhtw6/khata_bifurcation_discuss_and_possible_solution/' },
  { t: 'Karnataka UC delay + RERA mindset (Mysuru case)', u: 'https://www.reddit.com/r/indianrealestate/comments/1otdmy6/my_ongoing_experience_with_a_villa_builder_in/' },
];

export default function NorthBLRPropertyHub() {
  const ceBand = HUB.filter(r => r.track === 'C' || r.track === 'E').length;
  return (
    <Stack gap={20} style={{ padding: '24px 28px', maxWidth: 1240 }}>

      <Stack gap={6}>
        <Row gap={10} align="center" wrap>
          <H1>North BLR property hub</H1>
          <Pill tone="info">20 → whittle</Pill>
          <Pill tone="success">Top 10 → visit all</Pill>
        </Row>
        <Text size="small">
          <Text weight="semibold" as="span">Visit commitment:</Text> you will take an in-person site visit for <Text weight="semibold" as="span">every</Text> project that survives in your <Text weight="semibold" as="span">final ranked top 10</Text> (≤10 UC trips in one ranking pass; use <Text weight="semibold" as="span">R</Text> rows as comps, not necessarily a tenth “visit” unless you promote one). <Text weight="semibold" as="span">Trk</Text> below is evaluation depth / pool role <Text weight="semibold" as="span">while</Text> you cut 20 → 10 — not a promise that <Text weight="semibold" as="span">E</Text> names never get visited if they climb into the top 10.
        </Text>
        <Text tone="secondary">
          Single surface for <Text weight="semibold" as="span">blr-property-criteria</Text> (10 category families + TEN_POINT),{' '}
          <Text weight="semibold" as="span">blr-deep-eval</Text> (where you maintain full matrices), facts from <Text weight="semibold" as="span">index.html</Text> / <Text weight="semibold" as="span">analysis.html</Text>, five-filter stack, and web/Reddit research pointers.{' '}
          <Text weight="semibold" as="span">Score</Text> column: Σ /100 where blr-deep-eval has a full write-up (today that matches the five <Text weight="semibold" as="span">C</Text> rows); ·ext / ·est / ·ref / ·bench = scaled or qualitative pool entries.
        </Text>
      </Stack>

      <Grid columns={6} gap={12}>
        <Stat value="20" label="Pool" tone="success" />
        <Stat value="10" label="Top-10 visit cap" tone="success" />
        <Stat value={`${ceBand}`} label="UC band (C+E)" tone="info" />
        <Stat value="≤₹3 Cr" label="Policy (most UC)" tone="warning" />
        <Stat value="403" label="K-RERA auto-fetch" tone="danger" />
        <Stat value="79" label="Top Σ (Brigade)" tone="success" />
      </Grid>

      <Card>
        <CardHeader trailing={<Pill tone="success" size="sm">Criteria</Pill>}>
          Best fit vs blr-property-criteria (compressed)
        </CardHeader>
        <CardBody>
          <Stack gap={6}>
            <Text size="small">
              <Text weight="semibold" as="span">All-rounder across the ten category families:</Text> Brigade Eternia (highest deep-eval sum; strong Critical area + legal on Yelahanka NT).{' '}
              <Text weight="semibold" as="span">Budget + earliest keys:</Text> Purva or Sattva.{' '}
              <Text weight="semibold" as="span">Manyata + social + liquidity</Text> (if price fixed): Prestige Avon.
            </Text>
            <Text size="small" tone="secondary">
              Full per-category winner table lives in <Text weight="semibold" as="span">blr-property-criteria.canvas.tsx</Text> (section “Who is best on this page’s categories?”).
            </Text>
          </Stack>
        </CardBody>
      </Card>

      <Divider />

      <H2>Master table — 20 projects</H2>
      <Text size="small" tone="secondary">{TRACK_LEGEND}</Text>
      <Table
        headers={['#', 'Trk', 'Project', 'Builder', 'G', 'Micro-market', 'All-in', 'OC', 'Σ', 'Lead (criteria)', 'Research / RERA']}
        rows={HUB.map(r => [
          String(r.n), r.track, r.name, r.builder, r.grade, r.area, r.allIn, r.oc, r.score, r.lead, r.research,
        ])}
        rowTone={HUB.map(r =>
          r.name === 'Prestige Avon' ? 'danger' :
          r.track === 'C' ? undefined :
          r.track === 'E' ? 'success' :
          r.track === 'W' ? 'warning' :
          undefined
        )}
        striped
      />

      <Divider />

      <Grid columns={2} gap={16}>
        <Stack gap={10}>
          <H3>Five-filter stack</H3>
          <Text size="small">After facts: (1) Budget vs ₹3 Cr (2) Area / micro-market (3) Builder (4) Adult amenities / maint (5) Other — commute, OC, legal, liquidity. Detail per core row was in legacy project-selection; now use this hub + deep-eval.</Text>
          <Card>
            <CardHeader trailing={<Pill tone="warning" size="sm">2026–30 OC</Pill>}>Possession band</CardHeader>
            <CardBody>
              <Text size="small">No full-eval UC before Jun 2027 (Purva in the current <Text weight="semibold" as="span">C</Text> band). If you need <Text weight="semibold" as="span">2026</Text> keys, favour row 9 (Arvind) or <Text weight="semibold" as="span">R</Text> RTM refs — not that early-OC cluster.</Text>
            </CardBody>
          </Card>
        </Stack>
        <Stack gap={10}>
          <H3>Research (web + Reddit)</H3>
          <Text size="small">K-RERA: automated fetch returned 403 — verify QPR %, possession end date, complaints on portal. Web marketing often conflicts on RERA strings and OC dates (esp. Prestige Avon, Brigade Eternia, Tata Varnam).</Text>
          <Table
            headers={['Thread', 'URL']}
            rows={REDDIT.map(x => [x.t, x.u])}
            striped
          />
          <Text size="small" tone="secondary">site:reddit.com (Apr 2026) did not surface threads naming the five projects with full Σ/100 deep-eval rows — absence ≠ clean; re-search per row when whittling.</Text>
        </Stack>
      </Grid>

      <Divider />

      <Text tone="secondary" size="small">
        When rankings move: edit <Text weight="semibold" as="span">HUB</Text> (including <Text weight="semibold" as="span">track</Text>). When the <Text weight="semibold" as="span">top 10</Text> is frozen, set <Text weight="semibold" as="span">index.html</Text> <Text weight="semibold" as="span">PROPERTIES</Text> to that full finalist set (one itinerary slot each — your “visit all top 10” promise), then sync <Text weight="semibold" as="span">analysis.html</Text> and <Text weight="semibold" as="span">blr-deep-eval</Text> in the same commit. Rules: <Text weight="semibold" as="span">.cursor/rules/keep-canvas-in-sync.mdc</Text>.
      </Text>
    </Stack>
  );
}
