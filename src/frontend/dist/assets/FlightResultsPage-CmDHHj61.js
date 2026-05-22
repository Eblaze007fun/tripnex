import { c as createLucideIcon, d as useSearch, u as useNavigate, r as reactExports, e as useSearchFlights, j as jsxRuntimeExports, L as Layout, A as ArrowRight, m as motion, P as Plane } from "./index-Cy8AouOV.js";
import { C as Clock } from "./clock-BM7o3tNt.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  [
    "path",
    {
      d: "M10 20a1 1 0 0 0 .553.895l2 1A1 1 0 0 0 14 21v-7a2 2 0 0 1 .517-1.341L21.74 4.67A1 1 0 0 0 21 3H3a1 1 0 0 0-.742 1.67l7.225 7.989A2 2 0 0 1 10 14z",
      key: "sc7q7i"
    }
  ]
];
const Funnel = createLucideIcon("funnel", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["line", { x1: "21", x2: "14", y1: "4", y2: "4", key: "obuewd" }],
  ["line", { x1: "10", x2: "3", y1: "4", y2: "4", key: "1q6298" }],
  ["line", { x1: "21", x2: "12", y1: "12", y2: "12", key: "1iu8h1" }],
  ["line", { x1: "8", x2: "3", y1: "12", y2: "12", key: "ntss68" }],
  ["line", { x1: "21", x2: "16", y1: "20", y2: "20", key: "14d8ph" }],
  ["line", { x1: "12", x2: "3", y1: "20", y2: "20", key: "m0wm8r" }],
  ["line", { x1: "14", x2: "14", y1: "2", y2: "6", key: "14e1ph" }],
  ["line", { x1: "8", x2: "8", y1: "10", y2: "14", key: "1i6ji0" }],
  ["line", { x1: "16", x2: "16", y1: "18", y2: "22", key: "1lctlv" }]
];
const SlidersHorizontal = createLucideIcon("sliders-horizontal", __iconNode);
function FlightResultsPage() {
  const rawSearch = useSearch({ strict: false });
  const navigate = useNavigate();
  const [sortBy, setSortBy] = reactExports.useState("price");
  const [maxPrice, setMaxPrice] = reactExports.useState(2e3);
  const [maxStops, setMaxStops] = reactExports.useState(2);
  const [showFilters, setShowFilters] = reactExports.useState(false);
  const params = {
    origin: rawSearch.origin ?? "",
    destination: rawSearch.destination ?? "",
    departureDate: rawSearch.departureDate ?? "",
    returnDate: rawSearch.returnDate,
    tripType: rawSearch.tripType ?? "roundTrip",
    cabinClass: rawSearch.cabinClass ?? "economy",
    passengers: {
      adults: BigInt(rawSearch.adults ?? 1),
      children: BigInt(rawSearch.children ?? 0),
      infants: BigInt(rawSearch.infants ?? 0)
    }
  };
  const { data: flights = [], isLoading } = useSearchFlights(
    params.origin ? params : null
  );
  const filtered = reactExports.useMemo(() => {
    return flights.filter((f) => f.price.amount <= maxPrice && Number(f.stops) <= maxStops).sort((a, b) => {
      if (sortBy === "price") return a.price.amount - b.price.amount;
      if (sortBy === "duration")
        return Number(a.durationMinutes) - Number(b.durationMinutes);
      return a.departureTime.localeCompare(b.departureTime);
    });
  }, [flights, sortBy, maxPrice, maxStops]);
  const minFlightPrice = flights.length ? Math.min(...flights.map((f) => f.price.amount)) : 0;
  const maxFlightPrice = flights.length ? Math.max(...flights.map((f) => f.price.amount)) : 2e3;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "max-w-7xl mx-auto w-full px-4 sm:px-6 py-8",
      "data-ocid": "results.page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-foreground font-display text-2xl font-bold", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-secondary", children: params.origin }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "w-5 h-5 text-muted-foreground" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-secondary", children: params.destination })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-muted-foreground text-sm mt-1", children: [
              params.departureDate,
              " ·",
              " ",
              params.passengers.adults + params.passengers.children + params.passengers.infants,
              " ",
              "passenger(s) ·",
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "capitalize", children: params.cabinClass })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                onClick: () => setShowFilters(!showFilters),
                "data-ocid": "filters.toggle",
                className: "flex items-center gap-2 px-4 py-2 bg-card border border-border/60 rounded-lg text-sm font-medium hover:bg-muted transition-colors",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SlidersHorizontal, { className: "w-4 h-4" }),
                  "Filters"
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: () => void navigate({ to: "/" }),
                "data-ocid": "modify-search.button",
                className: "px-4 py-2 bg-secondary text-secondary-foreground rounded-lg text-sm font-semibold hover:brightness-110 transition-all",
                children: "Modify Search"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col lg:flex-row gap-6", children: [
          showFilters && /* @__PURE__ */ jsxRuntimeExports.jsx(
            motion.aside,
            {
              initial: { opacity: 0, x: -20 },
              animate: { opacity: 1, x: 0 },
              className: "lg:w-64 shrink-0",
              "data-ocid": "filters.panel",
              children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border/60 rounded-xl p-5 space-y-6 sticky top-24", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Funnel, { className: "w-4 h-4 text-secondary" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold text-foreground", children: "Filters" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "label",
                    {
                      htmlFor: "price-filter",
                      className: "text-xs font-semibold text-muted-foreground uppercase tracking-wide block mb-3",
                      children: "Max Price (USD)"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "input",
                    {
                      id: "price-filter",
                      type: "range",
                      min: minFlightPrice,
                      max: maxFlightPrice,
                      value: maxPrice,
                      onChange: (e) => setMaxPrice(Number(e.target.value)),
                      "data-ocid": "price-filter.input",
                      className: "w-full accent-secondary"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-xs text-muted-foreground mt-1", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                      "$",
                      minFlightPrice
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-secondary font-bold", children: [
                      "$",
                      maxPrice
                    ] })
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wide block mb-3", children: "Max Stops" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-2", children: [0, 1, 2].map((n) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      type: "button",
                      onClick: () => setMaxStops(n),
                      "data-ocid": `stops-filter.${n}`,
                      className: `flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${maxStops === n ? "bg-secondary text-secondary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/70"}`,
                      children: n === 0 ? "Direct" : n === 1 ? "1 Stop" : "2+ Stops"
                    },
                    n
                  )) })
                ] })
              ] })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground mr-2", children: "Sort by:" }),
              ["price", "duration", "departure"].map((key) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: () => setSortBy(key),
                  "data-ocid": `sort.${key}`,
                  className: `px-3 py-1 rounded-full text-xs font-medium transition-all ${sortBy === key ? "bg-secondary text-secondary-foreground" : "text-muted-foreground hover:text-foreground hover:bg-muted"}`,
                  children: key.charAt(0).toUpperCase() + key.slice(1)
                },
                key
              )),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "ml-auto text-xs text-muted-foreground", children: [
                filtered.length,
                " flight",
                filtered.length !== 1 ? "s" : ""
              ] })
            ] }),
            isLoading && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", "data-ocid": "results.loading_state", children: Array.from(
              { length: 4 },
              (_, i) => `skeleton-flight-${i}`
            ).map((key) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "bg-card rounded-xl h-28 animate-pulse"
              },
              key
            )) }),
            !isLoading && filtered.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "bg-card border border-border/60 rounded-xl p-16 text-center",
                "data-ocid": "results.empty_state",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Plane, { className: "w-12 h-12 text-muted-foreground mx-auto mb-4" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display text-xl font-bold text-foreground mb-2", children: "No flights found" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mb-6", children: "Try adjusting your filters or search for different dates." }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      type: "button",
                      onClick: () => void navigate({ to: "/" }),
                      className: "bg-secondary text-secondary-foreground font-semibold px-6 py-2.5 rounded-lg hover:brightness-110 transition-all",
                      "data-ocid": "results.search-again.button",
                      children: "Search Again"
                    }
                  )
                ]
              }
            ),
            !isLoading && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: filtered.map((flight, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(FlightCard, { flight, index: i }, flight.flightId)) })
          ] })
        ] })
      ]
    }
  ) });
}
function FlightCard({
  flight,
  index
}) {
  const navigate = useNavigate();
  const durationH = Math.floor(Number(flight.durationMinutes) / 60);
  const durationM = Number(flight.durationMinutes) % 60;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    motion.div,
    {
      initial: { opacity: 0, y: 16 },
      animate: { opacity: 1, y: 0 },
      transition: { delay: index * 0.05 },
      "data-ocid": `results.item.${index + 1}`,
      children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-card border border-border/60 rounded-xl p-5 hover:border-secondary/50 hover:shadow-lg transition-all group", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 sm:w-44 shrink-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-lg bg-primary/20 border border-border/60 flex items-center justify-center shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Plane, { className: "w-5 h-5 text-secondary" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-foreground truncate", children: flight.airline }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: flight.flightNumber })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex items-center gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-lg font-bold text-foreground font-display", children: flight.departureTime }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-secondary font-mono font-bold", children: flight.originCode })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 text-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground mb-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "w-3 h-3 inline mr-1" }),
              durationH,
              "h ",
              durationM,
              "m"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative h-px bg-border", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-secondary" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1", children: Number(flight.stops) === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-accent font-semibold", children: "Direct" }) : `${flight.stops} stop${Number(flight.stops) > 1 ? "s" : ""}` })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-lg font-bold text-foreground font-display", children: flight.arrivalTime }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-secondary font-mono font-bold", children: flight.destinationCode })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sm:text-right shrink-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-2xl font-bold text-foreground font-display", children: [
            "$",
            flight.price.amount
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground capitalize mb-2", children: flight.cabinClass }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: () => {
                sessionStorage.setItem(
                  "selectedFlight",
                  JSON.stringify(flight)
                );
                void navigate({ to: "/booking" });
              },
              "data-ocid": `results.book.${index + 1}`,
              className: "bg-secondary text-secondary-foreground text-sm font-semibold px-5 py-2 rounded-lg hover:brightness-110 transition-all whitespace-nowrap",
              children: "Select Flight"
            }
          )
        ] })
      ] }) })
    }
  );
}
export {
  FlightResultsPage as default
};
