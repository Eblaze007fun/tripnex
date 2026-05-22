import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { FormSummary } from "@/types";
import { getStatusName } from "@/types";
import {
  BarChart2,
  Copy,
  Edit2,
  Eye,
  MoreHorizontal,
  Trash2,
} from "lucide-react";

interface FormCardProps {
  form: FormSummary;
  onEdit: (id: string) => void;
  onViewResponses: (id: string) => void;
  onDelete: (id: string) => void;
  onDuplicate: (id: string) => void;
  onPreview: (id: string) => void;
}

export function FormCard({
  form,
  onEdit,
  onViewResponses,
  onDelete,
  onDuplicate,
  onPreview,
}: FormCardProps) {
  const createdAt = new Date(Number(form.createdAt) / 1_000_000);
  const responseCount = Number(form.responseCount);
  const isPublished = getStatusName(form.status) === "published";

  const timeAgo = (date: Date): string => {
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
    if (seconds < 60) return "just now";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 30) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <Card
      className="group hover:shadow-elevated transition-smooth border-border bg-card cursor-pointer"
      data-ocid="form-card"
    >
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <button
                type="button"
                className="font-display font-semibold text-foreground text-base truncate hover:underline text-left"
                onClick={() => onEdit(form.id)}
              >
                {form.title}
              </button>
              <StatusBadge status={form.status} />
            </div>
            {form.description && (
              <p className="text-muted-foreground text-sm line-clamp-1">
                {form.description}
              </p>
            )}
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-smooth shrink-0"
                data-ocid="form-card-menu"
              >
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44">
              <DropdownMenuItem
                onClick={() => onEdit(form.id)}
                data-ocid="form-card-edit"
              >
                <Edit2 className="w-4 h-4 mr-2" />
                Edit
              </DropdownMenuItem>
              {isPublished && (
                <DropdownMenuItem
                  onClick={() => onPreview(form.id)}
                  data-ocid="form-card-preview"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Preview
                </DropdownMenuItem>
              )}
              <DropdownMenuItem
                onClick={() => onViewResponses(form.id)}
                data-ocid="form-card-responses"
              >
                <BarChart2 className="w-4 h-4 mr-2" />
                Responses
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onDuplicate(form.id)}
                data-ocid="form-card-duplicate"
              >
                <Copy className="w-4 h-4 mr-2" />
                Duplicate
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => onDelete(form.id)}
                className="text-destructive focus:text-destructive"
                data-ocid="form-card-delete"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex items-center justify-between mt-4 pt-3 border-t border-border">
          <button
            type="button"
            onClick={() => onViewResponses(form.id)}
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
            data-ocid="form-card-response-count"
          >
            <BarChart2 className="w-3.5 h-3.5" />
            <span>
              {responseCount} {responseCount === 1 ? "Response" : "Responses"}
            </span>
          </button>

          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">
              {timeAgo(createdAt)}
            </span>
            <Button
              size="sm"
              variant="outline"
              className="h-7 px-2.5 text-xs"
              onClick={() => onEdit(form.id)}
              data-ocid="form-card-edit-btn"
            >
              <Edit2 className="w-3 h-3 mr-1" />
              Edit
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
