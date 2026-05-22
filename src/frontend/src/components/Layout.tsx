import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import { Link, useRouter } from "@tanstack/react-router";
import { Plane } from "lucide-react";

interface LayoutProps {
  children: React.ReactNode;
  showNav?: boolean;
  transparent?: boolean;
}

const LOGO_PATH =
  "/assets/file_000000003b907246a43b21b7187833c0-019e4655-06d8-7068-8a66-d3537478a031.png";

export function Layout({
  children,
  showNav = true,
  transparent = false,
}: LayoutProps) {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header
        className={cn(
          "sticky top-0 z-50 border-b border-border/60",
          transparent
            ? "bg-transparent backdrop-blur-sm"
            : "bg-card shadow-subtle",
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2.5 shrink-0"
            data-ocid="nav-home-link"
          >
            <img
              src={LOGO_PATH}
              alt="TRIPNEX"
              className="h-9 w-auto object-contain"
              onError={(e) => {
                const target = e.currentTarget;
                target.style.display = "none";
                const fallback =
                  target.nextElementSibling as HTMLElement | null;
                if (fallback) fallback.style.display = "flex";
              }}
            />
            <span
              className="hidden font-display font-bold text-foreground text-xl tracking-widest uppercase"
              style={{ display: "none" }}
            >
              TRIPNEX
            </span>
          </Link>

          {/* Nav */}
          {showNav && (
            <nav
              className="hidden sm:flex items-center gap-1"
              data-ocid="main-nav"
            >
              <NavLink to="/">Home</NavLink>
              <a
                href="#help"
                className={cn(
                  "px-3 py-1.5 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors",
                )}
                data-ocid="nav-help-link"
              >
                Help
              </a>
              <a
                href="#contact"
                className={cn(
                  "px-3 py-1.5 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors",
                )}
                data-ocid="nav-contact-link"
              >
                Contact
              </a>
              {isAuthenticated && (
                <>
                  <NavLink to="/dashboard">Dashboard</NavLink>
                  <NavLink to="/my-bookings">My Bookings</NavLink>
                </>
              )}
            </nav>
          )}

          {/* Actions */}
          <div className="flex items-center gap-3">
            <Button
              size="sm"
              className="hidden sm:flex items-center gap-1.5 font-semibold"
              onClick={() => router.navigate({ to: "/" })}
              data-ocid="search-flights-btn"
            >
              <Plane className="w-3.5 h-3.5" />
              Search Flights
            </Button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 flex flex-col">{children}</main>

      {/* Footer */}
      <footer className="bg-card border-t border-border/60 py-10" id="contact">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-8">
            {/* Brand */}
            <div>
              <img
                src={LOGO_PATH}
                alt="TRIPNEX"
                className="h-8 w-auto object-contain mb-3"
              />
              <p className="text-xs text-muted-foreground leading-relaxed">
                Connecting people to the world through seamless travel
                experiences.
              </p>
            </div>
            {/* Info */}
            <div>
              <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider mb-3">
                Contact
              </h4>
              <ul className="space-y-1.5 text-xs text-muted-foreground">
                <li>📍 Abuja, Nigeria</li>
                <li>
                  <a
                    href="mailto:info@tripnex.com"
                    className="hover:text-foreground transition-colors"
                  >
                    ✉️ info@tripnex.com
                  </a>
                </li>
                <li>
                  <a
                    href="https://tripnex.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-foreground transition-colors"
                  >
                    🌐 tripnex.com
                  </a>
                </li>
              </ul>
            </div>
            {/* Services */}
            <div id="help">
              <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider mb-3">
                Services
              </h4>
              <ul className="space-y-1.5 text-xs text-muted-foreground">
                <li>International &amp; Domestic Flights</li>
                <li>Hotel &amp; Resort Reservations</li>
                <li>Corporate Travel Management</li>
                <li>Group &amp; Family Packages</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border/40 pt-5 flex flex-col sm:flex-row items-center justify-between gap-2">
            <p className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} TRIPNEX. All rights reserved.
            </p>
            <p className="text-xs text-muted-foreground">
              Built with love using{" "}
              <a
                href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-foreground transition-colors"
              >
                caffeine.ai
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function NavLink({
  to,
  children,
}: {
  to: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      to={to}
      className={cn(
        "px-3 py-1.5 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors",
      )}
      activeProps={{ className: "text-foreground bg-muted" }}
      data-ocid="nav-link"
    >
      {children}
    </Link>
  );
}
