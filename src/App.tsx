import { lazy, Suspense } from "react";
import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
  Navigate,
  useLocation,
  useOutletContext,
  isRouteErrorResponse,
  useRouteError,
} from "react-router-dom";
import {
  Box,
  Spinner,
  Flex,
  Text,
  Button,
  useDisclosure,
} from "@chakra-ui/react";
import { useAuth } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AIChatWidget from "./components/AIChatWidget";
import ConsultationDrawer from "./components/ConsultationDrawer";

const Home = lazy(() => import("./pages/Home"));
const WhoWeAre = lazy(() => import("./pages/WhoWeAre"));
const Experience = lazy(() => import("./pages/Experience"));
const ServicesPage = lazy(() => import("./pages/Services"));
const ProjectStudies = lazy(() => import("./pages/ProjectStudies"));
const Contact = lazy(() => import("./pages/Contact"));
const LoginPage = lazy(() => import("./pages/Login"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
// Calculators are PUBLIC — accessible without login
const CalculatorsPage = lazy(() => import("./pages/Calculators"));
const EngineerCalculations = lazy(() => import("./pages/EngineerCalculations"));

type LayoutContext = { onOpenConsultation: () => void };
export const useConsultation = () => useOutletContext<LayoutContext>();

function PageLoader() {
  return (
    <Flex minH="60vh" align="center" justify="center">
      <Spinner size="lg" color="brand.500" thickness="2px" speed="0.65s" />
    </Flex>
  );
}

function ErrorBoundary() {
  const error = useRouteError();
  const is404 = isRouteErrorResponse(error) && error.status === 404;
  return (
    <Flex
      minH="60vh"
      align="center"
      justify="center"
      flexDir="column"
      gap={4}
      px={8}
    >
      <Text
        fontFamily="heading"
        fontSize="5xl"
        fontWeight="900"
        color="brand.500"
      >
        {is404 ? "404" : "Oops"}
      </Text>
      <Text fontSize="lg" color="text-primary" fontWeight="600">
        {is404 ? "Page not found" : "Something went wrong"}
      </Text>
      <Text fontSize="sm" color="text-muted" textAlign="center" maxW="400px">
        {is404
          ? "The page you're looking for doesn't exist."
          : "An unexpected error occurred. Please try refreshing."}
      </Text>
      <Button as="a" href="/" variant="gold" size="sm" px={8} mt={2}>
        Go Home
      </Button>
    </Flex>
  );
}

function RootLayout() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const location = useLocation();
  const hideFooter = location.pathname === "/login";
  return (
    <Box bg="stellar.bg" minH="100vh">
      <Navbar onOpenConsultation={onOpen} />
      <Suspense fallback={<PageLoader />}>
        <Outlet
          context={{ onOpenConsultation: onOpen } satisfies LayoutContext}
        />
      </Suspense>
      {!hideFooter && <Footer />}
      <ConsultationDrawer isOpen={isOpen} onClose={onClose} />
      <AIChatWidget />
    </Box>
  );
}

function ProtectedRoute() {
  const { user, loading } = useAuth();
  if (loading) return <PageLoader />;
  if (!user) return <Navigate to="/login" replace />;
  return <Outlet />;
}

function DashboardRoute() {
  const { profile, loading } = useAuth();
  if (loading) return <PageLoader />;
  if (profile?.role === "admin" || profile?.role === "engineer")
    return <AdminDashboard />;
  return <Dashboard />;
}

function HomeWrapper() {
  const { onOpenConsultation } = useConsultation();
  return <Home onOpenConsultation={onOpenConsultation} />;
}

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    errorElement: <ErrorBoundary />,
    children: [
      // Public
      { path: "/", element: <HomeWrapper />, errorElement: <ErrorBoundary /> },
      {
        path: "/who-we-are",
        element: <WhoWeAre />,
        errorElement: <ErrorBoundary />,
      },
      {
        path: "/experience",
        element: <Experience />,
        errorElement: <ErrorBoundary />,
      },
      {
        path: "/services",
        element: <ServicesPage />,
        errorElement: <ErrorBoundary />,
      },
      {
        path: "/project-studies",
        element: <ProjectStudies />,
        errorElement: <ErrorBoundary />,
      },
      {
        path: "/contact",
        element: <Contact />,
        errorElement: <ErrorBoundary />,
      },
      {
        path: "/login",
        element: <LoginPage />,
        errorElement: <ErrorBoundary />,
      },
      // Calculators — PUBLIC, no auth required
      {
        path: "/calculators",
        element: <CalculatorsPage />,
        errorElement: <ErrorBoundary />,
      },
      {
        path: "/engineer-calculators",
        element: <EngineerCalculations />,
        errorElement: <ErrorBoundary />,
      },
      // Protected — dashboard only
      {
        element: <ProtectedRoute />,
        errorElement: <ErrorBoundary />,
        children: [{ path: "/dashboard", element: <DashboardRoute /> }],
      },
      { path: "*", element: <Navigate to="/" replace /> },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
