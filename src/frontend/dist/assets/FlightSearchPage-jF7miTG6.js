import { u as useNavigate, r as reactExports, j as jsxRuntimeExports, L as Layout, m as motion, a as useSearchAirports, b as useGetPopularRoutes } from "./index-Cy8AouOV.js";
const HERO_IMAGE = "/assets/images/hero-bg.png";
function FlightSearchPage() {
  const navigate = useNavigate();
  const [tripType, setTripType] = reactExports.useState("roundTrip");
  const [origin, setOrigin] = reactExports.useState("");
  const [destination, setDestination] = reactExports.useState("");
  const [departureDate, setDepartureDate] = reactExports.useState("");
  const [returnDate, setReturnDate] = reactExports.useState("");
  const [passengers, setPassengers] = reactExports.useState({
    adults: 1n,
    children: 0n,
    infants: 0n
  });
  const [cabinClass, setCabinClass] = reactExports.useState("economy");
  const [showPassengerPicker, setShowPassengerPicker] = reactExports.useState(false);
  const totalPassengers = Number(passengers.adults) + Number(passengers.children) + Number(passengers.infants);
  function handleSearch(e) {
    e.preventDefault();
    if (!origin || !destination || !departureDate) return;
    const query = new URLSearchParams({
      origin,
      destination,
      departureDate,
      tripType,
      cabinClass,
      adults: String(passengers.adults),
      children: String(passengers.children),
      infants: String(passengers.infants)
    });
    if (tripType === "roundTrip" && returnDate)
      query.set("returnDate", returnDate);
    void navigate({
      to: "/results",
      search: Object.fromEntries(query.entries())
    });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Layout, { transparent: true, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "section",
      {
        className: "relative min-h-screen flex flex-col items-center justify-center overflow-hidden",
        "data-ocid": "hero.section",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute inset-0 z-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: HERO_IMAGE, alt: "", className: "w-full h-full object-cover" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gradient-to-b from-background/70 via-background/50 to-background/90" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative z-10 text-center px-4 mb-8", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              motion.div,
              {
                initial: { opacity: 0, y: -20 },
                animate: { opacity: 1, y: 0 },
                transition: { duration: 0.6 },
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "img",
                  {
                    src: "/assets/file_000000003b907246a43b21b7187833c0-019e4655-06d8-7068-8a66-d3537478a031.png",
                    alt: "TRIPNEX",
                    className: "h-16 w-auto object-contain mx-auto mb-4 drop-shadow-lg"
                  }
                )
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              motion.h1,
              {
                initial: { opacity: 0, y: 20 },
                animate: { opacity: 1, y: 0 },
                transition: { duration: 0.6, delay: 0.2 },
                className: "font-display text-5xl sm:text-6xl font-bold text-foreground tracking-tight mb-3",
                children: "Fly Beyond Limits"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              motion.p,
              {
                initial: { opacity: 0 },
                animate: { opacity: 1 },
                transition: { duration: 0.6, delay: 0.35 },
                className: "text-muted-foreground text-lg max-w-md mx-auto",
                children: "Premium flights to every corner of the world"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            motion.div,
            {
              initial: { opacity: 0, y: 30 },
              animate: { opacity: 1, y: 0 },
              transition: { duration: 0.6, delay: 0.45 },
              className: "relative z-10 w-full max-w-4xl mx-auto px-4",
              children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "form",
                {
                  onSubmit: handleSearch,
                  className: "bg-card/80 backdrop-blur-md border border-border/60 rounded-2xl p-6 shadow-2xl",
                  "data-ocid": "flight-search.form",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-2 mb-5", children: ["roundTrip", "oneWay"].map((type) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "button",
                      {
                        type: "button",
                        onClick: () => setTripType(type),
                        "data-ocid": `trip-type.${type}`,
                        className: `px-4 py-1.5 rounded-full text-sm font-medium transition-all ${tripType === type ? "bg-secondary text-secondary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground hover:bg-muted"}`,
                        children: type === "roundTrip" ? "Round Trip" : "One Way"
                      },
                      type
                    )) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-3", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        AirportInput,
                        {
                          label: "From",
                          placeholder: "City or airport",
                          value: origin,
                          onChange: setOrigin,
                          ocid: "origin"
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        AirportInput,
                        {
                          label: "To",
                          placeholder: "City or airport",
                          value: destination,
                          onChange: setDestination,
                          ocid: "destination"
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "label",
                          {
                            htmlFor: "departure-date",
                            className: "text-xs text-muted-foreground font-medium uppercase tracking-wide",
                            children: "Departure"
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "input",
                          {
                            id: "departure-date",
                            type: "date",
                            value: departureDate,
                            onChange: (e) => setDepartureDate(e.target.value),
                            min: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
                            required: true,
                            "data-ocid": "departure-date.input",
                            className: "bg-muted border border-border/60 rounded-lg px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                          }
                        )
                      ] }),
                      tripType === "roundTrip" ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "label",
                          {
                            htmlFor: "return-date",
                            className: "text-xs text-muted-foreground font-medium uppercase tracking-wide",
                            children: "Return"
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "input",
                          {
                            id: "return-date",
                            type: "date",
                            value: returnDate,
                            onChange: (e) => setReturnDate(e.target.value),
                            min: departureDate || (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
                            "data-ocid": "return-date.input",
                            className: "bg-muted border border-border/60 rounded-lg px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                          }
                        )
                      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", {})
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row gap-3 items-end", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex-1", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground font-medium uppercase tracking-wide block mb-1", children: "Passengers" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs(
                          "button",
                          {
                            type: "button",
                            onClick: () => setShowPassengerPicker(!showPassengerPicker),
                            "data-ocid": "passenger-picker.toggle",
                            className: "w-full bg-muted border border-border/60 rounded-lg px-3 py-2.5 text-sm text-foreground text-left focus:outline-none focus:ring-2 focus:ring-ring",
                            children: [
                              totalPassengers,
                              " Passenger",
                              totalPassengers !== 1 ? "s" : ""
                            ]
                          }
                        ),
                        showPassengerPicker && /* @__PURE__ */ jsxRuntimeExports.jsx(
                          PassengerPicker,
                          {
                            value: passengers,
                            onChange: setPassengers,
                            onClose: () => setShowPassengerPicker(false)
                          }
                        )
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "label",
                          {
                            htmlFor: "cabin-class",
                            className: "text-xs text-muted-foreground font-medium uppercase tracking-wide block mb-1",
                            children: "Cabin"
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs(
                          "select",
                          {
                            id: "cabin-class",
                            value: cabinClass,
                            onChange: (e) => setCabinClass(e.target.value),
                            "data-ocid": "cabin-class.select",
                            className: "w-full bg-muted border border-border/60 rounded-lg px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring",
                            children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "economy", children: "Economy" }),
                              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "business", children: "Business" }),
                              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "first", children: "First Class" })
                            ]
                          }
                        )
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "button",
                        {
                          type: "submit",
                          "data-ocid": "search-flights.submit_button",
                          className: "flex-1 sm:flex-none bg-secondary text-secondary-foreground font-semibold px-8 py-2.5 rounded-lg hover:brightness-110 transition-all shadow-md",
                          children: "Search Flights"
                        }
                      )
                    ] })
                  ]
                }
              )
            }
          )
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(PopularRoutesSection, {})
  ] });
}
function AirportInput({
  label,
  placeholder,
  value,
  onChange,
  ocid
}) {
  const [query, setQuery] = reactExports.useState(value);
  const [open, setOpen] = reactExports.useState(false);
  const ref = reactExports.useRef(null);
  const { data: airports = [] } = useSearchAirports(query);
  reactExports.useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target))
        setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1 relative", ref, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "label",
      {
        htmlFor: `airport-input-${ocid}`,
        className: "text-xs text-muted-foreground font-medium uppercase tracking-wide",
        children: label
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "input",
      {
        id: `airport-input-${ocid}`,
        type: "text",
        value: query,
        placeholder,
        onChange: (e) => {
          setQuery(e.target.value);
          setOpen(true);
        },
        onFocus: () => setOpen(true),
        "data-ocid": `${ocid}.input`,
        className: "bg-muted border border-border/60 rounded-lg px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
      }
    ),
    open && airports.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
      "ul",
      {
        className: "absolute top-full mt-1 left-0 right-0 z-50 bg-card border border-border rounded-lg shadow-2xl max-h-52 overflow-y-auto",
        "data-ocid": `${ocid}.dropdown_menu`,
        children: airports.slice(0, 8).map((airport) => /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            className: "w-full px-3 py-2 text-left text-sm hover:bg-muted transition-colors flex items-center gap-2",
            onClick: () => {
              const formatted = `${airport.city} (${airport.code})`;
              setQuery(formatted);
              onChange(airport.code);
              setOpen(false);
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-xs font-bold text-secondary", children: airport.code }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground", children: airport.city }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground text-xs ml-auto", children: airport.country })
            ]
          }
        ) }, airport.code))
      }
    )
  ] });
}
function PassengerPicker({
  value,
  onChange,
  onClose
}) {
  const rows = [
    { key: "adults", label: "Adults", sub: "12+ years", min: 1 },
    { key: "children", label: "Children", sub: "2–11 years", min: 0 },
    { key: "infants", label: "Infants", sub: "Under 2", min: 0 }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "absolute top-full mt-1 left-0 z-50 bg-card border border-border rounded-xl shadow-2xl p-4 w-72",
      "data-ocid": "passenger-picker.popover",
      children: [
        rows.map(({ key, label, sub, min }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex items-center justify-between py-2.5 border-b border-border/40 last:border-0",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground", children: label }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: sub })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => onChange({
                      ...value,
                      [key]: BigInt(Math.max(min, Number(value[key]) - 1))
                    }),
                    className: "w-7 h-7 rounded-full bg-muted hover:bg-muted/80 text-foreground text-lg font-bold flex items-center justify-center transition-colors",
                    children: "−"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-5 text-center text-sm font-semibold text-foreground", children: value[key] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => onChange({ ...value, [key]: value[key] + 1n }),
                    className: "w-7 h-7 rounded-full bg-muted hover:bg-muted/80 text-foreground text-lg font-bold flex items-center justify-center transition-colors",
                    children: "+"
                  }
                )
              ] })
            ]
          },
          key
        )),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: onClose,
            className: "mt-3 w-full bg-secondary text-secondary-foreground text-sm font-semibold py-2 rounded-lg hover:brightness-110 transition-all",
            "data-ocid": "passenger-picker.confirm_button",
            children: "Done"
          }
        )
      ]
    }
  );
}
function PopularRoutesSection() {
  const { data: routes = [], isLoading } = useGetPopularRoutes();
  const navigate = useNavigate();
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "section",
    {
      className: "bg-muted/30 py-16 px-4",
      "data-ocid": "popular-routes.section",
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-7xl mx-auto", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            initial: { opacity: 0, y: 20 },
            whileInView: { opacity: 1, y: 0 },
            viewport: { once: true },
            className: "text-center mb-10",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-3xl font-bold text-foreground mb-2", children: "Popular Routes" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: "Top destinations our travelers love" })
            ]
          }
        ),
        isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 sm:grid-cols-4 gap-4", children: Array.from({ length: 8 }, (_, i) => `skeleton-route-${i}`).map(
          (key) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "bg-card rounded-xl h-28 animate-pulse"
            },
            key
          )
        ) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 sm:grid-cols-4 gap-4", children: routes.map((route, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.button,
          {
            type: "button",
            initial: { opacity: 0, y: 20 },
            whileInView: { opacity: 1, y: 0 },
            viewport: { once: true },
            transition: { delay: i * 0.08 },
            whileHover: { y: -3 },
            onClick: () => void navigate({
              to: "/results",
              search: {
                origin: route.origin.code,
                destination: route.destination.code,
                departureDate: new Date(Date.now() + 7 * 864e5).toISOString().split("T")[0],
                tripType: "roundTrip",
                cabinClass: "economy",
                adults: "1",
                children: "0",
                infants: "0"
              }
            }),
            "data-ocid": `popular-routes.item.${i + 1}`,
            className: "bg-card border border-border/60 rounded-xl p-4 text-left hover:border-secondary/60 hover:shadow-lg transition-all group",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 mb-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-xs font-bold text-secondary", children: route.origin.code }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground text-xs", children: "→" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-xs font-bold text-secondary", children: route.destination.code })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm font-semibold text-foreground truncate", children: [
                route.origin.city,
                " → ",
                route.destination.city
              ] }),
              route.typicalPrice && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-accent font-bold mt-1.5", children: [
                "from $",
                route.typicalPrice.amount
              ] })
            ]
          },
          `${route.origin.code}-${route.destination.code}`
        )) })
      ] })
    }
  );
}
export {
  FlightSearchPage as default
};
