import { RouterProvider, createRouter, createRoute, createRootRoute, Outlet, redirect } from '@tanstack/react-router';
import { Toaster } from '@/components/ui/sonner';
import { AuthProvider, useAuth } from './components/AuthProvider';
import RoleSelectionModal from './components/RoleSelectionModal';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import CulturePage from './pages/CulturePage';
import AgriculturePage from './pages/AgriculturePage';
import CropsPage from './pages/CropsPage';
import GalleryPage from './pages/GalleryPage';
import NoticesPage from './pages/NoticesPage';
import ContactPage from './pages/ContactPage';
import LoginPage from './pages/LoginPage';
import AdminPage from './pages/AdminPage';
import AccessDeniedScreen from './components/AccessDeniedScreen';

function Layout() {
  const { isAuthenticated, userProfile, profileLoading, profileFetched } = useAuth();
  const showRoleModal = isAuthenticated && !profileLoading && profileFetched && userProfile === null;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      {showRoleModal && <RoleSelectionModal />}
    </div>
  );
}

const rootRoute = createRootRoute({ component: Layout });

const indexRoute = createRoute({ getParentRoute: () => rootRoute, path: '/', component: HomePage });
const aboutRoute = createRoute({ getParentRoute: () => rootRoute, path: '/about', component: AboutPage });
const cultureRoute = createRoute({ getParentRoute: () => rootRoute, path: '/culture', component: CulturePage });
const agricultureRoute = createRoute({ getParentRoute: () => rootRoute, path: '/agriculture', component: AgriculturePage });
const cropsRoute = createRoute({ getParentRoute: () => rootRoute, path: '/crops', component: CropsPage });
const galleryRoute = createRoute({ getParentRoute: () => rootRoute, path: '/gallery', component: GalleryPage });
const noticesRoute = createRoute({ getParentRoute: () => rootRoute, path: '/notices', component: NoticesPage });
const contactRoute = createRoute({ getParentRoute: () => rootRoute, path: '/contact', component: ContactPage });
const loginRoute = createRoute({ getParentRoute: () => rootRoute, path: '/login', component: LoginPage });

function AdminGuard() {
  const { isAdmin, isAuthenticated, profileLoading, profileFetched } = useAuth();

  // Show spinner while auth/profile is loading
  if (profileLoading || !profileFetched) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  // Not logged in → redirect to /login with adminRequired param
  if (!isAuthenticated) {
    throw redirect({ to: '/login', search: { adminRequired: 'true' } });
  }

  // Logged in but not admin → show access denied
  if (!isAdmin) {
    return <AccessDeniedScreen />;
  }

  return <AdminPage />;
}

const adminRoute = createRoute({ getParentRoute: () => rootRoute, path: '/admin', component: AdminGuard });

const routeTree = rootRoute.addChildren([
  indexRoute, aboutRoute, cultureRoute, agricultureRoute,
  cropsRoute, galleryRoute, noticesRoute, contactRoute,
  loginRoute, adminRoute
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register { router: typeof router }
}

export default function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
      <Toaster richColors position="top-right" />
    </AuthProvider>
  );
}
