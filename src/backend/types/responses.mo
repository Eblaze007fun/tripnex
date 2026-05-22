import Common "common";

module {
  public type FieldAnswer = {
    fieldId : Text;
    value : Text;
  };

  public type FormResponse = {
    id : Common.ResponseId;
    formId : Common.FormId;
    answers : [FieldAnswer];
    submittedAt : Common.Timestamp;
  };

  public type SubmitResponseInput = {
    formId : Common.FormId;
    answers : [FieldAnswer];
  };
};
