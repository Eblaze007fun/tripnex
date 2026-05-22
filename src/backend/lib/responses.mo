import List "mo:core/List";
import Map "mo:core/Map";
import Time "mo:core/Time";
import Text "mo:core/Text";
import Runtime "mo:core/Runtime";
import Common "../types/common";
import FormTypes "../types/forms";
import Types "../types/responses";

module {
  public func submit(
    responses : Map.Map<Common.FormId, List.List<Types.FormResponse>>,
    responseCounts : Map.Map<Common.FormId, Nat>,
    forms : Map.Map<Common.FormId, FormTypes.Form>,
    input : Types.SubmitResponseInput,
    nextId : Nat,
  ) : Types.FormResponse {
    let form = switch (forms.get(input.formId)) {
      case (?f) f;
      case null Runtime.trap("Form not found");
    };
    switch (form.status) {
      case (#draft) Runtime.trap("Cannot submit response to a draft form");
      case (#published) {};
    };
    let response : Types.FormResponse = {
      id = nextId;
      formId = input.formId;
      answers = input.answers;
      submittedAt = Time.now();
    };
    let list = switch (responses.get(input.formId)) {
      case (?existing) existing;
      case null {
        let newList = List.empty<Types.FormResponse>();
        responses.add(input.formId, newList);
        newList
      };
    };
    list.add(response);
    incrementCount(responseCounts, input.formId);
    response
  };

  public func listByForm(
    responses : Map.Map<Common.FormId, List.List<Types.FormResponse>>,
    formId : Common.FormId,
  ) : [Types.FormResponse] {
    switch (responses.get(formId)) {
      case (?list) list.toArray();
      case null [];
    }
  };

  public func toCsv(
    responseList : [Types.FormResponse],
    form : FormTypes.Form,
  ) : Text {
    let fields = form.fields;
    // Header row: field labels joined by comma
    let headerParts = List.empty<Text>();
    for (field in fields.values()) {
      headerParts.add(escapeCsvField(field.fieldLabel));
    };
    let header = headerParts.values().join(",");

    let rows = List.empty<Text>();
    rows.add(header);

    for (resp in responseList.values()) {
      let cols = List.empty<Text>();
      for (field in fields.values()) {
        let answer = switch (resp.answers.find(func(a : Types.FieldAnswer) : Bool { a.fieldId == field.id })) {
          case (?a) a.value;
          case null "";
        };
        cols.add(escapeCsvField(answer));
      };
      rows.add(cols.values().join(","));
    };

    rows.values().join("\n")
  };

  func escapeCsvField(value : Text) : Text {
    if (value.contains(#text ",") or value.contains(#text "\n") or value.contains(#text "\"")) {
      "\"" # value.replace(#text "\"", "\"\"") # "\""
    } else {
      value
    }
  };

  public func incrementCount(
    responseCounts : Map.Map<Common.FormId, Nat>,
    formId : Common.FormId,
  ) {
    let current = switch (responseCounts.get(formId)) {
      case (?c) c;
      case null 0;
    };
    responseCounts.add(formId, current + 1);
  };

  public func getCount(
    responseCounts : Map.Map<Common.FormId, Nat>,
    formId : Common.FormId,
  ) : Nat {
    switch (responseCounts.get(formId)) {
      case (?c) c;
      case null 0;
    }
  };
};
