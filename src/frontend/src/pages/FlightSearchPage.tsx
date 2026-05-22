import { Layout } from "@/components/Layout";
import { useGetPopularRoutes, useSearchAirports } from "@/hooks/useFlightHooks";
import type {
  CabinClass,
  FlightSearchParams,
  PassengerCounts,
  TripType,
} from "@/types";
import { useNavigate } from "@tanstack/react-router";
import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

const HERO_IMAGE = "/assets/images/hero-bg.png";

export default function FlightSearchPage() {
  const navigate = useNavigate();
  const [tripType, setTripType] = useState<TripType>("roundTrip");
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [departureDate, setDepartureDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [passengers, setPassengers] = useState<PassengerCounts>({
    adults: 1n,
    children: 0n,
    infants: 0n,
  });
  const [cabinClass, setCabinClass] = useState<CabinClass>("economy");
  const [showPassengerPicker, setShowPassengerPicker] = useState(false);

  const totalPassengers =
    Number(passengers.adults) +
    Number(passengers.children) +
    Number(passengers.infants);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!origin || !destination || !departureDate) return;
    const params: FlightSearchParams = {
      origin,
      destination,
      departureDate,
      returnDate: tripType === "roundTrip" ? returnDate : undefined,
      tripType,
      cabinClass,
      passengers,
    };
    const query = new URLSearchParams({
      origin,
      destination,
      departureDate,
      tripType,
      cabinClass,
      adults: String(passengers.adults),
      children: String(passengers.children),
      infants: String(passengers.infants),
    });
    if (tripType === "roundTrip" && returnDate)
      query.set("returnDate", returnDate);
    void navigate({
      to: "/results",
      search: Object.fromEntries(query.entries()),
    });
    void params;
  }

  return (
    <Layout transparent>
      {/* Hero */}
      <section
        className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
        data-ocid="hero.section"
      >
        {/* Background */}
        <div className="absolute inset-0 z-0">
          <img src={HERO_IMAGE} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/50 to-background/90" />
        </div>

        {/* Hero text */}
        <div className="relative z-10 text-center px-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <img
              src="/assets/file_000000003b907246a43b21b7187833c0-019e4655-06d8-7068-8a66-d3537478a031.png"
              alt="TRIPNEX"
              className="h-16 w-auto object-contain mx-auto mb-4 drop-shadow-lg"
            />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="font-display text-5xl sm:text-6xl font-bold text-foreground tracking-tight mb-3"
          >
            Fly Beyond Limits
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="text-muted-foreground text-lg max-w-md mx-auto"
          >
            Premium flights to every corner of the world
          </motion.p>
        </div>

        {/* Search form */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.45 }}
          className="relative z-10 w-full max-w-4xl mx-auto px-4"
        >
          <form
            onSubmit={handleSearch}
            className="bg-card/80 backdrop-blur-md border border-border/60 rounded-2xl p-6 shadow-2xl"
            data-ocid="flight-search.form"
          >
            {/* Trip type toggle */}
            <div className="flex gap-2 mb-5">
              {(["roundTrip", "oneWay"] as TripType[]).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setTripType(type)}
                  data-ocid={`trip-type.${type}`}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                    tripType === type
                      ? "bg-secondary text-secondary-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  {type === "roundTrip" ? "Round Trip" : "One Way"}
                </button>
              ))}
            </div>

            {/* Main inputs row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-3">
              <AirportInput
                label="From"
                placeholder="City or airport"
                value={origin}
                onChange={setOrigin}
                ocid="origin"
              />
              <AirportInput
                label="To"
                placeholder="City or airport"
                value={destination}
                onChange={setDestination}
                ocid="destination"
              />
              <div className="flex flex-col gap-1">
                <label
                  htmlFor="departure-date"
                  className="text-xs text-muted-foreground font-medium uppercase tracking-wide"
                >
                  Departure
                </label>
                <input
                  id="departure-date"
                  type="date"
                  value={departureDate}
                  onChange={(e) => setDepartureDate(e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                  required
                  data-ocid="departure-date.input"
                  className="bg-muted border border-border/60 rounded-lg px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              {tripType === "roundTrip" ? (
                <div className="flex flex-col gap-1">
                  <label
                    htmlFor="return-date"
                    className="text-xs text-muted-foreground font-medium uppercase tracking-wide"
                  >
                    Return
                  </label>
                  <input
                    id="return-date"
                    type="date"
                    value={returnDate}
                    onChange={(e) => setReturnDate(e.target.value)}
                    min={
                      departureDate || new Date().toISOString().split("T")[0]
                    }
                    data-ocid="return-date.input"
                    className="bg-muted border border-border/60 rounded-lg px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
              ) : (
                <div />
              )}
            </div>

            {/* Second row: passengers + cabin + search */}
            <div className="flex flex-col sm:flex-row gap-3 items-end">
              {/* Passengers */}
              <div className="relative flex-1">
                <span className="text-xs text-muted-foreground font-medium uppercase tracking-wide block mb-1">
                  Passengers
                </span>
                <button
                  type="button"
                  onClick={() => setShowPassengerPicker(!showPassengerPicker)}
                  data-ocid="passenger-picker.toggle"
                  className="w-full bg-muted border border-border/60 rounded-lg px-3 py-2.5 text-sm text-foreground text-left focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  {totalPassengers} Passenger{totalPassengers !== 1 ? "s" : ""}
                </button>
                {showPassengerPicker && (
                  <PassengerPicker
                    value={passengers}
                    onChange={setPassengers}
                    onClose={() => setShowPassengerPicker(false)}
                  />
                )}
              </div>
              {/* Cabin class */}
              <div className="flex-1">
                <label
                  htmlFor="cabin-class"
                  className="text-xs text-muted-foreground font-medium uppercase tracking-wide block mb-1"
                >
                  Cabin
                </label>
                <select
                  id="cabin-class"
                  value={cabinClass}
                  onChange={(e) => setCabinClass(e.target.value as CabinClass)}
                  data-ocid="cabin-class.select"
                  className="w-full bg-muted border border-border/60 rounded-lg px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="economy">Economy</option>
                  <option value="business">Business</option>
                  <option value="first">First Class</option>
                </select>
              </div>
              {/* Search button */}
              <button
                type="submit"
                data-ocid="search-flights.submit_button"
                className="flex-1 sm:flex-none bg-secondary text-secondary-foreground font-semibold px-8 py-2.5 rounded-lg hover:brightness-110 transition-all shadow-md"
              >
                Search Flights
              </button>
            </div>
          </form>
        </motion.div>
      </section>

      {/* Popular routes */}
      <PopularRoutesSection />
    </Layout>
  );
}

// ── Airport Input with autocomplete ──────────────────────────────────────────
function AirportInput({
  label,
  placeholder,
  value,
  onChange,
  ocid,
}: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  ocid: string;
}) {
  const [query, setQuery] = useState(value);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { data: airports = [] } = useSearchAirports(query);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div className="flex flex-col gap-1 relative" ref={ref}>
      <label
        htmlFor={`airport-input-${ocid}`}
        className="text-xs text-muted-foreground font-medium uppercase tracking-wide"
      >
        {label}
      </label>
      <input
        id={`airport-input-${ocid}`}
        type="text"
        value={query}
        placeholder={placeholder}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        data-ocid={`${ocid}.input`}
        className="bg-muted border border-border/60 rounded-lg px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
      />
      {open && airports.length > 0 && (
        <ul
          className="absolute top-full mt-1 left-0 right-0 z-50 bg-card border border-border rounded-lg shadow-2xl max-h-52 overflow-y-auto"
          data-ocid={`${ocid}.dropdown_menu`}
        >
          {airports.slice(0, 8).map((airport) => (
            <li key={airport.code}>
              <button
                type="button"
                className="w-full px-3 py-2 text-left text-sm hover:bg-muted transition-colors flex items-center gap-2"
                onClick={() => {
                  const formatted = `${airport.city} (${airport.code})`;
                  setQuery(formatted);
                  onChange(airport.code);
                  setOpen(false);
                }}
              >
                <span className="font-mono text-xs font-bold text-secondary">
                  {airport.code}
                </span>
                <span className="text-foreground">{airport.city}</span>
                <span className="text-muted-foreground text-xs ml-auto">
                  {airport.country}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// ── Passenger Picker ──────────────────────────────────────────────────────────
function PassengerPicker({
  value,
  onChange,
  onClose,
}: {
  value: PassengerCounts;
  onChange: (v: PassengerCounts) => void;
  onClose: () => void;
}) {
  const rows: {
    key: keyof PassengerCounts;
    label: string;
    sub: string;
    min: number;
  }[] = [
    { key: "adults", label: "Adults", sub: "12+ years", min: 1 },
    { key: "children", label: "Children", sub: "2–11 years", min: 0 },
    { key: "infants", label: "Infants", sub: "Under 2", min: 0 },
  ];
  return (
    <div
      className="absolute top-full mt-1 left-0 z-50 bg-card border border-border rounded-xl shadow-2xl p-4 w-72"
      data-ocid="passenger-picker.popover"
    >
      {rows.map(({ key, label, sub, min }) => (
        <div
          key={key}
          className="flex items-center justify-between py-2.5 border-b border-border/40 last:border-0"
        >
          <div>
            <p className="text-sm font-medium text-foreground">{label}</p>
            <p className="text-xs text-muted-foreground">{sub}</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() =>
                onChange({
                  ...value,
                  [key]: BigInt(Math.max(min, Number(value[key]) - 1)),
                })
              }
              className="w-7 h-7 rounded-full bg-muted hover:bg-muted/80 text-foreground text-lg font-bold flex items-center justify-center transition-colors"
            >
              −
            </button>
            <span className="w-5 text-center text-sm font-semibold text-foreground">
              {value[key]}
            </span>
            <button
              type="button"
              onClick={() => onChange({ ...value, [key]: value[key] + 1n })}
              className="w-7 h-7 rounded-full bg-muted hover:bg-muted/80 text-foreground text-lg font-bold flex items-center justify-center transition-colors"
            >
              +
            </button>
          </div>
        </div>
      ))}
      <button
        type="button"
        onClick={onClose}
        className="mt-3 w-full bg-secondary text-secondary-foreground text-sm font-semibold py-2 rounded-lg hover:brightness-110 transition-all"
        data-ocid="passenger-picker.confirm_button"
      >
        Done
      </button>
    </div>
  );
}

// ── Popular Routes Section ────────────────────────────────────────────────────
function PopularRoutesSection() {
  const { data: routes = [], isLoading } = useGetPopularRoutes();
  const navigate = useNavigate();

  return (
    <section
      className="bg-muted/30 py-16 px-4"
      data-ocid="popular-routes.section"
    >
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <h2 className="font-display text-3xl font-bold text-foreground mb-2">
            Popular Routes
          </h2>
          <p className="text-muted-foreground">
            Top destinations our travelers love
          </p>
        </motion.div>
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {Array.from({ length: 8 }, (_, i) => `skeleton-route-${i}`).map(
              (key) => (
                <div
                  key={key}
                  className="bg-card rounded-xl h-28 animate-pulse"
                />
              ),
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {routes.map((route, i) => (
              <motion.button
                key={`${route.origin.code}-${route.destination.code}`}
                type="button"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                whileHover={{ y: -3 }}
                onClick={() =>
                  void navigate({
                    to: "/results",
                    search: {
                      origin: route.origin.code,
                      destination: route.destination.code,
                      departureDate: new Date(Date.now() + 7 * 86400000)
                        .toISOString()
                        .split("T")[0],
                      tripType: "roundTrip",
                      cabinClass: "economy",
                      adults: "1",
                      children: "0",
                      infants: "0",
                    },
                  })
                }
                data-ocid={`popular-routes.item.${i + 1}`}
                className="bg-card border border-border/60 rounded-xl p-4 text-left hover:border-secondary/60 hover:shadow-lg transition-all group"
              >
                <div className="flex items-center gap-1.5 mb-2">
                  <span className="font-mono text-xs font-bold text-secondary">
                    {route.origin.code}
                  </span>
                  <span className="text-muted-foreground text-xs">→</span>
                  <span className="font-mono text-xs font-bold text-secondary">
                    {route.destination.code}
                  </span>
                </div>
                <p className="text-sm font-semibold text-foreground truncate">
                  {route.origin.city} → {route.destination.city}
                </p>
                {route.typicalPrice && (
                  <p className="text-xs text-accent font-bold mt-1.5">
                    from ${route.typicalPrice.amount}
                  </p>
                )}
              </motion.button>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
