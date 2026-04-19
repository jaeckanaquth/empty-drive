import {
  Card, CardBody, CardHeader,
  Divider, Grid, H1, H2,
  Pill, Row, Stack, Stat, Table, Text,
} from 'cursor/canvas';

/**
 * Five visit shortlist — same names and facts as blr-deep-eval / visit plan.
 * Update this file when budget ceiling, all-in bands, or deep-eval verdicts change.
 */

type Tier = 'strong' | 'ok' | 'weak';

interface PickRow {
  id: string;
  name: string;
  budget: string;
  budgetTier: Tier;
  area: string;
  areaTier: Tier;
  builder: string;
  builderTier: Tier;
  adultAmenities: string;
  amenityTier: Tier;
  other: string;
}

const ROWS: PickRow[] = [
  {
    id: 'purva',
    name: 'Purva Zenium 2',
    budget: '₹1.82–2.53 Cr all-in — comfortable vs ₹3 Cr ceiling',
    budgetTier: 'strong',
    area: 'Hosahalli / Airport Rd — emerging; thin social fabric today',
    areaTier: 'ok',
    builder: 'Puravankara — NSE-listed, Grade A track record',
    builderTier: 'strong',
    adultAmenities: 'Grade A club + pool + gym; smaller society = shorter queues; verify DG + fiber (blr-amenities matrix)',
    amenityTier: 'strong',
    other: 'Earliest possession (Jun 2027); strong airport side; Manyata ok; STRR upside — see deep-eval connectivity',
  },
  {
    id: 'prestige',
    name: 'Prestige Avon',
    budget: '~₹3.41 Cr all-in — ~₹41L over ceiling unless negotiated down',
    budgetTier: 'weak',
    area: 'Thanisandra — most complete North BLR belt; Metro + Manyata closest',
    areaTier: 'strong',
    builder: 'Prestige — top liquidity and delivery brand in South India',
    builderTier: 'strong',
    adultAmenities: 'Boutique 230 u / 10 ac — Prestige A package; low crowding vs mega-townships',
    amenityTier: 'strong',
    other: 'Best resale/rental story; Aug 2025 launch — highest UC timing risk; B-Khata pockets in belt — verify plot',
  },
  {
    id: 'sattva',
    name: 'Sattva Lumina',
    budget: '₹1.62–1.87 Cr all-in — largest headroom below ceiling',
    budgetTier: 'strong',
    area: 'Yelahanka + Rajanukunte — solid Yelahanka brand; SH-9 slightly peripheral',
    areaTier: 'ok',
    builder: 'Salarpuria Sattva — Grade A township specialist',
    builderTier: 'strong',
    adultAmenities: 'Strongest amenity mass on list (multi-club, pools); adult-fit if you use gym/pool — expect higher ₹/sqft maintenance',
    amenityTier: 'strong',
    other: 'Nov 2029 possession; large supply in one project; Khata/jurisdiction — verify in writing',
  },
  {
    id: 'brigade',
    name: 'Brigade Eternia',
    budget: '~₹2.41 Cr all-in — solid buffer under ₹3 Cr',
    budgetTier: 'strong',
    area: 'Yelahanka New Town — planned suburb, BBMP clarity, liquid address',
    areaTier: 'strong',
    builder: 'Brigade — NSE-listed, consistent common-area quality',
    builderTier: 'strong',
    adultAmenities: '14 ac / 1,124 u — balanced Brigade stack; confirm maintenance ₹/sqft + DG scope in agreement',
    amenityTier: 'strong',
    other: 'Mar vs Dec 2030 possession — resolve on RERA before token; STRR + NH44 help Manyata',
  },
  {
    id: 'tata',
    name: 'Tata Varnam',
    budget: '₹1.65–2.04 Cr all-in — strong budget fit',
    budgetTier: 'strong',
    area: 'Devanahalli / Carnatica — airport thesis; thin daily neighbourhood vs Yelahanka NT',
    areaTier: 'weak',
    builder: 'Tata Housing — A+ institutional due diligence, lowest builder risk',
    builderTier: 'strong',
    adultAmenities: 'Township-scale club + sports; most self-contained campus; phase-wise opening matters for your tower',
    amenityTier: 'strong',
    other: 'Manyata 60–80 min peak — do Tuesday drive; weakest social infra on list; best if frequent flyer + large flat',
  },
];

export default function ProjectSelection() {
  const underBudget = ROWS.filter(r => r.budgetTier !== 'weak').length;

  return (
    <Stack gap={24} style={{ padding: '24px 28px', maxWidth: 1080 }}>

      <Stack gap={6}>
        <Row gap={10} align="center">
          <H1>Pick a project — five filters</H1>
          <Pill tone="info">Visit shortlist × 5</Pill>
        </Row>
        <Text tone="secondary">
          Use this as a <Text weight="semibold" as="span">stack</Text>, not a single score: (1) budget gate, (2) area you can live in for years,
          (3) builder you trust under UC, (4) amenities you will actually use as a single adult (see <Text weight="semibold" as="span">blr-amenities</Text>),
          (5) everything else — commute, possession, legal, liquidity. Evidence lives in <Text weight="semibold" as="span">blr-deep-eval</Text>,{' '}
          <Text weight="semibold" as="span">blr-areas</Text>, <Text weight="semibold" as="span">blr-builder-reputation</Text>.
        </Text>
      </Stack>

      <Grid columns={5} gap={12}>
        <Stat value="1" label="Budget vs ₹3 Cr" tone="danger" />
        <Stat value="2" label="Area / micro-market" tone="success" />
        <Stat value="3" label="Builder" tone="success" />
        <Stat value="4" label="Adult amenities" tone="success" />
        <Stat value="5" label="Other (commute, time, legal…)" tone="neutral" />
      </Grid>

      <Card>
        <CardHeader trailing={<Pill tone="warning" size="sm">Gate first</Pill>}>
          How to read the table
        </CardHeader>
        <CardBody>
          <Stack gap={6}>
            <Text size="small">
              <Text weight="semibold" as="span">1 — Budget:</Text> only four projects clear ₹3 Cr all-in as modeled; Prestige Avon needs negotiation or a smaller unit quote.
            </Text>
            <Text size="small">
              <Text weight="semibold" as="span">2 — Area:</Text> “Good” here = established social fabric + legal clarity + commute you accept — not brochure greenery alone (<Text weight="semibold" as="span">blr-areas</Text>).
            </Text>
            <Text size="small">
              <Text weight="semibold" as="span">3 — Builder:</Text> all five are UC Grade A/A+ on your list; differences are liquidity, township execution, and early-stage risk — see builder canvas.
            </Text>
            <Text size="small">
              <Text weight="semibold" as="span">4 — Adult amenities:</Text> optimise for DG, fiber, gym/track, parking, low useless trophy load — shortlist matrix in <Text weight="semibold" as="span">blr-amenities</Text>.
            </Text>
            <Text size="small">
              <Text weight="semibold" as="span">5 — Other:</Text> possession date, Manyata run, RERA %, Khata class, resale pool — one line each in the last column; drill in deep-eval.
            </Text>
          </Stack>
        </CardBody>
      </Card>

      <Divider />

      <Stack gap={10}>
        <H2>Per project — five columns</H2>
        <Text size="small" tone="secondary">
          Row shading uses the <Text weight="semibold" as="span">budget</Text> column first (red = over ceiling); other columns use green / amber / red for strong / ok / weak within this shortlist only.
        </Text>
        <Table
          headers={['Project', '1 Budget', '2 Area', '3 Builder', '4 Adult amenities', '5 Other']}
          rows={ROWS.map(r => [
            r.name,
            r.budget,
            r.area,
            r.builder,
            r.adultAmenities,
            r.other,
          ])}
          rowTone={ROWS.map(r => (r.budgetTier === 'weak' ? 'danger' : undefined))}
          striped
        />
      </Stack>

      <Divider />

      <Stack gap={12}>
        <H2>Quick composite (same five rows)</H2>
        <Table
          headers={['Project', 'Budget', 'Area', 'Builder', 'Amenities', 'Other']}
          rows={ROWS.map(r => [
            r.name,
            r.budgetTier === 'strong' ? 'Strong' : r.budgetTier === 'ok' ? 'OK' : 'Weak',
            r.areaTier === 'strong' ? 'Strong' : r.areaTier === 'ok' ? 'OK' : 'Weak',
            r.builderTier === 'strong' ? 'Strong' : 'OK',
            r.amenityTier === 'strong' ? 'Strong' : 'OK',
            r.id === 'prestige' ? 'Best exit story; price + UC timing' :
              r.id === 'purva' ? 'Time + value; area thinner' :
              r.id === 'sattva' ? 'Value + amenities; wait + township scale' :
              r.id === 'brigade' ? 'Balanced; confirm possession month' :
              'Builder + campus; commute + social thin',
          ])}
          rowTone={ROWS.map(r => {
            if (r.budgetTier === 'weak') return 'danger';
            if (r.areaTier === 'weak') return 'warning';
            return undefined;
          })}
          striped
        />
        <Text size="small" tone="secondary">
          {underBudget} of 5 pass the budget gate as priced; Prestige Avon is the outlier on (1) while leading on (2)(3)(4)(5) for Manyata-centric life — only if you can fix price or stretch budget deliberately.
        </Text>
      </Stack>

    </Stack>
  );
}
