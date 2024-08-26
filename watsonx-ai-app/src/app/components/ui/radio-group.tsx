// src/components/ui/radio-group.tsx

import * as React from "react"
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group"
import { Circle } from "lucide-react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

// Define variant styles for the radio group items using class-variance-authority (cva)
const radioGroupVariants = cva(
  "aspect-square h-4 w-4 rounded-full border border-primary text-primary ring-offset-background focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      size: {
        default: "h-4 w-4",
        sm: "h-3 w-3",
        lg: "h-5 w-5",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
)

// Define the props for the RadioGroup component, extending from Radix's RadioGroupPrimitive.Root
export interface RadioGroupProps
  extends React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root> {}

// Forward ref for the RadioGroup component and correctly use the React.ElementRef type
const RadioGroup = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Root>,
  RadioGroupProps
>(({ className, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Root
      className={cn("grid gap-2", className)}
      {...props}
      ref={ref}
    />
  )
})

// Set displayName for the RadioGroup component to support better debugging in React DevTools
RadioGroup.displayName = "RadioGroup"

// Define the props for the RadioGroupItem component, extending from Radix's RadioGroupPrimitive.Item
export interface RadioGroupItemProps
  extends React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>,
    VariantProps<typeof radioGroupVariants> {}

// Forward ref for the RadioGroupItem component and correctly use the React.ElementRef type
const RadioGroupItem = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  RadioGroupItemProps
>(({ className, size, children, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Item
      ref={ref}
      className={cn(radioGroupVariants({ size, className }))}
      {...props}
    >
      {/* Indicator shows the selected state of the radio button */}
      <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
        <Circle className="h-2.5 w-2.5 fill-current text-current" />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  )
})

// Set displayName for the RadioGroupItem component to support better debugging in React DevTools
RadioGroupItem.displayName = "RadioGroupItem"

// Export the RadioGroup and RadioGroupItem components for use in other parts of the application
export { RadioGroup, RadioGroupItem }
