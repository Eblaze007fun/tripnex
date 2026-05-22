import { c as createLucideIcon, u as useNavigate, r as reactExports, f as useCreateBooking, j as jsxRuntimeExports, L as Layout, P as Plane, C as Check, m as motion } from "./index-Cy8AouOV.js";
import { C as Clock } from "./clock-BM7o3tNt.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [["path", { d: "m9 18 6-6-6-6", key: "mthhwq" }]];
const ChevronRight = createLucideIcon("chevron-right", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2", key: "975kel" }],
  ["circle", { cx: "12", cy: "7", r: "4", key: "17ys0d" }]
];
const User = createLucideIcon("user", __iconNode);
const STEPS = ["Passenger Details", "Fare Rules", "Summary"];
function BookingPage() {
  const navigate = useNavigate();
  const stored = sessionStorage.getItem("selectedFlight");
  const flight = stored ? JSON.parse(stored) : void 0;
  const [step, setStep] = reactExports.useState(0);
  const createBooking = useCreateBooking();
  const paxCounts = { adults: 1n, children: 0n, infants: 0n };
  const totalPax = Number(paxCounts.adults) + Number(paxCounts.children) + Number(paxCounts.infants);
  const blankPax = (idx) => ({
    id: `pax-${idx}`,
    paxId: `${Date.now()}-${idx}`,
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    seatPreference: "none"
  });
  const [passengers, setPassengers] = reactExports.useState(
    Array.from({ length: Math.max(1, totalPax) }, (_, i) => blankPax(i))
  );
  function updatePax(i, field, value) {
    setPassengers(
      (prev) => prev.map((p, idx) => idx === i ? { ...p, [field]: value } : p)
    );
  }
  function handleConfirmBooking() {
    if (!flight) return;
    createBooking.mutate(
      { flight, passengers },
      {
        onSuccess: (booking) => {
          sessionStorage.setItem("confirmedBooking", JSON.stringify(booking));
          void navigate({ to: "/confirmation" });
        }
      }
    );
  }
  if (!flight) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex-1 flex flex-col items-center justify-center text-center px-4 py-20",
        "data-ocid": "booking.empty_state",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Plane, { className: "w-12 h-12 text-muted-foreground mb-4" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-2xl font-bold text-foreground mb-2", children: "No flight selected" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mb-6", children: "Please search for and select a flight first." }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: () => void navigate({ to: "/" }),
              "data-ocid": "booking.search-again.button",
              className: "bg-secondary text-secondary-foreground font-semibold px-6 py-2.5 rounded-lg hover:brightness-110 transition-all",
              children: "Search Flights"
            }
          )
        ]
      }
    ) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "max-w-3xl mx-auto w-full px-4 sm:px-6 py-10",
      "data-ocid": "booking.page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "flex items-center gap-2 mb-10",
            "data-ocid": "booking.stepper",
            children: STEPS.map((label, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "flex items-center gap-2 flex-1 last:flex-none",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "div",
                    {
                      className: `flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold shrink-0 transition-all ${i < step ? "bg-accent text-accent-foreground" : i === step ? "bg-secondary text-secondary-foreground" : "bg-muted text-muted-foreground"}`,
                      children: i < step ? /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "w-4 h-4" }) : i + 1
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: `text-sm font-medium hidden sm:block ${i === step ? "text-foreground" : "text-muted-foreground"}`,
                      children: label
                    }
                  ),
                  i < STEPS.length - 1 && /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "w-4 h-4 text-muted-foreground flex-1" })
                ]
              },
              label
            ))
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "bg-card border border-border/60 rounded-xl p-4 mb-6 flex flex-col sm:flex-row sm:items-center gap-3",
            "data-ocid": "booking.flight-summary",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Plane, { className: "w-5 h-5 text-secondary shrink-0" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm font-semibold text-foreground", children: [
                  flight.airline,
                  " · ",
                  flight.flightNumber
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
                  flight.originCode,
                  " → ",
                  flight.destinationCode,
                  " ·",
                  " ",
                  flight.departureTime,
                  " – ",
                  flight.arrivalTime
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-lg font-bold text-secondary font-display shrink-0", children: [
                "$",
                flight.price.amount
              ] })
            ]
          }
        ),
        step === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
          StepPassengers,
          {
            passengers,
            updatePax,
            onNext: () => setStep(1)
          }
        ),
        step === 1 && /* @__PURE__ */ jsxRuntimeExports.jsx(
          StepFareRules,
          {
            flight,
            onBack: () => setStep(0),
            onNext: () => setStep(2)
          }
        ),
        step === 2 && /* @__PURE__ */ jsxRuntimeExports.jsx(
          StepSummary,
          {
            flight,
            passengers,
            isLoading: createBooking.isPending,
            onBack: () => setStep(1),
            onConfirm: handleConfirmBooking
          }
        )
      ]
    }
  ) });
}
function StepPassengers({
  passengers,
  updatePax,
  onNext
}) {
  const SEAT_OPTIONS = [
    { value: "none", label: "No preference" },
    { value: "window_", label: "Window" },
    { value: "aisle", label: "Aisle" },
    { value: "middle", label: "Middle" }
  ];
  function handleSubmit(e) {
    e.preventDefault();
    onNext();
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.div, { initial: { opacity: 0, x: 20 }, animate: { opacity: 1, x: 0 }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "font-display text-xl font-bold text-foreground mb-5 flex items-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "w-5 h-5 text-secondary" }),
      " Passenger Details"
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "space-y-6", children: [
      passengers.map((pax, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "bg-card border border-border/60 rounded-xl p-5 space-y-4",
          "data-ocid": `booking.passenger.${i + 1}`,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "text-sm font-semibold text-muted-foreground uppercase tracking-wide", children: [
              "Passenger ",
              i + 1
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(FormField, { label: "First Name", htmlFor: `first-name-${i}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  id: `first-name-${i}`,
                  type: "text",
                  required: true,
                  value: pax.firstName,
                  onChange: (e) => updatePax(i, "firstName", e.target.value),
                  "data-ocid": `booking.first-name.${i + 1}`,
                  className: "input-field",
                  placeholder: "John"
                }
              ) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(FormField, { label: "Last Name", htmlFor: `last-name-${i}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  id: `last-name-${i}`,
                  type: "text",
                  required: true,
                  value: pax.lastName,
                  onChange: (e) => updatePax(i, "lastName", e.target.value),
                  "data-ocid": `booking.last-name.${i + 1}`,
                  className: "input-field",
                  placeholder: "Doe"
                }
              ) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(FormField, { label: "Email", htmlFor: `email-${i}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  id: `email-${i}`,
                  type: "email",
                  required: true,
                  value: pax.email,
                  onChange: (e) => updatePax(i, "email", e.target.value),
                  "data-ocid": `booking.email.${i + 1}`,
                  className: "input-field",
                  placeholder: "john@example.com"
                }
              ) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(FormField, { label: "Phone", htmlFor: `phone-${i}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  id: `phone-${i}`,
                  type: "tel",
                  required: true,
                  value: pax.phone,
                  onChange: (e) => updatePax(i, "phone", e.target.value),
                  "data-ocid": `booking.phone.${i + 1}`,
                  className: "input-field",
                  placeholder: "+234 800 000 0000"
                }
              ) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(FormField, { label: "Seat Preference", htmlFor: `seat-pref-${i}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                "select",
                {
                  id: `seat-pref-${i}`,
                  value: pax.seatPreference,
                  onChange: (e) => updatePax(i, "seatPreference", e.target.value),
                  "data-ocid": `booking.seat-pref.${i + 1}`,
                  className: "input-field",
                  children: SEAT_OPTIONS.map((o) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: o.value, children: o.label }, o.value))
                }
              ) })
            ] })
          ]
        },
        pax.paxId
      )),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "submit",
          "data-ocid": "booking.next-step.button",
          className: "w-full bg-secondary text-secondary-foreground font-semibold py-3 rounded-xl hover:brightness-110 transition-all",
          children: "Continue to Fare Rules"
        }
      )
    ] })
  ] });
}
function StepFareRules({
  flight,
  onBack,
  onNext
}) {
  const durationH = Math.floor(Number(flight.durationMinutes) / 60);
  const durationM = Number(flight.durationMinutes) % 60;
  const rules = [
    { icon: "🧳", label: "Cabin Baggage", value: "1 piece, max 7kg" },
    {
      icon: "💼",
      label: "Checked Baggage",
      value: flight.cabinClass === "economy" ? "23kg included" : "2 × 32kg included"
    },
    {
      icon: "🔄",
      label: "Changes",
      value: flight.cabinClass === "economy" ? "Permitted with fee" : "Free changes"
    },
    {
      icon: "❌",
      label: "Cancellation",
      value: flight.cabinClass === "economy" ? "Non-refundable" : "Refundable with fee"
    }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.div,
    {
      initial: { opacity: 0, x: 20 },
      animate: { opacity: 1, x: 0 },
      className: "space-y-6",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "font-display text-xl font-bold text-foreground flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "w-5 h-5 text-secondary" }),
          " Fare Rules & Baggage"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border/60 rounded-xl overflow-hidden", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-muted/40 px-5 py-3 flex items-center gap-2 border-b border-border/60", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Plane, { className: "w-4 h-4 text-secondary" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm font-semibold text-foreground capitalize", children: [
              flight.cabinClass,
              " Class"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "ml-auto text-xs text-muted-foreground", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "w-3 h-3 inline mr-1" }),
              durationH,
              "h ",
              durationM,
              "m"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "divide-y divide-border/40", children: rules.map((rule) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "flex items-center gap-3 px-5 py-3.5",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xl", children: rule.icon }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-muted-foreground flex-1", children: rule.label }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-semibold text-foreground", children: rule.value })
              ]
            },
            rule.label
          )) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-primary/10 border border-primary/20 rounded-xl p-4 text-sm text-muted-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { className: "text-foreground", children: "Note:" }),
          " All fare rules are subject to change. Please review carefully before confirming your booking."
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: onBack,
              "data-ocid": "booking.back.button",
              className: "flex-1 py-3 rounded-xl bg-muted text-muted-foreground font-semibold hover:bg-muted/70 transition-colors",
              children: "Back"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: onNext,
              "data-ocid": "booking.next-step-2.button",
              className: "flex-1 py-3 rounded-xl bg-secondary text-secondary-foreground font-semibold hover:brightness-110 transition-all",
              children: "Continue to Summary"
            }
          )
        ] })
      ]
    }
  );
}
function StepSummary({
  flight,
  passengers,
  isLoading,
  onBack,
  onConfirm
}) {
  const totalPrice = flight.price.amount * passengers.length;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.div,
    {
      initial: { opacity: 0, x: 20 },
      animate: { opacity: 1, x: 0 },
      className: "space-y-5",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "font-display text-xl font-bold text-foreground flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "w-5 h-5 text-secondary" }),
          " Booking Summary"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "bg-card border border-border/60 rounded-xl p-5",
            "data-ocid": "booking.summary.flight",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3", children: "Flight" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Plane, { className: "w-5 h-5 text-secondary" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-semibold text-foreground", children: [
                    flight.airline,
                    " · ",
                    flight.flightNumber
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground mt-0.5", children: [
                    flight.originCode,
                    " → ",
                    flight.destinationCode,
                    " ·",
                    " ",
                    flight.departureTime,
                    " – ",
                    flight.arrivalTime,
                    " ·",
                    " ",
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "capitalize", children: flight.cabinClass })
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-bold text-secondary text-lg", children: [
                  "$",
                  flight.price.amount
                ] })
              ] })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "bg-card border border-border/60 rounded-xl p-5",
            "data-ocid": "booking.summary.passengers",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3", children: "Passengers" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-2", children: passengers.map((p, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "li",
                {
                  className: "flex items-center gap-3",
                  "data-ocid": `booking.summary.pax.${i + 1}`,
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "w-4 h-4 text-muted-foreground shrink-0" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm text-foreground font-medium", children: [
                      p.firstName,
                      " ",
                      p.lastName
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-auto text-xs text-muted-foreground capitalize", children: p.seatPreference !== "none" ? p.seatPreference : "Any seat" })
                  ]
                },
                p.paxId
              )) })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-secondary/10 border border-secondary/30 rounded-xl p-4 flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-foreground", children: "Total" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-display text-2xl font-bold text-secondary", children: [
            "$",
            totalPrice
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: onBack,
              "data-ocid": "booking.back-2.button",
              disabled: isLoading,
              className: "flex-1 py-3 rounded-xl bg-muted text-muted-foreground font-semibold hover:bg-muted/70 transition-colors disabled:opacity-50",
              children: "Back"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: onConfirm,
              disabled: isLoading,
              "data-ocid": "booking.confirm.submit_button",
              className: "flex-1 py-3 rounded-xl bg-secondary text-secondary-foreground font-bold hover:brightness-110 transition-all disabled:opacity-60 flex items-center justify-center gap-2",
              children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-4 h-4 border-2 border-secondary-foreground/30 border-t-secondary-foreground rounded-full animate-spin" }),
                "Confirming..."
              ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: "Confirm Booking" })
            }
          )
        ] })
      ]
    }
  );
}
function FormField({
  label,
  htmlFor,
  children
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1.5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "label",
      {
        htmlFor,
        className: "text-xs font-medium text-muted-foreground uppercase tracking-wide",
        children: label
      }
    ),
    children
  ] });
}
export {
  BookingPage as default
};
