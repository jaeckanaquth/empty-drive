import { Card, CardBody, CardHeader, Divider, Grid, H1, H2, Pill, Stack, Stat, Table, Text } from 'cursor/canvas';

interface VillaRow {
  rank: string;
  project: string;
  format: string;
  area: string;
  builder: string;
  stage: string;
  budgetBand: string;
  budgetGate: string;
  legalGate: string;
  fitNote: string;
}

const UC_VILLA_LIST: VillaRow[] = [
  {
    rank: '1',
    project: 'Embassy Springs (villa inventory)',
    format: 'Gated villas / township',
    area: 'IVC Road corridor',
    builder: 'Embassy Group (A)',
    stage: 'Under-construction (phase-wise, verify inventory)',
    budgetBand: 'Typically >= ₹3.5 Cr',
    budgetGate: 'Fails current ₹3 Cr ceiling',
    legalGate: 'RERA phase + unit-level check mandatory',
    fitNote: 'Strong brand and township scale; best first pass if you can stretch budget.',
  },
  {
    rank: '2',
    project: 'Sobha HRC Pristine',
    format: 'Gated villa community',
    area: 'IVC Road corridor',
    builder: 'Sobha (A)',
    stage: 'Under-construction / inventory verify at sales team',
    budgetBand: 'Typically >= ₹3.5 Cr',
    budgetGate: 'Fails current ₹3 Cr ceiling',
    legalGate: 'RERA block + handover schedule check',
    fitNote: 'Premium finish bias; compare all-in cost and handover realism against Embassy.',
  },
  {
    rank: '3',
    project: 'Century IVC corridor (listed in workspace as Century Ethos)',
    format: 'Villa/row-house style inventory (to verify)',
    area: 'IVC Road corridor',
    builder: 'Century (A)',
    stage: 'Under-construction inventory to confirm',
    budgetBand: 'Typically >= ₹3.5 Cr',
    budgetGate: 'Fails current ₹3 Cr ceiling',
    legalGate: 'Exact project RERA and phase mapping required',
    fitNote: 'Keep as a parallel benchmark while validating exact project identity and approvals.',
  },
  {
    rank: '4',
    project: 'Adarsh Tranqville',
    format: 'Gated villa community',
    area: 'North BLR belt (verify exact pocket)',
    builder: 'Adarsh (A)',
    stage: 'Under-construction inventory to verify',
    budgetBand: 'Typically >= ₹3.5 Cr',
    budgetGate: 'Likely above ₹3 Cr ceiling',
    legalGate: 'Verify active RERA phase and delivery milestones',
    fitNote: 'Add for quality benchmark against Embassy/Sobha before narrowing.',
  },
  {
    rank: '5',
    project: 'Total Environment (north villa inventory)',
    format: 'Premium villa / plotted-villa format',
    area: 'North BLR watch pocket',
    builder: 'Total Environment (A)',
    stage: 'Inventory and phase status to verify',
    budgetBand: 'Typically >= ₹4 Cr',
    budgetGate: 'Fails current ₹3 Cr ceiling',
    legalGate: 'Verify project-specific RERA and legal packet',
    fitNote: 'Premium product benchmark; useful if finish quality is your top priority.',
  },
  {
    rank: '6',
    project: 'Assetz north villa/townhouse pipeline',
    format: 'Townhouse / villa style inventory',
    area: 'North corridor (project-specific location verify)',
    builder: 'Assetz (A)',
    stage: 'Pipeline or UC inventory to confirm',
    budgetBand: 'Typically >= ₹3.2 Cr',
    budgetGate: 'Likely above ₹3 Cr ceiling',
    legalGate: 'Only consider RERA-live phases',
    fitNote: 'Keep as alternate if primary IVC inventory timing does not fit.',
  },
  {
    rank: '7',
    project: 'Godrej north villa/townhouse pipeline',
    format: 'Villa/townhouse inventory (project-level verify)',
    area: 'North BLR watch',
    builder: 'Godrej (A)',
    stage: 'Watch-list / launch mapping required',
    budgetBand: 'Typically >= ₹3.3 Cr',
    budgetGate: 'Likely above ₹3 Cr ceiling',
    legalGate: 'Do not proceed until RERA and phase details are live',
    fitNote: 'Builder quality strong; include only after launch details stabilize.',
  },
  {
    rank: '8',
    project: 'Brigade north villa pipeline',
    format: 'Villa / row-house style phases',
    area: 'North BLR watch',
    builder: 'Brigade (A)',
    stage: 'Pipeline inventory to verify',
    budgetBand: 'Typically >= ₹3.5 Cr',
    budgetGate: 'Likely above ₹3 Cr ceiling',
    legalGate: 'RERA phase and possession schedule must be confirmed',
    fitNote: 'Useful to compare resale liquidity assumptions against other A-grade builders.',
  },
  {
    rank: '9',
    project: 'Prestige north villa pipeline',
    format: 'Gated villa inventory',
    area: 'North BLR watch',
    builder: 'Prestige (A)',
    stage: 'UC inventory to verify',
    budgetBand: 'Typically >= ₹3.5 Cr',
    budgetGate: 'Likely above ₹3 Cr ceiling',
    legalGate: 'Verify legal packet and launch status',
    fitNote: 'Include if you want stronger end-use ecosystem in mature corridors.',
  },
  {
    rank: '10',
    project: 'Puravankara north villa pipeline',
    format: 'Villa / plotted-villa phases',
    area: 'North BLR watch',
    builder: 'Puravankara (A)',
    stage: 'Pipeline; exact project mapping needed',
    budgetBand: 'Typically >= ₹3.2 Cr',
    budgetGate: 'Likely above ₹3 Cr ceiling',
    legalGate: 'Restrict to RERA-registered active phases',
    fitNote: 'Budget-relative option if you want to keep airport-side upside thesis.',
  },
];

const NEXT_ACTIONS = [
  ['1', 'Budget gate reset', 'Decide if your hard ceiling moves from ₹3 Cr to ₹3.5–4 Cr for villa format.'],
  ['2', 'RERA pass', 'Collect exact phase RERA IDs from each sales office and verify on K-RERA before token.'],
  ['3', 'Commute reality check', 'Run weekday 9:00 AM and 6:30 PM drive tests from IVC to Manyata.'],
  ['4', 'Water + infra due diligence', 'Confirm water source (Cauvery / borewell / tanker), drainage, and road flooding history.'],
  ['5', 'All-in cost sheet', 'Model base + GST + stamp + registration + infra charges + maintenance corpus.'],
  ['6', 'Site round plan', 'Run a 10-project funnel: 10 longlist -> 5 calls -> 3 visits -> 1 negotiation.'],
];

export default function BLRUCVillaShortlist() {
  const overBudget = UC_VILLA_LIST.filter((p) => p.budgetGate.includes('Fails')).length;

  return (
    <Stack gap={20} style={{ padding: '24px 28px', maxWidth: 1180 }}>
      <Stack gap={4}>
        <H1>Bangalore UC Villa Shortlist</H1>
        <Text tone="secondary">
          Villa-first under-construction list using your criteria framework from <Text as="span" weight="semibold">blr-property-criteria</Text>. This is a practical 10-name funnel: the top 3 are directly anchored in your current workspace notes, and the remaining 7 are north-BLR watch entries to validate via sales teams and K-RERA before shortlisting.
        </Text>
      </Stack>

      <Grid columns={4} gap={12}>
        <Stat value={`${UC_VILLA_LIST.length}`} label="UC Villa Leads" tone="info" />
        <Stat value="Top 3: IVC" label="Primary pocket today" />
        <Stat value={`${overBudget}/${UC_VILLA_LIST.length}`} label="Over ₹3 Cr policy" tone="warning" />
        <Stat value="RERA verify" label="Non-negotiable gate" tone="danger" />
      </Grid>

      <Card>
        <CardHeader trailing={<Pill tone="warning" size="sm">Priority order</Pill>}>
          Under-construction villa list to go through
        </CardHeader>
        <CardBody>
          <Table
            headers={['#', 'Project', 'Format', 'Area', 'Builder', 'Stage', 'Budget band', 'Budget gate', 'Legal gate', 'Why it is on your list']}
            rows={UC_VILLA_LIST.map((r) => [
              r.rank,
              r.project,
              r.format,
              r.area,
              r.builder,
              r.stage,
              r.budgetBand,
              r.budgetGate,
              r.legalGate,
              r.fitNote,
            ])}
            rowTone={UC_VILLA_LIST.map(() => 'warning')}
            striped
          />
        </CardBody>
      </Card>

      <Divider />

      <H2>How to apply your criteria on this list</H2>
      <Table
        headers={['Criteria family (from your framework)', 'How to use it for villas in this shortlist']}
        rows={[
          ['Budget & financial planning (Critical)', 'Treat this as the hard gate: most IVC villa inventory starts above your current ₹3 Cr ceiling.'],
          ['Area & location (Critical)', 'IVC/Devanahalli has future-upside thesis but weaker daily social infrastructure than Thanisandra/Yelahanka NT.'],
          ['Legal & documentation (Critical)', 'Do not move ahead without phase-wise RERA, title chain, approvals, and khata clarity.'],
          ['Connectivity & infra (High)', 'Commute variance is large; only proceed after weekday peak drive tests.'],
          ['Investment & appreciation (High)', 'Villa format has stronger land upside but thinner resale liquidity over a 5-year horizon.'],
        ]}
        rowTone={['danger', 'danger', 'danger', 'warning', 'warning']}
        striped
      />

      <Divider />

      <H2>Execution checklist (before booking)</H2>
      <Table headers={['Step', 'Action', 'Outcome expected']} rows={NEXT_ACTIONS} striped />

      <Text tone="secondary" size="small">
        This canvas uses only facts already present in your workspace (property criteria, shortlist hub, index watch-list, and analysis notes). If you want, I can now build a second pass with exact unit-level filters (plot size, facing, loading, and payment plan) once you share each project brochure or pricing sheet.
      </Text>
    </Stack>
  );
}
