"use client";

import React from "react";
import { Loader2 } from "lucide-react";
import { VariantProps } from "class-variance-authority";
import { Button, buttonVariants } from "../ui/button";
import { cn } from "@/lib/utils";

interface LoadingButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
}

export const LoadingButton = React.forwardRef<
  HTMLButtonElement,
  LoadingButtonProps
>(
  (
    {
      isLoading = false,
      children,
      variant,
      size,
      disabled,
      className,
      ...props
    },
    ref
  ) => {
    return (
      <Button
        ref={ref}
        variant={variant}
        size={size}
        disabled={isLoading || disabled}
        className={cn(buttonVariants({ variant, size }), className)}
        {...props}
      >
        {isLoading && <Loader2 className="animate-spin h-6 w-6 mr-2" />}
        {children}
      </Button>
    );
  }
);

LoadingButton.displayName = "LoadingButton";
