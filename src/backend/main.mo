import Map "mo:core/Map";
import List "mo:core/List";
import FormTypes "types/forms";
import ResponseTypes "types/responses";
import Common "types/common";
import FormsApi "mixins/forms-api";
import ResponsesApi "mixins/responses-api";
import FlightTypes "types/flight-search";
import FlightSearchApi "mixins/flight-search-api";
import Principal "mo:core/Principal";



actor self {
  // Forms storage: formId -> Form
  let forms = Map.empty<Common.FormId, FormTypes.Form>();

  // Responses storage: formId -> List of responses
  let responses = Map.empty<Common.FormId, List.List<ResponseTypes.FormResponse>>();

  // Response counts per form (for dashboard summary)
  let responseCounts = Map.empty<Common.FormId, Nat>();

  // Auto-incrementing counters
  let formIdCounter = { var value : Nat = 0 };
  let nextResponseId = { var value : Nat = 0 };

  include FormsApi(forms, responseCounts, formIdCounter);
  include ResponsesApi(forms, responses, responseCounts, nextResponseId);

  // Flight-search storage
  let bookings = Map.empty<Text, FlightTypes.Booking>();
  let bookingCounter = { var value : Nat = 0 };
  let userBookings = Map.empty<Principal, List.List<Text>>();
  let apiKeyState = { var aviationstackKey : ?Text = null };
  let adminPrincipal = Principal.fromActor(self);
  include FlightSearchApi(bookings, bookingCounter, userBookings, apiKeyState, adminPrincipal);
};
