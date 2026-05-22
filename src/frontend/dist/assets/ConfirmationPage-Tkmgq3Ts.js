import { c as createLucideIcon, u as useNavigate, r as reactExports, j as jsxRuntimeExports, L as Layout, P as Plane, m as motion, g as Copy } from "./index-Cy8AouOV.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  ["path", { d: "M21.801 10A10 10 0 1 1 17 3.335", key: "yps3ct" }],
  ["path", { d: "m9 11 3 3L22 4", key: "1pflzl" }]
];
const CircleCheckBig = createLucideIcon("circle-check-big", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["path", { d: "m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7", key: "132q7q" }],
  ["rect", { x: "2", y: "4", width: "20", height: "16", rx: "2", key: "izxlao" }]
];
const Mail = createLucideIcon("mail", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  [
    "path",
    {
      d: "M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384",
      key: "9njp5v"
    }
  ]
];
const Phone = createLucideIcon("phone", __iconNode);
function ConfirmationPage() {
  const navigate = useNavigate();
  const stored = sessionStorage.getItem("confirmedBooking");
  const booking = stored ? JSON.parse(stored) : void 0;
  const [copied, setCopied] = reactExports.useState(false);
  function copyRef() {
    if (!booking) return;
    void navigator.clipboard.writeText(booking.bookingRef);
    setCopied(true);
    setTimeout(() => setCopied(false), 2e3);
  }
  if (!booking) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex-1 flex flex-col items-center justify-center text-center px-4 py-20",
        "data-ocid": "confirmation.empty_state",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Plane, { className: "w-12 h-12 text-muted-foreground mb-4" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-2xl font-bold text-foreground mb-2", children: "No booking found" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mb-6", children: "Start a new flight search to make a booking." }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: () => void navigate({ to: "/" }),
              "data-ocid": "confirmation.search-again.button",
              className: "bg-secondary text-secondary-foreground font-semibold px-6 py-2.5 rounded-lg hover:brightness-110 transition-all",
              children: "Search Flights"
            }
          )
        ]
      }
    ) });
  }
  const durationH = Math.floor(Number(booking.flight.durationMinutes) / 60);
  const durationM = Number(booking.flight.durationMinutes) % 60;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "max-w-2xl mx-auto w-full px-4 sm:px-6 py-12",
      "data-ocid": "confirmation.page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            initial: { opacity: 0, scale: 0.9 },
            animate: { opacity: 1, scale: 1 },
            transition: { duration: 0.5 },
            className: "text-center mb-10",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-20 h-20 rounded-full bg-accent/20 border-2 border-accent flex items-center justify-center mx-auto mb-5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "w-10 h-10 text-accent" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-4xl font-bold text-foreground mb-2", children: "Booking Confirmed!" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: "Your flight has been successfully booked." })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            initial: { opacity: 0, y: 20 },
            animate: { opacity: 1, y: 0 },
            transition: { delay: 0.2 },
            className: "bg-secondary/10 border border-secondary/30 rounded-2xl p-6 text-center mb-6",
            "data-ocid": "confirmation.booking-ref.card",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground uppercase tracking-widest mb-2", children: "Booking Reference" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display text-3xl font-bold text-secondary tracking-widest", children: booking.bookingRef }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: copyRef,
                    "data-ocid": "confirmation.copy-ref.button",
                    className: "p-2 rounded-lg bg-card border border-border hover:bg-muted transition-colors",
                    "aria-label": "Copy booking reference",
                    children: copied ? /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "w-4 h-4 text-accent" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Copy, { className: "w-4 h-4 text-muted-foreground" })
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-2", children: "Save this reference for check-in and support" })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            initial: { opacity: 0, y: 20 },
            animate: { opacity: 1, y: 0 },
            transition: { delay: 0.3 },
            className: "bg-card border border-border/60 rounded-2xl overflow-hidden mb-6",
            "data-ocid": "confirmation.itinerary.card",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-muted/40 px-5 py-3 border-b border-border/60", children: /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-semibold text-foreground uppercase tracking-wide", children: "Itinerary" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4 mb-5 pb-5 border-b border-border/40", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Plane, { className: "w-5 h-5 text-secondary" }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-foreground", children: booking.flight.airline }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
                      booking.flight.flightNumber,
                      " ·",
                      " ",
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "capitalize", children: booking.flight.cabinClass })
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right shrink-0", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-display text-xl font-bold text-secondary", children: [
                      "$",
                      booking.flight.price.amount
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "per person" })
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display text-2xl font-bold text-foreground", children: booking.flight.departureTime }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-mono font-bold text-secondary", children: booking.flight.originCode })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 text-center", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground mb-1", children: [
                      durationH,
                      "h ",
                      durationM,
                      "m ·",
                      " ",
                      Number(booking.flight.stops) === 0 ? "Direct" : `${booking.flight.stops} stop${Number(booking.flight.stops) > 1 ? "s" : ""}`
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "h-px bg-border relative", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-1/2 left-0 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-muted-foreground" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-1/2 right-0 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-secondary" })
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display text-2xl font-bold text-foreground", children: booking.flight.arrivalTime }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-mono font-bold text-secondary", children: booking.flight.destinationCode })
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2", children: "Passengers" }),
                  booking.passengers.map((p, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "div",
                    {
                      className: "flex items-center gap-3",
                      "data-ocid": `confirmation.pax.${i + 1}`,
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs font-bold text-muted-foreground", children: i + 1 }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm text-foreground font-medium", children: [
                          p.firstName,
                          " ",
                          p.lastName
                        ] }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-auto text-xs text-muted-foreground", children: p.email })
                      ]
                    },
                    `${p.firstName}-${p.lastName}-${i}`
                  ))
                ] })
              ] })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            initial: { opacity: 0, y: 20 },
            animate: { opacity: 1, y: 0 },
            transition: { delay: 0.4 },
            className: "bg-card border border-border/60 rounded-2xl p-5 mb-8",
            "data-ocid": "confirmation.support.card",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-semibold text-foreground mb-3", children: "Need help with your booking?" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "a",
                  {
                    href: "mailto:info@tripnex.com",
                    className: "flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors",
                    "data-ocid": "confirmation.support-email.link",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { className: "w-4 h-4 text-secondary" }),
                      "info@tripnex.com"
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "a",
                  {
                    href: "https://tripnex.com",
                    target: "_blank",
                    rel: "noopener noreferrer",
                    className: "flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors",
                    "data-ocid": "confirmation.support-web.link",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, { className: "w-4 h-4 text-secondary" }),
                      "tripnex.com"
                    ]
                  }
                )
              ] })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            initial: { opacity: 0 },
            animate: { opacity: 1 },
            transition: { delay: 0.5 },
            className: "flex flex-col sm:flex-row items-center justify-center gap-3",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: () => void navigate({ to: "/my-bookings" }),
                  "data-ocid": "confirmation.view-bookings.button",
                  className: "bg-card text-foreground font-bold px-8 py-3 rounded-xl border border-secondary/40 hover:bg-secondary/10 transition-all",
                  children: "View My Bookings"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: () => void navigate({ to: "/" }),
                  "data-ocid": "confirmation.search-another.button",
                  className: "bg-secondary text-secondary-foreground font-bold px-8 py-3 rounded-xl hover:brightness-110 transition-all shadow-lg",
                  children: "Search Another Flight"
                }
              )
            ]
          }
        )
      ]
    }
  ) });
}
export {
  ConfirmationPage as default
};
