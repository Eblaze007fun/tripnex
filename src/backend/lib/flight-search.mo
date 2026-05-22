import Map "mo:core/Map";
import Time "mo:core/Time";
import Array "mo:core/Array";
import Nat "mo:core/Nat";
import Text "mo:core/Text";
import Types "../types/flight-search";
import Principal "mo:core/Principal";
import List "mo:core/List";

module {
  // ── Booking reference generation ───────────────────────────────────────────

  /// Generate a unique booking reference from a sequential counter.
  /// Format: TRIPNEX + 6 zero-padded hex digits.
  public func generateBookingRef(counter : Nat) : Text {
    let hexChars : [Char] = ['0','1','2','3','4','5','6','7','8','9','A','B','C','D','E','F'];
    var n = counter % 16777216;
    var result = "";
    var i = 0;
    while (i < 6) {
      let digit = n % 16;
      result := Text.fromChar(hexChars[digit]) # result;
      n := n / 16;
      i += 1;
    };
    "TRIPNEX" # result
  };

  // ── Booking CRUD ───────────────────────────────────────────────────────────

  /// Create a new booking record and persist it in the bookings map.
  /// Create a new booking record and persist it in the bookings map.
  /// Associates the booking with the caller principal and tracks it in userBookings.
  public func createBooking(
    bookings : Map.Map<Text, Types.Booking>,
    userBookings : Map.Map<Principal, List.List<Text>>,
    counter : { var value : Nat },
    caller : Principal,
    input : Types.CreateBookingInput,
  ) : Types.Booking {
    counter.value += 1;
    let ref = generateBookingRef(counter.value);
    let booking : Types.Booking = {
      bookingRef = ref;
      flight = input.flight;
      passengers = input.passengers;
      status = #confirmed;
      createdAt = Time.now();
      userId = caller;
    };
    bookings.add(ref, booking);
    // Track booking reference per user
    switch (userBookings.get(caller)) {
      case (?existingRefs) { existingRefs.add(ref) };
      case null {
        let refs = List.empty<Text>();
        refs.add(ref);
        userBookings.add(caller, refs);
      };
    };
    booking
  };

  /// Retrieve a booking by its reference number.
  public func getBookingByRef(
    bookings : Map.Map<Text, Types.Booking>,
    ref : Text,
  ) : ?Types.Booking {
    bookings.get(ref)
  };

  // ── Booking history per user ───────────────────────────────────────────────

  /// Get all bookings for a given user principal.
  public func getUserBookings(
    bookings : Map.Map<Text, Types.Booking>,
    userBookings : Map.Map<Principal, List.List<Text>>,
    caller : Principal,
  ) : [Types.Booking] {
    switch (userBookings.get(caller)) {
      case null { [] };
      case (?refs) {
        let result = List.empty<Types.Booking>();
        for (ref in refs.values()) {
          switch (bookings.get(ref)) {
            case (?b) { result.add(b) };
            case null {};
          };
        };
        result.toArray()
      };
    }
  };

  /// Cancel a booking — only the booking owner may cancel.
  /// Returns true on success, false if not found or not authorized.
  public func cancelBooking(
    bookings : Map.Map<Text, Types.Booking>,
    caller : Principal,
    ref : Text,
  ) : Bool {
    switch (bookings.get(ref)) {
      case null { false };
      case (?booking) {
        if (booking.userId != caller) { return false };
        let updated : Types.Booking = { booking with status = #cancelled };
        bookings.add(ref, updated);
        true
      };
    }
  };

  // ── Airport search ─────────────────────────────────────────────────────────

  /// Static list of 35+ major global airports.
  let allAirports : [Types.Airport] = [
    { code = "LOS"; city = "Lagos";           country = "Nigeria" },
    { code = "ABV"; city = "Abuja";           country = "Nigeria" },
    { code = "LHR"; city = "London";          country = "United Kingdom" },
    { code = "LGW"; city = "London Gatwick";  country = "United Kingdom" },
    { code = "CDG"; city = "Paris";           country = "France" },
    { code = "AMS"; city = "Amsterdam";       country = "Netherlands" },
    { code = "FRA"; city = "Frankfurt";       country = "Germany" },
    { code = "DXB"; city = "Dubai";           country = "United Arab Emirates" },
    { code = "JFK"; city = "New York";        country = "United States" },
    { code = "LAX"; city = "Los Angeles";     country = "United States" },
    { code = "ORD"; city = "Chicago";         country = "United States" },
    { code = "ATL"; city = "Atlanta";         country = "United States" },
    { code = "YYZ"; city = "Toronto";         country = "Canada" },
    { code = "GRU"; city = "São Paulo";       country = "Brazil" },
    { code = "NBO"; city = "Nairobi";         country = "Kenya" },
    { code = "CPT"; city = "Cape Town";       country = "South Africa" },
    { code = "JNB"; city = "Johannesburg";    country = "South Africa" },
    { code = "ACC"; city = "Accra";           country = "Ghana" },
    { code = "CMN"; city = "Casablanca";      country = "Morocco" },
    { code = "CAI"; city = "Cairo";           country = "Egypt" },
    { code = "SIN"; city = "Singapore";       country = "Singapore" },
    { code = "HKG"; city = "Hong Kong";       country = "China" },
    { code = "NRT"; city = "Tokyo";           country = "Japan" },
    { code = "SYD"; city = "Sydney";          country = "Australia" },
    { code = "MEL"; city = "Melbourne";       country = "Australia" },
    { code = "DEL"; city = "New Delhi";       country = "India" },
    { code = "BOM"; city = "Mumbai";          country = "India" },
    { code = "DEN"; city = "Denver";          country = "United States" },
    { code = "MIA"; city = "Miami";           country = "United States" },
    { code = "DOH"; city = "Doha";            country = "Qatar" },
    { code = "IST"; city = "Istanbul";        country = "Turkey" },
    { code = "MAD"; city = "Madrid";          country = "Spain" },
    { code = "BCN"; city = "Barcelona";       country = "Spain" },
    { code = "FCO"; city = "Rome";            country = "Italy" },
    { code = "ZRH"; city = "Zurich";          country = "Switzerland" },
    { code = "KUL"; city = "Kuala Lumpur";    country = "Malaysia" },
    { code = "BKK"; city = "Bangkok";         country = "Thailand" },
  ];

  /// Filter the static airport list by query string (code, city, or country).
  public func searchAirports(searchTerm : Text) : [Types.Airport] {
    let term = searchTerm.toLower();
    if (term.size() == 0) { return allAirports };
    let pat : Text.Pattern = #text term;
    allAirports.filter(func(a : Types.Airport) : Bool {
      a.code.toLower().contains(pat) or
      a.city.toLower().contains(pat) or
      a.country.toLower().contains(pat)
    })
  };

  // ── Popular routes ─────────────────────────────────────────────────────────

  /// Return 8 popular routes for homepage display.
  public func popularRoutes() : [Types.PopularRoute] {
    [
      {
        origin      = { code = "LOS"; city = "Lagos";     country = "Nigeria" };
        destination = { code = "LHR"; city = "London";    country = "United Kingdom" };
        typicalPrice = ?{ amount = 620.0; currency = "USD" };
      },
      {
        origin      = { code = "ABV"; city = "Abuja";     country = "Nigeria" };
        destination = { code = "DXB"; city = "Dubai";     country = "United Arab Emirates" };
        typicalPrice = ?{ amount = 490.0; currency = "USD" };
      },
      {
        origin      = { code = "LOS"; city = "Lagos";     country = "Nigeria" };
        destination = { code = "JFK"; city = "New York";  country = "United States" };
        typicalPrice = ?{ amount = 810.0; currency = "USD" };
      },
      {
        origin      = { code = "LHR"; city = "London";    country = "United Kingdom" };
        destination = { code = "JFK"; city = "New York";  country = "United States" };
        typicalPrice = ?{ amount = 380.0; currency = "USD" };
      },
      {
        origin      = { code = "DXB"; city = "Dubai";     country = "United Arab Emirates" };
        destination = { code = "SIN"; city = "Singapore"; country = "Singapore" };
        typicalPrice = ?{ amount = 340.0; currency = "USD" };
      },
      {
        origin      = { code = "NBO"; city = "Nairobi";   country = "Kenya" };
        destination = { code = "LHR"; city = "London";    country = "United Kingdom" };
        typicalPrice = ?{ amount = 560.0; currency = "USD" };
      },
      {
        origin      = { code = "JNB"; city = "Johannesburg"; country = "South Africa" };
        destination = { code = "LHR"; city = "London";       country = "United Kingdom" };
        typicalPrice = ?{ amount = 680.0; currency = "USD" };
      },
      {
        origin      = { code = "CDG"; city = "Paris";     country = "France" };
        destination = { code = "NRT"; city = "Tokyo";     country = "Japan" };
        typicalPrice = ?{ amount = 720.0; currency = "USD" };
      },
    ]
  };

  // ── HTTP-outcall helpers ───────────────────────────────────────────────────

  /// Build the aviationstack request URL from search params.
  /// API_KEY should be set via environment; omit when using mock mode.
  public func buildSearchUrl(params : Types.FlightSearchParams) : Text {
    "https://api.aviationstack.com/v1/flights" #
    "?access_key=REPLACE_WITH_API_KEY" #
    "&dep_iata=" # params.origin #
    "&arr_iata=" # params.destination #
    "&flight_date=" # params.departureDate
  };

  /// Generate plausible mock flight results when no live API key is available.
  /// Returns 6-8 flights for the requested route/date.
  public func mockFlightResults(params : Types.FlightSearchParams) : [Types.FlightResult] {
    let airlines = [
      ("Ethiopian Airlines", "ET"),
      ("British Airways", "BA"),
      ("Emirates", "EK"),
      ("Air France", "AF"),
      ("KLM", "KL"),
      ("Qatar Airways", "QR"),
      ("Turkish Airlines", "TK"),
      ("Lufthansa", "LH"),
    ];
    let prices   = [342.0, 489.0, 521.0, 398.0, 610.0, 455.0, 375.0, 540.0];
    let depTimes = ["06:15", "08:30", "10:45", "13:00", "15:20", "17:50", "20:10", "22:45"];
    let durations = [480, 510, 465, 525, 490, 475, 535, 500];
    let stops    = [0, 1, 0, 1, 0, 0, 1, 0];
    let seats    = [12, 45, 8, 32, 5, 23, 67, 41];

    Array.tabulate<Types.FlightResult>(8, func(i : Nat) : Types.FlightResult {
      let (airline, code) = airlines[i];
      let depHour = depTimes[i];
      let dur = durations[i];
      let arrHourInt = (6 + i * 3 + dur / 60) % 24;
      let arrHour = if (arrHourInt < 10) { "0" # arrHourInt.toText() } else { arrHourInt.toText() };
      {
        flightId        = code # (100 + i).toText() # "-" # params.departureDate;
        airline         = airline;
        flightNumber    = code # (100 + i).toText();
        originCode      = params.origin;
        destinationCode = params.destination;
        departureTime   = params.departureDate # "T" # depHour # ":00Z";
        arrivalTime     = params.departureDate # "T" # arrHour # ":00Z";
        durationMinutes = dur;
        stops           = stops[i];
        price           = { amount = prices[i]; currency = "USD" };
        cabinClass      = params.cabinClass;
        availableSeats  = seats[i];
      }
    })
  };


};
