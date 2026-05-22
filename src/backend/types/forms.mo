import Common "common";

module {
  public type FieldType = {
    #text;
    #email;
    #number;
    #dropdown;
    #checkbox;
    #textarea;
  };

  public type FieldOption = {
    optionLabel : Text;
    value : Text;
  };

  public type FormField = {
    id : Text;
    fieldType : FieldType;
    fieldLabel : Text;
    placeholder : Text;
    required : Bool;
    options : [FieldOption];
    order : Nat;
  };

  public type FormStatus = {
    #draft;
    #published;
  };

  public type Form = {
    id : Common.FormId;
    owner : Common.UserId;
    title : Text;
    description : Text;
    fields : [FormField];
    status : FormStatus;
    createdAt : Common.Timestamp;
    updatedAt : Common.Timestamp;
  };

  // Public API shape — no mutable fields
  public type FormSummary = {
    id : Common.FormId;
    title : Text;
    description : Text;
    status : FormStatus;
    responseCount : Nat;
    createdAt : Common.Timestamp;
    updatedAt : Common.Timestamp;
  };

  public type CreateFormInput = {
    title : Text;
    description : Text;
    fields : [FormField];
  };

  public type UpdateFormInput = {
    title : Text;
    description : Text;
    fields : [FormField];
  };
};
