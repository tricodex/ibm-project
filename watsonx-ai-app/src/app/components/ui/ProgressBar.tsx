import * as React from "react"
import { cn } from "@/lib/utils"

interface ProgressBarProps extends React.HTMLAttributes<HTMLDivElement> {
  progress: number
  max?: number
  showPercentage?: boolean
}

const ProgressBar = React.forwardRef<HTMLDivElement, ProgressBarProps>(
  ({ className, progress, max = 100, showPercentage = false, ...props }, ref) => {
    const percentage = Math.round((progress / max) * 100)

    return (
      <div className="space-y-2">
        <div
          ref={ref}
          className={cn("h-2 w-full overflow-hidden rounded-full bg-secondary", className)}
          {...props}
        >
          <div
            className="h-full bg-primary transition-all"
            style={{ width: `${percentage}%` }}
          />
        </div>
        {showPercentage && (
          <div className="text-sm text-muted-foreground text-right">
            {percentage}%
          </div>
        )}
      </div>
    )
  }
)

ProgressBar.displayName = "ProgressBar"

export { ProgressBar }
