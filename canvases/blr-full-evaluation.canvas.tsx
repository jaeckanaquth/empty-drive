import {
  Card, CardBody, CardHeader,
  Divider, Grid, H1, H2,
  Pill, Row, Stack, Stat, Table, Text,
  useCanvasState,
} from 'cursor/canvas';

// ── types ──────────────────────────────────────────────────────────────────

type Verdict = 'pass' | 'warn' | 'fail';

const vTone = (v: Verdict) =>
  v === 'pass' ? 'success' : v === 'warn' ? 'warning' : ('danger' as const);
const vLabel = (v: Verdict) =>
  v === 'pass' ? 'Pass' : v === 'warn' ? 'Warn' : 'Fail';

interface CatEval {
  verdict: Verdict;
  keyPoint: string;
  notes: string[];
}
interface PropData {
  id: string;
  rank: number;
  name: string;
  shortName: string;
  builder: string;
  area: string;
  possession: string;
  allin: string;
  day: number;
  cats: CatEval[];
}

// ── category definitions ────────────────────────────────────────────────────

const CATS = [
  { n: 1,  label: 'Area Selection & Micro-Market',  sub: 'Locality rep, IT corridor proximity, neighbouring area trajectory, govt-planned zones' },
  { n: 2,  label: 'Connectivity & Infrastructure',  sub: 'Metro, NH / STRR / ORR / BIAL road, distance to KIA, BMTC & last-mile' },
  { n: 3,  label: 'Investment Appreciation',         sub: 'Historical CAGR, upcoming infra, current psf vs comparables, supply-demand dynamics' },
  { n: 4,  label: 'Property Specifications',         sub: 'Config & carpet/built-up, floor/facing, RERA status, builder quality' },
  { n: 5,  label: 'Legal & Documentation',           sub: 'Title clarity, Khata type (A vs B), EC/plan/OC, land conversion' },
  { n: 6,  label: 'Amenities — Project Level',       sub: 'Clubhouse/gym/pool, security/DG/water, children\'s area, EV/solar' },
  { n: 7,  label: 'Social Infrastructure',           sub: 'Schools within 3–5 km, hospitals, malls/supermarkets, restaurants/rec' },
  { n: 8,  label: 'Financial Parameters',            sub: 'All-in cost vs ₹3 Cr ceiling, EMI/rent, possession timeline, maintenance, rental yield' },
  { n: 9,  label: 'Risk Factors',                   sub: 'Flooding/low-lying, lake encroachment, HT lines/industry, builder litigation, construction flags' },
  { n: 10, label: 'End Use vs Investment Intent',   sub: 'Self-occupation timeline, rental income, resale liquidity, target exit buyer' },
];

// ── property evaluations — 5 × 10 ─────────────────────────────────────────

const PROPS: PropData[] = [
  {
    id: 'purva', rank: 1, shortName: 'Purva', name: 'Purva Zenium 2',
    builder: 'Puravankara', area: 'Hosahalli / Airport Rd',
    possession: 'Jun 2027', allin: '₹1.82–2.53 Cr', day: 1,
    cats: [
      {
        verdict: 'warn',
        keyPoint: 'Developing belt — Airport Rd corridor is solid but inner lanes are still maturing',
        notes: [
          'Hosahalli is semi-suburban off NH44; Airport Road spine is established but sub-pocket density is lower than Thanisandra or Yelahanka New Town',
          'No large IT campus within walking distance; Manyata at 14 km is the primary work anchor',
          'Neighbouring Yelahanka and Hebbal on strong upward trajectory — area-level confidence is reasonable',
        ],
      },
      {
        verdict: 'warn',
        keyPoint: 'No near-term Metro; NH44 access is solid; relies on car for all daily movement',
        notes: [
          'Phase 2B Nagavara–airport corridor benefits belt indirectly; nearest station ~4 km away',
          'NH44 (Bellary Road) is the spine — off-peak access to Manyata and CBD is acceptable',
          'Airport 20–25 min is a genuine advantage; BMTC routes are sparse — fully car-dependent',
        ],
      },
      {
        verdict: 'pass',
        keyPoint: 'Earliest Grade A possession (Jun 2027) = shortest capital lock-in and best market timing',
        notes: [
          'Airport Rd belt CAGR ~8–10% over last 5 years — solid if not top-of-class',
          'Jun 2027 handover means resale or rental income starts 2+ years ahead of 2029 competitors',
          'Puravankara has delivered in this corridor (Purva Atmosphere) — local track record confirmed',
        ],
      },
      {
        verdict: 'pass',
        keyPoint: 'RERA since Jul 2022; 1,231–1,710 sqft SBA; BluNex smart-home standard',
        notes: [
          'RERA: PRM/KA/RERA/1251/309/PR/071022/005303 — searchable on K-RERA portal; check % completion',
          '3BHK options from compact 1,231 sqft to large 1,710 sqft. Loading factor ~25–28% expected',
          'BluNex smart-home tech differentiator vs peers at this price; construction % verifiable on portal',
        ],
      },
      {
        verdict: 'pass',
        keyPoint: 'NSE-listed Puravankara, RERA registered since 2022 — strong legal foundation',
        notes: [
          'Puravankara NSE-listed since 2007 — audited financials, no NCLT insolvency proceedings',
          'Verify A-Khata for Billamaranahalli locality on BBMP portal before visit (critical)',
          'Ask for DC conversion order and sanctioned building plan copies at sales office',
        ],
      },
      {
        verdict: 'pass',
        keyPoint: 'Grade A amenity stack; BluNex smart-home differentiates from same-tier peers',
        notes: [
          'Clubhouse, gym, pool confirmed; DG backup and STP standard for Puravankara',
          'BluNex smart-home tech (locks, lighting, security) is a tangible resale and rental premium',
          'Confirm EV charging scope and water source (BWSSB connection vs borewell) at visit',
        ],
      },
      {
        verdict: 'warn',
        keyPoint: 'Hosahalli belt is thin on hospitals — major facilities 15–20 min away',
        notes: [
          'No major hospital within 5 km; closest are in Hebbal / Yelahanka area (~15 min drive)',
          'Schools: CBSE options available in Yelahanka New Town vicinity (~10 min)',
          'Daily essentials (grocery, pharmacy) are available but not walkable — car trips for everything',
        ],
      },
      {
        verdict: 'pass',
        keyPoint: '₹1.82–2.53 Cr all-in — largest budget buffer on the shortlist',
        notes: [
          'Base ₹1.71–2.38 Cr + GST 5% + stamp duty 5–6% + registration 1% = ₹1.82–2.53 Cr all-in',
          'EMI on ₹1.8 Cr loan @ 8.5% (30 yr) = ~₹1.55L/month. Maintenance deposit ~₹3–5L',
          'Rental yield ~2.8–3.2% (corporate/airport tenant market); earliest rental income on shortlist',
        ],
      },
      {
        verdict: 'warn',
        keyPoint: 'Check for nala proximity; Airport Road-facing units carry noise risk',
        notes: [
          'Billamaranahalli area has seasonal drainage nalas — verify unit elevation and site drainage plan',
          'Airport Road-facing units: meaningful noise + dust; insist on inner-block or rear-facing allotment',
          'No known builder litigation; RERA complaint count minimal on portal',
        ],
      },
      {
        verdict: 'pass',
        keyPoint: 'Jun 2027 — earliest self-occupation or rental activation on the entire shortlist',
        notes: [
          'Best for buyers who want earliest move-in or rental income to offset pre-EMI cost',
          'Airport-corridor 3BHK rental: ₹28–38k/month expected by 2027 from corporate and airline crew tenant base',
          'Resale liquidity: medium — Airport Road has a buyer pool but Thanisandra and Yelahanka are deeper markets',
        ],
      },
    ],
  },

  {
    id: 'prestige', rank: 2, shortName: 'Prestige', name: 'Prestige Avon',
    builder: 'Prestige Group', area: 'Thanisandra Main Rd',
    possession: 'Dec 2028', allin: '~₹3.41 Cr', day: 1,
    cats: [
      {
        verdict: 'pass',
        keyPoint: 'Thanisandra is the most mature North BLR IT-adjacent micro-market',
        notes: [
          'Dense residential ecosystem with strong resale market, multiple Grade A projects already delivered',
          'Manyata Tech Park and Embassy Golf Links drive sustained rental demand — lowest vacancy in North BLR',
          'Phase 2B Nagavara Metro station is the strongest upcoming infra catalyst directly serving this belt',
        ],
      },
      {
        verdict: 'pass',
        keyPoint: 'Best connectivity on the shortlist — Metro upside + 10 km / 18–22 min to Manyata',
        notes: [
          'Phase 2B Nagavara station is the single strongest upcoming Metro catalyst in North BLR — directly serves this belt',
          'NH44 accessible via Thanisandra Main Road; CBD reachable in 45–65 min off-peak',
          'Airport ~40–50 min (farther than Yelahanka / Devanahalli). BMTC routes active on main road',
        ],
      },
      {
        verdict: 'pass',
        keyPoint: 'Thanisandra CAGR ~10–12%; Phase 2B is the strongest near-term price catalyst in North BLR',
        notes: [
          'Phase 2B Nagavara station announcement already partially priced in — remaining upside unlocks on construction progress',
          'Higher entry psf (₹6,500–9,500) but also fastest resale liquidity — deepest buyer pool in North BLR',
          'Rental absorption consistently highest among shortlist areas — multiple IT campus catchments feed demand',
        ],
      },
      {
        verdict: 'warn',
        keyPoint: 'Size TBC — confirm exact carpet area and floor plan at site visit',
        notes: [
          'Prestige Avon launched Aug 2025 — floor plan details must be confirmed at visit (brochures sometimes differ)',
          'RERA registered — confirm number and % completion at sales office (RERA portal)',
          'Prestige Grade A quality expected; ask for carpet area, loading factor, and ceiling height in sample flat',
        ],
      },
      {
        verdict: 'pass',
        keyPoint: 'NSE-listed Prestige Group; RERA active — confirm RERA number at visit',
        notes: [
          'Prestige Group: NSE-listed, 230+ projects delivered, strong RERA compliance, no NCLT proceedings',
          'RERA registered Aug 2025 — verify number and % completion on K-RERA portal during visit',
          'Request sanctioned building plan copy and confirm Khata type for specific survey number (critical for Thanisandra)',
        ],
      },
      {
        verdict: 'pass',
        keyPoint: 'Boutique 230-unit project on 10 acres — above-average amenity space per resident',
        notes: [
          '10 acres for 230 units = generous land-per-unit ratio vs typical dense Thanisandra projects',
          'Prestige standard: pool, gym, clubhouse, jogging track, sports courts confirmed',
          'Confirm DG backup scope (100% all points vs lights/fans only) and water source at visit',
        ],
      },
      {
        verdict: 'pass',
        keyPoint: 'Best social infra on the shortlist — hospitals, schools, daily needs all within 5 km',
        notes: [
          'Columbia Asia Hebbal, Sai Baba Hospital, Sparsh Hospital within 5 km — best hospital access on list',
          'Ryan International, Vibgyor, multiple CBSE/ICSE schools within 3–4 km',
          'Elements Mall, Big Bazaar, D-Mart, various grocery options easily accessible for daily needs',
        ],
      },
      {
        verdict: 'fail',
        keyPoint: '₹3.41 Cr all-in — 13.7% over ₹3 Cr ceiling; negotiate or walk',
        notes: [
          'Base ₹3.2 Cr + GST 5% + stamp duty 5–6% + registration 1% = ~₹3.41 Cr. Exceeds ceiling by ₹41L',
          'Ask explicitly: any 3BHK unit at lower floor or east/north facing priced at base ₹2.7–2.8 Cr? Some combos exist',
          'If no flexibility: visit is still worthwhile to set a benchmark, but do not pay booking without price confirmation',
        ],
      },
      {
        verdict: 'warn',
        keyPoint: 'Thanisandra low pockets flood in heavy monsoon — verify unit elevation',
        notes: [
          'Main road frontage and service lane pockets have documented water-logging history in heavy rain',
          'Request site topography map; insist on a unit above ground-level or on a podium floor',
          'Builder litigation: nil. RERA complaint count: low. Construction quality: Prestige Grade A standard',
        ],
      },
      {
        verdict: 'warn',
        keyPoint: 'Strongest investment case; but budget overshoot limits self-occupation feasibility',
        notes: [
          'Rental demand: best on list — ₹32–42k/month for 3BHK in Thanisandra expected by 2028',
          'For self-occupation: ₹41L overshoot is a real constraint — negotiate or keep as watch-list property',
          'Resale liquidity: best on list. Prestige brand + Thanisandra demand = fastest turnaround at exit',
        ],
      },
    ],
  },

  {
    id: 'sattva', rank: 3, shortName: 'Sattva', name: 'Sattva Lumina',
    builder: 'Salarpuria Sattva', area: 'Yelahanka / Rajanukunte',
    possession: 'Nov 2029', allin: '₹1.62–1.87 Cr', day: 2,
    cats: [
      {
        verdict: 'pass',
        keyPoint: 'Yelahanka established zone; Rajanukunte is a clean SH-9 pocket developing well',
        notes: [
          'Yelahanka New Town is one of North BLR\'s best-planned residential corridors — good infrastructure and governance',
          'Rajanukunte on SH-9 is a quieter sub-pocket with a clear infra roadmap and low existing congestion',
          'Adjacent to NH44 growth zone; Aerospace corridor (Devanahalli) appreciation bleeds into this belt',
        ],
      },
      {
        verdict: 'pass',
        keyPoint: 'SH-9 + NH44 accessible; Airport 20 min; Manyata 25 min / 11 km',
        notes: [
          'SH-9 (Yelahanka–Doddaballapura road) is notably cleaner and less congested than Thanisandra belt',
          'NH44 via Yelahanka flyover gives direct access to Manyata and airport commute corridors',
          'No near-term Metro; BMTC sparse. Daily movement is car-dependent — verify comfort during weekday trial run',
        ],
      },
      {
        verdict: 'pass',
        keyPoint: 'Best ₹/sqft on the list — largest appreciation headroom from a low entry price',
        notes: [
          'Entry at ₹1.52–1.75 Cr for 1,450–1,780 sqft = significant headroom before reaching Thanisandra psf levels',
          'Large township (12.8 acres, 1,553 units) creates self-sustaining appreciation as amenities and community mature',
          'Yelahanka CAGR ~8–10% last 5 years with Metro alignment and airport corridor as long-term catalysts',
        ],
      },
      {
        verdict: 'pass',
        keyPoint: 'RERA Sep 2024; 1,450–1,780 sqft SBA; G+29 towers; 3 clubhouses',
        notes: [
          'RERA: PR/060924/007009 — verify on K-RERA portal and check % completion',
          '1,553 units across 8 towers G+29; loading factor ~27% typical for Sattva projects',
          'Ask for "Grand 3 BHK" floor plan variant — most spacious configuration in the project',
        ],
      },
      {
        verdict: 'warn',
        keyPoint: 'Rajanukunte is near panchayat boundary — A-Khata verification is critical',
        notes: [
          'Rajanukunte is on the Yelahanka–Doddaballapura belt with mixed BBMP / BDA / panchayat jurisdiction pockets',
          'Verify A-Khata or conversion roadmap for the specific survey number on BBMP portal before committing',
          'RERA registration (Sep 2024) is a positive signal. Ask builder for DC conversion order copy at visit',
        ],
      },
      {
        verdict: 'pass',
        keyPoint: 'Best amenity scale on the entire shortlist: 3 × 35,000 sqft clubhouses',
        notes: [
          'Three separate clubhouses (35,000 sqft each) across 12.8 acres for 1,553 units — exceptional ratio',
          'Full amenity suite: pool, gym, sports courts, landscaped zones, jogging track',
          'DG and STP standard. Confirm water source (BWSSB pipeline vs borewell) for Rajanukunte specifically',
        ],
      },
      {
        verdict: 'warn',
        keyPoint: 'Rajanukunte is thinner on external social infra — plan car-dependent daily needs',
        notes: [
          'Schools: good CBSE options in Yelahanka New Town (~5–8 km drive)',
          'Hospitals: Yelahanka Community Hospital for primary care; Columbia Asia Hebbal (~20 min) for tertiary',
          'Daily grocery and dining: available in Yelahanka town but not walkable from Rajanukunte — ~10 min drive',
        ],
      },
      {
        verdict: 'pass',
        keyPoint: '₹1.62–1.87 Cr all-in — ₹1.1–1.4 Cr below ₹3 Cr ceiling; best value per sqft',
        notes: [
          'Best value per sqft on list: ~₹10,500/sqft all-in for 1,450 sqft. EMI on ₹1.5 Cr @ 8.5% = ~₹1.29L/month',
          'Maintenance deposit ~₹2–4L. Monthly maintenance ~₹5,000–8,000 est. for 35,000 sqft clubhouse upkeep',
          'Rental yield ~2.8–3.2%; expect ₹22–30k/month for 3BHK in Yelahanka by Nov 2029',
        ],
      },
      {
        verdict: 'warn',
        keyPoint: 'Nov 2029 — longest wait; panchayat jurisdiction adds a legal verification step',
        notes: [
          'Nov 2029 possession means 3.5+ years of pre-EMI + rent overlap — model this cash drain carefully',
          'Some older Sattva projects ran 6–9 months late; build in Dec 2029–Mar 2030 buffer in financial plan',
          'Verify no lake bed or low-lying land in project parcel on BDA / BBMP maps before booking',
        ],
      },
      {
        verdict: 'pass',
        keyPoint: 'Best pure investment entry — low price + township appreciation + strong rental demand',
        notes: [
          'For investment: best combination of entry price, quality, and long-term appreciation on the shortlist',
          'Township premium grows as amenities open and community matures — typical 8–12% premium over standalone projects',
          'Resale: Salarpuria Sattva brand has strong recognition in Bangalore; deep buyer pool in Yelahanka corridor',
        ],
      },
    ],
  },

  {
    id: 'brigade', rank: 4, shortName: 'Brigade', name: 'Brigade Eternia',
    builder: 'Brigade Group', area: 'Yelahanka New Town',
    possession: 'Mar 2030', allin: '₹2.41 Cr', day: 2,
    cats: [
      {
        verdict: 'pass',
        keyPoint: 'Yelahanka New Town is a well-planned, established residential hub — best-in-class livability on the list',
        notes: [
          'One of North BLR\'s most organised residential zones: wide internal roads, planned layouts, low congestion',
          'Adjacent to NH44 with police station proximity — safety and governance infrastructure well-established',
          'Neighbouring Sahakar Nagar and Jakkur on upward trajectory; no industrial or encroachment concerns',
        ],
      },
      {
        verdict: 'pass',
        keyPoint: '15 km / 18 min to Manyata; NH44 5 min; Airport 25 min — solid all-round connectivity',
        notes: [
          'Fastest road connection to Manyata from Yelahanka belt at ~18 min off-peak via NH44 flyover',
          'NH44 access for airport and CBD commutes; Yelahanka flyover eliminates key congestion points',
          'No near-term Metro. BMTC routes active on main road. Car-dependent but well-connected via road network',
        ],
      },
      {
        verdict: 'pass',
        keyPoint: 'Yelahanka CAGR 8–10%; Brigade brand adds a measurable resale premium',
        notes: [
          'Brigade brand commands 5–8% price premium at resale vs unlisted builders in same micro-market',
          'Yelahanka price floor is rising as supply normalises and established projects prove quality',
          'Long-term Metro alignment (Phase 2B northward) and BIAL corridor growth continue to support appreciation',
        ],
      },
      {
        verdict: 'pass',
        keyPoint: '1,620–1,820 sqft SBA; RERA Mar 2025; Brigade Grade A — consistently top-rated construction quality',
        notes: [
          'RERA: PRM/KA/RERA/1251/309/PR/070325/007559 — verify on K-RERA portal',
          '3BHK across 14 acres, 1,124 units; loading factor ~26–28% expected',
          'Brigade construction quality and after-sales rated among top 3 in Bangalore resident surveys consistently',
        ],
      },
      {
        verdict: 'pass',
        keyPoint: 'NSE-listed Brigade; RERA active; Yelahanka New Town has clear A-Khata track record',
        notes: [
          'Brigade Group NSE-listed, strong RERA compliance, no NCLT proceedings',
          'Yelahanka New Town is predominantly BBMP A-Khata jurisdiction — lower legal risk than panchayat belts',
          'Confirm specific survey number A-Khata status at visit; get sanctioned plan copy from sales office',
        ],
      },
      {
        verdict: 'pass',
        keyPoint: 'Grade A amenity package across 14 acres — better density ratio than typical Thanisandra projects',
        notes: [
          '14 acres for 1,124 units = better open space per resident vs typical high-density North BLR projects',
          'Full Brigade standard: clubhouse, pool, gym, jogging track, sports courts, children\'s zone',
          'Power backup (DG), STP standard; EV charging scope to be confirmed at visit',
        ],
      },
      {
        verdict: 'pass',
        keyPoint: 'Best social infra among Yelahanka options — schools, hospital access, retail within reach',
        notes: [
          'Ryan International, Vidya Niketan, Presidency School within 3–4 km',
          'Yelahanka government hospital for primary care; Columbia Asia Hebbal (~15 min) for tertiary',
          'Elements Mall, Big Bazaar, D-Mart within 5–8 km; daily needs available in Yelahanka New Town market',
        ],
      },
      {
        verdict: 'pass',
        keyPoint: '₹2.41 Cr all-in — clean budget fit with ₹59L buffer vs ₹3 Cr ceiling',
        notes: [
          'Base ₹2.26 Cr + GST 5% + stamp duty 5–6% + registration 1% = ~₹2.41 Cr. Comfortable fit.',
          'EMI on ₹2 Cr loan @ 8.5% (30 yr) = ~₹1.72L/month. Maintenance deposit ~₹4–6L est.',
          'Rental yield ~2.7–3.0%. Monthly maintenance ~₹6,000–10,000 est. for 1,124-unit society',
        ],
      },
      {
        verdict: 'warn',
        keyPoint: 'Possession date discrepancy between sources — confirm RERA-registered date in writing',
        notes: [
          'RERA shows Mar 2030; some portals say Dec 2030. Ask sales office for RERA-certified possession date and get it in writing',
          'Ask for delay penalty clause: minimum SBI PLR rate on paid amount per month of delay — non-negotiable',
          'Yelahanka New Town: higher elevation, low flood risk, no known lake encroachment. Risk profile is clean',
        ],
      },
      {
        verdict: 'pass',
        keyPoint: 'Best self-occupation balance on the list — livability + quality + commute + liquidity',
        notes: [
          'Yelahanka livability score 81/100 (highest on shortlist) + Brigade quality = best live-in combination',
          'Rental ₹25–32k/month for 3BHK expected by 2030 in Yelahanka New Town',
          'Resale: Brigade brand + Yelahanka demand = solid liquidity; not as deep as Thanisandra but reliable',
        ],
      },
    ],
  },

  {
    id: 'tata', rank: 5, shortName: 'Tata', name: 'Tata Varnam',
    builder: 'Tata Housing', area: 'Devanahalli / Shettigere',
    possession: 'Dec 2029', allin: '₹1.65–2.04 Cr', day: 2,
    cats: [
      {
        verdict: 'warn',
        keyPoint: 'Emerging satellite zone — upside is real but residential maturity timeline is longer',
        notes: [
          'Devanahalli is an airport-growth satellite, not a mature residential micro-market; infrastructure leads population',
          'KIADB Aerospace & Defence park and Devanahalli Business Park are the key catalysts — both actively developing',
          'Neighbouring Yelahanka (10 min) and the airport itself provide area-level confidence; not speculative but a longer game',
        ],
      },
      {
        verdict: 'warn',
        keyPoint: 'No Metro; Airport 10–15 min (outstanding); Manyata 25–35 min — validate commute tolerance',
        notes: [
          'Airport is the strongest connectivity asset on the shortlist — unbeatable if you fly frequently or work near KIA',
          'Daily Manyata commute: 25–35 min off-peak, 40–50 min peak. Acceptable but noticeably more than Yelahanka',
          'STRR (Satellite Town Ring Road) planned — will improve cross-city access when built; no firm completion timeline',
        ],
      },
      {
        verdict: 'pass',
        keyPoint: 'Devanahalli CAGR could lead the shortlist if aerospace / airport growth continues to execute',
        notes: [
          'Devanahalli CAGR ~10–12% forecast on airport + KIADB industrial park growth — best long-term appreciation thesis',
          'Tata brand commands significant resale premium nationally — buyers pay more for Tata-branded properties',
          'Current entry psf (₹5,500–7,500) is lowest on the list — maximum headroom before reaching comparable area prices',
        ],
      },
      {
        verdict: 'pass',
        keyPoint: '1,681–2,061 sqft SBA — largest config on list; 3BHK+2T at best sqft-per-rupee',
        notes: [
          'RERA: PR/110825/007988. Registered Aug 2025. Verify % completion on K-RERA portal.',
          '1,681 sqft at ₹1.55 Cr base = ~₹9,220/sqft — lowest price per sqft of all 5 properties',
          '3BHK+2T (two toilets in master area) is the most functional layout for families or WFH setups',
        ],
      },
      {
        verdict: 'warn',
        keyPoint: 'Devanahalli has mixed panchayat / BDA jurisdiction — land conversion verification is critical',
        notes: [
          'Devanahalli area has pockets under gram panchayat jurisdiction — A-Khata and conversion documents must be verified',
          'Tata Housing is gold-standard for legal compliance and significantly mitigates this risk vs smaller builders',
          'Confirm at visit: DC conversion order, sanctioned building plan, A-Khata status of specific survey number',
        ],
      },
      {
        verdict: 'pass',
        keyPoint: '135-acre Carnatica township — self-contained community compensates for thin external infra',
        notes: [
          'Tata Varnam sits inside the 135-acre Carnatica integrated township: school, retail, parks within community',
          'Full Tata Housing amenity standard: clubhouse, pool, gym, sports zones, landscaped gardens',
          'The township model partially offsets Devanahalli\'s thin external social infrastructure for daily needs',
        ],
      },
      {
        verdict: 'warn',
        keyPoint: 'External social infra is thin — township compensates, but tertiary care is 20–30 min away',
        notes: [
          'Outside the township: Devanahalli town has basic facilities (Victory Hospital, local schools)',
          'For tertiary care: Yelahanka or Hebbal hospitals are 20–30 min. Medical emergency response time is a consideration',
          'Grocery and dining options limited outside township for now — improving as KIADB park and housing fill in',
        ],
      },
      {
        verdict: 'pass',
        keyPoint: 'Best value per sqft on the shortlist — ₹1.65–2.04 Cr all-in for 1,681–2,061 sqft',
        notes: [
          '₹1.55 Cr base for 1,681 sqft = ₹9,220/sqft — cheapest per sqft of all 5 properties by a significant margin',
          'EMI on ₹1.4 Cr loan @ 8.5% (30 yr) = ~₹1.20L/month — most affordable monthly EMI on shortlist',
          'Township maintenance ~₹4–6/sqft/month = ₹7,000–12,000/month est. for a 1,681 sqft unit',
        ],
      },
      {
        verdict: 'warn',
        keyPoint: 'Growth-thesis risk: if aerospace / KIADB stalls, appreciation weakens materially',
        notes: [
          'Primary risk: Devanahalli appreciation is thesis-dependent on KIADB park and airport expansion executing on time',
          'Panchayat pockets: verify no lake-bed or low-lying land in project parcel (check BDA / BBMP flood zone maps)',
          'Tata Housing brand completely mitigates builder risk — zero financial stress, zero litigation track record nationally',
        ],
      },
      {
        verdict: 'warn',
        keyPoint: 'Investment-first property — self-occupation requires validating the daily commute in real conditions',
        notes: [
          'Drive the Devanahalli–Manyata route on a weekday morning before committing — non-negotiable check',
          'For investment: best long-term appreciation + Tata brand premium at lowest entry price = strongest long-term hold',
          'Rental yield thin now (~2.5%); rises as KIADB fills. Exit buyer target: airport professionals and aerospace park employees',
        ],
      },
    ],
  },
];

// ── summary matrix helpers ─────────────────────────────────────────────────

function worstVerdict(verdicts: Verdict[]): Verdict {
  if (verdicts.includes('fail')) return 'fail';
  if (verdicts.includes('warn')) return 'warn';
  return 'pass';
}

// ── main component ─────────────────────────────────────────────────────────

export default function FullEvaluation() {
  const [activeProp, setActiveProp] = useCanvasState<string>('evalProp', 'purva');
  const prop = PROPS.find(p => p.id === activeProp) ?? PROPS[0];

  const passCount = prop.cats.filter(c => c.verdict === 'pass').length;
  const warnCount = prop.cats.filter(c => c.verdict === 'warn').length;
  const failCount = prop.cats.filter(c => c.verdict === 'fail').length;
  const score = `${passCount * 10 + warnCount * 5}/100`;

  const matrixRowTones = CATS.map((_, i) => {
    const row = PROPS.map(p => p.cats[i].verdict);
    const w = worstVerdict(row);
    return w === 'fail' ? ('danger' as const) : w === 'warn' ? ('warning' as const) : undefined;
  });

  return (
    <Stack gap={28} style={{ padding: '24px 28px', maxWidth: 1040 }}>

      <Stack gap={4}>
        <H1>Full 10-Category Evaluation</H1>
        <Text tone="secondary">
          5 shortlisted properties · 10 criteria · 50 assessments · Apr 2026
        </Text>
      </Stack>

      {/* ── summary matrix ─────────────────────────────── */}
      <Stack gap={10}>
        <H2>Summary matrix</H2>
        <Table
          headers={['#', 'Category', 'Purva', 'Prestige', 'Sattva', 'Brigade', 'Tata']}
          rows={CATS.map((cat, i) => [
            String(cat.n),
            cat.label,
            vLabel(PROPS[0].cats[i].verdict),
            vLabel(PROPS[1].cats[i].verdict),
            vLabel(PROPS[2].cats[i].verdict),
            vLabel(PROPS[3].cats[i].verdict),
            vLabel(PROPS[4].cats[i].verdict),
          ])}
          rowTone={matrixRowTones}
          striped
        />
      </Stack>

      <Stack gap={8}>
        <Text size="small" tone="secondary">
          Score basis: Pass = 10 pts · Warn = 5 pts · Fail = 0 pts · out of 100. For comparison only — not a buy/sell recommendation.
        </Text>
        <Table
          headers={['Property', 'Area', 'Possession', 'All-in', 'Pass', 'Warn', 'Fail', 'Score']}
          rows={PROPS.map(p => {
            const pc = p.cats.filter(c => c.verdict === 'pass').length;
            const wc = p.cats.filter(c => c.verdict === 'warn').length;
            const fc = p.cats.filter(c => c.verdict === 'fail').length;
            return [
              `${p.rank}. ${p.name}`,
              p.area,
              p.possession,
              p.allin,
              String(pc),
              String(wc),
              String(fc),
              `${pc * 10 + wc * 5}/100`,
            ];
          })}
          rowTone={PROPS.map(p =>
            p.cats.some(c => c.verdict === 'fail')
              ? ('danger' as const)
              : undefined
          )}
          striped
        />
      </Stack>

      <Divider />

      {/* ── property selector ─────────────────────────── */}
      <Stack gap={14}>
        <Row gap={8} align="center" wrap>
          <H2>Deep dive</H2>
          <Row gap={6} wrap>
            {PROPS.map(p => (
              <Pill
                key={p.id}
                active={activeProp === p.id}
                tone={activeProp === p.id ? 'success' : 'neutral'}
                onClick={() => setActiveProp(p.id)}
              >
                {p.rank}. {p.name}
              </Pill>
            ))}
          </Row>
        </Row>

        <Grid columns={4} gap={14}>
          <Stat value={`${passCount}/10`} label="Pass" tone="success" />
          <Stat value={`${warnCount}/10`} label="Warn" tone="warning" />
          <Stat
            value={`${failCount}/10`}
            label="Fail"
            tone={failCount > 0 ? 'danger' : undefined}
          />
          <Stat value={score} label="Score" />
        </Grid>

        <Grid columns={3} gap={12}>
          <Stat value={prop.allin} label="All-in cost" />
          <Stat value={prop.possession} label="Possession" />
          <Stat value={prop.builder} label="Builder" />
        </Grid>

        {/* ── 10 categories ─────────────────────────────── */}
        <Stack gap={0}>
          {CATS.map((cat, i) => {
            const ce = prop.cats[i];
            return (
              <Stack key={cat.n} gap={0}>
                <Card>
                  <CardHeader
                    trailing={
                      <Row gap={6}>
                        <Pill tone={vTone(ce.verdict)} size="sm">{vLabel(ce.verdict)}</Pill>
                      </Row>
                    }
                  >
                    <Row gap={8} align="center">
                      <Text tone="secondary" size="small" style={{ minWidth: 22, fontWeight: 700 }}>
                        {cat.n}.
                      </Text>
                      <Text weight="semibold">{cat.label}</Text>
                    </Row>
                  </CardHeader>
                  <CardBody>
                    <Stack gap={8}>
                      <Text size="small" tone="secondary">{cat.sub}</Text>
                      <Text size="small" weight="semibold">{ce.keyPoint}</Text>
                      <Stack gap={3}>
                        {ce.notes.map((note, ni) => (
                          <Row key={ni} gap={8} style={{ alignItems: 'flex-start' }}>
                            <Text size="small" tone="secondary" style={{ minWidth: 12 }}>—</Text>
                            <Text size="small" tone="secondary">{note}</Text>
                          </Row>
                        ))}
                      </Stack>
                    </Stack>
                  </CardBody>
                </Card>
              </Stack>
            );
          })}
        </Stack>
      </Stack>

      <Divider />

      <Text tone="secondary" size="small">
        Scores reflect Apr 2026 market data. Verify RERA %, Khata type, possession dates, and price flexibility at each site visit before any payment. This is a research tool — not investment advice.
      </Text>
    </Stack>
  );
}
