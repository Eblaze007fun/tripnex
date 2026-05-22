import Map "mo:core/Map";
import List "mo:core/List";
import Time "mo:core/Time";
import Principal "mo:core/Principal";
import Common "../types/common";
import Types "../types/forms";
import FormLib "../lib/forms";

mixin (
  forms : Map.Map<Common.FormId, Types.Form>,
  responseCounts : Map.Map<Common.FormId, Nat>,
  formIdCounter : { var value : Nat },
) {
  // Tracks which users have already received sample content
  let sampledUsers = List.empty<Common.UserId>();

  func ensureSampleContent(owner : Common.UserId) {
    // Only seed once per user
    if (sampledUsers.contains(owner)) return;
    sampledUsers.add(owner);

    let now = Time.now();
    formIdCounter.value += 1;
    let sampleForm : Types.Form = {
      id = "form-" # formIdCounter.value.toText();
      owner;
      title = "Event Ticket Order";
      description = "Purchase tickets for our upcoming event. Fill in your details below.";
      fields = [
        {
          id = "field-1";
          fieldType = #text;
          fieldLabel = "Attendee Name";
          placeholder = "Your full name";
          required = true;
          options = [];
          order = 1;
        },
        {
          id = "field-2";
          fieldType = #email;
          fieldLabel = "Email";
          placeholder = "your@email.com";
          required = true;
          options = [];
          order = 2;
        },
        {
          id = "field-3";
          fieldType = #dropdown;
          fieldLabel = "Ticket Type";
          placeholder = "Select ticket type";
          required = false;
          options = [
            { optionLabel = "General Admission"; value = "general" },
            { optionLabel = "VIP"; value = "vip" },
            { optionLabel = "Student"; value = "student" },
          ];
          order = 3;
        },
        {
          id = "field-4";
          fieldType = #number;
          fieldLabel = "Quantity";
          placeholder = "Number of tickets";
          required = true;
          options = [];
          order = 4;
        },
      ];
      status = #draft;
      createdAt = now;
      updatedAt = now;
    };
    forms.add(sampleForm.id, sampleForm);
  };

  // Returns summary list of all forms owned by the caller
  public shared ({ caller }) func listForms() : async [Types.FormSummary] {
    ensureSampleContent(caller);
    FormLib.listByOwner(forms, responseCounts, caller)
  };

  // Returns a single form owned by the caller (for editing)
  public shared ({ caller }) func getForm(formId : Common.FormId) : async ?Types.Form {
    switch (FormLib.getById(forms, formId)) {
      case (?form) {
        if (Principal.equal(form.owner, caller)) ?form else null
      };
      case null null;
    }
  };

  // Returns a published form for public viewing (no auth required)
  public query func getPublishedForm(formId : Common.FormId) : async ?Types.Form {
    switch (FormLib.getById(forms, formId)) {
      case (?form) {
        switch (form.status) {
          case (#published) ?form;
          case (#draft) null;
        }
      };
      case null null;
    }
  };

  // Creates a new draft form
  public shared ({ caller }) func createForm(input : Types.CreateFormInput) : async Types.Form {
    formIdCounter.value += 1;
    FormLib.create(forms, caller, input, formIdCounter.value)
  };

  // Saves/auto-saves an existing form (must be owner)
  public shared ({ caller }) func updateForm(formId : Common.FormId, input : Types.UpdateFormInput) : async ?Types.Form {
    FormLib.update(forms, formId, caller, input)
  };

  // Publishes a form and makes it accessible via public URL
  public shared ({ caller }) func publishForm(formId : Common.FormId) : async ?Types.Form {
    FormLib.publish(forms, formId, caller)
  };

  // Unpublishes a form, setting it back to draft
  public shared ({ caller }) func unpublishForm(formId : Common.FormId) : async ?Types.Form {
    FormLib.unpublish(forms, formId, caller)
  };

  // Deletes a form and all its responses
  public shared ({ caller }) func deleteForm(formId : Common.FormId) : async Bool {
    FormLib.delete(forms, formId, caller)
  };

  // Duplicates a form as a new draft owned by the caller
  public shared ({ caller }) func duplicateForm(formId : Common.FormId) : async ?Types.Form {
    formIdCounter.value += 1;
    FormLib.duplicate(forms, formId, caller, formIdCounter.value)
  };
};
