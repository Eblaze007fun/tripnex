import List "mo:core/List";
import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Common "../types/common";
import FormTypes "../types/forms";
import Types "../types/responses";
import ResponseLib "../lib/responses";

mixin (
  forms : Map.Map<Common.FormId, FormTypes.Form>,
  responses : Map.Map<Common.FormId, List.List<Types.FormResponse>>,
  responseCounts : Map.Map<Common.FormId, Nat>,
  nextResponseId : { var value : Nat },
) {
  // Submits a response to a published form (no auth required)
  public shared func submitResponse(input : Types.SubmitResponseInput) : async Types.FormResponse {
    nextResponseId.value += 1;
    ResponseLib.submit(responses, responseCounts, forms, input, nextResponseId.value)
  };

  // Returns all responses for a form owned by the caller
  public shared ({ caller }) func getResponses(formId : Common.FormId) : async [Types.FormResponse] {
    let form = switch (forms.get(formId)) {
      case (?f) f;
      case null return [];
    };
    if (not Principal.equal(form.owner, caller)) return [];
    ResponseLib.listByForm(responses, formId)
  };

  // Returns a CSV export of all responses for a form owned by the caller
  public shared ({ caller }) func exportResponsesCsv(formId : Common.FormId) : async Text {
    let form = switch (forms.get(formId)) {
      case (?f) f;
      case null return "";
    };
    if (not Principal.equal(form.owner, caller)) return "";
    let responseList = ResponseLib.listByForm(responses, formId);
    ResponseLib.toCsv(responseList, form)
  };
};
