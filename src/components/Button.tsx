import { type ComponentProps } from "react";
import { twMerge } from "tailwind-merge";

type ButtonProps = ComponentProps<"button"> & {
  variant?: "default" | "ghost" | "dark";
  size?: "default" | "icon";
};

export function Button({ 
  variant = "default", 
  size = "default", 
   
  ...props 
}: ButtonProps) {
  const base = "transition-colors";
  
  const variantClasses = {
    default: "bg-secondary hover:bg-secondary-hover",
    ghost: "hover:bg-gray-100",
    dark: "bg-secondary-dark hover:bg-secondary-dark-hover text-secondary",
  };

  const sizeClasses = {
    default: "rounded p-2",
    icon: "rounded-full w-10 h-10 flex items-center justify-center p-2.5",
  };

  return (
    <button
      {...props}
      className={twMerge(
        base, 
        variantClasses[variant], 
        sizeClasses[size], 
        
      )}
    />
  );
}