import { Layout } from "@/components/Layout";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useCancelBooking, useGetUserBookings } from "@/hooks/useFlightHooks";
import type { Booking, BookingStatus } from "@/types";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Calendar,
  Plane,
  Search,
  Tag,
  Users,
  X,
} from "lucide-react";
import { motion } from "motion/react";

// ── Status badge ─────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: BookingStatus }) {
  const config: Record<BookingStatus, { label: string; className: string }> = {
    confirmed: {
      label: "Confirmed",
      className: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    },
    cancelled: {
      label: "Cancelled",
      className: "bg-destructive/20 text-destructive border-destructive/30",
    },
  };
  const { label, className } = config[status] ?? config.confirmed;
  return (
    <Badge
      variant="outline"
      className={`text-xs font-semibold tracking-wide uppercase ${className}`}
    >
      {label}
    </Badge>
  );
}

// ── Booking card ─────────────────────────────────────────────────────────────
function BookingCard({
  booking,
  index,
}: {
  booking: Booking;
  index: number;
}) {
  const cancel = useCancelBooking();
  const cabinLabels: Record<string, string> = {
    economy: "Economy",
    business: "Business",
    first: "First Class",
  };
  const canCancel = booking.status === "confirmed";
  const bookedOn = new Date(
    Number(booking.createdAt) / 1_000_000,
  ).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
  const totalPassengers = booking.passengers.length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.07, ease: "easeOut" }}
      data-ocid={`booking.item.${index + 1}`}
    >
      <Card className="bg-card border border-border/60 hover:border-secondary/40 transition-all duration-300 overflow-hidden">
        {/* Gold top accent bar */}
        <div className="h-0.5 bg-gradient-to-r from-secondary/60 via-secondary to-secondary/60" />
        <CardContent className="p-5">
          <div className="flex flex-col sm:flex-row sm:items-start gap-4">
            {/* Route block */}
            <div className="flex-1 min-w-0">
              {/* Booking ref */}
              <div className="flex items-center gap-2 mb-3">
                <span
                  className="font-mono text-lg font-bold text-secondary tracking-wider"
                  data-ocid={`booking.ref.${index + 1}`}
                >
                  {booking.bookingRef}
                </span>
                <StatusBadge status={booking.status} />
              </div>

              {/* Origin → Destination */}
              <div className="flex items-center gap-2 mb-3">
                <div className="text-center">
                  <div className="text-xl font-display font-bold text-foreground">
                    {booking.flight.originCode}
                  </div>
                  <div className="text-xs text-muted-foreground truncate max-w-[80px]">
                    {booking.flight.departureTime}
                  </div>
                </div>
                <div className="flex-1 flex items-center gap-1 px-2">
                  <div className="flex-1 h-px bg-border" />
                  <Plane className="w-4 h-4 text-secondary shrink-0" />
                  <ArrowRight className="w-3 h-3 text-muted-foreground shrink-0" />
                  <div className="flex-1 h-px bg-border" />
                </div>
                <div className="text-center">
                  <div className="text-xl font-display font-bold text-foreground">
                    {booking.flight.destinationCode}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {booking.flight.arrivalTime}
                  </div>
                </div>
              </div>

              {/* Meta row */}
              <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  Booked {bookedOn}
                </span>
                <span className="flex items-center gap-1">
                  <Tag className="w-3 h-3" />
                  {cabinLabels[booking.flight.cabinClass] ??
                    booking.flight.cabinClass}
                </span>
                <span className="flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  {totalPassengers} passenger
                  {totalPassengers !== 1 ? "s" : ""}
                </span>
              </div>
            </div>

            {/* Price + cancel */}
            <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-3 sm:gap-2 pt-1">
              <div className="text-right">
                <div className="text-2xl font-display font-bold text-foreground">
                  ${booking.flight.price.amount.toLocaleString()}
                </div>
                <div className="text-xs text-muted-foreground">
                  {booking.flight.price.currency}
                </div>
              </div>

              {canCancel && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs gap-1 border-destructive/40 text-destructive hover:bg-destructive/10 hover:text-destructive"
                      data-ocid={`booking.cancel_button.${index + 1}`}
                    >
                      <X className="w-3 h-3" />
                      Cancel
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent
                    className="bg-card border-border"
                    data-ocid="booking.dialog"
                  >
                    <AlertDialogHeader>
                      <AlertDialogTitle className="font-display text-foreground">
                        Cancel this booking?
                      </AlertDialogTitle>
                      <AlertDialogDescription className="text-muted-foreground">
                        Booking{" "}
                        <span className="font-mono font-semibold text-secondary">
                          {booking.bookingRef}
                        </span>{" "}
                        will be permanently cancelled. This action cannot be
                        undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel
                        className="bg-muted hover:bg-muted/80"
                        data-ocid="booking.cancel_button"
                      >
                        No, keep it
                      </AlertDialogCancel>
                      <AlertDialogAction
                        className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                        onClick={() => cancel.mutate(booking.bookingRef)}
                        data-ocid="booking.confirm_button"
                      >
                        Yes, cancel booking
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// ── Loading skeleton ──────────────────────────────────────────────────────────
function BookingSkeleton({ i }: { i: number }) {
  return (
    <Card key={i} className="bg-card border border-border/60 overflow-hidden">
      <div className="h-0.5 bg-border" />
      <CardContent className="p-5">
        <div className="flex gap-4">
          <div className="flex-1 space-y-3">
            <div className="flex gap-2">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-6 w-20" />
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="h-8 w-12" />
              <Skeleton className="h-4 flex-1" />
              <Skeleton className="h-8 w-12" />
            </div>
            <div className="flex gap-3">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-16" />
            </div>
          </div>
          <div className="space-y-2 items-end flex flex-col">
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-8 w-16" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ── Empty state ───────────────────────────────────────────────────────────────
function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="flex flex-col items-center justify-center py-24 text-center"
      data-ocid="booking.empty_state"
    >
      <div className="w-20 h-20 rounded-full bg-secondary/10 border border-secondary/20 flex items-center justify-center mb-6">
        <Plane className="w-10 h-10 text-secondary" />
      </div>
      <h3 className="font-display text-2xl font-bold text-foreground mb-2">
        No bookings yet
      </h3>
      <p className="text-muted-foreground max-w-xs mb-8">
        Your booked flights will appear here. Start your journey today.
      </p>
      <Button asChild size="lg" className="gap-2 font-semibold">
        <Link to="/" data-ocid="booking.search_flights_link">
          <Search className="w-4 h-4" />
          Search Flights
        </Link>
      </Button>
    </motion.div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function MyBookingsPage() {
  const { data: bookings, isLoading } = useGetUserBookings();

  const sorted = [...(bookings ?? [])].sort((a, b) =>
    Number(b.createdAt - a.createdAt),
  );

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 w-full">
        {/* Page header */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8"
          data-ocid="booking.page"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-1 h-8 rounded-full bg-secondary" />
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-foreground">
              My Bookings
            </h1>
          </div>
          <p className="text-muted-foreground ml-4 pl-0.5">
            Manage and review all your TRIPNEX flight reservations.
          </p>
        </motion.div>

        {/* Content */}
        {isLoading ? (
          <div className="space-y-4" data-ocid="booking.loading_state">
            {[0, 1, 2].map((i) => (
              <BookingSkeleton key={i} i={i} />
            ))}
          </div>
        ) : sorted.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              {sorted.length} booking{sorted.length !== 1 ? "s" : ""} found
            </p>
            {sorted.map((booking, i) => (
              <BookingCard
                key={booking.bookingRef}
                booking={booking}
                index={i}
              />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
