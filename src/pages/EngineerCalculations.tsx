import { useState } from 'react'
import {
  Box, Grid, Text, VStack, HStack, Button, Input,
  Select, Tabs, TabList, Tab, TabPanels, TabPanel,
  Flex, FormControl, FormLabel, Divider,
  useColorModeValue,
} from '@chakra-ui/react'

const labelStyles = {
  fontSize: 'xs' as const, fontFamily: 'mono', color: 'text-muted',
  letterSpacing: '0.1em', textTransform: 'uppercase' as const,
}

function useInputStyles() {
  const isDark = useColorModeValue(false, true)
  return {
    bg: isDark ? 'stellar.bg' : '#F8FAFC',
    border: '1px solid', borderColor: isDark ? 'stellar.border' : 'gray.200',
    borderRadius: '2px', color: 'text-primary', fontSize: 'sm',
    _placeholder: { color: 'text-muted' },
    _focus: { borderColor: 'brand.500', boxShadow: '0 0 0 1px #C8963E' },
  }
}

interface ResultRow { label: string; value: string; highlight?: boolean }

function ResultCard({ title, rows, notes }: { title: string; rows: ResultRow[]; notes?: string[] }) {
  const bg   = useColorModeValue('gray.50', 'stellar.bg')
  const bdC  = useColorModeValue('gray.200', 'stellar.border')
  return (
    <Box mt={5} border="1px solid" borderColor="brand.700" bg="rgba(200,150,62,0.04)">
      <Box h="2px" bgGradient="linear(to-r, brand.700, brand.400)" />
      <Box p={5}>
        <Text fontFamily="mono" fontSize="xs" color="brand.500" letterSpacing="0.2em"
          textTransform="uppercase" mb={4}>{title}</Text>
        {rows.map(r => (
          <HStack key={r.label} justify="space-between" py={2.5}
            borderBottom="1px solid" borderColor={bdC}>
            <Text fontSize="sm" color={r.highlight ? 'text-primary' : 'text-muted'}
              fontWeight={r.highlight ? '700' : '400'}>{r.label}</Text>
            <Text fontSize="sm" fontFamily="mono" color={r.highlight ? 'brand.400' : 'text-light'}
              fontWeight={r.highlight ? '700' : '400'}>{r.value}</Text>
          </HStack>
        ))}
        {notes && (
          <Box mt={4} p={3} bg={bg} border="1px solid" borderColor={bdC}>
            <Text fontSize="xs" fontFamily="mono" color="brand.500" letterSpacing="0.1em" mb={2}>NOTES</Text>
            {notes.map((n, i) => (
              <Text key={i} fontSize="xs" color="text-muted" lineHeight="1.7">• {n}</Text>
            ))}
          </Box>
        )}
      </Box>
    </Box>
  )
}

// ── Beam Design ───────────────────────────────────────────────────────────────
function BeamDesign() {
  const iS = useInputStyles()
  const [f, setF] = useState({ span: '', dead: '', live: '', width: '', depth: '', fck: '25', fy: '460' })
  const [res, setRes] = useState<ResultRow[] | null>(null)
  const [notes, setNotes] = useState<string[]>([])
  const sf = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setF(p => ({ ...p, [k]: e.target.value }))

  const calculate = () => {
    const L    = +f.span;  const gk = +f.dead; const qk = +f.live
    const b    = +f.width; const h  = +f.depth
    const fck  = +f.fck;  const fy  = +f.fy

    if (!L || !gk || !qk || !b || !h) return

    // EC2 / BS8110 simplified
    const w_ult  = 1.35 * gk + 1.5 * qk           // kN/m
    const M_ult  = (w_ult * L * L) / 8             // kNm (simply supported)
    const d      = h - 50                           // effective depth mm (assume 50mm cover)
    const K      = (M_ult * 1e6) / (fck * b * d * d)
    const K_bal  = 0.167
    const z      = d * Math.min(0.5 + Math.sqrt(0.25 - K / 1.134), 0.95)
    const As_req = (M_ult * 1e6) / (0.87 * fy * z) // mm²

    // Minimum steel area
    const As_min = Math.max(0.26 * (fck ** 0.5 / fy) * b * d, 0.0013 * b * d)
    const As_prov = Math.max(As_req, As_min)

    // Suggest rebar
    const barSizes = [10, 12, 16, 20, 25, 32]
    let bestBar = 16, bestN = 4
    for (const dia of barSizes) {
      const area = Math.PI * dia * dia / 4
      const n = Math.ceil(As_prov / area)
      if (n >= 2 && n <= 8) { bestBar = dia; bestN = n; break }
    }
    const As_actual = bestN * Math.PI * bestBar * bestBar / 4

    setRes([
      { label: 'Design ULS Load (w)',   value: `${w_ult.toFixed(2)} kN/m` },
      { label: 'Max Bending Moment',    value: `${M_ult.toFixed(2)} kNm` },
      { label: 'K factor',              value: `${K.toFixed(4)} ${K > K_bal ? '⚠️ OVER!' : '✓'}` },
      { label: 'Lever Arm (z)',         value: `${z.toFixed(1)} mm` },
      { label: 'As Required',           value: `${As_req.toFixed(0)} mm²` },
      { label: 'As Minimum',            value: `${As_min.toFixed(0)} mm²` },
      { label: 'Suggested Rebar',       value: `${bestN}H${bestBar} (${As_actual.toFixed(0)} mm²)`, highlight: true },
    ])
    setNotes([
      K > K_bal ? '⚠️ K > 0.167 — section is over-reinforced. Increase depth.' : 'K < 0.167 — singly reinforced OK',
      'Check shear: V = w×L/2; v = V/(b×d); compare with vRd,c',
      'Deflection check: span/effective depth ≤ 26 (simply supported)',
      'Cover assumed 40mm (XC1 exposure). Adjust per actual conditions.',
    ])
  }

  return (
    <VStack spacing={4} align="stretch">
      <Text fontSize="sm" color="text-muted" lineHeight="1.8">
        Simply supported RC beam design to EC2 / BS8110. Calculates required tension steel area and suggests rebar arrangement.
      </Text>
      <Grid templateColumns={{ base: '1fr', md: 'repeat(2,1fr)' }} gap={4}>
        {[
          ['Span L (m)',         'span', '5.0'],
          ['Dead Load gk (kN/m)', 'dead', '10'],
          ['Live Load qk (kN/m)', 'live', '5'],
          ['Width b (mm)',        'width','250'],
          ['Total Depth h (mm)',  'depth','500'],
        ].map(([label, key, ph]) => (
          <FormControl key={key}>
            <FormLabel {...labelStyles}>{label}</FormLabel>
            <Input {...iS} placeholder={ph} value={(f as any)[key]} onChange={sf(key)} type="number" />
          </FormControl>
        ))}
        <FormControl>
          <FormLabel {...labelStyles}>Concrete Grade fck (MPa)</FormLabel>
          <Select {...iS} value={f.fck} onChange={sf('fck')}>
            {[20,25,30,35,40].map(v => <option key={v} value={v}>C{v}/{v+5}</option>)}
          </Select>
        </FormControl>
      </Grid>
      <Button variant="gold" onClick={calculate}>Design Beam</Button>
      {res && <ResultCard title="Beam Design Results" rows={res} notes={notes} />}
    </VStack>
  )
}

// ── Column Design ─────────────────────────────────────────────────────────────
function ColumnDesign() {
  const iS = useInputStyles()
  const [f, setF] = useState({ N: '', Mx: '', b: '300', h: '300', fck: '25', fy: '460', le: '' })
  const [res, setRes] = useState<ResultRow[] | null>(null)
  const sf = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setF(p => ({ ...p, [k]: e.target.value }))

  const calculate = () => {
    const N = +f.N; const b = +f.b; const h = +f.h; const fck = +f.fck; const fy = +f.fy
    if (!N || !b || !h) return

    const Ac   = b * h                                          // mm²
    const nRat = N * 1000 / (0.567 * fck * Ac)                 // axial ratio
    const As_min = Math.max(0.002 * Ac, 0.1 * N * 1000 / (0.87 * fy))
    const As_max = 0.04 * Ac

    // Slenderness
    const le = +f.le || 3000
    const lambda = (le * Math.sqrt(12)) / h
    const slender = lambda > 22 ? 'Slender — 2nd order effects required' : 'Short column — direct design OK'

    // Suggest bars
    const barAreas: Record<number,number> = { 12: 113, 16: 201, 20: 314, 25: 491, 32: 804 }
    let cfg = '4H16'
    for (const [dia, area] of Object.entries(barAreas)) {
      const n = Math.ceil(As_min / area)
      if (n <= 8) { cfg = `${n}H${dia}`; break }
    }

    setRes([
      { label: 'Gross Area Ac',     value: `${Ac.toLocaleString()} mm²` },
      { label: 'Axial Load Ratio',  value: `${(nRat * 100).toFixed(1)}%` },
      { label: 'As Minimum',        value: `${As_min.toFixed(0)} mm²` },
      { label: 'As Maximum',        value: `${As_max.toFixed(0)} mm²` },
      { label: 'Slenderness (λ)',   value: `${lambda.toFixed(1)} — ${slender}` },
      { label: 'Suggested Bars',    value: cfg, highlight: true },
    ])
  }

  return (
    <VStack spacing={4} align="stretch">
      <Text fontSize="sm" color="text-muted" lineHeight="1.8">
        Short/slender RC column check to EC2. Determines minimum steel, slenderness ratio and bar arrangement.
      </Text>
      <Grid templateColumns={{ base: '1fr', md: 'repeat(2,1fr)' }} gap={4}>
        {[
          ['Axial Load N (kN)',    'N',  '800'],
          ['Effective Length (mm)','le', '3000'],
          ['Width b (mm)',         'b',  '300'],
          ['Depth h (mm)',         'h',  '300'],
        ].map(([label, key, ph]) => (
          <FormControl key={key}>
            <FormLabel {...labelStyles}>{label}</FormLabel>
            <Input {...iS} placeholder={ph} value={(f as any)[key]} onChange={sf(key)} type="number" />
          </FormControl>
        ))}
        <FormControl>
          <FormLabel {...labelStyles}>Concrete fck (MPa)</FormLabel>
          <Select {...iS} value={f.fck} onChange={sf('fck')}>
            {[20,25,30,35,40].map(v => <option key={v} value={v}>C{v}/{v+5}</option>)}
          </Select>
        </FormControl>
      </Grid>
      <Button variant="gold" onClick={calculate}>Design Column</Button>
      {res && <ResultCard title="Column Design Results" rows={res} />}
    </VStack>
  )
}

// ── Rebar / BBS ───────────────────────────────────────────────────────────────
function RebarBBS() {
  const iS = useInputStyles()
  const [bars, setBars] = useState([{ dia: '16', n: '4', len: '6000' }])
  const [res, setRes] = useState<ResultRow[] | null>(null)

  const addBar = () => setBars(b => [...b, { dia: '16', n: '2', len: '6000' }])
  const upBar  = (i: number, k: string, v: string) =>
    setBars(b => b.map((r, ri) => ri === i ? { ...r, [k]: v } : r))

  const DENSITY = 7850  // kg/m³
  const iS2 = useInputStyles()

  const calculate = () => {
    const rows: ResultRow[] = []
    let totalKg = 0
    bars.forEach((bar, i) => {
      const d  = +bar.dia; const n = +bar.n; const l = +bar.len
      const area_mm2 = Math.PI * d * d / 4
      const mass_per_m = area_mm2 * 1e-6 * DENSITY  // kg/m
      const total_len  = n * l / 1000                // m
      const kg = total_len * mass_per_m
      totalKg += kg
      rows.push({ label: `Row ${i+1}: ${n}×H${d}×${l}mm`, value: `${kg.toFixed(2)} kg` })
    })
    rows.push({ label: 'TOTAL WEIGHT', value: `${totalKg.toFixed(2)} kg  (${(totalKg/1000).toFixed(3)} tonnes)`, highlight: true })
    setRes(rows)
  }

  return (
    <VStack spacing={4} align="stretch">
      <Text fontSize="sm" color="text-muted" lineHeight="1.8">
        Bar Bending Schedule weight calculator. Add bar rows, then calculate total steel tonnage.
      </Text>
      {bars.map((bar, i) => (
        <Grid key={i} templateColumns="1fr 1fr 1fr auto" gap={3} alignItems="end">
          <FormControl>
            <FormLabel {...labelStyles}>Diameter (mm)</FormLabel>
            <Select {...iS} value={bar.dia} onChange={e => upBar(i, 'dia', e.target.value)}>
              {[8,10,12,16,20,25,32].map(d => <option key={d} value={d}>H{d}</option>)}
            </Select>
          </FormControl>
          <FormControl>
            <FormLabel {...labelStyles}>No. of Bars</FormLabel>
            <Input {...iS} type="number" value={bar.n} onChange={e => upBar(i, 'n', e.target.value)} />
          </FormControl>
          <FormControl>
            <FormLabel {...labelStyles}>Length (mm)</FormLabel>
            <Input {...iS} type="number" value={bar.len} onChange={e => upBar(i, 'len', e.target.value)} />
          </FormControl>
          <Button variant="ghost_light" size="sm" onClick={() => setBars(b => b.filter((_, ri) => ri !== i))}
            isDisabled={bars.length === 1} mt={4}>✕</Button>
        </Grid>
      ))}
      <HStack>
        <Button variant="ghost_light" size="sm" onClick={addBar}>+ Add Row</Button>
        <Button variant="gold" onClick={calculate}>Calculate Weight</Button>
      </HStack>
      {res && <ResultCard title="BBS Weight Summary" rows={res} notes={['Based on steel density 7850 kg/m³', 'Add 5% wastage for ordering quantities']} />}
    </VStack>
  )
}

// ── Soil Bearing / Foundation ─────────────────────────────────────────────────
function FoundationCalc() {
  const iS = useInputStyles()
  const [f, setF] = useState({ P: '', qa: '100', depth: '1.5', gamma: '18', type: 'isolated' })
  const [res, setRes] = useState<ResultRow[] | null>(null)
  const sf = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setF(p => ({ ...p, [k]: e.target.value }))

  const calculate = () => {
    const P  = +f.P; const qa = +f.qa; const D = +f.depth; const gamma = +f.gamma
    if (!P || !qa) return

    // Net allowable bearing capacity (account for self weight of soil above)
    const q_net = qa - gamma * D * 1e-3   // kN/m² — remove soil overburden (D in m, gamma kN/m³)
    const A_req = (P * 1.0) / Math.max(q_net, 10)    // m²  (factor 1.0 — already ULS from column)
    const B     = Math.sqrt(A_req)
    const B_round = Math.ceil(B * 10) / 10             // round up to nearest 100mm

    setRes([
      { label: 'Column Load P',           value: `${P} kN` },
      { label: 'Allowable Bearing qa',    value: `${qa} kN/m²` },
      { label: 'Net Bearing Pressure',    value: `${q_net.toFixed(1)} kN/m²` },
      { label: 'Required Area',           value: `${A_req.toFixed(3)} m²` },
      { label: 'Minimum Pad Size',        value: `${B.toFixed(2)} × ${B.toFixed(2)} m`, highlight: true },
      { label: 'Recommended Pad Size',    value: `${B_round} × ${B_round} m`, highlight: true },
    ])
  }

  return (
    <VStack spacing={4} align="stretch">
      <Text fontSize="sm" color="text-muted" lineHeight="1.8">
        Isolated pad foundation sizing based on soil bearing capacity. Always validate with a geotechnical investigation report.
      </Text>
      <Grid templateColumns={{ base: '1fr', md: 'repeat(2,1fr)' }} gap={4}>
        {[
          ['Column Load P (kN)',           'P',     '500'],
          ['Allowable Bearing qa (kN/m²)', 'qa',    '100'],
          ['Foundation Depth D (m)',       'depth', '1.5'],
          ['Soil Unit Weight γ (kN/m³)',   'gamma', '18'],
        ].map(([label, key, ph]) => (
          <FormControl key={key}>
            <FormLabel {...labelStyles}>{label}</FormLabel>
            <Input {...iS} placeholder={ph} value={(f as any)[key]} onChange={sf(key)} type="number" />
          </FormControl>
        ))}
      </Grid>
      <Button variant="gold" onClick={calculate}>Size Foundation</Button>
      {res && <ResultCard title="Foundation Sizing" rows={res}
        notes={['Conduct site soil investigation before finalising','Check punching shear and bending in pad slab','Minimum embedment depth 0.5m below finished ground level']} />}
    </VStack>
  )
}

// ── Wind Load ─────────────────────────────────────────────────────────────────
function WindLoad() {
  const iS = useInputStyles()
  const [f, setF] = useState({ vb: '35', h: '15', b: '20', zone: 'II', cf: '1.3' })
  const [res, setRes] = useState<ResultRow[] | null>(null)
  const sf = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setF(p => ({ ...p, [k]: e.target.value }))

  const calculate = () => {
    const vb = +f.vb; const h = +f.h; const b = +f.b; const cf = +f.cf
    // Simplified EC1 / NCP 5 approach
    const qb   = 0.5 * 1.25 * vb * vb / 1000  // kN/m² basic wind pressure
    const ce   = Math.min(2.5, 1 + 2 * (h / 10) * 0.15)  // simplified exposure coeff
    const qp   = qb * ce                        // peak velocity pressure
    const Fw   = cf * qp * h * b                // total wind force kN

    setRes([
      { label: 'Basic Wind Velocity',    value: `${vb} m/s` },
      { label: 'Basic Wind Pressure qb', value: `${qb.toFixed(3)} kN/m²` },
      { label: 'Exposure Coefficient ce',value: ce.toFixed(2) },
      { label: 'Peak Pressure qp',       value: `${qp.toFixed(3)} kN/m²` },
      { label: 'Force Coefficient cf',   value: cf.toString() },
      { label: 'Total Wind Force',       value: `${Fw.toFixed(1)} kN`, highlight: true },
      { label: 'Wind Pressure on Face',  value: `${(cf * qp).toFixed(3)} kN/m²`, highlight: true },
    ])
  }

  return (
    <VStack spacing={4} align="stretch">
      <Text fontSize="sm" color="text-muted" lineHeight="1.8">
        Simplified wind load estimation to EC1-1-4 / Nigerian code. For complex shapes, use a full wind analysis.
      </Text>
      <Grid templateColumns={{ base: '1fr', md: 'repeat(2,1fr)' }} gap={4}>
        {[
          ['Basic Wind Speed vb (m/s)', 'vb', '35'],
          ['Building Height h (m)',     'h',  '15'],
          ['Building Width b (m)',      'b',  '20'],
          ['Force Coefficient cf',      'cf', '1.3'],
        ].map(([label, key, ph]) => (
          <FormControl key={key}>
            <FormLabel {...labelStyles}>{label}</FormLabel>
            <Input {...iS} placeholder={ph} value={(f as any)[key]} onChange={sf(key)} type="number" />
          </FormControl>
        ))}
      </Grid>
      <Button variant="gold" onClick={calculate}>Calculate Wind Load</Button>
      {res && <ResultCard title="Wind Load Results" rows={res}
        notes={['Simplified method — verify with full EC1-1-4 procedure for complex structures','Nigeria Wind Zone II: vb ≈ 35 m/s; Zone III (coastal): 40 m/s']} />}
    </VStack>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function EngineerCalculations() {
  const cardBg  = useColorModeValue('white', 'stellar.card')
  const borderC = useColorModeValue('gray.200', 'stellar.border')

  return (
    <Box maxW="1280px" mx="auto" px={{ base: 4, md: 8 }} py={8}>
      <HStack spacing={4} mb={3}>
        <Box h="1px" w="30px" bg="brand.500" />
        <Text fontFamily="mono" fontSize="xs" color="brand.500" letterSpacing="0.2em" textTransform="uppercase">
          For Engineers
        </Text>
      </HStack>
      <Text fontFamily="heading" fontSize={{ base: '2xl', md: '3xl' }} fontWeight="800"
        color="text-primary" mb={2}>
        Structural Engineering Calculators
      </Text>
      <Text fontSize="sm" color="text-muted" mb={2} maxW="620px" lineHeight="1.8">
        Professional-grade calculations aligned with Eurocode 2, BS 8110, and Nigerian standards. Results are for preliminary design only — always verify with full analysis and peer review.
      </Text>

      {/* Disclaimer */}
      <Box mb={8} p={4} border="1px solid" borderColor="orange.500" bg="rgba(237,137,54,0.06)"
        borderLeft="4px solid" borderLeftColor="orange.500">
        <Text fontSize="xs" fontFamily="mono" color="orange.500" letterSpacing="0.15em" mb={1}>
          ⚠️ ENGINEERING DISCLAIMER
        </Text>
        <Text fontSize="sm" color="text-muted" lineHeight="1.7">
          These calculators provide preliminary estimates only. All structural designs must be verified
          by a qualified COREN-registered engineer before construction. Lightyear Stellar Solutions
          accepts no liability for designs based solely on these tools.
        </Text>
      </Box>

      <Box border="1px solid" borderColor={borderC} bg={cardBg}>
        <Box h="2px" bgGradient="linear(to-r, brand.700, brand.400)" />
        <Tabs variant="unstyled" colorScheme="brand">
          <TabList borderBottom="1px solid" borderColor={borderC} overflowX="auto">
            {['Beam Design', 'Column Design', 'Rebar / BBS', 'Foundation', 'Wind Load'].map(t => (
              <Tab key={t} px={5} py={4} fontSize="xs" fontWeight="600" fontFamily="mono"
                letterSpacing="0.1em" textTransform="uppercase" color="text-muted" whiteSpace="nowrap"
                _selected={{ color: 'brand.400', borderBottom: '2px solid', borderColor: 'brand.500' }}>
                {t}
              </Tab>
            ))}
          </TabList>
          <TabPanels>
            <TabPanel p={6}><BeamDesign /></TabPanel>
            <TabPanel p={6}><ColumnDesign /></TabPanel>
            <TabPanel p={6}><RebarBBS /></TabPanel>
            <TabPanel p={6}><FoundationCalc /></TabPanel>
            <TabPanel p={6}><WindLoad /></TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Box>
  )
}
