import { Layout } from "@/components/Layout";
import { useSearchFlights } from "@/hooks/useFlightHooks";
import type { CabinClass, FlightResult } from "@/types";
import { useNavigate, useSearch } from "@tanstack/react-router";
import {
  ArrowRight,
  Clock,
  Filter,
  Plane,
  SlidersHorizontal,
} from "lucide-react";
import { motion } from "motion/react";
import { useMemo, useState } from "react";

type SortKey = "price" | "duration" | "departure";

interface SearchQueryParams {
  origin?: string;
  destination?: string;
  departureDate?: string;
  returnDate?: string;
  tripType?: string;
  cabinClass?: string;
  adults?: string;
  children?: string;
  infants?: string;
}

export default function FlightResultsPage() {
  const rawSearch = useSearch({ strict: false }) as SearchQueryParams;
  const navigate = useNavigate();
  const [sortBy, setSortBy] = useState<SortKey>("price");
  const [maxPrice, setMaxPrice] = useState(2000);
  const [maxStops, setMaxStops] = useState(2);
  const [showFilters, setShowFilters] = useState(false);

  const params = {
    origin: rawSearch.origin ?? "",
    destination: rawSearch.destination ?? "",
    departureDate: rawSearch.departureDate ?? "",
    returnDate: rawSearch.returnDate,
    tripType: (rawSearch.tripType ?? "roundTrip") as "oneWay" | "roundTrip",
    cabinClass: (rawSearch.cabinClass ?? "economy") as CabinClass,
    passengers: {
      adults: BigInt(rawSearch.adults ?? 1),
      children: BigInt(rawSearch.children ?? 0),
      infants: BigInt(rawSearch.infants ?? 0),
    },
  };

  const { data: flights = [], isLoading } = useSearchFlights(
    params.origin ? params : null,
  );

  const filtered = useMemo(() => {
    return flights
      .filter((f) => f.price.amount <= maxPrice && Number(f.stops) <= maxStops)
      .sort((a, b) => {
        if (sortBy === "price") return a.price.amount - b.price.amount;
        if (sortBy === "duration")
          return Number(a.durationMinutes) - Number(b.durationMinutes);
        return a.departureTime.localeCompare(b.departureTime);
      });
  }, [flights, sortBy, maxPrice, maxStops]);

  const minFlightPrice = flights.length
    ? Math.min(...flights.map((f) => f.price.amount))
    : 0;
  const maxFlightPrice = flights.length
    ? Math.max(...flights.map((f) => f.price.amount))
    : 2000;

  return (
    <Layout>
      <div
        className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-8"
        data-ocid="results.page"
      >
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-foreground font-display text-2xl font-bold">
              <span className="text-secondary">{params.origin}</span>
              <ArrowRight className="w-5 h-5 text-muted-foreground" />
              <span className="text-secondary">{params.destination}</span>
            </div>
            <p className="text-muted-foreground text-sm mt-1">
              {params.departureDate} ·{" "}
              {params.passengers.adults +
                params.passengers.children +
                params.passengers.infants}{" "}
              passenger(s) ·{" "}
              <span className="capitalize">{params.cabinClass}</span>
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              data-ocid="filters.toggle"
              className="flex items-center gap-2 px-4 py-2 bg-card border border-border/60 rounded-lg text-sm font-medium hover:bg-muted transition-colors"
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters
            </button>
            <button
              type="button"
              onClick={() => void navigate({ to: "/" })}
              data-ocid="modify-search.button"
              className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg text-sm font-semibold hover:brightness-110 transition-all"
            >
              Modify Search
            </button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filter sidebar */}
          {showFilters && (
            <motion.aside
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:w-64 shrink-0"
              data-ocid="filters.panel"
            >
              <div className="bg-card border border-border/60 rounded-xl p-5 space-y-6 sticky top-24">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-secondary" />
                  <h3 className="font-semibold text-foreground">Filters</h3>
                </div>
                {/* Price range */}
                <div>
                  <label
                    htmlFor="price-filter"
                    className="text-xs font-semibold text-muted-foreground uppercase tracking-wide block mb-3"
                  >
                    Max Price (USD)
                  </label>
                  <input
                    id="price-filter"
                    type="range"
                    min={minFlightPrice}
                    max={maxFlightPrice}
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                    data-ocid="price-filter.input"
                    className="w-full accent-secondary"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>${minFlightPrice}</span>
                    <span className="text-secondary font-bold">
                      ${maxPrice}
                    </span>
                  </div>
                </div>
                {/* Stops */}
                <div>
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide block mb-3">
                    Max Stops
                  </span>
                  <div className="flex gap-2">
                    {[0, 1, 2].map((n) => (
                      <button
                        key={n}
                        type="button"
                        onClick={() => setMaxStops(n)}
                        data-ocid={`stops-filter.${n}`}
                        className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                          maxStops === n
                            ? "bg-secondary text-secondary-foreground"
                            : "bg-muted text-muted-foreground hover:bg-muted/70"
                        }`}
                      >
                        {n === 0 ? "Direct" : n === 1 ? "1 Stop" : "2+ Stops"}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.aside>
          )}

          {/* Results */}
          <div className="flex-1">
            {/* Sort bar */}
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xs text-muted-foreground mr-2">
                Sort by:
              </span>
              {(["price", "duration", "departure"] as SortKey[]).map((key) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setSortBy(key)}
                  data-ocid={`sort.${key}`}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                    sortBy === key
                      ? "bg-secondary text-secondary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                </button>
              ))}
              <span className="ml-auto text-xs text-muted-foreground">
                {filtered.length} flight{filtered.length !== 1 ? "s" : ""}
              </span>
            </div>

            {/* Loading */}
            {isLoading && (
              <div className="space-y-3" data-ocid="results.loading_state">
                {Array.from(
                  { length: 4 },
                  (_, i) => `skeleton-flight-${i}`,
                ).map((key) => (
                  <div
                    key={key}
                    className="bg-card rounded-xl h-28 animate-pulse"
                  />
                ))}
              </div>
            )}

            {/* Empty */}
            {!isLoading && filtered.length === 0 && (
              <div
                className="bg-card border border-border/60 rounded-xl p-16 text-center"
                data-ocid="results.empty_state"
              >
                <Plane className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-display text-xl font-bold text-foreground mb-2">
                  No flights found
                </h3>
                <p className="text-muted-foreground mb-6">
                  Try adjusting your filters or search for different dates.
                </p>
                <button
                  type="button"
                  onClick={() => void navigate({ to: "/" })}
                  className="bg-secondary text-secondary-foreground font-semibold px-6 py-2.5 rounded-lg hover:brightness-110 transition-all"
                  data-ocid="results.search-again.button"
                >
                  Search Again
                </button>
              </div>
            )}

            {/* Flight cards */}
            {!isLoading && (
              <div className="space-y-3">
                {filtered.map((flight, i) => (
                  <FlightCard key={flight.flightId} flight={flight} index={i} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}

function FlightCard({
  flight,
  index,
}: { flight: FlightResult; index: number }) {
  const navigate = useNavigate();
  const durationH = Math.floor(Number(flight.durationMinutes) / 60);
  const durationM = Number(flight.durationMinutes) % 60;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      data-ocid={`results.item.${index + 1}`}
    >
      <div className="bg-card border border-border/60 rounded-xl p-5 hover:border-secondary/50 hover:shadow-lg transition-all group">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          {/* Airline */}
          <div className="flex items-center gap-3 sm:w-44 shrink-0">
            <div className="w-10 h-10 rounded-lg bg-primary/20 border border-border/60 flex items-center justify-center shrink-0">
              <Plane className="w-5 h-5 text-secondary" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-foreground truncate">
                {flight.airline}
              </p>
              <p className="text-xs text-muted-foreground">
                {flight.flightNumber}
              </p>
            </div>
          </div>

          {/* Route + time */}
          <div className="flex-1 flex items-center gap-4">
            <div className="text-center">
              <p className="text-lg font-bold text-foreground font-display">
                {flight.departureTime}
              </p>
              <p className="text-xs text-secondary font-mono font-bold">
                {flight.originCode}
              </p>
            </div>
            <div className="flex-1 text-center">
              <p className="text-xs text-muted-foreground mb-1">
                <Clock className="w-3 h-3 inline mr-1" />
                {durationH}h {durationM}m
              </p>
              <div className="relative h-px bg-border">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-secondary" />
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {Number(flight.stops) === 0 ? (
                  <span className="text-accent font-semibold">Direct</span>
                ) : (
                  `${flight.stops} stop${Number(flight.stops) > 1 ? "s" : ""}`
                )}
              </p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-foreground font-display">
                {flight.arrivalTime}
              </p>
              <p className="text-xs text-secondary font-mono font-bold">
                {flight.destinationCode}
              </p>
            </div>
          </div>

          {/* Price + CTA */}
          <div className="sm:text-right shrink-0">
            <p className="text-2xl font-bold text-foreground font-display">
              ${flight.price.amount}
            </p>
            <p className="text-xs text-muted-foreground capitalize mb-2">
              {flight.cabinClass}
            </p>
            <button
              type="button"
              onClick={() => {
                sessionStorage.setItem(
                  "selectedFlight",
                  JSON.stringify(flight),
                );
                void navigate({ to: "/booking" });
              }}
              data-ocid={`results.book.${index + 1}`}
              className="bg-secondary text-secondary-foreground text-sm font-semibold px-5 py-2 rounded-lg hover:brightness-110 transition-all whitespace-nowrap"
            >
              Select Flight
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
