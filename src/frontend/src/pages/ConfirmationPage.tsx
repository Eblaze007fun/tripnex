import { Layout } from "@/components/Layout";
import type { Booking } from "@/types";
import { useNavigate } from "@tanstack/react-router";
import { CheckCircle, Copy, Mail, Phone, Plane } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";

export default function ConfirmationPage() {
  const navigate = useNavigate();
  const stored = sessionStorage.getItem("confirmedBooking");
  const booking: Booking | undefined = stored
    ? (JSON.parse(stored) as Booking)
    : undefined;

  const [copied, setCopied] = useState(false);

  function copyRef() {
    if (!booking) return;
    void navigator.clipboard.writeText(booking.bookingRef);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (!booking) {
    return (
      <Layout>
        <div
          className="flex-1 flex flex-col items-center justify-center text-center px-4 py-20"
          data-ocid="confirmation.empty_state"
        >
          <Plane className="w-12 h-12 text-muted-foreground mb-4" />
          <h2 className="font-display text-2xl font-bold text-foreground mb-2">
            No booking found
          </h2>
          <p className="text-muted-foreground mb-6">
            Start a new flight search to make a booking.
          </p>
          <button
            type="button"
            onClick={() => void navigate({ to: "/" })}
            data-ocid="confirmation.search-again.button"
            className="bg-secondary text-secondary-foreground font-semibold px-6 py-2.5 rounded-lg hover:brightness-110 transition-all"
          >
            Search Flights
          </button>
        </div>
      </Layout>
    );
  }

  const durationH = Math.floor(Number(booking.flight.durationMinutes) / 60);
  const durationM = Number(booking.flight.durationMinutes) % 60;

  return (
    <Layout>
      <div
        className="max-w-2xl mx-auto w-full px-4 sm:px-6 py-12"
        data-ocid="confirmation.page"
      >
        {/* Success header */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <div className="w-20 h-20 rounded-full bg-accent/20 border-2 border-accent flex items-center justify-center mx-auto mb-5">
            <CheckCircle className="w-10 h-10 text-accent" />
          </div>
          <h1 className="font-display text-4xl font-bold text-foreground mb-2">
            Booking Confirmed!
          </h1>
          <p className="text-muted-foreground">
            Your flight has been successfully booked.
          </p>
        </motion.div>

        {/* Booking ref */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-secondary/10 border border-secondary/30 rounded-2xl p-6 text-center mb-6"
          data-ocid="confirmation.booking-ref.card"
        >
          <p className="text-xs text-muted-foreground uppercase tracking-widest mb-2">
            Booking Reference
          </p>
          <div className="flex items-center justify-center gap-3">
            <span className="font-display text-3xl font-bold text-secondary tracking-widest">
              {booking.bookingRef}
            </span>
            <button
              type="button"
              onClick={copyRef}
              data-ocid="confirmation.copy-ref.button"
              className="p-2 rounded-lg bg-card border border-border hover:bg-muted transition-colors"
              aria-label="Copy booking reference"
            >
              {copied ? (
                <CheckCircle className="w-4 h-4 text-accent" />
              ) : (
                <Copy className="w-4 h-4 text-muted-foreground" />
              )}
            </button>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Save this reference for check-in and support
          </p>
        </motion.div>

        {/* Itinerary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-card border border-border/60 rounded-2xl overflow-hidden mb-6"
          data-ocid="confirmation.itinerary.card"
        >
          <div className="bg-muted/40 px-5 py-3 border-b border-border/60">
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide">
              Itinerary
            </h3>
          </div>
          <div className="p-5">
            {/* Flight info */}
            <div className="flex items-center gap-4 mb-5 pb-5 border-b border-border/40">
              <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center shrink-0">
                <Plane className="w-5 h-5 text-secondary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-foreground">
                  {booking.flight.airline}
                </p>
                <p className="text-xs text-muted-foreground">
                  {booking.flight.flightNumber} ·{" "}
                  <span className="capitalize">
                    {booking.flight.cabinClass}
                  </span>
                </p>
              </div>
              <div className="text-right shrink-0">
                <p className="font-display text-xl font-bold text-secondary">
                  ${booking.flight.price.amount}
                </p>
                <p className="text-xs text-muted-foreground">per person</p>
              </div>
            </div>
            {/* Route */}
            <div className="flex items-center gap-3 mb-5">
              <div className="text-center">
                <p className="font-display text-2xl font-bold text-foreground">
                  {booking.flight.departureTime}
                </p>
                <p className="text-sm font-mono font-bold text-secondary">
                  {booking.flight.originCode}
                </p>
              </div>
              <div className="flex-1 text-center">
                <p className="text-xs text-muted-foreground mb-1">
                  {durationH}h {durationM}m ·{" "}
                  {Number(booking.flight.stops) === 0
                    ? "Direct"
                    : `${booking.flight.stops} stop${Number(booking.flight.stops) > 1 ? "s" : ""}`}
                </p>
                <div className="h-px bg-border relative">
                  <div className="absolute top-1/2 left-0 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-muted-foreground" />
                  <div className="absolute top-1/2 right-0 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-secondary" />
                </div>
              </div>
              <div className="text-center">
                <p className="font-display text-2xl font-bold text-foreground">
                  {booking.flight.arrivalTime}
                </p>
                <p className="text-sm font-mono font-bold text-secondary">
                  {booking.flight.destinationCode}
                </p>
              </div>
            </div>
            {/* Passengers */}
            <div className="space-y-2">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                Passengers
              </p>
              {booking.passengers.map((p, i) => (
                <div
                  key={`${p.firstName}-${p.lastName}-${i}`}
                  className="flex items-center gap-3"
                  data-ocid={`confirmation.pax.${i + 1}`}
                >
                  <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs font-bold text-muted-foreground">
                    {i + 1}
                  </div>
                  <span className="text-sm text-foreground font-medium">
                    {p.firstName} {p.lastName}
                  </span>
                  <span className="ml-auto text-xs text-muted-foreground">
                    {p.email}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Support */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-card border border-border/60 rounded-2xl p-5 mb-8"
          data-ocid="confirmation.support.card"
        >
          <h3 className="text-sm font-semibold text-foreground mb-3">
            Need help with your booking?
          </h3>
          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href="mailto:info@tripnex.com"
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              data-ocid="confirmation.support-email.link"
            >
              <Mail className="w-4 h-4 text-secondary" />
              info@tripnex.com
            </a>
            <a
              href="https://tripnex.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              data-ocid="confirmation.support-web.link"
            >
              <Phone className="w-4 h-4 text-secondary" />
              tripnex.com
            </a>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3"
        >
          <button
            type="button"
            onClick={() => void navigate({ to: "/my-bookings" })}
            data-ocid="confirmation.view-bookings.button"
            className="bg-card text-foreground font-bold px-8 py-3 rounded-xl border border-secondary/40 hover:bg-secondary/10 transition-all"
          >
            View My Bookings
          </button>
          <button
            type="button"
            onClick={() => void navigate({ to: "/" })}
            data-ocid="confirmation.search-another.button"
            className="bg-secondary text-secondary-foreground font-bold px-8 py-3 rounded-xl hover:brightness-110 transition-all shadow-lg"
          >
            Search Another Flight
          </button>
        </motion.div>
      </div>
    </Layout>
  );
}
