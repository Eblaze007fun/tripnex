import Common "common";

module {
  // ── Search parameters ──────────────────────────────────────────────────────

  public type TripType = { #oneWay; #roundTrip };

  public type CabinClass = { #economy; #business; #first };

  public type PassengerCounts = {
    adults : Nat;
    children : Nat;
    infants : Nat;
  };

  public type FlightSearchParams = {
    origin : Text;           // IATA airport code e.g. "LOS"
    destination : Text;      // IATA airport code e.g. "LHR"
    departureDate : Text;    // ISO 8601 date "YYYY-MM-DD"
    returnDate : ?Text;      // ISO 8601 date — present for round-trip
    passengers : PassengerCounts;
    cabinClass : CabinClass;
    tripType : TripType;
  };

  // ── Flight result ──────────────────────────────────────────────────────────

  public type FlightPrice = {
    amount : Float;
    currency : Text;         // ISO 4217 e.g. "USD"
  };

  public type FlightResult = {
    flightId : Text;
    airline : Text;
    flightNumber : Text;
    originCode : Text;
    destinationCode : Text;
    departureTime : Text;    // ISO 8601 datetime
    arrivalTime : Text;      // ISO 8601 datetime
    durationMinutes : Nat;
    stops : Nat;
    price : FlightPrice;
    cabinClass : CabinClass;
    availableSeats : Nat;
  };

  // ── Booking ────────────────────────────────────────────────────────────────

  public type SeatPreference = { #window; #middle; #aisle; #none };

  public type PassengerDetails = {
    firstName : Text;
    lastName : Text;
    email : Text;
    phone : Text;
    seatPreference : SeatPreference;
  };

  public type CreateBookingInput = {
    flight : FlightResult;
    passengers : [PassengerDetails];
  };

  public type BookingStatus = { #confirmed; #cancelled };

  public type Booking = {
    bookingRef : Text;          // unique reference number e.g. "TRX-000001"
    flight : FlightResult;
    passengers : [PassengerDetails];
    status : BookingStatus;
    createdAt : Common.Timestamp;
    userId : Common.UserId;     // principal of the user who booked
  };

  // ── Airport autocomplete ───────────────────────────────────────────────────

  public type Airport = {
    code : Text;     // IATA code
    city : Text;
    country : Text;
  };

  // ── Popular routes ─────────────────────────────────────────────────────────

  public type PopularRoute = {
    origin : Airport;
    destination : Airport;
    typicalPrice : ?FlightPrice;
  };
};
