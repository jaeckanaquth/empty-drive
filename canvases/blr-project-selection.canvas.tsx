import {
  Card, CardBody, CardHeader,
  Divider, Grid, H1, H2,
  Pill, Row, Stack, Stat, Table, Text,
} from 'cursor/canvas';

/**
 * Visit shortlist (5) — numbers reconciled to index.html + analysis.html + blr-deep-eval.
 * Category-family “who leads” matrix: blr-property-criteria.canvas.tsx (same commit family when edits).
 * On price/RERA/possession change: patch index + analysis + deep-eval in same commit, then this file.
 */

type Tier = 'strong' | 'ok' | 'weak';

interface FactRow {
  name: string;
  rera: string;
  base: string;
  allIn: string;
  vsCeiling: string;
  possession: string;
  launched: string;
  band2026to2030: string;
}

/** Same figures as analysis.html comparison table (Apr 2026 repo). */
const FACTS: FactRow[] = [
  {
    name: 'Purva Zenium 2',
    rera: 'PRM/KA/RERA/1251/309/PR/071022/005303',
    base: '₹1.71–2.38 Cr',
    allIn: '₹1.82–2.53 Cr',
    vsCeiling: 'Within — up to ~₹1.18 Cr headroom',
    possession: 'Jun 2027',
    launched: 'RERA Oct 2022',
    band2026to2030: 'Yes — OC in 2027 (none on list before mid-2027)',
  },
  {
    name: 'Prestige Avon',
    rera: 'Confirm at sales + K-RERA before token',
    base: '₹3.2 Cr (quoted)',
    allIn: '~₹3.41 Cr',
    vsCeiling: 'Over — ~₹41L above ₹3 Cr unless base drops',
    possession: 'Dec 2028',
    launched: 'Aug 2025 launch',
    band2026to2030: 'Yes — 2028',
  },
  {
    name: 'Sattva Lumina',
    rera: 'PR/060924/007009',
    base: '₹1.52–1.75 Cr',
    allIn: '₹1.62–1.87 Cr',
    vsCeiling: 'Within — largest buffer on list',
    possession: 'Nov 2029',
    launched: 'RERA Sep 2024',
    band2026to2030: 'Yes — 2029',
  },
  {
    name: 'Brigade Eternia',
    rera: 'PRM/KA/RERA/1251/309/PR/070325/007559',
    base: '₹2.26 Cr (quoted)',
    allIn: '~₹2.41 Cr',
    vsCeiling: 'Within — ~₹59L buffer',
    possession: 'Mar 2030 (see issues — Dec 2030 on some portals)',
    launched: 'RERA Mar 2025',
    band2026to2030: 'Yes — 2030',
  },
  {
    name: 'Tata Varnam',
    rera: 'PR/110825/007988',
    base: '₹1.55–1.91 Cr',
    allIn: '₹1.65–2.04 Cr',
    vsCeiling: 'Within — strong buffer',
    possession: 'Dec 2029',
    launched: 'RERA Aug 2025',
    band2026to2030: 'Yes — 2029',
  },
];

interface IssueRow {
  name: string;
  cost: string;
  time: string;
  areaCommute: string;
  legal: string;
  specsSociety: string;
  amenityMaint: string;
}

/** Watchpoints pulled from analysis.html + blr-deep-eval narrative (not a new web crawl). */
const ISSUES: IssueRow[] = [
  {
    name: 'Purva Zenium 2',
    cost: 'UC GST 5% in all-in model; stamp+reg ~6.5% — same as index.html',
    time: 'Earliest OC on list — pre-EMI ends soonest; still ~18+ mo from Apr 2026',
    areaCommute: 'Hosahalli emerging — thin social infra; Manyata ok; STRR upside (deep-eval / areas)',
    legal: 'Confirm A-Khata BBMP path (not GP); 30-yr EC; RERA % vs site photos before each tranche',
    specsSociety: 'SBA 1,231–1,710 · loading ~25–28% — verify carpet on K-RERA',
    amenityMaint: 'Smaller society — lower crowding; verify DG all points + fiber duct (blr-amenities)',
  },
  {
    name: 'Prestige Avon',
    cost: 'Primary gate failure at list pricing — need negotiation / smaller unit / stretch budget',
    time: 'Dec 2028 OC but Aug 2025 launch — lowest construction % risk on list until RERA proves pace',
    areaCommute: 'Best Manyata + Metro belt on shortlist (Thanisandra)',
    legal: 'B-Khata pockets in belt — plot-specific Khata; RERA number must be on portal before token',
    specsSociety: 'SBA/carpet TBC at visit; 230 units boutique — loading ~27–30% typical Prestige',
    amenityMaint: 'Boutique amenity load — favourable vs mega-township; still verify ₹/sqft commitment',
  },
  {
    name: 'Sattva Lumina',
    cost: 'Best ₹/sqft in band; GST+charges same UC rules as index model',
    time: 'Nov 2029 — longest cash lock among “value” picks; tower-wise RERA dates',
    areaCommute: 'Yelahanka brand + Rajanukunte peripheral — SH-9 / STRR story (areas canvas)',
    legal: 'Jurisdiction BBMP vs BDA vs BMRDA — get expected Khata class at OC in writing',
    specsSociety: '1,553 units — township queues; loading can creep ~30%+ — RERA carpet only',
    amenityMaint: 'Highest amenity mass — adult-fit if you use pool/gym; else you pay for idle trophy',
  },
  {
    name: 'Brigade Eternia',
    cost: 'Mid-pack all-in; interiors/parking extras still inside typical ₹3 Cr plan',
    time: 'Mar vs Dec 2030 conflict across portals — RERA printout + BBA must match before token',
    areaCommute: 'Yelahanka NT — best suburban completeness vs Hosahalli / Devanahalli',
    legal: 'BBMP A-Khata expected; standard UC EC/sanction checks',
    specsSociety: '1,620–1,820 SBA strong; 1,124 units / 14 ac balanced scale',
    amenityMaint: 'Brigade ₹4–6/sqft typical — confirm in agreement; DG AC points in writing',
  },
  {
    name: 'Tata Varnam',
    cost: 'Wide base band (size-driven); still within ₹3 Cr at quoted lower configs',
    time: 'Dec 2029; Aug 2025 launch — verify physical progress on K-RERA before heavy milestone',
    areaCommute: 'Manyata peak 60–80 min — mandatory Tuesday test drive; airport best-in-list',
    legal: 'Tata diligence strong; confirm BMRDA/LPA vs GP wording in BBA',
    specsSociety: 'Largest SBA range; ~22–26% loading best on list — still pick tower/view carefully',
    amenityMaint: 'Township phase roll-out — which club/retail opens with your tower tranche',
  },
];

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
    budget: 'See facts row — within ₹3 Cr all-in band',
    budgetTier: 'strong',
    area: 'Hosahalli / Airport Rd — emerging; thin social fabric today',
    areaTier: 'ok',
    builder: 'Puravankara — NSE-listed, Grade A track record',
    builderTier: 'strong',
    adultAmenities: 'Grade A club + pool + gym; smaller society = shorter queues; verify DG + fiber (blr-amenities matrix)',
    amenityTier: 'strong',
    other: 'Earliest keys Jun 2027; STRR + airport thesis; issues row for legal/social',
  },
  {
    id: 'prestige',
    name: 'Prestige Avon',
    budget: 'See facts row — ~₹41L over ceiling at quoted all-in',
    budgetTier: 'weak',
    area: 'Thanisandra — most complete North BLR belt; Metro + Manyata closest',
    areaTier: 'strong',
    builder: 'Prestige — top liquidity and delivery brand in South India',
    builderTier: 'strong',
    adultAmenities: 'Boutique 230 u / 10 ac — Prestige A package; low crowding vs mega-townships',
    amenityTier: 'strong',
    other: 'Best resale/rental; UC + Khata + SBA TBC — issues row',
  },
  {
    id: 'sattva',
    name: 'Sattva Lumina',
    budget: 'See facts row — largest headroom below ceiling',
    budgetTier: 'strong',
    area: 'Yelahanka + Rajanukunte — solid Yelahanka brand; SH-9 slightly peripheral',
    areaTier: 'ok',
    builder: 'Salarpuria Sattva — Grade A township specialist',
    builderTier: 'strong',
    adultAmenities: 'Strongest amenity mass on list; adult-fit if you use gym/pool — higher ₹/sqft maintenance risk',
    amenityTier: 'strong',
    other: 'Nov 2029 OC; 1,553-unit scale — issues row for jurisdiction + absorption',
  },
  {
    id: 'brigade',
    name: 'Brigade Eternia',
    budget: 'See facts row — solid buffer under ₹3 Cr',
    budgetTier: 'strong',
    area: 'Yelahanka New Town — planned suburb, BBMP clarity, liquid address',
    areaTier: 'strong',
    builder: 'Brigade — NSE-listed, consistent common-area quality',
    builderTier: 'strong',
    adultAmenities: '14 ac / 1,124 u — balanced Brigade stack; confirm maintenance ₹/sqft + DG scope in agreement',
    amenityTier: 'strong',
    other: 'Resolve Mar vs Dec 2030 on RERA before token — issues row',
  },
  {
    id: 'tata',
    name: 'Tata Varnam',
    budget: 'See facts row — strong budget fit on lower configs',
    budgetTier: 'strong',
    area: 'Devanahalli / Carnatica — airport thesis; thin daily neighbourhood vs Yelahanka NT',
    areaTier: 'weak',
    builder: 'Tata Housing — A+ institutional due diligence, lowest builder risk',
    builderTier: 'strong',
    adultAmenities: 'Township-scale club + sports; campus self-containment; phase-wise amenity opening matters',
    amenityTier: 'strong',
    other: 'Commute + social weakest for Manyata-centric life — issues row',
  },
];

export default function ProjectSelection() {
  const underBudget = ROWS.filter(r => r.budgetTier !== 'weak').length;

  return (
    <Stack gap={24} style={{ padding: '24px 28px', maxWidth: 1180 }}>

      <Stack gap={6}>
        <Row gap={10} align="center">
          <H1>Pick a project — five filters</H1>
          <Pill tone="info">Visit shortlist × 5</Pill>
        </Row>
        <Text tone="secondary">
          This canvas <Text weight="semibold" as="span">does not replace K-RERA or the sales office</Text>. Numbers and dates below were
          <Text weight="semibold" as="span"> reconciled in-repo</Text> to <Text weight="semibold" as="span">index.html</Text>,{' '}
          <Text weight="semibold" as="span">analysis.html</Text>, and <Text weight="semibold" as="span">blr-deep-eval</Text> (Apr 2026 workspace).
          A separate <Text weight="semibold" as="span">Apr 2026 web search pass</Text> (aggregators + builder affiliates) and portal limits are documented in{' '}
          <Text weight="semibold" as="span">blr-research-snapshot.canvas.tsx</Text> — use that for conflicts (RERA strings, possession noise, Manyata time for Tata).
          The <Text weight="semibold" as="span">ten buying-category families</Text> (budget, area, investment, …) and which visit option leads each are in{' '}
          <Text weight="semibold" as="span">blr-property-criteria.canvas.tsx</Text> — use that before treating this five-filter stack as the whole framework.
          Always confirm base, GST, possession, and RERA % on the portal before paying.
        </Text>
      </Stack>

      <Grid columns={5} gap={12}>
        <Stat value="Jun 2027" label="Earliest OC (Purva)" tone="success" />
        <Stat value="Mar 2030" label="Latest OC (Brigade)" tone="warning" />
        <Stat value="4 / 5" label="Within ₹3 Cr @ list" tone="success" />
        <Stat value="79/100" label="Top deep-eval sum" tone="success" />
        <Stat value="2027–30" label="OC band" tone="neutral" />
      </Grid>

      <Card>
        <CardHeader trailing={<Pill tone="info" size="sm">blr-property-criteria</Pill>}>
          Same decision, two lenses
        </CardHeader>
        <CardBody>
          <Stack gap={6}>
            <Text size="small">
              <Text weight="semibold" as="span">Criteria canvas</Text> uses <Text weight="semibold" as="span">ten category families</Text> (Critical: budget, area, legal; High: investment, connectivity, type, builder; Medium: amenities, society/maintenance, safety-lifestyle).
              <Text weight="semibold" as="span"> All-rounder there:</Text> Brigade Eternia (highest deep-eval total; strong area + legal).
              <Text weight="semibold" as="span"> Budget + earliest keys:</Text> Purva or Sattva.
              <Text weight="semibold" as="span"> Manyata + social + liquidity</Text> (if price fixed): Prestige Avon.
            </Text>
            <Text size="small" tone="secondary">
              This page’s <Text weight="semibold" as="span">five filters</Text> are a compressed stack after facts + issues: (1) budget, (2) area, (3) builder, (4) adult amenities, (5) residual — map filter (1) to criteria <Text weight="semibold" as="span">Budget</Text>; (2) to <Text weight="semibold" as="span">Area + Connectivity + Safety/lifestyle</Text> overlap; (4) to criteria <Text weight="semibold" as="span">Amenities</Text> + half of <Text weight="semibold" as="span">Society/maintenance</Text>; (5) to possession, RERA, end-use, and risk not already captured.
            </Text>
          </Stack>
        </CardBody>
      </Card>

      <Card>
        <CardHeader trailing={<Pill tone="warning" size="sm">2026–2030</Pill>}>
          Occupation window (what “when occupied” means here)
        </CardHeader>
        <CardBody>
          <Stack gap={6}>
            <Text size="small">
              Your constraint <Text weight="semibold" as="span">2026–2030</Text> is interpreted as <Text weight="semibold" as="span">expected first OC / handover in that window</Text>.
              On current repo data, <Text weight="semibold" as="span">none</Text> of the five visit targets OC before <Text weight="semibold" as="span">Jun 2027</Text> (Purva).
              The rest cluster <Text weight="semibold" as="span">Dec 2028 → Mar 2030</Text>. If you truly need keys in <Text weight="semibold" as="span">2026</Text>, this UC shortlist is the wrong set — revisit RTM or earlier-phase inventory outside this list.
            </Text>
          </Stack>
        </CardBody>
      </Card>

      <Divider />

      <Stack gap={10}>
        <H2>Facts table — cost, RERA, possession (reconciled)</H2>
        <Table
          headers={['Project', 'RERA', 'Base ₹', 'All-in ₹', 'vs ₹3 Cr', 'Target OC', '2026–30 band note']}
          rows={FACTS.map(f => [
            f.name,
            f.rera,
            f.base,
            f.allIn,
            f.vsCeiling,
            f.possession,
            f.band2026to2030,
          ])}
          rowTone={FACTS.map(f => (f.name === 'Prestige Avon' ? 'danger' : undefined))}
          striped
        />
        <Text size="small" tone="secondary">
          All-in = base + 5% GST (UC) + stamp/registration (~6.5%) per the same model as <Text weight="semibold" as="span">index.html</Text> / <Text weight="semibold" as="span">analysis.html</Text>; round to sales quote.
        </Text>
      </Stack>

      <Divider />

      <Stack gap={10}>
        <H2>Issues checklist — justify each before a token</H2>
        <Text size="small" tone="secondary">
          One row per project: same themes you have been tracking elsewhere (cost, time, area, legal, specs, amenities/maintenance). Drill-down cells remain in <Text weight="semibold" as="span">blr-deep-eval</Text>.
        </Text>
        <Table
          headers={['Project', 'Cost / charges', 'Timeline / UC', 'Area / commute', 'Legal / Khata', 'Specs / society', 'Amenity / maint']}
          rows={ISSUES.map(i => [
            i.name,
            i.cost,
            i.time,
            i.areaCommute,
            i.legal,
            i.specsSociety,
            i.amenityMaint,
          ])}
          rowTone={ISSUES.map(i => (i.name === 'Prestige Avon' ? 'danger' : undefined))}
          striped
        />
      </Stack>

      <Divider />

      <Stack gap={10}>
        <H2>Five-filter stack (after facts + issues)</H2>
        <Text size="small" tone="secondary">
          Order: (1) budget gate using facts table, (2) area, (3) builder, (4) adult amenities, (5) residual — aligned with <Text weight="semibold" as="span">blr-amenities</Text>, <Text weight="semibold" as="span">blr-areas</Text>, <Text weight="semibold" as="span">blr-builder-reputation</Text>.
          Full ten-family mapping to visit winners is maintained in <Text weight="semibold" as="span">blr-property-criteria</Text> (table + verdict card).
        </Text>
        <Grid columns={5} gap={12}>
          <Stat value="1" label="Budget" tone="danger" />
          <Stat value="2" label="Area" tone="success" />
          <Stat value="3" label="Builder" tone="success" />
          <Stat value="4" label="Adult amenities" tone="success" />
          <Stat value="5" label="Other" tone="neutral" />
        </Grid>
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
        <Text size="small" tone="secondary">
          {underBudget} of 5 pass the budget gate at listed all-in; Prestige Avon leads on area/builder/amenities/end-use only if you deliberately fix (1).
        </Text>
      </Stack>

      <Divider />

      <Stack gap={12}>
        <H2>Quick composite</H2>
        <Table
          headers={['Project', 'Budget', 'Area', 'Builder', 'Amenities', 'Other']}
          rows={ROWS.map(r => [
            r.name,
            r.budgetTier === 'strong' ? 'Strong' : r.budgetTier === 'ok' ? 'OK' : 'Weak',
            r.areaTier === 'strong' ? 'Strong' : r.areaTier === 'ok' ? 'OK' : 'Weak',
            r.builderTier === 'strong' ? 'Strong' : 'OK',
            r.amenityTier === 'strong' ? 'Strong' : 'OK',
            r.id === 'prestige' ? 'Criteria: leads investment/connectivity/safety; budget Critical fail until price fix' :
              r.id === 'purva' ? 'Criteria: co-leads budget + society/maint; area thinner vs Brigade/Prestige' :
              r.id === 'sattva' ? 'Criteria: co-leads budget + amenities; jurisdiction watch vs legal family' :
              r.id === 'brigade' ? 'Criteria: all-rounder + top deep-eval sum; lock OC month (legal family)' :
              'Criteria: co-leads type + builder grade; social family weak for Manyata daily',
          ])}
          rowTone={ROWS.map(r => {
            if (r.budgetTier === 'weak') return 'danger';
            if (r.areaTier === 'weak') return 'warning';
            return undefined;
          })}
          striped
        />
      </Stack>

    </Stack>
  );
}
