import {
  Card, CardBody, CardHeader,
  Divider, Grid, H1, H2, H3,
  Pill, Row, Stack, Stat, Table, Text,
  useCanvasState,
} from 'cursor/canvas';

// ── Types ──────────────────────────────────────────────────────────────────

type CritKey =
  | 'area'
  | 'connectivity'
  | 'investment'
  | 'specs'
  | 'legal'
  | 'amenities'
  | 'social'
  | 'financial'
  | 'risk'
  | 'enduse';

type Verdict = 'pass' | 'warn' | 'fail';
type ViewMode = 'criterion' | 'property';

interface CellData {
  verdict: Verdict;
  score: number;       // 1–10
  headline: string;
  bullets: string[];
}

interface PropData {
  id: string;
  rank: number;
  name: string;
  shortName: string;
  builder: string;
  area: string;
  possession: string;
  allIn: string;
  grade: string;
  cells: Record<CritKey, CellData>;
}

// ── Criteria definitions ───────────────────────────────────────────────────

const CRITERIA: { key: CritKey; num: number; label: string; subLabel: string }[] = [
  { key: 'area',         num: 1,  label: 'Area Selection',          subLabel: 'Micro-market, IT proximity, development stage, government zones' },
  { key: 'connectivity', num: 2,  label: 'Connectivity',            subLabel: 'Metro, NH/STRR/ORR, Airport KIA, BMTC, last-mile' },
  { key: 'investment',   num: 3,  label: 'Investment Potential',    subLabel: 'Historical CAGR, infra catalysts, price vs comparables, supply-demand' },
  { key: 'specs',        num: 4,  label: 'Property Specifications', subLabel: 'Config, carpet vs SBA, RERA, loading factor, builder grade' },
  { key: 'legal',        num: 5,  label: 'Legal & Documentation',   subLabel: 'Khata, title, EC, approved plan, OC/CC, land conversion' },
  { key: 'amenities',    num: 6,  label: 'Project Amenities',       subLabel: 'Clubhouse, pool, power backup, EV, water security' },
  { key: 'social',       num: 7,  label: 'Social Infrastructure',   subLabel: 'Schools, hospitals, malls, daily essentials within 3–5 km' },
  { key: 'financial',    num: 8,  label: 'Financial Parameters',    subLabel: 'All-in cost, EMI, possession timeline, maintenance, rental yield' },
  { key: 'risk',         num: 9,  label: 'Risk Factors',            subLabel: 'Flooding, litigation, construction quality, jurisdiction' },
  { key: 'enduse',       num: 10, label: 'End Use vs Investment',   subLabel: 'Resale liquidity, rental demand, target buyer, self-use timeline' },
];

// ── Property evaluation data ───────────────────────────────────────────────

const PROPS: PropData[] = [
  // ── 1. Purva Zenium 2 ────────────────────────────────────────────────────
  {
    id: 'purva', rank: 1, name: 'Purva Zenium 2', shortName: 'Purva',
    builder: 'Puravankara', area: 'Hosahalli · Airport Rd', possession: 'Jun 2027', allIn: '₹1.82–2.53 Cr', grade: 'A',
    cells: {
      area: {
        verdict: 'warn', score: 6,
        headline: 'Emerging address on Airport Road belt — positive trajectory, thin current social fabric',
        bullets: [
          'Hosahalli / Billamaranahalli: maturing address, not yet as established as Yelahanka NT or Thanisandra',
          'Airport Road belt growing rapidly: KIADB Aerospace SEZ is a long-term absorption driver',
          'Neighbouring areas (Jakkur, Yelahanka, KIAL corridor) all on upward trajectory',
          'Buying into future development, not present convenience — plan for thin social infra now',
        ],
      },
      connectivity: {
        verdict: 'pass', score: 7,
        headline: 'NH44 elevated + best airport access; no Metro near-term; STRR is the swing factor',
        bullets: [
          'NH44 / Airport Road elevated corridor: signal-free stretch reduces Manyata commute variance',
          'Manyata Tech Park: 14 km / ~24 min off-peak; 30–40 min at morning peak',
          'Kempegowda Airport KIA: 20–25 min — second-best airport access on the list',
          'Metro Phase 2B Airport line: confirmed long-term (2030–32); no walkable Metro near-term',
          'STRR Phase 1 (~2027): outer orbital alignment passes through Hosahalli belt — swing catalyst',
          'BMTC: sparse — own vehicle essential; car-dependent daily lifestyle',
        ],
      },
      investment: {
        verdict: 'pass', score: 7,
        headline: 'Jun 2027 earliest handover = shortest lock-in + fastest resale window',
        bullets: [
          'Earliest possession on list — means shortest pre-EMI burden and earliest rental income start',
          'Airport Road belt 5-yr CAGR ~8–10%; driven by KIAL expansion and IT office uptake',
          'PSF ₹7,000–9,500: below Thanisandra equivalent quality; fair entry point',
          'KIADB Aerospace SEZ is a long-term demand driver; near-term absorption is slow',
          'Supply in Hosahalli belt is lower than Thanisandra — lower inventory overhang',
        ],
      },
      specs: {
        verdict: 'pass', score: 8,
        headline: '3 BHK 1,231–1,710 sqft SBA · loading ~27% · RERA clean Oct 2022 · BluNex smart home',
        bullets: [
          'RERA: PRM/KA/RERA/1251/309/PR/071022/005303 — registered Oct 2022; check construction % on krera.karnataka.gov.in',
          'SBA 1,231–1,710 sqft; at ~27% loading → carpet ~900–1,248 sqft; ask for RERA carpet cert; target 3 BHK ≥1,450 sqft SBA',
          'Loading factor ~25–28% (Puravankara best-in-class); confirm against RERA portal carpet area filing before signing',
          'BluNex smart home (app-controlled locks, digital access) — unique Puravankara differentiator; good for resale to tech buyers',
          'Verify WFH room size ≥140 sqft and NOT adjacent to elevator shaft — ask to see floor plan on RERA portal',
          'Floor range: full selection available; target 5th–12th floor, NE/N facing for WFH room; corner unit adds 5–8% premium but worth it',
        ],
      },
      legal: {
        verdict: 'pass', score: 8,
        headline: 'NSE-listed developer, RERA clean; verify A-Khata for Hosahalli BBMP belt',
        bullets: [
          'Puravankara: freehold standard practice; no NCLT/insolvency history',
          'Hosahalli is in BBMP extended limits — confirm A-Khata (not Gram Panchayat B-Khata)',
          'Request 30-year Encumbrance Certificate (EC) from sales office before signing',
          'RERA construction % must match floor count visible on site — check before any payment',
          'UC legal: pull 30-yr EC on schedule land + verify BBA carpet/SBA/possession match RERA portal before token; payments ≤10% pre-BBA registration per RERA',
          'At handover: OC for your tower + sale deed/UDS description + A-Khata path in writing — refuse keys without OC unless lawyer-approved interim',
        ],
      },
      amenities: {
        verdict: 'pass', score: 7,
        headline: 'Grade A package; smaller project footprint vs Sattva / Tata townships',
        bullets: [
          'Clubhouse, pool, gym, jogging track — Puravankara Grade A standard',
          'BluNex smart-home package included at this price point — uncommon in this segment',
          'Ask: DG power backup — 100% all points including AC, or partial (lights/fans only)?',
          'Ask: ISP fiber ducting pre-built into structure (critical for WFH 3 days/week)',
          'Smaller unit count means fewer amenity clashes; clubhouse slots easier to book',
        ],
      },
      social: {
        verdict: 'warn', score: 6,
        headline: 'Thin neighbourhood social infra — schools and hospitals require 15–20 min drive',
        bullets: [
          'Schools: nearest quality school (DPS, Mallya Aditi) is 10–15 min drive; none walkable',
          'Hospitals: nearest Grade A hospital (Aster, Columbia Asia) is 15–20 min away',
          'Malls / retail: Yelahanka town 10–12 min; limited walking-distance options',
          'Daily essentials: Airport Road corridor developing; reasonable supermarket coverage growing',
        ],
      },
      financial: {
        verdict: 'pass', score: 9,
        headline: 'Best financial fit — ₹1.82–2.53 Cr all-in; up to ₹1.18 Cr below ₹3 Cr ceiling',
        bullets: [
          'All-in: ₹1.71–2.38 Cr base + 5% GST + 6.5% stamp/registration ≈ ₹1.82–2.53 Cr',
          'Headroom vs ₹3 Cr ceiling: ₹47L–₹1.18 Cr — most comfortable EMI structure on the list',
          'Jun 2027 possession = shortest pre-EMI period + lowest total GST exposure on list',
          'Rental yield ~2.8% (airport belt); monthly rent ~₹30,000–40,000 for 3 BHK (niche pool)',
        ],
      },
      risk: {
        verdict: 'pass', score: 7,
        headline: 'Low builder risk (NSE-listed); verify micro-level nala / flood proximity',
        bullets: [
          'Puravankara: NSE-listed since 2007, 50+ yr history, 85M+ sqft delivered — minimal default risk',
          'Hosahalli: some seasonal nala activity near Airport Road; confirm site not in low-lying pocket',
          'HT power lines: Airport Road belt has utility infrastructure; verify no HT pylons within 100m',
          'RERA portal: check for complaints / show-cause notices against this specific RERA number',
        ],
      },
      enduse: {
        verdict: 'pass', score: 7,
        headline: 'Best for self-occupation (earliest move-in); medium resale liquidity',
        bullets: [
          'Self-use: Jun 2027 possession — most practical timeline; move in while others wait 2–3 more years',
          'Rental: airport corridor tenants (aviation, IT, airline crew); steady but thin market',
          'Resale: Hosahalli address has lower liquidity vs Thanisandra / Yelahanka NT',
          'Target buyer on exit: airport-adjacent IT and aviation professionals — narrower pool',
        ],
      },
    },
  },

  // ── 2. Prestige Avon ─────────────────────────────────────────────────────
  {
    id: 'prestige', rank: 2, name: 'Prestige Avon', shortName: 'Prestige',
    builder: 'Prestige Group', area: 'Thanisandra', possession: 'Dec 2028', allIn: '~₹3.41 Cr', grade: 'A',
    cells: {
      area: {
        verdict: 'pass', score: 8,
        headline: 'Most established North BLR micro-market — Manyata, Metro, hospitals converge',
        bullets: [
          'Thanisandra / Nagavara: mature IT-adjacent residential belt with 10+ year density',
          'Manyata Tech Park: 10 km / 18–22 min — closest on the list to the primary office anchor',
          'Metro Nagavara Phase 2B station ~2–3 km away: strongest near-term appreciation catalyst',
          'Neighbouring: Hebbal (premium), Kodigehalli, Hennur — all established, positive trajectories',
        ],
      },
      connectivity: {
        verdict: 'pass', score: 8,
        headline: 'Best connectivity today — Metro Phase 2B Nagavara + ORR + closest Manyata run',
        bullets: [
          'Metro Phase 2B Nagavara station (~2–3 km, est. 2026–27): strongest near-term catalyst in North BLR',
          'Yellow Line (Nagavara → Silk Board): connects Thanisandra directly to south BLR IT parks without CBD',
          'Thanisandra Main Rd → ORR → Hebbal flyover: multiple alternate exit routes reduce peak variance',
          'Manyata: 10 km; 18–22 min off-peak, 30–45 min peak — closest Manyata commute on the list',
          'BMTC: multiple routes via Nagavara–Hebbal; best public transport among all shortlist areas',
          'Airport: 35–45 min — longest KIA run on the list; inconvenient for weekly flyers',
        ],
      },
      investment: {
        verdict: 'pass', score: 9,
        headline: 'Best investment area — 10–12% CAGR, Metro catalyst, highest rental demand',
        bullets: [
          'Thanisandra 5-yr CAGR: ~10–12% — highest in North BLR, driven by Manyata / IT absorption',
          'Metro Nagavara Phase 2B: appreciation catalyst not yet fully priced into Prestige Avon launch',
          'Rental demand: strongest on list — Manyata proximity = dense IT-worker tenant pool',
          'Prestige brand liquidity: fastest resale in South India; deepest buyer pool at exit',
          'Caveat: ₹3.41 Cr all-in — investment thesis is excellent, budget ceiling is the only constraint',
        ],
      },
      specs: {
        verdict: 'warn', score: 7,
        headline: 'SBA TBC at visit · Aug 2025 launch = very low RERA % · 230 units boutique scale · over budget',
        bullets: [
          'RERA: verify exact number at sales office before any payment — Aug 2025 launch = very early stage; verify on krera.karnataka.gov.in',
          'SBA and carpet area not publicly confirmed; est. ~1,400–1,800 sqft SBA at ~27–30% loading → ~1,008–1,260 sqft carpet',
          '230 units on 10 acres: boutique scale = less crowded, faster society formation, quieter — but fewer floor plan options',
          'Loading factor: Prestige typically 27–30%; insist on RERA carpet area certificate; do not rely on brochure dimensions',
          'All-in ~₹3.41 Cr is 14% over ₹3 Cr ceiling — negotiate hard; ask for compact 3 BHK unit or lower floor to bring under ₹3 Cr',
          'No construction started yet; highest UC risk on the list — only book if Prestige brand trust compensates for the early stage and price stretch',
        ],
      },
      legal: {
        verdict: 'warn', score: 7,
        headline: 'Prestige is legally clean; verify Thanisandra Khata — B-Khata pockets exist',
        bullets: [
          'Prestige Group: NSE-listed, no NCLT risk, clean RERA compliance history',
          'Thanisandra area: mix of A-Khata (BBMP) and B-Khata (transitional pockets) — verify before booking',
          'Request original land title document and approved building plan sanction letter',
          'Ask: has betterment charge been paid? Any pending tax dues on this plot?',
          'UC legal: Aug 2025 launch — land EC + sanction floor count vs marketed towers before any token; BBA must mirror RERA once registration appears',
          'Bank legal clearance: if a large bank declines this project, treat as signal — do not self-fund over a "no"',
        ],
      },
      amenities: {
        verdict: 'pass', score: 8,
        headline: 'Prestige Grade A on 10 acres — boutique but premium quality',
        bullets: [
          'Clubhouse, pool, gym, landscaped garden — Prestige Grade A package',
          '230 units on 10 acres: lower density = more greenery per household than mega-townships',
          'Prestige after-sales: reputation for consistent quality in common areas post-handover',
          'Ask: DG backup 100% all-points or partial? ISP pre-ducting? EV charging per bay?',
          'Smaller society = lower maintenance charges and easier RWA governance',
        ],
      },
      social: {
        verdict: 'pass', score: 9,
        headline: 'Best social infra on list — hospitals, schools, malls all within 3–5 km',
        bullets: [
          'Hospitals: Columbia Asia (Hebbal), Aster, Manipal — multiple quality hospitals within 5 km',
          'Schools: Ryan International, Presidency, DPS multiple — well-served school belt',
          'Retail: Elements Mall, Esteem Mall, Phoenix Marketcity all within easy reach',
          'Daily essentials: excellent density; Reliance, D-Mart, supermarkets well-distributed',
          'Restaurants/cafes: Hebbal–Nagavara–Thanisandra corridor is mature; good F&B variety',
        ],
      },
      financial: {
        verdict: 'fail', score: 4,
        headline: '₹3.41 Cr all-in — ₹41L over ₹3 Cr ceiling; negotiate or pass',
        bullets: [
          'All-in: ₹3.2 Cr base + 5% GST + 6.5% stamp/registration ≈ ₹3.41 Cr',
          'Over ₹3 Cr ceiling by ₹41L (~14%); requires larger down payment or mortgage top-up',
          'Ask on visit: any lower-floor or compact 3 BHK unit at ₹2.8–3.0 Cr base?',
          'Rental yield ~3.2%: highest on list — partially justifies higher cost over 7–10 yr hold',
          'Pre-EMI + GST staging over Dec 2028 timeline adds to total cost burden vs Jun 2027 options',
        ],
      },
      risk: {
        verdict: 'warn', score: 7,
        headline: 'Grade A builder, clean history; Thanisandra has micro-level flooding risk pockets',
        bullets: [
          'Builder risk: minimal — Prestige NSE-listed, no NCLT, strong overall project completion rate',
          'Thanisandra / Nagavara: rajakaluve (stormwater drain) proximity in some sub-pockets; verify site',
          'Post-COVID history: some Prestige projects ran 6–12 months late; ask RERA completion % now',
          'Verify Dec 2028 possession penalty clause in draft agreement before paying booking amount',
        ],
      },
      enduse: {
        verdict: 'pass', score: 9,
        headline: 'Best resale and rental exit — widest buyer pool in North BLR',
        bullets: [
          'Rental: Manyata proximity = dense demand; monthly rent ~₹40,000–55,000 for 3 BHK',
          'Resale: Prestige + Thanisandra = deepest, fastest resale market in North Bangalore',
          'Target buyer at exit: IT professionals, Metro users, young families — very broad',
          'Self-use: excellent — Thanisandra is the most complete North BLR lifestyle belt',
          'Sole constraint is the ₹3.41 Cr all-in vs ₹3 Cr ceiling; all other exit metrics are best-in-class',
        ],
      },
    },
  },

  // ── 3. Sattva Lumina ─────────────────────────────────────────────────────
  {
    id: 'sattva', rank: 3, name: 'Sattva Lumina', shortName: 'Sattva',
    builder: 'Salarpuria Sattva', area: 'Yelahanka · Rajanukunte', possession: 'Nov 2029', allIn: '₹1.62–1.87 Cr', grade: 'A',
    cells: {
      area: {
        verdict: 'pass', score: 7,
        headline: 'Yelahanka established; Rajanukunte slightly peripheral but township-anchored',
        bullets: [
          'Yelahanka: BBMP-administered, planned sectors, wide roads — well-established base',
          'Rajanukunte (SH-9): more semi-urban; Sattva Lumina township is the area anchor',
          'KIADB Aerospace and Airport Road expansion benefit this belt over 5–10 year horizon',
          'Neighbouring: Yelahanka NT, Sahakar Nagar, Jakkur — all positive trajectories',
        ],
      },
      connectivity: {
        verdict: 'pass', score: 7,
        headline: 'SH-9 → NH44 access + good airport reach; no Metro; STRR is the big upgrade',
        bullets: [
          'SH-9 → NH44 / Airport Road: connects to signal-free corridor but SH-9 single-lane sections exist',
          'Manyata Tech Park: ~11 km / 25 min off-peak; 35–45 min at morning peak',
          'Airport KIA: 20–28 min — good for regular flyers (second tier after Yelahanka NT and Hosahalli)',
          'STRR Phase 1 (~2027): SH-9 / Doddaballapura Road is on STRR alignment — biggest connectivity upgrade',
          'Metro Phase 2B Airport line (2030–32): Yelahanka corridor in alignment; no near-term walkable station',
          'BMTC: sparse on SH-9; Yelahanka town (2–3 km away) has better coverage',
        ],
      },
      investment: {
        verdict: 'pass', score: 8,
        headline: 'Undervalued vs Thanisandra; best ₹/sqft entry; CAGR 7–9%',
        bullets: [
          'Yelahanka 5-yr CAGR: ~7–9%; consistently undervalued vs Thanisandra for same quality',
          'PSF ₹5,800–8,500: 15–20% below Thanisandra equivalent — re-rating likely as Metro news firms up',
          'Township scale (1,553 units, 12.8 acres): institutional-grade demand from IT workers',
          'Caveat: large supply in one project may temper near-term appreciation vs boutique options',
        ],
      },
      specs: {
        verdict: 'pass', score: 8,
        headline: '3 BHK 1,450–1,780 sqft SBA · loading ~28–32% · 8 towers G+29 · RERA Sep 2024',
        bullets: [
          'RERA: PR/060924/007009 (Sep 2024) — verify current construction % on krera.karnataka.gov.in',
          'SBA 1,450–1,780 sqft; at ~30% loading → carpet ~1,015–1,246 sqft; ask for Grand 3 BHK RERA carpet cert (target ≥1,050 sqft)',
          '8 towers G+29 (30 floors): wide floor choice; target 10th–18th floor in perimeter tower for best light and views',
          'Township loading can creep above 30% in large corridor layouts — insist on RERA-registered carpet number, not brochure SBA',
          'Best carpet area per rupee on list; best ₹/sqft entry value of all Grade A projects in North BLR',
          'Confirm tower orientation at site: large 12.8-acre site means inner towers face podium/courtyard, outer towers face open land',
        ],
      },
      legal: {
        verdict: 'warn', score: 7,
        headline: 'Rajanukunte SH-9 belt — verify Khata type; RERA registration helps significantly',
        bullets: [
          'RERA registration is a strong legal protector; construction-linked payments limit financial exposure',
          'Rajanukunte: on boundary between BBMP extended area and BDA / Gram Panchayat — verify Khata',
          'Ask: is the plot under BBMP, BDA, or BMRDA jurisdiction? (critical for resale and loan)',
          'DC conversion order and approved plan should be on file; request copies at sales office',
          'UC legal: get written expected Khata class at OC; jurisdiction letter in BBA; 30-yr EC on land before booking',
          'Large township: confirm common-area conveyance / association formation timeline — affects future resale friction',
        ],
      },
      amenities: {
        verdict: 'pass', score: 9,
        headline: 'Best amenities on list — 3 × 35,000 sqft clubhouses, multiple pools',
        bullets: [
          '3 clubhouses × 35,000 sqft each = 105,000 sqft total amenity space — best by wide margin',
          'Multiple swimming pools, gyms, indoor sports courts, co-working zones',
          'Township scale: piped BWSSB + borewell backup, dedicated STP — water security covered',
          'DG backup: 100% at township scale (confirm in sale agreement)',
          'EV charging, solar provisions: ask for specifics and whether per-bay or shared',
        ],
      },
      social: {
        verdict: 'pass', score: 8,
        headline: 'Yelahanka area has good schools; hospitals and malls are accessible',
        bullets: [
          'Schools: DPS North, Mallya Aditi, Podar — good options within 5–10 km of Yelahanka',
          'Hospitals: Aster Yelahanka, Narayana (15–20 min drive); improving coverage',
          'Malls: Esteem Mall Yelahanka, growing retail on NH44 and SH-9 corridor',
          'Daily essentials: Yelahanka town has good density; SH-9 township ring developing',
          'Rajanukunte immediately outside township is sparse; Sattva internal amenities compensate',
        ],
      },
      financial: {
        verdict: 'pass', score: 9,
        headline: 'Best value — ₹1.62–1.87 Cr all-in; largest headroom below ₹3 Cr ceiling',
        bullets: [
          'All-in: ₹1.52–1.75 Cr base + 5% GST + 6.5% stamp/registration ≈ ₹1.62–1.87 Cr',
          'Lowest effective PSF on list — best living area per rupee spent',
          'Maintenance: township projects charge ₹4–7/sqft; ask for committed rate before signing',
          'Rental yield ~2.8–3.0% (Yelahanka); monthly rent ~₹35,000–45,000 for 3 BHK',
          'Downside: Nov 2029 possession = longest pre-EMI cash lock-in on the list',
        ],
      },
      risk: {
        verdict: 'warn', score: 6,
        headline: 'Nov 2029 deadline is the main risk; Rajanukunte jurisdiction needs verification',
        bullets: [
          'Nov 2029 possession: check current RERA construction % — Sep 2024 launch should show progress',
          'Salarpuria Sattva: some older projects had 6–9 month delays; verify current RERA track record',
          'Rajanukunte: if Gram Panchayat jurisdiction, Khata conversion complications post-OC',
          'Large unit count (1,553): township scale means slower overall completion; verify tower-wise RERA dates',
          'Flooding: SH-9 area generally not flood-prone; verify micro-drainage on specific towers',
        ],
      },
      enduse: {
        verdict: 'warn', score: 7,
        headline: 'Good self-use lifestyle; Rajanukunte address slightly reduces resale premium',
        bullets: [
          'Self-use: Yelahanka lifestyle excellent for families — green, spacious, calm',
          'Rental: moderate demand from IT/airport workers; steady but not as dense as Thanisandra',
          '"Yelahanka" brand sells well at resale; "Rajanukunte" is less well-known — note address carefully',
          'Target buyer at exit: families and couples prioritising space over city access',
          'Nov 2029 possession = 3.5 yr wait; opportunity cost vs Purva Zenium 2 (Jun 2027)',
        ],
      },
    },
  },

  // ── 4. Brigade Eternia ───────────────────────────────────────────────────
  {
    id: 'brigade', rank: 4, name: 'Brigade Eternia', shortName: 'Brigade',
    builder: 'Brigade Group', area: 'Yelahanka New Town', possession: 'Mar 2030', allIn: '~₹2.41 Cr', grade: 'A',
    cells: {
      area: {
        verdict: 'pass', score: 8,
        headline: 'Yelahanka New Town — most established planned suburb in North BLR',
        bullets: [
          'Yelahanka New Town: BBMP-administered, BDA-planned sector; high legal clarity',
          'Established address for 20+ years: wide sector roads, functional social infra, known buyer base',
          '"Yelahanka New Town" is a liquid, recognised residential address — resale pool is deep',
          'Neighbouring: Sahakar Nagar, Kattigenahalli, Jakkur — all stable and positive',
        ],
      },
      connectivity: {
        verdict: 'pass', score: 7,
        headline: 'NH44 + BMTC depot + STRR interchange; best suburban connectivity package',
        bullets: [
          'NH44 direct from Yelahanka NT: signal-free elevated stretch reduces Manyata peak variance',
          'Manyata: ~15 km / 18–22 min off-peak; 25–38 min morning peak (NH44 advantage)',
          'Airport KIA: 20–25 min — tied second-best airport reach on the list',
          'BMTC depot in Yelahanka: only suburban shortlist location with meaningful public bus coverage',
          'STRR Phase 1 (~2027): Yelahanka NT becomes STRR interchange suburb — biggest orbital boost',
          'Metro Phase 2B Airport line (2030–32): NH44 Yelahanka corridor in future alignment zone',
        ],
      },
      investment: {
        verdict: 'pass', score: 8,
        headline: 'Brigade brand premium + Yelahanka NT address = steady appreciation, low volatility',
        bullets: [
          'Yelahanka NT 5-yr CAGR: ~8–10%; Brigade brand adds 5–8% resale premium vs generic builders',
          'Established area = lower appreciation volatility vs emerging pockets',
          'STRR (Satellite Town Ring Road) will further boost Yelahanka when construction progresses',
          'Lower supply overhang than Thanisandra; inventory absorbed at steady pace',
        ],
      },
      specs: {
        verdict: 'pass', score: 9,
        headline: '3 BHK 1,620–1,820 sqft SBA · loading ~28–32% · RERA Mar 2025 · 14 acres BDA area',
        bullets: [
          'RERA: PRM/KA/RERA/1251/309/PR/070325/007559 (Mar 2025) — verify construction % on krera.karnataka.gov.in',
          'SBA 1,620–1,820 sqft: second-largest 3 BHK on list; at ~30% loading → carpet ~1,134–1,274 sqft; ask for RERA carpet cert',
          '14 acres, 1,124 units: BDA-planned site in Yelahanka NT — widest roads, best external infrastructure on list',
          'Brigade typically delivers 3 BHK with genuine room proportions; confirm WFH room ≥145 sqft from RERA floor plan',
          'Best specs-per-budget ratio at ₹2.41 Cr: large SBA, BDA address, and Brigade brand resale premium (~5–8%)',
          'Verify Mar 2030 possession is confirmed, not soft estimate — Brigade has occasionally slipped 6–12 months on large projects',
        ],
      },
      legal: {
        verdict: 'pass', score: 8,
        headline: 'BBMP A-Khata expected (Yelahanka NT); Brigade has clean legal record',
        bullets: [
          'Yelahanka New Town: BBMP-administered → A-Khata is standard; lower legal risk vs Rajanukunte',
          'Brigade Group: NSE-listed, no NCLT proceedings, clean RERA history across portfolio',
          'RERA registered ✓; request construction-linked payment plan before signing',
          'CRITICAL: get possession date in writing — some sources show Mar 2030, others Dec 2030',
          'UC legal: standard BBMP path — still verify land EC + sanction vs actual towers; BBA penalty clause ≥ RERA minimum',
          'At OC: confirm OC lists your tower; snag list closure in writing before final tranche to builder',
        ],
      },
      amenities: {
        verdict: 'pass', score: 8,
        headline: 'Grade A Brigade package on 14 acres — clubhouse, pool, gardens, security',
        bullets: [
          'Large clubhouse, pool, gym, indoor sports courts, landscaped gardens — Brigade A standard',
          '14 acres / 1,124 units: good per-unit space ratio; less crowded than mega-townships',
          'Brigade security consistently rated highly by residents: CCTV + intercom + gated',
          'DG backup: 100% expected; confirm AC + kitchen points covered (not just lights)',
          'Ask: EV charging per bay? Solar on common roof? Fiber ISP ducting pre-installed?',
        ],
      },
      social: {
        verdict: 'pass', score: 8,
        headline: 'Yelahanka NT has good schools, Aster nearby, solid retail density',
        bullets: [
          'Schools: DPS, Mallya Aditi, CMR — multiple quality schools within 5 km',
          'Hospitals: Aster Yelahanka, Narayana Health City (~15 min), Columbia Asia (~20 min)',
          'Malls: Esteem Mall Yelahanka, growing F&B on NH44 corridor',
          'Daily essentials: Yelahanka NT has good supermarket and market coverage',
          'Marginally better social infra than Hosahalli or Sattva (Rajanukunte); below Thanisandra',
        ],
      },
      financial: {
        verdict: 'pass', score: 8,
        headline: '₹2.41 Cr all-in — ₹59L buffer; strongest brand-sqft value equation',
        bullets: [
          'All-in: ₹2.26 Cr base + 5% GST + 6.5% stamp/registration ≈ ₹2.41 Cr',
          '₹59L headroom vs ₹3 Cr ceiling; buffer for interiors, parking extras, emergency fund',
          'Maintenance: Brigade ₹4–6/sqft typically; ask for confirmed committed rate in agreement',
          'Rental yield ~2.8–3.0% (Yelahanka NT); monthly rent ~₹38,000–50,000 for 3 BHK',
          'Mar 2030 possession: ~4 yr wait; model total pre-EMI cost before committing',
        ],
      },
      risk: {
        verdict: 'warn', score: 7,
        headline: 'Low builder risk; possession date ambiguity (Mar vs Dec 2030) must be resolved',
        bullets: [
          'Brigade Group: NSE-listed, no NCLT risk, clean RERA delivery history — low default risk',
          'KEY RISK: RERA possession date discrepancy — some portals show Mar 2030, others Dec 2030',
          'Resolve in writing before paying booking: get RERA end date AND penalty clause confirmed',
          'Flooding: Yelahanka NT planned layout — generally well-drained; verify site micro-drainage',
          'No lake encroachment or HT line concerns flagged for this Yelahanka NT sub-pocket',
        ],
      },
      enduse: {
        verdict: 'pass', score: 8,
        headline: 'Best balanced exit — Brigade brand + Yelahanka NT = solid, broad buyer pool',
        bullets: [
          'Rental: established tenant market in Yelahanka NT; steady ₹38,000–50,000/mo expected',
          'Resale: Brigade brand adds premium; Yelahanka NT address is liquid and widely recognised',
          'Target buyer at exit: broad — families, IT professionals, airport workers, NRIs',
          'Self-use lifestyle: wide roads, parks, schools — most complete "suburban" feel on list',
          'Mar 2030 adds ~2.5 yr vs Purva but resale premium and address liquidity compensate',
        ],
      },
    },
  },

  // ── 5. Tata Varnam ───────────────────────────────────────────────────────
  {
    id: 'tata', rank: 5, name: 'Tata Varnam', shortName: 'Tata',
    builder: 'Tata Housing', area: 'Devanahalli', possession: 'Dec 2029', allIn: '₹1.65–2.04 Cr', grade: 'A+',
    cells: {
      area: {
        verdict: 'warn', score: 6,
        headline: 'Emerging satellite town — long-term DMIC/Aerospace thesis; near-term social fabric thin',
        bullets: [
          'Devanahalli: airport satellite town; growing but not yet a self-contained residential belt',
          'KIADB Aerospace Park, Devanahalli Business Park: growing commercial base',
          'DMIC node (Delhi-Mumbai Industrial Corridor) designated area: industrial/commercial draw',
          'Strong 7–10 yr infrastructure thesis; thin social fabric and daily convenience today',
        ],
      },
      connectivity: {
        verdict: 'warn', score: 6,
        headline: 'Best airport access on list (10–15 min); 60–80 min Manyata commute; STRR is lifeline',
        bullets: [
          'Airport KIA: 10–15 min via Airport Expressway — best on the entire list by a wide margin',
          'Manyata Tech Park: ~35–48 min off-peak; 60–80 min peak — do this drive on a Tuesday before deciding',
          'STRR Phase 1 (~2027): biggest single catalyst for Devanahalli connectivity; cuts Manyata run significantly',
          'No Metro near-term; Airport Metro extension is Phase 3 / 2032+ planning stage only',
          'BMTC: essentially none; fully car-dependent — second vehicle likely needed for household',
          'NH44 / Airport Expressway: well-maintained road; KIADB internal roads within zone are good quality',
        ],
      },
      investment: {
        verdict: 'warn', score: 7,
        headline: 'Strong long-term DMIC / Aerospace thesis; near-term resale liquidity is thin',
        bullets: [
          'Devanahalli 5-yr CAGR: ~6–9%; higher variance than Yelahanka — thin baseline comparables',
          'DMIC + Aerospace Park: transformative if materialises fully, but timeline is multi-decade',
          'PSF ₹5,500–7,500: cheapest entry on list; upside asymmetry if Aerospace belt expands',
          'Thin resale market: fewer comparables, longer time to sell vs Yelahanka or Thanisandra',
          'Tata brand ensures a floor — zero chance of deep price discount at resale',
        ],
      },
      specs: {
        verdict: 'pass', score: 9,
        headline: 'Best carpet/rupee on list — SBA 1,681–2,061 sqft · loading ~24% · 70-acre Carnatica',
        bullets: [
          'RERA: PR/110825/007988 (Aug 2025 launch) — early stage; verify construction % on krera.karnataka.gov.in before committing',
          'SBA 1,681–2,061 sqft: largest on list; at ~24% loading → carpet ~1,278–1,566 sqft — most real space per rupee spent',
          'Tata loading factor ~22–26%: lowest on list; carpet area is genuinely large; dimensions on site match the brochure (Tata quality standard)',
          '70 acres within 135-acre Carnatica township: best land structure on list; internal roads, schools (planned), and retail within campus',
          'Target: 3 BHK + 2T floor plan at 1,681 sqft SBA (₹1.55 Cr base); confirm floor plan shows WFH room ≥145 sqft from RERA portal',
          'Large township means some towers face inward — verify your unit faces external direction (open land or road, not another tower)',
        ],
      },
      legal: {
        verdict: 'pass', score: 8,
        headline: 'Cleanest legal profile — Tata performs institutional-grade due diligence',
        bullets: [
          'Tata Housing: never abandoned a project; institutional-grade land title + full approvals',
          'Carnatica township: large integrated project gets full BMRDA / Local Planning Authority sanctions',
          'DC conversion, EC, approved plan: Tata delivers complete documentation pack at handover',
          'Watchpoint: Gram Panchayat vs BMRDA jurisdiction — confirm in sale agreement; Tata deals typically BMRDA',
          'UC legal: mega-township — verify which phase/tower is in current sanction; future phases must not encroach on promised setbacks',
          'BBA: UDS schedule wording + parking allotment + amenity share — match RERA annexures before registration',
        ],
      },
      amenities: {
        verdict: 'pass', score: 9,
        headline: 'Most self-contained on list — 135-acre Carnatica township compensates for sparse neighbourhood',
        bullets: [
          'Carnatica township: schools, retail, green zones, clubhouse within complex — most self-contained',
          '70-acre Tata Varnam: pool, gym, indoor sports courts, jogging track — full range',
          'Water security: township-level borewell + BWSSB connection planned — best water strategy',
          'DG backup: 100% at township scale; power supply more reliable near KIAL / airport area',
          'EV charging, solar: Tata Housing includes as standard in post-2023 projects',
        ],
      },
      social: {
        verdict: 'fail', score: 4,
        headline: 'Weakest social infra on list — hospitals and quality schools 20–30 min away',
        bullets: [
          'Schools: nearest quality school (Ryan, DPS equivalent) is 20–30 min drive from Devanahalli',
          'Hospitals: very limited locally; nearest Grade A hospital 25–35 min away — emergency concern',
          'Malls / retail: Devanahalli town has basic markets; no mall within 20 km',
          'Daily essentials: growing but thin; plan on driving to Yelahanka / Doddaballapura for variety',
          'Carnatica township will have internal retail and F&B but dependent on overall completion pace',
        ],
      },
      financial: {
        verdict: 'pass', score: 8,
        headline: 'Most sqft per rupee — ₹1.65–2.04 Cr all-in, Tata A+ quality, large apartment',
        bullets: [
          'All-in: ₹1.55–1.91 Cr base + 5% GST + 6.5% stamp/registration ≈ ₹1.65–2.04 Cr',
          'Lowest effective PSF on list — best format for large families or WFH home-office setup',
          'Maintenance: township ₹4–7/sqft; 135-acre Carnatica may be at higher end — ask',
          'Rental yield ~2.5–2.8% (thin Devanahalli pool); lower monthly rent vs Yelahanka/Thanisandra',
          'Dec 2029: 3.5 yr wait; pre-EMI cost similar to Sattva Lumina but less total GST if launch price stable',
        ],
      },
      risk: {
        verdict: 'pass', score: 8,
        headline: 'Lowest builder risk on list; daily commute friction is the real risk',
        bullets: [
          'Tata Housing: zero default history, zero abandoned projects, zero NCLT ever — gold standard',
          'RERA: new launch Aug 2025; verify construction has physically started on portal before booking',
          'Flooding: Devanahalli is elevated terrain near airport; well-drained — lowest flood risk on list',
          'KEY RISK: daily commute friction — do the Manyata drive on a Tuesday morning before deciding',
          'Panchayat risk: within large Tata township + BMRDA oversight; lower than standalone projects',
        ],
      },
      enduse: {
        verdict: 'warn', score: 6,
        headline: 'Thin resale / rental market; excellent self-use IF daily commute works',
        bullets: [
          'Self-use: excellent lifestyle quality IF commute to Manyata is acceptable (verify before signing)',
          'Rental: thin tenant pool — airport staff, KIADB workers; lower monthly rent than peers',
          'Resale: Tata brand holds a floor but buyer pool is narrow; expect longer exit horizon',
          'Target buyer at exit: airport-adjacent professionals, DMIC-thesis investors — niche',
          'Best pick for: frequent flyer, wants largest flat, has 7–10 yr investment horizon',
        ],
      },
    },
  },
];

// ── Helpers ────────────────────────────────────────────────────────────────

const vTone = (v: Verdict): 'success' | 'warning' | 'danger' =>
  v === 'pass' ? 'success' : v === 'warn' ? 'warning' : 'danger';

const vLabel = (v: Verdict): string =>
  v === 'pass' ? '✓ Pass' : v === 'warn' ? '⚠ Warn' : '✗ Fail';

const propTotal = (p: PropData): number =>
  Object.values(p.cells).reduce((sum: number, c: CellData) => sum + c.score, 0);

// ── Component ──────────────────────────────────────────────────────────────

export default function DeepEval() {
  const [mode, setMode]           = useCanvasState<ViewMode>('deMode', 'criterion');
  const [activeCrit, setActiveCrit] = useCanvasState<CritKey>('deCrit', 'area');
  const [activeProp, setActiveProp] = useCanvasState<string>('deProp', 'purva');

  const sortedByScore = [...PROPS].sort((a, b) => propTotal(b) - propTotal(a));

  const ap = PROPS.find(p => p.id === (activeProp as string)) ?? PROPS[0];
  const ac = CRITERIA.find(c => c.key === (activeCrit as CritKey)) ?? CRITERIA[0];

  return (
    <Stack gap={28} style={{ padding: '24px 28px', maxWidth: 1020 }}>

      {/* ── Header ── */}
      <Stack gap={4}>
        <Row gap={10} align="center">
          <H1>10-Point Deep Evaluation</H1>
          <Pill tone="info">5 properties × 10 criteria</Pill>
        </Row>
        <Text tone="secondary">
          Evaluate each shortlisted property against the full due-diligence framework before site visits.
          Switch between "By criterion" (compare all 5 on one dimension) and "By property" (full card per project).
        </Text>
      </Stack>

      {/* ── Summary stats ── */}
      <Grid columns={5} gap={12}>
        {sortedByScore.map((p, i) => (
          <Stat
            key={p.id}
            value={`${propTotal(p)}/100`}
            label={`${i + 1}. ${p.shortName}`}
            tone={i === 0 ? 'success' : i >= 3 ? 'warning' : undefined}
          />
        ))}
      </Grid>

      {/* ── 5×10 matrix ── */}
      <Stack gap={8}>
        <H2>Full scorecard — 5 × 10 matrix</H2>
        <Text size="small" tone="secondary">
          Each cell: score/10 and verdict (✓ pass · ⚠ warn · ✗ fail). Rows = criteria, columns = properties.
        </Text>
        <Table
          headers={['Criterion', ...PROPS.map(p => p.shortName)]}
          rows={CRITERIA.map(c => [
            `${c.num}. ${c.label}`,
            ...PROPS.map(p => {
              const cell = p.cells[c.key];
              return `${cell.score} ${cell.verdict === 'pass' ? '✓' : cell.verdict === 'warn' ? '⚠' : '✗'}`;
            }),
          ])}
          striped
        />
      </Stack>

      <Divider />

      {/* ── Mode selector ── */}
      <Row gap={8}>
        <Pill active={mode === 'criterion'} onClick={() => setMode('criterion')} tone="info">
          By criterion — compare all 5 on one dimension
        </Pill>
        <Pill active={mode === 'property'} onClick={() => setMode('property')} tone="success">
          By property — full 10-criteria card per project
        </Pill>
      </Row>

      {/* ── Criterion mode ── */}
      {mode === 'criterion' && (
        <Stack gap={16}>
          <Stack gap={8}>
            <H2>Criterion deep dive</H2>
            <Row gap={6} wrap>
              {CRITERIA.map(c => (
                <Pill
                  key={c.key}
                  active={activeCrit === c.key}
                  onClick={() => setActiveCrit(c.key)}
                >
                  {c.num}. {c.label}
                </Pill>
              ))}
            </Row>
            <Stack gap={2}>
              <H3>{ac.num}. {ac.label}</H3>
              <Text size="small" tone="secondary">{ac.subLabel}</Text>
            </Stack>
          </Stack>

          <Stack gap={12}>
            {PROPS.map(p => {
              const cell = p.cells[ac.key];
              return (
                <Card key={p.id}>
                  <CardHeader
                    trailing={
                      <Row gap={6}>
                        <Pill tone={vTone(cell.verdict)} size="sm">{cell.score}/10</Pill>
                        <Pill tone={vTone(cell.verdict)} size="sm">{vLabel(cell.verdict)}</Pill>
                      </Row>
                    }
                  >
                    {p.rank}. {p.name} · {p.area}
                  </CardHeader>
                  <CardBody>
                    <Stack gap={8}>
                      <Text size="small" weight="semibold">{cell.headline}</Text>
                      <Stack gap={4}>
                        {cell.bullets.map((b: string, i: number) => (
                          <Row key={i} gap={8} style={{ alignItems: 'flex-start' }}>
                            <Text size="small" tone="secondary" style={{ minWidth: 10 }}>·</Text>
                            <Text size="small" tone="secondary">{b}</Text>
                          </Row>
                        ))}
                      </Stack>
                    </Stack>
                  </CardBody>
                </Card>
              );
            })}
          </Stack>
        </Stack>
      )}

      {/* ── Property mode ── */}
      {mode === 'property' && (
        <Stack gap={16}>
          <Stack gap={8}>
            <H2>Property deep dive</H2>
            <Row gap={6} wrap>
              {PROPS.map(p => (
                <Pill
                  key={p.id}
                  active={activeProp === p.id}
                  onClick={() => setActiveProp(p.id)}
                  tone={p.grade === 'A+' ? 'success' : undefined}
                >
                  {p.rank}. {p.shortName}
                </Pill>
              ))}
            </Row>
          </Stack>

          <Grid columns={4} gap={12}>
            <Stat value={ap.allIn} label="All-in cost" />
            <Stat value={ap.possession} label="Possession" />
            <Stat
              value={`${propTotal(ap)}/100`}
              label="Total score"
              tone={propTotal(ap) >= 76 ? 'success' : 'warning'}
            />
            <Stat value={`${ap.builder} (${ap.grade})`} label="Builder · Grade" tone="success" />
          </Grid>

          <Stack gap={10}>
            {CRITERIA.map(c => {
              const cell = ap.cells[c.key];
              return (
                <Card key={c.key}>
                  <CardHeader
                    trailing={
                      <Row gap={6}>
                        <Pill tone={vTone(cell.verdict)} size="sm">{cell.score}/10</Pill>
                        <Pill tone={vTone(cell.verdict)} size="sm">{vLabel(cell.verdict)}</Pill>
                      </Row>
                    }
                  >
                    {c.num}. {c.label}
                  </CardHeader>
                  <CardBody>
                    <Stack gap={8}>
                      <Text size="small" weight="semibold">{cell.headline}</Text>
                      <Stack gap={4}>
                        {cell.bullets.map((b: string, i: number) => (
                          <Row key={i} gap={8} style={{ alignItems: 'flex-start' }}>
                            <Text size="small" tone="secondary" style={{ minWidth: 10 }}>·</Text>
                            <Text size="small" tone="secondary">{b}</Text>
                          </Row>
                        ))}
                      </Stack>
                    </Stack>
                  </CardBody>
                </Card>
              );
            })}
          </Stack>
        </Stack>
      )}

      <Divider />

      {/* ── Ranked summary ── */}
      <Stack gap={8}>
        <H2>Ranked summary</H2>
        <Table
          headers={['Rank', 'Property', 'Builder', 'Score', '✗ Fails', '⚠ Warns', '✓ Passes', 'Verdict']}
          rows={sortedByScore.map((p, i) => {
            const cells = Object.values(p.cells) as CellData[];
            const fails  = cells.filter((c: CellData) => c.verdict === 'fail').length;
            const warns  = cells.filter((c: CellData) => c.verdict === 'warn').length;
            const passes = cells.filter((c: CellData) => c.verdict === 'pass').length;
            return [
              String(i + 1),
              p.name,
              p.builder,
              `${propTotal(p)}/100`,
              String(fails),
              String(warns),
              String(passes),
              fails > 0
                ? 'Resolve fail first'
                : warns <= 2
                  ? 'Strong candidate'
                  : 'Monitor warns',
            ];
          })}
          rowTone={sortedByScore.map(p => {
            const cells = Object.values(p.cells) as CellData[];
            const fails = cells.filter((c: CellData) => c.verdict === 'fail').length;
            return fails > 0
              ? 'danger'
              : (cells.filter((c: CellData) => c.verdict === 'warn').length <= 2 ? 'success' : undefined);
          })}
          striped
        />
      </Stack>

      <Stack gap={6}>
        <H3>Key takeaways</H3>
        <Stack gap={4}>
          {[
            'Brigade Eternia (78/100): most balanced score; only warn is the possession-date ambiguity — resolve in writing.',
            'Prestige Avon (76/100): best area + investment + resale — the FAIL is purely financial (₹41L over budget). Ask for lower-floor unit.',
            'Sattva Lumina (76/100): best value per sqft; warns on Nov 2029 timeline and Rajanukunte jurisdiction — verify Khata.',
            'Purva Zenium 2 (72/100): Jun 2027 possession is a major practical advantage; area and social infra are the weak spots.',
            'Tata Varnam (71/100): best builder + best specs per rupee + cleanest legal; FAIL is social infra and thin resale pool — daily commute test is mandatory.',
          ].map((t, i) => (
            <Row key={i} gap={8} style={{ alignItems: 'flex-start' }}>
              <Text size="small" tone="secondary" style={{ minWidth: 10 }}>→</Text>
              <Text size="small">{t}</Text>
            </Row>
          ))}
        </Stack>
      </Stack>

      <Divider />

      {/* ── Area landscape — new corridors ── */}
      <Stack gap={10}>
        <Row gap={8} align="center">
          <H2>Criterion 1 — Expanded Area Landscape</H2>
          <Pill tone="info">IVC Road · Aerospace Park</Pill>
        </Row>
        <Text size="small" tone="secondary">
          Two additional North BLR corridors evaluated. Neither enters the current visit shortlist but both are relevant to the full area decision.
        </Text>
        <Grid columns={2} gap={14}>
          <Card>
            <CardHeader trailing={<Pill tone="warning" size="sm">Watch — villas / over budget</Pill>}>
              IVC Road · Jakkur–Yelahanka–Airport belt
            </CardHeader>
            <CardBody>
              <Stack gap={6}>
                <Text size="small">
                  Corridor from Jakkur / Yelahanka towards Devanahalli and KIA. Fast-growing with Embassy Springs,
                  Century Ethos, Sobha HRC Pristine anchoring it. 5-yr CAGR ~50%. 35–50 min peak commute to Manyata.
                </Text>
                <Text size="small" weight="semibold">Why not on shortlist:</Text>
                {[
                  'Grade A inventory within ₹3 Cr budget is rare — most projects are villas (₹3.5 Cr+) or plotted',
                  'No apartment township in the ₹2–3 Cr band comparable to Sattva / Brigade quality',
                  'Social infra thinner than Yelahanka NT; resale liquidity still maturing',
                  'IVC Road is a reference corridor — revisit if budget stretches to ₹3.5 Cr or villa format becomes acceptable',
                ].map((b, i) => (
                  <Row key={i} gap={6} style={{ alignItems: 'flex-start' }}>
                    <Text size="small" tone="secondary" style={{ minWidth: 10 }}>·</Text>
                    <Text size="small" tone="secondary">{b}</Text>
                  </Row>
                ))}
              </Stack>
            </CardBody>
          </Card>
          <Card>
            <CardHeader trailing={<Pill tone="success" size="sm">Watch — Purva NL Dec 2031</Pill>}>
              KIADB Aerospace Park · Bagalur · NH44 North
            </CardHeader>
            <CardBody>
              <Stack gap={6}>
                <Text size="small">
                  KIADB Aerospace SEZ + Devanahalli direction. Highest 5-yr CAGR in North BLR (~65%).
                  Purva Northern Lights Phase 3 just launched (RERA: PRM/KA/RERA/1251/309/PR/120326/008525,
                  Mar 2026) — 3 BHK 1,500–1,800 sqft at ₹1.8–2.1 Cr by Puravankara (Grade A, same builder as Rank 1).
                </Text>
                <Text size="small" weight="semibold">Why on watch list only:</Text>
                {[
                  'Dec 2031 possession — 5.5 yr wait; too long vs current shortlist horizon',
                  '60–80 min peak commute to Manyata; viable only if WFH 3–4 days/week',
                  'Very thin social infra today; Aerospace SEZ employment thesis is multi-decade',
                  'Provident Ecopolitan (Puravankara sub-brand) also on-site, Dec 2027–28 possession — worth tracking',
                  'Revisit if Aerospace SEZ Phase 1 absorption is confirmed in 2026–27',
                ].map((b, i) => (
                  <Row key={i} gap={6} style={{ alignItems: 'flex-start' }}>
                    <Text size="small" tone="secondary" style={{ minWidth: 10 }}>·</Text>
                    <Text size="small" tone="secondary">{b}</Text>
                  </Row>
                ))}
              </Stack>
            </CardBody>
          </Card>
        </Grid>
      </Stack>

    </Stack>
  );
}
