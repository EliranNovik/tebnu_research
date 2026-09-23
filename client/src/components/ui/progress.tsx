import * as React from "react"
import { cn } from "cn"
import { Progress as ProgressPrimitive } from "radix-ui"

function Progress({
  className,
  value,
  rtl = false,
  ...props
}: React.ComponentProps<typeof ProgressPrimitive.Root> & { rtl?: boolean }) {
  const offset = 100 - (value || 0);

  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      className={cn(
        "relative h-2 w-full overflow-hidden rounded-full bg-primary/20",
        className
      )}
      {...props}
    >
      <ProgressPrimitive.Indicator
        data-slot="progress-indicator"
        className="h-full w-full flex-1 bg-primary transition-all"
        style={{ transform: rtl ? `translateX(${offset}%)` : `translateX(-${offset}%)` }}
      />
    </ProgressPrimitive.Root>
  )
}

export { Progress }
