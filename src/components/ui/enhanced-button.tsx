import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-white shadow hover:bg-primary/90",
        destructive: "bg-destructive text-white shadow-sm hover:bg-destructive/90",
        outline: "border border-input bg-background/50 backdrop-blur text-foreground shadow-sm hover:bg-accent/20 hover:text-foreground",
        secondary: "bg-secondary text-white shadow-sm hover:bg-secondary/80",
        ghost: "text-foreground hover:bg-accent/20 hover:text-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        hero: "bg-gradient-primary text-white shadow-primary hover:shadow-glow transform hover:scale-105 transition-all duration-300 font-semibold",
        accent: "bg-gradient-accent text-white shadow-accent hover:shadow-glow transform hover:scale-105",
        pagejet: "bg-gradient-hero text-white shadow-glow hover:shadow-primary transform hover:scale-105 font-semibold",
        mobile: "bg-accent/10 backdrop-blur border border-accent/20 text-foreground hover:bg-accent/20 hover:text-foreground shadow-sm",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-lg px-8",
        xl: "h-12 rounded-lg px-10 text-base",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }