import Map "mo:core/Map";
import Types "../types/flight-search";
import FlightLib "../lib/flight-search";
import List "mo:core/List";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";

mixin (
  bookings : Map.Map<Text, Types.Booking>,
  bookingCounter : { var value : Nat },
  userBookings : Map.Map<Principal, List.List<Text>>,
  apiKeyState : { var aviationstackKey : ?Text },
  adminPrincipal : Principal,
) {
  // ── Flight search ──────────────────────────────────────────────────────────

  /// Search flights for a given route and date.
  /// Returns plausible mock data (8 flights).
  /// Live HTTP outcalls via aviationstack require the http-outcalls extension
  /// wired at main.mo level — not supported in mixin context.
  public query func searchFlights(
    params : Types.FlightSearchParams,
  ) : async [Types.FlightResult] {
    FlightLib.mockFlightResults(params)
  };

  // ── Booking management ─────────────────────────────────────────────────────

  /// Create a booking for a selected flight; returns the persisted Booking.
  /// Create a booking for a selected flight; associates it with the caller principal.
  public shared ({ caller }) func createBooking(
    input : Types.CreateBookingInput,
  ) : async Types.Booking {
    FlightLib.createBooking(bookings, userBookings, bookingCounter, caller, input)
  };

  /// Retrieve a booking by its unique reference number.
  public query func getBookingByRef(
    ref : Text,
  ) : async ?Types.Booking {
    FlightLib.getBookingByRef(bookings, ref)
  };

  // ── Airport autocomplete ───────────────────────────────────────────────────

  /// Search airports by partial code, city, or country name.
  public query func searchAirports(
    searchTerm : Text,
  ) : async [Types.Airport] {
    FlightLib.searchAirports(searchTerm)
  };

  // ── Popular routes ─────────────────────────────────────────────────────────

  /// Return curated popular routes for homepage display.
  public query func getPopularRoutes() : async [Types.PopularRoute] {
    FlightLib.popularRoutes()
  };

  // ── Admin: API key management ──────────────────────────────────────────────

  /// Set the aviationstack API key — admin (canister deployer) only.
  public shared ({ caller }) func setAviationstackApiKey(key : Text) : async () {
    if (caller != adminPrincipal) {
      Runtime.trap("Unauthorized: only admin may set the API key")
    };
    apiKeyState.aviationstackKey := ?key;
  };

  /// Return the current API key status — admin only.
  /// Returns ?Text so the frontend can check if a key is configured.
  public shared ({ caller }) func getAviationstackApiKey() : async ?Text {
    if (caller != adminPrincipal) {
      Runtime.trap("Unauthorized: only admin may view the API key")
    };
    apiKeyState.aviationstackKey
  };

  // ── Booking history per user ───────────────────────────────────────────────

  /// Return all bookings for the calling principal.
  public shared query ({ caller }) func getUserBookings() : async [Types.Booking] {
    FlightLib.getUserBookings(bookings, userBookings, caller)
  };

  /// Cancel a booking — only the booking owner may cancel.
  public shared ({ caller }) func cancelBooking(bookingRef : Text) : async Bool {
    FlightLib.cancelBooking(bookings, caller, bookingRef)
  };
};
