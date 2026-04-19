import {
  BarChart,
  Card, CardBody, CardHeader,
  Divider, Grid, H1, H2, H3,
  Pill, Row, Stack, Stat, Table, Text,
  useCanvasState,
} from 'cursor/canvas';

// ── Bangalore citywide builder reputation ─────────────────────────────────
// Scores are directional (1–10) for comparison — verify on KRERA + filings.

type ZoneKey = 'all' | 'north' | 'east' | 'south' | 'central' | 'west' | 'pan';

type BuilderKey =
  | 'sobha' | 'prestige' | 'brigade' | 'puravankara' | 'sattva' | 'tata'
  | 'embassy' | 'godrej' | 'birla' | 'mahindra'
  | 'provident' | 'shriram' | 'assetz' | 'sumadhura' | 'casagrand' | 'concorde' | 'vaishnavi' | 'adarsh'
  | 'totalEnv';

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
  listed: boolean;
  zones: ZoneKey[];
  scores: BuilderScore;
  total: number;
  summary: string;
  blrSignature: string;
  northShortlist?: string;
  watchOut: string;
  tone: 'success' | 'warning' | 'info' | 'danger';
}

const builders: Record<BuilderKey, Builder> = {
  sobha: {
    label: 'Sobha Ltd',
    tier: 1,
    priceRange: '₹8,500–14,000/sqft',
    listed: true,
    zones: ['pan', 'east', 'north', 'south'],
    scores: { reraCompliance: 9, deliveryRecord: 9, constructionQuality: 10, financialStability: 9, afterSales: 8, valueForMoney: 6 },
    total: 51,
    summary: 'Backward-integrated construction (concrete, glazing, interiors). Strongest finish quality in BLR. Premium pricing; resale holds well in Whitefield, ORR, and North corridors.',
    blrSignature: 'Pan-BLR: Sobha Dream Acres (Panathur), Sobha Neopolis, Rajajeshwari / Mysore Road belt; flagship townships on ORR.',
    northShortlist: 'Not on current UC shortlist (Athena etc. sold / priced out). Watch Sobha North launches.',
    watchOut: 'Loading 28–32% on some towers; strict payment discipline. Delays rare but when they happen, RERA route is standard.',
    tone: 'success',
  },
  prestige: {
    label: 'Prestige Group',
    tier: 1,
    priceRange: '₹7,500–12,000/sqft',
    listed: true,
    zones: ['pan', 'east', 'north', 'south', 'central'],
    scores: { reraCompliance: 8, deliveryRecord: 8, constructionQuality: 8, financialStability: 9, afterSales: 7, valueForMoney: 7 },
    total: 47,
    summary: 'Largest listed residential footprint in South India. Deep inventory across Whitefield, Varthur, Hebbal, Thanisandra, South BLR. Brand = liquidity at resale.',
    blrSignature: 'Citywide: Prestige Lakeside Habitat, Shantiniketan, Finsbury Park (Yelahanka), Camden / multiple ORR townships.',
    northShortlist: 'Prestige Avon (Thanisandra) — on visit shortlist.',
    watchOut: 'Post-COVID some phases slipped 6–12 months. Verify KRERA quarterly % for your tower before booking.',
    tone: 'success',
  },
  brigade: {
    label: 'Brigade Group',
    tier: 1,
    priceRange: '₹7,500–11,500/sqft',
    listed: true,
    zones: ['pan', 'east', 'north', 'south', 'central'],
    scores: { reraCompliance: 8, deliveryRecord: 8, constructionQuality: 8, financialStability: 8, afterSales: 7, valueForMoney: 7 },
    total: 46,
    summary: 'Bangalore-headquartered; strong in CBD fringe, Whitefield, and North. Listed; diversified (offices + malls + residential). Consistent mid-premium positioning.',
    blrSignature: 'Citywide: Brigade Metropolis, Orion Mall adjacency projects, Whitefield tech corridor, Yelahanka NT, Devanahalli townships.',
    northShortlist: 'Brigade Eternia (Yelahanka NT) — on visit shortlist.',
    watchOut: 'Sales velocity pressure — get every promise in BBA. Confirm possession quarter in writing.',
    tone: 'success',
  },
  puravankara: {
    label: 'Puravankara',
    tier: 1,
    priceRange: '₹7,000–10,500/sqft',
    listed: true,
    zones: ['north', 'east', 'south', 'pan'],
    scores: { reraCompliance: 8, deliveryRecord: 8, constructionQuality: 8, financialStability: 7, afterSales: 7, valueForMoney: 8 },
    total: 46,
    summary: 'NSE-listed; value-tier Tier 1. Strong North BLR and Hosahalli / Airport belt. Provident subsidiary shares governance DNA.',
    blrSignature: 'BLR: Whitefield, Thanisandra, Kanakapura Road, Hosahalli / KIAL corridor, Purva Atmosphere (resale depth).',
    northShortlist: 'Purva Zenium 2 (Hosahalli) — on visit shortlist.',
    watchOut: 'After-sales varies by project — visit an occupied Purva society in same micro-market before UC booking.',
    tone: 'success',
  },
  sattva: {
    label: 'Salarpuria Sattva',
    tier: 1,
    priceRange: '₹6,500–10,000/sqft',
    listed: true,
    zones: ['north', 'east', 'central', 'pan'],
    scores: { reraCompliance: 8, deliveryRecord: 7, constructionQuality: 8, financialStability: 8, afterSales: 7, valueForMoney: 9 },
    total: 47,
    summary: 'NSE-listed Sattva group; large commercial + residential mix in BLR. Good RERA hygiene; competitive ₹/sqft vs Prestige/Sobha.',
    blrSignature: 'Manyata-Kogilu, ORR, Sarjapur–Dommasandra, Rajanukunte / SH-9, CBD office-led mixed-use.',
    northShortlist: 'Sattva Lumina (Rajanukunte) — on visit shortlist.',
    watchOut: 'Some legacy phases had 6–9 month slips — anchor decisions to KRERA construction %.',
    tone: 'success',
  },
  tata: {
    label: 'Tata Housing',
    tier: 1,
    priceRange: '₹6,000–10,000/sqft',
    listed: false,
    zones: ['north', 'east', 'south', 'pan'],
    scores: { reraCompliance: 10, deliveryRecord: 9, constructionQuality: 9, financialStability: 10, afterSales: 8, valueForMoney: 8 },
    total: 54,
    summary: 'Tata Group balance sheet — institutional-grade diligence and documentation. Never abandoned a BLR project in public record. Buyers pay trust premium.',
    blrSignature: 'Carnatica (Devanahalli), New Haven (multiple belts), Whitefield launches; township-scale North & East.',
    northShortlist: 'Tata Varnam (Carnatica / Devanahalli) — on visit shortlist.',
    watchOut: 'Unlisted entity — transparency via parent; verify specific phase RERA and jurisdiction (BMRDA vs GP).',
    tone: 'success',
  },
  embassy: {
    label: 'Embassy Group',
    tier: 1,
    priceRange: '₹9,000–16,000/sqft',
    listed: true,
    zones: ['north', 'east', 'central', 'pan'],
    scores: { reraCompliance: 8, deliveryRecord: 8, constructionQuality: 8, financialStability: 8, afterSales: 7, valueForMoney: 6 },
    total: 45,
    summary: 'Office-led developer with select premium residential. Strong execution on integrated work-live campuses. Price band often above ₹3 Cr for flagship 3 BHK.',
    blrSignature: 'Embassy Boulevard, Manyata SEZ adjacency, ORR residential, Embassy Lake Terraces — IT-corridor linked.',
    northShortlist: 'Embassy Manyata Residences — watch-list (RERA TBC).',
    watchOut: 'Premium pricing; verify all-in vs base. Some launches are long-dated — match to your possession thesis.',
    tone: 'success',
  },
  godrej: {
    label: 'Godrej Properties',
    tier: 1,
    priceRange: '₹8,000–13,000/sqft',
    listed: true,
    zones: ['east', 'north', 'south', 'pan'],
    scores: { reraCompliance: 8, deliveryRecord: 8, constructionQuality: 8, financialStability: 9, afterSales: 7, valueForMoney: 7 },
    total: 47,
    summary: 'National listed developer; strong Whitefield–Sarjapur story and growing North. ESG / branded playbook; bank-friendly.',
    blrSignature: 'Godrej Avenues (Yelahanka), Whitefield, Sarjapur–Chandapura corridor; periodic joint ventures.',
    northShortlist: 'Yelahanka / Jakkur belt — check current inventory vs budget.',
    watchOut: 'JV projects — confirm which entity is on KRERA and who owns delay risk.',
    tone: 'success',
  },
  birla: {
    label: 'Birla Estates (Aditya Birla)',
    tier: 1,
    priceRange: '₹8,000–12,000/sqft',
    listed: true,
    zones: ['north', 'east', 'south', 'pan'],
    scores: { reraCompliance: 8, deliveryRecord: 8, constructionQuality: 8, financialStability: 9, afterSales: 7, valueForMoney: 7 },
    total: 47,
    summary: 'Conglomerate-backed; fewer but large-format launches. Brand trust similar to Tata/Mahindra tier for risk-averse buyers.',
    blrSignature: 'Birla Trimaya (Devanahalli / BK Halli belt), Birla Alokya (Sarjapur), Birla Tisya (Sheshadripuram).',
    northShortlist: 'Birla Yelahanka — watch-list (verify RERA + pricing).',
    watchOut: 'Smaller BLR sample size vs Prestige — rely on KRERA + parent disclosures.',
    tone: 'success',
  },
  mahindra: {
    label: 'Mahindra Lifespaces',
    tier: 1,
    priceRange: '₹7,500–11,000/sqft',
    listed: true,
    zones: ['east', 'north', 'south', 'pan'],
    scores: { reraCompliance: 8, deliveryRecord: 8, constructionQuality: 8, financialStability: 9, afterSales: 7, valueForMoney: 7 },
    total: 47,
    summary: 'Listed; sustainability positioning. Selective launches — not as dense as Prestige in BLR but quality generally consistent.',
    blrSignature: 'Mahindra Eden (Kanakapura Rd), Ashvita (Banjara Hills style in BLR pockets), North BLR pre-launches.',
    northShortlist: 'Mahindra North Bangalore — watch-list (Navaratna Agrahara belt).',
    watchOut: 'Fewer completed BLR references per micro-market — do extra resident visits for new corridors.',
    tone: 'success',
  },
  provident: {
    label: 'Provident Housing',
    tier: 2,
    priceRange: '₹5,500–8,500/sqft',
    listed: false,
    zones: ['north', 'east', 'south'],
    scores: { reraCompliance: 7, deliveryRecord: 7, constructionQuality: 7, financialStability: 7, afterSales: 6, valueForMoney: 9 },
    total: 43,
    summary: 'Puravankara subsidiary — value segment with group balance sheet support. Popular with first-time buyers in peripheral belts.',
    blrSignature: 'Provident Sunworth (Kanakapura), Park Square / Capella (North), Ecopolitan etc.',
    northShortlist: 'Strong North value play if budget < ₹2 Cr all-in.',
    watchOut: 'Finishes a notch below Prestige/Sobha — price-discount is real, not hidden.',
    tone: 'info',
  },
  shriram: {
    label: 'Shriram Properties',
    tier: 2,
    priceRange: '₹5,800–9,000/sqft',
    listed: true,
    zones: ['north', 'east', 'south', 'west', 'pan'],
    scores: { reraCompliance: 7, deliveryRecord: 7, constructionQuality: 7, financialStability: 6, afterSales: 6, valueForMoney: 8 },
    total: 41,
    summary: 'Listed South India player; mid-market layouts. Check post-stress consolidation — verify each project SPV on KRERA.',
    blrSignature: 'Shriram Chirping Woods, Wytfield, Soukya Road, Jalahalli / North pockets.',
    northShortlist: 'Yelahanka / Soukya belt — RTM depth; UC verify RERA %.',
    watchOut: 'Historical financial stress — use bank legal + KRERA complaints tab as primary filter.',
    tone: 'info',
  },
  assetz: {
    label: 'Assetz Property',
    tier: 2,
    priceRange: '₹6,500–10,500/sqft',
    listed: false,
    zones: ['north', 'east', 'central'],
    scores: { reraCompliance: 7, deliveryRecord: 7, constructionQuality: 7, financialStability: 6, afterSales: 6, valueForMoney: 8 },
    total: 41,
    summary: 'Design-led mid-premium; ORR and KIADB-side North stories. Unlisted — insist on escrow + bank tie-up visibility.',
    blrSignature: '63° East, Marq, Soho & Sky (Hebbal), Bagalur / Aerospace-side launches.',
    northShortlist: 'Useful comparator for North tech-corridor product.',
    watchOut: 'UC projects: verify construction-linked tranches hit RERA account only.',
    tone: 'info',
  },
  sumadhura: {
    label: 'Sumadhura',
    tier: 2,
    priceRange: '₹6,000–9,500/sqft',
    listed: false,
    zones: ['east', 'north'],
    scores: { reraCompliance: 7, deliveryRecord: 7, constructionQuality: 8, financialStability: 6, afterSales: 6, valueForMoney: 8 },
    total: 42,
    summary: 'Hyderabad-origin; strong following in East BLR (Whitefield–Sarjapur). Quality-for-price reputation in segment.',
    blrSignature: 'Sumadhura Shikharam, Folium, Whitefield extensions; growing North presence.',
    watchOut: 'Unlisted — project-level financial diligence; compare delay history vs Prestige on KRERA.',
    tone: 'info',
  },
  casagrand: {
    label: 'Casagrand',
    tier: 2,
    priceRange: '₹5,800–9,000/sqft',
    listed: false,
    zones: ['south', 'east', 'north'],
    scores: { reraCompliance: 7, deliveryRecord: 7, constructionQuality: 7, financialStability: 6, afterSales: 6, valueForMoney: 8 },
    total: 41,
    summary: 'Chennai-heavy brand expanding BLR — competitive amenities in mid segment. Verify each BLR project on KRERA independently.',
    blrSignature: 'South BLR (Bannerghatta, Electronic City belt), selective East; check North launches case-by-case.',
    watchOut: 'BLR is newer market for brand — lean on completed-project visits more than Chennai reputation.',
    tone: 'info',
  },
  concorde: {
    label: 'Concorde Group',
    tier: 2,
    priceRange: '₹5,500–8,500/sqft',
    listed: false,
    zones: ['east', 'south', 'north', 'west'],
    scores: { reraCompliance: 7, deliveryRecord: 6, constructionQuality: 7, financialStability: 6, afterSales: 6, valueForMoney: 8 },
    total: 40,
    summary: 'Long-time BLR mid-market builder; Electronic City / South depth. Mixed delay history by phase — project-level KRERA review mandatory.',
    blrSignature: 'Concorde Napa Valley, Spring Meadows, South & East corridors.',
    watchOut: 'Read KRERA complaints for the exact phase you are buying — variance across phases is real.',
    tone: 'info',
  },
  vaishnavi: {
    label: 'Vaishnavi Group',
    tier: 2,
    priceRange: '₹7,000–11,000/sqft',
    listed: false,
    zones: ['central', 'north', 'east'],
    scores: { reraCompliance: 7, deliveryRecord: 7, constructionQuality: 7, financialStability: 6, afterSales: 7, valueForMoney: 7 },
    total: 41,
    summary: 'CBD / Hebbal–North corridor focus; boutique-to-mid size projects. Unlisted — governance via promoter track record.',
    blrSignature: 'Vaishnavi Oasis, North Watertown, central BLR infill.',
    watchOut: 'Smaller float — resale liquidity thinner than Prestige in same micro-market.',
    tone: 'info',
  },
  adarsh: {
    label: 'Adarsh Developers',
    tier: 2,
    priceRange: '₹6,500–10,000/sqft',
    listed: false,
    zones: ['south', 'east'],
    scores: { reraCompliance: 7, deliveryRecord: 7, constructionQuality: 7, financialStability: 6, afterSales: 6, valueForMoney: 8 },
    total: 41,
    summary: 'Established South / East BLR name; value-to-mid segment. Verify each new launch — group has legacy brand but project SPVs differ.',
    blrSignature: 'Adarsh Palm Retreat (Bellandur–Sarjapur belt), Wisteria, southern corridors.',
    watchOut: 'North BLR not core heartland — if they launch North, extra diligence vs their South track record.',
    tone: 'info',
  },
  totalEnv: {
    label: 'Total Environment',
    tier: 2,
    priceRange: '₹10,000–18,000/sqft',
    listed: false,
    zones: ['east', 'south', 'central'],
    scores: { reraCompliance: 8, deliveryRecord: 5, constructionQuality: 10, financialStability: 6, afterSales: 7, valueForMoney: 5 },
    total: 41,
    summary: 'Boutique eco-architecture; unique product. BLR presence concentrated Sarjapur / Whitefield / select infill. Buyers self-select for design.',
    blrSignature: 'Tangled Up In Green, Pursuit of a Radical Rhapsody — low-density, high-craft.',
    watchOut: 'Material schedule slippage (often multi-year). UC only if you accept timeline risk; else RTM.',
    tone: 'warning',
  },
};

const SCORE_FACTORS: [keyof BuilderScore, string][] = [
  ['reraCompliance', 'RERA compliance'],
  ['deliveryRecord', 'On-time delivery'],
  ['constructionQuality', 'Construction quality'],
  ['financialStability', 'Financial stability'],
  ['afterSales', 'After-sales'],
  ['valueForMoney', 'Value for money'],
];

const ZONE_LABEL: Record<ZoneKey, string> = {
  all: 'All Bangalore',
  north: 'North BLR',
  east: 'East BLR (Whitefield / ORR)',
  south: 'South BLR (Bannerghatta / EC)',
  central: 'Central / CBD–Hebbal',
  west: 'West BLR',
  pan: 'Pan-city (multiple corridors)',
};

function computeTotals() {
  (Object.keys(builders) as BuilderKey[]).forEach(k => {
    const s = builders[k].scores;
    builders[k].total = s.reraCompliance + s.deliveryRecord + s.constructionQuality + s.financialStability + s.afterSales + s.valueForMoney;
  });
}
computeTotals();

type BuilderKey2 = BuilderKey;

export default function BuilderReputation() {
  const [active, setActive] = useCanvasState<BuilderKey2>('builderBlr', 'prestige');
  const [zone, setZone] = useCanvasState<ZoneKey>('builderZone', 'all');

  const allKeys = Object.keys(builders) as BuilderKey2[];
  const keys = zone === 'all'
    ? allKeys
    : allKeys.filter(k => builders[k].zones.includes(zone) || builders[k].zones.includes('pan'));

  const setZoneSafe = (z: ZoneKey) => {
    setZone(z);
    const nk = z === 'all'
      ? allKeys
      : allKeys.filter(k => builders[k].zones.includes(z) || builders[k].zones.includes('pan'));
    const cur = active as BuilderKey;
    if (nk.length && !nk.includes(cur)) setActive(nk[0] as BuilderKey2);
  };

  const activeKey = (keys.includes(active as BuilderKey) ? active : keys[0]) as BuilderKey2;
  const b = builders[activeKey];

  const tier1 = allKeys.filter(k => builders[k].tier === 1).sort((a, b) => builders[b].total - builders[a].total);
  const tier2 = allKeys.filter(k => builders[k].tier === 2).sort((a, b) => builders[b].total - builders[a].total);

  return (
    <Stack gap={28} style={{ padding: '24px 28px', maxWidth: 1020 }}>

      <Stack gap={4}>
        <H1>Builder reputation — Bangalore (citywide)</H1>
        <Text tone="secondary">
          Tier 1–2 landscape across North, East, South, and Central BLR — not only Yelahanka. Scores are for relative comparison; always verify on KRERA + latest filings before booking UC.
        </Text>
      </Stack>

      <Grid columns={4} gap={14}>
        <Stat value="19" label="Builders scored" tone="info" />
        <Stat value="10" label="Tier 1 (listed-heavy)" tone="success" />
        <Stat value="5" label="On North shortlist" tone="success" />
        <Stat value="UC · Grade A" label="Your strategy filter" tone="warning" />
      </Grid>

      <Card>
        <CardHeader trailing={<Pill tone="warning" size="sm">Why citywide view matters</Pill>}>
          North BLR is one corridor — builder choice should survive comparison to East & South
        </CardHeader>
        <CardBody>
          <Text size="small" tone="secondary">
            Many buyers anchor only on Thanisandra–Yelahanka. A citywide map shows where each builder actually has depth (completed societies, resale liquidity, banker comfort). Use it to sanity-check: “If I paid the same ₹/sqft in Whitefield with Godrej vs North with Prestige, which builder risk am I taking?”
          </Text>
        </CardBody>
      </Card>

      <Divider />

      {/* ── Zone filter ── */}
      <Stack gap={10}>
        <H2>Filter by corridor</H2>
        <Row gap={6} wrap>
          {(Object.keys(ZONE_LABEL) as ZoneKey[]).map(z => (
            <Pill key={z} active={zone === z} onClick={() => setZoneSafe(z)} tone={z === 'all' ? 'neutral' : undefined}>
              {ZONE_LABEL[z]}
            </Pill>
          ))}
        </Row>
        <Text size="small" tone="secondary">
          Showing <Text weight="semibold" as="span">{keys.length}</Text> builders with presence in {ZONE_LABEL[zone]}. “Pan-city” builders appear in every non-“All” filter.
        </Text>
      </Stack>

      <Divider />

      {/* ── Master table ── */}
      <Stack gap={12}>
        <H2>Scorecard — {ZONE_LABEL[zone]}</H2>
        <Table
          headers={['Builder', 'Tier', '₹/sqft (BLR)', 'Listed', 'Score /60', 'Corridors', 'North shortlist']}
          rows={keys.map(k => [
            builders[k].label,
            `T${builders[k].tier}`,
            builders[k].priceRange,
            builders[k].listed ? 'Yes' : 'No',
            `${builders[k].total}/60`,
            builders[k].zones.filter(z => z !== 'pan').join(', ') || 'pan',
            builders[k].northShortlist ? builders[k].northShortlist!.slice(0, 42) + (builders[k].northShortlist!.length > 42 ? '…' : '') : '—',
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

      {/* ── Tier summary ── */}
      <Grid columns={2} gap={14}>
        <Stack gap={8}>
          <H3>Tier 1 — flagship BLR</H3>
          <Table
            headers={['Builder', 'Score', 'BLR note']}
            rows={tier1.map(k => {
              const sig = builders[k].blrSignature;
              return [builders[k].label, `${builders[k].total}/60`, sig.length > 72 ? sig.slice(0, 70) + '…' : sig];
            })}
            striped
          />
        </Stack>
        <Stack gap={8}>
          <H3>Tier 2 — value / design / niche</H3>
          <Table
            headers={['Builder', 'Score', 'BLR note']}
            rows={tier2.map(k => {
              const sig = builders[k].blrSignature;
              return [builders[k].label, `${builders[k].total}/60`, sig.length > 72 ? sig.slice(0, 70) + '…' : sig];
            })}
            striped
          />
        </Stack>
      </Grid>

      <Divider />

      {/* ── Charts (filtered set) ── */}
      <Stack gap={12}>
        <H2>Construction vs value — filtered builders</H2>
        <BarChart
          categories={keys.map(k => builders[k].label.split(' ')[0])}
          series={[
            { name: 'Construction', data: keys.map(k => builders[k].scores.constructionQuality) },
            { name: 'Value ₹/quality', data: keys.map(k => builders[k].scores.valueForMoney) },
            { name: 'Delivery', data: keys.map(k => builders[k].scores.deliveryRecord) },
          ]}
          height={keys.length > 12 ? 320 : 260}
        />
      </Stack>

      <Divider />

      {/* ── Deep dive ── */}
      <Stack gap={14}>
        <Row gap={8} align="center" wrap>
          <H2>Builder deep dive</H2>
          <Row gap={6} wrap>
            {keys.map(k => (
              <Pill
                key={k}
                active={activeKey === k}
                tone={builders[k].total >= 46 ? 'success' : builders[k].total >= 42 ? 'neutral' : 'warning'}
                onClick={() => setActive(k)}
              >
                {builders[k].label.split(' ')[0]}
              </Pill>
            ))}
          </Row>
        </Row>

        <Grid columns={4} gap={14}>
          <Stat value={`${b.total}/60`} label="Overall" tone={b.total >= 46 ? 'success' : b.total >= 42 ? undefined : 'warning'} />
          <Stat value={`Tier ${b.tier}`} label="Tier" tone={b.tier === 1 ? 'success' : undefined} />
          <Stat value={b.listed ? 'Listed' : 'Unlisted'} label="Transparency" tone={b.listed ? 'success' : 'warning'} />
          <Stat value={b.zones.filter(z => z !== 'pan').length ? `${b.zones.filter(z => z !== 'pan').length}+ zones` : 'Pan-BLR'} label="Corridors" />
        </Grid>

        <Grid columns={2} gap={14}>
          <Stack gap={8}>
            <H3>Score breakdown</H3>
            <BarChart
              categories={SCORE_FACTORS.map(([, l]) => l)}
              series={[{ name: b.label, data: SCORE_FACTORS.map(([key]) => b.scores[key]) }]}
              horizontal
              height={240}
            />
          </Stack>
          <Card>
            <CardHeader trailing={<Pill tone={b.tone} size="sm">T{b.tier}</Pill>}>{b.label}</CardHeader>
            <CardBody>
              <Stack gap={8}>
                <Text size="small">{b.summary}</Text>
                <Divider />
                <Text size="small" weight="semibold">Bangalore footprint</Text>
                <Text size="small" tone="secondary">{b.blrSignature}</Text>
                {b.northShortlist && (
                  <>
                    <Divider />
                    <Text size="small" weight="semibold">North search / shortlist</Text>
                    <Text size="small" tone="secondary">{b.northShortlist}</Text>
                  </>
                )}
                <Divider />
                <Row gap={6} align="start">
                  <Pill tone="warning" size="sm">Watch</Pill>
                  <Text size="small" tone="secondary">{b.watchOut}</Text>
                </Row>
              </Stack>
            </CardBody>
          </Card>
        </Grid>
      </Stack>

      <Divider />

      <Stack gap={12}>
        <H2>UC strategy — why Grade A + listed (mostly)</H2>
        <Grid columns={2} gap={14}>
          <Stack gap={5}>
            <Text size="small" weight="semibold">What UC hides</Text>
            {['Delivery & cash-flow risk', 'Spec vs actual specs', 'Land title on mother parcel', 'RERA penalty vs real remedy'].map(t => (
              <Row key={t} gap={6}><Text size="small" tone="secondary">−</Text><Text size="small" tone="secondary">{t}</Text></Row>
            ))}
          </Stack>
          <Stack gap={5}>
            <Text size="small" weight="semibold">What Tier 1 improves</Text>
            {['KRERA track record + brand cost of delay', 'Bank panel projects = extra legal pass', 'Resale depth in East & North', 'Audited balance sheets (listed)'].map(t => (
              <Row key={t} gap={6}><Text size="small" tone="secondary">+</Text><Text size="small" tone="secondary">{t}</Text></Row>
            ))}
          </Stack>
        </Grid>
      </Stack>

      <Divider />

      <Stack gap={12}>
        <H2>Verify any builder (any zone)</H2>
        <Grid columns={2} gap={14}>
          <Card>
            <CardHeader trailing={<Pill size="sm">KRERA</Pill>}>krera.karnataka.gov.in</CardHeader>
            <CardBody>
              <Text size="small">Promoter → all projects → complaints → penalties → quarterly construction %. Repeat for the exact SPV on your BBA.</Text>
            </CardBody>
          </Card>
          <Card>
            <CardHeader trailing={<Pill size="sm">Residents</Pill>}>Completed society visit</CardHeader>
            <CardBody>
              <Text size="small">Pick two delivered projects in the same corridor (e.g. East OR North), not brochure tours — seepage, lift, maintenance, handover honesty.</Text>
            </CardBody>
          </Card>
        </Grid>
      </Stack>

      <Divider />

      <Stack gap={10}>
        <H2>North shortlist — builder lens</H2>
        <Table
          headers={['Project', 'Builder', 'Why brand fits UC']}
          rows={[
            ['Purva Zenium 2', 'Puravankara', 'Listed; value-Tier1; earliest possession in set'],
            ['Prestige Avon', 'Prestige', 'Listed; max liquidity brand; verify price vs ₹3 Cr'],
            ['Sattva Lumina', 'Salarpuria Sattva', 'Listed; best ₹/sqft; township execution'],
            ['Brigade Eternia', 'Brigade', 'Listed; BDA NT address + Brigade resale premium'],
            ['Tata Varnam', 'Tata Housing', 'Group balance sheet; lowest builder-risk; commute trade-off'],
          ]}
          rowTone={['success', 'success', 'success', 'success', 'success']}
          striped
        />
        <Text size="small" tone="secondary">
          Citywide view: if a North project is priced like a Godrej Whitefield launch, compare KRERA delivery % and complaint density across both promoters before deciding.
        </Text>
      </Stack>

    </Stack>
  );
}
