import React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  colorClassName: string;
  to?: string;
  className?: string;
}

export function StatCard({
  title,
  value,
  icon: Icon,
  description,
  trend,
  colorClassName,
  to = "#",
  className,
}: StatCardProps) {
  const content = (
    <div
      className={cn(
        "group relative overflow-hidden bg-card rounded-xl border border-border p-2 sm:p-4 py-1.5 sm:py-3 shadow-sm transition-all hover:shadow-md",
        "flex flex-col justify-between h-full",
        className
      )}
    >
      {/* Colored Edge */}
      <div className={cn("absolute top-0 left-0 w-1 h-full", colorClassName)} />
      
      <div className="flex items-start justify-between">
        <div className="overflow-hidden pr-1">
          <p className="text-[10px] sm:text-sm font-medium text-muted-foreground truncate">{title}</p>
          <h3 className="text-base sm:text-2xl font-bold tracking-tight mt-0.5 sm:mt-1 text-foreground truncate">
            {value}
          </h3>
        </div>
        <div className={cn("hidden sm:flex p-1.5 sm:p-2 rounded-lg bg-muted", "group-hover:scale-110 transition-transform")}>
          <Icon className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
        </div>
      </div>

      {(description || trend) && (
        <div className="mt-1 sm:mt-3 flex flex-wrap items-center text-[10px] sm:text-sm">
          {trend && (
            <span
              className={cn(
                "font-medium mr-1 sm:mr-2",
                trend.isPositive ? "text-emerald-600" : "text-red-600"
              )}
            >
              {trend.isPositive ? "+" : "-"}{Math.abs(trend.value)}%
            </span>
          )}
          {description && (
            <span className="text-muted-foreground truncate">{description}</span>
          )}
        </div>
      )}
    </div>
  );

  if (to === "#") {
    return <div className="cursor-default">{content}</div>;
  }

  return (
    <Link to={to} className="block outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-xl">
      {content}
    </Link>
  );
}
