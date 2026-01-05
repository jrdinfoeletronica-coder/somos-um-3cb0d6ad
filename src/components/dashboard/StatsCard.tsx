import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  variant?: "default" | "gold" | "navy";
}

export function StatsCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  variant = "default",
}: StatsCardProps) {
  return (
    <div
      className={cn(
        "card-church p-6 group",
        variant === "gold" && "bg-gradient-to-br from-accent/10 to-accent/5 border-accent/20",
        variant === "navy" && "bg-gradient-to-br from-navy/5 to-navy/10 border-navy/10"
      )}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-3">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <div className="space-y-1">
            <p className="text-3xl font-display font-bold text-foreground">
              {value}
            </p>
            {subtitle && (
              <p className="text-sm text-muted-foreground">{subtitle}</p>
            )}
            {trend && (
              <p
                className={cn(
                  "text-sm font-medium",
                  trend.isPositive ? "text-green-600" : "text-destructive"
                )}
              >
                {trend.isPositive ? "+" : "-"}{Math.abs(trend.value)}%
                <span className="text-muted-foreground font-normal ml-1">
                  vs mês anterior
                </span>
              </p>
            )}
          </div>
        </div>
        
        <div
          className={cn(
            "p-3 rounded-xl transition-all duration-300 group-hover:scale-110",
            variant === "gold"
              ? "bg-accent/20 text-accent"
              : variant === "navy"
              ? "bg-navy/10 text-navy"
              : "bg-secondary text-muted-foreground"
          )}
        >
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
}
