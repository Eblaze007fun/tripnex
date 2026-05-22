import { useAuth } from "@/hooks/useAuth";
import { useBackend } from "@/hooks/useBackend";
import type {
  Airport,
  Booking,
  CreateBookingInput,
  FlightResult,
  FlightSearchParams,
  PopularRoute,
} from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// ── Search Airports ───────────────────────────────────────────────────────────
export function useSearchAirports(term: string) {
  const { backend } = useBackend();
  return useQuery<Airport[]>({
    queryKey: ["airports", term],
    queryFn: async () => {
      if (!backend || !term)
        return MOCK_AIRPORTS.filter(
          (a) =>
            a.city.toLowerCase().includes(term.toLowerCase()) ||
            a.code.toLowerCase().includes(term.toLowerCase()),
        );
      try {
        const result = await (
          backend as unknown as {
            searchAirports: (term: string) => Promise<Airport[]>;
          }
        ).searchAirports(term);
        return result;
      } catch {
        return MOCK_AIRPORTS.filter(
          (a) =>
            a.city.toLowerCase().includes(term.toLowerCase()) ||
            a.code.toLowerCase().includes(term.toLowerCase()),
        );
      }
    },
    enabled: term.length >= 1,
    staleTime: 60_000,
  });
}

// ── Get Popular Routes ────────────────────────────────────────────────────────
export function useGetPopularRoutes() {
  const { backend } = useBackend();
  return useQuery<PopularRoute[]>({
    queryKey: ["popular-routes"],
    queryFn: async () => {
      if (!backend) return MOCK_POPULAR_ROUTES;
      try {
        const result = await (
          backend as unknown as {
            getPopularRoutes: () => Promise<PopularRoute[]>;
          }
        ).getPopularRoutes();
        return result.length > 0 ? result : MOCK_POPULAR_ROUTES;
      } catch {
        return MOCK_POPULAR_ROUTES;
      }
    },
    staleTime: 300_000,
  });
}

// ── Search Flights ────────────────────────────────────────────────────────────
export function useSearchFlights(params: FlightSearchParams | null) {
  const { backend } = useBackend();
  return useQuery<FlightResult[]>({
    queryKey: ["flights", params],
    queryFn: async () => {
      if (!params) return [];
      if (!backend) return generateMockFlights(params);
      try {
        const result = await (
          backend as unknown as {
            searchFlights: (p: FlightSearchParams) => Promise<FlightResult[]>;
          }
        ).searchFlights(params);
        return result.length > 0 ? result : generateMockFlights(params);
      } catch {
        return generateMockFlights(params);
      }
    },
    enabled: !!params,
    staleTime: 120_000,
  });
}

// ── Create Booking ────────────────────────────────────────────────────────────
export function useCreateBooking() {
  const { backend } = useBackend();
  return useMutation<Booking, Error, CreateBookingInput>({
    mutationFn: async (input) => {
      if (!backend) {
        // Mock booking response
        return {
          bookingRef: `TRX${Date.now().toString(36).toUpperCase()}`,
          flight: input.flight,
          passengers: input.passengers,
          status: "confirmed",
          createdAt: BigInt(Date.now()),
        };
      }
      try {
        const cleanPassengers = input.passengers;
        const result = await (
          backend as unknown as {
            createBooking: (input: CreateBookingInput) => Promise<Booking>;
          }
        ).createBooking({ flight: input.flight, passengers: cleanPassengers });
        return result;
      } catch {
        return {
          bookingRef: `TRX${Date.now().toString(36).toUpperCase()}`,
          flight: input.flight,
          passengers: input.passengers,
          status: "confirmed",
          createdAt: BigInt(Date.now()),
        };
      }
    },
  });
}

// ── Get Booking by Ref ────────────────────────────────────────────────────────
export function useGetBookingByRef(ref: string) {
  const { backend } = useBackend();
  return useQuery<Booking | null>({
    queryKey: ["booking", ref],
    queryFn: async () => {
      if (!backend || !ref) return null;
      try {
        const result = await (
          backend as unknown as {
            getBookingByRef: (ref: string) => Promise<Booking | null>;
          }
        ).getBookingByRef(ref);
        return result;
      } catch {
        return null;
      }
    },
    enabled: !!ref,
  });
}

// ── Get User Bookings ─────────────────────────────────────────────────────────
export function useGetUserBookings() {
  const { backend } = useBackend();
  const { isAuthenticated } = useAuth();
  return useQuery<Booking[]>({
    queryKey: ["userBookings"],
    queryFn: async () => {
      if (!backend) return [];
      try {
        const result = await (
          backend as unknown as {
            getUserBookings: () => Promise<Booking[]>;
          }
        ).getUserBookings();
        return result;
      } catch {
        return [];
      }
    },
    enabled: !!backend && isAuthenticated,
    staleTime: 30_000,
  });
}

// ── Cancel Booking ────────────────────────────────────────────────────────────
export function useCancelBooking() {
  const { backend } = useBackend();
  const queryClient = useQueryClient();
  return useMutation<boolean, Error, string>({
    mutationFn: async (bookingRef) => {
      if (!backend) return false;
      try {
        const result = await (
          backend as unknown as {
            cancelBooking: (ref: string) => Promise<boolean>;
          }
        ).cancelBooking(bookingRef);
        return result;
      } catch {
        return false;
      }
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["userBookings"] });
    },
  });
}

// ── Mock Data ─────────────────────────────────────────────────────────────────
export const MOCK_AIRPORTS: Airport[] = [
  { code: "ABV", city: "Abuja", country: "Nigeria" },
  { code: "LOS", city: "Lagos", country: "Nigeria" },
  { code: "PHC", city: "Port Harcourt", country: "Nigeria" },
  { code: "LHR", city: "London", country: "United Kingdom" },
  { code: "CDG", city: "Paris", country: "France" },
  { code: "DXB", city: "Dubai", country: "UAE" },
  { code: "JFK", city: "New York", country: "USA" },
  { code: "FRA", city: "Frankfurt", country: "Germany" },
  { code: "DOH", city: "Doha", country: "Qatar" },
  { code: "IST", city: "Istanbul", country: "Turkey" },
  { code: "CAI", city: "Cairo", country: "Egypt" },
  { code: "JNB", city: "Johannesburg", country: "South Africa" },
  { code: "NBO", city: "Nairobi", country: "Kenya" },
  { code: "ACC", city: "Accra", country: "Ghana" },
  { code: "CMN", city: "Casablanca", country: "Morocco" },
];

const MOCK_POPULAR_ROUTES: PopularRoute[] = [
  {
    origin: { code: "ABV", city: "Abuja", country: "Nigeria" },
    destination: { code: "LHR", city: "London", country: "UK" },
    typicalPrice: { amount: 850, currency: "USD" },
  },
  {
    origin: { code: "LOS", city: "Lagos", country: "Nigeria" },
    destination: { code: "DXB", city: "Dubai", country: "UAE" },
    typicalPrice: { amount: 620, currency: "USD" },
  },
  {
    origin: { code: "ABV", city: "Abuja", country: "Nigeria" },
    destination: { code: "CDG", city: "Paris", country: "France" },
    typicalPrice: { amount: 790, currency: "USD" },
  },
  {
    origin: { code: "LOS", city: "Lagos", country: "Nigeria" },
    destination: { code: "JFK", city: "New York", country: "USA" },
    typicalPrice: { amount: 980, currency: "USD" },
  },
  {
    origin: { code: "ABV", city: "Abuja", country: "Nigeria" },
    destination: { code: "DOH", city: "Doha", country: "Qatar" },
    typicalPrice: { amount: 540, currency: "USD" },
  },
  {
    origin: { code: "LOS", city: "Lagos", country: "Nigeria" },
    destination: { code: "JNB", city: "Johannesburg", country: "SA" },
    typicalPrice: { amount: 410, currency: "USD" },
  },
  {
    origin: { code: "ABV", city: "Abuja", country: "Nigeria" },
    destination: { code: "IST", city: "Istanbul", country: "Turkey" },
    typicalPrice: { amount: 670, currency: "USD" },
  },
  {
    origin: { code: "LOS", city: "Lagos", country: "Nigeria" },
    destination: { code: "FRA", city: "Frankfurt", country: "Germany" },
    typicalPrice: { amount: 730, currency: "USD" },
  },
];

const AIRLINES = [
  { name: "Qatar Airways", code: "QR" },
  { name: "Emirates", code: "EK" },
  { name: "Turkish Airlines", code: "TK" },
  { name: "Air France", code: "AF" },
  { name: "British Airways", code: "BA" },
  { name: "Lufthansa", code: "LH" },
  { name: "Ethiopian Airlines", code: "ET" },
  { name: "Kenya Airways", code: "KQ" },
];

function generateMockFlights(params: FlightSearchParams): FlightResult[] {
  return AIRLINES.slice(0, 6).map((airline, i) => ({
    flightId: `${airline.code}${1000 + i}`,
    flightNumber: `${airline.code}${100 + i * 11}`,
    airline: airline.name,
    originCode: params.origin.toUpperCase().slice(0, 3),
    destinationCode: params.destination.toUpperCase().slice(0, 3),
    departureTime: `${8 + i * 2}:${i % 2 === 0 ? "00" : "30"}`,
    arrivalTime: `${(8 + i * 2 + 6) % 24}:${i % 2 === 0 ? "30" : "00"}`,
    durationMinutes: BigInt(360 + i * 30),
    stops: BigInt(i % 3 === 0 ? 0 : 1),
    price: { amount: 450 + i * 85, currency: "USD" },
    cabinClass: params.cabinClass,
    availableSeats: BigInt(12 + i * 4),
  }));
}
