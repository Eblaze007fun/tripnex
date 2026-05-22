import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface FlightPrice {
    currency: string;
    amount: number;
}
export type Timestamp = bigint;
export type ResponseId = bigint;
export interface FormField {
    id: string;
    order: bigint;
    fieldLabel: string;
    required: boolean;
    placeholder: string;
    options: Array<FieldOption>;
    fieldType: FieldType;
}
export interface FieldAnswer {
    value: string;
    fieldId: string;
}
export interface CreateBookingInput {
    flight: FlightResult;
    passengers: Array<PassengerDetails>;
}
export interface Form {
    id: FormId;
    status: FormStatus;
    title: string;
    owner: UserId;
    createdAt: Timestamp;
    description: string;
    fields: Array<FormField>;
    updatedAt: Timestamp;
}
export interface Booking {
    status: BookingStatus;
    flight: FlightResult;
    userId: UserId;
    createdAt: Timestamp;
    passengers: Array<PassengerDetails>;
    bookingRef: string;
}
export type FormId = string;
export interface UpdateFormInput {
    title: string;
    description: string;
    fields: Array<FormField>;
}
export interface CreateFormInput {
    title: string;
    description: string;
    fields: Array<FormField>;
}
export interface PassengerDetails {
    email: string;
    seatPreference: SeatPreference;
    phone: string;
    lastName: string;
    firstName: string;
}
export interface Airport {
    country: string;
    city: string;
    code: string;
}
export interface FormResponse {
    id: ResponseId;
    answers: Array<FieldAnswer>;
    submittedAt: Timestamp;
    formId: FormId;
}
export interface FieldOption {
    optionLabel: string;
    value: string;
}
export type UserId = Principal;
export interface PassengerCounts {
    infants: bigint;
    children: bigint;
    adults: bigint;
}
export interface FlightSearchParams {
    destination: string;
    cabinClass: CabinClass;
    tripType: TripType;
    departureDate: string;
    origin: string;
    passengers: PassengerCounts;
    returnDate?: string;
}
export interface FormSummary {
    id: FormId;
    status: FormStatus;
    title: string;
    createdAt: Timestamp;
    description: string;
    updatedAt: Timestamp;
    responseCount: bigint;
}
export interface FlightResult {
    cabinClass: CabinClass;
    arrivalTime: string;
    flightNumber: string;
    departureTime: string;
    destinationCode: string;
    stops: bigint;
    durationMinutes: bigint;
    availableSeats: bigint;
    airline: string;
    price: FlightPrice;
    flightId: string;
    originCode: string;
}
export interface SubmitResponseInput {
    answers: Array<FieldAnswer>;
    formId: FormId;
}
export interface PopularRoute {
    destination: Airport;
    origin: Airport;
    typicalPrice?: FlightPrice;
}
export enum BookingStatus {
    cancelled = "cancelled",
    confirmed = "confirmed"
}
export enum CabinClass {
    first = "first",
    economy = "economy",
    business = "business"
}
export enum FieldType {
    text = "text",
    textarea = "textarea",
    email = "email",
    number_ = "number",
    checkbox = "checkbox",
    dropdown = "dropdown"
}
export enum FormStatus {
    published = "published",
    draft = "draft"
}
export enum SeatPreference {
    aisle = "aisle",
    none = "none",
    middle = "middle",
    window_ = "window"
}
export enum TripType {
    roundTrip = "roundTrip",
    oneWay = "oneWay"
}
export interface backendInterface {
    cancelBooking(bookingRef: string): Promise<boolean>;
    createBooking(input: CreateBookingInput): Promise<Booking>;
    createForm(input: CreateFormInput): Promise<Form>;
    deleteForm(formId: FormId): Promise<boolean>;
    duplicateForm(formId: FormId): Promise<Form | null>;
    exportResponsesCsv(formId: FormId): Promise<string>;
    getAviationstackApiKey(): Promise<string | null>;
    getBookingByRef(ref: string): Promise<Booking | null>;
    getForm(formId: FormId): Promise<Form | null>;
    getPopularRoutes(): Promise<Array<PopularRoute>>;
    getPublishedForm(formId: FormId): Promise<Form | null>;
    getResponses(formId: FormId): Promise<Array<FormResponse>>;
    getUserBookings(): Promise<Array<Booking>>;
    listForms(): Promise<Array<FormSummary>>;
    publishForm(formId: FormId): Promise<Form | null>;
    searchAirports(searchTerm: string): Promise<Array<Airport>>;
    searchFlights(params: FlightSearchParams): Promise<Array<FlightResult>>;
    setAviationstackApiKey(key: string): Promise<void>;
    submitResponse(input: SubmitResponseInput): Promise<FormResponse>;
    unpublishForm(formId: FormId): Promise<Form | null>;
    updateForm(formId: FormId, input: UpdateFormInput): Promise<Form | null>;
}
