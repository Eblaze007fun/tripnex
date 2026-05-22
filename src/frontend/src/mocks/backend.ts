import type { backendInterface, BookingStatus, CabinClass, FieldType, FormStatus, SeatPreference, TripType, Booking, Form, FormResponse, FormSummary, FlightResult, Airport, PopularRoute } from "../backend";

const mockFlight1: FlightResult = {
  cabinClass: "economy" as unknown as CabinClass,
  arrivalTime: "14:35",
  flightNumber: "TX 401",
  departureTime: "11:00",
  destinationCode: "LHR",
  stops: 0n,
  durationMinutes: 215n,
  availableSeats: 42n,
  airline: "TRIPNEX Airways",
  price: { currency: "USD", amount: 485 },
  flightId: "flight-001",
  originCode: "ABV",
};

const mockFlight2: FlightResult = {
  cabinClass: "economy" as unknown as CabinClass,
  arrivalTime: "19:50",
  flightNumber: "TX 207",
  departureTime: "15:30",
  destinationCode: "LHR",
  stops: 1n,
  durationMinutes: 260n,
  availableSeats: 18n,
  airline: "TRIPNEX Airways",
  price: { currency: "USD", amount: 329 },
  flightId: "flight-002",
  originCode: "ABV",
};

const mockFlight3: FlightResult = {
  cabinClass: "business" as unknown as CabinClass,
  arrivalTime: "08:15",
  flightNumber: "TX 550",
  departureTime: "22:00",
  destinationCode: "DXB",
  stops: 0n,
  durationMinutes: 255n,
  availableSeats: 8n,
  airline: "TRIPNEX Airways",
  price: { currency: "USD", amount: 1240 },
  flightId: "flight-003",
  originCode: "LOS",
};

const mockAirportABV: Airport = { country: "Nigeria", city: "Abuja", code: "ABV" };
const mockAirportLOS: Airport = { country: "Nigeria", city: "Lagos", code: "LOS" };
const mockAirportLHR: Airport = { country: "United Kingdom", city: "London", code: "LHR" };
const mockAirportDXB: Airport = { country: "UAE", city: "Dubai", code: "DXB" };
const mockAirportJFK: Airport = { country: "USA", city: "New York", code: "JFK" };
const mockAirportCDG: Airport = { country: "France", city: "Paris", code: "CDG" };

export const mockBackend: backendInterface = {
  searchFlights: async (_params) => [mockFlight1, mockFlight2, mockFlight3],

  searchAirports: async (searchTerm) => {
    const all = [mockAirportABV, mockAirportLOS, mockAirportLHR, mockAirportDXB, mockAirportJFK, mockAirportCDG];
    const lower = searchTerm.toLowerCase();
    return all.filter(
      (a) =>
        a.city.toLowerCase().includes(lower) ||
        a.code.toLowerCase().includes(lower) ||
        a.country.toLowerCase().includes(lower)
    );
  },

  getPopularRoutes: async (): Promise<Array<PopularRoute>> => [
    { origin: mockAirportABV, destination: mockAirportLHR, typicalPrice: { currency: "USD", amount: 485 } },
    { origin: mockAirportLOS, destination: mockAirportDXB, typicalPrice: { currency: "USD", amount: 420 } },
    { origin: mockAirportABV, destination: mockAirportJFK, typicalPrice: { currency: "USD", amount: 760 } },
    { origin: mockAirportLOS, destination: mockAirportCDG, typicalPrice: { currency: "USD", amount: 510 } },
  ],

  createBooking: async (input) => ({
    status: "confirmed" as BookingStatus,
    flight: input.flight,
    createdAt: BigInt(Date.now()),
    passengers: input.passengers,
    bookingRef: "TXN-" + Math.random().toString(36).toUpperCase().slice(2, 8),
  } as Booking),

  getBookingByRef: async (_ref) => ({
    status: "confirmed" as BookingStatus,
    flight: mockFlight1,
    createdAt: BigInt(Date.now() - 86400000),
    passengers: [
      {
        email: "traveler@example.com",
        seatPreference: "window_" as SeatPreference,
        phone: "+234 801 234 5678",
        lastName: "Okafor",
        firstName: "Chidi",
      },
    ],
    bookingRef: "TXN-ABC123",
  } as Booking),

  getUserBookings: async (): Promise<Array<Booking>> => [],
  cancelBooking: async (_bookingRef: string): Promise<boolean> => false,
  getAviationstackApiKey: async (): Promise<string | null> => null,
  setAviationstackApiKey: async (_key: string): Promise<void> => undefined,
  listForms: async (): Promise<Array<FormSummary>> => [],
  createForm: async (input) => ({
    id: "form-001",
    status: "draft" as FormStatus,
    title: input.title,
    owner: {} as any,
    createdAt: BigInt(Date.now()),
    description: input.description,
    fields: input.fields,
    updatedAt: BigInt(Date.now()),
  } as Form),
  deleteForm: async (_formId) => true,
  duplicateForm: async (_formId) => null,
  exportResponsesCsv: async (_formId) => "id,answers\n",
  getForm: async (_formId) => null,
  getPublishedForm: async (_formId) => null,
  getResponses: async (_formId): Promise<Array<FormResponse>> => [],
  publishForm: async (_formId) => null,
  submitResponse: async (input) => ({
    id: BigInt(1),
    answers: input.answers,
    submittedAt: BigInt(Date.now()),
    formId: input.formId,
  } as FormResponse),
  unpublishForm: async (_formId) => null,
  updateForm: async (_formId, _input) => null,
};
