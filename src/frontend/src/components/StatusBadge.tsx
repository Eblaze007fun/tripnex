import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { type FormStatus, getStatusName } from "@/types";

interface StatusBadgeProps {
  status: FormStatus;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const name = getStatusName(status);

  return (
    <Badge
      variant="outline"
      className={cn(
        "text-xs font-medium px-2.5 py-0.5 rounded-full border",
        name === "published"
          ? "bg-accent/15 text-accent border-accent/30"
          : "bg-muted text-muted-foreground border-border",
        className,
      )}
      data-ocid="status-badge"
    >
      {name === "published" ? "Published" : "Draft"}
    </Badge>
  );
}
