
import React from "react";
import { cn } from "@/lib/utils";
import { LoaderCircle } from "lucide-react";

interface SpinnerProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function Spinner({ className, size = "md" }: SpinnerProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8"
  };

  return (
    <LoaderCircle 
      className={cn("animate-spin", sizeClasses[size], className)} 
    />
  );
}
