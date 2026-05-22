import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "@tanstack/react-router";
import {
  ArrowRight,
  BarChart2,
  LayoutList,
  Share2,
  Shield,
  Ticket,
  Zap,
} from "lucide-react";
import { useEffect } from "react";

const FEATURES = [
  {
    icon: Zap,
    title: "Build in minutes",
    description:
      "Add fields for name, email, quantity, and ticket type — no code needed.",
  },
  {
    icon: Share2,
    title: "One-click publish",
    description:
      "Get a shareable link instantly. Anyone can fill your form without an account.",
  },
  {
    icon: BarChart2,
    title: "Track responses",
    description:
      "See every submission in real time and export to CSV whenever you need.",
  },
  {
    icon: Shield,
    title: "Secure & private",
    description:
      "Forms and responses live on the Internet Computer — no third-party databases.",
  },
];

const EXAMPLES = [
  {
    label: "Conference ticket",
    icon: Ticket,
    color: "bg-primary/10 text-primary",
  },
  {
    label: "Workshop sign-up",
    icon: LayoutList,
    color: "bg-accent/10 text-accent",
  },
  {
    label: "Event registration",
    icon: Share2,
    color: "bg-secondary/20 text-secondary-foreground",
  },
];

export default function LoginPage() {
  const { login, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      void router.navigate({ to: "/dashboard" });
    }
  }, [isAuthenticated, router]);

  return (
    <Layout showNav={false}>
      {/* Hero */}
      <section className="flex-1 flex items-center justify-center bg-background py-20 px-4">
        <div className="max-w-2xl w-full text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/8 border border-primary/20 text-primary text-xs font-semibold mb-8 tracking-wide uppercase">
            <Ticket className="w-3 h-3" />
            Ticket form builder
          </div>

          <h1 className="font-display font-bold text-foreground text-5xl sm:text-6xl tracking-tight leading-[1.08] mb-6">
            Create &amp; publish forms{" "}
            <span className="text-primary">in minutes</span>
          </h1>

          <p className="text-muted-foreground text-lg sm:text-xl leading-relaxed mb-10 max-w-lg mx-auto">
            FormFlow makes it easy to collect ticket orders, event
            registrations, and responses — then share with a single link.
          </p>

          {/* Use-case chips */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
            {EXAMPLES.map(({ label, icon: Icon, color }) => (
              <span
                key={label}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border border-border ${color}`}
              >
                <Icon className="w-3.5 h-3.5" />
                {label}
              </span>
            ))}
          </div>

          <Button
            size="lg"
            className="gap-2 px-8 py-6 text-base font-semibold shadow-elevated hover:shadow-elevated transition-smooth"
            onClick={login}
            data-ocid="login-btn"
          >
            Get started free
            <ArrowRight className="w-4 h-4" />
          </Button>
          <p className="text-xs text-muted-foreground mt-4">
            Sign in with Internet Identity — no password required
          </p>
        </div>
      </section>

      {/* Features */}
      <section className="bg-muted/30 border-t border-border py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <p className="text-center text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-10">
            Everything you need
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {FEATURES.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="bg-card rounded-xl border border-border p-6 hover:shadow-elevated transition-smooth"
              >
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-display font-semibold text-foreground text-sm mb-2">
                  {title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA strip */}
      <section className="bg-primary py-14 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="font-display font-bold text-primary-foreground text-3xl mb-4">
            Ready to sell your tickets?
          </h2>
          <p className="text-primary-foreground/70 text-base mb-8">
            Sign in and create your first form in under 2 minutes.
          </p>
          <Button
            size="lg"
            variant="secondary"
            className="gap-2 px-8 font-semibold"
            onClick={login}
            data-ocid="login-btn-secondary"
          >
            Start for free <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </section>
    </Layout>
  );
}
