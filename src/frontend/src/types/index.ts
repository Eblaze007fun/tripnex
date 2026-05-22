import type { Principal } from "@icp-sdk/core/principal";

export type UserId = Principal;
export type FormId = string;
export type ResponseId = bigint;
export type Timestamp = bigint;

export type FieldType =
  | "text"
  | "email"
  | "number"
  | "dropdown"
  | "checkbox"
  | "textarea";

export type FieldTypeName = FieldType;

export interface FieldOption {
  optionLabel: string;
  value: string;
}

export interface FormField {
  id: string;
  fieldType: FieldType;
  fieldLabel: string;
  placeholder: string;
  required: boolean;
  options: FieldOption[];
  order: number;
}

export type FormStatus = "draft" | "published";

export interface Form {
  id: FormId;
  owner: UserId;
  title: string;
  description: string;
  fields: FormField[];
  status: FormStatus;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface FormSummary {
  id: FormId;
  title: string;
  description: string;
  status: FormStatus;
  responseCount: bigint;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface CreateFormInput {
  title: string;
  description: string;
  fields: FormField[];
}

export interface UpdateFormInput {
  title: string;
  description: string;
  fields: FormField[];
}

export interface FieldAnswer {
  fieldId: string;
  value: string;
}

export interface FormResponse {
  id: ResponseId;
  formId: FormId;
  answers: FieldAnswer[];
  submittedAt: Timestamp;
}

export interface SubmitResponseInput {
  formId: FormId;
  answers: FieldAnswer[];
}

// Helper to get status string
export function getStatusName(status: FormStatus): "draft" | "published" {
  return status;
}

// Helper to get field type name
export function getFieldTypeName(fieldType: FieldType): FieldTypeName {
  return fieldType;
}

// ─── Flight / Booking types ───────────────────────────────────────────────────

export type TripType = "oneWay" | "roundTrip";
export type CabinClass = "economy" | "business" | "first";
export type SeatPreference = "window_" | "middle" | "aisle" | "none";
export type BookingStatus = "confirmed" | "cancelled";

export interface PassengerCounts {
  adults: bigint;
  children: bigint;
  infants: bigint;
}

export interface FlightSearchParams {
  origin: string;
  destination: string;
  departureDate: string;
  returnDate?: string;
  tripType: TripType;
  cabinClass: CabinClass;
  passengers: PassengerCounts;
}

export interface FlightPrice {
  amount: number;
  currency: string;
}

export interface FlightResult {
  flightId: string;
  flightNumber: string;
  airline: string;
  originCode: string;
  destinationCode: string;
  departureTime: string;
  arrivalTime: string;
  durationMinutes: bigint;
  stops: bigint;
  price: FlightPrice;
  cabinClass: CabinClass;
  availableSeats: bigint;
}

export interface PassengerDetails {
  id: string;
  paxId?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  seatPreference: SeatPreference;
}

export interface CreateBookingInput {
  flight: FlightResult;
  passengers: PassengerDetails[];
}

export interface Booking {
  bookingRef: string;
  flight: FlightResult;
  passengers: PassengerDetails[];
  status: BookingStatus;
  createdAt: bigint;
}

export interface Airport {
  code: string;
  city: string;
  country: string;
}

export interface PopularRoute {
  origin: Airport;
  destination: Airport;
  typicalPrice?: FlightPrice;
}
