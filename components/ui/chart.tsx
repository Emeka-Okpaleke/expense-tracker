"use client"

import * as React from "react"

const Chart = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => {
  return <div className={className} ref={ref} {...props} />
})
Chart.displayName = "Chart"

const ChartContainer = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & { config?: any }>(
  ({ className, children, config, ...props }, ref) => {
    // Create CSS variables for chart colors
    const style = React.useMemo(() => {
      if (!config) return {}

      return Object.entries(config).reduce((acc: Record<string, string>, [key, value]: [string, any]) => {
        if (value.color) {
          acc[`--color-${key}`] = value.color
        }
        return acc
      }, {})
    }, [config])

    return (
      <div className={className} ref={ref} style={style} {...props}>
        {children}
      </div>
    )
  },
)
ChartContainer.displayName = "ChartContainer"

// Remove the problematic TooltipProps interface
const ChartTooltip = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => {
    return (
      <div className={className} ref={ref} {...props}>
        {children}
      </div>
    )
  },
)
ChartTooltip.displayName = "ChartTooltip"

interface ChartTooltipContentProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: string
  value?: string | number
}

const ChartTooltipContent = React.forwardRef<HTMLDivElement, ChartTooltipContentProps>(
  ({ className, label, value, ...props }, ref) => {
    return (
      <div className={className} ref={ref} {...props}>
        {label && <div className="font-medium">{label}</div>}
        {value && <div>{value}</div>}
      </div>
    )
  },
)
ChartTooltipContent.displayName = "ChartTooltipContent"

const ChartLegend = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return <div className={className} ref={ref} {...props} />
  },
)
ChartLegend.displayName = "ChartLegend"

interface ChartLegendItemProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string
  color: string
}

const ChartLegendItem = React.forwardRef<HTMLDivElement, ChartLegendItemProps>(
  ({ className, name, color, ...props }, ref) => {
    return (
      <div className="flex items-center space-x-2" ref={ref} {...props}>
        <div className="h-2 w-2 rounded-full" style={{ backgroundColor: color }} />
        <span>{name}</span>
      </div>
    )
  },
)
ChartLegendItem.displayName = "ChartLegendItem"

export { Chart, ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendItem }

