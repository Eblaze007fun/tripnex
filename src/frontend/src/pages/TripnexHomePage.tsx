import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  BarChart2,
  BookOpen,
  Briefcase,
  Building2,
  Car,
  CheckCircle,
  ChevronDown,
  Globe,
  GraduationCap,
  Handshake,
  Heart,
  Hotel,
  Lightbulb,
  Mail,
  MapPin,
  Megaphone,
  Mountain,
  Phone,
  Plane,
  Settings2,
  Share2,
  Shield,
  Star,
  TrendingUp,
  Users,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

// ─── Data ──────────────────────────────────────────────────────────────────────

const SERVICES = [
  {
    icon: Plane,
    title: "International & Domestic Flights",
    desc: "Global and local flight reservations with competitive pricing and flexible schedules.",
  },
  {
    icon: Hotel,
    title: "Hotel & Resort Reservations",
    desc: "Luxury, executive, and budget accommodations at the world's finest properties.",
  },
  {
    icon: Heart,
    title: "Family Vacation Packages",
    desc: "Safe, memorable holidays crafted with care for the whole family.",
  },
  {
    icon: Briefcase,
    title: "Corporate & Conference Travel",
    desc: "Seamless logistics for business meetings, retreats, and global conferences.",
  },
  {
    icon: GraduationCap,
    title: "Group & Educational Trips",
    desc: "School excursions, pilgrimages, and coordinated group tourism.",
  },
  {
    icon: Globe,
    title: "Business Travel Coordination",
    desc: "Executive travel management with precision scheduling and dedicated support.",
  },
  {
    icon: Star,
    title: "Honeymoon & Holiday Packages",
    desc: "Romantic getaways, seasonal deals, and once-in-a-lifetime escapes.",
  },
  {
    icon: Car,
    title: "Airport Transfers & Concierge",
    desc: "Professional ground transportation and premium personal assistance.",
  },
  {
    icon: Shield,
    title: "Travel Insurance & Advisory",
    desc: "Comprehensive coverage and expert guidance for worry-free journeys.",
  },
  {
    icon: Users,
    title: "Customized Travel Solutions",
    desc: "Bespoke travel experiences engineered to every client's unique requirements.",
  },
];

const PARTNERSHIP_BENEFITS = [
  { icon: Star, text: "Professional travel management services" },
  { icon: TrendingUp, text: "Access to a growing travel market" },
  { icon: CheckCircle, text: "Reliable, award-winning customer support" },
  { icon: Briefcase, text: "Increased business opportunities" },
  { icon: Globe, text: "Improved travel coordination" },
  { icon: Handshake, text: "Strong brand collaboration" },
  { icon: Shield, text: "Flexible partnership structure" },
  { icon: BarChart2, text: "Long-term business growth potential" },
];

const PARTNER_TIERS = [
  {
    name: "Silver Partner",
    desc: "For emerging travel agencies and operators entering the TRIPNEX network.",
    perks: [
      "Co-branded marketing materials",
      "Access to TRIPNEX pricing",
      "Dedicated account manager",
    ],
  },
  {
    name: "Gold Partner",
    desc: "For established organizations ready to scale through strategic collaboration.",
    perks: [
      "Priority booking access",
      "Revenue sharing program",
      "Joint promotional campaigns",
      "Quarterly business reviews",
    ],
  },
  {
    name: "Platinum Partner",
    desc: "For premier institutions seeking an exclusive long-term alliance with TRIPNEX.",
    perks: [
      "Exclusive territory agreements",
      "White-label travel solutions",
      "C-suite engagement sessions",
      "Custom SLA and support",
      "Global network access",
    ],
  },
];

const MARKETING = [
  {
    icon: Share2,
    title: "Social Media Campaigns",
    desc: "Targeted campaigns across all major social platforms to maximize reach and engagement.",
  },
  {
    icon: Globe,
    title: "Digital Advertising",
    desc: "Search, display, and programmatic ad placements for high-intent traveler audiences.",
  },
  {
    icon: Briefcase,
    title: "Corporate Outreach",
    desc: "Direct engagement with corporate clients and institutions for long-term contracts.",
  },
  {
    icon: TrendingUp,
    title: "Referral Programs",
    desc: "Incentive-driven referral networks fueling organic, high-quality growth.",
  },
  {
    icon: Star,
    title: "Seasonal Travel Promotions",
    desc: "Holiday and event-based promotional campaigns that drive peak-season bookings.",
  },
  {
    icon: Lightbulb,
    title: "Tourism Awareness Initiatives",
    desc: "Community and destination awareness programs that inspire new travelers.",
  },
];

const VALUES = [
  { label: "Professionalism", icon: Briefcase },
  { label: "Transparency", icon: Shield },
  { label: "Customer Satisfaction", icon: Star },
  { label: "Timely Communication", icon: Megaphone },
  { label: "Reliable Service", icon: CheckCircle },
  { label: "Ethical Practices", icon: Handshake },
  { label: "Sustainable Growth", icon: TrendingUp },
];

const JOURNEY_TYPES = [
  {
    icon: Plane,
    label: "Flights",
    desc: "International & domestic bookings",
  },
  {
    icon: Hotel,
    label: "Hotels",
    desc: "Luxury to budget accommodations",
  },
  {
    icon: Heart,
    label: "Family Vacation",
    desc: "Safe holidays for the whole family",
  },
  {
    icon: Building2,
    label: "Corporate Travel",
    desc: "Business meetings & retreats",
  },
  {
    icon: Users,
    label: "Group Travel",
    desc: "Coordinated group journeys",
  },
  {
    icon: Star,
    label: "Honeymoon",
    desc: "Romantic getaways & holiday deals",
  },
  {
    icon: GraduationCap,
    label: "Educational Trips",
    desc: "School excursions & student travel",
  },
  {
    icon: BookOpen,
    label: "Religious Travel",
    desc: "Pilgrimages & faith-based journeys",
  },
  {
    icon: Mountain,
    label: "Adventure Packages",
    desc: "Thrilling outdoor experiences",
  },
  {
    icon: Briefcase,
    label: "Business Coordination",
    desc: "Executive travel & logistics",
  },
  {
    icon: Globe,
    label: "Conference Travel",
    desc: "Event & conference management",
  },
  {
    icon: Settings2,
    label: "Customized Solutions",
    desc: "Bespoke plans for every need",
  },
];

const CLIENT_SEGMENTS = [
  { label: "Families", icon: Heart },
  { label: "Corporates", icon: Building2 },
  { label: "Conferences", icon: Megaphone },
  { label: "Tourists", icon: Globe },
  { label: "Educational", icon: GraduationCap },
  { label: "Religious Groups", icon: BookOpen },
  { label: "Government", icon: Shield },
  { label: "Executives", icon: Briefcase },
  { label: "Group Travelers", icon: Users },
];

const NAV_LABELS: Record<string, string> = {
  about: "About",
  services: "Services",
  partnership: "Partnership",
  contact: "Contact",
};

// ─── Components ───────────────────────────────────────────────────────────────

function EyebrowHeading({
  label,
  title,
  subtitle,
  align = "center",
}: {
  label?: string;
  title: string;
  subtitle?: string;
  align?: "center" | "left";
}) {
  const isCenter = align === "center";
  return (
    <div
      className={`flex flex-col ${isCenter ? "items-center text-center" : "items-start text-left"} mb-14`}
    >
      {label && <p className="section-eyebrow mb-3">{label}</p>}
      <h2 className="heading-display font-display text-4xl md:text-5xl font-bold text-foreground mb-4 leading-tight max-w-3xl">
        {title}
      </h2>
      {isCenter && <div className="divider-gold mb-5" />}
      {subtitle && (
        <p
          className={`font-body text-lg text-muted-foreground leading-relaxed ${isCenter ? "max-w-2xl" : "max-w-xl"}`}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}

// ─── PlanJourney ──────────────────────────────────────────────────────────────

function PlanJourneySection() {
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const toggle = (label: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(label)) next.delete(label);
      else next.add(label);
      return next;
    });
  };

  const selectedList = Array.from(selected);

  return (
    <section
      id="plan-journey"
      data-ocid="plan_journey.section"
      className="py-20 md:py-28 bg-muted/30"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <EyebrowHeading
          label="Plan Your Journey"
          title="Craft Your Perfect Journey"
          subtitle="Select one or more travel types below. Our team will match you with the perfect TRIPNEX services for your journey."
        />

        {/* Card grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-10">
          {JOURNEY_TYPES.map(({ icon: Icon, label, desc }, i) => {
            const isSelected = selected.has(label);
            return (
              <motion.button
                key={label}
                type="button"
                data-ocid={`plan_journey.card.${i + 1}`}
                onClick={() => toggle(label)}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: (i % 4) * 0.07 }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                aria-pressed={isSelected}
                className={`text-left rounded-xl p-5 transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring glass-card ${
                  isSelected ? "border-secondary bg-secondary/10" : ""
                }`}
              >
                <div
                  className={`rounded-full p-2.5 w-fit mb-3 transition-colors duration-200 ${
                    isSelected ? "bg-secondary/25" : "bg-secondary/10"
                  }`}
                >
                  <Icon
                    className={`h-5 w-5 transition-colors duration-200 ${
                      isSelected ? "text-secondary" : "text-secondary/70"
                    }`}
                  />
                </div>
                <p
                  className={`font-display text-sm font-semibold leading-snug mb-1 ${
                    isSelected ? "text-secondary" : "text-foreground"
                  }`}
                >
                  {label}
                </p>
                <p className="font-body text-muted-foreground text-xs leading-relaxed">
                  {desc}
                </p>
                {isSelected && (
                  <div className="mt-2 flex items-center gap-1">
                    <CheckCircle className="h-3.5 w-3.5 text-secondary" />
                    <span className="font-body text-secondary text-xs font-medium">
                      Selected
                    </span>
                  </div>
                )}
              </motion.button>
            );
          })}
        </div>

        {/* Summary panel */}
        <motion.div layout className="glass-card rounded-2xl p-6 md:p-8">
          <p className="font-body text-xs uppercase tracking-wider text-muted-foreground mb-4 font-medium">
            Your Selections
          </p>

          <AnimatePresence mode="wait">
            {selectedList.length === 0 ? (
              <motion.p
                key="empty"
                data-ocid="plan_journey.empty_state"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="font-body text-muted-foreground text-sm italic"
              >
                Select your travel type above to see matched services
              </motion.p>
            ) : (
              <motion.div
                key="chips"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-wrap gap-2"
              >
                {selectedList.map((label) => (
                  <motion.button
                    key={label}
                    type="button"
                    layout
                    initial={{ opacity: 0, scale: 0.85 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.85 }}
                    transition={{ duration: 0.2 }}
                    data-ocid="plan_journey.tag"
                    onClick={() => toggle(label)}
                    aria-label={`Remove ${label}`}
                    className="inline-flex items-center gap-1.5 rounded-full border border-secondary/40 bg-secondary/15 px-3.5 py-1.5 font-body text-sm font-medium text-secondary hover:bg-secondary/25 hover:border-secondary/60 transition-colors duration-150 cursor-pointer"
                  >
                    {label}
                    <span
                      aria-hidden="true"
                      className="text-secondary/60 text-base leading-none"
                    >
                      ×
                    </span>
                  </motion.button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {selectedList.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="mt-6 pt-5 border-t border-border/40 flex flex-col sm:flex-row items-start sm:items-center gap-4"
            >
              <div className="flex-1">
                <p className="font-body text-foreground text-sm font-semibold">
                  {selectedList.length === 1
                    ? "1 travel type selected"
                    : `${selectedList.length} travel types selected`}
                </p>
                <p className="font-body text-muted-foreground text-xs mt-0.5">
                  Our team will tailor a package that matches your choices.
                </p>
              </div>
              <Button
                type="button"
                data-ocid="plan_journey.contact_button"
                onClick={() =>
                  document
                    .getElementById("contact")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className="btn-premium font-body font-bold px-7 py-5 rounded-xl shrink-0"
              >
                Contact Us About My Trip
              </Button>
            </motion.div>
          )}
        </motion.div>

        {selectedList.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-6 text-center"
          >
            <Button
              type="button"
              data-ocid="plan_journey.contact_cta_button"
              variant="outline"
              onClick={() =>
                document
                  .getElementById("contact")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="border-secondary/40 text-secondary hover:bg-secondary/10 hover:border-secondary/60 font-body font-semibold px-8 py-5 rounded-xl"
            >
              Contact Us Directly
            </Button>
          </motion.div>
        )}
      </div>
    </section>
  );
}

// ─── Header ───────────────────────────────────────────────────────────────────

function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const scrollTo = (id: string) => {
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const NAV_LINKS = ["about", "services", "partnership", "contact"];

  return (
    <header
      data-ocid="header"
      className={`fixed top-0 left-0 right-0 z-50 transition-smooth ${
        scrolled
          ? "bg-background/80 backdrop-blur-xl border-b border-border/50 shadow-subtle"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <button
            type="button"
            aria-label="Back to top"
            className="flex items-center gap-2.5 cursor-pointer bg-transparent border-0 p-0"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            <div className="bg-secondary/20 rounded-lg p-1.5">
              <Plane className="h-5 w-5 text-secondary" />
            </div>
            <span className="font-display font-bold text-xl md:text-2xl text-foreground tracking-tight">
              TRIP<span className="text-gradient-gold">NEX</span>
            </span>
          </button>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((id) => (
              <button
                key={id}
                type="button"
                data-ocid={`nav.${id}`}
                onClick={() => scrollTo(id)}
                className="nav-link-gold font-body text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200 cursor-pointer bg-transparent border-0 p-0"
              >
                {NAV_LABELS[id] ?? id}
              </button>
            ))}
          </nav>

          {/* CTA */}
          <div className="hidden md:block">
            <Button
              type="button"
              data-ocid="header.cta_button"
              onClick={() => scrollTo("contact")}
              className="btn-premium font-body font-bold px-6 py-2.5 rounded-xl"
            >
              Get in Touch
            </Button>
          </div>

          {/* Mobile menu toggle */}
          <button
            type="button"
            data-ocid="header.mobile_menu_button"
            className="md:hidden p-2 text-foreground"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            <div className="space-y-1.5">
              <span
                className={`block h-0.5 w-6 bg-foreground transition-smooth ${menuOpen ? "rotate-45 translate-y-2" : ""}`}
              />
              <span
                className={`block h-0.5 w-6 bg-foreground transition-smooth ${menuOpen ? "opacity-0" : ""}`}
              />
              <span
                className={`block h-0.5 w-6 bg-foreground transition-smooth ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`}
              />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-card/98 backdrop-blur-md border-t border-border/60 overflow-hidden"
          >
            <div className="px-4 py-4 flex flex-col gap-3">
              {NAV_LINKS.map((id) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => scrollTo(id)}
                  className="text-left font-body text-base font-medium capitalize text-muted-foreground hover:text-secondary py-2 bg-transparent border-0"
                >
                  {id.charAt(0).toUpperCase() + id.slice(1)}
                </button>
              ))}
              <Button
                type="button"
                onClick={() => scrollTo("contact")}
                className="mt-2 btn-premium font-body font-bold rounded-xl"
              >
                Get in Touch
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

function HeroSection() {
  return (
    <section
      id="hero"
      data-ocid="hero.section"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/assets/tripnex-hero.png')" }}
      />
      {/* Multi-layer overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/65 via-background/40 to-background/90" />
      <div className="absolute inset-0 bg-gradient-to-r from-background/70 via-background/20 to-transparent" />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 20% 50%, oklch(0.25 0.12 255 / 0.25) 0%, transparent 60%)",
        }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-3xl"
        >
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Badge className="mb-6 bg-secondary/15 text-secondary border-secondary/30 font-body tracking-widest uppercase text-xs px-4 py-1.5">
              Premium Travel Agency · Abuja
            </Badge>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="heading-display font-display text-5xl md:text-7xl font-bold text-foreground leading-[1.03] mb-6"
          >
            Your Gateway to{" "}
            <span className="text-gradient-gold">Unforgettable</span> Journeys
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="font-body text-lg md:text-xl text-foreground/70 leading-relaxed mb-10 max-w-2xl"
          >
            From weekend escapes to global expeditions — your next adventure
            begins with TRIPNEX.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="flex flex-wrap gap-4"
          >
            <Button
              type="button"
              data-ocid="hero.explore_button"
              size="lg"
              onClick={() =>
                document
                  .getElementById("services")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="btn-premium font-body font-bold text-base px-8 py-6 rounded-xl"
            >
              Explore Our Services
            </Button>
            <Button
              type="button"
              data-ocid="hero.partner_button"
              variant="outline"
              size="lg"
              onClick={() =>
                document
                  .getElementById("partnership")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="border-secondary/50 text-secondary bg-secondary/5 hover:bg-secondary/15 hover:border-secondary/80 font-body font-semibold text-base px-8 py-6 rounded-xl transition-smooth"
            >
              Partner With Us
            </Button>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{
          repeat: Number.POSITIVE_INFINITY,
          duration: 2.2,
          ease: "easeInOut",
        }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted-foreground/50 cursor-pointer"
        onClick={() =>
          document
            .getElementById("about")
            ?.scrollIntoView({ behavior: "smooth" })
        }
      >
        <span className="font-body text-xs tracking-widest uppercase opacity-60">
          Scroll
        </span>
        <ChevronDown className="h-5 w-5" />
      </motion.div>
    </section>
  );
}

// ─── About ────────────────────────────────────────────────────────────────────

function AboutSection() {
  return (
    <section
      id="about"
      data-ocid="about.section"
      className="py-20 md:py-28 bg-muted/30"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <EyebrowHeading
          label="Our Story"
          title="Modern Travel & Tourism, Built for You"
          subtitle="A modern travel company based in Abuja, serving families, corporates, and adventurers worldwide — reaching every destination with care and precision."
        />
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Left — story */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="font-body text-muted-foreground text-lg leading-relaxed mb-6">
              We focus on delivering professional travel experiences tailored to
              the unique needs of each client — from individual families to
              large corporate organizations and government delegations.
            </p>
            <p className="font-body text-muted-foreground leading-relaxed mb-8">
              Our mission is to simplify travel while maintaining excellence,
              reliability, customer satisfaction, and global connectivity —
              connecting people to the world through seamless travel
              experiences.
            </p>
          </motion.div>

          {/* Right — client segments */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <p className="section-eyebrow mb-6">We Serve</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {CLIENT_SEGMENTS.map(({ label, icon: Icon }, i) => (
                <motion.div
                  key={label}
                  data-ocid={`about.segment.${i + 1}`}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.06 }}
                  className="glass-card rounded-xl p-4 text-center"
                >
                  <div className="bg-secondary/15 rounded-full p-2.5 w-fit mx-auto mb-2">
                    <Icon className="h-4 w-4 text-secondary" />
                  </div>
                  <p className="font-body text-foreground text-sm font-semibold leading-snug">
                    {label}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ─── Services ─────────────────────────────────────────────────────────────────

function ServicesSection() {
  return (
    <section
      id="services"
      data-ocid="services.section"
      className="py-20 md:py-28 bg-background"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <EyebrowHeading
          label="What We Offer"
          title="Comprehensive Travel Services"
          subtitle="From a quick domestic flight to a full corporate travel program — TRIPNEX handles every detail so you can focus on the journey."
        />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {SERVICES.map(({ icon: Icon, title, desc }, i) => (
            <motion.div
              key={title}
              data-ocid={`services.item.${i + 1}`}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: (i % 4) * 0.07 }}
              className="glass-card rounded-2xl p-6 h-full group"
            >
              <div className="bg-secondary/15 rounded-full p-3 w-fit mb-4 transition-smooth group-hover:bg-secondary/25">
                <Icon className="h-5 w-5 text-secondary" />
              </div>
              <h3 className="font-display text-base font-semibold text-foreground mb-2 leading-snug">
                {title}
              </h3>
              <p className="font-body text-muted-foreground text-sm leading-relaxed">
                {desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Partnership ──────────────────────────────────────────────────────────────

function PartnershipSection() {
  return (
    <section
      id="partnership"
      data-ocid="partnership.section"
      className="py-20 md:py-28 bg-background"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <EyebrowHeading
          label="Collaborate With Us"
          title="Strategic Partnership Opportunities"
          subtitle="Establish a mutually beneficial relationship with TRIPNEX — designed to expand your market reach, increase revenue, and deliver exceptional travel experiences."
        />

        {/* Benefits grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-14">
          {PARTNERSHIP_BENEFITS.map(({ text }, i) => (
            <motion.div
              key={text}
              data-ocid={`partnership.item.${i + 1}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: (i % 4) * 0.08 }}
              className="glass-card rounded-2xl p-5 flex items-start gap-3"
            >
              <div className="bg-secondary/15 rounded-lg p-2 shrink-0 mt-0.5">
                <CheckCircle className="h-4 w-4 text-secondary" />
              </div>
              <p className="font-body text-foreground text-sm font-medium leading-snug">
                {text}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Partner tier cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {PARTNER_TIERS.map((tier, i) => (
            <motion.div
              key={tier.name}
              data-ocid={`partnership.tier.${i + 1}`}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="glass-card rounded-2xl p-7 flex flex-col"
            >
              <div
                className={`inline-flex items-center self-start mb-4 px-3.5 py-1 rounded-full font-body text-xs font-bold tracking-wider uppercase border ${
                  i === 0
                    ? "bg-muted/50 text-muted-foreground border-border/60"
                    : i === 1
                      ? "bg-secondary/20 text-secondary border-secondary/40"
                      : "bg-secondary/30 text-secondary border-secondary/60"
                }`}
              >
                {tier.name}
              </div>
              <p className="font-body text-muted-foreground text-sm leading-relaxed mb-5 flex-1">
                {tier.desc}
              </p>
              <ul className="space-y-2.5">
                {tier.perks.map((perk) => (
                  <li key={perk} className="flex items-start gap-2.5">
                    <CheckCircle className="h-4 w-4 text-secondary shrink-0 mt-0.5" />
                    <span className="font-body text-foreground text-sm">
                      {perk}
                    </span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        <div className="text-center">
          <Button
            type="button"
            data-ocid="partnership.cta_button"
            size="lg"
            onClick={() =>
              document
                .getElementById("contact")
                ?.scrollIntoView({ behavior: "smooth" })
            }
            className="btn-premium font-body font-bold text-base px-10 py-6 rounded-xl"
          >
            Partner With Us Today
          </Button>
        </div>
      </div>
    </section>
  );
}

// ─── Marketing ────────────────────────────────────────────────────────────────

function MarketingSection() {
  return (
    <section
      id="marketing"
      data-ocid="marketing.section"
      className="py-20 md:py-28 bg-muted/30"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <EyebrowHeading
          label="Growth Strategy"
          title="Marketing & Promotion Strategy"
          subtitle="TRIPNEX leverages powerful marketing channels to amplify partner visibility and attract a growing base of travelers and corporate clients."
        />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {MARKETING.map(({ title, desc }, i) => (
            <motion.div
              key={title + String(i)}
              data-ocid={`marketing.item.${i + 1}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="glass-card rounded-2xl p-6 flex gap-5 items-start"
            >
              {/* Numbered gold circle badge */}
              <div className="bg-secondary/20 text-secondary rounded-full w-8 h-8 flex items-center justify-center font-body font-bold text-sm shrink-0">
                {i + 1}
              </div>
              <div>
                <h3 className="font-display text-base font-semibold text-foreground mb-1.5">
                  {title}
                </h3>
                <p className="font-body text-muted-foreground text-sm leading-relaxed">
                  {desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Values ───────────────────────────────────────────────────────────────────

function ValuesSection() {
  return (
    <section
      id="values"
      data-ocid="values.section"
      className="py-20 md:py-28 bg-background"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <EyebrowHeading
          label="Who We Are"
          title="Our Commitment to Excellence"
          subtitle="Every interaction at TRIPNEX is guided by unwavering values that build trust and deliver lasting partnerships."
        />
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {VALUES.map(({ label, icon: Icon }, i) => (
            <motion.div
              key={label}
              data-ocid={`values.item.${i + 1}`}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
              className="glass-card rounded-2xl p-6 flex flex-col items-center text-center gap-3"
            >
              <div className="bg-secondary/15 rounded-full p-3">
                <Icon className="h-5 w-5 text-secondary" />
              </div>
              <p className="font-display text-foreground text-sm font-semibold leading-snug">
                {label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Contact ──────────────────────────────────────────────────────────────────

function ContactSection() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setForm({ name: "", email: "", message: "" });
    setTimeout(() => setSubmitted(false), 5000);
  };

  const contactDetails = [
    {
      icon: MapPin,
      label: "Location",
      value: "Abuja, Nigeria",
      href: undefined as string | undefined,
    },
    {
      icon: Mail,
      label: "Email",
      value: "info@tripnex.com",
      href: "mailto:info@tripnex.com",
    },
    {
      icon: Phone,
      label: "Phone",
      value: "+234 XXX XXX XXXX",
      href: "tel:+234XXXXXXXXXX",
    },
    {
      icon: Globe,
      label: "Website",
      value: "tripnex.com",
      href: "https://tripnex.com",
    },
  ];

  return (
    <section
      id="contact"
      data-ocid="contact.section"
      className="py-20 md:py-28 bg-muted/30"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <EyebrowHeading
          label="Get In Touch"
          title="Let's Start a Conversation"
          subtitle="Ready to explore partnership opportunities or plan your next journey? Reach out to the TRIPNEX team — we're ready to help."
        />
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-4"
          >
            <h3 className="font-display text-xl font-semibold text-foreground mb-6">
              Contact Information
            </h3>
            {contactDetails.map(({ icon: Icon, label, value, href }) => (
              <div
                key={label}
                className="glass-card rounded-2xl p-5 flex items-center gap-4"
              >
                <div className="bg-secondary/15 rounded-lg p-3 shrink-0">
                  <Icon className="h-5 w-5 text-secondary" />
                </div>
                <div>
                  <p className="font-body text-muted-foreground text-xs uppercase tracking-wider mb-0.5">
                    {label}
                  </p>
                  {href ? (
                    <a
                      href={href}
                      className="font-body text-foreground font-medium hover:text-secondary transition-smooth"
                    >
                      {value}
                    </a>
                  ) : (
                    <p className="font-body text-foreground font-medium">
                      {value}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </motion.div>

          {/* Contact form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div className="glass-card rounded-2xl p-6 md:p-8">
              <h3 className="font-display text-xl font-semibold text-foreground mb-6">
                Send a Message
              </h3>
              {submitted ? (
                <motion.div
                  data-ocid="contact.success_state"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center py-12 text-center gap-4"
                >
                  <div className="bg-secondary/20 rounded-full p-4">
                    <CheckCircle className="h-8 w-8 text-secondary" />
                  </div>
                  <h4 className="font-display text-xl font-semibold text-foreground">
                    Message Sent!
                  </h4>
                  <p className="font-body text-muted-foreground">
                    Thank you for reaching out. The TRIPNEX team will be in
                    touch shortly.
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label
                      className="font-body text-sm font-medium text-foreground block mb-1.5"
                      htmlFor="contact-name"
                    >
                      Full Name
                    </label>
                    <input
                      id="contact-name"
                      data-ocid="contact.name_input"
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, name: e.target.value }))
                      }
                      className="w-full rounded-xl border border-border/50 bg-card/70 backdrop-blur-sm px-4 py-3 font-body text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary transition-smooth"
                      placeholder="Your full name"
                    />
                  </div>
                  <div>
                    <label
                      className="font-body text-sm font-medium text-foreground block mb-1.5"
                      htmlFor="contact-email"
                    >
                      Email Address
                    </label>
                    <input
                      id="contact-email"
                      data-ocid="contact.email_input"
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, email: e.target.value }))
                      }
                      className="w-full rounded-xl border border-border/50 bg-card/70 backdrop-blur-sm px-4 py-3 font-body text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary transition-smooth"
                      placeholder="you@organization.com"
                    />
                  </div>
                  <div>
                    <label
                      className="font-body text-sm font-medium text-foreground block mb-1.5"
                      htmlFor="contact-message"
                    >
                      Message
                    </label>
                    <textarea
                      id="contact-message"
                      data-ocid="contact.message_textarea"
                      required
                      rows={4}
                      value={form.message}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, message: e.target.value }))
                      }
                      className="w-full rounded-xl border border-border/50 bg-card/70 backdrop-blur-sm px-4 py-3 font-body text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary transition-smooth resize-none"
                      placeholder="Tell us about your travel needs or partnership interest..."
                    />
                  </div>
                  <Button
                    type="submit"
                    data-ocid="contact.submit_button"
                    className="w-full btn-premium font-body font-bold py-6 rounded-xl"
                  >
                    Send Message
                  </Button>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────

function Footer() {
  const year = new Date().getFullYear();
  const NAV_LINKS = ["about", "services", "partnership", "contact"];
  return (
    <footer data-ocid="footer" className="bg-card py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top gold divider */}
        <div className="divider-gold-wide mb-12" />

        {/* Three-column grid */}
        <div className="grid md:grid-cols-3 gap-10 mb-10">
          {/* Brand column */}
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="bg-secondary/20 rounded-lg p-1.5">
                <Plane className="h-5 w-5 text-secondary" />
              </div>
              <span className="font-display font-bold text-2xl text-foreground tracking-tight">
                TRIP<span className="text-gradient-gold">NEX</span>
              </span>
            </div>
            <p className="font-body text-muted-foreground text-sm leading-relaxed max-w-xs">
              Connecting People to the World Through Seamless Travel
              Experiences.
            </p>
            <p className="font-body text-muted-foreground/60 text-xs mt-4 italic">
              Based in Abuja, Nigeria · Serving the World
            </p>
          </div>

          {/* Quick links */}
          <div>
            <p className="section-eyebrow mb-5">Quick Links</p>
            <ul className="space-y-3">
              {NAV_LINKS.map((id) => (
                <li key={id}>
                  <button
                    type="button"
                    onClick={() =>
                      document
                        .getElementById(id)
                        ?.scrollIntoView({ behavior: "smooth" })
                    }
                    className="nav-link-gold font-body text-sm text-muted-foreground hover:text-secondary transition-colors duration-200 capitalize bg-transparent border-0 cursor-pointer"
                  >
                    {id.charAt(0).toUpperCase() + id.slice(1)}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact details */}
          <div>
            <p className="section-eyebrow mb-5">Contact Us</p>
            <ul className="space-y-3">
              <li className="flex items-center gap-2">
                <MapPin className="h-3.5 w-3.5 text-secondary shrink-0" />
                <span className="font-body text-muted-foreground text-sm">
                  Abuja, Nigeria
                </span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-3.5 w-3.5 text-secondary shrink-0" />
                <a
                  href="mailto:info@tripnex.com"
                  className="font-body text-muted-foreground text-sm hover:text-secondary transition-colors duration-200"
                >
                  info@tripnex.com
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-3.5 w-3.5 text-secondary shrink-0" />
                <span className="font-body text-muted-foreground text-sm">
                  +234 XXX XXX XXXX
                </span>
              </li>
              <li className="flex items-center gap-2">
                <Globe className="h-3.5 w-3.5 text-secondary shrink-0" />
                <a
                  href="https://tripnex.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-body text-secondary hover:text-secondary/80 text-sm font-medium transition-colors duration-200"
                >
                  tripnex.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom divider + copyright */}
        <div className="divider-gold-wide mb-6" />
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="font-body text-muted-foreground text-xs">
            &copy; {year} TRIPNEX. All rights reserved.
          </p>
          <p className="font-body text-muted-foreground text-xs">
            Built with love using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-secondary hover:text-secondary/80 transition-colors duration-200"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function TripnexHomePage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <HeroSection />
      <AboutSection />
      <ServicesSection />
      <PlanJourneySection />
      <PartnershipSection />
      <MarketingSection />
      <ValuesSection />
      <ContactSection />
      <Footer />
    </div>
  );
}
