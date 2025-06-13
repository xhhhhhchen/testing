// Button.css.ts
import { recipe } from "@vanilla-extract/recipes";

export const buttonStyles = recipe({
  base: "transition-colors",
  variants: {
    variant: {
      default: "bg-secondary hover:bg-secondary-hover",
      ghost: "hover:bg-gray-100",
      dark: "bg-secondary-dark hover:bg-secondary-dark-hover text-secondary",
    },
    size: {
      default: "rounded p-2",
      icon: "rounded-full w-10 h-10 flex items-center justify-center p-2.5",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
});