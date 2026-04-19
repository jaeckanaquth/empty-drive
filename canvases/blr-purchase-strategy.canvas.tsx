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
  if (principal <= 0) return 0;
  return Math.round(principal * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1));
}

function inL(val: number, d = 1): string {
  if (Math.abs(val) >= 10_000_000) return `₹${(val / 10_000_000).toFixed(d)} Cr`;
  return `₹${(val / 100_000).toFixed(d)}L`;
}

function fmtINR(val: number): string {
  return '₹' + Math.round(val).toLocaleString('en-IN');
}

function futureValue(principal: number, annualReturn: number, years: number): number {
  if (principal <= 0) return 0;
  return principal * Math.pow(1 + annualReturn / 100, years);
}

const RATE = 8.75;
const PROPERTY = 3_00_00_000;
const SAVINGS = 2_50_00_000;
const MONTHLY_TAKE_HOME = 2_15_000;
const CHARGES_PCT = 0.065; // stamp duty 5% + reg 1% + legal 0.5%

// ── purchase strategies ───────────────────────────────────────────────────

type Strategy = 'comfy' | 'stretch' | 'coApp';

const strategies: Record<Strategy, {
  label: string;
  downPct: number;
  description: string;
  tone: 'success' | 'warning' | 'info' | 'danger';
}> = {
  comfy: {
    label: 'Income-Safe (67% down)',
    downPct: 67,
    description: 'Deploy ~₹2 Cr from savings as down payment, take max bank-sanctionable loan (~₹1 Cr based on salary). EMI ~₹88K/mo = 41% of take-home. Tight but feasible.',
    tone: 'success',
  },
  stretch: {
    label: 'Stretch (50% down)',
    downPct: 50,
    description: '₹1.5 Cr down + ₹1.5 Cr loan. EMI ~₹1.33L/mo = 62% of take-home. Feasible only if your salary grows 15–20% in the next 1–2 years. Keeps ₹1 Cr invested.',
    tone: 'warning',
  },
  coApp: {
    label: 'With Co-Applicant Income (40% down)',
    downPct: 40,
    description: '₹1.2 Cr down + ₹1.8 Cr loan. Requires co-applicant (parent) with ₹60K+/mo income to qualify. EMI ~₹1.59L/mo combined. Largest savings corpus retained.',
    tone: 'info',
  },
};

const INVESTMENT_RETURN = 12;
const LOAN_RATE = RATE;
const TAX_BRACKET = 0.30;
const TENURE = 20;

function calcStrategy(s: typeof strategies[Strategy], dpPct: number) {
  const downPayment = Math.round(PROPERTY * dpPct / 100);
  const loanAmount = PROPERTY - downPayment;
  const charges = Math.round(PROPERTY * CHARGES_PCT);
  const totalFromSavings = downPayment + charges;
  const savingsInvested = Math.max(0, SAVINGS - totalFromSavings);

  const emi = calcEMI(loanAmount, LOAN_RATE, TENURE);
  const emiPct = Math.round(emi / MONTHLY_TAKE_HOME * 100);

  const totalEmiPaid = emi * TENURE * 12;
  const totalInterest = totalEmiPaid - loanAmount;

  const annualInterestYear1 = loanAmount * LOAN_RATE / 100;
  const interestDeduction = Math.min(annualInterestYear1, 200_000);
  const principalDeduction = Math.min(emi * 12 - annualInterestYear1, 150_000);
  const annualTaxSaving = Math.round((interestDeduction + principalDeduction) * TAX_BRACKET);
  const totalTaxSaving = annualTaxSaving * Math.min(TENURE, 20);

  const investedCorpus10yr = Math.round(futureValue(savingsInvested, INVESTMENT_RETURN, 10));
  const investedCorpus20yr = Math.round(futureValue(savingsInvested, INVESTMENT_RETURN, 20));
  const effectiveLoanCost = Math.max(0, totalInterest - totalTaxSaving);

  return {
    downPayment,
    loanAmount,
    charges,
    totalFromSavings,
    savingsInvested,
    emi,
    emiPct,
    totalInterest,
    annualTaxSaving,
    investedCorpus10yr,
    investedCorpus20yr,
    effectiveLoanCost,
  };
}

export default function PurchaseStrategy() {
  const [activeStrategy, setActiveStrategy] = useCanvasState<Strategy>('strategy', 'comfy');

  const s = strategies[activeStrategy];
  const calc = calcStrategy(s, s.downPct);

  const years = ['1yr', '2yr', '3yr', '5yr', '7yr', '10yr', '15yr', '20yr'];
  const yearNums = [1, 2, 3, 5, 7, 10, 15, 20];

  const corpusComfy = yearNums.map(y => Math.round(futureValue(calcStrategy(strategies.comfy, 67).savingsInvested, 12, y) / 100_000));
  const corpusStretch = yearNums.map(y => Math.round(futureValue(calcStrategy(strategies.stretch, 50).savingsInvested, 12, y) / 100_000));
  const corpusCoApp = yearNums.map(y => Math.round(futureValue(calcStrategy(strategies.coApp, 40).savingsInvested, 12, y) / 100_000));

  return (
    <Stack gap={28} style={{ padding: '24px 28px', maxWidth: 940 }}>

      <Stack gap={4}>
        <H1>Purchase Strategy — ₹3 Cr Property</H1>
        <Text tone="secondary">Savings ₹2.5 Cr · CTC ₹35L/yr · Target property ₹3 Cr · All-in ~₹3.2 Cr · Geography: north BLR micro-markets (see area-selection canvas)</Text>
      </Stack>

      <Grid columns={4} gap={14}>
        <Stat value="₹2.5 Cr" label="Liquid Savings" tone="success" />
        <Stat value="₹3 Cr" label="Property Target" tone="warning" />
        <Stat value="~₹1 Cr" label="Max Salary-Based Loan" tone="warning" />
        <Stat value="₹19.5L" label="Charges (Stamp + Reg)" tone="danger" />
      </Grid>

      <Card>
        <CardHeader trailing={<Pill tone="warning" size="sm">Key Constraint</Pill>}>
          The ₹3 Cr Reality Check — Savings Fund It, Income Limits the Loan
        </CardHeader>
        <CardBody>
          <Stack gap={8}>
            <Text size="small">
              At ₹3 Cr, the property + charges = <strong>₹3.2 Cr total outgo</strong>. Your ₹2.5 Cr savings cover most of it — but the gap requires a home loan. The problem: your ₹35L CTC allows a bank to sanction only ~₹95L–₹1 Cr loan (EMI ≤ 40% of ₹2.15L take-home = ₹86K max EMI).
            </Text>
            <Grid columns={3} gap={12}>
              {[
                ['Total needed (property + charges)', `₹${(PROPERTY * (1 + CHARGES_PCT) / 10_000_000).toFixed(2)} Cr`, 'warning'],
                ['Your savings', '₹2.5 Cr', 'success'],
                ['Minimum loan required', `₹${((PROPERTY * (1 + CHARGES_PCT) - SAVINGS) / 100_000).toFixed(0)}L`, 'warning'],
              ].map(([label, val, tone]) => (
                <Stack key={label} gap={3}>
                  <Text size="small" tone="secondary">{label}</Text>
                  <Text size="small" weight="semibold">{val}</Text>
                </Stack>
              ))}
            </Grid>
            <Text size="small" tone="secondary">
              Unlike the ₹2.5 Cr scenario where you could go all-cash, at ₹3 Cr you <strong>must</strong> take a loan and the EMI will be a meaningful portion of your income. The optimal strategy depends on whether you want to preserve invested savings or minimise EMI stress.
            </Text>
          </Stack>
        </CardBody>
      </Card>

      <Divider />

      {/* ── bank loan eligibility ── */}
      <Stack gap={12}>
        <H2>What Bank Will Sanction — Salary-Based Eligibility</H2>
        <Table
          headers={['EMI % of Income', 'Max Monthly EMI', 'Max Loan (20yr @ 8.75%)', 'Enough for?']}
          rows={[
            ['30% (conservative)', '₹64,500', '₹73L', 'Not enough for ₹3 Cr gap'],
            ['40% (standard limit)', '₹86,000', '₹97L ≈ ₹1 Cr', 'Covers gap if 67% down payment'],
            ['50% (some banks allow)', '₹1,07,500', '₹1.22 Cr', 'Covers gap if 59% down payment'],
            ['With co-applicant adding ₹60K income', 'Up to ₹1,10,000', '₹1.25 Cr+', 'Covers gap with 58% down payment'],
          ]}
          rowTone={['warning', 'success', 'warning', 'info']}
          columnAlign={['left', 'right', 'right', 'left']}
          striped
        />
        <Text size="small" tone="secondary">
          Key insight: without a co-applicant with active income, the bank will not sanction more than ~₹1 Cr. If your parent has a pension of ₹50K+/mo or any income, adding them as co-borrower significantly expands eligibility.
        </Text>
      </Stack>

      <Divider />

      {/* ── strategy selector ── */}
      <Stack gap={14}>
        <Row gap={8} align="center" wrap>
          <H2>Pick Your Strategy</H2>
          <Row gap={6}>
            {(Object.entries(strategies) as [Strategy, typeof strategies[Strategy]][]).map(([key, val]) => (
              <Pill
                key={key}
                active={activeStrategy === key}
                tone={val.tone === 'success' ? 'success' : val.tone === 'info' ? undefined : 'warning'}
                onClick={() => setActiveStrategy(key)}
              >
                {val.label}
              </Pill>
            ))}
          </Row>
        </Row>

        <Text tone="secondary" size="small">{s.description}</Text>

        <Grid columns={4} gap={14}>
          <Stat value={inL(calc.downPayment)} label="Down Payment" />
          <Stat value={inL(calc.loanAmount)} label="Loan Needed" tone="warning" />
          <Stat value={fmtINR(calc.emi)} label={`EMI (${TENURE}yr)`} tone={calc.emiPct > 60 ? 'danger' : calc.emiPct > 40 ? 'warning' : undefined} />
          <Stat value={`${calc.emiPct}% of take-home`} label="EMI Burden" tone={calc.emiPct > 60 ? 'danger' : calc.emiPct > 40 ? 'warning' : 'success'} />
        </Grid>

        <Grid columns={2} gap={14}>
          <Card>
            <CardHeader>Cash Flow Breakdown</CardHeader>
            <CardBody>
              <Table
                headers={['Item', 'Amount', 'Note']}
                rows={[
                  ['Property price', inL(PROPERTY), '—'],
                  ['Stamp duty + Registration (6.5%)', inL(calc.charges), 'Paid upfront from savings'],
                  ['Down payment from savings', inL(calc.downPayment), `${s.downPct}% of property`],
                  ['Total from savings', inL(calc.totalFromSavings), `Down payment + charges`],
                  ['Savings remaining (to invest)', inL(calc.savingsInvested), calc.savingsInvested <= 2_000_000 ? 'Low — consider implications' : 'Compounding at 12%'],
                  ['Home loan', inL(calc.loanAmount), `${100 - s.downPct}% funded by bank`],
                  ['Monthly EMI', fmtINR(calc.emi), `${calc.emiPct}% of ₹2.15L take-home`],
                ]}
                rowTone={[undefined, 'danger', undefined, 'warning', calc.savingsInvested < 2_000_000 ? 'warning' : 'success', 'warning', calc.emiPct > 60 ? 'danger' : calc.emiPct > 40 ? 'warning' : undefined]}
                striped
              />
            </CardBody>
          </Card>

          <Card>
            <CardHeader>Loan Cost vs Tax & Investment Return</CardHeader>
            <CardBody>
              <Table
                headers={['Item', 'Amount', 'Note']}
                rows={[
                  ['Total interest over 20yr', inL(calc.totalInterest), 'Gross borrowing cost'],
                  ['Annual tax saving (Sec 24b + 80C)', fmtINR(calc.annualTaxSaving), '@ 30% bracket'],
                  ['20yr total tax saving', inL(calc.annualTaxSaving * 20), 'Rough estimate'],
                  ['Effective net loan cost', inL(calc.effectiveLoanCost), 'After tax benefit'],
                  ['Savings corpus @ 10yr (12%)', inL(calc.investedCorpus10yr), 'If invested in equity MF'],
                  ['Savings corpus @ 20yr (12%)', inL(calc.investedCorpus20yr), 'Vs effective loan cost'],
                ]}
                rowTone={[undefined, 'success', 'success', undefined, 'info', 'info']}
                striped
              />
            </CardBody>
          </Card>
        </Grid>
      </Stack>

      <Divider />

      {/* ── opportunity cost chart ── */}
      <Stack gap={12}>
        <H2>Opportunity Cost — What Invested Savings Grow To</H2>
        <Text tone="secondary" size="small">
          Savings NOT deployed as down payment stay invested at assumed 12% CAGR. The more you borrow, the more you keep invested — but the higher your EMI burden.
        </Text>

        <LineChart
          categories={years}
          series={[
            { name: 'Stretch 50% down (₹1 Cr invested)', data: corpusStretch },
            { name: 'Co-App 40% down (₹1.3 Cr invested)', data: corpusCoApp },
            { name: 'Income-Safe 67% down (₹31L invested)', data: corpusComfy },
          ]}
          fill
          valueSuffix="L"
          height={260}
        />

        <Table
          headers={['Strategy', 'Down Payment', 'Savings Deployed (incl. charges)', 'Savings Invested', 'EMI', 'EMI %', '10yr Corpus']}
          rows={[
            [
              'Income-Safe 67%',
              inL(calcStrategy(strategies.comfy, 67).downPayment),
              inL(calcStrategy(strategies.comfy, 67).totalFromSavings),
              inL(calcStrategy(strategies.comfy, 67).savingsInvested),
              fmtINR(calcStrategy(strategies.comfy, 67).emi),
              `${calcStrategy(strategies.comfy, 67).emiPct}%`,
              inL(calcStrategy(strategies.comfy, 67).investedCorpus10yr),
            ],
            [
              'Stretch 50%',
              inL(calcStrategy(strategies.stretch, 50).downPayment),
              inL(calcStrategy(strategies.stretch, 50).totalFromSavings),
              inL(calcStrategy(strategies.stretch, 50).savingsInvested),
              fmtINR(calcStrategy(strategies.stretch, 50).emi),
              `${calcStrategy(strategies.stretch, 50).emiPct}%`,
              inL(calcStrategy(strategies.stretch, 50).investedCorpus10yr),
            ],
            [
              'Co-Applicant 40%',
              inL(calcStrategy(strategies.coApp, 40).downPayment),
              inL(calcStrategy(strategies.coApp, 40).totalFromSavings),
              inL(calcStrategy(strategies.coApp, 40).savingsInvested),
              fmtINR(calcStrategy(strategies.coApp, 40).emi),
              `${calcStrategy(strategies.coApp, 40).emiPct}%`,
              inL(calcStrategy(strategies.coApp, 40).investedCorpus10yr),
            ],
          ]}
          rowTone={['success', 'warning', 'info']}
          columnAlign={['left', 'right', 'right', 'right', 'right', 'right', 'right']}
          striped
        />
        <Text size="small" tone="secondary">
          At ₹3 Cr, the EMI-investment trade-off is more acute than at ₹2.5 Cr. The Income-Safe strategy is conservative but leaves little invested. The Stretch and Co-App strategies keep more invested but require either income growth or a co-borrower.
        </Text>
      </Stack>

      <Divider />

      {/* ── co-applicant section ── */}
      <Stack gap={12}>
        <H2>The Co-Applicant Question — Critical at ₹3 Cr</H2>
        <Grid columns={2} gap={14}>
          <Card>
            <CardHeader trailing={<Pill tone="success" size="sm">If parent has income</Pill>}>Why Co-Applicant Matters More at ₹3 Cr</CardHeader>
            <CardBody>
              <Stack gap={5}>
                {[
                  ['Bank eligibility boost', 'Adding a co-applicant with ₹50K–70K/mo income (pension, rent, or business) can boost loan sanction from ₹1 Cr to ₹1.5–1.8 Cr.'],
                  ['More savings stay invested', 'Larger loan = smaller down payment = more corpus compounding at 12%.'],
                  ['Stamp duty benefit (if woman co-owner)', 'Karnataka offers 1–2% lower stamp duty if woman is first applicant. Saves ₹30–60K on a ₹3 Cr property.'],
                  ['Joint ownership for inheritance', 'Property titled jointly = cleaner succession. No need for separate will for this asset.'],
                ].map(([title, desc]) => (
                  <Stack key={title} gap={2}>
                    <Text size="small" weight="semibold">{title}</Text>
                    <Text size="small" tone="secondary">{desc}</Text>
                  </Stack>
                ))}
              </Stack>
            </CardBody>
          </Card>

          <Card>
            <CardHeader trailing={<Pill tone="warning" size="sm">Hard constraints</Pill>}>Bank Rules for Older Co-Applicants</CardHeader>
            <CardBody>
              <Stack gap={5}>
                {[
                  ['Age at loan maturity limit', 'Most banks cap co-applicant age at 70–75 at loan end. For 20yr loan ending ~2046, parent must be ≤ 50 today. If older, choose a 10–15yr tenure instead.'],
                  ['Income proof required', 'Retired parents with zero income add title security but don\'t help with loan eligibility.'],
                  ['Pension counts', 'Govt pension (EPF, EPFO, NPS) is accepted income by most banks. Private pension varies.'],
                  ['Practical option: shorter tenure', 'If parent is 60+ with pension, take a 10–12yr loan (higher EMI, but parent\'s income is usable within their working age window).'],
                ].map(([title, desc]) => (
                  <Stack key={title} gap={2}>
                    <Text size="small" weight="semibold">{title}</Text>
                    <Text size="small" tone="secondary">{desc}</Text>
                  </Stack>
                ))}
              </Stack>
            </CardBody>
          </Card>
        </Grid>
      </Stack>

      <Divider />

      {/* ── recommendation ── */}
      <Stack gap={12}>
        <H2>Recommendation for ₹3 Cr with ₹2.5 Cr Savings</H2>

        <Table
          headers={['Decision', 'Recommendation', 'Reason']}
          rows={[
            ['Can you buy ₹3 Cr today?', 'Yes — just', 'Savings nearly cover it; loan gap ~₹1 Cr is manageable'],
            ['Minimum down payment needed', '~₹2 Cr (67%)', 'Bank will sanction ~₹1 Cr based on ₹35L CTC at 40% FOIR'],
            ['Best structure (no co-app income)', 'Income-Safe: ₹2 Cr down + ₹1 Cr loan', 'EMI ₹88K/mo = 41% of take-home. Tight but doable.'],
            ['Best structure (co-app with income)', 'Co-App: ₹1.2 Cr down + ₹1.8 Cr loan', 'Larger loan keeps ₹1.3 Cr invested at 12%'],
            ['Emergency fund — do not skip', 'Ring-fence ₹20L before purchase', 'Do NOT deploy all ₹2.5 Cr. Keep ₹20L+ liquid.'],
            ['Loan tenure', '15–20yr depending on age', '20yr for max flexibility; prepay when salary grows'],
            ['Prepayment plan', 'Lump-sum prepay every 2–3 years', 'Year 3–5 salary growth → prepay principal → EMI burden drops'],
            ['Woman as first owner', 'Yes (if parent/mother is co-owner)', 'Saves ~1% stamp duty on ₹3 Cr = ₹3L saving'],
          ]}
          rowTone={['success', 'warning', 'success', 'info', 'danger', undefined, undefined, 'info']}
          striped
        />

        <Card>
          <CardHeader trailing={<Pill tone="success" size="sm">Bottom Line</Pill>}>
            The Optimal Play at ₹3 Cr
          </CardHeader>
          <CardBody>
            <Stack gap={8}>
              <Text size="small">
                <strong>Immediate path:</strong> Put ₹2 Cr as down payment, take ₹1 Cr loan at 8.75% for 20 years. EMI = ~₹88K/month (41% of take-home). Keep remaining ~₹30–35L in liquid funds as emergency + investment seed.
              </Text>
              <Text size="small">
                <strong>With co-applicant income:</strong> If your parent has ₹50K+/month verifiable income, take ₹1.5–1.8 Cr loan, keep ₹1–1.3 Cr invested in equity MF. At 12% CAGR, ₹1.3 Cr becomes ₹4 Cr in 10 years — this more than offsets the loan interest.
              </Text>
              <Text size="small" tone="secondary">
                <strong>vs ₹2.5 Cr scenario:</strong> At ₹2.5 Cr you had ₹1 Cr to keep invested and ₹1 Cr loan with EMI at 41%. At ₹3 Cr, nearly all savings go to the property and the loan EMI is identical — but nothing stays invested unless you use co-applicant income. The ₹2.5 Cr scenario was financially cleaner.
              </Text>
            </Stack>
          </CardBody>
        </Card>
      </Stack>

    </Stack>
  );
}
