import { FieldTypeIcon } from "@/components/FieldTypeIcon";
import { Layout } from "@/components/Layout";
import { PageLoader } from "@/components/LoadingSpinner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/useAuth";
import { useBackend } from "@/hooks/useBackend";
import {
  type FieldOption,
  type FieldType,
  type FieldTypeName,
  type Form,
  type FormField,
  getFieldTypeName,
  getStatusName,
} from "@/types";
import { useParams, useRouter } from "@tanstack/react-router";
import {
  AlignJustify,
  AlignLeft,
  AtSign,
  CheckSquare,
  ChevronDown,
  ChevronUp,
  Copy,
  Eye,
  EyeOff,
  Hash,
  Loader2,
  Plus,
  Save,
  Trash2,
  X,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

// ─── Field type definitions ───────────────────────────────────────────────────
const FIELD_TYPES: { name: FieldTypeName; label: string }[] = [
  { name: "text", label: "Short Text" },
  { name: "email", label: "Email" },
  { name: "number", label: "Number" },
  { name: "textarea", label: "Long Text" },
  { name: "dropdown", label: "Dropdown" },
  { name: "checkbox", label: "Checkbox" },
];

function makeFieldType(name: FieldTypeName): FieldType {
  return name;
}

function makeNewField(name: FieldTypeName, order: number): FormField {
  const labels: Record<FieldTypeName, string> = {
    text: "Full Name",
    email: "Email Address",
    number: "Quantity",
    dropdown: "Ticket Type",
    checkbox: "I agree to terms",
    textarea: "Additional Notes",
  };
  return {
    id: crypto.randomUUID(),
    fieldType: makeFieldType(name),
    fieldLabel: labels[name],
    placeholder: "",
    required: name === "email",
    options:
      name === "dropdown" || name === "checkbox"
        ? [
            { optionLabel: "General Admission", value: "general" },
            { optionLabel: "VIP", value: "vip" },
          ]
        : [],
    order,
  };
}

// ─── Preview field renderer ───────────────────────────────────────────────────
function PreviewField({ field }: { field: FormField }) {
  const typeName = getFieldTypeName(field.fieldType);
  return (
    <div className="space-y-1.5">
      <Label className="text-sm font-medium text-foreground">
        {field.fieldLabel}
        {field.required && <span className="text-destructive ml-1">*</span>}
      </Label>
      {typeName === "text" && (
        <Input
          disabled
          placeholder={field.placeholder || "Enter your answer"}
          className="bg-muted/40"
        />
      )}
      {typeName === "email" && (
        <Input
          type="email"
          disabled
          placeholder={field.placeholder || "you@example.com"}
          className="bg-muted/40"
        />
      )}
      {typeName === "number" && (
        <Input
          type="number"
          disabled
          placeholder={field.placeholder || "0"}
          className="bg-muted/40"
        />
      )}
      {typeName === "textarea" && (
        <Textarea
          disabled
          placeholder={field.placeholder || "Enter your answer"}
          className="bg-muted/40 resize-none"
          rows={3}
        />
      )}
      {typeName === "dropdown" && (
        <div className="flex items-center h-9 w-full rounded-md border border-input bg-muted/40 px-3 text-sm text-muted-foreground">
          <span className="flex-1">
            {field.options[0]?.optionLabel || "Select an option"}
          </span>
          <ChevronDown className="w-4 h-4 opacity-60" />
        </div>
      )}
      {typeName === "checkbox" && (
        <div className="space-y-2">
          {field.options.map((opt) => (
            <div key={opt.value} className="flex items-center gap-2">
              <div className="w-4 h-4 rounded border border-input bg-muted/40 shrink-0" />
              <span className="text-sm text-muted-foreground">
                {opt.optionLabel}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Field editor panel ───────────────────────────────────────────────────────
function FieldEditor({
  field,
  onChange,
  onClose,
}: {
  field: FormField;
  onChange: (updated: FormField) => void;
  onClose: () => void;
}) {
  const typeName = getFieldTypeName(field.fieldType);
  const hasOptions = typeName === "dropdown" || typeName === "checkbox";

  function updateOption(idx: number, key: keyof FieldOption, value: string) {
    const newOptions = field.options.map((o, i) =>
      i === idx ? { ...o, [key]: value } : o,
    );
    onChange({ ...field, options: newOptions });
  }

  function addOption() {
    const idx = field.options.length + 1;
    onChange({
      ...field,
      options: [
        ...field.options,
        {
          optionLabel: `Option ${idx}`,
          value: `option-${idx}`,
        },
      ],
    });
  }

  function removeOption(idx: number) {
    onChange({ ...field, options: field.options.filter((_, i) => i !== idx) });
  }

  return (
    <div className="bg-card border border-border rounded-xl shadow-elevated p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
            <FieldTypeIcon
              type={typeName}
              className="text-primary w-3.5 h-3.5"
            />
          </div>
          <span className="text-sm font-semibold text-foreground capitalize">
            {typeName} field
          </span>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="w-6 h-6 flex items-center justify-center rounded-md hover:bg-muted transition-colors"
          aria-label="Close editor"
        >
          <X className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>

      <Separator />

      <div className="space-y-1.5">
        <Label htmlFor="field-label" className="text-xs font-medium">
          Label
        </Label>
        <Input
          id="field-label"
          value={field.fieldLabel}
          onChange={(e) => onChange({ ...field, fieldLabel: e.target.value })}
          placeholder="Field label"
          data-ocid="field-label-input"
        />
      </div>

      {typeName !== "checkbox" && (
        <div className="space-y-1.5">
          <Label htmlFor="field-placeholder" className="text-xs font-medium">
            Placeholder
          </Label>
          <Input
            id="field-placeholder"
            value={field.placeholder}
            onChange={(e) =>
              onChange({ ...field, placeholder: e.target.value })
            }
            placeholder="Hint text shown to respondents"
            data-ocid="field-placeholder-input"
          />
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-foreground">Required</p>
          <p className="text-xs text-muted-foreground">
            Respondents must fill this
          </p>
        </div>
        <Switch
          checked={field.required}
          onCheckedChange={(checked) =>
            onChange({ ...field, required: checked })
          }
          data-ocid="field-required-toggle"
        />
      </div>

      {hasOptions && (
        <>
          <Separator />
          <div className="space-y-2">
            <Label className="text-xs font-medium">Options</Label>
            {field.options.map((opt, idx) => (
              <div
                key={opt.value || `opt-${idx}`}
                className="flex items-center gap-2"
              >
                <Input
                  value={opt.optionLabel}
                  onChange={(e) =>
                    updateOption(idx, "optionLabel", e.target.value)
                  }
                  className="h-8 text-sm"
                  placeholder={`Option ${idx + 1}`}
                  data-ocid="field-option-input"
                />
                <button
                  type="button"
                  onClick={() => removeOption(idx)}
                  className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors shrink-0"
                  aria-label="Remove option"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="w-full text-xs gap-1.5 h-8"
              onClick={addOption}
              data-ocid="add-option-btn"
            >
              <Plus className="w-3 h-3" /> Add option
            </Button>
          </div>
        </>
      )}
    </div>
  );
}

// ─── Field list item ───────────────────────────────────────────────────────────
function FieldItem({
  field,
  index,
  total,
  isSelected,
  onSelect,
  onMoveUp,
  onMoveDown,
  onDelete,
}: {
  field: FormField;
  index: number;
  total: number;
  isSelected: boolean;
  onSelect: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onDelete: () => void;
}) {
  const typeName = getFieldTypeName(field.fieldType);
  return (
    <button
      type="button"
      className={`group flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all duration-150 w-full text-left ${
        isSelected
          ? "border-primary/40 bg-primary/5 shadow-subtle"
          : "border-border bg-card hover:border-border/80 hover:bg-muted/30"
      }`}
      onClick={onSelect}
      data-ocid="field-item"
    >
      <div className="w-7 h-7 rounded-md bg-muted flex items-center justify-center shrink-0">
        <FieldTypeIcon type={typeName} className="text-muted-foreground" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground truncate">
          {field.fieldLabel}
        </p>
        <p className="text-xs text-muted-foreground capitalize">{typeName}</p>
      </div>
      {field.required && (
        <span className="text-xs text-destructive font-medium shrink-0">*</span>
      )}
      <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
        <button
          type="button"
          disabled={index === 0}
          onClick={(e) => {
            e.stopPropagation();
            onMoveUp();
          }}
          className="w-6 h-6 flex items-center justify-center rounded hover:bg-muted disabled:opacity-30 transition-colors"
          aria-label="Move field up"
          data-ocid="field-move-up"
        >
          <ChevronUp className="w-3.5 h-3.5 text-muted-foreground" />
        </button>
        <button
          type="button"
          disabled={index === total - 1}
          onClick={(e) => {
            e.stopPropagation();
            onMoveDown();
          }}
          className="w-6 h-6 flex items-center justify-center rounded hover:bg-muted disabled:opacity-30 transition-colors"
          aria-label="Move field down"
          data-ocid="field-move-down"
        >
          <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="w-6 h-6 flex items-center justify-center rounded hover:bg-destructive/10 hover:text-destructive text-muted-foreground transition-colors"
          aria-label="Delete field"
          data-ocid="field-delete-btn"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </button>
  );
}

// ─── Add field type button ─────────────────────────────────────────────────────
function AddFieldButton({
  typeName,
  label,
  onClick,
}: {
  typeName: FieldTypeName;
  label: string;
  onClick: () => void;
}) {
  const iconMap: Record<FieldTypeName, React.ElementType> = {
    text: AlignLeft,
    email: AtSign,
    number: Hash,
    dropdown: ChevronDown,
    checkbox: CheckSquare,
    textarea: AlignJustify,
  };
  const Icon = iconMap[typeName];
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border bg-card hover:border-primary/30 hover:bg-primary/5 transition-all text-left group"
      data-ocid="add-field-type-btn"
    >
      <div className="w-6 h-6 rounded-md bg-muted flex items-center justify-center group-hover:bg-primary/10 transition-colors shrink-0">
        <Icon className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
      </div>
      <span className="text-xs font-medium text-foreground">{label}</span>
    </button>
  );
}

// ─── Main page component ──────────────────────────────────────────────────────
export default function FormBuilderPage() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { backend } = useBackend();
  const router = useRouter();
  const params = useParams({ strict: false }) as { formId?: string };
  const formId = params.formId;

  const [title, setTitle] = useState("Ticket Registration Form");
  const [description, setDescription] = useState(
    "Register for your tickets below. All fields marked with * are required.",
  );
  const [fields, setFields] = useState<FormField[]>([
    makeNewField("text", 0),
    makeNewField("email", 1),
    makeNewField("number", 2),
    makeNewField("dropdown", 3),
  ]);
  const [status, setStatus] = useState<"draft" | "published">("draft");
  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null);
  const [previewMode, setPreviewMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [loadingForm, setLoadingForm] = useState(!!formId);
  const [currentFormId, setCurrentFormId] = useState<string | null>(
    formId ?? null,
  );

  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isDirty = useRef(false);

  // Redirect if not authed
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      void router.navigate({ to: "/" });
    }
  }, [authLoading, isAuthenticated, router]);

  // Load existing form
  useEffect(() => {
    if (!formId || !backend) return;
    setLoadingForm(true);
    void (async () => {
      try {
        const result = await (
          backend as unknown as {
            getForm: (id: string) => Promise<{ ok?: Form; err?: string }>;
          }
        ).getForm(formId);
        if ("ok" in result && result.ok) {
          const form = result.ok;
          setTitle(form.title);
          setDescription(form.description);
          const sorted = [...form.fields].sort((a, b) => a.order - b.order);
          setFields(sorted);
          setStatus(getStatusName(form.status));
          setCurrentFormId(form.id);
        } else {
          toast.error("Form not found");
          void router.navigate({ to: "/dashboard" });
        }
      } catch {
        toast.error("Failed to load form");
      } finally {
        setLoadingForm(false);
      }
    })();
  }, [formId, backend, router]);

  const selectedField = fields.find((f) => f.id === selectedFieldId) ?? null;

  // Debounced auto-save
  const autoSave = useCallback(() => {
    if (!isDirty.current) return;
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      void performSave(false);
    }, 1500);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  function markDirty() {
    isDirty.current = true;
    autoSave();
  }

  async function performSave(showToast = true) {
    if (!backend) return;
    setIsSaving(true);
    try {
      const saveData = { title, description, fields };
      type SaveInput = {
        title: string;
        description: string;
        fields: FormField[];
      };
      if (currentFormId) {
        await (
          backend as unknown as {
            updateForm: (
              id: string,
              input: SaveInput,
            ) => Promise<{ ok?: Form; err?: string }>;
          }
        ).updateForm(currentFormId, saveData);
      } else {
        const result = await (
          backend as unknown as {
            createForm: (
              input: SaveInput,
            ) => Promise<{ ok?: Form; err?: string }>;
          }
        ).createForm(saveData);
        if ("ok" in result && result.ok) {
          setCurrentFormId(result.ok.id);
          void router.navigate({
            to: "/forms/$formId/edit",
            params: { formId: result.ok.id },
          });
        }
      }
      isDirty.current = false;
      if (showToast) toast.success("Saved");
    } catch {
      toast.error("Failed to save");
    } finally {
      setIsSaving(false);
    }
  }

  async function handlePublish() {
    if (!backend || !currentFormId) {
      // Save first, then publish
      await performSave(false);
      return;
    }
    setIsPublishing(true);
    try {
      await (
        backend as unknown as {
          publishForm: (id: string) => Promise<{ ok?: Form; err?: string }>;
        }
      ).publishForm(currentFormId);
      setStatus("published");
      const shareUrl = `${window.location.origin}/f/${currentFormId}`;
      toast.success("Form published!", {
        description: shareUrl,
        action: {
          label: "Copy link",
          onClick: () => {
            void navigator.clipboard.writeText(shareUrl);
            toast.success("Link copied!");
          },
        },
        duration: 8000,
      });
    } catch {
      toast.error("Failed to publish");
    } finally {
      setIsPublishing(false);
    }
  }

  async function handleUnpublish() {
    if (!backend || !currentFormId) return;
    const confirmed = window.confirm(
      "Unpublish this form? Respondents won't be able to submit new responses.",
    );
    if (!confirmed) return;
    setIsPublishing(true);
    try {
      await (
        backend as unknown as {
          unpublishForm: (id: string) => Promise<{ ok?: Form; err?: string }>;
        }
      ).unpublishForm(currentFormId);
      setStatus("draft");
      toast.success("Form unpublished");
    } catch {
      toast.error("Failed to unpublish");
    } finally {
      setIsPublishing(false);
    }
  }

  function addField(typeName: FieldTypeName) {
    const newField = makeNewField(typeName, fields.length);
    setFields((prev) => [...prev, newField]);
    setSelectedFieldId(newField.id);
    markDirty();
  }

  function updateField(updated: FormField) {
    setFields((prev) => prev.map((f) => (f.id === updated.id ? updated : f)));
    markDirty();
  }

  function deleteField(id: string) {
    setFields((prev) =>
      prev.filter((f) => f.id !== id).map((f, i) => ({ ...f, order: i })),
    );
    if (selectedFieldId === id) setSelectedFieldId(null);
    markDirty();
  }

  function moveField(index: number, direction: "up" | "down") {
    setFields((prev) => {
      const next = [...prev];
      const target = direction === "up" ? index - 1 : index + 1;
      [next[index], next[target]] = [next[target], next[index]];
      return next.map((f, i) => ({ ...f, order: i }));
    });
    markDirty();
  }

  function copyShareLink() {
    if (!currentFormId) return;
    const url = `${window.location.origin}/f/${currentFormId}`;
    void navigator.clipboard.writeText(url);
    toast.success("Link copied to clipboard");
  }

  if (authLoading || loadingForm) return <PageLoader />;

  const isPublished = status === "published";

  return (
    <Layout>
      <div className="flex-1 flex flex-col bg-background">
        {/* Top bar */}
        <div
          className="sticky top-14 z-40 bg-card border-b border-border shadow-subtle"
          data-ocid="builder-topbar"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-3 flex-wrap">
            {/* Title + description */}
            <div className="flex-1 min-w-0 flex flex-col gap-0.5">
              <input
                type="text"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  markDirty();
                }}
                className="font-display font-semibold text-base text-foreground bg-transparent border-none outline-none placeholder:text-muted-foreground w-full truncate"
                placeholder="Form title"
                aria-label="Form title"
                data-ocid="form-title-input"
              />
              <input
                type="text"
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                  markDirty();
                }}
                className="text-xs text-muted-foreground bg-transparent border-none outline-none placeholder:text-muted-foreground w-full"
                placeholder="Add a description..."
                aria-label="Form description"
                data-ocid="form-description-input"
              />
            </div>

            {/* Status badge */}
            <Badge
              variant={isPublished ? "default" : "secondary"}
              className="shrink-0 text-xs"
            >
              {isPublished ? "Published" : "Draft"}
            </Badge>

            {/* Actions */}
            <div className="flex items-center gap-2 shrink-0">
              {/* Preview toggle */}
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="gap-1.5 h-8 text-xs"
                onClick={() => setPreviewMode((p) => !p)}
                data-ocid="preview-toggle-btn"
              >
                {previewMode ? (
                  <>
                    <EyeOff className="w-3.5 h-3.5" /> Edit
                  </>
                ) : (
                  <>
                    <Eye className="w-3.5 h-3.5" /> Preview
                  </>
                )}
              </Button>

              {/* Copy share link (if published) */}
              {isPublished && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="gap-1.5 h-8 text-xs"
                  onClick={copyShareLink}
                  data-ocid="copy-link-btn"
                >
                  <Copy className="w-3.5 h-3.5" /> Copy link
                </Button>
              )}

              {/* Save button */}
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="gap-1.5 h-8 text-xs"
                onClick={() => void performSave(true)}
                disabled={isSaving}
                data-ocid="save-btn"
              >
                {isSaving ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Save className="w-3.5 h-3.5" />
                )}
                Save
              </Button>

              {/* Publish / Unpublish */}
              {isPublished ? (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="gap-1.5 h-8 text-xs border-destructive/40 text-destructive hover:bg-destructive/10"
                  onClick={() => void handleUnpublish()}
                  disabled={isPublishing}
                  data-ocid="unpublish-btn"
                >
                  {isPublishing ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : null}
                  Unpublish
                </Button>
              ) : (
                <Button
                  type="button"
                  size="sm"
                  className="gap-1.5 h-8 text-xs"
                  onClick={() => void handlePublish()}
                  disabled={isPublishing}
                  data-ocid="publish-btn"
                >
                  {isPublishing ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : null}
                  Publish
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Builder / Preview body */}
        {previewMode ? (
          /* ── Preview mode ─────────────────────────────────────────────────── */
          <div className="flex-1 flex items-start justify-center bg-muted/30 py-10 px-4">
            <div
              className="w-full max-w-xl bg-card border border-border rounded-2xl shadow-elevated overflow-hidden"
              data-ocid="form-preview"
            >
              <div className="bg-primary/5 border-b border-border px-8 py-6">
                <h2 className="font-display font-bold text-xl text-foreground">
                  {title}
                </h2>
                {description && (
                  <p className="text-sm text-muted-foreground mt-1.5">
                    {description}
                  </p>
                )}
              </div>
              <div className="px-8 py-6 space-y-5">
                {fields.length === 0 ? (
                  <p className="text-muted-foreground text-sm text-center py-8">
                    No fields yet. Switch back to Edit to add some.
                  </p>
                ) : (
                  fields.map((field) => (
                    <PreviewField key={field.id} field={field} />
                  ))
                )}
                {fields.length > 0 && (
                  <Button
                    disabled
                    className="w-full mt-2"
                    data-ocid="preview-submit-btn"
                  >
                    Submit
                  </Button>
                )}
              </div>
            </div>
          </div>
        ) : (
          /* ── Edit mode ────────────────────────────────────────────────────── */
          <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 items-start">
            {/* Left: fields list */}
            <div className="space-y-3" data-ocid="fields-list">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-foreground">
                  Fields{" "}
                  <span className="text-muted-foreground font-normal">
                    ({fields.length})
                  </span>
                </h2>
              </div>

              {fields.length === 0 ? (
                <div
                  className="flex flex-col items-center justify-center py-16 text-center border-2 border-dashed border-border rounded-xl"
                  data-ocid="fields-empty-state"
                >
                  <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center mb-3">
                    <Plus className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <p className="text-sm font-medium text-foreground mb-1">
                    No fields yet
                  </p>
                  <p className="text-xs text-muted-foreground max-w-xs">
                    Add your first field from the panel on the right.
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {fields.map((field, idx) => (
                    <FieldItem
                      key={field.id}
                      field={field}
                      index={idx}
                      total={fields.length}
                      isSelected={selectedFieldId === field.id}
                      onSelect={() =>
                        setSelectedFieldId(
                          selectedFieldId === field.id ? null : field.id,
                        )
                      }
                      onMoveUp={() => moveField(idx, "up")}
                      onMoveDown={() => moveField(idx, "down")}
                      onDelete={() => deleteField(field.id)}
                    />
                  ))}
                </div>
              )}

              {/* Field editor (inline on mobile) */}
              {selectedField && (
                <div className="lg:hidden mt-4">
                  <FieldEditor
                    field={selectedField}
                    onChange={updateField}
                    onClose={() => setSelectedFieldId(null)}
                  />
                </div>
              )}
            </div>

            {/* Right: add panel + field editor */}
            <div className="space-y-4" data-ocid="right-panel">
              {/* Field editor (desktop) */}
              {selectedField && (
                <div className="hidden lg:block">
                  <FieldEditor
                    field={selectedField}
                    onChange={updateField}
                    onClose={() => setSelectedFieldId(null)}
                  />
                </div>
              )}

              {/* Add field panel */}
              <div className="bg-card border border-border rounded-xl p-4">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                  Add field
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {FIELD_TYPES.map(({ name, label }) => (
                    <AddFieldButton
                      key={name}
                      typeName={name}
                      label={label}
                      onClick={() => addField(name)}
                    />
                  ))}
                </div>
              </div>

              {/* Share box (if published) */}
              {isPublished && currentFormId && (
                <div
                  className="bg-accent/10 border border-accent/20 rounded-xl p-4"
                  data-ocid="share-box"
                >
                  <p className="text-xs font-semibold text-accent mb-2">
                    Share link
                  </p>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 text-xs text-foreground bg-background border border-border rounded-md px-2 py-1.5 truncate font-mono">
                      {`${window.location.origin}/f/${currentFormId}`}
                    </code>
                    <button
                      type="button"
                      onClick={copyShareLink}
                      className="w-7 h-7 flex items-center justify-center rounded-md border border-border bg-card hover:bg-muted transition-colors shrink-0"
                      aria-label="Copy link"
                      data-ocid="share-copy-btn"
                    >
                      <Copy className="w-3.5 h-3.5 text-muted-foreground" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
