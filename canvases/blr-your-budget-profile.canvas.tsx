import {
  BarChart, LineChart,
  Card, CardBody, CardHeader,
  Divider, Grid, H1, H2, H3,
  Pill, Row, Stack, Stat, Table, Text,
  useCanvasState,
} from 'cursor/canvas';

// ── helpers ────────────────────────────────────────────────────────────────

function calcEMI(principal: number, annualRate: number, years: number): number {
  const r = annualRate / 100 / 12;
  const n = years * 12;
  return Math.round(principal * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1));
}

function inL(val: number, decimals = 1): string {
  if (val >= 10_000_000) return `₹${(val / 10_000_000).toFixed(decimals)} Cr`;
  return `₹${(val / 100_000).toFixed(decimals)}L`;
}

function fmtINR(val: number): string {
  return '₹' + Math.round(val).toLocaleString('en-IN');
}

const RATE = 8.75;
const CTC = 35_00_000;

// ── your personal financial profile ───────────────────────────────────────

// New regime 2025-26 estimate
const EMPLOYER_PF = 1_68_000;          // 12% of ₹14L basic
const GROSS_SALARY = CTC - EMPLOYER_PF; // ₹33.32L
const EMPLOYEE_PF = 1_68_000;
const INCOME_TAX = 5_79_384;            // calculated for ₹32.57L taxable
const ANNUAL_TAKE_HOME = GROSS_SALARY - EMPLOYEE_PF - INCOME_TAX; // ₹25.85L
const MONTHLY_TAKE_HOME = Math.round(ANNUAL_TAKE_HOME / 12);       // ₹2.15L

const MAX_EMI_40 = Math.round(MONTHLY_TAKE_HOME * 0.40);   // ₹86K
const MAX_EMI_50 = Math.round(MONTHLY_TAKE_HOME * 0.50);   // ₹1.08L

// Bank FOIR on gross (banks use gross, not take-home)
const GROSS_MONTHLY = Math.round(GROSS_SALARY / 12);
const BANK_MAX_EMI_40 = Math.round(GROSS_MONTHLY * 0.40);  // ₹1.11L
const BANK_MAX_EMI_50 = Math.round(GROSS_MONTHLY * 0.50);  // ₹1.39L

// Comfortable loan (40% of take-home)
const COMFORTABLE_LOAN_20YR = Math.round(MAX_EMI_40 / 0.008826);  // ~₹97L
const COMFORTABLE_LOAN_25YR = Math.round(MAX_EMI_40 / 0.008219);  // ~₹1.04 Cr

// Bank max sanction range
const BANK_LOAN_CONSERVATIVE = Math.round(BANK_MAX_EMI_40 / 0.008826); // ~₹1.26 Cr
const BANK_LOAN_LIBERAL = Math.round(BANK_MAX_EMI_50 / 0.008826);       // ~₹1.57 Cr

// Property ceiling at 80% LTV
const COMFORTABLE_PROPERTY = Math.round(COMFORTABLE_LOAN_20YR / 0.80);
const BANK_MAX_PROPERTY = Math.round(BANK_LOAN_LIBERAL / 0.80);

// Target property
const TARGET = 3_00_00_000;
const LOAN_FOR_TARGET_80 = TARGET * 0.80;   // ₹2 Cr loan
const LOAN_FOR_TARGET_60 = TARGET * 0.60;   // ₹1.5 Cr loan
const EMI_TARGET_80_20YR = calcEMI(LOAN_FOR_TARGET_80, RATE, 20);
const EMI_TARGET_60_20YR = calcEMI(LOAN_FOR_TARGET_60, RATE, 20);

// ── scenario selector ──────────────────────────────────────────────────────

type Scenario = 'comfortable' | 'stretch' | 'max';

export default function PersonalBudgetProfile() {
  const [scenario, setScenario] = useCanvasState<Scenario>('scenario', 'comfortable');
  const [tenure, setTenure] = useCanvasState<number>('tenure2', 20);

  const scenarioData = {
    comfortable: {
      label: 'Comfortable',
      description: 'EMI ≤ 40% of take-home. Leaves room for savings, emergencies, lifestyle.',
      loanAmount: COMFORTABLE_LOAN_20YR,
      propertyPrice: COMFORTABLE_PROPERTY,
      emi: calcEMI(COMFORTABLE_LOAN_20YR, RATE, tenure),
      emiPct: Math.round((calcEMI(COMFORTABLE_LOAN_20YR, RATE, tenure) / MONTHLY_TAKE_HOME) * 100),
      downPayment: Math.round(COMFORTABLE_PROPERTY * 0.20),
      stampReg: Math.round(COMFORTABLE_PROPERTY * 0.065),
      tone: 'success' as const,
      verdict: 'Sustainable. Plenty of breathing room.',
    },
    stretch: {
      label: 'Stretch',
      description: 'EMI = 50% of take-home. Tight but manageable if expenses are disciplined.',
      loanAmount: COMFORTABLE_LOAN_25YR,
      propertyPrice: Math.round(COMFORTABLE_LOAN_25YR / 0.80),
      emi: calcEMI(COMFORTABLE_LOAN_25YR, RATE, tenure),
      emiPct: Math.round((calcEMI(COMFORTABLE_LOAN_25YR, RATE, tenure) / MONTHLY_TAKE_HOME) * 100),
      downPayment: Math.round((COMFORTABLE_LOAN_25YR / 0.80) * 0.20),
      stampReg: Math.round((COMFORTABLE_LOAN_25YR / 0.80) * 0.065),
      tone: 'warning' as const,
      verdict: 'Possible. Requires strict budget discipline.',
    },
    max: {
      label: 'Bank Maximum',
      description: 'Up to bank FOIR limit. EMI ~64% of take-home — leaves very little.',
      loanAmount: BANK_LOAN_LIBERAL,
      propertyPrice: BANK_MAX_PROPERTY,
      emi: calcEMI(BANK_LOAN_LIBERAL, RATE, tenure),
      emiPct: Math.round((calcEMI(BANK_LOAN_LIBERAL, RATE, tenure) / MONTHLY_TAKE_HOME) * 100),
      downPayment: Math.round(BANK_MAX_PROPERTY * 0.20),
      stampReg: Math.round(BANK_MAX_PROPERTY * 0.065),
      tone: 'danger' as const,
      verdict: 'Risky. One income shock can default the loan.',
    },
  };

  const s = scenarioData[scenario];
  const emi = s.emi;
  const totalPaid = emi * tenure * 12;
  const totalInterest = totalPaid - s.loanAmount;
  const liquidCashNeeded = s.downPayment + s.stampReg + 75_000 + 30_000; // DP + stamp/reg + legal + loan fees

  // ── gap to ₹3 Cr ────────────────────────────────────────────────────
  const gapToTarget = TARGET - s.propertyPrice;
  const extraLoanNeeded = LOAN_FOR_TARGET_80 - s.loanAmount;
  const extraDownNeeded = Math.max(0, TARGET - s.loanAmount) - s.downPayment;

  return (
    <Stack gap={28} style={{ padding: '24px 28px', maxWidth: 940 }}>

      {/* ── header ── */}
      <Stack gap={4}>
        <H1>Your Personal Budget Profile</H1>
        <Text tone="secondary">CTC ₹35L/year — Bangalore property purchase analysis</Text>
      </Stack>

      {/* ── income snapshot ── */}
      <Stack gap={12}>
        <H2>Your Income Snapshot (New Tax Regime, FY 2025-26)</H2>
        <Grid columns={4} gap={14}>
          <Stat value="₹35L" label="Annual CTC" />
          <Stat value={fmtINR(MONTHLY_TAKE_HOME)} label="Est. Monthly Take-Home" tone="info" />
          <Stat value={fmtINR(MAX_EMI_40)} label="Max EMI (40% rule)" tone="warning" />
          <Stat value={inL(COMFORTABLE_LOAN_20YR)} label="Comfortable Loan (20yr)" tone="success" />
        </Grid>

        <Table
          headers={['Income Component', 'Annual', 'Monthly', 'Notes']}
          rows={[
            ['CTC (Gross)', '₹35,00,000', '₹2,91,667', 'Your total compensation package'],
            ['Less: Employer PF (12% of basic)', '−₹1,68,000', '−₹14,000', 'Goes to PF; part of CTC but not in hand'],
            ['Gross Salary (in payslip)', '₹33,32,000', '₹2,77,667', 'What appears before deductions'],
            ['Less: Employee PF', '−₹1,68,000', '−₹14,000', 'Your contribution to EPF (yours, not lost)'],
            ['Less: Income Tax (est.)', '−₹5,79,384', '−₹48,282', 'New regime, ₹32.57L taxable (incl. std. dedn.)'],
            ['Net Take-Home', '₹25,84,616', fmtINR(MONTHLY_TAKE_HOME), 'Actual money in bank each month'],
          ]}
          rowTone={[undefined, undefined, undefined, undefined, 'warning', 'success']}
          striped
          columnAlign={['left', 'right', 'right', 'left']}
        />
        <Text size="small" tone="secondary">
          Tax estimate uses new regime (2025-26). If you use old regime with HRA + 80C, take-home could be ₹10-15K higher/month. Check with your payslip for exact figures.
        </Text>
      </Stack>

      <Divider />

      {/* ── loan eligibility ── */}
      <Stack gap={12}>
        <H2>Loan Eligibility at a Glance</H2>

        <Grid columns={3} gap={14}>
          <Card>
            <CardHeader trailing={<Pill tone="success" size="sm">Recommended</Pill>}>
              Comfortable Zone
            </CardHeader>
            <CardBody>
              <Stack gap={8}>
                <Stat value={inL(COMFORTABLE_LOAN_20YR)} label="Max Loan (20yr)" tone="success" />
                <Text size="small">EMI ≤ 40% of take-home (₹{MAX_EMI_40.toLocaleString('en-IN')}/mo). Property ceiling: <Text weight="semibold" as="span">{inL(COMFORTABLE_PROPERTY)}</Text></Text>
              </Stack>
            </CardBody>
          </Card>

          <Card>
            <CardHeader trailing={<Pill tone="warning" size="sm">Caution</Pill>}>
              Bank Conservative Sanction
            </CardHeader>
            <CardBody>
              <Stack gap={8}>
                <Stat value={inL(BANK_LOAN_CONSERVATIVE)} label="Likely Loan Sanction" tone="warning" />
                <Text size="small">Bank uses 40% FOIR on gross (₹{GROSS_MONTHLY.toLocaleString('en-IN')}/mo). EMI would be ~{Math.round(calcEMI(BANK_LOAN_CONSERVATIVE, RATE, 20) / MONTHLY_TAKE_HOME * 100)}% of take-home.</Text>
              </Stack>
            </CardBody>
          </Card>

          <Card>
            <CardHeader trailing={<Pill tone="neutral" size="sm">Risk Zone</Pill>}>
              Bank Max Sanction
            </CardHeader>
            <CardBody>
              <Stack gap={8}>
                <Stat value={inL(BANK_LOAN_LIBERAL)} label="Max Possible Loan" tone="danger" />
                <Text size="small">Bank 50% FOIR on gross. EMI would be ~{Math.round(calcEMI(BANK_LOAN_LIBERAL, RATE, 20) / MONTHLY_TAKE_HOME * 100)}% of take-home — very tight.</Text>
              </Stack>
            </CardBody>
          </Card>
        </Grid>
      </Stack>

      <Divider />

      {/* ── scenario explorer ── */}
      <Stack gap={14}>
        <Row gap={8} align="center">
          <H2>Scenario Explorer</H2>
          <Row gap={6}>
            {(['comfortable', 'stretch', 'max'] as Scenario[]).map(sc => (
              <Pill
                key={sc}
                active={scenario === sc}
                tone={scenarioData[sc].tone === 'danger' ? 'neutral' : scenarioData[sc].tone === 'warning' ? 'warning' : 'success'}
                onClick={() => setScenario(sc)}
              >
                {scenarioData[sc].label}
              </Pill>
            ))}
          </Row>
          <Row gap={6} style={{ marginLeft: 16 }}>
            {[15, 20, 25, 30].map(yr => (
              <Pill key={yr} active={tenure === yr} onClick={() => setTenure(yr)}>
                {yr}yr
              </Pill>
            ))}
          </Row>
        </Row>

        <Text tone="secondary" size="small">{s.description}</Text>

        <Grid columns={4} gap={14}>
          <Stat value={inL(s.propertyPrice)} label="Max Property Price" tone={s.tone} />
          <Stat value={fmtINR(emi)} label={`Monthly EMI (${tenure}yr)`} tone={s.emiPct > 50 ? 'danger' : s.emiPct > 40 ? 'warning' : undefined} />
          <Stat value={`${s.emiPct}%`} label="of Take-Home" tone={s.emiPct > 50 ? 'danger' : s.emiPct > 40 ? 'warning' : 'success'} />
          <Stat value={inL(liquidCashNeeded)} label="Liquid Cash Needed" tone="warning" />
        </Grid>

        <Card>
          <CardHeader trailing={<Pill tone={s.tone === 'danger' ? 'neutral' : s.tone} size="sm">{s.verdict}</Pill>}>
            {s.label} Scenario — Full Breakdown
          </CardHeader>
          <CardBody>
            <Table
              headers={['Item', 'Amount', 'Note']}
              rows={[
                ['Max Loan Amount', inL(s.loanAmount), 'What bank will sanction in this scenario'],
                [`Monthly EMI (${tenure} yr @ ${RATE}%)`, fmtINR(emi), `${s.emiPct}% of your ₹${MONTHLY_TAKE_HOME.toLocaleString('en-IN')}/mo take-home`],
                ['Total Interest Paid', inL(totalInterest), `${(totalInterest / s.loanAmount * 100).toFixed(0)}% of principal — the real cost`],
                ['Total Amount Paid', inL(totalPaid), `Over ${tenure} years`],
                ['Property Price Ceiling', inL(s.propertyPrice), '80% funded by loan'],
                ['Down Payment (20%)', inL(s.downPayment), 'Needs to be liquid, upfront'],
                ['Stamp Duty + Registration (6.5%)', inL(s.stampReg), 'Cash only, non-negotiable'],
                ['Legal + Loan Processing', '~₹1.05L', 'One-time'],
                ['TOTAL LIQUID CASH NEEDED', inL(liquidCashNeeded), 'Before interiors / emergency fund'],
              ]}
              rowTone={[undefined, s.emiPct > 50 ? 'danger' : s.emiPct > 40 ? 'warning' : undefined, 'danger', undefined, undefined, undefined, 'warning', undefined, 'info']}
              striped
            />
          </CardBody>
        </Card>
      </Stack>

      <Divider />

      {/* ── the ₹3 Cr gap analysis ── */}
      <Stack gap={12}>
        <H2>The ₹3 Cr Gap — Honest Reality Check</H2>
        <Text tone="secondary" size="small">
          What it actually takes to buy a ₹3 Cr property on your current salary.
        </Text>

        <Grid columns={2} gap={14}>
          <Card>
            <CardHeader trailing={<Pill tone="neutral" size="sm">If 80% loan</Pill>}>
              ₹2 Cr Loan Scenario
            </CardHeader>
            <CardBody>
              <Stack gap={10}>
                <Grid columns={2} gap={10}>
                  <Stat value={fmtINR(EMI_TARGET_80_20YR)} label="Monthly EMI (20yr)" tone="danger" />
                  <Stat value={`${Math.round(EMI_TARGET_80_20YR / MONTHLY_TAKE_HOME * 100)}%`} label="of Take-Home" tone="danger" />
                </Grid>
                <Text size="small">Down payment: ₹50L + Stamp/Reg: ₹16.25L = <Text weight="semibold" as="span">₹66.25L cash needed</Text></Text>
                <Text size="small" tone="secondary">EMI {Math.round(EMI_TARGET_80_20YR / MONTHLY_TAKE_HOME * 100)}% of take-home is unsustainable. Bank likely won't sanction ₹2 Cr on ₹35L salary.</Text>
              </Stack>
            </CardBody>
          </Card>

          <Card>
            <CardHeader trailing={<Pill tone="warning" size="sm">If 60% loan</Pill>}>
              ₹1.5 Cr Loan Scenario (40% down)
            </CardHeader>
            <CardBody>
              <Stack gap={10}>
                <Grid columns={2} gap={10}>
                  <Stat value={fmtINR(EMI_TARGET_60_20YR)} label="Monthly EMI (20yr)" tone="warning" />
                  <Stat value={`${Math.round(EMI_TARGET_60_20YR / MONTHLY_TAKE_HOME * 100)}%`} label="of Take-Home" tone="warning" />
                </Grid>
                <Text size="small">Down payment: ₹1 Cr + Stamp/Reg: ₹16.25L = <Text weight="semibold" as="span">₹1.16 Cr cash needed</Text></Text>
                <Text size="small" tone="secondary">Requires ~₹1.16 Cr in liquid savings. EMI is still 62% of take-home — very tight.</Text>
              </Stack>
            </CardBody>
          </Card>
        </Grid>

        <Table
          headers={['Scenario', 'Loan Amount', 'Monthly EMI', '% Take-Home', 'Cash Needed Upfront', 'Verdict']}
          rows={[
            ['Comfortable (solo)', inL(COMFORTABLE_LOAN_20YR), fmtINR(calcEMI(COMFORTABLE_LOAN_20YR, RATE, 20)), `${Math.round(calcEMI(COMFORTABLE_LOAN_20YR, RATE, 20) / MONTHLY_TAKE_HOME * 100)}%`, inL(COMFORTABLE_PROPERTY * 0.265), 'Sustainable'],
            ['Max solo (bank limit)', inL(BANK_LOAN_LIBERAL), fmtINR(calcEMI(BANK_LOAN_LIBERAL, RATE, 20)), `${Math.round(calcEMI(BANK_LOAN_LIBERAL, RATE, 20) / MONTHLY_TAKE_HOME * 100)}%`, inL(BANK_MAX_PROPERTY * 0.265), 'Tight — some risk'],
            ['3 Cr @ 80% loan', '₹2.4 Cr', fmtINR(EMI_TARGET_80_20YR), `${Math.round(EMI_TARGET_80_20YR / MONTHLY_TAKE_HOME * 100)}%`, '~₹79.5L', 'Not advisable solo'],
            ['3 Cr @ 60% loan', '₹1.8 Cr', fmtINR(EMI_TARGET_60_20YR), `${Math.round(EMI_TARGET_60_20YR / MONTHLY_TAKE_HOME * 100)}%`, '~₹1.4 Cr', 'Needs large corpus'],
          ]}
          rowTone={['success', 'warning', 'danger', 'warning']}
          columnAlign={['left', 'right', 'right', 'right', 'right', 'left']}
        />
      </Stack>

      <Divider />

      {/* ── paths to 3 Cr ── */}
      <Stack gap={12}>
        <H2>Paths to ₹3 Cr — How to Get There</H2>

        <Grid columns={2} gap={14}>
          <Card>
            <CardHeader trailing={<Pill tone="success" size="sm">Most Practical</Pill>}>
              Path A: Co-applicant (Spouse / Family)
            </CardHeader>
            <CardBody>
              <Stack gap={6}>
                <Text size="small">Adding a co-applicant with ₹20-25L income raises combined loan eligibility to ₹1.8-2.2 Cr. Property ceiling jumps to ₹2.25-2.75 Cr.</Text>
                <Text size="small" tone="secondary">Combined take-home ≈ ₹3.5-3.8L/mo. EMI on ₹1.8 Cr loan = ₹1.59L/mo = 42-45% of combined — manageable.</Text>
                <Table
                  headers={['Combined Income', 'Loan Eligibility', 'Property Ceiling']}
                  rows={[
                    ['₹35L + ₹20L = ₹55L', '~₹1.65 Cr', '~₹2.06 Cr'],
                    ['₹35L + ₹25L = ₹60L', '~₹1.8 Cr', '~₹2.25 Cr'],
                    ['₹35L + ₹30L = ₹65L', '~₹2.0 Cr', '~₹3 Cr'],
                  ]}
                  rowTone={[undefined, undefined, 'success']}
                />
              </Stack>
            </CardBody>
          </Card>

          <Card>
            <CardHeader trailing={<Pill tone="warning" size="sm">Needs time</Pill>}>
              Path B: Large Down Payment from Savings
            </CardHeader>
            <CardBody>
              <Stack gap={6}>
                <Text size="small">Reduce the loan burden with existing savings/investments. The more you put down, the lower the EMI strain.</Text>
                <Table
                  headers={['Your Savings', 'Loan Needed', 'EMI (20yr)', '% Take-Home']}
                  rows={[
                    ['₹50L', '₹2.0 Cr', fmtINR(calcEMI(20_000_000, RATE, 20)), `${Math.round(calcEMI(20_000_000, RATE, 20) / MONTHLY_TAKE_HOME * 100)}%`],
                    ['₹75L', '₹1.75 Cr', fmtINR(calcEMI(17_500_000, RATE, 20)), `${Math.round(calcEMI(17_500_000, RATE, 20) / MONTHLY_TAKE_HOME * 100)}%`],
                    ['₹1.0 Cr', '₹1.5 Cr', fmtINR(calcEMI(15_000_000, RATE, 20)), `${Math.round(calcEMI(15_000_000, RATE, 20) / MONTHLY_TAKE_HOME * 100)}%`],
                    ['₹1.3 Cr', '₹1.2 Cr', fmtINR(calcEMI(12_000_000, RATE, 20)), `${Math.round(calcEMI(12_000_000, RATE, 20) / MONTHLY_TAKE_HOME * 100)}%`],
                  ]}
                  rowTone={['danger', 'danger', 'warning', 'success']}
                />
                <Text size="small" tone="secondary">Need ₹2 Cr+ in savings to make ₹3 Cr comfortable. You have ₹2.5 Cr — this is achievable.</Text>
              </Stack>
            </CardBody>
          </Card>

          <Card>
            <CardHeader trailing={<Pill tone="info" size="sm">2–3 years</Pill>}>
              Path C: Wait, Save Aggressively & Revisit
            </CardHeader>
            <CardBody>
              <Stack gap={6}>
                <Text size="small">Save ₹60-80K/month aggressively for 2-3 years. Also likely to get salary increments. Both sides of the equation improve.</Text>
                <Table
                  headers={['Savings/mo', '2 yr corpus', '3 yr corpus', 'Property range']}
                  rows={[
                    ['₹60K', '₹14.4L', '₹21.6L', '₹1.5-1.7 Cr'],
                    ['₹75K', '₹18L', '₹27L', '₹1.7-2.0 Cr'],
                    ['₹90K', '₹21.6L', '₹32.4L', '₹1.9-2.2 Cr'],
                  ]}
                />
                <Text size="small" tone="secondary">At 40L+ salary in 2 years + larger corpus, the ₹3 Cr target becomes more comfortable.</Text>
              </Stack>
            </CardBody>
          </Card>

          <Card>
            <CardHeader trailing={<Pill tone="success" size="sm">Best value</Pill>}>
              Path D: Target ₹1.4–1.7 Cr Now (Recommended)
            </CardHeader>
            <CardBody>
              <Stack gap={6}>
                <Text size="small">Your current salary comfortably supports a ₹1.4-1.7 Cr property. You can still get a <Text weight="semibold" as="span">3 BHK in Kanakapura, Electronic City, Thanisandra or Yelahanka</Text> in this range.</Text>
                <Table
                  headers={['Property at ₹1.5 Cr', 'Detail']}
                  rows={[
                    ['Loan (80%)', '₹1.2 Cr'],
                    ['Down payment', '₹30L'],
                    ['Stamp + Reg', '₹9.75L'],
                    ['Cash needed', '~₹40L'],
                    ['EMI (20yr)', fmtINR(calcEMI(12_000_000, RATE, 20))],
                    ['% of take-home', `${Math.round(calcEMI(12_000_000, RATE, 20) / MONTHLY_TAKE_HOME * 100)}%`],
                  ]}
                  rowTone={[undefined, undefined, undefined, 'success', undefined, 'success']}
                />
              </Stack>
            </CardBody>
          </Card>
        </Grid>
      </Stack>

      <Divider />

      {/* ── verdict ── */}
      <Stack gap={12}>
        <H2>Recommended Approach for You</H2>

        <Table
          headers={['Question', 'Your Situation', 'Implication']}
          rows={[
            ['Do you have a co-applicant?', 'Unknown — key variable', 'If YES with ₹25L+ income → ₹3 Cr becomes comfortable with a larger loan'],
            ['Liquid savings available?', 'Unknown — key variable', 'If you have ₹60-80L saved → can do ₹1.8-2 Cr property'],
            ['How soon do you need to buy?', 'Unknown', 'Waiting 18-24 months + salary growth changes the math'],
            ['Own-use vs investment?', 'Unknown', 'For investment, rental yield on ₹1.5 Cr is better proportionally'],
            ['Current rent vs EMI?', 'Unknown', 'If renting ₹25K, EMI on ₹1.2 Cr loan = ₹1.06L — big jump'],
          ]}
          striped
        />

        <Card>
          <CardHeader>Bottom Line</CardHeader>
          <CardBody>
            <Stack gap={8}>
              <Text>On a solo ₹35L CTC, your <Text weight="semibold" as="span">comfortable property range is ₹1.2–1.7 Cr.</Text> The ₹3 Cr budget requires your ₹2.5 Cr savings to bridge the gap between salary-based borrowing and the purchase price.</Text>
              <Text>To make ₹3 Cr work: take a <Text weight="semibold" as="span">₹1 Cr loan (bank-sanctioned on salary) + deploy ₹2 Cr from savings as down payment</Text>. EMI ~₹88K/mo = 41% of take-home — tight but manageable.</Text>
              <Text tone="secondary" size="small">With a co-applicant (parent with ₹50K+/mo pension/income), the bank will sanction ₹1.5–1.8 Cr — allowing you to keep more savings invested. See the purchase strategy canvas for full trade-off analysis.</Text>
            </Stack>
          </CardBody>
        </Card>
      </Stack>

    </Stack>
  );
}
