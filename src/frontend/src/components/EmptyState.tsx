import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center py-16 px-6",
        className,
      )}
      data-ocid="empty-state"
    >
      <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center mb-4">
        <Icon className="w-7 h-7 text-muted-foreground" />
      </div>
      <h3 className="font-display font-semibold text-foreground text-lg mb-2">
        {title}
      </h3>
      <p className="text-muted-foreground text-sm max-w-xs mb-6">
        {description}
      </p>
      {action && (
        <Button onClick={action.onClick} data-ocid="empty-state-cta">
          {action.label}
        </Button>
      )}
    </div>
  );
}
