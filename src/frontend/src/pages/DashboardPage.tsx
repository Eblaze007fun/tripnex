import { EmptyState } from "@/components/EmptyState";
import { FormCard } from "@/components/FormCard";
import { Layout } from "@/components/Layout";
import { PageLoader } from "@/components/LoadingSpinner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/useAuth";
import {
  useCreateForm,
  useDeleteForm,
  useDuplicateForm,
  useListForms,
} from "@/hooks/useQueries";
import type { FormSummary } from "@/types";
import { getStatusName } from "@/types";
import { useRouter } from "@tanstack/react-router";
import { LayoutList, Plus, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

// ── Card skeleton ─────────────────────────────────────────────────────────────
function FormCardSkeleton() {
  return (
    <div className="bg-card rounded-xl border border-border p-5 space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-3 w-full" />
        </div>
        <Skeleton className="h-8 w-8 rounded-md shrink-0" />
      </div>
      <div className="flex items-center justify-between pt-3 border-t border-border">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-7 w-14" />
      </div>
    </div>
  );
}

// ── Status filter tab ────────────────────────────────────────────────────────
type FilterTab = "all" | "draft" | "published";

function FilterTabs({
  value,
  onChange,
  counts,
}: {
  value: FilterTab;
  onChange: (v: FilterTab) => void;
  counts: Record<FilterTab, number>;
}) {
  const tabs: FilterTab[] = ["all", "draft", "published"];
  return (
    <div
      className="flex items-center gap-1 bg-muted/60 rounded-lg p-1"
      data-ocid="filter-tabs"
    >
      {tabs.map((tab) => (
        <button
          key={tab}
          type="button"
          onClick={() => onChange(tab)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium capitalize transition-colors ${
            value === tab
              ? "bg-card shadow-subtle text-foreground"
              : "text-muted-foreground hover:text-foreground"
          }`}
          data-ocid={`filter-tab-${tab}`}
        >
          {tab}
          <Badge
            variant={value === tab ? "default" : "secondary"}
            className="h-4 min-w-[1rem] px-1 text-[10px] font-semibold"
          >
            {counts[tab]}
          </Badge>
        </button>
      ))}
    </div>
  );
}

// ── Dashboard ─────────────────────────────────────────────────────────────────
export default function DashboardPage() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const router = useRouter();

  // Guards
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      void router.navigate({ to: "/" });
    }
  }, [authLoading, isAuthenticated, router]);

  const { data: forms = [], isLoading, error } = useListForms();
  const createForm = useCreateForm();
  const deleteForm = useDeleteForm();
  const duplicateForm = useDuplicateForm();

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterTab>("all");
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  // Derived counts
  const counts = useMemo<Record<FilterTab, number>>(
    () => ({
      all: forms.length,
      draft: forms.filter(
        (f: FormSummary) => getStatusName(f.status) === "draft",
      ).length,
      published: forms.filter(
        (f: FormSummary) => getStatusName(f.status) === "published",
      ).length,
    }),
    [forms],
  );

  // Filtered + searched list
  const visible = useMemo(() => {
    let list = forms as FormSummary[];
    if (filter !== "all") {
      list = list.filter((f) => getStatusName(f.status) === filter);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (f) =>
          f.title.toLowerCase().includes(q) ||
          f.description.toLowerCase().includes(q),
      );
    }
    return list;
  }, [forms, filter, search]);

  async function handleNewForm() {
    try {
      const form = await createForm.mutateAsync({
        title: "Untitled form",
        description: "",
        fields: [],
      });
      void router.navigate({
        to: "/forms/$formId/edit",
        params: { formId: form.id },
      });
    } catch {
      toast.error("Failed to create form");
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    try {
      await deleteForm.mutateAsync(deleteTarget);
      toast.success("Form deleted");
    } catch {
      toast.error("Failed to delete form");
    } finally {
      setDeleteTarget(null);
    }
  }

  async function handleDuplicate(id: string) {
    try {
      await duplicateForm.mutateAsync(id);
      toast.success("Form duplicated");
    } catch {
      toast.error("Failed to duplicate form");
    }
  }

  if (authLoading) return <PageLoader />;

  return (
    <Layout>
      {/* Page header */}
      <div className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="font-display font-bold text-foreground text-2xl tracking-tight mb-1">
                My Forms
              </h1>
              <p className="text-muted-foreground text-sm">
                {counts.all === 0
                  ? "Create your first form to get started"
                  : `${counts.all} form${counts.all === 1 ? "" : "s"} — ${counts.published} published`}
              </p>
            </div>
            <Button
              onClick={handleNewForm}
              disabled={createForm.isPending}
              className="gap-2 shrink-0"
              data-ocid="new-form-btn"
            >
              <Plus className="w-4 h-4" />
              {createForm.isPending ? "Creating…" : "New Form"}
            </Button>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-background border-b border-border/50 sticky top-14 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <div className="relative flex-1 max-w-xs w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            <Input
              placeholder="Search forms…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-9"
              data-ocid="search-input"
            />
          </div>
          <FilterTabs value={filter} onChange={setFilter} counts={counts} />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          {/* Error state */}
          {error && (
            <div className="rounded-xl bg-destructive/8 border border-destructive/20 p-4 text-sm text-destructive mb-6">
              Failed to load forms. Please refresh the page.
            </div>
          )}

          {/* Loading skeletons */}
          {isLoading && (
            <div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
              data-ocid="forms-loading"
            >
              {["s1", "s2", "s3", "s4", "s5", "s6"].map((k) => (
                <FormCardSkeleton key={k} />
              ))}
            </div>
          )}

          {/* Empty state — no forms at all */}
          {!isLoading && counts.all === 0 && (
            <EmptyState
              icon={LayoutList}
              title="No forms yet"
              description="Create your first form in minutes. Add fields for names, emails, ticket types, and more."
              action={{
                label: "Create your first form",
                onClick: handleNewForm,
              }}
              className="py-24"
            />
          )}

          {/* Empty filtered state */}
          {!isLoading && counts.all > 0 && visible.length === 0 && (
            <EmptyState
              icon={Search}
              title="No forms found"
              description={
                search
                  ? `No forms match "${search}". Try a different search term.`
                  : `You have no ${filter} forms yet.`
              }
              className="py-16"
            />
          )}

          {/* Forms grid */}
          {!isLoading && visible.length > 0 && (
            <div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
              data-ocid="forms-grid"
            >
              {visible.map((form) => (
                <FormCard
                  key={form.id}
                  form={form}
                  onEdit={(id) =>
                    void router.navigate({
                      to: "/forms/$formId/edit",
                      params: { formId: id },
                    })
                  }
                  onViewResponses={(id) =>
                    void router.navigate({
                      to: "/forms/$formId/responses",
                      params: { formId: id },
                    })
                  }
                  onDelete={(id) => setDeleteTarget(id)}
                  onDuplicate={handleDuplicate}
                  onPreview={(id) => window.open(`/f/${id}`, "_blank")}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Delete confirmation dialog */}
      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete form?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this form and all its responses. This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-ocid="delete-cancel">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              data-ocid="delete-confirm"
            >
              {deleteForm.isPending ? "Deleting…" : "Delete form"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Layout>
  );
}
