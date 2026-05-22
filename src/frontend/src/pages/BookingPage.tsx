import { Layout } from "@/components/Layout";
import { useCreateBooking } from "@/hooks/useFlightHooks";
import type {
  FlightResult,
  PassengerCounts,
  PassengerDetails,
  SeatPreference,
} from "@/types";
import { useNavigate } from "@tanstack/react-router";
import { Check, ChevronRight, Clock, Plane, User } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";

const STEPS = ["Passenger Details", "Fare Rules", "Summary"];

export default function BookingPage() {
  const navigate = useNavigate();
  const stored = sessionStorage.getItem("selectedFlight");
  const flight: FlightResult | undefined = stored
    ? (JSON.parse(stored) as FlightResult)
    : undefined;

  const [step, setStep] = useState(0);
  const createBooking = useCreateBooking();

  // Build passenger count from state or fallback to 1 adult
  const paxCounts: PassengerCounts = { adults: 1n, children: 0n, infants: 0n };
  const totalPax =
    Number(paxCounts.adults) +
    Number(paxCounts.children) +
    Number(paxCounts.infants);

  const blankPax = (idx: number): PassengerDetails => ({
    id: `pax-${idx}`,
    paxId: `${Date.now()}-${idx}`,
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    seatPreference: "none",
  });
  const [passengers, setPassengers] = useState<PassengerDetails[]>(
    Array.from({ length: Math.max(1, totalPax) }, (_, i) => blankPax(i)),
  );

  function updatePax(i: number, field: keyof PassengerDetails, value: string) {
    setPassengers((prev) =>
      prev.map((p, idx) => (idx === i ? { ...p, [field]: value } : p)),
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
        },
      },
    );
  }

  if (!flight) {
    return (
      <Layout>
        <div
          className="flex-1 flex flex-col items-center justify-center text-center px-4 py-20"
          data-ocid="booking.empty_state"
        >
          <Plane className="w-12 h-12 text-muted-foreground mb-4" />
          <h2 className="font-display text-2xl font-bold text-foreground mb-2">
            No flight selected
          </h2>
          <p className="text-muted-foreground mb-6">
            Please search for and select a flight first.
          </p>
          <button
            type="button"
            onClick={() => void navigate({ to: "/" })}
            data-ocid="booking.search-again.button"
            className="bg-secondary text-secondary-foreground font-semibold px-6 py-2.5 rounded-lg hover:brightness-110 transition-all"
          >
            Search Flights
          </button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div
        className="max-w-3xl mx-auto w-full px-4 sm:px-6 py-10"
        data-ocid="booking.page"
      >
        {/* Stepper */}
        <div
          className="flex items-center gap-2 mb-10"
          data-ocid="booking.stepper"
        >
          {STEPS.map((label, i) => (
            <div
              key={label}
              className="flex items-center gap-2 flex-1 last:flex-none"
            >
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold shrink-0 transition-all ${
                  i < step
                    ? "bg-accent text-accent-foreground"
                    : i === step
                      ? "bg-secondary text-secondary-foreground"
                      : "bg-muted text-muted-foreground"
                }`}
              >
                {i < step ? <Check className="w-4 h-4" /> : i + 1}
              </div>
              <span
                className={`text-sm font-medium hidden sm:block ${
                  i === step ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                {label}
              </span>
              {i < STEPS.length - 1 && (
                <ChevronRight className="w-4 h-4 text-muted-foreground flex-1" />
              )}
            </div>
          ))}
        </div>

        {/* Flight summary strip */}
        <div
          className="bg-card border border-border/60 rounded-xl p-4 mb-6 flex flex-col sm:flex-row sm:items-center gap-3"
          data-ocid="booking.flight-summary"
        >
          <Plane className="w-5 h-5 text-secondary shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-foreground">
              {flight.airline} · {flight.flightNumber}
            </p>
            <p className="text-xs text-muted-foreground">
              {flight.originCode} → {flight.destinationCode} ·{" "}
              {flight.departureTime} – {flight.arrivalTime}
            </p>
          </div>
          <p className="text-lg font-bold text-secondary font-display shrink-0">
            ${flight.price.amount}
          </p>
        </div>

        {/* Step content */}
        {step === 0 && (
          <StepPassengers
            passengers={passengers}
            updatePax={updatePax}
            onNext={() => setStep(1)}
          />
        )}
        {step === 1 && (
          <StepFareRules
            flight={flight}
            onBack={() => setStep(0)}
            onNext={() => setStep(2)}
          />
        )}
        {step === 2 && (
          <StepSummary
            flight={flight}
            passengers={passengers}
            isLoading={createBooking.isPending}
            onBack={() => setStep(1)}
            onConfirm={handleConfirmBooking}
          />
        )}
      </div>
    </Layout>
  );
}

// ── Step 1: Passengers ────────────────────────────────────────────────────────
function StepPassengers({
  passengers,
  updatePax,
  onNext,
}: {
  passengers: PassengerDetails[];
  updatePax: (
    i: number,
    field: Exclude<keyof PassengerDetails, "paxId">,
    value: string,
  ) => void;
  onNext: () => void;
}) {
  const SEAT_OPTIONS: { value: SeatPreference; label: string }[] = [
    { value: "none", label: "No preference" },
    { value: "window_", label: "Window" },
    { value: "aisle", label: "Aisle" },
    { value: "middle", label: "Middle" },
  ];

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onNext();
  }

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
      <h2 className="font-display text-xl font-bold text-foreground mb-5 flex items-center gap-2">
        <User className="w-5 h-5 text-secondary" /> Passenger Details
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {passengers.map((pax, i) => (
          <div
            key={pax.paxId}
            className="bg-card border border-border/60 rounded-xl p-5 space-y-4"
            data-ocid={`booking.passenger.${i + 1}`}
          >
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Passenger {i + 1}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField label="First Name" htmlFor={`first-name-${i}`}>
                <input
                  id={`first-name-${i}`}
                  type="text"
                  required
                  value={pax.firstName}
                  onChange={(e) => updatePax(i, "firstName", e.target.value)}
                  data-ocid={`booking.first-name.${i + 1}`}
                  className="input-field"
                  placeholder="John"
                />
              </FormField>
              <FormField label="Last Name" htmlFor={`last-name-${i}`}>
                <input
                  id={`last-name-${i}`}
                  type="text"
                  required
                  value={pax.lastName}
                  onChange={(e) => updatePax(i, "lastName", e.target.value)}
                  data-ocid={`booking.last-name.${i + 1}`}
                  className="input-field"
                  placeholder="Doe"
                />
              </FormField>
              <FormField label="Email" htmlFor={`email-${i}`}>
                <input
                  id={`email-${i}`}
                  type="email"
                  required
                  value={pax.email}
                  onChange={(e) => updatePax(i, "email", e.target.value)}
                  data-ocid={`booking.email.${i + 1}`}
                  className="input-field"
                  placeholder="john@example.com"
                />
              </FormField>
              <FormField label="Phone" htmlFor={`phone-${i}`}>
                <input
                  id={`phone-${i}`}
                  type="tel"
                  required
                  value={pax.phone}
                  onChange={(e) => updatePax(i, "phone", e.target.value)}
                  data-ocid={`booking.phone.${i + 1}`}
                  className="input-field"
                  placeholder="+234 800 000 0000"
                />
              </FormField>
              <FormField label="Seat Preference" htmlFor={`seat-pref-${i}`}>
                <select
                  id={`seat-pref-${i}`}
                  value={pax.seatPreference}
                  onChange={(e) =>
                    updatePax(i, "seatPreference", e.target.value)
                  }
                  data-ocid={`booking.seat-pref.${i + 1}`}
                  className="input-field"
                >
                  {SEAT_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </FormField>
            </div>
          </div>
        ))}
        <button
          type="submit"
          data-ocid="booking.next-step.button"
          className="w-full bg-secondary text-secondary-foreground font-semibold py-3 rounded-xl hover:brightness-110 transition-all"
        >
          Continue to Fare Rules
        </button>
      </form>
    </motion.div>
  );
}

// ── Step 2: Fare Rules ────────────────────────────────────────────────────────
function StepFareRules({
  flight,
  onBack,
  onNext,
}: {
  flight: FlightResult;
  onBack: () => void;
  onNext: () => void;
}) {
  const durationH = Math.floor(Number(flight.durationMinutes) / 60);
  const durationM = Number(flight.durationMinutes) % 60;
  const rules = [
    { icon: "🧳", label: "Cabin Baggage", value: "1 piece, max 7kg" },
    {
      icon: "💼",
      label: "Checked Baggage",
      value:
        flight.cabinClass === "economy" ? "23kg included" : "2 × 32kg included",
    },
    {
      icon: "🔄",
      label: "Changes",
      value:
        flight.cabinClass === "economy" ? "Permitted with fee" : "Free changes",
    },
    {
      icon: "❌",
      label: "Cancellation",
      value:
        flight.cabinClass === "economy"
          ? "Non-refundable"
          : "Refundable with fee",
    },
  ];
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-6"
    >
      <h2 className="font-display text-xl font-bold text-foreground flex items-center gap-2">
        <Clock className="w-5 h-5 text-secondary" /> Fare Rules & Baggage
      </h2>
      <div className="bg-card border border-border/60 rounded-xl overflow-hidden">
        <div className="bg-muted/40 px-5 py-3 flex items-center gap-2 border-b border-border/60">
          <Plane className="w-4 h-4 text-secondary" />
          <span className="text-sm font-semibold text-foreground capitalize">
            {flight.cabinClass} Class
          </span>
          <span className="ml-auto text-xs text-muted-foreground">
            <Clock className="w-3 h-3 inline mr-1" />
            {durationH}h {durationM}m
          </span>
        </div>
        <div className="divide-y divide-border/40">
          {rules.map((rule) => (
            <div
              key={rule.label}
              className="flex items-center gap-3 px-5 py-3.5"
            >
              <span className="text-xl">{rule.icon}</span>
              <span className="text-sm text-muted-foreground flex-1">
                {rule.label}
              </span>
              <span className="text-sm font-semibold text-foreground">
                {rule.value}
              </span>
            </div>
          ))}
        </div>
      </div>
      <div className="bg-primary/10 border border-primary/20 rounded-xl p-4 text-sm text-muted-foreground">
        <strong className="text-foreground">Note:</strong> All fare rules are
        subject to change. Please review carefully before confirming your
        booking.
      </div>
      <div className="flex gap-3">
        <button
          type="button"
          onClick={onBack}
          data-ocid="booking.back.button"
          className="flex-1 py-3 rounded-xl bg-muted text-muted-foreground font-semibold hover:bg-muted/70 transition-colors"
        >
          Back
        </button>
        <button
          type="button"
          onClick={onNext}
          data-ocid="booking.next-step-2.button"
          className="flex-1 py-3 rounded-xl bg-secondary text-secondary-foreground font-semibold hover:brightness-110 transition-all"
        >
          Continue to Summary
        </button>
      </div>
    </motion.div>
  );
}

// ── Step 3: Summary ───────────────────────────────────────────────────────────
function StepSummary({
  flight,
  passengers,
  isLoading,
  onBack,
  onConfirm,
}: {
  flight: FlightResult;
  passengers: PassengerDetails[];
  isLoading: boolean;
  onBack: () => void;
  onConfirm: () => void;
}) {
  const totalPrice = flight.price.amount * passengers.length;
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-5"
    >
      <h2 className="font-display text-xl font-bold text-foreground flex items-center gap-2">
        <Check className="w-5 h-5 text-secondary" /> Booking Summary
      </h2>
      {/* Flight */}
      <div
        className="bg-card border border-border/60 rounded-xl p-5"
        data-ocid="booking.summary.flight"
      >
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
          Flight
        </h3>
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
            <Plane className="w-5 h-5 text-secondary" />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-foreground">
              {flight.airline} · {flight.flightNumber}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {flight.originCode} → {flight.destinationCode} ·{" "}
              {flight.departureTime} – {flight.arrivalTime} ·{" "}
              <span className="capitalize">{flight.cabinClass}</span>
            </p>
          </div>
          <p className="font-bold text-secondary text-lg">
            ${flight.price.amount}
          </p>
        </div>
      </div>
      {/* Passengers */}
      <div
        className="bg-card border border-border/60 rounded-xl p-5"
        data-ocid="booking.summary.passengers"
      >
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
          Passengers
        </h3>
        <ul className="space-y-2">
          {passengers.map((p, i) => (
            <li
              key={p.paxId}
              className="flex items-center gap-3"
              data-ocid={`booking.summary.pax.${i + 1}`}
            >
              <User className="w-4 h-4 text-muted-foreground shrink-0" />
              <span className="text-sm text-foreground font-medium">
                {p.firstName} {p.lastName}
              </span>
              <span className="ml-auto text-xs text-muted-foreground capitalize">
                {p.seatPreference !== "none" ? p.seatPreference : "Any seat"}
              </span>
            </li>
          ))}
        </ul>
      </div>
      {/* Total */}
      <div className="bg-secondary/10 border border-secondary/30 rounded-xl p-4 flex items-center justify-between">
        <span className="font-semibold text-foreground">Total</span>
        <span className="font-display text-2xl font-bold text-secondary">
          ${totalPrice}
        </span>
      </div>
      <div className="flex gap-3">
        <button
          type="button"
          onClick={onBack}
          data-ocid="booking.back-2.button"
          disabled={isLoading}
          className="flex-1 py-3 rounded-xl bg-muted text-muted-foreground font-semibold hover:bg-muted/70 transition-colors disabled:opacity-50"
        >
          Back
        </button>
        <button
          type="button"
          onClick={onConfirm}
          disabled={isLoading}
          data-ocid="booking.confirm.submit_button"
          className="flex-1 py-3 rounded-xl bg-secondary text-secondary-foreground font-bold hover:brightness-110 transition-all disabled:opacity-60 flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-secondary-foreground/30 border-t-secondary-foreground rounded-full animate-spin" />
              Confirming...
            </>
          ) : (
            <>Confirm Booking</>
          )}
        </button>
      </div>
    </motion.div>
  );
}

function FormField({
  label,
  htmlFor,
  children,
}: { label: string; htmlFor?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={htmlFor}
        className="text-xs font-medium text-muted-foreground uppercase tracking-wide"
      >
        {label}
      </label>
      {children}
    </div>
  );
}
