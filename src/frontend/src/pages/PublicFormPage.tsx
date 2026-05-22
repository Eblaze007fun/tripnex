import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useBackend } from "@/hooks/useBackend";
import {
  type FieldAnswer,
  type Form,
  type FormField,
  getFieldTypeName,
  getStatusName,
} from "@/types";
import { useParams } from "@tanstack/react-router";
import { AlertCircle, CheckCircle2, LayoutList, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────
type PageState = "loading" | "not-found" | "error" | "form" | "success";

// ─── Minimal Public Header ────────────────────────────────────────────────────
function PublicHeader() {
  return (
    <header className="bg-card border-b border-border shadow-subtle sticky top-0 z-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 h-14 flex items-center">
        <a href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
            <LayoutList className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="font-display font-bold text-foreground text-lg tracking-tight">
            FormFlow
          </span>
        </a>
      </div>
    </header>
  );
}

// ─── Field Renderer ──────────────────────────────────────────────────────────
interface FieldRendererProps {
  field: FormField;
  value: string;
  onChange: (value: string) => void;
  error: string | null;
}

function FieldRenderer({ field, value, onChange, error }: FieldRendererProps) {
  const typeName = getFieldTypeName(field.fieldType);
  const inputId = `field-${field.id}`;

  return (
    <div className="space-y-1.5">
      <Label htmlFor={inputId} className="text-sm font-medium text-foreground">
        {field.fieldLabel}
        {field.required && (
          <span className="text-destructive ml-1" aria-hidden="true">
            *
          </span>
        )}
      </Label>

      {typeName === "text" && (
        <Input
          id={inputId}
          type="text"
          placeholder={field.placeholder || ""}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-required={field.required}
          aria-invalid={!!error}
          data-ocid="field-input"
        />
      )}

      {typeName === "email" && (
        <Input
          id={inputId}
          type="email"
          placeholder={field.placeholder || "name@example.com"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-required={field.required}
          aria-invalid={!!error}
          data-ocid="field-input"
        />
      )}

      {typeName === "number" && (
        <Input
          id={inputId}
          type="number"
          placeholder={field.placeholder || "0"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-required={field.required}
          aria-invalid={!!error}
          data-ocid="field-input"
        />
      )}

      {typeName === "textarea" && (
        <Textarea
          id={inputId}
          placeholder={field.placeholder || ""}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={4}
          aria-required={field.required}
          aria-invalid={!!error}
          data-ocid="field-input"
        />
      )}

      {typeName === "dropdown" && (
        <Select value={value} onValueChange={onChange}>
          <SelectTrigger
            id={inputId}
            aria-required={field.required}
            aria-invalid={!!error}
            data-ocid="field-input"
          >
            <SelectValue
              placeholder={field.placeholder || "Select an option"}
            />
          </SelectTrigger>
          <SelectContent>
            {field.options.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.optionLabel}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      {typeName === "checkbox" && (
        <fieldset className="space-y-2">
          {field.options.map((opt) => {
            const checked = value
              .split(",")
              .filter(Boolean)
              .includes(opt.value);
            return (
              <div key={opt.value} className="flex items-center gap-2">
                <Checkbox
                  id={`${inputId}-${opt.value}`}
                  checked={checked}
                  onCheckedChange={(c) => {
                    const current = value.split(",").filter(Boolean);
                    const next = c
                      ? [...current, opt.value]
                      : current.filter((v) => v !== opt.value);
                    onChange(next.join(","));
                  }}
                  data-ocid="field-checkbox"
                />
                <Label
                  htmlFor={`${inputId}-${opt.value}`}
                  className="text-sm font-normal cursor-pointer"
                >
                  {opt.optionLabel}
                </Label>
              </div>
            );
          })}
        </fieldset>
      )}

      {error && (
        <p
          className="text-xs text-destructive flex items-center gap-1 mt-1"
          role="alert"
        >
          <AlertCircle className="w-3 h-3 shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function PublicFormPage() {
  const { formId } = useParams({ strict: false }) as { formId: string };
  const { backend } = useBackend();

  const [pageState, setPageState] = useState<PageState>("loading");
  const [form, setForm] = useState<Form | null>(null);
  const [values, setValues] = useState<Record<string, string>>({});
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load form
  useEffect(() => {
    if (!formId) {
      setPageState("not-found");
      return;
    }

    async function loadForm() {
      setPageState("loading");
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const actor = backend as any;
        if (!actor || typeof actor.getPublishedForm !== "function") {
          // Backend not ready yet (identity not set); retry when backend is available
          setPageState("loading");
          return;
        }

        const result = (await actor.getPublishedForm(formId)) as [] | [Form];

        if (!Array.isArray(result) || result.length === 0) {
          setPageState("not-found");
          return;
        }

        const loadedForm = result[0];
        if (getStatusName(loadedForm.status) !== "published") {
          setPageState("not-found");
          return;
        }

        setForm(loadedForm);
        const initialValues: Record<string, string> = {};
        for (const f of loadedForm.fields as FormField[]) {
          initialValues[f.id] = "";
        }
        setValues(initialValues);
        setPageState("form");
      } catch {
        setPageState("error");
      }
    }

    void loadForm();
  }, [formId, backend]);

  function validateFields(): boolean {
    if (!form) return false;
    const errors: Record<string, string> = {};
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    for (const field of form.fields) {
      const val = (values[field.id] ?? "").trim();
      const typeName = getFieldTypeName(field.fieldType);

      if (field.required) {
        if (typeName === "checkbox") {
          if (!val) errors[field.id] = "Please select at least one option.";
        } else if (!val) {
          errors[field.id] = "This field is required.";
        }
      }

      if (typeName === "email" && val && !emailRe.test(val)) {
        errors[field.id] = "Please enter a valid email address.";
      }
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form) return;
    if (!validateFields()) return;

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const actor = backend as any;
      if (!actor || typeof actor.submitResponse !== "function") {
        throw new Error("Form submission is not available right now.");
      }

      const answers: FieldAnswer[] = form.fields.map((field) => ({
        fieldId: field.id,
        value: (values[field.id] ?? "").trim(),
      }));

      const result = (await actor.submitResponse({
        formId: form.id,
        answers,
      })) as { ok: unknown } | { err: string };

      if ("err" in result) {
        throw new Error(
          typeof result.err === "string" ? result.err : "Submission failed.",
        );
      }

      setPageState("success");
    } catch (err) {
      setSubmitError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  // ─── Loading ─────────────────────────────────────────────────────────────
  if (pageState === "loading") {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <PublicHeader />
        <main
          className="flex-1 flex items-center justify-center"
          data-ocid="loading-state"
        >
          <div className="flex flex-col items-center gap-3 text-muted-foreground">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <p className="text-sm">Loading form…</p>
          </div>
        </main>
      </div>
    );
  }

  // ─── Not found ────────────────────────────────────────────────────────────
  if (pageState === "not-found") {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <PublicHeader />
        <main
          className="flex-1 flex items-center justify-center px-4"
          data-ocid="not-found-state"
        >
          <div className="text-center max-w-sm">
            <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-5">
              <AlertCircle className="w-7 h-7 text-muted-foreground" />
            </div>
            <h1 className="font-display font-bold text-foreground text-2xl mb-2">
              Form not found
            </h1>
            <p className="text-muted-foreground text-sm">
              This form doesn't exist or is no longer available.
            </p>
          </div>
        </main>
      </div>
    );
  }

  // ─── Error ────────────────────────────────────────────────────────────────
  if (pageState === "error") {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <PublicHeader />
        <main
          className="flex-1 flex items-center justify-center px-4"
          data-ocid="error-state"
        >
          <div className="text-center max-w-sm">
            <div className="w-14 h-14 rounded-2xl bg-destructive/10 flex items-center justify-center mx-auto mb-5">
              <AlertCircle className="w-7 h-7 text-destructive" />
            </div>
            <h1 className="font-display font-bold text-foreground text-2xl mb-2">
              Something went wrong
            </h1>
            <p className="text-muted-foreground text-sm mb-6">
              We couldn't load this form. Please check your connection and try
              again.
            </p>
            <Button
              variant="outline"
              onClick={() => window.location.reload()}
              data-ocid="retry-btn"
            >
              Try again
            </Button>
          </div>
        </main>
      </div>
    );
  }

  // ─── Success ──────────────────────────────────────────────────────────────
  if (pageState === "success") {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <PublicHeader />
        <main
          className="flex-1 flex items-center justify-center px-4"
          data-ocid="success-state"
        >
          <div className="text-center max-w-sm">
            <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto mb-5">
              <CheckCircle2 className="w-7 h-7 text-accent" />
            </div>
            <h1 className="font-display font-bold text-foreground text-2xl mb-2">
              Thank you!
            </h1>
            <p className="text-muted-foreground text-sm">
              Your response has been submitted.
            </p>
          </div>
        </main>
      </div>
    );
  }

  // ─── Form ─────────────────────────────────────────────────────────────────
  const sortedFields = form
    ? [...form.fields].sort((a, b) => a.order - b.order)
    : [];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <PublicHeader />
      <main className="flex-1 py-10 px-4">
        <div className="max-w-xl mx-auto">
          {/* Form card */}
          <div className="bg-card border border-border rounded-2xl shadow-elevated overflow-hidden">
            {/* Title block */}
            <div className="bg-primary/5 border-b border-border px-8 py-7">
              <h1
                className="font-display font-bold text-foreground text-2xl sm:text-3xl tracking-tight mb-2"
                data-ocid="form-title"
              >
                {form?.title}
              </h1>
              {form?.description && (
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {form.description}
                </p>
              )}
            </div>

            {/* Fields */}
            <form onSubmit={handleSubmit} noValidate>
              <div className="px-8 py-7 space-y-6" data-ocid="form-fields">
                {sortedFields.map((field) => (
                  <FieldRenderer
                    key={field.id}
                    field={field}
                    value={values[field.id] ?? ""}
                    onChange={(val) => {
                      setValues((prev) => ({ ...prev, [field.id]: val }));
                      if (fieldErrors[field.id]) {
                        setFieldErrors((prev) => {
                          const next = { ...prev };
                          delete next[field.id];
                          return next;
                        });
                      }
                    }}
                    error={fieldErrors[field.id] ?? null}
                  />
                ))}
              </div>

              {/* Submit area */}
              <div className="px-8 pb-8 pt-2 border-t border-border mt-2">
                {submitError && (
                  <div
                    className="mb-4 flex items-start gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm"
                    role="alert"
                    data-ocid="submit-error"
                  >
                    <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                    <span>{submitError}</span>
                  </div>
                )}

                <Button
                  type="submit"
                  size="lg"
                  className="w-full font-semibold"
                  disabled={isSubmitting}
                  data-ocid="submit-btn"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Submitting…
                    </>
                  ) : (
                    "Submit response"
                  )}
                </Button>

                <p className="text-xs text-muted-foreground text-center mt-3">
                  Fields marked with <span className="text-destructive">*</span>{" "}
                  are required.
                </p>
              </div>
            </form>
          </div>
        </div>
      </main>

      <footer className="bg-muted/40 border-t border-border py-5">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <p className="text-xs text-muted-foreground">
            Built with love using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-foreground transition-colors"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
