import { PageLoader } from "@/components/LoadingSpinner";
import { useAuth } from "@/hooks/useAuth";
import AdminSettingsPage from "@/pages/AdminSettingsPage";
import DashboardPage from "@/pages/DashboardPage";
import FormBuilderPage from "@/pages/FormBuilderPage";
import LoginPage from "@/pages/LoginPage";
import MyBookingsPage from "@/pages/MyBookingsPage";
import PublicFormPage from "@/pages/PublicFormPage";
import ResponsesPage from "@/pages/ResponsesPage";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
  lazyRouteComponent,
} from "@tanstack/react-router";

// ─── Root ─────────────────────────────────────────────────────────────────────
const rootRoute = createRootRoute({ component: () => <Outlet /> });

// ─── Guard wrapper ────────────────────────────────────────────────────────────
function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) return <PageLoader />;
  if (!isAuthenticated) {
    void router.navigate({ to: "/" });
    return null;
  }
  return <>{children}</>;
}

// ─── Index route ──────────────────────────────────────────────────────────────
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: lazyRouteComponent(
    () => import("@/pages/FlightSearchPage"),
    "default",
  ),
});

const resultsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/results",
  component: lazyRouteComponent(
    () => import("@/pages/FlightResultsPage"),
    "default",
  ),
});

const bookingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/booking",
  component: lazyRouteComponent(() => import("@/pages/BookingPage"), "default"),
});

const confirmationRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/confirmation",
  component: lazyRouteComponent(
    () => import("@/pages/ConfirmationPage"),
    "default",
  ),
});

const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/dashboard",
  component: () => (
    <AuthGuard>
      <DashboardPage />
    </AuthGuard>
  ),
});

const newFormRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/forms/new",
  component: () => (
    <AuthGuard>
      <FormBuilderPage />
    </AuthGuard>
  ),
});

const editFormRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/forms/$formId/edit",
  component: () => (
    <AuthGuard>
      <FormBuilderPage />
    </AuthGuard>
  ),
});

const responsesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/forms/$formId/responses",
  component: () => (
    <AuthGuard>
      <ResponsesPage />
    </AuthGuard>
  ),
});

const myBookingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/my-bookings",
  component: () => (
    <AuthGuard>
      <MyBookingsPage />
    </AuthGuard>
  ),
});

const publicFormRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/f/$formId",
  component: () => <PublicFormPage />,
});

const adminSettingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin/settings",
  component: () => (
    <AuthGuard>
      <AdminSettingsPage />
    </AuthGuard>
  ),
});

// ─── Router ──────────────────────────────────────────────────────────────────
const routeTree = rootRoute.addChildren([
  indexRoute,
  resultsRoute,
  bookingRoute,
  confirmationRoute,
  dashboardRoute,
  myBookingsRoute,
  newFormRoute,
  editFormRoute,
  responsesRoute,
  publicFormRoute,
  adminSettingsRoute,
]);

export const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
