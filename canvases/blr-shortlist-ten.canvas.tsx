import {
  Card, CardBody, CardHeader,
  Divider, Grid, H1, H2,
  Pill, Row, Stack, Stat, Table, Text,
} from 'cursor/canvas';

/**
 * Canonical list of 10 North-BLR projects for the next research pass (Reddit #2, K-RERA, etc.).
 * Core 5 = index.html / blr-deep-eval visit row. Expand 5 = same thesis belt; not all Grade A (Arvind = B+ value slot).
 * When this list changes: sync blr-research-snapshot scope, and later index/visit-guide/deep-eval if visits expand.
 */

type Tier = 'core' | 'expand';

interface Row {
  rank: number;
  tier: Tier;
  name: string;
  builder: string;
  grade: string;
  area: string;
  allIn: string;
  possession: string;
  role: string;
}

const TEN: Row[] = [
  { rank: 1,  tier: 'core',   name: 'Purva Zenium 2',          builder: 'Puravankara',       grade: 'A',  area: 'Hosahalli · Airport Rd',     allIn: '₹1.82–2.53 Cr', possession: 'Jun 2027',     role: 'Day visit · earliest OC · airport belt' },
  { rank: 2,  tier: 'core',   name: 'Prestige Avon',           builder: 'Prestige Group',    grade: 'A',  area: 'Thanisandra Main Rd',       allIn: '~₹3.41 Cr',     possession: 'Dec 2028',     role: 'Day visit · Manyata/Metro belt · over ₹3 Cr at list' },
  { rank: 3,  tier: 'core',   name: 'Sattva Lumina',           builder: 'Salarpuria Sattva', grade: 'A',  area: 'Yelahanka · Rajanukunte',   allIn: '₹1.62–1.87 Cr', possession: 'Nov 2029',     role: 'Day visit · best ₹/sqft township scale' },
  { rank: 4,  tier: 'core',   name: 'Brigade Eternia',         builder: 'Brigade Group',     grade: 'A',  area: 'Yelahanka New Town',        allIn: '~₹2.41 Cr',     possession: 'Mar 2030*',    role: 'Day visit · BDA NT address · confirm RERA month' },
  { rank: 5,  tier: 'core',   name: 'Tata Varnam',             builder: 'Tata Housing',      grade: 'A+', area: 'Devanahalli · Shettigere',  allIn: '₹1.65–2.04 Cr', possession: 'Dec 2029',     role: 'Day visit · campus scale · Manyata peak risk' },
  { rank: 6,  tier: 'expand', name: 'Sobha Athena',          builder: 'Sobha Limited',     grade: 'A',  area: 'Thanisandra Main Rd',       allIn: '~₹2.43 Cr',     possession: 'Jun 2027 (est.)', role: 'Thanisandra boutique alt to Avon/Camden · verify RERA # portal' },
  { rank: 7,  tier: 'expand', name: 'Prestige Camden Gardens', builder: 'Prestige Group',  grade: 'A',  area: 'Thanisandra Main Rd',       allIn: '~₹2.11–2.79 Cr', possession: 'Dec 2027 (est.)', role: 'Prestige under ceiling vs Avon · 120 u compact amenities' },
  { rank: 8,  tier: 'expand', name: 'Brigade Insignia',       builder: 'Brigade Group',     grade: 'A',  area: 'Yelahanka · NH44',          allIn: '₹3.18 Cr+',     possession: 'Jun 2029',     role: 'NH44 flagship · budget edge / stretch · large SBA' },
  { rank: 9,  tier: 'expand', name: 'Arvind Bel Air',         builder: 'Arvind SmartSpaces', grade: 'B+', area: 'Yelahanka New Town Rd',     allIn: '~₹1.29–1.95 Cr', possession: 'Jun 2026',     role: 'Value / earlier keys · not Grade A build — diligence slot' },
  { rank: 10, tier: 'expand', name: 'Birla Yelahanka',       builder: 'Birla Estates',     grade: 'A',  area: 'Yelahanka',                 allIn: 'Price TBC',     possession: 'TBC',          role: 'Watch-list upgrade · RERA string in analysis — confirm before visit' },
];

export default function ShortlistTen() {
  const core = TEN.filter(r => r.tier === 'core').length;
  const expand = TEN.length - core;

  return (
    <Stack gap={22} style={{ padding: '24px 28px', maxWidth: 1120 }}>

      <Stack gap={6}>
        <Row gap={10} align="center">
          <H1>North BLR — shortlist of 10</H1>
          <Pill tone="info">Research pass #2 scope</Pill>
        </Row>
        <Text tone="secondary">
          <Text weight="semibold" as="span">{core} core</Text> projects match your current PWA visit row (<Text weight="semibold" as="span">index.html</Text> + <Text weight="semibold" as="span">blr-deep-eval</Text>).
          <Text weight="semibold" as="span"> {expand} expand</Text> slots add Thanisandra alternates, Yelahanka NH44 flagship, one value B+ pick, and one Grade A watch-list project — all within the same Manyata / North thesis for the next Reddit and forum scour.
        </Text>
      </Stack>

      <Grid columns={4} gap={12}>
        <Stat value="10" label="Total shortlist" tone="success" />
        <Stat value={`${core}`} label="Core (visits today)" tone="success" />
        <Stat value={`${expand}`} label="Expand (pass #2)" tone="warning" />
        <Stat value="≤₹3 Cr" label="Policy (most rows)" tone="neutral" />
      </Grid>

      <Card>
        <CardHeader trailing={<Pill tone="warning" size="sm">Rules</Pill>}>
          How to use the ten before pass #2
        </CardHeader>
        <CardBody>
          <Stack gap={6}>
            <Text size="small">
              Run Reddit / forums / K-RERA complaint search <Text weight="semibold" as="span">per row</Text> — log results in <Text weight="semibold" as="span">blr-research-snapshot</Text> (add a “Pass 2” subsection when you have findings).
            </Text>
            <Text size="small">
              If an expand project drops out, replace it with another from the same belt (e.g. Mahindra Navaratna Agrahara, Godrej Thanisandra once RERA is live) and bump the table here in the same commit as <Text weight="semibold" as="span">analysis.html</Text> / <Text weight="semibold" as="span">index.html</Text> if facts change.
            </Text>
            <Text size="small" tone="secondary">
              *Brigade Eternia: Mar 2030 in repo; some portals show Dec 2030 — RERA PDF wins.
            </Text>
          </Stack>
        </CardBody>
      </Card>

      <Divider />

      <Stack gap={10}>
        <H2>The ten (fixed order for research)</H2>
        <Table
          headers={['#', 'Tier', 'Project', 'Builder', 'Gr', 'Micro-market', 'All-in (repo band)', 'Possession', 'Role']}
          rows={TEN.map(r => [
            String(r.rank),
            r.tier === 'core' ? 'Core' : 'Expand',
            r.name,
            r.builder,
            r.grade,
            r.area,
            r.allIn,
            r.possession,
            r.role,
          ])}
          rowTone={TEN.map(r =>
            r.tier === 'core' ? 'success' :
            r.grade === 'B+' ? 'warning' :
            r.name.includes('Birla') ? 'warning' :
            undefined
          )}
          striped
        />
      </Stack>

      <Divider />

      <Stack gap={8}>
        <H2>Cross-walk</H2>
        <Text size="small" tone="secondary">
          Deep matrix (scores per criterion): <Text weight="semibold" as="span">blr-deep-eval</Text> — currently populated for the <Text weight="semibold" as="span">core 5</Text> only.
          Scored ₹3 Cr list (4 legacy rows): <Text weight="semibold" as="span">blr-property-shortlist.canvas.tsx</Text> — overlaps ranks 6–9 above; refresh that file if you change expand slots.
          Builder citywide context: <Text weight="semibold" as="span">blr-builder-reputation</Text>.
        </Text>
      </Stack>

    </Stack>
  );
}
