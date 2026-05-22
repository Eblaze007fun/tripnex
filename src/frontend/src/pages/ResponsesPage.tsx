import { EmptyState } from "@/components/EmptyState";
import { Layout } from "@/components/Layout";
import { PageLoader } from "@/components/LoadingSpinner";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useBackend } from "@/hooks/useBackend";
import { useGetForm, useListResponses } from "@/hooks/useQueries";
import type { FieldAnswer, FormField, FormResponse } from "@/types";
import { useNavigate, useParams } from "@tanstack/react-router";
import { ArrowLeft, Download, Inbox } from "lucide-react";
import { useCallback } from "react";

// ── Helpers ──────────────────────────────────────────────────────────────────

function formatTimestamp(ts: bigint): string {
  // Timestamps are nanoseconds on ICP
  const ms = Number(ts / 1_000_000n);
  const d = new Date(ms);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getAnswerValue(answers: FieldAnswer[], fieldId: string): string {
  return answers.find((a) => a.fieldId === fieldId)?.value ?? "—";
}

// ── Skeleton rows ─────────────────────────────────────────────────────────────
function SkeletonRows({ cols }: { cols: number }) {
  const rowCount = cols + 1;
  return (
    <>
      {["r0", "r1", "r2", "r3", "r4"].map((rowKey) => (
        <TableRow key={rowKey}>
          {Array.from({ length: rowCount }, (_, j) => `c${j}`).map(
            (cellKey) => (
              <TableCell key={cellKey}>
                <Skeleton className="h-4 w-full" />
              </TableCell>
            ),
          )}
        </TableRow>
      ))}
    </>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function ResponsesPage() {
  const { formId } = useParams({ from: "/forms/$formId/responses" });
  const navigate = useNavigate();
  const { backend } = useBackend();

  const { data: form, isLoading: formLoading } = useGetForm(formId);
  const { data: responses = [], isLoading: responsesLoading } =
    useListResponses(formId);

  const isLoading = formLoading || responsesLoading;
  const fields: FormField[] = form?.fields ?? [];

  // ── CSV download ──────────────────────────────────────────────────────────
  const handleDownloadCsv = useCallback(async () => {
    if (!backend) return;
    try {
      const csv = await (
        backend as unknown as {
          exportResponsesCsv: (id: string) => Promise<string>;
        }
      ).exportResponsesCsv(formId);

      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      const title = form?.title ?? "responses";
      a.href = url;
      a.download = `${title.replace(/\s+/g, "-").toLowerCase()}-responses.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("CSV export failed", err);
    }
  }, [backend, formId, form?.title]);

  // ── Auth loading ──────────────────────────────────────────────────────────
  if (!backend && !formLoading) return <PageLoader />;

  return (
    <Layout>
      <div className="flex-1 bg-background">
        {/* Page header */}
        <div className="bg-card border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5 flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <Button
                variant="ghost"
                size="icon"
                className="shrink-0 -ml-1"
                onClick={() => navigate({ to: "/dashboard" })}
                aria-label="Back to dashboard"
                data-ocid="back-btn"
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <div className="min-w-0">
                {formLoading ? (
                  <Skeleton className="h-6 w-48" />
                ) : (
                  <h1
                    className="font-display font-semibold text-foreground text-xl truncate"
                    title={form?.title}
                    data-ocid="page-title"
                  >
                    {form?.title ?? "Responses"}
                  </h1>
                )}
                <p className="text-xs text-muted-foreground mt-0.5">
                  {responsesLoading
                    ? "Loading responses…"
                    : `${responses.length} response${responses.length !== 1 ? "s" : ""}`}
                </p>
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              className="shrink-0 gap-2"
              onClick={handleDownloadCsv}
              disabled={responses.length === 0 || isLoading}
              data-ocid="download-csv-btn"
            >
              <Download className="w-4 h-4" />
              Download CSV
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          {isLoading ? (
            <div className="rounded-xl border border-border bg-card overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/40">
                    <TableHead>
                      <Skeleton className="h-4 w-24" />
                    </TableHead>
                    {["col-a", "col-b", "col-c"].map((k) => (
                      <TableHead key={k}>
                        <Skeleton className="h-4 w-20" />
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <SkeletonRows cols={3} />
                </TableBody>
              </Table>
            </div>
          ) : responses.length === 0 ? (
            <div className="rounded-xl border border-border bg-card">
              <EmptyState
                icon={Inbox}
                title="No responses yet"
                description="Responses will appear here once people start submitting your form. Share your form link to start collecting."
                action={{
                  label: "Back to dashboard",
                  onClick: () => navigate({ to: "/dashboard" }),
                }}
              />
            </div>
          ) : (
            <div
              className="rounded-xl border border-border bg-card overflow-hidden"
              data-ocid="responses-table"
            >
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/40 hover:bg-muted/40">
                      <TableHead className="font-display font-semibold text-foreground text-xs uppercase tracking-wide whitespace-nowrap min-w-[160px]">
                        Submitted At
                      </TableHead>
                      {fields.map((field) => (
                        <TableHead
                          key={field.id}
                          className="font-display font-semibold text-foreground text-xs uppercase tracking-wide whitespace-nowrap min-w-[140px]"
                        >
                          {field.fieldLabel}
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {responses.map((response: FormResponse) => (
                      <TableRow
                        key={response.id}
                        className="hover:bg-muted/20 transition-colors"
                        data-ocid="response-row"
                      >
                        <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                          {formatTimestamp(response.submittedAt)}
                        </TableCell>
                        {fields.map((field) => (
                          <TableCell
                            key={field.id}
                            className="text-sm text-foreground max-w-[240px] truncate"
                          >
                            {getAnswerValue(response.answers, field.id)}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
