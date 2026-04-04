import { Routes, Route, Navigate } from 'react-router-dom'
import { Box, useDisclosure } from '@chakra-ui/react'
import { useAuth } from './context/AuthContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import AIChatWidget from './components/AIChatWidget'
import ConsultationDrawer from './components/ConsultationDrawer'
import Home from './pages/Home'
import WhoWeAre from './pages/WhoWeAre'
import Experience from './pages/Experience'
import ServicesPage from './pages/Services'
import ProjectStudies from './pages/ProjectStudies'
import Contact from './pages/Contact'
import LoginPage from './pages/Login'
import Dashboard from './pages/Dashboard'
import AdminDashboard from './pages/AdminDashboard'
import CalculatorsPage from './pages/Calculators'

function ProtectedRoute({ children, adminOnly = false }: { children: React.ReactNode; adminOnly?: boolean }) {
  const { user, profile, loading } = useAuth()
  if (loading) return null
  if (!user) return <Navigate to="/login" replace />
  if (adminOnly && profile?.role === 'homeowner') return <Navigate to="/dashboard" replace />
  return <>{children}</>
}

export default function App() {
  const { isOpen: isConsultOpen, onOpen: onConsultOpen, onClose: onConsultClose } = useDisclosure()
  const { profile } = useAuth()
  const path = window.location.pathname

  return (
    <Box bg="stellar.bg" minH="100vh">
      <Navbar onOpenConsultation={onConsultOpen} />
      <Routes>
        <Route path="/" element={<Home onOpenConsultation={onConsultOpen} />} />
        <Route path="/who-we-are" element={<WhoWeAre />} />
        <Route path="/experience" element={<Experience />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/project-studies" element={<ProjectStudies />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            {(profile?.role === 'admin' || profile?.role === 'engineer')
              ? <AdminDashboard /> : <Dashboard />}
          </ProtectedRoute>
        } />
        <Route path="/dashboard/calculators" element={
          <ProtectedRoute><CalculatorsPage /></ProtectedRoute>
        } />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      {!path.startsWith('/login') && <Footer />}
      <ConsultationDrawer isOpen={isConsultOpen} onClose={onConsultClose} />
      <AIChatWidget />
    </Box>
  )
}
