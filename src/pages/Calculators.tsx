import { useState } from 'react'
import {
  Box, Grid, Text, VStack, HStack, Button, Input,
  Select, Flex, Tabs, TabList, Tab, TabPanels, TabPanel,
  FormControl, FormLabel, Divider, List, ListItem,
} from '@chakra-ui/react'
import { apiCall } from '../lib/supabase'

const inputStyles = {
  bg: 'stellar.bg', border: '1px solid', borderColor: 'stellar.border',
  borderRadius: '2px', color: 'stellar.text', fontSize: 'sm',
  _placeholder: { color: 'stellar.muted' },
  _focus: { borderColor: 'brand.500', boxShadow: '0 0 0 1px #C8963E' },
}
const labelStyles = {
  fontSize: 'xs' as const, fontFamily: 'mono', color: 'stellar.muted',
  letterSpacing: '0.1em', textTransform: 'uppercase' as const,
}

function ResultCard({ data }: { data: any }) {
  if (!data) return null
  return (
    <Box mt={5} p={5} border="1px solid" borderColor="brand.700" bg="rgba(200,150,62,0.04)">
      <Box h="2px" bgGradient="linear(to-r, brand.700, brand.400)" mb={4} />
      <Text fontFamily="mono" fontSize="xs" color="brand.500" letterSpacing="0.2em" textTransform="uppercase" mb={4}>
        Results
      </Text>
      {data.materials && (
        <>
          <Text fontSize="xs" fontFamily="mono" color="stellar.muted" letterSpacing="0.1em" textTransform="uppercase" mb={2}>
            Materials Required
          </Text>
          {Object.entries(data.materials).map(([k, v]) => (
            <HStack key={k} justify="space-between" py={2} borderBottom="1px solid" borderColor="stellar.border">
              <Text fontSize="sm" color="stellar.muted" textTransform="capitalize">
                {k.replace(/_/g, ' ')}
              </Text>
              <Text fontSize="sm" fontWeight="700" color="brand.400" fontFamily="mono">{String(v)}</Text>
            </HStack>
          ))}
        </>
      )}
      {data.estimated_cost_ngn && (
        <Box mt={4}>
          <Text fontSize="xs" fontFamily="mono" color="stellar.muted" letterSpacing="0.1em" textTransform="uppercase" mb={2}>
            Estimated Cost (₦)
          </Text>
          {Object.entries(data.estimated_cost_ngn).map(([k, v]) => (
            <HStack key={k} justify="space-between" py={2} borderBottom="1px solid" borderColor="stellar.border">
              <Text fontSize="sm" color={k === 'total' ? 'stellar.text' : 'stellar.muted'} textTransform="capitalize"
                fontWeight={k === 'total' ? '700' : '400'}>
                {k === 'total' ? 'TOTAL' : k.replace(/_/g, ' ')}
              </Text>
              <Text fontSize="sm" fontFamily="mono" color={k === 'total' ? 'brand.400' : 'stellar.light'}
                fontWeight={k === 'total' ? '700' : '400'}>
                ₦{Number(v).toLocaleString()}
              </Text>
            </HStack>
          ))}
        </Box>
      )}
      {data.notes && (
        <Box mt={4} p={3} bg="stellar.bg" border="1px solid" borderColor="stellar.border">
          <Text fontSize="xs" fontFamily="mono" color="brand.500" letterSpacing="0.1em" mb={2}>NOTES</Text>
          {data.notes.map((n: string, i: number) => (
            <Text key={i} fontSize="xs" color="stellar.muted" lineHeight="1.7">• {n}</Text>
          ))}
        </Box>
      )}
    </Box>
  )
}

function ConcreteCalc() {
  const [form, setForm] = useState({ length_m: '', width_m: '', depth_m: '', mix_ratio: '1:2:4' })
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const f = (k: string) => (e: any) => setForm(p => ({ ...p, [k]: e.target.value }))
  const calculate = async () => {
    setLoading(true)
    try {
      const res = await apiCall('/calculators/concrete', {
        method: 'POST',
        body: JSON.stringify({
          length_m: +form.length_m, width_m: +form.width_m,
          depth_m: +form.depth_m, mix_ratio: form.mix_ratio,
        }),
      })
      setResult(res)
    } finally { setLoading(false) }
  }
  return (
    <VStack spacing={4} align="stretch">
      <Text fontSize="sm" color="stellar.muted" lineHeight="1.8">
        Calculate cement bags, sand, and aggregate for a concrete slab, beam, or column.
      </Text>
      <Grid templateColumns="1fr 1fr 1fr" gap={4}>
        {[['Length (m)', 'length_m'], ['Width (m)', 'width_m'], ['Depth/Thickness (m)', 'depth_m']].map(([label, key]) => (
          <FormControl key={key}>
            <FormLabel {...labelStyles}>{label}</FormLabel>
            <Input {...inputStyles} type="number" placeholder="0.0" value={(form as any)[key]} onChange={f(key)} />
          </FormControl>
        ))}
      </Grid>
      <FormControl>
        <FormLabel {...labelStyles}>Mix Ratio</FormLabel>
        <Select {...inputStyles} value={form.mix_ratio} onChange={f('mix_ratio')}>
          <option value="1:1:2">1:1:2 (Very Strong — Columns)</option>
          <option value="1:1.5:3">1:1.5:3 (Strong — Beams)</option>
          <option value="1:2:4">1:2:4 (Standard — Slabs)</option>
          <option value="1:3:6">1:3:6 (Light — Blinding)</option>
        </Select>
      </FormControl>
      <Button variant="gold" onClick={calculate} isLoading={loading}>Calculate</Button>
      <ResultCard data={result} />
    </VStack>
  )
}

function BlockCalc() {
  const [form, setForm] = useState({ wall_length_m: '', wall_height_m: '', block_size: '9inch', num_openings: '0', opening_width_m: '0.9', opening_height_m: '2.1' })
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const f = (k: string) => (e: any) => setForm(p => ({ ...p, [k]: e.target.value }))
  const calculate = async () => {
    setLoading(true)
    try {
      const res = await apiCall('/calculators/blocks', {
        method: 'POST',
        body: JSON.stringify({
          wall_length_m: +form.wall_length_m, wall_height_m: +form.wall_height_m,
          block_size: form.block_size, num_openings: +form.num_openings,
          opening_width_m: +form.opening_width_m, opening_height_m: +form.opening_height_m,
        }),
      })
      setResult(res)
    } finally { setLoading(false) }
  }
  return (
    <VStack spacing={4} align="stretch">
      <Text fontSize="sm" color="stellar.muted" lineHeight="1.8">
        Calculate number of sandcrete blocks for a wall, with automatic deduction for doors and windows.
      </Text>
      <Grid templateColumns="1fr 1fr" gap={4}>
        <FormControl><FormLabel {...labelStyles}>Wall Length (m)</FormLabel>
          <Input {...inputStyles} type="number" placeholder="10.0" value={form.wall_length_m} onChange={f('wall_length_m')} /></FormControl>
        <FormControl><FormLabel {...labelStyles}>Wall Height (m)</FormLabel>
          <Input {...inputStyles} type="number" placeholder="3.0" value={form.wall_height_m} onChange={f('wall_height_m')} /></FormControl>
      </Grid>
      <Grid templateColumns="1fr 1fr" gap={4}>
        <FormControl><FormLabel {...labelStyles}>Block Size</FormLabel>
          <Select {...inputStyles} value={form.block_size} onChange={f('block_size')}>
            <option value="6inch">6 Inch Block</option>
            <option value="9inch">9 Inch Block</option>
          </Select></FormControl>
        <FormControl><FormLabel {...labelStyles}>Number of Openings</FormLabel>
          <Input {...inputStyles} type="number" placeholder="2" value={form.num_openings} onChange={f('num_openings')} /></FormControl>
      </Grid>
      <Button variant="gold" onClick={calculate} isLoading={loading}>Calculate</Button>
      <ResultCard data={result} />
    </VStack>
  )
}

function PaintCalc() {
  const [form, setForm] = useState({ area_sqm: '', coats: '2' })
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const f = (k: string) => (e: any) => setForm(p => ({ ...p, [k]: e.target.value }))
  const calculate = async () => {
    setLoading(true)
    try {
      const res = await apiCall('/calculators/paint', {
        method: 'POST',
        body: JSON.stringify({ area_sqm: +form.area_sqm, coats: +form.coats }),
      })
      setResult(res)
    } finally { setLoading(false) }
  }
  return (
    <VStack spacing={4} align="stretch">
      <Text fontSize="sm" color="stellar.muted" lineHeight="1.8">
        Calculate paint quantity for walls, ceilings, or any surface. Includes budget, mid-range, and premium options.
      </Text>
      <Grid templateColumns="1fr 1fr" gap={4}>
        <FormControl><FormLabel {...labelStyles}>Total Area (m²)</FormLabel>
          <Input {...inputStyles} type="number" placeholder="120" value={form.area_sqm} onChange={f('area_sqm')} /></FormControl>
        <FormControl><FormLabel {...labelStyles}>Number of Coats</FormLabel>
          <Select {...inputStyles} value={form.coats} onChange={f('coats')}>
            <option value="1">1 Coat</option>
            <option value="2">2 Coats (Recommended)</option>
            <option value="3">3 Coats</option>
          </Select></FormControl>
      </Grid>
      <Button variant="gold" onClick={calculate} isLoading={loading}>Calculate</Button>
      <ResultCard data={result} />
    </VStack>
  )
}

function RoofCalc() {
  const [form, setForm] = useState({ length_m: '', width_m: '', roof_pitch_degrees: '25' })
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const f = (k: string) => (e: any) => setForm(p => ({ ...p, [k]: e.target.value }))
  const calculate = async () => {
    setLoading(true)
    try {
      const res = await apiCall('/calculators/roof', {
        method: 'POST',
        body: JSON.stringify({ length_m: +form.length_m, width_m: +form.width_m, roof_pitch_degrees: +form.roof_pitch_degrees }),
      })
      setResult(res)
    } finally { setLoading(false) }
  }
  return (
    <VStack spacing={4} align="stretch">
      <Text fontSize="sm" color="stellar.muted" lineHeight="1.8">
        Estimate roofing sheets needed for aluminium, long-span, or stone-coated roofs.
      </Text>
      <Grid templateColumns="1fr 1fr 1fr" gap={4}>
        <FormControl><FormLabel {...labelStyles}>Building Length (m)</FormLabel>
          <Input {...inputStyles} type="number" placeholder="15" value={form.length_m} onChange={f('length_m')} /></FormControl>
        <FormControl><FormLabel {...labelStyles}>Building Width (m)</FormLabel>
          <Input {...inputStyles} type="number" placeholder="10" value={form.width_m} onChange={f('width_m')} /></FormControl>
        <FormControl><FormLabel {...labelStyles}>Roof Pitch (°)</FormLabel>
          <Select {...inputStyles} value={form.roof_pitch_degrees} onChange={f('roof_pitch_degrees')}>
            <option value="15">15° (Shallow)</option>
            <option value="25">25° (Standard)</option>
            <option value="35">35° (Steep)</option>
            <option value="45">45° (Very Steep)</option>
          </Select></FormControl>
      </Grid>
      <Button variant="gold" onClick={calculate} isLoading={loading}>Calculate</Button>
      <ResultCard data={result} />
    </VStack>
  )
}

const VIDEOS = [
  { title: 'Foundation Layout Explained', url: 'https://www.youtube.com/watch?v=KIZYoJ5b8YQ', desc: 'Step-by-step guide to setting out a building foundation correctly.' },
  { title: 'Waterproofing a Basement', url: 'https://www.youtube.com/watch?v=9xm6P2-X5wI', desc: 'Techniques for effective basement and below-grade waterproofing.' },
  { title: 'Reinforcement Bar Bending', url: 'https://www.youtube.com/watch?v=Qe0TRf5lUMw', desc: 'How to cut and bend rebar for slabs, columns, and beams.' },
  { title: 'Block Laying for Beginners', url: 'https://www.youtube.com/watch?v=J6P0sT5RKFE', desc: 'Proper technique for laying sandcrete blocks with mortar.' },
  { title: 'Roof Trusses Explained', url: 'https://www.youtube.com/watch?v=nmqxpA8V5Mc', desc: 'How to design and assemble timber roof trusses.' },
  { title: 'Tile Installation Guide', url: 'https://www.youtube.com/watch?v=Ob8a6sGCJeQ', desc: 'Floor and wall tile fixing, grouting, and finishing.' },
]

export default function CalculatorsPage() {
  return (
    <Box maxW="1280px" mx="auto" px={{ base: 4, md: 8 }} py={8}>
      <HStack mb={2}><Box h="1px" w="30px" bg="brand.500" />
        <Text fontFamily="mono" fontSize="xs" color="brand.500" letterSpacing="0.2em" textTransform="uppercase">
          Tools & Resources
        </Text>
      </HStack>
      <Text fontFamily="heading" fontSize={{ base: '2xl', md: '3xl' }} fontWeight="800"
        color="stellar.text" mb={2}>
        Construction Calculators
      </Text>
      <Text fontSize="sm" color="stellar.muted" mb={8} maxW="560px">
        Quick, accurate material estimates for your project — all based on current Nigerian market rates.
      </Text>

      {/* Waterproofing explainer */}
      <Box mb={8} p={6} border="1px solid" borderColor="brand.700" bg="rgba(200,150,62,0.04)"
        borderLeft="4px solid" borderLeftColor="brand.500">
        <Text fontSize="xs" fontFamily="mono" color="brand.500" letterSpacing="0.2em"
          textTransform="uppercase" mb={3}>⚠️ Did You Know?</Text>
        <Text fontFamily="heading" fontSize="lg" fontWeight="700" color="stellar.text" mb={2}>
          Why Waterproofing is Critical
        </Text>
        <Text fontSize="sm" color="stellar.muted" lineHeight="1.9">
          In Nigeria's tropical climate, water ingress is one of the most common — and costly — building defects.
          Proper waterproofing of foundations, roofs, bathrooms, and external walls prevents structural decay, mould growth,
          electrical hazards, and costly repairs. A quality waterproofing investment of 2–3% of your build cost can save
          10–20× that amount in future repair costs. Always specify waterproofing membranes, crystalline admixtures for
          concrete, and sealants at all construction joints.
        </Text>
      </Box>

      <Grid templateColumns={{ base: '1fr', lg: '1.5fr 1fr' }} gap={8}>
        {/* Calculators */}
        <Box border="1px solid" borderColor="stellar.border" bg="stellar.card">
          <Box h="2px" bgGradient="linear(to-r, brand.700, brand.400)" />
          <Tabs variant="unstyled" colorScheme="brand">
            <TabList borderBottom="1px solid" borderColor="stellar.border" overflowX="auto">
              {['Concrete', 'Blocks', 'Paint', 'Roofing'].map(t => (
                <Tab key={t} px={5} py={4} fontSize="xs" fontWeight="600" fontFamily="mono"
                  letterSpacing="0.1em" textTransform="uppercase" color="stellar.muted"
                  _selected={{ color: 'brand.400', borderBottom: '2px solid', borderColor: 'brand.500' }}>
                  {t}
                </Tab>
              ))}
            </TabList>
            <TabPanels>
              <TabPanel p={6}><ConcreteCalc /></TabPanel>
              <TabPanel p={6}><BlockCalc /></TabPanel>
              <TabPanel p={6}><PaintCalc /></TabPanel>
              <TabPanel p={6}><RoofCalc /></TabPanel>
            </TabPanels>
          </Tabs>
        </Box>

        {/* Video resources */}
        <Box>
          <Text fontFamily="heading" fontSize="xl" fontWeight="700" color="stellar.text" mb={4}>
            How-To Video Library
          </Text>
          <VStack spacing={3} align="stretch">
            {VIDEOS.map(v => (
              <Box key={v.title} as="a" href={v.url} target="_blank" rel="noopener noreferrer"
                p={4} border="1px solid" borderColor="stellar.border" bg="stellar.card"
                role="group" transition="all 0.25s"
                display="block"
                _hover={{ borderColor: 'brand.700', transform: 'translateX(4px)' }}>
                <HStack spacing={3}>
                  <Box w="36px" h="36px" bg="rgba(200,150,62,0.1)" border="1px solid"
                    borderColor="rgba(200,150,62,0.2)" flexShrink={0}
                    display="flex" alignItems="center" justifyContent="center">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="#C8963E">
                      <polygon points="5 3 19 12 5 21 5 3"/>
                    </svg>
                  </Box>
                  <Box flex={1}>
                    <Text fontSize="sm" fontWeight="600" color="stellar.text"
                      transition="color 0.2s" sx={{ '[role=group]:hover &': { color: 'brand.400' } }}>
                      {v.title}
                    </Text>
                    <Text fontSize="xs" color="stellar.muted" lineHeight="1.5" mt={0.5}>{v.desc}</Text>
                  </Box>
                </HStack>
              </Box>
            ))}
          </VStack>
        </Box>
      </Grid>
    </Box>
  )
}
