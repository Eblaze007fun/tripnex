import { cn } from "@/lib/utils";
import type { FieldTypeName } from "@/types";
import {
  AlignJustify,
  AlignLeft,
  AtSign,
  CheckSquare,
  ChevronDown,
  Hash,
  type LucideProps,
} from "lucide-react";

interface FieldTypeIconProps extends LucideProps {
  type: FieldTypeName;
}

const iconMap: Record<FieldTypeName, React.ElementType> = {
  text: AlignLeft,
  email: AtSign,
  number: Hash,
  dropdown: ChevronDown,
  checkbox: CheckSquare,
  textarea: AlignJustify,
};

export function FieldTypeIcon({
  type,
  className,
  ...props
}: FieldTypeIconProps) {
  const Icon = iconMap[type];
  return <Icon className={cn("w-4 h-4", className)} {...props} />;
}
