import List "mo:core/List";
import Map "mo:core/Map";
import Time "mo:core/Time";
import Principal "mo:core/Principal";
import Common "../types/common";
import Types "../types/forms";

module {
  public func generateId(counter : Nat) : Common.FormId {
    "form-" # counter.toText()
  };

  public func create(
    forms : Map.Map<Common.FormId, Types.Form>,
    owner : Common.UserId,
    input : Types.CreateFormInput,
    idCounter : Nat,
  ) : Types.Form {
    let now = Time.now();
    let id = generateId(idCounter);
    let form : Types.Form = {
      id;
      owner;
      title = input.title;
      description = input.description;
      fields = input.fields;
      status = #draft;
      createdAt = now;
      updatedAt = now;
    };
    forms.add(id, form);
    form
  };

  public func update(
    forms : Map.Map<Common.FormId, Types.Form>,
    formId : Common.FormId,
    caller : Common.UserId,
    input : Types.UpdateFormInput,
  ) : ?Types.Form {
    switch (forms.get(formId)) {
      case (?form) {
        if (not Principal.equal(form.owner, caller)) return null;
        let updated : Types.Form = {
          form with
          title = input.title;
          description = input.description;
          fields = input.fields;
          updatedAt = Time.now();
        };
        forms.add(formId, updated);
        ?updated
      };
      case null null;
    }
  };

  public func publish(
    forms : Map.Map<Common.FormId, Types.Form>,
    formId : Common.FormId,
    caller : Common.UserId,
  ) : ?Types.Form {
    switch (forms.get(formId)) {
      case (?form) {
        if (not Principal.equal(form.owner, caller)) return null;
        let updated : Types.Form = {
          form with
          status = #published;
          updatedAt = Time.now();
        };
        forms.add(formId, updated);
        ?updated
      };
      case null null;
    }
  };

  public func unpublish(
    forms : Map.Map<Common.FormId, Types.Form>,
    formId : Common.FormId,
    caller : Common.UserId,
  ) : ?Types.Form {
    switch (forms.get(formId)) {
      case (?form) {
        if (not Principal.equal(form.owner, caller)) return null;
        let updated : Types.Form = {
          form with
          status = #draft;
          updatedAt = Time.now();
        };
        forms.add(formId, updated);
        ?updated
      };
      case null null;
    }
  };

  public func delete(
    forms : Map.Map<Common.FormId, Types.Form>,
    formId : Common.FormId,
    caller : Common.UserId,
  ) : Bool {
    switch (forms.get(formId)) {
      case (?form) {
        if (not Principal.equal(form.owner, caller)) return false;
        forms.remove(formId);
        true
      };
      case null false;
    }
  };

  public func duplicate(
    forms : Map.Map<Common.FormId, Types.Form>,
    formId : Common.FormId,
    caller : Common.UserId,
    idCounter : Nat,
  ) : ?Types.Form {
    switch (forms.get(formId)) {
      case (?form) {
        let now = Time.now();
        let newId = generateId(idCounter);
        let copy : Types.Form = {
          form with
          id = newId;
          owner = caller;
          title = "Copy of " # form.title;
          status = #draft;
          createdAt = now;
          updatedAt = now;
        };
        forms.add(newId, copy);
        ?copy
      };
      case null null;
    }
  };

  public func getById(
    forms : Map.Map<Common.FormId, Types.Form>,
    formId : Common.FormId,
  ) : ?Types.Form {
    forms.get(formId)
  };

  public func listByOwner(
    forms : Map.Map<Common.FormId, Types.Form>,
    responseCounts : Map.Map<Common.FormId, Nat>,
    owner : Common.UserId,
  ) : [Types.FormSummary] {
    let matching = List.empty<Types.FormSummary>();
    for ((_, form) in forms.entries()) {
      if (Principal.equal(form.owner, owner)) {
        let count = switch (responseCounts.get(form.id)) {
          case (?c) c;
          case null 0;
        };
        matching.add(toSummary(form, count));
      };
    };
    matching.toArray()
  };

  public func toSummary(form : Types.Form, responseCount : Nat) : Types.FormSummary {
    {
      id = form.id;
      title = form.title;
      description = form.description;
      status = form.status;
      responseCount;
      createdAt = form.createdAt;
      updatedAt = form.updatedAt;
    }
  };
};
