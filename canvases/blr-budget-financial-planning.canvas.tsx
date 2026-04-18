import {
  BarChart,
  Button, Card, CardBody, CardHeader,
  Divider, Grid, H1, H2, H3,
  Pill, Row, Spacer, Stack, Stat, Table, Text,
  useCanvasState,
} from 'cursor/canvas';

// ── helpers ────────────────────────────────────────────────────────────────

function calcEMI(principal: number, annualRate: number, years: number): number {
  const r = annualRate / 100 / 12;
  const n = years * 12;
  return Math.round(principal * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1));
}

function inL(val: number): string {
  if (val >= 10_000_000) return `₹${(val / 10_000_000).toFixed(2)} Cr`;
  return `₹${Math.round(val / 100_000)}L`;
}

function fmtINR(val: number): string {
  return '₹' + val.toLocaleString('en-IN');
}

const RATE = 8.75;

const LOAN_OPTIONS = [
  { label: '80L', value: 8_000_000 },
  { label: '1.0 Cr', value: 10_000_000 },
  { label: '1.2 Cr', value: 12_000_000 },
  { label: '1.5 Cr', value: 15_000_000 },
  { label: '1.8 Cr', value: 18_000_000 },
  { label: '2.0 Cr', value: 20_000_000 },
];

const TENURE_OPTIONS = [10, 15, 20, 25, 30];

// ── cost breakdown data ────────────────────────────────────────────────────

function getAllInCosts(propertyPrice: number, isUC: boolean) {
  const stampDuty = propertyPrice * 0.05;
  const cess = stampDuty * 0.10;
  const registration = propertyPrice * 0.01;
  const gst = isUC ? propertyPrice * 0.05 : 0;
  const legal = 75_000;
  const loanProcessing = 30_000;
  const total = propertyPrice + stampDuty + cess + registration + gst + legal + loanProcessing;
  return { stampDuty, cess, registration, gst, legal, loanProcessing, total };
}

// ── main component ─────────────────────────────────────────────────────────

export default function BudgetFinancialPlanning() {
  const [loanIdx, setLoanIdx] = useCanvasState('loanIdx', 3); // default 1.5 Cr
  const [tenure, setTenure] = useCanvasState('tenure', 20);

  const loanAmount = LOAN_OPTIONS[loanIdx].value;
  const emi = calcEMI(loanAmount, RATE, tenure);
  const totalPaid = emi * tenure * 12;
  const totalInterest = totalPaid - loanAmount;
  const monthlyIncomeNeeded = Math.round(emi / 0.40);
  const annualCtcNeeded = Math.round(monthlyIncomeNeeded * 12 * 1.35); // rough gross (take-home ~74% of gross)

  // Cost breakdown for chart
  const rtm200 = getAllInCosts(20_000_000, false);
  const uc200 = getAllInCosts(20_000_000, true);

  return (
    <Stack gap={28} style={{ padding: '24px 28px', maxWidth: 920 }}>

      {/* ── header ── */}
      <Stack gap={4}>
        <H1>Budget & Financial Planning</H1>
        <Text tone="secondary">Buying a property in Bangalore — up to ₹3 Crore</Text>
      </Stack>

      <Grid columns={4} gap={14}>
        <Stat value="₹3 Cr" label="Total Budget Ceiling" />
        <Stat value="~₹2.35 Cr" label="Max Property Price (RTM)" tone="warning" />
        <Stat value="~₹2.22 Cr" label="Max Property Price (UC)" tone="danger" />
        <Stat value="~6.5–12%" label="Extra Over Property Price" tone="danger" />
      </Grid>

      <Divider />

      {/* ── 1. The Budget Reality ── */}
      <Stack gap={12}>
        <H2>1. The Budget Reality — What ₹3 Cr Actually Means</H2>
        <Text tone="secondary" size="small">
          Your ₹3 Cr budget is NOT the property price — it's the total outflow. Government
          charges, GST (for under-construction), and fees eat 6–12% on top.
        </Text>

        <Table
          headers={['Cost Component', 'Ready-to-Move', 'Under-Construction', 'Notes']}
          rows={[
            ['Property Price', '₹2,00,00,000', '₹2,00,00,000', 'Base agreement value'],
            ['Stamp Duty (5%)', '₹10,00,000', '₹10,00,000', 'On guidance value; women get 1% concession'],
            ['Surcharge / Cess (10% of SD)', '₹1,00,000', '₹1,00,000', 'BBMP/BDA cess on stamp duty'],
            ['Registration (1%)', '₹2,00,000', '₹2,00,000', 'No upper cap in KA for > ₹45L'],
            ['GST @ 5%', '—', '₹10,00,000', 'Only on UC; nil for ready-to-move with OC'],
            ['Legal / Due Diligence', '₹75,000', '₹75,000', 'Lawyer fees + EC + title search'],
            ['Loan Processing Fee', '₹30,000', '₹30,000', 'Typically 0.25–0.5% of loan amount'],
            ['Interior / Setup', '₹5–15L', '₹5–15L', 'Variable; budget separately'],
          ]}
          rowTone={[undefined, undefined, undefined, undefined, 'warning', undefined, undefined, undefined]}
          columnAlign={['left', 'right', 'right', 'left']}
          striped
        />

        <Grid columns={2} gap={14}>
          <Card>
            <CardHeader trailing={<Pill tone="success" size="sm">Ready-to-Move</Pill>}>
              Total Outflow on ₹2 Cr RTM Property
            </CardHeader>
            <CardBody>
              <Grid columns={2} gap={10}>
                <Stat value="₹13.05L" label="Govt Charges (6.5%)" />
                <Stat value="₹2.14 Cr" label="Total Outflow" tone="warning" />
              </Grid>
              <Text size="small" tone="secondary" style={{ marginTop: 10 }}>
                If your all-in budget is ₹3 Cr, max RTM property price ≈ <Text weight="semibold" as="span">₹2.82 Cr</Text>
              </Text>
            </CardBody>
          </Card>

          <Card>
            <CardHeader trailing={<Pill tone="warning" size="sm">Under-Construction</Pill>}>
              Total Outflow on ₹2 Cr UC Property
            </CardHeader>
            <CardBody>
              <Grid columns={2} gap={10}>
                <Stat value="₹23.05L" label="Govt Charges + GST (11.5%)" tone="danger" />
                <Stat value="₹2.24 Cr" label="Total Outflow" tone="danger" />
              </Grid>
              <Text size="small" tone="secondary" style={{ marginTop: 10 }}>
                If your all-in budget is ₹3 Cr, max UC property price ≈ <Text weight="semibold" as="span">₹2.67 Cr</Text>
              </Text>
            </CardBody>
          </Card>
        </Grid>

        <BarChart
          categories={['Property Price', 'Stamp Duty + Cess', 'Registration', 'GST (UC only)', 'Legal + Loan Fees']}
          series={[
            { name: 'Ready-to-Move', data: [200, 11, 2, 0, 1.05] },
            { name: 'Under-Construction', data: [200, 11, 2, 10, 1.05] },
          ]}
          stacked
          valueSuffix="L"
          height={240}
        />
      </Stack>

      <Divider />

      {/* ── 2. Interactive EMI Calculator ── */}
      <Stack gap={14}>
        <H2>2. Interactive EMI Calculator</H2>
        <Text tone="secondary" size="small">
          Banks fund 75–80% of property value (LTV ratio). Select your expected loan amount and tenure below.
          Rate assumed: {RATE}% p.a. (floating; check current rates before deciding).
        </Text>

        <Stack gap={10}>
          <H3>Loan Amount</H3>
          <Row gap={8} wrap>
            {LOAN_OPTIONS.map((opt, i) => (
              <Pill
                key={opt.label}
                active={loanIdx === i}
                onClick={() => setLoanIdx(i)}
              >
                {opt.label}
              </Pill>
            ))}
          </Row>
        </Stack>

        <Stack gap={10}>
          <H3>Tenure (years)</H3>
          <Row gap={8}>
            {TENURE_OPTIONS.map(yr => (
              <Pill
                key={yr}
                active={tenure === yr}
                onClick={() => setTenure(yr)}
              >
                {yr} yr
              </Pill>
            ))}
          </Row>
        </Stack>

        <Grid columns={4} gap={14}>
          <Stat value={fmtINR(emi)} label={`Monthly EMI (${tenure} yr)`} tone="warning" />
          <Stat value={inL(totalInterest)} label="Total Interest Paid" tone="danger" />
          <Stat value={fmtINR(monthlyIncomeNeeded)} label="Min Take-Home/Month (40% rule)" />
          <Stat value={inL(annualCtcNeeded)} label="Approx CTC Needed" />
        </Grid>

        <Card>
          <CardHeader>Loan Summary — {LOAN_OPTIONS[loanIdx].label} @ {RATE}% for {tenure} years</CardHeader>
          <CardBody>
            <Table
              headers={['Metric', 'Value', 'Insight']}
              rows={[
                ['Loan Amount', inL(loanAmount), 'Bank funds up to 80% of property value'],
                ['Monthly EMI', fmtINR(emi), 'Fixed for entire tenure (floating rate may change)'],
                ['Total Paid over Tenure', inL(totalPaid), `${tenure} yrs × 12 months × EMI`],
                ['Total Interest', inL(totalInterest), `${((totalInterest / loanAmount) * 100).toFixed(0)}% of principal — the real cost of borrowing`],
                ['Interest-to-Principal Ratio', `${(totalInterest / loanAmount).toFixed(2)}x`, 'You pay this many times the principal in interest'],
                ['Min Take-Home (40% rule)', fmtINR(monthlyIncomeNeeded) + '/mo', 'EMI should be ≤ 40% of net take-home salary'],
                ['Approx CTC Needed', inL(annualCtcNeeded) + '/yr', 'Gross estimate; verify with your actual tax slab'],
              ]}
              rowTone={[undefined, undefined, undefined, 'danger', undefined, 'warning', undefined]}
            />
          </CardBody>
        </Card>
      </Stack>

      <Divider />

      {/* ── 3. Full EMI Scenarios ── */}
      <Stack gap={12}>
        <H2>3. EMI Comparison Across All Loan Amounts @ {RATE}%</H2>

        <Table
          headers={['Loan Amount', 'Down Payment (20%)', 'EMI 15yr', 'EMI 20yr', 'EMI 25yr', 'Take-Home Needed (20yr)']}
          rows={[
            ['₹80L', '₹20L', fmtINR(calcEMI(8_000_000, RATE, 15)), fmtINR(calcEMI(8_000_000, RATE, 20)), fmtINR(calcEMI(8_000_000, RATE, 25)), fmtINR(Math.round(calcEMI(8_000_000, RATE, 20) / 0.4)) + '/mo'],
            ['₹1.0 Cr', '₹25L', fmtINR(calcEMI(10_000_000, RATE, 15)), fmtINR(calcEMI(10_000_000, RATE, 20)), fmtINR(calcEMI(10_000_000, RATE, 25)), fmtINR(Math.round(calcEMI(10_000_000, RATE, 20) / 0.4)) + '/mo'],
            ['₹1.2 Cr', '₹30L', fmtINR(calcEMI(12_000_000, RATE, 15)), fmtINR(calcEMI(12_000_000, RATE, 20)), fmtINR(calcEMI(12_000_000, RATE, 25)), fmtINR(Math.round(calcEMI(12_000_000, RATE, 20) / 0.4)) + '/mo'],
            ['₹1.5 Cr', '₹38L', fmtINR(calcEMI(15_000_000, RATE, 15)), fmtINR(calcEMI(15_000_000, RATE, 20)), fmtINR(calcEMI(15_000_000, RATE, 25)), fmtINR(Math.round(calcEMI(15_000_000, RATE, 20) / 0.4)) + '/mo'],
            ['₹1.8 Cr', '₹45L', fmtINR(calcEMI(18_000_000, RATE, 15)), fmtINR(calcEMI(18_000_000, RATE, 20)), fmtINR(calcEMI(18_000_000, RATE, 25)), fmtINR(Math.round(calcEMI(18_000_000, RATE, 20) / 0.4)) + '/mo'],
            ['₹2.0 Cr', '₹50L', fmtINR(calcEMI(20_000_000, RATE, 15)), fmtINR(calcEMI(20_000_000, RATE, 20)), fmtINR(calcEMI(20_000_000, RATE, 25)), fmtINR(Math.round(calcEMI(20_000_000, RATE, 20) / 0.4)) + '/mo'],
          ]}
          columnAlign={['left', 'right', 'right', 'right', 'right', 'right']}
          striped
        />

        <Text size="small" tone="secondary">
          Down payment = 20% of property value (assumed). Banks lend 75-80% LTV. Add stamp duty + registration on top of down payment — that's what you need liquid cash for.
        </Text>
      </Stack>

      <Divider />

      {/* ── 4. Down Payment & Liquid Cash ── */}
      <Stack gap={12}>
        <H2>4. How Much Liquid Cash Do You Actually Need?</H2>
        <Text tone="secondary" size="small">
          This is the most common blind spot. People plan for the down payment but forget stamp duty, registration, and interiors all need to be paid in cash — banks don't fund these.
        </Text>

        <Table
          headers={['Property Price', 'Down Payment (20%)', 'Stamp + Reg (6.5%)', 'GST if UC (5%)', 'Legal + Misc', 'Min Cash Needed (RTM)', 'Min Cash Needed (UC)']}
          rows={[
            ['₹1.5 Cr', '₹30L', '₹9.75L', '₹7.5L', '₹1L', '₹40.75L', '₹48.25L'],
            ['₹2.0 Cr', '₹40L', '₹13L', '₹10L', '₹1.25L', '₹54.25L', '₹64.25L'],
            ['₹2.2 Cr', '₹44L', '₹14.3L', '₹11L', '₹1.25L', '₹59.55L', '₹70.55L'],
            ['₹2.5 Cr', '₹50L', '₹16.25L', '₹12.5L', '₹1.5L', '₹67.75L', '₹80.25L'],
            ['₹3.0 Cr', '₹60L', '₹19.5L', '₹15L', '₹1.5L', '₹81L', '₹96L'],
          ]}
          rowTone={[undefined, undefined, 'warning', 'danger']}
          columnAlign={['left', 'right', 'right', 'right', 'right', 'right', 'right']}
          striped
        />

        <Text size="small" tone="secondary">
          Rule of thumb: Have at least 30–35% of property value as liquid savings before beginning the search — 20% down payment + 6.5% govt charges + 5–8% buffer for interiors and contingencies.
        </Text>
      </Stack>

      <Divider />

      {/* ── 5. Karnataka Stamp Duty Slabs ── */}
      <Stack gap={12}>
        <H2>5. Karnataka Stamp Duty Slabs (2024–25)</H2>

        <Grid columns={2} gap={14}>
          <Stack gap={8}>
            <H3>For General Buyers</H3>
            <Table
              headers={['Property Value', 'Stamp Duty', 'Reg', 'Total']}
              rows={[
                ['Up to ₹20L', '2%', '1%', '3%'],
                ['₹20L – ₹45L', '3%', '1%', '4%'],
                ['Above ₹45L', '5% + 10% cess', '1%', '6.5%'],
              ]}
              rowTone={[undefined, undefined, 'warning']}
              columnAlign={['left', 'right', 'right', 'right']}
            />
          </Stack>

          <Stack gap={8}>
            <H3>For Women Buyers (1% concession on SD)</H3>
            <Table
              headers={['Property Value', 'Stamp Duty', 'Reg', 'Total']}
              rows={[
                ['Up to ₹20L', '2%', '1%', '3%'],
                ['₹20L – ₹45L', '2%', '1%', '3%'],
                ['Above ₹45L', '4% + 10% cess', '1%', '5.4%'],
              ]}
              rowTone={[undefined, undefined, 'success']}
              columnAlign={['left', 'right', 'right', 'right']}
            />
            <Text size="small" tone="secondary">Registering in a woman's name saves ~₹1L on a ₹2 Cr property.</Text>
          </Stack>
        </Grid>
      </Stack>

      <Divider />

      {/* ── 6. Tax Benefits ── */}
      <Stack gap={12}>
        <H2>6. Income Tax Benefits on Home Loan</H2>
        <Text tone="secondary" size="small">
          A home loan provides substantial tax deductions — effectively reducing your real cost of borrowing.
        </Text>

        <Table
          headers={['Section', 'Benefit', 'Limit/Year', 'Condition']}
          rows={[
            ['Sec 24(b)', 'Deduction on interest paid', '₹2,00,000', 'Self-occupied property; unlimited for let-out'],
            ['Sec 80C', 'Deduction on principal repaid', '₹1,50,000', 'Clubbed with PF, ELSS, LIC premium etc.'],
            ['Sec 80EEA', 'Additional interest deduction (first-time buyer)', '₹1,50,000', 'Stamp duty value ≤ ₹45L; loan sanctioned FY19-22 — check current applicability'],
            ['Sec 80EE', 'Additional interest deduction (first-time buyer)', '₹50,000', 'Loan ≤ ₹35L; property value ≤ ₹50L — older scheme'],
          ]}
          rowTone={[undefined, undefined, 'info', 'neutral']}
          striped
        />

        <Card>
          <CardHeader trailing={<Pill size="sm">Example Calculation</Pill>}>
            Effective Tax Saving on ₹1.5 Cr Loan (30% tax bracket)
          </CardHeader>
          <CardBody>
            <Table
              headers={['Deduction', 'Section', 'Annual Saving @ 30%']}
              rows={[
                ['Interest deduction', 'Sec 24(b) — ₹2L limit', '₹60,000'],
                ['Principal deduction', 'Sec 80C — ₹1.5L limit', '₹45,000'],
                ['Total annual tax saved', '—', '₹1,05,000'],
                ['Effective EMI reduction per month', '—', '~₹8,750/month'],
              ]}
              rowTone={[undefined, undefined, 'success', 'success']}
            />
          </CardBody>
        </Card>
      </Stack>

      <Divider />

      {/* ── 7. Key Rules ── */}
      <Stack gap={12}>
        <H2>7. Key Financial Rules to Commit To</H2>

        <Grid columns={2} gap={14}>
          <Card>
            <CardHeader trailing={<Pill tone="warning" size="sm">Non-negotiable</Pill>}>
              The 40% EMI Rule
            </CardHeader>
            <CardBody>
              <Stack gap={6}>
                <Text size="small">Your total EMI obligations (all loans combined) should not exceed <Text weight="semibold" as="span">40% of your net take-home salary.</Text></Text>
                <Text size="small" tone="secondary">Example: Take-home ₹2L/month → Max total EMI = ₹80,000. If you already have a car loan of ₹15K, home loan EMI ceiling = ₹65K.</Text>
              </Stack>
            </CardBody>
          </Card>

          <Card>
            <CardHeader trailing={<Pill tone="warning" size="sm">Before you search</Pill>}>
              Pre-Approved Loan Sanction
            </CardHeader>
            <CardBody>
              <Stack gap={6}>
                <Text size="small">Get a pre-approved home loan sanction letter before starting property visits. This tells you the exact amount the bank will lend and protects you from overcommitting.</Text>
                <Text size="small" tone="secondary">Takes 7–14 days. Needed for builder negotiations too — they take you more seriously.</Text>
              </Stack>
            </CardBody>
          </Card>

          <Card>
            <CardHeader trailing={<Pill tone="warning" size="sm">Critical</Pill>}>
              Emergency Fund Must Stay Intact
            </CardHeader>
            <CardBody>
              <Stack gap={6}>
                <Text size="small">Do NOT deplete your emergency fund (6 months of expenses) for the down payment. Maintain it separately — job loss + EMI is a dangerous combination.</Text>
                <Text size="small" tone="secondary">Keep emergency fund, down payment, and stamp/registration as three separate buckets.</Text>
              </Stack>
            </CardBody>
          </Card>

          <Card>
            <CardHeader trailing={<Pill size="sm">Strategy</Pill>}>
              Floating vs Fixed Rate
            </CardHeader>
            <CardBody>
              <Stack gap={6}>
                <Text size="small">Most Indian home loans are floating (linked to repo rate). Fixed rate loans carry a 1–1.5% premium but protect you if rates rise.</Text>
                <Text size="small" tone="secondary">Current RBI repo rate cycle: evaluate whether we're near the peak. A 0.5% rate drop on ₹1.5 Cr loan saves ~₹6,500/month in EMI.</Text>
              </Stack>
            </CardBody>
          </Card>
        </Grid>
      </Stack>

      <Divider />

      {/* ── 8. What ₹3 Cr gets you ── */}
      <Stack gap={12}>
        <H2>8. What ₹3 Cr Gets You in Bangalore (2026)</H2>
        <Text tone="secondary" size="small">Indicative ranges. Prices vary widely by project, floor, facing, and negotiation.</Text>

        <Table
          headers={['Micro-Market', 'Configuration', 'Carpet Area', 'Type', 'Status']}
          rows={[
            ['Whitefield / ITPL', '3 BHK', '1,200–1,500 sqft', 'Apartment in society', 'RTM + UC both available'],
            ['Electronic City Ph1/Ph2', '3 BHK large', '1,600–2,000 sqft', 'Apartment with amenities', 'Good value; UC available'],
            ['Sarjapur Road', '3 BHK', '1,400–1,700 sqft', 'Apartment', 'Premium corridor; improving infra'],
            ['Thanisandra / Hennur', '3–4 BHK', '1,700–2,100 sqft', 'Apartment with amenities', 'Sobha City RTM range'],
            ['Kanakapura Road', '3 BHK large', '1,800–2,200 sqft', 'Apartment', 'Best size-for-money; Metro coming'],
            ['Yelahanka / Devanahalli', '3 BHK spacious', '1,700–2,100 sqft', 'Apartment — Prestige/Brigade', 'Airport corridor; strong appreciation'],
            ['JP Nagar / Bannerghatta Rd', '3 BHK', '1,300–1,600 sqft', 'Apartment', 'South Bangalore; established'],
            ['Hebbal / Bellary Rd', '2–3 BHK', '1,100–1,400 sqft', 'Apartment', 'Premium location; smaller units for money'],
          ]}
          rowTone={[undefined, undefined, undefined, 'success', undefined, 'success', undefined, 'warning']}
          striped
          columnAlign={['left', 'left', 'right', 'left', 'left']}
        />
      </Stack>

      <Divider />

      <Stack gap={6}>
        <H3>Your Financial Checklist Before Moving to Area Selection</H3>
        <Table
          headers={['Item', 'Target / Action']}
          rows={[
            ['Know your loan eligibility', 'Run calculation with your bank / HDFC / SBI online'],
            ['Check CIBIL score', 'Score > 750 for best rates; > 800 for negotiating power'],
            ['Calculate liquid cash available', '≥ 30–35% of target property price'],
            ['Set strict all-in budget', 'Property price = Total Budget ÷ 1.065 (RTM) or ÷ 1.115 (UC)'],
            ['Decide property type preference', 'RTM vs UC — impacts GST, possession risk, and loan disbursement'],
            ['Get pre-approved loan sanction', '7–14 day process; do before visiting sites'],
          ]}
          striped
        />
        <Text tone="secondary" size="small" style={{ marginTop: 4 }}>
          Once financials are locked, move to Step 2: Area & Location Selection.
        </Text>
      </Stack>

    </Stack>
  );
}
