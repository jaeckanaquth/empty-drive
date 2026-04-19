import {
  Card, CardBody, CardHeader,
  Divider, Grid, H1, H2, H3,
  Pill, Row, Stack, Stat, Table, Text,
} from 'cursor/canvas';

/**
 * Apr 2026 — Web + Reddit research pass vs repo canvases (blr-deep-eval, blr-areas, index/analysis).
 * Marketing sites conflict; K-RERA PDF is authoritative. Automated fetch to rera.karnataka.gov.in returned 403 — verify manually.
 */

const CRITERIA_CHECK: { num: number; label: string; checked: string; canvases: string }[] = [
  { num: 1,  label: 'Area / micro-market',       checked: 'Compared repo area scores to web pocket descriptions (Hosahalli, Thanisandra, SH-9, Yelahanka NT, Devanahalli)', canvases: 'blr-areas · blr-deep-eval area cell' },
  { num: 2,  label: 'Connectivity',              checked: 'Manyata/airport/Metro claims on builder sites vs repo commute bands (esp. Devanahalli peak)', canvases: 'blr-areas conn · deep-eval connectivity' },
  { num: 3,  label: 'Investment thesis',           checked: 'Not re-priced from portals; PSF bands unchanged pending K-RERA + sales quote', canvases: 'blr-investment · deep-eval investment' },
  { num: 4,  label: 'Specs / carpet / loading', checked: 'Web sqft ranges noisy; repo SBA/loading kept — verify carpet on portal', canvases: 'blr-property-type-config · deep-eval specs' },
  { num: 5,  label: 'Legal / RERA / Khata',        checked: 'RERA presence strings, Prestige RERA ambiguity, Sattva full id variants, Tata id variants', canvases: 'blr-legal-documentation · deep-eval legal' },
  { num: 6,  label: 'Amenities (adult / WFH)',     checked: 'Club/tower counts on aggregators vs brochure — no change to amenity scores', canvases: 'blr-amenities · deep-eval amenities' },
  { num: 7,  label: 'Social infra',               checked: 'Peers in belt for retail/hospital density only; deep-eval social cells unchanged', canvases: 'blr-areas social · deep-eval social' },
  { num: 8,  label: 'Financial / all-in',          checked: 'Prestige web “from ₹1.8 Cr” vs repo ₹3.2 Cr base — ignored list-price noise', canvases: 'blr-budget-financial-planning · project-selection facts' },
  { num: 9,  label: 'Risk / UC timing',            checked: 'Possession date conflicts + Reddit sentiment pass (see Reddit section below)', canvases: 'blr-safety-lifestyle · deep-eval risk' },
  { num: 10, label: 'End use vs liquidity',      checked: 'Sobha Athena sold-out rumours not verified; not altering end-use ranks', canvases: 'blr-deep-eval enduse' },
];

const SHORTLIST_WEB: { project: string; reraRepo: string; webFindings: string; vsRepo: string; verify: string }[] = [
  {
    project: 'Purva Zenium 2',
    reraRepo: 'PRM/KA/RERA/1251/309/PR/071022/005303',
    webFindings: 'Aggregators: Jun–May 2027 possession; ~438 units / ~3 ac; RERA Oct 2022 narrative matches repo.',
    vsRepo: 'List prices as low as ₹1.1 Cr on portals — inconsistent with your ₹1.71 Cr+ base; treat as wrong config or stale.',
    verify: 'K-RERA: completion %, possession month, carpet for your tower type.',
  },
  {
    project: 'Prestige Avon',
    reraRepo: 'Confirm on K-RERA (repo had “registered — confirm at sales”)',
    webFindings: 'Official-style site + listings: RERA described as pending/awaiting vs “registered”; possession seen as Dec 2028 or 31 Jan 2029; towers cited G+16 vs repo narrative — marketing variance.',
    vsRepo: 'Repo all-in ~₹3.41 Cr vs some pages “from ₹1.8 Cr” — incompatible; keep repo pricing until sales quote.',
    verify: 'K-RERA: exact registration string, end date, QPR %; resolve possession date vs brochure.',
  },
  {
    project: 'Sattva Lumina',
    reraRepo: 'PR/060924/007009 (suffix); listings also cite PRM/KA/RERA/1251/472/PR/060924/007009',
    webFindings: 'Nov 2029 possession aligns; 8 towers / 1,553 / 12.83 ac aligns; RERA approved narrative Aug 2024.',
    vsRepo: 'Full PRM prefix segment (472 vs 309) must match certificate — do not guess.',
    verify: 'K-RERA: copy full registration from PDF; tower-wise possession if split.',
  },
  {
    project: 'Brigade Eternia',
    reraRepo: 'PRM/KA/RERA/1251/309/PR/070325/007559',
    webFindings: 'High conflict: same project linked to Mar 2030, Sep 2028, Nov 2029, Dec 2029 on different affiliate pages.',
    vsRepo: 'Repo uses Mar 2030 with Dec 2030 cross-check warning — still valid until portal resolves.',
    verify: 'K-RERA: single end date; screenshot for BBA.',
  },
  {
    project: 'Tata Varnam',
    reraRepo: 'PR/110825/007988 (suffix)',
    webFindings: 'Marketing pages quote alternate full ids (e.g. …/1250/303/…); possession seen as Dec 2028 on some sites vs repo Dec 2029; acreage 135 vs 142 ac.',
    vsRepo: 'index.html Manyata drive was understated — corrected to deep-eval band in same commit as this canvas.',
    verify: 'K-RERA: authoritative possession + registration string; phase-wise OC for your tower.',
  },
];

const PEERS: { name: string; belt: string; webNote: string; criteriaLens: string; onVisitList: string }[] = [
  {
    name: 'Sobha Athena',
    belt: 'Thanisandra Main Rd',
    webNote: 'RERA often cited PRM/KA/RERA/1251/309/PR/200526/003430; possession Jul 2026 vs Jun 2027 vs Sep 2027 across portals; 72 units boutique.',
    criteriaLens: 'Strong builder (5), specs discipline (4); check sold-out / resale only; Manyata proximity strong (2).',
    onVisitList: 'Alternate in belt — not in your five-visit PWA row; use if Avon fails budget.',
  },
  {
    name: 'Godrej Thanisandra (new launch)',
    belt: 'Thanisandra / Manyata catchment',
    webNote: 'Listings mention RERA “coming soon” / multiple micro-sites — weak until portal shows registration.',
    criteriaLens: 'Fails legal gate (5) until RERA live; price bands wide — verify (8).',
    onVisitList: 'Watch / compare only until K-RERA confirms.',
  },
  {
    name: 'Mantri Manyata Energia',
    belt: 'Thanisandra',
    webNote: 'Example RERA PRM/KA/RERA/1251/309/PR/171014/000439 cited on property sites; described as ready/RTM in some listings.',
    criteriaLens: 'Different product path (RTM vs UC) — legal and payment structure differ from your UC stack (5,8).',
    onVisitList: 'Peer benchmark, not a substitute for Avon without revisiting strategy.',
  },
  {
    name: 'Birla Yelahanka',
    belt: 'Yelahanka',
    webNote: 'Marketing cites RERA PRM/KA/RERA/1250/304/PR/190724/002725; 8 ac / 218 homes; “coming soon” pricing.',
    criteriaLens: 'Good area brand (1); price TBC (8); Grade A builder (3) — matches watch-list role.',
    onVisitList: 'Watch list — analysis.html updated with fuller RERA string for manual check.',
  },
  {
    name: 'Embassy Manyata Residences',
    belt: 'Nagavara / Manyata',
    webNote: 'Embassy residential pages describe RERA as coming soon; best Manyata walk score story.',
    criteriaLens: 'Connectivity (2) + social (7) upside if launch clears; legal (5) blocked until RERA.',
    onVisitList: 'Watch list — register interest; do not treat as UC comparable until registered.',
  },
  {
    name: 'Purva Northern Lights Ph3',
    belt: 'KIADB Aerospace / Bagalur',
    webNote: 'Repo watch row: long OC horizon (e.g. Dec 2031 narrative) vs 2026–2030 occupation goal.',
    criteriaLens: 'Investment (3) optionality if SEZ accelerates; timeline (9) poor for near-term self-use.',
    onVisitList: 'Watch list — outside short visit set.',
  },
];

/** Reddit: threads with useful diligence themes for North BLR / UC buys (Apr 2026 search). Full URLs for your browser. */
const REDDIT_THREADS: { title: string; url: string; themes: string; mapsToCriteria: string; shortlistNote: string }[] = [
  {
    title: 'GST on under-construction property (Prestige Bangalore UC, possession ~2027–28 mentioned)',
    url: 'https://www.reddit.com/r/indianrealestate/comments/1rc7n9g/gst_on_under_construction_property/',
    themes: 'Builder response on GST law change; buyer follow-up fatigue.',
    mapsToCriteria: '8 Financial · 5 Legal (agreement clarity) · 9 Risk (policy shock)',
    shortlistNote: 'Relevant to Prestige Avon UC path — not project-specific defects.',
  },
  {
    title: 'Three outers — Electronic City vs Sarjapur vs Budigere Cross (North: Yelahanka / Devanahalli called out)',
    url: 'https://www.reddit.com/r/indianrealestate/comments/1r2m6ku/three_outers_electronic_city_sarjapura_budigere/',
    themes: 'Yelahanka described as strong long-term; Devanahalli “hype” skepticism in thread snippets.',
    mapsToCriteria: '1 Area · 3 Investment thesis · 2 Connectivity (when reading north comments only)',
    shortlistNote: 'Context for Sattva (Yelahanka belt) + Tata (Devanahalli) — sentiment, not data.',
  },
  {
    title: 'Mega elevated railway terminal planned for Yelahanka (Doddaballapur Rd / SH-9 traffic worries)',
    url: 'https://www.reddit.com/r/bangalore/comments/1r7cibo/indias_largest_and_first_fully_elevated_railway/',
    themes: 'Locals worry about congestion once terminal is live; elevated link to Kogilu Metro mentioned in discussion.',
    mapsToCriteria: '2 Connectivity · 7 Social/noise · 1 Area (future infra shock)',
    shortlistNote: 'Relevant to Rajanukunte SH-9 commute to Yelahanka town — stress-test peak hour after visit.',
  },
  {
    title: 'TDS fraud by builders (general India thread; applies to any UC booking)',
    url: 'https://www.reddit.com/r/indianrealestate/comments/1nvbkbd/tds_fraud_by_builders/',
    themes: '1% TDS passed to buyer improperly; documentation discipline.',
    mapsToCriteria: '5 Legal · 8 Financial',
    shortlistNote: 'Ask every sales desk how TDS is handled on your agreement line items.',
  },
  {
    title: 'What all charges to pay for new flat in Bengaluru?',
    url: 'https://www.reddit.com/r/indianrealestate/comments/1rcgn14/what_all_charges_to_pay_for_new_flat_in_bengaluru/',
    themes: 'Stamp, reg, GST, corpus — checklist style.',
    mapsToCriteria: '8 Financial',
    shortlistNote: 'Cross-check your all-in model before comparing builders.',
  },
  {
    title: 'Khata bifurcation — registration delays post-possession',
    url: 'https://www.reddit.com/r/indianrealestate/comments/1pqhtw6/khata_bifurcation_discuss_and_possible_solution/',
    themes: 'Builders blaming khata rules for delayed registration.',
    mapsToCriteria: '5 Legal',
    shortlistNote: 'Thanisandra / Rajanukunte Khata threads matter more than plot projects — align with blr-legal-documentation.',
  },
  {
    title: 'Mysuru villa — delays, quality, K-RERA case (Karnataka UC pattern; not Puravankara)',
    url: 'https://www.reddit.com/r/indianrealestate/comments/1otdmy6/my_ongoing_experience_with_a_villa_builder_in/',
    themes: '3+ yr delay; seepage/cracks; pay only on milestones; RERA complaint mindset.',
    mapsToCriteria: '9 Risk · 4 Specs/finish · 5 Legal (RERA recourse)',
    shortlistNote: 'No Puravankara tie — use as UC diligence mindset for Purva visit questions.',
  },
];

const REDDIT_NEGATIVE_FINDINGS =
  'Targeted site:reddit.com queries (Apr 2026) for Puravankara+Bangalore problems, Prestige+Bangalore delay, Sattva/Salarpuria+Yelahanka, Brigade Group+Bangalore (query polluted by unrelated “brigading” posts), Tata Housing+Carnatica+Varnam, Thanisandra flooding, Hosahalli, and “Manyata apartment” did not surface indexed complaint threads that name Purva Zenium 2, Prestige Avon, Sattva Lumina, Brigade Eternia, or Tata Varnam. That is absence in search snippets only — not evidence of a clean record. For named complaints use K-RERA complaint / adjudication search and Google/Reddit site search with exact tower name over time.';

export default function ResearchSnapshot() {
  return (
    <Stack gap={22} style={{ padding: '24px 28px', maxWidth: 1180 }}>

      <Stack gap={6}>
        <Row gap={10} align="center">
          <H1>Research snapshot</H1>
          <Pill tone="warning">Apr 2026 web pass</Pill>
        </Row>
        <Text tone="secondary">
          This document records a <Text weight="semibold" as="span">targeted web search</Text> (housing/prop sites, builder affiliates, aggregators) cross-checked against your
          existing repo narrative. It is <Text weight="semibold" as="span">not</Text> a K-RERA scrape: direct portal fetch from this environment returned HTTP 403, so
          completion %, final possession, and exact registration strings must still be pulled <Text weight="semibold" as="span">manually</Text> from{' '}
          <Text weight="semibold" as="span">rera.karnataka.gov.in</Text> or the sales PDF certificate.
        </Text>
      </Stack>

      <Grid columns={5} gap={12}>
        <Stat value="10" label="Criteria rows checked" tone="neutral" />
        <Stat value="5" label="Visit shortlist" tone="success" />
        <Stat value="6" label="Peers / watch sampled" tone="info" />
        <Stat value="7" label="Reddit threads logged" tone="warning" />
        <Stat value="403" label="K-RERA auto-fetch" tone="danger" />
      </Grid>

      <Card>
        <CardHeader trailing={<Pill tone="info" size="sm">Scope</Pill>}>
          What changed in-repo because of this pass
        </CardHeader>
        <CardBody>
          <Stack gap={6}>
            <Text size="small">
              <Text weight="semibold" as="span">index.html</Text> — Tata Varnam Manyata drive string corrected to match <Text weight="semibold" as="span">blr-deep-eval</Text> (peak commute risk);
              Prestige / Sattva / Tata <Text weight="semibold" as="span">contact</Text> lines augmented with web-conflict warnings.
            </Text>
            <Text size="small">
              <Text weight="semibold" as="span">analysis.html</Text> — Birla Yelahanka watch row: fuller RERA string from public marketing (still verify on portal).
            </Text>
            <Text size="small">
              <Text weight="semibold" as="span">blr-project-selection</Text> — points here for methodology; numeric bands unchanged where web contradicted without proof.
            </Text>
          </Stack>
        </CardBody>
      </Card>

      <Divider />

      <Stack gap={10}>
        <H2>Criteria coverage (how the web pass maps to your stack)</H2>
        <Table
          headers={['#', 'Criterion', 'What was checked on web', 'Primary canvases']}
          rows={CRITERIA_CHECK.map(c => [String(c.num), c.label, c.checked, c.canvases])}
          striped
        />
      </Stack>

      <Divider />

      <Stack gap={10}>
        <H2>Visit shortlist — web vs repo</H2>
        <Table
          headers={['Project', 'RERA (repo)', 'Web findings (summary)', 'Vs repo', 'You should verify']}
          rows={SHORTLIST_WEB.map(s => [s.project, s.reraRepo, s.webFindings, s.vsRepo, s.verify])}
          striped
        />
      </Stack>

      <Divider />

      <Stack gap={10}>
        <H2>Peers & watch list — same belts, different gates</H2>
        <Text size="small" tone="secondary">
          These are <Text weight="semibold" as="span">not</Text> substitutes for your five visits unless you reopen shortlist; they explain what else exists under the same criteria lenses.
        </Text>
        <Table
          headers={['Name', 'Belt', 'Web note (Apr 2026)', 'Criteria lens', 'Visit shortlist']}
          rows={PEERS.map(p => [p.name, p.belt, p.webNote, p.criteriaLens, p.onVisitList])}
          striped
        />
      </Stack>

      <Divider />

      <Stack gap={10}>
        <H2>Reddit — complaints, area sentiment, builder practices</H2>
        <Card>
          <CardHeader trailing={<Pill tone="warning" size="sm">Method</Pill>}>
            How this was gathered
          </CardHeader>
          <CardBody>
            <Stack gap={6}>
              <Text size="small">
                Multiple <Text weight="semibold" as="span">site:reddit.com</Text> searches on r/indianrealestate, r/bangalore, and related subs (Apr 2026).
                Opening Reddit thread HTML from this environment <Text weight="semibold" as="span">timed out</Text>, so summaries are from search snippets + known thread titles —
                open each URL and read current comments yourself.
              </Text>
              <Text size="small" tone="secondary">
                {REDDIT_NEGATIVE_FINDINGS}
              </Text>
            </Stack>
          </CardBody>
        </Card>
        <Table
          headers={['Thread', 'URL', 'Themes', 'Criteria', 'Shortlist tie-in']}
          rows={REDDIT_THREADS.map(t => [t.title, t.url, t.themes, t.mapsToCriteria, t.shortlistNote])}
          striped
        />
      </Stack>

      <Divider />

      <Stack gap={8}>
        <H3>Manual next step</H3>
        <Text size="small" tone="secondary">
          For each visit project: open K-RERA → search by registration suffix or project name → record <Text weight="semibold" as="span">QPR %</Text>,{' '}
          <Text weight="semibold" as="span">promised possession end date</Text>, and <Text weight="semibold" as="span">any complaint docket</Text> in your visit notes;
          then update <Text weight="semibold" as="span">blr-deep-eval</Text> cells if anything differs from this repo snapshot.
        </Text>
      </Stack>

    </Stack>
  );
}
